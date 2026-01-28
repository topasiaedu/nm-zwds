/**
 * Founder Timing Decision System Report — Section 05: Scalable Income Blueprint
 *
 * Redesign goal (speaker-aligned)
 * - Side income success comes from ALIGNMENT, not luck.
 * - Use the user's Wealth Code + Dayun season timing to recommend the most aligned paths.
 *
 * Deliverables
 * - Chart 1 (Hero): Side Income Priority Matrix (top 5 ideas for dominant Wealth Code)
 * - Chart 2: Wealth Code Pathways (4 swim lanes, 5 ideas each, dominant lane highlighted)
 *
 * Constraints
 * - Strict TypeScript (no `any`, no non-null assertions, no `unknown` casts)
 * - Deterministic scoring (no randomness)
 * - Gold/amber wealth theme; mobile responsive; founder-friendly copy
 */
import React, { useMemo } from "react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import type { DayunSeason } from "../../types/dayun";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import type { WealthProfileType } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import type { WealthCodeKey } from "../../utils/zwds/analysis_constants/wealth_code_mapping";
import {
  WEALTH_CODE_LABELS,
} from "../../utils/zwds/analysis_constants/wealth_code_mapping";

/**
 * Props for the IncomeBlueprint section component.
 */
export interface IncomeBlueprintProps {
  /** Complete ZWDS chart data. */
  chartData: ChartData;
}

type CapitalRequirement = "low" | "medium" | "high";
type EffortRequirement = "low" | "medium" | "high";

type IdeaId =
  | "sp_coaching"
  | "sp_templates"
  | "sp_ops"
  | "sp_productivity"
  | "sp_minicourse"
  | "ib_rental_property"
  | "ib_dividend_stocks"
  | "ib_digital_product"
  | "ib_reits_staking"
  | "ib_store_agent"
  | "bm_short_videos"
  | "bm_brand_deals"
  | "bm_events_webinars"
  | "bm_book"
  | "bm_digital_products"
  | "co_co_launch"
  | "co_group_programs"
  | "co_referrals_affiliates"
  | "co_middleman_deals"
  | "co_bundled_services";

type WealthCodeIdea = {
  id: IdeaId;
  code: WealthCodeKey;
  title: string;
  oneLine: string;
  /**
   * Founder-friendly detail copy shown on hover/tap.
   * Keep this aligned to the speaker’s “alignment” tone.
   */
  details: string;
  capital: CapitalRequirement;
  effort: EffortRequirement;
  /**
   * Best seasons where this idea is naturally “in timing”.
   * Example: Spring = launch, Summer = scale, Autumn = optimize, Winter = build foundations.
   */
  bestSeasons: ReadonlyArray<DayunSeason>;
  /**
   * Deterministic ceiling score (0–10).
   * This is not “guaranteed income”, it is “how high it can go if aligned”.
   */
  potential: number;
  /**
   * Small deterministic adjustment to differentiate ideas within a code.
   */
  alignmentDelta: number;
  /**
   * Small deterministic adjustment to differentiate effort expectations within a code.
   * Positive = easier (higher Effort score).
   */
  effortDelta: number;
  /**
   * Small deterministic adjustment to differentiate capital needs within a requirement bucket.
   * Positive = more affordable (higher Capital score).
   */
  capitalDelta: number;
};

type ScoredIdea = {
  idea: WealthCodeIdea;
  scores: {
    alignment: number;
    timing: number;
    capital: number;
    effort: number;
    potential: number;
  };
  weightedTotal: number;
  isTopPick: boolean;
  isRunnerUp: boolean;
  isThirdPick: boolean;
};

/**
 * Safe clamp for a 0–10 score.
 */
function clamp0To10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, value));
}

/**
 * Format a 0–10 score as a fixed string for UI.
 */
function formatScore(value: number): string {
  const v = clamp0To10(value);
  return v.toFixed(1);
}

/**
 * Get a wealth code score from an analyzed profile.
 */
function getCodeScore(profileCodes: ReadonlyArray<{ key: WealthCodeKey; score: number }>, key: WealthCodeKey): number {
  const found = profileCodes.find((c) => c.key === key);
  return found ? found.score : 0;
}

/**
 * Convert a Dayun season to a founder-friendly timing label.
 */
function getSeasonCue(season: DayunSeason | null): { title: string; action: string } {
  if (season === "spring") return { title: "Spring", action: "Launch" };
  if (season === "summer") return { title: "Summer", action: "Scale" };
  if (season === "autumn") return { title: "Autumn", action: "Refine" };
  if (season === "winter") return { title: "Winter", action: "Build" };
  return { title: "Unknown", action: "Align" };
}


/**
 * Cyclical season distance (0 = same, 1 = adjacent, 2 = two steps).
 */
function seasonDistance(a: DayunSeason, b: DayunSeason): number {
  const order: ReadonlyArray<DayunSeason> = ["spring", "summer", "autumn", "winter"];
  const aIdx = order.indexOf(a);
  const bIdx = order.indexOf(b);
  if (aIdx < 0 || bIdx < 0) return 2;

  const diff = Math.abs(aIdx - bIdx);
  // Circular wrap-around distance
  return Math.min(diff, order.length - diff);
}

/**
 * Compute Timing score (0–10) based on Dayun season fit.
 *
 * Rules (deterministic):
 * - Exact best-season match: 9.2
 * - Adjacent season: 7.4
 * - Two steps away: 5.6
 * - Unknown season: 6.5
 */
function scoreTiming(dayunSeason: DayunSeason | null, bestSeasons: ReadonlyArray<DayunSeason>): number {
  if (!dayunSeason) return 6.5;
  if (bestSeasons.includes(dayunSeason)) return 9.2;

  const minDist = bestSeasons.reduce((acc, s) => Math.min(acc, seasonDistance(dayunSeason, s)), 2);
  if (minDist <= 1) return 7.4;
  return 5.6;
}

/**
 * Compute Effort score (0–10) where higher means more realistic with limited time.
 */
function scoreEffort(requirement: EffortRequirement, delta: number): number {
  const base = (() => {
    if (requirement === "low") return 8.8;
    if (requirement === "medium") return 6.6;
    return 4.8;
  })();

  return clamp0To10(base + delta);
}

/**
 * Compute Capital score (0–10) where higher means more affordable now.
 *
 * We derive affordability from the user's Investment Brain score:
 * - Higher IB score = more ability to fund/start capital-heavy plays.
 * - Low/Medium/High capital requirements map to minimum “comfort” IB thresholds.
 */
function scoreCapital(ibScore0To10: number, requirement: CapitalRequirement, delta: number): number {
  const requiredIb = (() => {
    if (requirement === "low") return 2;
    if (requirement === "medium") return 5;
    return 7.5;
  })();

  // Positive gap means “you have enough”, negative means “capital stretch”.
  const gap = clamp0To10(ibScore0To10) - requiredIb;

  // Convert gap into score.
  // - If you're below requirement, score drops quickly.
  // - If you're above, it caps near the top.
  const base = gap >= 0 ? 8.2 + Math.min(1.4, gap * 0.25) : 8.2 + gap * 1.15;
  return clamp0To10(base + delta);
}

/**
 * Compute Alignment score (0–10).
 *
 * Since Chart 1 only shows ideas from the dominant code, alignment should be high,
 * but still vary slightly per idea.
 */
function scoreAlignment(profileType: WealthProfileType, delta: number): number {
  const confidenceBoost = (() => {
    if (profileType === "specialized") return 0.6;
    if (profileType === "hybrid") return 0.3;
    return 0;
  })();

  return clamp0To10(8.4 + confidenceBoost + delta);
}

/**
 * Compute weighted total (0–10 scale-ish).
 *
 * Requested weights:
 * - Alignment 35%
 * - Timing 25%
 * - Capital 15%
 * - Effort 10%
 * - Potential 15%
 */
function computeWeightedTotal(scores: ScoredIdea["scores"]): number {
  const total =
    scores.alignment * 0.35 +
    scores.timing * 0.25 +
    scores.capital * 0.15 +
    scores.effort * 0.1 +
    scores.potential * 0.15;
  return clamp0To10(total);
}

/**
 * Speaker-script idea mapping.
 * Each Wealth Code gets 5 specific aligned side-income paths.
 */
const WEALTH_CODE_IDEAS: ReadonlyArray<WealthCodeIdea> = [
  // Strategy Planner (SP) — systems, templates, coaching, frameworks, courses
  {
    id: "sp_coaching",
    code: "strategyPlanner",
    title: "Coaching / Service Business",
    oneLine: "Guide people step-by-step with a clear A–Z plan.",
    details:
      "Your natural path is structure. People pay for clarity — you turn messy problems into a clean roadmap, then lead them through it.",
    capital: "low",
    effort: "high",
    bestSeasons: ["spring", "summer"],
    potential: 8.6,
    alignmentDelta: 0.4,
    effortDelta: -0.4,
    capitalDelta: 0.2,
  },
  {
    id: "sp_templates",
    code: "strategyPlanner",
    title: "Templates / Toolkits",
    oneLine: "Sell SOPs, checklists, org charts — build once, sell repeatedly.",
    details:
      "Alignment looks like packaging your systems. You don’t need hype — your framework becomes the product, and auto-delivery does the work.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["autumn", "winter"],
    potential: 7.8,
    alignmentDelta: 0.2,
    effortDelta: 0.2,
    capitalDelta: 0.4,
  },
  {
    id: "sp_ops",
    code: "strategyPlanner",
    title: "HR & Operations Services",
    oneLine: "Help businesses restructure teams and workflows for clarity.",
    details:
      "Founder-friendly, high trust. You walk into chaos and leave behind a system people can actually run — that’s your natural lane.",
    capital: "low",
    effort: "high",
    bestSeasons: ["autumn", "winter"],
    potential: 8,
    alignmentDelta: 0.3,
    effortDelta: -0.6,
    capitalDelta: 0.2,
  },
  {
    id: "sp_productivity",
    code: "strategyPlanner",
    title: "Build Productivity Systems (Notion/ClickUp/Airtable)",
    oneLine: "One-time system build; get paid per setup.",
    details:
      "This is alignment: you build the machine. Clients don’t pay for your time — they pay for the system that makes them faster.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["spring", "autumn"],
    potential: 7.6,
    alignmentDelta: 0.1,
    effortDelta: 0.1,
    capitalDelta: 0.5,
  },
  {
    id: "sp_minicourse",
    code: "strategyPlanner",
    title: "Mini-Course (Packaged Expertise)",
    oneLine: "Record once, sell many times online.",
    details:
      "When you align, you stop rebuilding every week. A course lets you scale your frameworks without scaling your hours.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["winter", "spring"],
    potential: 8.3,
    alignmentDelta: 0.25,
    effortDelta: -0.1,
    capitalDelta: 0.35,
  },

  // Investment Brain (IB) — assets, property, stocks, REITs, digital products
  {
    id: "ib_rental_property",
    code: "investmentBrain",
    title: "Rental Property",
    oneLine: "Buy an asset that pays you every month.",
    details:
      "Your natural path is compounding. You’re not chasing hype — you’re stacking assets that keep working even when you’re busy.",
    capital: "high",
    effort: "medium",
    bestSeasons: ["winter", "autumn"],
    potential: 8.8,
    alignmentDelta: 0.35,
    effortDelta: 0,
    capitalDelta: -0.4,
  },
  {
    id: "ib_dividend_stocks",
    code: "investmentBrain",
    title: "Dividend Stocks (Long-Term)",
    oneLine: "Own strong companies; let dividends become your side income.",
    details:
      "Alignment for you is steady and measured. You trust numbers, you play the long game, and you let consistency do the heavy lifting.",
    capital: "medium",
    effort: "low",
    bestSeasons: ["autumn", "winter"],
    potential: 7.6,
    alignmentDelta: 0.25,
    effortDelta: 0.4,
    capitalDelta: 0.1,
  },
  {
    id: "ib_digital_product",
    code: "investmentBrain",
    title: "Digital Product / Ebook (Modern Asset)",
    oneLine: "Create once; sell on auto-delivery.",
    details:
      "This is your modern asset play. You build something with numbers and clarity, then let the system sell it without daily effort.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["winter", "spring"],
    potential: 7.9,
    alignmentDelta: 0.15,
    effortDelta: 0.1,
    capitalDelta: 0.45,
  },
  {
    id: "ib_reits_staking",
    code: "investmentBrain",
    title: "REITs / Staking (Yield Streams)",
    oneLine: "Own a slice; earn steady distributions.",
    details:
      "Aligned income feels predictable. This path is about steady yield, not adrenaline. Your job is discipline, not daily hustle.",
    capital: "medium",
    effort: "low",
    bestSeasons: ["autumn", "winter"],
    potential: 7.2,
    alignmentDelta: 0.1,
    effortDelta: 0.35,
    capitalDelta: 0,
  },
  {
    id: "ib_store_agent",
    code: "investmentBrain",
    title: "E-Commerce Store (With an Agent)",
    oneLine: "Fund setup, monitor numbers, delegate operations.",
    details:
      "If you do this aligned, you treat the store like an asset. You focus on products, margins, and systems — not packing boxes all day.",
    capital: "medium",
    effort: "medium",
    bestSeasons: ["spring", "summer"],
    potential: 8.1,
    alignmentDelta: 0.2,
    effortDelta: -0.05,
    capitalDelta: -0.1,
  },

  // Branding Magnet (BM) — videos, brand deals, events, books, visibility
  {
    id: "bm_short_videos",
    code: "brandingMagnet",
    title: "Short-Form Videos",
    oneLine: "Visibility creates opportunity.",
    details:
      "Your natural path is being seen and remembered. When you show up consistently, opportunities convert into income.",
    capital: "low",
    effort: "high",
    bestSeasons: ["spring", "summer"],
    potential: 8.7,
    alignmentDelta: 0.35,
    effortDelta: -0.5,
    capitalDelta: 0.45,
  },
  {
    id: "bm_brand_deals",
    code: "brandingMagnet",
    title: "Brand Ambassador / Brand Deals",
    oneLine: "Turn trust into commission or retainers.",
    details:
      "Alignment is leverage: your presence becomes a distribution channel. The right brand fit makes it feel natural — not forced.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["summer"],
    potential: 8.2,
    alignmentDelta: 0.25,
    effortDelta: 0,
    capitalDelta: 0.5,
  },
  {
    id: "bm_events_webinars",
    code: "brandingMagnet",
    title: "Live Events / Webinars",
    oneLine: "Host a room; monetize your presence and offers.",
    details:
      "You don’t need to be ‘big’ to start. Your voice and energy are the asset — run a small room, then scale what works.",
    capital: "medium",
    effort: "high",
    bestSeasons: ["summer", "spring"],
    potential: 8.5,
    alignmentDelta: 0.3,
    effortDelta: -0.6,
    capitalDelta: -0.1,
  },
  {
    id: "bm_book",
    code: "brandingMagnet",
    title: "Write a Book (Authority Asset)",
    oneLine: "A book turns visibility into credibility.",
    details:
      "This is alignment when you want depth. A book positions you, then pulls speaking, clients, and partnerships toward you.",
    capital: "low",
    effort: "high",
    bestSeasons: ["autumn", "winter"],
    potential: 7.8,
    alignmentDelta: 0.1,
    effortDelta: -0.7,
    capitalDelta: 0.3,
  },
  {
    id: "bm_digital_products",
    code: "brandingMagnet",
    title: "Digital Products (Templates/Checklists)",
    oneLine: "Build once; your audience buys while you sleep.",
    details:
      "If you’re visible but not monetizing, this is the bridge. Turn what your audience asks for into a simple product.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["spring", "autumn"],
    potential: 8,
    alignmentDelta: 0.2,
    effortDelta: 0.1,
    capitalDelta: 0.45,
  },

  // Collaborator (CO) — partnerships, referrals, co-launches, bundled services
  {
    id: "co_co_launch",
    code: "collaborator",
    title: "Co-Launch With a Partner",
    oneLine: "Split roles; multiply results.",
    details:
      "Your natural path is not solo grind. Find the right partner and build a win-win machine together.",
    capital: "low",
    effort: "high",
    bestSeasons: ["spring", "summer"],
    potential: 8.4,
    alignmentDelta: 0.3,
    effortDelta: -0.5,
    capitalDelta: 0.35,
  },
  {
    id: "co_group_programs",
    code: "collaborator",
    title: "Group Programs / Retreats",
    oneLine: "Co-host experiences; share audience and revenue.",
    details:
      "Alignment is collaboration that feels energizing. You bring people together, and the room becomes the product.",
    capital: "medium",
    effort: "high",
    bestSeasons: ["summer"],
    potential: 8.2,
    alignmentDelta: 0.2,
    effortDelta: -0.6,
    capitalDelta: -0.1,
  },
  {
    id: "co_referrals_affiliates",
    code: "collaborator",
    title: "Referral / Affiliate Income",
    oneLine: "Connect people to value; earn commission.",
    details:
      "You don’t have to create everything. Your gift is trust — when you connect the right people, money follows naturally.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["autumn", "summer"],
    potential: 7.5,
    alignmentDelta: 0.15,
    effortDelta: 0.15,
    capitalDelta: 0.5,
  },
  {
    id: "co_middleman_deals",
    code: "collaborator",
    title: "Middleman Deals",
    oneLine: "Earn by connecting the right parties.",
    details:
      "Sometimes the fastest aligned income is connection. You’re paid for relationships, not for doing all the work yourself.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["summer", "spring"],
    potential: 7.8,
    alignmentDelta: 0.2,
    effortDelta: -0.1,
    capitalDelta: 0.45,
  },
  {
    id: "co_bundled_services",
    code: "collaborator",
    title: "Bundled Services",
    oneLine: "Partner to sell complete packages (each earns more).",
    details:
      "This is alignment for founders: you don’t just sell your piece — you bundle into a full solution that closes easier.",
    capital: "low",
    effort: "medium",
    bestSeasons: ["autumn", "winter"],
    potential: 8,
    alignmentDelta: 0.25,
    effortDelta: 0,
    capitalDelta: 0.4,
  },
];

/**
 * Get the 5 ideas for a specific Wealth Code.
 */
function ideasForCode(code: WealthCodeKey): WealthCodeIdea[] {
  return WEALTH_CODE_IDEAS.filter((i) => i.code === code);
}

/**
 * Get the gradient style for a specific metric.
 */
function getMetricGradient(label: string): string {
  const lowerLabel = label.toLowerCase();
  if (lowerLabel === "alignment") return "linear-gradient(to right, #a855f7, #9333ea)";
  if (lowerLabel === "capital") return "linear-gradient(to right, #10b981, #059669)";
  if (lowerLabel === "effort") return "linear-gradient(to right, #3b82f6, #06b6d4)";
  if (lowerLabel === "potential") return "linear-gradient(to right, #f59e0b, #eab308)";
  // Default fallback
  return "linear-gradient(to right, #f59e0b, #eab308)";
}

/**
 * Small UI helper: labeled score meter (0–10) with a horizontal bar.
 */
const ScoreBar: React.FC<{
  label: string;
  value0To10: number;
  /**
   * For compact layouts, hide the label (we show it elsewhere).
   */
  showLabel?: boolean;
}> = ({ label, value0To10, showLabel }) => {
  const value = clamp0To10(value0To10);
  const pct = (value / 10) * 100;
  const gradientStyle = getMetricGradient(label);

  return (
    <div className="w-full">
      {showLabel ? (
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{label}</span>
          <span className="text-xs font-bold text-gray-900 dark:text-white">{formatScore(value)}</span>
        </div>
      ) : null}

      <div className="h-2.5 w-full rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden shadow-inner">
        <div
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundImage: gradientStyle }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
};

/**
 * IncomeBlueprint — Section 05 component.
 */
export const IncomeBlueprint: React.FC<IncomeBlueprintProps> = ({ chartData }) => {
  const dayun = useMemo(() => calculateCurrentDayunCycle(chartData), [chartData]);
  const dayunSeason: DayunSeason | null = dayun?.season ?? null;
  const seasonCue = useMemo(() => getSeasonCue(dayunSeason), [dayunSeason]);

  // Wealth Code profile
  const wealthProfile = useMemo(() => analyzeWealthCode(chartData), [chartData]);
  const hasWealthCode = wealthProfile.hasRecognizedStars && wealthProfile.codes.length > 0;

  const dominantCode: WealthCodeKey | null = hasWealthCode ? wealthProfile.codes[0].key : null;
  const dominantCodeLabel = dominantCode ? WEALTH_CODE_LABELS[dominantCode] : "Unknown";

  const ibScore = useMemo(() => {
    return getCodeScore(wealthProfile.codes, "investmentBrain");
  }, [wealthProfile.codes]);

  // Chart 1: scored top 5 for dominant code
  const scoredIdeas = useMemo<ScoredIdea[]>(() => {
    if (!dominantCode) return [];

    const ideas = ideasForCode(dominantCode);
    const profileType = wealthProfile.profileType;

    const scored = ideas.map<ScoredIdea>((idea) => {
      const alignment = scoreAlignment(profileType, idea.alignmentDelta);
      const timing = scoreTiming(dayunSeason, idea.bestSeasons);
      const capital = scoreCapital(ibScore, idea.capital, idea.capitalDelta);
      const effort = scoreEffort(idea.effort, idea.effortDelta);
      const potential = clamp0To10(idea.potential);

      const weightedTotal = computeWeightedTotal({ alignment, timing, capital, effort, potential });

      return {
        idea,
        scores: { alignment, timing, capital, effort, potential },
        weightedTotal,
        isTopPick: false,
        isRunnerUp: false,
        isThirdPick: false,
      };
    });

    const sorted = [...scored].sort((a, b) => b.weightedTotal - a.weightedTotal);
    return sorted.map((row, idx) => ({
      ...row,
      isTopPick: idx === 0,
      isRunnerUp: idx === 1,
      isThirdPick: idx === 2,
    }));
  }, [dominantCode, wealthProfile.profileType, dayunSeason, ibScore]);

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider (match analysis section spacing) */}
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6" />

      {/* Section Header */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8"
        style={{
          background: "linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #eab308 100%)",
          padding: "32px 40px",
          boxShadow: "0 10px 40px rgba(245, 158, 11, 0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
            fontSize: "48px",
            opacity: 0.2,
          }}
        >
          💰
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "60px",
            fontSize: "24px",
            opacity: 0.15,
          }}
        >
          📈
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                color: "#d97706",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              04
            </span>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              Scalable Income Blueprint
            </h2>
          </div>
          <p
            style={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "8px",
              opacity: 0.95,
            }}
          >
            Explore proven side-income paths aligned to your Wealth Code and current timing
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
              <span className="font-bold text-white">{"Timing"}</span>
              <span className="text-white/90">{`${seasonCue.title} · ${seasonCue.action} season`}</span>
            </span>
            {hasWealthCode ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm border border-white/30">
                <span className="font-bold text-white">{"Dominant code"}</span>
                <span className="text-white/90">{dominantCodeLabel}</span>
              </span>
            ) : null}
          </div>
        </div>
      </div>

      {hasWealthCode ? (
        <>
          {/* CHART 1 (Hero): Side Income Priority Matrix */}
          <div className="rounded-2xl shadow-lg overflow-hidden border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
            {/* Desktop table */}
            <div className="hidden lg:block">
              <div className="overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-900/20">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300">
                        {"Idea"}
                      </th>
                      {["Alignment", "Capital", "Effort", "Potential"].map((h) => (
                        <th
                          key={h}
                          className="px-4 py-3 text-left text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300"
                        >
                          {h}
                        </th>
                      ))}
                      <th className="px-4 py-3 text-right text-xs font-bold tracking-wider text-gray-600 dark:text-gray-300">
                        {"Score"}
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                    {scoredIdeas.map((row) => {
                      let cta: string | null = null;
                      if (row.isTopPick) cta = "START HERE";
                      else if (row.isRunnerUp) cta = "NEXT";
                      else if (row.isThirdPick) cta = "TOP 3";

                      const isStar = row.isTopPick || row.isRunnerUp || row.isThirdPick;
                      const starLabel = row.isTopPick ? "🌟🌟🌟" : row.isRunnerUp ? "⭐⭐" : row.isThirdPick ? "⭐" : null;

                      let rowClassName = "hover:bg-gray-50 dark:hover:bg-gray-900/10";
                      if (row.isTopPick) {
                        rowClassName = "bg-amber-50/60 dark:bg-amber-900/15";
                      } else if (row.isRunnerUp) {
                        rowClassName = "bg-amber-50/30 dark:bg-amber-900/10";
                      }

                      return (
                        <tr key={row.idea.id} className={["transition-colors", rowClassName].join(" ")}>
                          <td className="px-5 py-4">
                            <div className="flex items-start gap-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                                    {row.idea.title}
                                  </div>
                                  {isStar ? <div className="text-base">{starLabel}</div> : null}
                                  {cta ? (
                                    <span className="ml-1 inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold tracking-wider bg-amber-600 dark:bg-amber-500 text-white hover:scale-105 transition-transform dark:shadow-amber-500/50 dark:shadow-lg">
                                      {cta}
                                    </span>
                                  ) : null}
                                </div>
                                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{row.idea.oneLine}</div>
                                <div className="text-xs text-gray-800 dark:text-gray-200 mt-2 leading-relaxed">
                                  {row.idea.details}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4">
                            <ScoreBar label="Alignment" value0To10={row.scores.alignment} showLabel />
                          </td>
                          <td className="px-4 py-4">
                            <ScoreBar label="Capital" value0To10={row.scores.capital} showLabel />
                          </td>
                          <td className="px-4 py-4">
                            <ScoreBar label="Effort" value0To10={row.scores.effort} showLabel />
                          </td>
                          <td className="px-4 py-4">
                            <ScoreBar label="Potential" value0To10={row.scores.potential} showLabel />
                          </td>

                          <td className="px-4 py-4 text-right">
                            <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                              {formatScore(row.weightedTotal)}
                            </div>
                            <div className="text-[11px] font-semibold text-gray-600 dark:text-gray-400">
                              {"weighted"}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Mobile cards */}
            <div className="lg:hidden space-y-4">
              {scoredIdeas.map((row) => {
                        let cta: string | null = null;
                        if (row.isTopPick) cta = "START HERE";
                        else if (row.isRunnerUp) cta = "NEXT";
                        else if (row.isThirdPick) cta = "TOP 3";

                        const isStar = row.isTopPick || row.isRunnerUp || row.isThirdPick;
                        const starLabel = row.isTopPick ? "🌟🌟🌟" : row.isRunnerUp ? "⭐⭐" : row.isThirdPick ? "⭐" : null;

                let cardClassName = "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800";
                if (row.isTopPick) {
                  cardClassName = "border-amber-300 dark:border-amber-700 bg-amber-50/60 dark:bg-amber-900/15";
                } else if (row.isRunnerUp) {
                  cardClassName = "border-amber-200 dark:border-amber-800 bg-amber-50/30 dark:bg-amber-900/10";
                }

                return (
                  <div key={row.idea.id} className={["rounded-2xl border p-5", cardClassName].join(" ")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-sm font-extrabold text-gray-900 dark:text-white">{row.idea.title}</div>
                          {isStar ? <span className="text-base">{starLabel}</span> : null}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{row.idea.oneLine}</div>
                      </div>

                      {cta ? (
                        <span className="inline-flex items-center justify-center rounded-full px-2 py-1 text-[10px] font-bold tracking-wider bg-amber-600 dark:bg-amber-500 text-white shrink-0 hover:scale-105 transition-transform dark:shadow-amber-500/50 dark:shadow-lg">
                          {cta}
                        </span>
                      ) : null}
                    </div>

                    <div className="mt-3 text-sm text-gray-800 dark:text-gray-100 leading-relaxed">{row.idea.details}</div>

                    <div className="mt-4 space-y-3">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{"Alignment"}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{formatScore(row.scores.alignment)}</span>
                        </div>
                        <ScoreBar label="Alignment" value0To10={row.scores.alignment} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{"Capital"}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{formatScore(row.scores.capital)}</span>
                        </div>
                        <ScoreBar label="Capital" value0To10={row.scores.capital} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{"Effort"}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{formatScore(row.scores.effort)}</span>
                        </div>
                        <ScoreBar label="Effort" value0To10={row.scores.effort} />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{"Potential"}</span>
                          <span className="text-xs font-bold text-gray-900 dark:text-white">{formatScore(row.scores.potential)}</span>
                        </div>
                        <ScoreBar label="Potential" value0To10={row.scores.potential} />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">{"Weighted score"}</div>
                      <div className="text-xl font-extrabold text-gray-900 dark:text-white">{formatScore(row.weightedTotal)}</div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </>
      ) : (
        <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 text-center">
          <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">
            {"We couldn’t detect a Wealth Code yet"}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {
              "This section needs Wealth Code recognition from your Wealth Palace stars. Once those are detected, you’ll see your aligned side income priorities and the full Wealth Code pathway map."
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomeBlueprint;


