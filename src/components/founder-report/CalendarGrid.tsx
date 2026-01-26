/**
 * Calendar Grid Component
 * 
 * Displays tasks in a Google Calendar-like grid layout
 * with tasks spanning multiple days.
 */

import React from "react";
import type { BusinessCalendarTask } from "../../utils/zwds/analysis/businessCalendarPlans";

/**
 * Task with unique ID for rendering
 */
export type CalendarTask = {
  id: string;
  task: BusinessCalendarTask;
  startDay: number;
  duration: number;
};

/**
 * Props for the CalendarGrid component
 */
export interface CalendarGridProps {
  /** Month label (e.g., "February 2026") */
  monthLabel: string;
  /** Tasks to display */
  tasks: CalendarTask[];
  /** Callback when a task is clicked */
  onTaskClick: (task: BusinessCalendarTask) => void;
}

/**
 * Day labels for calendar header
 */
const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

/**
 * Fixed days in month for simplicity
 */
const DAYS_IN_MONTH = 30;

/**
 * Get accent color based on task impact
 */
function getAccentColor(impact: "high" | "medium" | "quick-win"): string {
  switch (impact) {
    case "high":
      return "#f97316"; // Orange
    case "quick-win":
      return "#22c55e"; // Green
    case "medium":
      return "#3b82f6"; // Blue
  }
}

/**
 * Get light accent color for backgrounds
 */
function getLightAccent(impact: "high" | "medium" | "quick-win"): string {
  switch (impact) {
    case "high":
      return "rgba(251, 146, 60, 0.1)";
    case "quick-win":
      return "rgba(34, 197, 94, 0.1)";
    case "medium":
      return "rgba(59, 130, 246, 0.1)";
  }
}

/**
 * Get shadow color for task cards
 */
function getShadowColor(impact: "high" | "medium" | "quick-win"): string {
  switch (impact) {
    case "high":
      return "rgba(249, 115, 22, 0.3)";
    case "quick-win":
      return "rgba(34, 197, 94, 0.3)";
    case "medium":
      return "rgba(59, 130, 246, 0.3)";
  }
}

/**
 * Build task lanes to prevent overlapping
 */
function buildTaskLanes(
  weekDays: ReadonlyArray<number | null>,
  weekTasks: ReadonlyArray<CalendarTask>
): { lanes: number[]; containerHeight: number } {
  const taskLanes: number[] = [];
  const currentWeekStartDay = weekDays[0] ?? 0;

  weekTasks.forEach((task, taskIndex) => {
    const startDayInWeek = task.startDay - currentWeekStartDay;
    const endDayInWeek = Math.min(startDayInWeek + task.duration - 1, 6);

    const occupiedLanes = new Set<number>();
    weekTasks.forEach((otherTask, otherIdx) => {
      if (otherIdx >= taskIndex) return;
      const otherStartDayInWeek = otherTask.startDay - currentWeekStartDay;
      const otherEndDayInWeek = Math.min(otherStartDayInWeek + otherTask.duration - 1, 6);

      if (!(endDayInWeek < otherStartDayInWeek || startDayInWeek > otherEndDayInWeek)) {
        occupiedLanes.add(taskLanes[otherIdx]);
      }
    });

    let lane = 0;
    while (occupiedLanes.has(lane)) {
      lane++;
    }
    taskLanes.push(lane);
  });

  const maxLane = taskLanes.length > 0 ? Math.max(...taskLanes.filter((lane) => lane >= 0)) : -1;
  const containerHeight = 80 + (maxLane + 1) * 50; // Base height + 50px per lane

  return { lanes: taskLanes, containerHeight };
}

/**
 * CalendarGrid component
 */
export const CalendarGrid: React.FC<CalendarGridProps> = ({ monthLabel, tasks, onTaskClick }) => {
  const weeksInMonth = Math.ceil(DAYS_IN_MONTH / 7);

  // Build grid of days (weeks x 7 days)
  const gridDays: Array<Array<number | null>> = [];
  let currentDay = 0;
  for (let i = 0; i < weeksInMonth; i++) {
    const weekDays: Array<number | null> = [];
    for (let j = 0; j < 7; j++) {
      if (currentDay < DAYS_IN_MONTH) {
        weekDays.push(currentDay);
        currentDay++;
      } else {
        weekDays.push(null);
      }
    }
    gridDays.push(weekDays);
  }

  return (
    <div
      style={{
        borderRadius: "16px",
        border: "2px solid #fed7aa",
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 4px 12px rgba(251, 146, 60, 0.1)",
      }}
    >
      {/* Calendar Header */}
      <div
        style={{
          background: "linear-gradient(90deg, #fed7aa 0%, #fef3c7 100%)",
          padding: "12px 16px",
          borderBottom: "2px solid #fed7aa",
        }}
      >
        <span style={{ fontSize: "14px", fontWeight: "800", color: "#ea580c" }}>
          {monthLabel}
        </span>
      </div>

      {/* Day Labels */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          background: "linear-gradient(to right, #fb923c, #f97316)",
        }}
      >
        {DAY_LABELS.map((day, idx) => (
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

      {/* Week Rows */}
      {gridDays.map((weekDays, weekIndex) => {
        const weekStartDay = weekDays[0] ?? 0;
        const weekTasks = tasks.filter(
          (task) =>
            (task.startDay >= weekStartDay && task.startDay < weekStartDay + 7) ||
            (task.startDay + task.duration > weekStartDay && task.startDay < weekStartDay)
        );

        const { lanes, containerHeight } = buildTaskLanes(weekDays, weekTasks);

        return (
          <div key={weekIndex} style={{ position: "relative", minHeight: `${containerHeight}px` }}>
            {/* Day Cells */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                minHeight: `${containerHeight}px`,
              }}
            >
              {weekDays.map((absoluteDay, dayIndex) => (
                <div
                  key={dayIndex}
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
                  {absoluteDay !== null && (
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
                  )}
                </div>
              ))}
            </div>

            {/* Task Cards */}
            {weekTasks.map((task, taskIndex) => {
              const startDayIndex = task.startDay - weekStartDay;
              
              // Calculate the actual start position in this week
              // If task started in previous week, it starts at column 0 of this week
              const visualStartIndex = Math.max(0, startDayIndex);
              
              // Calculate how many days are left in the task when it enters this week
              const daysLeftInTask = task.duration - Math.max(0, weekStartDay - task.startDay);
              
              // Calculate how many days to span in this week (min of days left and days remaining in week)
              const spanDays = Math.min(daysLeftInTask, 7 - visualStartIndex);
              
              // Skip if no days to render in this week
              if (spanDays <= 0) return null;

              const lane = lanes[taskIndex];

              const leftPercent = (visualStartIndex / 7) * 100;
              const widthPercent = (spanDays / 7) * 100;
              const topPx = 35 + lane * 50;

              const accentColor = getAccentColor(task.task.impact);
              const lightAccent = getLightAccent(task.task.impact);
              const shadowColor = getShadowColor(task.task.impact);

              return (
                <button
                  key={task.id}
                  type="button"
                  onClick={() => onTaskClick(task.task)}
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
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  title={task.task.title}
                >
                  {/* Background Gradient */}
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

                  {/* Top Shine */}
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

                  {/* Task Content */}
                  <div style={{ position: "relative", zIndex: 3 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px", marginBottom: "3px" }}>
                      <span
                        style={{
                          fontSize: "8px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          fontWeight: "700",
                          color: accentColor,
                        }}
                      >
                        {`Task ${task.task.taskNum}`}
                      </span>
                      {/* Impact Badge */}
                      <span
                        style={{
                          fontSize: "7px",
                          fontWeight: "800",
                          padding: "2px 5px",
                          borderRadius: "4px",
                          backgroundColor:
                            task.task.impact === "high"
                              ? "#ef4444"
                              : task.task.impact === "quick-win"
                              ? "#22c55e"
                              : "#3b82f6",
                          color: "#ffffff",
                          textTransform: "uppercase",
                          letterSpacing: "0.3px",
                          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                        }}
                      >
                        {task.task.impact === "high" ? "🔥" : task.task.impact === "quick-win" ? "⚡" : "📊"}
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
                      {task.task.title}
                    </div>
                  </div>
                  <div style={{ fontSize: "8px", opacity: 0.7, marginTop: "2px", color: "#6b7280" }}>
                    {task.duration}d
                  </div>
                </button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default CalendarGrid;
