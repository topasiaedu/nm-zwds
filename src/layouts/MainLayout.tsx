import React, { ReactNode } from "react";
import PageTransition from "../components/PageTransition";
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
 * and handles the theme switching and page transitions
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  // Note: Removed popstate handler as it was causing performance issues
  // The ErrorBoundary and optimized context loading should handle navigation issues

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gray-50 dark:bg-gray-900 transition-colors duration-500">
      {/* Background animation removed to fix memory leak */}
      
      {/* Navbar with circular buttons */}
      <Navbar />
      
      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 pt-16">
        {/* Page content with transitions */}
        <PageTransition>
          {children}
        </PageTransition>
      </div>
    </div>
  );
};

export default MainLayout; 