import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

/**
 * Interface for PDF export progress
 */
interface PdfExportProgress {
  step: string;
  percentage: number;
  isComplete: boolean;
  error?: string;
}

/**
 * Props for PdfExportModal component
 */
interface PdfExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: PdfExportProgress;
  chartName: string;
}

/**
 * PdfExportModal component to display PDF export progress
 * Shows a professional modal with progress tracking during PDF generation
 */
const PdfExportModal: React.FC<PdfExportModalProps> = ({
  isOpen,
  onClose,
  progress,
  chartName,
}) => {
  const { t } = useLanguage();
  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && progress.isComplete) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onClose, progress.isComplete]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {progress.isComplete 
              ? progress.error 
                ? t("pdfExport.failed") || "Export Failed"
                : t("pdfExport.success") || "Export Complete"
              : t("pdfExport.exporting") || "Exporting PDF"
            }
          </h3>
          {progress.isComplete && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="text-center">
          {progress.error ? (
            // Error state
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-red-600 dark:text-red-400 mb-2 font-medium">
                {t("pdfExport.errorMessage") || "Failed to export PDF"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {progress.error}
              </p>
            </div>
          ) : progress.isComplete ? (
            // Success state
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-600 dark:text-green-400 mb-2 font-medium">
                {t("pdfExport.successMessage") || "PDF exported successfully!"}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("pdfExport.downloadStarted") || "Your download should start automatically."}
              </p>
            </div>
          ) : (
            // Loading state
            <div className="mb-6">
              <div className="mx-auto flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
              </div>
              <p className="text-blue-600 dark:text-blue-400 mb-2 font-medium">
                {progress.step}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {t("pdfExport.processingChart") || "Processing your chart data..."}
              </p>
            </div>
          )}

          {/* Progress Bar */}
          {!progress.isComplete && !progress.error && (
            <div className="mb-6">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
                <span>{t("pdfExport.progress") || "Progress"}</span>
                <span>{progress.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress.percentage}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Chart Name */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
              {t("pdfExport.chartName") || "Chart"}
            </p>
            <p className="font-medium text-gray-900 dark:text-white">
              {chartName}
            </p>
          </div>

          {/* Processing Steps */}
          {!progress.isComplete && !progress.error && (
            <div className="text-left">
              <div className="space-y-2">
                {[
                  t("pdfExport.step1") || "Preparing chart data...",
                  t("pdfExport.step2") || "Generating cover page...",
                  t("pdfExport.step3") || "Rendering chart visualization...",
                  t("pdfExport.step4") || "Optimizing for print...",
                  t("pdfExport.step5") || "Finalizing PDF..."
                ].map((step, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      {progress.percentage > (index + 1) * 20 ? (
                        <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      ) : progress.percentage > index * 20 ? (
                        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                      ) : (
                        <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                      )}
                    </div>
                    <span className={`text-sm ${
                      progress.percentage > index * 20 
                        ? "text-gray-900 dark:text-white" 
                        : "text-gray-500 dark:text-gray-400"
                    }`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          {progress.isComplete && (
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                {t("general.close") || "Close"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PdfExportModal; 