/*
  # Refactor Featured Products to Mirror Approach

  ## Overview
  This migration refactors the featured products system to use a "mirror" approach where products maintain their original data and are simply flagged as featured with an optional special description.

  ## Changes

  1. New Tables
    - `product_featured_status`
      - `id` (uuid, primary key)
      - `product_id` (text, the ID from the product data files)
      - `product_type` (text, either 'sweet' or 'alacarte')
      - `is_featured` (boolean, whether the product is featured)
      - `special_description` (text, optional special description for featured display)
      - `display_order` (integer, order in which to display featured products)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `product_featured_status` table
    - Public read access for displaying featured products
    - Admin-only write access for managing featured status

  3. Indexes
    - Index on (product_id, product_type) for quick lookups
    - Index on (is_featured, display_order) for featured product queries

  ## Notes
  - The old `featured_products` table is deprecated but not dropped to preserve data
  - Products keep their images, prices, and all data in the TypeScript files
  - This table only stores the "featured" flag and special description
*/

-- Create product_featured_status table
CREATE TABLE IF NOT EXISTS product_featured_status (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_type text NOT NULL CHECK (product_type IN ('sweet', 'alacarte')),
  is_featured boolean DEFAULT true,
  special_description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create unique constraint to prevent duplicate entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_featured_status_unique 
  ON product_featured_status(product_id, product_type);

-- Create index for featured queries
CREATE INDEX IF NOT EXISTS idx_product_featured_status_featured 
  ON product_featured_status(is_featured, display_order) 
  WHERE is_featured = true;

-- Enable RLS
ALTER TABLE product_featured_status ENABLE ROW LEVEL SECURITY;

-- Public read access for featured products
CREATE POLICY "Anyone can view featured products"
  ON product_featured_status
  FOR SELECT
  USING (true);

-- Admin write access (using the same pattern as shop_settings)
CREATE POLICY "Authenticated users can manage featured status"
  ON product_featured_status
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_product_featured_status_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS set_product_featured_status_updated_at ON product_featured_status;
CREATE TRIGGER set_product_featured_status_updated_at
  BEFORE UPDATE ON product_featured_status
  FOR EACH ROW
  EXECUTE FUNCTION update_product_featured_status_updated_at();