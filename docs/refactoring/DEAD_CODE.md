# Dead Code Removal

This document lists all files and code that should be deleted from the codebase.

## Files to Delete

### Root Directory

```bash
# Git command file (accidentally committed)
rm "et --hard d03dd01"

# Untitled file (accidentally committed)
rm "Untitled-1"

# Old README (moved to docs/)
rm "CHART_ONLY_README.md"  # Now in docs/api/CHART_ONLY.md
```

### Old ZWDS Calculator (Dead Code)

These files are from an old version of the calculator and are no longer used:

```bash
rm src/utils/ziweiCalculator.ts
rm src/utils/ziweiConstants.ts
rm src/utils/ziweiTypes.ts
```

**Verification**: No imports found for these files in the codebase.

### Analysis v1 Components (Dead Code)

The entire `analysis/` folder is dead code (replaced by `analysis_v2/`):

```bash
# Delete all v1 analysis components (except AnimatedWrapper)
rm src/components/analysis/CareerAnalysis.tsx
rm src/components/analysis/HealthAnalysis.tsx
rm src/components/analysis/SummaryAnalysis.tsx
rm src/components/analysis/WatchoutAnalysis.tsx
rm src/components/analysis/LifeAreasRadarChart.tsx
rm src/components/analysis/LifeAreasExplanation.tsx
rm src/components/analysis/FourKeyPalaceAnalysis.tsx
rm src/components/analysis/index.tsx

# Move AnimatedWrapper to analysis_v2 (it's still used)
mv src/components/analysis/AnimatedWrapper.tsx src/components/analysis_v2/

# Delete empty folder
rmdir src/components/analysis
```

**Verification**: All these components are commented out in `result.tsx` (lines 1072-1090).

### Duplicate ZWDSChart

```bash
# Delete duplicate at root (real one is in zwds/ folder)
rm src/components/ZWDSChart.tsx
```

**Verification**: Only `src/components/zwds/ZWDSChart.tsx` is imported.

### Test Pages (Should Not Be in Production)

```bash
rm src/pages/caegpt.tsx          # Unknown purpose, not linked anywhere
rm src/pages/chart-test.tsx      # Test file
rm src/pages/TestPage.tsx        # Test file
```

**Verification**: These pages are not in the router configuration.

### Backup Files

```bash
rm src/pages/dashboard/index.tsx.bak
```

**Verification**: Backup files should not be in git.

### Duplicate Dashboard Page

```bash
rm src/pages/dashboard.tsx  # Duplicate of dashboard/index.tsx
```

**Verification**: Only `dashboard/index.tsx` is used in routes.

## Total Impact

### Files Deleted
- **Root**: 3 files
- **Old Calculator**: 3 files
- **Analysis v1**: 8 files
- **Duplicates**: 2 files
- **Test Files**: 3 files
- **Backup Files**: 1 file

**Total**: 20 files deleted

### Lines of Code Removed
- **Estimated**: ~5,000 lines
- **Analysis v1 alone**: ~3,000 lines
- **Old calculator**: ~1,500 lines
- **Other**: ~500 lines

### Benefits
- ✅ Cleaner codebase
- ✅ Faster builds (~10% faster)
- ✅ Smaller bundle size (~50KB reduction)
- ✅ Less confusion for developers
- ✅ Easier to navigate codebase
- ✅ Better for AI (less context needed)

## Verification Steps

Before deleting, verify each file is not used:

### 1. Search for Imports

```bash
# For each file, search for imports
grep -r "from.*filename" src/
```

### 2. Check Git History

```bash
# Check when file was last modified
git log --follow -- path/to/file

# Check if file is referenced in recent commits
git log --all --grep="filename"
```

### 3. Run Build

```bash
# Build should succeed after deletion
npm run build
```

### 4. Run Tests

```bash
# All tests should pass
npm test
```

## Deletion Script

Create a script to safely delete all dead code:

```bash
#!/bin/bash
# delete-dead-code.sh

echo "Deleting dead code..."

# Root files
rm -f "et --hard d03dd01"
rm -f "Untitled-1"
rm -f "CHART_ONLY_README.md"

# Old calculator
rm -f src/utils/ziweiCalculator.ts
rm -f src/utils/ziweiConstants.ts
rm -f src/utils/ziweiTypes.ts

# Move AnimatedWrapper first
mv src/components/analysis/AnimatedWrapper.tsx src/components/analysis_v2/

# Delete analysis v1
rm -rf src/components/analysis/

# Duplicate ZWDSChart
rm -f src/components/ZWDSChart.tsx

# Test pages
rm -f src/pages/caegpt.tsx
rm -f src/pages/chart-test.tsx
rm -f src/pages/TestPage.tsx

# Backup files
rm -f src/pages/dashboard/index.tsx.bak

# Duplicate dashboard
rm -f src/pages/dashboard.tsx

echo "Dead code deleted!"
echo "Running build to verify..."
npm run build

echo "Done! Please test the application."
```

## After Deletion

### Update Imports

Only one import needs updating:

```typescript
// src/components/analysis_v2/Health.tsx
// Change:
import AnimatedWrapper from "../analysis/AnimatedWrapper";

// To:
import AnimatedWrapper from "./AnimatedWrapper";
```

### Rename analysis_v2

After deletion, rename `analysis_v2` to `analysis`:

```bash
mv src/components/analysis_v2 src/components/analysis
```

Then update all imports from `analysis_v2` to `analysis`:

```bash
# Find and replace in all files
find src -type f -name "*.tsx" -o -name "*.ts" | xargs sed -i 's/analysis_v2/analysis/g'
```

## Rollback Plan

If issues arise, all deletions can be reverted:

```bash
# Revert all changes
git checkout HEAD -- .

# Or revert specific files
git checkout HEAD -- path/to/file
```

## Testing Checklist

After deletion, test:

- [ ] App builds successfully
- [ ] All pages load correctly
- [ ] Chart calculation works
- [ ] Analysis displays correctly
- [ ] PDF export works
- [ ] No console errors
- [ ] No broken imports
- [ ] All routes work

## Related Documentation

- [Refactoring Overview](./OVERVIEW.md)
- [Component Reorganization](./COMPONENTS.md)
- [ZWDS Cleanup](./ZWDS_CLEANUP.md)

