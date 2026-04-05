**# Design Document: Premium Landing Page

## Overview

This document describes the technical architecture for a premium product landing page built with Next.js App Router, TypeScript, and Tailwind CSS. The design prioritizes modularity, type safety, and performance — with explicit hooks for future GSAP/scroll animation integration.

The page is a single-route application (`/`) composed of five full-viewport sections rendered in sequence. All content is driven by a central `lib/constants.ts` file, and all components are stateless and prop-driven in this phase. The architecture is designed so that adding animation, state, or media in future phases requires minimal structural change.

### Key Design Decisions

- **App Router over Pages Router**: Enables React Server Components by default, reducing client bundle size.
- **Constants-driven content**: All static text and design tokens live in one file, making copy updates trivial.
- **Prop-only components**: No component owns state in this phase. This makes every section independently testable and composable.
- **Dynamic imports for below-fold sections**: Reduces initial JS bundle; HeroSection loads synchronously for LCP.
- **`React.memo` on leaf components**: Prevents unnecessary re-renders when parent re-renders (e.g., if state is added to `page.tsx` later).

---

## Architecture

### Folder Structure

```
/app
  layout.tsx          # Root layout: html/body, Metadata, Header, Footer
  page.tsx            # Composes all sections in document order
  globals.css         # Tailwind base + CSS reset

/components
  /layout
    Header.tsx        # Fixed navigation bar
    Footer.tsx        # Site footer
  /sections
    HeroSection.tsx
    TransitionSection.tsx
    FeatureTabsSection.tsx
    NatureSection.tsx
    CTASection.tsx
  /ui
    Container.tsx     # Max-width content wrapper
    SectionWrapper.tsx # Full-height section shell
    SectionSkeleton.tsx # Animated shimmer fallback for dynamic sections
    SectionErrorBoundary.tsx # Error boundary wrapper for dynamic sections
    useSectionPrefetch.ts # IntersectionObserver-based chunk prefetch hook

/lib
  constants.ts        # Design tokens + all static content
  types.ts            # All TypeScript interfaces
  useReducedMotion.ts # Hook: reads prefers-reduced-motion media query
```

### Component Hierarchy

```
layout.tsx
├── <html>
│   └── <body>
│       ├── Header (navItems={NAV_ITEMS})
│       ├── {children}  ← page.tsx renders here
│       └── Footer (copyrightText={...} links={NAV_ITEMS})

page.tsx  (<main>)
├── HeroSection          [static import — above fold]
├── TransitionSection    [dynamic import — below fold]
├── FeatureTabsSection   [dynamic import — below fold]
├── NatureSection        [dynamic import — below fold]
└── CTASection           [dynamic import — below fold]
```

### Rendering Strategy

| Component | Render Type | Justification |
|---|---|---|
| `layout.tsx` | Server Component | Static shell, no interactivity |
| `page.tsx` | Server Component | Orchestrates sections, passes constants as props |
| `Header` | Server Component | Static nav links, no client state needed |
| `Footer` | Server Component | Static content only |
| `HeroSection` | Server Component | Above fold, critical for LCP — must SSR |
| `TransitionSection` | Client Component (dynamic) | Below fold; `ssr: false` defers JS load |
| `FeatureTabsSection` | Client Component (dynamic) | Below fold; tab interaction will need client state in future phase |
| `NatureSection` | Client Component (dynamic) | Below fold; future scroll/parallax hooks require client refs |
| `CTASection` | Client Component (dynamic) | Below fold; form submission will require client handlers |
| `Container` | Server Component | Pure layout primitive, no state |
| `SectionWrapper` | Server Component | Pure layout primitive, no state |

**SSR strategy**:
- Use SSR by default for all components
- Only disable SSR where strictly needed (animations, scroll APIs, browser-only refs)
- Below-fold sections use `ssr: false` exclusively because they will require `useRef`, `IntersectionObserver`, and `window`-dependent animation APIs — disabling SSR now prevents hydration mismatches when those hooks are added

**Hydration Safety Rules**:
- Any component that accesses `window`, `document`, `localStorage`, or browser-only APIs MUST be a Client Component — add `'use client'` at the top of the file
- Server Components MUST NOT access browser globals — doing so causes a runtime error in Next.js App Router, not just a warning
- `useReducedMotion` and `useSectionPrefetch` both access `window.matchMedia` and `IntersectionObserver` — they MUST only be called inside Client Components
- The `'use client'` boundary is contagious downward: once a component is marked `'use client'`, all its children are treated as client components too — keep the boundary as deep in the tree as possible to preserve Server Component benefits higher up
- During the animation phase, when `useRef` + `useEffect` are added to section components, the `'use client'` directive must be added at that point — the dynamic import with `ssr: false` alone is not sufficient without it

---

## Components and Interfaces

### UI Primitives

**`Container`**
- Wraps children in a `max-w-*` centered `<div>`
- Accepts `className?: string` for per-use overrides
- Used inside every section to constrain content width
- Wrapped with `React.memo` — output is stable given same children/className

**`SectionWrapper`**
- Renders a `<section>` with `min-h-screen` (full viewport height)
- Accepts `id?: string` for anchor linking
- Accepts `className?: string` for per-use overrides
- Does NOT apply animation or scroll logic — that is the responsibility of the section component using it
- Wrapped with `React.memo`

### Layout Components

**`Header`**
- Renders `<header>` with `position: fixed`, `top-0`, `z-50`
- Accepts `navItems: NavItem[]`
- Logo placeholder on the left (`<span>` or `<div>` with label)
- `<nav>` → `<ul>` → `<li>` → `<a>` for each nav item
- No client state; purely presentational

**`Footer`**
- Renders `<footer>`
- Accepts `copyrightText: string` and `links: NavItem[]`
- Renders links as `<a>` elements

### Section Components

**`HeroSection`**
- Props: `leftText`, `rightText`, `productPlaceholderLabel` (all `string`)
- Three-column layout: left text | centered product placeholder | right text
- Product placeholder is a `<div>` with a visible label — `{/* ANIMATION HOOK: product entrance */}` comment marks it
- Wrapped with `React.memo`

**`TransitionSection`**
- Props: `headline`, `overlayText` (both `string`)
- `headline` renders at display-scale (`text-7xl` or equivalent token)
- `overlayText` is absolutely positioned over the headline
- `{/* SCROLL HOOK: overlay text parallax */}` comment marks the overlay element
- Wrapped with `React.memo`

**`FeatureTabsSection`**
- Props: `heading: string`, `tabs: TabItem[]`, `activeTab: string`
- Two-column layout: left heading | right tab panel
- Tab buttons rendered from `tabs` array; active tab determined by `activeTab` prop (no `useState` in this phase)
- Content area renders `tabs.find(t => t.id === activeTab)?.content`
- `{/* ANIMATION HOOK: tab content transition */}` comment marks the content area
- Wrapped with `React.memo`

**`NatureSection`**
- Props: `imagePlaceholderLabel: string`, `overlayText: string`
- Full-width/height background placeholder `<div>` with label
- `overlayText` absolutely positioned over the placeholder
- `{/* MEDIA HOOK: replace with next/image or video */}` comment marks the placeholder
- Wrapped with `React.memo`

**`CTASection`**
- Props: `heading`, `subheading`, `buttonLabel`, `inputPlaceholder` (all `string`)
- Centered layout: heading → subheading → `<label>` + `<input type="email">` + `<button type="submit">`
- Input uses `aria-label` or `htmlFor`/`id` pairing
- Wrapped with `React.memo`

---

## Data Models

### `lib/types.ts`

```typescript
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

// Component prop interfaces
export interface HeaderProps {
  navItems: NavItem[];
}

export interface FooterProps {
  copyrightText: string;
  links: NavItem[];
}

export interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export interface SectionWrapperProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

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
```

### `lib/constants.ts` — Structure

```typescript
// Design tokens
export const SPACING = { sm: '...', md: '...', lg: '...', xl: '...' }
export const COLORS = { primary: '...', secondary: '...', background: '...', foreground: '...' }
export const TYPOGRAPHY = { base: '...', lg: '...', xl: '...', '2xl': '...', display: '...' }

// Navigation
export const NAV_ITEMS: NavItem[] = [...]

// Feature tabs
export const FEATURE_TABS: TabItem[] = [...]

// Section copy — all static strings
export const HERO_COPY = { leftText: '...', rightText: '...', productPlaceholderLabel: '...' }
export const TRANSITION_COPY = { headline: '...', overlayText: '...' }
export const FEATURE_TABS_COPY = { heading: '...' }
export const NATURE_COPY = { imagePlaceholderLabel: '...', overlayText: '...' }
export const CTA_COPY = { heading: '...', subheading: '...', buttonLabel: '...', inputPlaceholder: '...' }
export const FOOTER_COPY = { copyrightText: '...' }
```

### Data Flow: constants.ts → page.tsx → Sections

```
constants.ts
  └── NAV_ITEMS ──────────────────────────────► Header (via layout.tsx)
  └── NAV_ITEMS, FOOTER_COPY ─────────────────► Footer (via layout.tsx)
  └── HERO_COPY ──────────────────────────────► HeroSection
  └── TRANSITION_COPY ────────────────────────► TransitionSection
  └── FEATURE_TABS_COPY + FEATURE_TABS ───────► FeatureTabsSection
  └── NATURE_COPY ────────────────────────────► NatureSection
  └── CTA_COPY ───────────────────────────────► CTASection
```

`page.tsx` is the single point of data injection. It imports from `constants.ts` and passes values down as props. No section component imports from `constants.ts` directly — this keeps sections reusable and independently testable with any data.

---

## Code Splitting Strategy

`page.tsx` uses Next.js `dynamic()` for all below-fold sections:

```typescript
// Static — above fold, critical for LCP
import HeroSection from '@/components/sections/HeroSection'

// Dynamic — below fold, each wrapped in SectionSkeleton for visual continuity
const TransitionSection = dynamic(
  () => import('@/components/sections/TransitionSection'),
  { ssr: false, loading: () => <SectionSkeleton /> }
)
const FeatureTabsSection = dynamic(
  () => import('@/components/sections/FeatureTabsSection'),
  { ssr: false, loading: () => <SectionSkeleton /> }
)
const NatureSection = dynamic(
  () => import('@/components/sections/NatureSection'),
  { ssr: false, loading: () => <SectionSkeleton dark /> }
)
const CTASection = dynamic(
  () => import('@/components/sections/CTASection'),
  { ssr: false, loading: () => <SectionSkeleton /> }
)
```

**Why `ssr: false` for below-fold sections?**
These sections will eventually use `useRef` for GSAP targets, `IntersectionObserver` for scroll triggers, and potentially `window`-dependent APIs. Marking them as client-only now prevents hydration mismatches when those hooks are added.

**Bundle impact**: HeroSection + layout shell loads in the initial bundle. The four below-fold sections are split into separate chunks loaded lazily as the user scrolls.

### Prefetch Strategy

Lazy loading defers JS download until the component is needed — but if the user scrolls fast, there can be a visible delay before the section appears. To eliminate this, each below-fold section's chunk is prefetched as soon as the previous section enters the viewport.

**Implementation** (`/components/ui/useSectionPrefetch.ts`):
- A custom hook that accepts a `ref` pointing to the current section and an array of dynamic import functions for the next section(s)
- Uses `IntersectionObserver` with a `rootMargin` of `"0px 0px -20% 0px"` — triggers when the current section is 80% visible, giving the browser time to prefetch before the user reaches the next section
- Calls each import function (e.g., `() => import('@/components/sections/FeatureTabsSection')`) to warm the module cache without rendering
- Cleans up the observer on unmount

```
User scrolls → HeroSection 80% visible
  → prefetch TransitionSection chunk
  → TransitionSection 80% visible
  → prefetch FeatureTabsSection chunk
  → ... and so on
```

This means by the time the user reaches a section, its JS is already in the browser cache — the `dynamic()` loading fallback (SectionSkeleton) is shown for near-zero time, making scroll feel instantaneous.

### Loading Skeleton Strategy

A blank `<div className="min-h-screen" />` is invisible to the user and creates a jarring flash of empty space. Instead, each dynamic section uses a `SectionSkeleton` component as its loading fallback.

**`SectionSkeleton`** (`/components/ui/SectionSkeleton.tsx`):
- Renders a `min-h-screen` container matching the page background color
- Contains animated gradient shimmer bars (`animate-pulse`) that loosely mirror the section's content structure (a heading bar, a body bar, an optional image block)
- Accepts a `dark?: boolean` prop to match dark-background sections (e.g., NatureSection)
- The loading fallback SHOULD visually match the section's background color to prevent color flashes
- Preserves layout height so the page does not reflow when the real component hydrates

```
SectionSkeleton (min-h-screen, bg matches section theme)
  └── shimmer bar — heading width (~40%)
  └── shimmer bar — body width (~70%)
  └── shimmer block — optional image/media area
```

This keeps the page feeling continuous and intentional during lazy load, rather than blank.

---

## Layout System

### Container

Enforces a consistent max-width and horizontal padding across all sections:

```
<Container>
  ← max-w-7xl mx-auto px-6 (or equivalent Tailwind classes) →
</Container>
```

Every section wraps its content in `<Container>`. This means changing the site's content width requires editing one component.

### SectionWrapper

Enforces full-viewport-height sections and provides the `<section>` semantic element:

```
<SectionWrapper id="hero" className="bg-black">
  ← min-h-screen, position: relative (for absolute-positioned overlays) →
  <Container>...</Container>
</SectionWrapper>
```

`position: relative` on `SectionWrapper` is important — it establishes the containing block for absolutely positioned overlay elements (TransitionSection's `overlayText`, NatureSection's text overlay). This is set via a default Tailwind class on `SectionWrapper`, not per-section.

### Composition Pattern

```
SectionWrapper (min-h-screen, relative, semantic <section>)
  └── Container (max-w-7xl, centered, horizontal padding)
        └── Section-specific layout (flex/grid)
              └── Content elements
```

---

## Future Animation Integration

All section components include clearly labeled comments marking elements that will receive GSAP refs or scroll triggers. The architecture is designed so that adding animation requires only:

1. Adding `useRef` to the target element
2. Adding a `useEffect` with GSAP/ScrollTrigger logic
3. No structural changes to props, data flow, or layout

### Ref Attachment Points by Section

| Section | Element | Comment Label | Animation Intent |
|---|---|---|---|
| `HeroSection` | Product placeholder `<div>` | `{/* ANIMATION HOOK: product entrance */}` | Entrance animation on load |
| `TransitionSection` | Overlay `<div>` | `{/* SCROLL HOOK: overlay text parallax */}` | Parallax scroll effect |
| `FeatureTabsSection` | Tab content area | `{/* ANIMATION HOOK: tab content transition */}` | Content swap animation |
| `NatureSection` | Image placeholder `<div>` | `{/* MEDIA HOOK: replace with next/image or video */}` | Parallax / video background |
| `CTASection` | — | — | Entrance fade (no dedicated hook needed) |

### GSAP Integration Pattern (future)

When animation is added, the pattern will be:

```typescript
// Inside a section component (future phase)
const targetRef = useRef<HTMLDivElement>(null)

useEffect(() => {
  if (!targetRef.current) return
  // GSAP / ScrollTrigger logic here
  return () => { /* cleanup */ }
}, [])

// In JSX — ref attaches to the element already marked with a comment
<div ref={targetRef}>
  {/* ANIMATION HOOK: product entrance */}
</div>
```

Because `TransitionSection`, `FeatureTabsSection`, `NatureSection`, and `CTASection` are already marked as Client Components (via `dynamic()` with `ssr: false`), adding `useRef` and `useEffect` requires no architectural change — just adding the `'use client'` directive and the hook logic.

### Reduced Motion Support

Premium design must also be accessible design. The `prefers-reduced-motion` media query signals that the user has requested minimal motion at the OS level (vestibular disorders, epilepsy, personal preference). Ignoring it on an animation-heavy page is both an accessibility failure and a poor user experience.

**Architecture approach** (`/lib/useReducedMotion.ts`):
- A custom hook that reads `window.matchMedia('(prefers-reduced-motion: reduce)')` and returns a boolean
- Listens for changes via `addEventListener('change', ...)` so it responds if the user toggles the setting while the page is open
- Returns `true` when reduced motion is preferred, `false` otherwise

**Usage pattern in animated sections (future phase)**:
```typescript
const prefersReducedMotion = useReducedMotion()

useEffect(() => {
  if (!targetRef.current) return
  if (prefersReducedMotion) {
    // Skip animation — element is already in its final state
    return
  }
  // Full GSAP / ScrollTrigger animation here
}, [prefersReducedMotion])
```

**Design rules**:
- When `prefersReducedMotion` is `true`: elements render instantly in their final visible state — no entrance, no parallax, no transitions
- When `prefersReducedMotion` is `false`: full animation runs as designed
- The hook is prepared now and imported into each animated section in the future phase — no structural changes required
- Tailwind's `motion-reduce:` variant can be used for CSS transitions as a complement to the JS hook

This is documented now so that when animations are added, reduced motion support is built in from the first commit — not retrofitted later.

---

## Error Handling

### Component-Level Error Boundaries

In production, a crash inside a dynamically imported section would propagate up and take down the entire page. To prevent this, each dynamic section is wrapped in an `ErrorBoundary` component.

**`SectionErrorBoundary`** (`/components/ui/SectionErrorBoundary.tsx`):
- A React class component implementing `componentDidCatch` and `getDerivedStateFromError`
- Renders a minimal fallback UI (a `min-h-screen` container with a neutral message) when the wrapped section throws
- Accepts a `fallback?: React.ReactNode` prop for per-section custom fallbacks
- Does NOT crash the rest of the page — other sections continue to render normally

**Wrapping pattern in `page.tsx`**:
```
<SectionErrorBoundary>
  <TransitionSection ... />
</SectionErrorBoundary>

<SectionErrorBoundary>
  <FeatureTabsSection ... />
</SectionErrorBoundary>
```

HeroSection does NOT need an error boundary in this phase — it is statically imported, server-rendered, and contains no logic that can throw at runtime.

### Other Error Cases

- **Missing `activeTab` match in FeatureTabsSection**: `tabs.find(t => t.id === activeTab)` may return `undefined`. Handled with optional chaining: `tabs.find(...)?.content ?? tabs[0]?.content`.
- **Empty arrays**: `NAV_ITEMS` and `FEATURE_TABS` should never be empty in production, but components handle empty arrays gracefully (render nothing rather than crash).
- **TypeScript strictness**: With `strict: true` in `tsconfig.json` and no `any` types, most error conditions are caught at compile time.

---

## Testing Strategy

### PBT Applicability Assessment

This feature is a **UI rendering and layout architecture** — it consists of React components that render static HTML from props, layout primitives, and a constants file. There is no algorithmic logic, no data transformation, no parser, and no serializer. The components are essentially pure render functions mapping props to JSX.

Property-based testing is **not appropriate** for this feature because:
- Components render JSX, not values with universal mathematical properties
- There is no input space where 100 iterations would find more bugs than 3-5 targeted examples
- The correct behavior is "renders the right HTML structure" — best verified with snapshot tests and targeted example-based tests

### Testing Approach

**Unit / Example-based tests** (using Jest + React Testing Library):

- `Container`: renders children, applies className override
- `SectionWrapper`: renders `<section>`, applies `id`, applies className
- `Header`: renders all `navItems` as links, renders logo placeholder
- `Footer`: renders `copyrightText`, renders all `links`
- `HeroSection`: renders `leftText`, `rightText`, `productPlaceholderLabel` in correct positions
- `TransitionSection`: renders `headline` and `overlayText`
- `FeatureTabsSection`: renders `heading`, renders tab buttons for each `TabItem`, renders content of `activeTab`
- `NatureSection`: renders `imagePlaceholderLabel`, renders `overlayText`
- `CTASection`: renders `heading`, `subheading`, `buttonLabel`, `inputPlaceholder`; email input has accessible label

**Snapshot tests**:
- One snapshot per section component to catch unintended structural regressions

**Accessibility checks**:
- `CTASection`: verify `<input>` has associated label (via `htmlFor`/`id` or `aria-label`)
- `Header`: verify `<nav>` contains `<ul>` → `<li>` → `<a>` structure
- Heading hierarchy: verify `<h1>` appears once, `<h2>` and `<h3>` follow logically

**Integration test**:
- `page.tsx` renders without crashing with all constants injected
- All five sections appear in document order in the rendered output

**What is NOT tested here**:
- Animation behavior (no animation in this phase)
- Tab switching (no state in this phase)
- Form submission (no handlers in this phase)

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

Most of this feature is UI rendering and layout, which is best verified with snapshot tests and example-based tests rather than property-based testing. However, two universal properties emerge from the requirements: both involve rendering a variable-length array of items and verifying that every item in the array is represented in the output. These are genuine "for all inputs" properties where input variation (array length, content, order) meaningfully exercises the rendering logic.

**Property reflection**: The Header navItems property (Req 5.2) and Footer links property (Req 6.3) are structurally identical — both test that a `NavItem[]` is fully rendered as anchor links. They are consolidated into Property 1. The FeatureTabsSection tab button rendering (Req 10.3) and active tab content rendering (Req 10.5) are distinct but complementary; they are consolidated into Property 2 to test the full tab rendering contract in one property.

### Property 1: Nav item arrays are fully rendered as anchor links

*For any* non-empty array of `NavItem` objects passed to `Header` (as `navItems`) or `Footer` (as `links`), every item in the array SHALL appear in the rendered output as an `<a>` element whose `href` matches the item's `href` field and whose text content matches the item's `label` field.

**Validates: Requirements 5.2, 6.3**

### Property 2: FeatureTabsSection renders all tabs and displays active tab content

*For any* non-empty array of `TabItem` objects and any `activeTab` string that matches one of the tab `id` values, the rendered `FeatureTabsSection` SHALL contain exactly one tab button per `TabItem` in the array, and the content area SHALL display the `content` field of the `TabItem` whose `id` equals `activeTab`.

**Validates: Requirements 10.3, 10.5**
**