/**
 * Alignment Advantage — Strategic Playbook Print Page
 *
 * Thin entrypoint: ChartSettingsProvider wrapper for PDF export route.
 * All layout, auth, and section composition live in AlignmentAdvancePrintDocument.
 */

import React from "react";
import { ChartSettingsProvider } from "../../context/ChartSettingsContext";
import { AlignmentAdvancePrintDocument } from "../../components/alignment-advantage/print/AlignmentAdvancePrintDocument";

const AlignmentAdvancePrint: React.FC = () => (
  <ChartSettingsProvider defaultPageType="result">
    <AlignmentAdvancePrintDocument />
  </ChartSettingsProvider>
);

export default AlignmentAdvancePrint;
