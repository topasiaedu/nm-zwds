/**
 * Task Detail Modal Component
 * 
 * Displays detailed information about a selected business calendar task,
 * including the hook, action plan, and what to avoid.
 */

import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import type { BusinessCalendarTask } from "../../utils/zwds/analysis/businessCalendarPlans";

/**
 * Props for the TaskDetailModal component
 */
export interface TaskDetailModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Month label (e.g., "February 2026") */
  monthLabel: string;
  /** Wealth code label */
  wealthLabel: string;
  /** The task to display */
  task: BusinessCalendarTask | null;
  /** Callback to close the modal */
  onClose: () => void;
}

/**
 * Process inline formatting for a single line: backticks for code, bold markers
 */
function processInlineFormatting(text: string): JSX.Element {
  const parts: JSX.Element[] = [];
  let key = 0;
  
  // Handle backtick code blocks
  const codeRegex = /`([^`]+)`/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  
  while ((match = codeRegex.exec(text)) !== null) {
    // Add text before code
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      if (beforeText) {
        // Check for **bold** in the before text
        const boldParts = beforeText.split(/(\*\*[^*]+\*\*)/g);
        boldParts.forEach((part) => {
          if (part.startsWith("**") && part.endsWith("**")) {
            const boldText = part.slice(2, -2);
            parts.push(<strong key={key++} className="font-bold">{boldText}</strong>);
          } else if (part) {
            parts.push(<span key={key++}>{part}</span>);
          }
        });
      }
    }
    
    // Add code block
    parts.push(
      <code 
        key={key++} 
        className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-800 dark:text-gray-200"
      >
        {match[1]}
      </code>
    );
    
    lastIndex = match.index + match[0].length;
  }
  
  // Add remaining text
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    // Check for **bold** in remaining text
    const boldParts = remainingText.split(/(\*\*[^*]+\*\*)/g);
    boldParts.forEach((part) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2);
        parts.push(<strong key={key++} className="font-bold">{boldText}</strong>);
      } else if (part) {
        parts.push(<span key={key++}>{part}</span>);
      }
    });
  }
  
  return <>{parts.length > 0 ? parts : text}</>;
}

/**
 * Render formatted text with support for:
 * - ARROW FORMAT: "Main → Context → Outcome" (for legacy avoidPoints)
 * - NEW FORMAT: Newlines, bullets, code, bold, templates (for updated actions)
 */
function renderFormattedText(text: string, isAvoidPoint: boolean = false): JSX.Element {
  // Check if using arrow format (legacy)
  if (text.includes("→")) {
    const parts = text.split("→").map((p) => p.trim());
    
    if (parts.length === 1) {
      return <div className="leading-relaxed">{processInlineFormatting(parts[0])}</div>;
    } else if (parts.length >= 2) {
      return (
        <div className="space-y-2">
          {/* Main point - Bold */}
          <div className="font-semibold leading-relaxed">
            {processInlineFormatting(parts[0])}
          </div>
          
          {/* Middle context parts */}
          {parts.slice(1, -1).map((part, idx) => (
            <div 
              key={idx}
              className={`text-sm leading-relaxed pl-3 border-l-2 ${
                isAvoidPoint 
                  ? "border-amber-200 dark:border-amber-700/40 text-amber-700 dark:text-amber-300" 
                  : "border-green-200 dark:border-green-700/40 text-gray-600 dark:text-gray-400"
              }`}
            >
              {processInlineFormatting(part)}
            </div>
          ))}
          
          {/* Final outcome - Badge */}
          {parts.length > 1 && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border ${
              isAvoidPoint
                ? "bg-red-100/80 dark:bg-red-900/40 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700/40"
                : "bg-green-100/80 dark:bg-green-900/40 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700/40"
            }`}>
              <span className="text-base">{isAvoidPoint ? "⚠️" : "💡"}</span>
              <span>{processInlineFormatting(parts[parts.length - 1])}</span>
            </div>
          )}
        </div>
      );
    }
  }
  
  // NEW FORMAT: Handle newlines and bullets
  const lines = text.split("\n").map((line) => line.trim()).filter((line) => line.length > 0);
  
  return (
    <div className="space-y-2">
      {lines.map((line, lineIdx) => {
        const isBullet = line.startsWith("•");
        const isNumbered = /^\d+\)/.test(line);
        
        // Remove bullet/number prefix if present
        const cleanLine = isBullet 
          ? line.substring(1).trim() 
          : isNumbered 
          ? line.replace(/^\d+\)\s*/, "") 
          : line;
        
        const content = processInlineFormatting(cleanLine);
        
        // Render based on line type
        if (isBullet || isNumbered) {
          return (
            <div key={lineIdx} className="flex items-start gap-2 pl-2">
              <span className={`font-bold flex-shrink-0 mt-0.5 ${
                isAvoidPoint ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
              }`}>•</span>
              <span className="flex-1">{content}</span>
            </div>
          );
        } else if (cleanLine.startsWith('"') && cleanLine.endsWith('"')) {
          // Template/Script block
          const quotedText = cleanLine.slice(1, -1);
          return (
            <div key={lineIdx} className={`pl-3 border-l-2 rounded-r px-3 py-2 text-sm italic ${
              isAvoidPoint
                ? "border-amber-300 dark:border-amber-600 bg-amber-50/50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-300"
                : "border-green-300 dark:border-green-600 bg-green-50/50 dark:bg-green-900/10 text-gray-700 dark:text-gray-300"
            }`}>
              {quotedText}
            </div>
          );
        } else {
          // Regular text
          return (
            <div key={lineIdx} className="leading-relaxed">{content}</div>
          );
        }
      })}
    </div>
  );
}

/**
 * TaskDetailModal component
 */
export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  isOpen,
  monthLabel,
  wealthLabel,
  task,
  onClose,
}) => {
  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent): void => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !task) return null;

  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="presentation"
      style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
    >
      <div
        className="relative w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl flex flex-col"
        style={{ maxHeight: "90vh", height: "90vh", borderRadius: "16px" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="business-calendar-modal-title"
      >
        {/* Close Button - Better positioned */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
          aria-label="Close modal"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Fixed Header */}
        <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-8 pt-10 flex-shrink-0" style={{ borderRadius: "16px 16px 0 0" }}>
          <div className="flex items-start justify-between mb-3 pr-12">
            <div className="text-xs uppercase tracking-widest text-white/80 font-bold">
              {monthLabel}
            </div>
            {/* Impact Badge - Compact version */}
            <div
              className={`px-2.5 py-1 rounded-lg text-xs font-bold text-white shrink-0 ${
                task.impact === "high"
                  ? "bg-red-500/90"
                  : task.impact === "quick-win"
                  ? "bg-green-500/90"
                  : "bg-blue-500/90"
              }`}
            >
              {task.impact === "high" ? "🔥 High" : task.impact === "quick-win" ? "⚡ Quick" : "📊 Medium"}
            </div>
          </div>
          <h2 id="business-calendar-modal-title" className="text-3xl md:text-4xl font-bold text-white mb-3">
            {task.title}
          </h2>
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/30 backdrop-blur-sm text-white font-semibold text-sm">
              {wealthLabel} • {task.duration} {task.duration === 1 ? "day" : "days"}
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-sm">
              📋 Task {task.taskNum} of 10
            </div>
          </div>
          {/* Hook/Story */}
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white/95 text-sm md:text-base italic leading-relaxed">
            &ldquo;{task.hook}&rdquo;
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-6 md:p-8 space-y-8">
            {/* Action Plan */}
            <div className="rounded-2xl border-2 border-green-200 dark:border-green-700/40 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 md:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-green-500 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                  ✓
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{"Action Plan"}</h3>
                <div className="ml-auto text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-800/40 px-3 py-1 rounded-full">
                  {task.actions.length} steps
                </div>
              </div>
              <ul className="space-y-6">
                {task.actions.map((action, idx) => (
                  <li key={`${action}-${idx}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1 text-gray-900 dark:text-white text-sm md:text-base">
                      {renderFormattedText(action)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* What to Avoid */}
            <div className="rounded-2xl border-2 border-amber-200 dark:border-amber-700/40 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 p-6 md:p-7">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 text-white flex items-center justify-center text-xl font-bold shadow-lg">
                  ⚠
                </div>
                <h3 className="text-xl font-bold text-amber-900 dark:text-amber-200">{"What to Avoid"}</h3>
                <div className="ml-auto text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-800/40 px-3 py-1 rounded-full">
                  {task.avoidPoints.length} traps
                </div>
              </div>
              <ul className="space-y-6">
                {task.avoidPoints.map((avoidPoint, idx) => (
                  <li key={`${avoidPoint}-${idx}`} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br from-red-500 to-orange-600 text-white text-xs font-bold flex items-center justify-center shadow-sm">
                      {idx + 1}
                    </span>
                    <div className="flex-1 text-amber-900 dark:text-amber-200 text-sm md:text-base">
                      {renderFormattedText(avoidPoint, true)}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default TaskDetailModal;
