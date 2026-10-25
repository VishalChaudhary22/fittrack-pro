// ─── useProgress ─────────────────────────────────────────────────────────────
// All data logic for the Progress (Workout Analytics) screen, extracted from
// the V1 ProgressPage (Kaaya Volt V-5) so both skins render the same brain.
// The V1 page is a pure consumer; Volt's Progress page consumes this too.
import { useState, useMemo, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useApp } from '../context/AppContext';
import { useScrollRestoration } from './useScrollRestoration';
import { best1RMFromSets, calc1RM } from '../../utils/calculations';
import { fmt } from '../../utils/helpers';
import { getAllTimePR } from '../../utils/exerciseHistory';

const progressFilterCache = { ss: null, sd: '', se: '' };

export function useProgress() {
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

  return {
    act,
    active1RM,
    addToast,
    allTimePR,
    cd,
    days,
    exN,
    history1RM,
    monthlySummary,
    pbCardRef,
    pr,
    prData,
    rmRp,
    rmWt,
    sd,
    se,
    setRmRp,
    setRmWt,
    setSd,
    setSdRaw,
    setSe,
    setSeRaw,
    setSs,
    setSsRaw,
    sharePB,
    split,
    splits,
    ss,
    ul,
    user,
    weeklySummary,
    workoutLogs,
  };
}
