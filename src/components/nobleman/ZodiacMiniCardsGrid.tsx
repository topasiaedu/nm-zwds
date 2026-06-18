/**
 * Quick reference zodiacs for other life areas — subsection under Nobleman Analysis.
 */

import React from "react";
import { Lightbulb } from "lucide-react";
import type { ZodiacMiniData } from "../../utils/nobleman";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacMiniCardsGridProps {
  miniData: ZodiacMiniData[];
  forPdfCapture?: boolean;
}

type LifeAreaTheme = {
  headerFrom: string;
  headerTo: string;
  accent: string;
  traitBg: string;
  traitText: string;
};

const LIFE_AREA_THEMES: Record<string, LifeAreaTheme> = {
  "from-purple-500 to-pink-500": {
    headerFrom: "#8B6FC8",
    headerTo: "#A67ED9",
    accent: "#7B5FC4",
    traitBg: "#EDE8F5",
    traitText: "#5C4A8A",
  },
  "from-blue-500 to-cyan-500": {
    headerFrom: "#4F8FD4",
    headerTo: "#6BAADC",
    accent: "#3F7BB8",
    traitBg: "#E3EEF8",
    traitText: "#2E5F8F",
  },
  "from-green-500 to-emerald-500": {
    headerFrom: "#4F9F72",
    headerTo: "#6BB892",
    accent: "#3F8F62",
    traitBg: "#E0F0E8",
    traitText: "#2D6B4A",
  },
};

const DEFAULT_LIFE_AREA_THEME: LifeAreaTheme = {
  headerFrom: "#6B5B95",
  headerTo: "#8B7BA8",
  accent: "#6B5B95",
  traitBg: "#EDE8F5",
  traitText: "#6B5B95",
};

const getLifeAreaTheme = (gradient: string): LifeAreaTheme =>
  LIFE_AREA_THEMES[gradient] ?? DEFAULT_LIFE_AREA_THEME;

/**
 * Editorial subsection header — left accent bar, serif title.
 */
const ZodiacMiniSubsectionHeader: React.FC = () => (
  <div className="border-l-4 border-brand-purple pl-4 dark:border-accent-goldDark/70">
    <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
      Quick reference
    </p>
    <h2 className="mt-1 font-serif text-2xl font-bold text-navy dark:text-cream sm:text-3xl">
      Other Life Area Nobleman
    </h2>
    <p className="mt-2 text-sm leading-relaxed text-theme-fg-secondary sm:text-base">
      Zodiac personalities supporting different aspects of your life
    </p>
  </div>
);

type ZodiacMiniCardProps = {
  miniData: ZodiacMiniData;
  forPdfCapture?: boolean;
};

/**
 * Compact zodiac card — gradient life-area header + traits and quick tip body.
 */
const ZodiacMiniCard: React.FC<ZodiacMiniCardProps> = ({ miniData, forPdfCapture }) => {
  const theme = getLifeAreaTheme(miniData.gradient);
  const zodiacKey = miniData.zodiac.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];
  const hoverClass = forPdfCapture
    ? ""
    : "transition-shadow duration-300 hover:shadow-md";

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-theme-border-subtle bg-white shadow-sm dark:border-theme-border-strong dark:bg-surface-elevated/90 ${hoverClass}`}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${theme.headerFrom}, ${theme.headerTo})`,
        }}
      >
        <p className="min-w-0 font-serif text-base font-bold leading-tight text-white sm:text-lg">
          {miniData.area}
        </p>
        {ZodiacIcon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15 p-1.5">
            <ZodiacIconWrapper
              Icon={ZodiacIcon}
              className="h-full w-full"
              invertToWhite
            />
          </div>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-xl font-bold text-navy dark:text-cream sm:text-2xl">
          {miniData.zodiac}{" "}
          <span className="text-lg font-semibold text-theme-fg-secondary sm:text-xl">
            {miniData.zodiacChinese}
          </span>
        </h3>

        <div className="mt-5">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: theme.accent }}
              aria-hidden="true"
            />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: theme.accent }}
            >
              Core Traits
            </p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {miniData.coreTraits.map((trait) => (
              <span
                key={trait}
                className="rounded-full px-3 py-1 text-xs font-semibold"
                style={{ backgroundColor: theme.traitBg, color: theme.traitText }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: theme.accent }}
              aria-hidden="true"
            />
            <p
              className="text-[10px] font-bold uppercase tracking-[0.2em]"
              style={{ color: theme.accent }}
            >
              Quick Tip
            </p>
          </div>
          <div className="mt-3 flex items-start gap-2.5">
            <Lightbulb
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: theme.accent }}
              aria-hidden="true"
            />
            <p className="text-sm leading-relaxed text-theme-fg-secondary">
              {miniData.recognitionSummary}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
};

export const ZodiacMiniCardsGrid: React.FC<ZodiacMiniCardsGridProps> = ({
  miniData,
  forPdfCapture,
}) => {
  if (miniData.length === 0) {
    return null;
  }

  const gridClass = forPdfCapture
    ? "grid grid-cols-2 gap-5"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <section
      className="mb-8 px-6"
      data-pdf-break-anchor="zodiac-mini-cards"
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
    >
      <div className="space-y-8">
        <ZodiacMiniSubsectionHeader />

        <div className={gridClass}>
          {miniData.map((mini) => (
            <ZodiacMiniCard
              key={mini.area}
              miniData={mini}
              forPdfCapture={forPdfCapture}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZodiacMiniCardsGrid;
