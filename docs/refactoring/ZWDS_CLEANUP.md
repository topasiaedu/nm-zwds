# ZWDS Module Cleanup Plan

This document outlines the comprehensive refactoring plan for the ZWDS calculation and analysis engine.

## Current Problems

### 1. Confusing Location
- ZWDS code is in `src/utils/zwds/` (implies utility, but it's the core engine)
- Should be in `src/zwds/` (top-level module)

### 2. Poor Folder Organization
```
src/utils/zwds/
├── analysis/               # ❌ Unclear name
├── analysis_constants/     # ❌ Mixed data types
├── calculator.ts           # ✅ Good
├── constants.ts            # ✅ Good
└── types.ts                # ✅ Good
```

### 3. Confusing File Names
- `destinyCompassAnalysis.ts` → What is "destiny compass"? (It's timing/decade cycles)
- `fourKeyPalaceAnalysis.ts` → What are "four key palaces"? (It's transformations)
- `summaryAnalysis.ts` → Summary of what? (It's personality overview)

### 4. Mixed Responsibilities
- Analysis files contain UI helpers
- Constants files contain both data and logic
- No clear separation of concerns

### 5. Hardcoded Data Everywhere
- Analysis text in 100+ places
- Translations scattered
- Difficult to update content

## Proposed Structure

### New Organization

```
src/zwds/
├── core/                   # Core calculation engine
│   ├── calculator.ts       # Main calculator (1000+ lines)
│   ├── constants.ts        # ZWDS lookup tables
│   ├── types.ts            # Type definitions
│   ├── utils.ts            # Helper functions
│   └── index.ts            # Barrel export
│
├── data/                   # All data and content
│   ├── constants/          # Non-translatable constants
│   │   ├── palaces.ts      # Palace mappings, opposites, categories
│   │   ├── stars.ts        # Star properties, groups
│   │   ├── transformations.ts  # Transformation rules
│   │   ├── cycles.ts       # Decade cycle data
│   │   └── index.ts
│   │
│   └── content/            # Translatable content
│       ├── careers.ts      # Career data with translations
│       ├── health.ts       # Health/body parts with translations
│       ├── personalities.ts # Personality descriptions
│       ├── warnings.ts     # Warning messages
│       └── index.ts
│
├── analyzers/              # Analysis logic (pure functions)
│   ├── career.ts           # Career aptitude analysis
│   ├── health.ts           # Health analysis
│   ├── personality.ts      # Personality/overview analysis
│   ├── warnings.ts         # Warnings/cautions analysis
│   ├── life-areas.ts       # Life areas radar chart
│   ├── transformations.ts  # Four transformations analysis
│   ├── overview.ts         # Overview/summary analysis
│   ├── alerts.ts           # Critical alerts
│   │
│   ├── timing/             # Timing/decade analysis
│   │   ├── cycles.ts       # Decade cycle logic (was destinyCompassAnalysis)
│   │   ├── activations.ts  # Activation calculations
│   │   ├── daming.ts       # Da Ming utilities
│   │   └── index.ts
│   │
│   └── index.ts            # Barrel export
│
├── utils/                  # Helper utilities
│   ├── palace-helpers.ts   # Palace-related helpers
│   ├── star-helpers.ts     # Star-related helpers
│   ├── transformation-helpers.ts  # Transformation helpers
│   └── index.ts
│
└── index.ts                # Main export
```

## File Renaming Map

### Folder Renames
```bash
src/utils/zwds/                     → src/zwds/
src/utils/zwds/analysis/            → src/zwds/analyzers/
src/utils/zwds/analysis_constants/  → src/zwds/data/content/
```

### File Renames

#### Analysis Files
```bash
# Old Name                          → New Name
destinyCompassAnalysis.ts           → timing/cycles.ts
fourKeyPalaceAnalysis.ts            → transformations.ts
summaryAnalysis.ts                  → personality.ts
careerAnalysis.ts                   → career.ts
healthAnalysis.ts                   → health.ts
lifeAreasAnalysis.ts                → life-areas.ts
overviewAnalysis.ts                 → overview.ts
alertsAnalysis.ts                   → alerts.ts
watchoutAnalysis.ts                 → warnings.ts
```

#### Data Files
```bash
# Old Name                          → New Name
career_analysis.ts                  → content/careers.ts
health_analysis.ts                  → content/health.ts
summary_analysis.ts                 → content/personalities.ts
watchout_analysis.ts                → content/warnings.ts

# Extract from timing-chart.tsx
[hardcoded mappings]                → constants/palaces.ts
```

#### Core Files (Keep Same)
```bash
calculator.ts                       → core/calculator.ts
constants.ts                        → core/constants.ts
types.ts                            → core/types.ts
```

## Data Extraction

### Extract from `timing-chart.tsx`

Move these hardcoded objects to `data/constants/palaces.ts`:

```typescript
// src/zwds/data/constants/palaces.ts

export const DA_MING_TO_PALACE_MAP = {
  "命宫": "命宫",
  "父母宫": "父母宫",
  // ... rest of mapping
};

export const OPPOSITE_PALACE_MAP = {
  "命宫": "迁移宫",
  "兄弟宫": "交友宫",
  // ... rest of mapping
};

export const DA_MING_CATEGORIES = {
  "命宫": "自我发展",
  "父母宫": "学习成长",
  // ... rest of categories
};

export const PALACE_NAME_MAP = {
  "命宫": { en: "Life", zh: "命宫" },
  "兄弟宫": { en: "Siblings", zh: "兄弟宫" },
  // ... rest of names
};
```

### Extract Career Data

From `career_analysis.ts` to `data/content/careers.ts`:

```typescript
// src/zwds/data/content/careers.ts

export interface CareerData {
  archetype: string;
  stars: string[];
  translations: {
    en: string;
    zh: string;
  };
  description: {
    en: string;
    zh: string;
  };
}

export const CAREER_DATA: CareerData[] = [
  {
    archetype: "visionaries",
    stars: ["紫微", "破军", "贪狼"],
    translations: {
      en: "Visionaries",
      zh: "创新者"
    },
    description: {
      en: "Innovative leaders who see the big picture...",
      zh: "具有创新思维的领导者..."
    }
  },
  // ... more archetypes
];
```

### Extract Health Data

From `health_analysis.ts` to `data/content/health.ts`:

```typescript
// src/zwds/data/content/health.ts

export interface BodyPartMapping {
  star: string;
  bodyParts: {
    en: string[];
    zh: string[];
  };
  recommendations: {
    en: string;
    zh: string;
  };
}

export const BODY_PART_MAPPINGS: BodyPartMapping[] = [
  {
    star: "紫微",
    bodyParts: {
      en: ["Spleen", "Stomach"],
      zh: ["脾", "胃"]
    },
    recommendations: {
      en: "Pay attention to digestive health...",
      zh: "注意消化系统健康..."
    }
  },
  // ... more mappings
];
```

## Migration Steps

### Phase 1: Create New Structure (1 hour)

```bash
# 1. Create new folders
mkdir -p src/zwds/core
mkdir -p src/zwds/data/constants
mkdir -p src/zwds/data/content
mkdir -p src/zwds/analyzers/timing
mkdir -p src/zwds/utils

# 2. Move core files
mv src/utils/zwds/calculator.ts src/zwds/core/
mv src/utils/zwds/constants.ts src/zwds/core/
mv src/utils/zwds/types.ts src/zwds/core/

# 3. Create barrel exports
touch src/zwds/core/index.ts
touch src/zwds/data/constants/index.ts
touch src/zwds/data/content/index.ts
touch src/zwds/analyzers/index.ts
touch src/zwds/analyzers/timing/index.ts
touch src/zwds/utils/index.ts
touch src/zwds/index.ts
```

### Phase 2: Move and Rename Analysis Files (2 hours)

```bash
# Move analysis files with new names
mv src/utils/zwds/analysis/careerAnalysis.ts src/zwds/analyzers/career.ts
mv src/utils/zwds/analysis/healthAnalysis.ts src/zwds/analyzers/health.ts
mv src/utils/zwds/analysis/summaryAnalysis.ts src/zwds/analyzers/personality.ts
mv src/utils/zwds/analysis/overviewAnalysis.ts src/zwds/analyzers/overview.ts
mv src/utils/zwds/analysis/lifeAreasAnalysis.ts src/zwds/analyzers/life-areas.ts
mv src/utils/zwds/analysis/alertsAnalysis.ts src/zwds/analyzers/alerts.ts
mv src/utils/zwds/analysis/watchoutAnalysis.ts src/zwds/analyzers/warnings.ts
mv src/utils/zwds/analysis/fourKeyPalaceAnalysis.ts src/zwds/analyzers/transformations.ts

# Move timing analysis
mv src/utils/zwds/analysis/destinyCompassAnalysis.ts src/zwds/analyzers/timing/cycles.ts
```

### Phase 3: Extract Data Files (3 hours)

```bash
# Create new data files
touch src/zwds/data/constants/palaces.ts
touch src/zwds/data/constants/stars.ts
touch src/zwds/data/constants/transformations.ts
touch src/zwds/data/constants/cycles.ts

touch src/zwds/data/content/careers.ts
touch src/zwds/data/content/health.ts
touch src/zwds/data/content/personalities.ts
touch src/zwds/data/content/warnings.ts

# Extract data from old files
# (Manual process - copy data, restructure, add translations)
```

### Phase 4: Update Imports (2 hours)

```bash
# Find all imports from old paths
grep -r "from.*utils/zwds" src/

# Replace with new paths (automated with sed or manual)
# Example:
# OLD: import { ZWDSCalculator } from "../../utils/zwds/calculator";
# NEW: import { ZWDSCalculator } from "../../zwds/core";
```

### Phase 5: Create Barrel Exports (1 hour)

```typescript
// src/zwds/index.ts
export * from "./core";
export * from "./analyzers";
export * from "./data";
export * from "./utils";

// src/zwds/core/index.ts
export { ZWDSCalculator } from "./calculator";
export * from "./constants";
export * from "./types";
export * from "./utils";

// src/zwds/analyzers/index.ts
export * from "./career";
export * from "./health";
export * from "./personality";
export * from "./overview";
export * from "./life-areas";
export * from "./transformations";
export * from "./warnings";
export * from "./alerts";
export * from "./timing";

// ... etc
```

### Phase 6: Update Component Imports (1 hour)

```typescript
// Before
import { analyzeCareer } from "../../utils/zwds/analysis/careerAnalysis";
import { ZWDSCalculator } from "../../utils/zwds/calculator";

// After
import { analyzeCareer } from "../../zwds/analyzers";
import { ZWDSCalculator } from "../../zwds/core";

// Or even simpler
import { analyzeCareer, ZWDSCalculator } from "../../zwds";
```

### Phase 7: Delete Old Files (30 minutes)

```bash
# After verifying everything works
rm -rf src/utils/zwds/
```

### Phase 8: Test Everything (2 hours)

```bash
# Run build
npm run build

# Run tests
npm test

# Manual testing
# - Calculate chart
# - View analysis
# - Export PDF
# - Check timing chart
```

## Benefits

### Before Refactoring
```
src/utils/zwds/
├── analysis/
│   ├── destinyCompassAnalysis.ts    # ❌ Confusing name
│   ├── fourKeyPalaceAnalysis.ts     # ❌ Confusing name
│   ├── summaryAnalysis.ts           # ❌ Vague name
│   └── [7 more files]
├── analysis_constants/
│   ├── career_analysis.ts           # ❌ Mixed data/logic
│   ├── health_analysis.ts           # ❌ Hardcoded strings
│   └── [2 more files]
├── calculator.ts                    # ✅ Clear
├── constants.ts                     # ✅ Clear
└── types.ts                         # ✅ Clear
```

**Problems:**
- 😕 Confusing names
- 🔀 Mixed responsibilities
- 📝 Hardcoded data
- 🗂️ Poor organization
- 🤖 AI context bloat

### After Refactoring
```
src/zwds/
├── core/                   # ✅ Clear: calculation engine
│   ├── calculator.ts
│   ├── constants.ts
│   ├── types.ts
│   └── utils.ts
├── data/                   # ✅ Clear: all data/content
│   ├── constants/          # ✅ Non-translatable data
│   └── content/            # ✅ Translatable content
├── analyzers/              # ✅ Clear: analysis logic
│   ├── career.ts
│   ├── health.ts
│   ├── personality.ts
│   └── timing/             # ✅ Clear: timing analysis
└── utils/                  # ✅ Clear: helper functions
```

**Benefits:**
- ✅ Clear, descriptive names
- ✅ Separated concerns
- ✅ Centralized data
- ✅ Logical organization
- ✅ 60% less AI context

## Success Metrics

### Code Organization
- [ ] All files have clear, descriptive names
- [ ] Folder structure reflects purpose
- [ ] No files > 500 lines
- [ ] Clear separation of concerns

### Developer Experience
- [ ] Easy to find code (< 30 seconds)
- [ ] Clear where to add new features
- [ ] Intuitive import paths
- [ ] Comprehensive documentation

### Maintainability
- [ ] Single source of truth for data
- [ ] Easy to update content
- [ ] Simple to add translations
- [ ] Clear responsibilities

### AI Efficiency
- [ ] 60% reduction in context window usage
- [ ] Smaller, focused files
- [ ] Clear file purposes
- [ ] Better code understanding

## Rollback Plan

If issues arise:

```bash
# 1. Revert all changes
git checkout HEAD -- src/

# 2. Or revert to specific commit
git revert <commit-hash>

# 3. Or restore from backup
cp -r src-backup/ src/
```

## Related Documentation

- [Refactoring Overview](./OVERVIEW.md)
- [Dead Code Removal](./DEAD_CODE.md)
- [Component Reorganization](./COMPONENTS.md)
- [Folder Structure](../architecture/FOLDER_STRUCTURE.md)

