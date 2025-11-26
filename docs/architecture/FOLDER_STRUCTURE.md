# Folder Structure

## Overview

This document describes the organization of the NM-ZWDS codebase.

## Root Directory

```
nm-zwds/
├── docs/                   # 📚 Documentation (you are here!)
├── public/                 # Static assets served as-is
├── src/                    # 💻 Source code
├── scripts/                # Utility scripts
├── build/                  # Production build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Project dependencies and scripts
├── tsconfig.json           # TypeScript configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── README.md               # Main project README
```

## Source Code (`src/`)

### High-Level Structure

```
src/
├── zwds/                   # ZWDS calculation and analysis engine
├── components/             # React components
├── pages/                  # Page-level components
├── context/                # React Context providers
├── hooks/                  # Custom React hooks
├── utils/                  # Utility functions
├── translations/           # i18n translation files
├── types/                  # TypeScript type definitions
├── config/                 # Configuration files
├── layouts/                # Layout components
├── helpers/                # Helper functions
├── assets/                 # Images, SVGs, etc.
├── App.tsx                 # Main App component
└── index.tsx               # Entry point
```

## ZWDS Module (`src/zwds/`)

The core ZWDS calculation and analysis engine.

```
src/zwds/
├── core/                   # Core calculation engine
│   ├── calculator.ts       # Main chart calculator (1000+ lines)
│   ├── constants.ts        # ZWDS constants (stars, palaces, etc.)
│   ├── types.ts            # Type definitions
│   ├── utils.ts            # Helper functions
│   └── index.ts            # Barrel export
│
├── data/                   # Data and content
│   ├── constants/          # Non-translatable constants
│   │   ├── palaces.ts      # Palace mappings, opposites
│   │   ├── stars.ts        # Star properties
│   │   ├── transformations.ts  # Four transformations
│   │   └── index.ts
│   │
│   └── content/            # Translatable content
│       ├── careers.ts      # Career data with translations
│       ├── health.ts       # Health/body parts
│       ├── personalities.ts # Personality descriptions
│       └── index.ts
│
├── analyzers/              # Analysis logic
│   ├── career.ts           # Career aptitude analysis
│   ├── health.ts           # Health analysis
│   ├── personality.ts      # Personality summary
│   ├── warnings.ts         # Warnings/cautions
│   ├── life-areas.ts       # Life areas radar chart
│   ├── transformations.ts  # Four transformations analysis
│   ├── overview.ts         # Overview analysis
│   ├── alerts.ts           # Critical alerts
│   │
│   ├── timing/             # Timing/decade analysis
│   │   ├── cycles.ts       # Decade cycle logic
│   │   ├── activations.ts  # Activation utils
│   │   ├── daming.ts       # Da Ming utils
│   │   └── index.ts
│   │
│   └── index.ts            # Barrel export
│
├── utils/                  # Helper utilities
│   ├── palace-helpers.ts   # Palace-related helpers
│   ├── star-helpers.ts     # Star-related helpers
│   └── index.ts
│
└── index.ts                # Main export
```

### Key Files

#### `calculator.ts` (Core Engine)
- **Purpose**: Main ZWDS chart calculation
- **Size**: ~1000 lines
- **Key Class**: `ZWDSCalculator`
- **Process**: 14-step calculation algorithm
- **Output**: Complete chart data with all stars placed

#### `constants.ts` (ZWDS Data)
- **Purpose**: Core ZWDS lookup tables
- **Contains**:
  - Earthly Branches (地支)
  - Heavenly Stems (天干)
  - Palace Names (宫位)
  - Star Positions
  - Transformation Rules (四化)
  - Major Limit Ages (大限)

#### `types.ts` (Type Definitions)
- **Purpose**: TypeScript interfaces for ZWDS data
- **Key Types**:
  - `ChartInput` - User input data
  - `ChartData` - Complete chart result
  - `Palace` - Palace data structure
  - `Star` - Star data structure
  - `Transformation` - Transformation types

## Components (`src/components/`)

React components organized by feature.

```
src/components/
├── analysis/               # Analysis display components
│   ├── Overview.tsx
│   ├── Career.tsx
│   ├── Health.tsx
│   ├── AreasOfLife.tsx
│   ├── FourKeyPalace.tsx
│   ├── DestinyCompass.tsx
│   ├── AnimatedWrapper.tsx
│   └── index.ts
│
├── chart/                  # Chart visualization
│   ├── ZWDSChart.tsx       # Main chart component
│   ├── Palace.tsx          # Individual palace
│   ├── CenterInfo.tsx      # Center information
│   ├── TransformationLines.tsx  # Transformation lines
│   ├── hooks/              # Chart-specific hooks
│   ├── icons/              # Zodiac icons
│   └── index.ts
│
├── pdf/                    # PDF export components
│   ├── PdfDocument.tsx
│   ├── PdfExportModal.tsx
│   ├── sections/           # PDF sections
│   │   ├── PdfOverview.tsx
│   │   ├── PdfCareer.tsx
│   │   ├── PdfHealth.tsx
│   │   └── ...
│   └── index.ts
│
├── auth/                   # Authentication components
│   ├── ProtectedRoute.tsx
│   ├── TierProtectedRoute.tsx
│   └── index.ts
│
├── forms/                  # Form components
│   ├── ProfileForm.tsx
│   └── index.ts
│
├── ui/                     # Reusable UI components
│   ├── modals/
│   │   ├── ChartSettingsModal.tsx
│   │   └── ConfirmationModal.tsx
│   ├── navigation/
│   │   └── Navbar.tsx
│   ├── backgrounds/
│   │   ├── StarBackground.tsx
│   │   └── StarryBackground.tsx
│   ├── toggles/
│   │   ├── LanguageToggle.tsx
│   │   └── ThemeToggle.tsx
│   ├── PageTransition.tsx
│   └── FreeTestPromo.tsx
│
└── index.ts                # Barrel export
```

## Pages (`src/pages/`)

Page-level components organized by feature.

```
src/pages/
├── auth/                   # Authentication pages
│   ├── SignIn.tsx
│   ├── SignUp.tsx
│   ├── ForgotPassword.tsx
│   ├── ResetPassword.tsx
│   └── ProfileLock.tsx
│
├── dashboard/              # Dashboard pages
│   ├── Dashboard.tsx
│   ├── CreateProfile.tsx
│   └── Profile.tsx
│
├── chart/                  # Chart pages
│   ├── Calculate.tsx       # Chart input form
│   ├── Result.tsx          # Main chart result page
│   ├── TimingChart.tsx     # Decade analysis
│   └── ChartOnly.tsx       # Standalone chart (for screenshots)
│
├── free-test/              # Free test pages
│   ├── FreeTest.tsx
│   ├── FreeResult.tsx
│   └── FreeTestEnded.tsx
│
├── admin/                  # Admin pages
│   ├── UserManagement.tsx
│   └── NumerologyAnalytics.tsx
│
├── legal/                  # Legal pages
│   └── Privacy.tsx
│
├── errors/                 # Error pages
│   ├── NotFound.tsx
│   └── MembershipExpired.tsx
│
└── index.ts                # Barrel export
```

## Context (`src/context/`)

React Context providers for global state.

```
src/context/
├── AuthContext.tsx         # Authentication state
├── LanguageContext.tsx     # Language/i18n state
├── ProfileContext.tsx      # User profiles state
├── TierContext.tsx         # User tier/permissions
├── AlertContext.tsx        # Alert/notification system
├── SidebarContext.tsx      # Sidebar state
└── ChartSettingsContext.tsx # Chart display settings
```

## Translations (`src/translations/`)

Internationalization content.

```
src/translations/
├── en/                     # English translations
│   ├── analysis/           # Analysis-specific
│   │   ├── career.ts
│   │   ├── health.ts
│   │   ├── summary.ts
│   │   └── ...
│   ├── auth.ts
│   ├── common.ts
│   ├── navigation.ts
│   └── index.ts
│
├── zh/                     # Chinese translations
│   ├── analysis/
│   ├── auth.ts
│   └── ...
│
├── en.ts                   # English root
└── zh.ts                   # Chinese root
```

## Utilities (`src/utils/`)

Helper functions and utilities.

```
src/utils/
├── pdf/                    # PDF utilities
│   └── export.ts
├── canvas/                 # Canvas utilities
│   ├── stars.ts
│   └── constellations.ts
└── supabase.ts             # Supabase client
```

## Public Assets (`public/`)

Static files served as-is.

```
public/
├── assets/                 # Career archetype images
│   ├── advisors-f.png
│   ├── visionaries-m.png
│   └── ...
├── images/                 # UI images
│   ├── flags/              # Country flags (216 SVGs)
│   ├── illustrations/
│   └── ...
├── sample/                 # Sample files
│   └── Example-Format.csv
├── index.html              # HTML template
├── manifest.json           # PWA manifest
└── robots.txt              # SEO robots file
```

## Scripts (`scripts/`)

Utility scripts for testing and development.

```
scripts/
├── simulate-signups.js     # Simulate user signups
├── concurrent-test.js      # Concurrent load testing
├── quick-test.js           # Quick functionality tests
└── README.md               # Scripts documentation
```

## Configuration Files

### TypeScript
- `tsconfig.json` - TypeScript compiler configuration

### Tailwind CSS
- `tailwind.config.js` - Tailwind configuration and theme

### Build
- `package.json` - Dependencies and scripts
- `build.js` - Custom build script

### Environment
- `.env.local` - Environment variables (not in git)

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `ProfileForm.tsx`)
- **Utilities**: camelCase (e.g., `supabase.ts`)
- **Types**: PascalCase (e.g., `ChartData`)
- **Constants**: SCREAMING_SNAKE_CASE (e.g., `PALACE_NAMES`)

### Folders
- **Features**: kebab-case (e.g., `free-test/`)
- **Components**: PascalCase or kebab-case (e.g., `chart/`, `analysis/`)

## Import Patterns

### Barrel Exports
Most folders have an `index.ts` for clean imports:

```typescript
// ✅ Good: Use barrel export
import { ZWDSCalculator } from "../../zwds/core";

// ❌ Bad: Direct file import
import { ZWDSCalculator } from "../../zwds/core/calculator";
```

### Relative Imports
- Use relative imports for nearby files
- Use absolute imports from `src/` for distant files

## Related Documentation

- [Project Overview](./PROJECT_OVERVIEW.md) - High-level architecture
- [ZWDS Overview](../zwds/OVERVIEW.md) - Understanding the ZWDS engine
- [Refactoring Plans](../refactoring/OVERVIEW.md) - Planned improvements

