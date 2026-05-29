/**
 * Founder report page styling — colors from src/styles/color-scheme.css (theme-*).
 */

export const founderReportGlowClass = "dashboard-glow";

export const founderReportPageClass = "relative z-[1]";

export const founderReportContainerClass =
  "relative max-w-7xl mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8 scroll-smooth print:bg-white";

/** Page hero — aligned with dashboard / chart / calculate heroes */
export const founderReportHeroClass = [
  "mb-8 py-2 sm:py-4 transition-colors duration-300",
].join(" ");

export const founderReportBackButtonClass = [
  "inline-flex items-center gap-2 mb-5 group print:hidden",
  "text-sm font-medium text-theme-fg-secondary",
  "hover:text-theme-link-primary transition-colors",
].join(" ");

export const founderReportBackIconWrapClass = [
  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
  "bg-theme-surface-inset border border-theme-border-subtle",
  "text-theme-link-primary",
  "group-hover:bg-theme-surface-hover group-hover:border-theme-border transition-colors",
].join(" ");

export const founderReportHeroLabelClass =
  "text-xs font-semibold uppercase tracking-wider text-theme-accent-label mb-1";

export const founderReportHeroTitleClass =
  "text-3xl sm:text-4xl font-bold text-theme-fg flex items-center flex-wrap gap-2";

export const founderReportHeroTitleIconClass =
  "w-7 h-7 shrink-0 text-theme-link-primary";

export const founderReportHeroSubtitleClass =
  "mt-2 text-base text-theme-fg-secondary max-w-2xl leading-relaxed";
