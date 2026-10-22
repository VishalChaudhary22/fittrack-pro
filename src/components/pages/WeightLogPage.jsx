import { useState, useMemo } from 'react';
import { Scale } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ConfirmDialog } from '../shared/SharedComponents';
import { fmt, kgToLbs } from '../../utils/helpers';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { Screen, Sec, LedgerRow, Action, TLink, Note } from '../shared/Margin';

export default function WeightLogPage() {
  useScrollRestoration('/weight-log');
  const { user, healthLogs, setHealthLogs, addToast } = useApp();
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState({ weight: '', notes: '' });
  const [confirm, setConfirm] = useState(null);

  const userLogs = useMemo(() =>
    [...healthLogs]
      .filter(l => l.userId === user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [healthLogs, user.id]);

  const startEdit = (log) => { setEditId(log.id); setEditVal({ weight: log.weight, notes: log.notes || '' }); };
  const saveEdit = () => {
    const w = parseFloat(editVal.weight);
    if (!w || isNaN(w)) return addToast('Enter a valid weight', 'error');
    setHealthLogs(p => p.map(l => l.id === editId ? { ...l, weight: w, notes: editVal.notes } : l));
    setEditId(null);
    addToast('Weight entry updated', 'success');
  };

  const deleteLog = (id) => {
    setConfirm({
      title: 'Delete Entry?',
      message: 'This weight log entry will be permanently removed.',
      danger: true,
      confirmLabel: 'Delete',
      onConfirm: () => {
        setHealthLogs(p => p.filter(l => l.id !== id));
        setConfirm(null);
        addToast('Entry deleted', 'info');
      },
    });
  };

  return (
    <>
      <Screen
        kicker="Weight"
        right={<span className="kicker" style={{ color: 'var(--bone)' }}>{userLogs.length} entries</span>}
      >
        {userLogs.length === 0 ? (
          <Sec n="01" label="History">
            <Note>
              <b>No weight entries yet.</b> Log your weight from the Today page to start tracking.
            </Note>
          </Sec>
        ) : (
          <Sec n="01" label="History" right={isImpWeight ? 'lbs' : 'kg'}>
            {userLogs.map((log, i) => {
              const prev = userLogs[i + 1];
              const diff = prev ? (log.weight - prev.weight).toFixed(1) : null;
              const disp = isImpWeight ? kgToLbs(log.weight) : log.weight;
              const dispDiff = diff
                ? (isImpWeight ? (parseFloat(diff) * 2.20462).toFixed(1) : diff)
                : null;

              if (editId === log.id) {
                return (
                  <div key={log.id} style={{ borderTop: '1px solid var(--hair-soft)', paddingTop: 14, marginTop: 14 }}>
                    <div className="rowf between">
                      <span className="kicker" style={{ color: 'var(--ash-dim)' }}>{fmt(log.date)}</span>
                      <div className="rowf g12">
                        <TLink onClick={saveEdit}>Save</TLink>
                        <TLink onClick={() => setEditId(null)}>Cancel</TLink>
                      </div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                      <label className="kicker">Weight ({isImpWeight ? 'lbs' : 'kg'})</label>
                      <input
                        className="field"
                        type="number"
                        step=".1"
                        value={editVal.weight}
                        onChange={e => setEditVal(p => ({ ...p, weight: e.target.value }))}
                      />
                    </div>
                    <div style={{ marginTop: 16 }}>
                      <label className="kicker">Notes</label>
                      <input
                        className="field"
                        value={editVal.notes}
                        onChange={e => setEditVal(p => ({ ...p, notes: e.target.value }))}
                        placeholder="Optional"
                      />
                    </div>
                  </div>
                );
              }

              return (
                <div key={log.id}>
                  <LedgerRow
                    k={fmt(log.date)}
                    v={`${disp} ${isImpWeight ? 'lbs' : 'kg'}`}
                    sub={log.notes ? ` · ${log.notes}` : ''}
                  />
                  <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
                    <span className="meta" style={{ color: dispDiff && parseFloat(dispDiff) > 0 ? 'var(--warn)' : dispDiff && parseFloat(dispDiff) < 0 ? 'var(--ok)' : 'var(--ash-dim)' }}>
                      {dispDiff ? `${parseFloat(dispDiff) > 0 ? '+' : ''}${dispDiff} ${isImpWeight ? 'lbs' : 'kg'}` : 'first entry'}
                    </span>
                    <div className="rowf g12">
                      <TLink onClick={() => startEdit(log)}>Edit</TLink>
                      <TLink onClick={() => deleteLog(log.id)} style={{ color: 'var(--bad)' }}>Delete</TLink>
                    </div>
                  </div>
                  {i < userLogs.length - 1 && <div className="hairline" style={{ margin: '6px 0 14px' }} />}
                </div>
              );
            })}
          </Sec>
        )}

        <div className="foot">
          <span>Kaaya Fit</span>
          <span>Weight</span>
        </div>
      </Screen>

      <ConfirmDialog open={!!confirm} title={confirm?.title} message={confirm?.message} onConfirm={confirm?.onConfirm} onCancel={() => setConfirm(null)} confirmLabel={confirm?.confirmLabel} danger={confirm?.danger} />
    </>
  );
}
