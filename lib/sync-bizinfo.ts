import { revalidatePath } from 'next/cache';
import { fetchBizinfo, toProgram, type ProgramRow } from './bizinfo';
import { serviceClient } from './supabase/admin';
import { todayKST } from './support';

export type SyncResult = {
  ok: boolean;
  fetched: number;
  matched: number;
  added: number;
  updated: number;
  byCategory: Record<string, number>;
  error?: string;
};

/** 기업마당에서 공고를 받아 식품 관련만 골라 support_programs에 저장(있으면 갱신). 관리자가 숨긴 공고·카페 주소는 건드리지 않음. */
export async function syncBizinfo(): Promise<SyncResult> {
  const empty = { fetched: 0, matched: 0, added: 0, updated: 0, byCategory: {} };
  const sb = serviceClient();
  if (!sb) return { ok: false, ...empty, error: 'SUPABASE_SERVICE_ROLE_KEY가 설정되지 않았습니다' };

  let items;
  try {
    items = await fetchBizinfo(500);
  } catch (e) {
    return { ok: false, ...empty, error: e instanceof Error ? e.message : String(e) };
  }

  const today = todayKST();
  const seen = new Set<string>();
  const rows: ProgramRow[] = [];
  for (const it of items) {
    const row = toProgram(it, today);
    if (row && !seen.has(row.id)) {
      seen.add(row.id);
      rows.push(row);
    }
  }

  const byCategory: Record<string, number> = {};
  rows.forEach((r) => (byCategory[r.category] = (byCategory[r.category] || 0) + 1));
  if (rows.length === 0) return { ok: true, fetched: items.length, matched: 0, added: 0, updated: 0, byCategory };

  const { data: existing, error: readErr } = await sb.from('support_programs').select('id').in('id', rows.map((r) => r.id));
  if (readErr) return { ok: false, ...empty, fetched: items.length, error: readErr.message };
  const have = new Set((existing ?? []).map((r) => r.id as string));

  // status·cafe_url은 보내지 않으므로 기존 값(숨김, 카페 주소)이 그대로 유지됩니다.
  const { error } = await sb.from('support_programs').upsert(rows, { onConflict: 'id' });
  if (error) return { ok: false, ...empty, fetched: items.length, error: error.message };

  revalidatePath('/');
  revalidatePath('/support');
  revalidatePath('/sitemap.xml');
  rows.forEach((r) => revalidatePath(`/support/${r.id}`));

  const added = rows.filter((r) => !have.has(r.id)).length;
  return { ok: true, fetched: items.length, matched: rows.length, added, updated: rows.length - added, byCategory };
}
