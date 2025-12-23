/**
 * Type definitions for Destiny Navigator feature
 * 
 * This module defines the core types for the Destiny Navigator,
 * which provides an interactive interface for analyzing different
 * life aspects across various timeframes.
 */

/**
 * Life aspect categories that can be analyzed
 * Corresponds to the 12 palaces in Zi Wei Dou Shu
 */
export type LifeAspect = 
  | "life"          // 命宫 - Life Palace
  | "siblings"      // 兄弟 - Siblings
  | "relationships" // 夫妻 - Spouse/Marriage
  | "children"      // 子女 - Children
  | "wealth"        // 财帛 - Wealth
  | "health"        // 疾厄 - Health
  | "travel"        // 迁移 - Travel/Migration
  | "social"        // 交友 - Friends
  | "career"        // 官禄 - Career
  | "home"          // 田宅 - Property
  | "fortune"       // 福德 - Fortune/Blessings
  | "parents";      // 父母 - Parents

/**
 * Timeframe periods for analysis
 */
export type TimeFrame = "natal" | "dayun" | "liunian" | "liumonth";

/**
 * Navigation stages in the Destiny Navigator flow
 */
export type NavigatorStage = "portal" | "aspect" | "timeframe" | "dayunPeriod" | "monthSelection" | "analysis";

/**
 * Dayun period selection (current or next 10-year cycle)
 */
export type DayunPeriod = "current" | "next";

/**
 * State management interface for Navigator progression
 */
export interface NavigatorState {
  currentStage: NavigatorStage;
  selectedAspect: LifeAspect | null;
  selectedTimeframe: TimeFrame | null;
  selectedDayunPeriod?: DayunPeriod; // Only set when timeframe is "dayun"
  selectedMonth?: number; // Only set when timeframe is "liumonth" (1-12)
  profileId: string;
}

/**
 * Configuration for a life aspect with UI and mapping details
 */
export interface AspectConfig {
  key: LifeAspect;
  label: string;
  icon: string;
  description: string;
  palaceName: string; // Chinese palace name (e.g., "命宫", "财帛")
}

/**
 * Configuration for a timeframe period with UI details
 */
export interface TimeframeConfig {
  key: TimeFrame;
  label: string;
  icon: string;
  description: string;
}
