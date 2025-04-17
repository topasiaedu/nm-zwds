import React, { useState, useEffect } from "react";
import { analyzeHealth, getStarsInPalace } from "../../utils/zwds/analysis";
import { useLanguage } from "../../context/LanguageContext";
import { ReactComponent as FemaleSVG } from "../../assets/female.svg";
import { ReactComponent as MaleSVG } from "../../assets/male.svg";

/**
 * Props interface for the HealthAnalysis component
 */
interface HealthAnalysisProps {
  chartData: any;
}

/**
 * Type definition for body part highlight positions
 */
interface BodyPartPosition {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  width: string;
  height: string;
  borderRadius?: string;
}

/**
 * Map of body parts to their relative positions in the SVG for highlighting
 */
const bodyPartPositions: Record<string, Record<"male" | "female", BodyPartPosition>> = {
  "头": {
    male: { top: "6%", left: "50%", width: "17%", height: "13%", borderRadius: "50%" },
    female: { top: "12%", left: "50%", width: "17%", height: "13%", borderRadius: "50%" }
  },
  "眼": {
    male: { top: "8%", left: "50%", width: "20%", height: "3%", borderRadius: "50%" },
    female: { top: "14%", left: "50%", width: "20%", height: "3%", borderRadius: "50%" }
  },
  "心脏": {
    male: { top: "25%", left: "50%", width: "15%", height: "10%", borderRadius: "50%" },
    female: { top: "28%", left: "50%", width: "15%", height: "10%", borderRadius: "50%" }
  },
  "肺": {
    male: { top: "23%", left: "50%", width: "30%", height: "12%", borderRadius: "50%" },
    female: { top: "26%", left: "50%", width: "30%", height: "12%", borderRadius: "50%" }
  },
  "胃": {
    male: { top: "35%", left: "50%", width: "20%", height: "12%", borderRadius: "50%" },
    female: { top: "38%", left: "50%", width: "20%", height: "12%", borderRadius: "50%" }
  },
  "肝脏": {
    male: { top: "34%", left: "42%", width: "14%", height: "12%", borderRadius: "50%" },
    female: { top: "38%", left: "42%", width: "14%", height: "12%", borderRadius: "50%" }
  },
  "肠": {
    male: { top: "44%", left: "50%", width: "24%", height: "14%", borderRadius: "50%" },
    female: { top: "47%", left: "50%", width: "24%", height: "14%", borderRadius: "50%" }
  },
  "肾": {
    male: { top: "42%", left: "36%", width: "10%", height: "8%", borderRadius: "50%" },
    female: { top: "45%", left: "36%", width: "10%", height: "8%", borderRadius: "50%" }
  },
  "肾右": {
    male: { top: "42%", left: "64%", width: "10%", height: "8%", borderRadius: "50%" },
    female: { top: "45%", left: "64%", width: "10%", height: "8%", borderRadius: "50%" }
  },
  "膀胱": {
    male: { top: "54%", left: "50%", width: "16%", height: "8%", borderRadius: "50%" },
    female: { top: "55%", left: "50%", width: "16%", height: "8%", borderRadius: "50%" }
  },
  "生殖器": {
    male: { top: "59%", left: "50%", width: "14%", height: "8%", borderRadius: "50%" },
    female: { top: "60%", left: "50%", width: "14%", height: "8%", borderRadius: "50%" }
  },
  "膝盖": {
    male: { top: "75%", left: "38%", width: "8%", height: "8%", borderRadius: "50%" },
    female: { top: "75%", left: "38%", width: "8%", height: "8%", borderRadius: "50%" }
  },
  "膝盖右": {
    male: { top: "75%", left: "62%", width: "8%", height: "8%", borderRadius: "50%" },
    female: { top: "75%", left: "62%", width: "8%", height: "8%", borderRadius: "50%" }
  },
  "关节": {
    male: { top: "75%", left: "38%", width: "8%", height: "8%", borderRadius: "50%" },
    female: { top: "75%", left: "38%", width: "8%", height: "8%", borderRadius: "50%" }
  },
  "关节右": {
    male: { top: "75%", left: "62%", width: "8%", height: "8%", borderRadius: "50%" },
    female: { top: "75%", left: "62%", width: "8%", height: "8%", borderRadius: "50%" }
  },
  "手": {
    male: { top: "48%", left: "22%", width: "12%", height: "10%", borderRadius: "50%" },
    female: { top: "45%", left: "20%", width: "12%", height: "10%", borderRadius: "50%" }
  },
  "手右": {
    male: { top: "48%", left: "78%", width: "12%", height: "10%", borderRadius: "50%" },
    female: { top: "45%", left: "80%", width: "12%", height: "10%", borderRadius: "50%" }
  },
  "脚": {
    male: { bottom: "3%", left: "35%", width: "9%", height: "6%", borderRadius: "40%" },
    female: { bottom: "3%", left: "35%", width: "9%", height: "6%", borderRadius: "40%" }
  },
  "脚右": {
    male: { bottom: "3%", left: "65%", width: "9%", height: "6%", borderRadius: "40%" },
    female: { bottom: "3%", left: "65%", width: "9%", height: "6%", borderRadius: "40%" }
  },
  "神经系统": {
    male: { top: "0", left: "0", width: "100%", height: "100%", borderRadius: "0" },
    female: { top: "0", left: "0", width: "100%", height: "100%", borderRadius: "0" }
  }
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
        console.log("HealthAnalysis: Processing chart data", chartData);
        
        // Get affected body parts
        const bodyParts = analyzeHealth(chartData);
        console.log("Affected body parts found:", bodyParts);
        
        // Get stars in the health palace
        const stars = getStarsInPalace(chartData, "疾厄");
        console.log("Stars in health palace:", stars);
        
        // Check if we have any data
        if (bodyParts.length === 0 && stars.length === 0) {
          console.log("No health data found, using fallback sample data for testing");
          
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

  /**
   * Check if a body part is in the affected list
   * @param bodyPart - The body part to check
   * @returns True if the body part is affected
   */
  const isBodyPartAffected = (bodyPart: string): boolean => {
    return affectedBodyParts.includes(bodyPart);
  };

  /**
   * Generates all highlight elements needed for affected body parts
   * @param gender - The gender of the chart subject
   * @returns Array of highlight JSX elements
   */
  const generateHighlights = (gender: "male" | "female") => {
    const highlights: JSX.Element[] = [];
    
    // Special case for nervous system
    if (isBodyPartAffected("神经系统")) {
      highlights.push(
        <div 
          key="神经系统"
          className="absolute inset-0 border-2 border-red-500 border-dashed opacity-30 animate-pulse" 
          style={{ borderRadius: "0" }}
        />
      );
    }
    
    // Handle paired body parts (left and right sides)
    const pairedParts = ["肾", "膝盖", "关节", "手", "脚"];
    
    affectedBodyParts.forEach(bodyPart => {
      // Skip nervous system as it's handled separately
      if (bodyPart === "神经系统") return;
      
      // For standard body parts
      if (bodyPartPositions[bodyPart]) {
        const position = bodyPartPositions[bodyPart][gender];
        highlights.push(
          <div 
            key={bodyPart}
            className="absolute transform -translate-x-1/2 bg-red-500 opacity-30 animate-pulse" 
            style={{
              top: position.top,
              left: position.left,
              right: position.right,
              bottom: position.bottom,
              width: position.width,
              height: position.height,
              borderRadius: position.borderRadius || "50%",
            }}
          />
        );
      }
      
      // Handle paired body parts - add the right side if the main part is affected
      if (pairedParts.includes(bodyPart)) {
        const rightPart = `${bodyPart}右`;
        if (bodyPartPositions[rightPart]) {
          const position = bodyPartPositions[rightPart][gender];
          highlights.push(
            <div 
              key={rightPart}
              className="absolute transform -translate-x-1/2 bg-red-500 opacity-30 animate-pulse" 
              style={{
                top: position.top,
                left: position.left,
                right: position.right,
                bottom: position.bottom,
                width: position.width,
                height: position.height,
                borderRadius: position.borderRadius || "50%",
              }}
            />
          );
        }
      }
    });
    
    return highlights;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  // Get gender from chart data
  const gender = chartData?.input?.gender === "female" ? "female" : "male";

  return (
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Human body visualization - gender-specific SVG */}
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-50 dark:bg-gray-700/30 rounded-lg flex items-center justify-center p-4">
                  <div className="relative h-full" style={{ width: "280px", maxWidth: "100%" }}>
                    {gender === "female" ? (
                      <FemaleSVG className="w-full h-full" />
                    ) : (
                      <MaleSVG className="w-full h-full" />
                    )}
                    
                    {/* Overlay highlights for affected body parts */}
                    {generateHighlights(gender)}
                  </div>
                </div>
              </div>
              
              {/* Body parts list */}
              <div>
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-white">
                  {getText("analysis.health.potentialAreas", "Potential Areas of Attention")}:
                </h3>
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
              </div>
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
  );
};

export default HealthAnalysis;