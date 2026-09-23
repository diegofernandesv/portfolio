"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { caseStudies } from "@/lib/content";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import RevealText from "../RevealText";
import styles from "./CaseStudies.module.css";

export default function CaseStudies() {
  const root = useRef<HTMLElement>(null);
  const { phase } = useIntro();

  useGSAP(
    () => {
      if (phase !== "done" || prefersReducedMotion()) return;
      const media = gsap.utils.selector(root)(`.${styles.media}`);
      const zoomOf = (els: Element[]) => els.map((el) => el.firstElementChild);

      // Images wipe up from the bottom edge while the photo settles from a zoom.
      gsap.set(media, { clipPath: "inset(100% 0% 0% 0%)" });
      gsap.set(zoomOf(media), { scale: 1.3 });

      ScrollTrigger.batch(media, {
        start: "top 85%",
        once: true,
        onEnter: (batch) => {
          gsap.to(batch, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "reveal", stagger: 0.1 });
          gsap.to(zoomOf(batch), { scale: 1, duration: 1.8, ease: "reveal", stagger: 0.1 });
        },
      });
    },
    { dependencies: [phase], scope: root },
  );

  return (
    <section ref={root} id="work" className={styles.section}>
      <div className={styles.head}>
        <RevealText as="h2" className={styles.heading}>
          Case studies
        </RevealText>
        <Link href="/work" className={styles.all}>
          View all work <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className={styles.grid}>
        {caseStudies.map((study, i) => (
          <Link key={study.title} href={study.href} className={styles.card}>
            <div className={styles.media}>
              <div className={styles.zoom}>
                <Image
                  src={study.image}
                  alt={`${study.title} case study`}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 1024px) 50vw, 300px"
                  className={styles.img}
                />
              </div>
            </div>
            <RevealText as="h3" className={styles.title} delay={i * 0.08} start="top 95%">
              {study.title}
            </RevealText>
            <RevealText as="p" className={styles.tags} delay={0.08 + i * 0.08} start="top 95%">
              {study.tags}
            </RevealText>
          </Link>
        ))}
      </div>
    </section>
  );
}
