import { memo } from "react";
import type { ContainerProps } from "@/lib/types";

function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`max-w-7xl mx-auto px-6 w-full ${className}`.trim()}>
      {children}
    </div>
  );
}

export default memo(Container);
