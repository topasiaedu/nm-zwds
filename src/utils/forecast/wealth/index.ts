/**
 * Wealth-code template content for the Alignment Advantage feature.
 *
 * All maps are keyed by `WealthCodeKey`. For the initial mockup, `investmentBrain`
 * has full content; the remaining three keys use the same values as stubs.
 * Fill in archetype-specific copy before production launch.
 *
 * No astrological derivation lives here: these are display-layer templates only.
 */

import type { WealthCodeKey } from "../../zwds/analysis_constants/wealth_code_mapping";

// ─────────────────────────────────────────────────────────────────────────────
// Wealth Type Categorisation
// ─────────────────────────────────────────────────────────────────────────────

/** The four wealth-attraction categories referenced in the offer brief. */
export type WealthCategory =
  | "Asset Growth"
  | "Reputation & Influence"
  | "Strategic Moves"
  | "Partnerships"
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
    category:    "Asset Growth",
    tagline:     "You build wealth by acquiring assets and letting them grow over time.",
    description:
      "You are built for long-term investing. You don't chase quick money or trendy side hustles. You buy assets, protect what you have, and let time do the work. The longer you hold, the more your wealth multiplies.",
    examples:    ["Stock portfolios", "Real estate", "Long-term investments"],
  },
  brandingMagnet: {
    category:    "Reputation & Influence",
    tagline:     "You build wealth by monetizing your name, your network, and your expertise.",
    description:
      "Your biggest asset is your reputation. The more visible you become, the more money you make. Whether you are climbing the corporate ladder or consulting on the side, your income grows when people know who you are.",
    examples:    ["Consulting fees", "Paid speaking or writing", "High-visibility leadership roles"],
  },
  strategyPlanner: {
    category:    "Strategic Moves",
    tagline:     "You build wealth by planning ahead and capturing big opportunities when they arrive.",
    description:
      "You make money by seeing what others miss. You build systems quietly, wait for the right moment, and then make a major move. Your biggest financial wins will come from careful planning, not just working harder.",
    examples:    ["Negotiating major job offers", "Selling a side business", "Timing a market shift"],
  },
  collaborator: {
    category:    "Partnerships",
    tagline:     "You build wealth through the people you know and the alliances you build.",
    description:
      "Your wealth flows through people. Your best income streams will come from partnerships, referrals, and team efforts. You make money when you connect the right people or team up with someone who has what you lack.",
    examples:    ["Referral fees", "Revenue-sharing agreements", "Co-owned projects"],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Stop Doing (wealth-code specific blind spots)
// ─────────────────────────────────────────────────────────────────────────────

export const STOP_DOING: Record<WealthCodeKey, [string, string, string]> = {
  investmentBrain: [
    "Throwing money at trendy investments without doing your own research first",
    "Buying things just because you have cash, instead of waiting for a good deal",
    "Panicking and selling when the market drops temporarily",
  ],
  brandingMagnet: [
    "Doing free work because you think 'exposure' pays the bills",
    "Saying yes to every meeting or podcast without a plan to actually make money from it",
    "Caring more about how many followers you have than how much money you are making",
  ],
  strategyPlanner: [
    "Planning forever without actually launching the project or making the move",
    "Waiting for the 'perfect' time to ask for a raise or start a side hustle",
    "Building amazing systems for your boss while ignoring your own personal finances",
  ],
  collaborator: [
    "Spending all your time helping people who never help you back",
    "Doing a deal on a handshake instead of putting the money split in writing",
    "Staying in a bad partnership just because you don't want to hurt their feelings",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 90-Day Action Plan (wealth-code specific actions, combined with DaYun keyActions)
// ─────────────────────────────────────────────────────────────────────────────

export const ACTION_PLAN_ITEMS: Record<WealthCodeKey, string> = {
  investmentBrain:  "Look at where your money is sitting right now. Move it out of dead accounts and into something that actually grows.",
  brandingMagnet:   "Find one way to charge money for your expertise this month. Price it 20% higher than you feel comfortable with.",
  strategyPlanner:  "Pick one big goal for the next 3 months. Block off a full weekend just to plan exactly how you will achieve it.",
  collaborator:     "Call three people you haven't spoken to in a year and propose a specific way you can help each other make money.",
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
      "You are great at managing money and planning for the future, but you hate selling yourself. You need someone who is loud, social, and loves networking. Without them, your great ideas will stay hidden.",
    lookFor:     [
      "Highly social and loves talking to people",
      "Takes action quickly instead of over-analyzing",
      "Comfortable taking risks and adapting on the fly",
    ],
  },
  brandingMagnet: {
    type:        "Investment Brain or Strategy Planner",
    description:
      "You are great at getting attention and starting new things, but you hate the boring details. You need someone who loves spreadsheets, organizing, and protecting money. Without them, you will make a lot of money but spend it all.",
    lookFor:     [
      "Great with money and highly disciplined",
      "Loves organizing and building systems",
      "Happy to work behind the scenes without needing the spotlight",
    ],
  },
  strategyPlanner: {
    type:        "Branding Magnet or Collaborator",
    description:
      "You are a master at planning five steps ahead, but you can get stuck in your own head. You need someone who just goes out and does the work. Without them, you will have a perfect plan that never actually launches.",
    lookFor:     [
      "Has a huge network and knows everyone",
      "Prefers taking action over sitting in meetings",
      "Great at pitching ideas and closing deals",
    ],
  },
  collaborator: {
    type:        "Investment Brain or Strategy Planner",
    description:
      "You are amazing at building trust and bringing people together, but you often forget to ask for the money. You need someone who is strict about contracts, pricing, and long-term planning. Without them, people will take advantage of you.",
    lookFor:     [
      "Strict about money and contracts",
      "Thinks about the long-term, not just the quick win",
      "Not afraid to be the 'bad guy' in a negotiation",
    ],
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Focus On: wealth-code specific high-leverage priorities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * The three highest-leverage focus areas for each wealth archetype.
 * Displayed as a "FOCUS ON" list in the Wealth Blueprint chapter,
 * directly before the STOP_DOING list as a positive counterbalance.
 */
export const FOCUS_ON: Record<WealthCodeKey, [string, string, string]> = {
  investmentBrain: [
    "Write down exactly why you are buying an asset before you spend a single dollar",
    "Put more money into your best investment instead of buying ten different mediocre things",
    "Check your investments once a quarter and sell the ones that aren't performing",
  ],
  brandingMagnet: [
    "Turn your skills into one premium service or product that you can sell this month",
    "Post online or speak at events consistently so people remember who you are",
    "Figure out exactly how you get your best clients or job offers, and only do that",
  ],
  strategyPlanner: [
    "Pick one major goal for the next 90 days and say no to everything else",
    "Block off two hours every week just to think. Stop being busy and start being strategic",
    "Find the one task that takes up most of your time and automate it or hire someone to do it",
  ],
  collaborator: [
    "Make a list of the three most powerful people you know and ask them how you can work together",
    "Stop doing favors for free. Put your referral fees or revenue splits in writing",
    "Build a system where people naturally send you clients or job offers",
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Decision Framework Recommendations (shared between home base and PDF)
// Previously in alignment-advantage/index.tsx: centralised here.
// ─────────────────────────────────────────────────────────────────────────────

export interface FrameworkRecommendation {
  heading: string;
  copy:    string;
  color:   string;
}

export const FRAMEWORK_RECOMMENDATIONS: Record<number, FrameworkRecommendation> = {
  3: {
    heading: "Full Alignment: Execute with Confidence",
    copy:    "Your structure, timing, and wealth code are all pointing in the same direction. This is a rare window. Move decisively.",
    color:   "text-emerald-700 dark:text-emerald-300",
  },
  2: {
    heading: "Strong Alignment: Proceed with Adjustments",
    copy:    "Two of three axes are aligned. Proceed, but address the misaligned axis before committing fully. Small pivots now prevent costly corrections later.",
    color:   "text-amber-700 dark:text-amber-300",
  },
  1: {
    heading: "Partial Alignment: Pause and Reassess",
    copy:    "Only one axis is aligned. Revisit the decision in 30–60 days or adjust your approach to bring the other axes into alignment.",
    color:   "text-orange-700 dark:text-orange-300",
  },
  0: {
    heading: "Misalignment Detected: Do Not Proceed Yet",
    copy:    "Your structure, timing, and wealth code are all pointing away from this decision. Wait for a more aligned window or fundamentally reframe the move.",
    color:   "text-rose-700 dark:text-rose-300",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Phase Alignment Matrix: shared between PhaseAlignmentCard and the PDF
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
    investmentBrain:  { copy: "Spring is for aggressive growth. This is the time to buy assets and expand your portfolio. The market is moving fast, so place your bets.", watchOut: ["Buying too many different things instead of going deep on your best idea", "Buying out of FOMO instead of doing your own research"] },
    brandingMagnet:   { copy: "Spring is launch season. The market is paying attention right now, so get loud. Launch the product, pitch the service, and be as visible as possible.", watchOut: ["Getting lots of attention but having nothing to actually sell", "Creating free content forever instead of asking for the sale"] },
    strategyPlanner:  { copy: "Spring is when you stop planning and start doing. Take the strategy you've been working on and launch it. Momentum builds quickly if you move right now.", watchOut: ["Still planning when you should be launching", "Waiting for the plan to be 'perfect' instead of just starting"] },
    collaborator:     { copy: "Spring opens doors. This is the best time to form new partnerships, sign joint ventures, and meet new people. Your network will grow fast right now.", watchOut: ["Saying yes to every meeting and spreading yourself too thin", "Starting partnerships without putting the money split in writing"] },
  },
  visibility: {
    investmentBrain:  { copy: "Summer is harvest season. Focus on making money from the assets you already own. Don't start a bunch of new investments—cash in on the ones that are working.", watchOut: ["Buying new, risky assets when you should be collecting profits", "Underestimating how much money you can make just by holding your best assets"] },
    brandingMagnet:   { copy: "Summer is your most profitable season. You have the audience's attention, now it's time to get paid. Launch your most expensive offers and convert attention into cash.", watchOut: ["Creating more free content instead of selling", "Discounting your prices when people are actually willing to pay full price"] },
    strategyPlanner:  { copy: "Summer is when your systems pay off. Run the play, optimize your workflow, and extract as much money as possible from the systems you built.", watchOut: ["Starting a brand new project before you finish making money from the current one", "Tweaking the system endlessly instead of just letting it run"] },
    collaborator:     { copy: "Summer is when your network pays you back. The trust you built will turn into referrals and revenue. Lean into your closest alliances and ask for the business.", watchOut: ["Ignoring your best clients while trying to find new ones", "Doing deals on a handshake instead of formalizing the revenue share"] },
  },
  consolidation: {
    investmentBrain:  { copy: "Autumn is for protecting what you have. De-risk your portfolio, cut your losers, and don't make any wild bets. Patience right now will save you a lot of money.", watchOut: ["Making risky investments just because you feel bored", "Getting cocky from recent wins and betting too much money"] },
    brandingMagnet:   { copy: "Autumn is for cutting the fat. Stop doing the marketing channels that don't work. Focus entirely on the one or two things that actually bring in paying clients.", watchOut: ["Trying to launch a massive new campaign when the market is slowing down", "Ignoring negative feedback from your audience"] },
    strategyPlanner:  { copy: "Autumn is for reviewing the tape. Look at what worked and what failed. Start drafting your plan for next year, but don't launch any massive new initiatives yet.", watchOut: ["Committing time and money to a new idea when you should be reviewing the old ones", "Over-analyzing your failures until you get paralyzed"] },
    collaborator:     { copy: "Autumn is for firing bad clients and ending bad partnerships. Keep the relationships that make you money and gracefully exit the ones that drain your energy.", watchOut: ["Avoiding a hard conversation with a bad partner just to be polite", "Signing a new partnership agreement when you should be cleaning house"] },
  },
  foundation: {
    investmentBrain:  { copy: "Winter is for research. Study the market, find the undervalued assets, and build your thesis. Don't pull the trigger yet—just get ready for Spring.", watchOut: ["Buying the asset now instead of waiting for the Spring growth cycle", "Being lazy and not doing the research, so you miss the Spring opportunities"] },
    brandingMagnet:   { copy: "Winter is for building in the dark. Write the book, film the course, or rebrand your website. The work you do quietly now will explode when Spring arrives.", watchOut: ["Getting frustrated that your new content isn't making money immediately", "Ignoring your current paying clients because you are too busy building new stuff"] },
    strategyPlanner:  { copy: "Winter is your superpower. Build the systems, write the SOPs, and map out your 12-month strategy. The plans you make now will be your unfair advantage later.", watchOut: ["Using Winter as an excuse to just take a vacation and do nothing", "Making a massive plan but refusing to set a hard launch date"] },
    collaborator:     { copy: "Winter is for deepening trust. Check in on your mentors, help out your peers, and plant the seeds for deals you want to close next year.", watchOut: ["Disappearing completely and letting your network go cold", "Thinking you don't need to network just because business is slow right now"] },
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// Alternative Path copy: used in the PDF Risk Mitigation section
// Keyed by DaYun season when misalignment is detected.
// ─────────────────────────────────────────────────────────────────────────────

export const ALTERNATIVE_PATH: Record<string, string> = {
  expansion:     "Consider a smaller-scale version of this move: test the thesis with lower exposure before full commitment.",
  visibility:    "Redirect the focus toward harvesting an existing position rather than opening a new one.",
  consolidation: "Protect your current base first. Revisit this decision in your next Expansion phase when the environment is more expansive.",
  foundation:    "Use this period to refine the strategy, do deeper research, and build conviction: commit when your Expansion phase arrives.",
  // Legacy keys kept for backward compatibility with any callers using the old names
  spring:  "Consider a smaller-scale version of this move: test the thesis with lower exposure before full commitment.",
  summer:  "Redirect the focus toward harvesting an existing position rather than opening a new one.",
  autumn:  "Protect your current base first. Revisit this decision in your next Expansion phase.",
  winter:  "Use this period to refine the strategy, do deeper research, and build conviction.",
};
