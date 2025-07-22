import React, { useEffect, useState } from "react";
import { ChartData } from "../utils/zwds/types";
import { 
  analyzeLifeAreas,
  type ChartDataType,
  type LifeAreaResult
} from "../utils/zwds/analysis";

// Import English translations directly
import enTranslations from "../translations/en";

/**
 * Props for the PDF Areas of Life Continued component
 */
type PdfAreasOfLifeContinuedProps = {
  chartData: ChartData;
};

/**
 * PDF-specific Areas of Life Continued component for overflow areas (3rd onwards)
 */
const PdfAreasOfLifeContinued: React.FC<PdfAreasOfLifeContinuedProps> = ({ chartData }) => {
  const [lifeAreaAnalysis, setLifeAreaAnalysis] = useState<LifeAreaResult[]>([]);

  // Helper function to normalize star names for translation lookup
  const normalizeStarName = (name: string): string => {
    const charMap: Record<string, string> = {
      辅: "輔",
    };

    return name
      .split("")
      .map((char) => charMap[char] || char)
      .join("");
  };

  // Translation helper function using actual English translation files
  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = enTranslations;
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key; // Return key if translation not found
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  // Analyze life areas data - force English for PDF
  useEffect(() => {
    try {
      const analysis = analyzeLifeAreas(chartData as ChartDataType, "en");
      setLifeAreaAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing life areas:", error);
      setLifeAreaAnalysis([]);
    }
  }, [chartData]);

  /**
   * Create combined descriptions for each area - forces English for PDF
   */
  const getCombinedDescription = (area: LifeAreaResult): string => {
    if (!area.stars || area.stars.length === 0) {
      return "";
    }

    // Combine all star descriptions into a single text
    return area.stars
      .map((star: any) => {
        // Force English translation for PDF by using the translation helper
        const starDescription = getStarDescription(area.area, star.name, star.description);
        return starDescription;
      })
      .join(" ");
  };

  /**
   * Translation helper for star descriptions - forces English for PDF
   */
  const getStarDescription = (
    area: string,
    starName: string,
    fallback: string
  ): string => {
    // Map English display names back to Chinese palace names for translation lookup
    const englishToChinese: Record<string, string> = {
      "Financial Prosperity": "财帛",
      "Health & Wellbeing": "疾厄", 
      "Friendships & Social Circle": "交友",
      "Love & Relationships": "夫妻",
      "Career & Achievement": "官禄",
      "Career & Professional Life": "官禄",
      "Siblings & Support": "兄弟",
      "Wellbeing & Fortune": "福德",
      "Parents & Heritage": "父母"
    };

    // Convert area from English display name to Chinese palace name if needed
    const chinesePalaceName = englishToChinese[area] || area;

    // Try exact match first using Chinese palace name
    const exactMatch = t(
      `analysis.areas.${chinesePalaceName}.stars.${starName}.description`
    );
    if (exactMatch !== `analysis.areas.${chinesePalaceName}.stars.${starName}.description`) {
      return exactMatch;
    }

    // Try normalized star name
    const normalizedName = normalizeStarName(starName);
    if (normalizedName !== starName) {
      const normalizedMatch = t(
        `analysis.areas.${chinesePalaceName}.stars.${normalizedName}.description`
      );
      if (
        normalizedMatch !==
        `analysis.areas.${chinesePalaceName}.stars.${normalizedName}.description`
      ) {
        return normalizedMatch;
      }
    }

    // Fallback to original description
    return fallback || `Star ${starName} influences ${area}`;
  };

  /**
   * Get color class for score
   */
  const getScoreColor = (score: number): string => {
    if (score >= 90) return "#10b981"; // green-500
    if (score >= 80) return "#3b82f6"; // blue-500
    if (score >= 70) return "#8b5cf6"; // purple-500
    if (score >= 60) return "#f59e0b"; // yellow-500
    return "#ef4444"; // red-500
  };

  /**
   * Get CSS color for score badge
   */
  const getScoreBadgeColor = (score: number): string => {
    if (score >= 90) return "#065f46"; // green-800
    if (score >= 80) return "#1e40af"; // blue-800
    if (score >= 70) return "#6b21a8"; // purple-800
    if (score >= 60) return "#92400e"; // yellow-800
    return "#991b1b"; // red-800
  };

  // Get overflow areas (3rd onwards) - changed from slice(3) to slice(2)
  const overflowAreas = lifeAreaAnalysis.slice(2);

  return (
    <div style={{ 
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "white",
      minHeight: "100vh",
    }}>
      {/* Page Title */}
      <div style={{ marginBottom: "24px", textAlign: "center" }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1f2937", // gray-800
          marginBottom: "8px",
          margin: "0 0 8px 0",
        }}>
          DESTINY SCOREBOARD
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#6b7280", // gray-500
          fontStyle: "italic",
          margin: "0",
        }}>
          Additional Life Area Insights
        </p>
      </div>

      {/* Continued Area Explanations */}
      <div>
        {overflowAreas.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
          }}>
            {overflowAreas.map((area, index) => (
              <div 
                key={index}
                style={{
                  position: "relative",
                  border: "1px solid #e5e7eb", // gray-200
                  borderRadius: "8px",
                  padding: "16px",
                  overflow: "hidden",
                }}
              >
                {/* Background Score Display */}
                <div style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  padding: "8px 16px 0 0",
                  pointerEvents: "none",
                  zIndex: 0,
                }}>
                  <span style={{
                    fontSize: "120px",
                    fontWeight: "bold",
                    color: getScoreColor(area.score),
                    opacity: 0.15,
                    lineHeight: "1",
                    transform: "scale(1)",
                  }}>
                    {area.score}
                  </span>
                </div>

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                    }}>
                      <span style={{
                        fontSize: "24px",
                      }}>
                        {area.icon}
                      </span>
                      <h4 style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: "#1f2937", // gray-800
                        margin: "0",
                      }}>
                        {area.displayName}
                      </h4>

                      {/* Score Badge */}
                      <span style={{
                        fontSize: "18px",
                        fontWeight: "bold",
                        color: getScoreBadgeColor(area.score),
                      }}>
                        {area.score}%
                      </span>
                    </div>
                    
                    <div>
                      <p style={{
                        color: "#4b5563", // gray-600
                        fontSize: "14px",
                        lineHeight: "1.6",
                        margin: "0",
                      }}>
                        {getCombinedDescription(area)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "24px",
          }}>
            <p style={{
              color: "#6b7280", // gray-500
              fontSize: "14px",
              margin: "0",
            }}>
              No additional areas available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfAreasOfLifeContinued; 