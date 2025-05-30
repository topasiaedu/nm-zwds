import React, { useState, useEffect, useRef, useMemo } from "react";
import { Badge } from "flowbite-react";
import { ChartData } from "../../utils/zwds/types";
import { 
  generateDestinyCompassData, 
  getDestinyCompassDebugInfo, 
  YearDestinyData 
} from "../../utils/zwds/analysis/destinyCompassAnalysis";

/**
 * Type definition for component props
 */
type DestinyCompassProps = {
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
 * DestinyCompass component showing year predictions in a carousel
 */
const DestinyCompass: React.FC<DestinyCompassProps> = ({ chartData }) => {
  // Generate real destiny compass data
  const destinyData = useMemo(() => {
    try {
      return generateDestinyCompassData(chartData);
    } catch (error) {
      console.error("Error generating destiny compass data:", error);
      return [];
    }
  }, [chartData]);

  // Debug information
  const debugInfo = useMemo(() => {
    return getDestinyCompassDebugInfo(chartData);
  }, [chartData]);

  console.log("Destiny Compass Debug Info:", debugInfo);
  console.log("Destiny Data:", destinyData);

  // Transform destiny data into year cards
  const yearCards: YearCardData[] = useMemo(() => {
    return destinyData.map((yearData: YearDestinyData) => {
      const activations = Object.entries(yearData.activations);
      
      // Helper function to translate transformation types to English
      const getEnglishTransformationType = (transformationType: string): string => {
        const typeMap: { [key: string]: string } = {
          // Full transformation names
          "化科": "Status",
          "化权": "Power", 
          "化權" : "Power",
          "化禄": "Wealth",
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
          "福德宫": "Fortune Palace",
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
          "福德": "Fortune Palace",
          "父母": "Parents Palace",
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
        
        // Debug logging to see what we're trying to translate
        console.log("Original transformationType:", transformationType);
        console.log("Original palaceName:", activation.palaceName);
        
        const englishType = getEnglishTransformationType(transformationType);
        const englishPalace = getEnglishPalaceName(activation.palaceName);
        
        console.log("Translated type:", englishType);
        console.log("Translated palace:", englishPalace);
        
        return {
          text: `${englishPalace}`,
          color: colors[index % colors.length],
        };
      });

      // Create descriptions from the activation descriptions - use full descriptions
      const descriptions = activations.map(([transformationType, activation]) => {
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
  const initialIndex = useMemo(() => {
    const currentYearIndex = yearCards.findIndex(card => card.year === currentYear);
    return currentYearIndex >= 0 ? currentYearIndex : 0;
  }, [yearCards, currentYear]);

  // Current year index state
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [previousIndex, setPreviousIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Effect to handle animation when currentIndex changes
  useEffect(() => {
    if (previousIndex !== currentIndex) {
      const newDirection = previousIndex > currentIndex ? "left" : "right";
      setDirection(newDirection);
      setIsAnimating(true);

      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPreviousIndex(currentIndex);
      }, 300); // Match this with CSS transition duration

      return () => clearTimeout(timer);
    }
  }, [currentIndex, previousIndex]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value);
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
  };

  // Navigate to previous year
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setPreviousIndex(currentIndex);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next year
  const goToNext = () => {
    if (currentIndex < yearCards.length - 1) {
      setPreviousIndex(currentIndex);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get animation classes for main card
  const getMainCardClasses = () => {
    if (!isAnimating) return "transform-none";
    return direction === "left"
      ? "animate-slide-in-right"
      : "animate-slide-in-left";
  };

  // Get animation classes for previous card
  const getPrevCardClasses = () => {
    if (!isAnimating) return "";
    return direction === "left"
      ? "animate-fade-in-left"
      : "animate-fade-out-left";
  };

  // Get animation classes for next card
  const getNextCardClasses = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-fade-in-right"
      : "animate-fade-out-right";
  };

  // Handle empty data
  if (yearCards.length === 0) {
    return (
      <div className="p-6 dark:bg-gray-900">
        <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>
        <h2 className="text-4xl mb-2 font-bold text-center text-gray-800 dark:text-white">
          DESTINY COMPASS
        </h2>
        <p className="text-lg mb-6 dark:text-white text-center italic">
          Unable to generate destiny compass data. Please check your chart calculation.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 dark:bg-gray-900">
      <style>
        {`
         @keyframes slideInRight {
           from { transform: translateX(50px); opacity: 0; }
           to { transform: translateX(0); opacity: 1; }
         }
         
         @keyframes slideInLeft {
           from { transform: translateX(-50px); opacity: 0; }
           to { transform: translateX(0); opacity: 1; }
         }
         
         @keyframes fadeInLeft {
           from { opacity: 0; transform: translateX(-30px); }
           to { opacity: 0.4; transform: translateX(-25%); }
         }
         
         @keyframes fadeOutLeft {
           from { opacity: 0.4; transform: translateX(-25%); }
           to { opacity: 0; transform: translateX(-40px); }
         }
         
         @keyframes fadeInRight {
           from { opacity: 0; transform: translateX(30px); }
           to { opacity: 0.4; transform: translateX(25%); }
         }
         
         @keyframes fadeOutRight {
           from { opacity: 0.4; transform: translateX(25%); }
           to { opacity: 0; transform: translateX(40px); }
         }
         
         .animate-slide-in-right {
           animation: slideInRight 300ms ease-out forwards;
         }
         
         .animate-slide-in-left {
           animation: slideInLeft 300ms ease-out forwards;
         }
         
         .animate-fade-in-left {
           animation: fadeInLeft 300ms ease-out forwards;
         }
         
         .animate-fade-out-left {
           animation: fadeOutLeft 300ms ease-out forwards;
         }
         
         .animate-fade-in-right {
           animation: fadeInRight 300ms ease-out forwards;
         }
         
         .animate-fade-out-right {
           animation: fadeOutRight 300ms ease-out forwards;
         }
        `}
      </style>
      {/* Divider */}
      <div className="w-full border-t border-gray-200 dark:border-gray-700 mb-6"></div>
      <h2 className="text-4xl mb-2 font-bold text-center text-gray-800 dark:text-white">
        DESTINY COMPASS
      </h2>

      {/* Subtitle */}
      <p className="text-lg mb-6 dark:text-white text-center italic">
        Navigate your life path with clarity — see how your chart shifts across
        different years.
      </p>

      {/* Year Navigation Controls */}
      <div className="flex items-center justify-center mb-6">
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 disabled:opacity-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="mx-4 text-center">
          <span className="text-2xl font-bold text-purple-700 dark:text-purple-300">
            {yearCards[currentIndex]?.year}
          </span>
        </div>
        <button
          onClick={goToNext}
          disabled={currentIndex === yearCards.length - 1}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 disabled:opacity-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      {/* Visible Cards Container */}
      <div
        className="relative flex justify-center items-center overflow-hidden"
        ref={carouselRef}>
        {/* Previous Card (Blurred) */}
        {currentIndex > 0 && (
          <div
            className={`absolute left-0 w-48 h-80 opacity-40 scale-85 transform -translate-x-1/4 z-0 ${getPrevCardClasses()}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full p-3 overflow-hidden">
              <div className="text-xl font-bold mb-1 text-gray-700 dark:text-gray-300">
                {yearCards[currentIndex - 1]?.year}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Age {yearCards[currentIndex - 1]?.age}
              </div>
              <div className="flex flex-wrap mb-2">
                {yearCards[currentIndex - 1]?.badges
                  .slice(0, 2)
                  .map((badge, i) => (
                    <Badge
                      key={i}
                      color={badge.color}
                      className="mr-1 mb-1"
                      size="sm">
                      {badge.text}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Card (Focused) */}
        <div
          className={`w-full max-w-2xl transition-all duration-300 ease-in-out z-10 ${getMainCardClasses()}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                  {yearCards[currentIndex]?.year}
                </h3>
              </div>
              <div className="flex flex-wrap justify-end">
                {yearCards[currentIndex]?.badges.map((badge, i) => (
                  <Badge key={i} color={badge.color} className="ml-2 mb-1">
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-6 max-h-[400px] overflow-auto">
              <div className="space-y-4">
                {yearCards[currentIndex]?.description.map((paragraph, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Card (Blurred) */}
        {currentIndex < yearCards.length - 1 && (
          <div
            className={`absolute right-0 w-48 h-80 opacity-40 scale-85 transform translate-x-1/4 z-0 ${getNextCardClasses()}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full p-3 overflow-hidden">
              <div className="text-xl font-bold mb-1 text-gray-700 dark:text-gray-300">
                {yearCards[currentIndex + 1]?.year}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Age {yearCards[currentIndex + 1]?.age}
              </div>
              <div className="flex flex-wrap mb-2">
                {yearCards[currentIndex + 1]?.badges
                  .slice(0, 2)
                  .map((badge, i) => (
                    <Badge
                      key={i}
                      color={badge.color}
                      className="mr-1 mb-1"
                      size="sm">
                      {badge.text}
                    </Badge>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Slider Control */}
      <div className="mt-8 px-4">
        <input
          type="range"
          min="0"
          max={yearCards.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{yearCards[0]?.year} (Age {yearCards[0]?.age})</span>
          <span>{yearCards[Math.floor(yearCards.length / 2)]?.year}</span>
          <span>{yearCards[yearCards.length - 1]?.year} (Age {yearCards[yearCards.length - 1]?.age})</span>
        </div>
      </div>
    </div>
  );
};

export default DestinyCompass;
