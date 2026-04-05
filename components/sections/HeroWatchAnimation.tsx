"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { useReducedMotion } from "@/lib/useReducedMotion";

interface HeroWatchAnimationProps {
  label: string;
}

// Isolated Client Component — keeps HeroSection as a Server Component.
// Only this tiny wrapper pays the client bundle cost.

export default function HeroWatchAnimation({ label }: HeroWatchAnimationProps) {
  const watchRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !watchRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        watchRef.current,
        { scale: 0.8, opacity: 0, rotation: -4 },
        { scale: 1, opacity: 1, rotation: 0, duration: 1.2, ease: "power3.out" }
      );
    });

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div
      ref={watchRef}
      className="shrink-0 w-64 h-64 md:w-96 md:h-96 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center shadow-xl"
    >
      <span className="text-xs text-neutral-400 tracking-widest uppercase">
        {label}
      </span>
    </div>
  );
}
