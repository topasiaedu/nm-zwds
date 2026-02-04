/**
 * AttributeBars Component
 * 
 * Displays key attributes as horizontal progress bars with icons and labels.
 * Each attribute is color-coded based on its value and includes animated transitions.
 */

import React from "react";
import { Crown, Coins, Brain, Target, Wind, LucideIcon } from "lucide-react";

/**
 * Component props interface
 */
interface AttributeBarsProps {
  /** Attribute values ranging from 0-100 */
  attributes: {
    /** Authority and leadership ability */
    authority: number;
    /** Material resources and wealth */
    resources: number;
    /** Strategic thinking and planning */
    strategy: number;
    /** Discipline and execution */
    discipline: number;
    /** Flow and ease of action */
    flow: number;
  };
}

/**
 * Configuration for a single attribute
 */
interface AttributeConfig {
  /** Unique key matching the attribute name */
  key: keyof AttributeBarsProps["attributes"];
  /** Display label */
  label: string;
  /** Icon component from Lucide React */
  icon: LucideIcon;
}

/**
 * Color theme identifier for value ranges
 */
type ColorTheme = "emerald" | "blue" | "amber" | "gray";

/**
 * Array of all attribute configurations in display order
 */
const ATTRIBUTES: readonly AttributeConfig[] = [
  { key: "authority", label: "Authority", icon: Crown },
  { key: "resources", label: "Resources", icon: Coins },
  { key: "strategy", label: "Strategy", icon: Brain },
  { key: "discipline", label: "Discipline", icon: Target },
  { key: "flow", label: "Flow", icon: Wind }
] as const;

/**
 * Color class mappings for text colors
 * Uses complete class names to ensure Tailwind purging works correctly
 */
const TEXT_COLOR_CLASSES: Record<ColorTheme, string> = {
  emerald: "text-emerald-600 dark:text-emerald-400",
  blue: "text-blue-600 dark:text-blue-400",
  amber: "text-amber-600 dark:text-amber-400",
  gray: "text-gray-600 dark:text-gray-400"
};

/**
 * Gradient styles for progress bars (using inline styles to avoid Tailwind purging)
 */
const GRADIENT_STYLES: Record<ColorTheme, string> = {
  emerald: "linear-gradient(90deg, #10b981, #059669)",
  blue: "linear-gradient(90deg, #3b82f6, #2563eb)",
  amber: "linear-gradient(90deg, #f59e0b, #d97706)",
  gray: "linear-gradient(90deg, #6b7280, #4b5563)"
};

/**
 * Determines the color theme based on the attribute value
 * 
 * @param value - Attribute value from 0-100
 * @returns Color theme identifier
 */
const getColorTheme = (value: number): ColorTheme => {
  if (value >= 80) {
    return "emerald";
  }
  if (value >= 65) {
    return "blue";
  }
  if (value >= 50) {
    return "amber";
  }
  return "gray";
};

/**
 * AttributeBars Component
 * 
 * Renders a panel with 5 horizontal attribute bars, each showing
 * the value with an icon, label, percentage, and animated progress bar.
 */
export const AttributeBars: React.FC<AttributeBarsProps> = ({ attributes }) => {
  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Core Attributes
        </h3>
        <div className="text-xs px-3 py-1.5 rounded-full text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700">
          Scale 0-100
        </div>
      </div>
      
      <div className="space-y-6">
        {ATTRIBUTES.map(({ key, label, icon: Icon }) => {
          const value = attributes[key];
          const colorTheme = getColorTheme(value);
          const textColorClass = TEXT_COLOR_CLASSES[colorTheme];
          const gradientStyle = GRADIENT_STYLES[colorTheme];
          
          // Get descriptor
          const getDescriptor = (val: number): string => {
            if (val >= 80) return "Exceptional";
            if (val >= 65) return "Strong";
            if (val >= 50) return "Moderate";
            return "Developing";
          };
          
          return (
            <div key={key} className="group">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow"
                    style={{ background: gradientStyle }}
                  >
                    <Icon className="w-5 h-5 text-white" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">
                      {label}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {getDescriptor(value)}
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
                    {value}
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="h-4 rounded-full overflow-hidden shadow-inner bg-gray-100 dark:bg-gray-700">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden"
                    style={{
                      width: `${value}%`,
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
