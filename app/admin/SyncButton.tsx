'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { runBizinfoSync } from './actions';

export function SyncButton() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  return (
    <div className="form-foot" style={{ marginBottom: 16 }}>
      <button
        type="button"
        className="btn btn-pink btn-sm"
        disabled={pending}
        onClick={() =>
          start(async () => {
            setMsg(null);
            const r = await runBizinfoSync();
            setMsg({ ok: r.ok, text: r.message });
            if (r.ok) router.refresh();
          })
        }
      >
        {pending ? '불러오는 중…' : '기업마당에서 지금 불러오기 ▶'}
      </button>
      {msg ? (
        <p role="status" className={msg.ok ? 'msg-ok' : 'msg-err'} style={{ color: msg.ok ? 'var(--mint)' : '#ff8fa3' }}>
          {msg.ok ? '✓ ' : '⚠ '}
          {msg.text}
        </p>
      ) : null}
    </div>
  );
}
