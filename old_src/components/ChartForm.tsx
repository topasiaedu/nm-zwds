import React from "react";
import { BirthInfo, ChartOptions } from "../types/star";

interface ChartFormProps {
  birthInfo: BirthInfo;
  chartOptions: ChartOptions;
  onBirthInfoChange: (info: Partial<BirthInfo>) => void;
  onChartOptionsChange: (options: Partial<ChartOptions>) => void;
  onSubmit: () => void;
}

export const ChartForm: React.FC<ChartFormProps> = ({
  birthInfo,
  chartOptions,
  onBirthInfoChange,
  onChartOptionsChange,
  onSubmit
}) => {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400">
          紫微斗数 Insights
        </span>
      </h2>
      
      <p className="text-sm sm:text-base text-gray-700 dark:text-gray-200">
        Explore the metaphysical wisdom of 紫微斗数 and uncover your destiny through the stars.
      </p>

      <div className="flex-1 mt-6 space-y-6">
        <div className="bg-white/5 dark:bg-black/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Birth Information</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Date</label>
                <input 
                  type="date" 
                  value={birthInfo.date}
                  onChange={(e) => onBirthInfoChange({ date: e.target.value })}
                  className="w-full bg-white/10 dark:bg-black/10 
                           border border-white/20 dark:border-white/10 
                           rounded-lg px-3 py-2 text-sm
                           text-gray-800 dark:text-white" 
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Time</label>
                <input 
                  type="time" 
                  value={birthInfo.time}
                  onChange={(e) => onBirthInfoChange({ time: e.target.value })}
                  className="w-full bg-white/10 dark:bg-black/10 
                           border border-white/20 dark:border-white/10 
                           rounded-lg px-3 py-2 text-sm
                           text-gray-800 dark:text-white" 
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">Location</label>
              <input 
                type="text" 
                value={birthInfo.location}
                onChange={(e) => onBirthInfoChange({ location: e.target.value })}
                placeholder="Enter birth location"
                className="w-full bg-white/10 dark:bg-black/10 
                         border border-white/20 dark:border-white/10 
                         rounded-lg px-3 py-2 text-sm
                         text-gray-800 dark:text-white" 
              />
            </div>
          </div>
        </div>

        <div className="bg-white/5 dark:bg-black/5 rounded-xl p-4 border border-white/10">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Chart Options</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={chartOptions.showPalaceNames}
                onChange={(e) => onChartOptionsChange({ showPalaceNames: e.target.checked })}
                className="rounded border-white/20" 
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">Show Palace Names</span>
            </label>
            <label className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                checked={chartOptions.displayStarRatings}
                onChange={(e) => onChartOptionsChange({ displayStarRatings: e.target.checked })}
                className="rounded border-white/20" 
              />
              <span className="text-sm text-gray-700 dark:text-gray-200">Display Star Ratings</span>
            </label>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button 
          className="w-full sm:w-auto px-4 py-2 rounded-lg 
                     bg-white/20 hover:bg-white/30 
                     dark:bg-white/5 dark:hover:bg-white/10
                     text-gray-800 dark:text-white 
                     border border-white/20 dark:border-white/10 
                     backdrop-blur-md
                     transition-all duration-300 hover:shadow-lg
                     text-sm sm:text-base"
        >
          Learn More
        </button>
        <button 
          onClick={onSubmit}
          className="w-full sm:w-auto px-4 py-2 rounded-lg 
                     bg-gradient-to-r from-indigo-600 to-purple-600 
                     dark:from-indigo-500 dark:to-purple-500 
                     text-white 
                     shadow-lg shadow-indigo-500/20 dark:shadow-indigo-800/20
                     transition-all duration-300 hover:shadow-xl
                     text-sm sm:text-base"
        >
          Generate Chart
        </button>
      </div>
    </div>
  );
}; 