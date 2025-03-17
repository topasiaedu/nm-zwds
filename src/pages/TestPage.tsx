import React, { useEffect } from "react";
import { Card } from "flowbite-react";
import { Link } from "react-router-dom";

/**
 * Test page component to verify page transitions
 */
const TestPage: React.FC = () => {
  useEffect(() => {
    // Log for debugging
    console.log("TestPage mounted");
  }, []);

  // Log when rendering
  console.log("TestPage rendering");

  return (
    <div className="flex flex-col items-center justify-center p-8">
      
      <Card className="relative z-10 rounded-2xl shadow-2xl 
                     border border-white/10
                     backdrop-filter backdrop-blur-2xl 
                     bg-white/10 hover:bg-white/15 
                     dark:bg-black/10 dark:hover:bg-black/20 
                     transition-all duration-300
                     w-full max-w-[600px] mx-auto">
        <div className="p-4 sm:p-6 lg:p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Test Page Content</h1>
          <p className="mb-6">This page demonstrates the transition animation effects.</p>
          
          <Link to="/">
            <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-300">
              Back to Dashboard
            </button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default TestPage; 