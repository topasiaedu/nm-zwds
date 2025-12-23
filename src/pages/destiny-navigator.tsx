import React, { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import PageTransition from "../components/PageTransition";
import { useProfileContext } from "../context/ProfileContext";
import { useTierAccess } from "../context/TierContext";
import { NavigatorState } from "../types/destiny-navigator";
import CosmicPortal from "../components/destiny-navigator/stages/CosmicPortal";
import AspectSelector from "../components/destiny-navigator/stages/AspectSelector";
import TimeframeSelector from "../components/destiny-navigator/stages/TimeframeSelector";
import DayunPeriodSelector from "../components/destiny-navigator/stages/DayunPeriodSelector";
import MonthSelector from "../components/destiny-navigator/stages/MonthSelector";
import AnalysisView from "../components/destiny-navigator/stages/AnalysisView";
import type { DayunPeriod } from "../types/destiny-navigator";

/**
 * DestinyNavigator - Admin-only interactive feature for analyzing life aspects
 * across different timeframes using Zi Wei Dou Shu principles.
 * 
 * This page serves as the main entry point and coordinator for the Navigator
 * experience. Individual stage components will be added by other agents.
 */
const DestinyNavigator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profiles, loading: profilesLoading } = useProfileContext();
  const { isAdmin } = useTierAccess();

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
    return profiles.find(p => String(p.id) === String(id));
  }, [profiles, id]);

  /**
   * Admin-only access control
   * Redirect non-admin users to dashboard with message
   */
  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-cyan-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Access Restricted</h1>
            <p className="text-cyan-200 mb-6">
              The Destiny Navigator is currently available to Admin users only.
            </p>
            <Link
              to="/dashboard"
              className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-medium transition-all"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </PageTransition>
    );
  }

  /**
   * Loading state while profiles are being fetched
   */
  if (profilesLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mb-4"></div>
            <p className="text-cyan-200">Loading profile...</p>
          </div>
        </div>
      </PageTransition>
    );
  }

  /**
   * Profile not found state
   */
  if (!profile) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-900 to-slate-900 flex items-center justify-center p-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 max-w-md text-center">
            <div className="mb-6">
              <svg
                className="w-16 h-16 mx-auto text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white mb-3">Profile Not Found</h1>
            <p className="text-cyan-200 mb-6">
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
      </PageTransition>
    );
  }

  /**
   * Main Navigator interface
   */
  return (
    <PageTransition>
      {/* Stage Components with AnimatePresence - Full screen for portal/aspect/timeframe */}
      <AnimatePresence mode="wait">
            {navigatorState.currentStage === "portal" && (
              <CosmicPortal
                key="portal"
                onComplete={() => setNavigatorState(prev => ({
                  ...prev,
                  currentStage: "aspect"
                }))}
              />
            )}
            
            {navigatorState.currentStage === "aspect" && (
              <AspectSelector
                key="aspect"
                onSelect={(aspect) => setNavigatorState(prev => ({
                  ...prev,
                  selectedAspect: aspect,
                  currentStage: "timeframe"
                }))}
              />
            )}
            
            {navigatorState.currentStage === "timeframe" && (
              <TimeframeSelector
                key="timeframe"
                selectedAspect={navigatorState.selectedAspect}
                onBack={() => setNavigatorState(prev => ({
                  ...prev,
                  selectedTimeframe: null,
                  currentStage: "aspect"
                }))}
                onSelect={(timeframe) => {
                  // If dayun selected, go to dayun period selection
                  if (timeframe === "dayun") {
                    setNavigatorState(prev => ({
                      ...prev,
                      selectedTimeframe: timeframe,
                      currentStage: "dayunPeriod"
                    }));
                  }
                  // If monthly selected, go to month selection
                  else if (timeframe === "liumonth") {
                    setNavigatorState(prev => ({
                      ...prev,
                      selectedTimeframe: timeframe,
                      currentStage: "monthSelection"
                    }));
                  }
                  // Otherwise go directly to analysis
                  else {
                    setNavigatorState(prev => ({
                      ...prev,
                      selectedTimeframe: timeframe,
                      currentStage: "analysis"
                    }));
                  }
                }}
              />
            )}
            
            {navigatorState.currentStage === "dayunPeriod" && (
              <DayunPeriodSelector
                key="dayunPeriod"
                selectedAspect={navigatorState.selectedAspect}
                onBack={() => setNavigatorState(prev => ({
                  ...prev,
                  selectedDayunPeriod: undefined,
                  currentStage: "timeframe"
                }))}
                onSelect={(period: DayunPeriod) => setNavigatorState(prev => ({
                  ...prev,
                  selectedDayunPeriod: period,
                  currentStage: "analysis"
                }))}
              />
            )}
            
            {navigatorState.currentStage === "monthSelection" && (
              <MonthSelector
                key="monthSelection"
                selectedAspect={navigatorState.selectedAspect}
                onBack={() => setNavigatorState(prev => ({
                  ...prev,
                  selectedMonth: undefined,
                  currentStage: "timeframe"
                }))}
                onSelect={(month: number) => setNavigatorState(prev => ({
                  ...prev,
                  selectedMonth: month,
                  currentStage: "analysis"
                }))}
              />
            )}
            
            {navigatorState.currentStage === "analysis" && (
              <AnalysisView
                key="analysis"
                navigatorState={navigatorState}
                profile={profile}
                onBack={() => {
                  // Go back to appropriate stage based on selected timeframe
                  if (navigatorState.selectedTimeframe === "dayun") {
                    setNavigatorState(prev => ({
                      ...prev,
                      currentStage: "dayunPeriod"
                    }));
                  } else if (navigatorState.selectedTimeframe === "liumonth") {
                    setNavigatorState(prev => ({
                      ...prev,
                      currentStage: "monthSelection"
                    }));
                  } else {
                    setNavigatorState(prev => ({
                      ...prev,
                      currentStage: "timeframe"
                    }));
                  }
                }}
                onChangeSelection={() => setNavigatorState(prev => ({
                  ...prev,
                  currentStage: "aspect",
                  selectedAspect: null,
                  selectedTimeframe: null,
                  selectedDayunPeriod: undefined,
                  selectedMonth: undefined
                }))}
              />
            )}
          </AnimatePresence>
    </PageTransition>
  );
};

export default DestinyNavigator;
