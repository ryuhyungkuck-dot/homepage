'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { saveTop5, unpublish } from '../actions';
import type { Top5Item } from '@/lib/site';

export function WriteForm(props: { date: string; items: Top5Item[]; note: string; status: 'draft' | 'published' | null }) {
  const router = useRouter();
  const [date, setDate] = useState(props.date);
  const [rows, setRows] = useState<Top5Item[]>(props.items);
  const [note, setNote] = useState(props.note);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, start] = useTransition();

  const set = (i: number, key: keyof Top5Item, v: string) => setRows((r) => r.map((row, j) => (j === i ? { ...row, [key]: v } : row)));

  function save(status: 'draft' | 'published') {
    setMsg(null);
    start(async () => {
      const res = await saveTop5({ date, items: rows, note, status });
      setMsg({ ok: res.ok, text: res.message });
      if (res.ok) router.refresh();
    });
  }

  function takeDown() {
    start(async () => {
      const res = await unpublish(date);
      setMsg({ ok: res.ok, text: res.message });
      if (res.ok) router.refresh();
    });
  }

  return (
    <>
      <p className="eyebrow" style={{ margin: 0 }}>TODAY · WRITE</p>
      <h1 className="h2" style={{ margin: '4px 0 24px' }}>오늘의 TOP 5 쓰기</h1>
      <div className="write-grid">
        <form
          className="win write-form"
          onSubmit={(e) => {
            e.preventDefault();
            save('published');
          }}
        >
          <div className="win-bar bar-pink"><span>WRITE.EXE</span>{props.status ? <span>현재 상태: {props.status === 'published' ? '발행' : '임시저장'}</span> : null}</div>
          <div className="form-stack">
            <label className="field" style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 10 }}>
              날짜 (어제 기준)
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  router.push(`/admin/write?date=${e.target.value}`);
                }}
              />
            </label>

            {rows.map((r, i) => (
              <fieldset className="rank-box" key={i}>
                <legend>{i + 1}위</legend>
                <div className="grid-2">
                  <label className="field">
                    게시글 제목
                    <input value={r.title} onChange={(e) => set(i, 'title', e.target.value)} placeholder="카페 글 제목 그대로" maxLength={200} />
                  </label>
                  <label className="field">
                    카페 원문 링크
                    <input type="url" value={r.link} onChange={(e) => set(i, 'link', e.target.value)} placeholder="https://cafe.naver.com/food2008/..." maxLength={500} />
                  </label>
                </div>
                <label className="field" style={{ marginTop: 10 }}>
                  PAXC 한 줄 정리
                  <input value={r.summary} onChange={(e) => set(i, 'summary', e.target.value)} placeholder="직접 쓴 요약 (원문 복사 금지)" maxLength={300} />
                </label>
              </fieldset>
            ))}

            <label className="field">
              <span>오늘의 해설 <small>구글 검색에 걸리는 PAXC 고유 글 — 3~5문장 권장</small></span>
              <textarea rows={5} value={note} onChange={(e) => setNote(e.target.value)} placeholder="어제 식품제조인들이 많이 본 주제와 PAXC의 관점" maxLength={3000} />
            </label>

            <div className="form-foot">
              <button type="submit" className="btn btn-pink" disabled={pending} style={{ borderColor: 'var(--navy-deep)' }}>발행하기 ▶</button>
              <button type="button" className="btn btn-cream" disabled={pending} onClick={() => save('draft')}>임시저장</button>
              {props.status === 'published' ? (
                <button type="button" className="btn btn-cream" disabled={pending} onClick={takeDown}>발행 취소</button>
              ) : null}
            </div>
            {msg ? <p role="status" className={msg.ok ? 'msg-ok' : 'msg-err'} style={{ margin: 0 }}>{msg.ok ? '✓ ' : '⚠ '}{msg.text}</p> : null}
          </div>
        </form>

        <aside className="write-preview" aria-label="미리보기">
          <div style={{ fontSize: 14, color: 'var(--mint)', marginBottom: 8 }}>미리보기 — 홈페이지에 이렇게 보여요</div>
          <div className="win">
            <div className="win-bar bar-yellow"><span>TOP5_{date}.TXT</span></div>
            <ol className="top5">
              {rows.map((r, i) => (
                <li key={i}>
                  <span className="top5-rank">{String(i + 1).padStart(2, '0')}</span>
                  <span className="top5-body">
                    <strong>{r.title || '[게시글 제목]'}</strong>
                    <span className="top5-summary">PAXC 한 줄 정리 : {r.summary || '[요약]'}</span>
                  </span>
                </li>
              ))}
            </ol>
            <div className="top5-note">{note || '[오늘의 해설]'}</div>
          </div>
          <p className="note-muted">공개 주소 : /today/{date}<br />발행하면 홈 화면의 TOP 5, 날짜별 페이지, 사이트맵이 함께 바뀝니다.</p>
        </aside>
      </div>
    </>
  );
}
