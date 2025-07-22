import React, { useMemo } from "react";
import { Badge } from "flowbite-react";
import { ChartData } from "../utils/zwds/types";
import { 
  generateDestinyCompassData, 
  YearDestinyData 
} from "../utils/zwds/analysis/destinyCompassAnalysis";

/**
 * Type definition for component props
 */
type PdfDestinyCompassProps = {
  chartData: ChartData;
};

/**
 * Type definition for a year card data
 */
type YearCardData = {
  year: number;
  age: number;
  badges: {
    text: string;
    color: string;
  }[];
  description: string[];
  activatedPalace: string;
};

/**
 * PdfDestinyCompass component for PDF export - shows only the current year card
 */
const PdfDestinyCompass: React.FC<PdfDestinyCompassProps> = ({ chartData }) => {
  // Generate real destiny compass data
  const destinyData = useMemo(() => {
    try {
      return generateDestinyCompassData(chartData);
    } catch (error) {
      console.error("Error generating destiny compass data:", error);
      return [];
    }
  }, [chartData]);

  // Transform destiny data into year cards
  const yearCards: YearCardData[] = useMemo(() => {
    return destinyData.map((yearData: YearDestinyData) => {
      // Define explicit order for transformations: 禄, 权, 科, 忌
      const transformationOrder = ["化祿", "化權", "化科", "化忌"] as const;
      
      // Create ordered activations array
      const activations = transformationOrder.map(transformationType => [
        transformationType,
        yearData.activations[transformationType]
      ] as const);
      
      // Helper function to translate transformation types to English
      const getEnglishTransformationType = (transformationType: string): string => {
        const typeMap: { [key: string]: string } = {
          // Full transformation names
          "化科": "Status",
          "化权": "Power", 
          "化權" : "Power",
          "化禄": "Wealth",
          "化祿": "Wealth",
          "化忌": "Obstacle",
          // Short forms
          "禄": "Wealth",
          "权": "Authority",
          "科": "Academic", 
          "忌": "Obstacle",
          "化": "",
          // Add more mappings as needed
        };
        return typeMap[transformationType] || transformationType;
      };

      // Helper function to translate palace names to English
      const getEnglishPalaceName = (palaceName: string): string => {
        const palaceMap: { [key: string]: string } = {
          // Full palace names with 宫
          "命宫": "Life Palace",
          "兄弟宫": "Siblings Palace",
          "夫妻宫": "Spouse Palace", 
          "子女宫": "Children Palace",
          "财帛宫": "Wealth Palace",
          "疾厄宫": "Health Palace",
          "迁移宫": "Travel Palace",
          "奴仆宫": "Friends Palace",
          "官禄宫": "Career Palace",
          "田宅宫": "Property Palace",
          "福德宫": "Wellbeing Palace",
          "父母宫": "Parents Palace",
          // Short forms without 宫
          "命": "Life Palace",
          "兄弟": "Siblings Palace", 
          "夫妻": "Spouse Palace",
          "子女": "Children Palace",
          "财帛": "Wealth Palace",
          "疾厄": "Health Palace",
          "迁移": "Travel Palace",
          "奴仆": "Friends Palace",
          "官禄": "Career Palace",
          "田宅": "Property Palace",
          "福德": "Wellbeing Palace",
          "父母": "Parents Palace",
          "交友": "Friends Palace",
          // Other variations
          "父艺": "Parents Palace",
          "子艺": "Children Palace",
          // Add more mappings as needed
        };
        return palaceMap[palaceName] || palaceName;
      };
      
      // Create badges from the four transformations - show palace names in English
      const badges = activations.map(([transformationType, activation], index) => {
        const colors = ["success", "blue", "warning", "failure"];
        
        const englishType = getEnglishTransformationType(transformationType);
        const englishPalace = getEnglishPalaceName(activation.palaceName);
        
        return {
          text: `${englishPalace}`,
          color: colors[index % colors.length],
        };
      });

      // Create descriptions from the activation descriptions - use full descriptions
      const descriptions = activations.map(([transformationType, activation], index) => {
        return activation.description; // Use full description instead of splitting
      });

      return {
        year: yearData.year,
        age: yearData.age,
        badges,
        description: descriptions,
        activatedPalace: yearData.activatedPalace.name,
      };
    });
  }, [destinyData]);

  // Find current year index (closest to current year)
  const currentYear = new Date().getFullYear();
  const currentYearIndex = useMemo(() => {
    const index = yearCards.findIndex(card => card.year === currentYear);
    return index >= 0 ? index : 0;
  }, [yearCards, currentYear]);

  // Get the current year card
  const currentYearCard = yearCards[currentYearIndex];

  // Handle empty data
  if (yearCards.length === 0 || !currentYearCard) {
    return (
      <div style={{ 
        width: "794px", 
        minHeight: "400px", 
        backgroundColor: "white", 
        padding: "30px",
        fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <h2 style={{ 
            fontSize: "32px", 
            fontWeight: "bold", 
            color: "#1f2937",
            marginBottom: "20px",
            borderBottom: "2px solid #e5e7eb",
            paddingBottom: "10px"
          }}>
            DESTINY COMPASS
          </h2>
          <p style={{ 
            fontSize: "16px", 
            color: "#6b7280",
            fontStyle: "italic"
          }}>
            Unable to generate destiny compass data. Please check your chart calculation.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      width: "794px", 
      minHeight: "400px", 
      backgroundColor: "white", 
      padding: "30px",
      fontFamily: "'Inter', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
    }}>
      {/* Header */}
      <div style={{ marginBottom: "30px", textAlign: "center" }}>
        <h2 style={{ 
          fontSize: "32px", 
          fontWeight: "bold", 
          color: "#1f2937",
          marginBottom: "15px",
          borderBottom: "2px solid #e5e7eb",
          paddingBottom: "10px"
        }}>
          DESTINY COMPASS
        </h2>
        <p style={{ 
          fontSize: "16px", 
          color: "#6b7280",
          fontStyle: "italic",
          marginBottom: "20px"
        }}>
          Navigate your life path with clarity — current year insights from your chart.
        </p>
      </div>

      {/* Current Year Card */}
      <div style={{
        width: "100%",
        maxWidth: "700px",
        margin: "0 auto",
        backgroundColor: "white",
        borderRadius: "12px",
        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        overflow: "hidden"
      }}>
        {/* Card Header */}
        <div style={{
          padding: "24px",
          borderBottom: "1px solid #e5e7eb",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#f8fafc"
        }}>
          <div>
            <h3 style={{ 
              fontSize: "28px", 
              fontWeight: "bold", 
              color: "#1f2937",
              margin: "0"
            }}>
              {currentYearCard.year}
            </h3>
            <p style={{
              fontSize: "14px",
              color: "#6b7280",
              margin: "5px 0 0 0"
            }}>
              Age {currentYearCard.age}
            </p>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "flex-end", gap: "8px" }}>
            {currentYearCard.badges.map((badge, i) => (
                             <span
                 key={i}
                 style={{
                   display: "inline-flex",
                   alignItems: "center",
                   justifyContent: "center",
                   padding: "4px 12px 6px 12px",
                   fontSize: "12px",
                   fontWeight: "500",
                   borderRadius: "9999px",
                   backgroundColor: getBadgeColor(badge.color).bg,
                   color: getBadgeColor(badge.color).text,
                   border: `1px solid ${getBadgeColor(badge.color).border}`,
                   lineHeight: "1",
                   height: "24px",
                   minHeight: "24px",
                   boxSizing: "border-box",
                 }}
               >
                 {badge.text}
               </span>
            ))}
          </div>
        </div>

        {/* Card Content */}
        <div style={{ padding: "24px" }}>
          <div style={{ 
            maxHeight: "400px", 
            overflowY: "auto",
            lineHeight: "1.6"
          }}>
            {currentYearCard.description.map((paragraph, i) => (
              <p 
                key={i} 
                style={{ 
                  color: "#374151", 
                  fontSize: "14px",
                  marginBottom: "16px",
                  lineHeight: "1.6"
                }}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Helper function to get badge colors for PDF rendering
 */
const getBadgeColor = (color: string) => {
  const colorMap: { [key: string]: { bg: string; text: string; border: string } } = {
    success: { bg: "#dcfce7", text: "#166534", border: "#bbf7d0" },
    blue: { bg: "#dbeafe", text: "#1e40af", border: "#93c5fd" },
    warning: { bg: "#fef3c7", text: "#d97706", border: "#fcd34d" },
    failure: { bg: "#fee2e2", text: "#dc2626", border: "#fca5a5" },
  };
  return colorMap[color] || colorMap.blue;
};

export default PdfDestinyCompass; 