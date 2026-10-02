"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { projectCategories, projects, type ProjectCategory } from "@/lib/content";
import { Flip, gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import styles from "./WorkGrid.module.css";

type Filter = "All" | ProjectCategory;
const filters: Filter[] = ["All", ...projectCategories];
const previews = projects.filter((project) => project.cover);
const upcoming = projects.filter((project) => !project.cover);
const matches = (categories: ProjectCategory[], filter: Filter) => filter === "All" || categories.includes(filter);

function Arrow() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** An image-led collection with animated category filters and a quieter upcoming list. */
export default function WorkGrid() {
  const root = useRef<HTMLDivElement>(null);
  const flipState = useRef<Flip.FlipState | null>(null);
  const [filter, setFilter] = useState<Filter>("All");
  const [view, setView] = useState<"gallery" | "index">("gallery");
  const { phase } = useIntro();
  const visibleCount = projects.filter((project) => matches(project.categories, filter)).length;
  const hasPreviews = previews.some((project) => matches(project.categories, filter));
  const hasUpcoming = upcoming.some((project) => matches(project.categories, filter));

  useGSAP(
    () => {
      if (phase !== "done") return;
      const q = gsap.utils.selector(root);
      const media = q(`.${styles.media}`);
      if (prefersReducedMotion()) {
        gsap.set(media, { clipPath: "none" });
        return;
      }

      ScrollTrigger.batch(media, {
        start: "top 95%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1, ease: "reveal", stagger: 0.08 });
          gsap.fromTo(
            batch.map((el) => el.firstElementChild),
            { scale: 1.06 },
            { scale: 1, duration: 1.2, ease: "reveal", stagger: 0.08 },
          );
        },
      });
    },
    { dependencies: [phase], scope: root },
  );

  useGSAP(
    () => {
      const state = flipState.current;
      if (!state) {
        ScrollTrigger.refresh();
        return;
      }
      flipState.current = null;
      Flip.from(state, {
        duration: 0.6,
        ease: "power3.inOut",
        absolute: true,
        onEnter: (els) =>
          gsap.fromTo(els, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.4, delay: 0.15, ease: "power3.out" }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.97, duration: 0.2, ease: "power2.in" }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [filter, view], scope: root },
  );

  const choose = (next: Filter) => {
    if (next === filter) return;
    // Filtering can bring a previously off-screen cover into view.
    const media = gsap.utils.toArray<HTMLElement>(`.${styles.media}`, root.current);
    gsap.killTweensOf(media);
    gsap.set(media, { clipPath: "none" });
    if (!prefersReducedMotion()) {
      flipState.current = Flip.getState(gsap.utils.toArray(`.${styles.card}`, root.current));
    }
    setFilter(next);
  };

  const chooseView = (next: "gallery" | "index") => {
    if (next === view) return;
    const media = gsap.utils.toArray<HTMLElement>(`.${styles.media}`, root.current);
    gsap.killTweensOf(media);
    gsap.set(media, { clipPath: "none" });
    if (!prefersReducedMotion()) {
      flipState.current = Flip.getState(gsap.utils.toArray(`.${styles.card}`, root.current));
    }
    setView(next);
  };

  return (
    <div ref={root} className={styles.root}>
      <div className={styles.collectionBar}>
        <div className={styles.filters} role="group" aria-label="Filter projects">
          {filters.map((f) => (
            <button key={f} type="button" className={styles.filter} aria-pressed={f === filter} onClick={() => choose(f)}>
              {f === "All" ? "All work" : f}
              <span className={styles.filterCount} aria-hidden="true">
                {projects.filter((project) => matches(project.categories, f)).length.toString().padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.views} role="group" aria-label="Project layout">
          <button type="button" className={styles.view} aria-pressed={view === "gallery"} onClick={() => chooseView("gallery")}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
              <path d="M0 0h5v5H0zM7 0h5v5H7zM0 7h5v5H0zM7 7h5v5H7z" />
            </svg>
            Gallery
          </button>
          <button type="button" className={styles.view} aria-pressed={view === "index"} onClick={() => chooseView("index")}>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
              <path d="M0 2h12M0 6h12M0 10h12" stroke="currentColor" />
            </svg>
            Index
          </button>
        </div>
        <p className={styles.resultCount} role="status" aria-live="polite" aria-atomic="true">
          {visibleCount.toString().padStart(2, "0")} {visibleCount === 1 ? "project" : "projects"}
        </p>
      </div>

      <div className={styles.grid} data-staggered={filter === "All" && view === "gallery" || undefined} data-view={view} hidden={!hasPreviews}>
        {previews.map((project, index) => {
          const body = (
            <>
              <div className={styles.media} data-reveal-media="">
                <div className={styles.zoom}>
                  <Image
                    src={project.cover!}
                    alt={`${project.title} project preview`}
                    fill
                    sizes={view === "index" ? "(max-width: 760px) 92px, 200px" : "(max-width: 760px) 94vw, (max-width: 1600px) 50vw, 760px"}
                    loading={index < 2 ? "eager" : "lazy"}
                    className={styles.img}
                  />
                </div>
              </div>
              <div className={styles.caption}>
                <span className={styles.index} aria-hidden="true">{(index + 1).toString().padStart(2, "0")}</span>
                <div className={styles.details}>
                  <h2 className={styles.title}>{project.title}</h2>
                  <p className={styles.tags}>{project.categories.join(" / ")}</p>
                  {project.summary && <p className={styles.summary}>{project.summary}</p>}
                  <span className={project.href ? styles.action : styles.status}>
                    {project.href ? "View case study" : "Case study coming soon"}
                  </span>
                </div>
                {project.href && <span className={styles.arrow}><Arrow /></span>}
              </div>
            </>
          );
          return (
            <article key={project.title} className={styles.card} data-hidden={!matches(project.categories, filter) || undefined}>
              {project.href ? (
                <Link href={project.href} className={styles.link}>{body}</Link>
              ) : (
                <div className={styles.link}>{body}</div>
              )}
            </article>
          );
        })}
      </div>

      <section className={styles.upcoming} hidden={!hasUpcoming} aria-labelledby="upcoming-heading">
        <div className={styles.upcomingIntro}>
          <h2 id="upcoming-heading">More on the way</h2>
          <p>A little more from the archive. Details coming soon.</p>
        </div>
        <div className={styles.upcomingList}>
          {upcoming.map((project) => (
            <article key={project.title} className={`${styles.card} ${styles.upcomingCard}`} data-hidden={!matches(project.categories, filter) || undefined}>
              <div>
                <p className={styles.tags}>{project.categories.join(" / ")}</p>
                <h3 className={styles.title}>{project.title}</h3>
              </div>
              <span className={styles.upcomingStatus}>Coming soon</span>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
