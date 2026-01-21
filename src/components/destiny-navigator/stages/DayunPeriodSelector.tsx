/**
 * DayunPeriodSelector Stage
 * User selects which 10-year Dayun period to analyze (current or next)
 * Displayed after selecting "dayun" timeframe
 */

import React from "react";
import { motion } from "framer-motion";
import { LifeAspect } from "../../../types/destiny-navigator";
import { getAspectConfig } from "../../../utils/destiny-navigator/aspect-config";

/**
 * Dayun period options
 */
export type DayunPeriod = "current" | "next";

/**
 * Component props
 */
interface DayunPeriodSelectorProps {
  selectedAspect: LifeAspect | null; // Currently selected aspect
  onBack: () => void; // Callback to return to timeframe selection
  onSelect: (period: DayunPeriod) => void; // Callback when period is selected
}

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

/**
 * Card animation variants
 */
const cardVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

/**
 * DayunPeriodSelector - Intermediate stage for selecting current/next dayun
 */
const DayunPeriodSelector: React.FC<DayunPeriodSelectorProps> = ({
  selectedAspect,
  onBack,
  onSelect
}) => {
  /**
   * Get aspect configuration for display
   */
  const aspectConfig = selectedAspect ? getAspectConfig(selectedAspect) : null;

  /**
   * Handle period selection
   */
  const handlePeriodClick = (period: DayunPeriod): void => {
    onSelect(period);
  };

  /**
   * Handle back button click
   */
  const handleBackClick = React.useCallback((): void => {
    onBack();
  }, [onBack]);

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
  }, [handleBackClick]);

  /**
   * Handle keyboard selection
   */
  const handleKeyDown = (event: React.KeyboardEvent, period: DayunPeriod): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handlePeriodClick(period);
    }
  };

  /**
   * Period options configuration
   */
  const periods = [
    {
      key: "current" as DayunPeriod,
      label: "Current Dayun",
      icon: "📍",
      description: "Analyze your present 10-year cycle",
      gradient: "from-cyan-400/30 via-blue-400/30 to-indigo-400/30",
      darkGradient: "dark:from-cyan-500/40 dark:via-blue-500/40 dark:to-indigo-500/40",
      hoverGradient: "group-hover:from-cyan-400/50 group-hover:via-blue-400/50 group-hover:to-indigo-400/50",
      darkHoverGradient: "dark:group-hover:from-cyan-400/60 dark:group-hover:via-blue-400/60 dark:group-hover:to-indigo-400/60"
    },
    {
      key: "next" as DayunPeriod,
      label: "Next Dayun",
      icon: "⏭️",
      description: "Preview your upcoming 10-year cycle",
      gradient: "from-purple-400/30 via-pink-400/30 to-rose-400/30",
      darkGradient: "dark:from-purple-500/40 dark:via-pink-500/40 dark:to-rose-500/40",
      hoverGradient: "group-hover:from-purple-400/50 group-hover:via-pink-400/50 group-hover:to-rose-400/50",
      darkHoverGradient: "dark:group-hover:from-purple-400/60 dark:group-hover:via-pink-400/60 dark:group-hover:to-rose-400/60"
    }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
      role="main"
      aria-label="Dayun Period Selection"
    >
      <div className="max-w-5xl mx-auto">
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
            aria-label="Go back to timeframe selection"
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
            Back to Timeframes
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
            Which 10-year period would you like to examine for your <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{aspectConfig?.label || "aspect"}</span>?
          </h2>
          <p className="text-gray-600 dark:text-cyan-200 text-lg md:text-xl font-light">
            Select your Dayun cycle
          </p>
        </motion.div>

        {/* Period Selection Cards */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {periods.map((period) => (
            <motion.div
              key={period.key}
              variants={cardVariants}
              className="flex flex-col items-center"
            >
              <button
                onClick={() => handlePeriodClick(period.key)}
                onKeyDown={(e) => handleKeyDown(e, period.key)}
                className="group w-full focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-2xl"
                aria-label={`Select ${period.label} - ${period.description}`}
                tabIndex={0}
              >
                {/* Card Container */}
                <div className={`relative overflow-hidden rounded-2xl p-8 transition-all duration-300 bg-gradient-to-br ${period.gradient} ${period.darkGradient} ${period.hoverGradient} ${period.darkHoverGradient} backdrop-blur-lg border border-white/30 group-hover:border-white/50 group-hover:scale-105 group-hover:shadow-[0_0_50px_rgba(6,182,212,0.4)] min-h-[280px] flex flex-col items-center justify-center`}>
                  {/* Pulsing Glow */}
                  <div className="absolute inset-0 rounded-2xl bg-cyan-400/10 blur-xl animate-pulse" />
                  
                  <div className="relative z-10 text-center">
                    {/* Icon */}
                    <div className="text-7xl mb-4 group-hover:scale-110 transition-transform duration-300">
                      {period.icon}
                    </div>
                    
                    {/* Label */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors duration-300">
                      {period.label}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-base text-gray-700 dark:text-white/80 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 max-w-xs mx-auto">
                      {period.description}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 dark:text-cyan-200/60 text-sm italic">
            Each Dayun cycle lasts 10 years and brings unique energies and opportunities
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DayunPeriodSelector;







