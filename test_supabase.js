import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://zcmwenjvoeoikgxcjvhr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpjbXdlbmp2b2VvaWtneGNqdmhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4MzM0MzQsImV4cCI6MjA4OTQwOTQzNH0.vYoW7Be1Ktu65M2zjZiCEh4davZpif-CO_hTaw4vZpo";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function test() {
  const { data: users, error: uErr } = await supabase.from('user_profiles').select('id').limit(1);
  if (uErr || !users.length) { console.log('User fetch failed', uErr); return; }
  const uid = users[0].id;

  const mockFood = {
    id: "test_" + Date.now(),
    user_id: uid,
    date: "2026-04-09",
    meal_type: "Lunch",
    food_name: "Apple",
    calories: 95
  };
  
  const { data, error } = await supabase.from('food_logs').upsert([mockFood]);
  console.log('Upsert result:', error ? error : 'Success');
}
test();
