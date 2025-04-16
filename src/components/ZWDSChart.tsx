import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChartData } from "../utils/zwds/types";
import { HiCalendar, HiClock } from "react-icons/hi";
import { FOUR_TRANSFORMATIONS, HEAVENLY_STEMS } from "../utils/zwds/constants";
import { useLanguage } from "../context/LanguageContext";

// Breakpoint constants - matching TailwindCSS defaults
const SCREEN_SM = 640;
const SCREEN_MD = 768;
const SCREEN_LG = 1024;

interface ZWDSChartProps {
  chartData: ChartData;
  targetYear?: number; // Optional prop to specify which year's annual flow to display
}

/**
 * Component to display the Zi Wei Dou Shu chart in a 4x4 grid layout
 */
const ZWDSChart: React.FC<ZWDSChartProps> = ({
  chartData,
  targetYear = new Date().getFullYear(),
}) => {
  const { t, language } = useLanguage();
  // State to track the selected palace
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const palaceRefs = useRef<(HTMLDivElement | null)[]>(Array(12).fill(null));
  const starRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  // State to track window size changes
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Track starRefs population status
  const [refsReady, setRefsReady] = useState<boolean>(false);

  console.log("ChartData", chartData);

  // Update window size when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Animation variants for different elements
   */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const palaceVariants = {
    hidden: { opacity: 0, scale: 0.96 },
    visible: { 
      opacity: 1, 
      scale: 1,
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
      boxShadow: ["0 0 0 2px rgba(79, 70, 229, 0.5)", "0 0 0 3px rgba(79, 70, 229, 0.4)", "0 0 0 2px rgba(79, 70, 229, 0.5)"],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
        opacity: { duration: 0 }
      }
    }
  };

  const centerInfoVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        duration: 0.6,
      },
    },
  };

  // Function to register a star element reference
  const registerStarRef = (palaceNumber: number, starName: string, element: HTMLDivElement | null) => {
    if (element) {
      const key = `${palaceNumber}:${starName}`;
      starRefs.current.set(key, element);
    }
  };

  /**
   * Normalize Chinese characters between traditional and simplified forms
   * to ensure consistent star name matching
   */
  const normalizeChineseCharacters = (text: string): string => {
    if (!text) return "";
    
    // Create mapping of traditional to simplified Chinese characters
    const charMap: Record<string, string> = {
      // Mapping for stars and related terms
      '貞': '贞', // zhēn
      '機': '机', // jī
      '梁': '梁', // liáng (same in both)
      '陰': '阴', // yīn
      '陽': '阳', // yáng
      '輔': '辅', // fǔ
      '弼': '弼', // bì (same in both)
      '軍': '军', // jūn
      '將': '将', // jiāng
      '門': '门', // mén
      '廉': '廉', // lián (same in both)
      '破': '破', // pò (same in both)
      '武': '武', // wǔ (same in both)
      '天': '天', // tiān (same in both)
      '紫': '紫', // zǐ (same in both)
      '文': '文', // wén (same in both)
      '太': '太', // tài (same in both)
      '左': '左', // zuǒ (same in both)
      '右': '右', // yòu (same in both)
      '祿': '禄', // lù
      '權': '权', // quán
      '科': '科', // kē (same in both)
      '忌': '忌', // jì (same in both)
      '擎': '擎', // qíng (same in both)
      '貪': '贪', // tān
      '巨': '巨', // jù (same in both)
      '福': '福', // fú (same in both)
      '祿存': '禄存', // lù cún
      '化祿': '化禄', // huà lù
      '化權': '化权', // huà quán
      '火星': '火星', // huǒ xīng (same in both)
      '鈴星': '铃星', // líng xīng
      '地空': '地空', // dì kōng (same in both)
      '地劫': '地劫', // dì jié (same in both)
      // Add specific star names that include the problematic characters
      '巨門': '巨门', // jù mén
      '天門': '天门', // tiān mén
      '七殺': '七杀', // qī shā
      '貪狼': '贪狼', // tān láng
      '天梁': '天梁', // tiān liáng
      '天相': '天相', // tiān xiāng
      '天機': '天机', // tiān jī
      '太陰': '太阴', // tài yīn
      '太陽': '太阳', // tài yáng
      '廉貞': '廉贞', // lián zhēn
      '天府': '天府', // tiān fǔ
      '武曲': '武曲', // wǔ qū
      '天同': '天同', // tiān tóng
      '破軍': '破军', // pò jūn
      '文曲': '文曲', // wén qū
      '文昌': '文昌', // wén chāng
      '左輔': '左辅', // zuǒ fǔ
      '右弼': '右弼', // yòu bì
    };
    
    let normalized = text.replace(/\s+/g, '');
    
    // Apply all character replacements
    for (const [traditional, simplified] of Object.entries(charMap)) {
      normalized = normalized.replace(new RegExp(traditional, 'g'), simplified);
    }
    
    return normalized;
  };

  /**
   * Find a star by name in all palaces
   */
  const findStarByName = (name: string) => {
    
    // Normalize star name for comparison using our helper function
    const normalizedName = normalizeChineseCharacters(name);
    
    // First try a direct match
    for (let i = 0; i < chartData.palaces.length; i++) {
      const palace = chartData.palaces[i];
      
      // Check main stars
      if (palace.mainStar && palace.mainStar.length > 0) {
        for (const star of palace.mainStar) {
          if (star.name === name) {
            return { star, palaceNumber: i + 1 };
          }
        }
      }
      
      // Check minor stars
      if (palace.minorStars && palace.minorStars.length > 0) {
        for (const star of palace.minorStars) {
          if (star.name === name) {
            return { star, palaceNumber: i + 1 };
          }
        }
      }
    }
    
    // If direct match failed, try with normalization
    for (let i = 0; i < chartData.palaces.length; i++) {
      const palace = chartData.palaces[i];
      
      // Check main stars
      if (palace.mainStar && palace.mainStar.length > 0) {
        for (const star of palace.mainStar) {
          const normalizedStarName = normalizeChineseCharacters(star.name);
          
          if (normalizedStarName === normalizedName) {
            return { star, palaceNumber: i + 1 };
          }
        }
      }
      
      // Check minor stars
      if (palace.minorStars && palace.minorStars.length > 0) {
        for (const star of palace.minorStars) {
          const normalizedStarName = normalizeChineseCharacters(star.name);
          
          if (normalizedStarName === normalizedName) {
            return { star, palaceNumber: i + 1 };
          }
        }
      }
    }
    
    // If still not found, try a looser matching approach
    for (let i = 0; i < chartData.palaces.length; i++) {
      const palace = chartData.palaces[i];
      
      // Check main stars
      if (palace.mainStar && palace.mainStar.length > 0) {
        for (const star of palace.mainStar) {
          // Normalize both names for substring comparison
          const normalizedStarName = normalizeChineseCharacters(star.name);
          
          // Check if the star name contains the target name or vice versa
          if (normalizedStarName.includes(normalizedName) || normalizedName.includes(normalizedStarName)) {
            return { star, palaceNumber: i + 1 };
          }
        }
      }
      
      // Check minor stars
      if (palace.minorStars && palace.minorStars.length > 0) {
        for (const star of palace.minorStars) {
          // Normalize both names for substring comparison
          const normalizedStarName = normalizeChineseCharacters(star.name);
          
          // Check if the star name contains the target name or vice versa
          if (normalizedStarName.includes(normalizedName) || normalizedName.includes(normalizedStarName)) {
            return { star, palaceNumber: i + 1 };
          }
        }
      }
    }
   
    
    return null;
  };

  /**
   * Calculate transformations based on the palace's heavenly stem
   */
  const calculateTransformations = () => {
    if (!selectedPalace) return [];
    
    // Get the selected palace's heavenly stem
    const palace = chartData.palaces[selectedPalace - 1];
    if (!palace || !palace.heavenlyStem) {
      return [];
    }
    
    
    const transformations = FOUR_TRANSFORMATIONS[palace.heavenlyStem];
    if (!transformations) {
      return [];
    }
    
    
    const results = [];
    
    for (const [type, starName] of Object.entries(transformations)) {
      const targetStarInfo = findStarByName(starName);
      
      if (targetStarInfo) {
        let transformationType: "祿" | "權" | "科" | "忌";
        
        switch (type) {
          case "祿": transformationType = "祿"; break;
          case "權": transformationType = "權"; break;
          case "科": transformationType = "科"; break;
          case "忌": transformationType = "忌"; break;
          default: continue;
        }
        
        results.push({
          type: transformationType,
          fromPalace: selectedPalace,
          toPalace: targetStarInfo.palaceNumber,
          starName: targetStarInfo.star.name
        });
      } else {
      }
    }
    
    return results;
  };

  /**
   * Get palaces that are targets of transformations from the currently selected palace
   */
  const getTargetPalaces = () => {
    if (!selectedPalace) return {};
    
    const transformations = calculateTransformations();
    const targetPalaces: Record<number, { type: string, starName: string }> = {};
    
    transformations.forEach(transformation => {
      targetPalaces[transformation.toPalace] = {
        type: transformation.type,
        starName: transformation.starName
      };
    });
    
    return targetPalaces;
  };

  /**
   * Draw transformation lines between palaces
   */
  const renderTransformationLines = () => {
    if (!selectedPalace || !chartRef.current || !refsReady) {
      return null;
    }
    
    const transformations = calculateTransformations();
    if (transformations.length === 0) {
      return null;
    }
    
    const chartRect = chartRef.current.getBoundingClientRect();
    
    const lines = transformations.map((transformation, index) => {
      const fromPalaceRef = palaceRefs.current[transformation.fromPalace - 1];
      
      // Get specific star element
      const toStarKey = `${transformation.toPalace}:${transformation.starName}`;
      const toStarRef = starRefs.current.get(toStarKey);
      
      if (!fromPalaceRef || !toStarRef) {
        return null;
      }
      
      const fromRect = fromPalaceRef.getBoundingClientRect();
      const toRect = toStarRef.getBoundingClientRect();
      
      // Calculate center points relative to chart
      const fromX = fromRect.left - chartRect.left + fromRect.width / 2;
      const fromY = fromRect.top - chartRect.top + fromRect.height / 2;
      
      // For the target, use the star's position instead of palace center
      const toX = toRect.left - chartRect.left + toRect.width / 2;
      const toY = toRect.top - chartRect.top + toRect.height / 2;
      
      // Determine line color based on transformation type
      let lineColor;
      let shadowColor; // Add shadow color
      switch (transformation.type) {
        case "祿": 
          lineColor = "rgba(16, 185, 129, 0.7)"; // semi-transparent
          shadowColor = "rgba(16, 185, 129, 0.3)";
          break; // green
        case "權": 
          lineColor = "rgba(56, 189, 248, 0.85)"; // brighter sky blue with higher opacity
          shadowColor = "rgba(56, 189, 248, 0.4)";
          break; // blue
        case "科": 
          lineColor = "rgba(245, 158, 11, 0.7)"; // semi-transparent
          shadowColor = "rgba(245, 158, 11, 0.3)";
          break; // yellow
        case "忌": 
          lineColor = "rgba(239, 68, 68, 0.7)"; // semi-transparent
          shadowColor = "rgba(239, 68, 68, 0.3)";
          break; // red
        default: 
          lineColor = "rgba(107, 114, 128, 0.7)"; // semi-transparent
          shadowColor = "rgba(107, 114, 128, 0.3)";
          break; // gray fallback
      }
      
      // Check if transformation points to the same palace
      const isSelfTransformation = transformation.fromPalace === transformation.toPalace;
      
      // Use the windowSize state to determine screen size
      const isSmallScreen = windowSize.width < SCREEN_SM; // sm breakpoint
      
      // Adjust stroke width based on screen size - make lines thicker
      const strokeWidth = isSmallScreen ? "3" : "4";
      // Style for all lines
      const lineStyle = {
        filter: `drop-shadow(0 0 4px ${shadowColor})`,
        opacity: 0.8, // Additional transparency for all lines
      };
      
      if (isSelfTransformation) {
        // For self-transformations, draw a curved arc or loop
        // Get position relative to the star
        const starX = toX - fromX;
        const starY = toY - fromY;
        
        // Determine the direction to bend the arc based on star position
        let angle;
        if (Math.abs(starX) > Math.abs(starY)) {
          // Star is more horizontal from palace center
          angle = starX > 0 ? Math.PI * 3/4 : Math.PI * 1/4;
        } else {
          // Star is more vertical from palace center
          angle = starY > 0 ? Math.PI * 5/4 : Math.PI * 7/4;
        }
        
        // Create control points for a bezier curve
        const radius = Math.min(fromRect.width, fromRect.height) * 0.5;
        
        // Calculate control point coordinates for a quadratic bezier curve
        const controlX = fromX + radius * Math.cos(angle);
        const controlY = fromY + radius * Math.sin(angle);
        
        // Create animated dashes for the arc
        const arcLength = Math.PI * radius; // Approximate arc length
        const dashLength = arcLength / 10;
        const dashArray = `${dashLength},${dashLength/2}`;
        
        // Calculate arrowhead angle
        const arrowAngle = Math.atan2(toY - controlY, toX - controlX);
        
        return (
          <g key={index} style={lineStyle}>
            <motion.path
              d={`M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`}
              fill="none"
              stroke={lineColor}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              initial={{ strokeDashoffset: arcLength }}
              animate={{ 
                strokeDashoffset: [arcLength, 0],
                pathLength: [0, 1]
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut" 
              }}
            />
            <motion.polygon
              points={`${toX},${toY} ${
                toX - 10 * Math.cos(arrowAngle - Math.PI/6)},${
                toY - 10 * Math.sin(arrowAngle - Math.PI/6)} ${
                toX - 10 * Math.cos(arrowAngle + Math.PI/6)},${
                toY - 10 * Math.sin(arrowAngle + Math.PI/6)}`
              }
              fill={lineColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8,
                duration: 0.3
              }}
            />
          </g>
        );
      } else {
        // Draw a line between palace and star
        const lineLength = Math.sqrt(Math.pow(toX - fromX, 2) + Math.pow(toY - fromY, 2));
        
        // Calculate the angle of the line
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        // Calculate arrowhead points - make arrowhead larger
        const arrowLength = 12;
        const arrowWidth = 8;
        
        const x1 = toX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle - Math.PI/2);
        const y1 = toY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle - Math.PI/2);
        const x2 = toX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle + Math.PI/2);
        const y2 = toY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle + Math.PI/2);
        
        // Create animated dashes for the lines
        const dashLength = lineLength / 10;
        const dashArray = `${dashLength},${dashLength/2}`;
        
        return (
          <g key={index} style={lineStyle}>
            <motion.line
              x1={fromX}
              y1={fromY}
              x2={toX}
              y2={toY}
              stroke={lineColor}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              initial={{ strokeDashoffset: lineLength }}
              animate={{ 
                strokeDashoffset: [lineLength, 0],
                pathLength: [0, 1]
              }}
              transition={{ 
                duration: 1.5,
                ease: "easeOut" 
              }}
            />
            <motion.polygon
              points={`${toX},${toY} ${x1},${y1} ${x2},${y2}`}
              fill={lineColor}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 0.8,
                duration: 0.3
              }}
            />
          </g>
        );
      }
    }).filter(Boolean);
    
    return (
      <svg 
        className="absolute top-0 left-0 w-full h-full pointer-events-none z-5"
        style={{ overflow: "visible" }}
      >
        {lines}
      </svg>
    );
  };

  /**
   * Handle palace click
   */
  const handlePalaceClick = (palaceNumber: number) => {
    setSelectedPalace(selectedPalace === palaceNumber ? null : palaceNumber);
    
    // Ensure refs are ready for rendering transformation lines
    if (!refsReady) {
      setRefsReady(true);
    }
  };

  /**
   * Render a single palace in the chart
   */
  const renderPalace = (palaceNumber: number) => {
    const palace = chartData.palaces[palaceNumber - 1];
    if (!palace) return null;

    // Check if this palace has an annual flow matching the target year
    const showAnnualFlow =
      palace.annualFlow && palace.annualFlow.year === targetYear;
      
    // Check if this palace is selected
    const isSelected = selectedPalace === palaceNumber;
    
    // Get target palaces that are pointed to by transformations from the selected palace
    const targetPalaces = getTargetPalaces();
    const isTargetPalace = selectedPalace && targetPalaces[palaceNumber];
    const transformationType = isTargetPalace ? targetPalaces[palaceNumber].type : null;

    // Get transformation border color
    let transformationBorderColor = "";
    if (isTargetPalace) {
      switch (transformationType) {
        case "祿": transformationBorderColor = "ring-green-500"; break;
        case "權": transformationBorderColor = "ring-blue-500"; break;
        case "科": transformationBorderColor = "ring-yellow-500"; break;
        case "忌": transformationBorderColor = "ring-red-500"; break;
        default: transformationBorderColor = "";
      }
    }

    // Determine gradient background for selected palace
    // Purple to indigo gradient like the main button
    const gradientStyle = isSelected ? {
      background: "linear-gradient(135deg, rgb(124, 58, 237), rgb(79, 70, 229))",
      backgroundSize: "200% 200%",
    } : {};

    // Dark mode gradient
    const darkGradientStyle = isSelected ? {
      background: "linear-gradient(135deg, rgb(124, 58, 237, 0.8), rgb(79, 70, 229, 0.8))",
      backgroundSize: "200% 200%",
    } : {};

    // Choose which style to apply based on color scheme preference
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const selectedStyle = isSelected ? (isDarkMode ? darkGradientStyle : gradientStyle) : {};
    
    // Define border highlight style for target palaces
    let targetHighlightStyle = {};
    if (isTargetPalace && !isSelected) {
      const borderColor = 
        transformationType === "祿" ? "rgba(16, 185, 129, 0.7)" : // green
        transformationType === "權" ? "rgba(56, 189, 248, 0.85)" : // brighter sky blue with higher opacity
        transformationType === "科" ? "rgba(245, 158, 11, 0.7)" : // yellow
        transformationType === "忌" ? "rgba(239, 68, 68, 0.7)" : // red
        "rgba(107, 114, 128, 0.7)"; // gray fallback
      
      targetHighlightStyle = {
        boxShadow: `0 0 0 2px ${borderColor}`,
      };
    }

    return (
      <motion.div 
        key={palaceNumber}
        className={`relative border border-gray-100 dark:border-gray-700 p-0.5 xs:p-1 sm:p-2 md:p-3 min-h-[90px] xs:min-h-[100px] sm:min-h-[120px] md:min-h-[150px] ${
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
        // Safely apply animation variant
        animate={isSelected ? "pulse" : "visible"}
        initial="hidden"
        style={{
          ...selectedStyle,
          ...(isSelected 
            ? { boxShadow: "0 0 15px rgba(79, 70, 229, 0.25)" }
            : isTargetPalace 
              ? targetHighlightStyle
              : {}),
          transition: "all 0.3s ease"
        }}
        onClick={() => handlePalaceClick(palaceNumber)}
        ref={el => palaceRefs.current[palaceNumber - 1] = el}>

        {/* Top left: Main Stars */}
        <div className="absolute top-0.5 xs:top-1 sm:top-2 left-0.5 xs:left-1 sm:left-2 z-30">
          {palace.mainStar && palace.mainStar.length > 0 && (
            <div className="font-medium text-2xs xs:text-xs sm:text-sm">
              {palace.mainStar.map((star, starIndex) => (
                <div 
                  key={starIndex} 
                  className={`mb-0.5 ${isSelected ? "text-white dark:text-white font-semibold" : "text-zinc-800 dark:text-zinc-200 font-semibold"}`}
                  ref={el => el && registerStarRef(palaceNumber, star.name, el)}
                >
                  {translateStarName(star.name, "mainStars")}
                  {star.transformations?.map((transformation, idx) => (
                    <span key={idx} className={`text-2xs xs:text-xs sm:text-sm ml-0.5 sm:ml-1 ${
                      isSelected ? (
                        transformation === "化祿" ? "text-green-300 font-bold" :
                        transformation === "化權" ? "text-cyan-300 font-bold" : // Brighter cyan instead of blue
                        transformation === "化科" ? "text-yellow-300 font-bold" :
                        transformation === "化忌" ? "text-red-300 font-bold" :
                        "text-rose-300 font-bold"
                      ) : (
                        transformation === "化祿" ? "text-green-500" :
                        transformation === "化權" ? "text-cyan-500" : // Brighter cyan instead of blue
                        transformation === "化科" ? "text-yellow-500" :
                        transformation === "化忌" ? "text-red-500" :
                        "text-rose-500"
                      )
                    }`}>
                      {language === "en" && t(`zwds.transformations.${transformation}`) 
                        ? t(`zwds.transformations.${transformation}`).split(' ')[0]
                        : transformation}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top right: Minor Stars */}
        <div className="absolute top-0.5 xs:top-1 sm:top-2 right-0.5 xs:right-1 sm:right-2 text-right z-30">
          {palace.minorStars.map((star, idx) => (
            <div 
              key={idx} 
              className={`text-2xs xs:text-xs sm:text-sm mb-0.5 ${
                isSelected
                  ? "font-medium text-white dark:text-white"
                  : star.brightness === "bright"
                    ? "font-medium text-zinc-700 dark:text-zinc-300"
                    : "text-zinc-500 dark:text-zinc-400"
              }`}
              ref={el => el && registerStarRef(palaceNumber, star.name, el)}
            >
              {translateStarName(star.name, "minorStars")}
              {star.transformations?.map((transformation, tidx) => (
                <span key={tidx} className={`text-2xs xs:text-xs sm:text-sm ml-0.5 sm:ml-1 ${
                  isSelected ? (
                    transformation === "化祿" ? "text-green-300 font-bold" :
                    transformation === "化權" ? "text-cyan-300 font-bold" : // Brighter cyan instead of blue
                    transformation === "化科" ? "text-yellow-300 font-bold" :
                    transformation === "化忌" ? "text-red-300 font-bold" :
                    "text-rose-300 font-bold"
                  ) : (
                    transformation === "化祿" ? "text-green-500" :
                    transformation === "化權" ? "text-cyan-500" : // Brighter cyan instead of blue
                    transformation === "化科" ? "text-yellow-500" :
                    transformation === "化忌" ? "text-red-500" :
                    "text-rose-500"
                  )
                }`}>
                  {language === "en" && t(`zwds.transformations.${transformation}`) 
                    ? t(`zwds.transformations.${transformation}`).split(' ')[0]
                    : transformation}
                </span>
              ))}
            </div>
          ))}
        </div>

        {/* Bottom middle: Palace Name - moved higher up */}
        <div className="absolute bottom-4 xs:bottom-5 sm:bottom-6 left-0 right-0 text-center font-medium text-3xs xs:text-xs sm:text-sm text-zinc-800 dark:text-zinc-200 z-20">
          <span className={isSelected ? "text-white dark:text-white" : ""}>
            {language === "en" && t(`zwds.palaces.${palace.name}`) ? t(`zwds.palaces.${palace.name}`) : palace.name}
          </span>
        </div>

        {/* Bottom right: Earthly Branch and Heavenly Stem */}
        <div className="absolute bottom-0.5 xs:bottom-1 sm:bottom-2 right-0.5 xs:right-1 sm:right-2 text-3xs xs:text-2xs sm:text-sm text-zinc-500 dark:text-zinc-400 z-20">
          <span className={isSelected ? "text-white/80 dark:text-white/80" : ""}>
            {language === "en" && t(`zwds.branches.${palace.earthlyBranch}`) ? t(`zwds.branches.${palace.earthlyBranch}`) : palace.earthlyBranch}
            {language === "en" && t(`zwds.stems.${palace.heavenlyStem}`) ? t(`zwds.stems.${palace.heavenlyStem}`) : palace.heavenlyStem}
          </span>
        </div>

        {/* Bottom left: Age Range */}
        {palace.majorLimit && (
          <div className="absolute bottom-0.5 xs:bottom-1 sm:bottom-2 left-0.5 xs:left-1 sm:left-2 text-3xs xs:text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 z-20">
            <span className={isSelected ? "text-white/80 dark:text-white/80" : ""}>
              {palace.majorLimit.startAge}-{palace.majorLimit.endAge}
            </span>
          </div>
        )}

        {/* Annual Flow Indicator - moved to middle left */}
        {showAnnualFlow && (
          <div className="absolute left-0.5 xs:left-1 sm:left-2 top-1/2 transform -translate-y-1/2 bg-red-50 dark:bg-red-900/60 text-red-600 dark:text-red-300 px-0.5 xs:px-1 sm:px-2.5 py-0.5 rounded-full text-3xs xs:text-2xs sm:text-xs font-medium z-20">
            {language === "en" && t("zwds.chart.流年") ? t("zwds.chart.流年") : "流年"}
          </div>
        )}
      </motion.div>
    );
  };

  /**
   * Render the center information section
   */
  const renderCenterInfo = () => {
    const { input } = chartData;
    
    return (
      <motion.div 
        className="col-span-2 row-span-2 border border-gray-700 dark:border-gray-800 bg-white dark:bg-gray-900 flex flex-col h-full w-full rounded-lg shadow-sm overflow-hidden"
        variants={centerInfoVariants}>
        
        {/* Content container */}
        <div className="flex flex-col h-full">
          {/* Name with animation */}
          <motion.div 
            className="text-base sm:text-lg font-medium py-2 px-3 sm:px-4 text-zinc-800 dark:text-zinc-100 text-center bg-zinc-100/50 dark:bg-gray-800/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            {input.name || "staney testing"}
          </motion.div>
          
          {/* Cards in a grid layout */}
          <div className="flex-grow overflow-auto p-2 sm:p-3">
            <div className="grid grid-cols-2 gap-2 sm:gap-3 h-full">
              {/* Solar Birthday Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="flex items-center text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  <HiCalendar className="mr-1 text-2xs sm:text-xs" />
                  {language === "en" && t("zwds.chart.阳历") ? t("zwds.chart.阳历") : "陽曆生日"}
                </div>
                <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                  {input.year}{language === "en" ? " " : "年 "}{input.month}{language === "en" ? " " : "月 "}{input.day}{language === "en" ? "" : "日"} {input.hour}{language === "en" ? "" : "時"}
                </div>
              </div>
              
              {/* Lunar Birthday Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="flex items-center text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  <HiCalendar className="mr-1 text-2xs sm:text-xs" />
                  {language === "en" && t("zwds.chart.阴历") ? t("zwds.chart.阴历") : "農曆生日"}
                </div>
                <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                  {language === "en" && t(`zwds.stems.${chartData.heavenlyStem}`) ? t(`zwds.stems.${chartData.heavenlyStem}`) : chartData.heavenlyStem}
                  {language === "en" ? " " : ""}
                  {language === "en" && t(`zwds.branches.${chartData.earthlyBranch}`) ? t(`zwds.branches.${chartData.earthlyBranch}`) : chartData.earthlyBranch}
                  {language === "en" ? " Year" : "年"}
                </div>
              </div>

              {/* Five Elements Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {language === "en" && t("zwds.chart.五行") ? t("zwds.chart.五行") : "五行"}
                </div>
                <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                  {language === "en" && chartData.fiveElements && t(`zwds.fiveElements.${chartData.fiveElements}`) 
                    ? t(`zwds.fiveElements.${chartData.fiveElements}`) 
                    : chartData.fiveElements}
                </div>
              </div>
              
              {/* Gender Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {language === "en" ? "Gender" : "性別"}
                </div>
                <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                  {language === "en" 
                    ? (input.gender === "female" ? "Female" : "Male") 
                    : (chartData.yinYang === "Yin" ? "陰" : "陽") + (input.gender === "female" ? "女" : "男")}
                </div>
              </div>
              
              {/* Age Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {language === "en" ? "Age" : "年齡"}
                </div>
                <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                  {new Date().getFullYear() - input.year}{language === "en" ? "" : "歲"}
                </div>
              </div>
              
              {/* Chinese Zodiac Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {language === "en" ? "Chinese Zodiac" : "生肖"}
                </div>
                <div className="flex items-center">
                  <div className="text-base sm:text-xl mr-1.5">
                    {["🐭","🐂","🐯","🐰","🐲","🐍","🐴","🐑","🐵","🐔","🐶","🐷"][(input.year - 4) % 12]}
                  </div>
                  <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                    {["鼠","牛","虎","兔","龍","蛇","馬","羊","猴","雞","狗","豬"][(input.year - 4) % 12]}
                  </div>
                </div>
              </div>
              
              {/* Western Zodiac Card */}
              <div className="bg-gray-800/30 rounded p-2 flex flex-col justify-center">
                <div className="text-2xs sm:text-xs text-zinc-500 dark:text-zinc-400 mb-0.5">
                  {language === "en" ? "Western Zodiac" : "星座"}
                </div>
                <div className="flex items-center">
                  <div className="text-base sm:text-xl mr-1.5">
                    {(() => {
                      const month = input.month;
                      const day = input.day;
                      
                      if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
                        return "♈";
                      if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
                        return "♉";
                      if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
                        return "♊";
                      if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
                        return "♋";
                      if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
                        return "♌";
                      if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
                        return "♍";
                      if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
                        return "♎";
                      if ((month === 10 && day >= 24) || (month === 11 && day <= 22))
                        return "♏";
                      if ((month === 11 && day >= 23) || (month === 12 && day <= 21))
                        return "♐";
                      if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
                        return "♑";
                      if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
                        return "♒";
                      return "♓"; // Feb 19 - Mar 20
                    })()}
                  </div>
                  <div className="text-2xs sm:text-sm text-zinc-700 dark:text-zinc-200">
                    {(() => {
                      const month = input.month;
                      const day = input.day;
                      
                      if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
                        return "白羊座";
                      if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
                        return "金牛座";
                      if ((month === 5 && day >= 21) || (month === 6 && day <= 21))
                        return "雙子座";
                      if ((month === 6 && day >= 22) || (month === 7 && day <= 22))
                        return "巨蟹座";
                      if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
                        return "獅子座";
                      if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
                        return "處女座";
                      if ((month === 9 && day >= 23) || (month === 10 && day <= 23))
                        return "天秤座";
                      if ((month === 10 && day >= 24) || (month === 11 && day <= 22))
                        return "天蠍座";
                      if ((month === 11 && day >= 23) || (month === 12 && day <= 21))
                        return "射手座";
                      if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
                        return "摩羯座";
                      if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
                        return "水瓶座";
                      return "雙魚座"; // Feb 19 - Mar 20
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Reset starRefs when chart data changes
  useEffect(() => {
    starRefs.current = new Map();
  }, [chartData]);

  // Track starRefs population status
  useEffect(() => {
    if (selectedPalace) {
      // Check if we have refs populated for this palace
      const palaceStarsPopulated = Array.from(starRefs.current.keys()).some(key => 
        key.startsWith(`${selectedPalace}:`)
      );
      
      if (!palaceStarsPopulated) {
        // Force a re-render to ensure refs are populated
        setTimeout(() => {
          setRefsReady(true);
        }, 100);
      }
    }
  }, [selectedPalace]);

  // Ensure refs are properly populated after first render
  useEffect(() => {
    // After component mounts, ensure refs are marked as ready
    const timer = setTimeout(() => {
      setRefsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  /**
   * Check if a star has a self-transformation when the palace is selected
   */
  const hasSelfTransformation = (palaceNumber: number, starName: string): { has: boolean; type?: "祿" | "權" | "科" | "忌" } => {
    if (selectedPalace !== palaceNumber) return { has: false };
    
    const palace = chartData.palaces[palaceNumber - 1];
    if (!palace || !palace.heavenlyStem) return { has: false };
    
    const transformations = FOUR_TRANSFORMATIONS[palace.heavenlyStem];
    if (!transformations) return { has: false };
    
    // Check if any transformation points to this star in the same palace
    for (const [type, targetStarName] of Object.entries(transformations)) {
      // Use the same normalization function for consistency
      const normalizedTargetStarName = normalizeChineseCharacters(targetStarName);
      const normalizedStarName = normalizeChineseCharacters(starName);
      
      if (normalizedTargetStarName === normalizedStarName || targetStarName === starName) {
        let transformationType: "祿" | "權" | "科" | "忌";
        
        switch (type) {
          case "祿": transformationType = "祿"; break;
          case "權": transformationType = "權"; break;
          case "科": transformationType = "科"; break;
          case "忌": transformationType = "忌"; break;
          default: return { has: false };
        }
        
        return { has: true, type: transformationType };
      }
    }
    
    return { has: false };
  };

  /**
   * Get color for transformation type
   */
  const getTransformationColor = (type?: "祿" | "權" | "科" | "忌") => {
    if (!type) return "";
    switch (type) {
      case "祿": return "text-green-500";
      case "權": return "text-cyan-500"; // Changed from blue to cyan
      case "科": return "text-yellow-500";
      case "忌": return "text-red-500";
      default: return "text-gray-500";
    }
  };

  // Helper to translate transformation types
  const translateTransformation = (type: string) => {
    const key = type === "祿" ? "化祿" : 
               type === "權" ? "化权" : 
               type === "科" ? "化科" : 
               type === "忌" ? "化忌" : type;
    
    return language === "en" && t(`zwds.transformations.${key}`) 
      ? t(`zwds.transformations.${key}`).split(' ')[0] // Just use the first word (Academic, Power, etc.)
      : type;
  };

  // Fix for keys issue by explicitly handling these translations
  const translateStarName = (starName: string, category: "mainStars" | "minorStars") => {
    if (!starName) return "";
    
    // If not in English, just return the original name
    if (language !== "en") return starName;
    
    // Attempt to get the translation
    const translation = t(`zwds.${category}.${starName}`);
    
    // If the translation is the same as the key (which means it wasn't found), 
    // return a fallback or the original name
    if (translation === `zwds.${category}.${starName}`) {
      // Fallbacks for common stars
      if (starName === "天相") return "Sky Minister";
      if (starName === "太阴") return "Moon";
      if (starName === "貪狼") return "Greedy Wolf";
      if (starName === "文昌") return "Literary Talent";
      if (starName === "右弼") return "Right Assistant";
      if (starName === "天機") return "Sky Mechanism";
      if (starName === "火星") return "Mars";
      // Default to returning the original
      return starName;
    }
    
    return translation;
  };

  // Add a new helper function for transformation badge colors on selected cards
  const getTransformationBadgeColor = (type?: "祿" | "權" | "科" | "忌") => {
    if (!type) return "";
    switch (type) {
      case "祿": return "text-green-300 font-bold px-1 py-0.5 bg-green-900/30 rounded";
      case "權": return "text-cyan-300 font-bold px-1 py-0.5 bg-cyan-900/30 rounded";
      case "科": return "text-yellow-300 font-bold px-1 py-0.5 bg-yellow-900/30 rounded";
      case "忌": return "text-red-300 font-bold px-1 py-0.5 bg-red-900/30 rounded";
      default: return "text-gray-300 font-bold";
    }
  };

  return (
    <motion.div 
      className="w-full mx-auto aspect-square md:aspect-square relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      ref={chartRef}
      style={{
        minHeight: windowSize.width < SCREEN_SM ? 'calc(100vh - 200px)' : undefined,
        height: windowSize.width < SCREEN_SM ? 'calc(100vh - 180px)' : undefined,
        maxHeight: windowSize.width < SCREEN_SM ? '800px' : undefined
      }}>
      <motion.div 
        className="grid grid-cols-4 grid-rows-4 gap-0.5 xs:gap-1 sm:gap-2 p-0 xs:p-0.5 sm:p-1 md:p-3 h-full rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}>
        {/* First row (top) */}
        {renderPalace(1)}
        {renderPalace(2)}
        {renderPalace(3)}
        {renderPalace(4)}
        
        {/* Second row */}
        {renderPalace(12)}
        {/* Center info spans 2x2 */}
        <div className="col-span-2 row-span-2">
          {renderCenterInfo()}
        </div>
        {renderPalace(5)}
        
        {/* Third row */}
        {renderPalace(11)}
        {/* Center info already spans here */}
        {renderPalace(6)}
        
        {/* Fourth row (bottom) */}
        {renderPalace(10)}
        {renderPalace(9)}
        {renderPalace(8)}
        {renderPalace(7)}
      </motion.div>
      
      {/* Render transformation lines as overlay */}
      {renderTransformationLines()}
    </motion.div>
  );
};

export default ZWDSChart;
