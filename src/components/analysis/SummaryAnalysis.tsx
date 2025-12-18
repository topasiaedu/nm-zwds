import React, { useState, useEffect } from "react";
import { analyzeSummary, SummaryAnalysisResult } from "../../utils/zwds/analysis";
import { useLanguage } from "../../context/LanguageContext";
import { SUMMARY_ANALYSIS_CONSTANTS } from "../../utils/zwds/analysis_constants/summary_analysis";
import AnimatedWrapper from "./AnimatedWrapper";
import { motion } from "framer-motion";

/**
 * Props interface for the SummaryAnalysis component
 */
interface SummaryAnalysisProps {
  chartData: any;
}

/**
 * SummaryAnalysis component that displays personality summaries
 * based on stars in the Life Palace (命宫)
 */
const SummaryAnalysis: React.FC<SummaryAnalysisProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [summaries, setSummaries] = useState<SummaryAnalysisResult[]>([]);
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
        // Get personality summaries from Life Palace stars
        const summaryResults = analyzeSummary(chartData);
        
        // Check if we have any data
        if (summaryResults.length === 0) {
          // Use sample data for testing if no real data is available
          const demoData = [
            { starName: "紫微", description: getText(`analysis.summary.stars.紫微`, SUMMARY_ANALYSIS_CONSTANTS.紫微) },
            { starName: "太阳", description: getText(`analysis.summary.stars.太阳`, SUMMARY_ANALYSIS_CONSTANTS.太阳) },
            { starName: "天同", description: getText(`analysis.summary.stars.天同`, SUMMARY_ANALYSIS_CONSTANTS.天同) }
          ];
          setSummaries(demoData);
          setError(true);
          console.log("Using demo data for Summary Analysis as no stars were found in Life Palace");
        } else {
          // Transform summaryResults to use translations
          const translatedResults = summaryResults.map(summary => ({
            starName: summary.starName,
            description: getText(`analysis.summary.stars.${summary.starName}`, summary.description)
          }));
          setSummaries(translatedResults);
          setError(false);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error analyzing summary data:", err);
        
        // Use sample data in case of error
        const demoData = [
          { starName: "紫微", description: getText(`analysis.summary.stars.紫微`, SUMMARY_ANALYSIS_CONSTANTS.紫微) },
          { starName: "太阳", description: getText(`analysis.summary.stars.太阳`, SUMMARY_ANALYSIS_CONSTANTS.太阳) },
          { starName: "文曲", description: getText(`analysis.summary.stars.文曲`, SUMMARY_ANALYSIS_CONSTANTS.文曲) }
        ];
        setSummaries(demoData);
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

  // Combine all summaries into a single paragraph, replacing newlines with spaces
  const combinedDescription = summaries
    .map(summary => summary.description.replace(/\n/g, " "))
    .join(" ");

  // Animation variants for text
  const textVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8
      } 
    }
  };

  return (
    <AnimatedWrapper delay={0.2} threshold={0.3}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
          <h2 className="text-xl font-bold text-white flex items-center">
            <svg 
              className="w-6 h-6 mr-2" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M13 10V3L4 14h7v7l9-11h-7z" 
              />
            </svg>
            {getText("analysis.summary.title", "Personality Summary")}
          </h2>
        </div>

        <div className="p-4">
          {summaries.length > 0 ? (
            <div className="rounded-lg">
              <motion.div 
                className="text-gray-700 dark:text-gray-300"
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                {combinedDescription}
              </motion.div>
            </div>
          ) : (
            <div className="text-center py-8">
              <svg 
                className="mx-auto h-12 w-12 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg">
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                />
              </svg>
              <p className="mt-2 text-gray-500 dark:text-gray-400">
                {getText("analysis.summary.noData", "No summary data available for analysis")}
              </p>
            </div>
          )}
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default SummaryAnalysis; 