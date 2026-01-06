/**
 * TypewriterText Component
 * Creates a typewriter effect that reveals text character by character
 */

import React, { useState, useEffect } from "react";

/**
 * Component props
 */
interface TypewriterTextProps {
  text: string; // Text to display
  speed?: number; // Milliseconds per character (default: 50)
  onComplete?: () => void; // Callback when typing is complete
  className?: string; // Additional CSS classes
  showCursor?: boolean; // Show blinking cursor (default: true)
}

/**
 * TypewriterText - Animated text reveal effect
 */
const TypewriterText: React.FC<TypewriterTextProps> = ({
  text,
  speed = 50,
  onComplete,
  className = "",
  showCursor = true
}) => {
  const [displayedText, setDisplayedText] = useState<string>("");
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  /**
   * Type out text character by character
   */
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return (): void => {
        clearTimeout(timeout);
      };
    } else if (currentIndex === text.length && !isComplete) {
      // Typing complete
      setIsComplete(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  /**
   * Reset when text changes
   */
  useEffect(() => {
    setDisplayedText("");
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <span className="animate-pulse ml-1">|</span>
      )}
    </span>
  );
};

export default TypewriterText;











