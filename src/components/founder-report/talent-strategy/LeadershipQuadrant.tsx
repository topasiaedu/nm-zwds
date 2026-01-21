import React from "react";
import {
  CartesianGrid,
  Legend,
  ReferenceArea,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import type { CareerQuadrantData, CareerQuadrantPoint } from "../../../utils/zwds/analysis/talentStrategyData";
import { formatCareerAxis } from "../../../utils/zwds/analysis/talentStrategyData";
import SectionCard from "./SectionCard";

type RechartsPayload<T> = { payload: T };

const QuadrantTooltip: React.FC<{
  active?: boolean;
  payload?: Array<RechartsPayload<CareerQuadrantPoint>>;
}> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0].payload;
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl rounded-xl p-4 max-w-sm">
      <div className="font-bold text-gray-900 dark:text-white mb-1">Founder</div>
      <div className="text-xs text-gray-600 dark:text-gray-300 space-y-1">
        <div>{`X: ${formatCareerAxis("x", p.x)}`}</div>
        <div>{`Y: ${formatCareerAxis("y", p.y)}`}</div>
        <div className="pt-1 border-t border-gray-200 dark:border-gray-700">{p.detail}</div>
      </div>
    </div>
  );
};

type LeadershipQuadrantProps = {
  quadrantData: CareerQuadrantData;
  hasRecognizedStars: boolean;
};

function buildLaymanGuidance(point: CareerQuadrantPoint): {
  profile: string;
  lookFor: string;
  watchOut: string;
} {
  const leansMomentum = point.x >= 0;
  const leansDrive = point.y >= 0;

  const profileParts: string[] = [];
  const lookForParts: string[] = [];
  const watchOutParts: string[] = [];

  if (leansMomentum) {
    profileParts.push("You move fast, create momentum, and enjoy external push.");
    lookForParts.push("Hire people who bring structure, steady process, and internal control.");
    watchOutParts.push("Avoid teams that are all hype with no system.");
  } else {
    profileParts.push("You are structured, controlled, and prefer clear systems.");
    lookForParts.push("Hire people who create momentum and open external doors.");
    watchOutParts.push("Avoid teams that are too slow or overly cautious.");
  }

  if (leansDrive) {
    profileParts.push("You lead with initiative and decisive action.");
    lookForParts.push("Add support roles that stabilize delivery and team continuity.");
    watchOutParts.push("Avoid rushing decisions without support checks.");
  } else {
    profileParts.push("You lead with support, stability, and people focus.");
    lookForParts.push("Add high-drive leaders who push decisions and growth.");
    watchOutParts.push("Avoid staying in comfort and delaying action.");
  }

  return {
    profile: profileParts.join(" "),
    lookFor: lookForParts.join(" "),
    watchOut: watchOutParts.join(" "),
  };
}

const LeadershipQuadrant: React.FC<LeadershipQuadrantProps> = ({ quadrantData, hasRecognizedStars }) => {
  if (!hasRecognizedStars) {
    return (
      <SectionCard title="Leadership Quadrant" subtitle="Career Palace leadership positioning">
        <div className="text-sm text-gray-600 dark:text-gray-400 text-center py-8">
          No recognized Career Palace stars found for this section.
        </div>
      </SectionCard>
    );
  }

  const { point, labels } = quadrantData;
  const founderPoint: CareerQuadrantPoint & { z: number } = { ...point, z: 120 };
  const guidance = buildLaymanGuidance(point);

  return (
    <SectionCard title="Leadership Quadrant" subtitle="Career Palace leadership positioning">
      <div className="relative w-full h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 30, left: 10 }}>
            <ReferenceArea x1={-10} x2={0} y1={0} y2={10} fill="rgba(79, 70, 229, 0.10)" />
            <ReferenceArea x1={0} x2={10} y1={0} y2={10} fill="rgba(124, 58, 237, 0.10)" />
            <ReferenceArea x1={-10} x2={0} y1={-10} y2={0} fill="rgba(30, 64, 175, 0.08)" />
            <ReferenceArea x1={0} x2={10} y1={-10} y2={0} fill="rgba(147, 51, 234, 0.08)" />

            <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
            <XAxis type="number" dataKey="x" domain={[-10, 10]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <YAxis type="number" dataKey="y" domain={[-10, 10]} tick={{ fill: "#94a3b8", fontSize: 11 }} />
            <ZAxis type="number" dataKey="z" range={[80, 240]} />
            <ReferenceLine x={0} stroke="#94a3b8" opacity={0.6} />
            <ReferenceLine y={0} stroke="#94a3b8" opacity={0.6} />
            <RechartsTooltip content={<QuadrantTooltip />} />
            <Legend />

            <Scatter name="Founder" data={[founderPoint]} fill="#7c3aed" stroke="#4f46e5" />
          </ScatterChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 px-3 py-3">
          <div className="absolute left-3 top-3 text-[10px] leading-snug text-gray-600 dark:text-gray-300">
            <div className="font-bold text-gray-900 dark:text-gray-100">{labels.topLeft.title}</div>
            <div>{labels.topLeft.subtitle}</div>
          </div>
          <div className="absolute right-3 top-3 text-[10px] leading-snug text-right text-gray-600 dark:text-gray-300">
            <div className="font-bold text-gray-900 dark:text-gray-100">{labels.topRight.title}</div>
            <div>{labels.topRight.subtitle}</div>
          </div>
          <div className="absolute left-3 bottom-10 text-[10px] leading-snug text-gray-600 dark:text-gray-300">
            <div className="font-bold text-gray-900 dark:text-gray-100">{labels.bottomLeft.title}</div>
            <div>{labels.bottomLeft.subtitle}</div>
          </div>
          <div className="absolute right-3 bottom-10 text-[10px] leading-snug text-right text-gray-600 dark:text-gray-300">
            <div className="font-bold text-gray-900 dark:text-gray-100">{labels.bottomRight.title}</div>
            <div>{labels.bottomRight.subtitle}</div>
          </div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">Your leadership style</div>
          <div className="leading-relaxed">{guidance.profile}</div>
          <div className="mt-2 text-[11px] text-gray-500 dark:text-gray-500">
            {`Axis: ${formatCareerAxis("x", point.x)} · ${formatCareerAxis("y", point.y)}`}
          </div>
        </div>
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
          <div className="font-bold text-gray-900 dark:text-gray-100 mb-1">What to hire for</div>
          <div className="leading-relaxed">{guidance.lookFor}</div>
          <div className="mt-3 font-bold text-gray-900 dark:text-gray-100">Look out for</div>
          <div className="leading-relaxed">{guidance.watchOut}</div>
        </div>
      </div>
    </SectionCard>
  );
};

export default LeadershipQuadrant;
