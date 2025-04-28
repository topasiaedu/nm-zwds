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