import { useMemo } from "react";
import type { ChartData, ChartInput } from "../../../utils/zwds/types";
import type { Profile } from "../../../context/ProfileContext";
import { ZWDSCalculator } from "../../../utils/zwds/calculator";
import { analyzeWealthCode } from "../../../utils/zwds/analysis/wealthCodeAnalysis";
import { calculateCurrentDayunCycle } from "../../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../../utils/dayun/guidanceGenerator";
import { detectStructure } from "../../../utils/zwds/analysis/structureAnalysis";
import {
  getPalaceForAspectLiuMonth,
  getLiuMonthAnchorFromLocalDate,
} from "../../../utils/destiny-navigator/palace-resolver";
import {
  PALACE_DATA,
  getSignalColor,
  SIGNAL_LABELS,
  type SignalColor,
} from "../../../utils/forecast/alignmentTimingData";
import { PHASE_LABELS } from "../../../utils/dayun/seasonMapper";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";
import type { DayunCycleExtended } from "../../../types/dayun";
import { parseBirthHour } from "../shared/helpers/parseBirthHour";
import { buildTimingRows } from "./buildTimingRows";
import type { AlignmentAdvantageData, StrategicData } from "./types";

/**
 * Computes chart data from a profile record.
 */
export function computeChartFromProfile(profile: Profile): ChartData | null {
  try {
    const d = new Date(`${profile.birthday}T12:00:00`);
    const input: ChartInput = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
      hour: parseBirthHour(String(profile.birth_time)),
      gender: profile.gender === "male" ? "male" : "female",
      name: profile.name,
    };
    return new ZWDSCalculator(input).calculate();
  } catch {
    return null;
  }
}

/**
 * Builds the strategic snapshot bundle from chart data.
 */
export function buildStrategicData(chartData: ChartData): StrategicData {
  const wealthProfile = analyzeWealthCode(chartData);
  const rawDayun = calculateCurrentDayunCycle(chartData);
  const dayun: DayunCycleExtended | null = rawDayun ? generateDayunGuidance(rawDayun) : null;

  const { solarYear, lunarMonth } = getLiuMonthAnchorFromLocalDate();
  const palaceNum = getPalaceForAspectLiuMonth("life", chartData, lunarMonth, solarYear);
  const palace = palaceNum !== null ? chartData.palaces[palaceNum - 1] : null;
  const palaceData = palace ? PALACE_DATA[palace.name] : null;
  const signal: SignalColor = palaceData ? getSignalColor(palaceData.stars) : "yellow";

  return {
    wealthProfile,
    dayun,
    wealthArchetype: wealthProfile.dominantArchetype ?? "Your Wealth Code",
    season: dayun?.season ?? null,
    phaseLabel: PHASE_LABELS[dayun?.season ?? "spring"] ?? "Expansion",
    signal,
    signalLabel: SIGNAL_LABELS[signal],
    monthName: new Date().toLocaleString("en-US", { month: "long" }),
    palaceArea: palaceData?.area ?? "",
    palacePriority: palaceData?.priority ?? "",
    timingAligned: signal === "green",
    wealthAligned: (wealthProfile.codes[0]?.score ?? 0) >= 5,
  };
}

/**
 * Pure builder: all Alignment Advantage derived data from a chart.
 */
export function buildAlignmentAdvantageData(chartData: ChartData): AlignmentAdvantageData {
  const strategicData = buildStrategicData(chartData);
  const structureResult = detectStructure(chartData, "natal");
  const wealthAnalysis = strategicData.wealthProfile;
  const wealthKey: WealthCodeKey =
    (wealthAnalysis.codes[0]?.key as WealthCodeKey | undefined) ?? "investmentBrain";

  const { solarYear, lunarMonth } = getLiuMonthAnchorFromLocalDate();
  const palaceNum = getPalaceForAspectLiuMonth("life", chartData, lunarMonth, solarYear);
  const palace = palaceNum !== null ? chartData.palaces[palaceNum - 1] : null;
  const currentMonthPalaceData = palace ? (PALACE_DATA[palace.name] ?? null) : null;

  return {
    chartData,
    structureResult,
    strategicData,
    wealthAnalysis,
    wealthKey,
    dayunGuidance: strategicData.dayun,
    currentMonthPalaceData,
    timingRows: buildTimingRows(chartData),
  };
}

/**
 * React hook: profile → full Alignment Advantage dataset.
 */
export function useAlignmentAdvantageData(profile: Profile | null): AlignmentAdvantageData | null {
  const chartData = useMemo(
    () => (profile !== null ? computeChartFromProfile(profile) : null),
    [profile]
  );

  return useMemo(
    () => (chartData !== null ? buildAlignmentAdvantageData(chartData) : null),
    [chartData]
  );
}
