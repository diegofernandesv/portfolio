"use client";

import Image from "next/image";
import { useId, useRef, type CSSProperties, type ReactNode } from "react";
import { site } from "@/lib/content";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import RevealText from "../RevealText";
import styles from "./AboutBento.module.css";

/** The snippet typed out in the "Design × code" card; each prop visibly changes the preview once typed. */
const CODE = `<Button
  radius="full"
  tone="ink"
  size="lg"
>
  Hola 👋
</Button>`;
const MILESTONES = [
  { attr: "radius", at: CODE.indexOf(`"full"`) + 6 },
  { attr: "ink", at: CODE.indexOf(`"ink"`) + 5 },
  { attr: "lg", at: CODE.indexOf(`"lg"`) + 4 },
  { attr: "label", at: CODE.indexOf("👋") + 2 },
];

const HOBBIES = [
  { label: "Football", tone: "paper" },
  { label: "Swimming", tone: "ink" },
  { label: "Gym", tone: "paper" },
  { label: "Traveling", tone: "gold" },
] as const;

type Tone = "gold" | "ink" | "paper";

/** Sticker pill label, same as the ones on the desk above. */
function Label({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span className={styles.label} data-tone={tone}>
      {children}
    </span>
  );
}

const tilt = (r: number) => ({ "--r": `${r}deg` }) as CSSProperties;

/** The story behind the designer, pinned to the same desk as the section above: paper cards, stickers and tape. */
export default function AboutBento() {
  const root = useRef<HTMLElement>(null);
  const maskId = useId();
  const { phase } = useIntro();

  useGSAP(
    () => {
      if (phase !== "done") return;
      const q = gsap.utils.selector(root);
      const one = (sel: string) => q(sel)[0] as HTMLElement;

      // Code card: type the snippet, letting the preview button pick up each prop as it lands.
      const code = one(`.${styles.code}`);
      const preview = one(`.${styles.previewButton}`);
      const render = (n: number) => {
        code.textContent = CODE.slice(0, n);
        MILESTONES.forEach((m) => preview.toggleAttribute(`data-${m.attr}`, n >= m.at));
        preview.firstChild!.textContent = n >= MILESTONES[3].at ? "Hola 👋" : "Button";
      };
      const views = one(`.${styles.bigNumber}`);
      const draw = one(`.${styles.routeDraw}`) as unknown as SVGPathElement;
      const length = draw.getTotalLength();

      if (prefersReducedMotion()) {
        render(CODE.length);
        views.textContent = "100K+";
        return;
      }
      render(0);

      // Cards get tossed onto the desk, like the photos above.
      ScrollTrigger.batch(q(`.${styles.card}`), {
        start: "top 88%",
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 120,
            scale: 0.85,
            rotation: (i) => (i % 2 ? 7 : -7),
            autoAlpha: 0,
            duration: 1,
            ease: "back.out(1.3)",
            stagger: 0.1,
          }),
      });

      gsap
        .timeline({
          repeat: -1,
          repeatDelay: 2.4,
          scrollTrigger: { trigger: code, start: "top 85%", toggleActions: "play pause resume pause" },
        })
        .to(
          { n: 0 },
          {
            n: CODE.length,
            duration: 3.2,
            ease: "none",
            snap: { n: 1 },
            onUpdate: function () {
              render(this.targets()[0].n);
            },
          },
        )
        .to({}, { duration: 2.2 })
        .call(() => render(0));

      const count = { v: 0 };
      gsap.to(count, {
        v: 100,
        duration: 2,
        ease: "power3.out",
        onUpdate: () => (views.textContent = `${Math.round(count.v)}K+`),
        scrollTrigger: { trigger: views, start: "top 85%", once: true },
      });

      // Route: a solid mask stroke reveals the dashed path, then the pins drop in.
      gsap.set(draw, { strokeDasharray: length, strokeDashoffset: length });
      gsap
        .timeline({ scrollTrigger: { trigger: draw, start: "top 85%", once: true } })
        .to(draw, { strokeDashoffset: 0, duration: 1.8, ease: "power2.inOut" })
        .from(
          q(`.${styles.stop}`),
          { scale: 0, autoAlpha: 0, transformOrigin: "50% 50%", duration: 0.5, ease: "back.out(3)", stagger: 0.55 },
          0.1,
        );

      // Hobby stickers drift gently.
      q(`.${styles.chip}`).forEach((chip, i) => {
        gsap.to(chip, { y: i % 2 ? -8 : 8, duration: 2.4 + i * 0.3, ease: "sine.inOut", yoyo: true, repeat: -1 });
      });
    },
    { dependencies: [phase], scope: root },
  );

  return (
    <section ref={root} className={styles.section} aria-labelledby="bento-title">
      <header className={styles.head}>
        <RevealText as="h2" className={styles.heading}>
          <span id="bento-title">The story so far</span>
        </RevealText>
      </header>

      <div className={styles.bento}>
        {/* How it started: a polaroid of an early design */}
        <article className={`${styles.card} ${styles.origin}`} style={tilt(-1.5)}>
          <Label tone="gold">How it started</Label>
          <div className={styles.photo}>
            <Image
              src="/about/first-design.jpg"
              alt="One of Diego’s first designs: a football edit for his sports Instagram"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className={styles.img}
            />
          </div>
          <span className={styles.price} aria-hidden="true">
            <b>$3</b>
            sold
          </span>
          <p className={styles.caption}>One of my first designs</p>
          <p className={styles.text}>
            My design journey began during the pandemic, when I wanted graphics for my sports Instagram. After my brother
            got me a Domestika course, I started experimenting in Photoshop — and eventually sold my first design for{" "}
            <strong>$3</strong>.
          </p>
        </article>

        {/* Design × code */}
        <article className={`${styles.card} ${styles.codeCard}`} style={tilt(1.2)}>
          <span className={styles.tape} aria-hidden="true" />
          <Label tone="paper">Design × code</Label>
          <p className={styles.text}>
            At Business Academy Aarhus I discovered how much I enjoy combining design with coding — building websites,
            apps, and interactive experiences that bring ideas to life.
          </p>
          <div className={styles.editor} aria-hidden="true">
            <div className={styles.editorBar}>
              <i />
              <i />
              <i />
              <span>Hola.tsx</span>
            </div>
            <div className={styles.editorBody}>
              <pre className={styles.code} />
              <div className={styles.preview}>
                <span className={styles.previewButton}>
                  <span>Button</span>
                </span>
              </div>
            </div>
          </div>
        </article>

        {/* TikTok */}
        <a
          className={`${styles.card} ${styles.viewsCard}`}
          style={tilt(-2)}
          href={site.tiktok}
          target="_blank"
          rel="noreferrer"
        >
          <Label tone="paper">Fdez.UXUI</Label>
          <span className={styles.bigNumber}>100K+</span>
          <span className={styles.viewsLabel}>
            views on my design videos
            <span className={styles.handle}>@fdez.uxui ↗</span>
          </span>
        </a>

        {/* Real Madrid */}
        <article className={`${styles.card} ${styles.madrid}`} style={tilt(2.5)}>
          <Label tone="gold">Matchday</Label>
          <span className={styles.sevenClip} aria-hidden="true">
            <span className={styles.seven}>7</span>
          </span>
          <p className={styles.madridText}>
            <strong>Real Madrid forever.</strong> Cristiano Ronaldo is my GOAT.
          </p>
        </article>

        {/* Third country */}
        <article className={`${styles.card} ${styles.routeCard}`} style={tilt(1)}>
          <span className={styles.tape} aria-hidden="true" />
          <Label tone="ink">Long way from home</Label>
          <p className={styles.text}>
            After Venezuela and the United States, Denmark is the <strong>third country</strong> I’ve lived in. People
            often say it’s a long way from home — and they’re right.
          </p>
          <svg className={styles.route} viewBox="0 0 520 150" aria-hidden="true">
            <defs>
              <mask id={maskId} maskUnits="userSpaceOnUse">
                <path className={styles.routeDraw} d="M 30 110 C 140 10, 220 10, 260 70 S 400 140, 490 40" />
              </mask>
            </defs>
            <path
              className={styles.routePath}
              d="M 30 110 C 140 10, 220 10, 260 70 S 400 140, 490 40"
              mask={`url(#${maskId})`}
            />
            <g className={styles.stop} transform="translate(30 110)">
              <circle r="9" />
              <text y="32" textAnchor="middle">
                Venezuela
              </text>
            </g>
            <g className={styles.stop} transform="translate(260 70)">
              <circle r="7" />
              <text y="-18" textAnchor="middle">
                USA
              </text>
            </g>
            <g className={`${styles.stop} ${styles.stopHome}`} transform="translate(490 40)">
              <circle r="11" />
              <text y="-22" textAnchor="middle">
                Denmark
              </text>
            </g>
          </svg>
        </article>

        {/* Off screen */}
        <article className={`${styles.card} ${styles.offCard}`} style={tilt(-1)}>
          <Label tone="paper">Off screen</Label>
          <p className={styles.text}>
            When I’m not designing or coding, you’ll find me watching football, in the pool, at the gym, or planning the
            next trip.
          </p>
          <div className={styles.chips} aria-label={HOBBIES.map((h) => h.label).join(", ")}>
            {HOBBIES.map((hobby, i) => (
              <span
                key={hobby.label}
                className={styles.chip}
                data-tone={hobby.tone}
                style={tilt([-6, 4, -3, 7][i])}
                aria-hidden="true"
              >
                {hobby.label}
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
