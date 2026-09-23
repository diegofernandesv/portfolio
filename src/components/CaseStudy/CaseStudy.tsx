import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { projects } from "@/lib/content";
import Footer from "../Footer/Footer";
import Nav from "../Nav/Nav";
import RevealMedia from "../RevealMedia";
import RevealText from "../RevealText";
import styles from "./CaseStudy.module.css";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

/** Page shell shared by every case study. `style` can set `--case-panel` / `--case-accent`. */
export function CasePage({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <>
      <Nav />
      <main className={styles.page} style={style}>
        {children}
      </main>
      <Footer />
    </>
  );
}

export type CaseFact = { label: string; value: string };

export function CaseHeader({
  eyebrow,
  title,
  lede,
  facts,
}: {
  eyebrow: string;
  title: string;
  lede: string;
  facts: CaseFact[];
}) {
  return (
    <header className={styles.header}>
      <Link href="/work" className={styles.back}>
        <span aria-hidden="true">←</span> Back to work
      </Link>
      <RevealText as="p" trigger="intro" className={styles.eyebrow}>
        {eyebrow}
      </RevealText>
      <RevealText as="h1" trigger="intro" className={styles.title} duration={1.3} delay={0.05}>
        {title}
      </RevealText>
      <RevealText as="p" trigger="intro" className={styles.lede} delay={0.15} stagger={0.06}>
        {lede}
      </RevealText>

      <dl className={styles.facts} style={{ "--facts": facts.length } as CSSProperties}>
        {facts.map((fact, i) => (
          <div key={fact.label}>
            <RevealText as="span" trigger="intro" className={styles.factLabel} delay={0.25 + i * 0.05}>
              {fact.label}
            </RevealText>
            <RevealText as="span" trigger="intro" className={styles.factValue} delay={0.3 + i * 0.05}>
              {fact.value}
            </RevealText>
          </div>
        ))}
      </dl>
    </header>
  );
}

type FigureProps = {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** "plain" = edge to edge, "panel" = centred on a tinted panel (for diagrams and transparent art). */
  variant?: "plain" | "panel";
  caption?: string;
  sizes?: string;
  preload?: boolean;
  className?: string;
  delay?: number;
};

export function CaseFigure({
  src,
  alt,
  width,
  height,
  variant = "plain",
  caption,
  sizes = "(max-width: 900px) 100vw, 1200px",
  preload,
  className,
  delay,
}: FigureProps) {
  return (
    <figure className={cx(styles.figure, className)}>
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
      <RevealMedia className={cx(styles.media, variant === "panel" && styles.panel)} delay={delay}>
        <Image src={src} alt={alt} width={width} height={height} sizes={sizes} preload={preload} className={styles.img} />
      </RevealMedia>
    </figure>
  );
}

export function CaseVideo({ className, ...props }: ComponentProps<"video">) {
  return (
    <RevealMedia className={cx(styles.media, className)}>
      <video className={styles.video} playsInline muted {...props} />
    </RevealMedia>
  );
}

/** Two-column intro: section title on the left, larger body copy on the right. */
export function CaseIntro({ title = "Intro", children }: { title?: string; children: ReactNode }) {
  return (
    <section className={styles.intro}>
      <RevealText as="h2" className={styles.sectionTitle}>
        {title}
      </RevealText>
      <div className={styles.introBody}>{children}</div>
    </section>
  );
}

type ChapterProps = {
  title: string;
  body?: ReactNode[];
  /** "stack" puts media under the text; "split" puts it beside the text (mirrored with `flip`). */
  layout?: "stack" | "split";
  flip?: boolean;
  children?: ReactNode;
};

export function CaseChapter({ title, body, layout = "stack", flip, children }: ChapterProps) {
  const head = (
    <div className={styles.chapterHead}>
      <RevealText as="h3" className={styles.sectionTitle}>
        {title}
      </RevealText>
      {body && (
        <div className={styles.chapterBody}>
          {body.map((paragraph, i) => (
            <RevealText key={i} as="p" className={styles.body} stagger={0.04}>
              {paragraph}
            </RevealText>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section className={cx(styles.chapter, layout === "split" && styles.split, flip && styles.flip)}>
      {head}
      {children && <div className={styles.chapterMedia}>{children}</div>}
    </section>
  );
}

/** Closing block linking to the next project that has a case study. */
export function CaseNext({ current }: { current: string }) {
  const withPages = projects.filter((p) => p.href);
  const at = withPages.findIndex((p) => p.href === current);
  const next = withPages[(at + 1) % withPages.length];
  if (!next?.href || next.href === current) return null;

  return (
    <Link href={next.href} className={styles.next}>
      <span className={styles.nextLabel}>Next project</span>
      <span className={styles.nextTitle}>
        {next.title} <span aria-hidden="true">→</span>
      </span>
      {next.cover && (
        <span className={styles.nextCover}>
          <Image src={next.cover} alt="" fill sizes="(max-width: 900px) 100vw, 50vw" className={styles.nextImg} />
        </span>
      )}
    </Link>
  );
}
