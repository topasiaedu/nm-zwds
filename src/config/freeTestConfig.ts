/**
 * Central configuration for the free test feature
 * 
 * Environment Variables:
 * - REACT_APP_FREE_TEST_ENABLED: Enable/disable free test feature (true/false)
 */

const FREE_TEST_CONFIG = {
  // Get enabled status from environment variable, fallback to true
  // Convert string to boolean: "false" or "0" = false, anything else = true
  isEnabled: process.env.REACT_APP_FREE_TEST_ENABLED !== "false" && 
             process.env.REACT_APP_FREE_TEST_ENABLED !== "0"
};

// Helper function to get the overall active status
const isActive = (): boolean => {
  return FREE_TEST_CONFIG.isEnabled;
};

// Helper function to get the status reason
const getStatusReason = (): "active" | "disabled" => {
  return FREE_TEST_CONFIG.isEnabled ? "active" : "disabled";
};

// Log status in development
if (process.env.NODE_ENV === "development") {
  console.log("Free Test Status:", getStatusReason());
}

// Export the enhanced config with helper methods
const freeTestConfig = {
  ...FREE_TEST_CONFIG,
  isActive,
  getStatusReason,
};

export default freeTestConfig;