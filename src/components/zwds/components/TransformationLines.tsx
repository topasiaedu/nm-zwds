import React from "react";
import { motion } from "framer-motion";

// Breakpoint constants - matching TailwindCSS defaults
const SCREEN_SM = 640;

interface TransformationLinesProps {
  transformations: Array<{
    type: "祿" | "權" | "科" | "忌";
    fromPalace: number;
    toPalace: number;
    starName: string;
  }>;
  chartRef: React.RefObject<HTMLDivElement>;
  palaceRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  starRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  refsReady: boolean;
  selectedPalace: number | null;
  windowSize: { width: number; height: number };
}

/**
 * Component to render transformation lines between palaces in the ZWDS chart
 */
const TransformationLines: React.FC<TransformationLinesProps> = ({
  transformations,
  chartRef,
  palaceRefs,
  starRefs,
  refsReady,
  selectedPalace,
  windowSize
}) => {
  if (!selectedPalace || !chartRef.current || !refsReady) {
    return null;
  }
  
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
    
    // Use the windowSize prop to determine screen size
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

export default TransformationLines; 