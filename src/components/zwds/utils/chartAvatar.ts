/**
 * Gender- and age-based chart center avatars from public/images/chart/avatar.
 */

export type ChartAvatarGender = "male" | "female";

const CHART_AVATAR_BASE_PATH = "/images/chart/avatar";

/**
 * Clamp age to a non-negative integer for avatar band lookup.
 */
function normalizeAge(age: number): number {
  if (!Number.isFinite(age)) {
    return 0;
  }
  return Math.max(0, Math.floor(age));
}

/**
 * Resolve the avatar filename suffix for the given gender and age band.
 */
function getChartAvatarFileName(gender: ChartAvatarGender, age: number): string {
  const normalizedAge = normalizeAge(age);
  const prefix = gender === "female" ? "girl" : "men";

  if (normalizedAge <= 17) {
    return `${prefix}-0-17.png`;
  }
  if (normalizedAge <= 29) {
    return `${prefix}-18-29.png`;
  }
  if (normalizedAge <= 44) {
    return `${prefix}-30-44.png`;
  }
  if (gender === "female") {
    if (normalizedAge <= 59) {
      return "girl-45-59.png";
    }
    return "girl-60-above.png";
  }
  if (normalizedAge <= 60) {
    return "men-45-60.png";
  }
  return "men-60-above.png";
}

/**
 * Public URL for the chart center avatar matching gender and age.
 */
export function getChartAvatarSrc(
  gender: ChartAvatarGender,
  age: number
): string {
  return `${CHART_AVATAR_BASE_PATH}/${getChartAvatarFileName(gender, age)}`;
}
