# P0-02 — Scorecard: distinct drivers + protect/press

**Agent brief.** You are fixing the Four Areas scorecard so Career / Wealth / Relationships / Health each have a **distinct chart-tied driver**, credible vs-last-month trends, and **one** protect/press line. If you cannot make drivers honest, remove or hide the scorecard UI rather than shipping identical mechanisms.

**Backlog map:** `MONTHLY_REPORT_FEEDBACK.md` → Must-have **P3** (P0 trust killer).

**Read first:** this file + cited functions. Do not redesign the whole report.

---

## Goal

Restore scorecard credibility: four distinct mechanisms, real prior-month comparison, one scannable protect/press coach line.

## Acceptance criteria

- [ ] For a typical month, the four `mechanism` (or equivalent) strings are **not identical**.
- [ ] Each dimension’s driver references something **plausible for that life area**: that aspect’s Liu Yue palace and/or its main stars and/or an activation that lands in / targets that area — not one global “Tan Lang Prosperity in Friends” for all four.
- [ ] `trendVsPrior` remains shown and is computed from **prior vs current** values (keep or improve logic); avoid all four bars showing “rising” purely because one stem narrative is reused.
- [ ] One **protect / press** line appears on the scorecard chapter (e.g. protect lowest, press highest or month-priority-linked bar) — English, specific to this month’s bars.
- [ ] English-only; no em/en dashes; no fake rarity %.
- [ ] `npx tsc --noEmit` passes.
- [ ] **Fallback allowed:** if drivers cannot be made distinct honestly, remove/hide `ChapterScorecard` (and scorecard from PDF body) rather than ship the broken UI. Document that choice in a short code comment.

## Problem statement

From buyer feedback:

> Career / Wealth / Relationships / Health all “rising” and all citing the **same driver** (Tan Lang Prosperity in Friends).

**Buyer need:** Distinct mechanisms per area, or drop the four-bar scorecard.

Ideal reference tone (from `EXAMPLE_MONTHLY_CONSULTATION_REPORT.md` Page 4): each dimension has its own driving mechanism; one-line scorecard summarizes hold / preserve / main stage / protect sleep.

## Exact files / symbols to touch

| Path | What |
| ---- | ---- |
| `src/utils/forecast/monthlyConsultation/buildMonthlyConsultationBundle.ts` | **`buildScorecard`** (~116–158) — currently sets `mechanism: stemNarrative` for **every** bar. Call site ~327–328. Also **`stemNarrative`** (~248–256) built once from `primaryHua` / `formatActivationPlain` |
| `src/utils/forecast/monthlyConsultation/types.ts` | **`DimensionScorecard`** (~133–141): `label`, `pct`, `priorPct`, `nextPct`, `trendVsPrior`, `trendIntoNext`, `mechanism`. Add fields if needed (e.g. `protectPressLine` on bundle or on a scorecard meta object) |
| `src/utils/forecast/timing/liuMonthGuidance.ts` | **`PALACE_MONTH_DATA[*].dimensionBars`** — static % tables keyed by **Life palace Chinese name**; used by `loadBriefing` and prior/next comparison inside `buildScorecard` |
| `src/utils/forecast/monthlyConsultation/englishLabels.ts` | `formatActivationPlain`, `starToEnglish`, `palaceToEnglish`, `SI_HUA_LABEL` |
| `src/components/monthly-consultation/chapters/MonthlyConsultationChapters.tsx` | **`ChapterScorecard`** (~339–378); `trendWord` (~53–61). Replace generic TipList with protect/press line driven by data |
| Aspect inputs already on bundle in `buildBundleCore` | `aspectPalaces.career \| wealth \| relationships \| health` via `getPalaceForAspectLiuMonth` + `snapshotPalaceStars`; `stemActivations`; `briefing.dimensionBars` |

**Print:** same `ChapterScorecard` through `MonthlyConsultationBody` / `MonthlyConsultationPrintDocument.tsx`.

## Current vs desired behavior

### Current (broken)

```ts
const stemNarrative = primaryHua
  ? formatActivationPlain(primaryHua.starName, primaryHua.kind, primaryHua.landingPalaceName)
  : `This month's focus is ${stack.liuYueLifePalaceNameEnglish}...`;

// buildScorecard maps every bar to:
{ ..., mechanism: stemNarrative }  // SAME string × 4
```

- `pct` / prior / next come from **Life-palace** `PALACE_MONTH_DATA` dimensionBars for current vs prior/next Life palace months (`resolvePriorMonthAnchor`). Trends can flip when Life palace changes, but the UI still blames one stem line for everything.
- `ChapterScorecard` TipList is generic (“Lead with the highest bar…”).

### Desired

| Dimension | Driver should prefer |
| --------- | -------------------- |
| Career | Career Liu Yue palace (`aspectPalaces.career`) + its main stars / natal transforms; or stem activation landing in career-related area |
| Wealth | Same pattern for wealth palace |
| Relationships | Relationships palace |
| Health | Health palace + somatic/briefing season pressure if stars thin |

Each `mechanism` ≈ one short English clause (star + signal + palace area), **different across the four** when data differs.

Trends: keep comparing prior/current %, but ensure labels and trends feel credible. If static Life-palace bars make all four rise together, either:

- derive dimension % with **aspect-aware** adjustment (small, documented), **or**
- keep bar heights from Life briefing but make **drivers** distinct (minimum fix), and only call trends “rising/easing/steady” from real priorPct→pct.

Protect/press: one line, e.g. “Protect Health (lowest). Press Relationships (highest this month).” Rank by `pct`, optionally bias press toward month priority / focus area when two bars are close.

## Implementation steps

1. **Stop assigning one `stemNarrative` to all bars.** Change `buildScorecard` signature to accept what it needs: `aspectPalaces`, `stemActivations`, `briefing`, maybe `stack`.
2. **Write `buildDimensionMechanism(label, ...)`** (in bundle file or `contentLibraries.ts`) that picks a driver per label:
   - Prefer aspect snapshot main stars (English via `starToEnglish`) + palace English name.
   - Else nearest relevant `stemActivations` entry (match landing palace to aspect palace name/number when possible).
   - Else season / month focus fallback that still **differs by label** (do not reuse one stem string).
3. **Add protect/press** to the bundle (new top-level string on `MonthlyConsultationBundle` or first-class field on scorecard wrapper). Compute from sorted bars after mechanisms exist.
4. **Update `ChapterScorecard`** to render per-bar mechanism (already does) and show the protect/press line (replace or shrink TipList).
5. **Manual check** against a chart that previously showed one Prosperity driver on all four bars.
6. `npx tsc --noEmit`.

### Type sketch (optional — adapt as needed)

```ts
export interface DimensionScorecard {
  label: string;
  pct: number;
  priorPct: number;
  nextPct: number;
  trendVsPrior: "up" | "down" | "flat";
  trendIntoNext: "up" | "down" | "flat";
  mechanism: string; // must be dimension-specific
}

// e.g. on MonthlyConsultationBundle:
scorecardProtectPress: string;
```

## Out of scope

- Empty stars chapter rewrite (P0-01) unless a shared helper is trivial
- Aspect playbook Do/Avoid lists (P0-03)
- Dated calendar windows, decision hierarchy, rarity page
- Changing `PALACE_MONTH_DATA` for every palace unless required for credible trends
- Fake statistical rarity claims

## Done when / test plan

1. `npx tsc --noEmit` clean.
2. Open Scorecard chapter: four mechanism lines; spot at least two that clearly name **different** palaces or stars.
3. Trends: not all four forced-identical mechanism; wording matches `trendVsPrior` (`rising` / `easing` / `steady` via `trendWord`).
4. Protect/press line visible and consistent with highest/lowest (or documented priority rule).
5. PDF shows same.
6. If scorecard removed instead: confirm chapter not in `MonthlyConsultationBody` chapter list and README task notes that fallback was used.
