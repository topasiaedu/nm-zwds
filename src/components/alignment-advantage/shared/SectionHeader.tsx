import React from "react";
import { C } from "./constants";
import { Sparkle } from "./Sparkle";
import { SectionGraphic } from "./SectionGraphic";

export const SectionHeader: React.FC<{ chapter: string; title: string; subtitle?: string; graphicType?: string }> = ({
  chapter, title, subtitle, graphicType
}) => (
  <div className="mb-16 relative">
    {graphicType && <SectionGraphic type={graphicType} />}
    <div
      className="w-full h-[1px] mb-8"
      style={{ background: `linear-gradient(90deg, ${C.border} 0%, transparent 100%)` }}
    />
    <div className="flex items-center gap-2 mb-4">
      <Sparkle size={12} color={C.coral} />
      <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
        {chapter}
      </p>
    </div>
    <h2 className="text-4xl font-bold leading-tight mb-4 relative z-10" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em" }}>
      {title}
    </h2>
    {subtitle !== undefined && (
      <p className="text-base leading-relaxed relative z-10" style={{ color: C.muted, maxWidth: "600px" }}>{subtitle}</p>
    )}
  </div>
);
