import React from "react";
import { PrintSparkle } from "./PrintSparkle";

export const ChapterOpener: React.FC<{
  number: string;
  title: string;
  subtitle: string;
}> = ({ number, title, subtitle }) => (
  <section
    className="print-page-break print-avoid-break"
    style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #1a1e3f 0%, #2d1b4e 55%, #1a1e3f 100%)",
      display: "flex", flexDirection: "column",
      justifyContent: "center", alignItems: "flex-start",
      padding: "80px 64px",
      margin: "0 -24px",
      position: "relative", overflow: "hidden",
    }}
  >
    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(201,135,58,0.65)", marginBottom: 20 }}>
      CHAPTER · {number}
    </p>
    <p style={{ fontSize: 80, fontWeight: 900, color: "#c9873a", fontStyle: "italic", lineHeight: 0.9, margin: "0 0 16px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {number}.
    </p>
    <h2 style={{ fontSize: 48, fontWeight: 800, color: "#ffffff", lineHeight: 1.1, margin: "0 0 16px", fontFamily: "Georgia, 'Times New Roman', serif", maxWidth: 520 }}>
      {title}
    </h2>
    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>{subtitle}</p>
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #c9873a, #be3e50, #d97706)" }} />
    <PrintSparkle size={22} color="rgba(201,135,58,0.25)" style={{ position: "absolute", top: 64, right: 80 }} />
    <PrintSparkle size={13} color="rgba(201,135,58,0.18)" style={{ position: "absolute", top: 130, right: 148 }} />
    <PrintSparkle size={8} color="rgba(201,135,58,0.13)" style={{ position: "absolute", bottom: 90, left: 110 }} />
    <PrintSparkle size={16} color="rgba(255,255,255,0.08)" style={{ position: "absolute", bottom: 160, right: 60 }} />
  </section>
);
