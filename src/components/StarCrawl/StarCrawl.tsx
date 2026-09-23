"use client";

import { useLenis } from "lenis/react";
import { useRef, useState } from "react";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import styles from "./StarCrawl.module.css";

/** Deterministic star field (same on server and client) drawn as box-shadows on one element per layer. */
function starLayer(count: number, seed: number, blur = 0, area = 2600) {
  let s = seed;
  const rand = () => (s = (s * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: count }, () => {
    const alpha = (0.45 + rand() * 0.55).toFixed(2);
    return `${Math.round(rand() * area)}px ${Math.round(rand() * area)}px ${blur}px rgba(255,255,255,${alpha})`;
  }).join(", ");
}

const STAR_LAYERS = [
  { shadow: starLayer(700, 7), size: 1 },
  { shadow: starLayer(220, 13), size: 2 },
  { shadow: starLayer(60, 29, 2), size: 2 },
];

type StarCrawlProps = {
  episode: string;
  title: string;
  paragraphs: string[];
  /** Id of the section to scroll to when the intro is skipped or finished. */
  nextId: string;
};

/**
 * Star Wars style opening: "A long time ago…" card, a receding logo, the 3D text crawl,
 * then the camera tilts down to a planet. Plays on its own; scrolling speeds it up.
 */
export default function StarCrawl({ episode, title, paragraphs, nextId }: StarCrawlProps) {
  const root = useRef<HTMLElement>(null);
  const audio = useRef<HTMLAudioElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  // Timeline callbacks are created once, so they read the sound preference from a ref.
  const soundRef = useRef(false);
  const [finished, setFinished] = useState(false);
  const [isStatic, setIsStatic] = useState(false);
  const { phase } = useIntro();
  const lenis = useLenis();

  const fadeAudio = (volume: number) => {
    const a = audio.current;
    if (!a) return;
    gsap.to(a, {
      volume,
      duration: 0.8,
      onComplete: () => {
        if (volume === 0) a.pause();
      },
    });
  };

  useGSAP(
    () => {
      const el = root.current;
      if (!el || phase !== "done") return;
      const q = gsap.utils.selector(el);

      if (prefersReducedMotion()) {
        el.dataset.static = "";
        setIsStatic(true);
        return;
      }

      const crawl = q(`.${styles.crawl}`)[0] as HTMLElement;
      const plane = q(`.${styles.plane}`)[0] as HTMLElement;

      gsap.set(q(`.${styles.opening}, .${styles.logo}, .${styles.hint}`), { autoAlpha: 0 });

      const tl = gsap.timeline({ onComplete: () => setFinished(true) });
      timeline.current = tl;

      // 1. Stars, then the blue opening card.
      tl.from(q(`.${styles.starLayer}`), { autoAlpha: 0, duration: 1.4, stagger: 0.2, ease: "power1.out" }, 0)
        .to(q(`.${styles.opening}`), { autoAlpha: 1, duration: 1.2, ease: "power1.inOut" }, 0.8)
        .to(q(`.${styles.opening}`), { autoAlpha: 0, duration: 1, ease: "power1.inOut" }, 5);

      // 2. The logo punches in at full size and recedes at constant depth speed (so it shrinks fast, then slowly).
      tl.addLabel("logo", 6.4)
        .set(q(`.${styles.logo}`), { autoAlpha: 1, z: 0 }, "logo")
        .call(() => {
          if (soundRef.current && audio.current?.paused) audio.current.play().catch(() => undefined);
        }, [], "logo")
        .to(q(`.${styles.logo}`), { z: -9000, duration: 11, ease: "none" }, "logo")
        .to(q(`.${styles.logo}`), { autoAlpha: 0, duration: 2, ease: "power1.in" }, "logo+=7");

      // 3. The crawl rides up the tilted plane into the distance.
      const crawlDuration = 75;
      tl.fromTo(
        crawl,
        { y: 0 },
        {
          // Far enough up the plane that the last line has shrunk to a speck at the horizon.
          y: () => -(crawl.offsetHeight + plane.offsetHeight * 4.5),
          duration: crawlDuration,
          ease: "none",
        },
        "logo+=2.2",
      );

      // 4. Tilt down to the planet as the last lines disappear.
      tl.to(q(`.${styles.sky}`), { yPercent: -30, duration: 5, ease: "power2.inOut" }, `logo+=${2.2 + crawlDuration * 0.8}`)
        .to(q(`.${styles.hint}`), { autoAlpha: 1, duration: 1 }, ">-1");

      // Scrolling while the intro is on screen fast-forwards it.
      let boost = 0;
      const tick = () => {
        boost *= 0.92;
        const target = 1 + boost;
        tl.timeScale(gsap.utils.interpolate(tl.timeScale(), target, 0.15));
      };
      gsap.ticker.add(tick);

      ScrollTrigger.create({
        trigger: el,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          boost = Math.max(boost, gsap.utils.clamp(0, 12, Math.abs(self.getVelocity()) / 250));
        },
        onLeave: () => {
          tl.pause();
          fadeAudio(0);
        },
        onEnterBack: () => {
          tl.resume();
          if (soundRef.current) {
            audio.current?.play().catch(() => undefined);
            fadeAudio(0.45);
          }
        },
      });

      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [phase], scope: root },
  );

  const toggleSound = () => {
    const a = audio.current;
    if (!a) return;
    soundRef.current = !soundOn;
    if (soundOn) {
      fadeAudio(0);
      setSoundOn(false);
    } else {
      a.volume = 0;
      a.play().catch(() => undefined);
      fadeAudio(0.45);
      setSoundOn(true);
    }
  };

  const skip = () => {
    timeline.current?.progress(1);
    const next = document.getElementById(nextId);
    if (next) lenis?.scrollTo(next, { duration: 1.4 });
  };

  const replay = () => {
    const el = root.current;
    const tl = timeline.current;
    if (!el || !tl) return;
    setFinished(false);
    // Back to the top of the intro first if we've scrolled into it, then run it from the beginning.
    if (Math.abs(el.getBoundingClientRect().top) > 4 && lenis) {
      lenis.scrollTo(el, { duration: 1.2, onComplete: () => tl.restart() });
    } else {
      tl.restart();
    }
  };

  return (
    <section ref={root} className={styles.crawlSection} aria-label="Intro">
      <div className={styles.stage}>
        <div className={styles.sky} aria-hidden="true">
          {STAR_LAYERS.map((layer, i) => (
            <span
              key={i}
              className={styles.starLayer}
              style={{ boxShadow: layer.shadow, width: layer.size, height: layer.size }}
            />
          ))}
          <span className={styles.planet} />
        </div>

        <p className={styles.opening}>
          A long time ago, in a portfolio far,
          <br />
          far away….
        </p>

        <div className={styles.logoSpace} aria-hidden="true">
          <div className={styles.logo}>
            <span>About</span>
            <span>Diego</span>
          </div>
        </div>

        <div className={styles.viewport}>
          <div className={styles.plane}>
            <div className={styles.crawl}>
              <p className={styles.episode}>{episode}</p>
              <h2 className={styles.crawlTitle}>{title}</h2>
              {paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.control} onClick={toggleSound} aria-pressed={soundOn}>
            <span className={styles.bars} data-on={soundOn || undefined} aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            {soundOn ? "Sound on" : "Sound off"}
          </button>
          {!isStatic &&
            (finished ? (
              <button type="button" className={styles.control} onClick={replay}>
                <span className={styles.replayIcon} aria-hidden="true">
                  ↺
                </span>
                Replay intro
              </button>
            ) : (
              <button type="button" className={styles.control} onClick={skip}>
                Skip intro
              </button>
            ))}
        </div>

        <a href={`#${nextId}`} className={styles.hint}>
          Scroll to meet Diego <span aria-hidden="true">↓</span>
        </a>

        <audio ref={audio} src="/audio/crawl-theme.mp3" preload="none" loop />
      </div>
    </section>
  );
}
