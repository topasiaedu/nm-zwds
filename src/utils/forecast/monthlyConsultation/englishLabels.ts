/**
 * English-only display labels for Monthly Consultation (no Chinese characters in UI copy).
 */

import type { DayunSeason } from "../../../types/dayun";
import type { LiuMonthSeason } from "../timing/liuMonthGuidance";
import type { SiHuaKind } from "./types";
import { getEnglishStarName } from "../../zwds/decade_cycle_analysis/daming_utils";
import { getEnglishPalaceName } from "../../dayun/seasonMapper";

/**
 * User-facing names for the four activations (禄权科忌 / Lu Quan Ke Ji).
 * Matches `translations/en/zwds.ts` transformation labels.
 */
export const SI_HUA_LABEL: Record<SiHuaKind, string> = {
  "化禄": "Lu",
  "化权": "Quan",
  "化科": "Ke",
  "化忌": "Ji",
};

/** Short plain explanation of each activation. */
export const SI_HUA_PLAIN: Record<SiHuaKind, string> = {
  "化禄": "helps money, support, and ease flow more easily",
  "化权": "gives you more influence and control",
  "化科": "brings reputation, praise, and helpful attention",
  "化忌": "highlights friction you should handle carefully",
};

/**
 * Extra star name variants → English spelling (covers traditional forms).
 */
const EXTRA_STAR_EN: Record<string, string> = {
  "天機": "Tian Ji",
  "太陽": "Tai Yang",
  "廉貞": "Lian Zhen",
  "太陰": "Tai Yin",
  "貪狼": "Tan Lang",
  "巨門": "Ju Men",
  "七殺": "Qi Sha",
  "破軍": "Po Jun",
  "左輔": "Zuo Fu",
  "天廚": "Tian Chu",
  "鈴星": "Ling Xing",
};

/**
 * Star name for display. English romanization, never Chinese characters.
 */
export const starToEnglish = (starName: string): string => {
  const extra = EXTRA_STAR_EN[starName];
  if (extra !== undefined) {
    return extra;
  }
  const base = getEnglishStarName(starName);
  // If lookup failed and Chinese remains, fall back to a safe label.
  if (/[\u4e00-\u9fff]/.test(base)) {
    return "Key Star";
  }
  return base;
};

/**
 * Palace name for display. English only.
 */
export const palaceToEnglish = (palaceName: string): string => {
  const en = getEnglishPalaceName(palaceName);
  if (/[\u4e00-\u9fff]/.test(en)) {
    return "Life Area";
  }
  return en;
};

/**
 * Plain label for chart season (dayun spring/summer/autumn/winter).
 */
export const dayunSeasonPlain = (season: DayunSeason | null): string => {
  if (season === null) {
    return "Not available";
  }
  if (season === "spring") {
    return "Growing season";
  }
  if (season === "summer") {
    return "Harvest season";
  }
  if (season === "autumn") {
    return "Protecting season";
  }
  return "Rebuild season";
};

/**
 * Plain label for Liu Month briefing season.
 */
export const liuSeasonPlain = (season: LiuMonthSeason): string => {
  if (season === "Expansion") {
    return "Growing season (start and expand)";
  }
  if (season === "Visibility") {
    return "Harvest season (be seen and collect results)";
  }
  if (season === "Consolidation") {
    return "Protecting season (clarify and secure)";
  }
  return "Rebuild season (rest and prepare)";
};

/**
 * Short season name for compact UI.
 */
export const liuSeasonShort = (season: LiuMonthSeason): string => {
  if (season === "Expansion") {
    return "Growing";
  }
  if (season === "Visibility") {
    return "Harvest";
  }
  if (season === "Consolidation") {
    return "Protecting";
  }
  return "Rebuild";
};

/**
 * Compact activation line for the report (star, signal, life area).
 */
export const formatActivationPlain = (
  starName: string,
  kind: SiHuaKind,
  landingPalaceName: string
): string => {
  const star = starToEnglish(starName);
  const label = SI_HUA_LABEL[kind];
  const area = palaceToEnglish(landingPalaceName);
  return `${star}, ${label}, in ${area}`;
};

/**
 * Build an English-only fingerprint string for display (not for matching logic).
 */
export const fingerprintDisplayLabel = (
  daXianPalaceEnglish: string,
  monthPalaceEnglish: string,
  starName: string,
  kind: SiHuaKind,
  landingPalaceEnglish: string
): string => {
  return [
    `Decade: ${daXianPalaceEnglish}`,
    `Month focus: ${monthPalaceEnglish}`,
    `Main activation: ${starToEnglish(starName)} ${SI_HUA_LABEL[kind]} in ${landingPalaceEnglish}`,
  ].join(", ");
};
