import type { ChartData } from "../../../utils/zwds/types";
import { getPalaceForAspectLiuMonth } from "../../../utils/destiny-navigator/palace-resolver";
import {
  PALACE_DATA,
  getSignalColor,
} from "../../../utils/forecast/alignmentTimingData";
import type { TimingRow } from "./types";
import { CURRENT_YEAR, MONTH_NAMES_LONG } from "./constants";

/**
 * Builds 12-month timing rows for the print roadmap and summary table.
 */
export function buildTimingRows(chartData: ChartData, year: number = CURRENT_YEAR): TimingRow[] {
  return MONTH_NAMES_LONG.map((monthName, idx) => {
    const solarMonth = idx + 1;
    const palaceNumber = getPalaceForAspectLiuMonth("life", chartData, solarMonth, year);
    const palace = palaceNumber !== null ? chartData.palaces[palaceNumber - 1] : null;
    const palaceData = palace ? PALACE_DATA[palace.name] : null;
    const stars = palaceData?.stars ?? 3;
    const signal = getSignalColor(stars);
    return {
      month: monthName,
      palaceName: palace?.name ?? "-",
      season: palaceData?.season ?? "-",
      signal,
      priority: palaceData?.priority ?? "-",
      directive: palaceData?.directive ?? "-",
      watchOut: palaceData?.watchOut ?? ["-", "-"],
    };
  });
}
