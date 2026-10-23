'use client';
import { createBrowserClient } from '@supabase/ssr';
import { supabaseKey, supabaseUrl } from './env';

export function browserClient() {
  const url = supabaseUrl();
  const key = supabaseKey();
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}
