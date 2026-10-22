import { publicClient } from './supabase/server';
import type { Top5Post } from './site';

export async function latestPost(): Promise<Top5Post | null> {
  const sb = publicClient();
  if (!sb) return null;
  const { data } = await sb
    .from('daily_top5')
    .select('*')
    .eq('status', 'published')
    .order('date', { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as Top5Post) ?? null;
}

export async function postByDate(date: string): Promise<Top5Post | null> {
  const sb = publicClient();
  if (!sb) return null;
  const { data } = await sb.from('daily_top5').select('*').eq('date', date).eq('status', 'published').maybeSingle();
  return (data as Top5Post) ?? null;
}

export async function publishedDates(limit = 1000): Promise<{ date: string; updated_at: string; items: Top5Post['items'] }[]> {
  const sb = publicClient();
  if (!sb) return [];
  const { data } = await sb
    .from('daily_top5')
    .select('date, updated_at, items')
    .eq('status', 'published')
    .order('date', { ascending: false })
    .limit(limit);
  return (data as { date: string; updated_at: string; items: Top5Post['items'] }[]) ?? [];
}

export async function neighbors(date: string) {
  const sb = publicClient();
  if (!sb) return { prev: null, next: null };
  const [p, n] = await Promise.all([
    sb.from('daily_top5').select('date').eq('status', 'published').lt('date', date).order('date', { ascending: false }).limit(1).maybeSingle(),
    sb.from('daily_top5').select('date').eq('status', 'published').gt('date', date).order('date', { ascending: true }).limit(1).maybeSingle(),
  ]);
  return { prev: (p.data?.date as string) ?? null, next: (n.data?.date as string) ?? null };
}
