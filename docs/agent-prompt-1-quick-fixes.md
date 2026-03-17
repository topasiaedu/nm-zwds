# Agent Prompt 1 — Quick Fixes (Items 1, 2, 3)

You are implementing 3 quick UI feedback fixes in a React + TypeScript project.

## Rules You Must Follow

- TypeScript strict mode: **no `any` type, no `!` non-null assertion, no `as unknown as T` cast**
- All strings use **double quotes** `"`
- **Full code only** — no placeholder comments like `// ... rest of code`
- Include **JSDoc headers** and **inline comments** on any code you add
- Tailwind dynamic class names: if a class name is built dynamically, use **inline CSS** instead (Tailwind JIT will purge unknown classes)

---

## Task 1 of 3 — Reorder Blueprint Mode Buttons

**File:** `src/pages/result.tsx`

Find the blueprint mode switcher. It is an array of button objects around line 910. The current order is:
```
DNA Chart → Liu Nian (Yearly) → Da Yun (10 Year) → Liu Month (Monthly)
```

Change it to:
```
DNA Chart → Da Yun (10 Year) → Liu Nian (Yearly) → Liu Month (Monthly)
```

The array in the file looks like this (find it by searching for `blueprint.key`):
```tsx
{[
  { key: "dna",      label: "DNA Chart"           },
  { key: "liunian",  label: "Liu Nian (Yearly)"   },
  { key: "dayun",    label: "Da Yun (10 Year)"    },
  { key: "liumonth", label: "Liu Month (Monthly)" },
].map((blueprint) => { ... })}
```

Simply swap the `liunian` and `dayun` entries so `dayun` comes second.

---

## Task 2 of 3 — Update 化科 and 化忌 Card Config in FourKeyPalace

**File:** `src/components/analysis_v2/FourKeyPalace.tsx`

Find the `TRANSFORMATION_CONFIG` constant object. It has 4 keys: `"化祿"`, `"化權"`, `"化科"`, `"化忌"`.

Make these changes **only** to the `"化科"` and `"化忌"` entries:

### 化科 (Ke) — Fame-focused

Change:
```ts
"化科": {
  heroQuestion: "WHERE DOES TALENT SHINE?",
  icon: "✨",
  bars: [
    { label: "Talent",      pct: 85 },
    { label: "Recognition", pct: 70 },
    { label: "Refinement",  pct: 60 },
  ],
  // ... rest unchanged
}
```

To:
```ts
"化科": {
  heroQuestion: "WHERE DOES YOUR FAME RISE?",
  icon: "🌟",
  bars: [
    { label: "Reputation", pct: 85 },
    { label: "Visibility",  pct: 70 },
    { label: "Recognition", pct: 60 },
  ],
  // ... all other fields (colors, gradients) stay EXACTLY the same
}
```

### 化忌 (Ji) — Blocked energy

Change:
```ts
"化忌": {
  heroQuestion: "WHERE SHOULD I TREAD CAREFULLY?",
  icon: "🧭",
  bars: [
    { label: "Friction",   pct: 80 },
    { label: "Tension",    pct: 65 },
    { label: "Complexity", pct: 55 },
  ],
  // ... rest unchanged
}
```

To:
```ts
"化忌": {
  heroQuestion: "WHERE IS ENERGY BLOCKED?",
  icon: "⚠️",
  bars: [
    { label: "Blockage",   pct: 80 },
    { label: "Resistance", pct: 65 },
    { label: "Challenge",  pct: 55 },
  ],
  // ... all other fields (colors, gradients) stay EXACTLY the same
}
```

**Do not change** `"化祿"` or `"化權"` entries. Do not change any color values, gradient strings, or structural code.

---

## Task 3 of 3 — Slim Down DayunSection to Season Hero Only

**File:** `src/components/dayun/DayunSection.tsx`

The current file renders 5 sub-components. You need to **remove 4 of them**, keeping only `<DayunSeasonHero />`.

Current render block (simplified):
```tsx
return (
  <section className="mb-8 p-6 dark:bg-gray-900">
    {shouldShowHeader ? (
      <GradientSectionHeader ... />
    ) : null}

    {/* Season Hero - KEEP THIS */}
    <DayunSeasonHero dayun={dayunWithGuidance} />

    {/* REMOVE: Cycle Timeline */}
    <CycleTimeline dayun={dayunWithGuidance} />

    {/* REMOVE: Phase Intensity Chart */}
    <PhaseIntensityChart dayun={dayunWithGuidance} />

    {/* REMOVE: Guidance Cards */}
    <DayunGuidanceCards dayun={dayunWithGuidance} />

    {/* REMOVE: Reflection Questions */}
    <ReflectionQuestions questions={dayunWithGuidance.reflectionQuestions} />
  </section>
);
```

After your edit, the return block should only contain the header and `<DayunSeasonHero />`:
```tsx
return (
  <section className="mb-8 p-6 dark:bg-gray-900">
    {shouldShowHeader ? (
      <GradientSectionHeader
        badgeText="06"
        title="DAYUN SEASON ANALYSIS"
        subtitle="Your Current 10-Year Life Cycle Strategy"
        showDivider={true}
      />
    ) : null}

    {/* Season Hero — current 10-year cycle at a glance */}
    <DayunSeasonHero dayun={dayunWithGuidance} />
  </section>
);
```

**Important:** Remove only the JSX render calls. Keep the `import` statement at the top as-is — do not remove any imports even if they become unused, as the user will clean those up separately to avoid breaking other things.

The `generateDayunGuidance(dayunCycle)` call can stay since it feeds `DayunSeasonHero`.

---

## Verification

After all 3 tasks:
1. `result.tsx` button order: DNA → Da Yun → Liu Nian → Liu Month
2. `FourKeyPalace.tsx`: 化科 says "WHERE DOES YOUR FAME RISE?" with 🌟, 化忌 says "WHERE IS ENERGY BLOCKED?" with ⚠️
3. `DayunSection.tsx`: Only `DayunSeasonHero` renders, all 4 other sub-components removed from JSX

No new files needed. No type changes needed. No logic changes needed.
