/**
 * Simulate multiple user sign-ups to test database performance
 * This script creates multiple profile entries directly in the database
 * without going through the UI
 */

const { createClient } = require("@sup  abase/supabase-js");
const faker = require("faker");
const { performance } = require("perf_hooks");
const { program } = require("commander");

// Configure command line options
program
  .option("-c, --count <number>", "Number of profiles to create", 500)
  .option("-b, --batch <number>", "Batch size for inserts", 50)
  .option("-d, --delay <number>", "Delay between batches in ms", 100)
  .option(
    "--user-id <string>",
    "User ID to associate with profiles",
    "2fdd8c60-fdb0-4ba8-a6e4-327a28179498"
  )
  .parse(process.argv);

const options = program.opts();

// Get environment variables from .env file
require("dotenv").config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Missing Supabase credentials. Make sure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are defined in .env"
  );
  process.exit(1);
}

// Initialize Supabase client
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
 * Generate a random profile
 * @returns {Object} Profile object
 */
function generateRandomProfile(userId) {
  const gender = Math.random() > 0.5 ? "male" : "female";
  const now = new Date().toISOString();

  return {
    name: faker.name.findName(),
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
    const profileCount = parseInt(options.count, 10);
    const batchSize = parseInt(options.batch, 10);
    const delayMs = parseInt(options.delay, 10);
    const userId = options.userId;

    console.log(
      `\n🚀 Starting simulation of ${profileCount} profile sign-ups...`
    );
    console.log(`User ID: ${userId}`);
    console.log(`Batch size: ${batchSize}`);
    console.log(`Delay between batches: ${delayMs}ms\n`);

    // Generate random profiles
    console.log("Generating random profiles...");
    const profiles = Array.from({ length: profileCount }, () =>
      generateRandomProfile(userId)
    );

    // Insert profiles in batches
    await insertProfilesInBatches(profiles, batchSize, delayMs);

    console.log("\n✅ Simulation completed successfully");
  } catch (error) {
    console.error("Error running simulation:", error);
    process.exit(1);
  }
}

runSimulation();
