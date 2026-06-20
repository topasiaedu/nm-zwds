import React from "react";
import { Target, Users } from "lucide-react";
import { C } from "../shared/constants";
import type { PeopleCrossPalaceStrategy } from "../shared/helpers/peoplePalaceAnalysis";

interface PeopleCrossPalaceStrategyProps {
  strategy: PeopleCrossPalaceStrategy;
}

/** Cross-palace cards aligned with Ch02 layout. */
export const PeopleCrossPalaceStrategyPanel: React.FC<PeopleCrossPalaceStrategyProps> = ({
  strategy,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-2 p-8 rounded-3xl" style={{ background: C.white, border: `1px solid ${C.border}60`, boxShadow: "0 4px 24px rgba(0,0,0,0.02)" }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `${C.navy}10`, border: `1px solid ${C.navy}20` }}>
          <Users size={20} color={C.navy} />
        </div>
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: C.muted }}>
            Ideal Collaborator
          </p>
          <h3 className="text-xl font-bold" style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}>
            {strategy.primaryPalaceLabel} Lead
          </h3>
        </div>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: C.navy }}>
        {strategy.idealCollaborator}
      </p>
    </div>

    {strategy.cyclePriority !== null ? (
      <div className="p-6 rounded-3xl h-full flex flex-col justify-center" style={{ background: C.navy, boxShadow: "0 8px 32px rgba(26,30,63,0.15)" }}>
        <div className="flex items-center gap-2 mb-4">
          <Target size={18} color={C.coral} />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: "rgba(255,255,255,0.4)" }}>
            This Cycle
          </p>
        </div>
        <p className="text-lg font-bold mb-3" style={{ color: C.cream, fontFamily: "Georgia,'Times New Roman',serif" }}>
          {strategy.cyclePriority.palaceLabel}
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
          {strategy.cyclePriority.action}
        </p>
      </div>
    ) : null}
  </div>
);
