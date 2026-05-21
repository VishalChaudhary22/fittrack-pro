-- Reschedule weekly email digest:
-- Old: Sunday 02:30 UTC (08:00 IST)
-- New: Monday 03:30 UTC (09:00 IST)

-- Remove old schedule
SELECT cron.unschedule('weekly-email-sunday');

-- Create new schedule: Monday 9 AM IST = 03:30 UTC
SELECT cron.schedule(
  'weekly-email-monday',
  '30 3 * * 1',  -- 03:30 UTC every Monday = 09:00 IST
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/send-weekly-email',
    body := '{}'::jsonb
  )$$
);
