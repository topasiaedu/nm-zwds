import type { MutableRefObject, ReactNode } from "react";

/** App-level sidebar navigation link */
export interface AppNavItem {
  to: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  badge?: string;
}

/** Keys for marking the active nav item via useAppNavItems */
export type AppNavItemKey =
  | "dashboard"
  | "my-chart"
  | "calculate"
  | "destiny-navigator"
  | "ai-wealth-assistant"
  | "founder-report"
  | "alignment-advantage"
  | "settings";

export interface UseAppNavItemsOptions {
  /** Which nav item should render as active */
  activeKey?: AppNavItemKey;
}

export interface UseAppNavItemsResult {
  items: AppNavItem[];
  chartUrl: string;
  destinyNavigatorUrl: string;
}

export interface CommandCentreShellProps {
  /** Small brand label above the Chinese title (e.g. "Purple Star Astrology") */
  brandLabel: string;
  /** Subtitle under the brand block (e.g. profile or user name) */
  brandSubLabel: string;
  /** Tier-aware sidebar navigation items */
  appNavItems: AppNavItem[];
  /**
   * Mobile-only sticky header title (e.g. "Dashboard").
   * Not shown on desktop — desktop uses the sidebar only.
   * Ignored when `mobileTopExtra` is provided.
   */
  contextTitle?: string;
  /**
   * Mobile-only sticky header subtitle under `contextTitle`.
   * Ignored when `mobileTopExtra` is provided.
   */
  contextSubtitle?: string;
  /** Optional footer slot in sidebar (user avatar linking to Settings, etc.). */
  sidebarFooter?: ReactNode;
  /**
   * Optional mobile-only content rendered in the sticky header row beside the
   * hamburger (e.g. tappable "Now viewing" section/chapter picker).
   * Replaces the default contextTitle/subtitle block — not a second row.
   */
  mobileTopExtra?: ReactNode;
  /** Optional slot below app nav (report sections, AA chapters) */
  navSlot?: ReactNode;
  /**
   * Optional ref populated with closeSidebar so parents can dismiss the mobile drawer
   * (e.g. report section navigation in navSlot).
   */
  onSidebarCloseRef?: MutableRefObject<(() => void) | null>;
  /**
   * When true, main does not scroll — children must fill height with an internal
   * scroll region (e.g. chat iframe pages). Default keeps overflow-y-auto.
   */
  lockMainScroll?: boolean;
  /** Main scrollable content */
  children: ReactNode;
}
