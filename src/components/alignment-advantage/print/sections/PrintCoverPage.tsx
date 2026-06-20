import React from "react";
import type { Profile } from "../../../../context/ProfileContext";

/** Full-bleed cover page for the Alignment Advantage print playbook. */
export interface PrintCoverPageProps {
  profile: Profile;
}

export const PrintCoverPage: React.FC<PrintCoverPageProps> = ({ profile }) => (
  <section
    className="print-cover-page"
    aria-label="Playbook cover"
    style={{
      position: "relative",
      overflow: "hidden",
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(160deg, #1a1e3f 0%, #2d1b4e 50%, #4a3f6b 100%)",
      padding: "80px 48px",
      textAlign: "center",
      margin: "0 -24px",
    }}
  >
    <div style={{ width: 48, height: 3, background: "#d4b896", borderRadius: 2, marginBottom: 32 }} aria-hidden="true" />

    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.28em", textTransform: "uppercase", color: "#c9873a", marginBottom: 20 }}>
      ✦ The Alignment Advantage ✦
    </p>
    <h1 style={{ fontSize: 52, fontWeight: 900, color: "#ffffff", lineHeight: 1.05, marginBottom: 12, fontFamily: "Georgia, 'Times New Roman', serif" }}>
      <span style={{ color: "#c9873a", fontStyle: "italic" }}>Strategic</span>{" "}
      <span>Playbook</span>
    </h1>
    <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", marginBottom: 64, letterSpacing: "0.06em" }}>
      Personalised Strategic Report · {new Date().getFullYear()}
    </p>

    <div style={{
      background: "rgba(255,255,255,0.07)",
      border: "1px solid rgba(212,184,150,0.25)",
      borderRadius: 16,
      padding: "32px 40px",
      width: "100%",
      maxWidth: 400,
      textAlign: "left",
    }}>
      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4b896", marginBottom: 20, textAlign: "center" }}>
        Profile
      </p>
      {[
        ["Name", profile.name],
        ["Gender", profile.gender === "male" ? "Male" : "Female"],
        ["Birth Date", new Date(`${profile.birthday}T12:00:00`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })],
      ].map(([label, value]) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{label}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#ffffff" }}>{value}</span>
        </div>
      ))}
    </div>

    <p style={{ marginTop: 48, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
      Generated {new Date().toLocaleDateString("en-US")} · Confidential
    </p>

    <svg
      viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ position: "absolute", bottom: 32, right: 40, width: 160, height: 160, opacity: 0.12 }}
    >
      <circle cx="90" cy="90" r="88" stroke="#d4b896" strokeWidth="1"/>
      <circle cx="90" cy="90" r="60" stroke="#d4b896" strokeWidth="0.8"/>
      <circle cx="90" cy="90" r="30" stroke="#d4b896" strokeWidth="0.8"/>
      {([0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        const inner = i % 3 === 0 ? 30 : i % 3 === 1 ? 40 : 50;
        return (
          <line key={i}
            x1={90 + inner * Math.cos(r)} y1={90 + inner * Math.sin(r)}
            x2={90 + 88 * Math.cos(r)} y2={90 + 88 * Math.sin(r)}
            stroke="#d4b896" strokeWidth={i % 3 === 0 ? 1.2 : 0.6} strokeLinecap="round"
          />
        );
      })}
      <path d="M90 2 L96 26 L90 20 L84 26 Z" fill="#d4b896"/>
      <path d="M90 178 L96 154 L90 160 L84 154 Z" fill="#d4b896" opacity="0.6"/>
      <path d="M2 90 L26 84 L20 90 L26 96 Z" fill="#d4b896" opacity="0.6"/>
      <path d="M178 90 L154 84 L160 90 L154 96 Z" fill="#d4b896" opacity="0.6"/>
      <circle cx="90" cy="90" r="6" fill="#d4b896"/>
    </svg>

    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #c9873a, #be3e50, #d97706)" }} />
  </section>
);
