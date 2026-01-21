import type { ChartData, Palace, Star } from "../types";

export type CareerGroupKey = "architect" | "guardian" | "catalyst" | "anchor";

export type CareerGroupDetail = {
  key: CareerGroupKey;
  label: string;
  stars: string[];
  traits: string[];
  occupations: string[];
};

export type CareerGroupScore = {
  key: CareerGroupKey;
  count: number;
  score: number; // 0–10 coverage score
};

export type CareerPalaceProfile = {
  hasRecognizedStars: boolean;
  usedSpousePalace: boolean;
  careerPalaceStars: string[];
  spousePalaceStars: string[];
  analysisStars: string[];
  groupScores: CareerGroupScore[];
  presentGroups: CareerGroupDetail[];
  missingGroups: CareerGroupDetail[];
};

const CAREER_GROUP_DETAILS: Record<CareerGroupKey, CareerGroupDetail> = {
  architect: {
    key: "architect",
    label: "Architect",
    stars: ["Zi Wei", "Lian Zhen", "Tian Ji", "Tian Liang"],
    traits: ["Organized", "Strategic", "Disciplined", "Dependable", "Calm under pressure", "Long-term oriented"],
    occupations: [
      "Chief Operating Officer",
      "Operations Manager",
      "Strategy Manager",
      "Project Manager",
      "Program Manager",
      "Business Operations Manager",
      "Compliance Manager",
      "Quality Assurance Manager",
      "Human Resources Manager",
      "Business Analyst",
    ],
  },
  guardian: {
    key: "guardian",
    label: "Guardian",
    stars: ["Wu Qu", "Tian Fu", "Tai Yin"],
    traits: ["Careful", "Detail-oriented", "Trustworthy", "Steady", "Risk-aware", "Financially responsible"],
    occupations: [
      "Chief Financial Officer",
      "Finance Manager",
      "Financial Analyst",
      "Accountant",
      "Auditor",
      "Risk Manager",
      "Credit Analyst",
      "Procurement Manager",
      "Treasury Manager",
      "Controller",
    ],
  },
  catalyst: {
    key: "catalyst",
    label: "Catalyst",
    stars: ["Tan Lang", "Ju Men", "Tai Yang", "Qi Sha", "Po Jun"],
    traits: ["Confident", "Persuasive", "Energetic", "Bold", "Proactive", "Resilient"],
    occupations: [
      "Sales Manager",
      "Business Development Manager",
      "Marketing Manager",
      "Growth Manager",
      "Partnerships Manager",
      "Brand Manager",
      "Public Relations Manager",
      "Communications Manager",
      "Account Manager",
      "Customer Acquisition Manager",
    ],
  },
  anchor: {
    key: "anchor",
    label: "Anchor",
    stars: ["Tian Tong", "Tian Xiang", "Zuo Fu", "You Bi", "Wen Qu", "Wen Chang"],
    traits: ["Supportive", "Patient", "Empathetic", "Cooperative", "Reliable", "Service-minded"],
    occupations: [
      "Chief of Staff",
      "Human Resources Manager",
      "People Operations Manager",
      "Customer Success Manager",
      "Client Services Manager",
      "Training Manager",
      "Internal Communications Manager",
      "Executive Assistant",
      "Operations Coordinator",
      "Office Manager",
    ],
  },
};

const STAR_TO_GROUP: Record<string, CareerGroupKey> = {
  // Architect
  "紫微": "architect",
  "廉贞": "architect",
  "天机": "architect",
  "天梁": "architect",
  // Guardian
  "武曲": "guardian",
  "天府": "guardian",
  "太阴": "guardian",
  "太陰": "guardian",
  // Catalyst
  "贪狼": "catalyst",
  "貪狼": "catalyst",
  "巨门": "catalyst",
  "太阳": "catalyst",
  "七杀": "catalyst",
  "七殺": "catalyst",
  "破军": "catalyst",
  // Anchor
  "天同": "anchor",
  "天相": "anchor",
  "左辅": "anchor",
  "左輔": "anchor",
  "右弼": "anchor",
  "文曲": "anchor",
  "文昌": "anchor",
};

const CAREER_PALACE_NAMES = ["官禄", "官祿"];
const SPOUSE_PALACE_NAMES = ["夫妻"];

const CAREER_GROUP_MAX_STARS: Record<CareerGroupKey, number> = {
  architect: CAREER_GROUP_DETAILS.architect.stars.length,
  guardian: CAREER_GROUP_DETAILS.guardian.stars.length,
  catalyst: CAREER_GROUP_DETAILS.catalyst.stars.length,
  anchor: CAREER_GROUP_DETAILS.anchor.stars.length,
};

function clamp0To10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, value));
}

function getPalaceByName(chartData: ChartData, names: readonly string[]): Palace | null {
  const palace = chartData.palaces.find((p) => names.includes(p.name));
  return palace ?? null;
}

function extractStarNames(palace: Palace): string[] {
  const allStars: Star[] = [
    ...(palace.mainStar ?? []),
    ...(palace.bodyStar ? [palace.bodyStar] : []),
    ...(palace.lifeStar ? [palace.lifeStar] : []),
    ...palace.minorStars,
    ...palace.auxiliaryStars,
    ...palace.yearStars,
    ...palace.monthStars,
    ...palace.dayStars,
    ...palace.hourStars,
  ];

  return allStars.map((star) => star.name);
}

function scoreGroupCoverage(count: number, maxStars: number): number {
  if (count <= 0) return 0;
  if (maxStars <= 1) return 10;
  const scaled = 6 + ((count - 1) / (maxStars - 1)) * 4;
  return clamp0To10(Number(scaled.toFixed(1)));
}

export function getCareerGroupDetail(key: CareerGroupKey): CareerGroupDetail {
  return CAREER_GROUP_DETAILS[key];
}

export function getCareerGroupDetails(): CareerGroupDetail[] {
  return Object.values(CAREER_GROUP_DETAILS);
}

export function analyzeCareerPalaceGroups(chartData: ChartData): CareerPalaceProfile {
  const careerPalace = getPalaceByName(chartData, CAREER_PALACE_NAMES);
  const spousePalace = getPalaceByName(chartData, SPOUSE_PALACE_NAMES);

  const careerPalaceStars = careerPalace ? extractStarNames(careerPalace) : [];
  const spousePalaceStars = spousePalace ? extractStarNames(spousePalace) : [];

  const usedSpousePalace = careerPalaceStars.length === 0 && spousePalaceStars.length > 0;
  const analysisStars = usedSpousePalace ? spousePalaceStars : careerPalaceStars;

  const counts: Record<CareerGroupKey, number> = {
    architect: 0,
    guardian: 0,
    catalyst: 0,
    anchor: 0,
  };

  let recognizedCount = 0;
  analysisStars.forEach((name) => {
    const key = STAR_TO_GROUP[name];
    if (!key) return;
    recognizedCount += 1;
    counts[key] += 1;
  });

  const groupScores: CareerGroupScore[] = (Object.keys(counts) as CareerGroupKey[]).map((key) => ({
    key,
    count: counts[key],
    score: scoreGroupCoverage(counts[key], CAREER_GROUP_MAX_STARS[key]),
  }));

  const hasRecognizedStars = recognizedCount > 0;

  const presentGroups = groupScores
    .filter((g) => g.count > 0)
    .map((g) => CAREER_GROUP_DETAILS[g.key]);

  const missingGroups = groupScores
    .filter((g) => g.count === 0)
    .map((g) => CAREER_GROUP_DETAILS[g.key]);

  return {
    hasRecognizedStars,
    usedSpousePalace,
    careerPalaceStars,
    spousePalaceStars,
    analysisStars,
    groupScores,
    presentGroups,
    missingGroups,
  };
}
