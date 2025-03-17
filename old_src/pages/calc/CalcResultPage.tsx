import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";
import { useProfileContext } from "../../context/ProfileContext";
import NavbarSidebarLayout from "../../layouts/navbar-sidebar";
import LoadingPage from "../pages/loading";
import { useParams } from "react-router-dom";
import ZiweiChart from '../../components/ziwei/ZiweiChart';
import { ziweiCalculator } from '../../utils/ziweiCalculator';

const CalcResultPage: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { loading, currentProfile } = useProfileContext();
  const { calcType } = useParams();
  const [chartData, setChartData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle profile validation and navigation
  useEffect(() => {
    if (!currentProfile) {
      navigate("/");
      return;
    }

    const birthdayString = currentProfile?.birthday ?? "";
    const date = birthdayString ? new Date(birthdayString) : null;

    if (!date || isNaN(date.getTime())) {
      console.error("Invalid birthday format in profile.");
      navigate("/");
      return;
    }
  }, [currentProfile, navigate]);

  // Handle chart data calculation
  useEffect(() => {
    const loadProfile = async () => {
      if (!currentProfile) return;
      
      try {
        const birthDate = new Date(currentProfile.birthday);
        const chartData = ziweiCalculator.computeZiWei(
          birthDate.getFullYear(),
          birthDate.getMonth() + 1,
          birthDate.getDate(),
          currentProfile.birth_time || "00",
          currentProfile.gender === 'male' ? 'M' : 'F',
          currentProfile.name || "Unknown"
        );

        console.log("Chart Data:", chartData);
        setChartData(chartData);
        setError(null);
      } catch (err) {
        console.error("Error calculating chart:", err);
        setError("Error calculating chart. Please check your birth information.");
      }
    };

    loadProfile();
  }, [currentProfile]);

  if (loading) {
    return <LoadingPage />;
  }

  if (error) {
    return (
      <NavbarSidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="text-red-600">{error}</div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  if (!chartData) {
    return (
      <NavbarSidebarLayout>
        <div className="flex items-center justify-center h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  return (
    <NavbarSidebarLayout>
      <div className="container mx-auto px-4 py-8">
        <ZiweiChart 
          palaces={chartData.palaces}
          daShian={Object.values(chartData.centerInfo.daShian)}
          siaoShian={Array(12).fill("").map((_, i) => {
            const base = i * 12;
            return `${base + 1},${base + 2},${base + 3},${base + 4},${base + 5},${base + 6} ...`;
          })}
          centerInfo={{
            name: chartData.centerInfo.name,
            gender: chartData.centerInfo.yinYangGender,
            birthDate: chartData.centerInfo.lunarDate,
            solarDate: chartData.centerInfo.solarDate,
            shengXiao: chartData.centerInfo.zodiac,
            fiveElement: chartData.centerInfo.fiveElement
          }}
        />
      </div>
    </NavbarSidebarLayout>
  );
};

export default CalcResultPage;
