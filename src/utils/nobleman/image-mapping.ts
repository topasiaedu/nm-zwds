/**
 * Nobleman Profile Image Mapping Utility
 * 
 * Maps nobleman profile types to their corresponding image assets.
 * Centralizes image paths for easy maintenance and type safety.
 */

/**
 * Get the image path for a nobleman profile type
 * 
 * @param profileType - The nobleman profile type name
 * @returns The image path from public/assets folder
 * 
 * @example
 * ```typescript
 * const imagePath = getNoblemanImage("Authority / High-Status Nobleman");
 * // Returns: "/assets/nobleman/Authority Figure.png"
 * ```
 */
export const getNoblemanImage = (profileType: string): string => {
  // Map profile type names to actual image filenames
  const profileTypeToImageMap: Record<string, string> = {
    "Authority / High-Status Nobleman": "Authority Figure",
    "Bold & Aggressive Nobleman": "Breakthrough Catalyst",
    "Charismatic & Expressive Nobleman": "Connector",
    "Practical Leader Nobleman": "Execution Doer",
    "Stable & Resource Nobleman": "Foundation Builder",
    "Same-Generation Nobleman": "Growth Partner",
    "Younger / Junior Nobleman": "Innovator",
    "Older Female Nobleman": "Nurturing Mentor",
    "Male Nobleman": "Path Opener",
    "Refined & Educated Nobleman": "Strategist",
  };
  
  const imageFileName = profileTypeToImageMap[profileType];
  
  if (!imageFileName) {
    console.warn(`No image mapping found for profile type: ${profileType}`);
    return "";
  }
  
  // Return path to public/assets/nobleman folder
  return `/assets/nobleman/${imageFileName}.png`;
};

/**
 * Check if a nobleman profile image exists
 * 
 * @param profileType - The nobleman profile type name
 * @returns True if the image mapping exists
 */
export const hasNoblemanImage = (profileType: string): boolean => {
  return getNoblemanImage(profileType) !== "";
};

/**
 * Get all available nobleman profile types
 * 
 * @returns Array of all nobleman profile type names
 */
export const getAllNoblemanProfileTypes = (): string[] => {
  return [
    "Authority Figure",
    "Breakthrough Catalyst",
    "Connector",
    "Execution Doer",
    "Foundation Builder",
    "Growth Partner",
    "Innovator",
    "Nurturing Mentor",
    "Path Opener",
    "Strategist",
  ];
};
