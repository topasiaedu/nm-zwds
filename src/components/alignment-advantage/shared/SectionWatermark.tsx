import React from "react";

export const SectionWatermark: React.FC<{ type: "compass" | "grid" | "nodes" | "waves" | "network" | "timeline" | "target" }> = ({ type }) => {
  const baseClass = "absolute pointer-events-none opacity-[0.03] text-[#1a1e3f] z-0";
  
  if (type === "compass") {
    return (
      <svg className={`${baseClass} -top-20 -right-20 w-[600px] h-[600px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="20" />
        <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
        <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg className={`${baseClass} top-0 right-0 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <circle cx="50" cy="50" r="20" fill="currentColor" fillOpacity="0.05" />
      </svg>
    );
  }
  if (type === "nodes") {
    return (
      <svg className={`${baseClass} -top-10 -left-10 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="20" cy="20" r="3" />
        <circle cx="80" cy="30" r="4" />
        <circle cx="40" cy="80" r="5" />
        <circle cx="70" cy="70" r="2" />
        <path d="M20 20 L80 30 L70 70 L40 80 Z" />
        <path d="M20 20 L40 80 M80 30 L70 70" />
        <circle cx="50" cy="50" r="40" strokeDasharray="1 4" />
      </svg>
    );
  }
  if (type === "waves") {
    return (
      <svg className={`${baseClass} top-20 -right-10 w-[600px] h-[600px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M0 50 Q 25 20, 50 50 T 100 50" />
        <path d="M0 60 Q 25 30, 50 60 T 100 60" />
        <path d="M0 70 Q 25 40, 50 70 T 100 70" />
        <circle cx="50" cy="50" r="10" />
      </svg>
    );
  }
  if (type === "network") {
    return (
      <svg className={`${baseClass} top-0 -left-20 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="45" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="35" />
        <path d="M50 15 L50 85 M15 50 L85 50" />
        <circle cx="50" cy="15" r="3" fill="currentColor" />
        <circle cx="50" cy="85" r="3" fill="currentColor" />
        <circle cx="15" cy="50" r="3" fill="currentColor" />
        <circle cx="85" cy="50" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (type === "timeline") {
    return (
      <svg className={`${baseClass} top-10 right-0 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <path d="M50 50 L70 30" />
        <path d="M50 50 L60 70" strokeWidth="1" />
      </svg>
    );
  }
  if (type === "target") {
    return (
      <svg className={`${baseClass} -top-10 -right-10 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.05" />
        <path d="M50 0 L50 100 M0 50 L100 50" strokeDasharray="2 4" />
      </svg>
    );
  }
  return null;
};
