/**
 * Dayun Season Hero Component
 * 
 * Large hero card displaying the current season with visual emphasis.
 * Shows season icon, title, core message, palace context, and progress.
 */

import React from "react";
import type { DayunCycleExtended } from "../../types/dayun";
import { SEASON_COLORS, SEASON_ICONS } from "../../utils/dayun/seasonMapper";

interface DayunSeasonHeroProps {
  dayun: DayunCycleExtended;
}

/**
 * DayunSeasonHero component displays the current 10-year season prominently
 */
export const DayunSeasonHero: React.FC<DayunSeasonHeroProps> = ({ dayun }) => {
  const seasonColor = SEASON_COLORS[dayun.season];
  const seasonIcon = SEASON_ICONS[dayun.season];
  
  const yearsElapsed = dayun.currentYear - dayun.startYear;
  const totalYears = dayun.endYear - dayun.startYear + 1;
  const progress = (yearsElapsed / totalYears) * 100;

  // Helper to get gradient colors based on season
  const getGradientColors = (season: string) => {
    switch (season) {
      case 'spring':
        return 'linear-gradient(to bottom right, #10b981, #059669)'; // emerald-500 to emerald-600
      case 'summer':
        return 'linear-gradient(to bottom right, #f59e0b, #eab308)'; // amber-500 to yellow-500
      case 'autumn':
        return 'linear-gradient(to bottom right, #f97316, #ef4444)'; // orange-500 to red-500
      case 'winter':
        return 'linear-gradient(to bottom right, #3b82f6, #06b6d4)'; // blue-500 to cyan-500
      default:
        return 'linear-gradient(to bottom right, #6b7280, #4b5563)';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl mb-6 shadow-xl">
      {/* Season Gradient Background */}
      <div 
        className="absolute inset-0 opacity-90 dark:opacity-95"
        style={{ 
          backgroundImage: getGradientColors(dayun.season)
        }}
      />
      
      {/* Pattern Overlay */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,.05) 1px, transparent 1px),
                           radial-gradient(circle at 80% 80%, rgba(255,255,255,.05) 1px, transparent 1px)`,
          backgroundSize: "50px 50px"
        }} 
      />
      
      {/* Content */}
      <div className="relative px-8 py-10">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div className="flex-1 min-w-[300px]">
            <div className="inline-flex items-center gap-2 bg-black/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-4 border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-white text-xs font-bold uppercase tracking-wider drop-shadow-lg">
                Your Current Season
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-4">
              <div className="text-6xl drop-shadow-lg">{seasonIcon}</div>
              <div>
                <h1 className="text-4xl font-bold text-white mb-1 tracking-tight drop-shadow-lg uppercase">
                  {dayun.season} SEASON
                </h1>
                <p className="text-xl text-white font-semibold drop-shadow-md">
                  {dayun.seasonTitle}
                </p>
              </div>
            </div>
            
            <p className="text-white text-sm leading-relaxed drop-shadow-md mb-4">
              {dayun.coreMessage}
            </p>
            
            {/* Palace Context */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <span className="text-white text-lg font-bold">宮</span>
              <div>
                <span className="text-white font-semibold text-sm">{dayun.palace}</span>
                <span className="text-white/70 text-xs ml-2">{dayun.palaceChinese}</span>
              </div>
            </div>
          </div>
          
          {/* Timeline Badge */}
          <div className="flex-shrink-0">
            <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-2xl min-w-[140px]">
              <div className="text-center mb-4">
                <div className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
                  10-Year Cycle
                </div>
                <div className="text-white text-lg font-bold">
                  {dayun.startYear}-{dayun.endYear}
                </div>
              </div>
              
              <div className="bg-black/20 rounded-lg p-3 border border-white/20">
                <div className="text-white/80 text-xs mb-2 text-center">
                  Year {yearsElapsed + 1} of {totalYears}
                </div>
                <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-white text-xs font-bold text-center mt-2">
                  {Math.round(progress)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
