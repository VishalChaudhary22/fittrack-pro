import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { sendPushNotification } from "../_shared/push.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Simple UTC date string. For production, timezone handling per user might be needed.
    const today = new Date().toISOString().split('T')[0]; 

    // 1. Get users with workout_reminders = true
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('workout_reminders', true);

    if (prefsError) throw prefsError;
    if (!prefs || prefs.length === 0) return new Response("No users want workout reminders", { status: 200 });

    // 2. Get users who ALREADY worked out today
    const { data: workouts, error: workoutsError } = await supabase
      .from('workout_logs')
      .select('user_id')
      .eq('date', today);

    if (workoutsError) throw workoutsError;

    const usersWhoWorkedOut = new Set(workouts.map((w: any) => w.user_id));
    
    // 3. Find users who NEED a reminder
    const usersToRemind = prefs.filter((p: any) => !usersWhoWorkedOut.has(p.user_id));

    let notificationsSent = 0;
    
    const payload = {
      title: "Time to train! 💪",
      body: "You haven't logged your workout today. Keep the momentum going!",
      icon: "/fittrack-icon-192.png",
      badge: "/fittrack-icon-192.png",
      data: { url: "/workout" }
    };

    // 4. Send notifications
    for (const u of usersToRemind) {
      await sendPushNotification(supabaseUrl, supabaseKey, u.user_id, payload, 'workout_reminder');
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
