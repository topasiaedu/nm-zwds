import { ChartData, Palace, Transformation } from "../types";
import { DESTINY_ALERT_STAR_CONSTANTS } from "../analysis_constants/destiny_alert_star";

/**
 * Type definition for processed palace alert data
 */
export type PalaceAlertData = {
  /** English name of the palace where the transformation activates (e.g. "Life Palace") */
  palace: string;
  /** The transformation type in traditional Chinese (e.g. "化祿") */
  transformation: string;
  /** Line 1 — Theme of the activation */
  line1: string;
  /** Line 2 — How it manifests practically */
  line2: string;
  /** Line 3 — The directive (rendered bold in UI) */
  line3: string;
  /** Physical palace number (1–12) */
  palaceNumber: number;
  /** The star carrying this transformation (Chinese name) */
  starName: string;
};

/**
 * Type definition for the analysis result
 */
export type DestinyAlertAnalysisResult = {
  alerts: PalaceAlertData[];
  debugInfo?: {
    transformationsFound: Record<string, { star: string; palace: number }>;
    palacesChecked: number;
  };
};

/**
 * Normalises traditional/simplified transformation variants to a canonical traditional key
 */
const TRANSFORMATION_KEY_MAP: Record<string, string> = {
  "化祿": "化祿",
  "化禄": "化祿", // simplified → traditional
  "化權": "化權",
  "化权": "化權", // simplified → traditional
  "化科": "化科",
  "化忌": "化忌",
};

/**
 * Normalises simplified Chinese star names to traditional Chinese so they match
 * the keys in DESTINY_ALERT_STAR_CONSTANTS.
 *
 * The ZWDS calculator stores star names in simplified Chinese (e.g. 太阳, 廉贞),
 * while the constants file uses traditional Chinese (太陽, 廉貞). Stars that are
 * identical in both scripts (武曲, 天同, 天梁, 紫微, 天府, 文昌, 文曲, 右弼…) pass
 * through unchanged.
 */
const STAR_NAME_SIMPLIFIED_TO_TRADITIONAL: Record<string, string> = {
  "廉贞": "廉貞",
  "天机": "天機",
  "太阴": "太陰",
  "贪狼": "貪狼",
  "巨门": "巨門",
  "破军": "破軍",
  "太阳": "太陽",
  "左辅": "左輔",
  "七杀": "七殺",
};

/**
 * Returns the traditional-character version of a star name.
 * If the name is already traditional (or identical in both scripts) it is returned as-is.
 */
const normaliseStarName = (name: string): string =>
  STAR_NAME_SIMPLIFIED_TO_TRADITIONAL[name] ?? name;

/**
 * Maps palace names to their English display names
 */
const PALACE_NAME_TO_ENGLISH: Record<string, string> = {
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
  // Variations without 宫
  "命": "Life Palace",
  "兄弟宫": "Siblings Palace",
  "夫妻宫": "Spouse Palace",
  "子女宫": "Children Palace",
  "财帛宫": "Wealth Palace",
  "疾厄宫": "Health Palace",
  "迁移宫": "Travel Palace",
  "交友宫": "Friends Palace",
  "官禄宫": "Career Palace",
  "田宅宫": "Property Palace",
  "福德宫": "Wellbeing Palace",
  "父母宫": "Parents Palace",
};

/**
 * Finds which palace contains a star with the given transformation
 */
const findPalaceWithTransformation = (
  palaces: Palace[],
  transformation: Transformation
): { palace: Palace; starName: string } | null => {
  for (const palace of palaces) {
    // Check all star arrays in the palace
    const allStars = [
      ...(palace.mainStar || []),
      ...(palace.bodyStar ? [palace.bodyStar] : []),
      ...palace.minorStars,
      ...palace.auxiliaryStars,
      ...palace.yearStars,
      ...palace.monthStars,
      ...palace.dayStars,
      ...palace.hourStars,
      ...(palace.lifeStar ? [palace.lifeStar] : []),
    ];

    for (const star of allStars) {
      if (star.transformations && star.transformations.includes(transformation)) {
        return { palace, starName: star.name };
      }
    }
  }

  return null;
};

/**
 * Analyzes chart data to extract destiny alert information
 */
export const analyzeDestinyAlert = (chartData: ChartData): DestinyAlertAnalysisResult => {
  const alerts: PalaceAlertData[] = [];
  const debugInfo = {
    transformationsFound: {} as Record<string, { star: string; palace: number }>,
    palacesChecked: chartData.palaces.length,
  };

  // Process each transformation type in order: 化祿, 化權, 化科, 化忌
  const transformations: Transformation[] = ["化祿", "化權", "化科", "化忌"];

  for (const transformation of transformations) {
    const result = findPalaceWithTransformation(chartData.palaces, transformation);

    if (result) {
      const { palace, starName } = result;
      const palaceNumber = palace.number;

      // Store debug info
      debugInfo.transformationsFound[transformation] = {
        star: starName,
        palace: palaceNumber,
      };

      // Get the English name for the palace
      const englishName = PALACE_NAME_TO_ENGLISH[palace.name];
      if (!englishName) {
        console.warn(`No English name mapping found for palace: ${palace.name}`);
        continue;
      }

      // Normalise transformation to traditional key for lookup
      const normalisedTransformation = TRANSFORMATION_KEY_MAP[transformation] ?? transformation;

      // Normalise star name (simplified → traditional) so it matches the constants keys
      const normalisedStarName = normaliseStarName(starName);

      // Look up by star × transformation key
      const lookupKey = `${normalisedStarName}_${normalisedTransformation}`;
      const starEntry = DESTINY_ALERT_STAR_CONSTANTS[lookupKey];

      if (starEntry) {
        alerts.push({
          palace: englishName,
          transformation,
          line1: starEntry.line1,
          line2: starEntry.line2,
          line3: starEntry.line3,
          palaceNumber,
          // Keep the original starName from chart data for display; UI will convert to pinyin
          starName,
        });
      } else {
        console.warn(`No destiny alert entry found for key: ${lookupKey}`);
      }
    }
  }

  return {
    alerts,
    debugInfo,
  };
};

/**
 * Gets debug information for troubleshooting
 */
export const getDestinyAlertDebugInfo = (chartData: ChartData): Record<string, unknown> => {
  return {
    totalPalaces: chartData.palaces.length,
    lifePalace: chartData.lifePalace,
    transformations: chartData.transformations,
    palaceNames: chartData.palaces.map((p, index) => ({
      number: p.number,
      name: p.name,
      hasMainStar: !!(p.mainStar && p.mainStar.length > 0),
      transformedStars: chartData.palaces[index].mainStar?.filter(s => s.transformations && s.transformations.length > 0) || [],
    })),
  };
};