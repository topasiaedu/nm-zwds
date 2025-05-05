import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

// Breakpoint constants - matching TailwindCSS defaults
const SCREEN_SM = 640;

interface TransformationLinesProps {
  transformations: Array<{
    type: "祿" | "權" | "科" | "忌";
    fromPalace: number;
    toPalace: number;
    starName: string;
    isOppositeInfluence?: boolean;
  }>;
  chartRef: React.RefObject<HTMLDivElement>;
  palaceRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  starRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  refsReady: boolean;
  selectedPalace: number | null;
  windowSize: { width: number; height: number };
  redrawCounter?: number;
}

/**
 * Calculate the point on the palace border in the direction of the target
 */
const calculateBorderPoint = (
  fromRect: DOMRect,
  fromX: number, 
  fromY: number, 
  toX: number, 
  toY: number
): { x: number; y: number } => {
  // Calculate direction vector
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  // Palace dimensions
  const width = fromRect.width / 2;
  const height = fromRect.height / 2;
  
  // Calculate the angle of the direction
  const angle = Math.atan2(dy, dx);
  
  // Use a simple rectangular intersection calculation instead of elliptical
  // This works better with the grid layout and especially corner palaces
  
  // Calculate the absolute values of tangent and cotangent
  const absTan = Math.abs(Math.tan(angle));
  const absCot = Math.abs(1 / Math.tan(angle));
  
  let borderX: number, borderY: number;
  
  // Check which side of the rectangle we intersect with
  if (absTan <= height / width) {
    // Intersect with left or right edge
    borderX = (dx > 0) ? fromX + width : fromX - width;
    borderY = fromY + dy * (borderX - fromX) / dx;
  } else {
    // Intersect with top or bottom edge
    borderY = (dy > 0) ? fromY + height : fromY - height;
    borderX = fromX + dx * (borderY - fromY) / dy;
  }
  
  // Apply a small adjustment factor to ensure the point is slightly outside palace
  // This makes the lines start just a bit outside the palace border for visual clarity
  const adjustmentFactor = 1.05;
  const adjustedX = fromX + (borderX - fromX) * adjustmentFactor;
  const adjustedY = fromY + (borderY - fromY) * adjustmentFactor;
  
  return { x: adjustedX, y: adjustedY };
};

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
  windowSize,
  redrawCounter = 0
}) => {
  const [forceUpdate, setForceUpdate] = useState<number>(0);

  // Force rerender when redrawCounter changes, but only for regular transformations
  useEffect(() => {
    if (redrawCounter > 0) {
      // Small delay to ensure refs are updated
      const timer = setTimeout(() => {
        setForceUpdate(prev => prev + 1);
      }, 10);
      return () => clearTimeout(timer);
    }
  }, [redrawCounter]);

  if (!chartRef.current || !refsReady) {
    return null;
  }
  
  if (transformations.length === 0) {
    return null;
  }
  
  const chartRect = chartRef.current.getBoundingClientRect();
  
  // Separate transformations into regular and opposite palace influences
  const regularTransformations = transformations.filter(t => !t.isOppositeInfluence);
  const oppositeInfluences = transformations.filter(t => t.isOppositeInfluence);
  
  // Create a unique key for the static opposite influence lines
  const oppositeInfluencesKey = "opposite-influences";
  
  // Group transformations by fromPalace and toPalace to handle spacing
  const groupedRegularTransformations = regularTransformations.reduce((groups, transformation) => {
    const key = `${transformation.fromPalace}-${transformation.toPalace}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(transformation);
    return groups;
  }, {} as Record<string, typeof regularTransformations>);
  
  const groupedOppositeInfluences = oppositeInfluences.reduce((groups, transformation) => {
    const key = `${transformation.fromPalace}-${transformation.toPalace}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(transformation);
    return groups;
  }, {} as Record<string, typeof oppositeInfluences>);
  
  // Render regular transformations with redraw logic
  const regularLines = Object.entries(groupedRegularTransformations).flatMap(([key, transformationGroup]) => {
    return transformationGroup.map((transformation, groupIndex) => {
      const fromPalaceRef = palaceRefs.current[transformation.fromPalace - 1];
      
      // For regular transformations, get the specific star element
      const toStarKey = `${transformation.toPalace}:${transformation.starName}`;
      const toStarRef = starRefs.current.get(toStarKey);
      
      if (!fromPalaceRef || !toStarRef) {
        return null;
      }
      
      const fromRect = fromPalaceRef.getBoundingClientRect();
      const toStarRect = toStarRef.getBoundingClientRect();
      
      // Calculate center points relative to chart
      const fromX = fromRect.left - chartRect.left + fromRect.width / 2;
      const fromY = fromRect.top - chartRect.top + fromRect.height / 2;
      
      // For the target, use the star's position
      const toStarX = toStarRect.left - chartRect.left + toStarRect.width / 2;
      const toStarY = toStarRect.top - chartRect.top + toStarRect.height / 2;
      
      // Determine line color based on transformation type
      let lineColor;
      let shadowColor;
      switch (transformation.type) {
        case "祿": 
          lineColor = "rgba(16, 185, 129, 0.7)"; // semi-transparent green
          shadowColor = "rgba(16, 185, 129, 0.3)";
          break;
        case "權": 
          lineColor = "rgba(56, 189, 248, 0.85)"; // brighter sky blue with higher opacity
          shadowColor = "rgba(56, 189, 248, 0.4)";
          break;
        case "科": 
          lineColor = "rgba(245, 158, 11, 0.7)"; // semi-transparent yellow
          shadowColor = "rgba(245, 158, 11, 0.3)";
          break;
        case "忌": 
          lineColor = "rgba(239, 68, 68, 0.7)"; // semi-transparent red
          shadowColor = "rgba(239, 68, 68, 0.3)";
          break;
        default: 
          lineColor = "rgba(107, 114, 128, 0.7)"; // semi-transparent gray
          shadowColor = "rgba(107, 114, 128, 0.3)";
          break;
      }
      
      // Use the windowSize prop to determine screen size
      const isSmallScreen = windowSize.width < SCREEN_SM; // sm breakpoint
      
      // Adjust stroke width based on screen size - make lines thicker
      const strokeWidth = isSmallScreen ? "3" : "4";
      // Style for all lines
      const lineStyle = {
        filter: `drop-shadow(0 0 4px ${shadowColor})`,
        opacity: 0.8, // Additional transparency for all lines
      };
      
      // Create a unique key incorporating forceUpdate so the SVG elements recreate
      // This ensures regular transformations redraw when needed
      const lineKey = `${transformation.fromPalace}-${transformation.toPalace}-${transformation.type}-${groupIndex}-${forceUpdate}-${redrawCounter}`;
      
      // Check if transformation points to the same palace
      const isSelfTransformation = transformation.fromPalace === transformation.toPalace;
      
      if (isSelfTransformation) {
        // For self-transformations, draw a curved arc or loop
        // Get position relative to the star
        const starX = toStarX - fromX;
        const starY = toStarY - fromY;
        
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
        const arrowAngle = Math.atan2(toStarY - controlY, toStarX - controlX);
        
        return (
          <g key={lineKey} style={lineStyle}>
            <motion.path
              d={`M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toStarX} ${toStarY}`}
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
              points={`${toStarX},${toStarY} ${
                toStarX - 10 * Math.cos(arrowAngle - Math.PI/6)},${
                toStarY - 10 * Math.sin(arrowAngle - Math.PI/6)} ${
                toStarX - 10 * Math.cos(arrowAngle + Math.PI/6)},${
                toStarY - 10 * Math.sin(arrowAngle + Math.PI/6)}`
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
        const lineLength = Math.sqrt(Math.pow(toStarX - fromX, 2) + Math.pow(toStarY - fromY, 2));
        
        // Calculate the angle of the line
        const angle = Math.atan2(toStarY - fromY, toStarX - fromX);
        
        // Calculate arrowhead points - make arrowhead larger
        const arrowLength = 12;
        const arrowWidth = 8;
        
        const x1 = toStarX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle - Math.PI/2);
        const y1 = toStarY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle - Math.PI/2);
        const x2 = toStarX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle + Math.PI/2);
        const y2 = toStarY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle + Math.PI/2);
        
        // Create animated dashes for the lines
        const dashLength = lineLength / 10;
        const dashArray = `${dashLength},${dashLength/2}`;
        
        return (
          <g key={lineKey} style={lineStyle}>
            <motion.line
              x1={fromX}
              y1={fromY}
              x2={toStarX}
              y2={toStarY}
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
              points={`${toStarX},${toStarY} ${x1},${y1} ${x2},${y2}`}
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
    });
  }).filter(Boolean);
  
  // Render opposite palace influences with no redraw logic
  // These will be static and only update on window resize
  const oppositeLines = Object.entries(groupedOppositeInfluences).flatMap(([key, transformationGroup]) => {
    return transformationGroup.map((transformation, groupIndex) => {
      const fromPalaceRef = palaceRefs.current[transformation.fromPalace - 1];
      const toPalaceRef = palaceRefs.current[transformation.toPalace - 1];
      
      if (!fromPalaceRef || !toPalaceRef) {
        return null;
      }
      
      const fromRect = fromPalaceRef.getBoundingClientRect();
      const toRect = toPalaceRef.getBoundingClientRect();
      
      // Calculate center points relative to chart
      const fromX = fromRect.left - chartRect.left + fromRect.width / 2;
      const fromY = fromRect.top - chartRect.top + fromRect.height / 2;
      
      // For the target palace, use its center
      const toX = toRect.left - chartRect.left + toRect.width / 2;
      const toY = toRect.top - chartRect.top + toRect.height / 2;
      
      // Calculate direction vector
      const dx = toX - fromX;
      const dy = toY - fromY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // Determine line color based on transformation type
      let lineColor;
      let shadowColor;
      switch (transformation.type) {
        case "祿": 
          lineColor = "rgba(16, 185, 129, 0.7)"; // semi-transparent green
          shadowColor = "rgba(16, 185, 129, 0.3)";
          break;
        case "權": 
          lineColor = "rgba(56, 189, 248, 0.85)"; // brighter sky blue with higher opacity
          shadowColor = "rgba(56, 189, 248, 0.4)";
          break;
        case "科": 
          lineColor = "rgba(245, 158, 11, 0.7)"; // semi-transparent yellow
          shadowColor = "rgba(245, 158, 11, 0.3)";
          break;
        case "忌": 
          lineColor = "rgba(239, 68, 68, 0.7)"; // semi-transparent red
          shadowColor = "rgba(239, 68, 68, 0.3)";
          break;
        default: 
          lineColor = "rgba(107, 114, 128, 0.7)"; // semi-transparent gray
          shadowColor = "rgba(107, 114, 128, 0.3)";
          break;
      }
      
      // Use the windowSize prop to determine screen size
      const isSmallScreen = windowSize.width < SCREEN_SM; // sm breakpoint
      
      // Adjust stroke width based on screen size - make lines thicker
      const strokeWidth = isSmallScreen ? "3" : "4";
      // Style for all lines
      const lineStyle = {
        filter: `drop-shadow(0 0 4px ${shadowColor})`,
        opacity: 0.8, // Additional transparency for all lines
      };
      
      // Create a unique key that does NOT include forceUpdate or redrawCounter
      // This ensures opposite palace influences don't redraw when selecting palaces
      const lineKey = `opposite-${transformation.fromPalace}-${transformation.toPalace}-${transformation.type}-${groupIndex}`;
      
      // Calculate multiple offset angles for spacing multiple lines going to the same palace
      const groupSize = transformationGroup.length;
      const baseOffsetAngle = (groupIndex - (groupSize - 1) / 2) * (Math.PI / 12); // 15 degrees spacing
      
      // Calculate shorter line length based on the palace size
      const palaceSize = Math.min(fromRect.width, fromRect.height);
      const lineLength = palaceSize * 0.3; // Shorter line for opposite palace influence
      
      // Calculate direction angle with offset for spacing
      const angle = Math.atan2(dy, dx) + baseOffsetAngle;
      
      // Calculate the point on the palace border
      const borderPoint = calculateBorderPoint(fromRect, fromX, fromY, toX, toY);
      
      // Calculate endpoints of the shorter line
      const endX = borderPoint.x + lineLength * Math.cos(angle);
      const endY = borderPoint.y + lineLength * Math.sin(angle);
      
      // Calculate arrowhead points
      const arrowLength = 8;
      const arrowWidth = 6;
      
      const x1 = endX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle - Math.PI/2);
      const y1 = endY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle - Math.PI/2);
      const x2 = endX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle + Math.PI/2);
      const y2 = endY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle + Math.PI/2);
      
      // For static rendering, use the fully drawn line without animation
      return (
        <g key={lineKey} style={lineStyle}>
          <line
            x1={borderPoint.x}
            y1={borderPoint.y}
            x2={endX}
            y2={endY}
            stroke={lineColor}
            strokeWidth={strokeWidth}
          />
          <polygon
            points={`${endX},${endY} ${x1},${y1} ${x2},${y2}`}
            fill={lineColor}
          />
        </g>
      );
    });
  }).filter(Boolean);
  
  // Create unique key for the SVG element to force remounting for regular transformations
  const regularSvgKey = `transformation-lines-${forceUpdate}-${redrawCounter}`;
  // Static key for opposite palace influences
  const oppositeSvgKey = `opposite-influences`;
  
  return (
    <>
      {/* Render regular transformations with redraw logic */}
      {regularLines.length > 0 && (
        <svg 
          key={regularSvgKey}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-5"
          style={{ overflow: "visible" }}
        >
          {regularLines}
        </svg>
      )}
      
      {/* Render opposite palace influences with static rendering */}
      {oppositeLines.length > 0 && (
        <svg 
          key={oppositeSvgKey}
          className="absolute top-0 left-0 w-full h-full pointer-events-none z-5"
          style={{ overflow: "visible" }}
        >
          {oppositeLines}
        </svg>
      )}
    </>
  );
};

export default TransformationLines; 