export const NORTHERN_MAIN_STARS = new Set(["紫微", "天机", "太阳", "武曲", "天同", "廉贞"]);
export const SOUTHERN_MAIN_STARS = new Set(["天府", "太阴", "贪狼", "巨门", "天相", "天梁", "七杀", "破军"]);

export function classifyMainStar(name: string): "north" | "south" | "aux" {
  if (NORTHERN_MAIN_STARS.has(name)) return "north";
  if (SOUTHERN_MAIN_STARS.has(name)) return "south";
  return "aux";
}

export const BRANCH_TO_AREA: Record<string, string> = {
  "巳": "p_si",   "午": "p_wu",   "未": "p_wei",  "申": "p_shen",
  "辰": "p_chen",                                  "酉": "p_you",
  "卯": "p_mao",                                   "戌": "p_xu",
  "寅": "p_yin",  "丑": "p_chou", "子": "p_zi",   "亥": "p_hai",
};

export const PALACE_ENGLISH: Record<string, string> = {
  "命宫": "Life Palace",
  "兄弟": "Siblings Palace",
  "夫妻": "Spouse Palace",
  "子女": "Children Palace",
  "财帛": "Wealth Palace",
  "疾厄": "Health Palace",
  "迁移": "Travel Palace",
  "交友": "Friends Palace",
  "官禄": "Career Palace",
  "田宅": "Property Palace",
  "福德": "Happiness Palace",
  "父母": "Parents Palace",
};

/** Plain-English labels for who each relationship palace covers (Ch 03 stats). */
export const PEOPLE_PALACE_COVERS: Record<string, string> = {
  "兄弟": "Peers & siblings",
  "夫妻": "Spouse & partner",
  "交友": "Friends & allies",
  "父母": "Parents, mentors & bosses",
  "子女": "Children & people you develop",
};

export const TRANSFORMATION_ENGLISH: Record<string, string> = {
  "化禄": "Hua Lu",
  "化祿": "Hua Lu",
  "化权": "Hua Quan",
  "化權": "Hua Quan",
  "化科": "Hua Ke",
  "化忌": "Hua Ji",
};

export const C = {
  navy:      "#1a1e3f",
  navyMid:   "#252a5c",
  navyDeep:  "#0f1230",
  coral:     "#e8642d",
  coralDark: "#c4501e",
  gold:      "#c9873a",
  cream:     "#fdf6ee",
  border:    "#e8ddd0",
  white:     "#ffffff",
  muted:     "#7a6e65",
} as const;
