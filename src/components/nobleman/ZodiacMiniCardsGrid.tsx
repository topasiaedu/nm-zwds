/**
 * Quick reference zodiacs for other life areas — subsection under Nobleman Analysis.
 */

import React from "react";
import { LayoutGrid } from "lucide-react";
import type { ZodiacMiniData } from "../../utils/nobleman";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacMiniCardsGridProps {
  miniData: ZodiacMiniData[];
  forPdfCapture?: boolean;
}

const GRADIENT_ACCENT: Record<string, { from: string; to: string }> = {
  "from-blue-500 to-cyan-500": { from: "#3b82f6", to: "#06b6d4" },
  "from-amber-800 to-orange-800": { from: "#d97706", to: "#f59e0b" },
  "from-green-500 to-emerald-500": { from: "#22c55e", to: "#10b981" },
  "from-purple-500 to-pink-500": { from: "#a855f7", to: "#ec4899" },
};

const DEFAULT_ACCENT = { from: "#6b7280", to: "#4b5563" };

export const ZodiacMiniCardsGrid: React.FC<ZodiacMiniCardsGridProps> = ({
  miniData,
  forPdfCapture,
}) => {
  if (miniData.length === 0) {
    return null;
  }

  const hoverClass = forPdfCapture
    ? ""
    : "transition-all duration-300 hover:shadow-md hover:-translate-y-0.5";

  return (
    <section
      className="mb-8 px-6"
      data-pdf-break-anchor="zodiac-mini-cards"
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
    >
      <div className="mb-6 border-t border-gray-200 pt-8 dark:border-gray-700">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
            <LayoutGrid className="h-5 w-5 text-white" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
              Quick reference
            </p>
            <h3 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">
              Other Life Area Nobleman
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
              Zodiac personalities supporting different aspects of your life
            </p>
          </div>
        </div>
      </div>

      <div
        className={
          forPdfCapture
            ? "grid grid-cols-2 gap-4"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {miniData.map((mini) => (
          <ZodiacMiniCard
            key={mini.area}
            miniData={mini}
            hoverClass={hoverClass}
            forPdfCapture={forPdfCapture}
          />
        ))}
      </div>
    </section>
  );
};

const ZodiacMiniCard: React.FC<{
  miniData: ZodiacMiniData;
  hoverClass: string;
  forPdfCapture?: boolean;
}> = ({ miniData, hoverClass }) => {
  const zodiacKey = miniData.zodiac.toLowerCase() as keyof typeof ZodiacIcons;
  const ZodiacIcon = ZodiacIcons[zodiacKey];
  const accent = GRADIENT_ACCENT[miniData.gradient] ?? DEFAULT_ACCENT;

  return (
    <article
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${hoverClass}`}
      style={{ borderLeftWidth: "4px", borderLeftColor: accent.from }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {ZodiacIcon ? (
            <div
              className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl p-2 shadow-sm"
              style={{
                background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
              }}
            >
              <ZodiacIconWrapper
                Icon={ZodiacIcon}
                className="h-full w-full"
                invertToWhite
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: accent.from }}
            >
              {miniData.area}
            </p>
            <p className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
              {miniData.zodiac}{" "}
              <span className="text-base font-medium text-gray-500 dark:text-gray-400">
                {miniData.zodiacChinese}
              </span>
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-3 dark:border-gray-700">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Core traits
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {miniData.coreTraits.map((trait) => (
              <span
                key={trait}
                className="rounded-md px-2 py-0.5 text-xs font-medium text-gray-700 dark:text-gray-200"
                style={{
                  backgroundColor: `${accent.from}18`,
                  border: `1px solid ${accent.from}33`,
                }}
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
            Quick tip
          </p>
          <p className="mt-1 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
            {miniData.recognitionSummary}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ZodiacMiniCardsGrid;
