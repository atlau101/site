import { ProjectData } from './types';

export const malloyRebrandlyProject: ProjectData = {
  slug: 'malloy-rebrandly',
  title: 'Competitive Analysis & Brand Strategy',
  year: 'Nov 2024',
  type: 'Competitive Analysis · Brand Strategy',
  skills: ['Competitive Analysis', 'SWOT', 'Market Research', 'Brand Positioning'],
  tagline: 'A 28-page competitive analysis for Rebrandly, a link-management SaaS — evaluating market position against 6 competitors and delivering brand repositioning recommendations.',
  description: `Evaluated Rebrandly's market position against 6 competitors using an 8-point rubric covering core features, usability, pricing, and SEO health (keyword decay, backlink quality). Deliverable: a 28-page Canva research deck with a market overview, SWOT analysis, and brand positioning recommendations. This was my first client-facing project — prior, everything I'd done was coursework or personal projects with no real stakes.`,
  outputs: [
    { label: 'Competitors Analyzed', value: '6 tools across the link-management category' },
    { label: 'Rubric', value: '8-point weighted framework; Pricing & Usability weighted 30% each' },
    { label: 'Deliverable', value: '28-page research deck with SWOT + positioning recommendations' },
  ],
  visuals: [
    {
      src: '/proj-attachments/malloy-rebrandly/rebrandly_rubric.png',
      caption: 'Scoring rubric: 8 weighted categories forcing apples-to-apples comparison across tools that market themselves very differently.',
    },
    {
      src: '/proj-attachments/malloy-rebrandly/rebrandly_rubric2.png',
      caption: 'Rubric detail: per-category scoring breakdown across all 7 competitors.',
    },
    {
      src: '/proj-attachments/malloy-rebrandly/rebrandly_compdashboard.png',
      caption: 'Competitive dashboard: aggregate scores and positioning map.',
    },
    {
      src: '/proj-attachments/malloy-rebrandly/rebrandly_pricing.png',
      caption: 'Pricing page recommendation: restructuring to improve Rebrandly\'s worst-scoring category.',
    },
    {
      src: '/proj-attachments/malloy-rebrandly/rebrandly_dashboardrec.png',
      caption: 'Dashboard UX recommendation: addressing the low usability scores with concrete interface suggestions.',
    },
  ],
  lessons: [
    {
      title: 'Marketing and GTM baseline.',
      summary: 'First exposure to applying competitive analysis and positioning frameworks to a real product.',
      full: `This project was my first experience with any client-facing work. Competitively analyzing a real product for a real company felt different from coursework — the stakes were low by any professional standard, but the feedback loop was real.

It was also my first exposure to applying marketing and GTM fundamentals: how to structure a competitive analysis, what a SWOT is actually supposed to tell you versus what it looks like when you fill it out for its own sake. And while I wasn't the designated team lead, I found myself guiding direction at multiple points — pushing us back to the goal when we started drifting, keeping track of what still needed to get done.

I first started understanding what it meant to lead during this project. Not going to oversell it — the organizational instincts I developed here were more like a rough sketch of what I'd eventually need.`,
    },
    {
      title: 'Your job isn\'t to fix the client\'s problems.',
      summary: 'Reframing the job from "fix whether this product should exist" to "find where this product fits."',
      full: `The team's first instinct was to critique Rebrandly's positioning as a "premium" product in a market where they were clearly getting outpriced and outdesigned. That led toward trying to fix the category rather than the client's problem.

Once we reframed the job as "find where this product fits" instead of "fix whether it should exist," the analysis got more useful. The rubric started producing answers instead of just confirming what was already obvious. It's a simple distinction — but it's the kind of thing you only really learn by getting it wrong first.`,
    },
  ],
  redos: [],
  specifics: `## How the rubric worked and what it found

The rubric had 8 weighted categories designed to force apples-to-apples comparisons across tools that market themselves very differently. The heaviest weights were **Pricing & Value (30%)** and **Usability (30%)** — because in a commodity market, adoption comes down to what it costs and whether people will actually use it.

The scores told a pretty clear story:

| Tool | Total Score |
|------|-------------|
| Dub.co | 14.35 |
| Short.io | 13.95 |
| Bitly | 12.65 |
| YOURLS | 10.90 |
| **Rebrandly** | **10.10** |
| BL.INK | 9.45 |
| TinyURL | 9.35 |

Rebrandly landed 5th out of 7. Their biggest drag was Pricing & Value — every reviewer flagged them as the worst price-to-feature ratio in the group. Their UI scored low too: described as "kinda cheap and full of stock photos, confusing to navigate." Their strongest category was Security & Privacy, where AI-backed spam detection gave them a meaningful edge.

## Recommendations

The positioning recommendation was to stop competing on price (unwinnable) and lean hard into the enterprise security angle — the one category where Rebrandly's differentiation was real. The pricing page redesign proposal restructured their tiers to make the security value visible earlier in the funnel. The dashboard UX recommendation was simpler: reduce cognitive load on first use, which was killing conversion.`,
};
