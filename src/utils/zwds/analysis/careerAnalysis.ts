import { CAREER_ANALYSIS_CONSTANTS } from "../analysis_constants/career_analysis";

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