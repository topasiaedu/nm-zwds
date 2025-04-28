import { AREAS_OF_LIFE_ANALYSIS_CONSTANTS } from "../analysis_constants/areas_of_life_analysis";

/**
 * Star analysis data structure
 */
export interface StarAnalysis {
  score: number;
  description: string;
}

/**
 * Area analysis data structure with stars
 */
export interface AreaAnalysis {
  [starName: string]: StarAnalysis;
}

/**
 * Complete life areas analysis constants structure
 */
export type LifeAreasConstants = {
  [areaName: string]: AreaAnalysis;
};

/**
 * Star data structure from chart
 */
export interface ChartStar {
  name: string;
  brightness?: string;
  palace?: number;
  isTransformed?: boolean;
  transformations?: string[];
  [key: string]: any; // Add index signature for additional properties
}

/**
 * Palace data structure from chart
 */
export interface AnalysisPalace {
  name: string;
  mainStar?: ChartStar[];
  minorStars?: ChartStar[];
  [key: string]: any;
}

/**
 * Chart data structure
 */
export interface ChartDataType {
  palaces: AnalysisPalace[];
  [key: string]: any;
}

/**
 * Analysis result for a life area
 */
export interface LifeAreaResult {
  area: string;
  displayName: string;
  icon: string;
  score: number;
  stars: Array<{
    name: string;
    score: number;
    description: string;
    starType: string;
  }>;
}

/**
 * Interface for radar chart data point
 */
export interface RadarDataPoint {
  area: string;
  score: number;
  originalName: string;
  [key: string]: string | number; // Add index signature for string keys
}

/**
 * Map of palace names to user-friendly names in English and Chinese
 */
export const palaceNameMap: Record<string, { en: string; zh: string }> = {
  "财帛": { en: "Financial Prosperity", zh: "财富" },
  "官禄": { en: "Career & Achievement", zh: "事业" },
  "疾厄": { en: "Health & Wellbeing", zh: "健康" },
  "夫妻": { en: "Love & Relationships", zh: "感情" },
  "交友": { en: "Friendships & Social Circle", zh: "人际关系" }
};

/**
 * Map of palace names to icon emojis
 */
export const palaceIconMap: Record<string, string> = {
  "财帛": "💰",
  "官禄": "💼",
  "疾厄": "❤️‍🩹",
  "夫妻": "💞",
  "交友": "👥"
};

/**
 * Calculate scores for each life area for radar chart
 * @param chartData - The calculated ZWDS chart data
 * @param language - The current language (en or zh)
 * @returns Array of radar chart data points
 */
export function calculateLifeAreaScores(chartData: ChartDataType | null | undefined, language: string): RadarDataPoint[] {
  if (!chartData || !chartData.palaces) {
    return [];
  }

  // Track scores for each life area
  const areaScores: Record<string, { total: number; count: number }> = {};
  
  // Cast constants to proper type
  const areasConstants = AREAS_OF_LIFE_ANALYSIS_CONSTANTS as LifeAreasConstants;
  
  // Initialize area scores
  Object.keys(areasConstants).forEach(area => {
    areaScores[area] = { total: 0, count: 0 };
  });

  // Process each palace to find stars and their scores
  chartData.palaces.forEach((palace: AnalysisPalace) => {
    const palaceName = palace.name;
    
    // Skip palaces that are not in our analysis constants
    if (!areasConstants[palaceName]) {
      return;
    }
    
    // Create a helper function to process stars
    const processStars = (stars: ChartStar[] | undefined, starType: string) => {
      if (!stars || stars.length === 0) return;
      
      stars.forEach((star) => {
        const starName = star.name;
        const areaConstants = areasConstants[palaceName];
        
        if (areaConstants && areaConstants[starName]) {
          const score = areaConstants[starName].score;
          areaScores[palaceName].total += score;
          areaScores[palaceName].count++;
        }
      });
    };
    
    // Process main stars
    processStars(palace.mainStar, "main");
    
    // Process minor stars
    processStars(palace.minorStars, "minor");
  });

  // Calculate average scores and format data for the radar chart
  return Object.keys(areaScores).map(area => {
    const { total, count } = areaScores[area];
    const averageScore = count > 0 ? Math.round(total / count) : 0;
    
    // Get the user-friendly name based on language
    const displayName = language === "zh" 
      ? palaceNameMap[area]?.zh || area 
      : palaceNameMap[area]?.en || area;
    
    return {
      area: displayName,
      score: averageScore,
      originalName: area,
      // Add a formatted label that includes the score
      [`${displayName}`]: averageScore
    } as RadarDataPoint;
  });
}

/**
 * Analyze life areas with detailed star information
 * @param chartData - The calculated ZWDS chart data
 * @param language - The current language (en or zh)
 * @returns Array of life area analysis results
 */
export function analyzeLifeAreas(chartData: ChartDataType | null | undefined, language: string): LifeAreaResult[] {
  if (!chartData || !chartData.palaces) {
    return [];
  }

  // Cast constants to proper type
  const areasConstants = AREAS_OF_LIFE_ANALYSIS_CONSTANTS as LifeAreasConstants;

  // Track analysis for each life area
  const analysis: LifeAreaResult[] = [];

  // Process each palace to find stars and their scores
  Object.keys(areasConstants).forEach(areaName => {
    const areaConstants = areasConstants[areaName];
    const areaStars: Array<{ name: string; score: number; description: string; starType: string }> = [];
    let totalScore = 0;
    let starCount = 0;

    // Find the palace with this name
    const palace = chartData.palaces.find((p) => p.name === areaName);
    
    if (palace) {
      // Helper function to process stars
      const processStars = (stars: ChartStar[] | undefined, starType: string) => {
        if (!stars || stars.length === 0) return;
        
        stars.forEach((star) => {
          const starName = star.name;
          
          if (areaConstants[starName]) {
            const { score, description } = areaConstants[starName];
            areaStars.push({
              name: starName,
              score,
              description,
              starType
            });
            
            totalScore += score;
            starCount++;
          }
        });
      };
      
      // Process main stars
      processStars(palace.mainStar, "main");
      
      // Process minor stars
      processStars(palace.minorStars, "minor");
    }

    // Only add areas with at least one star
    if (areaStars.length > 0) {
      // Get the user-friendly name based on language
      const displayName = language === "zh" 
        ? palaceNameMap[areaName]?.zh || areaName 
        : palaceNameMap[areaName]?.en || areaName;
        
      analysis.push({
        area: areaName,
        displayName,
        icon: palaceIconMap[areaName] || "🔮",
        score: Math.round(totalScore / starCount),
        stars: areaStars.sort((a, b) => b.score - a.score) // Sort by score (highest first)
      });
    }
  });

  // Sort areas by score (highest first)
  return analysis.sort((a, b) => b.score - a.score);
}

/**
 * Get CSS classes for the score badge
 * @param score - The score value
 * @returns CSS class string
 */
export function getScoreBadgeClasses(score: number): string {
  if (score >= 90) {
    return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
  }
  if (score >= 80) {
    return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
  }
  if (score >= 70) {
    return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
  }
  if (score >= 60) {
    return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
  }
  return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
}

/**
 * Get CSS classes for the star type badge
 * @param starType - The star type (main or minor)
 * @returns CSS class string
 */
export function getStarTypeBadgeClasses(starType: string): string {
  if (starType === "main") {
    return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300";
  }
  return "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300";
} 