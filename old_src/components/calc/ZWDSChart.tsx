import React, { useEffect, useState } from "react";
// import { useLanguage } from "../../context/LanguageContext";
// import { useProfileContext } from "../../context/ProfileContext";
// import { useNavigate } from "react-router-dom";

// // 🔹 Importing constants & astrology data
// import {
//   YinYang,
//   HeavenlyStems,
//   ShengXiaoGB,
//   EarthlyBranches,
//   FiveElements,
//   year_to_stem_branch,
//   Star_A14,
//   Star_Z06,
//   Star_T08,
//   Star_G07,
//   Star_S04,
//   Star_B06,
//   Star_OS5,
// } from "./constants";
// import { Lunar } from "./Lunar";

// const ZiWeiDouShu: React.FC = () => {
//   const { t } = useLanguage();
//   const { loading, currentProfile } = useProfileContext();
//   const navigate = useNavigate();

//   const [data, setData] = useState({
//     name: "",
//     age: 0,
//     solarCalendar: "",
//     lunarCalendar: "",
//     zodiac: "",
//     fiveElement: "",
//     yinYangGender: "",
//     zw: Array(12).fill({
//       MangA: "",
//       MangB: "",
//       MangC: "",
//       StarAll: "",
//       StarA: [],
//       StarB: [],
//       StarC: [],
//       Star6: [],
//     }),
//   });

//   // 🔹 Convert Solar to Lunar Date
//   const convertToLunar = (year: number, month: number, day: number) => {
//     const lunarDate = new Lunar(0, year, month, day); // Uses Lunar.js for conversion
//     return lunarDate;
//   };

//   // 🔹 Compute Zodiac & Elements
//   const getSolarDay = (year: number, month: number, day: number, hour: string) => {
//     return `${year} ${t("year")} ${month} ${t("month")} ${day} ${t("day")} ${hour} ${t("hour")}`;
//   };

//   const getLunarDay = (lunar: any) => {
//     return `${lunar.y} ${t("year")} ${lunar.m} ${t("month")} ${lunar.d} ${t("day")}`;
//   };

//   const getShengXiao = (year: number) => ShengXiaoGB[(year - 4) % 12];

//   const getFiveElement = (year: number) => FiveElements[year % 5];

//   const getYinYangGender = (year: number, gender: string) => {
//     return `${YinYang[year % 2]} ${gender === "M" ? t("male") : t("female")}`;
//   };

//   // 🔹 Compute Zi Wei Dou Shu Chart
//   const computeZiWei = (year: number, month: number, day: number, hour: number, gender: string) => {
//     // Step 1: Convert to Lunar
//     const lunar = convertToLunar(year, month, day);

//     // Step 2: Compute Stems & Branches
//     const yStemIndex = (year - 4) % 10;
//     const yBranchIndex = (year - 4) % 12;
//     const hBranchIndex = hour % 12;

//     // Step 3: Compute Main Stars & Houses
//     const palaceStars = Array(12).fill({
//       MangA: "",
//       MangB: "",
//       MangC: "",
//       StarAll: "",
//       StarA: [],
//       StarB: [],
//       StarC: [],
//       Star6: [],
//     });

//     for (let i = 0; i < 12; i++) {
//       palaceStars[i] = {
//         MangA: `${HeavenlyStems[(yStemIndex % 5) * 2 + ((i < 2 ? i + 2 : i) % 10)]}<br/>${EarthlyBranches[i]}`,
//         MangB: EarthlyBranches[(12 - hBranchIndex + i) % 12],
//         MangC: "",
//         StarAll: "",
//         StarA: Star_A14[i] || [],
//         StarB: Star_B06[i] || [],
//         StarC: Star_OS5[i] || [],
//         Star6: Star_G07[i] || [],
//       };
//     }

//     return palaceStars;
//   };

//   // 🔹 Effect Hook to Compute Chart on Load
//   useEffect(() => {
//     if (loading) return;

//     const birthdayString = currentProfile?.birthday ?? "";
//     const date = birthdayString ? new Date(birthdayString) : null;

//     if (!date || isNaN(date.getTime())) {
//       console.error("Invalid birthday format in profile.");
//       navigate("/");
//       return;
//     }

//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const day = date.getDate();
//     const hour = currentProfile?.birth_time ? parseInt(currentProfile.birth_time) : 0;
//     const gender = currentProfile?.gender || "unknown";
//     const name = currentProfile?.name || "Unknown";

//     const age = new Date().getFullYear() - year;

//     // Compute Zi Wei chart
//     const zw = computeZiWei(year, month, day, hour, gender);

//     setData({
//       name,
//       age,
//       solarCalendar: getSolarDay(year, month, day, hour.toString()),
//       lunarCalendar: getLunarDay(convertToLunar(year, month, day)),
//       zodiac: `【${getShengXiao(year)}】【${year_to_stem_branch[year] || ""}】`,
//       fiveElement: getFiveElement(year),
//       yinYangGender: getYinYangGender(year, gender),
//       zw,
//     });
//   }, [loading, currentProfile, navigate]);

//   const handlePalaceClick = (index: number) => {
//     console.log(`Clicked palace ${index}`);
//   };

//   return (
//     <div id="container" className="ziwei">
//       <div id="zwHome" className="zwDivCenter">
//         <div>{t("name")}: {data.name}</div>
//         <div>{t("age")}: {data.age}</div>
//         <div>{t("solarCalendar")}: {data.solarCalendar}</div>
//         <div>{t("lunarCalendar")}: {data.lunarCalendar}</div>
//         <div>{t("zodiac")}: {data.zodiac}</div>
//         <div>{t("fiveElement")}: {data.fiveElement}</div>
//         <div>{t("yinYangGender")}: {data.yinYangGender}</div>
//       </div>

//       {/* Render all 12 palaces */}
//       {data.zw.map((palace, index) => (
//         <div key={index} id={`zw${index + 1}`} onClick={() => handlePalaceClick(index + 1)}>
//           <div className="MangA">{palace.MangA}</div>
//           <div className="MangB">{palace.MangB}</div>
//           <div className="MangC">{palace.MangC}</div>
//           <div className="StarAll">{palace.StarAll}</div>
//           <div className="StarA">{palace.StarA.join(" ")}</div>
//           <div className="StarB">{palace.StarB.join(" ")}</div>
//           <div className="StarC">{palace.StarC.join(" ")}</div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default ZiWeiDouShu;

// Create test component
const TestComponent = () => {
  return <div>Test Component</div>;
};

