import React from "react";
import { C } from "../shared/constants";
import type { FormationProfile } from "../../../utils/forecast/structure/formationProfiles";
import type { StructureAnalysisResult, SpecialFormationKey } from "../../../utils/zwds/analysis/structureAnalysis";
import { FORMATION_PROFILES } from "../../../utils/forecast/structureContentData";
import type { StructureLabel } from "../../../utils/forecast/structure/formationProfiles";
import { PageContextStrip } from "../shared/PageContextStrip";
import { ReportSheet } from "../shared/ReportSheet";
import { CatalystEngineGrid } from "../shared/CatalystEngineGrid";
import type { CoreCatalystActivation } from "../shared/catalystGuidance";
import {
  EndurancePlayerSvg,
  SpeedPlayerSvg,
  FormationIllustration,
  getFormationExecutiveBrief,
  getPlayerTypeDirective,
} from "../shared/formationSheetVisuals";

interface PlayerFormationSheetProps {
  strLabel: StructureLabel;
  formation: FormationProfile;
  structureResult: StructureAnalysisResult;
  catalystActivations: ReadonlyArray<CoreCatalystActivation>;
}

const SectionLabel: React.FC<{ index: string; title: string }> = ({ index, title }) => (
  <div className="flex items-center gap-3 mb-3">
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

const FormationCard: React.FC<{
  profile: FormationProfile;
  formationKey?: string;
  variant: "primary" | "secondary";
}> = ({ profile, formationKey, variant }) => {
  const brief = getFormationExecutiveBrief(profile, formationKey);

  return (
    <div
      className="rounded-3xl overflow-hidden h-full"
      style={{
        background: variant === "primary" ? C.white : `${C.navy}04`,
        border: `1px solid ${variant === "primary" ? `${C.border}60` : `${C.navy}12`}`,
        boxShadow: variant === "primary" ? "0 4px 24px rgba(0,0,0,0.02)" : "none",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[112px_1fr] gap-0">
        <div
          className="flex items-center justify-center p-4 min-h-[108px]"
          style={{
            background: variant === "primary"
              ? `linear-gradient(160deg, ${C.navy}06, ${C.coral}08)`
              : `linear-gradient(160deg, ${C.coral}06, transparent)`,
          }}
        >
          <div className="w-16 h-16">
            <FormationIllustration
              formationKey={formationKey}
              playerType={profile.playerType}
            />
          </div>
        </div>

        <div className="p-4 md:p-5 md:pl-1 flex flex-col justify-center">
          <h3
            className="text-base font-bold mb-1.5"
            style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
          >
            {profile.englishName}
          </h3>

          <p className="text-xs font-semibold leading-snug mb-2" style={{ color: C.navy }}>
            {brief.directive}
          </p>

          <div className="space-y-1">
            {brief.moves.map((move) => (
              <div key={move} className="flex gap-2 items-start">
                <span
                  className="shrink-0 mt-1.5 w-1 h-1 rounded-full"
                  style={{ background: C.coral }}
                />
                <p className="text-[11px] leading-snug" style={{ color: C.muted }}>
                  {move}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/** Ch01 page 2: player type, formations, and catalyst activations. */
export const PlayerFormationSheet: React.FC<PlayerFormationSheetProps> = ({
  strLabel,
  formation,
  structureResult,
  catalystActivations,
}) => {
  const isSpeed = strLabel.label.includes("Speed");
  const secondaryFormations = structureResult.specialFormations
    .map((key) => ({ key, profile: FORMATION_PROFILES[key as SpecialFormationKey] }))
    .filter((entry): entry is { key: SpecialFormationKey; profile: FormationProfile } => entry.profile !== undefined);

  return (
    <ReportSheet>
      <PageContextStrip label="Ch 01 · Page 2 of 2 · Player Type & Formation" />

      <div className="mb-6">
        <SectionLabel index="01" title="Player Type" />
        <div
          className="rounded-3xl overflow-hidden"
          style={{ border: `1px solid ${C.border}60` }}
        >
          <div className="grid grid-cols-1 md:grid-cols-[112px_1fr_auto] gap-0">
            <div
              className="flex items-center justify-center p-4"
              style={{ background: `linear-gradient(160deg, ${C.navy}08, ${isSpeed ? `${C.coral}12` : `${C.gold}12`})` }}
            >
              <div className="w-16 h-16">
                {isSpeed ? <SpeedPlayerSvg /> : <EndurancePlayerSvg />}
              </div>
            </div>
            <div className="p-4 md:py-5 flex flex-col justify-center">
              <p className="text-[9px] font-bold uppercase tracking-[0.2em] mb-1.5" style={{ color: C.muted }}>
                Base Operating System
              </p>
              <h3
                className="text-xl font-bold mb-1.5"
                style={{ color: C.navy, fontFamily: "Georgia,'Times New Roman',serif" }}
              >
                {strLabel.label}
              </h3>
              <p className="text-xs leading-snug max-w-xl" style={{ color: C.navy }}>
                {getPlayerTypeDirective(strLabel.description, isSpeed)}
              </p>
            </div>
            <div className="hidden md:flex items-center px-6">
              <span
                className="rounded-full px-4 py-2 text-[9px] font-bold uppercase tracking-widest"
                style={{
                  background: isSpeed ? `${C.coral}18` : `${C.navy}10`,
                  color: isSpeed ? C.coral : C.navy,
                  border: `1px solid ${isSpeed ? `${C.coral}30` : `${C.navy}20`}`,
                }}
              >
                {structureResult.structureType === "speed" ? "Northern" : "Southern"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <SectionLabel index="02" title="Primary Formation" />
        <FormationCard
          profile={formation}
          formationKey={structureResult.formation}
          variant="primary"
        />
      </div>

      {secondaryFormations.length > 0 && (
        <div className="mb-6">
          <SectionLabel index="03" title="Secondary Formations" />
          <div className={`grid gap-3 ${secondaryFormations.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"}`}>
            {secondaryFormations.map(({ key, profile }) => (
              <FormationCard key={key} profile={profile} formationKey={key} variant="secondary" />
            ))}
          </div>
        </div>
      )}

      <div className="pt-5" style={{ borderTop: `1px solid ${C.border}60` }}>
        <SectionLabel index={secondaryFormations.length > 0 ? "04" : "03"} title="Growth Catalysts" />
        <CatalystEngineGrid activations={catalystActivations} />
      </div>
    </ReportSheet>
  );
};
