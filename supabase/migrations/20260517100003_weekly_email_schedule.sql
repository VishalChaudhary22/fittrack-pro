SELECT cron.schedule(
  'weekly-email-sunday',
  '30 2 * * 0',  -- 02:30 UTC = 08:00 IST every Sunday
  $$SELECT net.http_post(
    url := current_setting('app.supabase_url') || '/functions/v1/send-weekly-email',
    body := '{}'::jsonb
  )$$
);
