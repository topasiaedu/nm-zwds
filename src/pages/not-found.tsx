import React from "react";
import { Button } from "flowbite-react";
import { Link } from "react-router-dom";

/**
 * NotFoundPage component
 * Displays a 404 error page with a link to return home
 */
const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="max-w-md backdrop-filter backdrop-blur-lg bg-white/20 dark:bg-black/20 p-8 rounded-2xl shadow-2xl border border-white/10">
        <h1 className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/">
          <Button color="blue" size="lg">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage; 