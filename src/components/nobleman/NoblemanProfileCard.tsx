/**
 * Nobleman Profile Card Component
 * 
 * Displays nobleman profile with image (left) and details (right).
 * For multiple matches, shows selector badges to switch between profiles.
 */

import React, { useState } from "react";
import { Tilt } from "react-tilt";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Star } from "lucide-react";
import type { NoblemanData, NoblemanProfile } from "../../types/nobleman";
import type { NoblemanType } from "../../types/nobleman";
import { BrandGradientText } from "../BrandGradientText";
import { NOBLEMAN_TYPE_TO_IMAGE } from "../../constants/noblemanProfiles";

interface NoblemanProfileCardProps extends NoblemanData {
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
  /** Enables PDF-safe stacked layout and disables animations. */
  forPdfCapture?: boolean;
}

/**
 * Tilt options for the image effect
 */
const tiltOptions = {
  scale: 1.02,
  speed: 1000,
  max: 8,
  glare: false,
  "max-glare": 0,
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
  forPdfCapture,
}) => {
  // State to track currently selected profile (default: first one)
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // Get current profile
  const currentProfile = matchedProfiles[selectedIndex] || matchedProfiles[0];
  const hasMultipleProfiles = matchedProfiles.length > 1;
  
  // Get image for current profile
  const currentImage = getProfileImage(currentProfile);
  
  return (
    <section
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
      className="mb-8 overflow-hidden rounded-3xl border border-indigo-200/50 bg-white shadow-xl dark:border-indigo-900/50 dark:bg-gray-800"
    >
      <div className="border-b border-indigo-100 bg-gradient-to-r from-indigo-500/10 via-violet-500/5 to-transparent px-6 py-5 dark:border-indigo-900/50">
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
          Primary match
        </p>
        <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
          Your Nobleman Profile
        </h3>
        {palaceName ? (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{palaceName}</p>
        ) : null}
      </div>

      <div
        className={
          forPdfCapture
            ? "flex flex-col"
            : "flex flex-col lg:flex-row lg:min-h-[480px]"
        }
      >
        {/* Image block first for PDF layout */}
        {forPdfCapture ? (
          <div className="p-8 pt-6">
            <div className="w-full flex justify-center">
              <img
                src={currentImage}
                alt={`${currentProfile.type} Nobleman`}
                className="rounded-3xl object-cover"
                style={{
                  height: "360px",
                  width: "auto",
                  maxWidth: "100%",
                  aspectRatio: "3 / 4",
                }}
              />
            </div>
          </div>
        ) : null}

        {/* Left Column - Selector + Content */}
        <div
          className={
            forPdfCapture
              ? "flex flex-col justify-center p-6 pt-2"
              : "flex flex-1 flex-col justify-center p-6 lg:p-8"
          }
        >
          {hasMultipleProfiles ? (
            <div className="mb-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Switch profile match
              </p>
              <div className="flex flex-wrap gap-2">
                {matchedProfiles.map((profile, index) => (
                  <button
                    key={`${profile.type}-${index}`}
                    type="button"
                    onClick={() => setSelectedIndex(index)}
                    className={`rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                      selectedIndex === index
                        ? "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md"
                        : "border border-gray-200 bg-gray-50 text-gray-700 hover:border-indigo-300 dark:border-gray-600 dark:bg-gray-700/50 dark:text-gray-200"
                    }`}
                    aria-label={`Select ${profile.type}`}
                    aria-pressed={selectedIndex === index}
                  >
                    {profile.type}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          
          {/* Profile Content with Slide Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedIndex}
              initial={forPdfCapture ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={forPdfCapture ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={forPdfCapture ? { duration: 0 } : { duration: 0.4, ease: "easeInOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200">
                <Star className="h-3.5 w-3.5 fill-current" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {currentProfile.stars}
                </span>
              </div>
              <BrandGradientText
                as="h4"
                className="mt-4 text-2xl font-black sm:text-3xl"
              >
                {currentProfile.type}
              </BrandGradientText>

              <div className="mt-6 border-l-4 border-violet-500 pl-5 dark:border-violet-400">
                <div className="mb-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-violet-600 dark:text-violet-400" aria-hidden="true" />
                  <h5 className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
                    Key characteristics
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
        {!forPdfCapture ? (
          <div className="flex items-center justify-center p-6 lg:w-[42%] lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="relative w-full max-w-sm"
              >
                <Tilt options={tiltOptions} className="relative w-full">
                  <img
                    src={currentImage}
                    alt={`${currentProfile.type} Nobleman`}
                    className="w-full rounded-[1.75rem] object-contain"
                    style={{ maxHeight: "450px" }}
                  />
                </Tilt>
              </motion.div>
            </AnimatePresence>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default NoblemanProfileCard;
