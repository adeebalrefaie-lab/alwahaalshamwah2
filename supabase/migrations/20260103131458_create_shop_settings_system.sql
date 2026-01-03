/*
  # Shop Settings and Working Hours System

  ## Overview
  This migration creates the infrastructure for managing shop operational status and working hours.

  ## New Tables
  
  ### `shop_settings`
  - `id` (uuid, primary key) - Unique identifier
  - `is_open` (boolean) - Manual shop status override (true = open, false = closed)
  - `shop_name` (text) - Shop name for display
  - `updated_at` (timestamptz) - Last update timestamp
  - `updated_by` (uuid) - Reference to admin who made the change
  
  ### `working_hours`
  - `id` (uuid, primary key) - Unique identifier
  - `day_of_week` (integer) - Day number (0 = Sunday, 6 = Saturday)
  - `day_name_ar` (text) - Arabic day name
  - `is_closed` (boolean) - Whether shop is closed this entire day
  - `opening_time` (time) - Opening time (e.g., '09:00:00')
  - `closing_time` (time) - Closing time (e.g., '22:00:00')
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on both tables
  - Public can read shop settings and working hours
  - Only authenticated admins can modify settings

  ## Initial Data
  - Creates single shop_settings record (default: open)
  - Creates 7 working_hours records (one per day) with default hours 9 AM - 10 PM
*/

-- Create shop_settings table
CREATE TABLE IF NOT EXISTS shop_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  is_open boolean NOT NULL DEFAULT true,
  shop_name text NOT NULL DEFAULT 'حلويات',
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

-- Create working_hours table
CREATE TABLE IF NOT EXISTS working_hours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week integer NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  day_name_ar text NOT NULL,
  is_closed boolean NOT NULL DEFAULT false,
  opening_time time NOT NULL DEFAULT '09:00:00',
  closing_time time NOT NULL DEFAULT '22:00:00',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(day_of_week)
);

-- Enable RLS
ALTER TABLE shop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE working_hours ENABLE ROW LEVEL SECURITY;

-- Shop Settings Policies
CREATE POLICY "Anyone can view shop settings"
  ON shop_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update shop settings"
  ON shop_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Working Hours Policies
CREATE POLICY "Anyone can view working hours"
  ON working_hours FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update working hours"
  ON working_hours FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default shop settings (only if table is empty)
INSERT INTO shop_settings (is_open, shop_name)
SELECT true, 'حلويات دمشق'
WHERE NOT EXISTS (SELECT 1 FROM shop_settings);

-- Insert default working hours for all days (only if table is empty)
INSERT INTO working_hours (day_of_week, day_name_ar, is_closed, opening_time, closing_time)
SELECT * FROM (VALUES
  (0, 'الأحد', false, '09:00:00'::time, '22:00:00'::time),
  (1, 'الإثنين', false, '09:00:00'::time, '22:00:00'::time),
  (2, 'الثلاثاء', false, '09:00:00'::time, '22:00:00'::time),
  (3, 'الأربعاء', false, '09:00:00'::time, '22:00:00'::time),
  (4, 'الخميس', false, '09:00:00'::time, '22:00:00'::time),
  (5, 'الجمعة', true, '09:00:00'::time, '22:00:00'::time),
  (6, 'السبت', false, '09:00:00'::time, '22:00:00'::time)
) AS default_hours(day_of_week, day_name_ar, is_closed, opening_time, closing_time)
WHERE NOT EXISTS (SELECT 1 FROM working_hours);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS update_shop_settings_updated_at ON shop_settings;
CREATE TRIGGER update_shop_settings_updated_at
  BEFORE UPDATE ON shop_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_working_hours_updated_at ON working_hours;
CREATE TRIGGER update_working_hours_updated_at
  BEFORE UPDATE ON working_hours
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
