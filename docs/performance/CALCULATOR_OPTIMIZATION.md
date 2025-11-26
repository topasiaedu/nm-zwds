# Calculator Optimization Implementation Plan

> **Note**: This document describes **what** needs to be optimized and **why**, including problem analysis and proposed solutions. Implementation code will be written during the development phase.

## 📋 Overview

This document details the optimization strategy for `src/utils/zwds/calculator.ts`, focusing on reducing redundant calculations and creating efficient data structures for downstream consumers.

---

## 🎯 Optimization Goals

### Primary Goals
- Eliminate redundant lunar calendar conversions
- Create O(1) lookup indexes for palaces
- Pre-flatten star arrays for efficient access
- Build opposite palace references

### Performance Targets
- Reduce calculation time by 50%+
- Eliminate 4+ O(n) searches
- Reduce array creation overhead by 80%+

---

## 🔍 Current Bottlenecks

### 1. **Repeated Lunar Conversions**

**Location:** Lines 375, 403, 483, 729

```typescript
// Called in step1()
const lunarDate = lunar.convertSolarToLunar(this.input.year, this.input.month, this.input.day);

// Called AGAIN in step2()
const lunarDate = lunar.convertSolarToLunar(this.input.year, this.input.month, this.input.day);

// Called AGAIN in step4()
const lunarDate = lunar.convertSolarToLunar(year, month, day);

// Called AGAIN in step9()
const lunarDate = lunar.convertSolarToLunar(year, month, day);
```

**Impact:** 3 redundant expensive calculations
**Solution:** Cache lunar date, reuse across steps

---

### 2. **Palace Searches by Earthly Branch**

**Location:** Lines 516-522, 634-649, 759-777

```typescript
// Pattern repeated 4+ times:
for (let i = 0; i < this.chartData.palaces.length; i++) {
  if (this.chartData.palaces[i].earthlyBranch === targetBranch) {
    position = i + 1;
    break;
  }
}
```

**Impact:** O(n) search repeated multiple times
**Solution:** Build branch-to-palace index once

---

### 3. **No Palace Name Index**

**Problem:** Downstream analysis functions must search for palaces by name

```typescript
// In analysis files - O(n) search
const healthPalace = chartData.palaces.find(p => p.name === "疾厄");
```

**Impact:** 10+ O(n) searches across all analysis functions
**Solution:** Create palace name index in calculator

---

## ✅ Optimization Implementation

### Optimization 1: Cache Lunar Conversion

#### Implementation

```typescript
export class ZWDSCalculator {
  private readonly input: ChartInput;
  private readonly chartData: ChartData;
  private starIndex: StarIndex = {};
  
  // NEW: Cache lunar date
  private lunarDateCache: ReturnType<typeof lunar.convertSolarToLunar> | null = null;

  /**
   * Get lunar date with caching
   * Converts solar date to lunar date once and caches the result
   */
  private getLunarDate(): ReturnType<typeof lunar.convertSolarToLunar> {
    if (!this.lunarDateCache) {
      this.lunarDateCache = lunar.convertSolarToLunar(
        this.input.year,
        this.input.month,
        this.input.day
      );
    }
    return this.lunarDateCache;
  }
}
```

#### Update Affected Steps

```typescript
// step1() - Use cached lunar date
private step1(): void {
  const lunarDate = this.getLunarDate(); // Changed from direct call
  const year = lunarDate.year - 1900 - 23 - 240;
  // ... rest of step1
}

// step2() - Use cached lunar date
private step2(): void {
  const lunarDate = this.getLunarDate(); // Changed from direct call
  const year = lunarDate.year;
  // ... rest of step2
}

// step4() - Use cached lunar date
private step4(): void {
  const { year, month, day, hour } = this.input;
  const lunarDate = this.getLunarDate(); // Changed from direct call
  const lunarMonth = lunarDate.month;
  // ... rest of step4
}

// step9() - Use cached lunar date
private step9(): void {
  const { year, month, day, hour } = this.input;
  const lunarDate = this.getLunarDate(); // Changed from direct call
  const lunarMonth = lunarDate.month;
  // ... rest of step9
}
```

**Expected Impact:** Eliminates 3 redundant conversions (~3x faster for lunar operations)

---

### Optimization 2: Branch-to-Palace Index

#### Implementation

```typescript
export class ZWDSCalculator {
  // ... existing fields ...
  
  // NEW: Branch-to-palace index
  private branchToPalaceIndex: Map<string, number> = new Map();

  /**
   * Build index mapping earthly branches to palace numbers
   * Called after palace earthly branches are assigned
   */
  private buildBranchIndex(): void {
    this.chartData.palaces.forEach((palace, index) => {
      this.branchToPalaceIndex.set(palace.earthlyBranch, index + 1);
    });
  }

  /**
   * Get palace number by earthly branch (O(1) lookup)
   */
  private getPalaceByBranch(earthlyBranch: string): number {
    const palaceNumber = this.branchToPalaceIndex.get(earthlyBranch);
    if (!palaceNumber) {
      throw new Error(`Palace not found for earthly branch: ${earthlyBranch}`);
    }
    return palaceNumber;
  }
}
```

#### Update calculate() Method

```typescript
public calculate(): ChartData {
  this.step1();
  this.step2();
  this.step3();
  
  // NEW: Build branch index after step3 (earthly branches assigned)
  this.buildBranchIndex();
  
  this.step4();
  this.step5();
  // ... rest of steps
}
```

#### Update Affected Steps

```typescript
// step4() - Use index instead of loop
private step4(): void {
  // ... existing code to get lifePalaceEarthlyBranch ...
  
  // OLD: O(n) loop
  // let lifePalace = 0;
  // for (let i = 0; i < this.chartData.palaces.length; i++) {
  //   if (this.chartData.palaces[i].earthlyBranch === lifePalaceEarthlyBranch) {
  //     lifePalace = i + 1;
  //     break;
  //   }
  // }
  
  // NEW: O(1) lookup
  const lifePalace = this.getPalaceByBranch(lifePalaceEarthlyBranch);
  
  this.chartData.lifePalace = lifePalace;
  // ... rest of step4
}

// step7() - Use index instead of loop
private step7(): void {
  // ... existing code to get ziWeiEarthlyBranch ...
  
  // NEW: O(1) lookup
  const ziWeiPosition = this.getPalaceByBranch(ziWeiEarthlyBranch);
  
  // Place ZiWei star
  this.chartData.palaces[ziWeiPosition - 1].mainStar = [{
    name: "紫微",
    brightness: "bright",
    palace: ziWeiPosition,
    isTransformed: false,
  }];
  
  this.chartData.ziWeiPosition = ziWeiPosition;
  // ... rest of step7
}

// step9() - Use index instead of loops (4 lookups)
private step9(): void {
  // ... existing code to get earthly branches ...
  
  // NEW: O(1) lookups instead of 4 loops
  const leftSupportPosition = this.getPalaceByBranch(leftSupportEarthlyBranch);
  const rightSupportPosition = this.getPalaceByBranch(rightSupportEarthlyBranch);
  const wenChangPosition = this.getPalaceByBranch(wenChangEarthlyBranch);
  const wenQuPosition = this.getPalaceByBranch(wenQuEarthlyBranch);
  
  // ... rest of step9
}
```

**Expected Impact:** 4+ O(n) searches → O(1) lookups (~10x faster for palace lookups)

---

### Optimization 3: Palace Name/Number Indexes (Step 17)

#### Type Updates

```typescript
// In src/utils/zwds/types.ts

export interface ChartData {
  // ... existing fields ...
  
  // NEW: Palace indexes for fast lookups
  palaceIndex?: {
    byName: Map<string, Palace>;
    byNumber: Map<number, Palace>;
  };
}
```

#### Implementation

```typescript
/**
 * Step 17: Build palace indexes for fast lookups
 * Creates O(1) lookup maps by palace name and number
 */
private step17(): void {
  // Create index by palace name
  const byName = new Map<string, Palace>();
  this.chartData.palaces.forEach(palace => {
    byName.set(palace.name, palace);
  });
  
  // Create index by palace number
  const byNumber = new Map<number, Palace>();
  this.chartData.palaces.forEach(palace => {
    byNumber.set(palace.number, palace);
  });
  
  // Store indexes in chartData
  this.chartData.palaceIndex = {
    byName,
    byNumber,
  };
  
  // Record calculation step
  this.chartData.calculationSteps.step17 = 
    "Palace indexes created: byName and byNumber maps for O(1) lookups";
}
```

#### Update calculate() Method

```typescript
public calculate(): ChartData {
  this.step1();
  // ... existing steps ...
  this.step12();
  
  // Combine steps 13, 14, and transformation detection
  this.optimizedFinalSteps();
  
  // Build star index for fast lookups
  this.buildStarIndex();
  
  // NEW: Build palace indexes
  this.step17();
  
  return this.formatFinalResult();
}
```

**Expected Impact:** Enables O(1) palace lookups in all analysis functions

---

### Optimization 4: Pre-flatten Star Arrays (Step 18)

#### Type Updates

```typescript
// In src/utils/zwds/types.ts

export interface Palace {
  // ... existing fields ...
  
  // NEW: Pre-computed star arrays
  allStars?: Star[];        // All stars flattened into one array
  allStarNames?: string[];  // All star names for quick checks
}
```

#### Implementation

```typescript
/**
 * Step 18: Pre-flatten star arrays for efficient access
 * Combines all star arrays into single arrays per palace
 */
private step18(): void {
  this.chartData.palaces.forEach(palace => {
    // Flatten all star arrays into one
    palace.allStars = [
      ...(palace.mainStar || []),
      ...(palace.bodyStar ? [palace.bodyStar] : []),
      ...(palace.lifeStar ? [palace.lifeStar] : []),
      ...palace.minorStars,
      ...palace.auxiliaryStars,
      ...palace.yearStars,
      ...palace.monthStars,
      ...palace.dayStars,
      ...palace.hourStars,
    ];
    
    // Create array of star names for quick checks
    palace.allStarNames = palace.allStars.map(star => star.name);
  });
  
  // Record calculation step
  this.chartData.calculationSteps.step18 = 
    `Star arrays flattened: ${this.chartData.palaces.reduce((sum, p) => sum + (p.allStars?.length || 0), 0)} total stars across all palaces`;
}
```

#### Update calculate() Method

```typescript
public calculate(): ChartData {
  // ... existing steps ...
  
  // Build palace indexes
  this.step17();
  
  // NEW: Flatten star arrays
  this.step18();
  
  return this.formatFinalResult();
}
```

**Expected Impact:** Eliminates repeated array creation in analysis functions (~5-8x faster)

---

### Optimization 5: Opposite Palace References (Step 19)

#### Type Updates

```typescript
// In src/utils/zwds/types.ts

export interface Palace {
  // ... existing fields ...
  
  // NEW: Direct reference to opposite palace
  oppositePalace?: Palace | null;
}
```

#### Implementation

```typescript
/**
 * Step 19: Build opposite palace references
 * Creates direct references between opposite palaces
 */
private step19(): void {
  // Define opposite palace mappings
  const oppositeMap: Record<string, string> = {
    "命宫": "迁移",
    "迁移": "命宫",
    "兄弟": "交友",
    "交友": "兄弟",
    "夫妻": "官禄",
    "官禄": "夫妻",
    "子女": "田宅",
    "田宅": "子女",
    "财帛": "福德",
    "福德": "财帛",
    "疾厄": "父母",
    "父母": "疾厄",
  };
  
  // Set opposite palace references
  this.chartData.palaces.forEach(palace => {
    const oppositeName = oppositeMap[palace.name];
    if (oppositeName && this.chartData.palaceIndex) {
      palace.oppositePalace = this.chartData.palaceIndex.byName.get(oppositeName) || null;
    }
  });
  
  // Record calculation step
  this.chartData.calculationSteps.step19 = 
    "Opposite palace references established for all 12 palaces";
}
```

#### Update calculate() Method

```typescript
public calculate(): ChartData {
  // ... existing steps ...
  
  // Build palace indexes
  this.step17();
  
  // Flatten star arrays
  this.step18();
  
  // NEW: Build opposite palace references
  this.step19();
  
  return this.formatFinalResult();
}
```

**Expected Impact:** Eliminates fallback palace searches in analysis functions

---

## 📊 Performance Comparison

### Before Optimization

```typescript
// Lunar conversions: 3 calls
step1(): lunar.convertSolarToLunar() // ~10ms
step2(): lunar.convertSolarToLunar() // ~10ms
step4(): lunar.convertSolarToLunar() // ~10ms
step9(): lunar.convertSolarToLunar() // ~10ms
Total: ~40ms

// Palace searches: 4+ O(n) loops
step4(): for loop (12 iterations)
step7(): for loop (12 iterations)
step9(): 4x for loops (48 iterations)
Total: ~72 iterations

// Analysis functions: 10+ O(n) searches
analyzeHealth(): palaces.find()
analyzeCareer(): 2x palaces.find()
analyzeOverview(): 2x palaces.find()
// ... more analysis functions
Total: ~120+ iterations across all analysis
```

### After Optimization

```typescript
// Lunar conversions: 1 call (cached)
getLunarDate(): lunar.convertSolarToLunar() // ~10ms (once)
Total: ~10ms
Improvement: 4x faster

// Palace searches: O(1) lookups
step4(): branchToPalaceIndex.get() // O(1)
step7(): branchToPalaceIndex.get() // O(1)
step9(): 4x branchToPalaceIndex.get() // O(1)
Total: 5 O(1) lookups
Improvement: ~10-12x faster

// Analysis functions: O(1) lookups
analyzeHealth(): palaceIndex.byName.get() // O(1)
analyzeCareer(): 2x palaceIndex.byName.get() // O(1)
analyzeOverview(): 2x palaceIndex.byName.get() // O(1)
Total: All O(1) lookups
Improvement: ~10-12x faster
```

---

## 🧪 Testing Requirements

### Unit Tests

```typescript
describe("Calculator Optimizations", () => {
  describe("Lunar Date Caching", () => {
    it("should call lunar.convertSolarToLunar only once");
    it("should return same lunar date on multiple calls");
  });
  
  describe("Branch-to-Palace Index", () => {
    it("should build index after step3");
    it("should return correct palace for each branch");
    it("should throw error for invalid branch");
  });
  
  describe("Palace Indexes (Step 17)", () => {
    it("should create byName index with all palaces");
    it("should create byNumber index with all palaces");
    it("should allow O(1) lookup by name");
    it("should allow O(1) lookup by number");
  });
  
  describe("Flattened Star Arrays (Step 18)", () => {
    it("should flatten all star arrays for each palace");
    it("should create allStarNames array");
    it("should match manual star extraction count");
  });
  
  describe("Opposite Palace References (Step 19)", () => {
    it("should set opposite palace for all palaces");
    it("should have bidirectional references");
    it("should handle all 6 opposite pairs correctly");
  });
});
```

### Performance Benchmarks

```typescript
describe("Performance Benchmarks", () => {
  it("should complete full calculation in < 100ms");
  it("should perform palace lookups in < 1ms");
  it("should cache lunar date effectively");
});
```

---

## 🚀 Implementation Checklist

### Phase 1: Core Optimizations
- [ ] Implement lunar date caching
- [ ] Build branch-to-palace index
- [ ] Update affected steps to use index
- [ ] Write unit tests for caching and index

### Phase 2: New Steps
- [ ] Implement Step 17 (palace indexes)
- [ ] Implement Step 18 (flatten star arrays)
- [ ] Implement Step 19 (opposite palace references)
- [ ] Update ChartData and Palace types
- [ ] Write unit tests for new steps

### Phase 3: Integration
- [ ] Update calculate() method
- [ ] Run full test suite
- [ ] Performance benchmarking
- [ ] Update documentation

---

## 📚 Related Documents

- [Performance Overview](./OVERVIEW.md)
- [Analysis Optimization](./ANALYSIS_OPTIMIZATION.md)
- [Testing Strategy](./TESTING_STRATEGY.md)

---

**Last Updated:** 2025-11-26
**Status:** Ready for Implementation

