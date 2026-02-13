import React, { useState } from "react";

import { ChartInput } from "../utils/zwds/types";

// Note: EarthlyBranches logic duplicated from ProfileForm to avoid prop drilling complexity
// In a real refactor, extract to shared constant provided by context or generic hook
const EarthlyBranches = [
  "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"
];

interface ForecastFormProps {
  onSubmit: (data: ChartInput) => void;
  isGenerating: boolean;
}

const ForecastForm: React.FC<ForecastFormProps> = ({ onSubmit, isGenerating }) => {


  const [formData, setFormData] = useState({
    name: "",
    email: "",
    birthDate: "", // YYYY-MM-DD
    birthTime: "",
    gender: "male" as "male" | "female"
  });

  const [dateError, setDateError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "birthDate") setDateError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.birthDate || !formData.birthTime) {
      setDateError("Please fill in all fields");
      return;
    }

    const [year, month, day] = formData.birthDate.split("-").map(Number);
    const hour = parseInt(formData.birthTime.split(":")[0]);

    if (isNaN(year) || isNaN(month) || isNaN(day)) {
      setDateError("Invalid Date");
      return;
    }

    const input: ChartInput = {
      year,
      month,
      day,
      hour,
      gender: formData.gender,
      name: formData.name || "Guest",
      email: formData.email
    };

    onSubmit(input);
  };

  const inputStyle = {
    backgroundColor: "#ffffff",
    color: "#1f2937",
    borderColor: "#d1d5db",
    borderWidth: "1px",
    borderStyle: "solid"
  };

  const labelStyle = {
    color: "#4b5563", // Gray 600
    fontWeight: "600",
    fontSize: "0.875rem",
    letterSpacing: "0.025em"
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block mb-2" style={labelStyle}>
            Full Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder-gray-400 shadow-sm"
            style={inputStyle}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block mb-2" style={labelStyle}>
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all placeholder-gray-400 shadow-sm"
            style={inputStyle}
            required
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block mb-2" style={labelStyle}>
            Gender
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "male" })}
              className={`p-3 rounded-md border transition-all font-medium shadow-sm`}
              style={{
                backgroundColor: formData.gender === "male" ? "#eff6ff" : "#ffffff", // Blue-50 vs White
                color: formData.gender === "male" ? "#1e40af" : "#6b7280",
                borderColor: formData.gender === "male" ? "#3b82f6" : "#d1d5db",
                borderWidth: "1px",
                borderStyle: "solid"
              }}
            >
              Male
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, gender: "female" })}
              className={`p-3 rounded-md border transition-all font-medium shadow-sm`}
              style={{
                backgroundColor: formData.gender === "female" ? "#fdf2f8" : "#ffffff", // Pink-50 vs White
                color: formData.gender === "female" ? "#be185d" : "#6b7280",
                borderColor: formData.gender === "female" ? "#ec4899" : "#d1d5db",
                borderWidth: "1px",
                borderStyle: "solid"
              }}
            >
              Female
            </button>
          </div>
        </div>

        {/* Date of Birth */}
        <div>
          <label className="block mb-2" style={labelStyle}>
            Date of Birth
          </label>
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            className="w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
            style={inputStyle}
            required
          />
          {dateError && <p className="text-red-500 text-xs mt-1 font-medium">{dateError}</p>}
        </div>

        {/* Birth Time */}
        <div>
          <label className="block mb-2" style={labelStyle}>
            Time of Birth
          </label>
          <select
            name="birthTime"
            value={formData.birthTime}
            onChange={handleChange}
            className="w-full rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all shadow-sm"
            style={inputStyle}
            required
          >
            <option value="" style={{ backgroundColor: "#ffffff", color: "#374151" }}>Select Time</option>
            {EarthlyBranches.map((branch, i) => {
              const startHour = (23 + (i * 2)) % 24;
              const endHour = (startHour + 2) % 24;
              const startStr = startHour.toString().padStart(2, "0");
              const endStr = (endHour - 1 < 0 ? 23 : endHour - 1).toString().padStart(2, "0");
              return (
                <option key={branch} value={`${startStr}:00`} style={{ backgroundColor: "#ffffff", color: "#374151" }}>
                  {branch} ({startStr}:00 - {endStr}:59)
                </option>
              );
            })}
          </select>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full font-bold py-4 rounded shadow-lg transform transition-all hover:translate-y-[-1px] active:translate-y-[1px] disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm"
          style={{
            background: "linear-gradient(90deg, #b91c1c 0%, #ea580c 100%)",
            color: "#ffffff",
            boxShadow: "0 4px 6px -1px rgba(185, 28, 28, 0.3)"
          }}
        >
          {isGenerating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating Guide...
            </span>
          ) : "Get My Assessment"}
        </button>
      </form>
    </div>
  );
};

export default ForecastForm;
