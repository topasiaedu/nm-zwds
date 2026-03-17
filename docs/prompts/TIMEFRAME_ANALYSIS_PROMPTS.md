# Timeframe Analysis — Agent Implementation Prompts

These prompts are ordered by dependency. Tasks A, B, C, and D are independent and can be run in parallel. Task E1 depends on D. Task E2 depends on B and E1.

---

## TASK A — Fix Da Xian Direction Bug

### Context

In Zi Wei Dou Shu (ZWDS), each person's 10-year Da Yun (大运) cycle progresses through the 12 palaces either **clockwise** (palace numbers increase) or **counter-clockwise** (palace numbers decrease), depending on gender and Yin/Yang polarity:

```
Clockwise     = Yang Male OR Yin Female   (gender=male && yinYang==="Yang" || gender=female && yinYang==="Yin")
Counter-clock = Yin Male OR Yang Female
```

The visual "Da Ming tags" (大命, 大兄, 大夫… etc.) shown on the chart are distributed from the current Da Xian palace **in the same direction as Da Xian progression**. Currently the code always uses an anticlockwise formula, which is wrong for clockwise Da Xian charts (approximately half of all users).

### Files to Read First

1. **`src/utils/zwds/calculator.ts`** lines 940–991 — shows `isClockwise` derivation and how majorLimit ages are assigned
2. **`src/utils/destiny-navigator/palace-resolver.ts`** — full file (already short)
3. **`src/components/zwds/ZWDSChart.tsx`** lines 1–35 (PALACE_TAGS array) and lines 258–277 (getPalaceTag function)

### Changes Required

#### 1. `src/utils/destiny-navigator/palace-resolver.ts`

**Add** a new exported helper right before `getPalaceFromDaXian`:

```typescript
/**
 * Determine if Da Xian (major limit) progresses clockwise for this chart.
 * Clockwise: Yang Male or Yin Female.
 * Counter-clockwise: Yin Male or Yang Female.
 *
 * @param chartData - Complete chart data
 * @returns true if Da Xian moves clockwise (increasing palace numbers)
 */
export function isDaXianClockwise(chartData: ChartData): boolean {
  const { gender } = chartData.input;
  const { yinYang } = chartData;
  return (
    (gender === "male" && yinYang === "Yang") ||
    (gender === "female" && yinYang === "Yin")
  );
}
```

**Update** `getPalaceFromDaXian` to accept an optional `clockwise` parameter:

```typescript
/**
 * Calculate target palace from Da Xian using directional offset.
 * For counter-clockwise Da Xian (Yin Male / Yang Female): target = daXianPalace - tagIndex
 * For clockwise Da Xian (Yang Male / Yin Female):          target = daXianPalace + tagIndex
 *
 * @param daXianPalace - Palace number where the current Da Xian starts (1–12)
 * @param tagIndex - Da Ming offset index (0 = 大命, 1 = 大兄, 4 = 大财, 5 = 大疾, 8 = 大官, …)
 * @param clockwise - Whether Da Xian progresses clockwise (default: false = anticlockwise)
 * @returns Target palace number (1–12)
 */
export function getPalaceFromDaXian(
  daXianPalace: number,
  tagIndex: number,
  clockwise: boolean = false
): number {
  let target = clockwise ? daXianPalace + tagIndex : daXianPalace - tagIndex;
  // Normalise to 1–12 range
  while (target <= 0) target += 12;
  while (target > 12) target -= 12;
  return target;
}
```

**Update** `getPalaceForAspectDayun` to use `getPalaceFromDaXian` with correct direction (replacing the current `buildSecondaryPalaceNames` approach):

```typescript
export function getPalaceForAspectDayun(
  aspect: LifeAspect,
  chartData: ChartData,
  dayunPeriod: "current" | "next" = "current"
): number | null {
  const birthYear = chartData.input.year;
  const currentAge = calculateCurrentAge(birthYear);

  const dayunPalaceNumber = dayunPeriod === "next"
    ? findNextDayunPalace(chartData, currentAge)
    : findCurrentDayunPalace(chartData, currentAge);

  if (!dayunPalaceNumber) {
    console.warn(`Could not find ${dayunPeriod} Dayun palace for age:`, currentAge);
    return null;
  }

  // Use Da Ming tag indices (same as visual chart display)
  const tagIndex = DA_MING_TAG_INDICES[aspect];
  if (tagIndex === undefined) {
    console.warn("No Da Ming tag index for aspect:", aspect);
    return null;
  }

  // Direction must match visual chart — derive from gender and Yin/Yang
  const clockwise = isDaXianClockwise(chartData);
  return getPalaceFromDaXian(dayunPalaceNumber, tagIndex, clockwise);
}
```

#### 2. `src/components/zwds/ZWDSChart.tsx`

Update `getPalaceTag` (around line 262) to derive direction from `chartData` and apply the same formula:

```typescript
/**
 * Calculate palace tag for a given palace based on the selected Da Xian.
 * Tags spread in the Da Xian progression direction from the selected palace.
 * Clockwise Da Xian (Yang Male / Yin Female): tags increase with palace number.
 * Counter-clockwise Da Xian (Yin Male / Yang Female): tags decrease.
 */
const getPalaceTag = (
  palaceNumber: number
): { tag: string | null; delay: number } => {
  if (!selectedDaXian || !settings.daXianClickInteraction)
    return { tag: null, delay: 0 };

  // Determine direction from chart data
  const gender = chartData.input.gender;
  const yinYang = chartData.yinYang;
  const isClockwise =
    (gender === "male" && yinYang === "Yang") ||
    (gender === "female" && yinYang === "Yin");

  // Calculate directional distance from selected Da Xian palace
  let tagIndex: number;
  if (isClockwise) {
    tagIndex = (palaceNumber - selectedDaXian + 12) % 12;
  } else {
    tagIndex = (selectedDaXian - palaceNumber + 12) % 12;
  }

  return {
    tag: language === "en" ? PALACE_TAGS_EN[tagIndex] : PALACE_TAGS[tagIndex],
    delay: tagIndex * 0.05,
  };
};
```

**Also fix the misleading comment** at line 18 in ZWDSChart.tsx — change:
```typescript
// Palace tags in clockwise order starting from the selected palace
```
to:
```typescript
// Da Ming tag labels. Spread direction (clockwise vs anticlockwise) depends on gender + Yin/Yang.
```

### Rules
- Do not use `any` types
- Do not use the non-null assertion operator `!`
- Use double quotes for strings
- Keep all existing JSDoc header comments and update them to reflect the new direction logic

---

## TASK B — result.tsx: Blueprint Buttons & Liu Month Mode

### Context

`src/pages/result.tsx` currently has three blueprint modes: `"dna"`, `"liunian"`, `"dayun"`. We need to add a fourth mode `"liumonth"` and update the button UI.

Current button labels (line ~808):
- `"DNA Chart"`, `"LiuNian Chart"`, `"DaYun Chart"`

New button labels and layout (4 buttons, each with a sub-label):
- `"DNA Chart"` (no sub-label)
- `"Liu Nian"` + sub-label `"(Yearly)"`
- `"Liu Month"` + sub-label `"(Monthly)"`
- `"Da Yun"` + sub-label `"(10 Year)"`

A **month picker** (1–12 selector) should appear below the buttons, visible only when `blueprintMode === "liumonth"`.

### Files to Read First

1. **`src/pages/result.tsx`** lines 1–30 (imports), 100–190 (state + handleBlueprintChange), 804–875 (button section + ZWDSChart props)
2. **`src/utils/destiny-navigator/palace-resolver.ts`** — just the function signatures for `getMonthPalaceForLiuMonth` and `getYearPalaceForLiuMonth` (lines 348–409)

### Changes Required

#### 1. Imports (top of `result.tsx`)

Add to the existing palace-resolver import line:

```typescript
import {
  getCurrentLiuNianPalace,
  getCurrentDayunPalace,
  getMonthPalaceForLiuMonth,   // ← ADD
  getYearPalaceForLiuMonth,    // ← ADD
} from "../utils/destiny-navigator/palace-resolver";
```

#### 2. State Type (line ~110)

Change:
```typescript
const [blueprintMode, setBlueprintMode] = useState<"dna" | "dayun" | "liunian">("dna");
```
To:
```typescript
const [blueprintMode, setBlueprintMode] = useState<"dna" | "dayun" | "liunian" | "liumonth">("dna");
```

Add a new state for selected month (insert after the `blueprintMode` state):
```typescript
/** Selected month (1–12) for Liu Month mode. Defaults to current month. */
const [selectedLiuMonth, setSelectedLiuMonth] = useState<number>(new Date().getMonth() + 1);
```

#### 3. `handleBlueprintChange` (line ~148)

Change the function signature type:
```typescript
const handleBlueprintChange = useCallback((mode: "dna" | "dayun" | "liunian" | "liumonth"): void => {
```

Add a `liumonth` case inside the function (after the `liunian` case). Liu Month uses the same chart settings as Liu Nian (secondary palace names visible), but also shows months on the chart:
```typescript
} else if (mode === "liumonth") {
  // Liu Month mode — same visual settings as Liu Nian but shows month markers
  updateSetting("liuNianTag", true);
  updateSetting("showDaYunHighlight", false);
  updateSetting("showDaMingCornerTag", false);
  updateSetting("showDaMingBottomLabel", false);
  updateSetting("showSecondaryBottomLabel", true);
  updateSetting("showSecondaryOverlayName", false);
  updateSetting("yearAgeClickInteraction", false);
  updateSetting("daXianClickInteraction", false);
  updateSetting("palaceNameClickInteraction", true);
}
```

#### 4. New `useMemo` hooks for Liu Month palaces

Add after any existing `useMemo` hooks for `currentLiuNianPalace` / `currentDayunPalace`. Place them in the same block:

```typescript
/**
 * The year palace for Liu Month mode.
 * Identifies which physical palace contains the selected year's annual flow.
 */
const currentLiuMonthYearPalace = useMemo<number | null>(() => {
  if (!calculatedChartData) return null;
  return getYearPalaceForLiuMonth(calculatedChartData);
}, [calculatedChartData]);

/**
 * The month palace anchor for Liu Month mode.
 * Identifies which physical palace represents the selected month.
 */
const currentLiuMonthPalace = useMemo<number | null>(() => {
  if (!calculatedChartData) return null;
  return getMonthPalaceForLiuMonth(calculatedChartData, selectedLiuMonth);
}, [calculatedChartData, selectedLiuMonth]);
```

#### 5. Blueprint Mode Buttons UI (line ~806)

Replace the current 3-button array map with:

```tsx
{/* Blueprint Mode Switcher */}
<div className="mb-4">
  <div className="flex gap-2 flex-wrap">
    {[
      { key: "dna",      label: "DNA Chart",  sub: ""          },
      { key: "liunian",  label: "Liu Nian",   sub: "(Yearly)"  },
      { key: "liumonth", label: "Liu Month",  sub: "(Monthly)" },
      { key: "dayun",    label: "Da Yun",     sub: "(10 Year)" },
    ].map((blueprint) => {
      const active = blueprintMode === blueprint.key;
      return (
        <button
          key={blueprint.key}
          type="button"
          onClick={() =>
            handleBlueprintChange(
              blueprint.key as "dna" | "dayun" | "liunian" | "liumonth"
            )
          }
          className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            active
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md"
              : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          }`}
        >
          <span className="block">{blueprint.label}</span>
          {blueprint.sub && (
            <span className="block text-xs opacity-70 font-normal">
              {blueprint.sub}
            </span>
          )}
        </button>
      );
    })}
  </div>

  {/* Month picker — only visible in Liu Month mode */}
  {blueprintMode === "liumonth" && (
    <div className="mt-3 flex items-center gap-2 flex-wrap">
      <span className="text-sm text-gray-600 dark:text-gray-300 font-medium">
        Month:
      </span>
      {Array.from({ length: 12 }, (_unused, i) => i + 1).map((month) => (
        <button
          key={month}
          type="button"
          onClick={() => setSelectedLiuMonth(month)}
          className={`w-9 h-9 rounded-full text-sm font-medium transition-all duration-150 ${
            selectedLiuMonth === month
              ? "bg-purple-600 text-white shadow"
              : "bg-white/60 dark:bg-gray-700/60 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-400"
          }`}
        >
          {month}
        </button>
      ))}
    </div>
  )}
</div>
```

#### 6. ZWDSChart Props (line ~840)

In the existing `selectedPalaceNameControlled` prop expression, extend it to also cover `liumonth`:

```tsx
selectedPalaceNameControlled={
  blueprintMode === "liunian"
    ? currentLiuNianPalace
    : blueprintMode === "liumonth"
      ? currentLiuMonthPalace
      : blueprintMode === "dna"
        ? dnaPalaceNameSelection
        : null
}
```

### Rules
- Do not use `any` types, the non-null assertion operator `!`, or `as unknown as T`
- Use double quotes for all strings
- Maintain all existing JSDoc comments; add new ones for new code

---

## TASK C — Destiny Alert Map Revamp

### Context

The Destiny Alert Map shows 4 transformation cards (化祿, 化權, 化科, 化忌). Each card needs to prominently display **which star carries that transformation** and **which palace it activates**. The data is already extracted internally — it just needs to be surfaced.

### Files to Read First

1. **`src/utils/zwds/analysis/destinyAlertAnalysis.ts`** — full file (183 lines)
2. **`src/components/analysis_v2/FourKeyPalace.tsx`** — full file (212 lines)

### Changes Required

#### 1. `src/utils/zwds/analysis/destinyAlertAnalysis.ts`

**Update `PalaceAlertData` type** (around line 7) to add `starName`:

```typescript
export type PalaceAlertData = {
  palace: string;
  transformation: string;
  description: string;
  quote: string;
  palaceNumber: number;
  /** The name of the star that carries this transformation (e.g. "紫微", "廉贞") */
  starName: string;
};
```

**Update the `alerts.push(...)` call** inside `analyzeDestinyAlert` (around line 166) — the variable `starName` is already destructured from `findPalaceWithTransformation`'s result, so just add it:

```typescript
alerts.push({
  palace: palaceConstant.english_name,
  transformation,
  description,
  quote,
  palaceNumber,
  starName,   // ← add this — already in scope from `const { palace, starName } = result;`
});
```

#### 2. `src/components/analysis_v2/FourKeyPalace.tsx`

Replace the current card header section inside the `.map()` render (starting at line 157 with `<div className="p-5 relative z-10 ...">`) with a revamped layout that prominently shows the star and its target palace. Keep the quote and description sections unchanged.

Find this exact block:
```tsx
<div className="p-5 relative z-10 flex flex-col h-full">
  {/* Palace name header */}
  <div className="flex justify-between items-center mb-4 flex-shrink-0">
    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
      {alert.palace}
    </h3>
  </div>
```

Replace it with:
```tsx
<div className="p-5 relative z-10 flex flex-col h-full">
  {/* Star + transformation chip row */}
  <div className="flex items-center gap-2 mb-3 flex-shrink-0 flex-wrap">
    <span className="text-xs font-mono bg-black/10 dark:bg-white/10 rounded px-2 py-0.5 text-gray-700 dark:text-gray-200">
      ⭐ {alert.starName}
    </span>
    <span className={`text-xs font-bold ${getTransformationColor(alert.transformation)}`}>
      {alert.transformation}
    </span>
  </div>

  {/* Palace activation header */}
  <div className="mb-3 flex-shrink-0">
    <p className="text-xs uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-0.5">
      Activates
    </p>
    <h3 className="text-xl font-bold text-gray-800 dark:text-white">
      {alert.palace}
    </h3>
  </div>
```

### Rules
- Do not use `any`, non-null assertion `!`, or `as unknown as T`
- Use double quotes for strings
- Keep all existing card helper functions (`getTransformationColor`, `getHighlightColor`, etc.) unchanged

---

## TASK D — Analysis Utilities: Palace Number Override

### Context

Each analysis utility currently finds its target palace by hardcoded Chinese palace name. To support timeframe-aware analysis (Liu Nian, Liu Month, Da Yun), each function needs an optional `palaceNumberOverride` parameter. When provided, the function uses that physical palace (by number) instead of looking up by natal name.

The **palace number** is the `number` field on a `Palace` object (1–12). Looking up by number means:
```typescript
const palace = chartData.palaces.find(p => p.number === palaceNumberOverride);
```

### Files to Read First (read all four before making changes)

1. **`src/utils/zwds/analysis/wealthCodeAnalysis.ts`** lines 50–60 (`findPalaceByName`) and 250–310 (`analyzeWealthCode`)
2. **`src/utils/zwds/health_analyzer.ts`** lines 125–172 (`analyzeHealthFromChart`)
3. **`src/utils/zwds/analysis/overviewAnalysis.ts`** lines 65–95 (`getRelevantStars` / `findPalaceByName`)
4. **`src/utils/zwds/analysis/lifeAreasAnalysis.ts`** lines 130–200 (`calculateLifeAreaScores`)

### Changes Required

#### 1. `src/utils/zwds/analysis/wealthCodeAnalysis.ts`

Update `analyzeWealthCode` signature and first palace lookup:

```typescript
/**
 * @param chartData - Calculated ZWDS chart data
 * @param palaceNumberOverride - Optional physical palace number (1–12) to analyse
 *   instead of the natal Wealth Palace (财帛). Used for timeframe-based analysis.
 */
export function analyzeWealthCode(
  chartData: ChartData,
  palaceNumberOverride?: number
): WealthProfile {
  const clientName = chartData.input.name || "Client";

  // Resolve palace: use override if provided, otherwise find by natal name "财帛"
  const wealthPalace = palaceNumberOverride !== undefined
    ? (chartData.palaces.find(p => p.number === palaceNumberOverride) ?? null)
    : findPalaceByName(chartData, "财帛");

  // ... rest of function unchanged ...
}
```

#### 2. `src/utils/zwds/health_analyzer.ts`

Update `analyzeHealthFromChart` signature and palace lookup:

```typescript
/**
 * @param chartData - Calculated ZWDS chart data
 * @param palaceNumberOverride - Optional physical palace number (1–12) to analyse
 *   instead of the natal Health Palace (疾厄). Used for timeframe-based analysis.
 */
export const analyzeHealthFromChart = (
  chartData: ChartData,
  palaceNumberOverride?: number
): HealthAnalysisResult => {
  if (!chartData || !chartData.palaces) {
    throw new Error("Invalid chart data provided");
  }

  // Resolve palace: use override if provided, otherwise find by natal name "疾厄"
  const healthPalace = palaceNumberOverride !== undefined
    ? (chartData.palaces.find(p => p.number === palaceNumberOverride) ?? null)
    : (chartData.palaces.find(palace => palace.name === "疾厄") ?? null);

  // ... rest of function unchanged (including the fallback to 父母 when empty) ...
};
```

#### 3. `src/utils/zwds/analysis/overviewAnalysis.ts`

Update `getRelevantStars` (the internal helper) and the exported `analyzeOverview` function.

First, change `getRelevantStars` to accept an optional override:

```typescript
/**
 * Get star names from life palace, or travel palace as fallback.
 * @param chartData - Chart data
 * @param palaceNumberOverride - Optional palace number (1–12) to use instead of 命宫
 */
const getRelevantStars = (
  chartData: ChartData,
  palaceNumberOverride?: number
): string[] => {
  if (palaceNumberOverride !== undefined) {
    // Use the override palace directly
    const overridePalace = chartData.palaces.find(p => p.number === palaceNumberOverride);
    if (overridePalace) {
      const stars = extractStarNamesFromPalace(overridePalace);
      if (stars.length > 0) return stars;
    }
    // Fallback to travel palace if override palace is empty
    const travelPalace = findPalaceByName(chartData, "迁移");
    if (travelPalace) return extractStarNamesFromPalace(travelPalace);
    return [];
  }

  // Natal logic (unchanged)
  const lifePalace = findPalaceByName(chartData, "命宫");
  if (lifePalace) {
    const lifeStars = extractStarNamesFromPalace(lifePalace);
    if (lifeStars.length > 0) return lifeStars;
  }
  const travelPalace = findPalaceByName(chartData, "迁移");
  if (travelPalace) return extractStarNamesFromPalace(travelPalace);
  return [];
};
```

Then update the exported `analyzeOverview` signature (find the function that calls `getRelevantStars`):

```typescript
/**
 * @param chartData - Calculated ZWDS chart data
 * @param palaceNumberOverride - Optional physical palace number (1–12) to analyse
 *   instead of the natal Life Palace (命宫). Used for timeframe-based analysis.
 */
export function analyzeOverview(
  chartData: ChartData,
  palaceNumberOverride?: number
): OverviewResult {
  // Update the call to getRelevantStars to forward the override:
  const starNames = getRelevantStars(chartData, palaceNumberOverride);
  // ... rest unchanged ...
}
```

#### 4. `src/utils/zwds/analysis/lifeAreasAnalysis.ts`

This function scores all 12 life areas. When an override is provided, it should only override the **life area that corresponds to the overridden palace's natal name**. For other areas, natal data is used as usual.

Update `calculateLifeAreaScores`:

```typescript
/**
 * @param chartData - Calculated ZWDS chart data
 * @param language - Display language ("en" or "zh")
 * @param palaceNumberOverride - Optional physical palace number (1–12). When provided,
 *   the area that maps to the overridden palace is scored from that physical palace's stars
 *   instead of by natal name lookup.
 */
export function calculateLifeAreaScores(
  chartData: ChartDataType | null | undefined,
  language: string,
  palaceNumberOverride?: number
): RadarDataPoint[] {
  // ... existing setup ...

  mainLifeAreas.forEach(areaName => {
    // Check if this area corresponds to the override palace
    const overridePalace =
      palaceNumberOverride !== undefined
        ? chartData.palaces.find(p => p.number === palaceNumberOverride && p.name === areaName)
        : null;

    const palace = overridePalace ?? chartData.palaces.find((p) => p.name === areaName);
    // ... rest of inner body unchanged ...
  });
}
```

Also update `analyzeLifeAreas` with the same optional parameter (forward `palaceNumberOverride` in the same way):

```typescript
export function analyzeLifeAreas(
  chartData: ChartDataType | null | undefined,
  language: string,
  palaceNumberOverride?: number
): LifeAreaResult[] {
```

### Rules
- Do not use `any`, non-null assertion `!`, or `as unknown as T`
- Use double quotes for strings
- All changes are additive — no existing logic is removed, only guarded by the override condition

---

## TASK E1 — Analysis Components: Accept `palaceOverride` Prop

### Prerequisites

**Task D must be completed before this task.** This task updates each analysis component to accept and forward the `palaceOverride` prop to the utility functions updated in Task D.

### Files to Read First

1. **`src/components/analysis_v2/WealthCode.tsx`** — full file (look at the `WealthCodeProps` interface and how `analyzeWealthCode` is called)
2. **`src/components/analysis_v2/Health.tsx`** — full file (look at props interface and how `analyzeHealthFromChart` is called)
3. **`src/components/analysis_v2/Overview.tsx`** — full file (look at props interface and how `analyzeOverview` is called)
4. **`src/components/analysis_v2/AreasOfLIfe.tsx`** — full file (look at props interface and how `calculateLifeAreaScores`/`analyzeLifeAreas` are called)

### Changes Required

#### Pattern (same for all four components)

1. Add `palaceOverride?: number` to the component's props interface
2. Forward it to the utility function call

#### 1. `src/components/analysis_v2/WealthCode.tsx`

In the `WealthCodeProps` interface, add:
```typescript
/**
 * Optional physical palace number override (1–12).
 * When provided, analyses this palace instead of the natal Wealth Palace (财帛).
 * Used for timeframe-based analysis (Liu Nian, Liu Month, Da Yun).
 */
palaceOverride?: number;
```

In the component body, pass it to `analyzeWealthCode`:
```typescript
const wealthProfile = analyzeWealthCode(chartData, palaceOverride);
```

#### 2. `src/components/analysis_v2/Health.tsx`

Add to props interface:
```typescript
/** Optional physical palace number (1–12) for timeframe-based analysis. */
palaceOverride?: number;
```

Pass it to `analyzeHealthFromChart`:
```typescript
const healthResult = analyzeHealthFromChart(chartData, palaceOverride);
```

#### 3. `src/components/analysis_v2/Overview.tsx`

Add to props interface:
```typescript
/** Optional physical palace number (1–12) for timeframe-based analysis. */
palaceOverride?: number;
```

Pass it to `analyzeOverview`:
```typescript
const overviewData = analyzeOverview(chartData, palaceOverride);
```

#### 4. `src/components/analysis_v2/AreasOfLIfe.tsx`

Add to props interface:
```typescript
/** Optional physical palace number (1–12) for timeframe-based analysis. */
palaceOverride?: number;
```

Pass it to both utility calls:
```typescript
const scores = calculateLifeAreaScores(chartData, language, palaceOverride);
const areas  = analyzeLifeAreas(chartData, language, palaceOverride);
```

### Rules
- Do not use `any`, non-null assertion `!`, or `as unknown as T`
- Use double quotes for strings
- Props that are added should be documented with JSDoc comments
- All added props must be optional (`?`) — never break existing call sites

---

## TASK E2 — result.tsx: Timeframe-Aware Analysis Wiring

### Prerequisites

**Tasks B and E1 must both be completed before this task.**

### Context

Currently the analysis section (line ~1213 in result.tsx) always passes raw `calculatedChartData` to every analysis component with no palace override — it always reflects natal data regardless of the selected blueprint mode. This task:

1. Computes the correct `palaceOverride` for each analysis section per the active `blueprintMode`
2. Passes the override to each analysis component
3. Moves `DayunSection` to the **top** of the analysis list and renders it **only** in `dayun` mode
4. Shows the `Overview`, `WealthCode`, `Health`, `FourKeyPalace`, `AreasOfLife`, `NoblemanSection` for `dna`, `liunian`, and `liumonth` modes

### Files to Read First

1. **`src/pages/result.tsx`** lines 1–30 (imports), 100–130 (state), 1213–1285 (analysis section)
2. **`src/utils/destiny-navigator/palace-resolver.ts`** — just function signatures:
   - `getPalaceForAspectNatal(aspect, chartData)` → `number | null`
   - `getPalaceForAspectLiuNian(aspect, chartData)` → `number | null`
   - `getPalaceForAspectLiuMonth(aspect, chartData, selectedMonth, selectedYear?)` → `number | null`
   - `getPalaceForAspectDayun(aspect, chartData, dayunPeriod?)` → `number | null`

### Changes Required

#### 1. Update imports at top of `result.tsx`

Add these to the palace-resolver import:
```typescript
import {
  getCurrentLiuNianPalace,
  getCurrentDayunPalace,
  getMonthPalaceForLiuMonth,
  getYearPalaceForLiuMonth,
  getPalaceForAspectNatal,    // ← ADD
  getPalaceForAspectLiuNian,  // ← ADD
  getPalaceForAspectLiuMonth, // ← ADD
  getPalaceForAspectDayun,    // ← ADD
} from "../utils/destiny-navigator/palace-resolver";
```

Also import `LifeAspect` type (if not already present):
```typescript
import type { LifeAspect } from "../types/destiny-navigator";
```

#### 2. Add palace override resolver (place after the existing `useMemo` hooks, before the JSX return)

```typescript
/**
 * Resolve the physical palace number override for a given life aspect
 * based on the currently active blueprint mode.
 *
 * Returns null when no override is needed (natal mode uses palace names directly).
 *
 * @param aspect - The life aspect to resolve (e.g. "wealth", "health", "life")
 * @returns Palace number (1–12) or null
 */
const getPalaceOverride = useCallback(
  (aspect: LifeAspect): number | null => {
    if (!calculatedChartData) return null;

    switch (blueprintMode) {
      case "dna":
        // Natal — no override needed; components find palaces by name
        return null;

      case "liunian":
        return getPalaceForAspectLiuNian(aspect, calculatedChartData);

      case "liumonth":
        return getPalaceForAspectLiuMonth(aspect, calculatedChartData, selectedLiuMonth);

      case "dayun":
        return getPalaceForAspectDayun(aspect, calculatedChartData, "current");

      default:
        return null;
    }
  },
  [calculatedChartData, blueprintMode, selectedLiuMonth]
);
```

#### 3. Refactor the analysis section JSX (lines ~1213–1285)

Replace the contents of `<div className="space-y-8">` with this structure:

```tsx
<div className="space-y-8">

  {/* ── Da Yun Mode: Show only DayunSection ─────────────────────── */}
  {blueprintMode === "dayun" && (
    <DayunSection chartData={calculatedChartData} />
  )}

  {/* ── All other modes: Full analysis suite ────────────────────── */}
  {blueprintMode !== "dayun" && (
    <>
      {/* Overview — uses Life Palace (命宫) */}
      <Overview
        chartData={calculatedChartData}
        palaceOverride={getPalaceOverride("life") ?? undefined}
      />

      {hasFullAnalysis && (
        <>
          {/* Wealth Code — uses Wealth Palace (财帛) */}
          <WealthCode
            chartData={calculatedChartData}
            showTopDivider={true}
            header={{
              badgeText: "02",
              title: "WEALTH CODE ANALYSIS",
              subtitle:
                "Decode your natural earning style and ideal business model aligned to your energy.",
            }}
            palaceOverride={getPalaceOverride("wealth") ?? undefined}
          />

          <NoblemanSection chartData={calculatedChartData} />

          {/* Health — uses Health Palace (疾厄) */}
          <Health
            chartData={calculatedChartData}
            palaceOverride={getPalaceOverride("health") ?? undefined}
          />

          {/* Destiny Alert Map — always shows natal transformations */}
          <FourKeyPalace chartData={calculatedChartData} />
        </>
      )}

      {/* Areas of Life — uses all palace areas */}
      <AreasOfLife
        chartData={calculatedChartData}
        palaceOverride={getPalaceOverride("life") ?? undefined}
      />
    </>
  )}

</div>
```

> **Note:** `getPalaceOverride("life") ?? undefined` is used because component props are `palaceOverride?: number` (undefined = no override), while `getPalaceOverride` returns `number | null`.

### Rules
- Do not use `any`, non-null assertion `!`, or `as unknown as T`
- Use double quotes for strings
- Maintain all existing JSDoc comments and add new ones
- The `DayunSection` must only appear in `dayun` mode — remove it from any other position in the analysis section
- `FourKeyPalace` (Destiny Alert Map) always uses natal data and does not need a palace override

---

## Implementation Order Summary

```
Phase 1 (parallel):  Task A + Task B + Task C + Task D
Phase 2 (after D):   Task E1
Phase 3 (after B+E1): Task E2
```

Each task is fully self-contained with all code context listed in "Files to Read First". Do not begin a task unless its prerequisites are complete.
