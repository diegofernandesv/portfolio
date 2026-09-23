"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { site } from "@/lib/content";
import { useIntro } from "../IntroProvider";
import PillButton from "../PillButton/PillButton";
import RevealText from "../RevealText";
import styles from "./About.module.css";

export default function About() {
  const root = useRef<HTMLElement>(null);
  const { phase } = useIntro();

  useGSAP(
    () => {
      if (phase !== "done") return;
      const cta = gsap.utils.selector(root)(`.${styles.cta}`);
      gsap.set(cta, { autoAlpha: 1 });
      if (prefersReducedMotion()) return;

      gsap.from(cta, {
        y: 24,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.3,
        scrollTrigger: { trigger: cta, start: "top 90%", once: true },
      });
    },
    { dependencies: [phase], scope: root },
  );

  return (
    <section ref={root} id="about" className={styles.section}>
      <div className={styles.row}>
        <div className={styles.text}>
          <RevealText as="h2" className={styles.heading}>
            Hello I’m Diego
          </RevealText>
          <RevealText as="p" className={styles.body} delay={0.1} stagger={0.06}>
            A Digital designer focused on UX/UI, AI, and creative development. Based in Aarhus, Denmark, I’m
            currently studying Digital Concept Development and working as a student worker at BESTSELLER, exploring
            how design, technology, and AI can come together to create meaningful digital experiences.
          </RevealText>
        </div>
        <div className={styles.cta} data-reveal="">
          <PillButton href={site.about} tone="dark">
            Learn more about me
          </PillButton>
        </div>
      </div>
    </section>
  );
}
