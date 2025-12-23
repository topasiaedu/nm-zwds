import React from "react";
import { motion } from "framer-motion";

/**
 * Props for the PageTransition component
 */
interface PageTransitionProps {
  children: React.ReactNode;
}

/**
 * PageTransition component
 * Wraps page content with animations for smoother transitions
 */
const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
  // Animation variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.6, 1] as const,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.4, 0, 0.6, 1] as const,
      },
    },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition; 