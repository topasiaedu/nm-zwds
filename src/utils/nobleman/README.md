# Nobleman Analysis System

## Overview

The Nobleman Analysis System identifies key supportive people in a user's life based on their current 10-year Dayun cycle and ZWDS chart structure. It implements a 3-step methodology from traditional ZWDS astrology:

1. **Identify Objectives** - Determine which life area to focus on
2. **Find Zodiac** - Extract earthly branch and map to Chinese zodiac
3. **Match Star Profiles** - Identify stars in the palace and match to 10 nobleman types

## File Structure

```
src/
├── types/
│   └── nobleman.ts                    # Type definitions
├── constants/
│   └── noblemanProfiles.ts           # Star mappings & profiles
├── utils/nobleman/
│   ├── calculator.ts                 # Main nobleman calculator
│   ├── zodiacMapper.ts              # Earthly branch → zodiac
│   ├── profileMatcher.ts            # Stars → nobleman profiles
│   └── index.ts                     # Barrel exports
└── components/nobleman/
    ├── NoblemanHeroCard.tsx         # Section hero card
    ├── NoblemanProfileCard.tsx      # Main profile display
    ├── OtherLifeAreas.tsx           # Grid of 4 key areas
    └── index.ts                     # Barrel exports
```

## Usage

### Basic Usage

```typescript
import { calculateNoblemanData, calculateOtherLifeAreas } from "../utils/nobleman";
import { calculateAge } from "../utils/dayun/calculator";
import { NoblemanHeroCard, NoblemanProfileCard, OtherLifeAreas } from "../components/nobleman";

// In your component:
const currentAge = calculateAge(chartData.input.year);
const noblemanData = calculateNoblemanData(chartData, currentAge);
const otherAreas = calculateOtherLifeAreas(chartData);

// Render:
{noblemanData && (
  <>
    <NoblemanHeroCard 
      dayunPalace={noblemanData.palaceName}
      startYear={2020}
      endYear={2029}
    />
    <NoblemanProfileCard {...noblemanData} />
    <OtherLifeAreas areas={otherAreas} />
  </>
)}
```

### Calculate Nobleman for Specific Palace

```typescript
import { calculateNoblemanForPalace } from "../utils/nobleman";

// Get nobleman for Career Palace
const careerNobleman = calculateNoblemanForPalace(chartData, "官禄");
```

### Check if Palace Has Nobleman Stars

```typescript
import { hasNoblemanStars } from "../utils/nobleman";

const palace = chartData.palaces[0];
if (hasNoblemanStars(palace)) {
  console.log("This palace has nobleman stars!");
}
```

## Nobleman Types

The system identifies 10 types of nobleman based on stars:

1. **Older Female Nobleman** (太陰) - Mature, wise, emotionally supportive
2. **Male Nobleman** (太陽) - Strong masculine energy, action-oriented
3. **Stable & Resource Nobleman** (天府/天梁) - Reliable, provides resources
4. **Younger / Junior Nobleman** (天同) - Fresh ideas, youthful energy
5. **Same-Generation Nobleman** (天機) - Peer, grows together with you
6. **Authority / High-Status Nobleman** (紫微/廉貞/天相) - Boss, manager, senior leader
7. **Practical Leader Nobleman** (武曲) - Finance/operations focused
8. **Bold & Aggressive Nobleman** (七殺/破軍) - Breakthrough-oriented
9. **Charismatic & Expressive Nobleman** (貪狼/巨門) - Social, persuasive
10. **Refined & Educated Nobleman** (左輔/右弼/文昌/文曲) - Knowledge-based support

## Key Life Areas

The "Other Life Areas" section dynamically shows nobleman for 4 key palaces:

- **Career Palace** (官禄) - Career Growth
- **Wealth Palace** (财帛) - Wealth Building  
- **Health Palace** (疾厄) - Health & Wellness
- **Life Palace** (命宫) - Personal Growth

## Data Flow

```
ChartData 
  → Current Dayun Palace (from Dayun calculator)
  → Earthly Branch (e.g., "寅")
  → Zodiac (e.g., "Tiger") + Years (e.g., [1974, 1986, 1998, 2010, 2022])
  → Stars in Palace (e.g., ["紫微", "天府"])
  → Nobleman Profiles (e.g., ["Authority / High-Status", "Stable & Resource"])
```

## API Reference

### `calculateNoblemanData(chartData, currentAge)`

Calculates nobleman data for the current Dayun palace.

**Parameters:**
- `chartData: ChartData` - Complete ZWDS chart data
- `currentAge: number` - User's current age

**Returns:** `NoblemanData | null`

### `calculateOtherLifeAreas(chartData)`

Calculates nobleman for 4 key life areas.

**Parameters:**
- `chartData: ChartData` - Complete ZWDS chart data

**Returns:** `OtherAreaData[]`

### `mapEarthlyBranchToZodiac(earthlyBranch)`

Maps an earthly branch to zodiac info.

**Parameters:**
- `earthlyBranch: string` - Earthly branch character (e.g., "寅")

**Returns:** `ZodiacInfo`

### `generateRecentYears(earthlyBranch)`

Generates 5 most recent years for a zodiac.

**Parameters:**
- `earthlyBranch: string` - Earthly branch character

**Returns:** `number[]` - Array of 5 years

### `matchStarsToProfiles(palace)`

Matches stars in a palace to nobleman profiles.

**Parameters:**
- `palace: Palace` - Palace object with stars

**Returns:** `NoblemanProfile[]` - Array of 1-2 profiles

## Design Philosophy

### Report Style, Not Guide

The nobleman section is designed as a **report**, not an instructional guide. It presents:

- ✅ Visual, clean presentation
- ✅ Focus on current Dayun nobleman (main card)
- ✅ Quick reference for other areas (grid)
- ❌ No "Step 1, 2, 3" instructions
- ❌ No teaching or explanations

### Visual Hierarchy

1. **Hero Card** - Purple/indigo gradient, sets context
2. **Main Profile** - Large, detailed, prominent
3. **Other Areas** - Small, simple, grid layout

### Professional Aesthetic

- Purple/indigo gradient theme
- No emojis in production
- Clean typography
- Proper spacing and shadows
- Responsive design (mobile-first)

## Integration Points

The nobleman section is integrated into:

- `src/pages/result.tsx` - After DayunSection
- Depends on existing Dayun calculator for current palace
- Uses existing ChartData structure
- Compatible with light/dark themes

## Testing

The system can be tested by:

1. Calculating a chart with known stars
2. Verifying the correct zodiac is shown
3. Checking that nobleman profiles match the stars
4. Validating year calculations (12-year cycles)

Example test cases:
- Palace with 紫微 → Should show "Authority / High-Status Nobleman"
- Palace with 太陰 → Should show "Older Female Nobleman"
- Palace with no nobleman stars → Should show generic message
