import { ProjectData } from './types';

export const sbaCreditDesertsProject: ProjectData = {
  slug: 'sba-credit-deserts',
  title: 'Small-Business Credit Desert Early Warning System',
  year: 'Spring 2026',
  type: 'Data Engineering · ML Forecasting · Public-Interest Analytics',
  skills: [
    'XGBoost',
    'Geospatial Feature Engineering',
    'Walk-Forward Validation',
    'Rare-Event Modeling',
    'Pipeline Design',
    'MapLibre / Dashboard Product',
  ],
  tagline:
    'A two-layer XGBoost forecast and interactive dashboard predicting small-business credit deserts at 3- and 6-year horizons across 77K U.S. census tracts.',
  descriptionLead: `Built an end-to-end forecasting system that predicts which U.S. tracts and counties will become small-business credit deserts in 2027 and 2030. Trained on a 2.97M-row tract-year panel stitched from CRA, HMDA, ACS, FDIC, and SSBCI sources. Shipped as an interactive MapLibre dashboard covering 77K tracts and 3,142 counties.`,
  description: `The system splits prediction into two lenses: a Diagnostic model that shows whether demographic and environmental conditions are driving local credit risk, and an Influenceable model that isolates lending-environment variables — branches, mission lenders, lender concentration, state programs — that policy could actually move. Both models are XGBoost classifiers evaluated walk-forward across 8 time-split folds with per-fold isotonic calibration, and the dashboard pairs them with scenario sliders that let users move a lever and watch the national risk map recolor live.`,
  links: [
    { label: 'Live dashboard', href: 'https://zapidy.github.io/BUS410.Team7.Dashboard/' },
    { label: 'GitHub repo', href: 'https://github.com/Zapidy/BUS410.Team7.Dashboard' },
  ],
  outputs: [
    { label: 'Panel Scale', value: '77,036 tracts · 3,142 counties · 2009–2024' },
    { label: 'CRA Records Ingested', value: '20.1M rows across federal lending data' },
    { label: 'Best Model Fit (h+3)', value: 'Diagnostic AUC 0.875 · AP 0.322' },
  ],
  visuals: [
    {
      src: '/proj-attachments/sba/00-walkthrough.mp4',
      caption: 'Full dashboard walkthrough: lens swaps, horizon toggle, tract zoom, state drill-down, and scenario sliders.',
    },
    {
      src: '/proj-attachments/sba/01-hero-dashboard.png',
      caption: 'National county view, Diagnostic lens at the 2027 horizon.',
    },
    {
      src: '/proj-attachments/sba/02-lens-influenceable.png',
      caption: 'Influenceable lens: same map, recolored to highlight lending-environment risk only.',
    },
    {
      src: '/proj-attachments/sba/04-dark-mode.png',
      caption: 'Dark mode at tract resolution — 83,247 tracts colored by Diagnostic risk, with model metrics in the right rail.',
    },
    {
      src: '/proj-attachments/sba/07-scenario-levers.png',
      caption: 'Scenario sliders — bank branch distance, branches within 5 mi, MDI branch reach, SSBCI program coverage — recolor the map live.',
    },
    {
      src: '/proj-attachments/sba/06-state-detail.png',
      caption: 'State drill-down: clicking AK swaps the right rail for an in-state percentile view.',
    },
    {
      src: '/proj-attachments/sba/09-methodology-why-2027.png',
      caption: 'Methodology: federal CRA/HMDA data lags ~2 years, so 1-year-ahead forecasts are useless — 2027 and 2030 are the soonest actionable horizons.',
    },
    {
      src: '/proj-attachments/sba/10-methodology-feature-groups.png',
      caption: 'Feature-group sensitivity: how each category of input pulls the forecast.',
    },
    {
      src: '/proj-attachments/sba/11-methodology-covid-break.png',
      caption: 'Pre/post-COVID regime split — short-horizon AUC fell from 0.817 to 0.734 after 2020.',
    },
    {
      src: '/proj-attachments/sba/12-methodology-blindspots.png',
      caption: "What we still can't see: CDFI geocoding gaps, intra-county lender shifts, and the limits of administrative data.",
    },
  ],
  lessons: [
    {
      title: 'Prediction and action are not the same problem.',
      summary: 'A model is only worth as much as someone\'s ability to act on it.',
      full: `Halfway through the project we realized our cleanest model wasn\'t the most useful one. Our original approach was a single tract-level XGBoost trained on every feature we could pull together — demographics, environment, branch geography, lender concentration, state programs — that ranked tracts by predicted credit-desert risk. The headline metrics were strong and the map looked sharp. \n\nThe issue: our model was trained well, but it doesn\'t tell anyone what to do — and a lot of the strongest features (median income, racial composition, prior loan volume) describe conditions nobody can directly change.\n\nSo we split the architecture into two lenses. **Diagnostic** uses 39 features — demographics, environment, status-quo signals — to show *where* small-business credit risk is concentrated. **Influenceable** uses 20 features drawn only from the more short-term lending environment — bank branches, CDFI/mission lenders, lender concentration, SSBCI state programs — variables policymakers, lenders, and community lenders can actually move.\n\nThe Influenceable model is weaker on paper. We chose to ship it anyway because a "policy lens" you can act on beats a sharper score you can\'t.`,
    },
    {
      title: 'For rare events, accuracy lies. Average precision tells the truth.',
      summary: 'Random-baseline AP is ~1.7% here — single-number metrics hide whether the model actually surfaces deserts.',
      full: `Credit deserts are by definition rare events. The base rate of a tract becoming a "service desert" at a given horizon hovers around 1–2%, which means a model can hit 98% accuracy by predicting "not a desert" for every tract on the map. AUC has the same problem in milder form — it stays high even when the model is useless at the top of the ranking.\n\nWe evaluated everything against **average precision (AP)** and **AP-lift over the random baseline**, walk-forward across 8 time-split folds, with **per-fold isotonic calibration** so the probabilities meant something. The final h+3 Diagnostic fit was AUC 0.875 / AP 0.322 — about 19× lift over a 1.7% baseline. We reported fold spread on every metric so the headline number couldn\'t hide variance.`,
    },
  ],
  redos: [],
  specifics: `## The pivot: from loans to places

The original plan was to predict SBA 7(a) and 504 loan-level outcomes — would a given loan be originated, would it default. We abandoned it after recognizing it as "using loans to predict loans." The features available at decision time were themselves loan-derived, so the model was effectively memorizing the answer key. Textbook leakage.

We pivoted to predicting *places* instead of *loans*: which census tracts and counties become small-business credit deserts at 1-, 3-, and 6-year horizons. The signal still has to come from somewhere defensible, so we rebuilt the entire pipeline on top of public administrative data — CRA, HMDA, ACS, FDIC, SSBCI, Opportunity Zones — with no loan-level outcomes leaking back into the features.

## The data spine

- **CRA (Community Reinvestment Act):** 20.1M rows of bank small-business lending activity by tract and year. The core target signal.
- **HMDA (Home Mortgage Disclosure Act):** mortgage lending volume and approval rates as a proxy for lender presence and household borrowing capacity.
- **ACS (American Community Survey):** tract-level demographics, income, education, business ownership.
- **FDIC branch geography:** bank branch locations over time — open, close, merger, divestiture.
- **SSBCI state policy overlays:** State Small Business Credit Initiative program coverage by year.
- **Opportunity Zones:** tract-level federal incentive designation as a contextual flag.
- **CDFI / MDI / microlender proximity:** *planned* but currently null in the shipped pipeline (see Known Limitations).

## The panel

2.97M tract-years across 77,036 tracts × 16 years (2009–2024). Targets are tract-level binary indicators for *service deserts* (no covered lender activity) and *origination deserts* (zero covered originations) at h+1, h+3, h+6. Counties are aggregated up from the tract panel.

## The two-model architecture

- **Diagnostic (39 features).** Demographics, income, education, business density, prior lending volume, geography. Answers: *where does risk live, and what does the local context look like?*
- **Influenceable (20 features).** Bank branches, CDFI/MDI/microlender proximity (planned), lender concentration, SSBCI state coverage. Answers: *what variables could a policymaker, regulator, or mission lender actually move?*

Both are XGBoost classifiers. Why split rather than ship one model with feature importance scores: importance scores let people pick whichever feature confirms their priors, while a hard split forces the dashboard to be honest about which questions each model is qualified to answer.

## Validation discipline

- **Walk-forward time splits.** 8 folds, each trained on data through year T and evaluated on year T+horizon. No future information leaks backward.
- **Per-fold isotonic calibration.** Raw XGBoost probabilities are not well-calibrated for rare events; isotonic regression maps them back to something the dashboard can show as a percentile.
- **Ablation tests.** Dropped each feature group in turn to confirm no single category was carrying the model.
- **Final fits (h+3):** Diagnostic AUC 0.875 / AP 0.322. Influenceable AUC 0.820 / AP 0.282. Fold spread reported on both.

## The dashboard

Three primary controls:

- **Lens:** Diagnostic vs Influenceable
- **Horizon:** 2027 (h+3) vs 2030 (h+6)
- **Geography:** County (default) vs Tract (detail)

Plus six **scenario sliders** for the Influenceable lens — SSBCI program coverage, SBA branch density, microlender ecosystem, lender concentration, and others. Move a slider and the map recolors live. Each lever uses model sensitivity, category-dependence checks, and feature strength to estimate how the forecast responds. It is sensitivity, not a causal guarantee, and the in-product copy says exactly that.

Right rail surfaces the top states by mean risk, the weakest-lens states, the national risk-decile distribution, and an in-state percentile drill-down when a state is clicked.

## Known limitations

- **CDFI / MDI / microlender proximity is currently all-null in the shipped pipeline.** We had the source list and the join logic, but the geocoding step didn\'t finish before the dashboard shipped. The Influenceable model runs without it. This is flagged in the in-product methodology section and here — an honest version of this project names the gap rather than hiding it.
- **Lender concentration partially overlaps with the "number of lenders" target signal.** It\'s a known feature-discipline gap. A cleaner next pass would residualize concentration against the target or drop it entirely.
- **The pandemic broke the short horizon.** Pre-COVID AUC was 0.817 at h+1; post-COVID it dropped to 0.734. The 3- and 6-year horizons held up better, which is part of why we ship those instead of next-year.
`,
};
