interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

// Lunar calendar data from 1900 to 2100
const LUNAR_INFO = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,0x04ae0,        /* 1910 */
  0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540,        /* 1915 */
  0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970,        /* 1920 */
  0x0a4b0, 0x0b4b5, 0x06a50, 0x06d40, 0x1ab54,        /* 1925 */
  0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566,        /* 1930 */
  0x0d4a0, 0x0ea50, 0x06e95, 0x05ad0, 0x02b60,        /* 1935 */
  0x186e3, 0x092e0, 0x1c8d7, 0x0c950, 0x0d4a0,        /* 1940 */
  0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0,        /* 1945 */
  0x092d0, 0x0d2b2, 0x0a950, 0x0b557, 0x06ca0,        /* 1950 */
  0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573,        /* 1955 */
  0x052d0, 0x0a9a8, 0x0e950, 0x06aa0, 0x0aea6,        /* 1960 */
  0x0ab50, 0x04b60, 0x0aae4, 0x0a570, 0x05260,        /* 1965 */
  0x0f263, 0x0d950, 0x05b57, 0x056a0, 0x096d0,        /* 1970 */
  0x04dd5, 0x04ad0, 0x0a4d0, 0x0d4d4, 0x0d250,        /* 1975 */
  0x0d558, 0x0b540, 0x0b5a0, 0x195a6, 0x095b0,        /* 1980 */
  0x049b0, 0x0a974, 0x0a4b0, 0x0b27a, 0x06a50,        /* 1985 */
  0x06d40, 0x0af46, 0x0ab60, 0x09570, 0x04af5,        /* 1990 */
  0x04970, 0x064b0, 0x074a3, 0x0ea50, 0x06b58,        /* 1995 */
  0x055c0, 0x0ab60, 0x096d5, 0x092e0, 0x0c960,        /* 2000 */
  0x0d954, 0x0d4a0, 0x0da50, 0x07552, 0x056a0,        /* 2005 */
  0x0abb7, 0x025d0, 0x092d0, 0x0cab5, 0x0a950,        /* 2010 */
  0x0b4a0, 0x0baa4, 0x0ad50, 0x055d9, 0x04ba0,        /* 2015 */
  0x0a5b0, 0x15176, 0x052b0, 0x0a930, 0x07954,        /* 2020 */
  0x06aa0, 0x0ad50, 0x05b52, 0x04b60, 0x0a6e6,        /* 2025 */
  0x0a4e0, 0x0d260, 0x0ea65, 0x0d530, 0x05aa0,        /* 2030 */
  0x076a3, 0x096d0, 0x04bd7, 0x04ad0, 0x0a4d0,        /* 2035 */
  0x1d0b6, 0x0d250, 0x0d520, 0x0dd45, 0x0b5a0,        /* 2040 */
  0x056d0, 0x055b2, 0x049b0, 0x0a577, 0x0a4b0,        /* 2045 */
  0x0aa50, 0x1b255, 0x06d20, 0x0ada0  
];

export const lunar = {
  convertSolarToLunar(year: number, month: number, day: number): LunarDate {
    // Validate input
    if (year < 1900 || year > 2100) {
      throw new Error('Year must be between 1900 and 2100');
    }

    // Get total days from 1900/1/31
    let offset = (Date.UTC(year, month - 1, day) - Date.UTC(1900, 0, 31)) / 86400000;

    // Search in lunar calendar
    let i: number;
    for (i = 1900; i < 2101 && offset > 0; i++) {
      const daysInYear = this.getLunarYearDays(i);
      offset -= daysInYear;
    }

    if (offset < 0) {
      offset += this.getLunarYearDays(--i);
    }

    // Get year
    const lunarYear = i;

    // Get month and day
    let lunarMonth = 1;
    let isLeap = false;
    let daysInMonth: number = 0;

    // Search in months of the lunar year
    const leapMonth = this.getLeapMonth(lunarYear);
    for (i = 1; i <= 12 && offset > 0; i++) {
      if (leapMonth > 0 && i === leapMonth + 1 && !isLeap) {
        --i;
        isLeap = true;
        daysInMonth = this.getLeapDays(lunarYear);
      } else {
        daysInMonth = this.getLunarMonthDays(lunarYear, i);
      }

      if (isLeap && i === leapMonth + 1) {
        isLeap = false;
      }

      offset -= daysInMonth;
      if (!isLeap) {
        lunarMonth++;
      }
    }

    // Get day
    if (offset === 0 && leapMonth > 0 && i === leapMonth + 1) {
      if (isLeap) {
        isLeap = false;
      } else {
        isLeap = true;
        --i;
        --lunarMonth;
      }
    }

    if (offset < 0) {
      offset += daysInMonth;
      --i;
      --lunarMonth;
    }

    // Get day
    const lunarDay = offset + 1;

    return {
      year: lunarYear,
      month: lunarMonth,
      day: lunarDay,
      isLeap
    };
  },

  getLunarYearDays(year: number): number {
    let sum = 348;
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      sum += (LUNAR_INFO[year - 1900] & i) ? 1 : 0;
    }
    return sum + this.getLeapDays(year);
  },

  getLeapMonth(year: number): number {
    return LUNAR_INFO[year - 1900] & 0xf;
  },

  getLeapDays(year: number): number {
    if (this.getLeapMonth(year)) {
      return (LUNAR_INFO[year - 1900] & 0x10000) ? 30 : 29;
    }
    return 0;
  },

  getLunarMonthDays(year: number, month: number): number {
    return (LUNAR_INFO[year - 1900] & (0x10000 >> month)) ? 30 : 29;
  }
};

// Constants for stems and branches
export const HeavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
export const EarthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

// Helper function to get the stem-branch year
export const getStemBranchYear = (year: number): string => {
  const stem = HeavenlyStems[(year - 4) % 10];
  const branch = EarthlyBranches[(year - 4) % 12];
  return stem + branch;
}; 