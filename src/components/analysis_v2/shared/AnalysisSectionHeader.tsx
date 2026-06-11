/**
 * Centered analysis section header — cream-surface editorial style (matches Wealth Code).
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import { BrandGradientText } from "../../BrandGradientText";
import {
  analysisHeroTitleClass,
  analysisHeroTitleCenteredClass,
} from "../../../styles/typographyUi";
import { pdfCaptureNumericBadgeStyle } from "./pdfCaptureNumericBadgeStyle";

export type AnalysisSectionHeaderProps = {
  /** Eyebrow pill label (e.g. "Section 01", "Wealth profile"). */
  sectionLabel: string;
  /** Numeric badge beside the title (e.g. "01"). */
  badgeText: string;
  /** Main section title — rendered as h2. */
  title: string;
  /** Supporting description below the title. */
  subtitle: string;
  /** Small icon shown in the eyebrow pill. */
  icon: LucideIcon;
  /** Optional Tailwind classes for the title (defaults to analysisHeroTitleClass). */
  titleClassName?: string;
  /** Optional PDF break anchor attribute. */
  pdfBreakAnchor?: string;
  /** Static mode for PDF capture. */
  forPdfCapture?: boolean;
};

const numericBadgeStyle = (forPdfCapture: boolean | undefined): React.CSSProperties =>
  forPdfCapture
    ? pdfCaptureNumericBadgeStyle("#4A3F6B")
    : {
        background: "rgba(255, 255, 255, 0.95)",
        color: "#4A3F6B",
        height: "40px",
        minWidth: "52px",
        padding: "0 14px",
        borderRadius: "12px",
        fontSize: "20px",
        fontWeight: "800",
        lineHeight: 1,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      };

/**
 * Flat centered section header used across analysis report sections.
 */
export const AnalysisSectionHeader: React.FC<AnalysisSectionHeaderProps> = ({
  sectionLabel,
  badgeText,
  title,
  subtitle,
  icon: Icon,
  titleClassName = analysisHeroTitleClass,
  pdfBreakAnchor,
  forPdfCapture,
}) => {
  const anchorProps: Record<string, string> = {};
  if (pdfBreakAnchor) {
    anchorProps["data-pdf-break-anchor"] = pdfBreakAnchor;
  }

  return (
    <div className="mb-8" {...anchorProps}>
      <div className="text-center">
        <div className="mb-4 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/30 bg-brand-purple/10 px-3 py-1.5 dark:border-accent-gold/40 dark:bg-accent-gold/10">
            <Icon
              className="h-3.5 w-3.5 text-brand-purple dark:text-accent-gold"
              aria-hidden="true"
            />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-purple dark:text-accent-gold">
              {sectionLabel}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <span style={numericBadgeStyle(forPdfCapture)}>{badgeText}</span>
          <BrandGradientText as="h2" className={`${titleClassName} inline-block w-fit`}>
            {title}
          </BrandGradientText>
        </div>

        <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-theme-fg-secondary sm:text-lg">
          {subtitle}
        </p>
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
