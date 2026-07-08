# Alignment Advantage — Kheli Feedback Implementation Spec

**Branch:** `feature/alignment-advantage`  
**Status:** Approved for implementation (July 2026)  
**Scope:** Web report + PDF/print export must stay in sync where applicable

---

## Background

Product review with Kheli on the Alignment Advantage strategic report surfaced 8 UI/copy issues. This document is the single source of truth for **what** to change and **why**. Implementation prompts for agents live in:

`wiki/raw/alignment-advantage-kheli-feedback-agent-prompts.md`

---

## Repo context

| Item | Value |
|------|-------|
| App entry | `npm start` → http://localhost:3000 |
| Feature route | `/alignment-advantage` (gated by `hasAlignmentAdvantage`) |
| Main page | `src/pages/alignment-advantage/index.tsx` |
| Data hook | `src/components/alignment-advantage/data/useAlignmentAdvantageData.ts` |
| Print document | `src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx` |

### Chapter map (web)

| Chapter | Component | Section id |
|---------|-----------|------------|
| Strategic Filter | `chapters/ChapterDecisionFramework.tsx` | `#decision` |
| Core Design | `chapters/ChapterCoreDesign.tsx` | — |
| Wealth | `chapters/ChapterWealthAcceleration.tsx` | `#wealth` |
| People | `chapters/ChapterStakeholderIntelligence.tsx` | `#people` |
| Execution Playbook | `chapters/ChapterExecutionPlaybook.tsx` | `#timing` |

---

## Approved changes (locked)

### 1. Twelve-Palace mini grid — star colors & activations

**Problem:** Mini grid shows north stars in blue, south stars in red, and activations as gold bracket tags like `[Hua Ji]`.

**Required:**
- **All star names** (main + minor) → **black** (`C.navy` / `#1a1e3f`)
- **Activations** → match main ZWDS chart (`src/components/zwds/components/Palace.tsx`):
  - 化禄 → short label **Lu**, green
  - 化权 → short label **Quan**, blue
  - 化科 → short label **Ke**, yellow/amber
  - 化忌 → short label **Ji**, red
- No gold `[Hua Ji]` bracket style

**Primary file:** `src/components/alignment-advantage/shared/TwelvePalaceMiniGrid.tsx`  
**Also used in:** Core Design, Wealth, People chapters + several print sections (shared component — one fix mirrors web + print mini grids).

**Note:** Full appendix chart (`PrintAppendixChart.tsx` → `ZWDSChart`) already uses main-chart styling. Do **not** change `ZWDSChart` unless mini grid and appendix diverge in testing.

---

### 2. Deal-Flow Checklist — read-only report

**Problem:** Checklist feels interactive (AUTO tags, Yes/Not aligned buttons, score bar). Reports should not ask users to click.

**Required:**
- Remove **AUTO** badges
- Remove **all clickable** controls (`Yes, aligned` / `Not aligned`)
- Remove **framework score bar** (`X / 3`) and **recommendation output** block below checklist
- **Structural (row 01):** right column **empty** (no status)
- **Timing (row 02) & Wealth (row 03):** keep read-only **Aligned ✓** / **Caution** from existing computed values:
  - `timingAligned`: `signal === "green"` in `buildStrategicData()`
  - `wealthAligned`: `(wealthProfile.codes[0]?.score ?? 0) >= 5`

**Primary files:**
- `src/components/alignment-advantage/chapters/ChapterDecisionFramework.tsx`
- `src/components/alignment-advantage/shared/AxisCard.tsx`

**Print note:** `PrintDecisionFramework.tsx` is a static worksheet (checkboxes + evaluation rules). It does **not** have AUTO tags or web checklist UI. **No print changes required** for this item unless you discover duplicate interactive UI.

---

### 3. Remove Archetype Profile card (Wealth)

**Problem:** Right navy card (“Archetype Profile”, hybrid badge, tagline quote) is redundant.

**Required:** Remove only the **right** card. Keep **Dominant Wealth Archetype** card (left, with examples).

**Primary file:** `src/components/alignment-advantage/chapters/ChapterWealthAcceleration.tsx` (lines ~145–157)

**Print note:** `PrintWealthBlueprint.tsx` uses a different layout (hanzi hero + summary grid). No identical “Archetype Profile” card — verify visually; likely **no print change**.

---

### 4. Remove entire People Strategy block

**Problem:** Three cards at top of People chapter (Ideal Collaborator, This Cycle, Pattern Across Palaces) should go.

**Required:** Remove the full block including:
- “People Strategy” subheader
- `PeopleCrossPalaceStrategyPanel` (2 cards)
- Dark “Pattern Across Your Five Palaces” banner

**Keep:** Chapter header, 12-palace mini grid, Relationship Priority Distribution, individual palace briefing pages.

**Primary files:**
- `src/components/alignment-advantage/chapters/ChapterStakeholderIntelligence.tsx`
- `src/components/alignment-advantage/chapters/PeopleCrossPalaceStrategy.tsx` (may become unused — clean up imports)

**Print mirror:** `src/components/alignment-advantage/print/sections/PrintStakeholderIntel.tsx` (lines ~238–264) — remove matching section.

**Out of scope:** Standalone print page `PrintIdealCollaborator.tsx` (separate TOC entry under Wealth Strategy). Do **not** remove unless product asks.

---

### 5. Children Palace icon redesign

**Problem:** Default SVG for `子女` (Children) in `PalaceRelationshipSvg` looks inappropriate (reads like abstract body parts).

**Required:** Replace default branch in `peoplePalaceVisuals.tsx` with a new icon consistent with siblings/spouse/friends/parents style (line art, navy/coral/gold palette, relationship metaphor — e.g. growth, mentorship, next generation).

**Primary file:** `src/components/alignment-advantage/shared/peoplePalaceVisuals.tsx`  
**Used in:** `PeoplePalaceBriefingBody.tsx` (web + print palace briefings)

---

### 6. Copywriting — broader sweep (layman, no false temporality)

**Problem examples:**
- `$10k` feels arbitrary (too small for some readers)
- “fragile **this week**” implies the relationship is fragile every time they open the report

**Required:** Sweep Alignment Advantage people/copy files for:
- Specific dollar amounts → relative phrasing (“major financial commitment”, “significant money”)
- “this week” / “this month” in **watch-outs** or **state descriptions** → timeless or conditional phrasing (“right now”, “when tension is active”, “during strained periods”)
- Language that sounds like a recurring weekly forecast when user revisits report

**Primary files (start here):**
- `src/components/alignment-advantage/shared/peoplePalaceGuidance.ts`
- `src/utils/forecast/people/peoplePalaceData.ts`
- `src/components/alignment-advantage/shared/phaseWealthGuidance.ts`
- `src/components/alignment-advantage/shared/catalystGuidance.ts`

**Also grep:** `src/components/alignment-advantage/**`, `src/utils/forecast/**` for `$`, `this week`, `this month`, `fragile`

**Tone:** Plain English, actionable, no jargon. Avoid implying fixed calendar predictions on repeat visits.

---

### 7. Star context copy — layman English review

**Problem:** Words like “exacting” are unclear to general readers.

**Required:** Review and simplify all star-context strings in `peoplePalaceGuidance.ts`:
- `PALACE_STAR_CONTEXT` (keyed entries like `兄弟:廉贞`)
- `PALACE_STAR_FALLBACK` templates
- `getPalaceActivationHint()` strings if jargon present

**Example fix:** “competitive and exacting” → “competitive and hard to please” or “very demanding”

---

### 8. Execution Playbook — trim lists, remove Win Metrics

**Problem:** Executive Action and Risk Mitigation lists are too long; Win Metrics section should be removed.

**Required:**
- **Remove** entire “Win Metrics” UI block
- **Keep** Strategic Reflection as-is (2 questions)
- Show only **first 3** items from `gData.keyActions` and `gData.watchOut` for **every palace / every month**
- Do **not** change `PALACE_MONTH_DATA` dimension bars (“Capacity Allocation”) — those are separate hardcoded percentages

**Primary file:** `src/components/alignment-advantage/chapters/ChapterExecutionPlaybook.tsx`  
**Data source:** `src/utils/forecast/alignmentAdvantage/executionPlaybookData.ts` → `PALACE_GUIDANCE_DATA`

**How dimension bars work (do not change):**
1. User selects month → `getPalaceForAspectLiuMonth()` maps to a palace
2. `PALACE_MONTH_DATA[palaceName].dimensionBars` returns hardcoded Career/Wealth/Relationships/Health %

**Print note:** Web-only monthly briefing UI. Print uses `PrintMonthlyDeepDive` + `CompactTimingTable` (different structure). **No Win Metrics in print monthly flow.** `PrintDayunCycle.tsx` has “Success Metrics” for 10-year cycle — **out of scope** unless product requests.

**Out of scope:** `src/components/liumonth/LiuMonthCard.tsx` also consumes `PALACE_GUIDANCE_DATA` — do not change unless asked.

---

## Implementation batches

Work is split into **5 agent tasks** (see prompts doc). Suggested order:

1. **Agent 1** — Mini grid colors (shared visual, unblocks visual QA)
2. **Agent 2** — Deal-flow checklist
3. **Agent 3** — Section removals + playbook trim
4. **Agent 4** — Copy sweep + star context
5. **Agent 5** — Children palace icon

Agents 2–4 can run in parallel after Agent 1. Agent 5 is independent.

---

## Verification checklist

- [ ] `npm start` — load `/alignment-advantage` with flagged test account
- [ ] Mini grid: all stars black; Lu/Quan/Ke/Ji colored short labels
- [ ] Deal-flow: no buttons, no AUTO, no score block; Timing/Wealth show Aligned ✓
- [ ] Wealth: no Archetype Profile card
- [ ] People: no People Strategy block; palace briefings still render
- [ ] Children palace: new icon looks intentional
- [ ] Copy: no `$10k`-style amounts; no “fragile this week” false temporality
- [ ] Playbook: 3 exec actions, 3 risks, no win metrics, reflection unchanged
- [ ] Print preview: `/print/alignment-advantage?...` — stakeholder intel + mini grids match
- [ ] `npm run build` passes
- [ ] No new linter errors in touched files

---

## Design principles (from review)

1. **Report ≠ app** — show conclusions, not inputs
2. **Timeless copy** — avoid wording that breaks on repeat visits
3. **Layman English** — no SAT vocabulary in client-facing text
4. **Web/print parity** — shared components and mirrored sections stay aligned
