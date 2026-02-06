/**
 * Nobleman Hero Card Component
 * 
 * Section introduction hero card with purple/indigo gradient.
 * Shows the current Dayun context and introduces the nobleman analysis.
 */

import React from "react";

interface NoblemanHeroCardProps {
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
        {/* Full Width - Title & Description */}
        <div className="flex-1">
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
          <p className="text-white text-sm leading-relaxed max-w-2xl drop-shadow-md">
            Based on your chart structure, here are the people who will be most beneficial to you. These individuals align with your natural strengths and can provide crucial support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NoblemanHeroCard;
