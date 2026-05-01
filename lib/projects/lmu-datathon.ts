import { ProjectData } from './types';

export const lmuDatathonProject: ProjectData = {
  slug: 'lmu-datathon',
  title: 'LMU EMS Datathon',
  year: 'Spring 2026',
  type: 'Operations Analysis · Datathon · Post-Mortem',
  skills: ['EDA', 'Scenario Analysis', 'Data Visualization', 'Project Management', 'Presentation Design'],
  tagline: 'A 4-hour datathon on EMS meal-break compliance that turned into one of my clearest lessons on scope, dependencies, and baseline-first execution.',
  description: `Participated in LMU's datathon, where teams had 4 hours to analyze an air medical transport company's operations and answer a board-level question: if California meal-break requirements were enforced for 24-hour shift nurses, how often would the company be in violation, and what would reassignment do to response times? We moved fast enough to clean the data, characterize base-level operations, estimate break-violation exposure, and frame a reassignment scenario. The more durable value, though, came from the post-mortem. This project gave me one of the cleanest examples of how decent instincts and real effort can still create avoidable drag when the approach is wrong.`,
  outputs: [
    { label: 'Time Constraint', value: '4 hours from raw data to final recommendation' },
    { label: 'Durable Lessons', value: '3 takeaways: baseline first, remove dependencies, branch later' },
    { label: 'Peak Unavailability', value: 'Cut from 100% to 33% in our recommendations' },
  ],
  lessons: [
    {
      title: 'The baseline answer matters more than the smartest branch.',
      summary: 'I let the “so what?” question pull me into side paths before we had a minimum viable answer to the prompt.',
      full: `The main problem was not that I froze or failed to contribute. I kept reaching for the cleaner diagram, the tighter framing, the more interesting operating model before we had locked the lowest-level answer the board actually needed. Some of that thinking was useful. The issue was timing. In a four-hour competition, depth only helps after the baseline exists. Average response times, busiest bases, violation rates, reassignment penalty: those should have been on the page first. Once that foundation is real, then the more ambitious analysis has somewhere to attach.`,
    },
    {
      title: 'Dependencies are often self-inflicted.',
      summary: 'Slides waited on analysis, analysis waited on better framing, and the whole deck waited on “final” results that did not need to be final.',
      full: `That choice slowed the team down in ways that were avoidable. Because I was chasing cleaner explanations and more elaborate visuals, I was not helping lock the narrative early enough. Slides waited on analysis. Analysis waited on better framing. The presentation structure waited on “final” results. By the time I tried to use AI to speed up the deck, I had already lost too much time wandering. The lesson was less “move faster” and more “remove dependencies wherever possible.” Build the shell, make provisional assumptions, and keep optional analysis explicitly optional.`,
    },
    {
      title: 'Constraint management is a real skill.',
      summary: 'Good analysis is not just finding interesting patterns, it is controlling scope under pressure.',
      full: `The biggest durable lesson from this project was that constraint management is a learned skill, not a personality trait. Good analysis is not only about finding interesting patterns. It is also about cutting scope, knowing when a rough answer on time is worth more than a better one that shows up too late, and recognizing when your instinct to “make it more meaningful” is actually overcomplicating the work. I have reused that framework repeatedly since: establish the baseline, log the branches, and protect the team from avoidable waiting.`,
    },
  ],
  redos: [
    `Define the board question in one sentence within the first 30 to 45 minutes, audit the dataset, and choose the three or four outputs that have to exist no matter what.`,
    `Split work by workstream, not by vague ownership. One person on baseline KPIs, one on violation logic, one on reassignment logic, one on the slide shell and narrative, and one person explicitly keeping the whole thing on track.`,
    `Build the presentation shell before the results are final. If a section depends on an unfinished analysis, use a provisional assumption and mark it as a branch to confirm later.`,
    `Treat every extra analysis as a conscious branch with a cost. If it does not improve the board's first-order answer, it waits.`,
    `Use AI as an accelerator for bounded tasks instead of as a last-minute attempt to rescue the entire deck.`,
  ],
  specifics: `## The Business Question

The company wanted to know four things:

1. What current operations look like by base
2. When calls come in and how response times change
3. How often meal-break rules would create violations
4. What happens when calls have to be reassigned because a base is unavailable

## The Scenarios

**Scenario A — Baseline:** fixed 30-minute breaks at 4.5-5.0, 9.5-10.0, and 14.5-15.0 hours from shift start. Everybody breaks at the same time. Peak unavailability: 100%.

**Scenario B — Flexible:** nurses choose a 30-minute slot inside a wider window. Fewer violations, but everyone can still end up breaking together. Peak unavailability: 100%.

**Scenario D — Hybrid:** staggered break slots plus rerouting to the nearest other base when a base is unavailable. Peak unavailability drops to about 33%, which is why this became the recommendation.

## The Strongest Evidence

The most useful visuals were not the prettiest ones. They were the ones that directly answered the board's questions:

- response time by time of day
- actual pickup-zone maps by base
- break-violation logic across the shift windows
- reassignment penalty when the next closest base has to take the call

## Where The Process Broke

I got off track trying to over-explain the operation before the prompt itself had been answered. I wanted the diagrams to feel more complete and the story to feel more meaningful, but that instinct created drag. That post-mortem mattered more than the final placement because it produced a framework I still use: build a baseline first, then branch if time allows.
`,
};
