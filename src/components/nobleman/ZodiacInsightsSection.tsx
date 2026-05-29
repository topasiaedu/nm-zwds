/**
 * Zodiac Insights — subsection under Nobleman Analysis.
 * Personality insights for the main nobleman zodiac + practical guidance grid.
 */

import React from "react";
import { Eye, Handshake, Sparkles, Target, TriangleAlert, type LucideIcon } from "lucide-react";
import type { ZodiacInsights } from "../../constants/zodiacProfiles";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacInsightsSectionProps {
  zodiacInsights: ZodiacInsights;
  noblemanZodiac: string;
  forPdfCapture?: boolean;
}

type GuidanceAccent = {
  from: string;
  to: string;
};

const GUIDANCE_ACCENTS: Record<string, GuidanceAccent> = {
  blue: { from: "#2563eb", to: "#0891b2" },
  green: { from: "#16a34a", to: "#059669" },
  purple: { from: "#9333ea", to: "#db2777" },
  amber: { from: "#d97706", to: "#ea580c" },
};

/**
 * Subsection divider + title (not a main numbered section hero).
 */
const ZodiacSubsectionHeader: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => (
  <div className="mb-8 border-t border-gray-200 pt-8 dark:border-gray-700">
    <div className="flex items-start gap-4">
      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-md">
        <Sparkles className="h-5 w-5 text-white" aria-hidden="true" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-indigo-700 dark:text-indigo-300">
          Nobleman deep dive
        </p>
        <h2 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
      </div>
    </div>
  </div>
);

export const ZodiacInsightsSection: React.FC<ZodiacInsightsSectionProps> = ({
  zodiacInsights,
  noblemanZodiac,
  forPdfCapture,
}) => {
  const zodiacKey = noblemanZodiac.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];
  const hoverClass = forPdfCapture ? "" : "transition-shadow duration-300 hover:shadow-md";

  return (
    <section
      className="mb-8 px-6"
      data-pdf-break-anchor="zodiac-insights"
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
    >
      <ZodiacSubsectionHeader
        title="Zodiac Insights"
        subtitle={`Understanding your ${noblemanZodiac} nobleman`}
      />

      {/* Zodiac identity — clean card (no full-width purple gradient banner) */}
      <article
        className={`mb-8 overflow-hidden rounded-2xl border border-indigo-200/60 bg-white shadow-md dark:border-indigo-900/50 dark:bg-gray-800 ${hoverClass}`}
      >
        <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-center sm:p-8">
          {ZodiacIcon ? (
            <div className="flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-100 to-violet-100 p-5 dark:from-indigo-950/60 dark:to-violet-950/40 sm:h-32 sm:w-32">
              <ZodiacIconWrapper
                Icon={ZodiacIcon}
                className="h-full w-full text-indigo-700 dark:text-indigo-200"
              />
            </div>
          ) : null}

          <div className="min-w-0 flex-1 text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              Nobleman zodiac
            </p>
            <h3 className="mt-1 text-3xl font-black text-gray-900 dark:text-white sm:text-4xl">
              The {zodiacInsights.zodiac}
            </h3>
            <p className="mt-1 text-xl text-gray-500 dark:text-gray-400">
              {zodiacInsights.zodiacChinese}
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              {zodiacInsights.coreTraits.map((trait) => (
                <span
                  key={trait}
                  className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-medium text-indigo-800 dark:border-indigo-800 dark:bg-indigo-950/50 dark:text-indigo-200"
                >
                  {trait}
                </span>
              ))}
            </div>

            <div className="mt-4 inline-flex items-center rounded-full bg-violet-100 px-3 py-1 text-xs font-semibold text-violet-800 dark:bg-violet-950/50 dark:text-violet-200">
              {zodiacInsights.element} element
            </div>
          </div>
        </div>
      </article>

      {/* Practical guidance — accent tiles (same colors, new layout) */}
      <div className="mb-2">
        <p className="mb-4 text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
          How to work with this energy
        </p>
        <div
          className={
            forPdfCapture
              ? "grid grid-cols-2 gap-4"
              : "grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4"
          }
        >
          <GuidanceCard
            title="How to Recognize"
            icon={Eye}
            gradientKey="blue"
            items={zodiacInsights.recognitionSigns}
            forPdfCapture={forPdfCapture}
          />
          <GuidanceCard
            title="What Motivates"
            icon={Target}
            gradientKey="green"
            items={zodiacInsights.motivations}
            forPdfCapture={forPdfCapture}
          />
          <GuidanceCard
            title="Best Approach"
            icon={Handshake}
            gradientKey="purple"
            items={zodiacInsights.approachStrategies}
            pdfPageBreakBefore={forPdfCapture}
            forPdfCapture={forPdfCapture}
          />
          <GuidanceCard
            title="Watch Out For"
            icon={TriangleAlert}
            gradientKey="amber"
            items={zodiacInsights.watchOuts}
            forPdfCapture={forPdfCapture}
          />
        </div>
      </div>
    </section>
  );
};

const GuidanceCard: React.FC<{
  title: string;
  icon: LucideIcon;
  gradientKey: string;
  items: string[];
  pdfPageBreakBefore?: boolean;
  forPdfCapture?: boolean;
}> = ({ title, icon, gradientKey, items, pdfPageBreakBefore, forPdfCapture }) => {
  const IconComponent = icon;
  const accent = GUIDANCE_ACCENTS[gradientKey] ?? { from: "#6b7280", to: "#4b5563" };
  const hoverClass = forPdfCapture ? "" : "hover:shadow-md";

  return (
    <div
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${hoverClass}`}
      style={{ borderLeftWidth: "4px", borderLeftColor: accent.from }}
    >
      <div className="p-4">
        <div className="mb-3 flex items-center gap-3">
          <div
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
            style={{
              background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
            }}
          >
            <IconComponent className="h-4 w-4" aria-hidden="true" />
          </div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white">{title}</h4>
        </div>
        <ul className="space-y-2">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="flex items-start gap-2 text-sm leading-relaxed text-gray-700 dark:text-gray-300"
            >
              <span
                className="mt-2 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: accent.from }}
                aria-hidden="true"
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ZodiacInsightsSection;
