/**
 * Structure Analysis — Speed Player vs Endurance Player Detection
 *
 * Determines a chart's operating structure (Speed or Endurance) by examining
 * the dominance of Northern vs Southern stars in the 命宫/财帛/官禄 triangle
 * (Life, Wealth, Career palaces).
 *
 * Additionally detects named formations within the Speed/Endurance categories
 * and independent special formations.
 *
 * Classification source: Cae Goh "Design Your Destiny" workshop slides.
 *
 * Northern Stars (北斗星) — Authority, aggressive, wealth, goal-oriented:
 *   紫微, 天机, 太阳, 武曲, 廉贞, 贪狼, 巨门, 七杀, 破军
 *
 * Southern Stars (南斗星) — Patient, presence, calm, detail-oriented:
 *   天府, 太阴, 天同, 天相, 天梁
 *
 * Accessory stars (左辅/左輔, 右弼, 文昌, 文曲) are excluded from the
 * Northern/Southern count but are used in Noble Support detection.
 *
 * palaceSource: "natal" uses the natal ChartData directly.
 *               "dayun" is a reserved extension point for future DaYun-overlay
 *               analysis — currently behaves identically to "natal".
 */

import type { ChartData, Palace, Star } from "../types";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type StructureType = "speed" | "endurance";

/** Named formations within the Speed Player category. */
export type SpeedFormationKey =
  | "powerCommander"  // 杀破狼格 — Qi Sha + Po Jun + Tan Lang in 1/5/9 triangle
  | "bigLandlord"     // 日月照壁 — Tai Yang + Tai Yin in 田宅 on Chou branch
  | "riskyTrading";   // default Speed (no named formation matched)

/** Named formations within the Endurance Player category. */
export type EnduranceFormationKey =
  | "tripletalent"       // 三奇嘉会 — Hua Lu + Hua Quan + Hua Ke in 1/5/9 triangle
  | "nobleSupport"       // 辅弼拱主 — Zuo Fu + You Bi in 1/5/9 triangle
  | "wealthSupport"      // 府相朝垣 — Tian Fu + Tian Xiang in wealth/career palaces
  | "wealthStabilization"; // default Endurance (no named formation matched)

/** Independent special formations — not tied to Speed/Endurance classification. */
export type SpecialFormationKey =
  | "steadyPillar"      // 机月同梁 — Tian Ji + Tai Yin + Tian Tong + Tian Liang in triangle
  | "hiddenJade"        // 石中隐玉 — Ju Men in Zi (子) or Wu (午) palace
  | "reversedSunMoon"   // 日月反背 — Tai Yin in Chen (辰) + Tai Yang in Xu (戌)
  | "starlessDestiny";  // 命无正曜 — Life Palace has no main star

/** The Speed or Endurance named formation (Speed/Endurance subtype). */
export type FormationKey = SpeedFormationKey | EnduranceFormationKey;

/** Full result of a structure analysis. */
export interface StructureAnalysisResult {
  /** Whether the chart is predominately Northern (speed) or Southern (endurance). */
  structureType: StructureType;
  /** The specific named formation within the structureType category. */
  formation: FormationKey;
  /** All special formations detected (can be empty, can have multiple). */
  specialFormations: SpecialFormationKey[];
  /** Raw star counts used to derive structureType (for display/debug). */
  northernCount: number;
  southernCount: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Star classification sets
// ─────────────────────────────────────────────────────────────────────────────

/** Northern stars — aggressive, authority, wealth, goal-oriented. */
const NORTHERN_STARS = new Set<string>([
  "紫微", "天机", "太阳", "武曲", "廉贞",
  "贪狼", "巨门", "七杀", "破军",
]);

/** Southern stars — patient, calm, presence, detail-oriented. */
const SOUTHERN_STARS = new Set<string>([
  "天府", "太阴", "天同", "天相", "天梁",
]);

/** Names of the Life/Wealth/Career triangle palaces. */
const TRIANGLE_PALACE_NAMES = ["命宫", "财帛", "官禄"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the Palace object for a given semantic name, or undefined if not found.
 */
function getPalaceByName(palaces: Palace[], name: string): Palace | undefined {
  return palaces.find((p) => p.name === name);
}

/**
 * Returns all main stars across the three triangle palaces (命宫, 财帛, 官禄).
 */
function getTriangleMainStars(palaces: Palace[]): Star[] {
  return TRIANGLE_PALACE_NAMES.flatMap(
    (name) => getPalaceByName(palaces, name)?.mainStar ?? []
  );
}

/**
 * Returns all main stars + auxiliary stars across the triangle palaces.
 * Used for formations that check auxiliary/support stars (e.g. Noble Support).
 */
function getTriangleAllStars(palaces: Palace[]): Star[] {
  return TRIANGLE_PALACE_NAMES.flatMap((name) => {
    const palace = getPalaceByName(palaces, name);
    if (!palace) return [];
    return [...(palace.mainStar ?? []), ...palace.auxiliaryStars];
  });
}

/**
 * Checks whether a star has a specific transformation, handling both traditional
 * (化祿/化權) and simplified (化禄/化权) character variants.
 */
function starHasTransformation(
  star: Star,
  type: "lu" | "quan" | "ke"
): boolean {
  const t = star.transformations;
  if (!t || t.length === 0) return false;
  switch (type) {
    case "lu":   return t.includes("化祿") || (t as string[]).includes("化禄");
    case "quan": return t.includes("化權") || (t as string[]).includes("化权");
    case "ke":   return t.includes("化科");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Formation detectors
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Power Commander (杀破狼格 / Sha Po Lang):
 * Qi Sha (七杀) + Po Jun (破军) + Tan Lang (贪狼) all appear in the
 * 命宫/财帛/官禄 triangle main stars.
 */
function detectPowerCommander(palaces: Palace[]): boolean {
  const mainStarNames = new Set(getTriangleMainStars(palaces).map((s) => s.name));
  return (
    mainStarNames.has("七杀") &&
    mainStarNames.has("破军") &&
    mainStarNames.has("贪狼")
  );
}

/**
 * Big Landlord (日月照壁 / Ri Yue Zhao Bi):
 * Tai Yang (太阳) AND Tai Yin (太阴) both appear as main stars in the Property
 * Palace (田宅), AND that palace's earthly branch is Chou (丑).
 */
function detectBigLandlord(palaces: Palace[]): boolean {
  const propertyPalace = getPalaceByName(palaces, "田宅");
  if (!propertyPalace || propertyPalace.earthlyBranch !== "丑") return false;
  const mainStarNames = new Set(
    (propertyPalace.mainStar ?? []).map((s) => s.name)
  );
  return mainStarNames.has("太阳") && mainStarNames.has("太阴");
}

/**
 * Triple Talent (三奇嘉会 / San Qi Jia Hui):
 * The 命宫/财帛/官禄 triangle must collectively contain stars carrying
 * Hua Lu (化禄), Hua Quan (化权), AND Hua Ke (化科) transformations.
 */
function detectTripleTalent(palaces: Palace[]): boolean {
  const stars = getTriangleMainStars(palaces);
  const hasLu   = stars.some((s) => starHasTransformation(s, "lu"));
  const hasQuan = stars.some((s) => starHasTransformation(s, "quan"));
  const hasKe   = stars.some((s) => starHasTransformation(s, "ke"));
  return hasLu && hasQuan && hasKe;
}

/**
 * Noble Support (辅弼拱主 / Fu Bi Gong Zhu):
 * Both Zuo Fu (左辅/左輔) AND You Bi (右弼) appear in the
 * 命宫/财帛/官禄 triangle (main stars or auxiliary stars).
 */
function detectNobleSupport(palaces: Palace[]): boolean {
  const starNames = new Set(getTriangleAllStars(palaces).map((s) => s.name));
  const hasZuoFu = starNames.has("左辅") || starNames.has("左輔");
  const hasYouBi = starNames.has("右弼");
  return hasZuoFu && hasYouBi;
}

/**
 * Wealth Support (府相朝垣 / Fu Xiang Chao Yuan):
 * The Wealth (财帛) and Career (官禄) palaces together contain both
 * Tian Fu (天府) AND Tian Xiang (天相) as main stars.
 */
function detectWealthSupport(palaces: Palace[]): boolean {
  const wealthAndCareer = ["财帛", "官禄"].flatMap(
    (name) => getPalaceByName(palaces, name)?.mainStar ?? []
  );
  const names = new Set(wealthAndCareer.map((s) => s.name));
  return names.has("天府") && names.has("天相");
}

/**
 * Steady Pillar (机月同梁 / Ji Yue Tong Liang):
 * The triangle (命宫/财帛/官禄) main stars collectively contain all four of:
 * Tian Ji (天机), Tai Yin (太阴), Tian Tong (天同), Tian Liang (天梁).
 */
function detectSteadyPillar(palaces: Palace[]): boolean {
  const names = new Set(getTriangleMainStars(palaces).map((s) => s.name));
  return (
    names.has("天机") &&
    names.has("太阴") &&
    names.has("天同") &&
    names.has("天梁")
  );
}

/**
 * Hidden Jade (石中隐玉 / Shi Zhong Yin Yu):
 * Ju Men (巨门) appears as a main star in a palace whose earthly branch
 * is Zi (子) or Wu (午).
 */
function detectHiddenJade(palaces: Palace[]): boolean {
  return palaces.some((p) => {
    const hasJuMen = (p.mainStar ?? []).some((s) => s.name === "巨门");
    return hasJuMen && (p.earthlyBranch === "子" || p.earthlyBranch === "午");
  });
}

/**
 * Reversed Sun & Moon (日月反背 / Ri Yue Fan Bei):
 * Tai Yin (太阴) is a main star in a palace with earthly branch Chen (辰),
 * AND Tai Yang (太阳) is a main star in a palace with earthly branch Xu (戌).
 */
function detectReversedSunMoon(palaces: Palace[]): boolean {
  const taiYinInChen = palaces.some(
    (p) =>
      p.earthlyBranch === "辰" &&
      (p.mainStar ?? []).some((s) => s.name === "太阴")
  );
  const taiYangInXu = palaces.some(
    (p) =>
      p.earthlyBranch === "戌" &&
      (p.mainStar ?? []).some((s) => s.name === "太阳")
  );
  return taiYinInChen && taiYangInXu;
}

/**
 * Starless Destiny (命无正曜 / Ming Wu Zheng Yao):
 * The Life Palace (命宫) has no main stars.
 */
function detectStarlessDestiny(palaces: Palace[]): boolean {
  const lifePalace = getPalaceByName(palaces, "命宫");
  return !lifePalace?.mainStar || lifePalace.mainStar.length === 0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Main export
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Analyses a ZWDS chart and returns the chart's operating structure type,
 * named formation, and any independent special formations.
 *
 * @param chartData - The calculated chart to analyse.
 * @param palaceSource - Reserved for future DaYun-overlay mode.
 *                       Currently "natal" and "dayun" behave identically.
 */
export function detectStructure(
  chartData: ChartData,
  palaceSource: "natal" | "dayun" = "natal"
): StructureAnalysisResult {
  // palaceSource reserved for future DaYun overlay path
  void palaceSource;

  const { palaces } = chartData;

  // ── Step 1: Northern / Southern star count in triangle ──────────────────

  let northernCount = 0;
  let southernCount = 0;

  for (const name of TRIANGLE_PALACE_NAMES) {
    for (const star of getPalaceByName(palaces, name)?.mainStar ?? []) {
      if (NORTHERN_STARS.has(star.name)) northernCount += 1;
      else if (SOUTHERN_STARS.has(star.name)) southernCount += 1;
    }
  }

  const structureType: StructureType =
    northernCount >= southernCount ? "speed" : "endurance";

  // ── Step 2: Named formation (checked in priority order) ─────────────────

  let formation: FormationKey;

  if (structureType === "speed") {
    if (detectPowerCommander(palaces))   formation = "powerCommander";
    else if (detectBigLandlord(palaces)) formation = "bigLandlord";
    else                                  formation = "riskyTrading";
  } else {
    if (detectTripleTalent(palaces))     formation = "tripletalent";
    else if (detectNobleSupport(palaces)) formation = "nobleSupport";
    else if (detectWealthSupport(palaces)) formation = "wealthSupport";
    else                                   formation = "wealthStabilization";
  }

  // ── Step 3: Special formations (independent) ────────────────────────────

  const specialFormations: SpecialFormationKey[] = [];

  if (detectSteadyPillar(palaces))     specialFormations.push("steadyPillar");
  if (detectHiddenJade(palaces))        specialFormations.push("hiddenJade");
  if (detectReversedSunMoon(palaces))   specialFormations.push("reversedSunMoon");
  if (detectStarlessDestiny(palaces))   specialFormations.push("starlessDestiny");

  return { structureType, formation, specialFormations, northernCount, southernCount };
}
