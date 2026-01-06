# Automated Testing Guide

**Last Updated:** January 5, 2025  
**Tool:** Playwright + GitHub Actions  
**Cost:** FREE  
**Setup Time:** 4 hours

## 📋 Overview

This guide shows you how to set up automated end-to-end (E2E) testing using Playwright. After setup, tests run automatically on every push, catching bugs before they reach production.

**Benefits:**
- ✅ Zero manual testing after setup
- ✅ Tests run in 2-3 minutes
- ✅ Catches regressions automatically
- ✅ Tests multiple browsers
- ✅ Completely FREE

---

## 🚀 Quick Start (30 Minutes)

### Step 1: Install Playwright (5 minutes)

```bash
# Initialize Playwright
npm init playwright@latest

# Follow prompts:
# ✅ Use TypeScript
# ✅ Put tests in 'tests' folder
# ✅ Add GitHub Actions workflow
# ✅ Install browsers
```

This creates:
```
your-project/
├── tests/
│   └── example.spec.ts
├── playwright.config.ts
└── .github/
    └── workflows/
        └── playwright.yml
```

### Step 2: Configure Playwright (5 minutes)

Edit `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail fast on CI
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,
  
  // Limit workers on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: 'html',
  
  // Shared settings for all tests
  use: {
    // Base URL for navigation
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on failure
    video: 'retain-on-failure',
    
    // Trace on failure
    trace: 'on-first-retry',
  },

  // Test against multiple browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],

  // Run dev server before tests (optional)
  webServer: {
    command: 'npm start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Step 3: Write Your First Test (20 minutes)

Create `tests/auth.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  
  test('user can sign up', async ({ page }) => {
    await page.goto('/authentication/sign-up');
    
    // Generate unique email
    const email = `test${Date.now()}@example.com`;
    
    // Fill form
    await page.fill('[name="email"]', email);
    await page.fill('[name="password"]', 'Test123456!');
    await page.fill('[name="referralCode"]', 'DYD2025');
    
    // Submit
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
    await expect(page.locator('h1')).toContainText('Dashboard');
  });
  
  test('user can sign in', async ({ page }) => {
    await page.goto('/authentication/sign-in');
    
    // Use existing test account
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*dashboard/);
  });
  
  test('sign in fails with wrong password', async ({ page }) => {
    await page.goto('/authentication/sign-in');
    
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Should show error
    await expect(page.locator('.error-message')).toBeVisible();
  });
  
  test('user can sign out', async ({ page }) => {
    // Sign in first
    await page.goto('/authentication/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
    
    // Sign out
    await page.click('[aria-label="Sign out"]');
    
    // Should redirect to sign in
    await expect(page).toHaveURL(/.*sign-in/);
  });
});
```

---

## 📝 Writing Tests for All Critical Flows

### Chart Calculation Flow

```typescript
// tests/chart-calculation.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chart Calculation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Sign in before each test
    await page.goto('/authentication/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });
  
  test('user can create profile and calculate chart', async ({ page }) => {
    // Navigate to calculate
    await page.click('text=Calculate Chart');
    await expect(page).toHaveURL(/.*calculate/);
    
    // Fill profile form
    await page.fill('[name="name"]', 'Test User');
    await page.selectOption('[name="gender"]', 'male');
    await page.fill('[name="birthday"]', '1990-05-15');
    await page.fill('[name="birthTime"]', '14:00');
    
    // Submit
    await page.click('button:has-text("Calculate")');
    
    // Should see chart
    await expect(page.locator('.zwds-chart')).toBeVisible({ timeout: 10000 });
    
    // Check that palaces are rendered
    const palaces = page.locator('.palace');
    await expect(palaces).toHaveCount(12);
  });
  
  test('chart shows correct palace names', async ({ page }) => {
    // Navigate to existing chart
    await page.goto('/chart');
    
    // Wait for chart to load
    await expect(page.locator('.zwds-chart')).toBeVisible();
    
    // Check for key palace names
    await expect(page.locator('text=命宮')).toBeVisible();
    await expect(page.locator('text=財帛')).toBeVisible();
    await expect(page.locator('text=事業')).toBeVisible();
  });
  
  test('user can view saved profile', async ({ page }) => {
    // Go to dashboard
    await page.goto('/dashboard');
    
    // Click first profile
    await page.click('.profile-card').first();
    
    // Should show chart
    await expect(page).toHaveURL(/.*result/);
    await expect(page.locator('.zwds-chart')).toBeVisible();
  });
});
```

### Free Test Flow

```typescript
// tests/free-test.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Free Test', () => {
  
  test('user can access free test without auth', async ({ page }) => {
    await page.goto('/free-test');
    
    // Should load without redirect to sign in
    await expect(page).toHaveURL(/.*free-test/);
    await expect(page.locator('h1')).toContainText(/free.*test/i);
  });
  
  test('free test calculates and shows limited results', async ({ page }) => {
    await page.goto('/free-test');
    
    // Fill form
    await page.fill('[name="name"]', 'Free Test User');
    await page.selectOption('[name="gender"]', 'female');
    await page.fill('[name="birthday"]', '1995-08-20');
    await page.fill('[name="birthTime"]', '10:00');
    
    // Submit
    await page.click('button:has-text("Calculate")');
    
    // Should show results
    await expect(page).toHaveURL(/.*free-result/);
    await expect(page.locator('.chart-preview')).toBeVisible();
    
    // Should show upgrade prompt
    await expect(page.locator('.upgrade-prompt')).toBeVisible();
    await expect(page.locator('text=Sign Up')).toBeVisible();
  });
});
```

### Admin Functions

```typescript
// tests/admin.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Admin Functions', () => {
  
  test.beforeEach(async ({ page }) => {
    // Sign in as admin
    await page.goto('/authentication/sign-in');
    await page.fill('[name="email"]', process.env.ADMIN_EMAIL || 'admin@example.com');
    await page.fill('[name="password"]', process.env.ADMIN_PASSWORD || 'admin123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*dashboard/);
  });
  
  test('admin can access user management', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Should see user table
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('th:has-text("Email")')).toBeVisible();
    await expect(page.locator('th:has-text("Tier")')).toBeVisible();
  });
  
  test('admin can update user tier', async ({ page }) => {
    await page.goto('/admin/users');
    
    // Find a tier dropdown
    const tierDropdown = page.locator('select[name="tier"]').first();
    
    // Change tier
    await tierDropdown.selectOption('tier2');
    
    // Should show success message (adjust selector as needed)
    await expect(page.locator('.success-message')).toBeVisible();
  });
  
  test('non-admin cannot access admin pages', async ({ page }) => {
    // Sign out
    await page.goto('/dashboard');
    await page.click('[aria-label="Sign out"]');
    
    // Sign in as regular user
    await page.goto('/authentication/sign-in');
    await page.fill('[name="email"]', 'user@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Try to access admin page
    await page.goto('/admin/users');
    
    // Should redirect or show error
    await expect(page).not.toHaveURL(/.*admin/);
  });
});
```

### PDF Export

```typescript
// tests/pdf-export.spec.ts
import { test, expect } from '@playwright/test';

test.describe('PDF Export', () => {
  
  test.beforeEach(async ({ page }) => {
    // Sign in and navigate to chart
    await page.goto('/authentication/sign-in');
    await page.fill('[name="email"]', 'test@example.com');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.goto('/chart');
    await expect(page.locator('.zwds-chart')).toBeVisible();
  });
  
  test('user can export chart as PDF', async ({ page }) => {
    // Click export button
    const downloadPromise = page.waitForEvent('download');
    await page.click('button:has-text("Export PDF")');
    
    // Wait for download
    const download = await downloadPromise;
    
    // Verify filename
    expect(download.suggestedFilename()).toMatch(/\.pdf$/);
    
    // Verify file is not empty
    const path = await download.path();
    expect(path).toBeTruthy();
  });
  
  test('PDF export shows progress', async ({ page }) => {
    // Click export
    await page.click('button:has-text("Export PDF")');
    
    // Should show progress modal
    await expect(page.locator('.pdf-progress-modal')).toBeVisible();
    await expect(page.locator('text=Generating')).toBeVisible();
    
    // Wait for completion (may take a while)
    await expect(page.locator('.pdf-progress-modal')).not.toBeVisible({ timeout: 30000 });
  });
});
```

---

## 🤖 GitHub Actions CI/CD

### Setup (Already done if you ran `npm init playwright@latest`)

The file `.github/workflows/playwright.yml` should look like this:

```yaml
name: Playwright Tests

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    timeout-minutes: 10
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: 18
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Install Playwright Browsers
      run: npx playwright install --with-deps
      
    - name: Run Playwright tests
      run: npx playwright test
      env:
        VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        PLAYWRIGHT_BASE_URL: ${{ secrets.PLAYWRIGHT_BASE_URL }}
        
    - name: Upload test report
      uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

### Add Secrets to GitHub

1. Go to your GitHub repo
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Add each secret:
   - `VITE_SUPABASE_URL`: Your Supabase URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `PLAYWRIGHT_BASE_URL`: Your test environment URL (optional)
   - `ADMIN_EMAIL`: Admin test account email
   - `ADMIN_PASSWORD`: Admin test account password

### Configure Branch Protection

1. Go to Settings → Branches
2. Add rule for `main` branch
3. Enable:
   - ✅ Require status checks to pass before merging
   - ✅ Require branches to be up to date
   - ✅ Status checks: Select "Playwright Tests"

Now PRs cannot be merged if tests fail! ✅

---

## 🧪 Running Tests

### Locally

```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/auth.spec.ts

# Run tests in headed mode (see browser)
npx playwright test --headed

# Run tests in UI mode (interactive)
npx playwright test --ui

# Run tests in specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Debug a specific test
npx playwright test --debug tests/auth.spec.ts

# Run only tests with specific tag
npx playwright test --grep @smoke
```

### On CI (Automatic)

Tests run automatically when you:
- Push to `main` or `develop` branch
- Open a pull request
- Update a pull request

View results in GitHub Actions tab.

---

## 📸 Visual Regression Testing

### Built-in Screenshots

```typescript
test('homepage looks correct', async ({ page }) => {
  await page.goto('/');
  
  // Take screenshot and compare to baseline
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100  // Allow 100 pixels difference
  });
});

test('chart looks correct', async ({ page }) => {
  await page.goto('/chart');
  await expect(page.locator('.zwds-chart')).toBeVisible();
  
  // Screenshot specific element
  await expect(page.locator('.zwds-chart')).toHaveScreenshot('chart.png');
});
```

**First run:** Creates baseline screenshots in `tests/screenshots/`  
**Subsequent runs:** Compares against baseline, fails if different  
**Update baseline:** Run with `--update-snapshots` flag

```bash
npx playwright test --update-snapshots
```

### Advanced: Percy.io (Optional)

For visual testing with history and review UI.

```bash
npm install --save-dev @percy/cli @percy/playwright
```

```typescript
import { test } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test('visual test', async ({ page }) => {
  await page.goto('/dashboard');
  await percySnapshot(page, 'Dashboard');
  
  await page.goto('/chart');
  await percySnapshot(page, 'Chart Page');
});
```

**Free tier:** 5,000 screenshots/month

---

## 🎯 Test Organization Best Practices

### File Structure

```
tests/
├── auth.spec.ts              # Authentication tests
├── chart-calculation.spec.ts # Chart functionality
├── free-test.spec.ts         # Free test flow
├── admin.spec.ts             # Admin functions
├── pdf-export.spec.ts        # PDF export
├── profile-crud.spec.ts      # Profile operations
├── helpers/
│   ├── auth-helper.ts        # Reusable auth functions
│   └── test-data.ts          # Test data generators
└── fixtures/
    ├── users.json            # Test user accounts
    └── profiles.json         # Test profile data
```

### Reusable Helpers

```typescript
// tests/helpers/auth-helper.ts
import { Page } from '@playwright/test';

export async function signIn(page: Page, email: string, password: string) {
  await page.goto('/authentication/sign-in');
  await page.fill('[name="email"]', email);
  await page.fill('[name="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL(/.*dashboard/);
}

export async function signOut(page: Page) {
  await page.click('[aria-label="Sign out"]');
  await page.waitForURL(/.*sign-in/);
}

export async function createProfile(page: Page, data: ProfileData) {
  await page.goto('/calculate');
  await page.fill('[name="name"]', data.name);
  await page.selectOption('[name="gender"]', data.gender);
  await page.fill('[name="birthday"]', data.birthday);
  await page.fill('[name="birthTime"]', data.birthTime);
  await page.click('button:has-text("Calculate")');
  await page.waitForURL(/.*result/);
}
```

**Usage:**

```typescript
import { signIn, createProfile } from './helpers/auth-helper';

test('user flow', async ({ page }) => {
  await signIn(page, 'test@example.com', 'password123');
  await createProfile(page, {
    name: 'Test User',
    gender: 'male',
    birthday: '1990-05-15',
    birthTime: '14:00'
  });
  // ... rest of test
});
```

---

## 🐛 Debugging Tests

### Visual Debugging

```bash
# Run tests with UI mode
npx playwright test --ui

# Run tests in headed mode (see browser)
npx playwright test --headed

# Debug specific test
npx playwright test --debug tests/auth.spec.ts
```

### Playwright Inspector

```typescript
test('debug this test', async ({ page }) => {
  await page.goto('/dashboard');
  
  // Pause execution here
  await page.pause();
  
  // Continue in Playwright Inspector
});
```

### Trace Viewer

```bash
# Enable tracing
npx playwright test --trace on

# View trace
npx playwright show-trace trace.zip
```

Shows timeline of:
- Network requests
- Console logs
- Screenshots
- DOM snapshots

---

## 📊 Test Reports

### HTML Report (Default)

```bash
# Run tests
npx playwright test

# View report
npx playwright show-report
```

Opens browser with:
- Test results
- Screenshots
- Videos (on failure)
- Traces

### CI Report

In GitHub Actions, view:
- Summary in PR checks
- Full report in Actions tab
- Download artifacts for detailed analysis

---

## 🎯 Test Coverage Goals

### Current State
- Manual testing: 100% effort
- Automated testing: 0%
- Test coverage: ~0%

### Target State (After Setup)
- Manual testing: 5% effort (smoke tests only)
- Automated testing: 95%
- Test coverage: 80%+ of critical flows

### Critical Flows to Cover

1. ✅ **Authentication** (must have)
   - Sign up
   - Sign in
   - Sign out
   - Password reset

2. ✅ **Core Features** (must have)
   - Profile creation
   - Chart calculation
   - Chart viewing
   - Profile management

3. ✅ **Free Test** (must have)
   - Access without auth
   - Calculate chart
   - See limited results

4. ✅ **Admin** (must have for admins)
   - User management
   - Tier updates

5. ⚠️ **Secondary Features** (nice to have)
   - PDF export
   - Settings
   - Language switching

---

## 💰 Cost Analysis

### Setup Investment
- Developer time: 4-6 hours (one time)
- Tools: $0 (all free)

### Ongoing Cost
- Maintenance: ~1 hour/month
- CI minutes: ~100 min/month (free tier: 2,000 min)
- Total: $0/month

### ROI
- Time saved: ~20 min/deploy × 8 deploys/month = 160 min/month
- Bugs caught: Prevents production incidents
- Confidence: Deploy without fear

**Payback period:** After first month! 🎉

---

## 🔗 Related Documentation

- [Production Testing Strategy](./PRODUCTION_TESTING.md)
- [QA Checklist](./QA_CHECKLIST.md)
- [Deployment Guide](../deployment/DEPLOYMENT_GUIDE.md)

---

## 📚 Further Reading

- [Playwright Documentation](https://playwright.dev/)
- [Playwright Best Practices](https://playwright.dev/docs/best-practices)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Next Steps:**
1. Set up Playwright (30 min)
2. Write auth tests (30 min)
3. Write core feature tests (2 hours)
4. Configure GitHub Actions (15 min)
5. Deploy and celebrate! 🎉


