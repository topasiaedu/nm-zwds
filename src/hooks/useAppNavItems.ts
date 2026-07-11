import { useMemo } from "react";
import {
  IconAI,
  IconAlign,
  IconCalc,
  IconChart,
  IconDashboard,
  IconNav,
  IconReport,
  IconSettings,
} from "../components/layout/appNavIcons";
import type {
  AppNavItem,
  UseAppNavItemsOptions,
  UseAppNavItemsResult,
} from "../components/layout/commandCentreTypes";
import { useProfileContext } from "../context/ProfileContext";
import { useTierAccess } from "../context/TierContext";

/**
 * Returns tier-aware sidebar navigation items for Command Centre pages.
 * Mirrors gating in dashboard and result.tsx (chartUrl, premium tools).
 */
export function useAppNavItems(
  options: UseAppNavItemsOptions = {}
): UseAppNavItemsResult {
  const { activeKey } = options;
  const { profiles } = useProfileContext();
  const {
    hasAIAssistant,
    hasFounderReport,
    hasAlignmentAdvantage,
    hasDestinyNavigatorTool,
    isAdmin,
    tier,
  } = useTierAccess();

  const selfProfile = useMemo(
    () => profiles.find((profile) => profile.is_self),
    [profiles]
  );

  const chartUrl = tier === "tier3" && !isAdmin ? "/tier3-result" : "/chart";
  const destinyNavigatorUrl = selfProfile
    ? `/destiny-navigator/${selfProfile.id}`
    : "/calculate";

  const items = useMemo((): AppNavItem[] => {
    const navItems: AppNavItem[] = [
      {
        to: "/dashboard",
        label: "Dashboard",
        icon: IconDashboard,
        active: activeKey === "dashboard",
      },
      {
        to: chartUrl,
        label: "My Chart",
        icon: IconChart,
        active: activeKey === "my-chart",
      },
      {
        to: "/calculate",
        label: "Calculate",
        icon: IconCalc,
        badge: profiles.length > 0 ? String(profiles.length) : undefined,
        active: activeKey === "calculate",
      },
    ];

    // Soft-hidden per CAE feedback; routes and tier flags remain.
    if (false && hasDestinyNavigatorTool) {
      navItems.push({
        to: destinyNavigatorUrl,
        label: "Destiny Navigator",
        icon: IconNav,
        active: activeKey === "destiny-navigator",
      });
    }

    if (false && hasAIAssistant) {
      navItems.push({
        to: "/destiny-wealth-navigator",
        label: "AI Wealth Assistant",
        icon: IconAI,
        active: activeKey === "ai-wealth-assistant",
      });
    }

    if (hasFounderReport) {
      navItems.push({
        to: "/founder-report",
        label: "Founder Report",
        icon: IconReport,
        active: activeKey === "founder-report",
      });
    }

    if (hasAlignmentAdvantage) {
      navItems.push({
        to: "/alignment-advantage",
        label: "Alignment Advantage",
        icon: IconAlign,
        active: activeKey === "alignment-advantage",
      });
    }

    navItems.push({
      to: "/settings",
      label: "Settings",
      icon: IconSettings,
      active: activeKey === "settings",
    });

    return navItems;
  }, [
    activeKey,
    chartUrl,
    destinyNavigatorUrl,
    hasAIAssistant,
    hasAlignmentAdvantage,
    hasDestinyNavigatorTool,
    hasFounderReport,
    profiles.length,
  ]);

  return { items, chartUrl, destinyNavigatorUrl };
}
