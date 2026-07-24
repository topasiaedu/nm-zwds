/**
 * Monthly Consultation print page entry — ChartSettingsProvider wrapper for PDF route.
 */

import React from "react";
import { ChartSettingsProvider } from "../../context/ChartSettingsContext";
import { MonthlyConsultationPrintDocument } from "../../components/monthly-consultation/print/MonthlyConsultationPrintDocument";

const MonthlyConsultationPrint: React.FC = () => (
  <ChartSettingsProvider defaultPageType="result">
    <MonthlyConsultationPrintDocument />
  </ChartSettingsProvider>
);

export default MonthlyConsultationPrint;
