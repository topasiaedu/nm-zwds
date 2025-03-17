import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Card } from 'flowbite-react';
import { Palace } from '../../utils/ziweiTypes';
import './ZiweiChart.css';

interface ZiweiChartProps {
  chartData: {
    palaces: Palace[];
    centerInfo: {
      name: string;
      age: number;
      solarDate: string;
      lunarDate: string;
      zodiac: string;
      fiveElement: string;
      yinYangGender: string;
      daShian: { [key: number]: string };
    };
  };
}

interface Props {
  palaces: Palace[];
  daShian: string[];
  siaoShian: string[];
  centerInfo: {
    name: string;
    gender: string;
    birthDate: string;
    solarDate: string;
    shengXiao: string;
    fiveElement: string;
  };
}

// Chinese palace names
const zhPalaceNames = [
  "【命宮】", "【父母宮】", "【福德宮】", "【田宅宮】",
  "【官祿宮】", "【交友宮】", "【遷移宮】", "【疾厄宮】",
  "【財帛宮】", "【子女宮】", "【夫妻宮】", "【兄弟宮】",
  "【身】"  // This is used for MangC (body palace indicator)
];

const ZiweiChart: React.FC<Props> = ({ palaces, daShian, siaoShian, centerInfo }) => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();
  const startPalaceIndex = 6; // 財帛宮 (2025)
  const yearOffset = (currentYear - 2025) % 12;
  const flowYearPalaceIndex = (startPalaceIndex + yearOffset) % 12;

  // Calculate starting age for DaShian based on birth year
  const birthYear = parseInt(centerInfo.solarDate.split('年')[0]);
  const startAge = (birthYear % 2 === 0) ? 10 : 9;
  
  // Calculate DaShian ranges for each palace
  const calculateDaShian = (palaceIndex: number): string => {
    const baseAge = startAge + (palaceIndex * 10);
    return `${baseAge} - ${baseAge + 9}`;
  };

  const calculateYearlyPeriods = (palaceIndex: number): string => {
    const base = palaceIndex + 1;
    const periods = Array.from({ length: 6 }, (_, i) => base + i * 12);
    return `${periods.join(',')} ...`;
  };

  const renderStarGroup = (stars: string[], includeTransformation: boolean = false) => {
    return stars.map((star, index) => {
      const cleanStar = star.replace(/<br\/?>/g, "");
      const hasTransformation = cleanStar.includes("⟲");
      
      return (
        <div key={`${cleanStar}-${index}`}>
          <span className={includeTransformation ? "blue-star" : ""}>
            {cleanStar}
          </span>
          {hasTransformation && <div className="Star4"><span>b</span></div>}
        </div>
      );
    });
  };

  const renderPalace = (index: number, palace: Palace) => {
    const palaceName = zhPalaceNames[(12 - index) % 12];

    return (
      <div key={index} id={`zw${index + 1}`} className="palace">
        <div className="MangA" dangerouslySetInnerHTML={{ __html: palace.MangA }} />
        <div className="MangB">{palaceName}</div>
        {palace.MangC && <div className="MangC">【身】</div>}
        
        <div className="StarA">
          {renderStarGroup(palace.StarA, true)}
          {palace.Star6.length > 0 && renderStarGroup(palace.Star6)}
        </div>
        
        <div className="StarB">
          {renderStarGroup(palace.StarB)}
        </div>
        
        <div className="StarC">
          {renderStarGroup(palace.StarC)}
        </div>
        
        <div className="MangY10">{daShian[index + 1]}</div>
        <div className="MangY1">{calculateYearlyPeriods(index)}</div>

        {index === flowYearPalaceIndex && (
          <div className="liunianTag">流<br/>年</div>
        )}

        {index === 3 && (
          <div className="daYunTag">大<br/>限</div>
        )}

        <div className="debug-info">
          <div>宮位 {index + 1}</div>
          <div>大限: {calculateDaShian(index)}</div>
          <div>StarA: {palace.StarA.join(", ")}</div>
          <div>Star6: {palace.Star6.join(", ")}</div>
          <div>StarB: {palace.StarB.join(", ")}</div>
          <div>StarC: {palace.StarC.join(", ")}</div>
        </div>
      </div>
    );
  };

  return (
    <Card className="ziwei-chart-container">
      <div className="ziwei">
        {palaces.map((palace, index) => renderPalace(index, palace))}
        <div className="zwDivCenter">
          <div>{`${t("name")}: ${centerInfo.name}`}</div>
          <div>{`${t("gender")}: ${centerInfo.gender}`}</div>
          <div>{`${t("birthDate")}: ${centerInfo.birthDate}`}</div>
          <div>{`${t("solarDate")}: ${centerInfo.solarDate}`}</div>
          <div>{`${t("shengXiao")}: ${centerInfo.shengXiao}`}</div>
          <div>{`${t("fiveElement")}: ${centerInfo.fiveElement}`}</div>
          
          <div className="debug-info mt-4">
            <div>大限分佈:</div>
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i + 1}>宮位 {i + 1}: {calculateDaShian(i)}</div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ZiweiChart; 