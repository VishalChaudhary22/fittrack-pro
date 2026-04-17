import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { BF_METHODS } from '../../data/constants';
import { calcBodyFat, getBFCategory } from '../../utils/calculations';

// Helpers
const gId = () => Math.random().toString(36).substr(2, 9);
const tod = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().split('T')[0];
};

export default function BodyFatLogModal({ open, onClose }) {
  const { user, bodyFatLog, setBodyFatLog, updateProfile, addToast } = useApp();

  const [bfForm, setBFForm] = useState({
    date: tod(),
    percentage: '',
    method: 'inbody',
    notes: ''
  });

  const [bfGoalInput, setBFGoalInput] = useState('');

  const [navyMeasures, setNavyMeasures] = useState({
    waist: '', neck: '', hips: '', height: user?.height || ''
  });

  useEffect(() => {
    if (open) {
      setBFGoalInput(user?.bodyFatGoal ? String(user.bodyFatGoal) : '');
      setBFForm({ date: tod(), percentage: '', method: 'inbody', notes: '' });
      setNavyMeasures(p => ({ ...p, height: user?.height || '' }));
    }
  }, [open, user?.bodyFatGoal, user?.height]);

  if (!open) return null;

  return (
    <div className="mo" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="md" style={{ maxWidth: 420, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', maxHeight: '90vh' }}>
        
        {/* Header */}
        <div style={{ padding: '24px 24px 16px', background: 'var(--surface-container-low)', borderBottom: '1px solid var(--surface-container)' }}>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 18, color: 'var(--on-surface)' }}>Log & Goal BF%</div>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
          
          {/* SECTION: Log Current BF% */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Log Current Reading</div>
            
            {/* Date */}
            <div style={{ marginBottom: 16 }}>
              <div className="label-md" style={{ marginBottom: 6, color: 'var(--on-surface-dim)' }}>Date</div>
              <input type="date" value={bfForm.date} max={tod()} onChange={e => setBFForm(p => ({ ...p, date: e.target.value }))} style={{ width: '100%', padding: '10px 14px', borderRadius: 10, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontSize: 14 }} />
            </div>

            {/* BF% input */}
            <div style={{ marginBottom: 16 }}>
              <div className="label-md" style={{ marginBottom: 6, color: 'var(--on-surface-dim)' }}>Body Fat %</div>
              <div style={{ position: 'relative' }}>
                <input type="number" inputMode="decimal" placeholder="e.g. 18.5" value={bfForm.percentage} min="2" max="60" step="0.1" onChange={e => setBFForm(p => ({ ...p, percentage: e.target.value }))} style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontSize: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700 }} />
                <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--on-surface-variant)', fontWeight: 700 }}>%</span>
              </div>
              {bfForm.percentage && !isNaN(parseFloat(bfForm.percentage)) && (() => {
                const cat = getBFCategory(parseFloat(bfForm.percentage), user?.gender);
                return <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: cat.color, letterSpacing: '0.08em' }}>● {cat.label} range</div>;
              })()}
            </div>

            {/* Method selector */}
            <div style={{ marginBottom: 16 }}>
              <div className="label-md" style={{ marginBottom: 8, color: 'var(--on-surface-dim)' }}>How was it measured?</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {BF_METHODS.map(m => (
                  <button key={m.id} onClick={() => setBFForm(p => ({ ...p, method: m.id }))} style={{ padding: '7px 12px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 700, transition: 'all .15s', background: bfForm.method === m.id ? 'var(--primary-container)' : 'var(--surface-container-highest)', color: bfForm.method === m.id ? '#fff' : 'var(--on-surface-variant)' }}>{m.label}</button>
                ))}
              </div>
              {bfForm.method !== 'visual' && bfForm.method !== 'navy' && (
                <div style={{ marginTop: 6, fontSize: 10, color: 'var(--on-surface-dim)' }}>Accuracy: {BF_METHODS.find(m => m.id === bfForm.method)?.note}</div>
              )}
            </div>

            {/* Navy Method Calculator */}
            {bfForm.method === 'navy' && (
              <div style={{ marginBottom: 16, padding: 14, borderRadius: 12, background: 'var(--surface-container-lowest)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Navy Calc</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>Waist (cm)</div>
                    <input type="number" inputMode="decimal" value={navyMeasures.waist} onChange={e => setNavyMeasures(p => ({ ...p, waist: e.target.value }))} placeholder="at navel" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontSize: 13 }} />
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>Neck (cm)</div>
                    <input type="number" inputMode="decimal" value={navyMeasures.neck} onChange={e => setNavyMeasures(p => ({ ...p, neck: e.target.value }))} placeholder="narrowest" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontSize: 13 }} />
                  </div>
                  {user?.gender === 'female' && (
                    <div>
                      <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>Hips (cm)</div>
                      <input type="number" inputMode="decimal" value={navyMeasures.hips} onChange={e => setNavyMeasures(p => ({ ...p, hips: e.target.value }))} placeholder="widest" style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontSize: 13 }} />
                    </div>
                  )}
                  <div>
                    <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>Height (cm)</div>
                    <input type="number" inputMode="decimal" value={navyMeasures.height} onChange={e => setNavyMeasures(p => ({ ...p, height: e.target.value }))} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontSize: 13 }} />
                  </div>
                </div>
                <button style={{ marginTop: 10, width: '100%', padding: 9, borderRadius: 8, background: 'var(--surface-container-highest)', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700, color: 'var(--primary)' }} onClick={() => {
                  const { waist, neck, hips, height } = navyMeasures;
                  if (!waist || !neck || !height) return;
                  const result = calcBodyFat(user?.gender || 'male', parseFloat(waist), parseFloat(neck), parseFloat(height), parseFloat(hips || 0));
                  if (!isNaN(result) && result > 0) setBFForm(p => ({ ...p, percentage: String(result) }));
                }}>Calculate & Pre-fill</button>
              </div>
            )}
          </div>

          <div style={{ height: 1, background: 'var(--surface-container)' }} />

          {/* SECTION: Goal BF% */}
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>Set Target Goal</div>
            <div style={{ position: 'relative' }}>
              <input type="number" inputMode="decimal" placeholder="e.g. 15" value={bfGoalInput} min="2" max="60" step="0.5" onChange={e => setBFGoalInput(e.target.value)} style={{ width: '100%', padding: '12px 44px 12px 14px', borderRadius: 10, background: 'var(--surface-container-highest)', border: '1.5px solid transparent', color: 'var(--on-surface)', fontSize: 20, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, transition: 'border .15s' }} onFocus={e => e.target.style.borderColor = 'var(--primary)'} onBlur={e => e.target.style.borderColor = 'transparent'} />
              <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', fontSize: 16, color: 'var(--on-surface-variant)', fontWeight: 700 }}>%</span>
            </div>
            {bfGoalInput && !isNaN(parseFloat(bfGoalInput)) && (() => {
              const cat = getBFCategory(parseFloat(bfGoalInput), user?.gender);
              return <div style={{ marginTop: 6, fontSize: 11, fontWeight: 700, color: cat.color, letterSpacing: '0.08em' }}>● {cat.label} range</div>;
            })()}
          </div>
          
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '16px 24px 24px', background: 'var(--surface-container-low)', borderTop: '1px solid var(--surface-container)', display: 'flex', gap: 10 }}>
          <button className="btn-g" style={{ flex: 1, padding: 12, borderRadius: 12 }} onClick={onClose}>Cancel</button>
          <button className="btn-p" style={{ flex: 2, padding: 12, borderRadius: 12 }} onClick={() => {
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
               // Neither goal nor bf updated correctly, simply close
               onClose();
            }
          }}>Save Values</button>
        </div>

      </div>
    </div>
  );
}
