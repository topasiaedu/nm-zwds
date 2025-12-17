/**
 * ActivationAnalysis Component
 * Displays analysis of the four activation tags (禄权科忌 - Lu/Quan/Ke/Ji)
 * Shows which star transforms, which palace it affects, and keywords for impact
 */

import React, { useMemo } from "react";
import { ChartData } from "../../../utils/zwds/types";

/**
 * Component props
 */
interface ActivationAnalysisProps {
  chartData: ChartData | null;
}

/**
 * Activation configuration with visual styling
 */
interface ActivationConfig {
  chineseName: string;
  englishName: string;
  gradient: string;
  bgLight: string;
  bgDark: string;
  borderLight: string;
  borderDark: string;
  textColor: string;
  icon: string;
}

/**
 * Activation tag configurations with colors and styling
 */
const ACTIVATION_CONFIGS: Record<string, ActivationConfig> = {
  禄: {
    chineseName: "禄",
    englishName: "Lu",
    gradient: "from-green-500 to-emerald-500",
    bgLight: "bg-green-50",
    bgDark: "dark:bg-green-900/20",
    borderLight: "border-green-200",
    borderDark: "dark:border-green-800",
    textColor: "text-green-600 dark:text-green-400",
    icon: "💰"
  },
  权: {
    chineseName: "权",
    englishName: "Quan",
    gradient: "from-purple-500 to-violet-500",
    bgLight: "bg-purple-50",
    bgDark: "dark:bg-purple-900/20",
    borderLight: "border-purple-200",
    borderDark: "dark:border-purple-800",
    textColor: "text-purple-600 dark:text-purple-400",
    icon: "👑"
  },
  科: {
    chineseName: "科",
    englishName: "Ke",
    gradient: "from-blue-500 to-cyan-500",
    bgLight: "bg-blue-50",
    bgDark: "dark:bg-blue-900/20",
    borderLight: "border-blue-200",
    borderDark: "dark:border-blue-800",
    textColor: "text-blue-600 dark:text-blue-400",
    icon: "⭐"
  },
  忌: {
    chineseName: "忌",
    englishName: "Ji",
    gradient: "from-red-500 to-orange-500",
    bgLight: "bg-red-50",
    bgDark: "dark:bg-red-900/20",
    borderLight: "border-red-200",
    borderDark: "dark:border-red-800",
    textColor: "text-red-600 dark:text-red-400",
    icon: "⚠️"
  }
};

/**
 * Actionable insights for each activation type (context-aware)
 */
interface ActivationInsight {
  what: string;  // What this means
  soWhat: string; // Why it matters
  action: string; // What to do about it
}

/**
 * Generate context-aware insights based on transformation type and landing palace
 */
const generateActivationInsight = (
  type: string,
  toPalace: string,
  aspectContext: string
): ActivationInsight => {
  const insights: Record<string, Record<string, ActivationInsight>> = {
    "禄": {
      "Wealth": {
        what: "Your efforts in this area naturally attract financial rewards and resources",
        soWhat: "Investments of time and energy here yield tangible returns with less resistance",
        action: "Focus initiatives here - the universe is supporting material gains through this channel"
      },
      "Career": {
        what: "Professional opportunities and recognition flow smoothly from your actions here",
        soWhat: "Your work gains visibility and opens doors for advancement and income",
        action: "Leverage this energy for career moves, promotions, or launching new ventures"
      },
      "default": {
        what: "Energy flows smoothly from here, bringing favorable outcomes",
        soWhat: "Actions taken in this area naturally lead to positive developments",
        action: "Lean into opportunities arising from this domain - they're supported by cosmic timing"
      }
    },
    "权": {
      "Career": {
        what: "You command authority and influence in professional matters through this area",
        soWhat: "Others look to you for leadership and trust your judgment in career decisions",
        action: "Step into leadership roles - your capacity to direct and decide is heightened"
      },
      "Life": {
        what: "Personal power and self-mastery emanate from your actions in this domain",
        soWhat: "You gain confidence and the ability to shape your own destiny",
        action: "Take charge of your life direction - you have the authority to make bold changes"
      },
      "default": {
        what: "Authority and decisiveness manifest through your engagement here",
        soWhat: "You gain the power to influence outcomes and lead in this area",
        action: "Exercise your judgment boldly - you have the backing to make important calls"
      }
    },
    "科": {
      "Life": {
        what: "Your reputation and personal brand are enhanced through this aspect",
        soWhat: "You become known for your qualities and attract recognition naturally",
        action: "Build your public image thoughtfully - visibility and credibility are growing"
      },
      "Career": {
        what: "Professional achievements here gain public recognition and acclaim",
        soWhat: "Your expertise becomes known, attracting opportunities and respect",
        action: "Document wins, share knowledge - your contributions deserve to be seen"
      },
      "default": {
        what: "Excellence and recognition flow into this area from your efforts",
        soWhat: "Your work here enhances your reputation and opens doors",
        action: "Pursue mastery and share your progress - recognition is assured"
      }
    },
    "忌": {
      "Health": {
        what: "Extra care and mindfulness are needed in wellness matters",
        soWhat: "Neglect here can compound into larger issues requiring attention",
        action: "Implement preventive measures and don't ignore warning signs - address issues early"
      },
      "Wealth": {
        what: "Financial caution and prudent management are essential",
        soWhat: "Impulsive decisions here may lead to complications or losses",
        action: "Review thoroughly before committing resources - seek expert guidance when uncertain"
      },
      "default": {
        what: "Challenges in this area serve as catalysts for necessary growth",
        soWhat: "Obstacles here are teaching moments, not punishments",
        action: "Approach with patience and thoroughness - lessons learned here build lasting wisdom"
      }
    }
  };

  const typeInsights = insights[type] || insights["禄"];
  return typeInsights[toPalace] || typeInsights["default"];
};

/**
 * ActivationAnalysis Component
 */
const ActivationAnalysis: React.FC<ActivationAnalysisProps> = ({ chartData }) => {
  /**
   * Mock activation data for demonstration
   * All transformations emanate FROM the aspect palace being analyzed
   */
  const activations = useMemo(() => {
    // Mock: Assume we're analyzing "Travel" palace, all 4 transformations fly FROM there
    const aspectPalace = "Travel";
    
    return [
      {
        type: "禄",
        starName: "武曲",
        toPalace: "Wealth",
        palaceNumber: 5
      },
      {
        type: "权",
        starName: "天机",
        toPalace: "Career",
        palaceNumber: 9
      },
      {
        type: "科",
        starName: "紫微",
        toPalace: "Life",
        palaceNumber: 1
      },
      {
        type: "忌",
        starName: "太阳",
        toPalace: "Health",
        palaceNumber: 6
      }
    ];
  }, []);

  if (!chartData) {
    return null;
  }

  const aspectPalace = "Travel"; // Mock - should come from props

  return (
    <section className="mb-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
            <span className="text-white text-lg">⚡</span>
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Energy Transformations from {aspectPalace}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Four key energies emanating from this palace and where they land
            </p>
          </div>
        </div>
      </div>

      {/* Transformation Insights Grid */}
      <div className="space-y-4">
        {activations.map((activation, index) => {
          const config = ACTIVATION_CONFIGS[activation.type];
          const insight = generateActivationInsight(activation.type, activation.toPalace, aspectPalace);

          return (
            <div
              key={index}
              className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-md ${config.bgLight} ${config.bgDark} ${config.borderLight} ${config.borderDark}`}
            >
              {/* Header Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Icon Badge */}
                  <div 
                    className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-sm flex-shrink-0`}
                  >
                    <span className="text-xl">{config.icon}</span>
                  </div>
                  
                  {/* Star + Transformation */}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      {activation.starName} 化{config.chineseName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-gray-500 dark:text-gray-400">Lands in</span>
                      <span className={`font-semibold ${config.textColor}`}>
                        {activation.toPalace}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Insights - 3 sections */}
              <div className="space-y-2 pl-13">
                {/* What */}
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    What:
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                    {insight.what}
                  </p>
                </div>

                {/* So What */}
                <div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    So What:
                  </span>
                  <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                    {insight.soWhat}
                  </p>
                </div>

                {/* Action */}
                <div className={`pt-2 border-t ${config.borderLight} ${config.borderDark}`}>
                  <span className={`text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 mb-1 ${config.textColor}`}>
                    → Action:
                  </span>
                  <p className={`text-sm font-medium ${config.textColor}`}>
                    {insight.action}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default ActivationAnalysis;
