/**
 * Profile Matcher Utility
 * 
 * Matches stars in a palace to nobleman profiles.
 * Prioritizes main stars over auxiliary stars and returns up to 2 profiles.
 */

import type { Palace } from "../zwds/types";
import type { NoblemanProfile, NoblemanType } from "../../types/nobleman";
import { STAR_TO_NOBLEMAN_TYPE, NOBLEMAN_PROFILES } from "../../constants/noblemanProfiles";

/**
 * Match stars in a palace to nobleman profiles
 * 
 * Strategy:
 * 1. Check all star arrays (mainStar, auxiliaryStars, minorStars, etc.)
 * 2. Prioritize main stars, then auxiliary, then minor, then timing stars
 * 3. Return up to 2 most relevant profiles to avoid overwhelming the user
 * 
 * @param palace - Palace object containing stars
 * @returns Array of 1-2 matched nobleman profiles
 */
export function matchStarsToProfiles(palace: Palace): NoblemanProfile[] {
  const matchedTypes = new Set<NoblemanType>();
  
  // Helper function to check stars in an array
  const checkStarArray = (stars: Array<{ name: string }> | undefined) => {
    if (!stars || stars.length === 0) {
      return;
    }
    
    for (const star of stars) {
      const type = STAR_TO_NOBLEMAN_TYPE[star.name];
      if (type) {
        matchedTypes.add(type);
        
        // Stop at 2 profiles
        if (matchedTypes.size >= 2) {
          return;
        }
      }
    }
  };
  
  // Priority 1: Main stars (highest priority)
  checkStarArray(palace.mainStar);
  if (matchedTypes.size >= 2) {
    return Array.from(matchedTypes).slice(0, 2).map(type => NOBLEMAN_PROFILES[type]);
  }
  
  // Priority 2: Auxiliary stars
  checkStarArray(palace.auxiliaryStars);
  if (matchedTypes.size >= 2) {
    return Array.from(matchedTypes).slice(0, 2).map(type => NOBLEMAN_PROFILES[type]);
  }
  
  // Priority 3: Minor stars (includes Zuo Fu, You Bi, Wen Chang, Wen Qu)
  checkStarArray(palace.minorStars);
  if (matchedTypes.size >= 2) {
    return Array.from(matchedTypes).slice(0, 2).map(type => NOBLEMAN_PROFILES[type]);
  }
  
  // Priority 4: Timing stars (year, month, day, hour)
  checkStarArray(palace.yearStars);
  checkStarArray(palace.monthStars);
  checkStarArray(palace.dayStars);
  checkStarArray(palace.hourStars);
  
  // Convert matched types to full profiles
  const profiles = Array.from(matchedTypes)
    .slice(0, 2) // Maximum 2 profiles
    .map(type => NOBLEMAN_PROFILES[type]);
  
  return profiles;
}

/**
 * Get a summary of all nobleman types in a palace
 * Useful for debugging or detailed analysis
 * 
 * @param palace - Palace object containing stars
 * @returns Object with arrays of types by star category
 */
export function getAllNoblemanTypes(palace: Palace): {
  mainStarTypes: NoblemanType[];
  auxiliaryStarTypes: NoblemanType[];
  allTypes: NoblemanType[];
} {
  const mainStarTypes: NoblemanType[] = [];
  const auxiliaryStarTypes: NoblemanType[] = [];
  
  // Collect from main stars
  if (palace.mainStar && palace.mainStar.length > 0) {
    for (const star of palace.mainStar) {
      const type = STAR_TO_NOBLEMAN_TYPE[star.name];
      if (type) {
        mainStarTypes.push(type);
      }
    }
  }
  
  // Collect from auxiliary stars
  if (palace.auxiliaryStars && palace.auxiliaryStars.length > 0) {
    for (const star of palace.auxiliaryStars) {
      const type = STAR_TO_NOBLEMAN_TYPE[star.name];
      if (type) {
        auxiliaryStarTypes.push(type);
      }
    }
  }
  
  // Combine all unique types
  const allTypesSet = new Set([...mainStarTypes, ...auxiliaryStarTypes]);
  const allTypes = Array.from(allTypesSet);
  
  return {
    mainStarTypes,
    auxiliaryStarTypes,
    allTypes,
  };
}

/**
 * Check if a palace has any nobleman stars
 * 
 * @param palace - Palace object containing stars
 * @returns True if the palace contains at least one nobleman star
 */
export function hasNoblemanStars(palace: Palace): boolean {
  // Helper function to check stars in an array
  const checkStarArray = (stars: Array<{ name: string }> | undefined): boolean => {
    if (!stars || stars.length === 0) {
      return false;
    }
    
    for (const star of stars) {
      if (STAR_TO_NOBLEMAN_TYPE[star.name]) {
        return true;
      }
    }
    
    return false;
  };
  
  // Check all star arrays
  return (
    checkStarArray(palace.mainStar) ||
    checkStarArray(palace.auxiliaryStars) ||
    checkStarArray(palace.minorStars) ||
    checkStarArray(palace.yearStars) ||
    checkStarArray(palace.monthStars) ||
    checkStarArray(palace.dayStars) ||
    checkStarArray(palace.hourStars)
  );
}
