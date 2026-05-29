/**
 * Account profile page styling — colors from src/styles/color-scheme.css (theme-*).
 */

const profileInputFieldBase = [
  "block w-full rounded-lg border border-theme-border-input bg-theme-surface-input",
  "text-theme-fg placeholder:text-theme-fg-secondary",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "focus:border-theme-input-focus focus:ring-4 focus:ring-theme-focus focus:outline-none",
].join(" ");

export const profileGlowClass = "dashboard-glow";

export const profilePageClass = "relative z-[1] min-h-[calc(100vh-4rem)]";

export const profileContainerClass =
  "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10";

export const profileHeroClass = [
  "mb-8 py-2 sm:py-4 transition-colors duration-300",
].join(" ");

export const profileBackButtonClass = [
  "inline-flex items-center gap-2 mb-5 group",
  "text-sm font-medium text-theme-fg-secondary",
  "hover:text-theme-link-primary transition-colors",
].join(" ");

export const profileBackIconWrapClass = [
  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
  "bg-theme-surface-inset border border-theme-border-subtle",
  "text-theme-link-primary",
  "group-hover:bg-theme-surface-hover group-hover:border-theme-border transition-colors",
].join(" ");

export const profileHeroTitleClass = "text-3xl sm:text-4xl font-bold text-theme-fg";

export const profileHeroSubtitleClass =
  "mt-2 text-base text-theme-fg-secondary max-w-2xl leading-relaxed";

export const profileSectionCardClass = [
  "rounded-2xl border border-theme-border bg-theme-surface-card",
  "p-6 shadow-md dark:shadow-black/20 transition-colors duration-300",
].join(" ");

export const profileSectionsStackClass = "space-y-6";

export const profileSectionTitleClass = "text-xl font-semibold text-theme-fg mb-6";

export const profileSectionHeaderRowClass =
  "flex flex-wrap justify-between items-center gap-4 mb-6";

export const profileSectionHeaderTitleClass = "text-xl font-semibold text-theme-fg";

export const profileFormGridClass = "grid grid-cols-1 md:grid-cols-2 gap-6";

export const profileFieldFullWidthClass = "md:col-span-2";

export const profileInfoGridClass = "grid grid-cols-1 md:grid-cols-2 gap-6";

export const profileInfoBoxClass = [
  "rounded-lg p-4 border border-theme-border-subtle bg-theme-surface-inset",
].join(" ");

export const profileInfoBoxLabelClass = "text-sm font-medium text-theme-fg-secondary mb-2";

export const profileInfoBoxValueClass = "text-lg font-semibold text-theme-fg";

export const profileInfoBoxHintClass = "text-sm text-theme-fg-secondary mt-1";

export const profileActionsEndClass = "flex justify-end mt-6";

export const profileActionsRowClass = "flex flex-wrap gap-2";

export const profilePrimaryButtonClass = [
  "px-4 py-2 text-sm font-medium rounded-lg transition-all shadow-sm",
  "bg-theme-btn-primary text-theme-btn-primary-text",
  "hover:bg-theme-btn-primary-hover focus:ring-4 focus:ring-theme-focus focus:outline-none",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export const profilePrimaryButtonLargeClass = [
  "px-6 py-3 text-sm font-medium rounded-lg transition-all shadow-sm",
  "bg-theme-btn-primary text-theme-btn-primary-text",
  "hover:bg-theme-btn-primary-hover focus:ring-4 focus:ring-theme-focus focus:outline-none",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export const profileSecondaryButtonClass = [
  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
  "text-theme-fg-secondary bg-theme-surface-inset border border-theme-border",
  "hover:bg-theme-surface-hover",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export const profileSignInPromptClass = "text-theme-fg-secondary py-8 text-center";

export const profileTextInputTheme = {
  field: {
    input: {
      base: profileInputFieldBase,
    },
  },
};
