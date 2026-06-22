/**
 * Analysis section header — orange gradient banner with background artwork.
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import { BrandGradientText } from "../../BrandGradientText";
import {
  analysisHeroTitleClass,
  analysisHeroTitleCenteredClass,
} from "../../../styles/typographyUi";

const DEFAULT_HEADER_BG_IMAGE = "/images/chart/HeaderBG.png";
/** Nudge artwork down so the doorway top stays inside the banner. */
const DEFAULT_HEADER_BG_POSITION = "center 38%";

export type AnalysisSectionHeaderProps = {
  /** Eyebrow label above the title (e.g. "Core identity", "Wealth profile"). */
  sectionLabel: string;
  /** Large numeric badge on the left (e.g. "01"). */
  badgeText: string;
  /** Main section title — rendered as h2. */
  title: string;
  /** Supporting description below the title. */
  subtitle: string;
  /** Small icon shown beside the eyebrow label. */
  icon: LucideIcon;
  /** Optional banner artwork path (defaults to HeaderBG.png). */
  backgroundImage?: string;
  /** Optional background-position for the artwork layer. */
  backgroundPosition?: string;
  /** Optional Tailwind classes for the title (defaults to analysisHeroTitleClass). */
  titleClassName?: string;
  /** Optional PDF break anchor attribute. */
  pdfBreakAnchor?: string;
  /** Static mode for PDF capture. */
  forPdfCapture?: boolean;
};

/**
 * Premium orange banner section header used across analysis report sections.
 */
export const AnalysisSectionHeader: React.FC<AnalysisSectionHeaderProps> = ({
  sectionLabel,
  badgeText,
  title,
  subtitle,
  icon: Icon,
  backgroundImage,
  backgroundPosition,
  titleClassName = analysisHeroTitleClass,
  pdfBreakAnchor,
  forPdfCapture,
}) => {
  const headerBgImage = backgroundImage ?? DEFAULT_HEADER_BG_IMAGE;
  const headerBgPosition = backgroundPosition ?? DEFAULT_HEADER_BG_POSITION;

  const anchorProps: Record<string, string> = {};
  if (pdfBreakAnchor) {
    anchorProps["data-pdf-break-anchor"] = pdfBreakAnchor;
  }

  return (
    <div className="mb-8" {...anchorProps}>
      <div
        className="relative overflow-hidden rounded-2xl shadow-lg shadow-orange-500/20"
        style={
          forPdfCapture
            ? {
                backgroundImage: `linear-gradient(to right, #f27121, #f9a01b), url(${headerBgImage})`,
                backgroundSize: "cover",
                backgroundPosition: headerBgPosition,
              }
            : undefined
        }
      >
        {!forPdfCapture ? (
          <>
            <div
              className="absolute inset-0 bg-gradient-to-r from-[#f27121] to-[#f9a01b]"
              aria-hidden="true"
            />
            <div
              className="absolute inset-0 bg-cover"
              style={{
                backgroundImage: `url(${headerBgImage})`,
                backgroundPosition: headerBgPosition,
              }}
              aria-hidden="true"
            />
          </>
        ) : null}

        <div className="relative z-10 flex flex-col gap-4 p-4 xs:p-5 sm:flex-row sm:items-center sm:gap-5 sm:p-6 md:gap-8 md:p-8">
          <div className="flex items-center gap-3 sm:contents">
            <span
              className="shrink-0 font-serif text-4xl font-bold tabular-nums leading-none text-white xs:text-5xl sm:text-6xl md:text-7xl"
              aria-hidden="true"
            >
              {badgeText}
            </span>

            <div
              className="h-px flex-1 bg-white/35 sm:hidden"
              aria-hidden="true"
            />

            <div
              className="hidden h-14 w-px shrink-0 bg-white/35 sm:block sm:h-16"
              aria-hidden="true"
            />
          </div>

          <div className="w-full min-w-0 text-left sm:flex-1">
            <div className="mb-1.5 flex items-center gap-1.5 sm:mb-2 sm:gap-2">
              <Icon
                className="h-3 w-3 shrink-0 text-white/80 sm:h-3.5 sm:w-3.5"
                aria-hidden="true"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/80 xs:text-xs sm:tracking-[0.2em]">
                {sectionLabel}
              </span>
            </div>

            <h2
              className={`font-serif font-bold uppercase leading-tight tracking-tight text-white ${titleClassName}`}
            >
              {title}
            </h2>

            <p className="mt-1.5 max-w-full text-xs font-medium leading-relaxed text-white/95 sm:mt-2 sm:text-sm md:text-base">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export type AnalysisSectionHeaderSimpleProps = {
  title: string;
  subtitle: string;
};

/**
 * Fallback header when no section badge is configured (legacy wealth code paths).
 */
export const AnalysisSectionHeaderSimple: React.FC<AnalysisSectionHeaderSimpleProps> = ({
  title,
  subtitle,
}) => {
  return (
    <div className="mb-8 text-center">
      <BrandGradientText as="h2" className={analysisHeroTitleCenteredClass}>
        {title}
      </BrandGradientText>
      <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-theme-fg-secondary sm:text-lg">
        {subtitle}
      </p>
    </div>
  );
};
