/**
 * Alignment Advantage — Strategic Playbook Print Page (Component 05)
 *
 * Rendered by Puppeteer / the PDF microservice when the user clicks
 * "Download Your Playbook" from `/alignment-advantage`.
 *
 * Pages:
 *  1. Cover
 *  2. Executive Summary
 *  3. ZWDS Chart
 *  4. Overview
 *  5. DaYun Cycle Analysis
 *  6. Risk Mitigation
 *  7. Wealth Acceleration Blueprint (WealthCode)
 *  8. Income Blueprint
 *  9. Four Key Palaces
 * 10. Reflection Questions
 * 11. Decision Framework reference card
 * 12. 12-Month Timing Table (with directive column)
 *
 * All components are existing ones — no new astrological logic here.
 * Authentication uses `pdfToken` query parameter, mirroring `PrintResult.tsx`.
 */

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Clock, Shield, Zap, Briefcase, TrendingUp, Target,
  Users, MessageSquare, GitFork, Compass, Layers,
  FileText,
} from "lucide-react";
import { supabase } from "../../utils/supabase-client";
import ZWDSChart from "../../components/ZWDSChart";
import { ZWDSCalculator } from "../../utils/zwds/calculator";
import type { ChartData, ChartInput } from "../../utils/zwds/types";
import { ChartSettingsProvider } from "../../context/ChartSettingsContext";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import { generateDayunGuidance } from "../../utils/dayun/guidanceGenerator";
import {
  PALACE_DATA,
  getSignalColor,
  SIGNAL_LABELS,
} from "../../utils/forecast/alignmentTimingData";
import {
  WEALTH_TYPE,
  STOP_DOING,
  ACTION_PLAN_ITEMS,
  IDEAL_COLLABORATOR,
  FRAMEWORK_RECOMMENDATIONS,
  ALTERNATIVE_PATH,
  PHASE_ALIGNMENT_MATRIX,
  type PhaseAlignmentSeasonKey,
  type PhaseAlignmentWealthKey,
} from "../../utils/forecast/wealthContentData";
import type { WealthCodeKey } from "../../utils/zwds/analysis_constants/wealth_code_mapping";
import { getPalaceForAspectLiuMonth } from "../../utils/destiny-navigator/palace-resolver";
import { detectStructure } from "../../utils/zwds/analysis/structureAnalysis";
import { STRUCTURE_LABELS, FORMATION_PROFILES } from "../../utils/forecast/structureContentData";
import { PHASE_LABELS } from "../../utils/dayun/seasonMapper";
import { STAR_BRIEF } from "../../utils/forecast/starBriefDescriptions";
import { PEOPLE_PALACE_FRAMING, PEOPLE_SYNTHESIS } from "../../utils/forecast/peoplePalaceData";
import type { Profile } from "../../context/ProfileContext";

// ─────────────────────────────────────────────────────────────────────────────
// Design system primitives — matching the Cae Goh slide aesthetic
// ─────────────────────────────────────────────────────────────────────────────

/** 4-pointed star sparkle — the signature decorative element across all slides */
const Sparkle: React.FC<{ size?: number; color?: string; style?: React.CSSProperties }> = ({
  size = 14, color = "#c9873a", style,
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" style={style}>
    <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" />
  </svg>
);

/** Ornamental gold divider with centred ✦ — replaces plain <hr> throughout */
const OrnamentalDivider: React.FC<{ style?: React.CSSProperties }> = ({ style }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0", ...style }}>
    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(201,135,58,0.45))" }} />
    <Sparkle size={10} color="#c9873a" />
    <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(201,135,58,0.45), transparent)" }} />
  </div>
);

/** Section pill label — gold ✦ prefix + small caps text, matching slide label style */
const SectionPill: React.FC<{ children: React.ReactNode; color?: string }> = ({
  children, color = "#c9873a",
}) => (
  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
    <Sparkle size={10} color={color} />
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.20em", textTransform: "uppercase", color, margin: 0 }}>
      {children}
    </p>
  </div>
);

/** Gradient circle icon — matches the circular icon treatment in the slides */
const IconCircle: React.FC<{
  icon: React.ElementType;
  gradient?: string;
  size?: number;
}> = ({ icon: Icon, gradient = "linear-gradient(135deg, #6b5b95, #be3e50)", size = 40 }) => (
  <div style={{
    width: size, height: size, borderRadius: "50%",
    background: gradient,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    boxShadow: "0 4px 14px rgba(107,91,149,0.28)",
  }}>
    <Icon size={Math.round(size * 0.44)} color="white" strokeWidth={1.8} />
  </div>
);

/** Page footer — navy left strip + gold→coral gradient right, matching slide footer exactly */
const PageFooter: React.FC<{ name: string }> = ({ name }) => (
  <div style={{
    display: "flex", alignItems: "stretch",
    margin: "28px -24px 0",
    height: 28, fontSize: 9, fontWeight: 600, letterSpacing: "0.14em",
  }}>
    <div style={{
      flex: 1, background: "#1a1e3f",
      padding: "0 18px", display: "flex", alignItems: "center",
    }}>
      <span style={{ color: "rgba(255,255,255,0.45)", textTransform: "uppercase" }}>
        © {new Date().getFullYear()} · The Alignment Advantage · Confidential
      </span>
    </div>
    <div style={{
      background: "linear-gradient(90deg, #c9873a 0%, #be3e50 60%, #d97706 100%)",
      padding: "0 18px", display: "flex", alignItems: "center", gap: 6,
    }}>
      <span style={{ color: "white", textTransform: "uppercase" }}>{name.toUpperCase()}</span>
      <Sparkle size={9} color="white" />
    </div>
  </div>
);

/** Chapter opener — full-bleed dark page separating major report sections */
const ChapterOpener: React.FC<{
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
    {/* Bottom gradient bar */}
    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #c9873a, #be3e50, #d97706)" }} />
    {/* Sparkle scatter */}
    <Sparkle size={22} color="rgba(201,135,58,0.25)" style={{ position: "absolute", top: 64, right: 80 }} />
    <Sparkle size={13} color="rgba(201,135,58,0.18)" style={{ position: "absolute", top: 130, right: 148 }} />
    <Sparkle size={8}  color="rgba(201,135,58,0.13)" style={{ position: "absolute", bottom: 90, left: 110 }} />
    <Sparkle size={16} color="rgba(255,255,255,0.08)" style={{ position: "absolute", bottom: 160, right: 60 }} />
  </section>
);

// ─────────────────────────────────────────────────────────────────────────────
// Seasonal SVG illustrations — used on monthly deep-dive pages
// ─────────────────────────────────────────────────────────────────────────────

const SEASON_ILLUSTRATIONS: Record<string, React.ReactElement> = {
  Spring: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.2" opacity="0.7"/>
      <path d="M45 70 L45 36" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round"/>
      <path d="M45 52 C37 45 27 46 25 36 C33 34 43 40 45 52Z" fill="#16a34a" opacity="0.55"/>
      <path d="M45 52 C53 45 63 46 65 36 C57 34 47 40 45 52Z" fill="#16a34a" opacity="0.55"/>
      <circle cx="45" cy="29" r="9" fill="#16a34a" opacity="0.18"/>
      <circle cx="36" cy="34" r="6" fill="#16a34a" opacity="0.18"/>
      <circle cx="54" cy="34" r="6" fill="#16a34a" opacity="0.18"/>
      <circle cx="45" cy="29" r="4.5" fill="#16a34a" opacity="0.8"/>
      <circle cx="27" cy="63" r="2" fill="#16a34a" opacity="0.35"/>
      <circle cx="65" cy="60" r="2.5" fill="#16a34a" opacity="0.25"/>
      <circle cx="56" cy="72" r="1.5" fill="#16a34a" opacity="0.35"/>
    </svg>
  ),
  Summer: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#fffbeb" stroke="#d97706" strokeWidth="1.2" opacity="0.7"/>
      <circle cx="45" cy="45" r="18" fill="#d97706" opacity="0.2"/>
      <circle cx="45" cy="45" r="11" fill="#d97706" opacity="0.7"/>
      {([0, 45, 90, 135, 180, 225, 270, 315] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={45 + 15 * Math.cos(r)} y1={45 + 15 * Math.sin(r)}
            x2={45 + (i % 2 === 0 ? 32 : 27) * Math.cos(r)} y2={45 + (i % 2 === 0 ? 32 : 27) * Math.sin(r)}
            stroke="#d97706" strokeWidth={i % 2 === 0 ? 2.2 : 1.5} strokeLinecap="round" opacity={i % 2 === 0 ? 0.9 : 0.55}
          />
        );
      })}
    </svg>
  ),
  Autumn: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#fff7ed" stroke="#ea580c" strokeWidth="1.2" opacity="0.7"/>
      <path d="M45 18 L49 28 L59 22 L54 32 L65 30 L58 38 L68 41 L60 46 L63 57 L53 50 L52 63 L45 55 L38 63 L37 50 L27 57 L30 46 L22 41 L32 38 L25 30 L36 32 L31 22 L41 28 Z"
        fill="#ea580c" opacity="0.55"/>
      <line x1="45" y1="63" x2="45" y2="74" stroke="#c2410c" strokeWidth="2" strokeLinecap="round"/>
      <line x1="45" y1="28" x2="45" y2="57" stroke="#fff7ed" strokeWidth="1.2" strokeLinecap="round" opacity="0.65"/>
      <line x1="38" y1="38" x2="29" y2="47" stroke="#fff7ed" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
      <line x1="52" y1="38" x2="61" y2="47" stroke="#fff7ed" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
    </svg>
  ),
  Winter: (
    <svg viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg" width="90" height="90" aria-hidden="true">
      <circle cx="45" cy="45" r="43" fill="#eff6ff" stroke="#2563eb" strokeWidth="1.2" opacity="0.7"/>
      {([0, 60, 120] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return (
          <line key={i}
            x1={45 - 32 * Math.cos(r)} y1={45 - 32 * Math.sin(r)}
            x2={45 + 32 * Math.cos(r)} y2={45 + 32 * Math.sin(r)}
            stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity="0.8"
          />
        );
      })}
      {([0, 60, 120, 180, 240, 300] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        const cx = 45 + 16 * Math.cos(r);
        const cy = 45 + 16 * Math.sin(r);
        const perp = r + Math.PI / 2;
        return (
          <line key={i}
            x1={cx - 7 * Math.cos(perp)} y1={cy - 7 * Math.sin(perp)}
            x2={cx + 7 * Math.cos(perp)} y2={cy + 7 * Math.sin(perp)}
            stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" opacity="0.6"
          />
        );
      })}
      {([0, 60, 120, 180, 240, 300] as number[]).map((deg, i) => {
        const r = (deg * Math.PI) / 180;
        return <circle key={i} cx={45 + 32 * Math.cos(r)} cy={45 + 32 * Math.sin(r)} r="3" fill="#2563eb" opacity="0.7"/>;
      })}
      <circle cx="45" cy="45" r="5" fill="#2563eb" opacity="0.85"/>
    </svg>
  ),
};


// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const MONTH_NAMES_LONG = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const CURRENT_YEAR = new Date().getFullYear();

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

/**
 * Fetch the `is_self` profile for the authenticated user.
 * Falls back to the first profile if no `is_self` row exists.
 */
async function fetchSelfProfileForPrint(bearerToken: string): Promise<Profile | null> {
  const base = process.env.REACT_APP_SUPABASE_URL ?? "";
  const key = process.env.REACT_APP_SUPABASE_ANON_KEY ?? "";
  if (base === "" || key === "") return null;

  const url = `${base}/rest/v1/profiles?is_self=eq.true&select=*&limit=1`;
  const response = await fetch(url, {
    method: "GET",
    headers: {
      apikey: key,
      Authorization: `Bearer ${bearerToken}`,
      Accept: "application/json",
    },
  });
  if (!response.ok) return null;
  const rows = (await response.json()) as Profile[];
  return rows.length > 0 ? rows[0] : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Compact 12-month timing table
// ─────────────────────────────────────────────────────────────────────────────

interface TimingRow {
  month:      string;
  palaceName: string;
  season:     string;
  signal:     ReturnType<typeof getSignalColor>;
  priority:   string;
  directive:  string;
  watchOut:   [string, string];
}

/** Expanded timing table — includes the per-month directive from PALACE_DATA. */
const CompactTimingTable: React.FC<{ rows: TimingRow[] }> = ({ rows }) => (
  <div className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 4 }}>
      Strategic Timing
    </p>
    <h2 style={{ fontSize: 24, fontWeight: 800, color: "#1a1e3f", marginBottom: 6 }}>
      12-Month Roadmap — {CURRENT_YEAR}
    </h2>
    <div style={{ borderTop: "1px solid rgba(107,91,149,0.14)", marginBottom: 20, marginTop: 12 }} />

    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
      <thead>
        <tr style={{ background: "#1a1e3f" }}>
          {["Month", "Signal", "Focus Area", "Priority", "Executive Action", "Risk Mitigation"].map((h) => (
            <th
              key={h}
              style={{ padding: "8px 12px", textAlign: "left", color: "#d4b896", fontWeight: 700, fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", border: "1px solid rgba(255,255,255,0.1)" }}
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, idx) => {
          const dotColor = row.signal === "green" ? "#10b981" : row.signal === "yellow" ? "#f59e0b" : "#f43f5e";
          const rowBg = idx % 2 === 0 ? "#ffffff" : "#f6f0e8";
          return (
            <tr key={row.month} style={{ background: rowBg }}>
              <td style={{ padding: "8px 12px", fontWeight: 600, color: "#1a1e3f", border: "1px solid rgba(107,91,149,0.1)", whiteSpace: "nowrap" }}>{row.month}</td>
              <td style={{ padding: "8px 12px", border: "1px solid rgba(107,91,149,0.1)", whiteSpace: "nowrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: dotColor, display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
                  <span style={{ fontWeight: 600, color: dotColor, fontSize: 11 }}>
                    {row.signal.charAt(0).toUpperCase() + row.signal.slice(1)}
                  </span>
                </span>
              </td>
              <td style={{ padding: "8px 12px", color: "#1a1e3f", border: "1px solid rgba(107,91,149,0.1)" }}>{row.palaceName}</td>
              <td style={{ padding: "8px 12px", color: "#5c5c5c", border: "1px solid rgba(107,91,149,0.1)" }}>{row.priority}</td>
              <td style={{ padding: "8px 12px", color: "#5c5c5c", fontStyle: "italic", border: "1px solid rgba(107,91,149,0.1)", lineHeight: 1.4 }}>{row.directive}</td>
              <td style={{ padding: "8px 12px", color: "#5c5c5c", border: "1px solid rgba(107,91,149,0.1)", lineHeight: 1.4 }}>
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {row.watchOut.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
    <p style={{ marginTop: 10, fontSize: 10, color: "#a89bc4" }}>
      🟢 Green = Execute major moves · 🟡 Yellow = Proceed with caution · 🔴 Red = Protect &amp; plan
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Inner content (requires ChartSettingsProvider wrapper)
// ─────────────────────────────────────────────────────────────────────────────

const NORTHERN_MAIN_STARS = new Set(["紫微", "天机", "太阳", "武曲", "天同", "廉贞"]);
const SOUTHERN_MAIN_STARS = new Set(["天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"]);

/** Returns the palace matching a given Chinese name, or null if not found. */
function getPalaceByName(palaces: any[], name: string): any | null {
  return palaces.find((p) => p.name === name) ?? null;
}

const AlignmentAdvancePrintContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const pdfToken = searchParams.get("pdfToken");

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * When the page is opened directly in a browser tab (not by Puppeteer),
   * auto-trigger `window.print()` once data is ready so the user can
   * immediately save as PDF via the browser's native print dialog.
   * Puppeteer sets `?puppeteer=1` — skip the dialog in that case.
   */
  const printTriggered = useRef(false);

  /**
   * Sync Supabase session when `pdfToken` is present (mirrors PrintResult.tsx).
   */
  useEffect(() => {
    if (pdfToken === null || pdfToken === "") return;
    void (async () => {
      await supabase.auth.setSession({
        access_token: pdfToken,
        refresh_token: pdfToken,
      });
    })();
  }, [pdfToken]);

  /** Fetch the account owner's profile. */
  useEffect(() => {
    let cancelled = false;

    const run = async (): Promise<void> => {
      setLoading(true);
      setError(null);

      const sessionResult = await supabase.auth.getSession();
      const sessionToken = sessionResult.data.session?.access_token ?? null;
      const bearer = pdfToken !== null && pdfToken !== "" ? pdfToken : sessionToken;

      if (bearer === null) {
        if (!cancelled) {
          setError("Sign in or open this page with a valid pdfToken query parameter.");
          setLoading(false);
        }
        return;
      }

      const fetchedProfile = await fetchSelfProfileForPrint(bearer);
      if (cancelled) return;

      if (fetchedProfile === null) {
        setError("Profile not found or access denied.");
        setLoading(false);
        return;
      }

      setProfile(fetchedProfile);
      setLoading(false);
    };

    void run();
    return () => { cancelled = true; };
  }, [pdfToken]);

  /** Calculate ZWDS chart from profile. */
  const calculatedChartData = useMemo((): ChartData | null => {
    if (profile === null) return null;
    try {
      const dateObj = new Date(`${profile.birthday}T12:00:00`);
      const input: ChartInput = {
        year: dateObj.getFullYear(),
        month: dateObj.getMonth() + 1,
        day: dateObj.getDate(),
        hour: parseBirthHour(String(profile.birth_time)),
        gender: profile.gender === "male" ? "male" : "female",
        name: profile.name,
      };
      return new ZWDSCalculator(input).calculate();
    } catch {
      return null;
    }
  }, [profile]);

  /** Wealth code analysis for the executive summary and risk mitigation. */
  const wealthAnalysis = useMemo(() => {
    if (calculatedChartData === null) return null;
    return analyzeWealthCode(calculatedChartData);
  }, [calculatedChartData]);

  /** Structure analysis for Player Type and Formation. */
  const structureResult = useMemo(() => {
    if (calculatedChartData === null) return null;
    return detectStructure(calculatedChartData);
  }, [calculatedChartData]);

  /** DaYun cycle guidance for risk mitigation and reflection questions. */
  const dayunGuidance = useMemo(() => {
    if (calculatedChartData === null) return null;
    const raw = calculateCurrentDayunCycle(calculatedChartData);
    if (raw === null) return null;
    return generateDayunGuidance(raw);
  }, [calculatedChartData]);

  /** Primary wealth code key for template lookups. */
  const wealthKey: WealthCodeKey = useMemo(
    () => (wealthAnalysis?.codes[0]?.key as WealthCodeKey | undefined) ?? "investmentBrain",
    [wealthAnalysis]
  );

  /** Current-month palace data for the executive summary. */
  const currentMonthPalaceData = useMemo(() => {
    if (calculatedChartData === null) return null;
    const currentMonth = new Date().getMonth() + 1;
    const palaceNumber = getPalaceForAspectLiuMonth("life", calculatedChartData, currentMonth, CURRENT_YEAR);
    const palace = palaceNumber !== null ? calculatedChartData.palaces[palaceNumber - 1] : null;
    return palace ? PALACE_DATA[palace.name] ?? null : null;
  }, [calculatedChartData]);

  /** Pre-compute 12-month timing rows with the new directive column. */
  const timingRows = useMemo((): TimingRow[] => {
    if (calculatedChartData === null) return [];

    return MONTH_NAMES_LONG.map((monthName, idx) => {
      const solarMonth = idx + 1;
      const palaceNumber = getPalaceForAspectLiuMonth(
        "life",
        calculatedChartData,
        solarMonth,
        CURRENT_YEAR
      );
      const palace = palaceNumber !== null ? calculatedChartData.palaces[palaceNumber - 1] : null;
      const palaceData = palace ? PALACE_DATA[palace.name] : null;
      const stars = palaceData?.stars ?? 3;
      const signal = getSignalColor(stars);
      return {
        month:     monthName,
        palaceName: palace?.name ?? "—",
        season:    palaceData?.season ?? "—",
        signal,
        priority:  palaceData?.priority ?? "—",
        directive: palaceData?.directive ?? "—",
        watchOut:  palaceData?.watchOut ?? ["—", "—"],
      };
    });
  }, [calculatedChartData]);


  /** Auto-print once data is loaded (browser print-preview path). */
  useEffect(() => {
    const isPuppeteer = searchParams.get("puppeteer") === "1";
    if (!loading && error === null && profile !== null && !isPuppeteer && !printTriggered.current) {
      printTriggered.current = true;
      const id = setTimeout(() => {
        window.print();
      }, 800);
      return () => { clearTimeout(id); };
    }
    return undefined;
  }, [loading, error, profile, searchParams]);

  return (
    <div className="print-root" style={{ background: "#faf0e6", color: "#1a1e3f", fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif" }}>
      <style>
        {`
          @page {
            size: A4;
            margin: 10mm 18mm 18mm 18mm;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          @media screen {
            .print-root {
              max-width: 860px;
              margin: 0 auto;
              padding: 40px 48px;
            }
          }

          @media print {
            @page { size: A4; margin: 10mm 18mm 18mm 18mm; }

            html, body {
              background: #faf0e6 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }

            .print-root {
              background: #faf0e6 !important;
              color: #1a1e3f !important;
              padding: 0 !important;
            }

            .print-hide {
              display: none !important;
            }

            .print-cover-page {
              page-break-after: always;
              break-after: page;
            }

            .print-page-break {
              break-before: page;
              page-break-before: always;
            }

            .print-avoid-break {
              break-inside: avoid;
              page-break-inside: avoid;
            }

            [data-pdf-page-break-before] {
              break-before: page;
              page-break-before: always;
            }
          }

          /* ── Section heading — serif for weight ── */
          .pp-heading {
            font-size: 26px;
            font-weight: 800;
            color: #1a1e3f;
            margin-bottom: 6px;
            line-height: 1.2;
            font-family: Georgia, 'Times New Roman', serif;
          }

          /* Italic gold accent word */
          .pp-accent {
            color: #c9873a;
            font-style: italic;
            font-family: Georgia, 'Times New Roman', serif;
          }

          /* ── Sub-heading ── */
          .pp-subheading {
            font-size: 13px;
            font-weight: 600;
            color: #1a1e3f;
            margin-bottom: 4px;
          }

          /* ── Body copy ── */
          .pp-body {
            font-size: 12px;
            color: #3d3d3d;
            line-height: 1.75;
          }

          /* ── Open section — flat, no box, just spacing ── */
          .pp-card {
            margin-bottom: 20px;
          }

          /* ── Highlight callout — intentional box for key insights ── */
          .pp-callout {
            background: #ffffff;
            border-left: 3px solid #c9873a;
            border-radius: 0 10px 10px 0;
            padding: 16px 20px;
            margin-bottom: 20px;
          }

          /* ── Thin section header underline ── */
          .pp-section-header {
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: #c9873a;
            border-bottom: 1px solid rgba(201,135,58,0.30);
            padding-bottom: 6px;
            margin-bottom: 12px;
          }

          /* ── Open list row — thin divider, no card ── */
          .pp-row {
            display: flex;
            align-items: flex-start;
            gap: 14px;
            padding: 12px 0;
            border-bottom: 1px solid rgba(26,30,63,0.07);
          }
          .pp-row:last-child {
            border-bottom: none;
          }

          /* ── Numbered bullet ── */
          .pp-num {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            min-width: 24px;
            border-radius: 50%;
            background: rgba(201,135,58,0.14);
            color: #c9873a;
            font-size: 11px;
            font-weight: 700;
          }

          /* ── Signal dots ── */
          .pp-dot-green  { background: #10b981; }
          .pp-dot-yellow { background: #f59e0b; }
          .pp-dot-red    { background: #f43f5e; }

          /* ── Global footer — hidden on screen, fixed to bottom of every printed page ── */
          @media screen {
            .pp-global-footer { display: none !important; }
          }
          @media print {
            .pp-global-footer {
              position: fixed;
              bottom: 0;
              left: 0;
              right: 0;
              z-index: 9999;
            }
          }
        `}
      </style>

      {/* Loading state */}
      {loading && (
        <div style={{ display: "flex", justifyContent: "center", padding: "96px 0" }} data-pdf-loading="true" className="print-hide">
          <div style={{ textAlign: "center" }}>
            <div className="inline-block h-10 w-10 animate-spin rounded-full" style={{ border: "3px solid #6b5b95", borderTopColor: "transparent" }} />
            <p style={{ marginTop: 16, color: "#6b5b95", fontSize: 14 }}>Preparing your playbook…</p>
          </div>
        </div>
      )}

      {/* Error state */}
      {!loading && error !== null && (
        <div style={{ border: "1px solid #f87171", background: "#fef2f2", borderRadius: 12, padding: 24, textAlign: "center" }} data-pdf-error="true" className="print-hide">
          <p style={{ color: "#991b1b" }}>{error}</p>
        </div>
      )}

      {/* Content */}
      {!loading && error === null && profile !== null && calculatedChartData !== null && (
        <div data-pdf-render-ready="true" style={{ display: "flex", flexDirection: "column", gap: 0, padding: "0 24px" }}>

          {/* ────────────────────── CHAPTER 01 OPENER ────────────────────── */}
          {/* Inline before Page 2 (ToC) so Chapter 01 is the very first non-cover page */}

          {/* ── Page 1: Cover — full bleed, escape the parent 24px side padding ── */}
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
            {/* Accent bar */}
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

            {/* Profile card */}
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

            {/* Decorative compass rose — bottom right */}
            <svg
              viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ position: "absolute", bottom: 32, right: 40, width: 160, height: 160, opacity: 0.12 }}
            >
              <circle cx="90" cy="90" r="88" stroke="#d4b896" strokeWidth="1"/>
              <circle cx="90" cy="90" r="60" stroke="#d4b896" strokeWidth="0.8"/>
              <circle cx="90" cy="90" r="30" stroke="#d4b896" strokeWidth="0.8"/>
              {([0,30,60,90,120,150,180,210,240,270,300,330] as number[]).map((deg, i) => {
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
              {/* Cardinal points */}
              <path d="M90 2 L96 26 L90 20 L84 26 Z" fill="#d4b896"/>
              <path d="M90 178 L96 154 L90 160 L84 154 Z" fill="#d4b896" opacity="0.6"/>
              <path d="M2 90 L26 84 L20 90 L26 96 Z" fill="#d4b896" opacity="0.6"/>
              <path d="M178 90 L154 84 L160 90 L154 96 Z" fill="#d4b896" opacity="0.6"/>
              <circle cx="90" cy="90" r="6" fill="#d4b896"/>
            </svg>

            {/* Bottom gradient bar — matches chapter openers */}
            <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 4, background: "linear-gradient(90deg, #c9873a, #be3e50, #d97706)" }} />
          </section>

          {/* ── Page 2: Table of Contents ── */}
          <section className="print-page-break print-avoid-break" aria-label="Table of Contents" style={{ padding: "64px 0 48px" }}>
            <SectionPill>Contents</SectionPill>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: "#1a1e3f", marginBottom: 8, fontFamily: "Georgia, 'Times New Roman', serif" }}>
              Your <span style={{ color: "#c9873a", fontStyle: "italic" }}>Strategic</span> Playbook
            </h2>
            <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 40, lineHeight: 1.6 }}>
              A comprehensive strategic intelligence report compiled from your Purple Star Astrology chart.
              Reference this document at key decision points throughout the year ahead.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {[
                { section: "Strategic Overview",   items: ["Executive Summary", "Your ZWDS Chart", "Life Structure Overview"] },
                { section: "Timing Intelligence",  items: ["10-Year Life Cycle", "Risk Mitigation & Alternative Paths", "Phase Alignment — Season × Wealth Code"] },
                { section: "Wealth Strategy",      items: ["Wealth Archetype Profile", "Business Domains & Revenue Strategy", "90-Day Strategic Priorities", "Ideal Collaborator Profile"] },
                { section: "12-Month Roadmap",     items: ["Month-by-Month Strategic Deep Dives (12 pages)"] },
                { section: "Reflection & Decision Framework", items: ["Strategic Reflection Questions", "Your Lifetime Decision Framework", "12-Month Timing Summary Table"] },
              ].map(({ section, items }, sIdx) => (
                <div key={sIdx} style={{ borderTop: "1px solid rgba(107,91,149,0.14)", paddingTop: 16, paddingBottom: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 10 }}>{section}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {items.map((item, iIdx) => (
                      <div key={iIdx} style={{ display: "flex", alignItems: "center", gap: 0 }}>
                        <span style={{ fontSize: 12, color: "#1a1e3f", fontWeight: 500 }}>{item}</span>
                        <span style={{ flex: 1, borderBottom: "1px dotted rgba(107,91,149,0.25)", margin: "0 10px", height: 1, alignSelf: "flex-end", marginBottom: 4 }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 40, background: "linear-gradient(135deg, #1a1e3f 0%, #2d1b4e 100%)", borderRadius: 14, padding: "20px 24px" }}>
              <p style={{ fontSize: 12, color: "#d4b896", lineHeight: 1.7 }}>
                <strong style={{ color: "#ffffff" }}>How to use this report:</strong> Start with the Executive Summary for your strategic snapshot.
                Use the 12-Month Roadmap as your monthly reference. Apply the Decision Framework to every major
                move in the year ahead. This report is your strategic companion — not a one-time read.
              </p>
            </div>
          </section>

          {/* ── Page 3: Executive Summary ── */}
          <section className="print-page-break print-avoid-break" aria-label="Executive Summary" style={{ padding: "48px 0 32px" }}>
            <SectionPill>Executive Summary</SectionPill>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <IconCircle icon={FileText} />
              <h2 className="pp-heading" style={{ marginBottom: 0 }}>
                Your <span className="pp-accent">Strategic</span> Profile at a Glance
              </h2>
            </div>
            <OrnamentalDivider />
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginTop: 24 }}>
              {[
                {
                  num: 1,
                  label: "Wealth Archetype",
                  value: `${wealthAnalysis?.dominantArchetype ?? ""} — ${WEALTH_TYPE[wealthKey].tagline}`,
                },
                ...(dayunGuidance !== null ? [{
                  num: 2,
                  label: "Life Season",
                  value: `${(dayunGuidance.season ?? "").charAt(0).toUpperCase()}${(dayunGuidance.season ?? "").slice(1)} Season${dayunGuidance.coreMessage.length > 0 ? ` — ${dayunGuidance.coreMessage}` : ""}`,
                }] : []),
                ...(dayunGuidance !== null ? [{
                  num: 3,
                  label: "Current Cycle Phase",
                  value: `${dayunGuidance.phase.charAt(0).toUpperCase()}${dayunGuidance.phase.slice(1)} Phase (${dayunGuidance.startYear}–${dayunGuidance.endYear})`,
                }] : []),
                ...(currentMonthPalaceData !== null ? [{
                  num: 4,
                  label: "This Month",
                  value: `${currentMonthPalaceData.area} — ${currentMonthPalaceData.priority}. ${getSignalColor(currentMonthPalaceData.stars) === "green" ? "Green light — execute." : getSignalColor(currentMonthPalaceData.stars) === "yellow" ? "Yellow light — proceed with caution." : "Red light — protect your position."}`,
                }] : []),
                ...(currentMonthPalaceData !== null ? [{
                  num: 5,
                  label: "Monthly Directive",
                  value: currentMonthPalaceData.directive,
                  italic: true,
                }] : []),
              ].map(({ num, label, value, italic }) => (
                <div key={num} className="pp-row">
                  <span className="pp-num" style={{ flexShrink: 0 }}>{num}</span>
                  <div>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9873a", marginBottom: 4 }}>{label}</p>
                    <p style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5, fontStyle: italic === true ? "italic" : "normal" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          
          {/* ── Chapter 01 Opener ── */}
          <ChapterOpener
            number="01"
            title="Founder's Blueprint"
            subtitle="Your operating structure type, primary formation, and special formations — the blueprint for how you are naturally wired to build momentum."
          />

          {/* ── Structure Profile Page ── */}
          {structureResult !== null && (() => {
            const strLabel     = STRUCTURE_LABELS[structureResult.structureType];
            const formProfile  = FORMATION_PROFILES[structureResult.formation];
            const gradColors: Record<string, { start: string; end: string }> = {
              speed:     { start: "#f97316", end: "#dc2626" },
              endurance: { start: "#d97706", end: "#b45309" },
            };
            const grad = gradColors[structureResult.structureType] ?? gradColors.speed;

            return (
              <section className="print-page-break print-avoid-break" aria-label="Structure Profile" style={{ padding: "48px 0 32px" }}>
                <SectionPill>Structure &amp; Formation Profile</SectionPill>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <IconCircle icon={GitFork} gradient={`linear-gradient(135deg, ${grad.start}, ${grad.end})`} />
                  <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Player Type &amp; Formation</h2>
                </div>
                <OrnamentalDivider />

                {/* Player type hero row */}
                <div style={{
                  background: `linear-gradient(135deg, ${grad.start}, ${grad.end})`,
                  borderRadius: 14, padding: "20px 24px", marginBottom: 20,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "rgba(255,255,255,0.65)", marginBottom: 4 }}>
                      Operating Structure
                    </p>
                    <p style={{ fontSize: 22, fontWeight: 800, color: "#ffffff", margin: 0 }}>{strLabel.label}</p>
                    <p style={{ fontSize: 12, color: "rgba(255,255,255,0.8)", marginTop: 4, maxWidth: 340 }}>{strLabel.description}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                    <p style={{ fontSize: 10, color: "rgba(255,255,255,0.65)" }}>Star balance</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#ffffff" }}>
                      N{structureResult.northernCount} · S{structureResult.southernCount}
                    </p>
                  </div>
                </div>

                {/* Formation card */}
                <div style={{ border: "1px solid rgba(26,30,63,0.10)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                    <p style={{ fontSize: 18, fontWeight: 800, color: "#1a1e3f", margin: 0 }}>{formProfile.englishName}</p>
                    <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(107,91,149,0.10)", color: "#6b5b95", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em" }}>
                      {formProfile.chineseStyle}
                    </span>
                    <span style={{ fontSize: 10, color: "#a89bc4" }}>{formProfile.subtitle}</span>
                  </div>

                  <p style={{ fontSize: 12, color: "#5c5c5c", fontStyle: "italic", lineHeight: 1.6, borderLeft: "3px solid #c9873a", paddingLeft: 12, marginBottom: 14 }}>
                    &ldquo;{formProfile.tagline}&rdquo;
                  </p>

                  {/* Key traits */}
                  <p className="pp-section-header" style={{ marginBottom: 6 }}>Key Traits</p>
                  <ol style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {formProfile.keyTraits.map((trait, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                        <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.55 }}>{trait}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            );
          })()}

          {/* ── Chapter 02 Opener ── */}
          <ChapterOpener
            number="02"
            title="Operating System"
            subtitle="Three core palaces that reveal how you think, what drives you, and how you execute."
          />

          {/* ── Page: Executive Capacity ── */}
          <section className="print-page-break print-avoid-break" aria-label="Executive Capacity" style={{ padding: "48px 0 32px" }}>
            <SectionPill>Executive Capacity</SectionPill>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <IconCircle icon={Layers} />
              <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Character &amp; Energy Blueprint</h2>
            </div>
            <OrnamentalDivider />
            <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 24, lineHeight: 1.6 }}>
              These three core palaces define your natural operating rhythm. Align your business environment to support these traits.
            </p>

            {(() => {
              const renderOperatePalace = (palaceName: string, sectionLabel: string, framing: string) => {
                const palace = getPalaceByName(calculatedChartData?.palaces ?? [], palaceName);
                const mainStars = palace?.mainStar ?? [];
                const hasStars = mainStars.length > 0;

                return (
                  <div key={palaceName} style={{ border: "1px solid rgba(26,30,63,0.10)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 6 }}>{sectionLabel}</p>
                    <p style={{ fontSize: 13, color: "#1a1e3f", marginBottom: 16, lineHeight: 1.5 }}>{framing}</p>
                    
                    {hasStars ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                        {mainStars.map((star: any) => {
                          const brief = STAR_BRIEF[star.name];
                          if (!brief) return null;
                          return (
                            <div key={star.name} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                              <div style={{ width: 4, height: 40, background: brief.role === "north" ? "#c9873a" : brief.role === "south" ? "#be3e50" : "#6b5b95", borderRadius: 2, flexShrink: 0 }} />
                              <div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                  <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1e3f" }}>{brief.pinyin}</span>
                                  <span style={{ fontSize: 10, color: "#6b5b95", background: "rgba(107,91,149,0.08)", padding: "2px 8px", borderRadius: 12 }}>{brief.title}</span>
                                </div>
                                <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.5 }}>{brief.brief}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p style={{ fontSize: 12, color: "#5c5c5c", fontStyle: "italic" }}>No main stars placed — energy is drawn from the opposite palace.</p>
                    )}
                  </div>
                );
              };

              return (
                <>
                  {renderOperatePalace("命宫", "Life Palace · Your Character Blueprint", "Core identity, temperament, and the energy you project into the world.")}
                  {renderOperatePalace("福德", "Inner Power Palace · What Drives You", "Internal fuel source — what keeps you going when external results are slow.")}
                  {renderOperatePalace("官禄", "Operational Capacity · How You Execute", "Your natural operating rhythm and the environments where you build momentum fastest.")}
                </>
              );
            })()}
          </section>

          {/* ── Chapter 03 Opener ── */}
          <ChapterOpener
            number="03"
            title="Wealth Acceleration"
            subtitle="Your wealth archetype, income blueprint, 90-day priorities, and ideal collaborator profile."
          />
{/* ── Page 6: Wealth Archetype Profile ── */}
          {wealthAnalysis !== null && (() => {
            const wTypeProfile = WEALTH_TYPE[wealthKey];
            /** Chinese character per archetype key — decorative hero card */
            const ARCHETYPE_HANZI: Record<string, { char: string; pinyin: string; meaning: string }> = {
              investmentBrain:  { char: "财", pinyin: "Cái", meaning: "Wealth" },
              brandingMagnet:   { char: "名", pinyin: "Míng", meaning: "Reputation" },
              strategyPlanner:  { char: "谋", pinyin: "Móu", meaning: "Strategy" },
              collaborator:     { char: "合", pinyin: "Hé",  meaning: "Harmony" },
            };
            const hanzi = ARCHETYPE_HANZI[wealthKey] ?? { char: "财", pinyin: "Cái", meaning: "Wealth" };
            return (
              <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
                <SectionPill color="#d97706">Wealth Acceleration Blueprint</SectionPill>

                {/* ── Chinese character hero card — mirrors the Cae Goh slide treatment ── */}
                <div style={{
                  display: "flex", alignItems: "stretch", gap: 20, marginBottom: 20,
                }}>
                  {/* Left: large character */}
                  <div style={{
                    width: 120, flexShrink: 0,
                    background: "linear-gradient(160deg, #1a1e3f 0%, #2d1b4e 100%)",
                    borderRadius: 14,
                    display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center",
                    padding: "20px 12px",
                    gap: 4,
                  }}>
                    <span style={{ fontSize: 72, lineHeight: 1, color: "#c9873a", fontWeight: 700 }}>{hanzi.char}</span>
                    <span style={{ fontSize: 11, color: "rgba(201,135,58,0.7)", letterSpacing: "0.14em" }}>{hanzi.pinyin}</span>
                    <span style={{ fontSize: 9, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "0.12em" }}>{hanzi.meaning}</span>
                  </div>
                  {/* Right: archetype heading + tagline */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <IconCircle icon={Zap} gradient="linear-gradient(135deg, #d97706, #c9873a)" />
                      <h2 className="pp-heading" style={{ marginBottom: 0 }}>
                        <span className="pp-accent">{wealthAnalysis.dominantArchetype.split(" ")[0]}</span>{" "}
                        {wealthAnalysis.dominantArchetype.split(" ").slice(1).join(" ")}
                      </h2>
                    </div>
                    <p style={{ fontSize: 13, color: "#5c5c5c", lineHeight: 1.6, marginLeft: 52 }}>
                      {wTypeProfile.tagline}
                    </p>
                    <div style={{ display: "flex", gap: 8, marginLeft: 52 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, background: "rgba(201,135,58,0.12)", color: "#c9873a", padding: "3px 10px", borderRadius: 20, letterSpacing: "0.08em" }}>
                        {wTypeProfile.category}
                      </span>
                    </div>
                  </div>
                </div>
                <OrnamentalDivider />

                {/* Tagline + summary — open two-column */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
                  <div>
                    <p className="pp-section-header">Wealth Category</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{wTypeProfile.category}</p>
                    <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.65 }}>{wTypeProfile.tagline}</p>
                  </div>
                  <div>
                    <p className="pp-section-header">Archetype Summary</p>
                    <p style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.75 }}>{wealthAnalysis.summaryText}</p>
                  </div>
                </div>

                {/* Code score bars — open section */}
                <div style={{ marginBottom: 24 }}>
                  <p className="pp-section-header">Wealth Code Scores</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {wealthAnalysis.codes.slice(0, 4).map((code) => (
                      <div key={code.key} style={{ display: "grid", gridTemplateColumns: "140px 1fr 32px", gap: 10, alignItems: "center" }}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#1a1e3f" }}>{code.label}</span>
                        <div style={{ height: 7, background: "rgba(201,135,58,0.12)", borderRadius: 999, overflow: "hidden" }}>
                          <div style={{ width: `${(code.score / 10) * 100}%`, height: "100%", background: "linear-gradient(90deg, #c9873a, #6b5b95)", borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#c9873a", textAlign: "right" }}>{code.score}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths + blind spots — open two-column */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24 }}>
                  <div>
                    <p className="pp-section-header" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.30)" }}>Strengths</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {wealthAnalysis.strengths.slice(0, 5).map((s, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#16a34a", flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Blind Spots</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {wealthAnalysis.blindSpots.slice(0, 5).map((s, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#be3e50", flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Stop doing — open list */}
                <div>
                  <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Stop Doing</p>
                  <p style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 12 }}>These patterns quietly drain your wealth-building energy:</p>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                    {STOP_DOING[wealthKey].map((item, i) => (
                      <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                        <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                        <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            );
          })()}

          {/* ── Page 7: Business Domains & Revenue Strategy ── */}
          {wealthAnalysis !== null && (() => {
            const collab = IDEAL_COLLABORATOR[wealthKey];
            const actionItem = ACTION_PLAN_ITEMS[wealthKey];
            const wTypeProfile = WEALTH_TYPE[wealthKey];
            return (
              <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
                <SectionPill color="#16a34a">Revenue Strategy</SectionPill>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <IconCircle icon={Briefcase} gradient="linear-gradient(135deg, #16a34a, #059669)" />
                  <h2 className="pp-heading" style={{ marginBottom: 0 }}>
                    Where Your <span className="pp-accent">Wealth</span> Flows Best
                  </h2>
                </div>
                <OrnamentalDivider />

                {/* Wealth category context banner */}
                <div style={{ borderLeft: "3px solid #c9873a", paddingLeft: 16, marginBottom: 24 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9873a", marginBottom: 6 }}>Your Wealth Category</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{wTypeProfile.category}</p>
                  <p style={{ fontSize: 13, color: "#5c5c5c", lineHeight: 1.65 }}>{wTypeProfile.description}</p>
                </div>

                {/* Business domains — reframed from "roles" to strategic domains */}
                <div style={{ marginBottom: 24 }}>
                  <p className="pp-section-header" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.30)" }}>
                    Business Domains &amp; Revenue Models
                  </p>
                  <p style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 14, lineHeight: 1.6 }}>
                    These are the business contexts where your chart creates natural leverage — the domains where your wealth code generates disproportionate returns relative to effort.
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                    {wealthAnalysis.idealRoles.slice(0, 6).map((r, i) => (
                      <div key={i} style={{ borderLeft: "3px solid #16a34a", paddingLeft: 12, paddingTop: 4, paddingBottom: 4 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 3 }}>{r.role}</p>
                        <p style={{ fontSize: 10, color: "#4b7a5a", lineHeight: 1.45 }}>{r.reason}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 90-day action + collaborator — open two-column */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, paddingTop: 20, borderTop: "1px solid rgba(201,135,58,0.20)" }}>
                  <div>
                    <p className="pp-section-header">90-Day Priority Action</p>
                    <p style={{ fontSize: 14, color: "#1a1e3f", lineHeight: 1.65, fontStyle: "italic", fontFamily: "Georgia, serif" }}>&ldquo;{actionItem}&rdquo;</p>
                  </div>
                  <div>
                    <p className="pp-section-header">Key Business Partner Type</p>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#1a1e3f", marginBottom: 6 }}>{collab.type}</p>
                    <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.55 }}>{collab.description}</p>
                  </div>
                </div>
              </section>
            );
          })()}

          {/* ── Page 8: Phase Alignment Deep Dive ── */}
          {dayunGuidance !== null && wealthAnalysis !== null && (() => {
            const season = (dayunGuidance.season ?? "spring") as PhaseAlignmentSeasonKey;
            const wk = wealthKey as PhaseAlignmentWealthKey;
            const entry = PHASE_ALIGNMENT_MATRIX[season]?.[wk];
            if (entry === undefined) return null;
            const seasonColors: Record<string, { bg: string; accent: string; text: string }> = {
              spring: { bg: "#f0fdf4", accent: "#16a34a", text: "#166534" },
              summer: { bg: "#fffbeb", accent: "#d97706", text: "#92400e" },
              autumn: { bg: "#fff7ed", accent: "#ea580c", text: "#9a3412" },
              winter: { bg: "#eff6ff", accent: "#2563eb", text: "#1e3a8a" },
            };
            const sc = seasonColors[season] ?? seasonColors.spring;
            return (
              <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
                <SectionPill>Strategic Alignment</SectionPill>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <IconCircle icon={TrendingUp} />
                  <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Season × Wealth Code Intersection</h2>
                </div>
                <OrnamentalDivider />

                {/* Intersection banner */}
                <div style={{ background: sc.bg, border: `1px solid ${sc.accent}44`, borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sc.accent, marginBottom: 8 }}>
                    {season.charAt(0).toUpperCase() + season.slice(1)} Season · {wealthAnalysis.dominantArchetype}
                  </p>
                  <p style={{ fontSize: 15, color: sc.text, lineHeight: 1.7 }}>{entry.copy}</p>
                </div>

                {/* Watch out — open list */}
                <div style={{ marginBottom: 22 }}>
                  <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Watch Out for This Combination</p>
                  {entry.watchOut.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                      <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Season directive — callout quote */}
                <div style={{ paddingLeft: 16, borderLeft: "3px solid #6b5b95", marginBottom: 22 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 6 }}>Season Directive</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", lineHeight: 1.55, fontFamily: "Georgia, serif" }}>{dayunGuidance.coreMessage}</p>
                </div>

                {/* 4-season reference — left-bar column tiles */}
                <div style={{ marginBottom: 0 }}>
                  <p className="pp-section-header">Season × Archetype Reference</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {(["expansion", "visibility", "consolidation", "foundation"] as unknown as PhaseAlignmentSeasonKey[]).map((s) => {
                      const e = PHASE_ALIGNMENT_MATRIX[s]?.[wk];
                      const isActive = s === season;
                      const sColors: Record<string, string> = { spring: "#16a34a", summer: "#d97706", autumn: "#ea580c", winter: "#2563eb" };
                      return (
                        <div key={s} style={{ borderLeft: `3px solid ${isActive ? sColors[s] : "rgba(107,91,149,0.20)"}`, paddingLeft: 12 }}>
                          <p style={{ fontSize: 10, fontWeight: 700, textTransform: "capitalize", color: sColors[s], marginBottom: 3 }}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}{isActive ? "  ← current" : ""}
                          </p>
                          <p style={{ fontSize: 11, color: isActive ? "#1a1e3f" : "#5c5c5c", lineHeight: 1.4 }}>{e?.copy.slice(0, 90)}…</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          })()}

          {/* ── Page 9: 90-Day Action Plan (dedicated) ── */}
          {dayunGuidance !== null && wealthAnalysis !== null && (() => {
            const dayunActions = dayunGuidance.keyActions.slice(0, 4);
            const wealthAction = ACTION_PLAN_ITEMS[wealthKey];
            const season = (dayunGuidance.season ?? "spring") as string;
            const archetype = wealthAnalysis.dominantArchetype ?? "your archetype";
            const allActions = [...dayunActions, wealthAction];
            return (
              <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
                <SectionPill>Your Action Plan</SectionPill>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <IconCircle icon={Target} />
                  <h2 className="pp-heading" style={{ marginBottom: 0 }}>90-Day Strategic Priorities</h2>
                </div>
                <OrnamentalDivider />
                <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 28, lineHeight: 1.6 }}>
                  As a <strong>{archetype}</strong> in a <strong>{season.charAt(0).toUpperCase() + season.slice(1)} season</strong>,
                  these are your highest-leverage moves for the next 90 days. Execute them in order.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                  {allActions.map((action, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 16, padding: "14px 0", borderBottom: "1px solid rgba(26,30,63,0.07)" }}>
                      <span className="pp-num" style={{ width: 32, height: 32, fontSize: 14, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <p style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.7 }}>{action}</p>
                    </div>
                  ))}
                </div>

                {/* Why these actions — callout */}
                <div style={{ marginTop: 24, borderLeft: "3px solid #c9873a", paddingLeft: 16 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 8 }}>Why These Priorities</p>
                  <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.7 }}>
                    These actions are aligned with both your current DaYun season and your dominant wealth archetype.
                    They represent the highest-leverage moves available to you in the next 90 days — the intersection
                    of what your chart is structured to support and where timing is most favourable.
                    Executing these in sequence minimises resistance and maximises return on effort.
                  </p>
                </div>
              </section>
            );
          })()}

          {/* ── Page 10: Ideal Collaborator Profile (dedicated) ── */}
          {(() => {
            const collab = IDEAL_COLLABORATOR[wealthKey];
            const wType = WEALTH_TYPE[wealthKey];
            return (
              <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
                <SectionPill>Team Strategy</SectionPill>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <IconCircle icon={Users} />
                  <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Ideal Collaborator Profile</h2>
                </div>
                <OrnamentalDivider />

                {/* Why you need them */}
                <div style={{ background: "#f9f7fd", border: "1px solid rgba(107,91,149,0.18)", borderRadius: 14, padding: "20px 24px", marginBottom: 20 }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 8 }}>Why You Need This Person</p>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#1a1e3f", marginBottom: 8 }}>{collab.type}</p>
                  <p style={{ fontSize: 13, color: "#5c5c5c", lineHeight: 1.7 }}>{collab.description}</p>
                </div>

                {/* What to look for — open list */}
                <div style={{ marginBottom: 24 }}>
                  <p className="pp-section-header">What to Look For</p>
                  {collab.lookFor.map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                      <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>

                {/* Wealth category + examples — open two-column */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 24, paddingTop: 18, borderTop: "1px solid rgba(201,135,58,0.20)" }}>
                  <div>
                    <p className="pp-section-header">Your Wealth Category</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{wType.category}</p>
                    <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.55 }}>{wType.tagline}</p>
                  </div>
                  <div>
                    <p className="pp-section-header">Collaboration Examples</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {wType.examples.map((ex, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "6px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#6b5b95", flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontSize: 12, color: "#1a1e3f" }}>{ex}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Red flags — open list */}
                <div>
                  <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Collaboration Red Flags</p>
                  <p style={{ fontSize: 12, color: "#5c5c5c", marginBottom: 10, lineHeight: 1.6 }}>
                    Regardless of archetype, avoid entering partnerships where these signals are present:
                  </p>
                  {[
                    "No clear ownership structure or equity agreement in writing before work begins",
                    "Avoids discussing numbers, margins, or financial accountability",
                    "Confuses activity with output — busy but unable to show measurable results",
                  ].map((item, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                      <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            );
          })()}

          
          {/* ── Chapter 04 Opener ── */}
          <ChapterOpener
            number="04"
            title="Stakeholder Intelligence"
            subtitle="Three relationship palaces that reveal who you attract, how you collaborate, and what kind of people amplify your results."
          />

          {/* ── Page: Stakeholder Intelligence ── */}
          <section className="print-page-break print-avoid-break" aria-label="Stakeholder Intelligence" style={{ padding: "48px 0 32px" }}>
            <SectionPill>Stakeholder Intelligence</SectionPill>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <IconCircle icon={Users} />
              <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Partnership &amp; Alliance Dynamics</h2>
            </div>
            <OrnamentalDivider />
            <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 24, lineHeight: 1.6 }}>
              These three relationship palaces define your natural leverage with co-founders, investors, and the market.
            </p>

            {(() => {
              const peoplePalaces: Array<"夫妻" | "交友" | "父母"> = ["夫妻", "交友", "父母"];
              
              const allPeopleStars = peoplePalaces.flatMap((pn) => {
                const p = getPalaceByName(calculatedChartData?.palaces ?? [], pn);
                return p?.mainStar ?? [];
              });
              const northCount = allPeopleStars.filter((s) => NORTHERN_MAIN_STARS.has(s.name)).length;
              const southCount = allPeopleStars.filter((s) => SOUTHERN_MAIN_STARS.has(s.name)).length;
              const auxCount   = allPeopleStars.filter((s) => !NORTHERN_MAIN_STARS.has(s.name) && !SOUTHERN_MAIN_STARS.has(s.name)).length;

              const synthesisKey: "north" | "south" | "aux" | "mixed" = (() => {
                const total = northCount + southCount + auxCount;
                if (total === 0) return "mixed";
                if (northCount / total >= 0.5) return "north";
                if (southCount / total >= 0.5) return "south";
                if (auxCount / total >= 0.5) return "aux";
                return "mixed";
              })();
              const synthesisText = PEOPLE_SYNTHESIS[synthesisKey];

              return (
                <div>
                  {peoplePalaces.map((palaceName) => {
                    const palace = getPalaceByName(calculatedChartData?.palaces ?? [], palaceName);
                    const framing = PEOPLE_PALACE_FRAMING[palaceName];
                    const mainStars = palace?.mainStar ?? [];
                    const hasStars  = mainStars.length > 0;

                    return (
                      <div key={palaceName} style={{ border: "1px solid rgba(26,30,63,0.10)", borderRadius: 12, padding: "20px 22px", marginBottom: 16 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 6 }}>{framing.sectionTitle}</p>
                        <p style={{ fontSize: 13, color: "#1a1e3f", marginBottom: 16, lineHeight: 1.5 }}>{framing.intro}</p>
                        
                        {hasStars ? (
                          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 16 }}>
                            {mainStars.map((star: any) => {
                              const brief = STAR_BRIEF[star.name];
                              if (!brief) return null;
                              return (
                                <div key={star.name} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                                  <div style={{ width: 4, height: 40, background: brief.role === "north" ? "#c9873a" : brief.role === "south" ? "#be3e50" : "#6b5b95", borderRadius: 2, flexShrink: 0 }} />
                                  <div>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                      <span style={{ fontSize: 14, fontWeight: 700, color: "#1a1e3f" }}>{brief.pinyin}</span>
                                      <span style={{ fontSize: 10, color: "#6b5b95", background: "rgba(107,91,149,0.08)", padding: "2px 8px", borderRadius: 12 }}>{brief.title}</span>
                                    </div>
                                    <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.5 }}>{brief.brief}</p>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p style={{ fontSize: 12, color: "#5c5c5c", fontStyle: "italic", marginBottom: 16 }}>{framing.noStarFallback}</p>
                        )}
                        
                        <div style={{ background: "#f6f0e8", borderRadius: 8, padding: "12px 16px", borderLeft: "3px solid #c9873a" }}>
                          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#c9873a", marginBottom: 4 }}>Strategic Angle</p>
                          <p style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.5 }}>{framing.strategicAngle}</p>
                        </div>
                      </div>
                    );
                  })}
                  
                  <div style={{ background: "linear-gradient(135deg, #1a1e3f 0%, #2d1b4e 100%)", borderRadius: 14, padding: "20px 24px", marginTop: 24, display: "flex", gap: 14, alignItems: "flex-start" }}>
                    <Sparkle size={14} color="#e8642d" style={{ marginTop: 2 }} />
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e8642d", marginBottom: 6 }}>Network Synthesis</p>
                      <p style={{ fontSize: 13, color: "#ffffff", lineHeight: 1.6 }}>{synthesisText}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </section>

          {/* ── Chapter 05 Opener ── */}
          <ChapterOpener
            number="05"
            title="Execution Playbook"
            subtitle="Your month-by-month strategic intelligence — signals, directives, and best moves for each month."
          />
{/* ── Page 5: 10-Year Life Cycle ── */}
          {dayunGuidance !== null && (() => {
            const seasonColors: Record<string, { bg: string; text: string; accent: string }> = {
              spring: { bg: "#f0fdf4", text: "#166534", accent: "#16a34a" },
              summer: { bg: "#fffbeb", text: "#92400e", accent: "#d97706" },
              autumn: { bg: "#fff7ed", text: "#9a3412", accent: "#ea580c" },
              winter: { bg: "#eff6ff", text: "#1e3a8a", accent: "#2563eb" },
            };
            const sc = seasonColors[dayunGuidance.season] ?? seasonColors.spring;
            const phaseWidth = dayunGuidance.phase === "building" ? "30%" : dayunGuidance.phase === "peak" ? "65%" : "90%";
            return (
              <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
                <SectionPill>10-Year Life Cycle</SectionPill>
                <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                  <IconCircle icon={Clock} />
                  <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Current DaYun Phase</h2>
                </div>
                <OrnamentalDivider />

                {/* Season banner */}
                <div style={{ background: sc.bg, border: `1px solid ${sc.accent}33`, borderRadius: 14, padding: "20px 24px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sc.accent, marginBottom: 4 }}>
                      {dayunGuidance.season.charAt(0).toUpperCase() + dayunGuidance.season.slice(1)} Season · {dayunGuidance.seasonTitle}
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: sc.text }}>{dayunGuidance.coreMessage}</p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0, marginLeft: 24 }}>
                    <p style={{ fontSize: 10, color: "#5c5c5c" }}>Cycle years</p>
                    <p style={{ fontSize: 16, fontWeight: 700, color: "#1a1e3f" }}>{dayunGuidance.startYear} – {dayunGuidance.endYear}</p>
                  </div>
                </div>

                {/* Phase progress — flat bar, no card */}
                <div style={{ marginBottom: 24 }}>
                  <p className="pp-section-header">
                    Phase: {dayunGuidance.phase.charAt(0).toUpperCase() + dayunGuidance.phase.slice(1)}
                  </p>
                  <div style={{ height: 7, background: "rgba(107,91,149,0.12)", borderRadius: 999, overflow: "hidden", marginBottom: 6 }}>
                    <div style={{ width: phaseWidth, height: "100%", background: "linear-gradient(90deg, #6b5b95, #c9873a)", borderRadius: 999 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    {["Building", "Peak", "Integration"].map((p) => (
                      <span key={p} style={{ fontSize: 10, color: dayunGuidance.phase === p.toLowerCase() ? "#c9873a" : "#a89bc4", fontWeight: dayunGuidance.phase === p.toLowerCase() ? 700 : 400 }}>{p}</span>
                    ))}
                  </div>
                </div>

                {/* 2-col: key actions + success metrics — open columns */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
                  <div>
                    <p className="pp-section-header">Key Actions This Cycle</p>
                    <ol style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {dayunGuidance.keyActions.slice(0, 5).map((action, i) => (
                        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                          <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.55 }}>{action}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <p className="pp-section-header">Success Metrics</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {(dayunGuidance.successMetrics ?? []).slice(0, 5).map((metric, i) => (
                        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "9px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: sc.accent, flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontSize: 12, color: "#1a1e3f", lineHeight: 1.55 }}>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Adjacent cycles — slim two-column callout */}
                {(dayunGuidance.previousCycle !== undefined || dayunGuidance.nextCycle !== undefined) && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 24, paddingTop: 20, borderTop: "1px solid rgba(201,135,58,0.20)" }}>
                    {dayunGuidance.previousCycle !== undefined && (
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a89bc4", marginBottom: 4 }}>Previous Cycle</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#6b5b95", marginBottom: 2 }}>{dayunGuidance.previousCycle.years}</p>
                        <p style={{ fontSize: 11, color: "#5c5c5c", textTransform: "capitalize" }}>{dayunGuidance.previousCycle.season} · {dayunGuidance.previousCycle.palace}</p>
                      </div>
                    )}
                    {dayunGuidance.nextCycle !== undefined && (
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#a89bc4", marginBottom: 4 }}>Next Cycle</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "#6b5b95", marginBottom: 2 }}>{dayunGuidance.nextCycle.years}</p>
                        <p style={{ fontSize: 11, color: "#5c5c5c", textTransform: "capitalize" }}>{dayunGuidance.nextCycle.season} · {dayunGuidance.nextCycle.palace}</p>
                      </div>
                    )}
                  </div>
                )}
              </section>
            );
          })()}

          {/* ── Page 5: Risk Mitigation ── */}
          {dayunGuidance !== null && (
            <section className="print-page-break print-avoid-break" aria-label="Risk Mitigation" style={{ padding: "48px 0 32px" }}>
              <SectionPill color="#be3e50">Risk Mitigation</SectionPill>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                <IconCircle icon={Shield} gradient="linear-gradient(135deg, #be3e50, #d97706)" />
                <h2 className="pp-heading" style={{ marginBottom: 0 }}>Key Risks in Your Current Cycle</h2>
              </div>
              <OrnamentalDivider />
              <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 20, lineHeight: 1.6 }}>
                Based on your <strong>{dayunGuidance.season}</strong> season cycle. Address these proactively before they derail your strategy.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                {(dayunGuidance.watchOut ?? []).map((item, i) => (
                  <div key={i} className="pp-row">
                    <span className="pp-num" style={{ background: "rgba(190,62,80,0.1)", color: "#be3e50", flexShrink: 0 }}>{i + 1}</span>
                    <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#fff8f0", border: "1px solid rgba(212,184,150,0.4)", borderRadius: 12, padding: "18px 20px" }}>
                <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#d4af7b", marginBottom: 8 }}>Alternative Path if Misalignment is Detected</p>
                <p style={{ fontSize: 13, color: "#5c5c5c", fontStyle: "italic", lineHeight: 1.6 }}>
                  {ALTERNATIVE_PATH[dayunGuidance.season ?? "winter"] ?? ALTERNATIVE_PATH["winter"]}
                </p>
              </div>
            </section>
          )}

          {/* ── Pages 11–22: Monthly Deep Dives (one page per month) ── */}
          {timingRows.length === 12 && timingRows.map((row, idx) => {
            const palaceEntry = PALACE_DATA[row.palaceName];
            const sigConfig: Record<string, { bg: string; text: string; accent: string; label: string; bestFor: string[] }> = {
              green: {
                bg: "#f0fdf4", text: "#166534", accent: "#16a34a",
                label: "Green Light — Execute",
                bestFor: ["Major decisions and commitments", "Signing contracts and formalising agreements", "Launching new ventures or campaigns", "High-stakes investments and capital deployment", "Raising prices, launching premium offers, or expanding scope"],
              },
              yellow: {
                bg: "#fffbeb", text: "#92400e", accent: "#d97706",
                label: "Yellow Light — Proceed with Caution",
                bestFor: ["Strategic planning and preparation", "Due diligence and research", "Building and deepening relationships", "Refining systems and processes", "Preparing for future green-light execution"],
              },
              red: {
                bg: "#fff1f2", text: "#881337", accent: "#f43f5e",
                label: "Red Light — Protect & Plan",
                bestFor: ["Consolidating and protecting existing assets", "Rest, recovery, and energy management", "Reviewing and auditing current commitments", "Maintaining relationships without major asks", "Building the foundation for future cycles"],
              },
            };
            const sc = sigConfig[row.signal] ?? sigConfig.green;
            const stars = palaceEntry?.stars ?? 3;
            const watchOut = palaceEntry?.watchOut ?? [];
            const currentMonth = new Date().getMonth() + 1;
            const isCurrentMonth = idx === (currentMonth - 1);
            return (
              <section key={row.month} className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>

                {/* Month header band */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 6 }}>
                  <div style={{ flex: 1 }}>
                    <SectionPill>{`Month ${idx + 1} of 12 · ${CURRENT_YEAR}${isCurrentMonth ? " · You Are Here" : ""}`}</SectionPill>
                    <h2 style={{ fontSize: 34, fontWeight: 800, color: "#1a1e3f", margin: "2px 0 8px", fontFamily: "Georgia, 'Times New Roman', serif" }}>
                      <span style={{ color: "#c9873a", fontStyle: "italic" }}>{row.month.split(" ")[0]}</span>
                      {row.month.split(" ").length > 1 ? ` ${row.month.split(" ").slice(1).join(" ")}` : ""}
                    </h2>
                    <div style={{ display: "flex", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(201,135,58,0.12)", color: "#c9873a", padding: "2px 10px", borderRadius: 20, letterSpacing: "0.06em" }}>{row.season}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, background: "rgba(107,91,149,0.1)", color: "#6b5b95", padding: "2px 10px", borderRadius: 20 }}>{row.palaceName} Palace</span>
                      {isCurrentMonth && <span style={{ fontSize: 10, fontWeight: 700, background: "#c9873a", color: "white", padding: "2px 10px", borderRadius: 20 }}>Current Month</span>}
                    </div>
                  </div>
                  {/* Seasonal illustration */}
                  <div style={{ flexShrink: 0, marginLeft: 16 }}>
                    {SEASON_ILLUSTRATIONS[row.season] ?? SEASON_ILLUSTRATIONS.Spring}
                  </div>
                </div>
                <OrnamentalDivider />

                {/* Signal banner */}
                <div style={{ background: sc.bg, border: `1px solid ${sc.accent}44`, borderRadius: 14, padding: "16px 22px", marginBottom: 20, display: "flex", alignItems: "center", gap: 14 }}>
                  <span style={{ width: 14, height: 14, borderRadius: "50%", background: sc.accent, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: sc.accent }}>{sc.label}</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: sc.text, marginTop: 4 }}>{row.priority}</p>
                  </div>
                  <div style={{ display: "flex", gap: 3 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span key={s} style={{ width: 10, height: 10, borderRadius: "50%", background: s <= stars ? sc.accent : "rgba(0,0,0,0.1)" }} />
                    ))}
                  </div>
                </div>

                {/* Strategic Directive — pull quote */}
                <div style={{ borderLeft: "3px solid #6b5b95", paddingLeft: 16, marginBottom: 22 }}>
                  <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 6 }}>Strategic Directive</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", lineHeight: 1.65, fontStyle: "italic", fontFamily: "Georgia, serif" }}>&ldquo;{row.directive}&rdquo;</p>
                </div>

                {/* Best for & Watch outs — open two-column */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, marginBottom: 22 }}>
                  <div>
                    <p className="pp-section-header" style={{ color: "#16a34a", borderColor: "rgba(22,163,74,0.30)" }}>Best For This Month</p>
                    <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                      {sc.bestFor.map((item, i) => (
                        <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                          <span style={{ width: 5, height: 5, borderRadius: "50%", background: sc.accent, flexShrink: 0, marginTop: 5 }} />
                          <span style={{ fontSize: 11, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="pp-section-header" style={{ color: "#be3e50", borderColor: "rgba(190,62,80,0.30)" }}>Watch Out</p>
                    {watchOut.length > 0
                      ? (
                        <ul style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                          {watchOut.map((item, i) => (
                            <li key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "7px 0", borderBottom: "1px solid rgba(26,30,63,0.06)" }}>
                              <span className="pp-num" style={{ background: "rgba(190,62,80,0.10)", color: "#be3e50", flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                              <span style={{ fontSize: 11, color: "#1a1e3f", lineHeight: 1.5 }}>{item}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.6 }}>Stay alert to over-committing or rushing decisions better made in the next cycle.</p>
                      )}
                  </div>
                </div>

                {/* Focus area — open section */}
                <div style={{ paddingTop: 18, borderTop: "1px solid rgba(201,135,58,0.20)", display: "flex", gap: 20, alignItems: "flex-start" }}>
                  <div style={{ flex: 1 }}>
                    <p className="pp-section-header">Area of Focus</p>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "#1a1e3f", marginBottom: 6, fontFamily: "Georgia, serif" }}>{palaceEntry?.area ?? row.palaceName}</p>
                    <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.65 }}>
                      {row.season === "Spring" && "Expansion and initiative-taking dominate this period. Channel energy into visible, forward-moving actions."}
                      {row.season === "Summer" && "Harvest and monetisation are the natural rhythm. Consolidate and convert what has been built."}
                      {row.season === "Autumn" && "Consolidation and review are called for. Protect what is working and gracefully release what is not."}
                      {row.season === "Winter" && "Foundation-building and deep work are most productive. Invest in preparation for the next spring cycle."}
                    </p>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <p style={{ fontSize: 40, fontWeight: 900, color: sc.accent, lineHeight: 1, fontFamily: "Georgia, serif", fontStyle: "italic" }}>{idx + 1}</p>
                    <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#a89bc4" }}>of 12</p>
                  </div>
                </div>
              </section>
            );
          })}

          {dayunGuidance !== null && (dayunGuidance.reflectionQuestions ?? []).length > 0 && (
            <section className="print-page-break print-avoid-break" aria-label="Reflection Questions" style={{ padding: "48px 0 32px" }}>
              <SectionPill>Strategic Reflection</SectionPill>
              <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
                <IconCircle icon={MessageSquare} />
                <h2 className="pp-heading" style={{ marginBottom: 0 }}>Questions for This Season</h2>
              </div>
              <OrnamentalDivider />
              <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 32, lineHeight: 1.6 }}>
                Set aside 20 minutes with these questions. Your honest answers will clarify your next move.
              </p>
              <ol style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {(dayunGuidance.reflectionQuestions ?? []).map((question, i) => (
                  <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(26,30,63,0.07)" }}>
                    <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                    <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1e3f", lineHeight: 1.6 }}>{question}</p>
                  </li>
                ))}
              </ol>

              <div style={{ marginTop: 28, background: "#f9f7fd", border: "1px solid rgba(107,91,149,0.14)", borderRadius: 12, padding: "16px 20px" }}>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 8 }}>How to Use These Questions</p>
                <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.7 }}>
                  Spend 20–30 minutes with these questions at the start of your season. Write your answers privately —
                  not for anyone else to read. Honest reflection at the right moment is what separates strategic action
                  from reactive movement. Return to your answers at the end of the season to measure how your thinking has evolved.
                </p>
              </div>
            </section>
          )}

          {/* ── Page 12: Timing Table ── */}
          {timingRows.length > 0 && (
            <CompactTimingTable rows={timingRows} />
          )}

          
          {/* ── Chapter 06 Opener ── */}
          <ChapterOpener
            number="06"
            title="Decision Framework"
            subtitle="A repeatable system for evaluating any high-stakes decision through your three-axis Purple Star lens."
          />
          {/* ── Page 11: Decision Framework ── */}
          <section className="print-page-break print-avoid-break" aria-label="Decision Framework" style={{ padding: "48px 0 32px" }}>
            <SectionPill>Lifetime Tool</SectionPill>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <IconCircle icon={GitFork} />
              <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Strategic Decision Filter</h2>
            </div>
            <OrnamentalDivider />
            <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 24, lineHeight: 1.6 }}>
              Use this worksheet for every future high-stakes decision. Write your decision below, then test it against your three-axis alignment. If it doesn&apos;t pass all three, rethink the move.
            </p>

            {/* Decision Input Box */}
            <div style={{ marginBottom: 32 }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#1a1e3f", marginBottom: 8 }}>The Decision on the Table:</p>
              <div style={{ width: "100%", height: 60, border: "1px solid rgba(26,30,63,0.2)", borderRadius: 8, background: "#faf0e6" }} />
            </div>

            {/* Axis rows — open table */}
            <div style={{ marginBottom: 28 }}>
              {[
                { 
                  axis: "Structural Alignment", 
                  color: "#6b5b95", 
                  q: `Does this decision rely on my ${wealthAnalysis?.dominantArchetype ?? "natural"} advantage, or does it force me to operate outside my zone of genius?`
                },
                { 
                  axis: "Timing Alignment", 
                  color: "#10b981", 
                  q: `My current 10-year cycle is in the ${PHASE_LABELS[dayunGuidance?.season ?? "spring"] ?? "Expansion"} phase. Does this decision respect this season, or am I forcing the wrong energy?`
                },
                { 
                  axis: "Wealth Alignment", 
                  color: "#c9873a", 
                  q: `Does this move eliminate one of my known profit drains: ${STOP_DOING[wealthKey]?.[0] ?? "wasting energy"}?`
                },
              ].map(({ axis, color, q }) => (
                <div key={axis} style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 0", borderBottom: "1px solid rgba(26,30,63,0.07)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 20, height: 20, border: "2px solid rgba(26,30,63,0.2)", borderRadius: 4, flexShrink: 0 }} />
                    <span style={{ fontSize: 14, fontWeight: 700, color }}>{axis}</span>
                  </div>
                  <span style={{ fontSize: 13, color: "#1a1e3f", lineHeight: 1.5, paddingLeft: 32 }}>{q}</span>
                </div>
              ))}
            </div>

            {/* Score key — left-bar tiles */}
            <div style={{ marginTop: 0 }}>
              <p className="pp-section-header">Evaluation Rules</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                {([3, 2, 1, 0] as const).map((score) => {
                  const rec = FRAMEWORK_RECOMMENDATIONS[score];
                  const scoreColors = ["#10b981", "#f59e0b", "#f97316", "#f43f5e"] as const;
                  const barColor = scoreColors[3 - score];
                  return (
                    <div key={score} style={{ borderLeft: `3px solid ${barColor}`, paddingLeft: 12, paddingTop: 4, paddingBottom: 4 }}>
                      <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#5c5c5c", marginBottom: 3 }}>
                        Score {score}/3
                      </p>
                      <p style={{ fontSize: 12, fontWeight: 700, color: barColor, marginBottom: 3 }}>{rec.heading}</p>
                      <p style={{ fontSize: 11, color: "#5c5c5c", lineHeight: 1.5 }}>{rec.copy}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          
          {/* ── Appendix: ZWDS Chart ── */}
          <section className="print-page-break print-avoid-break" aria-label="Appendix: ZWDS Chart" style={{ padding: "48px 0 32px" }}>
            <SectionPill>Appendix</SectionPill>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <IconCircle icon={Layers} />
              <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Full ZWDS Chart</h2>
            </div>
            <OrnamentalDivider />
            <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 24, lineHeight: 1.6 }}>
              The complete mathematical model behind your Alignment Advantage Playbook.
            </p>
            
          <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
            <SectionPill>Your Chart</SectionPill>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
              <IconCircle icon={Compass} />
              <h2 className="pp-heading" style={{ marginBottom: 0 }}>Zi Wei Dou Shu Natal Chart</h2>
            </div>
            <OrnamentalDivider />
            <div style={{ marginTop: 16, overflow: "hidden" }}>
              <ZWDSChart
                chartData={calculatedChartData}
                isPdfExport={true}
                disableInteraction
                selectedDaXianControlled={null}
                selectedPalaceNameControlled={null}
                showMonthsControlled={null}
              />
            </div>
          </section>

          
          </section>
  {/* ── Global fixed footer — position: fixed in print puts it on every page ── */}
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
              <span style={{ color: "white", textTransform: "uppercase" }}>{profile.name}</span>
              <Sparkle size={9} color="white" />
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Exported page (wrapped in ChartSettingsProvider)
// ─────────────────────────────────────────────────────────────────────────────

const AlignmentAdvancePrint: React.FC = () => (
  <ChartSettingsProvider defaultPageType="result">
    <AlignmentAdvancePrintContent />
  </ChartSettingsProvider>
);

export default AlignmentAdvancePrint;
