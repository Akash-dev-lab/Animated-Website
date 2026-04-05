import type { ReactNode } from "react";

// ─── Data models ────────────────────────────────────────────────────────────

export interface NavItem {
  label: string;
  href: string;
}

export interface TabItem {
  id: string;
  label: string;
  content: string;
}

export interface FeatureTab {
  tabs: TabItem[];
  activeTab: string;
}

// ─── Layout component props ──────────────────────────────────────────────────

export interface HeaderProps {
  navItems: NavItem[];
}

export interface FooterProps {
  copyrightText: string;
  links: NavItem[];
}

// ─── UI primitive props ──────────────────────────────────────────────────────

export interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export interface SectionWrapperProps {
  children: ReactNode;
  id?: string;
  className?: string;
}

export interface SectionSkeletonProps {
  dark?: boolean;
}

export interface SectionErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// ─── Section component props ─────────────────────────────────────────────────

export interface HeroSectionProps {
  leftText: string;
  rightText: string;
  productPlaceholderLabel: string;
}

export interface TransitionSectionProps {
  headline: string;
  overlayText: string;
}

export interface FeatureTabsSectionProps {
  heading: string;
  tabs: TabItem[];
  activeTab: string;
}

export interface NatureSectionProps {
  imagePlaceholderLabel: string;
  overlayText: string;
}

export interface CTASectionProps {
  heading: string;
  subheading: string;
  buttonLabel: string;
  inputPlaceholder: string;
}
