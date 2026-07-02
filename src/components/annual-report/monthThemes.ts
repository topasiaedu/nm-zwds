/**
 * Per-lunar-month color themes for Part 2 monthly chapters.
 * Each month gets a distinct but readable palette for quick visual scanning.
 */

/** CSS class for a lunar month theme (1–12). */
export function getMonthThemeClass(lunarMonth: number): string {
  const clamped = Math.min(12, Math.max(1, Math.round(lunarMonth)));
  return `report-month-theme-${clamped}`;
}
