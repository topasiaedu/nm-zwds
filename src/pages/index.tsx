/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { ChartForm } from "../components/ChartForm";
import { ChartDisplay } from "../components/ChartDisplay";
import { BirthInfo, ChartOptions } from "../types/star";
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  useEffect(() => {
    // Log for debugging
    console.log("DashboardPage mounted");
  }, []);

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

  // Log when rendering
  console.log("DashboardPage rendering");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      
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
      
      {/* Test Button for Page Transition */}
      <div className="mt-6 text-center">
        <Link to="/test">
          <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300">
            Test Page Transition
          </button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardPage;
