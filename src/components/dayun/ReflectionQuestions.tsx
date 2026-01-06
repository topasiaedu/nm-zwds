/**
 * Reflection Questions Component
 * 
 * Collapsible section with thought-provoking questions to help users
 * examine their current situation. Default state is closed.
 */

import React, { useState } from "react";

interface ReflectionQuestionsProps {
  questions: string[];
}

/**
 * ReflectionQuestions component provides deep reflection prompts for the user
 */
export const ReflectionQuestions: React.FC<ReflectionQuestionsProps> = ({ questions }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-2xl shadow-lg border p-6 mb-6 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border-indigo-200 dark:border-indigo-700/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg">?</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
              Reflection Questions
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              Take a moment to examine your situation
            </p>
          </div>
        </div>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      {isOpen && (
        <div className="mt-5 space-y-3">
          {questions.map((question, idx) => (
            <div 
              key={idx} 
              className="flex items-start gap-3 p-4 rounded-lg bg-white/60 dark:bg-gray-800/50 border border-indigo-200 dark:border-gray-700"
            >
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                <span className="text-white text-xs font-bold">{idx + 1}</span>
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                {question}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
