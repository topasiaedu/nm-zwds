/**
 * Metrics calculation utilities for Destiny Navigator
 * Transforms star data into actionable metrics for visual insights
 */

import { Palace, Star } from "../zwds/types";
import { STAR_INTERPRETATIONS, StarData } from "./star-data/star-interpretations";
import { KEYWORD_TO_FOCUS_MAP } from "./constants";

/**
 * Get all stars from a palace (combining all star arrays)
 * @param palace - Palace to extract stars from
 * @returns Array of all stars in the palace
 */
export function getAllStarsFromPalace(palace: Palace): Star[] {
  return [
    ...(palace.mainStar || []),
    ...(palace.bodyStar ? [palace.bodyStar] : []),
    ...(palace.lifeStar ? [palace.lifeStar] : []),
    ...palace.minorStars,
    ...palace.auxiliaryStars,
    ...palace.yearStars,
    ...palace.monthStars,
    ...palace.dayStars,
    ...palace.hourStars
  ].filter((star): star is Star => star !== null && star !== undefined);
}

/**
 * Get brightness multiplier for a star based on its position
 * @param star - Star object with brightness property
 * @param starData - Star interpretation data with brightness multipliers
 * @returns Brightness multiplier (bright or dim value)
 */
function getBrightnessMultiplier(star: Star, starData: StarData): number {
  return star.brightness === "bright" 
    ? starData.brightness.bright 
    : starData.brightness.dim;
}

/**
 * Calculate overall palace quality score (0-100)
 * Based on star attributes weighted by brightness
 * @param palace - Palace to evaluate
 * @returns Quality score from 0-100
 */
export function calculatePalaceQuality(palace: Palace): number {
  const stars = getAllStarsFromPalace(palace);
  
  let totalScore = 0;
  let maxPossibleScore = 0;

  stars.forEach(star => {
    const starData = STAR_INTERPRETATIONS[star.name];
    if (!starData) {
      return;
    }

    // Get star-specific brightness multiplier
    const brightnessMultiplier = getBrightnessMultiplier(star, starData);
    
    // Calculate average attribute score for this star
    const avgAttribute = (
      starData.attributes.authority +
      starData.attributes.resources +
      starData.attributes.strategy +
      starData.attributes.discipline +
      starData.attributes.flow
    ) / 5;

    // Add weighted score
    totalScore += avgAttribute * brightnessMultiplier;
    
    // Add to max possible (using star's max brightness)
    maxPossibleScore += 100 * starData.brightness.bright;
  });

  // Normalize to 0-100 scale
  return maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
}

/**
 * Calculate aggregated attributes for a palace
 * Returns weighted average of each attribute across all stars
 * @param palace - Palace to analyze
 * @returns Object with authority, resources, strategy, discipline, flow scores (0-100)
 */
export function calculatePalaceAttributes(palace: Palace): {
  authority: number;
  resources: number;
  strategy: number;
  discipline: number;
  flow: number;
} {
  const stars = getAllStarsFromPalace(palace);
  
  const aggregated = {
    authority: 0,
    resources: 0,
    strategy: 0,
    discipline: 0,
    flow: 0
  };

  let totalWeight = 0;

  stars.forEach(star => {
    const starData = STAR_INTERPRETATIONS[star.name];
    if (!starData) {
      return;
    }

    const weight = getBrightnessMultiplier(star, starData);
    
    aggregated.authority += starData.attributes.authority * weight;
    aggregated.resources += starData.attributes.resources * weight;
    aggregated.strategy += starData.attributes.strategy * weight;
    aggregated.discipline += starData.attributes.discipline * weight;
    aggregated.flow += starData.attributes.flow * weight;
    
    totalWeight += weight;
  });

  // Normalize by total weight
  if (totalWeight > 0) {
    aggregated.authority = Math.round(aggregated.authority / totalWeight);
    aggregated.resources = Math.round(aggregated.resources / totalWeight);
    aggregated.strategy = Math.round(aggregated.strategy / totalWeight);
    aggregated.discipline = Math.round(aggregated.discipline / totalWeight);
    aggregated.flow = Math.round(aggregated.flow / totalWeight);
  }

  return aggregated;
}

/**
 * Filter and rank stars by relevance to a specific life aspect
 * @param stars - Array of stars to filter
 * @param aspect - Life aspect to evaluate (e.g., "career", "wealth", "health")
 * @param maxCount - Optional maximum number of stars to return
 * @returns Array of stars ranked by relevance with star data and relevance score
 */
export function filterStarsByRelevance(
  stars: Star[],
  aspect: string,
  maxCount?: number
): Array<{ star: Star; starData: StarData; relevance: number }> {
  const ranked = stars
    .map(star => {
      const starData = STAR_INTERPRETATIONS[star.name];
      if (!starData) {
        return null;
      }

      // Calculate relevance score based on aspect-specific attribute weights
      const brightnessMultiplier = getBrightnessMultiplier(star, starData);
      
      // Get aspect-specific attribute weights
      const aspectWeights = getAspectAttributeWeights(aspect);
      
      // Calculate weighted relevance score
      const relevance = 
        starData.attributes.authority * aspectWeights.authority +
        starData.attributes.resources * aspectWeights.resources +
        starData.attributes.strategy * aspectWeights.strategy +
        starData.attributes.discipline * aspectWeights.discipline +
        starData.attributes.flow * aspectWeights.flow;

      return {
        star,
        starData,
        relevance: relevance * brightnessMultiplier
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => b.relevance - a.relevance);

  return maxCount ? ranked.slice(0, maxCount) : ranked;
}

/**
 * Get attribute weights for different life aspects
 * Higher weight means that attribute is more important for that aspect
 * @param aspect - Life aspect identifier
 * @returns Object with weighted importance of each attribute (0-2 scale)
 */
function getAspectAttributeWeights(aspect: string): {
  authority: number;
  resources: number;
  strategy: number;
  discipline: number;
  flow: number;
} {
  const weights: Record<string, {
    authority: number;
    resources: number;
    strategy: number;
    discipline: number;
    flow: number;
  }> = {
    life: { authority: 1, resources: 1, strategy: 1, discipline: 1, flow: 1 },
    wealth: { authority: 0.8, resources: 1.5, strategy: 1, discipline: 1.2, flow: 0.8 },
    career: { authority: 1.5, resources: 0.8, strategy: 1.2, discipline: 1.3, flow: 0.7 },
    health: { authority: 0.5, resources: 0.7, strategy: 0.8, discipline: 1.2, flow: 1.5 },
    relationships: { authority: 0.7, resources: 0.6, strategy: 0.9, discipline: 0.8, flow: 1.4 },
    children: { authority: 1, resources: 0.8, strategy: 0.9, discipline: 1, flow: 1.2 },
    siblings: { authority: 0.8, resources: 0.7, strategy: 0.8, discipline: 0.8, flow: 1.3 },
    travel: { authority: 0.7, resources: 0.9, strategy: 1, discipline: 0.8, flow: 1.4 },
    social: { authority: 0.9, resources: 0.7, strategy: 1, discipline: 0.7, flow: 1.5 },
    home: { authority: 0.8, resources: 1.4, strategy: 1, discipline: 1, flow: 1.1 },
    fortune: { authority: 0.6, resources: 0.8, strategy: 1.1, discipline: 0.9, flow: 1.5 },
    parents: { authority: 1.2, resources: 0.9, strategy: 0.9, discipline: 1, flow: 1 }
  };

  return weights[aspect] || weights.life;
}

/**
 * Generate focus priorities from star keywords
 * Maps star keywords to actionable focus categories and ranks them
 * @param stars - Array of star objects with their data
 * @param maxCategories - Maximum number of categories to return (default: 3)
 * @returns Array of focus categories with priority scores
 */
export function generateFocusPriorities(
  stars: Array<{ star: Star; starData: StarData }>,
  maxCategories: number = 3
): Array<{ category: string; priority: number }> {
  const categoryScores: Record<string, number> = {};

  // Aggregate keyword matches with brightness weighting
  stars.forEach(({ star, starData }) => {
    const weight = getBrightnessMultiplier(star, starData);
    
    starData.keywords.forEach(keyword => {
      const focusId = KEYWORD_TO_FOCUS_MAP[keyword];
      if (focusId) {
        categoryScores[focusId] = (categoryScores[focusId] || 0) + weight;
      }
    });
  });

  // Sort by score and return top categories
  return Object.entries(categoryScores)
    .map(([category, score]) => ({ category, priority: score }))
    .sort((a, b) => b.priority - a.priority)
    .slice(0, maxCategories);
}
