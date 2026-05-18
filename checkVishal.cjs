const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync(__dirname + '/.env', 'utf-8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].trim().replace(/^"|"$/g, '');
});

const supabaseUrl = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  const { data: users } = await supabase.from("user_profiles").select("*").ilike('name', '%vishal%');
  for (const u of users) {
     console.log("Checking user ID:", u.id, u.name);
     const { data: xp } = await supabase.from("monthly_xp_cache").select("*").eq("user_id", u.id);
     console.log("XP Cache:", xp);
     const { data: w } = await supabase.from("workout_logs").select("date").eq("user_id", u.id).order('date', {ascending: false}).limit(5);
     console.log("Workouts dates:", w?.map(x => x.date));
  }
}
check().catch(console.error);
