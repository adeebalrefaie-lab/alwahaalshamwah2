/*
  # Fix Database Security and Performance Issues

  ## Summary
  This migration addresses several security and performance issues identified in the database audit.

  ## Changes Made

  ### 1. Add Missing Foreign Key Index
  - **Table**: `shop_settings`
  - **Column**: `updated_by`
  - **Reason**: Foreign key without covering index causes suboptimal query performance
  - **Action**: Create index `idx_shop_settings_updated_by`

  ### 2. Remove Redundant Indexes
  - **Index**: `idx_product_availability_product_id`
    - **Reason**: Redundant with unique constraint index (UNIQUE constraint automatically creates an index)
    - **Status**: Not being used in queries
    - **Action**: Drop this index
  
  - **Index**: `idx_product_availability_is_available`
    - **Reason**: Not being used in any queries, adds unnecessary overhead
    - **Action**: Drop this index
  
  - **Index**: `idx_product_availability_updated_by`
    - **Reason**: Not being used in queries (foreign key lookups are rare)
    - **Action**: Drop this index

  ### 3. Fix Function Security - Immutable Search Path
  - **Function**: `update_updated_at_column`
  - **Issue**: Has role mutable search_path (security risk)
  - **Solution**: Add explicit search_path setting to make it immutable
  - **Security Benefit**: Prevents potential SQL injection via search_path manipulation

  ## Notes on Non-SQL Issues
  
  The following issues require Supabase Dashboard configuration changes:
  
  1. **Auth DB Connection Strategy**: 
     - Navigate to: Project Settings > Database > Connection Pooling
     - Change Auth connection mode from fixed number to percentage-based allocation
  
  2. **Leaked Password Protection**:
     - Navigate to: Authentication > Settings > Security
     - Enable "Check for leaked passwords" option
     - This uses HaveIBeenPwned.org to prevent compromised passwords
*/

-- 1. Add index for shop_settings.updated_by foreign key
CREATE INDEX IF NOT EXISTS idx_shop_settings_updated_by 
  ON shop_settings(updated_by);

-- 2. Drop redundant and unused indexes on product_availability
DROP INDEX IF EXISTS idx_product_availability_product_id;
DROP INDEX IF EXISTS idx_product_availability_is_available;
DROP INDEX IF EXISTS idx_product_availability_updated_by;

-- 3. Fix function to have immutable search path (security improvement)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
