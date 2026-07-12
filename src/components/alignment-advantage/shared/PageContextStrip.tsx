import React from "react";
import { C } from "./constants";

/** One-line page position label for A4 report sheets. */
export const PageContextStrip: React.FC<{ label: string }> = ({ label }) => (
  <p
    className="text-[9px] font-bold uppercase tracking-[0.22em] mb-6 relative z-10"
    style={{ color: C.muted }}
  >
    {label}
  </p>
);
