import React from "react";

const SectionCard: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => {
  return (
    <div className="rounded-2xl shadow-2xl overflow-hidden border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 hover:shadow-indigo-200 dark:hover:shadow-indigo-900/20 transition-shadow duration-300">
      <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 40%, rgba(255,255,255,.18) 1px, transparent 1px),
              radial-gradient(circle at 75% 70%, rgba(255,255,255,.14) 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
          }}
        />
        <div className="relative">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          {subtitle ? <p className="text-sm text-white/90 mt-1.5 leading-relaxed">{subtitle}</p> : null}
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default SectionCard;
