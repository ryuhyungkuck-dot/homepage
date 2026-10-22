import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/supabase/server';
import { isDate, type Top5Item } from '@/lib/site';
import { WriteForm } from './WriteForm';

function yesterdayKST() {
  return new Date(Date.now() + 9 * 3600_000 - 24 * 3600_000).toISOString().slice(0, 10);
}

export default async function WritePage({ searchParams }: { searchParams: { date?: string } }) {
  const { sb, user } = await getAdmin();
  if (!sb || !user) redirect('/admin');
  const date = searchParams.date && isDate(searchParams.date) ? searchParams.date : yesterdayKST();
  const { data } = await sb.from('daily_top5').select('items, note, status').eq('date', date).maybeSingle();
  const base: Top5Item[] = Array.from({ length: 5 }, (_, i) => ({ rank: i + 1, title: '', link: '', summary: '' }));
  const items = (data?.items as Top5Item[] | undefined)?.length ? base.map((b, i) => ({ ...b, ...(data!.items as Top5Item[])[i] })) : base;
  return <WriteForm key={date} date={date} items={items} note={(data?.note as string) ?? ''} status={(data?.status as 'draft' | 'published') ?? null} />;
}
