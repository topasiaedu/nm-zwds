/**
 * Main orchestrator for the Annual ZWDS 运势 Report.
 * Produces AnnualRunReport from birth data and report year.
 */

import { ZWDSCalculator } from "../zwds/calculator";
import type { ChartInput, ChartData, Palace } from "../zwds/types";
import { getLunarMonthDateRanges } from "../forecast/lunarMonthRanges";
import { parseBirthHourForChart } from "../zwds/utils";
import { computeLiuYearTransformations } from "./liuYearTransformations";
import { computeLiuMonthTransformations } from "./liuMonthTransformations";
import { evaluateBranchHarmony, buildMonthRhythmVisual, buildTimingWindows } from "./branchHarmony";
import {
  collectPlainMonthlyInsights,
  getBriefAnnualActivationTitle,
  getPlainStarCombinationInsight,
} from "./starCombinations";
import {
  scoreAllDomainsForMonth,
  scoreDomainForYear,
  scoreToTrend,
  getDomainScore,
  deriveMonthKeyword,
  deriveEnergyDescriptor,
  palaceHasJi,
} from "./domainScoring";
import { REPORT_DOMAINS, getPalaceEnglish, getPlainLifeAreaName } from "./domainConfig";
import {
  getAnnualFlowLabel,
  getLunarMonthEnglishLabel,
  getTransformationKindLabel,
} from "./reportLabels";
import type {
  ActivationSummary,
  AnnualMonthEntry,
  AnnualPlaybook,
  AnnualRunReport,
  AnnualStory,
  DomainRow,
  GrowStronger,
  LifeAreaCluster,
  LifeAreaClusters,
  LiuMonthTransformationSet,
  MonthFocusGuide,
  MonthSnapshot,
  OpportunityRiskItem,
  PalaceSummary,
  QuarterlyEnergyArc,
  ReportMeta,
  ReportSubject,
  SeeHearDo,
  YearMapData,
  YearMapMonthRow,
  MonthCategoryEntry,
  TransformationActivation,
  TransformationKind,
} from "./types";

/**
 * Build ChartInput from URL/form parameters.
 */
export function chartInputFromParams(params: {
  name: string;
  birthday: string;
  birthTime: string;
  gender: "male" | "female";
  email?: string;
}): ChartInput {
  const birthDate = new Date(params.birthday);
  if (Number.isNaN(birthDate.getTime())) {
    throw new Error(`Invalid birthday: ${params.birthday}`);
  }

  return {
    name: params.name,
    year: birthDate.getFullYear(),
    month: birthDate.getMonth() + 1,
    day: birthDate.getDate(),
    hour: parseBirthHourForChart(params.birthTime),
    gender: params.gender,
    email: params.email,
  };
}

/**
 * Build palace summary from chart palace.
 */
function toPalaceSummary(palace: Palace): PalaceSummary {
  const mainStars = (palace.mainStar ?? []).map((s) => s.name);
  return {
    number: palace.number,
    name: palace.name,
    englishName: getPalaceEnglish(palace.name),
    heavenlyStem: palace.heavenlyStem,
    earthlyBranch: palace.earthlyBranch,
    mainStars,
  };
}

/**
 * Palace-specific month theme lines (chart-driven activation context).
 */
const PALACE_MONTH_THEMES: Record<string, string> = {
  "官禄": "Career is in focus. Steps you take at work carry extra weight this month.",
  "财帛": "Money and resources need attention. Review income and spending decisions.",
  "夫妻": "Partnerships need clarity. Have honest one to one conversations.",
  "疾厄": "Health comes first. Build recovery routines before you push hard.",
  "迁移": "Change of scene helps. Travel, relocation, or new environments may open paths.",
  "交友": "Your network matters. Introductions and teamwork can pay off.",
  "田宅": "Home and family need grounding. Stabilize your base before you stretch further.",
  "福德": "Your mindset shapes results. Align your inner state before you act outwardly.",
  "兄弟": "Choose your circle wisely. Quality connections beat quantity.",
  "子女": "Long term plans need structure. Give creativity clear boundaries.",
  "父母": "Let go of old patterns. Family history and authority themes may surface.",
  "命宫": "Invest in yourself. Personal upgrades support every other area.",
};

/**
 * Plain reason text for activated palaces in a month.
 */
function formatPlainActivationReason(activations: TransformationActivation[]): string {
  return activations
    .map((activation) => {
      const timing = activation.sourceLabel.toLowerCase().includes("month")
        ? "This month"
        : "This year";
      return `${timing}: ${getTransformationKindLabel(activation.kind)} activates ${getPalaceEnglish(activation.targetPalaceName)}`;
    })
    .join(". ");
}

/**
 * Build quarterly energy arc from monthly average scores.
 */
function buildQuarterlyArc(months: AnnualMonthEntry[]): QuarterlyEnergyArc[] {
  const quarters: { quarter: string; label: string; monthIndices: number[] }[] = [
    { quarter: "Q1", label: "Opening momentum", monthIndices: [0, 1, 2] },
    { quarter: "Q2", label: "Building phase", monthIndices: [3, 4, 5] },
    { quarter: "Q3", label: "Testing & adjustment", monthIndices: [6, 7, 8] },
    { quarter: "Q4", label: "Integration & close", monthIndices: [9, 10, 11] },
  ];

  return quarters.map(({ quarter, label, monthIndices }) => {
    const slice = monthIndices
      .map((i) => months[i])
      .filter((m): m is AnnualMonthEntry => m !== undefined);

    const scores = slice.map((m) => {
      const r = m.snapshot.ratings;
      return (r.career + r.wealth + r.love + r.health) / 4;
    });
    const averageScore =
      scores.length > 0
        ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10
        : 3;

    let summary = "Keep your routine steady. Take only small, well thought out risks.";
    if (averageScore >= 4) {
      summary = "Strong quarter. Push your main goals and make visible moves.";
    } else if (averageScore <= 2.5) {
      summary = "Slow quarter. Protect your energy and cut extra commitments.";
    }

    return { quarter, label, averageScore, summary };
  });
}

/**
 * Build report metadata.
 */
function buildReportMeta(
  liuYear: ReturnType<typeof computeLiuYearTransformations>,
  lunarRanges: ReturnType<typeof getLunarMonthDateRanges>
): ReportMeta {
  const firstRange = lunarRanges[0];
  const lunarYearLabel =
    firstRange !== undefined
      ? `Lunar year from ${getLunarMonthEnglishLabel(firstRange.lunarMonth)}`
      : "Lunar year by month ranges";

  return {
    lunarYearLabel,
    stemBranchLabel: getAnnualFlowLabel(
      liuYear.yearHeavenlyStem,
      liuYear.yearEarthlyBranch
    ),
    yearPalaceNumber: liuYear.yearPalaceNumber,
    disclaimer:
      "This report shows patterns in your chart, not fixed outcomes. Use it as a guide, and trust your own judgment too.",
  };
}

/**
 * Derive annual keyword from dominant 流年 activation.
 */
function deriveAnnualKeyword(activations: TransformationActivation[]): string {
  const jiPalace = activations.find((a) => a.kind === "化忌");
  const luPalace = activations.find((a) => a.kind === "化祿");
  if (luPalace !== undefined && jiPalace === undefined) {
    return "Expand";
  }
  if (jiPalace !== undefined) {
    return "Consolidate";
  }
  return "Build";
}

/**
 * Build annual story for Part 1.
 */
function buildAnnualStory(
  _chartData: ChartData,
  liuYear: ReturnType<typeof computeLiuYearTransformations>,
  months: AnnualMonthEntry[]
): AnnualStory {
  const keyword = deriveAnnualKeyword(liuYear.activations);
  const yearTheme =
    keyword === "Expand"
      ? "This year favors growth and new openings. Say yes to the opportunities that truly fit you."
      : keyword === "Consolidate"
        ? "This year favors fixing foundations and clearing what no longer works. Strengthen what you already have."
        : "This year favors steady building. Lay groundwork now so the rest of the year can pay off.";

  const energyArc =
    `Your year runs on ${getAnnualFlowLabel(liuYear.yearHeavenlyStem, liuYear.yearEarthlyBranch)}, centered on palace ${liuYear.yearPalaceNumber}. ` +
    `Energy often picks up in the middle months. Where pressure lands, move more carefully. ` +
    `Use the end of the year to review what worked and what to change next.`;

  const opportunities: OpportunityRiskItem[] = liuYear.activations
    .filter((a) => a.kind !== "化忌")
    .map((a) => ({
      title: getBriefAnnualActivationTitle(
        a.kind,
        getPlainLifeAreaName(a.targetPalaceName)
      ),
      detail: "",
      posture:
        a.kind === "化祿"
          ? "Say yes to good openings."
          : "Take the lead.",
    }));

  const risks: OpportunityRiskItem[] = liuYear.activations
    .filter((a) => a.kind === "化忌")
    .map((a) => ({
      title: getBriefAnnualActivationTitle(
        a.kind,
        getPlainLifeAreaName(a.targetPalaceName)
      ),
      detail: "",
      posture: "Slow down. Check the facts.",
    }));

  return {
    yearTheme,
    annualKeyword: keyword,
    energyArc,
    quarterlyArc: buildQuarterlyArc(months),
    liuYearTransformations: liuYear.activations,
    opportunities,
    risks,
  };
}

/**
 * Build annual domain matrix rows.
 */
function buildDomainMatrix(
  chartData: ChartData,
  liuYearActivations: TransformationActivation[]
): DomainRow[] {
  return REPORT_DOMAINS.map((domain) => {
    const yearScore = scoreDomainForYear(chartData, domain.key, liuYearActivations);
    const trend = scoreToTrend(yearScore);
    const hasJi = palaceHasJi(domain.palaceName, liuYearActivations);
    const hasLu = liuYearActivations.some(
      (a) => a.targetPalaceName === domain.palaceName && a.kind === "化祿"
    );

    return {
      domain: domain.key,
      domainLabel: domain.label,
      palaceName: domain.palaceName,
      yearTrend: trend,
      focusThisYear: hasLu
        ? `Opportunities are flowing in ${domain.englishName}. Act on the best ones.`
        : `Keep showing up in ${domain.englishName} with consistent weekly action.`,
      avoidThisYear: hasJi
        ? `Avoid impulsive moves in ${domain.englishName} when things feel tense.`
        : `Do not neglect ${domain.englishName} while focusing on stronger areas.`,
      yearScore,
    };
  });
}

/**
 * Build key activations for a month (top 2–4 palaces).
 */
function buildKeyActivations(
  liuMonthSet: LiuMonthTransformationSet,
  liuYearActivations: TransformationActivation[]
): ActivationSummary[] {
  const palaceHits = new Map<string, TransformationActivation[]>();

  for (const activation of [...liuYearActivations, ...liuMonthSet.activations]) {
    const existing = palaceHits.get(activation.targetPalaceName) ?? [];
    existing.push(activation);
    palaceHits.set(activation.targetPalaceName, existing);
  }

  interface WeightedActivation extends ActivationSummary {
    weight: number;
  }

  const weighted: WeightedActivation[] = Array.from(palaceHits.entries()).map(
    ([palaceName, activations]) => ({
      palaceName,
      palaceEnglish: getPalaceEnglish(palaceName),
      reason: formatPlainActivationReason(activations),
      transformationKinds: activations.map((a) => a.kind),
      weight: activations.length + (palaceName === liuMonthSet.monthPalaceName ? 2 : 0),
    })
  );

  const summaries: ActivationSummary[] = weighted
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 4)
    .map(({ palaceName, palaceEnglish, reason, transformationKinds }) => ({
      palaceName,
      palaceEnglish,
      reason,
      transformationKinds,
    }));

  if (summaries.length === 0) {
    summaries.push({
      palaceName: liuMonthSet.monthPalaceName,
      palaceEnglish: getPalaceEnglish(liuMonthSet.monthPalaceName),
      reason: `This month's main focus is ${getPalaceEnglish(liuMonthSet.monthPalaceName)}.`,
      transformationKinds: [],
    });
  }

  return summaries;
}

const MONTHLY_POSITIVE_HINT: Record<TransformationKind, string> = {
  "化祿": "Support flows more easily here. Say yes to solid opportunities.",
  "化權": "You can take the lead here. Make decisions instead of waiting.",
  "化科": "People notice your work here. Communicate clearly and share results.",
  "化忌": "",
};

const MONTHLY_CAUTION_HINT =
  "This area may feel stressed or blocked. Slow down and double check your plans.";

const RATING_AREA_LABELS: Record<string, string> = {
  career: "career",
  wealth: "money",
  love: "love",
  health: "health",
};

/**
 * Build a plain language focus guide for Part 2 (no 四化 / palace jargon).
 */
function buildMonthFocusGuide(
  liuMonthSet: LiuMonthTransformationSet,
  domainScores: ReturnType<typeof scoreAllDomainsForMonth>
): MonthFocusGuide {
  const monthArea = getPlainLifeAreaName(liuMonthSet.monthPalaceName);

  const topRated = (["career", "wealth", "love", "health"] as const)
    .map((key) => ({ key, score: getDomainScore(domainScores, key) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((item) => RATING_AREA_LABELS[item.key] ?? item.key);

  const ratingsPhrase =
    topRated.length >= 2
      ? `${topRated[0]} and ${topRated[1]}`
      : topRated[0] ?? "your main life areas";

  const summary =
    `This month highlights ${monthArea.toLowerCase()}. ` +
    `Your ratings are strongest in ${ratingsPhrase}.`;

  const focusHere: string[] = [];
  const beCarefulHere: string[] = [];
  const seenFocus = new Set<string>();
  const seenCaution = new Set<string>();

  for (const activation of liuMonthSet.activations) {
    const area = getPlainLifeAreaName(activation.targetPalaceName);
    const comboInsight = getPlainStarCombinationInsight(
      activation.starName,
      activation.kind,
      activation.targetPalaceName
    );

    if (activation.kind === "化忌") {
      const line =
        comboInsight ?? `${area}: ${MONTHLY_CAUTION_HINT}`;
      if (!seenCaution.has(line)) {
        seenCaution.add(line);
        beCarefulHere.push(line);
      }
      continue;
    }

    const hint = MONTHLY_POSITIVE_HINT[activation.kind];
    const line = comboInsight ?? `${area}: ${hint}`;
    if (!seenFocus.has(line) && focusHere.length < 3) {
      seenFocus.add(line);
      focusHere.push(line);
    }
  }

  if (focusHere.length === 0) {
    focusHere.push(
      `${monthArea}: This is your main theme for the month. Give it steady attention.`
    );
  }

  return {
    summary,
    focusHere: focusHere.slice(0, 3),
    beCarefulHere: beCarefulHere.slice(0, 2),
  };
}

/**
 * Build life area cluster paragraphs from domain scores.
 */
function buildLifeAreaClusters(
  _chartData: ChartData,
  domainScores: ReturnType<typeof scoreAllDomainsForMonth>,
  monthActivations: TransformationActivation[]
): LifeAreaClusters {
  const score = (key: Parameters<typeof getDomainScore>[1]) =>
    getDomainScore(domainScores, key);

  const lifeScore = score("inner");
  const careerScore = score("career");
  const wealthScore = score("wealth");
  const loveScore = score("love");
  const healthScore = score("health");

  const selfAndMindset: LifeAreaCluster = {
    scores: [{ label: "Wellbeing", score: lifeScore }],
    insight:
      lifeScore >= 4
        ? "You feel more confident this month. Speak up early and set the tone."
        : lifeScore <= 2
          ? "Inner pressure may build. Pause before big decisions and choose clarity over speed."
          : "Your mood is fairly balanced. Watch the first half of the month, then act with confidence.",
  };

  const workAndMoney: LifeAreaCluster = {
    scores: [
      { label: "Career", score: careerScore },
      { label: "Wealth", score: wealthScore },
    ],
    insight:
      careerScore >= 4 && wealthScore >= 3
        ? "Work visibility and income potential align. Pitch ideas, publish work, or close deals."
        : wealthScore >= 4
          ? "Money flow improves. Review finances and use assets you already have."
          : "Steady output beats bold leaps. Protect your reputation and cash flow.",
  };

  const peopleAndLove: LifeAreaCluster = {
    scores: [
      { label: "Love", score: loveScore },
      { label: "Network", score: score("network") },
    ],
    insight:
      loveScore >= 4
        ? "Partnership energy opens. Start honest alignment talks with the people who matter."
        : palaceHasJi("夫妻", monthActivations)
          ? "Relationship friction is possible. Listen first, then negotiate."
          : "Your social circle matters. One good introduction can shift outcomes.",
  };

  const bodyHomeAndWorld: LifeAreaCluster = {
    scores: [
      { label: "Health", score: healthScore },
      { label: "Home", score: score("family") },
      { label: "Travel", score: score("external") },
    ],
    insight:
      healthScore <= 2
        ? "Your body needs care. Sleep, digestion, and stress recovery come first."
        : "Keep routines steady. Plan family and travel moves instead of acting on impulse.",
  };

  return { selfAndMindset, workAndMoney, peopleAndLove, bodyHomeAndWorld };
}

/**
 * Build See · Hear · Do block.
 */
function buildSeeHearDo(
  domainScores: ReturnType<typeof scoreAllDomainsForMonth>,
  monthActivations: TransformationActivation[],
  timingBest: string
): SeeHearDo {
  const career = getDomainScore(domainScores, "career");
  const wealth = getDomainScore(domainScores, "wealth");
  const love = getDomainScore(domainScores, "love");
  const health = getDomainScore(domainScores, "health");

  const see: string[] = [];
  if (career >= 4) {
    see.push("More meetings, visibility requests, or leadership invitations at work.");
  }
  if (wealth >= 4) {
    see.push("Money topics come up. Watch for invoices, deals, or asset discussions.");
  }
  if (love >= 4) {
    see.push("Relationship energy intensifies. Partners may want clarity or commitment.");
  }
  if (health <= 2) {
    see.push("Your body sends signals. Pay extra attention to sleep, digestion, and tension mid month.");
  }
  if (see.length < 2) {
    see.push("Small routine shifts appear. Notice what drains you and what gives you energy.");
  }
  if (see.length < 3) {
    see.push("People mirror your inner state. Watch what others reflect back to you.");
  }

  const hasJi = monthActivations.some((a) => a.kind === "化忌");
  const hear: string[] = hasJi
    ? [
        "Use a calm, diplomatic tone. Avoid ultimatums during tense moments.",
        "Delay gossip heavy talks until you have verified facts.",
      ]
    : [
        "A grounded, persuasive tone works best. Lead with evidence.",
        "Acknowledge others before you propose changes.",
      ];

  const mustDo: string[] = [];
  const avoid: string[] = [];

  if (career >= 4) {
    mustDo.push("Take one visible career step. Present, propose, or ask for a role upgrade.");
  } else {
    mustDo.push("Finish one high impact task that protects your professional reputation.");
  }

  if (wealth >= 3) {
    mustDo.push("Review cash flow and close one open financial task.");
  } else {
    avoid.push("Impulse purchases or investment tips you have not verified.");
  }

  if (hasJi) {
    avoid.push("Major commitments on tense days. Read contracts twice before you sign.");
  } else {
    avoid.push("Over scheduling. Leave open time for recovery.");
  }

  return {
    see: see.slice(0, 3),
    hear: hear.slice(0, 2),
    mustDo: mustDo.slice(0, 2),
    avoid: avoid.slice(0, 2),
    bestTiming: timingBest,
  };
}

/**
 * Build Grow Stronger block.
 */
function buildGrowStronger(monthActivations: TransformationActivation[]): GrowStronger {
  const jiPalace = monthActivations.find((a) => a.kind === "化忌");
  const characterMap: Record<string, string> = {
    "官禄": "Decisiveness",
    "财帛": "Discipline",
    "夫妻": "Empathy",
    "疾厄": "Patience",
    "命宫": "Self trust",
    "福德": "Stillness",
  };

  const skillHints: Record<string, string> = {
    Decisiveness: "Make clear calls instead of waiting for perfect information.",
    Discipline: "Keep small promises to yourself, especially when motivation dips.",
    Empathy: "Listen first so others feel heard before you push your view.",
    Patience: "Give situations time to settle before you react.",
    "Self trust": "Back your own judgment instead of chasing outside approval.",
    Stillness: "Create quiet space so your next move is intentional.",
    Boundaries: "Protect your time and energy without guilt.",
    Consistency: "Repeat the same small routine until it becomes automatic.",
  };

  const habitActions: Record<string, string> = {
    Decisiveness: "Pick one delayed decision and make a clear choice.",
    Discipline: "Finish one task you already committed to, even if it is small.",
    Empathy: "Ask someone how they are doing, then listen without interrupting.",
    Patience: "Pause for one breath before you reply when something frustrates you.",
    "Self trust": "Take one step without asking for extra approval first.",
    Stillness: "Spend five quiet minutes with no phone or notifications.",
    Boundaries: "Say no to one request that would stretch you too thin.",
    Consistency: "Do the same small routine at the same time today.",
  };

  const characterFocus =
    jiPalace !== undefined
      ? characterMap[jiPalace.targetPalaceName] ?? "Boundaries"
      : "Consistency";

  const practiceSteps = [
    "Set aside 10 minutes at the end of the day.",
    "Write down one win and one challenge from today.",
    habitActions[characterFocus] ??
      `Do one small action that builds ${characterFocus.toLowerCase()}.`,
  ];

  return {
    characterFocus,
    skillHint: skillHints[characterFocus] ?? skillHints.Consistency,
    practiceTitle: "10-minute evening check-in",
    practiceSteps,
    pressureNote:
      jiPalace !== undefined
        ? `When ${getPalaceEnglish(jiPalace.targetPalaceName).toLowerCase()} feels heavy, slow down instead of pulling back. Use the pause to think before you act.`
        : "Use this month's momentum to build one habit that lasts beyond this cycle.",
  };
}

/**
 * Build one monthly entry.
 */
function buildMonthEntry(
  chartData: ChartData,
  liuMonthSet: LiuMonthTransformationSet,
  liuYearActivations: TransformationActivation[],
  annualKeyword: string,
  lunarMonthLabel: string,
  solarDateRange: string,
  solarStart: Date,
  solarEnd: Date
): AnnualMonthEntry {
  const monthPalace = chartData.palaces[liuMonthSet.monthPalaceNumber - 1];
  const lifePalace = chartData.palaces[chartData.lifePalace - 1];

  const domainScores = scoreAllDomainsForMonth(
    chartData,
    liuYearActivations,
    liuMonthSet.activations
  );

  const avgScore =
    domainScores.reduce((sum, d) => sum + d.score, 0) / domainScores.length;

  const keyword = deriveMonthKeyword(liuMonthSet.monthPalaceName, avgScore);
  const harmony = evaluateBranchHarmony(
    liuMonthSet.monthEarthlyBranch,
    lifePalace?.earthlyBranch ?? "子"
  );
  const timing = buildTimingWindows(solarStart, solarEnd, harmony.harmony);
  const rhythmVisual = buildMonthRhythmVisual(solarStart, solarEnd, harmony.harmony);

  const starInsights = collectPlainMonthlyInsights(liuMonthSet.activations, getPalaceEnglish);

  const monthArea = getPlainLifeAreaName(liuMonthSet.monthPalaceName);
  const snapshot: MonthSnapshot = {
    theme:
      PALACE_MONTH_THEMES[liuMonthSet.monthPalaceName] ??
      `Give ${monthArea.toLowerCase()} clear attention this month.`,
    energy: deriveEnergyDescriptor(avgScore),
    keyword,
    yearLink:
      avgScore >= 3.5
        ? `This month supports your "${annualKeyword}" year theme. ${monthArea} stands out.`
        : `This month tests your "${annualKeyword}" year theme. Move carefully in ${monthArea.toLowerCase()}.`,
    palaceFocus: `Focus: ${monthArea}`,
    ratings: {
      career: getDomainScore(domainScores, "career"),
      wealth: getDomainScore(domainScores, "wealth"),
      love: getDomainScore(domainScores, "love"),
      health: getDomainScore(domainScores, "health"),
    },
  };

  const bestTiming =
    harmony.harmony === "favorable" || harmony.harmony === "supportive"
      ? "Early to mid month"
      : harmony.harmony === "challenging"
        ? "Late month for essential moves only"
        : "Mid month";

  return {
    lunarMonth: liuMonthSet.lunarMonth,
    lunarMonthLabel,
    solarDateRange,
    snapshot,
    liuMonthPalace: monthPalace !== undefined ? toPalaceSummary(monthPalace) : {
      number: liuMonthSet.monthPalaceNumber,
      name: liuMonthSet.monthPalaceName,
      englishName: getPalaceEnglish(liuMonthSet.monthPalaceName),
      heavenlyStem: liuMonthSet.monthHeavenlyStem,
      earthlyBranch: liuMonthSet.monthEarthlyBranch,
      mainStars: [],
    },
    liuMonthTransformations: liuMonthSet.activations,
    domainScores,
    keyActivations: buildKeyActivations(liuMonthSet, liuYearActivations),
    starCombinationInsights: starInsights,
    monthFocusGuide: buildMonthFocusGuide(liuMonthSet, domainScores),
    lifeAreaClusters: buildLifeAreaClusters(chartData, domainScores, liuMonthSet.activations),
    seeHearDo: buildSeeHearDo(domainScores, liuMonthSet.activations, bestTiming),
    growStronger: buildGrowStronger(liuMonthSet.activations),
    timingNote: {
      favorableWindow: timing.favorable,
      cautionWindow: timing.caution,
      branchHarmony: harmony.harmony,
      branchExplanation: harmony.explanation,
      rhythmVisual,
    },
  };
}

/**
 * Build top months for a domain category.
 */
function buildMonthCategory(
  months: AnnualMonthEntry[],
  domainKey: Parameters<typeof getDomainScore>[1],
  ascending: boolean
): MonthCategoryEntry {
  const sorted = [...months].sort((a, b) => {
    const scoreA = getDomainScore(a.domainScores, domainKey);
    const scoreB = getDomainScore(b.domainScores, domainKey);
    return ascending ? scoreA - scoreB : scoreB - scoreA;
  });

  const top = sorted.slice(0, 3);
  const domainLabel = domainKey.charAt(0).toUpperCase() + domainKey.slice(1);
  const why =
    top.length > 0
      ? `Chart activations make these months stand out for ${domainLabel.toLowerCase()}.`
      : `These months have the strongest chart support for ${domainLabel.toLowerCase()}.`;

  return {
    monthRows: top.map((m) => ({
      label: m.lunarMonthLabel,
      score: getDomainScore(m.domainScores, domainKey),
    })),
    why,
    strategy: ascending
      ? "Simplify commitments and protect recovery time."
      : "Schedule key moves and capitalize on momentum windows.",
  };
}

/**
 * Build year map and playbook for Part 3.
 */
function buildYearMap(
  months: AnnualMonthEntry[],
  annualKeyword: string,
  domainMatrix: DomainRow[]
): YearMapData {
  const overviewRows: YearMapMonthRow[] = months.map((m) => ({
    lunarMonthLabel: m.lunarMonthLabel,
    solarDateRange: m.solarDateRange,
    career: m.snapshot.ratings.career,
    wealth: m.snapshot.ratings.wealth,
    love: m.snapshot.ratings.love,
    health: m.snapshot.ratings.health,
    keyword: m.snapshot.keyword,
  }));

  const topDomains = [...domainMatrix]
    .sort((a, b) => b.yearScore - a.yearScore)
    .slice(0, 2);

  const playbook: AnnualPlaybook = {
    annualGoals: topDomains.map(
      (d) => `Strengthen ${d.domainLabel} with one quarterly milestone.`
    ).concat(["Build one skill that compounds across all domains."]),
    guardrails: [
      "Avoid major commitments in your lowest health months. Get a professional review first.",
      "Pause negotiations when both your love and wealth areas are under pressure in the same month.",
      "Block weekly recovery time. This is not optional.",
    ],
    monthlyKeywords: months.map((m) => m.snapshot.keyword),
    q1StarterPlan: months.slice(0, 3).flatMap((m) => m.seeHearDo.mustDo).slice(0, 5),
    rereadGuide: [
      "Thinking about a job change? Open Part 1 and find that month's action section.",
      "About to negotiate? Find the month with your highest Wealth score and read the timing note.",
      "Making a relationship decision? Check the month where your Love score is highest.",
      "Planning to travel or move? Look for months where the Travel area is strong.",
    ],
    closingLine:
      "Your chart shows the patterns. You make the decisions. Use this guide each month and adjust as you go.",
  };

  const turningPoints = months
    .filter(
      (m) =>
        m.timingNote.branchHarmony === "challenging" ||
        m.timingNote.branchHarmony === "favorable"
    )
    .map((m) => ({
      monthLabel: m.lunarMonthLabel,
      harmony: m.timingNote.branchHarmony,
      explanation: m.timingNote.branchExplanation,
    }))
    .slice(0, 6);

  return {
    overviewRows,
    bestMonths: {
      career: buildMonthCategory(months, "career", false),
      wealth: buildMonthCategory(months, "wealth", false),
      love: buildMonthCategory(months, "love", false),
      health: buildMonthCategory(months, "health", false),
      mostChallenging: buildMonthCategory(months, "health", true),
    },
    turningPoints,
    goldenWindows: months
      .filter(
        (m) =>
          m.timingNote.branchHarmony === "favorable" ||
          m.timingNote.branchHarmony === "supportive"
      )
      .map((m) => ({
        monthLabel: m.lunarMonthLabel,
        solarDateRange: m.solarDateRange,
        window: m.timingNote.favorableWindow,
      }))
      .slice(0, 6),
    cautionCalendar: months
      .filter(
        (m) =>
          m.timingNote.branchHarmony === "challenging" ||
          m.timingNote.branchHarmony === "watchful"
      )
      .map((m) => ({
        monthLabel: m.lunarMonthLabel,
        window: m.timingNote.cautionWindow,
      }))
      .slice(0, 6),
    playbook,
  };
}

/**
 * Build the full annual report.
 */
export function buildAnnualReport(
  chartInput: ChartInput,
  year?: number
): AnnualRunReport {
  const reportYear = year ?? new Date().getFullYear();
  const calculator = new ZWDSCalculator(chartInput);
  const chartData = calculator.calculate();

  const liuYear = computeLiuYearTransformations(chartData, reportYear);
  const liuMonthSets = computeLiuMonthTransformations(chartData, reportYear);
  const lunarRanges = getLunarMonthDateRanges(reportYear);

  const annualKeyword = deriveAnnualKeyword(liuYear.activations);
  const domainMatrix = buildDomainMatrix(chartData, liuYear.activations);

  const months: AnnualMonthEntry[] = liuMonthSets.map((liuMonthSet) => {
    const range = lunarRanges.find((r) => r.lunarMonth === liuMonthSet.lunarMonth);
    return buildMonthEntry(
      chartData,
      liuMonthSet,
      liuYear.activations,
      annualKeyword,
      getLunarMonthEnglishLabel(liuMonthSet.lunarMonth),
      range?.solarDateRange ?? "",
      range?.solarStart ?? new Date(reportYear, 0, 1),
      range?.solarEnd ?? new Date(reportYear, 11, 31)
    );
  });

  const annualStory = buildAnnualStory(chartData, liuYear, months);
  const yearMap = buildYearMap(months, annualStory.annualKeyword, domainMatrix);
  const reportMeta = buildReportMeta(liuYear, lunarRanges);

  const birthdayIso = `${chartInput.year}-${String(chartInput.month).padStart(2, "0")}-${String(chartInput.day).padStart(2, "0")}`;

  const subject: ReportSubject = {
    name: chartInput.name,
    birthday: birthdayIso,
    birthTime: String(chartInput.hour),
    gender: chartInput.gender,
  };

  return {
    subject,
    reportYear,
    generatedAt: new Date().toISOString(),
    reportMeta,
    annualStory,
    domainMatrix,
    months,
    yearMap,
  };
}
