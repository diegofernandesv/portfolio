"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type PointerEvent } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/lib/content";
import { Flip, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import styles from "./WorkGrid.module.css";

type Filter = "All" | ProjectCategory;

const filters: Filter[] = ["All", ...projectCategories];

/** Filterable project grid: cards re-flow with GSAP Flip, wipe in on scroll, and linked cards get a cursor pill. */
export default function WorkGrid() {
  const root = useRef<HTMLDivElement>(null);
  const pill = useRef<HTMLSpanElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const pillTo = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc } | null>(null);
  const pillShown = useRef(false);
  const [filter, setFilter] = useState<Filter>("All");
  const { phase } = useIntro();

  // Entrance: filters rise in, covers wipe up as they reach the viewport.
  useGSAP(
    () => {
      if (phase !== "done") return;
      const q = gsap.utils.selector(root);
      gsap.set(q(`.${styles.filters}`), { autoAlpha: 1 });

      if (pill.current) {
        gsap.set(pill.current, { xPercent: -50, yPercent: -50, scale: 0.4, autoAlpha: 0 });
        pillTo.current = {
          x: gsap.quickTo(pill.current, "x", { duration: 0.45, ease: "power3.out" }),
          y: gsap.quickTo(pill.current, "y", { duration: 0.45, ease: "power3.out" }),
        };
      }

      const media = q(`.${styles.media}`);
      if (prefersReducedMotion()) {
        gsap.set(media, { clipPath: "none" });
        return;
      }

      gsap.from(q(`.${styles.filter}`), { y: 16, autoAlpha: 0, duration: 0.8, ease: "power3.out", stagger: 0.05, delay: 0.35 });
      ScrollTrigger.batch(media, {
        start: "top 92%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "reveal", stagger: 0.1 });
          gsap.fromTo(
            batch.map((el) => el.firstElementChild),
            { scale: 1.15 },
            { scale: 1, duration: 1.6, ease: "reveal", stagger: 0.1 },
          );
        },
      });
    },
    { dependencies: [phase], scope: root },
  );

  // After a filter change, animate cards from where they were to where they are now.
  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) return;
      flipState.current = null;

      Flip.from(state, {
        duration: 0.7,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.94 }, { autoAlpha: 1, scale: 1, duration: 0.5, delay: 0.2, ease: "power3.out" }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.94, duration: 0.3, ease: "power2.in" }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [filter], scope: root },
  );

  const choose = (next: Filter) => {
    if (next === filter) return;
    if (!prefersReducedMotion()) {
      flipState.current = Flip.getState(gsap.utils.toArray(`.${styles.card}`, root.current));
    }
    setFilter(next);
  };

  // "View … project" pill follows the cursor over cards that have a case study.
  const trackPointer = (e: PointerEvent<HTMLDivElement>) => {
    if (!pill.current || !root.current) return;
    const link = (e.target as Element).closest<HTMLElement>("[data-title]");
    const rect = root.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const show = Boolean(link) && e.type !== "pointerleave";
    if (show && link) {
      const label = `View ${link.dataset.title} project`;
      if (pill.current.firstChild?.textContent !== label) pill.current.firstChild!.textContent = label;
    }
    if (show !== pillShown.current) {
      pillShown.current = show;
      // Appear at the cursor instead of sliding in from the last position.
      if (show) gsap.set(pill.current, { x, y });
      gsap.to(pill.current, {
        scale: show ? 1 : 0.4,
        autoAlpha: show ? 1 : 0,
        duration: show ? 0.4 : 0.25,
        ease: show ? "back.out(2)" : "power2.in",
        overwrite: "auto",
      });
    }
    pillTo.current?.x(x);
    pillTo.current?.y(y);
  };

  return (
    <div ref={root} className={styles.root} onPointerMove={trackPointer} onPointerLeave={trackPointer}>
      <div className={styles.filters} role="toolbar" aria-label="Filter projects" data-reveal="">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            className={styles.filter}
            aria-pressed={f === filter}
            onClick={() => choose(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {projects.map((project) => {
          const hidden = filter !== "All" && !project.categories.includes(filter);
          const body = (
            <>
              <div className={styles.media} data-reveal-media="">
                {project.cover ? (
                  <div className={styles.zoom}>
                    <Image
                      src={project.cover}
                      alt={`${project.title} cover`}
                      fill
                      sizes="(max-width: 760px) 100vw, 50vw"
                      className={styles.img}
                    />
                  </div>
                ) : (
                  <div className={styles.soon}>
                    <span>{project.title}</span>
                    <em>Coming soon</em>
                  </div>
                )}
              </div>
              <div className={styles.meta}>
                <h2 className={styles.title}>{project.title}</h2>
                <span className={styles.tags}>{project.categories.join(", ")}</span>
              </div>
              {project.summary && <p className={styles.summary}>{project.summary}</p>}
              {!project.href && project.cover && <p className={styles.status}>Case study coming soon</p>}
            </>
          );

          return (
            <article key={project.title} className={styles.card} data-hidden={hidden || undefined}>
              {project.href ? (
                <Link href={project.href} className={styles.link} data-title={project.title}>
                  {body}
                </Link>
              ) : (
                <div className={styles.link}>{body}</div>
              )}
            </article>
          );
        })}
      </div>

      <span ref={pill} className={styles.pill} aria-hidden="true">
        <span>View project</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      </span>
    </div>
  );
}
