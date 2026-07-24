/**
 * Shared signal hierarchy for Monthly Consultation activations and decisions.
 *
 * Urgency policy (Lu Quan Ke Ji):
 * 1. Ji first when present (repair / name friction).
 * 2. Else Quan when season is Consolidation / Foundation (decide / date it).
 * 3. Else Ke when Visibility (proof / show).
 * 4. Lu supports openings after repair or decide when clash exists;
 *    never outranks Ji in a Consolidation + Ji month.
 * 5. Timing Sync clash / partial also blocks brand-new launches.
 */

import type { LiuMonthSeason } from "../timing/liuMonthGuidance";
import { SI_HUA_LABEL } from "./englishLabels";
import type { ConvergenceResult, SiHuaKind, StemSiHuaActivation } from "./types";

/** How hard this month supports brand-new expansion. */
export type ExpansionBias = "press" | "prepare" | "wait";

/** Inputs for ranking stem activations and resolving the month action stance. */
export interface ResolveExpansionStanceArgs {
  season: LiuMonthSeason;
  activations: StemSiHuaActivation[];
  /** Briefing priority line (month spine). */
  priority?: string;
  /** Cover month-contract primary move when available. */
  primaryMove?: string;
  /**
   * Timing Sync band. Clash and partial both withhold brand-new launch permission
   * so Weeks / Decisions cannot contradict Sync tips.
   */
  convergenceBand?: ConvergenceResult["band"];
}

/**
 * Shared stance used by activation ordering, decisions, weeks, and aspect playbooks.
 * Also referred to as the month's action stance.
 */
export interface ExpansionStance {
  allowNewLaunch: boolean;
  expansionBias: ExpansionBias;
  ranked: StemSiHuaActivation[];
  topKind: SiHuaKind | null;
  /** True when 化忌 is present (Ji). */
  hasChallenge: boolean;
  /** True when 化禄 is present (Lu). */
  hasProsperity: boolean;
  /** True when 化权 is present (Quan). */
  hasPower: boolean;
  /** True when 化科 is present (Ke). */
  hasRecognition: boolean;
  isRepairSeason: boolean;
  /** Short English phrase for chart-reason lines. */
  hierarchyPhrase: string;
  /** One line explaining launch permission for UI / why fields. */
  stanceReason: string;
}

/** Alias used by bundle wiring docs and call sites. */
export type MonthlyActionStance = ExpansionStance;

/**
 * Kind order by season. Lower index = higher urgency.
 * Ji is always earliest when present; Lu never leads a repair season.
 */
const kindOrderForSeason = (season: LiuMonthSeason): SiHuaKind[] => {
  if (season === "Consolidation" || season === "Foundation") {
    return ["化忌", "化权", "化科", "化禄"];
  }
  if (season === "Visibility") {
    return ["化忌", "化科", "化权", "化禄"];
  }
  // Expansion: openings can lead once Ji is handled.
  return ["化忌", "化禄", "化权", "化科"];
};

/**
 * Sort stem activations by urgency for the given season.
 * Stable for equal kinds by original index.
 */
export const rankStemActivations = (
  activations: StemSiHuaActivation[],
  season: LiuMonthSeason
): StemSiHuaActivation[] => {
  const order = kindOrderForSeason(season);
  const indexed = activations.map((activation, index) => ({ activation, index }));
  indexed.sort((left, right) => {
    const leftRank = order.indexOf(left.activation.kind);
    const rightRank = order.indexOf(right.activation.kind);
    const leftScore = leftRank === -1 ? order.length : leftRank;
    const rightScore = rightRank === -1 ? order.length : rightRank;
    if (leftScore !== rightScore) {
      return leftScore - rightScore;
    }
    return left.index - right.index;
  });
  return indexed.map((entry) => entry.activation);
};

/**
 * Shared primary activation for Theme, Letter, Aspects, and rarity framing.
 * Always the first entry of a season-ranked list (Ji-first when present).
 */
export const getPrimaryActivation = (
  rankedOrRaw: StemSiHuaActivation[],
  season?: LiuMonthSeason
): StemSiHuaActivation | undefined => {
  if (season === undefined) {
    return rankedOrRaw[0];
  }
  return rankStemActivations(rankedOrRaw, season)[0];
};

/**
 * Build a short hierarchy phrase for decision chart-reason lines.
 */
const buildHierarchyPhrase = (
  ranked: StemSiHuaActivation[],
  isRepairSeason: boolean,
  hasChallenge: boolean
): string => {
  const top = ranked[0];
  const topLabel = top !== undefined ? SI_HUA_LABEL[top.kind] : "Month focus";
  if (isRepairSeason && hasChallenge) {
    return "Clarify-first hierarchy: Ji before Lu";
  }
  if (isRepairSeason) {
    return `Clarify-first hierarchy: ${topLabel} leads`;
  }
  if (hasChallenge) {
    return "Repair first: Ji outranks launches";
  }
  return `${topLabel} leads this month`;
};

/**
 * One-line reason for why launches are allowed or withheld.
 */
const buildStanceReason = (
  allowNewLaunch: boolean,
  expansionBias: ExpansionBias,
  hasChallenge: boolean,
  isRepairSeason: boolean,
  convergenceBand: ConvergenceResult["band"] | undefined
): string => {
  if (hasChallenge) {
    return "Ji is active: repair and name friction before new launches.";
  }
  if (isRepairSeason) {
    return "Protecting or rebuild season: clarify and secure before expanding.";
  }
  if (convergenceBand === "clash") {
    return "Timing Sync is at odds: protect and cleanup outrank new bets.";
  }
  if (convergenceBand === "partial") {
    return "Timing Sync is mixed: finish one repair before opening new doors.";
  }
  if (allowNewLaunch && expansionBias === "press") {
    return "Season and Sync support a ready, scoped launch.";
  }
  if (allowNewLaunch) {
    return "Launches are allowed after one proof checkpoint.";
  }
  return "Prepare quietly; hold public launches for cleaner timing.";
};

/**
 * Resolve expansion stance and ranked activations from season + Si Hua + Sync.
 * Lu never overrides a wait-on-launches rule from Ji, repair seasons, or Sync clash/partial.
 */
export const resolveExpansionStance = (
  args: ResolveExpansionStanceArgs
): ExpansionStance => {
  const { season, activations, convergenceBand } = args;
  const hasChallenge = activations.some((a) => a.kind === "化忌");
  const hasProsperity = activations.some((a) => a.kind === "化禄");
  const hasPower = activations.some((a) => a.kind === "化权");
  const hasRecognition = activations.some((a) => a.kind === "化科");
  const isRepairSeason = season === "Consolidation" || season === "Foundation";
  const expandClimate = season === "Expansion" || season === "Visibility";
  const syncBlocksLaunch =
    convergenceBand === "clash" || convergenceBand === "partial";

  const ranked = rankStemActivations(activations, season);
  const topKind = ranked[0] !== undefined ? ranked[0].kind : null;

  const allowNewLaunch =
    expandClimate && !hasChallenge && !isRepairSeason && !syncBlocksLaunch;

  let expansionBias: ExpansionBias;
  if (!allowNewLaunch) {
    expansionBias =
      isRepairSeason || hasChallenge || syncBlocksLaunch ? "wait" : "prepare";
  } else if (hasProsperity || season === "Expansion") {
    expansionBias = "press";
  } else {
    expansionBias = "prepare";
  }

  return {
    allowNewLaunch,
    expansionBias,
    ranked,
    topKind,
    hasChallenge,
    hasProsperity,
    hasPower,
    hasRecognition,
    isRepairSeason,
    hierarchyPhrase: buildHierarchyPhrase(
      ranked,
      isRepairSeason,
      hasChallenge
    ),
    stanceReason: buildStanceReason(
      allowNewLaunch,
      expansionBias,
      hasChallenge,
      isRepairSeason,
      convergenceBand
    ),
  };
};

/**
 * Resolve the month's action stance (alias entry for call sites).
 */
export const resolveMonthlyActionStance = (
  args: ResolveExpansionStanceArgs
): MonthlyActionStance => resolveExpansionStance(args);

/**
 * Urgency label shown on activation cards (signals support the month contract).
 */
export const urgencyLabelForRank = (rank: number): string => {
  if (rank === 1) {
    return "1 · Lead signal";
  }
  return `${String(rank)} · Support`;
};
