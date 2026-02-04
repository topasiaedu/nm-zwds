# InsightsPanel Phase 2 - Part 1: Aspect-Specific Configurations

## Mission
Create aspect-specific metric configurations and calculators to provide contextual insights based on the life aspect being analyzed.

## Context
Currently, the InsightsPanel shows generic attributes (authority, resources, strategy, discipline, flow) for all aspects. This is confusing - "authority" doesn't make sense for Health aspect. We need aspect-specific metrics with meaningful labels and formulas.

## Your Tasks

### 1. Create Aspect Configuration File

**File:** `src/utils/destiny-navigator/aspect-configurations.ts`

```typescript
/**
 * Aspect-specific metric configurations
 * Defines what metrics are relevant for each life aspect
 */

import { Crown, Heart, TrendingUp, Activity, Users, Baby, Home, Plane, Sparkles, Shield, MessageCircle, Scale, Eye, Anchor, Zap, Brain, Lock, Star, Gift, BookOpen } from "lucide-react";
import { LifeAspect } from "../../types/destiny-navigator";

/**
 * Universal star attributes that we transform into aspect-specific metrics
 */
export interface StarAttributes {
  authority: number;    // 0-100
  resources: number;    // 0-100
  strategy: number;     // 0-100
  discipline: number;   // 0-100
  flow: number;         // 0-100
}

/**
 * Single aspect-specific metric
 */
export interface AspectMetric {
  key: string;
  label: string;
  iconName: string; // Lucide icon name as string
  description: string;
  // Formula to derive this metric from universal star attributes
  formula: (attrs: StarAttributes) => number;
}

/**
 * Focus category filtering for aspects
 */
export interface AspectFocusMapping {
  relevant: string[]; // Which focus categories make sense for this aspect
  labels?: Record<string, string>; // Custom labels for this aspect context
}

/**
 * Complete configuration for one life aspect
 */
export interface AspectConfiguration {
  metrics: AspectMetric[];
  focusMapping: AspectFocusMapping;
  starEmphasis: "essence" | "keywords" | "both";
  contextHint: string; // Explanatory text shown above metrics
}

/**
 * Configuration for all 12 life aspects
 */
export const ASPECT_CONFIGS: Record<LifeAspect, AspectConfiguration> = {
  
  health: {
    metrics: [
      {
        key: "vitality",
        label: "Physical Vitality",
        iconName: "Heart",
        description: "Body's natural energy and strength",
        formula: (attrs) => Math.round(attrs.flow * 0.4 + attrs.discipline * 0.3 + attrs.resources * 0.3)
      },
      {
        key: "recovery",
        label: "Recovery Ability",
        iconName: "Activity",
        description: "How quickly you bounce back from illness",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.resources * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "resilience",
        label: "Mental Resilience",
        iconName: "Shield",
        description: "Emotional stability and stress management",
        formula: (attrs) => Math.round(attrs.discipline * 0.4 + attrs.flow * 0.3 + attrs.strategy * 0.3)
      },
      {
        key: "balance",
        label: "Life Balance",
        iconName: "Scale",
        description: "Harmony between work, rest, and activity",
        formula: (attrs) => Math.round(attrs.flow * 0.6 + attrs.discipline * 0.4)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "execution", "support"],
      labels: {
        harmony: "Stress Management",
        execution: "Healthy Habits",
        support: "Support System"
      }
    },
    starEmphasis: "essence",
    contextHint: "Stars in the Health Palace reveal your body's natural tendencies and what to watch."
  },

  wealth: {
    metrics: [
      {
        key: "earning",
        label: "Earning Power",
        iconName: "TrendingUp",
        description: "Natural ability to generate income",
        formula: (attrs) => Math.round(attrs.resources * 0.5 + attrs.strategy * 0.3 + attrs.authority * 0.2)
      },
      {
        key: "accumulation",
        label: "Wealth Building",
        iconName: "Coins",
        description: "Capacity to save and grow assets",
        formula: (attrs) => Math.round(attrs.resources * 0.4 + attrs.discipline * 0.4 + attrs.strategy * 0.2)
      },
      {
        key: "opportunity",
        label: "Opportunity Recognition",
        iconName: "Eye",
        description: "Spotting and seizing financial chances",
        formula: (attrs) => Math.round(attrs.strategy * 0.5 + attrs.flow * 0.3 + attrs.authority * 0.2)
      },
      {
        key: "stability",
        label: "Financial Stability",
        iconName: "Anchor",
        description: "Consistency and security in finances",
        formula: (attrs) => Math.round(attrs.discipline * 0.4 + attrs.resources * 0.4 + attrs.strategy * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["wealth", "strategy", "execution", "systems"],
      labels: {
        wealth: "Money Growth",
        strategy: "Investment Planning",
        execution: "Take Action",
        systems: "Build Systems"
      }
    },
    starEmphasis: "both",
    contextHint: "Your Wealth Palace stars reveal your natural money-making style and financial tendencies."
  },

  career: {
    metrics: [
      {
        key: "leadership",
        label: "Leadership Presence",
        iconName: "Crown",
        description: "Natural authority and command",
        formula: (attrs) => Math.round(attrs.authority * 0.6 + attrs.strategy * 0.2 + attrs.discipline * 0.2)
      },
      {
        key: "execution",
        label: "Execution Power",
        iconName: "Zap",
        description: "Getting things done consistently",
        formula: (attrs) => Math.round(attrs.discipline * 0.5 + attrs.authority * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "strategy",
        label: "Strategic Thinking",
        iconName: "Brain",
        description: "Planning and long-term vision",
        formula: (attrs) => Math.round(attrs.strategy * 0.6 + attrs.authority * 0.2 + attrs.resources * 0.2)
      },
      {
        key: "influence",
        label: "Professional Influence",
        iconName: "Users",
        description: "Impact on others and reputation",
        formula: (attrs) => Math.round(attrs.authority * 0.4 + attrs.flow * 0.3 + attrs.strategy * 0.3)
      }
    ],
    focusMapping: {
      relevant: ["leadership", "strategy", "execution", "systems"],
    },
    starEmphasis: "essence",
    contextHint: "Career Palace stars show your natural professional strengths and ideal roles."
  },

  relationships: {
    metrics: [
      {
        key: "attraction",
        label: "Romantic Appeal",
        iconName: "Heart",
        description: "Natural magnetism and charm",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.authority * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "harmony",
        label: "Relationship Harmony",
        iconName: "Scale",
        description: "Creating peaceful partnerships",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.discipline * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "commitment",
        label: "Commitment Strength",
        iconName: "Lock",
        description: "Loyalty and staying power",
        formula: (attrs) => Math.round(attrs.discipline * 0.5 + attrs.resources * 0.3 + attrs.authority * 0.2)
      },
      {
        key: "communication",
        label: "Emotional Connection",
        iconName: "MessageCircle",
        description: "Understanding and expressing feelings",
        formula: (attrs) => Math.round(attrs.flow * 0.4 + attrs.strategy * 0.4 + attrs.discipline * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "expression", "support"],
      labels: {
        harmony: "Build Harmony",
        expression: "Express Yourself",
        support: "Be Supportive"
      }
    },
    starEmphasis: "essence",
    contextHint: "Relationship Palace stars reveal your romantic patterns and partnership style."
  },

  life: {
    metrics: [
      {
        key: "identity",
        label: "Core Identity",
        iconName: "Star",
        description: "Sense of self and purpose",
        formula: (attrs) => Math.round(attrs.authority * 0.4 + attrs.flow * 0.3 + attrs.strategy * 0.3)
      },
      {
        key: "presence",
        label: "Personal Presence",
        iconName: "Sparkles",
        description: "How you show up in the world",
        formula: (attrs) => Math.round(attrs.authority * 0.5 + attrs.flow * 0.3 + attrs.resources * 0.2)
      },
      {
        key: "vitality",
        label: "Life Force",
        iconName: "Heart",
        description: "Overall energy and drive",
        formula: (attrs) => Math.round(attrs.flow * 0.4 + attrs.discipline * 0.3 + attrs.resources * 0.3)
      },
      {
        key: "destiny",
        label: "Destiny Path",
        iconName: "TrendingUp",
        description: "Natural direction and potential",
        formula: (attrs) => Math.round(attrs.strategy * 0.4 + attrs.authority * 0.3 + attrs.flow * 0.3)
      }
    ],
    focusMapping: {
      relevant: ["leadership", "strategy", "expression", "harmony"],
    },
    starEmphasis: "essence",
    contextHint: "Life Palace stars define your core personality and life trajectory."
  },

  siblings: {
    metrics: [
      {
        key: "bond",
        label: "Family Bond",
        iconName: "Users",
        description: "Connection with siblings and peers",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.discipline * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "support",
        label: "Mutual Support",
        iconName: "Shield",
        description: "How you help each other",
        formula: (attrs) => Math.round(attrs.discipline * 0.4 + attrs.flow * 0.4 + attrs.resources * 0.2)
      },
      {
        key: "harmony",
        label: "Family Harmony",
        iconName: "Scale",
        description: "Peace in sibling relationships",
        formula: (attrs) => Math.round(attrs.flow * 0.6 + attrs.strategy * 0.2 + attrs.discipline * 0.2)
      },
      {
        key: "influence",
        label: "Peer Influence",
        iconName: "Users",
        description: "Impact among your generation",
        formula: (attrs) => Math.round(attrs.authority * 0.4 + attrs.flow * 0.4 + attrs.strategy * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "support", "expression"],
    },
    starEmphasis: "essence",
    contextHint: "Siblings Palace shows your relationship with brothers, sisters, and close peers."
  },

  children: {
    metrics: [
      {
        key: "fertility",
        label: "Fertility & Timing",
        iconName: "Baby",
        description: "Natural capacity for children",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.resources * 0.3 + attrs.discipline * 0.2)
      },
      {
        key: "nurturing",
        label: "Nurturing Ability",
        iconName: "Heart",
        description: "How you care for children",
        formula: (attrs) => Math.round(attrs.flow * 0.4 + attrs.discipline * 0.4 + attrs.strategy * 0.2)
      },
      {
        key: "education",
        label: "Educational Support",
        iconName: "BookOpen",
        description: "Guiding children's growth",
        formula: (attrs) => Math.round(attrs.strategy * 0.5 + attrs.discipline * 0.3 + attrs.authority * 0.2)
      },
      {
        key: "legacy",
        label: "Generational Legacy",
        iconName: "Gift",
        description: "What you pass to the next generation",
        formula: (attrs) => Math.round(attrs.resources * 0.4 + attrs.authority * 0.3 + attrs.strategy * 0.3)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "execution", "support"],
    },
    starEmphasis: "essence",
    contextHint: "Children Palace reveals your relationship with offspring and creative projects."
  },

  travel: {
    metrics: [
      {
        key: "wanderlust",
        label: "Travel Affinity",
        iconName: "Plane",
        description: "Natural desire to explore",
        formula: (attrs) => Math.round(attrs.flow * 0.6 + attrs.strategy * 0.2 + attrs.resources * 0.2)
      },
      {
        key: "adaptability",
        label: "Cultural Adaptability",
        iconName: "Shield",
        description: "Thriving in new environments",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.strategy * 0.3 + attrs.discipline * 0.2)
      },
      {
        key: "opportunity",
        label: "Overseas Opportunities",
        iconName: "Eye",
        description: "Success in foreign lands",
        formula: (attrs) => Math.round(attrs.strategy * 0.4 + attrs.flow * 0.4 + attrs.authority * 0.2)
      },
      {
        key: "expansion",
        label: "Life Expansion",
        iconName: "TrendingUp",
        description: "Growth through movement",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.strategy * 0.3 + attrs.resources * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["strategy", "harmony", "execution"],
    },
    starEmphasis: "essence",
    contextHint: "Travel Palace shows your relationship with change, movement, and foreign places."
  },

  social: {
    metrics: [
      {
        key: "networking",
        label: "Networking Ability",
        iconName: "Users",
        description: "Building connections naturally",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.strategy * 0.3 + attrs.authority * 0.2)
      },
      {
        key: "charisma",
        label: "Social Charisma",
        iconName: "Sparkles",
        description: "Natural appeal to others",
        formula: (attrs) => Math.round(attrs.flow * 0.6 + attrs.authority * 0.2 + attrs.strategy * 0.2)
      },
      {
        key: "influence",
        label: "Social Influence",
        iconName: "TrendingUp",
        description: "Impact in your circle",
        formula: (attrs) => Math.round(attrs.authority * 0.5 + attrs.flow * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "trust",
        label: "Building Trust",
        iconName: "Lock",
        description: "Creating lasting friendships",
        formula: (attrs) => Math.round(attrs.discipline * 0.5 + attrs.flow * 0.3 + attrs.strategy * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "expression", "support"],
    },
    starEmphasis: "essence",
    contextHint: "Social Palace reveals your friendship patterns and networking strengths."
  },

  home: {
    metrics: [
      {
        key: "stability",
        label: "Home Stability",
        iconName: "Home",
        description: "Creating secure foundations",
        formula: (attrs) => Math.round(attrs.resources * 0.5 + attrs.discipline * 0.3 + attrs.flow * 0.2)
      },
      {
        key: "wealth",
        label: "Property Wealth",
        iconName: "TrendingUp",
        description: "Building assets through real estate",
        formula: (attrs) => Math.round(attrs.resources * 0.6 + attrs.strategy * 0.2 + attrs.discipline * 0.2)
      },
      {
        key: "harmony",
        label: "Family Harmony",
        iconName: "Heart",
        description: "Peace in the household",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.discipline * 0.3 + attrs.strategy * 0.2)
      },
      {
        key: "legacy",
        label: "Ancestral Legacy",
        iconName: "Gift",
        description: "Inheritance and generational wealth",
        formula: (attrs) => Math.round(attrs.resources * 0.5 + attrs.authority * 0.3 + attrs.discipline * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["wealth", "systems", "harmony"],
    },
    starEmphasis: "essence",
    contextHint: "Home Palace shows your relationship with property, family, and foundations."
  },

  fortune: {
    metrics: [
      {
        key: "contentment",
        label: "Inner Contentment",
        iconName: "Heart",
        description: "Natural sense of happiness",
        formula: (attrs) => Math.round(attrs.flow * 0.6 + attrs.discipline * 0.2 + attrs.strategy * 0.2)
      },
      {
        key: "spiritual",
        label: "Spiritual Growth",
        iconName: "Sparkles",
        description: "Connection to meaning",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.strategy * 0.3 + attrs.discipline * 0.2)
      },
      {
        key: "clarity",
        label: "Mental Clarity",
        iconName: "Brain",
        description: "Clear thinking and wisdom",
        formula: (attrs) => Math.round(attrs.strategy * 0.5 + attrs.flow * 0.3 + attrs.discipline * 0.2)
      },
      {
        key: "joy",
        label: "Life Enjoyment",
        iconName: "Sparkles",
        description: "Capacity for pleasure and joy",
        formula: (attrs) => Math.round(attrs.flow * 0.7 + attrs.resources * 0.2 + attrs.strategy * 0.1)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "expression", "support"],
    },
    starEmphasis: "essence",
    contextHint: "Fortune Palace reveals your mental state, happiness, and spiritual tendencies."
  },

  parents: {
    metrics: [
      {
        key: "bond",
        label: "Parental Bond",
        iconName: "Heart",
        description: "Relationship with parents",
        formula: (attrs) => Math.round(attrs.flow * 0.5 + attrs.discipline * 0.3 + attrs.authority * 0.2)
      },
      {
        key: "inheritance",
        label: "Family Inheritance",
        iconName: "Gift",
        description: "What you receive from elders",
        formula: (attrs) => Math.round(attrs.resources * 0.5 + attrs.authority * 0.3 + attrs.discipline * 0.2)
      },
      {
        key: "guidance",
        label: "Elder Guidance",
        iconName: "BookOpen",
        description: "Wisdom and support from seniors",
        formula: (attrs) => Math.round(attrs.strategy * 0.5 + attrs.authority * 0.3 + attrs.flow * 0.2)
      },
      {
        key: "respect",
        label: "Filial Respect",
        iconName: "Crown",
        description: "Honor and care for parents",
        formula: (attrs) => Math.round(attrs.discipline * 0.5 + attrs.authority * 0.3 + attrs.flow * 0.2)
      }
    ],
    focusMapping: {
      relevant: ["harmony", "support", "leadership"],
    },
    starEmphasis: "essence",
    contextHint: "Parents Palace shows your relationship with elders and mentors."
  }
};
```

### 2. Create Aspect Metrics Calculator

**File:** `src/utils/destiny-navigator/aspect-metrics.ts`

```typescript
/**
 * Calculate aspect-specific metrics from palace data
 */

import { Palace, Star } from "../zwds/types";
import { ASPECT_CONFIGS, AspectMetric } from "./aspect-configurations";
import { calculatePalaceAttributes, getAllStarsFromPalace } from "./metrics-calculator";
import { STAR_INTERPRETATIONS } from "./star-data/star-interpretations";
import { LifeAspect } from "../../types/destiny-navigator";

/**
 * Calculate aspect-specific metrics from palace
 * 
 * @param palace - Palace to analyze
 * @param aspect - Life aspect being analyzed
 * @returns Array of aspect-specific metrics with values
 */
export function calculateAspectMetrics(
  palace: Palace,
  aspect: LifeAspect
): Array<{ 
  key: string; 
  label: string; 
  value: number; 
  iconName: string; 
  description: string 
}> {
  
  const config = ASPECT_CONFIGS[aspect];
  if (!config) {
    console.warn(`No configuration found for aspect: ${aspect}`);
    return [];
  }

  // Get universal attributes from palace stars
  const universalAttrs = calculatePalaceAttributes(palace);

  // Transform into aspect-specific metrics using formulas
  return config.metrics.map(metric => ({
    key: metric.key,
    label: metric.label,
    iconName: metric.iconName,
    description: metric.description,
    value: metric.formula(universalAttrs)
  }));
}

/**
 * Get relevant focus priorities for an aspect
 * Filters out focus categories that don't make sense for the aspect
 * 
 * @param allPriorities - All generated priorities
 * @param aspect - Life aspect being analyzed
 * @returns Filtered priorities with optional custom labels
 */
export function getRelevantFocuses(
  allPriorities: Array<{ category: string; priority: number }>,
  aspect: LifeAspect
): Array<{ category: string; priority: number; customLabel?: string }> {
  
  const config = ASPECT_CONFIGS[aspect];
  if (!config) return allPriorities;

  // Filter to only relevant categories for this aspect
  const filtered = allPriorities.filter(p => 
    config.focusMapping.relevant.includes(p.category)
  );

  // Apply custom labels if defined for this aspect
  return filtered.map(p => ({
    ...p,
    customLabel: config.focusMapping.labels?.[p.category]
  }));
}

/**
 * Calculate meaningful star activity score based on star power
 * Not just count - considers brightness and category
 * 
 * @param palace - Palace to analyze
 * @returns Star activity score from 0-10
 */
export function calculateStarActivity(palace: Palace): number {
  const stars = getAllStarsFromPalace(palace);
  
  let totalPower = 0;
  
  stars.forEach(star => {
    const starData = STAR_INTERPRETATIONS[star.name];
    if (!starData) return;
    
    // Get brightness multiplier for this star
    const brightness = star.brightness === "bright" 
      ? starData.brightness.bright 
      : starData.brightness.dim;
    
    // Major stars have more impact than minor stars
    const categoryWeight = starData.category === "major" ? 2.0 : 1.0;
    
    // Calculate this star's power contribution
    const starPower = brightness * categoryWeight;
    totalPower += starPower;
  });
  
  // Normalize to 0-10 scale
  // Assume max total power is ~15 (e.g., 5 bright major stars = 5 * 1.3 * 2 = 13)
  const maxExpectedPower = 15;
  const normalized = (totalPower / maxExpectedPower) * 10;
  
  return Math.min(Math.round(normalized), 10);
}

/**
 * Get context hint for an aspect
 */
export function getAspectContextHint(aspect: LifeAspect): string {
  const config = ASPECT_CONFIGS[aspect];
  return config?.contextHint || "";
}

/**
 * Get star emphasis setting for an aspect
 */
export function getStarEmphasis(aspect: LifeAspect): "essence" | "keywords" | "both" {
  const config = ASPECT_CONFIGS[aspect];
  return config?.starEmphasis || "essence";
}
```

## Quality Checklist

- [ ] All 12 aspects have 4 metrics each
- [ ] Formulas use appropriate weights for each aspect context
- [ ] Icon names are valid Lucide React icon names
- [ ] Descriptions are clear and helpful
- [ ] Focus mappings filter to relevant categories only
- [ ] Custom labels add aspect-specific context
- [ ] No TypeScript errors
- [ ] Functions properly exported

## Output Files

1. `src/utils/destiny-navigator/aspect-configurations.ts`
2. `src/utils/destiny-navigator/aspect-metrics.ts`

## Testing

After creation, verify:
```typescript
// Test health aspect
const healthMetrics = calculateAspectMetrics(palace, "health");
console.log(healthMetrics); 
// Should show: vitality, recovery, resilience, balance

// Test wealth aspect
const wealthMetrics = calculateAspectMetrics(palace, "wealth");
console.log(wealthMetrics);
// Should show: earning, accumulation, opportunity, stability
```
