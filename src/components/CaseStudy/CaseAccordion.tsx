"use client";

import { useLenis } from "lenis/react";
import { useId, useRef, useState, type ReactNode } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import styles from "./CaseAccordion.module.css";

export type CaseAccordionItem = { label: string; content: ReactNode };

/** Stack of expandable case-study sections (e.g. Discover / Define / Develop / Deliver). */
export default function CaseAccordion({ items, defaultOpen = [0] }: { items: CaseAccordionItem[]; defaultOpen?: number[] }) {
  return (
    <section className={styles.accordion} aria-label="Design process phases">
      {items.map((item, i) => (
        <AccordionSection key={item.label} item={item} defaultOpen={defaultOpen.includes(i)} />
      ))}
    </section>
  );
}

function AccordionSection({ item, defaultOpen }: { item: CaseAccordionItem; defaultOpen: boolean }) {
  const id = useId();
  const header = useRef<HTMLButtonElement>(null);
  const body = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(defaultOpen);
  // Content is mounted while open (and during the closing animation), so its reveals replay on every open.
  const [mounted, setMounted] = useState(defaultOpen);
  const toggled = useRef(false);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = body.current;
      if (!el || !toggled.current) return;
      const duration = prefersReducedMotion() ? 0 : undefined;

      if (open) {
        gsap.fromTo(
          el,
          { height: 0 },
          { height: "auto", duration: duration ?? 0.9, ease: "power3.inOut", onComplete: () => ScrollTrigger.refresh() },
        );
      } else {
        gsap.to(el, {
          height: 0,
          duration: duration ?? 0.7,
          ease: "power3.inOut",
          onComplete: () => {
            setMounted(false);
            ScrollTrigger.refresh();
          },
        });
      }
    },
    { dependencies: [open] },
  );

  const toggle = () => {
    toggled.current = true;
    if (open) {
      // Closing from deep inside the section: bring its header back into view first.
      const top = header.current?.getBoundingClientRect().top ?? 0;
      if (top < 0 && header.current) lenis?.scrollTo(header.current, { offset: -96, duration: 0.7 });
      setOpen(false);
    } else {
      setMounted(true);
      setOpen(true);
    }
  };

  return (
    <div className={styles.section} data-open={open || undefined}>
      <button
        ref={header}
        type="button"
        className={styles.header}
        aria-expanded={open}
        aria-controls={`${id}-body`}
        onClick={toggle}
      >
        <span className={styles.title}>{item.label}</span>
        <span className={styles.icon} aria-hidden="true" />
      </button>

      <div ref={body} id={`${id}-body`} className={styles.body} hidden={!mounted}>
        {mounted && <div className={styles.inner}>{item.content}</div>}
      </div>
    </div>
  );
}
