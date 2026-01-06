# Deployment Guide

**Last Updated:** January 5, 2025  
**Platform:** Vercel  
**Strategy:** Continuous Deployment with Preview Environments

---

## 📋 Overview

This guide covers the complete deployment workflow for the NM-ZWDS application, from local development to production.

**Deployment Flow:**
```
Local Dev → Git Push → Vercel Preview → Testing → Merge → Production
```

---

## 🌍 Environments

### 1. Local Development

**URL:** `http://localhost:3000`  
**Purpose:** Development and testing  
**Database:** Development Supabase project

```bash
# Start local development
npm start

# Build locally
npm run build
npm run preview
```

### 2. Preview Environments (Vercel)

**URL:** `https://your-app-git-branch-name.vercel.app`  
**Purpose:** Testing features before production  
**Database:** Staging Supabase project (recommended) or production (be careful!)

**Automatic creation:**
- Every branch gets a preview URL
- Every commit updates the preview
- Multiple previews can exist simultaneously

**Access:**
- Automatically created on push
- Link appears in GitHub PR
- Listed in Vercel dashboard

### 3. Production

**URL:** `https://your-app.vercel.app` (or custom domain)  
**Purpose:** Live application for users  
**Database:** Production Supabase project

**Deployment:**
- Automatic on push to `main` branch
- Manual via Vercel dashboard
- Rollback available instantly

---

## 🚀 Deployment Workflow

### Standard Feature Deployment

```bash
# 1. Create feature branch
git checkout -b feature/new-feature

# 2. Develop and commit
git add .
git commit -m "Add new feature"

# 3. Push to GitHub
git push origin feature/new-feature
# → Vercel automatically creates preview at:
# https://your-app-git-feature-new-feature.vercel.app

# 4. Test on preview URL
# - Run through QA checklist
# - Verify feature works
# - Check for regressions

# 5. Create Pull Request on GitHub
# - Automated tests run (Playwright)
# - Code review by team
# - Tests must pass

# 6. Merge to main
git checkout main
git pull origin main
git merge feature/new-feature
git push origin main
# → Automatic deployment to production

# 7. Verify production deployment
# - Run smoke tests
# - Monitor Sentry for errors
# - Check analytics
```

### Hotfix Deployment (Urgent)

```bash
# 1. Create hotfix branch from main
git checkout main
git checkout -b hotfix/critical-bug

# 2. Fix the issue
git add .
git commit -m "Fix critical bug"

# 3. Push and test preview
git push origin hotfix/critical-bug
# Test on preview URL

# 4. If good, merge immediately
git checkout main
git merge hotfix/critical-bug
git push origin main
# → Deploys to production

# 5. Monitor closely
# Watch Sentry
# Verify fix works
```

---

## ⚙️ Configuration

### Environment Variables

**Local (.env.local):**
```env
VITE_SUPABASE_URL=https://your-dev-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-dev-anon-key
VITE_FREE_TEST_ENABLED=true
```

**Vercel (Production):**

1. Go to Vercel dashboard
2. Project → Settings → Environment Variables
3. Add for **Production** environment:

```
VITE_SUPABASE_URL=https://your-prod-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-prod-anon-key
VITE_FREE_TEST_ENABLED=true
```

**Important:**
- Use `VITE_` prefix (Vite requires this)
- Don't commit `.env.local` to git
- Different keys for dev/staging/production

### vercel.json Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": null,
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
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Purpose:**
- Security headers for all responses
- Client-side routing (SPA rewrites)
- Build configuration

---

## 🧪 Pre-Deployment Checklist

Before merging to `main`:

### Code Quality
- [ ] All TypeScript errors fixed
- [ ] No linter errors (`npm run lint`)
- [ ] Code formatted (`npm run format`)
- [ ] No console.logs with sensitive data
- [ ] No commented-out code blocks

### Testing
- [ ] Automated tests pass locally (`npx playwright test`)
- [ ] Manual QA completed (see [QA Checklist](../testing/QA_CHECKLIST.md))
- [ ] Tested on preview URL
- [ ] No regressions found

### Security
- [ ] No secrets in code
- [ ] Environment variables set in Vercel
- [ ] Auth flows working
- [ ] RLS policies respected (check Supabase logs)

### Database
- [ ] Migrations run (if applicable)
- [ ] Seed data updated (if applicable)
- [ ] Backup created (for major changes)

### Documentation
- [ ] README updated (if needed)
- [ ] CHANGELOG updated (if user-facing changes)
- [ ] API docs updated (if API changes)

### Performance
- [ ] Bundle size reasonable (check build output)
- [ ] No memory leaks (DevTools)
- [ ] Large assets optimized

---

## 📦 Build Process

### Local Build

```bash
# Build for production
npm run build

# Output appears in build/ directory
# Preview the build:
npm run preview
```

### Vercel Build

Happens automatically on push:

```
1. Install dependencies (npm ci)
2. Run build command (npm run build)
3. Run custom build script (node build.js)
   - Copies calc/ directory to build/
4. Deploy build/ directory
```

**Build time:** ~2-3 minutes  
**View logs:** Vercel dashboard → Deployments → Click deployment → View logs

---

## 🔄 Rollback Procedures

### Method 1: Instant Rollback (Vercel Dashboard)

**Time: 60 seconds**

1. Go to https://vercel.com/your-project
2. Click **"Deployments"** tab
3. Find last known good deployment (✅ icon)
4. Click **"..."** menu
5. Select **"Promote to Production"**
6. Confirm
7. ✅ Production now serves the previous version

### Method 2: Git Revert

**Time: 2-3 minutes**

```bash
# 1. Find the problematic commit
git log --oneline

# 2. Revert it
git revert <commit-hash>

# 3. Push (triggers new deployment)
git push origin main

# 4. Verify
# Check Vercel deployment status
```

### Method 3: Vercel CLI

**Time: 30 seconds**

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Rollback to previous deployment
vercel rollback

# Or rollback to specific deployment
vercel rollback <deployment-url>
```

### When to Rollback

**Immediate rollback:**
- 🔴 Critical features broken (auth, payment, core functionality)
- 🔴 Data corruption possible
- 🔴 Security vulnerability
- 🔴 Site down or error 500
- 🔴 >50 errors/minute in Sentry

**Consider rollback:**
- 🟡 Major feature not working
- 🟡 Performance degradation >50%
- 🟡 Multiple user complaints

**Don't rollback:**
- 🟢 Minor cosmetic issues
- 🟢 Single edge case bug
- 🟢 Typos (fix forward instead)

---

## 📊 Post-Deployment Verification

### Immediate (0-5 minutes)

**Smoke Test:**
```markdown
- [ ] Homepage loads
- [ ] Can sign in
- [ ] Dashboard loads
- [ ] Core features work
- [ ] No console errors
```

**Monitoring:**
```markdown
- [ ] Check Sentry (no new errors)
- [ ] Check Vercel Analytics (traffic normal)
- [ ] Check deployment logs (no errors)
```

### Short-term (5-30 minutes)

**Watch metrics:**
- Error rate (Sentry)
- Response times (Vercel)
- User feedback (support channels)

**Be ready to:**
- Rollback if critical issues
- Hot-fix if minor issues
- Communicate with users if needed

### Long-term (24 hours)

**Monitor:**
- Error trends
- Performance metrics
- User engagement
- Feature adoption (for new features)

---

## 🔔 Monitoring & Alerts

### Error Monitoring (Sentry)

**Setup:** See [Production Testing Guide](../testing/PRODUCTION_TESTING.md#error-monitoring-sentry)

**Alerts:**
- Email for new error types
- Email for error rate spikes
- Slack notification (optional)

**Review:**
- Daily: Check dashboard
- Weekly: Review trends
- Monthly: Deep dive analysis

### Uptime Monitoring (UptimeRobot)

**Setup:** 
1. Go to uptimerobot.com (free)
2. Add monitor: https://your-app.vercel.app
3. Check every 5 minutes
4. Alert via email

**Incidents:**
- Email notification on downtime
- Check Vercel status page
- Check Supabase status page
- Investigate and fix

### Performance Monitoring (Vercel Analytics)

**Already enabled** (you have @vercel/analytics installed)

**Metrics:**
- Page views
- Unique visitors
- Load times
- Web Vitals (Core Web Vitals)

**Review:** Weekly

---

## 🚨 Troubleshooting

### Build Fails

**Error: Dependencies won't install**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Or in Vercel, clear build cache:
# Settings → General → Clear Cache
```

**Error: TypeScript errors**

```bash
# Check locally
npm run build

# Fix TypeScript errors
# Then push again
```

**Error: Out of memory**

```json
// In package.json, increase memory:
{
  "scripts": {
    "build": "NODE_OPTIONS=--max_old_space_size=4096 react-scripts build && node build.js"
  }
}
```

### Deployment Succeeds but Site Broken

**Issue: Environment variables missing**

1. Check Vercel → Settings → Environment Variables
2. Ensure all `VITE_*` variables are set
3. Redeploy

**Issue: Assets not loading**

1. Check build output (`build/` directory)
2. Verify `build.js` ran successfully
3. Check Vercel logs for missing files

**Issue: API calls failing**

1. Check Supabase status
2. Verify environment variables
3. Check CORS settings
4. Check Supabase RLS policies

### Rollback Doesn't Fix Issue

**Database issue:**
- Check Supabase dashboard
- Review recent database changes
- Restore database backup if needed

**Cache issue:**
- Clear browser cache
- Flush CDN cache (Vercel does this automatically)
- Check if issue is user-specific

---

## 📈 Scaling Considerations

### Current Capacity (150 users)

**Vercel free tier:**
- ✅ Sufficient for 150 users
- ✅ 100 GB bandwidth/month
- ✅ Unlimited preview deployments

**Supabase free tier:**
- ✅ 500 MB database
- ✅ 2 GB bandwidth/month
- ✅ 50,000 monthly active users

### Scaling to 1,000+ users

**Monitor these:**
- Database size (Supabase)
- Bandwidth usage (Vercel + Supabase)
- Build minutes (GitHub Actions)

**Upgrade triggers:**
- Database >400 MB → Consider Supabase Pro ($25/mo)
- Bandwidth >80 GB → Consider Vercel Pro ($20/mo)
- Users >50,000 → Must upgrade Supabase

**All thresholds well above 1,000 users** ✅

---

## 🔗 Related Documentation

- [Production Testing Strategy](../testing/PRODUCTION_TESTING.md)
- [Automated Testing Guide](../testing/AUTOMATED_TESTING.md)
- [QA Checklist](../testing/QA_CHECKLIST.md)
- [Security Audit](../security/SECURITY_AUDIT_2025.md)

---

## 📝 Deployment Log Template

Keep a log for reference:

```markdown
## Deployment: [Date/Time]

**Version/Branch:** feature/new-thing
**Deployed by:** [Name]
**Deployment URL:** https://your-app.vercel.app
**Vercel Deployment ID:** dpl_xxx

**Changes:**
- Added new chart feature
- Fixed bug in profile form
- Updated dependencies

**Pre-deployment:**
- [x] All tests passed
- [x] QA completed
- [x] Preview tested
- [x] Code reviewed

**Post-deployment:**
- [x] Smoke test passed
- [x] No errors in Sentry
- [x] Analytics normal

**Issues:** None / [List any issues]
**Rollback:** No / [If yes, explain]

**Status:** ✅ Success
```

---

**Remember:** Fast feedback, quick rollbacks, and good monitoring make deployments stress-free! 🚀


