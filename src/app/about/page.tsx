import type { Metadata } from "next";
import AboutBento from "@/components/AboutBento/AboutBento";
import Experience from "@/components/Experience/Experience";
import Footer from "@/components/Footer/Footer";
import Hola, { type DeskPhoto, type DeskSticker } from "@/components/Hola/Hola";
import Nav from "@/components/Nav/Nav";
import PillButton from "@/components/PillButton/PillButton";
import RevealText from "@/components/RevealText";
import StarCrawl from "@/components/StarCrawl/StarCrawl";
import { site } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "About — Diego",
  description:
    "Diego: a 22-year-old digital designer from Venezuela with Portuguese roots, studying in Aarhus, Denmark – design, code, football and TikTok.",
};

const crawl = {
  episode: "Episode IV",
  title: "A New Portfolio",
  paragraphs: [
    "It is a dark time for the Rebellion and a confusing time for recruiters…",
    "This person actually went into my about me page. Not sure why, but hola amigo.",
    "I finally managed to finish my portfolio. It took way longer than I expected, but here it is at last.",
    "What I didn’t realize is that a portfolio is never truly finished. It keeps changing, breaking, and getting redesigned forever.",
    "The funny part? I’m not even that big of a Star Wars fan. I just thought this would be a cool way to start my about me section.",
    "And seriously… why are you still reading this? Scroll down already — the real stuff is waiting.",
  ],
};

const intro =
  "A 22-year-old guy from Venezuela with Portuguese roots, studying Digital Concept Development in Aarhus, Denmark, and designing digital products at Bestseller. People often say that’s a long way from home — and they’re right. I still don’t know exactly how life brought me here, but I’m making the most of the experience.";

/* Desk layout: x/y are % of the desk on desktop, mx/my on small screens; r is the resting tilt. */
const photos: DeskPhoto[] = [
  { src: "/about/diego-1.png", alt: "Diego smiling on a mountain ridge trail", w: 210, x: 3, y: 4, r: -8, mx: 2, my: 2 },
  { src: "/about/diego-2.png", alt: "Diego sitting by the sea at sunset", w: 230, x: 77, y: 2, r: 6, mx: 62, my: 0 },
  { src: "/about/diego-3.webp", alt: "Green mountains above a city at golden hour", w: 190, x: 7, y: 58, r: 5, mx: 4, my: 50 },
  { src: "/about/diego-4.jpg", alt: "View over a coastal city under a cloudy sky", w: 180, x: 80, y: 57, r: -5, mx: 64, my: 46 },
  { src: "/about/diego-5.jpg", alt: "A travel snapshot from Diego", w: 170, x: 45, y: 74, r: 3, mx: 34, my: 24 },
];

const stickers: DeskSticker[] = [
  { label: "22 y/o", tone: "ink", x: 27, y: 10, r: -10, mx: 38, my: 3 },
  { label: "Venezuelan × Portuguese", tone: "paper", x: 58, y: 20, r: 5, mx: 30, my: 86 },
  { label: "First design sold for $3", tone: "gold", x: 20, y: 80, r: 4, mx: 0, my: 76 },
  { label: "Real Madrid forever", tone: "ink", x: 66, y: 84, r: -6, mx: 58, my: 78 },
  { label: "100K+ views on TikTok", tone: "paper", x: 1, y: 44, r: -4, mx: 52, my: 36 },
  { label: "3 countries lived in", tone: "gold", x: 85, y: 44, r: 8, mx: 8, my: 38 },
];

export default function AboutPage() {
  return (
    <>
      <Nav />
      <main>
        <h1 className={styles.srOnly}>About Diego</h1>
        <StarCrawl {...crawl} nextId="hola" />

        <Hola intro={intro} photos={photos} stickers={stickers} />

        <AboutBento />

        <Experience />

        <section className={styles.quote}>
          <RevealText as="p" className={styles.quoteText} duration={1.3} stagger={0.1}>
            “Life is all about the experience.”
          </RevealText>
          <RevealText as="p" className={styles.quoteBody} delay={0.2} stagger={0.04}>
            If I had to live by one phrase, it would be this one. That’s how I see design, challenges, and everything
            in between — as opportunities to grow and learn.
          </RevealText>
        </section>

        <section className={styles.tiktok}>
          <div>
            <RevealText as="p" className={styles.tiktokLabel}>
              Fdez.UXUI on TikTok
            </RevealText>
            <RevealText as="h2" className={styles.tiktokHandle} duration={1.2}>
              @fdez.uxui
            </RevealText>
          </div>
          <div className={styles.tiktokSide}>
            <RevealText as="p" className={styles.tiktokText} stagger={0.04}>
              Design insights, tips and behind-the-scenes of my process — some videos have passed 100K views.
            </RevealText>
            <PillButton href={site.tiktok} target="_blank" rel="noreferrer" tone="dark">
              Watch on TikTok ↗
            </PillButton>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
