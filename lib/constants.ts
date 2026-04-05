import type { NavItem, TabItem } from "@/lib/types";

// ─── Design tokens ───────────────────────────────────────────────────────────

export const SPACING = {
  sm: "0.5rem",
  md: "1rem",
  lg: "2rem",
  xl: "4rem",
} as const;

export const COLORS = {
  primary: "#0f0f0f",
  secondary: "#f5f5f5",
  background: "#ffffff",
  foreground: "#171717",
} as const;

export const TYPOGRAPHY = {
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  display: "4.5rem",
} as const;

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: "Product", href: "#hero" },
  { label: "Features", href: "#features" },
  { label: "Nature", href: "#nature" },
  { label: "Get Started", href: "#cta" },
];

// ─── Feature tabs ─────────────────────────────────────────────────────────────

export const FEATURE_TABS: TabItem[] = [
  {
    id: "design",
    label: "Design",
    content: "Crafted with precision — every pixel intentional, every detail considered.",
  },
  {
    id: "performance",
    label: "Performance",
    content: "Built for speed. Optimised from the ground up for seamless, fluid experiences.",
  },
  {
    id: "sustainability",
    label: "Sustainability",
    content: "Made responsibly. Materials and processes chosen with the planet in mind.",
  },
];

// ─── Section copy ─────────────────────────────────────────────────────────────

export const HERO_COPY = {
  leftText: "Designed for those who demand more.",
  rightText: "Precision. Performance. Purpose.",
  productPlaceholderLabel: "[ Product Visual ]",
};

export const TRANSITION_COPY = {
  headline: "Beyond the ordinary.",
  overlayText: "A new standard.",
};

export const FEATURE_TABS_COPY = {
  heading: "What sets it apart.",
};

export const NATURE_COPY = {
  imagePlaceholderLabel: "[ Full-width Image / Video ]",
  overlayText: "Inspired by the world around us.",
};

export const CTA_COPY = {
  heading: "Be the first to experience it.",
  subheading: "Join the waitlist and get early access.",
  buttonLabel: "Join Waitlist",
  inputPlaceholder: "Enter your email",
};

export const FOOTER_COPY = {
  copyrightText: `© ${new Date().getFullYear()} Premium Product. All rights reserved.`,
};
