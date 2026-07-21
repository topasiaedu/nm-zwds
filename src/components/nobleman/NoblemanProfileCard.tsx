/**
 * Nobleman Profile Card — primary profile hero + other life areas grid.
 */

import React, { useState } from "react";
import { Tilt } from "react-tilt";
import { AnimatePresence, motion } from "framer-motion";
import {
  Briefcase,
  Coins,
  FileText,
  Heart,
  Home,
  Lightbulb,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import type { NoblemanData, NoblemanProfile, NoblemanType, OtherAreaData } from "../../types/nobleman";
import { renderNoblemanTextWithHighlights } from "../analysis_v2/shared/personalityTextHighlight";
import { getNoblemanImageForProfileType } from "../../constants/noblemanProfiles";
import { lightPanelClass } from "../../styles/chartUi";

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

const getProfileImage = (profile: NoblemanProfile): string => {
  return getNoblemanImageForProfileType(profile.type);
};

const NOBLEMAN_PROFILE_CARD_CLASS = [
  "relative overflow-hidden rounded-2xl border border-brand-purple/20",
  "bg-gradient-to-br from-[#EDE8F5] via-[#FAF7FD] to-white",
  lightPanelClass,
].join(" ");

/** Context copy shown above profile-specific characteristics. */
const NOBLEMAN_KEY_PEOPLE_INTRO =
  "Based on your chart structure, these are the people most beneficial to you: " +
  "individuals who align with your strengths and can provide crucial support.";

type NoblemanProfileHeroProps = {
  profile: NoblemanProfile;
  imageSrc: string;
  forPdfCapture?: boolean;
};

/**
 * Primary nobleman profile card — editorial left copy + portrait on the right.
 */
const NoblemanProfileHero: React.FC<NoblemanProfileHeroProps> = ({
  profile,
  imageSrc,
  forPdfCapture,
}) => {
  return (
    <article className={NOBLEMAN_PROFILE_CARD_CLASS}>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_24%_16%,rgba(107,91,149,0.12),transparent_55%)]"
        aria-hidden="true"
      />
      <Sparkles
        className="pointer-events-none absolute right-8 top-6 h-4 w-4 text-[var(--color-accent-gradient-5)]/50"
        aria-hidden="true"
      />
      <Sparkles
        className="pointer-events-none absolute bottom-10 right-1/3 h-3 w-3 text-brand-purple/25"
        aria-hidden="true"
      />

      <div
        className={
          forPdfCapture
            ? "relative flex flex-col gap-8 p-6 sm:p-8"
            : "relative flex flex-col gap-8 p-6 sm:p-8 lg:flex-row lg:items-start lg:gap-10"
        }
      >
        <div className="min-w-0 flex-1 lg:w-[58%]">
          <div className="border-l-4 border-brand-purple pl-4">
            <h3 className="font-serif text-xl font-bold text-navy sm:text-2xl">
              Your Nobleman Profile
            </h3>
          </div>

          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-brand-purple/15 bg-brand-purple/10 px-3.5 py-1.5">
            <Star
              className="h-3.5 w-3.5 fill-brand-purple text-brand-purple"
              aria-hidden="true"
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-brand-purple sm:text-xs">
              {profile.stars}
            </span>
          </div>

          <div className={`mt-6 rounded-xl border border-theme-border-subtle bg-white p-5 shadow-sm sm:p-6 ${lightPanelClass}`}>
            <h4 className="font-serif text-2xl font-bold leading-tight text-navy sm:text-3xl">
              {profile.type}
            </h4>

            <div className="mt-5 flex items-center gap-2">
              <FileText
                className="h-4 w-4 shrink-0 text-brand-purple"
                aria-hidden="true"
              />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-purple sm:text-xs">
                Key Characteristics
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-theme-fg-secondary">
              {NOBLEMAN_KEY_PEOPLE_INTRO}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-theme-fg-secondary sm:text-base">
              {renderNoblemanTextWithHighlights(profile.characteristics)}
            </p>
          </div>
        </div>

        <div
          className={
            forPdfCapture
              ? "flex w-full justify-center"
              : "flex w-full shrink-0 justify-center lg:w-[42%] lg:justify-end"
          }
        >
          <NoblemanPortraitCard
            imageSrc={imageSrc}
            alt={`${profile.type} Nobleman`}
            forPdfCapture={forPdfCapture}
          />
        </div>
      </div>
    </article>
  );
};

const getAreaIcon = (objective: string, className: string): React.ReactNode => {
  if (objective.includes("Career")) {
    return <Briefcase className={className} aria-hidden="true" />;
  }
  if (objective.includes("Wealth")) {
    return <Coins className={className} aria-hidden="true" />;
  }
  if (objective.includes("Health")) {
    return <Heart className={className} aria-hidden="true" />;
  }
  if (objective.includes("Friend")) {
    return <Users className={className} aria-hidden="true" />;
  }
  return <Lightbulb className={className} aria-hidden="true" />;
};

type LifeAreaTheme = {
  headerFrom: string;
  headerTo: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
};

const LIFE_AREA_THEMES: Record<string, LifeAreaTheme> = {
  "from-purple-500 to-pink-500": {
    headerFrom: "#8B6FC8",
    headerTo: "#A67ED9",
    accent: "#7B5FC4",
    badgeBg: "#EDE8F5",
    badgeText: "#5C4A8A",
  },
  "from-blue-500 to-cyan-500": {
    headerFrom: "#4F8FD4",
    headerTo: "#6BAADC",
    accent: "#3F7BB8",
    badgeBg: "#E3EEF8",
    badgeText: "#2E5F8F",
  },
  "from-green-500 to-emerald-500": {
    headerFrom: "#4F9F72",
    headerTo: "#6BB892",
    accent: "#3F8F62",
    badgeBg: "#E0F0E8",
    badgeText: "#2D6B4A",
  },
};

const DEFAULT_LIFE_AREA_THEME: LifeAreaTheme = {
  headerFrom: "#6B5B95",
  headerTo: "#8B7BA8",
  accent: "#6B5B95",
  badgeBg: "#EDE8F5",
  badgeText: "#6B5B95",
};

const getLifeAreaTheme = (gradient: string): LifeAreaTheme =>
  LIFE_AREA_THEMES[gradient] ?? DEFAULT_LIFE_AREA_THEME;

type NoblemanLifeAreaCardProps = {
  area: OtherAreaData;
  forPdfCapture?: boolean;
};

/**
 * Single life-area card — gradient header, nobleman type body, palace badge.
 */
const NoblemanLifeAreaCard: React.FC<NoblemanLifeAreaCardProps> = ({
  area,
  forPdfCapture,
}) => {
  const theme = getLifeAreaTheme(area.gradient);
  const hoverClass = forPdfCapture
    ? ""
    : "transition-shadow duration-300 hover:shadow-md";

  const badgeStyle = {
    "--area-accent": theme.accent,
    "--area-badge-bg": theme.badgeBg,
    "--area-badge-text": theme.badgeText,
  } as React.CSSProperties;

  return (
    <article
      className={`flex h-full flex-col overflow-hidden rounded-2xl border border-theme-border-subtle bg-white shadow-sm ${lightPanelClass} ${hoverClass}`}
      style={badgeStyle}
    >
      <div
        className="flex items-center justify-between gap-3 px-5 py-4"
        style={{
          background: `linear-gradient(135deg, ${theme.headerFrom}, ${theme.headerTo})`,
        }}
      >
        <div className="min-w-0">
          <p className="font-serif text-base font-bold leading-tight text-white sm:text-lg">
            {area.objective}
          </p>
          <p className="mt-0.5 text-sm text-white/90">{area.palaceChinese}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/15">
          {getAreaIcon(area.objective, "h-5 w-5 text-white")}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <span
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: theme.accent }}
            aria-hidden="true"
          />
          <p
            className="text-[10px] font-bold uppercase tracking-[0.2em] [color:var(--area-accent)]"
          >
            Nobleman Type
          </p>
        </div>
        <p className="mt-3 font-sans text-base font-bold leading-snug text-navy sm:text-lg">
          {area.noblemanType}
        </p>

        <div className="mt-auto pt-5">
          <span
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold",
              "[background-color:var(--area-badge-bg)] [color:var(--area-badge-text)]",
            ].join(" ")}
          >
            <Home className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {area.palaceName}
          </span>
        </div>
      </div>
    </article>
  );
};

type NoblemanOtherLifeAreasProps = {
  areas: OtherAreaData[];
  forPdfCapture?: boolean;
};

/**
 * Other life areas section — editorial header + responsive card grid.
 */
const NoblemanOtherLifeAreas: React.FC<NoblemanOtherLifeAreasProps> = ({
  areas,
  forPdfCapture,
}) => {
  if (areas.length === 0) {
    return null;
  }

  const gridClass = forPdfCapture
    ? "grid grid-cols-1 gap-5 sm:grid-cols-3"
    : "grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div
      className="mx-auto w-full max-w-5xl"
      data-pdf-break-anchor="nobleman-other-areas"
    >
      <div className="border-l-4 border-brand-purple pl-4 dark:border-accent-goldDark/70">
        <h3 className="font-serif text-xl font-bold text-navy dark:text-cream sm:text-2xl">
          Other Life Areas
        </h3>
        <p className="mt-2 text-sm text-theme-fg-secondary sm:text-base">
          Key nobleman types supporting different aspects of your life
        </p>
      </div>

      <ul className={`mt-8 list-none p-0 ${gridClass}`}>
        {areas.map((area) => (
          <li key={`${area.objective}-${area.palaceName}`} className="min-w-0">
            <NoblemanLifeAreaCard area={area} forPdfCapture={forPdfCapture} />
          </li>
        ))}
      </ul>
    </div>
  );
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
          className="space-y-10"
        >
          <NoblemanProfileHero
            profile={currentProfile}
            imageSrc={currentImage}
            forPdfCapture={forPdfCapture}
          />

          {areas.length > 0 ? (
            <NoblemanOtherLifeAreas areas={areas} forPdfCapture={forPdfCapture} />
          ) : null}
        </motion.div>
      </AnimatePresence>
    </section>
  );
};

export default NoblemanProfileCard;
