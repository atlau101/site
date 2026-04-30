import { ProjectData } from './types';

export const malloyNobleNoteProject: ProjectData = {
  slug: 'malloy-noble-note',
  title: 'Go-To-Market Strategy',
  year: 'Oct 2025',
  type: 'GTM Strategy · Brand Audit · Email Marketing',
  skills: ['Brand Audit', 'ICP Development', 'GTM Strategy', 'Email Marketing', 'Positioning'],
  tagline: 'A GTM strategy for Noble Note, a premium stationery startup — including a brand audit, ICP reframe, and lifecycle email sequence for their Kickstarter launch.',
  description: `Built a GTM strategy for Noble Note, a startup selling premium MagSafe leather notebooks and aerospace-grade aluminum pens. Performed a brand audit across their website and social media footprint: found heavily inconsistent messaging, multiple old brand names still live, and a significant gap between the actual buyer and the company's stated ICP. Delivered unified brand guidelines, mock-ups for social media and ad content, a new ICP profile, and a lifecycle email marketing sequence for their Kickstarter launch — welcome email, lead magnet placement, and flows segmented by audience.`,
  outputs: [
    { label: 'Brand Audit', value: 'Website + social footprint across all platforms' },
    { label: 'ICP Reframe', value: 'Creatives/artists → high-income corporate professionals (late 20s–40s)' },
    { label: 'Email Sequence', value: 'Welcome, lead magnet, 3 segmented lifecycle flows for Kickstarter launch' },
  ],
  visuals: [
    {
      src: '/proj-attachments/malloy-noble-note/noble_initialprop.png',
      caption: 'Initial proposition: brand audit findings and the gap between stated and actual ICP.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_brandingrec.png',
      caption: 'Branding recommendations: unified brand guidelines and messaging framework.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_brandingrec2.png',
      caption: 'Social media mock-ups: what brand consistency looks like in practice.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_brandingrec3.png',
      caption: 'Ad content mock-ups aligned to the repositioned ICP.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_brandingrec4.png',
      caption: 'Additional branding samples: visual identity applied across touchpoints.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_conclusionrec.png',
      caption: 'Executive summary: key findings and strategic recommendations.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_emailrec.png',
      caption: 'Email recommendation: subject line mock-up, visual, and CTA for the welcome flow.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_emailrec2.png',
      caption: 'Lead magnet placement strategy on-site.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_emailrec3.png',
      caption: 'Segmented email flow structure by audience type.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_lifecycle1.png',
      caption: 'Lifecycle marketing map — phase 1: awareness and Kickstarter pre-launch.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_lifecycle2.png',
      caption: 'Lifecycle marketing map — phase 2: launch and conversion.',
    },
    {
      src: '/proj-attachments/malloy-noble-note/noble_lifecycle3.png',
      caption: 'Lifecycle marketing map — phase 3: post-launch retention and referral.',
    },
  ],
  lessons: [
    {
      title: 'Clients need outside perspective, not validation.',
      summary: 'The right answer to client work is to challenge assumptions while staying grounded in research — not to validate, not to dismiss.',
      full: `When clients come to consultants, they tend to need outside perspectives more than just more validation. My team for this split consisted mostly of graduate students in the Marketing Intelligence program with extensive professional experience. I was the undergrad with the least on paper.

That gap ended up mattering in an unexpected way: I was the one who pushed us to challenge the founder's ideas, while the more experienced team members preferred to work within the client's parameters. Neither extreme — full validation or full skepticism — is right. The best approach to client work is to challenge assumptions while staying grounded in research and data.

The brand audit gave us the standing to push back. When you can show a founder that their messaging is inconsistent across every platform, that their old brand names are still live, and that their stated ICP doesn't match who's actually buying — that's not a judgment call, it's evidence. The ICP reframe from creatives/artists to high-income corporate professionals wasn't our opinion of who they should target. It came out of the competitive analysis and market research. That's what made the founder willing to hear it.`,
    },
  ],
  redos: [],
  specifics: `## How the brand audit worked and how the ICP shifted

The brand audit exposed a classic early-startup problem: the founders built something they were proud of engineering, and the brand reflected that — product specs, material details, hardware credibility. But product specs alone don't convey value to the customer, and this was even more of a problem given their pricing was on the high side.

**What the audit found:**
- Multiple old brand names still live across platforms (SideNote, Side Line, Noble Note — all active simultaneously)
- Product-focused copy everywhere: materials, specs, engineering details
- No consistent visual language across website, Instagram, LinkedIn
- Messaging aimed at the audience *they wanted* rather than the audience *who buys*

**The ICP reframe:**

Original target: creatives and artists — alternative writers, aesthetic-driven buyers.

Reframed target: high-income, corporate, male, late 20s–40s, fast-paced city, Equinox membership, disposable income, preference for things that signal competence without being flashy.

The pitch shifted from "crafting elegance" to "ideas that don't wait."

That reframe also changed the channel strategy. This audience isn't on social media the way a creative buyer is. We weighted outreach toward B2B channels (retailers, corporate gifting, airline first-class kits) alongside a tiered influencer push: micro (1K–10K), mid (10K–50K), and niche reviewers with specific audiences.

**The email sequence:**

Three lifecycle flows for the Kickstarter launch, each segmented by audience type. The welcome email led with the repositioned brand voice — direct, aspirational without being precious, focused on the use case rather than the materials. The lead magnet was placed on-site to capture intent before the launch date. Post-launch flows varied by engagement: backers got one sequence, non-converting visitors got another.`,
};
