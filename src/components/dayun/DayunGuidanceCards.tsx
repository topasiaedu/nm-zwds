/**
 * Dayun Guidance Cards Component
 * 
 * Displays two side-by-side cards:
 * - "What To Do This Cycle" (green gradient) with key actions
 * - "Watch Out For" (amber/orange gradient) with warnings
 */

import React from "react";
import type { DayunCycleExtended } from "../../types/dayun";

interface DayunGuidanceCardsProps {
  dayun: DayunCycleExtended;
}

/**
 * DayunGuidanceCards component provides actionable guidance for the current cycle
 */
export const DayunGuidanceCards: React.FC<DayunGuidanceCardsProps> = ({ dayun }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* What To Do Card */}
      <div className="rounded-2xl shadow-lg border p-6 bg-white dark:bg-gray-800 border-green-200 dark:border-green-700/50">
        <div className="flex items-center gap-3 mb-5">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" 
            style={{ backgroundColor: '#10b981', color: '#ffffff' }}
          >
            <span className="text-lg font-bold">✓</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            What To Do This Cycle
          </h4>
        </div>
        <ul className="space-y-3">
          {dayun.keyActions.map((action, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#10b981', color: '#ffffff' }}>
                <span className="text-xs font-bold">{idx + 1}</span>
              </div>
              <span className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                {action}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Watch Out Card */}
      <div className="rounded-2xl shadow-lg border p-6 bg-white dark:bg-gray-800 border-amber-200 dark:border-amber-700/50">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-md" style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}>
            <span className="text-lg font-bold">!</span>
          </div>
          <h4 className="text-lg font-bold text-gray-900 dark:text-white">
            Watch Out For
          </h4>
        </div>
        <ul className="space-y-3">
          {dayun.watchOut.map((warning, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-6 h-6 mt-0.5 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm" style={{ backgroundColor: '#f59e0b', color: '#ffffff' }}>
                <span className="text-xs font-bold">!</span>
              </div>
              <span className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                {warning}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
