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

type OrbitPill = {
  key: string;
  label: string;
  variant: "trait" | "element";
};

const ORBIT_RADIUS_PX = 132;

/**
 * Evenly spaces pills in a ring around the zodiac icon.
 */
const getOrbitPositionStyle = (index: number, total: number): React.CSSProperties => {
  const angle = (index / total) * 2 * Math.PI - Math.PI / 2;
  const x = Math.cos(angle) * ORBIT_RADIUS_PX;
  const y = Math.sin(angle) * ORBIT_RADIUS_PX;
  return {
    left: "50%",
    top: "50%",
    transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
  };
};

const buildOrbitPills = (traits: string[], element: string): OrbitPill[] => [
  ...traits.map((trait) => ({ key: trait, label: trait, variant: "trait" as const })),
  { key: "element", label: `${element} element`, variant: "element" as const },
];

type ZodiacIdentityClusterProps = {
  zodiacInsights: ZodiacInsights;
  ZodiacIcon: React.ElementType | undefined;
  forPdfCapture?: boolean;
};

const ORBIT_PILL_BASE_CLASS = [
  "inline-block cursor-default whitespace-nowrap rounded-full border px-3 py-1",
  "text-xs font-semibold shadow-sm",
  "transition-[transform,box-shadow,border-color,background-color] duration-300 ease-out",
  "motion-safe:hover:scale-110 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5",
].join(" ");

const getOrbitPillClassName = (
  variant: OrbitPill["variant"],
  forPdfCapture?: boolean
): string => {
  const floatClass = forPdfCapture
    ? ""
    : "motion-safe:animate-zodiac-pill-float motion-safe:hover:animate-none";

  if (variant === "element") {
    return [
      ORBIT_PILL_BASE_CLASS,
      floatClass,
      "border-accent-gold/50 bg-surface-cream text-brand-purple",
      "motion-safe:hover:border-accent-gold motion-safe:hover:bg-surface-elevated",
      "dark:border-accent-gold/40 dark:bg-surface-dark dark:text-accent-gold",
      "dark:motion-safe:hover:border-accent-gold dark:motion-safe:hover:bg-surface-darkElevated",
    ].join(" ");
  }

  return [
    ORBIT_PILL_BASE_CLASS,
    floatClass,
    "border-brand-purple/25 bg-surface-cream/95 text-brand-purple",
    "motion-safe:hover:border-brand-purple/50 motion-safe:hover:bg-surface-elevated",
    "dark:border-accent-gold/30 dark:bg-surface-dark/95 dark:text-accent-gold",
    "dark:motion-safe:hover:border-accent-gold/55 dark:motion-safe:hover:bg-surface-darkElevated",
  ].join(" ");
};

/**
 * Centered zodiac icon with trait/element pills orbiting; name block below.
 */
const ZodiacIdentityCluster: React.FC<ZodiacIdentityClusterProps> = ({
  zodiacInsights,
  ZodiacIcon,
  forPdfCapture,
}) => {
  const orbitPills = buildOrbitPills(zodiacInsights.coreTraits, zodiacInsights.element);

  return (
    <article aria-label="Nobleman zodiac identity">
      <div className="mx-auto flex w-full max-w-md flex-col items-center">
        <h3 className="mb-3 flex flex-wrap items-baseline justify-center gap-x-2 text-center font-serif text-3xl font-bold text-navy dark:text-cream sm:text-4xl">
          <span>The {zodiacInsights.zodiac}</span>
          <span>{zodiacInsights.zodiacChinese}</span>
        </h3>
        <div className="relative mx-auto h-[min(22rem,72vw)] w-[min(22rem,72vw)] max-h-80 max-w-80">
          {orbitPills.map((pill, index) => {
            const orbitStyle = getOrbitPositionStyle(index, orbitPills.length);
            const floatStyle: React.CSSProperties | undefined = forPdfCapture
              ? undefined
              : {
                  animationDelay: `${index * 0.55}s`,
                  animationDuration: `${3.2 + (index % 3) * 0.35}s`,
                };

            return (
              <div
                key={pill.key}
                className="absolute left-1/2 top-1/2 z-0 hover:z-20"
                style={orbitStyle}
              >
                <span
                  className={getOrbitPillClassName(pill.variant, forPdfCapture)}
                  style={floatStyle}
                >
                  {pill.label}
                </span>
              </div>
            );
          })}

          {ZodiacIcon ? (
            <div className="absolute left-1/2 top-1/2 z-10 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-brand-purple/30 bg-gradient-to-br from-brand-purple to-[#8B6FC8] p-4 shadow-md dark:border-accent-gold/40 dark:from-brand-purple/90 dark:to-brand-purple/70 sm:h-28 sm:w-28 sm:p-5">
              <ZodiacIconWrapper
                Icon={ZodiacIcon}
                className="h-full w-full"
                invertToWhite
              />
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
};

/**
 * Subsection header — editorial left accent, serif title, subtitle.
 */
const ZodiacSubsectionHeader: React.FC<{
  title: string;
  subtitle: string;
}> = ({ title, subtitle }) => (
  <div className="border-l-4 border-brand-purple pl-4 dark:border-accent-goldDark/70">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
      Nobleman deep dive
    </p>
    <h2 className="mt-1 font-serif text-2xl font-bold text-navy dark:text-cream sm:text-3xl">
      {title}
    </h2>
    <p className="mt-2 text-sm leading-relaxed text-theme-fg-secondary sm:text-base">
      {subtitle}
    </p>
  </div>
);

type GuidanceCardVariant = "recognize" | "motivate" | "approach" | "watch";

type GuidanceTheme = {
  badgeBg: string;
  bulletBg: string;
};

const GUIDANCE_THEMES: Record<GuidanceCardVariant, GuidanceTheme> = {
  recognize: {
    badgeBg: "#7B5FC4",
    bulletBg: "#7B5FC4",
  },
  motivate: {
    badgeBg: "#3F7BB8",
    bulletBg: "#3F7BB8",
  },
  approach: {
    badgeBg: "#3F8F62",
    bulletBg: "#3F8F62",
  },
  watch: {
    badgeBg: "var(--color-accent-gradient-5)",
    bulletBg: "var(--color-accent-gradient-5)",
  },
};

export const ZodiacInsightsSection: React.FC<ZodiacInsightsSectionProps> = ({
  zodiacInsights,
  noblemanZodiac,
  forPdfCapture,
}) => {
  const zodiacKey = noblemanZodiac.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];

  return (
    <section
      className="mb-8 px-6"
      data-pdf-break-anchor="zodiac-insights"
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
    >
      <div className="space-y-8">
        <ZodiacSubsectionHeader
          title="Zodiac Insights"
          subtitle={`Understanding your ${noblemanZodiac} nobleman`}
        />

        <ZodiacIdentityCluster
          zodiacInsights={zodiacInsights}
          ZodiacIcon={ZodiacIcon}
          forPdfCapture={forPdfCapture}
        />

        {/* Practical guidance grid */}
        <div
          className={
            forPdfCapture
              ? "grid grid-cols-2 gap-5"
              : "grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
          }
        >
          <GuidanceCard
            title="How to Recognize"
            icon={Eye}
            items={zodiacInsights.recognitionSigns}
            variant="recognize"
            forPdfCapture={forPdfCapture}
          />
          <GuidanceCard
            title="What Motivates"
            icon={Target}
            items={zodiacInsights.motivations}
            variant="motivate"
            forPdfCapture={forPdfCapture}
          />
          <GuidanceCard
            title="Best Approach"
            icon={Handshake}
            items={zodiacInsights.approachStrategies}
            variant="approach"
            pdfPageBreakBefore={forPdfCapture}
            forPdfCapture={forPdfCapture}
          />
          <GuidanceCard
            title="Watch Out For"
            icon={TriangleAlert}
            items={zodiacInsights.watchOuts}
            variant="watch"
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
  items: string[];
  variant: GuidanceCardVariant;
  pdfPageBreakBefore?: boolean;
  forPdfCapture?: boolean;
}> = ({ title, icon, items, variant, pdfPageBreakBefore, forPdfCapture }) => {
  const IconComponent = icon;
  const theme = GUIDANCE_THEMES[variant];
  const hoverClass = forPdfCapture
    ? ""
    : "transition-shadow duration-300 hover:shadow-md";

  return (
    <article
      {...(pdfPageBreakBefore ? { "data-pdf-page-break-before": "" } : {})}
      className={`flex h-full flex-col rounded-2xl border border-theme-border-subtle bg-white p-5 shadow-sm dark:border-theme-border-strong dark:bg-surface-elevated/90 sm:p-6 ${hoverClass}`}
    >
      <div className="mb-5 flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white shadow-sm"
          style={{ backgroundColor: theme.badgeBg }}
        >
          <IconComponent className="h-5 w-5" aria-hidden="true" />
        </div>
        <h4 className="min-w-0 flex-1 font-serif text-lg font-bold leading-snug text-navy dark:text-cream sm:text-xl">
          {title}
        </h4>
        <div className="hidden shrink-0 items-center gap-2 sm:flex" aria-hidden="true">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-[var(--color-accent-gradient-5)]/40 to-transparent" />
          <Sparkles className="h-3 w-3 text-[var(--color-accent-gradient-5)]/60" />
        </div>
      </div>

      <ul className="space-y-3">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span
              className="mt-2 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: theme.bulletBg }}
              aria-hidden="true"
            />
            <span className="text-sm font-medium leading-relaxed text-theme-fg-secondary sm:text-[15px]">
              {item}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
};

export default ZodiacInsightsSection;
