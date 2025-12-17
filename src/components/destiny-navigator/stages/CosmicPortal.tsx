/**
 * CosmicPortal Stage
 * Entrance animation that sets the mystical tone
 * Auto-advances to aspect selection after 3 seconds
 */

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import StarfieldBackground from "../animations/StarfieldBackground";
import TypewriterText from "../animations/TypewriterText";
import PulsingOrb from "../animations/PulsingOrb";

/**
 * Component props
 */
interface CosmicPortalProps {
  onComplete: () => void; // Callback when auto-advance timer completes
}

/**
 * CosmicPortal - Stage 1 of Destiny Navigator
 * Dramatic entrance with cosmic theme
 */
const CosmicPortal: React.FC<CosmicPortalProps> = ({ onComplete }) => {
  /**
   * Auto-advance timer (3 seconds)
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);

    return (): void => {
      clearTimeout(timer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 overflow-hidden"
      role="main"
      aria-label="Cosmic Portal - Welcome Screen"
    >
      {/* Animated starfield background */}
      <StarfieldBackground
        speed={1}
        density={150}
        colors={["147, 197, 253", "167, 139, 250", "196, 181, 253"]} // Blue/purple stars
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl">
        {/* Pulsing orb */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.8,
            ease: "easeOut"
          }}
          className="mb-8"
        >
          <PulsingOrb
            size={120}
            color="6, 182, 212"
            pulseSpeed={2000}
            particleCount={24}
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent tracking-wider"
        >
          DESTINY NAVIGATOR
        </motion.h1>

        {/* Subtitle with typewriter effect */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="text-xl md:text-2xl text-cyan-200 font-light italic"
        >
          <TypewriterText
            text="Your journey through destiny clarity begins here..."
            speed={50}
            showCursor={false}
          />
        </motion.div>

        {/* Progress indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.4 }}
          className="mt-12 flex justify-center"
        >
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "200ms" }}></div>
            <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: "400ms" }}></div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CosmicPortal;

