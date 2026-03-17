# Destiny Alert Map — Agent Implementation Prompts

Run these prompts **in order**. Each task is self-contained and sized to fit within a single agent context window. Do not skip tasks — each one depends on the previous.

---

## Task 1 — Fix AreasOfLife Badge Number

**Context:**
The analysis sections in `src/pages/result.tsx` are numbered 01–05. We are inserting a new section (Destiny Alert Map) as **05**, which means the existing AreasOfLife section must move from **05** → **06**.

**File to edit:** `src/components/analysis_v2/AreasOfLIfe.tsx`

**Change:**
Find the `GradientSectionHeader` usage and update `badgeText` from `"05"` to `"06"`:

```tsx
// Before
<GradientSectionHeader
  badgeText="05"
  title="DESTINY SCOREBOARD"
  subtitle="Your personal scorecard across the 5 destiny pillars."
  showDivider={true}
/>

// After
<GradientSectionHeader
  badgeText="06"
  title="DESTINY SCOREBOARD"
  subtitle="Your personal scorecard across the 5 destiny pillars."
  showDivider={true}
/>
```

**Verification:** Run the linter on `AreasOfLIfe.tsx` and confirm no new errors. That's the only change in this task.

---

## Task 2 — Generate New Destiny Alert Constants (Star × Transformation Data)

**Context:**
The current constants file `src/utils/zwds/analysis_constants/destiny_alert.ts` is keyed by `palace (1–12) × transformation (4)` = 48 entries. This produces the same reading for two people who both have the same transformation in the same palace but with *different stars*. We are replacing this with a `star × transformation` keying (~39 entries) so the insight is specific to which star carries each transformation.

**How transformations are assigned (from year heavenly stem / 天干):**

| Year Stem | 化祿 | 化權 | 化科 | 化忌 |
|---|---|---|---|---|
| 甲 | 廉貞 | 破軍 | 武曲 | 太陽 |
| 乙 | 天機 | 天梁 | 紫微 | 太陰 |
| 丙 | 天同 | 天機 | 文昌 | 廉貞 |
| 丁 | 太陰 | 天同 | 天機 | 巨門 |
| 戊 | 貪狼 | 太陰 | 右弼 | 天機 |
| 己 | 武曲 | 貪狼 | 天梁 | 文曲 |
| 庚 | 太陽 | 武曲 | 太陰 | 天同 |
| 辛 | 巨門 | 太陽 | 文曲 | 文昌 |
| 壬 | 天梁 | 紫微 | 左輔 | 武曲 |
| 癸 | 破軍 | 巨門 | 太陰 | 貪狼 |

**Valid combinations to generate:**

化祿 (10): 廉貞, 天機, 天同, 太陰, 貪狼, 武曲, 太陽, 巨門, 天梁, 破軍
化權 (10): 破軍, 天梁, 天機, 天同, 太陰, 貪狼, 武曲, 太陽, 巨門, 紫微
化科 (9): 武曲, 紫微, 文昌, 天機, 右弼, 天梁, 太陰, 文曲, 左輔
化忌 (10): 太陽, 太陰, 廉貞, 巨門, 天機, 文曲, 天同, 文昌, 武曲, 貪狼

**Data structure for each entry:**

```typescript
type DestinyAlertStarEntry = {
  /** The star carrying this transformation (Chinese name, e.g. "廉貞") */
  starName: string;
  /** The transformation type (e.g. "化祿") */
  transformation: string;
  /**
   * Line 1 — Theme: What this star's energy means when it undergoes this transformation.
   * One sentence. About the energy/nature.
   */
  line1: string;
  /**
   * Line 2 — Reality: How this shows up practically in life.
   * One sentence. Grounded and specific.
   */
  line2: string;
  /**
   * Line 3 — Directive: What to do or watch out for.
   * One sentence. Action-oriented. This line will be rendered bold/italic in the UI.
   */
  line3: string;
};
```

**Star energies for reference when writing copy:**

| Star | Core Energy |
|---|---|
| 紫微 | The Emperor — nobility, authority, high standards, leadership |
| 天機 | The Strategist — intelligence, adaptability, planning, overthinking |
| 太陽 | The Sun — generosity, visibility, outward giving, public roles |
| 武曲 | The General — decisiveness, finance, discipline, directness |
| 天同 | The Idealist — enjoyment, peace-seeking, emotional sensitivity, leisure |
| 廉貞 | The Imprisoned Star — desire, passion, risk, self-restraint |
| 天府 | The Treasury — stability, resources, conservatism, accumulation |
| 太陰 | The Moon — intuition, femininity, wealth through subtlety, emotional depth |
| 貪狼 | The Wolf — charisma, desire, talent, acquisition, seduction |
| 巨門 | The Gate — communication, controversy, investigation, clarity through conflict |
| 天相 | The Minister — support, dependability, form, mediation |
| 天梁 | The Elder — wisdom, justice, health, protection, authority through experience |
| 七殺 | The Warrior — fierce independence, confrontation, sharp execution |
| 破軍 | The Destroyer — radical change, breaking and rebuilding, pioneering |
| 文昌 | The Scholar — academic talent, refinement, written/verbal expression |
| 文曲 | The Artist — creative talent, emotional expression, sensitivity |
| 左輔 | The Left Assistant — supportive energy, collaborative help, auspicious timing |
| 右弼 | The Right Assistant — supportive energy, resource attraction, quiet backing |

**Transformation meanings for reference:**

| Transformation | What it does to the star |
|---|---|
| 化祿 | Amplifies the star's positive, abundance-generating energy. Flow, attraction, ease. |
| 化權 | Amplifies the star's power, control, and assertive energy. Authority, force, ambition. |
| 化科 | Amplifies the star's intellectual, reputational, and refining energy. Recognition, grace, talent. |
| 化忌 | Creates friction, blockage, or obstruction in the star's domain. Tension, challenge, complexity. |

**Instructions:**

1. Create a new file `src/utils/zwds/analysis_constants/destiny_alert_star.ts`
2. Export a typed constant `DESTINY_ALERT_STAR_CONSTANTS` as `Record<string, DestinyAlertStarEntry>`
3. The key format is `"starName_transformation"` using the traditional Chinese characters, e.g.:
   - `"廉貞_化祿"`, `"天機_化權"`, `"紫微_化科"`, `"太陽_化忌"` etc.
4. Write all ~39 entries with:
   - `line1`: theme sentence (star energy + transformation nature)
   - `line2`: practical reality sentence (how it manifests)
   - `line3`: directive sentence (action/watch — this will be **bold** in UI)
5. Keep each line to 10–15 words max — punchy, not a paragraph
6. Do NOT use the old palace-based descriptions from `destiny_alert.ts` as source — write fresh, star-specific copy
7. The old file `destiny_alert.ts` should remain untouched (it will be removed in Task 3)

**Example entries for reference:**

```typescript
"廉貞_化祿": {
  starName: "廉貞",
  transformation: "化祿",
  line1: "Your passionate, magnetic nature becomes a wealth attractor.",
  line2: "Desire and drive pull opportunities and people into your orbit.",
  line3: "Channel intensity into a clear direction — and watch money follow.",
},
"太陽_化忌": {
  starName: "太陽",
  transformation: "化忌",
  line1: "Your generosity and outward giving are creating a slow drain.",
  line2: "You may be over-giving in public roles while neglecting your own reserves.",
  line3: "Set limits on what you give freely — protect your own energy first.",
},
"紫微_化科": {
  starName: "紫微",
  transformation: "化科",
  line1: "The Emperor's presence earns recognition through quiet authority.",
  line2: "People notice your standards, depth, and integrity before you speak.",
  line3: "Invest in how you present yourself — reputation compounds over time.",
},
```

**Verification:** Ensure TypeScript compiles with no errors. Run linter on the new file.

---

## Task 3 — Update destinyAlertAnalysis.ts to Use New Constants

**Context:**
The analysis utility `src/utils/zwds/analysis/destinyAlertAnalysis.ts` currently:
1. Finds which star carries each transformation and which palace it sits in
2. Looks up the description from `DESTINY_ALERT_CONSTANTS` (palace-keyed)
3. Returns `{ palace, transformation, description, quote, palaceNumber, starName }`

We need to update it to:
1. Keep finding the star and palace (no change to that logic)
2. Look up from `DESTINY_ALERT_STAR_CONSTANTS` (star-keyed) instead
3. Return `{ palace, transformation, line1, line2, line3, palaceNumber, starName }`

**File to edit:** `src/utils/zwds/analysis/destinyAlertAnalysis.ts`

**Current `PalaceAlertData` type:**
```typescript
export type PalaceAlertData = {
  palace: string;
  transformation: string;
  description: string;
  quote: string;
  palaceNumber: number;
  starName: string;
};
```

**New `PalaceAlertData` type:**
```typescript
export type PalaceAlertData = {
  /** English name of the palace where the transformation activates (e.g. "Life Palace") */
  palace: string;
  /** The transformation type in traditional Chinese (e.g. "化祿") */
  transformation: string;
  /** Line 1 — Theme of the activation */
  line1: string;
  /** Line 2 — How it manifests practically */
  line2: string;
  /** Line 3 — The directive (rendered bold in UI) */
  line3: string;
  /** Physical palace number (1–12) */
  palaceNumber: number;
  /** The star carrying this transformation (Chinese name) */
  starName: string;
};
```

**Changes to `analyzeDestinyAlert` function:**

Replace the lookup block that currently uses `DESTINY_ALERT_CONSTANTS` and `PALACE_NAME_TO_ENGLISH` with a lookup against `DESTINY_ALERT_STAR_CONSTANTS`:

```typescript
// New lookup key
const lookupKey = `${starName}_${transformation}`;
const starEntry = DESTINY_ALERT_STAR_CONSTANTS[lookupKey];

if (starEntry) {
  alerts.push({
    palace: englishName,        // still resolved from palace.name as before
    transformation,
    line1: starEntry.line1,
    line2: starEntry.line2,
    line3: starEntry.line3,
    palaceNumber: palace.number,
    starName,
  });
} else {
  console.warn(`No destiny alert entry found for key: ${lookupKey}`);
}
```

**Important:**
- The `PALACE_NAME_TO_ENGLISH` map and the palace English name resolution logic should be **kept** — we still need the English palace name for display in the UI
- The `TRANSFORMATION_KEY_MAP` (normalising traditional/simplified variants) should also be **kept** for the lookup key normalisation
- Remove the import of `DESTINY_ALERT_CONSTANTS` from `destiny_alert.ts`
- Add the import of `DESTINY_ALERT_STAR_CONSTANTS` from `destiny_alert_star.ts`
- Remove the old `processDescription` helper function (no longer needed)

**Verification:** Run linter on `destinyAlertAnalysis.ts`. Ensure no TypeScript errors.

---

## Task 4 — Revamp FourKeyPalace.tsx Component

**Context:**
This is the main visual revamp. Read the full design spec before implementing.

**File to edit:** `src/components/analysis_v2/FourKeyPalace.tsx`

**Imports needed:**
```typescript
import React from "react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeDestinyAlert } from "../../utils/zwds/analysis";
import GradientSectionHeader from "./shared/GradientSectionHeader";
```

Note: Remove the `react-tilt` import entirely.

---

### Static Configuration

Define these outside the component (above the component function):

```typescript
/**
 * Hero question, icon, colors, and energy bar definitions for each transformation type.
 * These are STATIC per transformation — they don't change per person.
 */
type TransformationConfig = {
  /** The big question displayed at the top of the card */
  heroQuestion: string;
  /** Emoji icon for the hero question */
  icon: string;
  /** 3 energy bars: each has a label and a fixed percentage (0–100) */
  bars: Array<{ label: string; pct: number }>;
  /** Tailwind classes for the card's colored header background */
  headerBg: string;
  /** Tailwind classes for the card's body background gradient */
  bodyBg: string;
  /** Tailwind classes for the card's border */
  border: string;
  /** Tailwind classes for the bar fill color */
  barColor: string;
  /** Tailwind classes for the hero question text color */
  heroColor: string;
  /** Tailwind classes for the watermark character color */
  watermarkColor: string;
  /** The single Chinese character to show as a watermark (祿/權/科/忌) */
  watermarkChar: string;
};

const TRANSFORMATION_CONFIG: Record<string, TransformationConfig> = {
  "化祿": {
    heroQuestion: "WHERE DOES WEALTH FLOW?",
    icon: "💰",
    bars: [
      { label: "Abundance", pct: 85 },
      { label: "Flow",      pct: 70 },
      { label: "Ease",      pct: 60 },
    ],
    headerBg:      "bg-emerald-600",
    bodyBg:        "bg-gradient-to-br from-emerald-50 to-green-100 dark:from-emerald-950/30 dark:to-green-900/20",
    border:        "border-emerald-300 dark:border-emerald-700",
    barColor:      "bg-emerald-500",
    heroColor:     "text-emerald-700 dark:text-emerald-300",
    watermarkColor:"text-emerald-500",
    watermarkChar: "祿",
  },
  "化權": {
    heroQuestion: "WHERE DOES POWER RISE?",
    icon: "👑",
    bars: [
      { label: "Authority", pct: 90 },
      { label: "Drive",     pct: 75 },
      { label: "Control",   pct: 65 },
    ],
    headerBg:      "bg-blue-600",
    bodyBg:        "bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-900/20",
    border:        "border-blue-300 dark:border-blue-700",
    barColor:      "bg-blue-500",
    heroColor:     "text-blue-700 dark:text-blue-300",
    watermarkColor:"text-blue-500",
    watermarkChar: "權",
  },
  "化科": {
    heroQuestion: "WHERE DOES TALENT SHINE?",
    icon: "✨",
    bars: [
      { label: "Talent",      pct: 85 },
      { label: "Recognition", pct: 70 },
      { label: "Refinement",  pct: 60 },
    ],
    headerBg:      "bg-amber-500",
    bodyBg:        "bg-gradient-to-br from-amber-50 to-yellow-100 dark:from-amber-950/30 dark:to-yellow-900/20",
    border:        "border-amber-300 dark:border-amber-700",
    barColor:      "bg-amber-500",
    heroColor:     "text-amber-700 dark:text-amber-300",
    watermarkColor:"text-amber-500",
    watermarkChar: "科",
  },
  "化忌": {
    heroQuestion: "WHERE SHOULD I TREAD CAREFULLY?",
    icon: "🧭",
    bars: [
      { label: "Friction",   pct: 80 },
      { label: "Tension",    pct: 65 },
      { label: "Complexity", pct: 55 },
    ],
    headerBg:      "bg-red-600",
    bodyBg:        "bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-950/30 dark:to-rose-900/20",
    border:        "border-red-300 dark:border-red-700",
    barColor:      "bg-red-500",
    heroColor:     "text-red-700 dark:text-red-300",
    watermarkColor:"text-red-500",
    watermarkChar: "忌",
  },
};

/** Normalise traditional/simplified variants to a single config key */
const normaliseTransformation = (t: string): string => {
  if (t === "化禄") return "化祿";
  if (t === "化权") return "化權";
  return t;
};
```

---

### Component Implementation

```typescript
type FourKeyPalaceProps = {
  chartData: ChartData;
};

const FourKeyPalace: React.FC<FourKeyPalaceProps> = ({ chartData }) => {
  const analysisResult = analyzeDestinyAlert(chartData);

  if (analysisResult.alerts.length === 0) {
    return (
      <div className="dark:bg-gray-900">
        <GradientSectionHeader
          badgeText="05"
          title="DESTINY ALERT MAP"
          subtitle="Four signals showing where your life force is most activated."
        />
        <p className="text-center text-gray-500 dark:text-gray-400 py-8 px-6">
          No transformation data available.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900">
      {/* Section header — matches all other analysis sections */}
      <GradientSectionHeader
        badgeText="05"
        title="DESTINY ALERT MAP"
        subtitle="Four signals showing where your life force is most activated."
      />

      {/* 2 × 2 card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-6 pb-6">
        {analysisResult.alerts.map((alert) => {
          const key = normaliseTransformation(alert.transformation);
          const config = TRANSFORMATION_CONFIG[key] ?? TRANSFORMATION_CONFIG["化忌"];

          return (
            <div
              key={`${alert.palaceNumber}-${alert.transformation}`}
              className={`relative rounded-2xl border-2 overflow-hidden ${config.bodyBg} ${config.border} flex flex-col`}
            >
              {/* Zone 1 — Hero question (colored header strip) */}
              <div className={`${config.headerBg} px-5 py-4`}>
                <p className="text-white font-black text-lg tracking-wide leading-tight">
                  {config.icon} {config.heroQuestion}
                </p>
              </div>

              {/* Watermark character — large faded in background */}
              <div
                className={`absolute bottom-0 right-2 text-[110px] font-black leading-none select-none pointer-events-none opacity-[0.06] ${config.watermarkColor}`}
                aria-hidden="true"
              >
                {config.watermarkChar}
              </div>

              <div className="relative z-10 p-5 flex flex-col gap-4 flex-1">
                {/* Zone 2 — Star → Palace */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold bg-black/10 dark:bg-white/10 text-gray-800 dark:text-gray-100 px-3 py-1 rounded-full">
                    {alert.starName}
                  </span>
                  <span className="text-gray-400 dark:text-gray-500 text-base font-bold">→</span>
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                    {alert.palace}
                  </span>
                </div>

                {/* Zone 3 — Energy profile bars */}
                <div className="flex flex-col gap-2">
                  {config.bars.map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400 w-24 flex-shrink-0">
                        {bar.label}
                      </span>
                      <div className="flex-1 bg-black/10 dark:bg-white/10 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${config.barColor} transition-all duration-700`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 w-8 text-right flex-shrink-0">
                        {bar.pct}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Zone 4 — 3-line insight */}
                <div className="flex flex-col gap-1 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <p>{alert.line1}</p>
                  <p>{alert.line2}</p>
                  <p className="font-semibold italic">{alert.line3}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FourKeyPalace;
```

---

### Notes for Task 4

- Do NOT use `react-tilt` — remove it entirely
- Do NOT add any CSS `<style>` tags or `dangerouslySetInnerHTML`
- The `GradientSectionHeader` component is at `./shared/GradientSectionHeader` — it handles the divider line internally (the `showDivider` prop defaults to `true`)
- Card order in the grid will follow the order alerts are returned by `analyzeDestinyAlert` — which processes transformations in the order `["化祿", "化權", "化科", "化忌"]`, so the grid will be: Lu (top-left), Quan (top-right), Ke (bottom-left), Ji (bottom-right) on desktop

**Verification:** Run linter on `FourKeyPalace.tsx`. Ensure no TypeScript errors, no `any` types, no non-null assertions.

---

## Task 5 — Final Integration Check

After completing Tasks 1–4, do a final check across all modified files:

1. **`src/components/analysis_v2/AreasOfLIfe.tsx`** — confirm `badgeText="06"`
2. **`src/utils/zwds/analysis_constants/destiny_alert_star.ts`** — confirm all ~39 entries exist, TypeScript compiles cleanly
3. **`src/utils/zwds/analysis/destinyAlertAnalysis.ts`** — confirm:
   - Imports `DESTINY_ALERT_STAR_CONSTANTS` from `destiny_alert_star.ts`
   - Does NOT import from the old `destiny_alert.ts`
   - `PalaceAlertData` type has `line1`, `line2`, `line3` (no `description`, no `quote`)
   - No TypeScript errors
4. **`src/components/analysis_v2/FourKeyPalace.tsx`** — confirm:
   - No `react-tilt` import
   - Uses `GradientSectionHeader` with `badgeText="05"`
   - 2×2 grid layout (`grid-cols-1 sm:grid-cols-2`)
   - All 5 zones rendered per card
   - No TypeScript errors

**Old file `src/utils/zwds/analysis_constants/destiny_alert.ts`** — this file can be left in place for now (it is no longer imported anywhere after Task 3). It can be deleted in a future cleanup pass.

**Run the linter one final time across all 4 modified files** and fix any remaining warnings.
