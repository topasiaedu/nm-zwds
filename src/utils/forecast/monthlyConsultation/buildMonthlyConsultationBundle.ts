/**
 * Compose the full Monthly Consultation report bundle for one lunar month.
 */

import type { ChartData } from "../../zwds/types";
import type { Profile } from "../../../context/ProfileContext";
import {
  getPalaceForAspectLiuMonth,
} from "../../destiny-navigator/palace-resolver";
import { getEnglishPalaceName } from "../../dayun/seasonMapper";
import { calculateNoblemanForPalace } from "../../nobleman/calculator";
import {
  PALACE_MONTH_DATA,
  PALACE_GUIDANCE_DATA,
  type LiuMonthSeason,
} from "../timing/liuMonthGuidance";
import { buildConvergenceScore } from "./convergence";
import { buildRarityFingerprint } from "./rarity";
import {
  getPrimaryActivation,
  rankStemActivations,
  resolveMonthlyActionStance,
} from "./signalPriority";
import {
  resolveFocusStarsWithOppositeBorrow,
  resolveLiuYueStemSiHua,
  resolveMonthlyTimingStack,
  snapshotPalaceStars,
} from "./timingStack";
import {
  buildArchetype,
  buildAspectPlaybook,
  buildActivationCards,
  buildCautionList,
  buildDecisions,
  buildDimensionMechanism,
  buildFailureMode,
  buildMonthContract,
  buildMonthScripts,
  buildPersonalLetter,
  buildPrimaryGoal,
  buildScorecardProtectPress,
  buildSomatic,
  buildStarSpotlight,
  buildWeekPlan,
  buildWeekWindows,
  type NextMonthFocus,
} from "./contentLibraries";
import {
  liuSeasonShort,
} from "./englishLabels";
import type {
  DimensionScorecard,
  MonthlyBriefingContent,
  MonthlyConsultationBundle,
  MonthlyStarSnapshot,
  PriorMonthBriefing,
  StemSiHuaActivation,
  YearClimateRow,
} from "./types";

const MONTH_NAMES = [
  "Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6",
  "Month 7", "Month 8", "Month 9", "Month 10", "Month 11", "Month 12",
] as const;

const EMPTY_GUIDANCE = {
  keyActions: ["Focus on this month's activated palace theme."],
  watchOut: ["Avoid ignoring the primary timing signal."],
  successMetrics: ["Complete the primary goal for this month."],
  reflectionQuestions: ["What is this month asking me to face?"],
};

/**
 * Compare two percentages for trend direction.
 */
const trendOf = (from: number, to: number): "up" | "down" | "flat" => {
  if (to - from >= 5) {
    return "up";
  }
  if (from - to >= 5) {
    return "down";
  }
  return "flat";
};

/**
 * Load static briefing content for a natal palace name.
 * `primaryGoal` is filled after `buildMonthContract` so both share the same move.
 */
const loadBriefing = (palaceName: string): MonthlyBriefingContent => {
  const meta = PALACE_MONTH_DATA[palaceName];
  const guidance = PALACE_GUIDANCE_DATA[palaceName] ?? EMPTY_GUIDANCE;
  const season: LiuMonthSeason = meta?.season ?? "Foundation";
  const dimensionBars = meta?.dimensionBars ?? PALACE_MONTH_DATA["命宫"].dimensionBars;
  const priority = meta?.priority ?? "Align with this month's palace";
  return {
    season,
    area: meta?.area ?? "Self",
    priority,
    dimensionBars,
    guidance,
    primaryGoal: "",
  };
};

/**
 * Resolve prior lunar month with year rollover.
 */
export const resolvePriorMonthAnchor = (
  lunarMonth: number,
  solarYear: number
): { lunarMonth: number; solarYear: number } => {
  if (lunarMonth <= 1) {
    return { lunarMonth: 12, solarYear: solarYear - 1 };
  }
  return { lunarMonth: lunarMonth - 1, solarYear };
};

/**
 * Resolve next lunar month with year rollover (Dec → Jan next solar year).
 */
export const resolveNextMonthAnchor = (
  lunarMonth: number,
  solarYear: number
): { lunarMonth: number; solarYear: number } => {
  if (lunarMonth >= 12) {
    return { lunarMonth: 1, solarYear: solarYear + 1 };
  }
  return { lunarMonth: lunarMonth + 1, solarYear };
};

/**
 * Resolve next month Life palace focus for the Close bridge.
 * Prefers `yearClimate` when the next month is in the same solar year;
 * otherwise resolves from chart (month 12 rollover).
 */
const resolveNextMonthFocus = (
  chartData: ChartData,
  lunarMonth: number,
  solarYear: number,
  yearClimate: YearClimateRow[]
): NextMonthFocus | null => {
  const next = resolveNextMonthAnchor(lunarMonth, solarYear);
  if (next.solarYear === solarYear) {
    const row = yearClimate.find((entry) => entry.lunarMonth === next.lunarMonth);
    if (row !== undefined) {
      return {
        lunarMonth: next.lunarMonth,
        solarYear: next.solarYear,
        palaceNameEnglish: row.palaceNameEnglish,
        season: row.season,
        priority: row.priority,
      };
    }
  }
  const lifeNum = getPalaceForAspectLiuMonth(
    "life",
    chartData,
    next.lunarMonth,
    next.solarYear
  );
  if (lifeNum === null) {
    return null;
  }
  const palace = chartData.palaces[lifeNum - 1];
  if (palace === undefined) {
    return null;
  }
  const meta = PALACE_MONTH_DATA[palace.name];
  return {
    lunarMonth: next.lunarMonth,
    solarYear: next.solarYear,
    palaceNameEnglish: getEnglishPalaceName(palace.name),
    season: meta?.season ?? "Foundation",
    priority: meta?.priority ?? "Align",
  };
};

/**
 * Build scorecard with prior/next month dimension comparison and distinct drivers.
 */
const buildScorecard = (
  chartData: ChartData,
  lunarMonth: number,
  solarYear: number,
  currentBars: MonthlyBriefingContent["dimensionBars"],
  aspectPalaces: {
    career: MonthlyStarSnapshot | null;
    wealth: MonthlyStarSnapshot | null;
    relationships: MonthlyStarSnapshot | null;
    health: MonthlyStarSnapshot | null;
  },
  stemActivations: StemSiHuaActivation[],
  season: MonthlyBriefingContent["season"],
  focusPalaceEnglish: string
): DimensionScorecard[] => {
  const prior = resolvePriorMonthAnchor(lunarMonth, solarYear);
  const nextMonth = lunarMonth === 12
    ? { lunarMonth: 1, solarYear: solarYear + 1 }
    : { lunarMonth: lunarMonth + 1, solarYear };

  const priorLife = getPalaceForAspectLiuMonth(
    "life", chartData, prior.lunarMonth, prior.solarYear
  );
  const nextLife = getPalaceForAspectLiuMonth(
    "life", chartData, nextMonth.lunarMonth, nextMonth.solarYear
  );
  const priorName =
    priorLife !== null ? chartData.palaces[priorLife - 1]?.name : undefined;
  const nextName =
    nextLife !== null ? chartData.palaces[nextLife - 1]?.name : undefined;
  const priorBars = priorName !== undefined
    ? (PALACE_MONTH_DATA[priorName]?.dimensionBars ?? currentBars)
    : currentBars;
  const nextBars = nextName !== undefined
    ? (PALACE_MONTH_DATA[nextName]?.dimensionBars ?? currentBars)
    : currentBars;

  return currentBars.map((bar, idx) => {
    const priorPct = priorBars[idx]?.pct ?? bar.pct;
    const nextPct = nextBars[idx]?.pct ?? bar.pct;
    const label = bar.label;
    const snap =
      label === "Career"
        ? aspectPalaces.career
        : label === "Wealth"
          ? aspectPalaces.wealth
          : label === "Relationships"
            ? aspectPalaces.relationships
            : aspectPalaces.health;
    const dimensionLabel =
      label === "Career" ||
      label === "Wealth" ||
      label === "Relationships" ||
      label === "Health"
        ? label
        : "Health";
    return {
      label,
      pct: bar.pct,
      priorPct,
      nextPct,
      trendVsPrior: trendOf(priorPct, bar.pct),
      trendIntoNext: trendOf(bar.pct, nextPct),
      mechanism: buildDimensionMechanism(
        dimensionLabel,
        snap,
        stemActivations,
        season,
        focusPalaceEnglish
      ),
    };
  });
};

/**
 * Build 12-month climate rows for the solar year of the report.
 */
const buildYearClimate = (
  chartData: ChartData,
  solarYear: number,
  currentLunarMonth: number
): YearClimateRow[] => {
  const rows: YearClimateRow[] = [];
  for (let m = 1; m <= 12; m += 1) {
    const lifeNum = getPalaceForAspectLiuMonth("life", chartData, m, solarYear);
    if (lifeNum === null) {
      continue;
    }
    const palace = chartData.palaces[lifeNum - 1];
    if (palace === undefined) {
      continue;
    }
    const meta = PALACE_MONTH_DATA[palace.name];
    rows.push({
      lunarMonth: m,
      palaceNameEnglish: getEnglishPalaceName(palace.name),
      season: meta?.season ?? "Foundation",
      priority: meta?.priority ?? "Align",
      isCurrent: m === currentLunarMonth,
    });
  }
  return rows;
};

interface BundleCoreOptions {
  /** When false, skip life-span rarity scan (used for prior-month Track Record). */
  includeRarity: boolean;
}

/**
 * Pure builder for one month's full consultation bundle (no prior-month recursion).
 */
const buildBundleCore = (
  profileName: string,
  chartData: ChartData,
  lunarMonth: number,
  solarYear: number,
  options: BundleCoreOptions
): MonthlyConsultationBundle | null => {
  const stack = resolveMonthlyTimingStack(chartData, lunarMonth, solarYear);
  if (stack === null) {
    return null;
  }

  const stemActivations = resolveLiuYueStemSiHua(chartData, stack);
  const lifePalaceStars = snapshotPalaceStars(chartData, stack.liuYueLifePalaceNumber);
  if (lifePalaceStars === null) {
    return null;
  }
  const focusStarSource = resolveFocusStarsWithOppositeBorrow(chartData, lifePalaceStars);

  const careerNum = getPalaceForAspectLiuMonth("career", chartData, lunarMonth, solarYear);
  const wealthNum = getPalaceForAspectLiuMonth("wealth", chartData, lunarMonth, solarYear);
  const relNum = getPalaceForAspectLiuMonth(
    "relationships", chartData, lunarMonth, solarYear
  );
  const healthNum = getPalaceForAspectLiuMonth("health", chartData, lunarMonth, solarYear);

  const briefingBase = loadBriefing(stack.liuYueLifePalaceName);
  const failureMode = buildFailureMode(
    stack.liuYueLifePalaceName,
    stack.liuYueLifePalaceNameEnglish,
    stemActivations,
    briefingBase.season
  );
  const rankedActivations = rankStemActivations(stemActivations, briefingBase.season);
  const topActivation = getPrimaryActivation(rankedActivations);
  const monthContract = buildMonthContract({
    priority: briefingBase.priority,
    exitMove: failureMode.exitMove,
    season: briefingBase.season,
    successMetrics: briefingBase.guidance.successMetrics,
    watchOut: briefingBase.guidance.watchOut,
    failureModeName: failureMode.name,
    howItShows: failureMode.howItShows,
    topActivation,
  });
  const briefing: MonthlyBriefingContent = {
    ...briefingBase,
    primaryGoal: buildPrimaryGoal(briefingBase.priority, monthContract.primaryMove),
  };
  const archetype = buildArchetype(
    stack.liuYueLifePalaceName,
    stack.liuYueLifePalaceNameEnglish,
    briefing.season,
    stemActivations
  );
  const convergence = buildConvergenceScore(stack);
  const actionStance = resolveMonthlyActionStance({
    season: briefing.season,
    activations: stemActivations,
    priority: briefing.priority,
    primaryMove: monthContract.primaryMove,
    convergenceBand: convergence.band,
  });
  const rarity = options.includeRarity
    ? buildRarityFingerprint(chartData, stack, stemActivations)
    : {
      fingerprintKey: "skipped",
      stackSummary: [],
      priorOccurrences: [],
      priorCount: 0,
      narrative: "",
      whatItMeans: "",
      whyNotGeneric: "",
      usualAsk: "",
      usualAskLines: [],
      actionSteps: [],
      historyCoach: "",
      historyTips: [],
    };

  const weekWindows = buildWeekWindows(
    briefing.season,
    briefing.priority,
    actionStance
  );
  const somatic = buildSomatic(stack.liuYueLifePalaceName);

  const monthLabel = [
    MONTH_NAMES[lunarMonth - 1] ?? `Month ${String(lunarMonth)}`,
    String(solarYear),
  ].join(", ");

  const headline = [
    stack.liuYueLifePalaceNameEnglish,
    liuSeasonShort(briefing.season),
  ].join(", ");

  const careerSnap =
    careerNum !== null ? snapshotPalaceStars(chartData, careerNum) : null;
  const wealthSnap =
    wealthNum !== null ? snapshotPalaceStars(chartData, wealthNum) : null;
  const relSnap =
    relNum !== null ? snapshotPalaceStars(chartData, relNum) : null;
  const healthSnap =
    healthNum !== null ? snapshotPalaceStars(chartData, healthNum) : null;

  const aspectPalaces = {
    career: careerSnap,
    wealth: wealthSnap,
    relationships: relSnap,
    health: healthSnap,
  };

  const activationCards = buildActivationCards({
    activations: stemActivations,
    season: briefing.season,
    priority: briefing.priority,
    primaryMove: monthContract.primaryMove,
    convergenceBand: convergence.band,
  });
  const scorecard = buildScorecard(
    chartData,
    lunarMonth,
    solarYear,
    briefing.dimensionBars,
    aspectPalaces,
    stemActivations,
    briefing.season,
    stack.liuYueLifePalaceNameEnglish
  );
  const yearClimate = buildYearClimate(chartData, solarYear, lunarMonth);
  const nextFocus = resolveNextMonthFocus(
    chartData,
    lunarMonth,
    solarYear,
    yearClimate
  );

  return {
    profileName,
    solarYear,
    lunarMonth,
    monthLabel,
    headline,
    stack,
    lifePalaceStars,
    focusStarSource,
    aspectPalaces,
    aspectPlaybooks: {
      career: buildAspectPlaybook(
        "career",
        careerSnap,
        briefing.season,
        stemActivations,
        actionStance
      ),
      wealth: buildAspectPlaybook(
        "wealth",
        wealthSnap,
        briefing.season,
        stemActivations,
        actionStance
      ),
      relationships: buildAspectPlaybook(
        "relationships",
        relSnap,
        briefing.season,
        stemActivations,
        actionStance
      ),
    },
    stemActivations,
    activationCards,
    starSpotlight: buildStarSpotlight({
      mainStars: focusStarSource.displayMainStars,
      palaceNameEnglish: focusStarSource.focusPalaceNameEnglish,
      season: briefing.season,
      activationCards,
      borrowedFromPalaceNameEnglish: focusStarSource.borrowedFromPalaceNameEnglish,
    }),
    scripts: buildMonthScripts(
      stack.liuYueLifePalaceNameEnglish,
      failureMode.exitMove,
      briefing.priority
    ),
    cautionList: buildCautionList(
      stemActivations,
      stack.liuYueLifePalaceNameEnglish
    ),
    weekPlan: buildWeekPlan(weekWindows),
    convergence,
    rarity,
    briefing,
    monthContract,
    scorecard,
    scorecardProtectPress: buildScorecardProtectPress(
      scorecard,
      briefing.priority
    ),
    archetype,
    failureMode,
    decisions: buildDecisions({
      season: briefing.season,
      activations: stemActivations,
      palaceNameEnglish: stack.liuYueLifePalaceNameEnglish,
      priority: briefing.priority,
      primaryMove: monthContract.primaryMove,
      convergenceBand: convergence.band,
      stance: actionStance,
    }),
    somatic,
    letter: buildPersonalLetter({
      profileName,
      palaceName: stack.liuYueLifePalaceName,
      palaceNameEnglish: stack.liuYueLifePalaceNameEnglish,
      season: briefing.season,
      activations: stemActivations,
      monthContract,
      nextFocus,
      priorMonth: null,
    }),
    nobleman: calculateNoblemanForPalace(chartData, stack.liuYueLifePalaceName),
    priorMonth: null,
    yearClimate,
    weekWindows,
  };
};

/**
 * Build prior-month briefing slice for Track Record chapter.
 */
export const buildPriorMonthBriefing = (
  profileName: string,
  chartData: ChartData,
  lunarMonth: number,
  solarYear: number
): PriorMonthBriefing | null => {
  const prior = resolvePriorMonthAnchor(lunarMonth, solarYear);
  const priorBundle = buildBundleCore(
    profileName, chartData, prior.lunarMonth, prior.solarYear, { includeRarity: false }
  );
  if (priorBundle === null) {
    return null;
  }
  return {
    solarYear: prior.solarYear,
    lunarMonth: prior.lunarMonth,
    palaceNameEnglish: priorBundle.stack.liuYueLifePalaceNameEnglish,
    season: priorBundle.briefing.season,
    priority: priorBundle.briefing.priority,
    primaryGoal: priorBundle.briefing.primaryGoal,
    failureModeName: priorBundle.failureMode.name,
    bridgeNarrative: priorBundle.failureMode.exitMove,
  };
};

/**
 * Build the full Monthly Consultation bundle, including prior-month Track Record.
 * Rebuilds the Close letter once priorMonth exists so the bridge can reference it.
 */
export const buildMonthlyConsultationBundle = (
  profile: Profile,
  chartData: ChartData,
  lunarMonth: number,
  solarYear: number
): MonthlyConsultationBundle | null => {
  const core = buildBundleCore(
    profile.name, chartData, lunarMonth, solarYear, { includeRarity: true }
  );
  if (core === null) {
    return null;
  }
  const priorMonth = buildPriorMonthBriefing(
    profile.name, chartData, lunarMonth, solarYear
  );
  const nextFocus = resolveNextMonthFocus(
    chartData,
    lunarMonth,
    solarYear,
    core.yearClimate
  );
  return {
    ...core,
    priorMonth,
    letter: buildPersonalLetter({
      profileName: profile.name,
      palaceName: core.stack.liuYueLifePalaceName,
      palaceNameEnglish: core.stack.liuYueLifePalaceNameEnglish,
      season: core.briefing.season,
      activations: core.stemActivations,
      monthContract: core.monthContract,
      nextFocus,
      priorMonth,
    }),
  };
};
