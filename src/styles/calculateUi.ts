/**
 * Calculate page styling — colors from src/styles/color-scheme.css (theme-*).
 */

export const calculateGlowClass = "dashboard-glow";

export const calculatePageClass = "relative z-[1]";

export const calculateContainerClass =
  "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10";

/** Page hero — aligned with dashboard hero */
export const calculateHeroClass = [
  "mb-8 py-2 sm:py-4 transition-colors duration-300",
].join(" ");

export const calculateBackButtonClass = [
  "inline-flex items-center gap-2 mb-5 group",
  "text-sm font-medium text-theme-fg-secondary",
  "hover:text-theme-link-primary transition-colors",
].join(" ");

export const calculateBackIconWrapClass = [
  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
  "bg-theme-surface-inset border border-theme-border-subtle",
  "text-theme-link-primary",
  "group-hover:bg-theme-surface-hover group-hover:border-theme-border transition-colors",
].join(" ");

export const calculateHeroLabelClass =
  "text-xs font-semibold uppercase tracking-wider text-theme-accent-label mb-1";

export const calculateHeroTitleClass =
  "text-3xl sm:text-4xl font-bold text-theme-fg";

export const calculateHeroSubtitleClass =
  "mt-2 text-base text-theme-fg-secondary max-w-2xl leading-relaxed";

export const calculateHeroMetaClass = "mt-3 text-sm text-theme-accent-muted";

export const calculateCardClass = [
  "rounded-2xl shadow-lg overflow-hidden h-full",
  "border border-theme-border bg-theme-surface-card p-6",
].join(" ");

export const calculateSectionTitleClass =
  "text-xl font-bold mb-4 text-theme-fg flex items-center";

export const calculateSectionIconClass = "w-5 h-5 mr-2 text-theme-link-primary";

export const calculateSearchInputClass = [
  "block w-full p-2 pl-10 pr-4 text-sm rounded-lg",
  "bg-theme-surface-input border border-theme-border-input",
  "text-theme-fg placeholder:text-theme-fg-secondary",
  "focus:ring-2 focus:ring-theme-focus focus:border-theme-input-focus focus:outline-none",
].join(" ");

export const calculateSearchIconClass = "w-4 h-4 text-theme-fg-secondary";

export const calculateSpinnerClass =
  "animate-spin rounded-full h-10 w-10 border-b-2 border-theme-spinner mx-auto";

export const calculateLoadingTextClass = "mt-2 text-sm text-theme-fg-secondary";

export const calculateProfileItemClass = [
  "p-3 rounded-lg bg-theme-surface-inset",
  "hover:bg-theme-surface-hover transition-all",
].join(" ");

export const calculateProfileNameClass = "text-sm font-medium text-theme-fg";

export const calculateProfileMetaClass = "text-xs text-theme-fg-secondary";

export const calculateEmptyIconClass = "mx-auto h-10 w-10 text-theme-accent-muted-subtle";

export const calculateEmptyTextClass = "mt-2 text-sm text-theme-fg-secondary";

export const calculateDangerButtonClass =
  "flex-shrink-0 ml-2 text-theme-danger hover:opacity-90 hover:bg-theme-surface-hover p-1.5 rounded-lg transition-colors";

export const calculateInfoCardClass = [
  "rounded-2xl shadow-lg overflow-hidden",
  "border border-theme-border bg-theme-surface-card",
  "p-6",
].join(" ");

export const calculateInfoTitleClass = "text-2xl font-bold mb-4 text-theme-fg";

export const calculateCalloutClass = [
  "p-4 rounded-lg border border-theme-border-subtle bg-theme-surface-inset",
].join(" ");

export const calculateCalloutHeadingClass =
  "font-medium text-theme-link-primary mb-2";

export const calculateCalloutBodyClass = "text-sm text-theme-fg-secondary";
