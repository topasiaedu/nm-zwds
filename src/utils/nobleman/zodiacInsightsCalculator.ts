/**
 * Zodiac Insights Calculator
 * 
 * Calculates detailed zodiac insights for nobleman to help users
 * understand and effectively connect with their supportive people.
 */

import type { NoblemanData, OtherAreaData } from "../../types/nobleman";
import type { ZodiacInsights } from "../../constants/zodiacProfiles";
import { getZodiacProfile } from "../../constants/zodiacProfiles";

/**
 * Calculate zodiac insights for the main nobleman (current Dayun cycle)
 * 
 * Takes the nobleman's zodiac and returns detailed personality and interaction
 * guidance to help users recognize and connect with their nobleman.
 * 
 * @param noblemanData - Nobleman data from calculateNoblemanData
 * @returns ZodiacInsights for the nobleman's zodiac, or null if not found
 * 
 * @example
 * ```typescript
 * const noblemanData = calculateNoblemanData(chartData, currentAge);
 * const zodiacInsights = calculateMainZodiacInsights(noblemanData);
 * 
 * if (zodiacInsights) {
 *   console.log(zodiacInsights.coreTraits); // ["Courageous", "Confident", ...]
 * }
 * ```
 */
export function calculateMainZodiacInsights(
  noblemanData: NoblemanData | null
): ZodiacInsights | null {
  if (!noblemanData || !noblemanData.zodiac) {
    return null;
  }
  
  const zodiacProfile = getZodiacProfile(noblemanData.zodiac);
  
  if (!zodiacProfile) {
    console.warn(`Zodiac profile not found for: ${noblemanData.zodiac}`);
    return null;
  }
  
  return zodiacProfile;
}

/**
 * Simplified zodiac data for mini cards (other life areas)
 * Contains just the essential information needed for compact display
 */
export interface ZodiacMiniData {
  /** Life area this zodiac applies to */
  area: string;
  
  /** Zodiac animal name */
  zodiac: string;
  
  /** Chinese character */
  zodiacChinese: string;
  
  /** Core traits (max 3 for mini display) */
  coreTraits: string[];
  
  /** One-line summary of how to recognize them */
  recognitionSummary: string;
  
  /** Gradient for visual styling */
  gradient: string;
}

/**
 * Calculate mini zodiac data for the other 4 life areas
 * 
 * Returns simplified zodiac information suitable for compact card display.
 * Users can click to see full details in a modal.
 * 
 * @param otherAreas - Other area data from calculateOtherLifeAreas
 * @returns Array of ZodiacMiniData for each life area
 * 
 * @example
 * ```typescript
 * const otherAreas = calculateOtherLifeAreas(chartData);
 * const miniData = calculateMiniZodiacInsights(otherAreas);
 * 
 * // miniData[0] = { area: "Career Growth", zodiac: "Rat", ... }
 * ```
 */
export function calculateMiniZodiacInsights(
  otherAreas: OtherAreaData[]
): ZodiacMiniData[] {
  return otherAreas.map((area) => {
    const zodiacProfile = getZodiacProfile(area.zodiac);
    
    if (!zodiacProfile) {
      console.warn(`Zodiac profile not found for: ${area.zodiac}`);
      return {
        area: area.objective,
        zodiac: area.zodiac,
        zodiacChinese: area.zodiac,
        coreTraits: ["Supportive", "Helpful", "Reliable"],
        recognitionSummary: "Look for people with these qualities in your network",
        gradient: area.gradient,
      };
    }
    
    // Take only first 3 traits for mini display
    const coreTraits = zodiacProfile.coreTraits.slice(0, 3);
    
    // Create a one-line summary from first recognition sign
    const recognitionSummary = zodiacProfile.recognitionSigns[0] || 
      "Look for these traits in your network";
    
    return {
      area: area.objective,
      zodiac: zodiacProfile.zodiac,
      zodiacChinese: zodiacProfile.zodiacChinese,
      coreTraits,
      recognitionSummary,
      gradient: area.gradient,
    };
  });
}

/**
 * Get full zodiac insights by zodiac name
 * 
 * Utility function to retrieve complete zodiac profile for modal display.
 * Used when user clicks on a mini card to see full details.
 * 
 * @param zodiacName - English zodiac name (e.g., "Tiger", "Dragon")
 * @returns ZodiacInsights or null if not found
 * 
 * @example
 * ```typescript
 * const fullInsights = getFullZodiacInsights("Dragon");
 * // Returns complete personality breakdown, communication style, etc.
 * ```
 */
export function getFullZodiacInsights(zodiacName: string): ZodiacInsights | null {
  return getZodiacProfile(zodiacName);
}

