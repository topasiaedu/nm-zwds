/**
 * Cycle Timeline Component
 * 
 * Displays previous, current, and future 10-year cycles in a timeline format.
 * Current cycle is highlighted with active badge.
 */

import React from "react";
import type { DayunCycleExtended, DayunSeason } from "../../types/dayun";
import { SEASON_COLORS, SEASON_ICONS } from "../../utils/dayun/seasonMapper";

interface CycleTimelineProps {
  dayun: DayunCycleExtended;
}

type CycleDisplay = {
  years: string;
  season: DayunSeason;
  palace: string;
  label: string;
  isCurrent: boolean;
};

/**
 * CycleTimeline component shows the journey through past, present, and future cycles
 */
export const CycleTimeline: React.FC<CycleTimelineProps> = ({ dayun }) => {
  const cycles: CycleDisplay[] = [
    ...(dayun.previousCycle
      ? [
          {
            ...dayun.previousCycle,
            label: "Previous",
            isCurrent: false,
          } as CycleDisplay,
        ]
      : []),
    {
      years: `${dayun.startYear}-${dayun.endYear}`,
      season: dayun.season,
      palace: dayun.palace,
      label: "Current",
      isCurrent: true,
    },
    ...(dayun.nextCycle
      ? [
          {
            ...dayun.nextCycle,
            label: "Next",
            isCurrent: false,
          } as CycleDisplay,
        ]
      : []),
  ];

  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-6 mb-6">
      <h4 className="text-lg font-bold mb-5 text-gray-900 dark:text-white">
        Your Dayun Journey
      </h4>
      
      <div className="space-y-4">
        {cycles.map((cycle, idx) => {
          const seasonColor = SEASON_COLORS[cycle.season];
          const seasonIcon = SEASON_ICONS[cycle.season];
          
          return (
            <div key={idx} className="relative">
              <div 
                className={`flex items-center gap-4 p-4 rounded-xl transition-all border ${
                  cycle.isCurrent
                    ? `bg-gradient-to-r ${seasonColor.bg} dark:bg-gray-700 border-2`
                    : "bg-gray-50 dark:bg-gray-700/30 border"
                } border-gray-200 dark:border-gray-600`}
              >
                <div 
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0 ${
                    !cycle.isCurrent && "opacity-50"
                  }`}
                  style={{ backgroundColor: seasonColor.primary }}
                >
                  <span className="text-2xl" style={{ filter: 'none' }}>{seasonIcon}</span>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      {cycle.label}
                    </span>
                    {cycle.isCurrent && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-bold"
                        style={{ backgroundColor: seasonColor.primary, color: '#ffffff' }}
                      >
                        Active
                      </span>
                    )}
                  </div>
                  <div className="text-sm font-bold text-gray-900 dark:text-white">
                    {cycle.years} • {cycle.season.toUpperCase()} SEASON
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    {cycle.palace}
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
