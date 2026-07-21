/**
 * Resolve Da Xian / Liu Nian / Liu Yue timing stack for a target lunar month.
 */

import type { ChartData } from "../../zwds/types";
import type { DayunSeason } from "../../../types/dayun";
import {
  getPalaceForAspectLiuMonth,
  getMonthPalaceForLiuMonth,
  getYearPalaceForLiuMonth,
} from "../../destiny-navigator/palace-resolver";
import {
  calculateCurrentDayunCycle,
  getYearInCycle,
} from "../../dayun/calculator";
import { getEnglishPalaceName, palaceToSeason } from "../../dayun/seasonMapper";
import { oppositePalace } from "../../zwds/utils";
import type {
  FocusStarSource,
  MonthlyStarSnapshot,
  MonthlyTimingStack,
  SiHuaKind,
} from "./types";
import { resolveStemSiHua } from "./stemSiHua";

/**
 * Safe season lookup. never throws for unknown palace names.
 */
export const safePalaceToSeason = (palaceName: string): DayunSeason => {
  try {
    return palaceToSeason(palaceName);
  } catch {
    return "spring";
  }
};

/**
 * Snapshot natal stars and natal transformations for a palace number.
 */
export const snapshotPalaceStars = (
  chartData: ChartData,
  palaceNumber: number
): MonthlyStarSnapshot | null => {
  if (!Number.isFinite(palaceNumber) || palaceNumber < 1 || palaceNumber > 12) {
    return null;
  }
  const palace = chartData.palaces[palaceNumber - 1];
  if (palace === undefined) {
    return null;
  }

  const mainStars = (palace.mainStar ?? []).map((s) => s.name);
  const natalTransforms: Array<{ starName: string; kind: SiHuaKind }> = [];

  const allStars = [
    ...(palace.mainStar ?? []),
    ...(palace.minorStars ?? []),
    ...(palace.auxiliaryStars ?? []),
  ];
  for (const star of allStars) {
    const transforms = star.transformations ?? [];
    for (const t of transforms) {
      // Chart stars store traditional Transformation characters.
      let kind: SiHuaKind | null = null;
      if (t === "化祿") {
        kind = "化禄";
      } else if (t === "化權") {
        kind = "化权";
      } else if (t === "化科") {
        kind = "化科";
      } else if (t === "化忌") {
        kind = "化忌";
      }
      if (kind !== null) {
        natalTransforms.push({ starName: star.name, kind });
      }
    }
  }

  return {
    palaceNumber,
    palaceName: palace.name,
    palaceNameEnglish: getEnglishPalaceName(palace.name),
    mainStars,
    natalTransforms,
  };
};

/**
 * Resolve stars for the month focus spotlight (Part 4 / Your chart only).
 * When the Liu Yue Life palace has no natal main stars (空宫), borrow main stars
 * from the opposite palace (借星安宫 / 对宫) per Zi Wei Dou Shu convention.
 * Scope: Life-focus chapter only. Aspect Scorecard / Work / Money / People use
 * open-stage + month activations when empty (they do not borrow opposite stars).
 */
export const resolveFocusStarsWithOppositeBorrow = (
  chartData: ChartData,
  focusSnapshot: MonthlyStarSnapshot
): FocusStarSource => {
  const focusPalaceNameEnglish = focusSnapshot.palaceNameEnglish;

  if (focusSnapshot.mainStars.length > 0) {
    return {
      mode: "natal",
      displayMainStars: focusSnapshot.mainStars,
      focusPalaceNameEnglish,
      borrowedFromPalaceNameEnglish: null,
    };
  }

  const oppositeNumber = oppositePalace(focusSnapshot.palaceNumber);
  const oppositeSnapshot = snapshotPalaceStars(chartData, oppositeNumber);
  if (oppositeSnapshot !== null && oppositeSnapshot.mainStars.length > 0) {
    return {
      mode: "borrowed",
      displayMainStars: oppositeSnapshot.mainStars,
      focusPalaceNameEnglish,
      borrowedFromPalaceNameEnglish: oppositeSnapshot.palaceNameEnglish,
    };
  }

  return {
    mode: "open",
    displayMainStars: [],
    focusPalaceNameEnglish,
    borrowedFromPalaceNameEnglish: null,
  };
};

/**
 * Resolve the full monthly timing stack for one lunar month + solar year.
 */
export const resolveMonthlyTimingStack = (
  chartData: ChartData,
  lunarMonth: number,
  solarYear: number
): MonthlyTimingStack | null => {
  if (!Number.isFinite(lunarMonth) || lunarMonth < 1 || lunarMonth > 12) {
    return null;
  }
  if (!Number.isFinite(solarYear)) {
    return null;
  }

  const lifeNum = getPalaceForAspectLiuMonth("life", chartData, lunarMonth, solarYear);
  const monthPalaceNum = getMonthPalaceForLiuMonth(chartData, lunarMonth, solarYear);
  if (lifeNum === null || monthPalaceNum === null) {
    return null;
  }

  const lifePalace = chartData.palaces[lifeNum - 1];
  if (lifePalace === undefined) {
    return null;
  }

  const yearPalaceNum = getYearPalaceForLiuMonth(chartData, solarYear);
  const liuNianPalace =
    yearPalaceNum !== null ? chartData.palaces[yearPalaceNum - 1] : undefined;

  const dayun = calculateCurrentDayunCycle(chartData, solarYear);
  const yearInCycle = getYearInCycle(chartData, solarYear);
  const dayunPalaceNum =
    dayun !== null
      ? chartData.palaces.find((p) => p.name === dayun.palaceChinese)?.number ?? null
      : null;

  return {
    solarYear,
    lunarMonth,
    liuYueLifePalaceNumber: lifeNum,
    liuYueLifePalaceName: lifePalace.name,
    liuYueLifePalaceNameEnglish: getEnglishPalaceName(lifePalace.name),
    liuYueMonthPalaceNumber: monthPalaceNum,
    liuNianPalaceNumber: yearPalaceNum,
    liuNianPalaceName: liuNianPalace?.name ?? null,
    liuNianPalaceNameEnglish:
      liuNianPalace !== undefined ? getEnglishPalaceName(liuNianPalace.name) : null,
    daXian:
      dayun !== null && dayunPalaceNum !== null && yearInCycle !== null
        ? {
          palaceNumber: dayunPalaceNum,
          palaceName: dayun.palaceChinese,
          palaceNameEnglish: dayun.palace,
          yearInCycle,
          season: dayun.season,
          phase: String(dayun.phase),
          startYear: dayun.startYear,
          endYear: dayun.endYear,
        }
        : null,
    liuYueSeason: safePalaceToSeason(lifePalace.name),
    liuNianSeason:
      liuNianPalace !== undefined ? safePalaceToSeason(liuNianPalace.name) : null,
  };
};

/**
 * Resolve Si Hua from the heavenly stem of the Liu Yue life-palace physical palace.
 */
export const resolveLiuYueStemSiHua = (
  chartData: ChartData,
  stack: MonthlyTimingStack
): ReturnType<typeof resolveStemSiHua> => {
  const palace = chartData.palaces[stack.liuYueLifePalaceNumber - 1];
  if (palace === undefined || typeof palace.heavenlyStem !== "string") {
    return [];
  }
  return resolveStemSiHua(chartData, palace.heavenlyStem);
};
