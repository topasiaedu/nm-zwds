/**
 * Zodiac Modal Component
 * 
 * Full-screen modal displaying complete zodiac personality details.
 * Opened when user clicks on a mini card to learn more.
 */

import React, { useEffect } from "react";
import { getFullZodiacInsights } from "../../utils/nobleman";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacModalProps {
  /** Zodiac name to display */
  zodiacName: string;
  
  /** Whether modal is open */
  isOpen: boolean;
  
  /** Close handler */
  onClose: () => void;
}

/**
 * ZodiacModal Component
 * 
 * Full-screen overlay modal showing complete personality breakdown
 * for a selected zodiac. Similar to ZodiacInsightsSection but in modal form.
 */
export const ZodiacModal: React.FC<ZodiacModalProps> = ({
  zodiacName,
  isOpen,
  onClose,
}) => {
  const zodiacInsights = getFullZodiacInsights(zodiacName);
  
  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent): void => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
    
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !zodiacInsights) {
    return null;
  }
  
  // Get the zodiac icon dynamically
  const zodiacKey = zodiacName.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];
  
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="zodiac-modal-title"
    >
      {/* Modal Content */}
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header with Gradient */}
          <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-8 text-center">
            {/* Zodiac Icon */}
            {ZodiacIcon && (
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-white/20 backdrop-blur-sm rounded-3xl p-4 md:p-6 flex items-center justify-center shadow-lg">
                  <ZodiacIconWrapper Icon={ZodiacIcon} className="w-full h-full text-white brightness-0 invert" />
                </div>
              </div>
            )}
            
            {/* Title */}
            <h2 id="zodiac-modal-title" className="text-3xl md:text-4xl font-bold text-white mb-2">
              The {zodiacInsights.zodiac}
            </h2>
            <div className="text-xl text-white/80 mb-3">
              {zodiacInsights.zodiacChinese}
            </div>
            
            {/* Core Traits */}
            <div className="flex flex-wrap justify-center gap-2 mb-3">
              {zodiacInsights.coreTraits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm"
                >
                  {trait}
                </span>
              ))}
            </div>
            
            {/* Element Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/30 backdrop-blur-sm text-white font-semibold text-sm">
              {zodiacInsights.element} Element
            </div>
          </div>
          
          {/* Body Content */}
          <div className="p-6">
            {/* 4-Card Grid - Compact version */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <ModalGuidanceCard
                title="How to Recognize"
                icon="👁️"
                items={zodiacInsights.recognitionSigns}
                color="blue"
              />
              <ModalGuidanceCard
                title="What Motivates"
                icon="🎯"
                items={zodiacInsights.motivations}
                color="green"
              />
              <ModalGuidanceCard
                title="Best Approach"
                icon="🤝"
                items={zodiacInsights.approachStrategies}
                color="purple"
              />
              <ModalGuidanceCard
                title="Watch Out For"
                icon="⚠️"
                items={zodiacInsights.watchOuts}
                color="amber"
              />
            </div>
            
            {/* Personality Details - Always expanded in modal */}
            <div className="space-y-6">
              {/* Strengths */}
              <ModalPersonalitySection
                title="Strengths"
                icon="💪"
                items={zodiacInsights.personality.strengths}
                color="green"
              />
              
              {/* Weaknesses */}
              <ModalPersonalitySection
                title="Shadow Traits"
                icon="🌑"
                items={zodiacInsights.personality.weaknesses}
                color="amber"
              />
              
              {/* Communication Style */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">💬</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Communication Style
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {zodiacInsights.personality.communicationStyle}
                </p>
              </div>
              
              {/* Trust Building */}
              <ModalPersonalitySection
                title="Building Trust"
                icon="🔐"
                items={zodiacInsights.personality.trustBuilding}
                color="purple"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * ModalGuidanceCard - Compact guidance card for modal
 */
const ModalGuidanceCard: React.FC<{
  title: string;
  icon: string;
  items: string[];
  color: "blue" | "green" | "purple" | "amber";
}> = ({ title, icon, items, color }) => {
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300",
    green: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300",
    purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
    amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  };
  
  return (
    <div className={`rounded-xl p-4 ${colorMap[color]}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="font-bold text-sm">{title}</h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="text-sm flex items-start gap-2 opacity-90"
          >
            <span className="mt-1 flex-shrink-0">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * ModalPersonalitySection - Personality detail section for modal
 */
const ModalPersonalitySection: React.FC<{
  title: string;
  icon: string;
  items: string[];
  color: "green" | "amber" | "purple";
}> = ({ title, icon, items, color }) => {
  const colorMap: Record<string, string> = {
    green: "text-green-500",
    amber: "text-amber-500",
    purple: "text-purple-500",
  };
  
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
      </div>
      <ul className="space-y-2">
        {items.map((item, idx) => (
          <li
            key={idx}
            className="text-gray-700 dark:text-gray-300 flex items-start gap-2"
          >
            <span className={`${colorMap[color]} mt-1 flex-shrink-0`}>▸</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ZodiacModal;

