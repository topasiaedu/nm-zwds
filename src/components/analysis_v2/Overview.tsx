import React from "react";
import {
  AlertCircle,
  Brain,
  Check,
  Dumbbell,
  Lightbulb,
  Sparkles,
  Sprout,
  Zap,
} from "lucide-react";
import { ChartData } from "../../utils/zwds/types";
import {
  analyzeOverview,
  OverviewAnalysisResult,
} from "../../utils/zwds/analysis/overviewAnalysis";
import { pdfCaptureNumericBadgeStyle } from "./shared/pdfCaptureNumericBadgeStyle";

/**
 * Type definition for a feature item to be displayed in lists
 */
type FeatureItem = {
  id: string;
  label: string;
};

/**
 * Type definition for the features section data
 */
type FeaturesData = {
  strengths: FeatureItem[];
  weaknesses: FeatureItem[];
  tips: FeatureItem[];
};

/**
 * Props for the Overview component
 */
type OverviewProps = {
  chartData: ChartData;
  /** Optional physical palace number (1–12) for timeframe-based analysis. */
  palaceOverride?: number;
  /** Static mode for PDF capture. */
  forPdfCapture?: boolean;
};

type PersonalityBlueprintHeroProps = {
  forPdfCapture?: boolean;
};

/**
 * Eye-catching section hero so users immediately know which report block they are in.
 */
const PersonalityBlueprintHero: React.FC<PersonalityBlueprintHeroProps> = ({
  forPdfCapture,
}) => {
  return (
    <div
      data-pdf-break-anchor="overview-hero"
      className="relative mb-10 overflow-hidden rounded-3xl border-2 border-brand-purple/25 shadow-2xl dark:border-accent-gold/70 dark:shadow-[0_12px_48px_rgba(251,146,60,0.28)] dark:ring-2 dark:ring-accent-gold/40"
    >
      {/* Light: purple/indigo hero. Dark: warm orange-gold so it pops off the purple page. */}
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
      <div
        className="absolute -bottom-12 -left-6 h-40 w-40 rounded-full bg-indigo-400/25 blur-3xl dark:bg-orange-400/20"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-10 sm:py-12">
        <div className="flex-1 min-w-0">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-accent-gold" aria-hidden="true" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/90">
              Section 01
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
              01
            </span>
            <h2 className="text-3xl font-black uppercase tracking-tight text-white sm:text-4xl">
              Personality Blueprint
            </h2>
          </div>

          <p className="mt-4 max-w-2xl text-base font-medium leading-relaxed text-white/90 sm:text-lg">
            Discover your core strengths, challenges, and strategic growth
            opportunities
          </p>
        </div>

        <div
          className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg sm:h-24 sm:w-24 ${
            forPdfCapture ? "" : "backdrop-blur-md"
          }`}
        >
          <Brain className="h-10 w-10 text-white sm:h-12 sm:w-12" aria-hidden="true" />
        </div>
      </div>

      <div
        className="relative z-10 h-1.5 bg-gradient-to-r from-accent-goldDark via-accent-coralDark to-indigo-400 dark:from-amber-200 dark:via-white dark:to-amber-100"
        aria-hidden="true"
      />
    </div>
  );
};

/**
 * Overview component displaying personality analysis with a hero header and varied layouts
 */
const Overview: React.FC<OverviewProps> = ({
  chartData,
  palaceOverride,
  forPdfCapture,
}) => {
  const analysisResult: OverviewAnalysisResult = analyzeOverview(
    chartData,
    palaceOverride
  );

  const featuresData: FeaturesData = {
    strengths: analysisResult.strengths.map((strength, index) => ({
      id: `strength-${index + 1}`,
      label: strength,
    })),
    weaknesses: analysisResult.weaknesses.map((weakness, index) => ({
      id: `weakness-${index + 1}`,
      label: weakness,
    })),
    tips: analysisResult.quotes.map((quote, index) => ({
      id: `tip-${index + 1}`,
      label: quote,
    })),
  };

  const hoverClass = forPdfCapture ? "" : "transition-all duration-300 hover:shadow-lg";

  return (
    <div className="p-6">
      <PersonalityBlueprintHero forPdfCapture={forPdfCapture} />

      {/* Core personality — editorial narrative block */}
      <section
        data-pdf-break-anchor="overview-core-personality"
        className={`relative mb-10 overflow-hidden rounded-2xl border border-brand-purple/15 bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/50 p-8 dark:border-brand-purple/30 dark:from-indigo-950/40 dark:via-gray-800 dark:to-purple-950/30 ${forPdfCapture ? "break-inside-avoid-page" : ""} ${hoverClass}`}
      >
        <div
          className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-brand-purple/5 dark:bg-brand-purple/15"
          aria-hidden="true"
        />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple to-indigo-600 shadow-lg">
            <Brain className="h-7 w-7 text-white" aria-hidden="true" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-purple dark:text-accent-gold">
              Foundation
            </p>
            <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
              Your Core Personality
            </h3>
            {analysisResult.descriptions.length > 0 ? (
              <div className="mt-5 space-y-4 border-l-4 border-brand-purple/40 pl-5 dark:border-accent-goldDark/50">
                {analysisResult.descriptions.map((description, index) => (
                  <p
                    key={`description-${index}`}
                    className={
                      index === 0
                        ? "text-base font-medium leading-relaxed text-gray-900 dark:text-white sm:text-lg"
                        : "text-sm leading-relaxed text-gray-700 dark:text-gray-300"
                    }
                  >
                    {description}
                  </p>
                ))}
              </div>
            ) : (
              <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                No analysis data available for the stars in your life palace.
                Please ensure your chart data is properly calculated.
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Strengths & challenges — contrasting split panels with icon lists */}
      <section
        data-pdf-break-anchor="overview-strengths-challenges"
        {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
        className={`mb-10 grid gap-6 ${
          forPdfCapture ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-2"
        }`}
      >
        <div
          className={`flex h-full flex-col overflow-hidden rounded-2xl border border-emerald-200/80 dark:border-emerald-800 ${hoverClass}`}
        >
          <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Dumbbell className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-emerald-100">
                What powers you
              </p>
              <h3 className="text-lg font-bold text-white">Strengths</h3>
            </div>
          </div>
          <ul className="flex flex-1 flex-col space-y-3 bg-emerald-50/90 p-6 dark:bg-gray-800">
            {featuresData.strengths.length > 0 ? (
              featuresData.strengths.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-emerald-500 shadow-sm">
                    <Check className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">
                    {item.label}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600 dark:text-gray-400">
                No strength data available
              </li>
            )}
          </ul>
        </div>

        <div
          className={`flex h-full flex-col overflow-hidden rounded-2xl border border-amber-200/80 dark:border-amber-800 ${hoverClass}`}
        >
          <div className="flex shrink-0 items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
              <Zap className="h-5 w-5 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-amber-100">
                Watch these patterns
              </p>
              <h3 className="text-lg font-bold text-white">Potential Challenges</h3>
            </div>
          </div>
          <ul className="flex flex-1 flex-col space-y-3 bg-amber-50/90 p-6 dark:bg-gray-800">
            {featuresData.weaknesses.length > 0 ? (
              featuresData.weaknesses.map((item) => (
                <li key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-amber-500 shadow-sm">
                    <AlertCircle
                      className="h-3.5 w-3.5 text-white"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-100">
                    {item.label}
                  </span>
                </li>
              ))
            ) : (
              <li className="text-sm text-gray-600 dark:text-gray-400">
                No challenge data available
              </li>
            )}
          </ul>
        </div>
      </section>

      {/* Growth tips — numbered timeline */}
      <section
        data-pdf-break-anchor="overview-growth-tips"
        className={`rounded-2xl border border-teal-200/60 bg-white p-8 dark:border-teal-900/50 dark:bg-gray-800 ${hoverClass}`}
      >
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md">
              <Sprout className="h-6 w-6 text-white" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-teal-700 dark:text-teal-300">
                Action path
              </p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                Growth Tips
              </h3>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800 dark:bg-teal-900/40 dark:text-teal-200">
            <Lightbulb className="h-3.5 w-3.5" aria-hidden="true" />
            Practical next steps
          </div>
        </div>

        {featuresData.tips.length > 0 ? (
          <ol className="relative space-y-0">
            {featuresData.tips.map((item, index) => (
              <li key={item.id} className="relative flex gap-5 pb-8 last:pb-0">
                {index < featuresData.tips.length - 1 ? (
                  <div
                    className="absolute left-[17px] top-10 bottom-0 w-0.5 bg-gradient-to-b from-teal-400 to-indigo-300 dark:from-teal-600 dark:to-indigo-700"
                    aria-hidden="true"
                  />
                ) : null}
                <span className="relative z-10 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-500 to-emerald-600 text-sm font-bold text-white shadow-md">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1 rounded-xl border border-teal-100 bg-gradient-to-br from-teal-50/50 to-white p-4 dark:border-teal-900/40 dark:from-teal-950/20 dark:to-gray-800/80">
                  <p className="text-sm font-medium leading-relaxed text-gray-800 dark:text-gray-200">
                    {item.label}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        ) : (
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            No tip data available
          </p>
        )}
      </section>
    </div>
  );
};

export default Overview;
