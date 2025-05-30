import {
  ChartInput,
  ChartData,
  Star,
  FiveElementType,
  Transformation,
} from "./types";
import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  PALACE_NAMES,
  ZIWEI_POSITIONS,
  LEFT_SUPPORT_POSITIONS,
  RIGHT_SUPPORT_POSITIONS,
  WEN_CHANG_POSITIONS,
  WEN_QU_POSITIONS,
  FOUR_TRANSFORMATIONS,
  LIFE_PALACE_TABLE,
  FIVE_ELEMENTS_TABLE,
  MAJOR_LIMIT_STARTING_AGES,
  MAIN_STARS_TABLE,
  OPPOSITE_PALACE_INFLUENCE,
} from "./constants";
import {
  getHourBranch,
  findStarByName,
  getLunarDayFromBirthday,
} from "./utils";
import { lunar } from "../lunar";

/**
 * Main calculator class for Zi Wei Dou Shu chart calculations
 */
export class ZWDSCalculator {
  private readonly input: ChartInput;
  private readonly chartData: ChartData;

  constructor(input: ChartInput) {
    this.input = input;
    this.chartData = this.initializeChartData();
  }

  // Chart Palace Grid Display Structure
  // [1] [2] [3] [4]
  // [12] [INFO] [INFO] [5]
  // [11] [INFO] [INFO] [6]
  // [10] [9] [8] [7]
  // INFO: Basic Information of the user (Name, Gender, Birth Date, Birth Time) + Stuff that is not in the palace

  /**
   * Initialize the chart data structure
   */
  private initializeChartData(): ChartData {
    // Create a default ChartData structure with properly assigned earthly branches
    // The earthly branches have a fixed position pattern:
    // [巳午未申]
    // [辰  酉]
    // [卯  戌]
    // [寅丑子亥]

    return {
      input: this.input,
      earthlyBranch: EARTHLY_BRANCHES[0],
      heavenlyStem: HEAVENLY_STEMS[0],
      yinYang: "Yang",
      lunarDate: {
        year: 0,
        month: 0,
        day: 0,
        isLeap: false,
      },
      palaces: Array.from({ length: 12 }, (_, i) => {
        const palaceNumber = i + 1;
        return {
          number: palaceNumber,
          earthlyBranch: EARTHLY_BRANCHES[(i + 5) % 12],
          heavenlyStem: HEAVENLY_STEMS[0],
          name: PALACE_NAMES[i],
          minorStars: [],
          auxiliaryStars: [],
          yearStars: [],
          monthStars: [],
          dayStars: [],
          hourStars: [],
          originalPalace: palaceNumber,
        };
      }),
      lifePalace: 0,
      bodyPalace: 0,
      originalPalace: 0,
      yearBranch: 0,
      monthBranch: 0,
      dayBranch: 0,
      hourBranch: 0,
      yearStem: 0,
      monthStem: 0,
      dayStem: 0,
      hourStem: 0,
      calculationSteps: {
        step1: "",
        step2: "",
        step3: "",
        step4: "",
        step5: "",
        step6: "",
        step7: "",
        step8: "",
        step9: "",
        step10: "",
        step11: "",
        step12: "",
        step13: "",
        step14: "",
      },
    };
  }

  /**
   * Calculate the complete chart
   */
  public calculate(): ChartData {
    this.step1();
    this.step2();
    this.step3();
    this.step4();
    this.step5();
    this.step6();
    this.step7();
    this.step8();
    this.step9();
    this.step10();
    this.step11();
    this.step12();
    this.step13();
    this.step14();

    // Find the stars with transformations
    let huaLu = "";
    let huaQuan = "";
    let huaKe = "";
    let huaJi = "";

    // Go through all palaces to find stars with transformations
    this.chartData.palaces.forEach((palace) => {
      // Check main stars and all other star arrays
      const allStars = [
        ...(palace.mainStar || []),
        ...(palace.bodyStar ? [palace.bodyStar] : []),
        ...palace.minorStars,
        ...palace.auxiliaryStars,
        ...palace.yearStars,
        ...palace.monthStars,
        ...palace.dayStars,
        ...palace.hourStars,
        ...(palace.lifeStar ? [palace.lifeStar] : []),
      ];

      // Check for transformations
      allStars.forEach((star) => {
        if (star.transformations) {
          if (star.transformations.includes("化祿")) {
            huaLu = star.name;
          }
          if (star.transformations.includes("化權")) {
            huaQuan = star.name;
          }
          if (star.transformations.includes("化科")) {
            huaKe = star.name;
          }
          if (star.transformations.includes("化忌")) {
            huaJi = star.name;
          }
        }
      });
    });

    // Extract main star if available from the life palace
    let mainStar = "";
    const lifePalace = this.chartData.palaces[this.chartData.lifePalace - 1];
    if (lifePalace && lifePalace.mainStar && lifePalace.mainStar.length > 0) {
      mainStar = lifePalace.mainStar[0].name;
    }

    // Create a properly formatted transformation object
    const transformationObject = {
      huaLu,
      huaQuan,
      huaKe,
      huaJi,
    };

    // Return calculated data with transformations and mainStar
    const result: ChartData = {
      ...this.chartData,
      transformations: transformationObject,
      mainStar,
    };

    return result;
  }

  /**
   * Step 1: Calculate Earthly Branch and Heavenly Stem
   */
  private step1(): void {
    // Calculates Earthly Branch and Heavenly Stem for the year
    // DONE THIS IS CORRECT ALREADY
    const lunarDate = lunar.convertSolarToLunar(
      this.input.year,
      this.input.month,
      this.input.day
    );

    const year = lunarDate.year - 1900 - 23;
    // const year = this.input.year;
    const yearBranch = year % 12;
    const yearStem = year % 10;

    // Fix index calculation to handle when yearBranch or yearStem is 0
    // Use modulo to ensure we wrap around to the end of the arrays
    this.chartData.earthlyBranch = EARTHLY_BRANCHES[(yearBranch - 1 + 12) % 12];
    this.chartData.heavenlyStem = HEAVENLY_STEMS[(yearStem - 1 + 10) % 10];

    // Record the calculation step
    this.chartData.calculationSteps.step1 = `Earthly Branch and Heavenly Stem calculated`;
    this.chartData.calculationSteps.step1 += `Year: ${year}, Year Branch: ${yearBranch}, Year Stem: ${yearStem}`;
    this.chartData.calculationSteps.step1 += `Earthly Branch: ${this.chartData.earthlyBranch}, Heavenly Stem: ${this.chartData.heavenlyStem}`;
  }

  /**
   * Step 2: Calculate Yin Yang
   */
  private step2(): void {
    // Calculates Yin Yang for the year

    // Convert to lunar first
    const lunarDate = lunar.convertSolarToLunar(
      this.input.year,
      this.input.month,
      this.input.day
    );
    const year = lunarDate.year;
    const yearStem = year % 10;

    this.chartData.yinYang = yearStem % 2 === 1 ? "Yin" : "Yang";
  }

  /**
   * Step 3: Calculate the Position of Heavenly Stem in each palace
   */
  private step3(): void {
    // DONE THIS IS CORRECT ALREADY

    const heavenlyStem = this.chartData.heavenlyStem;

    // Get the index of the user's Heavenly Stem
    const heavenlyStemIndex = HEAVENLY_STEMS.indexOf(heavenlyStem);

    if (heavenlyStemIndex === -1) {
      throw new Error(`Invalid Heavenly Stem: ${heavenlyStem}`);
    }

    // Determine the starting Heavenly Stem for Palace 10 based on user's Heavenly Stem
    let palace10StemIndex;

    // Pattern based on stem index modulo 5
    const stemGroup = heavenlyStemIndex % 5;

    if (stemGroup === 0) {
      // 甲(0)/己(5)
      palace10StemIndex = 2;
    } else if (stemGroup === 1) {
      // 乙(1)/庚(6)
      palace10StemIndex = 4;
    } else if (stemGroup === 2) {
      // 丙(2)/辛(7)
      palace10StemIndex = 6;
    } else if (stemGroup === 3) {
      // 丁(3)/壬(8)
      palace10StemIndex = 8;
    } else if (stemGroup === 4) {
      // 戊(4)/癸(9)
      palace10StemIndex = 0;
    } else {
      throw new Error(`Unexpected stem group: ${stemGroup}`);
    }

    // Assign Heavenly Stems to each palace, starting from Palace 10 and going clockwise
    for (let i = 0; i < 12; i++) {
      // Palace order: 10, 11, 12, 1, 2, ..., 9
      const palaceIndex = (9 + i) % 12;

      // Calculate the Heavenly Stem index for this palace
      const stemIndex = (palace10StemIndex + i) % 10;

      // Assign the Heavenly Stem to this palace
      this.chartData.palaces[palaceIndex].heavenlyStem =
        HEAVENLY_STEMS[stemIndex];
    }

    // Record the calculation step
    this.chartData.calculationSteps.step3 = `Heavenly Stems assigned to each palace starting from Palace 10 with ${HEAVENLY_STEMS[palace10StemIndex]}`;
  }

  /**
   * Step 4: Calculate the position of the Life Palace (命宫)
   * Based on the intersection of birth month (rows) and birth hour/earthly branch (columns)
   */
  private step4(): void {
    // DONE THIS IS CORRECT ALREADY

    const { year, month, day, hour } = this.input;

    // Convert solar date to lunar date
    // We need to import the lunar utility at the top of the file to use this
    const lunarDate = lunar.convertSolarToLunar(year, month, day);
    const lunarMonth = lunarDate.month;

    // Convert hour to Earthly Branch position (0-11)
    const hourBranch = getHourBranch(hour);
    const hourBranchName = EARTHLY_BRANCHES[hourBranch];

    // Store the lunar date in the chart data
    this.chartData.lunarDate = {
      year: lunarDate.year,
      month: lunarDate.month,
      day: lunarDate.day,
      isLeap: lunarDate.isLeap,
    };

    // LIFE_PALACE_TABLE is organized as:
    // [month-1][hourBranch] = earthly branch name for life palace
    // We need to subtract 1 from lunarMonth because arrays are 0-indexed
    const lifePalaceEarthlyBranch =
      LIFE_PALACE_TABLE[lunarMonth - 1][hourBranch];


    if (!lifePalaceEarthlyBranch) {
      console.error(
        "Invalid Life Palace earthly branch:",
        lifePalaceEarthlyBranch
      );
      console.error("Lunar Month:", lunarMonth, "Hour Branch:", hourBranch);
      throw new Error(
        `Invalid Life Palace earthly branch: ${lifePalaceEarthlyBranch} for lunar month ${lunarMonth} and hour branch ${hourBranch}`
      );
    }

    let lifePalace = 0;
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      if (this.chartData.palaces[i].earthlyBranch === lifePalaceEarthlyBranch) {
        lifePalace = i + 1;
        break;
      }
    }

    if (lifePalace < 1 || lifePalace > 12) {
      console.error(
        "Could not find palace with earthly branch:",
        lifePalaceEarthlyBranch
      );
      throw new Error(
        `Could not find palace with earthly branch: ${lifePalaceEarthlyBranch}`
      );
    }

    // Set the Life Palace position
    this.chartData.lifePalace = lifePalace;

    // Record the calculation step
    this.chartData.calculationSteps.step4 =
      `Life Palace calculation: Lunar Month ${lunarMonth} (row), ` +
      `Hour Branch ${hourBranchName} (column), ` +
      `Found earthly branch ${lifePalaceEarthlyBranch}, ` +
      `mapped to palace position ${lifePalace}`;
  }

  /**
   * Step 5: Populate all palace names in the correct order
   * Starting from Life Palace (命宫), going counterclockwise:
   * 命宫 -> 兄弟 -> 夫妻 -> 子女 -> 财帛 -> 疾厄 ->
   * 迁移 -> 仆役 -> 官禄 -> 田宅 -> 福德 -> 父母
   */
  private step5(): void {
    // DONE THIS IS CORRECT ALREADY
    const lifePalace = this.chartData.lifePalace;

    // Populate palace names starting from Life Palace position
    for (let i = 0; i < 12; i++) {
      // Calculate the actual palace position (1-12) for each name
      // We subtract 1 from lifePalace because array is 0-based
      // We use modulo 12 to wrap around when we exceed 12
      const palacePosition = (lifePalace - 1 - i + 12) % 12;

      // Set the palace name
      this.chartData.palaces[palacePosition].name = PALACE_NAMES[i];
    }

    // Record the calculation step
    this.chartData.calculationSteps.step5 = `Palace names populated starting from Life Palace at position ${lifePalace}`;
  }

  /**
   * Step 6: Calculate the Five Elements (五行局)
   * Based on the Life Palace's Heavenly Stem and Earthly Branch
   */
  private step6(): void {
    // DONE THIS IS CORRECT ALREADY

    // Get the Life Palace position
    const lifePalacePos = this.chartData.lifePalace - 1; // Convert to 0-based index
    const lifePalace = this.chartData.palaces[lifePalacePos];

    // Get the Heavenly Stem and Earthly Branch of the Life Palace
    const heavenlyStem = lifePalace.heavenlyStem;
    const earthlyBranch = lifePalace.earthlyBranch;

    // Get the Five Elements type
    const fiveElements = (
      FIVE_ELEMENTS_TABLE[heavenlyStem] as Record<string, string>
    )[earthlyBranch];

    // Store the result
    this.chartData.fiveElements = fiveElements as FiveElementType;

    // Record the calculation step with detailed information
    this.chartData.calculationSteps.step6 =
      `Five Elements calculation: Life Palace (${lifePalace.name}) at position ${this.chartData.lifePalace} ` +
      `with Heavenly Stem ${heavenlyStem} and Earthly Branch ${earthlyBranch} = ${fiveElements}`;
  }

  /**
   * Step 7: Find the position of ZiWei star based on lunar day and Five Elements
   * This serves as an anchor point for placing other stars
   */
  private step7(): void {
    const fiveElements = this.chartData.fiveElements;

    if (!fiveElements) {
      throw new Error(
        "Five Elements must be calculated before placing ZiWei star"
      );
    }

    // Convert day number to lunar day string
    const lunarDay = getLunarDayFromBirthday(
      this.input.year,
      this.input.month,
      this.input.day
    );

    // Get ZiWei earthly branch from lookup table
    const ziWeiEarthlyBranch =
      ZIWEI_POSITIONS[lunarDay as keyof typeof ZIWEI_POSITIONS]?.[
        fiveElements as keyof (typeof ZIWEI_POSITIONS)[keyof typeof ZIWEI_POSITIONS]
      ];

    if (!ziWeiEarthlyBranch) {
      throw new Error(
        `Invalid lunar day or five elements: ${String(
          lunarDay
        )}, ${fiveElements}`
      );
    }

    // Find which palace has the ZiWei star based on its earthly branch
    let ziWeiPosition = 0;
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      if (this.chartData.palaces[i].earthlyBranch === ziWeiEarthlyBranch) {
        ziWeiPosition = i + 1; // Found ZiWei's palace position (1-12)

        // Initialize mainStar as an array and place the ZiWei star in this palace
        this.chartData.palaces[i].mainStar = [
          {
            name: "紫微",
            brightness: "bright",
            palace: ziWeiPosition,
            isTransformed: false,
          },
        ];
        break;
      }
    }

    if (ziWeiPosition === 0) {
      throw new Error(
        `Could not find palace with earthly branch ${ziWeiEarthlyBranch} for ZiWei star`
      );
    }

    // Set the ZiWei position in the chart data
    this.chartData.ziWeiPosition = ziWeiPosition;

    // Record the calculation step
    this.chartData.calculationSteps.step7 = `ZiWei star placed in earthly branch ${ziWeiEarthlyBranch}, palace position ${this.chartData.ziWeiPosition}`;
  }

  /**
   * Step 8: Place the remaining main stars based on ZiWei's position
   */
  private step8(): void {
    // DONE THIS IS CORRECT ALREADY
    const ziWeiPosition = this.chartData.ziWeiPosition;

    if (!ziWeiPosition) {
      throw new Error(
        "ZiWei position must be calculated before placing other stars"
      );
    }

    // Populate the other main stars based on ZiWei's position
    const earthlyBranch =
      this.chartData.palaces[ziWeiPosition - 1].earthlyBranch;
    const mainStars = MAIN_STARS_TABLE[earthlyBranch];

    // Initialize mainStar arrays for all palaces if not already initialized
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      this.chartData.palaces[i].mainStar =
        this.chartData.palaces[i].mainStar || [];
    }

    // Populate main stars for each palace
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      const palace = this.chartData.palaces[i];
      const stars = mainStars[palace.earthlyBranch] as readonly string[];

      if (!stars || stars.length === 0) {
        continue;
      }

      for (let j = 0; j < stars.length; j++) {
        // Skip if star is ZiWei and we're in the ZiWei palace (already placed in step7)
        if (stars[j] === "紫微" && i === ziWeiPosition - 1) {
          continue;
        }

        if (palace.mainStar) {
          palace.mainStar.push({
            name: stars[j],
            brightness: "bright",
            palace: i + 1,
            isTransformed: false,
          });
        }
      }
    }

    // Record the calculation step
    this.chartData.calculationSteps.step8 = `All main stars placed based on ZiWei's position in palace ${ziWeiPosition}`;
  }

  /**
   * Step 9: Calculate positions of all four supporting stars:
   * Left Support (左輔) and Right Support (右弼) based on birth month
   * Wen Chang (文昌) and Wen Qu (文曲) based on birth hour
   */
  private step9(): void {
    // DONE THIS IS CORRECT ALREADY
    const { year, month, day, hour } = this.input;

    // Convert solar date to lunar date
    const lunarDate = lunar.convertSolarToLunar(year, month, day);
    const lunarMonth = lunarDate.month;

    // Get earthly branches for Left Support and Right Support based on lunar month
    const leftSupportEarthlyBranch = LEFT_SUPPORT_POSITIONS[lunarMonth];
    const rightSupportEarthlyBranch = RIGHT_SUPPORT_POSITIONS[lunarMonth];

    if (!leftSupportEarthlyBranch || !rightSupportEarthlyBranch) {
      throw new Error(
        `Invalid lunar month ${lunarMonth} for support stars calculation`
      );
    }

    // Get earthly branches for Wen Chang and Wen Qu based on hour
    const wenChangEarthlyBranch = WEN_CHANG_POSITIONS[hour];
    const wenQuEarthlyBranch = WEN_QU_POSITIONS[hour];

    if (!wenChangEarthlyBranch || !wenQuEarthlyBranch) {
      throw new Error(
        `Invalid hour ${hour} for Wen Chang and Wen Qu calculation`
      );
    }

    // Find palace positions based on earthly branches
    let leftSupportPosition = 0;
    let rightSupportPosition = 0;
    let wenChangPosition = 0;
    let wenQuPosition = 0;

    // Find the palace positions by comparing earthly branches
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      const palaceEarthlyBranch = this.chartData.palaces[i].earthlyBranch;

      if (palaceEarthlyBranch === leftSupportEarthlyBranch) {
        leftSupportPosition = i + 1;
      }

      if (palaceEarthlyBranch === rightSupportEarthlyBranch) {
        rightSupportPosition = i + 1;
      }

      if (palaceEarthlyBranch === wenChangEarthlyBranch) {
        wenChangPosition = i + 1;
      }

      if (palaceEarthlyBranch === wenQuEarthlyBranch) {
        wenQuPosition = i + 1;
      }
    }

    // Verify all positions were found
    if (
      !leftSupportPosition ||
      !rightSupportPosition ||
      !wenChangPosition ||
      !wenQuPosition
    ) {
      console.error("Could not find all support star positions", {
        leftSupportEarthlyBranch,
        rightSupportEarthlyBranch,
        wenChangEarthlyBranch,
        wenQuEarthlyBranch,
        leftSupportPosition,
        rightSupportPosition,
        wenChangPosition,
        wenQuPosition,
      });
      throw new Error("Failed to find all support star positions");
    }

    // Create all four support stars
    const supportStars: Star[] = [
      {
        name: "左輔",
        brightness: "bright",
        palace: leftSupportPosition,
        isTransformed: false,
      },
      {
        name: "右弼",
        brightness: "bright",
        palace: rightSupportPosition,
        isTransformed: false,
      },
      {
        name: "文昌",
        brightness: "bright",
        palace: wenChangPosition,
        isTransformed: false,
      },
      {
        name: "文曲",
        brightness: "bright",
        palace: wenQuPosition,
        isTransformed: false,
      },
    ];

    // Add stars to their respective palaces
    supportStars.forEach((star) => {
      const palace = this.chartData.palaces[star.palace - 1];
      if (palace) {
        palace.minorStars.push(star);
      }
    });

    // Record the calculation step
    this.chartData.calculationSteps.step9 =
      `Support stars placed: ` +
      `左輔 in ${leftSupportEarthlyBranch} (palace ${leftSupportPosition}) and ` +
      `右弼 in ${rightSupportEarthlyBranch} (palace ${rightSupportPosition}) based on lunar month ${lunarMonth}, ` +
      `文昌 in ${wenChangEarthlyBranch} (palace ${wenChangPosition}) and ` +
      `文曲 in ${wenQuEarthlyBranch} (palace ${wenQuPosition}) based on hour ${hour}`;
  }

  /**
   * Step 10: Add Four Transformations (四化星) based on birth year's Heavenly Stem
   */
  private step10(): void {
    // DONE THIS IS CORRECT ALREADY
    // Get birth year's Heavenly Stem
    const yearStem = this.chartData.heavenlyStem;

    if (!yearStem) {
      throw new Error(
        "Birth year's Heavenly Stem must be calculated before adding transformations"
      );
    }

    // Get transformation rules for this Heavenly Stem
    const transformations = FOUR_TRANSFORMATIONS[yearStem];

    if (!transformations) {
      throw new Error(
        `No transformation rules found for Heavenly Stem ${yearStem}`
      );
    }

    // Apply each transformation
    const transformationResults: string[] = [];

    // Apply 化科 (Science)
    const scienceStar = findStarByName(
      this.chartData.palaces,
      transformations.科
    );
    if (scienceStar) {
      scienceStar.star.transformations = [
        ...(scienceStar.star.transformations || []),
        "化科",
      ];
      transformationResults.push(
        `化科 -> ${transformations.科} in palace ${scienceStar.palace}`
      );
    }

    // Apply 化權 (Power)
    const powerStar = findStarByName(
      this.chartData.palaces,
      transformations.權
    );
    if (powerStar) {
      powerStar.star.transformations = [
        ...(powerStar.star.transformations || []),
        "化權",
      ];
      transformationResults.push(
        `化權 -> ${transformations.權} in palace ${powerStar.palace}`
      );
    }

    // Apply 化祿 (Wealth)
    const wealthStar = findStarByName(
      this.chartData.palaces,
      transformations.祿
    );
    if (wealthStar) {
      wealthStar.star.transformations = [
        ...(wealthStar.star.transformations || []),
        "化祿",
      ];
      transformationResults.push(
        `化祿 -> ${transformations.祿} in palace ${wealthStar.palace}`
      );
    }

    // Apply 化忌 (Taboo)
    const tabooStar = findStarByName(
      this.chartData.palaces,
      transformations.忌
    );
    if (tabooStar) {
      tabooStar.star.transformations = [
        ...(tabooStar.star.transformations || []),
        "化忌",
      ];
      transformationResults.push(
        `化忌 -> ${transformations.忌} in palace ${tabooStar.palace}`
      );
    }

    // Record the calculation step
    this.chartData.calculationSteps.step10 =
      `Four Transformations based on birth year's Heavenly Stem ${yearStem}:\n` +
      transformationResults.join("\n");
  }

  /**
   * Step 11: Calculate Major Limits (大限) for each palace
   * Based on Five Elements and Life Palace position
   * Direction depends on gender and yin/yang
   */
  private step11(): void {
    const { gender } = this.input;
    const { yinYang, fiveElements, lifePalace } = this.chartData;

    if (!fiveElements) {
      throw new Error(
        "Five Elements must be calculated before determining Major Limits"
      );
    }

    // Get starting age based on Five Elements
    const startingAge = MAJOR_LIMIT_STARTING_AGES[fiveElements];
    if (!startingAge) {
      throw new Error(`Invalid Five Elements: ${fiveElements}`);
    }

    // Determine direction based on gender and yin/yang
    // Clockwise: Yang Male or Yin Female
    // Counter-clockwise: Yin Male or Yang Female
    const isClockwise =
      (gender === "male" && yinYang === "Yang") ||
      (gender === "female" && yinYang === "Yin");

      for (let i = 0; i < 12; i++) {
        let palaceIndex;
      
        if (isClockwise) {
          // Clockwise: move forward
          palaceIndex = (lifePalace - 1 + i) % 12;
        } else {
          // Counterclockwise: move backward
          palaceIndex = (lifePalace - 1 - i + 12) % 12;
        }
      
        const palace = this.chartData.palaces[palaceIndex];
            
        // Calculate age range
        const ageOffset = i * 10;
        palace.majorLimit = {
          startAge: startingAge + ageOffset,
          endAge: startingAge + ageOffset + 9,
        };
      }
      
    // Record the calculation step
    this.chartData.calculationSteps.step11 =
      `Major Limits calculated starting from age ${startingAge} (${fiveElements}), ` +
      `starting at Life Palace ${lifePalace}, ` +
      `moving ${isClockwise ? "clockwise" : "counter-clockwise"} ` +
      `for ${gender} with ${yinYang} polarity`;
  }

  /**
   * Step 12: Calculate Annual Flow (流年) positions
   * Starting from palace 1 with year 2013, going clockwise
   * Each palace represents one year in sequence
   */
  private step12(): void {
    // Get current year
    const currentYear = new Date().getFullYear();

    // Calculate the base year (2013) position in the current cycle
    const baseYear = 2013;
    const cycleLength = 12;

    // For each palace, calculate which year it represents in the current cycle
    for (let i = 0; i < 12; i++) {
      const palace = this.chartData.palaces[i];

      // Calculate the year for this palace position
      // Palace 1 (i=0) starts with 2013, then goes clockwise
      const yearOffset = i;
      const year = baseYear + yearOffset;

      // Calculate the actual year in the current cycle
      const yearsSinceBase = currentYear - baseYear;
      const cycleOffset =
        Math.floor(yearsSinceBase / cycleLength) * cycleLength;
      const actualYear = year + cycleOffset;

      // Calculate the Heavenly Stem and Earthly Branch for this year
      const stemIndex = (actualYear - 4) % 10; // 2013 is 癸 (9th stem)
      const branchIndex = (actualYear - 1) % 12; // 2013 is 巳 (5th branch)

      palace.annualFlow = {
        year: actualYear,
        heavenlyStem: HEAVENLY_STEMS[stemIndex],
        earthlyBranch: EARTHLY_BRANCHES[branchIndex],
      };
    }

    // Find which palace represents the current year
    const currentYearPalace = this.chartData.palaces.find(
      (palace) => palace.annualFlow?.year === currentYear
    );

    // Record the calculation step
    this.chartData.calculationSteps.step12 =
      `Annual Flow calculated for current year ${currentYear}. ` +
      `Current year is in palace ${currentYearPalace?.number ?? "unknown"}. ` +
      `Base cycle: 2013-2024, repeating every 12 years.`;
  }

  // Step 13: Calculate Self Influence (自化)
  // For each star in each palace, check if there is a match in FOUR_TRANSFORMATIONS by checking the star and the palace heavenly stem, if so, add selfInfluence: true
  private step13(): void {
    // Process each palace
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      const palace = this.chartData.palaces[i];
      const heavenlyStem = palace.heavenlyStem;

      // Get transformation rules for this palace's heavenly stem
      const transformations = FOUR_TRANSFORMATIONS[heavenlyStem];

      if (!transformations) {
        continue; // Skip if no transformation rules for this heavenly stem
      }

      // Create a map of transformation types to star names
      const transformationMap: Record<string, string> = {
        化科: transformations.科,
        化權: transformations.權,
        化祿: transformations.祿,
        化忌: transformations.忌,
      };

      // Check all stars in this palace
      const processStars = (stars: Star[] | undefined) => {
        if (!stars) return;

        stars.forEach((star) => {
          // Check each transformation type
          for (const [transformationType, starName] of Object.entries(
            transformationMap
          )) {
            if (star.name === starName) {
              // Initialize selfInfluence array if it doesn't exist
              if (!star.selfInfluence) {
                star.selfInfluence = [];
              }

              // Add the specific transformation type to selfInfluence
              star.selfInfluence.push(transformationType as Transformation);
            }
          }
        });
      };

      // Process all types of stars in the palace
      processStars(palace.mainStar);
      if (palace.bodyStar) processStars([palace.bodyStar]);
      if (palace.lifeStar) processStars([palace.lifeStar]);
      processStars(palace.minorStars);
      processStars(palace.auxiliaryStars);
      processStars(palace.yearStars);
      processStars(palace.monthStars);
      processStars(palace.dayStars);
      processStars(palace.hourStars);
    }

    // Record the calculation step
    this.chartData.calculationSteps.step13 =
      "Self Influence (自化) calculated for all stars based on their palace's Heavenly Stem";
  }

  // Step 14: Calculate Opposite Palace Influence
  // For each palace, find the opposite palace by checking the OPPOSITE_PALACE_INFLUENCE object, then check if that palace has a star that matches against this palace's heavenly stem in FOUR_TRANSFORMATIONS, if so add to oppositePalaceInfluence array
  private step14(): void {
    // Process each palace
    for (let i = 0; i < this.chartData.palaces.length; i++) {
      const palace = this.chartData.palaces[i];
      const palaceName = palace.name;
      const heavenlyStem = palace.heavenlyStem;

      // Get the opposite palace name
      const oppositePalaceName =
        OPPOSITE_PALACE_INFLUENCE[
          palaceName as keyof typeof OPPOSITE_PALACE_INFLUENCE
        ];

      if (!oppositePalaceName) {
        continue; // Skip if no opposite palace defined
      }

      // Find the opposite palace by name
      const oppositePalace = this.chartData.palaces.find(
        (p) => p.name === oppositePalaceName
      );

      if (!oppositePalace) {
        continue; // Skip if opposite palace not found
      }

      // Get transformation rules for this palace's heavenly stem
      const transformations = FOUR_TRANSFORMATIONS[heavenlyStem];

      if (!transformations) {
        continue; // Skip if no transformation rules for this heavenly stem
      }

      // Create a map of transformation types to star names
      const transformationMap: Record<string, string> = {
        化科: transformations.科,
        化權: transformations.權,
        化祿: transformations.祿,
        化忌: transformations.忌,
      };

      // Check all stars in the opposite palace
      const processStars = (
        stars: Star[] | undefined,
        sourcePalace: number
      ) => {
        if (!stars) return;

        stars.forEach((star) => {
          // Check each transformation type
          for (const [transformationType, starName] of Object.entries(
            transformationMap
          )) {
            if (star.name === starName) {
              // Initialize oppositePalaceInfluence array if it doesn't exist
              if (!palace.oppositePalaceInfluence) {
                palace.oppositePalaceInfluence = [];
              }

              // Add the influence to the current palace
              palace.oppositePalaceInfluence.push({
                starName: star.name,
                transformation: transformationType as Transformation,
                sourcePalace: sourcePalace,
              });
            }
          }
        });
      };

      // Process all types of stars in the opposite palace
      processStars(oppositePalace.mainStar, oppositePalace.number);
      if (oppositePalace.bodyStar)
        processStars([oppositePalace.bodyStar], oppositePalace.number);
      if (oppositePalace.lifeStar)
        processStars([oppositePalace.lifeStar], oppositePalace.number);
      processStars(oppositePalace.minorStars, oppositePalace.number);
      processStars(oppositePalace.auxiliaryStars, oppositePalace.number);
      processStars(oppositePalace.yearStars, oppositePalace.number);
      processStars(oppositePalace.monthStars, oppositePalace.number);
      processStars(oppositePalace.dayStars, oppositePalace.number);
      processStars(oppositePalace.hourStars, oppositePalace.number);
    }

    // Record the calculation step
    this.chartData.calculationSteps.step14 =
      "Opposite Palace Influence calculated for all palaces based on opposite palace stars and current palace Heavenly Stem";
  }
}
