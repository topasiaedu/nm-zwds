# Feature Flags System - Implementation Prompts

This document contains AI agent prompts to implement the feature flags system. Tasks are broken down to fit within context windows and organized by dependencies.

**Implementation Date:** February 2026  
**Estimated Total Time:** 8-12 hours  
**Number of Tasks:** 9 tasks

---

## 📋 Task Overview

| Task | Type | Depends On | Can Run in Parallel With | Estimated Time |
|------|------|-----------|-------------------------|----------------|
| **Task 1** | Database | None | - | 30 min |
| **Task 2** | Types | Task 1 | - | 30 min |
| **Task 3** | Core Logic | Task 2 | - | 2 hours |
| **Task 4A** | UI Update | Task 3 | Task 4B, 4C, 4D | 1 hour |
| **Task 4B** | UI Update | Task 3 | Task 4A, 4C, 4D | 1 hour |
| **Task 4C** | UI Update | Task 3 | Task 4A, 4B, 4D | 1 hour |
| **Task 4D** | UI Update | Task 3 | Task 4A, 4B, 4C | 1 hour |
| **Task 5** | Admin UI | Task 3 | Task 6 | 2 hours |
| **Task 6** | Admin Dashboard | Task 3 | Task 5 | 2 hours |
| **Task 7** | Migration | Task 1, 2, 3 | - | 30 min |
| **Task 8** | Testing | All above | - | 1 hour |
| **Task 9** | Cleanup | Task 8 | - | 1 hour |

### Execution Strategy:
1. **Sequential:** Tasks 1 → 2 → 3
2. **Parallel Phase 1:** Tasks 4A, 4B, 4C, 4D (can all run simultaneously)
3. **Parallel Phase 2:** Tasks 5, 6 (can run simultaneously)
4. **Sequential:** Tasks 7 → 8 → 9

---

## Task 1: Database Migration

**Type:** Database Schema  
**Dependencies:** None  
**Can Run in Parallel With:** None  
**Files to Create:** `database_migration_feature_flags.sql`

### Prompt:

```
Create a database migration file for the feature flags system.

REQUIREMENTS:
1. Add a `feature_flags` JSONB column to the `user_details` table
   - Default value: empty object '{}'
   - Nullable: false (use default empty object)

2. Create a GIN index on the `feature_flags` column for better query performance

3. Update the tier constraint to include new tier values:
   - Keep existing: 'tier1', 'tier2', 'admin'
   - Add new: 'founder', 'beta'

4. Add comments explaining each step

5. Include rollback instructions at the end

FILE STRUCTURE:
- Create: `database_migration_feature_flags.sql` in the project root

VALIDATION:
- Test that the migration can be applied to a fresh database
- Test that the migration can be rolled back
- Verify the GIN index is created successfully

REFERENCE FILES:
- Existing migration: `database_migration_pause_feature.sql`
- Database types: `database.types.ts`
```

---

## Task 2: TypeScript Types

**Type:** Type Definitions  
**Dependencies:** Task 1 (conceptual, but can start immediately)  
**Can Run in Parallel With:** None  
**Files to Modify:** `database.types.ts`, Create `src/types/features.ts`

### Prompt:

```
Update TypeScript types to support the feature flags system.

REQUIREMENTS:

1. Update `database.types.ts`:
   - Add `feature_flags` field to `user_details` table Row/Insert/Update types
   - Type should be: `FeatureFlags | null`

2. Create `src/types/features.ts` with:
   
   a) `FeatureKey` type - union of all feature flag keys:
      - User features: hasFullAnalysis, hasPDFWithAnalysis, hasAIAssistant, 
        hasDestinyNavigatorTool, hasFounderReport, hasExperimentalCharts, 
        hasHourAdjustment, hasUnlimitedProfiles
      - Admin features: hasUserManagement, hasNumerologyAnalytics, hasSystemSettings,
        canManageUserTiers, canManageFeatureFlags, canPauseUsers
   
   b) `FeatureFlags` type - Partial<Record<FeatureKey, boolean>>
   
   c) `PROGRAM_TEMPLATES` constant - feature flag presets for each tier:
      - tier1: all false
      - tier2: hasFullAnalysis, hasPDFWithAnalysis, hasAIAssistant, hasUnlimitedProfiles
      - founder: tier2 + hasDestinyNavigatorTool, hasFounderReport
      - beta: all user features, no admin features
      - admin: all features true
   
   d) `FEATURE_DESCRIPTIONS` constant - human-readable descriptions for each feature
   
   e) `PROGRAM_INFO` constant - display names, descriptions, colors, icons for each program

3. Add JSDoc comments for all types and constants

4. Export all types and constants

FILES TO MODIFY:
- `database.types.ts` - add feature_flags field to user_details
FILES TO CREATE:
- `src/types/features.ts` - all feature flag types and constants

REFERENCE:
- See `docs/features/FEATURE_FLAGS.md` for complete feature definitions
- Follow existing type patterns in `database.types.ts`
- Use strict TypeScript (no 'any' types)
```

---

## Task 3: Core TierContext Logic

**Type:** Context/Logic  
**Dependencies:** Task 2  
**Can Run in Parallel With:** None  
**Files to Modify:** `src/context/TierContext.tsx`

### Prompt:

```
Update the TierContext to support feature flags.

REQUIREMENTS:

1. Import types from `src/types/features.ts`

2. Update `TierContextProps` interface:
   - Add: `featureFlags: FeatureFlags`
   - Add: `hasFeature: (feature: FeatureKey) => boolean`
   - Add: `updateFeatureFlags: (userId: string, flags: FeatureFlags) => Promise<boolean>`
   - Add: `applyProgramTemplate: (userId: string, programKey: string) => Promise<boolean>`
   - Keep all existing fields for backward compatibility

3. In `TierProvider`:
   - Extract `featureFlags` from `userDetails?.feature_flags || {}`
   - Implement `hasFeature()`:
     * Admin (tier === 'admin') always returns true
     * Otherwise check if flag exists and is true in featureFlags
   - Implement `updateFeatureFlags()`:
     * Admin-only function
     * Update user's feature_flags in database
     * Return true on success, false on failure
   - Implement `applyProgramTemplate()`:
     * Get template from PROGRAM_TEMPLATES
     * Call updateFeatureFlags with template
     * Return result

4. Update `useTierAccess()` hook:
   - Add new helpers (preferred names):
     * hasFullAnalysis: hasFeature("hasFullAnalysis")
     * hasAIAssistant: hasFeature("hasAIAssistant")
     * hasDestinyNavigatorTool: hasFeature("hasDestinyNavigatorTool")
     * hasFounderReport: hasFeature("hasFounderReport")
     * hasExperimentalCharts: hasFeature("hasExperimentalCharts")
     * hasHourAdjustment: hasFeature("hasHourAdjustment")
     * hasUserManagement: hasFeature("hasUserManagement")
     * hasNumerologyAnalytics: hasFeature("hasNumerologyAnalytics")
     * canManageUserTiers: hasFeature("canManageUserTiers")
     * canManageFeatureFlags: hasFeature("canManageFeatureFlags")
   - Keep deprecated names for backward compatibility:
     * hasAnalyticsAccess: hasFeature("hasFullAnalysis")
     * hasDestinyNavigatorAccess: hasFeature("hasAIAssistant")
   - Add generic hasFeature function
   - Add featureFlags object

5. Add comments marking deprecated fields

6. Follow existing code style and patterns

FILES TO MODIFY:
- `src/context/TierContext.tsx`

VALIDATION:
- No TypeScript errors
- Backward compatibility maintained
- Admin always has access to all features
- Non-admin users respect feature flags

REFERENCE:
- See `docs/features/FEATURE_FLAGS.md` for logic details
- Existing pattern in TierContext for updateUserTier and toggleUserPause
```

---

## Task 4A: Update Result Page Access Checks

**Type:** UI Update  
**Dependencies:** Task 3  
**Can Run in Parallel With:** Tasks 4B, 4C, 4D  
**Files to Modify:** `src/pages/result.tsx`

### Prompt:

```
Update the result page to use new feature flag names.

REQUIREMENTS:

1. Update imports:
   - Import new hooks from useTierAccess

2. Update access checks:
   - Replace `hasAnalyticsAccess` with `hasFullAnalysis`
   - Keep using `isAdmin` for admin-only features (hour adjustment)
   - Update dependency arrays if needed

3. Specific changes:
   - Line ~95: Change destructure to use `hasFullAnalysis` instead of `hasAnalyticsAccess`
   - Line ~498: Change `includeAnalysis: hasAnalyticsAccess` to `includeAnalysis: hasFullAnalysis`
   - Line ~518: Update dependency array
   - Line ~832: Keep `isAdmin` check (this is for hour adjustment debug controls)
   - Line ~1025: Keep `isAdmin` check (for Destiny Navigator button)
   - Line ~1072: Change `hasAnalyticsAccess` to `hasFullAnalysis`
   - Line ~1091: Change `hasAnalyticsAccess` to `hasFullAnalysis`

4. Test the page still works correctly

FILES TO MODIFY:
- `src/pages/result.tsx`

VALIDATION:
- No TypeScript errors
- No runtime errors
- Analysis sections show/hide correctly based on feature flag
- PDF export includes/excludes analysis correctly
- Run linter and fix any issues

NOTE: This can be done in parallel with Tasks 4B, 4C, 4D
```

---

## Task 4B: Update Dashboard Access Checks

**Type:** UI Update  
**Dependencies:** Task 3  
**Can Run in Parallel With:** Tasks 4A, 4C, 4D  
**Files to Modify:** `src/pages/dashboard/index.tsx`

### Prompt:

```
Update the dashboard to use new feature flag names and remove admin clutter.

REQUIREMENTS:

1. Update imports:
   - Import new hooks from useTierAccess

2. Update access checks:
   - Line ~20: Change `hasDestinyNavigatorAccess` to `hasAIAssistant`
   - Line ~290: Change `hasDestinyNavigatorAccess` to `hasAIAssistant` (for AI chat link)

3. Remove admin-only sections (these will move to admin dashboard):
   - Line ~108-131: Remove "Experimental Chart" link (isAdmin check)
   - Line ~133-156: Remove "Destiny Navigator" link (isAdmin check)
   - Line ~158-184: Remove "Founder Report" link (isAdmin check)
   - Line ~336-383: Remove "Admin Management" link (isAdmin check)
   - Line ~387-433: Remove "Numerology Analytics" link (isAdmin check)

4. Keep user-facing sections:
   - "My Chart" link
   - "Calculate for Others" link
   - "Destiny Wealth Navigator AI Assistant" link (hasAIAssistant check)

5. Adjust grid/layout if needed after removals

FILES TO MODIFY:
- `src/pages/dashboard/index.tsx`

VALIDATION:
- No TypeScript errors
- Dashboard looks clean without admin clutter
- Regular users see appropriate features
- AI assistant link shows for tier2+ users
- Run linter and fix any issues

NOTE: This can be done in parallel with Tasks 4A, 4C, 4D
```

---

## Task 4C: Update Founder Report Access

**Type:** UI Update  
**Dependencies:** Task 3  
**Can Run in Parallel With:** Tasks 4A, 4B, 4D  
**Files to Modify:** `src/pages/founder-report.tsx`

### Prompt:

```
Update the Founder Report page to use feature flags instead of admin-only check.

REQUIREMENTS:

1. Update imports:
   - Import `hasFounderReport` from useTierAccess

2. Update access checks:
   - Line ~219: Change from `const { isAdmin } = useTierAccess()` 
     to `const { hasFounderReport } = useTierAccess()`
   - Line ~288: Change `if (!isAdmin)` to `if (!hasFounderReport)`
   - Line ~360: Update dependency array from `[isAdmin, ...]` to `[hasFounderReport, ...]`
   - Line ~645: Change `if (!isAdmin)` to `if (!hasFounderReport)`

3. Update error messages:
   - Change "Admin-only page" messages to "Founder Report access required"

FILES TO MODIFY:
- `src/pages/founder-report.tsx`

VALIDATION:
- No TypeScript errors
- Founder report is accessible to users with hasFounderReport flag
- Non-authorized users are redirected to dashboard
- Run linter and fix any issues

NOTE: This can be done in parallel with Tasks 4A, 4B, 4D
```

---

## Task 4D: Update Destiny Navigator Access

**Type:** UI Update  
**Dependencies:** Task 3  
**Can Run in Parallel With:** Tasks 4A, 4B, 4C  
**Files to Modify:** `src/pages/destiny-navigator.tsx`

### Prompt:

```
Update the Destiny Navigator page to use feature flags instead of admin-only check.

REQUIREMENTS:

1. Update imports:
   - Import `hasDestinyNavigatorTool` from useTierAccess

2. Update access checks:
   - Line ~26: Change from `const { isAdmin } = useTierAccess()` 
     to `const { hasDestinyNavigatorTool } = useTierAccess()`
   - Line ~52: Change `if (!isAdmin)` to `if (!hasDestinyNavigatorTool)`

3. Update error messages:
   - Change "This page is available to Admin users" 
     to "Destiny Navigator access required"

FILES TO MODIFY:
- `src/pages/destiny-navigator.tsx`

VALIDATION:
- No TypeScript errors
- Destiny Navigator is accessible to users with hasDestinyNavigatorTool flag
- Non-authorized users see access restricted message
- Run linter and fix any issues

NOTE: This can be done in parallel with Tasks 4A, 4B, 4C
```

---

## Task 5: Feature Flags Management UI

**Type:** Admin UI Component  
**Dependencies:** Task 3  
**Can Run in Parallel With:** Task 6  
**Files to Create:** `src/components/admin/FeatureFlagsManager.tsx`

### Prompt:

```
Create a feature flags management component for the admin user management page.

REQUIREMENTS:

1. Create a new component `FeatureFlagsManager`:
   - Props: `userId: string`, `currentFlags: FeatureFlags`, `onSave: (flags: FeatureFlags) => Promise<void>`, `onClose: () => void`
   
2. Component features:
   - Modal/dialog interface
   - Two sections: "User Features" and "Admin Features"
   - Each feature as a checkbox with name and description
   - Quick apply buttons for program templates (DYD, Founder, Beta, Admin)
   - "Select All User Features" button
   - "Clear All" button
   - Save and Cancel buttons
   
3. Layout:
   - Use existing Flowbite/Tailwind styles matching the app
   - Responsive design
   - Dark mode support
   - Loading state during save
   - Success/error feedback

4. Logic:
   - Local state for editing
   - Apply template → merge with current flags
   - Individual toggle → update specific flag
   - Save → call onSave prop
   - Cancel → call onClose without saving

5. Use feature info from `src/types/features.ts`:
   - Import FEATURE_DESCRIPTIONS
   - Import PROGRAM_TEMPLATES
   - Import PROGRAM_INFO

FILES TO CREATE:
- `src/components/admin/FeatureFlagsManager.tsx`

VALIDATION:
- Component renders correctly
- All checkboxes work
- Template buttons work
- Save/cancel work correctly
- Follows existing UI patterns
- No TypeScript errors

REFERENCE:
- Existing modal: `src/components/ChartSettingsModal.tsx`
- Existing admin UI: `src/pages/admin/user-management.tsx`

NOTE: This can be done in parallel with Task 6
```

---

## Task 6: Admin Dashboard Page

**Type:** New Page  
**Dependencies:** Task 3  
**Can Run in Parallel With:** Task 5  
**Files to Create:** `src/pages/admin/dashboard.tsx`, Modify `src/App.tsx`, `src/components/navbar.tsx`

### Prompt:

```
Create a dedicated admin dashboard page separate from the user dashboard.

REQUIREMENTS:

1. Create `src/pages/admin/dashboard.tsx`:
   - Admin-only page with access check
   - Header with "Admin Dashboard" title and back to user view link
   - Stats overview section (cards with counts):
     * Total users
     * Tier1 users count
     * Tier2 users count
     * Founder users count
     * Beta users count
     * Admin users count
     * Paused users count
   - Action grid with cards:
     * User Management → /admin/users
     * Numerology Analytics → /admin/numerology-analytics
     * Feature Flags (coming soon - disabled)
     * System Settings (coming soon - disabled)
   - Use gradient backgrounds and icons matching existing design
   - Dark mode support
   - Responsive layout

2. Update `src/App.tsx`:
   - Add route: `/admin` → AdminDashboard component
   - Wrap in ProtectedRoute
   - Import the new dashboard

3. Update `src/components/navbar.tsx`:
   - Add admin dashboard link in user dropdown menu
   - Only show if `isAdmin`
   - Styled with red accent to stand out
   - Icon: shield or admin icon
   - Place before "Sign Out" option with border separator

FILES TO CREATE:
- `src/pages/admin/dashboard.tsx`

FILES TO MODIFY:
- `src/App.tsx` - add route
- `src/components/navbar.tsx` - add link

VALIDATION:
- Admin dashboard is accessible at /admin
- Non-admins are redirected
- Links work correctly
- Stats display correctly
- Follows existing UI patterns
- No TypeScript errors

REFERENCE:
- User dashboard: `src/pages/dashboard/index.tsx`
- Admin user management: `src/pages/admin/user-management.tsx`
- Navbar: `src/components/navbar.tsx`

NOTE: This can be done in parallel with Task 5
```

---

## Task 7: Data Migration Script

**Type:** Migration  
**Dependencies:** Tasks 1, 2, 3  
**Can Run in Parallel With:** None  
**Files to Create:** `scripts/migrate-user-feature-flags.ts`

### Prompt:

```
Create a data migration script to populate feature flags for existing users.

REQUIREMENTS:

1. Create Node.js script `scripts/migrate-user-feature-flags.ts`:
   - Connect to Supabase
   - Read all users from user_details table
   - For each user:
     * If tier === 'tier1': set empty feature flags (or tier1 template)
     * If tier === 'tier2': set tier2 template flags
     * If tier === 'admin': set admin template flags
     * If tier === 'tier3': set beta template flags (repurpose tier3 as beta)
   - Update user_details with new feature_flags
   - Log progress (count of users processed)
   - Handle errors gracefully

2. Script features:
   - Dry run mode (--dry-run flag to preview changes)
   - Verbose logging
   - Error handling and rollback on failure
   - Summary at end (X users migrated, Y errors)

3. Add npm script to package.json:
   - `"migrate:feature-flags": "tsx scripts/migrate-user-feature-flags.ts"`
   - `"migrate:feature-flags:dry": "tsx scripts/migrate-user-feature-flags.ts --dry-run"`

FILES TO CREATE:
- `scripts/migrate-user-feature-flags.ts`

FILES TO MODIFY:
- `package.json` - add npm scripts

VALIDATION:
- Dry run shows correct migrations
- Actual run updates database correctly
- No users are broken by migration
- All tiers get appropriate features

REFERENCE:
- Supabase client: `src/utils/supabase-client.ts`
- Program templates: `src/types/features.ts`

SAFETY:
- Test on dev database first
- Create database backup before running
- Use transactions if possible
```

---

## Task 8: Integration Testing

**Type:** Testing  
**Dependencies:** All above tasks  
**Can Run in Parallel With:** None  
**Files to Create:** Test checklist and test any critical paths

### Prompt:

```
Perform integration testing of the feature flags system.

REQUIREMENTS:

1. Manual test checklist (document results):
   
   **Authentication & Access:**
   - [ ] Tier1 user cannot see tier2+ features
   - [ ] Tier1 user cannot access /founder-report
   - [ ] Tier1 user cannot access /destiny-navigator
   - [ ] Tier1 user cannot access /admin
   
   **Tier2 (DYD) Access:**
   - [ ] Tier2 user sees AI assistant link
   - [ ] Tier2 user sees analysis sections in charts
   - [ ] Tier2 user PDF exports include analysis
   - [ ] Tier2 user cannot access founder report
   - [ ] Tier2 user cannot access admin panel
   
   **Founder Program Access:**
   - [ ] Founder user has all tier2 features
   - [ ] Founder user can access /founder-report
   - [ ] Founder user can access /destiny-navigator
   - [ ] Founder user cannot access admin panel
   
   **Beta Access:**
   - [ ] Beta user has all user-facing features
   - [ ] Beta user can access experimental charts
   - [ ] Beta user sees hour adjustment controls
   - [ ] Beta user cannot access admin panel
   
   **Admin Access:**
   - [ ] Admin user can access everything
   - [ ] Admin user sees /admin dashboard link
   - [ ] Admin dashboard shows all cards
   - [ ] Admin can manage user tiers
   - [ ] Admin can manage feature flags
   
   **Feature Flags Management:**
   - [ ] Admin can open feature flags manager
   - [ ] Individual toggles work
   - [ ] Program templates apply correctly
   - [ ] Save updates database
   - [ ] User sees changes in real-time
   
   **Dashboard:**
   - [ ] User dashboard is clean (no admin links)
   - [ ] Admin dashboard is separate
   - [ ] Back to user view link works
   - [ ] All stats display correctly

2. Test tier/feature changes:
   - Change user from tier1 to tier2 → features appear
   - Change user from tier2 to founder → new features appear
   - Disable specific feature → feature disappears
   - Enable experimental flag → experimental features appear

3. Test edge cases:
   - User with custom feature combination (not a standard program)
   - User with paused membership
   - User with expired membership
   - User with no feature flags (should default to tier1)

4. Browser testing:
   - Test in Chrome
   - Test in Safari (if available)
   - Test in Firefox (if available)
   - Test responsive design (mobile view)

5. Document any bugs found in a BUGS.md file

FILES TO CREATE:
- `TESTING_RESULTS.md` - document test results
- `BUGS.md` - document any bugs found (if any)

VALIDATION:
- All critical paths work
- No console errors
- No TypeScript errors
- No accessibility issues
- Performance is acceptable
```

---

## Task 9: Cleanup and Documentation

**Type:** Cleanup  
**Dependencies:** Task 8  
**Can Run in Parallel With:** None  
**Files to Modify:** Multiple files, update docs

### Prompt:

```
Clean up deprecated code and finalize documentation.

REQUIREMENTS:

1. Remove deprecated code:
   - Find all uses of `hasAnalyticsAccess` and verify they're updated
   - Find all uses of `hasDestinyNavigatorAccess` and verify they're updated
   - Find all uses of `isTier2OrHigher` and verify they're still needed
   - Remove deprecated exports from useTierAccess (if no longer needed)
   - Remove tier3 redirect logic (or repurpose as beta)
   - Update any comments that reference old system

2. Clean up unused code:
   - Check if TierProtectedRoute component is used anywhere
   - If not, either remove it or update it to use feature flags
   - Remove any console.logs added during development
   - Remove any commented-out code

3. Update documentation:
   - Update `docs/INDEX.md` to include feature flags docs
   - Update `README.md` if needed
   - Update `CHANGELOG.md` with new features
   - Add migration notes

4. Code quality:
   - Run linter on all modified files
   - Fix any linting issues
   - Run TypeScript compiler
   - Fix any type errors
   - Format all code consistently

5. Git:
   - Review all changes
   - Create meaningful commit messages
   - Prepare for PR/review

FILES TO REVIEW:
- All files modified in previous tasks
- Documentation files

FILES TO UPDATE:
- `docs/INDEX.md`
- `docs/CHANGELOG.md`
- `README.md` (if applicable)

VALIDATION:
- No TypeScript errors
- No linting errors
- All tests pass
- Documentation is complete and accurate
- Code is clean and consistent

FINAL CHECKLIST:
- [ ] All deprecated code removed or marked
- [ ] All documentation updated
- [ ] No console errors in browser
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Code is formatted
- [ ] Meaningful commit messages
- [ ] Ready for review
```

---

## 🚀 Execution Plan

### **Phase 1: Foundation (Sequential)**
Run these in order:
1. Task 1: Database Migration (30 min)
2. Task 2: TypeScript Types (30 min)
3. Task 3: Core TierContext Logic (2 hours)

**Total Phase 1:** ~3 hours

---

### **Phase 2: UI Updates (Parallel)**
Run these simultaneously in separate terminals/agents:
- Task 4A: Update Result Page (1 hour)
- Task 4B: Update Dashboard (1 hour)
- Task 4C: Update Founder Report (1 hour)
- Task 4D: Update Destiny Navigator (1 hour)

**Total Phase 2:** ~1 hour (if parallel), 4 hours (if sequential)

---

### **Phase 3: Admin Features (Parallel)**
Run these simultaneously:
- Task 5: Feature Flags Manager Component (2 hours)
- Task 6: Admin Dashboard Page (2 hours)

**Total Phase 3:** ~2 hours (if parallel), 4 hours (if sequential)

---

### **Phase 4: Finalization (Sequential)**
Run these in order:
1. Task 7: Data Migration Script (30 min)
2. Task 8: Integration Testing (1 hour)
3. Task 9: Cleanup and Documentation (1 hour)

**Total Phase 4:** ~2.5 hours

---

### **Total Time:**
- **If fully parallel:** ~8.5 hours
- **If fully sequential:** ~15.5 hours
- **Recommended (mixed):** ~10-12 hours

---

## 📝 Notes

### **Context Window Considerations:**
- Each task is designed to fit within ~50K tokens
- Tasks include only relevant file references
- Large files are referenced but not fully quoted
- Can paste each prompt directly into AI agent

### **Testing Between Phases:**
- After Phase 1: Test that types compile
- After Phase 2: Test that UI updates work
- After Phase 3: Test admin features
- After Phase 4: Full integration test

### **Rollback Strategy:**
If something breaks:
1. Each task is isolated
2. Git commits after each task
3. Can rollback to last working state
4. Database migration has rollback instructions

### **Additional Resources:**
- Full documentation: `docs/features/FEATURE_FLAGS.md`
- Access control: `docs/features/ACCESS_CONTROL.md`
- Current codebase patterns for reference

---

## 🎯 Success Criteria

- [ ] All tasks completed without errors
- [ ] All tests pass
- [ ] Documentation is complete
- [ ] Code is clean and follows existing patterns
- [ ] No breaking changes for existing users
- [ ] Admin can manage feature flags
- [ ] Users see correct features based on flags
- [ ] Real-time updates work
- [ ] System is ready for production
