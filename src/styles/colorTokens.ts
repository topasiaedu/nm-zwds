/**
 * Color scheme retrieval — canonical values in src/styles/color-scheme.css.
 * Prefer Tailwind theme-* classes in UI modules; use cssVar for inline styles.
 */

/** CSS custom property references (match color-scheme.css) */
export const cssVar = {
  pageBg: "var(--color-page-bg)",
  textPrimary: "var(--color-text-primary)",
  textSecondary: "var(--color-text-secondary)",
  textSubtle: "var(--color-text-subtle)",
  accentPrimary: "var(--color-accent-primary)",
  accentPrimaryHover: "var(--color-accent-primary-hover)",
  textAccentMuted: "var(--color-text-accent-muted)",
  textAccentMutedSubtle: "var(--color-text-accent-muted-subtle)",
  textAccentLabel: "var(--color-text-accent-label)",
  borderDefault: "var(--color-border-default)",
  borderSubtle: "var(--color-border-subtle)",
  borderStrong: "var(--color-border-strong)",
  borderAuth: "var(--color-border-auth)",
  surfaceCard: "var(--color-surface-card)",
  surfaceAuth: "var(--color-surface-auth-card)",
  surfaceInset: "var(--color-surface-inset)",
  surfaceInput: "var(--color-surface-input)",
  btnPrimaryBg: "var(--color-btn-primary-bg)",
  btnPrimaryHover: "var(--color-btn-primary-bg-hover)",
  btnPrimaryText: "var(--color-btn-primary-text)",
  linkPrimary: "var(--color-link-primary)",
  linkPrimaryHover: "var(--color-link-primary-hover)",
  linkDeemphasized: "var(--color-link-deemphasized)",
  ringFocus: "var(--color-ring-focus)",
} as const;

/**
 * Hex palette — keep in sync with color-scheme.css :root palette block.
 */
export const palette = {
  navy: "#1A1E3F",
  cream: "#F6F0E8",
  gradientAccent: ["#080657", "#3D0F68", "#8B1167", "#D91744", "#FE8E01"] as const,
  /** Body / inline emphasis — gradient-4 → gradient-5 */
  gradientAccentSecondary: ["#D91744", "#FE8E01"] as const,
  surface: {
    cream: "#F6F0E8",
    warm: "#F5E8D4",
    elevated: "#FFFFFF",
    dark: "#2D1B4E",
    darkSecondary: "#1A0F2E",
    darkElevated: "#3D2860",
  },
  brand: {
    purple: "#6B5B95",
    purpleLight: "#9B8FB5",
    purpleDeep: "#4A3F6B",
  },
  accent: {
    coral: "#C84C5C",
    coralDark: "#D97C6E",
    gold: "#D4B896",
    goldDark: "#D4AF7B",
  },
  chart: {
    orange: "#E08B5C",
  },
  muted: {
    DEFAULT: "#5C5C5C",
    dark: "#C4C4C4",
    subtle: "#A89BC4",
    subtleLight: "#7A6B96",
  },
} as const;

export type Palette = typeof palette;
export type CssVarName = keyof typeof cssVar;
