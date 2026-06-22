/**
 * Auth page layout + Flowbite overrides.
 * Colors: src/styles/color-scheme.css → Tailwind theme-* classes.
 */

/** Flowbite input — shared base; forgot page uses focus-alt ring/border */
const authInputFieldBase =
  "block w-full rounded-lg border border-theme-border-input bg-theme-surface-input text-theme-fg placeholder:text-theme-fg-secondary disabled:cursor-not-allowed disabled:opacity-50";

const authInputFieldSignIn =
  `${authInputFieldBase} focus:border-theme-input-focus focus:ring-4 focus:ring-theme-focus`;

const authInputFieldForgot =
  `${authInputFieldBase} focus:border-theme-input-focus-alt focus:ring-4 focus:ring-theme-focus-alt`;

/** Page shell (layout only — background via .auth-page-bg in index.css) */
export const authPageShellClass =
  "auth-page-bg transition-colors duration-500";

export const authPageInnerClass = "relative z-10 w-full max-w-md px-4 mt-14";

export const authCardClass =
  "w-full relative z-10 rounded-2xl shadow-2xl border border-theme-border-auth bg-theme-surface-auth transition-all duration-300";

export const authTitleClass = "text-2xl font-bold text-center text-theme-fg";

export const authBodyTextClass = "text-center text-theme-fg-secondary";

export const authLabelClass = "text-theme-fg";

export const authLinkClass =
  "text-theme-link-primary hover:text-theme-link-primary-hover hover:underline font-medium";

export const authSubmitButtonClass =
  "w-full px-4 py-2 font-medium rounded-lg transition-all bg-theme-btn-primary text-theme-btn-primary-text hover:bg-theme-btn-primary-hover focus:ring-4 focus:ring-theme-focus focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed shadow-sm";

export const authForgotPasswordLinkClass =
  "text-theme-link-deemphasized hover:text-theme-link-deemphasized-hover hover:underline font-medium";

export const authForgotPageLinkClass = authForgotPasswordLinkClass;

export const authForgotPageSubmitButtonClass =
  "w-full px-4 py-2 font-medium rounded-lg transition-all bg-theme-btn-alt text-theme-btn-alt-text hover:bg-theme-btn-alt-hover focus:ring-4 focus:ring-theme-focus-alt focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed shadow-sm";

export const authErrorBannerClass =
  "p-4 mb-4 text-theme-banner-error-text bg-theme-banner-error rounded-lg";

export const authSuccessBannerClass =
  "p-4 mb-4 text-theme-banner-success-text bg-theme-banner-success rounded-lg border border-theme-border-subtle";

export const authInfoBannerClass =
  "p-4 mb-4 text-theme-banner-info-text bg-theme-banner-info rounded-lg";

export const authTextInputTheme = {
  field: {
    input: {
      base: authInputFieldSignIn,
    },
  },
};

export const authForgotPageTextInputTheme = {
  field: {
    input: {
      base: authInputFieldForgot,
    },
  },
};
