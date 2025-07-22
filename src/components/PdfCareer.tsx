import React from "react";
import { ChartData } from "../utils/zwds/types";
import { 
  analyzeCareer, 
  getCareerArchetypeImage, 
  type CareerAnalysisResult 
} from "../utils/zwds/analysis/careerAnalysis";

/**
 * Props for the PDF Career component
 */
type PdfCareerProps = {
  chartData: ChartData;
};

/**
 * PDF-specific Career component optimized for consistent export across devices
 * Layout: Image/card on top row, all text content below
 */
const PdfCareer: React.FC<PdfCareerProps> = ({ chartData }) => {
  // Analyze career data
  const careerAnalysis: CareerAnalysisResult = analyzeCareer(chartData);

  // Get user gender from chart input
  const userGender = chartData.input.gender;

  // Get appropriate image path
  const imagePath = getCareerArchetypeImage(careerAnalysis.archetype, userGender);

  /**
   * Renders career items as a clean list for PDF
   */
  const renderCareerList = (
    items: readonly string[],
    color: "purple" | "red"
  ): JSX.Element => {
    const bulletColor = color === "purple" ? "#8b5cf6" : "#ef4444"; // purple-500 or red-500

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
          WEALTH STRATEGY PANEL
        </h2>
        <p style={{
          fontSize: "16px",
          color: "#6b7280", // gray-500
          fontStyle: "italic",
          margin: "0",
        }}>
          Uncover how you&apos;re wired to earn, invest, and build long-term financial power.
        </p>
      </div>

      {/* Image/Card Row */}
      <div style={{ 
        marginBottom: "32px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <img
          src={imagePath}
          alt={`${careerAnalysis.archetype} Career Archetype`}
          style={{
            maxWidth: "300px",
            maxHeight: "400px",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>

      {/* Content Section */}
      <div style={{ marginBottom: "32px" }}>
        {/* Archetype Title */}
        <h3 style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#1f2937", // gray-800
          marginBottom: "16px",
          fontStyle: "italic",
          margin: "0 0 16px 0",
        }}>
          Your {careerAnalysis.archetype} Path
        </h3>

        {/* Description */}
        <div style={{ marginBottom: "24px" }}>
          {careerAnalysis.description.split('\n').map((paragraph, index) => {
            const isLastParagraph = index === careerAnalysis.description.split('\n').length - 1;
            return (
              <p 
                key={index} 
                style={{
                  marginBottom: "16px",
                  color: "#374151", // gray-700
                  fontSize: "14px",
                  lineHeight: "1.6",
                  fontStyle: isLastParagraph ? "italic" : "normal",
                  fontWeight: isLastParagraph ? "500" : "normal",
                }}
                dangerouslySetInnerHTML={{ __html: paragraph }}
              />
            );
          })}
        </div>

        {/* Career Options in Two Columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
        }}>
          {/* Ideal Careers Column */}
          <div>
            <h4 style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#1f2937", // gray-800
              margin: "0 0 12px 0",
            }}>
              Ideal Careers
            </h4>
            <div>
              {careerAnalysis.idealCareers.length > 0 ? (
                renderCareerList(careerAnalysis.idealCareers, "purple")
              ) : (
                <p style={{
                  color: "#6b7280", // gray-500
                  fontSize: "12px",
                  margin: "0",
                }}>
                  No ideal career data available
                </p>
              )}
            </div>
          </div>

          {/* Non-Ideal Careers Column */}
          <div>
            <h4 style={{
              fontSize: "18px",
              fontWeight: "bold",
              marginBottom: "12px",
              color: "#1f2937", // gray-800
              margin: "0 0 12px 0",
            }}>
              Non-Ideal Careers
            </h4>
            <div>
              {careerAnalysis.nonIdealCareers.length > 0 ? (
                renderCareerList(careerAnalysis.nonIdealCareers, "red")
              ) : (
                <p style={{
                  color: "#6b7280", // gray-500
                  fontSize: "12px",
                  margin: "0",
                }}>
                  No non-ideal career data available
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PdfCareer; 