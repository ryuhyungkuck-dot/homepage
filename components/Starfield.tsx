import { VB } from './Sprites';

const COLORS = ['#F5EED7', '#F5EED7', '#F5EED7', '#FFD93B', '#4DE0C1', '#FF6BA7'];

function build() {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const stars = Array.from({ length: 170 }, () => ({
    x: (rnd() * 100).toFixed(2),
    y: (rnd() * 100).toFixed(2),
    size: rnd() < 0.75 ? 2 : 3,
    color: COLORS[Math.floor(rnd() * COLORS.length)],
    dur: (1.4 + rnd() * 3).toFixed(1),
    delay: (rnd() * 3).toFixed(1),
  }));
  const sparks = Array.from({ length: 22 }, () => ({
    x: (rnd() * 96).toFixed(2),
    y: (rnd() * 98).toFixed(2),
    size: rnd() < 0.5 ? 12 : 18,
    color: rnd() < 0.6 ? '#FFD93B' : '#F5EED7',
    dur: (1.8 + rnd() * 2.4).toFixed(1),
  }));
  return { stars, sparks };
}

const { stars, sparks } = build();

export function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      <div className="starfield-layer starfield-a" />
      <div className="starfield-layer starfield-b" />
      {stars.map((s, i) => (
        <span
          key={i}
          className="star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: s.color,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
      {sparks.map((s, i) => (
        <svg
          key={`s${i}`}
          viewBox={VB.spark}
          className="star"
          shapeRendering="crispEdges"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.size, animationDuration: `${s.dur}s` }}
        >
          <use href="#pxc-spark" fill={s.color} />
        </svg>
      ))}
    </div>
  );
}
