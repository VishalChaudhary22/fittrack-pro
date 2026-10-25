import { useState, useMemo, useRef } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { useApp } from '../../context/AppContext';
import { Screen, Sec, Hero, LedgerRow, Note, TLink } from '../shared/Margin';
import { chartAxis, chartTooltip, CHART_EMBER } from '../shared/marginChart';
import { best1RMFromSets, calc1RM } from '../../utils/calculations';
import { fmt } from '../../utils/helpers';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { getAllTimePR } from '../../utils/exerciseHistory';

const progressFilterCache = { ss: null, sd: '', se: '' };

export default function ProgressPage({ chatbot }) {
  useScrollRestoration('/progress');
  const { user, workoutLogs, splits, addToast } = useApp();
  const act = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [ss, setSsRaw] = useState(progressFilterCache.ss || act?.id || splits[0]?.id);
  const [sd, setSdRaw] = useState(progressFilterCache.sd);
  const [se, setSeRaw] = useState(progressFilterCache.se);

  const setSs = (v) => { progressFilterCache.ss = v; setSsRaw(v); };
  const setSd = (v) => { progressFilterCache.sd = v; setSdRaw(v); };
  const setSe = (v) => { progressFilterCache.se = v; setSeRaw(v); };

  // Standalone 1RM State
  const [rmWt, setRmWt] = useState('');
  const [rmRp, setRmRp] = useState('');
  const split = splits.find(s => s.id === ss);
  const days = split?.days.filter(d => d.type !== 'rest') || [];
  const ul = workoutLogs.filter(l => l.userId === user.id);

  const exN = useMemo(() => { const n = new Set(); ul.filter(l => !sd || l.dayId === sd).forEach(l => l.exercises?.forEach(e => n.add(e.name))); if (sd) days.find(d => d.id === sd)?.exercises.forEach(e => n.add(e.name)); return [...n]; }, [sd, ul, days]);
  const cd = useMemo(() => {
    if (!se) return [];
    return ul.filter(l => !sd || l.dayId === sd).sort((a, b) => new Date(a.date) - new Date(b.date)).map(log => {
      const ex = log.exercises?.find(e => e.name === se);
      if (!ex?.sets?.length) return null;
      const mx = Math.max(...ex.sets.map(s => s.weight || 0));
      const vol = ex.sets.reduce((a, s) => a + (s.reps || 0) * (s.weight || 0), 0);
      const ar = +(ex.sets.reduce((a, s) => a + (s.reps || 0), 0) / ex.sets.length).toFixed(1);
      const est1rm = best1RMFromSets(ex.sets);
      const dayName = split?.days?.find(d => d.id === log.dayId)?.name || 'Session';
      return { date: fmt(log.date), rawDate: log.date, dayName, maxWeight: mx, volume: Math.round(vol), avgReps: ar, sets: ex.sets.length, est1rm };
    }).filter(Boolean);
  }, [se, sd, ul, split]);
  const pr = cd.length ? Math.max(...cd.map(d => d.maxWeight)) : 0;
  const prData = pr ? cd.find(d => d.maxWeight === pr) : null;
  const history1RM = cd.length ? Math.max(...cd.map(d => d.est1rm)) : 0;
  const allTimePR = se ? getAllTimePR(ul, se) : null;
  const pbCardRef = useRef(null);

  const sharePB = async () => {
    if (!pbCardRef.current) return;
    try {
      const canvas = await html2canvas(pbCardRef.current, { backgroundColor: '#111827', scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const blob = await (await fetch(imgData)).blob();

      if (navigator.share) {
        const file = new File([blob], 'fittrack-pb.png', { type: 'image/png' });
        await navigator.share({
          title: 'My New Personal Best!',
          text: `Check out my new PR on ${se}: ${pr}kg!`,
          files: [file]
        });
      } else {
        // Fallback for desktop: download
        const a = document.createElement('a');
        a.href = imgData; a.download = 'fittrack-pb.png';
        a.click();
        addToast('Image saved to downloads', 'success');
      }
    } catch (e) {
       console.error("Export failed", e);
    }
  };

  const askForge = () => {
    if (chatbot) {
      chatbot.openChat();
      setTimeout(() => chatbot.sendMessage(`How can I beat my Personal Best of ${pr}kg on ${se}?`), 300);
    }
  };

  // Calculated 1RM: manual overrides history
  const active1RM = (rmWt && rmRp) ? calc1RM(parseFloat(rmWt), parseInt(rmRp)) : history1RM;
  const delta1RM = cd.length ? cd[cd.length - 1].est1rm - cd[0].est1rm : 0;

  // Focus groups for the selected lift: split definition first, logs as fallback
  const focusLine = (() => {
    if (!se) return null;
    let exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
    if (!exDef) {
      const logEx = ul.flatMap(l => l.exercises || []).find(e => e.name === se);
      if (logEx) exDef = logEx; // log entries also have primaryMuscle/secondaryMuscles
    }
    const pM = exDef?.primaryMuscle || exDef?.muscle || null;
    const sM = exDef?.secondaryMuscles || [];
    if (!pM && sM.length === 0) return 'General';
    return [pM, ...sM].filter(Boolean).join(' · ');
  })();

  // Weekly/monthly summaries
  const weeklySummary = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 86400000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 86400000);
    const thisWeek = ul.filter(l => new Date(l.date) >= weekAgo);
    const lastWeek = ul.filter(l => new Date(l.date) >= twoWeeksAgo && new Date(l.date) < weekAgo);
    const thisVol = thisWeek.reduce((s, l) => s + (l.exercises?.reduce((a, e) => a + e.sets.reduce((b, set) => b + (set.reps || 0) * (set.weight || 0), 0), 0) || 0), 0);
    const lastVol = lastWeek.reduce((s, l) => s + (l.exercises?.reduce((a, e) => a + e.sets.reduce((b, set) => b + (set.reps || 0) * (set.weight || 0), 0), 0) || 0), 0);
    const volChange = lastVol > 0 ? Math.round(((thisVol - lastVol) / lastVol) * 100) : 0;
    return { sessions: thisWeek.length, lastSessions: lastWeek.length, volume: thisVol, volChange };
  }, [ul]);

  const monthlySummary = useMemo(() => {
    const now = new Date();
    const monthAgo = new Date(now.getTime() - 30 * 86400000);
    const thisMonth = ul.filter(l => new Date(l.date) >= monthAgo);
    const avgPerWeek = (thisMonth.length / 4.3).toFixed(1);
    const totalVol = thisMonth.reduce((s, l) => s + (l.exercises?.reduce((a, e) => a + e.sets.reduce((b, set) => b + (set.reps || 0) * (set.weight || 0), 0), 0) || 0), 0);
    return { sessions: thisMonth.length, avgPerWeek, volume: totalVol };
  }, [ul]);

  const hasData = se && cd.length > 0;

  return (
    <Screen title="Progress">
      <Sec title="Filters">
        <div className="field">
          <span>Split</span>
          <select className="input" value={ss} onChange={e => { setSs(e.target.value); setSd(''); setSe(''); }}>
            {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>
        <div className="field">
          <span>Day</span>
          <select className="input" value={sd} onChange={e => { setSd(e.target.value); setSe(''); }}>
            <option value="">Any Day</option>
            {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </Sec>

      <Sec title="Estimated 1RM">
        <Hero
          main={active1RM}
          unit="KG"
          sub={(rmWt && rmRp) ? 'Calculated from your entry' : se ? 'Best estimate from your history' : 'Select a lift to sync from history'}
        />
        <div className="field">
          <span>Lift</span>
          <select className="input" value={se} onChange={e => {
            setSe(e.target.value);
            setRmWt(''); setRmRp(''); // clear manual overrides when changing exercise
          }}>
            <option value="">Select Lift</option>
            {exN.map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </div>
        <div className="field">
          <span>Weight</span>
          <input className="input" type="number" placeholder={prData ? prData.maxWeight : 'kg'} value={rmWt} onChange={e => setRmWt(e.target.value)} />
        </div>
        <div className="field">
          <span>Reps</span>
          <input className="input" type="number" placeholder={prData ? Math.round(prData.avgReps) : 'reps'} value={rmRp} onChange={e => setRmRp(e.target.value)} />
        </div>
      </Sec>

      <Sec title="Activity">
        <LedgerRow label="Sessions · 7 days" value={weeklySummary.sessions} meta={`previous 7 days · ${weeklySummary.lastSessions}`} />
        <LedgerRow
          label="Volume · 7 days"
          value={`${Math.round(weeklySummary.volume / 1000)}k kg`}
          meta={weeklySummary.volChange !== 0 ? `${weeklySummary.volChange > 0 ? '+' : ''}${weeklySummary.volChange}% vs last week` : undefined}
        />
        <LedgerRow label="Sessions · 30 days" value={monthlySummary.sessions} meta={`≈ ${monthlySummary.avgPerWeek} per week`} />
      </Sec>

      {hasData ? (<>
        <Sec title="Performance analytics">
          <Hero main={se} sub={`${cd.length} sessions logged`} />
        </Sec>

        <Sec title="Numbers">
          <LedgerRow label="1RM history max" value={`${history1RM} kg`} meta={`${delta1RM >= 0 ? '+' : ''}${delta1RM.toFixed(1)} kg vs first session`} />
          <LedgerRow
            label="Personal record"
            value={`${pr} kg`}
            meta={`Achieved ${prData?.rawDate ? new Date(prData.rawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'unknown'}${allTimePR && allTimePR.weight > pr ? ` · all-time ${allTimePR.weight} kg${allTimePR.isBodyweight ? ` (${allTimePR.reps} reps)` : ''}` : ''}`}
          />
          <LedgerRow label="Total sessions" value={cd.length} />
        </Sec>

        <Sec title="Volume trend">
          {cd.length >= 2 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={cd} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_EMBER} stopOpacity={0.28} />
                    <stop offset="95%" stopColor={CHART_EMBER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" {...chartAxis} dy={8} />
                <YAxis {...chartAxis} width={36} dx={-4} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="volume" name="Volume" stroke={CHART_EMBER} strokeWidth={2} fill="url(#vol-gradient)" dot={{ fill: CHART_EMBER, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4, fill: CHART_EMBER, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Note>Not enough data — log {se} on at least two days to see your volume trend.</Note>
          )}
        </Sec>

        <div ref={pbCardRef}>
          <Sec title="Personal best">
            <Hero main={pr} unit="KG" sub={se} />
            <LedgerRow label="At the record" value={prData ? `${prData.avgReps} avg reps · ${prData.sets} sets` : 'No sets data'} />
            <LedgerRow label="Date achieved" value={prData?.rawDate ? new Date(prData.rawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Unknown'} />
            <div className="row-gap">
              <TLink onClick={sharePB}>Share this PB</TLink>
              {pr > 0 && <TLink onClick={askForge}>Ask FORGE how to beat this PR</TLink>}
            </div>
          </Sec>
        </div>

        <Sec title="Focus groups">
          <p className="meta">{focusLine}</p>
        </Sec>

        <Sec title="Session log">
          {[...cd].reverse().slice(0, 5).map((entry, idx) => (
            <LedgerRow
              key={idx}
              label={entry.dayName}
              meta={`${new Date(entry.rawDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} · ${entry.sets} sets · ${entry.volume.toLocaleString()} kg`}
            >
              <div style={{ textAlign: 'right' }}>
                <div className="lr-val">{entry.maxWeight} × {entry.avgReps}</div>
                <div className="lr-meta">{entry.maxWeight === pr ? 'New PB' : idx === 0 ? 'Latest' : 'Session'}</div>
              </div>
            </LedgerRow>
          ))}
        </Sec>

        <Sec title="Est. 1RM over time">
          {cd.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={cd} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="cg2-est1rm" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_EMBER} stopOpacity={0.18} />
                    <stop offset="95%" stopColor={CHART_EMBER} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" {...chartAxis} dy={8} />
                <YAxis {...chartAxis} width={36} dx={-4} />
                <Tooltip {...chartTooltip} />
                <Area type="monotone" dataKey="est1rm" name="Est. 1RM" stroke={CHART_EMBER} strokeWidth={2} fill="url(#cg2-est1rm)" dot={{ fill: CHART_EMBER, r: 2.5, strokeWidth: 0 }} activeDot={{ r: 4, fill: CHART_EMBER, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <Note>Not enough data — more sessions needed for the 1RM trend.</Note>
          )}
        </Sec>

        <Sec title="Avg reps per set">
          {cd.length >= 2 ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={cd} margin={{ top: 8, right: 4, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" {...chartAxis} dy={8} />
                <YAxis {...chartAxis} width={36} dx={-4} />
                <Tooltip {...chartTooltip} />
                <Line type="monotone" dataKey="avgReps" name="Avg reps" stroke={CHART_EMBER} strokeWidth={2} dot={{ fill: CHART_EMBER, r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: CHART_EMBER, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Note>Not enough data — more sessions needed for the reps trend.</Note>
          )}
        </Sec>
      </>) : (
        <Note>{se ? 'No data yet — log workouts to see strength progression charts.' : 'Choose your lift — select a split, day and exercise above to unlock your performance analytics.'}</Note>
      )}
    </Screen>
  );
}
