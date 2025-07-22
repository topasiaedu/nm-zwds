import React, { useEffect, useState } from "react";
import { ChartData } from "../utils/zwds/types";
import { analyzeDestinyAlert, type PalaceAlertData } from "../utils/zwds/analysis";

/**
 * Props for the PDF Four Key Palace Continued component
 */
type PdfFourKeyPalaceContinuedProps = {
  chartData: ChartData;
};

/**
 * PDF-specific Four Key Palace Continued component for overflow cards (3rd onwards)
 */
const PdfFourKeyPalaceContinued: React.FC<PdfFourKeyPalaceContinuedProps> = ({ chartData }) => {
  const [alerts, setAlerts] = useState<PalaceAlertData[]>([]);

  // Analyze destiny alert data - force English for PDF
  useEffect(() => {
    try {
      const analysisResult = analyzeDestinyAlert(chartData);
      setAlerts(analysisResult.alerts || []);
    } catch (error) {
      console.error("Error analyzing four key palace:", error);
      setAlerts([]);
    }
  }, [chartData]);

  /**
   * Extracts the Chinese character without the "hua" part
   */
  const getTransformationChar = (transformation: string): string => {
    return transformation.charAt(1);
  };

  /**
   * Gets the color for a transformation based on its type
   */
  const getTransformationColor = (transformation: string): string => {
    const char = getTransformationChar(transformation);
    switch (char) {
      case "祿": // Traditional
      case "禄": // Simplified
        return "#059669"; // green-600
      case "權": // Traditional
      case "权": // Simplified
        return "#2563eb"; // blue-600
      case "科":
        return "#d97706"; // yellow-600
      case "忌":
        return "#dc2626"; // red-600
      default:
        return "#4b5563"; // gray-600
    }
  };

  /**
   * Gets the background color for a transformation card
   */
  const getBackgroundColor = (transformation: string): string => {
    const char = getTransformationChar(transformation);
    switch (char) {
      case "祿": // Traditional
      case "禄": // Simplified
        return "#f0fdf4"; // green-50
      case "權": // Traditional
      case "权": // Simplified
        return "#eff6ff"; // blue-50
      case "科":
        return "#fffbeb"; // yellow-50
      case "忌":
        return "#fef2f2"; // red-50
      default:
        return "#f9fafb"; // gray-50
    }
  };

  /**
   * Gets the border color for a transformation card
   */
  const getBorderColor = (transformation: string): string => {
    const char = getTransformationChar(transformation);
    switch (char) {
      case "祿": // Traditional
      case "禄": // Simplified
        return "#bbf7d0"; // green-200
      case "權": // Traditional
      case "权": // Simplified
        return "#dbeafe"; // blue-200
      case "科":
        return "#fef3c7"; // yellow-200
      case "忌":
        return "#fecaca"; // red-200
      default:
        return "#e5e7eb"; // gray-200
    }
  };

  // Get overflow cards (3rd onwards)
  const overflowAlerts = alerts.slice(2);

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
          DESTINY ALERT MAP
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#6b7280", // gray-500
          fontStyle: "italic",
          margin: "0",
        }}>
          Additional Destiny Alerts
        </p>
      </div>

      {/* Continued Cards in Column Layout */}
      <div>
        {overflowAlerts.length > 0 ? (
          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}>
            {overflowAlerts.map((alert, index) => (
              <div 
                key={`${alert.palaceNumber}-${alert.transformation}`}
                style={{
                  position: "relative",
                  border: `2px solid ${getBorderColor(alert.transformation)}`,
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: getBackgroundColor(alert.transformation),
                  overflow: "hidden",
                }}
              >
                {/* Background transformation character */}
                <div style={{
                  position: "absolute",
                  top: "0",
                  right: "0",
                  bottom: "0",
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent: "flex-end",
                  padding: "8px 16px 8px 0",
                  pointerEvents: "none",
                  zIndex: 0,
                }}>
                  <span style={{
                    fontSize: "80px",
                    fontWeight: "bold",
                    color: getTransformationColor(alert.transformation),
                    opacity: 0.08,
                    lineHeight: "1",
                    transform: "scale(3)",
                  }}>
                    {getTransformationChar(alert.transformation)}
                  </span>
                </div>

                {/* Content */}
                <div style={{ position: "relative", zIndex: 1 }}>
                  {/* Palace name header */}
                  <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                  }}>
                    <h3 style={{
                      fontSize: "20px",
                      fontWeight: "bold",
                      color: "#1f2937", // gray-800
                      margin: "0",
                    }}>
                      {alert.palace}
                    </h3>
                  </div>

                  {/* Quote with emphasis */}
                  {alert.quote && (
                    <blockquote style={{
                      fontSize: "18px",
                      fontStyle: "italic",
                      fontWeight: "600",
                      color: "#374151", // gray-700
                      paddingLeft: "16px",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                      marginBottom: "16px",
                      textAlign: "center",
                      position: "relative",
                      margin: "0 0 16px 0",
                    }}>
                      <span style={{
                        position: "absolute",
                        top: "0",
                        left: "0",
                        fontSize: "40px",
                        color: "#a855f7", // purple-500 with opacity
                        opacity: 0.3,
                        lineHeight: "1",
                        fontFamily: "serif",
                      }}>
                        &quot;
                      </span>
                      <span style={{ position: "relative", zIndex: 1 }}>
                        {alert.quote}
                      </span>
                      <span style={{
                        position: "absolute",
                        bottom: "0",
                        right: "16px",
                        fontSize: "40px",
                        color: "#a855f7", // purple-500 with opacity
                        opacity: 0.3,
                        lineHeight: "1",
                        fontFamily: "serif",
                      }}>
                        &quot;
                      </span>
                    </blockquote>
                  )}

                  {/* Description */}
                  <div style={{
                    color: "#4b5563", // gray-600
                    fontSize: "14px",
                    lineHeight: "1.6",
                  }}>
                    {alert.description ? (
                      // Split description by double line breaks to create paragraphs
                      alert.description.split('\n\n').map((paragraph, pIndex) => (
                        <p key={pIndex} style={{
                          margin: pIndex > 0 ? "12px 0 0 0" : "0",
                        }}>
                          {paragraph.trim()}
                        </p>
                      ))
                    ) : (
                      <p style={{ margin: "0" }}>
                        No description available for this transformation.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{
            textAlign: "center",
            padding: "48px 24px",
          }}>
            <p style={{
              color: "#6b7280", // gray-500
              fontSize: "16px",
              margin: "0",
            }}>
              No additional destiny alerts available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfFourKeyPalaceContinued; 