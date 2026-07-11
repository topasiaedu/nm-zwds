/**
 * Overview strengths & challenges: paired editorial cards (green / coral).
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  Check,
  Dumbbell,
  Leaf,
  Mountain,
  Sparkles,
  Zap,
} from "lucide-react";
import { lightPanelClass } from "../../../styles/chartUi";

export type OverviewTraitItem = {
  id: string;
  label: string;
};

export type OverviewStrengthsChallengesProps = {
  strengths: OverviewTraitItem[];
  weaknesses: OverviewTraitItem[];
  forPdfCapture?: boolean;
};

type TraitCardTheme = {
  cardBorderClass: string;
  cardBgClass: string;
  iconWrapClass: string;
  iconClass: string;
  dividerClass: string;
  pillBorderClass: string;
  pillBgClass: string;
  pillIconClass: string;
  watermarkIcon: LucideIcon;
};

const STRENGTHS_THEME: TraitCardTheme = {
  cardBorderClass: "border-emerald-200/80",
  cardBgClass: "bg-emerald-50/70",
  iconWrapClass: "bg-emerald-100",
  iconClass: "text-emerald-600",
  dividerClass: "via-emerald-300/70",
  pillBorderClass: "border-emerald-200/90",
  pillBgClass: "bg-white/70",
  pillIconClass: "text-emerald-600",
  watermarkIcon: Leaf,
};

const CHALLENGES_THEME: TraitCardTheme = {
  cardBorderClass: "border-red-200/80",
  cardBgClass: "bg-red-50/60",
  iconWrapClass: "bg-red-100",
  iconClass: "text-red-500",
  dividerClass: "via-red-300/70",
  pillBorderClass: "border-red-200/90",
  pillBgClass: "bg-white/70",
  pillIconClass: "text-red-500",
  watermarkIcon: Mountain,
};

type TraitCardHeaderProps = {
  title: string;
  icon: LucideIcon;
  theme: TraitCardTheme;
};

/**
 * Card header: circular icon, serif title, decorative rule + sparkle.
 */
const TraitCardHeader: React.FC<TraitCardHeaderProps> = ({ title, icon: Icon, theme }) => (
  <div className="mb-6 flex items-center gap-4">
    <div
      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${theme.iconWrapClass}`}
    >
      <Icon className={`h-6 w-6 ${theme.iconClass}`} aria-hidden="true" />
    </div>

    <h3 className="min-w-0 flex-1 font-serif text-lg font-bold uppercase tracking-wide text-navy sm:text-xl">
      {title}
    </h3>

    <div className="hidden min-w-[4rem] flex-1 items-center gap-2 sm:flex" aria-hidden="true">
      <div className={`h-px flex-1 bg-gradient-to-r from-transparent ${theme.dividerClass} to-transparent`} />
      <Sparkles className={`h-3.5 w-3.5 shrink-0 ${theme.iconClass}`} />
    </div>
  </div>
);

type TraitPillProps = {
  label: string;
  pillIcon: LucideIcon;
  theme: TraitCardTheme;
};

/**
 * Single trait pill with icon + label.
 */
const TraitPill: React.FC<TraitPillProps> = ({ label, pillIcon: PillIcon, theme }) => (
  <li
    className={`flex items-center gap-2.5 rounded-xl border px-3 py-2.5 ${theme.pillBorderClass} ${theme.pillBgClass}`}
  >
    <PillIcon className={`h-4 w-4 shrink-0 ${theme.pillIconClass}`} aria-hidden="true" />
    <span className="text-sm font-medium leading-snug text-theme-fg">{label}</span>
  </li>
);

type TraitPanelCardProps = {
  title: string;
  headerIcon: LucideIcon;
  pillIcon: LucideIcon;
  items: OverviewTraitItem[];
  theme: TraitCardTheme;
  emptyMessage: string;
};

/**
 * One themed panel: strengths or challenges.
 */
const TraitPanelCard: React.FC<TraitPanelCardProps> = ({
  title,
  headerIcon,
  pillIcon,
  items,
  theme,
  emptyMessage,
}) => {
  const WatermarkIcon = theme.watermarkIcon;

  return (
    <article
      className={`relative overflow-hidden rounded-2xl border p-6 sm:rounded-3xl sm:p-8 ${theme.cardBorderClass} ${theme.cardBgClass} ${lightPanelClass}`}
    >
      <WatermarkIcon
        className={`pointer-events-none absolute -bottom-4 -right-2 h-28 w-28 opacity-[0.08] ${theme.iconClass}`}
        aria-hidden="true"
        strokeWidth={1}
      />

      <TraitCardHeader title={title} icon={headerIcon} theme={theme} />

      {items.length > 0 ? (
        <ul className="relative z-[1] grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
          {items.map((item) => (
            <TraitPill
              key={item.id}
              label={item.label}
              pillIcon={pillIcon}
              theme={theme}
            />
          ))}
        </ul>
      ) : (
        <p className="relative z-[1] text-sm text-theme-fg-secondary">{emptyMessage}</p>
      )}
    </article>
  );
};

/**
 * Side-by-side strengths and potential challenges cards for the Overview section.
 */
export const OverviewStrengthsChallenges: React.FC<OverviewStrengthsChallengesProps> = ({
  strengths,
  weaknesses,
  forPdfCapture,
}) => {
  return (
    <div
      className={
        forPdfCapture
          ? "grid grid-cols-2 gap-6"
          : "grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-6"
      }
    >
      <TraitPanelCard
        title="Your Strengths"
        headerIcon={Dumbbell}
        pillIcon={Check}
        items={strengths}
        theme={STRENGTHS_THEME}
        emptyMessage="No strength data available"
      />
      <TraitPanelCard
        title="Your Potential Challenges"
        headerIcon={Zap}
        pillIcon={AlertTriangle}
        items={weaknesses}
        theme={CHALLENGES_THEME}
        emptyMessage="No challenge data available"
      />
    </div>
  );
};
