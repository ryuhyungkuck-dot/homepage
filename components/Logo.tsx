function Letters() {
  return (
    <>
      <g fill="#F5EED7" stroke="#F5EED7" strokeWidth={16} strokeLinejoin="miter">
        <use href="#pxc-sh" />
        <use href="#pxc-p" />
        <use href="#pxc-a" />
        <use href="#pxc-x" />
        <use href="#pxc-c" />
      </g>
      <use href="#pxc-sh" fill="#0E1128" />
      <use href="#pxc-p" fill="#4DE0C1" />
      <use href="#pxc-a" fill="#FF6BA7" />
      <use href="#pxc-x" fill="#FFD93B" />
      <use href="#pxc-c" fill="#4DE0C1" />
    </>
  );
}

/** Small header logo (letters only). */
export function LogoMark({ width = 128 }: { width?: number }) {
  return (
    <svg viewBox="-12 -12 302 112" width={width} role="img" aria-label="PAXC" style={{ display: 'block', height: 'auto' }}>
      <Letters />
    </svg>
  );
}

/** Full hero logo with rocket, trail and sparkles. */
export function LogoHero() {
  const trail = 'M-50 92 C -70 40, -10 -10, 120 -30 C 210 -44, 270 -60, 318 -78';
  return (
    <svg
      viewBox="-70 -125 450 240"
      className="hero-logo"
      role="img"
      aria-label="PAXC 로고: 민트 P, 분홍 A, 노랑 X, 민트 C 블록 글자와 날아오르는 로켓"
    >
      <path d={trail} fill="none" stroke="#F5EED7" strokeWidth={12} strokeLinecap="round" />
      <path d={trail} fill="none" stroke="#FF6BA7" strokeWidth={6} strokeLinecap="round" />
      <Letters />
      <g transform="translate(318 -118) rotate(42) scale(6.2)" shapeRendering="crispEdges">
        <use href="#pxc-rocket" />
      </g>
      <g transform="translate(250 -110) scale(3)" shapeRendering="crispEdges"><use href="#pxc-spark" fill="#FFD93B" /></g>
      <g transform="translate(205 -70) scale(2)" shapeRendering="crispEdges"><use href="#pxc-spark" fill="#F5EED7" /></g>
      <g transform="translate(360 -20) scale(2.4)" shapeRendering="crispEdges"><use href="#pxc-spark" fill="#F5EED7" /></g>
      <g transform="translate(-40 -60) scale(2.4)" shapeRendering="crispEdges"><use href="#pxc-spark" fill="#FFD93B" /></g>
    </svg>
  );
}
