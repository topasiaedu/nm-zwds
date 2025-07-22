import React, { useEffect, useState } from "react";
import { ChartData } from "../utils/zwds/types";
import { 
  analyzeHealthFromChart, 
  type HealthAnalysisResult 
} from "../utils/zwds/health_analyzer";

/**
 * Props for the PDF Health Continued component
 */
type PdfHealthContinuedProps = {
  chartData: ChartData;
};

/**
 * PDF-specific Health continuation component for overflow health tips
 * Shows health tips from index 2 onwards when there are more than 2 tips
 */
const PdfHealthContinued: React.FC<PdfHealthContinuedProps> = ({ chartData }) => {
  const [healthAnalysis, setHealthAnalysis] = useState<HealthAnalysisResult | null>(null);

  // Analyze health data
  useEffect(() => {
    try {
      const analysisResult = analyzeHealthFromChart(chartData);
      setHealthAnalysis(analysisResult);
    } catch (error) {
      console.error("Error analyzing health data:", error);
      setHealthAnalysis({
        affectedBodyParts: [],
        healthTips: [],
        starsInHealthPalace: [],
        usedParentsPalace: false,
      });
    }
  }, [chartData]);

  /**
   * Renders overflow health tips (from 3rd onwards)
   */
  const renderOverflowHealthTips = (): JSX.Element => {
    if (!healthAnalysis || healthAnalysis.healthTips.length <= 2) {
      return (
        <p style={{
          color: "#6b7280", // gray-500
          fontSize: "14px",
          margin: "0",
          fontStyle: "italic",
        }}>
          No additional health tips to display.
        </p>
      );
    }

    // Show tips from index 2 onwards
    const overflowTips = healthAnalysis.healthTips.slice(2);

    return (
      <div style={{ 
        margin: "0", 
        padding: "0",
      }}>
        {overflowTips.map((tip, index) => (
          <div 
            key={index + 2} // Offset index since we're starting from 3rd tip
            style={{
              marginBottom: "16px",
              paddingLeft: "16px",
              borderLeft: "4px solid #ef4444", // red-500
              backgroundColor: "#fef2f2", // red-50
              borderRadius: "0 4px 4px 0",
              padding: "12px 16px",
            }}
          >
            {/* Body Part Header */}
            <div style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "8px",
            }}>
              <div style={{
                width: "8px",
                height: "8px",
                backgroundColor: "#ef4444", // red-500
                borderRadius: "50%",
                marginRight: "8px",
                flexShrink: 0,
              }} />
              <h4 style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#1f2937", // gray-800
                margin: "0",
              }}>
                {tip.englishName || tip.bodyPart}
              </h4>
            </div>
            
            {/* Tip Description */}
            <p style={{
              margin: "0",
              fontSize: "14px",
              color: "#374151", // gray-700
              lineHeight: "1.6",
            }}>
              {tip.description}
            </p>

            {/* Associated Stars */}
            {tip.associatedStars && tip.associatedStars.length > 0 && (
              <div style={{ marginTop: "8px" }}>
                <span style={{
                  fontSize: "12px",
                  color: "#6b7280", // gray-500
                  fontStyle: "italic",
                }}>
                  Associated stars: {tip.associatedStars.join(", ")}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
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
          HEALTH CODE SCAN
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#6b7280", // gray-500
          fontStyle: "italic",
          margin: "0",
        }}>
          Additional Health Insights & Tips
        </p>
      </div>

      {/* Content Section */}
      <div style={{ marginBottom: "32px" }}>
        {/* Health Tips Section */}
        <div>
          {renderOverflowHealthTips()}
        </div>
      </div>
    </div>
  );
};

export default PdfHealthContinued; 