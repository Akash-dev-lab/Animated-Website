"use client";

import { useEffect } from "react";
import type { RefObject } from "react";

// Prefetches the next section's JS chunk when the current section is ~80% visible.
// This warms the module cache so the dynamic import resolves near-instantly
// by the time the user scrolls to the next section.

export function useSectionPrefetch(
  ref: RefObject<Element | null>,
  importFns: Array<() => Promise<unknown>>
): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || importFns.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          importFns.forEach((fn) => fn());
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -20% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // importFns is intentionally excluded — callers should pass a stable array
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
