import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import CommandCentreShell from "../components/layout/CommandCentreShell";
import { useAppNavItems } from "../hooks/useAppNavItems";
import { useProfileContext } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useTierAccess } from "../context/TierContext";
import { C } from "../components/alignment-advantage/shared/constants";
import { Sparkle } from "../components/alignment-advantage/shared/Sparkle";
import { NavigatorState } from "../types/destiny-navigator";
import CosmicPortal from "../components/destiny-navigator/stages/CosmicPortal";
import AspectSelector from "../components/destiny-navigator/stages/AspectSelector";
import TimeframeSelector from "../components/destiny-navigator/stages/TimeframeSelector";
import DayunPeriodSelector from "../components/destiny-navigator/stages/DayunPeriodSelector";
import MonthSelector from "../components/destiny-navigator/stages/MonthSelector";
import AnalysisView from "../components/destiny-navigator/stages/AnalysisView";
import type { DayunPeriod } from "../types/destiny-navigator";
import { chartSpinnerClass } from "../styles/chartUi";

/**
 * DestinyNavigator - Feature-flag interactive feature for analyzing life aspects
 * across different timeframes using Zi Wei Dou Shu principles.
 *
 * This page serves as the main entry point and coordinator for the Navigator
 * experience. Individual stage components will be added by other agents.
 */
const DestinyNavigator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const { user } = useAuth();
  const { hasDestinyNavigatorTool } = useTierAccess();
  const { items: appNavItems } = useAppNavItems({ activeKey: "destiny-navigator" });

  /**
   * Navigator state management - tracks progression through stages
   */
  const [navigatorState, setNavigatorState] = useState<NavigatorState>({
    currentStage: "portal",
    selectedAspect: null,
    selectedTimeframe: null,
    selectedDayunPeriod: undefined,
    selectedMonth: undefined,
    profileId: id || "",
  });

  /**
   * Find the target profile by ID from URL params
   */
  const profile = useMemo(() => {
    if (!id) return null;
    return profiles.find((p) => String(p.id) === String(id));
  }, [profiles, id]);

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const userInitial = displayName.trim().length > 0
    ? displayName.trim().charAt(0).toUpperCase()
    : "?";

  const layoutProfileName = profile?.name ?? "Destiny Navigator";

  const sidebarFooter = (
    <div className="px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 border border-white/30"
          style={{ background: "rgba(255,255,255,0.15)", color: C.white }}
        >
          {userInitial}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-bold text-white truncate">{displayName}</p>
          <p className="text-[10px] truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
            {user?.email ?? ""}
          </p>
        </div>
        <Sparkle size={10} color="rgba(255,255,255,0.60)" />
      </div>
    </div>
  );

  const layoutShell = (
    shellChildren: React.ReactNode
  ): React.ReactElement => (
    <PageTransition>
      <CommandCentreShell
        brandLabel="Purple Star Astrology"
        brandSubLabel={layoutProfileName}
        contextTitle="Destiny Navigator"
        contextSubtitle={layoutProfileName}
        appNavItems={appNavItems}
        sidebarFooter={sidebarFooter}
      >
        {shellChildren}
      </CommandCentreShell>
    </PageTransition>
  );

  /**
   * Feature-flag access control
   */
  if (!hasDestinyNavigatorTool) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="max-w-md text-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-lg">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-cyan-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Access Restricted</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Destiny Navigator access required</p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Loading state while profiles are being fetched
   */
  if (profilesLoading) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className={`${chartSpinnerClass} mb-4`} />
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  /**
   * Profile not found state
   */
  if (!profile) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px] px-4">
        <div className="max-w-md text-center rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-8 shadow-lg">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Profile Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The requested profile could not be found.
          </p>
          <Link
            to="/dashboard"
            className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium transition-all"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  /**
   * Main Navigator interface
   */
  return layoutShell(
    <AnimatePresence mode="wait">
      {navigatorState.currentStage === "portal" && (
        <CosmicPortal
          key="portal"
          onComplete={() => setNavigatorState((prev) => ({
            ...prev,
            currentStage: "aspect",
          }))}
        />
      )}

      {navigatorState.currentStage === "aspect" && (
        <AspectSelector
          key="aspect"
          onSelect={(aspect) => setNavigatorState((prev) => ({
            ...prev,
            selectedAspect: aspect,
            currentStage: "timeframe",
          }))}
        />
      )}

      {navigatorState.currentStage === "timeframe" && (
        <TimeframeSelector
          key="timeframe"
          selectedAspect={navigatorState.selectedAspect}
          onBack={() => setNavigatorState((prev) => ({
            ...prev,
            selectedTimeframe: null,
            currentStage: "aspect",
          }))}
          onSelect={(timeframe) => {
            if (timeframe === "dayun") {
              setNavigatorState((prev) => ({
                ...prev,
                selectedTimeframe: timeframe,
                currentStage: "dayunPeriod",
              }));
            } else if (timeframe === "liumonth") {
              setNavigatorState((prev) => ({
                ...prev,
                selectedTimeframe: timeframe,
                currentStage: "monthSelection",
              }));
            } else {
              setNavigatorState((prev) => ({
                ...prev,
                selectedTimeframe: timeframe,
                currentStage: "analysis",
              }));
            }
          }}
        />
      )}

      {navigatorState.currentStage === "dayunPeriod" && (
        <DayunPeriodSelector
          key="dayunPeriod"
          selectedAspect={navigatorState.selectedAspect}
          onBack={() => setNavigatorState((prev) => ({
            ...prev,
            selectedDayunPeriod: undefined,
            currentStage: "timeframe",
          }))}
          onSelect={(period: DayunPeriod) => setNavigatorState((prev) => ({
            ...prev,
            selectedDayunPeriod: period,
            currentStage: "analysis",
          }))}
        />
      )}

      {navigatorState.currentStage === "monthSelection" && (
        <MonthSelector
          key="monthSelection"
          selectedAspect={navigatorState.selectedAspect}
          onBack={() => setNavigatorState((prev) => ({
            ...prev,
            selectedMonth: undefined,
            currentStage: "timeframe",
          }))}
          onSelect={(month: number) => setNavigatorState((prev) => ({
            ...prev,
            selectedMonth: month,
            currentStage: "analysis",
          }))}
        />
      )}

      {navigatorState.currentStage === "analysis" && (
        <AnalysisView
          key="analysis"
          navigatorState={navigatorState}
          profile={profile}
          onBack={() => {
            if (navigatorState.selectedTimeframe === "dayun") {
              setNavigatorState((prev) => ({
                ...prev,
                currentStage: "dayunPeriod",
              }));
            } else if (navigatorState.selectedTimeframe === "liumonth") {
              setNavigatorState((prev) => ({
                ...prev,
                currentStage: "monthSelection",
              }));
            } else {
              setNavigatorState((prev) => ({
                ...prev,
                currentStage: "timeframe",
              }));
            }
          }}
          onChangeSelection={() => setNavigatorState((prev) => ({
            ...prev,
            currentStage: "aspect",
            selectedAspect: null,
            selectedTimeframe: null,
            selectedDayunPeriod: undefined,
            selectedMonth: undefined,
          }))}
        />
      )}
    </AnimatePresence>
  );
};

export default DestinyNavigator;
