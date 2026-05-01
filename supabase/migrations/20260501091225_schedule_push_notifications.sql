-- Schedule Edge Functions via pg_cron
-- Note: You must enable pg_net and pg_cron extensions in Supabase for this to work.
-- Ensure SUPABASE_URL and SERVICE_ROLE_KEY are set if running via HTTP, or use standard Edge Function invoke URLs.

CREATE EXTENSION IF NOT EXISTS pg_net;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- 1. Workout Reminder (Runs Daily at 8 PM UTC)
SELECT cron.schedule(
  'send-workout-reminder-daily',
  '0 20 * * *',
  $$
  SELECT net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/send-workout-reminder',
      headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{}'::jsonb
  );
  $$
);

-- 2. Diet Reminder (Runs Daily at 9 PM UTC)
SELECT cron.schedule(
  'send-diet-reminder-daily',
  '0 21 * * *',
  $$
  SELECT net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/send-diet-reminder',
      headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{}'::jsonb
  );
  $$
);

-- 3. Streak Alert (Runs Daily at 10 AM UTC)
SELECT cron.schedule(
  'send-streak-alert-daily',
  '0 10 * * *',
  $$
  SELECT net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/send-streak-alert',
      headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{}'::jsonb
  );
  $$
);

-- 4. Olympus Weekly (Runs every Sunday at 10 AM UTC)
SELECT cron.schedule(
  'send-olympus-weekly',
  '0 10 * * 0',
  $$
  SELECT net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/send-olympus-weekly',
      headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:='{}'::jsonb
  );
  $$
);
