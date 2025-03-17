import { lunar } from './lunar'; // We'll need to convert the lunar.js to TypeScript
import {
  EarthlyBranches,
  FiveElements,
  FiveEleArr,
  FiveEleTable,
  GanGB,
  HeavenlyStems,
  ZhiGB,
  ShengXiaoGB,
  StarM_S04,
  PalaceNames,
  StarM_A14,
  StarM_A07,
  StarM_B06,
  StarO_S05,
  Star_A14,
  Star_Z06,
  Star_T08,
  Star_G07,
  Star_S04,
  Star_B06,
  Star_OS5,
  YinYang
} from './ziweiTypes';
import type {
  ZiweiData,
  ZiweiState,
  StarPositions,
  Gender,
  Palace
} from './ziweiTypes';

class ZiweiCalculator {
  private state: ZiweiState;
  private Place12: Palace[] = [];

  private starPositions: StarPositions = {
    s14: [],
    sZ06: [],
    sT08: [],
    sG07: [],
    sS04: [],
    sB06: []
  };

  private readonly palaceNames = [
    "Health Palace",
    "Wealth Palace",
    "Child Palace",
    "Marriage Palace",
    "Siblings Palace",
    "Life Palace",
    "Parents Palace",
    "Happy Palace",
    "Property Palace",
    "Career Palace",
    "Friends Palace",
    "Travel Palace"
  ];

  private readonly palaceOrder = [
    "Life Palace",       // 命宮 [0]
    "Parents Palace",    // 父母宮 [1]
    "Happy Palace",      // 福德宮 [2]
    "Property Palace",   // 田宅宮 [3]
    "Career Palace",     // 官祿宮 [4]
    "Friends Palace",    // 交友宮 [5]
    "Travel Palace",     // 遷移宮 [6]
    "Health Palace",     // 疾厄宮 [7]
    "Wealth Palace",     // 財帛宮 [8]
    "Child Palace",      // 子女宮 [9]
    "Marriage Palace",   // 夫妻宮 [10]
    "Siblings Palace"    // 兄弟宮 [11]
  ];

  constructor() {
    const emptyPalace: Palace = {
      name: "",
      MangA: "",
      MangB: "",
      MangC: "",
      StarA: [],
      StarB: [],
      StarC: [],
      Star6: [],
      MangY10: "",
      MangY1: "",
      daShian: ""
    };

    this.state = {
      y: "",
      m: 0,
      d: 0,
      h: "",
      g: "M",
      l: "",
      b: "",
      f: "",
      s4: [],
      z: "",
      yS: 0,
      mS: 0,
      dS: 0,
      LunarDay: "",
      ShengXiao: "",
      y1Pos: 0,
      y2Pos: 0,
      hPos: 0,
      lPos: 0,
      bPos: 0,
      zPos: 0,
      palaces: Array(12).fill(null).map(() => ({ ...emptyPalace }))
    };
    
    this.Place12 = this.palaceNames.map(name => {
      const palace: Palace = {
        name,
        MangA: "",
        MangB: "",
        MangC: "",
        StarA: [],
        StarB: [],
        StarC: [],
        Star6: [],
        daShian: "",
        MangY10: "",
        MangY1: ""
      };
      return palace;
    });
  }

  private getStarArr(STAR: string[][], size: number, pos: number): string[] {
    const starArray: string[] = [];
    for (let i = 0; i < size; i++) {
      if (STAR[i]?.[pos]) {
        starArray[i] = STAR[i][pos];
      }
    }
    return starArray.filter((star): star is string => star !== undefined);
  }

  private getStarArrByPosArr(STAR: string[][], size: number, PosArr: number[]): string[] {
    const starArray: string[] = [];
    for (let i = 0; i < size; i++) {
      if (STAR[i] && PosArr[i] !== undefined && STAR[i][PosArr[i]]) {
        starArray[i] = STAR[i][PosArr[i]];
      }
    }
    return starArray.filter((star): star is string => star !== undefined);
  }

  private putS04Str(starName: string, STAR: string[]): string {
    const index = STAR.indexOf(starName);
    return index >= 0 ? StarM_S04[index].substring(1, 2) : '　';
  }

  private getS04Str(starName: string, STAR: string[]): string {
    const index = STAR.indexOf(starName);
    return index >= 0 ? StarM_S04[index] : '';
  }

  private getHeavenlyStemForPalace(baseIndex: number, palaceIndex: number): string {
    // Calculate the heavenly stem based on the year's stem and palace position
    return HeavenlyStems[((this.state.y1Pos % 5) * 2 + ((palaceIndex < 2 ? palaceIndex + 2 : palaceIndex) % 10)) % 10];
  }

  private formatStar(star: string, hasTransformation: boolean = false): string {
    return `${star}${hasTransformation ? ' ⟲' : ''}`;
  }

  private formatMangA(heavenlyStem: string, earthlyBranch: string): string {
    // Format MangA with proper line break
    return `${heavenlyStem}<br/>${earthlyBranch}`;
  }

  private setZiwei(d: number): void {
    const emptyPalace: Palace = {
      name: "",
      MangA: "",
      MangB: "",
      MangC: "",
      StarA: [],
      StarB: [],
      StarC: [],
      Star6: [],
      MangY10: "",
      MangY1: "",
      daShian: ""
    };

    // Reset palace order
    this.state.palaces = Array(12).fill(null).map(() => ({ ...emptyPalace }));

    // Calculate Life Palace and Body Palace positions
    // 安命宮、身宮
    const l = EarthlyBranches[(12 - this.state.hPos + 1 + this.state.m * 1.0) % 12];
    const b = EarthlyBranches[(12 - ((22 - this.state.hPos + 1 - this.state.m * 1.0) % 12)) % 12];
    this.state.lPos = EarthlyBranches.indexOf(l);
    this.state.bPos = EarthlyBranches.indexOf(b);

    // 安五行局
    this.state.f = FiveElements[FiveEleArr[this.state.y1Pos % 5][((this.state.lPos - (this.state.lPos % 2 === 0 ? 0 : 1)) / 2) % 6]];

    // 起紫微表
    this.state.z = EarthlyBranches[FiveEleTable[FiveElements.indexOf(this.state.f)][d - 1]];
    this.state.zPos = EarthlyBranches.indexOf(this.state.z);

    // Set palace names based on Life Palace position
    for (let i = 0; i < 12; i++) {
      const palace = this.state.palaces[i];
      if (!palace) continue;

      // Set palace names
      palace.name = PalaceNames[(12 - this.state.lPos + i) % 12];
      palace.MangA = `${HeavenlyStems[((this.state.y1Pos % 5) * 2 + ((i < 2 ? i + 2 : i) % 10)) % 10]}\n${EarthlyBranches[i]}`;
      palace.MangB = PalaceNames[(12 - this.state.lPos + i) % 12];
      palace.MangC = this.state.bPos === i ? PalaceNames[12] : "";
    }
  }

  /**
   * Utility function to deduplicate star arrays
   */
  private deduplicateStars(stars: string[]): string[] {
    return Array.from(new Set(stars));
  }

  private stepSetStar(y: string, m: number, d: number, h: string): void {
    // Prepare stars
    // 0:紫微,1:天機,2:太陽,3:武曲,4:天同,5:廉貞,6:天府,7:太陰,8:貪狼,9:巨門,10:天相,11:天梁,12:七殺,13:破軍
    const s14 = Star_A14[this.state.zPos] || [];

    // Get stars from Star_Z06 array
    const sZ06 = Star_Z06.map(row => row[this.state.zPos]);

    // Get stars from Star_T08 array using the last element of sZ06 (天府)
    const sT08 = Star_T08.map(row => row[sZ06[6]]);

    // 0:文昌 1:文曲 (時) 2:左輔 3:右弼 (月) 4:天魁 5:天鉞 6:祿存(年干)
    const sG07 = [
      this.state.hPos, // 文昌
      this.state.hPos, // 文曲
      m - 1, // 左輔
      m - 1, // 右弼
      this.state.y1Pos, // 天魁
      this.state.y1Pos, // 天鉞
      this.state.y1Pos // 祿存
    ].map((pos, index) => Star_G07[index][pos]);

    // Get four transformation stars
    const sS04 = Star_S04.map(row => row[this.state.y1Pos]);

    // Get six malefic stars
    const sB06 = [
      Star_B06[0][0][this.state.y1Pos],
      Star_B06[1][0][this.state.y1Pos],
      Star_B06[2][this.state.y2Pos % 4][this.state.hPos],
      Star_B06[3][this.state.y2Pos % 4][this.state.hPos],
      Star_B06[4][0][this.state.hPos],
      Star_B06[5][0][this.state.hPos]
    ].filter(star => typeof star === "number") as number[];

    // Get other stars
    const OS05 = Star_OS5.map((row: number[]) => row[this.state.y2Pos]);

    // Reset all palace stars
    for (let i = 0; i < 12; i++) {
      const palace = this.state.palaces[i];
      if (!palace) continue;

      palace.StarA = [];
      palace.StarB = [];
      palace.StarC = [];
      palace.Star6 = [];

      // Place Ziwei star system & malefic stars
      for (let k = 0; k < 6; k++) {
        if (Number(sZ06[k]) === i) {
          const starName = StarM_A14[k];
          palace.StarA.push(starName + this.getS04Str(starName, sS04));
        }
        if (Number(sB06[k]) === i) {
          palace.StarB.push(StarM_B06[k]);
        }
      }

      // Place Tianfu star system
      for (let k = 0; k < 8; k++) {
        if (Number(sT08[k]) === i) {
          const starName = StarM_A14[k + 6];
          palace.StarA.push(starName + this.getS04Str(starName, sS04));
        }
      }

      // Place six auspicious stars
      for (let k = 0; k < 7; k++) {
        if (Number(sG07[k]) === i) {
          const starName = StarM_A07[k];
          palace.Star6.push(starName + this.getS04Str(starName, sS04));
        }
      }

      // Place other stars
      for (let k = 0; k < 5; k++) {
        if (Number(OS05[k]) === i) {
          palace.StarC.push(StarO_S05[k]);
        }
      }

      // Deduplicate stars
      palace.StarA = Array.from(new Set(palace.StarA));
      palace.StarB = Array.from(new Set(palace.StarB));
      palace.StarC = Array.from(new Set(palace.StarC));
      palace.Star6 = Array.from(new Set(palace.Star6));

      // Combine all stars for display
      palace.StarAll = [...palace.StarA, ...palace.StarB, ...palace.StarC, ...palace.Star6];
    }
  }

  private convertHourToEarthlyBranch(hour: string): string {
    const hourNum = parseInt(hour);
    if (isNaN(hourNum)) {
      return hour; // If already an Earthly Branch, return as is
    }
    
    // Chinese hour system divides the day into 12 two-hour periods
    const hourMap: { [key: number]: string } = {
      23: "子", 0: "子", 1: "子",    // 23:00-01:00
      2: "丑", 3: "丑",              // 01:00-03:00
      4: "寅", 5: "寅",              // 03:00-05:00
      6: "卯", 7: "卯",              // 05:00-07:00
      8: "辰", 9: "辰",              // 07:00-09:00
      10: "巳", 11: "巳",            // 09:00-11:00
      12: "午", 13: "午",            // 11:00-13:00
      14: "未", 15: "未",            // 13:00-15:00
      16: "申", 17: "申",            // 15:00-17:00
      18: "酉", 19: "酉",            // 17:00-19:00
      20: "戌", 21: "戌",            // 19:00-21:00
      22: "亥"                       // 21:00-23:00
    };

    return hourMap[hourNum] || "子"; // Default to 子 if hour is invalid
  }

  private calculateDaShian(gender: string, yearStem: number): void {
    try {
      // Calculate starting age based on gender and year stem
      const isEvenYear = yearStem % 2 === 0;
      const isForward = (gender === "M" && isEvenYear) || (gender === "F" && !isEvenYear);
      const startAge = isForward ? 1 : 10;

      // Calculate age ranges for each palace
      for (let i = 0; i < 12; i++) {
        const palace = this.Place12[i];
        const palaceIndex = isForward ? i : (11 - i);
        const ageStart = startAge + (palaceIndex * 10);
        const ageEnd = ageStart + 9;
        palace.daShian = `${ageStart}-${ageEnd}`;
      }
    } catch (error) {
      console.error('Error in calculateDaShian:', error);
      throw new Error('Failed to calculate DaShian ranges');
    }
  }

  public computeZiWei(
    solarYear: number,
    solarMonth: number,
    solarDay: number,
    hour: string,
    gender: Gender,
    name: string
  ): ZiweiData {
    try {
      // Log input parameters
      console.log("Computing Ziwei chart with parameters:", {
        solarYear,
        solarMonth,
        solarDay,
        hour,
        gender,
        name
      });

      // Convert hour to Earthly Branch
      const earthlyBranchHour = this.convertHourToEarthlyBranch(hour);
      console.log("Converted hour to Earthly Branch:", earthlyBranchHour);

      // Convert solar to lunar date
      const lunarDate = lunar.convertSolarToLunar(solarYear, solarMonth, solarDay);
      console.log("Lunar date conversion result:", lunarDate);
      
      // Initialize state
      this.state.y = HeavenlyStems[(solarYear - 4) % 10] + EarthlyBranches[(solarYear - 4) % 12];
      this.state.m = lunarDate.month;
      this.state.d = lunarDate.day;
      this.state.h = earthlyBranchHour;
      this.state.g = gender;

      // Log state after initialization
      console.log("State after initialization:", { ...this.state });

      // Calculate positions
      this.state.y1Pos = HeavenlyStems.indexOf(this.state.y.substring(0, 1));
      this.state.y2Pos = EarthlyBranches.indexOf(this.state.y.substring(1, 2));
      this.state.hPos = EarthlyBranches.indexOf(earthlyBranchHour);

      // Log calculated positions
      console.log("Calculated positions:", {
        y1Pos: this.state.y1Pos,
        y2Pos: this.state.y2Pos,
        hPos: this.state.hPos,
        yearChar: this.state.y.substring(0, 1),
        yearBranch: this.state.y.substring(1, 2)
      });

      if (this.state.y1Pos === -1 || this.state.y2Pos === -1 || this.state.hPos === -1) {
        throw new Error(`Invalid position calculation: y1Pos=${this.state.y1Pos}, y2Pos=${this.state.y2Pos}, hPos=${this.state.hPos}`);
      }

      // Set up Ziwei chart
      this.setZiwei(lunarDate.day);
      this.stepSetStar(this.state.y, lunarDate.month, lunarDate.day, earthlyBranchHour);

      // Calculate age
      const birthDate = new Date(solarYear, solarMonth - 1, solarDay);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);

      // Calculate DaShian
      console.log("Starting DaShian calculation...");
      this.calculateDaShian(gender, this.state.y1Pos);
      console.log("DaShian calculation completed:");

      const result = {
        palaces: this.Place12,
        centerInfo: {
          name,
          age,
          solarDate: `${solarYear}年${solarMonth}月${solarDay}日${hour}時`,
          lunarDate: `${this.state.y}年${this.state.m}月${this.state.d}日${earthlyBranchHour}時`,
          zodiac: `${ShengXiaoGB[(solarYear - 4) % 12]}【${this.state.y}】`,
          fiveElement: this.state.f,
          yinYangGender: this.getYinYangGender(),
          daShian: this.Place12.map(palace => palace.daShian)
        }
      };

      // Log the final result with DaShian
      console.log("Final result centerInfo:", result.centerInfo);
      return result;

    } catch (error) {
      console.error('Error in computeZiWei:', {
        error,
        input: { solarYear, solarMonth, solarDay, hour, gender },
        state: this.state
      });
      throw new Error('Error calculating chart. Please check your birth information.');
    }
  }

  private getYinYangGender(): string {
    return `${YinYang[this.state.y1Pos % 2]}${this.state.g === "M" ? "男" : "女"}`;
  }
}

export const ziweiCalculator = new ZiweiCalculator();

export const translations = {
  zh: {
    solarCalendar: "國曆",
    lunarCalendar: "農曆",
    zodiac: "生肖",
    fiveElement: "五行",
    yinYangGender: "陰陽性別",
    annualFortune: "流年",
    name: "姓名",
    age: "年齡",
    // Add more translations as needed
  },
  en: {
    solarCalendar: "Solar Calendar",
    lunarCalendar: "Lunar Calendar",
    zodiac: "Zodiac",
    fiveElement: "Five Elements",
    yinYangGender: "Yin-Yang Gender",
    annualFortune: "Annual Fortune",
    name: "Name",
    age: "Age",
    // Add more translations as needed
  }
}; 