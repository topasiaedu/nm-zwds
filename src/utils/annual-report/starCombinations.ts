/**
 * Star + 四化 combination insight triggers.
 * Generates specific insight text when a transformation activates a star in a palace.
 */

import type { TransformationKind } from "./types";

export interface StarCombinationKey {
  starName: string;
  kind: TransformationKind;
  palaceName: string;
}

/**
 * Lookup table: star + transformation + palace → insight sentence.
 */
const COMBINATION_INSIGHTS: Record<string, string> = {
  "紫微|化權|官禄": "Your leadership stands out at work. Step into decision making with confidence.",
  "紫微|化權|命宫": "Your personal authority grows this period. Others look to you for direction.",
  "天府|化祿|财帛": "Money flow is steadier. Protect income streams and strengthen cash reserves.",
  "武曲|化忌|财帛": "Watch spending carefully. Avoid impulse buys and unverified investments.",
  "武曲|化祿|财帛": "Earning power rises. Use your skills to close income opportunities.",
  "太阳|化忌|官禄": "Career friction is possible. Protect your reputation and avoid public conflict.",
  "太阳|化權|官禄": "You are in the career spotlight. Bold professional moves can pay off.",
  "太阴|化祿|田宅": "Home and family resources improve. Good time for property or family planning.",
  "太阴|化忌|夫妻": "Partnerships feel sensitive. Share your needs before assumptions build up.",
  "天机|化科|官禄": "Your ideas shine at work. Pitch plans backed by clear facts.",
  "天机|化忌|疾厄": "Mental fatigue is a risk. Protect sleep and reduce overthinking.",
  "贪狼|化祿|交友": "Your social energy grows. Networking and teamwork open useful doors.",
  "贪狼|化忌|夫妻": "Distractions in relationships are possible. Stay aligned with your values.",
  "巨门|化忌|交友": "Miscommunication is possible. Clarify agreements and stay away from gossip.",
  "天同|化祿|福德": "Inner calm helps outer results. Set your mindset before you push output.",
  "天梁|化科|父母": "Learning and mentorship help. Seek advice from experienced people.",
  "破军|化權|迁移": "Change can bring breakthroughs. Relocation or market shifts may pay off.",
  "廉贞|化忌|疾厄": "Stress may build up. Schedule recovery before burnout signs appear.",
  "文昌|化科|官禄": "Credentials and documentation help your career. Publish, certify, or present formally.",
  "文曲|化科|财帛": "Creative work can earn money. Writing, teaching, or content may bring income.",
};

/**
 * Build lookup key for combination table.
 */
function buildKey(starName: string, kind: TransformationKind, palaceName: string): string {
  return `${starName}|${kind}|${palaceName}`;
}

/**
 * Get insight for a specific star + transformation + palace combination.
 */
export function getStarCombinationInsight(
  starName: string,
  kind: TransformationKind,
  palaceName: string
): string | null {
  const key = buildKey(starName, kind, palaceName);
  return COMBINATION_INSIGHTS[key] ?? null;
}

/**
 * Collect all triggered insights from a list of transformation activations.
 */
export function collectStarCombinationInsights(
  activations: ReadonlyArray<{ starName: string; kind: TransformationKind; targetPalaceName: string }>
): string[] {
  const insights: string[] = [];
  const seen = new Set<string>();

  for (const activation of activations) {
    const insight = getStarCombinationInsight(
      activation.starName,
      activation.kind,
      activation.targetPalaceName
    );
    if (insight !== null && !seen.has(insight)) {
      seen.add(insight);
      insights.push(insight);
    }
  }

  return insights;
}

/**
 * Plain star + 四化 insights for monthly chapters (Part 2).
 */
const PLAIN_COMBINATION_INSIGHTS: Record<string, string> = {
  "紫微|化權|官禄": "People notice your leadership at work. Step into decision making roles with confidence.",
  "紫微|化權|命宫": "Your personal authority grows. Others look to you for direction this month.",
  "天府|化祿|财帛": "Money flow steadies. Protect cash reserves and strengthen income streams.",
  "武曲|化忌|财帛": "Watch spending this month. Avoid impulse buys and unverified investments.",
  "武曲|化祿|财帛": "Earning power rises. Use your skills to close income opportunities.",
  "太阳|化忌|官禄": "Career friction is possible. Protect your reputation and avoid public conflict.",
  "太阳|化權|官禄": "You are in the career spotlight. Bold professional moves can pay off.",
  "太阴|化祿|田宅": "Home and family resources improve. Good month for property or family planning.",
  "太阴|化忌|夫妻": "Partnerships feel sensitive. Share your needs before assumptions build.",
  "天机|化科|官禄": "Your ideas shine at work. Pitch plans backed by clear facts.",
  "天机|化忌|疾厄": "Mental fatigue is a risk. Protect sleep and cut overthinking loops.",
  "贪狼|化祿|交友": "Your social pull grows. Networking and teamwork open useful doors.",
  "贪狼|化忌|夫妻": "Distraction in relationships is possible. Stay aligned with your values.",
  "巨门|化忌|交友": "Miscommunication is possible. Clarify agreements and avoid gossip.",
  "天同|化祿|福德": "Inner calm helps outer results. Set your mindset before you push output.",
  "天梁|化科|父母": "Learning and mentorship help. Seek advice from experienced people.",
  "破军|化權|迁移": "Change can bring breakthroughs. Relocation or market shifts may pay off.",
  "廉贞|化忌|疾厄": "Stress may build. Schedule recovery before burnout signs appear.",
  "文昌|化科|官禄": "Credentials and documents help your career. Publish, certify, or present formally.",
  "文曲|化科|财帛": "Creative work can earn money. Writing, teaching, or content may bring income.",
};

/**
 * Plain language insight for monthly transformation copy (Part 2).
 */
export function getPlainMonthlyTransformationInsight(
  kind: TransformationKind,
  palaceEnglishName: string
): string {
  switch (kind) {
    case "化祿":
      return (
        `化祿 lands in your ${palaceEnglishName} this month. ` +
        `Support and resources flow more easily here. ` +
        `Say yes to the best openings in this part of your life.`
      );
    case "化權":
      return (
        `化權 lands in your ${palaceEnglishName} this month. ` +
        `You have more say in this area. ` +
        `Step up and make decisions instead of waiting.`
      );
    case "化科":
      return (
        `化科 lands in your ${palaceEnglishName} this month. ` +
        `Your reputation and clarity matter here. ` +
        `Share your work and communicate in plain terms.`
      );
    case "化忌":
      return (
        `化忌 lands in your ${palaceEnglishName} this month. ` +
        `This area may feel pressured. ` +
        `Slow down, check details, and fix small problems early.`
      );
    default:
      return `This month puts extra focus on your ${palaceEnglishName}. Notice what shifts there first.`;
  }
}

/**
 * Get plain insight for star + transformation + palace combination.
 */
export function getPlainStarCombinationInsight(
  starName: string,
  kind: TransformationKind,
  palaceName: string
): string | null {
  const key = buildKey(starName, kind, palaceName);
  return PLAIN_COMBINATION_INSIGHTS[key] ?? null;
}

/**
 * Collect plain monthly insights from transformation activations.
 */
export function collectPlainMonthlyInsights(
  activations: ReadonlyArray<{
    starName: string;
    kind: TransformationKind;
    targetPalaceName: string;
  }>,
  getPalaceEnglish: (palaceName: string) => string
): string[] {
  const insights: string[] = [];
  const seen = new Set<string>();

  for (const activation of activations) {
    const palaceEnglish = getPalaceEnglish(activation.targetPalaceName);
    const insight =
      getPlainStarCombinationInsight(
        activation.starName,
        activation.kind,
        activation.targetPalaceName
      ) ??
      getPlainMonthlyTransformationInsight(activation.kind, palaceEnglish);

    if (!seen.has(insight)) {
      seen.add(insight);
      insights.push(insight);
    }
  }

  return insights;
}

/**
 * Plain language insight for Part 1 annual transformation table and story blocks.
 * No em dashes; short sentences with a clear next step.
 */
export function getPlainAnnualTransformationInsight(
  kind: TransformationKind,
  palaceEnglishName: string
): string {
  switch (kind) {
    case "化祿":
      return (
        `化祿 lands in your ${palaceEnglishName}. ` +
        `Support and resources flow more easily here this year. ` +
        `Look for openings in this part of your life and act on the best ones.`
      );
    case "化權":
      return (
        `化權 lands in your ${palaceEnglishName}. ` +
        `You have more say and influence in this area. ` +
        `Step up, make decisions, and do not wait for others to lead.`
      );
    case "化科":
      return (
        `化科 lands in your ${palaceEnglishName}. ` +
        `Your reputation and clarity matter here. ` +
        `Share your work, write things down, and communicate in plain terms.`
      );
    case "化忌":
      return (
        `化忌 lands in your ${palaceEnglishName}. ` +
        `This area may feel pressured or blocked. ` +
        `Slow down, check the details, and fix small problems before they grow.`
      );
    default:
      return `This year puts extra focus on your ${palaceEnglishName}. Notice what shifts there first.`;
  }
}

/**
 * Short plain title for opportunity and risk cards in Part 1.
 */
export function getPlainAnnualActivationTitle(
  kind: TransformationKind,
  palaceEnglishName: string
): string {
  switch (kind) {
    case "化祿":
      return `Good flow in your ${palaceEnglishName}`;
    case "化權":
      return `More influence in your ${palaceEnglishName}`;
    case "化科":
      return `Stronger reputation in your ${palaceEnglishName}`;
    case "化忌":
      return `Pressure in your ${palaceEnglishName}`;
    default:
      return `Focus on your ${palaceEnglishName}`;
  }
}

/**
 * Fallback insight when no specific combination matches.
 */
export function getGenericTransformationInsight(
  kind: TransformationKind,
  palaceName: string
): string {
  switch (kind) {
    case "化祿":
      return `Resources flow more easily in ${palaceName}. Look for opportunities there and act on the best ones.`;
    case "化權":
      return `You have more say in ${palaceName}. Take the lead and make decisions instead of waiting.`;
    case "化科":
      return `Your reputation and clarity matter in ${palaceName}. Share your work and communicate plainly.`;
    case "化忌":
      return `${palaceName} may feel pressured. Slow down, check the details, and fix small problems early.`;
    default:
      return `Extra focus lands on ${palaceName} this period. Notice what shifts there first.`;
  }
}
