/**
 * Dashboard layout class strings.
 * Colors: src/styles/color-scheme.css → Tailwind theme-* (see colorTokens.ts).
 */

const dashboardElevatedSurface = "bg-theme-surface-card";
const dashboardInsetSurface = "bg-theme-surface-inset";

export const dashboardGlowClass = "dashboard-glow";

export const dashboardPageClass = "relative z-[1] min-h-[calc(100vh-4rem)]";

export const dashboardContainerClass =
  "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10";

export const dashboardHeroClass = [
  "mb-8 px-0 sm:px-0 py-2 sm:py-4 transition-colors duration-300",
].join(" ");

export const dashboardHeroTitleClass = "text-3xl sm:text-4xl font-bold text-theme-fg";

export const dashboardHeroSubtitleClass =
  "mt-2 text-base text-theme-fg-secondary max-w-2xl";

export const dashboardHeroMetaClass = "mt-3 text-sm text-theme-accent-muted";

export const dashboardSectionLabelClass =
  "text-xs font-semibold uppercase tracking-wider mb-1 text-theme-accent-label";

export const dashboardCardClass = [
  "rounded-2xl shadow-lg border border-theme-border",
  dashboardElevatedSurface,
  "transition-all duration-300 dark:shadow-black/20",
].join(" ");

export const dashboardTitleClass = "text-4xl font-bold text-theme-fg";

export const dashboardSubtitleClass = "text-base text-theme-fg-secondary";

export const dashboardSectionTitleClass = "text-xl font-semibold text-theme-fg mb-4";

export const dashboardActionLinkClass = [
  "block rounded-xl p-4 border border-theme-border",
  dashboardInsetSurface,
  "hover:border-theme-border-hover hover:bg-theme-surface-hover",
  "transition-colors",
].join(" ");

export const dashboardActionLinkFeaturedClass = [
  "block rounded-xl p-4 border-2 border-theme-border-strong",
  "bg-theme-surface-featured",
  "hover:bg-theme-surface-hover hover:border-theme-link-primary-hover",
  "transition-colors shadow-sm ring-1 ring-theme-border",
].join(" ");

export const dashboardActionTitleClass = "text-lg font-medium text-theme-fg";

/** Featured quick-action titles (matches navbar logo gradient). */
export const dashboardActionTitleFeaturedClass = [
  "text-lg font-medium",
  "bg-gradient-to-r from-accent-goldDark to-accent-coralDark bg-clip-text text-transparent",
].join(" ");

export const dashboardActionDescClass = "text-sm text-theme-fg-secondary";

export const dashboardMetaClass = "text-xs text-theme-fg-secondary";

export const dashboardChevronClass =
  "w-5 h-5 text-theme-accent-muted-subtle";

export const dashboardBadgeClass =
  "text-xs py-1 px-2 rounded-md font-medium bg-theme-icon-neutral text-theme-link-primary border border-theme-border";

export const dashboardCardHeaderBorderClass =
  "p-6 border-b border-theme-border-subtle";

export const dashboardTableHeadClass = "bg-theme-surface-hover";

export const dashboardTableHeadCellClass =
  "px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-theme-accent-muted";

export const dashboardTableWrapperClass = "overflow-x-auto";

export const dashboardTableDividerClass =
  "min-w-full divide-y divide-theme-border-subtle";

export const dashboardTableBodyClass = [
  dashboardElevatedSurface,
  "divide-y divide-theme-border-subtle",
].join(" ");

export const dashboardTableRowHoverClass =
  "hover:bg-theme-surface-hover transition-colors";

export const dashboardCellPrimaryClass = "text-sm font-medium text-theme-fg";

export const dashboardCellSecondaryClass = "text-sm text-theme-fg-secondary";

export const dashboardPrimaryLinkClass =
  "text-sm font-medium text-theme-link-primary hover:text-theme-link-primary-hover hover:bg-theme-surface-hover px-3 py-1 rounded-lg transition-colors inline-block";

export const dashboardDangerButtonClass =
  "text-theme-danger hover:opacity-90 hover:bg-theme-surface-hover px-3 py-1 rounded-lg transition-colors inline-block";

export const dashboardPrimaryButtonClass =
  "inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-theme-btn-primary text-theme-btn-primary-text hover:bg-theme-btn-primary-hover focus:outline-none focus:ring-2 focus:ring-theme-focus transition-colors shadow-sm";

export const dashboardSpinnerClass =
  "animate-spin rounded-full h-12 w-12 border-b-2 border-theme-spinner mx-auto";

export const dashboardEmptyIconClass =
  "mx-auto h-12 w-12 text-theme-accent-muted-subtle";

export const dashboardIconBoxNeutralClass = [
  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3",
  "bg-theme-icon-neutral border border-theme-border-subtle",
].join(" ");

export const dashboardIconNeutralClass = "w-5 h-5 text-theme-accent-muted-subtle";

export const dashboardIconBoxAccentClass = [
  "flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center mr-3",
  "bg-theme-icon-accent border border-theme-border",
].join(" ");

export const dashboardIconAccentClass = "w-5 h-5 text-theme-link-primary";

/** Founder Report — chart token (palette); not in semantic theme */
export const dashboardIconBoxOrange =
  "flex-shrink-0 w-10 h-10 rounded-lg bg-chart-orange/10 dark:bg-theme-icon-accent flex items-center justify-center mr-3 border border-chart-orange/20 dark:border-theme-border";

export const dashboardIconOrange =
  "w-5 h-5 text-chart-orange dark:text-theme-link-primary";

export const dashboardIconBoxPurple = dashboardIconBoxAccentClass;
export const dashboardIconPurple = dashboardIconAccentClass;
export const dashboardIconBoxCoral = dashboardIconBoxNeutralClass;
export const dashboardIconCoral = dashboardIconNeutralClass;

export const dashboardSectionIconClass =
  "w-5 h-5 mr-2 text-theme-link-primary";
