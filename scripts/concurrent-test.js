/**
 * Concurrent profile creation simulation
 * This script simulates real users by creating multiple concurrent connections
 * with randomized timing patterns to better represent launch day conditions
 */

const { createClient } = require("@supabase/supabase-js");
const { performance } = require("perf_hooks");
const readline = require("readline");

// Get environment variables from .env file
require("dotenv").config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Configuration options
const CONFIG = {
  totalUsers: process.argv[2] ? parseInt(process.argv[2], 10) : 500,
  concurrentUsers: process.argv[3] ? parseInt(process.argv[3], 10) : 50,
  minDelayMs: 100, // Minimum delay between form submits (milliseconds)
  maxDelayMs: 2000, // Maximum delay between form submits (milliseconds)
  userId: "2fdd8c60-fdb0-4ba8-a6e4-327a28179498",
  autoCleanup: process.argv.includes("--auto-cleanup"),
  skipCleanup: process.argv.includes("--skip-cleanup"),
  verboseErrors: process.argv.includes("--verbose")
};

// Validate Supabase credentials
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are defined in .env"
  );
  process.exit(1);
}

// Initialize stats tracking
const stats = {
  startTime: 0,
  endTime: 0,
  successCount: 0,
  errorCount: 0,
  activeConnections: 0,
  completedConnections: 0,
  createdProfileIds: [], // Track created profile IDs for cleanup
  errors: {} // Map to track unique error messages and their count
};

// Create Chinese Earthly Branches for birth times
const earthlyBranches = [
  "1",
  "3",
  "5",
  "7",
  "9",
  "11",
  "13",
  "15",
  "17",
  "19",
  "21",
  "23",
];
/**
 * Generate random birth time
 * @returns {string} Random birth time in Chinese Earthly Branch format
 */
function getRandomBirthTime() {
  const randomIndex = Math.floor(Math.random() * earthlyBranches.length);
  return earthlyBranches[randomIndex];
}

/**
 * Generate random birth date in ISO format
 * @returns {string} Random date in format YYYY-MM-DD
 */
function getRandomBirthDate() {
  const start = new Date(1950, 0, 1);
  const end = new Date(2010, 11, 31);
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString().split("T")[0];
}

/**
 * Generate a random name
 * @returns {string} Random name
 */
function getRandomName() {
  const firstNames = [
    "James",
    "Mary",
    "John",
    "Patricia",
    "Robert",
    "Jennifer",
    "Michael",
    "Linda",
    "William",
    "Elizabeth",
    "David",
    "Susan",
    "Richard",
    "Jessica",
    "Joseph",
    "Sarah",
    "Thomas",
    "Karen",
    "Charles",
    "Nancy",
    "Wei",
    "Li",
    "Xiao",
    "Ming",
    "Chen",
    "Zhang",
    "Liu",
    "Yang",
    "Huang",
    "Zhao",
  ];

  const lastNames = [
    "Smith",
    "Johnson",
    "Williams",
    "Jones",
    "Brown",
    "Davis",
    "Miller",
    "Wilson",
    "Moore",
    "Taylor",
    "Wang",
    "Li",
    "Zhang",
    "Liu",
    "Chen",
    "Yang",
    "Huang",
    "Zhao",
    "Wu",
    "Zhou",
  ];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

  return `${firstName} ${lastName}`;
}

/**
 * Generate a random profile
 * @returns {Object} Profile object
 */
function generateRandomProfile(userId) {
  const gender = Math.random() > 0.5 ? "male" : "female";
  const now = new Date().toISOString();

  return {
    name: getRandomName(),
    birth_time: getRandomBirthTime(),
    birthday: getRandomBirthDate(),
    gender: gender,
    is_self: false,
    user_id: userId,
    created_at: now,
    last_viewed: now,
  };
}

/**
 * Get random delay to simulate user form filling time
 * @returns {number} Random delay in milliseconds
 */
function getRandomDelay() {
  return (
    Math.floor(Math.random() * (CONFIG.maxDelayMs - CONFIG.minDelayMs + 1)) +
    CONFIG.minDelayMs
  );
}

/**
 * Track an error message in the stats
 * @param {string} message - Error message to track
 */
function trackError(message) {
  // Get a simplified error message by removing specific details
  const simplifiedMessage = message
    .replace(/\b[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\b/gi, '<UUID>') // Replace UUIDs
    .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/g, '<ISO_DATE>') // Replace ISO dates
    .replace(/('|").*?\1/g, match => match.replace(/[^'"]/g, '*')) // Replace string contents but keep quotes
    .trim();

  // Add to error tracking
  if (stats.errors[simplifiedMessage]) {
    stats.errors[simplifiedMessage].count++;
  } else {
    stats.errors[simplifiedMessage] = { 
      count: 1,
      firstSeen: message // Keep one full example for reference
    };
  }
}

/**
 * Update and display progress
 */
function updateProgress() {
  const total = CONFIG.totalUsers;
  const completed = stats.completedConnections;
  const active = stats.activeConnections;
  const success = stats.successCount;
  const errors = stats.errorCount;
  const elapsed = ((performance.now() - stats.startTime) / 1000).toFixed(1);

  // Calculate throughput (profiles per second)
  const throughput = (completed / elapsed).toFixed(2);

  // Clear console and update progress
  process.stdout.write("\x1Bc");
  console.log("🔄 CONCURRENT PROFILE CREATION SIMULATION");
  console.log("==========================================");
  console.log(`⏱️  Time elapsed: ${elapsed}s`);
  console.log(`👥 Total users:   ${total}`);
  console.log(`🟢 Active:        ${active}`);
  console.log(
    `✅ Completed:     ${completed} / ${total} (${Math.round(
      (completed / total) * 100
    )}%)`
  );
  console.log(`✓  Successful:    ${success}`);
  console.log(`✗  Failed:        ${errors}`);
  console.log(`⚡ Throughput:     ${throughput} profiles/second`);
  console.log("==========================================");

  // If all connections are complete, show final stats
  if (completed === total) {
    const duration = (stats.endTime - stats.startTime) / 1000;
    console.log("\n✅ SIMULATION COMPLETED");
    console.log(`⏱️  Total duration: ${duration.toFixed(2)} seconds`);
    console.log(
      `📊 Final success rate: ${((success / total) * 100).toFixed(1)}%`
    );
    console.log(
      `⚡ Average throughput: ${(success / duration).toFixed(
        2
      )} profiles/second`
    );
    console.log(`🧹 Profiles to clean up: ${stats.createdProfileIds.length}`);
    
    // Show error summary if there were errors
    if (errors > 0) {
      console.log("\n❌ ERROR SUMMARY");
      console.log("==========================================");
      
      // Sort errors by frequency (most common first)
      const sortedErrors = Object.entries(stats.errors)
        .sort((a, b) => b[1].count - a[1].count);
      
      sortedErrors.forEach(([errorMsg, data], index) => {
        console.log(`\n[${index + 1}] ${errorMsg}`);
        console.log(`Count: ${data.count} (${((data.count / errors) * 100).toFixed(1)}% of all errors)`);
        
        // Show full example only in verbose mode
        if (CONFIG.verboseErrors) {
          console.log("Example:");
          console.log(`"${data.firstSeen}"`);
        }
      });
    }
  }
}

/**
 * Simulates a single user submitting the profile form
 * @param {number} userIndex - Index of the simulated user
 */
async function simulateUser(userIndex) {
  // Create a new Supabase client for each user (simulates separate devices/sessions)
  const userClient = createClient(supabaseUrl, supabaseKey);

  try {
    stats.activeConnections++;

    // Random delay to simulate the time it takes a real user to fill out the form
    const formFillDelay = getRandomDelay();
    await new Promise((resolve) => setTimeout(resolve, formFillDelay));

    // Generate and submit profile
    const profile = generateRandomProfile(CONFIG.userId);

    // Submit to database
    const { data, error } = await userClient.from("profiles").insert([profile]).select();

    if (error) {
      stats.errorCount++;
      trackError(error.message);
      
      if (CONFIG.verboseErrors) {
        console.error(`Error for user ${userIndex}: ${error.message}`);
      }
    } else {
      stats.successCount++;
      // Store the profile ID for later cleanup
      if (data && data.length > 0 && data[0].id) {
        stats.createdProfileIds.push(data[0].id);
      }
    }
  } catch (err) {
    stats.errorCount++;
    const errorMessage = err.message || "Unknown error";
    trackError(errorMessage);
    
    if (CONFIG.verboseErrors) {
      console.error(`Exception for user ${userIndex}: ${errorMessage}`);
    }
  } finally {
    stats.activeConnections--;
    stats.completedConnections++;

    // If this is the last user to complete, record end time
    if (stats.completedConnections === CONFIG.totalUsers) {
      stats.endTime = performance.now();
    }

    // Update progress display
    updateProgress();
  }
}

/**
 * Asks the user for confirmation before cleanup
 * @returns {Promise<boolean>} True if user confirmed, false otherwise
 */
function askForCleanupConfirmation() {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question(`\nDelete ${stats.createdProfileIds.length} test profiles? (yes/no): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y');
    });
  });
}

/**
 * Deletes all profiles created during the test
 * @param {boolean} skipConfirmation - Whether to skip confirmation prompt
 * @returns {Promise<void>}
 */
async function cleanupProfiles(skipConfirmation = false) {
  if (stats.createdProfileIds.length === 0) {
    console.log("No profiles to clean up.");
    return;
  }

  let shouldProceed = skipConfirmation;
  
  if (!shouldProceed) {
    shouldProceed = await askForCleanupConfirmation();
  }

  if (!shouldProceed) {
    console.log("Cleanup skipped. Test profiles remain in the database.");
    return;
  }

  console.log(`\n🧹 Cleaning up ${stats.createdProfileIds.length} test profiles...`);
  
  // Create a fresh client for cleanup
  const client = createClient(supabaseUrl, supabaseKey);
  
  // Delete in batches of 100 to avoid overwhelming the database
  const batchSize = 100;
  let deletedCount = 0;
  let errorCount = 0;
  const cleanupErrors = {};

  for (let i = 0; i < stats.createdProfileIds.length; i += batchSize) {
    const batch = stats.createdProfileIds.slice(i, i + batchSize);
    try {
      const { error } = await client
        .from("profiles")
        .delete()
        .in("id", batch);
      
      if (error) {
        console.error(`Error deleting batch: ${error.message}`);
        errorCount += batch.length;
        trackError(error.message);
      } else {
        deletedCount += batch.length;
        console.log(`Deleted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(stats.createdProfileIds.length/batchSize)}`);
      }
    } catch (err) {
      console.error(`Exception deleting batch: ${err.message}`);
      errorCount += batch.length;
      trackError(err.message);
    }
  }

  console.log(`\n✅ Cleanup completed`);
  console.log(`Successfully deleted: ${deletedCount} profiles`);
  console.log(`Failed to delete: ${errorCount} profiles`);
  
  // Show cleanup errors if any
  if (errorCount > 0 && CONFIG.verboseErrors) {
    console.log("\n❌ CLEANUP ERROR SUMMARY");
    Object.entries(cleanupErrors).forEach(([error, count]) => {
      console.log(`- ${error}: ${count} occurrences`);
    });
  }
}

/**
 * Main function to run the concurrent simulation
 */
async function runConcurrentSimulation() {
  try {
    // Initialize simulation
    stats.startTime = performance.now();
    console.log(
      `\n🚀 Starting concurrent simulation of ${CONFIG.totalUsers} profile sign-ups...`
    );
    console.log(`🔄 Maximum concurrent users: ${CONFIG.concurrentUsers}`);
    
    if (CONFIG.verboseErrors) {
      console.log(`🔍 Verbose error reporting enabled`);
    }

    // Start progress display updates
    const progressInterval = setInterval(() => {
      if (stats.completedConnections < CONFIG.totalUsers) {
        updateProgress();
      } else {
        clearInterval(progressInterval);
      }
    }, 500);

    // Queue for managing concurrent connections
    const queue = Array.from({ length: CONFIG.totalUsers }, (_, i) => i);
    let activePromises = [];

    // Process the queue with limited concurrency
    while (queue.length > 0 || activePromises.length > 0) {
      // Fill up to concurrentUsers limit
      while (
        activePromises.length < CONFIG.concurrentUsers &&
        queue.length > 0
      ) {
        const userIndex = queue.shift();
        activePromises.push(
          simulateUser(userIndex).then(() => {
            // Remove from activePromises when done
            activePromises = activePromises.filter(
              (p) => p !== activePromises[activePromises.length - 1]
            );
          })
        );
      }

      // Wait a bit before checking again
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Final update after all users are done
    updateProgress();
    
    // Handle cleanup based on configuration
    if (CONFIG.skipCleanup) {
      console.log("\n🧹 Cleanup skipped (--skip-cleanup flag used)");
    } else if (CONFIG.autoCleanup) {
      await cleanupProfiles(true); // Skip confirmation when auto-cleanup flag is used
    } else {
      await cleanupProfiles(); // Ask for confirmation
    }
    
  } catch (error) {
    console.error("Error running simulation:", error);
    process.exit(1);
  }
}

// Start the simulation
runConcurrentSimulation();
