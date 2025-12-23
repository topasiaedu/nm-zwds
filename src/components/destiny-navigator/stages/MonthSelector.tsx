/**
 * MonthSelector Stage
 * User selects which month to analyze for monthly timeframe
 * Displayed after selecting "liumonth" timeframe
 */

import React from "react";
import { motion } from "framer-motion";
import { LifeAspect } from "../../../types/destiny-navigator";
import { getAspectConfig } from "../../../utils/destiny-navigator/aspect-config";

/**
 * Component props
 */
interface MonthSelectorProps {
  selectedAspect: LifeAspect | null; // Currently selected aspect
  onBack: () => void; // Callback to return to timeframe selection
  onSelect: (month: number) => void; // Callback when month is selected (1-12)
}

/**
 * Container animation variants
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.3
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

/**
 * Month button animation variants
 */
const monthVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: [0.4, 0, 0.2, 1] as const
    }
  }
};

/**
 * MonthSelector - Intermediate stage for selecting specific month
 */
const MonthSelector: React.FC<MonthSelectorProps> = ({
  selectedAspect,
  onBack,
  onSelect
}) => {
  /**
   * Get aspect configuration for display
   */
  const aspectConfig = selectedAspect ? getAspectConfig(selectedAspect) : null;

  /**
   * Get current month to highlight it
   */
  const currentMonth = new Date().getMonth() + 1; // 1-12

  /**
   * Handle month selection
   */
  const handleMonthClick = (month: number): void => {
    onSelect(month);
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
  const handleKeyDown = (event: React.KeyboardEvent, month: number): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMonthClick(month);
    }
  };

  /**
   * Month configurations with names and emojis
   */
  const months = [
    { num: 1, name: "January", emoji: "❄️" },
    { num: 2, name: "February", emoji: "⛄" },
    { num: 3, name: "March", emoji: "🌱" },
    { num: 4, name: "April", emoji: "🍀" },
    { num: 5, name: "May", emoji: "🌿" },
    { num: 6, name: "June", emoji: "☀️" },
    { num: 7, name: "July", emoji: "🌤️" },
    { num: 8, name: "August", emoji: "🌞" },
    { num: 9, name: "September", emoji: "🍂" },
    { num: 10, name: "October", emoji: "🍁" },
    { num: 11, name: "November", emoji: "🌾" },
    { num: 12, name: "December", emoji: "🎄" }
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900"
      role="main"
      aria-label="Month Selection"
    >
      <div className="max-w-6xl mx-auto">
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
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight px-4">
            Which month would you like to examine for your <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">{aspectConfig?.label || "aspect"}</span>?
          </h2>
          <p className="text-gray-600 dark:text-cyan-200 text-lg md:text-xl font-light">
            Select a month to view your analysis
          </p>
        </motion.div>

        {/* Month Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-5xl mx-auto"
        >
          {months.map((month) => {
            const isCurrent = month.num === currentMonth;
            
            return (
              <motion.div
                key={month.num}
                variants={monthVariants}
              >
                <button
                  onClick={() => handleMonthClick(month.num)}
                  onKeyDown={(e) => handleKeyDown(e, month.num)}
                  className={`group w-full p-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-slate-900 ${
                    isCurrent
                      ? "bg-gradient-to-br from-cyan-500/40 via-blue-500/40 to-purple-500/40 border-2 border-cyan-400 shadow-lg shadow-cyan-400/30"
                      : "bg-gradient-to-br from-white/10 to-white/5 border border-white/20 hover:border-cyan-400/50"
                  } hover:scale-105 hover:shadow-xl backdrop-blur-sm`}
                  aria-label={`Select ${month.name}${isCurrent ? " (current month)" : ""}`}
                  tabIndex={0}
                >
                  {/* Current month indicator */}
                  {isCurrent && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-xs font-bold text-slate-900">●</span>
                    </div>
                  )}
                  
                  {/* Month emoji */}
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
                    {month.emoji}
                  </div>
                  
                  {/* Month name */}
                  <div className={`text-sm font-bold mb-1 ${
                    isCurrent ? "text-cyan-200" : "text-gray-900 dark:text-white"
                  } group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors duration-300`}>
                    {month.name}
                  </div>
                  
                  {/* Month number */}
                  <div className={`text-xs ${
                    isCurrent ? "text-cyan-300/80" : "text-gray-600 dark:text-white/60"
                  } group-hover:text-cyan-700 dark:group-hover:text-cyan-200 transition-colors duration-300`}>
                    Month {month.num}
                  </div>
                </button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Helper Text */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 dark:text-cyan-200/60 text-sm italic">
            Current month is highlighted • Each month carries unique energetic patterns
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MonthSelector;



