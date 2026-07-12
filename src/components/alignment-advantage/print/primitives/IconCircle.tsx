import React from "react";

export const IconCircle: React.FC<{
  icon: React.ElementType;
  gradient?: string;
  size?: number;
}> = ({ icon: Icon, gradient = "linear-gradient(135deg, #6b5b95, #be3e50)", size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: gradient,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 14px rgba(107,91,149,0.28)",
  }}>
    <Icon size={Math.round(size * 0.44)} color="white" strokeWidth={1.8} />
  </div>
);
