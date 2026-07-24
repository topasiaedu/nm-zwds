/**
 * Data hook for Monthly Consultation Document Viewer + PDF.
 */

import { useMemo } from "react";
import type { Profile } from "../../../context/ProfileContext";
import { getLiuMonthAnchorFromLocalDate } from "../../../utils/destiny-navigator/palace-resolver";
import {
  buildMonthlyConsultationBundle,
  type MonthlyConsultationBundle,
} from "../../../utils/forecast/monthlyConsultation";
import { computeChartFromProfile } from "../../alignment-advantage/data/useAlignmentAdvantageData";

export interface UseMonthlyConsultationDataResult {
  bundle: MonthlyConsultationBundle | null;
  loading: boolean;
  error: string | null;
}

/**
 * Compute the Monthly Consultation bundle for a profile and lunar month.
 *
 * @param profile - Account owner profile (or print-fetched profile)
 * @param lunarMonth - Lunar month 1 to 12; defaults to current local lunar month
 * @param solarYear - Gregorian year for annual-flow lookup; defaults to current local solar year
 */
export function useMonthlyConsultationData(
  profile: Profile | null,
  lunarMonth?: number,
  solarYear?: number
): UseMonthlyConsultationDataResult {
  return useMemo(() => {
    if (profile === null) {
      return { bundle: null, loading: true, error: null };
    }

    const chartData = computeChartFromProfile(profile);
    if (chartData === null) {
      return {
        bundle: null,
        loading: false,
        error: "Could not compute chart from profile birth data.",
      };
    }

    const anchor = getLiuMonthAnchorFromLocalDate();
    const month = lunarMonth ?? anchor.lunarMonth;
    const year = solarYear ?? anchor.solarYear;

    if (!Number.isFinite(month) || month < 1 || month > 12) {
      return {
        bundle: null,
        loading: false,
        error: "Invalid lunar month. Expected a value from 1 to 12.",
      };
    }
    if (!Number.isFinite(year)) {
      return {
        bundle: null,
        loading: false,
        error: "Invalid solar year.",
      };
    }

    const bundle = buildMonthlyConsultationBundle(profile, chartData, month, year);
    if (bundle === null) {
      return {
        bundle: null,
        loading: false,
        error: "Could not resolve Liu Yue timing for this month.",
      };
    }

    return { bundle, loading: false, error: null };
  }, [profile, lunarMonth, solarYear]);
}
