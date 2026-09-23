"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, prefersReducedMotion, SplitText, useGSAP } from "@/lib/gsap";
import { useIntro } from "./IntroProvider";

type RevealTextProps = {
  as?: "h1" | "h2" | "h3" | "p" | "div" | "span";
  children: ReactNode;
  className?: string;
  /** "scroll" waits for the element to enter the viewport, "intro" plays as soon as the loader hands off. */
  trigger?: "scroll" | "intro";
  delay?: number;
  duration?: number;
  stagger?: number;
  /** ScrollTrigger start position. */
  start?: string;
};

/**
 * Splits text into lines, wraps each line in an overflow mask and slides it up
 * from below (yPercent 100 → 0). Re-splits automatically on resize/font load.
 */
export default function RevealText({
  as = "div",
  children,
  className,
  trigger = "scroll",
  delay = 0,
  duration = 1.1,
  stagger = 0.08,
  start = "top 85%",
}: RevealTextProps) {
  const ref = useRef<HTMLElement>(null);
  const { phase } = useIntro();
  const Tag = as as ElementType;

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || phase !== "done") return;

      gsap.set(el, { autoAlpha: 1 });
      if (prefersReducedMotion()) return;

      SplitText.create(el, {
        type: "lines",
        mask: "lines",
        linesClass: "line",
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, {
            yPercent: 100,
            duration,
            delay,
            stagger,
            ease: "power3.out",
            scrollTrigger: trigger === "scroll" ? { trigger: el, start, once: true } : undefined,
          }),
      });
    },
    { dependencies: [phase] },
  );

  return (
    <Tag ref={ref} className={className} data-reveal="">
      {children}
    </Tag>
  );
}
