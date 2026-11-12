-- Push reminder times: move the two daily reminders to IST-sane hours.
-- pg_cron runs in UTC; the original May 2026 schedule fired the workout
-- reminder at 20:00 UTC (01:30 IST) and the diet reminder at 21:00 UTC
-- (02:30 IST) — the middle of the night for the app's IST user base.
-- cron.schedule with an existing job name updates that job in place.
--
--   workout reminder: 07:00 IST = 01:30 UTC
--   diet reminder:    21:00 IST = 15:30 UTC
-- Unchanged on purpose: streak alert 10:00 UTC (15:30 IST) and
-- Olympus weekly Sun 10:00 UTC (15:30 IST).

SELECT cron.schedule(
  'send-workout-reminder-daily',
  '30 1 * * *',
  $$
  SELECT net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/send-workout-reminder',
      body:='{}'::jsonb
  );
  $$
);

SELECT cron.schedule(
  'send-diet-reminder-daily',
  '30 15 * * *',
  $$
  SELECT net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/send-diet-reminder',
      body:='{}'::jsonb
  );
  $$
);
