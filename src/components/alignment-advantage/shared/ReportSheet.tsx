import React from "react";
import { SectionWatermark } from "./SectionWatermark";

type WatermarkType = "grid" | "waves" | "network" | "timeline" | "target" | "compass" | "nodes";

/**
 * One report page surface for scroll and PDF capture parity.
 * Print CSS clears min-height / overflow so sheets can fragment across A4 pages
 * without clipped tails or blank continuation pages.
 */
export const ReportSheet: React.FC<{
  children: React.ReactNode;
  className?: string;
  watermark?: WatermarkType;
}> = ({ children, className = "", watermark }) => (
  <article
    data-aa-report-sheet=""
    className={[
      "relative overflow-x-hidden overflow-y-visible scroll-mt-16",
      "bg-[#fdf6ee] rounded-[40px]",
      "p-6 sm:p-8 md:p-16",
      "shadow-[0_8px_32px_rgba(0,0,0,0.03)]",
      "border border-[#e8ddd0]/80",
      "mb-8",
      "min-h-0 md:min-h-[1050px]",
      className,
    ].join(" ")}
  >
    {watermark !== undefined && <SectionWatermark type={watermark} />}
    {children}
  </article>
);
