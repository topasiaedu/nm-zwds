import type { ChartData, Palace, Star, Transformation } from "../../../../utils/zwds/types";
import type { StarBrief } from "../../../../utils/forecast/starBriefDescriptions";
import {
  PEOPLE_PALACE_ORDER,
  PEOPLE_PALACE_FRAMING,
  PEOPLE_PALACE_PLAYBOOK,
  PEOPLE_PALACE_SHORT_LABELS,
  LU_ACTIVATION_BY_PALACE,
  IDEAL_COLLABORATOR_BY_SYNTHESIS,
  PHASE_PEOPLE_PRIORITY,
  PEOPLE_FOCUS_BY_RANK,
  type PeoplePalaceKey,
} from "../../../../utils/forecast/people/peoplePalaceData";
import { getStarBrief } from "../../content/resolvers";
import { normalizeCatalystKind, getCatalystTileLabel, type CatalystKind } from "../catalystGuidance";
import { getPalaceByName } from "./getPalaceByName";
import { NORTHERN_MAIN_STARS, SOUTHERN_MAIN_STARS, TRANSFORMATION_ENGLISH, PALACE_ENGLISH, PEOPLE_PALACE_COVERS } from "../constants";

/** Lu transformation variants (simplified and traditional). */
const LU_VARIANTS = ["化禄", "化祿"] as const;

/** Returns true for either simplified or traditional Hua Lu. */
export function isLuTransformation(value: string): boolean {
  return (LU_VARIANTS as readonly string[]).includes(value);
}

/**
 * Finds which palace holds natal Hua Lu and which star carries it.
 */
export function findNatalLuTarget(
  chartData: ChartData
): { palaceName: string; starName: string } | null {
  for (const palace of chartData.palaces) {
    for (const star of collectPalaceStars(palace)) {
      if (star.transformations?.some((t) => isLuTransformation(t)) === true) {
        return { palaceName: palace.name, starName: star.name };
      }
    }
  }
  return null;
}

export interface PalaceStarReading {
  starName: string;
  pinyin: string;
  title: string;
  brief: string;
  keywords: [string, string, string];
  role: "north" | "south" | "aux";
  transformations: string[];
  transformationLabels: string[];
}

export interface PalaceTransformationNote {
  starName: string;
  pinyin: string;
  transformation: string;
  englishLabel: string;
}

export interface PeoplePalaceReading {
  palaceKey: PeoplePalaceKey;
  framing: (typeof PEOPLE_PALACE_FRAMING)[PeoplePalaceKey];
  playbook: (typeof PEOPLE_PALACE_PLAYBOOK)[PeoplePalaceKey];
  mainStars: PalaceStarReading[];
  supportingStars: PalaceStarReading[];
  hasMainStars: boolean;
  /** Natal Hua Lu activation lands on this palace (chart-level). */
  luActivationOnPalace: boolean;
  luActivationStarName: string | null;
  luActivationSummary: (typeof LU_ACTIVATION_BY_PALACE)[PeoplePalaceKey] | null;
  /** Stars within this palace that personally carry Hua Lu. */
  starsWithLu: PalaceStarReading[];
  otherTransformations: PalaceTransformationNote[];
}

/** One catalyst tile scoped to a single people palace. */
export interface PalaceActivationTile {
  kind: CatalystKind;
  shortLabel: string;
  headline: string;
  active: boolean;
  starLabel: string | null;
}

/** Compact star chip for palace roster (names only, no teaching copy). */
export interface PalaceStarChip {
  pinyin: string;
  isMain: boolean;
  activationKinds: CatalystKind[];
}

const PALACE_CATALYST_ORDER: CatalystKind[] = ["lu", "quan", "ke", "ji"];

function starActivationKinds(star: PalaceStarReading): CatalystKind[] {
  const kinds: CatalystKind[] = [];
  for (const transformation of star.transformations) {
    const kind = normalizeCatalystKind(transformation);
    if (kind !== null && !kinds.includes(kind)) {
      kinds.push(kind);
    }
  }
  return kinds;
}

function resolvePalaceStarLabel(
  reading: PeoplePalaceReading,
  kind: CatalystKind,
  allStars: PalaceStarReading[],
): string | null {
  if (kind === "lu") {
    if (reading.luActivationOnPalace && reading.luActivationStarName !== null) {
      const match = allStars.find((s) => s.starName === reading.luActivationStarName);
      return match?.pinyin ?? reading.luActivationStarName;
    }
    if (reading.starsWithLu.length > 0) {
      return reading.starsWithLu[0].pinyin;
    }
  }

  for (const star of allStars) {
    if (star.transformations.some((t) => normalizeCatalystKind(t) === kind)) {
      return star.pinyin;
    }
  }

  if (kind === "lu" && reading.luActivationOnPalace) {
    return allStars[0]?.pinyin ?? null;
  }

  return null;
}

/** Builds the four catalyst tiles for one relationship palace. */
export function buildPalaceActivationTiles(reading: PeoplePalaceReading): PalaceActivationTile[] {
  const allStars = [...reading.mainStars, ...reading.supportingStars];

  return PALACE_CATALYST_ORDER.map((kind) => {
    const starLabel = resolvePalaceStarLabel(reading, kind, allStars);
    const labels = getCatalystTileLabel(kind);
    return {
      kind,
      shortLabel: labels.short,
      headline: labels.headline,
      active: starLabel !== null,
      starLabel,
    };
  });
}

/** Star names present in the palace, main stars first. */
export function buildPalaceStarRoster(reading: PeoplePalaceReading): PalaceStarChip[] {
  const main = reading.mainStars.map((star) => ({
    pinyin: star.pinyin,
    isMain: true,
    activationKinds: starActivationKinds(star),
  }));
  const support = reading.supportingStars.slice(0, 4).map((star) => ({
    pinyin: star.pinyin,
    isMain: false,
    activationKinds: starActivationKinds(star),
  }));
  return [...main, ...support];
}

/**
 * Collects every star object placed in a palace (main, body, minor, auxiliary, timed layers).
 */
function collectPalaceStars(palace: Palace): Star[] {
  return [
    ...(palace.mainStar ?? []),
    ...(palace.bodyStar !== undefined ? [palace.bodyStar] : []),
    ...palace.minorStars,
    ...palace.auxiliaryStars,
    ...palace.yearStars,
    ...palace.monthStars,
    ...palace.dayStars,
    ...palace.hourStars,
    ...(palace.lifeStar !== undefined ? [palace.lifeStar] : []),
  ];
}

/**
 * Builds a display reading for one star using star brief data with safe fallbacks.
 */
function buildStarReading(star: Star): PalaceStarReading {
  const brief: StarBrief | null = getStarBrief(star.name);
  const transformations = star.transformations ?? [];
  const transformationLabels = transformations.map(
    (t) => TRANSFORMATION_ENGLISH[t] ?? t
  );

  if (brief !== null) {
    return {
      starName: star.name,
      pinyin: brief.pinyin,
      title: brief.title,
      brief: brief.brief,
      keywords: brief.keywords,
      role: brief.role,
      transformations,
      transformationLabels,
    };
  }

  const role: "north" | "south" | "aux" = NORTHERN_MAIN_STARS.has(star.name)
    ? "north"
    : SOUTHERN_MAIN_STARS.has(star.name)
      ? "south"
      : "aux";

  return {
    starName: star.name,
    pinyin: star.name,
    title: "Supporting Star",
    brief: "This star colours the tone of relationships in this palace.",
    keywords: ["Influence", "Context", "Tone"],
    role,
    transformations,
    transformationLabels,
  };
}

/**
 * Finds which palace holds the natal transformation and which star carries it.
 */
export function findNatalTransformationTarget(
  chartData: ChartData,
  transformation: Transformation
): { palaceName: string; starName: string } | null {
  for (const palace of chartData.palaces) {
    for (const star of collectPalaceStars(palace)) {
      if (star.transformations?.includes(transformation) === true) {
        return { palaceName: palace.name, starName: star.name };
      }
    }
  }
  return null;
}

/**
 * Builds a full reading for one people palace.
 */
function buildPeoplePalaceReading(
  chartData: ChartData,
  palaceKey: PeoplePalaceKey,
  luTarget: { palaceName: string; starName: string } | null
): PeoplePalaceReading {
  const framing = PEOPLE_PALACE_FRAMING[palaceKey];
  const palace = getPalaceByName(chartData.palaces, palaceKey);
  const mainStars = (palace?.mainStar ?? []).map(buildStarReading);
  const supportingStars = palace !== null
    ? collectPalaceStars(palace)
        .filter((s) => !(palace.mainStar ?? []).some((m) => m.name === s.name))
        .map(buildStarReading)
    : [];

  const luActivationOnPalace = luTarget?.palaceName === palaceKey;
  const allReadings = [...mainStars, ...supportingStars];
  const starsWithLu = allReadings.filter((r) =>
    r.transformations.some((t) => isLuTransformation(t))
  );

  const otherTransformations: PalaceTransformationNote[] = [];
  for (const reading of allReadings) {
    for (const t of reading.transformations) {
      if (!isLuTransformation(t)) {
        otherTransformations.push({
          starName: reading.starName,
          pinyin: reading.pinyin,
          transformation: t,
          englishLabel: TRANSFORMATION_ENGLISH[t] ?? t,
        });
      }
    }
  }

  return {
    palaceKey,
    framing,
    playbook: PEOPLE_PALACE_PLAYBOOK[palaceKey],
    mainStars,
    supportingStars,
    hasMainStars: mainStars.length > 0,
    luActivationOnPalace,
    luActivationStarName: luActivationOnPalace ? luTarget?.starName ?? null : null,
    luActivationSummary: luActivationOnPalace ? LU_ACTIVATION_BY_PALACE[palaceKey] : null,
    starsWithLu,
    otherTransformations,
  };
}

/**
 * Analyses all five relationship palaces for Chapter 04.
 */
export function analyzePeoplePalaces(chartData: ChartData): PeoplePalaceReading[] {
  const luTarget = findNatalLuTarget(chartData);

  return PEOPLE_PALACE_ORDER.map((key) =>
    buildPeoplePalaceReading(chartData, key, luTarget)
  );
}

/**
 * Resolves the dominant star-role synthesis key across all five people palaces.
 */
export function resolvePeopleSynthesisKey(
  chartData: ChartData
): "north" | "south" | "aux" | "mixed" {
  const allMainStars: Star[] = PEOPLE_PALACE_ORDER.flatMap((key) => {
    const palace = getPalaceByName(chartData.palaces, key);
    return palace?.mainStar ?? [];
  });

  const northCount = allMainStars.filter((s) => NORTHERN_MAIN_STARS.has(s.name)).length;
  const southCount = allMainStars.filter((s) => SOUTHERN_MAIN_STARS.has(s.name)).length;
  const auxCount = allMainStars.filter(
    (s) => !NORTHERN_MAIN_STARS.has(s.name) && !SOUTHERN_MAIN_STARS.has(s.name)
  ).length;

  const total = northCount + southCount + auxCount;
  if (total === 0) return "mixed";
  if (northCount > 0 && southCount > 0) return "mixed";
  if (northCount >= southCount && northCount >= auxCount && northCount > 0) return "north";
  if (southCount > northCount && southCount >= auxCount) return "south";
  if (auxCount > 0) return "aux";
  return "mixed";
}

/** Data for one pill in the people-palace selector grid. */
export interface PeoplePalacePillData {
  palaceKey: PeoplePalaceKey;
  shortLabel: string;
  mainStarLabel: string;
  hasLu: boolean;
  hasJi: boolean;
  activationCount: number;
}

/** Catalyst presence scoped to the five relationship palaces. */
export interface PeopleCatalystFlags {
  lu: boolean;
  quan: boolean;
  ke: boolean;
  ji: boolean;
}

/** Role distribution across main stars in the five people palaces. */
export interface PeopleRoleBalance {
  northPct: number;
  southPct: number;
  auxPct: number;
}

/** Chapter-level derived stats for the people intelligence section. */
export interface PeopleChapterStats {
  catalysts: PeopleCatalystFlags;
  roleBalance: PeopleRoleBalance;
  luTargetPalace: PeoplePalaceKey | null;
  luTargetStar: string | null;
  luTargetLabel: string | null;
}

function palaceKeyFromName(name: string): PeoplePalaceKey | null {
  if ((PEOPLE_PALACE_ORDER as readonly string[]).includes(name)) {
    return name as PeoplePalaceKey;
  }
  return null;
}

function collectStarsInPeoplePalaces(chartData: ChartData): Star[] {
  return PEOPLE_PALACE_ORDER.flatMap((key) => {
    const palace = getPalaceByName(chartData.palaces, key);
    return palace !== null ? collectPalaceStars(palace) : [];
  });
}

/**
 * Builds catalyst flags from transformations present in the five people palaces.
 */
export function analyzePeopleCatalysts(chartData: ChartData): PeopleCatalystFlags {
  const stars = collectStarsInPeoplePalaces(chartData);
  const has = (variants: string[]): boolean =>
    stars.some((s) => s.transformations?.some((t) => variants.includes(t)) === true);

  return {
    lu: has(["化禄", "化祿"]),
    quan: has(["化权", "化權"]),
    ke: has(["化科"]),
    ji: has(["化忌"]),
  };
}

/**
 * Computes north / south / aux percentages from main stars in people palaces.
 */
export function analyzePeopleRoleBalance(chartData: ChartData): PeopleRoleBalance {
  const mainStars = PEOPLE_PALACE_ORDER.flatMap((key) => {
    const palace = getPalaceByName(chartData.palaces, key);
    return palace?.mainStar ?? [];
  });

  let north = mainStars.filter((s) => NORTHERN_MAIN_STARS.has(s.name)).length;
  let south = mainStars.filter((s) => SOUTHERN_MAIN_STARS.has(s.name)).length;
  let aux = mainStars.filter(
    (s) => !NORTHERN_MAIN_STARS.has(s.name) && !SOUTHERN_MAIN_STARS.has(s.name)
  ).length;

  north += 1;
  south += 1;
  aux += 1;
  const total = north + south + aux;

  return {
    northPct: Math.round((north / total) * 100),
    southPct: Math.round((south / total) * 100),
    auxPct: Math.round((aux / total) * 100),
  };
}

/**
 * Builds chapter-level stats bundle.
 */
export function analyzePeopleChapterStats(chartData: ChartData): PeopleChapterStats {
  const luTarget = findNatalLuTarget(chartData);
  const palaceKey = luTarget !== null ? palaceKeyFromName(luTarget.palaceName) : null;

  return {
    catalysts: analyzePeopleCatalysts(chartData),
    roleBalance: analyzePeopleRoleBalance(chartData),
    luTargetPalace: palaceKey,
    luTargetStar: luTarget?.starName ?? null,
    luTargetLabel: palaceKey !== null ? (PALACE_ENGLISH[palaceKey] ?? PEOPLE_PALACE_SHORT_LABELS[palaceKey]) : null,
  };
}

/**
 * Builds pill data for the interactive people-palace grid.
 */
export function buildPeoplePalacePills(chartData: ChartData): PeoplePalacePillData[] {
  return PEOPLE_PALACE_ORDER.map((palaceKey) => {
    const palace = getPalaceByName(chartData.palaces, palaceKey);
    const mainStars = palace?.mainStar ?? [];
    const allStars = palace !== null ? collectPalaceStars(palace) : [];
    const firstMain = mainStars[0];
    const brief = firstMain !== undefined ? getStarBrief(firstMain.name) : null;
    const mainStarLabel = brief?.pinyin ?? (firstMain !== undefined ? firstMain.name : "Open");

    const hasLu = allStars.some((s) => s.transformations?.some((t) => isLuTransformation(t)) === true);
    const hasJi = allStars.some((s) => s.transformations?.includes("化忌") === true);
    const activationCount = allStars.reduce(
      (sum, s) => sum + (s.transformations?.length ?? 0),
      0
    );

    return {
      palaceKey,
      shortLabel: PEOPLE_PALACE_SHORT_LABELS[palaceKey],
      mainStarLabel,
      hasLu,
      hasJi,
      activationCount,
    };
  });
}

export type RelationshipSignalTone = "resource" | "authority" | "reputation" | "friction" | "stable";

/** One row in the business-owner relationship snapshot table. */
export interface PeopleRelationshipSnapshotRow {
  palaceKey: PeoplePalaceKey;
  palaceLabel: string;
  covers: string;
  leadStar: string;
  leadTrait: string;
  signal: RelationshipSignalTone;
  signalLabel: string;
  bottomLine: string;
}

function resolveRelationshipSignal(
  reading: PeoplePalaceReading
): { signal: RelationshipSignalTone; signalLabel: string } {
  const allStars = [...reading.mainStars, ...reading.supportingStars];
  const hasLu = reading.luActivationOnPalace || reading.starsWithLu.length > 0;
  const hasQuan = allStars.some((s) => s.transformations.includes("化权") || s.transformations.includes("化權"));
  const hasKe = allStars.some((s) => s.transformations.includes("化科"));

  if (hasLu) return { signal: "resource", signalLabel: "Resource opening" };
  if (hasQuan) return { signal: "authority", signalLabel: "Authority active" };
  if (hasKe) return { signal: "reputation", signalLabel: "Reputation boost" };
  if (reading.mainStars.length >= 2) return { signal: "stable", signalLabel: "Strong placement" };
  if (reading.hasMainStars) return { signal: "stable", signalLabel: "Stable bond" };
  return { signal: "stable", signalLabel: "Adaptive bond" };
}

/** Display label for the lead star on priority bars (never chart-reading jargon). */
export function resolveLeadStarLabel(reading: PeoplePalaceReading): string {
  const lead = reading.mainStars[0];
  if (lead !== undefined) return lead.pinyin;
  const support = reading.supportingStars[0];
  if (support !== undefined) return support.pinyin;
  return "Flexible";
}

/** Personalized headline and star-derived directives for palace briefings. */
export interface PeoplePalaceBriefingInsights {
  headline: string;
  operatingDirectives: string[];
}

const TRANSFORMATION_PEOPLE_HINT: Record<string, string> = {
  "化禄": "{star} opens resource flow here. Track reciprocity so generosity stays mutual.",
  "化祿": "{star} opens resource flow here. Track reciprocity so generosity stays mutual.",
  "化权": "{star} pushes for control in this bond. Name decision rights before conflict.",
  "化權": "{star} pushes for control in this bond. Name decision rights before conflict.",
  "化科": "{star} adds reputation leverage. Protect your word in public-facing commitments.",
  "化忌": "Friction clusters around {star}. Tighten contracts and reduce unspoken assumptions.",
};

/**
 * Builds a personalized briefing headline and operating directives from chart data.
 */
export function buildPalaceBriefingInsights(reading: PeoplePalaceReading): PeoplePalaceBriefingInsights {
  const { framing, mainStars, otherTransformations, hasMainStars } = reading;

  if (!hasMainStars) {
    return {
      headline: framing.emptyPalaceGuidance,
      operatingDirectives: [framing.bottomLine],
    };
  }

  const directives: string[] = [];
  const lead = mainStars[0];
  directives.push(`${lead.pinyin} (${lead.title}): ${lead.brief}`);

  if (mainStars.length > 1) {
    const second = mainStars[1];
    directives.push(
      `${second.pinyin} adds ${second.keywords.join(", ").toLowerCase()}: ${second.brief}`
    );
  } else if (reading.supportingStars.length > 0) {
    const support = reading.supportingStars[0];
    directives.push(`${support.pinyin} colours the tone: ${support.brief}`);
  }

  for (const note of otherTransformations.slice(0, 2)) {
    const template = TRANSFORMATION_PEOPLE_HINT[note.transformation];
    if (template !== undefined) {
      directives.push(template.replace("{star}", note.pinyin));
    }
  }

  if (
    reading.luActivationOnPalace &&
    reading.luActivationSummary !== null &&
    !directives.some((d) => d.includes(reading.luActivationSummary?.practicalTip ?? ""))
  ) {
    directives.push(reading.luActivationSummary.practicalTip);
  }

  const headline = `${lead.pinyin} shapes ${framing.strategicRole.toLowerCase()}. ${framing.bottomLine}`;

  return {
    headline,
    operatingDirectives: directives.slice(0, 2),
  };
}

/**
 * Builds the at-a-glance relationship snapshot for business owners.
 */
export function buildPeopleRelationshipSnapshot(
  readings: PeoplePalaceReading[]
): PeopleRelationshipSnapshotRow[] {
  return readings.map((reading) => {
    const lead = reading.mainStars[0];
    const { signal, signalLabel } = resolveRelationshipSignal(reading);
    return {
      palaceKey: reading.palaceKey,
      palaceLabel: PALACE_ENGLISH[reading.palaceKey] ?? reading.framing.displayLabel,
      covers: PEOPLE_PALACE_COVERS[reading.palaceKey] ?? "",
      leadStar: resolveLeadStarLabel(reading),
      leadTrait: lead?.keywords[0] ?? "Adaptive",
      signal,
      signalLabel,
      bottomLine: reading.framing.bottomLine,
    };
  });
}

/** Highlights for the dashboard callouts with full-sentence context. */
export function buildPeopleSnapshotHighlights(
  readings: PeoplePalaceReading[],
  luTargetPalace: PeoplePalaceKey | null
): {
  resourcePalace: string | null;
  resourceContext: string | null;
  boundaryPalaces: string[];
  boundaryContext: string | null;
} {
  const resourcePalace =
    luTargetPalace !== null ? (PALACE_ENGLISH[luTargetPalace] ?? null) : null;
  const resourceReading =
    luTargetPalace !== null ? readings.find((r) => r.palaceKey === luTargetPalace) : undefined;
  const resourceContext =
    resourcePalace !== null &&
    resourceReading !== undefined &&
    resourceReading.luActivationSummary !== null
      ? resourceReading.luActivationSummary.meaning
      : resourcePalace !== null
        ? `Natural support and opportunity concentrate through ${resourcePalace}.`
        : null;

  const boundaryReadings = readings.filter((r) =>
    [...r.mainStars, ...r.supportingStars].some((s) => s.transformations.includes("化忌"))
  );
  const boundaryPalaces = boundaryReadings.map(
    (r) => PALACE_ENGLISH[r.palaceKey] ?? r.framing.displayLabel
  );
  const boundaryContext =
    boundaryPalaces.length > 0
      ? `These bonds benefit from clearer boundaries and structure: ${boundaryPalaces.join(", ")}. ` +
        "This is an adjustment area, not a dead end. Use the playbook below to tighten how you show up."
      : null;

  return { resourcePalace, resourceContext, boundaryPalaces, boundaryContext };
}

/** Priority bar row for the relationship dashboard. */
export interface PeoplePriorityBarRow {
  palaceKey: PeoplePalaceKey;
  palaceLabel: string;
  covers: string;
  score: number;
  rank: number;
  isPrimary: boolean;
  signal: RelationshipSignalTone;
  signalLabel: string;
  leadStar: string;
  /** Plain-English factors that shaped this score. */
  scoreSummary: string;
  /** Growth-oriented label for this rank (not pass/fail). */
  focusLabel: string;
}

/** One entry in the people risk register (reserved for future use). */
export interface PeopleRiskEntry {
  palaceKey: PeoplePalaceKey;
  palaceLabel: string;
  risk: string;
  mitigation: string;
}

/** Cross-palace strategic bundle for Chapter 04. */
export interface PeopleCrossPalaceStrategy {
  idealCollaborator: string;
  cyclePriority: { palaceLabel: string; headline: string; action: string } | null;
  primaryPalaceLabel: string;
}

interface PalaceRawScore {
  palaceKey: PeoplePalaceKey;
  raw: number;
  summary: string;
  mainCount: number;
  hasLuTarget: boolean;
}

const SCORE_FLOOR = 60;
const SCORE_CEILING = 100;

/** Maps a main star name to a stable weight for score differentiation. */
const MAIN_STAR_WEIGHT: Record<string, number> = {
  "紫微": 24, "天机": 20, "太阳": 22, "武曲": 21, "天同": 18, "廉贞": 19,
  "天府": 23, "太阴": 17, "贪狼": 20, "巨门": 16, "天相": 19, "天梁": 18,
  "七杀": 21, "破军": 20,
};

function starWeight(star: Star, isMain: boolean): number {
  if (isMain) {
    return MAIN_STAR_WEIGHT[star.name] ?? 15;
  }
  return 3;
}

function transformationBonus(transformations: string[] | undefined): number {
  if (transformations === undefined || transformations.length === 0) return 0;
  let bonus = 0;
  for (const t of transformations) {
    if (isLuTransformation(t)) bonus += 11;
    else if (t === "化权" || t === "化權") bonus += 7;
    else if (t === "化科") bonus += 5;
    else if (t === "化忌") bonus -= 9;
  }
  return bonus;
}

function computePalaceRawScore(
  chartData: ChartData,
  palaceKey: PeoplePalaceKey,
  luTargetPalace: PeoplePalaceKey | null
): PalaceRawScore {
  const palace = getPalaceByName(chartData.palaces, palaceKey);
  if (palace === null) {
    return {
      palaceKey,
      raw: 12,
      summary: "Supporting dynamics shape this bond",
      mainCount: 0,
      hasLuTarget: false,
    };
  }

  const mainStars = palace.mainStar ?? [];
  const allStars = collectPalaceStars(palace);
  const mainNames = new Set(mainStars.map((s) => s.name));

  let raw = 0;
  const parts: string[] = [];

  for (const star of mainStars) {
    raw += starWeight(star, true);
    const pinyin = getStarBrief(star.name)?.pinyin ?? star.name;
    parts.push(`${pinyin} leads this palace`);
  }

  for (const star of allStars) {
    if (mainNames.has(star.name)) continue;
    raw += starWeight(star, false);
  }

  let transTotal = 0;
  for (const star of allStars) {
    transTotal += transformationBonus(star.transformations);
  }
  raw += transTotal;
  if (transTotal > 0) {
    parts.push("extra chart support in this bond");
  }

  const hasLuTarget = luTargetPalace === palaceKey;
  if (hasLuTarget) {
    raw += 10;
    parts.push("strongest resource opening in your chart");
  }

  const summary =
    parts.length > 0
      ? parts.slice(0, 2).join("; ")
      : "Supporting stars shape this bond";

  return {
    palaceKey,
    raw,
    summary,
    mainCount: mainStars.length,
    hasLuTarget,
  };
}

function normalizePalaceScores(rows: PalaceRawScore[]): Map<PeoplePalaceKey, number> {
  const sorted = [...rows].sort((a, b) => {
    if (b.raw !== a.raw) return b.raw - a.raw;
    if (b.mainCount !== a.mainCount) return b.mainCount - a.mainCount;
    if (a.hasLuTarget !== b.hasLuTarget) return a.hasLuTarget ? -1 : 1;
    return PEOPLE_PALACE_ORDER.indexOf(a.palaceKey) - PEOPLE_PALACE_ORDER.indexOf(b.palaceKey);
  });

  const min = Math.min(...rows.map((r) => r.raw));
  const max = Math.max(...rows.map((r) => r.raw));
  const spread = max - min;
  const result = new Map<PeoplePalaceKey, number>();

  if (spread <= 0.001) {
    sorted.forEach((row, idx) => {
      result.set(row.palaceKey, SCORE_CEILING - idx * 10);
    });
    return result;
  }

  for (const row of rows) {
    const normalized = Math.round(
      SCORE_FLOOR + ((row.raw - min) / spread) * (SCORE_CEILING - SCORE_FLOOR)
    );
    result.set(row.palaceKey, normalized);
  }
  return result;
}

/**
 * Computes a differentiated priority score (60 to 100) from stars and activations.
 */
export function computePalacePriorityScore(
  chartData: ChartData,
  palaceKey: PeoplePalaceKey,
  luTargetPalace: PeoplePalaceKey | null
): number {
  const rows = PEOPLE_PALACE_ORDER.map((key) =>
    computePalaceRawScore(chartData, key, luTargetPalace)
  );
  const normalized = normalizePalaceScores(rows);
  return normalized.get(palaceKey) ?? SCORE_FLOOR;
}

/**
 * Builds ranked priority bars for the five relationship palaces (sorted highest first).
 */
export function buildPeoplePriorityBars(
  chartData: ChartData,
  readings: PeoplePalaceReading[],
  luTargetPalace: PeoplePalaceKey | null
): PeoplePriorityBarRow[] {
  const rawRows = PEOPLE_PALACE_ORDER.map((key) =>
    computePalaceRawScore(chartData, key, luTargetPalace)
  );
  const normalized = normalizePalaceScores(rawRows);

  const scored = readings.map((reading) => {
    const { signal, signalLabel } = resolveRelationshipSignal(reading);
    const raw = rawRows.find((r) => r.palaceKey === reading.palaceKey);
    return {
      palaceKey: reading.palaceKey,
      palaceLabel: PALACE_ENGLISH[reading.palaceKey] ?? reading.framing.displayLabel,
      covers: PEOPLE_PALACE_COVERS[reading.palaceKey] ?? "",
      score: normalized.get(reading.palaceKey) ?? 42,
      rank: 0,
      isPrimary: false,
      signal,
      signalLabel,
      leadStar: resolveLeadStarLabel(reading),
      scoreSummary: raw?.summary ?? "",
      focusLabel: "Build next",
    };
  });

  const sorted = [...scored].sort((a, b) => b.score - a.score);
  sorted.forEach((row, idx) => {
    row.rank = idx + 1;
    row.isPrimary = idx === 0;
    row.focusLabel = PEOPLE_FOCUS_BY_RANK[row.rank] ?? "Build next";
  });

  return sorted;
}

/**
 * Builds cross-palace strategy: collaborator profile, cycle priority, risk register.
 */
export function buildPeopleCrossPalaceStrategy(
  chartData: ChartData,
  readings: PeoplePalaceReading[],
  seasonKey: string | undefined
): PeopleCrossPalaceStrategy {
  const luTarget = findNatalLuTarget(chartData);
  const luTargetPalace = luTarget !== null ? palaceKeyFromName(luTarget.palaceName) : null;
  const synthesisKey = resolvePeopleSynthesisKey(chartData);
  const priorityBars = buildPeoplePriorityBars(chartData, readings, luTargetPalace);
  const primary = priorityBars[0];
  const phaseConfig =
    seasonKey !== undefined ? PHASE_PEOPLE_PRIORITY[seasonKey] : undefined;
  const cyclePriority =
    phaseConfig !== undefined
      ? {
          palaceLabel: PALACE_ENGLISH[phaseConfig.palaceKey] ?? phaseConfig.palaceKey,
          headline: phaseConfig.headline,
          action: phaseConfig.action,
        }
      : null;

  let idealCollaborator = IDEAL_COLLABORATOR_BY_SYNTHESIS[synthesisKey];

  return {
    idealCollaborator,
    cyclePriority,
    primaryPalaceLabel: primary?.palaceLabel ?? "Siblings Palace",
  };
}

/** Compact transformation tile for the dashboard. */
export interface PeopleTransformationTile {
  key: "lu" | "quan" | "ke";
  label: string;
  businessLabel: string;
  active: boolean;
  palaceLabel: string | null;
}

/**
 * Builds positive transformation tiles (Resource, Authority, Reputation) for people palaces.
 * Boundary friction is surfaced once in the dashboard callout, not repeated here.
 */
export function buildPeopleTransformationTiles(chartData: ChartData): PeopleTransformationTile[] {
  const configs: Array<{
    key: PeopleTransformationTile["key"];
    label: string;
    businessLabel: string;
    variants: string[];
  }> = [
    { key: "lu", label: "Hua Lu", businessLabel: "Resource", variants: ["化禄", "化祿"] },
    { key: "quan", label: "Hua Quan", businessLabel: "Authority", variants: ["化权", "化權"] },
    { key: "ke", label: "Hua Ke", businessLabel: "Reputation", variants: ["化科"] },
  ];

  return configs.map(({ key, label, businessLabel, variants }) => {
    let palaceLabel: string | null = null;
    for (const palaceKey of PEOPLE_PALACE_ORDER) {
      const palace = getPalaceByName(chartData.palaces, palaceKey);
      if (palace === null) continue;
      const hit = collectPalaceStars(palace).some((s) =>
        s.transformations?.some((t) => variants.includes(t)) === true
      );
      if (hit) {
        palaceLabel = PALACE_ENGLISH[palaceKey] ?? palaceKey;
        break;
      }
    }
    return {
      key,
      label,
      businessLabel,
      active: palaceLabel !== null,
      palaceLabel,
    };
  });
}
