/**
 * Wealth-code template content for the Alignment Advantage feature.
 *
 * All maps are keyed by `WealthCodeKey`. For the initial mockup, `investmentBrain`
 * has full content; the remaining three keys use the same values as stubs.
 * Fill in archetype-specific copy before production launch.
 *
 * No astrological derivation lives here — these are display-layer templates only.
 */

import type { WealthCodeKey } from "../zwds/analysis_constants/wealth_code_mapping";

// ─────────────────────────────────────────────────────────────────────────────
// Wealth Type Categorisation
// ─────────────────────────────────────────────────────────────────────────────

/** The four wealth-attraction categories referenced in the offer brief. */
export type WealthCategory =
  | "Earned Income"
  | "Passive Returns"
  | "Equity Growth"
  | "Strategic Windfalls";

export interface WealthTypeProfile {
  category:    WealthCategory;
  tagline:     string;
  description: string;
  /** Short examples of what this category looks like in practice. */
  examples:    string[];
}

export const WEALTH_TYPE: Record<WealthCodeKey, WealthTypeProfile> = {
  investmentBrain: {
    category:    "Equity Growth",
    tagline:     "You build wealth through capital deployment and compounding over time.",
    description:
      "Your chart is wired for systematic accumulation. You do not chase quick wins — you build positions, protect downside, and let time compound your advantage. The longer the time horizon, the more your edge multiplies.",
    examples:    ["Equity stakes in businesses", "Long-horizon asset portfolios", "Structured financial instruments"],
  },
  brandingMagnet: {
    category:    "Earned Income",
    tagline:     "You build wealth by monetising your influence, visibility, and personal brand.",
    description:
      "Your chart is wired for high-leverage earned income. The more visible and recognised you become, the more your earning capacity scales — your personal brand IS the asset. Income follows attention, not effort alone.",
    examples:    ["Premium personal services", "Audience monetisation", "Licensing and intellectual property"],
  },
  strategyPlanner: {
    category:    "Strategic Windfalls",
    tagline:     "You build wealth through positioning, systems, and capitalising on rare high-value moments.",
    description:
      "Your chart is wired for strategic accumulation through preparation and timing. You build systems that compound quietly, then capture disproportionate returns when your moment arrives. Wealth is won in the planning phase, not the execution phase.",
    examples:    ["Business exits and equity events", "Strategic consulting and advisory fees", "Long-cycle investment plays"],
  },
  collaborator: {
    category:    "Passive Returns",
    tagline:     "You build wealth through relationships, joint ventures, and network-leveraged returns.",
    description:
      "Your chart is wired for wealth that flows through people. Your strongest income streams come from partnerships, referrals, and collaborative structures where trust is the currency. Passive returns accumulate when you have built the right alliances.",
    examples:    ["Partnership revenue and referral networks", "Revenue-sharing arrangements", "Co-ownership structures"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Stop Doing (wealth-code specific blind spots)
// ─────────────────────────────────────────────────────────────────────────────

export const STOP_DOING: Record<WealthCodeKey, [string, string, string]> = {
  investmentBrain: [
    "Chasing shiny opportunities without a clear investment thesis written down",
    "Moving to execution before the numbers and structure make sense",
    "Letting short-term noise override your long-horizon positioning",
  ],
  brandingMagnet: [
    "Undercharging because visibility feels like 'enough' compensation",
    "Saying yes to every speaking, content, or collaboration request without a monetisation plan",
    "Treating audience size as the goal instead of conversion rate as the metric",
  ],
  strategyPlanner: [
    "Over-planning without a committed execution date — strategy without action is just delay",
    "Waiting for the 'perfect' strategic window instead of working with the current one",
    "Building systems for other people instead of protecting your own highest-leverage work",
  ],
  collaborator: [
    "Over-investing in relationships that extract more than they contribute to your growth",
    "Closing deals and moving on without building the recurring relationship structure",
    "Letting the quality of your partnerships drift without periodic alignment reviews",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 90-Day Action Plan (wealth-code specific actions, combined with DaYun keyActions)
// ─────────────────────────────────────────────────────────────────────────────

export const ACTION_PLAN_ITEMS: Record<WealthCodeKey, string> = {
  investmentBrain:  "Review your capital allocation — identify one underperforming position to restructure or exit",
  brandingMagnet:   "Identify one high-visibility opportunity to monetise this quarter — price it 20% above your instinct",
  strategyPlanner:  "Schedule a dedicated strategy day — review your systems, eliminate one bottleneck, and commit to one Q1 execution date",
  collaborator:     "Reach out to your three most valuable dormant relationships and propose a specific collaboration or referral arrangement",
};

// ─────────────────────────────────────────────────────────────────────────────
// Ideal Collaborator Profile
// ─────────────────────────────────────────────────────────────────────────────

export interface CollaboratorProfile {
  type:        string;
  description: string;
  /** What to look for when vetting a potential collaborator. */
  lookFor:     string[];
}

export const IDEAL_COLLABORATOR: Record<WealthCodeKey, CollaboratorProfile> = {
  investmentBrain: {
    type:        "Branding Magnet or Collaborator",
    description:
      "You handle the capital strategy, structure, and long-term positioning. You need someone who builds relationships, drives visibility, and stays in motion — the things your archetype systematically deprioritises. Without them, your best ideas stall at the distribution stage.",
    lookFor:     [
      "High social energy and natural relationship-builder",
      "Execution-focused, not analysis-focused",
      "Comfortable with ambiguity and fast pivots",
    ],
  },
  brandingMagnet: {
    type:        "Investment Brain or Strategy Planner",
    description:
      "You generate attention, relationships, and revenue momentum. You need someone who builds the structural framework, manages capital efficiency, and protects your margins — the things visibility-focused archetypes naturally skip. Without them, revenue comes in fast and leaks out just as quickly.",
    lookFor:     [
      "Financially disciplined and numbers-first thinker",
      "Systems-builder who can scale what you have already created",
      "Comfortable operating behind the scenes without needing the spotlight",
    ],
  },
  strategyPlanner: {
    type:        "Branding Magnet or Collaborator",
    description:
      "You see five moves ahead, build the systems, and protect long-term positioning. You need someone who can activate your strategy in the market — generating the visibility and relationships that translate your plans into traction. Without them, your systems are built perfectly but quietly.",
    lookFor:     [
      "Externally-facing and network-rich",
      "Action-biased rather than analysis-biased",
      "Strong presence and communication skills",
    ],
  },
  collaborator: {
    type:        "Investment Brain or Strategy Planner",
    description:
      "You build the trust, relationships, and collaborative structures that create revenue. You need someone who brings financial structure and long-horizon thinking — so the opportunities your network generates are captured systematically rather than flowing through without a container.",
    lookFor:     [
      "Strong financial and capital management discipline",
      "Structured thinker who can formalise informal arrangements",
      "Long-term orientation, not short-term opportunism",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Focus On — wealth-code specific high-leverage priorities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The three highest-leverage focus areas for each wealth archetype.
 * Displayed as a "FOCUS ON" list in the Wealth Blueprint chapter,
 * directly before the STOP_DOING list as a positive counterbalance.
 */
export const FOCUS_ON: Record<WealthCodeKey, [string, string, string]> = {
  investmentBrain: [
    "Building and documenting a clear investment thesis for every capital decision before committing",
    "Identifying one compounding asset position to deepen rather than adding more positions horizontally",
    "Creating a quarterly review cadence to objectively score each position against your original thesis",
  ],
  brandingMagnet: [
    "Converting your existing audience or reputation into one premium, high-margin offer this quarter",
    "Establishing a consistent content or visibility cadence that compounds your authority over time",
    "Identifying your highest-conversion channel and doubling down on it while reducing scattered efforts",
  ],
  strategyPlanner: [
    "Choosing one major strategic objective for the next 90 days and eliminating all decisions that do not serve it",
    "Scheduling protected thinking time each week — your best leverage comes from strategy, not execution",
    "Identifying the single system in your business that, if optimised, would create the largest downstream return",
  ],
  collaborator: [
    "Mapping your three most valuable untapped relationships and initiating a specific, reciprocal collaboration",
    "Structuring your best joint venture arrangements into formal agreements with clear revenue-sharing terms",
    "Building a referral pipeline that runs systematically — your wealth flows through people, make that flow deliberate",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Decision Framework Recommendations (shared between home base and PDF)
// Previously in alignment-advantage/index.tsx — centralised here.
// ─────────────────────────────────────────────────────────────────────────────

export interface FrameworkRecommendation {
  heading: string;
  copy:    string;
  color:   string;
}

export const FRAMEWORK_RECOMMENDATIONS: Record<number, FrameworkRecommendation> = {
  3: {
    heading: "Full Alignment — Execute with Confidence",
    copy:    "Your structure, timing, and wealth code are all pointing in the same direction. This is a rare window. Move decisively.",
    color:   "text-emerald-700 dark:text-emerald-300",
  },
  2: {
    heading: "Strong Alignment — Proceed with Adjustments",
    copy:    "Two of three axes are aligned. Proceed, but address the misaligned axis before committing fully. Small pivots now prevent costly corrections later.",
    color:   "text-amber-700 dark:text-amber-300",
  },
  1: {
    heading: "Partial Alignment — Pause and Reassess",
    copy:    "Only one axis is aligned. Revisit the decision in 30–60 days or adjust your approach to bring the other axes into alignment.",
    color:   "text-orange-700 dark:text-orange-300",
  },
  0: {
    heading: "Misalignment Detected — Do Not Proceed Yet",
    copy:    "Your structure, timing, and wealth code are all pointing away from this decision. Wait for a more aligned window or fundamentally reframe the move.",
    color:   "text-rose-700 dark:text-rose-300",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Phase Alignment Matrix — shared between PhaseAlignmentCard and the PDF
// ─────────────────────────────────────────────────────────────────────────────

/** Timing phase keys aligned with the Alignment Advantage framework. */
export type PhaseAlignmentSeasonKey = "expansion" | "visibility" | "consolidation" | "foundation";
export type PhaseAlignmentWealthKey = "investmentBrain" | "brandingMagnet" | "strategyPlanner" | "collaborator";

export interface PhaseAlignmentEntry {
  copy:     string;
  watchOut: [string, string];
}

export const PHASE_ALIGNMENT_MATRIX: Record<PhaseAlignmentSeasonKey, Record<PhaseAlignmentWealthKey, PhaseAlignmentEntry>> = {
  expansion: {
    investmentBrain:  { copy: "Spring cycles reward bold capital deployment. Your Investment Brain is perfectly suited for this growth window — this is your season to place calculated bets and expand your portfolio.", watchOut: ["Spreading capital across too many positions at once instead of going deep on your best thesis", "Acting on FOMO-driven opportunities rather than pre-researched conviction plays"] },
    brandingMagnet:   { copy: "Spring is launch season, and your Branding Magnet thrives in visibility and expansion. Amplify your presence now — the market is receptive and your signal carries further.", watchOut: ["Launching without a monetisation funnel behind your visibility push", "Over-creating content without converting your existing audience first"] },
    strategyPlanner:  { copy: "Your Strategy Planner archetype aligns well with Spring's growth energy. Use this period to execute plans you've been developing. Momentum builds quickly when you move now.", watchOut: ["Over-planning when the window requires execution — Spring rewards action, not refinement", "Missing the launch window because the plan isn't 'perfect' yet"] },
    collaborator:     { copy: "Spring opens doors and builds bridges. Your Collaborator wealth code finds its strongest expression in forming new partnerships and joint ventures during this expansion window.", watchOut: ["Saying yes to every introduction and spreading your relationship energy too thin", "Entering partnerships without clarity on structure and mutual contribution"] },
  },
  visibility: {
    investmentBrain:  { copy: "Summer is harvest season. Your Investment Brain should focus on monetising returns from previous positions and scaling what's already working. Resist the urge to open new positions — harvest first.", watchOut: ["Opening new speculative positions when you should be compounding existing ones", "Underestimating the compounding power of consolidating before expanding"] },
    brandingMagnet:   { copy: "Summer is your highest-leverage season. Branding Magnets collect the rewards of their visibility in Summer. Monetise your audience, launch premium offers, and convert attention into revenue.", watchOut: ["Staying in creation mode instead of shifting into monetisation mode this season", "Discounting your premium offers when the market is most receptive to full-price conversions"] },
    strategyPlanner:  { copy: "Your Strategy Planner is built for Summer. Systematic execution of your plans produces outsized returns now. Consolidate gains, optimise operations, and extract maximum value from existing systems.", watchOut: ["Starting new strategic initiatives before capturing the value from current ones", "Over-optimising systems instead of deploying them and capturing returns"] },
    collaborator:     { copy: "Summer rewards your Collaborator's network of trust. Revenue generated through partnerships and referrals accelerates now. Deepen existing alliances and activate your inner circle.", watchOut: ["Neglecting your highest-value existing relationships while chasing new ones", "Failing to formalise revenue-sharing structures while trust is high"] },
  },
  consolidation: {
    investmentBrain:  { copy: "Autumn demands caution from your Investment Brain. This is a consolidation season — protect capital, de-risk positions, and avoid speculative moves. Patience here prevents costly mistakes.", watchOut: ["Making speculative new investments against the seasonal current", "Letting overconfidence from recent gains lead to overexposure"] },
    brandingMagnet:   { copy: "Autumn calls for pruning, not growing. For your Branding Magnet, this means cutting low-ROI channels and doubling down on what converts. Protect your reputation by saying no more often.", watchOut: ["Launching major campaigns in a season that rewards consolidation over expansion", "Ignoring negative audience feedback signals that surface more clearly in Autumn"] },
    strategyPlanner:  { copy: "Your Strategy Planner's instinct to plan is perfectly timed in Autumn. Use this season to audit, refine, and prepare your next Spring strategy. Avoid committing to major new initiatives.", watchOut: ["Committing resources to new strategic bets when the season calls for review", "Over-auditing and never committing to the revised strategy — analysis paralysis in Autumn"] },
    collaborator:     { copy: "Autumn is a season for reviewing partnerships. Your Collaborator should audit relationships — strengthen the ones that compound, and gracefully exit those that drain. Quality over quantity now.", watchOut: ["Avoiding difficult conversations about underperforming partnerships out of politeness", "Entering new partnership agreements during a season designed for review, not initiation"] },
  },
  foundation: {
    investmentBrain:  { copy: "Winter is your Investment Brain's research and due-diligence season. Study markets, identify the plays you'll execute in Spring, and build conviction without pulling the trigger yet.", watchOut: ["Acting on Winter-season conviction before the Spring execution window opens", "Under-investing in research and due diligence and entering Spring underprepared"] },
    brandingMagnet:   { copy: "Winter fuels your Branding Magnet's creative engine. Build content, develop your positioning, and lay the groundwork for a powerful Spring launch. The audience you earn now grows with you.", watchOut: ["Expecting Winter-built content to produce immediate revenue — it compounds into Spring", "Neglecting your existing audience while building new content for future audiences"] },
    strategyPlanner:  { copy: "Winter is the Strategy Planner's season. Systems, frameworks, and long-horizon plans built in Winter become Spring's competitive advantage. This is your most productive planning window.", watchOut: ["Treating Winter as a rest period when it is actually your highest-leverage planning season", "Building strategies without execution dates — plans without commitments are just intentions"] },
    collaborator:     { copy: "Winter deepens relationships. Your Collaborator should invest in authentic connection — mentor others, seek mentors, and plant seeds for partnerships that will flourish in the Spring cycle.", watchOut: ["Withdrawing from your network entirely during Winter — relationships need maintenance, not just activation", "Treating relationship-building as optional when it is your primary wealth-generation mechanism"] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Alternative Path copy — used in the PDF Risk Mitigation section
// Keyed by DaYun season when misalignment is detected.
// ─────────────────────────────────────────────────────────────────────────────

export const ALTERNATIVE_PATH: Record<string, string> = {
  expansion:     "Consider a smaller-scale version of this move — test the thesis with lower exposure before full commitment.",
  visibility:    "Redirect the energy toward harvesting an existing position rather than opening a new one.",
  consolidation: "Protect your current base first. Revisit this decision in your next Expansion phase when the environment is more expansive.",
  foundation:    "Use this period to refine the strategy, do deeper research, and build conviction — commit when your Expansion phase arrives.",
  // Legacy keys kept for backward compatibility with any callers using the old names
  spring:  "Consider a smaller-scale version of this move — test the thesis with lower exposure before full commitment.",
  summer:  "Redirect the energy toward harvesting an existing position rather than opening a new one.",
  autumn:  "Protect your current base first. Revisit this decision in your next Expansion phase.",
  winter:  "Use this period to refine the strategy, do deeper research, and build conviction.",
};
