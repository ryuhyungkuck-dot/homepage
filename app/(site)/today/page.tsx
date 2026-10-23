import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { Top5Empty } from '@/components/Top5List';
import { publishedDates } from '@/lib/posts';
import { SITE, koDate } from '@/lib/site';

export const revalidate = 600;

export const metadata: Metadata = {
  title: '식품제조 카페 인기글 TOP 5 모아보기',
  description: `${SITE.cafe.name}에서 매일 가장 많이 읽힌 글 TOP 5를 PAXC가 날짜별로 정리합니다.`,
  alternates: { canonical: '/today' },
};

export default async function TodayArchive() {
  const days = await publishedDates();
  return (
    <>
      <SiteHeader />
      <main className="section">
        <div className="wrap section-inner">
          <p className="eyebrow">TODAY · ARCHIVE</p>
          <h1 className="h2">식품제조 카페 인기글<br />날짜별 모아보기</h1>
          <p className="lead" style={{ color: 'var(--muted)' }}>
            <a href={SITE.cafe.url} target="_blank" rel="noopener">{SITE.cafe.name}</a>에서 하루 동안 가장 많이 읽힌 글을 매일 아침 정리합니다.
          </p>
          {days.length === 0 ? (
            <Top5Empty />
          ) : (
            <div className="win">
              <div className="win-bar bar-yellow"><span>ARCHIVE.DIR</span><span>{days.length}일</span></div>
              <ul className="archive">
                {days.map((d) => (
                  <li key={d.date}>
                    <Link href={`/today/${d.date}`}>
                      <span className="archive-date">{koDate(d.date)}</span>
                      <span>{d.items.filter((i) => i.title).sort((a, b) => a.rank - b.rank)[0]?.title ?? ''}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
