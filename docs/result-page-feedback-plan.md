# Result Page — Feedback Implementation Plan

## Overview

Four feedback items were received for `src/pages/result.tsx` and related components. This document describes the full context, decisions made, and what each agent task covers.

---

## Project Stack

- React 18 + TypeScript (strict — no `any`, no `!`, no `as unknown as T`)
- Tailwind CSS (JIT) — dynamic class names must use inline CSS strings, not dynamic Tailwind class names
- All strings use double quotes `"`. No `any` types. No non-null assertions.
- Component conventions: JSDoc headers, inline comments, strict typing

---

## Feedback Items

### Item 1 — Button Sequence Change
**File:** `src/pages/result.tsx` (lines ~910–934)

Change the blueprint mode switcher button order from:
> DNA → Liu Nian → Da Yun → Liu Month

To:
> **DNA → Da Yun → Liu Nian → Liu Month**

The button array is defined inline in JSX. Just reorder the array entries.

---

### Item 2 — Destiny Alert Map: Change 化科 (Ke) and 化忌 (Ji) Card Titles
**File:** `src/components/analysis_v2/FourKeyPalace.tsx`

In the `TRANSFORMATION_CONFIG` object:

**化科 (Ke) — change to fame-focused:**
- `heroQuestion`: `"WHERE DOES TALENT SHINE?"` → `"WHERE DOES YOUR FAME RISE?"`
- `icon`: `"✨"` → `"🌟"`
- Bar labels: `Talent / Recognition / Refinement` → `Reputation / Visibility / Recognition`

**化忌 (Ji) — change to something more commonly understood:**
- `heroQuestion`: `"WHERE SHOULD I TREAD CAREFULLY?"` → `"WHERE IS ENERGY BLOCKED?"`
- `icon`: `"🧭"` → `"⚠️"`
- Bar labels: `Friction / Tension / Complexity` → `Blockage / Resistance / Challenge`

---

### Item 3 — Da Yun Analytics: Leave Only Season Hero
**File:** `src/components/dayun/DayunSection.tsx`

Currently renders 5 sub-components:
1. `<DayunSeasonHero />` ← **KEEP**
2. `<CycleTimeline />` ← REMOVE
3. `<PhaseIntensityChart />` ← REMOVE
4. `<DayunGuidanceCards />` ← REMOVE
5. `<ReflectionQuestions />` ← REMOVE

Keep the section header and `<DayunSeasonHero />` only. Remove the 4 other component renders. Do NOT remove imports unless they cause lint errors — they may be used elsewhere.

---

### Item 4 — Liu Month: New Monthly Briefing Card
**Covered by Agent 2** — see `agent-prompt-2-liumonth-card.md`

---

## Architecture Decisions

- The Liu Month section **replaces** all other analysis sections when `blueprintMode === "liumonth"` in `result.tsx` (same pattern as `DayunSection` in `dayun` mode)
- All palace content data (season, area, stars, priority, key actions, watch out, success metrics, reflection questions) is already in the codebase and just needs to be wired up
- The new component lives at `src/components/liumonth/LiuMonthCard.tsx` with a barrel export at `src/components/liumonth/index.ts`
- A new utility at `src/utils/forecast/liuMonthData.ts` extracts the palace data from the 12-month forecast page so it can be shared

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/pages/result.tsx` | Main result page — blueprint switcher, analysis rendering |
| `src/components/analysis_v2/FourKeyPalace.tsx` | Destiny Alert Map (4 transformation cards) |
| `src/components/dayun/DayunSection.tsx` | Da Yun 10-year cycle section |
| `src/components/dayun/DayunSeasonHero.tsx` | Season hero card (to keep) |
| `src/utils/dayun/guidanceGenerator.ts` | Palace guidance content (keyActions, watchOut, successMetrics, reflectionQuestions) |
| `src/utils/dayun/seasonMapper.ts` | Palace→season mapping, season colors, titles, messages |
| `src/pages/12month-forecast.tsx` | Source of PALACE_DATA (season, stars, area, priority per palace) |
| `src/utils/destiny-navigator/palace-resolver.ts` | `getMonthPalaceForLiuMonth()` — which palace is active for a given month |

---

## Agent Task Split

| Agent | Items | Estimated complexity |
|-------|-------|---------------------|
| Agent 1 | Items 1 + 2 + 3 (quick fixes) | Low — edits to 2 files |
| Agent 2 | Item 4 (Liu Month Card) | Medium — 3 new files + 1 edit |
