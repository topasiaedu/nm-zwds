import React from "react";
import { ChartOptions } from "../types/star";

interface ChartDisplayProps {
  chartOptions: ChartOptions;
}

export const ChartDisplay: React.FC<ChartDisplayProps> = ({
  chartOptions
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="bg-white/5 dark:bg-black/5 
                    rounded-xl border border-white/10 dark:border-white/5
                    aspect-square lg:aspect-auto lg:h-full
                    flex items-center justify-center">
        {/* Placeholder for actual chart implementation */}
        <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
          Chart will be displayed here
        </span>
      </div>
    </div>
  );
}; 