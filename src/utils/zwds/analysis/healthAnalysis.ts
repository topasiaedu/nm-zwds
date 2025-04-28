import { HEALTH_ANALYSIS_CONSTANTS } from "../analysis_constants/health_analysis";

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