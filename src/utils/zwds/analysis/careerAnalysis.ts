import { ChartData, Palace, Star } from "../types";
import { CAREER_ANALYSIS_CONSTANTS, CAREER_CATEGORIES_CONSTANTS } from "../analysis_constants/career_analysis";
import { CAREER_DATA_CONSTANTS } from "../analysis_constants/career_data";

/**
 * Type definition for career analysis result
 */
export type CareerAnalysisResult = {
  archetype: string;
  description: string;
  idealCareers: readonly string[];
  nonIdealCareers: readonly string[];
  debugInfo: {
    careerPalaceStars: string[];
    spousePalaceStars: string[];
    usedSpousePalace: boolean;
    starMatches: Record<string, string[]>;
    categoryScores: Record<string, number>;
  };
};

/**
 * Extract all star names from a palace
 */
const extractStarNames = (palace: Palace): string[] => {
  const allStars: Star[] = [
    ...(palace.mainStar || []),
    ...(palace.bodyStar ? [palace.bodyStar] : []),
    ...(palace.lifeStar ? [palace.lifeStar] : []),
    ...palace.minorStars,
    ...palace.auxiliaryStars,
    ...palace.yearStars,
    ...palace.monthStars,
    ...palace.dayStars,
    ...palace.hourStars,
  ];

  return allStars.map(star => star.name);
};

/**
 * Find career-related occupations from star names
 */
const findCareerOccupations = (starNames: string[]): string[] => {
  const occupations: string[] = [];

  starNames.forEach(starName => {
    const starOccupations = CAREER_ANALYSIS_CONSTANTS[starName as keyof typeof CAREER_ANALYSIS_CONSTANTS];
    if (starOccupations) {
      occupations.push(...starOccupations);
    }
  });

  return occupations;
};

/**
 * Calculate category scores based on occupation matches
 */
const calculateCategoryScores = (occupations: string[]): Record<string, number> => {
  const scores: Record<string, number> = {};

  // Initialize scores
  Object.keys(CAREER_CATEGORIES_CONSTANTS).forEach(category => {
    scores[category] = 0;
  });

  // Count matches for each category
  occupations.forEach(occupation => {
    Object.entries(CAREER_CATEGORIES_CONSTANTS).forEach(([category, categoryOccupations]) => {
      if ((categoryOccupations as readonly string[]).includes(occupation)) {
        scores[category] += 1;
      }
    });
  });

  return scores;
};

/**
 * Find the category with the highest score
 */
const findTopCategory = (categoryScores: Record<string, number>): string => {
  let topCategory = "";
  let highestScore = 0;

  Object.entries(categoryScores).forEach(([category, score]) => {
    if (score > highestScore) {
      highestScore = score;
      topCategory = category;
    }
  });

  // If no matches found, default to "Visionaries"
  return topCategory || "Visionaries 灵感者";
};

/**
 * Analyze career based on chart data
 */
export const analyzeCareer = (chartData: ChartData): CareerAnalysisResult => {
  // Find career palace (官禄)
  const careerPalace = chartData.palaces.find(palace => palace.name === "官禄");
  const spousePalace = chartData.palaces.find(palace => palace.name === "夫妻");

  if (!careerPalace || !spousePalace) {
    throw new Error("Could not find career or spouse palace");
  }

  // Extract stars from career palace
  const careerPalaceStars = extractStarNames(careerPalace);
  const spousePalaceStars = extractStarNames(spousePalace);

  // Determine which palace to use for analysis
  const usedSpousePalace = careerPalaceStars.length === 0;
  const analysisStars = usedSpousePalace ? spousePalaceStars : careerPalaceStars;

  // Find career occupations from stars
  const occupations = findCareerOccupations(analysisStars);

  // Create star matches for debug info
  const starMatches: Record<string, string[]> = {};
  analysisStars.forEach(starName => {
    const starOccupations = CAREER_ANALYSIS_CONSTANTS[starName as keyof typeof CAREER_ANALYSIS_CONSTANTS];
    if (starOccupations) {
      starMatches[starName] = [...starOccupations];
    }
  });

  // Calculate category scores
  const categoryScores = calculateCategoryScores(occupations);

  // Find top category
  const topCategory = findTopCategory(categoryScores);

  // Clean up category name to match CAREER_DATA_CONSTANTS keys
  const cleanCategoryName = topCategory.split(" ")[0]; // Remove Chinese part

  // Get career data
  const careerData = CAREER_DATA_CONSTANTS[cleanCategoryName as keyof typeof CAREER_DATA_CONSTANTS];

  if (!careerData) {
    throw new Error(`No career data found for category: ${cleanCategoryName}`);
  }

  return {
    archetype: cleanCategoryName,
    description: careerData.description,
    idealCareers: careerData.career_paths.ideal,
    nonIdealCareers: careerData.career_paths.non_ideal,
    debugInfo: {
      careerPalaceStars,
      spousePalaceStars,
      usedSpousePalace,
      starMatches,
      categoryScores,
    },
  };
};

/**
 * Get image path for career archetype based on gender
 */
export const getCareerArchetypeImage = (archetype: string, gender: "male" | "female"): string => {
  const genderSuffix = gender === "male" ? "m" : "f";
  let archetypeLower = archetype.toLowerCase();
  
  // Handle filename inconsistencies
  if (archetypeLower === "lifekeepers" && gender === "male") {
    // Handle typo in filename: "liekeepers-m.png" instead of "lifekeepers-m.png"
    archetypeLower = "liekeepers";
  } else if (archetypeLower === "strategists" && gender === "female") {
    // Handle missing 's': "strategist-f.png" instead of "strategists-f.png"
    archetypeLower = "strategist";
  }
  
  return `/assets/${archetypeLower}-${genderSuffix}.png`;
};

/**
 * Backward compatibility function for old CareerAnalysis component
 * Returns career aptitudes as string array
 */
export const analyzeCareerLegacy = (chartData: ChartData): string[] => {
  try {
    // Extract career aptitudes from the analysis stars
    const careerPalace = chartData.palaces.find(palace => palace.name === "官禄");
    const spousePalace = chartData.palaces.find(palace => palace.name === "夫妻");
    
    if (!careerPalace || !spousePalace) {
      return [];
    }
    
    const careerStars = extractStarNames(careerPalace);
    const spouseStars = extractStarNames(spousePalace);
    const analysisStars = careerStars.length > 0 ? careerStars : spouseStars;
    
    // Get career occupations from stars
    const occupations = findCareerOccupations(analysisStars);
    
    return occupations;
  } catch (error) {
    console.error("Career analysis error:", error);
    return [];
  }
}; 