/**
 * Zodiac Insights Section Component
 * 
 * Displays detailed zodiac personality insights for the main nobleman
 * (current Dayun cycle). Helps users understand and connect with their nobleman.
 * 
 * Layout (Option 5 - Main nobleman focus):
 * 1. Hero Card - Large zodiac identity with SVG icon
 * 2. 4-Card Grid - Practical guidance (recognize, motivate, approach, watch out)
 * 3. Personality Deep Dive - Collapsible detailed analysis
 */

import React from "react";
import type { ZodiacInsights } from "../../constants/zodiacProfiles";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacInsightsSectionProps {
  /** Complete zodiac insights data */
  zodiacInsights: ZodiacInsights;
  
  /** Nobleman zodiac name for dynamic icon selection */
  noblemanZodiac: string;
}

/**
 * ZodiacInsightsSection Component
 * 
 * Main component showing detailed personality insights for the nobleman's zodiac.
 * Focuses on the current Dayun cycle nobleman only (Option 5 design).
 */
export const ZodiacInsightsSection: React.FC<ZodiacInsightsSectionProps> = ({
  zodiacInsights,
  noblemanZodiac,
}) => {
  // Get the zodiac icon dynamically
  const zodiacKey = noblemanZodiac.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];
  
  return (
    <section className="mb-8">
      {/* Section Header */}
      <div className="text-center mb-8 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">
          Zodiac Insights
        </h2>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-400">
          Understanding Your {noblemanZodiac} Nobleman
        </p>
      </div>

      {/* Hero Card - Large Zodiac Identity */}
      <div className="rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 overflow-hidden mb-6">
        <div className="p-8 text-center">
          {/* Zodiac Icon */}
          {ZodiacIcon && (
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-white/20 backdrop-blur-sm rounded-3xl p-6 flex items-center justify-center shadow-lg">
                <ZodiacIconWrapper Icon={ZodiacIcon} className="w-full h-full text-white brightness-0 invert" />
              </div>
            </div>
          )}
          
          {/* Title */}
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-2">
            The {zodiacInsights.zodiac}
          </h3>
          <div className="text-2xl text-white/80 mb-4">
            {zodiacInsights.zodiacChinese}
          </div>
          
          {/* Core Traits */}
          <div className="flex flex-wrap justify-center gap-3 mb-4">
            {zodiacInsights.coreTraits.map((trait) => (
              <span
                key={trait}
                className="px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white font-medium text-sm"
              >
                {trait}
              </span>
            ))}
          </div>
          
          {/* Element Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm text-white font-semibold">
            {zodiacInsights.element} Element
          </div>
        </div>
      </div>

      {/* 4-Card Grid - Practical Guidance */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: How to Recognize */}
        <GuidanceCard
          title="How to Recognize"
          icon="👁️"
          gradient="blue"
          items={zodiacInsights.recognitionSigns}
        />
        
        {/* Card 2: What Motivates */}
        <GuidanceCard
          title="What Motivates"
          icon="🎯"
          gradient="green"
          items={zodiacInsights.motivations}
        />
        
        {/* Card 3: Best Approach */}
        <GuidanceCard
          title="Best Approach"
          icon="🤝"
          gradient="purple"
          items={zodiacInsights.approachStrategies}
        />
        
        {/* Card 4: Watch Out For */}
        <GuidanceCard
          title="Watch Out For"
          icon="⚠️"
          gradient="amber"
          items={zodiacInsights.watchOuts}
        />
      </div>
    </section>
  );
};

/**
 * GuidanceCard Component
 * 
 * Individual card in the 4-card grid showing specific guidance
 * (how to recognize, motivations, approach strategies, or watch outs)
 */
const GuidanceCard: React.FC<{
  title: string;
  icon: string;
  gradient: string;
  items: string[];
}> = ({ title, icon, gradient, items }) => {
  // Convert gradient identifier to actual CSS gradient
  const getGradientStyle = (gradientKey: string): string => {
    const gradientMap: Record<string, string> = {
      "blue": "linear-gradient(to bottom right, #2563eb, #0891b2)", // blue-600 to cyan-600
      "green": "linear-gradient(to bottom right, #16a34a, #059669)", // green-600 to emerald-600
      "purple": "linear-gradient(to bottom right, #9333ea, #db2777)", // purple-600 to pink-600
      "amber": "linear-gradient(to bottom right, #d97706, #ea580c)", // amber-600 to orange-600
    };
    
    return gradientMap[gradientKey] || "linear-gradient(to bottom right, #6b7280, #4b5563)";
  };
  
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-all hover:shadow-lg">
      {/* Header with gradient */}
      <div 
        className="p-4"
        style={{ backgroundImage: getGradientStyle(gradient) }}
      >
        <div className="text-2xl mb-2">{icon}</div>
        <h4 className="text-white font-bold text-sm drop-shadow-md">{title}</h4>
      </div>
      
      {/* Content */}
      <div className="p-4">
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2"
            >
              <span className="text-indigo-500 mt-1 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ZodiacInsightsSection;

