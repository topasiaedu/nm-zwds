/**
 * Content completeness registry for Alignment Advantage copy.
 * Update when adding new archetypes, formations, or star briefs.
 */

import type { WealthCodeKey } from "../../../utils/zwds/analysis_constants/wealth_code_mapping";
import { STAR_BRIEF } from "../../../utils/forecast/starBriefDescriptions";
import { FORMATION_PROFILES } from "../../../utils/forecast/structureContentData";

export const WEALTH_CODE_KEYS: WealthCodeKey[] = [
  "investmentBrain",
  "brandingMagnet",
  "strategyPlanner",
  "collaborator",
];

export const PHASE_ALIGNMENT_KEYS = [
  "expansion",
  "visibility",
  "consolidation",
  "foundation",
] as const;

export const CONTENT_COVERAGE = {
  wealthArchetypes: {
    keys: WEALTH_CODE_KEYS,
    complete: true,
    notes: "All four archetypes have distinct copy in wealth maps.",
  },
  phaseAlignmentMatrix: {
    rows: 4,
    cols: 4,
    complete: true,
    notes: "16/16 phase × wealth combinations populated.",
  },
  starBriefs: {
    keys: Object.keys(STAR_BRIEF),
    complete: false,
    notes: "Add simplified/traditional variants via resolvers.getStarBrief aliases.",
  },
  formations: {
    keys: Object.keys(FORMATION_PROFILES),
    complete: true,
    notes: "All detected formation keys have profiles.",
  },
  focusOn: {
    complete: true,
    wired: false,
    notes: "FOCUS_ON map is complete but not yet shown in UI.",
  },
} as const;
