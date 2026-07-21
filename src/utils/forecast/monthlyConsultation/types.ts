/**
 * Types for the Premium Monthly Consultation (Liu Yue) report bundle.
 */

import type { DayunSeason } from "../../../types/dayun";
import type { NoblemanData } from "../../../types/nobleman";
import type { LiuMonthSeason, DimensionBar, PalaceGuidanceData } from "../timing/liuMonthGuidance";

/** Si Hua activation kind (simplified characters to match UI conventions). */
export type SiHuaKind = "化禄" | "化权" | "化科" | "化忌";

/** One Si Hua landing derived from a palace heavenly stem. */
export interface StemSiHuaActivation {
  kind: SiHuaKind;
  starName: string;
  landingPalaceName: string;
  landingPalaceNumber: number;
}

/** Natal star snapshot for one physical palace. */
export interface MonthlyStarSnapshot {
  palaceNumber: number;
  palaceName: string;
  palaceNameEnglish: string;
  mainStars: string[];
  natalTransforms: Array<{ starName: string; kind: SiHuaKind }>;
}

/**
 * How Part 4 ("Your chart") resolves stars for the Liu Yue Life focus.
 * Empty focus palaces borrow opposite-palace main stars (借星安宫).
 */
export type FocusStarSourceMode = "natal" | "borrowed" | "open";

/** Resolved star source for the month focus spotlight chapter. */
export interface FocusStarSource {
  /** natal = stars in focus; borrowed = opposite palace; open = neither has main stars */
  mode: FocusStarSourceMode;
  /** Stars to display (focus natal or opposite borrow) */
  displayMainStars: string[];
  /** English name of the Liu Yue Life focus palace */
  focusPalaceNameEnglish: string;
  /** English name of the opposite palace when mode is borrowed */
  borrowedFromPalaceNameEnglish: string | null;
}

/** Resolved Da Xian / Liu Nian / Liu Yue timing stack for one lunar month. */
export interface MonthlyTimingStack {
  solarYear: number;
  lunarMonth: number;
  liuYueLifePalaceNumber: number;
  liuYueLifePalaceName: string;
  liuYueLifePalaceNameEnglish: string;
  liuYueMonthPalaceNumber: number;
  liuNianPalaceNumber: number | null;
  liuNianPalaceName: string | null;
  liuNianPalaceNameEnglish: string | null;
  daXian: {
    palaceNumber: number;
    palaceName: string;
    palaceNameEnglish: string;
    yearInCycle: number;
    season: DayunSeason;
    phase: string;
    startYear: number;
    endYear: number;
  } | null;
  liuYueSeason: DayunSeason;
  liuNianSeason: DayunSeason | null;
}

/** Convergence score between Da Xian, Liu Nian, and Liu Yue seasons. */
export interface ConvergenceResult {
  score: number;
  band: "aligned" | "partial" | "clash";
  label: string;
  summary: string;
  /** Plain explainer: what the number measures (not luck). */
  scoreExplainer: string;
  /** One-line decode of this score band for the customer. */
  bandMeaning: string;
  /** Short bullets: what agrees / clashes / how to act */
  tips: string[];
  daXianSeason: DayunSeason | null;
  liuNianSeason: DayunSeason | null;
  liuYueSeason: DayunSeason;
}

/** Personal rarity / recurrence of this month’s fingerprint. */
export interface RarityFingerprint {
  /** English display label for the stack (not used for matching). */
  fingerprintKey: string;
  /** Labeled plain-English stack lines: decade, month focus, main activation. */
  stackSummary: string[];
  priorOccurrences: Array<{ solarYear: number; lunarMonth: number }>;
  priorCount: number;
  /** Short proof line (history count), kept secondary to guidance. */
  narrative: string;
  /** Plain-language meaning of this month’s pattern. */
  whatItMeans: string;
  /** Why this configuration is personal to the chart, not generic calendar advice. */
  whyNotGeneric: string;
  /** Concrete ask for this palace + primary activation (theme, move, avoid). */
  usualAsk: string;
  /** Scannable bullets for the usual-ask section. */
  usualAskLines: string[];
  /** Concrete steps the reader can take this month. */
  actionSteps: string[];
  /** Lead history coaching line (or first-time framing). */
  historyCoach: string;
  /** Scannable history tips: how to use priors, or first-time notes. */
  historyTips: string[];
}

/** Named archetype for the month (content library + Si Hua injection). */
export interface MonthArchetype {
  code: string;
  name: string;
  description: string;
  identityLine: string;
  signatureBehaviors: string[];
}

/** Named failure mode for the month. */
export interface FailureMode {
  name: string;
  triggerCode: string;
  description: string;
  howItShows: string[];
  exitMove: string;
}

/**
 * Scannable month plan for the cover: one move, deadline, success, anti-pattern.
 * Data-driven from palace exit move, guidance, and season (not static marketing).
 */
export interface MonthContract {
  /** Primary action for the month (aligned with failure exit move) */
  primaryMove: string;
  /** Concrete timing checkpoint (no invented calendar dates) */
  deadline: string;
  /** One verifiable outcome from palace success metrics */
  successMeasure: string;
  /** Named trap or watch-out: what not to do */
  antiPattern: string;
}

/**
 * Four-way decision verdict for the Should I…? board.
 * Hard Yes / Soft Yes / Wait / No, not soft "Good timing" for everything.
 */
export type DecisionVerdict = "hard-yes" | "soft-yes" | "wait" | "no";

/** One row in the decision simulator. */
export interface DecisionRow {
  decision: string;
  rating: DecisionVerdict;
  /** One chart-reason line (season / activation / focus palace). */
  why: string;
  /** Short action coaching. */
  coaching: string;
}

/** Somatic / body signal framing for the health chapter. */
export interface SomaticSignal {
  elementPressure: string;
  weekSignals: Array<{ week: string; signal: string }>;
  protocol: string[];
}

/**
 * Operational close-out for the letter chapter:
 * one decision, deadline, success measure, and next-month bridge.
 */
export interface OperationalClose {
  /** The one decision for this month (aligned with primary move / exit move) */
  decision: string;
  /** By-when checkpoint (no invented calendar dates) */
  deadline: string;
  /** How you know the decision worked */
  successMeasure: string;
  /** Next Liu Yue palace focus plus unfinished debt not to inherit */
  nextMonthBridge: string;
  /** Optional one line finishing last month's bridge (when priorMonth exists) */
  priorBridgeNote: string | null;
}

/** Personal letter synthesis for the close. */
export interface PersonalLetter {
  greeting: string;
  bodyParagraphs: string[];
  closing: string;
  /** Required plan close: decision, by when, success, next-month bridge */
  operationalClose: OperationalClose;
}

/** Static playbook slice for the activated palace. */
export interface MonthlyBriefingContent {
  season: LiuMonthSeason;
  area: string;
  priority: string;
  dimensionBars: [DimensionBar, DimensionBar, DimensionBar, DimensionBar];
  guidance: PalaceGuidanceData;
  primaryGoal: string;
}

/** Dimension scorecard with adjacent-month trend. */
export interface DimensionScorecard {
  label: string;
  pct: number;
  priorPct: number;
  nextPct: number;
  trendVsPrior: "up" | "down" | "flat";
  trendIntoNext: "up" | "down" | "flat";
  mechanism: string;
}

/** Lightweight prior-month summary for the Track Record chapter. */
export interface PriorMonthBriefing {
  solarYear: number;
  lunarMonth: number;
  palaceNameEnglish: string;
  season: LiuMonthSeason;
  priority: string;
  primaryGoal: string;
  failureModeName: string;
  bridgeNarrative: string;
}

/** Year climate row for continuity chapter. */
export interface YearClimateRow {
  lunarMonth: number;
  palaceNameEnglish: string;
  season: LiuMonthSeason;
  priority: string;
  isCurrent: boolean;
}

/** Per life area do/don't playbook (career / wealth / relationships). */
export interface AspectLifePlaybook {
  /** Short English context for this area this month */
  context: string;
  /** Ranked Do actions (at most 3), chart-tied for this month */
  doThis: string[];
  /** Ranked Avoid items (at most 3), chart-tied for this month */
  watchOut: string[];
  /** One coach note for the aspect chapter tip */
  coachTip: string;
}

/** One activation explained as a next move. */
export interface ActivationCard {
  title: string;
  landing: string;
  meaning: string;
  move: string;
  /** 1-based urgency rank after shared hierarchy sort. */
  urgencyRank: number;
  /** Scannable rank label, e.g. "1 · Lead signal". */
  urgencyLabel: string;
}

/** Natal star cue, borrowed opposite-palace cue, or open-palace teaching row. */
export type StarSpotlightKind = "star" | "borrowed-star" | "empty-meaning";

/** Natal / borrowed star cue for the month focus palace. */
export interface StarSpotlightRow {
  /** Row kind: natal star, borrowed opposite star, or open-palace teaching block */
  kind: StarSpotlightKind;
  star: string;
  cue: string;
}

/** Exact words / script for a common month situation. */
export interface MonthScript {
  situation: string;
  sayThis: string;
}

/** Energy or people pattern to limit this month. */
export interface CautionItem {
  label: string;
  why: string;
}

/** One week in the month action calendar (body signals live in Body chapter). */
export interface WeekPlanRow {
  window: string;
  quality: string;
  useFor: string;
}

/** Full bundle consumed by the Document Viewer and PDF. */
export interface MonthlyConsultationBundle {
  profileName: string;
  solarYear: number;
  lunarMonth: number;
  monthLabel: string;
  headline: string;
  stack: MonthlyTimingStack;
  lifePalaceStars: MonthlyStarSnapshot;
  /** How focus stars were resolved (natal, opposite borrow, or fully open). */
  focusStarSource: FocusStarSource;
  aspectPalaces: {
    career: MonthlyStarSnapshot | null;
    wealth: MonthlyStarSnapshot | null;
    relationships: MonthlyStarSnapshot | null;
    health: MonthlyStarSnapshot | null;
  };
  /** Distinct guidance per life area (not the month Life Palace briefing). */
  aspectPlaybooks: {
    career: AspectLifePlaybook;
    wealth: AspectLifePlaybook;
    relationships: AspectLifePlaybook;
  };
  stemActivations: StemSiHuaActivation[];
  activationCards: ActivationCard[];
  starSpotlight: StarSpotlightRow[];
  scripts: MonthScript[];
  cautionList: CautionItem[];
  weekPlan: WeekPlanRow[];
  convergence: ConvergenceResult;
  rarity: RarityFingerprint;
  briefing: MonthlyBriefingContent;
  /** Cover month plan: move, deadline, success measure, anti-pattern */
  monthContract: MonthContract;
  scorecard: DimensionScorecard[];
  /** One protect/press coach line derived from this month's scorecard bars */
  scorecardProtectPress: string;
  archetype: MonthArchetype;
  failureMode: FailureMode;
  decisions: DecisionRow[];
  somatic: SomaticSignal;
  letter: PersonalLetter;
  nobleman: NoblemanData | null;
  priorMonth: PriorMonthBriefing | null;
  yearClimate: YearClimateRow[];
  weekWindows: Array<{ window: string; quality: string; useFor: string }>;
}
