import React from "react";

export const SectionGraphic: React.FC<{ type: string }> = ({ type }) => {
  const base = "absolute -top-10 -right-10 w-64 h-64 opacity-[0.06] text-[#e8642d] pointer-events-none";
  if (type === "design") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
      <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" />
      <path d="M50 5 L50 95 M5 25 L95 75 M5 75 L95 25" />
    </svg>
  );
  if (type === "operate") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="25" />
      <circle cx="50" cy="50" r="10" />
      <path d="M50 10 L50 90 M10 50 L90 50" strokeDasharray="2 4" />
      <circle cx="50" cy="10" r="3" fill="currentColor" />
      <circle cx="50" cy="90" r="3" fill="currentColor" />
      <circle cx="10" cy="50" r="3" fill="currentColor" />
      <circle cx="90" cy="50" r="3" fill="currentColor" />
    </svg>
  );
  if (type === "wealth") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M20 80 L50 20 L80 80 Z" />
      <path d="M35 50 L65 50" />
      <circle cx="50" cy="20" r="4" fill="currentColor" />
      <circle cx="20" cy="80" r="4" fill="currentColor" />
      <circle cx="80" cy="80" r="4" fill="currentColor" />
      <path d="M50 20 L50 80" strokeDasharray="2 4" />
    </svg>
  );
  if (type === "people") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="30" r="15" />
      <circle cx="30" cy="70" r="15" />
      <circle cx="70" cy="70" r="15" />
      <path d="M40 42 L35 55 M60 42 L65 55 M45 70 L55 70" />
    </svg>
  );
  if (type === "timing") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="50" r="40" />
      <path d="M50 10 A40 40 0 0 1 90 50" />
      <path d="M50 50 L50 20 M50 50 L70 50" strokeWidth="2" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
  if (type === "decision") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M10 20 L90 20 L60 80 L40 80 Z" />
      <path d="M25 40 L75 40 M35 60 L65 60" />
      <circle cx="50" cy="80" r="5" fill="currentColor" />
    </svg>
  );
  return null;
};
