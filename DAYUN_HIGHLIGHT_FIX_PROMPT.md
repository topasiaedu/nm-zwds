# Fix Next Dayun Yellow Background Highlight

## Mission
Fix the yellow Dayun palace highlight so that when "Next Dayun" is selected, the yellow background moves to the next Dayun palace instead of staying on the current one.

## Problem
The yellow background (Dayun highlight) is controlled by checking if the current age falls within a palace's `majorLimit` range. When viewing "Next Dayun", the highlight should move to the next palace, but currently it stays on the current one because it's always checking against the real current age.

## Solution
Use the `simulatedAge` prop in ZWDSChart to "trick" the chart into highlighting the next Dayun palace. When `dayunPeriod === "next"`, pass a simulated age that falls within the next Dayun's range.

## Your Tasks

### 1. Update ChartConfig Interface

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Line 22-33, add `simulatedAge` to the interface

```typescript
/**
 * Chart configuration interface
 * Contains all props needed to control the ZWDSChart component
 */
export interface ChartConfig {
  /** The palace to highlight (1-12) */
  selectedPalaceControlled: number | null;
  /** The Da Xian palace for Da Ming tags (1-12) */
  selectedDaXianControlled: number | null;
  /** The palace for secondary name display (1-12) */
  selectedPalaceNameControlled: number | null;
  /** The palace to trigger month display (1-12) - for Liu Month mode */
  showMonthsForPalace: number | null;
  /** Simulated age for Dayun highlight (makes chart think user is this age) */
  simulatedAge?: number;  // ← ADD THIS
  /** Chart settings to apply */
  settings: Partial<ChartSettings>;
}
```

### 2. Update getDayunConfig Function

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Replace the `getDayunConfig` function (should be around line 99-124 after previous fix)

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

  // Calculate simulated age for highlighting
  // When viewing "next" Dayun, simulate being at the start age of next cycle
  let simulatedAge: number | undefined = undefined;
  if (dayunPeriod === "next" && dayunPalace) {
    const nextPalace = chartData.palaces[dayunPalace - 1];
    if (nextPalace?.majorLimit) {
      // Simulate being at the start age of the next Dayun cycle
      // This makes the chart highlight the next Dayun palace with yellow background
      simulatedAge = nextPalace.majorLimit.startAge;
    }
  }

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: dayunPalace,  // This triggers Da Ming tags
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    simulatedAge,  // ← Pass simulated age for next Dayun highlighting
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

### 3. Update getNatalConfig to Include simulatedAge

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Line 68-92, add `simulatedAge: undefined`

```typescript
function getNatalConfig(aspect: LifeAspect, chartData: ChartData): ChartConfig {
  const palaceNumber = getPalaceForAspectNatal(aspect, chartData);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    simulatedAge: undefined,  // ← ADD THIS
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,
      daXianClickInteraction: false,
      palaceNameClickInteraction: false,
      selfInfluenceIcon: true,
      liuNianTag: false,
      yearAgeClickInteraction: false,
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: false,
      showSecondaryOverlayName: false
    }
  };
}
```

### 4. Update getLiuNianConfig to Include simulatedAge

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Around line 131-156, add `simulatedAge: undefined`

```typescript
function getLiuNianConfig(aspect: LifeAspect, chartData: ChartData): ChartConfig {
  const liuNianPalace = getCurrentLiuNianPalace(chartData);
  const palaceNumber = getPalaceForAspectLiuNian(aspect, chartData);

  return {
    selectedPalaceControlled: palaceNumber,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: liuNianPalace,
    showMonthsForPalace: null,
    simulatedAge: undefined,  // ← ADD THIS
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,
      daXianClickInteraction: false,
      palaceNameClickInteraction: true,
      selfInfluenceIcon: true,
      liuNianTag: true,
      yearAgeClickInteraction: false,
      activationTags: true,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: true,
      showSecondaryOverlayName: false
    }
  };
}
```

### 5. Update getLiuMonthConfig to Include simulatedAge

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Around line 163-189, add `simulatedAge: undefined`

```typescript
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
    showMonthsForPalace: liuNianPalace,
    simulatedAge: undefined,  // ← ADD THIS
    settings: {
      transformationLines: true,
      palaceClickInteraction: false,
      daXianClickInteraction: false,
      palaceNameClickInteraction: true,
      selfInfluenceIcon: true,
      liuNianTag: true,
      yearAgeClickInteraction: true,
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

### 6. Update getDefaultConfig to Include simulatedAge

**File:** `src/utils/destiny-navigator/chart-configurator.ts`

**Location:** Around line 195-217, add `simulatedAge: undefined`

```typescript
function getDefaultConfig(): ChartConfig {
  return {
    selectedPalaceControlled: null,
    selectedDaXianControlled: null,
    selectedPalaceNameControlled: null,
    showMonthsForPalace: null,
    simulatedAge: undefined,  // ← ADD THIS
    settings: {
      transformationLines: false,
      palaceClickInteraction: false,
      daXianClickInteraction: false,
      palaceNameClickInteraction: false,
      selfInfluenceIcon: true,
      liuNianTag: false,
      yearAgeClickInteraction: false,
      activationTags: false,
      showDaYunHighlight: false,
      showDaMingCornerTag: false,
      showDaMingBottomLabel: false,
      showSecondaryBottomLabel: false,
      showSecondaryOverlayName: false
    }
  };
}
```

### 7. Pass simulatedAge to ZWDSChart Component

**File:** `src/components/destiny-navigator/analysis/ChartDisplay.tsx`

**Location:** Around line 178-186

```typescript
<ZWDSChart
  chartData={calculatedChartData}
  disableInteraction={true}
  selectedPalaceControlled={chartConfig.selectedPalaceControlled ?? undefined}
  selectedDaXianControlled={chartConfig.selectedDaXianControlled ?? undefined}
  selectedPalaceNameControlled={chartConfig.selectedPalaceNameControlled ?? undefined}
  showMonthsControlled={chartConfig.showMonthsForPalace ?? undefined}
  simulatedAge={chartConfig.simulatedAge}  // ← ADD THIS LINE
/>
```

## How It Works

### Current Dayun (Age 51, cycle 46-55)
```
dayunPeriod = "current"
→ simulatedAge = undefined
→ Chart uses real current age (51)
→ Palace with majorLimit 46-55 gets yellow background ✓
```

### Next Dayun (Age 51, next cycle 56-65)
```
dayunPeriod = "next"
→ simulatedAge = 56 (start age of next cycle)
→ Chart thinks user is age 56
→ Palace with majorLimit 56-65 gets yellow background ✓
```

## Quality Checklist

- [ ] `ChartConfig` interface includes `simulatedAge?: number`
- [ ] `getDayunConfig` calculates `simulatedAge` when period is "next"
- [ ] `getNatalConfig` includes `simulatedAge: undefined`
- [ ] `getLiuNianConfig` includes `simulatedAge: undefined`
- [ ] `getLiuMonthConfig` includes `simulatedAge: undefined`
- [ ] `getDefaultConfig` includes `simulatedAge: undefined`
- [ ] `ChartDisplay.tsx` passes `simulatedAge` to `ZWDSChart`
- [ ] No TypeScript errors
- [ ] No ESLint errors

## Testing

After implementation:

1. **Select any aspect → Dayun → Current**
   - Note which palace has the yellow background (e.g., "Tan Lang" for ages 46-55)
   - Verify it matches your current age range

2. **Select same aspect → Dayun → Next**
   - Yellow background should MOVE to a different palace
   - Should be the palace with the next age range (e.g., "Xin Mao" for ages 56-65)
   - Verify the Da Ming tags are also centered on this new palace

3. **Compare both views**
   - Current Dayun: Yellow on palace A
   - Next Dayun: Yellow on palace B
   - Palace A ≠ Palace B ✓

## Expected Visual Change

**Before Fix:**
```
Current Dayun: [Tan Lang] 🟨 Yellow highlight
Next Dayun:    [Tan Lang] 🟨 Yellow highlight ← WRONG! Should move
```

**After Fix:**
```
Current Dayun: [Tan Lang] 🟨 Yellow highlight (ages 46-55)
Next Dayun:    [Xin Mao] 🟨 Yellow highlight (ages 56-65) ← Correct!
```

## Output Files

Modified files:
1. `src/utils/destiny-navigator/chart-configurator.ts`
2. `src/components/destiny-navigator/analysis/ChartDisplay.tsx`
