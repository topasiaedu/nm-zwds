# QA Checklist

**Purpose:** Quick manual testing checklist for deployments  
**Time Required:** 10 minutes  
**When to Use:** Before production deployment (until automated tests cover all flows)

---

## 📋 Pre-Deployment Checklist

**Copy this template before each deployment:**

```markdown
## Deployment QA - [Date]

**Feature/Fix:** _________________
**Branch:** _________________
**Tested by:** _________________
**Environment:** Staging / Preview
**URL:** _________________

---

### Authentication & User Management (3 min)

#### Sign Up
- [ ] Can access /authentication/sign-up
- [ ] Can create account with valid email/password
- [ ] Redirects to dashboard after signup
- [ ] Session persists on page refresh

#### Sign In
- [ ] Can access /authentication/sign-in
- [ ] Can sign in with existing account
- [ ] Redirects to dashboard
- [ ] Shows error with wrong password

#### Sign Out
- [ ] Sign out button works
- [ ] Redirects to sign in page
- [ ] Session cleared (cannot access protected pages)

#### Password Reset (if changed)
- [ ] Can request password reset
- [ ] Receives email with reset link
- [ ] Can set new password
- [ ] Can sign in with new password

---

### Core Features (4 min)

#### Profile Creation
- [ ] Can access /calculate
- [ ] Form fields work correctly
- [ ] Can submit valid profile data
- [ ] Chart displays after submission
- [ ] Profile saves to database

#### Chart Display
- [ ] Chart renders correctly
- [ ] All 12 palaces visible
- [ ] Palace names display
- [ ] Stars display in palaces
- [ ] No layout issues

#### Saved Profiles
- [ ] Dashboard shows saved profiles
- [ ] Can click profile to view chart
- [ ] Profile data loads correctly
- [ ] Chart displays for saved profile

#### Profile Management
- [ ] Can edit profile
- [ ] Changes save correctly
- [ ] Can delete profile
- [ ] Delete confirmation works

---

### Free Test Flow (2 min)

- [ ] Can access /free-test without auth
- [ ] Form works correctly
- [ ] Calculates chart
- [ ] Shows limited results
- [ ] Upgrade prompt displays
- [ ] Sign up link works

---

### Admin Functions (1 min) - If Admin

- [ ] Can access /admin/users
- [ ] User list displays
- [ ] Can view user details
- [ ] Can update user tier (if applicable)
- [ ] Changes save correctly

---

### Cross-Browser Testing (if UI changes)

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Mobile Chrome (Android)

---

### Performance & Errors

- [ ] No JavaScript errors in console
- [ ] Page load time reasonable (<3s)
- [ ] No memory leaks (check DevTools)
- [ ] Images load correctly
- [ ] Fonts render correctly

---

### New Feature (if applicable)

**Feature:** _________________

- [ ] Feature accessible at expected location
- [ ] Feature works as designed
- [ ] Feature doesn't break existing functionality
- [ ] Error handling works
- [ ] Loading states work

---

### Regression Checks

- [ ] Existing features still work
- [ ] No new console errors
- [ ] No broken links
- [ ] Auth flows unaffected
- [ ] Data operations unaffected

---

## Results

**Overall Status:** ✅ PASS / ⚠️ ISSUES / ❌ FAIL

**Issues Found:**
1. _________________
2. _________________
3. _________________

**Action:**
- [ ] APPROVED FOR DEPLOYMENT
- [ ] NEEDS FIXES BEFORE DEPLOYMENT
- [ ] CRITICAL ISSUES - DO NOT DEPLOY

**Notes:**
_________________
_________________

**Sign-off:** _________________
**Date/Time:** _________________
```

---

## 🚀 Post-Deployment Smoke Test (5 min)

**After deploying to production, test these immediately:**

```markdown
## Post-Deploy Smoke Test

**Deployment URL:** https://your-app.vercel.app
**Deployed at:** [Time]
**Tested by:** [Name]

### Critical Flows (5 min)

- [ ] Homepage loads (no errors)
- [ ] Sign in works
- [ ] Dashboard displays
- [ ] Can create new chart
- [ ] Chart displays correctly
- [ ] Free test works (incognito window)

### Monitoring (5 min)

- [ ] Check Sentry (no new errors)
- [ ] Check Vercel Analytics (traffic normal)
- [ ] Check console (no errors)

### Result

**Status:** ✅ SUCCESS / ❌ ISSUES FOUND

**If issues found:**
- [ ] Minor - Create ticket
- [ ] Major - Investigate immediately
- [ ] Critical - ROLLBACK NOW

**Action Taken:** _________________
**Time:** _________________
```

---

## 📱 Mobile Testing Checklist

**When to use:** When making UI changes

```markdown
### Mobile Responsiveness

#### iPhone (Safari)
- [ ] Layout looks correct
- [ ] Touch targets large enough
- [ ] Text readable
- [ ] Forms work
- [ ] Navigation accessible

#### Android (Chrome)
- [ ] Layout looks correct
- [ ] Touch targets large enough
- [ ] Text readable
- [ ] Forms work
- [ ] Navigation accessible

#### Tablet (iPad)
- [ ] Layout looks correct
- [ ] Uses appropriate breakpoint
- [ ] All features accessible
```

---

## 🔒 Security Testing Checklist

**When to use:** Before major releases

```markdown
### Security Verification

#### Authentication
- [ ] Cannot access protected routes without login
- [ ] Session expires appropriately
- [ ] Password requirements enforced
- [ ] Failed login attempts handled

#### Authorization
- [ ] Users can only see their own data
- [ ] Admin pages only accessible to admins
- [ ] API calls respect permissions
- [ ] RLS policies working (check in Supabase)

#### Data Protection
- [ ] No sensitive data in URLs
- [ ] No sensitive data in localStorage (check DevTools)
- [ ] HTTPS enforced
- [ ] No console.logs with user data

#### XSS Prevention
- [ ] User inputs sanitized
- [ ] HTML content sanitized (DOMPurify)
- [ ] No inline scripts from user data
```

---

## 🎯 Performance Testing Checklist

**When to use:** Monthly or before major releases

```markdown
### Performance Verification

#### Load Times
- [ ] Homepage: <2s
- [ ] Dashboard: <3s
- [ ] Chart page: <3s
- [ ] Calculate: <5s (with calculation)

#### Lighthouse Scores
- [ ] Performance: >80
- [ ] Accessibility: >90
- [ ] Best Practices: >90
- [ ] SEO: >80

#### Memory
- [ ] No memory leaks (DevTools Performance tab)
- [ ] Memory usage stable over time
- [ ] No excessive re-renders

#### Bundle Size
- [ ] Total bundle: <3MB
- [ ] Main chunk: <1MB
- [ ] Code splitting effective
```

---

## 📊 Testing Matrix

**For comprehensive testing:**

| Feature | Chrome | Firefox | Safari | Mobile | Status |
|---------|--------|---------|--------|--------|--------|
| Sign up | ☐ | ☐ | ☐ | ☐ | |
| Sign in | ☐ | ☐ | ☐ | ☐ | |
| Calculate | ☐ | ☐ | ☐ | ☐ | |
| Chart view | ☐ | ☐ | ☐ | ☐ | |
| PDF export | ☐ | ☐ | ☐ | ☐ | |
| Free test | ☐ | ☐ | ☐ | ☐ | |
| Admin | ☐ | ☐ | ☐ | ☐ | |

**Legend:** ✅ Pass | ❌ Fail | ⚠️ Issues | ☐ Not tested

---

## 🔗 Quick Links

- [Production Testing Strategy](./PRODUCTION_TESTING.md)
- [Automated Testing Guide](./AUTOMATED_TESTING.md)
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)
- [Rollback Procedure](./PRODUCTION_TESTING.md#-rollback-procedure)

---

## 💡 Tips

### Time-Saving Tips
1. **Use keyboard shortcuts** for faster navigation
2. **Keep test accounts** readily available
3. **Test in one browser** for quick checks, multiple browsers for major releases
4. **Focus on what changed** - full regression not always needed

### Common Issues to Watch For
- ❌ Console errors (F12 → Console)
- ❌ Network errors (F12 → Network)
- ❌ Layout breaking on mobile
- ❌ Loading states not showing
- ❌ Error messages not displaying

### When to Skip
**You can skip this checklist if:**
- Only documentation changes
- Only styling changes (no functional changes)
- Only typo fixes
- **BUT:** Always run automated tests!

---

**Remember:** This manual checklist is temporary. Goal is to automate all of this with Playwright! 🎯


