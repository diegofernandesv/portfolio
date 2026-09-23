"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { heroImage, heroVideo } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import PillButton from "../PillButton/PillButton";
import RevealText from "../RevealText";
import styles from "./Hero.module.css";
import VideoHotspots from "./VideoHotspots";

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const { phase } = useIntro();

  useEffect(() => {
    if (prefersReducedMotion()) video.current?.pause();
  }, []);

  useGSAP(
    () => {
      if (phase !== "done") return;
      const q = gsap.utils.selector(root);
      const cta = q(`.${styles.cta}`);

      gsap.set(cta, { autoAlpha: 1 });
      if (prefersReducedMotion()) return;

      gsap.from(cta, { y: 24, autoAlpha: 0, duration: 1, ease: "power3.out", delay: 0.45 });

      // Card recedes as you scroll past it.
      const scrollOut = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
      gsap.to(q(`.${styles.card}`), { scale: 0.92, y: 80, ease: "none", scrollTrigger: scrollOut });
      gsap.to(q(`.${styles.content}`), { y: -60, autoAlpha: 0, ease: "none", scrollTrigger: { ...scrollOut, end: "60% top" } });
    },
    { dependencies: [phase], scope: root },
  );

  return (
    <section ref={root} id="top" className={styles.hero}>
      {/* Hidden until the loader's frame, which zooms onto this exact box, hands off. */}
      <div className={styles.card} data-hero-card="" data-hidden={phase === "loading" || undefined}>
        <div className={styles.media}>
          <Image
            src={heroImage}
            alt="Diego's desk setup with monitors glowing in a dark studio"
            fill
            sizes="100vw"
            preload
            className={styles.img}
          />
          {/* The loader syncs its own copy of this video to this element's timeline before handing off. */}
          <video
            ref={video}
            className={styles.video}
            src={heroVideo}
            poster={heroImage}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            data-hero-video=""
          />
        </div>

        <VideoHotspots />

        <div className={styles.content}>
          <RevealText as="h1" trigger="intro" className={styles.title} duration={1.3} stagger={0.12}>
            Digital Product Designer &<br />
            Creative Developer in the making
          </RevealText>
          <div className={styles.cta} data-reveal="">
            <PillButton href="/work">Check my work</PillButton>
          </div>
        </div>
      </div>
    </section>
  );
}
