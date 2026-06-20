import React from "react";
import { motion } from "framer-motion";
import {
  getTransformationLineColors,
  type TransformationType,
} from "../../../styles/chartSemanticColors";

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
  disableAnimations?: boolean; // Optional prop to disable animations for PDF export
}

/**
 * Calculate the center point of the border in the direction of the target
 * This ensures lines start from the center of the palace border
 */
const calculateCenteredBorderPoint = (
  fromRect: DOMRect,
  fromX: number, 
  fromY: number, 
  toX: number, 
  toY: number,
  palaceNumber: number
): { x: number; y: number } => {
  // Calculate direction vector
  const dx = toX - fromX;
  const dy = toY - fromY;
  
  // Palace dimensions
  const width = fromRect.width / 2;
  const height = fromRect.height / 2;
  
  // Calculate the angle of the direction
  const angle = Math.atan2(dy, dx);
  
  // Check if this is a corner palace
  const isCornerPalace = [1, 4, 7, 10].includes(palaceNumber);
  
  // For corner palaces, use the original calculation method
  if (isCornerPalace) {
    // Use a simple rectangular intersection calculation for corner palaces
    if (Math.abs(Math.cos(angle)) > Math.abs(Math.sin(angle))) {
      // Hitting left or right side
      const borderX = (dx > 0) ? fromX + width : fromX - width;
      const borderY = fromY + dy * (borderX - fromX) / dx;
      
      // Apply a small adjustment factor
      const adjustmentFactor = 1.02;
      const adjustedX = fromX + (borderX - fromX) * adjustmentFactor;
      const adjustedY = fromY + (borderY - fromY) * adjustmentFactor;
      
      return { x: adjustedX, y: adjustedY };
    } else {
      // Hitting top or bottom side
      const borderY = (dy > 0) ? fromY + height : fromY - height;
      const borderX = fromX + dx * (borderY - fromY) / dy;
      
      // Apply a small adjustment factor
      const adjustmentFactor = 1.02;
      const adjustedX = fromX + (borderX - fromX) * adjustmentFactor;
      const adjustedY = fromY + (borderY - fromY) * adjustmentFactor;
      
      return { x: adjustedX, y: adjustedY };
    }
  }
  
  // For non-corner palaces, ensure the line starts from the center of the border
  let borderX: number, borderY: number;
  
  // Check which quadrant the angle falls into to determine the side
  // Right side: -π/4 to π/4
  // Bottom side: π/4 to 3π/4
  // Left side: 3π/4 to -3π/4
  // Top side: -3π/4 to -π/4
  
  if (angle > -Math.PI/4 && angle < Math.PI/4) {
    // Right side - x is fixed at right edge, y is center
    borderX = fromX + width;
    borderY = fromY;
  } else if (angle >= Math.PI/4 && angle < 3*Math.PI/4) {
    // Bottom side - y is fixed at bottom edge, x is center
    borderX = fromX;
    borderY = fromY + height;
  } else if ((angle >= 3*Math.PI/4) || (angle <= -3*Math.PI/4)) {
    // Left side - x is fixed at left edge, y is center
    borderX = fromX - width;
    borderY = fromY;
  } else {
    // Top side - y is fixed at top edge, x is center
    borderX = fromX;
    borderY = fromY - height;
  }
  
  // Apply a small adjustment factor to ensure the point is slightly outside palace
  const adjustmentFactor = 1.02;
  const adjustedX = fromX + (borderX - fromX) * adjustmentFactor;
  const adjustedY = fromY + (borderY - fromY) * adjustmentFactor;
  
  return { x: adjustedX, y: adjustedY };
};

interface LineSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

const STAR_ENDPOINT_TRIM_PX = 14;

/** Move the endpoint slightly back from the star so the arrowhead sits on the label. */
const trimPointToward = (
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  trimPx: number
): { x: number; y: number } => {
  const dx = toX - fromX;
  const dy = toY - fromY;
  const length = Math.hypot(dx, dy);
  if (length <= trimPx) {
    return { x: toX, y: toY };
  }
  const ratio = (length - trimPx) / length;
  return { x: fromX + dx * ratio, y: fromY + dy * ratio };
};

/**
 * Build a single straight segment from the palace border to just before the star.
 * The arrow SVG renders above all layers (z-[100]) so no center-panel routing needed.
 */
const buildRegularTransformationSegments = (
  fromRect: DOMRect,
  fromPalace: number,
  fromCenterX: number,
  fromCenterY: number,
  toStarX: number,
  toStarY: number
): LineSegment[] => {
  const borderStart = calculateCenteredBorderPoint(
    fromRect,
    fromCenterX,
    fromCenterY,
    toStarX,
    toStarY,
    fromPalace
  );

  const trimmedEnd = trimPointToward(
    borderStart.x,
    borderStart.y,
    toStarX,
    toStarY,
    STAR_ENDPOINT_TRIM_PX
  );

  return [{ x1: borderStart.x, y1: borderStart.y, x2: trimmedEnd.x, y2: trimmedEnd.y }];
};

const getArrowheadPoints = (
  tipX: number,
  tipY: number,
  fromX: number,
  fromY: number,
  arrowLength: number,
  arrowWidth: number
): string => {
  const angle = Math.atan2(tipY - fromY, tipX - fromX);
  const x1 =
    tipX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle - Math.PI / 2);
  const y1 =
    tipY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle - Math.PI / 2);
  const x2 =
    tipX - arrowLength * Math.cos(angle) - arrowWidth * Math.cos(angle + Math.PI / 2);
  const y2 =
    tipY - arrowLength * Math.sin(angle) - arrowWidth * Math.sin(angle + Math.PI / 2);
  return `${tipX},${tipY} ${x1},${y1} ${x2},${y2}`;
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
  disableAnimations = false
}) => {

  // console.log("🎭 TransformationLines", transformations);
  
  // Only log when there are issues for debugging
  if (selectedPalace && starRefs.current.size === 0) {
    // console.log("🎭 Warning: Selected palace but no star refs available");
  }

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
        if (selectedPalace) {
          // console.log("🎭 Missing ref for transformation:", toStarKey);
        }
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
      const { lineColor, shadowColor } = getTransformationLineColors(
        transformation.type as TransformationType
      );
      
      // Use the windowSize prop to determine screen size
      const isSmallScreen = windowSize.width < SCREEN_SM; // sm breakpoint
      
      // Adjust stroke width based on screen size - make lines thicker
      const strokeWidth = isSmallScreen ? "3" : "4";
      // Style for all lines
      const lineStyle = {
        filter: `drop-shadow(0 0 4px ${shadowColor})`,
        opacity: 0.8, // Additional transparency for all lines
      };
      
      // Create a stable key for smooth transitions
      const lineKey = `${transformation.fromPalace}-${transformation.toPalace}-${transformation.type}-${groupIndex}`;
      
      // Check if transformation points to the same palace
      const isSelfTransformation = transformation.fromPalace === transformation.toPalace;
      
      if (isSelfTransformation) {
        const borderStart = calculateCenteredBorderPoint(
          fromRect,
          fromX,
          fromY,
          toStarX,
          toStarY,
          transformation.fromPalace
        );

        // For self-transformations, draw a curved arc from the palace border toward the star
        const starX = toStarX - borderStart.x;
        const starY = toStarY - borderStart.y;
        
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
        const radius = Math.min(fromRect.width, fromRect.height) * 0.35;
        
        // Calculate control point coordinates for a quadratic bezier curve
        const controlX = borderStart.x + radius * Math.cos(angle);
        const controlY = borderStart.y + radius * Math.sin(angle);
        
        // Create animated dashes for the arc
        const arcLength = Math.PI * radius; // Approximate arc length
        const dashLength = arcLength / 10;
        const dashArray = `${dashLength},${dashLength/2}`;
        
        // Calculate arrowhead angle
        const arrowAngle = Math.atan2(toStarY - controlY, toStarX - controlX);
        
        return (
          <g key={lineKey} style={lineStyle}>
            <motion.path
              d={`M ${borderStart.x} ${borderStart.y} Q ${controlX} ${controlY} ${toStarX} ${toStarY}`}
              fill="none"
              stroke={lineColor}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              initial={disableAnimations ? false : { strokeDashoffset: arcLength }}
              animate={disableAnimations ? false : { 
                strokeDashoffset: [arcLength, 0],
                pathLength: [0, 1]
              }}
              transition={disableAnimations ? { duration: 0 } : { 
                duration: 0.8, // Reduced from 1.5s to 0.8s
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
              initial={disableAnimations ? false : { opacity: 0, scale: 0 }}
              animate={disableAnimations ? false : { opacity: 1, scale: 1 }}
              transition={disableAnimations ? { duration: 0 } : { 
                delay: 0.4, // Reduced from 0.8s to 0.4s
                duration: 0.2 // Reduced from 0.3s to 0.2s
              }}
            />
          </g>
        );
      } else {
        const segments = buildRegularTransformationSegments(
          fromRect,
          transformation.fromPalace,
          fromX,
          fromY,
          toStarX,
          toStarY
        );

        if (segments.length === 0) {
          return null;
        }

        const arrowLength = 12;
        const arrowWidth = 8;
        const lastSegment = segments[segments.length - 1];
        const totalLength = segments.reduce(
          (sum, segment) =>
            sum + Math.hypot(segment.x2 - segment.x1, segment.y2 - segment.y1),
          0
        );
        const dashLength = totalLength / 10;
        const dashArray = `${dashLength},${dashLength / 2}`;

        return (
          <g key={lineKey} style={lineStyle}>
            {segments.map((segment, segmentIndex) => {
              const segmentLength = Math.hypot(
                segment.x2 - segment.x1,
                segment.y2 - segment.y1
              );
              const isLastSegment = segmentIndex === segments.length - 1;
              const segmentKey = `${lineKey}-segment-${segmentIndex}`;

              return (
                <React.Fragment key={segmentKey}>
                  <motion.line
                    x1={segment.x1}
                    y1={segment.y1}
                    x2={segment.x2}
                    y2={segment.y2}
                    stroke={lineColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={dashArray}
                    initial={disableAnimations ? false : { strokeDashoffset: segmentLength }}
                    animate={
                      disableAnimations
                        ? false
                        : {
                            strokeDashoffset: [segmentLength, 0],
                            pathLength: [0, 1],
                          }
                    }
                    transition={
                      disableAnimations
                        ? { duration: 0 }
                        : {
                            duration: 0.8,
                            ease: "easeOut",
                          }
                    }
                  />
                  {isLastSegment && (
                    <motion.polygon
                      points={getArrowheadPoints(
                        lastSegment.x2,
                        lastSegment.y2,
                        lastSegment.x1,
                        lastSegment.y1,
                        arrowLength,
                        arrowWidth
                      )}
                      fill={lineColor}
                      initial={disableAnimations ? false : { opacity: 0, scale: 0 }}
                      animate={disableAnimations ? false : { opacity: 1, scale: 1 }}
                      transition={
                        disableAnimations
                          ? { duration: 0 }
                          : {
                              delay: 0.4,
                              duration: 0.2,
                            }
                      }
                    />
                  )}
                </React.Fragment>
              );
            })}
          </g>
        );
      }
    });
  }).filter(Boolean);
  
  // Only log if there are issues
  if (selectedPalace && regularLines.length === 0 && regularTransformations.length > 0) {
    // console.log("🎭 Warning: Expected transformation lines but none created");
  }
  
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
      // Determine line color based on transformation type
      const { lineColor, shadowColor } = getTransformationLineColors(
        transformation.type as TransformationType
      );
      
      // Use the windowSize prop to determine screen size
      const isSmallScreen = windowSize.width < SCREEN_SM; // sm breakpoint
      
      // Adjust stroke width based on screen size - make lines thicker
      const strokeWidth = isSmallScreen ? "3" : "4";
      // Style for all lines
      const lineStyle = {
        filter: `drop-shadow(0 0 4px ${shadowColor})`,
        opacity: 0.8, // Additional transparency for all lines
      };
      
      // Create a stable key for opposite palace influences
      const lineKey = `opposite-${transformation.fromPalace}-${transformation.toPalace}-${transformation.type}-${groupIndex}`;
      
      // Calculate multiple offset angles for spacing multiple lines going to the same palace
      const groupSize = transformationGroup.length;
      const baseOffsetAngle = (groupIndex - (groupSize - 1) / 2) * (Math.PI / 12); // 15 degrees spacing
      
      // Calculate shorter line length based on the palace size
      const palaceSize = Math.min(fromRect.width, fromRect.height);
      const lineLength = palaceSize * 0.3; // Shorter line for opposite palace influence
      
      // Calculate direction angle with offset for spacing
      const angle = Math.atan2(dy, dx) + baseOffsetAngle;
      
      // Calculate the point on the palace border - use the centered border point calculation
      const borderPoint = calculateCenteredBorderPoint(fromRect, fromX, fromY, toX, toY, transformation.fromPalace);
      
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
  
  // Use a stable key for the SVG to avoid remounting
  const regularSvgKey = `transformation-lines`;
  // Static key for opposite palace influences
  const oppositeSvgKey = `opposite-influences`;
  
  return (
    <>
      {/* Render regular transformations with smooth transitions */}
      <motion.svg 
        key={regularSvgKey}
        className="absolute top-0 left-0 h-full w-full"
        style={{ overflow: "visible" }}
        initial={disableAnimations ? false : { opacity: 0 }}
        animate={disableAnimations ? false : { opacity: regularLines.length > 0 ? 1 : 0 }}
        transition={disableAnimations ? { duration: 0 } : { duration: 0.2, ease: "easeOut" }}
      >
        {regularLines}
      </motion.svg>
      
      {/* Render opposite palace influences with static rendering */}
      <svg 
        key={oppositeSvgKey}
        className="absolute top-0 left-0 h-full w-full"
        style={{ overflow: "visible" }}
      >
        {oppositeLines}
      </svg>
    </>
  );
};

export default TransformationLines; 