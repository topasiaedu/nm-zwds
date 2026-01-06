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
 * Visual grid of cards showing nobleman types for other key life palaces.
 * Redesigned to focus on nobleman type with clean, modern look.
 */

/**
 * Convert gradient identifier to inline CSS gradients
 */
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

/**
 * Get icon SVG for each life area
 */
const getAreaIcon = (objective: string): JSX.Element => {
  switch (objective) {
    case "Career Growth":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      );
    case "Wealth Building":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    case "Health & Wellness":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    case "Personal Growth":
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      );
    default:
      return (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      );
  }
};

const OtherLifeAreas: React.FC<OtherLifeAreasProps> = ({
  areas,
  theme = "light",
}) => {
  if (areas.length === 0) {
    return null;
  }

  return (
    <div className="rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 p-8 mb-8">
      {/* Section Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1.5 h-8 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Other Life Areas
          </h3>
        </div>
        <p className="text-base text-gray-600 dark:text-gray-400 ml-6">
          Key nobleman types supporting different aspects of your life
        </p>
      </div>
      
      {/* Grid of Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {areas.map((area) => (
          <div
            key={`${area.objective}-${area.palaceName}`}
            className="group relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
          >
            {/* Gradient Header with Icon */}
            <div 
              className="relative p-6 text-white overflow-hidden"
              style={getGradientStyle(area.gradient)}
            >
              {/* Pattern Overlay */}
              <div 
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
                  backgroundSize: "20px 20px"
                }}
              />
              
              <div className="relative flex items-start justify-between">
                <div className="flex-1">
                  <div className="text-sm font-semibold mb-1 opacity-90">
                    {area.objective}
                  </div>
                  <div className="text-xs opacity-75">
                    {area.palaceChinese}
                  </div>
                </div>
                <div className="ml-3 opacity-80">
                  {getAreaIcon(area.objective)}
                </div>
              </div>
            </div>
            
            {/* Content - Nobleman Type */}
            <div className="p-6">
              <div className="flex items-start gap-3">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
                </div>
                <div>
                  <div className="text-xs font-bold mb-2 text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Nobleman Type
                  </div>
                  <div className="text-base font-bold text-gray-900 dark:text-white leading-snug">
                    {area.noblemanType}
                  </div>
                </div>
              </div>
              
              {/* Palace Name Badge */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {area.palaceName}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Hover Effect Border */}
            <div className="absolute inset-0 rounded-2xl ring-2 ring-transparent group-hover:ring-indigo-500/50 transition-all pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OtherLifeAreas;
