-- =============================================================================
-- EMAIL FIELD - Database Migration
-- =============================================================================
-- This migration adds an optional email column to the profiles table so that
-- we can capture contact information from users who submit free-test charts.
--
-- Date: February 2026
-- =============================================================================

-- -----------------------------------------------------------------------------
-- Step 1: Add the email column
-- -----------------------------------------------------------------------------
-- Adds a nullable TEXT column to store the submitter's email address.
-- Default is NULL so existing profiles are completely unaffected.
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS email TEXT;

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify the email column was added
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'email';

-- Check current profiles table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- =============================================================================
-- ROLLBACK (if needed)
-- =============================================================================

-- To rollback this migration:
-- ALTER TABLE profiles DROP COLUMN IF EXISTS email;
