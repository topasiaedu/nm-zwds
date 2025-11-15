import React, { useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";

interface ConfirmationModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Title of the confirmation dialog */
  title: string;
  /** Message to display in the dialog */
  message: string;
  /** Text for the confirm button */
  confirmText?: string;
  /** Text for the cancel button */
  cancelText?: string;
  /** Callback when confirm is clicked */
  onConfirm: () => void;
  /** Callback when cancel is clicked */
  onCancel: () => void;
  /** Type of confirmation (affects button color) */
  type?: "danger" | "warning" | "info";
}

/**
 * ConfirmationModal component for displaying confirmation dialogs
 * Provides a modal dialog with confirm and cancel buttons
 */
const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = "danger",
}) => {
  const { t } = useLanguage();

  /**
   * Handle escape key to cancel
   */
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen, onCancel]);

  /**
   * Prevent body scroll when modal is open
   */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Determine button colors based on type
  const confirmButtonClass =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700 focus:ring-red-500"
      : type === "warning"
      ? "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500"
      : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="flex items-start mb-4">
          <div
            className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${
              type === "danger"
                ? "bg-red-100 dark:bg-red-900/30"
                : type === "warning"
                ? "bg-yellow-100 dark:bg-yellow-900/30"
                : "bg-blue-100 dark:bg-blue-900/30"
            } mr-4`}>
            <svg
              className={`h-6 w-6 ${
                type === "danger"
                  ? "text-red-600 dark:text-red-400"
                  : type === "warning"
                  ? "text-yellow-600 dark:text-yellow-400"
                  : "text-blue-600 dark:text-blue-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {message}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium focus:outline-none focus:ring-2 focus:ring-gray-500">
            {cancelText || t("general.cancel") || "Cancel"}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium focus:outline-none focus:ring-2 ${confirmButtonClass}`}>
            {confirmText || t("general.confirm") || "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;

