/**
 * Nobleman Calculator
 * 
 * Main nobleman analysis calculator that implements the 3-step methodology:
 * 1. Get current Dayun palace (from existing Dayun analysis)
 * 2. Extract earthly branch → map to Chinese zodiac
 * 3. Identify stars in that palace → match to nobleman profiles
 */

import type { ChartData, Palace } from "../zwds/types";
import type { NoblemanData, OtherAreaData } from "../../types/nobleman";
import { mapEarthlyBranchToZodiac, generateRecentYears, formatYearExamples } from "./zodiacMapper";
import { matchStarsToProfiles } from "./profileMatcher";
import { KEY_LIFE_AREAS, PALACE_NAME_TRANSLATIONS } from "../../constants/noblemanProfiles";
import { OPPOSITE_PALACE_INFLUENCE } from "../zwds/constants";

/**
 * Check if a palace has ANY stars at all (not just nobleman stars)
 * 
 * @param palace - Palace to check
 * @returns True if the palace has any main stars or auxiliary stars
 */
function hasAnyStars(palace: Palace): boolean {
  const hasMainStars = palace.mainStar && palace.mainStar.length > 0;
  const hasAuxiliaryStars = palace.auxiliaryStars && palace.auxiliaryStars.length > 0;
  
  return hasMainStars || hasAuxiliaryStars;
}

/**
 * Get stars for nobleman analysis, with fallback to opposite palace stars
 * 
 * If the primary palace has NO stars at all, uses opposite palace stars.
 * Note: This only returns stars for matching, NOT the full palace data.
 * The original palace's name/zodiac should still be used.
 * 
 * @param chartData - Complete ZWDS chart data
 * @param palace - Primary palace to check
 * @returns Palace whose stars should be used for nobleman matching
 */
function getStarsForMatching(chartData: ChartData, palace: Palace): Palace {
  // Check if palace has ANY stars (not just nobleman stars)
  if (hasAnyStars(palace)) {
    // Palace has stars, use them even if none are nobleman stars
    return palace;
  }
  
  // Palace has NO stars at all, check opposite palace
  const oppositePalaceName = OPPOSITE_PALACE_INFLUENCE[palace.name as keyof typeof OPPOSITE_PALACE_INFLUENCE];
  
  if (oppositePalaceName) {
    const oppositePalace = chartData.palaces.find((p) => p.name === oppositePalaceName);
    if (oppositePalace && hasAnyStars(oppositePalace)) {
      // Return opposite palace only for star matching
      return oppositePalace;
    }
  }
  
  // Return original palace if no opposite palace found or it also has no stars
  return palace;
}

/**
 * Calculate nobleman data for the Wealth Palace (fixed)
 * 
 * This function always uses the Wealth Palace (财帛) to determine the
 * main nobleman profile, regardless of the current Dayun cycle.
 * 
 * @param chartData - Complete ZWDS chart data
 * @returns NoblemanData for the Wealth Palace, or null if not available
 */
export function calculateNoblemanData(
  chartData: ChartData
): NoblemanData | null {
  // Find the Wealth Palace (check both simplified and traditional names)
  const wealthPalace = chartData.palaces.find(
    (p) => p.name === "财帛" || p.name === "財帛"
  );
  
  if (!wealthPalace) {
    console.error("Wealth Palace not found in chart data");
    return null;
  }
  
  // Step 1: Extract earthly branch and map to zodiac
  const zodiacData = mapEarthlyBranchToZodiac(wealthPalace.earthlyBranch);
  const yearExamples = generateRecentYears(wealthPalace.earthlyBranch);
  
  // Step 2: Get stars for matching (may use opposite palace stars as fallback)
  const starsSource = getStarsForMatching(chartData, wealthPalace);
  const matchedProfiles = matchStarsToProfiles(starsSource);
  
  // Debug: Log if no profiles matched but palace has stars
  if (matchedProfiles.length === 0) {
    console.log("Nobleman Debug - No profiles matched:", {
      palaceName: wealthPalace.name,
      mainStars: wealthPalace.mainStar?.map(s => s.name),
      auxiliaryStars: wealthPalace.auxiliaryStars?.map(s => s.name),
      minorStars: wealthPalace.minorStars?.map(s => s.name),
      yearStars: wealthPalace.yearStars?.map(s => s.name),
      starsSourcePalace: starsSource.name,
      starsSourceMainStars: starsSource.mainStar?.map(s => s.name),
      starsSourceAuxiliaryStars: starsSource.auxiliaryStars?.map(s => s.name),
      starsSourceMinorStars: starsSource.minorStars?.map(s => s.name),
      starsSourceYearStars: starsSource.yearStars?.map(s => s.name),
    });
  }
  
  // Get palace name in English
  const palaceName = PALACE_NAME_TRANSLATIONS[wealthPalace.name] || wealthPalace.name;
  
  return {
    palaceName,
    palaceChinese: wealthPalace.name,
    zodiac: zodiacData.english,
    zodiacChinese: zodiacData.chinese,
    yearExamples,
    matchedProfiles,
    earthlyBranch: wealthPalace.earthlyBranch,
  };
}

/**
 * Calculate nobleman data for other key life areas
 * 
 * Returns nobleman information for 4 key palaces:
 * - Career Palace (Career Growth)
 * - Wealth Palace (Wealth Building)
 * - Health Palace (Health & Wellness)
 * - Life Palace (Personal Growth)
 * 
 * @param chartData - Complete ZWDS chart data
 * @returns Array of OtherAreaData for 4 key life areas
 */
export function calculateOtherLifeAreas(chartData: ChartData): OtherAreaData[] {
  const areas: OtherAreaData[] = [];
  
  for (const area of KEY_LIFE_AREAS) {
    // Find the palace (check both simplified and traditional names)
    const palace = chartData.palaces.find(
      (p) => p.name === area.palaceName || p.name === area.palaceNameTraditional
    );
    
    if (!palace) {
      // Log warning but add placeholder to maintain grid structure
      console.warn(`Palace not found for ${area.objective}: ${area.palaceName}/${area.palaceNameTraditional}`);
      
      // Add placeholder data to maintain 4-card layout
      areas.push({
        objective: area.objective,
        palaceName: PALACE_NAME_TRANSLATIONS[area.palaceName] || area.palaceName,
        palaceChinese: area.palaceName,
        zodiac: "Unknown",
        yearExamples: "N/A",
        noblemanType: "General Support",
        gradient: area.gradient,
      });
      continue;
    }
    
    // Get zodiac and years (always use original palace)
    const zodiacData = mapEarthlyBranchToZodiac(palace.earthlyBranch);
    const years = generateRecentYears(palace.earthlyBranch);
    const yearsFormatted = formatYearExamples(years);
    
    // Get stars for matching (may use opposite palace stars as fallback)
    const starsSource = getStarsForMatching(chartData, palace);
    const profiles = matchStarsToProfiles(starsSource);
    const noblemanType = profiles.length > 0 ? profiles[0].type : "General Support";
    
    // Get English palace name (always use original palace)
    const englishPalaceName = PALACE_NAME_TRANSLATIONS[palace.name] || palace.name;
    
    areas.push({
      objective: area.objective,
      palaceName: englishPalaceName,
      palaceChinese: palace.name,
      zodiac: zodiacData.english,
      yearExamples: yearsFormatted,
      noblemanType,
      gradient: area.gradient,
    });
  }
  
  return areas;
}

/**
 * Calculate nobleman data for a specific palace by name
 * 
 * Useful for getting nobleman information for any palace in the chart.
 * If the specified palace has no nobleman stars, checks the opposite palace.
 * 
 * @param chartData - Complete ZWDS chart data
 * @param palaceName - Chinese palace name (e.g., "官禄", "财帛")
 * @returns NoblemanData for the specified palace, or null if not found
 */
export function calculateNoblemanForPalace(
  chartData: ChartData,
  palaceName: string
): NoblemanData | null {
  // Find the palace
  const palace = chartData.palaces.find((p) => p.name === palaceName);
  
  if (!palace) {
    return null;
  }
  
  // Get zodiac and years (always use original palace)
  const zodiacData = mapEarthlyBranchToZodiac(palace.earthlyBranch);
  const yearExamples = generateRecentYears(palace.earthlyBranch);
  
  // Get stars for matching (may use opposite palace stars as fallback)
  const starsSource = getStarsForMatching(chartData, palace);
  const matchedProfiles = matchStarsToProfiles(starsSource);
  
  // Get English palace name (always use original palace)
  const englishPalaceName = PALACE_NAME_TRANSLATIONS[palace.name] || palace.name;
  
  return {
    palaceName: englishPalaceName,
    palaceChinese: palace.name,
    zodiac: zodiacData.english,
    zodiacChinese: zodiacData.chinese,
    yearExamples,
    matchedProfiles,
    earthlyBranch: palace.earthlyBranch,
  };
}
