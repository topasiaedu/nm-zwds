/**
 * All Monthly Consultation chapters: visual-first, English-only, warmer UI.
 */

import React from "react";
import type {
  FocusStarSource,
  MonthlyConsultationBundle,
  MonthlyStarSnapshot,
  SiHuaKind,
} from "../../../utils/forecast/monthlyConsultation";
import {
  activationLandingEnglish,
  dayunSeasonPlain,
  liuSeasonShort,
  SI_HUA_LABEL,
  starToEnglish,
} from "../../../utils/forecast/monthlyConsultation/englishLabels";
import { getNoblemanImageForProfileType } from "../../../constants/noblemanProfiles";
import ZodiacIcons from "../../zwds/icons";
import { C } from "../../alignment-advantage/shared/constants";
import {
  ChapterIllustration,
  InlineSvgFlag,
  InlineSvgWarning,
  type AreaIconKind,
} from "../shared/chapterIcons";
import { ChapterShell, SectionHeading, WarmCard } from "../shared/ChapterShell";
import { ActionTileList } from "../shared/ActionTile";
import { AlignmentBands } from "../shared/AlignmentBands";
import { BarGroup } from "../shared/BarGroup";
import { BodyProtocolStrip } from "../shared/BodyProtocolStrip";
import { BodySignalTimeline } from "../shared/BodySignalTimeline";
import { ContractCard } from "../shared/ContractCard";
import { RarityLayers } from "../shared/RarityLayers";
import {
  kindFromActivationTitle,
  SiHuaGlyph,
  SI_HUA_COLOR,
} from "../shared/SiHuaChip";
import { SpeechBubbleCard } from "../shared/SpeechBubbleCard";
import {
  StarFamilyGlyph,
  starFamilyColor as starFamilyAccent,
} from "../shared/StarFamilyGlyph";
import { StepFlow } from "../shared/StepFlow";
import { WeekTileRow } from "../shared/WeekTile";
import { YearRadialMap } from "../shared/YearRadialMap";

/**
 * Resolve English zodiac name (e.g. "Tiger") to the shared animal icon.
 */
const zodiacIconForName = (
  zodiac: string
): React.FC<React.SVGProps<SVGSVGElement>> | null => {
  const key = zodiac.trim().toLowerCase() as keyof typeof ZodiacIcons;
  const icon = ZodiacIcons[key];
  return icon !== undefined ? icon : null;
};

export interface ChapterProps {
  bundle: MonthlyConsultationBundle;
  monthSelector?: React.ReactNode;
}

/** Scorecard direction vs prior month. */
type ScorecardTrend = "up" | "down" | "flat";

/**
 * Arrow glyph, English label, and palette color for a scorecard trend.
 */
const scorecardTrendMeta = (
  t: ScorecardTrend
): { word: string; arrow: string; color: string } => {
  if (t === "up") {
    return { word: "rising", arrow: "↑", color: "#047857" };
  }
  if (t === "down") {
    return { word: "easing", arrow: "↓", color: "#c2410c" };
  }
  return { word: "steady", arrow: "→", color: C.muted };
};

/**
 * Map scorecard row labels to area icon variants.
 */
const scorecardAreaIcon = (label: string): AreaIconKind => {
  const lower = label.toLowerCase();
  if (lower.includes("career") || lower.includes("work")) {
    return "career";
  }
  if (lower.includes("wealth") || lower.includes("money")) {
    return "wealth";
  }
  if (lower.includes("relationship") || lower.includes("people")) {
    return "relationships";
  }
  return "health";
};

/**
 * Soft family colour for a star cue row (visual accent only).
 */
const starFamilyColor = (star: string, kind: string): string => {
  if (kind === "borrowed-star") {
    return C.gold;
  }
  if (kind === "empty-meaning") {
    return C.coral;
  }
  return starFamilyAccent(star);
};

/**
 * Split a characteristics paragraph into up to three short keyword chips.
 */
const characteristicChips = (text: string): string[] => {
  const parts = text
    .split(/[.,;]/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0 && part.length <= 42);
  return parts.slice(0, 3);
};

/**
 * Season pill for Cover meta.
 */
const SeasonPill: React.FC<{ season: string }> = ({ season }) => (
  <span
    className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full"
    style={{ background: `${C.gold}22`, color: C.navy, border: `1px solid ${C.border}` }}
  >
    <span aria-hidden="true">◎</span>
    {season}
  </span>
);

/** Overview / cover. */
export const ChapterCover: React.FC<ChapterProps> = ({ bundle, monthSelector }) => (
  <ChapterShell
    id="cover"
    icon="cover"
    eyebrow={bundle.profileName}
    title="Your monthly briefing"
    subtitle={bundle.headline}
  >
    {monthSelector}
    <p
      className="text-3xl md:text-4xl font-bold leading-tight"
      style={{
        fontFamily: "Georgia, 'Times New Roman', serif",
        letterSpacing: "-0.02em",
        background: `linear-gradient(135deg, ${C.navy} 0%, ${C.coralDark} 55%, ${C.coral} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
      }}
    >
      {bundle.monthLabel}
    </p>
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
      {[
        {
          label: "Focus",
          value: [
            bundle.stack.liuYueLifeChartPalaceNameEnglish.replace(/ Palace$/i, ""),
            `(natal ${bundle.stack.liuYueLifePalaceNameEnglish.replace(/ Palace$/i, "")})`,
          ].join(" "),
        },
        { label: "Season", value: liuSeasonShort(bundle.briefing.season), pill: true },
        { label: "Priority", value: bundle.briefing.priority },
        {
          label: "Decade",
          value:
            bundle.stack.daXian !== null
              ? `Y${String(bundle.stack.daXian.yearInCycle)}/10, ${bundle.stack.daXian.palaceNameEnglish}`
              : "N/A",
        },
        {
          label: "Year",
          value: bundle.stack.liuNianPalaceNameEnglish ?? "N/A",
        },
        { label: "Area", value: bundle.briefing.area },
      ].map((item) => (
        <div
          key={item.label}
          className="rounded-2xl p-3"
          style={{
            background: "rgba(255,255,255,0.65)",
            border: `1px solid ${C.border}`,
          }}
        >
          <SectionHeading color={C.coral} className="mb-1" as="p">
            {item.label}
          </SectionHeading>
          {"pill" in item && item.pill === true ? (
            <SeasonPill season={item.value} />
          ) : (
            <p className="text-sm font-semibold leading-snug" style={{ color: C.navy }}>
              {item.value}
            </p>
          )}
        </div>
      ))}
    </div>

    {bundle.stemActivations.length > 0 && (
      <div>
        <SectionHeading color={C.gold}>Active this month</SectionHeading>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {bundle.stemActivations.map((a) => {
            const color = SI_HUA_COLOR[a.kind];
            const kindLabel = SI_HUA_LABEL[a.kind];
            const kindHint = a.kind === "化禄"
              ? "Openings"
              : a.kind === "化权"
                ? "Authority"
                : a.kind === "化科"
                  ? "Recognition"
                  : "Repair";
            return (
              <div
                key={`${a.kind}-${a.starName}-${String(a.landingPalaceNumber)}`}
                className="rounded-2xl p-3.5 flex gap-3 items-center"
                style={{
                  background: "rgba(255,255,255,0.8)",
                  border: `1px solid ${C.border}`,
                  borderLeft: `4px solid ${color}`,
                }}
              >
                <span
                  className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
                  style={{ background: `${color}16` }}
                  aria-hidden="true"
                >
                  <SiHuaGlyph kind={a.kind} size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold" style={{ color: C.navy }}>
                      {starToEnglish(a.starName)}
                    </p>
                    <span
                      className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                      style={{ background: `${color}18`, color }}
                    >
                      {kindLabel}
                    </span>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                    {kindHint}
                    {" · lands in "}
                    {activationLandingEnglish(a).replace(/ Palace$/i, "")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    )}
    <div>
      <SectionHeading color={C.coral}>Month contract</SectionHeading>
      <ContractCard contract={bundle.monthContract} />
    </div>
  </ChapterShell>
);

/** Personal pattern chapter. */
export const ChapterRarity: React.FC<ChapterProps> = ({ bundle }) => {
  const layers = bundle.rarity.stackSummary.map((line, index) => {
    const labels = ["Decade", "Month", "Signal"];
    const label = labels[index] ?? `Layer ${String(index + 1)}`;
    const colon = line.indexOf(":");
    const value = colon >= 0 ? line.slice(colon + 1).trim() : line;
    return { label, value };
  });

  return (
    <ChapterShell
      id="rarity"
      icon="rarity"
      eyebrow="This month"
      title="Why this month is about you"
    >
      <RarityLayers
        layers={layers}
        priorCount={bundle.rarity.priorCount}
        priorOccurrences={bundle.rarity.priorOccurrences}
      />
      <div>
        <SectionHeading color={C.coral}>What to focus on</SectionHeading>
        <div className="space-y-2">
          {bundle.rarity.usualAskLines.map((line, index) => (
            <div
              key={line}
              className="rounded-2xl px-4 py-3 flex gap-3 items-start"
              style={{
                background: "rgba(255,255,255,0.78)",
                border: `1px solid ${C.border}`,
              }}
            >
              <span
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
                style={{ background: `${C.coral}16`, color: C.coral }}
                aria-hidden="true"
              >
                {String(index + 1)}
              </span>
              <p className="text-sm font-medium leading-snug pt-0.5" style={{ color: C.navy }}>
                {line}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div>
        <SectionHeading color="#047857">Three things to do</SectionHeading>
        <StepFlow
          accent="#047857"
          steps={bundle.rarity.actionSteps.slice(0, 3).map((text) => ({ text }))}
        />
      </div>
    </ChapterShell>
  );
};

/** Stem activations as supporting signal cards. */
export const ChapterActivations: React.FC<ChapterProps> = ({ bundle }) => {
  const cards = bundle.activationCards;

  return (
    <ChapterShell
      id="activations"
      icon="activations"
      eyebrow="Signals"
      title="This month's activations"
    >
      {cards.length === 0 ? (
        <p className="text-sm" style={{ color: C.muted }}>
          No stem activations resolved for this month.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((card) => {
            const kind = kindFromActivationTitle(card.title);
            const stripe = card.urgencyRank === 1 ? C.coral : C.gold;
            const glyphKind: SiHuaKind = kind ?? "化禄";
            return (
              <div
                key={`${card.urgencyRank}-${card.title}-${card.landing}`}
                className="rounded-2xl overflow-hidden flex"
                style={{
                  background: "rgba(255,255,255,0.78)",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="w-1.5 shrink-0" style={{ background: stripe }} aria-hidden="true" />
                <div className="flex-1 p-4 flex gap-3">
                  <span
                    className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center"
                    style={{
                      background: `${SI_HUA_COLOR[glyphKind]}18`,
                      border: `2px solid ${SI_HUA_COLOR[glyphKind]}55`,
                    }}
                  >
                    <SiHuaGlyph kind={glyphKind} size={26} />
                  </span>
                  <div className="min-w-0">
                    <p
                      className="text-[10px] font-bold uppercase tracking-wider"
                      style={{ color: stripe }}
                    >
                      {card.urgencyLabel}
                    </p>
                    <p className="text-sm font-semibold mt-0.5" style={{ color: C.navy }}>
                      {card.title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: C.coral }}>
                      {card.landing}
                    </p>
                    <p className="text-xs mt-2" style={{ color: C.muted }}>
                      {card.meaning}
                    </p>
                    <p className="text-sm mt-2 font-medium" style={{ color: C.navy }}>
                      {card.move}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ChapterShell>
  );
};

/** Natal / borrowed / open focus stars. */
export const ChapterStars: React.FC<ChapterProps> = ({ bundle }) => {
  const sourceMode = bundle.focusStarSource.mode;
  const isOpenPalace = sourceMode === "open";
  const isBorrowed = sourceMode === "borrowed";
  const oppositeEnglish = bundle.focusStarSource.borrowedFromPalaceNameEnglish;
  const focusEnglish = bundle.focusStarSource.focusPalaceNameEnglish;

  const title = (() => {
    if (isBorrowed && oppositeEnglish !== null) {
      return `Stars for ${focusEnglish} (from ${oppositeEnglish})`;
    }
    if (isOpenPalace) {
      return `Open stage in ${focusEnglish}`;
    }
    return `Stars in ${focusEnglish}`;
  })();

  const subtitle = (() => {
    if (isBorrowed && oppositeEnglish !== null) {
      return [
        "No natal main stars in this focus.",
        `Reading the opposite palace (${oppositeEnglish}) per Zi Wei Dou Shu borrow rule.`,
      ].join(" ");
    }
    if (isOpenPalace) {
      return "No natal main stars here, and the opposite palace is also open. Lean on month activations.";
    }
    return "Your natal stars in this month's focus.";
  })();

  if (isOpenPalace) {
    const teaching = bundle.starSpotlight.filter((r) => r.kind === "empty-meaning");
    const cta = teaching.find((r) => r.star.toLowerCase().includes("activation"))
      ?? teaching[teaching.length - 1];
    return (
      <ChapterShell id="stars" icon="stars" eyebrow="Your chart" title={title} subtitle={subtitle}>
        <div
          className="rounded-3xl p-8 text-center"
          style={{
            background: `linear-gradient(160deg, ${C.coral}12, ${C.gold}18)`,
            border: `1px dashed ${C.border}`,
          }}
        >
          <p className="text-4xl mb-3" aria-hidden="true">○</p>
          <p className="text-lg font-bold mb-2" style={{ color: C.navy }}>
            Open palace
          </p>
          <p className="text-sm leading-relaxed max-w-md mx-auto" style={{ color: C.muted }}>
            {teaching[0]?.cue ?? "Less fixed personality pressure here. Month activations lead."}
          </p>
          {cta !== undefined && (
            <p
              className="mt-4 inline-block text-sm font-semibold px-4 py-2 rounded-full"
              style={{ background: C.coral, color: "#fff" }}
            >
              {cta.star}
            </p>
          )}
        </div>
      </ChapterShell>
    );
  }

  return (
    <ChapterShell id="stars" icon="stars" eyebrow="Your chart" title={title} subtitle={subtitle}>
      <div className="space-y-2">
        {bundle.starSpotlight.map((row) => {
          const accent = starFamilyColor(row.star, row.kind);
          const isBorrowedRow = row.kind === "borrowed-star";
          return (
            <div
              key={`${row.kind}-${row.star}`}
              className="rounded-2xl px-4 py-3 relative overflow-hidden"
              style={{
                background: "rgba(255,255,255,0.78)",
                border: `1px solid ${C.border}`,
                borderLeft: `4px solid ${accent}`,
              }}
            >
              {isBorrowedRow && (
                <span
                  className="absolute top-0 right-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl-lg"
                  style={{ background: C.gold, color: "#fff" }}
                >
                  Borrowed
                </span>
              )}
              <div className="flex items-start gap-3">
                <span
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: `${accent}18`, color: accent }}
                  aria-hidden="true"
                >
                  <StarFamilyGlyph starName={row.star} color={accent} size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-bold" style={{ color: C.navy }}>
                    {row.star}
                  </p>
                  <p className="text-xs mt-1 leading-snug" style={{ color: C.muted }}>
                    {row.cue}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ChapterShell>
  );
};

/** Timing agreement score. */
export const ChapterConvergence: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="convergence"
    icon="convergence"
    eyebrow="Timing sync"
    title="How aligned are your timing layers?"
    subtitle={bundle.convergence.summary}
  >
    <div className="flex flex-col sm:flex-row gap-6 items-stretch">
      <div
        className="rounded-2xl p-5 sm:w-44 shrink-0 flex flex-col items-center justify-center"
        style={{
          background: `linear-gradient(145deg, ${C.coral}22, ${C.gold}28)`,
          border: `1px solid ${C.border}`,
        }}
      >
        <p className="text-[10px] font-bold uppercase tracking-wide mb-3" style={{ color: C.muted }}>
          Alignment
        </p>
        <ChapterIllustration
          kind="convergence-ring"
          score={bundle.convergence.score}
          label={bundle.convergence.label}
        />
        <p className="text-[10px] mt-3 leading-snug text-center" style={{ color: C.muted }}>
          Not a luck score
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <AlignmentBands
          convergence={bundle.convergence}
          decadeLabel={dayunSeasonPlain(bundle.convergence.daXianSeason)}
          yearLabel={dayunSeasonPlain(bundle.convergence.liuNianSeason)}
          monthLabel={dayunSeasonPlain(bundle.convergence.liuYueSeason)}
        />
      </div>
    </div>
    <div className="space-y-2">
      {bundle.convergence.tips.map((tip, index) => (
        <div
          key={tip}
          className="rounded-2xl px-4 py-3 flex gap-3 items-start"
          style={{
            background: "rgba(255,255,255,0.78)",
            border: `1px solid ${C.border}`,
          }}
        >
          <span
            className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-bold"
            style={{ background: `${C.gold}22`, color: C.coralDark }}
            aria-hidden="true"
          >
            {String(index + 1)}
          </span>
          <p className="text-sm font-medium leading-snug pt-0.5" style={{ color: C.navy }}>
            {tip}
          </p>
        </div>
      ))}
    </div>
  </ChapterShell>
);

/** Named month archetype. */
export const ChapterArchetype: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="archetype"
    icon="archetype"
    eyebrow="Month theme"
    title={bundle.archetype.name}
    subtitle={bundle.archetype.identityLine}
  >
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        background: "rgba(255,255,255,0.8)",
        borderLeft: `4px solid ${C.coral}`,
        border: `1px solid ${C.border}`,
      }}
    >
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C.coral }}>
        Identity line
      </p>
      <p
        className="text-base italic leading-snug"
        style={{ color: C.navy, fontFamily: "Georgia, 'Times New Roman', serif" }}
      >
        “{bundle.archetype.identityLine}”
      </p>
    </div>
    <div>
      <SectionHeading color={C.coral}>You may notice</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {bundle.archetype.signatureBehaviors.slice(0, 3).map((b, index) => {
          const accents = [C.coral, C.gold, C.navy] as const;
          const accent = accents[index] ?? C.coral;
          return (
            <div
              key={b}
              className="rounded-2xl p-3.5"
              style={{
                background: "rgba(255,255,255,0.75)",
                border: `1px solid ${C.border}`,
                borderLeft: `4px solid ${accent}`,
              }}
            >
              <span
                className="inline-flex w-7 h-7 rounded-lg items-center justify-center text-[11px] font-bold mb-2"
                style={{ background: `${accent}18`, color: accent }}
                aria-hidden="true"
              >
                {String(index + 1)}
              </span>
              <p className="text-sm leading-snug" style={{ color: C.navy }}>
                {b}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </ChapterShell>
);

/** Life dimensions scorecard with recharts bars. */
export const ChapterScorecard: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="scorecard"
    icon="scorecard"
    eyebrow="Scorecard"
    title="Four areas this month"
  >
    <BarGroup rows={bundle.scorecard} />
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {bundle.scorecard.map((row) => {
        const trend = scorecardTrendMeta(row.trendVsPrior);
        const area = scorecardAreaIcon(row.label);
        return (
          <div
            key={row.label}
            className="rounded-2xl px-3.5 py-3"
            style={{ background: "rgba(255,255,255,0.75)", border: `1px solid ${C.border}` }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: C.navy }}>
                <ChapterIllustration kind="area-icon" area={area} />
                {row.label}
              </span>
              <span className="text-xs font-bold" style={{ color: trend.color }}>
                {trend.arrow} {trend.word}
              </span>
            </div>
          </div>
        );
      })}
    </div>
    <div
      className="rounded-2xl px-4 py-3 text-sm font-medium"
      style={{ background: `${C.gold}18`, border: `1px solid ${C.border}`, color: C.navy }}
    >
      Protect / press: {bundle.scorecardProtectPress}
    </div>
  </ChapterShell>
);

/**
 * Shared deep-dive layout for Career / Wealth / Relationship:
 * stars first (natal or opposite borrow), then short Do / Avoid.
 */
const AspectDeepDive: React.FC<{
  id: "career" | "wealth" | "relationships";
  title: string;
  snapshot: MonthlyStarSnapshot | null;
  starSource: FocusStarSource | null;
  actions: string[];
  watch: string[];
}> = ({ id, title, snapshot, starSource, actions, watch }) => {
  const starsEn = (starSource?.displayMainStars ?? []).map(starToEnglish);
  const focusLabel =
    starSource?.focusPalaceNameEnglish.replace(/ Palace$/i, "")
    ?? snapshot?.chartPalaceNameEnglish.replace(/ Palace$/i, "")
    ?? title;
  const borrowedLabel =
    starSource?.mode === "borrowed" && starSource.borrowedFromPalaceNameEnglish !== null
      ? starSource.borrowedFromPalaceNameEnglish.replace(/ Palace$/i, "")
      : null;

  return (
    <ChapterShell id={id} icon={id} eyebrow={title} title={title}>
      <div>
        <SectionHeading color={C.gold}>Stars</SectionHeading>
        {starsEn.length > 0 ? (
          <>
            {borrowedLabel !== null && (
              <p className="text-xs mb-2" style={{ color: C.muted }}>
                {focusLabel} is open — showing stars from opposite {borrowedLabel}
              </p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {starsEn.map((star) => {
                const accent = starFamilyAccent(star);
                return (
                  <div
                    key={star}
                    className="rounded-2xl px-3.5 py-3 flex gap-3 items-center"
                    style={{
                      background: "rgba(255,255,255,0.78)",
                      border: `1px solid ${C.border}`,
                      borderLeft: `4px solid ${accent}`,
                    }}
                  >
                    <span
                      className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}16` }}
                      aria-hidden="true"
                    >
                      <StarFamilyGlyph starName={star} size={22} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-bold" style={{ color: C.navy }}>
                        {star}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                        {borrowedLabel !== null
                          ? `from ${borrowedLabel}`
                          : `in ${focusLabel}`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div
            className="rounded-2xl px-4 py-3 text-sm"
            style={{
              background: "rgba(255,255,255,0.78)",
              border: `1px solid ${C.border}`,
              color: C.muted,
            }}
          >
            No natal main stars in {focusLabel} or its opposite. Lead with the Do / Avoid below.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <SectionHeading color="#047857">Do</SectionHeading>
          <ActionTileList items={actions} tone="do" max={3} />
        </div>
        <div>
          <SectionHeading color="#c2410c">Avoid</SectionHeading>
          <ActionTileList items={watch} tone="avoid" max={3} />
        </div>
      </div>
    </ChapterShell>
  );
};

export const ChapterCareer: React.FC<ChapterProps> = ({ bundle }) => (
  <AspectDeepDive
    id="career"
    title="Career"
    snapshot={bundle.aspectPalaces.career}
    starSource={bundle.aspectPlaybooks.career.starSource}
    actions={bundle.aspectPlaybooks.career.doThis}
    watch={bundle.aspectPlaybooks.career.watchOut}
  />
);

export const ChapterWealth: React.FC<ChapterProps> = ({ bundle }) => (
  <AspectDeepDive
    id="wealth"
    title="Wealth"
    snapshot={bundle.aspectPalaces.wealth}
    starSource={bundle.aspectPlaybooks.wealth.starSource}
    actions={bundle.aspectPlaybooks.wealth.doThis}
    watch={bundle.aspectPlaybooks.wealth.watchOut}
  />
);

export const ChapterRelationships: React.FC<ChapterProps> = ({ bundle }) => (
  <AspectDeepDive
    id="relationships"
    title="Relationship"
    snapshot={bundle.aspectPalaces.relationships}
    starSource={bundle.aspectPlaybooks.relationships.starSource}
    actions={bundle.aspectPlaybooks.relationships.doThis}
    watch={bundle.aspectPlaybooks.relationships.watchOut}
  />
);

export const ChapterHealth: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="health"
    icon="health"
    eyebrow="Body"
    title="How your body may feel this month"
    subtitle={bundle.somatic.elementPressure}
  >
    <div>
      <SectionHeading color={C.coral}>Week by week body signals</SectionHeading>
      <BodySignalTimeline weeks={bundle.somatic.weekSignals} />
    </div>
    <div>
      <SectionHeading color={C.coral}>What to do for your body</SectionHeading>
      <BodyProtocolStrip items={bundle.somatic.protocol} />
    </div>
  </ChapterShell>
);

/** Four-week action calendar. */
export const ChapterWeeks: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="weeks"
    icon="weeks"
    eyebrow="Calendar"
    title="What to do each week"
  >
    <WeekTileRow weeks={bundle.weekPlan} />
  </ChapterShell>
);

export const ChapterFailure: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="failure"
    icon="failure"
    eyebrow="Trap"
    title="The trap to watch this month"
    subtitle="This is the most common way this month goes wrong."
  >
    <div
      className="rounded-2xl px-4 py-3.5 flex items-center gap-3"
      style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
    >
      <span
        className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ background: `${C.coral}22`, color: C.coral }}
        aria-hidden="true"
      >
        <InlineSvgWarning size={24} />
      </span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: C.coral }}>
          Named trap
        </p>
        <p className="text-base font-bold" style={{ color: C.navy }}>
          {bundle.failureMode.name}
        </p>
      </div>
    </div>
    <WarmCard title="What goes wrong" tone="coral">
      {bundle.failureMode.description}
    </WarmCard>
    <div>
      <SectionHeading color={C.coral}>You will notice it when</SectionHeading>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {bundle.failureMode.howItShows.slice(0, 2).map((h) => (
          <div
            key={h}
            className="rounded-2xl p-3.5 flex gap-2.5"
            style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
          >
            <span className="shrink-0 mt-0.5" aria-hidden="true">
              <InlineSvgFlag size={18} />
            </span>
            <p className="text-sm leading-snug" style={{ color: C.navy }}>
              {h}
            </p>
          </div>
        ))}
      </div>
    </div>
    <div
      className="rounded-2xl p-4 flex gap-3 items-start"
      style={{ background: "#ecfdf5", border: "1px solid #a7f3d0" }}
    >
      <span
        className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
        style={{ background: "#04785722", color: "#047857" }}
        aria-hidden="true"
      >
        →
      </span>
      <div>
        <SectionHeading color="#047857" className="mb-1">
          How to get out
        </SectionHeading>
        <p className="text-sm leading-snug font-medium" style={{ color: C.navy }}>
          {bundle.failureMode.exitMove}
        </p>
      </div>
    </div>
  </ChapterShell>
);

/** Speakable scripts. */
export const ChapterScripts: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="scripts"
    icon="scripts"
    eyebrow="Exact words"
    title="Words you can copy and say"
    subtitle="Short lines for awkward moments. Replace the bracketed parts with your real details."
  >
    <div className="space-y-3">
      {bundle.scripts.map((s, index) => (
        <SpeechBubbleCard key={s.situation} script={s} index={index} />
      ))}
    </div>
  </ChapterShell>
);

export const ChapterNobleman: React.FC<ChapterProps> = ({ bundle }) => {
  const data = bundle.nobleman;
  const ZodiacIcon = data !== null ? zodiacIconForName(data.zodiac) : null;

  return (
    <ChapterShell
      id="nobleman"
      icon="nobleman"
      eyebrow="Allies"
      title="Who can help"
      subtitle={
        data !== null
          ? `${data.palaceName}. Look for ${data.zodiac} energy.`
          : "Ally details are not available for this focus area."
      }
    >
      {data !== null && (
        <>
          <div
            className="rounded-2xl p-3 flex items-center gap-3"
            style={{ background: "rgba(255,255,255,0.7)", border: `1px solid ${C.border}` }}
          >
            {ZodiacIcon !== null && (
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: `${C.gold}22` }}
              >
                <ZodiacIcon width={28} height={28} aria-hidden />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-semibold" style={{ color: C.navy }}>
                  {data.zodiac}
                </p>
                <span
                  className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: `${C.coral}18`, color: C.coral }}
                >
                  Activation trigger
                </span>
              </div>
              <p className="text-xs mt-0.5" style={{ color: C.muted }}>
                Example years: {data.yearExamples.map(String).join(", ")}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.matchedProfiles.slice(0, 2).map((p) => (
              <article
                key={p.type}
                className="rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.75)", border: `1px solid ${C.border}` }}
              >
                <div className="aspect-[4/5] w-full overflow-hidden" style={{ background: `${C.gold}18` }}>
                  <img
                    src={getNoblemanImageForProfileType(p.type)}
                    alt={p.type}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <div className="p-3">
                  <SectionHeading color={C.coral} className="mb-1">
                    {p.type}
                  </SectionHeading>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {characteristicChips(p.characteristics).map((chip) => (
                      <span
                        key={chip}
                        className="text-[10px] font-semibold px-2 py-1 rounded-full"
                        style={{
                          background: `${C.gold}18`,
                          border: `1px solid ${C.border}`,
                          color: C.navy,
                        }}
                      >
                        {chip}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div>
            <SectionHeading color={C.coral}>Limit these</SectionHeading>
            <div className="space-y-2">
              {bundle.cautionList.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl px-4 py-3 flex gap-3"
                  style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
                >
                  <span
                    className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm"
                    style={{ background: "#c2410c18", color: "#c2410c" }}
                    aria-hidden="true"
                  >
                    !
                  </span>
                  <div>
                    <p className="text-sm font-semibold" style={{ color: C.navy }}>{c.label}</p>
                    <p className="text-xs mt-1" style={{ color: C.muted }}>{c.why}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </ChapterShell>
  );
};

/**
 * Season colour dot for year climate cells.
 */
const seasonDotColor = (season: string): string => {
  const s = season.toLowerCase();
  if (s.includes("grow") || s.includes("expansion")) {
    return "#16a34a";
  }
  if (s.includes("harvest") || s.includes("visibility")) {
    return C.gold;
  }
  if (s.includes("protect") || s.includes("consolidation")) {
    return C.coral;
  }
  return "#2563eb";
};

export const ChapterContinuity: React.FC<ChapterProps> = ({ bundle }) => (
  <ChapterShell
    id="continuity"
    icon="continuity"
    eyebrow="Year view"
    title="The year map"
    subtitle="Twelve lunar months for this year. Current month is highlighted."
  >
    <YearRadialMap months={bundle.yearClimate} />
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {bundle.yearClimate.map((row) => {
        const short = liuSeasonShort(row.season);
        const dot = seasonDotColor(short);
        return (
          <div
            key={row.lunarMonth}
            className="rounded-xl px-2.5 py-2.5 text-xs flex flex-col gap-1"
            style={{
              background: row.isCurrent ? `${C.coral}18` : "rgba(255,255,255,0.65)",
              border: `1px solid ${row.isCurrent ? C.coral : C.border}`,
              color: C.navy,
              fontWeight: row.isCurrent ? 700 : 400,
              boxShadow: row.isCurrent ? `0 4px 14px ${C.coral}33` : undefined,
              transform: row.isCurrent ? "scale(1.02)" : undefined,
            }}
          >
            <div className="flex items-center justify-between gap-1">
              <span>M{row.lunarMonth}</span>
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: dot }}
                title={short}
                aria-hidden="true"
              />
            </div>
            <span>{row.palaceNameEnglish}</span>
            <span style={{ color: C.muted }}>{short}</span>
          </div>
        );
      })}
    </div>
  </ChapterShell>
);

export const ChapterLetter: React.FC<ChapterProps> = ({ bundle }) => {
  const close = bundle.letter.operationalClose;
  const closeContract = {
    primaryMove: close.decision,
    deadline: close.deadline,
    successMeasure: close.successMeasure,
    antiPattern: bundle.monthContract.antiPattern,
  };

  return (
    <ChapterShell
      id="letter"
      icon="letter"
      eyebrow="Close"
      title="A note for you"
    >
      <p className="text-sm font-semibold" style={{ color: C.navy }}>
        {bundle.letter.greeting}
      </p>
      <ContractCard contract={closeContract} compact />
      <div
        className="rounded-2xl px-4 py-3 flex gap-3 items-center"
        style={{
          background: `${C.navy}0a`,
          border: `1px solid ${C.border}`,
          borderLeft: `4px solid ${C.navy}`,
        }}
      >
        <span
          className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
          style={{ background: `${C.navy}18`, color: C.navy }}
          aria-hidden="true"
        >
          →
        </span>
        <p className="text-sm leading-snug font-medium" style={{ color: C.navy }}>
          {close.nextMonthBridge}
        </p>
      </div>
      {bundle.letter.closing.trim().length > 0 && (
        <p className="text-sm italic" style={{ color: C.coral }}>
          {bundle.letter.closing}
        </p>
      )}
    </ChapterShell>
  );
};

/**
 * Funnel chapter order (Checklist / Decisions removed):
 * orient → frame → chart proof → life areas → act → close.
 * Keep MONTHLY_CHAPTERS and MonthlyConsultationBody in the same sequence.
 */
export const MONTHLY_CHAPTER_IDS = [
  "cover",
  "archetype",
  "rarity",
  "convergence",
  "activations",
  "stars",
  "scorecard",
  "career",
  "wealth",
  "relationships",
  "health",
  "failure",
  "weeks",
  "nobleman",
  "continuity",
  "letter",
] as const;

export type MonthlyChapterId = (typeof MONTHLY_CHAPTER_IDS)[number];

export const MONTHLY_CHAPTERS: Array<{ id: MonthlyChapterId; label: string; sub: string }> = [
  { id: "cover", label: "Overview", sub: "At a glance" },
  { id: "archetype", label: "Theme", sub: "Month name" },
  { id: "rarity", label: "This month", sub: "Why it is yours" },
  { id: "convergence", label: "Sync", sub: "Alignment score" },
  { id: "activations", label: "Signals", sub: "Activations" },
  { id: "stars", label: "Stars", sub: "Focus palace" },
  { id: "scorecard", label: "Scorecard", sub: "Four areas" },
  { id: "career", label: "Career", sub: "Do / avoid" },
  { id: "wealth", label: "Wealth", sub: "Do / avoid" },
  { id: "relationships", label: "Relationship", sub: "Do / avoid" },
  { id: "health", label: "Body", sub: "How you may feel" },
  { id: "failure", label: "Trap", sub: "What to avoid" },
  { id: "weeks", label: "Weeks", sub: "Action calendar" },
  { id: "nobleman", label: "Allies", sub: "Help + limits" },
  { id: "continuity", label: "Year", sub: "Map" },
  { id: "letter", label: "Note", sub: "Close" },
];

export const MonthlyConsultationBody: React.FC<{
  bundle: MonthlyConsultationBundle;
  monthSelector?: React.ReactNode;
}> = ({ bundle, monthSelector }) => (
  <>
    <ChapterCover bundle={bundle} monthSelector={monthSelector} />
    <ChapterArchetype bundle={bundle} />
    <ChapterRarity bundle={bundle} />
    <ChapterConvergence bundle={bundle} />
    <ChapterActivations bundle={bundle} />
    <ChapterStars bundle={bundle} />
    <ChapterScorecard bundle={bundle} />
    <ChapterCareer bundle={bundle} />
    <ChapterWealth bundle={bundle} />
    <ChapterRelationships bundle={bundle} />
    <ChapterHealth bundle={bundle} />
    <ChapterFailure bundle={bundle} />
    <ChapterWeeks bundle={bundle} />
    <ChapterNobleman bundle={bundle} />
    <ChapterContinuity bundle={bundle} />
    <ChapterLetter bundle={bundle} />
  </>
);
