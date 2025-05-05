import React, { useState, useEffect } from "react";
import { analyzeHealth, getStarsInPalace } from "../../utils/zwds/analysis";
import { useLanguage } from "../../context/LanguageContext";
import AnimatedWrapper from "./AnimatedWrapper";
import { motion } from "framer-motion";

/**
 * Props interface for the HealthAnalysis component
 */
interface HealthAnalysisProps {
  chartData: any;
}

/**
 * Custom human body outline SVG with pre-positioned organs
 * that only become visible when highlighted
 */
const HumanBodySVG: React.FC<{
  affectedParts: string[];
  gender: "male" | "female";
}> = ({ affectedParts, gender }) => {
  return (
    <svg 
      viewBox="0 0 300 600" 
      className="max-w-full h-auto"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base human outline - always visible */}
      <motion.path 
        d="M150,60 C175,60 195,85 195,115 C195,145 175,170 150,170 C125,170 105,145 105,115 C105,85 125,60 150,60 Z
           M150,170 C190,170 220,240 220,320 C220,400 190,450 150,450 C110,450 80,400 80,320 C80,240 110,170 150,170 Z
           M220,220 C240,230 260,270 260,300 C260,330 240,360 220,370
           M80,220 C60,230 40,270 40,300 C40,330 60,360 80,370
           M115,450 C110,490 105,530 100,570 
           M185,450 C190,490 195,530 200,570"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="dark:stroke-gray-200"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      
      {/* Head - highlight when affected */}
      <path 
        d="M150,60 C175,60 195,85 195,115 C195,145 175,170 150,170 C125,170 105,145 105,115 C105,85 125,60 150,60 Z" 
        fill="#ef4444"
        className={`${affectedParts.includes("头") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Eyes */}
      <g className={`${affectedParts.includes("眼") ? "opacity-40 animate-pulse" : "hidden"}`}>
        <ellipse 
          cx="135" 
          cy="105" 
          rx="8" 
          ry="5" 
          fill="#ef4444"
        />
        <ellipse 
          cx="165" 
          cy="105" 
          rx="8" 
          ry="5" 
          fill="#ef4444"
        />
      </g>
      
      {/* Heart */}
      <path 
        d="M150,220 C160,210 175,230 150,245 C125,230 140,210 150,220 Z" 
        fill="#ef4444"
        className={`${affectedParts.includes("心脏") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Lungs */}
      <g className={`${affectedParts.includes("肺") ? "opacity-40 animate-pulse" : "hidden"}`}>
        <path 
          d="M130,210 C115,220 115,250 130,270 C140,260 140,220 130,210 Z" 
          fill="#ef4444"
        />
        <path 
          d="M170,210 C185,220 185,250 170,270 C160,260 160,220 170,210 Z" 
          fill="#ef4444"
        />
      </g>
      
      {/* Stomach */}
      <ellipse 
        cx="150" 
        cy="290" 
        rx="25" 
        ry="20" 
        fill="#ef4444"
        className={`${affectedParts.includes("胃") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Liver */}
      <path 
        d="M120,280 C105,275 105,295 120,300 C130,295 130,275 120,280 Z" 
        fill="#ef4444"
        className={`${affectedParts.includes("肝脏") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Intestines */}
      <path 
        d="M150,320 C180,320 190,335 190,345 C190,355 180,370 150,370 C120,370 110,355 110,345 C110,335 120,320 150,320 Z" 
        fill="#ef4444"
        className={`${affectedParts.includes("肠") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Kidneys */}
      <g className={`${affectedParts.includes("肾") || affectedParts.includes("肾右") ? "opacity-40 animate-pulse" : "hidden"}`}>
        <ellipse 
          cx="120" 
          cy="310" 
          rx="12" 
          ry="8" 
          fill="#ef4444"
        />
        <ellipse 
          cx="180" 
          cy="310" 
          rx="12" 
          ry="8" 
          fill="#ef4444"
        />
      </g>
      
      {/* Bladder */}
      <ellipse 
        cx="150" 
        cy="400" 
        rx="15" 
        ry="12" 
        fill="#ef4444"
        className={`${affectedParts.includes("膀胱") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Reproductive area */}
      <ellipse 
        cx="150" 
        cy="430" 
        rx="12" 
        ry="10" 
        fill="#ef4444"
        className={`${affectedParts.includes("生殖器") ? "opacity-40 animate-pulse" : "hidden"}`}
      />
      
      {/* Hands */}
      <g className={`${affectedParts.includes("手") || affectedParts.includes("手右") ? "opacity-40 animate-pulse" : "hidden"}`}>
        <circle 
          cx="40" 
          cy="300" 
          r="15" 
          fill="#ef4444"
        />
        <circle 
          cx="260" 
          cy="300" 
          r="15" 
          fill="#ef4444"
        />
      </g>
      
      {/* Knees */}
      <g className={`${affectedParts.includes("膝盖") || affectedParts.includes("关节") || affectedParts.includes("膝盖右") || affectedParts.includes("关节右") ? "opacity-40 animate-pulse" : "hidden"}`}>
        <circle 
          cx="100" 
          cy="500" 
          r="15" 
          fill="#ef4444"
        />
        <circle 
          cx="200" 
          cy="500" 
          r="15" 
          fill="#ef4444"
        />
      </g>
      
      {/* Feet */}
      <g className={`${affectedParts.includes("脚") || affectedParts.includes("脚右") ? "opacity-40 animate-pulse" : "hidden"}`}>
        <ellipse 
          cx="100" 
          cy="570" 
          rx="20" 
          ry="10" 
          fill="#ef4444"
        />
        <ellipse 
          cx="200" 
          cy="570" 
          rx="20" 
          ry="10" 
          fill="#ef4444"
        />
      </g>
      
      {/* Nervous system overlay (only visible when affected) */}
      {affectedParts.includes("神经系统") && (
        <g className="opacity-40 animate-pulse">
          <path 
            d="M150,115 L150,500" 
            stroke="#ef4444"
            strokeWidth="5"
            strokeDasharray="7,7"
            fill="none"
          />
          <path 
            d="M150,290 L60,300 M150,290 L240,300" 
            stroke="#ef4444"
            strokeWidth="5"
            strokeDasharray="7,7"
            fill="none"
          />
        </g>
      )}
    </svg>
  );
};

/**
 * HealthAnalysis component that analyzes and displays health implications
 * based on stars in the chart's health palace (疾厄宫) with a human body visualization
 */
const HealthAnalysis: React.FC<HealthAnalysisProps> = ({ chartData }) => {
  const { t, language } = useLanguage();
  const [affectedBodyParts, setAffectedBodyParts] = useState<string[]>([]);
  const [starsInHealthPalace, setStarsInHealthPalace] = useState<string[]>([]);
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
        
        // Get affected body parts
        const bodyParts = analyzeHealth(chartData);
        
        // Get stars in the health palace
        const stars = getStarsInPalace(chartData, "疾厄");
        
        // Check if we have any data
        if (bodyParts.length === 0 && stars.length === 0) {
          
          // Use sample data for testing if no real data is available
          setAffectedBodyParts([
            "头", 
            "眼", 
            "心脏", 
            "肝脏",
            "神经系统"
          ]);
          setStarsInHealthPalace(["太阳", "武曲", "廉贞"]);
          setError(true);
        } else {
          setAffectedBodyParts(bodyParts);
          setStarsInHealthPalace(stars.map(star => star.star));
          setError(false);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error analyzing health data:", error);
        
        // Use sample data in case of error
        setAffectedBodyParts([
          "头", 
          "眼", 
          "心脏", 
          "肝脏",
          "神经系统"
        ]);
        setStarsInHealthPalace(["太阳", "武曲", "廉贞"]);
        setError(true);
        setLoading(false);
      }
    }
  }, [chartData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <AnimatedWrapper delay={0.2} threshold={0.25}>
      <div className="rounded-2xl shadow-lg overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <div className="bg-gradient-to-r from-red-500 to-pink-500 px-6 py-4">
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            {getText("analysis.health.title", "Health Analysis")}
            {error && (
              <span className="ml-2 text-xs bg-yellow-400 text-black px-2 py-1 rounded">
                Demo Data
              </span>
            )}
          </h2>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left column - Interactive human body */}
            <motion.div 
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
            >
              <HumanBodySVG 
                affectedParts={affectedBodyParts} 
                gender={chartData?.input?.gender === "female" ? "female" : "male"} 
              />
            </motion.div>
            
            {/* Right column - Health interpretations */}
            <div className="flex flex-col space-y-4">
              {affectedBodyParts.length > 0 ? (
                <>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-white">
                      {getText("analysis.health.basedOnStars", "Based on Stars in Health Palace")}:
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {starsInHealthPalace.map((star, index) => (
                        <span 
                          key={index} 
                          className="px-3 py-1 bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300 rounded-full text-sm font-medium">
                          {star}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {affectedBodyParts.map((bodyPart, index) => (
                      <div 
                        key={index} 
                        className="flex items-center bg-pink-50 dark:bg-pink-900/20 p-3 rounded-lg">
                        <span className="w-3 h-3 rounded-full bg-red-500 mr-3 animate-pulse"></span>
                        <span className="text-gray-800 dark:text-gray-200 font-medium">{bodyPart}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg">
                    <p>
                      {getText("analysis.health.disclaimer", 
                        "This analysis is based on the stars in your health palace (疾厄宫) and provides general guidance only. It is not intended to replace professional medical advice. Always consult with qualified healthcare providers for any health concerns.")}
                    </p>
                  </div>
                </>
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
                    {getText("analysis.health.noData", "No health data available for analysis")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AnimatedWrapper>
  );
};

export default HealthAnalysis;