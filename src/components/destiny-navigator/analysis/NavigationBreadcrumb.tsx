/**
 * NavigationBreadcrumb Component
 * Shows the user's selection path with clickable segments for navigation
 */

import React from "react";
import { motion } from "framer-motion";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";
import { getAspectConfig } from "../../../utils/destiny-navigator/aspect-config";
import { getTimeframeConfig } from "../../../utils/destiny-navigator/timeframe-config";

/**
 * Component props
 */
interface NavigationBreadcrumbProps {
  aspect: LifeAspect;
  timeframe: TimeFrame;
  onBackToTimeframe: () => void;
  onBackToAspect: () => void;
  onChangeSelection: () => void;
}

/**
 * NavigationBreadcrumb - Shows selection path with navigation controls
 */
const NavigationBreadcrumb: React.FC<NavigationBreadcrumbProps> = ({
  aspect,
  timeframe,
  onBackToTimeframe,
  onBackToAspect,
  onChangeSelection
}) => {
  const aspectConfig = getAspectConfig(aspect);
  const timeframeConfig = getTimeframeConfig(timeframe);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
      {/* Left: Title and subtitle */}
      <div>
        <h1 className="text-3xl font-bold dark:text-white flex items-center">
          <svg
            className="w-7 h-7 mr-2 text-cyan-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {aspectConfig?.label || aspect} Analysis
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {timeframeConfig?.label || timeframe} perspective on your {aspectConfig?.label?.toLowerCase() || aspect}
        </p>
      </div>

      {/* Right: Back button */}
      <button
        onClick={onBackToTimeframe}
        className="inline-flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 
                   font-medium hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
      >
        <svg
          className="w-5 h-5 mr-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
        Back
      </button>
    </div>
  );
};

export default NavigationBreadcrumb;
