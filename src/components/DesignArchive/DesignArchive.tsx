"use client";

import { useRef } from "react";
import { archiveItems } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import RevealText from "../RevealText";
import styles from "./DesignArchive.module.css";

export default function DesignArchive() {
  const root = useRef<HTMLElement>(null);
  const { phase } = useIntro();

  useGSAP(
    () => {
      if (phase !== "done" || prefersReducedMotion()) return;
      const q = gsap.utils.selector(root);
      const row = q(`.${styles.row}`)[0] as HTMLElement;
      const items = q(`.${styles.item}`);

      // Tiles rise out of their own frame, one after another.
      gsap.fromTo(
        items,
        { clipPath: "inset(100% 0% 0% 0% round 24px)" },
        {
          clipPath: "inset(0% 0% 0% 0% round 24px)",
          duration: 1.4,
          ease: "reveal",
          stagger: 0.08,
          scrollTrigger: { trigger: row, start: "top 85%", once: true },
        },
      );

      // The row drifts sideways as the page scrolls, revealing the overflow.
      const drift = () => window.innerWidth * 0.1;
      gsap.fromTo(
        row,
        { x: drift },
        {
          x: () => -(row.scrollWidth - window.innerWidth) - drift(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    },
    { dependencies: [phase], scope: root },
  );

  return (
    <section ref={root} className={styles.section} aria-label="Design archive">
      <RevealText as="h2" className={styles.heading}>
        Design Archive
      </RevealText>
      <div className={styles.row}>
        {archiveItems.map((height, i) => (
          <div key={i} className={styles.item} style={{ aspectRatio: `294 / ${height}` }} />
        ))}
      </div>
    </section>
  );
}
