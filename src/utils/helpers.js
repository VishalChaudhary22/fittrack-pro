// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const O = 'var(--o)';
export const gId = () => Math.random().toString(36).slice(2, 9);
export const tod = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
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

// ─── UNIT CONVERSION ──────────────────────────────────────────────────────────
export const kgToLbs = (kg) => +(kg * 2.20462).toFixed(1);
export const lbsToKg = (lbs) => +(lbs / 2.20462).toFixed(1);
export const cmToFtIn = (cm) => {
  const totalIn = cm / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  return `${ft}'${inches}"`;
};
export const displayWeight = (kg, unitWeight) => unitWeight === 'lbs' ? `${kgToLbs(kg)} lbs` : `${kg} kg`;
export const displayHeight = (cm, unitHeight) => unitHeight === 'ft' ? cmToFtIn(cm) : `${cm} cm`;
export const mkWtItemsImperial = (lo = 66, hi = 440, step = 0.5) => {
  const a = [];
  for (let v = lo; v <= hi; v = parseFloat((v + step).toFixed(1))) a.push(v);
  return a;
};
