import Link from 'next/link';
import { SiteFooter, SiteHeader } from '@/components/SiteChrome';
import { Sprite, VB } from '@/components/Sprites';
import { Starfield } from '@/components/Starfield';

export default function NotFound() {
  return (
    <>
      <Starfield />
      <SiteHeader />
      <main className="section">
        <div className="wrap section-inner" style={{ textAlign: 'center' }}>
          <div style={{ width: 90, margin: '0 auto 20px' }} aria-hidden="true"><Sprite id="pxc-crate" vb={VB.crate} w="100%" /></div>
          <p className="eyebrow">ERROR 404</p>
          <h1 className="h2">GAME OVER</h1>
          <p>찾으시는 페이지가 없습니다.</p>
          <p style={{ marginTop: 28 }}><Link href="/" className="btn btn-pink">CONTINUE? ▶</Link></p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
