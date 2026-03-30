import { useState, useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Activity, TrendingUp, Flame, Target } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, PageHeader, EmptyState } from '../shared/SharedComponents';
import { best1RMFromSets, calc1RM } from '../../utils/calculations';
import { fmt } from '../../utils/helpers';

export default function ProgressPage() {
  const { user, workoutLogs, splits } = useApp();
  const act = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [ss, setSs] = useState(act?.id || splits[0]?.id);
  const [sd, setSd] = useState('');
  const [se, setSe] = useState('');
  const split = splits.find(s => s.id === ss);
  const days = split?.days.filter(d => d.type !== 'rest') || [];
  const ul = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');

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
      return { date: fmt(log.date), maxWeight: mx, volume: Math.round(vol), avgReps: ar, sets: ex.sets.length, est1rm };
    }).filter(Boolean);
  }, [se, sd, ul]);
  const pr = cd.length ? Math.max(...cd.map(d => d.maxWeight)) : 0;
  const est1rm = cd.length ? Math.max(...cd.map(d => d.est1rm)) : 0;

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
      <PageHeader title="Progress Charts" sub="Track your strength gains" />

      {/* Weekly / Monthly Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: '20px', border: 'none', background: 'var(--surface-container-low)' }}>
          <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '.5px' }}>This Week</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div><div className="headline-lg" style={{ color: 'var(--primary)' }}>{weeklySummary.sessions}</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>sessions</div></div>
            <div><div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{Math.round(weeklySummary.volume / 1000)}k</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>kg volume</div></div>
          </div>
          {weeklySummary.volChange !== 0 && <div className="tonal-break" style={{ marginTop: 16, padding: '8px 12px', borderRadius: 8, background: 'var(--surface-container-highest)', display: 'inline-block', fontSize: 12, color: weeklySummary.volChange > 0 ? 'var(--success)' : 'var(--danger)', fontWeight: 700 }}>{weeklySummary.volChange > 0 ? '▲' : '▼'} {Math.abs(weeklySummary.volChange)}% vs last week</div>}
          {weeklySummary.sessions !== weeklySummary.lastSessions && <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginTop: 8, fontWeight: 600 }}>Last week: {weeklySummary.lastSessions} sessions</div>}
        </div>
        <div className="card" style={{ padding: '20px', border: 'none', background: 'var(--surface-container-low)' }}>
          <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 16, letterSpacing: '.5px' }}>This Month</div>
          <div style={{ display: 'flex', gap: 24 }}>
            <div><div className="headline-lg" style={{ color: 'var(--primary)' }}>{monthlySummary.sessions}</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>sessions</div></div>
            <div><div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{monthlySummary.avgPerWeek}</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>avg/week</div></div>
            <div><div className="headline-lg" style={{ color: 'var(--on-surface)' }}>{Math.round(monthlySummary.volume / 1000)}k</div><div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 600 }}>total vol</div></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
        <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Split</label><select value={ss} onChange={e => { setSs(e.target.value); setSd(''); setSe(''); }} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>{splits.filter(s => !s.comingSoon).map(s => <option key={s.id} value={s.id}>{s.name}</option>)}</select></div>
        <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Day</label><select value={sd} onChange={e => { setSd(e.target.value); setSe(''); }} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}><option value="">All Days</option>{days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
        <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Exercise</label><select value={se} onChange={e => setSe(e.target.value)} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}><option value="">— Select —</option>{exN.map(n => <option key={n} value={n}>{n}</option>)}</select></div>
      </div>

      {se && cd.length > 0 ? (<>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 12, marginBottom: 20 }}>
          <StatCard label="Personal Record" value={pr} unit="kg" Icon={Trophy} />
          <StatCard label="Est. 1RM" value={est1rm} unit="kg" Icon={Target} badge="Epley" />
          <StatCard label="Sessions" value={cd.length} unit="" Icon={Activity} />
          {cd.length >= 2 && <StatCard label="Progress" value={`+${(cd[cd.length - 1].maxWeight - cd[0].maxWeight).toFixed(1)}`} unit="kg" Icon={TrendingUp} />}
        </div>
        <div className="headline-md" style={{ marginBottom: 16, color: 'var(--primary)' }}>{se}</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {[{ title: 'Max Weight (kg)', key: 'maxWeight', type: 'area' }, { title: 'Volume (reps × kg)', key: 'volume', type: 'bar' }, { title: 'Avg Reps/Set', key: 'avgReps', type: 'line' }, { title: 'Est. 1RM (kg)', key: 'est1rm', type: 'area' }].map(ch => (
            <div key={ch.key} className="card stripe" style={{ padding: 20, border: 'none' }}>
              <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={14} color="var(--primary)" /> {ch.title}
              </div>
              <ResponsiveContainer width="100%" height={180}>
                {ch.type === 'area' ? (<AreaChart data={cd}><defs><linearGradient id={`cg-${ch.key}`} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--primary)" stopOpacity={.18} /><stop offset="95%" stopColor="var(--primary)" stopOpacity={0} /></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} /><XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} /><YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} /><Tooltip contentStyle={{ background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, boxShadow: 'var(--shadow-md)', fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} /><Area type="monotone" dataKey={ch.key} stroke="var(--primary)" strokeWidth={2} fill={`url(#cg-${ch.key})`} dot={{ fill: 'var(--primary)', r: 3, strokeWidth: 0, stroke: 'var(--surface-container-low)' }} activeDot={{ r: 5, strokeWidth: 0 }} /></AreaChart>)
                  : ch.type === 'bar' ? (<BarChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} /><XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} /><YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} /><Tooltip contentStyle={{ background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, boxShadow: 'var(--shadow-md)', fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} cursor={{ fill: 'var(--surface-container-lowest)' }} itemStyle={{ color: 'var(--primary)' }} /><Bar dataKey={ch.key} fill="var(--primary)" radius={[6, 6, 0, 0]} fillOpacity={.9} /></BarChart>)
                    : (<LineChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-lowest)" vertical={false} /><XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dy={10} /><YAxis tick={{ fill: 'var(--on-surface-dim)', fontSize: 10, fontWeight: 600 }} tickLine={false} axisLine={false} dx={-10} /><Tooltip contentStyle={{ background: 'var(--surface-container-highest)', border: 'none', borderRadius: 12, boxShadow: 'var(--shadow-md)', fontSize: 12, color: 'var(--on-surface)', fontWeight: 600 }} itemStyle={{ color: 'var(--primary)' }} /><Line type="monotone" dataKey={ch.key} stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 3, stroke: 'var(--surface-container-low)' }} activeDot={{ r: 6, strokeWidth: 0 }} /></LineChart>)}
              </ResponsiveContainer>
            </div>
          ))}
        </div>
      </>) : (
        <EmptyState Icon={TrendingUp} title={se ? 'No data yet' : 'Select an exercise'} message="Log workouts to see strength progression charts" />
      )}
    </div>
  );
}
