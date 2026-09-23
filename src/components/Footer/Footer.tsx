"use client";

import { site } from "@/lib/content";
import RevealText from "../RevealText";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer id="contact" className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <RevealText as="h2" className={styles.heading}>
            Connect, collaborate, or just say hello
          </RevealText>
          <RevealText as="p" className={styles.email} delay={0.1}>
            <a href={`mailto:${site.email}`} className={styles.emailLink}>
              {site.email}
            </a>
          </RevealText>
        </div>
        <RevealText as="p" className={styles.social} start="top 95%">
          <a href={site.linkedin} target="_blank" rel="noreferrer" className={styles.socialLink}>
            LinkedIn
          </a>
        </RevealText>
      </div>
    </footer>
  );
}
