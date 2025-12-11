/**
 * Decision Point Hero Component
 * 
 * Shows the critical "NOW" moment as a decision gate with two diverging paths.
 * Creates urgency and context for why strategic planning matters.
 * This addresses the need to show users they are at a crossroads.
 */

import React from "react";
import type { DayunCycleExtended } from "../../types/dayun";
import { SEASON_COLORS } from "../../utils/dayun/seasonMapper";

interface DecisionPointHeroProps {
  dayun: DayunCycleExtended;
}

/**
 * DecisionPointHero component displays the critical decision moment
 */
export const DecisionPointHero: React.FC<DecisionPointHeroProps> = ({ dayun }) => {
  const seasonColor = SEASON_COLORS[dayun.season];
  const currentYear = dayun.currentYear - dayun.startYear + 1;
  const yearsRemaining = 10 - currentYear + 1;

  return (
    <div className="rounded-2xl shadow-2xl border bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700 p-8 mb-6 overflow-hidden relative">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br opacity-5 rounded-full blur-3xl"
           style={{ background: `radial-gradient(circle, ${seasonColor.primary} 0%, transparent 70%)` }}></div>
      
      <div className="relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            You Are at a Decision Point
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Your next {yearsRemaining} year{yearsRemaining === 1 ? "" : "s"} in this cycle will be shaped by the decisions you make today
          </p>
        </div>

        {/* Decision Paths */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Path 1: Strategic Action */}
          <div className="relative">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 border-2 shadow-lg transition-all hover:shadow-xl hover:scale-105"
                 style={{ borderColor: seasonColor.primary }}>
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-md"
                      style={{ backgroundColor: seasonColor.primary }}>
                  5% Take This Path
                </span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 mx-auto"
                   style={{ backgroundColor: `${seasonColor.primary}20` }}>
                <svg className="w-8 h-8" style={{ color: seasonColor.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>

              {/* Content */}
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-center">
                Strategic Action Path
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Clear direction and focused execution</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Maximized income and opportunities</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Time invested wisely on core strengths</span>
                </li>
                <li className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-green-500 font-bold mt-0.5">✓</span>
                  <span>Prepared for next cycle transition</span>
                </li>
              </ul>

              {/* Arrow pointing down */}
              <div className="mt-6 text-center">
                <svg className="w-6 h-6 mx-auto animate-bounce" style={{ color: seasonColor.primary }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <p className="text-xs font-semibold mt-2" style={{ color: seasonColor.primary }}>
                  MORE FREEDOM
                </p>
              </div>
            </div>
          </div>

          {/* Path 2: Wait and See */}
          <div className="relative">
            <div className="h-full bg-white dark:bg-gray-800 rounded-xl p-6 border-2 border-gray-300 dark:border-gray-600 shadow-lg opacity-75">
              {/* Badge */}
              <div className="absolute -top-3 left-6">
                <span className="px-3 py-1 bg-gray-500 rounded-full text-xs font-bold text-white shadow-md">
                  95% Take This Path
                </span>
              </div>

              {/* Icon */}
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4 mx-auto">
                <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              {/* Content */}
              <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-3 text-center">
                Wait &amp; See Path
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-red-500 font-bold mt-0.5">✗</span>
                  <span>Scattered efforts, no clear direction</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-red-500 font-bold mt-0.5">✗</span>
                  <span>Missed opportunities and income</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-red-500 font-bold mt-0.5">✗</span>
                  <span>Time wasted on wrong decisions</span>
                </li>
                <li className="flex items-start gap-2 text-gray-600 dark:text-gray-400">
                  <span className="text-red-500 font-bold mt-0.5">✗</span>
                  <span>Unprepared when cycle ends</span>
                </li>
              </ul>

              {/* Arrow pointing down */}
              <div className="mt-6 text-center">
                <svg className="w-6 h-6 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                <p className="text-xs font-semibold text-gray-500 mt-2">
                  CONFUSION &amp; FEAR
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
