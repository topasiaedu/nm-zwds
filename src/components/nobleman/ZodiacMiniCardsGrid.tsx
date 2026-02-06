/**
 * Zodiac Mini Cards Grid Component
 * 
 * Displays a compact grid of mini cards for the other 4 life areas' zodiacs.
 * Users can click to see full details in a modal.
 * 
 * Part of Option 5 design - supporting information for the main nobleman.
 */

import React from "react";
import type { ZodiacMiniData } from "../../utils/nobleman";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacMiniCardsGridProps {
  /** Mini zodiac data for the 4 other life areas */
  miniData: ZodiacMiniData[];
}

/**
 * ZodiacMiniCardsGrid Component
 * 
 * Compact grid showing zodiac summaries for other life areas.
 * Clicking a card opens a modal with full personality details.
 */
export const ZodiacMiniCardsGrid: React.FC<ZodiacMiniCardsGridProps> = ({ miniData }) => {
  if (miniData.length === 0) {
    return null;
  }
  
  return (
    <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
      {/* Section Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Quick Guide: Other Life Area Nobleman
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quick reference for nobleman personalities in other life areas
        </p>
      </div>
      
      {/* Grid of Mini Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {miniData.map((mini) => (
          <ZodiacMiniCard
            key={mini.area}
            miniData={mini}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * ZodiacMiniCard Component
 * 
 * Individual mini card showing essential zodiac info.
 */
const ZodiacMiniCard: React.FC<{
  miniData: ZodiacMiniData;
}> = ({ miniData }) => {
  // Get the zodiac icon dynamically
  const zodiacKey = miniData.zodiac.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];
  
  // Convert Tailwind gradient to inline styles (same as OtherLifeAreas)
  const getGradientStyle = (gradient: string): React.CSSProperties => {
    const gradientMap: Record<string, string> = {
      "from-blue-500 to-cyan-500": "linear-gradient(to bottom right, #3b82f6, #06b6d4)",
      "from-amber-800 to-orange-800": "linear-gradient(to bottom right, #d97706, #f59e0b)",
      "from-green-500 to-emerald-500": "linear-gradient(to bottom right, #22c55e, #10b981)",
      "from-purple-500 to-pink-500": "linear-gradient(to bottom right, #a855f7, #ec4899)",
    };
    
    return {
      backgroundImage: gradientMap[gradient] || "linear-gradient(to bottom right, #6b7280, #4b5563)",
    };
  };
  
  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
    >
      {/* Header with gradient and icon */}
      <div className="p-4 relative" style={getGradientStyle(miniData.gradient)}>
        {/* Zodiac Icon */}
        {ZodiacIcon && (
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl p-2 flex items-center justify-center">
              <ZodiacIconWrapper Icon={ZodiacIcon} className="w-full h-full text-white brightness-0 invert" />
            </div>
          </div>
        )}
        
        <div className="text-center">
          <div className="text-white font-bold text-lg mb-1">
            {miniData.zodiac} {miniData.zodiacChinese}
          </div>
          <div className="text-white/80 text-xs font-medium">
            {miniData.area}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Core Traits */}
        <div className="mb-3">
          <div className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Core Traits
          </div>
          <div className="flex flex-wrap gap-1">
            {miniData.coreTraits.map((trait) => (
              <span
                key={trait}
                className="px-2 py-1 rounded-md bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-xs font-medium"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>
        
        {/* Recognition Summary */}
        <div>
          <div className="text-xs font-semibold mb-1 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            Quick Tip
          </div>
          <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
            {miniData.recognitionSummary}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ZodiacMiniCardsGrid;

