# Fix Next Dayun Period Selection

## Mission
Fix the "Next Dayun" functionality so that when users select "Next Dayun" in the Destiny Navigator, the chart and insights correctly anchor to the NEXT 10-year cycle instead of the current one.

## Problem
Currently, both "Current Dayun" and "Next Dayun" show the same chart because the code always uses `findCurrentDayunPalace()` regardless of the `selectedDayunPeriod` state value.

## Context: What "Anchor" Means
When analyzing a Dayun period:
1. Find the Dayun palace (the palace whose `majorLimit` range contains the relevant age)
2. This palace becomes the **anchor** (treated as the new "命宫")
3. All 12 palaces get **secondary names** relative to this anchor using `buildSecondaryPalaceNames()`
4. The aspect is then resolved using these secondary names

**Current Dayun**: Anchor = palace where `currentAge` is between `majorLimit.startAge` and `majorLimit.endAge`

**Next Dayun** (broken): Should anchor to the palace with the NEXT cycle (where `majorLimit.startAge > currentAge`), but currently still uses current.

## Your Tasks

### 1. Add Helper Function for Next Dayun Palace

**File:** `src/utils/destiny-navigator/palace-resolver.ts`

**Location:** Add this function after `findCurrentDayunPalace` (after line 93)

```typescript
/**
 * Find the palace that represents the next Dayun (10-year cycle)
 * based on the person's current age.
 * 
 * The next Dayun palace is determined by finding the palace whose
 * majorLimit.startAge is the smallest value greater than currentAge.
 * 
 * @param chartData - Complete chart data
 * @param currentAge - Person's current age
 * @returns Palace number (1-12) of next Dayun, or null if not found
 */
function findNextDayunPalace(chartData: ChartData, currentAge: number): number | null {
  // Validate age input to avoid invalid comparisons.
  if (!Number.isFinite(currentAge) || currentAge < 0) {
    return null;
  }

  // Find all palaces with majorLimit.startAge > currentAge
  const futurePalaces = chartData.palaces.filter((palace) => {
    if (!palace.majorLimit) {
      return false;
    }
    return palace.majorLimit.startAge > currentAge;
  });

  // If no future palaces exist, return null
  if (futurePalaces.length === 0) {
    return null;
  }

  // Find the palace with the smallest startAge (the immediate next cycle)
  const nextDayunPalace = futurePalaces.reduce((nearest, palace) => {
    if (!nearest.majorLimit || !palace.majorLimit) {
      return nearest;
    }
    return palace.majorLimit.startAge < nearest.majorLimit.startAge ? palace : nearest;
  });

  return nextDayunPalace?.number ?? null;
}
```

### 2. Add Export for getNextDayunPalace

**File:** `src/utils/destiny-navigator/palace-resolver.ts`

**Location:** Add after `getCurrentDayunPalace` export (after line 249)

```typescript
/**
 * Get next Dayun (major limit) palace based on age
 * @param chartData - Complete chart data
 * @returns Palace number of next dayun cycle, or null if not found
 */
export function getNextDayunPalace(chartData: ChartData): number | null {
  const birthYear = chartData.lunarDate.year;
  const currentYear = new Date().getFullYear();
  const currentAge = currentYear - birthYear + 1;

  // Find all palaces with startAge > currentAge
  const futurePalaces = chartData.palaces.filter(p => {
    const startAge = p.majorLimit?.startAge;
    return startAge !== undefined && startAge > currentAge;
  });

  // If no future palaces, return null
  if (futurePalaces.length === 0) {
    return null;
  }

  // Find the one with the smallest startAge (immediate next)
  const nextPalace = futurePalaces.reduce((nearest, palace) => {
    const nearestAge = nearest.majorLimit?.startAge ?? Infinity;
    const palaceAge = palace.majorLimit?.startAge ?? Infinity;
    return palaceAge < nearestAge ? palace : nearest;
  });

  return nextPalace?.number ?? null;
}
```

### 3. Update getPalaceForAspectDayun Signature and Implementation

**File:** `src/utils/destiny-navigator/palace-resolver.ts`

**Location:** Replace function starting at line 358

```typescript
/**
 * Get palace number for a given aspect in Dayun mode
 * @param aspect - The life aspect
 * @param chartData - Complete chart data
 * @param dayunPeriod - Which Dayun period to analyze ("current" or "next")
 * @returns Palace number or null if not found
 */
export function getPalaceForAspectDayun(
  aspect: LifeAspect, 
  chartData: ChartData,
  dayunPeriod: "current" | "next" = "current"
): number | null {
  // Calculate current age based on chart input birth year.
  const birthYear = chartData.input.year;
  const currentAge = calculateCurrentAge(birthYear);

  // Find Dayun palace based on selected period
  const dayunPalaceNumber = dayunPeriod === "next"
    ? findNextDayunPalace(chartData, currentAge)
    : findCurrentDayunPalace(chartData, currentAge);

  if (!dayunPalaceNumber) {
    console.warn(`Could not find ${dayunPeriod} Dayun palace for age:`, currentAge);
    return null;
  }

  // Build secondary palace names using the Dayun palace as "命宫".
  const secondaryNames = buildSecondaryPalaceNames(dayunPalaceNumber);

  // Map aspect to its palace name label.
  const palaceNameMap: Record<LifeAspect, string> = {
    life: "命宫",
    siblings: "兄弟",
    relationships: "夫妻",
    children: "子女",
    wealth: "财帛",
    health: "疾厄",
    travel: "迁移",
    social: "交友",
    career: "官禄",
    home: "田宅",
    fortune: "福德",
    parents: "父母"
  };

  const aspectPalaceName = palaceNameMap[aspect];

  // Find which palace has the matching secondary name.
  const targetPalaceIndex = secondaryNames.indexOf(aspectPalaceName);
  if (targetPalaceIndex === -1) {
    console.warn("Could not find palace with secondary name:", aspectPalaceName);
    return null;
  }

  // Convert 0-based index to 1-based palace number.
  return targetPalaceIndex + 1;
}
```

### 4. Update chart-configurator.ts Imports

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Line 9-16, add `getNextDayunPalace` to imports

```typescript
import {
  getPalaceForAspectNatal,
  getPalaceForAspectDayun,
  getPalaceForAspectLiuNian,
  getPalaceForAspectLiuMonth,
  getCurrentDayunPalace,
  getNextDayunPalace,  // ← ADD THIS
  getCurrentLiuNianPalace
} from "./palace-resolver";
```

### 5. Update getChartConfigForSelection Function

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Replace function starting at line 44

```typescript
/**
 * Generate chart configuration based on user's aspect and timeframe selection
 * This is the main function that determines how the chart should be displayed
 * 
 * @param aspect - The life aspect selected by user
 * @param timeframe - The timeframe selected by user
 * @param chartData - Complete chart data for the profile
 * @param dayunPeriod - Which Dayun period to analyze (only used when timeframe is "dayun")
 * @param selectedMonth - Selected month (only used when timeframe is "liumonth")
 * @returns Chart configuration object with all necessary props
 */
export function getChartConfigForSelection(
  aspect: LifeAspect,
  timeframe: TimeFrame,
  chartData: ChartData,
  dayunPeriod?: "current" | "next",
  selectedMonth?: number
): ChartConfig {
  switch (timeframe) {
    case "natal":
      return getNatalConfig(aspect, chartData);
    case "dayun":
      return getDayunConfig(aspect, chartData, dayunPeriod ?? "current");
    case "liunian":
      return getLiuNianConfig(aspect, chartData);
    case "liumonth":
      return getLiuMonthConfig(aspect, chartData, selectedMonth);
    default:
      return getDefaultConfig();
  }
}
```

### 6. Update getDayunConfig Function

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Replace function starting at line 99

```typescript
/**
 * Dayun (Decade Cycle) configuration
 * Shows Da Ming tags based on selected 10-year cycle (current or next)
 * Highlights the aspect palace in the Dayun context
 * 
 * @param aspect - The life aspect selected by user
 * @param chartData - Complete chart data
 * @param dayunPeriod - Which Dayun period to analyze ("current" or "next")
 */
function getDayunConfig(
  aspect: LifeAspect, 
  chartData: ChartData,
  dayunPeriod: "current" | "next"
): ChartConfig {
  // Get the appropriate Dayun palace based on selected period
  const dayunPalace = dayunPeriod === "next"
    ? getNextDayunPalace(chartData)
    : getCurrentDayunPalace(chartData);

  // Get the aspect palace using the selected Dayun period
  const palaceNumber = getPalaceForAspectDayun(aspect, chartData, dayunPeriod);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: dayunPalace,  // This triggers Da Ming tags
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,  // Locked
      daXianClickInteraction: true,   // Enables Da Ming tag display
      palaceNameClickInteraction: false,
      selfInfluenceIcon: true,
      liuNianTag: false,
      yearAgeClickInteraction: false,
      activationTags: true,
      showDaYunHighlight: true,       // Highlight Dayun palace
      showDaMingCornerTag: true,      // Show Da Ming tags in corners
      showDaMingBottomLabel: true,    // Replace bottom label with Da Ming tag
      showSecondaryBottomLabel: false,
      showSecondaryOverlayName: false
    }
  };
}
```

### 7. Update getLiuMonthConfig Function

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Replace function starting at line 163

```typescript
/**
 * Liu Month (Monthly Rhythm) configuration
 * Same as Liu Nian but also shows months
 * Highlights aspect palace in the selected year/month context
 * 
 * @param aspect - The life aspect selected by user
 * @param chartData - Complete chart data
 * @param selectedMonth - Selected month (1-12), defaults to current month
 */
function getLiuMonthConfig(
  aspect: LifeAspect, 
  chartData: ChartData,
  selectedMonth?: number
): ChartConfig {
  const liuNianPalace = getCurrentLiuNianPalace(chartData);
  const month = selectedMonth ?? (new Date().getMonth() + 1);
  const palaceNumber = getPalaceForAspectLiuMonth(aspect, chartData, month);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: liuNianPalace,
    showMonthsForPalace: liuNianPalace,  // This triggers month display
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,  // Locked
      daXianClickInteraction: false,
      palaceNameClickInteraction: true,
      selfInfluenceIcon: true,
      liuNianTag: true,
      yearAgeClickInteraction: true,   // Enables month display when year is clicked
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: true,
      showSecondaryOverlayName: true
    }
  };
}
```

### 8. Update ChartDisplay Props Interface

**File:** `src/components/destiny-navigator/analysis/ChartDisplay.tsx`

**Location:** Line 18-22

```typescript
/**
 * Component props
 */
interface ChartDisplayProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
  dayunPeriod?: "current" | "next";  // For Dayun timeframe
  selectedMonth?: number;             // For Liu Month timeframe
}
```

### 9. Update ChartDisplayInner to Accept and Pass New Props

**File:** `src/components/destiny-navigator/analysis/ChartDisplay.tsx`

**Location:** Line 27

```typescript
const ChartDisplayInner: React.FC<ChartDisplayProps> = ({ 
  profile, 
  aspect, 
  timeframe,
  dayunPeriod,    // ← ADD THIS
  selectedMonth   // ← ADD THIS
}) => {
```

**Location:** Line 96

```typescript
try {
  return getChartConfigForSelection(
    aspect, 
    timeframe, 
    calculatedChartData,
    dayunPeriod,     // ← ADD THIS
    selectedMonth    // ← ADD THIS
  );
} catch (err) {
```

**Location:** Line 101 - Update dependencies

```typescript
}, [aspect, timeframe, calculatedChartData, dayunPeriod, selectedMonth]);
```

### 10. Update AnalysisView to Pass Navigator State

**File:** `src/components/destiny-navigator/stages/AnalysisView.tsx`

**Location:** Line 148-152

```typescript
<ChartDisplay
  profile={profile}
  aspect={selectedAspect}
  timeframe={selectedTimeframe}
  dayunPeriod={navigatorState.selectedDayunPeriod}  // ← ADD THIS
  selectedMonth={navigatorState.selectedMonth}       // ← ADD THIS
/>
```

### 11. Update InsightsPanel Props Interface

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Around line 18-22

```typescript
interface InsightsPanelProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
  dayunPeriod?: "current" | "next";  // ← ADD THIS
  selectedMonth?: number;             // ← ADD THIS (if not already there)
}
```

### 12. Update InsightsPanel Component Signature

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Around line 27

```typescript
const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  profile, 
  aspect, 
  timeframe,
  dayunPeriod,    // ← ADD THIS
  selectedMonth   // ← ADD THIS (if not already there)
}) => {
```

### 13. Update InsightsPanel Palace Resolution

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Find the section where palaces are resolved (around line 70-90)

```typescript
// Resolve which palace to analyze based on aspect and timeframe
let palaceNumber: number | null = null;
switch (timeframe) {
  case "natal":
    palaceNumber = getPalaceForAspectNatal(aspect, chartData);
    break;
  case "dayun":
    palaceNumber = getPalaceForAspectDayun(
      aspect, 
      chartData, 
      dayunPeriod ?? "current"  // ← ADD dayunPeriod parameter
    );
    break;
  case "liunian":
    palaceNumber = getPalaceForAspectLiuNian(aspect, chartData);
    break;
  case "liumonth":
    palaceNumber = getPalaceForAspectLiuMonth(
      aspect, 
      chartData, 
      selectedMonth ?? (new Date().getMonth() + 1)
    );
    break;
}
```

### 14. Update InsightsPanel Render in AnalysisView

**File:** `src/components/destiny-navigator/stages/AnalysisView.tsx`

**Location:** Around line 162-167

```typescript
<InsightsPanel
  profile={profile}
  aspect={selectedAspect}
  timeframe={selectedTimeframe}
  dayunPeriod={navigatorState.selectedDayunPeriod}  // ← ADD THIS
  selectedMonth={navigatorState.selectedMonth}       // ← ADD THIS
/>
```

## Quality Checklist

- [ ] `findNextDayunPalace` helper function added to palace-resolver.ts
- [ ] `getNextDayunPalace` export function added to palace-resolver.ts
- [ ] `getPalaceForAspectDayun` updated with `dayunPeriod` parameter
- [ ] `getChartConfigForSelection` accepts and passes `dayunPeriod`
- [ ] `getDayunConfig` uses `dayunPeriod` to select correct palace
- [ ] `getLiuMonthConfig` accepts and uses `selectedMonth` parameter
- [ ] `ChartDisplay` component accepts both new props
- [ ] `ChartDisplay` passes props to `getChartConfigForSelection`
- [ ] `AnalysisView` passes `navigatorState.selectedDayunPeriod` to ChartDisplay
- [ ] `AnalysisView` passes `navigatorState.selectedMonth` to ChartDisplay
- [ ] `InsightsPanel` accepts both new props
- [ ] `InsightsPanel` uses `dayunPeriod` in palace resolution
- [ ] `AnalysisView` passes both props to InsightsPanel
- [ ] No TypeScript errors
- [ ] No ESLint errors

## Testing

After implementation, test:

1. **Current Dayun**:
   - Select any aspect → Dayun → Current
   - Chart should show Da Ming tags anchored to current Dayun palace
   - Insights should show stars from current Dayun perspective

2. **Next Dayun**:
   - Select any aspect → Dayun → Next
   - Chart should show Da Ming tags anchored to NEXT Dayun palace (different from current!)
   - Insights should show stars from next Dayun perspective
   - **Verify the anchor palace is different from Current Dayun**

3. **Verify the difference**:
   - Compare Current vs Next for same aspect
   - The highlighted palace should be different
   - The Da Ming tags should be positioned differently
   - The stars shown in insights should be different

## Expected Behavior

**Example: User is currently 35 years old**

**Current Dayun** (ages 32-41):
- Anchor = Palace 5 (holds ages 32-41 in majorLimit)
- Palace 5 becomes "大命" (Da Ming)
- All aspects resolved relative to Palace 5

**Next Dayun** (ages 42-51):
- Anchor = Palace 6 (holds ages 42-51 in majorLimit)
- Palace 6 becomes "大命" (Da Ming)
- All aspects resolved relative to Palace 6
- **This is currently broken - it still shows Palace 5!**

## Output Files

Modified files:
1. `src/utils/destiny-navigator/palace-resolver.ts`
2. `src/utils/destiny-navigator/chart-configurator.ts`
3. `src/components/destiny-navigator/analysis/ChartDisplay.tsx`
4. `src/components/destiny-navigator/stages/AnalysisView.tsx`
5. `src/components/destiny-navigator/analysis/InsightsPanel.tsx`
