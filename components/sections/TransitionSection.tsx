"use client";

import { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Container from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { TransitionSectionProps } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

function TransitionSection({ headline, overlayText }: TransitionSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Headline fade-in on enter
      gsap.fromTo(
        headlineRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
          },
        }
      );

      // Overlay text parallax — moves slower than scroll (scrub)
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: -40,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <SectionWrapper id="transition" className="bg-neutral-950 flex items-center">
      {/* Directional gradient for text readability + subtle depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-transparent pointer-events-none" />
      {/* SCROLL HOOK: overlay text parallax */}
      <div ref={sectionRef} className="w-full h-full">
        <Container className="relative flex items-center justify-center h-full min-h-screen">
          <h2
            ref={headlineRef}
            className="text-7xl md:text-8xl font-semibold text-white leading-none tracking-tight select-none"
          >
            {headline}
          </h2>

          <div
            ref={overlayRef}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <span className="text-lg md:text-2xl font-light text-neutral-400 tracking-widest uppercase">
              {overlayText}
            </span>
          </div>
        </Container>
      </div>
    </SectionWrapper>
  );
}

export default memo(TransitionSection);
