import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { LogoHero } from '@/components/Logo';
import { Sprite, VB } from '@/components/Sprites';
import { Top5Empty, Top5Window } from '@/components/Top5List';
import { ContactForm } from '@/components/ContactForm';
import { SupportWindow } from '@/components/SupportList';
import { latestPost } from '@/lib/posts';
import { CATEGORY_KEYS, openByCategory } from '@/lib/support';
import { SITE } from '@/lib/site';

export const revalidate = 600;

const SAUCER_X = [20.5, 36.5, 52.5, 68.5];
const ROW_X = [5.5, 21.5, 37.5, 53.5, 69.5, 85.5];

const MEANING = [
  { l: 'P', w: 'Pre-sale', d: '장비를 고민하고 견적을 요청하는 순간', bar: 'bar-mint' },
  { l: 'A', w: 'After-sale', d: '장비가 현장에서 돌아가는 매일', bar: 'bar-pink' },
  { l: 'X', w: 'eXperience', d: '공급사와 현장, 두 선이 만나는 자리', bar: 'bar-yellow' },
  { l: 'C', w: 'Connected', d: '같은 장비 데이터로 이어진 두 프로그램', bar: 'bar-mint' },
];

const MOMENTS: [string, string, string][] = [
  ['01 고민', '문의 접수', '장비 비교'],
  ['02 견적', '견적서 작성', '견적 확인'],
  ['03 설치', '장비 등록', 'MES 등록'],
  ['04 가동', '가동 현황', '생산 · 재고'],
  ['05 A/S', '접수 · 처리', '이상 알림'],
  ['06 다음', '증설 제안', '다음 장비 고민'],
];

export default async function Home() {
  const [post, support] = await Promise.all([latestPost(), openByCategory(4)]);

  return (
    <>
      <SiteHeader />
      <main>
        {/* HERO */}
        <section className="wrap hero" id="top">
          <div className="hud" aria-hidden="true">
            <span><span className="k">1UP</span> 002026</span>
            <span><span className="k">HIGH SCORE</span> 999999</span>
            <span style={{ color: 'var(--yellow)' }}>STAGE 01 · FOOD FACTORY</span>
          </div>
          <div className="formation">
            <svg viewBox="0 0 100 32" shapeRendering="crispEdges" role="img" aria-label="PAXC 기체에 맞서는 적 편대: 불량 비행접시, 고장 톱니, 재고 상자">
              {SAUCER_X.map((x) => <use key={`s${x}`} href="#pxc-saucer" x={x} y={0} />)}
              {ROW_X.map((x) => <use key={`g${x}`} href="#pxc-gear" x={x} y={10} />)}
              {ROW_X.map((x) => <use key={`c${x}`} href="#pxc-crate" x={x} y={23} />)}
            </svg>
          </div>
          <div className="flyer" aria-hidden="true"><Sprite id="pxc-saucer" vb={VB.saucer} w="100%" /></div>

          <h1 className="sr-only">PAXC — 식품 제조 현장과 식품 장비 공급사를 잇는 소프트웨어</h1>
          <LogoHero />
          <p className="slogan">{SITE.slogan}</p>
          <p className="declaration">
            {SITE.declaration}
            <br />
            <span>식품 제조사와 식품 장비 공급사를 하나의 데이터로 잇습니다.</span>
          </p>
          <div className="cta-row">
            <Link href="#contact" className="btn btn-pink">상담 신청 ▶</Link>
            <Link href="#solution" className="btn btn-ghost">솔루션 보기</Link>
          </div>

          <div className="player" aria-hidden="true">
            <span className="shot" />
            <span className="shot late" />
            <div className="ship"><Sprite id="pxc-fighter" vb={VB.fighter} w="100%" /></div>
            <div className="lives">
              LIFE
              <Sprite id="pxc-fighter" vb={VB.fighter} w={20} h={18} />
              <Sprite id="pxc-fighter" vb={VB.fighter} w={20} h={18} />
              <Sprite id="pxc-fighter" vb={VB.fighter} w={20} h={18} />
            </div>
            <div className="credit">CREDIT 01</div>
          </div>

          <div className="win sys-win">
            <div className="win-bar bar-pink win-dots" aria-hidden="true"><span /><span /><span /></div>
            <div className="win-body">PAXC<br />SYSTEM ONLINE<span className="blink">_</span></div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="section section-alt">
          <div className="wrap section-inner">
            <div className="deco" style={{ right: 48, top: 64, width: 72 }} aria-hidden="true"><Sprite id="pxc-saucer" vb={VB.saucer} w="100%" /></div>
            <p className="eyebrow">01 · PAXC IDENTITY</p>
            <h2 className="h2">판매 전부터 판매 후까지,<br />경험을 잇다</h2>
            <p className="lead">식품 제조 현장에는 좋은 장비가 많습니다. 그런데 장비가 팔리는 순간, 공급사와 현장의 연결은 대부분 끊어집니다. PAXC는 그 둘을 하나의 데이터로 잇습니다.</p>
            <div className="meaning-grid">
              {MEANING.map((m) => (
                <div className="win" key={m.l}>
                  <div className={`win-bar ${m.bar}`}>{m.l}.TXT</div>
                  <div className="win-body">
                    <div className="meaning-letter">{m.l}</div>
                    <div className="meaning-word">{m.w}</div>
                    <div>{m.d}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SOLUTION */}
        <section id="solution" className="section">
          <div className="wrap section-inner">
            <div className="deco" style={{ right: 64, top: 56, width: 54, animationDuration: '1.8s' }} aria-hidden="true"><Sprite id="pxc-gear" vb={VB.gear} w="100%" /></div>
            <p className="eyebrow">02 · SOLUTION</p>
            <h2 className="h2" style={{ marginBottom: 36 }}>한쪽은 팔 때, 한쪽은 쓸 때</h2>
            <div className="sol-row">
              <article className="sol-card">
                <div className="sol-head">
                  <svg viewBox="0 0 12 10" width={48} height={40} shapeRendering="crispEdges" aria-hidden="true"><rect x="0" y="1" width="5" height="2" fill="#FF6BA7" /><rect x="0" y="2" width="12" height="8" fill="#FF6BA7" /><rect x="0" y="4" width="12" height="1" fill="#D94A86" /></svg>
                  <div><div className="sol-for" style={{ color: 'var(--pink)' }}>FOR 식품 장비 공급사</div><h3>BPK FIT</h3></div>
                </div>
                <p>식품 포장자동화 장비의 영업관리 플랫폼. 장비를 판 뒤에도, 식품 제조 고객과 계속 연결되도록.</p>
                <div className="sol-flow">견적 요청 → 견적서 작성 → 계약 → A/S</div>
                <ul className="sol-list">
                  <li>제품 문의부터 계약까지 이어지는 영업 흐름</li>
                  <li>설치 장비 등록 · A/S 이력 관리</li>
                </ul>
              </article>
              <article className="sol-card">
                <div className="sol-head">
                  <svg viewBox="0 0 12 12" width={48} height={48} shapeRendering="crispEdges" aria-hidden="true"><rect x="1" y="0" width="10" height="8" fill="#F5EED7" /><rect x="2" y="1" width="8" height="6" fill="#4DE0C1" /><rect x="4" y="3" width="1" height="1" fill="#1B1F3B" /><rect x="7" y="3" width="1" height="1" fill="#1B1F3B" /><rect x="4" y="5" width="4" height="1" fill="#1B1F3B" /><rect x="3" y="9" width="6" height="2" fill="#F5EED7" /><rect x="5" y="8" width="2" height="1" fill="#F5EED7" /></svg>
                  <div><div className="sol-for" style={{ color: 'var(--mint)' }}>FOR 식품 제조사</div><h3>Foodly</h3></div>
                </div>
                <p>작은 식품 공장도 감당할 수 있는 MES.</p>
                <div className="sol-flow">생산 · 재고 · 원료수불 · 위생 관리</div>
                <ul className="sol-list">
                  <li>HACCP · 스마트해썹 대응</li>
                  <li><a href={SITE.foodly} target="_blank" rel="noopener">foodly.co.kr 바로가기</a></li>
                </ul>
              </article>
            </div>

            <div className="win moments">
              <div className="win-bar bar-mint"><span>SIX_MOMENTS.EXE</span><span>공급사 ◀▶ 고객사</span></div>
              <div className="moments-body">
                <div className="moments-grid">
                  <span /><strong style={{ color: '#C2306F' }}>공급사</strong><span /><strong style={{ color: '#137A66' }}>고객사</strong>
                  {MOMENTS.map(([k, a, b], i) => (
                    <FragmentRow key={k} k={k} a={a} b={b} split={i === 3} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TODAY */}
        <section id="today" className="section section-alt">
          <div className="wrap section-inner">
            <div className="deco" style={{ right: 60, top: 60, width: 54 }} aria-hidden="true"><Sprite id="pxc-crate" vb={VB.crate} w="100%" /></div>
            <p className="eyebrow">03 · TODAY</p>
            <h2 className="h2">어제 식품제조인들이<br />가장 많이 본 글</h2>
            <p className="lead" style={{ color: 'var(--muted)', marginBottom: 28 }}>
              <a href={SITE.cafe.url} target="_blank" rel="noopener">{SITE.cafe.name}</a>에서 어제 가장 많이 읽힌 글을 PAXC가 매일 아침 골라 한 줄로 정리합니다. 원문은 카페에서 확인하세요.
            </p>
            {post ? <Top5Window date={post.date} items={post.items} /> : <Top5Empty />}
            <div className="today-foot">
              <Link href="/today">◀ 지난 인기글 모아보기</Link>
              <a href={SITE.cafe.url} target="_blank" rel="noopener" className="btn btn-pink btn-sm">식품제조 카페 가입하기 ▶</a>
            </div>
          </div>
        </section>

        {/* SUPPORT PROGRAMS */}
        <section id="support" className="section">
          <div className="wrap section-inner">
            <div className="deco" style={{ right: 64, top: 56, width: 56, animationDuration: '2.4s' }} aria-hidden="true"><Sprite id="pxc-fighter" vb={VB.fighter} w="100%" /></div>
            <p className="eyebrow">04 · SUPPORT</p>
            <h2 className="h2">식품관련업을 하는<br />사장님을 위한 지원사업</h2>
            <p className="lead" style={{ color: 'var(--muted)', marginBottom: 28 }}>
              기업마당의 공고 중 식품 제조·유통 사장님께 맞는 것만 PAXC가 매일 골라, 마감이 가까운 순서로 정리합니다.
            </p>
            <div className="support-grid">
              {CATEGORY_KEYS.map((k) => (
                <SupportWindow key={k} category={k} items={support[k]} />
              ))}
            </div>
            <div className="today-foot">
              <Link href="/support">◀ 지원사업 전체 보기</Link>
              <a href={SITE.cafe.url} target="_blank" rel="noopener" className="btn btn-pink btn-sm">카페에서 지원사업 소식 받기 ▶</a>
            </div>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section section-alt">
          <div className="wrap section-inner">
            <div style={{ width: 64, margin: '0 auto 14px', animation: 'pxc-bob 1.6s ease-in-out infinite' }} aria-hidden="true">
              <Sprite id="pxc-fighter" vb={VB.fighter} w="100%" />
            </div>
            <h2 className="h2" style={{ textAlign: 'center', marginBottom: 32 }}>함께 만들어요</h2>
            <ContactForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function FragmentRow({ k, a, b, split }: { k: string; a: string; b: string; split: boolean }) {
  return (
    <>
      {split ? <span className="moments-split">Pre-sale ▲ ── ▼ After-sale</span> : null}
      <strong>{k}</strong>
      <span>{a}</span>
      <span aria-hidden="true">◀▶</span>
      <span>{b}</span>
    </>
  );
}
