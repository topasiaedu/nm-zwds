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
}

const DEFAULT_ICON_CLASS = "text-black dark:text-white";

/**
 * Wrapper component for zodiac SVG icons with standardized scaling
 */
const ZodiacIconWrapper: React.FC<ZodiacIconWrapperProps> = ({
  Icon,
  className = "",
  iconClassName = DEFAULT_ICON_CLASS,
  invertToWhite = false,
}) => {
  // Only invert when explicitly requested. Do not substring-match "text-white" on
  // DEFAULT_ICON_CLASS ("text-black dark:text-white") — that always matched and
  // turned palace watermarks white-on-white in light mode.
  const shouldInvert = invertToWhite;

  const iconClasses = shouldInvert
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