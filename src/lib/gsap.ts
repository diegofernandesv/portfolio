"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Flip } from "gsap/Flip";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, CustomEase, Flip, Draggable, InertiaPlugin);

  // Slow start, long glide – used for the big loader/image moves.
  CustomEase.create("reveal", "0.46, 0, 0.09, 1");
  // Hesitates, then commits – used for the loader's final expansion.
  CustomEase.create("slowStart", "0.9, 0, 0.58, 1");
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export { gsap, ScrollTrigger, SplitText, CustomEase, Flip, Draggable, useGSAP };
