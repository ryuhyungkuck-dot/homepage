import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { Dday } from '@/components/SupportList';
import { CATEGORIES, period, programById } from '@/lib/support';
import { SITE, safeLink } from '@/lib/site';

export const revalidate = 3600;

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await programById(params.id);
  if (!p) return {};
  const description = (p.summary || `${p.agency} · ${period(p)} · ${CATEGORIES[p.category].label}`).slice(0, 155);
  return {
    title: `${p.title} | 식품관련업 지원사업`,
    description,
    alternates: { canonical: `/support/${p.id}` },
    openGraph: { type: 'article', title: p.title, description, url: `${SITE.url}/support/${p.id}` },
  };
}

export default async function SupportDetail({ params }: Props) {
  const p = await programById(params.id);
  if (!p) notFound();
  const c = CATEGORIES[p.category];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: p.title,
    datePublished: p.created_at,
    dateModified: p.updated_at,
    author: { '@type': 'Organization', name: 'PAXC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'PAXC', logo: { '@type': 'ImageObject', url: `${SITE.url}/og.png` } },
    mainEntityOfPage: `${SITE.url}/support/${p.id}`,
    about: c.label,
    keywords: [c.short, '식품', '지원사업', ...p.tags].join(', '),
    isBasedOn: safeLink(p.source_url),
  };

  return (
    <>
      <SiteHeader />
      <main className="section">
        <article className="wrap section-inner">
          <nav className="crumb" aria-label="위치">
            <Link href="/">홈</Link> › <Link href="/support">지원사업</Link> › <Link href={`/support?c=${p.category}`}>{c.short}</Link>
          </nav>
          <p className="eyebrow">SUPPORT · {c.label}</p>
          <h1 className="h2" style={{ fontSize: 'clamp(26px, 3.6vw, 40px)' }}>{p.title}</h1>

          <div className="win" style={{ marginTop: 24 }}>
            <div className={`win-bar ${c.bar}`}><span>{p.id}.TXT</span><Dday end={p.period_end} /></div>
            <div className="win-body">
              <dl className="sp-dl">
                <dt>분류</dt><dd>{c.label}</dd>
                {p.agency ? (<><dt>기관</dt><dd>{p.agency}</dd></>) : null}
                <dt>신청 기간</dt><dd>{period(p)}</dd>
                {p.target ? (<><dt>지원 대상</dt><dd>{p.target}</dd></>) : null}
              </dl>
              {p.summary ? (
                <div className="sp-summary">
                  <strong>PAXC 한눈에 정리</strong>
                  <p>{p.summary}</p>
                </div>
              ) : null}
              {p.tags.length ? <p className="sp-tags">{p.tags.map((t) => `#${t}`).join(' ')}</p> : null}
            </div>
          </div>

          <div className="cta-row" style={{ justifyContent: 'flex-start' }}>
            <a href={safeLink(p.source_url)} target="_blank" rel="noopener" className="btn btn-pink">기업마당 원문 보기 ▶</a>
            {p.cafe_url ? (
              <a href={safeLink(p.cafe_url)} target="_blank" rel="noopener" className="btn btn-ghost">카페에서 이야기 나누기</a>
            ) : (
              <a href={SITE.cafe.url} target="_blank" rel="noopener" className="btn btn-ghost">{SITE.cafe.name} 카페 가기</a>
            )}
          </div>
          <p className="note-muted" style={{ marginTop: 18 }}>
            요약은 PAXC가 정리한 것으로, 신청 자격·일정·서류는 반드시 기업마당 원문에서 확인하세요.
          </p>
          <div className="today-foot">
            <Link href={`/support?c=${p.category}`}>◀ {c.label} 목록</Link>
            <Link href="/#contact">스마트공장·지원사업 신청이 막막하면 PAXC와 상담하세요</Link>
          </div>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
      <SiteFooter />
    </>
  );
}
