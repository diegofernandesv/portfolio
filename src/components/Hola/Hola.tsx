"use client";

import Image from "next/image";
import { useRef, type CSSProperties } from "react";
import { Draggable, gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import styles from "./Hola.module.css";

/** The four languages Diego speaks. */
const GREETINGS = [
  { word: "Hola", lang: "Spanish" },
  { word: "Hello", lang: "English" },
  { word: "Olá", lang: "Portuguese" },
  { word: "Hej", lang: "Danish" },
];

type Position = { x: number; y: number; r: number; mx: number; my: number };
export type DeskPhoto = Position & { src: string; alt: string; w: number };
export type DeskSticker = Position & { label: string; tone: "gold" | "ink" | "paper" };

type HolaProps = {
  intro: string;
  photos: DeskPhoto[];
  stickers: DeskSticker[];
};

const place = (p: Position) =>
  ({ "--x": `${p.x}%`, "--y": `${p.y}%`, "--mx": `${p.mx}%`, "--my": `${p.my}%` }) as CSSProperties;

/**
 * "Hola, I'm Diego": a greeting that cycles through Diego's languages, an intro that
 * inks in word by word as you scroll, and a desk of photos and fact stickers you can throw around.
 */
export default function Hola({ intro, photos, stickers }: HolaProps) {
  const root = useRef<HTMLElement>(null);
  const { phase } = useIntro();

  useGSAP(
    () => {
      if (phase !== "done") return;
      const q = gsap.utils.selector(root);
      const reduced = prefersReducedMotion();
      const items = q(`.${styles.item}`) as HTMLElement[];

      items.forEach((el) => gsap.set(el, { rotation: Number(el.dataset.r) }));

      // Greeting: roll through the languages, resizing the slot to each word.
      const slot = q(`.${styles.slot}`)[0] as HTMLElement;
      const words = q(`.${styles.word}`) as HTMLElement[];
      const lang = q(`.${styles.lang}`)[0] as HTMLElement;
      gsap.set(words.slice(1), { yPercent: 110 });
      gsap.set(slot, { width: words[0].offsetWidth });
      gsap.set(q(`.${styles.greetingWrap}`), { autoAlpha: 1 });
      if (reduced) return;
      const roll = gsap.timeline({ repeat: -1, delay: 1.2 });
      GREETINGS.forEach((_, i) => {
        const next = (i + 1) % GREETINGS.length;
        roll
          .to(words[i], { yPercent: -110, duration: 0.7, ease: "power3.inOut" }, "+=1.6")
          // immediateRender off: otherwise the final step (back to "Hola") would hide the first word at build time.
          .fromTo(
            words[next],
            { yPercent: 110 },
            { yPercent: 0, duration: 0.7, ease: "power3.inOut", immediateRender: false },
            "<",
          )
          .to(slot, { width: () => words[next].offsetWidth, duration: 0.7, ease: "power3.inOut" }, "<")
          .call(() => (lang.textContent = GREETINGS[next].lang), [], "<+=0.35");
      });

      // Intro paragraph inks in word by word as it scrolls through the viewport.
      SplitText.create(q(`.${styles.intro}`), {
        type: "words",
        autoSplit: true,
        onSplit: (self) =>
          gsap.fromTo(
            self.words,
            { color: "#d4d4d4" },
            {
              color: "#111111",
              stagger: 0.1,
              ease: "none",
              scrollTrigger: { trigger: self.elements[0], start: "top 75%", end: "bottom 40%", scrub: true },
            },
          ),
      });

      // Photos and stickers get tossed onto the desk…
      gsap.from(items, {
        y: 140,
        scale: 0.6,
        rotation: (i, el: HTMLElement) => Number(el.dataset.r) * 4,
        autoAlpha: 0,
        duration: 1,
        ease: "back.out(1.4)",
        stagger: { each: 0.07, from: "random" },
        scrollTrigger: { trigger: q(`.${styles.desk}`)[0], start: "top 70%", once: true },
      });

      // …and can be thrown around.
      let z = items.length + 10;
      Draggable.create(items, {
        bounds: q(`.${styles.desk}`)[0],
        inertia: true,
        zIndexBoost: false,
        onPress() {
          const el = this.target as HTMLElement;
          el.style.zIndex = String(++z);
          gsap.to(el, { scale: 1.06, rotation: Number(el.dataset.r) / 3, duration: 0.25, ease: "power2.out" });
        },
        onRelease() {
          const el = this.target as HTMLElement;
          gsap.to(el, { scale: 1, rotation: Number(el.dataset.r), duration: 0.6, ease: "elastic.out(1, 0.5)" });
        },
      });
    },
    { dependencies: [phase], scope: root },
  );

  return (
    <section ref={root} id="hola" className={styles.hola}>
      <h2 className={styles.greetingWrap} aria-label="Hola, I’m Diego">
        <span className={styles.greeting} aria-hidden="true">
          <span className={styles.slot}>
            {GREETINGS.map((g) => (
              <span key={g.word} className={styles.word}>
                {g.word}
              </span>
            ))}
          </span>
          , I’m Diego
        </span>
        <span className={styles.langRow} aria-hidden="true">
          <span className={styles.langDot} />
          Saying hi in <span className={styles.lang}>{GREETINGS[0].lang}</span>
        </span>
      </h2>

      <div className={styles.desk}>
        <p className={styles.intro}>{intro}</p>

        <div className={styles.scatter}>
          {photos.map((photo) => (
            <figure
              key={photo.src}
              className={`${styles.item} ${styles.polaroid}`}
              style={{ ...place(photo), "--w": `${photo.w}px` } as CSSProperties}
              data-r={photo.r}
            >
              <span className={styles.photo}>
                <Image src={photo.src} alt={photo.alt} fill sizes="240px" className={styles.img} draggable={false} />
              </span>
            </figure>
          ))}
          {stickers.map((sticker) => (
            <span
              key={sticker.label}
              className={`${styles.item} ${styles.sticker}`}
              data-tone={sticker.tone}
              data-r={sticker.r}
              style={place(sticker)}
            >
              {sticker.label}
            </span>
          ))}
        </div>

        <p className={styles.deskHint} aria-hidden="true">
          Psst — everything on this desk is draggable.
        </p>
      </div>

    </section>
  );
}
