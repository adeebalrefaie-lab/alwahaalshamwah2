/*
  # Fix Promo Codes Table - Add Missing Columns & Security

  1. Modified Tables
    - `promo_codes`
      - Added `created_by` (uuid, references auth.users) - admin who created the code
      - Added `expires_at` (timestamptz, nullable) - optional expiry date

  2. Security
    - Enable RLS on `promo_codes` table
    - Admins (authenticated) can manage their own promo codes
    - Anonymous users can only validate active, non-expired codes

  3. Constraints
    - Trigger to enforce maximum of 4 promo codes per admin
    - Discount percentage check: must be 10, 20, 30, 40, or 50
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN created_by uuid REFERENCES auth.users(id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'promo_codes' AND column_name = 'expires_at'
  ) THEN
    ALTER TABLE promo_codes ADD COLUMN expires_at timestamptz;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'promo_codes' AND constraint_name = 'promo_codes_discount_check'
  ) THEN
    ALTER TABLE promo_codes ADD CONSTRAINT promo_codes_discount_check
      CHECK (discount_percentage IN (10, 20, 30, 40, 50));
  END IF;
END $$;

ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can read all promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Authenticated users can insert promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Authenticated users can update own promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Authenticated users can delete own promo codes" ON promo_codes;
DROP POLICY IF EXISTS "Anyone can validate active promo codes" ON promo_codes;

CREATE POLICY "Admins can read own promo codes"
  ON promo_codes
  FOR SELECT
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can insert promo codes"
  ON promo_codes
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update own promo codes"
  ON promo_codes
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can delete own promo codes"
  ON promo_codes
  FOR DELETE
  TO authenticated
  USING (auth.uid() = created_by);

CREATE POLICY "Public can validate active non-expired codes"
  ON promo_codes
  FOR SELECT
  TO anon
  USING (
    is_active = true
    AND (expires_at IS NULL OR expires_at > now())
  );

CREATE OR REPLACE FUNCTION check_promo_code_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT count(*) FROM promo_codes WHERE created_by = NEW.created_by) >= 4 THEN
    RAISE EXCEPTION 'Maximum of 4 promo codes allowed';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS enforce_promo_code_limit ON promo_codes;

CREATE TRIGGER enforce_promo_code_limit
  BEFORE INSERT ON promo_codes
  FOR EACH ROW
  EXECUTE FUNCTION check_promo_code_limit();
