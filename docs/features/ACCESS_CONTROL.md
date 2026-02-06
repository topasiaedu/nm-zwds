# Access Control System

## Overview

This document describes the access control architecture for the ZWDS application, including authentication, authorization, feature flags, and tier management.

**Last Updated:** February 2026

---

## Architecture

```
User Authentication (Supabase Auth)
         ↓
User Details (user_details table)
         ↓
Feature Flags (JSONB column)
         ↓
Access Control (TierContext + useTierAccess)
         ↓
Protected Routes & Components
```

---

## Components

### **1. Authentication Layer**

**Provider:** `AuthProvider` (`src/context/AuthContext.tsx`)

**Responsibilities:**
- User sign in/up
- Session management
- Password reset
- User metadata

**Key Functions:**
```typescript
const { user, signIn, signUp, signOut } = useAuth();
```

---

### **2. Tier & Feature Management**

**Provider:** `TierProvider` (`src/context/TierContext.tsx`)

**Responsibilities:**
- Load user details from `user_details` table
- Manage feature flags
- Provide access check functions
- Admin operations (change tiers, pause users)
- Real-time subscription for tier changes

**Key Functions:**
```typescript
const {
  tier,              // User's tier label
  isAdmin,           // Admin check
  featureFlags,      // All feature flags
  hasFeature,        // Check specific feature
  updateFeatureFlags,
  applyProgramTemplate,
} = useTierContext();
```

**Access Hook:**
```typescript
const {
  hasFullAnalysis,
  hasAIAssistant,
  hasFounderReport,
  hasExperimentalCharts,
  // ... etc
} = useTierAccess();
```

---

### **3. Route Protection**

#### **ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

Handles basic authentication and membership status:
- Redirects unauthenticated users to sign-in
- Checks if membership is paused → redirect to `/membership-paused`
- Checks if membership expired → redirect to `/membership-expired`

**Usage:**
```typescript
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

#### **TierProtectedRoute** (`src/components/TierProtectedRoute.tsx`)

**Status:** ⚠️ Currently DEFINED but NOT USED

Provides granular tier-based protection with props:
- `requiredTier` - Minimum tier required
- `requiresDestinyNavigator` - Requires Destiny Navigator access
- `requiresAnalytics` - Requires analytics access
- `adminOnly` - Admin-only access

**Planned Usage (After Feature Flags Implementation):**
```typescript
<Route
  path="/founder-report"
  element={
    <TierProtectedRoute requiresFeature="hasFounderReport">
      <FounderReport />
    </TierProtectedRoute>
  }
/>
```

---

### **4. Component-Level Access Control**

Features can be conditionally shown in components:

**Example - Dashboard Links:**
```typescript
// Show AI Assistant link to tier2+ users
{hasAIAssistant && (
  <Link to="/destiny-wealth-navigator">
    AI Wealth Navigator
  </Link>
)}

// Show Founder Report to users with access
{hasFounderReport && (
  <Link to="/founder-report">
    Founder Report
  </Link>
)}

// Show admin panel to admins
{isAdmin && (
  <Link to="/admin/users">
    User Management
  </Link>
)}
```

**Example - Feature Sections:**
```typescript
// In result page - show analysis if user has access
{hasFullAnalysis && (
  <div className="analysis-section">
    {/* Analysis components */}
  </div>
)}
```

---

## Current Access Matrix

### **What's Currently Tier-Gated (Pre-Feature Flags)**

| Feature | Where Checked | Access Level |
|---------|---------------|--------------|
| **AI Chat Assistant** | `dashboard/index.tsx:290` | `hasDestinyNavigatorAccess` (tier2+) |
| **Analysis Sections** | `result.tsx:1072` | `hasAnalyticsAccess` (tier2+) |
| **PDF with Analysis** | `result.tsx:498` | `hasAnalyticsAccess` (tier2+) |
| **Founder Report** | `founder-report.tsx:645` | `isAdmin` only |
| **Destiny Navigator** | `destiny-navigator.tsx:52` | `isAdmin` only |
| **User Management** | `admin/user-management.tsx:270` | `isAdmin` only |
| **Numerology Analytics** | Dashboard link | `isAdmin` only |
| **Tier3 Experimental** | App.tsx routing | `tier === "tier3"` or `isAdmin` |
| **Hour Adjustment** | `result.tsx:832` | `isAdmin` only |

---

## Post-Feature Flags Access Matrix

### **After Feature Flags Implementation**

| Feature | New Check | tier1 | tier2 | founder | beta | admin |
|---------|-----------|-------|-------|---------|------|-------|
| **AI Chat** | `hasAIAssistant` | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Full Analysis** | `hasFullAnalysis` | ❌ | ✅ | ✅ | ✅ | ✅ |
| **Destiny Navigator** | `hasDestinyNavigatorTool` | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Founder Report** | `hasFounderReport` | ❌ | ❌ | ✅ | ✅ | ✅ |
| **Experimental Charts** | `hasExperimentalCharts` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **Hour Adjustment** | `hasHourAdjustment` | ❌ | ❌ | ❌ | ✅ | ✅ |
| **User Management** | `hasUserManagement` | ❌ | ❌ | ❌ | ❌ | ✅ |
| **Manage Tiers** | `canManageUserTiers` | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## Naming Migration

### **Old Names (Deprecated)**

```typescript
// ❌ Confusing names
hasDestinyNavigatorAccess  // Actually means "AI Assistant" not "Destiny Navigator"
hasAnalyticsAccess         // Vague - what analytics?
isTier2OrHigher           // Assumes hierarchy
```

### **New Names (Clear)**

```typescript
// ✅ Clear, specific names
hasAIAssistant            // AI Wealth Navigator chat
hasFullAnalysis           // Analysis sections in charts
hasDestinyNavigatorTool   // Destiny Navigator standalone tool
hasFounderReport          // Founder Report access
hasExperimentalCharts     // Experimental features
```

### **Migration Strategy**

**Phase 1:** Keep both names (backward compatible)
```typescript
export function useTierAccess() {
  return {
    // NEW (preferred)
    hasAIAssistant: hasFeature("hasAIAssistant"),
    hasFullAnalysis: hasFeature("hasFullAnalysis"),
    
    // OLD (deprecated, for backward compatibility)
    hasDestinyNavigatorAccess: hasFeature("hasAIAssistant"),
    hasAnalyticsAccess: hasFeature("hasFullAnalysis"),
  };
}
```

**Phase 2:** Update all references in codebase

**Phase 3:** Remove deprecated names

---

## Admin Dashboard Separation

### **Problem:**
Admin features are currently mixed in the user dashboard, making it cluttered and confusing.

### **Solution:**
Create separate admin dashboard at `/admin`

**User Dashboard** (`/dashboard`):
- My Chart
- Calculate for Others
- AI Assistant (if tier2+)
- Destiny Navigator (if founder+)
- Founder Report (if founder+)
- Profile Settings

**Admin Dashboard** (`/admin`) - NEW:
- Overview & Stats
- User Management
- Numerology Analytics
- Feature Flags Management
- System Settings

**Navigation:**
- Admin badge in navbar dropdown
- "Back to User View" link in admin dashboard
- Clear separation of concerns

---

## Security Considerations

### **1. Client-Side Checks**
All current access checks are client-side only:
```typescript
// This prevents UI from showing, but doesn't prevent API access!
{hasFounderReport && <Link to="/founder-report">...</Link>}
```

### **2. Server-Side Validation (Required)**
Need to add server-side checks in API routes and Supabase RLS policies:
```sql
-- Example RLS policy
CREATE POLICY "Users can only access founder report if they have the feature"
ON founder_reports FOR SELECT
USING (
  auth.uid() = user_id 
  AND (user_details.feature_flags->>'hasFounderReport')::boolean = true
);
```

### **3. Admin Operations**
Admin operations (changing tiers, feature flags) require:
- Client-side check: `isAdmin` or `canManageUserTiers`
- Server-side check: Verify in Supabase RLS or API route
- Audit logging: Track who made changes

---

## Real-Time Updates

The TierContext subscribes to real-time changes in `user_details`:

```typescript
supabase
  .channel(`user-details-${user.id}`)
  .on('postgres_changes', {
    event: '*',
    schema: 'public',
    table: 'user_details',
    filter: `user_id=eq.${user.id}`
  }, (payload) => {
    // Update local state
    setUserDetails(payload.new);
  })
  .subscribe();
```

**Benefits:**
- Admin changes user's tier → user sees changes immediately
- Admin enables feature → user can access immediately
- No need to refresh page

---

## Testing Access Control

### **Unit Tests**
Test access functions in isolation:
```typescript
describe('useTierAccess', () => {
  it('should grant founder report access to founder tier', () => {
    const { hasFounderReport } = renderHook(() => useTierAccess(), {
      wrapper: createWrapperWithUserDetails({
        tier: 'founder',
        feature_flags: { hasFounderReport: true }
      })
    });
    
    expect(hasFounderReport).toBe(true);
  });
});
```

### **Integration Tests**
Test protected routes:
```typescript
describe('Protected Routes', () => {
  it('should redirect tier1 users from founder report', () => {
    renderWithRouter(<App />, {
      initialRoute: '/founder-report',
      user: createMockUser({ tier: 'tier1' })
    });
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });
});
```

### **Manual Testing Checklist**
- [ ] Tier1 user cannot access tier2+ features
- [ ] Tier2 user can access AI assistant and analysis
- [ ] Founder user can access founder report
- [ ] Beta user can access experimental features
- [ ] Beta user cannot access admin panel
- [ ] Admin user can access everything
- [ ] Paused user is redirected to paused page
- [ ] Expired user is redirected to expired page
- [ ] Real-time updates work when admin changes tiers

---

## Related Documentation

- [Feature Flags](./FEATURE_FLAGS.md) - Feature flag system
- [Membership Pause](../../MEMBERSHIP_PAUSE_IMPLEMENTATION_SUMMARY.md) - Pause feature
- [Security Audit](../security/SECURITY_AUDIT_2025.md) - Security considerations

---

## Future Improvements

### **1. Row-Level Security (RLS)**
Implement Supabase RLS policies for all tables that contain user data.

### **2. Rate Limiting**
Add rate limiting for:
- Profile creation
- Chart calculations
- AI assistant queries
- PDF exports

### **3. Audit Logging**
Track all admin operations:
- Who changed what
- When
- Previous and new values

### **4. Feature Usage Analytics**
Track which features are used:
- Most popular features
- Underused features
- Feature usage by tier
- Help identify what users value most
