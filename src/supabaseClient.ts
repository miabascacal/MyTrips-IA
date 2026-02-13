import { createClient } from '@supabase/supabase-js';

// NOTE: In a real deployment, these would come from process.env
// For this generated code to be "runnable" immediately without crashing, 
// we will use placeholders if env vars are missing, but functionality will warn.

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'public-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to check if supabase is actually configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://xyzcompany.supabase.co';
};
