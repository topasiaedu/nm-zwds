import React from "react";
import { Tilt } from "react-tilt";
import { ChartData } from "../../utils/zwds/types";
import { analyzeDestinyAlert } from "../../utils/zwds/analysis";

/**
 * Type definition for Tilt options
 */
type TiltOptions = {
  scale: number;
  speed: number;
  max: number;
  glare: boolean;
  "max-glare": number;
};

/**
 * Props for the FourKeyPalace component
 */
type FourKeyPalaceProps = {
  chartData: ChartData;
};

/**
 * FourKeyPalace component displaying four palace cards with transformation data
 */
const FourKeyPalace: React.FC<FourKeyPalaceProps> = ({ chartData }) => {
  // Analyze the chart data to get real destiny alert data
  const analysisResult = analyzeDestinyAlert(chartData);
  


  // Tilt options for the cards
  const tiltOptions: TiltOptions = {
    scale: 1.05,
    speed: 1000,
    max: 10,
    glare: true,
    "max-glare": 0.5,
  };

  /**
   * Extracts the Chinese character without the "hua" part
   */
  const getTransformationChar = (transformation: string): string => {
    // Extract the second character (index 1) from the transformation
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
        return "text-green-600 dark:text-green-500";
      case "權": // Traditional
      case "权": // Simplified
        return "text-blue-600 dark:text-blue-500";
      case "科":
        return "text-yellow-600 dark:text-yellow-500";
      case "忌":
        return "text-red-600 dark:text-red-500";
      default:
        return "text-gray-600 dark:text-gray-500";
    }
  };

  /**
   * Gets the border highlight color for a transformation
   */
  const getHighlightColor = (transformation: string): string => {
    const char = getTransformationChar(transformation);
    switch (char) {
      case "祿": // Traditional
      case "禄": // Simplified
        return "border-green-200 dark:border-green-900 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20";
      case "權": // Traditional
      case "权": // Simplified
        return "border-blue-200 dark:border-blue-900 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20";
      case "科":
        return "border-yellow-200 dark:border-yellow-900 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-950/20";
      case "忌":
        return "border-red-200 dark:border-red-900 bg-gradient-to-br from-white to-red-50 dark:from-gray-800 dark:to-red-950/20";
      default:
        return "border-gray-200 dark:border-gray-700";
    }
  };

  // If no alerts found, show a fallback message
  if (analysisResult.alerts.length === 0) {
    return (
      <div className="p-6 dark:bg-gray-900">
        {/* Divider */}
        <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

        {/* Title */}
        <h2 className="text-4xl mb-2 dark:text-white text-center font-bold">
          DESTINY ALERT MAP
        </h2>

        {/* Subtitle */}
        <p className="text-lg mb-6 dark:text-white text-center italic">
          Where your life force is thriving — and where it&apos;s sending warning signals.
        </p>

        {/* Fallback message */}
        <div className="text-center p-8">
          <p className="text-gray-600 dark:text-gray-400">
            No transformation data available. Please ensure your chart data is properly calculated.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider */}
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      {/* Title */}
      <h2 className="text-4xl mb-2 dark:text-white text-center font-bold">
        DESTINY ALERT MAP
      </h2>

      {/* Subtitle */}
      <p className="text-lg mb-6 dark:text-white text-center italic">
        Where your life force is thriving — and where it&apos;s sending
        warning signals.
      </p>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {analysisResult.alerts.map((alert, index) => (
          <Tilt key={`${alert.palaceNumber}-${alert.transformation}`} options={tiltOptions} className="w-full h-full max-h-[500px]">
            <div
              className={`relative rounded-lg shadow-md overflow-hidden border-2 ${getHighlightColor(
                alert.transformation
              )} h-full flex flex-col`}>
              {/* Background transformation character */}
              <div className="absolute inset-0 pointer-events-none z-0">
                <div className="flex items-end justify-end h-full">
                  <div className="opacity-[0.08] dark:opacity-[0.05] transform scale-[3] mr-2 mb-2">
                    <span
                      className={`text-6xl font-bold ${getTransformationColor(
                        alert.transformation
                      )}`}>
                      {getTransformationChar(alert.transformation)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 relative z-10 flex flex-col h-full">
                {/* Palace name header */}
                <div className="flex justify-between items-center mb-4 flex-shrink-0">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    {alert.palace}
                  </h3>
                </div>

                {/* Quote with strong emphasis */}
                {alert.quote && (
                  <blockquote className="text-xl italic font-semibold text-gray-700 dark:text-gray-300 pl-4 py-2 mb-4 text-center relative flex-shrink-0">
                    <span className="absolute top-0 left-0 text-5xl text-purple-400/30 dark:text-purple-500/20 leading-none font-serif">
                      &ldquo;
                    </span>
                    <span className="relative z-10">{alert.quote}</span>
                    <span className="absolute bottom-0 right-4 text-5xl text-purple-400/30 dark:text-purple-500/20 leading-none font-serif">
                      &rdquo;
                    </span>
                  </blockquote>
                )}

                {/* Description with flexible height and hidden scrollbar */}
                <div 
                  className="text-gray-600 dark:text-gray-400 text-sm description-container flex-1 overflow-y-auto">
                  {alert.description ? (
                    // Split description by double line breaks to create paragraphs
                    alert.description.split('\n\n').map((paragraph, pIndex) => (
                      <p key={pIndex} className={pIndex > 0 ? "mt-3" : ""}>
                        {paragraph.trim()}
                      </p>
                    ))
                  ) : (
                    <p>No description available for this transformation.</p>
                  )}
                </div>
              </div>
            </div>
          </Tilt>
        ))}
      </div>

      {/* Add CSS to hide scrollbars for different browsers */}
      <style dangerouslySetInnerHTML={{ __html: `
        .description-container::-webkit-scrollbar {
          display: none;
        }
        .description-container {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
};

export default FourKeyPalace;
