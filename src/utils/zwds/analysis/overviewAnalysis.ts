import { ChartData, Palace } from "../types";
import { OPPOSITE_PALACE_INFLUENCE } from "../constants";
import { DATASET_1 } from "../analysis_constants";
import {
  buildPersonalityProfiles,
  cleanStarName,
  normalizeOverviewStarKey,
  type OverviewDescriptionKey,
  type PersonalityProfile,
} from "./overviewStarUtils";

export type { PersonalityProfile } from "./overviewStarUtils";

/**
 * Type definitions for overview analysis results
 */
export type OverviewAnalysisResult = {
  descriptions: string[];
  strengths: string[];
  weaknesses: string[];
  quotes: string[];
  /** Structured profiles keyed to each life-palace main star personality. */
  personalityProfiles: PersonalityProfile[];
  /** Supporting personality copy from other life-palace stars (auxiliary / minor). */
  supplementaryProfiles: PersonalityProfile[];
  /** @deprecated Use personalityProfiles[0] — kept for legacy callers. */
  primaryStarKey: OverviewDescriptionKey | null;
  /** @deprecated Use personalityProfiles[0]?.archetypeTitle */
  archetypeTitle: string | null;
  /** @deprecated Use personalityProfiles[0]?.archetypeTraits */
  archetypeTraits: string[];
};

/**
 * Extract all star names from a palace's various star arrays
 */
const extractStarNamesFromPalace = (palace: Palace): string[] => {
  const starNames: string[] = [];

  if (palace.mainStar) {
    starNames.push(...palace.mainStar.map((star) => cleanStarName(star.name)));
  }

  if (palace.bodyStar) {
    starNames.push(cleanStarName(palace.bodyStar.name));
  }

  if (palace.lifeStar) {
    starNames.push(cleanStarName(palace.lifeStar.name));
  }

  if (palace.minorStars) {
    starNames.push(...palace.minorStars.map((star) => cleanStarName(star.name)));
  }

  if (palace.auxiliaryStars) {
    starNames.push(...palace.auxiliaryStars.map((star) => cleanStarName(star.name)));
  }

  if (palace.yearStars) {
    starNames.push(...palace.yearStars.map((star) => cleanStarName(star.name)));
  }

  if (palace.monthStars) {
    starNames.push(...palace.monthStars.map((star) => cleanStarName(star.name)));
  }

  if (palace.dayStars) {
    starNames.push(...palace.dayStars.map((star) => cleanStarName(star.name)));
  }

  if (palace.hourStars) {
    starNames.push(...palace.hourStars.map((star) => cleanStarName(star.name)));
  }

  return starNames;
};

/**
 * Main stars only — core identity is driven by the life-palace primary star(s).
 */
const extractMainStarNamesFromPalace = (palace: Palace): string[] => {
  if (!palace.mainStar || palace.mainStar.length === 0) {
    return [];
  }

  return palace.mainStar.map((star) => cleanStarName(star.name));
};

/**
 * Find a palace by name in the chart data
 */
const findPalaceByName = (chartData: ChartData, palaceName: string): Palace | null => {
  return chartData.palaces.find((palace) => palace.name === palaceName) || null;
};

/**
 * Whether a palace has any stars used for overview analysis.
 */
const hasOverviewStars = (palace: Palace): boolean =>
  extractStarNamesFromPalace(palace).length > 0;

/**
 * Whether overview analysis should borrow stars from the opposite palace.
 * Life palace with no main stars (命无正曜) uses the opposite palace per ZWDS convention.
 */
const shouldBorrowOppositePalaceStars = (palace: Palace): boolean =>
  !palace.mainStar || palace.mainStar.length === 0;

/**
 * When a palace has no main stars, borrow from its opposite palace (e.g. 命宫 → 迁移).
 * Matches OPPOSITE_PALACE_INFLUENCE used in nobleman and timing-chart analysis.
 */
const resolvePalaceWithOppositeFallback = (
  chartData: ChartData,
  palace: Palace | null
): Palace | null => {
  if (!palace) {
    return null;
  }

  if (!shouldBorrowOppositePalaceStars(palace)) {
    return palace;
  }

  const oppositePalaceName =
    OPPOSITE_PALACE_INFLUENCE[palace.name as keyof typeof OPPOSITE_PALACE_INFLUENCE];

  if (oppositePalaceName) {
    const oppositePalace = findPalaceByName(chartData, oppositePalaceName);
    if (oppositePalace && hasOverviewStars(oppositePalace)) {
      return oppositePalace;
    }
  }

  return palace;
};

/**
 * Resolve the palace used for overview personality analysis.
 */
const getRelevantPalace = (
  chartData: ChartData,
  palaceNumberOverride?: number
): Palace | null => {
  if (palaceNumberOverride !== undefined) {
    const overridePalace = chartData.palaces.find(
      (palace) => palace.number === palaceNumberOverride
    );
    if (overridePalace) {
      return resolvePalaceWithOppositeFallback(chartData, overridePalace);
    }
    return findPalaceByName(chartData, "迁移");
  }

  const lifePalace = findPalaceByName(chartData, "命宫");
  if (lifePalace) {
    return resolvePalaceWithOppositeFallback(chartData, lifePalace);
  }

  return findPalaceByName(chartData, "迁移");
};

/**
 * Get star names from life palace, or travel palace as fallback.
 */
const getRelevantStars = (chartData: ChartData, palaceNumberOverride?: number): string[] => {
  const palace = getRelevantPalace(chartData, palaceNumberOverride);
  if (!palace) {
    return [];
  }

  const stars = extractStarNamesFromPalace(palace);
  return stars.length > 0 ? stars : [];
};

/**
 * Star names that define the core personality narrative and archetype card.
 */
const getPersonalityStarNames = (
  chartData: ChartData,
  palaceNumberOverride?: number
): string[] => {
  const palace = getRelevantPalace(chartData, palaceNumberOverride);
  if (!palace) {
    return [];
  }

  const mainStars = extractMainStarNamesFromPalace(palace);
  if (mainStars.length > 0) {
    return mainStars;
  }

  return extractStarNamesFromPalace(palace);
};

/**
 * Get strengths and weaknesses from DATASET_1 for given star names
 */
const getStrengthsAndWeaknesses = (
  starNames: string[]
): { strengths: string[]; weaknesses: string[] } => {
  const strengths: string[] = [];
  const weaknesses: string[] = [];

  starNames.forEach((rawName) => {
    const starKey = normalizeOverviewStarKey(rawName);
    if (starKey === null) {
      return;
    }

    const datasetKey = starKey as keyof typeof DATASET_1;
    const starData = DATASET_1[datasetKey];
    if (starData && starData.命宫) {
      if (starData.命宫.strengths && typeof starData.命宫.strengths === "string") {
        const strengthList = starData.命宫.strengths
          .split(/[、，,/]/)
          .map((value) => value.trim())
          .filter((value) => value.length > 0);
        strengths.push(...strengthList);
      }

      if (starData.命宫.cautions && typeof starData.命宫.cautions === "string") {
        const cautionList = starData.命宫.cautions
          .split(/[、，,/]/)
          .map((value) => value.trim())
          .filter((value) => value.length > 0);
        weaknesses.push(...cautionList);
      }
    }
  });

  return { strengths, weaknesses };
};

const getArchetypeTraitsForStar = (starKey: OverviewDescriptionKey): string[] =>
  getStrengthsAndWeaknesses([starKey]).strengths;

/**
 * Get quotes from life, wealth, and career palaces
 */
const getQuotes = (chartData: ChartData): string[] => {
  const quotes: string[] = [];
  const palaceTypes = ["命宫", "财帛", "官禄"];

  palaceTypes.forEach((palaceType) => {
    let palace = findPalaceByName(chartData, palaceType);
    if (palace && palaceType === "命宫" && shouldBorrowOppositePalaceStars(palace)) {
      palace = resolvePalaceWithOppositeFallback(chartData, palace);
    }
    if (palace) {
      const starNames = extractStarNamesFromPalace(palace);

      starNames.forEach((rawName) => {
        const starKey = normalizeOverviewStarKey(rawName);
        if (starKey === null) {
          return;
        }

        const datasetKey = starKey as keyof typeof DATASET_1;
        const starData = DATASET_1[datasetKey];
        if (starData) {
          let quote = "";

          if (palaceType === "命宫" && starData.命宫 && starData.命宫.quote) {
            quote = starData.命宫.quote;
          } else if (palaceType === "财帛" && starData.财帛宫 && starData.财帛宫.quote) {
            quote = starData.财帛宫.quote;
          } else if (palaceType === "官禄" && starData.官禄宫 && starData.官禄宫.quote) {
            quote = starData.官禄宫.quote;
          }

          if (quote && !quotes.includes(quote)) {
            quotes.push(quote);
          }
        }
      });
    }
  });

  return quotes;
};

/**
 * Main function to analyze chart data for overview component
 */
export const analyzeOverview = (
  chartData: ChartData,
  palaceNumberOverride?: number
): OverviewAnalysisResult => {
  const relevantStars = getRelevantStars(chartData, palaceNumberOverride);
  const personalityStarNames = getPersonalityStarNames(chartData, palaceNumberOverride);

  const personalityProfiles = buildPersonalityProfiles(
    personalityStarNames,
    getArchetypeTraitsForStar
  );

  const mainStarKeys = new Set(personalityProfiles.map((profile) => profile.starKey));
  const supplementaryStarNames = relevantStars.filter((rawName) => {
    const starKey = normalizeOverviewStarKey(rawName);
    return starKey !== null && !mainStarKeys.has(starKey);
  });
  const supplementaryProfiles = buildPersonalityProfiles(
    supplementaryStarNames,
    () => []
  );

  const descriptions = [
    ...personalityProfiles.map((profile) => profile.description),
    ...supplementaryProfiles.map((profile) => profile.description),
  ];
  const primaryProfile = personalityProfiles[0] ?? null;

  const { strengths, weaknesses } = getStrengthsAndWeaknesses(relevantStars);
  const quotes = getQuotes(chartData);

  return {
    descriptions,
    strengths,
    weaknesses,
    quotes,
    personalityProfiles,
    supplementaryProfiles,
    primaryStarKey: primaryProfile?.starKey ?? null,
    archetypeTitle: primaryProfile?.archetypeTitle ?? null,
    archetypeTraits: primaryProfile?.archetypeTraits ?? [],
  };
};

/**
 * Helper function to get debugging information about what stars were found
 */
export const getDebugInfo = (
  chartData: ChartData
): { lifePalaceStars: string[]; travelPalaceStars: string[]; usedStars: string[] } => {
  const lifePalace = findPalaceByName(chartData, "命宫");
  const travelPalace = findPalaceByName(chartData, "迁移");

  const lifePalaceStars = lifePalace ? extractStarNamesFromPalace(lifePalace) : [];
  const travelPalaceStars = travelPalace ? extractStarNamesFromPalace(travelPalace) : [];
  const usedStars = getRelevantStars(chartData);

  return {
    lifePalaceStars,
    travelPalaceStars,
    usedStars,
  };
};
