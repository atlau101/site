import { ProjectData } from './types';

export const wildfireMLProject: ProjectData = {
  slug: 'wildfire-ml',
  title: 'Wildfire Proximity Prediction',
  year: 'Spring 2026',
  type: 'ML · Survival Analysis · Python',
  skills: ['Python', 'Survival Analysis', 'XGBoost', 'Feature Engineering', 'Kaggle', 'Cox PH', 'Random Survival Forest'],
  tagline: 'Survival analysis predicting the probability a wildfire reaches an evacuation zone across four time horizons, from just 5 hours of early perimeter data.',
  descriptionLead: `Built a survival model in a Kaggle datathon to forecast wildfire evacuation-zone risk from the first 5 hours of fire data. Ranked 627 of 1,256 — middling — but the lessons about foundational ML knowledge have been the most durable ones I've picked up.`,
  description: `The dataset had 30+ features — fire growth metrics, centroid movement and direction, distance dynamics relative to evac zones, and temporal reliability flags marking which fires had sparse or unreliable observations. The outcome was right-censored: fires that didn't reach an evac zone within 72 hours had unknown time-to-hit values. My team's best score was 0.96157, ranking 627 out of 1,256. Not an impressive score — but the lessons from this project have been among the most durable ones I've picked up.`,
  outputs: [
    { label: 'Decision Window', value: 'Forecasted risk 12–72 hours out from just 5 hours of fire data' },
    { label: 'Prediction Target', value: 'Probability a fire reaches within 5 km of an evacuation zone' },
    { label: 'Use Case', value: 'Supports earlier evacuation-risk triage and resource prioritization' },
  ],
  lessons: [
    {
      title: 'You can\'t diagnose a model you don\'t understand.',
      summary: 'Without foundational ML knowledge, iterating with AI becomes a loop with no exit.',
      full: 'I came into this class wanting to rival data scientists, thinking 7 weeks and some grit would close the gap. It didn\'t. The core issue was foundational ML knowledge. I was taking BUS316 (the supposed prerequisite) concurrently, so most of my modeling intuition was being built in real-time while I needed to use it. I didn\'t just lack advanced techniques — I lacked the vocabulary to diagnose why a model was failing. You feed data into XGBoost, the C-index improves 0.001, and then what? If you don\'t understand more complex ML concepts, asking an AI "how do I get a better score?" creates a loop: it suggests a technique, codes it for you, you submit, nothing changes, and you\'re back to square one. Because you don\'t know what lever to pull next.',
    },
    {
      title: 'Constraints force the thinking that open time avoids.',
      summary: 'A 4-hour LMU datathon produced more thorough work than 7 weeks of open-ended coursework.',
      full: 'In early March, I participated in a datathon at LMU — 4 hours, one problem, go. No weekly pacing, no "we\'ll get to it," just deadline pressure. My team ran a full ETL pipeline, EDA, model selection and refinement, and presentation all in 4 hours. The work was more thorough and more honest than what I produced across 7 weeks in class. Constraints forced prioritization. The lack of padding forced me to think instead of wander. That contrast sharpened a lesson I\'ve tried to apply since: when you have a hard deadline, you find out what actually matters.',
    },
    {
      title: 'The question is sharper than the answer.',
      summary: 'I didn\'t leave with a good model. I left with a precise map of what I needed to learn — and that\'s worth more.',
      full: 'The meta-question that stuck: how does a business-focused student compete with more tech-heavy majors when the tool — AI — is equally available to both? The clear answer is knowing enough to evaluate what AI gives you, to recognize when it\'s hallucinating or over-fitting, to redirect when it\'s off track. Business intuition helps, but you still need the foundational knowledge to translate that intuition into model diagnostics. I didn\'t have a clean answer leaving the class. I still don\'t, entirely. But naming the question precisely is further than I was before — and I\'ve been actively working on it since.',
    },
  ],
  redos: [
    `If I ran this project again, **I'd structure it as three consecutive sprints with clear success criteria and hard milestones** — not open-ended weeks. Sprint 1 (1 week): EDA & Feature Scoping — understand the data distribution, identify which features contain signal, decide which features to engineer. Success: a one-page summary of feature importance estimates (correlation, mutual information, or simple statistical tests) and a decision on which feature categories to prioritize. Sprint 2 (2–3 weeks): Model Exploration — test 3–4 candidates (Cox PH as baseline, RSF for nonlinearity, XGBoost AFT for gradient boosting) on a consistent validation setup. Success: a comparison table and a chosen model with documented rationale. Team play: assign each member a different model, compare results weekly. Sprint 3 (1–2 weeks): Refinement — hyperparameter tuning, feature interactions, calibration check.`,
    `On the technical side: **I'd feature engineer more aggressively.** We're not taught enough just how important feature engineering is. Engineered features demonstrate nonlinear relationships between variables better than any model can. The growth and distance categories were already the strongest predictors — there was more signal to extract there.`,
    `On the AI front: **I'd "bag" the approaches.** Run the same problem in 3–4 isolated AI chats, each with different system prompts or model contexts. Deliberately try opposing strategies — one asking for aggressive regularization, one for max performance, one for interpretability. Synthesize the best traits from each rather than iterating within a single compounding context where the AI builds on its own assumptions. That strategy didn't come from a textbook — it came from sitting with this problem and trying to reverse-engineer a fix.`,
  ],
  specifics: `## Right-Censored Outcome Structure

This wasn't standard binary classification. The target was time-to-event with censoring:

- **Event = 1**: Fire reached within 5km of evac zone; \`time_to_hit_hours\` is observed (0–72 hours)
- **Event = 0**: Fire never reached within 72 hours; \`time_to_hit_hours\` is censored (recorded as last observation time, ≤ 72 hours)

Survival models (Cox PH, RSF, XGBoost AFT) handle this natively. Standard classification or regression would either drop the censored cases or treat them incorrectly.

## Data Reliability Challenge: The low_temporal_resolution Flag

Not all fires were observed equally. Some had dense perimeter snapshots across the first 5 hours; others had only 1–2 observations. A fire with sparse data might show a growth rate of 500 ha/h — but if it was only observed once, that rate is meaningless noise. The dataset flagged this with \`low_temporal_resolution_0_5h = 1\`. If you treated all values in sparse-observation fires as true, the model would learn false patterns. The solution: stratified modeling (fit separately for high-res and low-res subsets) or setting them to NA and using survival models' missingness handling.

## Feature Categories

- **Temporal Coverage** (3 features): number of perimeters, time span between first and last, low-res flag
- **Growth** (8 features): initial area, absolute/relative growth, growth rate, log-transformed versions, radial growth
- **Centroid Kinematics** (6 features): centroid displacement, centroid speed, bearing angle and trig-encoded versions
- **Distance to Evac Zones** (8 features): minimum distance, standard deviation across zones, distance change over time, slope (speed toward zone), closing speed, projected advance, acceleration, fit quality
- **Directionality** (4 features): alignment cosine with evac direction, absolute alignment, cross-track component, along-track speed
- **Temporal Metadata** (3 features): hour of day, day of week, month

The growth and distance features were the strongest predictors. Directionality mattered for distinguishing fires on a collision course from ones sliding past the zones.
`,
};
