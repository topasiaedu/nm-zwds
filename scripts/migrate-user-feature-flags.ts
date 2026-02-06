/**
 * Migration script to populate feature flags for existing users.
 * Steps:
 * 1) Parse CLI flags and validate environment variables.
 * 2) Fetch users in pages, map tiers to feature templates, and update flags.
 * 3) Support dry-run and verbose logging.
 * 4) Attempt rollback on fatal failure.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import {
  FEATURE_KEYS,
  PROGRAM_TEMPLATES,
  type FeatureFlags,
  type FeatureKey,
} from "../src/types/features";
import type { Database } from "../database.types";

type UserDetailsRow = Pick<
  Database["public"]["Tables"]["user_details"]["Row"],
  "id" | "tier" | "feature_flags"
>;

type ScriptOptions = {
  dryRun: boolean;
  verbose: boolean;
};

type MappedTier = "tier1" | "tier2" | "admin" | "beta" | "founder";

type TierMappingResult = {
  mappedTier: MappedTier;
  template: FeatureFlags;
};

type RollbackEntry = {
  id: string;
  previousFlags: FeatureFlags | null;
};

const PAGE_SIZE = 500;

/**
 * Parse CLI arguments with validation and supported flags only.
 */
const parseArgs = (argv: string[]): ScriptOptions => {
  const supportedFlags = new Set(["--dry-run", "--verbose", "-v"]);
  const optionSet = new Set(argv);

  for (const arg of optionSet) {
    if (!supportedFlags.has(arg)) {
      throw new Error(
        `Unsupported argument "${arg}". Use --dry-run and/or --verbose.`
      );
    }
  }

  return {
    dryRun: optionSet.has("--dry-run"),
    verbose: optionSet.has("--verbose") || optionSet.has("-v"),
  };
};

/**
 * Resolve environment variables and fail fast when missing.
 */
const getEnvOrThrow = (key: string): string => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing required environment variable "${key}".`);
  }

  return value;
};

/**
 * Create a Node-friendly Supabase client using anon credentials.
 */
const createSupabaseClient = (): SupabaseClient<Database> => {
  const supabaseUrl = getEnvOrThrow("REACT_APP_SUPABASE_URL");
  const supabaseAnonKey = getEnvOrThrow("REACT_APP_SUPABASE_ANON_KEY");

  return createClient<Database>(supabaseUrl, supabaseAnonKey);
};

/**
 * Map user tiers to program templates, including tier3 -> beta.
 */
const resolveTierTemplate = (tier: string): TierMappingResult | null => {
  switch (tier) {
    case "tier1":
      return { mappedTier: "tier1", template: PROGRAM_TEMPLATES.tier1 };
    case "tier2":
      return { mappedTier: "tier2", template: PROGRAM_TEMPLATES.tier2 };
    case "admin":
      return { mappedTier: "admin", template: PROGRAM_TEMPLATES.admin };
    case "tier3":
    case "beta":
      return { mappedTier: "beta", template: PROGRAM_TEMPLATES.beta };
    case "founder":
      return { mappedTier: "founder", template: PROGRAM_TEMPLATES.founder };
    default:
      return null;
  }
};

/**
 * Compare feature flags using the ordered feature keys list.
 */
const areFlagsEqual = (
  current: FeatureFlags | null,
  target: FeatureFlags
): boolean => {
  for (const key of FEATURE_KEYS) {
    const currentValue = Boolean(current?.[key]);
    const targetValue = Boolean(target[key]);

    if (currentValue !== targetValue) {
      return false;
    }
  }

  return true;
};

/**
 * Format flags for logs with stable key ordering.
 */
const formatFlagsForLog = (flags: FeatureFlags): string => {
  const entries: Array<[FeatureKey, boolean]> = FEATURE_KEYS.map((key) => [
    key,
    Boolean(flags[key]),
  ]);

  return JSON.stringify(Object.fromEntries(entries));
};

/**
 * Log only when verbose is enabled.
 */
const logVerbose = (enabled: boolean, message: string): void => {
  if (enabled) {
    console.log(message);
  }
};

/**
 * Fetch a page of user_details rows.
 */
const fetchUserPage = async (
  supabase: SupabaseClient<Database>,
  from: number,
  to: number
): Promise<{ rows: UserDetailsRow[]; total: number | null }> => {
  const { data, error, count } = await supabase
    .from("user_details")
    .select("id,tier,feature_flags", { count: "exact" })
    .range(from, to);

  if (error) {
    throw new Error(`Failed to fetch users: ${error.message}`);
  }

  return {
    rows: data ?? [],
    total: typeof count === "number" ? count : null,
  };
};

/**
 * Best-effort rollback for previously updated rows.
 * Note: Supabase JS does not support multi-row transactions directly.
 */
const rollbackUpdates = async (
  supabase: SupabaseClient<Database>,
  updatedEntries: RollbackEntry[],
  verbose: boolean
): Promise<void> => {
  if (updatedEntries.length === 0) {
    return;
  }

  console.warn(
    `Attempting rollback for ${updatedEntries.length} updated users.`
  );

  for (const entry of updatedEntries) {
    const previousFlags = entry.previousFlags ?? {};
    const { error } = await supabase
      .from("user_details")
      .update({ feature_flags: previousFlags })
      .eq("id", entry.id);

    if (error) {
      console.error(
        `Rollback failed for user ${entry.id}: ${error.message}`
      );
    } else {
      logVerbose(verbose, `Rolled back user ${entry.id}.`);
    }
  }
};

/**
 * Main migration workflow.
 */
const migrateFeatureFlags = async (): Promise<void> => {
  const options = parseArgs(process.argv.slice(2));
  const supabase = createSupabaseClient();

  let processedCount = 0;
  let migratedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;
  let totalCount: number | null = null;

  const rollbackEntries: RollbackEntry[] = [];

  console.log(
    `Starting feature flag migration${options.dryRun ? " (dry run)" : ""}.`
  );

  try {
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const { rows, total } = await fetchUserPage(
        supabase,
        offset,
        offset + PAGE_SIZE - 1
      );

      if (totalCount === null && total !== null) {
        totalCount = total;
      }

      if (rows.length === 0) {
        break;
      }

      for (const row of rows) {
        processedCount += 1;

        if (typeof row.id !== "string" || typeof row.tier !== "string") {
          errorCount += 1;
          console.error(
            `Skipping invalid row: id or tier is not a string (id="${row.id}", tier="${row.tier}").`
          );
          console.log(
            `Progress: processed ${processedCount}${
              totalCount ? `/${totalCount}` : ""
            }.`
          );
          continue;
        }

        const mapping = resolveTierTemplate(row.tier);

        if (!mapping) {
          errorCount += 1;
          console.error(
            `Skipping user ${row.id}: unsupported tier "${row.tier}".`
          );
          console.log(
            `Progress: processed ${processedCount}${
              totalCount ? `/${totalCount}` : ""
            }.`
          );
          continue;
        }

        const targetFlags = mapping.template;

        if (areFlagsEqual(row.feature_flags, targetFlags)) {
          skippedCount += 1;
          logVerbose(
            options.verbose,
            `No change for user ${row.id} (tier ${row.tier} -> ${mapping.mappedTier}).`
          );
          console.log(
            `Progress: processed ${processedCount}${
              totalCount ? `/${totalCount}` : ""
            }.`
          );
          continue;
        }

        if (options.dryRun) {
          migratedCount += 1;
          console.log(
            `[DRY RUN] Would update user ${row.id} (tier ${row.tier} -> ${mapping.mappedTier}).`
          );
          logVerbose(
            options.verbose,
            `Flags: ${formatFlagsForLog(targetFlags)}`
          );
          console.log(
            `Progress: processed ${processedCount}${
              totalCount ? `/${totalCount}` : ""
            }.`
          );
          continue;
        }

        const { error } = await supabase
          .from("user_details")
          .update({ feature_flags: targetFlags })
          .eq("id", row.id);

        if (error) {
          errorCount += 1;
          console.error(`Failed to update user ${row.id}: ${error.message}`);
          throw new Error("Migration halted due to update failure.");
        }

        migratedCount += 1;
        rollbackEntries.push({ id: row.id, previousFlags: row.feature_flags });

        logVerbose(
          options.verbose,
          `Updated user ${row.id} (tier ${row.tier} -> ${mapping.mappedTier}).`
        );
        console.log(
          `Progress: processed ${processedCount}${
            totalCount ? `/${totalCount}` : ""
          }.`
        );
      }
    }
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown migration error.";
    console.error(`Migration failed: ${message}`);

    if (!options.dryRun) {
      await rollbackUpdates(supabase, rollbackEntries, options.verbose);
    }
  } finally {
    console.log("Migration summary:");
    console.log(
      `Processed ${processedCount}${totalCount ? `/${totalCount}` : ""} users.`
    );
    console.log(
      `${options.dryRun ? "Would migrate" : "Migrated"} ${migratedCount} users.`
    );
    console.log(`Skipped ${skippedCount} users.`);
    console.log(`Errors ${errorCount}.`);
  }
};

void migrateFeatureFlags();
