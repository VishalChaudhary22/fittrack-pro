import { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useApp } from '../../context/AppContext';
import { MEASUREMENT_FIELDS } from '../../data/constants';
import { gId, tod, fmt } from '../../utils/helpers';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { Screen, Sec, LedgerRow, Action, Note, TLink } from '../shared/Margin';

export default function MeasurementsPage() {
  useScrollRestoration('/measurements');
  const { user, measurements, setMeasurements, addToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({});
  const [chartField, setChartField] = useState('chest');

  const userMeasurements = useMemo(() =>
    [...measurements].filter(m => m.userId === user.id).sort((a, b) => new Date(b.date) - new Date(a.date)),
    [measurements, user.id]);

  const chartData = useMemo(() =>
    [...userMeasurements].reverse().map(m => ({
      date: fmt(m.date),
      value: m[chartField] || null,
    })).filter(d => d.value !== null),
    [userMeasurements, chartField]);

  const latest = userMeasurements[0] || {};

  const saveMeasurement = () => {
    const entry = { id: gId(), userId: user.id, date: tod(), ...form };
    setMeasurements(p => [...p, entry]);
    setForm({});
    setShowAdd(false);
    addToast('Measurements saved!', 'success');
  };

  const activeField = MEASUREMENT_FIELDS.find(f => f.key === chartField);

  return (
    <>
      <Screen
        kicker="Body"
        right={<span className="kicker" style={{ color: 'var(--bone)' }}>{userMeasurements.length} entries</span>}
      >
        {userMeasurements.length === 0 ? (
          <Sec n="01" label="Measurements">
            <Note>
              <b>No measurements yet.</b> Log chest, waist, arms and legs to track changes over time.
            </Note>
            <Action onClick={() => setShowAdd(true)}>Log measurements</Action>
          </Sec>
        ) : (
          <>
            <Sec n="01" label="Latest" right={activeField?.unit}>
              {MEASUREMENT_FIELDS.map((f) => (
                <LedgerRow
                  key={f.key}
                  k={f.label}
                  dim={chartField !== f.key}
                  onClick={() => setChartField(f.key)}
                  v={latest[f.key] || '—'}
                  sub={chartField === f.key ? ` ${f.unit}` : ` ${f.unit}`}
                />
              ))}
            </Sec>

            <Sec n="02" label={activeField?.label || 'Trend'} right={chartData.length >= 2 ? 'history' : 'need more'}>
              {chartData.length >= 2 ? (
                <div style={{ marginTop: 8 }}>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={chartData} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="2 4" stroke="var(--hair)" vertical={false} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: 'var(--ash-dim)', fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }}
                        tickLine={false}
                        axisLine={false}
                        dy={8}
                      />
                      <YAxis
                        tick={{ fill: 'var(--ash-dim)', fontSize: 9, fontFamily: "'Space Grotesk', sans-serif" }}
                        domain={['auto', 'auto']}
                        tickLine={false}
                        axisLine={false}
                        dx={-4}
                      />
                      <Tooltip
                        contentStyle={{
                          background: 'var(--canvas)',
                          border: '1px solid var(--hair)',
                          borderRadius: 0,
                          fontSize: 11,
                          color: 'var(--ink)',
                          fontFamily: "'Space Grotesk', sans-serif",
                        }}
                        labelStyle={{ color: 'var(--ash-dim)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase' }}
                        itemStyle={{ color: 'var(--ember-soft)' }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="var(--ember)"
                        strokeWidth={1}
                        dot={{ fill: 'var(--ember)', r: 2, strokeWidth: 0 }}
                        activeDot={{ r: 3, strokeWidth: 0 }}
                        name={activeField?.label}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <Note>
                  <b>Need more points.</b> Log {activeField?.label?.toLowerCase()} again on another day to see the trend.
                </Note>
              )}
            </Sec>

            <Sec n="03" label="History">
              {userMeasurements.slice(0, 12).map((m, i) => (
                <div key={m.id}>
                  <div className="rowf between" style={{ padding: '10px 0' }}>
                    <span className="kicker" style={{ color: 'var(--ash-dim)' }}>{fmt(m.date)}</span>
                    <span className="meta" style={{ gap: 12 }}>
                      {MEASUREMENT_FIELDS.filter(f => m[f.key]).map(f => (
                        <span key={f.key}>{f.label} {m[f.key]}{f.unit}</span>
                      ))}
                    </span>
                  </div>
                  {i < Math.min(userMeasurements.length, 12) - 1 && <div style={{ height: 1, background: 'var(--hair-soft)' }} />}
                </div>
              ))}
              {userMeasurements.length > 12 && (
                <p className="body-dim" style={{ marginTop: 12 }}>Showing 12 most recent entries.</p>
              )}
            </Sec>
          </>
        )}

        <Sec n={userMeasurements.length === 0 ? '02' : '04'} label="Log">
          <Action onClick={() => setShowAdd(true)}>Log measurements</Action>
        </Sec>

        <div className="foot">
          <span>Kaaya Fit</span>
          <span>Measurements</span>
        </div>
      </Screen>

      {showAdd && (
        <div className="mo" style={{ alignItems: 'stretch', padding: 0 }}>
          <div style={{ width: '100%', maxWidth: 430, margin: '0 auto', background: 'var(--canvas)', height: '100dvh', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '0 22px 16px', flex: 1, overflowY: 'auto', overscrollBehavior: 'contain' }}>
              <div className="head" style={{ paddingLeft: 0, paddingRight: 0 }}>
                <div className="head-l"><span className="kicker">Log measurements</span></div>
                <div className="head-r"><TLink onClick={() => setShowAdd(false)}>Close</TLink></div>
              </div>
              <p className="body-dim" style={{ marginTop: 16 }}>Enter values in cm. Leave blank anything you don't want to track.</p>

              <div style={{ marginTop: 24 }}>
                {MEASUREMENT_FIELDS.map((f) => (
                  <div key={f.key} style={{ marginTop: 18 }}>
                    <label className="kicker">{f.label} · {f.unit}</label>
                    <input
                      className="field"
                      type="number"
                      step=".1"
                      placeholder="—"
                      value={form[f.key] || ''}
                      onChange={e => setForm(p => ({ ...p, [f.key]: parseFloat(e.target.value) || '' }))}
                    />
                  </div>
                ))}
              </div>

              <Action onClick={saveMeasurement} style={{ marginTop: 32 }}>Save measurements</Action>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
