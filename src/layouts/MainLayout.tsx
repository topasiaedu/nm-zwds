import React, { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/navbar";

/**
 * Props for the MainLayout component
 */
interface MainLayoutProps {
  children: ReactNode;
}

/**
 * Routes that own a fixed full-viewport shell (Command Centre / Document Viewer).
 * Skip MainLayout padding so no leftover top gap under the hidden navbar.
 */
const FULLSCREEN_SHELL_ROUTES = [
  "/dashboard",
  "/calculate",
  "/alignment-advantage",
  "/monthly-consultation",
  "/chart",
  "/result",
  "/tier3-result",
  "/founder-report",
  "/timing-chart",
  "/destiny-navigator",
  "/destiny-wealth-navigator",
  "/profile",
  "/settings",
];

/**
 * Main layout wrapper. Most pages get navbar + padded container; shell pages
 * render edge-to-edge without the global chrome.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const location = useLocation();
  const isFullscreenShell = FULLSCREEN_SHELL_ROUTES.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(`${route}/`)
  );

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-surface-cream dark:bg-surface-dark transition-colors duration-500">
      <Navbar />
      <div
        className={
          isFullscreenShell
            ? "relative z-10 w-full min-h-screen"
            : "relative z-10 container mx-auto px-4 pt-16"
        }
      >
        {children}
      </div>
    </div>
  );
};

export default MainLayout;
