/**
 * Resolve Da Xian / Liu Nian / Liu Yue timing stack for a target lunar month.
 */

import type { ChartData } from "../../zwds/types";
import type { DayunSeason } from "../../../types/dayun";
import {
  getPalaceForAspectLiuMonth,
  getMonthPalaceForLiuMonth,
  getYearPalaceForLiuMonth,
  getPalaceEnglishNameForTimeframe,
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
 * Resolve the Liu Month chart English label for a physical palace.
 * Falls back to natal English when the timeframe label cannot be resolved.
 */
export const resolveLiuMonthChartPalaceEnglish = (
  chartData: ChartData,
  palaceNumber: number,
  lunarMonth: number,
  solarYear: number
): string => {
  const chartLabel = getPalaceEnglishNameForTimeframe(
    palaceNumber,
    chartData,
    "liumonth",
    lunarMonth,
    solarYear
  );
  if (chartLabel !== null && chartLabel.trim().length > 0) {
    return chartLabel;
  }
  const palace = chartData.palaces[palaceNumber - 1];
  if (palace === undefined) {
    return "Life Area";
  }
  return getEnglishPalaceName(palace.name);
};

/**
 * Snapshot natal stars and natal transformations for a palace number.
 *
 * @param chartPalaceNameEnglish - Liu Month chart label when known (matches My Charts)
 */
export const snapshotPalaceStars = (
  chartData: ChartData,
  palaceNumber: number,
  chartPalaceNameEnglish?: string
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
  const natalEnglish = getEnglishPalaceName(palace.name);

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
    palaceNameEnglish: natalEnglish,
    chartPalaceNameEnglish:
      typeof chartPalaceNameEnglish === "string" && chartPalaceNameEnglish.trim().length > 0
        ? chartPalaceNameEnglish.trim()
        : natalEnglish,
    mainStars,
    natalTransforms,
  };
};

/**
 * Resolve stars for a palace spotlight when the palace may be empty (空宫).
 * When there are no natal main stars, borrow main stars from the opposite palace
 * (借星安宫 / 对宫) per Zi Wei Dou Shu convention.
 * Used by Life-focus Stars and Career / Wealth / Relationship aspect chapters.
 *
 * Display names prefer Liu Month chart labels so they match My Charts > Liu Month.
 */
export const resolveFocusStarsWithOppositeBorrow = (
  chartData: ChartData,
  focusSnapshot: MonthlyStarSnapshot,
  oppositeChartPalaceNameEnglish?: string
): FocusStarSource => {
  const focusPalaceNameEnglish = focusSnapshot.chartPalaceNameEnglish;

  if (focusSnapshot.mainStars.length > 0) {
    return {
      mode: "natal",
      displayMainStars: focusSnapshot.mainStars,
      focusPalaceNameEnglish,
      borrowedFromPalaceNameEnglish: null,
    };
  }

  const oppositeNumber = oppositePalace(focusSnapshot.palaceNumber);
  const oppositeSnapshot = snapshotPalaceStars(
    chartData,
    oppositeNumber,
    oppositeChartPalaceNameEnglish
  );
  if (oppositeSnapshot !== null && oppositeSnapshot.mainStars.length > 0) {
    return {
      mode: "borrowed",
      displayMainStars: oppositeSnapshot.mainStars,
      focusPalaceNameEnglish,
      borrowedFromPalaceNameEnglish: oppositeSnapshot.chartPalaceNameEnglish,
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

  const lifeChartEnglish = resolveLiuMonthChartPalaceEnglish(
    chartData,
    lifeNum,
    lunarMonth,
    solarYear
  );

  return {
    solarYear,
    lunarMonth,
    liuYueLifePalaceNumber: lifeNum,
    liuYueLifePalaceName: lifePalace.name,
    liuYueLifePalaceNameEnglish: getEnglishPalaceName(lifePalace.name),
    liuYueLifeChartPalaceNameEnglish: lifeChartEnglish,
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
 * Landing palace labels use the Liu Month chart (My Charts > Liu Month), not natal names.
 */
export const resolveLiuYueStemSiHua = (
  chartData: ChartData,
  stack: MonthlyTimingStack
): ReturnType<typeof resolveStemSiHua> => {
  const palace = chartData.palaces[stack.liuYueLifePalaceNumber - 1];
  if (palace === undefined || typeof palace.heavenlyStem !== "string") {
    return [];
  }
  return resolveStemSiHua(chartData, palace.heavenlyStem).map((activation) => ({
    ...activation,
    landingChartPalaceNameEnglish: resolveLiuMonthChartPalaceEnglish(
      chartData,
      activation.landingPalaceNumber,
      stack.lunarMonth,
      stack.solarYear
    ),
  }));
};
