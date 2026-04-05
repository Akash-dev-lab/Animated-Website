import { memo } from "react";
import type { SectionWrapperProps } from "@/lib/types";

// No animation or scroll logic here — this is a pure layout primitive.
// Animation hooks belong in the section components that use SectionWrapper.

function SectionWrapper({ children, id, className = "" }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`min-h-screen relative ${className}`.trim()}
    >
      {children}
    </section>
  );
}

export default memo(SectionWrapper);
