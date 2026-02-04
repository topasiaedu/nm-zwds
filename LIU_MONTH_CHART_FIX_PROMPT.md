# Fix Liu Month Chart Display - Secondary Palace Names

## Mission
Fix the Liu Month chart display so that secondary palace names properly replace the natal palace names (not overlay them), matching the Liu Nian behavior.

## Problem
Currently, Liu Month has two issues:
1. **Wrong anchor palace**: Using YEAR palace for secondary names instead of MONTH palace
2. **Wrong display mode**: Showing secondary names as overlay instead of replacement

**Current behavior:**
- Shows months on year palace ✓
- Shows secondary names as overlay on month palace ✗ (should replace, not overlay)
- Uses YEAR palace as anchor for secondary names ✗ (should use MONTH palace)

**Expected behavior (like Liu Nian):**
- Shows months on year palace ✓
- Replaces natal names with secondary names throughout chart ✓
- Uses MONTH palace as anchor for secondary names ✓

## Context: Liu Month Flow

**Manual user flow:**
1. Click on year palace (e.g., 2026) → Shows months
2. Click on month palace name (e.g., palace showing "Mar") → Shows secondary names
3. Secondary names are calculated from that MONTH palace as the anchor

**Current code flow:**
```
yearPalace = palace with 2026
monthPalace = palace with "Mar"
→ Uses yearPalace for secondary names ✗ WRONG
→ Shows as overlay ✗ WRONG
```

**Correct code flow:**
```
yearPalace = palace with 2026 (for showing months)
monthPalace = palace with "Mar" (for secondary names anchor)
→ Uses monthPalace for secondary names ✓
→ Replaces natal names ✓
```

## Your Tasks

### 1. Add Helper Function to Get Month Palace

**File:** `src/utils/destiny-navigator/palace-resolver.ts`

**Location:** Add after `getCurrentLiuNianPalace` export (around line 263)

```typescript
/**
 * Get the palace that represents a specific month in Liu Month mode
 * 
 * This is the palace that should be used as the anchor for secondary palace names
 * when analyzing Liu Month (the palace the user would click on to see its secondary name)
 * 
 * @param chartData - Complete chart data
 * @param selectedMonth - Selected month (1-12)
 * @param selectedYear - Selected year (defaults to current year)
 * @returns Palace number representing that month, or null if not found
 */
export function getMonthPalaceForLiuMonth(
  chartData: ChartData,
  selectedMonth: number,
  selectedYear?: number
): number | null {
  // Validate selected month
  if (!Number.isFinite(selectedMonth) || selectedMonth < 1 || selectedMonth > 12) {
    console.warn("Invalid selected month:", selectedMonth);
    return null;
  }

  // Resolve the target year, defaulting to the current year
  const targetYear = selectedYear ?? new Date().getFullYear();

  // Find the palace that contains the target year
  const yearPalaceNumber = findPalaceWithYear(chartData, targetYear);
  if (!yearPalaceNumber) {
    console.warn("Could not find palace for year:", targetYear);
    return null;
  }

  // Convert selected month (1-12) to index (0-11)
  const targetMonthIndex = selectedMonth - 1;

  // Find the palace that corresponds to the target month index
  const monthPalaceNumber = findPalaceWithMonthIndex(
    chartData,
    yearPalaceNumber,
    targetMonthIndex
  );

  if (!monthPalaceNumber) {
    console.warn("Could not find palace for month:", selectedMonth);
    return null;
  }

  return monthPalaceNumber;
}
```

### 2. Add Helper Function to Get Year Palace

**File:** `src/utils/destiny-navigator/palace-resolver.ts`

**Location:** Add after `getMonthPalaceForLiuMonth`

```typescript
/**
 * Get the palace that contains a specific year's annual flow
 * 
 * This is the palace where months will be displayed (the year palace)
 * 
 * @param chartData - Complete chart data
 * @param selectedYear - Selected year (defaults to current year)
 * @returns Palace number with that year's annual flow, or null if not found
 */
export function getYearPalaceForLiuMonth(
  chartData: ChartData,
  selectedYear?: number
): number | null {
  const targetYear = selectedYear ?? new Date().getFullYear();
  const yearPalaceNumber = findPalaceWithYear(chartData, targetYear);
  
  if (!yearPalaceNumber) {
    console.warn("Could not find palace for year:", targetYear);
    return null;
  }
  
  return yearPalaceNumber;
}
```

### 3. Update chart-configurator.ts Imports

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Line 9-16, add new imports

```typescript
import {
  getPalaceForAspectNatal,
  getPalaceForAspectDayun,
  getPalaceForAspectLiuNian,
  getPalaceForAspectLiuMonth,
  getCurrentDayunPalace,
  getNextDayunPalace,
  getCurrentLiuNianPalace,
  getMonthPalaceForLiuMonth,  // ← ADD THIS
  getYearPalaceForLiuMonth     // ← ADD THIS
} from "./palace-resolver";
```

### 4. Update getChartConfigForSelection Function Signature

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Around line 44-62, update to pass selectedYear

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
 * @param selectedYear - Selected year (only used when timeframe is "liumonth")
 * @returns Chart configuration object with all necessary props
 */
export function getChartConfigForSelection(
  aspect: LifeAspect,
  timeframe: TimeFrame,
  chartData: ChartData,
  dayunPeriod?: "current" | "next",
  selectedMonth?: number,
  selectedYear?: number  // ← ADD THIS
): ChartConfig {
  switch (timeframe) {
    case "natal":
      return getNatalConfig(aspect, chartData);
    case "dayun":
      return getDayunConfig(aspect, chartData, dayunPeriod ?? "current");
    case "liunian":
      return getLiuNianConfig(aspect, chartData);
    case "liumonth":
      return getLiuMonthConfig(aspect, chartData, selectedMonth, selectedYear);  // ← PASS selectedYear
    default:
      return getDefaultConfig();
  }
}
```

### 5. Update getLiuMonthConfig Function

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Replace function starting around line 234

```typescript
/**
 * Liu Month (Monthly Rhythm) configuration
 * Shows months for the year palace, then displays secondary palace names
 * from the month palace as anchor (matching Liu Nian behavior)
 * 
 * @param aspect - The life aspect selected by user
 * @param chartData - Complete chart data
 * @param selectedMonth - Selected month (1-12), defaults to current month
 * @param selectedYear - Selected year, defaults to current year
 */
function getLiuMonthConfig(
  aspect: LifeAspect,
  chartData: ChartData,
  selectedMonth?: number,
  selectedYear?: number
): ChartConfig {
  const month = selectedMonth ?? (new Date().getMonth() + 1);
  const year = selectedYear ?? new Date().getFullYear();

  // Get YEAR palace (where months will be displayed)
  const yearPalace = getYearPalaceForLiuMonth(chartData, year);

  // Get MONTH palace (anchor for secondary palace names)
  const monthPalace = getMonthPalaceForLiuMonth(chartData, month, year);

  // Get aspect palace (the palace to highlight)
  const palaceNumber = getPalaceForAspectLiuMonth(aspect, chartData, month, year);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: monthPalace,  // ← Use MONTH palace, not YEAR palace
    showMonthsForPalace: yearPalace,            // ← Use YEAR palace for month display
    simulatedAge: undefined,
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,
      daXianClickInteraction: false,
      palaceNameClickInteraction: true,  // Enables secondary palace name display
      selfInfluenceIcon: true,
      liuNianTag: true,
      yearAgeClickInteraction: true,     // Enables month display
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: true,    // Replace bottom label with secondary name
      showSecondaryOverlayName: false    // ← Change to false (replaces instead of overlay)
    }
  };
}
```

### 6. Update ChartDisplay to Accept selectedYear

**File:** `src/components/destiny-navigator/analysis/ChartDisplay.tsx`

**Location:** Update interface around line 18-22

```typescript
/**
 * Component props
 */
interface ChartDisplayProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
  dayunPeriod?: "current" | "next";
  selectedMonth?: number;
  selectedYear?: number;  // ← ADD THIS
}
```

**Location:** Update component signature around line 27

```typescript
const ChartDisplayInner: React.FC<ChartDisplayProps> = ({ 
  profile, 
  aspect, 
  timeframe,
  dayunPeriod,
  selectedMonth,
  selectedYear  // ← ADD THIS
}) => {
```

**Location:** Update getChartConfigForSelection call around line 96

```typescript
try {
  return getChartConfigForSelection(
    aspect, 
    timeframe, 
    calculatedChartData,
    dayunPeriod,
    selectedMonth,
    selectedYear  // ← ADD THIS
  );
} catch (err) {
```

**Location:** Update useMemo dependencies around line 101

```typescript
}, [aspect, timeframe, calculatedChartData, dayunPeriod, selectedMonth, selectedYear]);
```

### 7. Update AnalysisView to Pass selectedYear

**File:** `src/components/destiny-navigator/stages/AnalysisView.tsx`

**Location:** Around line 148-153, add selectedYear

```typescript
<ChartDisplay
  profile={profile}
  aspect={selectedAspect}
  timeframe={selectedTimeframe}
  dayunPeriod={navigatorState.selectedDayunPeriod}
  selectedMonth={navigatorState.selectedMonth}
  selectedYear={undefined}  // ← ADD THIS (use current year for now)
/>
```

### 8. Update InsightsPanel Props Interface

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Update interface around line 18-24

```typescript
interface InsightsPanelProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
  dayunPeriod?: "current" | "next";
  selectedMonth?: number;
  selectedYear?: number;  // ← ADD THIS
}
```

### 9. Update InsightsPanel Component Signature

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Update component around line 27

```typescript
const InsightsPanel: React.FC<InsightsPanelProps> = ({ 
  profile, 
  aspect, 
  timeframe,
  dayunPeriod,
  selectedMonth,
  selectedYear  // ← ADD THIS
}) => {
```

### 10. Update InsightsPanel Palace Resolution

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

**Location:** Find the Liu Month case in palace resolution (around line 85-90)

```typescript
case "liumonth":
  palaceNumber = getPalaceForAspectLiuMonth(
    aspect, 
    chartData, 
    selectedMonth ?? (new Date().getMonth() + 1),
    selectedYear  // ← ADD THIS parameter
  );
  break;
```

### 11. Update AnalysisView InsightsPanel Call

**File:** `src/components/destiny-navigator/stages/AnalysisView.tsx`

**Location:** Around line 162-168

```typescript
<InsightsPanel
  profile={profile}
  aspect={selectedAspect}
  timeframe={selectedTimeframe}
  dayunPeriod={navigatorState.selectedDayunPeriod}
  selectedMonth={navigatorState.selectedMonth}
  selectedYear={undefined}  // ← ADD THIS (use current year for now)
/>
```

## Quality Checklist

- [ ] `getMonthPalaceForLiuMonth` helper added to palace-resolver.ts
- [ ] `getYearPalaceForLiuMonth` helper added to palace-resolver.ts
- [ ] New helpers exported from palace-resolver.ts
- [ ] chart-configurator.ts imports new helpers
- [ ] `getChartConfigForSelection` accepts `selectedYear` parameter
- [ ] `getLiuMonthConfig` uses `monthPalace` for `selectedPalaceNameControlled`
- [ ] `getLiuMonthConfig` uses `yearPalace` for `showMonthsForPalace`
- [ ] `getLiuMonthConfig` sets `showSecondaryOverlayName: false`
- [ ] `ChartDisplay` accepts and passes `selectedYear`
- [ ] `AnalysisView` passes `selectedYear` to both ChartDisplay and InsightsPanel
- [ ] `InsightsPanel` accepts and uses `selectedYear`
- [ ] No TypeScript errors
- [ ] No ESLint errors

## Testing

After implementation:

1. **Navigate to any aspect → Liu Month**
   - Should see months displayed on the year palace (e.g., palace with 2026)
   - Should see secondary palace names **replacing** natal names throughout chart
   - Should NOT see secondary names as overlays

2. **Compare with Liu Nian**
   - Liu Nian: Secondary names replace natal names ✓
   - Liu Month: Secondary names replace natal names ✓ (should match)

3. **Check the month palace**
   - The palace showing the selected month (e.g., "Feb") should be the anchor
   - All other palaces' bottom labels should show secondary names relative to it
   - Example: If month palace is "命宫", palace before it shows "兄弟", etc.

## Expected Visual Change

**Before Fix:**
```
Chart shows:
- Months on year palace ✓
- Secondary names as blue overlay ✗
- Secondary names anchored from year palace ✗
```

**After Fix:**
```
Chart shows:
- Months on year palace ✓
- Secondary names replacing natal names ✓
- Secondary names anchored from month palace ✓
```

## How Secondary Names Work

**Liu Nian:**
```
Year palace (e.g., with 2026) → Click palace name
→ That palace becomes "命宫" anchor
→ All other palaces show secondary names relative to it
→ Names REPLACE natal names (not overlay)
```

**Liu Month (should match):**
```
Year palace (e.g., with 2026) → Shows months
Month palace (e.g., showing "Feb") → This becomes anchor
→ That palace becomes "命宫" anchor
→ All other palaces show secondary names relative to it
→ Names REPLACE natal names (not overlay) ✓
```

## Output Files

Modified files:
1. `src/utils/destiny-navigator/palace-resolver.ts`
2. `src/utils/destiny-navigator/chart-configurator.ts`
3. `src/components/destiny-navigator/analysis/ChartDisplay.tsx`
4. `src/components/destiny-navigator/stages/AnalysisView.tsx`
5. `src/components/destiny-navigator/analysis/InsightsPanel.tsx`
