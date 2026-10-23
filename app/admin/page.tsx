import Link from 'next/link';
import { getAdmin } from '@/lib/supabase/server';
import { signOut } from './actions';

type Row = { date: string; status: 'draft' | 'published'; items: { title: string }[]; updated_at: string };
type Inquiry = { id: number; created_at: string; kind: string; company: string; phone: string; message: string };

export default async function AdminHome() {
  const { sb, user } = await getAdmin();
  if (!sb) return <p>Supabase 환경변수가 설정되지 않았습니다. README의 배포 순서를 확인하세요.</p>;
  if (!user) {
    return (
      <div className="win" style={{ maxWidth: 520, margin: '40px auto' }}>
        <div className="win-bar bar-pink">ACCESS DENIED</div>
        <div className="win-body">
          관리자 계정이 아닙니다.
          <form action={signOut} style={{ marginTop: 14 }}><button className="btn btn-pink btn-sm" type="submit">다른 계정으로 로그인</button></form>
        </div>
      </div>
    );
  }

  const [{ data: posts }, { data: inquiries }] = await Promise.all([
    sb.from('daily_top5').select('date, status, items, updated_at').order('date', { ascending: false }).limit(60),
    sb.from('inquiries').select('*').order('created_at', { ascending: false }).limit(30),
  ]);

  return (
    <>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, marginBottom: 24 }}>
        <div>
          <p className="eyebrow" style={{ margin: 0 }}>TODAY · ADMIN</p>
          <h1 className="h2" style={{ margin: '4px 0 0' }}>오늘의 인기글 관리</h1>
        </div>
        <Link href="/admin/write" className="btn btn-pink">+ 오늘 TOP 5 쓰기</Link>
      </div>

      <div className="win">
        <div className="win-bar bar-yellow">POSTS.DB</div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr><th>날짜</th><th>상태</th><th>글 수</th><th>공개 주소</th><th><span className="sr-only">수정</span></th></tr>
            </thead>
            <tbody>
              {(posts as Row[] | null)?.length ? (
                (posts as Row[]).map((p) => (
                  <tr key={p.date}>
                    <td><strong>{p.date}</strong></td>
                    <td><span className={`badge ${p.status === 'published' ? 'badge-pub' : 'badge-draft'}`}>{p.status === 'published' ? '발행' : '임시저장'}</span></td>
                    <td>{p.items.filter((i) => i.title).length} / 5</td>
                    <td style={{ fontSize: 14 }}>
                      {p.status === 'published' ? <Link href={`/today/${p.date}`} style={{ color: 'var(--navy)' }}>/today/{p.date}</Link> : <span style={{ color: 'var(--ink-soft)' }}>미공개</span>}
                    </td>
                    <td><Link href={`/admin/write?date=${p.date}`} style={{ color: 'var(--navy)', fontWeight: 700 }}>수정</Link></td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5}>아직 쓴 글이 없습니다. 첫 TOP 5를 써 보세요.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="h2" style={{ fontSize: 28, marginTop: 48 }}>문의 내역</h2>
      <div className="win">
        <div className="win-bar bar-pink">INQUIRIES.DB</div>
        <div className="table-wrap">
          <table className="table">
            <thead><tr><th>접수일</th><th>구분</th><th>회사 · 연락처</th><th>내용</th></tr></thead>
            <tbody>
              {(inquiries as Inquiry[] | null)?.length ? (
                (inquiries as Inquiry[]).map((q) => (
                  <tr key={q.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>{new Date(q.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</td>
                    <td>{q.kind}</td>
                    <td>{q.company}<br /><a href={`tel:${q.phone}`} style={{ color: 'var(--navy)' }}>{q.phone}</a></td>
                    <td style={{ whiteSpace: 'pre-wrap' }}>{q.message}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}>아직 들어온 문의가 없습니다.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
