"use client";

import { useRef, type ReactNode } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useIntro } from "./IntroProvider";

type RevealMediaProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Wipes its content up from the bottom edge while the media settles from a zoom. */
export default function RevealMedia({ children, className, delay = 0 }: RevealMediaProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { phase } = useIntro();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || phase !== "done") return;
      if (prefersReducedMotion()) {
        gsap.set(el, { clipPath: "none" });
        return;
      }

      const tl = gsap.timeline({ delay, scrollTrigger: { trigger: el, start: "top 88%", once: true } });
      tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.3, ease: "reveal" });
      if (el.firstElementChild) {
        tl.fromTo(el.firstElementChild, { scale: 1.12 }, { scale: 1, duration: 1.6, ease: "reveal" }, 0);
      }
    },
    { dependencies: [phase] },
  );

  return (
    <div ref={ref} className={className} data-reveal-media="">
      {children}
    </div>
  );
}
