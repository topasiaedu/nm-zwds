import type { CareerGroupKey, CareerPalaceProfile } from "./careerPalaceAnalysis";

export type TalentRoleAxis =
  | "Strategist"
  | "Executor"
  | "Creative"
  | "Analyst"
  | "Salesperson"
  | "Operations"
  | "Finance"
  | "People Ops";

export type RadarDatum = {
  role: TalentRoleAxis;
  icon: string;
  ideal: number; // 0–10: higher = higher hiring priority
};

export type CareerQuadrantPoint = {
  x: number;
  y: number;
  detail: string;
};

export type CareerQuadrantLabels = {
  topLeft: { title: string; subtitle: string };
  topRight: { title: string; subtitle: string };
  bottomLeft: { title: string; subtitle: string };
  bottomRight: { title: string; subtitle: string };
};

export type CareerQuadrantData = {
  point: CareerQuadrantPoint;
  labels: CareerQuadrantLabels;
};

const ROLE_AXES: ReadonlyArray<{ role: TalentRoleAxis; icon: string }> = [
  { role: "Strategist", icon: "💼" },
  { role: "Executor", icon: "⚙️" },
  { role: "Creative", icon: "🎨" },
  { role: "Analyst", icon: "📊" },
  { role: "Salesperson", icon: "🧲" },
  { role: "Operations", icon: "🏗️" },
  { role: "Finance", icon: "💰" },
  { role: "People Ops", icon: "🧑‍🤝‍🧑" },
];

const GROUP_AXIS_MAP: Record<CareerGroupKey, TalentRoleAxis[]> = {
  architect: ["Strategist", "Operations"],
  guardian: ["Finance", "Analyst"],
  catalyst: ["Salesperson", "Creative"],
  anchor: ["People Ops", "Executor"],
};

function clamp0To10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(10, value));
}

function clampMinus10To10(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.max(-10, Math.min(10, value));
}

function getGroupScore(profile: CareerPalaceProfile, key: CareerGroupKey): number {
  const match = profile.groupScores.find((g) => g.key === key);
  return match ? match.score : 0;
}

export function buildRadarData(profile: CareerPalaceProfile): RadarDatum[] {
  const axisScores: Record<TalentRoleAxis, number> = {
    Strategist: 0,
    Executor: 0,
    Creative: 0,
    Analyst: 0,
    Salesperson: 0,
    Operations: 0,
    Finance: 0,
    "People Ops": 0,
  };

  (Object.keys(GROUP_AXIS_MAP) as CareerGroupKey[]).forEach((key) => {
    const score = getGroupScore(profile, key);
    GROUP_AXIS_MAP[key].forEach((axis) => {
      axisScores[axis] += score;
    });
  });

  return ROLE_AXES.map(({ role, icon }) => {
    const raw = axisScores[role];
    const normalized = clamp0To10(raw / 2); // each axis can be touched by two groups max
    const ideal = clamp0To10(Number((10 - normalized).toFixed(1)));
    return { role, icon, ideal };
  });
}

function normalizeAxisDifference(diff: number, total: number): number {
  if (total <= 0) return 0;
  return clampMinus10To10((diff / total) * 10);
}

export function buildCareerQuadrant(profile: CareerPalaceProfile): CareerQuadrantData {
  const architect = getGroupScore(profile, "architect");
  const guardian = getGroupScore(profile, "guardian");
  const catalyst = getGroupScore(profile, "catalyst");
  const anchor = getGroupScore(profile, "anchor");

  const structure = architect + guardian;
  const momentum = catalyst + anchor;
  const drive = architect + catalyst;
  const support = guardian + anchor;
  const total = structure + momentum;

  const x = normalizeAxisDifference(momentum - structure, total);
  const y = normalizeAxisDifference(drive - support, total);

  const detailParts: string[] = [];
  if (structure > momentum) {
    detailParts.push("Leans toward structure and control (Architect/Guardian).");
  } else if (momentum > structure) {
    detailParts.push("Leans toward momentum and outreach (Catalyst/Anchor).");
  } else {
    detailParts.push("Balanced between structure and momentum.");
  }

  if (drive > support) {
    detailParts.push("Stronger on initiative and drive (Architect/Catalyst).");
  } else if (support > drive) {
    detailParts.push("Stronger on stability and support (Guardian/Anchor).");
  } else {
    detailParts.push("Balanced between drive and support.");
  }

  return {
    point: { x, y, detail: detailParts.join(" ") },
    labels: {
      topLeft: { title: "Architect", subtitle: "Structured drive and systems" },
      topRight: { title: "Catalyst", subtitle: "Momentum and decisive action" },
      bottomLeft: { title: "Guardian", subtitle: "Stable control and protection" },
      bottomRight: { title: "Anchor", subtitle: "Supportive people continuity" },
    },
  };
}

export function formatCareerAxis(axis: "x" | "y", value: number): string {
  const v = clamp0To10(Math.abs(value));
  if (axis === "x") {
    return value >= 0 ? `Momentum (+${v.toFixed(1)})` : `Structure (-${v.toFixed(1)})`;
  }
  return value >= 0 ? `Drive (+${v.toFixed(1)})` : `Support (-${v.toFixed(1)})`;
}
