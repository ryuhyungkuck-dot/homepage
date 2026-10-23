import { VB } from './Sprites';

const COLORS = ['#F5EED7', '#F5EED7', '#F5EED7', '#FFD93B', '#4DE0C1', '#FF6BA7'];

type Star = { x: string; y: string; size: number; color: string };
type Spark = { x: string; y: string; size: number; color: string };

function build() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  // Stars are split into three groups. Each group twinkles as one layer,
  // so the browser animates 3 layers instead of ~190 separate elements.
  const groups: { stars: Star[]; sparks: Spark[] }[] = [
    { stars: [], sparks: [] },
    { stars: [], sparks: [] },
    { stars: [], sparks: [] },
  ];
  for (let i = 0; i < 170; i++) {
    groups[i % 3].stars.push({
      x: (rnd() * 100).toFixed(2),
      y: (rnd() * 100).toFixed(2),
      size: rnd() < 0.75 ? 2 : 3,
      color: COLORS[Math.floor(rnd() * COLORS.length)],
    });
  }
  for (let i = 0; i < 22; i++) {
    groups[i % 3].sparks.push({
      x: (rnd() * 96).toFixed(2),
      y: (rnd() * 98).toFixed(2),
      size: rnd() < 0.5 ? 12 : 18,
      color: rnd() < 0.6 ? '#FFD93B' : '#F5EED7',
    });
  }
  return groups;
}

const GROUPS = build();
const TIMING = [
  { dur: '2.4s', delay: '0s' },
  { dur: '3.2s', delay: '0.8s' },
  { dur: '1.9s', delay: '1.5s' },
];

export function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield-layer starfield-a" />
      <div className="starfield-layer starfield-b" />
      {GROUPS.map((g, gi) => (
        <div key={gi} className="twinkle" style={{ animationDuration: TIMING[gi].dur, animationDelay: TIMING[gi].delay }}>
          {g.stars.map((s, i) => (
            <span key={i} className="star" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, height: s.size, background: s.color }} />
          ))}
          {g.sparks.map((s, i) => (
            <svg key={`s${i}`} viewBox={VB.spark} className="star" shapeRendering="crispEdges" style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size }}>
              <use href="#pxc-spark" fill={s.color} />
            </svg>
          ))}
        </div>
      ))}
    </div>
  );
}

/** Still, non-animated stars for screens where people type (admin). */
export function StillStars() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield-layer starfield-a still" />
    </div>
  );
}
