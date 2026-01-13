/**
 * Founder Timing Decision System Report — Section 03: Talent Strategy
 *
 * Renders 4 data-driven charts:
 * 1) Ideal Team Composition Radar
 * 2) Hiring Timeline (3-year horizontal Gantt-style)
 * 3) Leadership Style Quadrant (Founder + role archetypes)
 * 4) Role Priority Matrix (Heatmap grid)
 *
 * Data derivation notes:
 * - All scoring is derived deterministically from the provided `ChartData`.
 * - The radar represents **hiring priority** (bigger gap = higher priority).
 */
import React, { useCallback, useMemo, useRef, useState } from "react";
import {
  CartesianGrid,
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { ChartData, Palace, Star } from "../../utils/zwds/types";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import {
  WEALTH_CODE_LABELS,
  WEALTH_CODE_SHORT_LABELS,
  type WealthCodeKey,
} from "../../utils/zwds/analysis_constants/wealth_code_mapping";
import { getAllNoblemanTypes } from "../../utils/nobleman/profileMatcher";
import type { NoblemanType } from "../../types/nobleman";
import { NOBLEMAN_PROFILES } from "../../constants/noblemanProfiles";

/**
 * Talent strategy role axes used in the radar chart.
 */
type TalentRoleAxis =
  | "Strategist"
  | "Executor"
  | "Creative"
  | "Analyst"
  | "Salesperson"
  | "Operations"
  | "Finance"
  | "People Ops";

/**
 * Radar dataset row.
 */
type RadarDatum = {
  role: TalentRoleAxis;
  icon: string;
  /** Hiring priority (0–10). Higher score = higher priority. */
  ideal: number;
};

/**
 * A single hiring timeline row representing a role over a 36-month window.
 */
type TimelineDatum = {
  /** Stable role ID used for heatmap linkage. */
  id: HeatmapRole;
  role: string;
  priorityLabel: "P1" | "P2" | "P3";
  /** Transparent offset (months) for the “start looking” range. */
  lookStart: number;
  /** Duration (months) for the “start looking” range. */
  lookDuration: number;
  /** Transparent offset (months) for the “hire” range. */
  hireStart: number;
  /** Duration (months) for the “hire” range. */
  hireDuration: number;
  /** Tooltip explanation. */
  why: string;
};

/**
 * Scatter point for the leadership quadrant.
 */
type QuadrantPoint = {
  id: string;
  label: string;
  category: "Founder" | "Operations" | "Finance" | "Growth" | "Product" | "Tech";
  /** -10 (Directive) … +10 (Collaborative) */
  x: number;
  /** -10 (Strategic) … +10 (Operational) */
  y: number;
  /** Bubble size hint. */
  z: number;
  /** Tooltip detail. */
  detail: string;
  /**
   * Optional styling hooks (used primarily for the founder dot so it can match Wealth Code colors).
   * Recharts reads `fill` and `stroke` from the `<Scatter />` props; we store them here to keep the
   * quadrant-building logic self-contained.
   */
  fill?: string;
  stroke?: string;
  /**
   * Optional Wealth Code context (founder dot only).
   * This allows the tooltip + explanation cards to reference Section 01 consistently.
   */
  wealthCodeKey?: WealthCodeKey;
  wealthCodeLabel?: string;
  wealthCodeShortLabel?: string;
  leadershipStyleSummary?: string;
  /** Secondary nudge from Life + Career palaces (scaled into +/- 2 range). */
  lifeCareerNudge?: { xAdj: number; yAdj: number };
};

/**
 * Heatmap matrix types.
 */
type HeatmapRole = "CEO" | "COO" | "CFO" | "CMO" | "CPO" | "CTO";
type HeatmapCriterion = "Culture Fit" | "Skill Fit" | "Timing Fit";

type HeatmapCell = {
  role: HeatmapRole;
  criterion: HeatmapCriterion;
  score: number; // 0–10
  explanation: string;
};

type HeatmapTooltipState = {
  role: HeatmapRole;
  criterion: HeatmapCriterion;
  score: number; // 0–10
  /** Tooltip coords relative to the heatmap container. */
  x: number;
  y: number;
};

/**
 * Consistent axis definitions + icons.
 * Requirement calls out adding role icons/emojis.
 */
const ROLE_AXES: ReadonlyArray<{ role: TalentRoleAxis; icon: string }> = [
  { role: "Strategist", icon: "💼" },
  { role: "Executor", icon: "⚙️" },
  { role: "Creative", icon: "🎨" },
  { role: "Analyst", icon: "📊" },
  { role: "Salesperson", icon: "🧲" },
  { role: "Operations", icon: "🏗️" },
  { role: "Finance", icon: "💰" },
  { role: "People Ops", icon: "🧑‍🤝‍🧑" },
];

/**
 * Generic type guard for removing null/undefined from arrays.
 */
function isNonNull<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Safe clamp for a 0–10 score.
 */
function clamp0To10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, value));
}

/**
 * Safe clamp for a -10..10 axis value.
 */
function clampMinus10To10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-10, Math.min(10, value));
}

/**
 * Safe clamp for a -2..2 modifier value.
 */
function clampMinus2To2(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-2, Math.min(2, value));
}

/**
 * Extract star names from a palace with strong type guarantees.
 */
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

/**
 * Find a palace by Chinese name(s). Returns null if not found.
 */
function getPalaceByName(chartData: ChartData, names: readonly string[]): Palace | null {
  const palace = chartData.palaces.find((p) => names.includes(p.name));
  return palace ?? null;
}

/**
 * Find a palace by palace number (1–12). Returns null if not found.
 */
function getPalaceByNumber(chartData: ChartData, palaceNumber: number): Palace | null {
  const palace = chartData.palaces.find((p) => p.number === palaceNumber);
  return palace ?? null;
}

/**
 * Count nobleman types with a simple weighting:
 * - Main star matches count slightly higher than auxiliary matches.
 */
function getNoblemanTypeCounts(palace: Palace): Record<NoblemanType, number> {
  const all = getAllNoblemanTypes(palace);

  const counts: Record<NoblemanType, number> = {
    older_female: 0,
    male: 0,
    stable_resource: 0,
    younger_junior: 0,
    same_generation: 0,
    authority_high_status: 0,
    practical_leader: 0,
    bold_aggressive: 0,
    charismatic_expressive: 0,
    refined_educated: 0,
  };

  for (const t of all.mainStarTypes) {
    counts[t] += 2;
  }
  for (const t of all.auxiliaryStarTypes) {
    counts[t] += 1;
  }
  return counts;
}

/**
 * Internal role dimension accumulator.
 */
type RoleDimensionScores = Record<TalentRoleAxis, number>;

/**
 * Initialize role dimension scores.
 */
function createEmptyDimensionScores(): RoleDimensionScores {
  return {
    Strategist: 0,
    Executor: 0,
    Creative: 0,
    Analyst: 0,
    Salesperson: 0,
    Operations: 0,
    Finance: 0,
    "People Ops": 0,
  };
}

/**
 * Apply nobleman-type-to-role weights based on the requested mapping.
 *
 * Mapping alignment:
 * - Authority Figure → CFO/COO (operations/finance leadership)
 * - Strategist → COO/CPO (planning)
 * - Execution Doer → Ops execution
 * - Innovator → CTO/Creative
 * - Connector → CMO/Sales
 * - Growth Partner → Business Development
 */
function applyNoblemanTypeWeights(
  scores: RoleDimensionScores,
  type: NoblemanType,
  weight: number
): void {
  const w = Math.max(0, weight);

  switch (type) {
    case "authority_high_status": {
      scores.Strategist += 2 * w;
      scores.Operations += 2 * w;
      scores.Finance += 2 * w;
      scores["People Ops"] += 1 * w;
      return;
    }
    case "refined_educated": {
      scores.Strategist += 3 * w;
      scores.Analyst += 2 * w;
      scores.Creative += 1 * w;
      return;
    }
    case "practical_leader": {
      scores.Executor += 3 * w;
      scores.Operations += 3 * w;
      scores.Finance += 2 * w;
      return;
    }
    case "charismatic_expressive": {
      scores.Salesperson += 3 * w;
      scores.Creative += 2 * w;
      scores.Strategist += 1 * w;
      return;
    }
    case "same_generation": {
      scores["People Ops"] += 2 * w;
      scores.Salesperson += 1 * w;
      scores.Strategist += 1 * w;
      return;
    }
    case "younger_junior": {
      scores.Creative += 2 * w;
      scores.Analyst += 1 * w;
      scores.Strategist += 1 * w;
      return;
    }
    case "stable_resource": {
      scores.Operations += 2 * w;
      scores.Finance += 2 * w;
      scores.Executor += 1 * w;
      return;
    }
    case "bold_aggressive": {
      scores.Executor += 2 * w;
      scores.Salesperson += 1 * w;
      scores.Creative += 1 * w;
      return;
    }
    case "older_female": {
      scores["People Ops"] += 2 * w;
      scores.Analyst += 1 * w;
      return;
    }
    case "male": {
      scores.Executor += 1 * w;
      scores.Salesperson += 1 * w;
      scores.Strategist += 1 * w;
      return;
    }
    default: {
      // Exhaustiveness guard (should never happen).
      return;
    }
  }
}

/**
 * Convert raw weighted dimension score into a 0–10 scale.
 *
 * We use a soft normalization so typical charts produce variation without extreme saturation.
 */
function normalizeToTen(raw: number, baseline: number): number {
  const safeBaseline = baseline > 0 ? baseline : 1;
  const value = (raw / safeBaseline) * 10;
  return clamp0To10(Number(value.toFixed(1)));
}

/**
 * Compute leadership style coordinates from Life + Career palace stars.
 *
 * X: Directive (left, -10) ↔ Collaborative (right, +10)
 * Y: Strategic (bottom, -10) ↔ Operational (top, +10)
 *
 * Signals (as required):
 * - Directive: TianFu/TianXiang (天府/天相)
 * - Collaborative: TanLang/WenChang (貪狼/文昌)
 * - Strategic: ZiWei/QiSha (紫微/七殺)
 * - Operational: TianTong/TaiYin (天同/太陰)
 */
function computeLeadershipPoint(starNames: string[]): { x: number; y: number; why: string } {
  const directiveSignals = ["天府", "天相"];
  const collaborativeSignals = ["貪狼", "贪狼", "文昌"];
  const strategicSignals = ["紫微", "七殺", "七杀"];
  const operationalSignals = ["天同", "太陰", "太阴"];

  const countMatches = (signals: readonly string[]): number => {
    let count = 0;
    for (const s of signals) {
      count += starNames.filter((n) => n === s).length;
    }
    return count;
  };

  const directive = countMatches(directiveSignals);
  const collaborative = countMatches(collaborativeSignals);
  const strategic = countMatches(strategicSignals);
  const operational = countMatches(operationalSignals);

  // Scale into -10..10 using a small multiplier to avoid over-saturation.
  const xRaw = (collaborative - directive) * 4;
  const yRaw = (operational - strategic) * 4;

  const x = clamp0To10(Math.abs(xRaw)) * (xRaw >= 0 ? 1 : -1);
  const y = clamp0To10(Math.abs(yRaw)) * (yRaw >= 0 ? 1 : -1);

  const whyParts: string[] = [];
  if (directive > 0) {
    whyParts.push(`Directive signals (天府/天相): ${directive}`);
  }
  if (collaborative > 0) {
    whyParts.push(`Collaborative signals (貪狼/文昌): ${collaborative}`);
  }
  if (strategic > 0) {
    whyParts.push(`Strategic signals (紫微/七殺): ${strategic}`);
  }
  if (operational > 0) {
    whyParts.push(`Operational signals (天同/太陰): ${operational}`);
  }

  return {
    x,
    y,
    why: whyParts.length > 0 ? whyParts.join(" · ") : "No strong leadership signals detected; using neutral center.",
  };
}

/**
 * Wealth Code -> Leadership style mapping used for the founder dot in the quadrant chart.
 *
 * Requirements:
 * - Use Wealth Code as PRIMARY positioning factor
 * - Use Life/Career palaces as SECONDARY modifiers (+/-2 points adjustment)
 * - Color code founder dot using the same palette as Section 01 (Wealth Code DNA)
 */
type WealthLeadershipMapping = {
  key: WealthCodeKey;
  shortLabel: string;
  label: string;
  /** Base quadrant coordinate (primary driver). */
  base: { x: number; y: number };
  /** Human-readable leadership pairing. */
  style: { xLabel: "Directive" | "Collaborative"; yLabel: "Strategic" | "Operational" };
  /** Visual styling for the founder dot. */
  color: { fill: string; stroke: string };
};

/**
 * Section 01 Wealth Code palette (must match `src/components/analysis_v2/WealthCode.tsx`).
 * We keep this local (instead of importing from the component) to avoid cross-layer coupling.
 */
const WEALTH_CODE_STYLE_MAP: Record<WealthCodeKey, WealthLeadershipMapping> = {
  investmentBrain: {
    key: "investmentBrain",
    shortLabel: WEALTH_CODE_SHORT_LABELS.investmentBrain,
    label: WEALTH_CODE_LABELS.investmentBrain,
    base: { x: -6, y: -6 }, // Directive + Strategic
    style: { xLabel: "Directive", yLabel: "Strategic" },
    color: { fill: "#DC2626", stroke: "#7F1D1D" },
  },
  brandingMagnet: {
    key: "brandingMagnet",
    shortLabel: WEALTH_CODE_SHORT_LABELS.brandingMagnet,
    label: WEALTH_CODE_LABELS.brandingMagnet,
    base: { x: 6, y: -6 }, // Collaborative + Strategic
    style: { xLabel: "Collaborative", yLabel: "Strategic" },
    color: { fill: "#9333EA", stroke: "#5B21B6" },
  },
  strategyPlanner: {
    key: "strategyPlanner",
    shortLabel: WEALTH_CODE_SHORT_LABELS.strategyPlanner,
    label: WEALTH_CODE_LABELS.strategyPlanner,
    base: { x: -6, y: 6 }, // Directive + Operational
    style: { xLabel: "Directive", yLabel: "Operational" },
    color: { fill: "#D97706", stroke: "#92400E" },
  },
  collaborator: {
    key: "collaborator",
    shortLabel: WEALTH_CODE_SHORT_LABELS.collaborator,
    label: WEALTH_CODE_LABELS.collaborator,
    base: { x: 6, y: 6 }, // Collaborative + Operational
    style: { xLabel: "Collaborative", yLabel: "Operational" },
    color: { fill: "#059669", stroke: "#065F46" },
  },
};

/**
 * Build leadership quadrant points (founder + archetypes).
 *
 * - Founder dot position is primarily driven by Wealth Code DNA.
 * - Life/Career palace leadership signals provide a small secondary adjustment (+/- 2).
 */
function buildQuadrantData(params: {
  chartData: ChartData;
  lifePalace: Palace | null;
  careerPalace: Palace | null;
  presentNoblemanTypes: Set<NoblemanType>;
}): { founderPoint: QuadrantPoint; archetypes: QuadrantPoint[] } {
  const { chartData, lifePalace, careerPalace, presentNoblemanTypes } = params;

  // Secondary signal: Life + Career palaces.
  const starNames = [lifePalace, careerPalace].filter(isNonNull).flatMap(extractStarNames);
  const starSignal = computeLeadershipPoint(starNames);

  // Convert the original -10..10 point into a small +/-2 nudge (scaled, as specified).
  const xAdj = clampMinus2To2(starSignal.x / 5);
  const yAdj = clampMinus2To2(starSignal.y / 5);

  // Primary driver: dominant Wealth Code (Section 01).
  const wealthProfile = analyzeWealthCode(chartData);
  const dominantKey: WealthCodeKey | null =
    wealthProfile.hasRecognizedStars && wealthProfile.codes.length > 0 ? wealthProfile.codes[0].key : null;

  const fallbackBase = { x: starSignal.x, y: starSignal.y };
  const mapping = dominantKey ? WEALTH_CODE_STYLE_MAP[dominantKey] : null;

  const base = mapping ? mapping.base : fallbackBase;
  const finalX = clampMinus10To10(base.x + xAdj);
  const finalY = clampMinus10To10(base.y + yAdj);

  const wealthSentence = mapping
    ? `Your dominant ${mapping.label} archetype suggests a ${mapping.style.xLabel} + ${mapping.style.yLabel} style.`
    : "Wealth Code data unavailable; using Life + Career palace signals as the primary leadership indicator.";

  const nudgeSentence = `Life/Career palace signals add a small adjustment (X ${xAdj.toFixed(
    1
  )}, Y ${yAdj.toFixed(1)}) to refine your position.`;

  const founderPoint: QuadrantPoint = {
    id: "founder",
    label: "Founder",
    category: "Founder",
    x: finalX,
    y: finalY,
    z: 120,
    fill: mapping ? mapping.color.fill : "#f59e0b",
    stroke: mapping ? mapping.color.stroke : "#92400e",
    wealthCodeKey: mapping ? mapping.key : undefined,
    wealthCodeLabel: mapping ? mapping.label : undefined,
    wealthCodeShortLabel: mapping ? mapping.shortLabel : undefined,
    leadershipStyleSummary: mapping
      ? `${mapping.style.xLabel} + ${mapping.style.yLabel}`
      : `${formatQuadrantAxisValue("x", finalX)} · ${formatQuadrantAxisValue("y", finalY)}`,
    lifeCareerNudge: { xAdj, yAdj },
    detail: [wealthSentence, nudgeSentence, `Signal basis: ${starSignal.why}`].join("\n"),
  };

  // Create up to 6 archetype dots from the types observed in key palaces.
  const archetypes: QuadrantPoint[] = Array.from(presentNoblemanTypes)
    .map((t) => noblemanTypeToArchetypePoint(t))
    // Ensure stable uniqueness by id.
    .reduce<QuadrantPoint[]>((acc, p) => {
      if (acc.some((x) => x.id === p.id)) return acc;
      acc.push(p);
      return acc;
    }, [])
    .slice(0, 6);

  return { founderPoint, archetypes };
}

/**
 * Map nobleman types to team archetype points in the quadrant chart.
 * This keeps dots stable and explainable without relying on arbitrary randomness.
 */
function noblemanTypeToArchetypePoint(type: NoblemanType): QuadrantPoint {
  switch (type) {
    case "authority_high_status":
      return {
        id: "archetype-authority",
        label: "COO/CFO (Authority Figure)",
        category: "Operations",
        x: -6,
        y: 6,
        z: 70,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
    case "refined_educated":
      return {
        id: "archetype-strategist",
        label: "CPO/COO (Strategist)",
        category: "Product",
        x: 6,
        y: -6,
        z: 60,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
    case "practical_leader":
      return {
        id: "archetype-executor",
        label: "Ops Manager (Execution Doer)",
        category: "Operations",
        x: -4,
        y: 8,
        z: 60,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
    case "younger_junior":
      return {
        id: "archetype-innovator",
        label: "CTO/Creative (Innovator)",
        category: "Tech",
        x: 7,
        y: -2,
        z: 55,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
    case "charismatic_expressive":
      return {
        id: "archetype-connector",
        label: "CMO/Sales (Connector)",
        category: "Growth",
        x: 8,
        y: 4,
        z: 55,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
    case "same_generation":
      return {
        id: "archetype-growth",
        label: "BizDev (Growth Partner)",
        category: "Growth",
        x: 5,
        y: 1,
        z: 50,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
    default:
      return {
        id: `archetype-${type}`,
        label: "Support Archetype",
        category: "Product",
        x: 0,
        y: 0,
        z: 45,
        detail: NOBLEMAN_PROFILES[type].characteristics,
      };
  }
}

/**
 * Utility: convert month counts to readable “Year N” buckets.
 */
function monthToYearLabel(month: number): "Year 1" | "Year 2" | "Year 3" {
  if (month < 12) return "Year 1";
  if (month < 24) return "Year 2";
  return "Year 3";
}

/**
 * Determine a simple priority label based on gap size.
 */
function gapToPriority(gap: number): "P1" | "P2" | "P3" {
  if (gap >= 7) return "P1";
  if (gap >= 4) return "P2";
  return "P3";
}

/**
 * Convert an ideal (0–10) priority score into an actionable label for founders.
 */
function idealToPriorityLabel(ideal: number): "High priority" | "Medium priority" | "Lower priority" {
  const s = clamp0To10(ideal);
  if (s >= 7) return "High priority";
  if (s >= 4) return "Medium priority";
  return "Lower priority";
}

/**
 * Format a score as a friendly “x/10” string without noisy trailing decimals.
 */
function formatScoreOutOfTen(score: number): string {
  const s = clamp0To10(score);
  const rounded = Number(s.toFixed(1));
  const isWhole = Math.abs(rounded - Math.round(rounded)) < 1e-9;
  const display = isWhole ? `${Math.round(rounded)}` : `${rounded.toFixed(1)}`;
  return `${display}/10`;
}

/**
 * Map radar axes into executive roles for the hiring plan and heatmap.
 */
type RoleMapping = {
  heatmapRole: HeatmapRole;
  title: string;
  icon: string;
  /** Which radar axes drive this role need. */
  axes: ReadonlyArray<TalentRoleAxis>;
};

const EXEC_ROLE_MAPPINGS: ReadonlyArray<RoleMapping> = [
  { heatmapRole: "CEO", title: "CEO (Vision & Alignment)", icon: "👑", axes: ["Strategist", "People Ops"] },
  { heatmapRole: "COO", title: "COO (Operations Lead)", icon: "🏗️", axes: ["Operations", "Executor"] },
  { heatmapRole: "CFO", title: "CFO (Finance & Controls)", icon: "💰", axes: ["Finance", "Analyst"] },
  { heatmapRole: "CMO", title: "CMO (Growth & Brand)", icon: "📣", axes: ["Salesperson", "Creative"] },
  { heatmapRole: "CPO", title: "CPO (People/Product)", icon: "🧑‍🤝‍🧑", axes: ["People Ops", "Strategist"] },
  { heatmapRole: "CTO", title: "CTO (Tech & Innovation)", icon: "🧠", axes: ["Analyst", "Creative"] },
];

/**
 * “Who to Look For” role card model.
 * Traits are derived deterministically from `NOBLEMAN_PROFILES` (no invented traits).
 */
type WhoToLookForCard = {
  noblemanType: NoblemanType;
  roleTitle: string;
  icon: string;
  traits: readonly string[];
};

/**
 * Convert a nobleman profile characteristics paragraph into clean, scannable trait bullets.
 *
 * Strategy:
 * - Normalize whitespace
 * - Split by common punctuation (commas/periods/semicolons)
 * - Strip common filler lead-ins (“This is…”, “They help you…”)
 * - Deduplicate and cap to `maxTraits`
 */
function characteristicsToTraits(characteristics: string, maxTraits: number): string[] {
  const safeText = typeof characteristics === "string" ? characteristics : "";
  const safeMax = Number.isFinite(maxTraits) ? Math.max(1, Math.min(6, Math.floor(maxTraits))) : 4;

  const normalized = safeText
    .replaceAll("\n", " ")
    .replaceAll("—", ",")
    .replaceAll("–", ",")
    .replaceAll(/\s+/g, " ")
    .trim();

  if (normalized.length === 0) return [];

  const fillerLeadIns: ReadonlyArray<RegExp> = [
    /^this is (the )?(type of )?(person|someone) who\s+/i,
    /^this is (someone|the kind of (nobleman|person)) who\s+/i,
    /^they (help|support|guide) you\s+/i,
    /^they open doors for you\s+/i,
    /^when they appear,\s*/i,
  ];

  const rawParts = normalized.split(/[,.;]/g);
  const cleaned = rawParts
    .map((part) => {
      let t = part.trim();
      for (const rx of fillerLeadIns) {
        t = t.replace(rx, "");
      }
      t = t.replaceAll(/\s+/g, " ").trim();
      if (t.length === 0) return null;
      // Avoid overly generic fragments that don't scan as a “trait”.
      if (t.length < 4) return null;
      // Ensure consistent capitalization without changing meaning.
      const first = t.slice(0, 1);
      const capped = first ? `${first.toUpperCase()}${t.slice(1)}` : t;
      return capped;
    })
    .filter(isNonNull);

  // Deduplicate while preserving order.
  const seen = new Set<string>();
  const deduped: string[] = [];
  for (const t of cleaned) {
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    deduped.push(t);
  }

  return deduped.slice(0, safeMax);
}

/**
 * Who-to-look-for cards derived from nobleman profile descriptions.
 *
 * Mapping alignment (per spec):
 * - Authority Figure → COO/Operations
 * - Strategist → Strategic Advisor
 * - Execution Doer → Project Manager
 * - Innovator → Product/Tech Lead
 * - Connector → Sales/Marketing
 * - Growth Partner → Business Development
 */
const WHO_TO_LOOK_FOR_CARDS: ReadonlyArray<WhoToLookForCard> = [
  {
    noblemanType: "authority_high_status",
    roleTitle: "COO / Operations Lead",
    icon: "🏗️",
    traits: ["Decisive and authoritative", "Natural leader with presence", "Strategic thinker", "Process-oriented and organized"],
  },
  {
    noblemanType: "refined_educated",
    roleTitle: "Strategic Advisor",
    icon: "🧭",
    traits: ["Analytical and methodical", "Detail-focused and precise", "Calm under pressure", "Strong communicator"],
  },
  {
    noblemanType: "practical_leader",
    roleTitle: "Project Manager",
    icon: "✅",
    traits: ["Action-oriented executor", "Reliable and consistent", "Problem-solver mindset", "Team coordinator"],
  },
  {
    noblemanType: "younger_junior",
    roleTitle: "Product / Tech Lead",
    icon: "🧠",
    traits: ["Innovative and creative", "Tech-savvy and curious", "Fast learner", "Future-focused visionary"],
  },
  {
    noblemanType: "charismatic_expressive",
    roleTitle: "Sales / Marketing",
    icon: "📣",
    traits: ["Outgoing and persuasive", "Natural networker", "Energetic communicator", "Relationship builder"],
  },
  {
    noblemanType: "same_generation",
    roleTitle: "Business Development",
    icon: "🤝",
    traits: ["Collaborative partner", "Strategic alliance builder", "Long-term relationship focus", "Win-win negotiator"],
  },
] as const;

/**
 * Build a 36-month hiring plan based on gaps and leadership style.
 */
function buildHiringTimeline(
  radar: RadarDatum[],
  leadership: { x: number; y: number },
  noblemanTypesPresent: Set<NoblemanType>
): TimelineDatum[] {
  const gapByAxis = new Map<TalentRoleAxis, number>();
  for (const d of radar) {
    gapByAxis.set(d.role, clamp0To10(d.ideal));
  }

  const roleGapScore = (axes: ReadonlyArray<TalentRoleAxis>): number => {
    const scores = axes.map((a) => gapByAxis.get(a) ?? 0);
    const avg = scores.length > 0 ? scores.reduce((sum, v) => sum + v, 0) / scores.length : 0;
    return clamp0To10(Number(avg.toFixed(1)));
  };

  // Mild leadership heuristic: if founder leans directive/operational, prioritize complementary strategic/collab hires slightly earlier.
  const prefersComplement = Math.abs(leadership.x) + Math.abs(leadership.y) >= 8;

  const boostForNobleman = (heatmapRole: HeatmapRole): number => {
    // Only small boosts; the underlying gaps remain the primary driver.
    const hasAuthority = noblemanTypesPresent.has("authority_high_status");
    const hasStrategist = noblemanTypesPresent.has("refined_educated");
    const hasExecutor = noblemanTypesPresent.has("practical_leader");
    const hasInnovator = noblemanTypesPresent.has("younger_junior");
    const hasConnector = noblemanTypesPresent.has("charismatic_expressive");

    if (heatmapRole === "COO" && (hasAuthority || hasExecutor || hasStrategist)) return 1;
    if (heatmapRole === "CFO" && (hasAuthority || hasExecutor)) return 1;
    if (heatmapRole === "CMO" && hasConnector) return 1;
    if (heatmapRole === "CTO" && hasInnovator) return 1;
    if (heatmapRole === "CPO" && hasStrategist) return 0.8;
    return 0;
  };

  const scored = EXEC_ROLE_MAPPINGS.map((r) => {
    const base = roleGapScore(r.axes);
    const boosted = clamp0To10(base + boostForNobleman(r.heatmapRole));
    const priority = gapToPriority(boosted);
    const complementNudge =
      prefersComplement && (r.heatmapRole === "CFO" || r.heatmapRole === "COO") ? 0.5 : 0;

    return { mapping: r, gapScore: clamp0To10(boosted + complementNudge), priority };
  }).sort((a, b) => b.gapScore - a.gapScore);

  // Convert sorted roles into a simple, realistic 3-year plan.
  // Requirement: the plan should meaningfully span months 0–36 (Year 1–3).
  // Approach:
  // - Use fixed base hire targets evenly spread across the 36-month window
  // - Nudge earlier for bigger gaps (higher hire need)
  // - Enforce minimum spacing so roles don't collapse into Year 1
  const timeline: TimelineDatum[] = [];
  const maxMonths = 36;
  const minHireSpacing = 4;

  const clampMonth = (month: number): number => {
    if (!Number.isFinite(month)) return 0;
    return Math.max(0, Math.min(maxMonths, Math.round(month)));
  };

  const baseHireTarget = (index: number): number => {
    // 6 roles: targets at 5, 11, 17, 23, 29, 35 (spread across 3 years).
    return clampMonth(5 + index * 6);
  };

  let previousHireAt = 0;

  for (let i = 0; i < scored.length; i += 1) {
    const item = scored[i];

    // High gaps should hire earlier (negative shift), low gaps later.
    // This keeps deterministic outcomes while still spanning all 3 years.
    const nudge = Math.round((item.gapScore - 5) * 1.5); // ~[-8..+8]
    const desiredHireAt = clampMonth(baseHireTarget(i) - nudge);

    // Enforce spacing and reserve room for remaining roles.
    const remaining = scored.length - (i + 1);
    const minAllowed = i === 0 ? 2 : previousHireAt + minHireSpacing;
    const maxAllowed = maxMonths - remaining * minHireSpacing - 1;

    const hireAt = clampMonth(Math.max(minAllowed, Math.min(desiredHireAt, maxAllowed)));
    previousHireAt = hireAt;

    const hireDuration = 2; // “hire window” marker

    // Search window should begin months before hire.
    const leadTimeByPriority: Record<"P1" | "P2" | "P3", number> = { P1: 8, P2: 7, P3: 6 };
    const desiredLookStart = hireAt - leadTimeByPriority[item.priority];
    const lookStart = clampMonth(Math.max(0, desiredLookStart));

    // Duration is the “search window” length; clamp to keep visuals tidy.
    const lookDuration = clampMonth(Math.min(10, Math.max(3, hireAt - lookStart)));

    const whyParts: string[] = [
      `Gap score: ${item.gapScore.toFixed(1)}/10`,
      `Driven by: ${item.mapping.axes.join(", ")}`,
      `Target: ${monthToYearLabel(hireAt)}`,
    ];

    timeline.push({
      id: item.mapping.heatmapRole,
      role: `${item.mapping.icon} ${item.mapping.title} — ${item.priority}`,
      priorityLabel: item.priority,
      lookStart,
      lookDuration,
      hireStart: Math.max(0, hireAt - 1),
      hireDuration,
      why: whyParts.join(" · "),
    });
  }

  return timeline;
}

/**
 * Convert a 0–10 score into a red→yellow→green background.
 */
function scoreToHeatColor(score: number): string {
  const s = clamp0To10(score);
  // 0..5: red -> yellow, 5..10: yellow -> green
  if (s <= 5) {
    const t = s / 5;
    const r = 220;
    const g = Math.round(40 + t * 140);
    const b = 38;
    return `rgba(${r}, ${g}, ${b}, 0.25)`;
  }
  const t = (s - 5) / 5;
  const r = Math.round(245 - t * 170);
  const g = 190;
  const b = 55;
  return `rgba(${r}, ${g}, ${b}, 0.25)`;
}

/**
 * Format an x/y quadrant coordinate as directional text.
 */
function formatQuadrantAxisValue(axis: "x" | "y", value: number): string {
  const v = clamp0To10(Math.abs(value));
  if (axis === "x") {
    return value >= 0 ? `Collaborative (+${v.toFixed(1)})` : `Directive (-${v.toFixed(1)})`;
  }
  return value >= 0 ? `Operational (+${v.toFixed(1)})` : `Strategic (-${v.toFixed(1)})`;
}

/**
 * Shared section card wrapper (kept outside the parent component for lint/perf).
 */
const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="rounded-2xl shadow-lg overflow-hidden border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700">
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 overflow-hidden">
        {/* Subtle pattern overlay to match premium report styling. */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 40%, rgba(255,255,255,.18) 1px, transparent 1px),
              radial-gradient(circle at 75% 70%, rgba(255,255,255,.14) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        {subtitle ? <p className="text-xs text-white/80 mt-1">{subtitle}</p> : null}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

type RechartsPayload<T> = { payload: T };

/**
 * Radar tooltip (kept outside the parent component for lint/perf).
 */
const TalentRadarTooltip: React.FC<{
  active?: boolean;
  payload?: Array<RechartsPayload<RadarDatum>>;
}> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0].payload;
  const priorityLabel = idealToPriorityLabel(d.ideal);
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-4 max-w-xs">
      <div className="font-bold text-gray-900 dark:text-white mb-1">{`${d.icon} ${d.role}`}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
        <div>{`${priorityLabel}: ${formatScoreOutOfTen(d.ideal)}`}</div>
      </div>
    </div>
  );
};

/**
 * Quadrant tooltip (kept outside the parent component for lint/perf).
 */
const TalentQuadrantTooltip: React.FC<{
  active?: boolean;
  payload?: Array<RechartsPayload<QuadrantPoint>>;
}> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  const wealthCodeLine =
    p.wealthCodeLabel && p.wealthCodeShortLabel
      ? `Wealth Code: ${p.wealthCodeLabel} (${p.wealthCodeShortLabel})`
      : null;
  const styleLine =
    p.category === "Founder" && p.leadershipStyleSummary
      ? `Wealth Code style: ${p.leadershipStyleSummary}`
      : null;
  const nudgeLine =
    p.category === "Founder" && p.lifeCareerNudge
      ? `Life/Career nudge: X ${p.lifeCareerNudge.xAdj.toFixed(1)}, Y ${p.lifeCareerNudge.yAdj.toFixed(1)}`
      : null;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-4 max-w-sm">
      <div className="font-bold text-gray-900 dark:text-white mb-1">{p.label}</div>
      <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
        {wealthCodeLine ? <div>{wealthCodeLine}</div> : null}
        {styleLine ? <div>{styleLine}</div> : null}
        <div>{`X: ${formatQuadrantAxisValue("x", p.x)}`}</div>
        <div>{`Y: ${formatQuadrantAxisValue("y", p.y)}`}</div>
        {nudgeLine ? <div>{nudgeLine}</div> : null}
        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">{p.detail}</div>
      </div>
    </div>
  );
};

/**
 * Heatmap cell button — uses native <button> for accessibility.
 */
const HeatmapCellButton: React.FC<{
  cell: HeatmapCell;
  background: string;
  onHoverClientPoint: (cell: HeatmapCell, clientX: number, clientY: number) => void;
  onFocusElement: (cell: HeatmapCell, element: HTMLButtonElement) => void;
  onLeave: () => void;
}> = ({ cell, background, onHoverClientPoint, onFocusElement, onLeave }) => {
  return (
    <button
      type="button"
      className="rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-3 cursor-default select-none text-left"
      style={{ background }}
      aria-label={`${cell.role} ${cell.criterion} score ${cell.score.toFixed(1)} out of 10`}
      onMouseEnter={(e) => onHoverClientPoint(cell, e.clientX, e.clientY)}
      onMouseMove={(e) => onHoverClientPoint(cell, e.clientX, e.clientY)}
      onFocus={(e) => onFocusElement(cell, e.currentTarget)}
      onBlur={onLeave}
      onMouseLeave={onLeave}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onLeave();
        }
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="text-lg font-extrabold text-gray-900 dark:text-white">
          {cell.score.toFixed(1)}
        </div>
        <div className="text-xs font-bold text-gray-600 dark:text-gray-300">/10</div>
      </div>
    </button>
  );
};

/**
 * Props for the TalentStrategy section component.
 */
export interface TalentStrategyProps {
  /** Complete ZWDS chart data. */
  chartData: ChartData;
}

/**
 * TalentStrategy — Section 03 component.
 */
export const TalentStrategy: React.FC<TalentStrategyProps> = ({ chartData }) => {
  const [heatmapTooltip, setHeatmapTooltip] = useState<HeatmapTooltipState | null>(null);
  const heatmapContainerRef = useRef<HTMLDivElement | null>(null);

  /**
   * Derive palaces needed for this section.
   */
  const palaces = useMemo(() => {
    const life = getPalaceByNumber(chartData, chartData.lifePalace);
    const career = getPalaceByName(chartData, ["官禄", "官祿"]);
    const wealth = getPalaceByName(chartData, ["财帛", "財帛"]);
    const friends = getPalaceByName(chartData, ["交友"]);

    return { life, career, wealth, friends };
  }, [chartData]);

  /**
   * Compute role-signal context for role mapping.
   */
  const noblemanContext = useMemo(() => {
    const typeCounts: Record<NoblemanType, number> = {
      older_female: 0,
      male: 0,
      stable_resource: 0,
      younger_junior: 0,
      same_generation: 0,
      authority_high_status: 0,
      practical_leader: 0,
      bold_aggressive: 0,
      charismatic_expressive: 0,
      refined_educated: 0,
    };

    const palacesToCount = [palaces.life, palaces.career, palaces.wealth, palaces.friends].filter(
      isNonNull
    );

    for (const p of palacesToCount) {
      const counts = getNoblemanTypeCounts(p);
      (Object.keys(typeCounts) as NoblemanType[]).forEach((t) => {
        typeCounts[t] += counts[t];
      });
    }

    const presentTypes = new Set<NoblemanType>();
    (Object.keys(typeCounts) as NoblemanType[]).forEach((t) => {
      if (typeCounts[t] > 0) presentTypes.add(t);
    });

    return {
      presentTypes,
    };
  }, [chartData, palaces.career, palaces.friends, palaces.life, palaces.wealth]);

  /**
   * Build radar data:
   * - ideal = hiring priority (founder gap / missing coverage)
   */
  const radarData = useMemo<RadarDatum[]>(() => {
    const scores = createEmptyDimensionScores();

    const palacesToUse = [palaces.life, palaces.career, palaces.wealth, palaces.friends].filter(
      isNonNull
    );

    for (const p of palacesToUse) {
      const counts = getNoblemanTypeCounts(p);
      (Object.keys(counts) as NoblemanType[]).forEach((t) => {
        const w = counts[t];
        if (w <= 0) return;
        applyNoblemanTypeWeights(scores, t, w);
      });
    }

    // Normalization baseline derived from how many palaces we used.
    // This helps keep the output comparable across charts.
    const baseline = Math.max(18, palacesToUse.length * 18);

    return ROLE_AXES.map(({ role, icon }) => {
      const raw = scores[role];
      const founderCoverage = normalizeToTen(raw, baseline);
      const ideal = clamp0To10(Number((10 - founderCoverage).toFixed(1)));

      return {
        role,
        icon,
        ideal,
      };
    });
  }, [palaces.career, palaces.friends, palaces.life, palaces.wealth]);

  /**
   * Leadership quadrant points (founder + archetypes).
   */
  const quadrantData = useMemo(() => {
    return buildQuadrantData({
      chartData,
      lifePalace: palaces.life,
      careerPalace: palaces.career,
      presentNoblemanTypes: noblemanContext.presentTypes,
    });
  }, [chartData, noblemanContext.presentTypes, palaces.career, palaces.life]);

  /**
   * Hiring timeline derived from radar gaps + leadership + nobleman types.
   */
  const hiringTimeline = useMemo<TimelineDatum[]>(() => {
    return buildHiringTimeline(radarData, quadrantData.founderPoint, noblemanContext.presentTypes);
  }, [noblemanContext.presentTypes, quadrantData.founderPoint, radarData]);

  /**
   * Heatmap cells derived from:
   * - Skill fit: role axes gaps + nobleman alignment
   * - Timing fit: hiring plan hireStart (earlier = higher)
   * - Culture fit: leadership complement (distance from founder)
   */
  const heatmapCells = useMemo<HeatmapCell[]>(() => {
    const axisGap = new Map<TalentRoleAxis, number>();
    for (const d of radarData) {
      axisGap.set(d.role, d.ideal);
    }

    const hireByRole = new Map<HeatmapRole, TimelineDatum>();
    for (const t of hiringTimeline) {
      hireByRole.set(t.id, t);
    }

    const founder = quadrantData.founderPoint;

    const roleQuadrantTarget: Record<HeatmapRole, { x: number; y: number }> = {
      CEO: { x: founder.x >= 0 ? -2 : 2, y: founder.y >= 0 ? -2 : 2 }, // lightly balancing
      COO: { x: -6, y: 7 },
      CFO: { x: -7, y: 4 },
      CMO: { x: 8, y: 4 },
      CPO: { x: 6, y: -5 },
      CTO: { x: 6, y: -2 },
    };

    const noblemanBoostForRole = (role: HeatmapRole): { score: number; why: string } => {
      const hasAuthority = noblemanContext.presentTypes.has("authority_high_status");
      const hasStrategist = noblemanContext.presentTypes.has("refined_educated");
      const hasExecutor = noblemanContext.presentTypes.has("practical_leader");
      const hasInnovator = noblemanContext.presentTypes.has("younger_junior");
      const hasConnector = noblemanContext.presentTypes.has("charismatic_expressive");
      const hasGrowth = noblemanContext.presentTypes.has("same_generation");

      const whyParts: string[] = [];
      let boost = 0;

      if ((role === "COO" || role === "CFO") && hasAuthority) {
        boost += 2;
        whyParts.push("Authority Figure → CFO/COO");
      }
      if ((role === "COO" || role === "CPO") && hasStrategist) {
        boost += 1.5;
        whyParts.push("Strategist → COO/CPO");
      }
      if (role === "COO" && hasExecutor) {
        boost += 1.5;
        whyParts.push("Execution Doer → Ops execution");
      }
      if ((role === "CTO" || role === "CMO") && hasInnovator) {
        boost += 1;
        whyParts.push("Innovator → CTO/Creative");
      }
      if (role === "CMO" && hasConnector) {
        boost += 2;
        whyParts.push("Connector → CMO/Sales");
      }
      if (role === "CEO" && hasGrowth) {
        boost += 1;
        whyParts.push("Growth Partner → BizDev support");
      }

      return {
        score: boost,
        why: whyParts.length > 0 ? whyParts.join(", ") : "No strong nobleman-role alignment boost detected.",
      };
    };

    const computeSkillFit = (mapping: RoleMapping): { score: number; why: string } => {
      const gapValues = mapping.axes.map((a) => axisGap.get(a) ?? 0);
      const avgGap =
        gapValues.length > 0 ? gapValues.reduce((sum, v) => sum + v, 0) / gapValues.length : 0;

      const boost = noblemanBoostForRole(mapping.heatmapRole);
      const score = clamp0To10(Number((avgGap + boost.score).toFixed(1)));
      return {
        score,
        why: `Axes gap avg: ${avgGap.toFixed(1)}/10 · ${boost.why}`,
      };
    };

    const computeTimingFit = (role: HeatmapRole): { score: number; why: string } => {
      const t = hireByRole.get(role);
      if (!t) {
        return { score: 5, why: "No timeline entry found; using neutral timing fit." };
      }
      // Earlier hires should score higher.
      const score = clamp0To10(Number((10 - t.hireStart / 4).toFixed(1)));
      return {
        score,
        why: `Hire window: month ${t.hireStart}–${t.hireStart + t.hireDuration} (${monthToYearLabel(
          t.hireStart
        )})`,
      };
    };

    const computeCultureFit = (role: HeatmapRole): { score: number; why: string } => {
      const target = roleQuadrantTarget[role];
      const dx = target.x - founder.x;
      const dy = target.y - founder.y;
      const dist = Math.hypot(dx, dy);
      const score = clamp0To10(Number((10 - dist / 2).toFixed(1)));
      return {
        score,
        why: `Founder: (${founder.x.toFixed(1)}, ${founder.y.toFixed(1)}) · Target: (${target.x.toFixed(
          1
        )}, ${target.y.toFixed(1)})`,
      };
    };

    const cells: HeatmapCell[] = [];
    for (const mapping of EXEC_ROLE_MAPPINGS) {
      const skill = computeSkillFit(mapping);
      const timing = computeTimingFit(mapping.heatmapRole);
      const culture = computeCultureFit(mapping.heatmapRole);

      cells.push(
        {
          role: mapping.heatmapRole,
          criterion: "Culture Fit",
          score: culture.score,
          explanation: culture.why,
        },
        {
          role: mapping.heatmapRole,
          criterion: "Skill Fit",
          score: skill.score,
          explanation: skill.why,
        },
        {
          role: mapping.heatmapRole,
          criterion: "Timing Fit",
          score: timing.score,
          explanation: timing.why,
        }
      );
    }

    return cells;
  }, [hiringTimeline, noblemanContext.presentTypes, quadrantData.founderPoint, radarData]);

  /**
   * Heatmap tooltip helpers.
   */
  const hideHeatmapTooltip = useCallback(() => {
    setHeatmapTooltip(null);
  }, []);

  const showHeatmapTooltipAtClientPoint = useCallback(
    (cell: HeatmapCell, clientX: number, clientY: number) => {
      const container = heatmapContainerRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      setHeatmapTooltip({
        role: cell.role,
        criterion: cell.criterion,
        score: cell.score,
        x,
        y,
      });
    },
    []
  );

  const showHeatmapTooltipAtElementCenter = useCallback(
    (cell: HeatmapCell, element: HTMLButtonElement) => {
      const container = heatmapContainerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const cellRect = element.getBoundingClientRect();
      const x = cellRect.left - containerRect.left + cellRect.width / 2;
      const y = cellRect.top - containerRect.top + cellRect.height / 2;

      setHeatmapTooltip({
        role: cell.role,
        criterion: cell.criterion,
        score: cell.score,
        x,
        y,
      });
    },
    []
  );

  /**
   * Heatmap layout helpers.
   */
  const heatmapCriteria: HeatmapCriterion[] = ["Culture Fit", "Skill Fit", "Timing Fit"];
  const heatmapRoles: HeatmapRole[] = ["CEO", "COO", "CFO", "CMO", "CPO", "CTO"];

  const heatmapCellByKey = useMemo(() => {
    const map = new Map<string, HeatmapCell>();
    for (const cell of heatmapCells) {
      map.set(`${cell.role}__${cell.criterion}`, cell);
    }
    return map;
  }, [heatmapCells]);

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider (match analysis section spacing) */}
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl dark:text-white font-bold mb-2">{"A+ TALENT STRATEGY"}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {"Who to Hire, When to Hire, Role Fit Analysis"}
        </p>
      </div>

      {/* A) Radar: Full width */}
      <SectionCard
        title="Ideal Team Composition"
        subtitle="Key roles to build your optimal team"
      >
        <div className="w-full h-80 md:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <defs>
                <linearGradient id="talentStrategyIdealGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.85} />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.85} />
                </linearGradient>
              </defs>
              <PolarGrid stroke="#64748b" opacity={0.35} />
              <PolarAngleAxis
                dataKey="role"
                tick={{ fill: "#94a3b8", fontSize: 12 }}
                tickFormatter={(value: string) => {
                  const match = radarData.find((d) => d.role === value);
                  return match ? `${match.icon} ${value}` : value;
                }}
              />
              <PolarRadiusAxis angle={90} domain={[0, 10]} tick={{ fill: "#94a3b8", fontSize: 10 }} />
              <RechartsTooltip content={<TalentRadarTooltip />} />
              <Radar
                name="Ideal"
                dataKey="ideal"
                stroke="#4f46e5"
                fill="url(#talentStrategyIdealGradient)"
                fillOpacity={0.42}
                strokeWidth={4}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </SectionCard>

      {/* B) Who to Look For: Full width */}
      <div className="mt-6">
        <SectionCard title="Who to Look For" subtitle="Trait-based profiles for your key hires (no timing, just fit)">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {WHO_TO_LOOK_FOR_CARDS.map((card) => {
              const profile = NOBLEMAN_PROFILES[card.noblemanType];
              const matchesYourChart = noblemanContext.presentTypes.has(card.noblemanType);
              const traits = card.traits.length > 0 ? card.traits : characteristicsToTraits(profile.characteristics, 4);

              return (
                <div
                  key={card.noblemanType}
                  className="rounded-2xl shadow-sm border bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl leading-none" aria-hidden="true">
                        {card.icon}
                      </div>
                      <div>
                        <div className="text-sm font-extrabold text-gray-900 dark:text-white">
                          {card.roleTitle}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{profile.type}</div>
                      </div>
                    </div>

                    {matchesYourChart ? (
                      <span
                        className="text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full
                          bg-emerald-50 text-emerald-700 border border-emerald-200
                          dark:bg-emerald-900/20 dark:text-emerald-200 dark:border-emerald-800"
                      >
                        {"Matches your chart"}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4">
                    <div className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide">
                      {"Traits to look for"}
                    </div>
                    <ul className="mt-2 list-disc pl-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
                      {traits.slice(0, 4).map((trait) => (
                        <li key={trait}>{trait}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            {"These cards map nobleman profile patterns to practical business roles, so you can screen for traits instead of dates."}
          </div>
        </SectionCard>
      </div>

      {/* C + D: 2-column on desktop */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* C) Leadership quadrant */}
        <SectionCard
          title="Leadership Style Quadrant"
          subtitle="Your leadership positioning and team archetype fit"
        >
          <div className="relative w-full h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
                {/* Quadrant shading */}
                <ReferenceArea x1={-10} x2={0} y1={0} y2={10} fill="rgba(79, 70, 229, 0.10)" />
                <ReferenceArea x1={0} x2={10} y1={0} y2={10} fill="rgba(124, 58, 237, 0.10)" />
                <ReferenceArea x1={-10} x2={0} y1={-10} y2={0} fill="rgba(30, 64, 175, 0.08)" />
                <ReferenceArea x1={0} x2={10} y1={-10} y2={0} fill="rgba(147, 51, 234, 0.08)" />

                <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                <XAxis
                  type="number"
                  dataKey="x"
                  domain={[-10, 10]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  domain={[-10, 10]}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                />
                <ZAxis type="number" dataKey="z" range={[80, 240]} />
                <ReferenceLine x={0} stroke="#94a3b8" opacity={0.6} />
                <ReferenceLine y={0} stroke="#94a3b8" opacity={0.6} />
                <RechartsTooltip content={<TalentQuadrantTooltip />} />
                <Legend />

                <Scatter
                  name="Founder"
                  data={[quadrantData.founderPoint]}
                  fill={quadrantData.founderPoint.fill ?? "#f59e0b"}
                  stroke={quadrantData.founderPoint.stroke ?? "#92400e"}
                />
                <Scatter
                  name="Team archetypes"
                  data={quadrantData.archetypes}
                  fill="#7c3aed"
                  stroke="#4f46e5"
                />
              </ScatterChart>
            </ResponsiveContainer>

            {/* Quadrant corner labels (overlay) */}
            <div className="pointer-events-none absolute inset-0 px-3 py-3">
              <div className="absolute left-3 top-3 text-[10px] leading-snug text-gray-600 dark:text-gray-300">
                <div className="font-bold text-gray-900 dark:text-gray-100">{"Directive + Operational (SP)"}</div>
                <div>{"Decisive execution · Systems · SOP"}</div>
              </div>
              <div className="absolute right-3 top-3 text-[10px] leading-snug text-right text-gray-600 dark:text-gray-300">
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {"Collaborative + Operational (CO)"}
                </div>
                <div>{"People-led execution · Team rhythm"}</div>
              </div>
              <div className="absolute left-3 bottom-10 text-[10px] leading-snug text-gray-600 dark:text-gray-300">
                <div className="font-bold text-gray-900 dark:text-gray-100">{"Directive + Strategic (IB)"}</div>
                <div>{"Decisive strategy · Control · Capital focus"}</div>
              </div>
              <div className="absolute right-3 bottom-10 text-[10px] leading-snug text-right text-gray-600 dark:text-gray-300">
                <div className="font-bold text-gray-900 dark:text-gray-100">
                  {"Collaborative + Strategic (BM)"}
                </div>
                <div>{"Influence-led strategy · Vision · Brand"}</div>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">Founder point</div>
              <div>{`X: ${formatQuadrantAxisValue("x", quadrantData.founderPoint.x)}`}</div>
              <div>{`Y: ${formatQuadrantAxisValue("y", quadrantData.founderPoint.y)}`}</div>
              <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">
                  {"Wealth Code DNA influence"}
                </div>
                <div className="leading-relaxed">
                  {"Your leadership position is influenced by your Wealth Code DNA."}{" "}
                  <a href="#wealth-code" className="text-indigo-600 dark:text-indigo-400 underline">
                    {"See Section 01 findings"}
                  </a>
                  {"."}
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
              <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">Signal basis</div>
              <div className="leading-relaxed whitespace-pre-line">{quadrantData.founderPoint.detail}</div>
            </div>
          </div>
        </SectionCard>

        {/* Heatmap */}
        <SectionCard title="Role Priority Matrix" subtitle="Culture Fit · Skill Fit · Timing Fit (0–10)">
          <div className="relative" ref={heatmapContainerRef}>
            <div
              className="grid"
              style={{
                gridTemplateColumns: `140px repeat(${heatmapCriteria.length}, minmax(0, 1fr))`,
                gap: "10px",
              }}
            >
              {/* Header row */}
              <div />
              {heatmapCriteria.map((c) => (
                <div
                  key={c}
                  className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wide"
                >
                  {c}
                </div>
              ))}

              {/* Rows */}
              {heatmapRoles.map((r) => {
                return (
                  <React.Fragment key={r}>
                    <div className="text-sm font-bold text-gray-900 dark:text-white">{r}</div>
                    {heatmapCriteria.map((c) => {
                      const cell = heatmapCellByKey.get(`${r}__${c}`);
                      const score = cell ? clamp0To10(cell.score) : 0;
                      const explanation = cell ? cell.explanation : "No data available.";
                      const matrixCell: HeatmapCell = {
                        role: r,
                        criterion: c,
                        score,
                        explanation,
                      };

                      return (
                        <HeatmapCellButton
                          key={`${r}-${c}`}
                          cell={matrixCell}
                          background={scoreToHeatColor(score)}
                          onHoverClientPoint={showHeatmapTooltipAtClientPoint}
                          onFocusElement={showHeatmapTooltipAtElementCenter}
                          onLeave={hideHeatmapTooltip}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Tooltip */}
            {heatmapTooltip ? (
              <div
                className="absolute z-10"
                style={{
                  left: Math.min(heatmapTooltip.x + 12, 520),
                  top: Math.max(heatmapTooltip.y + 12, 12),
                  maxWidth: "340px",
                }}
              >
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-xl p-4">
                  {/* Keep the tooltip actionable and non-technical (no derivation details). */}
                  <div className="text-xs text-gray-900 dark:text-gray-100 leading-relaxed font-semibold">
                    {`Role: ${heatmapTooltip.role}, Criterion: ${heatmapTooltip.criterion}, Score: ${formatScoreOutOfTen(
                      heatmapTooltip.score
                    )}`}
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Simple legend (non-technical) for interpreting the heatmap colors. */}
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm border border-gray-300 dark:border-gray-700"
                style={{ background: scoreToHeatColor(9) }}
                aria-hidden="true"
              />
              <span>{"Green (8–10): Strong fit"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm border border-gray-300 dark:border-gray-700"
                style={{ background: scoreToHeatColor(6) }}
                aria-hidden="true"
              />
              <span>{"Yellow (5–7): Moderate fit"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block h-3 w-3 rounded-sm border border-gray-300 dark:border-gray-700"
                style={{ background: scoreToHeatColor(2) }}
                aria-hidden="true"
              />
              <span>{"Red (0–4): Weak fit"}</span>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default TalentStrategy;

