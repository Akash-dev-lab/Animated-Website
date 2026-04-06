"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

interface SectionTransitionProps {
  children: ReactNode;
}

// Wraps sections to add smooth fade + blur transitions on scroll.
// Creates visual continuity between sections for storytelling flow.

export default function SectionTransition({ children }: SectionTransitionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const section = sectionRef.current;

      // Fade in + remove blur as section enters viewport
      gsap.fromTo(
        section,
        {
          opacity: 0.6,
          filter: "blur(4px)",
          scale: 0.98,
        },
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          ease: "none",
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 30%",
            scrub: true,
          },
        }
      );

      // Fade out + add blur as section exits viewport
      gsap.to(section, {
        opacity: 1,
        filter: "blur(0px)",
        ease: "power2.in",
        scrollTrigger: {
          trigger: section,
          start: "bottom 40%",
          end: "bottom 20%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <div ref={sectionRef} className="will-change-[opacity,filter]">
      {children}
    </div>
  );
}
