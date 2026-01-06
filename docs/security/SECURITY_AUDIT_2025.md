# Security Audit - January 2025

**Audit Date:** January 5, 2025  
**Status:** Action Required  
**Priority:** Critical

## Executive Summary

A comprehensive security audit was conducted on the NM-ZWDS application. Several critical vulnerabilities were identified that require immediate attention, particularly around database security and XSS prevention.

**Risk Level:** 🔴 **HIGH**

---

## 🔴 Critical Issues (Fix Immediately)

### 1. Missing Row Level Security (RLS) Policies

**Severity:** Critical  
**Impact:** Any authenticated user can access/modify all data in the database

**Current State:**
- ❌ No RLS policies on `profiles` table
- ❌ No RLS policies on `user_details` table
- ❌ Any user can read all profiles from all users
- ❌ Any user can modify their own tier to "admin"
- ❌ Any user can delete other users' data

**Attack Vector:**
```javascript
// A malicious user can run in browser console:
const { data } = await supabase.from('profiles').select('*');
// Returns ALL profiles from ALL users!

await supabase.from('user_details')
  .update({ tier: 'admin' })
  .eq('user_id', myUserId);
// User promotes themselves to admin!
```

**Solution:** Implement RLS policies (see Implementation section below)

**Priority:** 🔴 Fix immediately before scaling to 1000+ users

---

### 2. Hardcoded Referral Code

**Severity:** Medium  
**Impact:** Referral code validation is bypassable

**Location:** `src/context/AuthContext.tsx:173`

```typescript
if (referralCode !== "DYD2025") {
  return { error: { message: "Invalid referral code" } };
}
```

**Issue:**
- Code is visible in browser DevTools
- Anyone can find it by inspecting the source
- Provides no real security

**Solution:**
- Move validation to Supabase Edge Function
- Or use database-stored invite tokens
- Or remove if not critical for security

**Priority:** 🟡 Fix when scaling (not critical if referral is for tracking only)

---

### 3. Client-Side Only Admin Authorization

**Severity:** Critical  
**Impact:** Admin functions can be bypassed

**Location:** `src/context/TierContext.tsx:148-152`

```typescript
const updateUserTier = async (userId: string, newTier: UserTier) => {
  if (!userDetails || userDetails.tier !== "admin") {
    console.error("Unauthorized tier update attempt");
    return false;
  }
  // Direct Supabase update - no server-side check!
```

**Issue:**
- Admin check only happens in frontend
- Malicious user can modify JavaScript and bypass check
- Direct access to Supabase APIs

**Attack Vector:**
```javascript
// User modifies localStorage to set tier: "admin"
// Or modifies JavaScript to skip the check
// Then calls supabase.from('user_details').update() directly
```

**Solution:** Implement RLS policies that enforce admin-only updates

**Priority:** 🔴 Fix immediately

---

### 4. XSS Vulnerability via dangerouslySetInnerHTML

**Severity:** Medium-High  
**Impact:** Potential Cross-Site Scripting attacks

**Locations:**
- `src/components/PdfCareer.tsx:161`
- `src/components/analysis_v2/Career.tsx:139`
- `src/components/analysis_v2/FourKeyPalace.tsx:199`

**Current Code:**
```typescript
<div dangerouslySetInnerHTML={{ __html: paragraph }} />
```

**Issue:**
- If `paragraph` contains user input, XSS is possible
- No sanitization applied

**Solution:** Use DOMPurify to sanitize HTML

```typescript
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }} />
```

**Priority:** 🟡 Fix before launch to larger audience

---

## 🟡 Medium Priority Issues

### 5. Missing Security Headers

**Impact:** Reduced defense against common attacks

**Missing Headers:**
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

**Solution:** Create `vercel.json` with security headers (see Implementation)

**Priority:** 🟡 Fix during next security sprint

---

### 6. Outdated Dependencies

**Impact:** Known security vulnerabilities

**Vulnerable Packages:**
- `react-scripts@5.0.1` - Multiple CVEs, no longer maintained
- `axios@1.6.8` - Update to 1.7.9+
- `postcss@8.4.12` - Very old, known vulnerabilities

**Solution:**
```bash
npm audit
npm install axios@latest postcss@latest
npm uninstall axios  # Not actually used
```

**Priority:** 🟡 Fix monthly as part of maintenance

---

### 7. No Password Strength Requirements

**Impact:** Weak passwords possible

**Current State:**
- No client-side validation
- Relying only on Supabase defaults

**Solution:** Add password validation

```typescript
const validatePassword = (password: string): string | null => {
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) return "Password must contain uppercase letter";
  if (!/[a-z]/.test(password)) return "Password must contain lowercase letter";
  if (!/[0-9]/.test(password)) return "Password must contain a number";
  return null;
};
```

**Priority:** 🟢 Nice to have

---

## ✅ Good Security Practices Already in Place

- ✅ Environment variables properly gitignored
- ✅ Using Supabase anon key (public key)
- ✅ No service role key in frontend
- ✅ HTTPS enforced by Vercel
- ✅ Auth sessions properly managed
- ✅ Password reset flow secure

---

## 🛠️ Implementation Guide

### Step 1: Implement RLS Policies (Critical - 1 hour)

```sql
-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_details ENABLE ROW LEVEL SECURITY;

-- PROFILES TABLE POLICIES
-- Users can only SELECT their own profiles, admins can see all
CREATE POLICY "profiles_select_policy" ON profiles
  FOR SELECT USING (
    auth.uid() = user_id 
    OR 
    EXISTS (
      SELECT 1 FROM user_details 
      WHERE user_id = auth.uid() 
      AND tier = 'admin'
    )
  );

-- Users can only INSERT their own profiles
CREATE POLICY "profiles_insert_policy" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only UPDATE their own profiles, admins can update all
CREATE POLICY "profiles_update_policy" ON profiles
  FOR UPDATE USING (
    auth.uid() = user_id
    OR 
    EXISTS (
      SELECT 1 FROM user_details 
      WHERE user_id = auth.uid() 
      AND tier = 'admin'
    )
  );

-- Users can only DELETE their own profiles, admins can delete all
CREATE POLICY "profiles_delete_policy" ON profiles
  FOR DELETE USING (
    auth.uid() = user_id
    OR 
    EXISTS (
      SELECT 1 FROM user_details 
      WHERE user_id = auth.uid() 
      AND tier = 'admin'
    )
  );

-- USER_DETAILS TABLE POLICIES
-- Users can SELECT their own details
CREATE POLICY "user_details_select_own" ON user_details
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can SELECT all details
CREATE POLICY "user_details_select_admin" ON user_details
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_details AS ud
      WHERE ud.user_id = auth.uid() 
      AND ud.tier = 'admin'
    )
  );

-- Only admins can UPDATE user_details (including tier changes)
CREATE POLICY "user_details_update_admin_only" ON user_details
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_details AS ud
      WHERE ud.user_id = auth.uid() 
      AND ud.tier = 'admin'
    )
  );

-- Users can INSERT their own details on signup
CREATE POLICY "user_details_insert_own" ON user_details
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**Testing RLS:**
```sql
-- Test as regular user
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'user-uuid-here';

SELECT * FROM profiles;  -- Should only see own profiles
SELECT * FROM user_details WHERE user_id != current_setting('request.jwt.claims.sub');  -- Should return nothing

-- Reset
RESET ROLE;
```

---

### Step 2: Fix XSS Vulnerabilities (30 minutes)

**Install DOMPurify:**
```bash
npm install dompurify @types/dompurify
```

**Update affected files:**

```typescript
// src/components/PdfCareer.tsx
import DOMPurify from 'dompurify';

// Change from:
<div dangerouslySetInnerHTML={{ __html: paragraph }} />

// To:
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(paragraph) }} />
```

**Repeat for:**
- `src/components/analysis_v2/Career.tsx`
- `src/components/analysis_v2/FourKeyPalace.tsx`
- Any other components using `dangerouslySetInnerHTML`

---

### Step 3: Add Security Headers (15 minutes)

**Create `vercel.json` in project root:**

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "camera=(), microphone=(), geolocation=()"
        }
      ]
    }
  ]
}
```

---

### Step 4: Update Dependencies (30 minutes)

```bash
# Remove unused dependencies
npm uninstall @nivo/radar @react-spring/web axios emoji-picker-react react-media-recorder react-modal-image react-to-print libopus.js lodash.debounce react-spring papaparse date-fns-tz

# Update vulnerable packages
npm install @supabase/supabase-js@latest postcss@latest

# Run security audit
npm audit
npm audit fix

# Test that everything still works
npm start
```

---

## 📊 Security Checklist

### Before Scaling to 1000+ Users

- [ ] RLS policies implemented and tested
- [ ] XSS vulnerabilities fixed
- [ ] Security headers added
- [ ] Dependencies updated
- [ ] Automated security scanning enabled (Dependabot)
- [ ] Error monitoring configured (Sentry)
- [ ] Regular security audits scheduled (quarterly)

### Ongoing Security Maintenance

- [ ] Monthly: Run `npm audit` and update dependencies
- [ ] Quarterly: Review RLS policies
- [ ] Quarterly: Review auth flows
- [ ] Annually: Full security audit
- [ ] Monitor: Sentry alerts for errors
- [ ] Monitor: Failed login attempts

---

## 🔗 Related Documentation

- [Production Testing Strategy](../testing/PRODUCTION_TESTING.md)
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)
- [Known Issues](../KNOWN_ISSUES.md)

---

## 📝 Audit History

| Date | Auditor | Findings | Status |
|------|---------|----------|--------|
| 2025-01-05 | Claude | Critical RLS issues, XSS vulnerabilities | Action Required |

---

**Next Audit Due:** April 2025


