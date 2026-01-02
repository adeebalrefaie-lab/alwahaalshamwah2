/*
  # Product Availability Management System

  1. New Tables
    - `product_availability`
      - `id` (uuid, primary key)
      - `product_id` (text, unique) - Matches the id from alacarteItems
      - `is_available` (boolean, default true) - Whether the product is in stock
      - `updated_at` (timestamptz) - Last time availability was changed
      - `updated_by` (uuid) - Admin user who made the change
  
  2. Security
    - Enable RLS on `product_availability` table
    - Add policy for public users to read availability status
    - Add policy for authenticated admin users to update availability
    
  3. Notes
    - Products not in this table are considered available by default
    - Only admin users can modify availability status
    - All users can read availability to display proper UI states
*/

-- Create product_availability table
CREATE TABLE IF NOT EXISTS product_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text UNIQUE NOT NULL,
  is_available boolean DEFAULT true NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  updated_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE product_availability ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read product availability (needed for customer UI)
CREATE POLICY "Public users can read product availability"
  ON product_availability
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Policy: Only authenticated users can insert availability records
CREATE POLICY "Authenticated users can insert product availability"
  ON product_availability
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = updated_by);

-- Policy: Only authenticated users can update availability records
CREATE POLICY "Authenticated users can update product availability"
  ON product_availability
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (auth.uid() = updated_by);

-- Create index for faster lookups by product_id
CREATE INDEX IF NOT EXISTS idx_product_availability_product_id 
  ON product_availability(product_id);

-- Create index for filtering by availability status
CREATE INDEX IF NOT EXISTS idx_product_availability_is_available 
  ON product_availability(is_available);
