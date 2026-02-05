import React from "react";
import {
  CartesianGrid,
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

/**
 * Custom dot shape for the scatter point with glowing ring effect.
 * Makes the founder point highly visible without animation conflicts.
 */
const GlowDot: React.FC<{
  cx?: number;
  cy?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}> = ({ cx, cy, fill, stroke, strokeWidth }) => {
  if (cx === undefined || cy === undefined) return null;

  return (
    <g>
      {/* Outer glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={20}
        fill={fill}
        opacity={0.15}
      />
      {/* Middle glow ring */}
      <circle
        cx={cx}
        cy={cy}
        r={14}
        fill={fill}
        opacity={0.3}
      />
      {/* Inner bright ring */}
      <circle
        cx={cx}
        cy={cy}
        r={11}
        fill={fill}
        opacity={0.5}
      />
      {/* Core dot */}
      <circle
        cx={cx}
        cy={cy}
        r={9}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth || 3}
      />
    </g>
  );
};

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
  // Increase z-value to make the point much larger and more visible
  const founderPoint: CareerQuadrantPoint & { z: number } = { ...point, z: 300 };
  const guidance = buildLaymanGuidance(point);
  
  /**
   * Generate natural language axis descriptions
   */
  const getAxisExplanation = (): string => {
    const xDirection = point.x >= 0 
      ? "you lean toward creating momentum, external growth, and fast action"
      : "you lean toward internal support, steady processes, and structured control";
    const yDirection = point.y >= 0
      ? "you lead with initiative and decisive forward push"
      : "you lead with stability, people focus, and team cohesion";
    
    return `Your chart shows ${xDirection}, and ${yDirection}.`;
  };

  return (
    <SectionCard title="Leadership Quadrant" subtitle="Career Palace leadership positioning">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left: Quadrant Chart */}
        <div className="lg:col-span-3">
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
                <ZAxis type="number" dataKey="z" range={[200, 400]} />
                <ReferenceLine x={0} stroke="#94a3b8" opacity={0.6} />
                <ReferenceLine y={0} stroke="#94a3b8" opacity={0.6} />
                <RechartsTooltip content={<QuadrantTooltip />} />

                <Scatter 
                  name="Your Position" 
                  data={[founderPoint]} 
                  fill="#7c3aed" 
                  stroke="#4f46e5" 
                  strokeWidth={3}
                  shape={<GlowDot />}
                />
              </ScatterChart>
            </ResponsiveContainer>

            {/* Integrated Legend Badge */}
            <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-2 shadow-sm">
              <div className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full bg-purple-600" 
                  style={{ boxShadow: "0 0 8px rgba(124, 58, 237, 0.5)" }}
                />
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Your Position</span>
              </div>
            </div>

            <div className="pointer-events-none absolute inset-0 px-3 py-3">
              <div className="absolute left-3 top-3 text-xs leading-snug text-gray-600 dark:text-gray-300">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{labels.topLeft.title}</div>
                <div className="font-medium">{labels.topLeft.subtitle}</div>
              </div>
              <div className="absolute right-3 top-3 text-xs leading-snug text-right text-gray-600 dark:text-gray-300">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{labels.topRight.title}</div>
                <div className="font-medium">{labels.topRight.subtitle}</div>
              </div>
              <div className="absolute left-3 bottom-10 text-xs leading-snug text-gray-600 dark:text-gray-300">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{labels.bottomLeft.title}</div>
                <div className="font-medium">{labels.bottomLeft.subtitle}</div>
              </div>
              <div className="absolute right-3 bottom-10 text-xs leading-snug text-right text-gray-600 dark:text-gray-300">
                <div className="font-semibold text-gray-900 dark:text-gray-100">{labels.bottomRight.title}</div>
                <div className="font-medium">{labels.bottomRight.subtitle}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Guidance Boxes */}
        <div className="lg:col-span-2 flex flex-col justify-center space-y-4">
          <div className="rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{"🧭"}</span>
              <h4 className="font-extrabold text-gray-900 dark:text-gray-100 text-sm">{"Your Leadership Style"}</h4>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-3">
              {guidance.profile}
            </p>
            <div className="text-xs text-gray-600 dark:text-gray-400 pt-3 border-t border-indigo-200 dark:border-indigo-800 leading-relaxed">
              <div className="font-semibold text-gray-800 dark:text-gray-200 mb-1">{"Chart Position Explained:"}</div>
              {getAxisExplanation()}
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{"✓"}</span>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{"What to Hire For"}</h4>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {guidance.lookFor}
            </p>
          </div>

          <div className="rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{"⚠"}</span>
              <h4 className="font-extrabold text-gray-900 dark:text-white text-sm">{"Look Out For"}</h4>
            </div>
            <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
              {guidance.watchOut}
            </p>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default LeadershipQuadrant;
