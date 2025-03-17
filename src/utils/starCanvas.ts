/**
 * This file is deprecated and has been replaced by the StarBackground component.
 * It exists only for backwards compatibility.
 */

/**
 * Star canvas animation utility
 * Creates an animated star field with constellations that adapts to light and dark mode
 */

interface Star {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  speed: number;
  twinkleSpeed: number;
  twinkleDirection: number;
}

interface Constellation {
  stars: { x: number; y: number }[];
  opacity: number;
}

// Function that doesn't return anything (void)
const initStarCanvas = (): void => {
  console.log("Initializing star canvas");
  
  const canvas = document.getElementById("starCanvas") as HTMLCanvasElement;
  if (!canvas) {
    console.error("Canvas element not found");
    return;
  }
  
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    console.error("Could not get canvas 2d context");
    return;
  }
  
  // Setting canvas dimensions
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  // Create stars
  const stars: Star[] = [];
  const starCount = 100; // Reduced count for subtlety
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3, // Smaller stars for subtlety
      opacity: Math.random() * 0.5 + 0.1, // Lower opacity for subtlety
      speed: Math.random() * 0.02 + 0.005, // Slower movement
      twinkleSpeed: Math.random() * 0.005 + 0.002, // Slower twinkling
      twinkleDirection: Math.random() > 0.5 ? 1 : -1,
    });
  }
  
  // Create constellations
  const constellations: Constellation[] = [];
  const constellationCount = 6;
  
  for (let i = 0; i < constellationCount; i++) {
    const centerX = Math.random() * canvas.width;
    const centerY = Math.random() * canvas.height;
    const constellationStars = [];
    const pointCount = Math.floor(Math.random() * 6) + 3; // 3-8 stars per constellation
    
    // Create constellation points in a cluster
    for (let j = 0; j < pointCount; j++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * 150 + 30;
      constellationStars.push({
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance
      });
    }
    
    constellations.push({
      stars: constellationStars,
      opacity: Math.random() * 0.3 + 0.1 // Subtle lines
    });
  }
  
  // Handle window resize
  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  
  window.addEventListener("resize", handleResize);
  
  // Animation function
  const animate = () => {
    if (!ctx) return;
    
    // Get theme
    const isDarkTheme = document.documentElement.classList.contains("dark");
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw constellations
    constellations.forEach(constellation => {
      if (constellation.stars.length < 2) return;
      
      // Set line color based on theme
      if (isDarkTheme) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${constellation.opacity * 0.7})`;
      } else {
        ctx.strokeStyle = `rgba(50, 50, 75, ${constellation.opacity * 0.5})`;
      }
      
      ctx.lineWidth = 0.3;
      ctx.beginPath();
      
      // Draw lines connecting stars
      ctx.moveTo(constellation.stars[0].x, constellation.stars[0].y);
      for (let i = 1; i < constellation.stars.length; i++) {
        ctx.lineTo(constellation.stars[i].x, constellation.stars[i].y);
      }
      
      ctx.stroke();
    });
    
    // Draw stars
    stars.forEach((star) => {
      // Move stars very slowly
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
      
      // Twinkle effect
      star.opacity += star.twinkleSpeed * star.twinkleDirection;
      if (star.opacity >= 0.6) {
        star.opacity = 0.6;
        star.twinkleDirection = -1;
      } else if (star.opacity <= 0.1) {
        star.opacity = 0.1;
        star.twinkleDirection = 1;
      }
      
      // Draw star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      
      // Set color based on theme
      if (isDarkTheme) {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      } else {
        ctx.fillStyle = `rgba(50, 50, 75, ${star.opacity * 0.7})`;
      }
      
      ctx.fill();
    });
    
    // Rare shooting stars (reduced frequency)
    if (Math.random() < 0.005) { // Much rarer shooting stars
      const shootingStar = {
        startX: Math.random() * canvas.width,
        startY: Math.random() * (canvas.height / 3),
        length: Math.random() * 60 + 30,
        angle: Math.PI / 4 + (Math.random() * Math.PI / 4),
        speed: Math.random() * 10 + 5,
        progress: 0,
      };
      
      // Animate the shooting star
      const animateShootingStar = () => {
        if (!ctx) return;
        
        shootingStar.progress += 0.03;
        
        if (shootingStar.progress <= 1) {
          const currentX = shootingStar.startX + Math.cos(shootingStar.angle) * shootingStar.speed * shootingStar.progress * 10;
          const currentY = shootingStar.startY + Math.sin(shootingStar.angle) * shootingStar.speed * shootingStar.progress * 10;
          
          // Create gradient for shooting star
          const gradient = ctx.createLinearGradient(
            currentX, 
            currentY, 
            currentX - Math.cos(shootingStar.angle) * shootingStar.length * (1 - shootingStar.progress),
            currentY - Math.sin(shootingStar.angle) * shootingStar.length * (1 - shootingStar.progress)
          );
          
          if (isDarkTheme) {
            gradient.addColorStop(0, "rgba(255, 255, 255, 0.7)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          } else {
            gradient.addColorStop(0, "rgba(50, 50, 75, 0.5)");
            gradient.addColorStop(1, "rgba(50, 50, 75, 0)");
          }
          
          ctx.beginPath();
          ctx.moveTo(currentX, currentY);
          ctx.lineTo(
            currentX - Math.cos(shootingStar.angle) * shootingStar.length * (1 - shootingStar.progress),
            currentY - Math.sin(shootingStar.angle) * shootingStar.length * (1 - shootingStar.progress)
          );
          ctx.strokeStyle = gradient;
          ctx.lineWidth = 1.5;
          ctx.stroke();
          
          requestAnimationFrame(animateShootingStar);
        }
      };
      
      animateShootingStar();
    }
    
    requestAnimationFrame(animate);
  };
  
  // Start animation
  animate();
  
  // No return value, the function is void
  window.addEventListener("unload", () => {
    window.removeEventListener("resize", handleResize);
  });
}; 

export default initStarCanvas; 