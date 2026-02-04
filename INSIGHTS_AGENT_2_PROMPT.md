# InsightsPanel Phase 2 - Part 2: Update UI Components

## Mission
Update all InsightsPanel components to use aspect-specific metrics and contextual data instead of generic universal attributes.

## Context
Agent 1 has created:
- `src/utils/destiny-navigator/aspect-configurations.ts` - Configuration for all 12 aspects
- `src/utils/destiny-navigator/aspect-metrics.ts` - Calculator functions

Now we need to update the UI components to use this contextual data.

## Your Tasks

### 1. Create AspectMetricsBars Component

**File:** `src/components/destiny-navigator/insights/AspectMetricsBars.tsx`

This replaces the generic AttributeBars with aspect-specific metrics.

```typescript
/**
 * AspectMetricsBars Component
 * 
 * Displays aspect-specific metrics with contextual labels and descriptions.
 * Replaces generic AttributeBars with meaningful, context-aware metrics.
 */

import React from "react";
import * as LucideIcons from "lucide-react";
import { LifeAspect } from "../../../types/destiny-navigator";
import { getAspectContextHint } from "../../../utils/destiny-navigator/aspect-metrics";

/**
 * Single metric data
 */
interface MetricData {
  key: string;
  label: string;
  value: number;
  iconName: string;
  description: string;
}

/**
 * Component props
 */
interface AspectMetricsBarsProps {
  metrics: MetricData[];
  aspect: LifeAspect;
}

/**
 * Gradient colors for metric values
 */
const getGradientStyle = (value: number): string => {
  if (value >= 80) return "linear-gradient(90deg, #10b981, #059669)"; // Emerald
  if (value >= 65) return "linear-gradient(90deg, #3b82f6, #2563eb)"; // Blue
  if (value >= 50) return "linear-gradient(90deg, #f59e0b, #d97706)"; // Amber
  return "linear-gradient(90deg, #6b7280, #4b5563)"; // Gray
};

/**
 * Get descriptor text for value
 */
const getDescriptor = (value: number): string => {
  if (value >= 80) return "Exceptional";
  if (value >= 65) return "Strong";
  if (value >= 50) return "Moderate";
  return "Developing";
};

/**
 * AspectMetricsBars Component
 */
export const AspectMetricsBars: React.FC<AspectMetricsBarsProps> = ({ 
  metrics, 
  aspect 
}) => {
  const contextHint = getAspectContextHint(aspect);

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      {/* Header with context */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Key Indicators
          </h3>
          <div className="text-xs px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
            Scale 0-100
          </div>
        </div>
        {contextHint && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {contextHint}
          </p>
        )}
      </div>
      
      {/* Metrics */}
      <div className="space-y-6">
        {metrics.map((metric) => {
          const gradientStyle = getGradientStyle(metric.value);
          const descriptor = getDescriptor(metric.value);
          
          // Get icon component dynamically
          const IconComponent = (LucideIcons as any)[metric.iconName] || LucideIcons.Star;
          
          return (
            <div key={metric.key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                    style={{ background: gradientStyle }}
                  >
                    <IconComponent 
                      className="w-5 h-5 text-white" 
                      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} 
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {metric.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ 
                      background: gradientStyle,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {descriptor}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-4 rounded-full overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: `${metric.value}%`,
                      background: gradientStyle
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### 2. Update FocusPriorities to Support Custom Labels

**File:** `src/components/destiny-navigator/insights/FocusPriorities.tsx`

Update the interface and rendering to support aspect-specific labels:

```typescript
// Update the interface
interface PriorityItem {
  category: string;
  priority: number;
  customLabel?: string;  // ← ADD THIS
}

// In the render, update to use custom label:
const focusData = FOCUS_CATEGORIES[category];
if (!focusData) {
  console.warn(`Focus category "${category}" not found in FOCUS_CATEGORIES`);
  return null;
}

// Use custom label if provided, otherwise use default
const displayLabel = customLabel || focusData.label;  // ← CHANGE THIS LINE

// Then use displayLabel in the JSX:
<h4 className="font-bold text-gray-900 dark:text-white">
  {displayLabel}  {/* ← Use displayLabel instead of focusData.label */}
</h4>
```

### 3. Update InsightsPanel to Use Aspect-Specific Data

**File:** `src/components/destiny-navigator/analysis/InsightsPanel.tsx`

Major changes to use the new aspect-specific functions:

```typescript
// ADD NEW IMPORTS at the top:
import { 
  calculateAspectMetrics, 
  getRelevantFocuses,
  calculateStarActivity 
} from "../../../utils/destiny-navigator/aspect-metrics";

// REPLACE AttributeBars import with AspectMetricsBars:
import { AspectMetricsBars } from "../insights/AspectMetricsBars";

// In the useMemo calculation (around line 118-143), REPLACE:
// Calculate metrics
const qualityScore = calculatePalaceQuality(palace);
const attributes = calculatePalaceAttributes(palace);  // ← REMOVE THIS

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
  attributes,  // ← REMOVE THIS
  stars: rankedStars,
  priorities,  // ← CHANGE THIS
  starDensity: Math.min(Math.round(allStars.length * 0.8), 10)  // ← CHANGE THIS
};

// WITH THIS NEW VERSION:
// Calculate metrics
const qualityScore = calculatePalaceQuality(palace);

// Get all stars from palace (combining all star arrays)
const allStars = getAllStarsFromPalace(palace);

// Calculate aspect-specific metrics
const aspectMetrics = calculateAspectMetrics(palace, aspect);

// Calculate meaningful star activity
const starActivity = calculateStarActivity(palace);

// Determine star count based on timeframe
const starCount = {
  natal: 999, // Show all
  dayun: 3,
  liunian: 2,
  liumonth: 1
}[timeframe];

// Filter and rank stars
const rankedStars = filterStarsByRelevance(allStars, aspect, starCount);

// Generate focus priorities and filter to aspect-relevant ones
const allPriorities = generateFocusPriorities(rankedStars, 3);
const relevantPriorities = getRelevantFocuses(allPriorities, aspect);

return {
  qualityScore,
  aspectMetrics,
  stars: rankedStars,
  priorities: relevantPriorities,
  starActivity
};

// In the render section (around line 165-200), REPLACE:
<ContextHeader
  aspect={aspect}
  timeframe={timeframe}
  qualityScore={insights.qualityScore}
  starDensity={insights.starDensity}  // ← OLD
/>

{/* Attribute Bars - Premium Card */}
<AttributeBars attributes={insights.attributes} />  {/* ← OLD */}

// WITH:
<ContextHeader
  aspect={aspect}
  timeframe={timeframe}
  qualityScore={insights.qualityScore}
  starDensity={insights.starActivity}  // ← NEW: meaningful star activity
/>

{/* Aspect Metrics - Premium Card */}
<AspectMetricsBars 
  metrics={insights.aspectMetrics} 
  aspect={aspect}
/>  {/* ← NEW: aspect-specific metrics */}

// For StarCard, ALWAYS show essence (around line 189):
<StarCard
  key={star.name}
  star={star}
  starData={starData}
  contribution={Math.round(relevance / 10)}
  showEssence={true}  // ← CHANGE from: showEssence={timeframe === "natal"}
  aspect={aspect}
/>

// For FocusPriorities, only show if we have relevant priorities (around line 198):
{insights.priorities.length > 0 && (
  <FocusPriorities priorities={insights.priorities} />
)}
```

### 4. Update exports

**File:** `src/components/destiny-navigator/insights/index.ts`

```typescript
export { ContextHeader } from "./ContextHeader";
export { AspectMetricsBars } from "./AspectMetricsBars";  // ← ADD THIS
export { StarCard } from "./StarCard";
export { FocusPriorities } from "./FocusPriorities";
// Note: AttributeBars is deprecated, kept for backwards compatibility if needed elsewhere
export { AttributeBars } from "./AttributeBars";
```

## Quality Checklist

- [ ] AspectMetricsBars component created and working
- [ ] FocusPriorities supports custom labels
- [ ] InsightsPanel uses calculateAspectMetrics
- [ ] InsightsPanel uses calculateStarActivity
- [ ] InsightsPanel uses getRelevantFocuses
- [ ] StarCard always shows essence text
- [ ] All imports updated correctly
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] ESLint passes

## Testing

After implementation, test:
1. Navigate to Health aspect - should show vitality, recovery, resilience, balance
2. Navigate to Wealth aspect - should show earning, accumulation, opportunity, stability
3. Navigate to Career aspect - should show leadership, execution, strategy, influence
4. Check that focus priorities only show relevant categories
5. Check that custom labels appear (e.g., "Healthy Habits" for health aspect execution)
6. Verify star activity makes sense (not just star count)
7. Verify all star cards show essence text regardless of timeframe

## Output Files

1. `src/components/destiny-navigator/insights/AspectMetricsBars.tsx` (NEW)
2. `src/components/destiny-navigator/insights/FocusPriorities.tsx` (MODIFIED)
3. `src/components/destiny-navigator/analysis/InsightsPanel.tsx` (MODIFIED)
4. `src/components/destiny-navigator/insights/index.ts` (MODIFIED)
