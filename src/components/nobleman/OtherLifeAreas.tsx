/**
 * Other Life Areas Component
 * 
 * Grid display of nobleman information for 4 key life areas:
 * - Career Growth
 * - Wealth Building
 * - Health & Wellness
 * - Personal Growth
 */

import React from "react";
import type { OtherAreaData } from "../../types/nobleman";

interface OtherLifeAreasProps {
  /** Array of other area data (typically 4 areas) */
  areas: OtherAreaData[];
  
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
}

/**
 * OtherLifeAreas Component
 * 
 * Simple, visual grid of cards showing nobleman for other key palaces.
 * Each card displays:
 * - Life objective/area
 * - Palace name
 * - Zodiac
 * - Year examples
 * - Nobleman type
 */
/**
 * Convert Tailwind gradient classes to inline CSS gradients
 * Using the same approach as DayunSeasonHero for consistency
 */
const getGradientStyle = (gradient: string): React.CSSProperties => {
  const gradientMap: Record<string, string> = {
    "from-blue-500 to-cyan-500": "linear-gradient(to bottom right, #3b82f6, #06b6d4)",
    "from-amber-800 to-orange-800": "linear-gradient(to bottom right, #d97706, #f59e0b)", // amber-600 to amber-500 for better visibility
    "from-green-500 to-emerald-500": "linear-gradient(to bottom right, #22c55e, #10b981)",
    "from-purple-500 to-pink-500": "linear-gradient(to bottom right, #a855f7, #ec4899)",
  };
  
  return {
    backgroundImage: gradientMap[gradient] || "linear-gradient(to bottom right, #6b7280, #4b5563)",
  };
};

const OtherLifeAreas: React.FC<OtherLifeAreasProps> = ({
  areas,
  theme = "light",
}) => {
  if (areas.length === 0) {
    return null;
  }

  return (
    <div className="rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 mb-6">
      {/* Section Header */}
      <div className="mb-5">
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
          Other Life Areas
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Quick reference for nobleman in other areas of your life
        </p>
      </div>
      
      {/* Grid of Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {areas.map((area) => (
          <div
            key={`${area.objective}-${area.palaceName}`}
            className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-lg"
          >
            {/* Header with gradient */}
            <div className="p-4" style={getGradientStyle(area.gradient)}>
              <div className="text-white font-bold text-sm mb-1">{area.objective}</div>
              <div className="text-white/80 text-xs">{area.palaceName}</div>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Nobleman Type - MAIN FOCUS */}
              <div>
                <div className="text-xs font-semibold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Nobleman Profile
                </div>
                <div className="text-base font-bold leading-snug text-gray-900 dark:text-white">
                  {area.noblemanType}
                </div>
              </div>
              
              {/* Compact Zodiac Info - Secondary */}
              <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Look for {area.zodiac} people</span>
                  <br />
                  Born in: {area.yearExamples}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherLifeAreas;
