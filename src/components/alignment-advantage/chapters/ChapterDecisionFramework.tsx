import React, { useState } from "react";
import { C } from "../shared/constants";
import { SectionWatermark } from "../shared/SectionWatermark";
import { SectionHeader } from "../shared/SectionHeader";
import { AxisCard, type AxisAnswer } from "../shared/AxisCard";
import { Sparkle } from "../shared/Sparkle";
import { FRAMEWORK_RECOMMENDATIONS, STOP_DOING, WEALTH_TYPE } from "../../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";

export interface DecisionFrameworkState {
  structural: AxisAnswer;
  timing:     AxisAnswer;
  wealth:     AxisAnswer;
}

export interface ChapterDecisionFrameworkProps {
  strategicData: {
    wealthProfile: any;
    dayun: any;
    wealthArchetype: string;
    season: string | null;
    phaseLabel: string;
    signal: string;
    signalLabel: string;
    monthName: string;
    palaceArea: string;
    palacePriority: string;
    timingAligned: boolean;
    wealthAligned: boolean;
  };
  strLabel: { label: string };
  formation: { englishName: string; decisionRule: string; tagline: string };
  phaseConfig: { textColor: string };
  signalHex: string;
}

export const ChapterDecisionFramework: React.FC<ChapterDecisionFrameworkProps> = ({
  strategicData,
  strLabel,
  formation,
  phaseConfig,
  signalHex,
}) => {
  const [framework, setFramework] = useState<DecisionFrameworkState>({ structural: null, timing: null, wealth: null });

  const timingAnswer: AxisAnswer = strategicData.timingAligned;
  const wealthAnswer: AxisAnswer = strategicData.wealthAligned;
  const frameworkScore = [framework.structural === true, timingAnswer === true, wealthAnswer === true].filter(Boolean).length;
  const recommendation = framework.structural !== null ? FRAMEWORK_RECOMMENDATIONS[frameworkScore] : null;

  return (
    <section id="decision" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
      <SectionWatermark type="target" />
      <SectionHeader
        graphicType="decision"
        chapter="Chapter 06 · Decision Framework"
        title="Your Strategic Filter"
        subtitle="A repeatable system for evaluating any high-stakes decision through your three-axis Purple Star lens."
      />

      {/* ── Visual: Strategic Convergence Venn Diagram ── */}
      <div className="rounded-3xl overflow-hidden mb-12 border border-[#e8ddd0]/60 shadow-[0_8px_32px_rgba(0,0,0,0.02)]">
        <div className="px-8 py-6 bg-[#1a1e3f]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-1.5 text-white/40">
            Strategic Convergence
          </p>
          <p className="text-2xl font-bold text-white font-serif">
            The Alignment Intersection
          </p>
        </div>
        
        <div className="bg-[#fdf6ee] p-8 md:p-12 relative flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Venn Diagram SVG */}
          <div className="relative w-64 h-64 shrink-0">
            <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xl">
              <defs>
                <linearGradient id="grad-struct" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#1a1e3f" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#1a1e3f" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="grad-timing" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={phaseConfig.textColor} stopOpacity="0.8" />
                  <stop offset="100%" stopColor={phaseConfig.textColor} stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="grad-wealth" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#e8642d" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="#e8642d" stopOpacity="0.4" />
                </linearGradient>
              </defs>
              
              {/* Structure Circle (Top Left) */}
              <circle cx="75" cy="75" r="55" fill="url(#grad-struct)" stroke="#1a1e3f" strokeWidth="1" />
              {/* Timing Circle (Top Right) */}
              <circle cx="125" cy="75" r="55" fill="url(#grad-timing)" stroke={phaseConfig.textColor} strokeWidth="1" />
              {/* Wealth Circle (Bottom Center) */}
              <circle cx="100" cy="120" r="55" fill="url(#grad-wealth)" stroke="#e8642d" strokeWidth="1" />
              
              {/* Labels inside circles */}
              <text x="55" y="65" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Structure</text>
              <text x="145" y="65" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Timing</text>
              <text x="100" y="145" fontSize="10" fontWeight="bold" fill="#fff" textAnchor="middle">Wealth</text>
              
              {/* Center intersection star/sparkle */}
              <g transform="translate(100, 90) scale(0.6)">
                <path d="M0 -15 L3 -4 L15 0 L3 4 L0 15 L-3 4 L-15 0 L-3 -4 Z" fill="#fff" />
              </g>
            </svg>
          </div>
          
          {/* Legend / Details */}
          <div className="flex flex-col gap-6 w-full max-w-sm">
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: C.navy }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">01. Structural Alignment</p>
                <p className="text-sm font-bold text-slate-800">{strLabel.label} · {formation.englishName}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: phaseConfig.textColor }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">02. Timing Alignment</p>
                <p className="text-sm font-bold text-slate-800">{strategicData.phaseLabel} Phase · {strategicData.dayun?.startYear ?? ""}–{strategicData.dayun?.endYear ?? ""}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-3 h-3 rounded-full mt-1 shrink-0" style={{ background: C.coral }} />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">03. Wealth Alignment</p>
                <p className="text-sm font-bold text-slate-800">{WEALTH_TYPE[strategicData.wealthProfile.codes[0]?.key as WealthCodeKey]?.category ?? "Wealth Creation"} · {strategicData.wealthArchetype}</p>
              </div>
            </div>
            
            <div className="mt-2 p-4 rounded-xl bg-white border border-[#e8ddd0]/80 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Sparkle size={12} color={C.gold} />
                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-[#b48e4b]">Your Formation Rule</p>
              </div>
              <p className="text-xs italic text-slate-700 leading-relaxed">
                &ldquo;{formation.decisionRule}&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── The Playbook: Deal-Flow Checklist ── */}
      <div className="mb-10">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6 text-slate-400">
          Deal-Flow Checklist
        </p>
        <div className="flex flex-col border-t border-[#e8ddd0]/60">
          <AxisCard
            variant="checklist"
            title="01. Structural"
            description="Does this decision align with your core design, or does it force you to operate outside your zone of genius?"
            value={strLabel.label}
            isAutoFilled={false}
            answer={framework.structural}
            onAnswer={(v) => { setFramework((p) => ({ ...p, structural: v })); }}
          />
          <AxisCard
            variant="checklist"
            title="02. Timing"
            description={`${strategicData.monthName} is a ${
              strategicData.signal === "green" ? "green-light" :
              strategicData.signal === "yellow" ? "yellow-light" : "red-light"
            } period. ${
              strategicData.signal === "green" ? "Optimal window." :
              strategicData.signal === "yellow" ? "Proceed with caution." : "Avoid major moves."
            }`}
            value={strategicData.signal === "green" ? "Green Light"
              : strategicData.signal === "yellow" ? "Yellow Light" : "Red Light"}
            isAutoFilled={true}
            answer={timingAnswer}
          />
          <AxisCard
            variant="checklist"
            title="03. Wealth"
            description={`Does this move eliminate one of your known profit drains: ${STOP_DOING[strategicData.wealthProfile.codes[0]?.key as WealthCodeKey]?.[0] ?? "wasting resources"}?`}
            value={strategicData.wealthArchetype}
            isAutoFilled={true}
            answer={wealthAnswer}
          />
        </div>
      </div>

      {/* ── Recommendation Output ── */}
      {recommendation !== null && (
        <div
          className="rounded-3xl p-8 mb-8"
          style={{
            background: C.cream,
            border: `1px solid ${C.border}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.03)",
            borderLeft: `4px solid ${frameworkScore === 3 ? "#16a34a" : frameworkScore === 2 ? C.gold : C.coral}`,
          }}
        >
          <p
            className="text-xl font-bold mb-3"
            style={{ color: frameworkScore === 3 ? "#16a34a" : frameworkScore === 2 ? C.gold : C.coral }}
          >
            {recommendation.heading}
          </p>
          <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>
            {recommendation.copy}
          </p>
          <div className="flex items-center gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-2 flex-1 rounded-full transition-all"
                style={{
                  background: i < frameworkScore
                    ? (frameworkScore === 3 ? "#16a34a" : frameworkScore === 2 ? C.gold : C.coral)
                    : `${C.border}40`,
                }}
              />
            ))}
            <span className="text-sm font-semibold ml-2" style={{ color: C.muted }}>
              {frameworkScore} / 3
            </span>
          </div>
        </div>
      )}

      {framework.structural !== null && (
        <div className="text-center mt-8">
          <button
            type="button"
            onClick={() => { setFramework({ structural: null, timing: null, wealth: null }); }}
            className="text-sm font-bold transition-colors"
            style={{ color: C.muted, textDecoration: "underline", textUnderlineOffset: "4px" }}
          >
            Reset framework
          </button>
        </div>
      )}
    </section>
  );
};
