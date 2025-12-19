/**
 * AspectSelector Stage
 * User selects which life aspect to explore
 * Displays 6 tiltable cards with stagger animation
 */

import React from "react";
import { motion } from "framer-motion";
import { Tilt } from "react-tilt";
import { LifeAspect } from "../../../types/destiny-navigator";
import { ASPECT_CONFIGS } from "../../../utils/destiny-navigator/aspect-config";

/**
 * Component props
 */
interface AspectSelectorProps {
  onSelect: (aspect: LifeAspect) => void; // Callback when aspect is selected
}

/**
 * Container animation variants with stagger
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2
    }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

/**
 * Individual card animation variants
 */
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

/**
 * AspectSelector - Stage 2 of Destiny Navigator
 * Life aspect selection with tiltable cards
 */
const AspectSelector: React.FC<AspectSelectorProps> = ({ onSelect }) => {
  /**
   * Handle aspect card click
   */
  const handleAspectClick = (aspect: LifeAspect): void => {
    onSelect(aspect);
  };

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = (event: React.KeyboardEvent, aspect: LifeAspect): void => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleAspectClick(aspect);
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
      aria-label="Aspect Selection"
    >
      <div className="max-w-7xl mx-auto">
        {/* NLP Prompt */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Which dimension of your destiny
            <br />
            <span className="text-cyan-600 dark:text-cyan-300 font-extrabold">
              would you like to explore?
            </span>
          </h2>
          <p className="text-gray-600 dark:text-cyan-200 text-lg md:text-xl font-light">
            Select an aspect to begin your journey
          </p>
        </motion.div>

        {/* Aspect Cards Grid */}
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8"
        >
          {ASPECT_CONFIGS.map((aspect) => (
            <motion.div
              key={aspect.key}
              variants={cardVariants}
              className="h-full"
            >
              <Tilt
                options={{
                  scale: 1.02,
                  speed: 1000,
                  max: 8,
                  glare: true,
                  "max-glare": 0.3
                }}
                className="w-full h-full"
              >
                <button
                  onClick={() => handleAspectClick(aspect.key)}
                  onKeyDown={(e) => handleKeyDown(e, aspect.key)}
                  className="w-full h-full min-h-[240px] p-6 bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl border border-gray-200 dark:border-white/20 hover:border-cyan-400/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.3)] group focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-50 dark:focus:ring-offset-slate-900"
                  aria-label={`Select ${aspect.label} aspect - ${aspect.description}`}
                  tabIndex={0}
                >
                  <div className="flex flex-col items-center text-center h-full">
                    {/* Icon */}
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {aspect.icon}
                    </div>

                    {/* Label */}
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors duration-300">
                      {aspect.label}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-grow">
                      {aspect.description}
                    </p>

                    {/* Hover indicator */}
                    <div className="mt-4 text-cyan-600 dark:text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Click to explore →
                    </div>
                  </div>
                </button>
              </Tilt>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AspectSelector;

