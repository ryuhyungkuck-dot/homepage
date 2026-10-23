import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { serviceClient } from '@/lib/supabase/admin';
import { isCategory } from '@/lib/support';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * 파이프라인 전용 API.  Authorization: Bearer <SUPPORT_API_TOKEN>
 *
 * POST  /api/support   지원사업 등록·수정 (한 건 또는 배열). 같은 id면 덮어씀.
 *   → { ok, results: [{ id, url }] }   url = 홈페이지 상세 주소 (카페 글에 넣을 링크)
 * PATCH /api/support   카페에 올린 뒤 글 주소 기록, 또는 숨김
 *   body: { id, cafe_url?, status? }
 */

function authorized(req: NextRequest) {
  const expected = process.env.SUPPORT_API_TOKEN?.trim();
  const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!expected || expected.length < 24 || !got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

const ID = /^[A-Za-z0-9_-]{1,64}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function str(v: unknown, max: number) {
  return typeof v === 'string' ? v.trim().slice(0, max) : '';
}
function date(v: unknown) {
  if (typeof v !== 'string' || !v.trim()) return null;
  const s = v.trim().replace(/\./g, '-').replace(/^(\d{4})(\d{2})(\d{2})$/, '$1-$2-$3'); // 20261031, 2026.10.31 → 2026-10-31
  return DATE.test(s) && !Number.isNaN(Date.parse(s)) ? s : undefined; // undefined = invalid
}
function httpUrl(v: unknown) {
  if (typeof v !== 'string') return null;
  try {
    const u = new URL(v.trim());
    return u.protocol === 'https:' || u.protocol === 'http:' ? u.toString() : null;
  } catch {
    return null;
  }
}

type Row = Record<string, unknown>;

function clean(input: Row): { row?: Row; error?: string } {
  const id = str(input.id, 64);
  if (!ID.test(id)) return { error: 'id는 영문·숫자·-·_ 64자 이내여야 합니다' };
  if (!isCategory(input.category)) return { error: `${id}: category는 manufacturing | distribution | education 중 하나` };
  const title = str(input.title, 300);
  if (!title) return { error: `${id}: title이 비었습니다` };
  const source_url = httpUrl(input.source_url);
  if (!source_url) return { error: `${id}: source_url(기업마당 원문 주소)이 올바르지 않습니다` };
  const period_start = date(input.period_start);
  const period_end = date(input.period_end);
  if (period_start === undefined || period_end === undefined) return { error: `${id}: 날짜는 YYYY-MM-DD 형식` };
  const tags = Array.isArray(input.tags) ? input.tags.map((t) => str(t, 30)).filter(Boolean).slice(0, 10) : [];
  const row: Row = {
    id,
    category: input.category,
    title,
    agency: str(input.agency, 200),
    target: str(input.target, 500),
    summary: str(input.summary, 2000),
    period_start,
    period_end,
    source_url,
    tags,
    updated_at: new Date().toISOString(),
  };
  if (input.cafe_url !== undefined) row.cafe_url = httpUrl(input.cafe_url);
  if (input.status === 'hidden' || input.status === 'published') row.status = input.status;
  return { row };
}

function refresh(ids: string[]) {
  revalidatePath('/');
  revalidatePath('/support');
  revalidatePath('/sitemap.xml');
  ids.forEach((id) => revalidatePath(`/support/${id}`));
}

export async function POST(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ ok: false, error: 'server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON 형식이 아닙니다' }, { status: 400 });
  }
  const items = (Array.isArray(body) ? body : [body]) as Row[];
  if (items.length === 0 || items.length > 100) return NextResponse.json({ ok: false, error: '한 번에 1~100건' }, { status: 400 });

  const rows: Row[] = [];
  for (const it of items) {
    const { row, error } = clean(it ?? {});
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    rows.push(row!);
  }

  const { error } = await sb.from('support_programs').upsert(rows, { onConflict: 'id' });
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const ids = rows.map((r) => r.id as string);
  refresh(ids);
  return NextResponse.json({ ok: true, results: ids.map((id) => ({ id, url: `${SITE.url}/support/${id}` })) });
}

export async function PATCH(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ ok: false, error: 'server not configured (SUPABASE_SERVICE_ROLE_KEY)' }, { status: 500 });

  let body: Row;
  try {
    body = (await req.json()) as Row;
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON 형식이 아닙니다' }, { status: 400 });
  }
  const id = str(body.id, 64);
  if (!ID.test(id)) return NextResponse.json({ ok: false, error: 'id가 올바르지 않습니다' }, { status: 400 });

  const patch: Row = { updated_at: new Date().toISOString() };
  if (body.cafe_url !== undefined) {
    const u = httpUrl(body.cafe_url);
    if (!u) return NextResponse.json({ ok: false, error: 'cafe_url이 올바르지 않습니다' }, { status: 400 });
    patch.cafe_url = u;
  }
  if (body.status === 'hidden' || body.status === 'published') patch.status = body.status;
  if (Object.keys(patch).length === 1) return NextResponse.json({ ok: false, error: '바꿀 값(cafe_url 또는 status)이 없습니다' }, { status: 400 });

  const { data, error } = await sb.from('support_programs').update(patch).eq('id', id).select('id');
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  if (!data?.length) return NextResponse.json({ ok: false, error: '해당 id가 없습니다' }, { status: 404 });

  refresh([id]);
  return NextResponse.json({ ok: true, id, url: `${SITE.url}/support/${id}` });
}
