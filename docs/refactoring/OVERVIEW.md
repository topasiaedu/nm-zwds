# Refactoring Overview

## Current Status

The NM-ZWDS project is undergoing systematic refactoring to improve code organization, maintainability, and developer experience. This document outlines the current refactoring initiatives.

## Why Refactor?

### Original Development Context
- **Rushed development**: Features were prioritized over code organization
- **Learning curve**: Developer was learning ZWDS concepts while coding
- **Naming issues**: Many files have confusing or unclear names
- **Technical debt**: Hardcoded data, duplicated code, scattered responsibilities

### Current Pain Points
1. **Hardcoded strings everywhere**: Analysis text in 100+ places
2. **Confusing file names**: `destinyCompassAnalysis`, `fourKeyPalaceAnalysis`
3. **Duplicate code**: Two analysis folders (`analysis/` and `analysis_v2/`)
4. **Dead code**: Unused files still in codebase
5. **Mixed responsibilities**: UI helpers in analysis files
6. **AI context bloat**: Large files with hardcoded data waste AI tokens

## Refactoring Initiatives

### 1. ZWDS Module Cleanup ⏳ In Progress

**Goal**: Reorganize the ZWDS calculation and analysis engine for clarity and maintainability.

**Status**: Planning complete, implementation pending

**Details**: [ZWDS_CLEANUP.md](./ZWDS_CLEANUP.md)

**Key Changes**:
- Rename `src/utils/zwds/` → `src/zwds/`
- Create clear folder structure: `core/`, `data/`, `analyzers/`, `utils/`
- Extract hardcoded data to `data/content/`
- Rename confusing files (e.g., `destinyCompassAnalysis` → `timing/cycles`)
- Remove duplicate files

**Benefits**:
- 60% reduction in AI context window usage
- Clear separation of concerns
- Easier to find and modify code
- Better for new developers

### 2. Component Reorganization ⏳ In Progress

**Goal**: Organize components by feature and remove dead code.

**Status**: Planning complete, implementation pending

**Details**: [COMPONENTS.md](./COMPONENTS.md)

**Key Changes**:
- Delete `analysis/` folder (v1 - dead code)
- Rename `analysis_v2/` → `analysis/`
- Move PDF components to `pdf/` folder
- Organize UI components by feature
- Remove duplicate `ZWDSChart.tsx`

**Benefits**:
- Removes ~3000 lines of dead code
- Clear component organization
- Easier to find components
- No more "which version?" confusion

### 3. Data Centralization 📋 Planned

**Goal**: Extract all hardcoded strings to centralized, translatable data files.

**Status**: Design phase

**Key Changes**:
- Extract career data to `src/zwds/data/content/careers.ts`
- Extract health data to `src/zwds/data/content/health.ts`
- Extract personality descriptions to `src/zwds/data/content/personalities.ts`
- Structure data with translations built-in

**Benefits**:
- Easy to add new languages
- Client can edit content via admin UI
- Single source of truth
- No more scattered strings

### 4. Dead Code Removal ⏳ In Progress

**Goal**: Remove unused files and clean up the codebase.

**Status**: Identification complete, removal pending

**Details**: [DEAD_CODE.md](./DEAD_CODE.md)

**Files to Delete**:
- `src/utils/ziweiCalculator.ts` (old calculator)
- `src/utils/ziweiConstants.ts` (old constants)
- `src/utils/ziweiTypes.ts` (old types)
- `src/components/analysis/` (v1 components - 8 files)
- `src/pages/caegpt.tsx` (unknown purpose)
- `src/pages/chart-test.tsx` (test file)
- `src/pages/TestPage.tsx` (test file)
- `Untitled-1` (root file)
- `et --hard d03dd01` (git command file)

**Benefits**:
- Cleaner codebase
- Faster builds
- Less confusion
- Smaller bundle size

### 5. Page Reorganization 📋 Planned

**Goal**: Organize pages by feature area.

**Status**: Design phase

**Key Changes**:
- Move auth pages to `pages/auth/`
- Move dashboard pages to `pages/dashboard/`
- Move chart pages to `pages/chart/`
- Move error pages to `pages/errors/`
- Rename files to PascalCase

**Benefits**:
- Consistent organization
- Easier to navigate
- Clear feature boundaries

## Refactoring Principles

### 1. No Breaking Changes
- All refactoring must maintain functionality
- Users should see no difference
- Existing features must continue to work

### 2. Incremental Approach
- Small, focused changes
- Test after each change
- Can be done over time

### 3. Documentation First
- Document the plan before implementing
- Update docs as you refactor
- Leave code better than you found it

### 4. Type Safety
- Maintain strict TypeScript
- No `any` types
- Comprehensive interfaces

### 5. Backward Compatibility
- Keep old imports working temporarily
- Add deprecation notices
- Remove old code in next major version

## Implementation Strategy

### Phase 1: Quick Wins (1-2 days)
- Delete dead code files
- Rename confusing files
- Move PDF components to folder
- Clean up root directory

### Phase 2: ZWDS Module (1 week)
- Reorganize folder structure
- Extract data to centralized files
- Update imports
- Create barrel exports

### Phase 3: Components (3-4 days)
- Remove analysis v1
- Rename analysis_v2 to analysis
- Organize UI components
- Update imports

### Phase 4: Pages (2-3 days)
- Reorganize by feature
- Rename to PascalCase
- Update routes
- Update imports

### Phase 5: Data Centralization (1 week)
- Extract all hardcoded strings
- Create translation structure
- Build admin UI for editing
- Test thoroughly

## Progress Tracking

### ✅ Completed
- [x] Comprehensive codebase analysis
- [x] Refactoring plan documentation
- [x] Dead code identification
- [x] Folder structure design

### ⏳ In Progress
- [ ] Documentation creation
- [ ] Quick wins implementation

### 📋 Planned
- [ ] ZWDS module cleanup
- [ ] Component reorganization
- [ ] Dead code removal
- [ ] Page reorganization
- [ ] Data centralization

## Testing Strategy

### Before Refactoring
1. Document current functionality
2. Take screenshots of all pages
3. Note all user flows
4. List all features

### During Refactoring
1. Test after each change
2. Check for linter errors
3. Verify imports resolve
4. Run build to check for issues

### After Refactoring
1. Full regression testing
2. Compare with screenshots
3. Test all user flows
4. Verify all features work
5. Check bundle size
6. Test in production

## Rollback Plan

### If Issues Arise
1. **Git**: All changes are in version control
2. **Branches**: Each refactoring in separate branch
3. **Commits**: Small, focused commits
4. **Revert**: Easy to revert specific changes

### Backup Strategy
1. Tag current version before refactoring
2. Keep old code commented out temporarily
3. Document what was changed
4. Keep old imports working with deprecation warnings

## Communication

### For Team Members
- Review refactoring plans before implementing
- Ask questions if anything is unclear
- Suggest improvements to the plan
- Help with testing

### For Stakeholders
- Refactoring improves code quality
- No user-facing changes
- Reduces future development time
- Makes adding features easier

## Success Metrics

### Code Quality
- [ ] Reduced file sizes (< 500 lines per file)
- [ ] Clear naming (no confusion about file purpose)
- [ ] Organized structure (easy to find code)
- [ ] No dead code (all files are used)

### Developer Experience
- [ ] Faster to find code (< 30 seconds)
- [ ] Easier to add features (clear where to add code)
- [ ] Better for AI (60% less context needed)
- [ ] Clearer documentation (comprehensive docs)

### Maintainability
- [ ] Single source of truth for data
- [ ] Easy to add translations
- [ ] Simple to update content
- [ ] Clear separation of concerns

## Related Documentation

- [ZWDS Cleanup Plan](./ZWDS_CLEANUP.md)
- [Component Reorganization](./COMPONENTS.md)
- [Dead Code List](./DEAD_CODE.md)
- [Folder Structure](../architecture/FOLDER_STRUCTURE.md)

