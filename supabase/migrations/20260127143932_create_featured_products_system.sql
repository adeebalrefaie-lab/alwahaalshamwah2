/*
  # Create Featured Products System

  1. New Tables
    - `featured_products`
      - `id` (uuid, primary key) - Unique identifier for the featured product entry
      - `product_id` (text, not null) - The ID of the product (matches id from sweets or alacarte items)
      - `product_type` (text, not null) - Type of product ('sweet' or 'alacarte')
      - `special_description` (text, not null) - Custom description for the featured product
      - `display_order` (integer, default 0) - Order in which products should be displayed
      - `created_at` (timestamptz) - When the product was featured
      - `updated_at` (timestamptz) - Last update timestamp

  2. Security
    - Enable RLS on `featured_products` table
    - Add policy for public to read featured products
    - Add policy for service role to manage featured products (insert, update, delete)

  3. Indexes
    - Index on product_id and product_type for faster lookups
    - Index on display_order for sorting

  4. Important Notes
    - Products can only be featured once (unique constraint on product_id + product_type)
    - Display order allows admins to control the sequence of featured products
    - Timestamps track when products were added to featured list
*/

-- Create featured_products table
CREATE TABLE IF NOT EXISTS featured_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text NOT NULL,
  product_type text NOT NULL CHECK (product_type IN ('sweet', 'alacarte')),
  special_description text NOT NULL,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_featured_product UNIQUE (product_id, product_type)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_featured_products_lookup ON featured_products(product_id, product_type);
CREATE INDEX IF NOT EXISTS idx_featured_products_order ON featured_products(display_order);

-- Enable RLS
ALTER TABLE featured_products ENABLE ROW LEVEL SECURITY;

-- Policy for public to read featured products
CREATE POLICY "Anyone can view featured products"
  ON featured_products
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy for service role to insert featured products
CREATE POLICY "Service role can insert featured products"
  ON featured_products
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Policy for service role to update featured products
CREATE POLICY "Service role can update featured products"
  ON featured_products
  FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy for service role to delete featured products
CREATE POLICY "Service role can delete featured products"
  ON featured_products
  FOR DELETE
  TO service_role
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_featured_products_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_featured_products_updated_at_trigger ON featured_products;
CREATE TRIGGER update_featured_products_updated_at_trigger
  BEFORE UPDATE ON featured_products
  FOR EACH ROW
  EXECUTE FUNCTION update_featured_products_updated_at();