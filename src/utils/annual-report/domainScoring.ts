/**
 * Triple-layer domain scoring — natal base + 流年 + 流月 modifiers.
 */

import type { ChartData, Palace, Transformation } from "../zwds/types";
import type {
  DomainScore,
  DomainTrend,
  ReportDomainKey,
  TransformationActivation,
  TransformationKind,
} from "./types";
import { REPORT_DOMAINS } from "./domainConfig";
import { getPalaceTransformationKinds } from "./transformationResolver";

/** Score bounds. */
const MIN_SCORE = 1;
const MAX_SCORE = 5;

/** Modifier weights per plan. */
const LIU_NIAN_POSITIVE = 2;
const LIU_NIAN_NEGATIVE = -3;
const LIU_MONTH_POSITIVE = 1;
const LIU_MONTH_NEGATIVE = -2;

/**
 * Clamp score to 1–5 range.
 */
function clampScore(value: number): number {
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, Math.round(value)));
}

/**
 * Compute natal base score from main star brightness and natal 四化.
 */
function computeNatalBase(palace: Palace): number {
  let base = 3;

  const mainStars = palace.mainStar ?? [];
  if (mainStars.length === 0) {
    base = 2.5;
  } else {
    const brightCount = mainStars.filter((s) => s.brightness === "bright").length;
    const dimCount = mainStars.filter((s) => s.brightness === "dim").length;
    base = 3 + brightCount * 0.4 - dimCount * 0.3;
  }

  const natalKinds = getPalaceTransformationKinds(palace);
  for (const kind of natalKinds) {
    if (kind === "化忌") {
      base -= 0.5;
    } else {
      base += 0.25;
    }
  }

  return base;
}

/**
 * Sum transformation modifiers for activations landing on a palace.
 */
function sumActivationModifier(
  palaceName: string,
  activations: ReadonlyArray<TransformationActivation>,
  positiveWeight: number,
  negativeWeight: number
): { modifier: number; reasons: string[] } {
  let modifier = 0;
  const reasons: string[] = [];

  for (const activation of activations) {
    if (activation.targetPalaceName !== palaceName) {
      continue;
    }
    if (activation.kind === "化忌") {
      modifier += negativeWeight;
      reasons.push(`${activation.sourceLabel}: 化忌 on ${palaceName}`);
    } else {
      modifier += positiveWeight;
      reasons.push(`${activation.sourceLabel}: ${activation.kind} on ${palaceName}`);
    }
  }

  return { modifier, reasons };
}

/**
 * Score one domain for a given month using triple-layer formula.
 */
export function scoreDomainForMonth(
  chartData: ChartData,
  domainKey: ReportDomainKey,
  liuYearActivations: ReadonlyArray<TransformationActivation>,
  liuMonthActivations: ReadonlyArray<TransformationActivation>
): DomainScore {
  const config = REPORT_DOMAINS.find((d) => d.key === domainKey);
  if (config === undefined) {
    throw new Error(`Unknown domain key: ${domainKey}`);
  }

  const palace = chartData.palaces.find((p) => p.name === config.palaceName);
  if (palace === undefined) {
    throw new Error(`Palace not found: ${config.palaceName}`);
  }

  const natalBase = computeNatalBase(palace);
  const yearMod = sumActivationModifier(
    config.palaceName,
    liuYearActivations,
    LIU_NIAN_POSITIVE,
    LIU_NIAN_NEGATIVE
  );
  const monthMod = sumActivationModifier(
    config.palaceName,
    liuMonthActivations,
    LIU_MONTH_POSITIVE,
    LIU_MONTH_NEGATIVE
  );

  const rawScore = natalBase + yearMod.modifier + monthMod.modifier;
  const score = clampScore(rawScore);

  const reasonParts = [
    `Natal baseline ${natalBase.toFixed(1)}`,
    ...yearMod.reasons,
    ...monthMod.reasons,
  ];

  return {
    domain: domainKey,
    domainLabel: config.label,
    palaceName: config.palaceName,
    score,
    reason: reasonParts.join("; "),
  };
}

/**
 * Score all eight domains for one month.
 */
export function scoreAllDomainsForMonth(
  chartData: ChartData,
  liuYearActivations: ReadonlyArray<TransformationActivation>,
  liuMonthActivations: ReadonlyArray<TransformationActivation>
): DomainScore[] {
  return REPORT_DOMAINS.map((domain) =>
    scoreDomainForMonth(chartData, domain.key, liuYearActivations, liuMonthActivations)
  );
}

/**
 * Annual year-level score for a domain (natal + 流年 only).
 */
export function scoreDomainForYear(
  chartData: ChartData,
  domainKey: ReportDomainKey,
  liuYearActivations: ReadonlyArray<TransformationActivation>
): number {
  const config = REPORT_DOMAINS.find((d) => d.key === domainKey);
  if (config === undefined) {
    return 3;
  }
  const palace = chartData.palaces.find((p) => p.name === config.palaceName);
  if (palace === undefined) {
    return 3;
  }
  const natalBase = computeNatalBase(palace);
  const yearMod = sumActivationModifier(
    config.palaceName,
    liuYearActivations,
    LIU_NIAN_POSITIVE,
    LIU_NIAN_NEGATIVE
  );
  return clampScore(natalBase + yearMod.modifier);
}

/**
 * Map numeric score to trend arrow.
 */
export function scoreToTrend(score: number): DomainTrend {
  if (score >= 4) {
    return "up";
  }
  if (score <= 2) {
    return "down";
  }
  return "stable";
}

/**
 * Get domain score by key from a scored list.
 */
export function getDomainScore(
  scores: ReadonlyArray<DomainScore>,
  key: ReportDomainKey
): number {
  const found = scores.find((s) => s.domain === key);
  return found?.score ?? 3;
}

/**
 * Pick keyword from dominant palace activation and score.
 */
export function deriveMonthKeyword(
  liuMonthPalaceName: string,
  averageScore: number
): string {
  const palaceKeywords: Record<string, string> = {
    "官禄": "Lead",
    "财帛": "Harvest",
    "夫妻": "Align",
    "疾厄": "Restore",
    "迁移": "Expand",
    "交友": "Connect",
    "田宅": "Ground",
    "福德": "Reflect",
    "兄弟": "Filter",
    "子女": "Build",
    "父母": "Release",
    "命宫": "Invest",
  };

  const base = palaceKeywords[liuMonthPalaceName] ?? "Focus";
  if (averageScore >= 4) {
    return `${base}`;
  }
  if (averageScore <= 2) {
    return `Steady`;
  }
  return base;
}

/**
 * Derive energy descriptor from average domain score.
 */
export function deriveEnergyDescriptor(averageScore: number): string {
  if (averageScore >= 4.5) {
    return "High energy month. Good time for visible moves and active steps.";
  }
  if (averageScore >= 3.5) {
    return "Balanced month. Make steady progress and take only smart risks.";
  }
  if (averageScore >= 2.5) {
    return "Reflective month. Strengthen your base before pushing outward.";
  }
  return "Lower stability month. Protect your energy and simplify commitments.";
}

/**
 * Check if a palace has 化忌 from activations.
 */
export function palaceHasJi(
  palaceName: string,
  activations: ReadonlyArray<{ kind: TransformationKind; targetPalaceName: string }>
): boolean {
  return activations.some(
    (a) => a.targetPalaceName === palaceName && a.kind === "化忌"
  );
}

/**
 * Collect transformation kinds hitting a palace.
 */
export function getActivationKindsForPalace(
  palaceName: string,
  activations: ReadonlyArray<TransformationActivation>
): Transformation[] {
  return activations
    .filter((a) => a.targetPalaceName === palaceName)
    .map((a) => a.kind);
}
