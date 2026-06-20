/**
 * Core personality block — editorial left copy + archetype card over compass artwork.
 */

import React from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Crown,
  Eye,
  Leaf,
  Sparkles,
  Star,
} from "lucide-react";
import { PersonalityDescriptionParagraph } from "./personalityTextHighlight";
import type { PersonalityProfile } from "../../../utils/zwds/analysis/overviewStarUtils";

const PERSONALITY_BG_IMAGE = "/images/chart/personality_bg.png";
/** Matches the flat cream fill in personality_bg.png */
const PERSONALITY_SECTION_BG_CLASS = "bg-[#FFF8F4] dark:bg-[#2c2825]";
const ARCHETYPE_GLASS_CARD_CLASS = [
  "border border-[var(--color-accent-gradient-5)]/35",
  "bg-white/5 shadow-lg shadow-[var(--color-accent-gradient-5)]/10",
  "backdrop-blur-md backdrop-saturate-150",
  "dark:bg-white/5 dark:shadow-black/20",
].join(" ");
const ARCHETYPE_ACCENT_CLASS = "text-[var(--color-accent-gradient-5)]";
const MAX_ARCHETYPE_TRAITS = 4;

const TRAIT_ICONS: LucideIcon[] = [Leaf, Eye, ArrowUpRight, Star];

/**
 * Right-panel artwork — light PNG only; hidden in dark mode (PNG has baked-in cream bg).
 */
const PersonalitySectionBackground: React.FC = () => (
  <div
    className="pointer-events-none absolute inset-0 bg-contain bg-right bg-no-repeat opacity-90 dark:hidden"
    style={{ backgroundImage: `url(${PERSONALITY_BG_IMAGE})` }}
    aria-hidden="true"
  />
);

export type CorePersonalitySectionProps = {
  personalityProfiles: PersonalityProfile[];
  supplementaryProfiles: PersonalityProfile[];
  forPdfCapture?: boolean;
};

/**
 * Decorative theater masks icon for the section heading.
 */
const TheaterMasksIcon: React.FC = () => (
  <span
    className="inline-flex h-10 w-10 shrink-0 items-center justify-center text-2xl leading-none"
    aria-hidden="true"
  >
    {"🎭"}
  </span>
);

/**
 * Row of filled accent stars at the bottom of the archetype card.
 */
const ArchetypeStarRating: React.FC = () => (
  <div className="flex items-center justify-center gap-1" aria-hidden="true">
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={`archetype-star-${index}`}
        className={`h-3.5 w-3.5 fill-current ${ARCHETYPE_ACCENT_CLASS}`}
      />
    ))}
  </div>
);

type ArchetypeTraitRowProps = {
  label: string;
  icon: LucideIcon;
};

/**
 * Single trait line with icon inside the archetype card.
 */
const ArchetypeTraitRow: React.FC<ArchetypeTraitRowProps> = ({ label, icon: Icon }) => (
  <li className="flex items-center gap-2.5 text-left">
    <Icon className={`h-4 w-4 shrink-0 ${ARCHETYPE_ACCENT_CLASS}`} aria-hidden="true" />
    <span className="text-sm font-medium text-theme-fg-secondary">{label}</span>
  </li>
);

type ArchetypeHighlightCardProps = {
  profile: PersonalityProfile;
};

/**
 * Arched highlight panel showing archetype name and top strengths.
 */
const ArchetypeHighlightCard: React.FC<ArchetypeHighlightCardProps> = ({ profile }) => {
  const displayTraits = profile.archetypeTraits.slice(0, MAX_ARCHETYPE_TRAITS);

  return (
  <div
    className={`relative z-10 mx-auto w-full max-w-[17rem] rounded-t-[3.5rem] rounded-b-2xl px-6 py-8 text-center ${ARCHETYPE_GLASS_CARD_CLASS}`}
  >
    <Crown className={`mx-auto h-5 w-5 ${ARCHETYPE_ACCENT_CLASS}`} aria-hidden="true" />

    <p
      className={`mt-3 text-[10px] font-bold uppercase tracking-[0.22em] ${ARCHETYPE_ACCENT_CLASS}`}
    >
      Your Archetype
    </p>

    <h4 className={`mt-2 font-serif text-2xl font-bold uppercase leading-tight ${ARCHETYPE_ACCENT_CLASS}`}>
      {profile.archetypeTitle}
    </h4>

    {displayTraits.length > 0 ? (
      <>
        <div
          className="mx-auto mt-5 h-px w-full bg-[var(--color-accent-gradient-5)]/25"
          aria-hidden="true"
        />
        <ul className="mt-4 space-y-3">
          {displayTraits.map((trait, index) => {
            const TraitIcon = TRAIT_ICONS[index % TRAIT_ICONS.length];
            return (
              <ArchetypeTraitRow
                key={`${profile.starKey}-${trait}-${index}`}
                label={trait}
                icon={TraitIcon}
              />
            );
          })}
        </ul>
      </>
    ) : null}

    <div
      className="mx-auto mt-5 h-px w-full bg-[var(--color-accent-gradient-5)]/25"
      aria-hidden="true"
    />
    <div className="mt-4">
      <ArchetypeStarRating />
    </div>
  </div>
  );
};

/**
 * Personality section with left narrative and right archetype card.
 */
export const CorePersonalitySection: React.FC<CorePersonalitySectionProps> = ({
  personalityProfiles,
  supplementaryProfiles,
  forPdfCapture,
}) => {
  const hasPersonalityCopy =
    personalityProfiles.length > 0 || supplementaryProfiles.length > 0;

  return (
    <section
      data-pdf-break-anchor="overview-core-personality"
      className={`relative mb-10 overflow-hidden rounded-2xl border border-[var(--color-accent-gradient-5)]/15 ${PERSONALITY_SECTION_BG_CLASS} ${
        forPdfCapture ? "break-inside-avoid-page" : ""
      }`}
    >
      <Sparkles
        className={`pointer-events-none absolute right-5 top-5 h-4 w-4 ${ARCHETYPE_ACCENT_CLASS} opacity-70`}
        aria-hidden="true"
      />

      <div className="flex flex-col lg:flex-row">
        <div className="w-full px-6 py-8 sm:px-8 lg:w-[60%] lg:py-10">
          <div className="flex items-center gap-3">
            <TheaterMasksIcon />
            <h3 className="font-serif text-xl font-bold uppercase tracking-wide text-navy dark:text-cream sm:text-2xl">
              Your Core Personality
            </h3>
          </div>

          {hasPersonalityCopy ? (
            <div className="mt-6 space-y-4">
              {personalityProfiles.map((profile, index) => (
                <div key={profile.starKey}>
                  {personalityProfiles.length > 1 ? (
                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-theme-fg-secondary">
                      {profile.englishStarName}
                    </p>
                  ) : null}
                  <PersonalityDescriptionParagraph
                    text={profile.description}
                    prominent={index === 0}
                  />
                </div>
              ))}

              {supplementaryProfiles.map((profile) => (
                <PersonalityDescriptionParagraph
                  key={profile.starKey}
                  text={profile.description}
                  prominent={false}
                />
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm leading-relaxed text-theme-fg-secondary">
              No analysis data available for the stars in your life palace. Please ensure your
              chart data is properly calculated.
            </p>
          )}
        </div>

        <div className="relative flex min-h-[22rem] w-full items-center justify-center px-6 pb-8 pt-4 lg:w-[40%] lg:px-8 lg:py-10">
          <PersonalitySectionBackground />

          {personalityProfiles.length > 0 ? (
            <div className="relative z-10 flex w-full max-w-[17rem] flex-col gap-5">
              {personalityProfiles.map((profile) => (
                <ArchetypeHighlightCard key={profile.starKey} profile={profile} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
