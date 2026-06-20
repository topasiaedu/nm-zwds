import React from "react";
import type { PeoplePalaceReading } from "../shared/helpers/peoplePalaceAnalysis";
import { PeoplePalaceBriefingBody } from "./PeoplePalaceBriefingBody";

export interface PeoplePalaceDetailPanelProps {
  reading: PeoplePalaceReading;
}

/** Web wrapper for the full palace briefing packet. */
export const PeoplePalaceDetailPanel: React.FC<PeoplePalaceDetailPanelProps> = ({ reading }) => (
  <PeoplePalaceBriefingBody reading={reading} />
);
