import React from "react";
import { CheckCircle2, AlertTriangle, Users, Target, Shield } from "lucide-react";
import type { ChartData, Palace } from "../../../utils/zwds/types";
import { C, NORTHERN_MAIN_STARS, SOUTHERN_MAIN_STARS } from "../shared/constants";
import { SectionWatermark } from "../shared/SectionWatermark";
import { SectionHeader } from "../shared/SectionHeader";
import { PEOPLE_SYNTHESIS } from "../../../utils/forecast/peoplePalaceData";
import { STAR_BRIEF } from "../../../utils/forecast/starBriefDescriptions";

function getPalaceByName(palaces: Palace[], name: string): Palace | null {
  return palaces.find((p) => p.name === name) ?? null;
}

export const ChapterStakeholderIntelligence: React.FC<{
  chartData: ChartData;
}> = ({ chartData }) => {
  const peoplePalaces: Array<"夫妻" | "交友" | "父母"> = ["夫妻", "交友", "父母"];

  /** Compute dominant role across all three palaces for synthesis */
  const allPeopleStars = peoplePalaces.flatMap((pn) => {
    const p = getPalaceByName(chartData.palaces, pn);
    return p?.mainStar ?? [];
  });
  const northCount = allPeopleStars.filter((s) => NORTHERN_MAIN_STARS.has(s.name)).length;
  const southCount = allPeopleStars.filter((s) => SOUTHERN_MAIN_STARS.has(s.name)).length;
  const auxCount   = allPeopleStars.filter((s) => !NORTHERN_MAIN_STARS.has(s.name) && !SOUTHERN_MAIN_STARS.has(s.name)).length;

  const synthesisKey: "north" | "south" | "aux" | "mixed" = (() => {
    const total = northCount + southCount + auxCount;
    if (total === 0) return "mixed";
    if (northCount > 0 && southCount > 0) return "mixed";
    if (northCount >= southCount && northCount >= auxCount && northCount > 0) return "north";
    if (southCount > northCount && southCount >= auxCount) return "south";
    if (auxCount > 0) return "aux";
    return "mixed";
  })();

  const spousePalace = getPalaceByName(chartData.palaces, "夫妻");
  const friendsPalace = getPalaceByName(chartData.palaces, "交友");
  const parentsPalace = getPalaceByName(chartData.palaces, "父母");

  // Helper to extract traits
  const getTraits = (palace: Palace | null) => {
    if (!palace || !palace.mainStar || palace.mainStar.length === 0) return ["Complementary skills", "Shared professional direction"];
    return palace.mainStar.flatMap(s => STAR_BRIEF[s.name]?.keywords ?? ["Strategic alignment"]);
  };

  const getRedFlags = () => {
    const redFlags: string[] = [];
    const checkPalace = (palace: Palace | null, context: string) => {
      if (!palace) return;
      const allStars = [...(palace.mainStar || []), ...(palace.minorStars || [])];
      allStars.forEach(s => {
        if (s.transformations?.includes("化忌")) {
          redFlags.push(`Friction in ${context}: Avoid highly rigid or obsessive partners here.`);
        }
      });
    };
    checkPalace(spousePalace, "Co-Founders");
    checkPalace(friendsPalace, "Team/Market");
    checkPalace(parentsPalace, "Mentors");

    if (redFlags.length === 0) {
      redFlags.push("Lack of shared vision or misaligned incentives.");
      redFlags.push("People who drain your drive rather than amplify it.");
    }
    return Array.from(new Set(redFlags));
  };

  const spouseTraits = getTraits(spousePalace);
  const friendsTraits = getTraits(friendsPalace);
  const redFlags = getRedFlags();

  return (
    <section id="people" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
      <SectionWatermark type="network" />
      <SectionHeader
        graphicType="people"
        chapter="Chapter 04 · Stakeholder Intelligence"
        title="Your Partnership & Alliance Dynamics"
        subtitle="The network topology that reveals who you attract, how you collaborate, and what kind of people amplify your results."
      />

      {/* ── 1. The Visual: Network Topology Diagram ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-px" style={{ background: C.coral }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
            Network Topology
          </p>
        </div>
        
        <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden flex items-center justify-center p-8" style={{ background: `${C.navy}05`, border: `1px solid ${C.border}60` }}>
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="xMidYMid meet" viewBox="0 0 800 400">
            <defs>
              <linearGradient id="lineGrad1" x1="400" y1="200" x2="200" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={C.coral} stopOpacity="0.8" />
                <stop offset="100%" stopColor={C.navy} stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="lineGrad2" x1="400" y1="200" x2="600" y2="100" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={C.coral} stopOpacity="0.8" />
                <stop offset="100%" stopColor={C.navy} stopOpacity="0.2" />
              </linearGradient>
              <linearGradient id="lineGrad3" x1="400" y1="200" x2="400" y2="320" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor={C.coral} stopOpacity="0.8" />
                <stop offset="100%" stopColor={C.navy} stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Connecting Lines */}
            <path d="M 400 200 Q 300 150 200 100" fill="none" stroke="url(#lineGrad1)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 400 200 Q 500 150 600 100" fill="none" stroke="url(#lineGrad2)" strokeWidth="2" strokeDasharray="4 4" />
            <path d="M 400 200 L 400 320" fill="none" stroke="url(#lineGrad3)" strokeWidth="2" strokeDasharray="4 4" />

            {/* Nodes */}
            {/* Center: Founder */}
            <g transform="translate(400, 200)">
              <circle r="40" fill={C.navy} />
              <circle r="50" fill="none" stroke={C.coral} strokeWidth="1" strokeOpacity="0.5" />
              <text y="5" textAnchor="middle" fill={C.white} fontSize="12" fontWeight="bold" fontFamily="Georgia,'Times New Roman',serif">YOU</text>
            </g>

            {/* Top Left: Co-Founders */}
            <g transform="translate(200, 100)">
              <circle r="30" fill={C.white} stroke={C.navy} strokeWidth="2" />
              <text y="4" textAnchor="middle" fill={C.navy} fontSize="10" fontWeight="bold">CO-FOUNDERS</text>
            </g>

            {/* Top Right: Backers & Mentors */}
            <g transform="translate(600, 100)">
              <circle r="30" fill={C.white} stroke={C.gold} strokeWidth="2" />
              <text y="4" textAnchor="middle" fill={C.navy} fontSize="10" fontWeight="bold">MENTORS</text>
            </g>

            {/* Bottom: Market & Team */}
            <g transform="translate(400, 320)">
              <circle r="30" fill={C.white} stroke={C.coral} strokeWidth="2" />
              <text y="4" textAnchor="middle" fill={C.navy} fontSize="10" fontWeight="bold">TEAM</text>
            </g>
          </svg>
        </div>
      </div>

      {/* ── 2. The Action: Hiring & Partnership Playbook ── */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-px" style={{ background: C.coral }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
            Hiring & Partnership Playbook
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Green Flags: Partners */}
          <div className="rounded-3xl p-8" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                <Target size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Co-Founders & Partners</p>
                <h3 className="text-xl font-bold text-green-900" style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>Who to Partner With</h3>
              </div>
            </div>
            <div className="space-y-4">
              {spouseTraits.slice(0, 4).map((trait, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-green-200/50 pb-4 last:border-0 last:pb-0">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-green-900">{trait}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Green Flags: Team */}
          <div className="rounded-3xl p-8" style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-100 text-green-600">
                <Users size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-green-700">Market & Team</p>
                <h3 className="text-xl font-bold text-green-900" style={{ fontFamily: "Georgia,'Times New Roman',serif" }}>Who to Hire</h3>
              </div>
            </div>
            <div className="space-y-4">
              {friendsTraits.slice(0, 4).map((trait, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-green-200/50 pb-4 last:border-0 last:pb-0">
                  <CheckCircle2 size={18} className="text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-green-900">{trait}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Red Flags */}
        <div className="rounded-3xl p-8" style={{ background: "#fff1ee", border: `1px solid ${C.coral}40` }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.coral}20`, color: C.coral }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.coralDark }}>Risk Mitigation</p>
              <h3 className="text-xl font-bold" style={{ color: C.coralDark, fontFamily: "Georgia,'Times New Roman',serif" }}>Red Flag Partners</h3>
            </div>
          </div>
          <div className="space-y-4">
            {redFlags.map((flag, i) => (
              <div key={i} className="flex items-start gap-3 border-b border-[#e8642d]/10 pb-4 last:border-0 last:pb-0">
                <Shield size={18} className="shrink-0 mt-0.5" style={{ color: C.coral }} />
                <span className="text-sm font-medium" style={{ color: C.coralDark }}>{flag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── 3. Synthesis Callout ── */}
      <div
        className="rounded-2xl p-6 flex items-start gap-4"
        style={{ background: `linear-gradient(135deg, ${C.navy}ee, ${C.navyMid}cc)`, border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)" }}
      >
        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: `${C.coral}20`, color: C.coral }}>
          <Users size={16} />
        </div>
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: C.coral }}>
            Pattern Across Your People Palaces
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
            {PEOPLE_SYNTHESIS[synthesisKey]}
          </p>
        </div>
      </div>
    </section>
  );
};
