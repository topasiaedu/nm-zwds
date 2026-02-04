/**
 * AspectMetricsBars Component
 * 
 * Displays aspect-specific metrics with contextual labels and descriptions.
 * Replaces generic AttributeBars with meaningful, context-aware metrics.
 */

import React from "react";
import * as LucideIcons from "lucide-react";
import { LifeAspect } from "../../../types/destiny-navigator";
import { getAspectContextHint } from "../../../utils/destiny-navigator/aspect-metrics";

/**
 * Single metric data
 */
interface MetricData {
  key: string;
  label: string;
  value: number;
  iconName: string;
  description: string;
}

/**
 * Component props
 */
interface AspectMetricsBarsProps {
  metrics: MetricData[];
  aspect: LifeAspect;
}

/**
 * Gradient colors for metric values
 */
const getGradientStyle = (value: number): string => {
  if (value >= 80) return "linear-gradient(90deg, #10b981, #059669)"; // Emerald
  if (value >= 65) return "linear-gradient(90deg, #3b82f6, #2563eb)"; // Blue
  if (value >= 50) return "linear-gradient(90deg, #f59e0b, #d97706)"; // Amber
  return "linear-gradient(90deg, #6b7280, #4b5563)"; // Gray
};

/**
 * Get descriptor text for value
 */
const getDescriptor = (value: number): string => {
  if (value >= 80) return "Exceptional";
  if (value >= 65) return "Strong";
  if (value >= 50) return "Moderate";
  return "Developing";
};

/**
 * AspectMetricsBars Component
 */
export const AspectMetricsBars: React.FC<AspectMetricsBarsProps> = ({ 
  metrics, 
  aspect 
}) => {
  const contextHint = getAspectContextHint(aspect);

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      {/* Header with context */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Key Indicators
          </h3>
          <div className="text-xs px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
            Scale 0-100
          </div>
        </div>
        {contextHint && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {contextHint}
          </p>
        )}
      </div>
      
      {/* Metrics */}
      <div className="space-y-6">
        {metrics.map((metric) => {
          const gradientStyle = getGradientStyle(metric.value);
          const descriptor = getDescriptor(metric.value);
          
          // Get icon component dynamically
          // TypeScript requires unknown intermediate cast for namespace to Record conversion
          type IconComponentType = typeof LucideIcons.Star;
          const icons = LucideIcons as unknown as Record<string, IconComponentType>;
          const IconComponent = icons[metric.iconName] || LucideIcons.Star;
          
          return (
            <div key={metric.key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                    style={{ background: gradientStyle }}
                  >
                    <IconComponent 
                      className="w-5 h-5 text-white" 
                      style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} 
                    />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {metric.label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.description}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className="text-2xl font-bold"
                    style={{ 
                      background: gradientStyle,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text"
                    }}
                  >
                    {metric.value}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {descriptor}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-4 rounded-full overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: `${metric.value}%`,
                      background: gradientStyle
                    }}
                  >
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)"
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
