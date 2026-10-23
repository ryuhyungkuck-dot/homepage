import { publicClient } from './supabase/server';

export const CATEGORIES = {
  manufacturing: { label: '제조업 사장님을 위한 지원사업', short: '제조업', bar: 'bar-mint', sprite: 'pxc-gear' },
  distribution: { label: '유통사 사장님을 위한 지원사업', short: '유통', bar: 'bar-pink', sprite: 'pxc-crate' },
  education: { label: '교육 안내', short: '교육', bar: 'bar-yellow', sprite: 'pxc-saucer' },
} as const;

export type Category = keyof typeof CATEGORIES;
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as Category[];
export const isCategory = (c: unknown): c is Category => typeof c === 'string' && c in CATEGORIES;

export type SupportProgram = {
  id: string;
  category: Category;
  title: string;
  agency: string;
  target: string;
  summary: string;
  period_start: string | null;
  period_end: string | null;
  source_url: string;
  cafe_url: string | null;
  tags: string[];
  status: 'published' | 'hidden';
  created_at: string;
  updated_at: string;
};

/** Today's date in Korea, YYYY-MM-DD. */
export function todayKST() {
  return new Date(Date.now() + 9 * 3600_000).toISOString().slice(0, 10);
}

/** D-day label for a deadline: 'D-7', 'D-DAY', '마감', or '상시'. */
export function dday(end: string | null) {
  if (!end) return { label: '상시', open: true, urgent: false };
  const diff = Math.round((Date.parse(end) - Date.parse(todayKST())) / 86_400_000);
  if (diff < 0) return { label: '마감', open: false, urgent: false };
  if (diff === 0) return { label: 'D-DAY', open: true, urgent: true };
  return { label: `D-${diff}`, open: true, urgent: diff <= 7 };
}

export function period(p: Pick<SupportProgram, 'period_start' | 'period_end'>) {
  const f = (d: string) => d.replace(/-/g, '.');
  if (!p.period_start && !p.period_end) return '상시 모집';
  return `${p.period_start ? f(p.period_start) : ''} ~ ${p.period_end ? f(p.period_end) : ''}`;
}

/** Open programs first (closest deadline first, '상시' after dated ones), then closed ones (newest first). */
function sortPrograms(list: SupportProgram[]) {
  const today = todayKST();
  const open = list.filter((p) => !p.period_end || p.period_end >= today);
  const closed = list.filter((p) => p.period_end && p.period_end < today);
  open.sort((a, b) => (a.period_end ?? '9999') .localeCompare(b.period_end ?? '9999') || b.created_at.localeCompare(a.created_at));
  closed.sort((a, b) => (b.period_end ?? '').localeCompare(a.period_end ?? ''));
  return [...open, ...closed];
}

export async function listPrograms(category?: Category, limit = 200): Promise<SupportProgram[]> {
  const sb = publicClient();
  if (!sb) return [];
  let q = sb.from('support_programs').select('*').eq('status', 'published').order('created_at', { ascending: false }).limit(limit);
  if (category) q = q.eq('category', category);
  const { data } = await q;
  return sortPrograms((data as SupportProgram[]) ?? []);
}

/** For the home page: up to `per` open programs in each category. */
export async function openByCategory(per = 4): Promise<Record<Category, SupportProgram[]>> {
  const all = await listPrograms(undefined, 300);
  const out = { manufacturing: [], distribution: [], education: [] } as Record<Category, SupportProgram[]>;
  for (const p of all) {
    if (!dday(p.period_end).open) continue;
    if (out[p.category].length < per) out[p.category].push(p);
  }
  return out;
}

export async function programById(id: string): Promise<SupportProgram | null> {
  const sb = publicClient();
  if (!sb || !/^[A-Za-z0-9_-]{1,64}$/.test(id)) return null;
  const { data } = await sb.from('support_programs').select('*').eq('id', id).eq('status', 'published').maybeSingle();
  return (data as SupportProgram) ?? null;
}
