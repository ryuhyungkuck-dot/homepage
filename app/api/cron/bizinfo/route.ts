import { NextResponse, type NextRequest } from 'next/server';
import { syncBizinfo } from '@/lib/sync-bizinfo';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/** Vercel Cron이 매일 호출 (vercel.json). Vercel은 CRON_SECRET을 Authorization 헤더로 보냅니다. */
export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const result = await syncBizinfo();
  return NextResponse.json(result, { status: result.ok ? 200 : 500 });
}
