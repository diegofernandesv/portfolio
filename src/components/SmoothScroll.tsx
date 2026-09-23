"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIntro } from "./IntroProvider";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null);
  const { phase } = useIntro();

  // Drive Lenis from GSAP's ticker so ScrollTrigger and Lenis share one clock.
  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    const lenis = lenisRef.current?.lenis;
    lenis?.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(update);
      lenis?.off("scroll", ScrollTrigger.update);
    };
  }, []);

  // Lock scrolling while the loader plays and always start at the top.
  useEffect(() => {
    const lenis = lenisRef.current?.lenis;
    if (phase === "loading") {
      history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
      lenis?.stop();
    } else {
      lenis?.start();
      ScrollTrigger.refresh();
    }
  }, [phase]);

  return (
    <ReactLenis root ref={lenisRef} autoRaf={false} options={{ lerp: 0.1, anchors: true }}>
      {children}
    </ReactLenis>
  );
}
