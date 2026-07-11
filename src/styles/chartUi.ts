/**
 * Chart / result page styling — colors from src/styles/color-scheme.css (theme-*).
 */

import { brandGradientPrimaryBgClass } from "./typographyUi";

export const chartGlowClass = "chart-glow";

/** Apply on light panels in dark mode so theme text tokens stay readable. */
export const lightPanelClass = "light-panel";

export const chartPageClass = "relative z-[1]";

export const chartContainerClass =
  "max-w-7xl mx-auto px-0 xs:px-1 sm:px-2 md:px-4 py-2 sm:py-4 md:py-8";

/** Chart + profile sidebar row; stays within the report viewer main column. */
export const chartSectionContainerClass = [
  "w-full max-w-none box-border",
  "pb-2 sm:pb-4 md:pb-8",
].join(" ");

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

export const chartHeroTitleClass = [
  "text-3xl sm:text-4xl font-bold text-theme-fg flex items-center flex-wrap gap-2",
  "border-b-2 border-theme-border-strong pb-3",
].join(" ");

export const chartHeroTitleIconClass = [
  "w-7 h-7 shrink-0 text-theme-link-primary",
  "p-1 rounded-md bg-theme-icon-accent",
].join(" ");

export const chartHeroSubtitleClass =
  "mt-2 text-base text-theme-fg-secondary max-w-2xl leading-relaxed";

export const chartCardClass = [
  "rounded-2xl overflow-hidden",
  "border-2 border-theme-border-strong",
  "border-accent-gold/40 dark:border-accent-gold/35",
  "bg-theme-surface-card",
  "shadow-lg shadow-brand-purple/10 dark:shadow-black/30",
].join(" ");

export const chartCardAccentBarClass =
  "h-0.5 w-full bg-gradient-brand-purple shrink-0";

export const chartCardToolbarClass = [
  "px-2 sm:px-3 md:px-4 lg:px-6 pt-2 sm:pt-4 md:pt-5 pb-2 sm:pb-0",
  "bg-theme-surface-featured border-b border-theme-border",
].join(" ");

export const chartCardBodyClass =
  "p-0.5 sm:p-2 md:p-4 lg:p-6 border-t border-theme-border-subtle";

export const chartCardBlueprintToolbarClass = [
  "px-2 sm:px-3 md:px-4 lg:px-6 pt-2 sm:pt-3 pb-0",
  "bg-theme-surface-featured",
].join(" ");

export const chartCardTitleClass =
  "text-base sm:text-lg md:text-2xl font-bold text-theme-fg";

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

export const chartBlueprintSwitcherClass =
  "grid grid-cols-2 gap-1 sm:flex sm:w-full sm:gap-1.5";

export const chartBlueprintTabActiveClass = [
  "flex flex-1 items-center justify-center gap-1 sm:gap-2",
  "min-w-0 px-1.5 sm:px-3 py-2 sm:py-3",
  "rounded-t-lg sm:rounded-t-xl text-[10px] xs:text-[11px] sm:text-sm font-semibold leading-tight",
  brandGradientPrimaryBgClass,
  "text-cream shadow-md shadow-brand-purple/20",
  "border border-transparent",
  "transition-all duration-200",
].join(" ");

export const chartBlueprintTabInactiveClass = [
  "flex flex-1 items-center justify-center gap-1 sm:gap-2",
  "min-w-0 px-1.5 sm:px-3 py-2 sm:py-3",
  "rounded-t-lg sm:rounded-t-xl text-[10px] xs:text-[11px] sm:text-sm font-medium leading-tight",
  "bg-theme-surface-elevated dark:bg-surface-darkElevated",
  "text-theme-fg border border-theme-border-subtle",
  "hover:border-theme-border-hover hover:bg-theme-surface-hover",
  "transition-all duration-200",
].join(" ");

export const chartBlueprintTabIconClass =
  "h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0 text-accent-gold dark:text-accent-goldDark";

export const chartSidebarCardClass = [
  "rounded-2xl shadow-lg overflow-hidden mb-6",
  "border border-accent-gold/40 dark:border-accent-gold/25",
  "bg-surface-cream/95 dark:bg-surface-darkSecondary/95",
  "p-6 sm:p-7",
  "shadow-brand-purple/8 dark:shadow-black/25",
].join(" ");

export const chartSidebarTitleClass = [
  "text-center font-serif text-xl sm:text-2xl font-bold text-navy dark:text-cream",
].join(" ");

export const chartSidebarFieldListClass = "mt-5";

export const chartSidebarFieldRowClass = [
  "flex items-start justify-between gap-4 py-3",
  "border-b border-theme-border-subtle/60 last:border-b-0",
].join(" ");

export const chartSidebarFieldLabelClass = [
  "text-xs font-semibold uppercase tracking-[0.12em] text-theme-fg-secondary shrink-0 pt-0.5",
].join(" ");

export const chartSidebarFieldValueClass = [
  "text-sm font-medium text-navy dark:text-cream text-right leading-snug",
].join(" ");

export const chartSidebarSectionTitleClass = [
  "flex items-center gap-2 font-serif text-base font-bold text-navy dark:text-cream",
].join(" ");

export const chartSidebarActionsClass =
  "mt-6 space-y-3 border-t border-theme-border-subtle/70 pt-5";

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
  "text-cream focus:ring-4 focus:ring-accent-coral/40 dark:focus:ring-accent-coralDark/40 focus:outline-none",
  "disabled:opacity-50 disabled:cursor-not-allowed",
  "flex items-center justify-center",
].join(" ");

export const chartAdminPanelClass = "mt-6 pt-5 border-t border-theme-border-subtle/70";

export const chartAdminPanelTitleClass = chartSidebarSectionTitleClass;

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

export const chartAnalysisDividerClass =
  "mt-8 pt-6 border-t-2 border-theme-border-strong";

export const chartAnalysisTitleClass =
  "text-4xl mb-2 font-bold text-theme-fg text-center pt-4";

export const chartAnalysisSubtitleClass =
  "text-lg mb-6 text-theme-fg-secondary text-center italic";

export const chartChartLoadingOverlayClass =
  "absolute inset-0 flex items-center justify-center bg-theme-surface-card";

/** Scroll wrapper for chart on narrow viewports. */
export const chartScrollWrapperClass = [
  "flex-grow p-0",
  "max-sm:overflow-visible",
  "sm:overflow-x-auto sm:overflow-y-visible",
  "[-webkit-overflow-scrolling:touch]",
  "sm:[scrollbar-width:thin]",
].join(" ");

/** Outer chart canvas — tall portrait grid on mobile, square from sm upward. */
export const chartCanvasOuterClass = [
  "relative isolate mx-auto w-full max-w-full",
  "min-h-0",
  "max-sm:h-auto max-sm:min-h-[40rem] max-sm:w-full max-sm:max-w-full",
  "sm:aspect-square sm:min-h-[30rem]",
  "lg:min-h-[34rem]",
].join(" ");

/**
 * Inner 4×4 palace grid — equal minmax(0,1fr) tracks (see .zwds-chart-grid in index.css)
 * so every palace cell matches and CenterInfo cannot stretch the middle rows.
 */
export const chartGridClass = [
  "zwds-chart-grid relative z-0 grid h-full w-full min-h-0",
  "grid-cols-4 grid-rows-[repeat(4,minmax(0,1fr))]",
  "max-sm:min-h-[40rem]",
  "gap-1 p-0.5",
  "xs:gap-1.5 xs:p-1",
  "sm:gap-1.5 md:gap-1",
  "rounded-xl",
].join(" ");

/** Grid slot wrapping the center destiny blueprint (2×2). */
export const chartCenterSlotClass = [
  "col-span-2 row-span-2 relative z-0",
  "h-full min-h-0 w-full",
].join(" ");

/** SVG overlay for 四化 arrows — above palace/center layers, contained within chart isolate. */
export const chartTransformationOverlayClass =
  "pointer-events-none absolute inset-0 z-40";

/**
 * Palace shell — mobile keeps a readable min-height; sm+ fills the equal grid
 * track (no fixed min-height, which previously fought equal row sizing).
 */
export const chartPalaceShellClass = [
  "relative h-full min-h-0",
  "p-1 xs:p-1.5 sm:p-3 md:p-3.5",
  "max-sm:min-h-[9rem]",
  "flex flex-col cursor-pointer overflow-hidden",
].join(" ");

/** Palace cell — cream card shell (12-palace grid). */
export const chartPalaceCardClass = [
  "rounded-2xl overflow-hidden",
  "border border-[#E5DDD0] dark:border-gray-600",
  "bg-[#FAF9F6] dark:bg-gray-800",
  "shadow-sm",
].join(" ");

/** Palace name — serif title in the card header zone. */
export const chartPalaceTitleClass = [
  "zwds-palace-title",
  "font-serif font-bold leading-tight tracking-tight",
  "text-xs xs:text-[13px] sm:text-sm",
  "text-[#1A2B48] dark:text-white",
  "break-words whitespace-normal",
].join(" ");

/** Palace header star line — sans-serif subtitle under title (e.g. You Bi). */
export const chartPalaceStarSubtitleClass = [
  "zwds-palace-subtitle",
  "font-sans text-[9px] xs:text-2xs sm:text-xs",
  "text-[#5C5C5C] dark:text-white",
  "font-normal leading-snug",
  "break-words whitespace-normal",
].join(" ");

/** Palace age range — Da Yun period below star subtitle. */
export const chartPalaceSubtitleClass = [
  "zwds-palace-subtitle",
  "font-sans text-[9px] xs:text-2xs sm:text-xs",
  "text-[#5C5C5C] dark:text-white",
  "font-normal mt-0.5",
].join(" ");

/** Bottom metadata row — stem/branch, year, age. */
export const chartPalaceMetaClass = [
  "zwds-palace-meta",
  "font-sans text-[9px] xs:text-2xs sm:text-xs",
  "text-[#5C5C5C] dark:text-white",
  "font-medium leading-snug",
].join(" ");

/** Zodiac watermark container — anchored bottom-right behind content. */
export const chartPalaceWatermarkClass = [
  "zwds-palace-watermark",
  "absolute z-[1] pointer-events-none",
  "max-sm:inset-x-0 max-sm:top-[28%] max-sm:bottom-[32%]",
  "max-sm:flex max-sm:w-full max-sm:items-center max-sm:justify-center",
  "max-sm:opacity-[0.22] dark:max-sm:opacity-[0.26]",
  "bottom-0 right-0",
  "flex items-end justify-end",
  "w-[48%] h-[58%] sm:w-[52%] sm:h-[64%]",
  "opacity-[0.28] sm:opacity-[0.38] dark:opacity-[0.32] sm:dark:opacity-[0.42]",
].join(" ");

/** Mini zodiac badge — top-left circle (palace Lucide icon); hidden on mobile. */
export const chartPalaceZodiacBadgeClass = [
  "hidden sm:flex",
  "items-center justify-center shrink-0",
  "w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10",
  "rounded-full bg-[#F5EFE6] dark:bg-gray-700/80",
  "p-1.5",
].join(" ");

/** Lucide icon inside the palace header badge circle. */
export const chartPalaceBadgeIconClass = [
  "zwds-palace-badge-icon",
  "h-4 w-4 xs:h-[18px] xs:w-[18px] sm:h-5 sm:w-5",
  "text-[#3D2E1F] dark:text-white",
  "shrink-0",
].join(" ");

/** Mobile star rows container — stacks up to 2 rows when a palace has multiple stars. */
export const chartPalaceMobileStarsStackClass = [
  "flex w-full min-w-0 flex-col gap-0.5",
  "sm:hidden",
].join(" ");

/** Single mobile row of star items. */
export const chartPalaceMobileStarRowClass = [
  "flex w-full min-w-0 flex-row flex-wrap items-start gap-x-1 gap-y-0.5",
].join(" ");

/** Mobile star item — base typography shared with desktop columns. */
export const chartPalaceMobileStarItemClass = [
  "zwds-palace-star-text",
  "min-w-0 shrink-0 items-center",
  "text-[8px] xs:text-[9px] leading-tight",
].join(" ");

/** Mobile star item — star name + 四化 tags + refresh icon. */
export const chartPalaceMobileStarItemThreeColClass =
  "grid grid-cols-[minmax(0,1fr)_auto_auto] gap-x-0.5";

/** Mobile star item — star name + tags or refresh icon. */
export const chartPalaceMobileStarItemTwoColClass =
  "grid grid-cols-[minmax(0,1fr)_auto] gap-x-0.5";

/** Mobile star item — star name only. */
export const chartPalaceMobileStarItemSingleColClass = "flex min-w-0";

/** Star names row — minor/main stars with transformation tags (dense wrap on mobile). */
export const chartPalaceStarsRowClass = [
  "hidden sm:flex sm:flex-row sm:flex-wrap sm:items-start",
  "gap-0.5 xs:gap-1 sm:gap-3",
  "pb-0.5",
].join(" ");

/** Scrollable / dense star zone — wrap on mobile, scroll on sm+ if needed. */
export const chartPalaceStarsZoneClass = [
  "z-30 mb-0.5 mt-1 min-h-0 flex-1 flex flex-col",
  "max-sm:overflow-visible sm:overflow-y-auto",
  "sm:mb-1 sm:mt-2",
].join(" ");

/** Single star column — name + transformation tags. */
export const chartPalaceStarColumnClass = [
  "zwds-palace-star-text",
  "flex flex-col items-start gap-0.5 min-w-0 shrink-0",
  "text-[8px] xs:text-[9px] sm:text-xs",
  "leading-tight sm:leading-normal",
].join(" ");

/** 四化 pill — semantic color via zwds-trans-* in index.css */
export const chartPalaceTransformationTagClass = [
  "zwds-palace-transformation-tag",
  "inline-flex items-center font-bold leading-none",
  "rounded border shrink-0",
  "text-[8px] xs:text-[9px] sm:text-xs",
  "px-0.5 py-px sm:px-1 sm:py-0.5",
].join(" ");

/** Star name label inside a column. */
export const chartPalaceStarNameClass = [
  "zwds-palace-star-text",
  "leading-normal whitespace-normal break-words",
].join(" ");

/** Main content column inside each palace card. */
export const chartPalaceContentClass = [
  "relative z-10 flex flex-col",
  "h-full min-h-0",
].join(" ");

/** Footer row — stem/branch, year/age, Da Ming; 2-col spaced on mobile, equal thirds on sm+. */
export const chartPalaceFooterClass = [
  "zwds-palace-footer",
  "w-full min-w-0 shrink-0 items-end",
  "pt-2",
  "zwds-palace-bottom-text",
  "max-sm:flex max-sm:flex-row max-sm:justify-between max-sm:gap-x-2",
  "sm:grid sm:grid-cols-3 sm:grid-rows-1 sm:gap-x-0.5 sm:gap-y-0",
].join(" ");

/** Mobile-only Da Ming row — sits above the 2-column footer when Da Xian is active. */
export const chartPalaceDaMingMobileRowClass = [
  "flex w-full min-w-0 shrink-0 items-center justify-center",
  "pt-1 pb-0.5",
  "sm:hidden",
].join(" ");

/** Footer column 1 — heavenly stem / earthly branch. */
export const chartPalaceFooterStemCellClass =
  "min-w-0 max-w-full overflow-hidden flex flex-col items-start justify-end";

/** Footer column 2 — year / age. */
export const chartPalaceFooterYearCellClass = [
  "min-w-0 max-w-full overflow-hidden flex flex-col justify-end",
  "max-sm:items-end max-sm:text-right",
  "sm:items-center sm:text-center",
].join(" ");

/** Footer column 3 — secondary palace name on desktop (Da Ming moves to title row). */
export const chartPalaceFooterThirdCellClass = [
  "min-w-0 max-w-full overflow-hidden",
  "hidden sm:flex sm:items-end sm:justify-end",
].join(" ");

/** @deprecated Use chartPalaceFooterThirdCellClass — kept as alias during transition. */
export const chartPalaceDaMingTagCellClass = chartPalaceFooterThirdCellClass;

/** Da Ming tag pill — matches footer meta text size. */
export const chartPalaceDaMingTagClass = [
  "zwds-palace-daming-tag",
  "font-sans text-[9px] xs:text-2xs sm:text-xs",
  "font-semibold leading-none",
  "whitespace-nowrap max-w-full min-w-0",
  "px-1 py-0.5 rounded-md border",
].join(" ");

/** Da Ming tag — default (unselected palace). */
export const chartPalaceDaMingTagDefaultClass = [
  "bg-brand-purple/25 text-brand-purpleDeep border-brand-purple/45",
  "dark:bg-white/22 dark:text-white dark:border-white/35",
].join(" ");

/** Da Ming tag — selected palace (inverted pill for contrast on purple). */
export const chartPalaceDaMingTagSelectedClass = [
  "bg-[#FAF9F6] text-brand-purpleDeep border-white/70 shadow-sm",
  "dark:bg-white dark:text-[#4A3F6B] dark:border-white/80",
].join(" ");

/** Palace title row — stacked on mobile; primary left / secondary right on sm+. */
export const chartPalaceTitleRowClass = [
  "flex w-full min-w-0",
  "max-sm:flex-col max-sm:items-start max-sm:gap-0",
  "sm:flex-row sm:items-center sm:justify-between sm:gap-x-2",
].join(" ");

/** Secondary palace name — below primary on mobile; footer column 3 on sm+. */
export const chartPalaceSecondaryNameClass = [
  "zwds-palace-secondary-name",
  "pointer-events-none min-w-0",
  "text-[10px] xs:text-[11px] font-medium leading-tight",
  "max-sm:w-full max-sm:text-left max-sm:whitespace-normal max-sm:break-words",
  "sm:shrink-0 sm:text-2xs sm:text-xs sm:font-semibold sm:text-right sm:whitespace-nowrap",
  "text-[#1A2B48]/85 dark:text-white/90",
].join(" ");

/** Palace card header — full width title zone above stars. */
export const chartPalaceHeaderClass = "relative shrink-0 w-full min-w-0";

/** Chart center panel — cream destiny blueprint card (2×2 grid center). */
export const chartCenterPanelClass = [
  "zwds-center-info relative z-0",
  "flex flex-col h-full w-full min-h-0",
  "rounded-xl overflow-hidden relative",
  "border border-[#E5DDD0] dark:border-gray-600",
  "bg-[#FDFBF7] dark:bg-surface-darkElevated",
  "shadow-sm",
  "px-1.5 py-2.5",
  "xs:px-2 xs:py-3",
  "sm:px-2 sm:py-3",
  "md:px-3 md:py-3",
].join(" ");

/**
 * Center panel inner — scrolls when blueprint cards exceed the 2×2 cell.
 * Card groups use shrink-0 so flex never collapses them into each other.
 */
export const chartCenterContentClass = [
  "relative z-0 flex h-full min-h-0 w-full flex-col",
  "items-center justify-start overflow-x-hidden overflow-y-auto",
  "px-0",
  "sm:px-0.5",
].join(" ");

export const chartCenterHeroWrapClass = [
  "flex w-full min-h-min flex-col items-center justify-start",
].join(" ");

export const chartCenterHeroClass = [
  "flex w-full xs:w-[88%] sm:w-[84%] md:w-[90%] mx-auto",
  "flex-col items-center justify-start text-center",
  "px-0.5 pt-0 pb-1",
  "xs:px-1",
  "sm:px-1",
].join(" ");

export const chartCenterEmblemRingClass = [
  "relative mx-auto flex h-9 w-9 xs:h-10 xs:w-10",
  "sm:h-12 sm:w-12 md:h-14 md:w-14",
  "items-center justify-center overflow-hidden rounded-full",
  "border-2 border-[#C5A059]/45 bg-[#FAF9F6] dark:bg-gray-800",
  "p-0.5 shadow-sm",
].join(" ");

export const chartCenterNameClass = [
  "mt-0.5 font-serif text-[10px] font-bold xs:text-xs sm:text-sm md:text-sm",
  "text-[#1A2B48] dark:text-white",
  "break-words whitespace-normal max-w-full px-1",
].join(" ");

export const chartCenterBlueprintClass = [
  "text-[7px] font-semibold uppercase tracking-[0.16em] sm:text-[8px] sm:tracking-[0.18em]",
  "text-[#C5A059]",
].join(" ");

export const chartCenterElementClass = [
  "mt-0.5 flex items-center gap-0.5",
  "text-[9px] text-[#4A5568] dark:text-gray-300 sm:text-[10px]",
].join(" ");

export const chartCenterDemographicsClass = [
  "mt-0.5 sm:mt-2 font-serif text-[10px] text-[#1A2B48] dark:text-cream xs:text-xs sm:text-base",
].join(" ");

/** Solar / lunar dates panel — shown in center on all breakpoints. */
export const chartCenterDatesPanelClass = [
  "flex w-full max-w-full shrink-0 flex-col gap-1 mt-1",
  "rounded-lg border border-[#E5DDD0] bg-white/75 p-1 shadow-sm",
  "dark:border-gray-600 dark:bg-gray-800/55",
  "sm:gap-1 sm:p-1",
].join(" ");

export const chartCenterDatesClass = [
  "hidden sm:flex",
  chartCenterDatesPanelClass,
].join(" ");

/** Center info row — mobile: label then full-width value; sm+: icon beside stacked label/value. */
export const chartCenterDateRowClass = [
  "grid w-full min-w-0 gap-x-1.5 gap-y-0.5 text-left",
  "grid-cols-1",
  "sm:grid-cols-[auto_minmax(0,1fr)]",
].join(" ");

export const chartCenterDateIconWrapClass = [
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
  "bg-[#F5EFE6] dark:bg-gray-700/80",
  "sm:h-6 sm:w-6",
].join(" ");

export const chartCenterDateRowIconWrapClass = [
  chartCenterDateIconWrapClass,
  "hidden",
  "sm:col-start-1 sm:row-start-1 sm:flex sm:self-start sm:row-span-2 sm:self-center",
].join(" ");

export const chartCenterDateIconClass =
  "h-2.5 w-2.5 text-[#C5A059] sm:h-3 sm:w-3";

export const chartCenterDateLabelClass = [
  "col-start-1 row-start-1 min-w-0 w-full",
  "text-[8px] font-semibold uppercase tracking-wide text-[#6B7280] dark:text-gray-400",
  "sm:col-start-2 sm:text-[9px]",
].join(" ");

export const chartCenterDateValueClass = [
  "zwds-center-date-value",
  "col-start-1 row-start-2 min-w-0 w-full",
  "text-[10px] leading-snug text-[#1A2B48] dark:text-white",
  "break-words whitespace-normal",
  "sm:col-start-2 sm:row-start-2 sm:mt-0 sm:text-[11px]",
].join(" ");

export const chartCenterDividerClass =
  "mt-1 sm:mt-1.5 h-px w-full max-w-[88%] bg-[#C5A059]/35 hidden xs:block";

export const chartCenterBodyClass =
  "min-h-0 flex-grow space-y-2 overflow-auto px-3 py-2 sm:px-4";

export const chartCenterDetailLabelClass = [
  "text-[10px] font-semibold uppercase tracking-wide text-[#6B7280] dark:text-gray-400 sm:text-xs",
  "w-full xs:w-auto xs:min-w-[88px] sm:min-w-[96px]",
].join(" ");

export const chartCenterDetailValueClass = [
  "text-xs leading-snug text-[#1A2B48] dark:text-cream sm:text-sm",
  "zwds-center-value",
].join(" ");

export const chartCenterZodiacGridClass = [
  "grid w-full max-w-full shrink-0 grid-cols-1 gap-1 mt-1",
  "xs:gap-1",
  "sm:grid-cols-2 sm:gap-1",
].join(" ");

export const chartCenterZodiacCardClass = [
  "grid min-w-0 w-full gap-x-1 gap-y-0.5 rounded-md p-1",
  "grid-cols-1",
  "border border-[#E5DDD0] bg-white/75 shadow-sm",
  "dark:border-gray-600 dark:bg-gray-800/55",
  "sm:grid-cols-[auto_minmax(0,1fr)] sm:p-1",
].join(" ");

export const chartCenterZodiacCardIconSlotClass = [
  "hidden shrink-0 items-center justify-center",
  "sm:col-start-1 sm:row-start-1 sm:flex sm:h-6 sm:w-6 sm:row-span-2 sm:self-center",
].join(" ");

export const chartCenterZodiacCardLabelClass = [
  "col-start-1 row-start-1 min-w-0 w-full",
  "text-[7px] font-semibold uppercase tracking-wide text-[#6B7280] dark:text-gray-400",
  "leading-tight sm:col-start-2 sm:text-[8px]",
].join(" ");

export const chartCenterZodiacCardValueClass = [
  "col-start-1 row-start-2 min-w-0 w-full",
  "font-serif text-[10px] font-bold leading-snug text-[#1A2B48] dark:text-cream",
  "break-words whitespace-normal",
  "sm:col-start-2 sm:row-start-2 sm:text-xs",
].join(" ");
