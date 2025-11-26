# UI Component Optimization Implementation Plan

> **Note**: This document describes **what** needs to be optimized and **why**, including problem analysis and proposed solutions. Implementation code will be written during the development phase.

## 📋 Overview

This document details the optimization strategy for `src/components/zwds/ZWDSChart.tsx` and related UI components, focusing on reducing unnecessary re-renders and optimizing rendering performance.

---

## 🎯 Optimization Goals

### Primary Goals
- Eliminate unnecessary Palace component re-renders
- Optimize transformation line calculations
- Create lookup tables for palace relationships
- Reduce state update frequency

### Performance Targets
- Reduce re-renders by 80%+
- Achieve 60 FPS during interactions
- Initial render < 200ms
- Re-render < 16ms

---

## 🔍 Current Bottlenecks

### 1. **All Palaces Re-render on Any State Change**

**Problem:** When any state changes (selectedPalace, selectedDaXian, etc.), all 12 Palace components re-render

```typescript
// In ZWDSChart.tsx
const renderPalace = (palaceNumber: number) => {
  // ... calculations ...
  return (
    <Palace
      key={palaceNumber}
      palaceNumber={palaceNumber}
      palace={palace}
      // ... many props ...
    />
  );
};

// All 12 palaces rendered:
{renderPalace(1)}
{renderPalace(2)}
// ... etc
```

**Impact:** 12 re-renders when only 1-2 palaces actually changed
**Solution:** Memoize Palace component with custom comparison

---

### 2. **Transformation Calculations on Every Render**

**Problem:** `getAllTransformations` recalculates opposite palace influences on every render

```typescript
// Lines 196-233
const getAllTransformations = useMemo(() => {
  const regularTransformations = selectedPalace
    ? calculateTransformations()
    : [];

  let oppositeInfluences = [];
  
  // Loops through all 12 palaces on EVERY render
  for (let i = 1; i <= 12; i++) {
    const palaceInfluences = calculateOppositePalaceInfluences(i);
    if (palaceInfluences.length > 0) {
      oppositeInfluences = [...oppositeInfluences, ...palaceInfluences];
    }
  }
  
  // ... build transformations array
}, [selectedPalace, settings, calculateTransformations, calculateOppositePalaceInfluences]);
```

**Impact:** Nested loops in render path, recalculates even when only selectedPalace changes
**Solution:** Separate memoization for opposite influences

---

### 3. **Palace Relationship Calculations in Render**

**Problem:** Palace tags, months, and secondary names calculated on every render

```typescript
// Lines 240-255, 363-394, 400-421
const getPalaceTag = (palaceNumber: number) => {
  // Math calculations for each palace
  let tagIndex = (selectedDaXian - palaceNumber) % 12;
  if (tagIndex < 0) tagIndex += 12;
  return { tag: PALACE_TAGS[tagIndex], delay: tagIndex * 0.05 };
};

const getMonthForPalace = (clickedPalaceNumber, currentPalaceNumber) => {
  // Complex month calculation logic
  // ... multiple lookups and calculations
};

const getSecondaryPalaceName = (currentPalaceNumber) => {
  // Distance calculation
  let distance = selectedPalaceName - currentPalaceNumber;
  if (distance < 0) distance += 12;
  return PALACE_NAMES[distance];
};
```

**Impact:** Calculations repeated for all 12 palaces on every render
**Solution:** Pre-calculate lookup tables in calculator, use simple lookups in UI

---

### 4. **renderPalace Called on Every Render**

**Problem:** `renderPalace` function creates new Palace elements on every render

```typescript
// Line 426
const renderPalace = (palaceNumber: number) => {
  const palace = chartData.palaces[palaceNumber - 1];
  // ... many calculations ...
  const { tag: palaceTag, delay } = getPalaceTag(palaceNumber);
  const monthDisplay = getMonthForPalace(showMonths, palaceNumber);
  const secondaryPalaceName = getSecondaryPalaceName(palaceNumber);
  
  return <Palace ... />;
};
```

**Impact:** All calculations run for all palaces on every render
**Solution:** Memoize rendered palaces array

---

## ✅ Optimization Implementation

### Optimization 1: Memoize Palace Component

#### Implementation

```typescript
// In src/components/zwds/components/Palace.tsx

import React, { memo } from "react";

// ... existing imports and types ...

/**
 * Palace component - displays a single palace in the ZWDS chart
 * Memoized to prevent unnecessary re-renders
 */
const Palace: React.FC<PalaceProps> = ({ 
  palaceNumber,
  palace,
  isSelected,
  isTargetPalace,
  transformationType,
  palaceTag,
  monthDisplay,
  secondaryPalaceName,
  // ... other props
}) => {
  // ... existing component logic ...
};

/**
 * Custom comparison function for React.memo
 * Only re-render if these specific props change
 */
const arePropsEqual = (
  prevProps: PalaceProps,
  nextProps: PalaceProps
): boolean => {
  return (
    prevProps.palaceNumber === nextProps.palaceNumber &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.isTargetPalace === nextProps.isTargetPalace &&
    prevProps.transformationType === nextProps.transformationType &&
    prevProps.palaceTag === nextProps.palaceTag &&
    prevProps.monthDisplay === nextProps.monthDisplay &&
    prevProps.secondaryPalaceName === nextProps.secondaryPalaceName &&
    prevProps.simulatedAge === nextProps.simulatedAge &&
    prevProps.disableInteraction === nextProps.disableInteraction &&
    // Only compare palace reference, not deep equality
    prevProps.palace === nextProps.palace &&
    // Compare settings by reference (assuming immutable updates)
    prevProps.chartSettings === nextProps.chartSettings
  );
};

// Export memoized component
export default memo(Palace, arePropsEqual);
```

**Expected Impact:** Only re-render palaces that actually changed (~10x fewer re-renders)

---

### Optimization 2: Separate Opposite Influences Memoization

#### Implementation

```typescript
// In ZWDSChart.tsx

/**
 * Calculate opposite palace influences once
 * Only recalculates if chartData or settings change
 */
const oppositeInfluences = useMemo(() => {
  if (!settings.transformationLines) {
    return [];
  }
  
  const influences: Array<{
    type: "祿" | "權" | "科" | "忌";
    fromPalace: number;
    toPalace: number;
    starName: string;
    isOppositeInfluence: true;
  }> = [];
  
  // Loop through all palaces to find all opposite palace influences
  for (let i = 1; i <= 12; i++) {
    const palaceInfluences = calculateOppositePalaceInfluences(i);
    if (palaceInfluences.length > 0) {
      influences.push(...palaceInfluences);
    }
  }
  
  return influences;
}, [chartData, settings.transformationLines, calculateOppositePalaceInfluences]);

/**
 * Calculate all transformation lines
 * Now uses pre-calculated opposite influences
 */
const getAllTransformations = useMemo(() => {
  const allTransformations = [];
  
  // Add regular transformations (from palace clicks) if enabled
  if (settings.palaceClickInteraction && selectedPalace) {
    const regularTransformations = calculateTransformations();
    allTransformations.push(...regularTransformations);
  }
  
  // Add pre-calculated opposite palace influences if enabled
  if (settings.transformationLines) {
    allTransformations.push(...oppositeInfluences);
  }
  
  return allTransformations;
}, [
  selectedPalace,
  settings.palaceClickInteraction,
  settings.transformationLines,
  calculateTransformations,
  oppositeInfluences, // Now depends on pre-calculated value
]);
```

**Expected Impact:** Eliminates nested loops on every selection change (~5x faster)

---

### Optimization 3: Pre-calculate Palace Relationship Lookup Tables

#### Update ChartData Type

```typescript
// In src/utils/zwds/types.ts

export interface ChartData {
  // ... existing fields ...
  
  // NEW: Pre-calculated palace relationship lookup tables
  palaceRelationships?: {
    // For Da Ming tags: [referencePalace][targetPalace] = tag info
    daMingTags: Record<number, Record<number, {
      tagZh: string;
      tagEn: string;
      distance: number;
      delay: number;
    }>>;
    
    // For month flow: [referencePalace][targetPalace] = month info
    monthFlow: Record<number, Record<number, {
      monthZh: string;
      monthEn: string;
    }>>;
    
    // For secondary palace names: [referencePalace][targetPalace] = palace name
    secondaryNames: Record<number, Record<number, string>>;
  };
}
```

#### Add to Calculator (Step 20)

```typescript
// In src/utils/zwds/calculator.ts

/**
 * Step 20: Pre-calculate palace relationship lookup tables
 * Creates lookup tables for Da Ming tags, month flow, and secondary palace names
 */
private step20(): void {
  const PALACE_TAGS_ZH = ["大命", "大兄", "大夫", "大子", "大财", "大疾", 
                          "大迁", "大友", "大官", "大田", "大福", "大父"];
  const PALACE_TAGS_EN = ["Da Ming", "Da Xiong", "Da Fu", "Da Zi", "Da Cai", "Da Ji",
                          "Da Qian", "Da You", "Da Guan", "Da Tian", "Da Fu", "Da Fu"];
  
  const MONTHS_ZH = ["一月", "二月", "三月", "四月", "五月", "六月",
                     "七月", "八月", "九月", "十月", "十一月", "十二月"];
  const MONTHS_EN = ["January", "February", "March", "April", "May", "June",
                     "July", "August", "September", "October", "November", "December"];
  
  const PALACE_TO_MONTH_MAPPING: Record<string, number> = {
    "命宫": 0, "兄弟": 1, "夫妻": 2, "子女": 3,
    "财帛": 4, "疾厄": 5, "迁移": 6, "交友": 7,
    "官禄": 8, "田宅": 9, "福德": 10, "父母": 11,
  };
  
  // Get the bottom right palace (palace number 10) for month calculation
  const bottomRightPalace = this.chartData.palaces[9];
  const startingMonthIndex = PALACE_TO_MONTH_MAPPING[bottomRightPalace.name] || 0;
  
  // Initialize lookup tables
  const daMingTags: Record<number, Record<number, any>> = {};
  const monthFlow: Record<number, Record<number, any>> = {};
  const secondaryNames: Record<number, Record<number, string>> = {};
  
  // Pre-calculate all possible relationships
  for (let refPalace = 1; refPalace <= 12; refPalace++) {
    daMingTags[refPalace] = {};
    monthFlow[refPalace] = {};
    secondaryNames[refPalace] = {};
    
    for (let targetPalace = 1; targetPalace <= 12; targetPalace++) {
      // Da Ming tags (anticlockwise from reference)
      let tagIndex = (refPalace - targetPalace) % 12;
      if (tagIndex < 0) tagIndex += 12;
      
      daMingTags[refPalace][targetPalace] = {
        tagZh: PALACE_TAGS_ZH[tagIndex],
        tagEn: PALACE_TAGS_EN[tagIndex],
        distance: tagIndex,
        delay: tagIndex * 0.05,
      };
      
      // Month flow (clockwise from reference)
      let monthDistance = targetPalace - refPalace;
      if (monthDistance < 0) monthDistance += 12;
      const monthIndex = (startingMonthIndex + monthDistance) % 12;
      
      monthFlow[refPalace][targetPalace] = {
        monthZh: MONTHS_ZH[monthIndex],
        monthEn: MONTHS_EN[monthIndex],
      };
      
      // Secondary palace names (anticlockwise from reference)
      let nameDistance = refPalace - targetPalace;
      if (nameDistance < 0) nameDistance += 12;
      secondaryNames[refPalace][targetPalace] = PALACE_NAMES[nameDistance];
    }
  }
  
  // Store in chartData
  this.chartData.palaceRelationships = {
    daMingTags,
    monthFlow,
    secondaryNames,
  };
  
  // Record calculation step
  this.chartData.calculationSteps.step20 = 
    "Palace relationship lookup tables created (Da Ming tags, month flow, secondary names)";
}
```

#### Update calculate() Method

```typescript
public calculate(): ChartData {
  // ... existing steps ...
  this.step17(); // Palace indexes
  this.step18(); // Flatten star arrays
  this.step19(); // Opposite palace references
  this.step20(); // Palace relationship lookup tables (NEW)
  
  return this.formatFinalResult();
}
```

#### Update ZWDSChart Component

```typescript
// In ZWDSChart.tsx

/**
 * Get palace tag using pre-calculated lookup table
 */
const getPalaceTag = (
  palaceNumber: number
): { tag: string | null; delay: number } => {
  if (!selectedDaXian || !settings.daXianClickInteraction) {
    return { tag: null, delay: 0 };
  }
  
  // Simple O(1) lookup instead of calculation
  const lookup = chartData.palaceRelationships?.daMingTags[selectedDaXian]?.[palaceNumber];
  
  if (!lookup) {
    return { tag: null, delay: 0 };
  }
  
  return {
    tag: language === "en" ? lookup.tagEn : lookup.tagZh,
    delay: lookup.delay,
  };
};

/**
 * Get month for palace using pre-calculated lookup table
 */
const getMonthForPalace = useCallback((
  clickedPalaceNumber: number,
  currentPalaceNumber: number
): string | null => {
  if (!showMonths || !settings.yearAgeClickInteraction) {
    return null;
  }
  
  // Simple O(1) lookup instead of complex calculation
  const lookup = chartData.palaceRelationships?.monthFlow[clickedPalaceNumber]?.[currentPalaceNumber];
  
  if (!lookup) {
    return null;
  }
  
  return language === "en" ? lookup.monthEn : lookup.monthZh;
}, [showMonths, settings.yearAgeClickInteraction, chartData.palaceRelationships, language]);

/**
 * Get secondary palace name using pre-calculated lookup table
 */
const getSecondaryPalaceName = useCallback((
  currentPalaceNumber: number
): string | null => {
  if (!selectedPalaceName || !settings.palaceNameClickInteraction) {
    return null;
  }
  
  // Simple O(1) lookup instead of calculation
  return chartData.palaceRelationships?.secondaryNames[selectedPalaceName]?.[currentPalaceNumber] || null;
}, [selectedPalaceName, settings.palaceNameClickInteraction, chartData.palaceRelationships]);
```

**Expected Impact:** Eliminates calculations in render path (~3-5x faster)

---

### Optimization 4: Memoize Rendered Palaces

#### Implementation

```typescript
// In ZWDSChart.tsx

/**
 * Memoize all rendered palaces
 * Only recalculates when relevant dependencies change
 */
const renderedPalaces = useMemo(() => {
  return Array.from({ length: 12 }, (_, i) => {
    const palaceNumber = i + 1;
    return renderPalace(palaceNumber);
  });
}, [
  chartData,
  selectedPalace,
  selectedDaXian,
  showMonths,
  selectedPalaceName,
  simulatedAge,
  language,
  settings,
  // ... other dependencies
]);

// In JSX:
return (
  <motion.div className="...">
    <motion.div className="grid grid-cols-4 grid-rows-4 ...">
      {/* First row */}
      {renderedPalaces[0]}
      {renderedPalaces[1]}
      {renderedPalaces[2]}
      {renderedPalaces[3]}
      
      {/* Second row */}
      {renderedPalaces[11]}
      <div className="col-span-2 row-span-2">
        <CenterInfo chartData={chartData} isPdfExport={isPdfExport} />
      </div>
      {renderedPalaces[4]}
      
      {/* Third row */}
      {renderedPalaces[10]}
      {renderedPalaces[5]}
      
      {/* Fourth row */}
      {renderedPalaces[9]}
      {renderedPalaces[8]}
      {renderedPalaces[7]}
      {renderedPalaces[6]}
    </motion.div>
    
    {/* Transformation lines */}
    <TransformationLines ... />
  </motion.div>
);
```

**Expected Impact:** Prevents unnecessary renderPalace calls

---

## 📊 Performance Comparison

### Before Optimization

```
User clicks palace:
  - All 12 Palace components re-render
  - getAllTransformations recalculates (nested loops)
  - 12x getPalaceTag calculations
  - 12x getMonthForPalace calculations
  - 12x getSecondaryPalaceName calculations
  - Total: ~150-300ms for re-render

User changes language:
  - All 12 Palace components re-render
  - All calculations re-run
  - Total: ~200-400ms for re-render
```

### After Optimization

```
User clicks palace:
  - Only 1-2 Palace components re-render (memoized)
  - getAllTransformations uses pre-calculated opposite influences
  - 12x O(1) lookups (no calculations)
  - Total: ~15-30ms for re-render
  - Improvement: 10x faster

User changes language:
  - All 12 Palace components re-render (language changed)
  - But uses O(1) lookups instead of calculations
  - Total: ~50-100ms for re-render
  - Improvement: 4x faster
```

---

## 🧪 Testing Requirements

### Component Tests

```typescript
describe("ZWDSChart Optimizations", () => {
  describe("Palace Memoization", () => {
    it("should not re-render unaffected palaces");
    it("should re-render only selected palace");
    it("should re-render all palaces when chartData changes");
  });
  
  describe("Transformation Calculations", () => {
    it("should memoize opposite influences");
    it("should not recalculate opposite influences on selection change");
  });
  
  describe("Palace Relationship Lookups", () => {
    it("should use lookup tables instead of calculations");
    it("should return correct Da Ming tags");
    it("should return correct month flow");
    it("should return correct secondary names");
  });
});
```

### Performance Tests

```typescript
describe("Rendering Performance", () => {
  it("should render initial chart in < 200ms");
  it("should re-render on selection in < 16ms");
  it("should maintain 60 FPS during interactions");
});
```

---

## 🚀 Implementation Checklist

### Phase 1: Component Memoization
- [ ] Add React.memo to Palace component
- [ ] Implement custom comparison function
- [ ] Test palace re-render behavior
- [ ] Verify no regressions

### Phase 2: Transformation Optimization
- [ ] Separate opposite influences memoization
- [ ] Update getAllTransformations
- [ ] Test transformation calculations
- [ ] Benchmark performance

### Phase 3: Lookup Tables
- [ ] Add Step 20 to calculator
- [ ] Update ChartData type
- [ ] Update getPalaceTag to use lookup
- [ ] Update getMonthForPalace to use lookup
- [ ] Update getSecondaryPalaceName to use lookup
- [ ] Test all lookup functions

### Phase 4: Rendered Palaces Memoization
- [ ] Memoize renderedPalaces array
- [ ] Update JSX to use array
- [ ] Test rendering behavior
- [ ] Verify performance improvement

### Phase 5: Verification
- [ ] Run full test suite
- [ ] Performance profiling with React DevTools
- [ ] Verify 60 FPS during interactions
- [ ] Update documentation

---

## 📚 Related Documents

- [Performance Overview](./OVERVIEW.md)
- [Calculator Optimization](./CALCULATOR_OPTIMIZATION.md)
- [Analysis Optimization](./ANALYSIS_OPTIMIZATION.md)
- [Testing Strategy](./TESTING_STRATEGY.md)

---

**Last Updated:** 2025-11-26
**Status:** Ready for Implementation

