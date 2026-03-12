# Agent Prompt 2 — Liu Month Monthly Briefing Card

You are building a new React component for a ZWDS (紫微斗数) astrology web app. This is a "Monthly Briefing Card" that shows when the user is in **Liu Month (流月)** mode on the result page.

## Rules You Must Follow

- TypeScript strict mode: **no `any` type, no `!` non-null assertion, no `as unknown as T` cast**
- All strings use **double quotes** `"`
- **Full code only** — no placeholder comments like `// ... rest of code`
- Include **JSDoc headers** and **inline comments** on all functions and components
- Tailwind dynamic class names (built at runtime) must use **inline CSS** instead — Tailwind JIT purges dynamically-referenced class names
- Define new TypeScript types/interfaces as needed — do not use `any`

---

## Context: What Is Liu Month Mode?

In ZWDS, the chart has 12 "palaces". In Liu Month mode, each month of the current year corresponds to a specific palace in the chart. The active month's palace tells the user what life area is energetically highlighted that month.

The result page already has a `selectedLiuMonth` variable (always set to `new Date().getMonth() + 1`) and a `currentLiuMonthPalace` value (a palace number 1–12 resolved from chart data).

---

## What You Are Building

**3 new files + 1 edit to an existing file.**

---

## Step 1 — Create Utility: `src/utils/forecast/liuMonthData.ts`

This file extracts the palace metadata used by the 12-month forecast PDF into reusable typed data.

Create this file with the following content:

```typescript
/**
 * Liu Month Forecast Data
 *
 * Palace metadata used to enrich the monthly Liu Month briefing card.
 * Extracted from the 12-month forecast PDF generation logic so it can
 * be shared with the web UI.
 */

/** Season types aligned with the Dayun season mapper */
export type LiuMonthSeason = "Spring" | "Summer" | "Autumn" | "Winter";

/** Per-palace static metadata for the monthly briefing */
export interface PalaceMonthData {
  /** Season this palace belongs to */
  season: LiuMonthSeason;
  /** Energy rating (3 = cautious, 4 = moderate, 5 = peak) */
  stars: 3 | 4 | 5;
  /** Life area focus label */
  area: string;
  /** Priority theme for this month */
  priority: string;
}

/**
 * Static metadata for each palace, keyed by simplified Chinese palace name.
 * Maps directly to the PALACE_DATA used in the 12-month forecast PDF generator.
 */
export const PALACE_MONTH_DATA: Record<string, PalaceMonthData> = {
  "官禄": { season: "Spring", stars: 5, area: "Professional",  priority: "Launch Initiatives"        }, // Career
  "迁移": { season: "Spring", stars: 5, area: "Expansion",     priority: "Step Beyond Comfort Zone"  }, // Travel
  "交友": { season: "Spring", stars: 5, area: "Network",       priority: "Launch Initiatives"        }, // Friends
  "财帛": { season: "Summer", stars: 5, area: "Financial",     priority: "Monetize Resources"        }, // Wealth
  "田宅": { season: "Summer", stars: 4, area: "Assets",        priority: "Optimize Foundations"      }, // Property
  "福德": { season: "Summer", stars: 5, area: "Inner Power",   priority: "Align Inner State"         }, // Wellbeing
  "夫妻": { season: "Autumn", stars: 3, area: "Partnership",   priority: "Clear Emotional Clutter"   }, // Spouse
  "兄弟": { season: "Autumn", stars: 4, area: "Circle",        priority: "Purge Connections"         }, // Siblings
  "子女": { season: "Autumn", stars: 3, area: "Legacy",        priority: "Structure Your Plans"      }, // Children
  "父母": { season: "Autumn", stars: 3, area: "Patterns",      priority: "Break Old Loops"           }, // Parents
  "命宫": { season: "Winter", stars: 4, area: "Self",          priority: "Invest in Yourself"        }, // Life
  "疾厄": { season: "Winter", stars: 3, area: "Body",          priority: "Restore Strength"          }, // Health
};

/**
 * Season visual configuration for the briefing card hero strip.
 * Uses inline CSS strings (not Tailwind) to avoid JIT purging.
 */
export interface SeasonStyle {
  /** CSS gradient for the hero header background */
  headerGradient: string;
  /** CSS gradient for the card body background */
  bodyGradient: string;
  /** CSS hex color for accent text and borders */
  accentColor: string;
  /** CSS hex color for the border */
  borderColor: string;
  /** CSS box-shadow for the card */
  cardShadow: string;
  /** Emoji icon */
  icon: string;
  /** Tagline (season theme) */
  tagline: string;
  /** One-sentence core seasonal message */
  coreMessage: string;
}

/**
 * Season styles keyed by season name.
 * Colors match the existing DayunSeasonHero component palette.
 */
export const SEASON_STYLES: Record<LiuMonthSeason, SeasonStyle> = {
  Spring: {
    headerGradient: "linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)",
    bodyGradient:   "linear-gradient(145deg, #fff7ed 0%, #ffedd5 100%)",
    accentColor:    "#9a3412",
    borderColor:    "#fed7aa",
    cardShadow:     "0 4px 32px rgba(249,115,22,0.14)",
    icon:           "🌱",
    tagline:        "Expand, Grow, Move",
    coreMessage:    "This is your green light season. The doors open easier. People say yes faster. Launch, expand, and move forward with confidence.",
  },
  Summer: {
    headerGradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)",
    bodyGradient:   "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
    accentColor:    "#78350f",
    borderColor:    "#fde68a",
    cardShadow:     "0 4px 32px rgba(245,158,11,0.14)",
    icon:           "☀️",
    tagline:        "Activate, Leverage, Monetize",
    coreMessage:    "This is your harvest season. Stop waiting and start activating what you already have. It's time to cash in, monetize, and collect the fruits of your work.",
  },
  Autumn: {
    headerGradient: "linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)",
    bodyGradient:   "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    accentColor:    "#064e3b",
    borderColor:    "#86efac",
    cardShadow:     "0 4px 32px rgba(16,185,129,0.14)",
    icon:           "🍂",
    tagline:        "Cut, Secure, Protect",
    coreMessage:    "This is your safety net season. Cut emotional noise, patch up holes, and strengthen your foundation. Protect what you've built and prepare for what's next.",
  },
  Winter: {
    headerGradient: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
    bodyGradient:   "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    accentColor:    "#1e3a8a",
    borderColor:    "#93c5fd",
    cardShadow:     "0 4px 32px rgba(37,99,235,0.14)",
    icon:           "❄️",
    tagline:        "Reskill, Prepare, Rebuild",
    coreMessage:    "This is your reload season. Quietly sharpen your sword, rebuild your arsenal, and prepare yourself. When the season turns, you'll be ready to strike.",
  },
};

/**
 * Palace guidance content keyed by simplified Chinese palace name.
 * Contains key actions, watch outs, success metrics, and reflection questions.
 * Sourced from the Dayun guidance generator and aligned to the monthly context.
 */
export interface PalaceGuidanceData {
  keyActions: string[];
  watchOut: string[];
  successMetrics: string[];
  reflectionQuestions: string[];
}

/**
 * Per-palace monthly guidance content.
 * Each palace has 6 key actions, 6 watch outs, 5 success metrics, 5 reflection questions.
 * The card UI trims to 4 / 4 / 4 / 2 to keep display tight and readable.
 */
export const PALACE_GUIDANCE_DATA: Record<string, PalaceGuidanceData> = {
  "官禄": {
    keyActions: [
      "Step into bigger roles and take ownership of larger responsibilities",
      "Upgrade yourself and reposition before the environment forces you to",
      "Build your visibility and actively seek recognition for your work",
      "Launch new initiatives and explore new opportunities within your field",
      "Fight for achievements and growth — don't play it safe",
      "Leverage your years of experience as your biggest advantage",
    ],
    watchOut: [
      "Playing too safe and staying in comfort zones",
      "Waiting passively for opportunities instead of creating them",
      "Letting younger colleagues overshadow you without stepping up",
      "Adapting to routines that no longer challenge you",
      "Using age as an excuse instead of catching up with trends",
      "Staying too quiet during this period — you'll waste your season",
    ],
    successMetrics: [
      "New role, promotion, or increased responsibilities secured",
      "Visibility and recognition increased within your field",
      "New skills or certifications acquired",
      "Successful launch of a new project or initiative",
      "Expanded professional network with key decision-makers",
    ],
    reflectionQuestions: [
      "Am I really playing at the level this season is calling for?",
      "What's stopping me from stepping into a bigger role right now?",
      "Am I using my experience as leverage, or as an excuse?",
      "If I stay in my current position for another 3 years, will I be satisfied?",
      "What would I do if I knew I couldn't fail?",
    ],
  },
  "迁移": {
    keyActions: [
      "Move, explore, and expand beyond your current environment",
      "Step out of your comfort zone and into new spaces",
      "Consider shifting markets, departments, or new opportunities",
      "Grow by changing your environment — new spaces bring new energy",
      "Build new networks and perspectives through movement",
      "Take calculated risks to explore new territories",
    ],
    watchOut: [
      "Staying too comfortable in the same environment",
      "Telling yourself 'later' when opportunities for change appear",
      "Letting comfort make you stagnant",
      "Waiting for 'perfect timing' that never comes",
      "Shrinking in when life is asking you to step outside",
      "Rocking the boat unnecessarily — not all movement is good",
    ],
    successMetrics: [
      "Successfully relocated or changed work environment",
      "New market or territory explored and developed",
      "Expanded geographical network or client base",
      "Comfort zone successfully stretched with measurable results",
      "New perspectives gained through environmental changes",
    ],
    reflectionQuestions: [
      "What would happen if I actually made that shift I've been considering?",
      "Is my current environment still supporting my growth, or holding me back?",
      "What am I really afraid of if I step outside my comfort zone?",
      "Where could I go or explore that would challenge me?",
      "Am I using 'stability' as an excuse to avoid necessary change?",
    ],
  },
  "交友": {
    keyActions: [
      "Reconnect and actively build your network — don't stay isolated",
      "Leverage your connections strategically for mutual growth",
      "Build influence through collaborations and partnerships",
      "Activate dormant relationships and create new ones",
      "Focus on social circle shifts and expanding your reach",
      "Turn networking into tangible business relationships",
    ],
    watchOut: [
      "Staying inward-focused with only your usual circle",
      "Letting your network become comfortable instead of expanding",
      "Watching others advance through connections while you stay isolated",
      "Assuming opportunities will come without reaching out",
      "Maintaining social circles that haven't changed in years",
      "Missing growth opportunities that come through people, not solo work",
    ],
    successMetrics: [
      "New strategic partnerships or collaborations formed",
      "Dormant relationships reactivated with tangible results",
      "Expanded network with at least 10 new meaningful connections",
      "Opportunities or doors opened through network activation",
      "Influence measurably increased within your circle or industry",
    ],
    reflectionQuestions: [
      "When was the last time I reached out to someone in my network?",
      "Who in my circle could I collaborate with for mutual growth?",
      "Am I building relationships, or just collecting contacts?",
      "What opportunities am I missing by staying isolated?",
      "How can I provide value to others in my network right now?",
    ],
  },
  "财帛": {
    keyActions: [
      "Activate your resources — cash in what you've built so far",
      "Review and optimize your investment portfolio strategically",
      "Monetize your skills — package and sell your expertise",
      "Stop parking money — restructure and take profits where due",
      "Leverage your networks for financial opportunities",
      "Turn accumulated skills and knowledge into income streams",
    ],
    watchOut: [
      "Parking money without reviewing performance",
      "Following outdated strategies or wrong mentors blindly",
      "Ignoring that you've been on the wrong financial path",
      "Sitting on valuable skills without packaging or monetizing them",
      "Waiting for miracles instead of making strategic moves",
      "Letting resources collect dust when they could be working for you",
    ],
    successMetrics: [
      "Investment portfolio reviewed and optimized",
      "New income stream created from existing skills or resources",
      "Profits taken strategically from performing investments",
      "Skills packaged and monetized",
      "Resources activated with clear ROI tracked",
    ],
    reflectionQuestions: [
      "What resources do I already have that I'm not using effectively?",
      "When was the last time I properly reviewed my financial strategy?",
      "What skills or knowledge could I monetize right now?",
      "Am I actively managing my wealth, or just hoping it grows?",
      "Who can I learn from to upgrade my financial approach?",
    ],
  },
  "田宅": {
    keyActions: [
      "Optimize and upgrade what you already own — make it work harder",
      "Do proper market research to understand current opportunities",
      "Renovate or improve properties to match market expectations",
      "Leverage your foundations for greater returns",
      "Review and potentially upgrade your property strategy",
      "Use what you've built as a springboard for expansion",
    ],
    watchOut: [
      "Leaving properties or assets untouched and underutilized",
      "Relying on outdated strategies without market research",
      "Using the same unproductive agents or methods for years",
      "Sitting on goldmines but treating them like rocks",
      "Complaining without actually working the assets you have",
      "Ignoring family tensions that weaken your foundation",
    ],
    successMetrics: [
      "Property or asset optimized with increased returns",
      "Market research completed and strategy updated",
      "Renovations or improvements completed",
      "Family foundation strengthened through better communication",
      "Assets leveraged to open new opportunities or income",
    ],
    reflectionQuestions: [
      "What do I own that's not working as hard as it could?",
      "Have I done recent market research on my properties or assets?",
      "Are my family relationships supporting or weakening my foundation?",
      "What upgrades or improvements would maximize my returns?",
      "Am I giving back to the people who support me?",
    ],
  },
  "福德": {
    keyActions: [
      "Activate your inner superpower — align your energy with your goals",
      "Sharpen your instincts and decision-making patterns",
      "Say 'yes' to the right opportunities and 'no' to draining distractions",
      "Build confidence to execute without second-guessing yourself",
      "Balance your inner state to attract outer wealth naturally",
      "Clear patterns that are blocking your outer results",
    ],
    watchOut: [
      "Constantly overthinking and doubting yourself",
      "Operating from fear instead of power",
      "Sabotaging your wealth through unbalanced inner patterns",
      "Ignoring that your outer wealth reflects your inner state",
      "Letting unclear patterns eat away your energy and clarity",
      "Working harder without addressing inner misalignment",
    ],
    successMetrics: [
      "Improved decision-making speed and confidence",
      "Reduced overthinking and increased execution",
      "Money flowing more smoothly with less effort",
      "Inner patterns identified and actively shifting",
      "Energy and clarity noticeably increased",
    ],
    reflectionQuestions: [
      "What inner patterns are sabotaging my external success?",
      "Do I trust my instincts, or constantly second-guess myself?",
      "Am I operating from fear or from power?",
      "What would change if I aligned my inner state with my wealth goals?",
      "Where am I leaking energy that could be directed toward my goals?",
    ],
  },
  "夫妻": {
    keyActions: [
      "Cut emotional noise and bring issues into the light",
      "Realign strategy with your key partnerships (work and personal)",
      "Address unspoken frustrations instead of letting them pile up",
      "Operate like a real team — align or make tough calls if needed",
      "Trim the fat and clear up mismatched expectations",
      "Focus on facts and strategy, not just feelings",
    ],
    watchOut: [
      "Carrying unspoken frustration and resentment in partnerships",
      "Saying 'it's fine' when it's clearly not",
      "Letting emotional clutter leak into your decisions",
      "Tolerating misalignment instead of addressing it",
      "Dragging unresolved tensions into the next phase",
      "Staying in old emotional loops that no longer serve you",
    ],
    successMetrics: [
      "Key partnership issues addressed and resolved",
      "Clear expectations set and communicated",
      "Alignment achieved or tough decisions made",
      "Emotional clutter reduced with better communication",
      "Partnerships operating more like effective teams",
    ],
    reflectionQuestions: [
      "Are my key partnerships helping me grow or keeping me stuck?",
      "What am I not saying that needs to be said?",
      "Am I operating like a team, or just tolerating each other?",
      "What emotional noise am I carrying that's clouding my clarity?",
      "If this partnership doesn't change, where will we be in 3 years?",
    ],
  },
  "兄弟": {
    keyActions: [
      "Clean up your circle — identify who's adding value vs. noise",
      "Filter your connections and prioritize real alliances",
      "Invest in people who challenge, support, and grow with you",
      "Cut the noise — stop pretending everyone belongs in your next season",
      "Build clarity around who belongs in your inner circle",
      "Focus on quality connections over quantity",
    ],
    watchOut: [
      "Keeping people around just because they're 'old friends'",
      "Tolerating gossip, complaints, and distractions in your circle",
      "Letting surface-level connections drain your focus and energy",
      "Staying sentimentally attached to relationships that don't serve you",
      "Allowing distracting voices to follow you into the next phase",
      "Confusing quantity of contacts with quality of relationships",
    ],
    successMetrics: [
      "Circle cleaned up with clearer boundaries",
      "Energy-draining connections reduced or eliminated",
      "Quality of relationships noticeably improved",
      "Real alliances identified and strengthened",
      "Focus and clarity improved through better circle management",
    ],
    reflectionQuestions: [
      "Who in my circle actually pushes me forward?",
      "Who am I keeping around out of obligation rather than value?",
      "What would happen if I let go of relationships that drain me?",
      "Am I surrounding myself with people who challenge me to grow?",
      "Which connections should not follow me into my next season?",
    ],
  },
  "子女": {
    keyActions: [
      "Stop letting worry run the show — focus on facts instead of fear",
      "Structure your legacy clearly — what are you actually building?",
      "Tighten up what matters and trim what's emotionally outdated",
      "Support wisely based on real needs, not emotional reactions",
      "Face emotional procrastination and create clear plans",
      "Define what you want to pass down or scale for the future",
    ],
    watchOut: [
      "Carrying others' problems like they're your own",
      "Worrying even when things are actually fine",
      "Getting stuck in emotional loops without real change",
      "Letting guilt, fear, or frustration drain your energy",
      "Leaving your legacy scattered without proper structure",
      "Emotionally procrastinating instead of facing reality",
    ],
    successMetrics: [
      "Emotional patterns identified and shifting",
      "Legacy or assets structured with clear plans",
      "Support provided based on needs, not emotional reactions",
      "Worry reduced with fact-based decision-making",
      "Clear direction established for what to pass down",
    ],
    reflectionQuestions: [
      "Am I supporting wisely or just reacting emotionally?",
      "What am I worrying about that isn't actually a real problem?",
      "Is my legacy clearly structured, or just vague hopes?",
      "What emotional patterns from the past am I still carrying?",
      "What do I actually want to leave behind or pass down?",
    ],
  },
  "父母": {
    keyActions: [
      "Face old patterns from your past instead of letting them control you",
      "Own your story — stop pointing back at childhood as an excuse",
      "Cut through fear-based thinking with clarity and responsibility",
      "Step up and take ownership of your direction moving forward",
      "Address how authority figures (bosses, mentors, parents) shape you",
      "Use truth and facts to break free from outdated narratives",
    ],
    watchOut: [
      "Carrying childhood narratives that no longer serve you",
      "Blaming your past or family for your current situation",
      "Reacting to life using fears formed decades ago",
      "Letting your past control your future decisions",
      "Running from your story instead of owning it",
      "Operating from fear instead of clarity and responsibility",
    ],
    successMetrics: [
      "Old patterns identified and actively breaking free from them",
      "Taking full ownership without blaming the past",
      "Fear-based thinking replaced with clarity-based decisions",
      "Relationships with authority figures improved or boundaries set",
      "Personal responsibility increased with reduced blame",
    ],
    reflectionQuestions: [
      "What old stories from my past am I still carrying?",
      "Am I using my upbringing as an excuse or as context for growth?",
      "How much of my current fear comes from things that happened long ago?",
      "What would change if I fully owned my story without blame?",
      "Am I stepping up, or waiting for someone else to fix things?",
    ],
  },
  "命宫": {
    keyActions: [
      "Invest in yourself — take that course, learn that skill, finally do your thing",
      "Rebuild your edge and upgrade your mind for your next chapter",
      "Rewire your habits and reprogram your patterns",
      "Focus on becoming more, not just doing more",
      "Use this window to strengthen your foundation before Spring",
      "Be your own hero instead of everyone else's",
    ],
    watchOut: [
      "Pouring into everyone else while forgetting to invest in yourself",
      "Postponing dreams and self-improvement under 'responsibility'",
      "Hitting the same ceiling year after year without upgrading",
      "Waiting for 'someday' that never comes",
      "Resisting the pause when you should be rebuilding",
      "Staying the same person fighting the same problems",
    ],
    successMetrics: [
      "New course, certification, or skill completed",
      "Meaningful self-investment made (education, health, growth)",
      "Habits rewired with measurable behavior changes",
      "Personal foundation noticeably strengthened",
      "Next-chapter version of yourself taking shape",
    ],
    reflectionQuestions: [
      "When was the last time I actually invested in myself, not others?",
      "What version of me does my next chapter require?",
      "If I don't grow now, where will I be in 10 years?",
      "What would I do for myself if I made myself a priority?",
      "Am I becoming more, or just staying busy?",
    ],
  },
  "疾厄": {
    keyActions: [
      "Slow down now before you're forced to stop completely",
      "Address health warnings before they become emergencies",
      "Repair, recalibrate, and restore your body intentionally",
      "Protect your health so you have strength when Spring arrives",
      "Build sustainable routines instead of compensating with willpower",
      "Treat this as your last warning window — use it wisely",
    ],
    watchOut: [
      "Running on empty and telling yourself 'I'll rest later'",
      "Ignoring signs like fatigue, pain, or sleep issues",
      "Waiting for health problems to become serious before acting",
      "Compensating exhaustion with caffeine instead of real rest",
      "Burning out and missing your next opportunity window",
      "Rebuilding wealth while destroying the body that carries it",
    ],
    successMetrics: [
      "Regular health checkups completed and issues addressed",
      "Sleep, nutrition, and exercise routines established",
      "Warning signs addressed before becoming serious problems",
      "Energy levels noticeably improved and sustained",
      "Body prepared and strong for the next growth cycle",
    ],
    reflectionQuestions: [
      "What health warning signs have I been ignoring?",
      "Am I truly resting, or just collapsing when I can't go on?",
      "Can my body actually handle what I'm planning for my future?",
      "What would happen if I slowed down now instead of waiting for a crash?",
      "Am I being wise or just proving I can push through anything?",
    ],
  },
};
```

---

## Step 2 — Create the LiuMonthCard Component: `src/components/liumonth/LiuMonthCard.tsx`

Create a new file. This is the main feature component.

**Props interface:**
```typescript
interface LiuMonthCardProps {
  /** The current month number (1–12) */
  selectedMonth: number;
  /** The physical palace number (1–12) that is active for this month */
  palaceNumber: number;
  /** The Chinese name of the active palace (e.g. "官禄") */
  palaceName: string;
}
```

**Layout structure (3 zones — all rendered at once, no tabs):**

### Zone 1 — Hero Header (full width, season-colored gradient)
Shows:
- Season icon + season name (left)
- Palace English name + Chinese name (center/right)
- Star rating as filled/empty stars ⭐☆ (right)
- Season tagline below (e.g. "Expand, Grow, Move")
- Current month name and year (prominent, white text on gradient)
- Season core message (smaller italic text below tagline)
- Priority badge pill at the bottom of the hero: `🎯 [priority]`

Use the `headerGradient` from `SEASON_STYLES` for the hero background.

### Zone 2 — Two columns, action-focused (the meaty content)
Show **first 4 items only** from each list (never all 6):

**Left column — "THIS MONTH, FOCUS ON"**
- Green check emoji `✅` heading
- 4 bullet points from `keyActions` with `▸` prefix
- Uses `bodyGradient` background

**Right column — "WATCH OUT FOR"**
- Warning emoji `⚠️` heading
- 4 bullet points from `watchOut` with `▸` prefix
- Slightly different tinted background (use inline CSS, slightly darker than bodyGradient)

### Zone 3 — Two columns, lighter weight (metrics + reflection)
Show **first 4 metrics** and **first 2 questions**:

**Left column — "WIN METRICS"**
- `📊` heading  
- 4 items from `successMetrics` with `◦` bullet prefix
- Lighter background, smaller font

**Right column — "REFLECT ON THIS"**
- `💭` heading
- Show **2 reflection questions** as italic pull-quotes (styled differently from bullets — use italic, slightly larger font, with a left border accent using the season's `accentColor`)
- Lighter background, smaller font

### Fallback state
If no palace data is found for `palaceName`, render a simple message: `"Monthly forecast data unavailable for this palace."` inside a centered div with padding.

**Implementation notes:**
- Import `PALACE_MONTH_DATA`, `PALACE_GUIDANCE_DATA`, `SEASON_STYLES` from `"../../utils/forecast/liuMonthData"`
- Import `GradientSectionHeader` from `"../analysis_v2/shared/GradientSectionHeader"` for the section header above the card
- The section header should use: `badgeText="07"`, `title="MONTHLY BRIEFING"`, `subtitle="Your energetic focus for [Month Name] [Year]"` — compute month name from `selectedMonth`
- Map `palaceName` to English using a simple record (e.g. `"官禄" → "Career Palace"`) — use the same mapping already in the codebase: just inline a record for the 12 palaces
- For star rendering: loop from 1 to 5, render `⭐` if `i <= stars`, else `☆`
- All color values must be inline CSS strings — do **not** use dynamic Tailwind classes for colors

---

## Step 3 — Create Barrel Export: `src/components/liumonth/index.ts`

```typescript
/**
 * Liu Month components barrel export
 */
export { LiuMonthCard } from "./LiuMonthCard";
```

---

## Step 4 — Wire Into Result Page: `src/pages/result.tsx`

Make **two small edits** to the existing file.

### Edit A — Add import at top of file (with other component imports)
Add this import alongside the existing `DayunSection` and `NoblemanSection` imports:

```typescript
import { LiuMonthCard } from "../components/liumonth";
```

### Edit B — Add Liu Month section in the analysis block

Find the analysis section (search for `{/* ── Da Yun Mode: DayunSection shown first as an extra section ── */}`). It currently looks like this:

```tsx
<div className="space-y-8">

  {/* ── Da Yun Mode: DayunSection shown first as an extra section ── */}
  {blueprintMode === "dayun" && (
    <DayunSection chartData={calculatedChartData} />
  )}

  {/* ── Full analysis suite — shown for ALL modes ───────────────── */}
  <Overview ... />
  {hasFullAnalysis && (
    <>
      <WealthCode ... />
      <NoblemanSection ... />
      <Health ... />
      <FourKeyPalace ... />
    </>
  )}
  <AreasOfLife ... />

</div>
```

**After your edit**, it should look like this — the Liu Month card replaces all other analysis when in `liumonth` mode:

```tsx
<div className="space-y-8">

  {/* ── Da Yun Mode: DayunSection shown first as an extra section ── */}
  {blueprintMode === "dayun" && (
    <DayunSection chartData={calculatedChartData} />
  )}

  {/* ── Liu Month Mode: show monthly briefing card instead of full analysis ── */}
  {blueprintMode === "liumonth" && currentLiuMonthPalace !== null ? (
    <LiuMonthCard
      selectedMonth={selectedLiuMonth}
      palaceNumber={currentLiuMonthPalace}
      palaceName={calculatedChartData.palaces[currentLiuMonthPalace - 1]?.name ?? ""}
    />
  ) : blueprintMode !== "liumonth" ? (
    <>
      {/* ── Full analysis suite — shown for DNA / Da Yun / Liu Nian modes ── */}
      <Overview
        chartData={calculatedChartData}
        palaceOverride={getPalaceOverride("life") ?? undefined}
      />

      {hasFullAnalysis && (
        <>
          <WealthCode
            chartData={calculatedChartData}
            showTopDivider={true}
            header={{
              badgeText: "02",
              title: "WEALTH CODE ANALYSIS",
              subtitle:
                "Decode your natural earning style and ideal business model aligned to your energy.",
            }}
            palaceOverride={getPalaceOverride("wealth") ?? undefined}
          />

          <NoblemanSection chartData={calculatedChartData} />

          <Health
            chartData={calculatedChartData}
            palaceOverride={getPalaceOverride("health") ?? undefined}
          />

          <FourKeyPalace
            chartData={calculatedChartData}
            resolvePalaceName={resolvePalaceName}
          />
        </>
      )}

      <AreasOfLife
        chartData={calculatedChartData}
        palaceOverride={getPalaceOverride("life") ?? undefined}
      />
    </>
  ) : null}

</div>
```

**Important context about `currentLiuMonthPalace`:** This variable is already defined in `result.tsx` as:
```typescript
const currentLiuMonthPalace = useMemo<number | null>(() => {
  if (!calculatedChartData) return null;
  return getMonthPalaceForLiuMonth(calculatedChartData, selectedLiuMonth);
}, [calculatedChartData, selectedLiuMonth]);
```

And `calculatedChartData.palaces` is an array of palace objects — each palace has a `.name` property (the Chinese palace name, e.g. `"官禄"`). `palaces[0]` = palace 1 (Life Palace), so `palaces[palaceNumber - 1]` gives the correct palace.

---

## Verification Checklist

After completing all 4 steps:

1. `src/utils/forecast/liuMonthData.ts` exists and exports `PALACE_MONTH_DATA`, `PALACE_GUIDANCE_DATA`, `SEASON_STYLES`
2. `src/components/liumonth/LiuMonthCard.tsx` exists and exports `LiuMonthCard`
3. `src/components/liumonth/index.ts` exists with barrel export
4. `src/pages/result.tsx` imports `LiuMonthCard` and renders it conditionally for `blueprintMode === "liumonth"`
5. When `liumonth` mode is active, the regular analysis suite (Overview, WealthCode, etc.) is hidden
6. No TypeScript errors — strict types, no `any`, no `!`
7. No dynamic Tailwind class names — all colors are inline CSS strings
