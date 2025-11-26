# Component Reorganization Plan

This document outlines the plan for reorganizing React components in the codebase.

## Current Problems

### 1. Duplicate Analysis Folders
- `src/components/analysis/` (v1 - dead code)
- `src/components/analysis_v2/` (active)
- Confusing which one to use

### 2. Scattered PDF Components
```
src/components/
├── PdfDocument.tsx
├── PdfExportModal.tsx
├── PdfOverview.tsx
├── PdfCareer.tsx
├── PdfHealth.tsx
├── PdfAreasOfLife.tsx
├── PdfAreasOfLifeContinued.tsx
├── PdfFourKeyPalace.tsx
├── PdfFourKeyPalaceContinued.tsx
├── PdfDestinyCompass.tsx
└── PdfHealthContinued.tsx
```

All PDF components at root level - hard to find and organize.

### 3. Duplicate ZWDSChart
- `src/components/ZWDSChart.tsx` (duplicate)
- `src/components/zwds/ZWDSChart.tsx` (real one)

### 4. Unorganized UI Components
- Modal components scattered
- Navigation components not grouped
- Background components not grouped

## Proposed Structure

### New Organization

```
src/components/
├── analysis/               # Analysis display components (renamed from analysis_v2)
│   ├── Overview.tsx
│   ├── Career.tsx
│   ├── Health.tsx
│   ├── AreasOfLife.tsx
│   ├── FourKeyPalace.tsx
│   ├── DestinyCompass.tsx
│   ├── AnimatedWrapper.tsx
│   └── index.ts
│
├── chart/                  # Chart visualization
│   ├── ZWDSChart.tsx       # Main chart component
│   ├── Palace.tsx
│   ├── CenterInfo.tsx
│   ├── TransformationLines.tsx
│   ├── hooks/
│   │   ├── useStarAnimation.ts
│   │   └── useChartInteraction.ts
│   ├── icons/              # Zodiac icons
│   │   ├── README.md
│   │   └── [12 zodiac SVGs]
│   └── index.ts
│
├── pdf/                    # PDF export components
│   ├── PdfDocument.tsx
│   ├── PdfExportModal.tsx
│   ├── sections/           # PDF sections
│   │   ├── PdfOverview.tsx
│   │   ├── PdfCareer.tsx
│   │   ├── PdfHealth.tsx
│   │   ├── PdfHealthContinued.tsx
│   │   ├── PdfAreasOfLife.tsx
│   │   ├── PdfAreasOfLifeContinued.tsx
│   │   ├── PdfFourKeyPalace.tsx
│   │   ├── PdfFourKeyPalaceContinued.tsx
│   │   ├── PdfDestinyCompass.tsx
│   │   └── index.ts
│   └── index.ts
│
├── auth/                   # Authentication components
│   ├── ProtectedRoute.tsx
│   ├── TierProtectedRoute.tsx
│   └── index.ts
│
├── forms/                  # Form components
│   ├── ProfileForm.tsx
│   └── index.ts
│
├── ui/                     # Reusable UI components
│   ├── modals/
│   │   ├── ChartSettingsModal.tsx
│   │   ├── ConfirmationModal.tsx
│   │   └── index.ts
│   ├── navigation/
│   │   ├── Navbar.tsx
│   │   └── index.ts
│   ├── backgrounds/
│   │   ├── StarBackground.tsx
│   │   ├── StarryBackground.tsx
│   │   └── index.ts
│   ├── toggles/
│   │   ├── LanguageToggle.tsx
│   │   ├── ThemeToggle.tsx
│   │   └── index.ts
│   ├── PageTransition.tsx
│   ├── FreeTestPromo.tsx
│   └── index.ts
│
└── index.ts                # Main barrel export
```

## Migration Steps

### Phase 1: Remove Dead Code (30 minutes)

```bash
# 1. Move AnimatedWrapper to analysis_v2 (it's still used)
mv src/components/analysis/AnimatedWrapper.tsx src/components/analysis_v2/

# 2. Delete all dead v1 components
rm src/components/analysis/CareerAnalysis.tsx
rm src/components/analysis/HealthAnalysis.tsx
rm src/components/analysis/SummaryAnalysis.tsx
rm src/components/analysis/WatchoutAnalysis.tsx
rm src/components/analysis/LifeAreasRadarChart.tsx
rm src/components/analysis/LifeAreasExplanation.tsx
rm src/components/analysis/FourKeyPalaceAnalysis.tsx
rm src/components/analysis/index.tsx

# 3. Delete empty folder
rmdir src/components/analysis

# 4. Rename analysis_v2 to analysis
mv src/components/analysis_v2 src/components/analysis
```

### Phase 2: Organize PDF Components (1 hour)

```bash
# 1. Create PDF folder structure
mkdir -p src/components/pdf/sections

# 2. Move PDF section components
mv src/components/PdfOverview.tsx src/components/pdf/sections/
mv src/components/PdfCareer.tsx src/components/pdf/sections/
mv src/components/PdfHealth.tsx src/components/pdf/sections/
mv src/components/PdfHealthContinued.tsx src/components/pdf/sections/
mv src/components/PdfAreasOfLife.tsx src/components/pdf/sections/
mv src/components/PdfAreasOfLifeContinued.tsx src/components/pdf/sections/
mv src/components/PdfFourKeyPalace.tsx src/components/pdf/sections/
mv src/components/PdfFourKeyPalaceContinued.tsx src/components/pdf/sections/
mv src/components/PdfDestinyCompass.tsx src/components/pdf/sections/

# 3. Move PDF main components
mv src/components/PdfDocument.tsx src/components/pdf/
mv src/components/PdfExportModal.tsx src/components/pdf/

# 4. Create barrel exports
touch src/components/pdf/sections/index.ts
touch src/components/pdf/index.ts
```

### Phase 3: Organize Chart Components (30 minutes)

```bash
# 1. Create chart folder (already exists as zwds/)
# Rename zwds to chart for clarity
mv src/components/zwds src/components/chart

# 2. Delete duplicate ZWDSChart
rm src/components/ZWDSChart.tsx
```

### Phase 4: Organize UI Components (1 hour)

```bash
# 1. Create UI subfolders
mkdir -p src/components/ui/modals
mkdir -p src/components/ui/navigation
mkdir -p src/components/ui/backgrounds
mkdir -p src/components/ui/toggles

# 2. Move modal components
mv src/components/ChartSettingsModal.tsx src/components/ui/modals/
mv src/components/ConfirmationModal.tsx src/components/ui/modals/

# 3. Move navigation components
mv src/components/navbar.tsx src/components/ui/navigation/Navbar.tsx

# 4. Move background components
mv src/components/StarBackground.tsx src/components/ui/backgrounds/
mv src/components/StarryBackground.tsx src/components/ui/backgrounds/

# 5. Move toggle components
mv src/components/LanguageToggle.tsx src/components/ui/toggles/
mv src/components/ThemeToggle.tsx src/components/ui/toggles/

# 6. Move other UI components
mv src/components/PageTransition.tsx src/components/ui/
mv src/components/FreeTestPromo.tsx src/components/ui/

# 7. Create barrel exports
touch src/components/ui/modals/index.ts
touch src/components/ui/navigation/index.ts
touch src/components/ui/backgrounds/index.ts
touch src/components/ui/toggles/index.ts
touch src/components/ui/index.ts
```

### Phase 5: Organize Auth Components (15 minutes)

```bash
# 1. Create auth folder
mkdir -p src/components/auth

# 2. Move auth components
mv src/components/ProtectedRoute.tsx src/components/auth/
mv src/components/TierProtectedRoute.tsx src/components/auth/

# 3. Create barrel export
touch src/components/auth/index.ts
```

### Phase 6: Organize Form Components (15 minutes)

```bash
# 1. Create forms folder
mkdir -p src/components/forms

# 2. Move form components
mv src/components/ProfileForm.tsx src/components/forms/

# 3. Create barrel export
touch src/components/forms/index.ts
```

### Phase 7: Create Barrel Exports (1 hour)

```typescript
// src/components/index.ts
export * from "./analysis";
export * from "./chart";
export * from "./pdf";
export * from "./auth";
export * from "./forms";
export * from "./ui";

// src/components/analysis/index.ts
export { default as Overview } from "./Overview";
export { default as Career } from "./Career";
export { default as Health } from "./Health";
export { default as AreasOfLife } from "./AreasOfLife";
export { default as FourKeyPalace } from "./FourKeyPalace";
export { default as DestinyCompass } from "./DestinyCompass";
export { default as AnimatedWrapper } from "./AnimatedWrapper";

// src/components/pdf/index.ts
export { default as PdfDocument } from "./PdfDocument";
export { default as PdfExportModal } from "./PdfExportModal";
export * from "./sections";

// src/components/pdf/sections/index.ts
export { default as PdfOverview } from "./PdfOverview";
export { default as PdfCareer } from "./PdfCareer";
export { default as PdfHealth } from "./PdfHealth";
// ... etc

// src/components/chart/index.ts
export { default as ZWDSChart } from "./ZWDSChart";
export { default as Palace } from "./Palace";
export { default as CenterInfo } from "./CenterInfo";
// ... etc

// src/components/ui/index.ts
export * from "./modals";
export * from "./navigation";
export * from "./backgrounds";
export * from "./toggles";
export { default as PageTransition } from "./PageTransition";
export { default as FreeTestPromo } from "./FreeTestPromo";

// ... etc for all folders
```

### Phase 8: Update Imports (2 hours)

```bash
# Find all imports that need updating
grep -r "from.*components/Pdf" src/
grep -r "from.*components/analysis_v2" src/
grep -r "from.*components/zwds" src/
grep -r "from.*components/navbar" src/

# Update imports (manual or with sed)
```

Example import updates:

```typescript
// Before
import PdfDocument from "../components/PdfDocument";
import PdfCareer from "../components/PdfCareer";
import { Overview } from "../components/analysis_v2";
import ZWDSChart from "../components/zwds/ZWDSChart";
import Navbar from "../components/navbar";

// After
import { PdfDocument, PdfCareer } from "../components/pdf";
import { Overview } from "../components/analysis";
import { ZWDSChart } from "../components/chart";
import { Navbar } from "../components/ui";

// Or even simpler with main barrel
import { PdfDocument, PdfCareer, Overview, ZWDSChart, Navbar } from "../components";
```

### Phase 9: Test Everything (1 hour)

```bash
# Run build
npm run build

# Run tests
npm test

# Manual testing
# - View all pages
# - Check all components render
# - Test PDF export
# - Check chart display
```

## Benefits

### Before
```
src/components/
├── analysis/               # ❌ Dead code (v1)
├── analysis_v2/            # ❌ Confusing name
├── zwds/                   # ❌ Unclear (chart components)
├── PdfDocument.tsx         # ❌ Scattered
├── PdfCareer.tsx           # ❌ Scattered
├── [10 more PDF files]     # ❌ Scattered
├── ZWDSChart.tsx           # ❌ Duplicate
├── navbar.tsx              # ❌ Inconsistent naming
└── [20 more files]         # ❌ Unorganized
```

**Problems:**
- 😕 Confusing structure
- 🔀 Scattered files
- 📝 Duplicate code
- 🗂️ Hard to navigate
- 🔤 Inconsistent naming

### After
```
src/components/
├── analysis/               # ✅ Clear: analysis displays
├── chart/                  # ✅ Clear: chart visualization
├── pdf/                    # ✅ Clear: PDF export
│   └── sections/           # ✅ Organized sections
├── auth/                   # ✅ Clear: authentication
├── forms/                  # ✅ Clear: form components
└── ui/                     # ✅ Clear: reusable UI
    ├── modals/
    ├── navigation/
    ├── backgrounds/
    └── toggles/
```

**Benefits:**
- ✅ Clear organization
- ✅ Grouped by feature
- ✅ No duplicates
- ✅ Easy to navigate
- ✅ Consistent naming

## Success Metrics

### Organization
- [ ] All components in logical folders
- [ ] No files at root level
- [ ] Clear folder purposes
- [ ] Consistent naming

### Developer Experience
- [ ] Easy to find components (< 30 seconds)
- [ ] Clear where to add new components
- [ ] Intuitive import paths
- [ ] Comprehensive barrel exports

### Code Quality
- [ ] No duplicate files
- [ ] No dead code
- [ ] Consistent naming (PascalCase)
- [ ] Clear responsibilities

## Rollback Plan

If issues arise:

```bash
# Revert all changes
git checkout HEAD -- src/components/

# Or restore from backup
cp -r src-backup/components/ src/
```

## Related Documentation

- [Refactoring Overview](./OVERVIEW.md)
- [Dead Code Removal](./DEAD_CODE.md)
- [ZWDS Cleanup](./ZWDS_CLEANUP.md)
- [Folder Structure](../architecture/FOLDER_STRUCTURE.md)

