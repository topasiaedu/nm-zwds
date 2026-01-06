/**
 * Type definitions for Nobleman Analysis
 * 
 * Nobleman identification system based on ZWDS astrology that helps users
 * identify key supportive people in their life based on their current
 * life cycle (Dayun) and chart structure.
 */

/**
 * Ten nobleman profile types based on star characteristics
 * Each type represents a different kind of supportive person
 */
export type NoblemanType = 
  | "older_female"           // Tai Yin (太陰)
  | "male"                   // Tai Yang (太陽)
  | "stable_resource"        // Tian Fu / Tian Liang (天府/天梁)
  | "younger_junior"         // Tian Tong (天同)
  | "same_generation"        // Tian Ji (天機)
  | "authority_high_status"  // Zi Wei / Lian Zhen / Tian Xiang (紫微/廉貞/天相)
  | "practical_leader"       // Wu Qu (武曲)
  | "bold_aggressive"        // Qi Sha / Po Jun (七殺/破軍)
  | "charismatic_expressive" // Tan Lang / Ju Men (貪狼/巨門)
  | "refined_educated";      // Zuo Fu / You Bi / Wen Chang / Wen Qu (左輔/右弼/文昌/文曲)

/**
 * A single nobleman profile with detailed characteristics
 */
export interface NoblemanProfile {
  /** Display name (e.g., "Authority / High-Status Nobleman") */
  type: string;
  
  /** Detailed description of this nobleman type's characteristics */
  characteristics: string;
  
  /** Star names associated with this profile (e.g., "Zi Wei, Lian Zhen, Tian Xiang") */
  stars: string;
}

/**
 * Complete nobleman data for a specific palace
 * This is the main data structure used for the nobleman analysis
 */
export interface NoblemanData {
  /** English palace name (e.g., "Spouse Palace") */
  palaceName: string;
  
  /** Chinese palace name (e.g., "夫妻宮") */
  palaceChinese: string;
  
  /** English zodiac name (e.g., "Tiger") */
  zodiac: string;
  
  /** Chinese zodiac character (e.g., "寅") */
  zodiacChinese: string;
  
  /** Array of 5 most recent birth years for this zodiac (e.g., [1974, 1986, 1998, 2010, 2022]) */
  yearExamples: number[];
  
  /** 1-2 matched nobleman profiles for this palace */
  matchedProfiles: NoblemanProfile[];
  
  /** Original earthly branch from the palace (e.g., "寅") */
  earthlyBranch: string;
}

/**
 * Nobleman data for other life areas (simplified)
 * Used for the "Other Life Areas" grid display
 */
export interface OtherAreaData {
  /** Life objective/area (e.g., "Career Growth", "Wealth Building") */
  objective: string;
  
  /** English palace name */
  palaceName: string;
  
  /** Chinese palace name */
  palaceChinese: string;
  
  /** English zodiac name */
  zodiac: string;
  
  /** Formatted year examples as string (e.g., "1972, 1984, 1996") */
  yearExamples: string;
  
  /** Primary nobleman type name */
  noblemanType: string;
  
  /** Tailwind gradient class for visual styling (e.g., "from-blue-500 to-cyan-500") */
  gradient: string;
}

/**
 * Zodiac information for mapping earthly branches
 */
export interface ZodiacInfo {
  /** English zodiac name */
  english: string;
  
  /** Chinese zodiac character */
  chinese: string;
  
  /** Earthly branch character */
  branch: string;
}
