import { type ChartData, type Palace, type Star } from "../types";
import { FOUR_TRANSFORMATIONS } from "../constants";
import {
  ACTIVATION_PALACE_MEANINGS,
  type ActivationKey,
  type PalaceKey,
} from "./meanings";

/**
 * Normalize transformation strings to ActivationKey (simplified characters)
 * Accepts traditional variants commonly used in chart data.
 */
const normalizeTransformationToActivationKey = (
  transformation: string
): ActivationKey | null => {
  const map: Record<string, ActivationKey> = {
    "化祿": "化禄",
    "化禄": "化禄",
    "化權": "化权",
    "化权": "化权",
    "化科": "化科",
    "化忌": "化忌",
  };
  return map[transformation] ?? null;
};

export type CycleActivation = {
  activation: ActivationKey;
  palaceKey: PalaceKey;
  paragraphs: ReadonlyArray<string>;
  keyTakeaways: ReadonlyArray<string>;
};

/**
 * Find a star by name across all palaces (checks main and minor first for speed).
 */
const findStarByName = (
  chartData: ChartData,
  starName: string
): { star: Star; palace: Palace } | null => {
  for (const palace of chartData.palaces) {
    if (palace.mainStar) {
      for (const s of palace.mainStar) {
        if (s.name === starName) return { star: s, palace };
      }
    }
    if (palace.minorStars && palace.minorStars.length > 0) {
      for (const s of palace.minorStars) {
        if (s.name === starName) return { star: s, palace };
      }
    }
  }
  // broader search if needed
  for (const palace of chartData.palaces) {
    const others: Star[] = [
      ...(palace.auxiliaryStars || []),
      ...(palace.yearStars || []),
      ...(palace.monthStars || []),
      ...(palace.dayStars || []),
      ...(palace.hourStars || []),
    ];
    for (const s of others) {
      if (s.name === starName) return { star: s, palace };
    }
  }
  return null;
};

/**
 * Given the selected Da Yun palace number (1-12), compute activation targets
 * based on the transformation lines logic (same semantics as useTransformations):
 * - Derive the four transformations from the selected palace's heavenly stem
 * - Resolve each target star to a palace
 * - Fetch activation meanings using that target palace
 */
export const getCycleActivations = (
  chartData: ChartData,
  dayunPalaceNumber: number
): ReadonlyArray<CycleActivation> => {
  const idx = dayunPalaceNumber - 1;
  if (idx < 0 || idx >= chartData.palaces.length) {
    return [];
  }

  const selectedPalace = chartData.palaces[idx];
  const heavenlyStem = selectedPalace.heavenlyStem;
  if (!heavenlyStem) return [];

  const mapping = FOUR_TRANSFORMATIONS[heavenlyStem];
  if (!mapping) return [];

  const order: Array<{ key: ActivationKey; starName: string }> = [];
  for (const [type, starName] of Object.entries(mapping)) {
    let key: ActivationKey | null = null;
    if (type === "祿") key = "化禄";
    else if (type === "權") key = "化权";
    else if (type === "科") key = "化科";
    else if (type === "忌") key = "化忌";
    if (key) order.push({ key, starName });
  }

  const results: CycleActivation[] = [];
  for (const item of order) {
    const found = findStarByName(chartData, item.starName);
    if (!found) continue;
    const targetPalaceKey = found.palace.name as PalaceKey;
    const entry = ACTIVATION_PALACE_MEANINGS[item.key][targetPalaceKey];
    if (entry && entry.paragraphs && entry.paragraphs.length > 0) {
      // Extract key takeaways from the second paragraph if it exists
      const keyTakeaways = entry.paragraphs.length > 1 ? 
        entry.paragraphs[1].split(/[.!?]+/).filter(s => s.trim().length > 10).slice(0, 3) : 
        [];
      results.push({ 
        activation: item.key, 
        palaceKey: targetPalaceKey, 
        paragraphs: entry.paragraphs,
        keyTakeaways 
      });
    }
  }

  return results.slice(0, 4);
};


