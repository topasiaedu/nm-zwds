/**
 * Founder Timing Decision System Report — Founder Business Calendar
 *
 * 90-Day Strategic Roadmap
 * - 3 months, each with 10 varied-duration tasks
 * - Tasks span multiple days like Google Calendar
 * - Wealth code aligned action plans with modal details
 */

import React, { useMemo, useState } from "react";
import type { ChartData } from "../../utils/zwds/types";
import { getBusinessCalendarPlan } from "../../utils/zwds/analysis/businessCalendarPlans";
import { buildMonthlyWealthCodes } from "../../utils/zwds/analysis/businessCalendarUtils";
import { TaskDetailModal } from "./TaskDetailModal";
import { CalendarGrid, type CalendarTask } from "./CalendarGrid";

/**
 * Props for the BusinessCalendar component
 */
export interface BusinessCalendarProps {
  chartData: ChartData;
  reportCreatedAt: string;
}

/**
 * Founder Business Calendar section
 */
export const BusinessCalendar: React.FC<BusinessCalendarProps> = ({ chartData, reportCreatedAt }) => {
  const [activeMonthIndex, setActiveMonthIndex] = useState<number>(0); // 0, 1, or 2
  const [selectedTask, setSelectedTask] = useState<{
    monthLabel: string;
    wealthLabel: string;
    task: CalendarTask["task"];
  } | null>(null);

  // Compute monthly wealth codes anchored to the report creation date
  const { results, error } = useMemo(() => {
    return buildMonthlyWealthCodes(chartData, reportCreatedAt);
  }, [chartData, reportCreatedAt]);

  const currentMonthResult = results[activeMonthIndex];
  const plan = currentMonthResult ? getBusinessCalendarPlan(currentMonthResult.wealthCode) : null;
  const wealthLabel = plan?.monthTheme ?? plan?.label ?? "Unknown Wealth Code";

  // Build tasks for current month
  const tasksForMonth: CalendarTask[] = useMemo(() => {
    if (!plan) return [];
    return plan.tasks.map((task, idx) => ({
      id: `task-${activeMonthIndex}-${idx}`,
      task,
      startDay: task.startDay,
      duration: task.duration,
    }));
  }, [plan, activeMonthIndex]);

  return (
    <div className="p-6 dark:bg-gray-900">
      {/* Divider */}
      <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>

      {/* Section Header */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8"
        style={{
          background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
          padding: "32px 40px",
          boxShadow: "0 10px 40px rgba(251, 146, 60, 0.3)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
            fontSize: "48px",
            opacity: 0.2,
          }}
        >
          ✨
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "30px",
            left: "60px",
            fontSize: "24px",
            opacity: 0.15,
          }}
        >
          ⭐
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                color: "#ea580c",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              05
            </span>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              Founder Business Calendar
            </h2>
          </div>
          <p
            style={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "8px",
              opacity: 0.95,
            }}
          >
            What to prioritize in the next 90 days - no noise, only aligned moves
          </p>
        </div>
      </div>

      {/* Error State */}
      {error ? (
        <div className="rounded-2xl border border-amber-200 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-900/20 p-6 text-amber-900 dark:text-amber-100">
          <div className="text-lg font-bold mb-2">Calendar unavailable</div>
          <div className="text-sm">{error}</div>
        </div>
      ) : (
        <>
          {/* Month Tabs */}
          <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
            {results.map((result, index) => (
              <button
                key={result.month.sequence}
                type="button"
                onClick={() => setActiveMonthIndex(index)}
                style={{
                  padding: "12px 24px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  fontWeight: "700",
                  border: "none",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  whiteSpace: "nowrap",
                  background: activeMonthIndex === index
                    ? "linear-gradient(135deg, #f97316 0%, #ea580c 100%)"
                    : "#ffffff",
                  color: activeMonthIndex === index ? "#ffffff" : "#6b7280",
                  boxShadow: activeMonthIndex === index
                    ? "0 4px 12px rgba(249, 115, 22, 0.4)"
                    : "0 2px 6px rgba(0, 0, 0, 0.08)",
                }}
              >
                {`${result.month.label} (${getBusinessCalendarPlan(result.wealthCode)?.monthTheme ?? getBusinessCalendarPlan(result.wealthCode)?.label ?? "Unknown"})`}
              </button>
            ))}
          </div>

          {/* Current Month Calendar */}
          {currentMonthResult && (
            <section
              key={`${currentMonthResult.month.sequence}-${currentMonthResult.month.label}`}
              className="rounded-3xl border border-orange-100 dark:border-orange-700/40 bg-white/80 dark:bg-gray-900/40 p-6 shadow-md"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-xs uppercase tracking-wide text-orange-500 font-bold">
                    {`Month ${currentMonthResult.month.sequence}`}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{currentMonthResult.month.label}</div>
                </div>
                <div className="text-sm font-semibold text-orange-600 dark:text-orange-300">
                  {wealthLabel}
                </div>
              </div>

              {/* Empty State */}
              {!plan ? (
                <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 p-5 text-gray-600 dark:text-gray-300">
                  <div className="text-sm font-semibold mb-1">Wealth code unavailable</div>
                  <div className="text-sm">
                    {currentMonthResult.reason ?? "We could not determine the dominant wealth code for this month."}
                  </div>
                </div>
              ) : (
                <CalendarGrid
                  monthLabel={currentMonthResult.month.label}
                  tasks={tasksForMonth}
                  onTaskClick={(task) =>
                    setSelectedTask({
                      monthLabel: `${currentMonthResult.month.label} · ${wealthLabel}`,
                      wealthLabel,
                      task,
                    })
                  }
                />
              )}
            </section>
          )}
        </>
      )}

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={selectedTask !== null}
        monthLabel={selectedTask?.monthLabel ?? ""}
        wealthLabel={selectedTask?.wealthLabel ?? ""}
        task={selectedTask?.task ?? null}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  );
};

export default BusinessCalendar;
