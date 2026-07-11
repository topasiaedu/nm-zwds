import React from "react";
import { Sparkles, type LucideIcon } from "lucide-react";
import { BrandGradientText } from "../../BrandGradientText";

export type HighlightCardTheme = {
  accent: string;
  accentSecondary: string;
  iconBg: string;
};

/** Rotating accent themes: coral, orange, gold. */
export const ROTATING_HIGHLIGHT_THEMES: readonly HighlightCardTheme[] = [
  { accent: "#C84C5C", accentSecondary: "#E11D48", iconBg: "rgba(200, 76, 92, 0.14)" },
  { accent: "#EA580C", accentSecondary: "#F97316", iconBg: "rgba(234, 88, 12, 0.14)" },
  { accent: "#CA8A04", accentSecondary: "#EAB308", iconBg: "rgba(202, 138, 4, 0.14)" },
] as const;

export const MUTED_HIGHLIGHT_THEME: HighlightCardTheme = {
  accent: "#6B7280",
  accentSecondary: "#9CA3AF",
  iconBg: "rgba(107, 114, 128, 0.14)",
};

/** Single brand accent for flat editorial rows and trait chips. */
export const BRAND_EDITORIAL_HIGHLIGHT_THEME: HighlightCardTheme = {
  accent: "#6B5B95",
  accentSecondary: "#8B1167",
  iconBg: "rgba(107, 91, 149, 0.14)",
};

const flatTraitChipClass = [
  "inline-flex items-center rounded-full border px-4 py-2 font-serif text-sm font-semibold leading-snug",
  "border-brand-purple/25 bg-brand-purple/10 text-brand-purple",
  "dark:border-accent-gold/30 dark:bg-accent-gold/10 dark:text-accent-gold",
  "sm:text-base",
].join(" ");

const flatCardBorderClass =
  "border-l-brand-purple/40 dark:border-l-accent-goldDark/50";

const flatIconTileClass = [
  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
  "border-2 border-accent-gold/60 bg-navy shadow-sm dark:bg-navy sm:h-12 sm:w-12",
].join(" ");

export type PptHighlightCardProps = {
  theme: HighlightCardTheme;
  icon: LucideIcon;
  highlight: string;
  leadIn?: string;
  trailing?: string;
  /** When true, shows label only in neutral text (no lead-in, trailing, or accent color). */
  plainHighlight?: boolean;
  forPdfCapture?: boolean;
  /** `"card"`: white PPT shell (default). `"flat"`: transparent editorial row with left accent. */
  variant?: "card" | "flat";
};

/**
 * PPT-style horizontal card: left accent stripe, ringed icon, serif copy with highlight.
 */
export const PptHighlightCard: React.FC<PptHighlightCardProps> = ({
  theme,
  icon: Icon,
  leadIn,
  highlight,
  trailing,
  plainHighlight = false,
  forPdfCapture,
  variant = "card",
}) => {
  const isFlat = variant === "flat";
  const hoverClass =
    !isFlat && !forPdfCapture ? "transition-shadow duration-300 hover:shadow-lg" : "";

  const articleClass = isFlat
    ? `relative flex items-center gap-4 border-l-4 py-3 pl-5 sm:gap-5 ${flatCardBorderClass}`
    : `relative flex items-center gap-4 overflow-hidden rounded-2xl border border-gray-100/90 bg-white px-5 py-4 shadow-md dark:border-gray-700/60 dark:bg-gray-800/95 sm:gap-5 sm:px-6 sm:py-5 ${hoverClass}`;

  return (
    <article className={articleClass}>
      {!isFlat ? (
        <div
          className="absolute bottom-0 left-0 top-0 w-1.5"
          style={{
            background: `linear-gradient(180deg, ${theme.accent} 0%, ${theme.accentSecondary} 100%)`,
          }}
          aria-hidden="true"
        />
      ) : null}

      <div
        className={
          isFlat
            ? flatIconTileClass
            : "relative ml-1 flex shrink-0 items-center justify-center sm:ml-2"
        }
      >
        {!isFlat ? (
          <>
            <div
              className="absolute h-14 w-14 rounded-full border-2 opacity-25 sm:h-16 sm:w-16"
              style={{ borderColor: theme.accent }}
              aria-hidden="true"
            />
            <div
              className="relative flex h-11 w-11 items-center justify-center rounded-full sm:h-12 sm:w-12"
              style={{ backgroundColor: theme.iconBg }}
            >
              <Icon
                className="h-5 w-5 sm:h-6 sm:w-6"
                style={{ color: theme.accent }}
                aria-hidden="true"
              />
            </div>
            <Sparkles
              className="absolute -right-0.5 -top-0.5 h-3 w-3 text-accent-gold opacity-80"
              aria-hidden="true"
            />
          </>
        ) : (
          <Icon
            className="h-5 w-5 text-accent-goldDark dark:text-accent-gold sm:h-6 sm:w-6"
            aria-hidden="true"
          />
        )}
      </div>

      <p className="min-w-0 flex-1 font-serif text-sm leading-relaxed text-theme-fg sm:text-base">
        {plainHighlight ? (
          <span className="font-medium">{highlight}</span>
        ) : (
          <>
            {leadIn ? `${leadIn} ` : null}
            {isFlat ? (
              <BrandGradientText as="span" className="font-bold italic">
                {highlight}
              </BrandGradientText>
            ) : (
              <span
                className="font-bold italic"
                style={{ color: theme.accent }}
              >
                {highlight}
              </span>
            )}
            {trailing ? ` ${trailing}` : null}
          </>
        )}
      </p>
    </article>
  );
};

export type PptHighlightGroupHeaderProps = {
  variant: "brand" | "muted";
  beforeText: string;
  emphasisText: string;
  afterText?: string;
};

/**
 * Section title styled like the PPT "for you if" hero.
 */
export const PptHighlightGroupHeader: React.FC<PptHighlightGroupHeaderProps> = ({
  variant,
  beforeText,
  emphasisText,
  afterText = ":",
}) => {
  if (variant === "brand") {
    return (
      <div className="relative mb-6 text-center">
        <Sparkles
          className="absolute left-4 top-0 h-4 w-4 text-accent-gold/70 sm:left-8"
          aria-hidden="true"
        />
        <Sparkles
          className="absolute right-4 top-2 h-3 w-3 text-accent-gold/60 sm:right-8"
          aria-hidden="true"
        />
        <h3 className="font-serif text-xl font-bold uppercase tracking-wide text-theme-fg sm:text-2xl">
          {beforeText}{" "}
          <BrandGradientText as="span" className="italic normal-case">
            {emphasisText}
          </BrandGradientText>
          {afterText}
        </h3>
      </div>
    );
  }

  return (
    <h3 className="mb-6 text-center font-serif text-xl font-bold uppercase tracking-wide text-theme-fg sm:text-2xl">
      {beforeText}{" "}
      <span className="italic text-theme-fg-secondary">{emphasisText}</span>
      {afterText}
    </h3>
  );
};

/**
 * Flat trait chip: single brand border + tint.
 */
const PptHighlightTraitChip: React.FC<{ label: string }> = ({ label }) => (
  <span className={flatTraitChipClass}>{label}</span>
);

export type PptHighlightColumnProps = {
  header: PptHighlightGroupHeaderProps;
  items: readonly { id: string; label: string }[];
  themes: readonly HighlightCardTheme[];
  icon: LucideIcon;
  leadIn?: string;
  trailing?: string;
  plainHighlight?: boolean;
  emptyMessage: string;
  forPdfCapture?: boolean;
};

/**
 * Column of PPT highlight cards with a group header.
 * `plainHighlight` renders flat trait chips instead of stacked white cards.
 */
export const PptHighlightColumn: React.FC<PptHighlightColumnProps> = ({
  header,
  items,
  themes,
  icon,
  leadIn,
  trailing,
  plainHighlight,
  emptyMessage,
  forPdfCapture,
}) => {
  return (
    <div>
      <PptHighlightGroupHeader {...header} />
      {items.length > 0 ? (
        plainHighlight ? (
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start sm:gap-3">
            {items.map((item) => (
              <PptHighlightTraitChip key={item.id} label={item.label} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {items.map((item, idx) => (
              <PptHighlightCard
                key={item.id}
                theme={themes[idx % themes.length]}
                icon={icon}
                leadIn={leadIn}
                highlight={item.label}
                trailing={trailing}
                plainHighlight={plainHighlight}
                forPdfCapture={forPdfCapture}
              />
            ))}
          </div>
        )
      ) : (
        <p className="text-center text-sm text-theme-fg-secondary">{emptyMessage}</p>
      )}
    </div>
  );
};
