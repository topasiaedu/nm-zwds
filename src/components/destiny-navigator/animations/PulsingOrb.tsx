/**
 * PulsingOrb Component
 * Creates a pulsing orb with particle ring effect
 */

import React, { useCallback, useEffect, useRef } from "react";

/**
 * Particle properties for the ring effect
 */
interface Particle {
  angle: number;
  radius: number;
  size: number;
  opacity: number;
  speed: number;
}

/**
 * Component props
 */
interface PulsingOrbProps {
  size?: number; // Orb diameter in pixels (default: 120)
  color?: string; // RGB color string (default: "6, 182, 212" - cyan)
  pulseSpeed?: number; // Pulse cycle duration in ms (default: 2000)
  particleCount?: number; // Number of particles in ring (default: 24)
}

/**
 * PulsingOrb - Animated orb with glowing particle ring
 */
const PulsingOrb: React.FC<PulsingOrbProps> = ({
  size = 120,
  color = "6, 182, 212",
  pulseSpeed = 2000,
  particleCount = 24
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  /**
   * Initialize particles in a ring formation
   */
  const initParticles = useCallback((): Particle[] => {
    const particles: Particle[] = [];
    const angleStep = (Math.PI * 2) / particleCount;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        angle: angleStep * i,
        radius: size / 2 + 20,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.3,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    return particles;
  }, [particleCount, size]);

  /**
   * Draw the orb and particles
   */
  const draw = useCallback((): void => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Calculate pulse scale (oscillates between 0.9 and 1.1)
    const elapsed = Date.now() - startTimeRef.current;
    const pulsePhase = (elapsed % pulseSpeed) / pulseSpeed;
    const pulseScale = 0.9 + Math.sin(pulsePhase * Math.PI * 2) * 0.1;

    // Draw main orb with gradient
    const orbRadius = (size / 2) * pulseScale;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      orbRadius
    );
    gradient.addColorStop(0, `rgba(${color}, 0.8)`);
    gradient.addColorStop(0.5, `rgba(${color}, 0.4)`);
    gradient.addColorStop(1, `rgba(${color}, 0)`);

    ctx.beginPath();
    ctx.arc(centerX, centerY, orbRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw outer glow
    const glowGradient = ctx.createRadialGradient(
      centerX,
      centerY,
      orbRadius,
      centerX,
      centerY,
      orbRadius * 1.5
    );
    glowGradient.addColorStop(0, `rgba(${color}, 0.3)`);
    glowGradient.addColorStop(1, `rgba(${color}, 0)`);

    ctx.beginPath();
    ctx.arc(centerX, centerY, orbRadius * 1.5, 0, Math.PI * 2);
    ctx.fillStyle = glowGradient;
    ctx.fill();

    // Draw particles
    particlesRef.current.forEach((particle) => {
      const x = centerX + Math.cos(particle.angle) * particle.radius;
      const y = centerY + Math.sin(particle.angle) * particle.radius;

      const particleGradient = ctx.createRadialGradient(x, y, 0, x, y, particle.size * 2);
      particleGradient.addColorStop(0, `rgba(${color}, ${particle.opacity})`);
      particleGradient.addColorStop(1, `rgba(${color}, 0)`);

      ctx.beginPath();
      ctx.arc(x, y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = particleGradient;
      ctx.fill();

      // Update particle angle for rotation
      particle.angle += particle.speed;
    });

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [color, pulseSpeed, size]);

  /**
   * Setup and cleanup
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    const canvasSize = size * 2 + 80; // Extra space for particles
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    // Initialize particles
    particlesRef.current = initParticles();
    startTimeRef.current = Date.now();

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      // Draw once without animation
      draw();
      return;
    }

    // Start animation
    animationFrameRef.current = requestAnimationFrame(draw);

    // Cleanup
    return (): void => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [color, draw, initParticles, particleCount, pulseSpeed, size]);

  return (
    <canvas
      ref={canvasRef}
      className="mx-auto"
      style={{ pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
};

export default PulsingOrb;














