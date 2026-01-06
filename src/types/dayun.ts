/**
 * Type definitions for Dayun (大运) 10-Year Cycle Analysis
 * 
 * Dayun represents the major life cycles in Zi Wei Dou Shu astrology.
 * Each person goes through different 10-year cycles that determine
 * the season (Spring/Summer/Autumn/Winter) they are in.
 */

/**
 * Four seasons representing different life cycle energies
 * - Spring: Growth, expansion, new beginnings (Grow Season)
 * - Summer: Harvest, monetization, collecting rewards (Harvest Season)
 * - Autumn: Defense, protection, cutting unnecessary (Defend Season)
 * - Winter: Reset, rebuilding, preparation (Reset Season)
 */
export type DayunSeason = "spring" | "summer" | "autumn" | "winter";

/**
 * Three phases within each 10-year cycle
 * - Building: Years 1-3 - Foundation phase
 * - Peak: Years 4-6 - Maximum energy and intensity
 * - Integration: Years 7-10 - Consolidation and preparation for next cycle
 */
export type DayunPhase = "building" | "peak" | "integration";

/**
 * Basic Dayun cycle information
 */
export interface DayunCycle {
  /** Starting year of the 10-year cycle */
  startYear: number;
  
  /** Ending year of the 10-year cycle */
  endYear: number;
  
  /** Current year (for progress tracking) */
  currentYear: number;
  
  /** English name of the palace (e.g., "Spouse Palace", "Career Palace") */
  palace: string;
  
  /** Chinese name of the palace (e.g., "夫妻宮", "官祿宮") */
  palaceChinese: string;
  
  /** Season this palace represents */
  season: DayunSeason;
  
  /** Season title/theme (e.g., "Cut, Secure, Protect" for Autumn) */
  seasonTitle: string;
  
  /** Core message explaining what this cycle means */
  coreMessage: string;
  
  /** Key actions to take during this cycle */
  keyActions: string[];
  
  /** Things to watch out for / avoid during this cycle */
  watchOut: string[];
}

/**
 * Extended Dayun cycle with additional context and guidance
 */
export interface DayunCycleExtended extends DayunCycle {
  /** Information about the previous 10-year cycle */
  previousCycle?: {
    years: string;
    season: DayunSeason;
    palace: string;
  };
  
  /** Information about the next 10-year cycle */
  nextCycle?: {
    years: string;
    season: DayunSeason;
    palace: string;
  };
  
  /** Metrics to measure success during this cycle */
  successMetrics: string[];
  
  /** Reflection questions to help user examine their situation */
  reflectionQuestions: string[];
  
  /** Current phase within the 10-year cycle */
  phase: DayunPhase;
}

/**
 * Season color configuration for UI styling
 */
export interface SeasonColors {
  gradient: string;
  primary: string;
  bg: string;
}

/**
 * Palace name mapping (Chinese names as they appear in chart data)
 * Includes both simplified and traditional character variants
 */
export type PalaceName = 
  | "命宮"     // Life Palace (traditional with 宮)
  | "命宫"     // Life Palace (simplified with 宫)
  | "兄弟"     // Siblings Palace
  | "夫妻"     // Spouse Palace
  | "子女"     // Children Palace
  | "財帛"     // Wealth Palace (traditional)
  | "财帛"     // Wealth Palace (simplified)
  | "疾厄"     // Health Palace
  | "遷移"     // Travel Palace (traditional)
  | "迁移"     // Travel Palace (simplified)
  | "交友"     // Friends Palace
  | "官禄"     // Career Palace (simplified 禄)
  | "官祿"     // Career Palace (traditional 祿)
  | "田宅"     // Property Palace
  | "福德"     // Wellbeing Palace
  | "父母";    // Parents Palace
