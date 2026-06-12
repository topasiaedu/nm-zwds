import React from "react";
import { C } from "./constants";

export const Sparkle: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = C.coral }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" className="shrink-0">
    <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" />
  </svg>
);
