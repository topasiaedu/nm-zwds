import React, { useCallback, useEffect, useRef } from "react";

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
 * with parallax scrolling effect
 */
const StarryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const stars = useRef<Star[]>([]);
  const isRunning = useRef<boolean>(false);
  const lastFrameTime = useRef<number>(0);
  const isPageVisible = useRef<boolean>(true);
  const animationPaused = useRef<boolean>(false);
  const scrollY = useRef<number>(0);
  const isDarkMode = useRef<boolean>(
    document.documentElement.classList.contains("dark") ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );
  
  /**
   * Initialize stars with random positions, sizes, directions and speeds
   */
  const initStars = useCallback((count: number): Star[] => {
    const newStars: Star[] = [];
    // Create a canvas area larger than viewport to accommodate parallax scrolling
    const areaWidth = window.innerWidth;
    const areaHeight = window.innerHeight * 2; // Extend vertically for scrolling
    
    for (let i = 0; i < count; i++) {
      // Use more subtle opacity values
      const baseOpacity = isDarkMode.current ? (Math.random() * 0.4 + 0.1) : (Math.random() * 0.5 + 0.3); // Higher opacity in light mode
      
      // Random angle for direction
      const angle = Math.random() * Math.PI * 2;
      
      newStars.push({
        x: Math.random() * areaWidth,
        y: Math.random() * areaHeight, // Distribute stars over extended area
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
  }, [isDarkMode]);
  
  /**
   * Draw a star on the canvas
   */
  const drawStar = useCallback((
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    opacity: number
  ): void => {
    const glow = radius * 2;
    
    // Create a radial gradient for the star's glow
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, glow);
    const starColor = isDarkMode.current ? "255, 255, 255" : "120, 80, 180"; // Darker purple for better visibility in light mode
    
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
  }, [isDarkMode]);
  
  /**
   * Calculate distance between two points
   */
  const calculateDistance = useCallback((x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);
  
  /**
   * Draw connections between nearby stars to form constellations
   */
  const drawConstellations = useCallback((ctx: CanvasRenderingContext2D, stars: Star[], parallaxOffset: number): void => {
    const threshold = 120; // Maximum distance to connect stars (reduced for subtlety)
    const maxConnections = 2; // Maximum connections per star (reduced for fewer lines)
    
    ctx.beginPath();
    
    const starColor = isDarkMode.current ? "255, 255, 255" : "120, 80, 180"; // Darker purple for better visibility in light mode
    
    for (let i = 0; i < stars.length; i++) {
      let connections = 0;
      
      // Apply parallax transformation for star positions during constellation drawing
      const starY1 = stars[i].y - parallaxOffset;
      
      // Skip stars that are out of view
      if (starY1 < -50 || starY1 > window.innerHeight + 50) continue;
      
      for (let j = 0; j < stars.length; j++) {
        if (i === j) continue;
        
        // Apply parallax transformation for comparison star
        const starY2 = stars[j].y - parallaxOffset;
        
        // Skip stars that are out of view
        if (starY2 < -50 || starY2 > window.innerHeight + 50) continue;
        
        const distance = calculateDistance(
          stars[i].x,
          starY1,
          stars[j].x,
          starY2
        );
        
        if (distance < threshold && connections < maxConnections) {
          // Increased opacity for better visibility while still maintaining subtlety
          const lineOpacity = isDarkMode.current ? 0.15 : 0.2; // Higher opacity for light mode
          
          ctx.strokeStyle = isDarkMode.current 
            ? `rgba(${starColor}, ${lineOpacity})` 
            : `rgba(${starColor}, ${lineOpacity})`;
          
          ctx.lineWidth = 0.4; // Slightly thicker lines for better visibility
          
          ctx.beginPath();
          ctx.moveTo(stars[i].x, starY1);
          ctx.lineTo(stars[j].x, starY2);
          ctx.stroke();
          
          connections++;
        }
      }
    }
  }, [calculateDistance, isDarkMode]);
  
  /**
   * Animate the stars with random movement, very slow flickering, and parallax scrolling
   */
  const animate = useCallback((timestamp: number): void => {
    // Skip if paused or already running
    if (animationPaused.current) {
      return;
    }
    
    if (isRunning.current) {
      // If already running, queue next frame and exit
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    isRunning.current = true;
    
    // Calculate delta time for smooth animation regardless of frame rate
    const deltaTime = timestamp - (lastFrameTime.current || timestamp);
    lastFrameTime.current = timestamp;
    
    const canvas = canvasRef.current;
    if (!canvas) {
      isRunning.current = false;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      isRunning.current = false;
      animationRef.current = requestAnimationFrame(animate);
      return;
    }
    
    // Check if canvas dimensions match window (if not, resize it)
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    
    // Calculate parallax effect based on scroll position
    // Use a factor of 0.4 to make the stars move slower than the content (parallax effect)
    const parallaxOffset = scrollY.current * 0.4;
    
    // Only clear if we have stars to draw
    if (stars.current.length > 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update star positions and opacities with deltaTime for frame-rate independence
      const speedFactor = Math.min(deltaTime / 16.67, 3); // Normalize based on 60fps, cap at 3x
      
      stars.current.forEach((star) => {
        // Very slow random movement adjusted by deltaTime
        star.x += star.directionX * star.speed * speedFactor;
        star.y += star.directionY * star.speed * speedFactor;
        
        // Wrap around edges with extended vertical boundaries for scrolling
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = window.innerHeight * 2;
        if (star.y > window.innerHeight * 2) star.y = 0;
        
        // Add extremely slow twinkling effect adjusted by deltaTime
        star.opacity = Math.max(
          star.baseOpacity - 0.1, 
          Math.min(
            star.baseOpacity + 0.1, 
            star.opacity + (star.flickerSpeed * star.flickerDirection * speedFactor)
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
      drawConstellations(ctx, stars.current, parallaxOffset);
      
      // Draw each star with parallax effect
      stars.current.forEach((star) => {
        // Apply parallax to y-position
        const parallaxY = star.y - parallaxOffset;
        
        // Only draw stars that are in or near the viewport
        if (parallaxY >= -50 && parallaxY <= window.innerHeight + 50) {
          drawStar(ctx, star.x, parallaxY, star.radius, star.opacity);
        }
      });
    } else {
      console.warn("StarryBackground: No stars to animate, reinitializing");
      // Reinitialize stars if they're missing
      const starCount = isDarkMode.current ? 80 : 60;
      stars.current = initStars(starCount);
    }
    
    // Reset running flag and request next frame if not paused
    isRunning.current = false;
    if (!animationPaused.current) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      animationRef.current = 0;
    }
  }, [
    animationPaused,
    animationRef,
    canvasRef,
    drawConstellations,
    drawStar,
    initStars,
    isDarkMode,
    isRunning,
    lastFrameTime,
    scrollY,
    stars
  ]);
  
  /**
   * Start the animation loop
   */
  const startAnimation = useCallback((): void => {
    if (animationPaused.current) {
      return;
    }
    
    if (animationRef.current) {
      return;
    }
    
    isRunning.current = false; // Reset this to ensure animate() will run
    animationRef.current = requestAnimationFrame(animate);
  }, [animate, animationPaused, animationRef, isRunning]);
  
  /**
   * Stop the animation loop
   */
  const stopAnimation = useCallback((): void => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = 0;
    }
  }, [animationRef]);
  
  /**
   * Pause the animation (when page is not visible)
   */
  const pauseAnimation = useCallback((): void => {
    animationPaused.current = true;
    stopAnimation();
  }, [animationPaused, stopAnimation]);
  
  /**
   * Resume the animation (when page becomes visible again)
   */
  const resumeAnimation = useCallback((): void => {
    animationPaused.current = false;
    startAnimation();
  }, [animationPaused, startAnimation]);
  
  /**
   * Set up canvas and stars, start animation
   */
  useEffect(() => {
    
    const canvas = canvasRef.current;
    if (!canvas) {
      console.error("StarryBackground: Cannot get canvas reference");
      return;
    }
    
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
          const newIsDarkMode = document.documentElement.classList.contains("dark");
          if (isDarkMode.current !== newIsDarkMode) {
            isDarkMode.current = newIsDarkMode;
          }
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    // Initialize fewer stars for subtlety but more to cover the extended area
    const starCount = isDarkMode.current ? 120 : 100;
    stars.current = initStars(starCount);
    
    // Track scroll position for parallax effect
    const handleScroll = (): void => {
      scrollY.current = window.scrollY;
    };
    
    window.addEventListener("scroll", handleScroll);
    // Initialize with current scroll position
    scrollY.current = window.scrollY;
    
    // Page visibility detection for performance optimization
    const handleVisibilityChange = (): void => {
      if (document.hidden) {
        isPageVisible.current = false;
        pauseAnimation();
      } else {
        isPageVisible.current = true;
        resumeAnimation();
      }
    };
    
    // Add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange);
    
    // Handle window focus/blur events as additional visibility indicators
    window.addEventListener("focus", () => {
      if (!isPageVisible.current) {
        isPageVisible.current = true;
        resumeAnimation();
      }
    });
    
    window.addEventListener("blur", () => {
      isPageVisible.current = false;
      pauseAnimation();
    });
    
    // Start animation
    startAnimation();
    
    // Handle window resize with debounce to prevent performance issues
    let resizeTimeout: number | null = null;
    
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
            y: Math.random() * window.innerHeight * 2, // Account for extended area
          };
        }
        return star;
      });
    };
    
    const debouncedResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(handleResize, 150);
    };
    
    window.addEventListener("resize", debouncedResize);
    
    // Ensure animation continues even if there's a momentary hiccup
    const intervalCheck = setInterval(() => {
      if (!animationRef.current && !animationPaused.current) {
        startAnimation();
      }
    }, 2000);
    
    // IntersectionObserver to detect if canvas is visible
    const intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (animationPaused.current) {
            resumeAnimation();
          }
        } else {
          if (!animationPaused.current) {
            pauseAnimation();
          }
        }
      });
    }, { threshold: 0.1 });
    
    intersectionObserver.observe(canvas);
    
    // Cleanup function
    return () => {
      stopAnimation();
      
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      
      clearInterval(intervalCheck);
      
      window.removeEventListener("scroll", handleScroll);
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", resumeAnimation);
      window.removeEventListener("blur", pauseAnimation);
      observer.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", debouncedResize);
    };
  }, [initStars, pauseAnimation, resumeAnimation, startAnimation, stopAnimation]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 h-screen w-full"
      style={{ 
        pointerEvents: "none",
        zIndex: 0 
      }}
      aria-hidden="true"
    />
  );
};

export default StarryBackground; 