'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { browserClient } from '@/lib/supabase/browser';

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
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw });
    setBusy(false);
    if (error) return setErr('이메일 또는 비밀번호가 맞지 않습니다.');
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
