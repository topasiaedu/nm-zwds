/**
 * Wealth Code career alignment — paired list cards matching insights layout.
 */

import React from "react";
import { Briefcase, Check, Sparkles } from "lucide-react";
import type { CareerRecommendation } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";

export type WealthCodeCareerPathsProps = {
  idealRoles: CareerRecommendation[];
  nonIdealRoles: CareerRecommendation[];
  forPdfCapture?: boolean;
};

type CareerCardVariant = "ideal" | "reconsider";

type CareerListCardProps = {
  title: string;
  items: CareerRecommendation[];
  variant: CareerCardVariant;
  leadIn: string;
  emptyMessage: string;
};

/**
 * Lowercases the first character for sentence flow after an em dash.
 */
const formatCareerReasonLead = (reason: string): string => {
  if (reason.length === 0) {
    return reason;
  }
  return `${reason.charAt(0).toLowerCase()}${reason.slice(1)}`;
};

/**
 * Formats role + reason into the legacy career copy string.
 */
const formatCareerLine = (leadIn: string, role: string, reason: string): string =>
  `${leadIn} ${role} — ${formatCareerReasonLead(reason)}`;

/**
 * Single white career list card.
 */
const CareerListCard: React.FC<CareerListCardProps> = ({
  title,
  items,
  variant,
  leadIn,
  emptyMessage,
}) => {
  const isIdeal = variant === "ideal";
  const badgeClass = isIdeal
    ? "bg-emerald-600 dark:bg-emerald-500"
    : "bg-[var(--color-accent-gradient-5)]";

  return (
    <article className="rounded-2xl border border-theme-border-subtle bg-white p-6 shadow-sm dark:border-theme-border-strong dark:bg-surface-elevated/90 sm:p-8">
      <div className="mb-6 flex items-center gap-4">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white ${badgeClass}`}
        >
          {isIdeal ? (
            <Briefcase className="h-5 w-5" aria-hidden="true" />
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
          {items.map((item, index) => (
            <li key={`${item.role}-${index}`} className="flex items-start gap-3">
              <span
                className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white ${badgeClass}`}
              >
                {isIdeal ? (
                  <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                ) : (
                  <span className="text-[11px] font-bold leading-none" aria-hidden="true">
                    {"!"}
                  </span>
                )}
              </span>
              <span className="text-sm font-medium leading-relaxed text-theme-fg-secondary sm:text-base">
                {formatCareerLine(leadIn, item.role, item.reason)}
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
 * Side-by-side ideal and reconsider career path cards.
 */
export const WealthCodeCareerPaths: React.FC<WealthCodeCareerPathsProps> = ({
  idealRoles,
  nonIdealRoles,
  forPdfCapture,
}) => {
  const gridClass = forPdfCapture
    ? "grid grid-cols-2 gap-6"
    : "grid grid-cols-1 gap-6 lg:grid-cols-2";

  return (
    <div className={gridClass}>
      {idealRoles.length > 0 ? (
        <CareerListCard
          title="Careers For You"
          items={idealRoles}
          variant="ideal"
          leadIn="Thrive as"
          emptyMessage="No ideal career paths available"
        />
      ) : null}
      {nonIdealRoles.length > 0 ? (
        <div {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}>
          <CareerListCard
            title="Roles to Reconsider"
            items={nonIdealRoles}
            variant="reconsider"
            leadIn="May not suit"
            emptyMessage="No reconsider roles available"
          />
        </div>
      ) : null}
    </div>
  );
};
