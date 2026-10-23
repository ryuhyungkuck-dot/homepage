import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdmin } from '@/lib/supabase/server';
import { StillStars } from '@/components/Starfield';
import { signOut } from './actions';

export const metadata: Metadata = { title: '관리자', robots: { index: false, follow: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await getAdmin();
  return (
    <>
      <StillStars />
      <header className="admin-bar">
        <div className="wrap">
          <Link href="/" className="admin-brand">
            <span style={{ color: 'var(--mint)' }}>P</span>
            <span style={{ color: 'var(--pink)' }}>A</span>
            <span style={{ color: 'var(--yellow)' }}>X</span>
            <span style={{ color: 'var(--mint)' }}>C</span>{' '}
            <span style={{ fontSize: 14, color: 'var(--cream)', textShadow: 'none' }}>ADMIN</span>
          </Link>
          {user ? (
            <div className="admin-links">
              <Link href="/admin">글 목록</Link>
              <Link href="/admin/write">새 글 쓰기</Link>
              <span style={{ color: '#a9aed6' }}>{user.email}</span>
              <form action={signOut}>
                <button type="submit" className="btn btn-ghost btn-sm" style={{ borderColor: 'var(--cream)', color: 'var(--cream)' }}>로그아웃</button>
              </form>
            </div>
          ) : null}
        </div>
      </header>
      <main className="wrap admin-main">{children}</main>
    </>
  );
}
