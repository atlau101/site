import { ProjectData } from './types';

export const malloyAmalProject: ProjectData = {
  slug: 'malloy-amal',
  title: 'Smart Attendance Feasibility Study',
  year: 'Feb 2025',
  type: 'Feasibility Study · Market Research',
  skills: ['Feasibility Analysis', 'Framework Design', 'Market Research', 'Stakeholder Analysis'],
  tagline: 'A 5-pillar feasibility study on NFC-based smart attendance for Amal & Company — and why the original market was the wrong one.',
  description: `Conducted a feasibility study on whether an NFC-based smart attendance system could work in higher education. Built a 5-pillar evaluation framework from scratch: Assessment (market demand, competitive landscape), Stakeholders (who pays, who pushes back), Legal Requirements (FERPA, privacy law, institutional policy), Onboarding & Management (IT integration, cybersecurity, training), and Platform Components (hardware, software, logistics). Ran the framework across 8+ markets. The research systematically disqualified the original target and pointed toward Blue Ocean opportunities the client hadn't considered.`,
  outputs: [
    { label: 'Markets Reframed', value: 'Redirected the product toward higher-fit care and facility use cases' },
    { label: 'Adoption Risks Flagged', value: 'Privacy, policy, and integration barriers mapped before launch' },
    { label: 'Expansion Paths', value: 'Senior living and hospitals surfaced as the strongest next markets' },
  ],
  visuals: [
    {
      src: '/proj-attachments/malloy-amal/amal&comp_framework.png',
      caption: '5-pillar framework: built to handle a feasibility question with both technical and cultural dimensions.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_marketsummary.png',
      caption: 'Market summary: aggregate assessment across all evaluated verticals.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_uniassess1.png',
      caption: 'University assessment — pillar 1: market demand and competitive landscape.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_uniassess2.png',
      caption: 'University assessment — pillars 2–3: stakeholder mapping and legal requirements (FERPA).',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_uniassess3.png',
      caption: 'University assessment — pillars 4–5: onboarding constraints and platform components.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_seniorhomesassess.png',
      caption: 'Senior living assessment — where the privacy framing flips: location tracking is a safety feature, not a liability.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_seniorhomesassess2.png',
      caption: 'Senior living — stakeholder and legal analysis: HIPAA-compliant, valued by caregivers.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_seniorhomesassess3.png',
      caption: 'Senior living — platform and onboarding feasibility.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_confcentassess1.png',
      caption: 'Conference center assessment — pillar 1.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_confcentassess2.png',
      caption: 'Conference center assessment — pillars 2–3.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_confcentassess3.png',
      caption: 'Conference center assessment — pillars 4–5.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_schoolassess1.png',
      caption: 'K-12 assessment — pillar 1.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_schoolassess2.png',
      caption: 'K-12 assessment — pillars 2–3.',
    },
    {
      src: '/proj-attachments/malloy-amal/amal&comp_schoolassess3.png',
      caption: 'K-12 assessment — pillars 4–5.',
    },
  ],
  lessons: [
    {
      title: 'Product feasibility means following the research, not the brief.',
      summary: 'The client\'s original target was wrong — the framework\'s job was to show that without making it personal.',
      full: `The main skill this split sharpened was stress-testing a product against market reality. We were hired to figure out how to integrate an NFC attendance system into higher education — but we quickly identified it was a significant stretch. Our job wasn't to debate whether the idea was worth pursuing, but to help them move forward. So we started there, tried to make it work for the client's original target, and followed the research wherever it went.

It went pretty far against them. Most universities already have NFC infrastructure for ID and payments — the attendance piece wasn't missing because of a technology gap, it was blocked by policy, privacy backlash, and legal constraints. SpotterEDU faced 50% opt-out rates when piloted. FERPA compliance requirements are explicit. Some schools (like SJSU) outright forbid using attendance for grading. That's not something you can engineer your way around.`,
    },
    {
      title: 'Pushing back on a client means showing your work.',
      summary: 'Contrary feedback lands when it comes from a framework, not a judgment call.',
      full: `Pushing back on a client doesn't have to mean confronting them — it means showing your work. Just saying we thought the idea was bad because we're students who hate attendance wouldn't have helped anyone. By calling out our own biases first, then grounding our pushback in research, we were able to provide feedback that was actionable even when it was contrary to what the client had in mind.

When our framework systematically eliminated markets, it was a result of a process — not a judgment call. The pivot toward Blue Ocean markets (senior living, hospitals) didn't feel adversarial because it came from the same analysis that disqualified the original direction. The client could trace the logic. That's what made it useful.`,
    },
  ],
  redos: [],
  specifics: `## How the framework was built and what we found

The 5-pillar framework wasn't handed to us — we built it to handle a feasibility question that had both technical and cultural dimensions. A purely technical evaluation would've missed the key problem: most universities already have NFC infrastructure, but attendance is where adoption falls apart. The barriers weren't hardware — they were policy, privacy backlash, and FERPA compliance requirements.

**The five pillars:**
1. **Assessment** — market demand, competitive landscape, existing solutions
2. **Stakeholders** — who pays, who pushes back, where leverage lives
3. **Legal Requirements** — FERPA, privacy law, institutional policy
4. **Onboarding & Management** — IT integration, cybersecurity, training requirements
5. **Platform Components** — hardware, software, logistics

**What the framework found by market:**

- **Higher education (original target):** Red Ocean. NFC infrastructure already exists; the gap is adoption will, not technology. Heavy student privacy objections, FERPA hurdles, and explicit university policies blocking use for grading. Disqualified on Stakeholders and Legal pillars.

- **Senior living:** Blue Ocean. The privacy framing flips entirely — real-time location tracking is a *safety* feature, not a liability. HIPAA-compliant, valued by caregivers, families willing to pay. Strong feasibility on all five pillars.

- **Hospitals:** Similar to senior living — staff accountability and patient tracking are established use cases. Regulatory environment is harder but the value proposition is clear.

- **Events / conferences:** Moderate fit. High-volume attendance tracking is a genuine problem; no privacy backlash. Weaker on the Platform pillar (hardware deployment at scale).

The honest conclusion: the client had a real product in the wrong market. The framework's job was to show that cleanly — not to kill the project, but to redirect it toward markets where NFC attendance solved a problem that actually existed.`,
};
