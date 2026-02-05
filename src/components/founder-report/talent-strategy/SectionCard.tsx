import React from "react";

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="rounded-2xl shadow-lg border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 p-8 mb-6">
      <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">
        {title}
      </h3>
      {subtitle ? (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
          {subtitle}
        </p>
      ) : null}
      {children}
    </div>
  );
};

export default SectionCard;
