import { SITE, safeLink, type Top5Item } from '@/lib/site';

export function Top5Window({ date, items, note, headingLevel = 'h3' }: { date: string; items: Top5Item[]; note?: string; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const list = [...items].sort((a, b) => a.rank - b.rank).filter((i) => i.title.trim());
  return (
    <div className="win">
      <div className="win-bar bar-yellow">
        <span>TOP5_{date}.TXT</span>
        <span>매일 오전 업데이트</span>
      </div>
      <ol className="top5">
        {list.map((it) => (
          <li key={it.rank}>
            <span className="top5-rank">{String(it.rank).padStart(2, '0')}</span>
            <span className="top5-body">
              <H className="top5-title">{it.title}</H>
              {it.summary ? <span className="top5-summary">PAXC 한 줄 정리 : {it.summary}</span> : null}
            </span>
            <a className="top5-link" href={safeLink(it.link)} target="_blank" rel="noopener">
              카페에서 보기 ▶<span className="sr-only"> ({SITE.cafe.name}, 새 창)</span>
            </a>
          </li>
        ))}
      </ol>
      {note ? <div className="top5-note">{note}</div> : null}
    </div>
  );
}

export function Top5Empty() {
  return (
    <div className="win">
      <div className="win-bar bar-yellow">
        <span>TOP5.TXT</span>
      </div>
      <div className="win-body">
        첫 인기글을 준비하고 있습니다<span className="blink">_</span>
      </div>
    </div>
  );
}
