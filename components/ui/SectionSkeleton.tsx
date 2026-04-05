import type { SectionSkeletonProps } from "@/lib/types";

// Loading fallback for dynamically imported sections.
// Visually matches section background to prevent color flashes during lazy load.
// Uses animate-pulse shimmer bars to signal loading without a blank screen.

export default function SectionSkeleton({ dark = false }: SectionSkeletonProps) {
  const bg = dark ? "bg-neutral-900" : "bg-neutral-100";
  const shimmer = dark ? "bg-neutral-700" : "bg-neutral-300";

  return (
    <div className={`min-h-screen w-full flex flex-col justify-center px-6 gap-6 ${bg}`}>
      {/* Heading shimmer ~40% width */}
      <div className={`h-8 w-2/5 rounded-md animate-pulse ${shimmer}`} />
      {/* Body shimmer ~70% width */}
      <div className={`h-5 w-3/4 rounded-md animate-pulse ${shimmer}`} />
      {/* Media / image block shimmer */}
      <div className={`h-48 w-full rounded-xl animate-pulse ${shimmer}`} />
    </div>
  );
}
