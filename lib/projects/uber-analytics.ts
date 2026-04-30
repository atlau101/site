import { ProjectData } from './types';

export const uberAnalyticsProject: ProjectData = {
  slug: 'uber-analytics',
  title: 'Uber India Ride Analytics',
  year: 'Fall 2025',
  type: 'Data Visualization · Tableau',
  skills: ['Tableau', 'Data Visualization', 'Hypothesis-Driven Analysis', 'Business Analytics', 'Dashboard Design'],
  tagline: 'Interactive Tableau dashboard testing three business hypotheses against Uber India ride data — two confirmed, one rejected.',
  description: `Built an interactive Tableau dashboard to analyze Uber India ride data, framed around three testable business hypotheses: whether driver wait time drives cancellations, whether premium vehicles generate higher booking values and ratings, and whether digital payments dominate revenue. All three produced definitive answers — two confirmed, one rejected. The final dashboard was published to Tableau Public with vehicle-type and payment-method filters. The most important finding came from the rejected hypothesis: premium vehicles didn't outperform. UberXL had the lowest typical booking values of any tier, and customer ratings were effectively flat across all vehicle types. The visualization that surfaced this also went through the most revision — and catching that wrong chart was where the real analytical work happened.`,
  outputs: [
    { label: 'Hypotheses Tested', value: '3 (2 confirmed, 1 rejected)' },
    { label: 'Max Wait Threshold', value: '15.1 min cancellation cliff' },
    { label: 'UPI Revenue', value: '~$23M+ (dominant payment method)' },
  ],
  lessons: [
    {
      title: 'The chart that tests the hypothesis is rarely the first one you build.',
      summary: 'The premium vehicle hypothesis started as a scatter plot of ride time vs. customer rating — the wrong variables entirely.',
      full: 'My first draft for H2 was a scatter plot of ride time vs. customer rating. That chart has nothing to do with whether premium vehicles generate higher booking values or ratings — it doesn\'t even use those variables. Catching that and switching to dual box plots (booking value distribution and customer rating distribution, both split by vehicle type) was where the real analytical work happened. The wrong chart looked analytical. The right chart actually tested the claim. That distinction — does this visualization answer the hypothesis or does it just look like it does — is the main thing this project sharpened.',
    },
    {
      title: 'Axis scaling is an ethical decision.',
      summary: 'Customer ratings were originally scaled 3–5. Technically defensible. Changed it to start at 0 anyway.',
      full: 'The minimum observed rating was 3.93 across every vehicle type and category, so starting the axis at 3 was technically accurate and made differences more visible. I corrected it to start at 0 anyway. A reader who doesn\'t notice the axis origin will read the chart as showing dramatic rating differences across vehicle types. It doesn\'t. Deliberately or not, that kind of scaling misleads — and I\'d rather lose a visual effect than imply a finding that isn\'t there.',
    },
  ],
  redos: [],
  specifics: `## H1 — Driver Wait Time → Cancellations
*Hypothesis: When avg VTAT exceeds a threshold, cancellation rates increase significantly.*

**Finding:** Cancellation rate hits 100% past 15.1 minutes of VTAT (driver arrival time); no meaningful correlation below that threshold.

**Design decisions:** Removed the VTAT filter (redundant given the obvious cutoff); removed the trend line (R²=0.6, pattern self-evident); added a parameter toggle between aggregated view and vehicle-type segmented view.

**Recommendation:** Implement a 14-minute max wait threshold with driver fee penalties.

---

## H2 — Premium Vehicles → Higher Value + Ratings
*Hypothesis: Higher-tier vehicles achieve higher average booking values and slightly higher customer ratings.*

**Finding: Hypothesis rejected.** UberXL had the lowest typical booking values of any vehicle type. Customer ratings were effectively flat across all tiers.

**Design evolution:** Started as a scatter plot of ride time vs. customer rating (wrong variables — doesn't test the hypothesis). Switched to dual box plots: booking value distribution and customer rating distribution, both split by vehicle type. Fixed y-axis to start at 0 (originally scaled 3–5). Added box plot annotation for readers unfamiliar with IQR notation.

**Recommendation:** Audit the premium vehicle experience end-to-end — underperformance suggests a product issue, not a pricing one. Also: the rating scale itself is broken — ratings never fell below 3.93 across any category, meaning the 1–5 scale isn't surfacing real variance.

---

## H3 — Digital Payments → Revenue Dominance
*Hypothesis: Digital payment methods have higher total booking value than cash.*

**Finding: Confirmed** — but the dominant method was UPI, not credit cards. UPI is India's native bank-to-bank system (Google Pay, PhonePe, Paytm). Total UPI revenue: ~$23M+.

**Recommendation:** Prioritize UPI UX in the app over credit card flows.
`,
};
