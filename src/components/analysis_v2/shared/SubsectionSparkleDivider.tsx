import React from "react";
import { Sparkles } from "lucide-react";

type SubsectionSparkleDividerProps = {
  className?: string;
};

/**
 * Gradient line + sparkle — sits below subsection titles (Wealth Code, Nobleman, etc.).
 */
export const SubsectionSparkleDivider: React.FC<SubsectionSparkleDividerProps> = ({
  className = "mx-auto mb-8 mt-5 flex w-full max-w-md items-center gap-3 px-2",
}) => (
  <div className={className} aria-hidden="true">
    <div className="h-[2px] min-w-[2rem] flex-1 bg-gradient-to-r from-transparent via-[#080657] to-[#8B1167]" />
    <Sparkles className="h-4 w-4 shrink-0 text-accent-coral" />
    <div className="h-[2px] min-w-[2rem] flex-1 bg-gradient-to-r from-[#8B1167] to-[#FE8E01]" />
  </div>
);
