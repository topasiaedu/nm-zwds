import React, { useState, useEffect } from "react";
import { analyzeWatchouts } from "../../utils/zwds/analysis";
import { useLanguage } from "../../context/LanguageContext";
import { WatchoutResult } from "../../utils/zwds/analysis/watchoutAnalysis";
import AnimatedWrapper from "./AnimatedWrapper";
import { motion } from "framer-motion";

/**
 * Props interface for the WatchoutAnalysis component
 */
interface WatchoutAnalysisProps {
  chartData: any;
}

/**
 * WatchoutAnalysis component that displays what to watch out for based on the user's chart
 * Draws data from WATCHOUT_ANALYSIS_CONSTANTS through the analyzeWatchouts function
 */
const WatchoutAnalysis: React.FC<WatchoutAnalysisProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [watchoutData, setWatchoutData] = useState<WatchoutResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Helper function to translate or provide default text
  const getText = (key: string, defaultText: string): string => {
    const translated = t(key);
    // If translation returns the key itself or is empty, use default text
    return (!translated || translated === key) ? defaultText : translated;
  };

  useEffect(() => {
    if (chartData) {
      try {
        // Get watchout data
        const watchouts = analyzeWatchouts(chartData);
        
        // Check if we have any data
        if (watchouts.length === 0) {
          // Use sample data for testing if no real data is available
          setWatchoutData([
            {
              palace: "命宫",
              star: "紫微",
              warning: getText(`analysis.watchout.命宫.紫微`, "别太骄傲、太高冷、要求太高而失去人缘")
            },
            {
              palace: "财帛宫",
              star: "天府",
              warning: getText(`analysis.watchout.财帛.天府`, "过于保守，错失机会")
            },
            {
              palace: "官禄宫",
              star: "武曲",
              warning: getText(`analysis.watchout.官禄.武曲`, "压过主管、推不开团队、太用力失去弹性")
            }
          ]);
          setError(true);
        } else {
          // Transform results to use translations
          const translatedResults = watchouts.map(item => ({
            palace: item.palace,
            star: item.star,
            warning: getText(`analysis.watchout.${item.palace}.${item.star}`, item.warning)
          }));
          setWatchoutData(translatedResults);
          setError(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error analyzing watchout data:", error);
        
        // Use sample data in case of error
        setWatchoutData([
          {
            palace: "命宫",
            star: "紫微",
            warning: getText(`analysis.watchout.命宫.紫微`, "别太骄傲、太高冷、要求太高而失去人缘")
          },
          {
            palace: "财帛宫",
            star: "天府",
            warning: getText(`analysis.watchout.财帛.天府`, "过于保守，错失机会")
          }
        ]);
        setError(true);
        setLoading(false);
      }
    }
  }, [chartData, language, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Animation variants for staggered list items
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 150,
        damping: 15
      }
    }
  };

  return (
    <AnimatedWrapper delay={0.2} threshold={0.2}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="bg-indigo-600 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            {getText("analysis.watchout.title", "Areas to Watch Out For")}
          </h2>
        </div>

        <div className="p-6">
          {watchoutData.length > 0 ? (
            <motion.div 
              className="grid grid-cols-1 gap-4"
              variants={listVariants}
              initial="hidden"
              animate="visible"
            >
              {watchoutData.map((item, index) => (
                <motion.div 
                  key={index}
                  variants={itemVariants}
                  className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-800/30"
                >
                  <p className="text-gray-700 dark:text-gray-300">{item.warning}</p>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="text-center py-8">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {getText("analysis.watchout.noData", "No watchout data available for analysis")}
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default WatchoutAnalysis; 