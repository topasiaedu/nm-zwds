# Dayun (大运) 10-Year Cycle System

## Overview

The Dayun system calculates which 10-year life cycle a person is currently in based on their ZWDS chart. Each cycle corresponds to one of the 12 palaces, and each palace maps to one of 4 seasons (Spring, Summer, Autumn, Winter).

## Architecture

### Files Structure

```
src/
├── types/
│   └── dayun.ts                    # Type definitions
├── utils/dayun/
│   ├── calculator.ts               # Cycle calculation logic
│   ├── seasonMapper.ts             # Palace-to-season mapping
│   └── guidanceGenerator.ts        # Content generation
└── components/dayun/
    ├── DayunSection.tsx            # Main container
    ├── DayunSeasonHero.tsx         # Hero card
    ├── CycleTimeline.tsx           # Timeline view
    ├── PhaseIntensityChart.tsx     # Energy curve
    ├── DayunGuidanceCards.tsx      # Action cards
    └── ReflectionQuestions.tsx     # Questions
```

## Palace to Season Mapping

### 🌱 Spring (Grow Season)
- **Career Palace** (官祿宮) - Fight for achievements & growth
- **Travel Palace** (遷移宮) - Step outside comfort zone
- **Friends Palace** (交友宮) - Leverage on your network

### ☀️ Summer (Harvest Season)
- **Wealth Palace** (財帛宮) - Activate your resources
- **Property Palace** (田宅宮) - Leverage foundations
- **Wellbeing Palace** (福德宮) - Hidden money palace

### 🍂 Autumn (Defend Season)
- **Spouse Palace** (夫妻宮) - Cut emotional noise, realign
- **Siblings Palace** (兄弟宮) - Clean up your circle
- **Children Palace** (子女宮) - Clarify mood & legacy
- **Parents Palace** (父母宮) - Cut over-worry, face patterns

### ❄️ Winter (Reset Season)
- **Life Palace** (命宮) - Invest in yourself first
- **Health Palace** (疾厄宮) - Repair & restore

## How It Works

### 1. Calculate Current Age
```typescript
const currentAge = calculateAge(chartData.input.year, currentYear);
```

### 2. Find Current Dayun Palace
Each palace in the ZWDS chart has a `majorLimit` property with `startAge` and `endAge`. The system finds which palace's age range contains the current age.

```typescript
const dayunPalace = chartData.palaces.find(palace => 
  currentAge >= palace.majorLimit.startAge &&
  currentAge <= palace.majorLimit.endAge
);
```

### 3. Determine Season
Map the palace name to its corresponding season:

```typescript
const season = palaceToSeason(dayunPalace.name); // e.g., "夫妻宮" → "autumn"
```

### 4. Calculate Phase
Within each 10-year cycle, determine which phase (1-3 years = building, 4-6 = peak, 7-10 = integration):

```typescript
const yearInCycle = currentAge - startAge + 1;
const phase = 
  yearInCycle <= 3 ? "building" :
  yearInCycle <= 6 ? "peak" :
  "integration";
```

### 5. Generate Guidance
Based on palace + season, generate specific guidance content:
- **Key Actions**: What to do during this cycle
- **Watch Outs**: What to avoid
- **Success Metrics**: How to measure progress
- **Reflection Questions**: Thought-provoking prompts

## Usage Example

```tsx
import { DayunSection } from "../components/dayun";

// In your component:
<DayunSection chartData={calculatedChartData} />
```

The component will:
1. Calculate the current Dayun cycle
2. Generate appropriate guidance
3. Render all visualization components

## Testing

To test with different scenarios:

1. **Test different ages**: The Dayun cycle changes every 10 years
2. **Test different genders**: Direction of cycle progression differs by gender and yin/yang
3. **Test edge cases**: First year of cycle, last year of cycle
4. **Test all palaces**: Ensure all 12 palaces map to correct seasons

Example test cases:
- Male, Yang, age 25 → Check which palace and season
- Female, Yin, age 45 → Check which palace and season
- Age at exact cycle boundary (e.g., year 10 transitioning to year 1 of next cycle)

## Design Principles

### Visual Hierarchy
1. **Hero Card**: Large, colorful, season-focused
2. **Timeline**: Context of past/present/future
3. **Energy Curve**: Visual intensity across 10 years
4. **Guidance Cards**: Actionable split (do vs. avoid)
5. **Questions**: Collapsible for depth without clutter

### Color Schemes
- Spring: Green/Emerald (`#10b981`)
- Summer: Amber/Yellow (`#f59e0b`)
- Autumn: Orange/Red (`#f97316`)
- Winter: Blue/Cyan (`#3b82f6`)

### Responsive Design
- Mobile: Single column layout
- Desktop: Two-column grid for guidance cards
- All components use Tailwind's dark mode classes

## Future Enhancements

1. **Liunian (流年)**: Add annual cycle analysis on top of 10-year cycles
2. **Transition Warnings**: Alert when approaching end of cycle (last 2-3 years)
3. **Historical View**: Show past cycles and what happened
4. **Success Stories**: Add case studies for each palace/season combo
5. **PDF Export**: Include Dayun section in PDF reports
6. **Multi-language**: Add Chinese translations for all content

## Content Source

All guidance content is extracted from the Dayun teaching methodology and speaker scripts, covering:
- Career transitions and growth strategies
- Wealth activation and monetization
- Relationship dynamics and partnerships
- Health and energy management
- Personal development and reset cycles
