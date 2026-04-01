import type { CSSProperties } from "react";

/**
 * Inline styles for small numeric badges (e.g. "01", "02") when rendering for html2canvas.
 * Flexbox vertical centering is often measured incorrectly in capture; matching lineHeight to
 * box height yields stable vertical alignment in exported PDFs.
 *
 * @param accentColor - Foreground color for the badge digits (e.g. section accent).
 * @returns Strict CSSProperties for a numeric badge span.
 */
export function pdfCaptureNumericBadgeStyle(accentColor: string): CSSProperties {
  return {
    background: "rgba(255, 255, 255, 0.9)",
    color: accentColor,
    height: "32px",
    minWidth: "48px",
    padding: "0 12px",
    borderRadius: "8px",
    fontSize: "18px",
    fontWeight: "800",
    lineHeight: "32px",
    display: "inline-block",
    textAlign: "center",
    boxSizing: "border-box",
    fontFamily: "inherit",
    verticalAlign: "middle",
  };
}
