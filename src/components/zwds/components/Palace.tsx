import React from "react";
import { motion } from "framer-motion";
import { Palace as PalaceType } from "../../../utils/zwds/types";
import { useLanguage } from "../../../context/LanguageContext";
import { translateStarName } from "../utils/helpers";
import ZodiacIcons from "../icons";
import ZodiacIconWrapper from "./ZodiacIconWrapper";

// Map earthly branches to their zodiac animals
const getZodiacIcon = (earthlyBranch: string): React.ElementType | null => {
  const branchToZodiac: Record<string, keyof typeof ZodiacIcons> = {
    子: "rat",
    丑: "ox",
    寅: "tiger",
    卯: "rabbit",
    辰: "dragon",
    巳: "snake",
    午: "horse",
    未: "goat",
    申: "monkey",
    酉: "rooster",
    戌: "dog",
    亥: "pig",
  };

  const zodiacKey = branchToZodiac[earthlyBranch];
  return zodiacKey ? ZodiacIcons[zodiacKey] : null;
};

interface PalaceProps {
  palaceNumber: number;
  palace: PalaceType;
  isSelected: boolean;
  isTargetPalace: boolean;
  transformationType: string | null;
  selectedPalace: number | null;
  targetYear?: number;
  birthYear?: number;
  startingPalaceNumber?: number; // Palace number where annual flow starts
  palaceTag?: string | null; // Tag to display at top right corner
  delay?: number; // Animation delay for staggered entrance
  registerStarRef: (
    palaceNumber: number,
    starName: string,
    element: HTMLDivElement | null
  ) => void;
  handlePalaceClick: (palaceNumber: number) => void;
  palaceRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

/**
 * Component to render a single palace in the ZWDS chart
 */
const Palace: React.FC<PalaceProps> = ({
  palaceNumber,
  palace,
  isSelected,
  isTargetPalace,
  transformationType,
  selectedPalace,
  targetYear = new Date().getFullYear(),
  birthYear = new Date().getFullYear() - 30,
  startingPalaceNumber = 1, // Default to palace 1 if not provided
  palaceTag,
  delay = 0,
  registerStarRef,
  handlePalaceClick,
  palaceRefs,
}) => {
  const { t, language } = useLanguage();

  // Get the appropriate zodiac icon based on earthly branch
  const ZodiacIcon = getZodiacIcon(palace.earthlyBranch);

  // Check if this palace has an annual flow matching the target year
  const showAnnualFlow =
    palace.annualFlow && palace.annualFlow.year === targetYear;

  // Calculate age at the annual flow year if it exists
  const getAgeAtYear = (year: number): number => {
    return year - birthYear + 1;
  };

  // Calculate the year to display for this palace
  const calculateYearForPalace = (): number => {
    // If this is the starting palace (with annual flow), return the target year
    if (palaceNumber === startingPalaceNumber) {
      return targetYear;
    }

    // Calculate how many positions away from the starting palace
    let distance = palaceNumber - startingPalaceNumber;
    if (distance <= 0) {
      distance += 12; // Wrap around for a complete circle of 12 palaces
    }

    // Return the year that is 'distance' years after the target year
    return targetYear + distance;
  };

  // Get the year for this palace
  const palaceYear = calculateYearForPalace();

  // Animation variants for palaces
  const palaceVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: {
      opacity: 1,
      scale: 1,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
    hover: {
      scale: 1.01,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
      transition: {
        duration: 0.2,
      },
    },
    selected: {
      scale: 1.02,
      boxShadow: "0 0 0 2px rgba(79, 70, 229, 0.5)",
      transition: {
        duration: 0.3,
      },
    },
    pulse: {
      scale: [1.02, 1.03, 1.02],
      opacity: 1,
      boxShadow: [
        "0 0 0 2px rgba(79, 70, 229, 0.5)",
        "0 0 0 3px rgba(79, 70, 229, 0.4)",
        "0 0 0 2px rgba(79, 70, 229, 0.5)",
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        opacity: { duration: 0 },
      },
    },
    target: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    reset: {
      opacity: 1,
      scale: 1,
      boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  };

  // Get transformation border color
  let transformationBorderColor = "";
  if (isTargetPalace) {
    switch (transformationType) {
      case "祿":
        transformationBorderColor = "ring-green-500";
        break;
      case "權":
        transformationBorderColor = "ring-blue-500";
        break;
      case "科":
        transformationBorderColor = "ring-yellow-500";
        break;
      case "忌":
        transformationBorderColor = "ring-red-500";
        break;
      default:
        transformationBorderColor = "";
    }
  }

  // Determine gradient background for selected palace
  // Purple to indigo gradient like the main button
  const gradientStyle = isSelected
    ? {
        background:
          "linear-gradient(135deg, rgb(124, 58, 237), rgb(79, 70, 229))",
        backgroundSize: "200% 200%",
      }
    : {};

  // Dark mode gradient
  const darkGradientStyle = isSelected
    ? {
        background:
          "linear-gradient(135deg, rgb(124, 58, 237, 0.8), rgb(79, 70, 229, 0.8))",
        backgroundSize: "200% 200%",
      }
    : {};

  // Choose which style to apply based on color scheme preference
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const selectedStyle = isSelected
    ? isDarkMode
      ? darkGradientStyle
      : gradientStyle
    : {};

  // Define border highlight style for target palaces
  let targetHighlightStyle = {};
  if (isTargetPalace && !isSelected) {
    const borderColor =
      transformationType === "祿"
        ? "rgba(16, 185, 129, 0.7)" // green
        : transformationType === "權"
        ? "rgba(56, 189, 248, 0.85)" // brighter sky blue with higher opacity
        : transformationType === "科"
        ? "rgba(245, 158, 11, 0.7)" // yellow
        : transformationType === "忌"
        ? "rgba(239, 68, 68, 0.7)" // red
        : "rgba(107, 114, 128, 0.7)"; // gray fallback

    targetHighlightStyle = {
      boxShadow: `0 0 0 2px ${borderColor}`,
    };
  }

  // Combine all style properties with proper reset handling
  const combinedStyle = {
    ...selectedStyle,
    ...(isSelected
      ? { boxShadow: "0 0 15px rgba(79, 70, 229, 0.25)" }
      : isTargetPalace
      ? targetHighlightStyle
      : { boxShadow: "none" }), // Explicitly reset boxShadow when not selected or target
    transition: "all 0.3s ease",
  };

  return (
    <motion.div
      key={`palace-${palaceNumber}-${selectedPalace}`}
      className={`relative border border-gray-100 dark:border-gray-700 p-0.5 xs:p-1 sm:p-2 md:p-3 min-h-[70px] xs:min-h-[80px] sm:min-h-[100px] md:min-h-[150px] ${
        isSelected
          ? "bg-indigo-50/80 dark:bg-indigo-900/30 text-white"
          : "bg-white dark:bg-gray-800"
      } flex flex-col rounded-lg shadow-sm cursor-pointer ${
        isSelected
          ? "ring-1 sm:ring-2 ring-indigo-500"
          : isTargetPalace
          ? `ring-1 sm:ring-1 ${transformationBorderColor}`
          : ""
      }`}
      variants={palaceVariants}
      whileHover="hover"
      // Apply the appropriate animation variant based on palace state
      animate={isSelected ? "pulse" : isTargetPalace ? "target" : "visible"}
      initial="hidden"
      style={combinedStyle}
      onClick={() => handlePalaceClick(palaceNumber)}
      ref={(el) => (palaceRefs.current[palaceNumber - 1] = el)}>
      {/* Zodiac icon background */}
      {ZodiacIcon && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07] dark:opacity-[0.15] z-10">
          <ZodiacIconWrapper
            Icon={ZodiacIcon}
            className="w-[85%] h-[85%] xs:w-[80%] xs:h-[80%] sm:w-[75%] sm:h-[75%]"
          />
        </div>
      )}

      {/* Palace Tag (only shown when a palace is selected) */}
      {palaceTag && (
        <div className="absolute top-0.5 xs:top-1 sm:top-2 right-0.5 xs:right-1 sm:right-2 z-30">
          <motion.div
            key={`palace-tag-${selectedPalace}-${palaceNumber}`}
            className={`text-2xs xs:text-xs sm:text-sm font-semibold px-1 py-0.5 rounded-md ${
              isSelected
                ? "bg-white/20 text-white"
                : "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300"
            }`}
            initial={{ opacity: 0, scale: 0.8, y: -5 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: isSelected
                ? [
                    "0 0 0px rgba(255, 255, 255, 0.5)",
                    "0 0 8px rgba(255, 255, 255, 0.3)",
                    "0 0 0px rgba(255, 255, 255, 0.5)",
                  ]
                : [
                    "0 0 0px rgba(79, 70, 229, 0.3)",
                    "0 0 6px rgba(79, 70, 229, 0.2)",
                    "0 0 0px rgba(79, 70, 229, 0.3)",
                  ],
            }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
              delay: delay,
              boxShadow: {
                repeat: Infinity,
                duration: 2,
                ease: "easeInOut",
              },
            }}>
            {palaceTag}
          </motion.div>
        </div>
      )}

      {/* Top left: Main Stars */}
      <div className="absolute top-0.5 xs:top-1 sm:top-2 left-0.5 xs:left-1 sm:left-2 z-30">
        {palace.mainStar && palace.mainStar.length > 0 && (
          <div className="font-medium text-2xs xs:text-xs sm:text-sm">
            {palace.mainStar.map((star, starIndex) => (
              <>
                <div
                  key={starIndex + star.name}
                  className={`mb-0.5 ${
                    isSelected
                      ? "text-white dark:text-white font-semibold"
                      : "text-zinc-800 dark:text-zinc-200 font-semibold"
                  }`}
                  ref={(el) => registerStarRef(palaceNumber, star.name, el)}>
                  {translateStarName(star.name, "mainStars", language, t)}
                </div>
                <div>
                  {star.transformations?.map((transformation, idx) => (
                    <span
                      key={idx}
                      className={`text-2xs xs:text-xs sm:text-sm sm:ml-1 ${
                        isSelected
                          ? transformation === "化祿"
                            ? "text-green-300 font-bold bg-green-500/10 rounded-md px-1 py-0.5"
                            : transformation === "化權"
                            ? "text-blue-300 font-bold bg-blue-500/10 rounded-md px-1 py-0.5" // Brighter cyan instead of blue
                            : transformation === "化科"
                            ? "text-yellow-300 font-bold bg-yellow-500/10 rounded-md px-1 py-0.5"
                            : transformation === "化忌"
                            ? "text-red-300 font-bold bg-red-500/10 rounded-md px-1 py-0.5"
                            : "text-rose-300 font-bold bg-rose-500/10 rounded-md px-1 py-0.5"
                          : transformation === "化祿"
                          ? "text-green-500 bg-green-500/10 rounded-md px-1 py-0.5"
                          : transformation === "化權"
                          ? "text-blue-500 bg-blue-500/10 rounded-md px-1 py-0.5" // Brighter cyan instead of blue
                          : transformation === "化科"
                          ? "text-yellow-500 bg-yellow-500/10 rounded-md px-1 py-0.5"
                          : transformation === "化忌"
                          ? "text-red-500 bg-red-500/10 rounded-md px-1 py-0.5"
                          : "text-rose-500 bg-rose-500/10 rounded-md px-1 py-0.5"
                      }`}>
                      {language === "en" &&
                      t(`zwds.transformations.${transformation}`)
                        ? t(`zwds.transformations.${transformation}`).split(
                            " "
                          )[0]
                        : transformation}
                    </span>
                  ))}
                </div>
              </>
            ))}
          </div>
        )}
        {palace.minorStars.map((star, idx) => (
          <>
            <div
              key={idx}
              className={`text-2xs xs:text-xs sm:text-sm mb-0.5 ${
                isSelected
                  ? "font-medium text-white dark:text-white"
                  : star.brightness === "bright"
                  ? "font-medium text-zinc-700 dark:text-zinc-300"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}
              ref={(el) => registerStarRef(palaceNumber, star.name, el)}>
              {translateStarName(star.name, "minorStars", language, t)}
            </div>
            <div>
              {star.transformations?.map((transformation, tidx) => (
                <span
                  key={tidx}
                  className={`text-2xs xs:text-xs sm:text-sm  sm:ml-1 ${
                    isSelected
                      ? transformation === "化祿"
                        ? "text-green-300 font-bold bg-green-500/10 rounded-md px-1 py-0.5"
                        : transformation === "化權"
                        ? "text-blue-300 font-bold bg-blue-500/10 rounded-md px-1 py-0.5" // Brighter cyan instead of blue
                        : transformation === "化科"
                        ? "text-yellow-300 font-bold bg-yellow-500/10 rounded-md px-1 py-0.5"
                        : transformation === "化忌"
                        ? "text-red-300 font-bold bg-red-500/10 rounded-md px-1 py-0.5"
                        : "text-rose-300 font-bold"
                      : transformation === "化祿"
                      ? "text-green-500 bg-green-500/10 rounded-md px-1 py-0.5"
                      : transformation === "化權"
                      ? "text-blue-500 bg-blue-500/10 rounded-md px-1 py-0.5" // Brighter cyan instead of blue
                      : transformation === "化科"
                      ? "text-yellow-500 bg-yellow-500/10 rounded-md px-1 py-0.5"
                      : transformation === "化忌"
                      ? "text-red-500 bg-red-500/10 rounded-md px-1 py-0.5"
                      : "text-rose-500"
                  }`}>
                  {language === "en" &&
                  t(`zwds.transformations.${transformation}`)
                    ? t(`zwds.transformations.${transformation}`).split(" ")[0]
                    : transformation}
                </span>
              ))}
            </div>
          </>
        ))}
      </div>

      {/* Bottom section with grid layout */}
      <div className="absolute bottom-0 left-0 right-0 grid grid-cols-3 w-full text-3xs xs:text-2xs sm:text-xs text-zinc-800 dark:text-zinc-200 border-t border-gray-200 dark:border-gray-700 z-20">
        {/* Bottom left: Earthly Branch and Heavenly Stem */}
        <div
          className={`flex flex-col items-center justify-center py-0.5 xs:py-1 sm:py-1.5 border-r border-gray-200 dark:border-gray-700 ${
            isSelected ? "text-white/90 dark:text-white/90" : ""
          }`}>
          <div>
            {language === "en" && t(`zwds.stems.${palace.heavenlyStem}`)
              ? t(`zwds.stems.${palace.heavenlyStem}`)
              : palace.heavenlyStem}
          </div>
          <div>
            {language === "en" && t(`zwds.branches.${palace.earthlyBranch}`)
              ? t(`zwds.branches.${palace.earthlyBranch}`)
              : palace.earthlyBranch}
          </div>
        </div>

        {/* Bottom middle: Palace Name and Age Range */}
        <div
          className={`flex flex-col items-center justify-center py-0.5 xs:py-1 sm:py-1.5 border-r border-gray-200 dark:border-gray-700 font-medium ${
            isSelected ? "text-white dark:text-white" : ""
          }`}>
          <div>
            {language === "en" && t(`zwds.palaces.${palace.name}`)
              ? t(`zwds.palaces.${palace.name}`)
              : palace.name}
          </div>
          {palace.majorLimit && (
            <div
              className={`${
                isSelected
                  ? "text-white/80 dark:text-white/80"
                  : "text-zinc-500 dark:text-zinc-400"
              }`}>
              {palace.majorLimit.startAge}-{palace.majorLimit.endAge}
            </div>
          )}
        </div>

        {/* Bottom right: Year and Age Indicator */}
        <div
          className={`flex flex-col items-center justify-center py-0.5 xs:py-1 sm:py-1.5 ${
            isSelected
              ? "text-white/80 dark:text-white/80"
              : "text-zinc-500 dark:text-zinc-400"
          }`}>
          <div
            className={`${
              showAnnualFlow
                ? isSelected
                  ? "text-red-300"
                  : "text-red-600 dark:text-red-400"
                : ""
            } font-medium`}>
            {palaceYear}
          </div>
          <div className="text-2xs xs:text-2xs">{getAgeAtYear(palaceYear)}</div>
        </div>
      </div>
    </motion.div>
  );
};

export default Palace;
