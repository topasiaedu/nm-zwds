import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import ZWDSChart from "../components/ZWDSChart";
import { ZWDSCalculator } from "../utils/zwds/calculator";
import { ChartInput, ChartData } from "../utils/zwds/types";
import { AlertProvider } from "../context/AlertContext";
import { AuthProvider } from "../context/AuthContext";
import { TierProvider } from "../context/TierContext";
import { ProfileProvider } from "../context/ProfileContext";
import { LanguageProvider } from "../context/LanguageContext";
import { SidebarProvider } from "../context/SidebarContext";
import { ChartSettingsProvider } from "../context/ChartSettingsContext";

/**
 * ChartOnly component for backend screenshot generation
 * Accepts profile data through URL parameters and renders only the ZWDS chart
 */
const ChartOnly: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // Tracks which palace should have Da Ming (大命) tags initially
  const [selectedDaXianPalace, setSelectedDaXianPalace] = useState<number | null>(null);

  useEffect(() => {
    // Force light mode globally on this route regardless of user/system preference
    try {
      const root = window.document.documentElement;
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } catch {
      // no-op if localStorage is inaccessible
    }

    const generateChart = () => {
      try {
        // Extract profile data from URL parameters
        const year = parseInt(searchParams.get("year") || "");
        const month = parseInt(searchParams.get("month") || "");
        const day = parseInt(searchParams.get("day") || "");
        const hour = parseInt(searchParams.get("hour") || "");
        const gender = searchParams.get("gender") as "male" | "female";
        const name = searchParams.get("name") || "Unknown";
        const damingParam = (searchParams.get("daming") || "").toLowerCase();
        const enableDaming = damingParam === "true" || damingParam === "1" || damingParam === "yes";

        // Validate required parameters
        if (!year || !month || !day || !hour || !gender) {
          throw new Error("Missing required parameters: year, month, day, hour, gender");
        }

        // Validate parameter ranges
        if (year < 1900 || year > 2100) {
          throw new Error("Year must be between 1900 and 2100");
        }
        if (month < 1 || month > 12) {
          throw new Error("Month must be between 1 and 12");
        }
        if (day < 1 || day > 31) {
          throw new Error("Day must be between 1 and 31");
        }
        if (hour < 0 || hour > 23) {
          throw new Error("Hour must be between 0 and 23");
        }
        if (gender !== "male" && gender !== "female") {
          throw new Error("Gender must be 'male' or 'female'");
        }

        // Create chart input
        const chartInput: ChartInput = {
          year,
          month,
          day,
          hour,
          gender,
          name,
        };

        // Calculate chart data
        const calculator = new ZWDSCalculator(chartInput);
        const calculatedChartData = calculator.calculate();

        // If daming is enabled, auto-select the current Da Xian palace based on real age
        if (enableDaming) {
          try {
            /**
             * Compute current age using lunar birth year to match chart logic:
             * age = currentYear - birthYear + 1
             */
            const birthYear: number = calculatedChartData.lunarDate.year;
            const currentYear: number = new Date().getFullYear();
            const currentAge: number = currentYear - birthYear + 1;

            // Find the palace whose major limit range includes the current age
            const currentDaXian = calculatedChartData.palaces.find(p => {
              return Boolean(
                p.majorLimit &&
                currentAge >= p.majorLimit.startAge &&
                currentAge <= p.majorLimit.endAge
              );
            });

            if (currentDaXian && typeof currentDaXian.number === "number") {
              setSelectedDaXianPalace(currentDaXian.number);
            } else {
              setSelectedDaXianPalace(null);
            }
          } catch {
            setSelectedDaXianPalace(null);
          }
        } else {
          setSelectedDaXianPalace(null);
        }

        setChartData(calculatedChartData);
        setLoading(false);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
        setError(errorMessage);
        setLoading(false);
      }
    };

    generateChart();
  }, [searchParams]);

  // Show loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-gray-800 text-lg">Generating chart...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="text-red-600 text-lg text-center max-w-md">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <p className="text-sm text-gray-600 mt-2">
            Required URL parameters: year, month, day, hour, gender, name
          </p>
        </div>
      </div>
    );
  }

  // Show chart
  if (chartData) {
    return (
      <div className="w-full h-screen bg-white flex items-center justify-center">
        <div className="w-[900px] h-[900px] flex items-center justify-center">
          <ZWDSChart
            chartData={chartData}
            // Do not simulate age; use the real age logic only
            selectedDaXianPalace={selectedDaXianPalace === null ? undefined : selectedDaXianPalace}
            disableInteraction={true}
            isPdfExport={true}
          />
        </div>
      </div>
    );
  }

  return null;
};

/**
 * Wrapper component that provides all necessary contexts
 */
const ChartOnlyWithProviders: React.FC = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <TierProvider>
          <ProfileProvider>
            <LanguageProvider>
              <SidebarProvider>
                <ChartSettingsProvider defaultPageType="result">
                  <ChartOnly />
                </ChartSettingsProvider>
              </SidebarProvider>
            </LanguageProvider>
          </ProfileProvider>
        </TierProvider>
      </AuthProvider>
    </AlertProvider>
  );
};

export default ChartOnlyWithProviders; 