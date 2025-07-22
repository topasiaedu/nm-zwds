import React from "react";
import { ChartData } from "../utils/zwds/types";
import { analyzeOverview, OverviewAnalysisResult } from "../utils/zwds/analysis/overviewAnalysis";

/**
 * Props for the PDF Overview component
 */
type PdfOverviewProps = {
  chartData: ChartData;
};

/**
 * PDF-specific Overview component optimized for consistent export across devices
 * Removes responsive design and external dependencies for reliable PDF generation
 */
const PdfOverview: React.FC<PdfOverviewProps> = ({ chartData }) => {
  // Analyze the chart data to get real data
  const analysisResult: OverviewAnalysisResult = analyzeOverview(chartData);

  /**
   * Renders feature items as a clean list for PDF
   */
  const renderFeatureItems = (
    items: string[],
    color: "green" | "red"
  ): JSX.Element => {
    const bulletColor = color === "green" ? "#10b981" : "#ef4444"; // green-500 or red-500

    return (
      <div style={{ 
        margin: "0", 
        padding: "0",
      }}>
        {items.map((item, index) => (
          <div 
            key={`${color}-${index}`} 
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
              fontSize: "14px",
              color: "#374151", // gray-700
              lineHeight: "1.4",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div 
              style={{
                width: "6px",
                height: "6px",
                backgroundColor: bulletColor,
                borderRadius: "50%",
                marginRight: "10px",
                flexShrink: 0,
                marginTop: "0",
                marginBottom: "0",
              }}
            />
            <div style={{ 
              flex: 1,
              margin: "0",
              padding: "0",
              lineHeight: "1.4",
            }}>
              {item}
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders tip items with border styling for PDF
   */
  const renderTipItems = (items: string[]): JSX.Element[] => {
    return items.map((item, index) => (
      <div
        key={`tip-${index}`}
        style={{
          padding: "12px",
          borderLeft: "4px solid #3b82f6", // blue-500
          backgroundColor: "#eff6ff", // blue-50
          borderRadius: "0 4px 4px 0",
          marginBottom: "8px",
          boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        }}>
        <p style={{
          margin: "0",
          fontSize: "14px",
          fontWeight: "500",
          color: "#1e3a8a", // blue-900
          lineHeight: "1.4",
        }}>
          {item}
        </p>
      </div>
    ));
  };

  /**
   * Renders description paragraphs from analysis
   */
  const renderDescriptions = (): JSX.Element[] => {
    return analysisResult.descriptions.map((description, index) => (
      <p 
        key={`description-${index}`} 
        style={{
          marginBottom: "16px",
          color: "#374151", // gray-700
          fontSize: "14px",
          lineHeight: "1.6",
        }}
      >
        {description}
      </p>
    ));
  };

  return (
    <div style={{ 
      padding: "24px",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "white",
      minHeight: "100vh",
    }}>
      {/* Page Title */}
      <div style={{ marginBottom: "24px" }}>
        <h2 style={{
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1f2937", // gray-800
          marginBottom: "8px",
          margin: "0 0 8px 0",
        }}>
          Personalised Life Report
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#6b7280", // gray-500
          fontStyle: "italic",
          margin: "0",
        }}>
          Personality insights based on your chart&apos;s core configuration
        </p>
      </div>

      {/* First Section - Full Width Description */}
      <div style={{ marginBottom: "32px" }}>
        <div>
          {analysisResult.descriptions.length > 0 ? (
            renderDescriptions()
          ) : (
            <p style={{
              marginBottom: "16px",
              color: "#6b7280", // gray-500
              fontSize: "14px",
            }}>
              No analysis data available for the stars in your life palace. Please ensure your chart data is properly calculated.
            </p>
          )}
        </div>
      </div>

      {/* Second Section - Strengths and Potential Challenges in Two Columns */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        marginBottom: "32px",
      }}>
        {/* Strengths Column */}
        <div>
          <h5 style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#1f2937", // gray-800
            margin: "0 0 12px 0",
          }}>
            Strengths
          </h5>
          <div>
            {analysisResult.strengths.length > 0 ? (
              renderFeatureItems(analysisResult.strengths, "green")
            ) : (
              <p style={{
                color: "#6b7280", // gray-500
                fontSize: "12px",
                margin: "0",
              }}>
                No strength data available
              </p>
            )}
          </div>
        </div>

        {/* Potential Challenges Column */}
        <div>
          <h5 style={{
            fontSize: "18px",
            fontWeight: "bold",
            marginBottom: "12px",
            color: "#1f2937", // gray-800
            margin: "0 0 12px 0",
          }}>
            Potential Challenges
          </h5>
          <div>
            {analysisResult.weaknesses.length > 0 ? (
              renderFeatureItems(analysisResult.weaknesses, "red")
            ) : (
              <p style={{
                color: "#6b7280", // gray-500
                fontSize: "12px",
                margin: "0",
              }}>
                No challenge data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Third Section - Growth Tips */}
      <div>
        <h5 style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "16px",
          paddingBottom: "8px",
          borderBottom: "2px solid #e2e8f0", // slate-200
          color: "#1f2937", // gray-800
          margin: "0 0 16px 0",
        }}>
          Growth Tips
        </h5>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
        }}>
          {analysisResult.quotes.length > 0 ? (
            renderTipItems(analysisResult.quotes)
          ) : (
            <p style={{
              color: "#6b7280", // gray-500
              fontSize: "12px",
              gridColumn: "1 / -1",
              margin: "0",
            }}>
              No tip data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfOverview; 