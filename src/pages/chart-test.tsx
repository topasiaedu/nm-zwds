import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Test page to demonstrate the chart-only endpoint
 * This page allows testing the chart generation with different parameters
 */
const ChartTest: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    year: "1990",
    month: "1",
    day: "1",
    hour: "12",
    gender: "male" as "male" | "female",
    name: "Test User",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const generateChartUrl = () => {
    const params = new URLSearchParams({
      year: formData.year,
      month: formData.month,
      day: formData.day,
      hour: formData.hour,
      gender: formData.gender,
      name: formData.name,
    });

    return `/chart-only?${params.toString()}`;
  };

  const handleGenerateChart = () => {
    const url = generateChartUrl();
    navigate(url);
  };

  const handleOpenInNewTab = () => {
    const url = generateChartUrl();
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chart Generation Test</h1>
        
        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Profile Data</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1660"
                max="2100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Month</label>
              <input
                type="number"
                name="month"
                value={formData.month}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="12"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Day</label>
              <input
                type="number"
                name="day"
                value={formData.day}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                max="31"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Hour (0-23)</label>
              <input
                type="number"
                name="hour"
                value={formData.hour}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="23"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Generated URL</h2>
          <div className="bg-white border border-gray-300 p-3 rounded-md font-mono text-sm break-all">
            {generateChartUrl()}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleGenerateChart}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors"
          >
            Generate Chart
          </button>
          
          <button
            onClick={handleOpenInNewTab}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium transition-colors"
          >
            Open in New Tab
          </button>
        </div>

        <div className="mt-8 bg-gray-50 border border-gray-200 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Usage Instructions</h2>
          <div className="space-y-3 text-sm">
            <p>
              <strong>For Backend Integration:</strong> Use the generated URL to make HTTP requests to your frontend application.
            </p>
            <p>
              <strong>URL Parameters:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><code>year</code> - Birth year (1660-2100)</li>
              <li><code>month</code> - Birth month (1-12)</li>
              <li><code>day</code> - Birth day (1-31)</li>
              <li><code>hour</code> - Birth hour (0-23)</li>
              <li><code>gender</code> - &quot;male&quot; or &quot;female&quot;</li>
              <li><code>name</code> - Person&apos;s name (optional)</li>
            </ul>
            <p className="mt-4">
              <strong>Example:</strong> <code>/chart-only?year=1990&month=1&day=1&hour=12&gender=male&name=John%20Doe</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartTest; 