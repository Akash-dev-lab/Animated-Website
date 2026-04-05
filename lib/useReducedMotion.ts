"use client";

import { useEffect, useState } from "react";

// Reads the OS-level prefers-reduced-motion setting.
// Returns true when the user has requested reduced motion.
// Listens for live changes so it responds if the setting is toggled while the page is open.
//
// Usage in animated sections (future phase):
//   const prefersReducedMotion = useReducedMotion()
//   if (prefersReducedMotion) { /* skip animation, show final state */ }

export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mql.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  return prefersReducedMotion;
}
