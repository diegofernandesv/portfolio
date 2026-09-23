import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import RevealText from "@/components/RevealText";
import WorkGrid from "@/components/WorkGrid/WorkGrid";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Work — Diego",
  description: "Selected projects by Diego across UX/UI, branding and creative development.",
};

export default function WorkPage() {
  return (
    <>
      <Nav />
      <main className={styles.page}>
        <header className={styles.intro}>
          <RevealText as="p" trigger="intro" className={styles.label}>
            Work
          </RevealText>
          <RevealText as="h1" trigger="intro" className={styles.statement} duration={1.2} stagger={0.1} delay={0.05}>
            Selected <b>projects</b> across <b>UX/UI</b>, <b>branding</b> and <b>code</b> — from first research to
            the <b>final build.</b>
          </RevealText>
        </header>

        <WorkGrid />
      </main>
      <Footer />
    </>
  );
}
