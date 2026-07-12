/**
 * Safe content lookups for Alignment Advantage UI.
 * Centralises key normalisation and fallbacks so partial content coverage never silently fails.
 */

import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";
import type { FormationKey, SpecialFormationKey } from "../../../utils/zwds/analysis/structureAnalysis";
import {
  WEALTH_TYPE,
  STOP_DOING,
  FOCUS_ON,
  ACTION_PLAN_ITEMS,
  IDEAL_COLLABORATOR,
  FRAMEWORK_RECOMMENDATIONS,
  PHASE_ALIGNMENT_MATRIX,
  ALTERNATIVE_PATH,
  type PhaseAlignmentSeasonKey,
  type PhaseAlignmentWealthKey,
  type PhaseAlignmentEntry,
  type WealthTypeProfile,
  type FrameworkRecommendation,
  type CollaboratorProfile,
} from "../../../utils/forecast/wealthContentData";
import {
  STRUCTURE_LABELS,
  FORMATION_PROFILES,
  type StructureLabel,
  type FormationProfile,
} from "../../../utils/forecast/structureContentData";
import { STAR_BRIEF, type StarBrief } from "../../../utils/forecast/starBriefDescriptions";

const DEFAULT_WEALTH_KEY: WealthCodeKey = "investmentBrain";

/** DaYun season → phase alignment matrix key. */
const DAYUN_TO_PHASE: Record<string, PhaseAlignmentSeasonKey> = {
  spring: "expansion",
  summer: "visibility",
  autumn: "consolidation",
  winter: "foundation",
  expansion: "expansion",
  visibility: "visibility",
  consolidation: "consolidation",
  foundation: "foundation",
};

/** Phase key → display colour for season reference tiles. */
export const PHASE_ACCENT_COLORS: Record<PhaseAlignmentSeasonKey, string> = {
  expansion: "#16a34a",
  visibility: "#d97706",
  consolidation: "#ea580c",
  foundation: "#2563eb",
};

/** DaYun season → banner colours for print/web. */
export const DAYUN_SEASON_COLORS: Record<string, { bg: string; accent: string; text: string }> = {
  spring: { bg: "#f0fdf4", accent: "#16a34a", text: "#166534" },
  summer: { bg: "#fffbeb", accent: "#d97706", text: "#92400e" },
  autumn: { bg: "#fff7ed", accent: "#ea580c", text: "#9a3412" },
  winter: { bg: "#eff6ff", accent: "#2563eb", text: "#1e3a8a" },
};

/** Star name aliases (simplified ↔ traditional). */
const STAR_NAME_ALIASES: Record<string, string> = {
  "左辅": "左輔",
  "右弼": "右弼",
  "天魁": "天魁",
  "天钺": "天鉞",
};

export function resolveWealthKey(key: string | undefined): WealthCodeKey {
  const valid: WealthCodeKey[] = ["investmentBrain", "brandingMagnet", "strategyPlanner", "collaborator"];
  if (key !== undefined && valid.includes(key as WealthCodeKey)) {
    return key as WealthCodeKey;
  }
  return DEFAULT_WEALTH_KEY;
}

export function dayunSeasonToPhaseKey(season: string | null | undefined): PhaseAlignmentSeasonKey {
  if (season === null || season === undefined || season === "") return "expansion";
  return DAYUN_TO_PHASE[season] ?? "expansion";
}

export function getWealthTypeProfile(wealthKey: WealthCodeKey): WealthTypeProfile {
  return WEALTH_TYPE[wealthKey] ?? WEALTH_TYPE[DEFAULT_WEALTH_KEY];
}

export function getStopDoingItems(wealthKey: WealthCodeKey): [string, string, string] {
  return STOP_DOING[wealthKey] ?? STOP_DOING[DEFAULT_WEALTH_KEY];
}

export function getFocusOnItems(wealthKey: WealthCodeKey): [string, string, string] {
  return FOCUS_ON[wealthKey] ?? FOCUS_ON[DEFAULT_WEALTH_KEY];
}

export function getActionPlanItem(wealthKey: WealthCodeKey): string {
  return ACTION_PLAN_ITEMS[wealthKey] ?? ACTION_PLAN_ITEMS[DEFAULT_WEALTH_KEY];
}

export function getIdealCollaborator(wealthKey: WealthCodeKey): CollaboratorProfile {
  return IDEAL_COLLABORATOR[wealthKey] ?? IDEAL_COLLABORATOR[DEFAULT_WEALTH_KEY];
}

export function getFrameworkRecommendation(score: number): FrameworkRecommendation {
  const clamped = Math.max(0, Math.min(3, score));
  return FRAMEWORK_RECOMMENDATIONS[clamped] ?? FRAMEWORK_RECOMMENDATIONS[0];
}

export function getPhaseAlignmentEntry(
  seasonOrPhase: string | null | undefined,
  wealthKey: WealthCodeKey
): PhaseAlignmentEntry | null {
  const phaseKey = dayunSeasonToPhaseKey(seasonOrPhase);
  const wk = wealthKey as PhaseAlignmentWealthKey;
  return PHASE_ALIGNMENT_MATRIX[phaseKey]?.[wk] ?? null;
}

export function getAlternativePath(seasonOrPhase: string | null | undefined): string {
  const phaseKey = dayunSeasonToPhaseKey(seasonOrPhase);
  return ALTERNATIVE_PATH[phaseKey] ?? ALTERNATIVE_PATH[seasonOrPhase ?? "winter"] ?? ALTERNATIVE_PATH.winter;
}

export function getStructureLabel(structureType: "speed" | "endurance"): StructureLabel {
  return STRUCTURE_LABELS[structureType];
}

export function getFormationProfile(
  formation: FormationKey | SpecialFormationKey
): FormationProfile {
  return FORMATION_PROFILES[formation];
}

export function getStarBrief(starName: string): StarBrief | null {
  const direct = STAR_BRIEF[starName];
  if (direct !== undefined) return direct;
  const alias = STAR_NAME_ALIASES[starName];
  if (alias !== undefined && STAR_BRIEF[alias] !== undefined) {
    return STAR_BRIEF[alias];
  }
  return null;
}

export type { PhaseAlignmentSeasonKey, PhaseAlignmentWealthKey, PhaseAlignmentEntry };
