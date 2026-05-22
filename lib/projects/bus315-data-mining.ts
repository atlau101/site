import { ProjectData } from './types';

export const bus315Project: ProjectData = {
  slug: 'bus315-data-mining',
  title: 'B2B Sales Pipeline Analytics',
  year: 'Fall 2025',
  type: 'Data Mining · ML · R',
  skills: ['R', 'dplyr', 'K-Prototypes Clustering', 'Data Engineering', 'Feature Engineering', 'CRM Analytics'],
  tagline: 'Applied k-prototypes clustering to a mock B2B CRM to surface pipeline segments from messy, mixed-type data.',
  descriptionLead: `Applied k-prototypes clustering to a mock B2B CRM in a Data Mining course, surfacing five distinct pipeline segments from mixed-type data. The dataset was synthetic and the scale was modest, but the work taught me how much of real ML happens before the model runs.`,
  description: `One of my earlier data projects. Part of my Data Mining course. Applied three core techniques — classification, clustering, and association rule mining — to a domain I actually wanted to work in: B2B SaaS sales. Took a mock CRM dataset with four relational tables (leads, accounts, products, sales agents) and merged them into a single analysis-ready master table using R. Performed significant data engineering & cleaning. Ran k-prototypes clustering and mapped aggregate profiles for each cluster. The dataset was mock, the scale was modest, and this was a class project — but it was a good experience to wrangling *somewhat* realistic data.
  VISUALS & MODEL EVALS COMING SOON.`,
  outputs: [
    { label: 'Sales Motion', value: 'Mapped the full B2B sales motion from prospecting through close' },
    { label: 'Pipeline Segmentation', value: '5 distinct deal/customer segments surfaced from CRM behavior and firmographics' },
    { label: 'Business Use', value: 'Built to support lead prioritization, sales cadence, and cross-sell planning' },
  ],
  lessons: [
    {
      title: 'Real ML starts with the data, not the model.',
      summary: 'The vast majority of my time went to cleaning the data: naming mismatches, strategic NA handling, derived feature flags.',
      full: 'Real-world CRM data (even a mock one) is messy. A naming mismatch between tables ("GTXPro" vs. "GTX Pro") would have silently broken the product join. 1,425 NAs in firmographic columns all came from the same independent accounts — dropping them would have removed a legitimate segment. 500 NAs in engage_date all corresponded to prospecting-stage deals — dropping them would have deleted signal, not noise. Each of those required a judgment call, not a formula. The actual model ran in minutes. The cleaning and feature engineering ran for days.',
    },
  ],
  redos: [
    `When I first did this project, it was part of a simple assignment for my data mining class. I was limited by both my ML knowledge at the time and the assignment requirements, and wasn't able to fully dive into what I would do if I were doing this for a real job. Recently looking back, I realized just what an interesting problem it was, **so I chose to redo it.** \n\n **Coming soon.**`,
  ],
  specifics: `## The Four-Table CRM Schema

- \`accounts.csv\` — customer firmographics: company name, sector, revenue, year established, office location, subsidiary relationships
- \`products.csv\` — product catalog: 7 products across two series (GTX, MG) with sale prices
- \`sales_teams.csv\` — agent directory: name, manager, regional office
- \`sales_pipeline.csv\` — the fact table: every opportunity with deal stage (won/lost/engaging/prospecting), engage date, close date, and close value

## Why the Merge Was Non-Trivial

The pipeline table was the fact table; the others were dimensions. I chained three left joins in R using \`dplyr\` to pull all dimension attributes into the pipeline. First integrity check: duplicates in the key tables. All clean — zero duplicate keys across all three dimension tables.

## Cleaning Decisions

- **GTXPro vs GTX Pro** — a naming mismatch between the pipeline and product tables that would've silently broken the product join. Fixed before the merge.
- **1,425 NAs in firmographic columns** — all from the same accounts, indicating independent clients not in the master account list. Labeled them "independent" rather than dropping.
- **500 NAs in \`engage_date\`** — all were in prospecting stage (verified with a table check). Created a binary \`missing_engage\` flag to preserve this signal for clustering.
- **Revenue and \`days_to_close\` NAs** — imputed with median revenue to avoid skew; coded unclosed deals as -1 on days_to_close; created separate binary flags for both so the original missing status was preserved alongside the imputed value.

## Why K-Prototypes Instead of K-Means

K-means only handles numeric variables. The dataset had five categorical variables (sector, office location, product series, deal stage, regional office) that were analytically important. K-prototypes handles mixed data types natively by combining numeric distance with categorical mismatch penalties.

## Picking k=5

Hardware limits prevented running \`validation_kproto\` to automate silhouette scoring. Instead, I ran k=3, 4, and 5 manually and compared total within-cluster sum:

| k | Within-Cluster SS |
|---|---|
| 3 | 116,946,802,844 |
| 4 | 108,577,526,604 |
| 5 | 88,940,880,653 |

The k=4→5 drop was steeper than k=3→4, indicating meaningfully tighter clusters at k=5.
`,
};
