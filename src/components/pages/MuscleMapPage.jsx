import { useState, useMemo, useEffect, useRef } from 'react';
import { Shield, Trophy } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Screen, Sec, Hero, LedgerRow, Note, TLink, Amp, Balance } from '../shared/Margin';
import BodyMapSVG from '../shared/BodyMapSVG';
import AvatarInitials from '../shared/AvatarInitials';
import ErrorBoundary from '../shared/ErrorBoundary';
import PlayerDetailModal from '../shared/PlayerDetailModal';
import { MUSCLE_GROUPS, RANK_TIERS, getRank, calcAllMuscleXP, getOverallRank, getTierColor } from '../../data/muscleData';
import { MONTHLY_BENCHMARKS, getBenchmarkBracket } from '../../data/rankBenchmarks';
import { fetchLeaderboard, syncUserXPToCache, getCurrentMonth } from '../../utils/xpCacheSync';
import { supabase } from '../../lib/supabaseClient';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';

const muscleMapTabCache = { activeTab: 'leaderboard' };

// ─── RANK BADGE ──────────────────────────────────────────────────────────────
// The badge survives the MARGIN rebuild as a word: tier colour + shield, no pill.
const RankBadge = ({ rank, size = 'md' }) => {
  const sz = size === 'sm' ? { fs: 8, icon: 10 } : size === 'lg' ? { fs: 12, icon: 14 } : { fs: 10, icon: 12 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: sz.fs, fontWeight: 700, color: rank.color,
      textTransform: 'uppercase', letterSpacing: '.5px',
    }}>
      <Shield size={sz.icon} /> {rank.name}
    </span>
  );
};

// ─── MUSCLE MAP PAGE ─────────────────────────────────────────────────────────
export default function MuscleMapPage({ chatbot }) {
  useScrollRestoration('/muscle-map');
  const { workoutLogs, splits, user, monthlyRankHistory } = useApp();
  const [activeTab, setActiveTabRaw] = useState(muscleMapTabCache.activeTab);
  const setActiveTab = (tab) => { muscleMapTabCache.activeTab = tab; setActiveTabRaw(tab); };
  const [selectedPlayer, setSelectedPlayer] = useState(null); // player object or null
  const [filter, setFilter] = useState('all');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);
  const [selectedMonth, setSelectedMonth] = useState(() => getCurrentMonth());

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setFilterOpen(false); // reset on tab change
  }, [activeTab]);

  const [leaderboardData, setLeaderboardData] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(true);
  const [leaderboardError, setLeaderboardError] = useState(null);

  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError(null);

    // Fetch the leaderboard — computes XP from actual workout_logs for all users
    const data = await fetchLeaderboard(splits, selectedMonth);
    setLeaderboardData(data);
    if (data.length === 0) {
      console.log('[Olympus] No users found.');
    }
    setLeaderboardLoading(false);

    // Background: keep our own cache row warm (only for current month)
    if (selectedMonth === getCurrentMonth()) {
      syncUserXPToCache({ workoutLogs, splits, user }).catch(console.warn);
    }
  };

  useEffect(() => {
    if (activeTab === 'leaderboard') {
      loadLeaderboard();
    }
  }, [activeTab, selectedMonth]);

  // Realtime subscription — refresh when ANY user logs a workout
  useEffect(() => {
    if (activeTab !== 'leaderboard') return;

    const channel = supabase
      .channel('leaderboard-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'workout_logs',
      }, () => {
        setTimeout(() => loadLeaderboard(), 2000);
      })
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'monthly_xp_cache',
      }, () => {
        setTimeout(() => loadLeaderboard(), 2000);
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'monthly_xp_cache',
      }, () => {
        setTimeout(() => loadLeaderboard(), 2000);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [activeTab]);

  const muscleXP = useMemo(
    () => calcAllMuscleXP(workoutLogs, splits, user?.id, selectedMonth),
    [workoutLogs, splits, user?.id, selectedMonth]
  );

  const overall = useMemo(() => getOverallRank(muscleXP), [muscleXP]);


  // Build and sort the full leaderboard including the real user and global players
  const fullLeaderboard = useMemo(() => {
    const meEntry = {
      id: user?.id || 'me',
      name: 'You',
      isMe: true,
      totalXP: overall.totalXP,
      tier: overall.name,
      initials: (user?.name || 'ME').slice(0, 2).toUpperCase(),
      color: getTierColor(overall.name),
      muscleXP: muscleXP,
    };

    if (leaderboardLoading) {
      return [{ ...meEntry, rank: 1 }];
    }

    // Check if current user is already in the cache data
    const alreadyInCache = leaderboardData.some(p => p.id === user?.id);

    // Build the full list: cache rows + inject self if missing
    const baseList = leaderboardData.map(player => ({
      ...player,
      isMe: player.id === user?.id,
      muscleXP: player.id === user?.id ? muscleXP : player.muscleXP,
      totalXP: player.id === user?.id ? overall.totalXP : player.totalXP,
      tier: player.id === user?.id ? overall.name : player.tier,
      name: player.id === user?.id ? 'You' : player.name,
      color: getTierColor(player.id === user?.id ? overall.name : player.tier),
    }));

    const list = alreadyInCache ? baseList : [...baseList, meEntry];

    return list
      .sort((a, b) => b.totalXP - a.totalXP)
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [leaderboardData, leaderboardLoading, overall, muscleXP, user]);

  const filteredLeaderboard = useMemo(() => {
    if (muscleFilter === 'all') return fullLeaderboard;
    return [...fullLeaderboard]
      .sort((a, b) => (b.muscleXP?.[muscleFilter] || 0) - (a.muscleXP?.[muscleFilter] || 0))
      .map((p, i) => ({ ...p, rank: i + 1 }));
  }, [fullLeaderboard, muscleFilter]);

  const podium = filteredLeaderboard.slice(0, 3);
  const myRank = filteredLeaderboard.find(p => p.isMe)?.rank;
  const topPercent = Math.max(1, Math.ceil((myRank / filteredLeaderboard.length) * 100));

  const filtered = useMemo(() => {
    if (filter === 'all') return MUSCLE_GROUPS;
    return MUSCLE_GROUPS.filter(m => m.region === filter);
  }, [filter]);

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'upper', label: 'Upper Body' },
    { key: 'lower', label: 'Lower Body' },
    { key: 'core', label: 'Core' },
  ];

  // ─── LEAGUE DATA ─────────────────────────────────────────────────────────
  const daysInMonth = useMemo(() => {
    const now = new Date();
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    return lastDay - now.getDate();
  }, []);

  const thisWeekDays = useMemo(() => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    const uniqueDates = new Set(
      workoutLogs
        .filter(l => l.userId === user?.id && new Date(l.date + 'T00:00:00') >= startOfWeek)
        .map(l => l.date)
    );
    return uniqueDates.size;
  }, [workoutLogs, user?.id]);

  const sortedMuscles = useMemo(() =>
    [...MUSCLE_GROUPS].sort((a, b) => (muscleXP[b.key] || 0) - (muscleXP[a.key] || 0)),
    [muscleXP]
  );

  const weakestMuscle = sortedMuscles[sortedMuscles.length - 1];

  const benchmark = useMemo(() => getBenchmarkBracket(overall.totalXP), [overall.totalXP]);

  const benchmarkPct = useMemo(() => {
    const maxXP = MONTHLY_BENCHMARKS[MONTHLY_BENCHMARKS.length - 1].totalXP;
    return Math.min(100, Math.round((overall.totalXP / maxXP) * 100));
  }, [overall.totalXP]);

  // Find best month from history
  const bestMonth = useMemo(() => {
    if (!monthlyRankHistory || monthlyRankHistory.length === 0) return null;
    return monthlyRankHistory.reduce((best, cur) => cur.xp > best.xp ? cur : best, monthlyRankHistory[0]);
  }, [monthlyRankHistory]);

  const askForge = () => {
    if (chatbot) {
      chatbot.openChat();
      setTimeout(() => chatbot.sendMessage(`How can I improve my ${weakestMuscle.label} strength?`), 300);
    }
  };

  // ─── TAB PILLS ─────────────────────────────────────────────────────────
  const tabs = [
    { key: 'leaderboard', label: 'Global' },
    { key: 'friends', label: 'Friends' },
    { key: 'mystats', label: 'My Stats' },
  ];

  const standingLine = leaderboardLoading
    ? 'Fetching your rank…'
    : myRank === undefined
      ? 'Syncing to leaderboard…'
      : myRank === 1
        ? 'You are #1!'
        : topPercent <= 50
          ? `You are in the top ${topPercent}%`
          : `You are rank #${myRank}`;

  return (
    <>
    <Screen
      kicker="Olympus League"
      right={(
        <div className="rowf g12">
          {tabs.map(t => (
            <TLink key={t.key} ember={activeTab === t.key} onClick={() => setActiveTab(t.key)}>{t.label}</TLink>
          ))}
        </div>
      )}
    >
      {/* ACHIEVEMENT BANNER (Global Only) */}
      {activeTab === 'leaderboard' && (
        <Sec n="01" label="Olympus standing">
          <Hero size="sm" value={standingLine} />
          <p className="meta" style={{ marginTop: 8 }}>
            {overall.progress < 1
              ? `${Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to reach the next tier`
              : 'Max tier reached'}
          </p>
        </Sec>
      )}

      {/* Month Navigator */}
      <div className="rowf" style={{ justifyContent: 'center', alignItems: 'center', gap: 16, marginBottom: 10 }}>
        <TLink onClick={() => {
          const [yr, mo] = selectedMonth.split('-').map(Number);
          const d = new Date(yr, mo - 2, 1);
          setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }}>‹</TLink>
        <span style={{
          fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
          fontSize: 14, minWidth: 160, textAlign: 'center',
          color: selectedMonth === getCurrentMonth() ? 'var(--ember)' : 'var(--ink)',
        }}>
          {(() => {
            const [yr, mo] = selectedMonth.split('-').map(Number);
            return new Date(yr, mo - 1).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
          })()}
          {selectedMonth === getCurrentMonth() && <span className="meta" style={{ marginLeft: 8 }}>Live</span>}
        </span>
        <TLink onClick={() => {
          if (selectedMonth === getCurrentMonth()) return;
          const [yr, mo] = selectedMonth.split('-').map(Number);
          const d = new Date(yr, mo, 1);
          setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }}>›</TLink>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* TAB 1: LEADERBOARD                                 */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'leaderboard' && (<>

        {/* PODIUM — Top 3 Players (kept: this is the game) */}
        <Sec label="Podium">
          <section style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, padding: '10px 8px 0' }}>
            {/* Visual order: [2nd, 1st, 3rd] left-to-right. Slot index 1 is center (elevated). */}
            {[podium[1], podium[0], podium[2]].filter(Boolean).map((player, slotIndex) => {
              const isCenter = slotIndex === 1;  // center slot is rank 1
              // Medal color by actual rank, not by slot index
              const medalColor = player.rank === 1 ? 'var(--ember)'
                : player.rank === 2 ? '#7A8FA6'
                : '#CD7F32';
              const rankLabel = player.rank === 1 ? '1st' : player.rank === 2 ? '2nd' : '3rd';
              const podiumXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);

              return (
                <div key={player.id} style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  flex: 1, paddingBottom: isCenter ? 16 : 0, cursor: 'pointer',
                }} onClick={() => setSelectedPlayer(player)}>
                  {isCenter && <Trophy size={22} color="#CD7F32" style={{ marginBottom: 8 }} />}
                  <AvatarInitials
                    initials={player.initials}
                    color={medalColor}
                    size={isCenter ? 64 : 48} borderWidth={2}
                  />
                  <div style={{
                    fontWeight: 700, fontSize: 12, color: 'var(--ink)', marginTop: 8,
                    maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {player.name}
                  </div>
                  <div style={{
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: isCenter ? 14 : 12, color: medalColor, marginTop: 2,
                  }}>
                    {podiumXP >= 1000 ? `${(podiumXP / 1000).toFixed(1)}K` : podiumXP} XP
                  </div>
                  <div className="meta" style={{ textTransform: 'uppercase' }}>{rankLabel}</div>
                </div>
              );
            })}
          </section>
        </Sec>

        {/* RANKED LIST + MUSCLE FILTER */}
        <Sec
          label="Rank & athlete"
          right={muscleFilter === 'all' ? 'Total XP' : 'Muscle XP'}
        >
          <div ref={filterRef} style={{ position: 'relative', marginBottom: 8 }}>
            <TLink onClick={() => setFilterOpen(!filterOpen)}>
              {muscleFilter === 'all' ? 'All Muscles' : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label} ▾
            </TLink>
            {filterOpen && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, marginTop: 8, zIndex: 20,
                background: 'var(--canvas)', border: '1px solid var(--hair)',
                padding: 6, minWidth: 170,
              }}>
                <div
                  onClick={() => { setMuscleFilter('all'); setFilterOpen(false); }}
                  style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: muscleFilter === 'all' ? 'var(--ember)' : 'var(--ink)' }}
                >
                  All Muscles
                </div>
                {MUSCLE_GROUPS.map(m => (
                  <div
                    key={m.key}
                    onClick={() => { setMuscleFilter(m.key); setFilterOpen(false); }}
                    style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: muscleFilter === m.key ? 'var(--ember)' : 'var(--ink)' }}
                  >
                    {m.label}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* LOADING STATE */}
          {leaderboardLoading && <Note>Fetching the leaderboard…</Note>}

          {/* ERROR STATE */}
          {leaderboardError && !leaderboardLoading && (
            <div>
              <p className="meta" style={{ marginBottom: 10 }}>{leaderboardError}</p>
              <TLink onClick={() => { setLeaderboardError(null); loadLeaderboard(); }}>Retry</TLink>
            </div>
          )}

          {/* RANKED LIST */}
          {!leaderboardLoading && !leaderboardError && (
            <>
              {filteredLeaderboard.map(player => {
                const rowXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);
                const isZero = rowXP === 0;
                return (
                  <LedgerRow
                    key={player.id}
                    k={`${player.rank}. ${player.name}`}
                    v={rowXP >= 1000 ? `${(rowXP / 1000).toFixed(1)}K` : rowXP}
                    sub={` · ${muscleFilter === 'all' ? player.tier : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label} XP${player.isMe ? ' · MVP' : ''}`}
                    dim={isZero && !player.isMe}
                    emberLead={player.isMe}
                    onClick={() => setSelectedPlayer(player)}
                  />
                );
              })}
              {leaderboardData.length > 0 && (
                <p className="meta" style={{ textAlign: 'center', marginTop: 16 }}>
                  Leaderboard updated · Tap a player to view their muscle breakdown
                </p>
              )}
            </>
          )}
        </Sec>
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* TAB 2: FRIENDS                                     */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'friends' && (
        <Sec label="Friends">
          <Note>Friends coming soon — connect with training partners and compete on a shared leaderboard.</Note>
        </Sec>
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* TAB 3: MY STATS                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'mystats' && (<>
        <Sec n="01" label="Muscle map">
          <ErrorBoundary>
            <BodyMapSVG muscleXP={muscleXP} gender={user?.gender} />
          </ErrorBoundary>
          <LedgerRow k="Overall rank" v={overall.name} />
          <LedgerRow k="Total XP" v={Math.round(overall.totalXP).toLocaleString()} />
          <div style={{ marginTop: 12 }}>
            <p className="meta" style={{ marginBottom: 8 }}>Rank tiers</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 14px' }}>
              {RANK_TIERS.filter((_, i) => i === 0 || i === 1 || i === 4 || i === 7 || i === 10 || i === 11 || i === 12 || i === 13).map(tier => (
                <RankBadge key={tier.name} rank={tier} size="sm" />
              ))}
            </div>
          </div>
        </Sec>

        <Sec n="02" label="Muscles">
          <div className="rowf g12" style={{ marginBottom: 12 }}>
            {filters.map(f => (
              <TLink key={f.key} ember={filter === f.key} onClick={() => setFilter(f.key)}>{f.label}</TLink>
            ))}
          </div>
          {filtered
            .sort((a, b) => (muscleXP[b.key] || 0) - (muscleXP[a.key] || 0))
            .map(muscle => {
              const xp = muscleXP[muscle.key] || 0;
              const rank = getRank(xp);
              return (
                <Balance
                  key={muscle.key}
                  label={muscle.label}
                  current={rank.name}
                  pct={rank.progress * 100}
                  note={rank.progress < 1
                    ? `${Math.round(xp).toLocaleString()} XP · Next: ${Math.round(rank.nextXP).toLocaleString()} XP`
                    : `${Math.round(xp).toLocaleString()} XP · Max tier`}
                />
              );
            })
          }
        </Sec>

        <Sec n="03" label="Your standing">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Trophy size={30} color={overall.color} />
            <Hero value={overall.name} style={{ color: overall.color }} />
          </div>
          <p className="meta" style={{ marginTop: 6 }}>{Math.round(overall.totalXP).toLocaleString()} Monthly XP</p>

          {overall.progress < 1 && (
            <Balance
              label={overall.name}
              current={`${Math.round(overall.nextXP).toLocaleString()} XP`}
              pct={overall.progress * 100}
              note={`${Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to next rank`}
            />
          )}

          <LedgerRow k="Days left" v={daysInMonth} />
          <LedgerRow k="This week" v={`${thisWeekDays}/7 days`} />
          <LedgerRow k="Muscles" v={`${Object.values(muscleXP).filter(v => v > 0).length}/${MUSCLE_GROUPS.length}`} />
        </Sec>

        <Sec n="04" label="Per-muscle league table">
          {sortedMuscles.map((muscle, i) => {
            const xp = muscleXP[muscle.key] || 0;
            const rank = getRank(xp);
            const isWeakest = muscle.key === weakestMuscle?.key && xp < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3;
            return (
              <div key={muscle.key}>
                <LedgerRow
                  k={`#${i + 1} ${muscle.label}`}
                  v={Math.round(xp).toLocaleString()}
                  sub={` · ${rank.name}`}
                />
                <div className="rowf between" style={{ marginTop: -6, paddingBottom: 10 }}>
                  <span className="meta" style={isWeakest ? { color: 'var(--bad)' } : undefined}>
                    {isWeakest ? 'Focus' : xp > 0 ? 'Active' : 'Untrained'}
                  </span>
                </div>
              </div>
            );
          })}
          {weakestMuscle && (muscleXP[weakestMuscle.key] || 0) < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3 && (
            <div className="rowf" style={{ justifyContent: 'center', marginTop: 6 }}>
              <TLink onClick={askForge} style={{ color: 'var(--bad)' }}>
                Ask FORGE how to improve {weakestMuscle.label}
              </TLink>
            </div>
          )}
        </Sec>

        <Sec n="05" label="Where you stand">
          <Amp pct={benchmarkPct} />
          <div style={{ position: 'relative', height: 26, marginTop: 4 }}>
            {MONTHLY_BENCHMARKS.map(b => {
              const pct = (b.totalXP / MONTHLY_BENCHMARKS[MONTHLY_BENCHMARKS.length - 1].totalXP) * 100;
              return (
                <div key={b.label} className="meta" style={{
                  position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)',
                  fontSize: 9, textAlign: 'center', whiteSpace: 'nowrap',
                }}>
                  {b.label}
                </div>
              );
            })}
          </div>
          <Note>
            Your overall XP (<strong style={{ color: 'var(--ink)' }}>{Math.round(overall.totalXP).toLocaleString()}</strong>)
            {benchmark.lower && benchmark.upper
              ? <> places you in the <strong style={{ color: 'var(--ink)' }}>{benchmark.lower.label}–{benchmark.upper.label}</strong> range.</>
              : benchmark.lower
                ? <> puts you beyond <strong style={{ color: 'var(--ink)' }}>{benchmark.lower.label}</strong> level. Incredible!</>
                : <> is at the <strong style={{ color: 'var(--ink)' }}>{benchmark.upper?.label || 'Beginner'}</strong> level. Keep training!</>
            }
          </Note>
        </Sec>

        {monthlyRankHistory && monthlyRankHistory.length > 0 && (
          <Sec n="06" label="Rank history">
            <div style={{ display: 'flex', gap: 22, overflowX: 'auto', paddingBottom: 8 }}>
              {/* Current month (live) */}
              <div style={{ minWidth: 150, flexShrink: 0 }}>
                <div className="rowf g12" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                  <span className="meta" style={{ color: 'var(--ember)' }}>
                    {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </span>
                  <span className="meta" style={{ color: 'var(--ok)' }}>Live</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Trophy size={18} color={overall.color} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: overall.color }}>{overall.name}</span>
                </div>
                <p className="meta" style={{ marginTop: 4 }}>{Math.round(overall.totalXP).toLocaleString()} XP</p>
              </div>

              {/* Past months — the current month is shown live above */}
              {monthlyRankHistory.filter(hist => hist.id !== getCurrentMonth()).map(hist => {
                const r = getOverallRank({ fake: hist.xp });
                const isBest = bestMonth && hist.id === bestMonth.id;
                return (
                  <div key={hist.id} style={{ minWidth: 150, flexShrink: 0 }}>
                    <div className="rowf g12" style={{ justifyContent: 'space-between', marginBottom: 8 }}>
                      <span className="meta">{hist.label}</span>
                      {isBest && <span className="meta" style={{ color: 'var(--ember)' }}>Best</span>}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Trophy size={18} color={r.color} />
                      <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: r.color }}>{r.name}</span>
                    </div>
                    <p className="meta" style={{ marginTop: 4 }}>{Math.round(hist.xp).toLocaleString()} XP</p>
                  </div>
                );
              })}
            </div>
          </Sec>
        )}
      </>)}
    </Screen>

    {selectedPlayer && (
      <PlayerDetailModal
        player={selectedPlayer.isMe ? null : selectedPlayer}
        realMuscleXP={muscleXP}
        realUserName={user?.name || 'You'}
        gender={user?.gender}
        onClose={() => setSelectedPlayer(null)}
      />
    )}
    </>
  );
}
