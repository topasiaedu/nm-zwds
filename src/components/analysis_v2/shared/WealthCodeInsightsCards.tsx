/**
 * Wealth Code insights — Core Strengths & Areas to Watch list cards.
 */

import React from "react";
import { Check, Plus, Sparkles } from "lucide-react";

export type WealthInsightItem = {
  id: string;
  label: string;
};

export type WealthCodeInsightsCardsProps = {
  strengths: WealthInsightItem[];
  blindSpots: WealthInsightItem[];
  forPdfCapture?: boolean;
};

type InsightListCardProps = {
  title: string;
  items: WealthInsightItem[];
  variant: "strengths" | "watch";
  emptyMessage: string;
};

/**
 * Single white insight card with header icon and vertical list.
 */
const InsightListCard: React.FC<InsightListCardProps> = ({
  title,
  items,
  variant,
  emptyMessage,
}) => {
  const isStrengths = variant === "strengths";
  const badgeClass = isStrengths
    ? "bg-emerald-600 dark:bg-emerald-500"
    : "bg-[var(--color-accent-gradient-5)]";

  return (
    <article className="rounded-2xl border border-theme-border-subtle bg-white p-6 shadow-sm dark:border-theme-border-strong dark:bg-surface-elevated/90 sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${badgeClass}`}
        >
          {isStrengths ? (
            <Plus className="h-5 w-5" aria-hidden="true" />
          ) : (
            <span className="text-base font-bold leading-none" aria-hidden="true">
              {"!"}
            </span>
          )}
        </div>

        <h3 className="min-w-0 flex-1 font-serif text-xl font-bold text-navy dark:text-cream">
          {title}
        </h3>

        <div className="hidden min-w-[3rem] flex-1 items-center gap-2 sm:flex" aria-hidden="true">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--color-accent-gradient-5)]/55 to-transparent" />
          <Sparkles className="h-3.5 w-3.5 shrink-0 text-[var(--color-accent-gradient-5)]" />
        </div>
      </div>

      {items.length > 0 ? (
        <ul className="space-y-4">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${badgeClass}`}
              >
                {isStrengths ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <span className="text-[11px] font-bold leading-none" aria-hidden="true">
                    {"!"}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium leading-relaxed text-theme-fg-secondary sm:text-base">
                {item.label}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-theme-fg-secondary">{emptyMessage}</p>
      )}
    </article>
  );
};

/**
 * Side-by-side wealth insight cards for strengths and blind spots.
 */
export const WealthCodeInsightsCards: React.FC<WealthCodeInsightsCardsProps> = ({
  strengths,
  blindSpots,
  forPdfCapture,
}) => {
  const gridClass = forPdfCapture
    ? "grid grid-cols-2 gap-6"
    : "grid grid-cols-1 gap-6 md:grid-cols-2";

  return (
    <div className={gridClass}>
      {strengths.length > 0 ? (
        <InsightListCard
          title="Core Strengths"
          items={strengths}
          variant="strengths"
          emptyMessage="No strength data available"
        />
      ) : null}
      {blindSpots.length > 0 ? (
        <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
          <InsightListCard
            title="Areas to Watch"
            items={blindSpots}
            variant="watch"
            emptyMessage="No watch patterns available"
          />
        </div>
      ) : null}
    </div>
  );
};
