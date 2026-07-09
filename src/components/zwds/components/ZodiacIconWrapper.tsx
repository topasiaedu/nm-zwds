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
  /**
   * Muted gold tint with reduced opacity — for filled western zodiac glyphs.
   */
  invertToGoldSoft?: boolean;
  /**
   * Renders hardcoded black SVG paths as dark brown — palace header badge icons.
   */
  invertToBrown?: boolean;
  /**
   * Renders hardcoded black SVG paths as faint tan watermark (palace background).
   */
  invertToWatermark?: boolean;
}

const DEFAULT_ICON_CLASS = "text-black dark:text-white";

const GOLD_TINT_ICON_CLASS = [
  "h-full max-h-full w-full max-w-full object-contain",
  "brightness-0 invert-[77%] sepia-[29%] saturate-[507%] hue-rotate-[359deg] brightness-[89%] contrast-[86%]",
  "dark:invert-[80%] dark:sepia-[26%] dark:saturate-[440%] dark:brightness-[98%] dark:contrast-[88%]",
].join(" ");

const GOLD_SOFT_TINT_ICON_CLASS = [
  "h-full max-h-full w-full max-w-full object-contain scale-[0.88]",
  "opacity-[0.38]",
  "brightness-0 invert-[77%] sepia-[29%] saturate-[507%] hue-rotate-[359deg] brightness-[89%] contrast-[86%]",
  "dark:opacity-[0.44] dark:invert-[80%] dark:sepia-[26%] dark:saturate-[440%] dark:brightness-[98%] dark:contrast-[88%]",
].join(" ");

const BROWN_TINT_ICON_CLASS = [
  "h-full max-h-full w-full max-w-full object-contain",
  "brightness-0 invert-[18%] sepia-[35%] saturate-[600%] hue-rotate-[350deg] brightness-[0.42] contrast-[1.1]",
  "dark:invert-[72%] dark:sepia-[22%] dark:saturate-[380%] dark:brightness-[88%] dark:contrast-[0.95]",
].join(" ");

const WATERMARK_TINT_ICON_CLASS = [
  "h-full w-full max-h-full max-w-full object-contain",
  "brightness-0 invert-[68%] sepia-[35%] saturate-[450%] hue-rotate-[8deg] brightness-[92%] contrast-[90%]",
  "dark:invert-[75%] dark:sepia-[28%] dark:saturate-[380%] dark:brightness-[95%] dark:contrast-[85%]",
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
  invertToGoldSoft = false,
  invertToBrown = false,
  invertToWatermark = false,
}) => {
  const iconClasses = invertToWatermark
    ? WATERMARK_TINT_ICON_CLASS
    : invertToGoldSoft
      ? GOLD_SOFT_TINT_ICON_CLASS
      : invertToGold
    ? GOLD_TINT_ICON_CLASS
    : invertToBrown
      ? BROWN_TINT_ICON_CLASS
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