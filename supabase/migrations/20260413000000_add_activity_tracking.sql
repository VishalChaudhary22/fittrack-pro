-- step_logs: daily step counts from any source
CREATE TABLE IF NOT EXISTS public.step_logs (
  id            text        PRIMARY KEY,
  user_id       uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date          date        NOT NULL,
  steps         integer     NOT NULL DEFAULT 0,
  distance_km   numeric(6,2),
  calories_active integer,          -- active calories from device (not BMR)
  floors        integer,
  active_minutes integer,
  source        text        NOT NULL DEFAULT 'manual',
  -- source: 'manual' | 'fitbit' | 'strava' | 'apple_health' | 'browser_sensor'
  raw_provider_id text,            -- provider's own ID for deduplication
  synced_at     timestamptz DEFAULT now(),
  created_at    timestamptz DEFAULT now(),
  UNIQUE(user_id, date, source)    -- one entry per user per day per source
);

-- wearable_connections: OAuth token storage per user per provider
CREATE TABLE IF NOT EXISTS public.wearable_connections (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider         text NOT NULL,  -- 'fitbit' | 'strava'
  access_token     text,           -- encrypted ideally, here plain due to MVP config
  refresh_token    text,           
  token_expires_at timestamptz,
  provider_user_id text,
  scope            text,
  is_active        boolean DEFAULT true,
  connected_at     timestamptz DEFAULT now(),
  last_synced_at   timestamptz,
  UNIQUE(user_id, provider)
);

-- user_profiles: add step_goal
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS step_goal integer DEFAULT 10000;

-- RLS: users own their own data
ALTER TABLE public.step_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wearable_connections ENABLE ROW LEVEL SECURITY;

/*
CREATE POLICY "step_logs: own data" ON public.step_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "wearable_connections: own data" ON public.wearable_connections
  FOR ALL USING (auth.uid() = user_id);
*/
