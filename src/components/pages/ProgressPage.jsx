import { useState, useMemo, useRef } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Activity, TrendingUp, Flame, Target, Award, Share2, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { useApp } from '../../context/AppContext';
import { StatCard, PageHeader, EmptyState } from '../shared/SharedComponents';
import { best1RMFromSets, calc1RM } from '../../utils/calculations';
import { fmt } from '../../utils/helpers';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';

const progressFilterCache = { ss: null, sd: '', se: '' };

export default function ProgressPage() {
  useScrollRestoration('/progress');
  const { user, workoutLogs, splits } = useApp();
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
  
  // Calculated 1RM: manual overrides history
  const active1RM = (rmWt && rmRp) ? calc1RM(parseFloat(rmWt), parseInt(rmRp)) : history1RM;

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

  return (
    <div className="pg-in">
      <PageHeader title="Workout Analytics" sub="Performance data per exercise" />

      {/* 8.8 Filter Controls Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        <select value={ss} onChange={e => { setSs(e.target.value); setSd(''); setSe(''); }} style={{ width: '100%', padding: '12px 16px', borderRadius: 16, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>
          {splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select value={sd} onChange={e => { setSd(e.target.value); setSe(''); }} style={{ width: '100%', padding: '12px 16px', borderRadius: 16, background: 'var(--surface-container-low)', border: '1px solid var(--outline-variant)', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>
          <option value="">Any Day</option>
          {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>

      {/* 8.8.5 ALWAYS VISIBLE 1RM CALCULATOR */}
      <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)', marginBottom: 32, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
         <div style={{ flex: '1 1 200px', paddingRight: 24, borderRight: '1px solid var(--surface-container-highest)' }}>
           <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 12 }}>ESTIMATED 1RM CALCULATOR</div>
           <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span className="display-lg" style={{ color: 'var(--primary)' }}>{active1RM}</span>
              <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface-variant)' }}>KG</span>
           </div>
         </div>
         <div style={{ flex: '2 1 300px', display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 150 }}>
              <label style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Lift (History Sync)</label>
              <select value={se} onChange={e => { 
                setSe(e.target.value); 
                setRmWt(''); setRmRp(''); // clear manual overrides when changing exercise
              }} style={{ width: '100%', padding: '12px 16px', borderRadius: 16, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>
                <option value="">Select Lift</option>
                {exN.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 90 }}>
              <label style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Weight</label>
              <input type="number" placeholder={prData ? prData.maxWeight : "kg"} value={rmWt} onChange={e => setRmWt(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 16, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', width: 90 }}>
              <label style={{ fontSize: 10, color: 'var(--on-surface-variant)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>Reps</label>
              <input type="number" placeholder={prData ? Math.round(prData.avgReps) : "reps"} value={rmRp} onChange={e => setRmRp(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 16, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
            </div>
         </div>
      </div>

      {/* 8.9 Weekly Summary Context Strip */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginBottom: 32, alignItems: 'baseline' }}>
        <div>
          <span className="label-md" style={{ color: 'var(--on-surface-dim)', marginRight: 8 }}>This Week</span>
          <span className="headline-md" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{weeklySummary.sessions}</span>
          <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginLeft: 4 }}>sessions</span>
        </div>
        <div>
          <span className="label-md" style={{ color: 'var(--on-surface-dim)', marginRight: 8 }}>Vol</span>
          <span className="headline-md" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{Math.round(weeklySummary.volume / 1000)}k</span>
          <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginLeft: 4 }}>kg</span>
        </div>
        {weeklySummary.volChange !== 0 && (
          <div style={{ fontSize: 12, fontWeight: 700, color: weeklySummary.volChange > 0 ? 'var(--success)' : 'var(--danger)' }}>
            {weeklySummary.volChange > 0 ? '+' : ''}{weeklySummary.volChange}% vs last week
          </div>
        )}
        <div style={{ width: 1, height: 16, background: 'var(--surface-container-highest)', alignSelf: 'center' }}></div>
        <div>
          <span className="label-md" style={{ color: 'var(--on-surface-dim)', marginRight: 8 }}>Monthly</span>
          <span className="headline-md" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>{monthlySummary.sessions}</span>
          <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginLeft: 4 }}>sessions</span>
        </div>
        <div>
          <span className="headline-md" style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>~{monthlySummary.avgPerWeek}</span>
          <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginLeft: 4 }}>/week avg</span>
        </div>
      </div>

      {se && cd.length > 0 ? (<>
        {/* 8.2 Hero Exercise Title */}
        <section style={{ marginBottom: 32 }}>
          <span className="label-md" style={{ color: 'var(--primary)', display: 'block', marginBottom: 8 }}>
            Performance Analytics
          </span>
          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            fontWeight: 700,
            letterSpacing: '-0.04em',
            lineHeight: 1,
            color: 'var(--on-surface)',
            textTransform: 'uppercase',
          }}>
            {se.includes(' ')
              ? <>{se.split(' ').slice(0, Math.ceil(se.split(' ').length / 2)).join(' ')}
                  <br />
                  <span style={{ color: 'var(--primary-container)' }}>
                    {se.split(' ').slice(Math.ceil(se.split(' ').length / 2)).join(' ')}
                  </span>
                </>
              : se
            }
          </h2>
        </section>

        {/* 8.3 Bento Stat Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          {/* Card 1 - History 1RM Trend (Replacement for old static 1RM card) */}
          <div className="card" style={{ borderLeft: '4px solid var(--primary)', padding: 24, background: 'var(--surface-container-low)' }}>
             <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 12 }}>1RM HISTORY MAX</div>
             <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span className="display-lg" style={{ color: 'var(--on-surface)' }}>{history1RM}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface-variant)' }}>KG</span>
             </div>
             {cd.length > 0 && (
               <div style={{ fontSize: 13, fontWeight: 600, color: cd[cd.length - 1].est1rm - cd[0].est1rm >= 0 ? 'var(--success)' : 'var(--danger)' }}>
                 {cd[cd.length - 1].est1rm - cd[0].est1rm >= 0 ? '▲ +' : '▼ '}{(cd[cd.length - 1].est1rm - cd[0].est1rm).toFixed(1)} kg vs first session
               </div>
             )}
          </div>
          {/* Card 2 - Personal Record */}
          <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)' }}>
             <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 12 }}>PERSONAL RECORD</div>
             <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                <span className="display-lg" style={{ color: 'var(--on-surface)' }}>{pr}</span>
                <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface-variant)' }}>KG</span>
             </div>
             <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 500 }}>
               Achieved: {cd.length && cd.find(d => d.maxWeight === pr)?.rawDate ? new Date(cd.find(d => d.maxWeight === pr)?.rawDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Unknown'}
             </div>
          </div>
          {/* Card 3 - Total Sessions */}
          <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)' }}>
             <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 16 }}>TOTAL SESSIONS</div>
             <span className="display-lg" style={{ color: 'var(--on-surface)' }}>{cd.length}</span>
          </div>
        </div>
        {/* 8.4 Volume Trend Hero Chart */}
        <section className="card" style={{ padding: 32, background: 'var(--surface-container-low)', marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
            <div>
              <h3 className="headline-md" style={{ color: 'var(--on-surface)', display: 'flex', alignItems: 'center', gap: 8 }}>
                VOLUME TREND
              </h3>
              <p style={{ color: 'var(--on-surface-variant)', fontSize: 13, marginTop: 4 }}>Total load lifted per session</p>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ background: 'var(--surface-container-highest)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700, color: 'var(--on-surface)' }}>1M</span>
              <span style={{ color: 'var(--on-surface-variant)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>3M</span>
              <span style={{ color: 'var(--on-surface-variant)', borderRadius: 8, padding: '4px 12px', fontSize: 12, fontWeight: 700 }}>6M</span>
            </div>
          </div>
          {cd.length >= 2 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={cd}>
                <defs>
                  <linearGradient id="vol-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="var(--primary-container)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--primary-container)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
                <YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 11, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} />
                <Tooltip cursor={false} contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} />
                <Area type="monotone" dataKey="volume" stroke="var(--primary-container)" strokeWidth={2.5} fill="url(#vol-gradient)" dot={{ fill: 'var(--primary)', r: 3, strokeWidth: 0 }} activeDot={{ r: 5, fill: 'var(--primary)', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 260, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
               <Activity size={32} color="var(--primary)" style={{ opacity: 0.8, marginBottom: 12, filter: 'drop-shadow(var(--glow-primary))' }} />
               <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>Insufficient Data</div>
               <div style={{ fontSize: 12, marginTop: 4, maxWidth: 220, textAlign: 'center' }}>Log {se} for at least two days to see your volume trend.</div>
            </div>
          )}
        </section>

        {/* 8.5 & 8.6 Stacked Layout */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 32 }}>
          
          {/* Left Column: PB Card + Focus Groups */}
          <div style={{ flex: '1 1 350px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* 8.5 PB Glow Card */}
            <div ref={pbCardRef} className="card" style={{ padding: 32, background: 'var(--surface-container-low)', boxShadow: 'var(--glow-primary)', border: '1px solid rgba(255, 181, 155, 0.20)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: 16, right: 16, width: 56, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-highest)', borderRadius: '12px 12px 0 0', borderBottom: '4px solid var(--surface-container)', color: 'var(--on-surface-variant)' }}>
                <Award size={36} color="var(--on-surface-dim)" />
              </div>
              <div className="label-md" style={{ color: 'var(--primary)', letterSpacing: '0.2em', marginBottom: 24 }}>Personal Best • {se}</div>
              <div className="display-lg" style={{ color: 'var(--on-surface)' }}>{pr}</div>
              <div style={{ fontSize: 14, color: 'var(--on-surface-variant)', marginTop: 8, marginBottom: 32 }}>
                {cd.find(d => d.maxWeight === pr) ? `${cd.find(d => d.maxWeight === pr).avgReps} avg reps · ${cd.find(d => d.maxWeight === pr).sets} sets` : 'No sets data'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="label-md" style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginBottom: 4 }}>Date Achieved</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--on-surface)' }}>
                    {cd.find(d => d.maxWeight === pr)?.rawDate ? new Date(cd.find(d => d.maxWeight === pr).rawDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Unknown'}
                  </div>
                </div>
                <button onClick={sharePB} style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(255, 181, 155, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', cursor: 'pointer', border: 'none', transition: 'all 0.2s' }} className="active:scale-95">
                  <Share2 size={20} color="currentColor" />
                </button>
              </div>
            </div>

            {/* 8.5 Focus Groups */}
            <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)' }}>
              <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 16 }}>Focus Groups</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {(() => {
                  // Try split definition first
                  let exDef = split?.days.flatMap(d => d.exercises).find(e => e.name === se);
                  
                  // Fallback: scan workout logs for primaryMuscle data
                  if (!exDef) {
                    const logEx = ul.flatMap(l => l.exercises || []).find(e => e.name === se);
                    if (logEx) exDef = logEx; // log entries also have primaryMuscle/secondaryMuscles
                  }
                  
                  const pM = exDef?.primaryMuscle || exDef?.muscle || null;
                  const sM = exDef?.secondaryMuscles || [];
                  if (!pM && sM.length === 0) return <span style={{ background: 'var(--surface-container-highest)', borderRadius: 24, fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 12px' }}>General</span>;
                  return (
                    <>
                      {pM && <span style={{ background: 'var(--surface-container-highest)', borderRadius: 24, fontSize: 10, fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 12px' }}>{pM}</span>}
                      {sM.map(m => <span key={m} style={{ background: 'var(--surface-container-highest)', borderRadius: 24, fontSize: 10, fontWeight: 700, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '4px 12px' }}>{m}</span>)}
                    </>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* 8.6 Recent Sessions Log Column */}
          <div style={{ flex: '1 1 500px', display: 'flex', flexDirection: 'column' }}>
            <div className="card" style={{ padding: 24, background: 'var(--surface-container-low)', height: '100%' }}>
              <div className="label-md" style={{ color: 'var(--on-surface-dim)', marginBottom: 24 }}>Session Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {[...cd].reverse().slice(0, 5).map((entry, idx) => (
                  <div key={idx} className="cascade-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderRadius: 16, background: 'var(--surface-container)', transition: 'background 0.2s var(--ease-smooth)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ width: 48, height: 48, background: 'var(--surface-container-highest)', borderRadius: 12, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', fontWeight: 600 }}>{new Date(entry.rawDate).toLocaleDateString('en-US', { month: 'short' })}</span>
                        <span style={{ fontSize: 18, color: 'var(--on-surface)', fontWeight: 700, lineHeight: 1 }}>{new Date(entry.rawDate).getDate()}</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 2 }}>{entry.dayName}</div>
                        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{entry.sets} sets · {entry.volume.toLocaleString()} kg volume</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div className="headline-md" style={{ color: 'var(--on-surface)', fontSize: '1.25rem', marginBottom: 2 }}>{entry.maxWeight} × {entry.avgReps}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: entry.maxWeight === pr ? 'var(--primary)' : idx === 0 ? 'var(--success)' : 'var(--on-surface-variant)' }}>
                        {entry.maxWeight === pr ? 'New PB' : idx === 0 ? 'Latest' : 'Session'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 8.7 Secondary Charts Section */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {[{ title: 'Est. 1RM over time', key: 'est1rm', type: 'area' }, { title: 'Avg Reps/Set', key: 'avgReps', type: 'line' }].map(ch => (
            <div key={ch.key} className="card" style={{ padding: 24, border: 'none', background: 'var(--surface-container-low)' }}>
              <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={14} color="var(--primary)" /> {ch.title}
              </div>
              {cd.length >= 2 ? (
                <ResponsiveContainer width="100%" height={160}>
                  {ch.type === 'area' ? (
                    <AreaChart data={cd}>
                      <defs>
                        <linearGradient id={`cg2-${ch.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="var(--primary)" stopOpacity={.18} />
                          <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} />
                      <Area type="monotone" dataKey={ch.key} stroke="var(--primary)" strokeWidth={2} fill={`url(#cg2-${ch.key})`} dot={{ fill: 'var(--primary)', r: 3, strokeWidth: 0, stroke: 'var(--surface-container-low)' }} activeDot={{ r: 5, strokeWidth: 0 }} />
                    </AreaChart>
                  ) : (
                    <LineChart data={cd}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} />
                      <YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} />
                      <Tooltip contentStyle={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', border: 'none', borderRadius: 12, fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} />
                      <Line type="monotone" dataKey={ch.key} stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 3, stroke: 'var(--surface-container-low)' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              ) : (
                <div style={{ height: 160, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--on-surface-variant)' }}>
                   <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface-variant)' }}>Insufficient Data</div>
                   <div style={{ fontSize: 11, marginTop: 4, textAlign: 'center' }}>More data needed for {ch.title.toLowerCase()}</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </>) : (
        <EmptyState Icon={TrendingUp} title={se ? 'No data yet' : 'Choose Your Lift'} message={se ? 'Log workouts to see strength progression charts' : 'Select split, day, and exercise above to unlock your performance analytics'} />
      )}
    </div>
  );
}
