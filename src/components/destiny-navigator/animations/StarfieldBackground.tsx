/**
 * StarfieldBackground Component
 * Creates an animated cosmic starfield with drifting stars
 * Optimized for 60fps performance
 */

import React, { useEffect, useRef } from "react";

/**
 * Individual star properties
 */
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
  layer: number; // For parallax effect (1-3)
}

/**
 * Component props
 */
interface StarfieldBackgroundProps {
  speed?: number; // Multiplier for star movement speed (default: 1)
  density?: number; // Number of stars (default: 150)
  colors?: string[]; // RGB color strings (default: ["255, 255, 255"])
}

/**
 * StarfieldBackground - Animated cosmic background
 * Uses canvas for optimal performance
 */
const StarfieldBackground: React.FC<StarfieldBackgroundProps> = ({
  speed = 1,
  density = 150,
  colors = ["255, 255, 255"]
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastFrameTimeRef = useRef<number>(0);

  /**
   * Initialize stars with random positions and properties
   * Creates parallax effect with 3 layers
   */
  const initStars = (count: number, width: number, height: number): Star[] => {
    const stars: Star[] = [];

    for (let i = 0; i < count; i++) {
      const layer = Math.ceil(Math.random() * 3); // 1, 2, or 3
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: (Math.random() * 1.5 + 0.5) * (layer / 2), // Bigger stars in front
        opacity: (Math.random() * 0.6 + 0.4) * (layer / 3), // Brighter stars in front
        speed: (Math.random() * 0.2 + 0.1) * layer * speed, // Faster in front
        layer
      });
    }
    return stars;
  };

  /**
   * Draw all stars on the canvas
   */
  const drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw each star
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      
      // Use gradient fill for glow effect
      const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
      const colorIndex = Math.floor(Math.random() * colors.length);
      gradient.addColorStop(0, `rgba(${colors[colorIndex]}, ${star.opacity})`);
      gradient.addColorStop(1, `rgba(${colors[colorIndex]}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fill();
    });
  };

  /**
   * Animate stars (move downward with parallax)
   */
  const animateStars = (currentTime: number): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Calculate delta time for smooth animation
    const deltaTime = lastFrameTimeRef.current ? currentTime - lastFrameTimeRef.current : 16;
    lastFrameTimeRef.current = currentTime;
    const deltaMultiplier = deltaTime / 16; // Normalize to 60fps

    // Update star positions
    starsRef.current.forEach((star) => {
      star.y += star.speed * deltaMultiplier;

      // Reset stars that go off the bottom
      if (star.y > canvas.height + star.size) {
        star.y = -star.size;
        star.x = Math.random() * canvas.width;
      }
    });

    drawStars(ctx, canvas.width, canvas.height);
    animationFrameRef.current = requestAnimationFrame(animateStars);
  };

  /**
   * Handle canvas resize
   */
  const handleResize = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Reinitialize stars with new dimensions
    starsRef.current = initStars(density, canvas.width, canvas.height);
  };

  /**
   * Setup and cleanup
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Draw static stars without animation
      handleResize();
      return;
    }

    // Initial setup
    handleResize();

    // Start animation
    animationFrameRef.current = requestAnimationFrame(animateStars);

    // Add resize listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return (): void => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [speed, density, colors]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
};

export default StarfieldBackground;











