import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { Top5Window } from '@/components/Top5List';
import { neighbors, postByDate } from '@/lib/posts';
import { SITE, isDate, koDate, safeLink } from '@/lib/site';

export const revalidate = 3600;

type Props = { params: { date: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  if (!isDate(params.date)) return {};
  const post = await postByDate(params.date);
  if (!post) return {};
  const first = [...post.items].sort((a, b) => a.rank - b.rank).find((i) => i.title)?.title ?? '';
  const title = `${koDate(post.date)} 식품제조 카페 인기글 TOP 5`;
  const description = (post.note || `1위 「${first}」 외 — ${SITE.cafe.name}에서 어제 가장 많이 읽힌 글을 PAXC가 정리했습니다.`).slice(0, 155);
  return {
    title,
    description,
    alternates: { canonical: `/today/${post.date}` },
    openGraph: { type: 'article', title, description, url: `${SITE.url}/today/${post.date}`, publishedTime: post.published_at ?? undefined },
  };
}

export default async function TodayDetail({ params }: Props) {
  if (!isDate(params.date)) notFound();
  const post = await postByDate(params.date);
  if (!post) notFound();
  const { prev, next } = await neighbors(post.date);
  const items = [...post.items].sort((a, b) => a.rank - b.rank).filter((i) => i.title.trim());

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: `${koDate(post.date)} 식품제조 카페 인기글 TOP 5`,
    datePublished: post.published_at ?? post.date,
    dateModified: post.updated_at,
    author: { '@type': 'Organization', name: 'PAXC', url: SITE.url },
    publisher: { '@type': 'Organization', name: 'PAXC', logo: { '@type': 'ImageObject', url: `${SITE.url}/og.png` } },
    mainEntityOfPage: `${SITE.url}/today/${post.date}`,
    articleBody: post.note || undefined,
    mentions: items.map((i) => ({ '@type': 'DiscussionForumPosting', headline: i.title, url: safeLink(i.link) })),
  };

  return (
    <>
      <SiteHeader />
      <main className="section">
        <article className="wrap section-inner">
          <nav className="crumb" aria-label="위치"><Link href="/">홈</Link> › <Link href="/today">인기글 모아보기</Link> › {koDate(post.date)}</nav>
          <p className="eyebrow">TODAY · {post.date}</p>
          <h1 className="h2">{koDate(post.date)}<br />식품제조 카페 인기글 TOP 5</h1>
          <p className="lead" style={{ color: 'var(--muted)' }}>
            <a href={SITE.cafe.url} target="_blank" rel="noopener">{SITE.cafe.name}</a>에서 이날 가장 많이 읽힌 글입니다. 제목과 원문은 글쓴이의 것이며, 한 줄 정리와 해설은 PAXC가 썼습니다.
          </p>
          <Top5Window date={post.date} items={items} note={post.note} headingLevel="h2" />
          <div className="pager">
            {prev ? <Link href={`/today/${prev}`}>◀ {koDate(prev)}</Link> : <span />}
            {next ? <Link href={`/today/${next}`}>{koDate(next)} ▶</Link> : <span />}
          </div>
          <div className="today-foot">
            <Link href="/#contact">식품 공장 고민은 PAXC와 상담하세요</Link>
            <a href={SITE.cafe.url} target="_blank" rel="noopener" className="btn btn-pink btn-sm">식품제조 카페 가입하기 ▶</a>
          </div>
        </article>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </main>
      <SiteFooter />
    </>
  );
}
