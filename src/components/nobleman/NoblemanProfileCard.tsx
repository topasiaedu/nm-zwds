/**
 * Nobleman Profile Card Component
 * 
 * Displays nobleman profile with image (left) and details (right).
 * For multiple matches, shows selector badges to switch between profiles.
 */

import React, { useState } from "react";
import { Tilt } from "react-tilt";
import { motion, AnimatePresence } from "framer-motion";
import type { NoblemanData, NoblemanProfile } from "../../types/nobleman";
import type { NoblemanType } from "../../types/nobleman";
import { NOBLEMAN_TYPE_TO_IMAGE } from "../../constants/noblemanProfiles";

interface NoblemanProfileCardProps extends NoblemanData {
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
}

/**
 * Tilt options for the image effect
 */
const tiltOptions = {
  scale: 1.05,
  speed: 1000,
  max: 10,
  glare: true,
  "max-glare": 0.5,
};

/**
 * Helper function to extract nobleman type key from profile type string
 * Maps display names like "Authority / High-Status Nobleman" to type keys
 */
const getNoblemanTypeKey = (profileType: string): NoblemanType => {
  const typeMap: Record<string, NoblemanType> = {
    "Older Female": "older_female",
    "Male": "male",
    "Stable & Resource": "stable_resource",
    "Stable &amp; Resource": "stable_resource", // Handle HTML entity
    "Younger / Junior": "younger_junior",
    "Younger": "younger_junior",
    "Same-Generation": "same_generation",
    "Authority / High-Status": "authority_high_status",
    "Authority": "authority_high_status",
    "Practical Leader": "practical_leader",
    "Bold & Aggressive": "bold_aggressive",
    "Bold &amp; Aggressive": "bold_aggressive", // Handle HTML entity
    "Charismatic & Expressive": "charismatic_expressive",
    "Charismatic &amp; Expressive": "charismatic_expressive", // Handle HTML entity
    "Refined & Educated": "refined_educated",
    "Refined &amp; Educated": "refined_educated", // Handle HTML entity
  };
  
  // Find matching type key
  for (const [key, value] of Object.entries(typeMap)) {
    if (profileType.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  return "authority_high_status";
};

/**
 * Get image path for a nobleman profile
 */
const getProfileImage = (profile: NoblemanProfile): string => {
  const typeKey = getNoblemanTypeKey(profile.type);
  const filename = NOBLEMAN_TYPE_TO_IMAGE[typeKey];
  return `/assets/nobleman/${filename}`;
};

/**
 * NoblemanProfileCard Component
 * 
 * Two-column layout:
 * - Left: Nobleman image with tilt effect
 * - Right: Selector badges (if multiple) + profile details
 */
const NoblemanProfileCard: React.FC<NoblemanProfileCardProps> = ({
  palaceName,
  matchedProfiles,
  theme = "light",
}) => {
  // State to track currently selected profile (default: first one)
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Get current profile
  const currentProfile = matchedProfiles[selectedIndex] || matchedProfiles[0];
  const hasMultipleProfiles = matchedProfiles.length > 1;
  
  // Get image for current profile
  const currentImage = getProfileImage(currentProfile);
  
  return (
    <div className="rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 overflow-hidden mb-8">
      {/* Header Section - More Prominent */}
      <div className="relative px-8 py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 dark:from-purple-600/20 dark:to-indigo-600/20" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-1.5 h-8 bg-gradient-to-b from-purple-500 to-indigo-500 rounded-full" />
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              Your Nobleman Profile
            </h3>
          </div>
        </div>
      </div>
      
      {/* Main Content - Two Column Layout (50/50 split, image on RIGHT) */}
      <div className="flex flex-col md:flex-row min-h-[500px]">
        {/* Left Column - Selector + Content */}
        <div className="md:w-1/2 p-8 flex flex-col justify-center">
          {/* Selector Badges - Only show if multiple profiles */}
          {hasMultipleProfiles && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Your Nobleman Profiles
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {matchedProfiles.map((profile, index) => (
                  <button
                    key={`${profile.type}-${index}`}
                    onClick={() => setSelectedIndex(index)}
                    className={`group relative px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                      selectedIndex === index
                        ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/50 dark:shadow-purple-900/50"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 hover:shadow-md"
                    }`}
                    aria-label={`Select ${profile.type}`}
                  >
                    {profile.type}
                    {selectedIndex === index && (
                      <div className="absolute inset-0 rounded-xl bg-white opacity-20 animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {/* Profile Content with Slide Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="space-y-6"
            >
              {/* Nobleman Type Title */}
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {currentProfile.stars}
                  </span>
                </div>
                <h4 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentProfile.type}
                </h4>
              </div>
              
              {/* Characteristics Card */}
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <h5 className="text-sm font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                    Key Characteristics
                  </h5>
                </div>
                <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
                  {currentProfile.characteristics}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Right Column - Image with Tilt Effect */}
        <div className="md:w-1/2 p-8 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="w-full max-w-md"
            >
              <Tilt options={tiltOptions} className="w-full">
                <img
                  src={currentImage}
                  alt={`${currentProfile.type} Nobleman`}
                  className="rounded-3xl w-full object-contain"
                  style={{ maxHeight: "450px" }}
                />
              </Tilt>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default NoblemanProfileCard;
