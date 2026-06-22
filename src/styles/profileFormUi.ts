/**
 * ProfileForm styling — colors from src/styles/color-scheme.css (theme-*).
 */

const profileFormInputBase = [
  "text-sm rounded-lg block w-full p-2.5",
  "bg-theme-surface-input border border-theme-border-input",
  "text-theme-fg placeholder:text-theme-fg-secondary",
  "focus:ring-2 focus:ring-theme-focus focus:border-theme-input-focus focus:outline-none",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export const profileFormCardClass = [
  "rounded-2xl shadow-xl overflow-hidden",
  "border border-theme-border bg-theme-surface-card transition-all duration-300 p-8",
].join(" ");

export const profileFormTitleClass = "text-2xl font-bold mb-4 text-theme-fg";

export const profileFormDescriptionClass = "text-theme-fg-secondary mb-6";

export const profileFormLabelClass = "block mb-2 text-sm font-medium text-theme-fg";

export const profileFormHintClass = "text-xs text-theme-fg-secondary mb-1";

export const profileFormInputClass = profileFormInputBase;

export const profileFormInputErrorClass = [
  profileFormInputBase,
  "border-accent-coral dark:border-accent-coralDark",
].join(" ");

export const profileFormErrorTextClass = "mt-1 text-sm text-theme-danger";

export const profileFormCheckboxClass = [
  "w-4 h-4 rounded focus:ring-2 focus:ring-theme-focus",
  "text-theme-link-primary bg-theme-surface-input border-theme-border-input",
].join(" ");

export const profileFormCheckboxLabelClass = "ml-2 text-sm text-theme-fg-secondary";

export const profileFormCancelButtonClass = [
  "flex-1 px-5 py-3 font-medium rounded-lg transition-all",
  "text-theme-fg-secondary bg-theme-surface-inset",
  "hover:bg-theme-surface-hover border border-theme-border",
].join(" ");

export const profileFormSubmitButtonClass = [
  "flex-1 px-5 py-3 font-medium rounded-lg transition-all shadow-sm",
  "bg-theme-btn-primary text-theme-btn-primary-text",
  "hover:bg-theme-btn-primary-hover focus:ring-4 focus:ring-theme-focus focus:outline-none",
].join(" ");

export const profileFormSubmitButtonDisabledClass = [
  "flex-1 px-5 py-3 font-medium rounded-lg transition-all",
  "bg-theme-surface-inset text-theme-fg-secondary cursor-not-allowed opacity-50",
].join(" ");
