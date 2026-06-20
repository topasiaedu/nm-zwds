import React from "react";
import { MessageSquare } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import type { AlignmentAdvantageData } from "../../data/types";

/** Subset of AlignmentAdvantageData required for the reflection questions page. */
export type PrintReflectionQuestionsProps = Pick<AlignmentAdvantageData, "dayunGuidance">;

export const PrintReflectionQuestions: React.FC<PrintReflectionQuestionsProps> = ({ dayunGuidance }) => {
  if (dayunGuidance === null) return null;

  const questions = dayunGuidance.reflectionQuestions ?? [];
  if (questions.length === 0) return null;

  return (
    <section className="print-page-break print-avoid-break" aria-label="Reflection Questions" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Strategic Reflection</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={MessageSquare} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Questions for This Season</h2>
      </div>
      <OrnamentalDivider />
      <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 32, lineHeight: 1.6 }}>
        Set aside 20 minutes with these questions. Your honest answers will clarify your next move.
      </p>
      <ol style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {questions.map((question, i) => (
          <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 0", borderBottom: "1px solid rgba(26,30,63,0.07)" }}>
            <span className="pp-num" style={{ flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1e3f", lineHeight: 1.6 }}>{question}</p>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: 28, background: "#f9f7fd", border: "1px solid rgba(107,91,149,0.14)", borderRadius: 12, padding: "16px 20px" }}>
        <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b5b95", marginBottom: 8 }}>How to Use These Questions</p>
        <p style={{ fontSize: 12, color: "#5c5c5c", lineHeight: 1.7 }}>
          Spend 20–30 minutes with these questions at the start of your season. Write your answers privately —
          not for anyone else to read. Honest reflection at the right moment is what separates strategic action
          from reactive movement. Return to your answers at the end of the season to measure how your thinking has evolved.
        </p>
      </div>
    </section>
  );
};
