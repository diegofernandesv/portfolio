export const site = {
  name: "Diego",
  email: "diegofernandesvieiraa@gmail.com",
  // TODO: replace placeholders with real URLs
  linkedin: "https://www.linkedin.com/",
  cv: "/cv.pdf",
  about: "/about",
  tiktok: "https://www.tiktok.com/@fdez.uxui",
};

/** First frame of the hero video – shown until it can play, and used as its thumbnail. */
export const heroImage = "/images/scene-poster.jpg";
/** Hero background video. */
export const heroVideo = "/videos/scene.mp4";
/** Intrinsic size of the hero video – hotspot boxes are measured in these pixels. */
export const heroVideoSize = { width: 1920, height: 1080 };

export type VideoHotspot = {
  label: string;
  meta: string;
  href: string;
  /** Box in video pixels (the camera is static, so one box covers the whole clip). */
  box: { x: number; y: number; w: number; h: number };
};

/** Clickable screens inside the hero video (desktop only). */
export const heroHotspots: VideoHotspot[] = [
  {
    label: "Trailbound",
    meta: "Brand identity & Shopify",
    href: "/work/trailbound",
    box: { x: 740, y: 165, w: 252, h: 250 },
  },
];

export type CaseStudy = {
  title: string;
  tags: string;
  image: string;
  href: string;
};

export const caseStudies: CaseStudy[] = [
  { title: "SpilCafeen", tags: "Website", image: "/images/spilcafeen.png", href: "/work/spilcafeen" },
  { title: "Togevent", tags: "App, Web app", image: "/images/togevent.png", href: "#" },
  { title: "Bounty Hunters", tags: "Website", image: "/images/bounty-hunters.png", href: "#" },
  { title: "Kiwi", tags: "App", image: "/images/kiwi.png", href: "#" },
];

/** Placeholder heights from the Figma "Design Archive" row. */
export const archiveItems = [215, 455, 288, 215, 455];

export const projectCategories = ["UX/UI", "Coding", "Graphic Design", "Branding"] as const;
export type ProjectCategory = (typeof projectCategories)[number];

export type Project = {
  title: string;
  summary?: string;
  categories: ProjectCategory[];
  /** Landscape cover (1340×856). Omitted for projects that aren't ready yet. */
  cover?: string;
  /** Case-study route, when one exists. */
  href?: string;
};

/** Everything listed on /work. */
export const projects: Project[] = [
  {
    title: "Trailbound",
    summary: "Branding & visual identity for a Shopify store",
    categories: ["Branding"],
    cover: "/work/covers/trailbound.png",
    href: "/work/trailbound",
  },
  {
    title: "SpilCafeen",
    summary: "Figuring out what to play",
    categories: ["UX/UI"],
    cover: "/work/covers/spilcafeen.png",
    href: "/work/spilcafeen",
  },
  {
    title: "The Spotlight",
    summary: "Increasing visitor engagement through digital interaction",
    categories: ["UX/UI"],
    cover: "/work/covers/the-spotlight.png",
  },
  {
    title: "Copenhagen Fashion Week",
    categories: ["UX/UI"],
    cover: "/work/covers/cph-fashion-week.png",
  },
  {
    title: "VisitCaracas",
    categories: ["UX/UI", "Coding"],
    cover: "/work/covers/visitcaracas.png",
  },
  { title: "AllUNeed", categories: ["Graphic Design"] },
  { title: "Laeso Kur", categories: ["Graphic Design"] },
];

/* ---------- About ---------- */

export type Role = {
  period: string;
  title: string;
  org: string;
  current?: boolean;
  points: string[];
};

/** From Diego's CV (January 2026), updated September 2026. TODO: add exact months for the Bestseller roles. */
export const experience: Role[] = [
  {
    period: "2026 — Present",
    title: "Digital Product Designer · Student Worker",
    org: "Bestseller · Material Tech Team",
    current: true,
    points: [
      "Offered a student worker position on the Material Tech Team after my internship — continuing alongside my studies in Digital Concept Development.",
      "Designing internal digital products for material data, workflows, and decision-making, from user research to high-fidelity prototypes in Figma.",
      "Working with design systems, component libraries, and data-driven interfaces together with product owners, developers, and stakeholders.",
    ],
  },
  {
    period: "Internship · 2026",
    title: "Digital Product Design Intern",
    org: "Bestseller · Material Tech Team",
    points: [
      "Contributed to the design and improvement of internal digital products supporting material data, workflows, and decision-making.",
      "Translated user needs into wireframes, high-fidelity UI, and interactive prototypes in Figma.",
      "Collaborated closely with product owners, developers, and stakeholders in agile workflows.",
      "Conducted user research, usability testing, and design iterations to optimize usability and efficiency.",
      "Worked with design systems, component libraries, and data-driven interfaces (dashboards, forms, workflows).",
    ],
  },
  {
    period: "Feb — Jun 2025",
    title: "Web & Graphic Design Student Worker",
    org: "Volenta",
    points: [
      "Designed advertising materials, website layouts, and ESG reports for both internal projects and clients.",
      "Enhanced the visual identity of client brands through creative, results-driven campaigns.",
      "Contributed to improved client advertising account performance with effective, data-driven design.",
    ],
  },
  {
    period: "Oct 2022 — Jul 2024",
    title: "Graphic Designer & Social Media Manager",
    org: "A hotel and a bakery",
    points: [
      "Created visuals, managed social media channels, and developed engaging content for a hotel and a bakery.",
      "Maintained consistent branding and analyzed performance metrics to refine strategies, increasing visibility and customer engagement.",
    ],
  },
];

export const education: Role[] = [
  {
    period: "2026 — Present",
    title: "Digital Concept Development",
    org: "Business Academy Aarhus",
    current: true,
    points: ["Continuing my studies after finishing Multimedia Design, while working as a student worker at Bestseller."],
  },
  {
    period: "Aug 2024 — 2026",
    title: "Multimedia Design",
    org: "Business Academy Aarhus",
    points: [
      "Digital design, user experience (UX), and front-end development — with hands-on work in graphic design, web development, and digital marketing.",
    ],
  },
  {
    period: "Jan 2023 — Jul 2024",
    title: "Systems Engineering (studies interrupted)",
    org: "Universidad Metropolitana",
    points: ["Studied math, coding, and entrepreneurship, building analytical problem-solving and project management skills."],
  },
];

export const tools = [
  "Figma",
  "Photoshop",
  "Illustrator",
  "After Effects",
  "Premiere Pro",
  "AutoCAD",
  "HTML",
  "CSS",
  "JavaScript",
  "React",
];

export const languages = [
  { name: "Spanish", level: "Native" },
  { name: "English", level: "C1 · IELTS" },
  { name: "Portuguese", level: "B1" },
  { name: "Danish", level: "Module 2" },
];
