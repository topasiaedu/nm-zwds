import React from "react";
import { motion, useInView, MotionProps } from "framer-motion";

/**
 * Props for the AnimatedWrapper component
 */
interface AnimatedWrapperProps extends MotionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  threshold?: number;
  once?: boolean;
}

/**
 * AnimatedWrapper component provides consistent animations for analysis components
 * that trigger when the element comes into view during scrolling
 */
const AnimatedWrapper: React.FC<AnimatedWrapperProps> = ({ 
  children, 
  delay = 0, 
  className = "",
  threshold = 0.2,
  once = true,
  ...motionProps 
}) => {
  // Create a ref to determine when element is in view
  const ref = React.useRef(null);
  const isInView = useInView(ref, { 
    amount: threshold,
    once
  });

  // Default animation variants
  const defaultVariants = {
    hidden: { 
      opacity: 0,
      y: 20
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={defaultVariants}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedWrapper; 