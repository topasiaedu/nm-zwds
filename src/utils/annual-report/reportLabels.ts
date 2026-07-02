/**
 * English display labels for the annual report (no Chinese characters in reader-facing copy).
 */

import type { HeavenlyStemType, EarthlyBranchType } from "../zwds/types";
import { getEnglishStarName } from "../zwds/decade_cycle_analysis/daming_utils";
import type { TransformationKind } from "./types";

/** English labels for lunar months 1–12. */
export const LUNAR_MONTH_ENGLISH_LABELS: readonly string[] = [
  "1st Lunar Month",
  "2nd Lunar Month",
  "3rd Lunar Month",
  "4th Lunar Month",
  "5th Lunar Month",
  "6th Lunar Month",
  "7th Lunar Month",
  "8th Lunar Month",
  "9th Lunar Month",
  "10th Lunar Month",
  "11th Lunar Month",
  "12th Lunar Month",
] as const;

/** English labels for the four transformation shifts. */
const TRANSFORMATION_KIND_LABELS: Record<TransformationKind, string> = {
  "化祿": "Abundance",
  "化權": "Authority",
  "化科": "Recognition",
  "化忌": "Pressure",
};

/** English star names for report tables. */
const STAR_ENGLISH_LABELS: Record<string, string> = {
  "紫微": "Purple Star",
  "天机": "Heavenly Secret",
  "太阳": "Sun",
  "武曲": "Military Star",
  "天同": "Heavenly Unity",
  "廉贞": "Chastity Star",
  "天府": "Heavenly Treasury",
  "太阴": "Moon",
  "贪狼": "Greedy Wolf",
  "巨门": "Giant Gate",
  "天相": "Heavenly Minister",
  "天梁": "Heavenly Beam",
  "七杀": "Seven Killings",
  "破军": "Army Breaker",
  "文昌": "Literary Star",
  "文曲": "Literary Tune",
  "左辅": "Left Assistant",
  "右弼": "Right Assistant",
  "禄存": "Wealth Storage",
  "天马": "Heavenly Horse",
  "擎羊": "Ram Blade",
  "陀罗": "Spinning Top",
  "火星": "Mars Star",
  "铃星": "Bell Star",
  "地空": "Earth Void",
  "地劫": "Earth Robbery",
  "天魁": "Heavenly Leader",
  "天钺": "Heavenly Halberd",
};

const HEAVENLY_STEM_LABELS: Record<HeavenlyStemType, string> = {
  "甲": "Jia",
  "乙": "Yi",
  "丙": "Bing",
  "丁": "Ding",
  "戊": "Wu",
  "己": "Ji",
  "庚": "Geng",
  "辛": "Xin",
  "壬": "Ren",
  "癸": "Gui",
};

const EARTHLY_BRANCH_LABELS: Record<EarthlyBranchType, string> = {
  "子": "Rat",
  "丑": "Ox",
  "寅": "Tiger",
  "卯": "Rabbit",
  "辰": "Dragon",
  "巳": "Snake",
  "午": "Horse",
  "未": "Goat",
  "申": "Monkey",
  "酉": "Rooster",
  "戌": "Dog",
  "亥": "Pig",
};

/**
 * English label for a lunar month index (1–12).
 */
export function getLunarMonthEnglishLabel(lunarMonth: number): string {
  return LUNAR_MONTH_ENGLISH_LABELS[lunarMonth - 1] ?? `Lunar Month ${lunarMonth}`;
}

/**
 * English label for a transformation shift.
 */
export function getTransformationKindLabel(kind: TransformationKind): string {
  return TRANSFORMATION_KIND_LABELS[kind] ?? kind;
}

/**
 * English star name for report display.
 */
export function getStarEnglishLabel(starName: string): string {
  return STAR_ENGLISH_LABELS[starName] ?? getEnglishStarName(starName);
}

/**
 * English heavenly stem label.
 */
export function getHeavenlyStemEnglish(stem: HeavenlyStemType | string): string {
  return HEAVENLY_STEM_LABELS[stem as HeavenlyStemType] ?? stem;
}

/**
 * English earthly branch label (zodiac animal).
 */
export function getEarthlyBranchEnglish(branch: EarthlyBranchType | string): string {
  return EARTHLY_BRANCH_LABELS[branch as EarthlyBranchType] ?? branch;
}

/**
 * English year flow label from stem and branch.
 */
export function getAnnualFlowLabel(
  heavenlyStem: HeavenlyStemType | string,
  earthlyBranch: EarthlyBranchType | string
): string {
  return `${getHeavenlyStemEnglish(heavenlyStem)} ${getEarthlyBranchEnglish(earthlyBranch)} annual flow`;
}
