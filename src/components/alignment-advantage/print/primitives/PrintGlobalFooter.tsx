import React from "react";
import { PrintSparkle } from "./PrintSparkle";

export const PrintGlobalFooter: React.FC<{ profileName: string }> = ({ profileName }) => (
  <div
    className="pp-global-footer"
    style={{ display: "flex", alignItems: "stretch", height: 28, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em" }}
  >
    <div style={{ flex: 1, background: "#1a1e3f", padding: "0 18px", display: "flex", alignItems: "center" }}>
      <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
        © {new Date().getFullYear()} · The Alignment Advantage · Confidential
      </span>
    </div>
    <div style={{ background: "linear-gradient(90deg, #c9873a 0%, #be3e50 60%, #d97706 100%)", padding: "0 18px", display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ color: "white", textTransform: "uppercase" }}>{profileName}</span>
      <PrintSparkle size={9} color="white" />
    </div>
  </div>
);
