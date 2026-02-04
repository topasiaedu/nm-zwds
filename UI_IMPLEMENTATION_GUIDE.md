# 🎨 Destiny Navigator InsightsPanel - UI Implementation Guide

## Overview
This guide walks through implementing the visual data dashboard for the Destiny Navigator's InsightsPanel component using real star data.

---

## 📦 What We're Building

A modern, data-driven insights component with:
- **Visual quality score** (0-100) with status indicator
- **5 attribute bars** (authority, resources, strategy, discipline, flow)
- **Star cards** showing brightness and contribution
- **Focus priorities** generated from star keywords
- **Adaptive detail** (natal shows all stars, monthly shows 1)

---

## 🎯 Implementation Sequence

### **Phase 1: Data Utilities** (Agent 1)
**Prompt:** `UI_AGENT_1_PROMPT.md`

**Creates:**
- `src/utils/destiny-navigator/focus-mappings.ts` - Keyword to focus category mapping
- `src/utils/destiny-navigator/metrics-calculator.ts` - Calculation functions

**Output:** Pure utility functions, no UI code

**Time:** ~30-40 minutes

**Verification:**
```bash
npx tsc --noEmit src/utils/destiny-navigator/metrics-calculator.ts
npx tsc --noEmit src/utils/destiny-navigator/focus-mappings.ts
```

---

### **Phase 2: UI Sub-Components** (Agent 2)
**Prompt:** `UI_AGENT_2_PROMPT.md`

**Prerequisites:**
```bash
npm install lucide-react
```

**Creates:**
- `src/components/destiny-navigator/insights/ContextHeader.tsx`
- `src/components/destiny-navigator/insights/AttributeBars.tsx`
- `src/components/destiny-navigator/insights/StarCard.tsx`
- `src/components/destiny-navigator/insights/FocusPriorities.tsx`

**Output:** Reusable visual components

**Time:** ~40-50 minutes

**Verification:**
```bash
npx tsc --noEmit src/components/destiny-navigator/insights/*.tsx
```

---

### **Phase 3: Main Integration** (Agent 3)
**Prompt:** `UI_AGENT_3_PROMPT.md`

**Creates:**
- Refactored `src/components/destiny-navigator/analysis/InsightsPanel.tsx`
- `src/components/destiny-navigator/insights/index.tsx`

**Output:** Complete integrated component

**Time:** ~30-40 minutes

**Verification:**
```bash
npm run lint
npm run build
```

---

## 🔄 Execution Flow

```
┌─────────────────────────────────────────┐
│ START: Star data already generated      │
│ (star-interpretations.ts exists)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ AGENT 1: Data Utilities                 │
├─────────────────────────────────────────┤
│ • Focus mappings                        │
│ • Metrics calculator                    │
│ • Filtering & ranking logic             │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ AGENT 2: UI Sub-Components              │
├─────────────────────────────────────────┤
│ • Install lucide-react                  │
│ • ContextHeader                         │
│ • AttributeBars                         │
│ • StarCard                              │
│ • FocusPriorities                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ AGENT 3: Main Integration               │
├─────────────────────────────────────────┤
│ • Refactor InsightsPanel                │
│ • Connect all pieces                    │
│ • Replace mock data                     │
│ • Export index file                     │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│ COMPLETE: Test & Deploy                 │
│ • Visual insights working               │
│ • Real chart data displayed             │
│ • All 48 combinations supported         │
└─────────────────────────────────────────┘
```

---

## 📊 Data Flow

```
User selects: Wealth + Dayun
        ↓
InsightsPanel receives: profile, aspect, timeframe
        ↓
Calculate chart from profile → chartData
        ↓
Resolve palace: getPalaceForAspectDayun(aspect, chartData) → Palace 7
        ↓
Extract palace stars: [Zi Wei, Tian Fu, Wen Chang]
        ↓
Calculate metrics:
  • qualityScore = calculatePalaceQuality(palace)
  • attributes = calculatePalaceAttributes(palace)
  • rankedStars = filterStarsByRelevance(stars, aspect, 3)
  • priorities = generateFocusPriorities(rankedStars, 3)
        ↓
Render components:
  • ContextHeader(qualityScore, starDensity)
  • AttributeBars(attributes)
  • StarCard × 3 (top ranked stars)
  • FocusPriorities(priorities)
        ↓
User sees: Visual data dashboard with their unique chart
```

---

## 🎨 Design System

### **Icons (Lucide React)**
```typescript
import { 
  Crown,        // Authority, life
  TrendingUp,   // Wealth, career
  Heart,        // Relationships
  Baby,         // Children
  Coins,        // Resources
  Activity,     // Health
  Plane,        // Travel
  Users,        // Social
  Briefcase,    // Career
  Home,         // Home
  Sparkles,     // Fortune, stars
  Users2        // Parents, siblings
} from "lucide-react";
```

### **Color System**
- **Exceptional (80-100):** Emerald-500
- **Strong (65-79):** Blue-500
- **Moderate (50-64):** Amber-500
- **Developing (0-49):** Gray-400

### **Spacing**
- Component gaps: `space-y-6`
- Card padding: `p-6`
- Inner padding: `p-4`

---

## ✅ Testing Strategy

### **Unit Tests**
```typescript
// Test metrics calculator
expect(calculatePalaceQuality(palace)).toBeLessThanOrEqual(100);
expect(calculatePalaceAttributes(palace).authority).toBeGreaterThanOrEqual(0);

// Test filtering
expect(filterStarsByRelevance(stars, "wealth", 3)).toHaveLength(3);
```

### **Visual Tests**
1. **Natal:** Should show all stars in palace
2. **Dayun:** Should show top 3 stars
3. **Liu Nian:** Should show top 2 stars
4. **Liu Month:** Should show top 1 star

### **Integration Tests**
- All 12 aspects render
- All 4 timeframes render
- Quality scores range 0-100
- No TypeScript errors
- No console errors

---

## 📝 Common Issues & Solutions

### **Issue: Tailwind dynamic classes not working**
```typescript
// ❌ Wrong (Tailwind won't generate)
className={`bg-${color}-500`}

// ✅ Correct (use data attributes or mapping)
const colorMap = {
  emerald: "bg-emerald-500",
  blue: "bg-blue-500"
};
className={colorMap[color]}
```

### **Issue: Missing star data**
```typescript
// Always check if star data exists
const starData = STAR_INTERPRETATIONS[star.name];
if (!starData) return null;
```

### **Issue: Palace not found**
```typescript
// Add error handling
if (!palaceNumber) {
  return <ErrorState message="Could not resolve palace" />;
}
```

---

## 🚀 Deployment Checklist

- [ ] All 3 agent phases completed
- [ ] TypeScript compiles with no errors
- [ ] ESLint passes
- [ ] Build succeeds
- [ ] Tested all 12 aspects
- [ ] Tested all 4 timeframes
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Icons display correctly
- [ ] Data is accurate (matches star-interpretations.ts)

---

## 📦 Final File Structure

```
src/
├── utils/
│   └── destiny-navigator/
│       ├── palace-resolver.ts (existing)
│       ├── focus-mappings.ts (new)
│       ├── metrics-calculator.ts (new)
│       └── star-data/
│           ├── star-interpretations.ts (existing)
│           └── README.md (existing)
└── components/
    └── destiny-navigator/
        ├── analysis/
        │   └── InsightsPanel.tsx (refactored)
        └── insights/
            ├── index.tsx (new)
            ├── ContextHeader.tsx (new)
            ├── AttributeBars.tsx (new)
            ├── StarCard.tsx (new)
            └── FocusPriorities.tsx (new)
```

---

## ⏱️ Total Timeline

- **Agent 1:** 30-40 min (utilities)
- **Agent 2:** 40-50 min (components)
- **Agent 3:** 30-40 min (integration)
- **Testing:** 20-30 min
- **Total:** ~2-3 hours

---

## 🎯 Success Criteria

**You know it's working when:**
1. Navigate to Destiny Navigator
2. Select any aspect (e.g., Wealth)
3. Select any timeframe (e.g., Dayun)
4. See visual dashboard with:
   - Quality score (0-100)
   - 5 attribute bars
   - Top stars displayed
   - Focus priorities listed
5. Data changes when switching aspects/timeframes
6. No errors in console
7. Looks great in both light and dark mode

---

## 📚 Additional Resources

- **Lucide Icons:** https://lucide.dev/icons
- **Tailwind CSS:** https://tailwindcss.com/docs
- **TypeScript:** https://www.typescriptlang.org/docs

---

**Ready to execute!** Start with Agent 1 and work sequentially through each phase.
