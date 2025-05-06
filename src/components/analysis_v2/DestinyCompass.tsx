import React, { useState, useEffect, useRef, useMemo } from "react";
import { Badge } from "flowbite-react";

/**
 * Type definition for a year card data
 */
type YearCardData = {
  year: number;
  badges: {
    text: string;
    color: string;
  }[];
  description: string[];
};

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

/**
 * DestinyCompass component showing year predictions in a carousel
 */
const DestinyCompass: React.FC = () => {
  // Generate years array (2025 +/- 20 years)
  const baseYear = 2025;
  const years = Array.from({ length: 41 }, (_, i) => baseYear - 20 + i);
  
  // Current year index state
  const [currentIndex, setCurrentIndex] = useState(20); // Start at 2025 (index 20)
  const [previousIndex, setPreviousIndex] = useState(20); // Track previous index for animation
  const [direction, setDirection] = useState<"left" | "right" | null>(null); // Track direction for animation
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Badge options
  const badgeOptions = [
    { text: "Parents", color: "success" },  // Green
    { text: "Life", color: "info" },        // Blue
    { text: "Children", color: "warning" }, // Yellow
    { text: "Travel", color: "failure" }    // Red
  ];

  // Description paragraphs
  const baseDescriptionText = [
    "You're beginning to truly enjoy life, not just survive it. Your desire to live with purpose is growing stronger, and you're no longer willing to settle. ",
    "You're starting to crave mastery over your emotions, mindset, and spiritual state. You no longer want to be someone pushed around by your feelings—you want to direct your own energy flow.",
    "Your expertise, ideas, and self-expression are gaining visibility and recognition in your circles. You're no longer just \"someone's friend\"—you're becoming \"a brand worth collaborating with.\"",
    "You may go through relationship turbulence—cut-offs, conflicts, fallouts, or disconnections. But this isn't misfortune—it's fate helping you \"cut the cords\" that no longer serve you."
  ];

  // Generate randomized data for each year card
  const yearCards: YearCardData[] = useMemo(() => {
    return years.map(year => {
      // Generate a seed based on the year for consistent randomization
      const seed = year % 12345;
      
      // Shuffle badges (with seed)
      const shuffledBadges = shuffleArray([...badgeOptions]);
      
      // Slightly modify descriptions for each year
      const modifiedDescriptions = baseDescriptionText.map(text => {
        // Add year-specific phrase somewhere in the text
        const phrases = [
          `In ${year},`,
          `As you approach ${year},`,
          `By ${year},`,
          `During ${year},`
        ];
        
        // Pick a phrase based on the year
        const phraseIndex = (year + seed) % phrases.length;
        const selectedPhrase = phrases[phraseIndex];
        
        // Insert at a semi-random position
        const insertPosition = (year + seed) % 3 === 0 ? 0 : text.indexOf('.') + 2;
        
        if (insertPosition <= 0) {
          return `${selectedPhrase} ${text}`;
        } else {
          return `${text.substring(0, insertPosition)} ${selectedPhrase.toLowerCase()} ${text.substring(insertPosition)}`;
        }
      });
      
      // Sometimes shuffle the order of descriptions
      const finalDescriptions = (year % 3 === 0) 
        ? shuffleArray([...modifiedDescriptions])
        : modifiedDescriptions;
      
      return {
        year,
        badges: shuffledBadges,
        description: finalDescriptions
      };
    });
  }, [years]);

  // Effect to handle animation when currentIndex changes
  useEffect(() => {
    if (previousIndex !== currentIndex) {
      const newDirection = previousIndex > currentIndex ? "left" : "right";
      setDirection(newDirection);
      setIsAnimating(true);
      
      // Reset animation state after animation completes
      const timer = setTimeout(() => {
        setIsAnimating(false);
        setPreviousIndex(currentIndex);
      }, 300); // Match this with CSS transition duration
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, previousIndex]);

  // Handle slider change
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newIndex = parseInt(e.target.value);
    setPreviousIndex(currentIndex);
    setCurrentIndex(newIndex);
  };

  // Handlers for mouse/touch dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setStartX(e.pageX - (carouselRef.current?.offsetLeft || 0));
    setScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  const handleMouseUp = () => {
    if (isDragging) {
      setIsDragging(false);
      // Snap to nearest card
      if (carouselRef.current) {
        const cardWidth = carouselRef.current.offsetWidth;
        const scrollPosition = carouselRef.current.scrollLeft;
        const newIndex = Math.round(scrollPosition / cardWidth);
        setPreviousIndex(currentIndex);
        setCurrentIndex(Math.min(Math.max(0, newIndex), years.length - 1));
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - (carouselRef.current?.offsetLeft || 0);
    const walk = (x - startX) * 2; // Scroll speed multiplier
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = scrollLeft - walk;
    }
  };

  // Navigate to previous year
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setPreviousIndex(currentIndex);
      setCurrentIndex(currentIndex - 1);
    }
  };

  // Navigate to next year
  const goToNext = () => {
    if (currentIndex < years.length - 1) {
      setPreviousIndex(currentIndex);
      setCurrentIndex(currentIndex + 1);
    }
  };

  // Get animation classes for main card
  const getMainCardClasses = () => {
    if (!isAnimating) return "transform-none";
    return direction === "left" 
      ? "animate-slide-in-right" 
      : "animate-slide-in-left";
  };

  // Get animation classes for previous card
  const getPrevCardClasses = () => {
    if (!isAnimating) return "";
    return direction === "left"
      ? "animate-fade-in-left"
      : "animate-fade-out-left";
  };

  // Get animation classes for next card
  const getNextCardClasses = () => {
    if (!isAnimating) return "";
    return direction === "right"
      ? "animate-fade-in-right"
      : "animate-fade-out-right";
  };

  return (
    <div className="p-6 dark:bg-gray-900">
      <style>
        {`
         @keyframes slideInRight {
           from { transform: translateX(50px); opacity: 0; }
           to { transform: translateX(0); opacity: 1; }
         }
         
         @keyframes slideInLeft {
           from { transform: translateX(-50px); opacity: 0; }
           to { transform: translateX(0); opacity: 1; }
         }
         
         @keyframes fadeInLeft {
           from { opacity: 0; transform: translateX(-30px); }
           to { opacity: 0.4; transform: translateX(-25%); }
         }
         
         @keyframes fadeOutLeft {
           from { opacity: 0.4; transform: translateX(-25%); }
           to { opacity: 0; transform: translateX(-40px); }
         }
         
         @keyframes fadeInRight {
           from { opacity: 0; transform: translateX(30px); }
           to { opacity: 0.4; transform: translateX(25%); }
         }
         
         @keyframes fadeOutRight {
           from { opacity: 0.4; transform: translateX(25%); }
           to { opacity: 0; transform: translateX(40px); }
         }
         
         .animate-slide-in-right {
           animation: slideInRight 300ms ease-out forwards;
         }
         
         .animate-slide-in-left {
           animation: slideInLeft 300ms ease-out forwards;
         }
         
         .animate-fade-in-left {
           animation: fadeInLeft 300ms ease-out forwards;
         }
         
         .animate-fade-out-left {
           animation: fadeOutLeft 300ms ease-out forwards;
         }
         
         .animate-fade-in-right {
           animation: fadeInRight 300ms ease-out forwards;
         }
         
         .animate-fade-out-right {
           animation: fadeOutRight 300ms ease-out forwards;
         }
        `}
      </style>

      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        Destiny Compass
      </h2>

      {/* Year Navigation Controls */}
      <div className="flex items-center justify-center mb-6">
        <button 
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="mx-4 text-2xl font-bold text-purple-700 dark:text-purple-300">
          {years[currentIndex]}
        </span>
        <button 
          onClick={goToNext}
          disabled={currentIndex === years.length - 1}
          className="p-2 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300 disabled:opacity-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Visible Cards Container */}
      <div className="relative flex justify-center items-center overflow-hidden" ref={carouselRef}>
        {/* Previous Card (Blurred) */}
        {currentIndex > 0 && (
          <div className={`absolute left-0 w-48 h-80 opacity-40 scale-85 transform -translate-x-1/4 z-0 ${getPrevCardClasses()}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full p-3 overflow-hidden">
              <div className="text-xl font-bold mb-1 text-gray-700 dark:text-gray-300">
                {years[currentIndex - 1]}
              </div>
              <div className="flex flex-wrap mb-2">
                {yearCards[currentIndex - 1].badges.slice(0, 2).map((badge, i) => (
                  <Badge 
                    key={i} 
                    color={badge.color}
                    className="mr-1 mb-1"
                    size="sm"
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Current Card (Focused) */}
        <div className={`w-full max-w-2xl transition-all duration-300 ease-in-out z-10 ${getMainCardClasses()}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white">
                {years[currentIndex]}
              </h3>
              <div className="flex flex-wrap justify-end">
                {yearCards[currentIndex].badges.map((badge, i) => (
                  <Badge 
                    key={i} 
                    color={badge.color}
                    className="ml-2 mb-1"
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="p-6 max-h-[400px] overflow-auto">
              <div className="space-y-4">
                {yearCards[currentIndex].description.map((paragraph, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Next Card (Blurred) */}
        {currentIndex < years.length - 1 && (
          <div className={`absolute right-0 w-48 h-80 opacity-40 scale-85 transform translate-x-1/4 z-0 ${getNextCardClasses()}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm h-full p-3 overflow-hidden">
              <div className="text-xl font-bold mb-1 text-gray-700 dark:text-gray-300">
                {years[currentIndex + 1]}
              </div>
              <div className="flex flex-wrap mb-2">
                {yearCards[currentIndex + 1].badges.slice(0, 2).map((badge, i) => (
                  <Badge 
                    key={i} 
                    color={badge.color}
                    className="mr-1 mb-1"
                    size="sm"
                  >
                    {badge.text}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Slider Control */}
      <div className="mt-8 px-4">
        <input
          type="range"
          min="0"
          max={years.length - 1}
          value={currentIndex}
          onChange={handleSliderChange}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{years[0]}</span>
          <span>{years[Math.floor(years.length / 2)]}</span>
          <span>{years[years.length - 1]}</span>
        </div>
      </div>
    </div>
  );
};

export default DestinyCompass;
