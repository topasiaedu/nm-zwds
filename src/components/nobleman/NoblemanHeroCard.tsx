/**
 * Nobleman Hero Card Component
 * 
 * Section introduction hero card with purple/indigo gradient.
 * Shows the current Dayun context and introduces the nobleman analysis.
 */

import React from "react";

interface NoblemanHeroCardProps {
  /** Current Dayun palace name (e.g., "Spouse Palace") */
  dayunPalace: string;
  
  /** Start year of current Dayun cycle */
  startYear: number;
  
  /** End year of current Dayun cycle */
  endYear: number;
  
  /** Optional: Priority focus message */
  priorityFocus?: string;
  
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
}

/**
 * NoblemanHeroCard Component
 * 
 * Premium gradient hero card that introduces the nobleman analysis section.
 * Provides context about the current life cycle (Dayun).
 */
const NoblemanHeroCard: React.FC<NoblemanHeroCardProps> = ({
  dayunPalace,
  startYear,
  endYear,
  priorityFocus,
  theme = "light",
}) => {
  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-90 dark:opacity-95" 
      />
      
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-100 dark:opacity-50" 
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,.15) 1px, transparent 1px),
             radial-gradient(circle at 80% 80%, rgba(255,255,255,.15) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }} 
      />
      
      {/* Content */}
      <div className="relative px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          {/* Left Side - Title & Description */}
          <div className="flex-1 min-w-[300px]">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
                Nobleman Analysis
              </span>
            </div>
            
            {/* Title */}
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight drop-shadow-lg">
              Your Key People
            </h1>
            
            {/* Description */}
            <p className="text-white text-sm leading-relaxed max-w-xl drop-shadow-md">
              Based on your current life cycle and chart structure, here are the people who will be most beneficial to you during this period.
            </p>
          </div>
          
          {/* Right Side - Cycle Badge */}
          <div className="flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl min-w-[180px]">
              <div className="text-center">
                {/* Cycle Label */}
                <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Current 10-Year Cycle
                </div>
                
                {/* Palace Name */}
                <div className="text-white text-lg font-bold mb-1">
                  {dayunPalace}
                </div>
                
                {/* Years */}
                <div className="text-white/90 text-sm mb-3">
                  {startYear}-{endYear}
                </div>
                
                {/* Priority Focus (if provided) */}
                {priorityFocus && (
                  <div className="pt-3 border-t border-white/20">
                    <div className="text-white/80 text-xs mb-1">Priority Focus</div>
                    <div className="text-white text-sm font-semibold">{priorityFocus}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoblemanHeroCard;
