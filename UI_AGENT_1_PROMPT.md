# Destiny Navigator InsightsPanel - Part 1: Data Utilities

## Mission
Create utility functions and calculation logic to transform star data into metrics for the visual insights dashboard.

## Context
We have star interpretation data ready at `src/utils/destiny-navigator/star-data/star-interpretations.ts`. Now we need utility functions to calculate metrics, filter stars, and generate focus priorities.

## 🚨 CRITICAL REQUIREMENTS

**Before you start, understand these key points:**

1. **Palace Stars Property:** Palace does NOT have a unified `stars` property. Palace has SEVEN separate star arrays (`mainStar`, `minorStars`, `auxiliaryStars`, `yearStars`, `monthStars`, `dayStars`, `hourStars`). You MUST create and use `getAllStarsFromPalace()` helper to combine them.

2. **Brightness System:** The ZWDS calculator outputs only `"bright"` | `"dim"` (2 levels, NOT 7 Chinese levels). Each star has specific brightness multipliers stored in `StarData.brightness.bright` and `StarData.brightness.dim`.

3. **Star-Specific Multipliers:** Use `getBrightnessMultiplier(star, starData)` that reads from the star's data - NOT a generic multiplier function.

4. **DO NOT MODIFY:** Any files in `src/utils/zwds/` directory - only READ from them.

5. **Export getAllStarsFromPalace:** Agent 3 needs this function, so make sure it's exported.

## Your Tasks

### 1. Create Focus Category Mapping

**File:** `src/utils/destiny-navigator/focus-mappings.ts`

```typescript
/**
 * Maps star keywords to actionable focus categories
 * Used to generate priority bars in InsightsPanel
 */

export interface FocusCategory {
  id: string;
  label: string;
  description: string;
}

export const FOCUS_CATEGORIES: Record<string, FocusCategory> = {
  leadership: {
    id: "leadership",
    label: "Leadership Positioning",
    description: "Build authority and command presence"
  },
  systems: {
    id: "systems",
    label: "Build Systems & Structure",
    description: "Create organized frameworks"
  },
  wealth: {
    id: "wealth",
    label: "Financial Growth",
    description: "Expand resources and assets"
  },
  execution: {
    id: "execution",
    label: "Disciplined Execution",
    description: "Consistent action and follow-through"
  },
  strategy: {
    id: "strategy",
    label: "Strategic Planning",
    description: "Long-term thinking and foresight"
  },
  harmony: {
    id: "harmony",
    label: "Relationship Harmony",
    description: "Build balanced connections"
  },
  expression: {
    id: "expression",
    label: "Creative Expression",
    description: "Authentic self-expression"
  },
  support: {
    id: "support",
    label: "Team Collaboration",
    description: "Strengthen partnerships"
  }
};

// Map keywords to focus categories
export const KEYWORD_TO_FOCUS_MAP: Record<string, string> = {
  // Leadership keywords
  "authority": "leadership",
  "leadership": "leadership",
  "command": "leadership",
  "premium": "leadership",
  
  // Systems keywords
  "systems": "systems",
  "structure": "systems",
  "discipline": "systems",
  "precision": "systems",
  "operations": "systems",
  
  // Wealth keywords
  "wealth": "wealth",
  "resources": "wealth",
  "accumulation": "wealth",
  "passive-income": "wealth",
  
  // Execution keywords
  "execution": "execution",
  "action": "execution",
  "speed": "execution",
  "courage": "execution",
  
  // Strategy keywords
  "strategy": "strategy",
  "planning": "strategy",
  "intellect": "strategy",
  "foresight": "strategy",
  
  // Harmony keywords
  "harmony": "harmony",
  "peace": "harmony",
  "balance": "harmony",
  "diplomacy": "harmony",
  
  // Expression keywords
  "expression": "expression",
  "charisma": "expression",
  "creativity": "expression",
  "articulation": "expression",
  
  // Support keywords
  "support": "support",
  "assistance": "support",
  "collaboration": "support",
  "helper": "support",
  "amplifier": "support"
};
```

### 2. Create Metrics Calculator

**File:** `src/utils/destiny-navigator/metrics-calculator.ts`

```typescript
import { ChartData, Palace, Star } from "../zwds/types";
import { STAR_INTERPRETATIONS, StarData } from "./star-data/star-interpretations";
import { KEYWORD_TO_FOCUS_MAP } from "./constants";

/**
 * Get all stars from a palace (combining all star arrays)
 * Palace has multiple star arrays, not one unified 'stars' property
 */
export function getAllStarsFromPalace(palace: Palace): Star[] {
  return [
    ...(palace.mainStar || []),
    ...palace.minorStars,
    ...palace.auxiliaryStars,
    ...palace.yearStars,
    ...palace.monthStars,
    ...palace.dayStars,
    ...palace.hourStars
  ].filter(star => star !== null && star !== undefined);
}

/**
 * Get brightness multiplier for a specific star
 * Uses star-specific brightness values from StarData
 */
function getBrightnessMultiplier(star: Star, starData: StarData): number {
  return star.brightness === "bright" 
    ? starData.brightness.bright 
    : starData.brightness.dim;
}

/**
 * Calculate overall palace quality score (0-100)
 */
export function calculatePalaceQuality(palace: Palace): number {
  const stars = getAllStarsFromPalace(palace);
  
  let totalScore = 0;
  let maxPossibleScore = 0;

  stars.forEach(star => {
    const starData = STAR_INTERPRETATIONS[star.name];
    if (!starData) return;

    // Get star-specific brightness multiplier
    const brightnessMultiplier = getBrightnessMultiplier(star, starData);
    
    // Calculate star contribution (average of all attributes)
    const avgAttribute = (
      starData.attributes.authority +
      starData.attributes.resources +
      starData.attributes.strategy +
      starData.attributes.discipline +
      starData.attributes.flow
    ) / 5;

    totalScore += avgAttribute * brightnessMultiplier;
    maxPossibleScore += 100 * starData.brightness.bright; // Use star's max brightness
  });

  // Normalize to 0-100 scale
  return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
}

/**
 * Calculate aggregated attributes for a palace
 */
export function calculatePalaceAttributes(palace: Palace): {
  authority: number;
  resources: number;
  strategy: number;
  discipline: number;
  flow: number;
} {
  const stars = getAllStarsFromPalace(palace);
  
  const aggregated = {
    authority: 0,
    resources: 0,
    strategy: 0,
    discipline: 0,
    flow: 0
  };

  let totalWeight = 0;

  stars.forEach(star => {
    const starData = STAR_INTERPRETATIONS[star.name];
    if (!starData) return;

    const weight = getBrightnessMultiplier(star, starData);
    
    aggregated.authority += starData.attributes.authority * weight;
    aggregated.resources += starData.attributes.resources * weight;
    aggregated.strategy += starData.attributes.strategy * weight;
    aggregated.discipline += starData.attributes.discipline * weight;
    aggregated.flow += starData.attributes.flow * weight;
    
    totalWeight += weight;
  });

  // Normalize by total weight
  if (totalWeight > 0) {
    aggregated.authority = Math.round(aggregated.authority / totalWeight);
    aggregated.resources = Math.round(aggregated.resources / totalWeight);
    aggregated.strategy = Math.round(aggregated.strategy / totalWeight);
    aggregated.discipline = Math.round(aggregated.discipline / totalWeight);
    aggregated.flow = Math.round(aggregated.flow / totalWeight);
  }

  return aggregated;
}

/**
 * Filter and rank stars by relevance to aspect
 */
export function filterStarsByRelevance(
  stars: Star[],
  aspect: string,
  maxCount?: number
): Array<{ star: Star; starData: StarData; relevance: number }> {
  const ranked = stars
    .map(star => {
      const starData = STAR_INTERPRETATIONS[star.name];
      if (!starData) return null;

      // Calculate relevance score with star-specific brightness
      const brightnessMultiplier = getBrightnessMultiplier(star, starData);
      
      // Aspect-specific attribute weights
      const aspectWeights = getAspectAttributeWeights(aspect);
      
      const relevance = 
        starData.attributes.authority * aspectWeights.authority +
        starData.attributes.resources * aspectWeights.resources +
        starData.attributes.strategy * aspectWeights.strategy +
        starData.attributes.discipline * aspectWeights.discipline +
        starData.attributes.flow * aspectWeights.flow;

      return {
        star,
        starData,
        relevance: relevance * brightnessMultiplier
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.relevance - a.relevance);

  return maxCount ? ranked.slice(0, maxCount) : ranked;
}

/**
 * Get attribute weights for different aspects
 */
function getAspectAttributeWeights(aspect: string): {
  authority: number;
  resources: number;
  strategy: number;
  discipline: number;
  flow: number;
} {
  const weights: Record<string, any> = {
    life: { authority: 1, resources: 1, strategy: 1, discipline: 1, flow: 1 },
    wealth: { authority: 0.8, resources: 1.5, strategy: 1, discipline: 1.2, flow: 0.8 },
    career: { authority: 1.5, resources: 0.8, strategy: 1.2, discipline: 1.3, flow: 0.7 },
    health: { authority: 0.5, resources: 0.7, strategy: 0.8, discipline: 1.2, flow: 1.5 },
    relationships: { authority: 0.7, resources: 0.6, strategy: 0.9, discipline: 0.8, flow: 1.4 },
    children: { authority: 1, resources: 0.8, strategy: 0.9, discipline: 1, flow: 1.2 },
    siblings: { authority: 0.8, resources: 0.7, strategy: 0.8, discipline: 0.8, flow: 1.3 },
    travel: { authority: 0.7, resources: 0.9, strategy: 1, discipline: 0.8, flow: 1.4 },
    social: { authority: 0.9, resources: 0.7, strategy: 1, discipline: 0.7, flow: 1.5 },
    home: { authority: 0.8, resources: 1.4, strategy: 1, discipline: 1, flow: 1.1 },
    fortune: { authority: 0.6, resources: 0.8, strategy: 1.1, discipline: 0.9, flow: 1.5 },
    parents: { authority: 1.2, resources: 0.9, strategy: 0.9, discipline: 1, flow: 1 }
  };

  return weights[aspect] || weights.life;
}

/**
 * Generate focus priorities from star keywords
 */
export function generateFocusPriorities(
  stars: Array<{ star: Star; starData: StarData }>,
  maxCategories: number = 3
): Array<{ category: string; priority: number }> {
  const categoryScores: Record<string, number> = {};

  // Aggregate keyword matches
  stars.forEach(({ star, starData }) => {
    const weight = getBrightnessMultiplier(star, starData);
    
    starData.keywords.forEach(keyword => {
      const focusId = KEYWORD_TO_FOCUS_MAP[keyword];
      if (focusId) {
        categoryScores[focusId] = (categoryScores[focusId] || 0) + weight;
      }
    });
  });

  // Sort by score and return top categories
  return Object.entries(categoryScores)
    .map(([category, score]) => ({ category, priority: score }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxCategories);
}
```

## Quality Checklist

- [ ] All functions are pure (no side effects)
- [ ] Proper TypeScript types (no `any`)
- [ ] Handle edge cases (empty palaces, missing star data)
- [ ] Calculations are correct and normalized
- [ ] Code is well-commented

## Output Files

1. `src/utils/destiny-navigator/focus-mappings.ts`
2. `src/utils/destiny-navigator/metrics-calculator.ts`

Ensure both files compile with no TypeScript errors.
