/**
 * FourKeyPalace — Destiny Alert Map (Section 05)
 *
 * 2×2 grid of natal transformations (祿 / 權 / 科 / 忌).
 * Accent colors per type are fixed: green, blue, amber, red.
 */

import React from "react";
import {
  AlertTriangle,
  Compass,
  Crown,
  Gem,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeDestinyAlert } from "../../utils/zwds/analysis";
import type { PalaceAlertData } from "../../utils/zwds/analysis/destinyAlertAnalysis";
import { BrandGradientText } from "../BrandGradientText";
import { analysisHeroTitleClass } from "../../styles/typographyUi";
import { pdfCaptureNumericBadgeStyle } from "./shared/pdfCaptureNumericBadgeStyle";

/**
 * Color and content configuration per transformation type.
 * CSS color strings — do not replace with unrelated hues.
 */
type TransformationConfig = {
  heroQuestion: string;
  icon: LucideIcon;
  bars: Array<{ label: string; pct: number }>;
  headerGradient: string;
  bodyGradient: string;
  borderColor: string;
  barFill: string;
  barGradient: string;
  palaceColor: string;
  watermarkColor: string;
  watermarkChar: string;
  cardShadow: string;
};

const TRANSFORMATION_CONFIG: Record<string, TransformationConfig> = {
  "化祿": {
    heroQuestion: "WHERE DOES WEALTH FLOW?",
    icon: Wallet,
    bars: [
      { label: "Abundance", pct: 85 },
      { label: "Flow", pct: 70 },
      { label: "Ease", pct: 60 },
    ],
    headerGradient: "linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)",
    bodyGradient: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    borderColor: "#86efac",
    barFill: "#059669",
    barGradient: "linear-gradient(90deg, #047857, #10b981)",
    palaceColor: "#065f46",
    watermarkColor: "#059669",
    watermarkChar: "祿",
    cardShadow: "0 4px 24px rgba(5,150,105,0.12)",
  },
  "化權": {
    heroQuestion: "WHERE DOES POWER RISE?",
    icon: Crown,
    bars: [
      { label: "Authority", pct: 90 },
      { label: "Drive", pct: 75 },
      { label: "Control", pct: 65 },
    ],
    headerGradient: "linear-gradient(135deg, #1e40af 0%, #2563eb 50%, #3b82f6 100%)",
    bodyGradient: "linear-gradient(145deg, #eff6ff 0%, #dbeafe 100%)",
    borderColor: "#93c5fd",
    barFill: "#2563eb",
    barGradient: "linear-gradient(90deg, #1e40af, #3b82f6)",
    palaceColor: "#1e3a8a",
    watermarkColor: "#2563eb",
    watermarkChar: "權",
    cardShadow: "0 4px 24px rgba(37,99,235,0.12)",
  },
  "化科": {
    heroQuestion: "WHERE DOES YOUR FAME RISE?",
    icon: Gem,
    bars: [
      { label: "Reputation", pct: 85 },
      { label: "Visibility", pct: 70 },
      { label: "Recognition", pct: 60 },
    ],
    headerGradient: "linear-gradient(135deg, #b45309 0%, #d97706 50%, #f59e0b 100%)",
    bodyGradient: "linear-gradient(145deg, #fffbeb 0%, #fef3c7 100%)",
    borderColor: "#fcd34d",
    barFill: "#d97706",
    barGradient: "linear-gradient(90deg, #b45309, #f59e0b)",
    palaceColor: "#92400e",
    watermarkColor: "#d97706",
    watermarkChar: "科",
    cardShadow: "0 4px 24px rgba(217,119,6,0.12)",
  },
  "化忌": {
    heroQuestion: "WHERE IS ENERGY BLOCKED?",
    icon: AlertTriangle,
    bars: [
      { label: "Blockage", pct: 80 },
      { label: "Resistance", pct: 65 },
      { label: "Challenge", pct: 55 },
    ],
    headerGradient: "linear-gradient(135deg, #9f1239 0%, #dc2626 50%, #ef4444 100%)",
    bodyGradient: "linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)",
    borderColor: "#fda4af",
    barFill: "#dc2626",
    barGradient: "linear-gradient(90deg, #9f1239, #ef4444)",
    palaceColor: "#9f1239",
    watermarkColor: "#dc2626",
    watermarkChar: "忌",
    cardShadow: "0 4px 24px rgba(220,38,38,0.12)",
  },
};

const normaliseTransformation = (t: string): string => {
  if (t === "化禄") return "化祿";
  if (t === "化权") return "化權";
  return t;
};

const STAR_NAME_TO_PINYIN: Record<string, string> = {
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

const getStarPinyin = (chineseName: string): string =>
  STAR_NAME_TO_PINYIN[chineseName] ?? chineseName;

type FourKeyPalaceProps = {
  chartData: ChartData;
  resolvePalaceName?: (palaceNumber: number) => string;
  forPdfCapture?: boolean;
};

type DestinyAlertMapHeroProps = {
  forPdfCapture?: boolean;
};

const DestinyAlertMapHero: React.FC<DestinyAlertMapHeroProps> = ({ forPdfCapture }) => (
  <div
    data-pdf-break-anchor="destiny-alert-hero"
    className="relative mb-10 overflow-hidden rounded-3xl border-2 border-brand-purple/25 shadow-2xl dark:border-accent-gold/70 dark:shadow-[0_12px_48px_rgba(251,146,60,0.28)] dark:ring-2 dark:ring-accent-gold/40"
  >
    <div
      className="absolute inset-0 bg-gradient-to-br from-brand-purpleDeep via-brand-purple to-indigo-700 dark:from-orange-600 dark:via-amber-600 dark:to-orange-700"
      aria-hidden="true"
    />
    <div
      className="absolute inset-0 opacity-[0.18] dark:opacity-[0.28]"
      style={{
        backgroundImage: `radial-gradient(circle at 18% 40%, rgba(255,255,255,0.35) 1px, transparent 1px),
            radial-gradient(circle at 82% 70%, rgba(255,255,255,0.2) 1px, transparent 1px)`,
        backgroundSize: "42px 42px",
      }}
      aria-hidden="true"
    />
    <div
      className="absolute -right-8 -top-10 h-48 w-48 rounded-full bg-accent-gold/20 blur-3xl dark:bg-amber-300/30"
      aria-hidden="true"
    />

    <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
      <div className="min-w-0 flex-1">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
          <Compass className="h-3.5 w-3.5 text-accent-gold" aria-hidden="true" />
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
            Section 05
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span
            style={
              forPdfCapture
                ? pdfCaptureNumericBadgeStyle("#4A3F6B")
                : {
                    background: "rgba(255, 255, 255, 0.95)",
                    color: "#4A3F6B",
                    height: "40px",
                    minWidth: "52px",
                    padding: "0 14px",
                    borderRadius: "12px",
                    fontSize: "20px",
                    fontWeight: "800",
                    lineHeight: 1,
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }
            }
          >
            05
          </span>
          <BrandGradientText as="h2" className={analysisHeroTitleClass}>
            Destiny Alert Map
          </BrandGradientText>
        </div>
        <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
          Four signals showing where your life force is most activated — wealth, power,
          fame, and friction.
        </p>
      </div>
      <div
        className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24 ${
          forPdfCapture ? "" : "backdrop-blur-md"
        }`}
      >
        <Compass className="h-10 w-10 text-white sm:h-12 sm:w-12" aria-hidden="true" />
      </div>
    </div>
    <div
      className="relative z-10 h-1.5 bg-gradient-to-r from-accent-goldDark via-accent-coralDark to-indigo-400 dark:from-amber-200 dark:via-white dark:to-amber-100"
      aria-hidden="true"
    />
  </div>
);

type DestinyAlertCardProps = {
  alert: PalaceAlertData;
  config: TransformationConfig;
  displayPalace: string;
  forPdfCapture?: boolean;
  pdfPageBreakBefore?: boolean;
};

const DestinyAlertCard: React.FC<DestinyAlertCardProps> = ({
  alert,
  config,
  displayPalace,
  forPdfCapture,
  pdfPageBreakBefore,
}) => {
  const HeaderIcon = config.icon;
  const hoverClass = forPdfCapture ? "" : "transition-shadow duration-300 hover:shadow-lg";

  return (
    <article
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className={`relative flex flex-col overflow-hidden rounded-2xl border-2 bg-white dark:border-gray-700 dark:bg-gray-800 ${hoverClass}`}
      style={{
        borderColor: config.borderColor,
        borderLeftWidth: "4px",
        borderLeftColor: config.barFill,
        boxShadow: config.cardShadow,
      }}
    >
      {/* Light-mode tinted panel; dark uses solid gray-800 */}
      <div
        className="absolute inset-0 dark:hidden"
        style={{ background: config.bodyGradient }}
        aria-hidden="true"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-1 select-none text-[100px] font-black leading-none sm:text-[110px]"
        style={{
          color: config.watermarkColor,
          opacity: 0.08,
          lineHeight: 1,
        }}
      >
        {config.watermarkChar}
      </div>

      <div className="relative z-10 flex flex-1 flex-col p-5 sm:p-6">
        {/* Header row */}
        <div className="mb-4 flex items-start gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl shadow-md"
            style={{ background: config.headerGradient }}
          >
            <HeaderIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p
              className="text-sm font-black uppercase leading-tight tracking-wide sm:text-base"
              style={{ color: config.palaceColor }}
            >
              {config.heroQuestion}
            </p>
            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
              <span style={{ color: config.barFill }}>{config.watermarkChar}</span>
              {" · "}
              Activates
            </p>
          </div>
        </div>

        {/* Palace + star */}
        <div className="mb-4 rounded-xl border border-black/5 bg-white/60 p-4 dark:border-white/10 dark:bg-gray-900/40">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BrandGradientText
              as="h3"
              className="text-xl font-black leading-tight sm:text-2xl"
            >
              {displayPalace}
            </BrandGradientText>
            <span
              className="inline-flex flex-shrink-0 items-center rounded-full px-3 py-1 text-sm font-bold"
              style={{
                background: `${config.barFill}22`,
                color: config.palaceColor,
                border: `1px solid ${config.borderColor}`,
              }}
            >
              {getStarPinyin(alert.starName)}
            </span>
          </div>
        </div>

        {/* Energy bars */}
        <div className="mb-4 flex flex-col gap-2.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Energy profile
          </p>
          {config.bars.map((bar) => (
            <div key={bar.label} className="flex items-center gap-3">
              <span className="w-24 flex-shrink-0 text-xs text-gray-600 dark:text-gray-400">
                {bar.label}
              </span>
              <div
                className="h-2 flex-1 overflow-hidden rounded-full"
                style={{ background: "rgba(0,0,0,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${bar.pct}%`,
                    background: config.barGradient,
                    transition: forPdfCapture ? "none" : "width 0.7s ease",
                  }}
                />
              </div>
              <span className="w-8 flex-shrink-0 text-right text-xs text-gray-500 dark:text-gray-400">
                {bar.pct}%
              </span>
            </div>
          ))}
        </div>

        {/* Insight */}
        <div className="mt-auto border-t border-black/5 pt-4 dark:border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Reading
          </p>
          <div className="mt-2 flex flex-col gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            <p>{alert.line1}</p>
            <p>{alert.line2}</p>
            <BrandGradientText as="p" className="font-semibold italic">
              {alert.line3}
            </BrandGradientText>
          </div>
        </div>
      </div>
    </article>
  );
};

const FourKeyPalace: React.FC<FourKeyPalaceProps> = ({
  chartData,
  resolvePalaceName,
  forPdfCapture,
}) => {
  const analysisResult = analyzeDestinyAlert(chartData);

  const sectionShell = (content: React.ReactNode) => (
    <div className="p-6">
      <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
        <DestinyAlertMapHero forPdfCapture={forPdfCapture} />
      </div>
      {content}
    </div>
  );

  if (analysisResult.alerts.length === 0) {
    return sectionShell(
      <p className="py-8 text-center text-gray-500 dark:text-gray-400">
        No transformation data available.
      </p>
    );
  }

  return sectionShell(
    <div
      data-pdf-break-anchor="four-key-grid"
      className={
        forPdfCapture
          ? "grid grid-cols-1 gap-5"
          : "grid grid-cols-1 gap-5 sm:grid-cols-2"
      }
    >
      {analysisResult.alerts.map((alert, index) => {
        const key = normaliseTransformation(alert.transformation);
        const config = TRANSFORMATION_CONFIG[key] ?? TRANSFORMATION_CONFIG["化忌"];
        const displayPalace =
          (resolvePalaceName ? resolvePalaceName(alert.palaceNumber) : "") ||
          alert.palace;

        return (
          <DestinyAlertCard
            key={`${alert.palaceNumber}-${alert.transformation}`}
            alert={alert}
            config={config}
            displayPalace={displayPalace}
            forPdfCapture={forPdfCapture}
            pdfPageBreakBefore={Boolean(forPdfCapture && index === 2)}
          />
        );
      })}
    </div>
  );
};

export default FourKeyPalace;
