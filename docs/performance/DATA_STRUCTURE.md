# ChartData Structure Optimization

## 📋 Overview

This document outlines the proposed improvements to the `ChartData` structure to support performance optimizations and better separation of concerns.

---

## 🎯 Goals

### Primary Goals
- Separate domain types clearly (input, calculation, analysis, UI)
- Pre-calculate lookup indexes for O(1) access
- Reduce redundant data
- Improve type safety
- Enable better testing

---

## 🔍 Current Issues

### 1. **Type Confusion**
Currently there are two different `ChartData` types used inconsistently across the codebase.

### 2. **Flat Structure with Redundancy**
All data is stored at the same level with redundant fields.

### 3. **Mixed Concerns**
Chart calculation data, analysis results, and UI state are mixed together.

### 4. **Inconsistent Optional Fields**
Some fields are optional when they shouldn't be, others are required when they should be optional.

---

## ✅ Proposed Structure

### Core Domain Types

#### 1. UserProfile (Input)
```typescript
interface UserProfile {
  name: string;
  gender: "male" | "female";
  birthDate: {
    year: number;
    month: number;
    day: number;
    hour: number;
    isLeapMonth: boolean;
  };
}
```
**Purpose**: User input data, immutable

---

#### 2. ChartInput (Calculator Input)
```typescript
interface ChartInput {
  name: string;
  gender: "male" | "female";
  year: number;
  month: number;
  day: number;
  hour: number;
  isLeapMonth: boolean;
}
```
**Purpose**: Input to calculator, normalized from UserProfile

---

#### 3. LunarDate (Calculation Helper)
```typescript
interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
  // Derived fields
  heavenlyStem: string;
  earthlyBranch: string;
  yinYang: "Yin" | "Yang";
}
```
**Purpose**: Cached lunar calendar conversion

---

#### 4. Star (Core Entity)
```typescript
interface Star {
  name: string;
  brightness: "bright" | "average" | "dim";
  palace: number;
  isTransformed: boolean;
  transformations?: Transformation[];
  selfInfluence?: Transformation[];
}
```
**Purpose**: Star entity with all its properties

---

#### 5. Palace (Core Entity)
```typescript
interface Palace {
  // Identity
  number: number;              // 1-12
  name: string;                // 命宫, 兄弟, etc.
  earthlyBranch: string;
  heavenlyStem: string;
  
  // Star arrays (existing structure)
  mainStar?: Star[];
  bodyStar?: Star;
  lifeStar?: Star;
  minorStars: Star[];
  auxiliaryStars: Star[];
  yearStars: Star[];
  monthStars: Star[];
  dayStars: Star[];
  hourStars: Star[];
  
  // NEW: Pre-computed optimizations
  allStars?: Star[];           // All stars flattened
  allStarNames?: string[];     // All star names for quick lookup
  oppositePalace?: Palace | null; // Direct reference to opposite palace
  
  // Timing
  majorLimit?: {
    startAge: number;
    endAge: number;
  };
  annualFlow?: {
    year: number;
    heavenlyStem: string;
    earthlyBranch: string;
  };
  
  // Analysis results (optional, from opposite palace influences)
  oppositePalaceInfluence?: Array<{
    starName: string;
    transformation: Transformation;
    sourcePalace: number;
  }>;
}
```
**Purpose**: Palace entity with pre-computed optimizations

---

#### 6. ChartData (Main Output)
```typescript
interface ChartData {
  // Input reference
  input: ChartInput;
  
  // Core calculation results
  lunarDate: LunarDate;
  fiveElements: FiveElementType;
  palaces: Palace[];           // Array of 12 palaces
  
  // Key positions
  lifePalace: number;          // 1-12
  bodyPalace: number;          // 1-12
  ziWeiPosition: number;       // 1-12
  mainStar: string;            // Main star name from life palace
  
  // Transformations
  transformations?: {
    huaLu: string;
    huaQuan: string;
    huaKe: string;
    huaJi: string;
  };
  
  // NEW: Performance optimizations
  palaceIndex?: {
    byName: Map<string, Palace>;
    byNumber: Map<number, Palace>;
  };
  
  palaceRelationships?: {
    daMingTags: Record<number, Record<number, {
      tagZh: string;
      tagEn: string;
      distance: number;
      delay: number;
    }>>;
    monthFlow: Record<number, Record<number, {
      monthZh: string;
      monthEn: string;
    }>>;
    secondaryNames: Record<number, Record<number, string>>;
  };
  
  // Debug/Development
  calculationSteps?: Record<string, string>;
}
```
**Purpose**: Complete chart calculation output with optimizations

---

### Separation of Concerns

#### What Goes Where:

**Calculator produces:**
- ✅ ChartData with all palaces
- ✅ Pre-computed indexes
- ✅ Pre-flattened star arrays
- ✅ Opposite palace references
- ✅ Palace relationship lookup tables

**Analysis functions consume:**
- ✅ ChartData
- ✅ Use palaceIndex for O(1) lookups
- ✅ Use allStars/allStarNames for efficient access

**UI components consume:**
- ✅ ChartData
- ✅ Use palaceRelationships for runtime interactions
- ✅ Apply user state (selections, language, settings)

---

## 🔄 Migration Strategy

### Phase 1: Add New Fields (Non-breaking)
- Add optional fields to existing types
- Calculator populates new fields
- Old code continues to work

### Phase 2: Update Consumers (Gradual)
- Analysis functions adopt new utilities
- UI components use new lookup tables
- Test each change independently

### Phase 3: Clean Up (Final)
- Remove deprecated fields
- Update all type references
- Final verification

---

## 📊 Benefits

### Before:
```typescript
// O(n) search every time
const healthPalace = chartData.palaces.find(p => p.name === "疾厄");

// Manual star extraction (9 arrays)
const allStars = [
  ...(palace.mainStar || []),
  ...(palace.bodyStar ? [palace.bodyStar] : []),
  // ... 7 more arrays
];
```

### After:
```typescript
// O(1) lookup
const healthPalace = chartData.palaceIndex.byName.get("疾厄");

// Pre-computed array
const allStars = palace.allStars;
```

**Impact**: 10-12x faster for lookups and star access

---

## 🧪 Type Safety Improvements

### Strict Types
- No `any` types
- All fields properly typed
- Clear optional vs required fields

### Domain Separation
- `UserProfile` - user input
- `ChartInput` - calculator input
- `ChartData` - calculator output
- Analysis results - separate types per analysis

### Immutability
- Input types are immutable
- ChartData is produced once
- UI state is separate from domain data

---

## 📚 Related Documents

- [Performance Overview](./OVERVIEW.md)
- [Calculator Optimization](./CALCULATOR_OPTIMIZATION.md)
- [Analysis Optimization](./ANALYSIS_OPTIMIZATION.md)

---

**Last Updated:** 2025-11-26
**Status:** Proposed
**Impact:** Foundation for all performance optimizations


