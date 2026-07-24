/**
 * Personal rarity: count how often this month's pattern appeared before in your life,
 * then translate that into practical guidance (not just a “you’re unique” notice).
 */

import type { ChartData } from "../../zwds/types";
import {
  activationLandingEnglish,
  fingerprintDisplayLabel,
  SI_HUA_LABEL,
  starToEnglish,
} from "./englishLabels";
import type {
  MonthlyTimingStack,
  RarityFingerprint,
  SiHuaKind,
  StemSiHuaActivation,
} from "./types";
import { buildFingerprintKey } from "./stemSiHua";
import { getPrimaryActivation } from "./signalPriority";
import { resolveLiuYueStemSiHua, resolveMonthlyTimingStack } from "./timingStack";

const MAX_LISTED_DATES = 5;

/**
 * Map month-focus palace English names to a life theme and starter moves.
 */
const PALACE_GUIDANCE: Record<
  string,
  { theme: string; steps: string[] }
> = {
  "Life Palace": {
    theme: "identity, confidence, and how you show up",
    steps: [
      "Write one sentence for who you are choosing to be this month",
      "Remove one habit that makes you smaller in front of others",
      "Do one visible action that matches that sentence this week",
    ],
  },
  "Wellbeing Palace": {
    theme: "inner state, recovery, and emotional fuel",
    steps: [
      "Protect one non-negotiable rest or recovery block each week",
      "Name the feeling under your busyness before you make a big choice",
      "Cut one drain (person, scroll habit, or late-night overload)",
    ],
  },
  "Spouse Palace": {
    theme: "partnerships, agreements, and one-to-one closeness",
    steps: [
      "Have one clear conversation about expectations with a key person",
      "Write what you need from a partnership instead of hoping they guess",
      "Close or renegotiate one fuzzy agreement this month",
    ],
  },
  "Career Palace": {
    theme: "work reputation, ownership, and next moves",
    steps: [
      "Make one work win visible to people who decide your next step",
      "Ask for clearer ownership on something you already carry",
      "Say no to one task that does not move your main career goal",
    ],
  },
  "Wealth Palace": {
    theme: "money in, money out, and resource decisions",
    steps: [
      "Review one income or invoice cycle and close what is overdue",
      "Set a simple spending rule before any large purchase",
      "Raise or clarify a price if your work is undercharged",
    ],
  },
  "Travel Palace": {
    theme: "movement, positioning, and where you put your attention",
    steps: [
      "Choose one place, market, or network to show up in this month",
      "Cut one trip or side path that scatters your focus",
      "Follow up with one contact who can open a useful door",
    ],
  },
  "Property Palace": {
    theme: "home base, stability, and what you own or build",
    steps: [
      "Fix one home or base-of-operations friction that costs energy daily",
      "Review one asset or long-term commitment on paper",
      "Strengthen your base before chasing a bigger expansion",
    ],
  },
  "Children Palace": {
    theme: "creativity, projects, and what you are raising",
    steps: [
      "Ship one small creative or project milestone this month",
      "Give focused time to one person or project you care about growing",
      "Stop half-finishing three things; finish one cleanly",
    ],
  },
  "Health Palace": {
    theme: "body signals, energy, and sustainable pace",
    steps: [
      "Choose one health habit you can keep for 30 days",
      "Schedule sleep and meals like appointments, not leftovers",
      "Book or plan one check that removes a quiet health worry",
    ],
  },
  "Parents Palace": {
    theme: "guidance, authority, and elder or mentor dynamics",
    steps: [
      "Ask one clear question of a mentor, elder, or decision-maker",
      "Clarify one boundary with someone who sets the rules around you",
      "Document advice you receive and turn it into one next action",
    ],
  },
  "Siblings Palace": {
    theme: "peers, teammates, and near-circle support",
    steps: [
      "Ask one peer for concrete help instead of doing everything alone",
      "Offer one useful favor that strengthens a real alliance",
      "Step back from one competitive peer dynamic that wastes energy",
    ],
  },
  "Friends Palace": {
    theme: "networks, groups, and who you spend time with",
    steps: [
      "Spend focused time with one person who leaves you sharper",
      "Decline one group obligation that only drains you",
      "Join or host one small gathering that matches your goals",
    ],
  },
};

const DEFAULT_PALACE_GUIDANCE = {
  theme: "the life area this month lights up",
  steps: [
    "Name the one area of life this month is asking you to handle",
    "Take one visible action in that area within seven days",
    "Review mid-month: keep what worked, drop what scattered you",
  ],
};

/**
 * Extra coaching based on the main activation type.
 */
const ACTIVATION_COACH: Record<
  SiHuaKind,
  { meaning: string; step: string; avoid: string }
> = {
  "化禄": {
    meaning: "support and ease can increase if you open the right door",
    step: "Accept or create one helpful offer instead of doing everything alone",
    avoid: "Do not waste easy support on low-value busywork",
  },
  "化权": {
    meaning: "you have more leverage to lead, decide, and set direction",
    step: "Make one firm decision others have been waiting on",
    avoid: "Do not confuse control with overworking every detail yourself",
  },
  "化科": {
    meaning: "visibility and reputation get a boost when you show clean work",
    step: "Share one result publicly with the people who matter",
    avoid: "Do not chase praise for unfinished or half-baked work",
  },
  "化忌": {
    meaning: "friction is the teacher: a stuck point needs careful handling",
    step: "Name the friction in one sentence, then take the smallest repair move",
    avoid: "Do not ignore the irritation and hope it dissolves on its own",
  },
};

/**
 * Resolve palace-focused guidance with a safe fallback.
 */
const guidanceForPalace = (
  palaceEnglish: string
): { theme: string; steps: string[] } => {
  const hit = PALACE_GUIDANCE[palaceEnglish];
  if (hit !== undefined) {
    return hit;
  }
  return DEFAULT_PALACE_GUIDANCE;
};

/**
 * Build meaning, usual ask, steps, and history coaching from the month pattern.
 */
const buildActionableGuidance = (
  monthPalaceEnglish: string,
  chartPalaceEnglish: string,
  activations: StemSiHuaActivation[],
  priorCount: number,
  dateList: string
): Pick<
  RarityFingerprint,
  | "whatItMeans"
  | "usualAsk"
  | "usualAskLines"
  | "actionSteps"
  | "historyCoach"
  | "historyTips"
> => {
  const palace = guidanceForPalace(monthPalaceEnglish);
  // Ji is always ranked first across seasons; Expansion is a stable default here.
  const primary = getPrimaryActivation(activations, "Expansion");

  const act =
    primary !== undefined
      ? ACTIVATION_COACH[primary.kind]
      : {
        meaning: "this month asks for focused attention, not autopilot",
        step: "Pick one priority in this area and protect time for it",
        avoid: "Do not treat the whole month as generic self-improvement",
      };

  const landing =
    primary !== undefined
      ? activationLandingEnglish(primary).replace(/ Palace$/i, "")
      : chartPalaceEnglish.replace(/ Palace$/i, "");

  const shortPalace = landing.replace(/ Palace$/i, "");
  const whatItMeans = [
    `This month is mainly about ${palace.theme}.`,
    `The strongest push shows up in ${shortPalace}: ${act.meaning}.`,
  ].join(" ");

  // Focus list: theme + meaning + avoid. Do-step lives only in "Three things to do".
  const usualAskLines = [
    `Put your energy into ${palace.theme}.`,
    `Strongest push in ${shortPalace}: ${act.meaning}.`,
    act.avoid,
  ];
  const usualAsk = usualAskLines.join(" ");

  const actionSteps = [
    ...palace.steps.slice(0, 2),
    act.step,
  ];

  if (priorCount === 0) {
    return {
      whatItMeans,
      usualAsk,
      usualAskLines,
      actionSteps,
      historyCoach:
        "First time this exact mix has shown up in your whole life. Treat the month as one clean experiment and write down what worked.",
      historyTips: [
        "This exact mix has not shown up anywhere in your life so far, so treat the month as one clean experiment.",
        "It is personal because it combines your longer life chapter, this month's spotlight, and where the strongest push lands.",
        "Write one short mid-month note. Next time a similar month returns in your life, you already know what helped.",
      ],
    };
  }

  const seenLine =
    dateList.length > 0
      ? `Across your whole life, you have had similar months before (recent examples: ${dateList}).`
      : "Across your whole life, you have had similar months before in your chart history.";

  return {
    whatItMeans,
    usualAsk,
    usualAskLines,
    actionSteps,
    historyCoach: [
      seenLine,
      "Repeat what helped last time. Skip what drained you.",
      `These months tend to reopen: ${palace.theme}.`,
    ].join(" "),
    historyTips: [
      seenLine,
      "Repeat what helped in those earlier months across your life. Skip what drained you or scattered your focus.",
      `These months tend to reopen themes around ${palace.theme}.`,
      `Keep the next step simple: ${act.step}`,
    ],
  };
};

/**
 * Build plain-English "what's going on" lines for the pattern chapter.
 */
const buildStackSummary = (
  stack: MonthlyTimingStack,
  activations: StemSiHuaActivation[]
): string[] => {
  const decadeRaw =
    stack.daXian?.palaceNameEnglish ?? "your current life chapter";
  const decade = decadeRaw.replace(/ Palace$/i, "");
  const monthFocus = stack.liuYueLifeChartPalaceNameEnglish.replace(/ Palace$/i, "");
  const primary = getPrimaryActivation(activations, "Expansion");

  if (primary === undefined) {
    return [
      `Longer chapter you are in: ${decade}`,
      `This month's spotlight: ${monthFocus}`,
      "Strongest push this month: follow the month spotlight",
    ];
  }

  const landing = activationLandingEnglish(primary).replace(/ Palace$/i, "");
  const kindLabel = SI_HUA_LABEL[primary.kind];
  return [
    `Longer chapter you are in: ${decade}`,
    `This month's spotlight: ${monthFocus}`,
    `Strongest push: ${starToEnglish(primary.starName)} ${kindLabel} in ${landing}`,
  ];
};

/**
 * Build personal recurrence data plus actionable guidance for this month’s pattern.
 */
export const buildRarityFingerprint = (
  chartData: ChartData,
  stack: MonthlyTimingStack,
  activations: StemSiHuaActivation[]
): RarityFingerprint => {
  const daXianName = stack.daXian?.palaceName ?? "none";
  const fingerprintKey = buildFingerprintKey(
    daXianName,
    stack.liuYueLifePalaceName,
    activations
  );

  const birthYear = chartData.input.year;
  const priorOccurrences: Array<{ solarYear: number; lunarMonth: number }> = [];

  for (let year = birthYear; year <= stack.solarYear; year += 1) {
    for (let month = 1; month <= 12; month += 1) {
      if (year === stack.solarYear && month >= stack.lunarMonth) {
        break;
      }
      const pastStack = resolveMonthlyTimingStack(chartData, month, year);
      if (pastStack === null) {
        continue;
      }
      const pastActs = resolveLiuYueStemSiHua(chartData, pastStack);
      const pastDaXian = pastStack.daXian?.palaceName ?? "none";
      const pastKey = buildFingerprintKey(
        pastDaXian,
        pastStack.liuYueLifePalaceName,
        pastActs
      );
      if (pastKey === fingerprintKey) {
        priorOccurrences.push({ solarYear: year, lunarMonth: month });
      }
    }
  }

  const priorCount = priorOccurrences.length;
  const listed = priorOccurrences.slice(-MAX_LISTED_DATES);
  const dateList =
    listed.length === 0
      ? ""
      : listed
        .map((d) => `month ${String(d.lunarMonth)}, ${String(d.solarYear)}`)
        .join("; ");

  const primary = getPrimaryActivation(activations, "Expansion");

  const displayKey =
    primary !== undefined
      ? fingerprintDisplayLabel(
        stack.daXian?.palaceNameEnglish ?? "Unknown decade area",
        stack.liuYueLifeChartPalaceNameEnglish,
        primary.starName,
        primary.kind,
        activationLandingEnglish(primary)
      )
      : [
        `Decade: ${stack.daXian?.palaceNameEnglish ?? "Unknown"}`,
        `Month focus: ${stack.liuYueLifeChartPalaceNameEnglish}`,
      ].join(", ");

  const activationHint =
    primary !== undefined
      ? `${starToEnglish(primary.starName)} with a ${SI_HUA_LABEL[primary.kind]} signal`
      : "this month's focus area";

  const narrative =
    priorCount === 0
      ? `First time this mix has shown up in your whole life (${stack.liuYueLifeChartPalaceNameEnglish.replace(/ Palace$/i, "")}, ${activationHint}).`
      : `This same mix has shown up ${String(priorCount)} time${priorCount === 1 ? "" : "s"} throughout your whole life.`;

  const stackSummary = buildStackSummary(stack, activations);

  const whyNotGeneric = [
    "A generic monthly tip only looks at the calendar.",
    "Yours is built from three personal layers: the longer life chapter you are in, this month's spotlight area, and where the strongest star push lands.",
    "That is why two people reading the same month can get very different advice.",
  ].join(" ");

  const guidance = buildActionableGuidance(
    stack.liuYueLifePalaceNameEnglish,
    stack.liuYueLifeChartPalaceNameEnglish,
    activations,
    priorCount,
    dateList
  );

  return {
    fingerprintKey: displayKey,
    stackSummary,
    priorOccurrences: listed,
    priorCount,
    narrative,
    whatItMeans: guidance.whatItMeans,
    whyNotGeneric,
    usualAsk: guidance.usualAsk,
    usualAskLines: guidance.usualAskLines,
    actionSteps: guidance.actionSteps,
    historyCoach: guidance.historyCoach,
    historyTips: guidance.historyTips,
  };
};
