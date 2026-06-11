import React from "react";

interface ZodiacIconWrapperProps {
  Icon: React.ElementType;
  className?: string;
  /** SVG fill color classes (default: black in light mode, white in dark). */
  iconClassName?: string;
  /**
   * Renders hardcoded black SVG paths as white via CSS invert.
   * Use on colored gradient tiles (nobleman, modal) where paths use fill="#000".
   */
  invertToWhite?: boolean;
  /**
   * Renders hardcoded black SVG paths as brand gold — matches life-area Lucide icons.
   */
  invertToGold?: boolean;
}

const DEFAULT_ICON_CLASS = "text-black dark:text-white";

const GOLD_TINT_ICON_CLASS = [
  "h-full max-h-full w-full max-w-full object-contain",
  "brightness-0 invert-[77%] sepia-[29%] saturate-[507%] hue-rotate-[359deg] brightness-[89%] contrast-[86%]",
  "dark:invert-[80%] dark:sepia-[26%] dark:saturate-[440%] dark:brightness-[98%] dark:contrast-[88%]",
].join(" ");

/**
 * Wrapper component for zodiac SVG icons with standardized scaling
 */
const ZodiacIconWrapper: React.FC<ZodiacIconWrapperProps> = ({
  Icon,
  className = "",
  iconClassName = DEFAULT_ICON_CLASS,
  invertToWhite = false,
  invertToGold = false,
}) => {
  const iconClasses = invertToGold
    ? GOLD_TINT_ICON_CLASS
    : invertToWhite
      ? "h-full max-h-full w-full max-w-full object-contain brightness-0 invert"
      : `h-full max-h-full w-full max-w-full object-contain ${iconClassName}`;

  return (
    <div className={`relative flex h-full w-full items-center justify-center ${className}`}>
      <div className="flex h-full w-full items-center justify-center">
        <Icon
          className={iconClasses}
          style={{
            display: "block",
            objectFit: "contain",
          }}
        />
      </div>
    </div>
  );
};

export default ZodiacIconWrapper; 