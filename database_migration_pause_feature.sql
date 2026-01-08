-- =============================================================================
-- MEMBERSHIP PAUSE FEATURE - Database Migration
-- =============================================================================
-- This migration adds the is_paused column to user_details table and updates
-- the tier constraint to only allow valid tier values.
--
-- Date: January 2026
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Step 1: Add the is_paused column
-- -----------------------------------------------------------------------------
-- Adds a boolean column to track whether a user's membership is paused.
-- Default is false (not paused).
-- This preserves the user's tier level while blocking access.
ALTER TABLE user_details 
ADD COLUMN is_paused BOOLEAN NOT NULL DEFAULT false;

-- -----------------------------------------------------------------------------
-- Step 2: Find existing tier constraint (if any)
-- -----------------------------------------------------------------------------
-- Run this query to identify any existing CHECK constraints on the tier column
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'user_details' 
AND constraint_type = 'CHECK';

-- -----------------------------------------------------------------------------
-- Step 3: Drop the old constraint
-- -----------------------------------------------------------------------------
-- IMPORTANT: Replace 'constraint_name' with the actual constraint name from Step 2
-- If no constraint exists, skip this step
-- Example: If the constraint is named 'user_details_tier_check_old', use:
--   ALTER TABLE user_details DROP CONSTRAINT user_details_tier_check_old;

-- Uncomment and modify the following line after finding the constraint name:
-- ALTER TABLE user_details 
-- DROP CONSTRAINT constraint_name;

-- -----------------------------------------------------------------------------
-- Step 4: Add the correct tier constraint
-- -----------------------------------------------------------------------------
-- Creates a CHECK constraint to ensure tier only contains valid values:
-- - 'tier1': Basic tier
-- - 'tier2': Premium tier with analytics access
-- - 'admin': Administrator access
-- ALTER TABLE user_details 
-- ADD CONSTRAINT user_details_tier_check 
-- CHECK (tier IN ('tier1', 'tier2', 'admin'));

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify the is_paused column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_details' 
AND column_name = 'is_paused';

-- Verify the tier constraint was added
SELECT constraint_name, check_clause
FROM information_schema.check_constraints
WHERE constraint_name = 'user_details_tier_check';

-- Check current user_details structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'user_details'
ORDER BY ordinal_position;

-- =============================================================================
-- ROLLBACK (if needed)
-- =============================================================================

-- To rollback this migration:
-- ALTER TABLE user_details DROP COLUMN is_paused;
-- ALTER TABLE user_details DROP CONSTRAINT user_details_tier_check;
