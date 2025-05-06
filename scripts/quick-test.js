/**
 * Quick test script to simulate multiple profile creations
 * This script uses only the Supabase client with minimal dependencies
 */

const { createClient } = require("@supabase/supabase-js");
const { performance } = require("perf_hooks");

// Get environment variables from .env file
require("dotenv").config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Configuration
const CONFIG = {
  profileCount: process.argv[2] ? parseInt(process.argv[2], 10) : 500,
  batchSize: process.argv[3] ? parseInt(process.argv[3], 10) : 50,
  delayMs: process.argv[4] ? parseInt(process.argv[4], 10) : 100,
  userId: process.argv[5] || "2fdd8c60-fdb0-4ba8-a6e4-327a28179498",
};

// Initialize Supabase client
if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are defined in .env"
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Generate random birth time in Chinese Earthly Branch format
 * @returns {string} Random birth time (子, 丑, 寅, etc.)
 */
function getRandomBirthTime() {
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
 * Insert profiles in batches
 * @param {Array} profiles - Array of profile objects to insert
 * @param {number} batchSize - Number of profiles per batch
 * @param {number} delayMs - Delay between batches in milliseconds
 */
async function insertProfilesInBatches(profiles, batchSize, delayMs) {
  console.log(
    `Starting to insert ${profiles.length} profiles in batches of ${batchSize}...`
  );
  const startTime = performance.now();

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    console.log(
      `Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
        profiles.length / batchSize
      )}...`
    );

    try {
      const { data, error } = await supabase.from("profiles").insert(batch);

      if (error) {
        console.error(
          `Error inserting batch ${Math.floor(i / batchSize) + 1}:`,
          error
        );
        errorCount += batch.length;
      } else {
        successCount += batch.length;
        console.log(
          `Successfully inserted batch ${Math.floor(i / batchSize) + 1}`
        );
      }
    } catch (err) {
      console.error(
        `Exception in batch ${Math.floor(i / batchSize) + 1}:`,
        err
      );
      errorCount += batch.length;
    }

    // Add delay between batches if not the last batch
    if (i + batchSize < profiles.length && delayMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000;

  console.log(`\nSimulation completed in ${duration.toFixed(2)} seconds`);
  console.log(`Successful inserts: ${successCount}`);
  console.log(`Failed inserts: ${errorCount}`);
  console.log(
    `Average insertion rate: ${(successCount / duration).toFixed(
      2
    )} profiles/second`
  );
}

/**
 * Main function to run the simulation
 */
async function runSimulation() {
  try {
    console.log(
      `\n🚀 Starting simulation of ${CONFIG.profileCount} profile sign-ups...`
    );
    console.log(`User ID: ${CONFIG.userId}`);
    console.log(`Batch size: ${CONFIG.batchSize}`);
    console.log(`Delay between batches: ${CONFIG.delayMs}ms\n`);

    // Generate random profiles
    console.log("Generating random profiles...");
    const profiles = Array.from({ length: CONFIG.profileCount }, () =>
      generateRandomProfile(CONFIG.userId)
    );

    // Insert profiles in batches
    await insertProfilesInBatches(profiles, CONFIG.batchSize, CONFIG.delayMs);

    console.log("\n✅ Simulation completed successfully");
  } catch (error) {
    console.error("Error running simulation:", error);
    process.exit(1);
  }
}

runSimulation();
