'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getAdmin } from '@/lib/supabase/server';
import { isDate, type Top5Item } from '@/lib/site';

export type SaveResult = { ok: boolean; message: string };

export async function saveTop5(input: { date: string; items: Top5Item[]; note: string; status: 'draft' | 'published' }): Promise<SaveResult> {
  const { sb, user } = await getAdmin();
  if (!sb || !user) return { ok: false, message: '로그인이 필요합니다.' };
  if (!isDate(input.date)) return { ok: false, message: '날짜가 올바르지 않습니다.' };

  const items: Top5Item[] = input.items.slice(0, 5).map((it, i) => ({
    rank: i + 1,
    title: String(it.title || '').trim().slice(0, 200),
    link: String(it.link || '').trim().slice(0, 500),
    summary: String(it.summary || '').trim().slice(0, 300),
  }));
  const filled = items.filter((i) => i.title);
  if (input.status === 'published') {
    if (filled.length === 0) return { ok: false, message: '발행하려면 게시글을 1개 이상 입력하세요.' };
    const bad = filled.find((i) => !/^https?:\/\//.test(i.link));
    if (bad) return { ok: false, message: `${bad.rank}위의 카페 원문 링크를 확인하세요.` };
  }

  const now = new Date().toISOString();
  const { data: existing } = await sb.from('daily_top5').select('published_at').eq('date', input.date).maybeSingle();
  const { error } = await sb.from('daily_top5').upsert({
    date: input.date,
    status: input.status,
    items,
    note: String(input.note || '').trim().slice(0, 3000),
    published_at: input.status === 'published' ? existing?.published_at ?? now : existing?.published_at ?? null,
    updated_at: now,
  });
  if (error) return { ok: false, message: `저장하지 못했습니다: ${error.message}` };

  revalidatePath('/');
  revalidatePath('/today');
  revalidatePath(`/today/${input.date}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin');
  return { ok: true, message: input.status === 'published' ? `${input.date} TOP 5를 발행했습니다.` : `${input.date} TOP 5를 임시저장했습니다.` };
}

export async function unpublish(date: string): Promise<SaveResult> {
  const { sb, user } = await getAdmin();
  if (!sb || !user) return { ok: false, message: '로그인이 필요합니다.' };
  const { error } = await sb.from('daily_top5').update({ status: 'draft', updated_at: new Date().toISOString() }).eq('date', date);
  if (error) return { ok: false, message: error.message };
  revalidatePath('/');
  revalidatePath('/today');
  revalidatePath(`/today/${date}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin');
  return { ok: true, message: `${date} 글을 내렸습니다.` };
}

export async function setSupportStatus(form: FormData) {
  const { sb, user } = await getAdmin();
  if (!sb || !user) return;
  const id = String(form.get('id') || '');
  const status = form.get('status') === 'hidden' ? 'hidden' : 'published';
  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return;
  await sb.from('support_programs').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
  revalidatePath('/');
  revalidatePath('/support');
  revalidatePath(`/support/${id}`);
  revalidatePath('/sitemap.xml');
  revalidatePath('/admin');
}

export async function signOut() {
  const { sb } = await getAdmin();
  await sb?.auth.signOut();
  redirect('/admin/login');
}
