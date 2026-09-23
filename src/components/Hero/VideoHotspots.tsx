"use client";

import Link from "next/link";
import { useEffect, useRef, type PointerEvent } from "react";
import { heroHotspots, heroVideoSize } from "@/lib/content";
import { gsap, useGSAP } from "@/lib/gsap";
import styles from "./VideoHotspots.module.css";

/**
 * Clickable regions laid over the hero video. Boxes are defined in video pixels and
 * mapped through the same maths as `object-fit: cover`, so they stay locked to the
 * screens in the footage at any card size. Hover spotlights the region and shows a
 * "View … project" pill that follows the cursor.
 */
export default function VideoHotspots() {
  const root = useRef<HTMLDivElement>(null);
  const pills = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc; el: HTMLElement }[]>([]);

  // Position each hotspot for the current card size.
  useEffect(() => {
    const layer = root.current;
    if (!layer) return;

    const layout = () => {
      // offsetWidth/Height ignore the card's scroll-out transform.
      const cw = layer.offsetWidth;
      const ch = layer.offsetHeight;
      const s = Math.max(cw / heroVideoSize.width, ch / heroVideoSize.height);
      const ox = (cw - heroVideoSize.width * s) / 2;
      const oy = (ch - heroVideoSize.height * s) / 2;

      layer.querySelectorAll<HTMLElement>("[data-hotspot]").forEach((el) => {
        const { box } = heroHotspots[Number(el.dataset.hotspot)];
        el.style.left = `${ox + box.x * s}px`;
        el.style.top = `${oy + box.y * s}px`;
        el.style.width = `${box.w * s}px`;
        el.style.height = `${box.h * s}px`;
      });
    };

    layout();
    const observer = new ResizeObserver(layout);
    observer.observe(layer);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      pills.current = gsap.utils.toArray<HTMLElement>(`.${styles.pill}`, root.current).map((el) => ({
        el,
        x: gsap.quickTo(el, "x", { duration: 0.45, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.45, ease: "power3.out" }),
      }));
    },
    { scope: root },
  );

  const follow = (i: number, e: PointerEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    pills.current[i]?.x(e.clientX - rect.left);
    pills.current[i]?.y(e.clientY - rect.top);
  };

  const toggle = (i: number, on: boolean, e?: PointerEvent<HTMLElement>) => {
    const pill = pills.current[i];
    if (!pill) return;
    if (on && e) {
      // Start from the entry point instead of sliding in from the last position.
      const rect = e.currentTarget.getBoundingClientRect();
      gsap.set(pill.el, { x: e.clientX - rect.left, y: e.clientY - rect.top });
    }
    gsap.to(pill.el, {
      scale: on ? 1 : 0.4,
      autoAlpha: on ? 1 : 0,
      duration: on ? 0.4 : 0.25,
      ease: on ? "back.out(2)" : "power2.in",
      overwrite: "auto",
    });
  };

  return (
    <div ref={root} className={styles.layer}>
      {heroHotspots.map((spot, i) => (
        <Link
          key={spot.href}
          href={spot.href}
          className={styles.hotspot}
          data-hotspot={i}
          aria-label={`View ${spot.label} project`}
          onPointerEnter={(e) => toggle(i, true, e)}
          onPointerMove={(e) => follow(i, e)}
          onPointerLeave={() => toggle(i, false)}
        >
          <span className={styles.pill} aria-hidden="true">
            View {spot.label} project
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M3 9 9 3M4 3h5v5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
          </span>
        </Link>
      ))}
    </div>
  );
}
