import { useEffect, useRef } from "react";
import { Star, Line } from "../types/star";
import { constellationData } from "../utils/constellationData";

interface UseStarAnimationProps {
  maxStars?: number;
  maxDistance?: number;
  numConstellations?: number;
}

export const useStarAnimation = ({
  maxStars = 150,
  maxDistance = 200,
  numConstellations = 2
}: UseStarAnimationProps = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stars = useRef<Star[]>([]);
  const lines = useRef<Line[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Initialize stars with constellations
    const initStars = (): void => {
      if (!canvas) return;
      stars.current = [];
      
      // Add constellation stars first
      const selectedConstellations = constellationData
        .sort(() => Math.random() - 0.5)
        .slice(0, Math.floor(Math.random() * (numConstellations - 1)) + 2);

      selectedConstellations.forEach(constellation => {
        const constellationStars: Star[] = constellation.points.map(point => ({
          x: point.x * canvas.width,
          y: point.y * canvas.height,
          radius: Math.random() * 0.5 + 1.2,
          alpha: 0.8,
          speed: Math.random() * 0.02,
          dx: (Math.random() - 0.5) * 0.05,
          dy: (Math.random() - 0.5) * 0.05,
          isConstellation: true
        }));
        
        stars.current.push(...constellationStars);

        // Add constellation lines
        constellation.connections.forEach(([startIdx, endIdx]) => {
          const startStar = constellationStars[startIdx];
          const endStar = constellationStars[endIdx];
          if (startStar && endStar) {
            lines.current.push({
              start: startStar,
              end: endStar,
              opacity: 0.4,
              isConstellation: true
            });
          }
        });
      });
      
      // Add random stars
      const remainingStars = maxStars - stars.current.length;
      for (let i = 0; i < remainingStars; i++) {
        stars.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5 + 0.2,
          alpha: Math.random() * 0.6 + 0.1,
          speed: Math.random() * 0.05,
          dx: (Math.random() - 0.5) * 0.2,
          dy: (Math.random() - 0.5) * 0.2
        });
      }
    };

    // Handle resize
    const handleResize = (): void => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initStars();
    };

    // Calculate distance between stars
    const calculateDistance = (star1: Star, star2: Star): number => {
      const dx = star1.x - star2.x;
      const dy = star1.y - star2.y;
      return Math.sqrt(dx * dx + dy * dy);
    };

    // Update constellation lines
    const updateLines = (): void => {
      lines.current = lines.current.filter(line => line.isConstellation);
      
      for (let i = 0; i < stars.current.length; i++) {
        let connections = 0;
        const maxConnections = stars.current[i].isConstellation ? 4 : 2;
        
        for (let j = 0; j < stars.current.length; j++) {
          if (i !== j && connections < maxConnections) {
            const distance = calculateDistance(stars.current[i], stars.current[j]);
            
            if (distance < maxDistance) {
              const opacity = 0.15 * (1 - distance / maxDistance);
              
              if (opacity > 0.02) {
                lines.current.push({
                  start: stars.current[i],
                  end: stars.current[j],
                  opacity: opacity
                });
                connections++;
              }
            }
          }
        }
      }
    };

    // Animation loop
    const animate = (): void => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Create gradient based on theme
      const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
      const isDark = document.documentElement.classList.contains("dark");
      
      if (isDark) {
        gradient.addColorStop(0, "#0a1029");
        gradient.addColorStop(1, "#1a1b3a");
      } else {
        gradient.addColorStop(0, "#f8fafc");
        gradient.addColorStop(1, "#f1f5f9");
      }
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, canvas.width, canvas.height);

      updateLines();
      
      // Draw Lines
      context.lineWidth = isDark ? 0.3 : 0.4;
      lines.current.forEach((line) => {
        context.beginPath();
        context.moveTo(line.start.x, line.start.y);
        context.lineTo(line.end.x, line.end.y);
        
        context.shadowBlur = line.isConstellation ? 4 : 2;
        context.shadowColor = isDark 
          ? `rgba(255, 255, 255, ${line.isConstellation ? 0.4 : 0.2})`
          : `rgba(99, 102, 241, ${line.isConstellation ? 0.4 : 0.2})`;
        
        context.strokeStyle = isDark
          ? `rgba(255, 255, 255, ${line.isConstellation ? line.opacity * 2 : line.opacity * 1.5})`
          : `rgba(99, 102, 241, ${line.isConstellation ? line.opacity * 2.5 : line.opacity * 2})`;
        context.stroke();
        
        context.shadowBlur = 0;
      });

      // Update and draw stars
      stars.current.forEach((star) => {
        if (!star.isConstellation) {
          star.x += star.dx;
          star.y += star.dy;

          if (star.x < 0 || star.x > canvas.width) star.dx *= -1;
          if (star.y < 0 || star.y > canvas.height) star.dy *= -1;

          star.x = Math.max(0, Math.min(canvas.width, star.x));
          star.y = Math.max(0, Math.min(canvas.height, star.y));
        } else {
          star.x += star.dx * 0.2;
          star.y += star.dy * 0.2;
          
          if (Math.abs(star.x - (star.x % canvas.width)) > canvas.width * 0.1) star.dx *= -1;
          if (Math.abs(star.y - (star.y % canvas.height)) > canvas.height * 0.1) star.dy *= -1;
        }

        // Draw star
        context.beginPath();
        context.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        
        const glow = context.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.radius * (star.isConstellation ? 3 : 2)
        );
        
        if (isDark) {
          glow.addColorStop(0, `rgba(255, 255, 255, ${star.isConstellation ? star.alpha * 1.2 : star.alpha})`);
          glow.addColorStop(1, "rgba(255, 255, 255, 0)");
        } else {
          glow.addColorStop(0, `rgba(99, 102, 241, ${star.isConstellation ? star.alpha * 1.2 : star.alpha})`);
          glow.addColorStop(1, "rgba(99, 102, 241, 0)");
        }
        
        context.fillStyle = glow;
        context.fill();
        
        if (star.isConstellation || star.radius > 0.8) {
          context.beginPath();
          context.arc(star.x, star.y, star.radius * 0.5, 0, Math.PI * 2);
          context.fillStyle = isDark 
            ? `rgba(255, 255, 255, ${star.alpha + (star.isConstellation ? 0.3 : 0.2)})`
            : `rgba(99, 102, 241, ${star.alpha + (star.isConstellation ? 0.3 : 0.2)})`;
          context.fill();
        }

        // Twinkle effect
        star.alpha += (Math.random() - 0.5) * (star.isConstellation ? star.speed * 0.5 : star.speed);
        if (star.alpha > (star.isConstellation ? 0.9 : 0.7)) star.alpha = star.isConstellation ? 0.9 : 0.7;
        if (star.alpha < (star.isConstellation ? 0.3 : 0.1)) star.alpha = star.isConstellation ? 0.3 : 0.1;
      });

      requestAnimationFrame(animate);
    };

    // Watch for theme changes
    const observer = new MutationObserver(() => {
      requestAnimationFrame(animate);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("resize", handleResize);
    handleResize();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, [maxStars, maxDistance, numConstellations]);

  return canvasRef;
}; 