# Alignment Advantage — Implementation Record

**Branch:** `feature/alignment-advantage`  
**Status:** Implemented (July 2026)  
**Last updated:** 2026-07-09

This record documents what was shipped after Kheli's product review. For the original requirements, see `alignment-advantage-kheli-feedback-spec.md`. For agent task prompts used during implementation, see `alignment-advantage-kheli-feedback-agent-prompts.md`.

---

## Commits

| Commit | Summary |
|--------|---------|
| `b037cc1` | Main Kheli feedback batch: UI removals, mini grid colors, read-only checklist, copy sweep, Children Palace icon, wiki spec |
| `bdff576` | Friends Palace follow-up: collaboration-focused What To Do Now copy |

---

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

## Out of scope (unchanged)

- `PrintIdealCollaborator.tsx` standalone print page
- `PrintDayunCycle.tsx` Success Metrics (10-year cycle)
- `LiuMonthCard.tsx` guidance list lengths
- Full appendix chart (`ZWDSChart` in `PrintAppendixChart.tsx`)

---

## Verification

- `npm run build` passes
- Web: `/alignment-advantage` with `hasAlignmentAdvantage` flag
- Print: `/print/alignment-advantage`
