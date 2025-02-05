import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
} from "react";
import { useLanguage } from "../context/LanguageContext"; // Import existing Language Context
import * as zh from "../constants/zh"; // Import Chinese constants
import * as pinyin from "../constants/en";
import { useProfileContext } from "./ProfileContext";

// Define the structure of the ZiWei context data
interface ZiWeiData {
  year: number | null;
  month: number | null;
  day: number | null;
  hour: string | null;
  gender: string | null;
  fiveElement: string;
  shengXiao: string;
  daShianData: Record<number, string>;
  palaceData: { palaceName: string; heavenlyStem: string }[];
}

// Define the context structure
interface ZiWeiContextType {
  data: ZiWeiData;
  computeZiWei: () => void;
}

// Create the context with default values
const ZiWeiContext = createContext<ZiWeiContextType | undefined>(undefined);

// ZiWei Provider component
export const ZiWeiProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { language } = useLanguage(); // Get language from the LanguageContext
  const [data, setData] = useState<ZiWeiData>({
    year: null,
    month: null,
    day: null,
    hour: null,
    gender: null,
    fiveElement: "",
    shengXiao: "",
    daShianData: {},
    palaceData: [],
  });

  const { currentProfile } = useProfileContext();

  useEffect(() => {
    computeZiWei();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile]); // Automatically recompute when profile changes

  // Function to dynamically get the correct language constants
  const getConstants = () => (language === "zh" ? zh : pinyin);

  // Function to compute Zi Wei Dou Shu
  const computeZiWei = () => {
    const constants = getConstants();
    // Ensure birthday is a valid string before parsing
    const birthdayString = currentProfile?.birthday ?? "";
    const date = birthdayString ? new Date(birthdayString) : null;

    if (!date || isNaN(date.getTime())) {
      console.error("Invalid birthday format in profile.");
      return null;
    }

    // Extract date parts
    const year = parseInt(date.getFullYear().toString())
    const month = parseInt((date.getMonth() + 1).toString().padStart(2, "0"))
    const day =parseInt( date.getDate().toString().padStart(2, "0"))
    // Ensure hour and gender exist
    const hour = currentProfile?.birth_time
      ? currentProfile.birth_time.toString().padStart(2, "0")
      : "00";
    const gender = currentProfile?.gender || "unknown";

    if (!year || !month || !day || !hour || !gender) return;

    const heavenlyStemIndex = (year - 4) % 10;
    const earthlyBranchIndex = (year - 4) % 12;

    // Calculate ShengXiao (Zodiac)
    const shengXiao = constants.ShengXiaoGB[earthlyBranchIndex];

    // Compute Five Element Cycle
    const fiveElementIndex = heavenlyStemIndex % 5;
    const fiveElement = constants.FiveElements[fiveElementIndex];

    // Compute Da Shian Data (Major Fate Cycles)
    const daShianData = getDaShian(year, gender, fiveElement);

    // Compute 12 Palaces Data
    const palaceData = computePalaceData(year, heavenlyStemIndex, constants);

    setData({
      year,
      month,
      day,
      hour,
      gender,
      fiveElement,
      shengXiao,
      daShianData,
      palaceData,
    });
  };

  // Compute Da Shian (Major Fate Cycle)
  const getDaShian = (
    year: number,
    gender: string,
    fiveElement: string
  ): Record<number, string> => {
    const constants = getConstants();
    const baseYearString = constants.year_to_stem_branch[year] || "0"; // Ensure a valid default value

    // Convert baseYear to a number (handling cases where it might be a string)
    const baseYear = parseInt(baseYearString, 10) || 0;

    const isMale = gender === "M";
    const direction = (year % 2) + (isMale ? 1 : 0);
    const daShian: Record<number, string> = {};

    for (let i = 0; i < 12; i++) {
      const cycleStart =
        direction === 1 ? baseYear + i * 10 : (baseYear - i * 10 + 120) % 120;

      daShian[i + 1] = `${cycleStart} - ${cycleStart + 9}`;
    }

    return daShian;
  };

  // Compute the 12 Palaces Data
  const computePalaceData = (
    year: number,
    heavenlyStemIndex: number,
    constants: typeof zh
  ) => {
    return constants.EarthlyBranches.map((branch, i) => ({
      palaceName: branch,
      heavenlyStem:
        constants.HeavenlyStems[
          ((heavenlyStemIndex % 5) * 2 + (i < 2 ? i + 2 : i)) % 10
        ],
    }));
  };

  // Memoize the context value
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const value = useMemo(() => ({ data, computeZiWei }), [data, language]);

  // Compute Zi Wei when language changes
  useEffect(() => {
    computeZiWei();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]); // Automatically recompute when language changes

  return (
    <ZiWeiContext.Provider value={value}>{children}</ZiWeiContext.Provider>
  );
};

// Custom Hook for easy access
export const useZiWei = (): ZiWeiContextType => {
  const context = useContext(ZiWeiContext);
  if (!context) {
    throw new Error("useZiWei must be used within a ZiWeiProvider");
  }
  return context;
};
