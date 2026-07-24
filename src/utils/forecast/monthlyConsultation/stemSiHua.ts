/**
 * Resolve Si Hua activations from a palace heavenly stem.
 * Same semantics as decade `getCycleActivations` / useTransformations.
 */

import type { ChartData, Palace, Star } from "../../zwds/types";
import { FOUR_TRANSFORMATIONS } from "../../zwds/constants";
import type { SiHuaKind, StemSiHuaActivation } from "./types";

/**
 * Find a star by Chinese name across all palaces.
 */
const findStarByName = (
  chartData: ChartData,
  starName: string
): { star: Star; palace: Palace } | null => {
  // Si Hua land on natal main/minor stars only — not flowing month/day overlays.
  for (const palace of chartData.palaces) {
    if (palace.mainStar) {
      for (const s of palace.mainStar) {
        if (s.name === starName) {
          return { star: s, palace };
        }
      }
    }
    if (palace.minorStars && palace.minorStars.length > 0) {
      for (const s of palace.minorStars) {
        if (s.name === starName) {
          return { star: s, palace };
        }
      }
    }
  }
  return null;
};

/**
 * Map traditional transformation table keys to UI kind labels.
 */
const mapTypeToKind = (type: string): SiHuaKind | null => {
  if (type === "祿" || type === "禄") {
    return "化禄";
  }
  if (type === "權" || type === "权") {
    return "化权";
  }
  if (type === "科") {
    return "化科";
  }
  if (type === "忌") {
    return "化忌";
  }
  return null;
};

/**
 * Resolve four Si Hua landings from a heavenly stem on the chart.
 *
 * @param chartData - Full natal chart
 * @param heavenlyStem - Stem character (e.g. 甲)
 * @returns Up to four activations with landing palace
 */
export const resolveStemSiHua = (
  chartData: ChartData,
  heavenlyStem: string
): StemSiHuaActivation[] => {
  if (heavenlyStem.trim().length === 0) {
    return [];
  }

  type StemKey = keyof typeof FOUR_TRANSFORMATIONS;
  const isStemKey = (value: string): value is StemKey =>
    Object.prototype.hasOwnProperty.call(FOUR_TRANSFORMATIONS, value);

  if (!isStemKey(heavenlyStem)) {
    return [];
  }

  const mapping = FOUR_TRANSFORMATIONS[heavenlyStem];
  const results: StemSiHuaActivation[] = [];
  const entries: Array<[string, string]> = [
    ["祿", mapping.祿],
    ["權", mapping.權],
    ["科", mapping.科],
    ["忌", mapping.忌],
  ];
  for (const [type, starName] of entries) {
    const kind = mapTypeToKind(type);
    if (kind === null) {
      continue;
    }
    const found = findStarByName(chartData, starName);
    if (found === null) {
      continue;
    }
    results.push({
      kind,
      starName,
      landingPalaceName: found.palace.name,
      landingPalaceNumber: found.palace.number,
    });
  }
  return results.slice(0, 4);
};

/**
 * Build a stable fingerprint key from Da Xian palace, Liu Yue palace, and primary Hua.
 */
export const buildFingerprintKey = (
  daXianPalaceName: string,
  liuYuePalaceName: string,
  activations: StemSiHuaActivation[]
): string => {
  const primary =
    activations.find((a) => a.kind === "化忌")
    ?? activations.find((a) => a.kind === "化禄")
    ?? activations[0];
  const huaPart =
    primary !== undefined
      ? `${primary.starName}${primary.kind}@${primary.landingPalaceName}`
      : "none";
  return [daXianPalaceName, liuYuePalaceName, huaPart].join("|");
};
