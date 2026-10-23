import { timingSafeEqual } from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { serviceClient } from '@/lib/supabase/admin';
import { CATEGORIES, todayKST, type SupportProgram } from '@/lib/support';
import { SITE } from '@/lib/site';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/*
 * 카페 글쓰기 파이프라인용: 아직 카페에 올리지 않은 공고 목록.
 * GET /api/support/pending   Authorization: Bearer <SUPPORT_API_TOKEN>
 * → { ok, items: [{ id, category, category_label, title, agency, target, summary, period, period_end, source_url, home_url, tags }] }
 * 카페에 올린 뒤에는 PATCH /api/support { id, cafe_url } 로 기록하면 목록에서 빠집니다.
 */
function authorized(req: NextRequest) {
  const expected = process.env.SUPPORT_API_TOKEN?.trim();
  const got = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim();
  if (!expected || expected.length < 24 || !got) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(got);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function GET(req: NextRequest) {
  if (!authorized(req)) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  const sb = serviceClient();
  if (!sb) return NextResponse.json({ ok: false, error: 'server not configured' }, { status: 500 });

  const limit = Math.min(Math.max(Number(req.nextUrl.searchParams.get('limit')) || 20, 1), 100);
  const { data, error } = await sb
    .from('support_programs')
    .select('*')
    .eq('status', 'published')
    .is('cafe_url', null)
    .or(`period_end.is.null,period_end.gte.${todayKST()}`)
    .order('created_at', { ascending: true })
    .limit(limit);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });

  const items = ((data as SupportProgram[]) ?? []).map((p) => ({
    id: p.id,
    category: p.category,
    category_label: CATEGORIES[p.category]?.label ?? p.category,
    title: p.title,
    agency: p.agency,
    target: p.target,
    summary: p.summary,
    period_start: p.period_start,
    period_end: p.period_end,
    source_url: p.source_url,
    home_url: `${SITE.url}/support/${p.id}`,
    tags: p.tags,
  }));
  return NextResponse.json({ ok: true, items });
}
