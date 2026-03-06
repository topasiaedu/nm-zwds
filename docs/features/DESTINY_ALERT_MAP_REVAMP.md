# Destiny Alert Map — Revamp Feature Overview

## What Is the Destiny Alert Map?

The **Destiny Alert Map** is a section in the Result page (`src/pages/result.tsx`) that displays the four natal transformations from a person's ZWDS (Zi Wei Dou Shu) chart. Every chart has exactly four transformations — one per type:

| Symbol | Pinyin | Meaning |
|---|---|---|
| 化祿 | Huà Lù (Lu) | Fortune / Wealth flowing |
| 化權 | Huà Quán (Quan) | Authority / Power rising |
| 化科 | Huà Kē (Ke) | Talent / Reputation shining |
| 化忌 | Huà Jì (Ji) | Friction / Caution — tread carefully |

Each transformation is carried by a **specific star** (determined by the person's birth year heavenly stem), and that star sits in a **specific palace** in the chart. The palace tells you *which life area* is activated.

---

## How Transformations Work in ZWDS

- The 4 transformations are each assigned to one of the 14 main stars depending on the **year of birth (heavenly stem / 天干)**
- Only specific stars can carry each transformation — not all 14 can carry all 4
- The palace where the star sits is **dynamic per person** — it's resolved from the chart data at runtime
- Therefore: `star × transformation` is the meaningful data unit (not `palace × transformation`)

### Valid Star–Transformation Combinations (~39 total)

Derived from the 10 Heavenly Stems:

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

Unique stars per transformation:
- **化祿** (10): 廉貞, 天機, 天同, 太陰, 貪狼, 武曲, 太陽, 巨門, 天梁, 破軍
- **化權** (10): 破軍, 天梁, 天機, 天同, 太陰, 貪狼, 武曲, 太陽, 巨門, 紫微
- **化科** (9): 武曲, 紫微, 文昌, 天機, 右弼, 天梁, 太陰, 文曲, 左輔
- **化忌** (10): 太陽, 太陰, 廉貞, 巨門, 天機, 文曲, 天同, 文昌, 武曲, 貪狼

---

## Current State (Problems)

**Component:** `src/components/analysis_v2/FourKeyPalace.tsx`
**Data:** `src/utils/zwds/analysis_constants/destiny_alert.ts`
**Analysis util:** `src/utils/zwds/analysis/destinyAlertAnalysis.ts`

### Problems with the current implementation:

1. **Wrong data keying** — data is keyed by `palace × transformation` (12 × 4 = 48 entries). This produces the same reading for two people who both have 化祿 in Life Palace but with different stars. The star is the key differentiator.

2. **Wall of text** — cards display a long scrollable description + a blockquote. Users skip it entirely.

3. **No purpose clarity** — users don't immediately understand what each transformation is *for*. They don't know to "look at Lu for wealth" without being told.

4. **Missing section header** — the component uses a plain `<h2>` instead of the `GradientSectionHeader` used by all other analysis components.

5. **Wrong badge number** — Destiny Alert Map should be **05**, and AreasOfLife (currently 05) should become **06**.

6. **Visual monotony** — all 4 cards look the same. Nothing differentiates at a glance.

---

## New Design Direction

### Core Principle
> The card itself must answer "what is this for?" without any external legend or decoder strip. The design teaches the system by being the system.

### Each Card: "Signal Card" Layout

Each of the 4 cards answers one unmistakable question at the top:

| Card | Hero Question | Color |
|---|---|---|
| 化祿 | 💰 WHERE DOES WEALTH FLOW? | Green |
| 化權 | 👑 WHERE DOES POWER RISE? | Blue |
| 化科 | ✨ WHERE DOES TALENT SHINE? | Amber |
| 化忌 | 🧭 WHERE SHOULD I TREAD CAREFULLY? | Red |

### Card Zone Structure

```
┌────────────────────────────────────────────────┐
│                                                │
│  💰 WHERE DOES WEALTH FLOW?   (large, bold)    │  Zone 1: Hero question
│                                                │
├────────────────────────────────────────────────┤
│  [ 廉貞 ]  ──────────────→  Life Palace        │  Zone 2: Star → Palace
├────────────────────────────────────────────────┤
│                                                │
│  Wealth    ████████░░  80%                     │
│  Flow      ██████░░░░  60%                     │  Zone 3: Energy bars (3 bars)
│  Ease      █████░░░░░  50%                     │
│                                                │
├────────────────────────────────────────────────┤
│                                                │
│  Your charm and presence are the magnet.       │
│  People come — and so does money.              │  Zone 4: 3 lines of insight
│  Show up fully. Stop chasing.                  │
│                                                │
│                              化祿 (watermark)  │  Zone 5: Chinese char stamp
└────────────────────────────────────────────────┘
```

### Zone Details

**Zone 1 — Hero Question**
- Large, bold text in the card's accent color
- Immediately tells the user what this card answers
- Icon + question format (e.g., 💰 WHERE DOES WEALTH FLOW?)

**Zone 2 — Star → Palace**
- Star name in a pill chip
- Arrow (→) pointing to the palace name
- This is the "your personal answer" to the question above

**Zone 3 — Energy Profile Bars**
- 3 mini progress bars, **static per transformation type** (fixed values, not calculated)
- Based on classical ZWDS theory (e.g., 化祿 is high on Wealth, medium on Flow, lower on Ease)
- Bar labels and values are fixed per transformation, not per person
- Uses Tailwind `w-[X%]` with a smooth transition animation

The fixed bar values per transformation:

| Transformation | Bar 1 | Bar 2 | Bar 3 |
|---|---|---|---|
| 化祿 | Abundance 85% | Flow 70% | Ease 60% |
| 化權 | Authority 90% | Drive 75% | Control 65% |
| 化科 | Talent 85% | Recognition 70% | Refinement 60% |
| 化忌 | Friction 80% | Tension 65% | Complexity 55% |

**Zone 4 — 3 Lines of Insight**
- Exactly 3 lines, no more
- Line 1: What this star's energy means in this activation (theme)
- Line 2: How it shows up practically (reality)
- Line 3: The directive — what to do or watch (bold/italic)
- Source: new `star × transformation` data constants

**Zone 5 — Chinese Character Watermark**
- The transformation character (祿/權/科/忌) large and faded in the bottom-right
- Opacity ~5–8%, purely decorative
- Serves as a signature for users familiar with the system

### Grid Layout
- 2 × 2 grid on `sm` and above
- Single column on mobile
- No `react-tilt` (removed — gimmicky on mobile, causes layout issues)
- Fixed card height — no scrolling, no overflow

---

## Data Restructuring

### Old structure (to be replaced)
```typescript
// Keyed by palace number (1–12) × transformation
DESTINY_ALERT_CONSTANTS["1"]["化禄"] = {
  title: "...",
  description: "...(long)..."
}
```

### New structure
```typescript
// Keyed by "starName_transformation"
DESTINY_ALERT_STAR_CONSTANTS["廉貞_化祿"] = {
  starName: "廉貞",
  transformation: "化祿",
  line1: "Your desire nature becomes your magnetic force.", // theme
  line2: "People and money are drawn to your presence.",   // reality
  line3: "Stop chasing — start radiating.",                // directive (bold)
}
```

### Lookup flow in `destinyAlertAnalysis.ts`
1. Find which star carries each transformation (already done — `findPalaceWithTransformation`)
2. Find which palace that star sits in (already done)
3. Look up `DESTINY_ALERT_STAR_CONSTANTS[starName + "_" + transformation]` for the 3-line insight
4. Return `{ starName, palace, transformation, line1, line2, line3 }`

---

## Files to Change

| File | Change |
|---|---|
| `src/utils/zwds/analysis_constants/destiny_alert.ts` | Replace with new `star × transformation` keyed constants (~39 entries) |
| `src/utils/zwds/analysis/destinyAlertAnalysis.ts` | Update `PalaceAlertData` type and lookup to use new constants |
| `src/components/analysis_v2/FourKeyPalace.tsx` | Full revamp — new card layout, hero question, bars, 3-line insight |
| `src/components/analysis_v2/AreasOfLIfe.tsx` | Update `badgeText` from `"05"` to `"06"` |

---

## Section Numbering (after change)

| # | Section | Component |
|---|---|---|
| 01 | Overview | `Overview.tsx` |
| 02 | Wealth Code | `WealthCode.tsx` |
| 03 | Nobleman | `NoblemanSection.tsx` |
| 04 | Health | `Health.tsx` |
| **05** | **Destiny Alert Map** | **`FourKeyPalace.tsx`** |
| **06** | **Destiny Scoreboard** | **`AreasOfLIfe.tsx`** |
