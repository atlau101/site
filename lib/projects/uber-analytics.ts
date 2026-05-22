import { ProjectData } from './types';

export const uberAnalyticsProject: ProjectData = {
  slug: 'uber-analytics',
  title: 'Uber India Ride Analytics',
  year: 'Fall 2025',
  type: 'Data Visualization · Tableau',
  skills: ['Tableau', 'Data Visualization', 'Hypothesis-Driven Analysis', 'Business Analytics', 'Dashboard Design'],
  tagline: 'Interactive Tableau dashboard testing three business hypotheses against Uber India ride data — two confirmed, one rejected.',
  descriptionLead: `Built an interactive Tableau dashboard testing three business hypotheses against Uber India ride data. Two confirmed, one rejected — and the rejected one (premium vehicles don't outperform) was where the real analytical work happened.`,
  description: `Framed around three testable business hypotheses: whether driver wait time drives cancellations, whether premium vehicles generate higher booking values and ratings, and whether digital payments dominate revenue. All three produced definitive answers — two confirmed, one rejected. The final dashboard was published to Tableau Public with vehicle-type and payment-method filters. The most important finding came from the rejected hypothesis: premium vehicles didn't outperform. UberXL had the lowest typical booking values of any tier, and customer ratings were effectively flat across all vehicle types. The visualization that surfaced this also went through the most revision — and catching that wrong chart was where the real analytical work happened.`,
  outputs: [
    { label: 'Ride Value Visualized', value: 'Rs51.8M in bookings across the analyzed rides' },
    { label: 'Business Questions Framed', value: '3 decision-oriented views built from one ride dataset' },
    { label: 'Operational Risk Isolated', value: 'Cancellation threshold identified at the trip level (15.1 min)' },
  ],
  visuals: [
    {
      src: '/proj-attachments/uber-analytics/dashboard.png',
      caption: 'Final Tableau dashboard. All three hypothesis charts consolidated under vehicle-type filters, with KPIs across the top: total booking value (revenue), average ride time, average time-to-pickup, cancellation rate, and average customer and driver ratings.',
    },
    {
      src: '/proj-attachments/uber-analytics/hypotheses.png',
      caption: 'The three business hypotheses framing the analysis — driver wait time vs. cancellations, premium vehicle value and ratings, and digital payments vs. revenue dominance.',
    },
    {
      src: '/proj-attachments/uber-analytics/h1-chart.png',
      caption: 'Hypothesis 1 — line chart of cancellation rate vs. driver wait time (VTAT). No meaningful correlation exists under 15.1 minutes. Past that threshold, cancellation rate spikes from ~10% to 100% across every vehicle category.',
    },
    {
      src: '/proj-attachments/uber-analytics/h1-design.png',
      caption: 'H1 design evolution. The first pass plotted all vehicle types simultaneously — too noisy to read clearly, even though the 15-minute cliff was already visible. Added a parameter toggle to collapse to an aggregate view or expand by vehicle type. The trend line was removed (R² ≈ 0.6, and the cliff speaks for itself).',
    },
    {
      src: '/proj-attachments/uber-analytics/h2-chart.png',
      caption: 'Hypothesis 2 — dual box plots of customer rating and booking value, split by vehicle class. Customer ratings are statistically flat across all vehicle types (means cluster at ~4, distributions span 3–5). Booking value tells a different story: UberXL has the lowest typical booking value of any vehicle type.',
    },
    {
      src: '/proj-attachments/uber-analytics/h2-design.png',
      caption: 'H2 design evolution. Started as a scatter plot of ride time vs. customer rating — the wrong variables entirely. Switched to dual box plots measuring booking value and customer rating by vehicle class, which directly tests the hypothesis. Also corrected the y-axis on the rating chart: Tableau defaulted it to start at 3, which would have made flat ratings look like meaningful variance.',
    },
    {
      src: '/proj-attachments/uber-analytics/h3-chart.png',
      caption: 'Hypothesis 3 — bar chart of total revenue by payment method. UPI (Unified Payments Interface) accounts for the majority of booking value. UPI is India\'s bank-to-bank digital payment system, pushed by the government as the country\'s primary payment rail.',
    },
    {
      src: '/proj-attachments/uber-analytics/recommendations.png',
      caption: 'Four recommendations from the analysis: (1) build a better satisfaction signal — ratings never dropped below 3.93, so the 1–5 scale isn\'t surfacing real variance; (2) push UPI as the default payment method in-app; (3) introduce a driver-side fee for wait times beyond 14 minutes, since cancellations cliff at 15; (4) audit the premium vehicle experience end-to-end — underperformance at the booking-value level points to a product problem, not a pricing one.',
    },
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
