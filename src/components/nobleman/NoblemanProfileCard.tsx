/**
 * Nobleman Profile Card — merged primary profile + other life areas (PPT-style split layout).
 */

import React, { useState } from "react";
import { Tilt } from "react-tilt";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Coins,
  Heart,
  Lightbulb,
  Star,
  Users,
} from "lucide-react";
import type { NoblemanData, NoblemanProfile, NoblemanType, OtherAreaData } from "../../types/nobleman";
import { renderNoblemanTextWithHighlights } from "../analysis_v2/shared/personalityTextHighlight";
import { SubsectionSparkleDivider } from "../analysis_v2/shared/SubsectionSparkleDivider";
import { BrandGradientText } from "../BrandGradientText";
import {
  analysisCardTitleClass,
  analysisPanelTitleClass,
} from "../../styles/typographyUi";
import { NOBLEMAN_TYPE_TO_IMAGE } from "../../constants/noblemanProfiles";

interface NoblemanProfileCardProps extends NoblemanData {
  /** Other life areas to list beneath the primary profile sub-header. */
  areas: OtherAreaData[];
  theme?: "light" | "dark";
  forPdfCapture?: boolean;
}

const tiltOptions = {
  scale: 1.02,
  speed: 1000,
  max: 8,
  glare: false,
  "max-glare": 0,
};

const getNoblemanTypeKey = (profileType: string): NoblemanType => {
  const typeMap: Record<string, NoblemanType> = {
    "Older Female": "older_female",
    Male: "male",
    "Stable & Resource": "stable_resource",
    "Stable &amp; Resource": "stable_resource",
    "Younger / Junior": "younger_junior",
    Younger: "younger_junior",
    "Same-Generation": "same_generation",
    "Authority / High-Status": "authority_high_status",
    Authority: "authority_high_status",
    "Practical Leader": "practical_leader",
    "Bold & Aggressive": "bold_aggressive",
    "Bold &amp; Aggressive": "bold_aggressive",
    "Charismatic & Expressive": "charismatic_expressive",
    "Charismatic &amp; Expressive": "charismatic_expressive",
    "Refined & Educated": "refined_educated",
    "Refined &amp; Educated": "refined_educated",
  };

  for (const [key, value] of Object.entries(typeMap)) {
    if (profileType.includes(key)) {
      return value;
    }
  }

  return "authority_high_status";
};

const getProfileImage = (profile: NoblemanProfile): string => {
  const typeKey = getNoblemanTypeKey(profile.type);
  const filename = NOBLEMAN_TYPE_TO_IMAGE[typeKey];
  return `/assets/nobleman/${filename}`;
};

const NOBLEMAN_TYPE_SUFFIX = " Nobleman";

/** Context copy shown above profile-specific characteristics. */
const NOBLEMAN_KEY_PEOPLE_INTRO =
  "Based on your chart structure, these are the people most beneficial to you — " +
  "individuals who align with your strengths and can provide crucial support.";

/**
 * Splits display type into two lines — descriptor, then "Nobleman".
 */
const splitNoblemanTypeLines = (type: string): { lead: string; suffix: string | null } => {
  if (type.endsWith(NOBLEMAN_TYPE_SUFFIX)) {
    return {
      lead: type.slice(0, -NOBLEMAN_TYPE_SUFFIX.length),
      suffix: "Nobleman",
    };
  }
  return { lead: type, suffix: null };
};

const getAreaIcon = (objective: string): React.ReactNode => {
  const iconClass = "h-5 w-5 text-accent-goldDark dark:text-accent-gold";
  if (objective.includes("Career")) {
    return <Briefcase className={iconClass} aria-hidden="true" />;
  }
  if (objective.includes("Wealth")) {
    return <Coins className={iconClass} aria-hidden="true" />;
  }
  if (objective.includes("Health")) {
    return <Heart className={iconClass} aria-hidden="true" />;
  }
  if (objective.includes("Friend")) {
    return <Users className={iconClass} aria-hidden="true" />;
  }
  return <Lightbulb className={iconClass} aria-hidden="true" />;
};

type NoblemanPortraitCardProps = {
  imageSrc: string;
  alt: string;
  forPdfCapture?: boolean;
};

/**
 * Portrait image with tilt — no text overlays on the card.
 */
const NoblemanPortraitCard: React.FC<NoblemanPortraitCardProps> = ({
  imageSrc,
  alt,
  forPdfCapture,
}) => {
  const image = (
    <img
      src={imageSrc}
      alt={alt}
      className="aspect-[3/4] w-full rounded-[1.75rem] object-cover object-top ring-1 ring-accent-gold/40"
      style={forPdfCapture ? { maxHeight: "450px" } : { maxHeight: "450px" }}
    />
  );

  if (forPdfCapture) {
    return <div className="relative mx-auto w-full max-w-sm">{image}</div>;
  }

  return (
    <div className="relative mx-auto w-full max-w-sm">
      <Tilt options={tiltOptions} className="relative w-full">
        {image}
      </Tilt>
    </div>
  );
};

type NoblemanLifeAreaRowProps = {
  area: OtherAreaData;
};

/**
 * Single life-area row — circular navy icon + label + nobleman type.
 */
const NoblemanLifeAreaRow: React.FC<NoblemanLifeAreaRowProps> = ({ area }) => {
  return (
    <li className="flex w-full max-w-md flex-col items-center gap-3 py-4 text-center sm:flex-row sm:items-start sm:gap-4 sm:text-left">
      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border-2 border-accent-gold/60 bg-navy shadow-sm dark:bg-navy">
        {getAreaIcon(area.objective)}
      </div>
      <div className="min-w-0 flex-1">
        <BrandGradientText as="h4" className={analysisCardTitleClass}>
          {area.objective}
          <span className="font-normal text-theme-fg-secondary">
            {" "}
            · {area.palaceChinese}
          </span>
        </BrandGradientText>
        <p className="mt-1 text-sm leading-relaxed text-theme-fg-secondary">
          {area.noblemanType}
        </p>
        <p className="mt-1 text-xs text-theme-fg-secondary/80">{area.palaceName}</p>
      </div>
    </li>
  );
};

const NoblemanProfileCard: React.FC<NoblemanProfileCardProps> = ({
  matchedProfiles,
  areas,
  forPdfCapture,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const currentProfile = matchedProfiles[selectedIndex] ?? matchedProfiles[0];
  const hasMultipleProfiles = matchedProfiles.length > 1;
  if (!currentProfile) {
    return null;
  }

  const currentImage = getProfileImage(currentProfile);
  const typeLines = splitNoblemanTypeLines(currentProfile.type);

  return (
    <section
      {...(forPdfCapture ? { "data-pdf-page-break-before": "" } : {})}
      data-pdf-break-anchor="nobleman-profile"
      className="relative mb-8"
      aria-label="Nobleman profile and life areas"
    >
      {hasMultipleProfiles ? (
        <div className="mb-6">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-theme-fg-secondary">
            Switch profile match
          </p>
          <div className="flex flex-wrap gap-2">
            {matchedProfiles.map((profile, index) => (
              <button
                key={`${profile.type}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all sm:text-sm ${
                  selectedIndex === index
                    ? "bg-navy text-cream shadow-md dark:bg-brand-purple"
                    : "border border-theme-border-default bg-surface-cream text-theme-fg-secondary hover:border-brand-purple/40 dark:bg-surface-dark"
                }`}
                aria-label={`Select ${profile.type}`}
                aria-pressed={selectedIndex === index}
              >
                {profile.type}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedIndex}
          initial={forPdfCapture ? { opacity: 1 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={forPdfCapture ? { opacity: 1 } : { opacity: 0, y: -8 }}
          transition={forPdfCapture ? { duration: 0 } : { duration: 0.35 }}
          className="space-y-8"
        >
          {/* Row 1 — centered sub-header; body copy left-aligned */}
          <div className="flex w-full flex-col pb-2">
            <div className="w-full text-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-purple/20 bg-surface-cream px-3 py-1 dark:border-accent-gold/30 dark:bg-surface-dark">
                <Star className="h-3.5 w-3.5 fill-accent-gold text-accent-gold" aria-hidden="true" />
                <span className="text-xs font-bold uppercase tracking-wider text-brand-purple dark:text-accent-gold">
                  {currentProfile.stars}
                </span>
              </div>
              <BrandGradientText
                as="h4"
                variant="primary"
                className={`mt-4 mx-auto block w-fit ${analysisPanelTitleClass}`}
              >
                {typeLines.lead}
                {typeLines.suffix ? (
                  <>
                    <br />
                    {typeLines.suffix}
                  </>
                ) : null}
              </BrandGradientText>
            </div>
            <SubsectionSparkleDivider />
            <p className="text-center text-sm font-medium uppercase tracking-wider text-theme-fg-secondary">
              Key characteristics
            </p>
            <div
              className="mt-2 w-full text-left"
              role="note"
              aria-label="Your key people"
            >
              <p className="text-sm leading-relaxed text-theme-fg-secondary">
                {NOBLEMAN_KEY_PEOPLE_INTRO}
              </p>
              <p className="mt-4 text-base leading-relaxed text-theme-fg-secondary">
                {renderNoblemanTextWithHighlights(currentProfile.characteristics)}
              </p>
            </div>
          </div>

          {/* Row 2 — life areas (left) + portrait (right) */}
          <div
            className={
              forPdfCapture
                ? "mx-auto flex max-w-5xl flex-col items-center gap-6"
                : "mx-auto flex max-w-5xl flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-center lg:gap-8"
            }
          >
            {areas.length > 0 ? (
              <div
                className="flex w-full min-w-0 flex-1 flex-col items-center"
                data-pdf-break-anchor="nobleman-other-areas"
              >
                <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-theme-fg-secondary">
                  Other life areas
                </p>
                <ul className="flex w-full list-none flex-col items-center p-0">
                  {areas.map((area) => (
                    <NoblemanLifeAreaRow
                      key={`${area.objective}-${area.palaceName}`}
                      area={area}
                    />
                  ))}
                </ul>
              </div>
            ) : (
              <div className="flex-1" />
            )}

            <div
              className={
                forPdfCapture
                  ? "flex w-full justify-center"
                  : "flex w-full shrink-0 justify-center lg:w-auto lg:max-w-xs"
              }
            >
              <NoblemanPortraitCard
                imageSrc={currentImage}
                alt={`${currentProfile.type} Nobleman`}
                forPdfCapture={forPdfCapture}
              />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default NoblemanProfileCard;
