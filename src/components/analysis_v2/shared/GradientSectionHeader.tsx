/**
 * Gradient Section Header Component
 * 
 * A reusable header component that matches the Founder Report design pattern.
 * Features a gradient background, numbered badge, and pulsing border animation.
 */

import React from "react";

/**
 * Props for the GradientSectionHeader component
 */
interface GradientSectionHeaderProps {
  /** Badge text displayed before the title (e.g., "01", "02") */
  badgeText: string;
  /** Main title text */
  title: string;
  /** Subtitle text displayed below the title */
  subtitle: string;
  /** Whether to show the divider line above the header. Defaults to true. */
  showDivider?: boolean;
}

/**
 * GradientSectionHeader component that displays a premium-styled section header
 * with gradient background, badge, and animated border.
 */
const GradientSectionHeader: React.FC<GradientSectionHeaderProps> = ({
  badgeText,
  title,
  subtitle,
  showDivider = true,
}) => {
  return (
    <>
      {/* Divider (match founder report sections) */}
      {showDivider && (
        <div className="w-full border-t border-gray-400 dark:border-gray-600 mb-6"></div>
      )}

      {/* Section Header */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8"
        style={{
          background: "linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)",
          padding: "32px 40px",
          boxShadow: "0 10px 40px rgba(251, 146, 60, 0.3)",
          border: "3px solid rgba(251, 146, 60, 0.8)",
          animation: "pulse-border 1.5s ease-in-out infinite",
        }}
      >
        {/* Pulsing border animation */}
        <style>{`
          @keyframes pulse-border {
            0%, 100% {
              box-shadow: 0 10px 40px rgba(251, 146, 60, 0.4), 0 0 0 0 rgba(251, 146, 60, 1), 0 0 20px rgba(251, 146, 60, 0.6);
            }
            50% {
              box-shadow: 0 10px 60px rgba(251, 146, 60, 0.8), 0 0 0 15px rgba(251, 146, 60, 0), 0 0 40px rgba(251, 146, 60, 0.3);
            }
          }
        `}</style>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            {/* Badge */}
            <span
              style={{
                background: "rgba(255, 255, 255, 0.9)",
                color: "#ea580c",
                padding: "4px 12px",
                borderRadius: "8px",
                fontSize: "18px",
                fontWeight: "800",
              }}
            >
              {badgeText}
            </span>

            {/* Title */}
            <h2
              style={{
                fontSize: "32px",
                fontWeight: "800",
                color: "#ffffff",
                textShadow: "0 2px 10px rgba(0,0,0,0.1)",
              }}
            >
              {title}
            </h2>
          </div>

          {/* Subtitle */}
          <p
            style={{
              color: "#fff",
              fontSize: "15px",
              fontWeight: "500",
              marginTop: "8px",
              opacity: 0.95,
            }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </>
  );
};

export default GradientSectionHeader;
