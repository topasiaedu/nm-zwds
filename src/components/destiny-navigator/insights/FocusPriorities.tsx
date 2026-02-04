/**
 * FocusPriorities Component
 * 
 * Displays recommended focus areas with modern card-based design.
 * Matches the visual style of WealthCode analysis component.
 */

import React from "react";
import { Target } from "lucide-react";
import { FOCUS_CATEGORIES } from "../../../utils/destiny-navigator/focus-mappings";

/**
 * Single priority item
 */
interface PriorityItem {
  /** Category ID matching FOCUS_CATEGORIES keys */
  category: string;
  /** Priority score (will be normalized to 0-100 scale) */
  priority: number;
  /** Optional custom label for aspect-specific context */
  customLabel?: string;
}

/**
 * Component props interface
 */
interface FocusPrioritiesProps {
  /** Array of priority items to display */
  priorities: PriorityItem[];
}

/**
 * Icon mapping for focus categories
 */
const FOCUS_ICONS: Record<string, string> = {
  leadership: "👑",
  systems: "⚙️",
  wealth: "💎",
  execution: "⚡",
  strategy: "🎯",
  harmony: "🤝",
  expression: "✨",
  support: "🛡️"
};

/**
 * Gradient colors for each focus category
 */
const FOCUS_GRADIENTS: Record<string, { from: string; to: string }> = {
  leadership: { from: "#dc2626", to: "#ef4444" },
  systems: { from: "#2563eb", to: "#3b82f6" },
  wealth: { from: "#059669", to: "#10b981" },
  execution: { from: "#ea580c", to: "#f97316" },
  strategy: { from: "#7c3aed", to: "#8b5cf6" },
  harmony: { from: "#0891b2", to: "#06b6d4" },
  expression: { from: "#db2777", to: "#ec4899" },
  support: { from: "#65a30d", to: "#84cc16" }
};

/**
 * Get priority level descriptor
 */
const getPriorityLevel = (percentage: number): string => {
  if (percentage >= 80) return "Critical Focus";
  if (percentage >= 60) return "High Priority";
  if (percentage >= 40) return "Medium Priority";
  return "Consider";
};

/**
 * FocusPriorities Component
 * 
 * Renders a premium card-based display of focus priorities with rankings.
 */
export const FocusPriorities: React.FC<FocusPrioritiesProps> = ({ priorities }) => {
  // Find maximum priority for normalization
  const maxPriority = Math.max(...priorities.map(p => p.priority), 1);
  
  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div 
            className="rounded-lg flex items-center justify-center shadow-lg"
            style={{ 
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
              border: "2px solid rgba(245, 158, 11, 0.3)"
            }}
          >
            <Target className="w-5 h-5 text-white" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Recommended Focus Areas
          </h3>
        </div>
        <div className="text-xs px-3 py-1.5 rounded-full text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 font-semibold">
          Top {priorities.length}
        </div>
      </div>

      {/* Priority Cards */}
      <div className="space-y-3">
        {priorities.map(({ category, priority, customLabel }, index) => {
          const focusData = FOCUS_CATEGORIES[category];
          
          // Handle missing category data gracefully
          if (!focusData) {
            console.warn(`Focus category "${category}" not found in FOCUS_CATEGORIES`);
            return null;
          }

          // Use custom label if provided, otherwise use default
          const displayLabel = customLabel || focusData.label;

          // Normalize priority to 0-100 scale
          const percentage = maxPriority > 0 ? Math.round((priority / maxPriority) * 100) : 0;
          const priorityLevel = getPriorityLevel(percentage);
          const gradient = FOCUS_GRADIENTS[category] || { from: "#6b7280", to: "#4b5563" };
          const icon = FOCUS_ICONS[category] || "🎯";
          const rank = index + 1;

          return (
            <div
              key={category}
              className="relative overflow-hidden rounded-xl p-4 border shadow-sm transition-all hover:shadow-md bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-900/50 border-gray-200 dark:border-gray-700"
            >
              {/* Subtle gradient overlay */}
              <div 
                className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-10"
                style={{
                  background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                }}
              />

              <div className="relative flex items-center gap-4">
                {/* Rank Badge */}
                <div className="flex-shrink-0">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md relative"
                    style={{
                      background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`
                    }}
                  >
                    <span className="text-xl">{icon}</span>
                    <div className="absolute -top-1 -left-1 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-sm border-2 border-white dark:border-gray-800">
                      <span className="text-xs font-bold text-gray-900">{rank}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                      {displayLabel}
                    </h4>
                    <span 
                      className="text-sm font-bold"
                      style={{ color: gradient.from }}
                    >
                      {percentage}%
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {focusData.description}
                  </p>
                  
                  {/* Priority Level Badge */}
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
                    <div 
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: gradient.from }}
                    />
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                      {priorityLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar at bottom */}
              <div className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-700 ease-out"
                  style={{
                    width: `${percentage}%`,
                    background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
