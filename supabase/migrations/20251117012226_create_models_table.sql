/*
  # Create Models Table

  ## Purpose
  This migration creates the models table for storing 3D model configurations used in the admin panel.

  ## Changes
  
  1. New Table: `models`
     - `id` (uuid, primary key) - Unique identifier
     - `name` (text) - Model name
     - `model_type` (text) - Type of model (crystal, diamond, etc)
     - `params` (jsonb) - Model parameters (colors, materials, etc)
     - `created_by` (uuid) - User who created the model
     - `is_active` (boolean) - Whether model is active
     - `created_at` (timestamptz) - Creation timestamp
     - `updated_at` (timestamptz) - Last update timestamp

  2. Security
     - Enable RLS on models table
     - Admins can manage all models
     - Users can view active models
*/

-- Create models table
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  model_type TEXT NOT NULL DEFAULT 'crystal',
  params JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

-- Policies for models table
CREATE POLICY "models_public_view_active"
  ON models FOR SELECT
  TO public
  USING (is_active = true);

CREATE POLICY "models_admin_view_all"
  ON models FOR SELECT
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "models_admin_insert"
  ON models FOR INSERT
  TO authenticated
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "models_admin_update"
  ON models FOR UPDATE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
  WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "models_admin_delete"
  ON models FOR DELETE
  TO authenticated
  USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_models_type ON models(model_type);
CREATE INDEX IF NOT EXISTS idx_models_created_by ON models(created_by);
CREATE INDEX IF NOT EXISTS idx_models_active ON models(is_active);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_models_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER models_updated_at
  BEFORE UPDATE ON models
  FOR EACH ROW
  EXECUTE FUNCTION update_models_updated_at();