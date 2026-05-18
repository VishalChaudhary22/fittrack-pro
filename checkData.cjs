const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

// Parse .env manually
const envFile = fs.readFileSync(__dirname + '/.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2];
});

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const email = "vishalchaudhary28@gmail.com";
  
  const { data: users } = await supabase.from("user_profiles").select("*");
  const matched = users.filter(u => u.email === email);
  
  if (matched.length === 0) {
    console.log("User email not found in user_profiles! Found emails:", users.map(u => u.email).filter(Boolean));
    const u = users[0];
    if (u) {
       console.log("Fallback checking user ID:", u.id);
       const { data: xp } = await supabase.from("monthly_xp_cache").select("*").eq("user_id", u.id);
       console.log("XP Cache:", xp);
       const { data: w } = await supabase.from("workout_logs").select("date").eq("user_id", u.id).order('date', {ascending: false});
       console.log("Workouts count:", w?.length);
    }
    return;
  }
  
  const user = matched[0];
  console.log("User found:", user.id, user.name);

  // Check XP
  const { data: xp } = await supabase.from("monthly_xp_cache").select("*").eq("user_id", user.id);
  console.log("XP Cache:", xp);

  // Check Workouts
  const { data: workouts } = await supabase.from("workout_logs").select("date, day_name").eq("user_id", user.id).order('date', {ascending: false});
  console.log("All workouts count:", workouts?.length);
  if (workouts && workouts.length > 0) {
      console.log("Recent workouts:", workouts.slice(0, 5));
  }
}

check().catch(console.error);
