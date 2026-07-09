# Alignment Advantage — Wiki (Source of Truth)

**Ingested at:** 2026-07-09T08:01:50.378Z  
**Branch:** `feature/alignment-advantage`  
**Status:** Implemented

> Agents: read this page first. Use `wiki/raw/` for full spec detail and implementation history.

---

## Quick reference

| Item | Value |
|------|-------|
| Route | `/alignment-advantage` |
| Feature flag | `hasAlignmentAdvantage` |
| Main page | `src/pages/alignment-advantage/index.tsx` |
| People copy data | `src/components/alignment-advantage/shared/peoplePalaceGuidance.ts` |
| Mini grid | `src/components/alignment-advantage/shared/TwelvePalaceMiniGrid.tsx` |
| Print | `src/components/alignment-advantage/print/AlignmentAdvancePrintDocument.tsx` |

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

---

## Current shipped behavior

## Shipped changes (batch 1)

### 1. Twelve-Palace mini grid
- All star names render in black (`C.navy`)
- Activations use short colored labels matching main chart: Lu (green), Quan (blue), Ke (yellow), Ji (red)
- **Files:** `shared/TwelvePalaceMiniGrid.tsx`, `shared/constants.ts`

### 2. Deal-Flow Checklist (read-only)
- Removed AUTO badges, clickable buttons, score bar, recommendation block
- Structural row: empty right column
- Timing and Wealth: read-only Aligned checkmark / Caution from computed values
- **Files:** `chapters/ChapterDecisionFramework.tsx`, `shared/AxisCard.tsx`

### 3. Wealth — Archetype Profile removed
- Removed right navy Archetype Profile card; kept Dominant Wealth Archetype card
- **File:** `chapters/ChapterWealthAcceleration.tsx`

### 4. People Strategy block removed
- Removed Ideal Collaborator, This Cycle, Pattern Across Palaces section
- Kept priority dashboard and individual palace briefings
- **Files:** `chapters/ChapterStakeholderIntelligence.tsx`, `print/sections/PrintStakeholderIntel.tsx`

### 5. Children Palace icon
- Replaced default tree SVG with mentor/child collaboration icon
- **File:** `shared/peoplePalaceVisuals.tsx`

### 6. Copywriting sweep
- Removed dollar amounts and false weekly/monthly temporality in watch-outs
- Simplified jargon in star context (e.g. exacting to hard to please)
- **Files:** `shared/peoplePalaceGuidance.ts`, `shared/phaseWealthGuidance.ts`, `shared/catalystGuidance.ts`, `utils/forecast/people/peoplePalaceData.ts`

### 7. Execution Playbook trim
- Removed Win Metrics section
- Executive Action and Risk Mitigation capped at 3 items per palace/month
- Strategic Reflection unchanged
- **File:** `chapters/ChapterExecutionPlaybook.tsx`

---

---

## Follow-up change (batch 2): Friends Palace copy

**Feedback:** Friends Palace (交友) What To Do Now was too sales/referral focused. Kheli wanted collaboration language, not paying customers or friend-circle framing.

**File:** `src/components/alignment-advantage/shared/peoplePalaceGuidance.ts`

### Base actions (交友)

1. Pick three people you would actually want to build something with: co-create a project, share a client relationship, or open a new market together. Reach out to each with one concrete collaboration idea, not a vague catch-up.

2. Before you start any joint project, write one sentence on the outcome you both want and who owns what. If either person cannot say that clearly, pause. Do not begin until you can.

3. For every active collaboration, name the other person's role and your role out loud. Shared effort without named ownership is how joint work turns into quiet resentment.

### Authority (化权) activation override (交友)

You have more pull in how this collaboration runs right now. Agree who decides, who delivers, and who gets credit before the work starts.

### Copy rules learned from this follow-up

- Friends Palace = professional allies and joint work, not social friends or lead gen
- Avoid paying client / referral pipeline language in this palace
- Prefer named roles, ownership, and collaboration outcomes
- No em dashes in client-facing copy

---

---

## Copy rules (active)

1. **Layman English** — no jargon (exacting, principled without context, etc.)
2. **No false temporality** — watch-outs must not imply "this week your relationship is fragile" on every revisit
3. **No arbitrary dollar amounts** — use relative scale (major financial commitment)
4. **Friends Palace (交友)** — collaboration and joint work, not paying clients or social friend language
5. **No em dashes** in client-facing copy
6. **Report is read-only** — no clickable checklist inputs in Deal-Flow section

---

## Out of scope (unchanged)

- `PrintIdealCollaborator.tsx` standalone print page
- `PrintDayunCycle.tsx` Success Metrics (10-year cycle)
- `LiuMonthCard.tsx` guidance list lengths
- Full appendix chart (`ZWDSChart` in `PrintAppendixChart.tsx`)

---

---

## Design principles (from review)

1. **Report ≠ app** — show conclusions, not inputs
2. **Timeless copy** — avoid wording that breaks on repeat visits
3. **Layman English** — no SAT vocabulary in client-facing text
4. **Web/print parity** — shared components and mirrored sections stay aligned

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

---

## Raw documents

| Doc | Use when |
|-----|----------|
| [raw/alignment-advantage-implementation-record.md](raw/alignment-advantage-implementation-record.md) | Commit history, Friends Palace follow-up, shipped file list |
| [raw/alignment-advantage-kheli-feedback-spec.md](raw/alignment-advantage-kheli-feedback-spec.md) | Original requirements and file map |
| [raw/alignment-advantage-kheli-feedback-agent-prompts.md](raw/alignment-advantage-kheli-feedback-agent-prompts.md) | Agent task prompts used for batch 1 |
