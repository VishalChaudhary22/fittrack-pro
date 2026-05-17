import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.39.3";

const resendApiKey = Deno.env.get("RESEND_API_KEY") || "";
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  try {
    if (!resendApiKey) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    let emailsSent = 0;

    // 1. Get all users with an email address
    const { data: users, error: usersError } = await supabase
      .from("user_profiles")
      .select("id, email, name")
      .not("email", "is", null);

    if (usersError) throw usersError;
    if (!users || users.length === 0) {
      return new Response("No users to email", { status: 200 });
    }

    // 2. Calculate the date range (last 7 days)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    const dateStr = sevenDaysAgo.toISOString().split("T")[0];

    // 3. For each user, fetch their data and send an email
    for (const user of users) {
      // Skip if somehow email is missing
      if (!user.email) continue;

      // Fetch last 7 days of workouts
      const { data: workouts } = await supabase
        .from("workout_logs")
        .select("id")
        .eq("user_id", user.id)
        .gte("date", dateStr);

      const workoutCount = workouts?.length || 0;

      // Email HTML Content
      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #E8540D; padding: 24px; border-radius: 12px 12px 0 0; color: white;">
            <h1 style="margin: 0; font-size: 24px;">FitTrack Pro</h1>
            <p style="margin: 4px 0 0; opacity: 0.9;">Weekly Summary for ${user.name || "Athlete"}</p>
          </div>
          <div style="padding: 32px 24px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 12px 12px;">
            <h2 style="font-size: 20px; margin-top: 0;">This week's highlights</h2>
            <div style="background: #f5f5f5; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <div style="font-size: 32px; font-weight: bold; color: #E8540D;">${workoutCount}</div>
              <div style="font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 1px;">Workouts Logged</div>
            </div>
            
            <p style="line-height: 1.6; margin-bottom: 24px;">
              ${workoutCount > 3 ? "Fantastic consistency! You're crushing it." : "Every session counts. Let's aim for a bit more next week!"}
            </p>
            
            <a href="https://fittrack-pro.com/dashboard" style="display: inline-block; background: #1a1a1a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
              View Full Dashboard
            </a>
          </div>
          <div style="text-align: center; margin-top: 24px; font-size: 12px; color: #999;">
            You are receiving this because you are an active user of FitTrack Pro.<br>
            <a href="https://fittrack-pro.com/profile" style="color: #666;">Manage notification preferences</a>
          </div>
        </div>
      `;

      // Send via Resend API
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: "FitTrack Pro <noreply@fittrack-pro.com>",
          to: user.email,
          subject: "Your FitTrack Weekly Summary 📈",
          html: htmlContent,
        }),
      });

      if (res.ok) {
        emailsSent++;
        // Log it
        await supabase.from("notification_logs").insert({
          user_id: user.id,
          type: "email_weekly",
          status: "sent",
        });
      } else {
        const errorText = await res.text();
        console.error(`Failed to send email to ${user.email}: ${errorText}`);
      }
    }

    return new Response(JSON.stringify({ success: true, emailsSent }), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
