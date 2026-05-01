import webpush from "npm:web-push@3.6.7";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

export async function sendPushNotification(
  supabaseUrl: string,
  supabaseKey: string,
  userId: string,
  payload: any,
  notificationType: string
) {
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Get user subscriptions
  const { data: subscriptions, error } = await supabase
    .from('push_subscriptions')
    .select('id, endpoint, p256dh, auth')
    .eq('user_id', userId);

  if (error || !subscriptions || subscriptions.length === 0) {
    console.log(`No active push subscriptions for user ${userId}`);
    return;
  }

  const vapidPublicKey = Deno.env.get("VITE_VAPID_PUBLIC_KEY") || Deno.env.get("VAPID_PUBLIC_KEY");
  const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

  if (!vapidPublicKey || !vapidPrivateKey) {
    console.error("VAPID keys not configured");
    return;
  }

  webpush.setVapidDetails(
    "mailto:hello@fittrack.com",
    vapidPublicKey,
    vapidPrivateKey
  );

  let successCount = 0;

  for (const sub of subscriptions) {
    const pushSubscription = {
      endpoint: sub.endpoint,
      keys: {
        p256dh: sub.p256dh,
        auth: sub.auth,
      },
    };

    try {
      await webpush.sendNotification(pushSubscription, JSON.stringify(payload));
      successCount++;
    } catch (err: any) {
      console.error("Error sending push notification:", err);
      // If subscription expired or invalid (410, 404), remove it
      if (err.statusCode === 410 || err.statusCode === 404) {
        await supabase.from('push_subscriptions').delete().eq('id', sub.id);
      }
      
      // Log failure
      await supabase.from('notification_logs').insert({
        user_id: userId,
        type: notificationType,
        status: 'failed',
        error_details: err.message
      });
    }
  }

  if (successCount > 0) {
    await supabase.from('notification_logs').insert({
      user_id: userId,
      type: notificationType,
      status: 'sent'
    });
  }
}
