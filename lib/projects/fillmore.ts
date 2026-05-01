import { ProjectData } from './types';

export const fillmoreProject: ProjectData = {
  slug: 'fillmore',
  title: 'Fillmore Ecosystem',
  year: 'Fall 2025',
  type: 'Research · Market Analysis · Community',
  skills: ['Community Research', 'Field Interviews', 'Market Analysis', 'SWOT', 'Public Policy', 'Data Analysis'],
  tagline: 'Community-based research into SF\'s Lower Fillmore food and pharmacy desert after the Safeway closure.',
  description: `Spent a semester doing community-based research in SF's Lower Fillmore neighborhood to address the neighborhood's declining economy. My team focused on the fallout from the Safeway closure at Fillmore & Webster — a move that created a food and pharmacy desert for ~8,700 residents, 17% of them seniors, with 50% of some tracts below SF's poverty line. We estimated $6.8M–$10.3M in annual grocery spend and $1.6M–$2.0M in pharmacy revenue leaking out of the neighborhood. Before ideating solutions, we walked the block, interviewed residents and local businesses (KC Paris Desserts, Sheba Jazz, Miyako's), studied the neighborhood's demographics, and researched its history as the former "Harlem of the West." We evaluated two redevelopment models via SWOT analysis and pitched our main recommendation — a hybrid Fillmore Community Marketplace — as a poster at YesSF and as a live presentation to a panel of 6 SF decision-making executives.`,
  outputs: [
    { label: 'Residents Affected', value: '~8,700 after the Safeway closure' },
    { label: 'Estimated Annual Leakage', value: '$8.4M–$12.3M across groceries and pharmacy' },
    { label: 'Decision-Maker Audience', value: 'Presented live to 6 SF executives at YesSF' },
  ],
  visuals: [
    {
      src: '/proj-attachments/fillmore/BUSCAPposter.png',
      caption: 'Our research poster presented at YesSF — the hybrid Fillmore Community Marketplace model.',
    },
    {
      src: '/proj-attachments/fillmore/BUSCAPandrew+orlando.jpg',
      caption: 'Presenting at the YesSF open floor alongside my teammate Orlando.',
    },
    {
      src: '/proj-attachments/fillmore/BUSCAPtalkmore.jpg',
      caption: 'Open floor Q&A at YesSF — fielding questions from attendees and decision-makers.',
    },
    {
      src: '/proj-attachments/fillmore/BUSCAPteam.jpg',
      caption: 'The team.',
    },
    {
      src: '/proj-attachments/fillmore/BUSCAPpanelists.jpg',
      caption: 'The panelists — 6 SF decision-makers evaluating our pitch.',
    },
  ],
  lessons: [
    {
      title: 'Community benefit needs the language of commerce to survive.',
      summary: 'Good intentions don\'t make it past a planning table without margin math behind them.',
      full: 'This project was a sobering lesson in the limitations of grassroots entrepreneurship and how business actually moves. I realized that community impact — the kind that\'s real and meaningful to residents — isn\'t naturally legible to the systems that make decisions about land use, development approvals, and commercial investment. Through our SWOT analyses, we recognized that simply incentivizing another massive national chain to move into where the Safeway originally was wouldn\'t solve the root issues that pushed out the old tenant (like organized theft and low margins). Yet, pitching a community-owned model to city planners was incredibly difficult because those same community benefits aren\'t easily quantifiable in the strict language of commerce, capitalism, and tax incentives.\n\nIt doesn\'t mean community work is pointless — it means the work of translating community needs into business logic is real and hard, and most people skip it. Everything requires margins and feasibility checks. If you want community benefit to survive contact with that system, you have to root it in concrete facts, or be honest that your proposals will likely be sidelined by the top-down, multi-year luxury development plans already in motion by corporate real estate holding companies.',
    },
    {
      title: 'Quantifying the intangible is half the pitch.',
      summary: 'Research, analytics, and storytelling are the bridge between a vision/idea and concrete impact.',
      full: 'What I learned here doesn\'t just apply to community-focused work. This was an exercise in translating qualitative reality into the numbers that drive decisions. The core skill is the same whether you\'re pitching a B2B SaaS or a neighborhood marketplace: using analytics, research, and storytelling as a translation layer between a qualitative vision and concrete metrics. The leakage math — bottom-up pharmacy estimates from prescription frequency, grocery estimates from BLS consumer expenditure data — turned "the community deserves better" into "$12M is leaving this zip code annually." That\'s a different conversation.',
    },
  ],
  redos: [],
  specifics: `## Why the Safeway Closed

Rampant retail theft and safety concerns for both employees and customers made the location unprofitable. Safeway pulled out despite community pleas. The closure took the neighborhood's grocery anchor and only full-service pharmacy in one move. Walgreens on Bush & Fillmore became the de facto backup and got visibly overwhelmed almost immediately.

## The Leakage Math

**Pharmacy:** 7,500 adult residents, assume half fill prescriptions outside the neighborhood → 3,750 adults × 3 prescriptions/month × $12–$15 avg = $135K–$169K/month → **$1.6M–$2.0M annually**.

**Grocery:** Built from BLS consumer expenditure data for the lowest income quintile and tract-level median incomes from census data → **$6.8M–$10.3M annually**.

## Community Research Methodology

Before touching a single solution, we spent weeks just learning. The class used an Ideal Ecosystems framework to identify what the neighborhood's values and assets actually were — not what outsiders assumed. Community strength and cultural history came up consistently as assets. The deficits: no outside draw, stagnant foot traffic, a post-COVID reputation that residents knew was mostly connotation but that businesses used as a reason not to invest.

Interviews surfaced what data couldn't. Residents didn't just want a grocery store back — they wanted a voice in what replaced it.

## The Two-Model SWOT

**Traditional chain model** (recruit Grocery Outlet, Smart & Final, 99 Ranch via tax incentives): faster, operationally simpler. Doesn't address why Safeway left — thin margins, organized theft, lack of community integration. A new national chain faces the same structural pressures.

**Hybrid model** (supermarket anchor + local vendor stalls + community pharmacy + advisory governance): more resilient because it diversifies tenants and builds community buy-in. The weakness: community benefit is hard to pitch in the margin language developers and city planners actually speak.

## The Hybrid Model Design

Supermarket anchor (~50% of a 55,000 sq ft floor, leaning toward Grocery Outlet or similar value-oriented operator) + local micro-tenants: produce stall, bakery, hot food counter honoring Fillmore's soul food and jazz history, small pharmacy. Security via Urban Alchemy — community ambassadors, not armed guards. Community advisory committee with decision-making power over programming and vendor selection. Hiring from the neighborhood prioritized.

## The Honest Forecast

Align Real Estate had already filed a proposal for ~1,000 housing units on the Safeway lot. If that went through — probable, given SF's acute housing pressure — the area faced 3–5 years of construction regardless of what any class project recommended. The hybrid marketplace wasn't likely to be implemented as pitched. The YesSF presentations were most valuable as a signal: students had done the research, the community had organized, and there were specific, data-backed asks on the table.
`,
};
