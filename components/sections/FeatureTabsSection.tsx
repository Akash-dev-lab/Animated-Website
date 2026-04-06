"use client";

import { memo, useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Container from "@/components/ui/Container";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { FeatureTabsSectionProps } from "@/lib/types";

gsap.registerPlugin(ScrollTrigger);

function FeatureTabsSection({ heading, tabs, activeTab }: FeatureTabsSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const activeContent =
    tabs.find((t) => t.id === activeTab)?.content ?? tabs[0]?.content ?? "";

  useEffect(() => {
    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        defaults: { ease: "power3.out", duration: 0.8 },
      });

      tl.fromTo(headingRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0 }).fromTo(
        contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0 },
        "-=0.4"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  return (
    <SectionWrapper id="features" className="bg-neutral-50 flex items-center">
      {/* Layered radial gradients for depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,0,0,0.04),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.03),transparent_60%)] pointer-events-none" />
      <div ref={sectionRef} className="w-full">
        <Container className="grid grid-cols-1 md:grid-cols-2 gap-16 py-24">
          {/* Left — section heading */}
          <div className="flex flex-col justify-center">
            <h2
              ref={headingRef}
              className="text-4xl md:text-5xl font-semibold text-neutral-900 leading-tight"
            >
              {heading}
            </h2>
          </div>

          {/* Right — tab panel */}
          <div className="flex flex-col gap-8">
            <div className="flex gap-4 border-b border-neutral-200 pb-2" role="tablist">
              {tabs.map((tab) =>
                tab.id === activeTab ? (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected="true"
                    className="text-sm pb-2 transition-colors text-neutral-900 border-b-2 border-neutral-900 font-medium"
                  >
                    {tab.label}
                  </button>
                ) : (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected="false"
                    className="text-sm pb-2 transition-colors text-neutral-400 hover:text-neutral-700"
                  >
                    {tab.label}
                  </button>
                )
              )}
            </div>

            {/* ANIMATION HOOK: tab content reveal */}
            <div ref={contentRef} role="tabpanel" className="text-neutral-600 text-base leading-relaxed">
              {activeContent}
            </div>
          </div>
        </Container>
      </div>
    </SectionWrapper>
  );
}

export default memo(FeatureTabsSection);
