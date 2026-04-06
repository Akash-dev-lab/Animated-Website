"use client";

import { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Container from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { CTASectionProps } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

function CTASection({ heading, subheading, buttonLabel, inputPlaceholder }: CTASectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <SectionWrapper id="cta" className="bg-neutral-50 flex items-center">
      <div ref={sectionRef} className="w-full">
        <Container className="relative flex flex-col items-center justify-center text-center gap-8 py-24">
          {/* Centered soft glow behind content */}
          <div className="absolute w-[600px] h-[600px] bg-black/4 blur-[140px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
          
          <div ref={contentRef} className="relative flex flex-col items-center gap-8 w-full z-10">
            <h2 className="text-4xl md:text-5xl font-semibold text-neutral-900 leading-tight max-w-xl">
              {heading}
            </h2>

            <p className="text-lg text-neutral-500 max-w-md">
              {subheading}
            </p>

            <form
              className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <label htmlFor="cta-email" className="sr-only">
                Email address
              </label>
              <input
                id="cta-email"
                type="email"
                placeholder={inputPlaceholder}
                className="flex-1 w-full px-4 py-3 rounded-full border border-neutral-300 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-full bg-black text-white text-sm font-medium transition-all duration-300 hover:scale-105 hover:bg-neutral-800 cursor-pointer"
              >
                {buttonLabel}
              </button>
            </form>
          </div>
        </Container>
      </div>
    </SectionWrapper>
  );
}

export default memo(CTASection);
