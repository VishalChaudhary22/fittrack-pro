import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { sendPushNotification } from "../_shared/push.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get users with olympus_weekly = true
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('olympus_weekly', true);

    if (prefsError) throw prefsError;
    if (!prefs || prefs.length === 0) return new Response("No users want olympus weekly alerts", { status: 200 });

    let notificationsSent = 0;
    
    // In a full implementation, you might calculate their specific rank and compare with last week
    // For now, we send a generic weekly round-up
    const payload = {
      title: "Olympus League Update ⚡",
      body: "The weekly ranks are in! Check out where you stand on the leaderboard.",
      icon: "/fittrack-icon-192.png",
      badge: "/fittrack-icon-192.png",
      data: { url: "/olympus" }
    };

    // 2. Send notifications
    for (const p of prefs) {
      await sendPushNotification(supabaseUrl, supabaseKey, p.user_id, payload, 'olympus_weekly');
      notificationsSent++;
    }

    return new Response(JSON.stringify({ success: true, count: notificationsSent }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
