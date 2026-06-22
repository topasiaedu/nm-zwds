import {
  OVERVIEW_ARCHETYPE_TITLES,
  OVERVIEW_DESCRIPTION_CONSTANTS,
} from "../analysis_constants/overview_description";

export type OverviewDescriptionKey = keyof typeof OVERVIEW_DESCRIPTION_CONSTANTS;

/**
 * Maps simplified / traditional chart star names to overview constant keys.
 */
const OVERVIEW_STAR_KEY_ALIASES: Record<string, OverviewDescriptionKey> = {
  紫微: "紫微",
  天府: "天府",
  天相: "天相",
  武曲: "武曲",
  天机: "天机",
  天機: "天机",
  文曲: "文曲",
  文昌: "文昌",
  贪狼: "贪狼",
  貪狼: "贪狼",
  太阳: "太阳",
  太陽: "太阳",
  太阴: "太阴",
  太陰: "太阴",
  巨门: "巨门",
  巨門: "巨门",
  天同: "天同",
  七杀: "七杀",
  七殺: "七杀",
  破军: "破军",
  破軍: "破军",
  左辅: "左輔",
  左輔: "左輔",
  右弼: "右弼",
  天梁: "天梁",
  廉贞: "廉贞",
  廉貞: "廉贞",
};

/**
 * Strips transformation markup from palace star labels.
 */
export const cleanStarName = (rawName: string): string =>
  rawName.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

/**
 * Resolves a chart star label to an overview personality key, if supported.
 */
export const normalizeOverviewStarKey = (rawName: string): OverviewDescriptionKey | null => {
  const cleaned = cleanStarName(rawName);
  if (cleaned.length === 0) {
    return null;
  }

  const aliasKey = OVERVIEW_STAR_KEY_ALIASES[cleaned];
  if (aliasKey !== undefined) {
    return aliasKey;
  }

  if (cleaned in OVERVIEW_DESCRIPTION_CONSTANTS) {
    return cleaned as OverviewDescriptionKey;
  }

  return null;
};

export type PersonalityProfile = {
  starKey: OverviewDescriptionKey;
  englishStarName: string;
  description: string;
  archetypeTitle: string;
  archetypeTraits: string[];
};

/**
 * Builds one personality profile per supported star (deduped, in palace order).
 */
export const buildPersonalityProfiles = (
  starNames: string[],
  getTraitsForStar: (starKey: OverviewDescriptionKey) => string[]
): PersonalityProfile[] => {
  const profiles: PersonalityProfile[] = [];
  const seenStarKeys = new Set<OverviewDescriptionKey>();

  starNames.forEach((rawName) => {
    const starKey = normalizeOverviewStarKey(rawName);
    if (starKey === null || seenStarKeys.has(starKey)) {
      return;
    }

    const starData = OVERVIEW_DESCRIPTION_CONSTANTS[starKey];
    const archetypeTitle = OVERVIEW_ARCHETYPE_TITLES[starKey];
    if (!starData.description || !archetypeTitle) {
      return;
    }

    seenStarKeys.add(starKey);
    profiles.push({
      starKey,
      englishStarName: starData.english_name,
      description: starData.description,
      archetypeTitle,
      archetypeTraits: getTraitsForStar(starKey),
    });
  });

  return profiles;
};
