# ZWDS Chart — Complete UI/UX Anatomy & Interaction Reference

> **Purpose**: This document is the definitive reference for understanding the Zi Wei Dou Shu (ZWDS / 紫微斗數) chart as it is currently implemented. It covers every visual zone, every interactive element, every state, and every data field rendered. It is intended as the knowledge base for a full chart redesign.

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Chart Grid Layout](#2-chart-grid-layout)
3. [Palace Card — Full Anatomy](#3-palace-card--full-anatomy)
4. [Center Panel — Full Anatomy](#4-center-panel--full-anatomy)
5. [Transformation Lines Overlay](#5-transformation-lines-overlay)
6. [Interactive Elements — What Clicks Do](#6-interactive-elements--what-clicks-do)
7. [Visual States & Highlight System](#7-visual-states--highlight-system)
8. [Blueprint Modes (result page only)](#8-blueprint-modes-result-page-only)
9. [ChartSettings Feature Toggles](#9-chartsettings-feature-toggles)
10. [Data Model — What Powers the Chart](#10-data-model--what-powers-the-chart)
11. [Styling System](#11-styling-system)
12. [Component Tree & File Map](#12-component-tree--file-map)
13. [Known Design Constraints & Issues](#13-known-design-constraints--issues)

---

## 1. High-Level Architecture

The chart lives in two pages:

| Page | Route | Chart Mode |
|------|-------|-----------|
| `result.tsx` | `/result` | Full-featured: blueprint switcher, profile sidebar, analysis sections |
| `free-result.tsx` | `/free-result` | Simplified: no blueprint modes, inline profile, default interactions only |

The chart itself (`ZWDSChart.tsx`) is a **controlled presentation component**. It receives `chartData` (computed by `ZWDSCalculator`) and optional control props from the parent page. All interactivity is local React state unless the parent passes controlled props.

### Rendering pipeline

```
User profile (DB / form)
    ↓
ChartInput { name, gender, year, month, day, hour }
    ↓
ZWDSCalculator.calculate()
    ↓
ChartData { input, palaces[12], lunarDate, fiveElements, ... }
    ↓
<ZWDSChart chartData={...} />
    ↓
4×4 CSS grid: 12 Palace cards + 2×2 CenterInfo
    + TransformationLines SVG overlay
```

---

## 2. Chart Grid Layout

### Grid structure

The chart renders as a **4-column × 4-row CSS grid** with the center 2×2 cell reserved for the `CenterInfo` panel. The 12 palace cards fill the perimeter cells in classical ZWDS square arrangement.

```
┌──────┬──────┬──────┬──────┐
│  P4  │  P3  │  P2  │  P1  │  ← top row
├──────┼──────┴──────┼──────┤
│  P5  │             │ P12  │  ← center rows (CenterInfo spans 2×2)
├──────┤  CenterInfo ├──────┤
│  P6  │             │ P11  │
├──────┼──────┬──────┼──────┤
│  P7  │  P8  │  P9  │ P10  │  ← bottom row
└──────┴──────┴──────┴──────┘
```

**Palace numbering** is 1-based in props; palace 1 is always the 命宮 (Life Palace). The grid positions are fixed — they do not rotate with the chart.

### Canvas sizing

- **Mobile**: portrait aspect, `min-h-[38rem]`, responsive padding `p-0.5 sm:p-2 md:p-4 lg:p-6`
- **sm and up**: forced square aspect ratio (CSS `aspect-ratio` or padding-bottom trick), `max-w-[900px]`
- **PDF export**: animations disabled, size locked

### Overlay

`TransformationLines` is an absolutely positioned `<svg>` (`z-50`, `pointer-events-none`) rendered on top of the grid. Lines are computed from DOM refs and re-rendered on window resize.

---

## 3. Palace Card — Full Anatomy

Each of the 12 palace cards is rendered by `Palace.tsx` (~1009 lines). A palace represents one of the 12 life domains in ZWDS astrology.

### The 12 palaces and their domains

| Palace Name (EN) | Chinese | Life Domain |
|-----------------|---------|-------------|
| Life | 命宮 | Core personality, life path |
| Siblings | 兄弟 | Siblings, peers, social bonds |
| Spouse | 夫妻 | Romantic relationships, marriage |
| Children | 子女 | Children, creativity, subordinates |
| Wealth | 財帛 | Money, income, financial luck |
| Wellbeing | 疾厄 | Health, body, resilience |
| Travel | 遷移 | Travel, environment, public image |
| Friends | 僕役 | Friends, staff, alliances |
| Career | 官祿 | Career, status, achievements |
| Property | 田宅 | Home, assets, real estate |
| Karma | 福德 | Mental wellbeing, fate, spirituality |
| Parents | 父母 | Parents, authority, documents |

### Visual zones (all breakpoints — unified layout)

```
┌─────────────────────────────────────┐
│ [Badge Icon sm+ only]               │  ← Lucide palace badge (hidden on mobile)
│  Palace Name ─────── Secondary Name │  ← Title row (full width, justify-between)
│  Major Limit ages      Flow pills   │  ← Subtitle row (流年 / 大運 when active)
│                                     │
│  Star Name  ✦祿  Star Name          │  ← Dense flex-wrap star zone
│  Star Name       Star Name  ✦忌     │    Minor stars first, main stars after
│  Star Name  ↻                       │    Wraps on mobile; scroll on sm+ if needed
│─────────────────────────────────────│
│ 甲子  │  流年2026 / Age 25  │ Da Ming│  ← Footer: stem/branch | year/age | Da Ming tag
└─────────────────────────────────────┘
   Background: Faint zodiac watermark (earthly branch animal)
```

**Mobile (`< sm`)** uses the same DOM structure as desktop. Differences are density only: smaller star typography (`text-[8px]`–`text-[9px]`), tighter gaps, no palace Lucide badge, stars wrap within the card (no star-zone scroll), and the chart grid row minimum is `10.5rem`.
### Data fields rendered per palace

| Field | Location | Notes |
|-------|----------|-------|
| `name` | Bottom label | Translated to UI language |
| `heavenlyStem` | Footer left col | Chinese character (e.g. 甲) |
| `earthlyBranch` | Footer left col | Chinese character (e.g. 子) |
| `mainStar[]` | Star grid | Rendered after minor stars; bolder weight |
| `minorStars[]` | Star grid | Rendered first |
| Per star: `transformations[]` | Inline badge on star | 祿/權/科/忌 colored pill |
| Per star: `selfInfluence[]` | `↻` sync icon | Indicates self-transformation |
| `majorLimit` | Subtitle row under title | Age range e.g. `3-12`, clickable |
| `annualFlow` | Footer center / flow pill | Drives 流年 tag + red year highlight |
| `palaceYear` | Footer center | Computed year for this palace |
| Age at `palaceYear` | Footer center | Derived from birth year |
| Earthly branch | Faint background | Zodiac animal watermark |
| Da Ming label | Footer column 3 | Appears when Da Xian is active |
| Secondary palace name | Title row (right) | Appears when palace name click active |

### Star ref anchors (四化 arrow safety)

Transformation lines depend on stable DOM refs, not layout aesthetics:

- **One ref per star**: `registerStarRef(palaceNumber, star.name, element)` on the star column wrapper (`chartPalaceStarColumnClass`).
- **Key**: `"palaceNumber:starName"` where `star.name` is the Chinese name from chart data.
- **Single DOM tree**: No duplicate mobile/desktop star lists; one list visible at all breakpoints.
- **Never attach refs** to split English word tokens or transformation badge spans.
- **Re-measure on resize**: When a palace is selected, `ZWDSChart` briefly resets `refsReady` on `windowSize` change so lines reattach after orientation/resize.

### Data fields NOT shown in palace UI

These exist in `ChartData` but are not rendered in the palace card itself:

- `bodyStar`, `transformedStar`
- `auxiliaryStars`, `yearStars`, `monthStars`, `dayStars`, `hourStars`
- `lifeStar`
- `originalPalace`, `transformedPalace`
- `oppositePalaceInfluence` — used only for the SVG line overlay

---

## 4. Center Panel — Full Anatomy

`CenterInfo.tsx` renders the 2×2 center cell of the chart grid. It is **entirely non-interactive** (no click handlers).

### Contents

```
┌─────────────────────────┐
│       [Avatar]          │  ← Gender + age-band image
│   Person Name           │
│   "Destiny Blueprint"   │  ← Gold sparkle accents
│                         │
│  🌿  Wood / Fire etc.   │  ← Five Elements bureau (Lucide icon + label)
│  Yin/Yang • Gender      │
│  Age  (e.g. 25)         │
│                         │
│  [Chinese Zodiac Card]  │  ← From lunar birth year (gold icon)
│  [Western Zodiac Card]  │  ← From solar month/day (soft gold icon)
└─────────────────────────┘
```

### Avatar system

Avatar is chosen by gender + age band:

| Age Range | Male file | Female file |
|-----------|-----------|-------------|
| 0–17 | `men-0-17.png` | `girl-0-17.png` |
| 18–29 | `men-18-29.png` | `girl-18-29.png` |
| 30–44 | `men-30-44.png` | `girl-30-44.png` |
| 45–60 | `men-45-60.png` | `girl-45-59.png` |
| 60+ | `men-60-above.png` | `girl-60-above.png` |

Path: `/images/chart/avatar/{filename}`

### Zodiac cards

- **Chinese zodiac**: Computed from lunar birth year → one of 12 animal icons from `new-icon/` SVGs, filtered to gold
- **Western zodiac**: Computed from solar birth month/day → one of 12 zodiac SVGs from `western/` folder, filtered to soft gold

### Five Elements bureau

| Element | Lucide Icon |
|---------|-------------|
| Wood (木) | `Leaf` |
| Fire (火) | `Flame` |
| Earth (土) | `Mountain` |
| Metal (金) | `Gem` |
| Water (水) | `Droplets` |

---

## 5. Transformation Lines Overlay

`TransformationLines.tsx` is an SVG layer that draws colored lines between the selected palace and the target stars that receive its 四化 (Four Transformations).

### How lines are drawn

1. User clicks a palace card → `selectedPalace` state updates
2. `useTransformations` hook computes which stars receive 祿/權/科/忌 based on the palace's heavenly stem and `FOUR_TRANSFORMATIONS` lookup
3. `useStarRefs` hook holds DOM refs to each star column element (`Map<"palaceNum:starName", HTMLDivElement>`)
4. `TransformationLines` uses `getBoundingClientRect()` to compute screen coordinates
5. SVG lines animate from palace center to target star position

### Line colors (from `chartSemanticColors.ts`)

| Transformation | Color |
|----------------|-------|
| 祿 (Lu) | Green |
| 權 (Quan) | Blue |
| 科 (Ke) | Yellow/amber |
| 忌 (Ji) | Red |

### Opposite palace influences

When `transformationLines` setting is on, short static lines also render from palace borders to represent `oppositePalaceInfluence`. These are always shown (not interaction-triggered).

### Constraints

- Lines are `pointer-events-none` — not clickable
- Lines re-render on window resize (`refsReady` briefly reset when a palace is selected)
- Lines are gated by `refsReady` boolean from `useStarRefs` to prevent flash
- Disabled in PDF export mode for stability

---

## 6. Interactive Elements — What Clicks Do

All interactions are gated by `disableInteraction` prop and individual `ChartSettings` toggles.

### 6.1 Palace card click (single click)

- **Setting gate**: `palaceClickInteraction`
- **Debounce**: 250ms
- **What happens**:
  - Toggles `selectedPalace` state (click same palace again to deselect)
  - Selected palace gets **brand purple gradient** styling + pulse ring animation
  - `TransformationLines` SVG redraws lines from this palace to its 四化 target stars
  - 四化 target palaces get colored ring highlights (green/blue/yellow/red)
- **Callback**: none to parent (in free-result); in result page DNA mode: controlled via `selectedPalaceControlled`

### 6.2 Palace card double-click

- **Setting gate**: always active (not controlled by `ChartSettings`)
- **What happens**: Toggles a **red 4px border** (`isHighlighted` local state inside Palace component)
- Independent of transformation selection — purely a user visual marker
- Not persisted or communicated to parent

### 6.3 Palace card hover

- **Framer Motion** `whileHover`: slight scale-up + enhanced shadow
- Disabled when `isPdfExport={true}`

### 6.4 Major Limit (大限) age range click

- **Setting gate**: `daXianClickInteraction`
- **Target**: The age range text (e.g. `3-12`) in the palace's bottom panel
- **What happens**:
  - Toggles `selectedDaXian` state
  - All 12 palaces show **Da Ming corner tags** — palace role labels from the perspective of this life decade
  - Current selected Da Yun palace gets **amber glow + pulse animation** (Da Yun highlight)
  - Da Ming labels spread **counter-clockwise** from the selected palace
  - Da Ming labels: 大命, 大兄, 大夫妻, 大子女, 大財, 大疾, 大遷, 大僕, 大官, 大田, 大福, 大父
- **Callback**: `onDaXianChange` (DNA mode in result page)

### 6.5 Palace name (bottom label) click

- **Setting gate**: `palaceNameClickInteraction`
- **Target**: The palace name text at the bottom of each card
- **What happens**:
  - Toggles `selectedPalaceName` state
  - All palaces show **secondary palace name overlay** — rotated ZWDS palace names relative to clicked palace
  - This shows "from this palace's perspective, what are the other palaces called"
- **Callback**: `onPalaceNameChange` (DNA mode in result page)

### 6.6 Year / Age number click (footer)

- **Setting gate**: `yearAgeClickInteraction`
- **Target**: The year number or age number in the palace footer
- **What happens**:
  - Toggles `showMonths` state — sets anchor palace for month display
  - All 12 palaces switch their footer center to show **month labels** (Jan–Dec rotated around the grid from palace 10)
  - Clicking same palace again toggles months off; clicking different palace moves anchor
- **Note**: This "Liu Month" mode at chart level is simpler than the full `liumonth` blueprint mode on result page

### Summary table

| Target | Gesture | Effect | Deselect |
|--------|---------|--------|---------|
| Palace card | Single click | 四化 lines + purple selection | Click again |
| Palace card | Double click | Red border highlight | Double click again |
| Palace card | Hover | Scale + shadow | Mouse out |
| Age range (Major Limit) | Click | Da Ming tags + amber Da Yun glow | Click again |
| Palace name (bottom) | Click | Secondary palace names overlay | Click again |
| Year / Age (footer) | Click | Month labels across grid | Click again |

---

## 7. Visual States & Highlight System

Palaces can display multiple simultaneous highlight states, stacked in visual priority:

### Priority ladder (highest to lowest)

| Level | State | Visual |
|-------|-------|--------|
| 1 | **Selected palace** (四化 click) | Brand purple gradient background + white star text + pulse ring |
| 2 | **Da Yun / Liu Month life highlight** | Amber/gold gradient + orange ring + pulse |
| 3 | **四化 target palace** | Colored ring (green=祿, blue=權, yellow=科, red=忌) |
| 4 | **流年 year match** | Red year text in footer + orange 流年 pill |
| 5 | **Da Ming corner tag** | Purple badge in top-right corner with role label |
| 6 | **Star transformation badge** | Inline colored pill on star name |
| 7 | **Zodiac watermark** | Faint earthly-branch animal in card background |

### Color semantics (frozen — do not change)

| Transformation | Text | Ring | Line | Badge |
|----------------|------|------|------|-------|
| 祿 | Green | `ring-green-*` | Green SVG | Green pill |
| 權 | Blue | `ring-blue-*` | Blue SVG | Blue pill |
| 科 | Amber/Yellow | `ring-yellow-*` | Yellow SVG | Yellow pill |
| 忌 | Red | `ring-red-*` | Red SVG | Red pill |

### Star rendering hierarchy

Within a palace's star list:
- **Minor stars** are listed first
- **Main stars** are listed after, with bolder font weight
- **Brightness** field drives additional font-weight / size variation
- **Self-influence** (`↻` icon) appears on stars that transform back to their own palace

---

## 8. Blueprint Modes (result page only)

The `result.tsx` page adds a `ChartBlueprintSwitcher` tab bar above the chart that changes what the chart is "showing":

### The 4 modes

| Mode | Tab | Icon | Description |
|------|-----|------|-------------|
| `dna` | DNA Chart | ✦ Sparkles | Default view; all interactions enabled; full analysis suite |
| `dayun` | 10-Year | 🕐 Clock | Highlights current Da Yun palace; Da Ming tags auto-shown |
| `liunian` | Annual | 📅+✦ | Highlights current Liu Nian (annual flow) palace |
| `liumonth` | Monthly | 📅 | Shows current Liu Month overlay across all palaces |

### How blueprint mode changes the chart

When mode changes, `result.tsx` updates `ChartSettings` defaults and passes controlled props to `ZWDSChart`:

| Controlled Prop | DNA | Da Yun | Liu Nian | Liu Month |
|-----------------|-----|--------|----------|-----------|
| `selectedDaXianControlled` | user-driven | current Da Yun palace | — | — |
| `selectedPalaceNameControlled` | user-driven | — | — | — |
| `showMonthsControlled` | user-driven | — | — | current year |
| `highlightLifePalaceLikeDayun` | false | false | true | true |
| `liuMonthLifeHighlightPalaceNumber` | — | — | Liu Nian life palace | Liu Month life palace |

### Analysis sections by mode

- **DNA**: Full suite — Core Personality, Wealth Code, Health, Four Key Palaces, Areas of Life
- **Da Yun**: Summary card only
- **Liu Nian**: Annual flow card only
- **Liu Month**: Monthly card only

---

## 9. ChartSettings Feature Toggles

`ChartSettingsContext` exposes 13 boolean flags that control chart behavior. Each page sets defaults via `defaultPageType`.

| Setting | Default (result) | Default (free-result) | Effect |
|---------|-----------------|----------------------|--------|
| `transformationLines` | true | true | Show SVG 四化 lines |
| `palaceClickInteraction` | true | true | Allow palace single-click |
| `daXianClickInteraction` | true | true | Allow Da Xian age click |
| `palaceNameClickInteraction` | true | false | Allow palace name click |
| `yearAgeClickInteraction` | true | true | Allow year/age click (months) |
| `selfInfluenceIcon` | true | true | Show ↻ icon on stars |
| `activationTags` | true | true | Show 祿/權/科/忌 inline badges |
| `liuNianTag` | true | true | Show 流年 pill in footer |
| `showDaYunHighlight` | true | true | Amber glow on Da Yun palace |
| `showDaMingCornerTag` | true | true | Corner tag when Da Xian active |
| `showDaMingBottomLabel` | true | true | Bottom label when Da Xian active |
| `showSecondaryBottomLabel` | true | false | Secondary palace name label |
| `showSecondaryOverlayName` | true | false | Secondary overlay name |

A settings modal (`ChartSettingsModal`) lets users toggle these at runtime on the result page.

---

## 10. Data Model — What Powers the Chart

### `ChartData` (top-level)

```typescript
interface ChartData {
  input: ChartInput;          // name, gender, birth date/time
  palaces: Palace[];          // 12 palace objects (0-indexed)
  lunarDate: LunarDate;       // converted lunar birth date
  yinYang: "Yin" | "Yang";
  fiveElements: FiveElements; // Wood/Fire/Earth/Metal/Water
  heavenlyStem: string;       // year stem
  earthlyBranch: string;      // year branch
}
```

### `Palace` (per-palace, 0-indexed in array)

```typescript
interface Palace {
  number: number;             // 1–12 (1-based)
  name: string;               // palace name (Chinese)
  heavenlyStem: string;       // palace stem (for 四化 calculation)
  earthlyBranch: string;      // palace branch (for watermark zodiac)
  mainStar: Star[];           // major ZWDS stars
  minorStars: Star[];         // minor stars
  majorLimit: { start: number; end: number }; // Da Xian age range
  annualFlow: number;         // year this palace maps to in 流年
  // --- Not rendered in Palace card ---
  bodyStar: Star | null;
  auxiliaryStars: Star[];
  yearStars: Star[];
  monthStars: Star[];
  lifeStar: Star | null;
  originalPalace: string;
  transformedPalace: string;
  oppositePalaceInfluence: OppositePalaceInfluence[];
}
```

### `Star`

```typescript
interface Star {
  name: string;               // Star name (Chinese)
  brightness: StarBrightness; // drives font weight
  transformations: Transformation[]; // 祿/權/科/忌 tags
  selfInfluence: string[];    // self-transformation markers
}
```

### Key lookup tables (in ZWDS calculator)

- **`FOUR_TRANSFORMATIONS`**: Maps heavenly stem → which star gets 祿/權/科/忌
- Palace number → position mapping (1-based to grid position)
- Earthly branch → Chinese zodiac animal (for watermark)

---

## 11. Styling System

All chart styles are centralized in three files:

### `chartUi.ts`

Single source of Tailwind class strings. Key groups:

| Class Group | Used By |
|------------|---------|
| `chartPageClass`, `chartContainerClass` | Page wrappers |
| `chartCanvasOuterClass` | Chart canvas container |
| `chartGridClass` | 4×4 CSS grid |
| `palaceShellClass`, `palaceCardClass` | Palace outer + inner |
| `palaceTitleClass`, `palaceStarClass` | Palace text elements |
| `palaceFooterClass` | Footer grid |
| `palaceWatermarkClass` | Background zodiac image |
| `chartCenterClass` | CenterInfo wrapper |
| `chartBlueprintSwitcherClass` | Tab bar container |
| `chartSidebarClass` | Profile sidebar |
| `chartPrimaryButtonClass` | CTA buttons |

Design tokens (Tailwind custom values):
- `surface-cream` (#FAF9F6 light) / `surface-dark` (dark)
- `accent-gold` (#C5A059)
- `brand-purple` (selection color)
- `theme-border-strong`, `theme-border-subtle`
- `theme-surface-card`

### `chartSemanticColors.ts`

Runtime color values (not Tailwind — used for SVG lines and dynamic styles):

```typescript
// 四化 colors
LU_GREEN   = "#22c55e"  // 祿
QUAN_BLUE  = "#3b82f6"  // 權
KE_YELLOW  = "#f59e0b"  // 科
JI_RED     = "#ef4444"  // 忌

// Brand chrome
brandPurple = "#7c3aed"
daMingTag = "..."
```

Also exports `isChartDarkMode()` for dark/light conditional logic.

### `typographyUi.ts`

Brand gradient text and background class strings (`brandGradientPrimaryBgClass`, etc.). Used in blueprint switcher active tab and headings.

### `color-scheme.css` / `index.css`

CSS custom properties for dark/light theme. Chart respects `dark:` Tailwind variants.

---

## 12. Component Tree & File Map

```
src/
├── pages/
│   ├── result.tsx                      # Full chart page (blueprint modes)
│   └── free-result.tsx                 # Simplified chart page
├── components/
│   ├── ZWDSChart.tsx                   # Re-export only
│   └── zwds/
│       ├── ZWDSChart.tsx               # Main chart component (646 lines)
│       ├── components/
│       │   ├── Palace.tsx              # Single palace card (unified layout)
│       │   ├── CenterInfo.tsx          # 2×2 center panel
│       │   ├── TransformationLines.tsx # SVG line overlay
│       │   ├── ZodiacIconWrapper.tsx   # CSS filter tints for SVG icons
│       │   ├── ChartBlueprintSwitcher.tsx  # NEW: 4-tab mode switcher
│       │   └── ChartProfileSidebar.tsx     # NEW: profile panel
│       ├── hooks/
│       │   ├── useStarRefs.tsx         # DOM refs for star elements
│       │   └── useTransformations.tsx  # 四化 math
│       ├── icons/
│       │   ├── index.ts               # Chinese zodiac SVGs export
│       │   ├── new-icon/              # 12 animal SVGs (active set)
│       │   └── western/               # 12 western zodiac SVGs + index.ts
│       └── utils/
│           ├── helpers.tsx            # Star name translation, color helpers
│           ├── palaceBadgeIcons.ts    # Palace → Lucide icon map
│           ├── chartAvatar.ts         # Gender/age → avatar PNG path
│           └── chartDateLabels.ts     # Date formatting for sidebar
├── context/
│   └── ChartSettingsContext.tsx       # 13 feature toggles
└── styles/
    ├── chartUi.ts                     # All Tailwind class strings
    ├── chartSemanticColors.ts         # Runtime color values (四化 etc.)
    └── typographyUi.ts                # Brand gradient typography classes
```

---

## 13. Known Design Constraints & Issues

These are existing implementation details and constraints that affect redesign decisions:

### Layout

1. **Square aspect ratio forced on sm+**: The chart only looks correct at equal width/height. Non-square layouts would require substantial refactoring.
2. **Palace content overflow**: Stars can overflow the card at some sizes on `sm+`. Handled with scrollable star zone (`chartPalaceStarsZoneClass`); mobile wraps densely without scroll.
3. **Grid cells are fixed**: Palaces cannot be reordered or animated into different positions without rewriting the grid logic.
4. **Unified palace layout**: Mobile and desktop share one DOM tree in `Palace.tsx`; density differs via responsive Tailwind in `chartUi.ts`.

### Interactions

5. **Double-click highlight is local state** — not communicated to parent, not reflected in any other part of the UI, not resettable globally.
6. **Da Ming direction is hardcoded counter-clockwise** — the variable `isClockwise` exists but is always `false`. Gender/Yin-Yang based direction logic is commented out.
7. **Palace numbers are 1-based in props, 0-based in array** — a persistent off-by-one risk in any new code.

### Data

8. **Several palace fields are never rendered**: `bodyStar`, `transformedStar`, `auxiliaryStars`, `yearStars`, `monthStars`, `dayStars`, `hourStars`, `lifeStar` exist in the data model but are not shown in the chart.
9. **Opposite palace influences** are rendered only as SVG lines, never as text or badges in the palace card itself.

### Styling

10. **SVG icons use hardcoded black fills** → requires CSS filter pipelines (`invertToGold`, `invertToWatermark`, etc.) instead of direct fill control.
11. **Brand colors are split across two files** (`chartUi.ts` Tailwind strings + `chartSemanticColors.ts` runtime values) — potential for drift.
12. **Dark mode uses both `dark:` Tailwind variants and `isChartDarkMode()` runtime checks** — the runtime check is used only for SVG line colors.

### Blueprint Modes

13. **Blueprint logic lives in `result.tsx`**, not in the chart component — the chart is a pure presentation layer. Any redesign of blueprint modes must be coordinated across the page and chart.
14. **`free-result.tsx` has no blueprint modes** — its chart is intentionally simpler.

---

## Appendix A: Glossary

| Term | Meaning |
|------|---------|
| 四化 (Four Transformations) | The four star influences: 祿 (Lu/Prosperity), 權 (Quan/Power), 科 (Ke/Wisdom), 忌 (Ji/Obstruction) |
| 大限 (Da Xian) | Major Life Period — a 10-year cycle mapped to a palace |
| 大命/大兄/… (Da Ming) | "Grand" labels — overlay names for palaces during a Da Xian period |
| 流年 (Liu Nian) | Annual flow — the year mapped to a specific palace |
| 流月 (Liu Month) | Monthly flow — which palace rules each month |
| 大運 (Da Yun) | Same as 大限 — the active 10-year luck period |
| 命宮 (Life Palace) | The primary ZWDS palace; palace number 1 |
| 天干 (Heavenly Stem) | One of 10 cyclic heavenly stems (甲乙丙丁...) |
| 地支 (Earthly Branch) | One of 12 cyclic earthly branches (子丑寅卯...) = zodiac animals |
| DNA Chart | The app's term for the full birth chart view (no flow overlay) |

---

## Appendix B: Props Reference for ZWDSChart

```typescript
interface ZWDSChartProps {
  chartData: ChartData;                        // required
  targetYear?: number;                         // Liu Nian year
  simulatedAge?: number;                       // override for Da Yun
  selectedDaXianPalace?: number | null;        // initial Da Xian selection
  disableInteraction?: boolean;                // kill all clicks
  isPdfExport?: boolean;                       // disable animations
  selectedPalaceControlled?: number | null;    // controlled 四化 selection
  selectedDaXianControlled?: number | null;    // controlled Da Xian
  selectedPalaceNameControlled?: number | null; // controlled secondary names
  showMonthsControlled?: number | null;        // controlled months mode
  uniformAnnualYearForMonths?: number;         // same year across all palaces
  highlightLifePalaceLikeDayun?: boolean;      // amber glow for life palace
  liuMonthLifeHighlightPalaceNumber?: number | null; // which palace gets life highlight
  onPalaceNameChange?: (palaceNum: number | null) => void;
  onDaXianChange?: (palaceNum: number | null) => void;
}
```

---

*Generated: June 2026 | Based on source at `E:/projects/nm-zwds` | For redesign reference*
