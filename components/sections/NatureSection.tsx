"use client";

import { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/ui/SectionWrapper";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { NatureSectionProps } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

function NatureSection({ imagePlaceholderLabel, overlayText }: NatureSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Background parallax scale + slow Y drift
      gsap.fromTo(
        bgRef.current,
        { scale: 1, y: 0 },
        {
          scale: 1.1,
          y: -60,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        }
      );

      // Subtle dark overlay fade-in on scroll
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        {
          opacity: 0.4,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 60%",
            end: "center center",
            scrub: 1,
          },
        }
      );

      // Text reveal on enter
      gsap.fromTo(
        textRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <SectionWrapper id="nature" className="bg-neutral-900 overflow-hidden">
      <div ref={sectionRef} className="absolute inset-0 w-full h-full">
        {/* MEDIA HOOK: replace with next/image or video */}
        <div
          ref={bgRef}
          className="absolute inset-0 w-full h-full bg-neutral-800 flex items-center justify-center"
        >
          <span className="text-xs text-neutral-600 tracking-widest uppercase">
            {imagePlaceholderLabel}
          </span>
        </div>

        {/* Dark overlay for depth */}
        <div ref={overlayRef} className="absolute inset-0 bg-black opacity-0" />
      </div>

      {/* Text overlay */}
      <div className="relative z-10 flex items-end justify-start h-full min-h-screen px-6 pb-16 md:px-16">
        <h2
          ref={textRef}
          className="text-4xl md:text-6xl font-light text-white leading-tight max-w-xl"
        >
          {overlayText}
        </h2>
      </div>
    </SectionWrapper>
  );
}

export default memo(NatureSection);
