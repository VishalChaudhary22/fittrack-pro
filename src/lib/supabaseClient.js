import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper — get current session's user synchronously from cache
export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};
