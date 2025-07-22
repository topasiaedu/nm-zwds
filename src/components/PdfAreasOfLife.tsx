import React, { useEffect, useState, useRef } from "react";
import { ChartData } from "../utils/zwds/types";
import { 
  calculateLifeAreaScores,
  analyzeLifeAreas,
  type ChartDataType,
  type RadarDataPoint,
  type LifeAreaResult
} from "../utils/zwds/analysis";

// Import English translations directly
import enTranslations from "../translations/en";

/**
 * Props for the PDF Areas of Life component
 */
type PdfAreasOfLifeProps = {
  chartData: ChartData;
};

/**
 * PDF-specific Areas of Life component optimized for consistent export across devices
 * Layout: Radar chart centered in its own row, life area analysis below
 */
const PdfAreasOfLife: React.FC<PdfAreasOfLifeProps> = ({ chartData }) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartDataUrl, setChartDataUrl] = useState<string>("");
  const [lifeAreaScores, setLifeAreaScores] = useState<RadarDataPoint[]>([]);
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
      const scores = calculateLifeAreaScores(chartData as ChartDataType, "en");
      const analysis = analyzeLifeAreas(chartData as ChartDataType, "en");
      
      setLifeAreaScores(scores);
      setLifeAreaAnalysis(analysis);
    } catch (error) {
      console.error("Error analyzing life areas:", error);
      setLifeAreaScores([]);
      setLifeAreaAnalysis([]);
    }
  }, [chartData]);

  // Create and snapshot radar chart
  useEffect(() => {
    if (lifeAreaScores.length > 0 && chartRef.current) {
      // Create a simple radar chart visualization using canvas
      const createRadarChart = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return null;

        // Set canvas size
        canvas.width = 400;
        canvas.height = 400;
        
        // Chart styling
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = 150;
        const maxScore = 100;
        
        // Background
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid circles
        for (let i = 1; i <= 5; i++) {
          const gridRadius = (radius * i) / 5;
          ctx.beginPath();
          ctx.arc(centerX, centerY, gridRadius, 0, 2 * Math.PI);
          ctx.strokeStyle = "#e5e7eb"; // gray-200
          ctx.lineWidth = 1;
          ctx.stroke();
        }
        
        // Draw axes
        const angles = lifeAreaScores.map((_, index) => (index * 2 * Math.PI) / lifeAreaScores.length - Math.PI / 2);
        
        angles.forEach((angle, index) => {
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          // Draw axis line
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(x, y);
          ctx.strokeStyle = "#d1d5db"; // gray-300
          ctx.lineWidth = 1;
          ctx.stroke();
          
          // Draw labels
          const labelX = centerX + Math.cos(angle) * (radius + 20);
          const labelY = centerY + Math.sin(angle) * (radius + 20);
          
          ctx.fillStyle = "#374151"; // gray-700
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.fillText(lifeAreaScores[index].area, labelX, labelY);
        });
        
        // Draw data polygon
        ctx.beginPath();
        lifeAreaScores.forEach((data, index) => {
          const angle = angles[index];
          const distance = (data.score / maxScore) * radius;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          if (index === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        });
        ctx.closePath();
        
        // Fill polygon
        ctx.fillStyle = "rgba(37, 99, 235, 0.2)"; // blue with opacity
        ctx.fill();
        
        // Stroke polygon
        ctx.strokeStyle = "#2563eb"; // blue-600
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Draw data points
        lifeAreaScores.forEach((data, index) => {
          const angle = angles[index];
          const distance = (data.score / maxScore) * radius;
          const x = centerX + Math.cos(angle) * distance;
          const y = centerY + Math.sin(angle) * distance;
          
          ctx.beginPath();
          ctx.arc(x, y, 4, 0, 2 * Math.PI);
          ctx.fillStyle = "#2563eb"; // blue-600
          ctx.fill();
          ctx.strokeStyle = "white";
          ctx.lineWidth = 2;
          ctx.stroke();
        });
        
        return canvas;
      };

      const canvas = createRadarChart();
      if (canvas) {
        const dataUrl = canvas.toDataURL("image/png", 0.95);
        setChartDataUrl(dataUrl);
      }
    }
  }, [lifeAreaScores]);



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
          Your personal scorecard across the 5 destiny pillars.
        </p>
      </div>

      {/* Radar Chart Row */}
      <div style={{ 
        marginBottom: "32px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {chartDataUrl ? (
          <img
            src={chartDataUrl}
            alt="Life Areas Radar Chart"
            style={{
              maxWidth: "400px",
              maxHeight: "400px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "400px",
            height: "400px",
            backgroundColor: "#f3f4f6", // gray-100
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280", // gray-500
            fontSize: "14px",
          }}>
            Generating life areas chart...
          </div>
        )}
      </div>

      {/* Hidden chart container for processing */}
      <div 
        ref={chartRef} 
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: "-9999px" 
        }} 
      />

      {/* Area Explanations - Show first 2 only */}
      <div style={{ marginTop: "32px" }}>
        {lifeAreaAnalysis.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "16px",
          }}>
            {lifeAreaAnalysis.slice(0, 2).map((area, index) => (
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
              No analysis available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfAreasOfLife; 