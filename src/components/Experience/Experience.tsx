"use client";

import { useId, useRef, useState } from "react";
import { education, experience, languages, tools, type Role } from "@/lib/content";
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from "@/lib/gsap";
import RevealText from "../RevealText";
import styles from "./Experience.module.css";

function RoleRow({ role, defaultOpen }: { role: Role; defaultOpen?: boolean }) {
  const id = useId();
  const body = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(Boolean(defaultOpen));
  const toggled = useRef(false);

  useGSAP(
    () => {
      if (!body.current || !toggled.current) return;
      gsap.to(body.current, {
        height: open ? "auto" : 0,
        duration: prefersReducedMotion() ? 0 : 0.6,
        ease: "power3.inOut",
        onComplete: () => ScrollTrigger.refresh(),
      });
    },
    { dependencies: [open] },
  );

  return (
    <li className={styles.row} data-open={open || undefined}>
      <button
        type="button"
        className={styles.rowHead}
        aria-expanded={open}
        aria-controls={`${id}-details`}
        onClick={() => {
          toggled.current = true;
          setOpen((o) => !o);
        }}
      >
        <span className={styles.period}>{role.period}</span>
        <span className={styles.roleText}>
          <span className={styles.roleTitle}>{role.title}</span>
          <span className={styles.org}>{role.org}</span>
        </span>
        {role.current && (
          <span className={styles.now}>
            <i aria-hidden="true" />
            Now
          </span>
        )}
        <span className={styles.icon} aria-hidden="true" />
      </button>
      {/* Initial state only — GSAP owns the height after the first toggle. */}
      <div ref={body} id={`${id}-details`} className={styles.details} style={defaultOpen ? undefined : { height: 0 }}>
        <ul className={styles.points}>
          {role.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/** Work experience and education (from the CV), plus tools and languages. */
export default function Experience() {
  return (
    <section id="experience" className={styles.experience}>
      <div className={styles.head}>
        <RevealText as="h2" className={styles.heading} duration={1.2}>
          Experience
        </RevealText>
        <RevealText as="p" className={styles.headNote} delay={0.1}>
          From social media for a hotel and a bakery to product design at Bestseller.
        </RevealText>
      </div>

      <ul className={styles.list}>
        {experience.map((role, i) => (
          <RoleRow key={role.title} role={role} defaultOpen={i === 0} />
        ))}
      </ul>

      <RevealText as="h3" className={styles.subheading}>
        Education
      </RevealText>
      <ul className={styles.list}>
        {education.map((role) => (
          <RoleRow key={role.title} role={role} />
        ))}
      </ul>

      <div className={styles.extras}>
        <div className={styles.toolsBlock}>
          <p className={styles.label}>Tools I work with</p>
          <div className={styles.marquee} aria-label={tools.join(", ")}>
            {/* Two copies so the loop is seamless */}
            {[0, 1].map((copy) => (
              <div key={copy} className={styles.marqueeTrack} aria-hidden="true">
                {tools.map((tool) => (
                  <span key={tool} className={styles.tool}>
                    {tool}
                    <i>✦</i>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className={styles.label}>Languages</p>
          <dl className={styles.languages}>
            {languages.map((l) => (
              <div key={l.name}>
                <dt>{l.name}</dt>
                <dd>{l.level}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
