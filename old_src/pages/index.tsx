/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import { Card } from "flowbite-react";
import { MainLayout } from "../layouts/MainLayout";
import { ChartForm } from "../components/ChartForm";
import { ChartDisplay } from "../components/ChartDisplay";
import { BirthInfo, ChartOptions } from "../types/star";

const DashboardPage: React.FC = () => {
  const [birthInfo, setBirthInfo] = useState<BirthInfo>({
    date: "",
    time: "",
    location: ""
  });

  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    showPalaceNames: false,
    displayStarRatings: false
  });

  const handleBirthInfoChange = (info: Partial<BirthInfo>) => {
    setBirthInfo(prev => ({ ...prev, ...info }));
  };

  const handleChartOptionsChange = (options: Partial<ChartOptions>) => {
    setChartOptions(prev => ({ ...prev, ...options }));
  };

  const handleGenerateChart = () => {
    // TODO: Implement chart generation logic
    console.log("Generating chart with:", { birthInfo, chartOptions });
  };

  return (
    <MainLayout>
      <Card className="relative z-10 rounded-2xl shadow-2xl 
                     border border-white/10
                     backdrop-filter backdrop-blur-2xl 
                     bg-white/10 hover:bg-white/15 
                     dark:bg-black/10 dark:hover:bg-black/20 
                     transition-all duration-300
                     w-full max-w-[1095px] mx-auto
                     h-auto lg:h-[841.5px]">
        <div className="p-4 sm:p-6 lg:p-8 relative h-full">     
          <div className="grid lg:grid-cols-2 gap-6 h-full">
            {/* Left Column - Chart */}
            <ChartDisplay chartOptions={chartOptions} />

            {/* Right Column - Form */}
            <ChartForm 
              birthInfo={birthInfo}
              chartOptions={chartOptions}
              onBirthInfoChange={handleBirthInfoChange}
              onChartOptionsChange={handleChartOptionsChange}
              onSubmit={handleGenerateChart}
            />
          </div>
        </div>
      </Card>
    </MainLayout>
  );
};

export default DashboardPage;
