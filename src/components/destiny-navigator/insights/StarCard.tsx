/**
 * StarCard Component - Premium Design
 * 
 * Displays star information with premium gradient card design.
 * Matches the visual style of WealthCode analysis component.
 */

import React from "react";
import { Star as StarIcon, Sparkles } from "lucide-react";
import { Star } from "../../../utils/zwds/types";
import { StarData } from "../../../utils/destiny-navigator/star-data/star-interpretations";
import { LifeAspect } from "../../../types/destiny-navigator";

/**
 * Component props interface
 */
interface StarCardProps {
  /** Star data from ZWDS calculation */
  star: Star;
  /** Star interpretation and metadata */
  starData: StarData;
  /** Contribution score to the palace quality */
  contribution: number;
  /** Whether to display the essence text */
  showEssence?: boolean;
  /** The current life aspect for essence lookup */
  aspect: LifeAspect;
}

/**
 * Star category type for color theming
 */
type StarCategory = "major" | "minor";

/**
 * Color theme identifier
 */
type ColorTheme = "purple" | "cyan";

/**
 * Gradient color configurations for star categories
 */
const CATEGORY_GRADIENTS: Record<ColorTheme, { from: string; to: string }> = {
  purple: { from: "#9333ea", to: "#c026d3" },
  cyan: { from: "#06b6d4", to: "#0891b2" }
};

/**
 * Calculates the visual star rating (1-5) based on brightness and star data
 * 
 * @param brightness - "bright" or "dim" from the chart
 * @param starData - Star interpretation data with brightness multipliers
 * @returns Star rating from 1-5
 */
const getBrightnessStars = (brightness: string, starData: StarData): number => {
  if (brightness === "bright") {
    // Higher brightness multiplier = more stars
    const multiplier = starData.brightness.bright;
    if (multiplier >= 1.3) {
      return 5;
    }
    if (multiplier >= 1.2) {
      return 4;
    }
    return 3;
  } else {
    // Lower brightness multiplier = fewer stars
    const multiplier = starData.brightness.dim;
    if (multiplier <= 0.7) {
      return 1;
    }
    if (multiplier <= 0.8) {
      return 2;
    }
    return 3;
  }
};

/**
 * Determines the color theme based on star category
 * 
 * @param category - "major" or "minor"
 * @returns Color theme identifier
 */
const getCategoryColor = (category: StarCategory): ColorTheme => {
  return category === "major" ? "purple" : "cyan";
};

/**
 * StarCard Component
 * 
 * Renders a card displaying star information with color-coded styling
 * based on the star's category (major/minor).
 */
export const StarCard: React.FC<StarCardProps> = ({
  star,
  starData,
  contribution,
  showEssence = false,
  aspect
}) => {
  // Calculate visual star rating
  const starCount = getBrightnessStars(star.brightness, starData);
  
  // Determine color theme
  const colorTheme = getCategoryColor(starData.category);
  const gradient = CATEGORY_GRADIENTS[colorTheme];

  return (
    <div className="relative overflow-hidden rounded-xl p-4 border shadow-sm transition-all hover:shadow-md bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-700">
      {/* Subtle gradient overlay */}
      <div 
        className="absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl opacity-10"
        style={{
          background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
        }}
      />

      <div className="relative">
        {/* Header with Icon and Rating */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div 
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
              }}
            >
              <Sparkles className="w-5 h-5 text-white" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white">
                {starData.name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {starData.chineseName}
              </p>
            </div>
          </div>
        </div>

        {/* Star Rating & Brightness */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                className="w-3 h-3"
                style={{
                  fill: i < starCount ? gradient.from : "transparent",
                  color: i < starCount ? gradient.from : "#d1d5db"
                }}
              />
            ))}
          </div>
          <div 
            className="px-2 py-0.5 rounded-full text-xs font-bold"
            style={{
              background: `linear-gradient(135deg, ${gradient.from}15, ${gradient.to}15)`,
              color: gradient.from
            }}
          >
            {star.brightness}
          </div>
        </div>

        {/* Contribution Badge */}
        <div 
          className="inline-flex items-center gap-1 px-3 py-1 rounded-full mb-3 shadow-sm"
          style={{
            background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
          }}
        >
          <span className="text-white text-xs font-bold" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.3)" }}>
            +{contribution} points
          </span>
        </div>

        {/* Essence Text */}
        {showEssence && (
          <div 
            className="p-3 rounded-lg border"
            style={{
              background: `linear-gradient(135deg, ${gradient.from}08, ${gradient.to}08)`,
              borderColor: `${gradient.from}30`
            }}
          >
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {starData.essences[aspect]}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
