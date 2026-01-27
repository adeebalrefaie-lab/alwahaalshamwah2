/*
  # Fix Featured Products RLS Policies

  1. Changes
    - Drop existing restrictive policies that only allow service_role
    - Create new policies that allow authenticated users to manage featured products
    - Keep public read access for displaying featured products on homepage

  2. Security
    - SELECT: Anyone (anon + authenticated) can view featured products
    - INSERT: Authenticated users can add featured products
    - UPDATE: Authenticated users can update featured products
    - DELETE: Authenticated users can remove featured products

  3. Important Notes
    - This allows admin users (who are authenticated) to manage featured products
    - Public users can still view featured products on the homepage
    - All changes are tracked with timestamps
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Service role can insert featured products" ON featured_products;
DROP POLICY IF EXISTS "Service role can update featured products" ON featured_products;
DROP POLICY IF EXISTS "Service role can delete featured products" ON featured_products;

-- Create new policies for authenticated users
CREATE POLICY "Authenticated users can insert featured products"
  ON featured_products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update featured products"
  ON featured_products
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete featured products"
  ON featured_products
  FOR DELETE
  TO authenticated
  USING (true);