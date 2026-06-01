import React from "react";
import { brandGradientTextClass } from "../styles/typographyUi";

export type BrandGradientTextProps = {
  children: React.ReactNode;
  /** Extra Tailwind classes (e.g. font-bold, text-2xl). */
  className?: string;
  /** HTML element to render. Defaults to span. */
  as?: "span" | "p" | "h1" | "h2" | "h3" | "h4";
};

/**
 * Renders children with the brand gold→coral gradient (clip-text).
 */
export const BrandGradientText: React.FC<BrandGradientTextProps> = ({
  children,
  className = "",
  as: Component = "span",
}) => {
  const mergedClassName = [brandGradientTextClass, className]
    .filter(Boolean)
    .join(" ");

  return <Component className={mergedClassName}>{children}</Component>;
};

export type WrapPhraseInBrandGradientOptions = {
  /** Substring to highlight; must match exactly (case-sensitive). */
  phrase: string;
  /** Classes on the gradient span. */
  gradientClassName?: string;
};

/**
 * Splits text around the first occurrence of phrase and wraps the phrase in brand gradient.
 * Returns plain text if phrase is not found.
 */
export const wrapPhraseInBrandGradient = (
  text: string,
  options: WrapPhraseInBrandGradientOptions
): React.ReactNode => {
  const { phrase, gradientClassName = "" } = options;
  const phraseIndex = text.indexOf(phrase);

  if (phraseIndex === -1) {
    return text;
  }

  const beforePhrase = text.slice(0, phraseIndex);
  const afterPhrase = text.slice(phraseIndex + phrase.length);
  const spanClassName = [brandGradientTextClass, gradientClassName]
    .filter(Boolean)
    .join(" ");

  const beforeTrimmed = beforePhrase.trimEnd();
  const phraseStartsWithSpace = phrase.startsWith(" ");
  const needsGap =
    beforeTrimmed.length > 0 &&
    phrase.trim().length > 0 &&
    !phraseStartsWithSpace;

  return (
    <>
      {beforeTrimmed}
      {needsGap ? " " : null}
      <span className={spanClassName}>{phrase}</span>
      {afterPhrase}
    </>
  );
};

/** Default product phrases highlighted on chart/calculate pages (first match wins). */
export const BRAND_GRADIENT_PHRASES = [
  "Zi Wei Dou Shu",
  "Purple Star Astrology",
  "紫微斗数",
] as const;

/**
 * Highlights the first matching brand phrase in a title string.
 */
export const renderTitleWithBrandGradientPhrases = (
  title: string
): React.ReactNode => {
  for (const phrase of BRAND_GRADIENT_PHRASES) {
    if (title.includes(phrase)) {
      return wrapPhraseInBrandGradient(title, { phrase });
    }
  }
  return title;
};

/** @deprecated Use renderTitleWithBrandGradientPhrases */
export const renderTitleWithZiWeiDouShuGradient = renderTitleWithBrandGradientPhrases;

/**
 * Highlights a profile name in "{name}'s Chart" style titles.
 */
export const renderChartTitleWithNameGradient = (
  name: string,
  chartLabel: string
): React.ReactNode => (
  <>
    <span className={brandGradientTextClass}>{name}</span>
    {`'s ${chartLabel}`}
  </>
);
