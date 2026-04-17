import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingDown, TrendingUp, Activity } from 'lucide-react';
import BodyFatLogModal from './BodyFatLogModal';
import { ProgressOrb, ModalPortal, GlassTooltip } from './SharedComponents';
import { clamp, kgToLbs, fmt } from '../../utils/helpers';

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
  const previousBF = userBFLog.length >= 2 ? userBFLog[1] : null;
  const bfGoal = user?.bodyFatGoal || null;
  const currentPct = latestBF ? latestBF.percentage : 0;

  // BF chart data (chronological order for Recharts)
  const bfChartData = useMemo(() =>
    [...userBFLog].reverse().map(l => ({
      date: fmt(l.date),
      bf: l.percentage,
    }))
  , [userBFLog]);

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
  const bfDelta = (latestBF && previousBF) ? +(latestBF.percentage - previousBF.percentage).toFixed(1) : null;

  const trendArrow = useMemo(() => {
    if (bfDelta === null || bfDelta === undefined) return null;
    const bfUp = bfDelta > 0;
    if (!bfGoal) return { up: bfUp, color: 'var(--on-surface-dim)' };
    return bfUp
      ? { up: true, color: 'var(--error)' }
      : { up: false, color: 'var(--success)' };
  }, [bfDelta, bfGoal]);

  // ── Ring size (weight goal, shrunk 25% from 144→108) ────────────────────────
  const weightRingSize = 108;

  return (
    <>
      <div className="glass-card" style={{
        padding: 24, borderRadius: 16, border: 'none',
        position: 'relative', overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
      }}>

        {/* Subtle Glow Background */}
        <div style={{
          position: 'absolute', top: -80, right: -80,
          width: 256, height: 256,
          background: 'rgba(232, 84, 13, 0.1)',
          borderRadius: '50%', filter: 'blur(60px)',
          pointerEvents: 'none',
        }} />

        {/* ── Header (clean — no buttons or pills) ── */}
        <div style={{ position: 'relative', zIndex: 1, marginBottom: 20 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--on-surface-dim)' }}>BODY COMPOSITION</div>
          <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 2, lineHeight: 1.1 }}>ANALYSIS</div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* WEIGHT GOAL — shrunk 25%                                          */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        {user.weightGoal ? (
          <div style={{ position: 'relative', zIndex: 10 }}>
            {/* Header row: Target weight + remaining stats */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 6 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3 }}>
                  <span style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: 'clamp(1.5rem, 4vw, 2.1rem)',
                    fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1,
                    letterSpacing: '-0.03em',
                  }}>
                    {displayW(user.weightGoal)}
                  </span>
                  <span style={{
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    fontSize: 13, color: 'var(--on-surface-variant)',
                  }}>{wUnit}</span>
                </div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 10, fontWeight: 700, color: 'var(--primary)',
                  textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 3,
                }}>Target Weight</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 12, color: 'var(--on-surface)' }}>
                  <span style={{ fontWeight: 700 }}>{kgLeft}{wUnit}</span> to {isLoss ? 'lose' : 'gain'}
                </div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontSize: 10, color: 'var(--on-surface-variant)',
                }}>
                  {weeksLeft !== null ? `${weeksLeft} wks left` : '—'}
                </div>
              </div>
            </div>

            {/* Weight Goal Ring — centered */}
            <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
              <ProgressOrb progress={goalPct || 0} size={weightRingSize} label={`${goalPct || 0}%`} subLabel="Done" />
            </div>

            {/* Current / Goal text row */}
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 10, color: 'var(--on-surface-variant)',
              textTransform: 'uppercase', letterSpacing: '0.12em',
            }}>
              <span>Current: {displayW(latestWeight)}{wUnit}</span>
              <span>Goal: {displayW(user.weightGoal)}{wUnit}</span>
            </div>
          </div>
        ) : (
          <div style={{
            padding: 16, textAlign: 'center',
            background: 'var(--surface-container-highest)', borderRadius: 10,
            color: 'var(--on-surface-variant)', fontSize: 12,
          }}>
            Set a weight goal to track progress
          </div>
        )}

        {/* ── Divider (Tonal) ── */}
        <div style={{
          height: 1, width: '100%',
          background: 'var(--surface-container-lowest)',
          margin: '20px 0',
        }} />

        {/* ═══════════════════════════════════════════════════════════════════ */}
        {/* BODY FAT — current BF card + area trend chart + log button        */}
        {/* ═══════════════════════════════════════════════════════════════════ */}
        <div style={{ position: 'relative', zIndex: 10 }}>
          {/* Section title */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 14,
          }}>
            <h3 style={{
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: 15, fontWeight: 600, color: 'var(--on-surface)',
              margin: 0,
            }}>Body Fat Analysis</h3>
            <Activity size={18} color="var(--primary)" style={{ opacity: 0.7 }} />
          </div>

          {latestBF ? (
            <>
              {/* Current BF% + Previous + Goal — inline stat row */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 14,
                marginBottom: 14,
              }}>
                {/* Current */}
                <div>
                  <div style={{
                    fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em',
                    color: 'var(--on-surface-dim)', marginBottom: 2,
                    fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
                  }}>Current</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                    <span style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 'clamp(1.6rem, 4vw, 2rem)',
                      fontWeight: 700, color: 'var(--on-surface)', lineHeight: 1,
                      textShadow: '0 0 10px rgba(255, 181, 155, 0.3)',
                    }}>
                      {currentPct.toFixed(1)}
                    </span>
                    <span style={{ fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 13, color: 'var(--on-surface-variant)' }}>%</span>
                  </div>
                </div>

                {/* Trend arrow */}
                {trendArrow && (
                  <div style={{ alignSelf: 'flex-end', paddingBottom: 4 }}>
                    {trendArrow.up
                      ? <TrendingUp size={18} color={trendArrow.color} />
                      : <TrendingDown size={18} color={trendArrow.color} />
                    }
                  </div>
                )}

                {/* Previous */}
                {previousBF && (
                  <div>
                    <div style={{
                      fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em',
                      color: 'var(--on-surface-dim)', marginBottom: 2,
                      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
                    }}>Previous</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                        fontWeight: 700, color: 'var(--on-surface-variant)', opacity: 0.6, lineHeight: 1,
                      }}>
                        {previousBF.percentage.toFixed(1)}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--on-surface-dim)' }}>%</span>
                    </div>
                  </div>
                )}

                {/* Goal BF% (pushed right) */}
                {bfGoal && (
                  <div style={{ marginLeft: 'auto' }}>
                    <div style={{
                      fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em',
                      color: 'var(--on-surface-dim)', marginBottom: 2,
                      fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700,
                    }}>Goal</div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
                      <span style={{
                        fontFamily: "'Space Grotesk', sans-serif",
                        fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                        fontWeight: 700, color: 'var(--primary)', lineHeight: 1,
                      }}>
                        {bfGoal}
                      </span>
                      <span style={{ fontSize: 10, color: 'var(--primary)', opacity: 0.7 }}>%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Area Trend Chart */}
              {bfChartData.length >= 2 ? (
                <div style={{ marginBottom: 14 }}>
                  <ResponsiveContainer width="100%" height={120}>
                    <AreaChart data={bfChartData}>
                      <defs>
                        <linearGradient id="bf-area-grad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F85F1B" stopOpacity={0.18} />
                          <stop offset="95%" stopColor="#F85F1B" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--surface-container-highest)" />
                      <XAxis dataKey="date" tick={{ fill: 'var(--on-surface-dim)', fontSize: 8 }} interval="preserveStartEnd" axisLine={false} tickLine={false} />
                      <YAxis domain={['auto', 'auto']} tick={{ fill: 'var(--on-surface-dim)', fontSize: 8 }} width={30} axisLine={false} tickLine={false} />
                      <Tooltip content={<GlassTooltip />} cursor={{ fill: 'var(--surface-variant)' }} />
                      <Area type="monotone" dataKey="bf" stroke="#F85F1B" strokeWidth={2} fill="url(#bf-area-grad)" dot={{ fill: '#F85F1B', r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} name="Body Fat %" />
                      {bfGoal && (
                        <ReferenceLine y={bfGoal} stroke="rgba(248,95,27,.4)" strokeDasharray="5 5" label={{ value: 'Goal', fill: 'var(--primary)', fontSize: 9, position: 'insideTopRight' }} />
                      )}
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div style={{
                  height: 80, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--on-surface-variant)', marginBottom: 14,
                  background: 'var(--surface-container-lowest)', borderRadius: 10,
                }}>
                  <Activity size={20} color="var(--primary)" style={{ opacity: 0.6, marginBottom: 6 }} />
                  <div style={{ fontSize: 11 }}>Log for at least two days to see your trend</div>
                </div>
              )}

              {/* Log BF% Button */}
              <button
                className="btn-p"
                style={{
                  padding: '7px 13px',
                  fontSize: 10, fontWeight: 700, borderRadius: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  margin: '0 auto', width: 'fit-content'
                }}
                onClick={() => setShowModal(true)}
              >
                + LOG BODY FAT %
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{
                padding: '20px 0 14px', color: 'var(--on-surface-dim)', fontSize: 12,
              }}>
                Log your first body fat reading to start tracking
              </div>
              <button
                className="btn-p"
                style={{
                  padding: '7px 13px',
                  fontSize: 10, fontWeight: 700, borderRadius: 100,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  margin: '0 auto', width: 'fit-content'
                }}
                onClick={() => setShowModal(true)}
              >
                + LOG BODY FAT %
              </button>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <ModalPortal>
          <BodyFatLogModal open={showModal} onClose={() => setShowModal(false)} />
        </ModalPortal>
      )}
    </>
  );
}
