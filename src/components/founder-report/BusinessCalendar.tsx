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
import { WEALTH_CODE_LABELS } from "../../utils/zwds/analysis_constants/wealth_code_mapping";

export interface BusinessCalendarProps {
  chartData: ChartData;
}

type ActionStep = "launch" | "invest" | "hire" | "pivot" | "change";

type CalendarTask = {
  id: string;
  step: ActionStep;
  title: string;
  /** Absolute day in 90-day calendar (0-89) */
  startDay: number;
  /** How many days it spans */
  duration: number;
};

/**
 * Get step styling.
 */
function getStepColor(step: ActionStep): string {
  switch (step) {
    case "launch":
      return "bg-emerald-500 border-emerald-600 text-white";
    case "invest":
      return "bg-amber-500 border-amber-600 text-white";
    case "hire":
      return "bg-blue-500 border-blue-600 text-white";
    case "pivot":
      return "bg-purple-500 border-purple-600 text-white";
    case "change":
      return "bg-gray-500 border-gray-600 text-white";
  }
}

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

/**
 * Get season guidance.
 */
function getSeasonGuidance(season: DayunSeason | null): { title: string; copy: string } {
  if (season === "spring")
    return {
      title: "Spring: Launch & Plant Seeds",
      copy: "Perfect timing for LAUNCH phase. Execute aggressively on new initiatives.",
    };
  if (season === "summer")
    return {
      title: "Summer: Scale & Invest",
      copy: "Ideal for INVEST & HIRE phases. Double down on what's working.",
    };
  if (season === "autumn")
    return {
      title: "Autumn: Harvest & Refine",
      copy: "Focus on PIVOT & optimization. Review data and refine your model.",
    };
  if (season === "winter")
    return {
      title: "Winter: Reset & Recalibrate",
      copy: "Best time for CHANGE phase. Internal resets and strategic pivots.",
    };
  return { title: "Your Timing", copy: "Follow your natural rhythm through all 5 phases." };
}

export const BusinessCalendar: React.FC<BusinessCalendarProps> = ({ chartData }) => {
  const [selectedMonth, setSelectedMonth] = useState<number>(1); // 1, 2, or 3

  const dayun = useMemo(() => calculateCurrentDayunCycle(chartData), [chartData]);
  const currentSeason = dayun?.season ?? null;

  const wealthProfile = useMemo(() => {
    try {
      return analyzeWealthCode(chartData);
    } catch (error) {
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
  const dominantCodeLabel = dominantCode ? WEALTH_CODE_LABELS[dominantCode] : "Unknown";

  const seasonGuidance = useMemo(() => getSeasonGuidance(currentSeason), [currentSeason]);

  // Score and sort tasks
  const sortedTasks = useMemo(() => {
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

      {/* Section Header */}
      <div className="text-center mb-8">
        <h2 className="text-4xl dark:text-white font-bold mb-2">{"FOUNDER BUSINESS CALENDAR"}</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          {"90-Day Strategic Roadmap · Launch → Invest → Hire → Pivot → Change"}
        </p>
      </div>


      {/* Month selector tabs */}
      <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
        {[1, 2, 3].map((month) => (
          <button
            key={month}
            type="button"
            onClick={() => setSelectedMonth(month)}
            className={[
              "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
              selectedMonth === month
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
            ].join(" ")}
          >
            {monthLabels[month - 1]}
          </button>
        ))}
      </div>

      {/* Calendar Grid - 4 weeks */}
      <div className="space-y-6">
        {weeks.map(({ weekNum, days }) => (
          <div key={weekNum} className="rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-white dark:bg-gray-800">
            {/* Week header */}
            <div className="bg-gray-50 dark:bg-gray-900/50 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{`Week ${weekNum}`}</span>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
              {dayLabels.map((day) => (
                <div
                  key={day}
                  className="px-2 py-2 text-center text-xs font-bold text-gray-600 dark:text-gray-400 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Days with tasks - stacked within cells */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
              {days.map((absoluteDay, dayIndex) => {
                // Find tasks that START on this day
                const tasksStartingToday = monthTasks.filter((task) => task.startDay === absoluteDay);

                return (
                  <div
                    key={absoluteDay}
                    style={{
                      borderRight: dayIndex < 6 ? "1px solid #e5e7eb" : "none",
                      borderBottom: "1px solid #e5e7eb",
                      padding: "6px",
                      minHeight: "150px",
                      backgroundColor: "#f9fafb",
                      display: "flex",
                      flexDirection: "column",
                      gap: "4px",
                    }}
                  >
                    {/* Day number */}
                    <div style={{ fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "4px" }}>
                      {absoluteDay + 1}
                    </div>
                    
                    {/* Tasks starting on this day */}
                    {tasksStartingToday.map((task) => {
                      const info = getStepInfo(task.step);
                      const spanDays = Math.min(task.duration, 7 - dayIndex);
                      
                      // Get gradient background based on step
                      let bgGradient = "linear-gradient(135deg, #10b981 0%, #059669 100%)"; // launch - emerald
                      if (task.step === "invest") bgGradient = "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)"; // amber
                      if (task.step === "hire") bgGradient = "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"; // blue
                      if (task.step === "pivot") bgGradient = "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)"; // purple
                      if (task.step === "change") bgGradient = "linear-gradient(135deg, #6b7280 0%, #4b5563 100%)"; // gray

                      return (
                        <div
                          key={task.id}
                          style={{
                            background: bgGradient,
                            color: "#ffffff",
                            borderRadius: "4px",
                            padding: "4px 6px",
                            fontSize: "10px",
                            fontWeight: "600",
                            cursor: "pointer",
                            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                            position: "relative",
                            width: spanDays > 1 ? `calc(${spanDays * 100}% + ${(spanDays - 1) * 100}%)` : "100%",
                          }}
                          title={task.title}
                        >
                          <div style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
                            <span style={{ fontSize: "11px" }}>{info.icon}</span>
                            <span style={{ fontSize: "8px", textTransform: "uppercase", letterSpacing: "0.3px" }}>
                              {info.label}
                            </span>
                          </div>
                          <div style={{ 
                            fontSize: "10px", 
                            fontWeight: "600", 
                            lineHeight: "1.2",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}>
                            {task.title}
                          </div>
                          <div style={{ fontSize: "8px", opacity: 0.9, marginTop: "2px" }}>
                            {task.duration}d
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BusinessCalendar;
