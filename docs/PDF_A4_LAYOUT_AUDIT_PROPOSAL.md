# PDF A4 Layout Audit and Proposal

## Purpose

This document audits the current exported PDF page by page and proposes an A4-first layout update that:

- preserves the current visual identity (colors, cards, gradients, typography tone),
- changes only page composition and flow,
- removes excessive whitespace and awkward splits,
- improves readability and print polish.

This is not a visual rebrand. It is a layout and pagination refinement.

---

## Design Principles (Aligned with current brand)

1. **Retain design language**
   - Keep existing section headers, gradients, iconography, and card styles.
   - Keep existing copy and content hierarchy.

2. **A4-first composition**
   - Every section gets a print-optimized layout variant for `forPdfCapture`.
   - Avoid long web-scroll assumptions and two-column imbalance traps.

3. **Intentional page rhythm**
   - Each page has a clear hero, body, and ending.
   - Avoid empty tails and accidental whitespace blocks.

4. **Module-aware pagination**
   - Split by semantic modules (cards/groups), not raw pixel tiles.
   - Keep card groups together where possible.

5. **Predictable component dimensions**
   - Fixed header heights, badge sizing, card paddings, and safe text clamping where needed.

---

## Global Layout System for PDF

### A4 frame (full-bleed to white border)

- Page size: A4 portrait (`210mm x 297mm`)
- Content frame should visually fill the page up to a thin white border:
  - `6mm left/right`, `6mm top`, `8mm bottom`
- Usable vertical content budget: approximately `283mm`
- Rule: no page should look "floating in the middle". Every page should feel edge-aware and intentionally composed to the border.

### Spacing scale

- Vertical rhythm units: 4 / 8 / 12 / 16 / 24
- Section top spacing: 12-16
- Card gap: 8-12
- Internal card padding: 12-16

### Typography

- Keep current font family and weight characteristics
- Normalize capture line-height:
  - Body: `1.45-1.55`
  - Labels/meta: `1.2-1.3`
  - Numeric badges/chips: fixed `line-height == height` in PDF mode

### Keep-together rules

In PDF mode, these should not be split across pages:

- Section gradient header + immediate intro block
- Hero card with its score badge
- Card title row with chip/badge row
- 2x2 card grids when 3+ cards already fit

---

## Current Issues Observed (Audit Summary)

From the latest exported pages:

1. **Large whitespace tails** on multiple pages (`04`, `06`, `11`, `14`).
2. **Unbalanced two-column flow** where right column overflows and left column ends early.
3. **Section continuity breaks** in long modules due to raw tiling.
4. **Capture baseline inconsistencies** in small chips and numeric badges.
5. **Page endings feel accidental**, not intentionally composed.

---

## Screenshot-to-Fix Mapping (Validation Pass)

This maps the exact screenshots to corrective layout behavior, so the proposal directly addresses what you shared.

1. **Career Alignment page with huge lower blank area (`Page 6`)**
   - Root cause: fixed two-column block captured as a short module with no continuation filler.
   - Fix: split "Career Alignment" into paginable row groups (4 rows + 2 rows) or add next module in sequence.
   - Expected result: no large empty bottom half.

2. **Areas continuation page with left side empty, right side full (`Page 14`)**
   - Root cause: two-column continuation preserved after one column ends.
   - Fix: continuation pages auto-switch to single-column full-width cards.
   - Expected result: cards span full width; no empty left lane.

3. **Destiny Scoreboard page with radar left and long cards right (`Page 13`)**
   - Root cause: unequal column heights in print.
   - Fix: top summary row + single-column card flow below.
   - Expected result: balanced page, no long right-only tail.

4. **Growth Tips page with very small content then giant whitespace (`Page 4`)**
   - Root cause: compact module ends and no fill strategy.
   - Fix: compact page template with fixed card grid and optional bottom module.
   - Expected result: content occupies page intentionally.

5. **Health continuation page with large blank tail (`Page 11`)**
   - Root cause: health cards captured as one long uneven two-column sequence.
   - Fix: map-first row then single-column detail stack with pagination checkpoints.
   - Expected result: steady vertical rhythm and cleaner endings.

6. **Nobleman profile composition (`Page 7`)**
   - Root cause: right image + left text split is web-optimized, not paper-optimized.
   - Fix: image top, profile content below (same styling).
   - Expected result: stronger A4 reading flow and better space usage.

---

## Page-by-Page Proposal

## Page 1: Cover

### Keep
- Existing clean cover composition.
- Profile info card.

### Adjust
- Slightly reduce vertical dead space by moving generated date block upward by 8-12mm.
- Keep diagnostic text removed after QA completion.

### Rationale
- Looks premium already; only minor vertical balance improvement needed.

---

## Page 2: Chart Page

### Keep
- Existing chart image prominence.

### Adjust
- Constrain chart to a consistent centered square.
- Increase chart footprint so it reaches the content border rhythm (not tiny in middle).
- Add compact metadata row below chart if space remains to avoid empty lower area.

### Rationale
- Protects chart legibility while reducing tail emptiness.

---

## Page 3: Personality Blueprint (`01`)

### Keep
- Current section header and card visual style.
- Strengths vs potential challenges card pair.

### Adjust
- Keep intro card full width.
- Render strengths/challenges as equal-height cards.
- If one card has less content, use a minimum card height and a subtle spacer block.

### Rationale
- Preserves look while avoiding uneven bottoms and wasted space.

---

## Page 4: Growth Tips

### Current problem
- Small content block appears near top, then a very large blank area.

### Proposal
- Use a dedicated "compact module page" template:
  - Header row + icon.
  - Tip cards in 2xN grid with fixed card heights.
  - If remaining height > 22%, place approved "micro-summary" block (same visual language) instead of leaving white void.

### Rationale
- Same card design, but print-friendly density and intentional closure.

---

## Page 5: Wealth Code (`02`)

### Keep
- Header strip.
- Hero card with dominant archetype and score.
- Existing chart and insight card styling.

### Adjust
- Explicit 3-block stack:
  1) Header + hero (always together),
  2) bar chart block,
  3) strengths/watch-outs pair.
- If block 3 cannot fit at least 60%, move full block to next page.

### Rationale
- Prevents half-block cuts and ensures page ends at natural boundaries.

---

## Page 6: Career Alignment

### Current problem
- Cards end mid-page and leave large empty lower half.

### Proposal
- Convert to print list layout while keeping card style:
  - Keep two columns (`Ideal Career`, `Non-Ideal Career`) for full rows only.
  - Paginate by row groups (`rowBatchSize`), not by full section screenshot.
  - If only 1-2 rows remain, move those rows with next section intro to avoid isolated short page.
  - Maintain equal row heights.

### Rationale
- Still visually identical as cards, but no tail gap.

---

## Page 7: Nobleman Main (`03`)

### Current user preference
- Move profile image from right-side split to top.

### Proposal (approved direction)
- Keep section header and hero card.
- In profile module:
  - Image on top (full-width, fixed aspect ratio),
  - Card content below as stacked panels.
- Preserve original card visuals and labels.

### Rationale
- Better A4 flow; avoids right-column overflow and improves reading sequence.

---

## Page 8: Zodiac Insights

### Keep
- Existing gradient hero and badge chips.

### Adjust
- Introduce fixed-height content bands:
  - hero banner,
  - keyword chips row,
  - explanation text block.
- If text is long, split by paragraph block on next page, not by raw canvas cut.

### Rationale
- Keeps the dramatic visual while preventing clipped/awkward cuts.

---

## Page 9: Nobleman Other Life Areas

### Keep
- Current 3-card row visual style.

### Adjust
- Enforce equal card heights and equal content slots.
- Keep 3-up row only if all 3 cards fit with minimum text; otherwise switch to 2 + 1 row arrangement.

### Rationale
- Preserves style while avoiding overflow-induced unevenness.

---

## Page 10: Health Code (`04`)

### Current problem
- Right "Body Map" column ends early while left column continues, causing imbalance.

### Proposal
- Keep same cards and body map style, but reorder for PDF:
  1) Header,
  2) Body map + quick stats row,
  3) Health detail cards in single column below.
- For long text cards, split only between cards (never mid-card).

### Rationale
- Same visuals, better print reading flow and balanced page usage.

---

## Page 11: Health Continuation

### Current problem
- Content ends early with large empty lower area.

### Proposal
- Add continuation rules:
  - If final health card leaves >22% page empty, pull next available short module (if semantically valid),
  - else add designed "Reflection Note" panel using existing style tokens,
  - else rebalance by moving one prior card down so both pages have comparable density.

### Rationale
- Eliminates accidental blank endings.

---

## Page 12: Destiny Alert Map (`05`)

### Keep
- Existing 2x2 cards and color-coded transformation logic.

### Adjust
- Treat full 2x2 grid as single module when possible.
- If it cannot fit, force deterministic split:
  - row 1 on current page,
  - row 2 on next page (no partial single-card split).

### Rationale
- Maintains visual symmetry and avoids fragmented reading.

---

## Page 13: Destiny Scoreboard (`06`)

### Current problem
- Radar chart left panel runs short; right text cards continue and create large left-side void.

### Proposal
- Keep same cards/styles but change composition:
  - Top: radar card + compact summary card in controlled height band.
  - Middle/Bottom: area cards as full-width single-column flow.
- Do not allow mixed two-column continuation for this section in PDF mode.
- In PDF mode, keep short radar labels (already implemented) and fixed chart box height.

### Rationale
- Solves asymmetric column drift while retaining original visual language.

---

## Page 14: Long Area Cards Continuation

### Current problem
- Very strong left-side empty strip with right-side cards only.

### Proposal
- Disable two-column behavior for continuation pages.
- Use full-width card stack for overflow content.
- Keep badge chips, watermark style, and typography unchanged.
- Enforce border-fill rule: last card block must end within 8-20mm of footer unless section ends.

### Rationale
- Prevents the "half-page empty lane" artifact.

---

## Component-Level PDF Layout Overrides (Non-visual style changes)

These are layout-only overrides for `forPdfCapture`.

1. **`NoblemanSection`**
   - `profileLayout: "stacked"` (image top, details below)
2. **`Health`**
   - `captureLayout: "map-first-then-list"`
3. **`AreasOfLife`**
   - `captureLayout: "single-column-cards-after-radar"`
4. **`WealthCode`**
   - `captureLayout: "hero-chart-insights-stacked"`
5. **Shared chips/badges**
   - fixed-height + fixed-line-height in PDF mode

---

## Pagination Engine Proposal

Replace section-wide raster slicing with module-first pagination:

1. Capture each section as a list of ordered modules:
   - header module,
   - hero module,
   - card group module(s),
   - continuation module(s).
2. Place modules into page frame using remaining-height check.
3. If a module does not fit:
   - move full module to next page,
   - or split only if module is marked `splittable`.

4. Add page density guardrail:
   - target fill: `82%-94%` of usable height per page,
   - if below 78%, rebalance by moving one module from previous/next page when safe.

This preserves current visual style while preventing whitespace and ugly breaks.

---

## Layout Token Matrix (Implementation-Critical)

These tokens remove ambiguity and should be implemented exactly in `forPdfCapture` mode.

### Global tokens

| Token | Value | Notes |
|---|---:|---|
| `PDF_PAGE_MARGIN_X_MM` | `6` | left/right white border |
| `PDF_PAGE_MARGIN_TOP_MM` | `6` | top white border |
| `PDF_PAGE_MARGIN_BOTTOM_MM` | `8` | bottom white border |
| `PDF_GRID_GAP_PX` | `12` | default card gap |
| `PDF_CARD_RADIUS_PX` | `16` | section cards |
| `PDF_CARD_PADDING_PX` | `16` | default internal padding |
| `PDF_SECTION_GAP_PX` | `12` | between major modules |
| `PDF_BADGE_H_PX` | `28` | numeric/pill badge |
| `PDF_BADGE_LH_PX` | `28` | exact vertical centering in capture |
| `PDF_BODY_FONT_PX` | `11` | text readability on A4 |
| `PDF_BODY_LINE_HEIGHT` | `1.5` | avoid dense walls of text |
| `PDF_TARGET_FILL_MIN` | `0.82` | expected page density |
| `PDF_TARGET_FILL_MAX` | `0.94` | avoid cramped pages |
| `PDF_REBALANCE_TRIGGER` | `0.78` | if underfilled, rebalance |

### Section-specific tokens

| Section | Token | Value | Purpose |
|---|---|---:|---|
| Header strips (`01-06`) | `PDF_HEADER_MIN_H` | `94` px | visual anchor consistency |
| Wealth hero | `PDF_WEALTH_HERO_MIN_H` | `212` px | keep score + summary stable |
| Nobleman profile image | `PDF_NOBLEMAN_IMAGE_AR` | `16 / 9` | image-top layout |
| Nobleman profile card | `PDF_NOBLEMAN_PROFILE_MIN_H` | `260` px | no compressed text |
| Health map row | `PDF_HEALTH_MAP_ROW_H` | `220` px | map-first balance |
| Health text card | `PDF_HEALTH_CARD_MIN_H` | `170` px | prevent tiny cards |
| Areas radar card | `PDF_RADAR_CARD_H` | `250` px | fixed chart box |
| Areas detail card | `PDF_AREA_CARD_MIN_H` | `168` px | single-column continuity |
| Destiny 2x2 card | `PDF_DESTINY_CARD_MIN_H` | `245` px | deterministic split by row |
| Career alignment row | `PDF_CAREER_ROW_H` | `62` px | row-batch pagination |

---

## Page Wireframe Blueprints (A4)

These are structure blueprints, not visual redesigns. Existing styles remain.

### Page 6: Career Alignment (fixes big lower blank area)

```
+-----------------------------------------------------------+
| Header strip                                              |
| Career Alignment title row                                |
| +----------------------+ +------------------------------+ |
| | Ideal Career         | | Non-Ideal Career            | |
| | row 1                | | row 1                       | |
| | row 2                | | row 2                       | |
| | row 3                | | row 3                       | |
| | row 4                | | row 4                       | |
| +----------------------+ +------------------------------+ |
| (remaining rows continue to next page in same pattern)   |
+-----------------------------------------------------------+
```

### Page 7: Nobleman Main (requested image-top)

```
+-----------------------------------------------------------+
| Header strip                                              |
| Hero intro card                                           |
| +-------------------------------------------------------+ |
| | Profile image (full width, fixed 16:9 ratio)         | |
| +-------------------------------------------------------+ |
| +-------------------------------------------------------+ |
| | Nobleman details card stack (traits, summary, notes) | |
| +-------------------------------------------------------+ |
+-----------------------------------------------------------+
```

### Page 10-11: Health (map-first then cards)

```
+-----------------------------------------------------------+
| Header strip                                              |
| +----------------------+ +------------------------------+ |
| | Body Map             | | Quick stats / highlights     | |
| +----------------------+ +------------------------------+ |
| +-------------------------------------------------------+ |
| | Health card 1                                            | |
| +-------------------------------------------------------+ |
| +-------------------------------------------------------+ |
| | Health card 2                                            | |
| +-------------------------------------------------------+ |
| (continue card-by-card; never split mid-card)             |
+-----------------------------------------------------------+
```

### Page 13-14: Destiny Scoreboard continuation fix

```
+-----------------------------------------------------------+
| Header strip                                              |
| +----------------------+ +------------------------------+ |
| | Radar card           | | Compact summary card         | |
| +----------------------+ +------------------------------+ |
| +-------------------------------------------------------+ |
| | Area card A (full width)                               | |
| +-------------------------------------------------------+ |
| +-------------------------------------------------------+ |
| | Area card B (full width)                               | |
| +-------------------------------------------------------+ |
| (continuation pages remain full-width single-column)      |
+-----------------------------------------------------------+
```

---

## QA Matrix (Screenshot-Driven Pass/Fail)

| Screenshot Symptom | Rule to Validate | Pass Condition | Owner |
|---|---|---|---|
| Page 6 large lower blank | Row-batch pagination active | Remaining blank tail < 22% | PDF layout |
| Page 14 empty left lane | Continuation forced single-column | No page with one empty side lane | Areas layout |
| Page 13 radar + right overflow | Scoreboard layout variant active | Cards below render full-width | Areas layout |
| Page 4 tiny top content + void | Compact template fill rule | Page fill >= 82% or intentional close module | Growth module |
| Page 11 health tail whitespace | Health rebalance rule active | Final gap <= 22% unless section end | Health layout |
| Nobleman side split awkward | Stacked profile layout active | Image top + details below in PDF | Nobleman layout |

### QA protocol

1. Export PDF in `dna` mode with known profile (same data as screenshots).
2. Validate each mapped page against the matrix above.
3. Mark each row as `pass` / `fail` with PNG evidence.
4. Do not close QA until all rows are `pass`.

---

## Before/After Mock Comps (Textual Art Direction)

These mock comps define intended visual balance while preserving existing brand styling.

## Mock A: Page 6 Career Alignment

### Before (current screenshot behavior)
- Header and section body appear in upper half.
- Two-column role cards stop early.
- Bottom half of page is mostly blank.

### After (target)
- Header remains unchanged.
- Career rows are grouped into page-sized batches with equal row heights.
- Page either:
  - fills with 5-6 rows, or
  - ends with a deliberate section transition module.

### Composition target
- Top band (header/title): 18-22%
- Middle content (cards): 70-76%
- Bottom reserve: 4-8%

### Visual note
- Keep same card colors and icon style; only row flow and vertical fill change.

---

## Mock B: Page 7 Nobleman Main (Image-Top)

### Before (current screenshot behavior)
- Side-by-side split: text left, image right.
- Layout reads like web desktop, not paper narrative.

### After (target)
- Keep section header and hero card.
- Move portrait image to top in a full-width frame.
- Stack profile text cards below.

### Composition target
- Header + hero: 28-34%
- Image block: 24-30%
- Detail stack: 34-42%

### Visual note
- Use current border radius, shadows, and gradients.
- Do not change illustration style or card aesthetics.

---

## Mock C: Page 11 Health Continuation

### Before (current screenshot behavior)
- A small number of cards appear near top.
- Large accidental blank tail at bottom.

### After (target)
- Continuation always uses full-width card stack.
- If remaining content is short, rebalance one card from previous page or add approved micro-summary panel.

### Composition target
- Card stack occupies at least 82% of usable page height.
- No tail gap beyond 22% unless section intentionally terminates.

### Visual note
- Keep same health card look and typography tone.
- No filler graphics unrelated to section.

---

## Mock D: Page 13 Destiny Scoreboard

### Before (current screenshot behavior)
- Left radar panel is short.
- Right column keeps extending with cards.
- Creates asymmetric negative space.

### After (target)
- Top controlled-height band: radar + compact summary.
- All detail cards flow below in full-width single-column cards.

### Composition target
- Top band: 34-40%
- Bottom card flow: 54-60%
- Footer reserve: 4-6%

### Visual note
- Keep radar style and existing card skins.
- Only change structural arrangement to remove right-column drift.

---

## Mock E: Page 14 Areas Continuation

### Before (current screenshot behavior)
- Left side empty strip.
- Right side contains stacked cards.

### After (target)
- Continuation pages are forced to single-column full-width cards.
- Card widths align to the content border frame.

### Composition target
- One-column cards span 100% content width.
- Inter-card gaps remain consistent (`PDF_GRID_GAP_PX`).

### Visual note
- Preserve chips, badges, and watermark treatment exactly.
- This is a layout correction, not a component redesign.

---

## Visual Quality Rubric (Design Review)

Use this rubric during design sign-off and QA screenshots.

| Criterion | Weight | Pass Threshold |
|---|---:|---:|
| Border-fill confidence (no floating page feel) | 20% | >= 9/10 |
| Hierarchy clarity (hero > body > continuation) | 20% | >= 9/10 |
| Column balance and symmetry | 20% | >= 9/10 |
| Continuation page intentionality | 20% | >= 9/10 |
| Style fidelity to existing UI language | 20% | >= 9/10 |

**Release gate:** weighted score must be `>= 9.0`.

---

## Engineering Execution Order (Design-Protective)

Implement in this order to preserve design intent:

1. **Global page frame + token matrix rollout**
2. **Nobleman image-top layout (fast visible win)**
3. **Scoreboard single-column continuation behavior**
4. **Health map-first + continuation rebalance**
5. **Career row-batch pagination**
6. **Module-first paginator and keep-together enforcement**
7. **Density rebalancer and QA matrix closure**

---

## Implementation Phases

## Phase 1 (Highest impact, lowest risk)

- Nobleman profile to stacked layout in PDF mode.
- Health page reordered to map-first + single-column cards.
- Scoreboard continuation forced to single-column in overflow pages.
- Apply global token matrix for badge/card/header sizing.

## Phase 2

- Module-first pagination engine with keep-together tags.
- Deterministic row-based split for 2x2 grids.
- Add fill-density rebalancer (82-94% target).

## Phase 3

- Fine polish:
  - line-height/badge consistency,
  - card equal-height guards,
  - page ending balancing rules.
  - screenshot-by-screenshot QA closure checklist.

---

## Acceptance Criteria

1. Content visually fills to the white border frame (6mm/6mm/6mm/8mm), with no floating-center pages.
2. No page with >22% accidental blank tail unless section intentionally ends.
3. No continuation page with one empty side column and content on only one side.
4. Nobleman PDF layout uses image-top/details-bottom as requested.
5. All section headers and badges remain visually consistent with current design.
6. Page transitions feel deliberate and editorial, not auto-sliced.

---

## Notes

- This proposal intentionally keeps current brand and card aesthetics.
- The primary change is layout orchestration for A4.
- After approval, this document can be converted into an implementation checklist with file-level tasks.
