/**
 * Central configuration for the free test feature
 * Update environment variables to control the availability and date range of the free test feature
 * 
 * Environment Variables:
 * - REACT_APP_FREE_TEST_START_DATE: Start date for free test (YYYY-MM-DD format)
 * - REACT_APP_FREE_TEST_END_DATE: End date for free test (YYYY-MM-DD format)
 * - REACT_APP_FREE_TEST_ENABLED: Enable/disable free test feature (true/false)
 */

const FREE_TEST_CONFIG = {
  // Get start date from environment variable, fallback to default date
  startDate: process.env.REACT_APP_FREE_TEST_START_DATE || "2025-01-01",
  
  // Get end date from environment variable, fallback to default date
  endDate: process.env.REACT_APP_FREE_TEST_END_DATE || "2025-08-11",
  
  // Get enabled status from environment variable, fallback to true
  // Convert string to boolean: "false" or "0" = false, anything else = true
  isEnabled: process.env.REACT_APP_FREE_TEST_ENABLED !== "false" && 
             process.env.REACT_APP_FREE_TEST_ENABLED !== "0"
};

// Validation: Check if the date format is valid
const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Check if the free test is currently active based on date range
const isActiveByDate = (): boolean => {
  const today = new Date();
  const startDate = new Date(`${FREE_TEST_CONFIG.startDate}T00:00:00`);
  const endDate = new Date(`${FREE_TEST_CONFIG.endDate}T23:59:59`);
  
  return today >= startDate && today <= endDate;
};

// Helper function to get the overall active status
const isActive = (): boolean => {
  return FREE_TEST_CONFIG.isEnabled && isActiveByDate();
};

// Helper function to get the status reason
const getStatusReason = (): "active" | "disabled" | "not-started" | "ended" => {
  if (!FREE_TEST_CONFIG.isEnabled) {
    return "disabled";
  }
  
  const today = new Date();
  const startDate = new Date(`${FREE_TEST_CONFIG.startDate}T00:00:00`);
  const endDate = new Date(`${FREE_TEST_CONFIG.endDate}T23:59:59`);
  
  if (today < startDate) {
    return "not-started";
  }
  
  if (today > endDate) {
    return "ended";
  }
  
  return "active";
};

// Warn in development if configuration issues are detected
if (process.env.NODE_ENV === "development") {
  if (!isValidDate(FREE_TEST_CONFIG.startDate)) {
    console.warn(
      `Invalid FREE_TEST_START_DATE format: "${FREE_TEST_CONFIG.startDate}". ` +
      "Expected format: YYYY-MM-DD"
    );
  }
  
  if (!isValidDate(FREE_TEST_CONFIG.endDate)) {
    console.warn(
      `Invalid FREE_TEST_END_DATE format: "${FREE_TEST_CONFIG.endDate}". ` +
      "Expected format: YYYY-MM-DD"
    );
  }
  
  // Check if start date is after end date
  const startDate = new Date(`${FREE_TEST_CONFIG.startDate}T00:00:00`);
  const endDate = new Date(`${FREE_TEST_CONFIG.endDate}T23:59:59`);
  if (startDate >= endDate) {
    console.warn(
      `FREE_TEST_START_DATE (${FREE_TEST_CONFIG.startDate}) should be before ` +
      `FREE_TEST_END_DATE (${FREE_TEST_CONFIG.endDate})`
    );
  }
  
  console.log("Free Test Status:", getStatusReason());
}

// Export the enhanced config with helper methods
export default {
  ...FREE_TEST_CONFIG,
  isActive,
  isActiveByDate,
  getStatusReason
}; 