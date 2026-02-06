-- =============================================================================
-- FEATURE FLAGS - Database Migration
-- =============================================================================
-- This migration adds a feature_flags JSONB column to user_details, creates
-- a GIN index for JSONB queries, and updates the tier constraint to include
-- new tier values.
--
-- Date: February 2026
-- =============================================================================

-- ---------------------------------------------------------------------------
-- Step 1: Add the feature_flags column
-- ---------------------------------------------------------------------------
-- Adds a JSONB column to store per-user feature flags.
-- Default is an empty JSON object and column is NOT NULL for consistency.
ALTER TABLE user_details
ADD COLUMN IF NOT EXISTS feature_flags JSONB NOT NULL DEFAULT '{}'::jsonb;

-- ---------------------------------------------------------------------------
-- Step 2: Create a GIN index on feature_flags
-- ---------------------------------------------------------------------------
-- Improves query performance for JSONB containment and key lookups.
CREATE INDEX IF NOT EXISTS user_details_feature_flags_gin_idx
ON user_details
USING GIN (feature_flags);

-- ---------------------------------------------------------------------------
-- Step 3: Drop the old tier constraint (if any)
-- ---------------------------------------------------------------------------
-- Finds and drops any existing CHECK constraint on user_details.tier.
DO $$
DECLARE
  tier_constraint_name TEXT;
BEGIN
  SELECT tc.constraint_name
  INTO tier_constraint_name
  FROM information_schema.table_constraints tc
  JOIN information_schema.check_constraints cc
    ON cc.constraint_name = tc.constraint_name
  WHERE tc.table_name = 'user_details'
    AND tc.constraint_type = 'CHECK'
    AND cc.check_clause LIKE '%tier%';

  IF tier_constraint_name IS NOT NULL THEN
    EXECUTE FORMAT('ALTER TABLE user_details DROP CONSTRAINT %I', tier_constraint_name);
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Step 4: Add the updated tier constraint
-- ---------------------------------------------------------------------------
-- Allowed values:
-- - 'tier1': Basic tier
-- - 'tier2': Premium tier
-- - 'admin': Administrator access
-- - 'founder': Early supporter tier
-- - 'beta': Beta access tier
ALTER TABLE user_details
ADD CONSTRAINT user_details_tier_check
CHECK (tier IN ('tier1', 'tier2', 'admin', 'founder', 'beta'));

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify the feature_flags column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_details'
  AND column_name = 'feature_flags';

-- Verify the GIN index exists
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'user_details'
  AND indexname = 'user_details_feature_flags_gin_idx';

-- Verify the tier constraint was added
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'user_details_tier_check';

-- =============================================================================
-- ROLLBACK (if needed)
-- =============================================================================

-- To rollback this migration:
-- 1) Drop the updated tier constraint
--    ALTER TABLE user_details DROP CONSTRAINT IF EXISTS user_details_tier_check;
-- 2) Restore the previous tier constraint
--    ALTER TABLE user_details
--    ADD CONSTRAINT user_details_tier_check
--    CHECK (tier IN ('tier1', 'tier2', 'admin'));
-- 3) Drop the GIN index
--    DROP INDEX IF EXISTS user_details_feature_flags_gin_idx;
-- 4) Drop the feature_flags column
--    ALTER TABLE user_details DROP COLUMN IF EXISTS feature_flags;
