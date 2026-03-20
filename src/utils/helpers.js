// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const O = 'var(--o)';
export const gId = () => Math.random().toString(36).slice(2, 9);
export const tod = () => new Date().toISOString().split('T')[0];
export const fmt = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
export const wkLbl = d => {
  const dt = new Date(d);
  return `${dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
};
export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Weight / height picker item generators
export const mkWtItems = (lo = 30, hi = 200, step = 0.5) => {
  const a = [];
  for (let v = lo; v <= hi; v = parseFloat((v + step).toFixed(1))) a.push(v);
  return a;
};
export const mkIntItems = (lo, hi) => {
  const a = [];
  for (let v = lo; v <= hi; v++) a.push(v);
  return a;
};
