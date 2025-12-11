/**
 * Season Mapper for Dayun (大运) Analysis
 * 
 * Maps the 12 ZWDS palaces to the 4 seasons based on teaching methodology.
 * Each season represents a different life cycle energy and strategy.
 */

import type { DayunSeason, SeasonColors, PalaceName } from "../../types/dayun";

/**
 * Palace to Season Mapping
 * Based on the Dayun teaching methodology:
 * 
 * 🌱 SPRING (Grow Season): Career, Travel, Friends
 * ☀️ SUMMER (Harvest Season): Wealth, Property, Wellbeing
 * 🍂 AUTUMN (Defend Season): Spouse, Siblings, Children, Parents
 * ❄️ WINTER (Reset Season): Life, Health
 */
export const PALACE_TO_SEASON_MAP: Record<PalaceName, DayunSeason> = {
  // Spring - Grow Season (Expand, Launch, Move)
  "官禄": "spring",      // Career Palace (simplified)
  "官祿": "spring",      // Career Palace (traditional)
  "遷移": "spring",      // Travel Palace (traditional)
  "迁移": "spring",      // Travel Palace (simplified)
  "交友": "spring",      // Friends Palace
  
  // Summer - Harvest Season (Activate, Leverage, Monetize)
  "財帛": "summer",      // Wealth Palace (traditional)
  "财帛": "summer",      // Wealth Palace (simplified)
  "田宅": "summer",      // Property Palace
  "福德": "summer",      // Wellbeing Palace
  
  // Autumn - Defend Season (Cut, Secure, Protect)
  "夫妻": "autumn",      // Spouse Palace
  "兄弟": "autumn",      // Siblings Palace
  "子女": "autumn",      // Children Palace
  "父母": "autumn",      // Parents Palace
  
  // Winter - Reset Season (Reskill, Prepare, Rebuild)
  "命宮": "winter",      // Life Palace (traditional with 宮)
  "命宫": "winter",      // Life Palace (simplified with 宫)
  "疾厄": "winter",      // Health Palace
};

/**
 * Palace name translation (Chinese to English)
 */
export const PALACE_NAMES: Record<PalaceName, string> = {
  "命宮": "Life Palace",
  "命宫": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "財帛": "Wealth Palace",
  "财帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "遷移": "Travel Palace",
  "迁移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "官祿": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Wellbeing Palace",
  "父母": "Parents Palace",
};

/**
 * Season color schemes for UI styling
 */
export const SEASON_COLORS: Record<DayunSeason, SeasonColors> = {
  spring: {
    gradient: "from-green-500 to-emerald-500",
    primary: "#10b981",
    bg: "from-green-50 to-emerald-50",
  },
  summer: {
    gradient: "from-amber-500 to-yellow-500",
    primary: "#f59e0b",
    bg: "from-amber-50 to-yellow-50",
  },
  autumn: {
    gradient: "from-orange-500 to-red-500",
    primary: "#f97316",
    bg: "from-orange-50 to-red-50",
  },
  winter: {
    gradient: "from-blue-500 to-cyan-500",
    primary: "#3b82f6",
    bg: "from-blue-50 to-cyan-50",
  },
};

/**
 * Season icons (emoji representations)
 */
export const SEASON_ICONS: Record<DayunSeason, string> = {
  spring: "🌱",
  summer: "☀️",
  autumn: "🍂",
  winter: "❄️",
};

/**
 * Season titles/themes
 */
export const SEASON_TITLES: Record<DayunSeason, string> = {
  spring: "Expand, Grow, Move",
  summer: "Activate, Leverage, Monetize",
  autumn: "Cut, Secure, Protect",
  winter: "Reskill, Prepare, Rebuild",
};

/**
 * Season core messages
 */
export const SEASON_MESSAGES: Record<DayunSeason, string> = {
  spring: "This is your green light season. The doors open easier. People say yes faster. Launch, expand, and move forward with confidence.",
  summer: "This is your harvest season. Stop waiting and start activating what you already have. It's time to cash in, monetize, and collect the fruits of your work.",
  autumn: "This is your safety net season. Cut emotional noise, patch up holes, and strengthen your foundation. Protect what you've built and prepare for what's next.",
  winter: "This is your reload season. Quietly sharpen your sword, rebuild your arsenal, and prepare yourself. When the season turns, you'll be ready to strike.",
};

/**
 * Get season from palace name
 * 
 * @param palaceName - Chinese palace name (e.g., "夫妻宮", "官祿宮")
 * @returns The corresponding season
 * @throws Error if palace name is not recognized
 */
export function palaceToSeason(palaceName: string): DayunSeason {
  const season = PALACE_TO_SEASON_MAP[palaceName as PalaceName];
  
  if (!season) {
    throw new Error(`Unknown palace name: ${palaceName}`);
  }
  
  return season;
}

/**
 * Get English palace name from Chinese name
 * 
 * @param palaceName - Chinese palace name
 * @returns English palace name
 */
export function getEnglishPalaceName(palaceName: string): string {
  return PALACE_NAMES[palaceName as PalaceName] || palaceName;
}

/**
 * Get season title
 * 
 * @param season - The season
 * @returns Season title/theme
 */
export function getSeasonTitle(season: DayunSeason): string {
  return SEASON_TITLES[season];
}

/**
 * Get season core message
 * 
 * @param season - The season
 * @returns Season core message
 */
export function getSeasonMessage(season: DayunSeason): string {
  return SEASON_MESSAGES[season];
}

/**
 * Check if a palace is in a specific season
 * 
 * @param palaceName - Chinese palace name
 * @param season - Season to check
 * @returns true if palace is in the specified season
 */
export function isPalaceInSeason(palaceName: string, season: DayunSeason): boolean {
  try {
    return palaceToSeason(palaceName) === season;
  } catch {
    return false;
  }
}
