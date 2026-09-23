import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { CaseChapter, CaseFigure, CaseHeader, CaseIntro, CaseNext, CasePage } from "@/components/CaseStudy/CaseStudy";
import CaseAccordion from "@/components/CaseStudy/CaseAccordion";
import InViewVideo from "@/components/CaseStudy/InViewVideo";
import PillButton from "@/components/PillButton/PillButton";
import RevealMedia from "@/components/RevealMedia";
import RevealText from "@/components/RevealText";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Spilcaféen — Diego",
  description:
    "Spilcaféen: a UX/UI case study on making board game discovery simple, fun and stress-free for a Danish board game café chain.",
};

const IMG = "/work/spilcafeen";
const PROTOTYPE_URL =
  "https://www.figma.com/proto/2eQpcFC1snkJi8UzOeiHII/Spilcafeen-Prototypes?page-id=125%3A398&node-id=811-5792&viewport=156%2C20%2C0.19&t=ttc0Jy7ofsA4Yba4-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=811%3A5792";

const facts = [
  { label: "Client", value: "Spilcaféen" },
  { label: "Duration", value: "4 weeks" },
  { label: "Team", value: "4 people" },
  { label: "Year", value: "February 2025" },
  { label: "My role", value: "Research, wireframes, UI, design system" },
];

export default function SpilcafeenPage() {
  return (
    <CasePage style={{ "--case-accent": "#c10f25" } as CSSProperties}>
      <CaseHeader
        eyebrow="Case study — UX/UI · Team project"
        title="Spilcaféen"
        lede="Spilcaféen is a Danish board game café chain with a huge collection of games — and a lot of guests who didn’t know what to play."
        facts={facts}
      />

      <CaseFigure
        src={`${IMG}/cover.png`}
        alt="Spilcaféen app screens on four phones: home, game list and game details"
        width={1512}
        height={472}
        sizes="100vw"
        preload
        className={styles.cover}
      />

      <CaseIntro>
        <RevealText as="p" stagger={0.05}>
          For many guests, the experience of choosing what to play was overwhelming due to a lack of structured
          information, while the café’s existing website only provided shelf numbers.
        </RevealText>
        <RevealText as="p" stagger={0.05}>
          Our <em>challenge</em> was to design a digital solution that makes game discovery simple, fun, and
          stress-free.
        </RevealText>
        <RevealText as="p" stagger={0.05}>
          By applying a structured UX research and design process, we created a digital solution that simplified game
          discovery, reduced choice overload, and delivered a fun, inviting experience aligned with Spilcaféen’s cozy
          café atmosphere.
        </RevealText>
      </CaseIntro>

      <CaseChapter
        title="Design process"
        body={[
          "Using the Double Diamond framework, we structured our design process around research, ideation, and iteration. This method helped us stay user-focused while fostering clarity, teamwork, and creativity.",
        ]}
      >
        <CaseFigure
          src={`${IMG}/double-diamond.png`}
          alt="Double Diamond framework: discover, define, develop, deliver"
          width={2000}
          height={1052}
          variant="panel"
        />
      </CaseChapter>

      <CaseAccordion
        items={[
          {
            label: "Discover",
            content: (
              <>
                <CaseChapter
                  title="Field research"
                  body={[
                    "To ensure that we meet our users’ needs, we began our research by immersing ourselves in the customer experience at Spilcaféen. We visited the café, played games, and observed how other customers interacted with the space.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/field-research.png`}
                    alt="Field research at Spilcaféen"
                    width={1490}
                    height={688}
                  />
                </CaseChapter>

                <CaseChapter
                  title="Desk research"
                  body={[
                    "Through our desk research, we analyzed reports, forums, and applied netnography to understand Spilcaféen’s target audience. We found that the core users are young adults (18–34), both men and women, including students, young professionals, and families, within an international and multicultural environment.",
                    "By reviewing community discussions, we uncovered key psychographic insights, such as the value users place on social interaction, fun, and technology detox. This highlighted the importance of designing a fast and intuitive way to find games, while supporting the social and relaxed environment that users seek.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/desk-research.png`}
                    alt="Desk research data and insights"
                    width={2000}
                    height={559}
                  />
                </CaseChapter>
              </>
            ),
          },
          {
            label: "Define",
            content: (
              <>
                <CaseChapter
                  title="Persona"
                  body={[
                    "From our target group research, we developed a user persona to summarize key user characteristics.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/persona.png`}
                    alt="Persona: Jimmy Cheaf, 30, marketing manager and passionate gamer"
                    width={2000}
                    height={911}
                    variant="panel"
                  />
                </CaseChapter>

                <CaseChapter
                  title="Rich picture"
                  layout="split"
                  flip
                  body={[
                    "Using a Rich Picture, we identified confusion in game selection, issues with the digital system, and crowding, while also highlighting the importance of community and social interaction. These insights guided our OOUX tables and user stories.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/rich-picture.png`}
                    alt="Rich picture of the café experience"
                    width={1065}
                    height={751}
                    variant="panel"
                  />
                </CaseChapter>

                <CaseChapter
                  title="OOUX"
                  layout="split"
                  body={[
                    "We created OOUX tables to capture the key properties from the rich picture, focusing on the game table as the most important feature for Spilcaféen’s customers.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/ooux.png`}
                    alt="Object-oriented UX tables"
                    width={1155}
                    height={757}
                    variant="panel"
                  />
                </CaseChapter>

                <CaseChapter
                  title="User stories"
                  layout="split"
                  flip
                  body={[
                    "Guests need quick game search and recommendations, while admins struggle with updating the site and poor usability. These insights shaped our goal of creating an intuitive and efficient solution.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/user-stories.svg`}
                    alt="User stories"
                    width={560}
                    height={184}
                    variant="panel"
                  />
                </CaseChapter>

                <CaseChapter
                  title="User story map"
                  layout="split"
                  body={[
                    "We mapped user stories to visualize the journey, prioritize features, and spot gaps. This showed the solution must focus on seamless game discovery with filters and clear information, which later informed our sketches and user flows.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/user-story-map.png`}
                    alt="User story map"
                    width={1265}
                    height={859}
                    variant="panel"
                  />
                </CaseChapter>

                <CaseChapter
                  title="User flow"
                  body={[
                    "We created user flows to define the journey and ensure smooth navigation. This helped us identify key pages like game overview and filtering, guiding our sketches toward a clear and user-friendly design.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/user-flow.png`}
                    alt="User flow diagram"
                    width={2500}
                    height={1686}
                    variant="panel"
                  />
                </CaseChapter>

                <CaseChapter
                  title="Card sorting test"
                  layout="split"
                  flip
                  body={[
                    "To validate our ideas, we conducted card sorting with 5 users. They ranked game time, number of players, category, and shelf location as the most important details. For filters, they prioritized language, genre, players, and difficulty.",
                    "These insights guided the design of our game cards and filtering system.",
                  ]}
                >
                  <CaseFigure
                    src={`${IMG}/card-sorting.png`}
                    alt="Card sorting test results"
                    width={1110}
                    height={1500}
                    variant="panel"
                    sizes="(max-width: 900px) 100vw, 600px"
                  />
                </CaseChapter>
              </>
            ),
          },
          {
            label: "Develop",
            content: (
              <>
                <CaseChapter
                  title="Ideation"
                  body={[
                    "We transformed our research insights into design concepts, creating sketches, wireframes, and prototypes for testing and iteration.",
                  ]}
                >
                  <div className={styles.row} style={{ "--a": 363 / 515, "--b": 954 / 529 } as CSSProperties}>
                    <CaseFigure
                      caption="Example of a sketch"
                      src={`${IMG}/sketch.png`}
                      alt="Hand-drawn wireframe sketch"
                      width={363}
                      height={515}
                      sizes="30vw"
                    />
                    <CaseFigure
                      caption="Moodboard"
                      src={`${IMG}/moodboard.png`}
                      alt="Moodboard"
                      width={954}
                      height={529}
                      sizes="70vw"
                      delay={0.08}
                    />
                  </div>
                  <CaseFigure
                    caption="Inspiration board"
                    src={`${IMG}/inspiration.png`}
                    alt="Inspiration board"
                    width={1384}
                    height={835}
                  />
                </CaseChapter>

                <CaseChapter
                  title="Design system"
                  body={[
                    "Building on our lo-fi wireframes, we created a design system in Figma to bring structure and consistency to the hi-fi prototype. It defined colors, typography, grids, and reusable UI components, all aligned with Spilcaféen’s cozy and playful brand identity.",
                  ]}
                >
                  <div className={styles.row} style={{ "--a": 1016 / 480, "--b": 309 / 480 } as CSSProperties}>
                    <CaseFigure
                      src={`${IMG}/typography.png`}
                      alt="Typography scale"
                      width={1016}
                      height={480}
                      variant="panel"
                      sizes="70vw"
                    />
                    <CaseFigure
                      src={`${IMG}/colors.png`}
                      alt="Colour palette"
                      width={309}
                      height={480}
                      variant="panel"
                      sizes="30vw"
                      delay={0.08}
                    />
                  </div>
                  <CaseFigure
                    src={`${IMG}/illustrations.png`}
                    alt="Illustration set"
                    width={1353}
                    height={160}
                    variant="panel"
                  />
                </CaseChapter>
              </>
            ),
          },
          {
            label: "Deliver",
            content: (
              <>
                <CaseChapter
                  title="Hi-fi prototype"
                  layout="split"
                  body={[
                    "Using the design system as a foundation, we developed high-fidelity prototypes in Figma. The hi-fi designs focused on creating a cozy, playful atmosphere with clear typography, warm colors, and consistent UI elements.",
                    "We also introduced the dice mascot and a game recommendation quiz to make the experience more engaging and user-friendly.",
                  ]}
                >
                  <RevealMedia className={styles.phone}>
                    <InViewVideo
                      className={styles.phoneVideo}
                      src="/videos/spilcafeen-prototype.webm"
                      poster={`${IMG}/prototype-poster.jpg`}
                      aria-label="Walkthrough of the Spilcaféen hi-fi prototype"
                    />
                  </RevealMedia>
                </CaseChapter>

                <CaseChapter
                  title="Mascot"
                  layout="split"
                  flip
                  body={[
                    "We created an old-school dice mascot inspired by “Cuphead” and vintage cartoons, designed to reflect Spilcaféen’s theme and bring a fun, memorable touch to the prototype.",
                    "Credits to Agata Popek & Gabriela Wozniak.",
                  ]}
                >
                  <div className={styles.row} style={{ "--a": 636 / 567, "--b": 314 / 276 } as CSSProperties}>
                    <CaseFigure
                      src={`${IMG}/mascot.png`}
                      alt="Dice mascot"
                      width={636}
                      height={567}
                      variant="panel"
                      sizes="30vw"
                    />
                    <CaseFigure
                      src={`${IMG}/mascot-variations.svg`}
                      alt="Mascot poses"
                      width={314}
                      height={276}
                      variant="panel"
                      sizes="30vw"
                      delay={0.08}
                    />
                  </div>
                </CaseChapter>
              </>
            ),
          },
        ]}
      />

      {/* ---------- Takeaways ---------- */}
      <section className={styles.takeaways}>
        <RevealText as="h2" className={styles.takeawaysTitle}>
          Takeaways
        </RevealText>
        <div className={styles.takeawaysBody}>
          <RevealText as="p" stagger={0.04}>
            Working on Spilcaféen as a team project gave me valuable experience with the full UX/UI process — research,
            wireframing, testing prototypes, and building a design system. Collaborating under deadlines taught me the
            importance of clear communication and adaptability.
          </RevealText>
          <RevealText as="p" stagger={0.04}>
            My contributions included research, wireframes, UI elements, and system design, while also exploring how
            playful details like a mascot can strengthen brand identity. Even though our testing was limited, the
            process of iterating together and seeing our ideas evolve into a functional prototype was incredibly
            rewarding.
          </RevealText>
          <div className={styles.cta}>
            <span>Want to see the full solution?</span>
            <PillButton href={PROTOTYPE_URL} tone="dark" target="_blank" rel="noreferrer">
              Open the Figma prototype ↗
            </PillButton>
          </div>
        </div>
      </section>

      <CaseNext current="/work/spilcafeen" />
    </CasePage>
  );
}
