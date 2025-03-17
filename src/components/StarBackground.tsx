import React, { useEffect, useRef } from "react";

/**
 * Animation properties for the star background
 */
interface Star {
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

/**
 * StarBackground component
 * Creates an animated star field that adapts to light and dark mode
 */
const StarBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const animationFrameRef = useRef<number>(0);
  const isDarkMode = useRef<boolean>(document.documentElement.classList.contains("dark"));
  const observerRef = useRef<MutationObserver | null>(null);
  const isInitialized = useRef<boolean>(false);

  // Initialize stars
  const initStars = (count: number): Star[] => {
    const stars: Star[] = [];
    const canvas = canvasRef.current;
    if (!canvas) return stars;

    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.3 + 0.1,
      });
    }
    return stars;
  };

  // Draw stars
  const drawStars = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set star color based on theme
    const currentTheme = isDarkMode.current;
    const starColor = currentTheme ? "255, 255, 255" : "0, 0, 0";
    const starCount = currentTheme ? 150 : 100; // More stars in dark mode
    
    // Reinitialize stars if theme changed and count needs to be adjusted
    if (starsRef.current.length !== starCount && isInitialized.current) {
      starsRef.current = initStars(starCount);
    }

    // Draw each star
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${starColor}, ${star.opacity})`;
      ctx.fill();
    });
  };

  // Animate stars
  const animateStars = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    starsRef.current.forEach((star) => {
      // Move stars
      star.y += star.speed;

      // Reset stars that go off the bottom of the screen
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    drawStars();
    animationFrameRef.current = requestAnimationFrame(animateStars);
  };

  // Resize canvas to match window size
  const handleResize = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Initialize stars on resize
    const starCount = isDarkMode.current ? 150 : 100;
    starsRef.current = initStars(starCount);
    drawStars();
    
    isInitialized.current = true;
  };

  // Monitor theme changes
  const setupThemeObserver = () => {
    const callback = (mutationsList: MutationRecord[]) => {
      for (const mutation of mutationsList) {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          isDarkMode.current = document.documentElement.classList.contains("dark");
          drawStars();
        }
      }
    };

    observerRef.current = new MutationObserver(callback);
    observerRef.current.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
  };

  useEffect(() => {
    console.log("StarBackground mounted");
    
    // Initial setup with a short delay to ensure DOM is ready
    setTimeout(() => {
      handleResize();
      setupThemeObserver();
      
      // Start animation
      animationFrameRef.current = requestAnimationFrame(animateStars);
      
      // Add resize event listener
      window.addEventListener("resize", handleResize);
    }, 100);

    // Cleanup
    return () => {
      console.log("StarBackground unmounted");
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ pointerEvents: "none" }}
    />
  );
};

export default StarBackground; 