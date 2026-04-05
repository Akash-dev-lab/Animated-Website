"use client";

import { Component } from "react";
import type { ReactNode } from "react";
import type { SectionErrorBoundaryProps } from "@/lib/types";

interface State {
  hasError: boolean;
}

// Wraps each dynamic section individually so a crash in one section
// does not take down the rest of the page.

export default class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  State
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    // Replace with your error reporting service in production
    console.error("[SectionErrorBoundary]", error, info.componentStack);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="min-h-screen flex items-center justify-center bg-neutral-100">
            <p className="text-neutral-500 text-sm">
              This section could not be loaded.
            </p>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
