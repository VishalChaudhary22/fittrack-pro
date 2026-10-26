import React, { useState, useMemo } from 'react';
import { useApp } from '../../../core/context/AppContext';
import { BF_METHODS } from '../../../data/constants';
import { calcBodyFat, getBFCategory } from '../../../utils/calculations';
import { ModalPortal } from '../../v1/shared/SharedComponents';
import { fmt } from '../../../utils/helpers';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';
import { VoltSheet } from './VoltShared';

// Volt twins of V1's BodyFatLogModal + BodyFatRingCard (V-7). All state,
// calculations and save payloads are identical to V1. The card carries the
// body-fat half of V1's composite card; the weight-goal ring half is already
// covered by Volt Today's weight block + goal strip, so it is not duplicated.

const gId = () => Math.random().toString(36).substr(2, 9);
const todLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12,
  background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)',
  color: 'var(--v-ink)', fontSize: 14, outline: 'none',
};

// ─── Log modal ────────────────────────────────────────────────────────────────
export function VoltBodyFatLogModal({ open, onClose }) {
  const { user, setBodyFatLog, updateProfile, addToast } = useApp();

  const [bfForm, setBFForm] = useState({
    date: todLocal(),
    percentage: '',
    method: 'inbody',
    notes: ''
  });

  // The card mounts this modal only when open, so V1's open-reset effect is
  // folded into the initial state (fresh values on every open).
  const [bfGoalInput, setBFGoalInput] = useState(user?.bodyFatGoal ? String(user.bodyFatGoal) : '');

  const [navyMeasures, setNavyMeasures] = useState({
    waist: '', neck: '', hips: '', height: user?.height || ''
  });

  if (!open) return null;

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
    <VoltSheet onClose={onClose}>
      <div style={{ fontSize: 19, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 20 }}>Log &amp; Goal BF%</div>

      {/* SECTION: Log Current BF% */}
      <VoltLabel volt>Log Current Reading</VoltLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '12px 0 22px' }}>
        <div>
          <VoltLabel>Date</VoltLabel>
          <input type="date" value={bfForm.date} max={todLocal()} onChange={e => setBFForm(p => ({ ...p, date: e.target.value }))} style={{ ...inputStyle, marginTop: 6 }} />
        </div>

        <div>
          <VoltLabel>Body Fat %</VoltLabel>
          <div style={{ position: 'relative', marginTop: 6 }}>
            <input type="number" inputMode="decimal" placeholder="e.g. 18.5" value={bfForm.percentage} min="2" max="60" step="0.1" onChange={e => setBFForm(p => ({ ...p, percentage: e.target.value }))} style={{ ...inputStyle, padding: '12px 44px 12px 14px', fontSize: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} />
            <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--v-dim)', fontWeight: 700 }}>%</span>
          </div>
          {pctCat && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: pctCat.color, letterSpacing: '0.08em' }}>● {pctCat.label} range</div>}
        </div>

        <div>
          <VoltLabel>How was it measured?</VoltLabel>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 8 }}>
            {BF_METHODS.map(m => {
              const active = bfForm.method === m.id;
              return (
                <button key={m.id} onClick={() => setBFForm(p => ({ ...p, method: m.id }))} className="v-press" style={{ padding: '8px 13px', borderRadius: 999, border: '2.5px solid var(--v-edge)', cursor: 'pointer', fontSize: 11.5, fontWeight: 700, background: active ? 'var(--v-volt)' : 'var(--v-canvas)', color: active ? '#141416' : 'var(--v-ink)', minHeight: 36 }}>{m.label}</button>
              );
            })}
          </div>
          {bfForm.method !== 'visual' && bfForm.method !== 'navy' && (
            <div style={{ marginTop: 6, fontSize: 11, color: 'var(--v-dim)' }}>Accuracy: {BF_METHODS.find(m => m.id === bfForm.method)?.note}</div>
          )}
        </div>

        {/* Navy Method Calculator */}
        {bfForm.method === 'navy' && (
          <div style={{ padding: 14, borderRadius: 14, border: '2px solid var(--v-edge-quiet)' }}>
            <VoltLabel volt>Navy Calc</VoltLabel>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 10 }}>
              <div>
                <VoltLabel>Waist (cm)</VoltLabel>
                <input type="number" inputMode="decimal" value={navyMeasures.waist} onChange={e => setNavyMeasures(p => ({ ...p, waist: e.target.value }))} placeholder="at navel" style={{ ...inputStyle, padding: '9px 10px', fontSize: 13, marginTop: 4 }} />
              </div>
              <div>
                <VoltLabel>Neck (cm)</VoltLabel>
                <input type="number" inputMode="decimal" value={navyMeasures.neck} onChange={e => setNavyMeasures(p => ({ ...p, neck: e.target.value }))} placeholder="narrowest" style={{ ...inputStyle, padding: '9px 10px', fontSize: 13, marginTop: 4 }} />
              </div>
              {user?.gender === 'female' && (
                <div>
                  <VoltLabel>Hips (cm)</VoltLabel>
                  <input type="number" inputMode="decimal" value={navyMeasures.hips} onChange={e => setNavyMeasures(p => ({ ...p, hips: e.target.value }))} placeholder="widest" style={{ ...inputStyle, padding: '9px 10px', fontSize: 13, marginTop: 4 }} />
                </div>
              )}
              <div>
                <VoltLabel>Height (cm)</VoltLabel>
                <input type="number" inputMode="decimal" value={navyMeasures.height} onChange={e => setNavyMeasures(p => ({ ...p, height: e.target.value }))} style={{ ...inputStyle, padding: '9px 10px', fontSize: 13, marginTop: 4 }} />
              </div>
            </div>
            <VoltPill ghost style={{ width: '100%', marginTop: 12, minHeight: 44 }} onClick={() => {
              const { waist, neck, hips, height } = navyMeasures;
              if (!waist || !neck || !height) return;
              const result = calcBodyFat(user?.gender || 'male', parseFloat(waist), parseFloat(neck), parseFloat(height), parseFloat(hips || 0));
              if (!isNaN(result) && result > 0) setBFForm(p => ({ ...p, percentage: String(result) }));
            }}>Calculate &amp; Pre-fill</VoltPill>
          </div>
        )}
      </div>

      <div style={{ height: 2, background: 'var(--v-edge-quiet)', margin: '2px 0 20px' }} />

      {/* SECTION: Goal BF% */}
      <VoltLabel volt>Set Target Goal</VoltLabel>
      <div style={{ position: 'relative', marginTop: 10 }}>
        <input type="number" inputMode="decimal" placeholder="e.g. 15" value={bfGoalInput} min="2" max="60" step="0.5" onChange={e => setBFGoalInput(e.target.value)} style={{ ...inputStyle, padding: '12px 44px 12px 14px', fontSize: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} />
        <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--v-dim)', fontWeight: 700 }}>%</span>
      </div>
      {goalCat && <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: goalCat.color, letterSpacing: '0.08em' }}>● {goalCat.label} range</div>}

      {/* Footer Actions */}
      <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
        <VoltPill ghost style={{ flex: 1 }} onClick={onClose}>Cancel</VoltPill>
        <VoltPill style={{ flex: 2 }} onClick={save}>Save Values</VoltPill>
      </div>
    </VoltSheet>
  );
}

// ─── Body composition card (Today) ────────────────────────────────────────────
export function VoltBodyFatCard() {
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

  const trendArrow = useMemo(() => {
    if (bfDelta === null || bfDelta === undefined) return null;
    const bfUp = bfDelta > 0;
    if (!bfGoal) return { up: bfUp, color: 'var(--v-dim)' };
    return bfUp
      ? { up: true, color: 'var(--v-coral-text)' }
      : { up: false, color: 'var(--v-success-text)' };
  }, [bfDelta, bfGoal]);

  // Hand-rolled area trend (Volt Measurements pattern)
  const W = 320, H = 110, PADX = 8, PADT = 10, PADB = 16;
  let linePath = '', areaPath = '', goalY = null, pts = [];
  if (bfChartData.length >= 2) {
    const vals = bfChartData.map(d => d.bf);
    if (bfGoal) vals.push(bfGoal);
    const min = Math.min(...vals), max = Math.max(...vals);
    const span = (max - min) || 1;
    const lo = min - span * 0.15, hi = max + span * 0.15;
    const X = i => PADX + (i / (bfChartData.length - 1)) * (W - PADX * 2);
    const Y = v => PADT + (1 - (v - lo) / (hi - lo)) * (H - PADT - PADB);
    pts = bfChartData.map((d, i) => [X(i), Y(d.bf)]);
    linePath = pts.map((p, i) => `${i ? 'L' : 'M'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    areaPath = `${linePath} L${pts[pts.length - 1][0].toFixed(1)},${H - PADB} L${pts[0][0].toFixed(1)},${H - PADB} Z`;
    if (bfGoal) goalY = Y(bfGoal);
  }

  return (
    <>
      <VoltBlock className="v-rise">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <div>
            <VoltLabel>Body Composition</VoltLabel>
            <div style={{ fontSize: 17, fontWeight: 800, letterSpacing: '-0.01em', marginTop: 3 }}>Body Fat Analysis</div>
          </div>
          <Activity size={18} color="var(--v-volt-text)" style={{ opacity: 0.8 }} />
        </div>

        {latestBF ? (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, marginBottom: 14 }}>
              <div>
                <VoltLabel>Current</VoltLabel>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 2 }}>
                  <span className="v-num" style={{ fontSize: '2rem', lineHeight: 1 }}>{currentPct.toFixed(1)}</span>
                  <span style={{ fontSize: 13, color: 'var(--v-dim)' }}>%</span>
                </div>
              </div>
              {trendArrow && (
                <div style={{ paddingBottom: 4 }}>
                  {trendArrow.up ? <TrendingUp size={18} color={trendArrow.color} /> : <TrendingDown size={18} color={trendArrow.color} />}
                </div>
              )}
              {previousBF && (
                <div>
                  <VoltLabel>Previous</VoltLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 2 }}>
                    <span className="v-num" style={{ fontSize: '1.3rem', lineHeight: 1, color: 'var(--v-dim)' }}>{previousBF.percentage.toFixed(1)}</span>
                    <span style={{ fontSize: 10, color: 'var(--v-dim)' }}>%</span>
                  </div>
                </div>
              )}
              {bfGoal && (
                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                  <VoltLabel>Goal</VoltLabel>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 2, justifyContent: 'flex-end' }}>
                    <span className="v-num" style={{ fontSize: '1.3rem', lineHeight: 1, color: 'var(--v-volt-text)' }}>{bfGoal}</span>
                    <span style={{ fontSize: 10, color: 'var(--v-volt-text)' }}>%</span>
                  </div>
                </div>
              )}
            </div>

            {bfChartData.length >= 2 ? (
              <div style={{ marginBottom: 14 }}>
                <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img" aria-label="Body fat trend">
                  <path d={areaPath} fill="var(--v-volt)" opacity="0.14" />
                  {goalY !== null && <line x1={PADX} x2={W - PADX} y1={goalY} y2={goalY} stroke="var(--v-cobalt)" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.65" />}
                  <path className="v-draw" pathLength={1} d={linePath} fill="none" stroke="var(--v-volt-text)" strokeWidth="2.5" strokeLinecap="round" />
                  {pts.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="var(--v-panel)" stroke="var(--v-volt-text)" strokeWidth="2" />)}
                  <text x={pts[0][0]} y={H - 3} fontSize="8.5" fill="var(--v-dim)" textAnchor="middle">{bfChartData[0].date}</text>
                  <text x={pts[pts.length - 1][0]} y={H - 3} fontSize="8.5" fill="var(--v-dim)" textAnchor="middle">{bfChartData[bfChartData.length - 1].date}</text>
                </svg>
              </div>
            ) : (
              <div style={{ padding: '16px 12px', textAlign: 'center', border: '2px solid var(--v-edge-quiet)', borderRadius: 12, color: 'var(--v-dim)', fontSize: 12, marginBottom: 14 }}>
                Log for at least two days to see your trend
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <VoltPill style={{ minHeight: 44, padding: '0 20px', fontSize: 12.5 }} onClick={() => setShowModal(true)}>+ Log Body Fat %</VoltPill>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ padding: '8px 0 14px', color: 'var(--v-dim)', fontSize: 12.5 }}>
              Log your first body fat reading to start tracking
            </div>
            <VoltPill style={{ minHeight: 44, padding: '0 20px', fontSize: 12.5 }} onClick={() => setShowModal(true)}>+ Log Body Fat %</VoltPill>
          </div>
        )}
      </VoltBlock>

      {showModal && (
        <ModalPortal>
          <VoltBodyFatLogModal open={showModal} onClose={() => setShowModal(false)} />
        </ModalPortal>
      )}
    </>
  );
}
