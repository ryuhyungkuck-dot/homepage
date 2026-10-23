/**
 * Supabase settings from environment variables, cleaned up.
 * The URL is reduced to its origin, so a value pasted as
 * "https://xxxx.supabase.co/rest/v1/" still works.
 */
export function supabaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return raw.replace(/\/+$/, '');
  }
}

export function supabaseKey(): string | undefined {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() || undefined;
}
