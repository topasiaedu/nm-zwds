/**
 * TimeframeSelector Stage
 * User selects temporal layer for analysis
 * Displays orbital orbs in a horizontal timeline
 */

import React from "react";
import { motion } from "framer-motion";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";
import { TIMEFRAME_CONFIGS } from "../../../utils/destiny-navigator/timeframe-config";
import { getAspectConfig } from "../../../utils/destiny-navigator/aspect-config";

/**
 * Component props
 */
interface TimeframeSelectorProps {
  selectedAspect: LifeAspect | null; // Currently selected aspect
  onBack: () => void; // Callback to return to aspect selection
  onSelect: (timeframe: TimeFrame) => void; // Callback when timeframe is selected
}

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

/**
 * Orb animation variants
 */
const orbVariants = {
  hidden: { opacity: 0, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

/**
 * TimeframeSelector - Stage 3 of Destiny Navigator
 * Temporal layer selection with orbital orbs
 */
const TimeframeSelector: React.FC<TimeframeSelectorProps> = ({
  selectedAspect,
  onBack,
  onSelect
}) => {
  /**
   * Get aspect configuration for display
   */
  const aspectConfig = selectedAspect ? getAspectConfig(selectedAspect) : null;

  /**
   * Handle timeframe orb click
   */
  const handleTimeframeClick = (timeframe: TimeFrame): void => {
    onSelect(timeframe);
  };

  /**
   * Handle back button click
   */
  const handleBackClick = (): void => {
    onBack();
  };

  /**
   * Handle keyboard navigation
   */
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        handleBackClick();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return (): void => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  /**
   * Handle keyboard selection
   */
  const handleKeyDown = (event: React.KeyboardEvent, timeframe: TimeFrame): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleTimeframeClick(timeframe);
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8"
      role="main"
      aria-label="Timeframe Selection"
    >
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-8"
        >
          <button
            onClick={handleBackClick}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 dark:text-cyan-300 hover:text-gray-900 dark:hover:text-cyan-200 transition-colors group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 rounded-lg"
            aria-label="Go back to aspect selection"
          >
            <svg
              className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Aspects
          </button>
        </motion.div>

        {/* NLP Prompt */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight px-4">
            In which temporal layer shall we examine your <span className="text-cyan-600 dark:text-cyan-300 font-extrabold">{aspectConfig?.label || "destiny"}</span>?
          </h2>
          <p className="text-gray-600 dark:text-cyan-200 text-lg md:text-xl font-light">
            Choose your timeframe to continue
          </p>
        </motion.div>

        {/* Timeframe Timeline */}
        <motion.div
          variants={containerVariants}
          className="relative max-w-5xl mx-auto"
        >
          {/* Connecting Line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 opacity-30 transform -translate-y-1/2 hidden md:block"
            style={{ transformOrigin: "left" }}
          />

          {/* Timeframe Orbs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-6 lg:gap-4 relative z-10">
            {TIMEFRAME_CONFIGS.map((timeframe, index) => (
              <motion.div
                key={timeframe.key}
                variants={orbVariants}
                className="flex flex-col items-center"
              >
                <button
                  onClick={() => handleTimeframeClick(timeframe.key)}
                  onKeyDown={(e) => handleKeyDown(e, timeframe.key)}
                  className="group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900 rounded-full"
                  aria-label={`Select ${timeframe.label} timeframe - ${timeframe.description}`}
                  tabIndex={0}
                >
                  {/* Orb Container */}
                  <div className="relative w-36 h-36 md:w-40 md:h-40 mb-4 mx-auto">
                    {/* Particle Ring Effect (CSS-based) */}
                    <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30 animate-pulse" />
                    <div
                      className="absolute inset-0 rounded-full border-2 border-blue-400/20 animate-ping"
                      style={{ animationDuration: "3s" }}
                    />

                    {/* Main Orb */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/30 via-blue-400/30 to-purple-400/30 dark:from-cyan-500/40 dark:via-blue-500/40 dark:to-purple-500/40 backdrop-blur-lg border border-gray-300 dark:border-white/30 group-hover:from-cyan-400/50 group-hover:via-blue-400/50 group-hover:to-purple-400/50 dark:group-hover:from-cyan-400/60 dark:group-hover:via-blue-400/60 dark:group-hover:to-purple-400/60 group-hover:scale-110 group-hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] transition-all duration-300 flex items-center justify-center">
                      {/* Icon */}
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
                        {timeframe.icon}
                      </span>
                    </div>

                    {/* Pulsing Glow */}
                    <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
                  </div>

                  {/* Label */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors duration-300">
                      {timeframe.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-300 transition-colors duration-300 max-w-[200px] mx-auto">
                      {timeframe.description}
                    </p>
                  </div>
                </button>

                {/* Connection indicator for mobile */}
                {index < TIMEFRAME_CONFIGS.length - 1 && (
                  <div className="md:hidden w-full h-8 flex items-center justify-center">
                    <div className="w-px h-full bg-gradient-to-b from-cyan-500 to-blue-500 opacity-30" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 dark:text-cyan-200/60 text-sm italic">
            Each timeframe reveals different layers of your destiny
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TimeframeSelector;

