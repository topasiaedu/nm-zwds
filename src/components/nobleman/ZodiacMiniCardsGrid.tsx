/**
 * Quick reference zodiacs for other life areas — subsection under Nobleman Analysis.
 */

import React from "react";
import type { ZodiacMiniData } from "../../utils/nobleman";
import { SubsectionSparkleDivider } from "../analysis_v2/shared/SubsectionSparkleDivider";
import { BrandGradientText } from "../BrandGradientText";
import {
  analysisCardTitleClass,
  analysisEyebrowClass,
} from "../../styles/typographyUi";
import ZodiacIcons from "../zwds/icons";
import ZodiacIconWrapper from "../zwds/components/ZodiacIconWrapper";

interface ZodiacMiniCardsGridProps {
  miniData: ZodiacMiniData[];
  forPdfCapture?: boolean;
}

export const ZodiacMiniCardsGrid: React.FC<ZodiacMiniCardsGridProps> = ({
  miniData,
  forPdfCapture,
}) => {
  if (miniData.length === 0) {
    return null;
  }

  const hoverClass = forPdfCapture
    ? ""
    : "transition-[border-color,box-shadow] duration-200 hover:border-brand-purple/40 hover:shadow-md dark:hover:border-accent-gold/40";

  return (
    <section
      className="mb-8 px-6"
      data-pdf-break-anchor="zodiac-mini-cards"
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
    >
      <div className="space-y-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
            Quick reference
          </p>
          <BrandGradientText
            as="h2"
            variant="primary"
            className="mx-auto mt-2 inline-block w-fit text-2xl font-bold sm:text-3xl"
          >
            Other Life Area Nobleman
          </BrandGradientText>
          <p className="mt-2 text-sm leading-relaxed text-theme-fg-secondary">
            Zodiac personalities supporting different aspects of your life
          </p>
          <SubsectionSparkleDivider className="mx-auto mb-0 mt-5 flex w-full max-w-md items-center gap-3 px-2" />
        </div>

        <div
          className={
            forPdfCapture
              ? "grid grid-cols-2 gap-8"
              : "grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
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

  return (
    <article
      className={[
        "overflow-hidden rounded-xl border border-theme-border-default border-l-4",
        "border-l-brand-purple/40 bg-transparent shadow-sm",
        "dark:border-brand-purple/25 dark:border-l-accent-goldDark/50",
        hoverClass,
      ].join(" ")}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {ZodiacIcon ? (
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent-gold/60 bg-navy p-2 shadow-sm dark:bg-navy">
              <ZodiacIconWrapper
                Icon={ZodiacIcon}
                className="h-full w-full"
                invertToWhite
              />
            </div>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className={`${analysisEyebrowClass} tracking-wide`}>
              {miniData.area}
            </p>
            <BrandGradientText
              as="h4"
              className={`mt-0.5 ${analysisCardTitleClass}`}
            >
              {miniData.zodiac}{" "}
              <span className="text-base font-medium text-theme-fg-secondary">
                {miniData.zodiacChinese}
              </span>
            </BrandGradientText>
          </div>
        </div>

        <div className="mt-4 border-t border-theme-border-subtle pt-3 dark:border-brand-purple/25">
          <p className={analysisEyebrowClass}>Core traits</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {miniData.coreTraits.map((trait) => (
              <span
                key={trait}
                className="rounded-md border border-brand-purple/25 bg-brand-purple/10 px-2 py-0.5 text-xs font-medium text-brand-purple dark:border-accent-gold/30 dark:bg-accent-gold/10 dark:text-accent-gold"
              >
                {trait}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-3">
          <p className={analysisEyebrowClass}>Quick tip</p>
          <p className="mt-1 text-xs leading-relaxed text-theme-fg-secondary">
            {miniData.recognitionSummary}
          </p>
        </div>
      </div>
    </article>
  );
};

export default ZodiacMiniCardsGrid;
