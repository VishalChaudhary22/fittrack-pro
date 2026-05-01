import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { sendPushNotification } from "../_shared/push.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const now = new Date();
    const today = now.toISOString().split('T')[0]; 
    
    // Yesterday
    const yesterdayDate = new Date(now);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = yesterdayDate.toISOString().split('T')[0];

    // 1. Get users with streak_alerts = true
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('streak_alerts', true);

    if (prefsError) throw prefsError;
    if (!prefs || prefs.length === 0) return new Response("No users want streak alerts", { status: 200 });

    // 2. Get users who worked out yesterday (they have an active streak)
    const { data: yesterdayWorkouts, error: yesterdayError } = await supabase
      .from('workout_logs')
      .select('user_id')
      .eq('date', yesterday);

    if (yesterdayError) throw yesterdayError;

    // 3. Get users who worked out today (they saved their streak)
    const { data: todayWorkouts, error: todayError } = await supabase
      .from('workout_logs')
      .select('user_id')
      .eq('date', today);

    if (todayError) throw todayError;

    const usersWhoWorkedOutYesterday = new Set(yesterdayWorkouts.map((w: any) => w.user_id));
    const usersWhoWorkedOutToday = new Set(todayWorkouts.map((w: any) => w.user_id));
    
    // 4. Find users at risk (worked out yesterday, but not today)
    const usersToRemind = prefs.filter((p: any) => 
      usersWhoWorkedOutYesterday.has(p.user_id) && !usersWhoWorkedOutToday.has(p.user_id)
    );

    let notificationsSent = 0;
    
    const payload = {
      title: "🔥 Keep your streak alive!",
      body: "You're at risk of losing your workout streak. Log a quick session to keep the fire burning!",
      icon: "/fittrack-icon-192.png",
      badge: "/fittrack-icon-192.png",
      data: { url: "/workout" }
    };

    // 5. Send notifications
    for (const u of usersToRemind) {
      await sendPushNotification(supabaseUrl, supabaseKey, u.user_id, payload, 'streak_alert');
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
