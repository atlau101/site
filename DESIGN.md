---
name: Editorial Strategy
colors:
  surface: '#f9faf2'
  surface-dim: '#dadbd3'
  surface-bright: '#f9faf2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4ec'
  surface-container: '#eeeee7'
  surface-container-high: '#e8e9e1'
  surface-container-highest: '#e2e3dc'
  on-surface: '#1a1c18'
  on-surface-variant: '#43493e'
  inverse-surface: '#2f312c'
  inverse-on-surface: '#f1f1ea'
  outline: '#73796d'
  outline-variant: '#c3c8bb'
  surface-tint: '#446733'
  primary: '#062100'
  on-primary: '#ffffff'
  primary-container: '#173809'
  on-primary-container: '#7da368'
  inverse-primary: '#a9d293'
  secondary: '#53634a'
  on-secondary: '#ffffff'
  secondary-container: '#d7e8c8'
  on-secondary-container: '#596950'
  tertiary: '#370828'
  on-tertiary: '#ffffff'
  tertiary-container: '#511e3e'
  on-tertiary-container: '#c884a9'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c5efad'
  primary-fixed-dim: '#a9d293'
  on-primary-fixed: '#062100'
  on-primary-fixed-variant: '#2d4f1e'
  secondary-fixed: '#d7e8c8'
  secondary-fixed-dim: '#bbccae'
  on-secondary-fixed: '#121f0b'
  on-secondary-fixed-variant: '#3c4b34'
  tertiary-fixed: '#ffd8ea'
  tertiary-fixed-dim: '#fab1d8'
  on-tertiary-fixed: '#370728'
  on-tertiary-fixed-variant: '#6b3455'
  background: '#f9faf2'
  on-background: '#1a1c18'
  surface-variant: '#e2e3dc'
typography:
  display-lg:
    fontFamily: newsreader
    fontSize: 4.5rem
    fontWeight: '600'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: newsreader
    fontSize: 2.5rem
    fontWeight: '500'
    lineHeight: '1.2'
  headline-md:
    fontFamily: newsreader
    fontSize: 1.75rem
    fontWeight: '500'
    lineHeight: '1.3'
  body-lg:
    fontFamily: newsreader
    fontSize: 1.25rem
    fontWeight: '400'
    lineHeight: '1.7'
  body-md:
    fontFamily: newsreader
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.65'
  label-mono:
    fontFamily: spaceGrotesk
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.5'
    letterSpacing: 0.05em
spacing:
  block-gap-lg: 80px
  block-gap-md: 60px
  gutter: 24px
  margin: 40px
  section-padding: 120px
---

## Brand & Style

This design system is built upon the visual language of high-level strategy consulting and intellectual publications. It prioritizes clarity, precision, and a deliberate lack of ornamentation. The aesthetic is "Intellectual Minimalism"—a style that conveys authority through restraint, drawing inspiration from the structured layouts of white papers and the typography-first approach of legacy periodicals.

The UI should evoke the feeling of reading a physical memo or a high-end journal. It avoids the transient trends of software-as-a-service (SaaS) templates in favor of a timeless, institutional presence. Success is measured by the legibility of complex data and the gravitational weight of the written word.

## Colors

The palette is restricted to simulate the experience of ink on paper. 

- **Surface**: The background uses a warm paper stock (#FAF9F5) to reduce eye strain and provide a premium, tactile quality compared to stark white.
- **On-Surface**: Text is rendered in "Carbon Ink" (#1B1C1A), providing maximum contrast and a sense of permanence.
- **Primary**: Forest Green is used as a functional tool rather than a decorative one. It is reserved for primary actions, critical headings, and active states.
- **Outline**: Soft dividers (#C3C8BB) are used for structural definition without disrupting the visual flow of information.

## Typography

The typography is the primary vehicle for the brand’s intellectual confidence. 

- **Headlines & Body**: We utilize a high-contrast serif (Newsreader) for both headlines and body text. This creates a cohesive, editorial narrative. Body text is set with a generous 1.6-1.7x line height to ensure comfortable reading of long-form analysis and reports.
- **Labels & Metadata**: Technical data, captions, and administrative metadata are set in Space Grotesk. This monospaced-adjacent typeface provides a "technical" counterpoint to the literary quality of the serif, suggesting data-driven precision and systematic rigor.

## Layout & Spacing

The design system employs a disciplined 12-column fixed grid. Layouts should be center-aligned with substantial horizontal margins to maintain focus on the content.

- **Vertical Rhythm**: Large vertical gaps (60-80px) between content blocks signify a shift in topic or a new analytical section. 
- **Information Density**: While the spacing is generous, information density remains high within blocks to mimic the compact nature of a professional brief. 
- **Grid Discipline**: Elements should strictly align to column starts and ends. Asymmetrical layouts (e.g., content spanning 8 columns with a 4-column sidebar for metadata) are encouraged to mimic traditional manuscript layouts.

## Elevation & Depth

This system intentionally rejects three-dimensional depth. There are no drop shadows, blurs, or Z-axis elevations. 

Hierarchy is established purely through:
1. **Background Tints**: Use a subtle shift from the primary background to a slightly darker or tinted container (Primary Container) to group related data.
2. **Hairlines**: Single, 1px horizontal hairlines (#C3C8BB) are used to separate sections and define the top and bottom of content modules.
3. **Typography Scale**: Depth is communicated through the size and weight of the serif headlines.

## Shapes

The shape language is strictly orthogonal. A border-radius of 0px is applied to all elements, including buttons, input fields, and containers. This sharp-edged approach reinforces the "precise" and "institutional" personality of this design system. Any departure from 90-degree angles is a violation of the system's core philosophy.

## Components

### Buttons
- **Primary**: Solid Forest Green (#173809) with Carbon Ink or Paper-colored text. Rectangular, no rounding. Use sparingly for final calls to action.
- **Secondary/Ghost**: Text-only or with a 1px border. No background fill. 
- **States**: Hover states should be subtle, such as a slight shift in background tint or the addition of an underline.

### Dividers
- Use 1px solid lines (#C3C8BB) exclusively. Do not use vertical dividers unless strictly necessary for complex data tables.

### Forms & Inputs
- Text-forward inputs with 1px bottom borders rather than full boxes. 
- Labels should use the Monospace (Space Grotesk) style to denote technical entry.

### Links
- Inline links must be Forest Green or underlined to distinguish them from body copy.

### Data Visualization
- Graphs and charts should follow the primary color palette. Use Forest Green for the primary data point and neutral tints for secondary data. Avoid "traffic light" colors (red/yellow/green) unless communicating risk.

### Lists
- Use simple, hanging indents or numbered lists in the Monospace font style to maintain the feeling of a structured memo.

## Responsive / Mobile

Mobile is a deliberately simpler reading mode. Same aesthetic, same content — calmer density, no hover dependency.

### Breakpoint model
Single codebase. Tailwind `md:` (≥768px) is the desktop threshold. No separate routes, no `.mobile.tsx` files.

### Type scale on mobile (below `md:`)
| Token | Desktop | Mobile |
|---|---|---|
| `display-lg` | 4.5rem / lh 1.1 | 2.75rem / lh 1.15 |
| `headline-lg` | 2.5rem / lh 1.2 | 1.75rem / lh 1.25 |
| `body-lg` | 1.25rem / lh 1.7 | 1.0625rem / lh 1.55 |

Body measure: cap at ~62ch on mobile (vs 65–75ch desktop).

### Spacing on mobile
- Section padding baseline: `py-10` mobile / `py-24` desktop.
- Block gaps: reduce `ProofStrip` and `AboutStrip` spacing so they read as one scroll-glance.

### Interaction rules (mobile)
- **No hover-only affordances.** Every state visible on `:hover` must be persistent or available via tap/`:active`. This is a hard rule — not a guideline.
- `pointer: coarse` media query can supplement Tailwind breakpoints when a JS-free CSS-only solution is sufficient.

### Component-level decisions

**Nav (`Nav.tsx`)**
- Kinetic per-character ink animation: disabled below `md:`. Render plain text.
- Section anchors: collapse to a `Menu` label (the word, not a hamburger) that opens a native `<dialog>` sheet. Links rendered at `headline-md` scale inside.
- LinkedIn/GitHub icons: bump from 14px to 18px hit area on mobile.
- SF clock: `hidden md:flex` — leave it.

**FeaturedCard / GroupedFeaturedCard**
- Whole card is a tap target on mobile (single `<Link>` wrapping title + outcome + category).
- `View →` / chevron CTA: always rendered; `opacity-60` on desktop, full opacity on mobile.
- `GroupedFeaturedCard` children: start expanded on mobile. Use `<details>`/`<summary>` or `defaultOpen` prop. Desktop keeps the click/hover reveal.
- Child link tap target: ≥44px height.

**VisualsSlider**
- Keep the indexed slider model. Add horizontal swipe on the visual frame without replacing the counter, caption, or keyboard controls.
- Prev/next arrows: always visible and sized for mobile touch.

**ProjectNavigator**
- Secondary metadata: always rendered on mobile (no hover-reveal).
- Layout: stacked vertical pair on mobile instead of horizontal.

**ProjectHero / View Transitions**
- Verify the `ViewTransition name={project-title-${slug}}` morph on Safari iOS.
- If it stutters: gate with `(prefers-reduced-motion: no-preference) and (pointer: fine)`.

**Hero canvas**
- Not redesigned for mobile.
- Perf gate: if below 30fps on real iPhone (check via Safari devtools), render a static settled-frame fallback gated on `matchMedia('(max-width: 640px)')` + `useReducedMotion()`.

### Touch feedback
Every interactive element must give a visible `:active` state — a background tint shift is sufficient. No element should look unpressed after a tap.
