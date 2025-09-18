import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Tilt } from "react-tilt";
// import { useLanguage } from "../context/LanguageContext";
import { useProfileContext } from "../context/ProfileContext";
import { ChartSettingsProvider } from "../context/ChartSettingsContext";
import PageTransition from "../components/PageTransition";
import ZWDSChart from "../components/zwds/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartData } from "../utils/zwds/types";
// import { TIMING_CHART_ANALYSIS_CONSTANTS } from "../utils/zwds/analysis_constants/timing_chart_analysis";
import { getCycleActivations } from "../utils/zwds/decade_cycle_analysis/activation_utils";
import { mapDaMingTagToCycleKey, getDaMingMeaningsForPalace } from "../utils/zwds/decade_cycle_analysis/daming_utils";

/**
 * Interface for timing cycle data
 */
interface TimingCycle {
  startAge: number;
  endAge: number;
  simulatedAge: number;
  palaceNumber: number;
  title: string;
  palaceName: string;
}

// Removed PALACE_CATEGORIES as category display was removed

/**
 * Da Ming tag to palace name mapping (correct order)
 */
const DA_MING_TO_PALACE_MAP: Record<string, string> = {
  "Da Ming": "Life Palace",
  "Da Xiong": "Siblings Palace", 
  "Da Fu": "Spouse Palace", // This is the first Da Fu (index 2)
  "Da Zi": "Children Palace",
  "Da Cai": "Wealth Palace",
  "Da Ji": "Health Palace",
  "Da Qian": "Travel Palace",
  "Da You": "Friends Palace",
  "Da Guan": "Career Palace",
  "Da Tian": "Property Palace",
  // Note: We need to handle the duplicate Da Fu tags by index
};

/**
 * Da Ming tag to Chinese character mapping
 */
// Display helpers trimmed to keep only used utilities.

/**
 * Opposite palace mapping for empty palaces
 */
const OPPOSITE_PALACE_MAP: Record<string, string> = {
  "Life": "Travel",
  "Travel": "Life",
  "Siblings": "Friends",
  "Friends": "Siblings",
  "Spouse": "Career",
  "Career": "Spouse",
  "Children": "Property",
  "Property": "Children",
  "Wealth": "Wellbeing",
  "Wellbeing": "Wealth",
  "Health": "Parents",
  "Parents": "Health"
};

/**
 * Da Ming tag categories for palace grouping
 */
const DA_MING_CATEGORIES: Record<string, string[]> = {
  "Relationship Palaces": ["Da Ming", "Da Xiong", "Da Fu (大夫)", "Da Zi", "Da You", "Da Fu (大父)"],
  "Prosperity Palaces": ["Da Cai", "Da Guan"], 
  "Environmental Palaces": ["Da Ji", "Da Qian", "Da Tian", "Da Fu (大福)"]
};

/**
 * Palace name to English mapping
 */
const PALACE_NAME_MAP: Record<string, string> = {
  "命宫": "Life",
  "兄弟": "Siblings", 
  "夫妻": "Spouse",
  "子女": "Children",
  "财帛": "Wealth",
  "疾厄": "Health",
  "迁移": "Travel",
  "交友": "Friends",
  "官禄": "Career",
  "田宅": "Property",
  "福德": "Wellbeing",
  "父母": "Parents"
};

// Removed getPalaceCategory function as category display was removed

/**
 * Type for activation data
 */
// ActivationData interface removed as mock data was removed.

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
 * Gets the romanized name for a transformation
 */
const getTransformationName = (transformation: string): string => {
  const char = getTransformationChar(transformation);
  switch (char) {
    case "祿": // Traditional
    case "禄": // Simplified
      return "Lu";
    case "權": // Traditional
    case "权": // Simplified
      return "Quan";
    case "科":
      return "Ke";
    case "忌":
      return "Ji";
    default:
      return "Unknown";
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

/**
 * Split a paragraph into two parts based on sentence count
 */
const splitParagraphInHalf = (text: string): { firstHalf: string; secondHalf: string } => {
  // Split by sentence endings (., !, ?) but keep the punctuation
  const sentences = text.match(/[^.!?]*[.!?]+/g) || [text];
  
  if (sentences.length <= 1) {
    return { firstHalf: text, secondHalf: "" };
  }
  
  const midPoint = Math.ceil(sentences.length / 2);
  const firstHalf = sentences.slice(0, midPoint).join(" ").trim();
  const secondHalf = sentences.slice(midPoint).join(" ").trim();
  
  return { firstHalf, secondHalf };
};

/**
 * Get emoji icon for each palace type
 */
const getPalaceIcon = (palaceName: string): React.ReactNode => {
  // Map English palace names to image filenames in src/assets/palace
  const map: Record<string, string> = {
    "Life Palace": "Life.png",
    "Siblings Palace": "Siblings.png",
    "Spouse Palace": "Spouse.png",
    "Children Palace": "Children.png",
    "Wealth Palace": "Wealth.png",
    "Health Palace": "Health.png",
    "Travel Palace": "Travel.png",
    "Friends Palace": "Friends.png",
    "Career Palace": "Career.png",
    "Property Palace": "Property.png",
    "Wellbeing Palace": "Wellbeing.png",
    "Parents Palace": "Parents.png",
  };
  const filename = map[palaceName];
  if (!filename) {
    return <span className="text-2xl">?</span>;
  }
  // Use public path resolution via import; fallback to img tag with relative path
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  try {
    const src = require("../assets/palace/" + filename);
    return <img src={src} alt={palaceName} className="w-28 h-28 object-contain opacity-90" />;
  } catch (e) {
    return <img src={`../assets/palace/${filename}`} alt={palaceName} className="w-28 h-28 object-contain opacity-90" />;
  }
};

/**
 * Get mock activations for demonstration (randomly picks 4 palaces with transformations)
 */
// Removed mock activations. Real data is provided via getCycleActivations.

/**
 * Get Da Ming tag for a palace number relative to the cycle's selected palace
 */
const getDaMingTag = (selectedPalace: number, targetPalace: number): string => {
  const PALACE_TAGS_EN = ["Da Ming", "Da Xiong", "Da Fu (大夫)", "Da Zi", "Da Cai", "Da Ji", "Da Qian", "Da You", "Da Guan", "Da Tian", "Da Fu (大福)", "Da Fu (大父)"];
  
  // Calculate the anticlockwise distance from the selected palace
  let tagIndex = (selectedPalace - targetPalace) % 12;
  if (tagIndex < 0) tagIndex += 12;
  
  return PALACE_TAGS_EN[tagIndex];
};

/**
 * Get the correct palace name for a Da Ming tag, handling duplicate Da Fu cases
 */
const getPalaceNameForDaMingTag = (daMingTag: string, tagIndex: number): string => {
  if (daMingTag.startsWith("Da Fu")) {
    // Handle the three Da Fu cases based on Chinese characters
    if (daMingTag.includes("大夫")) return "Spouse Palace"; // 大夫
    if (daMingTag.includes("大福")) return "Wellbeing Palace"; // 大福  
    if (daMingTag.includes("大父")) return "Parents Palace"; // 大父
  }
  return DA_MING_TO_PALACE_MAP[daMingTag] || daMingTag;
};

/**
 * Get category for a Da Ming tag, handling duplicate Da Fu cases
 */
const getCategoryForDaMingTag = (daMingTag: string, tagIndex: number): string => {
  for (const [category, tags] of Object.entries(DA_MING_CATEGORIES)) {
    if (tags.includes(daMingTag)) {
      return category;
    }
  }
  return "Unknown Category";
};

/**
 * Get Chinese character for Da Ming tag, handling duplicate Da Fu cases
 */
// Unused helper removed to reduce bundle and silence lints.

/**
 * Check if palace has no significant stars
 */
const isPalaceEmpty = (palace: any): boolean => {
  return (!palace?.mainStar || palace.mainStar.length === 0) &&
         (!palace?.minorStars || palace.minorStars.length === 0) &&
         (!palace?.auxiliaryStars || palace.auxiliaryStars.length === 0);
};

/**
 * Get stars from opposite palace if current palace is empty
 */
const getEffectiveStars = (palace: any, palaceName: string, chartData: ChartData | null): any => {
  if (!chartData) return palace;
  
  if (isPalaceEmpty(palace)) {
    const oppositePalaceName = OPPOSITE_PALACE_MAP[palaceName];
    if (oppositePalaceName) {
      // Find the opposite palace in chartData
      const oppositePalace = chartData.palaces.find(p => {
        const englishName = PALACE_NAME_MAP[p.name];
        return englishName === oppositePalaceName;
      });
      
      if (oppositePalace && !isPalaceEmpty(oppositePalace)) {
        return oppositePalace;
      }
    }
  }
  
  return palace;
};

/**
 * Timing Chart Page Component
 * 
 * This page displays 12 timing charts, each representing a 10-year cycle
 * from the person's major limits (大限). Each chart highlights the corresponding
 * palace and shows the Da Ming tags for that period.
 */
const TimingChartContent: React.FC = () => {
  // const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { profiles } = useProfileContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [expandedCycles, setExpandedCycles] = useState<Set<number>>(new Set());

  /**
   * Toggle expansion state for a cycle
   */
  const toggleCycleExpansion = useCallback((cycleIndex: number) => {
    setExpandedCycles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(cycleIndex)) {
        newSet.delete(cycleIndex);
      } else {
        newSet.add(cycleIndex);
      }
      return newSet;
    });
  }, []);

  // Find the profile based on the ID
  useEffect(() => {
    if (id && profiles.length > 0) {
      const foundProfile = profiles.find((p) => String(p.id) === String(id));
      setProfile(foundProfile);
      setLoading(false);
    }
  }, [id, profiles]);

  // Calculate chart data when profile is available
  useEffect(() => {
    if (profile) {
      try {
        // Use the same logic as the result page to parse birth time
        // The profile.birth_time is stored as a string like "12:00" or just "12"
        const birthTimeString = profile.birth_time || "12:00";
        const timeMatch = birthTimeString.match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
        let hour = timeMatch ? parseInt(timeMatch[1]) : 12;

        // Convert to 24-hour format if PM
        if (
          timeMatch &&
          timeMatch[3] &&
          timeMatch[3].toUpperCase() === "PM" &&
          hour < 12
        ) {
          hour += 12;
        }
        // Handle 12 AM conversion
        if (
          timeMatch &&
          timeMatch[3] &&
          timeMatch[3].toUpperCase() === "AM" &&
          hour === 12
        ) {
          hour = 0;
        }

        const calculator = new ZWDSCalculator({
          year: new Date(profile.birthday).getFullYear(),
          month: new Date(profile.birthday).getMonth() + 1,
          day: new Date(profile.birthday).getDate(),
          hour: hour,
          gender: profile.gender,
          name: profile.name,
        });
        
        const calculatedData = calculator.calculate();
        setChartData(calculatedData);
      } catch (error) {
        console.error("Error calculating chart data:", error);
      }
    }
  }, [profile]);

  /**
   * Calculate timing cycles from chart data
   */
  const timingCycles = useMemo<TimingCycle[]>(() => {
    if (!chartData) return [];

    const cycles: TimingCycle[] = [];
    
    // Get all palaces with their major limits and sort by start age
    const palacesWithLimits = chartData.palaces
      .filter(palace => palace.majorLimit)
      .map(palace => ({
        number: palace.number,
        name: palace.name,
        startAge: palace.majorLimit!.startAge,
        endAge: palace.majorLimit!.endAge,
      }))
      .sort((a, b) => a.startAge - b.startAge);

    // Create cycles for the first 12 age ranges
    for (let i = 0; i < Math.min(12, palacesWithLimits.length); i++) {
      const palace = palacesWithLimits[i];
      const simulatedAge = Math.floor((palace.startAge + palace.endAge) / 2);
      
      cycles.push({
        startAge: palace.startAge,
        endAge: palace.endAge,
        simulatedAge,
        palaceNumber: palace.number,
        palaceName: palace.name,
        title: `Ages ${palace.startAge}-${palace.endAge} (${palace.name})`,
      });
    }

    return cycles;
  }, [chartData]);

  /**
   * Chart component for timing cycles
   */
  const renderChart = (cycle: TimingCycle, chartData: ChartData) => (
    <ZWDSChart
      chartData={chartData}
      simulatedAge={cycle.simulatedAge}
      selectedDaXianPalace={cycle.palaceNumber}
      disableInteraction={true}
      targetYear={new Date().getFullYear()}
    />
  );

  /**
   * Memoized chart renderer for each timing cycle
   */
  const renderTimingChart = useCallback((cycle: TimingCycle, index: number) => {
    if (!chartData) return null;

    // const palaceCategory = getPalaceCategory(cycle.palaceName); // Removed category display
    const englishPalaceName = PALACE_NAME_MAP[cycle.palaceName] || cycle.palaceName;
    const isExpanded = expandedCycles.has(index);

    return (
      <div key={`timing-${index}`} id={`cycle-${index}`} className="mb-8">
        
        {/* Collapsible Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header Section - Clickable */}
          <button
            onClick={() => toggleCycleExpansion(index)}
            className="w-full p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-inset"
          >
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Left Side: Cycle and Age */}
              <div className="flex items-center gap-3">
                <div className={`transform transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}>
                  <svg className="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Cycle {index + 1}
                </h1>
                <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                  - Age {cycle.startAge}-{cycle.endAge}
                </span>
              </div>
              
              {/* Right Side: Palace Tags */}
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center px-6 py-3 rounded-xl text-xl font-bold bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-lg border-2 border-yellow-300">
                  {englishPalaceName} Palace
                  <span className="ml-2 text-yellow-200 text-base">({cycle.palaceName})</span>
                </div>
              </div>
            </div>
          </button>

          {/* Collapsible Content */}
          {isExpanded && (
            <div className="border-t border-gray-200 dark:border-gray-600">
              {/* Chart Section - Centered with Max Width */}
              <div className="mb-10 flex justify-center p-2 sm:p-6">
                <div className="w-full max-w-[1000px] p-1 sm:p-4" style={{ height: "1000px" }}>
                  <div className="w-full h-full">
                    {renderChart(cycle, chartData)}
                  </div>
                </div>
              </div>

              {/* Analysis Section - Below Chart */}
              <div className="mb-12 px-2 sm:px-6 pb-6">
                <div className="dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 sm:p-8">
                  <div className="flex items-center mb-6">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      Cycle Analysis
                    </h3>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 border-purple-500">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Duration
                      </h4>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {cycle.endAge - cycle.startAge + 1} Years
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 border-blue-500">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Age Range
                      </h4>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {cycle.startAge} - {cycle.endAge}
                      </p>
                    </div>
                    
                    <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 border-green-500">
                      <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Focus Palace
                      </h4>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {englishPalaceName}
                      </p>
                    </div>
                  </div>

                  {/* Activations Section */}
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        Four Activations (Lu, Quan, Ke, Ji)
                      </h4>
                    </div>
                    
                  {/* Activation Cards Grid (single column) */}
                  <div className="grid grid-cols-1 gap-6">
                      {getCycleActivations(chartData, cycle.palaceNumber).map((activation, index) => (
                        <Tilt key={index} options={{ scale: 1.02, speed: 1000, max: 5, glare: true, "max-glare": 0.3 }} className="w-full h-full">
                          <div className={`relative rounded-xl p-6 shadow-lg border-2 ${getHighlightColor(activation.activation)} h-full flex flex-col min-h-[300px] overflow-hidden`}>
                            {/* Background transformation character */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                              <div className="flex items-end justify-end h-full">
                                <div className="opacity-[0.08] dark:opacity-[0.05] transform scale-[3] mr-2 mb-2">
                                  <span
                                    className={`text-6xl font-bold ${getTransformationColor(
                                      activation.activation
                                    )}`}>
                                    {getTransformationChar(activation.activation)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10 h-full flex flex-col">
                              {/* Palace Name Header */}
                              <div className="mb-4 flex-shrink-0">
                                <h5 className="text-lg font-bold text-gray-800 dark:text-white">
                                  {PALACE_NAME_MAP[activation.palaceKey] ? `${PALACE_NAME_MAP[activation.palaceKey]} Palace` : activation.palaceKey} ({getTransformationName(activation.activation)}):
                                </h5>
                              </div>

                              {/* Description */}
                              <div className="text-gray-600 dark:text-gray-300 text-sm flex-1 overflow-y-auto leading-relaxed">
                                {activation.paragraphs && activation.paragraphs.length > 0 ? activation.paragraphs[0] : ""}
                              </div>
                            </div>
                          </div>
                        </Tilt>
                      ))}
                    </div>
                  </div>

                  {/* Palaces Section */}
                  <div className="mb-8">
                    <div className="flex items-center mb-6">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 5a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm0 3a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        12 Palace Analysis
                      </h4>
                    </div>
                    
                    {/* Palace Categories Based on Da Ming Tags */}
                    <div className="space-y-6">
                      {Object.entries(DA_MING_CATEGORIES).map(([categoryName, baseTags]) => {
                        // Get all palaces for this category in this cycle
                        const categoryPalaces: Array<{
                          palaceNumber: number;
                          daMingTag: string;
                          palaceName: string;
                          palace: any;
                          tagIndex: number;
                        }> = [];
                        
                        // Check all 12 palaces to see which ones belong to this category
                        for (let palaceNum = 1; palaceNum <= 12; palaceNum++) {
                          let tagIndex = (cycle.palaceNumber - palaceNum) % 12;
                          if (tagIndex < 0) tagIndex += 12;
                          
                          const daMingTag = getDaMingTag(cycle.palaceNumber, palaceNum);
                          const category = getCategoryForDaMingTag(daMingTag, tagIndex);
                          
                          if (category === categoryName) {
                            const palace = chartData.palaces[palaceNum - 1];
                            const palaceName = getPalaceNameForDaMingTag(daMingTag, tagIndex);
                            
                            categoryPalaces.push({
                              palaceNumber: palaceNum,
                              daMingTag,
                              palaceName,
                              palace,
                              tagIndex
                            });
                          }
                        }
                        
                        // Sort by tag index to maintain consistent order
                        categoryPalaces.sort((a, b) => a.tagIndex - b.tagIndex);
                        
                        return (
                          <div key={categoryName} className="rounded-lg p-2 sm:p-4">
                            <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                              <div className={`w-4 h-4 rounded-full mr-3 ${
                                categoryName === "Relationship Palaces" ? "bg-pink-500" :
                                categoryName === "Prosperity Palaces" ? "bg-yellow-500" :
                                "bg-orange-700"
                              }`}></div>
                              {categoryName}
                              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({categoryPalaces.length} palaces)</span>
                            </h5>
                            
                            {/* Palace Grid (single column) */}
                            <div className="grid grid-cols-1 gap-4">
                              {categoryPalaces.map(({ palaceNumber, daMingTag, palaceName, palace, tagIndex }) => (
                                <div key={palaceNumber} className={`relative rounded-xl p-2 sm:p-4 shadow-lg border-2 overflow-hidden ${
                                  categoryName === "Relationship Palaces" ? 
                                    "border-pink-200 dark:border-pink-800 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-950/20" :
                                  categoryName === "Prosperity Palaces" ? 
                                    "border-yellow-200 dark:border-yellow-800 bg-gradient-to-br from-white to-yellow-50 dark:from-gray-800 dark:to-yellow-950/20" :
                                    "border-orange-300 dark:border-orange-800 bg-gradient-to-br from-white to-orange-50 dark:from-gray-800 dark:to-orange-950/20"
                                }`}>
                                  {/* Background Palace Icon */}
                                  <div className="absolute inset-0 pointer-events-none z-0">
                                    <div className="flex items-end justify-end h-full">
                                      <div className="opacity-[0.08] dark:opacity-[0.05] transform scale-[4] mr-6 mb-6">
                                        <div className={`${
                                          categoryName === "Relationship Palaces" ? "text-pink-500" :
                                          categoryName === "Prosperity Palaces" ? "text-yellow-500" :
                                          "text-orange-700"
                                        }`}>
                                          {getPalaceIcon(palaceName)}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="relative z-10">
                                    {/* Da Ming Tag Header - Enhanced Design */}
                                    <div className="mb-6">
                                      <div className="flex items-center gap-3 mb-3">
                                        <div className={`text-xl font-bold px-5 py-3 rounded-xl shadow-md ${
                                          categoryName === "Relationship Palaces" ? 
                                            "bg-gradient-to-r from-pink-500 to-pink-600 text-white" :
                                          categoryName === "Prosperity Palaces" ? 
                                            "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white" :
                                            "bg-gradient-to-r from-orange-700 to-red-700 text-white"
                                        }`}>
                                          {daMingTag}
                                        </div>
                                        <div className="text-sm bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-600">
                                          {palaceName}
                                        </div>
                                      </div>
                                      
                                      {/* Decorative divider */}
                                      <div className={`h-1 w-full rounded-full bg-gradient-to-r ${
                                        categoryName === "Relationship Palaces" ? 
                                          "from-pink-200 via-pink-400 to-pink-200" :
                                        categoryName === "Prosperity Palaces" ? 
                                          "from-yellow-200 via-yellow-400 to-yellow-200" :
                                          "from-orange-300 via-red-400 to-orange-300"
                                      } opacity-60`}></div>
                                    </div>
                                  
                                    {/* Star Analysis Section (Da Ming → Star paragraphs) */}
                                    <div className="space-y-4">
                                      {(() => {
                                        const effectivePalace = getEffectiveStars(palace, palaceName.replace(" Palace", ""), chartData) as any;
                                        const daMingKey = mapDaMingTagToCycleKey(daMingTag);
                                        const starEntries = daMingKey
                                          ? getDaMingMeaningsForPalace(daMingKey, effectivePalace, 2)
                                          : [];

                                        if (starEntries.length > 0) {
                                          return (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                              {starEntries.map((entry, i) => (
                                                <div key={`${entry.starName}-${i}`} className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow duration-200">
                                                  {/* Star Header with Icon */}
                                                  <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                      </svg>
                                                    </div>
                                                    <h6 className="text-lg font-bold text-gray-800 dark:text-gray-200">{entry.englishStarName}</h6>
                                                  </div>
                                                  
                                                  {/* Main Content */}
                                                  <div className="space-y-4">
                                                    {/* Paragraph with better formatting - Split in half */}
                                                    <div className="relative space-y-3">
                                                      <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-indigo-400 to-purple-400 rounded-full"></div>
                                                      {(() => {
                                                        const fullText = entry.paragraphs && entry.paragraphs.length > 0 ? entry.paragraphs[0] : "";
                                                        const { firstHalf, secondHalf } = splitParagraphInHalf(fullText);
                                                        
                                                        return (
                                                          <div className="pl-4 space-y-3">
                                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                              {firstHalf}
                                                            </p>
                                                            {secondHalf && (
                                                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                                                {secondHalf}
                                                              </p>
                                                            )}
                                                          </div>
                                                        );
                                                      })()}
                                                    </div>
                                                    
                                                    {/* Action Points with Enhanced Design */}
                                                    {entry.actionPoints && entry.actionPoints.length > 0 && (
                                                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                                                        <div className="flex items-center gap-2 mb-3">
                                                          <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                                          </svg>
                                                          <div className="text-sm font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                                            {entry.actionPointsTitle || "Action Points"}
                                                          </div>
                                                        </div>
                                                        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-md p-3">
                                                          <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                                                            {entry.actionPoints.slice(0, 3).map((point, pi) => (
                                                              <li key={pi} className="flex items-start gap-3">
                                                                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0 bg-blue-500"></div>
                                                                <span className="leading-relaxed">{point}</span>
                                                              </li>
                                                            ))}
                                                          </ul>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          );
                                        }

                                        // Fallback: generic narrative if no specific entries
                                        return (
                                          <div>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                                              This period represents a time of quiet preparation and internal development. While major stellar influences may be minimal, this creates space for personal reflection, consolidation of past experiences, and setting foundations for future growth.
                                            </p>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [chartData, expandedCycles, toggleCycleExpansion]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "long", 
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading timing charts...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!profile) {
    return (
      <PageTransition>
        <div className="p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Profile Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The requested profile could not be found.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  if (!chartData || timingCycles.length === 0) {
    return (
      <PageTransition>
        <div className="p-6">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Unable to Calculate Timing Charts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              There was an error calculating the timing analysis for this profile.
            </p>
            <Link
              to={`/result/${profile.id}`}
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              View Main Chart
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="p-2 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Navigation Breadcrumb */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link
                    to="/dashboard"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <Link
                      to={`/result/${profile.id}`}
                      className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                      Chart Result
                    </Link>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-700 dark:text-gray-300">Timing Chart</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>

          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Timing Chart Analysis - {profile.name}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Explore the 10-year cycles (大限) that shape your destiny. Each chart represents a different life phase.
            </p>
            
            {/* Profile Summary */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-lg p-4">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Born:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {formatDate(profile.birthday)}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Gender:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {profile.gender === "male" ? "Male" : "Female"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Total Cycles:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {timingCycles.length}
                  </span>
                </div>
              </div>
            </div>
          </div>



          {/* Timing Charts */}
          <div>
            {timingCycles.map((cycle, index) => renderTimingChart(cycle, index))}
          </div>

          {/* Back to Chart Link */}
          <div className="text-center">
            <Link
              to={`/result/${profile.id}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Main Chart
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

/**
 * TimingChart page wrapper that provides chart settings context
 * so that `ZWDSChart` can consume `useChartSettings` safely.
 */
const TimingChart: React.FC = () => {
  return (
    <ChartSettingsProvider defaultPageType="timing-chart">
      <TimingChartContent />
    </ChartSettingsProvider>
  );
};

export default TimingChart;
