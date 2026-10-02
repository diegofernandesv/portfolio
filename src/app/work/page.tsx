import type { Metadata } from "next";
import Footer from "@/components/Footer/Footer";
import Nav from "@/components/Nav/Nav";
import RevealText from "@/components/RevealText";
import WorkGrid from "@/components/WorkGrid/WorkGrid";
import { projects } from "@/lib/content";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Work — Diego",
  description: "Selected projects by Diego across UX/UI, branding and creative development.",
};

export default function WorkPage() {
  return (
    <div className={styles.surface}>
      <Nav />
      <main className={styles.page}>
        <header className={styles.intro}>
          <RevealText as="p" trigger="intro" className={styles.label}>
            Design & creative development
          </RevealText>
          <div className={styles.introBody}>
            <div className={styles.titleWrap}>
              <RevealText as="h1" trigger="intro" className={styles.heading} duration={1.1} delay={0.05}>
                Selected work
              </RevealText>
              <span className={styles.total}>({projects.length.toString().padStart(2, "0")})</span>
            </div>
            <RevealText as="p" trigger="intro" className={styles.statement} delay={0.15}>
              A collection of digital experiences and identities. Made with curiosity, built with care.
            </RevealText>
          </div>
        </header>
        <WorkGrid />
      </main>
      <Footer />
    </div>
  );
}
