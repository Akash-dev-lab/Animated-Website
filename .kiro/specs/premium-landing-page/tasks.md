# Implementation Plan: Premium Landing Page

## Overview

Incremental build of a Next.js App Router landing page with TypeScript and Tailwind CSS. Each task group builds on the previous, ending with full page composition, dynamic imports, performance optimizations, and accessibility checks. No animation logic is implemented in this phase — only structural hooks (comments) are placed.

## Tasks

- [x] 1. Project setup
  - [x] 1.1 Initialise a Next.js project with the App Router, TypeScript, and Tailwind CSS
    - Use `create-next-app` with `--typescript`, `--tailwind`, and `--app` flags
    - Confirm `tsconfig.json` has `strict: true` and path alias `@/*` pointing to the project root
    - _Requirements: 1.1, 2.5_

  - [x] 1.2 Clean up `globals.css` — replace boilerplate with Tailwind import and base CSS variables
    - The file currently uses `@import "tailwindcss"` (Tailwind v4 syntax) — keep this, it replaces the v3 directives
    - Remove the default font-family override on `body` (will be handled by Geist font variables already in layout.tsx)
    - Keep the `--background` / `--foreground` CSS variables and dark mode media query — these are the design token foundation
    - _Requirements: 4.2_

  - [x] 1.3 Update `app/layout.tsx` — set correct Metadata and add Header/Footer slots
    - Change `metadata.title` from `"Create Next App"` to the product name
    - Change `metadata.description` to a meaningful product description
    - Add import comment placeholders for `Header` and `Footer` (to be wired in task 6.3)
    - _Requirements: 4.1, 4.3_

- [x] 2. Folder structure creation
  - [x] 2.1 Create all required component and lib directories at the workspace root
    - Create `components/layout`, `components/sections`, `components/ui`, and `lib` — the `app/` directory already exists
    - No `.gitkeep` files needed — each directory will be populated immediately in subsequent tasks
    - Note: the project root is the workspace root (not `temp-next/`) — all paths are relative to where `package.json` lives
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 3. Type definitions
  - [x] 3.1 Create `lib/types.ts` and define `NavItem` and `TabItem` interfaces
    - `NavItem`: `label: string`, `href: string`
    - `TabItem`: `id: string`, `label: string`, `content: string`
    - _Requirements: 2.2, 2.3_

  - [x] 3.2 Add `FeatureTab` interface and all component prop interfaces to `lib/types.ts`
    - `FeatureTab`: `tabs: TabItem[]`, `activeTab: string`
    - Add `HeaderProps`, `FooterProps`, `ContainerProps`, `SectionWrapperProps`
    - Add `HeroSectionProps`, `TransitionSectionProps`, `FeatureTabsSectionProps`, `NatureSectionProps`, `CTASectionProps`
    - Children props must be typed as `React.ReactNode`
    - _Requirements: 2.1, 2.4, 2.6_

- [x] 4. Constants setup
  - [x] 4.1 Create `lib/constants.ts` and export design token objects
    - Export `SPACING` with keys `sm`, `md`, `lg`, `xl`
    - Export `COLORS` with keys `primary`, `secondary`, `background`, `foreground`
    - Export `TYPOGRAPHY` with keys `base`, `lg`, `xl`, `2xl`, `display`
    - _Requirements: 3.1, 3.2, 3.3_

  - [x] 4.2 Export navigation and feature tab data from `lib/constants.ts`
    - Export `NAV_ITEMS: NavItem[]` with at least two placeholder entries
    - Export `FEATURE_TABS: TabItem[]` with at least three placeholder tab entries
    - Import `NavItem` and `TabItem` from `lib/types.ts` — no inline type definitions
    - _Requirements: 3.4, 3.5_

  - [x] 4.3 Export all section copy constants from `lib/constants.ts`
    - Export `HERO_COPY`, `TRANSITION_COPY`, `FEATURE_TABS_COPY`, `NATURE_COPY`, `CTA_COPY`, `FOOTER_COPY`
    - Each object must contain all string fields required by the corresponding section's props interface
    - _Requirements: 3.6, 3.7_

- [x] 5. UI primitives
  - [x] 5.1 Create `components/ui/Container.tsx`
    - Accepts `ContainerProps` (`children: React.ReactNode`, `className?: string`)
    - Renders a `<div>` with `max-w-7xl mx-auto px-6` (or equivalent Tailwind classes)
    - Merges optional `className` with base classes
    - Wrap the component with `React.memo`
    - No inline styles; no hardcoded content
    - _Requirements: 7.1, 7.2, 13.5, 15.1, 15.2_

  - [x] 5.2 Create `components/ui/SectionWrapper.tsx`
    - Accepts `SectionWrapperProps` (`children`, `id?`, `className?`)
    - Renders a `<section>` element with `min-h-screen relative` as default classes
    - Passes `id` to the `<section>` element for anchor linking
    - Does NOT contain any animation or scroll logic
    - Wrap with `React.memo`
    - _Requirements: 7.3, 7.4, 7.5, 7.6, 14.4_

  - [x] 5.3 Create `components/ui/SectionSkeleton.tsx`
    - Accepts a `dark?: boolean` prop
    - Renders a `min-h-screen` container whose background matches the page theme (light or dark based on `dark` prop)
    - Contains three `animate-pulse` shimmer bars: one at ~40% width (heading), one at ~70% width (body), one taller block (image/media area)
    - Used as the `loading` fallback in dynamic imports — must render without any client-only APIs
    - _Requirements: 13.4_

  - [x] 5.4 Create `components/ui/SectionErrorBoundary.tsx`
    - Implement as a React class component with `getDerivedStateFromError` and `componentDidCatch`
    - Accepts an optional `fallback?: React.ReactNode` prop for custom fallback UI
    - Default fallback: a `min-h-screen` container with a neutral error message
    - Does NOT crash the rest of the page when the wrapped section throws
    - _Requirements: 13.4_

  - [x] 5.5 Create `components/ui/useSectionPrefetch.ts`
    - Add `'use client'` directive at the top of the file
    - Accepts a `ref: React.RefObject<Element>` pointing to the current section and an array of dynamic import functions
    - Uses `IntersectionObserver` with `rootMargin: "0px 0px -20% 0px"` to detect when the current section is ~80% visible
    - On intersection, calls each import function to warm the module cache (no rendering)
    - Cleans up the observer on unmount via the `useEffect` return function
    - _Requirements: 13.1_

- [x] 6. Layout components
  - [x] 6.1 Create `components/layout/Header.tsx`
    - Accepts `HeaderProps` (`navItems: NavItem[]`)
    - Renders `<header>` with `position: fixed`, `top-0`, `z-50` Tailwind classes
    - Logo placeholder on the left as a `<span>` or `<div>` with visible label text
    - Renders `<nav>` → `<ul>` → `<li>` → `<a href={item.href}>` for each nav item
    - No `'use client'` directive — this is a Server Component
    - Must not exceed 150 lines
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 14.2_

  - [x] 6.2 Create `components/layout/Footer.tsx`
    - Accepts `FooterProps` (`copyrightText: string`, `links: NavItem[]`)
    - Renders `<footer>` with copyright text and each link as `<a href={item.href}>`
    - No `'use client'` directive — this is a Server Component
    - Must not exceed 150 lines
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 14.3_

  - [x] 6.3 Wire `Header` and `Footer` into `app/layout.tsx`
    - Import `Header` and `Footer`
    - Import `NAV_ITEMS` and `FOOTER_COPY` from `lib/constants.ts`
    - Pass `navItems={NAV_ITEMS}` to `Header` and `copyrightText={FOOTER_COPY.copyrightText}` + `links={NAV_ITEMS}` to `Footer`
    - `{children}` renders between `Header` and `Footer`
    - _Requirements: 4.4_

- [x] 7. Section components
  - [x] 7.1 Create `components/sections/HeroSection.tsx`
    - Accepts `HeroSectionProps` (`leftText`, `rightText`, `productPlaceholderLabel` — all `string`)
    - Renders inside `<SectionWrapper id="hero">`
    - Three-column flex layout: left text column | centered product placeholder `<div>` | right text column
    - `<h1>` heading in the left or center column (only `<h1>` on the page)
    - Product placeholder `<div>` contains `{productPlaceholderLabel}` text and the comment `{/* ANIMATION HOOK: product entrance */}`
    - Wrap with `React.memo`
    - No `'use client'` directive — this is a Server Component (static import, SSR)
    - Must not exceed 150 lines
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7, 14.6_

  - [x] 7.2 Create `components/sections/TransitionSection.tsx`
    - Add `'use client'` directive at the top
    - Accepts `TransitionSectionProps` (`headline: string`, `overlayText: string`)
    - Renders inside `<SectionWrapper id="transition">`
    - `headline` rendered at display-scale font size (`text-7xl` or equivalent); use `<h2>`
    - `overlayText` rendered as an absolutely positioned `<div>` over the headline
    - Overlay element includes the comment `{/* SCROLL HOOK: overlay text parallax */}`
    - Wrap with `React.memo`
    - Must not exceed 150 lines
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 14.6_

  - [x] 7.3 Create `components/sections/FeatureTabsSection.tsx`
    - Add `'use client'` directive at the top
    - Accepts `FeatureTabsSectionProps` (`heading: string`, `tabs: TabItem[]`, `activeTab: string`)
    - Renders inside `<SectionWrapper id="features">`
    - Two-column layout: left column with `<h2>` heading | right column with tab panel
    - Tab buttons rendered from `tabs` array; active tab visually distinguished via Tailwind classes
    - Content area renders `tabs.find(t => t.id === activeTab)?.content ?? tabs[0]?.content`
    - Content area includes the comment `{/* ANIMATION HOOK: tab content transition */}`
    - No `useState` — `activeTab` is controlled entirely by the prop passed from `page.tsx`
    - Wrap with `React.memo`
    - Must not exceed 150 lines
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.8, 14.6_

  - [x] 7.4 Create `components/sections/NatureSection.tsx`
    - Add `'use client'` directive at the top
    - Accepts `NatureSectionProps` (`imagePlaceholderLabel: string`, `overlayText: string`)
    - Renders inside `<SectionWrapper id="nature">`
    - Full-width, full-height background placeholder `<div>` with `imagePlaceholderLabel` text inside
    - Placeholder `<div>` includes the comment `{/* MEDIA HOOK: replace with next/image or video */}`
    - `overlayText` rendered as an absolutely positioned element over the placeholder; use `<h2>` or `<p>` as appropriate
    - Wrap with `React.memo`
    - Must not exceed 150 lines
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6, 14.6_

  - [x] 7.5 Create `components/sections/CTASection.tsx`
    - Add `'use client'` directive at the top
    - Accepts `CTASectionProps` (`heading`, `subheading`, `buttonLabel`, `inputPlaceholder` — all `string`)
    - Renders inside `<SectionWrapper id="cta">`
    - Vertically and horizontally centered layout
    - `<h2>` for `heading`, `<p>` for `subheading`
    - `<label htmlFor="cta-email">` paired with `<input id="cta-email" type="email" placeholder={inputPlaceholder} />`
    - `<button type="submit">{buttonLabel}</button>` adjacent to the input
    - Wrap with `React.memo`
    - Must not exceed 150 lines
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6, 12.7, 12.8, 12.9, 14.5, 14.6_

- [x] 8. Page composition
  - [x] 8.1 Replace the default `app/page.tsx` with the landing page Server Component
    - The current `page.tsx` is the default Next.js scaffold — replace it entirely
    - No `'use client'` directive — `page.tsx` is a Server Component
    - Import `HeroSection` statically from `@/components/sections/HeroSection`
    - Import all copy constants (`HERO_COPY`, `TRANSITION_COPY`, `FEATURE_TABS_COPY`, `NATURE_COPY`, `CTA_COPY`) and `FEATURE_TABS` from `lib/constants.ts`
    - Render `<main>` wrapping all sections
    - Render `<HeroSection {...HERO_COPY} />` as the first child of `<main>`
    - Leave placeholder comments for dynamic section imports (to be added in task 9)
    - _Requirements: 4.5, 13.3, 14.1_

- [x] 9. Dynamic imports setup
  - [x] 9.1 Add dynamic imports for `TransitionSection`, `FeatureTabsSection`, `NatureSection`, and `CTASection` in `app/page.tsx`
    - Use `next/dynamic` with `{ ssr: false }` for all four sections
    - `TransitionSection`, `FeatureTabsSection`, `CTASection`: use `loading: () => <SectionSkeleton />` as fallback
    - `NatureSection`: use `loading: () => <SectionSkeleton dark />` as fallback
    - Import `SectionSkeleton` from `@/components/ui/SectionSkeleton`
    - _Requirements: 13.1, 13.2, 13.4_

  - [x] 9.2 Wrap each dynamic section in `SectionErrorBoundary` inside `app/page.tsx`
    - Import `SectionErrorBoundary` from `@/components/ui/SectionErrorBoundary`
    - Wrap `TransitionSection`, `FeatureTabsSection`, `NatureSection`, and `CTASection` individually
    - `HeroSection` does NOT get an error boundary
    - Pass all required props from constants into each section inside its boundary
    - _Requirements: 13.4_

- [x] 10. Performance optimizations
  - [x] 10.1 Create `lib/useReducedMotion.ts`
    - Add `'use client'` directive at the top
    - Implement a hook that reads `window.matchMedia('(prefers-reduced-motion: reduce)')` and returns a boolean
    - Listens for `change` events on the media query list so it responds to OS-level setting changes at runtime
    - Cleans up the event listener on unmount
    - Import this hook into each of the four Client Component sections (`TransitionSection`, `FeatureTabsSection`, `NatureSection`, `CTASection`) and add a comment `{/* useReducedMotion: wire to animation logic in next phase */}` near the top of each component body
    - _Requirements: 13.5_

  - [x] 10.2 Verify `React.memo` is applied to all section and UI primitive components
    - Confirm `Container`, `SectionWrapper`, `HeroSection`, `TransitionSection`, `FeatureTabsSection`, `NatureSection`, and `CTASection` are all wrapped with `React.memo`
    - Confirm `Header` and `Footer` do not need `React.memo` (they are Server Components)
    - _Requirements: 13.5_

- [x] 11. Accessibility checks
  - [x] 11.1 Verify heading hierarchy across all sections
    - Confirm `<h1>` appears exactly once (in `HeroSection`)
    - Confirm `<h2>` is used for section-level headings in `TransitionSection`, `FeatureTabsSection`, `NatureSection`, and `CTASection`
    - Confirm `<h3>` is used for any sub-content headings (e.g., tab labels if promoted to headings)
    - No heading levels are skipped
    - _Requirements: 14.6_

  - [x] 11.2 Verify `CTASection` email input accessibility
    - Confirm `<label htmlFor="cta-email">` and `<input id="cta-email">` are correctly paired
    - Alternatively confirm `aria-label` is present on the input if `htmlFor`/`id` pairing is not used
    - _Requirements: 12.5, 14.5_

  - [x] 11.3 Verify semantic HTML structure across layout and section components
    - `Header` uses `<header>`, `<nav>`, `<ul>`, `<li>`, `<a>`
    - `Footer` uses `<footer>` and `<a>` elements
    - Each section is wrapped in `<section>` via `SectionWrapper`
    - `page.tsx` wraps all sections in `<main>`
    - _Requirements: 14.1, 14.2, 14.3, 14.4_

  - [x] 11.4 Final checkpoint — ensure the project builds without TypeScript errors
    - Run `tsc --noEmit` to confirm zero type errors
    - Confirm no `any` types exist across all source files
    - Confirm no inline `style` attributes are present in any component
    - Confirm no hardcoded image URLs, video URLs, or asset paths exist in component files
    - Ensure all tests pass, ask the user if questions arise.
    - _Requirements: 2.5, 15.1, 15.2, 15.3_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP (none in this plan — no PBT tasks apply to this UI-rendering feature)
- `page.tsx` is the single data injection point; no section component imports from `constants.ts` directly
- `HeroSection` is a static import (SSR); all other sections use `dynamic()` with `ssr: false`
- `'use client'` is required on all four below-fold section components and on both custom hooks (`useSectionPrefetch`, `useReducedMotion`)
- Server Components (`layout.tsx`, `page.tsx`, `Header`, `Footer`, `HeroSection`, `Container`, `SectionWrapper`) must not access `window`, `document`, or any browser-only API
- The design has no Correctness Properties that require property-based tests; unit/snapshot tests are the appropriate strategy for this feature
- This project uses **Tailwind CSS v4** — use `@import "tailwindcss"` in CSS files, not the v3 `@tailwind` directives. Tailwind utility classes work the same way in JSX
- The project root is the workspace root — all file paths (`app/`, `components/`, `lib/`) are relative to where `package.json` lives, not inside `temp-next/`
