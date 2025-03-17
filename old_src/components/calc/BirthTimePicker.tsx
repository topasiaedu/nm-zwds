import { Select, Label } from "flowbite-react";
import React from "react";
import { useLanguage } from "../../context/LanguageContext";

const EarthlyBranches = [
  "子",
  "丑",
  "寅",
  "卯",
  "辰",
  "巳",
  "午",
  "未",
  "申",
  "酉",
  "戌",
  "亥",
];

const BirthTimePicker: React.FC<{
  birthTime: string;
  setBirthTime: (value: string) => void;
}> = ({ birthTime, setBirthTime }) => {

  const { t } = useLanguage();
  return (
    <div className="mt-4">
      <Label
        htmlFor="birthTime"
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {t("select_birth_time")}
      </Label>
      <Select
        id="birthTime"
        name="birthTime"
        value={birthTime}
        onChange={(e) => setBirthTime(e.target.value)}
        required>
        <option value="" disabled>
          {t("birth_time_placeholder")}
        </option>
        {EarthlyBranches.map((branch, i) => {
          const timeLabel = `${branch}【${(24 + (i * 2 - 1)) % 24}~${
            i * 2 + 1
          }】`;
          return (
            <option key={branch} value={(24 + (i * 2 - 1)) % 24}>
              {timeLabel}
            </option>
          );
        })}
      </Select>
    </div>
  );
};

export default BirthTimePicker;
