import { createClient } from '@supabase/supabase-js';
import { supabaseUrl } from './env';

/**
 * Server-only client with the service_role key. It bypasses row level security,
 * so it is used ONLY inside /api routes after the pipeline token has been checked.
 * Never import this file from a client component.
 */
export function serviceClient() {
  const url = supabaseUrl();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}
