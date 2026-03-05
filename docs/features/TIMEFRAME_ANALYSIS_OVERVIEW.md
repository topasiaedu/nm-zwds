# Timeframe-Aware Analysis — Feature Overview

## Summary

This feature adds **timeframe-based chart and analysis views** to the Result page (`src/pages/result.tsx`). Users can switch between four modes:

| Mode | Label | What it shows |
|------|-------|---------------|
| `dna` | DNA Chart | Natal (lifetime) chart — permanent star positions |
| `liunian` | Liu Nian *(Yearly)* | Current year's annual flow overlay |
| `liumonth` | Liu Month *(Monthly)* | Monthly rhythm overlay for a selected month |
| `dayun` | DaYun *(10 Year)* | Current 10-year major luck cycle overlay |

Each mode changes both the **chart visual** and the **analysis reports** below it — because each timeframe resolves different physical palaces for the same aspect (e.g. "Wealth").

---

## The Palace Resolution System

### How the ZWDS Chart Works

The chart has 12 fixed physical palace positions (numbered 1–12), each holding a fixed set of stars that never change. What changes per timeframe is which physical position gets **called** "Wealth Palace", "Life Palace", etc.

### Natal (DNA Mode)

The natal chart finds palaces directly by their hardcoded Chinese names:

```
Wealth = find palace literally named "财帛"  → always the same physical position
```

### Liu Nian (Yearly) and Liu Month (Monthly)

These use **secondary palace names** assigned anticlockwise from an anchor palace:

- **Liu Nian anchor** = the palace whose `annualFlow.year === currentYear`
- **Liu Month anchor** = the palace for the selected month (derived from the year palace and Palace 10's natal name)

Assignment formula: the palace at distance `d` (anticlockwise) from the anchor gets secondary name `PALACE_NAMES[d]`. So:

```
Wealth secondary name index = 4  →  physical palace = anchor - 4
```

Implementation: `getPalaceForAspectLiuNian("wealth", chartData)` / `getPalaceForAspectLiuMonth(...)`  
File: `src/utils/destiny-navigator/palace-resolver.ts`

### DaYun (10-Year) — Da Ming Tags

DaYun uses **Da Ming tags** which also distribute anticlockwise from the current Da Xian palace, **BUT only for counter-clockwise Da Xian charts**. Da Xian direction depends on gender + Yin/Yang:

| Condition | Da Xian Direction |
|-----------|------------------|
| Yang Male or Yin Female | **Clockwise** (increasing palace numbers) |
| Yin Male or Yang Female | **Counter-clockwise** (decreasing palace numbers) |

For counter-clockwise: `Da Cai (wealth) palace = dayunPalace - 4`  
For clockwise: `Da Cai (wealth) palace = dayunPalace + 4`

Implementation: `getPalaceFromDaXian(dayunPalace, tagIndex, direction)` in `palace-resolver.ts`

---

## Bug: Da Xian Direction Hardcoded as Anticlockwise

### Location

- `src/utils/destiny-navigator/palace-resolver.ts` — `getPalaceFromDaXian()` always subtracts
- `src/components/zwds/ZWDSChart.tsx` — `getPalaceTag()` always subtracts
- `src/utils/destiny-navigator/palace-resolver.ts` — `getPalaceForAspectDayun()` uses `buildSecondaryPalaceNames` which also always subtracts

### Impact

For Yang Male and Yin Female charts (clockwise Da Xian), the Da Ming tags appear on **completely wrong palaces** — the wealth analysis would read stars from the mirror-opposite palace. Approximately half of all user charts are clockwise.

### Root Cause

The calculator (`src/utils/zwds/calculator.ts`, `step11`) correctly assigns `majorLimit` ages to palaces in both directions. But the display and analysis layer blindly assumes anticlockwise.

The direction can be re-derived from `chartData`:
```typescript
const isClockwise =
  (chartData.input.gender === "male" && chartData.yinYang === "Yang") ||
  (chartData.input.gender === "female" && chartData.yinYang === "Yin");
```

---

## Analysis Components — Palace Override Architecture

### The Problem

All existing analysis utility functions hardcode natal palace names:

| Utility | Hardcoded Palace |
|---------|-----------------|
| `analyzeWealthCode()` in `wealthCodeAnalysis.ts` | `"财帛"` |
| `analyzeHealthFromChart()` in `health_analyzer.ts` | `"疾厄"` |
| `analyzeOverview()` in `overviewAnalysis.ts` | `"命宫"` |
| `calculateLifeAreaScores()` in `lifeAreasAnalysis.ts` | all 12 natal palace names |

### The Solution

Each analysis utility gains an optional `palaceNumberOverride?: number` parameter. When provided, the function reads stars from that physical palace number instead of looking up by name. The caller (result page) computes the override for the active timeframe using the palace resolver functions.

---

## Destiny Alert Map Revamp

The `FourKeyPalace` component currently shows each of the four transformations (化祿/化權/化科/化忌) with their palace name and description. The **revamped view** must also prominently display:

1. **Which star** carries the transformation (e.g. "紫微 carries 化祿")
2. **Which palace** that star activates (already shown)

Requires:
- `PalaceAlertData` type in `destinyAlertAnalysis.ts` to include `starName: string`
- `analyzeDestinyAlert()` to populate `starName` (already extracted internally, just not returned)
- `FourKeyPalace.tsx` card layout update to display star name prominently

---

## Task Dependency Graph

```
Task A (Fix Da Xian Direction)  ← independent, do first
Task B (result.tsx Blueprint + Liu Month)  ← independent of A, C, D
Task C (Destiny Alert Map Revamp)  ← independent
Task D (Analysis Utilities Palace Override)  ← independent
Task E1 (Analysis Components accept palaceOverride)  ← depends on Task D
Task E2 (result.tsx Timeframe Analysis Wiring)  ← depends on Task B + E1
```

Safe parallel execution order:
1. Run A, B, C, D in parallel
2. Run E1 after D completes
3. Run E2 after B and E1 both complete

---

## Files Changed Per Task

### Task A — Fix Da Xian Direction Bug
- `src/utils/destiny-navigator/palace-resolver.ts` (modify)
- `src/components/zwds/ZWDSChart.tsx` (modify)

### Task B — result.tsx Blueprint & Liu Month Mode
- `src/pages/result.tsx` (modify)

### Task C — Destiny Alert Map Revamp
- `src/utils/zwds/analysis/destinyAlertAnalysis.ts` (modify)
- `src/components/analysis_v2/FourKeyPalace.tsx` (modify)

### Task D — Analysis Utilities Palace Override
- `src/utils/zwds/analysis/wealthCodeAnalysis.ts` (modify)
- `src/utils/zwds/health_analyzer.ts` (modify)
- `src/utils/zwds/analysis/overviewAnalysis.ts` (modify)
- `src/utils/zwds/analysis/lifeAreasAnalysis.ts` (modify)

### Task E1 — Analysis Components Accept palaceOverride Prop
- `src/components/analysis_v2/WealthCode.tsx` (modify)
- `src/components/analysis_v2/Health.tsx` (modify)
- `src/components/analysis_v2/Overview.tsx` (modify)
- `src/components/analysis_v2/AreasOfLIfe.tsx` (modify)

### Task E2 — result.tsx Timeframe Analysis Wiring
- `src/pages/result.tsx` (modify — adds palace override computation + conditional section rendering)

---

## Key Constants and Utilities Reference

### Palace Names (PALACE_NAMES order = secondary name indices)
```
Index 0: 命宫 (Life)
Index 1: 兄弟 (Siblings)
Index 2: 夫妻 (Relationships)
Index 3: 子女 (Children)
Index 4: 财帛 (Wealth)
Index 5: 疾厄 (Health)
Index 6: 迁移 (Travel)
Index 7: 交友 (Social)
Index 8: 官禄 (Career)
Index 9: 田宅 (Home)
Index 10: 福德 (Fortune)
Index 11: 父母 (Parents)
```

### Da Ming Tag Indices (same order as above, just prefixed 大)
```
Index 0: 大命, Index 1: 大兄, Index 2: 大夫, Index 3: 大子,
Index 4: 大财, Index 5: 大疾, Index 6: 大迁, Index 7: 大友,
Index 8: 大官, Index 9: 大田, Index 10: 大福, Index 11: 大父
```

### LifeAspect to Chinese Name Mapping (for palace resolver)
```typescript
wealth → "财帛"    life → "命宫"    health → "疾厄"
career → "官禄"    relationships → "夫妻"    home → "田宅"
```
