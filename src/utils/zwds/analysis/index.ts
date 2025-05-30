/**
 * Index file for all ZWDS chart analysis functions
 */

// Export career analysis
export { analyzeCareer, analyzeCareerLegacy } from "./careerAnalysis";

// Export health analysis
export { analyzeHealth } from "./healthAnalysis";

// Export palace utilities
export { getStarsInPalace } from "./palaceUtils";
export type { StarPosition } from "./palaceUtils";

// Export Four Key Palace analysis
export { 
  analyzeFourKeyPalaces,
  getConstantTransformationInfo,
  getPalaceMeaningFromConstants,
  getPalaceKeywordFromConstants,
  isValidPalaceName,
  transformationTypes,
  traditionToSimplified,
  palaceNameMapping,
} from "./fourKeyPalaceAnalysis";

// Export types from Four Key Palace analysis
export type {
  PalaceName,
  TransformationType,
  TransformationKey,
  TransformationInfo,
  TraditionToSimplifiedMap,
  PalaceNameMapping
} from "./fourKeyPalaceAnalysis";

// Export Destiny Alert analysis
export {
  analyzeDestinyAlert,
  getDestinyAlertDebugInfo,
} from "./destinyAlertAnalysis";

// Export types from Destiny Alert analysis
export type {
  PalaceAlertData,
  DestinyAlertAnalysisResult,
} from "./destinyAlertAnalysis";

// Export Life Areas analysis
export {
  calculateLifeAreaScores,
  analyzeLifeAreas,
  getScoreBadgeClasses,
  getStarTypeBadgeClasses,
  palaceNameMap,
  palaceIconMap,
} from "./lifeAreasAnalysis";

// Export types from Life Areas analysis
export type {
  StarAnalysis,
  AreaAnalysis,
  LifeAreasConstants,
  ChartStar,
  AnalysisPalace,
  ChartDataType,
  LifeAreaResult,
  RadarDataPoint
} from "./lifeAreasAnalysis";

// Export Summary analysis
export { analyzeSummary } from "./summaryAnalysis";

// Export types from Summary analysis
export type { SummaryAnalysisResult } from "./summaryAnalysis";

// Export watchout analysis
export { analyzeWatchouts } from "./watchoutAnalysis"; 