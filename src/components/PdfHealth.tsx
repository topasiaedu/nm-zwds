import React, { useRef, useEffect, useState } from "react";
import { ChartData } from "../utils/zwds/types";
import { 
  analyzeHealthFromChart, 
  type HealthAnalysisResult 
} from "../utils/zwds/health_analyzer";
import maleSvgContent from "../assets/male-svg";

/**
 * Props for the PDF Health component
 */
type PdfHealthProps = {
  chartData: ChartData;
};

/**
 * Maps Chinese body part names to SVG part identifiers for highlighting
 */
const bodyPartMapping: Record<string, string[]> = {
  头: ["head"],
  眼: ["eyes"],
  耳: ["left-ear", "right-ear"],
  左耳: ["left-ear"],
  右耳: ["right-ear"],
  口: ["mouth"],
  鼻: ["nose"],
  心脏: ["heart"],
  肝脏: ["liver"],
  肺: ["lungs"],
  胃: ["stomach"],
  肠: ["intestine"],
  肾: ["kidney"],
  膀胱: ["bladder"],
  生殖器: ["genitals"],
  左手: ["left-arm"],
  右手: ["right-arm"],
  手: ["left-arm", "right-arm"],
  左脚: ["left-leg"],
  右脚: ["right-leg"],
  脚: ["left-leg", "right-leg"],
  关节: [
    "joint_1", "joint_2", "joint_3", "joint_4", "joint_5", "joint_6",
    "joint_7", "joint_8", "joint_9", "joint_10", "joint_11", "joint_12",
  ],
  神经系统: [
    "joint_1", "joint_2", "joint_3", "joint_4", "joint_5", "joint_6",
    "joint_7", "joint_8", "heart", "lungs",
  ],
  膝盖: ["knee_1", "knee_2"],
  骨: ["spine", "ribs"],
  血液: ["heart", "lungs"],
  筋骨: ["left-arm", "right-arm", "left-leg", "right-leg"],
};

/**
 * PDF-specific Health component optimized for consistent export across devices
 * Layout: SVG snapshot on top row, health analysis content below
 */
const PdfHealth: React.FC<PdfHealthProps> = ({ chartData }) => {
  const svgRef = useRef<HTMLDivElement>(null);
  const [svgDataUrl, setSvgDataUrl] = useState<string>("");
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

  // Create and snapshot SVG
  useEffect(() => {
    if (healthAnalysis && svgRef.current) {
      // Create SVG element with highlighted affected parts
      const createHighlightedSVG = () => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(maleSvgContent, "image/svg+xml");
        const svgElement = svgDoc.documentElement.cloneNode(true) as SVGElement;

        // Apply styles to SVG for PDF
        svgElement.setAttribute("width", "300");
        svgElement.setAttribute("height", "400");
        svgElement.style.backgroundColor = "white";

        // Get affected SVG parts
        const getAffectedSvgParts = (): string[] => {
          const svgParts: string[] = [];
          healthAnalysis.affectedBodyParts.forEach((part) => {
            const mappedParts = bodyPartMapping[part];
            if (mappedParts) {
              svgParts.push(...mappedParts);
            }
          });
          return [...new Set(svgParts)]; // Remove duplicates
        };

        // Hide all parts initially
        const allParts = svgElement.querySelectorAll(".part");
        allParts.forEach((part) => {
          part.setAttribute("style", "display: none;");
        });

        // Show and highlight affected parts
        const affectedSvgParts = getAffectedSvgParts();
        affectedSvgParts.forEach((partId) => {
          const parts = svgElement.querySelectorAll(`[data-part="${partId}"]`);
          parts.forEach((part) => {
            part.setAttribute(
              "style",
              "display: block; fill: #ef4444; fill-opacity: 0.7;"
            );
          });
        });

        return svgElement;
      };

      const svgElement = createHighlightedSVG();
      
      // Clear previous content and add new SVG
      svgRef.current.innerHTML = "";
      svgRef.current.appendChild(svgElement);

      // Create data URL from SVG for snapshot
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);
      
      // Convert to image data URL
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 300;
        canvas.height = 400;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, 300, 400);
          const dataUrl = canvas.toDataURL("image/png", 0.95);
          setSvgDataUrl(dataUrl);
        }
        URL.revokeObjectURL(url);
      };
      img.src = url;
    }
  }, [healthAnalysis]);

  /**
   * Renders health tips as a clean list for PDF (first 2 only)
   */
  const renderHealthTips = (): JSX.Element => {
    if (!healthAnalysis || healthAnalysis.healthTips.length === 0) {
      return (
        <p style={{
          color: "#6b7280", // gray-500
          fontSize: "14px",
          margin: "0",
          fontStyle: "italic",
        }}>
          No specific health concerns identified based on your chart configuration.
        </p>
      );
    }

    // Show only first 2 tips to avoid overflow
    const tipsToShow = healthAnalysis.healthTips.slice(0, 2);

    return (
      <div style={{ 
        margin: "0", 
        padding: "0",
      }}>
        {tipsToShow.map((tip, index) => (
          <div 
            key={index} 
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
          Decode your body&apos;s energetic blueprint — where vitality flows and where it breaks down.
        </p>
      </div>

      {/* SVG/Body Diagram Row */}
      <div style={{ 
        marginBottom: "32px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        {svgDataUrl ? (
          <img
            src={svgDataUrl}
            alt="Health Analysis Body Diagram"
            style={{
              maxWidth: "300px",
              maxHeight: "400px",
              borderRadius: "8px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              display: "block",
            }}
          />
        ) : (
          <div style={{
            width: "300px",
            height: "400px",
            backgroundColor: "#f3f4f6", // gray-100
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#6b7280", // gray-500
            fontSize: "14px",
          }}>
            Generating health diagram...
          </div>
        )}
      </div>

      {/* Hidden SVG container for processing */}
      <div 
        ref={svgRef} 
        style={{ 
          position: "absolute", 
          left: "-9999px", 
          top: "-9999px" 
        }} 
      />

      {/* Content Section */}
      <div style={{ marginBottom: "32px" }}>
        {/* Analysis Summary */}
        <div style={{ marginBottom: "24px" }}>
          <h3 style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1f2937", // gray-800
            marginBottom: "12px",
            margin: "0 0 12px 0",
          }}>
            Health Analysis Summary
          </h3>
          
          {healthAnalysis && (
            <div style={{ marginBottom: "16px" }}>
              <p style={{
                fontSize: "14px",
                color: "#374151", // gray-700
                lineHeight: "1.6",
                margin: "0 0 8px 0",
              }}>
                <strong>Stars analyzed:</strong> {healthAnalysis.starsInHealthPalace.join(", ") || "No stars found"}
              </p>
              <p style={{
                fontSize: "14px",
                color: "#374151", // gray-700
                lineHeight: "1.6",
                margin: "0 0 8px 0",
              }}>
                <strong>Affected areas:</strong> {healthAnalysis.affectedBodyParts.length > 0 ? healthAnalysis.affectedBodyParts.join(", ") : "No specific areas highlighted"}
              </p>
              {healthAnalysis.usedParentsPalace && (
                <p style={{
                  fontSize: "12px",
                  color: "#6b7280", // gray-500
                  fontStyle: "italic",
                  margin: "0",
                }}>
                  * Analysis based on Parents Palace due to empty Health Palace
                </p>
              )}
            </div>
          )}
        </div>

        {/* Health Tips Section */}
        <div>
          <h3 style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#1f2937", // gray-800
            marginBottom: "16px",
            margin: "0 0 16px 0",
          }}>
            Health Insights & Tips
          </h3>
          
          {renderHealthTips()}

          {/* Continuation Notice */}
          {healthAnalysis && healthAnalysis.healthTips.length > 2 && (
            <div style={{
              marginTop: "24px",
              padding: "12px 16px",
              backgroundColor: "#f3f4f6", // gray-100
              borderRadius: "6px",
              border: "1px solid #d1d5db", // gray-300
              textAlign: "center",
            }}>
              <p style={{
                fontSize: "14px",
                color: "#6b7280", // gray-500
                fontStyle: "italic",
                margin: "0",
              }}>
                Additional health insights continued on next page...
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfHealth; 