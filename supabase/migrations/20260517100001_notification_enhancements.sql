-- Extend existing notification_preferences table
ALTER TABLE notification_preferences
ADD COLUMN IF NOT EXISTS email_weekly BOOLEAN DEFAULT false;

-- Add last_known_tier for rank-up push detection (on user_profiles)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS last_known_tier TEXT DEFAULT 'Unranked';

-- Add email column to user_profiles (if not already present from auth)
ALTER TABLE user_profiles
ADD COLUMN IF NOT EXISTS email TEXT;
