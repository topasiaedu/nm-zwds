/**
 * Shared utilities for resolving 四化 activations from heavenly stems.
 */

import type { ChartData, Palace, Star, Transformation } from "../zwds/types";
import { FOUR_TRANSFORMATIONS, HEAVENLY_STEMS, EARTHLY_BRANCHES } from "../zwds/constants";
import type { HeavenlyStemType } from "../zwds/types";
import type { TransformationActivation, TransformationKind } from "./types";

/** Mapping from FOUR_TRANSFORMATIONS keys to TransformationKind. */
const STEM_KEY_TO_KIND: Record<string, TransformationKind> = {
  "祿": "化祿",
  "權": "化權",
  "科": "化科",
  "忌": "化忌",
};

/**
 * Compute heavenly stem and earthly branch for a Gregorian year.
 */
export function getStemBranchForYear(year: number): {
  heavenlyStem: HeavenlyStemType;
  earthlyBranch: (typeof EARTHLY_BRANCHES)[number];
} {
  if (!Number.isFinite(year) || year < 1) {
    throw new Error(`Invalid year for stem/branch: ${year}`);
  }
  const stemIndex = ((year - 4) % 10 + 10) % 10;
  const branchIndex = ((year - 1) % 12 + 12) % 12;
  const heavenlyStem = HEAVENLY_STEMS[stemIndex];
  const earthlyBranch = EARTHLY_BRANCHES[branchIndex];
  if (heavenlyStem === undefined || earthlyBranch === undefined) {
    throw new Error(`Could not resolve stem/branch for year ${year}`);
  }
  return { heavenlyStem, earthlyBranch };
}

/**
 * Resolve 流年 palace number for a report year (2013-based 12-year wheel).
 */
export function getYearPalaceNumberForReportYear(reportYear: number): number {
  const offset = ((reportYear - 2013) % 12 + 12) % 12;
  return offset + 1;
}

/**
 * Find a star by name across all palaces in the chart.
 */
export function findStarByName(
  chartData: ChartData,
  starName: string
): { star: Star; palace: Palace } | null {
  for (const palace of chartData.palaces) {
    const starGroups: Star[][] = [
      palace.mainStar ?? [],
      palace.minorStars ?? [],
      palace.auxiliaryStars ?? [],
      palace.yearStars ?? [],
      palace.monthStars ?? [],
      palace.dayStars ?? [],
      palace.hourStars ?? [],
      palace.lifeStar !== undefined ? [palace.lifeStar] : [],
      palace.bodyStar !== undefined ? [palace.bodyStar] : [],
    ];
    for (const group of starGroups) {
      for (const star of group) {
        if (star.name === starName) {
          return { star, palace };
        }
      }
    }
  }
  return null;
}

/**
 * Resolve four transformations from a heavenly stem into palace activations.
 */
export function resolveTransformationsFromStem(
  chartData: ChartData,
  heavenlyStem: HeavenlyStemType,
  sourceLabel: string
): TransformationActivation[] {
  const mapping = FOUR_TRANSFORMATIONS[heavenlyStem];
  if (mapping === undefined) {
    return [];
  }

  const activations: TransformationActivation[] = [];

  for (const [stemKey, starName] of Object.entries(mapping)) {
    const kind = STEM_KEY_TO_KIND[stemKey];
    if (kind === undefined) {
      continue;
    }
    const found = findStarByName(chartData, starName);
    if (found === null) {
      continue;
    }
    activations.push({
      kind,
      starName,
      targetPalaceName: found.palace.name,
      targetPalaceNumber: found.palace.number,
      sourceLabel,
    });
  }

  return activations;
}

/**
 * Collect all transformation kinds currently on a palace (natal + self).
 */
export function getPalaceTransformationKinds(palace: Palace): Transformation[] {
  const kinds = new Set<Transformation>();
  const starGroups: Star[][] = [
    palace.mainStar ?? [],
    palace.minorStars ?? [],
    palace.auxiliaryStars ?? [],
    palace.lifeStar !== undefined ? [palace.lifeStar] : [],
  ];

  for (const group of starGroups) {
    for (const star of group) {
      if (star.transformations !== undefined) {
        for (const t of star.transformations) {
          kinds.add(t);
        }
      }
      if (star.selfInfluence !== undefined) {
        for (const t of star.selfInfluence) {
          kinds.add(t);
        }
      }
    }
  }

  return Array.from(kinds);
}
