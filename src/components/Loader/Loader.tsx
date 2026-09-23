"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, type CSSProperties } from "react";
import { heroImage, heroVideo } from "@/lib/content";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { useIntro } from "../IntroProvider";
import { Icon, ProductIcon, type IconName } from "./FigmaIcons";
import styles from "./Loader.module.css";

const FILE_NAME = "Portfolio- Diego 2026";
const VIDEO_NAME = heroVideo.split("/").pop() ?? "hero.mp4";

const tabs = ["Thesis Research", "Branding Guide", "Design Sprint", "Portfolio"];

const recents = [
  { kind: "design", title: FILE_NAME, meta: "Edited 1m ago" },
  { kind: "slides", title: "Group presentation — sprint 1", meta: "Edited 1h ago" },
  { kind: "design", title: "Design Sprint — Team 3", meta: "Edited 2h ago" },
  { kind: "make", title: "Create Card Component", meta: "Edited 2mo ago" },
  { kind: "figjam", title: "Thesis Research — Material Suppliers", meta: "Edited 2d ago" },
] as const;

const products = [
  { kind: "design", label: "Design" },
  { kind: "figjam", label: "FigJam" },
  { kind: "slides", label: "Slides" },
  { kind: "make", label: "Make" },
] as const;

const rail: IconName[] = ["file", "sparkle", "plusCircle", "toolbox"];
const tools: { icon: IconName; caret?: boolean }[] = [
  { icon: "move", caret: true },
  { icon: "frame", caret: true },
  { icon: "rect", caret: true },
  { icon: "pen", caret: true },
  { icon: "text", caret: true },
  { icon: "comment", caret: true },
  { icon: "actions" },
];
const presets = ["Phone", "Tablet", "Desktop", "Presentation", "Watch", "Paper", "Social media", "Figma Community", "Archive"];
const rulerMarks = Array.from({ length: 36 }, (_, i) => -350 + i * 50);

/**
 * Loader that replays making this site in Figma: open a Design file, pick the
 * Frame tool, drag out "Frame 1", give it the hero image as fill – then zoom to
 * 100%, where the frame lands exactly on the real hero card.
 */
export default function Loader() {
  const root = useRef<HTMLDivElement>(null);
  const { phase, finish } = useIntro();
  // The intro only plays when a visit starts on the home page.
  const isHome = usePathname() === "/";

  useEffect(() => {
    if (!isHome) finish();
  }, [isHome, finish]);

  useGSAP(
    (_, contextSafe) => {
      const el = root.current;
      if (!el || !contextSafe) return;

      if (prefersReducedMotion()) {
        finish();
        return;
      }

      const q = gsap.utils.selector(el);
      const one = (selector: string) => q(selector)[0] as HTMLElement;
      const center = (node: Element) => {
        const r = node.getBoundingClientRect();
        return { x: r.left + r.width / 2, y: r.top + r.height / 2 };
      };

      const cursor = one(`.${styles.cursor}`);
      const home = one(`.${styles.home}`);
      const editor = one(`.${styles.editor}`);
      const designButton = one(`.${styles.product}`);
      const activeTab = one(`.${styles.tabLabel}`);
      const [moveTool, frameTool] = q(`.${styles.tool}`);
      const canvas = one(`.${styles.canvas}`);
      const frame = one(`.${styles.frame}`);
      const fill = one(`.${styles.fill}`);
      const fillVideo = one(`.${styles.fillVideo}`) as HTMLVideoElement;
      const dragFile = one(`.${styles.dragFile}`);
      const dropBadge = one(`.${styles.dropBadge}`);
      const fillSwatch = one(`.${styles.fillSwatch}`);
      const badge = one(`.${styles.badge}`);
      const zoomLabel = one(`.${styles.zoom}`);
      const wField = one("[data-field=w]");
      const hField = one("[data-field=h]");
      const frameChrome = q(`.${styles.frameLabel}, .${styles.handle}, .${styles.badge}`);
      const heroCard = document.querySelector("[data-hero-card]");

      const hero = heroCard?.getBoundingClientRect() ?? new DOMRect(0, 0, 1406, 785);
      const c = canvas.getBoundingClientRect();
      const aspect = hero.width / hero.height;
      const w = Math.min(c.width * 0.66, c.height * 0.62 * aspect);
      const h = w / aspect;
      const start = { x: c.left + (c.width - w) / 2, y: c.top + (c.height - h) / 2 - 16 };
      const zoom = w / hero.width;

      const size = { w: 0, h: 0 };
      let dragging = false;
      const render = () => {
        gsap.set(frame, { width: size.w, height: size.h });
        const dims = [Math.round(size.w / zoom), Math.round(size.h / zoom)];
        badge.textContent = `${dims[0]} × ${dims[1]}`;
        wField.textContent = String(dims[0]);
        hField.textContent = String(dims[1]);
        if (dragging) gsap.set(cursor, { x: start.x + size.w, y: start.y + size.h });
      };

      const click = (tl: gsap.core.Timeline, at: gsap.Position) =>
        tl.to(cursor, { scale: 0.8, duration: 0.08, yoyo: true, repeat: 1, ease: "power2.inOut" }, at);
      const swap = (remove: Element, add: Element, className: string) => {
        remove.classList.remove(className);
        add.classList.add(className);
      };
      const show = (selector: string) => q(selector).forEach((n) => n.removeAttribute("hidden"));
      const hide = (selector: string) => q(selector).forEach((n) => n.setAttribute("hidden", ""));

      const design = center(designButton);
      const frameIcon = center(frameTool);
      gsap.set(frame, { left: start.x, top: start.y, width: 0, height: 0 });
      zoomLabel.textContent = `${Math.round(zoom * 100)}%`;

      // Phase 1 – home screen → new Design file → Frame tool → drag.
      const intro = gsap.timeline({ delay: 0.1, onUpdate: render }).timeScale(1.15);
      intro
        .from(q(`.${styles.app}`), { autoAlpha: 0, duration: 0.3, ease: "power2.out" }, 0)
        .fromTo(
          cursor,
          { x: window.innerWidth * 0.72, y: window.innerHeight * 0.9, autoAlpha: 0 },
          { x: design.x, y: design.y, autoAlpha: 1, duration: 0.6, ease: "power3.inOut" },
          0.1,
        )
        .call(() => designButton.classList.add(styles.hover), [], 0.55);
      click(intro, 0.72);
      intro
        .to(home, { autoAlpha: 0, scale: 0.985, duration: 0.2, ease: "power2.in" }, 0.82)
        .call(() => (activeTab.textContent = FILE_NAME), [], 0.9)
        .fromTo(editor, { autoAlpha: 0, scale: 0.99 }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: "power2.out" }, 0.92)
        .to(cursor, { x: frameIcon.x, y: frameIcon.y, duration: 0.45, ease: "power3.inOut" }, 1.05)
        .call(() => frameTool.classList.add(styles.hover), [], 1.4);
      click(intro, 1.5);
      intro
        .call(
          () => {
            swap(moveTool, frameTool, styles.active);
            hide("[data-panel=page]");
            show("[data-panel=presets]");
          },
          [],
          1.55,
        )
        .call(() => cursor.classList.add(styles.crosshair), [], 1.62)
        .to(cursor, { x: start.x, y: start.y, duration: 0.4, ease: "power3.inOut" }, 1.62)
        .call(
          () => {
            dragging = true;
            hide("[data-panel=presets]");
            show("[data-panel=frame]");
            show("[data-layer]");
          },
          [],
          2.05,
        )
        .set([frame, ...frameChrome], { autoAlpha: 1 }, 2.05)
        .to(size, { w: w * 0.86, duration: 0.7, ease: "power2.inOut" }, 2.05)
        .to(size, { h: h * 0.82, duration: 0.7, ease: "power3.inOut" }, 2.05);

      // Phase 2 – once assets are in: release, drag the video in from Finder, drop it, zoom to 100%.
      const outro = contextSafe(() => {
        const target = heroCard?.getBoundingClientRect() ?? hero;
        const radius = parseFloat(getComputedStyle(heroCard ?? frame).borderRadius) || 48;
        const drop = { x: start.x + w * 0.56, y: start.y + h * 0.48 };
        const origin = `${((drop.x - start.x) / w) * 100}% ${((drop.y - start.y) / h) * 100}%`;

        // Keep the page's hero video on the same frame as ours so the hand-off doesn't skip.
        const syncHeroVideo = () => {
          const heroVid = document.querySelector<HTMLVideoElement>("[data-hero-video]");
          if (!heroVid) return;
          heroVid.currentTime = fillVideo.currentTime;
          heroVid.play().catch(() => undefined);
        };

        // Only the drag tween re-renders; afterwards the frame animates its own box.
        const tl = gsap.timeline({ onComplete: finish });
        tl.to(size, { w, h, duration: 0.3, ease: "power3.out", onUpdate: render }, 0);
        click(tl, 0.28);
        tl.call(
          () => {
            dragging = false;
            cursor.classList.remove(styles.crosshair);
            swap(frameTool, moveTool, styles.active);
          },
          [],
          0.34,
        )
          // Out of the window to grab the video from Finder…
          .to(cursor, { x: window.innerWidth + 40, y: window.innerHeight * 0.55, duration: 0.3, ease: "power2.in" }, 0.36)
          .set(dragFile, { autoAlpha: 1 }, 0.66)
          // …and back over Frame 1 with it.
          .to(cursor, { x: drop.x, y: drop.y, duration: 0.6, ease: "power3.out" }, 0.68)
          .call(() => frame.classList.add(styles.dropTarget), [], 1.02)
          .fromTo(dropBadge, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.25, ease: "back.out(3)" }, 1.02);
        click(tl, 1.3);
        tl.to(dragFile, { scale: 0.4, autoAlpha: 0, duration: 0.25, ease: "power2.in" }, 1.34)
          .call(
            () => {
              frame.classList.remove(styles.dropTarget);
              fillSwatch.classList.add(styles.videoFill);
              fillVideo.currentTime = 0;
              fillVideo.play().catch(() => undefined);
            },
            [],
            1.38,
          )
          .fromTo(
            fill,
            { clipPath: `circle(0% at ${origin})` },
            { clipPath: `circle(150% at ${origin})`, duration: 0.8, ease: "power3.inOut" },
            1.38,
          )
          .fromTo(q(`.${styles.fillMedia}`), { scale: 1.15 }, { scale: 1, duration: 1, ease: "power3.out" }, 1.38)
          .to([...frameChrome, cursor], { autoAlpha: 0, duration: 0.2 }, 1.95)
          .to(frame, { "--outline": 0, duration: 0.2 }, 1.95)
          .call(syncHeroVideo, [], 1.97)
          .to(q(`.${styles.app}`), { autoAlpha: 0, duration: 0.35, ease: "power2.out" }, 1.97)
          .to(
            frame,
            {
              left: target.left,
              top: target.top,
              width: target.width,
              height: target.height,
              borderRadius: radius,
              duration: 0.95,
              ease: "reveal",
            },
            1.97,
          )
          .to(q(`.${styles.bg}`), { autoAlpha: 0, duration: 0.5, ease: "power2.inOut" }, 2.2);
      });

      const videoReady = new Promise<void>((resolve) => {
        if (fillVideo.readyState >= 3) return resolve();
        fillVideo.addEventListener("canplay", () => resolve(), { once: true });
        fillVideo.addEventListener("error", () => resolve(), { once: true });
      });
      const images = q("img") as HTMLImageElement[];
      const assetsReady = Promise.all([
        document.fonts.ready,
        videoReady,
        ...images.map((img) => img.decode().catch(() => undefined)),
      ]);
      const timeout = new Promise((resolve) => setTimeout(resolve, 8000));

      let cancelled = false;
      Promise.all([Promise.race([assetsReady, timeout]), intro.then()]).then(() => {
        if (!cancelled) outro();
      });

      return () => {
        cancelled = true;
      };
    },
    { scope: root },
  );

  if (phase === "done" || !isHome) return null;

  return (
    <div ref={root} className={styles.loader} role="status" aria-label="Loading">
      <div className={styles.bg} />

      <div className={styles.app} aria-hidden="true">
        {/* Desktop app tab bar */}
        <div className={styles.tabbar}>
          <span className={styles.lights}>
            <i />
            <i />
            <i />
          </span>
          <span className={styles.homeTab}>
            <Icon name="home" />
          </span>
          {tabs.map((tab) => (
            <span key={tab} className={styles.tab}>
              {tab}
            </span>
          ))}
          <span className={`${styles.tab} ${styles.tabActive}`}>
            <span className={styles.tabLabel}>New file</span>
            <Icon name="close" size={12} />
          </span>
        </div>

        <div className={styles.stage}>
          {/* Figma home: create menu + search */}
          <div className={styles.home}>
            <div className={styles.products}>
              {products.map((p) => (
                <span key={p.kind} className={styles.product}>
                  <ProductIcon kind={p.kind} />
                  {p.label}
                </span>
              ))}
              <span className={`${styles.product} ${styles.more}`}>
                More <Icon name="chevron" size={12} />
              </span>
            </div>
            <div className={styles.search}>
              <div className={styles.searchField}>
                <Icon name="search" size={14} />
                <span className={styles.caret} />
                <span className={styles.placeholder}>Search</span>
              </div>
              <p className={styles.recentTitle}>Recent</p>
              {recents.map((r) => (
                <div key={r.title} className={styles.recent}>
                  <ProductIcon kind={r.kind} />
                  <span>
                    <strong>{r.title}</strong>
                    <small>{r.meta}</small>
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Figma editor */}
          <div className={styles.editor}>
            <aside className={styles.rail}>
              <span className={styles.railLogo}>
                <i />
                <i />
                <i />
                <i />
                <i />
              </span>
              {rail.map((icon, i) => (
                <span key={icon} className={`${styles.railIcon} ${i === 0 ? styles.railActive : ""}`}>
                  <Icon name={icon} />
                </span>
              ))}
              <span className={styles.railIcon}>
                <Icon name="hexagon" />
              </span>
            </aside>

            <aside className={styles.left}>
              <div className={styles.fileHead}>
                <div>
                  <strong>
                    {FILE_NAME} <Icon name="chevron" size={12} />
                  </strong>
                  <small>Drafts</small>
                </div>
                <Icon name="panel" />
              </div>
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <strong>Pages</strong>
                  <span>
                    <Icon name="search" size={14} />
                    <Icon name="plus" size={14} />
                  </span>
                </div>
                <div className={`${styles.row} ${styles.rowCurrent}`}>Portfolio</div>
              </div>
              <div className={styles.section}>
                <div className={styles.sectionHead}>
                  <strong>Layers</strong>
                </div>
                <div className={`${styles.row} ${styles.rowSelected}`} data-layer="" hidden>
                  <Icon name="frame" size={12} /> Frame 1
                </div>
              </div>
            </aside>

            <div className={styles.workspace}>
              <div className={styles.rulerTop}>
                {rulerMarks.map((n, i) => (
                  <span key={n} style={{ left: 40 + i * 66 }}>
                    {n}
                  </span>
                ))}
              </div>
              <div className={styles.rulerLeft}>
                {rulerMarks.map((n, i) => (
                  <span key={n} style={{ top: 40 + i * 66 }}>
                    {n}
                  </span>
                ))}
              </div>
              <div className={styles.canvas} />

              <div className={styles.toolbar}>
                <div className={styles.toolGroup}>
                  {tools.map((t, i) => (
                    <span key={t.icon} className={styles.toolWrap}>
                      <span className={`${styles.tool} ${i === 0 ? styles.active : ""}`}>
                        <Icon name={t.icon} size={18} />
                      </span>
                      {t.caret && (
                        <span className={styles.toolCaret}>
                          <Icon name="chevron" size={10} />
                        </span>
                      )}
                    </span>
                  ))}
                </div>
                <div className={`${styles.toolGroup} ${styles.toolGroupAlt}`}>
                  {(["draw", "layout", "component", "code"] as IconName[]).map((icon) => (
                    <span key={icon} className={styles.tool}>
                      <Icon name={icon} size={16} />
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <aside className={styles.right}>
              <div className={styles.rightTop}>
                <span className={styles.avatar}>D</span>
                <Icon name="chevron" size={12} />
                <span className={styles.spacer} />
                <Icon name="play" />
                <Icon name="chevron" size={12} />
                <span className={styles.share}>Share</span>
              </div>
              <div className={styles.rightTabs}>
                <span className={styles.rightTabActive}>Design</span>
                <span>Prototype</span>
                <span className={styles.spacer} />
                <span className={styles.zoom}>100%</span>
                <Icon name="chevron" size={12} />
              </div>

              <div data-panel="page">
                <div className={styles.prop}>
                  <strong>Page</strong>
                  <div className={styles.fieldRow}>
                    <span className={styles.field}>
                      <i className={styles.swatch} style={{ background: "#1e1e1e" }} />
                      1E1E1E
                    </span>
                    <span className={styles.fieldSmall}>100 %</span>
                    <Icon name="eye" />
                  </div>
                </div>
                <div className={styles.propHead}>
                  <strong>Styles</strong>
                  <Icon name="plus" size={14} />
                </div>
                <div className={styles.propHead}>
                  <strong>Export</strong>
                  <Icon name="plus" size={14} />
                </div>
              </div>

              <div data-panel="presets" hidden>
                <div className={styles.propHead}>
                  <strong>Frame</strong>
                </div>
                {presets.map((p) => (
                  <div key={p} className={styles.preset}>
                    <i className={styles.triangle} />
                    {p}
                  </div>
                ))}
              </div>

              <div data-panel="frame" hidden>
                <div className={styles.propHead}>
                  <strong>
                    Frame <Icon name="chevron" size={12} />
                  </strong>
                  <span className={styles.propIcons}>
                    <Icon name="code" size={14} />
                    <Icon name="component" size={14} />
                  </span>
                </div>
                <div className={styles.prop}>
                  <strong>Position</strong>
                  <div className={styles.fieldRow}>
                    <span className={styles.field}>
                      <em>X</em> 0
                    </span>
                    <span className={styles.field}>
                      <em>Y</em> 0
                    </span>
                  </div>
                </div>
                <div className={styles.prop}>
                  <strong>Layout</strong>
                  <div className={styles.fieldRow}>
                    <span className={styles.field}>
                      <em>W</em> <b data-field="w">0</b>
                    </span>
                    <span className={styles.field}>
                      <em>H</em> <b data-field="h">0</b>
                    </span>
                  </div>
                  <label className={styles.check}>
                    <i /> Clip content
                  </label>
                </div>
                <div className={styles.prop}>
                  <strong>Appearance</strong>
                  <div className={styles.fieldRow}>
                    <span className={styles.field}>100%</span>
                    <span className={styles.field}>0</span>
                  </div>
                </div>
                <div className={styles.prop}>
                  <div className={styles.propHeadInline}>
                    <strong>Fill</strong>
                    <Icon name="plus" size={14} />
                  </div>
                  <div className={styles.fieldRow}>
                    <span
                      className={`${styles.field} ${styles.fillSwatch}`}
                      style={{ "--poster": `url(${heroImage})` } as CSSProperties}
                    >
                      <i className={styles.swatch} />
                      <span className={styles.fillHex}>FFFFFF</span>
                      <span className={styles.fillType}>Video</span>
                    </span>
                    <span className={styles.fieldSmall}>100 %</span>
                    <Icon name="eye" />
                  </div>
                </div>
                {["Stroke", "Effects", "Export"].map((label) => (
                  <div key={label} className={styles.propHead}>
                    <strong>{label}</strong>
                    <Icon name="plus" size={14} />
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* The frame being drawn – later zooms onto the real hero card. */}
      <div className={styles.frame}>
        <div className={styles.fill}>
          <div className={styles.fillMedia}>
            <video className={styles.fillVideo} src={heroVideo} poster={heroImage} muted loop playsInline preload="auto" />
          </div>
        </div>
        <span className={styles.frameLabel}>Frame 1</span>
        <span className={styles.handle} data-pos="tl" />
        <span className={styles.handle} data-pos="tr" />
        <span className={styles.handle} data-pos="bl" />
        <span className={styles.handle} data-pos="br" />
        <span className={styles.badge}>0 × 0</span>
      </div>

      <div className={styles.cursor} aria-hidden="true">
        <svg className={styles.arrow} width="18" height="22" viewBox="0 0 18 22" fill="none">
          <path
            d="M1.5 1.5v16.2l4.4-4.3 3 6.8 2.8-1.2-3-6.7h6.2L1.5 1.5Z"
            fill="#111"
            stroke="#fff"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <svg className={styles.cross} width="21" height="21" viewBox="0 0 21 21" fill="none">
          <path d="M10.5 1v19M1 10.5h19" stroke="#fff" strokeWidth="3" />
          <path d="M10.5 1v19M1 10.5h19" stroke="#111" strokeWidth="1" />
        </svg>

        {/* Finder drag ghost */}
        <div className={styles.dragFile}>
          <div className={styles.dragThumb}>
            <Image src={heroImage} alt="" fill sizes="120px" loading="eager" className={styles.img} />
            <span className={styles.dragPlay}>
              <Icon name="play" size={10} />
            </span>
            <span className={styles.dropBadge}>+</span>
          </div>
          <span className={styles.dragName}>{VIDEO_NAME}</span>
        </div>
      </div>
    </div>
  );
}
