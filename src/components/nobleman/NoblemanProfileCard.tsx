/**
 * Nobleman Profile Card Component
 * 
 * Main nobleman profile card that displays detailed information about
 * the nobleman for the current Dayun palace.
 */

import React from "react";
import type { NoblemanData } from "../../types/nobleman";

interface NoblemanProfileCardProps extends NoblemanData {
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
}

/**
 * NoblemanProfileCard Component
 * 
 * Large, prominent card showing:
 * - Current Dayun palace
 * - Chinese zodiac
 * - 5 recent birth years
 * - 1-2 matched nobleman profiles with characteristics
 */
const NoblemanProfileCard: React.FC<NoblemanProfileCardProps> = ({
  palaceName,
  zodiac,
  yearExamples,
  matchedProfiles,
  theme = "light",
}) => {
  return (
    <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden mb-6">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/30 dark:to-indigo-900/30">
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
          Your Nobleman Profile
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Based on {palaceName} analysis
        </p>
      </div>
      
      {/* Zodiac Section */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left: Zodiac Info */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              <span className="text-xs font-bold uppercase tracking-wider">Chinese Zodiac</span>
            </div>
            <div className="text-4xl font-bold mb-2 text-gray-900 dark:text-white">
              {zodiac}
            </div>
            <div className="text-sm mb-4 text-gray-600 dark:text-gray-400">
              Look for people born in these years:
            </div>
            <div className="flex flex-wrap gap-2">
              {yearExamples.map((year) => (
                <div
                  key={year}
                  className="px-4 py-2 rounded-lg font-semibold bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                >
                  {year}
                </div>
              ))}
            </div>
          </div>
          
          {/* Right: Visual Element */}
          <div className="flex items-center justify-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20">
            <div className="text-center">
              <div className="w-32 h-32 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center shadow-lg">
                <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
                  />
                </svg>
              </div>
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {matchedProfiles.length} Nobleman {matchedProfiles.length > 1 ? "Types" : "Type"} Identified
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Nobleman Types Section */}
      <div className="p-6">
        <div className="text-xs font-bold uppercase tracking-wider mb-4 text-gray-600 dark:text-gray-400">
          Nobleman Characteristics
        </div>
        
        {matchedProfiles.length > 0 ? (
          <div className="space-y-4">
            {matchedProfiles.map((profile, idx) => (
              <div
                key={`${profile.type}-${idx}`}
                className={`p-5 rounded-xl border-l-4 ${
                  idx === 0
                    ? "border-l-purple-500 bg-gradient-to-r from-purple-50/50 to-transparent dark:from-purple-900/20"
                    : "border-l-indigo-500 bg-gradient-to-r from-indigo-50/50 to-transparent dark:from-indigo-900/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="text-lg font-bold text-gray-900 dark:text-white">
                    {profile.type}
                  </div>
                  <div className="px-2 py-1 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {profile.stars}
                  </div>
                </div>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {profile.characteristics}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <p className="text-sm">
              No specific nobleman stars found in this palace. Your nobleman may come through general support networks.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoblemanProfileCard;
