/**
 * Parses a birth-time string into a 24-hour clock hour (0–23).
 */
export function parseBirthHour(birthTime: string): number {
  const match = String(birthTime).match(/(\d+):?(\d+)?\s*(AM|PM)?/i);
  if (!match) return 12;
  let hour = parseInt(match[1], 10);
  if (match[3]?.toUpperCase() === "PM" && hour < 12) hour += 12;
  if (match[3]?.toUpperCase() === "AM" && hour === 12) hour = 0;
  return hour;
}
