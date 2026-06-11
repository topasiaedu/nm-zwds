/**
 * Dashboard — Predictable Destiny Command Centre
 *
 * Design follows the Cae Goh slide visual language:
 *   - Full-bleed gradient cards (coral→dark coral / navy→navyLight)
 *   - Large centered circle icons, prominent and bold
 *   - Sidebar with dot-pattern texture, coral active states, brand footer bar
 *   - Warm peach-coral radial background with orbital ring SVG
 *   - Navy→coral gradient bar as section headers (matches slide bottom strip)
 */

import React, { useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import { useAuth } from "../../context/AuthContext";
import { useProfileContext } from "../../context/ProfileContext";
import { useTierAccess } from "../../context/TierContext";
import { Link } from "react-router-dom";
import PageTransition from "../../components/PageTransition";
import { useAlertContext } from "../../context/AlertContext";
import ConfirmationModal from "../../components/ConfirmationModal";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens — Cae Goh slide palette
// ─────────────────────────────────────────────────────────────────────────────

const C = {
  navy:      "#1a1e3f",
  navyMid:   "#252a5c",
  navyLight: "#2e3575",
  gold:      "#c9873a",
  coral:     "#e8642d",
  coralDark: "#c4501e",
  coralDeep: "#a03e14",
  cream:     "#fdf6ee",
  white:     "#ffffff",
  text:      "#1a1e3f",
  muted:     "#7a6e65",
  border:    "#e8ddd0",
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Sparkle
// ─────────────────────────────────────────────────────────────────────────────

const Sparkle: React.FC<{ size?: number; color?: string; className?: string }> = ({
  size = 12, color = C.coral, className = "",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} aria-hidden="true" className={className}>
    <path d="M12 2 L13.4 10.6 L22 12 L13.4 13.4 L12 22 L10.6 13.4 L2 12 L10.6 10.6 Z" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Orbital ring background decoration
// ─────────────────────────────────────────────────────────────────────────────

const OrbitalRing: React.FC<{ className?: string }> = ({ className = "" }) => (
  <svg viewBox="0 0 600 400" fill="none" aria-hidden="true" className={className} style={{ overflow: "visible" }}>
    <ellipse cx="300" cy="200" rx="280" ry="160" stroke={`${C.coral}28`} strokeWidth="1.5" transform="rotate(-20 300 200)" />
    <ellipse cx="300" cy="200" rx="220" ry="110" stroke={`${C.gold}1e`} strokeWidth="1" transform="rotate(-20 300 200)" />
    <circle cx="530" cy="80" r="3" fill={`${C.coral}60`} />
    <circle cx="80" cy="310" r="2" fill={`${C.gold}60`} />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar nav item
// ─────────────────────────────────────────────────────────────────────────────

const NavItem: React.FC<{
  to:      string;
  icon:    React.ReactNode;
  label:   string;
  active?: boolean;
  badge?:  string;
}> = ({ to, icon, label, active = false, badge }) => (
  <Link
    to={to}
    className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150"
    style={{
      background: active
        ? `linear-gradient(90deg, ${C.coral}33, ${C.coral}11)`
        : "transparent",
      color:      active ? C.coral : "rgba(255,255,255,0.48)",
      borderLeft: active ? `2px solid ${C.coral}` : "2px solid transparent",
    }}
    onMouseEnter={(e) => {
      if (!active) {
        e.currentTarget.style.color = "rgba(255,255,255,0.88)";
        e.currentTarget.style.background = "rgba(255,255,255,0.06)";
      }
    }}
    onMouseLeave={(e) => {
      if (!active) {
        e.currentTarget.style.color = "rgba(255,255,255,0.48)";
        e.currentTarget.style.background = "transparent";
      }
    }}
  >
    <span className="w-4 h-4 shrink-0">{icon}</span>
    <span className="text-xs font-semibold truncate flex-1">{label}</span>
    {badge !== undefined && (
      <span
        className="shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold"
        style={{ background: C.coral, color: C.white }}
      >
        {badge}
      </span>
    )}
  </Link>
);

// ─────────────────────────────────────────────────────────────────────────────
// Branded SVG illustrations — one per tool, left-half of card
// Each is designed to clearly represent what the tool does.
// All use semi-transparent whites on coral cards, coral/gold on navy cards.
// ─────────────────────────────────────────────────────────────────────────────

/** ZWDS 12-palace chart grid — represents "My Chart" */
const IllustrationMyChart: React.FC<{ variant: "coral" | "navy" }> = ({ variant }) => {
  const w = "rgba(255,255,255,0.85)";
  const d = variant === "coral" ? "rgba(255,255,255,0.25)" : "rgba(232,100,45,0.30)";
  const a = variant === "coral" ? "rgba(255,255,255,0.45)" : "rgba(201,135,58,0.60)";

  // 12 palace positions in a 4×4 grid, center 2×2 empty
  const cells: [number, number][] = [
    [0,0],[1,0],[2,0],[3,0],
    [0,1],            [3,1],
    [0,2],            [3,2],
    [0,3],[1,3],[2,3],[3,3],
  ];

  const sz = 22;   // cell size
  const gap = 3;   // gap between cells
  const stride = sz + gap;

  // Total grid dimension: 4 cells + 3 gaps = 4*22 + 3*3 = 97
  const gridW = 4 * stride - gap; // 94
  const gridH = gridW;

  // Center the grid in the 140×160 viewBox
  const ox = (140 - gridW) / 2;  // ≈ 23
  const oy = (160 - gridH) / 2;  // ≈ 33

  // Center of the 2×2 empty area (columns 1–2, rows 1–2)
  const ccx = ox + stride + sz / 2 + (stride) / 2;  // ox + 25 + 11 + 12.5 = ox + 48.5
  const ccy = oy + stride + sz / 2 + (stride) / 2;

  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Subtle dot pattern */}
      {[18,50,90,122].map(x => [28,72,120].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={d} />
      )))}

      {/* Palace cells */}
      {cells.map(([col, row]) => (
        <rect
          key={`${col}-${row}`}
          x={ox + col * stride} y={oy + row * stride}
          width={sz} height={sz}
          rx={3}
          fill={d} stroke={a} strokeWidth={0.8}
        />
      ))}

      {/* Palace labels on top row */}
      {(["命","財","官","遷"] as const).map((label, i) => (
        <text
          key={label}
          x={ox + i * stride + sz / 2}
          y={oy + 14}
          textAnchor="middle" fontSize="7" fill={w} opacity={0.75} fontFamily="serif"
        >
          {label}
        </text>
      ))}

      {/* Center 2×2 destiny circle */}
      <circle cx={ccx} cy={ccy} r={20} fill={d} stroke={a} strokeWidth={1} />
      <circle cx={ccx} cy={ccy} r={11} fill={a} />
      {/* Star in center */}
      <path
        d={`M${ccx} ${ccy - 7} l1.4 5.3 5.3 1.4 -5.3 1.4 -1.4 5.3 -1.4 -5.3 -5.3 -1.4 5.3 -1.4 Z`}
        fill={w}
      />

      {/* Sparkle decoration */}
      <path d="M120 22 l1.2 4.5 4.5 1.2 -4.5 1.2 -1.2 4.5 -1.2 -4.5 -4.5 -1.2 4.5 -1.2 Z" fill={a} />
    </svg>
  );
};

/** Three overlapping profile rings — represents "Calculate" */
const IllustrationCalculate: React.FC<{ variant: "coral" | "navy" }> = ({ variant }) => {
  const w = "rgba(255,255,255,0.85)";
  const d = variant === "coral" ? "rgba(255,255,255,0.20)" : "rgba(232,100,45,0.25)";
  const a = variant === "coral" ? "rgba(255,255,255,0.50)" : "rgba(201,135,58,0.65)";
  const Person: React.FC<{ cx: number; cy: number }> = ({ cx, cy }) => (
    <g>
      <circle cx={cx} cy={cy-14} r={9} fill={d} stroke={a} strokeWidth={1} />
      <path d={`M${cx-14} ${cy+14} a14 14 0 0 1 28 0`} fill={d} stroke={a} strokeWidth={1} />
    </g>
  );
  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true" className="w-full h-full">
      {[20,50,80,110].map(x => [25,65,105,145].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={d} />
      )))}
      {/* Connection lines */}
      <line x1="44" y1="68" x2="96" y2="68" stroke={a} strokeWidth={0.8} strokeDasharray="3 2" />
      <line x1="44" y1="68" x2="70" y2="108" stroke={a} strokeWidth={0.8} strokeDasharray="3 2" />
      <line x1="96" y1="68" x2="70" y2="108" stroke={a} strokeWidth={0.8} strokeDasharray="3 2" />
      {/* Three profiles */}
      <Person cx={44} cy={68} />
      <Person cx={96} cy={68} />
      <Person cx={70} cy={108} />
      {/* Center node */}
      <circle cx={70} cy={88} r={7} fill={a} />
      <path d="M70 82 l0.9 3.4 3.4 0.9-3.4 0.9-0.9 3.4-0.9-3.4-3.4-0.9 3.4-0.9z" fill={w} />
      {/* Count badge */}
      <rect x={48} y={28} width={44} height={18} rx={9} fill={d} stroke={a} strokeWidth={1} />
      <text x={70} y={40} textAnchor="middle" fontSize="8" fill={w} fontWeight="bold">293 charts</text>
      {/* Sparkle */}
      <path d="M118 130 l1.2 4.5 4.5 1.2-4.5 1.2-1.2 4.5-1.2-4.5-4.5-1.2 4.5-1.2z" fill={a} />
    </svg>
  );
};

/** Cycle Triangle (Structure / Timing / Wealth) — represents "Alignment Advantage" */
const IllustrationAlignment: React.FC<{ variant: "coral" | "navy" }> = ({ variant }) => {
  const w = "rgba(255,255,255,0.90)";
  const d = variant === "coral" ? "rgba(255,255,255,0.20)" : "rgba(232,100,45,0.25)";
  const a = variant === "coral" ? "rgba(255,255,255,0.55)" : "rgba(201,135,58,0.70)";
  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true" className="w-full h-full">
      {[20,50,80,110].map(x => [25,65,105,145].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={d} />
      )))}
      {/* Triangle lines */}
      <line x1="70" y1="32" x2="28" y2="116" stroke={a} strokeWidth={1.5} />
      <line x1="70" y1="32" x2="112" y2="116" stroke={a} strokeWidth={1.5} />
      <line x1="28" y1="116" x2="112" y2="116" stroke={a} strokeWidth={1.5} />
      {/* Glowing nodes */}
      <circle cx={70} cy={32} r={12} fill={d} stroke={a} strokeWidth={1.5} />
      <circle cx={70} cy={32} r={6} fill={a} />
      <circle cx={28} cy={116} r={12} fill={d} stroke={a} strokeWidth={1.5} />
      <circle cx={28} cy={116} r={6} fill={a} />
      <circle cx={112} cy={116} r={12} fill={d} stroke={a} strokeWidth={1.5} />
      <circle cx={112} cy={116} r={6} fill={a} />
      {/* Labels */}
      <text x={70} y={20} textAnchor="middle" fontSize="7" fill={w} fontWeight="bold">STRUCTURE</text>
      <text x={14} y={138} textAnchor="middle" fontSize="7" fill={w} fontWeight="bold">TIMING</text>
      <text x={122} y={138} textAnchor="middle" fontSize="7" fill={w} fontWeight="bold">WEALTH</text>
      {/* Sparkle */}
      <path d="M102 44 l1.2 4.5 4.5 1.2-4.5 1.2-1.2 4.5-1.2-4.5-4.5-1.2 4.5-1.2z" fill={a} />
      <path d="M22 56 l0.9 3.4 3.4 0.9-3.4 0.9-0.9 3.4-0.9-3.4-3.4-0.9 3.4-0.9z" fill={d} />
    </svg>
  );
};

/** Compass with timeline — represents "Destiny Navigator" */
const IllustrationNavigator: React.FC<{ variant: "coral" | "navy" }> = ({ variant }) => {
  const w = "rgba(255,255,255,0.85)";
  const d = variant === "coral" ? "rgba(255,255,255,0.20)" : "rgba(232,100,45,0.22)";
  const a = variant === "coral" ? "rgba(255,255,255,0.50)" : "rgba(201,135,58,0.65)";
  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true" className="w-full h-full">
      {[20,50,80,110].map(x => [25,65,105,145].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={d} />
      )))}
      {/* Compass outer ring */}
      <circle cx={70} cy={72} r={40} fill={d} stroke={a} strokeWidth={1} />
      <circle cx={70} cy={72} r={32} stroke={a} strokeWidth={0.5} strokeDasharray="4 3" />
      {/* Cardinal directions */}
      <text x={70} y={38} textAnchor="middle" fontSize="8" fill={w} fontWeight="bold">N</text>
      <text x={70} y={112} textAnchor="middle" fontSize="8" fill={w} fontWeight="bold">S</text>
      <text x={36} y={76} textAnchor="middle" fontSize="8" fill={w} fontWeight="bold">W</text>
      <text x={106} y={76} textAnchor="middle" fontSize="8" fill={w} fontWeight="bold">E</text>
      {/* Compass needle */}
      <polygon points="70,44 66,72 70,68 74,72" fill={a} />
      <polygon points="70,100 66,72 70,76 74,72" fill={d} stroke={a} strokeWidth={0.5} />
      {/* Center dot */}
      <circle cx={70} cy={72} r={4} fill={w} />
      {/* Timeline below */}
      <line x1="20" y1="136" x2="120" y2="136" stroke={a} strokeWidth={1} />
      {[28, 52, 76, 100, 116].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={136} r={i === 2 ? 5 : 3} fill={i === 2 ? a : d} stroke={a} strokeWidth={0.8} />
          {i === 2 && <circle cx={x} cy={136} r={2} fill={w} />}
        </g>
      ))}
      <text x={70} y={150} textAnchor="middle" fontSize="7" fill={a}>Your Journey</text>
    </svg>
  );
};

/** Neural network / AI brain — represents "AI Wealth Assistant" */
const IllustrationAI: React.FC<{ variant: "coral" | "navy" }> = ({ variant }) => {
  const w = "rgba(255,255,255,0.85)";
  const d = variant === "coral" ? "rgba(255,255,255,0.18)" : "rgba(232,100,45,0.22)";
  const a = variant === "coral" ? "rgba(255,255,255,0.48)" : "rgba(201,135,58,0.62)";
  const nodes = [
    { cx:70, cy:80, r:14 }, // center
    { cx:30, cy:50, r:8 }, { cx:70, cy:30, r:8 }, { cx:110, cy:50, r:8 },
    { cx:20, cy:90, r:6 }, { cx:120, cy:90, r:6 },
    { cx:35, cy:125, r:7 }, { cx:105, cy:125, r:7 },
  ];
  const edges = [
    [0,1],[0,2],[0,3],[0,4],[0,5],[0,6],[0,7],
    [1,2],[2,3],[1,4],[3,5],[4,6],[5,7],
  ];
  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true" className="w-full h-full">
      {/* Glow rings around center */}
      <circle cx={70} cy={80} r={28} fill="none" stroke={a} strokeWidth={0.5} opacity={0.4} />
      <circle cx={70} cy={80} r={42} fill="none" stroke={a} strokeWidth={0.5} opacity={0.2} />
      {/* Edges */}
      {edges.map(([s, e]) => (
        <line
          key={`${s}-${e}`}
          x1={nodes[s].cx} y1={nodes[s].cy}
          x2={nodes[e].cx} y2={nodes[e].cy}
          stroke={a} strokeWidth={0.8}
        />
      ))}
      {/* Nodes */}
      {nodes.map(({ cx, cy, r }, i) => (
        <g key={i}>
          <circle cx={cx} cy={cy} r={r} fill={d} stroke={a} strokeWidth={i === 0 ? 1.5 : 0.8} />
          {i === 0 && <circle cx={cx} cy={cy} r={6} fill={a} />}
          {i === 0 && (
            <path d={`M${cx} ${cy-5} l0.9 3.4 3.4 0.9-3.4 0.9-0.9 3.4-0.9-3.4-3.4-0.9 3.4-0.9z`} fill={w} />
          )}
        </g>
      ))}
      {/* Label */}
      <text x={70} y={152} textAnchor="middle" fontSize="7" fill={a} letterSpacing="1">AI ENGINE</text>
    </svg>
  );
};

/** Ascending bar chart with report — represents "Founder Report" */
const IllustrationReport: React.FC<{ variant: "coral" | "navy" }> = ({ variant }) => {
  const w = "rgba(255,255,255,0.85)";
  const d = variant === "coral" ? "rgba(255,255,255,0.20)" : "rgba(232,100,45,0.22)";
  const a = variant === "coral" ? "rgba(255,255,255,0.52)" : "rgba(201,135,58,0.68)";
  const bars = [
    { x: 22, h: 35, },
    { x: 42, h: 52, },
    { x: 62, h: 68, },
    { x: 82, h: 88, },
    { x: 102, h: 72, },
  ];
  const baseY = 128;
  const barW = 14;
  return (
    <svg viewBox="0 0 140 160" fill="none" aria-hidden="true" className="w-full h-full">
      {[20,50,80,110].map(x => [25,65,105,145].map(y => (
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1} fill={d} />
      )))}
      {/* Baseline */}
      <line x1="16" y1={baseY} x2="124" y2={baseY} stroke={a} strokeWidth={1} />
      {/* Bars */}
      {bars.map(({ x, h }, i) => (
        <g key={i}>
          <rect
            x={x} y={baseY - h}
            width={barW} height={h}
            rx={3}
            fill={i === 3 ? a : d}
            stroke={a} strokeWidth={0.8}
          />
          {/* Trend dot on top */}
          <circle cx={x + barW/2} cy={baseY - h} r={3} fill={i === 3 ? w : a} />
        </g>
      ))}
      {/* Trend line through tops */}
      <polyline
        points={bars.map(({ x, h }) => `${x + barW/2},${baseY - h}`).join(" ")}
        stroke={w} strokeWidth={1} fill="none" strokeDasharray="3 2"
      />
      {/* Crown sparkle above tallest bar */}
      <path d="M89 25 l1.4 5.3 5.3 1.4-5.3 1.4-1.4 5.3-1.4-5.3-5.3-1.4 5.3-1.4z" fill={a} />
      <path d="M110 42 l0.9 3.4 3.4 0.9-3.4 0.9-0.9 3.4-0.9-3.4-3.4-0.9 3.4-0.9z" fill={d} />
      {/* Label */}
      <text x={70} y={148} textAnchor="middle" fontSize="7" fill={a} letterSpacing="1">GROWTH REPORT</text>
    </svg>
  );
};

/** Map from tool key to its illustration component */
type IllustrationKey = "chart" | "calculate" | "alignment" | "navigator" | "ai" | "report";

const ILLUSTRATIONS: Record<IllustrationKey, React.FC<{ variant: "coral" | "navy" }>> = {
  chart:     IllustrationMyChart,
  calculate: IllustrationCalculate,
  alignment: IllustrationAlignment,
  navigator: IllustrationNavigator,
  ai:        IllustrationAI,
  report:    IllustrationReport,
};

// ─────────────────────────────────────────────────────────────────────────────
// Tool card — left-right split: illustration on left, content on right
// ─────────────────────────────────────────────────────────────────────────────

interface ToolCardProps {
  to:            string;
  illustration:  IllustrationKey;
  title:         string;
  description:   string;
  /** "coral" — warm featured gradient | "navy" — deep professional gradient */
  variant?:      "coral" | "navy";
  premium?:      boolean;
  disabled?:     boolean;
}

const CARD_GRADIENTS: Record<"coral" | "navy", string> = {
  /** Dark navy base → coral sunrise bleeding in from bottom-right corner */
  coral: `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 45%, ${C.coralDark} 78%, ${C.coral} 100%)`,
  navy:  `linear-gradient(135deg, ${C.navy} 0%, ${C.navyMid} 60%, ${C.navyLight} 100%)`,
};

const ToolCard: React.FC<ToolCardProps> = ({
  to, illustration, title, description, variant = "coral", premium = false, disabled = false,
}) => {
  const IllustrationComponent = ILLUSTRATIONS[illustration];
  return (
    <Link
      to={disabled ? "#" : to}
      tabIndex={disabled ? -1 : 0}
      style={{ pointerEvents: disabled ? "none" : "auto" }}
      className="group flex flex-col rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-2xl hover:-translate-y-1.5"
    >
      {/* ── TOP: Illustration zone — gradient background ── */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: 148,
          background: CARD_GRADIENTS[variant],
        }}
      >
        {/* Radial glow centred on illustration */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 75% 75% at 50% 50%, rgba(255,255,255,0.07) 0%, transparent 65%)",
          }}
        />
        {/* Premium badge */}
        {premium && (
          <span
            className="absolute top-3 right-3 rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-widest z-10"
            style={{ background: "rgba(255,255,255,0.20)", color: C.white }}
          >
            Premium
          </span>
        )}
        <div className="w-full h-full p-3">
          <IllustrationComponent variant={variant} />
        </div>
      </div>

      {/* ── BOTTOM: Light cream body ── */}
      <div
        className="flex flex-col gap-2 px-4 pt-3.5 pb-4"
        style={{
          background: C.cream,
          border: `1px solid ${C.border}`,
          borderTop: "none",
        }}
      >
        <p className="text-sm font-bold leading-tight" style={{ color: C.navy }}>
          {title}
        </p>
        <p className="text-xs leading-relaxed" style={{ color: C.muted }}>
          {description}
        </p>
        {/* CTA */}
        <div
          className="flex items-center gap-1 pt-2 mt-0.5"
          style={{ borderTop: `1px solid ${C.border}`, color: C.coral }}
        >
          <span className="text-[11px] font-bold">Open</span>
          <svg
            className="w-3 h-3 transition-transform duration-150 group-hover:translate-x-0.5"
            fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Section header — full-width navy→coral gradient bar
// ─────────────────────────────────────────────────────────────────────────────

const SectionHeader: React.FC<{
  label:  string;
  right?: React.ReactNode;
  badge?: string;
}> = ({ label, right, badge }) => (
  <div className="mb-6">
    <div
      className="w-full h-0.5 mb-4 rounded-full"
      style={{ background: `linear-gradient(90deg, ${C.navy} 0%, ${C.coral} 55%, transparent 100%)` }}
    />
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <Sparkle size={10} color={C.coral} />
        <h2 className="text-xs font-bold uppercase tracking-[0.2em]" style={{ color: C.navy }}>
          {label}
        </h2>
        {badge !== undefined && (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-bold"
            style={{ background: `${C.coral}18`, color: C.coral }}
          >
            {badge}
          </span>
        )}
      </div>
      {right}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// Sidebar section label
// ─────────────────────────────────────────────────────────────────────────────

const SidebarSection: React.FC<{ label: string }> = ({ label }) => (
  <div className="flex items-center gap-2 px-3 mt-5 mb-2">
    <div className="w-3 h-px rounded-full" style={{ background: `${C.coral}50` }} />
    <p className="text-[9px] font-bold uppercase tracking-[0.22em]" style={{ color: `${C.coral}80` }}>
      {label}
    </p>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SVG icons
// ─────────────────────────────────────────────────────────────────────────────

const IconChart = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
  </svg>
);
const IconCalc = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const IconNav = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);
const IconAI = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);
const IconReport = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
const IconAlign = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-full h-full" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);
const IconDelete = (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// Main Dashboard
// ─────────────────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { profiles, loading, deleteProfile } = useProfileContext();
  const { showAlert } = useAlertContext();
  const {
    hasAIAssistant,
    hasFounderReport,
    hasAlignmentAdvantage,
    hasDestinyNavigatorTool,
    isAdmin,
    tier,
  } = useTierAccess();

  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen:      boolean;
    profileId:   string;
    profileName: string;
  }>({ isOpen: false, profileId: "", profileName: "" });

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const selfProfile = React.useMemo(
    () => profiles.find((p) => p.is_self),
    [profiles]
  );

  const destinyNavigatorUrl = selfProfile
    ? `/destiny-navigator/${selfProfile.id}`
    : "/calculate";

  const recentProfiles = React.useMemo(
    () =>
      [...profiles]
        .sort((a, b) => {
          const aDate = a.last_viewed || a.created_at;
          const bDate = b.last_viewed || b.created_at;
          return new Date(bDate).getTime() - new Date(aDate).getTime();
        })
        .slice(0, 6),
    [profiles]
  );

  const handleDeleteClick = (profileId: string, profileName: string): void => {
    setDeleteConfirmation({ isOpen: true, profileId, profileName });
  };

  const handleConfirmDelete = async (): Promise<void> => {
    try {
      await deleteProfile(deleteConfirmation.profileId);
      showAlert(
        t("dashboard.deleteSuccess").replace("{{name}}", deleteConfirmation.profileName),
        "success"
      );
      setDeleteConfirmation({ isOpen: false, profileId: "", profileName: "" });
    } catch (error) {
      console.error("Error deleting profile:", error);
      showAlert(t("dashboard.deleteError"), "error");
    }
  };

  const chartUrl = tier === "tier3" && !isAdmin ? "/tier3-result" : "/chart";

  const greeting = (): string => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning,";
    if (h < 17) return "Good afternoon,";
    return "Good evening,";
  };

  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric", year: "numeric",
  });

  return (
    <PageTransition>
      {/* position:fixed to completely escape MainLayout container constraints */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          display: "flex",
          zIndex: 40,
          overflow: "hidden",
        }}
      >

        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <aside
          className="shrink-0 flex flex-col overflow-y-auto relative"
          style={{
            width: 230,
            height: "100%",
            background: `linear-gradient(180deg, #0f1230 0%, ${C.navy} 40%, #0e1228 100%)`,
          }}
        >
          {/*
           * Subtle dot-pattern texture overlay — matches slide halftone bg.
           * Done with a repeating radial-gradient.
           */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)`,
              backgroundSize: "20px 20px",
            }}
          />

          {/* ── Brand header ── */}
          <div className="relative px-5 pt-6 pb-5">
            {/* Coral glow behind brand */}
            <div
              className="absolute top-0 left-0 right-0 h-24 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 80% 80% at 50% 0%, ${C.coral}22 0%, transparent 70%)`,
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-3">
                <Sparkle size={14} color={C.coral} />
                <Sparkle size={8} color={`${C.coral}70`} />
              </div>
              <p
                className="text-[10px] font-bold uppercase tracking-[0.26em] mb-1"
                style={{ color: C.coral }}
              >
                Purple Star Astrology
              </p>
              <p className="text-xl font-bold text-white leading-tight">紫微斗数</p>
              <p className="text-[10px] mt-1" style={{ color: "rgba(255,255,255,0.30)" }}>
                {profiles.length} saved profiles
              </p>
            </div>
          </div>

          {/* Divider */}
          <div
            className="mx-5 mb-2"
            style={{
              height: 1,
              background: `linear-gradient(90deg, ${C.coral}50, transparent)`,
            }}
          />

          {/* ── Navigation ── */}
          <nav className="relative flex-1 px-3 py-2">
            <SidebarSection label="Charts" />
            <NavItem to={chartUrl} icon={IconChart} label="My Chart" />
            <NavItem
              to="/calculate"
              icon={IconCalc}
              label="Calculate"
              badge={profiles.length > 0 ? String(profiles.length) : undefined}
            />

            {(hasDestinyNavigatorTool || hasAIAssistant) && (
              <>
                <SidebarSection label="Tools" />
                {hasDestinyNavigatorTool && (
                  <NavItem to={destinyNavigatorUrl} icon={IconNav} label="Destiny Navigator" />
                )}
                {hasAIAssistant && (
                  <NavItem to="/destiny-wealth-navigator" icon={IconAI} label="AI Wealth Assistant" />
                )}
              </>
            )}

            {(hasFounderReport || hasAlignmentAdvantage) && (
              <>
                <SidebarSection label="Premium Reports" />
                {hasFounderReport && (
                  <NavItem to="/founder-report" icon={IconReport} label="Founder Report" />
                )}
                {hasAlignmentAdvantage && (
                  <NavItem to="/alignment-advantage" icon={IconAlign} label="Alignment Advantage" />
                )}
              </>
            )}

          </nav>

          {/* ── User footer ── */}
          <div
            className="relative px-5 py-4"
            style={{ borderTop: "1px solid rgba(255,255,255,0.07)", background: "transparent" }}
          >
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-white/30"
                style={{ background: "rgba(255,255,255,0.15)", color: C.white }}
              >
                {displayName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{displayName}</p>
                <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                  {user?.email ?? ""}
                </p>
              </div>
              <Sparkle size={10} color="rgba(255,255,255,0.60)" />
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT AREA ────────────────────────────────────────────── */}
        <main
          className="flex-1 overflow-y-auto relative"
          style={{
            background: `
              radial-gradient(ellipse 70% 55% at 95% 0%,   #fcd5b0 0%, transparent 55%),
              radial-gradient(ellipse 55% 45% at 5%  100%, #fcd8c0 0%, transparent 50%),
              linear-gradient(155deg, #fef8f0 0%, #fdf3e8 45%, #f8ece0 100%)
            `,
          }}
        >
          {/* Orbital ring decoration */}
          <div
            className="absolute pointer-events-none"
            style={{ top: -60, right: -80, width: 520, height: 360, opacity: 0.9 }}
          >
            <OrbitalRing className="w-full h-full" />
          </div>

          {/* ── Session tag banner ── */}
          <div
            className="relative w-full px-10 py-2.5 flex items-center gap-3"
            style={{
              background: `linear-gradient(90deg, ${C.navy} 0%, #252b62 50%, #2e3575 100%)`,
            }}
          >
            <Sparkle size={10} color={C.coral} />
            <p
              className="text-[9px] font-bold uppercase tracking-[0.28em]"
              style={{ color: C.coral }}
            >
              CAE GOH
            </p>
            <div
              className="flex-1 h-px mx-2"
              style={{
                background: `linear-gradient(90deg, ${C.coral}55 0%, ${C.coral}10 60%, transparent 100%)`,
              }}
            />
            <Sparkle size={7} color={`${C.coral}80`} />
            <p
              className="text-[9px] font-semibold uppercase tracking-[0.14em]"
              style={{ color: "rgba(255,255,255,0.38)" }}
            >
              {dateLabel}
            </p>
          </div>

          <div className="relative px-10 py-10">

            {/* ── Welcome Hero ── */}
            <header className="mb-14 relative">
              <div
                className="absolute pointer-events-none"
                style={{
                  top: -20, left: -30,
                  width: 400, height: 130,
                  background: `radial-gradient(ellipse, ${C.coral}1a 0%, transparent 70%)`,
                  filter: "blur(32px)",
                }}
              />
              <div className="relative">
                <p
                  className="text-lg font-semibold mb-0.5"
                  style={{ color: C.muted, fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  {greeting()}
                </p>
                <h1
                  className="text-5xl font-bold leading-none mb-4"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
                >
                  <span
                    style={{
                      background: `linear-gradient(110deg, ${C.coral} 0%, ${C.coralDark} 55%, ${C.gold} 100%)`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {displayName}
                  </span>
                  <Sparkle size={18} color={C.coral} className="inline ml-3 mb-1" />
                </h1>
                <p className="text-sm font-medium" style={{ color: C.muted }}>
                  Your{" "}
                  <span style={{ color: C.coral, fontWeight: 700 }}>Purple Star Astrology</span>
                  {" "}analytics and tools
                </p>
              </div>
            </header>

            {/* ── Tools Grid ── */}
            <section className="mb-14">
              <SectionHeader label="Your Tools" />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                {/* Featured tools — coral gradient, bespoke illustration */}
                <ToolCard
                  to={chartUrl}
                  illustration="chart"
                  title={t("dashboard.actions.myChart.title")}
                  description={t("dashboard.actions.myChart.description")}
                  variant="coral"
                />
                <ToolCard
                  to="/calculate"
                  illustration="calculate"
                  title={t("dashboard.actions.calculate.title")}
                  description={t("dashboard.actions.calculate.description")}
                  variant="coral"
                />
                {hasAlignmentAdvantage && (
                  <ToolCard
                    to="/alignment-advantage"
                    illustration="alignment"
                    title="Alignment Advantage"
                    description="Your Structure, Timing & Wealth Strategy"
                    variant="coral"
                    premium
                  />
                )}

                {hasDestinyNavigatorTool && (
                  <ToolCard
                    to={destinyNavigatorUrl}
                    illustration="navigator"
                    title="Destiny Navigator"
                    description="Analyse life aspects across timeframes"
                    variant="coral"
                  />
                )}
                {hasAIAssistant && (
                  <ToolCard
                    to="/destiny-wealth-navigator"
                    illustration="ai"
                    title="Destiny Wealth Navigator AI"
                    description="AI-powered astrology insights and guidance"
                    variant="coral"
                  />
                )}
                {hasFounderReport && (
                  <ToolCard
                    to="/founder-report"
                    illustration="report"
                    title="Founder Report"
                    description="Strategic business and wealth insights"
                    variant="coral"
                    premium
                  />
                )}
              </div>
            </section>

            {/* ── Recent Profiles ── */}
            <section>
              <SectionHeader
                label="Recent Profiles"
                badge={`${profiles.length} saved`}
                right={
                  <Link
                    to="/calculate"
                    className="text-xs font-bold transition-colors"
                    style={{ color: C.coral }}
                    onMouseEnter={(e) => { e.currentTarget.style.color = C.coralDark; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = C.coral; }}
                  >
                    View All →
                  </Link>
                }
              />

              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div
                    className="h-8 w-8 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: `${C.coral}40`, borderTopColor: C.coral }}
                  />
                </div>
              ) : recentProfiles.length > 0 ? (
                <div
                  className="rounded-2xl overflow-hidden border"
                  style={{ borderColor: C.border, background: C.white }}
                >
                  {/* Navy→coral gradient bar at table top */}
                  <div
                    className="w-full h-0.5"
                    style={{
                      background: `linear-gradient(90deg, ${C.navy} 0%, ${C.coral} 100%)`,
                    }}
                  />
                  <table className="w-full">
                    <thead>
                      <tr
                        style={{
                          borderBottom: `1px solid ${C.border}`,
                          background: `${C.cream}dd`,
                        }}
                      >
                        {["Name", "Date of Birth", "Gender", "Action"].map((h) => (
                          <th
                            key={h}
                            scope="col"
                            className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-[0.16em]"
                            style={{ color: C.muted }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {recentProfiles.map((profile, idx) => (
                        <tr
                          key={profile.id}
                          style={{
                            borderBottom:
                              idx < recentProfiles.length - 1
                                ? `1px solid ${C.border}`
                                : "none",
                          }}
                          className="transition-colors hover:bg-orange-50/40"
                        >
                          <td className="px-5 py-3.5">
                            <p className="text-sm font-semibold" style={{ color: C.text }}>
                              {profile.name}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm" style={{ color: C.muted }}>
                              {new Date(profile.birthday).toLocaleDateString("en-US", {
                                month: "short", day: "numeric", year: "numeric",
                              })}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <p className="text-sm capitalize" style={{ color: C.muted }}>
                              {profile.gender === "male"
                                ? t("dashboard.table.male")
                                : t("dashboard.table.female")}
                            </p>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <Link
                                to={
                                  tier === "tier3" && !isAdmin
                                    ? `/tier3-result/${profile.id}`
                                    : `/result/${profile.id}`
                                }
                                className="text-xs font-bold transition-colors"
                                style={{ color: C.coral }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = C.coralDark; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = C.coral; }}
                              >
                                View
                              </Link>
                              <button
                                type="button"
                                onClick={() => { handleDeleteClick(profile.id, profile.name); }}
                                className="transition-colors p-1 rounded"
                                style={{ color: "#d0c8c0" }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "#e74c3c"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "#d0c8c0"; }}
                                title={t("dashboard.table.delete")}
                              >
                                {IconDelete}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div
                  className="rounded-2xl border flex flex-col items-center justify-center py-16 text-center"
                  style={{ borderColor: C.border, background: C.white }}
                >
                  <Sparkle size={32} color={`${C.coral}40`} />
                  <p className="mt-3 text-sm font-semibold" style={{ color: C.text }}>
                    No profiles yet
                  </p>
                  <p className="text-xs mt-1 mb-6" style={{ color: C.muted }}>
                    Calculate a chart to get started
                  </p>
                  <Link
                    to="/calculate"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition-all hover:opacity-90"
                    style={{
                      background: `linear-gradient(135deg, ${C.coral}, ${C.coralDark})`,
                      color: C.white,
                    }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    {t("dashboard.emptyState.action")}
                  </Link>
                </div>
              )}
            </section>

            <div className="h-16" />
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        title={t("dashboard.deleteConfirmTitle") || "Delete Profile"}
        message={
          t("dashboard.deleteConfirmMessage")?.replace("{{name}}", deleteConfirmation.profileName) ||
          `Are you sure you want to delete "${deleteConfirmation.profileName}"? This action cannot be undone.`
        }
        confirmText={t("dashboard.table.delete") || "Delete"}
        cancelText={t("general.cancel") || "Cancel"}
        onConfirm={handleConfirmDelete}
        onCancel={() => { setDeleteConfirmation({ isOpen: false, profileId: "", profileName: "" }); }}
        type="danger"
      />
    </PageTransition>
  );
};

export default Dashboard;
