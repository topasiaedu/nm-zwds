/**
 * Alignment Advantage: PDF Document Viewer
 *
 * Layout mirrors the Joey Yap Monthly Planner reference:
 * : Fixed-width dark sidebar on the left for chapter navigation.
 * : Right content area rendered as a PDF viewer: warm-gray background
 *    with centered white "pages" that have drop shadows, mimicking actual
 *    printed pages in a browser-based PDF reader.
 *
 * Chapters:
 *  Cover  : Client name, at-a-glance summary chips, PDF download
 *  Ch 01  : Structure: Speed/Endurance Player + Formation Profile
 *  Ch 02  : Timing: DaYun phase summary + 12-month roadmap grid
 *  Ch 03  : Wealth: Archetype profile + Phase × Wealth intersection
 *  Ch 04  : Decision Framework: 3-axis alignment checker
 *
 * Access is gated behind the `hasAlignmentAdvantage` feature flag.
 * Always uses the account-owner's (`is_self`) profile: one per account.
 */

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Compass, Users, Zap, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import PageTransition from "../../components/PageTransition";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { useAlertContext } from "../../context/AlertContext";
import { ZWDSCalculator } from "../../utils/zwds/calculator";
import type { ChartData, ChartInput, Palace } from "../../utils/zwds/types";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import type { WealthCodeAnalysisResult } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../utils/dayun/guidanceGenerator";
import type { DayunCycleExtended } from "../../types/dayun";
import {
  getPalaceForAspectLiuMonth,
  getLiuMonthAnchorFromLocalDate,
} from "../../utils/destiny-navigator/palace-resolver";
import {
  PALACE_DATA,
  getSignalColor,
  SIGNAL_LABELS,
  type SignalColor,
} from "../../utils/forecast/alignmentTimingData";
import { detectStructure } from "../../utils/zwds/analysis/structureAnalysis";
import type { StructureAnalysisResult } from "../../utils/zwds/analysis/structureAnalysis";
import {
  STRUCTURE_LABELS,
  FORMATION_PROFILES,
} from "../../utils/forecast/structureContentData";
import { PHASE_LABELS } from "../../utils/dayun/seasonMapper";
import { supabase } from "../../utils/supabase-client";
import {
  exportPdfViaServer,
  resolvePrintPageOrigin,
} from "../../utils/pdfExportServer";
import {
  FRAMEWORK_RECOMMENDATIONS,
  PHASE_ALIGNMENT_MATRIX,
  STOP_DOING,
  FOCUS_ON,
  IDEAL_COLLABORATOR,
  ALTERNATIVE_PATH,
  WEALTH_TYPE,
  type PhaseAlignmentSeasonKey,
  type PhaseAlignmentWealthKey,
} from "../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../utils/zwds/analysis_constants/wealth_code_mapping";
import { STAR_BRIEF } from "../../utils/forecast/starBriefDescriptions";
import {
  PEOPLE_PALACE_FRAMING,
  PEOPLE_SYNTHESIS,
} from "../../utils/forecast/peoplePalaceData";
import {
  PALACE_MONTH_DATA,
  PALACE_GUIDANCE_DATA,
  SEASON_STYLES,
} from "../../utils/forecast/liuMonthData";
import MonthGrid from "../../components/alignment-advantage/MonthGrid";
import type { MonthPillData } from "../../components/alignment-advantage/MonthGrid";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type AxisAnswer = boolean | null;

interface DecisionFrameworkState {
  structural: AxisAnswer;
  timing:     AxisAnswer;
  wealth:     AxisAnswer;
}

type ChapterId = "cover" | "design" | "operate" | "timing" | "wealth" | "people" | "decision";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES_SHORT = [
  "Jan","Feb","Mar","Apr","May","Jun",
  "Jul","Aug","Sep","Oct","Nov","Dec",
];

/** English display names for each ZWDS palace (used in monthly briefing). */
const PALACE_ENGLISH: Record<string, string> = {
  "命宫": "Life Palace",      "兄弟": "Siblings Palace",
  "夫妻": "Co-Founder & Joint Venture Dynamics",    "子女": "Children Palace",
  "财帛": "Wealth Palace",    "疾厄": "Health Palace",
  "迁移": "Travel Palace",    "交友": "Market & Audience Capture",
  "官禄": "Operational Capacity",    "田宅": "Property Palace",
  "福德": "Inner Power Palace","父母": "Investor & Mentor Leverage",
};

/** Maps the DaYun season to the PhaseAlignment key. */
const DAYUN_TO_PHASE: Record<string, PhaseAlignmentSeasonKey> = {
  spring: "expansion",
  summer: "visibility",
  autumn: "consolidation",
  winter: "foundation",
};

// ─── Mini-chart helpers ───────────────────────────────────────────────────────

/** The 6 Northern (Ziwei) main stars: simplified Chinese matching calculator output */
const NORTHERN_MAIN_STARS = new Set(["紫微", "天机", "太阳", "武曲", "天同", "廉贞"]);
/** The 8 Southern (Tianfu) main stars: simplified Chinese matching calculator output */
const SOUTHERN_MAIN_STARS = new Set(["天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"]);

/** Returns whether a main star is Northern, Southern, or auxiliary. */
function classifyMainStar(name: string): "north" | "south" | "aux" {
  if (NORTHERN_MAIN_STARS.has(name)) return "north";
  if (SOUTHERN_MAIN_STARS.has(name)) return "south";
  return "aux";
}

/**
 * Maps each earthly branch to its CSS grid-area name in the ZWDS 4×4 layout.
 * Standard arrangement (counter-clockwise from bottom-left):
 *   Row 0 (top):    巳 午 未 申
 *   Col 0 (left):   辰 卯 寅  (rows 1-3)
 *   Row 3 (bottom): 寅 丑 子 亥
 *   Col 3 (right):  酉 戌 亥  (rows 1-3)
 */
const BRANCH_TO_AREA: Record<string, string> = {
  "巳": "p_si",   "午": "p_wu",   "未": "p_wei",  "申": "p_shen",
  "辰": "p_chen",                                  "酉": "p_you",
  "卯": "p_mao",                                   "戌": "p_xu",
  "寅": "p_yin",  "丑": "p_chou", "子": "p_zi",   "亥": "p_hai",
};
const CURRENT_YEAR        = new Date().getFullYear();
const CURRENT_MONTH_INDEX = new Date().getMonth();

const CHAPTERS: Array<{ id: ChapterId; label: string; sub: string }> = [
  { id: "cover",    label: "Overview",     sub: "Your profile at a glance" },
  { id: "design",   label: "Founder's Blueprint", sub: "Ch 01 · Core Design" },
  { id: "operate",  label: "Operating System", sub: "Ch 02 · Executive Capacity" },
  { id: "wealth",   label: "Wealth Acceleration", sub: "Ch 03 · Wealth Blueprint" },
  { id: "people",   label: "Stakeholder Intel", sub: "Ch 04 · People Intelligence" },
  { id: "timing",   label: "Execution Playbook", sub: "Ch 05 · 12-Month Roadmap" },
  { id: "decision", label: "Decision Filter", sub: "Ch 06 · Decision Framework" },
];

// ─── Cae Goh design tokens (mirrors the dashboard palette) ───────────────────
const C = {
  navy:      "#1a1e3f",
  navyMid:   "#252a5c",
  navyDeep:  "#0f1230",
  coral:     "#e8642d",
  coralDark: "#c4501e",
  gold:      "#c9873a",
  cream:     "#fdf6ee",
  border:    "#e8ddd0",
  white:     "#ffffff",
  muted:     "#7a6e65",
} as const;

const PHASE_DISPLAY: Record<string, { label: string; bgColor: string; textColor: string }> = {
  spring: { label: "Expansion",     bgColor: `linear-gradient(135deg, #16a34a, #15803d)`, textColor: "#15803d" },
  summer: { label: "Visibility",    bgColor: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`,  textColor: C.coral },
  autumn: { label: "Consolidation", bgColor: `linear-gradient(135deg, #d97706, #b45309)`,            textColor: "#d97706" },
  winter: { label: "Foundation",    bgColor: `linear-gradient(135deg, #2563eb, #1d4ed8)`,            textColor: "#2563eb" },
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function parseBirthHour(birthTime: string): number {
  const match = String(birthTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
  if (!match) return 12;
  let hour = parseInt(match[1], 10);
  if (match[3]?.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (match[3]?.toUpperCase() === "AM" && hour === 12) hour = 0;
  return hour;
}

/** Returns the palace matching a given Chinese name, or null if not found. */
function getPalaceByName(palaces: Palace[], name: string): Palace | null {
  return palaces.find((p) => p.name === name) ?? null;
}

function buildMonthPills(chartData: ChartData): MonthPillData[] {
  return Array.from({ length: 12 }, (_, i) => {
    const m        = i + 1;
    const palNum   = getPalaceForAspectLiuMonth("life", chartData, m, CURRENT_YEAR);
    const palace   = palNum !== null ? chartData.palaces[palNum - 1] : null;
    const pData    = palace ? PALACE_DATA[palace.name] : null;
    const signal   = pData ? getSignalColor(pData.stars) : "yellow";
    return {
      monthIndex: i,
      shortName:  MONTH_NAMES_SHORT[i] ?? String(m),
      palaceName: palace?.name ?? "-",
      signal,
      stars:      (pData?.stars ?? 4) as 3 | 4 | 5,
    };
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────


/** Abstract SVG Watermarks for Sections */
const SectionWatermark: React.FC<{ type: "compass" | "grid" | "nodes" | "waves" | "network" | "timeline" | "target" }> = ({ type }) => {
  const baseClass = "absolute pointer-events-none opacity-[0.03] text-[#1a1e3f] z-0";
  
  if (type === "compass") {
    return (
      <svg className={`${baseClass} -top-20 -right-20 w-[600px] h-[600px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="30" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="20" />
        <path d="M50 5 L50 95 M5 50 L95 50 M18 18 L82 82 M18 82 L82 18" />
        <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" />
      </svg>
    );
  }
  if (type === "grid") {
    return (
      <svg className={`${baseClass} top-0 right-0 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />
        <circle cx="50" cy="50" r="20" fill="currentColor" fillOpacity="0.05" />
      </svg>
    );
  }
  if (type === "nodes") {
    return (
      <svg className={`${baseClass} -top-10 -left-10 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="20" cy="20" r="3" />
        <circle cx="80" cy="30" r="4" />
        <circle cx="40" cy="80" r="5" />
        <circle cx="70" cy="70" r="2" />
        <path d="M20 20 L80 30 L70 70 L40 80 Z" />
        <path d="M20 20 L40 80 M80 30 L70 70" />
        <circle cx="50" cy="50" r="40" strokeDasharray="1 4" />
      </svg>
    );
  }
  if (type === "waves") {
    return (
      <svg className={`${baseClass} top-20 -right-10 w-[600px] h-[600px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <path d="M0 50 Q 25 20, 50 50 T 100 50" />
        <path d="M0 60 Q 25 30, 50 60 T 100 60" />
        <path d="M0 70 Q 25 40, 50 70 T 100 70" />
        <circle cx="50" cy="50" r="10" />
      </svg>
    );
  }
  if (type === "network") {
    return (
      <svg className={`${baseClass} top-0 -left-20 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="45" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="35" />
        <path d="M50 15 L50 85 M15 50 L85 50" />
        <circle cx="50" cy="15" r="3" fill="currentColor" />
        <circle cx="50" cy="85" r="3" fill="currentColor" />
        <circle cx="15" cy="50" r="3" fill="currentColor" />
        <circle cx="85" cy="50" r="3" fill="currentColor" />
      </svg>
    );
  }
  if (type === "timeline") {
    return (
      <svg className={`${baseClass} top-10 right-0 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <path d="M50 10 L50 20 M50 80 L50 90 M10 50 L20 50 M80 50 L90 50" />
        <circle cx="50" cy="50" r="2" fill="currentColor" />
        <path d="M50 50 L70 30" />
        <path d="M50 50 L60 70" strokeWidth="1" />
      </svg>
    );
  }
  if (type === "target") {
    return (
      <svg className={`${baseClass} -top-10 -right-10 w-[500px] h-[500px]`} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
        <circle cx="50" cy="50" r="40" />
        <circle cx="50" cy="50" r="25" />
        <circle cx="50" cy="50" r="10" fill="currentColor" fillOpacity="0.05" />
        <path d="M50 0 L50 100 M0 50 L100 50" strokeDasharray="2 4" />
      </svg>
    );
  }
  return null;
};

/** Skeleton loading shimmer */
const Shimmer: React.FC<{ className: string }> = ({ className }) => (
  <div className={["animate-pulse rounded-xl", className].join(" ")}
    style={{ background: "rgba(255,255,255,0.12)" }} />
);

/** Sparkle SVG */
const Sparkle: React.FC<{ size?: number; color?: string }> = ({ size = 12, color = C.coral }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" className="shrink-0">
    <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" />
  </svg>
);






/** Beautiful SVG Graphics for Section Headers */
const SectionGraphic: React.FC<{ type: string }> = ({ type }) => {
  const base = "absolute -top-10 -right-10 w-64 h-64 opacity-[0.06] text-[#e8642d] pointer-events-none";
  if (type === "design") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <polygon points="50,5 95,25 95,75 50,95 5,75 5,25" />
      <polygon points="50,15 85,32 85,68 50,85 15,68 15,32" />
      <path d="M50 5 L50 95 M5 25 L95 75 M5 75 L95 25" />
    </svg>
  );
  if (type === "operate") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="50" r="40" />
      <circle cx="50" cy="50" r="25" />
      <circle cx="50" cy="50" r="10" />
      <path d="M50 10 L50 90 M10 50 L90 50" strokeDasharray="2 4" />
      <circle cx="50" cy="10" r="3" fill="currentColor" />
      <circle cx="50" cy="90" r="3" fill="currentColor" />
      <circle cx="10" cy="50" r="3" fill="currentColor" />
      <circle cx="90" cy="50" r="3" fill="currentColor" />
    </svg>
  );
  if (type === "wealth") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M20 80 L50 20 L80 80 Z" />
      <path d="M35 50 L65 50" />
      <circle cx="50" cy="20" r="4" fill="currentColor" />
      <circle cx="20" cy="80" r="4" fill="currentColor" />
      <circle cx="80" cy="80" r="4" fill="currentColor" />
      <path d="M50 20 L50 80" strokeDasharray="2 4" />
    </svg>
  );
  if (type === "people") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="30" r="15" />
      <circle cx="30" cy="70" r="15" />
      <circle cx="70" cy="70" r="15" />
      <path d="M40 42 L35 55 M60 42 L65 55 M45 70 L55 70" />
    </svg>
  );
  if (type === "timing") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <circle cx="50" cy="50" r="40" />
      <path d="M50 10 A40 40 0 0 1 90 50" />
      <path d="M50 50 L50 20 M50 50 L70 50" strokeWidth="2" />
      <circle cx="50" cy="50" r="4" fill="currentColor" />
    </svg>
  );
  if (type === "decision") return (
    <svg className={base} viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M10 20 L90 20 L60 80 L40 80 Z" />
      <path d="M25 40 L75 40 M35 60 L65 60" />
      <circle cx="50" cy="80" r="5" fill="currentColor" />
    </svg>
  );
  return null;
};

/** Section header: navy→coral gradient bar, matches dashboard */
const SectionHeader: React.FC<{ chapter: string; title: string; subtitle?: string; graphicType?: string }> = ({
  chapter, title, subtitle, graphicType
}) => (
  <div className="mb-16 relative">
    {graphicType && <SectionGraphic type={graphicType} />}
    <div
      className="w-full h-[1px] mb-8"
      style={{ background: `linear-gradient(90deg, ${C.border} 0%, transparent 100%)` }}
    />
    <div className="flex items-center gap-2 mb-4">
      <Sparkle size={12} color={C.coral} />
      <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
        {chapter}
      </p>
    </div>
    <h2 className="text-4xl font-bold leading-tight mb-4 relative z-10" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em" }}>
      {title}
    </h2>
    {subtitle !== undefined && (
      <p className="text-base leading-relaxed relative z-10" style={{ color: C.muted, maxWidth: "600px" }}>{subtitle}</p>
    )}
  </div>
);

/** Decision axis card: styled with Cae Goh tokens */
const AxisCard: React.FC<{
  title:        string;
  description:  string;
  value:        string;
  isAutoFilled: boolean;
  answer:       AxisAnswer;
  onAnswer?:    (v: boolean) => void;
}> = ({ title, description, value, isAutoFilled, answer, onAnswer }) => {
  const aligned    = answer === true;
  const notAligned = answer === false;

  const borderColor = aligned ? "#16a34a55"
    : notAligned ? "#e8642d55"
    : C.border;
  const bgColor = aligned ? "#f0fff4"
    : notAligned ? "#fff7f5"
    : C.cream;

  return (
    <div
      className="rounded-2xl flex flex-col gap-4 p-5 transition-all duration-300"
      style={{ border: `1px solid ${borderColor}`, background: bgColor }}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.muted }}>
            {title}
          </p>
          <p className="text-sm font-bold leading-tight" style={{ color: C.navy }}>{value}</p>
        </div>
        {isAutoFilled && (
          <span
            className="shrink-0 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide"
            style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)" }}
          >
            Auto
          </span>
        )}
      </div>

      <p className="text-xs leading-relaxed flex-1" style={{ color: C.muted }}>{description}</p>

      {onAnswer !== undefined ? (
        <div className="flex gap-2 mt-auto">
          <button
            type="button"
            onClick={() => { onAnswer(true); }}
            className="flex-1 rounded-xl py-2 text-xs font-bold transition-all"
            style={aligned
              ? { background: "#16a34a", color: C.white, border: "1px solid #16a34a" }
              : { background: C.white, color: C.navy, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }
            }
          >
            Yes, aligned
          </button>
          <button
            type="button"
            onClick={() => { onAnswer(false); }}
            className="flex-1 rounded-xl py-2 text-xs font-bold transition-all"
            style={notAligned
              ? { background: C.coral, color: C.white, border: `1px solid ${C.coral}` }
              : { background: C.white, color: C.navy, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }
            }
          >
            Not aligned
          </button>
        </div>
      ) : (
        <div
          className="rounded-xl py-2 text-xs font-bold text-center mt-auto"
          style={{
            background: aligned ? "#dcfce7" : notAligned ? "#fff1ee" : `${C.cream}cc`,
            color: aligned ? "#16a34a" : notAligned ? C.coral : C.muted,
          }}
        >
          {aligned ? "Aligned ✓" : notAligned ? "Caution" : "-"}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Access denied
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// Mini-chart display components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Single palace cell for the 1-5-9 context display in the Structure section.
 * Shows palace name, English label, main stars with N/S classification, and
 * any 四化 transformations attached to those stars.
 */




const TRANSFORMATION_ENGLISH: Record<string, string> = {
  "化禄": "Hua Lu",
  "化祿": "Hua Lu",
  "化权": "Hua Quan",
  "化權": "Hua Quan",
  "化科": "Hua Ke",
  "化忌": "Hua Ji",
};

/**
 * Compact 12-palace grid replicating the classic ZWDS 4×4 layout.
 * Uses CSS grid-template-areas mapped to each palace's earthly branch.
 * The highlighted palace is the active Life Palace.
 */
const TwelvePalaceMiniGrid: React.FC<{ chartData: ChartData; highlightPalaces?: string[] }> = ({ chartData, highlightPalaces }) => {
  const { t } = useLanguage();
  const lifePalaceNum = chartData.lifePalace;

  /** Single cell: either a palace or the center */
  const Cell: React.FC<{ palace: Palace }> = ({ palace }) => {
    const isLife  = palace.number === lifePalaceNum;
    const isHighlighted = highlightPalaces ? highlightPalaces.includes(palace.name) : isLife;
    const isBody  = palace.name === chartData.palaces[chartData.bodyPalace - 1]?.name;
    let mainStars = palace.mainStar ?? [];
    let minorStars = palace.minorStars ?? [];

    const englishName = PALACE_ENGLISH[palace.name] ?? "Palace";

    return (
      <div
        style={{
          gridArea: BRANCH_TO_AREA[palace.earthlyBranch] ?? "p_yin",
          background: isHighlighted ? C.cream : C.white,
          border: `1px solid ${isHighlighted ? C.coral : `${C.border}80`}`,
          borderRadius: 2, // Very sharp for authentic grid look
          padding: "8px",
          minHeight: 90,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          overflow: "hidden",
          opacity: highlightPalaces && !isHighlighted ? 0.35 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {/* Authentic Watermark */}
        <div className="absolute bottom-0 right-1 text-[40px] font-bold opacity-[0.04] pointer-events-none leading-none select-none" style={{ color: C.navy, fontFamily: "serif" }}>
          {palace.name}
        </div>

        {/* Top: Stars */}
        <div className="relative z-10 flex flex-col gap-0.5">
          {minorStars.map((star) => {
            return (
              <div key={star.name} className="flex items-center gap-1 flex-wrap">
                <span
                  className="text-[9px] font-medium tracking-wide"
                  style={{
                    color: C.navy,
                    fontFamily: "Georgia, serif"
                  }}
                >
                  {STAR_BRIEF[star.name]?.pinyin ?? star.name}
                </span>
                {star.transformations?.map((trans, idx) => {
                  const transEng = TRANSFORMATION_ENGLISH[trans];
                  return transEng ? (
                    <span key={idx} style={{ color: C.gold, fontSize: 7, fontWeight: "bold" }}>[{transEng}]</span>
                  ) : null;
                })}
              </div>
            );
          })}
          {mainStars.map((star) => {
            const ns = classifyMainStar(star.name);
            
            return (
              <div key={star.name} className="flex items-center gap-1 flex-wrap">
                <span
                  className="text-[9px] font-bold tracking-wide"
                  style={{
                    color: ns === "north" ? "#1e3a8a" : ns === "south" ? "#9f1239" : C.navy,
                    fontFamily: "Georgia, serif"
                  }}
                >
                  {STAR_BRIEF[star.name]?.pinyin ?? star.name}
                </span>
                {star.transformations?.map((trans, idx) => {
                  const transEng = TRANSFORMATION_ENGLISH[trans];
                  return transEng ? (
                    <span key={idx} style={{ color: C.gold, fontSize: 7, fontWeight: "bold" }}>[{transEng}]</span>
                  ) : null;
                })}
              </div>
            );
          })}
        </div>

        {/* Bottom: Palace Name & Badges */}
        <div className="relative z-10 mt-auto flex flex-col items-end text-right pt-2">
          <div className="flex gap-1 mb-0.5">
            {isLife && (
              <span className="text-[5px] bg-[#e8642d] text-white px-1 uppercase font-bold tracking-wider">Life</span>
            )}
            {isBody && (
              <span className="text-[5px] bg-[#151833] text-white px-1 uppercase font-bold tracking-wider">Body</span>
            )}
          </div>
          <span className="text-[8px] font-bold text-[#151833] uppercase tracking-wider">
            {englishName}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateAreas: `
          "p_si   p_wu   p_wei  p_shen"
          "p_chen center center p_you"
          "p_mao  center center p_xu"
          "p_yin  p_chou p_zi   p_hai"
        `,
        gridTemplateColumns: "repeat(4, 1fr)",
        gridTemplateRows: "repeat(4, auto)",
        gap: 4,
        padding: 4,
        background: `${C.border}30`,
        borderRadius: 4,
      }}
    >
      {/* 12 palace cells */}
      {chartData.palaces.map((palace) => (
        <Cell key={palace.number} palace={palace} />
      ))}

      {/* Center: person info */}
      <div
        style={{
          gridArea: "center",
          background: C.white,
          border: `1px solid ${C.border}80`,
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div style={{ background: C.navy, padding: "8px 0", textAlign: "center" }}>
          <p className="text-sm font-bold tracking-wider" style={{ color: C.cream, textTransform: "uppercase" }}>
            {chartData.input.name}
          </p>
        </div>
        
        {/* Body */}
        <div className="flex flex-col gap-1.5 p-3 text-[9px] flex-1 overflow-y-auto hide-scrollbar" style={{ color: C.navy }}>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Solar Date:</span>
            <span>
              {chartData.input.year} Year {chartData.input.month} Month {chartData.input.day} Day {chartData.input.hour} Hour
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Lunar Date:</span>
            <span>
              {t(`zwds.stems.${chartData.heavenlyStem}`)} {t(`zwds.branches.${chartData.earthlyBranch}`)}{chartData.lunarDate.year} Year {chartData.lunarDate.month} Month {chartData.lunarDate.day} Day {chartData.input.hour} Hour
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Five Element:</span>
            <span>{t(`zwds.fiveElements.${chartData.fiveElements}`)}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Gender:</span>
            <span>{chartData.input.gender === "male" ? "Male" : "Female"}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Age:</span>
            <span>{new Date().getFullYear() - chartData.lunarDate.year + 1}</span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Chinese Zodiac:</span>
            <span>
              {["🐭", "🐂", "🐯", "🐰", "🐲", "🐍", "🐴", "🐑", "🐵", "🐔", "🐶", "🐷"][(chartData.lunarDate.year - 4) % 12]}{" "}
              {["Rat", "Ox", "Tiger", "Rabbit", "Dragon", "Snake", "Horse", "Sheep", "Monkey", "Rooster", "Dog", "Pig"][(chartData.lunarDate.year - 4) % 12]}
            </span>
          </div>
          <div className="flex">
            <span className="w-20 font-semibold shrink-0" style={{ color: C.muted }}>Western Zodiac:</span>
            <span>
              {(() => {
                const month = chartData.input.month;
                const day = chartData.input.day;
                if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "♈ Aries";
                if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "♉ Taurus";
                if ((month === 5 && day >= 21) || (month === 6 && day <= 21)) return "♊ Gemini";
                if ((month === 6 && day >= 22) || (month === 7 && day <= 22)) return "♋ Cancer";
                if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "♌ Leo";
                if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "♍ Virgo";
                if ((month === 9 && day >= 23) || (month === 10 && day <= 23)) return "♎ Libra";
                if ((month === 10 && day >= 24) || (month === 11 && day <= 22)) return "♏ Scorpio";
                if ((month === 11 && day >= 23) || (month === 12 && day <= 21)) return "♐ Sagittarius";
                if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "♑ Capricorn";
                if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "♒ Aquarius";
                return "♓ Pisces";
              })()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const AccessDeniedView: React.FC = () => (
  <PageTransition>
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.coralDark} 100%)` }}
    >
      <div
        className="rounded-3xl p-12 max-w-sm text-center"
        style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
      >
        <div
          className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.coral})` }}
        >
          <svg className="w-7 h-7" fill="none" stroke={C.white} viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-[9px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.coral }}>
          Premium Access Required
        </p>
        <h1 className="text-2xl font-bold mb-3" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
          Alignment Advantage
        </h1>
        <p className="text-sm leading-relaxed mb-8" style={{ color: C.muted }}>
          This is a premium programme. Contact us to unlock your complete strategic playbook.
        </p>
        <Link
          to="/dashboard"
          className="inline-block px-7 py-3 rounded-2xl text-sm font-bold transition-all"
          style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.coral})`, color: C.white }}
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  </PageTransition>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main page
// ─────────────────────────────────────────────────────────────────────────────

const AlignmentAdvantage: React.FC = () => {
  const { profiles }              = useProfileContext();
  const { hasAlignmentAdvantage } = useTierAccess();
  const { showAlert }             = useAlertContext();

  const profile = useMemo(() => profiles.find((p) => p.is_self) ?? null, [profiles]);

  const chartData = useMemo((): ChartData | null => {
    if (!profile) return null;
    try {
      const d = new Date(`${profile.birthday}T12:00:00`);
      const input: ChartInput = {
        year:   d.getFullYear(),
        month:  d.getMonth() + 1,
        day:    d.getDate(),
        hour:   parseBirthHour(String(profile.birth_time)),
        gender: profile.gender === "male" ? "male" : "female",
        name:   profile.name,
      };
      return new ZWDSCalculator(input).calculate();
    } catch { return null; }
  }, [profile]);

  const strategicData = useMemo(() => {
    if (!chartData) return null;

    const wealthProfile: WealthCodeAnalysisResult = analyzeWealthCode(chartData);
    const rawDayun      = calculateCurrentDayunCycle(chartData);
    const dayun: DayunCycleExtended | null = rawDayun ? generateDayunGuidance(rawDayun) : null;

    const { solarYear, lunarMonth } = getLiuMonthAnchorFromLocalDate();
    const palaceNum   = getPalaceForAspectLiuMonth("life", chartData, lunarMonth, solarYear);
    const palace      = palaceNum !== null ? chartData.palaces[palaceNum - 1] : null;
    const palaceData  = palace ? PALACE_DATA[palace.name] : null;
    const signal: SignalColor = palaceData ? getSignalColor(palaceData.stars) : "yellow";

    return {
      wealthProfile,
      dayun,
      wealthArchetype: wealthProfile.dominantArchetype ?? "Your Wealth Code",
      season:          dayun?.season ?? null,
      phaseLabel:      PHASE_LABELS[dayun?.season ?? "spring"] ?? "Expansion",
      signal,
      signalLabel:     SIGNAL_LABELS[signal],
      monthName:       new Date().toLocaleString("en-US", { month: "long" }),
      palaceArea:      palaceData?.area ?? "",
      palacePriority:  palaceData?.priority ?? "",
      timingAligned:   signal === "green",
      wealthAligned:   (wealthProfile.codes[0]?.score ?? 0) >= 5,
    };
  }, [chartData]);

  const structureResult = useMemo((): StructureAnalysisResult | null => {
    if (!chartData) return null;
    return detectStructure(chartData, "natal");
  }, [chartData]);

  const monthPills = useMemo(() => (chartData ? buildMonthPills(chartData) : []), [chartData]);

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

  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(CURRENT_MONTH_INDEX);

  const selectedPalaceNum = useMemo(
    () => chartData ? getPalaceForAspectLiuMonth("life", chartData, selectedMonthIndex + 1, CURRENT_YEAR) : null,
    [chartData, selectedMonthIndex]
  );
  const selectedPalace = useMemo(
    () => selectedPalaceNum !== null && chartData ? chartData.palaces[selectedPalaceNum - 1] ?? null : null,
    [chartData, selectedPalaceNum]
  );

  const [framework, setFramework] = useState<DecisionFrameworkState>({ structural: null, timing: null, wealth: null });
  const [pdfLoading, setPdfLoading] = useState<boolean>(false);
  const [activeChapter, setActiveChapter] = useState<ChapterId>("cover");

  const timingAnswer: AxisAnswer = strategicData ? strategicData.timingAligned : null;
  const wealthAnswer: AxisAnswer = strategicData ? strategicData.wealthAligned : null;
  const frameworkScore = [framework.structural === true, timingAnswer === true, wealthAnswer === true].filter(Boolean).length;
  const recommendation = framework.structural !== null ? FRAMEWORK_RECOMMENDATIONS[frameworkScore] : null;

  // Active chapter detection
  useEffect(() => {
    const ids: ChapterId[] = ["cover", "design", "operate", "timing", "wealth", "people", "decision"];
    const observer = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting);
        if (hit.length > 0) {
          const top = hit.reduce((a, b) =>
            a.boundingClientRect.top < b.boundingClientRect.top ? a : b
          );
          setActiveChapter(top.target.id as ChapterId);
        }
      },
      { rootMargin: "-10% 0px -60% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => { observer.disconnect(); };
  }, []);

  const scrollTo = useCallback((id: ChapterId): void => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  const handleDownloadPlaybook = async (): Promise<void> => {
    if (pdfLoading) return;
    setPdfLoading(true);
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { showAlert("Please sign in first.", "error"); return; }
      const url = new URL(`${resolvePrintPageOrigin()}/print/alignment-advantage`);
      url.searchParams.set("pdfToken", token);
      await exportPdfViaServer(url.toString(), async () => `Bearer ${token}`, `Alignment-Advantage-${profile?.name ?? "report"}.pdf`);
    } catch (err) {
      showAlert(err instanceof Error ? err.message : "PDF generation failed.", "error");
    } finally {
      setPdfLoading(false);
    }
  };

  const handlePrintPreview = async (): Promise<void> => {
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;
      if (!token) { showAlert("Please sign in first.", "error"); return; }
      const url = new URL(`${resolvePrintPageOrigin()}/print/alignment-advantage`);
      url.searchParams.set("pdfToken", token);
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    } catch (err) {
      showAlert("Could not open print preview.", "error");
    }
  };

  if (!hasAlignmentAdvantage) return <AccessDeniedView />;

  if (!profile || !chartData || !strategicData || !structureResult) {
    return (
      <PageTransition>
        <div
          className="fixed inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.coralDark} 100%)` }}
        >
          <div className="flex flex-col items-center gap-4">
            <div
              className="h-10 w-10 animate-spin rounded-full border-[3px] border-t-transparent"
              style={{ borderColor: `${C.coral} transparent transparent transparent` }}
            />
            <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
              Loading your playbook…
            </p>
          </div>
        </div>
      </PageTransition>
    );
  }

  const phaseConfig  = PHASE_DISPLAY[strategicData.season ?? "spring"] ?? PHASE_DISPLAY.spring;
  const strLabel     = STRUCTURE_LABELS[structureResult.structureType];
  const formation    = FORMATION_PROFILES[structureResult.formation];

  /** Signal dot colour */
  const signalHex = strategicData.signal === "green" ? "#16a34a"
    : strategicData.signal === "red" ? C.coral : C.gold;

  return (
    <PageTransition>
      {/* ── Full-viewport two-column shell ─────────────────────────────── */}
      <div
        style={{
          position: "fixed", inset: 0, display: "flex", zIndex: 40, overflow: "hidden",
          background: C.navyDeep,
        }}
      >

        {/* ═══════════════════════════════════════════════════════════════
            SIDEBAR: mirrors the dashboard sidebar exactly
            ═══════════════════════════════════════════════════════════════ */}
        <aside
          className="shrink-0 flex flex-col overflow-hidden"
          style={{
            width: 230,
            height: "100%",
            background: `
              linear-gradient(180deg,
                ${C.navy}      0%,
                ${C.navyMid}   55%,
                ${C.coralDark}88 85%,
                ${C.coral}55   100%
              )
            `,
            position: "relative",
          }}
        >
          {/* Dot-texture overlay */}
          <div
            style={{
              position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "18px 18px",
            }}
          />

          {/* ── Brand header ── */}
          <div className="relative z-10 px-5 pt-7 pb-5" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkle size={9} color={C.coral} />
              <p className="text-[8px] font-bold uppercase tracking-[0.28em]" style={{ color: C.coral }}>
                Premium Programme
              </p>
            </div>
            <p
              className="text-base font-bold leading-tight mb-0.5"
              style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}
            >
              Alignment Advantage
            </p>
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.4)" }}>
              {profile.name}
            </p>
          </div>

          {/* ── Summary chips ── */}
          <div className="relative z-10 px-4 py-4" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-2.5" style={{ color: "rgba(255,255,255,0.3)" }}>
              Your Profile
            </p>
            <div className="flex flex-col gap-2">
              <div
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{ background: `${C.coral}22`, border: `1px solid ${C.coral}40` }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.coral }} />
                <p className="text-[10px] font-bold truncate" style={{ color: C.white }}>
                  {strLabel.label}
                </p>
              </div>
              <div
                className="inline-flex items-center gap-2 rounded-xl px-3 py-1.5"
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: C.gold }} />
                <p className="text-[10px] font-medium truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                  {phaseConfig.label} Phase
                </p>
              </div>
            </div>
          </div>

          {/* ── Chapter navigation ── */}
          <nav className="relative z-10 flex-1 overflow-y-auto px-3 py-4" aria-label="Document chapters">
            <p className="text-[8px] font-bold uppercase tracking-[0.2em] px-2 mb-3" style={{ color: "rgba(255,255,255,0.3)" }}>
              Contents
            </p>
            <ul className="space-y-0.5">
              {CHAPTERS.map((ch) => {
                const isActive = activeChapter === ch.id;
                return (
                  <li key={ch.id}>
                    <button
                      type="button"
                      onClick={() => { scrollTo(ch.id); }}
                      className="w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
                      style={{
                        background: isActive ? `${C.coral}22` : "transparent",
                        borderLeft: isActive ? `2px solid ${C.coral}` : "2px solid transparent",
                      }}
                    >
                      <div className="min-w-0 flex-1">
                        <p
                          className="text-xs font-semibold truncate"
                          style={{ color: isActive ? C.white : "rgba(255,255,255,0.5)" }}
                        >
                          {ch.label}
                        </p>
                        <p className="text-[9px] truncate" style={{ color: "rgba(255,255,255,0.28)" }}>
                          {ch.sub}
                        </p>
                      </div>
                      {isActive && (
                        <div
                          className="shrink-0 w-1 h-5 rounded-full"
                          style={{ background: `linear-gradient(180deg, ${C.coral}, ${C.gold})` }}
                        />
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* ── Action buttons ── */}
          <div
            className="relative z-10 px-4 py-4 space-y-2"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
          >
            <button
              type="button"
              onClick={() => { void handleDownloadPlaybook(); }}
              disabled={pdfLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
              style={{ background: `linear-gradient(135deg, ${C.coralDark}, ${C.coral})`, color: C.white }}
            >
              {pdfLoading ? (
                <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              ) : (
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              )}
              {pdfLoading ? "Generating…" : "Download Playbook"}
            </button>
            <button
              type="button"
              onClick={() => { void handlePrintPreview(); }}
              className="w-full py-2 rounded-xl text-xs font-medium transition-all"
              style={{ border: "1px solid rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.5)" }}
            >
              Print Preview
            </button>
          </div>

          {/* ── User footer with coral gradient ── */}
          <div
            className="relative z-10 px-4 py-3 flex items-center gap-3"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: "transparent" }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`, color: C.white }}
            >
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold truncate" style={{ color: "rgba(255,255,255,0.7)" }}>
                {profile.name}
              </p>
              <Link
                to="/dashboard"
                className="text-[9px] font-medium transition-colors hover:opacity-80"
                style={{ color: C.coral }}
              >
                ← Dashboard
              </Link>
            </div>
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════════
            MAIN CONTENT: warm peach-coral gradient, rich card sections
            ═══════════════════════════════════════════════════════════════ */}
        <main
          className="flex-1 overflow-y-auto"
          style={{
            height: "100%",
            background: `
              radial-gradient(ellipse 80% 60% at 70% 20%, ${C.coral}18 0%, transparent 60%),
              radial-gradient(ellipse 50% 40% at 20% 80%, ${C.navyMid}55 0%, transparent 55%),
              linear-gradient(160deg, ${C.cream} 0%, #f5ece2 60%, #ede4d8 100%)
            `,
          }}
        >
          {/* ── Session tag bar ── */}
          <div
            className="sticky top-0 z-20 flex items-center gap-3 px-8 py-3"
            style={{
              background: `${C.navy}ee`,
              backdropFilter: "blur(12px)",
              borderBottom: `1px solid rgba(255,255,255,0.07)`,
            }}
          >
            <Sparkle size={9} color={C.coral} />
            <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: C.coral }}>
              Alignment Advantage
            </p>
            <span className="text-[9px]" style={{ color: "rgba(255,255,255,0.2)" }}>·</span>
            <p className="text-[9px] font-bold uppercase tracking-[0.28em]" style={{ color: "rgba(255,255,255,0.35)" }}>
              Cae Goh
            </p>
            <div className="ml-auto flex items-center gap-2">
              <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </p>
            </div>
          </div>

          {/* ── Scrollable content ── */}
          <div className="px-8 py-8 max-w-4xl mx-auto space-y-12">

          {/* ══════════════════════════════════════
              SECTION 1: OVERVIEW / COVER
              ══════════════════════════════════════ */}
          <section id="cover" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
            <SectionWatermark type="compass" />
            
            {/* Hero */}
            <div className="mb-16 relative z-10">
              <div className="absolute -top-10 -right-10 w-64 h-64 opacity-10 pointer-events-none">
                <svg viewBox="0 0 100 100" fill="none" stroke="#e8642d" strokeWidth="0.5">
                  <circle cx="50" cy="50" r="45" strokeDasharray="2 4" />
                  <circle cx="50" cy="50" r="35" />
                  <path d="M50 5 L50 95 M5 50 L95 50" />
                  <circle cx="50" cy="50" r="10" fill="#e8642d" fillOpacity="0.2" />
                </svg>
              </div>
              <p className="text-[10px] font-bold uppercase tracking-[0.28em] mb-4" style={{ color: C.coral }}>
                Strategic Playbook · {profile.name}
              </p>
              <h1
                className="text-6xl font-bold leading-none mb-6"
                style={{
                  fontFamily: "Georgia,'Times New Roman',serif",
                  letterSpacing: "-0.03em",
                  background: `linear-gradient(135deg, ${C.navy} 0%, ${C.coralDark} 55%, ${C.coral} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Alignment<br />Advantage
              </h1>
              <p className="text-lg leading-relaxed mt-3 max-w-lg" style={{ color: C.muted }}>
                A personalised strategic playbook built from your Purple Star Astrology chart -
                giving you clarity on how you&apos;re wired, when to move, and how to build wealth on your terms.
              </p>
            </div>


            {/* 3-stat summary cards: cream with coral left-border accent */}
            <div className="grid grid-cols-3 gap-4">
              {/* Stat 1: Structure */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: C.cream,
                  border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                  borderLeft: `3px solid ${C.coral}`,
                }}
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
                  Operating Structure
                </p>
                <div>
                  <p className="text-lg font-bold leading-tight mb-1" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                    {strLabel.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{formation.englishName}</p>
                </div>
              </div>

              {/* Stat 2: Timing Phase */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: C.cream,
                  border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                  borderLeft: `3px solid ${C.navy}`,
                }}
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: C.navy }}>
                  Timing Phase
                </p>
                <div>
                  <p className="text-lg font-bold leading-tight mb-1" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                    {phaseConfig.label}
                  </p>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                    {strategicData.dayun?.startYear ?? ""}–{strategicData.dayun?.endYear ?? ""}
                  </p>
                </div>
              </div>

              {/* Stat 3: Monthly Signal */}
              <div
                className="rounded-2xl p-5 flex flex-col gap-3"
                style={{
                  background: C.cream,
                  border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)",
                  borderLeft: `3px solid ${signalHex}`,
                }}
              >
                <p className="text-[8px] font-bold uppercase tracking-[0.24em]" style={{ color: signalHex }}>
                  {strategicData.monthName} Signal
                </p>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: signalHex }} />
                    <p className="text-lg font-bold leading-tight" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                      {strategicData.signal === "green" ? "Green Light"
                        : strategicData.signal === "yellow" ? "Yellow Light" : "Red Light"}
                    </p>
                  </div>
                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                    {strategicData.palaceArea}
                  </p>
                </div>
              </div>
            </div>

            {/* Wealth archetype highlight */}
            <div
              className="mt-4 rounded-2xl px-6 py-5 flex items-center justify-between gap-4"
              style={{
                background: `linear-gradient(135deg, ${C.navy}ee, ${C.navyMid}ee)`,
                border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)",
              }}
            >
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: C.coral }}>
                  Dominant Wealth Archetype
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}
                >
                  {strategicData.wealthArchetype}
                </p>
              </div>
              <p className="text-xs leading-relaxed text-right max-w-xs" style={{ color: "rgba(255,255,255,0.45)" }}>
                {strategicData.dayun?.coreMessage ?? ""}
              </p>
            </div>
            {/* 12-Palace Mini Grid: full chart at a glance */}
            <div className="mt-6">
              <p
                className="text-[8px] font-bold uppercase tracking-[0.24em] mb-3"
                style={{ color: C.muted }}
              >
                Your Full 12-Palace Chart
              </p>
              <TwelvePalaceMiniGrid chartData={chartData} />
            </div>
          </section>

          {/* ══════════════════════════════════════
              SECTION 2: CORE DESIGN
              ══════════════════════════════════════ */}
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

            {/* Core Operating Structure: Editorial Spread */}
            <div className="py-16 border-y border-[#e8ddd0]/80 mb-24">
              <div className="flex flex-col md:flex-row gap-8 md:items-center">
                <div className="md:w-1/3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: C.coral }}>
                    Core Operating Structure
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full border" style={{ borderColor: `${C.coral}40`, color: C.coral }}>
                      {strLabel.label.includes("Speed") ? <Zap size={20} /> : <Shield size={20} />}
                    </span>
                  </div>
                </div>
                <div className="md:w-2/3">
                  <h3 className="text-5xl md:text-6xl font-bold mb-6" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em" }}>
                    {strLabel.label}
                  </h3>
                  <p className="text-lg md:text-xl leading-relaxed" style={{ color: C.muted, fontFamily: "Georgia,'Times New Roman',serif" }}>
                    {strLabel.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Strategic Formation: Refined Editorial Layout */}
            <div className="mb-24">
              <div className="flex items-center gap-3 mb-12">
                <span className="w-8 h-px" style={{ background: C.coral }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
                  Strategic Formation
                </p>
              </div>

              <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
                <div className="flex-1">
                  <h3 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em" }}>
                    {formation.englishName}
                  </h3>
                  
                  <p className="text-xl italic leading-relaxed mb-10" style={{ color: C.muted, fontFamily: "Georgia,'Times New Roman',serif" }}>
                    &ldquo;{formation.tagline}&rdquo;
                  </p>
                  
                  {/* Key Traits */}
                  <div className="flex flex-col gap-6">
                    {formation.keyTraits.map((t, i) => (
                      <div key={i} className="flex items-start gap-5">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ border: `1px solid ${C.coral}50`, color: C.coral }}>
                          <span className="text-[12px] font-bold">{i + 1}</span>
                        </div>
                        <span className="text-base leading-relaxed" style={{ color: C.navy }}>{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col gap-4 justify-center">
                  <div className="p-8 rounded-[24px] flex flex-col justify-center h-full" style={{ background: "#f0fdf4" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white" style={{ color: "#16a34a", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.1)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                      </div>
                      <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: "#16a34a" }}>Lean Into</p>
                    </div>
                    <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: "#14532d", fontFamily: "Georgia,'Times New Roman',serif" }}>{formation.strategyAdvice}</p>
                  </div>
                  
                  <div className="p-8 rounded-[24px] flex flex-col justify-center h-full" style={{ background: "#fff1ee" }}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-white" style={{ color: C.coral, boxShadow: "0 4px 12px rgba(224, 108, 83, 0.1)" }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                      </div>
                      <p className="text-[12px] font-bold uppercase tracking-widest" style={{ color: C.coral }}>Avoid</p>
                    </div>
                    <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: C.coralDark, fontFamily: "Georgia,'Times New Roman',serif" }}>{formation.avoidAdvice}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Special formations (if any) */}
            {structureResult.specialFormations.length > 0 && (
              <div className="mb-24">
                <div className="flex items-center gap-3 mb-8">
                  <span className="w-8 h-px" style={{ background: C.gold }} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.gold }}>
                    Hidden Edge · Special Formation
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {structureResult.specialFormations.map((k) => {
                    const sp = FORMATION_PROFILES[k];
                    return (
                      <div
                        key={k}
                        className="rounded-[24px] p-8 md:p-10 relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6"
                        style={{ background: C.navy }}
                      >
                        <div className="absolute top-0 right-0 w-64 h-64 opacity-10 pointer-events-none" style={{ color: C.gold, transform: "translate(20%, -20%)" }}>
                          <svg viewBox="0 0 100 100" fill="currentColor">
                            <polygon points="50,0 100,25 100,75 50,100 0,75 0,25" />
                          </svg>
                        </div>
                        <div className="flex-1 relative z-10">
                          <div className="flex items-end gap-4 mb-4">
                            <h4 className="text-3xl md:text-4xl font-bold" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.01em" }}>{sp.englishName}</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest" style={{ background: `${C.gold}20`, color: C.gold }}>{sp.chineseStyle}</span>
                          </div>
                          <p className="text-lg md:text-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.8)" }}>{sp.tagline}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Formation Decision Rules: green / red flags ── */}
            <div className="mb-16">
              <div className="flex items-center gap-3 mb-10">
                <span className="w-8 h-px" style={{ background: C.coral }} />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: C.coral }}>
                  Execution Rules
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Green flags */}
                <div className="p-8 rounded-[24px]" style={{ border: `1px solid ${C.border}40`, background: C.white }}>
                  <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: `1px solid ${C.border}40` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>When to Proceed</h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: "#16a34a" }}>Green Flags</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {formation.greenFlags.map((flag, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-[16px]" style={{ background: `${C.cream}30` }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#f0fdf4", color: "#16a34a" }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l5 5L20 7"/></svg>
                        </div>
                        <span className="text-sm font-medium leading-relaxed" style={{ color: C.navy }}>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Red flags */}
                <div className="p-8 rounded-[24px]" style={{ border: `1px solid ${C.border}40`, background: C.white }}>
                  <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: `1px solid ${C.border}40` }}>
                    <div className="w-14 h-14 rounded-full flex items-center justify-center shrink-0" style={{ background: "#fff1ee", color: C.coral }}>
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>When to Walk Away</h4>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1" style={{ color: C.coral }}>Red Flags</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {formation.redFlags.map((flag, i) => (
                      <div key={i} className="flex items-start gap-4 p-4 rounded-[16px]" style={{ background: `${C.cream}30` }}>
                        <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "#fff1ee", color: C.coral }}>
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                        </div>
                        <span className="text-sm font-medium leading-relaxed" style={{ color: C.navy }}>{flag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formation decision rule */}
              <div className="mt-20 py-12 relative text-center px-4 md:px-12">
                <div className="absolute top-0 left-1/4 right-1/4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.coral}40, transparent)` }} />
                <div className="absolute bottom-0 left-1/4 right-1/4 h-px" style={{ background: `linear-gradient(90deg, transparent, ${C.coral}40, transparent)` }} />
                
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-6" style={{ color: C.coral }}>
                  The Golden Rule
                </p>
                <p className="text-2xl md:text-4xl leading-relaxed italic" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  &ldquo;{formation.decisionRule}&rdquo;
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════
              SECTION 3: HOW YOU OPERATE
              ══════════════════════════════════════ */}
          <section id="operate" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
            <SectionWatermark type="nodes" />
            <SectionHeader
              graphicType="operate"
              chapter="Chapter 02 · Operating System"
              title="Executive Capacity"
              subtitle="Three core palaces that reveal how you think, what drives you, and how you execute."
            />

            {/* Helper: render one operate-palace block */}
            {(() => {
              /**
               * Renders a palace block: mini-card + star brief descriptions.
               * Used for Life, Inner Power, and Health palaces.
               */
              const renderOperatePalace = (
                palaceName: string,
                sectionLabel: string,
                framing: string,
                isFirstPalace: boolean,
              ): React.ReactNode => {
                const palace = getPalaceByName(chartData.palaces, palaceName);
                const mainStars = palace?.mainStar ?? [];
                const hasStars = mainStars.length > 0;

                return (
                  <div
                    key={palaceName}
                    className="rounded-2xl overflow-hidden mb-4"
                    style={{ border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                  >
                    {/* Palace header: navy */}
                    <div
                      className="px-6 py-4 flex items-center justify-between gap-4"
                      style={{
                        background: isFirstPalace
                          ? `linear-gradient(135deg, ${C.navy}, ${C.navyMid})`
                          : C.navy,
                      }}
                    >
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {sectionLabel}
                        </p>
                        <p className="text-base font-bold" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                          {PALACE_ENGLISH[palaceName] ?? palaceName}
                        </p>
                      </div>
                      <span className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.12)", fontFamily: "Georgia,'Times New Roman',serif" }}>
                        {palaceName}
                      </span>
                    </div>

                    {/* Visual star cards */}
                    <div className="px-5 pt-3 pb-5" style={{ background: C.cream }}>
                      {/* Framing subtitle */}
                      <p className="text-[10px] mb-4" style={{ color: C.muted }}>{framing}</p>
                      {hasStars ? (
                        <div className="grid gap-3" style={{ gridTemplateColumns: mainStars.length === 1 ? "1fr" : `repeat(${Math.min(mainStars.length, 2)}, 1fr)` }}>
                          {mainStars.map((star) => {
                            const brief    = STAR_BRIEF[star.name];
                            const role     = brief?.role ?? "aux";
                            const accentColor = role === "north" ? "#2563eb" : role === "south" ? C.coral : C.muted;
                            const accentBg    = role === "north" ? "#dbeafe" : role === "south" ? `${C.coral}18` : `${C.muted}18`;
                            return (
                              <div
                                key={star.name}
                                className="rounded-2xl overflow-hidden relative"
                                style={{ border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `4px solid ${accentColor}` }}
                              >
                                {/* Decorative ghost Chinese character */}
                                <div
                                  className="absolute top-2 right-3 font-bold select-none pointer-events-none"
                                  style={{ fontSize: 64, lineHeight: 1, color: accentColor, opacity: 0.07, fontFamily: "Georgia,'Times New Roman',serif" }}
                                  aria-hidden="true"
                                >
                                  {star.name}
                                </div>

                                <div className="relative p-5">
                                  {/* Title badge + transformation */}
                                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                                    <span
                                      className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                      style={{ background: accentBg, color: accentColor }}
                                    >
                                      {brief?.title ?? "Support Star"}
                                    </span>
                                    {star.transformations !== undefined && star.transformations.length > 0 && (
                                      <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${C.gold}20`, color: C.gold }}>
                                        {star.transformations[0]}
                                      </span>
                                    )}
                                  </div>

                                  {/* Pinyin name: large */}
                                  <p
                                    className="text-2xl font-bold leading-none mb-4"
                                    style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
                                  >
                                    {brief?.pinyin ?? star.name}
                                  </p>

                                  {/* Keyword tags */}
                                  <div className="flex flex-wrap gap-1.5 mb-4">
                                    {(brief?.keywords ?? [star.name]).map((kw) => (
                                      <span
                                        key={kw}
                                        className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                                        style={{ background: `${C.navy}0a`, color: C.navy, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                                      >
                                        {kw}
                                      </span>
                                    ))}
                                  </div>

                                  {/* One-liner brief */}
                                  <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                                    {brief?.brief ?? "Influences this area of your chart."}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl p-5 flex items-start gap-3"
                          style={{ background: `${C.navy}06`, border: `1px dashed ${C.border}` }}
                        >
                          <div
                            className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                            style={{ background: `${C.navy}12`, color: C.muted }}
                          >
                            ∅
                          </div>
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: C.navy }}>No main stars placed</p>
                            <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                              This palace borrows energy from its opposite and reflects a fluid, context-driven expression rather than a fixed archetype.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              };

              return (
                <>
                  {renderOperatePalace("命宫",  "Life Palace · Your Character Blueprint",      "Core identity, temperament, and the energy you project into the world.", true)}
                  {renderOperatePalace("福德",  "Inner Power Palace · What Drives You",        "Internal fuel source: what keeps you going when external results are slow.", false)}
                  {renderOperatePalace("官禄",  "Operational Capacity · How You Execute",      "Your natural operating rhythm and the environments where you build momentum fastest.", false)}
                </>
              );
            })()}

            {/* Operating style synthesis callout */}
            <div
              className="rounded-2xl p-5 flex items-start gap-3"
              style={{ background: `linear-gradient(135deg, ${C.navy}ee, ${C.navyMid}cc)`, border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)" }}
            >
              <Sparkle size={14} color={C.coral} />
              <div>
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: C.coral }}>
                  What This Means for You
                </p>
                <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Your character is shaped by the combined energy of your Life, Inner Power, and Health palaces.
                  Use this section to understand your natural operating style: and to design your work environment
                  to maximise your peak energy while protecting your known depletion points.
                </p>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════
              SECTION 4: TIMING
              ══════════════════════════════════════ */}
          <section id="wealth" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-[#fdf6ee] rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/80">
            <SectionWatermark type="waves" />
            <SectionHeader
              graphicType="wealth"
              chapter="Chapter 03 · Wealth Acceleration"
              title="Your Wealth Blueprint"
              subtitle="Your dominant wealth archetype, what to focus on, what to stop, and the timing-wealth intersection for this cycle."
            />

            {/* ── Wealth Type Profile: what category of wealth your chart attracts ── */}
            {(() => {
              const wealthKey = strategicData.wealthProfile.codes[0]?.key as WealthCodeKey | undefined;
              const wtProfile = wealthKey !== undefined ? WEALTH_TYPE[wealthKey] : undefined;
              if (!wtProfile) return null;
              return (
                <div
                  className="rounded-2xl overflow-hidden mb-5"
                  style={{ border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                >
                  <div
                    className="px-7 py-5"
                    style={{ background: `linear-gradient(135deg, ${C.navy}, ${C.navyMid})` }}
                  >
                    <p className="text-[8px] font-bold uppercase tracking-[0.22em] mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Wealth Category
                    </p>
                    <p className="text-xl font-bold mb-2" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                      {wtProfile.category}
                    </p>
                    <p className="text-xs leading-relaxed italic mb-1" style={{ color: "rgba(255,255,255,0.65)" }}>
                      &ldquo;{wtProfile.tagline}&rdquo;
                    </p>
                  </div>
                  <div className="px-7 py-5" style={{ background: C.cream, borderTop: `1px solid ${C.border}` }}>
                    <p className="text-xs leading-relaxed mb-4" style={{ color: C.muted }}>{wtProfile.description}</p>
                    <div>
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-2.5" style={{ color: C.muted }}>
                        What this looks like in practice
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {wtProfile.examples.map((ex) => (
                          <span
                            key={ex}
                            className="rounded-xl px-3 py-1.5 text-xs font-medium"
                            style={{ background: `${C.navy}0c`, color: C.navy, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Wealth-relevant palace snapshot: shows the 財帛 palace (and its stars)
                so the reader can see exactly which stars produced their wealth archetype. */}
            <div className="mb-8">
              <TwelvePalaceMiniGrid chartData={chartData} highlightPalaces={["财帛", "田宅", "官禄"]} />
            </div>

            {/* Transition Element */}
            <div className="flex flex-col items-center justify-center my-16 relative">
              <div className="w-px h-16 mb-6" style={{ background: `linear-gradient(to bottom, ${C.border}, ${C.coral})` }} />
              <div className="text-center max-w-2xl px-6">
                <p className="text-lg md:text-xl italic leading-relaxed" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  By examining the specific stars residing in your highlighted Wealth, Property, and Career palaces, we decode your innate capacity for generating and sustaining capital.
                </p>
              </div>
              <div className="w-px h-16 mt-6" style={{ background: `linear-gradient(to bottom, ${C.coral}, transparent)` }} />
            </div>

            {/* ── Dominant archetype statement (navy card) ── */}
            <div
              className="rounded-3xl p-8 mb-8 flex items-start justify-between gap-6"
              style={{ background: C.navy, boxShadow: "0 8px 32px rgba(26,30,63,0.15)" }}
            >
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Dominant Wealth Archetype
                </p>
                <p className="text-3xl font-bold mb-4" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  {strategicData.wealthProfile.dominantArchetype}
                </p>
                <p className="text-sm leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {strategicData.wealthProfile.summaryText}
                </p>
              </div>
              <div
                className="shrink-0 rounded-2xl px-4 py-2 text-sm font-bold"
                style={{ background: `${C.coral}25`, color: C.coral, border: `1px solid ${C.coral}40` }}
              >
                {strategicData.wealthProfile.profileType}
              </div>
            </div>

            {/* ── Wealth code score bars ── */}
            <div
              className="rounded-3xl p-8 mb-8"
              style={{ background: C.cream, border: `1px solid ${C.border}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6" style={{ color: C.muted }}>
                Wealth Code Scores
              </p>
              <div className="space-y-6">
                {strategicData.wealthProfile.codes.map((code, i) => {
                  const pct = Math.round((code.score / 10) * 100);
                  const isDominant = i === 0;
                  return (
                    <div key={code.key}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          {isDominant && (
                            <span
                              className="rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide"
                              style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}30` }}
                            >
                              Primary
                            </span>
                          )}
                          <p className="text-sm font-semibold" style={{ color: C.navy }}>{code.label}</p>
                        </div>
                        <p className="text-base font-bold" style={{ color: isDominant ? C.coral : C.navy }}>
                          {code.score.toFixed(1)}
                        </p>
                      </div>
                      <div className="h-2 rounded-full overflow-hidden" style={{ background: C.border }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: isDominant
                              ? `linear-gradient(90deg, ${C.navy}, ${C.coral})`
                              : `linear-gradient(90deg, ${C.navy}88, ${C.navy}55)`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── Strengths + Blind spots ── */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div
                className="rounded-2xl p-5"
                style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: "3px solid #16a34a" }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#16a34a" }}>
                  Your Strengths
                </p>
                <ul className="space-y-2">
                  {strategicData.wealthProfile.strengths.slice(0, 4).map((s) => (
                    <li key={s.slice(0, 40)} className="flex items-start gap-2">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[8px] font-bold"
                        style={{ background: "#dcfce7", color: "#16a34a" }}
                      >
                        ✓
                      </span>
                      <span className="text-xs leading-snug" style={{ color: C.navy }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                className="rounded-2xl p-5"
                style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.coral}` }}
              >
                <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.coral }}>
                  Blind Spots
                </p>
                <ul className="space-y-2">
                  {strategicData.wealthProfile.blindSpots.slice(0, 4).map((s) => (
                    <li key={s.slice(0, 40)} className="flex items-start gap-2">
                      <span
                        className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[8px] font-bold"
                        style={{ background: `${C.coral}18`, color: C.coral }}
                      >
                        !
                      </span>
                      <span className="text-xs leading-snug" style={{ color: C.navy }}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* ── Ideal roles ── */}
            {strategicData.wealthProfile.idealRoles.length > 0 && (
              <div
                className="rounded-3xl p-8 mb-8"
                style={{ background: C.cream, border: `1px solid ${C.border}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}
              >
                <div className="flex items-center gap-1.5 mb-6">
                  <Compass size={14} color={C.muted} />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
                    Ideal Career Paths
                  </p>
                </div>
                <div className="space-y-5">
                  {strategicData.wealthProfile.idealRoles.slice(0, 4).map((r) => (
                    <div key={r.role} className="flex items-start gap-4">
                      <span
                        className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold"
                        style={{ background: `${C.coral}18`, color: C.coral }}
                      >
                        ▸
                      </span>
                      <div>
                        <p className="text-sm font-semibold mb-1" style={{ color: C.navy }}>{r.role}</p>
                        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>{r.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Phase × Wealth intersection ── */}
            {strategicData.dayun !== null && (() => {
              const phaseKey: PhaseAlignmentSeasonKey = DAYUN_TO_PHASE[strategicData.dayun?.season ?? ""] ?? "expansion";
              const wealthKey = strategicData.wealthProfile.codes[0]?.key as PhaseAlignmentWealthKey | undefined;
              const alignEntry = wealthKey !== undefined ? (PHASE_ALIGNMENT_MATRIX[phaseKey]?.[wealthKey] ?? null) : null;
              const topActions = strategicData.dayun.keyActions.slice(0, 3);

              return (
                <div className="space-y-4">
                  {/* Phase directive */}
                  {alignEntry !== null && (
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.navy}` }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.navy }}>
                        Phase × Wealth Alignment · {phaseKey.charAt(0).toUpperCase() + phaseKey.slice(1)}
                      </p>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: C.navy }}>{alignEntry.copy}</p>
                    </div>
                  )}

                  {/* Key actions + Watch out */}
                  <div className="grid grid-cols-2 gap-4">
                    {topActions.length > 0 && (
                      <div
                        className="rounded-2xl p-5"
                        style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.navy}` }}
                      >
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.navy }}>
                          Key Actions This Phase
                        </p>
                        <ol className="space-y-2">
                          {topActions.map((action, idx) => (
                            <li key={`${action}-${idx}`} className="flex items-start gap-2">
                              <span
                                className="w-5 h-5 shrink-0 rounded-full mt-0.5 flex items-center justify-center text-[9px] font-bold"
                                style={{ background: C.navy, color: C.white }}
                              >
                                {idx + 1}
                              </span>
                              <span className="text-xs leading-snug" style={{ color: C.navy }}>{action}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    )}
                    {alignEntry !== null && alignEntry.watchOut.length > 0 && (
                      <div
                        className="rounded-2xl p-5"
                        style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.coral}` }}
                      >
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.coral }}>
                          Risk Mitigation
                        </p>
                        <ul className="space-y-2">
                          {alignEntry.watchOut.map((item, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span
                                className="w-5 h-5 shrink-0 rounded-full mt-0.5 flex items-center justify-center text-[9px] font-bold"
                                style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)" }}
                              >
                                {i + 1}
                              </span>
                              <span className="text-xs leading-snug" style={{ color: C.navy }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* ── Focus On + Stop Doing: wealth-code specific actions ── */}
            {(() => {
              const wealthKey = strategicData.wealthProfile.codes[0]?.key as WealthCodeKey | undefined;
              if (!wealthKey) return null;
              const focusItems = FOCUS_ON[wealthKey];
              const stopItems  = STOP_DOING[wealthKey];
              return (
                <div className="grid grid-cols-2 gap-4 mt-4">
                  {/* FOCUS ON */}
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: "3px solid #16a34a" }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#16a34a" }}>
                      Focus On
                    </p>
                    <ol className="space-y-3">
                      {focusItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            className="w-5 h-5 shrink-0 rounded-full mt-0.5 flex items-center justify-center text-[8px] font-bold"
                            style={{ background: "#dcfce7", color: "#16a34a" }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-xs leading-snug" style={{ color: C.navy }}>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  {/* STOP DOING */}
                  <div
                    className="rounded-2xl p-5"
                    style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.coral}` }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.coral }}>
                      Stop Doing
                    </p>
                    <ol className="space-y-3">
                      {stopItems.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <span
                            className="w-5 h-5 shrink-0 rounded-full mt-0.5 flex items-center justify-center text-[8px] font-bold"
                            style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)" }}
                          >
                            {i + 1}
                          </span>
                          <span className="text-xs leading-snug" style={{ color: C.navy }}>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })()}

            {/* ── Ideal Collaborator ── */}
            {(() => {
              const wealthKey = strategicData.wealthProfile.codes[0]?.key as WealthCodeKey | undefined;
              if (!wealthKey) return null;
              const collab = IDEAL_COLLABORATOR[wealthKey];
              return (
                <div
                  className="rounded-3xl overflow-hidden mt-8 mb-8"
                  style={{ border: `1px solid ${C.border}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}
                >
                  <div className="px-8 py-6" style={{ background: C.navy }}>
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Users size={14} color="rgba(255,255,255,0.4)" />
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Ideal Collaborator
                      </p>
                    </div>
                    <p className="text-xl font-bold" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                      {collab.type}
                    </p>
                  </div>
                  <div className="px-8 py-8" style={{ background: C.cream }}>
                    <p className="text-base leading-relaxed mb-6" style={{ color: C.muted }}>{collab.description}</p>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.muted }}>
                      Look for someone who is
                    </p>
                    <ul className="space-y-4">
                      {collab.lookFor.map((item, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="w-6 h-6 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[10px] font-bold"
                            style={{ background: `${C.coral}18`, color: C.coral }}
                          >
                            ▸
                          </span>
                          <span className="text-sm leading-snug" style={{ color: C.navy }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })()}

            {/* ── Alternative Path: risk mitigation ── */}
            {(() => {
              const seasonKey = strategicData.dayun?.season ?? "expansion";
              const altPath   = ALTERNATIVE_PATH[seasonKey] ?? ALTERNATIVE_PATH.expansion;
              return (
                <div
                  className="rounded-3xl p-8 mt-8 flex items-start gap-4"
                  style={{ background: `${C.gold}12`, border: `1px solid ${C.gold}35` }}
                >
                  <div
                    className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                    style={{ background: `${C.gold}25`, color: C.gold }}
                  >
                    ⚡
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-2" style={{ color: C.gold }}>
                      Alternative Path · If Misalignment is Detected
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: C.navy }}>{altPath}</p>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* ══════════════════════════════════════
              SECTION 6: PEOPLE INTELLIGENCE
              ══════════════════════════════════════ */}
          <section id="people" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
            <SectionWatermark type="network" />
            <SectionHeader
              graphicType="people"
              chapter="Chapter 04 · Stakeholder Intelligence"
              title="Your Partnership & Alliance Dynamics"
              subtitle="Three relationship palaces that reveal who you attract, how you collaborate, and what kind of people amplify your results."
            />

            {(() => {
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

              return (
                <>
                  {peoplePalaces.map((palaceName) => {
                    const palace  = getPalaceByName(chartData.palaces, palaceName);
                    const framing = PEOPLE_PALACE_FRAMING[palaceName];
                    const mainStars = palace?.mainStar ?? [];
                    const hasStars  = mainStars.length > 0;

                    return (
                      <div
                        key={palaceName}
                        className="rounded-2xl overflow-hidden mb-4"
                        style={{ border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                      >
                        {/* Palace header */}
                        <div
                          className="px-6 py-4 flex items-center justify-between gap-4"
                          style={{ background: C.navy }}
                        >
                          <div>
                            <p className="text-[8px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "rgba(255,255,255,0.4)" }}>
                              {framing.sectionTitle}
                            </p>
                            <p className="text-base font-bold" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                              {PALACE_ENGLISH[palaceName] ?? palaceName}
                            </p>
                          </div>
                          <span className="text-2xl font-bold" style={{ color: "rgba(255,255,255,0.12)", fontFamily: "Georgia,'Times New Roman',serif" }}>
                            {palaceName}
                          </span>
                        </div>

                        {/* No intro strip: section header + star block label below is sufficient */}

                        {/* Visual star cards */}
                        <div className="px-5 py-5" style={{ background: C.cream }}>
                          <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-4" style={{ color: C.muted }}>
                            {framing.starBlockLabel}
                          </p>
                          {hasStars ? (
                            <div className="grid gap-3" style={{ gridTemplateColumns: mainStars.length === 1 ? "1fr" : `repeat(${Math.min(mainStars.length, 2)}, 1fr)` }}>
                              {mainStars.map((star) => {
                                const brief       = STAR_BRIEF[star.name];
                                const role        = brief?.role ?? "aux";
                                const accentColor = role === "north" ? "#2563eb" : role === "south" ? C.coral : C.muted;
                                const accentBg    = role === "north" ? "#dbeafe" : role === "south" ? `${C.coral}18` : `${C.muted}18`;
                                return (
                                  <div
                                    key={star.name}
                                    className="rounded-2xl overflow-hidden relative"
                                    style={{ border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `4px solid ${accentColor}` }}
                                  >
                                    <div
                                      className="absolute top-2 right-3 font-bold select-none pointer-events-none"
                                      style={{ fontSize: 64, lineHeight: 1, color: accentColor, opacity: 0.07, fontFamily: "Georgia,'Times New Roman',serif" }}
                                      aria-hidden="true"
                                    >
                                      {star.name}
                                    </div>
                                    <div className="relative p-5">
                                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                                        <span
                                          className="rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                          style={{ background: accentBg, color: accentColor }}
                                        >
                                          {brief?.title ?? "Support Star"}
                                        </span>
                                        {star.transformations !== undefined && star.transformations.length > 0 && (
                                          <span className="rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: `${C.gold}20`, color: C.gold }}>
                                            {star.transformations[0]}
                                          </span>
                                        )}
                                      </div>
                                      <p
                                        className="text-2xl font-bold leading-none mb-4"
                                        style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
                                      >
                                        {brief?.pinyin ?? star.name}
                                      </p>
                                      <div className="flex flex-wrap gap-1.5 mb-4">
                                        {(brief?.keywords ?? [star.name]).map((kw) => (
                                          <span
                                            key={kw}
                                            className="rounded-lg px-2.5 py-1 text-[10px] font-semibold"
                                            style={{ background: `${C.navy}0a`, color: C.navy, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                                          >
                                            {kw}
                                          </span>
                                        ))}
                                      </div>
                                      <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                                        {brief?.brief ?? "Influences this area of your chart."}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div
                              className="rounded-2xl p-5 flex items-start gap-3"
                              style={{ background: `${C.navy}06`, border: `1px dashed ${C.border}` }}
                            >
                              <div
                                className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold"
                                style={{ background: `${C.navy}12`, color: C.muted }}
                              >
                                ∅
                              </div>
                              <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
                                {framing.noStarFallback}
                              </p>
                            </div>
                          )}

                          {/* Strategic angle: compact callout */}
                          <div
                            className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl"
                            style={{ background: `${C.coral}0c`, border: `1px solid ${C.coral}25` }}
                          >
                            <Sparkle size={10} color={C.coral} />
                            <p className="text-[10px] leading-snug italic" style={{ color: C.navy }}>
                              {framing.strategicAngle}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {/* Synthesis callout */}
                  <div
                    className="rounded-2xl p-5 flex items-start gap-3"
                    style={{ background: `linear-gradient(135deg, ${C.navy}ee, ${C.navyMid}cc)`, border: `1px solid ${C.coral}15`, boxShadow: "0 4px 24px rgba(232,100,45,0.03)" }}
                  >
                    <Sparkle size={14} color={C.coral} />
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: C.coral }}>
                        Pattern Across Your People Palaces
                      </p>
                      <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.65)" }}>
                        {PEOPLE_SYNTHESIS[synthesisKey]}
                      </p>
                    </div>
                  </div>
                </>
              );
            })()}
          </section>

          {/* ══════════════════════════════════════
              SECTION 7: DECISION FRAMEWORK
              ══════════════════════════════════════ */}
          <section id="timing" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-[#fdf6ee] rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/80">
            <SectionWatermark type="timeline" />
            <SectionHeader
              graphicType="timing"
              chapter="Chapter 05 · Execution Playbook"
              title="Your 12-Month Roadmap"
              subtitle={`You are in your ${strategicData.phaseLabel} Phase. Select any month to see its strategic briefing.`}
            />

            {/* DaYun All-Cycles Timeline: shows all 12 DaYun periods with the
                current one highlighted, so the reader can immediately see where
                they are in their long-term cycle. */}
            {(() => {
              const birthYear = new Date(profile.birthday).getFullYear();
              const currentYear = new Date().getFullYear();
              const currentStart = strategicData.dayun?.startYear ?? currentYear;
              const currentEnd   = strategicData.dayun?.endYear   ?? currentYear + 10;

              /** Collect all palaces that have a Da Yun range, sorted by start age. */
              const cycles = chartData.palaces
                .filter((p) => p.majorLimit !== undefined)
                .sort((a, b) => (a.majorLimit?.startAge ?? 0) - (b.majorLimit?.startAge ?? 0))
                .map((p) => ({
                  name:      p.name,
                  startYear: birthYear + (p.majorLimit?.startAge ?? 0),
                  endYear:   birthYear + (p.majorLimit?.endAge   ?? 0),
                  startAge:  p.majorLimit?.startAge ?? 0,
                  endAge:    p.majorLimit?.endAge   ?? 0,
                }));

              if (cycles.length === 0) return null;

              const timelineStart = cycles[0].startYear;
              const timelineEnd   = cycles[cycles.length - 1].endYear;
              const totalSpan     = timelineEnd - timelineStart;

              const progressPct = Math.min(
                100,
                Math.max(0, ((currentYear - currentStart) / (currentEnd - currentStart)) * 100),
              );

              return (
                <div className="mb-6">
                  <p
                    className="text-[8px] font-bold uppercase tracking-[0.24em] mb-3"
                    style={{ color: C.muted }}
                  >
                    Your DaYun Cycle Timeline
                  </p>

                  {/* Cycle bar */}
                  <div
                    className="rounded-xl p-4"
                    style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                  >
                    <div className="flex gap-0.5 h-10 rounded-lg overflow-hidden mb-2">
                      {cycles.map((cycle) => {
                        const widthPct = ((cycle.endYear - cycle.startYear) / totalSpan) * 100;
                        const isCurrent = cycle.startYear === currentStart;
                        const isPast    = cycle.endYear <= currentYear;
                        return (
                          <div
                            key={cycle.name}
                            title={`${cycle.name} · ${cycle.startYear}–${cycle.endYear}`}
                            style={{
                              width:      `${widthPct}%`,
                              background: isCurrent
                                ? `linear-gradient(135deg, ${C.navy}, ${C.coral})`
                                : isPast
                                  ? `${C.navy}40`
                                  : `${C.navy}18`,
                              borderRadius: 4,
                              flexShrink: 0,
                              position: "relative",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              overflow: "hidden",
                            }}
                          >
                            {/* Progress fill inside current cycle */}
                            {isCurrent && (
                              <div
                                style={{
                                  position: "absolute",
                                  inset: 0,
                                  background: `linear-gradient(90deg, ${C.coral}50 ${progressPct}%, transparent ${progressPct}%)`,
                                }}
                              />
                            )}
                            <span
                              className="relative text-[7px] font-bold text-center leading-none"
                              style={{
                                color: isCurrent ? C.white : isPast ? `${C.navy}70` : C.muted,
                              }}
                            >
                              {cycle.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Year markers */}
                    <div className="flex justify-between">
                      <span className="text-[7px]" style={{ color: C.muted }}>{timelineStart}</span>
                      <div className="flex items-center gap-1">
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: C.coral }}
                        />
                        <span className="text-[7px] font-bold" style={{ color: C.coral }}>
                          {currentYear} · {strategicData.phaseLabel} Phase
                        </span>
                      </div>
                      <span className="text-[7px]" style={{ color: C.muted }}>{timelineEnd}</span>
                    </div>

                    {/* Current cycle progress */}
                    <div
                      className="mt-3 rounded-lg px-3 py-2 flex items-center justify-between"
                      style={{ background: `${C.navy}08`, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                    >
                      <div>
                        <p className="text-[7px] font-bold uppercase tracking-wide mb-0.5" style={{ color: C.muted }}>
                          Current Period
                        </p>
                        <p className="text-[10px] font-bold" style={{ color: C.navy }}>
                          {strategicData.dayun?.season
                            ? strategicData.dayun.season.charAt(0).toUpperCase() + strategicData.dayun.season.slice(1)
                            : ""}{" "}
                          DaYun · {currentStart}–{currentEnd}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[7px]" style={{ color: C.muted }}>Year {currentYear - currentStart + 1} of 10</p>
                        <p className="text-[10px] font-bold" style={{ color: C.coral }}>
                          {Math.round(progressPct)}% complete
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* Phase banner: flat navy (the 30% element for this section) */}
            <div
              className="rounded-3xl p-8 mb-8 flex items-center gap-6"
              style={{ background: C.navy, border: `1px solid ${C.navy}`, boxShadow: "0 8px 32px rgba(26,30,63,0.15)" }}
            >
              <div className="flex-1">
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Current DaYun Phase
                </p>
                <p className="text-3xl font-bold mb-3" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  {strategicData.phaseLabel} Phase
                </p>
                {strategicData.dayun !== null && (
                  <p className="text-sm leading-relaxed max-w-lg" style={{ color: "rgba(255,255,255,0.55)" }}>
                    {strategicData.dayun.coreMessage}
                  </p>
                )}
              </div>
              <div className="text-right shrink-0">
                <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.35)" }}>Period</p>
                <p className="text-base font-bold" style={{ color: "rgba(255,255,255,0.85)" }}>
                  {strategicData.dayun?.startYear ?? ""}–{strategicData.dayun?.endYear ?? ""}
                </p>
              </div>
            </div>

            {/* Month grid */}
            <div
              className="rounded-3xl p-8 mb-8"
              style={{ background: C.cream, border: `1px solid ${C.border}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}
            >
              <MonthGrid
                months={monthPills}
                selectedMonthIndex={selectedMonthIndex}
                onSelect={(idx) => { setSelectedMonthIndex(idx); }}
              />
            </div>

            {/* Month detail: inline, Cae Goh design */}
            {selectedPalaceNum !== null && selectedPalace !== null ? (() => {
              const mData    = PALACE_MONTH_DATA[selectedPalace.name];
              const gData    = PALACE_GUIDANCE_DATA[selectedPalace.name];
              const monthNum = selectedMonthIndex + 1;
              const mName    = new Date(CURRENT_YEAR, monthNum - 1).toLocaleString("default", { month: "long" });
              const palEng   = PALACE_ENGLISH[selectedPalace.name] ?? "Palace";

              if (!mData || !gData) {
                return (
                  <div
                    className="rounded-2xl p-8 text-center"
                    style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                  >
                    <p className="text-sm" style={{ color: C.muted }}>
                      Monthly forecast data unavailable for this palace.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-4">
                  {/* Navy header: month + palace */}
                  <div
                    className="rounded-2xl p-6 flex items-start justify-between gap-4"
                    style={{ background: C.navy }}
                  >
                    <div className="flex-1">
                      <p className="text-[8px] font-bold uppercase tracking-[0.24em] mb-2" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Monthly Briefing · {mData.area}
                      </p>
                      <p className="text-2xl font-bold mb-1" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                        {mName} {CURRENT_YEAR}
                      </p>
                      <p className="text-sm italic mb-4" style={{ color: "rgba(255,255,255,0.65)" }}>
                        &ldquo;{SEASON_STYLES[mData.season]?.tagline ?? ""}&rdquo;
                      </p>
                      <div
                        className="inline-flex items-center gap-2.5 rounded-xl px-3.5 py-2"
                        style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
                      >
                        <span className="text-base font-bold" style={{ color: C.white }}>宮</span>
                        <div>
                          <p className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.85)" }}>
                            {palEng}
                          </p>
                          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.4)" }}>
                            {selectedPalace.name} · Palace {selectedPalaceNum}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div
                      className="shrink-0 rounded-xl px-4 py-3 text-center"
                      style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)", minWidth: 130 }}
                    >
                      <p className="text-[8px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                        Executive Action
                      </p>
                      <p className="text-xs font-bold leading-snug" style={{ color: C.white }}>
                        {mData.priority}
                      </p>
                    </div>
                  </div>

                  {/* Dimension bars */}
                  <div
                    className="rounded-2xl p-6"
                    style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: C.muted }}>
                      Monthly Energy Profile
                    </p>
                    <div className="space-y-4">
                      {mData.dimensionBars.map((bar) => (
                        <div key={bar.label}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{bar.icon}</span>
                              <p className="text-xs font-semibold" style={{ color: C.navy }}>{bar.label}</p>
                              <p className="text-[9px]" style={{ color: C.muted }}>
                                {bar.pct >= 85 ? "Peak" : bar.pct >= 70 ? "Strong" : bar.pct >= 55 ? "Moderate" : "Caution"}
                              </p>
                            </div>
                            <p className="text-sm font-bold" style={{ color: C.navy }}>{bar.pct}</p>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: C.border }}>
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${bar.pct}%`,
                                background: bar.pct >= 70
                                  ? `linear-gradient(90deg, ${C.navy}, ${C.coral})`
                                  : `linear-gradient(90deg, ${C.navy}88, ${C.navy}55)`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Focus On + Watch Out */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.navy}` }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.navy }}>
                        Executive Action
                      </p>
                      <ul className="space-y-2.5">
                        {gData.keyActions.slice(0, 4).map((action) => (
                          <li key={action.slice(0, 40)} className="flex items-start gap-2">
                            <span
                              className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[8px] font-bold"
                              style={{ background: C.navy, color: C.white }}
                            >
                              ▸
                            </span>
                            <span className="text-xs leading-snug" style={{ color: C.navy }}>{action}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)", borderLeft: `3px solid ${C.coral}` }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.coral }}>
                        Risk Mitigation
                      </p>
                      <ul className="space-y-2.5">
                        {gData.watchOut.slice(0, 4).map((warning) => (
                          <li key={warning.slice(0, 40)} className="flex items-start gap-2">
                            <span
                              className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[8px] font-bold"
                              style={{ background: `${C.coral}22`, color: C.coral, border: `1px solid ${C.coral}40` }}
                            >
                              !
                            </span>
                            <span className="text-xs leading-snug" style={{ color: C.navy }}>{warning}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Win Metrics + Reflect */}
                  <div className="grid grid-cols-2 gap-4">
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.muted }}>
                        Win Metrics
                      </p>
                      <ul className="space-y-2">
                        {gData.successMetrics.slice(0, 4).map((metric) => (
                          <li key={metric.slice(0, 40)} className="flex items-start gap-2">
                            <span
                              className="w-4 h-4 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-[8px] font-bold"
                              style={{ background: "#dcfce7", color: "#16a34a" }}
                            >
                              ✓
                            </span>
                            <span className="text-xs leading-snug" style={{ color: C.navy }}>{metric}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div
                      className="rounded-2xl p-5"
                      style={{ background: C.cream, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}
                    >
                      <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-3" style={{ color: C.muted }}>
                        Reflect On This
                      </p>
                      <div className="space-y-3">
                        {gData.reflectionQuestions.slice(0, 2).map((q) => (
                          <p
                            key={q.slice(0, 40)}
                            className="text-xs italic leading-relaxed pl-3"
                            style={{ color: C.navy, borderLeft: `2px solid ${C.coral}` }}
                          >
                            &ldquo;{q}&rdquo;
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <Shimmer className="h-48 w-full" />
            )}
          </section>

          {/* ══════════════════════════════════════
              SECTION 5: WEALTH BLUEPRINT
              ══════════════════════════════════════ */}
          <section id="decision" className="scroll-mt-16 mb-32 pt-16 relative overflow-hidden bg-white rounded-[40px] p-10 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-[#e8ddd0]/50">
            <SectionWatermark type="target" />
            <SectionHeader
              graphicType="decision"
              chapter="Chapter 06 · Decision Framework"
              title="Your Strategic Filter"
              subtitle="A repeatable system for evaluating any high-stakes decision through your three-axis Purple Star lens."
            />

            {/* ── Convergence Statement: visual summary card ── */}
            {(() => {
              const wealthKey = strategicData.wealthProfile.codes[0]?.key as WealthCodeKey | undefined;
              const wealthCat = wealthKey !== undefined ? WEALTH_TYPE[wealthKey]?.category : "Wealth Creation";
              return (
                <div
                  className="rounded-2xl overflow-hidden mb-6"
                  style={{ background: `linear-gradient(135deg, ${C.navy}f5, ${C.navyMid}f0)`, border: `1px solid ${C.coral}40` }}
                >
                  <div className="px-6 pt-6 pb-4">
                    <div className="flex items-center gap-2 mb-5">
                      <Sparkle size={10} color={C.coral} />
                      <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: C.coral }}>
                        Your Strategic Profile
                      </p>
                    </div>

                    {/* Three visual profile pills */}
                    <div className="grid grid-cols-3 gap-3 mb-5">
                      {[
                        { label: "Structure",  value: strLabel.label,             sub: formation.englishName,       color: C.coral },
                        { label: "Phase",      value: strategicData.phaseLabel,   sub: `${strategicData.dayun?.startYear ?? ""}–${strategicData.dayun?.endYear ?? ""}`, color: phaseConfig.textColor },
                        { label: "Wealth",     value: wealthCat ?? "Wealth",      sub: strategicData.wealthArchetype, color: C.gold },
                      ].map((item) => (
                        <div
                          key={item.label}
                          className="rounded-xl px-4 py-3 text-center"
                          style={{ background: "rgba(255,255,255,0.05)", border: `1px solid rgba(255,255,255,0.08)` }}
                        >
                          <p className="text-[8px] font-bold uppercase tracking-wide mb-1" style={{ color: "rgba(255,255,255,0.35)" }}>
                            {item.label}
                          </p>
                          <p className="text-sm font-bold leading-tight mb-0.5" style={{ color: item.color, fontFamily: "Georgia,'Times New Roman',serif" }}>
                            {item.value}
                          </p>
                          <p className="text-[9px]" style={{ color: "rgba(255,255,255,0.3)" }}>{item.sub}</p>
                        </div>
                      ))}
                    </div>

                    {/* One-line convergence */}
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {formation.tagline}
                    </p>
                  </div>

                  {/* Signal bar */}
                  <div
                    className="px-6 py-3 flex items-center gap-3"
                    style={{ background: "rgba(255,255,255,0.04)", borderTop: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: signalHex }} />
                    <p className="text-[10px] font-semibold" style={{ color: signalHex }}>
                      {strategicData.monthName}:{" "}
                      {strategicData.signal === "green" ? "Green Light: optimal window to act"
                        : strategicData.signal === "yellow" ? "Yellow Light: proceed with caution"
                        : "Red Light: avoid major commitments"}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* ── Lifetime Decision Framework: visual 3-axis diagram ── */}
            <div
              className="rounded-3xl overflow-hidden mb-8"
              style={{ border: `1px solid ${C.border}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.03)" }}
            >
              <div className="px-8 py-6" style={{ background: C.navy }}>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-1.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                  Lifetime Decision Framework
                </p>
                <p className="text-2xl font-bold" style={{ color: C.white, fontFamily: "Georgia,'Times New Roman',serif" }}>
                  Your Strategic Decision Filter
                </p>
              </div>

              {/* Visual axis cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0" style={{ background: C.cream }}>
                {[
                  {
                    num:      "01",
                    axis:     "Structural Alignment",
                    question: `Does this decision rely on my ${strategicData.wealthArchetype ?? "natural"} advantage, or does it force me to operate outside my zone of genius?`,
                    answer:   `${strLabel.label} · ${formation.englishName}`,
                    color:    C.navy,
                    bg:       `${C.navy}08`,
                    isAuto:   false,
                  },
                  {
                    num:      "02",
                    axis:     "Timing Alignment",
                    question: `My current 10-year cycle is in the ${strategicData.phaseLabel} phase. Does this decision respect this season, or am I forcing the wrong energy?`,
                    answer:   `${strategicData.phaseLabel} Phase · ${strategicData.dayun?.startYear ?? ""}–${strategicData.dayun?.endYear ?? ""}`,
                    color:    phaseConfig.textColor,
                    bg:       `${C.navy}05`,
                    isAuto:   true,
                  },
                  {
                    num:      "03",
                    axis:     "Wealth Alignment",
                    question: `Does this move eliminate one of my known profit drains: ${STOP_DOING[strategicData.wealthProfile.codes[0]?.key as WealthCodeKey]?.[0] ?? "wasting energy"}?`,
                    answer:   `${WEALTH_TYPE[strategicData.wealthProfile.codes[0]?.key as WealthCodeKey]?.category ?? "Wealth Creation"}`,
                    color:    C.coral,
                    bg:       `${C.coral}06`,
                    isAuto:   true,
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="p-5 flex flex-col gap-3"
                    style={{
                      borderRight: i < 2 ? `1px solid ${C.border}` : "none",
                    }}
                  >
                    {/* Big axis number */}
                    <p
                      className="text-5xl font-bold leading-none"
                      style={{ color: item.color, opacity: 0.18, fontFamily: "Georgia,'Times New Roman',serif" }}
                    >
                      {item.num}
                    </p>

                    {/* Axis name */}
                    <div>
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <p className="text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: item.color }}>
                          {item.axis}
                        </p>
                        {item.isAuto && (
                          <span className="rounded-full px-1.5 py-0.5 text-[7px] font-bold" style={{ background: `${item.color}18`, color: item.color }}>
                            Auto
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold leading-snug mb-2" style={{ color: C.navy }}>
                        {item.question}
                      </p>
                    </div>

                    {/* Current value */}
                    <div
                      className="rounded-xl px-3 py-2.5 mt-auto"
                      style={{ background: item.bg, border: `1px solid ${item.color}20` }}
                    >
                      <p className="text-[10px] font-bold leading-snug" style={{ color: item.color }}>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Formation rule */}
              <div className="px-5 py-4" style={{ background: `${C.gold}10`, borderTop: `1px solid ${C.gold}30` }}>
                <div className="flex items-start gap-2.5">
                  <span className="text-base shrink-0">⚡</span>
                  <div>
                    <p className="text-[8px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: C.gold }}>
                      Your Formation Rule
                    </p>
                    <p className="text-xs italic leading-snug" style={{ color: C.navy }}>
                      &ldquo;{formation.decisionRule}&rdquo;
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 3-Axis Live Checker ── */}
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-5" style={{ color: C.muted }}>
              Evaluate Your Current Decision
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <AxisCard
                title="Structural"
                description="Does this decision align with your Life and Career palace direction: your core design?"
                value={strLabel.label}
                isAutoFilled={false}
                answer={framework.structural}
                onAnswer={(v) => { setFramework((p) => ({ ...p, structural: v })); }}
              />
              <AxisCard
                title="Timing"
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
                title="Wealth"
                description={`Your dominant code is ${strategicData.wealthArchetype}. ${
                  strategicData.wealthAligned
                    ? "Strong alignment score."
                    : "Consider if this is on your path of least resistance."
                }`}
                value={strategicData.wealthArchetype}
                isAutoFilled={true}
                answer={wealthAnswer}
              />
            </div>

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

          </div>{/* end scrollable content */}
        </main>
      </div>
    </PageTransition>
  );
};

export default AlignmentAdvantage;
