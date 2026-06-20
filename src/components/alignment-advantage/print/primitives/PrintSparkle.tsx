import React from "react";

export const PrintSparkle: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 14, color = "#c9873a", style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" style={style}>
    <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" />
  </svg>
);
