# Destiny Navigator InsightsPanel - Part 2: UI Sub-Components

## Mission
Create reusable UI components for displaying star data, metrics, and insights in a modern data dashboard style.

## Context
- Agent 1 has created utility functions in `src/utils/destiny-navigator/`
- We're building visual components for the InsightsPanel
- Use **Lucide React** for icons (consistent, tree-shakable)
- Follow the existing design system in the codebase

## Important Notes
- Brightness values are `"bright"` | `"dim"` (2 levels from calculator, not 7 Chinese levels)
- Star-specific brightness multipliers are in `StarData.brightness` property
- Use star data to determine visual star rating (1-5 stars for display)

## Prerequisites

Install Lucide React if not already installed:
```bash
npm install lucide-react
```

## Your Tasks

### 1. Context Header Component

**File:** `src/components/destiny-navigator/insights/ContextHeader.tsx`

```typescript
import React from "react";
import { Crown, TrendingUp, Calendar, Clock } from "lucide-react";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";

interface ContextHeaderProps {
  aspect: LifeAspect;
  timeframe: TimeFrame;
  qualityScore: number;
  starDensity: number; // 0-10
}

const ASPECT_CONFIG: Record<LifeAspect, { icon: any; label: string }> = {
  life: { icon: Crown, label: "Life & Identity" },
  wealth: { icon: TrendingUp, label: "Wealth & Resources" },
  career: { icon: TrendingUp, label: "Career & Status" },
  // Add remaining 9 aspects...
};

const TIMEFRAME_LABELS: Record<TimeFrame, string> = {
  natal: "Lifelong Patterns",
  dayun: "Next 10 Years",
  liunian: "This Year",
  liumonth: "This Month"
};

export const ContextHeader: React.FC<ContextHeaderProps> = ({
  aspect,
  timeframe,
  qualityScore,
  starDensity
}) => {
  const config = ASPECT_CONFIG[aspect];
  const Icon = config.icon;
  
  // Determine quality status
  const getQualityStatus = (score: number) => {
    if (score >= 80) return { label: "Exceptional", color: "emerald" };
    if (score >= 65) return { label: "Strong", color: "blue" };
    if (score >= 50) return { label: "Moderate", color: "amber" };
    return { label: "Developing", color: "gray" };
  };
  
  const status = getQualityStatus(qualityScore);

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 backdrop-blur-2xl bg-gradient-to-br from-white/10 to-white/5 dark:from-black/20 dark:to-black/10 p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl bg-gradient-to-br from-${status.color}-500 to-${status.color}-600`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {config.label}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {TIMEFRAME_LABELS[timeframe]}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex-1">
          <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
            {qualityScore}
          </div>
          <div className={`text-sm font-semibold text-${status.color}-600 dark:text-${status.color}-400`}>
            {status.label}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className={`w-2 h-8 rounded-full ${
                  i < starDensity 
                    ? `bg-${status.color}-500` 
                    : "bg-gray-300 dark:bg-gray-700"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
```

### 2. Attribute Bars Component

**File:** `src/components/destiny-navigator/insights/AttributeBars.tsx`

```typescript
import React from "react";
import { Crown, Coins, Brain, Target, Wind } from "lucide-react";

interface AttributeBarsProps {
  attributes: {
    authority: number;
    resources: number;
    strategy: number;
    discipline: number;
    flow: number;
  };
}

const ATTRIBUTES = [
  { key: "authority", label: "Authority", icon: Crown },
  { key: "resources", label: "Resources", icon: Coins },
  { key: "strategy", label: "Strategy", icon: Brain },
  { key: "discipline", label: "Discipline", icon: Target },
  { key: "flow", label: "Flow", icon: Wind }
] as const;

export const AttributeBars: React.FC<AttributeBarsProps> = ({ attributes }) => {
  const getColorClass = (value: number) => {
    if (value >= 80) return "emerald";
    if (value >= 65) return "blue";
    if (value >= 50) return "amber";
    return "gray";
  };

  return (
    <div className="rounded-2xl border border-white/10 backdrop-blur-2xl bg-white/10 dark:bg-black/10 p-6 mb-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        Key Attributes
      </h3>
      
      <div className="space-y-4">
        {ATTRIBUTES.map(({ key, label, icon: Icon }) => {
          const value = attributes[key as keyof typeof attributes];
          const colorClass = getColorClass(value);
          
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                  </span>
                </div>
                <span className={`text-sm font-bold text-${colorClass}-600 dark:text-${colorClass}-400`}>
                  {value}%
                </span>
              </div>
              
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r from-${colorClass}-500 to-${colorClass}-600 transition-all duration-500`}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### 3. Star Card Component

**File:** `src/components/destiny-navigator/insights/StarCard.tsx`

```typescript
import React from "react";
import { Star as StarIcon, Sparkles } from "lucide-react";
import { Star } from "../../../utils/zwds/types";
import { StarData } from "../../../utils/destiny-navigator/star-data/star-interpretations";

interface StarCardProps {
  star: Star;
  starData: StarData;
  contribution: number;
  showEssence?: boolean;
  aspect: string;
}

export const StarCard: React.FC<StarCardProps> = ({
  star,
  starData,
  contribution,
  showEssence = false,
  aspect
}) => {
  // Calculate star rating based on brightness (bright = 4-5 stars, dim = 1-2 stars)
  const getBrightnessStars = (brightness: string, starData: StarData): number => {
    if (brightness === "bright") {
      // Higher brightness multiplier = more stars
      const multiplier = starData.brightness.bright;
      if (multiplier >= 1.3) return 5;
      if (multiplier >= 1.2) return 4;
      return 3;
    } else {
      // Lower brightness multiplier = fewer stars
      const multiplier = starData.brightness.dim;
      if (multiplier <= 0.7) return 1;
      if (multiplier <= 0.8) return 2;
      return 3;
    }
  };

  const getCategoryColor = (category: string): string => {
    return category === "major" ? "purple" : "cyan";
  };

  const starCount = getBrightnessStars(star.brightness, starData);
  const colorClass = getCategoryColor(starData.category);

  return (
    <div className={`rounded-xl border-2 border-${colorClass}-200 dark:border-${colorClass}-800 bg-gradient-to-br from-${colorClass}-50 to-white dark:from-${colorClass}-900/20 dark:to-gray-900 p-4 hover:shadow-lg transition-all`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className={`w-4 h-4 text-${colorClass}-600 dark:text-${colorClass}-400`} />
            <h4 className="font-bold text-gray-900 dark:text-white">
              {starData.name}
            </h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {starData.chineseName}
          </p>
        </div>
        
        <div className="text-right">
          <div className="flex gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className={`w-3 h-3 ${
                  i < starCount
                    ? `fill-${colorClass}-500 text-${colorClass}-500`
                    : "text-gray-300 dark:text-gray-600"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400">
            {star.brightness}
          </p>
        </div>
      </div>

      <div className={`text-xs font-bold text-${colorClass}-600 dark:text-${colorClass}-400 mb-2`}>
        +{contribution} points
      </div>

      {showEssence && (
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
          {starData.essences[aspect as keyof typeof starData.essences]}
        </p>
      )}
    </div>
  );
};
```

### 4. Focus Priorities Component

**File:** `src/components/destiny-navigator/insights/FocusPriorities.tsx`

```typescript
import React from "react";
import { Target } from "lucide-react";
import { FOCUS_CATEGORIES } from "../../../utils/destiny-navigator/focus-mappings";

interface FocusPrioritiesProps {
  priorities: Array<{ category: string; priority: number }>;
}

export const FocusPriorities: React.FC<FocusPrioritiesProps> = ({ priorities }) => {
  // Normalize priorities to 0-100 scale
  const maxPriority = Math.max(...priorities.map(p => p.priority));
  
  return (
    <div className="rounded-2xl border border-white/10 backdrop-blur-2xl bg-white/10 dark:bg-black/10 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Focus Priorities
        </h3>
      </div>

      <div className="space-y-3">
        {priorities.map(({ category, priority }) => {
          const focusData = FOCUS_CATEGORIES[category];
          if (!focusData) return null;

          const percentage = maxPriority > 0 ? Math.round((priority / maxPriority) * 100) : 0;

          return (
            <div key={category}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {focusData.label}
                </span>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className={`w-2 h-2 rounded-full ${
                        i < Math.ceil(percentage / 20)
                          ? "bg-amber-500"
                          : "bg-gray-300 dark:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {focusData.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

## Icon Library Usage

Import from Lucide React:
```typescript
import { Crown, TrendingUp, Heart, Baby, Coins, Activity, 
         Plane, Users, Briefcase, Home, Sparkles, Users2 } from "lucide-react";
```

## Quality Checklist

- [ ] All components use proper TypeScript types
- [ ] Tailwind classes are used consistently
- [ ] Dark mode support included
- [ ] Responsive design (works on mobile)
- [ ] Lucide React icons imported correctly
- [ ] No hardcoded colors (use Tailwind utilities)
- [ ] Components are reusable and props-driven

## Output Files

1. `src/components/destiny-navigator/insights/ContextHeader.tsx`
2. `src/components/destiny-navigator/insights/AttributeBars.tsx`
3. `src/components/destiny-navigator/insights/StarCard.tsx`
4. `src/components/destiny-navigator/insights/FocusPriorities.tsx`

Create the `insights/` directory if it doesn't exist.
