/**
 * Founder Timing Decision System Report — Founder Business Calendar
 *
 * 90-Day Strategic Roadmap
 * - 3 months, each with 4 weeks (Sun-Sat)
 * - Tasks span multiple days like Google Calendar
 * - Progress through 5 sequential steps: Launch → Invest → Hire → Pivot → Change
 * - Aligned with Dayun season timing
 */

import React, { useMemo, useState } from "react";
import type { ChartData } from "../../utils/zwds/types";
import { calculateCurrentDayunCycle } from "../../utils/dayun/calculator";
import type { DayunSeason } from "../../types/dayun";
import { analyzeWealthCode } from "../../utils/zwds/analysis/wealthCodeAnalysis";
import type { WealthCodeKey } from "../../utils/zwds/analysis_constants/wealth_code_mapping";

export interface BusinessCalendarProps {
  chartData: ChartData;
}

type ActionStep = "launch" | "invest" | "hire" | "pivot" | "change";

/**
 * Get step icon and label.
 */
function getStepInfo(step: ActionStep): { icon: string; label: string } {
  switch (step) {
    case "launch":
      return { icon: "🚀", label: "Launch" };
    case "invest":
      return { icon: "💸", label: "Invest" };
    case "hire":
      return { icon: "🧑‍💼", label: "Hire" };
    case "pivot":
      return { icon: "🔁", label: "Pivot" };
    case "change":
      return { icon: "🔄", label: "Change" };
  }
}

type ScoredTask = (typeof TASK_TEMPLATES)[number] & {
  id: string;
  score: number;
};

type TaskAccentColors = {
  accentColor: string;
  lightAccent: string;
  shadowColor: string;
};

/**
 * Derive accent colors for a task step.
 */
function getTaskAccentColors(step: ActionStep): TaskAccentColors {
  if (step === "invest") {
    return {
      accentColor: "#f59e0b",
      lightAccent: "rgba(245, 158, 11, 0.1)",
      shadowColor: "rgba(245, 158, 11, 0.3)",
    };
  }
  if (step === "hire") {
    return {
      accentColor: "#3b82f6",
      lightAccent: "rgba(59, 130, 246, 0.1)",
      shadowColor: "rgba(59, 130, 246, 0.3)",
    };
  }
  if (step === "pivot") {
    return {
      accentColor: "#a855f7",
      lightAccent: "rgba(168, 85, 247, 0.1)",
      shadowColor: "rgba(168, 85, 247, 0.3)",
    };
  }
  if (step === "change") {
    return {
      accentColor: "#6b7280",
      lightAccent: "rgba(107, 114, 128, 0.1)",
      shadowColor: "rgba(107, 114, 128, 0.3)",
    };
  }
  return {
    accentColor: "#10b981",
    lightAccent: "rgba(16, 185, 129, 0.1)",
    shadowColor: "rgba(16, 185, 129, 0.3)",
  };
}

/**
 * Build task lanes for a week, keeping overlapping tasks separated.
 */
function buildTaskLanes(
  days: ReadonlyArray<number>,
  monthTasks: ReadonlyArray<ScoredTask>
): { lanes: number[]; containerHeight: number } {
  const taskLanes: number[] = [];

  monthTasks.forEach((task, taskIndex) => {
    const startIdx = days.indexOf(task.startDay);
    if (startIdx === -1) {
      taskLanes.push(-1);
      return;
    }

    const endIdx = Math.min(startIdx + task.duration - 1, 6);
    const occupiedLanes = new Set<number>();

    monthTasks.forEach((otherTask, otherIdx) => {
      if (otherIdx >= taskIndex) return;
      const otherStartIdx = days.indexOf(otherTask.startDay);
      if (otherStartIdx === -1) return;
      const otherEndIdx = Math.min(otherStartIdx + otherTask.duration - 1, 6);
      if (!(endIdx < otherStartIdx || startIdx > otherEndIdx)) {
        occupiedLanes.add(taskLanes[otherIdx]);
      }
    });

    let lane = 0;
    while (occupiedLanes.has(lane)) {
      lane++;
    }
    taskLanes.push(lane);
  });

  const maxLane = taskLanes.length > 0 ? Math.max(...taskLanes.filter((lane) => lane >= 0)) : 0;
  const containerHeight = 80 + (maxLane + 1) * 48;

  return { lanes: taskLanes, containerHeight };
}

interface WeekRowProps {
  weekNum: number;
  days: number[];
  dayLabels: string[];
  monthTasks: ScoredTask[];
}

/**
 * Render a single week row in the calendar grid.
 */
const WeekRow: React.FC<WeekRowProps> = ({ weekNum, days, dayLabels, monthTasks }) => {
  const { lanes, containerHeight } = useMemo(() => {
    return buildTaskLanes(days, monthTasks);
  }, [days, monthTasks]);

  return (
    <div
      key={weekNum}
      style={{
        borderRadius: "16px",
        border: "2px solid #fed7aa",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(251, 146, 60, 0.1)",
      }}
    >
      {/* Week header - Colorful */}
      <div
        style={{
          background: "linear-gradient(90deg, #fed7aa 0%, #fef3c7 100%)",
          padding: "12px 16px",
          borderBottom: "2px solid #fed7aa",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "800", color: "#ea580c" }}>
          {`Week ${weekNum}`}
        </span>
      </div>

      {/* Day headers - Vibrant */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          background: "linear-gradient(to right, #fb923c, #f97316)",
        }}
      >
        {dayLabels.map((day, idx) => (
          <div
            key={day}
            style={{
              borderRight: idx < 6 ? "1px solid rgba(255,255,255,0.2)" : "none",
              padding: "10px 8px",
              textAlign: "center",
              fontSize: "11px",
              fontWeight: "800",
              color: "#ffffff",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid container - wrapper for both grid and absolute tasks */}
      <div style={{ position: "relative", minHeight: `${containerHeight}px` }}>
        {/* Day cells grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(7, 1fr)",
            minHeight: `${containerHeight}px`,
          }}
        >
          {days.map((absoluteDay, dayIndex) => (
            <div
              key={absoluteDay}
              style={{
                borderRight: dayIndex < 6 ? "1px solid rgba(254, 215, 170, 0.5)" : "none",
                borderBottom: "1px solid rgba(254, 215, 170, 0.5)",
                padding: "8px",
                background:
                  "linear-gradient(180deg, rgba(255, 251, 235, 0.6) 0%, rgba(255, 255, 255, 0.4) 100%)",
                backdropFilter: "blur(5px)",
                WebkitBackdropFilter: "blur(5px)",
                position: "relative",
              }}
            >
              {/* Day number with subtle glassmorphism badge */}
              <div
                style={{
                  fontSize: "13px",
                  fontWeight: "800",
                  color: "#ea580c",
                  marginBottom: "4px",
                  background: "rgba(255, 255, 255, 0.5)",
                  backdropFilter: "blur(4px)",
                  WebkitBackdropFilter: "blur(4px)",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  display: "inline-block",
                  width: "fit-content",
                  border: "1px solid rgba(234, 88, 12, 0.2)",
                  boxShadow: "0 2px 4px rgba(234, 88, 12, 0.1)",
                }}
              >
                {absoluteDay + 1}
              </div>
            </div>
          ))}
        </div>

        {/* Tasks rendered separately to span across columns */}
        {monthTasks.map((task, taskIndex) => {
          const startDayIndex = days.indexOf(task.startDay);
          if (startDayIndex === -1) return null;

          const info = getStepInfo(task.step);
          const spanDays = Math.min(task.duration, 7 - startDayIndex);
          const lane = lanes[taskIndex];
          const { accentColor, lightAccent, shadowColor } = getTaskAccentColors(task.step);

          const leftPercent = (startDayIndex / 7) * 100;
          const widthPercent = (spanDays / 7) * 100;
          const topPx = 35 + lane * 50;

          return (
            <div
              key={task.id}
              style={{
                position: "absolute",
                left: `${leftPercent}%`,
                width: `calc(${widthPercent}% - 16px)`,
                top: `${topPx}px`,
                marginLeft: "8px",
                marginRight: "8px",
                zIndex: 10 + lane,
                background: "linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                borderLeft: `3px solid ${accentColor}`,
                color: "#1f2937",
                borderRadius: "8px",
                padding: "8px 10px",
                fontSize: "10px",
                fontWeight: "600",
                boxShadow: `0 4px 12px ${shadowColor}, 0 2px 4px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.8)`,
                overflow: "hidden",
                transition: "all 0.3s ease",
              }}
              title={task.title}
            >
              {/* Glassmorphism shine effect - covers full background */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `linear-gradient(135deg, ${lightAccent} 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)`,
                  borderRadius: "8px",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              />

              {/* Top shine */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: "40%",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 100%)",
                  borderRadius: "8px 8px 0 0",
                  pointerEvents: "none",
                  zIndex: 2,
                }}
              />

              {/* Content wrapper with highest z-index */}
              <div style={{ position: "relative", zIndex: 3 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "3px" }}>
                  {/* Icon with colored background */}
                  <span
                    style={{
                      fontSize: "10px",
                      background: accentColor,
                      color: "#ffffff",
                      width: "16px",
                      height: "16px",
                      borderRadius: "4px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: `0 2px 4px ${shadowColor}`,
                    }}
                  >
                    {info.icon}
                  </span>
                  <span
                    style={{
                      fontSize: "8px",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                      fontWeight: "700",
                      color: accentColor,
                    }}
                  >
                    {info.label}
                  </span>
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: "600",
                    lineHeight: "1.3",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    color: "#374151",
                  }}
                >
                  {task.title}
                </div>
              </div>
              <div style={{ fontSize: "8px", opacity: 0.7, marginTop: "2px", color: "#6b7280" }}>
                {task.duration}d
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Task templates for 90-day roadmap.
 * Tasks are distributed chronologically through 5 sequential steps.
 */
const TASK_TEMPLATES: ReadonlyArray<{
  step: ActionStep;
  title: string;
  startDay: number; // Day 0-89
  duration: number;
  bestSeasons: ReadonlyArray<DayunSeason>;
  alignedCodes: ReadonlyArray<WealthCodeKey>;
}> = [
  // WEEK 1-2: LAUNCH PHASE (Days 0-13)
  { step: "launch", title: "Product Ideation & Research", startDay: 1, duration: 3, bestSeasons: ["spring", "summer"], alignedCodes: ["strategyPlanner", "brandingMagnet"] },
  { step: "launch", title: "Finalize Offer Positioning", startDay: 4, duration: 3, bestSeasons: ["spring", "summer"], alignedCodes: ["strategyPlanner", "brandingMagnet"] },
  { step: "launch", title: "Create Landing Page", startDay: 8, duration: 2, bestSeasons: ["spring", "summer"], alignedCodes: ["brandingMagnet", "strategyPlanner"] },
  { step: "launch", title: "Write Launch Copy & Assets", startDay: 10, duration: 4, bestSeasons: ["spring", "summer"], alignedCodes: ["brandingMagnet", "strategyPlanner"] },
  
  // WEEK 3-4: LAUNCH + EARLY INVEST (Days 14-27)
  { step: "launch", title: "Pre-Launch Email Sequence", startDay: 14, duration: 5, bestSeasons: ["spring", "summer"], alignedCodes: ["brandingMagnet", "collaborator"] },
  { step: "launch", title: "Launch Webinar or Challenge", startDay: 19, duration: 3, bestSeasons: ["spring", "summer"], alignedCodes: ["brandingMagnet", "strategyPlanner"] },
  { step: "invest", title: "Allocate Ad Budget", startDay: 22, duration: 2, bestSeasons: ["summer", "autumn"], alignedCodes: ["investmentBrain", "strategyPlanner"] },
  { step: "launch", title: "Execute Go-Live Campaign", startDay: 24, duration: 4, bestSeasons: ["spring", "summer"], alignedCodes: ["brandingMagnet", "strategyPlanner"] },
  
  // WEEK 5-6: INVEST PHASE (Days 28-41)
  { step: "invest", title: "Analyze Launch Performance", startDay: 28, duration: 2, bestSeasons: ["summer", "autumn"], alignedCodes: ["investmentBrain", "strategyPlanner"] },
  { step: "invest", title: "Scale Winning Channels", startDay: 30, duration: 5, bestSeasons: ["summer", "autumn"], alignedCodes: ["investmentBrain", "strategyPlanner"] },
  { step: "hire", title: "Map Org Chart & Identify Gaps", startDay: 35, duration: 2, bestSeasons: ["summer", "autumn"], alignedCodes: ["strategyPlanner", "collaborator"] },
  { step: "invest", title: "Upgrade Tech Stack (CRM/Automation)", startDay: 37, duration: 5, bestSeasons: ["summer", "autumn"], alignedCodes: ["investmentBrain", "strategyPlanner"] },
  
  // WEEK 7-8: HIRE PHASE (Days 42-55)
  { step: "hire", title: "Define Role Requirements", startDay: 42, duration: 2, bestSeasons: ["summer", "autumn"], alignedCodes: ["strategyPlanner", "collaborator"] },
  { step: "hire", title: "Source & Screen Candidates", startDay: 44, duration: 7, bestSeasons: ["summer", "autumn"], alignedCodes: ["collaborator", "brandingMagnet"] },
  { step: "invest", title: "Join Mastermind or Hire Coach", startDay: 51, duration: 1, bestSeasons: ["summer", "autumn"], alignedCodes: ["investmentBrain", "collaborator"] },
  { step: "hire", title: "Conduct Interviews", startDay: 52, duration: 4, bestSeasons: ["summer", "autumn"], alignedCodes: ["collaborator", "strategyPlanner"] },
  
  // WEEK 9-10: PIVOT PHASE (Days 56-69)
  { step: "hire", title: "Onboard New Team Member", startDay: 56, duration: 5, bestSeasons: ["summer", "autumn"], alignedCodes: ["collaborator", "strategyPlanner"] },
  { step: "pivot", title: "Review Sales Data & Feedback", startDay: 61, duration: 3, bestSeasons: ["autumn", "winter"], alignedCodes: ["strategyPlanner", "investmentBrain"] },
  { step: "pivot", title: "Identify What to Kill/Keep/Repackage", startDay: 64, duration: 2, bestSeasons: ["winter", "spring"], alignedCodes: ["strategyPlanner", "investmentBrain"] },
  { step: "pivot", title: "Redesign Offer Stack", startDay: 66, duration: 4, bestSeasons: ["winter", "spring"], alignedCodes: ["strategyPlanner", "brandingMagnet"] },
  
  // WEEK 11-12: CHANGE PHASE (Days 70-83)
  { step: "pivot", title: "Test New Pricing Model", startDay: 70, duration: 5, bestSeasons: ["spring"], alignedCodes: ["investmentBrain", "strategyPlanner"] },
  { step: "change", title: "Founder Clarity Retreat Day", startDay: 75, duration: 1, bestSeasons: ["winter"], alignedCodes: ["strategyPlanner", "brandingMagnet"] },
  { step: "change", title: "Audit Energy Drains & Time Blocks", startDay: 76, duration: 3, bestSeasons: ["winter", "autumn"], alignedCodes: ["strategyPlanner", "collaborator"] },
  { step: "change", title: "Cut Low-ROI Commitments", startDay: 79, duration: 2, bestSeasons: ["winter", "autumn"], alignedCodes: ["strategyPlanner", "investmentBrain"] },
  { step: "change", title: "Design Ideal Week Template", startDay: 81, duration: 3, bestSeasons: ["winter"], alignedCodes: ["strategyPlanner", "collaborator"] },
  
  // WEEK 13: FINAL OPTIMIZATION (Days 84-89)
  { step: "change", title: "Build SOPs & Automation Systems", startDay: 84, duration: 4, bestSeasons: ["winter", "autumn"], alignedCodes: ["strategyPlanner", "investmentBrain"] },
  { step: "change", title: "Q1 Reflection & Q2 Planning", startDay: 88, duration: 2, bestSeasons: ["winter"], alignedCodes: ["strategyPlanner", "brandingMagnet"] },
];

/**
 * Score tasks based on season and wealth code alignment.
 */
function scoreTask(
  task: (typeof TASK_TEMPLATES)[number],
  season: DayunSeason | null,
  code: WealthCodeKey | null
): number {
  let score = 0;
  if (season && task.bestSeasons.includes(season)) score += 5;
  if (code && task.alignedCodes.includes(code)) score += 3;
  return score;
}

export const BusinessCalendar: React.FC<BusinessCalendarProps> = ({ chartData }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1, 2, or 3

  const dayun = useMemo(() => calculateCurrentDayunCycle(chartData), [chartData]);
  const currentSeason = dayun?.season ?? null;

  const wealthProfile = useMemo(() => {
    try {
      return analyzeWealthCode(chartData);
    } catch (error) {
      console.error("BusinessCalendar - Wealth code analysis failed:", error);
      return {
        clientName: "",
        dominantArchetype: "",
        summaryText: "",
        codes: [],
        stars: [],
        strengths: [],
        blindSpots: [],
        idealRoles: [],
        nonIdealRoles: [],
        profileType: "balanced" as const,
        hasRecognizedStars: false,
      };
    }
  }, [chartData]);

  const hasWealthCode = wealthProfile.hasRecognizedStars && wealthProfile.codes.length > 0;
  const dominantCode: WealthCodeKey | null = hasWealthCode ? wealthProfile.codes[0].key : null;

  // Score and sort tasks
  const sortedTasks = useMemo<ScoredTask[]>(() => {
    return TASK_TEMPLATES.map((template) => ({
      ...template,
      id: `${template.step}-${template.startDay}`,
      score: scoreTask(template, currentSeason, dominantCode),
    })).sort((a, b) => a.startDay - b.startDay);
  }, [currentSeason, dominantCode]);

  // Get tasks for selected month (each month = 30 days)
  const monthTasks = useMemo(() => {
    const monthStartDay = (selectedMonth - 1) * 30;
    const monthEndDay = monthStartDay + 30;
    return sortedTasks.filter((task) => {
      const taskEndDay = task.startDay + task.duration;
      return (task.startDay >= monthStartDay && task.startDay < monthEndDay) || 
             (taskEndDay > monthStartDay && task.startDay < monthStartDay);
    });
  }, [sortedTasks, selectedMonth]);

  // Build 4 weeks for current month
  const weeks = useMemo(() => {
    const monthStartDay = (selectedMonth - 1) * 30;
    const result: Array<{ weekNum: number; days: number[] }> = [];
    
    for (let week = 0; week < 4; week++) {
      const weekStartDay = monthStartDay + (week * 7);
      const days = Array.from({ length: 7 }, (_, i) => weekStartDay + i);
      result.push({ weekNum: week + 1, days });
    }
    
    return result;
  }, [selectedMonth]);

  const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthLabels = ["Month 1: Foundation", "Month 2: Growth", "Month 3: Scale & Optimize"];

  return (
    <div className="p-6 dark:bg-gray-900">
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      {/* Section Header with Gradient Background */}
      <div className="relative rounded-3xl overflow-hidden mb-8" style={{
        background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
        padding: "32px 40px",
        boxShadow: "0 10px 40px rgba(251, 146, 60, 0.3)",
      }}>
        {/* Decorative elements */}
        <div style={{
          position: "absolute",
          top: "20px",
          right: "40px",
          fontSize: "48px",
          opacity: 0.2,
        }}>✨</div>
        <div style={{
          position: "absolute",
          bottom: "30px",
          left: "60px",
          fontSize: "24px",
          opacity: 0.15,
        }}>⭐</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span style={{
              background: "rgba(255, 255, 255, 0.9)",
              color: "#ea580c",
              padding: "4px 12px",
              borderRadius: "8px",
              fontSize: "18px",
              fontWeight: "800",
            }}>05</span>
            <h2 style={{ 
              fontSize: "32px", 
              fontWeight: "800", 
              color: "#ffffff",
              textShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}>
              {"Founder Business Calendar"}
            </h2>
          </div>
          <p style={{ 
            color: "#fff",
            fontSize: "15px",
            fontWeight: "500",
            marginTop: "8px",
            opacity: 0.95,
          }}>
            {"What to prioritize in the next 90 days — no noise, only aligned moves"}
          </p>
        </div>
      </div>


      {/* Month selector tabs - Colorful style */}
      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        {[1, 2, 3].map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setSelectedMonth(month)}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "14px",
              fontWeight: "700",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              whiteSpace: "nowrap",
              background: selectedMonth === month 
                ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                : "#ffffff",
              color: selectedMonth === month ? "#ffffff" : "#6b7280",
              boxShadow: selectedMonth === month 
                ? "0 4px 12px rgba(249, 115, 22, 0.4)"
                : "0 2px 6px rgba(0, 0, 0, 0.08)",
            }}
          >
            {monthLabels[month - 1]}
          </button>
        ))}
      </div>

      {/* Calendar Grid - 4 weeks with colorful styling */}
      <div className="space-y-6">
        {weeks.map(({ weekNum, days }) => (
          <WeekRow
            key={weekNum}
            weekNum={weekNum}
            days={days}
            dayLabels={dayLabels}
            monthTasks={monthTasks}
          />
        ))}
      </div>
    </div>
  );
};

export default BusinessCalendar;
