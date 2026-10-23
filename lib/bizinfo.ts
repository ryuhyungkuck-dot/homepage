/**
 * 기업마당(bizinfo.go.kr) 지원사업정보 API → 식품 관련 공고만 골라 3개 분류로 정리.
 * 문서: https://www.bizinfo.go.kr/apiDetail.do?id=bizinfoApi
 */
import type { Category } from './support';

const ENDPOINT = process.env.BIZINFO_API_URL || 'https://www.bizinfo.go.kr/uss/rss/bizinfoApi.do';
const BASE = 'https://www.bizinfo.go.kr';

export type BizinfoItem = Record<string, unknown>;

export type ProgramRow = {
  id: string;
  category: Category;
  title: string;
  agency: string;
  target: string;
  summary: string;
  period_start: string | null;
  period_end: string | null;
  source_url: string;
  tags: string[];
  updated_at: string;
};

/* ---------- fetching ---------- */

export async function fetchBizinfo(count = 500): Promise<BizinfoItem[]> {
  const key = process.env.BIZINFO_API_KEY?.trim();
  if (!key) throw new Error('BIZINFO_API_KEY(기업마당 인증키)가 설정되지 않았습니다');
  const url = new URL(ENDPOINT);
  url.searchParams.set('crtfcKey', key);
  url.searchParams.set('dataType', 'json');
  url.searchParams.set('searchCnt', String(count));
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(25_000) });
  if (!res.ok) throw new Error(`기업마당 응답 오류 HTTP ${res.status}`);
  const text = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error('기업마당 응답이 JSON이 아닙니다 (인증키를 확인하세요)');
  }
  return extractItems(json);
}

/** 응답이 {jsonArray:[...]}, {jsonArray:{item:[...]}}, {item:[...]}, [...] 어느 모양이든 공고 배열로. */
export function extractItems(json: unknown): BizinfoItem[] {
  const pick = (v: unknown): BizinfoItem[] | null => {
    if (Array.isArray(v)) return v as BizinfoItem[];
    if (v && typeof v === 'object') {
      const o = v as Record<string, unknown>;
      for (const k of ['jsonArray', 'item', 'items', 'channel']) {
        if (k in o) {
          const r = pick(o[k]);
          if (r) return r;
        }
      }
      if ('pblancId' in o || 'seq' in o) return [o];
    }
    return null;
  };
  return pick(json) ?? [];
}

/* ---------- normalising one 공고 ---------- */

const s = (v: unknown) => (typeof v === 'string' ? v : v == null ? '' : String(v)).trim();
const first = (o: BizinfoItem, ...keys: string[]) => {
  for (const k of keys) {
    const v = s(o[k]);
    if (v) return v;
  }
  return '';
};

export function stripHtml(html: string) {
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n')
    .trim();
}

const ymd = (d: string) => `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;

/** "20261001 ~ 20261031" → 시작·마감. "상시", "예산 소진 시" 등은 null. */
export function parsePeriod(raw: string): { start: string | null; end: string | null } {
  const dates = (raw.replace(/[.\-/]/g, '').match(/\d{8}/g) || []).filter((d) => !Number.isNaN(Date.parse(ymd(d))));
  if (dates.length >= 2) return { start: ymd(dates[0]), end: ymd(dates[dates.length - 1]) };
  if (dates.length === 1) return raw.trim().startsWith('~') ? { start: null, end: ymd(dates[0]) } : { start: ymd(dates[0]), end: null };
  return { start: null, end: null };
}

function absoluteUrl(u: string, id: string) {
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith('/')) return BASE + u;
  return `${BASE}/web/lay1/bbs/S1T122C128/AS/74/view.do?pblancId=${encodeURIComponent(id)}`;
}

/* ---------- filtering & classifying ---------- */

const FOOD = /식품|먹거리|농식품|수산식품|가공식품|식음료|음식|외식|급식|해썹|HACCP|전통주|주류|양조|김치|장류|발효|제과|제빵|베이커리|떡|음료|푸드|밀키트|농산물\s*가공|수산물\s*가공|6차\s*산업|소스|간편식|HMR/i;
const FACTORY = /스마트\s*공장|스마트\s*제조|공정\s*(개선|혁신)|제조\s*혁신/;
const EDUCATION = /교육|아카데미|연수|세미나|설명회|강좌|과정\s*(모집|운영)|교육생|훈련|컨설턴트\s*양성|역량\s*강화/;
const DISTRIBUTION = /판로|유통|입점|온라인\s*(판매|진출|쇼핑)|쇼핑몰|라이브\s*커머스|홈쇼핑|마케팅|홍보|박람회|전시회|수출|해외\s*(진출|시장)|바이어|상품화|브랜드/;

export function classify(text: string, title: string): Category | null {
  const relevant = FOOD.test(text) || FACTORY.test(text);
  if (!relevant) return null;
  if (EDUCATION.test(title)) return 'education';
  if (DISTRIBUTION.test(title)) return 'distribution';
  if (EDUCATION.test(text) && !/지원금|자금|보조|융자|설비|시설/.test(title)) return 'education';
  if (DISTRIBUTION.test(text) && !FACTORY.test(text) && !/설비|시설|공정|HACCP|해썹/i.test(text)) return 'distribution';
  return 'manufacturing';
}

function shortSummary(text: string, max = 300) {
  const one = text.replace(/\s*\n\s*/g, ' ').replace(/\s+/g, ' ').trim();
  return one.length > max ? one.slice(0, max - 1).trimEnd() + '…' : one;
}

const SKIP_TAG = /^\d{4}$|^\d{4}년$/;

export function toProgram(o: BizinfoItem, today: string): ProgramRow | null {
  const rawId = first(o, 'pblancId', 'seq');
  const id = rawId.replace(/[^A-Za-z0-9_-]/g, '').slice(0, 64);
  const title = first(o, 'pblancNm', 'title');
  if (!id || !title) return null;

  const summaryRaw = first(o, 'bsnsSumryCn') || stripHtml(first(o, 'description'));
  const target = first(o, 'trgetNm');
  const tagsRaw = first(o, 'hashTags', 'hashtags');
  const text = [title, summaryRaw, target, tagsRaw, first(o, 'pldirSportRealmLclasCodeNm', 'lcategory')].join(' ');

  const category = classify(text, title);
  if (!category) return null;

  const { start, end } = parsePeriod(first(o, 'reqstBeginEndDe', 'reqstDt'));
  if (end && end < today) return null; // 이미 마감

  const jrsd = first(o, 'jrsdInsttNm', 'author');
  const exc = first(o, 'excInsttNm');
  const agency = [jrsd, exc && exc !== jrsd ? exc : ''].filter(Boolean).join(' · ');

  const tags = Array.from(new Set(tagsRaw.split(',').map((t) => t.trim()).filter((t) => t && !SKIP_TAG.test(t) && t.length <= 20))).slice(0, 8);

  return {
    id,
    category,
    title: title.slice(0, 300),
    agency: agency.slice(0, 200),
    target: target.slice(0, 500),
    summary: shortSummary(stripHtml(summaryRaw)),
    period_start: start,
    period_end: end,
    source_url: absoluteUrl(first(o, 'pblancUrl', 'link'), rawId),
    tags,
    updated_at: new Date().toISOString(),
  };
}
