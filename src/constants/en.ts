/* Zi Wei Dou Shu - Constants (Pinyin) */

// Yin Yang
export const YinYang = ["Yang", "Yin"];

// Tian Gan (Heavenly Stems)
export const HeavenlyStems = [
  "Jia", "Yi", "Bing", "Ding", "Wu", "Ji", "Geng", "Xin", "Ren", "Gui"
];

// Di Zhi (Earthly Branches)
export const EarthlyBranches = [
  "Zi", "Chou", "Yin", "Mao", "Chen", "Si", "Wu", "Wei", "Shen", "You", "Xu", "Hai"
];

// Shengxiao (Chinese Zodiac)
export const ShengXiaoGB = [
  "Shu", "Niu", "Hu", "Tu", "Long", "She", "Ma", "Yang", "Hou", "Ji", "Gou", "Zhu"
];

// 12 Gong Wei (12 Palaces)
export const Palace = [
  "【Ming Gong】", "【Fu Mu Gong】", "【Fu De Gong】", "【Tian Zhai Gong】",
  "【Guan Lu Gong】", "【Jiao You Gong】", "【Qian Yi Gong】", "【Ji E Gong】",
  "【Cai Bo Gong】", "【Zi Nu Gong】", "【Fu Qi Gong】", "【Xiong Di Gong】",
  "【Shen】"
];

// Wu Xing Ju (Five Element Cycles)
export const FiveElements = ["Shui Er Ju", "Huo Liu Ju", "Tu Wu Ju", "Mu San Ju", "Jin Si Ju"];

// Da Xian (Major Fate Cycle)
export const DaShian = [2, 6, 5, 3, 4];

/* ⭐ Xing Yao (Stars) */
export const StarM_A14 = [
  "Zi Wei", "Tian Ji", "Tai Yang", "Wu Qu", "Tian Tong", "Lian Zhen", "Tian Fu", "Tai Yin",
  "Tan Lang", "Ju Men", "Tian Xiang", "Tian Liang", "Qi Sha", "Po Jun"
];

export const StarM_A07 = ["Wen Chang", "Wen Qu", "Zuo Fu", "You Bi", "Tian Kui", "Tian Yue", "Lu Cun"];
export const StarM_S04 = ["Hua Lu", "Hua Quan", "Hua Ke", "Hua Ji"];
export const StarM_B06 = ["Qing Yang", "Tuo Luo", "Huo Xing", "Ling Xing", "Tian Kong", "Di Jie"];
export const StarO_S05 = ["Tian Ma", "Long Chi", "Feng Ge", "Hong Luan", "Tian Xi"];

/* 🔢 Wu Xing Ju Qi Pan Biao */
export const FiveEleTable = [
  [1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 0, 0, 1, 1, 2, 2, 3, 3, 4],
  [9, 6, 11, 4, 1, 2, 10, 7, 0, 5, 2, 3, 11, 8, 1, 6, 3, 4, 0, 9, 2, 7, 4, 5, 1, 10, 3, 8, 5, 6],
  [6, 11, 4, 1, 2, 7, 0, 5, 2, 3, 8, 1, 6, 3, 4, 9, 2, 7, 4, 5, 10, 3, 8, 5, 6, 11, 4, 9, 6, 7],
  [4, 1, 2, 5, 2, 3, 6, 3, 4, 7, 4, 5, 8, 5, 6, 9, 6, 7, 10, 7, 8, 11, 8, 9, 0, 9, 10, 1, 10, 11],
  [11, 4, 1, 2, 0, 5, 2, 3, 1, 6, 3, 4, 2, 7, 4, 5, 3, 8, 5, 6, 4, 9, 6, 7, 5, 10, 7, 8, 6, 11]
];

export const FiveEleArr = [
  [0, 1, 3, 2, 4, 1],
  [1, 2, 4, 3, 0, 2],
  [2, 3, 0, 4, 1, 3],
  [3, 4, 1, 0, 2, 4],
  [4, 0, 2, 1, 3, 0]
];

/* Nian Zhu (Year Stem and Branch) */
export const year_to_stem_branch: Record<number, string> = {
  1900: "Geng Zi", 1901: "Xin Chou", 1902: "Ren Yin", 1903: "Gui Mao", 1904: "Jia Chen",
  1905: "Yi Si", 1906: "Bing Wu", 1907: "Ding Wei", 1908: "Wu Shen", 1909: "Ji You",
  1910: "Geng Xu", 1911: "Xin Hai", 1912: "Ren Zi", 1913: "Gui Chou", 1914: "Jia Yin",
  1915: "Yi Mao", 1916: "Bing Chen", 1917: "Ding Si", 1918: "Wu Wu", 1919: "Ji Wei",
  1920: "Geng Shen", 1921: "Xin You", 1922: "Ren Xu", 1923: "Gui Hai", 1924: "Jia Zi",
  1925: "Yi Chou", 1926: "Bing Yin", 1927: "Ding Mao", 1928: "Wu Chen", 1929: "Ji Si",
  1930: "Geng Wu", 1931: "Xin Wei", 1932: "Ren Shen", 1933: "Gui You", 1934: "Jia Xu",
  1935: "Yi Hai", 1936: "Bing Zi", 1937: "Ding Chou", 1938: "Wu Yin", 1939: "Ji Mao",
  1940: "Geng Chen", 1941: "Xin Si", 1942: "Ren Wu", 1943: "Gui Wei", 1944: "Jia Shen",
  1945: "Yi You", 1946: "Bing Xu", 1947: "Ding Hai", 1948: "Wu Zi", 1949: "Ji Chou",
  1950: "Geng Yin", 1951: "Xin Mao", 1952: "Ren Chen", 1953: "Gui Si", 1954: "Jia Wu",
  2000: "Geng Chen", 2001: "Xin Si", 2002: "Ren Wu", 2003: "Gui Wei", 2020: "Geng Zi",
  2021: "Xin Chou", 2022: "Ren Yin", 2023: "Gui Mao", 2024: "Jia Chen", 2025: "Yi Si"
};
