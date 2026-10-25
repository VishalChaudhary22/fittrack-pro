import { Shield, Trophy, Sparkles, TrendingUp, Minus, Award, Calendar, Users, Bot, ChevronLeft, ChevronRight } from 'lucide-react';
import BodyMapSVG from '../../v1/shared/BodyMapSVG';
import AvatarInitials from '../../v1/shared/AvatarInitials';
import ErrorBoundary from '../../v1/shared/ErrorBoundary';
import PlayerDetailModal from '../../v1/shared/PlayerDetailModal';
import { MUSCLE_GROUPS, RANK_TIERS, getRank, getOverallRank } from '../../../data/muscleData';
import { MONTHLY_BENCHMARKS } from '../../../data/rankBenchmarks';
import { getCurrentMonth } from '../../../utils/xpCacheSync';
import { useOlympus } from '../../../core/hooks/useOlympus';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Olympus League (V-5) ───────────────────────────────────────
// Same brain as V1's MuscleMapPage (useOlympus — leaderboard fetch + realtime
// refresh live in the hook, so both skins share one subscription), Volt
// presentation. Rank colors stay semantic (they ARE the game's language).
// The body map reuses V1's BodyMapSVG canvas composite in its native
// colors, exactly like the workout-complete screen.
// PlayerDetailModal is V1's shared component (Volt skin = V-7 popup pack).

function VoltRankBadge({ rank, size = 'md' }) {
  const sz = size === 'sm' ? { fs: 8.5, px: 7, py: 3, icon: 10 } : size === 'lg' ? { fs: 12, px: 12, py: 5, icon: 14 } : { fs: 10, px: 10, py: 4, icon: 12 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: `${sz.py}px ${sz.px}px`, borderRadius: 7,
      background: rank.bg, border: `1.5px solid ${rank.color}`,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: sz.fs, fontWeight: 700, color: rank.color,
      textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap',
    }}>
      <Shield size={sz.icon} /> {rank.name}
    </span>
  );
}

function VoltMuscleCard({ muscle, xp }) {
  const rank = getRank(xp);
  return (
    <VoltBlock quiet style={{ display: 'flex', alignItems: 'center', gap: 15, padding: '15px 17px' }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12, flexShrink: 0,
        background: rank.bg, border: '2px solid var(--v-edge)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Shield size={20} color={rank.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ fontSize: 15, fontWeight: 900 }}>{muscle.label}</div>
          <VoltRankBadge rank={rank} size="sm" />
        </div>
        <div style={{ height: 9, borderRadius: 5, border: '2px solid var(--v-edge)', overflow: 'hidden' }}>
          <div style={{ height: '100%', background: rank.color, width: `${rank.progress * 100}%`, transition: 'width 600ms cubic-bezier(0.23, 1, 0.32, 1)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, marginTop: 6 }}>
          <span style={{ color: rank.color }}>{Math.round(xp).toLocaleString()} XP</span>
          <span style={{ color: 'var(--v-dim)' }}>
            {rank.progress < 1 ? `Next: ${Math.round(rank.nextXP).toLocaleString()} XP` : <span style={{ color: rank.color }}>✓ MAX TIER</span>}
          </span>
        </div>
      </div>
    </VoltBlock>
  );
}

// BodyMapSVG in its native colors — identical to the map on the workout-
// complete screen. (A hue-rotate re-light was tried in V-5 and rejected by
// Vishal on sight 2026-10-26: it turned highlights purple and the base
// olive. The Lab's body scans keep their re-lit JPGs — different asset.)
function RelitBodyMap({ muscleXP, gender }) {
  return (
    <ErrorBoundary>
      <BodyMapSVG muscleXP={muscleXP} gender={gender} />
    </ErrorBoundary>
  );
}

const fmtK = (xp) => (xp >= 1000 ? `${(xp / 1000).toFixed(1)}K` : `${Math.round(xp)}`);

export default function MuscleMapPage({ chatbot }) {
  const {
    user, monthlyRankHistory, activeTab, setActiveTab, selectedPlayer, setSelectedPlayer,
    filter, setFilter, muscleFilter, setMuscleFilter, filterOpen, setFilterOpen, filterRef,
    selectedMonth, setSelectedMonth, leaderboardData, leaderboardLoading, leaderboardError,
    setLeaderboardError, loadLeaderboard, muscleXP, overall, filteredLeaderboard, podium,
    myRank, topPercent, filtered, filters, daysInMonth, thisWeekDays, sortedMuscles,
    weakestMuscle, benchmark, benchmarkPct, bestMonth, tabs,
  } = useOlympus();

  const monthShift = (delta) => {
    const [yr, mo] = selectedMonth.split('-').map(Number);
    const d = new Date(yr, mo - 1 + delta, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };
  const monthLabel = (() => {
    const [yr, mo] = selectedMonth.split('-').map(Number);
    return new Date(yr, mo - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  })();
  const isCurrentMonth = selectedMonth === getCurrentMonth();

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>Your monthly strength league — ascend Olympus</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Olympus League</h1>
      </header>

      {/* Standing banner */}
      {activeTab === 'leaderboard' && (
        <VoltBlock hero className="v-rise">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
            <div>
              <VoltLabel volt>Olympus Standing</VoltLabel>
              <div className="v-num" style={{ fontSize: 27, lineHeight: 1.15, margin: '7px 0 5px' }}>
                {leaderboardLoading
                  ? 'Fetching your rank…'
                  : myRank === undefined
                    ? 'Syncing to leaderboard…'
                    : myRank === 1
                      ? 'You are #1! 🏆'
                      : topPercent <= 50
                        ? `You are in the top ${topPercent}%`
                        : `You are rank #${myRank}`}
              </div>
              <div style={{ fontSize: 13, color: 'var(--v-dim)' }}>
                {overall.progress < 1
                  ? `${Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to reach the next tier`
                  : '✦ Max tier reached'}
              </div>
            </div>
            <div style={{ width: 52, height: 52, borderRadius: '50%', flexShrink: 0, background: 'var(--v-volt)', border: '2.5px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={26} color="#141416" />
            </div>
          </div>
        </VoltBlock>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 999, padding: 4, gap: 4, width: '100%', maxWidth: 430 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => setActiveTab(t.key)}
              style={{
                flex: 1, padding: '10px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: "'Archivo', sans-serif", fontSize: 13.5, fontWeight: 800,
                background: activeTab === t.key ? 'var(--v-volt)' : 'transparent',
                color: activeTab === t.key ? '#141416' : 'var(--v-dim)',
                transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Month navigator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <button type="button" aria-label="Previous month" onClick={() => monthShift(-1)} className="v-press" style={{ background: 'var(--v-panel)', border: '2px solid var(--v-edge)', borderRadius: 10, cursor: 'pointer', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-ink)' }}>
          <ChevronLeft size={17} />
        </button>
        <div style={{ fontWeight: 800, fontSize: 14.5, minWidth: 168, textAlign: 'center', color: isCurrentMonth ? 'var(--v-volt-text)' : 'var(--v-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          {monthLabel}
          {isCurrentMonth && (
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, color: '#141416', background: 'var(--v-volt)', padding: '2.5px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Live</span>
          )}
        </div>
        <button type="button" aria-label="Next month" onClick={() => monthShift(1)} disabled={isCurrentMonth} className="v-press" style={{ background: 'var(--v-panel)', border: '2px solid var(--v-edge)', borderRadius: 10, width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-ink)', opacity: isCurrentMonth ? 0.3 : 1, cursor: isCurrentMonth ? 'default' : 'pointer' }}>
          <ChevronRight size={17} />
        </button>
      </div>

      {/* ── Leaderboard tab ── */}
      {activeTab === 'leaderboard' && (
        <>
          {/* Podium — visual order [2nd, 1st, 3rd] */}
          <section style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 14, padding: '26px 4px 0' }}>
            {[podium[1], podium[0], podium[2]].filter(Boolean).map((player, slotIndex) => {
              const isCenter = slotIndex === 1;
              const medalColor = player.rank === 1 ? 'var(--v-volt)' : player.rank === 2 ? '#8FA3B8' : '#CD7F32';
              const rankLabel = player.rank === 1 ? '1st' : player.rank === 2 ? '2nd' : '3rd';
              const podiumXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);
              return (
                <div key={player.id} onClick={() => setSelectedPlayer(player)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, paddingBottom: isCenter ? 14 : 0, cursor: 'pointer', minWidth: 0 }}>
                  <div style={{ position: 'relative', marginBottom: isCenter ? 15 : 11 }}>
                    {isCenter && (
                      <div style={{ position: 'absolute', top: -27, left: '50%', transform: 'translateX(-50%)' }}>
                        <Trophy size={23} color="#CD7F32" />
                      </div>
                    )}
                    <div className="v-num" style={{
                      width: isCenter ? 70 : 54, height: isCenter ? 70 : 54, borderRadius: '50%',
                      border: `${isCenter ? 3.5 : 2.5}px solid ${medalColor}`, background: 'var(--v-panel)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isCenter ? 21 : 16, color: medalColor, position: 'relative', zIndex: 1,
                    }}>
                      {player.rank}
                    </div>
                    <div style={{
                      position: 'absolute', bottom: -9, left: '50%', transform: 'translateX(-50%)',
                      padding: '2px 9px', borderRadius: 999, fontSize: 9.5, fontWeight: 800,
                      fontFamily: "'JetBrains Mono', monospace", textTransform: 'uppercase', whiteSpace: 'nowrap',
                      background: isCenter ? 'var(--v-volt)' : 'var(--v-panel)', color: isCenter ? '#141416' : medalColor,
                      border: isCenter ? '2px solid var(--v-edge)' : `1.5px solid ${medalColor}`, zIndex: 10,
                    }}>
                      {rankLabel}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 12, marginTop: 5, maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{player.name}</div>
                  <div className="v-num" style={{ fontSize: isCenter ? 13 : 11, color: medalColor, marginTop: 2 }}>
                    {fmtK(podiumXP)} XP
                  </div>
                </div>
              );
            })}
          </section>

          {/* List header + muscle filter */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px', position: 'relative', zIndex: 10 }}>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--v-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Rank &amp; Athlete</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--v-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {muscleFilter === 'all' ? 'Total XP' : 'Muscle XP'}
              </span>
              <div ref={filterRef} style={{ position: 'relative' }}>
                <button
                  type="button"
                  onClick={() => setFilterOpen(!filterOpen)}
                  style={{
                    padding: '7px 12px', borderRadius: 999, cursor: 'pointer',
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700,
                    border: '2px solid var(--v-edge)',
                    background: muscleFilter === 'all' ? 'var(--v-panel)' : 'var(--v-volt)',
                    color: muscleFilter === 'all' ? 'var(--v-ink)' : '#141416',
                  }}
                >
                  {muscleFilter === 'all' ? 'All Muscles' : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label} ▾
                </button>
                {filterOpen && (
                  <div className="v-pop" style={{ position: 'absolute', top: '100%', right: 0, marginTop: 8, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 15, boxShadow: '4px 4px 0 var(--v-shadow)', padding: 7, minWidth: 168, zIndex: 50 }}>
                    <div
                      onClick={() => { setMuscleFilter('all'); setFilterOpen(false); }}
                      style={{ padding: '9px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', color: muscleFilter === 'all' ? 'var(--v-volt-text)' : 'var(--v-ink)', borderRadius: 9, background: muscleFilter === 'all' ? 'var(--v-canvas)' : 'transparent' }}
                    >
                      All Muscles
                    </div>
                    {MUSCLE_GROUPS.map(m => (
                      <div
                        key={m.key}
                        onClick={() => { setMuscleFilter(m.key); setFilterOpen(false); }}
                        style={{ padding: '9px 12px', fontSize: 12.5, fontWeight: 700, cursor: 'pointer', color: muscleFilter === m.key ? 'var(--v-volt-text)' : 'var(--v-ink)', borderRadius: 9, background: muscleFilter === m.key ? 'var(--v-canvas)' : 'transparent' }}
                      >
                        {m.label}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Loading */}
          {leaderboardLoading && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ height: 70, borderRadius: 15, background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', animation: 'v-dot 1.4s ease-in-out infinite' }} />
              ))}
            </div>
          )}

          {/* Error */}
          {leaderboardError && !leaderboardLoading && (
            <VoltBlock style={{ textAlign: 'center', padding: 30 }}>
              <p style={{ fontSize: 13.5, color: 'var(--v-dim)', margin: '0 0 16px' }}>{leaderboardError}</p>
              <VoltPill ghost small onClick={() => { setLeaderboardError(null); loadLeaderboard(); }}>Retry</VoltPill>
            </VoltBlock>
          )}

          {/* Ranked list */}
          {!leaderboardLoading && !leaderboardError && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {filteredLeaderboard.map(player => {
                  const rowXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);
                  const isZero = rowXP === 0;
                  return (
                    <div
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      style={{
                        padding: '11px 15px', borderRadius: 15, background: 'var(--v-panel)',
                        border: player.isMe ? '2.5px solid var(--v-volt)' : '2px solid var(--v-edge-quiet)',
                        display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', position: 'relative', overflow: 'hidden',
                        opacity: isZero && !player.isMe ? 0.5 : 1,
                      }}
                    >
                      {player.isMe && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--v-volt)' }} />}
                      <div className="v-num" style={{ width: 24, textAlign: 'center', fontSize: 16, color: player.isMe ? 'var(--v-volt-text)' : 'var(--v-dim)', flexShrink: 0 }}>
                        {player.rank}
                      </div>
                      <AvatarInitials initials={player.initials} color={player.color} size={40} borderWidth={1} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</div>
                          {player.isMe && (
                            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, color: '#141416', background: 'var(--v-volt)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>MVP</span>
                          )}
                        </div>
                        <div style={{ fontSize: 11, color: isZero ? 'var(--v-dim)' : 'var(--v-dim)', marginTop: 2 }}>
                          {muscleFilter === 'all' ? player.tier : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="v-num" style={{ fontSize: 16, color: player.isMe ? 'var(--v-volt-text)' : isZero ? 'var(--v-dim)' : 'var(--v-ink)' }}>{fmtK(rowXP)}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, textTransform: 'uppercase', fontWeight: 700, color: 'var(--v-dim)', letterSpacing: '0.08em' }}>XP</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {leaderboardData.length > 0 && (
                <div style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--v-dim)', paddingBottom: 8 }}>
                  Leaderboard updated · Tap a player to view their muscle breakdown
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* ── Friends tab ── */}
      {activeTab === 'friends' && (
        <VoltBlock style={{ textAlign: 'center', padding: 34 }}>
          <Users size={34} color="var(--v-dim)" style={{ marginBottom: 10 }} />
          <div style={{ fontSize: 17, fontWeight: 900 }}>Friends Coming Soon</div>
          <p style={{ color: 'var(--v-dim)', fontSize: 13.5, margin: '7px auto 0', maxWidth: 300, lineHeight: 1.55 }}>
            Connect with training partners and compete on a shared leaderboard
          </p>
        </VoltBlock>
      )}

      {/* ── My Stats tab ── */}
      {activeTab === 'mystats' && (
        <>
          {/* Body map + overall rank */}
          <VoltBlock style={{ textAlign: 'center' }}>
            <RelitBodyMap muscleXP={muscleXP} gender={user?.gender} />
            <div style={{ marginTop: 20, padding: '14px 16px', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 15 }}>
              <div style={{ width: 54, height: 54, borderRadius: 13, background: overall.bg, border: '2px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Trophy size={27} color={overall.color} />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Overall Rank</div>
                <div className="v-num" style={{ color: overall.color, fontSize: 21, lineHeight: 1.1, marginTop: 2 }}>{overall.name}</div>
                <div style={{ fontSize: 12.5, color: 'var(--v-dim)', fontWeight: 700, marginTop: 3 }}>{Math.round(overall.totalXP).toLocaleString()} Total XP</div>
              </div>
            </div>
          </VoltBlock>

          {/* Rank legend */}
          <VoltBlock quiet style={{ padding: '13px 15px' }}>
            <VoltLabel>Rank Tiers</VoltLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 9 }}>
              {RANK_TIERS.filter((_, i) => i === 0 || i === 1 || i === 4 || i === 7 || i === 10 || i === 11 || i === 12 || i === 13).map(tier => (
                <span key={tier.name} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 9.5, color: tier.color, fontWeight: 700, padding: '4px 8px', borderRadius: 6, background: tier.bg, border: '1.5px solid var(--v-edge-quiet)' }}>
                  <Shield size={10} /> {tier.name}
                </span>
              ))}
            </div>
          </VoltBlock>

          {/* Region filters */}
          <div style={{ display: 'flex', gap: 7, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                style={{
                  padding: '9px 16px', borderRadius: 999, cursor: 'pointer', whiteSpace: 'nowrap',
                  fontFamily: "'Archivo', sans-serif", fontSize: 12.5, fontWeight: 800,
                  border: '2px solid var(--v-edge)',
                  background: filter === f.key ? 'var(--v-volt)' : 'var(--v-panel)', color: filter === f.key ? '#141416' : 'var(--v-dim)',
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Muscle cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[...filtered]
              .sort((a, b) => (muscleXP[b.key] || 0) - (muscleXP[a.key] || 0))
              .map(muscle => (
                <VoltMuscleCard key={muscle.key} muscle={muscle} xp={muscleXP[muscle.key] || 0} />
              ))}
          </div>

          {/* Big rank card */}
          <VoltBlock hero style={{ textAlign: 'center' }}>
            <div style={{ width: 70, height: 70, borderRadius: 19, background: overall.bg, border: '2.5px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px' }}>
              <Trophy size={35} color={overall.color} />
            </div>
            <div className="v-num" style={{ fontSize: 38, color: overall.color, lineHeight: 1 }}>{overall.name}</div>
            <div style={{ fontSize: 15, color: 'var(--v-dim)', fontWeight: 700, marginTop: 7 }}>
              {Math.round(overall.totalXP).toLocaleString()} Monthly XP
            </div>

            {overall.progress < 1 && (
              <div style={{ marginTop: 22, maxWidth: 320, marginLeft: 'auto', marginRight: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 700, marginBottom: 7, textTransform: 'uppercase' }}>
                  <span>{overall.name}</span>
                  <span>{Math.round(overall.nextXP).toLocaleString()} XP</span>
                </div>
                <div style={{ height: 11, borderRadius: 6, border: '2px solid var(--v-edge)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', background: overall.color, width: `${overall.progress * 100}%`, transition: 'width 600ms cubic-bezier(0.23, 1, 0.32, 1)' }} />
                </div>
                <div style={{ fontSize: 12.5, color: overall.color, fontWeight: 800, marginTop: 8 }}>
                  {Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to next rank
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 11, justifyContent: 'center', marginTop: 22, flexWrap: 'wrap' }}>
              {[
                { l: 'Days Left', v: <span style={{ color: 'var(--v-volt-text)' }}>{daysInMonth}</span> },
                { l: 'This Week', v: <span style={{ color: thisWeekDays >= 4 ? 'var(--v-success-text)' : 'var(--v-volt-text)' }}>{thisWeekDays}/7 <span style={{ fontSize: 11.5, color: 'var(--v-dim)', fontFamily: "'Archivo', sans-serif", fontWeight: 700 }}>days</span></span> },
                { l: 'Muscles', v: <span>{Object.values(muscleXP).filter(v => v > 0).length}/{MUSCLE_GROUPS.length}</span> },
              ].map(s => (
                <div key={s.l} style={{ padding: '11px 16px', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 13, minWidth: 92 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
                  <div className="v-num" style={{ fontSize: 19, marginTop: 4 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </VoltBlock>

          {/* Per-muscle league table */}
          <VoltBlock style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '15px 19px 12px' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Shield size={14} color="var(--v-volt-text)" /> Per-Muscle League Table
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 96px 74px 56px', gap: 8, padding: '9px 19px', background: 'var(--v-canvas)', borderTop: '2px solid var(--v-edge-quiet)', borderBottom: '2px solid var(--v-edge-quiet)' }}>
              {['Muscle', 'Rank', 'XP', 'Status'].map((h, i) => (
                <div key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: i >= 2 ? 'right' : 'left' }}>{h}</div>
              ))}
            </div>
            {sortedMuscles.map((muscle, i) => {
              const xp = muscleXP[muscle.key] || 0;
              const rank = getRank(xp);
              const isWeakest = muscle.key === weakestMuscle?.key && xp < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3;
              return (
                <div key={muscle.key} style={{ display: 'grid', gridTemplateColumns: '1fr 96px 74px 56px', gap: 8, padding: '11px 19px', alignItems: 'center', background: isWeakest ? 'rgba(255, 92, 56, 0.07)' : 'transparent', borderBottom: '2px solid var(--v-edge-quiet)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--v-dim)', fontWeight: 700, width: 22, flexShrink: 0 }}>#{i + 1}</div>
                    <div style={{ fontWeight: 700, fontSize: 13.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{muscle.label}</div>
                  </div>
                  <div><VoltRankBadge rank={rank} size="sm" /></div>
                  <div className="v-num" style={{ textAlign: 'right', fontSize: 13, color: rank.color }}>{Math.round(xp).toLocaleString()}</div>
                  <div style={{ textAlign: 'right' }}>
                    {isWeakest ? (
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, fontWeight: 700, color: 'var(--v-coral-text)', textTransform: 'uppercase', border: '1.5px solid var(--v-coral)', padding: '3px 6px', borderRadius: 5 }}>Focus</span>
                    ) : xp > 0 ? (
                      <TrendingUp size={14} color="var(--v-success-text)" />
                    ) : (
                      <Minus size={14} color="var(--v-dim)" />
                    )}
                  </div>
                </div>
              );
            })}
            {weakestMuscle && (muscleXP[weakestMuscle.key] || 0) < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3 && (
              <div style={{ padding: '15px 19px', display: 'flex', justifyContent: 'center' }}>
                <VoltPill
                  small
                  onClick={() => {
                    if (chatbot) {
                      chatbot.openChat();
                      setTimeout(() => chatbot.sendMessage(`How can I improve my ${weakestMuscle.label} strength?`), 300);
                    }
                  }}
                  style={{ background: 'var(--v-coral)', borderColor: 'var(--v-edge)' }}
                >
                  <Bot size={14} /> Ask FORGE how to improve {weakestMuscle.label}
                </VoltPill>
              </div>
            )}
          </VoltBlock>

          {/* Benchmarks */}
          <VoltBlock>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={14} color="var(--v-volt-text)" /> Where You Stand
            </div>
            <div style={{ position: 'relative', marginBottom: 20 }}>
              <div style={{ height: 13, borderRadius: 7, border: '2px solid var(--v-edge)', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg, #CD7F32, #7A8FA6, #FFD700, #40E0D0, #FF69B4)', width: `${benchmarkPct}%`, transition: 'width 800ms cubic-bezier(0.23, 1, 0.32, 1)' }} />
              </div>
              <div style={{ position: 'relative', height: 30 }}>
                {MONTHLY_BENCHMARKS.map(b => {
                  const pct = (b.totalXP / MONTHLY_BENCHMARKS[MONTHLY_BENCHMARKS.length - 1].totalXP) * 100;
                  return (
                    <div key={b.label} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, color: 'var(--v-dim)', fontWeight: 700, textAlign: 'center', position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)', top: 5 }}>
                      <div style={{ width: 2, height: 7, background: 'var(--v-dim)', margin: '0 auto 3px', borderRadius: 1 }} />
                      {b.label}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{ padding: '13px 15px', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 12 }}>
              <div style={{ fontSize: 13, color: 'var(--v-dim)', lineHeight: 1.55 }}>
                Your overall XP (<strong style={{ color: 'var(--v-volt-text)' }}>{Math.round(overall.totalXP).toLocaleString()}</strong>)
                {benchmark.lower && benchmark.upper
                  ? <> places you in the <strong style={{ color: 'var(--v-volt-text)' }}>{benchmark.lower.label}–{benchmark.upper.label}</strong> range.</>
                  : benchmark.lower
                    ? <> puts you beyond <strong style={{ color: 'var(--v-volt-text)' }}>{benchmark.lower.label}</strong> level. Incredible!</>
                    : <> is at the <strong style={{ color: 'var(--v-volt-text)' }}>{benchmark.upper?.label || 'Beginner'}</strong> level. Keep training!</>}
              </div>
            </div>
          </VoltBlock>

          {/* Rank history */}
          {monthlyRankHistory && monthlyRankHistory.length > 0 && (
            <VoltBlock>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--v-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Calendar size={14} color="var(--v-volt-text)" /> Rank History
              </div>
              <div style={{ display: 'flex', gap: 11, overflowX: 'auto', paddingBottom: 6, scrollbarWidth: 'none' }}>
                <div style={{ padding: 15, minWidth: 158, flexShrink: 0, borderRadius: 14, border: '2.5px solid var(--v-volt)', background: 'var(--v-canvas)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 11 }}>
                    <div style={{ fontSize: 11, color: 'var(--v-volt-text)', fontWeight: 800 }}>
                      {(() => { const [yr, mo] = getCurrentMonth().split('-').map(Number); return new Date(yr, mo - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); })()}
                    </div>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, color: 'var(--v-success-text)', textTransform: 'uppercase', border: '1.5px solid var(--v-success-text)', padding: '2.5px 6px', borderRadius: 4 }}>Live</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: overall.bg, border: '2px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={18} color={overall.color} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 900, color: overall.color, fontSize: 14.5 }}>{overall.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--v-dim)', fontWeight: 700 }}>{Math.round(overall.totalXP).toLocaleString()} XP</div>
                    </div>
                  </div>
                </div>

                {monthlyRankHistory.filter(hist => hist.id !== getCurrentMonth()).map(hist => {
                  const r = getOverallRank({ fake: hist.xp });
                  const isBest = bestMonth && hist.id === bestMonth.id;
                  return (
                    <div key={hist.id} style={{ padding: 15, minWidth: 158, flexShrink: 0, borderRadius: 14, border: isBest ? '2.5px solid var(--v-volt)' : '2px solid var(--v-edge-quiet)', background: 'var(--v-panel)', position: 'relative' }}>
                      {isBest && (
                        <div style={{ position: 'absolute', top: 0, right: 12, fontFamily: "'JetBrains Mono', monospace", fontSize: 8, fontWeight: 700, color: '#141416', textTransform: 'uppercase', background: 'var(--v-volt)', padding: '4px 8px', borderRadius: '0 0 6px 6px' }}>
                          <Award size={9} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} /> Best
                        </div>
                      )}
                      <div style={{ fontSize: 11, color: 'var(--v-dim)', fontWeight: 700, marginBottom: 11 }}>{hist.label}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, border: '2px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Trophy size={18} color={r.color} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, color: r.color, fontSize: 14.5 }}>{r.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--v-dim)', fontWeight: 700 }}>{Math.round(hist.xp).toLocaleString()} XP</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </VoltBlock>
          )}
        </>
      )}

      {selectedPlayer && (
        <PlayerDetailModal
          player={selectedPlayer.isMe ? null : selectedPlayer}
          realMuscleXP={muscleXP}
          realUserName={user?.name || 'You'}
          gender={user?.gender}
          onClose={() => setSelectedPlayer(null)}
        />
      )}
    </div>
  );
}
