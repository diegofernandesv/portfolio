import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  CaseChapter,
  CaseFigure,
  CaseHeader,
  CaseIntro,
  CaseNext,
  CasePage,
  CaseVideo,
} from "@/components/CaseStudy/CaseStudy";
import RevealText from "@/components/RevealText";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Trailbound — Diego",
  description:
    "Trailbound: a self-created outdoor lifestyle brand – visual identity, brand guidelines and a Shopify store designed from scratch.",
};

const IMG = "/work/trailbound";

const facts = [
  { label: "Client", value: "Trailbound (self-initiated)" },
  { label: "Duration", value: "3 weeks" },
  { label: "Year", value: "August 2025" },
  { label: "Scope", value: "Identity, guidelines, Shopify" },
];

const principles = [
  {
    title: "Tone of voice",
    text: "Trailbound speaks with an adventurous, confident, and approachable voice. We inspire people to explore by using clear, energetic, and motivating language that feels authentic and down-to-earth. Our tone balances practical guidance with a sense of excitement and discovery, making outdoor exploration feel both accessible and aspirational.",
  },
  {
    title: "Aim",
    text: "Our aim is to provide functional, stylish gear that inspires adventure in both the outdoors and everyday life.",
  },
  {
    title: "Vision",
    text: "Our vision is to become a trusted global outdoor lifestyle brand that empowers people to embrace adventure, connect with nature, and carry the spirit of exploration into their daily lives.",
  },
];

export default function TrailboundPage() {
  return (
    <CasePage style={{ "--case-panel": "#f3f6e0", "--case-accent": "#2c4b31" } as CSSProperties}>
      <CaseHeader
        eyebrow="Case study — Brand identity & e-commerce"
        title="Trailbound"
        lede="A self-created outdoor lifestyle brand that combines functionality and style, offering durable gear designed for both adventure and everyday wear."
        facts={facts}
      />

      <CaseFigure
        src={`${IMG}/hero.png`}
        alt="Model wearing a black Trailbound softshell jacket in front of the brand’s logomark"
        width={2000}
        height={627}
        sizes="100vw"
        preload
        className={styles.cover}
      />

      <CaseIntro>
        <RevealText as="p" stagger={0.05}>
          For this assignment, I developed the brand entirely from scratch — including the visual identity, brand
          guidelines, and a fully designed Shopify e-commerce website. My goal was to build a brand that feels
          authentic, consistent, and engaging, while showing how design can connect lifestyle storytelling with digital
          retail.
        </RevealText>
      </CaseIntro>

      <section className={styles.principles} aria-label="Brand principles">
        {principles.map((p, i) => (
          <article key={p.title} className={styles.principle}>
            <RevealText as="h3" className={styles.principleTitle} delay={i * 0.08}>
              {p.title}
            </RevealText>
            <RevealText as="p" className={styles.principleText} delay={0.08 + i * 0.08} stagger={0.04}>
              {p.text}
            </RevealText>
          </article>
        ))}
      </section>

      <CaseFigure
        src={`${IMG}/showcase.png`}
        alt="Trailbound brand values: adventure, functionality, style and community"
        width={2000}
        height={1421}
      />

      <CaseChapter
        title="Logomark"
        body={[
          "The Trailbound logomark unites the letter “t” from Trail and “b” from Bound into a single, bold symbol. Its upward peaks are inspired by the form of a mountain, reflecting our brand’s spirit of adventure and exploration.",
          "This design embodies the balance between functionality and style, serving as a visual reminder of the journeys and challenges that shape the Trailbound identity.",
        ]}
      >
        <CaseFigure src={`${IMG}/logomark.png`} alt="The Trailbound logomark" width={1450} height={524} />
      </CaseChapter>

      <CaseChapter
        title="Logotype"
        body={[
          "The Hanken Grotesk Black Italic logotype reflects Trailbound’s spirit with a bold, modern edge. Its sleek and sophisticated form conveys both strength and style, perfectly aligning with the brand’s adventurous identity.",
          "The logotype employs a -5% letter spacing, giving the typography a tighter and more cohesive appearance. This subtle adjustment enhances readability while adding a sense of precision and modern refinement to the brand’s visual identity.",
        ]}
      >
        <CaseFigure
          src={`${IMG}/logotype.png`}
          alt="The Trailbound logotype"
          width={750}
          height={128}
          variant="panel"
          sizes="(max-width: 900px) 90vw, 750px"
        />
      </CaseChapter>

      <CaseChapter
        title="Clear space"
        body={[
          "The combination of the logomark and logotype creates a strong, unified identity for Trailbound. Together, they ensure consistency and recognition across all applications, reinforcing the brand’s dedication to quality and exploration.",
        ]}
      >
        <CaseFigure src={`${IMG}/clear-space.png`} alt="Clear space guidelines" width={1440} height={524} />
      </CaseChapter>

      <CaseChapter
        title="Common mistakes"
        body={[
          "To maintain a consistent and professional brand identity, the Trailbound logo must always be used correctly. Any modifications — such as changing colours, proportions, fonts, or placements — can weaken recognition and dilute the brand’s impact. These examples illustrate mistakes to avoid.",
        ]}
      >
        <CaseFigure
          src={`${IMG}/common-mistakes.png`}
          alt="Examples of incorrect logo usage"
          width={1022}
          height={338}
          variant="panel"
          className={styles.neutral}
          sizes="(max-width: 900px) 90vw, 1022px"
        />
      </CaseChapter>

      <CaseChapter title="Colour palette">
        <CaseFigure src={`${IMG}/color-palette.png`} alt="The Trailbound colour palette" width={1440} height={678} />
      </CaseChapter>

      <CaseChapter
        title="Combinations"
        body={[
          "The consistent use of colour is vital to effective brand recognition. Trailbound should always be represented in one of these approved combinations, aside from specific recommendations within this guide.",
        ]}
      >
        <div className={styles.combinations}>
          {[1, 2, 3, 4, 5, 6].map((n, i) => (
            <CaseFigure
              key={n}
              src={`${IMG}/combination-${n}.png`}
              alt={`Approved logo colour combination ${n}`}
              width={698}
              height={144}
              sizes="(max-width: 900px) 100vw, 600px"
              delay={(i % 2) * 0.08}
            />
          ))}
        </div>
      </CaseChapter>

      <CaseChapter
        title="Typeface"
        body={[
          "Hanken Grotesk is Trailbound’s primary typeface. Its clean, modern, and highly legible design reflects the brand’s balance of strength and simplicity.",
        ]}
      >
        <CaseFigure
          src={`${IMG}/typeface.png`}
          alt="Hanken Grotesk specimen"
          width={1025}
          height={382}
          variant="panel"
          className={styles.neutral}
          sizes="(max-width: 900px) 90vw, 1025px"
        />
      </CaseChapter>

      <CaseChapter title="Social">
        <CaseFigure
          src={`${IMG}/instagram.png`}
          alt="Trailbound Instagram post"
          width={1480}
          height={1500}
          sizes="(max-width: 900px) 100vw, 640px"
          className={styles.narrow}
        />
      </CaseChapter>

      <CaseChapter
        title="Shopify website"
        body={[
          "The identity comes together in a fully designed Shopify store, connecting lifestyle storytelling with digital retail.",
        ]}
      >
        <CaseVideo src="/videos/trailbound-shopify.mp4" controls preload="metadata" />
      </CaseChapter>

      <CaseNext current="/work/trailbound" />
    </CasePage>
  );
}
