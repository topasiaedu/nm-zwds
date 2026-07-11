import { C } from "../components/alignment-advantage/shared/constants";
import { palette } from "./colorTokens";

export interface ShellTokens {
  mainBackground: string;
  contextBarBg: string;
  contextBarText: string;
  contextBarMuted: string;
  cardBg: string;
  cardBorder: string;
  contentPanelBg: string;
  tableHeaderBg: string;
  rowHoverBg: string;
  textPrimary: string;
  textMuted: string;
  sheetBg: string;
  sheetBackdrop: string;
  sessionTagBarBg: string;
}

const LIGHT_SHELL_TOKENS: ShellTokens = {
  mainBackground: `
    radial-gradient(ellipse 80% 60% at 70% 20%, ${C.coral}18 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 20% 80%, ${C.navyMid}55 0%, transparent 55%),
    linear-gradient(160deg, ${C.cream} 0%, #f5ece2 60%, #ede4d8 100%)
  `,
  contextBarBg: `${C.navy}ee`,
  contextBarText: C.white,
  contextBarMuted: "rgba(255,255,255,0.35)",
  cardBg: C.white,
  cardBorder: C.border,
  contentPanelBg: C.cream,
  tableHeaderBg: `${C.cream}dd`,
  rowHoverBg: "rgba(255, 237, 213, 0.4)",
  textPrimary: C.navy,
  textMuted: C.muted,
  sheetBg: `
    linear-gradient(180deg,
      ${C.navy} 0%,
      ${C.navyMid} 70%,
      ${C.navyDeep} 100%
    )
  `,
  sheetBackdrop: "rgba(0,0,0,0.55)",
  sessionTagBarBg: `linear-gradient(90deg, ${C.navy} 0%, #252b62 50%, #2e3575 100%)`,
};

const DARK_SHELL_TOKENS: ShellTokens = {
  mainBackground: `
    radial-gradient(ellipse 80% 60% at 70% 20%, ${palette.brand.purpleDeep}55 0%, transparent 60%),
    radial-gradient(ellipse 50% 40% at 20% 80%, ${palette.surface.dark}88 0%, transparent 55%),
    linear-gradient(160deg, ${palette.surface.darkSecondary} 0%, ${palette.surface.dark} 55%, ${palette.surface.darkElevated} 100%)
  `,
  contextBarBg: `${palette.surface.darkSecondary}ee`,
  contextBarText: palette.cream,
  contextBarMuted: palette.muted.dark,
  cardBg: palette.surface.darkElevated,
  cardBorder: "rgba(255,255,255,0.1)",
  contentPanelBg: palette.surface.darkElevated,
  tableHeaderBg: "rgba(255,255,255,0.04)",
  rowHoverBg: "rgba(255,255,255,0.05)",
  textPrimary: palette.cream,
  textMuted: palette.muted.dark,
  sheetBg: `
    linear-gradient(180deg,
      ${palette.surface.darkSecondary} 0%,
      ${palette.surface.darkElevated} 70%,
      ${palette.surface.dark} 100%
    )
  `,
  sheetBackdrop: "rgba(0,0,0,0.72)",
  sessionTagBarBg: `linear-gradient(90deg, ${palette.surface.darkSecondary} 0%, ${palette.surface.darkElevated} 55%, ${palette.brand.purpleDeep}88 100%)`,
};

/**
 * Semantic shell colors for Command Centre main area (sidebar stays dark in both modes).
 */
export function getShellTokens(isDark: boolean): ShellTokens {
  return isDark ? DARK_SHELL_TOKENS : LIGHT_SHELL_TOKENS;
}
