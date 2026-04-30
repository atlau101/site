# Codebase Map — Portfolio Site

update this document whenever changes are made to components within

## Stack

- **Framework:** Next.js 16.2.3 (App Router)
- **Language:** TypeScript 5, React 19
- **Styling:** Tailwind CSS 4 + tw-animate-css + shadcn/ui (Base UI primitives)
- **Animation:** Framer Motion 12, vanilla JS canvas (hero)
- **Component primitives:** @base-ui/react (shadcn v4 uses Base UI, not Radix)
- **Fonts:** Noto Serif + IBM Plex Mono via `next/font/google`
- **Utilities:** clsx, tailwind-merge, class-variance-authority
- **Icons:** lucide-react
- **Content pipeline:** gray-matter + @next/mdx installed but not yet used
- **Other deps present but unused:** d3-force, @fontsource/fraunces, zod

---

## Directory Tree

```
site/
├── app/
│   ├── favicon.ico                   — Site favicon
│   ├── globals.css                   — Design tokens, Tailwind theme, utility classes
│   ├── layout.tsx                    — Root layout: font loading, <html>/<body> wrappers, metadata
│   ├── page.tsx                      — Homepage: hardcoded project data + section assembly
│   └── projects/
│       └── [slug]/
│           └── page.tsx              — Dynamic project detail page (5 sections: Hero, General, Takeaways, Redos, Specifics)
│
├── components/
│   ├── hero/
│   │   ├── Hero.tsx                  — Hero section shell: canvas mount + animated text overlay
│   │   └── hero-canvas.js            — "Reveal the Signal" vanilla JS canvas animation
│   ├── sections/
│   │   ├── Nav.tsx                   — Sticky navbar with scroll-aware border
│   │   ├── AboutStrip.tsx            — About section: single paragraph, marginalia annotation
│   │   ├── FeaturedCard.tsx          — Tier 1 project card (full-width, image slot)
│   │   ├── ProjectGrid.tsx           — Tier 2 project grid (3-col, card tiles)
│   │   └── Footer.tsx                — Footer: name/tagline + GitHub/LinkedIn/email links
│   ├── project/
│   │   ├── ProjectHero.tsx           — Project detail page hero: title + metadata sidebar
│   │   ├── ProjectGeneral.tsx        — "What I Built" section: tagline + description + image + visuals slider + outputs
│   │   ├── VisualsSlider.tsx         — Arrow-navigated image slider with adaptive height (client component)
│   │   ├── ProjectTakeaways.tsx      — "What I Took Away" with expandable lessons
│   │   ├── ProjectRedos.tsx          — "Future Revisions" with numbered items
│   │   └── ProjectSpecifics.tsx      — Collapsible "Deep Dive" technical details
│   ├── transitions/                  — Empty directory (reserved)
│   └── ui/
│       ├── badge.tsx                 — shadcn Badge (Base UI useRender, CVA variants)
│       ├── button.tsx                — shadcn Button (Base UI ButtonPrimitive, CVA variants)
│       └── card.tsx                  — shadcn Card family (Card, CardHeader, CardTitle, etc.)
│
├── content/
│   └── projects/                     — Empty directory (future MDX project content)
│
├── design-system/
│   └── andrew-lau-portfolio/
│       └── pages/                    — Empty directory (design-system docs placeholder)
│
├── lib/
│   ├── projects/
│   │   ├── types.ts                  — TypeScript interfaces for project data
│   │   ├── index.ts                  — Project registry (slug → data)
│   │   └── chambergpt.ts             — ChamberGPT project data
│   └── utils.ts                      — cn() helper: clsx + tailwind-merge
│
├── public/                           — Static assets (Next.js defaults: file.svg, globe.svg, etc.)
│
├── AGENTS.md                         — Agent/workflow instructions
├── CLAUDE.md                         — Points to AGENTS.md (@AGENTS.md)
├── DESIGN.md                         — Design system master reference (Field Journal spec)
├── PROGRESS.md                       — Project progress tracker
├── components.json                   — shadcn CLI config
├── eslint.config.mjs                 — ESLint config
├── next.config.ts                    — Next.js config
├── next-env.d.ts                     — Next.js TypeScript env types
├── package.json                      — Dependencies
├── postcss.config.mjs                — PostCSS config (Tailwind)
├── tsconfig.json                     — TypeScript config
└── README.md                         — Default Next.js README (not project-specific)
```

---

## Key Files — Detail

### app/layout.tsx

Root layout. Loads two Google fonts via `next/font`:

- `Noto_Serif` — weights 400/500/700 — exposed as `--font-noto-serif`
- `IBM_Plex_Mono` — weights 400/500 — exposed as `--font-ibm-plex-mono`

Both variables are set on `<html>`. Body uses `bg-background text-foreground` (semantic tokens from globals.css).

Metadata: `title: "Andrew Lau"`, `description: "Business analytics and product thinking. USF '26."`.

---

### app/page.tsx

Homepage. No props — all data is hardcoded inline as two const arrays:

**`featuredProjects`** (Tier 1, 3 items):

| Title | Category | Year | href |
|-------|----------|------|------|
| Malloy Group | Consulting · GTM · Brand | 2024–2025 | /projects/malloy-group |
| B2B Sales Pipeline Analytics | Data Mining · B2B · R | Fall 2025 | /projects/bus315-data-mining |
| AUGMENT | UX Design · Product · Figma | 2025 | /projects/augment |

**`secondaryProjects`** (Tier 2, 6 items, type `SecondaryProject`):

| Title | Category | Year | href |
|-------|----------|------|------|
| Fillmore Ecosystem | Community Research | Fall 2025 | /projects/fillmore |
| Uber India Ride Analytics | Data Visualization · Tableau | Fall 2025 | /projects/uber-analytics |
| Wildfire Proximity ML | ML · Python · Kaggle | Spring 2026 | /projects/wildfire-ml |
| LMU EMS Datathon | Data Analysis · Growth | Spring 2026 | /projects/lmu-datathon |
| ChamberGPT | AI · No-Code · Internship | Spring 2025 | /projects/chambergpt |
| AI Investment Bubble | Economics · Research | Fall 2025 | /projects/ai-bubble |

Assembly order: `Navbar` → `Hero` → `AboutStrip` → Featured section (h2 "Featured work" + FeaturedCard × 3) → `ProjectGrid` ("More work") → `Footer`.

`<main>` has `pt-16 sm:pt-20` to clear the fixed navbar.

---

### app/globals.css

Imports: `tailwindcss`, `tw-animate-css`, `shadcn/tailwind.css`.

Defines the "Field Journal" design system in three blocks:

**`@theme inline`** — Tailwind token aliases:

- `--font-sans`, `--font-serif`, `--font-heading` all point to `--font-noto-serif`
- `--font-mono` points to `--font-ibm-plex-mono`
- Field-journal named palette (see Design System Tokens section below)
- shadcn semantic tokens mapped via `var()` to the `:root` block
- `--radius` scale: base is 0.125rem; sm/md/lg/xl/2xl/3xl/4xl are multipliers

**`:root`** — shadcn semantic values in oklch (light mode only, no dark mode override):

- `--background` ≈ cream paper (#FAF9F5 equivalent)
- `--primary` ≈ forest green (#173809 equivalent)
- `--radius: 0.125rem` (2px — intentionally near-zero)
- `box-shadow: none !important` applied globally via `@layer base`

**`@layer utilities`**:

- `.rule-h` — `border-top: 1px solid var(--color-rule)` (ruled line separator)
- `.rule-h-faint` — same at 50% opacity via color-mix
- `.annotation` — IBM Plex Mono, 0.75rem, 0.04em letter-spacing, uppercase, muted color
- `.mega-margin` — `margin-block: 64px`

---

### components/hero/Hero.tsx

Client component. Mounts the canvas via `useRef` and dynamically imports `hero-canvas.js` in a `useEffect`, calling `init("hero-scatter-canvas")` and storing the returned cleanup function.

Canvas element: `id="hero-scatter-canvas"`, `style={{ height: 420 }}`, full width.

Text overlay is absolutely positioned (`inset-0 z-10`, bottom-left anchor via `flex flex-col justify-end`). Contains three `motion` elements with staggered fade-in:

1. Annotation line: "Problem Solver · Analyst · Tinkerer" (delay 0.4s)
2. H1: "Andrew / Lau." — large serif, `text-6xl` to `text-[7rem]`, `font-medium leading-[0.9]` (delay 0.55s)
3. Subline: "Prefers the problems where the question isn't obvious yet." (delay 1.0s)
4. "Scroll to explore ↓" with bouncing arrow (delay 1.5s)

No props.

---

### components/hero/hero-canvas.js

Vanilla JS, zero dependencies. Exports one function: `init(canvasId) → destroy()`.

**Concept:** "Reveal the Signal" — dots transition between noise state (scattered, drifting, blurry, gray-green) and signal state (fixed upward-trending scatter, crisp, forest green) based on cursor proximity.

Key implementation details:

- Canvas fixed at H=420, DPR capped at 2
- 40 dots on desktop, 28 on mobile (< 768px)
- Blur handled via a pre-built sprite atlas (OffscreenCanvas when available) — 6 radius buckets, blur applied once at build time, not per frame
- Noise dot color: `#C3C8BB` (rule color) at 38% opacity
- Signal dot color: `#173809` (forest green), 4px radius, crisp arc
- Background fill: `#FAF9F5` (paper)
- Auto-sweep: 6s easeInOutSine loop when no cursor active; pauses on mousemove, resumes 3s after mouseleave
- Mobile tap holds window at tap X for 1.5s
- Respects `prefers-reduced-motion`
- Cleans up all event listeners and RAF on destroy

---

### components/sections/Nav.tsx

Client component. Props: `name` (default "Andrew Lau"), `links` (default: Work/#work, About/#about, Contact/#contact).

Sticky (`fixed top-0`), `z-50`, `bg-background/95`. Adds `border-b border-border` when `scrollY > 20` (tracked via Framer Motion `useScroll`). Animates in on mount (fade + slide down). Nav links use `.annotation` class (mono, uppercase, small). Logo link: serif, `text-xl/2xl`.

---

### components/sections/AboutStrip.tsx

Client component. No props — content is hardcoded.

Section `id="about"`. 3-column grid (md): left 1/3 shows `"§ About / 01"` annotation; right 2/3 shows the bio paragraph. Paragraph animates in with `whileInView` (once, -80px margin).

Hardcoded text: "I put myself into situations I'm not ready for — because feedback lands differently when something's actually at stake..." (full paragraph).

---

### components/sections/FeaturedCard.tsx

Client component.

Props interface `FeaturedCardProps`:

- `title: string`
- `outcome: string`
- `category: string`
- `year: string`
- `href: string`
- `imageSrc?: string` (optional)
- `imageAlt?: string` (optional)

Renders as a `<Link>` wrapping a 3-column grid card (`md:grid-cols-3`). Left 2/3: category annotation, h3 title, outcome paragraph, year annotation. Right 1/3: image slot (Next.js `Image` with fill) or placeholder with title text at 25% opacity. Hover: `opacity-90` on the outer div. No shadow (global reset).

---

### components/sections/ProjectGrid.tsx

Client component.

Exports: `ProjectGrid` (default), `SecondaryProject` (type).

`SecondaryProject` interface: `title`, `description`, `category`, `year`, `href` (all strings).

Props: `projects: SecondaryProject[]`, `heading?: string` (default "More work").

Renders a 3-column grid (`lg:grid-cols-3`, 2-col md, 1-col mobile). Each card is a `<Link>` tile with `whileInView` stagger (0.07s per item). Card content: h3 title, description paragraph, category + year annotations. Hover: `opacity-80`.

---

### components/sections/Footer.tsx

No "use client" directive (server component).

Props (all optional with defaults):

- `name` — "Andrew Lau"
- `tagline` — "Business analytics and product thinking. USF '26."
- `githubUrl` — "<https://github.com/atlau101>"
- `linkedinUrl` — "<https://www.linkedin.com/in/atlau04/>"
- `email` — "mailto:andrew.t.lau101@gmail.com"

Contains inline SVG icons for GitHub and LinkedIn (no external icon lib). Uses lucide `Mail` for email. Social icons are 40×40 borderless squares with `border border-edge`. Bottom rule with copyright year via `new Date().getFullYear()`.

---

### components/ui/button.tsx

shadcn Button using `@base-ui/react/button` primitive. CVA variants:

**variant:** `default` (primary bg) · `outline` · `secondary` · `ghost` · `destructive` · `link`
**size:** `default` · `xs` · `sm` · `lg` · `icon` · `icon-xs` · `icon-sm` · `icon-lg`

Not currently used in the site but available. Global `box-shadow: none !important` overrides any shadow.

---

### components/ui/card.tsx

shadcn Card family. Pure React div wrappers with `cn()` composition. No Base UI primitives.

Exports: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`.

`Card` accepts a `size` prop (`"default"` | `"sm"`). Uses `data-slot` attributes for parent-child targeting. Not directly used on the homepage — `FeaturedCard` and `ProjectGrid` use custom markup instead.

---

### components/ui/badge.tsx

shadcn Badge using `@base-ui/react/use-render` + `mergeProps`. Renders as `<span>` by default (customizable via `render` prop). CVA variants: `default` · `secondary` · `destructive` · `outline` · `ghost` · `link`. Not currently used in the site.

---

### components/project/ProjectHero.tsx

Client component. Props: `project: ProjectData`.

Displays project title (large serif, `text-7xl`, forest green) on left side (~60% on desktop) with metadata sidebar on right (~40%). Metadata includes: YEAR, TYPE, SKILLS — all in `.annotation` style, italic serif values. Separated by `rule-h` divider at top of sidebar.

---

### components/project/ProjectGeneral.tsx

Client component. Props: `project: ProjectData`.

Section: "What I Built" (serif heading with `rule-h` beneath). Two-column layout: left column (30%) shows 1-sentence tagline in `.annotation` mono; right column (65%) renders description paragraph + optional project image with caption in `paper-container` background panel. If `project.visuals` exists, renders `<VisualsSlider>` below the columns. Below that: outputs stats strip (label/value pairs in ruled grid).

---

### components/project/VisualsSlider.tsx

Client component (`'use client'`). Props: `visuals: ProjectVisual[]`.

Arrow-navigated image slider. Shows one image at a time with `ChevronLeft`/`ChevronRight` (lucide-react) flanking a centered, width-capped image container (`w-96 sm:w-[30rem]`). Images render at natural aspect ratio via `<Image width={0} height={0} sizes="480px" className="w-full h-auto" />` — no cropping, container height adapts per image. Slide changes trigger a 150ms opacity fade (`setTimeout` + `useState` fading flag). Header row shows "Visuals" heading left-aligned and zero-padded counter (`01 / 06`) right-aligned in `.annotation` style. Caption centered below image. Prev/next buttons disabled at boundaries (`opacity-25`).

---

### components/project/ProjectTakeaways.tsx

Client component (uses `useState`). Props: `project: ProjectData`.

Section: "What I Took Away" with "POST-PROJECT REFLECTION" annotation. Expandable lessons list — each lesson has a clickable header (1-sentence summary) with a rotating chevron icon. On expand, full lesson text appears indented below. Separated by `rule-h-faint` between items.

---

### components/project/ProjectRedos.tsx

Client component. Props: `project: ProjectData`.

Section: "Future Revisions" with "POST-PROJECT REFLECTION" annotation. Numbered items (01, 02, 03...) in `.annotation` style, with full italic serif paragraphs beside each number. Grid layout: `md:col-span-1` for number, `md:col-span-11` for content. Separated by `rule-h-faint`.

---

### components/project/ProjectSpecifics.tsx

Client component (uses `useState`). Props: `project: ProjectData`.

Collapsible section: "The Specifics" heading with rotating chevron icon. Expanded content shows markdown-like text dump (handles ## headings, lists, regular paragraphs). Max-width 72ch for legibility.

---

### app/projects/[slug]/page.tsx

Async dynamic route handler. Generates static params from project registry. Fetches project data by slug, renders 404 if not found. Assembles full project page: `Navbar` → `ProjectHero` → `ProjectGeneral` → `ProjectTakeaways` → `ProjectRedos` → `ProjectSpecifics` → `Footer`.

---

### lib/projects/types.ts

TypeScript interfaces:

- `Lesson` — `title`, `summary`, `full`
- `ProjectOutputs` — `label`, `value`
- `ProjectData` — `slug`, `title`, `year`, `type`, `skills[]`, `tagline`, `description`, `image?`, `imageCaption?`, `outputs?[]`, `lessons[]`, `redos[]`, `specifics?`

---

### lib/projects/index.ts

Exports `projectRegistry` (Record mapping slug → ProjectData) and utility functions: `getProject(slug)`, `getProjectSlugs()`.

---

### lib/projects/chambergpt.ts

ChamberGPT project data object. Contains all sections: hero metadata, general description, 4 lessons with summaries, 3 redos, and specifics section with platform selection, architecture, and implementation details.

---

### lib/utils.ts

Single export: `cn(...inputs: ClassValue[]) → string`. Standard clsx + tailwind-merge composition helper. Used by all shadcn UI components.

---

## Design System Tokens (from globals.css)

### Named palette (--color-* in @theme inline)

| Token | Hex approx | Usage |
|-------|-----------|-------|
| `--color-paper` | #FAF9F5 | Main background |
| `--color-paper-low` | #F4F4F0 | Slightly darker paper surface |
| `--color-paper-container` | #EFEEEA | Card/contained surfaces |
| `--color-paper-dim` | #DBDAD6 | Footer background (`bg-paper-dim`) |
| `--color-paper-white` | #FFFFFF | Pure white |
| `--color-ink` | #1B1C1A | Near-black text |
| `--color-forest` | #173809 | Primary green (signal dots, links) |
| `--color-forest-soft` | #2D4F1E | Softer primary green |
| `--color-rule` | #C3C8BB | Ruled-line separators, noise dots |
| `--color-edge` | #73796D | Border on social icons, subtle edges |

### Semantic tokens (shadcn, :root in oklch)

| Token | Maps to |
|-------|---------|
| `--background` | ≈ paper (#FAF9F5) |
| `--foreground` | ≈ ink (#1B1C1A) |
| `--primary` | ≈ forest (#173809) |
| `--primary-foreground` | white |
| `--muted-foreground` | muted green-gray |
| `--border` | muted green-gray border |
| `--radius` | 0.125rem (2px) |

### Typography

| Role | Font | Variable |
|------|------|----------|
| Body/sans | Noto Serif | `--font-sans` |
| Headings | Noto Serif | `--font-heading` |
| Annotations/labels | IBM Plex Mono | `--font-mono` |

### Utility classes

| Class | Effect |
|-------|--------|
| `.rule-h` | 1px top border in `--color-rule` |
| `.rule-h-faint` | Same at 50% opacity |
| `.annotation` | Mono, 0.75rem, uppercase, 0.04em tracking, muted color |
| `.mega-margin` | 64px block margin |

### Global resets

- `box-shadow: none !important` on all elements
- `border-radius` from `--radius` (2px) — effectively square
- No dark mode variants defined

---

## Hardcoded Data

All project data lives inline in `app/page.tsx` as two const arrays (`featuredProjects` and `secondaryProjects`). There is no CMS, database, or content pipeline yet.

The following personal details are hardcoded as prop defaults in component files:

- `Nav.tsx`: name "Andrew Lau", nav links
- `Footer.tsx`: name, tagline, GitHub URL, LinkedIn URL, email address
- `AboutStrip.tsx`: the full bio paragraph text

The `content/projects/` directory exists but is empty — it is the intended location for future MDX project files when a content pipeline is added.

---

## Not Yet Built

| Area | Notes |
|------|-------|
| Content pipeline | `gray-matter` and `@next/mdx` are installed; `content/projects/` is empty. Multi-project content (Malloy Group, Fillmore, etc.) needs data files in `lib/projects/`. |
| Dark mode | No dark mode token overrides exist. |
| Contact section | Nav links to `#contact` but no section with that id exists. |
| About section id mismatch | `AboutStrip` has `id="about"` — nav `#about` link works. But `#contact` has no target. |
| SEO / OG images | Only basic metadata in layout.tsx. No OG image, no per-page metadata. |
| Analytics | None configured. |
| Deployment | Target TBD; no Vercel config or CI/CD present. |
