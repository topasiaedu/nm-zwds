import { useRef, useState, useEffect } from "react";
import { ChartData } from "../../../utils/zwds/types";

/**
 * Custom hook to manage star DOM element references in the ZWDS chart
 */
interface UseStarRefsReturn {
  starRefs: React.MutableRefObject<Map<string, HTMLDivElement>>;
  palaceRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  refsReady: boolean;
  setRefsReady: React.Dispatch<React.SetStateAction<boolean>>;
  registerStarRef: (palaceNumber: number, starName: string, element: HTMLDivElement | null) => void;
}

const useStarRefs = (chartData: ChartData, selectedPalace: number | null): UseStarRefsReturn => {
  // Ref to store references to star DOM elements
  const starRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  
  // Ref to store references to palace DOM elements
  const palaceRefs = useRef<(HTMLDivElement | null)[]>(Array(12).fill(null));
  
  // State to track starRefs population status
  const [refsReady, setRefsReady] = useState<boolean>(false);

  // Function to register a star element reference
  const registerStarRef = (palaceNumber: number, starName: string, element: HTMLDivElement | null) => {
    if (element) {
      const key = `${palaceNumber}:${starName}`;
      starRefs.current.set(key, element);
    }
  };

  // Reset starRefs when chart data changes
  useEffect(() => {
    starRefs.current = new Map();
  }, [chartData]);

  // Track starRefs population status
  useEffect(() => {
    if (selectedPalace) {
      // Check if we have refs populated for this palace
      const palaceStarsPopulated = Array.from(starRefs.current.keys()).some(key => 
        key.startsWith(`${selectedPalace}:`)
      );
      
      if (!palaceStarsPopulated) {
        // Force a re-render to ensure refs are populated
        setTimeout(() => {
          setRefsReady(true);
        }, 100);
      }
    }
  }, [selectedPalace]);

  // Ensure refs are properly populated after first render
  useEffect(() => {
    // After component mounts, ensure refs are marked as ready
    const timer = setTimeout(() => {
      setRefsReady(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  return {
    starRefs,
    palaceRefs,
    refsReady,
    setRefsReady,
    registerStarRef
  };
};

export default useStarRefs; 