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
          <Link to="/dashboard" className="inline-block mt-4 px-6 py-3 rounded-lg bg-white/80 dark:bg-gray-800/60 font-semibold uppercase tracking-wider transition-all duration-200" style={{
            color: '#B8860B',
            borderColor: '#B8860B',
            borderWidth: '2px'
          }} onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#D4AF37';
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
          }} onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#B8860B';
            e.currentTarget.style.boxShadow = 'none';
          }}>Back to Dashboard</Link>
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
    <>
      <style>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .gradient-border {
          position: relative;
          background: linear-gradient(-45deg, #D4AF37, #FFD700, #DAA520, #B8860B, #D4AF37, #FFD700, #DAA520);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
          padding: 3px;
          border-radius: 1rem;
        }
        .gradient-border-inner {
          background: rgba(255, 255, 255, 0.95);
          border-radius: calc(1rem - 3px);
          position: relative;
          z-index: 1;
        }
        .dark .gradient-border-inner {
          background: rgba(31, 41, 55, 0.95);
        }

        .button-gradient-border {
          position: relative;
          background: linear-gradient(-45deg, #D4AF37, #FFD700, #DAA520, #B8860B, #D4AF37, #FFD700, #DAA520);
          background-size: 400% 400%;
          animation: gradient 6s ease infinite;
          padding: 2px;
          border-radius: 1rem;
        }
        .button-gradient-inner {
          background: linear-gradient(-45deg, #D4AF37, #FFD700, #DAA520, #B8860B, #D4AF37, #FFD700, #DAA520);
          background-size: 200% 200%;
          animation: gradient 6s ease infinite;
          border-radius: 0.875rem;
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          color: #1a1a1a;
          font-weight: 600;
        }
      `}</style>
      <PageTransition>
      <div className="min-h-screen ">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Link 
                  to="/dashboard" 
                  className="inline-flex items-center px-4 py-2.5 text-sm font-semibold uppercase tracking-wider transition-colors group rounded-lg backdrop-blur-sm bg-white/80 dark:bg-gray-800/40"
                  style={{
                    color: '#B8860B',
                    borderColor: '#B8860B',
                    borderWidth: '1px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#D4AF37';
                    e.currentTarget.style.borderColor = '#D4AF37';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = '#B8860B';
                    e.currentTarget.style.borderColor = '#B8860B';
                  }}
                >
                  <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Dashboard
                </Link>
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border"
                      style={{
                        background: 'linear-gradient(45deg, rgba(139,92,246,0.2), rgba(168,85,247,0.2))',
                        color: '#8b5cf6',
                        borderColor: '#a855f7'
                      }}>
                  ZI WEI DOU SHU CHART ANALYSIS
                </span>
              </div>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-4xl font-bold" style={{
                background: 'linear-gradient(45deg, #D4AF37, #FFD700, #DAA520)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
                Advanced Chart Analysis
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl">
              Interface with advanced timing controls and palace interaction mapping
              </p>
            </div>
          </div>



          {/* Control Panel */}
          <div className="mb-8">
            <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-6" style={{borderColor: '#DAA520'}}>
              <div className="space-y-6">
                {/* Timing Controls */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-1.5 rounded-full mr-3" style={{backgroundColor: '#DAA520'}}></div>
                    <h3 className="text-base font-semibold" style={{color: '#B8860B'}}>Timing Mode</h3>
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
                          style={{borderRadius: "1rem"}}
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
                          className={`group relative font-semibold uppercase tracking-wider overflow-hidden ${
                            active 
                              ? "text-white" 
                              : "px-8 py-4 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm font-semibold border-2"
                          }
                          style={!active ? {
                            color: '#B8860B',
                            borderColor: '#B8860B',
                            borderWidth: '2px'
                          } : {}}
                          onMouseEnter={!active ? (e) => {
                            e.currentTarget.style.borderColor = '#D4AF37';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
                          } : undefined}
                          onMouseLeave={!active ? (e) => {
                            e.currentTarget.style.borderColor = '#B8860B';
                            e.currentTarget.style.boxShadow = 'none';
                          } : undefined
                          }`}
                        >
                          {active ? (
                            <div className="button-gradient-border">
                              <div className="button-gradient-inner px-8 py-4">
                                <div className="text-sm font-bold uppercase tracking-wide">{opt.label}</div>
                                <div className="text-xs mt-0.5 text-gray-800">
                                  {opt.desc}
                                </div>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="text-sm font-bold uppercase tracking-wide">{opt.label}</div>
                              <div className={`text-xs mt-0.5 text-gray-500 dark:text-gray-400`}>
                                {opt.desc}
                              </div>
                            </>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Aspect Controls */}
                <div>
                  <div className="flex items-center mb-4">
                    <div className="w-1.5 h-1.5 rounded-full mr-3" style={{backgroundColor: '#DAA520'}}></div>
                    <h3 className="text-base font-semibold" style={{color: '#B8860B'}}>Aspect of Life</h3>
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
                          style={{borderRadius: "1rem"}}
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
                          className={`text-sm font-semibold uppercase tracking-wider overflow-hidden ${
                            active 
                              ? "text-white" 
                              : "px-5 py-3 rounded-xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm font-semibold border-2"
                          }
                          style={!active ? {
                            color: '#B8860B',
                            borderColor: '#B8860B',
                            borderWidth: '2px'
                          } : {}}
                          onMouseEnter={!active ? (e) => {
                            e.currentTarget.style.borderColor = '#D4AF37';
                            e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.4)';
                          } : undefined}
                          onMouseLeave={!active ? (e) => {
                            e.currentTarget.style.borderColor = '#B8860B';
                            e.currentTarget.style.boxShadow = 'none';
                          } : undefined
                          }`}
                        >
                          {active ? (
                            <div className="button-gradient-border">
                              <div className="button-gradient-inner px-5 py-3">
                                {name}
                              </div>
                            </div>
                          ) : (
                            name
                          )}
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
                <div className="gradient-border">
                  <div className="gradient-border-inner backdrop-blur-sm shadow-sm p-8 overflow-hidden bg-gray-900/60">
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
              </div>

              {/* Profile Information Card - Right Side */}
              <div className="lg:col-span-1">
                <div className="backdrop-blur-sm rounded-2xl shadow-lg border p-6 h-fit" style={{borderColor: '#DAA520'}}>
                  <div className="flex items-center mb-6">
                    <div className="w-2 h-2 rounded-full mr-3" style={{background: 'linear-gradient(45deg, #DAA520, #FFD700)'}}></div>
                    <h2 className="text-lg font-semibold" style={{color: '#B8860B'}}>Profile Details</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</p>
                      <p className="text-base font-semibold text-black dark:text-white" >{profile.name}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Date</p>
                      <p className="text-base font-semibold text-black dark:text-white" >
                        {new Date(profile.birthday).toLocaleDateString("en-US", { 
                          year: "numeric", 
                          month: "short", 
                          day: "numeric" 
                        })}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Birth Time</p>
                      <p className="text-base font-semibold text-black dark:text-white" >{String(profile.birth_time)}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Gender</p>
                      <p className="text-base font-semibold text-black dark:text-white" >
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
    </>
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


