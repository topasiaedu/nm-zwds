export class Lunar {
  public y: number | undefined;
  public m: number | undefined;
  public d: number | undefined;
  public l: boolean  | undefined; // Indicates if it's a leap month

  constructor(type: number, year: number, month: number, day: number) {
    if (type === 0) {
      this.solarToLunar(year, month, day);
    } else {
      this.lunarToSolar(year, month, day);
    }
  }

  private static isLeapYear(y: number): boolean {
    return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
  }

  private static getDaysInSolarMonth(year: number, month: number): number {
    const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (month === 2 && Lunar.isLeapYear(year)) {
      return 29;
    }
    return days[month - 1];
  }

  private solarToLunar(year: number, month: number, day: number) {
    let offset = 0;

    // Compute the offset days since 1900-01-31
    for (let y = 1900; y < year; y++) {
      offset += Lunar.isLeapYear(y) ? 366 : 365;
    }

    for (let m = 1; m < month; m++) {
      offset += Lunar.getDaysInSolarMonth(year, m);
    }

    offset += day - 1;

    // Convert offset into lunar date
    let lunarYear = 1900;
    while (offset >= Lunar.getLunarYearDays(lunarYear)) {
      offset -= Lunar.getLunarYearDays(lunarYear);
      lunarYear++;
    }

    let leapMonth = Lunar.getLunarLeapMonth(lunarYear);
    let isLeap = false;
    let lunarMonth = 1;
    while (offset >= Lunar.getLunarMonthDays(lunarYear, lunarMonth)) {
      offset -= Lunar.getLunarMonthDays(lunarYear, lunarMonth);
      if (lunarMonth === leapMonth) {
        isLeap = !isLeap;
        if (!isLeap) lunarMonth++; // Move past leap month
      } else {
        lunarMonth++;
      }
    }

    this.y = lunarYear;
    this.m = lunarMonth;
    this.d = offset + 1;
    this.l = isLeap;
  }

  private lunarToSolar(year: number, month: number, day: number) {
    let offset = 0;

    // Compute the offset days since 1900-01-31
    for (let y = 1900; y < year; y++) {
      offset += Lunar.getLunarYearDays(y);
    }

    let leapMonth = Lunar.getLunarLeapMonth(year);
    let isLeap = false;

    for (let m = 1; m < month; m++) {
      offset += Lunar.getLunarMonthDays(year, m);
      if (m === leapMonth) {
        isLeap = !isLeap;
        if (!isLeap) m++; // Skip leap month
      }
    }

    offset += day - 1;

    // Convert offset into solar date
    let solarYear = 1900;
    while (offset >= (Lunar.isLeapYear(solarYear) ? 366 : 365)) {
      offset -= Lunar.isLeapYear(solarYear) ? 366 : 365;
      solarYear++;
    }

    let solarMonth = 1;
    while (offset >= Lunar.getDaysInSolarMonth(solarYear, solarMonth)) {
      offset -= Lunar.getDaysInSolarMonth(solarYear, solarMonth);
      solarMonth++;
    }

    this.y = solarYear;
    this.m = solarMonth;
    this.d = offset + 1;
    this.l = false;
  }

  private static getLunarYearDays(year: number): number {
    let sum = 348; // 12 * 29 (short months)
    const info = Lunar.getYearInfo(year);
    for (let i = 0x8000; i > 0x8; i >>= 1) {
      if ((info & i) !== 0) sum += 1;
    }
    return sum + (Lunar.getLunarLeapMonth(year) ? 30 : 0);
  }

  private static getLunarLeapMonth(year: number): number {
    return Lunar.getYearInfo(year) & 0xf;
  }

  private static getLunarMonthDays(year: number, month: number): number {
    const info = Lunar.getYearInfo(year);
    return (info & (0x10000 >> month)) ? 30 : 29;
  }

  private static getYearInfo(year: number): number {
    const yearInfo = [
      0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 
      0x09ad0, 0x055d2, 0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d250, 0x1d255, 0x0b540, 
      0x0d6a0, 0x0ada2, 0x095b0, 0x14977, 0x04970, 0x0a4b0, 0x0b4b5, 0x06a50,
      0x06d40, 0x1ab54, 0x02b60, 0x09570, 0x052f2, 0x04970, 0x06566, 0x0d4a0,
      0x0ea50, 0x06e95, 0x05ad0, 0x02b60, 0x186e3, 0x092e0, 0x1c8d7, 0x0c950,
      0x0d4a0, 0x1d8a6, 0x0b550, 0x056a0, 0x1a5b4, 0x025d0, 0x092d0, 0x0d2b2,
      0x0a950, 0x0b557, 0x06ca0, 0x0b550, 0x15355, 0x04da0, 0x0a5d0, 0x14573
    ];
    
    return yearInfo[year - 1900];
  }
}
