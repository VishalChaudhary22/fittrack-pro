import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { sendPushNotification } from "../_shared/push.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const today = new Date().toISOString().split('T')[0]; 

    // 1. Get users with diet_reminders = true
    const { data: prefs, error: prefsError } = await supabase
      .from('notification_preferences')
      .select('user_id')
      .eq('diet_reminders', true);

    if (prefsError) throw prefsError;
    if (!prefs || prefs.length === 0) return new Response("No users want diet reminders", { status: 200 });

    // 2. Get users who ALREADY logged food today
    const { data: foods, error: foodsError } = await supabase
      .from('food_logs')
      .select('user_id')
      .eq('date', today);

    if (foodsError) throw foodsError;

    const usersWhoLoggedFood = new Set(foods.map((f: any) => f.user_id));
    
    // 3. Find users who NEED a reminder
    const usersToRemind = prefs.filter((p: any) => !usersWhoLoggedFood.has(p.user_id));

    let notificationsSent = 0;
    
    const payload = {
      title: "Fuel your body! 🥗",
      body: "You haven't logged your meals today. Stay on track with your nutrition goals!",
      icon: "/fittrack-icon-192.png",
      badge: "/fittrack-icon-192.png",
      data: { url: "/diet" }
    };

    // 4. Send notifications
    for (const u of usersToRemind) {
      await sendPushNotification(supabaseUrl, supabaseKey, u.user_id, payload, 'diet_reminder');
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
