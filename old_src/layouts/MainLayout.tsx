import React from "react";
import { DarkThemeToggle } from "flowbite-react";
import { StarBackground } from "../components/StarBackground";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden px-4 sm:px-6 lg:px-8">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <DarkThemeToggle />
      </div>
      
      {/* Animated Night Sky Background */}
      <StarBackground />

      {/* Main Content */}
      {children}
    </div>
  );
}; 