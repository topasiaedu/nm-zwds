/**
 * Domain configuration and English labels for annual report scoring.
 */

import type { ReportDomainKey } from "./types";

export interface DomainConfig {
  key: ReportDomainKey;
  label: string;
  palaceName: string;
  englishName: string;
}

/** Eight domain rows for the annual matrix and monthly ratings. */
export const REPORT_DOMAINS: readonly DomainConfig[] = [
  { key: "career", label: "Career", palaceName: "官禄", englishName: "Career Palace" },
  { key: "wealth", label: "Wealth", palaceName: "财帛", englishName: "Wealth Palace" },
  { key: "love", label: "Love", palaceName: "夫妻", englishName: "Spouse Palace" },
  { key: "health", label: "Health", palaceName: "疾厄", englishName: "Health Palace" },
  { key: "family", label: "Family", palaceName: "田宅", englishName: "Property Palace" },
  { key: "network", label: "Network", palaceName: "交友", englishName: "Friends Palace" },
  { key: "inner", label: "Inner", palaceName: "福德", englishName: "Wellbeing Palace" },
  { key: "external", label: "External", palaceName: "迁移", englishName: "Travel Palace" },
] as const;

/** English display names for all palaces. */
export const PALACE_ENGLISH: Record<string, string> = {
  "命宫": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "财帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "迁移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Wellbeing Palace",
  "父母": "Parents Palace",
};

/**
 * Get English name for a Chinese palace name.
 */
export function getPalaceEnglish(palaceName: string): string {
  return PALACE_ENGLISH[palaceName] ?? palaceName;
}

/** Plain life area labels for readers new to ZWDS (no palace jargon). */
const PLAIN_LIFE_AREA: Record<string, string> = {
  "命宫": "Your personal growth",
  "兄弟": "Siblings and close peers",
  "夫妻": "Love and partnerships",
  "子女": "Children and creative projects",
  "财帛": "Money and resources",
  "疾厄": "Health and recovery",
  "迁移": "Travel and life changes",
  "交友": "Friends and your network",
  "官禄": "Career and work",
  "田宅": "Home and family",
  "福德": "Inner wellbeing",
  "父母": "Family mentors and support",
};

/**
 * User friendly life area name (no "Palace", no Chinese).
 */
export function getPlainLifeAreaName(palaceName: string): string {
  return PLAIN_LIFE_AREA[palaceName] ?? getPalaceEnglish(palaceName).replace(" Palace", "");
}
