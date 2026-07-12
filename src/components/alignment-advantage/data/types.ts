import type { ChartData } from "../../../utils/zwds/types";
import type { WealthCodeAnalysisResult } from "../../../utils/zwds/analysis/wealthCodeAnalysis";
import type { StructureAnalysisResult } from "../../../utils/zwds/analysis/structureAnalysis";
import type { DayunCycleExtended } from "../../../types/dayun";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";
import type { SignalColor } from "../../../utils/forecast/alignmentTimingData";
import type { PalaceTimingData } from "../../../utils/forecast/alignmentTimingData";
import type { Profile } from "../../../context/ProfileContext";
import type { getSignalColor } from "../../../utils/forecast/alignmentTimingData";

/** One row in the 12-month print timing table. */
export interface TimingRow {
  month: string;
  palaceName: string;
  season: string;
  signal: ReturnType<typeof getSignalColor>;
  priority: string;
  directive: string;
  watchOut: [string, string];
}

/** Strategic snapshot shared by web chapters and print sections. */
export interface StrategicData {
  wealthProfile: WealthCodeAnalysisResult;
  dayun: DayunCycleExtended | null;
  wealthArchetype: string;
  season: string | null;
  phaseLabel: string;
  signal: SignalColor;
  signalLabel: string;
  monthName: string;
  palaceArea: string;
  palacePriority: string;
  timingAligned: boolean;
  wealthAligned: boolean;
}

/** Full computed dataset for Alignment Advantage (web + print). */
export interface AlignmentAdvantageData {
  chartData: ChartData;
  structureResult: StructureAnalysisResult;
  strategicData: StrategicData;
  wealthAnalysis: WealthCodeAnalysisResult;
  wealthKey: WealthCodeKey;
  dayunGuidance: DayunCycleExtended | null;
  currentMonthPalaceData: PalaceTimingData | null;
  timingRows: TimingRow[];
}

export interface AlignmentAdvantageDataInput {
  profile: Profile | null;
  chartData: ChartData | null;
}
