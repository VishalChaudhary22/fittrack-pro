import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import BodyFatLogModal from './BodyFatLogModal';
import { ProgressOrb, ModalPortal } from './SharedComponents';
import { clamp, kgToLbs } from '../../utils/helpers';

export default function BodyFatRingCard() {
  const { user, bodyFatLog, healthLogs } = useApp();
  const [showModal, setShowModal] = useState(false);

  // ── Body Fat Derived state ──────────────────────────────────────────────────
  const userBFLog = useMemo(() => 
    bodyFatLog
      .filter(e => e.userId === user?.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  , [bodyFatLog, user?.id]);

  const latestBF = userBFLog[0] || null;
  const previousBF = userBFLog[1] || null;
  const bfGoal = user?.bodyFatGoal || null;
  const startBF = userBFLog.length > 0 ? userBFLog[userBFLog.length - 1].percentage : null;
  const currentPct = latestBF ? latestBF.percentage : 0;

  // BF progress toward goal
  let bfProgress = 0;
  if (latestBF) {
    if (bfGoal && startBF && startBF !== bfGoal) {
      if (currentPct >= startBF) bfProgress = 0;
      else if (currentPct <= bfGoal) bfProgress = 100;
      else bfProgress = ((startBF - currentPct) / (startBF - bfGoal)) * 100;
    } else {
      const maxScale = user?.gender === 'female' ? 40 : 35;
      bfProgress = Math.min(100, Math.max(0, (currentPct / maxScale) * 100));
    }
  }

  // ── Weight Goal Derived State ───────────────────────────────────────────────
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const wUnit = isImpWeight ? 'lbs' : 'kg';

  const allUserLogs = useMemo(() =>
    [...healthLogs].filter(l => l.userId === user.id).sort((a, b) => new Date(a.date) - new Date(b.date))
  , [healthLogs, user.id]);

  const latestWeight = allUserLogs.length > 0 ? allUserLogs[allUserLogs.length - 1].weight : user.weight;
  const displayW = (w) => isImpWeight ? kgToLbs(w) : w;

  const goalPct = useMemo(() => {
    if (!user.weightGoal || !user.weightGoalStart) return null;
    const total = Math.abs(user.weightGoalStart - user.weightGoal);
    const done = Math.abs(user.weightGoalStart - latestWeight);
    return clamp(Math.round(done / total * 100), 0, 100);
  }, [user, latestWeight]);

  const kgLeftRaw = user.weightGoal ? Math.abs(latestWeight - user.weightGoal).toFixed(1) : null;
  const kgLeft = isImpWeight && kgLeftRaw ? kgToLbs(parseFloat(kgLeftRaw)) : kgLeftRaw;
  const isLoss = user.weightGoal && latestWeight > user.weightGoal;

  const weeksLeft = useMemo(() => {
    if (!user.goalSetDate || !user.goalWeeks) return null;
    const deadline = new Date(user.goalSetDate);
    deadline.setDate(deadline.getDate() + user.goalWeeks * 7);
    const diff = (deadline - new Date()) / 86400000 / 7;
    return Math.max(0, Math.round(diff));
  }, [user]);

  // ── BF Deltas ───────────────────────────────────────────────────────────────
  const bfDelta = latestBF && previousBF ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;

  const prevMonthLastBF = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const priorLogs = userBFLog.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() < currentYear || (d.getFullYear() === currentYear && d.getMonth() < currentMonth);
    });
    return priorLogs[0] || null;
  }, [userBFLog]);

  const bfMonthDelta = prevMonthLastBF && latestBF
    ? +(latestBF.percentage - prevMonthLastBF.percentage).toFixed(1)
    : null;

  const trendArrow = useMemo(() => {
    if (bfDelta === null || bfDelta === undefined) return null;
    const bfUp = bfDelta > 0;
    if (!bfGoal) return { up: bfUp, color: 'var(--on-surface-dim)' };
    return bfUp
      ? { up: true, color: 'var(--error)' }
      : { up: false, color: 'var(--success)' };
  }, [bfDelta, bfGoal]);

  // ── Ring parameters ─────────────────────────────────────────────────────────
  // Stitch BF ring = 192px, shrunk 25% = 144px. Both rings same size.
  const ringSize = 144;

  // BF SVG ring math (from Stitch design)
  const bfRadius = 54;
  const bfCircumference = 2 * Math.PI * bfRadius; // ~339.29
  const bfClampedProgress = clamp(bfProgress, 0, 100);
  const bfStrokeDashoffset = bfCircumference * (1 - bfClampedProgress / 100);

  return (
    <>
      <div className="glass-card" style={{
        padding: 24, borderRadius: 16, border: 'none',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}>

        {/* Subtle Glow Background (from Stitch) */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 256, height: 256,
          background: 'rgba(232, 84, 13, 0.1)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* ── Header ── */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
          position: 'relative', zIndex: 1, marginBottom: 24,
        }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>BODY COMPOSITION</div>
            <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 2, lineHeight: 1.1 }}>ANALYSIS</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            {latestBF && (
              <span style={{
                background: 'var(--primary-container)', color: 'var(--on-primary)',
                borderRadius: 14, padding: '6px 12px', fontSize: 10, fontWeight: 700,
                textAlign: 'center', lineHeight: 1.2,
              }}>
                {bfMonthDelta !== null
                  ? <>{bfMonthDelta > 0 ? '+' : ''}{bfMonthDelta}% BF THIS<br/>MONTH</>
                  : <>—% BF THIS<br/>MONTH</>
                }
              </span>
            )}
            <button className="btn-g" style={{ padding: '6px 12px', fontSize: 10, fontWeight: 700, borderRadius: 10 }} onClick={() => setShowModal(true)}>
              + LOG BF%
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* TOP HALF: Weight Goal (Stitch layout + ProgressOrb ring)          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {user.weightGoal ? (
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Header row: Target weight + remaining stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(2rem, 5vw, 2.8rem)',
                    fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}>
                    {displayW(user.weightGoal)}
                  </span>
                  <span style={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: 16, color: 'var(--on-surface-variant)',
                  }}>{wUnit}</span>
                </div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 11, fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4,
                }}>Target Weight</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 13, color: 'var(--on-surface)' }}>
                  <span style={{ fontWeight: 700 }}>{kgLeft}{wUnit}</span> to {isLoss ? 'lose' : 'gain'}
                </div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 11, color: 'var(--on-surface-variant)',
                }}>
                  {weeksLeft !== null ? `${weeksLeft} wks left` : '—'}
                </div>
              </div>
            </div>

            {/* Weight Goal Ring — centered */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
              <ProgressOrb progress={goalPct || 0} size={ringSize} label={`${goalPct || 0}%`} subLabel="Done" />
            </div>

            {/* Current / Goal text row (Stitch style) */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 10, color: 'var(--on-surface-variant)',
              textTransform: 'uppercase', letterSpacing: '0.15em',
            }}>
              <span>Current: {displayW(latestWeight)}{wUnit}</span>
              <span>Goal: {displayW(user.weightGoal)}{wUnit}</span>
            </div>
          </div>
        ) : (
          <div style={{
            padding: 20, textAlign: 'center',
            background: 'var(--surface-container-highest)', borderRadius: 10,
            color: 'var(--on-surface-variant)', fontSize: 13,
          }}>
            Set a weight goal to track progress
          </div>
        )}

        {/* ── Divider (Tonal — from Stitch) ── */}
        <div style={{
          height: 1, width: '100%',
          background: 'var(--surface-container-lowest)',
          margin: '24px 0',
        }} />

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BOTTOM HALF: Body Fat Analysis (Stitch SVG Ring, shrunk 25%)      */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {latestBF ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 24, position: 'relative', zIndex: 10, padding: '8px 0',
          }}>
            {/* Title row (Stitch style) */}
            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <h3 style={{
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: 18, fontWeight: 600, color: 'var(--on-surface)',
                margin: 0,
              }}>Body Fat Analysis</h3>
              <Activity size={22} color="var(--primary)" style={{ opacity: 0.7 }} />
            </div>

            {/* BF Ring (SVG from Stitch design) */}
            <div style={{
              position: 'relative', width: ringSize, height: ringSize,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg
                viewBox="0 0 120 120"
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}
              >
                {/* Background Ring */}
                <circle
                  cx="60" cy="60" r={bfRadius}
                  fill="none" stroke="var(--surface-container-lowest)" strokeWidth="8"
                />
                {/* Progress Ring */}
                {bfClampedProgress > 0 && (
                  <circle
                    cx="60" cy="60" r={bfRadius}
                    fill="none" stroke="url(#bf-ring-gradient)" strokeWidth="8"
                    strokeDasharray={bfCircumference}
                    strokeDashoffset={bfStrokeDashoffset}
                    strokeLinecap="round"
                    style={{
                      transform: 'rotate(-90deg)',
                      transformOrigin: '50% 50%',
                      transition: 'stroke-dashoffset 0.35s',
                    }}
                  />
                )}
                <defs>
                  <linearGradient id="bf-ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary)" />
                    <stop offset="100%" stopColor="var(--primary-container)" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Center Content (Stitch style) */}
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', textAlign: 'center', zIndex: 10, marginTop: 2,
              }}>
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(2rem, 5vw, 2.5rem)',
                  fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1,
                  textShadow: '0 0 10px rgba(255, 181, 155, 0.5)',
                }}>
                  {currentPct.toFixed(1)}<span style={{
                    fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 16,
                  }}>%</span>
                </span>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 11, color: 'var(--on-surface-variant)',
                  textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 4,
                }}>Current BF</span>
              </div>
            </div>

            {/* Stat bar: Previous | Goal | Trend (Stitch style, expanded) */}
            <div style={{
              width: '100%', display: 'flex', justifyContent: 'space-between',
              background: 'var(--surface-container-low)', borderRadius: 8, padding: 12,
            }}>
              {/* Previous */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 10, color: 'var(--on-surface-variant)',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>Previous</span>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 14, fontWeight: 600, color: 'var(--on-surface)',
                }}>
                  {previousBF ? `${previousBF.percentage.toFixed(1)}%` : '—'}
                </span>
              </div>

              {/* Goal */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 10, color: 'var(--on-surface-variant)',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>Goal</span>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 14, fontWeight: 600, color: 'var(--on-surface)',
                }}>
                  {bfGoal ? `${bfGoal}%` : '—'}
                </span>
              </div>

              {/* Trend */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 10, color: 'var(--on-surface-variant)',
                  textTransform: 'uppercase', letterSpacing: '0.15em',
                }}>Trend</span>
                <span style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 14, fontWeight: 600,
                  color: trendArrow ? trendArrow.color : 'var(--on-surface)',
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  {bfDelta !== null ? (
                    <>
                      {bfDelta > 0 ? '+' : ''}{bfDelta}%
                      {trendArrow && (trendArrow.up
                        ? <TrendingUp size={14} />
                        : <TrendingDown size={14} />
                      )}
                    </>
                  ) : '—'}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            padding: '32px 0', textAlign: 'center',
            color: 'var(--on-surface-dim)', fontSize: 14,
          }}>
            Log your first body fat reading
          </div>
        )}
      </div>

      {showModal && (
        <ModalPortal>
          <BodyFatLogModal open={showModal} onClose={() => setShowModal(false)} />
        </ModalPortal>
      )}
    </>
  );
}
