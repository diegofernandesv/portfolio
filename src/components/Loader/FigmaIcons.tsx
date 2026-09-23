/** Minimal line icons approximating Figma's UI (16×16, stroke = currentColor). */
const paths = {
  home: "M2.5 7.5 8 3l5.5 4.5M4 6.5V13h8V6.5",
  file: "M4 1.5h5l3 3v10H4Z M9 1.5v3h3",
  sparkle: "M8 1.5 9.4 6.6 14.5 8 9.4 9.4 8 14.5 6.6 9.4 1.5 8 6.6 6.6Z",
  plusCircle: "M8 5v6M5 8h6 M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z",
  toolbox: "M2 6h12v7H2Z M5.5 6V3.5h5V6 M2 9h12",
  hexagon: "M8 1.5 13.5 4.7v6.6L8 14.5l-5.5-3.2V4.7Z M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  search: "M11 11l3.5 3.5 M12 7a5 5 0 1 1-10 0 5 5 0 0 1 10 0Z",
  plus: "M8 2.5v11M2.5 8h11",
  panel: "M2 3h12v10H2Z M6 3v10",
  clock: "M8 4.5V8l2.5 1.5 M14.5 8a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z",
  move: "M3.5 2.5 13 7l-4.2 1.3L7 12.8Z",
  frame: "M5 1.5v13M11 1.5v13M1.5 5h13M1.5 11h13",
  rect: "M3 3h10v10H3Z",
  pen: "M8 1.5 12.5 7 9.5 12.5h-3L3.5 7Z M8 1.5V7 M8.9 7.9a.9.9 0 1 1-1.8 0 .9.9 0 0 1 1.8 0Z",
  text: "M3 3h10M8 3v10",
  comment: "M2.5 13.5 3.8 10.4A5.5 5.5 0 1 1 5.6 12.2Z",
  actions:
    "M6 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M13 4.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M6 11.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0Z M11.5 10v3M10 11.5h3",
  draw: "M2 12c2-3 3-8 5-8s-1 7 1 7 2-5 4-5 1 3 2 3",
  layout: "M2.5 2.5h4v11h-4Z M9.5 2.5h4v5h-4Z M9.5 10h4v3.5h-4Z",
  component: "M8 1.5 11 4.5 8 7.5 5 4.5Z M8 8.5l3 3-3 3-3-3Z M4.5 5 7.5 8l-3 3-3-3Z M11.5 5l3 3-3 3-3-3Z",
  code: "M5.5 4 1.5 8l4 4M10.5 4l4 4-4 4",
  play: "M4.5 2.5 13 8l-8.5 5.5Z",
  eye: "M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8Z M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z",
  chevron: "M5 6.5 8 9.5l3-3",
  minus: "M3 8h10",
  close: "M4 4l8 8M12 4l-8 8",
  drop: "M8 2c2.5 3 4 5 4 7a4 4 0 1 1-8 0c0-2 1.5-4 4-7Z",
} as const;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 16 }: { name: IconName; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d={paths[name]} stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Coloured product badges used on Figma's home screen. */
export function ProductIcon({ kind }: { kind: "design" | "figjam" | "slides" | "make" }) {
  const glyph: Record<typeof kind, IconName> = {
    design: "pen",
    figjam: "comment",
    slides: "rect",
    make: "sparkle",
  };
  return (
    <span data-product={kind}>
      <Icon name={glyph[kind]} size={13} />
    </span>
  );
}
