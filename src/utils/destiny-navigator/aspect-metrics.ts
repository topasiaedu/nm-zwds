/**
 * Calculate aspect-specific metrics from palace data
 */

import { Palace } from "../zwds/types";
import { ASPECT_CONFIGS } from "./aspect-configurations";
import { calculatePalaceAttributes, getAllStarsFromPalace } from "./metrics-calculator";
import { STAR_INTERPRETATIONS } from "./star-data/star-interpretations";
import { LifeAspect } from "../../types/destiny-navigator";

/**
 * Calculate aspect-specific metrics from palace
 * 
 * @param palace - Palace to analyze
 * @param aspect - Life aspect being analyzed
 * @returns Array of aspect-specific metrics with values
 */
export function calculateAspectMetrics(
  palace: Palace,
  aspect: LifeAspect
): Array<{ 
  key: string; 
  label: string; 
  value: number; 
  iconName: string; 
  description: string 
}> {
  
  const config = ASPECT_CONFIGS[aspect];
  if (!config) {
    console.warn(`No configuration found for aspect: ${aspect}`);
    return [];
  }

  // Get universal attributes from palace stars
  const universalAttrs = calculatePalaceAttributes(palace);

  // Transform into aspect-specific metrics using formulas
  return config.metrics.map(metric => ({
    key: metric.key,
    label: metric.label,
    iconName: metric.iconName,
    description: metric.description,
    value: metric.formula(universalAttrs)
  }));
}

/**
 * Get relevant focus priorities for an aspect
 * Filters out focus categories that don't make sense for the aspect
 * 
 * @param allPriorities - All generated priorities
 * @param aspect - Life aspect being analyzed
 * @returns Filtered priorities with optional custom labels
 */
export function getRelevantFocuses(
  allPriorities: Array<{ category: string; priority: number }>,
  aspect: LifeAspect
): Array<{ category: string; priority: number; customLabel?: string }> {
  
  const config = ASPECT_CONFIGS[aspect];
  if (!config) {
    return allPriorities;
  }

  // Filter to only relevant categories for this aspect
  const filtered = allPriorities.filter(p => 
    config.focusMapping.relevant.includes(p.category)
  );

  // Apply custom labels if defined for this aspect
  return filtered.map(p => ({
    ...p,
    customLabel: config.focusMapping.labels?.[p.category]
  }));
}

/**
 * Calculate meaningful star activity score based on star power
 * Not just count - considers brightness and category
 * 
 * @param palace - Palace to analyze
 * @returns Star activity score from 0-10
 */
export function calculateStarActivity(palace: Palace): number {
  const stars = getAllStarsFromPalace(palace);
  
  let totalPower = 0;
  
  stars.forEach(star => {
    const starData = STAR_INTERPRETATIONS[star.name];
    if (!starData) {
      return;
    }
    
    // Get brightness multiplier for this star
    const brightness = star.brightness === "bright" 
      ? starData.brightness.bright 
      : starData.brightness.dim;
    
    // Major stars have more impact than minor stars
    const categoryWeight = starData.category === "major" ? 2.0 : 1.0;
    
    // Calculate this star's power contribution
    const starPower = brightness * categoryWeight;
    totalPower += starPower;
  });
  
  // Normalize to 0-10 scale
  // Assume max total power is ~15 (e.g., 5 bright major stars = 5 * 1.3 * 2 = 13)
  const maxExpectedPower = 15;
  const normalized = (totalPower / maxExpectedPower) * 10;
  
  return Math.min(Math.round(normalized), 10);
}

/**
 * Get context hint for an aspect
 * 
 * @param aspect - Life aspect identifier
 * @returns Context hint string explaining the aspect
 */
export function getAspectContextHint(aspect: LifeAspect): string {
  const config = ASPECT_CONFIGS[aspect];
  return config?.contextHint || "";
}

/**
 * Get star emphasis setting for an aspect
 * 
 * @param aspect - Life aspect identifier
 * @returns Star emphasis setting ("essence" | "keywords" | "both")
 */
export function getStarEmphasis(aspect: LifeAspect): "essence" | "keywords" | "both" {
  const config = ASPECT_CONFIGS[aspect];
  return config?.starEmphasis || "essence";
}
