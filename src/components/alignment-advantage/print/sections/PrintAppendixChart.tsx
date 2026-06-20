import React from "react";
import { Compass, Layers } from "lucide-react";
import { SectionPill } from "../primitives/SectionPill";
import { OrnamentalDivider } from "../primitives/OrnamentalDivider";
import { IconCircle } from "../primitives/IconCircle";
import ZWDSChart from "../../../ZWDSChart";
import type { ChartData } from "../../../../utils/zwds/types";

export interface PrintAppendixChartProps {
  chartData: ChartData;
}

export const PrintAppendixChart: React.FC<PrintAppendixChartProps> = ({ chartData }) => (
  <section className="print-page-break print-avoid-break" aria-label="Appendix: ZWDS Chart" style={{ padding: "48px 0 32px" }}>
    <SectionPill>Appendix</SectionPill>
    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
      <IconCircle icon={Layers} />
      <h2 className="pp-heading" style={{ marginBottom: 0 }}>Your Full ZWDS Chart</h2>
    </div>
    <OrnamentalDivider />
    <p style={{ fontSize: 13, color: "#5c5c5c", marginBottom: 24, lineHeight: 1.6 }}>
      The complete mathematical model behind your Alignment Advantage Playbook.
    </p>

    <section className="print-page-break print-avoid-break" style={{ padding: "48px 0 32px" }}>
      <SectionPill>Your Chart</SectionPill>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 6 }}>
        <IconCircle icon={Compass} />
        <h2 className="pp-heading" style={{ marginBottom: 0 }}>Zi Wei Dou Shu Natal Chart</h2>
      </div>
      <OrnamentalDivider />
      <div style={{ marginTop: 16, overflow: "hidden" }}>
        <ZWDSChart
          chartData={chartData}
          isPdfExport={true}
          disableInteraction
          selectedDaXianControlled={null}
          selectedPalaceNameControlled={null}
          showMonthsControlled={null}
        />
      </div>
    </section>
  </section>
);
