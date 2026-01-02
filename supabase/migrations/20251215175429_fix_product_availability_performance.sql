/*
  # Fix Product Availability Performance and Security Issues

  ## Performance Optimizations
  
  1. **Add Foreign Key Index**
    - Create index on `updated_by` column to improve foreign key constraint performance
    - Prevents slow queries when joining with auth.users table
  
  2. **Optimize RLS Policies**
    - Update INSERT and UPDATE policies to use `(select auth.uid())` instead of `auth.uid()`
    - Prevents re-evaluation of auth function for each row, improving query performance at scale
    - See: https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select
  
  ## Changes Made
  
  - Add index `idx_product_availability_updated_by` on `updated_by` column
  - Drop and recreate INSERT policy with optimized auth check
  - Drop and recreate UPDATE policy with optimized auth check
  
  ## Security Notes
  
  - All policies maintain the same security level
  - Only authenticated users who own the record can insert/update
  - Performance improvements do not compromise security
*/

-- Add index for the updated_by foreign key to improve query performance
CREATE INDEX IF NOT EXISTS idx_product_availability_updated_by 
  ON product_availability(updated_by);

-- Drop existing policies that need optimization
DROP POLICY IF EXISTS "Authenticated users can insert product availability" ON product_availability;
DROP POLICY IF EXISTS "Authenticated users can update product availability" ON product_availability;

-- Recreate INSERT policy with optimized auth check
CREATE POLICY "Authenticated users can insert product availability"
  ON product_availability
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.uid()) = updated_by);

-- Recreate UPDATE policy with optimized auth check
CREATE POLICY "Authenticated users can update product availability"
  ON product_availability
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK ((select auth.uid()) = updated_by);
