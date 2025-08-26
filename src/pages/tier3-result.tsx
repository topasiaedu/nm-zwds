import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageTransition from "../components/PageTransition";
import ZWDSChart from "../components/ZWDSChart";
import { ChartSettingsProvider, useChartSettings } from "../context/ChartSettingsContext";
import { PALACE_NAMES } from "../utils/zwds/constants";
import { useProfileContext } from "../context/ProfileContext";
import { useTierAccess } from "../context/TierContext";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput } from "../utils/zwds/types";

/**
 * Tier3ResultContent - Tier3/Admin only experimental chart page
 * - First row: Timing
 * - Second row: Aspect of Life
 * - Natal mode shows clean chart (no lines/tags). Selecting a palace triggers transformation lines from that palace.
 */
const Tier3ResultContent: React.FC = () => {
  const { profiles } = useProfileContext();
  const { tier, isAdmin } = useTierAccess();
  const { updateSetting } = useChartSettings();

  // Read optional :id route param to support viewing other profiles
  const { id } = useParams<{ id?: string }>();

  /**
   * Resolve the target profile based on route param or default to self/first.
   * - If :id provided, match by id
   * - Else prefer self profile, fallback to first available
   */
  const profile = useMemo(() => {
    if (id) {
      const byId = profiles.find(p => String(p.id) === String(id));
      if (byId) {
        return byId;
      }
    }
    const self = profiles.find(p => p.is_self);
    return self || profiles[0];
  }, [profiles, id]);

  const calculatedChartData = useMemo(() => {
    if (!profile) return null;
    const timeMatch = String(profile.birth_time).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
    let hour = timeMatch ? parseInt(timeMatch[1]) : 12;
    if (timeMatch && timeMatch[3] && timeMatch[3].toUpperCase() === "PM" && hour < 12) hour += 12;
    if (timeMatch && timeMatch[3] && timeMatch[3].toUpperCase() === "AM" && hour === 12) hour = 0;
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

  // Controls
  type ViewMode = "natal" | "dayun" | "liunian";
  const [viewMode, setViewMode] = useState<ViewMode>("natal");
  const [selectedPalace, setSelectedPalace] = useState<number | null>(null);
  const [selectedDaXianPalace, setSelectedDaXianPalace] = useState<number | null>(null);
  const [selectedPalaceNameNum, setSelectedPalaceNameNum] = useState<number | null>(null);
  const [chartKey, setChartKey] = useState<number>(0);

  if (!(tier === "tier3" || isAdmin)) {
    return (
      <PageTransition>
        <div className="p-6 text-center">
          <h1 className="text-2xl font-bold">Access Restricted</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">This page is available to Tier3 or Admin users.</p>
          <Link to="/dashboard" className="inline-block mt-4 px-4 py-2 rounded-lg bg-indigo-600 text-white">Back to Dashboard</Link>
        </div>
      </PageTransition>
    );
  }

  if (!profile || !calculatedChartData) {
    return (
      <PageTransition>
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Preparing chart...</p>
        </div>
      </PageTransition>
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

  // English to Chinese mapping to locate palace numbers in chartData
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
    if (!calculatedChartData) return null;
    const chineseName = EN_TO_CN[englishName];
    if (!chineseName) return null;
    const idx = calculatedChartData.palaces.findIndex(p => p.name === chineseName);
    return idx >= 0 ? idx + 1 : null;
  };

  /**
   * For Liu Nian: resolve a palace by matching its secondary palace name (English)
   * Secondary name for a palace N is PALACE_NAMES[(selectedPalaceNameNum - N + 12) % 12]
   */
  const getPalaceNumberBySecondaryEnglish = (englishName: string): number | null => {
    if (!selectedPalaceNameNum) return getPalaceNumberByEnglish(englishName);
    // Iterate all palaces and find where secondary matches englishName
    for (let palaceNum = 1; palaceNum <= 12; palaceNum++) {
      let distance = selectedPalaceNameNum - palaceNum;
      if (distance < 0) distance += 12;
      const secondaryCn = PALACE_NAMES[distance];
      const secondaryEn = CN_TO_EN[secondaryCn] || secondaryCn;
      if (secondaryEn === englishName) {
        return palaceNum;
      }
    }
    return null;
  };

  // Da Ming tag index mapping for Dayun aspect selection
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
    // Solve for target palace given formula: tagIndex = (selectedDaXian - target) mod 12
    let target = selectedDaXian - tagIndex;
    while (target <= 0) target += 12;
    while (target > 12) target -= 12;
    return target;
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-900 dark:to-indigo-900/20">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                >
                  <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 dark:from-purple-900/40 dark:to-indigo-900/40 dark:text-purple-300">
                  ZI WEI DOU SHU CHART ANALYSIS
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 dark:from-white dark:via-indigo-100 dark:to-purple-100 bg-clip-text text-transparent">
                Advanced Chart Analysis
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Interface with advanced timing controls and palace interaction mapping
              </p>
            </div>
          </div>



          {/* Control Panel */}
          <div className="mb-8">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6">
              <div className="space-y-6">
                {/* Timing Controls */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mr-3"></div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Timing Mode</h3>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {([
                      { key: "natal", label: "Natal", desc: "Clean baseline chart" },
                      { key: "dayun", label: "Da Yun", desc: "Major life cycles" },
                      { key: "liunian", label: "Liu Nian", desc: "Annual influences" },
                    ] as Array<{ key: ViewMode; label: string; desc: string }>).map(opt => {
                      const active = viewMode === opt.key;
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setViewMode(opt.key);
                            if (opt.key === "dayun") {
                              // Enable Da Yun visuals and Da Xian interaction
                              updateSetting("liuNianTag", false);
                              updateSetting("showDaYunHighlight", true);
                              updateSetting("daXianClickInteraction", true);
                              updateSetting("showDaMingBottomLabel", true);
                              // Determine current Da Yun palace and mimic Da Xian click (no transformation lines)
                              if (calculatedChartData) {
                                const currentAge = new Date().getFullYear() - calculatedChartData.lunarDate.year + 1;
                                const daYunPalace = calculatedChartData.palaces.find(p => p.majorLimit && p.majorLimit.startAge <= currentAge && p.majorLimit.endAge >= currentAge);
                                setSelectedDaXianPalace(daYunPalace ? daYunPalace.number : null);
                              }
                            } else if (opt.key === "natal") {
                              // Restore clean natal view
                              updateSetting("liuNianTag", false);
                              updateSetting("showDaYunHighlight", false);
                              updateSetting("daXianClickInteraction", false);
                              updateSetting("palaceNameClickInteraction", false);
                              updateSetting("showDaMingBottomLabel", false);
                              updateSetting("showSecondaryBottomLabel", false);
                              setSelectedDaXianPalace(null);
                              setSelectedPalaceNameNum(null);
                            } else if (opt.key === "liunian") {
                              // Liu Nian mode: show Liu Nian tags, and replace bottom label with secondary name
                              updateSetting("liuNianTag", true);
                              updateSetting("daXianClickInteraction", false);
                              updateSetting("palaceNameClickInteraction", true);
                              updateSetting("showDaYunHighlight", false);
                              updateSetting("showDaMingBottomLabel", false);
                              updateSetting("showSecondaryBottomLabel", true);
                              // No Da Xian selection in Liu Nian
                              setSelectedDaXianPalace(null);
                              // Mimic click on the palace that has the Liu Nian tag (current year)
                              if (calculatedChartData) {
                                const currentYear = new Date().getFullYear();
                                const palaceWithLiuNian = calculatedChartData.palaces.find(p => p.annualFlow && p.annualFlow.year === currentYear);
                                setSelectedPalaceNameNum(palaceWithLiuNian ? palaceWithLiuNian.number : null);
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
                          <div className={`text-xs mt-0.5 ${active ? "text-purple-100" : "text-gray-500 dark:text-gray-400"}`}>
                            {opt.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect Controls */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-3"></div>
                    <h3 className="text-base font-semibold text-gray-900 dark:text-white">Aspect of Life</h3>
                    <div className="ml-auto text-xs text-gray-500 dark:text-gray-400">
                      Click to analyze transformation patterns
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {PALACE_NAMES_EN.map((name) => {
                      const palaceNumber = getPalaceNumberByEnglish(name);
                      // Compute active state for both Natal and Dayun
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
                              setSelectedPalace(prev => {
                                if (prev === num) {
                                  // Toggle off -> force remount to ensure lines clear
                                  setChartKey(k => k + 1);
                                  return null;
                                }
                                return num;
                              });
                              return;
                            }
                            if (viewMode === "dayun") {
                              // Use Da Ming mapping from selected Da Xian palace
                              if (!selectedDaXianPalace) return;
                              const tagIndex = TAG_INDEX_BY_ASPECT[name as keyof typeof TAG_INDEX_BY_ASPECT];
                              const targetPalace = getPalaceByTagIndex(selectedDaXianPalace, tagIndex);
                              setSelectedPalace(prev => {
                                if (prev === targetPalace) {
                                  setChartKey(k => k + 1);
                                  return null;
                                }
                                return targetPalace;
                              });
                              return;
                            }
                            if (viewMode === "liunian") {
                              // Map to palace by matching secondary palace name to selected aspect
                              const num = getPalaceNumberBySecondaryEnglish(name);
                              setSelectedPalace(prev => {
                                if (prev === num) {
                                  setChartKey(k => k + 1);
                                  return null;
                                }
                                return num;
                              });
                              return;
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

          {/* Chart and Profile Layout */}
          <div className="mb-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Chart Container - Left Side */}
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

              {/* Profile Information Card - Right Side */}
              <div className="lg:col-span-1">
                <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50 p-6 h-fit">
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 mr-3"></div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Profile Details</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{profile.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Date</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">
                        {new Date(profile.birthday).toLocaleDateString("en-US", { 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Time</p>
                      <p className="text-base font-semibold text-gray-900 dark:text-white">{String(profile.birth_time)}</p>
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
      </div>
    </PageTransition>
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