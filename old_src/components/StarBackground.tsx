import React from "react";
import { useStarAnimation } from "../hooks/useStarAnimation";

interface StarBackgroundProps {
  maxStars?: number;
  maxDistance?: number;
  numConstellations?: number;
}

export const StarBackground: React.FC<StarBackgroundProps> = ({
  maxStars,
  maxDistance,
  numConstellations
}) => {
  const canvasRef = useStarAnimation({ maxStars, maxDistance, numConstellations });

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0"
      aria-hidden="true"
    />
  );
}; 