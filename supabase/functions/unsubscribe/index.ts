import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("user_id");
    const type = url.searchParams.get("type"); // e.g. 'workout', 'diet', 'all'

    if (!userId) {
      return new Response("Missing user_id", { status: 400 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const updateData: any = {};
    if (type === 'workout' || type === 'all') updateData.workout_reminders = false;
    if (type === 'diet' || type === 'all') updateData.diet_reminders = false;
    if (type === 'streak' || type === 'all') updateData.streak_alerts = false;
    if (type === 'olympus' || type === 'all') {
      updateData.olympus_weekly = false;
      updateData.olympus_overtaken = false;
      updateData.podium_proximity = false;
    }

    const { error } = await supabase
      .from('notification_preferences')
      .update(updateData)
      .eq('user_id', userId);

    if (error) throw error;

    return new Response(
      `<html><body><h1>Successfully unsubscribed from ${type || 'all'} notifications.</h1><p>You can change this anytime in your FitTrack Pro profile settings.</p></body></html>`, 
      {
        headers: { "Content-Type": "text/html" },
        status: 200,
      }
    );
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
