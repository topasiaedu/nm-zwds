import React, { useEffect, useRef } from "react";

/**
 * Properties for individual stars in the starry background
 */
interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  baseOpacity: number;
  directionX: number;
  directionY: number;
  speed: number;
  flickerSpeed: number;
  flickerDirection: number;
}

/**
 * Component that renders a subtle starry background with animated stars and constellations
 */
const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const stars = useRef<Star[]>([]);
  const isDarkMode = useRef<boolean>(
    document.documentElement.classList.contains("dark") ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  /**
   * Initialize stars with random positions, sizes, directions and speeds
   */
  const initStars = (count: number): Star[] => {
    const newStars: Star[] = [];
    for (let i = 0; i < count; i++) {
      // Use more subtle opacity values
      const baseOpacity = Math.random() * 0.4 + 0.1;
      
      // Random angle for direction
      const angle = Math.random() * Math.PI * 2;
      
      newStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: Math.random() * 1.2 + 0.3, // Smaller stars for subtlety
        opacity: baseOpacity,
        baseOpacity: baseOpacity, // Store base opacity for flickering
        directionX: Math.cos(angle) * 0.5, // Random direction X component
        directionY: Math.sin(angle) * 0.5, // Random direction Y component
        speed: Math.random() * 0.02 + 0.005, // Much slower movement
        flickerSpeed: Math.random() * 0.0005 + 0.0001, // Very slow flickering
        flickerDirection: Math.random() > 0.5 ? 1 : -1, // Random initial flicker direction
      });
    }
    return newStars;
  };
  
  /**
   * Draw a star on the canvas
   */
  const drawStar = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    opacity: number
  ): void => {
    const glow = radius * 2;
    
    // Create a radial gradient for the star's glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow);
    const starColor = isDarkMode.current ? "255, 255, 255" : "30, 30, 60";
    
    gradient.addColorStop(0, `rgba(${starColor}, ${opacity})`);
    gradient.addColorStop(1, `rgba(${starColor}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, glow, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw the star's center
    ctx.fillStyle = `rgba(${starColor}, ${opacity + 0.1})`;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  };
  
  /**
   * Calculate distance between two points
   */
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };
  
  /**
   * Draw connections between nearby stars to form constellations
   */
  const drawConstellations = (ctx: CanvasRenderingContext2D, stars: Star[]): void => {
    const threshold = 120; // Maximum distance to connect stars (reduced for subtlety)
    const maxConnections = 2; // Maximum connections per star (reduced for fewer lines)
    
    ctx.beginPath();
    
    const starColor = isDarkMode.current ? "255, 255, 255" : "30, 30, 60";
    
    for (let i = 0; i < stars.length; i++) {
      let connections = 0;
      
      for (let j = 0; j < stars.length; j++) {
        if (i === j) continue;
        
        const distance = calculateDistance(
          stars[i].x,
          stars[i].y,
          stars[j].x,
          stars[j].y
        );
        
        if (distance < threshold && connections < maxConnections) {
          // Increased opacity for better visibility while still maintaining subtlety
          const lineOpacity = isDarkMode.current ? 0.15 : 0.08;
          
          ctx.strokeStyle = isDarkMode.current 
            ? `rgba(${starColor}, ${lineOpacity})` 
            : `rgba(${starColor}, ${lineOpacity})`;
          
          ctx.lineWidth = 0.4; // Slightly thicker lines for better visibility
          
          ctx.beginPath();
          ctx.moveTo(stars[i].x, stars[i].y);
          ctx.lineTo(stars[j].x, stars[j].y);
          ctx.stroke();
          
          connections++;
        }
      }
    }
  };
  
  /**
   * Animate the stars with random movement and very slow flickering
   */
  const animate = (): void => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Update star positions and opacities
    stars.current.forEach((star) => {
      // Very slow random movement in both X and Y directions
      star.x += star.directionX * star.speed;
      star.y += star.directionY * star.speed;
      
      // Wrap around edges
      if (star.x < 0) star.x = canvas.width;
      if (star.x > canvas.width) star.x = 0;
      if (star.y < 0) star.y = canvas.height;
      if (star.y > canvas.height) star.y = 0;
      
      // Add extremely slow twinkling effect
      star.opacity = Math.max(
        star.baseOpacity - 0.1, 
        Math.min(
          star.baseOpacity + 0.1, 
          star.opacity + (star.flickerSpeed * star.flickerDirection)
        )
      );
      
      // Change flicker direction when reaching limits
      if (star.opacity >= star.baseOpacity + 0.1) {
        star.flickerDirection = -1;
      } else if (star.opacity <= star.baseOpacity - 0.1) {
        star.flickerDirection = 1;
      }
    });
    
    // Draw constellation lines first (so stars appear on top)
    drawConstellations(ctx, stars.current);
    
    // Draw each star
    stars.current.forEach((star) => {
      drawStar(ctx, star.x, star.y, star.radius, star.opacity);
    });
    
    animationRef.current = requestAnimationFrame(animate);
  };
  
  /**
   * Set up canvas and stars, start animation
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // Initialize canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Check if dark mode is active
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    isDarkMode.current = darkModeMediaQuery.matches || document.documentElement.classList.contains("dark");
    
    // Listen for theme changes
    const handleThemeChange = (e: MediaQueryListEvent): void => {
      isDarkMode.current = e.matches;
    };
    
    darkModeMediaQuery.addEventListener("change", handleThemeChange);
    
    // Also observe document class changes to detect manual theme toggles
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          isDarkMode.current = document.documentElement.classList.contains("dark");
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Initialize fewer stars for subtlety
    const starCount = isDarkMode.current ? 80 : 60;
    stars.current = initStars(starCount);
    
    // Start animation
    animationRef.current = requestAnimationFrame(animate);
    
    // Handle window resize
    const handleResize = (): void => {
      if (!canvas) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      
      // Redistribute some stars when resizing
      stars.current = stars.current.map((star) => {
        if (Math.random() > 0.7) {
          return {
            ...star,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          };
        }
        return star;
      });
    };
    
    window.addEventListener("resize", handleResize);
    
    // Cleanup
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      aria-hidden="true"
    />
  );
};

export default StarryBackground; 