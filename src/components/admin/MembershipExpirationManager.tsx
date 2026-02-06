import React, { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  addYears,
  endOfDay,
  format,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

/**
 * Props for the MembershipExpirationManager modal component.
 */
export interface MembershipExpirationManagerProps {
  /** The user ID whose expiration is being edited. */
  userId: string;
  /** Current expiration ISO string or null for unlimited. */
  currentExpiration: string | null;
  /** Human-friendly name for the user. */
  userName: string;
  /** Persist changes for the user. */
  onSave: (expiration: string | null) => Promise<void>;
  /** Close the modal without saving. */
  onClose: () => void;
}

type QuickSetOption = {
  id: string;
  label: string;
  getDate: (baseDate: Date) => Date | null;
};

/**
 * Modal component for managing membership expiration.
 */
const MembershipExpirationManager: React.FC<MembershipExpirationManagerProps> = ({
  userId,
  currentExpiration,
  userName,
  onSave,
  onClose,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const today = useMemo(() => startOfDay(new Date()), []);
  const currentExpirationDate = useMemo(() => {
    if (!currentExpiration) {
      return null;
    }
    const parsed = parseISO(currentExpiration);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }, [currentExpiration]);

  const isCurrentlyExpired = useMemo(() => {
    if (!currentExpirationDate) {
      return false;
    }
    return isBefore(startOfDay(currentExpirationDate), today);
  }, [currentExpirationDate, today]);

  const quickSetOptions = useMemo<QuickSetOption[]>(
    () => [
      {
        id: "seven-days",
        label: "7 Days",
        getDate: (base) => addDays(base, 7),
      },
      {
        id: "one-month",
        label: "1 Month",
        getDate: (base) => addMonths(base, 1),
      },
      {
        id: "three-months",
        label: "3 Months",
        getDate: (base) => addMonths(base, 3),
      },
      {
        id: "six-months",
        label: "6 Months",
        getDate: (base) => addMonths(base, 6),
      },
      {
        id: "one-year",
        label: "1 Year",
        getDate: (base) => addYears(base, 1),
      },
      {
        id: "unlimited",
        label: "Unlimited",
        getDate: () => null,
      },
    ],
    []
  );

  /**
   * Sync local state when modal opens.
   */
  useEffect(() => {
    setSelectedDate(currentExpirationDate);
    setErrorMessage(null);
    setSuccessMessage(null);
  }, [currentExpirationDate, userId]);

  /**
   * Prevent background scrolling while the modal is visible.
   */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  /**
   * Convert a date to a YYYY-MM-DD value for date inputs.
   */
  const formatDateInputValue = (dateValue: Date | null): string => {
    if (!dateValue) {
      return "";
    }
    return format(dateValue, "yyyy-MM-dd");
  };

  /**
   * Validate and persist the selected expiration.
   */
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (selectedDate && isBefore(startOfDay(selectedDate), today)) {
        setErrorMessage("Expiration cannot be set in the past.");
        return;
      }

      const payload = selectedDate ? endOfDay(selectedDate).toISOString() : null;
      await onSave(payload);
      setSuccessMessage("Membership expiration updated.");
    } catch (error) {
      if (error instanceof Error && error.message.trim().length > 0) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Failed to update expiration. Please try again.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Update date state from the date picker.
   */
  const handleDateChange = (value: string) => {
    if (!value) {
      setSelectedDate(null);
      return;
    }
    const parsed = new Date(`${value}T00:00:00`);
    if (Number.isNaN(parsed.getTime())) {
      setSelectedDate(null);
      return;
    }
    setSelectedDate(parsed);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="membership-expiration-title"
      >
        <div className="flex items-start justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3
              id="membership-expiration-title"
              className="text-xl font-bold text-gray-900 dark:text-white"
            >
              Membership Expiration
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Managing expiration for {userName} ({userId.substring(0, 8)}...)
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors disabled:opacity-50"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[65vh]">
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/40">
            <div className="flex items-start justify-between flex-wrap gap-2">
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Current Status
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {currentExpirationDate
                    ? `Expires on ${format(currentExpirationDate, "PPP")}`
                    : "Unlimited membership"}
                </p>
              </div>
              {isCurrentlyExpired && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200">
                  Expired
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Quick Set
            </p>
            <div className="flex flex-wrap gap-2">
              {quickSetOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelectedDate(option.getDate(today))}
                  disabled={isSaving}
                  className="px-3 py-1.5 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200 rounded-md hover:bg-indigo-200 dark:hover:bg-indigo-900/60 transition-colors disabled:opacity-50"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              Custom Date
            </p>
            <input
              type="date"
              value={formatDateInputValue(selectedDate)}
              min={format(today, "yyyy-MM-dd")}
              onChange={(event) => handleDateChange(event.target.value)}
              disabled={isSaving}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Select a future date or use Unlimited for lifetime access.
            </p>
          </div>

          {(successMessage || errorMessage) && (
            <div
              className={`rounded-lg border px-4 py-3 text-sm ${
                successMessage
                  ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200"
                  : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200"
              }`}
              role="status"
            >
              {successMessage || errorMessage}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-750">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving && (
              <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            )}
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default MembershipExpirationManager;
