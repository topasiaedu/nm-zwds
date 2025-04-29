import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChartData } from "../../utils/zwds/types";

// Import our modular components and hooks
import useStarRefs from "./hooks/useStarRefs";
import useTransformations from "./hooks/useTransformations";
import Palace from "./components/Palace";
import CenterInfo from "./components/CenterInfo";
import TransformationLines from "./components/TransformationLines";
import { useLanguage } from "../../context/LanguageContext";

// Breakpoint constants - matching TailwindCSS defaults
const SCREEN_SM = 640;

// Palace tags in clockwise order starting from the selected palace
const PALACE_TAGS = ["大命", "大兄", "大夫", "大子", "大财", "大疾", "大迁", "大友", "大官", "大田", "大福", "大父"];
const PALACE_TAGS_EN = ["Da Ming", "Da Xiong", "Da Fu", "Da Zi", "Da Cai", "Da Ji", "Da Qian", "Da You", "Da Guan", "Da Tian", "Da Fu", "Da Fu"];

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
  // State to track the selected palace
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const { language } = useLanguage();
  
  // Reference to the chart container
  const chartRef = useRef<HTMLDivElement>(null);
  
  // State to track window size changes
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Track redraw counter for transformation lines
  const [redrawCounter, setRedrawCounter] = useState<number>(0);

  // Use our custom hooks
  const { starRefs, palaceRefs, refsReady, setRefsReady, registerStarRef } = useStarRefs(chartData, selectedPalace);
  const { calculateTransformations, getTargetPalaces } = useTransformations(chartData, selectedPalace);

  // console.log("ChartData", chartData);

  // Update window size when resized
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      // Force redraw of transformation lines when window is resized
      setRedrawCounter(prev => prev + 1);
    };

    window.addEventListener("resize", handleResize);
    
    // Clean up event listener
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  /**
   * Calculate palace tag for a given palace based on the selected palace
   * Tags are assigned clockwise starting from the selected palace
   */
  const getPalaceTag = (palaceNumber: number): { tag: string | null; delay: number } => {
    if (!selectedPalace) return { tag: null, delay: 0 };
    
    // Calculate the reversed index in the PALACE_TAGS array
    let tagIndex = (selectedPalace - palaceNumber) % 12;
    if (tagIndex < 0) tagIndex += 12;
  
    // Now invert the tagIndex to actually go backwards through PALACE_TAGS
    const reversedIndex = (12 - tagIndex) % 12;
    
    return { 
      tag: language === "en" ? PALACE_TAGS_EN[reversedIndex] : PALACE_TAGS[reversedIndex],
      delay: tagIndex * 0.05 // delay still based on distance
    };
  };
  
  

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

  /**
   * Handle palace click
   */
  const handlePalaceClick = (palaceNumber: number) => {
    setSelectedPalace(selectedPalace === palaceNumber ? null : palaceNumber);
    
    // Ensure refs are ready for rendering transformation lines
    if (!refsReady) {
      setRefsReady(true);
    }
    
    // Increment redraw counter to force redrawing of transformation lines
    setRedrawCounter(prev => prev + 1);
  };

  /**
   * Render a single palace in the chart
   */
  const renderPalace = (palaceNumber: number) => {
    const palace = chartData.palaces[palaceNumber - 1];
    if (!palace) return null;

    // Check if this palace is selected
    const isSelected = selectedPalace === palaceNumber;
    
    // Get target palaces that are pointed to by transformations from the selected palace
    const targetPalaces = getTargetPalaces();
    // Convert to boolean to match the prop type expected by Palace component
    const isTargetPalace = Boolean(selectedPalace && targetPalaces[palaceNumber]);
    const transformationType = isTargetPalace ? targetPalaces[palaceNumber]?.type : null;
    
    // Get the palace tag if a palace is selected
    const { tag: palaceTag, delay } = getPalaceTag(palaceNumber);

    return (
      <Palace 
        key={palaceNumber}
        palaceNumber={palaceNumber}
        palace={palace}
        isSelected={isSelected}
        isTargetPalace={isTargetPalace}
        transformationType={transformationType}
        selectedPalace={selectedPalace}
        birthYear={chartData.input.year}
        targetYear={targetYear}
        palaceTag={palaceTag}
        registerStarRef={registerStarRef}
        handlePalaceClick={handlePalaceClick}
        palaceRefs={palaceRefs}
        delay={delay}
      />
    );
  };

  return (
    <motion.div 
      className="w-full mx-auto aspect-square md:aspect-square relative"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      ref={chartRef}
      style={{
        minHeight: windowSize.width < SCREEN_SM ? 'calc(100vh - 280px)' : undefined,
        height: windowSize.width < SCREEN_SM ? 'calc(100vh - 260px)' : undefined,
        maxHeight: '800px'
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
          <CenterInfo chartData={chartData} />
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
      <TransformationLines 
        transformations={calculateTransformations()}
        chartRef={chartRef}
        palaceRefs={palaceRefs}
        starRefs={starRefs}
        refsReady={refsReady}
        selectedPalace={selectedPalace}
        windowSize={windowSize}
        redrawCounter={redrawCounter}
      />
    </motion.div>
  );
};

export default ZWDSChart; 