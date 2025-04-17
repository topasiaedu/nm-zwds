import { CAREER_ANALYSIS_CONSTANTS, HEALTH_ANALYSIS_CONSTANTS } from "./analysis_constants";

/**
 * Interface for palace data in the chart
 */
interface Palace {
  name: string;
  stars: string[];
  position: number;
  palaceIndex?: number;
  mainStar?: any[];
  number?: number;
  earthlyBranch?: string;
  minorStars?: any[];
  auxiliaryStars?: any[];
  yearStars?: any[];
  monthStars?: any[];
  dayStars?: any[];
  hourStars?: any[];
  [key: string]: any; // Add index signature for dynamic access
}

/**
 * Interface for star position result
 */
export interface StarPosition {
  star: string;
  palace: string;
  position: number;
}

/**
 * Analyzes career aptitudes based on stars in a chart's career palace (官禄宫)
 * @param chartData - The calculated ZWDS chart data
 * @returns Array of career aptitudes based on stars in the career palace
 */
export function analyzeCareer(chartData: any): string[] {
  if (!chartData || !chartData.palaces) {
    console.log("Career analysis: No chart data or palaces found");
    return [];
  }

  // Log all palace names to help debug
  console.log("All palace names:", chartData.palaces.map((p: any) => p.name));

  // Find the career palace (官禄宫) by name
  // The palace names are assigned in calculator.ts step 5 based on the Life Palace position
  const careerPalace = chartData.palaces.find((palace: any) => 
    palace.name === "官禄" || 
    palace.name === "官祿" || 
    palace.name.includes("官禄") || 
    palace.name.includes("官祿") ||
    palace.name === "官"
  );

  if (!careerPalace) {
    console.log("Career analysis: Career palace not found");
    return [];
  }

  console.log("Found career palace:", careerPalace.name, "with stars:", careerPalace.stars);

  // Get all stars in the career palace - check both stars array and mainStar array
  let allStars: string[] = [];
  
  // Add regular stars if available
  if (careerPalace.stars && Array.isArray(careerPalace.stars)) {
    allStars = [...careerPalace.stars];
  }
  
  // Add main stars if available
  if (careerPalace.mainStar && Array.isArray(careerPalace.mainStar)) {
    const mainStarNames = careerPalace.mainStar.map((star: any) => star.name);
    allStars = [...allStars, ...mainStarNames];
  }
   
  if (allStars.length === 0) {
    console.log("Career analysis: No stars found in career palace");
    return [];
  }
  
  // Get career aptitudes based on stars
  const careerAptitudes = allStars.flatMap((star: string) => {
    // Ensure we only use the main star name (some might have suffixes)
    const mainStarName = star.split("_")[0].trim();
    
    // Get careers for this star
    const careers = CAREER_ANALYSIS_CONSTANTS[mainStarName as keyof typeof CAREER_ANALYSIS_CONSTANTS];
    if (!careers) {
      console.log(`Career analysis: No matching careers found for star ${mainStarName}`);
    }
    return careers ? Array.from(careers) : [];
  });

  // Remove duplicates
  return [...new Set(careerAptitudes)] as string[];
}

/**
 * Analyzes health concerns based on stars in a chart's health palace (疾厄宫)
 * @param chartData - The calculated ZWDS chart data
 * @returns Array of body parts that may be affected based on stars in the health palace
 */
export function analyzeHealth(chartData: any): string[] {
  if (!chartData || !chartData.palaces) {
    console.log("Health analysis: No chart data or palaces found");
    return [];
  }

  // Log all palace names to help debug
  console.log("All palace names:", chartData.palaces.map((p: any) => p.name));

  // Find the health palace (疾厄宫) by name
  // The palace names are assigned in calculator.ts step 5 based on the Life Palace position
  const healthPalace = chartData.palaces.find((palace: any) => 
    palace.name === "疾厄" || 
    palace.name.includes("疾厄") ||
    palace.name === "疾" ||
    palace.name === "病" ||
    palace.name.includes("病宮") ||
    palace.name.includes("病宫")
  );

  if (!healthPalace) {
    console.log("Health analysis: Health palace not found");
    return [];
  }

  console.log("Found health palace:", healthPalace.name, "with stars:", healthPalace.stars);

  // Get all stars in the health palace - check both stars array and mainStar array
  let allStars: string[] = [];
  
  // Add regular stars if available
  if (healthPalace.stars && Array.isArray(healthPalace.stars)) {
    allStars = [...healthPalace.stars];
  }
  
  // Add main stars if available
  if (healthPalace.mainStar && Array.isArray(healthPalace.mainStar)) {
    const mainStarNames = healthPalace.mainStar.map((star: any) => star.name);
    allStars = [...allStars, ...mainStarNames];
  }
   
  if (allStars.length === 0) {
    console.log("Health analysis: No stars found in health palace");
    return [];
  }
  
  // Get affected body parts based on stars
  const bodyParts = allStars.flatMap((star: string) => {
    // Ensure we only use the main star name (some might have suffixes)
    const mainStarName = star.split("_")[0].trim();
    
    // Get body parts for this star
    const parts = HEALTH_ANALYSIS_CONSTANTS[mainStarName as keyof typeof HEALTH_ANALYSIS_CONSTANTS];
    if (!parts) {
      console.log(`Health analysis: No matching body parts found for star ${mainStarName}`);
    }
    return parts ? Array.from(parts) : [];
  });

  // Remove duplicates
  return [...new Set(bodyParts)] as string[];
}

/**
 * Get information about all stars in a specific palace
 * @param chartData - The calculated ZWDS chart data
 * @param palaceName - The name of the palace to find
 * @returns Array of star positions in the specified palace
 */
export function getStarsInPalace(chartData: any, palaceName: string): StarPosition[] {
  if (!chartData || !chartData.palaces) {
    console.log(`getStarsInPalace: No chart data or palaces found for ${palaceName}`);
    return [];
  }

  // Log all palace names to help debug
  console.log("All palace names:", chartData.palaces.map((p: any) => p.name));

  // Be more flexible with palace name matching
  let palace: Palace | undefined;
  
  if (palaceName === "官禄" || palaceName.includes("官")) {
    palace = chartData.palaces.find((p: any) => 
      p.name === "官禄" || 
      p.name === "官祿" || 
      p.name.includes("官禄") || 
      p.name.includes("官祿") ||
      p.name === "官"
    );
  } else if (palaceName === "疾厄" || palaceName.includes("疾")) {
    palace = chartData.palaces.find((p: any) => 
      p.name === "疾厄" || 
      p.name.includes("疾厄") ||
      p.name === "疾" ||
      p.name === "病" ||
      p.name.includes("病宮") ||
      p.name.includes("病宫")
    );
  } else {
    palace = chartData.palaces.find((p: any) => 
      p.name === palaceName || 
      p.name.includes(palaceName)
    );
  }

  if (!palace) {
    console.log(`getStarsInPalace: Palace ${palaceName} not found`);
    return [];
  }

  console.log(`Found palace for ${palaceName}:`, palace.name);
  
  // Collect all stars from various star collections in the palace
  let allStars: StarPosition[] = [];
  
  // Add main stars if available
  if (palace.mainStar && Array.isArray(palace.mainStar)) {
    allStars = [
      ...allStars,
      ...palace.mainStar.map((star: any) => ({
        star: star.name,
        palace: palace!.name,
        position: palace!.number || 0
      }))
    ];
  }
  
  // Add regular stars if available
  if (palace.stars && Array.isArray(palace.stars)) {
    allStars = [
      ...allStars,
      ...palace.stars.map((star: string) => ({
        star: star,
        palace: palace!.name,
        position: palace!.number || 0
      }))
    ];
  }
  
  // Add stars from other collections if they exist
  const starCollections = ['minorStars', 'auxiliaryStars', 'yearStars', 'monthStars', 'dayStars', 'hourStars'];
  
  // Store palace reference to avoid undefined errors in forEach
  const finalPalace = palace;

  starCollections.forEach(collection => {
    if (finalPalace && finalPalace[collection] && Array.isArray(finalPalace[collection])) {
      allStars = [
        ...allStars,
        ...finalPalace[collection].map((star: any) => ({
          star: typeof star === 'string' ? star : star.name,
          palace: finalPalace.name,
          position: finalPalace.number || 0
        }))
      ];
    }
  });
  
  if (allStars.length === 0) {
    console.log(`getStarsInPalace: No stars found in palace ${palaceName}`);
  } else {
    console.log(`Found ${allStars.length} stars in palace ${palaceName}:`, 
      allStars.map(s => s.star).join(', '));
  }
  
  return allStars;
}
