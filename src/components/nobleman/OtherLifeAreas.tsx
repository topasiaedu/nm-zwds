/**
 * Other Life Areas Component
 *
 * Displays nobleman information for key life areas in a varied bento-style layout.
 */

import React from "react";
import { Briefcase, Coins, Heart, Home, Lightbulb, Users } from "lucide-react";
import type { OtherAreaData } from "../../types/nobleman";

interface OtherLifeAreasProps {
  /** Array of other area data */
  areas: OtherAreaData[];
  /** Optional: Theme (light/dark) */
  theme?: "light" | "dark";
  /** PDF capture: disable hover motion for stable rasterization. */
  forPdfCapture?: boolean;
}

/**
 * Accent color per gradient key (left border + icon tile).
 */
const GRADIENT_ACCENT: Record<string, { from: string; to: string }> = {
  "from-blue-500 to-cyan-500": { from: "#3b82f6", to: "#06b6d4" },
  "from-amber-800 to-orange-800": { from: "#d97706", to: "#f59e0b" },
  "from-green-500 to-emerald-500": { from: "#22c55e", to: "#10b981" },
  "from-purple-500 to-pink-500": { from: "#a855f7", to: "#ec4899" },
};

const DEFAULT_ACCENT = { from: "#6b7280", to: "#4b5563" };

const getAreaIcon = (objective: string): React.ReactNode => {
  if (objective.includes("Career")) {
    return <Briefcase className="h-5 w-5" aria-hidden="true" />;
  }
  if (objective.includes("Wealth")) {
    return <Coins className="h-5 w-5" aria-hidden="true" />;
  }
  if (objective.includes("Health")) {
    return <Heart className="h-5 w-5" aria-hidden="true" />;
  }
  if (objective.includes("Friend")) {
    return <Users className="h-5 w-5" aria-hidden="true" />;
  }
  return <Lightbulb className="h-5 w-5" aria-hidden="true" />;
};

const OtherLifeAreas: React.FC<OtherLifeAreasProps> = ({
  areas,
  forPdfCapture,
}) => {
  if (areas.length === 0) {
    return null;
  }

  const hoverClass = forPdfCapture
    ? ""
    : "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5";

  return (
    <section
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
      data-pdf-break-anchor="nobleman-other-areas"
      className="mb-8"
    >
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md">
          <Users className="h-5 w-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
            Extended network
          </p>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Other Life Areas
          </h3>
        </div>
      </div>

      <p className="mb-6 text-sm text-gray-600 dark:text-gray-400">
        Nobleman types supporting different aspects of your life beyond your primary
        match.
      </p>

      <div
        className={
          forPdfCapture
            ? "grid grid-cols-2 gap-4"
            : "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
        }
      >
        {areas.map((area) => {
          const accent = GRADIENT_ACCENT[area.gradient] ?? DEFAULT_ACCENT;

          return (
            <article
              key={`${area.objective}-${area.palaceName}`}
              className={`relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 ${hoverClass}`}
              style={{ borderLeftWidth: "4px", borderLeftColor: accent.from }}
            >
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p
                      className="text-xs font-bold uppercase tracking-wide"
                      style={{ color: accent.from }}
                    >
                      {area.objective}
                    </p>
                    <p className="mt-0.5 text-[11px] text-gray-500 dark:text-gray-400">
                      {area.palaceChinese}
                    </p>
                  </div>
                  <div
                    className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl text-white shadow-md"
                    style={{
                      background: `linear-gradient(135deg, ${accent.from}, ${accent.to})`,
                    }}
                  >
                    {getAreaIcon(area.objective)}
                  </div>
                </div>

                <div className="mt-4 border-t border-gray-100 pt-4 dark:border-gray-700">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                    Nobleman type
                  </p>
                  <p className="mt-1 text-base font-bold leading-snug text-gray-900 dark:text-white">
                    {area.noblemanType}
                  </p>
                </div>

                <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                  <Home className="h-3.5 w-3.5 flex-shrink-0" aria-hidden="true" />
                  {area.palaceName}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default OtherLifeAreas;
