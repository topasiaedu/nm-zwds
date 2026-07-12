import React from "react";
import { PrintSparkle } from "./PrintSparkle";

export const SectionPill: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children, color = "#c9873a",
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
    <PrintSparkle size={10} color={color} />
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color, margin: 0 }}>
      {children}
    </p>
  </div>
);
