'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/lib/supabase/browser';

function explain(e: { message?: string; code?: string; status?: number }) {
  const msg = (e.message || '').toLowerCase();
  if (e.code === 'email_not_confirmed' || msg.includes('not confirmed'))
    return '이메일 인증이 안 된 계정입니다. Supabase > Authentication > Users에서 이 계정을 인증(Confirm)해 주세요.';
  if (e.code === 'invalid_credentials' || msg.includes('invalid login credentials'))
    return '이메일 또는 비밀번호가 맞지 않습니다. Supabase > Authentication > Users에 이 이메일의 계정이 있는지 확인하세요.';
  if (msg.includes('invalid api key') || msg.includes('no api key') || e.status === 401)
    return '홈페이지에 넣은 Supabase 키가 맞지 않습니다. Vercel 환경변수 NEXT_PUBLIC_SUPABASE_ANON_KEY를 확인하세요.';
  if (e.status === 429 || msg.includes('rate limit')) return '로그인 시도가 너무 많습니다. 몇 분 뒤 다시 시도하세요.';
  return `로그인 실패: ${e.message || '알 수 없는 오류'}`;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    const sb = browserClient();
    if (!sb) return setErr('Supabase 설정(환경변수)이 없습니다.');
    if (!email.trim() || !pw) return setErr('이메일과 비밀번호를 입력하세요.');
    setBusy(true);
    let error: { message?: string; code?: string; status?: number } | null = null;
    try {
      ({ error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw }));
    } catch {
      setBusy(false);
      return setErr('Supabase 주소에 연결할 수 없습니다. Vercel 환경변수 NEXT_PUBLIC_SUPABASE_URL을 확인하세요.');
    }
    setBusy(false);
    if (error) return setErr(explain(error));
    router.replace('/admin');
    router.refresh();
  }

  return (
    <div style={{ paddingBlock: 40 }}>
      <form onSubmit={onSubmit} className="win" style={{ maxWidth: 440, margin: '0 auto' }}>
        <div className="win-bar bar-pink"><span>LOGIN.EXE</span><span aria-hidden="true">_ □ ×</span></div>
        <div className="form-stack" style={{ padding: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 22 }}>관리자 로그인</div>
          <div style={{ fontSize: 14, color: 'var(--ink-soft)' }}>관리자 계정 1개만 접속할 수 있습니다.</div>
          <label className="field">
            이메일
            <input type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="field">
            비밀번호
            <input type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} />
          </label>
          {err ? <p className="msg-err" role="alert" style={{ margin: 0 }}>⚠ {err}</p> : null}
          <button type="submit" className="btn btn-pink" disabled={busy} style={{ borderColor: 'var(--navy-deep)' }}>
            {busy ? '접속 중…' : '접속 ▶'}
          </button>
        </div>
      </form>
      <p style={{ textAlign: 'center', marginTop: 28, fontSize: 14, color: '#a9aed6' }}>
        SYSTEM READY<span className="blink">_</span>
      </p>
    </div>
  );
}
