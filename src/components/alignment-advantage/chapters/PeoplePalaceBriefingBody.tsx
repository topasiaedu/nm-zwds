import React, { useMemo } from "react";
import { C } from "../shared/constants";
import {
  buildPalaceActivationTiles,
  buildPalaceStarRoster,
  type PeoplePalaceReading,
} from "../shared/helpers/peoplePalaceAnalysis";
import {
  getPeoplePalaceActions,
  getPeoplePalaceWatchOuts,
  getPeoplePalaceStarContext,
  getPalaceActivationHint,
} from "../shared/peoplePalaceGuidance";
import { PeoplePalaceActivationGrid } from "../shared/PeoplePalaceActivationGrid";
import { PalaceRelationshipSvg, PALACE_CATALYST_TILE_STYLES } from "../shared/peoplePalaceVisuals";
import { PhaseActionsSvg } from "../shared/phaseWealthVisuals";
import type { CatalystKind } from "../shared/catalystGuidance";

export interface PeoplePalaceBriefingBodyProps {
  reading: PeoplePalaceReading;
  rank?: number;
  score?: number;
  isPrimary?: boolean;
  focusLabel?: string;
  pageLabel?: string;
}

const ACTIVATION_CHIP_LABEL: Record<CatalystKind, string> = {
  lu: "Resources",
  quan: "Authority",
  ke: "Reputation",
  ji: "Pressure",
};

const SectionLabel: React.FC<{ index: string; title: string }> = ({ index, title }) => (
  <div className="flex items-center gap-3 mb-4">
    <span
      className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
      style={{ background: `${C.coral}18`, color: C.coral, border: `1px solid ${C.coral}30` }}
    >
      {index}
    </span>
    <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
      {title}
    </p>
  </div>
);

/** Visual-first palace briefing: hero, activations, star roster, actions. */
export const PeoplePalaceBriefingBody: React.FC<PeoplePalaceBriefingBodyProps> = ({
  reading,
  rank,
  score,
  isPrimary = false,
  focusLabel,
  pageLabel,
}) => {
  const { framing, hasMainStars } = reading;
  const activationTiles = useMemo(() => buildPalaceActivationTiles(reading), [reading]);
  const starRoster = useMemo(() => buildPalaceStarRoster(reading), [reading]);
  const actions = useMemo(() => getPeoplePalaceActions(reading), [reading]);
  const risks = useMemo(() => getPeoplePalaceWatchOuts(reading), [reading]);
  const activationHint = useMemo(() => getPalaceActivationHint(reading), [reading]);

  const heroLine = hasMainStars ? framing.bottomLine : framing.emptyPalaceGuidance;
  const starsSummary = useMemo(() => getPeoplePalaceStarContext(reading), [reading]);

  return (
    <div className="space-y-7 relative z-10">
      {pageLabel !== undefined && (
        <>
          <div
            className="w-full h-px"
            style={{ background: `linear-gradient(90deg, ${C.border} 0%, transparent 100%)` }}
          />
          <p className="text-[10px] font-bold uppercase tracking-[0.24em]" style={{ color: C.coral }}>
            {pageLabel}
          </p>
        </>
      )}

      <div
        className="rounded-2xl p-6 md:p-7"
        style={{ background: C.white, border: `1px solid ${C.border}60` }}
      >
        <div className="grid grid-cols-1 md:grid-cols-[120px_1fr_auto] gap-6 items-start">
          <div
            className="w-28 h-28 rounded-2xl flex items-center justify-center p-5 mx-auto md:mx-0"
            style={{ background: `${C.coral}10`, border: `1px solid ${C.coral}25` }}
          >
            <PalaceRelationshipSvg palaceKey={reading.palaceKey} />
          </div>

          <div className="min-w-0 text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: C.coral }}>
              Relationship Palace
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold leading-tight mb-1"
              style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif", letterSpacing: "-0.02em" }}
            >
              {framing.sectionTitle}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] mb-2" style={{ color: C.muted }}>
              {framing.strategicRole}
            </p>
            <p className="text-sm leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: C.navy }}>
              {heroLine}
            </p>
          </div>

          {rank !== undefined && score !== undefined && (
            <div
              className="shrink-0 flex flex-col items-center justify-center rounded-2xl px-5 py-4 text-center min-w-[112px] mx-auto md:mx-0"
              style={{
                background: isPrimary ? `${C.coral}12` : `${C.navy}06`,
                border: `1px solid ${isPrimary ? `${C.coral}35` : `${C.border}70`}`,
              }}
            >
              <p
                className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1"
                style={{ color: isPrimary ? C.coral : C.muted }}
              >
                Priority #{rank}
              </p>
              <p
                className="text-3xl font-bold leading-none mb-1"
                style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
              >
                {score}
              </p>
              {focusLabel !== undefined && (
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: C.muted }}>
                  {focusLabel}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <PeoplePalaceActivationGrid tiles={activationTiles} hint={activationHint} />

      {starRoster.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] mb-3" style={{ color: C.navy }}>
            Stars In This Palace
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {starRoster.map((chip) => (
              <div
                key={chip.pinyin}
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"
                style={{
                  background: C.white,
                  border: chip.isMain ? `1.5px solid ${C.navy}25` : `1px solid ${C.border}60`,
                }}
              >
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: C.navy,
                    fontFamily: chip.isMain ? "Georgia,'Times New Roman',serif" : "inherit",
                  }}
                >
                  {chip.pinyin}
                </span>
                {chip.activationKinds.map((kind) => {
                  const chipStyle = PALACE_CATALYST_TILE_STYLES[kind];
                  return (
                    <span
                      key={kind}
                      className="text-[8px] font-bold uppercase tracking-wide rounded-full px-1.5 py-0.5"
                      style={{ background: chipStyle.activeBg, color: chipStyle.color }}
                    >
                      {ACTIVATION_CHIP_LABEL[kind]}
                    </span>
                  );
                })}
              </div>
            ))}
          </div>
          <p className="text-sm leading-relaxed" style={{ color: C.muted }}>
            {starsSummary}
          </p>
        </div>
      )}

      <div className="pt-8" style={{ borderTop: `1px solid ${C.border}60` }}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <SectionLabel index="01" title="What To Do Now" />
            <div className="rounded-3xl overflow-hidden relative min-h-[220px]" style={{ background: C.white, border: `1px solid ${C.navy}35` }}>
              <div className="absolute right-5 top-5 w-20 h-20 opacity-5 pointer-events-none">
                <PhaseActionsSvg />
              </div>
              <div className="p-6 space-y-4 relative z-10">
                {actions.map((action, idx) => (
                  <div key={action} className="flex items-start gap-3">
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5"
                      style={{ background: `${C.coral}15`, color: C.coral, border: `1px solid ${C.coral}30` }}
                    >
                      {idx + 1}
                    </span>
                    <p className="text-sm leading-snug" style={{ color: C.navy }}>
                      {action}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {risks.length > 0 && (
            <div>
              <SectionLabel index="02" title="What To Watch" />
              <div
                className="rounded-3xl p-6 min-h-[220px]"
                style={{ background: `${C.coral}08`, border: `1px solid ${C.coral}35` }}
              >
                <div className="space-y-4 pt-2">
                  {risks.map((item) => (
                    <p key={item} className="text-sm leading-snug pl-4 relative" style={{ color: C.navy }}>
                      <span
                        className="absolute left-0 top-[0.5em] w-1.5 h-1.5 rounded-full"
                        style={{ background: C.coral }}
                      />
                      {item}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
