import React, { useMemo } from "react";
import type { ChartData, Palace } from "../../../utils/zwds/types";
import type { StructureAnalysisResult } from "../../../utils/zwds/analysis/structureAnalysis";
import type { FormationProfile } from "../../../utils/forecast/structure/formationProfiles";
import type { StructureLabel } from "../../../utils/forecast/structure/formationProfiles";
import { C, classifyMainStar } from "../shared/constants";
import { SectionHeader } from "../shared/SectionHeader";
import { ReportSheet } from "../shared/ReportSheet";
import { buildCoreCatalystActivations } from "../shared/catalystGuidance";
import type { CoreCatalystActivation } from "../shared/catalystGuidance";
import { TwelvePalaceMiniGrid } from "../shared/TwelvePalaceMiniGrid";
import { PlayerFormationSheet } from "./PlayerFormationSheet";

export const ChapterCoreDesign: React.FC<{
  chartData: ChartData;
  structureResult: StructureAnalysisResult;
  strLabel: StructureLabel;
  formation: FormationProfile;
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

    // 3. Catalyst Engine (Life, Wealth, Career triangle)
    const catalystActivations: CoreCatalystActivation[] = buildCoreCatalystActivations(corePalaces);

    return { visionPct, capitalPct, executionPct, endurancePct, catalystActivations };
  }, [chartData]);

  return (
    <div id="design" className="scroll-mt-16 mb-8">
      <ReportSheet watermark="grid">
      <SectionHeader
        graphicType="design"
        chapter="Chapter 01 · Founder's Blueprint"
        title="Your Player Type & Formation"
        subtitle="Derived from the star balance in your Life, Wealth, and Career palaces: the 1-5-9 triangle."
      />

      {/* 1-5-9 Palace Triangle: visual context showing the three palaces that
          determine the Speed/Endurance classification */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-8 h-px" style={{ background: C.coral }} />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
              The Core Triad (1-5-9)
            </p>
          </div>
          <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={["命宫", "财帛", "官禄"]} />
        </div>

      {frameworkData && (
        <div>
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
        </div>
      )}

      </ReportSheet>

      <PlayerFormationSheet
        strLabel={strLabel}
        formation={formation}
        structureResult={structureResult}
        catalystActivations={frameworkData?.catalystActivations ?? []}
      />
    </div>
  );
};
