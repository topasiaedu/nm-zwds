import { ChartData, Palace, Transformation } from "../types";
import { DESTINY_ALERT_CONSTANTS } from "../analysis_constants/destiny_alert";

/**
 * Type definition for processed palace alert data
 */
export type PalaceAlertData = {
  palace: string;
  transformation: string;
  description: string;
  quote: string;
  palaceNumber: number;
};

/**
 * Type definition for the analysis result
 */
export type DestinyAlertAnalysisResult = {
  alerts: PalaceAlertData[];
  debugInfo?: {
    transformationsFound: Record<string, { star: string; palace: number }>;
    palacesChecked: number;
  };
};

/**
 * Maps transformation Chinese characters to the keys used in DESTINY_ALERT_CONSTANTS
 */
const TRANSFORMATION_KEY_MAP: Record<string, string> = {
  "化祿": "化禄", // Traditional to simplified mapping
  "化權": "化权", // Traditional to simplified mapping
  "化科": "化科",
  "化忌": "化忌",
};

/**
 * Maps palace names to their English names in DESTINY_ALERT_CONSTANTS
 */
const PALACE_NAME_TO_ENGLISH: Record<string, string> = {
  "命宫": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "财帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "迁移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Wellbeing Palace",
  "父母": "Parents Palace",
  // Add variations without 宫
  "命": "Life Palace",
  "兄弟宫": "Siblings Palace",
  "夫妻宫": "Spouse Palace",
  "子女宫": "Children Palace",
  "财帛宫": "Wealth Palace",
  "疾厄宫": "Health Palace",
  "迁移宫": "Travel Palace",
  "交友宫": "Friends Palace",
  "官禄宫": "Career Palace",
  "田宅宫": "Property Palace",
  "福德宫": "Wellbeing Palace",
  "父母宫": "Parents Palace",
};

/**
 * Extracts quote and description from the full description text
 * Quote is the last sentence (after the last full stop), description is everything else
 */
const processDescription = (fullDescription: string): { description: string; quote: string } => {
  // Split by full stops and filter out empty sentences
  const sentences = fullDescription.split('.').filter(sentence => sentence.trim() !== "");
  
  if (sentences.length === 0) {
    return { description: "", quote: "" };
  }
  
  if (sentences.length === 1) {
    return { description: "", quote: sentences[0].trim() + "." };
  }
  
  // Last sentence is the quote, everything else is description
  const quote = sentences[sentences.length - 1].trim() + ".";
  const description = sentences.slice(0, -1).join(". ").trim() + ".";
  
  return { description, quote };
};

/**
 * Finds which palace contains a star with the given transformation
 */
const findPalaceWithTransformation = (
  palaces: Palace[], 
  transformation: Transformation
): { palace: Palace; starName: string } | null => {
  for (const palace of palaces) {
    // Check all star arrays in the palace
    const allStars = [
      ...(palace.mainStar || []),
      ...(palace.bodyStar ? [palace.bodyStar] : []),
      ...palace.minorStars,
      ...palace.auxiliaryStars,
      ...palace.yearStars,
      ...palace.monthStars,
      ...palace.dayStars,
      ...palace.hourStars,
      ...(palace.lifeStar ? [palace.lifeStar] : []),
    ];

    for (const star of allStars) {
      if (star.transformations && star.transformations.includes(transformation)) {
        return { palace, starName: star.name };
      }
    }
  }
  
  return null;
};

/**
 * Analyzes chart data to extract destiny alert information
 */
export const analyzeDestinyAlert = (chartData: ChartData): DestinyAlertAnalysisResult => {
  const alerts: PalaceAlertData[] = [];
  const debugInfo = {
    transformationsFound: {} as Record<string, { star: string; palace: number }>,
    palacesChecked: chartData.palaces.length,
  };

  // Process each transformation type
  const transformations: Transformation[] = ["化祿", "化權", "化科", "化忌"];
  
  for (const transformation of transformations) {
    const result = findPalaceWithTransformation(chartData.palaces, transformation);
    
    if (result) {
      const { palace, starName } = result;
      const palaceNumber = palace.number;
      
      // Store debug info
      debugInfo.transformationsFound[transformation] = {
        star: starName,
        palace: palaceNumber,
      };
      
      // Get the English name for the palace
      const englishName = PALACE_NAME_TO_ENGLISH[palace.name];
      if (!englishName) {
        console.warn(`No English name mapping found for palace: ${palace.name}`);
        continue;
      }
      
      // Find the palace constant by matching the English name
      const palaceConstant = Object.values(DESTINY_ALERT_CONSTANTS).find(
        constant => constant.english_name === englishName
      );
      
      if (palaceConstant) {
        const transformationKey = TRANSFORMATION_KEY_MAP[transformation];
        const alertData = palaceConstant.alerts[transformationKey as keyof typeof palaceConstant.alerts];
        
        if (alertData) {
          const { description, quote } = processDescription(alertData.description);
          
          alerts.push({
            palace: palaceConstant.english_name,
            transformation,
            description,
            quote,
            palaceNumber,
          });
        }
      }
    }
  }

  return {
    alerts,
    debugInfo,
  };
};

/**
 * Gets debug information for troubleshooting
 */
export const getDestinyAlertDebugInfo = (chartData: ChartData): Record<string, any> => {
  return {
    totalPalaces: chartData.palaces.length,
    lifePalace: chartData.lifePalace,
    transformations: chartData.transformations,
    palaceNames: chartData.palaces.map((p, index) => ({
      number: p.number,
      name: p.name,
      hasMainStar: !!(p.mainStar && p.mainStar.length > 0),
      transformedStars: chartData.palaces[index].mainStar?.filter(s => s.transformations && s.transformations.length > 0) || [],
    })),
  };
}; 