declare module "solarlunar" {
  interface LunarInfo {
    lYear: number;   // Lunar year
    lMonth: number;  // Lunar month
    lDay: number;    // Lunar day
    animal: string;  // Chinese zodiac
    monthCn: string; // Chinese month name
    dayCn: string;   // Chinese day name
    gzYear: string;  // Ganzhi year
    gzMonth: string; // Ganzhi month
    gzDay: string;   // Ganzhi day
    isLeap: boolean; // Is leap month
    // Add other properties as needed
    [key: string]: any;
  }

  /**
   * Convert solar date to lunar date
   * @param year Solar year (e.g., 2024)
   * @param month Solar month (1-12)
   * @param day Solar day
   * @returns Lunar date information
   */
  export function solar2lunar(year: number, month: number, day: number): LunarInfo;

  /**
   * Convert lunar date to solar date
   * @param year Lunar year
   * @param month Lunar month
   * @param day Lunar day
   * @param isLeapMonth Whether it's a leap month
   * @returns Solar date information
   */
  export function lunar2solar(year: number, month: number, day: number, isLeapMonth?: boolean): any;
} 