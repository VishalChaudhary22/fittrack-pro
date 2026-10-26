import { useMemo, useState } from 'react';
import { Activity, TrendingUp, Award, Share2, Bot } from 'lucide-react';
import { useProgress } from '../../../core/hooks/useProgress';
import { VoltBlock, VoltPill, VoltChip, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Progress / Workout Analytics (V-5) ─────────────────────────
// Same brain as V1's ProgressPage (useProgress), Volt presentation with
// hand-rolled SVG charts (no Recharts). The PB share card keeps its ref so
// useProgress.sharePB (html2canvas) captures the Volt card identically.

const voltSelect = {
  width: '100%', padding: '12px 14px', borderRadius: 13, background: 'var(--v-panel)',
  border: '2.5px solid var(--v-edge)', color: 'var(--v-ink)', fontWeight: 700, fontSize: 14,
  fontFamily: "'Archivo', sans-serif", boxSizing: 'border-box',
};
const voltFieldInput = {
  width: '100%', padding: '12px 14px', borderRadius: 13, background: 'var(--v-canvas)',
  border: '2px solid var(--v-edge-quiet)', color: 'var(--v-ink)', fontWeight: 700, fontSize: 14,
  fontFamily: "'Archivo', sans-serif", boxSizing: 'border-box',
};
const fieldLabel = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)',
  fontWeight: 700, marginBottom: 7, textTransform: 'uppercase', letterSpacing: '0.1em',
};

// Hand-rolled SVG trend chart (draw-on line, optional volt area fill) with
// y-axis tick labels and gridlines, so values can actually be read off it.
function VoltTrendChart({ data, dataKey, height = 190, filled = true }) {
  const W = 560, H = 200, PAD = 10;
  const vals = data.map(d => d[dataKey]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = (max - min) || 1;
  const pts = data.map((d, i) => [
    PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
    H - PAD - ((d[dataKey] - min) / range) * (H - PAD * 2),
  ]);
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1][0].toFixed(1)},${H} L${pts[0][0].toFixed(1)},${H} Z`;
  const last = pts[pts.length - 1];
  const fmt = (v) => Math.round(v * 10) / 10;
  const ticks = [4, 3, 2, 1, 0].map(i => min + (range * i) / 4); // high → low
  const gridY = [0, 1, 2, 3, 4].map(i => PAD + ((H - PAD * 2) * i) / 4); // top → bottom
  return (
    <div>
      <div style={{ display: 'flex', gap: 7 }}>
        <div style={{
          width: 36, flexShrink: 0, height, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', textAlign: 'right',
          paddingTop: Math.max(height * (PAD / H) - 5, 0), paddingBottom: Math.max(height * (PAD / H) - 5, 0),
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)',
        }}>
          {ticks.map((t, i) => <span key={i}>{fmt(t)}</span>)}
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flex: 1, width: '100%', height, display: 'block' }} aria-hidden="true">
          {gridY.map((y, i) => (
            <line key={i} x1={0} x2={W} y1={y} y2={y} stroke="var(--v-edge-quiet)" strokeWidth="1" strokeDasharray="3 5" opacity="0.55" vectorEffect="non-scaling-stroke" />
          ))}
          {filled && <path d={area} fill="var(--v-volt)" opacity="0.13" stroke="none" />}
          <path className="v-draw" d={line} fill="none" stroke="var(--v-volt)" strokeWidth="2.5" pathLength={1} strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          <circle cx={last[0]} cy={last[1]} r="4.5" fill="var(--v-volt)" stroke="var(--v-edge)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, marginLeft: 43, fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)' }}>
        <span>{data[0]?.date}</span>
        <span>MAX {fmt(max)}</span>
        <span>{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function InsufficientData({ height = 190, title = 'Insufficient Data', message }) {
  return (
    <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--v-dim)', textAlign: 'center', padding: '0 16px' }}>
      <Activity size={28} color="var(--v-volt-text)" style={{ marginBottom: 10 }} />
      <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--v-ink)' }}>{title}</div>
      <div style={{ fontSize: 12, marginTop: 4, maxWidth: 240, lineHeight: 1.5 }}>{message}</div>
    </div>
  );
}

export default function ProgressPage({ chatbot }) {
  const {
    splits, ss, setSs, sd, setSd, se, setSe, days, exN, cd, pr, prData,
    history1RM, allTimePR, pbCardRef, sharePB, rmWt, setRmWt, rmRp, setRmRp,
    active1RM, weeklySummary, monthlySummary, split, ul,
  } = useProgress();

  const prEntry = cd.find(d => d.maxWeight === pr);
  // Volume range filter (the 1M/3M/6M chips were decorative — wire them).
  const [volMonths, setVolMonths] = useState(1);
  const volData = useMemo(() => {
    if (!cd.length) return cd;
    // Range is measured back from the most recent session, so a returning
    // user still sees their last 1/3/6 months of training.
    const latest = Math.max(...cd.map(d => (d.rawDate ? new Date(d.rawDate).getTime() : 0)));
    const cutoff = latest - volMonths * 30 * 24 * 60 * 60 * 1000;
    return cd.filter(d => !d.rawDate || new Date(d.rawDate).getTime() >= cutoff);
  }, [cd, volMonths]);
  const firstDelta = cd.length > 0 ? cd[cd.length - 1].est1rm - cd[0].est1rm : 0;

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>Performance data per exercise</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Workout Analytics</h1>
      </header>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        <select value={ss} onChange={e => { setSs(e.target.value); setSd(''); setSe(''); }} style={voltSelect} aria-label="Split">
          {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={sd} onChange={e => { setSd(e.target.value); setSe(''); }} style={voltSelect} aria-label="Day">
          <option value="">Any Day</option>
          {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* 1RM calculator */}
      <VoltBlock hero>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 170px' }}>
            <VoltLabel volt>Estimated 1RM Calculator</VoltLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 8 }}>
              <span className="v-num" style={{ fontSize: 52, lineHeight: 1, color: 'var(--v-volt-text)' }}>{active1RM}</span>
              <span style={{ fontSize: 15, fontWeight: 800, color: 'var(--v-dim)' }}>KG</span>
            </div>
          </div>
          <div style={{ flex: '2 1 300px', display: 'flex', gap: 11, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 150 }}>
              <label style={fieldLabel}>Lift (History Sync)</label>
              <select
                value={se}
                onChange={e => { setSe(e.target.value); setRmWt(''); setRmRp(''); }}
                style={voltSelect}
              >
                <option value="">Select Lift</option>
                {exN.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 92 }}>
              <label style={fieldLabel}>Weight</label>
              <input type="number" placeholder={prData ? prData.maxWeight : 'kg'} value={rmWt} onChange={e => setRmWt(e.target.value)} style={voltFieldInput} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 92 }}>
              <label style={fieldLabel}>Reps</label>
              <input type="number" placeholder={prData ? Math.round(prData.avgReps) : 'reps'} value={rmRp} onChange={e => setRmRp(e.target.value)} style={voltFieldInput} />
            </div>
          </div>
        </div>
      </VoltBlock>

      {/* Weekly / monthly strip */}
      <VoltBlock quiet>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.1em', marginRight: 8 }}>THIS WEEK</span>
            <span className="v-num" style={{ fontSize: 20, color: 'var(--v-volt-text)' }}>{weeklySummary.sessions}</span>
            <span style={{ fontSize: 12, color: 'var(--v-dim)', marginLeft: 4 }}>sessions</span>
          </div>
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.1em', marginRight: 8 }}>VOL</span>
            <span className="v-num" style={{ fontSize: 20, color: 'var(--v-volt-text)' }}>{Math.round(weeklySummary.volume / 1000)}k</span>
            <span style={{ fontSize: 12, color: 'var(--v-dim)', marginLeft: 4 }}>kg</span>
          </div>
          {weeklySummary.volChange !== 0 && (
            <div style={{ fontSize: 12.5, fontWeight: 800, color: weeklySummary.volChange > 0 ? 'var(--v-success-text)' : 'var(--v-coral-text)' }}>
              {weeklySummary.volChange > 0 ? '+' : ''}{weeklySummary.volChange}% vs last week
            </div>
          )}
          <div style={{ width: 2, height: 18, background: 'var(--v-edge-quiet)', alignSelf: 'center' }} />
          <div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--v-dim)', letterSpacing: '0.1em', marginRight: 8 }}>MONTHLY</span>
            <span className="v-num" style={{ fontSize: 20, color: 'var(--v-volt-text)' }}>{monthlySummary.sessions}</span>
            <span style={{ fontSize: 12, color: 'var(--v-dim)', marginLeft: 4 }}>sessions</span>
          </div>
          <div>
            <span className="v-num" style={{ fontSize: 20, color: 'var(--v-volt-text)' }}>~{monthlySummary.avgPerWeek}</span>
            <span style={{ fontSize: 12, color: 'var(--v-dim)', marginLeft: 4 }}>/week avg</span>
          </div>
        </div>
      </VoltBlock>

      {se && cd.length > 0 ? (
        <>
          {/* Exercise hero title */}
          <section className="v-rise">
            <VoltLabel volt>Performance Analytics</VoltLabel>
            <h2 className="v-num" style={{ fontSize: 'clamp(2.3rem, 8.5vw, 4rem)', lineHeight: 0.98, margin: '8px 0 0', textTransform: 'uppercase' }}>
              {se.includes(' ')
                ? <>
                    {se.split(' ').slice(0, Math.ceil(se.split(' ').length / 2)).join(' ')}
                    <br />
                    <span style={{ color: 'var(--v-volt-text)' }}>
                      {se.split(' ').slice(Math.ceil(se.split(' ').length / 2)).join(' ')}
                    </span>
                  </>
                : se}
            </h2>
          </section>

          {/* Stat grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: 14 }}>
            <VoltBlock style={{ borderLeft: '4px solid var(--v-volt)' }}>
              <VoltLabel>1RM History Max</VoltLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '10px 0 6px' }}>
                <span className="v-num" style={{ fontSize: 38, lineHeight: 1 }}>{history1RM}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--v-dim)' }}>KG</span>
              </div>
              {cd.length > 0 && (
                <div style={{ fontSize: 12.5, fontWeight: 700, color: firstDelta >= 0 ? 'var(--v-success-text)' : 'var(--v-coral-text)' }}>
                  {firstDelta >= 0 ? '▲ +' : '▼ '}{firstDelta.toFixed(1)} kg vs first session
                </div>
              )}
            </VoltBlock>
            <VoltBlock>
              <VoltLabel>Personal Record</VoltLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '10px 0 6px' }}>
                <span className="v-num" style={{ fontSize: 38, lineHeight: 1 }}>{pr}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: 'var(--v-dim)' }}>KG</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--v-dim)', fontWeight: 600 }}>
                Achieved: {prEntry?.rawDate ? new Date(prEntry.rawDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
              </div>
              {allTimePR && allTimePR.weight > pr && (
                <div style={{ fontSize: 11.5, color: 'var(--v-volt-text)', fontWeight: 700, marginTop: 4 }}>
                  All-time: {allTimePR.weight}kg {allTimePR.isBodyweight ? `(${allTimePR.reps} reps)` : ''}
                </div>
              )}
            </VoltBlock>
            <VoltBlock>
              <VoltLabel>Total Sessions</VoltLabel>
              <div className="v-num" style={{ fontSize: 38, lineHeight: 1, marginTop: 10 }}>{cd.length}</div>
            </VoltBlock>
          </div>

          {/* Volume trend */}
          <VoltBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 17, fontWeight: 900, textTransform: 'uppercase' }}>Volume Trend</div>
                <p style={{ color: 'var(--v-dim)', fontSize: 12.5, margin: '4px 0 0' }}>Total load lifted per session</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ m: 1, l: '1M' }, { m: 3, l: '3M' }, { m: 6, l: '6M' }].map(r => (
                  volMonths === r.m
                    ? <VoltChip key={r.l}>{r.l}</VoltChip>
                    : (
                      <button key={r.l} type="button" onClick={() => setVolMonths(r.m)} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--v-dim)', padding: '5px 4px', background: 'none', border: 'none', cursor: 'pointer' }}>{r.l}</button>
                    )
                ))}
              </div>
            </div>
            {volData.length >= 2 ? (
              <VoltTrendChart data={volData} dataKey="volume" height={230} />
            ) : (
              <InsufficientData height={230} message={cd.length >= 2 ? `Not enough ${se} sessions in this range — try a wider one.` : `Log ${se} for at least two days to see your volume trend.`} />
            )}
          </VoltBlock>

          {/* PB card + focus groups | session log */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ flex: '1 1 330px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <section ref={pbCardRef} className="v-block v-block--hero" style={{ position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 14, right: 14, width: 52, height: 58, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: '11px 11px 0 0', borderBottom: '4px solid var(--v-volt)' }}>
                  <Award size={22} color="var(--v-dim)" />
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 800, letterSpacing: '0.14em', color: 'var(--v-volt-text)' }}>PR</span>
                </div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-volt-text)', letterSpacing: '0.18em', fontWeight: 700, marginBottom: 18, paddingRight: 74 }}>PERSONAL BEST • {se.toUpperCase()}</div>
                <div className="v-num" style={{ fontSize: 56, lineHeight: 1 }}>{pr}</div>
                <div style={{ fontSize: 13.5, color: 'var(--v-dim)', marginTop: 7, marginBottom: 26 }}>
                  {prEntry ? `${prEntry.avgReps} avg reps · ${prEntry.sets} sets` : 'No sets data'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)', marginBottom: 4, letterSpacing: '0.1em' }}>DATE ACHIEVED</div>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>
                      {prEntry?.rawDate ? new Date(prEntry.rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                    </div>
                  </div>
                  <button type="button" onClick={sharePB} aria-label="Share personal best" className="v-press" style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--v-volt)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#141416', cursor: 'pointer', border: '2.5px solid var(--v-edge)', flexShrink: 0 }}>
                    <Share2 size={19} />
                  </button>
                </div>
              </section>

              {pr > 0 && (
                <VoltPill
                  ghost
                  onClick={() => {
                    if (chatbot) {
                      chatbot.openChat();
                      setTimeout(() => chatbot.sendMessage(`How can I beat my Personal Best of ${pr}kg on ${se}?`), 300);
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <Bot size={15} /> Ask FORGE how to beat this PR
                </VoltPill>
              )}

              <VoltBlock quiet>
                <VoltLabel>Focus Groups</VoltLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 11 }}>
                  {(() => {
                    let exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
                    if (!exDef) {
                      const logEx = ul.flatMap(l => l.exercises || []).find(e => e.name === se);
                      if (logEx) exDef = logEx;
                    }
                    const pM = exDef?.primaryMuscle || exDef?.muscle || null;
                    const sM = exDef?.secondaryMuscles || [];
                    if (!pM && sM.length === 0) return <VoltChip>General</VoltChip>;
                    return (
                      <>
                        {pM && <VoltChip>{pM}</VoltChip>}
                        {sM.map(m => <span key={m} className="v-chip" style={{ color: 'var(--v-dim)' }}>{m}</span>)}
                      </>
                    );
                  })()}
                </div>
              </VoltBlock>
            </div>

            <VoltBlock style={{ flex: '1 1 460px' }}>
              <VoltLabel>Session Log</VoltLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                {[...cd].reverse().slice(0, 5).map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '12px 13px', borderRadius: 13, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-canvas)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                      <div style={{ width: 46, height: 46, background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: 11, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--v-dim)', textTransform: 'uppercase', fontWeight: 700 }}>{new Date(entry.rawDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span className="v-num" style={{ fontSize: 17, lineHeight: 1 }}>{new Date(entry.rawDate).getDate()}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 800, marginBottom: 2 }}>{entry.dayName}</div>
                        <div style={{ fontSize: 12, color: 'var(--v-dim)' }}>{entry.sets} sets · {entry.volume.toLocaleString()} kg volume</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div className="v-num" style={{ fontSize: 18, marginBottom: 2 }}>{entry.maxWeight} × {entry.avgReps}</div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: entry.maxWeight === pr ? 'var(--v-volt-text)' : idx === 0 ? 'var(--v-success-text)' : 'var(--v-dim)' }}>
                        {entry.maxWeight === pr ? 'New PB' : idx === 0 ? 'Latest' : 'Session'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </VoltBlock>
          </div>

          {/* Secondary charts */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {[
              { title: 'Est. 1RM over time', dataKey: 'est1rm', filled: true },
              { title: 'Avg Reps/Set', dataKey: 'avgReps', filled: false },
            ].map(ch => (
              <VoltBlock key={ch.dataKey}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 7 }}>
                  <TrendingUp size={13} color="var(--v-volt-text)" /> {ch.title}
                </div>
                {cd.length >= 2 ? (
                  <VoltTrendChart data={cd} dataKey={ch.dataKey} height={140} filled={ch.filled} />
                ) : (
                  <InsufficientData height={140} title="Insufficient Data" message={`More data needed for ${ch.title.toLowerCase()}`} />
                )}
              </VoltBlock>
            ))}
          </div>
        </>
      ) : (
        <VoltBlock style={{ textAlign: 'center', padding: 34 }}>
          <TrendingUp size={34} color="var(--v-dim)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 17, fontWeight: 900 }}>{se ? 'No data yet' : 'Choose Your Lift'}</div>
          <p style={{ color: 'var(--v-dim)', fontSize: 13.5, margin: '7px auto 0', maxWidth: 320, lineHeight: 1.55 }}>
            {se ? 'Log workouts to see strength progression charts' : 'Select split, day, and exercise above to unlock your performance analytics'}
          </p>
        </VoltBlock>
      )}
    </div>
  );
}
