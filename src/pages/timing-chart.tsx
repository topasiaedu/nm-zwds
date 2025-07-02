import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Tilt } from "react-tilt";
import { useLanguage } from "../context/LanguageContext";
import { useProfileContext } from "../context/ProfileContext";
import PageTransition from "../components/PageTransition";
import ZWDSChart from "../components/zwds/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartData } from "../utils/zwds/types";
import { TIMING_CHART_ANALYSIS_CONSTANTS } from "../utils/zwds/analysis_constants/timing_chart_analysis";

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

/**
 * Palace categorization mapping
 */
const PALACE_CATEGORIES: Record<string, string[]> = {
  "Relationship Palaces": ["命宫", "兄弟", "夫妻", "子女", "交友", "父母"],
  "Prosperity Palaces": ["财帛", "官禄"], 
  "Environmental Palaces": ["疾厄", "福德", "迁移", "田宅"]
};

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
const DA_MING_TO_CHINESE_MAP: Record<string, string> = {
  "Da Ming": "命",
  "Da Xiong": "兄", 
  "Da Fu": "夫", // Will be context-specific: 夫 (spouse), 福 (wellbeing), 父 (parents)
  "Da Zi": "子",
  "Da Cai": "财",
  "Da Ji": "疾",
  "Da Qian": "迁",
  "Da You": "友",
  "Da Guan": "官",
  "Da Tian": "田"
};

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
  "Relationship Palaces": ["Da Ming", "Da Xiong", "Da Fu", "Da Zi", "Da You"], // Note: will add "Da Fu" (Parents) dynamically
  "Prosperity Palaces": ["Da Cai", "Da Guan"], 
  "Environmental Palaces": ["Da Ji", "Da Qian", "Da Tian"] // Note: will add "Da Fu" (Wellbeing) dynamically
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

/**
 * Get palace category for a given palace name
 */
const getPalaceCategory = (palaceName: string): string => {
  for (const [category, palaces] of Object.entries(PALACE_CATEGORIES)) {
    if (palaces.includes(palaceName)) {
      return category;
    }
  }
  return "Unknown Category";
};

/**
 * Type for activation data
 */
interface ActivationData {
  name: string;
  description: string;
  quote: string;
  transformation: string;
}

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

/**
 * Get mock activations for demonstration (randomly picks 4 palaces with transformations)
 */
const getMockActivations = (): ActivationData[] => {
  const palaceKeys = Object.keys(TIMING_CHART_ANALYSIS_CONSTANTS);
  const shuffled = [...palaceKeys].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, 4);
  const transformations = ["化禄", "化权", "化科", "化忌"];
  
  return selected.map((key, index) => {
    const data = TIMING_CHART_ANALYSIS_CONSTANTS[key as keyof typeof TIMING_CHART_ANALYSIS_CONSTANTS];
    return {
      name: data.name,
      description: data.description,
      quote: data.quote,
      transformation: transformations[index]
    };
  });
};

/**
 * Get Da Ming tag for a palace number relative to the cycle's selected palace
 */
const getDaMingTag = (selectedPalace: number, targetPalace: number): string => {
  const PALACE_TAGS_EN = ["Da Ming", "Da Xiong", "Da Fu", "Da Zi", "Da Cai", "Da Ji", "Da Qian", "Da You", "Da Guan", "Da Tian", "Da Fu", "Da Fu"];
  
  // Calculate the anticlockwise distance from the selected palace
  let tagIndex = (selectedPalace - targetPalace) % 12;
  if (tagIndex < 0) tagIndex += 12;
  
  return PALACE_TAGS_EN[tagIndex];
};

/**
 * Get the correct palace name for a Da Ming tag, handling duplicate Da Fu cases
 */
const getPalaceNameForDaMingTag = (daMingTag: string, tagIndex: number): string => {
  if (daMingTag === "Da Fu") {
    // Handle the three Da Fu cases based on index
    if (tagIndex === 2) return "Spouse Palace"; // 大夫
    if (tagIndex === 10) return "Wellbeing Palace"; // 大福  
    if (tagIndex === 11) return "Parents Palace"; // 大父
  }
  return DA_MING_TO_PALACE_MAP[daMingTag] || daMingTag;
};

/**
 * Get category for a Da Ming tag, handling duplicate Da Fu cases
 */
const getCategoryForDaMingTag = (daMingTag: string, tagIndex: number): string => {
  if (daMingTag === "Da Fu") {
    if (tagIndex === 2) return "Relationship Palaces"; // Spouse Palace
    if (tagIndex === 10) return "Environmental Palaces"; // Wellbeing Palace  
    if (tagIndex === 11) return "Relationship Palaces"; // Parents Palace
  }
  
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
const getChineseCharForDaMingTag = (daMingTag: string, tagIndex: number): string => {
  if (daMingTag === "Da Fu") {
    if (tagIndex === 2) return "夫"; // Spouse Palace (大夫)
    if (tagIndex === 10) return "福"; // Wellbeing Palace (大福)  
    if (tagIndex === 11) return "父"; // Parents Palace (大父)
  }
  return DA_MING_TO_CHINESE_MAP[daMingTag] || "宮";
};

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
const TimingChart: React.FC = () => {
  const { t } = useLanguage();
  const { id } = useParams<{ id: string }>();
  const { profiles } = useProfileContext();
  const [loading, setLoading] = useState<boolean>(true);
  const [profile, setProfile] = useState<any>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);

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

    const palaceCategory = getPalaceCategory(cycle.palaceName);
    const englishPalaceName = PALACE_NAME_MAP[cycle.palaceName] || cycle.palaceName;

    return (
      <div key={`timing-${index}`}>
        {/* Divider */}
        <div className="border-t-2 border-gray-300 dark:border-gray-600 my-8"></div>
        
        {/* Header Section - One Row */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Left Side: Cycle and Age */}
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Cycle {index + 1}
              </h1>
              <span className="text-lg font-medium text-gray-600 dark:text-gray-400">
                - Age {cycle.startAge}-{cycle.endAge}
              </span>
            </div>
            
            {/* Right Side: Palace Tags */}
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md">
                {palaceCategory.replace(" Palaces", "")}
              </div>
              <div className="inline-flex items-center px-6 py-3 rounded-xl text-xl font-bold bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg border-2 border-purple-300">
                {englishPalaceName} Palace
                <span className="ml-2 text-purple-200 text-base">({cycle.palaceName})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section - Centered with Max Width */}
        <div className="mb-10 flex justify-center">
          <div className="w-full max-w-[1000px] p-4" style={{ height: "1000px" }}>
            <div className="w-full h-full">
              {renderChart(cycle, chartData)}
            </div>
          </div>
        </div>

        {/* Analysis Section - Below Chart */}
        <div className="mb-12">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-8 shadow-lg">
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
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
              
              <div className="bg-white dark:bg-gray-700 rounded-lg p-4 border-l-4 border-yellow-500">
                <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                  Category
                </h4>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {palaceCategory.replace(" Palaces", "")}
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
                  Activations
                </h4>
              </div>
              
              {/* 2x2 Activation Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getMockActivations().map((activation, index) => (
                  <Tilt key={index} options={{ scale: 1.02, speed: 1000, max: 5, glare: true, "max-glare": 0.3 }} className="w-full h-full">
                    <div className={`relative rounded-xl p-6 shadow-lg border-2 ${getHighlightColor(activation.transformation)} h-full flex flex-col min-h-[300px] overflow-hidden`}>
                      {/* Background transformation character */}
                      <div className="absolute inset-0 pointer-events-none z-0">
                        <div className="flex items-end justify-end h-full">
                          <div className="opacity-[0.08] dark:opacity-[0.05] transform scale-[3] mr-2 mb-2">
                            <span
                              className={`text-6xl font-bold ${getTransformationColor(
                                activation.transformation
                              )}`}>
                              {getTransformationChar(activation.transformation)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="relative z-10 h-full flex flex-col">
                        {/* Palace Name Header */}
                        <div className="mb-4 flex-shrink-0">
                          <h5 className="text-lg font-bold text-gray-800 dark:text-white">
                            {activation.name}
                          </h5>
                        </div>

                        {/* Description */}
                        <div className="text-gray-600 dark:text-gray-300 text-sm flex-1 overflow-y-auto leading-relaxed">
                          {activation.description}
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
                  Palace Analysis
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
                    <div key={categoryName} className="bg-white dark:bg-gray-700 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <h5 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                        <div className={`w-4 h-4 rounded-full mr-3 ${
                          categoryName === "Relationship Palaces" ? "bg-pink-500" :
                          categoryName === "Prosperity Palaces" ? "bg-green-500" :
                          "bg-blue-500"
                        }`}></div>
                        {categoryName}
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">({categoryPalaces.length} palaces)</span>
                      </h5>
                      
                      {/* Palace Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {categoryPalaces.map(({ palaceNumber, daMingTag, palaceName, palace, tagIndex }) => (
                          <div key={palaceNumber} className={`relative rounded-xl p-6 shadow-lg border-2 overflow-hidden ${
                            categoryName === "Relationship Palaces" ? 
                              "border-pink-200 dark:border-pink-800 bg-gradient-to-br from-white to-pink-50 dark:from-gray-800 dark:to-pink-950/20" :
                            categoryName === "Prosperity Palaces" ? 
                              "border-green-200 dark:border-green-800 bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-950/20" :
                              "border-blue-200 dark:border-blue-800 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-950/20"
                          }`}>
                            {/* Background Da Ming Character */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                              <div className="flex items-end justify-end h-full">
                                <div className="opacity-[0.06] dark:opacity-[0.04] transform scale-[2.5] mr-4 mb-4">
                                  <span className={`text-8xl font-bold ${
                                    categoryName === "Relationship Palaces" ? "text-pink-500" :
                                    categoryName === "Prosperity Palaces" ? "text-green-500" :
                                    "text-blue-500"
                                  }`}>
                                    {getChineseCharForDaMingTag(daMingTag, tagIndex)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Content */}
                            <div className="relative z-10">
                              {/* Da Ming Tag Header - Main Emphasis */}
                              <div className="flex items-center gap-3 mb-5">
                                <div className={`text-xl font-bold px-5 py-3 rounded-xl shadow-md ${
                                  categoryName === "Relationship Palaces" ? 
                                    "bg-gradient-to-r from-pink-500 to-pink-600 text-white" :
                                  categoryName === "Prosperity Palaces" ? 
                                    "bg-gradient-to-r from-green-500 to-green-600 text-white" :
                                    "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                                }`}>
                                  {daMingTag}
                                </div>
                                <div className="text-sm bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-full shadow-sm border border-gray-200 dark:border-gray-600">
                                  {palaceName}
                                </div>
                              </div>
                            
                            {/* Star Analysis Section */}
                            <div className="space-y-4">
                              {(() => {
                                const effectiveStars = getEffectiveStars(palace, palaceName.replace(" Palace", ""), chartData);
                                const isUsingOppositePalace = effectiveStars !== palace;
                                
                                return (
                                  <>
                                    {/* Main Star Analysis */}
                                    {effectiveStars?.mainStar && effectiveStars.mainStar.length > 0 && (
                                      <div>
                                        <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Primary Influences:</h6>
                                        {effectiveStars.mainStar.map((star: any, index: number) => (
                                          <div key={index} className="mb-3 last:mb-0">
                                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                              <span className="font-medium text-purple-700 dark:text-purple-300">{star.name}</span> brings leadership qualities and determination during this cycle. You&apos;ll find yourself taking charge of important decisions and inspiring others around you. This period emphasizes personal growth through responsibility and achievement.
                                              {star.transformations && star.transformations.length > 0 && (
                                                <span className="block mt-1 text-xs italic">
                                                  Enhanced by {star.transformations.join(", ")} - amplifying your natural abilities and creating opportunities for advancement.
                                                </span>
                                              )}
                                            </p>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                    
                                    {/* Minor Star Analysis */}
                                    {effectiveStars?.minorStars && effectiveStars.minorStars.length > 0 && (
                                      <div>
                                        <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Supporting Influences:</h6>
                                        {effectiveStars.minorStars.slice(0, 2).map((star: any, index: number) => (
                                          <div key={index} className="mb-3 last:mb-0">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                              <span className="font-medium">{star.name}</span> provides subtle but important support in your endeavors. This influence helps you navigate challenges with grace and find creative solutions to complex problems. It encourages patience and strategic thinking.
                                            </p>
                                          </div>
                                        ))}
                                        {effectiveStars.minorStars.length > 2 && (
                                          <p className="text-xs text-gray-500 dark:text-gray-500 italic">
                                            Additional stars: {effectiveStars.minorStars.slice(2).map((s: any) => s.name).join(", ")} also contribute to this period&apos;s energy.
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    
                                    {/* Auxiliary & Time Star Analysis */}
                                    {((effectiveStars?.auxiliaryStars && effectiveStars.auxiliaryStars.length > 0) ||
                                      (effectiveStars?.yearStars && effectiveStars.yearStars.length > 0)) && (
                                      <div>
                                        <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Temporal Influences:</h6>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                          The supporting celestial influences during this period bring opportunities for networking, learning, and expanding your horizons. These energies favor collaboration, education, and building lasting relationships that will benefit your long-term goals.
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* Special Star Analysis */}
                                    {(effectiveStars?.bodyStar || effectiveStars?.lifeStar) && (
                                      <div>
                                        <h6 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-2">Destined Path:</h6>
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                          {effectiveStars.bodyStar && (
                                            <span>Your <span className="font-medium text-indigo-600 dark:text-indigo-400">{effectiveStars.bodyStar.name}</span> influence suggests this is a pivotal period for physical and material manifestation. </span>
                                          )}
                                          {effectiveStars.lifeStar && (
                                            <span>The <span className="font-medium text-violet-600 dark:text-violet-400">{effectiveStars.lifeStar.name}</span> energy indicates significant spiritual or philosophical developments. </span>
                                          )}
                                          This cycle is marked by destiny and important life changes that align with your soul&apos;s purpose.
                                        </p>
                                      </div>
                                    )}
                                    
                                    {/* Default message if no significant stars */}
                                    {(!effectiveStars?.mainStar || effectiveStars.mainStar.length === 0) &&
                                     (!effectiveStars?.minorStars || effectiveStars.minorStars.length === 0) && (
                                      <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 italic leading-relaxed">
                                          This period represents a time of quiet preparation and internal development. While major stellar influences may be minimal, this creates space for personal reflection, consolidation of past experiences, and setting foundations for future growth.
                                        </p>
                                      </div>
                                    )}
                                  </>
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
    );
  }, [chartData]);

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
      <div className="p-6">
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

          {/* Final Divider */}
          <div className="border-t-2 border-gray-300 dark:border-gray-600 my-8"></div>

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

export default TimingChart;
