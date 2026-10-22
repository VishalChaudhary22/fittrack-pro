import { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { getCyclePhase } from '../../utils/cycleCalculations';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { Screen, Sec, LedgerRow, Action, Note, Word } from '../shared/Margin';

export default function CycleTrackerPage() {
  useScrollRestoration('/cycle');
  const { user, cycleConfig, setCycleConfig } = useApp();
  const [startDate, setStartDate] = useState(cycleConfig?.startDate || '');
  const [cycleLength, setCycleLength] = useState(cycleConfig?.cycleLength || 28);

  const phaseInfo = useMemo(() => {
    if (!cycleConfig?.startDate) return null;
    return getCyclePhase(cycleConfig.startDate, cycleConfig.cycleLength);
  }, [cycleConfig]);

  const save = () => {
    if (!startDate) return;
    setCycleConfig({ startDate, cycleLength: parseInt(cycleLength) });
  };

  const clear = () => {
    setCycleConfig(null);
    setStartDate('');
  };

  return (
    <Screen kicker="Cycle" right={<span className="kicker" style={{ color: 'var(--bone)' }}>Training</span>}>
      {!cycleConfig?.startDate ? (
        <Sec n="01" label="Setup">
          <Note>
            <b>Train with your cycle.</b> Track your phase to adjust intensity and recovery.
          </Note>
          <div style={{ marginTop: 18 }}>
            <label className="kicker">Last period start date</label>
            <input className="field" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div style={{ marginTop: 18 }}>
            <label className="kicker">Cycle length (days)</label>
            <input className="field" type="number" min="21" max="40" value={cycleLength} onChange={e => setCycleLength(e.target.value)} />
          </div>
          <Action onClick={save}>Start tracking</Action>
        </Sec>
      ) : (
        <>
          <Sec n="01" label="Today" right={`Day ${phaseInfo?.currentDay || '—'} of ${cycleConfig.cycleLength}`}>
            <div className="h1" style={{ marginTop: 4 }}>{phaseInfo?.phase || '—'}</div>
            <p className="body-dim" style={{ marginTop: 10 }}>{phaseInfo?.advice}</p>
            <div className="rowf g16 mt14">
              <span className="meta">{phaseInfo?.nextPeriodIn} days to next period</span>
            </div>
          </Sec>

          <Sec n="02" label="Training advice">
            <Note>
              <b>Focus.</b> {phaseInfo?.advice}
            </Note>
            <LedgerRow
              k="Energy"
              v={<Word tone={phaseInfo?.phase === 'Follicular' || phaseInfo?.phase === 'Ovulation' ? 'ok' : phaseInfo?.phase === 'Menstruation' ? 'idle' : 'warn'}>
                {phaseInfo?.phase === 'Follicular' || phaseInfo?.phase === 'Ovulation' ? 'Higher' : phaseInfo?.phase === 'Menstruation' ? 'Lower' : 'Moderate'}
              </Word>}
            />
            <LedgerRow
              k="Recovery"
              v={<Word tone={phaseInfo?.phase === 'Luteal' ? 'warn' : phaseInfo?.phase === 'Menstruation' ? 'bad' : 'ok'}>
                {phaseInfo?.phase === 'Luteal' ? 'Prioritize' : phaseInfo?.phase === 'Menstruation' ? 'Take care' : 'Normal'}
              </Word>}
            />
          </Sec>

          <Sec n="04" label="Settings">
            <LedgerRow k="Start date" v={cycleConfig.startDate} tone="sm" />
            <LedgerRow k="Cycle length" v={`${cycleConfig.cycleLength} days`} tone="sm" />
            <Action onClick={clear}>Reset cycle tracking</Action>
          </Sec>
        </>
      )}

      <div className="foot">
        <span>Kaaya Fit</span>
        <span>Cycle</span>
      </div>
    </Screen>
  );
}
