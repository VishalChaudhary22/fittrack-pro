import { useEffect, useRef, useState } from 'react';
import { animateSpring, SPRING_UI } from '../../core/motion/springs';
import './volt.css';

// ─── Kaaya Volt primitives ───────────────────────────────────────────────────
// The parts bin every Volt screen is built from (plan §5.2 / §8 V-2).
// Styles live in volt.css under the .v-* classes; tokens switch with
// [data-design="volt"] + [data-theme]. Max one Sticker per screen.

export function VoltBlock({ variant, hero = false, quiet = false, className, style, children, ...rest }) {
  const cls = [
    'v-block',
    variant ? `v-block--${variant}` : '',
    hero ? 'v-block--hero' : '',
    quiet ? 'v-block--quiet' : '',
    className || '',
  ].filter(Boolean).join(' ');
  return (
    <section className={cls} style={style} {...rest}>
      {children}
    </section>
  );
}

export function VoltPill({ ghost = false, style, children, ...rest }) {
  return (
    <button type="button" className={ghost ? 'v-pill v-pill--ghost' : 'v-pill'} style={style} {...rest}>
      {children}
    </button>
  );
}

export function VoltChip({ style, children, ...rest }) {
  return (
    <span className="v-chip" style={style} {...rest}>
      {children}
    </span>
  );
}

// Rotated mono badge — PR ATTEMPT, LIVE, GOLD III. One per screen, max.
export function Sticker({ tone = 'volt', style, children }) {
  return (
    <span className={`v-sticker v-sticker--${tone}`} style={style}>
      {children}
    </span>
  );
}

export function VoltLabel({ volt = false, style, children }) {
  return (
    <div className={volt ? 'v-label v-label--volt' : 'v-label'} style={style}>
      {children}
    </div>
  );
}

// Progress bar: the fill springs by scaleX (never width), per plan §7.
export function VoltBar({ value = 0, tone, height, style }) {
  const [scale, setScale] = useState(0);
  const currentRef = useRef(0);
  const clamped = Math.max(0, Math.min(1, value));

  useEffect(() => {
    const cancel = animateSpring({
      from: currentRef.current,
      to: clamped,
      config: SPRING_UI,
      onUpdate: (v) => {
        currentRef.current = v;
        setScale(v);
      },
    });
    return cancel;
  }, [clamped]);

  return (
    <div className="v-bar" style={{ height, ...style }} role="progressbar" aria-valuenow={Math.round(clamped * 100)} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={tone ? `v-bar-fill v-bar-fill--${tone}` : 'v-bar-fill'}
        style={{ transform: `scaleX(${scale})` }}
      />
    </div>
  );
}

// The Lab's scanner chamber (plan §5.3): dark in both modes; in Blackboard
// it takes the paper frame + volt offset shadow via tokens.
export function LabFrame({ style, children, ...rest }) {
  return (
    <section className="v-lab" style={style} {...rest}>
      {children}
    </section>
  );
}

// Bottom navigation for the Volt shell: items = [{ key, label, icon }],
// active key gets the volt pill. Wiring lands with the Volt shell (V-3+).
export function VoltNav({ items = [], active, onNavigate }) {
  return (
    <nav className="v-nav" aria-label="Primary">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className={item.key === active ? 'v-nav-item v-nav-item--active' : 'v-nav-item'}
          onClick={() => onNavigate?.(item.key)}
          aria-current={item.key === active ? 'page' : undefined}
          aria-label={item.label}
        >
          <span className="v-nav-pill">{item.icon}</span>
        </button>
      ))}
    </nav>
  );
}
