export interface Palace {
  name: string;
  MangA: string;
  MangB: string;
  MangC: string;
  StarA: string[];
  StarB: string[];
  StarC: string[];
  Star6: string[];
  MangY10: string;
  MangY1: string;
  StarAll?: string[];
  daShian: string;
}

export interface ZiweiData {
  palaces: Palace[];
  centerInfo: {
    name: string;
    age: number;
    solarDate: string;
    lunarDate: string;
    zodiac: string;
    fiveElement: string;
    yinYangGender: string;
    daShian: string[];
  };
}

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

export interface StarPositions {
  s14: string[];
  sZ06: string[];
  sT08: string[];
  sG07: string[];
  sS04: string[];
  sB06: string[];
}

export interface ZiweiState {
  y: string;
  m: number;
  d: number;
  h: string;
  g: "M" | "F";
  l: string;
  b: string;
  f: string;
  s4: string[];
  z: string;
  yS: number;
  mS: number;
  dS: number;
  LunarDay: string;
  ShengXiao: string;
  y1Pos: number;
  y2Pos: number;
  hPos: number;
  lPos: number;
  bPos: number;
  zPos: number;
  palaces: Palace[];
}

export interface StarArrays {
  StarA: string[];    // Main stars
  Star6: string[];    // Secondary stars
  StarB: string[];    // Additional stars
  StarC: string[];    // More stars
}

export type Gender = "M" | "F";
export type Language = 'zh' | 'en';

// Palace names array (not type)
export const PalaceNames = [
  "【命宮】",
  "【父母宮】",
  "【福德宮】",
  "【田宅宮】",
  "【官祿宮】",
  "【交友宮】",
  "【遷移宮】",
  "【疾厄宮】",
  "【財帛宮】",
  "【子女宮】",
  "【夫妻宮】",
  "【兄弟宮】",
  "【身】"
];

// Star arrays (not types)
export const StarM_A14 = [
  "紫微", "天機", "太陽", "武曲", "天同", "廉貞", "天府", "太陰",
  "貪狼", "巨門", "天相", "天梁", "七殺", "破軍"
];

export const StarM_A07 = ["文昌", "文曲", "左輔", "右弼", "天魁", "天鉞", "祿存"];
export const StarM_S04 = ["化祿", "化權", "化科", "化忌"];
export const StarM_B06 = ["擎羊", "陀羅", "火星", "鈴星", "天空", "地劫"];
export const StarO_S05 = ["天馬", "龍池", "鳳閣", "紅鸞", "天喜"];

// Star position arrays with actual data
export const Star_A14: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  // ... Add the rest of the data from the original implementation
];

export const Star_Z06: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8],
  [8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7],
  [7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5, 6],
  [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
  [4, 3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5]
];

export const Star_T08: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
  [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
  [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
  [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
  [5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4],
  [6, 7, 8, 9, 10, 11, 0, 1, 2, 3, 4, 5],
  [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
];

export const Star_G07: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  // ... Add the rest of the data from the original implementation
];

export const Star_S04: string[][] = [
  ["化祿", "化權", "化科", "化忌"],
  // ... Add the rest of the data from the original implementation
];

export const Star_B06: number[][][] = [
  [[3, 4, 6, 7, 6, 7, 9, 10, 0, 1]],
  [[1, 2, 4, 5, 4, 5, 7, 8, 10, 11]],
  [
    [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1],
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 0],
    [9, 10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8]
  ],
  [
    [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [3, 4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2],
    [10, 11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  ],
  [[11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]],
  [[11, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]]
];

export const Star_OS5: number[][] = [
  [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5],
  [4, 5, 6, 7, 8, 9, 10, 11, 0, 1, 2, 3],
  [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11],
  [3, 2, 1, 0, 11, 10, 9, 8, 7, 6, 5, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 11, 10]
];

// Basic arrays
export const YinYang = ["陽", "陰"];
export const HeavenlyStems = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"
];
export const EarthlyBranches = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
];
export const ShengXiaoGB = [
  "鼠", "牛", "虎", "兔", "龍", "蛇", "馬", "羊", "猴", "雞", "狗", "豬"
];
export const GanGB = [
  "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"
];
export const ZhiGB = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
];
export const FiveElements = ["水二局", "火六局", "土五局", "木三局", "金四局"];

// Five elements arrays
export const FiveEleArr: number[][] = [
  [0, 1, 3, 2, 4, 1],
  [1, 2, 4, 3, 0, 2],
  [2, 3, 0, 4, 1, 3],
  [3, 4, 1, 0, 2, 4],
  [4, 0, 2, 1, 3, 0]
];

export const FiveEleTable: number[][] = [
  [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0, 1, 1, 2, 2, 3, 3, 4],
  [9, 6, 11, 4, 1, 2, 10, 7, 0, 5, 2, 3, 11, 8, 1, 6, 3, 4, 0, 9, 2, 7, 4, 5, 1, 10, 3, 8, 5, 6],
  [6, 11, 4, 1, 2, 7, 0, 5, 2, 3, 8, 1, 6, 3, 4, 9, 2, 7, 4, 5, 10, 3, 8, 5, 6, 11, 4, 9, 6, 7],
  [4, 1, 2, 5, 2, 3, 6, 3, 4, 7, 4, 5, 8, 5, 6, 9, 6, 7, 10, 7, 8, 11, 8, 9, 0, 9, 10, 1, 10, 11],
  [11, 4, 1, 2, 0, 5, 2, 3, 1, 6, 3, 4, 2, 7, 4, 5, 3, 8, 5, 6, 4, 9, 6, 7, 5, 10, 7, 8, 6, 11]
]; 