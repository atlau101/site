import { ProjectData } from './types';

export const bus315Project: ProjectData = {
  slug: 'bus315-data-mining',
  title: 'B2B Sales Pipeline Analytics',
  year: 'Fall 2025',
  type: 'Data Mining · ML · R',
  skills: ['R', 'dplyr', 'K-Prototypes Clustering', 'Data Engineering', 'Feature Engineering', 'CRM Analytics'],
  tagline: 'Applied k-prototypes clustering to a mock B2B CRM to surface pipeline segments from messy, mixed-type data.',
  description: `For my Data Mining course, I applied three core techniques — classification, clustering, and association rule mining — to a domain I actually wanted to work in: B2B SaaS sales. The dataset was a mock CRM with four relational tables (leads, accounts, products, sales agents) that I merged into a single analysis-ready master table using R. The bulk of the work was data engineering: catching key discrepancies, handling NAs intelligently rather than just dropping rows, and engineering derived features like \`days_to_close\` and binary missing-value flags so the clustering algorithm could run without throwing errors. I ran k-prototypes clustering — chosen over standard k-means because the dataset had both numeric and categorical variables — landed on k=5 as the optimal cluster size, and mapped aggregate profiles for each cluster. The dataset was mock, the scale was modest, and this was a class project — but it's an honest demonstration of data thinking applied to a problem I genuinely care about.`,
  outputs: [
    { label: 'Tables Merged', value: '4 relational CRM tables' },
    { label: 'Optimal Clusters', value: 'k=5' },
    { label: 'Within-Cluster SS', value: '116B → 88B (k=3 to k=5)' },
  ],
  lessons: [
    {
      title: 'Real ML starts with the data, not the model.',
      summary: 'The vast majority of the time went to cleaning — naming mismatches, strategic NA handling, derived feature flags.',
      full: 'Real-world CRM data (even a mock one) is messy. A naming mismatch between tables ("GTXPro" vs. "GTX Pro") would have silently broken the product join. 1,425 NAs in firmographic columns all came from the same independent accounts — dropping them would have removed a legitimate segment. 500 NAs in engage_date all corresponded to prospecting-stage deals — dropping them would have deleted signal, not noise. Each of those required a judgment call, not a formula. The actual model ran in minutes. The cleaning and feature engineering ran for days.',
    },
    {
      title: 'Knowing the domain makes you a better analyst.',
      summary: 'B2B sales context told me why the signals were sparse and why standard k-means wouldn\'t work.',
      full: 'This was the first time I applied ML techniques to something I was familiar with and interested in. Because I already understood B2B sales cycles, I could see why deal-stage features mattered more than company revenue, why days_to_close was meaningless for open deals, and why categorical variables like sector and product series were analytically critical — which meant standard k-means (numeric only) wouldn\'t cut it. Domain knowledge told me to reach for k-prototypes before I even opened the documentation. That\'s different from applying a technique because the lecture covered it.',
    },
  ],
  redos: [
    `When I first did this project, it was part of a simple assignment for my data mining class. I was limited by both my ML knowledge at the time and the assignment requirements, and wasn't able to fully dive into what I would do if I were doing this for a real job. Recently looking back, I realized just what an interesting problem it was — **so I chose to redo it.**`,
    `**The incomplete piece:** the cluster objects were joined back to sales_master, but segment naming and sales playbook mapping — the actual business deliverable — was left as a documented next step. If I ran this today, I'd take the k=5 cluster outputs, join them back to sales_master, and map actionable sales cadences per segment: which clusters warrant high-touch outreach, which are best handled programmatically, which are likely to churn. I still have the code. That's the next step.`,
    `On the modeling side: **I'd also explore whether classification** (predicting won/lost from firmographic + behavioral features) adds anything beyond clustering for the playbook problem — and whether association rules surface any interesting product-pairing patterns worth surfacing to sales reps.`,
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
