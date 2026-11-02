import { useState, useMemo } from 'react';
import { useApp } from '../../../core/context/AppContext';
import { BF_METHODS } from '../../../data/constants';
import { calcBodyFat, getBFCategory } from '../../../utils/calculations';
import { fmt, gId } from '../../../utils/helpers';
import { QuestBlock, QuestBtn, QuestLabel } from '../primitives';
import { QuestSheet } from './QuestTodaySheets';

// ─── Kaaya Quest · Body composition (Q-10 parity pack) ───────────────────────
// Quest twin of Volt's VoltBodyFatCard + VoltBodyFatLogModal (themselves
// twins of V1's BodyFatRingCard + BodyFatLogModal). All state, calculations
// and save payloads are identical; presentation is the Quest cartridge
// language — the trend is the stepped square-point line used by the Weight
// Log sparkline.

const todLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

// Stepped trend (H-then-V path, square markers) — same construction as the
// Weight Log sparkline, with a dashed gold goal line.
function BFChart({ data, goal }) {
  const W = 320, H = 112, PADX = 8, PADT = 14, PADB = 18;
  const vals = data.map(d => d.bf);
  if (goal) vals.push(goal);
  const min = Math.min(...vals), max = Math.max(...vals);
  const span = (max - min) || 1;
  const lo = min - span * 0.15, hi = max + span * 0.15;
  const X = i => PADX + (i / (data.length - 1)) * (W - PADX * 2);
  const Y = v => PADT + (1 - (v - lo) / (hi - lo)) * (H - PADT - PADB);
  const pts = data.map((d, i) => [X(i), Y(d.bf)]);
  let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    path += ` H${pts[i][0].toFixed(1)} V${pts[i][1].toFixed(1)}`;
  }
  const txt = { fontFamily: "'VT323', monospace", fontSize: 12, fill: 'var(--q-dim)' };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Body fat trend">
      <text x={PADX} y={11} {...txt}>{max.toFixed(1)}%</text>
      <text x={PADX} y={H - 16} {...txt}>{min.toFixed(1)}%</text>
      {goal ? <line x1={PADX} x2={W - PADX} y1={Y(goal)} y2={Y(goal)} stroke="var(--q-gold)" strokeWidth="2" strokeDasharray="5 5" /> : null}
      <path d={path} fill="none" stroke="var(--q-volt-text)" strokeWidth="3" shapeRendering="crispEdges" />
      {pts.map((p, i) => (
        <rect key={i} x={p[0] - 3.5} y={p[1] - 3.5} width="7" height="7" fill="var(--q-volt)" stroke="var(--q-border)" strokeWidth="1.5" shapeRendering="crispEdges" />
      ))}
      <text x={pts[0][0]} y={H - 3} textAnchor="middle" {...txt}>{data[0].date}</text>
      <text x={pts[pts.length - 1][0]} y={H - 3} textAnchor="middle" {...txt}>{data[data.length - 1].date}</text>
    </svg>
  );
}

// ─── Log modal ────────────────────────────────────────────────────────────────

function QuestBodyFatLogModal({ onClose }) {
  const { user, setBodyFatLog, updateProfile, addToast } = useApp();

  const [bfForm, setBFForm] = useState({
    date: todLocal(),
    percentage: '',
    method: 'inbody',
    notes: '',
  });

  // The card mounts this modal only when open, so the open-reset is folded
  // into the initial state (fresh values on every open) — same as Volt.
  const [bfGoalInput, setBFGoalInput] = useState(user?.bodyFatGoal ? String(user.bodyFatGoal) : '');

  const [navyMeasures, setNavyMeasures] = useState({
    waist: '', neck: '', hips: '', height: user?.height || '',
  });

  const save = () => {
    let pct = parseFloat(bfForm.percentage);
    let target = parseFloat(bfGoalInput);

    let updated = false;

    if (!isNaN(pct) && pct >= 2 && pct <= 60) {
      setBodyFatLog(prev => [
        ...prev.filter(e => !(e.userId === user.id && e.date === bfForm.date)),
        { id: gId(), userId: user.id, date: bfForm.date, percentage: pct, method: bfForm.method, notes: bfForm.notes.trim(), createdAt: Date.now() },
      ]);
      updated = true;
    }

    if (!isNaN(target) && target >= 2 && target <= 60 && target !== user?.bodyFatGoal) {
      updateProfile({ bodyFatGoal: target });
      updated = true;
    } else if (bfGoalInput === '' && user?.bodyFatGoal) {
      updateProfile({ bodyFatGoal: null });
      updated = true;
    }

    if (updated) {
      addToast('Body fat updated!', 'success');
      onClose();
    } else if (!pct) {
      onClose();
    }
  };

  const pctCat = bfForm.percentage && !isNaN(parseFloat(bfForm.percentage)) ? getBFCategory(parseFloat(bfForm.percentage), user?.gender) : null;
  const goalCat = bfGoalInput && !isNaN(parseFloat(bfGoalInput)) ? getBFCategory(parseFloat(bfGoalInput), user?.gender) : null;

  return (
    <QuestSheet label="Body Comp" title="Log & Goal BF%" onClose={onClose}>
      <QuestLabel tone="volt">Log Current Reading</QuestLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '12px 0 20px' }}>
        <div>
          <QuestLabel>Date</QuestLabel>
          <input className="q-slot-input" type="date" value={bfForm.date} max={todLocal()} onChange={e => setBFForm(p => ({ ...p, date: e.target.value }))} style={{ marginTop: 6 }} />
        </div>

        <div>
          <QuestLabel>Body Fat %</QuestLabel>
          <div style={{ position: 'relative', marginTop: 6 }}>
            <input className="q-slot-input" type="number" inputMode="decimal" placeholder="e.g. 18.5" value={bfForm.percentage} min="2" max="60" step="0.1" onChange={e => setBFForm(p => ({ ...p, percentage: e.target.value }))} style={{ paddingRight: 44, fontSize: 25 }} />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'var(--q-dim)' }}>%</span>
          </div>
          {pctCat && <div style={{ marginTop: 6, fontSize: 17, color: pctCat.color }}>● {pctCat.label} range</div>}
        </div>

        <div>
          <QuestLabel>How was it measured?</QuestLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {BF_METHODS.map(m => {
              const active = bfForm.method === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  className="q-chip"
                  onClick={() => setBFForm(p => ({ ...p, method: m.id }))}
                  style={active
                    ? { cursor: 'pointer', background: 'var(--q-volt)', color: 'var(--q-btn-fg)', minHeight: 38 }
                    : { cursor: 'pointer', minHeight: 38 }}
                >
                  {m.label}
                </button>
              );
            })}
          </div>
          {bfForm.method !== 'visual' && bfForm.method !== 'navy' && (
            <div style={{ marginTop: 6, fontSize: 16, color: 'var(--q-dim)' }}>Accuracy: {BF_METHODS.find(m => m.id === bfForm.method)?.note}</div>
          )}
        </div>

        {/* Navy Method Calculator */}
        {bfForm.method === 'navy' && (
          <div style={{ padding: 13, border: '3px solid var(--q-border)', background: 'var(--q-slot)' }}>
            <QuestLabel tone="volt">Navy Calc</QuestLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
              <div>
                <QuestLabel>Waist (cm)</QuestLabel>
                <input className="q-slot-input" type="number" inputMode="decimal" value={navyMeasures.waist} onChange={e => setNavyMeasures(p => ({ ...p, waist: e.target.value }))} placeholder="at navel" style={{ marginTop: 4, fontSize: 19 }} />
              </div>
              <div>
                <QuestLabel>Neck (cm)</QuestLabel>
                <input className="q-slot-input" type="number" inputMode="decimal" value={navyMeasures.neck} onChange={e => setNavyMeasures(p => ({ ...p, neck: e.target.value }))} placeholder="narrowest" style={{ marginTop: 4, fontSize: 19 }} />
              </div>
              {user?.gender === 'female' && (
                <div>
                  <QuestLabel>Hips (cm)</QuestLabel>
                  <input className="q-slot-input" type="number" inputMode="decimal" value={navyMeasures.hips} onChange={e => setNavyMeasures(p => ({ ...p, hips: e.target.value }))} placeholder="widest" style={{ marginTop: 4, fontSize: 19 }} />
                </div>
              )}
              <div>
                <QuestLabel>Height (cm)</QuestLabel>
                <input className="q-slot-input" type="number" inputMode="decimal" value={navyMeasures.height} onChange={e => setNavyMeasures(p => ({ ...p, height: e.target.value }))} style={{ marginTop: 4, fontSize: 19 }} />
              </div>
            </div>
            <QuestBtn tone="ghost" style={{ width: '100%', marginTop: 12 }} onClick={() => {
              const { waist, neck, hips, height } = navyMeasures;
              if (!waist || !neck || !height) return;
              const result = calcBodyFat(user?.gender || 'male', parseFloat(waist), parseFloat(neck), parseFloat(height), parseFloat(hips || 0));
              if (!isNaN(result) && result > 0) setBFForm(p => ({ ...p, percentage: String(result) }));
            }}>Calculate &amp; Pre-fill</QuestBtn>
          </div>
        )}
      </div>

      <div style={{ height: 3, background: 'var(--q-panel2)', margin: '2px 0 18px' }} />

      <QuestLabel tone="volt">Set Target Goal</QuestLabel>
      <div style={{ position: 'relative', marginTop: 8 }}>
        <input className="q-slot-input" type="number" inputMode="decimal" placeholder="e.g. 15" value={bfGoalInput} min="2" max="60" step="0.5" onChange={e => setBFGoalInput(e.target.value)} style={{ paddingRight: 44, fontSize: 25 }} />
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 20, color: 'var(--q-dim)' }}>%</span>
      </div>
      {goalCat && <div style={{ marginTop: 6, fontSize: 17, color: goalCat.color }}>● {goalCat.label} range</div>}

      <div style={{ display: 'flex', gap: 10, marginTop: 22 }}>
        <QuestBtn tone="ghost" style={{ flex: 1 }} onClick={onClose}>Cancel</QuestBtn>
        <QuestBtn style={{ flex: 2 }} onClick={save}>Save Values</QuestBtn>
      </div>
    </QuestSheet>
  );
}

// ─── Body composition card (Today) ────────────────────────────────────────────

export function QuestBodyFatCard() {
  const { user, bodyFatLog } = useApp();
  const [showModal, setShowModal] = useState(false);

  const userBFLog = useMemo(() =>
    bodyFatLog
      .filter(e => e.userId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  , [bodyFatLog, user?.id]);

  const latestBF = userBFLog[0] || null;
  const previousBF = userBFLog.length >= 2 ? userBFLog[1] : null;
  const bfGoal = user?.bodyFatGoal || null;
  const currentPct = latestBF ? latestBF.percentage : 0;

  const bfChartData = useMemo(() =>
    [...userBFLog].reverse().map(l => ({ date: fmt(l.date), bf: l.percentage }))
  , [userBFLog]);

  const bfDelta = (latestBF && previousBF) ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;

  // Trend semantics identical to V1/Volt: with a goal set, down is good
  // (volt), up is bad (ember); without a goal the arrow stays dim.
  const trend = useMemo(() => {
    if (bfDelta === null || bfDelta === undefined) return null;
    const up = bfDelta > 0;
    if (!bfGoal) return { up, color: 'var(--q-dim)' };
    return up
      ? { up: true, color: 'var(--q-ember-text)' }
      : { up: false, color: 'var(--q-volt-text)' };
  }, [bfDelta, bfGoal]);

  return (
    <>
      <QuestBlock flat>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <QuestLabel>Body Comp</QuestLabel>
            <div className="q-ps" style={{ fontSize: 13, marginTop: 7 }}>BODY FAT ANALYSIS</div>
          </div>
          <QuestBtn sm tone="ghost" onClick={() => setShowModal(true)}>+ Log BF%</QuestBtn>
        </div>

        {latestBF ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
              <div>
                <QuestLabel>Current</QuestLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                  <span className="q-ps" style={{ fontSize: 30 }}>{currentPct.toFixed(1)}</span>
                  <span style={{ fontSize: 17, color: 'var(--q-dim)' }}>%</span>
                </div>
              </div>
              {trend && (
                <span aria-hidden="true" style={{ fontSize: 22, paddingBottom: 5, color: trend.color }}>{trend.up ? '▲' : '▼'}</span>
              )}
              {previousBF && (
                <div>
                  <QuestLabel>Previous</QuestLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4 }}>
                    <span className="q-ps" style={{ fontSize: 18, color: 'var(--q-dim)' }}>{previousBF.percentage.toFixed(1)}</span>
                    <span style={{ fontSize: 14, color: 'var(--q-dim)' }}>%</span>
                  </div>
                </div>
              )}
              {bfGoal && (
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <QuestLabel>Goal</QuestLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4, justifyContent: 'flex-end' }}>
                    <span className="q-ps" style={{ fontSize: 18, color: 'var(--q-gold-text)' }}>{bfGoal}</span>
                    <span style={{ fontSize: 14, color: 'var(--q-gold-text)' }}>%</span>
                  </div>
                </div>
              )}
            </div>

            {bfChartData.length >= 2 ? (
              <div style={{ marginTop: 14 }}>
                <BFChart data={bfChartData} goal={bfGoal} />
              </div>
            ) : (
              <div style={{ padding: '14px 12px', textAlign: 'center', background: 'var(--q-slot)', border: '3px solid var(--q-border)', color: 'var(--q-dim)', fontSize: 18, marginTop: 14 }}>
                Log for at least two days to see your trend
              </div>
            )}
          </>
        ) : (
          <p className="q-meta" style={{ margin: '12px 0 2px', fontSize: 18 }}>
            Log your first body fat reading to start tracking
          </p>
        )}
      </QuestBlock>

      {showModal && <QuestBodyFatLogModal onClose={() => setShowModal(false)} />}
    </>
  );
}
