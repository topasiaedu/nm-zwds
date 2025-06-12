import React, { useEffect, useState, ReactNode } from "react";
import { useLocation } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import { AnimatePresence } from "framer-motion";
import StarryBackground from "../components/StarryBackground"; // Use the improved StarryBackground component
import Navbar from "../components/navbar";

/**
 * Props for the MainLayout component
 */
interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps the entire application
 * and handles the theme switching and page transitions
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  // State for tracking theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

  useEffect(() => {
    // Setup theme observer
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.attributeName === "class" &&
          mutation.target === document.documentElement
        ) {
          setIsDarkMode(document.documentElement.classList.contains("dark"));
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Background animation */}
      <StarryBackground />
      
      {/* Navbar with circular buttons */}
      <Navbar />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 pt-8 lg:pt-16">
        {/* Page content with transitions */}
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            {children}
          </PageTransition>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MainLayout; 