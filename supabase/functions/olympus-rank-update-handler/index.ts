import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";
import { sendPushNotification } from "../_shared/push.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    const payload = await req.json();
    
    if (payload.type !== 'UPDATE' || payload.table !== 'monthly_xp_cache') {
      return new Response("Ignored", { status: 200 });
    }

    const newRecord = payload.record;
    const oldRecord = payload.old_record;

    if (newRecord.total_xp <= oldRecord.total_xp) {
      return new Response("No XP gained, ignored", { status: 200 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let notificationsSent = 0;

    // --- 1. Overtaken Logic ---
    // Find all users in the same month who have XP between old and new (i.e., we just passed them)
    const { data: overtakenUsers, error: overtakenError } = await supabase
      .from('monthly_xp_cache')
      .select('user_id, total_xp')
      .eq('month', newRecord.month)
      .gt('total_xp', oldRecord.total_xp)
      .lte('total_xp', newRecord.total_xp)
      .neq('user_id', newRecord.user_id);

    if (overtakenError) throw overtakenError;

    if (overtakenUsers && overtakenUsers.length > 0) {
      // Check preferences
      const overtakenIds = overtakenUsers.map(u => u.user_id);
      const { data: prefs, error: prefsError } = await supabase
        .from('notification_preferences')
        .select('user_id')
        .in('user_id', overtakenIds)
        .eq('olympus_overtaken', true);

      if (prefsError) throw prefsError;

      if (prefs && prefs.length > 0) {
        // Send push to each
        for (const pref of prefs) {
          await sendPushNotification(
            supabaseUrl, 
            supabaseKey, 
            pref.user_id, 
            {
              title: "Rank Alert ⚠️",
              body: "A rival just overtook you in the Olympus League! Log a workout to reclaim your rank.",
              icon: "/fittrack-icon-192.png",
              badge: "/fittrack-icon-192.png",
              data: { url: "/olympus" }
            }, 
            'olympus_overtaken'
          );
          notificationsSent++;
        }
      }
    }

    // --- 2. Podium Proximity Logic ---
    // If the active user isn't Top 3, but is within 500 XP of 3rd place, alert them.
    // First, get the Top 3
    const { data: top3, error: top3Error } = await supabase
      .from('monthly_xp_cache')
      .select('user_id, total_xp')
      .eq('month', newRecord.month)
      .order('total_xp', { ascending: false })
      .limit(3);

    if (top3Error) throw top3Error;

    // Check if user is in Top 3
    const isTop3 = top3.some((u: any) => u.user_id === newRecord.user_id);
    
    if (!isTop3 && top3.length >= 3) {
      const thirdPlaceXp = top3[2].total_xp;
      
      // If within 500 XP
      if (newRecord.total_xp >= thirdPlaceXp - 500 && newRecord.total_xp < thirdPlaceXp) {
        // Check preference
        const { data: pref, error: prefError } = await supabase
          .from('notification_preferences')
          .select('podium_proximity')
          .eq('user_id', newRecord.user_id)
          .single();

        if (!prefError && pref?.podium_proximity) {
          await sendPushNotification(
            supabaseUrl, 
            supabaseKey, 
            newRecord.user_id, 
            {
              title: "Podium Proximity 🏆",
              body: "You're within 500 XP of the podium! Keep pushing to reach the Top 3.",
              icon: "/fittrack-icon-192.png",
              badge: "/fittrack-icon-192.png",
              data: { url: "/olympus" }
            }, 
            'podium_proximity'
          );
          notificationsSent++;
        }
      }
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
