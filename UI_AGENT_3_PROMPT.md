# Destiny Navigator InsightsPanel - Part 3: Main Integration

## Mission
Integrate all utilities and sub-components into the main InsightsPanel component and connect it to the Destiny Navigator flow.

## Context
- Agent 1 created utility functions in `src/utils/destiny-navigator/` including `getAllStarsFromPalace()` helper
- Agent 2 created UI sub-components in `src/components/destiny-navigator/insights/`
- Now we need to refactor `InsightsPanel.tsx` to use real data instead of mocks

## Important Notes
- **Palace.stars does NOT exist** - Use `getAllStarsFromPalace(palace)` to get all stars
- Brightness values are `"bright"` | `"dim"` (2 levels, not 7)
- Star-specific brightness multipliers are stored in `StarData.brightness`

## Your Tasks

### 1. Refactor Main InsightsPanel Component

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

Replace the entire file with:

```typescript
/**
 * InsightsPanel Component - Refactored
 * Displays real chart-based insights with visual data dashboard
 */

import React, { useMemo } from "react";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";
import { Profile } from "../../../context/ProfileContext";
import { ZWDSCalculator } from "../../../utils/zwds/calculator";
import { ChartInput, ChartData } from "../../../utils/zwds/types";
import {
  getPalaceForAspectNatal,
  getPalaceForAspectDayun,
  getPalaceForAspectLiuNian,
  getPalaceForAspectLiuMonth
} from "../../../utils/destiny-navigator/palace-resolver";
import {
  calculatePalaceQuality,
  calculatePalaceAttributes,
  filterStarsByRelevance,
  generateFocusPriorities,
  getAllStarsFromPalace
} from "../../../utils/destiny-navigator/metrics-calculator";

// Import sub-components
import { ContextHeader } from "../insights/ContextHeader";
import { AttributeBars } from "../insights/AttributeBars";
import { StarCard } from "../insights/StarCard";
import { FocusPriorities } from "../insights/FocusPriorities";

interface InsightsPanelProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  profile,
  aspect,
  timeframe
}) => {
  const insights = useMemo(() => {
    try {
      // Parse birth date
      const birthDate = new Date(profile.birthDate);
      
      // Extract hour from birth time
      let hour = 12; // Default to noon
      if (profile.birthTime) {
        const timeMatch = profile.birthTime.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (timeMatch) {
          hour = parseInt(timeMatch[1], 10);
          const minute = parseInt(timeMatch[2], 10);
          const isPM = timeMatch[3] && timeMatch[3].toUpperCase() === "PM";
          const isAM = timeMatch[3] && timeMatch[3].toUpperCase() === "AM";
          
          if (isPM && hour < 12) hour += 12;
          if (isAM && hour === 12) hour = 0;
        }
      }

      // Create chart input
      const chartInput: ChartInput = {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: hour,
        gender: profile.gender as "male" | "female",
        name: profile.name
      };

      // Calculate chart
      const calculator = new ZWDSCalculator(chartInput);
      const chartData = calculator.calculate();

      // Get palace number based on timeframe
      let palaceNumber: number | null = null;
      switch (timeframe) {
        case "natal":
          palaceNumber = getPalaceForAspectNatal(aspect, chartData);
          break;
        case "dayun":
          palaceNumber = getPalaceForAspectDayun(aspect, chartData);
          break;
        case "liunian":
          palaceNumber = getPalaceForAspectLiuNian(aspect, chartData);
          break;
        case "liumonth":
          // TODO: Need selectedMonth from NavigatorState
          const currentMonth = new Date().getMonth() + 1;
          palaceNumber = getPalaceForAspectLiuMonth(aspect, chartData, currentMonth);
          break;
      }

      if (!palaceNumber) {
        throw new Error("Could not resolve palace for selected aspect and timeframe");
      }

      // Get palace data
      const palace = chartData.palaces.find(p => p.number === palaceNumber);
      if (!palace) {
        throw new Error(`Palace ${palaceNumber} not found in chart data`);
      }

      // Calculate metrics
      const qualityScore = calculatePalaceQuality(palace);
      const attributes = calculatePalaceAttributes(palace);
      
      // Get all stars from palace (combining all star arrays)
      const allStars = getAllStarsFromPalace(palace);
      
      // Determine star count based on timeframe
      const starCount = {
        natal: 999, // Show all
        dayun: 3,
        liunian: 2,
        liumonth: 1
      }[timeframe];

      // Filter and rank stars
      const rankedStars = filterStarsByRelevance(allStars, aspect, starCount);
      
      // Generate focus priorities
      const priorities = generateFocusPriorities(rankedStars, 3);

      return {
        qualityScore,
        attributes,
        stars: rankedStars,
        priorities,
        starDensity: Math.min(Math.round(allStars.length * 0.8), 10)
      };
    } catch (err) {
      console.error("Error generating insights:", err);
      return null;
    }
  }, [profile, aspect, timeframe]);

  // Error state
  if (!insights) {
    return (
      <div className="rounded-2xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
        <h3 className="text-lg font-bold text-red-900 dark:text-red-100 mb-2">
          Unable to Generate Insights
        </h3>
        <p className="text-sm text-red-700 dark:text-red-300">
          There was an error calculating your chart data. Please check your profile information and try again.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Context Header */}
      <ContextHeader
        aspect={aspect}
        timeframe={timeframe}
        qualityScore={insights.qualityScore}
        starDensity={insights.starDensity}
      />

      {/* Attribute Bars */}
      <AttributeBars attributes={insights.attributes} />

      {/* Star Grid */}
      <div className="rounded-2xl border border-white/10 backdrop-blur-2xl bg-white/10 dark:bg-black/10 p-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
          Active Stars ({insights.stars.length})
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.stars.map(({ star, starData, relevance }) => (
            <StarCard
              key={star.name}
              star={star}
              starData={starData}
              contribution={Math.round(relevance / 10)}
              showEssence={timeframe === "natal"}
              aspect={aspect}
            />
          ))}
        </div>
      </div>

      {/* Focus Priorities */}
      <FocusPriorities priorities={insights.priorities} />
    </div>
  );
};

export default InsightsPanel;
```

### 2. Update AnalysisView Component

**File:** `src/components/destiny-navigator/stages/AnalysisView.tsx`

Ensure InsightsPanel is imported and used correctly:

```typescript
// ... existing imports ...
import InsightsPanel from "../analysis/InsightsPanel";

// In the component:
{/* Default fallback - show insights for any combination */}
<InsightsPanel
  profile={profile}
  aspect={state.selectedAspect}
  timeframe={state.selectedTimeframe}
/>
```

### 3. Create Component Index

**File:** `src/components/destiny-navigator/insights/index.tsx`

```typescript
export { ContextHeader } from "./ContextHeader";
export { AttributeBars } from "./AttributeBars";
export { StarCard } from "./StarCard";
export { FocusPriorities } from "./FocusPriorities";
```

### 4. Update Package Dependencies

Ensure `lucide-react` is installed:

```bash
npm install lucide-react
```

## Testing Checklist

After implementation, test:

- [ ] InsightsPanel renders without errors
- [ ] Quality score displays correctly (0-100)
- [ ] Attribute bars show accurate percentages
- [ ] Star cards display with correct brightness
- [ ] Focus priorities generate from star keywords
- [ ] Natal shows all stars, Monthly shows 1 star
- [ ] Component works for all 12 aspects
- [ ] Component works for all 4 timeframes
- [ ] Dark mode renders correctly
- [ ] Mobile responsive layout works
- [ ] No TypeScript errors
- [ ] No console errors

## Integration Points

The InsightsPanel connects to:
1. **Profile data** → Calculates chart
2. **Palace resolver** → Finds correct palace
3. **Star data** → Gets interpretations
4. **Metrics calculator** → Computes scores
5. **Sub-components** → Renders visual UI

## Quality Checklist

- [ ] All imports resolve correctly
- [ ] No mock data remains
- [ ] Error handling is comprehensive
- [ ] Loading states handled (if needed)
- [ ] Component is fully typed
- [ ] ESLint passes with no errors

## Output Files

1. `src/components/destiny-navigator/analysis/InsightsPanel.tsx` (refactored)
2. `src/components/destiny-navigator/insights/index.tsx` (new)
3. Updated `src/components/destiny-navigator/stages/AnalysisView.tsx` (if needed)

## Final Verification

Run these commands:
```bash
# TypeScript check
npx tsc --noEmit

# Linting
npm run lint

# Build check
npm run build
```

All should pass with no errors.
