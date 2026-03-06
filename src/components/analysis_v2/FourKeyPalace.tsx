import React from "react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeDestinyAlert } from "../../utils/zwds/analysis";
import GradientSectionHeader from "./shared/GradientSectionHeader";

/**
 * Color and content configuration per transformation type.
 * All colors are defined as CSS strings (not Tailwind classes) to prevent
 * Tailwind JIT from purging dynamically-referenced utility names.
 */
type TransformationConfig = {
  /** Hero question displayed at the top of the card */
  heroQuestion: string;
  /** Emoji icon for the hero question */
  icon: string;
  /** 3 energy bars — label + fixed percentage (static per transformation type) */
  bars: Array<{ label: string; pct: number }>;
  /** CSS gradient string for the colored header strip */
  headerGradient: string;
  /** CSS gradient string for the card body background */
  bodyGradient: string;
  /** CSS box-shadow / border color for the card */
  borderColor: string;
  /** CSS color for the bar fill */
  barFill: string;
  /** CSS gradient for the bar fill (richer than flat color) */
  barGradient: string;
  /** CSS color for the palace name headline text */
  palaceColor: string;
  /** CSS color for the watermark character */
  watermarkColor: string;
  /** The single Chinese character shown as a watermark (祿/權/科/忌) */
  watermarkChar: string;
  /** CSS box shadow for the card */
  cardShadow: string;
};

/**
 * Static transformation metadata — one entry per transformation type.
 * Bar percentages reflect the classical ZWDS energy profile of each transformation.
 */
const TRANSFORMATION_CONFIG: Record<string, TransformationConfig> = {
  "化祿": {
    heroQuestion: "WHERE DOES WEALTH FLOW?",
    icon: "💰",
    bars: [
      { label: "Abundance", pct: 85 },
      { label: "Flow",      pct: 70 },
      { label: "Ease",      pct: 60 },
    ],
    headerGradient:  "linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)",
    bodyGradient:    "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    borderColor:     "#86efac",
    barFill:         "#059669",
    barGradient:     "linear-gradient(90deg, #047857, #10b981)",
    palaceColor:     "#065f46",
    watermarkColor:  "#059669",
    watermarkChar:   "祿",
    cardShadow:      "0 4px 24px rgba(5,150,105,0.12)",
  },
  "化權": {
    heroQuestion: "WHERE DOES POWER RISE?",
    icon: "👑",
    bars: [
      { label: "Authority", pct: 90 },
      { label: "Drive",     pct: 75 },
      { label: "Control",   pct: 65 },
    ],
    headerGradient:  "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
    bodyGradient:    "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    borderColor:     "#93c5fd",
    barFill:         "#2563eb",
    barGradient:     "linear-gradient(90deg, #1e40af, #3b82f6)",
    palaceColor:     "#1e3a8a",
    watermarkColor:  "#2563eb",
    watermarkChar:   "權",
    cardShadow:      "0 4px 24px rgba(37,99,235,0.12)",
  },
  "化科": {
    heroQuestion: "WHERE DOES TALENT SHINE?",
    icon: "✨",
    bars: [
      { label: "Talent",      pct: 85 },
      { label: "Recognition", pct: 70 },
      { label: "Refinement",  pct: 60 },
    ],
    headerGradient:  "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)",
    bodyGradient:    "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
    borderColor:     "#fcd34d",
    barFill:         "#d97706",
    barGradient:     "linear-gradient(90deg, #b45309, #f59e0b)",
    palaceColor:     "#92400e",
    watermarkColor:  "#d97706",
    watermarkChar:   "科",
    cardShadow:      "0 4px 24px rgba(217,119,6,0.12)",
  },
  "化忌": {
    heroQuestion: "WHERE SHOULD I TREAD CAREFULLY?",
    icon: "🧭",
    bars: [
      { label: "Friction",   pct: 80 },
      { label: "Tension",    pct: 65 },
      { label: "Complexity", pct: 55 },
    ],
    headerGradient:  "linear-gradient(135deg, #9f1239 0%, #dc2626 50%, #ef4444 100%)",
    bodyGradient:    "linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)",
    borderColor:     "#fda4af",
    barFill:         "#dc2626",
    barGradient:     "linear-gradient(90deg, #9f1239, #ef4444)",
    palaceColor:     "#9f1239",
    watermarkColor:  "#dc2626",
    watermarkChar:   "忌",
    cardShadow:      "0 4px 24px rgba(220,38,38,0.12)",
  },
};

/** Normalise traditional/simplified transformation variants to a single config key */
const normaliseTransformation = (t: string): string => {
  if (t === "化禄") return "化祿";
  if (t === "化权") return "化權";
  return t;
};

/**
 * Maps Chinese star names (both traditional and simplified) to their Pinyin equivalents.
 * Covers all 14 main stars plus the 4 auxiliary stars that can carry transformations.
 */
const STAR_NAME_TO_PINYIN: Record<string, string> = {
  // Traditional
  "紫微": "Zi Wei",
  "天機": "Tian Ji",
  "太陽": "Tai Yang",
  "武曲": "Wu Qu",
  "天同": "Tian Tong",
  "廉貞": "Lian Zhen",
  "天府": "Tian Fu",
  "太陰": "Tai Yin",
  "貪狼": "Tan Lang",
  "巨門": "Ju Men",
  "天相": "Tian Xiang",
  "天梁": "Tian Liang",
  "七殺": "Qi Sha",
  "破軍": "Po Jun",
  "文昌": "Wen Chang",
  "文曲": "Wen Qu",
  "左輔": "Zuo Fu",
  "右弼": "You Bi",
  // Simplified (chart data may use either)
  "天机": "Tian Ji",
  "太阳": "Tai Yang",
  "廉贞": "Lian Zhen",
  "太阴": "Tai Yin",
  "贪狼": "Tan Lang",
  "巨门": "Ju Men",
  "七杀": "Qi Sha",
  "破军": "Po Jun",
  "左辅": "Zuo Fu",
};

/**
 * Returns the Pinyin name for a star, or the original Chinese name if no mapping exists.
 */
const getStarPinyin = (chineseName: string): string =>
  STAR_NAME_TO_PINYIN[chineseName] ?? chineseName;

/**
 * Props for the FourKeyPalace component
 */
type FourKeyPalaceProps = {
  chartData: ChartData;
};

/**
 * FourKeyPalace — Destiny Alert Map
 *
 * Displays a 2×2 grid of the four natal transformations. Each card shows:
 *   Zone 1: Hero question (what this transformation answers)
 *   Zone 2: Palace name (the answer) + triggering star in pinyin
 *   Zone 3: Energy profile bars (static per transformation type)
 *   Zone 4: 3-line insight (theme, reality, directive)
 */
const FourKeyPalace: React.FC<FourKeyPalaceProps> = ({ chartData }) => {
  const analysisResult = analyzeDestinyAlert(chartData);

  if (analysisResult.alerts.length === 0) {
    return (
      <div className="dark:bg-gray-900">
        <GradientSectionHeader
          badgeText="05"
          title="DESTINY ALERT MAP"
          subtitle="Four signals showing where your life force is most activated."
        />
        <p className="text-center text-gray-500 dark:text-gray-400 py-8 px-6">
          No transformation data available.
        </p>
      </div>
    );
  }

  return (
    <div className="dark:bg-gray-900">
      {/* Section header — matches all other analysis sections */}
      <GradientSectionHeader
        badgeText="05"
        title="DESTINY ALERT MAP"
        subtitle="Four signals showing where your life force is most activated."
      />

      {/* 2 × 2 card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 px-6 pb-6">
        {analysisResult.alerts.map((alert) => {
          const key = normaliseTransformation(alert.transformation);
          const config = TRANSFORMATION_CONFIG[key] ?? TRANSFORMATION_CONFIG["化忌"];

          return (
            <div
              key={`${alert.palaceNumber}-${alert.transformation}`}
              className="relative rounded-2xl overflow-hidden flex flex-col"
              style={{
                background: config.bodyGradient,
                border: `2px solid ${config.borderColor}`,
                boxShadow: config.cardShadow,
              }}
            >
              {/* Zone 1 — Hero question (colored gradient header strip) */}
              <div
                className="px-5 py-4"
                style={{
                  background: config.headerGradient,
                  boxShadow: "0 2px 12px rgba(0,0,0,0.15)",
                }}
              >
                <p className="text-white font-black text-lg tracking-wide leading-tight"
                   style={{ textShadow: "0 1px 4px rgba(0,0,0,0.2)" }}>
                  {config.icon} {config.heroQuestion}
                </p>
              </div>

              {/* Watermark character — large faded in background */}
              <div
                aria-hidden="true"
                className="absolute bottom-0 right-2 text-[110px] font-black leading-none select-none pointer-events-none"
                style={{
                  color: config.watermarkColor,
                  opacity: 0.07,
                  lineHeight: 1,
                }}
              >
                {config.watermarkChar}
              </div>

              <div className="relative z-10 p-5 flex flex-col gap-4 flex-1">
                {/* Zone 2 — Palace name (left) and star pill (right), space-between */}
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1"
                     style={{ color: "rgba(107,114,128,0.8)" }}>
                    Activates
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <h3
                      className="text-2xl font-black leading-tight"
                      style={{ color: config.palaceColor }}
                    >
                      {alert.palace}
                    </h3>
                    {/* Star pill — right-aligned, same visual weight as palace */}
                    <span
                      className="font-bold text-sm px-3 py-1 rounded-full flex-shrink-0"
                      style={{
                        background: "rgba(0,0,0,0.08)",
                        color: config.palaceColor,
                      }}
                    >
                      {getStarPinyin(alert.starName)}
                    </span>
                  </div>
                </div>

                {/* Zone 3 — Energy profile bars */}
                <div className="flex flex-col gap-2.5">
                  {config.bars.map((bar) => (
                    <div key={bar.label} className="flex items-center gap-3">
                      <span
                        className="text-xs w-24 flex-shrink-0"
                        style={{ color: "rgba(107,114,128,0.9)" }}
                      >
                        {bar.label}
                      </span>
                      {/* Track */}
                      <div
                        className="flex-1 rounded-full overflow-hidden"
                        style={{
                          height: "8px",
                          background: "rgba(0,0,0,0.08)",
                        }}
                      >
                        {/* Fill */}
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${bar.pct}%`,
                            background: config.barGradient,
                            transition: "width 0.7s ease",
                          }}
                        />
                      </div>
                      <span
                        className="text-xs w-8 text-right flex-shrink-0"
                        style={{ color: "rgba(107,114,128,0.7)" }}
                      >
                        {bar.pct}%
                      </span>
                    </div>
                  ))}
                </div>

                {/* Zone 4 — 3-line insight */}
                <div className="flex flex-col gap-1 text-sm leading-relaxed"
                     style={{ color: "rgba(55,65,81,0.95)" }}>
                  <p>{alert.line1}</p>
                  <p>{alert.line2}</p>
                  <p
                    className="font-semibold italic"
                    style={{ color: config.palaceColor }}
                  >
                    {alert.line3}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FourKeyPalace;
