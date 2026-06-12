/**
 * Shared palace timing data for the Alignment Advantage feature.
 *
 * Consumed by the interactive timing roadmap, the PDF print page, and the
 * year-at-a-glance MonthGrid component.
 *
 * Signal colour mapping:
 *   5 stars → green  (peak / execute)
 *   4 stars → yellow (moderate / proceed with caution)
 *   3 stars → red    (caution / protect & plan)
 */

/**
 * Timing phase name: maps the four seasonal cycles to the Alignment Advantage
 * framework display names. Internal DaYun keys (spring/summer/autumn/winter)
 * remain unchanged; these names are used in display contexts only.
 */
export type TimingPhase = "Expansion" | "Visibility" | "Consolidation" | "Foundation";

/** Per-palace metadata used to derive timing signals and display content. */
export interface PalaceTimingData {
  season:    TimingPhase;
  stars:     3 | 4 | 5;
  area:      string;
  priority:  string;
  /** One-sentence strategic instruction for this month's active palace. */
  directive: string;
  /** Two specific things to avoid when this palace is active. */
  watchOut:  [string, string];
}

/**
 * Static timing characteristics indexed by Chinese palace name.
 * Source: canonical business-calendar mapping used in the 12-month forecast PDF.
 */
export const PALACE_DATA: Record<string, PalaceTimingData> = {
  "官禄": {
    season:    "Expansion",
    stars:     5,
    area:      "Professional",
    priority:  "Launch Initiatives",
    directive: "Make the call, sign the deal, and step into the bigger role: the window is open.",
    watchOut:  ["Waiting for perfect conditions before committing", "Over-allocating time to low-leverage routine work"],
  },
  "迁移": {
    season:    "Expansion",
    stars:     5,
    area:      "Expansion",
    priority:  "Step Beyond Comfort Zone",
    directive: "Move into new markets, geographies, or environments: expansion is cosmically supported now.",
    watchOut:  ["Staying in familiar territory out of comfort", "Turning down opportunities that require you to stretch"],
  },
  "交友": {
    season:    "Expansion",
    stars:     5,
    area:      "Network",
    priority:  "Launch Initiatives",
    directive: "Reach out, reconnect, and build bridges: relationships formed this month carry compounding value.",
    watchOut:  ["Staying heads-down without investing in new connections", "Letting strong existing relationships go cold"],
  },
  "财帛": {
    season:    "Visibility",
    stars:     5,
    area:      "Financial",
    priority:  "Monetize Resources",
    directive: "Convert your assets and attention into revenue: this is your highest-return monetisation window.",
    watchOut:  ["Leaving money on the table by undercharging or under-asking", "Opening new positions instead of harvesting existing ones"],
  },
  "田宅": {
    season:    "Visibility",
    stars:     4,
    area:      "Assets",
    priority:  "Optimize Foundations",
    directive: "Review, renovate, and optimise: improving what you own now compounds your future returns.",
    watchOut:  ["Making speculative new purchases before optimising current assets", "Ignoring maintenance that quietly erodes your base"],
  },
  "福德": {
    season:    "Visibility",
    stars:     5,
    area:      "Inner Power",
    priority:  "Align Inner State",
    directive: "Invest in your mindset, capacity, and inner alignment: decisions made from clarity compound exponentially.",
    watchOut:  ["Burning out by pouring into output without internal recovery", "Making major decisions while mentally depleted"],
  },
  "夫妻": {
    season:    "Consolidation",
    stars:     3,
    area:      "Partnership",
    priority:  "Clear Emotional Clutter",
    directive: "Have the honest conversation you have been postponing: unresolved partnership tension drains your strategic momentum.",
    watchOut:  ["Signing new partnership agreements or commitments this month", "Ignoring friction in key relationships and hoping it resolves itself"],
  },
  "兄弟": {
    season:    "Consolidation",
    stars:     4,
    area:      "Circle",
    priority:  "Purge Connections",
    directive: "Audit your inner circle: invest deeper in relationships that multiply your leverage, release those that drain it.",
    watchOut:  ["Expanding your network at the expense of depth with existing allies", "Tolerating capacity-draining relationships out of obligation"],
  },
  "子女": {
    season:    "Consolidation",
    stars:     3,
    area:      "Legacy",
    priority:  "Structure Your Plans",
    directive: "Document, delegate, and structure: convert your ideas and intentions into systems that outlast this moment.",
    watchOut:  ["Launching new creative projects without completing what is already in progress", "Spreading your output thin across too many initiatives"],
  },
  "父母": {
    season:    "Consolidation",
    stars:     3,
    area:      "Patterns",
    priority:  "Break Old Loops",
    directive: "Identify one pattern from your past that is limiting your next move: then interrupt it deliberately.",
    watchOut:  ["Repeating the same strategy that has not been working, expecting different results", "Letting old narratives about your limitations drive current decisions"],
  },
  "命宫": {
    season:    "Foundation",
    stars:     4,
    area:      "Self",
    priority:  "Invest in Yourself",
    directive: "Upgrade your skill, mindset, or knowledge base: the investment you make in yourself this month pays dividends across every other area.",
    watchOut:  ["Postponing self-development under the weight of responsibilities", "Comparing your progress to others instead of measuring against your own trajectory"],
  },
  "疾厄": {
    season:    "Foundation",
    stars:     3,
    area:      "Body",
    priority:  "Restore Strength",
    directive: "Rest, recover, and rebuild your physical and mental reserves: protect your capacity to perform at full strength.",
    watchOut:  ["Pushing through warning signals from your body or capacity levels", "Scheduling this month as densely as a peak-performance month"],
  },
};

/** Traffic-light signal derived from a palace's star rating. */
export type SignalColor = "green" | "yellow" | "red";

/**
 * Map a star count (3–5) to a traffic-light signal colour.
 *
 * @param stars - The star rating for the palace (3, 4, or 5).
 * @returns The corresponding signal colour.
 */
export const getSignalColor = (stars: number): SignalColor => {
  if (stars >= 5) return "green";
  if (stars === 4) return "yellow";
  return "red";
};

/** Human-readable label for each signal colour shown in the UI. */
export const SIGNAL_LABELS: Record<SignalColor, string> = {
  green:  "Green Light: Execute",
  yellow: "Yellow Light: Proceed with Caution",
  red:    "Red Light: Protect & Plan",
};

/** Tailwind background / text / border class sets for each signal colour. */
export const SIGNAL_STYLES: Record<SignalColor, { bg: string; text: string; border: string; dot: string }> = {
  green: {
    bg:     "bg-emerald-50 dark:bg-emerald-900/20",
    text:   "text-emerald-700 dark:text-emerald-300",
    border: "border-emerald-300 dark:border-emerald-700",
    dot:    "bg-emerald-500",
  },
  yellow: {
    bg:     "bg-amber-50 dark:bg-amber-900/20",
    text:   "text-amber-700 dark:text-amber-300",
    border: "border-amber-300 dark:border-amber-700",
    dot:    "bg-amber-500",
  },
  red: {
    bg:     "bg-rose-50 dark:bg-rose-900/20",
    text:   "text-rose-700 dark:text-rose-300",
    border: "border-rose-300 dark:border-rose-700",
    dot:    "bg-rose-500",
  },
};
