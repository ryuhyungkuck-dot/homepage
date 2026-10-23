import { createServerClient } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { supabaseKey, supabaseUrl } from './env';

const URL = supabaseUrl();
const KEY = supabaseKey();

export const supabaseConfigured = Boolean(URL && KEY);

/** Cookie-less client for public, cacheable reads (published posts only, enforced by RLS). */
export function publicClient() {
  if (!URL || !KEY) return null;
  return createClient(URL, KEY, { auth: { persistSession: false } });
}

/** Session-aware client for the admin area and server actions. */
export function sessionClient() {
  if (!URL || !KEY) return null;
  const store = cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll() {
        return store.getAll();
      },
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, options));
        } catch {
          // called from a Server Component: middleware refreshes the session instead
        }
      },
    },
  });
}

export async function getAdmin() {
  const sb = sessionClient();
  if (!sb) return { sb: null, user: null };
  const { data } = await sb.auth.getUser();
  const admin = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const user = data.user && admin && data.user.email?.toLowerCase() === admin ? data.user : null;
  return { sb, user };
}
