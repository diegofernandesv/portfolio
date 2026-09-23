"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef, useState, type ComponentProps } from "react";
import { site } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import styles from "./Nav.module.css";

/** "#…" links point at sections on the home page; "/…" links are pages. */
const links = [
  { label: "Home", href: "#top" },
  { label: "Work", href: "/work" },
  { label: "About me", href: "/about" },
];

/** Pages and off-home section links navigate client-side; on the home page sections are plain hash links (smooth-scrolled by Lenis). */
function NavLink({ href, onHome, ...props }: Omit<ComponentProps<"a">, "href"> & { href: string; onHome: boolean }) {
  if (href.startsWith("/")) return <Link href={href} {...props} />;
  return onHome ? <a href={href} {...props} /> : <Link href={`/${href}`} {...props} />;
}

export default function Nav() {
  const root = useRef<HTMLElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState(pathname.startsWith("/work") ? 1 : pathname.startsWith("/about") ? 2 : 0);
  const [hovered, setHovered] = useState<number | null>(null);
  const { phase } = useIntro();

  const current = hovered ?? active;

  // Intro, scroll-spy and hide-on-scroll.
  useGSAP(
    () => {
      const nav = root.current;
      if (!nav || phase !== "done") return;

      gsap.set(nav, { autoAlpha: 1 });
      gsap.from(nav, { yPercent: -100, duration: 1.2, ease: "reveal", delay: 0.15 });
      gsap.from(nav.querySelectorAll("[data-item]"), {
        yPercent: 60,
        autoAlpha: 0,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.05,
        delay: 0.45,
      });

      // Scroll-spy only applies on the home page, where the sections live.
      if (onHome) {
        links.forEach(({ href }, i) => {
          if (!href.startsWith("#")) return;
          ScrollTrigger.create({
            // Resolve outside the nav's scope – selector strings would be scoped to the nav.
            trigger: document.querySelector(href),
            start: "top 50%",
            end: "bottom 50%",
            onToggle: (self) => self.isActive && setActive(i),
          });
        });
      }

      let hidden = false;
      ScrollTrigger.create({
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const shouldHide = self.direction === 1 && self.scroll() > 400;
          if (shouldHide === hidden) return;
          hidden = shouldHide;
          gsap.to(nav, { yPercent: hidden ? -110 : 0, duration: 0.6, ease: "power3.out", overwrite: "auto" });
        },
      });
    },
    { dependencies: [phase, onHome], scope: root },
  );

  // Slide the pill under the hovered/active link.
  useGSAP(
    () => {
      const link = linkRefs.current[current];
      if (!link || !indicator.current) return;
      gsap.to(indicator.current, {
        x: link.offsetLeft,
        width: link.offsetWidth,
        duration: 0.5,
        ease: "power3.out",
      });
    },
    { dependencies: [current] },
  );

  return (
    <header ref={root} className={styles.nav} data-reveal="">
      <nav className={styles.left} aria-label="Main">
        <NavLink href="#top" onHome={onHome} className={styles.brand} data-item="">
          Diego.
        </NavLink>
        <div className={styles.links} onMouseLeave={() => setHovered(null)}>
          <span ref={indicator} className={styles.indicator} aria-hidden="true" />
          {links.map((link, i) => (
            <NavLink
              key={link.href}
              ref={(el) => {
                linkRefs.current[i] = el;
              }}
              href={link.href}
              onHome={onHome}
              className={styles.link}
              data-item=""
              data-current={i === current || undefined}
              aria-current={i === active ? "true" : undefined}
              onMouseEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
      <a href={site.cv} className={styles.cv} data-item="" target="_blank" rel="noreferrer">
        Check my CV
      </a>
    </header>
  );
}
