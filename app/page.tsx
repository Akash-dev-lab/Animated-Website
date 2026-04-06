import HeroSection from "@/components/sections/HeroSection";
import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/ui/SectionSkeleton";
import SectionErrorBoundary from "@/components/ui/SectionErrorBoundary";
import SectionTransition from "@/components/ui/SectionTransition";
import {
  HERO_COPY,
  TRANSITION_COPY,
  FEATURE_TABS_COPY,
  FEATURE_TABS,
  NATURE_COPY,
  CTA_COPY,
} from "@/lib/constants";

// Server Component — single data injection point.
// All section props flow from constants.ts through here.
// Dynamic imports with ssr:false live in DynamicSections (a Client Component).

export default function Page() {
  // Dynamic imports
  const TransitionSection = dynamic(
    () => import("@/components/sections/TransitionSection"),
    { loading: () => <SectionSkeleton /> },
  );

  const FeatureTabsSection = dynamic(
    () => import("@/components/sections/FeatureTabsSection"),
    { loading: () => <SectionSkeleton /> },
  );

  const NatureSection = dynamic(
    () => import("@/components/sections/NatureSection"),
    { loading: () => <SectionSkeleton dark /> },
  );

  const CTASection = dynamic(() => import("@/components/sections/CTASection"), {
    loading: () => <SectionSkeleton />,
  });

  return (
    <main>
      {/* HeroSection — static import, SSR, critical for LCP */}
      <HeroSection
        leftText={HERO_COPY.leftText}
        rightText={HERO_COPY.rightText}
        productPlaceholderLabel={HERO_COPY.productPlaceholderLabel}
      />

      <SectionTransition>
        <SectionErrorBoundary>
          <TransitionSection {...TRANSITION_COPY} />
        </SectionErrorBoundary>
      </SectionTransition>

      <SectionTransition>
        <SectionErrorBoundary>
          <FeatureTabsSection
            heading={FEATURE_TABS_COPY.heading}
            tabs={FEATURE_TABS}
            activeTab={FEATURE_TABS[0]?.id ?? ""}
          />
        </SectionErrorBoundary>
      </SectionTransition>

      <SectionTransition>
        <SectionErrorBoundary>
          <NatureSection {...NATURE_COPY} />
        </SectionErrorBoundary>
      </SectionTransition>

      <SectionTransition>
        <SectionErrorBoundary>
          <CTASection {...CTA_COPY} />
        </SectionErrorBoundary>
      </SectionTransition>
    </main>
  );
}
