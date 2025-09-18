import { type Palace, type Star } from "../types";
import {
  DECADE_CYCLE_MEANINGS,
  type CycleKey,
  type StarKey,
  type DecadeStarEntry,
} from "./decade_cycle_meaning";

/**
 * Map Chinese star names to English romanized names
 */
const STAR_NAME_TO_ENGLISH: Record<string, string> = {
  "紫微": "Zi Wei",
  "破军": "Po Jun",
  "天府": "Tian Fu",
  "廉贞": "Lian Zhen",
  "太阴": "Tai Yin",
  "贪狼": "Tan Lang",
  "巨门": "Ju Men",
  "天同": "Tian Tong",
  "天相": "Tian Xiang",
  "武曲": "Wu Qu",
  "天梁": "Tian Liang",
  "太阳": "Tai Yang",
  "七杀": "Qi Sha",
  "天机": "Tian Ji",
  "左辅": "Zuo Fu",
  "右弼": "You Bi",
  "文昌": "Wen Chang",
  "文曲": "Wen Qu",
};

/**
 * Get English romanized name for a Chinese star name
 */
export const getEnglishStarName = (chineseName: string): string => {
  return STAR_NAME_TO_ENGLISH[chineseName] || chineseName;
};

/**
 * Map the Da Ming tag label to CycleKey in Chinese.
 */
export const mapDaMingTagToCycleKey = (daMingTag: string): CycleKey | null => {
  // Normalize spaces/case
  const tag = daMingTag.trim();
  if (tag === "Da Ming") return "大命";
  if (tag === "Da Xiong") return "大兄";
  if (tag.startsWith("Da Fu") && tag.includes("大夫")) return "大夫";
  if (tag.startsWith("Da Fu") && tag.includes("大福")) return "大福";
  if (tag.startsWith("Da Fu") && tag.includes("大父")) return "大父";
  if (tag === "Da Zi") return "大子";
  if (tag === "Da Cai") return "大财";
  if (tag === "Da Ji") return "大疾";
  if (tag === "Da Qian") return "大迁";
  if (tag === "Da You") return "大友";
  if (tag === "Da Guan") return "大官";
  if (tag === "Da Tian") return "大田";
  return null;
};

/**
 * Ensure a star name is among the supported primary StarKey values.
 */
const toStarKey = (name: string): StarKey | null => {
  const star = name as StarKey;
  if (DECADE_CYCLE_MEANINGS["大命"][star] !== undefined) {
    return star;
  }
  return null;
};

/**
 * Get ordered candidate star names from a palace: prefer mainStar, then minor, then auxiliary.
 */
const collectPrimaryStarNames = (palace: Palace): string[] => {
  const names: string[] = [];
  const push = (list: ReadonlyArray<Star> | undefined) => {
    if (!list) return;
    for (const s of list) {
      names.push(s.name);
    }
  };
  push(palace.mainStar);
  push(palace.minorStars);
  push(palace.auxiliaryStars);
  return names;
};

export type DaMingStarMeaning = {
  starName: string;
  englishStarName: string;
  paragraphs: ReadonlyArray<string>;
  actionPoints?: ReadonlyArray<string>;
  actionPointsTitle?: string;
};

/**
 * For a specific Da Ming cycle key and a given palace, derive the star-based paragraphs
 * using DECADE_CYCLE_MEANINGS. Returns up to maxStars entries (default 2) to keep UI concise.
 */
export const getDaMingMeaningsForPalace = (
  cycleKey: CycleKey,
  palace: Palace,
  maxStars: number = 2
): ReadonlyArray<DaMingStarMeaning> => {
  const starNames = collectPrimaryStarNames(palace);
  const entries: DaMingStarMeaning[] = [];

  for (const name of starNames) {
    const key = toStarKey(name);
    if (!key) continue;
    const byStar: DecadeStarEntry | undefined = DECADE_CYCLE_MEANINGS[cycleKey][key];
    if (byStar && Array.isArray(byStar.paragraphs) && byStar.paragraphs.length > 0) {
      entries.push({
        starName: name,
        englishStarName: getEnglishStarName(name),
        paragraphs: byStar.paragraphs,
        actionPoints: byStar.action_points,
        actionPointsTitle: byStar.action_points_title,
      });
    }
    if (entries.length >= maxStars) break;
  }

  return entries;
};


