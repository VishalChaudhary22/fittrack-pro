-- Kaaya Volt (V2) — per-account design version preference.
-- V1 = 'v1' (Original Kaaya), V2 = 'volt' (Kaaya Volt). Default 'volt':
-- Volt is the default look for everyone; the choice syncs via the profile.
ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS design_version text NOT NULL DEFAULT 'volt'
  CHECK (design_version IN ('v1', 'volt'));
