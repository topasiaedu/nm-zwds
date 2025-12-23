/**
 * InsightsPanel Component
 * Displays AI-generated insights with key points and action items
 */

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { LifeAspect, TimeFrame } from "../../../types/destiny-navigator";
import { Profile } from "../../../context/ProfileContext";
import { generateMockInsights } from "../../../utils/destiny-navigator/insights-generator";
import { ZWDSCalculator } from "../../../utils/zwds/calculator";
import { ChartInput } from "../../../utils/zwds/types";
import {
  getPalaceForAspectNatal,
  getPalaceForAspectDayun,
  getPalaceForAspectLiuNian,
  getPalaceForAspectLiuMonth
} from "../../../utils/destiny-navigator/palace-resolver";

/**
 * Component props
 */
interface InsightsPanelProps {
  profile: Profile;
  aspect: LifeAspect;
  timeframe: TimeFrame;
}

/**
 * Get aspect display name
 */
const getAspectDisplayName = (aspect: LifeAspect): string => {
  const names: Record<LifeAspect, string> = {
    life: "Life & Identity",
    siblings: "Siblings & Peers",
    relationships: "Love & Marriage",
    children: "Children & Creativity",
    wealth: "Wealth & Resources",
    health: "Health & Wellbeing",
    travel: "Travel & Change",
    social: "Friends & Networks",
    career: "Career & Status",
    home: "Property & Assets",
    fortune: "Happiness & Spirit",
    parents: "Parents & Mentors"
  };
  return names[aspect];
};

/**
 * Generate context-aware transformation data
 */
interface TransformationData {
  type: string;
  star: string;
  chineseName: string;
  targetPalace: string;
  icon: string;
  gradient: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textColor: string;
  insights: string[]; // Array of 4 concise, single-sentence insights
}

const generateTransformations = (aspect: LifeAspect, timeframe: TimeFrame): TransformationData[] => {
  const aspectName = getAspectDisplayName(aspect);
  
  // Mock transformations - in production, extract from chartData
  return [
    {
      type: "禄",
      star: "Wu Qu",
      chineseName: "Hua Lu",
      targetPalace: "Wealth",
      icon: "💰",
      gradient: "from-green-500 to-emerald-500",
      bgLight: "from-green-50 to-emerald-50",
      bgDark: "from-green-900/20 to-emerald-900/20",
      borderLight: "border-green-200",
      borderDark: "dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      insights: [
        `Financial rewards flow naturally from ${aspectName.toLowerCase()} activities.`,
        "Resources and opportunities arrive with less effort and resistance.",
        "Investments in this area yield tangible, amplified returns.",
        "Cosmic support creates favorable circumstances for wealth accumulation."
      ]
    },
    {
      type: "权",
      star: "Tian Ji",
      chineseName: "Hua Quan",
      targetPalace: "Career",
      icon: "👑",
      gradient: "from-purple-500 to-violet-500",
      bgLight: "from-purple-50 to-violet-50",
      bgDark: "from-purple-900/20 to-violet-900/20",
      borderLight: "border-purple-200",
      borderDark: "dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      insights: [
        `${aspectName} actions command professional authority and influence.`,
        "Others naturally seek your leadership and trust your judgment.",
        "Decisive action in career matters yields exceptional results.",
        "Capacity to direct outcomes and shape direction is enhanced."
      ]
    },
    {
      type: "科",
      star: "Zi Wei",
      chineseName: "Hua Ke",
      targetPalace: "Life",
      icon: "⭐",
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "from-blue-50 to-cyan-50",
      bgDark: "from-blue-900/20 to-cyan-900/20",
      borderLight: "border-blue-200",
      borderDark: "dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      insights: [
        `Personal brand receives significant boost through ${aspectName.toLowerCase()}.`,
        "Achievements gain visibility and attract positive attention.",
        "New doors open as your expertise becomes recognized.",
        "Excellence and contributions are acknowledged and rewarded."
      ]
    },
    {
      type: "忌",
      star: "Tai Yang",
      chineseName: "Hua Ji",
      targetPalace: "Health",
      icon: "⚠️",
      gradient: "from-red-500 to-orange-500",
      bgLight: "from-red-50 to-orange-50",
      bgDark: "from-red-900/20 to-orange-900/20",
      borderLight: "border-red-200",
      borderDark: "dark:border-red-800",
      textColor: "text-red-600 dark:text-red-400",
      insights: [
        `${aspectName} health matters require extra care and attention.`,
        "Early intervention prevents complications and builds resilience.",
        "Challenges serve as teachers for lasting wellness habits.",
        "Patient, thorough approach transforms obstacles into growth."
      ]
    }
  ];
};

/**
 * InsightsPanel - Scrollable insights display with mock AI content
 */
const InsightsPanel: React.FC<InsightsPanelProps> = ({ profile, aspect, timeframe }) => {
  /**
   * Generate transformations based on aspect
   */
  const transformations = useMemo(() => generateTransformations(aspect, timeframe), [aspect, timeframe]);
  
  const aspectName = useMemo(() => getAspectDisplayName(aspect), [aspect]);

  /**
   * Calculate chart and generate insights
   */
  const insights = useMemo(() => {
    try {
      // Parse birth date
      const birthDate = new Date(profile.birthday);
      
      // Parse birth time (hour)
      const birthTimeStr = String(profile.birth_time);
      let hour = Number.parseInt(birthTimeStr, 10);
      
      // Handle AM/PM if present
      const timeRegex = /(\d+):?(\d+)?\s*(AM|PM)?/i;
      const timeMatch = timeRegex.exec(birthTimeStr);
      if (timeMatch) {
        hour = Number.parseInt(timeMatch[1], 10);
        const isPM = timeMatch[3] && timeMatch[3].toUpperCase() === "PM";
        const isAM = timeMatch[3] && timeMatch[3].toUpperCase() === "AM";
        
        if (isPM && hour < 12) {
          hour += 12;
        }
        if (isAM && hour === 12) {
          hour = 0;
        }
      }

      // Create chart input
      const chartInput: ChartInput = {
        year: birthDate.getFullYear(),
        month: birthDate.getMonth() + 1,
        day: birthDate.getDate(),
        hour: hour,
        gender: profile.gender as "male" | "female",
        name: profile.name
      };

      // Calculate chart
      const calculator = new ZWDSCalculator(chartInput);
      const chartData = calculator.calculate();

      // Get palace number based on timeframe
      let palaceNumber: number | null = null;
      switch (timeframe) {
        case "natal":
          palaceNumber = getPalaceForAspectNatal(aspect, chartData);
          break;
        case "dayun":
          palaceNumber = getPalaceForAspectDayun(aspect, chartData);
          break;
        case "liunian":
          palaceNumber = getPalaceForAspectLiuNian(aspect, chartData);
          break;
        case "liumonth":
          palaceNumber = getPalaceForAspectLiuMonth(aspect, chartData);
          break;
      }

      // Generate insights
      return generateMockInsights(aspect, timeframe, palaceNumber, chartData);
    } catch (err) {
      console.error("Error generating insights:", err);
      // Return default insights on error
      return generateMockInsights(aspect, timeframe, null, {} as any);
    }
  }, [profile, aspect, timeframe]);

  return (
    <div className="space-y-6">
      {/* Title & Summary */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-all duration-300 p-6">
        <h2 className="text-2xl sm:text-3xl font-bold dark:text-white mb-3">
          {insights.title}
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
          {insights.summary}
        </p>
      </div>

      {/* Stars in Palace Section */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-all duration-300 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-yellow-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-lg">✨</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Stars in {aspectName} Palace</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Core stars residing in this palace</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Mock star data - replace with actual data from chart */}
          {[
            {
              name: "Zi Wei",
              icon: "👑",
              gradient: "from-purple-500 to-indigo-500",
              bgLight: "from-purple-50 to-indigo-50",
              bgDark: "from-purple-900/20 to-indigo-900/20",
              borderLight: "border-purple-200",
              borderDark: "dark:border-purple-800",
              description: `In ${aspectName}, this star brings natural authority and the ability to command respect in this area of life.`
            },
            {
              name: "Tian Ji",
              icon: "🧠",
              gradient: "from-blue-500 to-cyan-500",
              bgLight: "from-blue-50 to-cyan-50",
              bgDark: "from-blue-900/20 to-cyan-900/20",
              borderLight: "border-blue-200",
              borderDark: "dark:border-blue-800",
              description: `In ${aspectName}, strategic thinking and quick adaptability become your greatest strengths.`
            },
            {
              name: "Zuo Fu",
              icon: "🤝",
              gradient: "from-green-500 to-emerald-500",
              bgLight: "from-green-50 to-emerald-50",
              bgDark: "from-green-900/20 to-emerald-900/20",
              borderLight: "border-green-200",
              borderDark: "dark:border-green-800",
              description: `In ${aspectName}, helpful people and strong support networks naturally gravitate toward you.`
            },
            {
              name: "Wen Chang",
              icon: "📚",
              gradient: "from-teal-500 to-cyan-500",
              bgLight: "from-teal-50 to-cyan-50",
              bgDark: "from-teal-900/20 to-cyan-900/20",
              borderLight: "border-teal-200",
              borderDark: "dark:border-teal-800",
              description: `In ${aspectName}, communication skills and intellectual pursuits flourish with ease.`
            },
            {
              name: "Lu Cun",
              icon: "💎",
              gradient: "from-amber-500 to-yellow-500",
              bgLight: "from-amber-50 to-yellow-50",
              bgDark: "from-amber-900/20 to-yellow-900/20",
              borderLight: "border-amber-200",
              borderDark: "dark:border-amber-800",
              description: `In ${aspectName}, resources accumulate steadily and financial stability is enhanced.`
            }
          ].map((star, index) => (
            <motion.div
              key={star.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`bg-gradient-to-br ${star.bgLight} dark:${star.bgDark} border ${star.borderLight} ${star.borderDark} rounded-xl p-4 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 bg-gradient-to-br ${star.gradient} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                  <span className="text-xl">{star.icon}</span>
                </div>
                <div className="flex-1">
                  <h4 className="text-base font-bold text-gray-900 dark:text-white mb-2">
                    {star.name}
                  </h4>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                    {star.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Flying Stars Analysis */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-all duration-300 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-lg">⚡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Flying Stars from {aspectName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Four flying stars emanating from this palace</p>
          </div>
        </div>

        <div className="space-y-4">
          {transformations.map((transformation, index) => (
            <motion.div
              key={transformation.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className="bg-white/60 dark:bg-black/30 border border-white/20 dark:border-white/10 rounded-xl p-5 hover:shadow-lg transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${transformation.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-2xl">{transformation.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {transformation.star} {transformation.chineseName}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-gray-500 dark:text-gray-400">→</span>
                      <span className={`text-sm font-semibold px-2.5 py-0.5 bg-white/80 dark:bg-black/40 ${transformation.textColor} rounded-full border ${transformation.textColor.replace('text-', 'border-')}`}>
                        {transformation.targetPalace}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {transformation.insights.map((insight, idx) => (
                      <div 
                        key={idx} 
                        className="p-4 bg-white/80 dark:bg-black/40 rounded-lg border-l-4 border-white/40 dark:border-white/30 hover:shadow-md transition-all duration-200 cursor-default"
                      >
                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          {insight}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-all duration-300 p-6">
        <div className="flex flex-wrap gap-3">
          <button
            className="px-4 py-2 text-white font-medium rounded-lg transition-all 
                      bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700
                      focus:ring-4 focus:ring-red-300 focus:outline-none
                      flex items-center justify-center"
            onClick={() => {
              // PDF export functionality to be implemented
              console.log("Export PDF clicked");
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span>Export PDF</span>
          </button>

          <button
            className="px-4 py-2 text-white font-medium rounded-lg transition-all 
                      bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700
                      focus:ring-4 focus:ring-purple-300 focus:outline-none
                      flex items-center justify-center"
            onClick={() => {
              // Share functionality to be implemented
              console.log("Share clicked");
            }}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>Share</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
