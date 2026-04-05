import { memo } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Container from "@/components/ui/Container";
import HeroWatchAnimation from "@/components/sections/HeroWatchAnimation";
import type { HeroSectionProps } from "@/lib/types";

// Server Component — static import, SSR, critical for LCP.
// Animation is isolated in HeroWatchAnimation (Client Component)
// so this component pays zero client bundle cost.

function HeroSection({ leftText, rightText, productPlaceholderLabel }: HeroSectionProps) {
  return (
    <SectionWrapper id="hero" className="bg-white">
      <Container className="h-full flex items-center justify-between gap-8 pt-20">
        {/* Left text */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-2xl font-light leading-snug text-neutral-800 max-w-xs">
            {leftText}
          </h1>
        </div>

        {/* Center — watch placeholder (animated client wrapper) */}
        {/* ANIMATION HOOK: watch entrance — handled by HeroWatchAnimation */}
        <HeroWatchAnimation label={productPlaceholderLabel} />

        {/* Right text */}
        <div className="flex-1 flex flex-col justify-center items-end text-right">
          <p className="text-2xl font-light leading-snug text-neutral-800 max-w-xs">
            {rightText}
          </p>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default memo(HeroSection);
