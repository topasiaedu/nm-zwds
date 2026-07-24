/**
 * Shared chapter shell for Monthly Consultation: warm, spacious, English-facing.
 */

import React from "react";
import { C } from "../../alignment-advantage/shared/constants";
import { Sparkle } from "../../alignment-advantage/shared/Sparkle";
import {
  ChapterIconBadge,
  SoftAtmosphere,
  type ChapterIconKind,
} from "./chapterIcons";

export interface ChapterShellProps {
  /** DOM id used for sidebar scroll-spy */
  id: string;
  /** Small uppercase chapter label */
  eyebrow: string;
  /** Main chapter title */
  title: string;
  /** Optional supporting sentence */
  subtitle?: string;
  /** Icon kind for warm visual header */
  icon: ChapterIconKind;
  children: React.ReactNode;
}

/**
 * One report sheet sized to content (no forced tall empty page).
 */
export const ChapterShell: React.FC<ChapterShellProps> = ({
  id,
  eyebrow,
  title,
  subtitle,
  icon,
  children,
}) => (
  <section id={id} className="mb-12" data-mc-chapter="">
    <article
      data-aa-report-sheet=""
      className={[
        "relative overflow-hidden scroll-mt-16",
        "rounded-[28px]",
        "p-7 sm:p-9 md:p-12",
        "shadow-[0_8px_28px_rgba(0,0,0,0.04)]",
        "border border-[#e8ddd0]/90",
        "min-h-0",
      ].join(" ")}
      style={{
        background: `linear-gradient(165deg, #fffdf9 0%, ${C.cream} 55%, #f7efe4 100%)`,
      }}
    >
      <SoftAtmosphere />
      <div className="relative z-[1]">
        <div className="flex items-start gap-4 mb-9">
          <ChapterIconBadge kind={icon} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Sparkle size={12} color={C.coral} />
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.20em]"
                style={{ color: C.coral }}
              >
                {eyebrow}
              </p>
            </div>
            <h2
              className="text-2xl md:text-3xl font-bold leading-snug"
              style={{
                color: C.navy,
                fontFamily: "Georgia, 'Times New Roman', serif",
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </h2>
            {subtitle !== undefined && subtitle.length > 0 && (
              <p className="text-sm mt-3 leading-relaxed max-w-xl" style={{ color: C.muted }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <div
          className="w-full h-[1px] mb-7"
          style={{ background: `linear-gradient(90deg, ${C.border} 0%, transparent 100%)` }}
          aria-hidden="true"
        />
        {/* Generous vertical rhythm between content blocks. */}
        <div className="flex flex-col gap-7">{children}</div>
      </div>
    </article>
  </section>
);

/**
 * In-card / in-section title so blocks read clearly as headers, not body copy.
 */
export const SectionHeading: React.FC<{
  children: React.ReactNode;
  color?: string;
  className?: string;
  as?: "h3" | "p";
}> = ({ children, color = C.coral, className = "", as = "h3" }) => {
  const Tag = as;
  const hasMargin = /\bmb-/.test(className);
  return (
    <Tag
      className={[
        "text-xs sm:text-sm font-extrabold uppercase tracking-[0.12em] leading-snug",
        hasMargin ? "" : "mb-2.5",
        className,
      ].filter((part) => part.length > 0).join(" ")}
      style={{ color }}
    >
      {children}
    </Tag>
  );
};

/**
 * Two-column label + description row for star spotlight cards.
 * Fixed label column on sm+ so cue text shares one vertical edge.
 */
export const SpotlightRow: React.FC<{ label: string; description: string }> = ({
  label,
  description,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-[11.5rem_1fr] sm:items-start gap-1 sm:gap-4">
    <span className="text-sm font-semibold" style={{ color: C.coral }}>
      {label}
    </span>
    <span className="text-sm leading-relaxed" style={{ color: C.navy }}>
      {description}
    </span>
  </div>
);

/**
 * Soft labeled row used across chapters.
 * Fixed label column on sm+ so Decade / Year / Month values share one vertical edge.
 */
export const MetaRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div
    className="grid grid-cols-1 sm:grid-cols-[5.5rem_1fr] sm:items-baseline gap-1 sm:gap-3 py-3.5"
    style={{ borderBottom: `1px solid ${C.border}70` }}
  >
    <span
      className="text-xs font-extrabold uppercase tracking-wider"
      style={{ color: C.coral }}
    >
      {label}
    </span>
    <span className="text-sm font-medium" style={{ color: C.navy }}>{value}</span>
  </div>
);

/**
 * Warm tip / highlight card with left accent bar.
 */
export const WarmCard: React.FC<{
  title: string;
  children: React.ReactNode;
  tone?: "coral" | "gold" | "navy";
}> = ({ title, children, tone = "coral" }) => {
  const accent = tone === "gold" ? C.gold : tone === "navy" ? C.navy : C.coral;
  return (
    <div
      className="rounded-2xl p-5 sm:p-6"
      style={{
        background: `linear-gradient(135deg, ${accent}14, ${C.cream})`,
        border: `1px solid ${accent}33`,
      }}
    >
      <div className="border-l-2 pl-3 mb-3" style={{ borderColor: accent }}>
        <SectionHeading color={accent} className="mb-0">
          {title}
        </SectionHeading>
      </div>
      <div className="text-sm leading-loose" style={{ color: C.navy }}>
        {children}
      </div>
    </div>
  );
};
