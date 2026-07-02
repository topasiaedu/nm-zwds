/**
 * Type definitions for the Annual ZWDS 运势 Report engine.
 * Separate from forecast/ types — used only by the annual-report pipeline.
 */

import type { Transformation } from "../zwds/types";
import type { EarthlyBranchType, HeavenlyStemType } from "../zwds/types";

/** Report subject birth details. */
export interface ReportSubject {
  name: string;
  birthday: string;
  birthTime: string;
  gender: "male" | "female";
}

/** Trend arrow for domain matrix rows. */
export type DomainTrend = "up" | "stable" | "down";

/** Branch harmony classification for timing windows. */
export type BranchHarmonyType =
  | "favorable"
  | "supportive"
  | "watchful"
  | "challenging"
  | "neutral";

/** Four transformation activation kinds. */
export type TransformationKind = Transformation;

/** Summary of a palace in the report. */
export interface PalaceSummary {
  number: number;
  name: string;
  englishName: string;
  heavenlyStem: string;
  earthlyBranch: string;
  mainStars: string[];
}

/** One resolved 四化 activation landing in a palace. */
export interface TransformationActivation {
  kind: TransformationKind;
  starName: string;
  targetPalaceName: string;
  targetPalaceNumber: number;
  sourceLabel: string;
}

/** Annual 流年四化 bundle. */
export interface LiuYearTransformations {
  reportYear: number;
  yearPalaceNumber: number;
  yearHeavenlyStem: HeavenlyStemType;
  yearEarthlyBranch: EarthlyBranchType;
  activations: TransformationActivation[];
}

/** Monthly 流月四化 bundle. */
export interface LiuMonthTransformationSet {
  lunarMonth: number;
  monthPalaceNumber: number;
  monthPalaceName: string;
  monthHeavenlyStem: HeavenlyStemType;
  monthEarthlyBranch: EarthlyBranchType;
  activations: TransformationActivation[];
}

/** Domain keys used in scoring and year map. */
export type ReportDomainKey =
  | "career"
  | "wealth"
  | "love"
  | "health"
  | "family"
  | "network"
  | "inner"
  | "external";

/** One domain score for a month (1–5 stars). */
export interface DomainScore {
  domain: ReportDomainKey;
  domainLabel: string;
  palaceName: string;
  score: number;
  reason: string;
}

/** Activation summary for monthly key activations block. */
export interface ActivationSummary {
  palaceName: string;
  palaceEnglish: string;
  reason: string;
  transformationKinds: TransformationKind[];
}

/** Life area cluster content (blocks A–D). */
export interface LifeAreaClusters {
  selfAndMindset: string;
  workAndMoney: string;
  peopleAndLove: string;
  bodyHomeAndWorld: string;
}

/** See · Hear · Do block. */
export interface SeeHearDo {
  see: string[];
  hear: string[];
  mustDo: string[];
  avoid: string[];
  bestTiming: string;
}

/** Grow Stronger block. */
export interface GrowStronger {
  characterFocus: string;
  practice: string;
  pressureNote: string;
}

/** Timing note block. */
export interface TimingNote {
  favorableWindow: string;
  cautionWindow: string;
  branchHarmony: BranchHarmonyType;
  branchExplanation: string;
}

/** Month snapshot block (①). */
export interface MonthSnapshot {
  theme: string;
  energy: string;
  keyword: string;
  yearLink: string;
  palaceFocus: string;
  ratings: {
    career: number;
    wealth: number;
    love: number;
    health: number;
  };
}

/** Plain language focus guide for Part 2 (no chart jargon). */
export interface MonthFocusGuide {
  summary: string;
  focusHere: string[];
  beCarefulHere: string[];
}

/** One month entry in the annual report. */
export interface AnnualMonthEntry {
  lunarMonth: number;
  lunarMonthLabel: string;
  solarDateRange: string;
  snapshot: MonthSnapshot;
  liuMonthPalace: PalaceSummary;
  liuMonthTransformations: TransformationActivation[];
  domainScores: DomainScore[];
  keyActivations: ActivationSummary[];
  starCombinationInsights: string[];
  monthFocusGuide: MonthFocusGuide;
  lifeAreaClusters: LifeAreaClusters;
  seeHearDo: SeeHearDo;
  growStronger: GrowStronger;
  timingNote: TimingNote;
}

/** Opportunity or risk row. */
export interface OpportunityRiskItem {
  title: string;
  detail: string;
  posture: string;
}

/** Annual story for Part 1. */
export interface AnnualStory {
  yearTheme: string;
  annualKeyword: string;
  energyArc: string;
  /** Quarter-by-quarter energy summary from monthly scores. */
  quarterlyArc: QuarterlyEnergyArc[];
  liuYearTransformations: TransformationActivation[];
  opportunities: OpportunityRiskItem[];
  risks: OpportunityRiskItem[];
}

/** One quarter energy summary. */
export interface QuarterlyEnergyArc {
  quarter: string;
  label: string;
  averageScore: number;
  summary: string;
}

/** Report metadata for cover and delivery. */
export interface ReportMeta {
  lunarYearLabel: string;
  stemBranchLabel: string;
  yearPalaceNumber: number;
  disclaimer: string;
}

/** Domain matrix row for Part 1. */
export interface DomainRow {
  domain: ReportDomainKey;
  domainLabel: string;
  palaceName: string;
  yearTrend: DomainTrend;
  focusThisYear: string;
  avoidThisYear: string;
  yearScore: number;
}

/** Year map heatmap row. */
export interface YearMapMonthRow {
  lunarMonthLabel: string;
  solarDateRange: string;
  career: number;
  wealth: number;
  love: number;
  health: number;
  keyword: string;
}

/** Best/challenging month category. */
export interface MonthCategoryEntry {
  months: string[];
  why: string;
  strategy: string;
}

/** Annual playbook for Part 3. */
export interface AnnualPlaybook {
  annualGoals: string[];
  guardrails: string[];
  monthlyKeywords: string[];
  q1StarterPlan: string[];
  rereadGuide: string[];
  closingLine: string;
}

/** Year map synthesis for Part 3. */
export interface YearMapData {
  overviewRows: YearMapMonthRow[];
  bestMonths: {
    career: MonthCategoryEntry;
    wealth: MonthCategoryEntry;
    love: MonthCategoryEntry;
    health: MonthCategoryEntry;
    mostChallenging: MonthCategoryEntry;
  };
  turningPoints: string[];
  goldenWindows: string[];
  cautionCalendar: string[];
  playbook: AnnualPlaybook;
}

/** Full annual report payload. */
export interface AnnualRunReport {
  subject: ReportSubject;
  reportYear: number;
  generatedAt: string;
  reportMeta: ReportMeta;
  annualStory: AnnualStory;
  domainMatrix: DomainRow[];
  months: AnnualMonthEntry[];
  yearMap: YearMapData;
}
