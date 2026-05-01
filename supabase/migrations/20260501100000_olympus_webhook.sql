-- Webhook for Olympus League XP Updates
-- Triggers an Edge Function when a user's total_xp increases

-- 1. Ensure pg_net is available (required for http requests)
CREATE EXTENSION IF NOT EXISTS pg_net;

-- 2. Create the webhook function
CREATE OR REPLACE FUNCTION notify_olympus_rank_update()
RETURNS TRIGGER AS $$
BEGIN
  -- Only trigger if the user actually gained XP
  IF NEW.total_xp > OLD.total_xp THEN
    PERFORM net.http_post(
      url:='https://zcmwenjvoeoikgxcjvhr.supabase.co/functions/v1/olympus-rank-update-handler',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb,
      body:=jsonb_build_object(
        'type', 'UPDATE',
        'table', 'monthly_xp_cache',
        'record', row_to_json(NEW),
        'old_record', row_to_json(OLD)
      )
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create the trigger on monthly_xp_cache
DROP TRIGGER IF EXISTS on_monthly_xp_update ON public.monthly_xp_cache;
CREATE TRIGGER on_monthly_xp_update
  AFTER UPDATE ON public.monthly_xp_cache
  FOR EACH ROW
  EXECUTE FUNCTION notify_olympus_rank_update();
