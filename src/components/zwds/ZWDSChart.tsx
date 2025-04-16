import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChartData } from "../../utils/zwds/types";

// Import our modular components and hooks
import useStarRefs from "./hooks/useStarRefs";
import useTransformations from "./hooks/useTransformations";
import Palace from "./components/Palace";
import CenterInfo from "./components/CenterInfo";
import TransformationLines from "./components/TransformationLines";

// Breakpoint constants - matching TailwindCSS defaults
const SCREEN_SM = 640;

// Palace tags in clockwise order starting from the selected palace
const PALACE_TAGS = ["大命", "大兄", "大夫", "大子", "大财", "大疾", "大迁", "大友", "大官", "大田", "大福", "大父"];

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
  
  // Reference to the chart container
  const chartRef = useRef<HTMLDivElement>(null);
  
  // State to track window size changes
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Use our custom hooks
  const { starRefs, palaceRefs, refsReady, setRefsReady, registerStarRef } = useStarRefs(chartData, selectedPalace);
  const { calculateTransformations, getTargetPalaces } = useTransformations(chartData, selectedPalace);

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
   * Calculate palace tag for a given palace based on the selected palace
   * Tags are assigned clockwise starting from the selected palace
   */
  const getPalaceTag = (palaceNumber: number): { tag: string | null; delay: number } => {
    if (!selectedPalace) return { tag: null, delay: 0 };
    
    // Calculate the index in the PALACE_TAGS array
    let tagIndex = (palaceNumber - selectedPalace) % 12;
    // Handle negative indices by adding 12
    if (tagIndex < 0) tagIndex += 12;
    
    // Return tag with delay that increases with distance from the selected palace
    // This creates a clockwise animation effect
    return { 
      tag: PALACE_TAGS[tagIndex],
      delay: tagIndex * 0.05 // 50ms delay between each palace
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
      />
    </motion.div>
  );
};

export default ZWDSChart; 