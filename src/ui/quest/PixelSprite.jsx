// ─── Kaaya Quest pixel sprites ───────────────────────────────────────────────
// One shared component for every icon inside the Quest skin (plan §5.3):
// inline SVG rects, crisp edges, fills via CSS vars so sprites theme with
// the tree. Zero emoji, no Lucide inside Quest. New sprites are added to
// SPRITES here — never inlined ad hoc in pages.
//
// A sprite is a grid of characters; each character maps to a fill in its
// palette ('.' = empty). '#' always means currentColor, so one-colour
// sprites take the colour of their context.

const C = 'currentColor';
const V = (name) => `var(${name})`;

export const SPRITES = {
  heart: {
    pal: { R: V('--q-red'), W: V('--q-ink') },
    grid: [
      '.WW.RRRR.',
      'WRRWRRRRR',
      'RRRRRRRRR',
      'RRRRRRRRR',
      '.RRRRRRR.',
      '..RRRRR..',
      '...RRR...',
      '....R....',
    ],
  },
  coin: {
    pal: { G: V('--q-gold'), E: V('--q-ember') },
    grid: [
      '.GGGGGG.',
      'GGGGGGGG',
      'GG.EE.GG',
      'G.GEE.GG',
      'G.G...GG',
      'GG.GE.GG',
      'GGGGGGGG',
      '.GGGGGG.',
    ],
  },
  flame: {
    pal: { E: V('--q-ember'), G: V('--q-gold') },
    grid: [
      '....E...',
      '...EE...',
      '...EEE..',
      '..EEEE..',
      '..EEEEE.',
      '.EEGGEE.',
      '.EGGGGE.',
      'EEGGGGE.',
      'EEGGGGE.',
      '.EEEEE..',
    ],
  },
  crown: {
    pal: { G: V('--q-gold'), E: V('--q-ember') },
    grid: [
      'G..G.G..G',
      'GG.GGG.GG',
      'GGGGGGGGG',
      'GGGEGEGGG',
      'GGGGGGGGG',
      '.GGGGGGG.',
    ],
  },
  star: {
    pal: { G: V('--q-gold') },
    grid: [
      '....G....',
      '....G....',
      '...GGG...',
      'GGGGGGGGG',
      '.GGGGGGG.',
      '..GGGGG..',
      '..GG.GG..',
      '.GG...GG.',
      'GG.....GG',
    ],
  },
  bolt: {
    pal: { G: V('--q-gold') },
    grid: [
      '.....GGG',
      '....GGG.',
      '...GGG..',
      '..GGGGG.',
      '.GGGG...',
      '..GG....',
      '.GG.....',
      'GG......',
    ],
  },
  dumbbell: {
    pal: { '#': C },
    grid: [
      '..#....#..',
      '.###..###.',
      '##########',
      '##########',
      '##########',
      '.###..###.',
      '..#....#..',
    ],
  },
  home: {
    pal: { '#': C },
    grid: [
      '....##....',
      '...####...',
      '..######..',
      '.########.',
      '##########',
      '.########.',
      '.###..###.',
      '.###..###.',
      '.########.',
    ],
  },
  grid: {
    pal: { '#': C },
    grid: [
      '#########',
      '#..#..#.#',
      '#..#..#.#',
      '#########',
      '#..#..#.#',
      '#..#..#.#',
      '#########',
      '#..#..#.#',
      '#########',
    ],
  },
  apple: {
    pal: { R: V('--q-red'), G: V('--q-volt-dk'), B: '#8a5a2b' },
    grid: [
      '....B....',
      '...B.GG..',
      '....GG...',
      '..RRRRR..',
      '.RRRRRRR.',
      'RRRRRRRRR',
      'RRRRRRRRR',
      '.RRRRRRR.',
      '..RR.RR..',
    ],
  },
  trophy: {
    pal: { G: V('--q-gold'), E: V('--q-ember') },
    grid: [
      'GGGGGGGG',
      'G.GGGG.G',
      'G.GGGG.G',
      '.GGGGGG.',
      '..GEEG..',
      '...GG...',
      '...GG...',
      '..GGGG..',
      '.GGGGGG.',
      'GGGGGGGG',
    ],
  },
  chart: {
    pal: { S: V('--q-sky'), V: V('--q-volt'), G: V('--q-gold') },
    grid: [
      '.........',
      '......G..',
      '..S...G..',
      '..S.V.G..',
      '..S.V.G..',
      '..S.V.G..',
      '..S.V.G..',
      '#########',
    ],
  },
  clock: {
    pal: { '#': C },
    grid: [
      '..#####..',
      '.#######.',
      '###..####',
      '##...####',
      '##..#####',
      '##.....##',
      '###...###',
      '.#######.',
      '..#####..',
    ],
  },
  scale: {
    pal: { '#': C },
    grid: [
      '...###...',
      '..#...#..',
      '..#.#.#..',
      '..#####..',
      '.#######.',
      '#########',
      '#########',
      '#########',
    ],
  },
  ruler: {
    pal: { '#': C },
    grid: [
      '###########',
      '#.#.#.#.#.#',
      '#.........#',
      '###########',
    ],
  },
  moon: {
    pal: { G: V('--q-gold') },
    grid: [
      '...GGGG..',
      '..GGGGG..',
      '.GGG.....',
      '.GG......',
      'GG.......',
      '.GG......',
      '.GGG.....',
      '..GGGGG..',
      '...GGGG..',
    ],
  },
  mail: {
    pal: { '#': C },
    grid: [
      '###########',
      '##.......##',
      '#.#.....#.#',
      '#..#...#..#',
      '#...#.#...#',
      '#....#....#',
      '#.........#',
      '###########',
    ],
  },
  dots: {
    pal: { '#': C },
    grid: ['##..##..##', '##..##..##'],
  },
  check: {
    pal: { '#': C },
    grid: [
      '........#',
      '.......##',
      '......##.',
      '.....##..',
      '#...##...',
      '##.##....',
      '####.....',
      '.##......',
    ],
  },
  x: {
    pal: { '#': C },
    grid: [
      '##...##',
      '.##.##.',
      '..###..',
      '...#...',
      '..###..',
      '.##.##.',
      '##...##',
    ],
  },
  plus: {
    pal: { '#': C },
    grid: [
      '...#...',
      '...#...',
      '...#...',
      '#######',
      '...#...',
      '...#...',
      '...#...',
    ],
  },
  minus: {
    pal: { '#': C },
    grid: ['#######'],
  },
  chevR: {
    pal: { '#': C },
    grid: [
      '##....',
      '.##...',
      '..##..',
      '...##.',
      '....##',
      '...##.',
      '..##..',
      '.##...',
      '##....',
    ],
  },
  chevL: {
    pal: { '#': C },
    grid: [
      '....##',
      '...##.',
      '..##..',
      '.##...',
      '##....',
      '.##...',
      '..##..',
      '...##.',
      '....##',
    ],
  },
  skull: {
    pal: { '#': C },
    grid: [
      '.#######.',
      '#########',
      '##.###.##',
      '#########',
      '###.#.###',
      '.#######.',
      '..#####..',
      '..#.#.#..',
    ],
  },
  bot: {
    pal: { P: V('--q-dim'), V: V('--q-volt'), E: V('--q-ember') },
    grid: [
      '.....V.....',
      '.....V.....',
      '..PPPPPPP..',
      '.PPPPPPPPP.',
      '.PVV.P.VVP.',
      '.PPPPPPPPP.',
      '.PP.EEE.PP.',
      '.PPPPPPPPP.',
      '..PPPPPPP..',
      '...P...P...',
    ],
  },
  zzz: {
    pal: { S: V('--q-sky') },
    grid: [
      'SSSSSS',
      '....SS',
      '...SS.',
      '..SS..',
      '.SS...',
      'SS....',
      'SSSSSS',
    ],
  },
  arm: {
    pal: { '#': C },
    grid: [
      '....####..',
      '..#######.',
      '.#########',
      '#########.',
      '#######...',
      '######....',
      '.#####....',
      '..####....',
      '..###.....',
      '..##......',
    ],
  },
  person: {
    pal: { '#': C },
    grid: [
      '..#####..',
      '..#####..',
      '..#####..',
      '...###...',
      '#########',
      '#########',
      '.#######.',
      '...###...',
      '..##.##..',
      '..##.##..',
      '..##.##..',
      '.###.###.',
    ],
  },
};

export default function PixelSprite({ name, size = 24, style, className }) {
  const sprite = SPRITES[name];
  if (!sprite) return null;
  const rows = sprite.grid.length;
  const cols = Math.max(...sprite.grid.map((r) => r.length));
  const rects = [];
  sprite.grid.forEach((row, y) => {
    [...row].forEach((ch, x) => {
      if (ch === '.' || ch === ' ') return;
      const fill = sprite.pal[ch] || C;
      rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={fill} />);
    });
  });
  return (
    <svg
      viewBox={`0 0 ${cols} ${rows}`}
      width={size}
      height={Math.round((size * rows) / cols)}
      style={{ display: 'block', flexShrink: 0, ...style }}
      className={className}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
