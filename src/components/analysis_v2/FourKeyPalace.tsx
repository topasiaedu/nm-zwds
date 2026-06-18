/**
 * FourKeyPalace — Destiny Alert Map (Section 05)
 *
 * 2×2 grid of natal transformations (祿 / 權 / 科 / 忌) — themed signal cards.
 */

import React from "react";
import {
  AlertTriangle,
  Compass,
  Crown,
  Sparkles,
  Star,
  User,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { ChartData } from "../../utils/zwds/types";
import { analyzeDestinyAlert } from "../../utils/zwds/analysis";
import type { PalaceAlertData } from "../../utils/zwds/analysis/destinyAlertAnalysis";
import { AnalysisSectionHeader } from "./shared/AnalysisSectionHeader";

type MetricBar = {
  label: string;
  value: number;
};

/**
 * Per-transformation visual theme and static energy profile bars.
 */
type TransformationConfig = {
  heroQuestionPrefix: string;
  heroQuestionHighlight: string;
  heroQuestionSuffix: string;
  icon: LucideIcon;
  accentColor: string;
  cardBg: string;
  barTrackColor: string;
  badgeBg: string;
  transformationChar: string;
  metrics: MetricBar[];
};

const TRANSFORMATION_CONFIG: Record<string, TransformationConfig> = {
  "化祿": {
    heroQuestionPrefix: "WHERE DOES ",
    heroQuestionHighlight: "WEALTH",
    heroQuestionSuffix: " FLOW?",
    icon: Wallet,
    accentColor: "#2D7A4D",
    cardBg: "#F3FAF6",
    barTrackColor: "#D8EDE3",
    badgeBg: "#E4F4EA",
    transformationChar: "祿",
    metrics: [
      { label: "Abundance", value: 85 },
      { label: "Flow", value: 70 },
      { label: "Ease", value: 60 },
    ],
  },
  "化權": {
    heroQuestionPrefix: "WHERE DOES ",
    heroQuestionHighlight: "POWER",
    heroQuestionSuffix: " RISE?",
    icon: Crown,
    accentColor: "#1D63B8",
    cardBg: "#F2F7FD",
    barTrackColor: "#DCE9F8",
    badgeBg: "#E3EEF8",
    transformationChar: "權",
    metrics: [
      { label: "Authority", value: 90 },
      { label: "Drive", value: 75 },
      { label: "Control", value: 65 },
    ],
  },
  "化科": {
    heroQuestionPrefix: "WHERE DOES YOUR ",
    heroQuestionHighlight: "FAME",
    heroQuestionSuffix: " RISE?",
    icon: Star,
    accentColor: "#D97706",
    cardBg: "#FFF8F0",
    barTrackColor: "#FCEBD5",
    badgeBg: "#FEF0DC",
    transformationChar: "科",
    metrics: [
      { label: "Reputation", value: 85 },
      { label: "Visibility", value: 70 },
      { label: "Recognition", value: 60 },
    ],
  },
  "化忌": {
    heroQuestionPrefix: "WHERE IS ",
    heroQuestionHighlight: "ENERGY",
    heroQuestionSuffix: " BLOCKED?",
    icon: AlertTriangle,
    accentColor: "#DC2626",
    cardBg: "#FEF5F5",
    barTrackColor: "#FCE0E0",
    badgeBg: "#FCE8E8",
    transformationChar: "忌",
    metrics: [
      { label: "Blockage", value: 80 },
      { label: "Resistance", value: 65 },
      { label: "Challenge", value: 55 },
    ],
  },
};

const normaliseTransformation = (transformation: string): string => {
  if (transformation === "化禄") {
    return "化祿";
  }
  if (transformation === "化权") {
    return "化權";
  }
  return transformation;
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

type MetricBarRowProps = {
  label: string;
  value: number;
  accentColor: string;
  trackColor: string;
};

/**
 * Single labeled progress bar with percentage.
 */
const MetricBarRow: React.FC<MetricBarRowProps> = ({
  label,
  value,
  accentColor,
  trackColor,
}) => (
  <div className="flex items-center gap-3">
    <span className="w-[5.5rem] shrink-0 text-xs text-theme-fg-secondary">{label}</span>
    <div
      className="h-2 min-w-0 flex-1 overflow-hidden rounded-full"
      style={{ backgroundColor: trackColor }}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${value}%`, backgroundColor: accentColor }}
      />
    </div>
    <span
      className="w-9 shrink-0 text-right text-xs font-semibold"
      style={{ color: accentColor }}
    >
      {value}%
    </span>
  </div>
);

type DestinyAlertCardProps = {
  alert: PalaceAlertData;
  config: TransformationConfig;
  displayPalace: string;
  pdfPageBreakBefore?: boolean;
};

/**
 * Single destiny alert signal card — hero question, metrics, insight copy.
 */
const DestinyAlertCard: React.FC<DestinyAlertCardProps> = ({
  alert,
  config,
  displayPalace,
  pdfPageBreakBefore,
}) => {
  const HeaderIcon = config.icon;

  return (
    <article
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className="relative overflow-hidden rounded-2xl border p-5 shadow-sm sm:p-6"
      style={{
        borderColor: `${config.accentColor}22`,
        backgroundColor: config.cardBg,
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-3 right-3 select-none font-serif text-[5rem] font-black leading-none sm:bottom-4 sm:right-4 sm:text-[5.5rem]"
        style={{
          color: config.accentColor,
          opacity: 0.07,
        }}
      >
        {config.transformationChar}
      </div>

      <div className="relative z-10">
        <div className="flex items-start gap-3">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm"
            style={{ backgroundColor: config.accentColor }}
          >
            <HeaderIcon className="h-5 w-5 text-white" aria-hidden="true" />
          </div>

          <p className="min-w-0 flex-1 pt-0.5 text-[11px] font-bold uppercase leading-snug tracking-[0.12em] text-navy dark:text-cream sm:text-xs">
            {config.heroQuestionPrefix}
            <span style={{ color: config.accentColor }}>{config.heroQuestionHighlight}</span>
            {config.heroQuestionSuffix}
          </p>

          <Sparkles
            className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent-gradient-5)]/55"
            aria-hidden="true"
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-theme-fg-secondary/80">
            Activates
          </p>
          <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
            style={{
              color: config.accentColor,
              backgroundColor: config.badgeBg,
            }}
          >
            <User className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {getStarPinyin(alert.starName)}
          </span>
        </div>

        <h3
          className="mt-2 font-serif text-2xl font-bold leading-tight sm:text-[1.65rem]"
          style={{ color: config.accentColor }}
        >
          {displayPalace}
        </h3>

        <div className="mt-5 space-y-3">
          {config.metrics.map((metric) => (
            <MetricBarRow
              key={metric.label}
              label={metric.label}
              value={metric.value}
              accentColor={config.accentColor}
              trackColor={config.barTrackColor}
            />
          ))}
        </div>

        <div className="mt-5 space-y-2 text-sm leading-relaxed text-theme-fg-secondary">
          <p>{alert.line1}</p>
          <p>{alert.line2}</p>
          <p className="font-bold italic" style={{ color: config.accentColor }}>
            {alert.line3}
          </p>
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
        <AnalysisSectionHeader
          sectionLabel="Transformation signals"
          badgeText="05"
          title="Destiny Alert Map"
          subtitle="Four signals showing where your life force is most activated — wealth, power, fame, and friction."
          icon={Compass}
          pdfBreakAnchor="destiny-alert-hero"
          forPdfCapture={forPdfCapture}
        />
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
          ? "grid grid-cols-1 gap-6"
          : "grid grid-cols-1 gap-6 sm:grid-cols-2"
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
            pdfPageBreakBefore={Boolean(forPdfCapture && index === 2)}
          />
        );
      })}
    </div>
  );
};

export default FourKeyPalace;
