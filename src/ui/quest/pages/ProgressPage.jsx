import { useMemo, useState } from 'react';
import { useProgress } from '../../../core/hooks/useProgress';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Progress / Workout Analytics (plan §7.5, Q-5) ────────────
// Same brain as V1/Volt (useProgress), Quest presentation: volume as block
// columns, strength trends as stepped square-point lines (crispEdges SVG),
// and the 1M/3M/6M range switch as cartridge chips (the PR #37 wiring,
// re-skinned). The PB share card keeps its ref so useProgress.sharePB
// (html2canvas) captures the Quest card identically.

const qSelect = {
  width: '100%', minHeight: 50, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};
const qField = {
  width: '100%', minHeight: 50, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

// Volume as block columns: one hard-edged column per session.
function BlockColumns({ data, dataKey }) {
  const W_FOOTER = data;
  const max = Math.max(...data.map(d => d[dataKey]), 1);
  return (
    <div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'flex-end', height: 190 }}>
        {data.map((d, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0, height: '100%', justifyContent: 'flex-end' }}>
            <span className="q-meta" style={{ fontSize: 12 }}>{(d[dataKey] / 1000).toFixed(1)}k</span>
            <div
              title={`${d.date} · ${d[dataKey].toLocaleString()} kg`}
              style={{ width: '100%', maxWidth: 44, height: `${Math.max((d[dataKey] / max) * 78, 2)}%`, background: 'var(--q-volt)', border: '3px solid var(--q-border)' }}
            />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 9 }}>
        <span className="q-meta">{W_FOOTER[0]?.date}</span>
        <span className="q-meta">MAX {Math.round(max).toLocaleString()} KG</span>
        <span className="q-meta">{W_FOOTER[W_FOOTER.length - 1]?.date}</span>
      </div>
    </div>
  );
}

// Stepped square-point line: horizontal-then-vertical steps, square markers,
// crispEdges throughout — the 8-bit way to draw a trend.
function StepChart({ data, dataKey, color = 'var(--q-volt)', height = 150 }) {
  const W = 560, H = 170, PAD = 12;
  const vals = data.map(d => d[dataKey]);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = (max - min) || 1;
  const pts = data.map((d, i) => [
    PAD + (i / Math.max(data.length - 1, 1)) * (W - PAD * 2),
    H - PAD - ((d[dataKey] - min) / range) * (H - PAD * 2),
  ]);
  let path = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    path += ` H${pts[i][0].toFixed(1)} V${pts[i][1].toFixed(1)}`;
  }
  const fmt = (v) => Math.round(v * 10) / 10;
  const gridY = [0, 1, 2, 3, 4].map(i => PAD + ((H - PAD * 2) * i) / 4);
  return (
    <div>
      <div style={{ display: 'flex', gap: 7 }}>
        <div style={{ width: 38, flexShrink: 0, height, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', textAlign: 'right', paddingTop: 2, paddingBottom: 2 }}>
          <span className="q-meta">{fmt(max)}</span>
          <span className="q-meta">{fmt(min)}</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ flex: 1, width: '100%', height, display: 'block' }} aria-hidden="true">
          {gridY.map((y, i) => (
            <line key={i} x1={0} x2={W} y1={y} y2={y} stroke="var(--q-panel2)" strokeWidth="2" />
          ))}
          <path d={path} fill="none" stroke={color} strokeWidth="3.5" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
          {pts.map((p, i) => (
            <rect key={i} x={p[0] - 4} y={p[1] - 4} width="8" height="8" fill={color} stroke="var(--q-border)" strokeWidth="1.5" shapeRendering="crispEdges" vectorEffect="non-scaling-stroke" />
          ))}
        </svg>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7, marginLeft: 45 }}>
        <span className="q-meta">{data[0]?.date}</span>
        <span className="q-meta">MAX {fmt(max)}</span>
        <span className="q-meta">{data[data.length - 1]?.date}</span>
      </div>
    </div>
  );
}

function InsufficientData({ height = 170, title = 'INSUFFICIENT DATA', message }) {
  return (
    <div style={{ height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--q-dim)', textAlign: 'center', padding: '0 16px' }}>
      <PixelSprite name="chart" size={30} style={{ marginBottom: 12, opacity: 0.7 }} />
      <div className="q-ps" style={{ fontSize: 11, color: 'var(--q-ink)' }}>{title}</div>
      <div style={{ fontSize: 17, marginTop: 7, maxWidth: 250, lineHeight: 1.45 }}>{message}</div>
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
  // Volume range filter (same wiring as Volt: measured back from the most
  // recent session, so a returning user still sees their last months).
  const [volMonths, setVolMonths] = useState(1);
  const volData = useMemo(() => {
    if (!cd.length) return cd;
    const latest = Math.max(...cd.map(d => (d.rawDate ? new Date(d.rawDate).getTime() : 0)));
    const cutoff = latest - volMonths * 30 * 24 * 60 * 60 * 1000;
    return cd.filter(d => !d.rawDate || new Date(d.rawDate).getTime() >= cutoff);
  }, [cd, volMonths]);
  const firstDelta = cd.length > 0 ? cd[cd.length - 1].est1rm - cd[0].est1rm : 0;

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <QuestLabel tone="volt">Performance data per exercise</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(21px, 6vw, 32px)', lineHeight: 1.35, margin: '10px 0 0' }}>PROGRESS</h1>
      </header>

      {/* Filters */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 12 }}>
        <select value={ss} onChange={e => { setSs(e.target.value); setSd(''); setSe(''); }} style={qSelect} aria-label="Split">
          {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={sd} onChange={e => { setSd(e.target.value); setSe(''); }} style={qSelect} aria-label="Day">
          <option value="">Any Day</option>
          {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* 1RM calculator */}
      <QuestBlock>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ flex: '1 1 170px' }}>
            <QuestLabel tone="volt">Estimated 1RM Calculator</QuestLabel>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 10 }}>
              <span className="q-ps" style={{ fontSize: 40, lineHeight: 1.2, color: 'var(--q-volt-text)' }}>{active1RM}</span>
              <span style={{ fontSize: 17, color: 'var(--q-dim)' }}>KG</span>
            </div>
          </div>
          <div style={{ flex: '2 1 300px', display: 'flex', gap: 11, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 150 }}>
              <QuestLabel>Lift (History Sync)</QuestLabel>
              <select
                value={se}
                onChange={e => { setSe(e.target.value); setRmWt(''); setRmRp(''); }}
                style={{ ...qSelect, marginTop: 7 }}
                aria-label="Lift"
              >
                <option value="">Select Lift</option>
                {exN.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 92 }}>
              <QuestLabel>Weight</QuestLabel>
              <input type="number" placeholder={prData ? prData.maxWeight : 'kg'} value={rmWt} onChange={e => setRmWt(e.target.value)} style={{ ...qField, marginTop: 7 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 92 }}>
              <QuestLabel>Reps</QuestLabel>
              <input type="number" placeholder={prData ? Math.round(prData.avgReps) : 'reps'} value={rmRp} onChange={e => setRmRp(e.target.value)} style={{ ...qField, marginTop: 7 }} />
            </div>
          </div>
        </div>
      </QuestBlock>

      {/* Weekly / monthly strip */}
      <QuestBlock variant="panel2" flat>
        <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', alignItems: 'baseline' }}>
          <div>
            <span className="q-meta" style={{ marginRight: 8 }}>THIS WEEK</span>
            <span style={{ fontSize: 23, color: 'var(--q-volt-text)' }}>{weeklySummary.sessions}</span>
            <span style={{ fontSize: 16, color: 'var(--q-dim)', marginLeft: 4 }}>sessions</span>
          </div>
          <div>
            <span className="q-meta" style={{ marginRight: 8 }}>VOL</span>
            <span style={{ fontSize: 23, color: 'var(--q-volt-text)' }}>{Math.round(weeklySummary.volume / 1000)}k</span>
            <span style={{ fontSize: 16, color: 'var(--q-dim)', marginLeft: 4 }}>kg</span>
          </div>
          {weeklySummary.volChange !== 0 && (
            <div style={{ fontSize: 17, color: weeklySummary.volChange > 0 ? 'var(--q-volt-text)' : 'var(--q-ember-text)' }}>
              {weeklySummary.volChange > 0 ? '+' : ''}{weeklySummary.volChange}% vs last week
            </div>
          )}
          <div style={{ width: 3, height: 18, background: 'var(--q-panel)', alignSelf: 'center' }} />
          <div>
            <span className="q-meta" style={{ marginRight: 8 }}>MONTHLY</span>
            <span style={{ fontSize: 23, color: 'var(--q-volt-text)' }}>{monthlySummary.sessions}</span>
            <span style={{ fontSize: 16, color: 'var(--q-dim)', marginLeft: 4 }}>sessions</span>
          </div>
          <div>
            <span style={{ fontSize: 23, color: 'var(--q-volt-text)' }}>~{monthlySummary.avgPerWeek}</span>
            <span style={{ fontSize: 16, color: 'var(--q-dim)', marginLeft: 4 }}>/week avg</span>
          </div>
        </div>
      </QuestBlock>

      {se && cd.length > 0 ? (
        <>
          {/* Exercise hero title */}
          <section>
            <QuestLabel tone="volt">Performance Analytics</QuestLabel>
            <h2 className="q-ps" style={{ fontSize: 'clamp(19px, 5.6vw, 30px)', lineHeight: 1.45, margin: '10px 0 0' }}>
              {se.includes(' ')
                ? <>
                    {se.split(' ').slice(0, Math.ceil(se.split(' ').length / 2)).join(' ').toUpperCase()}
                    <br />
                    <span style={{ color: 'var(--q-volt-text)' }}>
                      {se.split(' ').slice(Math.ceil(se.split(' ').length / 2)).join(' ').toUpperCase()}
                    </span>
                  </>
                : se.toUpperCase()}
            </h2>
          </section>

          {/* Stat tiles */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 14 }}>
            <QuestBlock style={{ borderLeft: '5px solid var(--q-volt)' }}>
              <QuestLabel>1RM History Max</QuestLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '10px 0 6px' }}>
                <span className="q-ps" style={{ fontSize: 30 }}>{history1RM}</span>
                <span style={{ fontSize: 16, color: 'var(--q-dim)' }}>KG</span>
              </div>
              {cd.length > 0 && (
                <div style={{ fontSize: 16.5, color: firstDelta >= 0 ? 'var(--q-volt-text)' : 'var(--q-ember-text)' }}>
                  {firstDelta >= 0 ? '▲ +' : '▼ '}{firstDelta.toFixed(1)} kg vs first session
                </div>
              )}
            </QuestBlock>
            <QuestBlock>
              <QuestLabel>Personal Record</QuestLabel>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 7, margin: '10px 0 6px' }}>
                <span className="q-ps" style={{ fontSize: 30 }}>{pr}</span>
                <span style={{ fontSize: 16, color: 'var(--q-dim)' }}>KG</span>
              </div>
              <div style={{ fontSize: 16.5, color: 'var(--q-dim)' }}>
                Achieved: {prEntry?.rawDate ? new Date(prEntry.rawDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
              </div>
              {allTimePR && allTimePR.weight > pr && (
                <div style={{ fontSize: 16, color: 'var(--q-volt-text)', marginTop: 4 }}>
                  All-time: {allTimePR.weight}kg {allTimePR.isBodyweight ? `(${allTimePR.reps} reps)` : ''}
                </div>
              )}
            </QuestBlock>
            <QuestBlock>
              <QuestLabel>Total Sessions</QuestLabel>
              <div className="q-ps" style={{ fontSize: 30, marginTop: 10 }}>{cd.length}</div>
            </QuestBlock>
          </div>

          {/* Volume trend — block columns + range cartridges */}
          <QuestBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <div>
                <div className="q-ps" style={{ fontSize: 12.5 }}>VOLUME TREND</div>
                <p style={{ color: 'var(--q-dim)', fontSize: 16.5, margin: '6px 0 0' }}>Total load lifted per session</p>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                {[{ m: 1, l: '1M' }, { m: 3, l: '3M' }, { m: 6, l: '6M' }].map(r => (
                  <button
                    key={r.l}
                    type="button"
                    className="q-btn q-btn--sm"
                    onClick={() => setVolMonths(r.m)}
                    style={volMonths === r.m ? {} : { background: 'var(--q-panel2)', color: 'var(--q-dim)', boxShadow: 'none' }}
                  >
                    {r.l}
                  </button>
                ))}
              </div>
            </div>
            {volData.length >= 2 ? (
              <BlockColumns data={volData} dataKey="volume" />
            ) : (
              <InsufficientData height={190} message={cd.length >= 2 ? `Not enough ${se} sessions in this range — try a wider one.` : `Log ${se} for at least two days to see your volume trend.`} />
            )}
          </QuestBlock>

          {/* PB card + focus groups | session log */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
            <div style={{ flex: '1 1 330px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              <section ref={pbCardRef} className="q-block" style={{ position: 'relative', overflow: 'hidden', borderColor: 'var(--q-gold)' }}>
                <div style={{ position: 'absolute', top: 14, right: 14, width: 54, height: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, background: 'var(--q-slot)', border: '3px solid var(--q-border)', borderBottom: '5px solid var(--q-gold)' }}>
                  <PixelSprite name="crown" size={22} />
                  <span className="q-ps" style={{ fontSize: 8, color: 'var(--q-gold-text)' }}>PR</span>
                </div>
                <QuestLabel tone="gold">Personal Best · {se}</QuestLabel>
                <div className="q-ps" style={{ fontSize: 44, lineHeight: 1.25, marginTop: 14 }}>{pr}</div>
                <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 6, marginBottom: 24 }}>
                  {prEntry ? `${prEntry.avgReps} avg reps · ${prEntry.sets} sets` : 'No sets data'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                  <div>
                    <QuestLabel>Date Achieved</QuestLabel>
                    <div style={{ fontSize: 18, marginTop: 4 }}>
                      {prEntry?.rawDate ? new Date(prEntry.rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                    </div>
                  </div>
                  <QuestBtn tone="gold" sm onClick={sharePB} aria-label="Share personal best">SHARE</QuestBtn>
                </div>
              </section>

              {pr > 0 && (
                <QuestBtn
                  tone="ghost"
                  onClick={() => {
                    if (chatbot) {
                      chatbot.openChat();
                      setTimeout(() => chatbot.sendMessage(`How can I beat my Personal Best of ${pr}kg on ${se}?`), 300);
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  <PixelSprite name="bot" size={15} /> ASK FORGE TO BEAT THIS PR
                </QuestBtn>
              )}

              <QuestBlock variant="panel2" flat>
                <QuestLabel>Focus Groups</QuestLabel>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 11 }}>
                  {(() => {
                    let exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
                    if (!exDef) {
                      const logEx = ul.flatMap(l => l.exercises || []).find(e => e.name === se);
                      if (logEx) exDef = logEx;
                    }
                    const pM = exDef?.primaryMuscle || exDef?.muscle || null;
                    const sM = exDef?.secondaryMuscles || [];
                    if (!pM && sM.length === 0) return <QuestChip>GENERAL</QuestChip>;
                    return (
                      <>
                        {pM && <QuestChip tone="volt">{String(pM).toUpperCase()}</QuestChip>}
                        {sM.map(m => <span key={m} className="q-chip" style={{ color: 'var(--q-dim)' }}>{String(m).toUpperCase()}</span>)}
                      </>
                    );
                  })()}
                </div>
              </QuestBlock>
            </div>

            <QuestBlock style={{ flex: '1 1 440px' }}>
              <QuestLabel tone="volt">Session Log</QuestLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 14 }}>
                {[...cd].reverse().slice(0, 5).map((entry, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '11px 12px', border: '3px solid var(--q-border)', background: 'var(--q-slot)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                      <div style={{ width: 46, height: 46, background: 'var(--q-panel)', border: '3px solid var(--q-border)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <span className="q-meta" style={{ fontSize: 11.5 }}>{new Date(entry.rawDate).toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</span>
                        <span className="q-ps" style={{ fontSize: 13, marginTop: 3 }}>{new Date(entry.rawDate).getDate()}</span>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 18.5, marginBottom: 2 }}>{entry.dayName}</div>
                        <div style={{ fontSize: 16, color: 'var(--q-dim)' }}>{entry.sets} sets · {entry.volume.toLocaleString()} kg volume</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontSize: 21, marginBottom: 2 }}>{entry.maxWeight} × {entry.avgReps}</div>
                      <div className="q-meta" style={{ color: entry.maxWeight === pr ? 'var(--q-gold-text)' : idx === 0 ? 'var(--q-volt-text)' : 'var(--q-dim)' }}>
                        {entry.maxWeight === pr ? 'NEW PB' : idx === 0 ? 'LATEST' : 'SESSION'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </QuestBlock>
          </div>

          {/* Secondary charts — stepped square-point lines */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {[
              { title: 'EST. 1RM OVER TIME', dataKey: 'est1rm', color: 'var(--q-volt)' },
              { title: 'AVG REPS / SET', dataKey: 'avgReps', color: 'var(--q-sky)' },
            ].map(ch => (
              <QuestBlock key={ch.dataKey}>
                <QuestLabel tone="volt">{ch.title}</QuestLabel>
                <div style={{ marginTop: 14 }}>
                  {cd.length >= 2 ? (
                    <StepChart data={cd} dataKey={ch.dataKey} color={ch.color} height={140} />
                  ) : (
                    <InsufficientData height={140} title="INSUFFICIENT DATA" message={`More data needed for ${ch.title.toLowerCase()}`} />
                  )}
                </div>
              </QuestBlock>
            ))}
          </div>
        </>
      ) : (
        <QuestBlock style={{ textAlign: 'center', padding: 32 }}>
          <PixelSprite name="chart" size={34} style={{ marginBottom: 12, opacity: 0.75 }} />
          <div className="q-ps" style={{ fontSize: 13 }}>{se ? 'NO DATA YET' : 'CHOOSE YOUR LIFT'}</div>
          <p style={{ color: 'var(--q-dim)', fontSize: 17, margin: '10px auto 0', maxWidth: 330, lineHeight: 1.5 }}>
            {se ? 'Log workouts to see strength progression charts' : 'Select split, day, and exercise above to unlock your performance analytics'}
          </p>
        </QuestBlock>
      )}
    </div>
  );
}
