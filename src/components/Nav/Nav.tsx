"use client";

import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentProps, type MouseEvent } from "react";
import { site } from "@/lib/content";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import PillButton from "../PillButton/PillButton";
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
  const lenis = useLenis();
  const [menuOpen, setMenuOpen] = useState(false);
  const menu = useRef<HTMLDivElement>(null);
  const burger = useRef<HTMLButtonElement>(null);
  const menuTl = useRef<gsap.core.Timeline | null>(null);

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

  // Mobile menu: panel drops down from the nav, links rise out of their masks.
  useGSAP(
    () => {
      const panel = menu.current;
      if (!panel) return;
      const q = gsap.utils.selector(panel);
      menuTl.current = gsap
        .timeline({ paused: true })
        .fromTo(
          panel,
          { clipPath: "inset(0% 0% 100% 0% round 0px 0px 28px 28px)" },
          { clipPath: "inset(0% 0% 0% 0% round 0px 0px 0px 0px)", duration: 0.8, ease: "reveal" },
        )
        .fromTo(
          q("[data-menu-line]"),
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, ease: "power3.out", stagger: 0.06 },
          0.25,
        )
        .fromTo(q("[data-menu-foot]"), { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.45);
    },
    { scope: root },
  );

  useEffect(() => {
    const tl = menuTl.current;
    if (!tl) return;
    if (menuOpen) {
      lenis?.stop();
      gsap.to(root.current, { yPercent: 0, duration: 0.4, ease: "power3.out", overwrite: "auto" });
      tl.timeScale(1).play();
      menu.current?.querySelector<HTMLElement>("a")?.focus({ preventScroll: true });
    } else {
      tl.timeScale(1.6).reverse();
      lenis?.start();
    }
  }, [menuOpen, lenis]);

  // Close on Escape.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMenuOpen(false);
      burger.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const onMenuLink = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    setMenuOpen(false);
    // Same-page section link: scroll once scrolling is unlocked again.
    if (href.startsWith("#") && onHome) {
      e.preventDefault();
      lenis?.start();
      lenis?.scrollTo(href, { duration: 1.2 });
    }
  };

  return (
    <header ref={root} className={styles.nav} data-reveal="">
      <nav className={styles.left} aria-label="Main">
        <NavLink
          href="#top"
          onHome={onHome}
          className={styles.brand}
          data-item=""
          onClick={(e) => menuOpen && onMenuLink(e, "#top")}
        >
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

      <button
        ref={burger}
        type="button"
        className={styles.burger}
        data-item=""
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {/* Same pill as "Check my work": the label rolls from Menu to Close */}
        <span className={styles.burgerLabel} aria-hidden="true">
          <span>Menu</span>
          <span>Close</span>
        </span>
        <span className={styles.burgerIcon} aria-hidden="true">
          <i />
          <i />
        </span>
      </button>

      <div
        ref={menu}
        id="mobile-menu"
        className={styles.menu}
        data-lenis-prevent=""
        data-open={menuOpen || undefined}
        aria-hidden={!menuOpen}
        inert={!menuOpen}
      >
        <nav className={styles.menuLinks} aria-label="Mobile">
          {links.map((link, i) => (
            <span key={link.href} className={styles.menuMask}>
              <NavLink
                href={link.href}
                onHome={onHome}
                className={styles.menuLink}
                data-menu-line=""
                aria-current={i === active ? "page" : undefined}
                onClick={(e) => onMenuLink(e, link.href)}
              >
                {link.label}
                <span aria-hidden="true">→</span>
              </NavLink>
            </span>
          ))}
        </nav>

        <div className={styles.menuFoot} data-menu-foot="">
          <PillButton href={site.cv} className={styles.menuCv} target="_blank" rel="noreferrer">
            Check my CV
          </PillButton>
          <div className={styles.menuContact}>
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <a href={site.linkedin} target="_blank" rel="noreferrer">
              LinkedIn ↗
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
