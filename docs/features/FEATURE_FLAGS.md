# Feature Flags System

## Overview

The feature flags system provides flexible, granular access control for features and programs. Unlike the previous tier-based hierarchy, feature flags allow any combination of features to be enabled for users, making it easy to create new programs and manage beta testers.

**Last Updated:** February 2026  
**Status:** ✅ Designed, 🚧 Implementation Pending

---

## Philosophy

### **Old System (Tier-Based, Hierarchical)**
```
tier1 < tier2 < admin
├── tier2 gets everything tier1 has + more
└── Inflexible, assumes hierarchy
```

### **New System (Feature-Based, Non-Hierarchical)**
```
User has explicit features: [A, C, E]
Admin has explicit features: [A, B, C, D, E, F, G]
Founder has explicit features: [A, B, C, D, E]
Beta has explicit features: [A, B, C, D, E] (no admin features)
```

**Benefits:**
- ✅ No hierarchy assumptions
- ✅ Any combination of features possible
- ✅ Easy to create new programs
- ✅ Clear what each user can access
- ✅ Beta testers get full user features without admin access

---

## Feature Definitions

### **User-Facing Features**

| Feature Key | Description | Used In |
|------------|-------------|---------|
| `hasFullAnalysis` | Analysis sections in chart/result pages | `src/pages/result.tsx` |
| `hasPDFWithAnalysis` | PDF exports include analysis components | `src/pages/result.tsx` |
| `hasAIAssistant` | AI Wealth Navigator chat assistant | `src/pages/caegpt.tsx` |
| `hasDestinyNavigatorTool` | Destiny Navigator standalone tool | `src/pages/destiny-navigator.tsx` |
| `hasFounderReport` | Founder Timing Decision System Report | `src/pages/founder-report.tsx` |
| `hasExperimentalCharts` | Tier3 experimental chart interface | `src/pages/tier3-result.tsx` |
| `hasHourAdjustment` | Hour adjustment debug controls | `src/pages/result.tsx` |
| `hasUnlimitedProfiles` | No limit on profile creation | Profile creation logic |

### **Admin-Only Features**

| Feature Key | Description | Used In |
|------------|-------------|---------|
| `hasUserManagement` | Access to user management panel | `src/pages/admin/user-management.tsx` |
| `hasNumerologyAnalytics` | Access to analytics dashboard | `src/pages/admin/numerology-analytics.tsx` |
| `hasSystemSettings` | System configuration access | Future |
| `canManageUserTiers` | Permission to change other users' tiers | User management panel |
| `canManageFeatureFlags` | Permission to edit feature flags | User management panel |
| `canPauseUsers` | Permission to pause/unpause memberships | User management panel |

---

## Program Definitions

### **1. Basic (tier1) - Free**
```typescript
{
  // All features: false
  hasUnlimitedProfiles: false,
}
```

### **2. DYD Program (tier2)**
```typescript
{
  hasFullAnalysis: true,
  hasPDFWithAnalysis: true,
  hasAIAssistant: true,
  hasUnlimitedProfiles: true,
}
```

### **3. Founder Program (founder)**
```typescript
{
  // All DYD features +
  hasFullAnalysis: true,
  hasPDFWithAnalysis: true,
  hasAIAssistant: true,
  hasDestinyNavigatorTool: true,  // ADDED
  hasFounderReport: true,          // ADDED
  hasUnlimitedProfiles: true,
}
```

### **4. Beta/Experimental (beta) - NEW**
```typescript
{
  // All user-facing features
  hasFullAnalysis: true,
  hasPDFWithAnalysis: true,
  hasAIAssistant: true,
  hasDestinyNavigatorTool: true,
  hasFounderReport: true,
  hasExperimentalCharts: true,     // EXPERIMENTAL
  hasHourAdjustment: true,         // EXPERIMENTAL
  hasUnlimitedProfiles: true,
  
  // NO admin features
  hasUserManagement: false,
  hasNumerologyAnalytics: false,
  canManageUserTiers: false,
}
```

### **5. Admin (admin)**
```typescript
{
  // All features: true
}
```

---

## Database Schema

### **Migration: Add feature_flags Column**

```sql
-- Add JSONB column for feature flags
ALTER TABLE user_details 
ADD COLUMN feature_flags JSONB DEFAULT '{}'::jsonb;

-- Create GIN index for better query performance
CREATE INDEX idx_user_details_feature_flags 
ON user_details USING gin(feature_flags);

-- Update tier constraint to include new tiers
ALTER TABLE user_details 
DROP CONSTRAINT IF EXISTS user_details_tier_check;

ALTER TABLE user_details
ADD CONSTRAINT user_details_tier_check 
CHECK (tier IN ('tier1', 'tier2', 'founder', 'beta', 'admin'));
```

### **TypeScript Types**

Update `database.types.ts`:
```typescript
user_details: {
  Row: {
    created_at: string
    id: string
    is_paused: boolean
    membership_expiration: string | null
    tier: string
    feature_flags: FeatureFlags | null  // NEW
    updated_at: string
    user_id: string
  }
}

export type FeatureFlags = {
  // User Features
  hasFullAnalysis?: boolean;
  hasPDFWithAnalysis?: boolean;
  hasAIAssistant?: boolean;
  hasDestinyNavigatorTool?: boolean;
  hasFounderReport?: boolean;
  hasExperimentalCharts?: boolean;
  hasHourAdjustment?: boolean;
  hasUnlimitedProfiles?: boolean;
  
  // Admin Features
  hasUserManagement?: boolean;
  hasNumerologyAnalytics?: boolean;
  hasSystemSettings?: boolean;
  canManageUserTiers?: boolean;
  canManageFeatureFlags?: boolean;
  canPauseUsers?: boolean;
};
```

---

## Usage in Code

### **Checking Feature Access**

```typescript
// In any component
const { hasFeature } = useTierAccess();

if (hasFeature("hasFounderReport")) {
  // Show Founder Report link
}

// Or use specific helpers
const { hasFounderReport, hasAIAssistant } = useTierAccess();
```

### **Admin UI - Applying Program Templates**

```typescript
// Quick apply a program
await applyProgramTemplate(userId, "founder");

// Custom combination
await updateFeatureFlags(userId, {
  hasFullAnalysis: true,
  hasFounderReport: true,
  hasExperimentalCharts: true,
  // Mix and match any features
});
```

---

## Migration Path

### **Phase 1: Database Setup**
1. Add `feature_flags` column
2. Migrate existing users:
   ```sql
   -- Tier2 users
   UPDATE user_details 
   SET feature_flags = '{"hasFullAnalysis": true, "hasPDFWithAnalysis": true, "hasAIAssistant": true, "hasUnlimitedProfiles": true}'::jsonb
   WHERE tier = 'tier2';
   
   -- Admin users
   UPDATE user_details 
   SET feature_flags = '{"hasFullAnalysis": true, "hasPDFWithAnalysis": true, "hasAIAssistant": true, "hasDestinyNavigatorTool": true, "hasFounderReport": true, "hasExperimentalCharts": true, "hasHourAdjustment": true, "hasUnlimitedProfiles": true, "hasUserManagement": true, "hasNumerologyAnalytics": true, "canManageUserTiers": true, "canManageFeatureFlags": true, "canPauseUsers": true}'::jsonb
   WHERE tier = 'admin';
   ```

### **Phase 2: Update TierContext**
1. Add `featureFlags` to context
2. Add `hasFeature()` function
3. Add `updateFeatureFlags()` admin function
4. Add `applyProgramTemplate()` helper
5. Update `useTierAccess()` hook

### **Phase 3: Update Access Checks**
1. Replace `hasAnalyticsAccess` → `hasFullAnalysis`
2. Replace `hasDestinyNavigatorAccess` → `hasAIAssistant`
3. Update `isAdmin` checks to use specific admin features
4. Update component access checks

### **Phase 4: Admin UI**
1. Create feature flags management interface
2. Add program template selector
3. Add individual feature toggles
4. Update user management table

### **Phase 5: Cleanup**
1. Remove deprecated fields
2. Remove tier3 redirect logic (repurpose as beta)
3. Update documentation

---

## Related Documentation

- [Access Control](./ACCESS_CONTROL.md) - Access control architecture
- [User Management](../../MEMBERSHIP_PAUSE_IMPLEMENTATION_SUMMARY.md) - User management features
- [Architecture Overview](../architecture/PROJECT_OVERVIEW.md) - Overall system architecture

---

## Future Enhancements

### **Potential Features to Add**
- `hasTeamAccounts` - Multi-user business accounts
- `hasAPIAccess` - API for integrations
- `hasCustomBranding` - White-label for enterprise
- `hasPersonalConsultation` - 1-on-1 consultation sessions
- `hasPrioritySupport` - Jump support queue
- `hasDataExport` - Export all user data
- `hasAutomatedReports` - Scheduled reports

### **Feature Usage Tracking**
Consider adding:
```typescript
feature_usage: {
  feature_key: string,
  user_id: string,
  last_used: timestamp,
  usage_count: number,
}
```

This helps identify:
- Which features are actually used
- Which programs provide the most value
- What features to deprecate or improve
