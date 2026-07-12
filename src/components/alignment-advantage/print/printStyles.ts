/** Embedded CSS for Alignment Advantage PDF / print preview. */
export const PRINT_STYLES = `
  @page {
    size: A4;
    margin: 10mm 18mm 18mm 18mm;
  }

  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
    color-adjust: exact !important;
  }

  @media screen {
    .print-root {
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 48px;
    }
  }

  @media print {
    @page { size: A4; margin: 10mm 18mm 18mm 18mm; }

    html, body {
      background: #faf0e6 !important;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }

    .print-root {
      background: #faf0e6 !important;
      color: #1a1e3f !important;
      padding: 0 !important;
    }

    .print-hide {
      display: none !important;
    }

    .print-cover-page {
      page-break-after: always;
      break-after: page;
    }

    .print-page-break {
      break-before: page;
      page-break-before: always;
    }

    .print-avoid-break {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    [data-pdf-page-break-before] {
      break-before: page;
      page-break-before: always;
    }
  }

  .pp-heading {
    font-size: 26px;
    font-weight: 800;
    color: #1a1e3f;
    margin-bottom: 6px;
    line-height: 1.2;
    font-family: Georgia, 'Times New Roman', serif;
  }

  .pp-accent {
    color: #c9873a;
    font-style: italic;
    font-family: Georgia, 'Times New Roman', serif;
  }

  .pp-subheading {
    font-size: 13px;
    font-weight: 600;
    color: #1a1e3f;
    margin-bottom: 4px;
  }

  .pp-body {
    font-size: 12px;
    color: #3d3d3d;
    line-height: 1.75;
  }

  .pp-card {
    margin-bottom: 20px;
  }

  .pp-callout {
    background: #ffffff;
    border-left: 3px solid #c9873a;
    border-radius: 0 10px 10px 0;
    padding: 16px 20px;
    margin-bottom: 20px;
  }

  .pp-section-header {
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: #c9873a;
    border-bottom: 1px solid rgba(201,135,58,0.30);
    padding-bottom: 6px;
    margin-bottom: 12px;
  }

  .pp-row {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 12px 0;
    border-bottom: 1px solid rgba(26,30,63,0.07);
  }
  .pp-row:last-child {
    border-bottom: none;
  }

  .pp-num {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    min-width: 24px;
    border-radius: 50%;
    background: rgba(201,135,58,0.14);
    color: #c9873a;
    font-size: 11px;
    font-weight: 700;
  }

  .pp-dot-green  { background: #10b981; }
  .pp-dot-yellow { background: #f59e0b; }
  .pp-dot-red    { background: #f43f5e; }

  @media screen {
    .pp-global-footer { display: none !important; }
  }
  @media print {
    .pp-global-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 9999;
    }
  }
`;
