/* ───────────────────────────────────────────────────────────────────────────
   EMBER FORGE 2.0 — shared icons + render helpers
   Kept tiny and dependency-free so the mock-ups open from a plain static server.
   ─────────────────────────────────────────────────────────────────────────── */

const ICONS = {
  dash:      '<rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/>',
  splits:    '<path d="M4 6h16M4 12h16M4 18h10"/><circle cx="19" cy="18" r="2"/>',
  target:    '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
  salad:     '<path d="M4 12h16a8 8 0 0 1-16 0Z"/><path d="M12 12c0-4 2.5-7 7-8"/><path d="M12 12C9 9 6 9 4 10"/>',
  trend:     '<path d="M3 17l6-6 4 4 8-8"/><path d="M15 7h6v6"/>',
  trophy:    '<path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 5H4v2a3 3 0 0 0 3 3M17 5h3v2a3 3 0 0 1-3 3"/><path d="M12 14v3M9 21h6M10 18h4v3h-4z"/>',
  mail:      '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
  user:      '<circle cx="12" cy="8" r="3.6"/><path d="M4.5 20a7.5 7.5 0 0 1 15 0"/>',
  sun:       '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M19 5l-1.5 1.5M6.5 17.5 5 19"/>',
  moon:      '<path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z"/>',
  plus:      '<path d="M12 5v14M5 12h14"/>',
  minus:     '<path d="M5 12h14"/>',
  check:     '<path d="m4.5 12.5 5 5 10-11"/>',
  circle:    '<circle cx="12" cy="12" r="8.5"/>',
  down:      '<path d="m6 9 6 6 6-6"/>',
  right:     '<path d="m9 6 6 6-6 6"/>',
  left:      '<path d="m15 6-6 6 6 6"/>',
  kebab:     '<circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  search:    '<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  clock:     '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
  flame:     '<path d="M12 3s5 5 5 9a5 5 0 0 1-10 0c0-1.6.8-3 1.8-4.2C9.5 9.6 10 8 10 6c1.2.6 2 1.6 2 3Z"/>',
  droplet:   '<path d="M12 3.5S6 10 6 14a6 6 0 0 0 12 0c0-4-6-10.5-6-10.5Z"/>',
  steps:     '<path d="M7 4c1.7 0 3 1.6 3 4s-.6 4-2.4 4S5 10.4 5 8s.3-4 2-4Z"/><path d="M5.5 14h4.5v5.5H6.5A1 1 0 0 1 5.5 18.5V14Z"/><path d="M17 8c1.7 0 3 1.6 3 4s-.6 4-2.4 4S15 14.4 15 12s.3-4 2-4Z"/>',
  activity:  '<path d="M3 12h3.5L9 5l4 14 2.5-7H21"/>',
  scale:     '<rect x="4" y="4" width="16" height="16" rx="4"/><path d="M8.5 9.5a5 5 0 0 1 7 0"/><path d="M12 12.5 10 10"/>',
  ruler:     '<path d="m3 15 6-6 6 6-6 6z"/><path d="M7.5 10.5 9 12M10 8l1.5 1.5M13 11l1.5 1.5"/>',
  share:     '<path d="M12 15V4M8.5 7.5 12 4l3.5 3.5"/><path d="M5 13v5.5A1.5 1.5 0 0 0 6.5 20h11a1.5 1.5 0 0 0 1.5-1.5V13"/>',
  refresh:   '<path d="M20 11a8 8 0 0 0-13.6-4.6L4 8.5"/><path d="M4 4v4.5h4.5"/><path d="M4 13a8 8 0 0 0 13.6 4.6L20 15.5"/><path d="M20 20v-4.5h-4.5"/>',
  x:         '<path d="m6 6 12 12M18 6 6 18"/>',
  zap:       '<path d="M13 3 5 13.5h5.5L11 21l8-10.5h-5.5L13 3Z"/>',
  bell:      '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6-2 6h16s-2-1-2-6Z"/><path d="M10.5 19.5a2 2 0 0 0 3 0"/>',
  timer:     '<circle cx="12" cy="13" r="8"/><path d="M12 9.5V13l2.5 1.5"/><path d="M9.5 2.5h5"/>',
  edit:      '<path d="m4 16.5-.8 4.3 4.3-.8L19 8.5 15.5 5 4 16.5Z"/><path d="m14 6.5 3.5 3.5"/>',
  star:      '<path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1.1 5.8L12 16.8 6.7 19.6l1.1-5.8L3.5 9.7l5.9-.8L12 3.5Z"/>',
  layers:    '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3.5 12.5 8.5 4.7 8.5-4.7"/>',
  grid:      '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  bolt:      '<path d="M11 3 4.5 13H10l-1 8 7.5-10H11l0-8Z"/>',
  chevronUp: '<path d="m18 15-6-6-6 6"/>',
};

let uid = 0;
const uidNext = () => `g${++uid}`;

function icon(name, size = 18, sw = 1.7) {
  const d = ICONS[name] || '';
  return `<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor"
    stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

/** Build a notched meter. pct 0..100 */
function notch(pct, { segs = 20, tone = '', size = '' } = {}) {
  const filled = Math.round((Math.min(100, Math.max(0, pct)) / 100) * segs);
  let out = `<div class="notch ${size} ${tone}" role="img" aria-label="${Math.round(pct)} percent">`;
  for (let i = 0; i < segs; i++) {
    const cls = i < filled ? (i === filled - 1 ? 'f lead' : 'f') : '';
    out += `<i class="${cls}"></i>`;
  }
  return out + '</div>';
}

/** Sparkline SVG from [0..1] values */
function spark(values, { w = 74, h = 26, mute = false } = {}) {
  const pad = 2;
  const min = Math.min(...values), max = Math.max(...values);
  const span = max - min || 1;
  const pts = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / span) * (h - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = `${line} L ${w - pad} ${h} L ${pad} ${h} Z`;
  const gid = uidNext();
  return `<svg class="spark ${mute ? 'mute' : ''}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="rgba(255,122,69,0.28)"/>
      <stop offset="100%" stop-color="rgba(255,122,69,0)"/>
    </linearGradient></defs>
    <path d="${area}" fill="url(#${gid})" stroke="none"/>
    <path d="${line}"/>
  </svg>`;
}

/** 270° ring gauge, gap at the bottom */
function gauge(pct, { size = 132, sw = 8, ticks = 5, inner = '' } = {}) {
  const r = (size - sw) / 2 - 4;
  const c = size / 2;
  const circ = 2 * Math.PI * r;
  const arcLen = circ * 0.75;               // 270°
  const fill = arcLen * (Math.min(100, Math.max(0, pct)) / 100);
  const gid = uidNext();

  let tickEls = '';
  for (let i = 0; i < ticks; i++) {
    const a = 135 + (270 / (ticks - 1)) * i;
    const rad = (a * Math.PI) / 180;
    const r1 = r + sw / 2 + 4, r2 = r + sw / 2 + 8;
    const on = pct >= ((i + 1) / ticks) * 100 * 0.6;
    tickEls += `<line class="gauge-tick ${on ? 'on' : ''}"
      x1="${(c + Math.cos(rad) * r1).toFixed(1)}" y1="${(c + Math.sin(rad) * r1).toFixed(1)}"
      x2="${(c + Math.cos(rad) * r2).toFixed(1)}" y2="${(c + Math.sin(rad) * r2).toFixed(1)}"/>`;
  }

  return `<div class="gauge" style="width:${size}px;height:${size}px">
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="transform:rotate(135deg)">
      <defs><linearGradient id="${gid}" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#FFB59B"/><stop offset="50%" stop-color="#FF7A45"/><stop offset="100%" stop-color="#F85F1B"/>
      </linearGradient></defs>
      <circle class="gauge-track" cx="${c}" cy="${c}" r="${r}" stroke-width="${sw}"
        stroke-dasharray="${arcLen} ${circ}"/>
      <circle class="gauge-arc" cx="${c}" cy="${c}" r="${r}" stroke-width="${sw}"
        stroke="${`url(#${gid})`}" stroke-dasharray="${arcLen} ${circ}" stroke-dashoffset="${arcLen - fill}"/>
      <g transform="rotate(-135 ${c} ${c})">${tickEls}</g>
    </svg>
    ${inner ? `<div class="gauge-center">${inner}</div>` : ''}
  </div>`;
}

/** Fill every [data-icon] placeholder in the document */
function hydrateIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const size = Number(el.dataset.size || 18);
    const sw = Number(el.dataset.sw || 1.7);
    el.innerHTML = icon(el.dataset.icon, size, sw);
  });
  root.querySelectorAll('[data-notches]').forEach(el => {
    el.innerHTML = notch(Number(el.dataset.notches), {
      segs: Number(el.dataset.segs || 20),
      tone: el.dataset.tone || '',
      size: el.dataset.sizeClass || '',
    });
  });
  root.querySelectorAll('[data-gauge]').forEach(el => {
    el.innerHTML = gauge(Number(el.dataset.gauge), {
      size: Number(el.dataset.size || 132),
      sw: Number(el.dataset.sw || 8),
      ticks: Number(el.dataset.ticks || 5),
      inner: el.dataset.inner || '',
    });
  });
  root.querySelectorAll('[data-spark]').forEach(el => {
    const vals = el.dataset.spark.split(',').map(Number);
    el.innerHTML = spark(vals, { mute: el.dataset.mute === 'true' });
  });
}

document.addEventListener('DOMContentLoaded', () => hydrateIcons());
