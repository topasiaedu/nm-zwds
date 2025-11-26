# Environment Variables Guide

This document explains all environment variables used in the NM-ZWDS project.

## Overview

The project uses environment variables for configuration. These are stored in a `.env.local` file in the root directory (not committed to git).

## Required Variables

### Supabase Configuration

```env
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

#### `REACT_APP_SUPABASE_URL`
- **Purpose**: Your Supabase project URL
- **Required**: Yes
- **Format**: `https://[project-id].supabase.co`
- **Where to find**: Supabase Dashboard → Settings → API → Project URL

#### `REACT_APP_SUPABASE_ANON_KEY`
- **Purpose**: Supabase anonymous public API key
- **Required**: Yes
- **Format**: Long alphanumeric string
- **Where to find**: Supabase Dashboard → Settings → API → anon public key
- **Security**: Safe to expose (public key with RLS protection)

## Optional Variables

### Free Test Configuration

```env
REACT_APP_FREE_TEST_ENABLED=true
REACT_APP_FREE_TEST_START_DATE=2025-01-01
REACT_APP_FREE_TEST_END_DATE=2025-08-11
```

#### `REACT_APP_FREE_TEST_ENABLED`
- **Purpose**: Enable/disable free test feature
- **Required**: No
- **Default**: `false`
- **Values**: `true`, `false`, `1`, `0`
- **Usage**: Set to `false` or `0` to disable free test

#### `REACT_APP_FREE_TEST_START_DATE`
- **Purpose**: Start date for free test period
- **Required**: No (if free test enabled)
- **Format**: `YYYY-MM-DD`
- **Example**: `2025-01-01`

#### `REACT_APP_FREE_TEST_END_DATE`
- **Purpose**: End date for free test period
- **Required**: No (if free test enabled)
- **Format**: `YYYY-MM-DD`
- **Example**: `2025-08-11`

## Setup Instructions

### 1. Create `.env.local` File

```bash
# In project root
touch .env.local
```

### 2. Add Variables

Copy this template:

```env
# Supabase Configuration
REACT_APP_SUPABASE_URL=https://your-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here

# Free Test Configuration (Optional)
REACT_APP_FREE_TEST_ENABLED=true
REACT_APP_FREE_TEST_START_DATE=2025-01-01
REACT_APP_FREE_TEST_END_DATE=2025-08-11
```

### 3. Get Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com/)
2. Select your project (or create new)
3. Go to **Settings** → **API**
4. Copy:
   - **Project URL** → `REACT_APP_SUPABASE_URL`
   - **anon public** key → `REACT_APP_SUPABASE_ANON_KEY`

### 4. Restart Development Server

```bash
# Stop server (Ctrl+C)
# Start again
npm start
```

## Environment Files

### `.env.local` (Your Local Config)
- **Purpose**: Your personal configuration
- **Git**: Not committed (in `.gitignore`)
- **Usage**: Local development

### `.env.example` (Template)
- **Purpose**: Example configuration
- **Git**: Committed to repository
- **Usage**: Template for new developers

### `.env.production` (Production Config)
- **Purpose**: Production configuration
- **Git**: Not committed
- **Usage**: Production deployment (Vercel)

## Vercel Deployment

For production deployment on Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - Name: `REACT_APP_SUPABASE_URL`
   - Value: Your production Supabase URL
   - Environment: Production
5. Repeat for all variables
6. Redeploy

## Security Best Practices

### ✅ Safe to Expose
- `REACT_APP_SUPABASE_URL` (public URL)
- `REACT_APP_SUPABASE_ANON_KEY` (public key with RLS)
- `REACT_APP_FREE_TEST_*` (public configuration)

### ❌ Never Expose
- Supabase **service role** key (not used in frontend)
- Database passwords
- API secrets
- Private keys

### Security Notes
- All `REACT_APP_*` variables are embedded in the build
- They are visible in browser DevTools
- Never put sensitive data in these variables
- Use Supabase RLS for data protection

## Troubleshooting

### Variables Not Working

**Problem**: Changes to `.env.local` not taking effect

**Solution**:
```bash
# Stop server (Ctrl+C)
# Clear cache
rm -rf node_modules/.cache
# Restart
npm start
```

### Supabase Connection Error

**Problem**: "Invalid API key" or connection errors

**Solutions**:
1. Verify you're using the **anon public** key (not service role)
2. Check for extra spaces in `.env.local`
3. Ensure URL includes `https://`
4. Verify project is active in Supabase

### Free Test Not Working

**Problem**: Free test feature not appearing

**Solutions**:
1. Check `REACT_APP_FREE_TEST_ENABLED=true`
2. Verify dates are in correct format (`YYYY-MM-DD`)
3. Ensure current date is within test period
4. Restart development server

### Build Errors

**Problem**: Build fails with environment variable errors

**Solutions**:
1. Ensure all required variables are set
2. Check for syntax errors in `.env.local`
3. Verify no quotes around values
4. Check for trailing spaces

## Usage in Code

### Reading Variables

```typescript
// ✅ Correct way
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// ❌ Wrong way (TypeScript will complain)
const url = process.env.SUPABASE_URL; // Missing REACT_APP_ prefix
```

### Type Safety

```typescript
// Define types for environment variables
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_SUPABASE_URL: string;
      REACT_APP_SUPABASE_ANON_KEY: string;
      REACT_APP_FREE_TEST_ENABLED?: string;
      REACT_APP_FREE_TEST_START_DATE?: string;
      REACT_APP_FREE_TEST_END_DATE?: string;
    }
  }
}
```

### Validation

```typescript
// Validate required variables
if (!process.env.REACT_APP_SUPABASE_URL) {
  throw new Error("Missing REACT_APP_SUPABASE_URL");
}

if (!process.env.REACT_APP_SUPABASE_ANON_KEY) {
  throw new Error("Missing REACT_APP_SUPABASE_ANON_KEY");
}
```

## Example Configurations

### Development (Local)

```env
REACT_APP_SUPABASE_URL=https://dev-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=dev-anon-key-here
REACT_APP_FREE_TEST_ENABLED=true
REACT_APP_FREE_TEST_START_DATE=2025-01-01
REACT_APP_FREE_TEST_END_DATE=2025-12-31
```

### Production (Vercel)

```env
REACT_APP_SUPABASE_URL=https://prod-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=prod-anon-key-here
REACT_APP_FREE_TEST_ENABLED=false
```

### Testing (CI/CD)

```env
REACT_APP_SUPABASE_URL=https://test-project.supabase.co
REACT_APP_SUPABASE_ANON_KEY=test-anon-key-here
REACT_APP_FREE_TEST_ENABLED=true
REACT_APP_FREE_TEST_START_DATE=2020-01-01
REACT_APP_FREE_TEST_END_DATE=2030-12-31
```

## Related Documentation

- [Quick Start Guide](./QUICK_START.md) - Setup instructions
- [Supabase Integration](../api/SUPABASE.md) - Database configuration
- [Project Overview](../architecture/PROJECT_OVERVIEW.md) - Architecture

