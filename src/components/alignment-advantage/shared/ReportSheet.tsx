import React from "react";
import { SectionWatermark } from "./SectionWatermark";

type WatermarkType = "grid" | "waves" | "network" | "timeline" | "target" | "compass" | "nodes";

/** One A4-sized report page for scroll and PDF capture parity. */
export const ReportSheet: React.FC<{
  children: React.ReactNode;
  className?: string;
  watermark?: WatermarkType;
}> = ({ children, className = "", watermark }) => (
  <article
    className={[
      "relative overflow-hidden scroll-mt-16",
      "bg-[#fdf6ee] rounded-[40px]",
      "p-6 sm:p-8 md:p-16",
      "shadow-[0_8px_32px_rgba(0,0,0,0.03)]",
      "border border-[#e8ddd0]/80",
      "mb-8",
      "min-h-[1050px]",
      className,
    ].join(" ")}
  >
    {watermark !== undefined && <SectionWatermark type={watermark} />}
    {children}
  </article>
);
