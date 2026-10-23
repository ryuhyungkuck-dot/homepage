import Link from 'next/link';
import { LogoMark } from './Logo';
import { SITE } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav className="wrap nav" aria-label="주 메뉴">
        <Link href="/" aria-label="PAXC 홈">
          <LogoMark />
        </Link>
        <div className="nav-links">
          <Link href="/#about">회사소개</Link>
          <Link href="/#solution">솔루션</Link>
          <Link href="/today">오늘의 인기글</Link>
          <Link href="/#contact" className="btn btn-pink btn-sm">
            상담하기
          </Link>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-inner">
        <div className="biz-card">
          <div className="biz-card-top">
            <span className="biz-card-name">PAXC</span>
            <svg viewBox="0 0 9 15" width={26} height={42} style={{ transform: 'rotate(42deg)' }} shapeRendering="crispEdges" aria-hidden="true">
              <use href="#pxc-rocket" />
            </svg>
          </div>
          <div className="biz-card-slogan">{SITE.slogan}</div>
          <div className="biz-card-bottom">
            <div className="barcode" aria-hidden="true" />
            <svg viewBox="0 0 20 20" width={30} height={30} aria-hidden="true">
              <circle cx="10" cy="10" r="8.5" fill="none" stroke="#1F9E86" strokeWidth="2" />
              <ellipse cx="10" cy="10" rx="4" ry="8.5" fill="none" stroke="#1F9E86" strokeWidth="1.6" />
              <line x1="1.5" y1="10" x2="18.5" y2="10" stroke="#1F9E86" strokeWidth="1.6" />
            </svg>
          </div>
        </div>
        <address className="footer-info">
          <div className="footer-tag">PAXC · {SITE.acronym}</div>
          {SITE.address}
          <br />
          대표 {SITE.ceo} · 사업자등록번호 {SITE.bizNo}
          <br />
          TEL <a href={`tel:${SITE.tel}`}>{SITE.tel}</a> · <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <br />
          © {new Date().getFullYear()} PAXC · <Link href="/admin">관리자</Link>
        </address>
      </div>
    </footer>
  );
}
