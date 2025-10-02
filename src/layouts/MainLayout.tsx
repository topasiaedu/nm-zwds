import React, { ReactNode } from "react";
// Removed StarryBackground import to fix memory leak
import Navbar from "../components/navbar";

/**
 * Props for the MainLayout component
 */
interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Main layout component that wraps the entire application
 * 
 * Note: AnimatePresence and PageTransition removed from here to fix:
 * 1. Blank page issue on back navigation (caused by double-nesting)
 * 2. Laggy transitions (caused by AnimatePresence mode="wait" coordination issues)
 * 
 * Each individual page component now handles its own PageTransition independently.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Background animation removed to fix memory leak */}
      
      {/* Navbar with circular buttons */}
      <Navbar />
      
      {/* Main content - No animation wrapper, pages handle their own transitions */}
      <div className="relative z-10 container mx-auto px-4 pt-16">
        {children}
      </div>
    </div>
  );
};

export default MainLayout; 