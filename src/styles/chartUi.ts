/**
 * Chart / result page styling — colors from src/styles/color-scheme.css (theme-*).
 */

export const chartGlowClass = "dashboard-glow";

export const chartPageClass = "relative z-[1]";

export const chartContainerClass =
  "max-w-7xl mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8";

export const chartHeroClass = [
  "mb-8 py-2 sm:py-4 transition-colors duration-300",
].join(" ");

export const chartBackButtonClass = [
  "inline-flex items-center gap-2 mb-5 group",
  "text-sm font-medium text-theme-fg-secondary",
  "hover:text-theme-link-primary transition-colors",
].join(" ");

export const chartBackIconWrapClass = [
  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
  "bg-theme-surface-inset border border-theme-border-subtle",
  "text-theme-link-primary",
  "group-hover:bg-theme-surface-hover group-hover:border-theme-border transition-colors",
].join(" ");

export const chartHeroLabelClass =
  "text-xs font-semibold uppercase tracking-wider text-theme-accent-label mb-1";

export const chartHeroTitleClass =
  "text-3xl sm:text-4xl font-bold text-theme-fg flex items-center flex-wrap gap-2";

export const chartHeroTitleIconClass = "w-7 h-7 shrink-0 text-theme-link-primary";

export const chartHeroSubtitleClass =
  "mt-2 text-base text-theme-fg-secondary max-w-2xl leading-relaxed";

export const chartCardClass = [
  "rounded-2xl shadow-lg overflow-hidden",
  "border border-theme-border bg-theme-surface-card",
  "p-1 sm:p-2 md:p-4 lg:p-6",
].join(" ");

export const chartCardTitleClass =
  "text-lg sm:text-xl md:text-2xl font-bold mb-2 sm:mb-3 md:mb-4 text-theme-fg";

export const chartSpinnerClass =
  "animate-spin rounded-full h-12 w-12 border-b-2 border-theme-spinner mx-auto";

export const chartSpinnerSmallClass =
  "inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-theme-spinner";

export const chartLoadingTextClass = "text-theme-fg-secondary";

export const chartErrorPanelClass =
  "p-6 rounded-lg text-center bg-theme-banner-error/10 border border-accent-coral/30 dark:border-accent-coralDark/40";

export const chartErrorTitleClass = "text-xl font-bold text-theme-danger mb-2";

export const chartErrorTextClass = "text-theme-danger";

export const chartErrorRetryClass =
  "mt-4 px-4 py-2 rounded-lg text-theme-banner-error-text bg-theme-banner-error hover:opacity-90 transition-opacity";

export const chartBlueprintActiveClass =
  "flex-1 px-3 py-2 rounded-lg text-sm font-medium bg-theme-btn-primary text-theme-btn-primary-text shadow-sm transition-colors";

export const chartBlueprintInactiveClass = [
  "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
  "bg-theme-surface-inset border border-theme-border text-theme-fg-secondary",
  "hover:border-theme-border-hover hover:bg-theme-surface-hover",
].join(" ");

export const chartSidebarCardClass = [
  "rounded-2xl shadow-lg overflow-hidden mb-6",
  "border border-theme-border bg-theme-surface-card p-6",
].join(" ");

export const chartSidebarTitleClass = "text-xl font-bold mb-4 text-theme-fg";

export const chartFieldLabelClass = "text-theme-fg-secondary";

export const chartFieldValueClass = "col-span-2 font-medium text-theme-fg";

export const chartBadgeSelfClass =
  "px-2 py-1 rounded-full text-xs bg-theme-icon-neutral text-theme-link-primary border border-theme-border-subtle";

export const chartBadgeOtherClass =
  "px-2 py-1 rounded-full text-xs bg-theme-icon-accent text-theme-link-primary border border-theme-border-subtle";

export const chartPrimaryButtonClass = [
  "w-full px-4 py-2 font-medium rounded-lg transition-all shadow-sm",
  "bg-theme-btn-primary text-theme-btn-primary-text",
  "hover:bg-theme-btn-primary-hover focus:ring-4 focus:ring-theme-focus focus:outline-none",
  "block text-center flex items-center justify-center",
].join(" ");

export const chartExportButtonClass = [
  "w-full px-4 py-2 font-medium rounded-lg transition-all shadow-sm",
  "bg-accent-coral hover:opacity-90 dark:bg-accent-coralDark",
  "text-cream focus:ring-4 focus:ring-theme-focus focus:outline-none",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "flex items-center justify-center",
].join(" ");

export const chartAdminPanelClass = [
  "mt-6 p-4 rounded-lg border border-theme-border-subtle bg-theme-surface-inset",
].join(" ");

export const chartAdminPanelTitleClass =
  "text-sm font-semibold mb-3 text-theme-fg flex items-center";

export const chartAdminPanelDescClass = "text-xs text-theme-fg-secondary mb-3";

export const chartAdminButtonClass = [
  "flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
  "bg-theme-surface-input border border-theme-border-input text-theme-fg",
  "hover:bg-theme-surface-hover flex items-center justify-center gap-1",
].join(" ");

export const chartBranchOriginalClass = [
  "px-3 py-2 rounded-lg font-bold text-sm",
  "bg-theme-banner-success text-theme-banner-success-text border border-theme-border-subtle",
].join(" ");

export const chartBranchAdjustedClass = [
  "px-3 py-2 rounded-lg font-bold text-sm",
  "bg-theme-icon-accent text-theme-link-primary border border-theme-border-subtle",
].join(" ");

export const chartAnalysisTitleClass =
  "text-4xl mb-2 font-bold text-theme-fg flex items-center text-center pt-4";

export const chartAnalysisSubtitleClass =
  "text-lg mb-6 text-theme-fg-secondary text-center italic";

export const chartChartLoadingOverlayClass =
  "absolute inset-0 flex items-center justify-center bg-theme-surface-card";
