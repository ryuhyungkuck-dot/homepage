/* Shared pixel sprites for the whole site, rendered once in the layout and reused with <use href="#…">. */

const P_SH =
  'M8 8h10v10h-10zM18 8h10v10h-10zM28 8h10v10h-10zM38 8h10v10h-10zM48 8h10v10h-10zM8 18h10v10h-10zM18 18h10v10h-10zM28 18h10v10h-10zM38 18h10v10h-10zM48 18h10v10h-10zM58 18h10v10h-10zM8 28h10v10h-10zM18 28h10v10h-10zM48 28h10v10h-10zM58 28h10v10h-10zM8 38h10v10h-10zM18 38h10v10h-10zM48 38h10v10h-10zM58 38h10v10h-10zM8 48h10v10h-10zM18 48h10v10h-10zM28 48h10v10h-10zM38 48h10v10h-10zM48 48h10v10h-10zM58 48h10v10h-10zM8 58h10v10h-10zM18 58h10v10h-10zM28 58h10v10h-10zM38 58h10v10h-10zM48 58h10v10h-10zM8 68h10v10h-10zM18 68h10v10h-10zM8 78h10v10h-10zM18 78h10v10h-10zM88 8h10v10h-10zM98 8h10v10h-10zM108 8h10v10h-10zM118 8h10v10h-10zM78 18h10v10h-10zM88 18h10v10h-10zM98 18h10v10h-10zM108 18h10v10h-10zM118 18h10v10h-10zM128 18h10v10h-10zM78 28h10v10h-10zM88 28h10v10h-10zM118 28h10v10h-10zM128 28h10v10h-10zM78 38h10v10h-10zM88 38h10v10h-10zM118 38h10v10h-10zM128 38h10v10h-10zM78 48h10v10h-10zM88 48h10v10h-10zM98 48h10v10h-10zM108 48h10v10h-10zM118 48h10v10h-10zM128 48h10v10h-10zM78 58h10v10h-10zM88 58h10v10h-10zM98 58h10v10h-10zM108 58h10v10h-10zM118 58h10v10h-10zM128 58h10v10h-10zM78 68h10v10h-10zM88 68h10v10h-10zM118 68h10v10h-10zM128 68h10v10h-10zM78 78h10v10h-10zM88 78h10v10h-10zM118 78h10v10h-10zM128 78h10v10h-10zM148 8h10v10h-10zM158 8h10v10h-10zM188 8h10v10h-10zM198 8h10v10h-10zM148 18h10v10h-10zM158 18h10v10h-10zM188 18h10v10h-10zM198 18h10v10h-10zM158 28h10v10h-10zM168 28h10v10h-10zM178 28h10v10h-10zM188 28h10v10h-10zM168 38h10v10h-10zM178 38h10v10h-10zM168 48h10v10h-10zM178 48h10v10h-10zM158 58h10v10h-10zM168 58h10v10h-10zM178 58h10v10h-10zM188 58h10v10h-10zM148 68h10v10h-10zM158 68h10v10h-10zM188 68h10v10h-10zM198 68h10v10h-10zM148 78h10v10h-10zM158 78h10v10h-10zM188 78h10v10h-10zM198 78h10v10h-10zM228 8h10v10h-10zM238 8h10v10h-10zM248 8h10v10h-10zM258 8h10v10h-10zM268 8h10v10h-10zM218 18h10v10h-10zM228 18h10v10h-10zM238 18h10v10h-10zM248 18h10v10h-10zM258 18h10v10h-10zM268 18h10v10h-10zM218 28h10v10h-10zM228 28h10v10h-10zM218 38h10v10h-10zM228 38h10v10h-10zM218 48h10v10h-10zM228 48h10v10h-10zM218 58h10v10h-10zM228 58h10v10h-10zM218 68h10v10h-10zM228 68h10v10h-10zM238 68h10v10h-10zM248 68h10v10h-10zM258 68h10v10h-10zM268 68h10v10h-10zM228 78h10v10h-10zM238 78h10v10h-10zM248 78h10v10h-10zM258 78h10v10h-10zM268 78h10v10h-10z';
const P_P =
  'M0 0h10v10h-10zM10 0h10v10h-10zM20 0h10v10h-10zM30 0h10v10h-10zM40 0h10v10h-10zM0 10h10v10h-10zM10 10h10v10h-10zM20 10h10v10h-10zM30 10h10v10h-10zM40 10h10v10h-10zM50 10h10v10h-10zM0 20h10v10h-10zM10 20h10v10h-10zM40 20h10v10h-10zM50 20h10v10h-10zM0 30h10v10h-10zM10 30h10v10h-10zM40 30h10v10h-10zM50 30h10v10h-10zM0 40h10v10h-10zM10 40h10v10h-10zM20 40h10v10h-10zM30 40h10v10h-10zM40 40h10v10h-10zM50 40h10v10h-10zM0 50h10v10h-10zM10 50h10v10h-10zM20 50h10v10h-10zM30 50h10v10h-10zM40 50h10v10h-10zM0 60h10v10h-10zM10 60h10v10h-10zM0 70h10v10h-10zM10 70h10v10h-10z';
const P_A =
  'M80 0h10v10h-10zM90 0h10v10h-10zM100 0h10v10h-10zM110 0h10v10h-10zM70 10h10v10h-10zM80 10h10v10h-10zM90 10h10v10h-10zM100 10h10v10h-10zM110 10h10v10h-10zM120 10h10v10h-10zM70 20h10v10h-10zM80 20h10v10h-10zM110 20h10v10h-10zM120 20h10v10h-10zM70 30h10v10h-10zM80 30h10v10h-10zM110 30h10v10h-10zM120 30h10v10h-10zM70 40h10v10h-10zM80 40h10v10h-10zM90 40h10v10h-10zM100 40h10v10h-10zM110 40h10v10h-10zM120 40h10v10h-10zM70 50h10v10h-10zM80 50h10v10h-10zM90 50h10v10h-10zM100 50h10v10h-10zM110 50h10v10h-10zM120 50h10v10h-10zM70 60h10v10h-10zM80 60h10v10h-10zM110 60h10v10h-10zM120 60h10v10h-10zM70 70h10v10h-10zM80 70h10v10h-10zM110 70h10v10h-10zM120 70h10v10h-10z';
const P_X =
  'M140 0h10v10h-10zM150 0h10v10h-10zM180 0h10v10h-10zM190 0h10v10h-10zM140 10h10v10h-10zM150 10h10v10h-10zM180 10h10v10h-10zM190 10h10v10h-10zM150 20h10v10h-10zM160 20h10v10h-10zM170 20h10v10h-10zM180 20h10v10h-10zM160 30h10v10h-10zM170 30h10v10h-10zM160 40h10v10h-10zM170 40h10v10h-10zM150 50h10v10h-10zM160 50h10v10h-10zM170 50h10v10h-10zM180 50h10v10h-10zM140 60h10v10h-10zM150 60h10v10h-10zM180 60h10v10h-10zM190 60h10v10h-10zM140 70h10v10h-10zM150 70h10v10h-10zM180 70h10v10h-10zM190 70h10v10h-10z';
const P_C =
  'M220 0h10v10h-10zM230 0h10v10h-10zM240 0h10v10h-10zM250 0h10v10h-10zM260 0h10v10h-10zM210 10h10v10h-10zM220 10h10v10h-10zM230 10h10v10h-10zM240 10h10v10h-10zM250 10h10v10h-10zM260 10h10v10h-10zM210 20h10v10h-10zM220 20h10v10h-10zM210 30h10v10h-10zM220 30h10v10h-10zM210 40h10v10h-10zM220 40h10v10h-10zM210 50h10v10h-10zM220 50h10v10h-10zM210 60h10v10h-10zM220 60h10v10h-10zM230 60h10v10h-10zM240 60h10v10h-10zM250 60h10v10h-10zM260 60h10v10h-10zM220 70h10v10h-10zM230 70h10v10h-10zM240 70h10v10h-10zM250 70h10v10h-10zM260 70h10v10h-10z';

export function Sprites() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <path id="pxc-sh" d={P_SH} />
        <path id="pxc-p" d={P_P} />
        <path id="pxc-a" d={P_A} />
        <path id="pxc-x" d={P_X} />
        <path id="pxc-c" d={P_C} />
        <g id="pxc-rocket">
          <path fill="#F5EED7" stroke="#F5EED7" strokeWidth="1.6" strokeLinejoin="miter" d="M4 0h1v1h-1zM3 1h3v1h-3zM2 2h5v2h-5zM1 4h7v5h-7zM0 9h9v3h-9zM3 12h3v2h-3zM4 14h1v1h-1z" />
          <path fill="#1B1F3B" d="M4 0h1v1h-1zM3 1h1v1h-1zM5 1h1v1h-1zM2 2h1v1h-1zM6 2h1v1h-1zM2 3h1v1h-1zM6 3h1v1h-1zM1 4h1v1h-1zM4 4h1v1h-1zM7 4h1v1h-1zM1 5h1v1h-1zM3 5h1v1h-1zM5 5h1v1h-1zM7 5h1v1h-1zM1 6h1v1h-1zM3 6h1v1h-1zM5 6h1v1h-1zM7 6h1v1h-1zM1 7h1v1h-1zM4 7h1v1h-1zM7 7h1v1h-1zM1 8h1v1h-1zM7 8h1v1h-1zM0 9h1v1h-1zM2 9h1v1h-1zM6 9h1v1h-1zM8 9h1v1h-1zM0 10h1v1h-1zM8 10h1v1h-1zM0 11h1v1h-1zM2 11h1v1h-1zM3 11h1v1h-1zM4 11h1v1h-1zM5 11h1v1h-1zM6 11h1v1h-1zM8 11h1v1h-1z" />
          <path fill="#FF6BA7" d="M4 1h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM1 9h1v1h-1zM7 9h1v1h-1zM1 10h1v1h-1zM2 10h1v1h-1zM6 10h1v1h-1zM7 10h1v1h-1zM1 11h1v1h-1zM7 11h1v1h-1z" />
          <path fill="#F5EED7" d="M3 3h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM2 5h1v1h-1zM6 5h1v1h-1zM2 6h1v1h-1zM6 6h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM3 9h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM3 10h1v1h-1zM4 10h1v1h-1zM5 10h1v1h-1z" />
          <path fill="#4DE0C1" d="M4 5h1v1h-1zM4 6h1v1h-1z" />
          <path fill="#FFD93B" d="M3 12h1v1h-1zM5 12h1v1h-1zM3 13h1v1h-1zM4 13h1v1h-1zM5 13h1v1h-1zM4 14h1v1h-1z" />
          <path fill="#FF8A3D" d="M4 12h1v1h-1z" />
        </g>
        <path id="pxc-spark" d="M2 0h1v2h-1zM0 2h2v1h-2zM3 2h2v1h-2zM2 3h1v2h-1zM2 2h1v1h-1z" />
        <g id="pxc-fighter">
          <path fill="#4DE0C1" d="M6 0h1v1h-1zM5 1h1v1h-1zM7 1h1v1h-1zM5 2h1v1h-1zM7 2h1v1h-1zM4 3h1v1h-1zM8 3h1v1h-1zM4 4h1v1h-1zM8 4h1v1h-1zM3 5h1v1h-1zM9 5h1v1h-1zM3 6h1v1h-1zM9 6h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM9 7h1v1h-1zM10 7h1v1h-1zM2 8h1v1h-1zM3 8h1v1h-1zM4 8h1v1h-1zM8 8h1v1h-1zM9 8h1v1h-1zM10 8h1v1h-1zM4 9h1v1h-1zM5 9h1v1h-1zM7 9h1v1h-1zM8 9h1v1h-1z" />
          <path fill="#F5EED7" d="M6 1h1v1h-1zM6 2h1v1h-1zM5 3h1v1h-1zM6 3h1v1h-1zM7 3h1v1h-1zM5 4h1v1h-1zM7 4h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1zM7 5h1v1h-1zM8 5h1v1h-1zM4 6h1v1h-1zM8 6h1v1h-1zM4 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM8 7h1v1h-1zM5 8h1v1h-1zM6 8h1v1h-1zM7 8h1v1h-1z" />
          <path fill="#FFD93B" d="M6 4h1v1h-1zM6 5h1v1h-1zM5 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM4 11h1v1h-1zM8 11h1v1h-1z" />
          <path fill="#FF6BA7" d="M0 5h1v1h-1zM12 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM11 6h1v1h-1zM12 6h1v1h-1zM0 7h1v1h-1zM1 7h1v1h-1zM11 7h1v1h-1zM12 7h1v1h-1zM0 8h1v1h-1zM1 8h1v1h-1zM11 8h1v1h-1zM12 8h1v1h-1zM0 9h1v1h-1zM12 9h1v1h-1z" />
          <path fill="#FF8A3D" d="M4 10h1v1h-1zM8 10h1v1h-1z" />
        </g>
        <g id="pxc-gear">
          <path fill="#FF6BA7" d="M2 0h1v1h-1zM4 0h1v1h-1zM6 0h1v1h-1zM1 1h1v1h-1zM2 1h1v1h-1zM3 1h1v1h-1zM4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1zM7 1h1v1h-1zM0 2h1v1h-1zM1 2h1v1h-1zM2 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM1 3h1v1h-1zM7 3h1v1h-1zM0 4h1v1h-1zM1 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM1 5h1v1h-1zM7 5h1v1h-1zM0 6h1v1h-1zM1 6h1v1h-1zM2 6h1v1h-1zM6 6h1v1h-1zM7 6h1v1h-1zM8 6h1v1h-1zM1 7h1v1h-1zM2 7h1v1h-1zM3 7h1v1h-1zM4 7h1v1h-1zM5 7h1v1h-1zM6 7h1v1h-1zM7 7h1v1h-1zM2 8h1v1h-1zM4 8h1v1h-1zM6 8h1v1h-1z" />
          <path fill="#0E1128" d="M3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM2 3h1v1h-1zM6 3h1v1h-1zM2 4h1v1h-1zM4 4h1v1h-1zM6 4h1v1h-1zM2 5h1v1h-1zM6 5h1v1h-1zM3 6h1v1h-1zM4 6h1v1h-1zM5 6h1v1h-1z" />
          <path fill="#FFD93B" d="M3 3h1v1h-1zM4 3h1v1h-1zM5 3h1v1h-1zM3 4h1v1h-1zM5 4h1v1h-1zM3 5h1v1h-1zM4 5h1v1h-1zM5 5h1v1h-1z" />
        </g>
        <g id="pxc-saucer">
          <path fill="#4DE0C1" d="M4 0h1v1h-1zM5 0h1v1h-1zM6 0h1v1h-1zM3 1h1v1h-1zM7 1h1v1h-1z" />
          <path fill="#F5EED7" d="M4 1h1v1h-1zM5 1h1v1h-1zM6 1h1v1h-1z" />
          <path fill="#FF6BA7" d="M1 2h1v1h-1zM2 2h1v1h-1zM3 2h1v1h-1zM4 2h1v1h-1zM5 2h1v1h-1zM6 2h1v1h-1zM7 2h1v1h-1zM8 2h1v1h-1zM9 2h1v1h-1zM0 3h1v1h-1zM1 3h1v1h-1zM3 3h1v1h-1zM4 3h1v1h-1zM6 3h1v1h-1zM7 3h1v1h-1zM9 3h1v1h-1zM10 3h1v1h-1zM1 4h1v1h-1zM2 4h1v1h-1zM3 4h1v1h-1zM4 4h1v1h-1zM5 4h1v1h-1zM6 4h1v1h-1zM7 4h1v1h-1zM8 4h1v1h-1zM9 4h1v1h-1z" />
          <path fill="#FFD93B" d="M2 3h1v1h-1zM5 3h1v1h-1zM8 3h1v1h-1zM2 5h1v1h-1zM8 5h1v1h-1z" />
        </g>
        <g id="pxc-crate">
          <path fill="#0E1128" d="M0 0h9v1h-9zM0 1h1v5h-1zM8 1h1v5h-1zM2 5h5v1h-5zM0 6h9v1h-9zM1 7h1v1h-1zM7 7h1v1h-1z" />
          <path fill="#F5EED7" d="M1 1h7v1h-7zM1 2h1v2h-1zM3 2h3v2h-3zM7 2h1v2h-1zM1 4h7v1h-7zM1 5h1v1h-1zM7 5h1v1h-1z" />
          <path fill="#4DE0C1" d="M2 2h1v2h-1zM6 2h1v2h-1z" />
        </g>
      </defs>
    </svg>
  );
}

export function Sprite({ id, w, h, vb, className, style }: { id: string; w: number | string; h?: number | string; vb: string; className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox={vb} width={w} height={h} className={className} style={style} shapeRendering="crispEdges" aria-hidden="true" focusable="false">
      <use href={`#${id}`} />
    </svg>
  );
}

export const VB = { fighter: '0 0 13 12', gear: '0 0 9 9', saucer: '0 0 11 6', crate: '0 0 9 8', rocket: '0 0 9 15', spark: '0 0 5 5' };
