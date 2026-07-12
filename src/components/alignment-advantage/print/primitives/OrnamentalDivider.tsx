import React from "react";
import { PrintSparkle } from "./PrintSparkle";

export const OrnamentalDivider: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", ...style }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,135,58,0.45))" }} />
    <PrintSparkle size={10} color="#c9873a" />
    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(201,135,58,0.45), transparent)" }} />
  </div>
);
