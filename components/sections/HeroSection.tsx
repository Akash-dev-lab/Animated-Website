import { memo } from "react";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Container from "@/components/ui/Container";
import HeroWatchAnimation from "@/components/sections/HeroWatchAnimation";
import type { HeroSectionProps } from "@/lib/types";

// Server Component — static import, SSR, critical for LCP.
// Watch animation is isolated in HeroWatchAnimation (Client Component)
// so this component pays zero client bundle cost.

function HeroSection({ leftText, rightText, productPlaceholderLabel }: HeroSectionProps) {
  return (
    <SectionWrapper id="hero" className="bg-[radial-gradient(circle_at_center,#f5f5f5,white_60%)]">
      {/* Mobile Layout - Vertical Centered */}
      <Container className="h-full md:hidden flex flex-col items-center justify-center gap-6 sm:gap-8 pt-20 pb-12 px-4">
        {/* Text 1 - Top */}
        <div className="flex flex-col items-center text-center px-6">
          <p className="text-base sm:text-lg font-light leading-relaxed text-neutral-600">
            {leftText}
          </p>
        </div>

        {/* Watch - Middle (between texts) */}
        <div className="relative flex justify-center items-center w-full">
          {/* Background radial lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_60%)] pointer-events-none" />

          {/* Outer glow */}
          <div className="absolute w-[350px] h-[350px] blur-[80px] bg-white/10 rounded-full" />

          {/* Inner glow */}
          <div className="absolute w-[220px] h-[220px] bg-white/20 blur-[60px] rounded-full" />
          
          <HeroWatchAnimation label={productPlaceholderLabel} />
        </div>

        {/* Text 2 - Bottom */}
        <div className="flex flex-col items-center text-center px-6">
          <p className="text-base sm:text-lg font-light leading-relaxed text-neutral-600">
            {rightText}
          </p>
        </div>
      </Container>

      {/* Desktop Layout - Horizontal 3-column */}
      <Container className="hidden md:flex h-full items-center justify-between gap-8 pt-20 px-4">
        {/* Left text */}
        <div className="flex-1 flex flex-col justify-center">
          <h1 className="text-xl lg:text-2xl font-light leading-snug text-neutral-800 max-w-xs">
            {leftText}
          </h1>
        </div>

        {/* Center — premium watch */}
        <div className="relative flex justify-center items-center">
          {/* Background radial lighting */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.08),transparent_60%)] pointer-events-none" />

          {/* Outer glow */}
          <div className="absolute w-[500px] h-[500px] blur-[100px] bg-white/10 rounded-full" />

          {/* Inner glow */}
          <div className="absolute w-[300px] h-[300px] bg-white/20 blur-[80px] rounded-full" />
          
          <HeroWatchAnimation label={productPlaceholderLabel} />
        </div>

        {/* Right text */}
        <div className="flex-1 flex flex-col justify-center items-end text-right">
          <p className="text-xl lg:text-2xl font-light leading-snug text-neutral-800 max-w-xs">
            {rightText}
          </p>
        </div>
      </Container>
    </SectionWrapper>
  );
}

export default memo(HeroSection);
