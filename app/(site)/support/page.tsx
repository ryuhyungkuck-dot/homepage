import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { SupportRows } from '@/components/SupportList';
import { CATEGORIES, CATEGORY_KEYS, isCategory, listPrograms } from '@/lib/support';
import { SITE } from '@/lib/site';

export const revalidate = 3600;

type Props = { searchParams: { c?: string } };

export function generateMetadata({ searchParams }: Props): Metadata {
  const c = isCategory(searchParams.c) ? searchParams.c : null;
  const title = c ? `${CATEGORIES[c].label} | 식품관련업 사장님을 위한 지원사업` : '식품관련업 사장님을 위한 지원사업';
  return {
    title,
    description: '식품 제조·유통 사장님이 신청할 수 있는 정부 지원사업과 교육을 PAXC가 매일 골라 정리합니다. 마감일 순으로 확인하세요.',
    alternates: { canonical: c ? `/support?c=${c}` : '/support' },
  };
}

export default async function SupportPage({ searchParams }: Props) {
  const c = isCategory(searchParams.c) ? searchParams.c : undefined;
  const items = await listPrograms(c);
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap section-inner">
          <nav className="crumb" aria-label="위치"><Link href="/">홈</Link> › 지원사업</nav>
          <p className="eyebrow">SUPPORT · 지원사업</p>
          <h1 className="h2">식품관련업을 하는<br />사장님을 위한 지원사업</h1>
          <p className="lead" style={{ color: 'var(--muted)' }}>
            기업마당의 공고 중 식품 제조·유통 사장님께 맞는 것만 골라, 마감이 가까운 순서로 정리합니다. 자세한 이야기는 <a href={SITE.cafe.url} target="_blank" rel="noopener">{SITE.cafe.name} 카페</a>에서 나눠요.
          </p>

          <nav className="tabs" aria-label="분류">
            <Link href="/support" className={!c ? 'active' : ''} aria-current={!c ? 'page' : undefined}>전체</Link>
            {CATEGORY_KEYS.map((k) => (
              <Link key={k} href={`/support?c=${k}`} className={c === k ? 'active' : ''} aria-current={c === k ? 'page' : undefined}>
                {CATEGORIES[k].label}
              </Link>
            ))}
          </nav>

          <div className="win">
            <div className={`win-bar ${c ? CATEGORIES[c].bar : 'bar-yellow'}`}>
              <span>SUPPORT.LST</span>
              <span>{items.length}건</span>
            </div>
            {items.length ? <SupportRows items={items} /> : <p className="sp-empty">등록된 공고가 아직 없습니다<span className="blink">_</span></p>}
          </div>
          <p className="note-muted" style={{ marginTop: 14 }}>
            공고 내용은 기업마당 원문을 기준으로 합니다. 신청 전 반드시 원문에서 자격과 일정을 확인하세요.
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
