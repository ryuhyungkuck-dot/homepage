import Link from 'next/link';
import { CATEGORIES, dday, period, type Category, type SupportProgram } from '@/lib/support';

export function Dday({ end }: { end: string | null }) {
  const d = dday(end);
  const cls = !d.open ? 'dday dday-closed' : d.urgent ? 'dday dday-urgent' : 'dday';
  return <span className={cls}>{d.label}</span>;
}

/** One category as a pixel window: title bar + up to N programs. Used on the home page. */
export function SupportWindow({ category, items }: { category: Category; items: SupportProgram[] }) {
  const c = CATEGORIES[category];
  return (
    <div className="win support-win">
      <div className={`win-bar ${c.bar}`}>
        <span>{category.toUpperCase()}.LST</span>
        <span>{items.length ? `${items.length}건 모집 중` : ''}</span>
      </div>
      <div className="support-win-head">
        <svg viewBox={c.sprite === 'pxc-gear' ? '0 0 9 9' : c.sprite === 'pxc-crate' ? '0 0 9 8' : '0 0 11 6'} width={30} height={26} shapeRendering="crispEdges" aria-hidden="true">
          <use href={`#${c.sprite}`} />
        </svg>
        <h3>{c.label}</h3>
      </div>
      {items.length ? (
        <ul className="sp-list">
          {items.map((p) => (
            <li key={p.id}>
              <Link href={`/support/${p.id}`}>
                <Dday end={p.period_end} />
                <span className="sp-title">{p.title}</span>
                <span className="sp-meta">{p.agency ? `${p.agency} · ` : ''}{period(p)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="sp-empty">지금 모집 중인 공고를 정리하고 있습니다<span className="blink">_</span></p>
      )}
      <Link href={`/support?c=${category}`} className="sp-more">전체 보기 ▶</Link>
    </div>
  );
}

/** Full list rows for /support. */
export function SupportRows({ items }: { items: SupportProgram[] }) {
  return (
    <ul className="sp-list sp-list-full">
      {items.map((p) => (
        <li key={p.id}>
          <Link href={`/support/${p.id}`}>
            <Dday end={p.period_end} />
            <span className="sp-cat">{CATEGORIES[p.category].short}</span>
            <span className="sp-title">{p.title}</span>
            <span className="sp-meta">{p.agency ? `${p.agency} · ` : ''}{period(p)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
