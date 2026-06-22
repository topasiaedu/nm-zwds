/**
 * Centered editorial hero for the analysis report page.
 */

import React from "react";
import { Sparkles } from "lucide-react";
import { brandGradientTextClass } from "../../../styles/typographyUi";
import { SubsectionSparkleDivider } from "./SubsectionSparkleDivider";

const HERO_ACCENT_CLASS = "text-[var(--color-accent-gradient-5)]";

export type DestinyBlueprintPageHeaderProps = {
  /** Top brand eyebrow (e.g. "PREDICTABLE DESTINY™"). */
  brandEyebrow?: string;
  /** Main serif headline (e.g. "YOUR DESTINY BLUEPRINT"). */
  headlineTitle?: string;
  /** Word within the headline rendered in the primary brand gradient. */
  headlineAccentWord?: string;
  /** Secondary all-caps label (e.g. "PERSONALIZED LIFE REPORT"). */
  sectionTitle: string;
  /** Supporting description below the section title. */
  subtitle: string;
  className?: string;
};

type BrandEyebrowProps = {
  label: string;
};

/**
 * Top brand line with sparkles and outward-fading rules.
 */
const BrandEyebrow: React.FC<BrandEyebrowProps> = ({ label }) => (
  <div className="flex w-full max-w-lg items-center justify-center gap-2 sm:gap-3" aria-hidden="true">
    <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-r from-transparent to-[var(--color-accent-gradient-5)]/50 sm:min-w-[3rem]" />
    <Sparkles className={`h-3 w-3 shrink-0 ${HERO_ACCENT_CLASS}`} />
    <span
      className={`shrink-0 text-[10px] font-bold uppercase tracking-[0.25em] sm:text-xs ${HERO_ACCENT_CLASS}`}
    >
      {label}
    </span>
    <Sparkles className={`h-3 w-3 shrink-0 ${HERO_ACCENT_CLASS}`} />
    <div className="h-px min-w-[2rem] flex-1 bg-gradient-to-l from-transparent to-[var(--color-accent-gradient-5)]/50 sm:min-w-[3rem]" />
  </div>
);

/**
 * Splits the headline and highlights one accent word in the primary brand gradient.
 */
const renderHeadlineWithAccent = (
  headlineTitle: string,
  headlineAccentWord: string
): React.ReactNode => {
  const accentIndex = headlineTitle.indexOf(headlineAccentWord);
  if (accentIndex === -1) {
    return headlineTitle;
  }

  const beforeAccent = headlineTitle.slice(0, accentIndex);
  const afterAccent = headlineTitle.slice(accentIndex + headlineAccentWord.length);

  return (
    <>
      {beforeAccent}
      <span className={brandGradientTextClass}>{headlineAccentWord}</span>
      {afterAccent}
    </>
  );
};

/**
 * Premium centered page header matching the destiny blueprint editorial layout.
 */
export const DestinyBlueprintPageHeader: React.FC<DestinyBlueprintPageHeaderProps> = ({
  brandEyebrow = "PREDICTABLE DESTINY™",
  headlineTitle = "YOUR DESTINY BLUEPRINT",
  headlineAccentWord = "DESTINY",
  sectionTitle,
  subtitle,
  className = "",
}) => {
  return (
    <header
      className={`mx-auto flex max-w-4xl flex-col items-center px-2 text-center ${className}`.trim()}
    >
      <BrandEyebrow label={brandEyebrow} />

      <h1 className="mt-5 font-serif text-3xl font-bold uppercase leading-tight tracking-wide text-navy dark:text-cream sm:mt-6 sm:text-4xl md:text-5xl">
        {renderHeadlineWithAccent(headlineTitle, headlineAccentWord)}
      </h1>

      <div className="mt-5 flex items-center justify-center gap-3 sm:mt-6">
        <Sparkles className={`h-3.5 w-3.5 shrink-0 ${HERO_ACCENT_CLASS}`} aria-hidden="true" />
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-fg-secondary sm:text-sm">
          {sectionTitle}
        </p>
        <Sparkles className={`h-3.5 w-3.5 shrink-0 ${HERO_ACCENT_CLASS}`} aria-hidden="true" />
      </div>

      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-theme-fg-secondary sm:text-base">
        {subtitle}
      </p>

      <SubsectionSparkleDivider className="mx-auto mb-0 mt-5 flex w-full max-w-md items-center gap-3 px-2" />
    </header>
  );
};
