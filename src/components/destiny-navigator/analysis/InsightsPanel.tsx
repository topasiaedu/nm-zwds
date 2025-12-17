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
  insight1: string;
  insight2: string;
}

const generateTransformations = (aspect: LifeAspect, timeframe: TimeFrame): TransformationData[] => {
  const aspectName = getAspectDisplayName(aspect);
  
  // Mock transformations - in production, extract from chartData
  return [
    {
      type: "禄",
      star: "武曲",
      chineseName: "化禄",
      targetPalace: "Wealth",
      icon: "💰",
      gradient: "from-green-500 to-emerald-500",
      bgLight: "from-green-50 to-emerald-50",
      bgDark: "from-green-900/20 to-emerald-900/20",
      borderLight: "border-green-200",
      borderDark: "dark:border-green-800",
      textColor: "text-green-600 dark:text-green-400",
      insight1: `Your efforts in ${aspectName.toLowerCase()} naturally attract financial rewards and resources. This energy flow creates favorable circumstances where investments yield tangible returns with less resistance.`,
      insight2: "This is a favorable period to invest time and energy into wealth-building activities connected to this aspect. Returns are amplified by cosmic support."
    },
    {
      type: "权",
      star: "天机",
      chineseName: "化权",
      targetPalace: "Career",
      icon: "👑",
      gradient: "from-purple-500 to-violet-500",
      bgLight: "from-purple-50 to-violet-50",
      bgDark: "from-purple-900/20 to-violet-900/20",
      borderLight: "border-purple-200",
      borderDark: "dark:border-purple-800",
      textColor: "text-purple-600 dark:text-purple-400",
      insight1: `Your actions in ${aspectName.toLowerCase()} command authority and influence in professional matters. Others naturally look to you for leadership and trust your judgment in career decisions.`,
      insight2: "This is the time to step into roles requiring decisive action. Your capacity to direct outcomes and shape professional direction is significantly enhanced."
    },
    {
      type: "科",
      star: "紫微",
      chineseName: "化科",
      targetPalace: "Life",
      icon: "⭐",
      gradient: "from-blue-500 to-cyan-500",
      bgLight: "from-blue-50 to-cyan-50",
      bgDark: "from-blue-900/20 to-cyan-900/20",
      borderLight: "border-blue-200",
      borderDark: "dark:border-blue-800",
      textColor: "text-blue-600 dark:text-blue-400",
      insight1: `Your personal brand and reputation receive a significant boost through ${aspectName.toLowerCase()}. Achievements gain visibility and attract positive attention, opening doors to new opportunities.`,
      insight2: "Pursue mastery in this domain and document your progress. Recognition for your contributions and expertise is assured during this period."
    },
    {
      type: "忌",
      star: "太阳",
      chineseName: "化忌",
      targetPalace: "Health",
      icon: "⚠️",
      gradient: "from-red-500 to-orange-500",
      bgLight: "from-red-50 to-orange-50",
      bgDark: "from-red-900/20 to-orange-900/20",
      borderLight: "border-red-200",
      borderDark: "dark:border-red-800",
      textColor: "text-red-600 dark:text-red-400",
      insight1: `Health matters connected to ${aspectName.toLowerCase()} need extra care and preventive measures. Don't ignore warning signs - addressing issues early prevents complications.`,
      insight2: "Challenges here serve as teachers, prompting you to build lasting wellness habits. Approach with patience and thoroughness to develop resilience."
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

      {/* Energy Overview */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-all duration-300 p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
            <span className="text-2xl">🎯</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Energy Pattern Overview</h3>
            
            <div className="space-y-3">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Your <strong>{aspectName}</strong> palace generates <strong>four distinct energy flows</strong> that influence different areas of your life. Each transformation carries specific qualities that either amplify opportunities or signal areas requiring attention.
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">💰</span>
                    <span className="text-xs font-semibold text-green-600 dark:text-green-400">Abundance (禄)</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Smooth flow, favorable outcomes</p>
                </div>
                
                <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">👑</span>
                    <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Authority (权)</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Command, decisive influence</p>
                </div>
                
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">⭐</span>
                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Recognition (科)</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Enhanced reputation, visibility</p>
                </div>
                
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">⚠️</span>
                    <span className="text-xs font-semibold text-red-600 dark:text-red-400">Challenge (忌)</span>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Growth catalyst, mindful care</p>
                </div>
              </div>
              
              <div className="pt-3 border-t border-white/10">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  <strong className="text-cyan-600 dark:text-cyan-400">Key insight:</strong> Understanding where each energy lands helps you navigate opportunities and challenges with greater awareness and strategic timing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Transformations Analysis */}
      <div className="rounded-2xl shadow-2xl overflow-hidden border border-white/10 backdrop-filter backdrop-blur-2xl bg-white/10 hover:bg-white/15 dark:bg-black/10 dark:hover:bg-black/20 transition-all duration-300 p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white text-lg">⚡</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Energy Transformations from {aspectName}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Four activation energies emanating from this palace</p>
          </div>
        </div>

        <div className="space-y-4">
          {transformations.map((transformation, index) => (
            <motion.div
              key={transformation.type}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (index + 1) }}
              className={`bg-gradient-to-br ${transformation.bgLight} dark:${transformation.bgDark} border ${transformation.borderLight} ${transformation.borderDark} rounded-xl p-5 hover:shadow-lg transition-all`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${transformation.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-2xl">{transformation.icon}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                      {transformation.star} {transformation.chineseName}
                    </h4>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm text-gray-500 dark:text-gray-400">→</span>
                      <span className={`text-sm font-semibold px-2.5 py-0.5 bg-${transformation.type === '禄' ? 'green' : transformation.type === '权' ? 'purple' : transformation.type === '科' ? 'blue' : 'red'}-100 dark:bg-${transformation.type === '禄' ? 'green' : transformation.type === '权' ? 'purple' : transformation.type === '科' ? 'blue' : 'red'}-900/40 ${transformation.textColor} rounded-full`}>
                        {transformation.targetPalace}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong className={transformation.textColor}>
                        {transformation.type === '禄' ? 'Abundance flows naturally:' : 
                         transformation.type === '权' ? 'Command and influence:' :
                         transformation.type === '科' ? 'Enhanced reputation:' :
                         'Mindful attention required:'}
                      </strong> {transformation.insight1}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      <strong className={transformation.textColor}>
                        {transformation.type === '禄' ? 'Strategic timing:' : 
                         transformation.type === '权' ? 'Leadership potential:' :
                         transformation.type === '科' ? 'Excellence shines:' :
                         'Growth through awareness:'}
                      </strong> {transformation.insight2}
                    </p>
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
