"use client";

import { useEffect, useRef, type ComponentProps } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

/** Muted looping video that only loads and plays while it is on screen. */
export default function InViewVideo(props: Omit<ComponentProps<"video">, "autoPlay" | "preload">) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video || prefersReducedMotion()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => undefined);
        else video.pause();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return <video ref={ref} muted loop playsInline preload="none" {...props} />;
}
