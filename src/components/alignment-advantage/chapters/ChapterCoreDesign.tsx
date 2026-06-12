import React, { useMemo } from "react";
import { Zap, Shield } from "lucide-react";
import type { ChartData, Palace } from "../../../utils/zwds/types";
import type { StructureAnalysisResult } from "../../../utils/zwds/analysis/structureAnalysis";
import { C, classifyMainStar } from "../shared/constants";
import { SectionWatermark } from "../shared/SectionWatermark";
import { SectionHeader } from "../shared/SectionHeader";
import { TwelvePalaceMiniGrid } from "../shared/TwelvePalaceMiniGrid";

export const ChapterCoreDesign: React.FC<{
  chartData: ChartData;
  structureResult: StructureAnalysisResult;
  strLabel: any;
  formation: any;
}> = ({ chartData, structureResult, strLabel, formation }) => {
  const frameworkData = useMemo(() => {
    if (!chartData) return null;
    const lifePalace = chartData.palaces.find(p => p.name === "命宫");
    const wealthPalace = chartData.palaces.find(p => p.name === "财帛");
    const careerPalace = chartData.palaces.find(p => p.name === "官禄");
    const corePalaces = [lifePalace, wealthPalace, careerPalace].filter(Boolean) as Palace[];

    // 1. Core Triad (Strategic Focus)
    // Add base weight of 1 to ensure no 0%
    const visionScore = Math.max(1, (lifePalace?.mainStar?.length || 0) * 2 + (lifePalace?.minorStars?.length || 0));
    const capitalScore = Math.max(1, (wealthPalace?.mainStar?.length || 0) * 2 + (wealthPalace?.minorStars?.length || 0));
    const executionScore = Math.max(1, (careerPalace?.mainStar?.length || 0) * 2 + (careerPalace?.minorStars?.length || 0));
    const totalTriad = visionScore + capitalScore + executionScore;
    const visionPct = Math.round((visionScore / totalTriad) * 100);
    const capitalPct = Math.round((capitalScore / totalTriad) * 100);
    const executionPct = Math.round((executionScore / totalTriad) * 100);

    // 2. Operating Pace
    let northCount = 0;
    let southCount = 0;
    corePalaces.forEach(p => {
      p.mainStar?.forEach(s => {
        const ns = classifyMainStar(s.name);
        if (ns === "north") northCount++;
        if (ns === "south") southCount++;
      });
    });
    // Add base 1 to prevent 0% or 100% extremes
    northCount += 1;
    southCount += 1;
    const totalNS = northCount + southCount;
    // Northern = Speed, Southern = Endurance
    // Slider: Speed (0%) to Endurance (100%)
    const endurancePct = Math.round((southCount / totalNS) * 100);

    // 3. Catalyst Engine
    const activeCatalysts = new Set<string>();
    corePalaces.forEach(p => {
      [...(p.mainStar || []), ...(p.minorStars || [])].forEach(s => {
        s.transformations?.forEach(t => activeCatalysts.add(t));
      });
    });

    return { visionPct, capitalPct, executionPct, endurancePct, activeCatalysts };
  }, [chartData]);

  return (
    <section id="design" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-[#fdf6ee] rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/80">
      <SectionWatermark type="grid" />
      <SectionHeader
        graphicType="design"
        chapter="Chapter 01 · Founder's Blueprint"
        title="Your Player Type & Formation"
        subtitle="Derived from the star balance in your Life, Wealth, and Career palaces: the 1-5-9 triangle."
      />

      {/* 1-5-9 Palace Triangle: visual context showing the three palaces that
          determine the Speed/Endurance classification */}
      <div className="mb-16">
        <div className="flex items-center gap-3 mb-8">
          <span className="w-8 h-px" style={{ background: C.coral }} />
          <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
            The Core Triad (1-5-9)
          </p>
        </div>
        <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={["命宫", "财帛", "官禄"]} />
      </div>

      {/* ── Proprietary Framework Visualizations ── */}
      {frameworkData && (
        <div className="mb-24">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px" style={{ background: C.coral }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
              The Operating Engine
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
            
            {/* 1. Core Triad Distribution */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-8" style={{ color: C.navy }}>Strategic Focus</p>
              <div className="space-y-6">
                {/* Vision */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span style={{ color: C.navy }}>Vision & Identity</span>
                    <span style={{ color: C.muted }}>{frameworkData.visionPct}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden" style={{ background: `${C.border}40` }}>
                    <div className="h-full transition-all duration-1000" style={{ width: `${frameworkData.visionPct}%`, background: C.navy }} />
                  </div>
                </div>
                {/* Capital */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span style={{ color: C.navy }}>Capital & Leverage</span>
                    <span style={{ color: C.muted }}>{frameworkData.capitalPct}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden" style={{ background: `${C.border}40` }}>
                    <div className="h-full transition-all duration-1000 delay-100" style={{ width: `${frameworkData.capitalPct}%`, background: C.gold }} />
                  </div>
                </div>
                {/* Execution */}
                <div>
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider mb-2">
                    <span style={{ color: C.navy }}>Systems & Execution</span>
                    <span style={{ color: C.muted }}>{frameworkData.executionPct}%</span>
                  </div>
                  <div className="h-1 w-full overflow-hidden" style={{ background: `${C.border}40` }}>
                    <div className="h-full transition-all duration-1000 delay-200" style={{ width: `${frameworkData.executionPct}%`, background: C.coral }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Divider for desktop */}
            <div className="hidden lg:block lg:col-span-1 flex justify-center">
              <div className="w-px h-full" style={{ background: `linear-gradient(180deg, transparent, ${C.border}60, transparent)` }} />
            </div>

            {/* 2. Operating Pace Spectrum */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-12" style={{ color: C.navy }}>Operational Velocity</p>
              
              <div className="relative w-full pt-4 pb-8">
                {/* Track */}
                <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${C.coral}, ${C.border}40, ${C.navy})` }} />
                
                {/* Marker */}
                <div 
                  className="absolute top-0 w-3 h-3 rounded-full -translate-y-1/2 -translate-x-1/2 transition-all duration-1000"
                  style={{ 
                    left: `${frameworkData.endurancePct}%`, 
                    background: C.white, 
                    border: `2px solid ${C.navy}`,
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                  }} 
                />
                
                {/* Labels */}
                <div className="absolute top-6 left-0 text-[9px] font-bold uppercase tracking-wider" style={{ color: C.coral }}>
                  Agility & Speed
                </div>
                <div className="absolute top-6 right-0 text-[9px] font-bold uppercase tracking-wider" style={{ color: C.navy }}>
                  Structure & Endurance
                </div>
              </div>
            </div>
          </div>

          {/* 3. Catalyst Engine */}
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C.navy }}>Active Growth Catalysts</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-px" style={{ background: `${C.border}40` }}>
              {/* Hua Lu: Vault Door */}
              <div className="p-6 flex flex-col items-center text-center transition-all" style={{ background: frameworkData.activeCatalysts.has("化禄") || frameworkData.activeCatalysts.has("化祿") ? "#f0fdf4" : "transparent", opacity: frameworkData.activeCatalysts.has("化禄") || frameworkData.activeCatalysts.has("化祿") ? 1 : 0.3 }}>
                <div className="w-12 h-12 mb-4" style={{ color: frameworkData.activeCatalysts.has("化禄") || frameworkData.activeCatalysts.has("化祿") ? "#16a34a" : C.muted }}>
                  {/* Vault door: outer ring, inner door, bolt tabs, center wheel with 4 spokes */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="50" cy="50" r="42" strokeWidth="3" />
                    <rect x="46" y="6" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="none" />
                    <rect x="46" y="86" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="none" />
                    <rect x="6" y="46" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="none" />
                    <rect x="86" y="46" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.3" stroke="none" />
                    <circle cx="50" cy="50" r="28" strokeWidth="2" />
                    <circle cx="50" cy="50" r="8" strokeWidth="2" fill="currentColor" fillOpacity="0.15" />
                    <line x1="50" y1="42" x2="50" y2="24" strokeWidth="2" />
                    <line x1="50" y1="58" x2="50" y2="76" strokeWidth="2" />
                    <line x1="42" y1="50" x2="24" y2="50" strokeWidth="2" />
                    <line x1="58" y1="50" x2="76" y2="50" strokeWidth="2" />
                  </svg>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: frameworkData.activeCatalysts.has("化禄") || frameworkData.activeCatalysts.has("化祿") ? "#16a34a" : C.muted }}>Resource Magnet</p>
                <p className="text-xs font-bold" style={{ color: frameworkData.activeCatalysts.has("化禄") || frameworkData.activeCatalysts.has("化祿") ? "#14532d" : C.muted, fontFamily: "Georgia,'Times New Roman',serif" }}>Flow & Expansion</p>
              </div>
              {/* Hua Quan: Crown */}
              <div className="p-6 flex flex-col items-center text-center transition-all" style={{ background: frameworkData.activeCatalysts.has("化权") || frameworkData.activeCatalysts.has("化權") ? "#eff6ff" : "transparent", opacity: frameworkData.activeCatalysts.has("化权") || frameworkData.activeCatalysts.has("化權") ? 1 : 0.3 }}>
                <div className="w-12 h-12 mb-4" style={{ color: frameworkData.activeCatalysts.has("化权") || frameworkData.activeCatalysts.has("化權") ? "#2563eb" : C.muted }}>
                  {/* Crown: band at base, 5-point zigzag profile, gems at tips */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 10 72 H 90 V 86 H 10 Z" fill="currentColor" fillOpacity="0.1" strokeWidth="2" />
                    <path d="M 10 72 L 10 40 L 30 58 L 50 14 L 70 58 L 90 40 L 90 72" strokeWidth="2.5" />
                    <circle cx="10" cy="38" r="5" fill="currentColor" fillOpacity="0.35" stroke="none" />
                    <circle cx="50" cy="12" r="6" fill="currentColor" fillOpacity="0.35" stroke="none" />
                    <circle cx="90" cy="38" r="5" fill="currentColor" fillOpacity="0.35" stroke="none" />
                    <circle cx="30" cy="57" r="3.5" fill="currentColor" fillOpacity="0.2" stroke="none" />
                    <circle cx="70" cy="57" r="3.5" fill="currentColor" fillOpacity="0.2" stroke="none" />
                    <circle cx="35" cy="79" r="2.5" fill="currentColor" fillOpacity="0.5" stroke="none" />
                    <circle cx="50" cy="79" r="2.5" fill="currentColor" fillOpacity="0.5" stroke="none" />
                    <circle cx="65" cy="79" r="2.5" fill="currentColor" fillOpacity="0.5" stroke="none" />
                  </svg>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: frameworkData.activeCatalysts.has("化权") || frameworkData.activeCatalysts.has("化權") ? "#2563eb" : C.muted }}>Command & Control</p>
                <p className="text-xs font-bold" style={{ color: frameworkData.activeCatalysts.has("化权") || frameworkData.activeCatalysts.has("化權") ? "#1e3a8a" : C.muted, fontFamily: "Georgia,'Times New Roman',serif" }}>Authority & Scale</p>
              </div>
              {/* Hua Ke: Fountain Pen Nib */}
              <div className="p-6 flex flex-col items-center text-center transition-all" style={{ background: frameworkData.activeCatalysts.has("化科") ? "#fffbeb" : "transparent", opacity: frameworkData.activeCatalysts.has("化科") ? 1 : 0.3 }}>
                <div className="w-12 h-12 mb-4" style={{ color: frameworkData.activeCatalysts.has("化科") ? "#d97706" : C.muted }}>
                  {/* Pen nib: leaf/kite outline, center slit, breather hole, decorative engraving */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M 50 90 Q 18 55, 26 20 Q 50 10, 74 20 Q 82 55, 50 90 Z" strokeWidth="2.5" />
                    <line x1="50" y1="90" x2="50" y2="36" strokeWidth="1.5" />
                    <ellipse cx="50" cy="66" rx="5" ry="6.5" fill="currentColor" fillOpacity="0.2" strokeWidth="1.5" />
                    <path d="M 35 32 Q 50 38, 65 32" strokeWidth="1.5" strokeDasharray="3 3" strokeOpacity="0.6" />
                  </svg>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: frameworkData.activeCatalysts.has("化科") ? "#d97706" : C.muted }}>Influence</p>
                <p className="text-xs font-bold" style={{ color: frameworkData.activeCatalysts.has("化科") ? "#78350f" : C.muted, fontFamily: "Georgia,'Times New Roman',serif" }}>Reputation & Brand</p>
              </div>
              {/* Hua Ji: Magnifying Glass */}
              <div className="p-6 flex flex-col items-center text-center transition-all" style={{ background: frameworkData.activeCatalysts.has("化忌") ? "#fff1ee" : "transparent", opacity: frameworkData.activeCatalysts.has("化忌") ? 1 : 0.3 }}>
                <div className="w-12 h-12 mb-4" style={{ color: frameworkData.activeCatalysts.has("化忌") ? C.coral : C.muted }}>
                  {/* Magnifying glass: lens ring, inner focal ring, center dot, crosshair, angled handle */}
                  <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="40" cy="40" r="28" strokeWidth="2.5" />
                    <circle cx="40" cy="40" r="16" strokeWidth="1.5" />
                    <circle cx="40" cy="40" r="5" fill="currentColor" fillOpacity="0.25" strokeWidth="1.5" />
                    <line x1="13" y1="40" x2="67" y2="40" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.65" />
                    <line x1="40" y1="13" x2="40" y2="67" strokeWidth="1" strokeDasharray="3 4" strokeOpacity="0.65" />
                    <line x1="62" y1="62" x2="88" y2="88" strokeWidth="6" />
                  </svg>
                </div>
                <p className="text-[8px] font-bold uppercase tracking-widest mb-1.5" style={{ color: frameworkData.activeCatalysts.has("化忌") ? C.coral : C.muted }}>Obsessive Focus</p>
                <p className="text-xs font-bold" style={{ color: frameworkData.activeCatalysts.has("化忌") ? C.coralDark : C.muted, fontFamily: "Georgia,'Times New Roman',serif" }}>Friction & Mastery</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Type & Formation ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
        
        {/* Left: Player Type */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.navy}10`, color: C.navy }}>
              {strLabel.label.includes("Speed") ? <Zap size={20} /> : <Shield size={20} />}
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.muted }}>Base Operating System</p>
              <h3 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                {strLabel.label}
              </h3>
            </div>
          </div>
          <p className="text-base leading-relaxed" style={{ color: C.navy }}>
            {strLabel.description}
          </p>
        </div>

        {/* Right: Formation */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.coral}15`, color: C.coral }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.muted }}>Strategic Formation</p>
              <h3 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                {formation.englishName}
              </h3>
            </div>
          </div>
          <p className="text-base leading-relaxed mb-6" style={{ color: C.navy }}>
            {formation.description}
          </p>

          {/* Special Formations (if any) */}
          {structureResult.specialFormations.length > 0 && (
            <div className="mt-8 pt-8" style={{ borderTop: `1px solid ${C.border}60` }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.navy }}>
                Multiplier Effects
              </p>
              <div className="flex flex-col gap-3">
                {structureResult.specialFormations.map((k: string) => {
                  const specialDesc = {
                    "机月同梁": "High execution capacity in structured environments.",
                    "杀破狼":   "High risk tolerance; thrives in disruption.",
                    "紫府同宫": "Natural executive presence and resource command.",
                    "巨日同宫": "Strong communication and cross-border influence.",
                    "阳梁昌禄": "Academic/systematic brilliance; excels in complex rules.",
                    "明珠出海": "Late-blooming visibility; sudden market recognition.",
                    "月朗天门": "Deep intuitive wealth generation; asset accumulation.",
                  }[k] ?? "A unique structural advantage in your chart.";
                  return (
                    <div key={k} className="flex items-start gap-3">
                      <span className="shrink-0 mt-1 w-1.5 h-1.5 rounded-full" style={{ background: C.coral }} />
                      <div>
                        <span className="text-sm font-bold block mb-0.5" style={{ color: C.navy }}>{k}</span>
                        <span className="text-xs leading-relaxed" style={{ color: C.muted }}>{specialDesc}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
