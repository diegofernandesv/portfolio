"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

/** "loading" while the loader plays, "done" once it has handed off to the page. */
export type IntroPhase = "loading" | "done";

type IntroContextValue = {
  phase: IntroPhase;
  finish: () => void;
};

const IntroContext = createContext<IntroContextValue | null>(null);

export function IntroProvider({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<IntroPhase>("loading");
  const finish = useCallback(() => setPhase("done"), []);
  const value = useMemo(() => ({ phase, finish }), [phase, finish]);

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  const ctx = useContext(IntroContext);
  if (!ctx) throw new Error("useIntro must be used inside <IntroProvider>");
  return ctx;
}
