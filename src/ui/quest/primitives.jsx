import './quest.css';
import PixelSprite from './PixelSprite';

// ─── Kaaya Quest primitives ──────────────────────────────────────────────────
// The parts bin every Quest screen is built from (plan §5 / §9 Q-1).
// Styles live in quest.css under the .q-* classes; tokens switch with
// [data-design="quest"] + [data-theme]. Text hues always come from the
// --q-*-text tokens; raw hues are fills and large display only.

export function QuestBlock({ variant, flat = false, className, style, children, ...rest }) {
  const cls = [
    'q-block',
    variant ? `q-block--${variant}` : '',
    flat ? 'q-block--flat' : '',
    className || '',
  ].filter(Boolean).join(' ');
  return (
    <section className={cls} style={style} {...rest}>
      {children}
    </section>
  );
}

export function QuestBtn({ tone, sm = false, className, style, children, ...rest }) {
  const cls = [
    'q-btn',
    tone ? `q-btn--${tone}` : '',
    sm ? 'q-btn--sm' : '',
    className || '',
  ].filter(Boolean).join(' ');
  return (
    <button type="button" className={cls} style={style} {...rest}>
      {children}
    </button>
  );
}

export function QuestChip({ tone, style, children, ...rest }) {
  return (
    <span className={tone ? `q-chip q-chip--${tone}` : 'q-chip'} style={style} {...rest}>
      {children}
    </span>
  );
}

export function QuestLabel({ tone, style, children }) {
  return (
    <div className={tone ? `q-label q-label--${tone}` : 'q-label'} style={style}>
      {children}
    </div>
  );
}

// Segmented bar: lit segments = round(value * segments). The count is the
// animation surface — pages step the value; the bar never smooth-fills.
export function SegBar({ value = 0, segments = 10, tone, style, label }) {
  const clamped = Math.max(0, Math.min(1, value));
  const lit = Math.round(clamped * segments);
  return (
    <div
      className={tone ? `q-segbar q-segbar--${tone}` : 'q-segbar'}
      style={style}
      role="progressbar"
      aria-valuenow={Math.round(clamped * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      {Array.from({ length: segments }, (_, i) => (
        <div key={i} className={i < lit ? 'q-seg q-seg--lit' : 'q-seg'} />
      ))}
    </div>
  );
}

// Bottom navigation for the Quest shell: items = [{ key, label, sprite }].
// The active item is a volt block; labels are Press Start at 8px.
export function QuestNav({ items = [], active, onNavigate }) {
  return (
    <nav className="q-nav" aria-label="Primary">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={item.key === active ? 'q-nav-item q-nav-item--active' : 'q-nav-item'}
          onClick={() => onNavigate?.(item.key)}
          aria-current={item.key === active ? 'page' : undefined}
        >
          <PixelSprite name={item.sprite} size={item.key === active ? 24 : 22} />
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
