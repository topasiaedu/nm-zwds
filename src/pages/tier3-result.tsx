import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import CommandCentreShell from "../components/layout/CommandCentreShell";
import { useAppNavItems } from "../hooks/useAppNavItems";
import ZWDSChart from "../components/ZWDSChart";
import { ChartSettingsProvider, useChartSettings } from "../context/ChartSettingsContext";
import { PALACE_NAMES } from "../utils/zwds/constants";
import { useProfileContext } from "../context/ProfileContext";
import { useAuth } from "../context/AuthContext";
import { useTierAccess } from "../context/TierContext";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";
import { C } from "../components/alignment-advantage/shared/constants";
import { Sparkle } from "../components/alignment-advantage/shared/Sparkle";

/**
 * Tier3ResultContent - Tier3/Admin only experimental chart page
 * - First row: Timing
 * - Second row: Aspect of Life
 * - Natal mode shows clean chart (no lines/tags). Selecting a palace triggers transformation lines from that palace.
 */
const Tier3ResultContent: React.FC = () => {
  const { profiles } = useProfileContext();
  const { user } = useAuth();
  const { tier, isAdmin } = useTierAccess();
  const { updateSetting } = useChartSettings();
  const { items: appNavItems } = useAppNavItems({ activeKey: "my-chart" });

  const { id } = useParams<{ id?: string }>();

  const profile = useMemo(() => {
    if (id) {
      const byId = profiles.find((p) => String(p.id) === String(id));
      if (byId) {
        return byId;
      }
    }
    const self = profiles.find((p) => p.is_self);
    return self || profiles[0];
  }, [profiles, id]);

  const calculatedChartData = useMemo(() => {
    if (!profile) {
      return null;
    }
    const timeMatch = String(profile.birth_time).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
    let hour = timeMatch ? parseInt(timeMatch[1], 10) : 12;
    if (timeMatch && timeMatch[3] && timeMatch[3].toUpperCase() === "PM" && hour < 12) {
      hour += 12;
    }
    if (timeMatch && timeMatch[3] && timeMatch[3].toUpperCase() === "AM" && hour === 12) {
      hour = 0;
    }
    const dateObj = new Date(`${profile.birthday}T12:00:00`);
    const input: ChartInput = {
      year: dateObj.getFullYear(),
      month: dateObj.getMonth() + 1,
      day: dateObj.getDate(),
      hour,
      gender: profile.gender === "male" ? "male" : "female",
      name: profile.name,
    };
    const calc = new ZWDSCalculator(input);
    return calc.calculate();
  }, [profile]);

  type ViewMode = "natal" | "dayun" | "liunian";
  const [viewMode, setViewMode] = useState<ViewMode>("natal");
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const [selectedDaXianPalace, setSelectedDaXianPalace] = useState<number | null>(null);
  const [selectedPalaceNameNum, setSelectedPalaceNameNum] = useState<number | null>(null);
  const [chartKey, setChartKey] = useState<number>(0);

  const displayName =
    user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";

  const userInitial = displayName.trim().length > 0
    ? displayName.trim().charAt(0).toUpperCase()
    : "?";

  const layoutProfileName = profile?.name ?? "My Chart";

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
        contextTitle="My Chart"
        contextSubtitle={layoutProfileName}
        appNavItems={appNavItems}
        sidebarFooter={sidebarFooter}
      >
        {shellChildren}
      </CommandCentreShell>
    </PageTransition>
  );

  if (!(tier === "tier3" || isAdmin)) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px] px-4 text-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Access Restricted</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            This page is available to Tier3 or Admin users.
          </p>
          <Link
            to="/dashboard"
            className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!profile || !calculatedChartData) {
    return layoutShell(
      <div className="flex items-center justify-center min-h-[400px] px-4 text-center">
        <div>
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Preparing chart...</p>
        </div>
      </div>
    );
  }

  const PALACE_NAMES_EN: ReadonlyArray<string> = [
    "Life",
    "Siblings",
    "Spouse",
    "Children",
    "Wealth",
    "Health",
    "Travel",
    "Friends",
    "Career",
    "Property",
    "Wellbeing",
    "Parents",
  ];

  const EN_TO_CN: Record<string, string> = {
    Life: "命宫",
    Siblings: "兄弟",
    Spouse: "夫妻",
    Children: "子女",
    Wealth: "财帛",
    Health: "疾厄",
    Travel: "迁移",
    Friends: "交友",
    Career: "官禄",
    Property: "田宅",
    Wellbeing: "福德",
    Parents: "父母",
  };
  const CN_TO_EN: Record<string, string> = Object.keys(EN_TO_CN).reduce((acc, en) => {
    const cn = EN_TO_CN[en as keyof typeof EN_TO_CN];
    acc[cn] = en;
    return acc;
  }, {} as Record<string, string>);

  const getPalaceNumberByEnglish = (englishName: string): number | null => {
    if (!calculatedChartData) {
      return null;
    }
    const chineseName = EN_TO_CN[englishName];
    if (!chineseName) {
      return null;
    }
    const idx = calculatedChartData.palaces.findIndex((p) => p.name === chineseName);
    return idx >= 0 ? idx + 1 : null;
  };

  const getPalaceNumberBySecondaryEnglish = (englishName: string): number | null => {
    if (!selectedPalaceNameNum) {
      return getPalaceNumberByEnglish(englishName);
    }
    for (let palaceNum = 1; palaceNum <= 12; palaceNum++) {
      let distance = selectedPalaceNameNum - palaceNum;
      if (distance < 0) {
        distance += 12;
      }
      const secondaryCn = PALACE_NAMES[distance];
      const secondaryEn = CN_TO_EN[secondaryCn] || secondaryCn;
      if (secondaryEn === englishName) {
        return palaceNum;
      }
    }
    return null;
  };

  const TAG_INDEX_BY_ASPECT: Record<string, number> = {
    Life: 0,
    Siblings: 1,
    Spouse: 2,
    Children: 3,
    Wealth: 4,
    Health: 5,
    Travel: 6,
    Friends: 7,
    Career: 8,
    Property: 9,
    Wellbeing: 10,
    Parents: 11,
  };

  const getPalaceByTagIndex = (selectedDaXian: number, tagIndex: number): number => {
    let target = selectedDaXian - tagIndex;
    while (target <= 0) {
      target += 12;
    }
    while (target > 12) {
      target -= 12;
    }
    return target;
  };

  return layoutShell(
    <div className="relative px-4 sm:px-6 md:px-10 py-6 md:py-10 min-w-0">
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
        Interface with advanced timing controls and palace interaction mapping
      </p>

      <div className="mb-8">
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
          <div className="space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">Timing Mode</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                {([
                  { key: "natal", label: "Natal", desc: "Clean baseline chart" },
                  { key: "dayun", label: "Da Yun", desc: "Major life cycles" },
                  { key: "liunian", label: "Liu Nian", desc: "Annual influences" },
                ] as Array<{ key: ViewMode; label: string; desc: string }>).map((opt) => {
                  const active = viewMode === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        setViewMode(opt.key);
                        if (opt.key === "dayun") {
                          updateSetting("liuNianTag", false);
                          updateSetting("showDaYunHighlight", true);
                          updateSetting("daXianClickInteraction", true);
                          updateSetting("showDaMingBottomLabel", true);
                          if (calculatedChartData) {
                            const currentAge =
                              new Date().getFullYear() - calculatedChartData.lunarDate.year + 1;
                            const daYunPalace = calculatedChartData.palaces.find(
                              (p) =>
                                p.majorLimit &&
                                p.majorLimit.startAge <= currentAge &&
                                p.majorLimit.endAge >= currentAge
                            );
                            setSelectedDaXianPalace(daYunPalace ? daYunPalace.number : null);
                          }
                        } else if (opt.key === "natal") {
                          updateSetting("liuNianTag", false);
                          updateSetting("showDaYunHighlight", false);
                          updateSetting("daXianClickInteraction", false);
                          updateSetting("palaceNameClickInteraction", false);
                          updateSetting("showDaMingBottomLabel", false);
                          updateSetting("showSecondaryBottomLabel", false);
                          setSelectedDaXianPalace(null);
                          setSelectedPalaceNameNum(null);
                        } else if (opt.key === "liunian") {
                          updateSetting("liuNianTag", true);
                          updateSetting("daXianClickInteraction", false);
                          updateSetting("palaceNameClickInteraction", true);
                          updateSetting("showDaYunHighlight", false);
                          updateSetting("showDaMingBottomLabel", false);
                          updateSetting("showSecondaryBottomLabel", true);
                          setSelectedDaXianPalace(null);
                          if (calculatedChartData) {
                            const currentYear = new Date().getFullYear();
                            const palaceWithLiuNian = calculatedChartData.palaces.find(
                              (p) => p.annualFlow && p.annualFlow.year === currentYear
                            );
                            setSelectedPalaceNameNum(
                              palaceWithLiuNian ? palaceWithLiuNian.number : null
                            );
                          }
                        }
                      }}
                      className={`group relative px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25 scale-105"
                          : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-purple-300 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20"
                      }`}
                    >
                      <div className="text-sm font-semibold">{opt.label}</div>
                      <div
                        className={`text-xs mt-0.5 ${
                          active ? "text-purple-100" : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {opt.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3" />
                <h3 className="text-base font-semibold text-gray-900 dark:text-white">
                  Aspect of Life
                </h3>
                <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                  Click to analyze transformation patterns
                </div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {PALACE_NAMES_EN.map((name) => {
                  const palaceNumber = getPalaceNumberByEnglish(name);
                  let active = false;
                  if (viewMode === "natal") {
                    active = selectedPalace === palaceNumber;
                  } else if (viewMode === "dayun" && selectedDaXianPalace) {
                    const tagIndex = TAG_INDEX_BY_ASPECT[name as keyof typeof TAG_INDEX_BY_ASPECT];
                    const mappedPalace = getPalaceByTagIndex(selectedDaXianPalace, tagIndex);
                    active = selectedPalace === mappedPalace;
                  } else if (viewMode === "liunian") {
                    active = selectedPalace === getPalaceNumberBySecondaryEnglish(name);
                  }
                  return (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={active}
                      onClick={() => {
                        if (viewMode === "natal") {
                          const num = getPalaceNumberByEnglish(name);
                          setSelectedPalace((prev) => {
                            if (prev === num) {
                              setChartKey((k) => k + 1);
                              return null;
                            }
                            return num;
                          });
                          return;
                        }
                        if (viewMode === "dayun") {
                          if (!selectedDaXianPalace) {
                            return;
                          }
                          const tagIndex = TAG_INDEX_BY_ASPECT[name as keyof typeof TAG_INDEX_BY_ASPECT];
                          const targetPalace = getPalaceByTagIndex(selectedDaXianPalace, tagIndex);
                          setSelectedPalace((prev) => {
                            if (prev === targetPalace) {
                              setChartKey((k) => k + 1);
                              return null;
                            }
                            return targetPalace;
                          });
                          return;
                        }
                        if (viewMode === "liunian") {
                          const num = getPalaceNumberBySecondaryEnglish(name);
                          setSelectedPalace((prev) => {
                            if (prev === num) {
                              setChartKey((k) => k + 1);
                              return null;
                            }
                            return num;
                          });
                        }
                      }}
                      className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                        active
                          ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-500/25 scale-105 border-indigo-500"
                          : "bg-white/80 dark:bg-gray-700/80 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 hover:border-indigo-300 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                      }`}
                    >
                      {name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-8">
              <div className="flex justify-center">
                <div className="w-full max-w-4xl">
                  <ZWDSChart
                    key={chartKey}
                    chartData={calculatedChartData}
                    disableInteraction={true}
                    selectedPalaceControlled={selectedPalace}
                    selectedDaXianControlled={selectedDaXianPalace}
                    selectedPalaceNameControlled={selectedPalaceNameNum}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 h-fit">
              <div className="flex items-center mb-6">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3" />
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Profile Details
                </h2>
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {profile.name}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Date</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {new Date(profile.birthday).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Time</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {String(profile.birth_time)}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                  <p className="text-base font-semibold text-gray-900 dark:text-white">
                    {profile.gender === "male" ? "Male" : "Female"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Tier3Result: React.FC = () => {
  return (
    <ChartSettingsProvider defaultPageType="tier3-result">
      <Tier3ResultContent />
    </ChartSettingsProvider>
  );
};

export default Tier3Result;
