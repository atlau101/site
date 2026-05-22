# Project Page Digestibility Pass

## Implementation Brief

Improve project-page scanability without changing the landing page or broad page information architecture.

Recruiters should understand the project outcome before reading process detail. The `What I Built` area should lead with a short outcome-first statement, optionally hide supporting description detail behind a disclosure, and the `What I Took Away` section should load as a clean stack of closed sheets.

This pass is a pilot:

1. Add the shared description structure and rendering support.
2. Apply it to Amal only.
3. Collapse the first takeaway sheet by default across project pages.
4. Stop before rolling the new description structure through the rest of the project copy.

## Scope

### In Scope

- `site/components/project/ProjectGeneral.tsx`
- `site/components/project/ProjectDescription.tsx` if the disclosure is implemented as a client component
- `site/components/project/ProjectTakeaways.tsx`
- `site/lib/projects/types.ts`
- `site/lib/projects/malloy-amal.ts`

### Out of Scope

- Landing page changes
- `ProjectRedos`
- Takeaway copy rewrites
- Visual palette changes
- Page-order or section IA changes
- Description rewrites for projects other than Amal
- Broad refactors around project data or project-page components

## Constraints

- Keep edits surgical. Every changed line should trace to this pass.
- Preserve existing project-page voice unless the copy change is explicitly part of the Amal pilot.
- Do not use paragraph breaks in `description` as an implicit feature flag for disclosure behavior.
- Do not split description rendering by parsing the first `\n\n`.
- Reuse existing project-page typography and brutalist styling conventions.
- Reuse `RichProjectText` where stored project copy needs paragraph breaks or `**bold**` rendering.

## Success Criteria

1. Amal shows an outcome-first lead in `What I Built` before supporting process detail.
2. Amal supporting description detail is collapsed on first paint and can be expanded accessibly.
3. Projects without the new lead field render their existing descriptions with no disclosure behavior change.
4. Every takeaway sheet starts collapsed on first paint.
5. Typecheck passes.
6. Disclosure behavior works with keyboard interaction, mobile wrapping, and reduced-motion settings.

## Change 1: Make The Lead Explicit In Project Data

### Files

- `site/lib/projects/types.ts`
- `site/lib/projects/malloy-amal.ts`

### Data Contract

Add one optional project field:

```ts
descriptionLead?: string;
```

Keep the existing field:

```ts
description: string;
```

Do not add body-only replacement fields in this pass. `description` remains the existing detail/body field and remains the only required description field.

### Rendering Rule

- If `project.descriptionLead` is absent, render `project.description` exactly as the current `ProjectGeneral` description renders today.
- If `project.descriptionLead` is present:
  - render the lead visibly first
  - render `project.description` as the supporting detail behind the disclosure

This keeps rollout explicit and incremental. A normal paragraph break in future copy must not silently create disclosure behavior.

## Change 2: Add Description Disclosure Rendering

### Files

- `site/components/project/ProjectGeneral.tsx`
- `site/components/project/ProjectDescription.tsx` if needed

### Preferred Implementation

Use a small `ProjectDescription` component from `ProjectGeneral` so the existing flat description paragraph is replaced in one bounded spot.

Choose the disclosure implementation before coding:

1. Use native `details` / `summary` if it can match the design cleanly without awkward marker behavior.
2. If motion parity with `ProjectTakeaways` matters more, use a small `"use client"` component with local open state.

Do not add a client boundary only for parsing or formatting. Add it only if the chosen disclosure interaction needs state.

### Fallback Rendering

For projects without `descriptionLead`, keep current visual behavior:

- no `Read more` control
- no forced bold lead
- no copy parsing
- same position in the `What I Built` paper card

### Lead Rendering

For projects with `descriptionLead`:

- show the lead before the supporting detail
- use the current description scale and placement as the visual baseline
- make it visually stronger than the hidden detail without changing the whole card layout
- keep wrapping stable at mobile widths

### Supporting Detail Rendering

- hide the detail by default
- label the closed state `Read more`
- label the open state `Read less`
- use `RichProjectText` for supporting detail rendering so future body copy can use paragraph breaks and `**bold**` emphasis

### Accessibility Requirements

If using a custom button disclosure:

- use a real `button` with `type="button"`
- expose open state with `aria-expanded`
- connect the control and collapsible region with stable accessibility attributes
- preserve visible focus styling
- verify collapsed content is not presented as expanded content to assistive tech

If using `details` / `summary`, preserve keyboard and focus behavior and style the native control intentionally.

### Motion Requirements

- Motion may follow the `grid-template-rows` expansion pattern already used in `ProjectTakeaways`.
- Reduced-motion users must still be able to expand the content without a meaningful height animation.
- The global reduced-motion CSS may already cover transition duration. Verify it instead of adding speculative motion code.

## Change 3: Amal Pilot Copy

### File

- `site/lib/projects/malloy-amal.ts`

Add `descriptionLead` only for Amal in this pass.

### Copy Shape

Lead:

- one outcome-first sentence
- clear to a recruiter scanning the card
- name the higher-fit alternatives directly if that is clearer than strategy jargon

Body:

- brief project context
- framework/process detail
- why the research changed the recommendation

### Draft Direction

Lead direction:

> The framework disqualified higher education as the original target and surfaced senior living and hospitals as stronger alternatives the client had not considered.

Body direction:

> We were hired to evaluate NFC-based smart attendance for universities. I built a five-pillar feasibility framework from scratch and ran it across 8+ markets so the recommendation came from a repeatable process, not a judgment call.

Treat this as draft direction, not locked wording. Keep the final Amal copy concise and outcome-first.

## Change 4: Collapse Takeaway Sheets By Default

### File

- `site/components/project/ProjectTakeaways.tsx`

Change the sheet default state so every takeaway starts closed:

```ts
const [open, setOpen] = useState(false);
```

Do not change takeaway layout, copy, palette, or open/close styling as part of this change.

## Non-Goals For This Pass

- Do not roll `descriptionLead` into `wildfire-ml`, `fillmore`, `chambergpt`, `lmu-datathon`, `uber-analytics`, `bus315-data-mining`, `malloy-noble-note`, or `malloy-rebrandly` yet.
- Do not touch `vibe-coding` description behavior.
- Do not rewrite project descriptions to make them generally shorter unless the Amal pilot needs it.
- Do not add generalized markdown parsing or a richer description schema.

## Verification

### Static Checks

From `site/`:

```sh
npx tsc --noEmit
```

Report pass or fail.

### Manual Checks

1. Run the dev server and open `/projects/malloy-amal`.
2. Confirm Amal lead is visible before detail and the supporting description is collapsed on first paint.
3. Expand and collapse the description with pointer and keyboard.
4. Confirm control label and expanded state update correctly.
5. Confirm focus styling remains visible.
6. Confirm reduced-motion mode still expands the detail without a meaningful height animation.
7. Confirm mobile layout at 375px: lead wraps cleanly, control remains tappable, detail does not overflow the paper card.
8. Scroll to `What I Took Away` and confirm Note 01 starts collapsed like the other sheets.
9. Open one unchanged project page such as `/projects/wildfire-ml`.
10. Confirm its description still renders as a normal visible description with no disclosure control.

## Stop Point

After the Amal pilot and collapsed takeaway default are implemented and verified, stop and report:

- files changed
- typecheck result
- Amal rendering decision used: native disclosure or client disclosure
- any copy wording finalized for the Amal lead
- any issue found before the remaining project rollout
