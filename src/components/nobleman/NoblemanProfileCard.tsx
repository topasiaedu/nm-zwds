/**
 * Nobleman Profile Card Component
 * 
 * Main nobleman profile card that displays detailed information about
 * the nobleman for the current Dayun palace.
 * 
 * Features:
 * - Two-column layout (left: info, right: tilting image card)
 * - Clickable nobleman profile selection
 * - Animated card switching
 * - React Tilt effect on image card
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tilt } from "react-tilt";
import type { NoblemanData, NoblemanProfile } from "../../types/nobleman";
import { getNoblemanImage } from "../../utils/nobleman/image-mapping";

interface NoblemanProfileCardProps extends NoblemanData {
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
}


/**
 * Profile List Item Component
 * Individual clickable profile item
 */
interface ProfileListItemProps {
  profile: NoblemanProfile;
  isSelected: boolean;
  onClick: () => void;
}

const ProfileListItem: React.FC<ProfileListItemProps> = ({ profile, isSelected, onClick }) => (
  <button
    onClick={onClick}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    }}
    tabIndex={0}
    aria-label={`Select ${profile.type}`}
    aria-pressed={isSelected}
    className={`w-full text-left p-3 rounded-lg border-2 transition-all duration-200 ${
      isSelected
        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/30 shadow-md"
        : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-sm"
    }`}
  >
    <div className="flex items-center justify-between gap-2">
      <div className="font-bold text-sm text-gray-900 dark:text-white">
        {profile.type}
      </div>
      <div className="px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        {profile.stars}
      </div>
    </div>
  </button>
);

/**
 * Selected Profile Details Component
 * Shows characteristics of selected profile with zodiac info
 */
interface SelectedProfileDetailsProps {
  profile: NoblemanProfile;
  zodiac: string;
  yearExamples: number[];
}

const SelectedProfileDetails: React.FC<SelectedProfileDetailsProps> = ({ profile, zodiac, yearExamples }) => (
  <AnimatePresence mode="wait">
    <motion.div
      key={profile.type}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="p-4 rounded-xl bg-gradient-to-br from-purple-50/50 to-indigo-50/50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-100 dark:border-purple-900/30"
    >
      <div className="text-xs font-bold uppercase tracking-wider mb-2 text-purple-700 dark:text-purple-300">
        Characteristics
      </div>
      <div className="text-lg font-bold mb-2 text-gray-900 dark:text-white">
        {profile.type}
      </div>
      <div className="inline-flex items-center gap-2 px-2 py-1 rounded-full mb-3 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
        <span className="text-xs font-semibold">{profile.stars}</span>
      </div>
      <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 mb-3">
        {profile.characteristics}
      </p>
      
      {/* Compact Zodiac Info */}
      <div className="pt-3 mt-3 border-t border-purple-100 dark:border-purple-900/30">
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-1.5">
          <span className="font-semibold">Look for {zodiac} people</span> born in: {yearExamples.join(", ")}
        </p>
      </div>
    </motion.div>
  </AnimatePresence>
);

/**
 * Nobleman Image Card Component
 * Displays tilting card with nobleman image
 */
interface NoblemanImageCardProps {
  profile: NoblemanProfile;
  isMobile: boolean;
}

const NoblemanImageCard: React.FC<NoblemanImageCardProps> = ({ profile, isMobile }) => {
  const imageSrc = getNoblemanImage(profile.type);
  
  // Tilt options matching Career.tsx style
  const tiltOptions = {
    scale: 1.05,
    speed: 1000,
    max: isMobile ? 5 : 10,
    glare: !isMobile,
    "max-glare": 0.5,
  };
  
  if (!imageSrc) {
    return (
      <div className="w-full max-w-sm md:max-w-md rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 flex items-center justify-center shadow-lg border border-gray-200 dark:border-gray-700" style={{ aspectRatio: "3/4" }}>
        <div className="text-center p-6 md:p-8">
          <svg className="w-24 h-24 mx-auto mb-4 text-purple-300 dark:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" 
            />
          </svg>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Nobleman Profile
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={profile.type}
        initial={{ x: isMobile ? 0 : 300, opacity: 0, scale: isMobile ? 0.8 : 1 }}
        animate={{ x: 0, opacity: 1, scale: 1 }}
        exit={{ x: isMobile ? 0 : -300, opacity: 0, scale: isMobile ? 0.8 : 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-sm md:max-w-md"
      >
        <Tilt options={tiltOptions} className="w-full">
          <div
            className="relative w-full rounded-2xl shadow-2xl overflow-hidden border-4 border-white dark:border-gray-700"
            style={{ aspectRatio: "3/4" }}
          >
            <img
              src={imageSrc}
              alt={`${profile.type} nobleman profile`}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </Tilt>
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * NoblemanProfileCard Component
 * 
 * Large, prominent card showing:
 * - Left Column: Zodiac info, profile list, selected profile details
 * - Right Column: Tilting card with nobleman image
 */
const NoblemanProfileCard: React.FC<NoblemanProfileCardProps> = ({
  palaceName,
  zodiac,
  yearExamples,
  matchedProfiles,
  theme = "light",
}) => {
  // Track selected profile index
  const [selectedProfileIndex, setSelectedProfileIndex] = useState(0);
  const selectedProfile = matchedProfiles[selectedProfileIndex] || matchedProfiles[0];
  
  // Detect mobile for reduced tilt effect
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      
      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 p-4 md:p-6">
        {/* LEFT COLUMN - 40% width (2 cols) */}
        <div className="col-span-1 md:col-span-2 space-y-4 md:space-y-6">
          {/* Nobleman Profile List */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider mb-3 text-gray-600 dark:text-gray-400">
              Nobleman Types ({matchedProfiles.length})
            </div>
            {matchedProfiles.length > 0 ? (
              <div className="space-y-2">
                {matchedProfiles.map((profile, idx) => (
                  <ProfileListItem
                    key={`${profile.type}-${idx}`}
                    profile={profile}
                    isSelected={selectedProfileIndex === idx}
                    onClick={() => setSelectedProfileIndex(idx)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                No specific nobleman stars found
              </div>
            )}
          </div>

          {/* Selected Profile Details with Zodiac */}
          {selectedProfile && (
            <SelectedProfileDetails 
              profile={selectedProfile} 
              zodiac={zodiac}
              yearExamples={yearExamples}
            />
          )}
        </div>

        {/* RIGHT COLUMN - 60% width (3 cols) */}
        <div className="col-span-1 md:col-span-3 flex items-center justify-center order-first md:order-last">
          {selectedProfile && <NoblemanImageCard profile={selectedProfile} isMobile={isMobile} />}
        </div>
      </div>
    </div>
  );
};

export default NoblemanProfileCard;
