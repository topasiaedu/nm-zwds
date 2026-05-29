/* eslint-disable no-undef */
const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./index.html",
    "./node_modules/flowbite-react/lib/**/*.{js,ts}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    colors: {
      ...colors,
      primary: {
        50: "#f3f0f7",
        100: "#e8e4ef",
        200: "#d1c9df",
        300: "#b5a8c9",
        400: "#9B8FB5",
        500: "#6B5B95",
        600: "#5a4d7d",
        700: "#6B5B95",
        800: "#4A3F6B",
        900: "#1A1E3F",
      },
    },
    fontFamily: {
      sans: [
        "Inter",
        "InterVariable",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      body: [
        "Inter",
        "InterVariable",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
      ],
      mono: [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    extend: {
      colors: {
        /** Hex/rgb tokens — values defined in src/styles/color-scheme.css */
        navy: "var(--color-navy)",
        cream: "var(--color-cream)",
        surface: {
          cream: "var(--color-surface-cream)",
          warm: "var(--color-surface-warm)",
          elevated: "var(--color-surface-elevated)",
          dark: "var(--color-surface-dark)",
          darkSecondary: "var(--color-surface-dark-secondary)",
          darkElevated: "var(--color-surface-dark-elevated)",
        },
        brand: {
          purple: "rgb(var(--color-brand-purple-rgb) / <alpha-value>)",
          purpleLight: "var(--color-brand-purple-light)",
          purpleDeep: "var(--color-brand-purple-deep)",
        },
        accent: {
          coral: "var(--color-accent-coral)",
          coralDark: "var(--color-accent-coral-dark)",
          gold: "rgb(var(--color-accent-gold-rgb) / <alpha-value>)",
          goldDark: "var(--color-accent-gold-dark)",
        },
        chart: {
          orange: "#E08B5C",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          dark: "var(--color-muted-dark)",
          subtle: "var(--color-muted-subtle)",
        },
        /** Semantic roles — switch per theme in color-scheme.css */
        theme: {
          fg: {
            DEFAULT: "var(--color-text-primary)",
            secondary: "var(--color-text-secondary)",
            subtle: "var(--color-text-subtle)",
          },
          "accent-muted": "var(--color-text-accent-muted)",
          "accent-muted-subtle": "var(--color-text-accent-muted-subtle)",
          "accent-label": "var(--color-text-accent-label)",
          border: {
            DEFAULT: "var(--color-border-default)",
            subtle: "var(--color-border-subtle)",
            strong: "var(--color-border-strong)",
            auth: "var(--color-border-auth)",
            input: "var(--color-input-border)",
            hover: "var(--color-border-hover)",
          },
          surface: {
            card: "var(--color-surface-card)",
            inset: "var(--color-surface-inset)",
            auth: "var(--color-surface-auth-card)",
            input: "var(--color-surface-input)",
            hover: "var(--color-surface-hover)",
            featured: "var(--color-surface-featured)",
          },
          btn: {
            primary: "var(--color-btn-primary-bg)",
            "primary-hover": "var(--color-btn-primary-bg-hover)",
            "primary-text": "var(--color-btn-primary-text)",
            alt: "var(--color-btn-alt-bg)",
            "alt-hover": "var(--color-btn-alt-bg-hover)",
            "alt-text": "var(--color-btn-alt-text)",
          },
          link: {
            primary: "var(--color-link-primary)",
            "primary-hover": "var(--color-link-primary-hover)",
            deemphasized: "var(--color-link-deemphasized)",
            "deemphasized-hover": "var(--color-link-deemphasized-hover)",
          },
          input: {
            focus: "var(--color-input-focus-border)",
            "focus-alt": "var(--color-input-focus-border-alt)",
          },
          banner: {
            error: "var(--color-banner-error-bg)",
            "error-text": "var(--color-banner-error-text)",
            success: "var(--color-banner-success-bg)",
            "success-text": "var(--color-banner-success-text)",
            info: "var(--color-banner-info-bg)",
            "info-text": "var(--color-banner-info-text)",
          },
          danger: "var(--color-text-danger)",
          spinner: "var(--color-spinner)",
          "icon-accent": "var(--color-icon-accent-bg)",
          "icon-neutral": "var(--color-icon-neutral-bg)",
        },
      },
      ringColor: {
        theme: {
          focus: "var(--color-ring-focus)",
          "focus-alt": "var(--color-ring-focus-alt)",
        },
      },
      backgroundImage: {
        "footer-light": "linear-gradient(to right, #1A1E3F, #D4B896)",
        "footer-dark": "linear-gradient(to right, #1A0F2E, #E8A989)",
        /** Named separately from brand.purple — avoids clobbering bg-brand-purple solid fills */
        "gradient-brand-purple": "linear-gradient(to right, #6B5B95, #4A3F6B)",
      },
      fontSize: {
        "3xs": ["0.625rem", { lineHeight: "0.75rem" }],
        "2xs": ["0.6875rem", { lineHeight: "0.875rem" }],
      },
      screens: {
        xs: "480px",
      },
    },
  },
  plugins: [
    require("flowbite/plugin"),
    function ({ addUtilities }) {
      addUtilities({
        ".hide-scrollbar": {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none",
          "&::-webkit-scrollbar": {
            display: "none",
          },
        },
      });
    },
  ],
};
