import { useState, useMemo, useEffect, useRef } from 'react';
import { Shield, Trophy, Sparkles, TrendingUp, Minus, Award, Calendar, Users } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, EmptyState } from '../shared/SharedComponents';
import BodyMapSVG from '../shared/BodyMapSVG';
import AvatarInitials from '../shared/AvatarInitials';
import ErrorBoundary from '../shared/ErrorBoundary';
import PlayerDetailModal from '../shared/PlayerDetailModal';
import { MUSCLE_GROUPS, RANK_TIERS, getRank, calcAllMuscleXP, getOverallRank, getTierColor } from '../../data/muscleData';
import { MONTHLY_BENCHMARKS, getBenchmarkBracket } from '../../data/rankBenchmarks';
import { fetchLeaderboard, syncUserXPToCache } from '../../utils/xpCacheSync';
import { supabase } from '../../lib/supabaseClient';

// ─── RANK BADGE ──────────────────────────────────────────────────────────────
const RankBadge = ({ rank, size = 'md' }) => {
  const sz = size === 'sm' ? { fs: 8, px: 6, py: 2, icon: 10 } : size === 'lg' ? { fs: 12, px: 12, py: 5, icon: 14 } : { fs: 10, px: 10, py: 4, icon: 12 };
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: `${sz.py}px ${sz.px}px`, borderRadius: 8,
      background: typeof rank.bg === 'string' && rank.bg.startsWith('linear') ? rank.bg : rank.bg,
      border: `1px solid ${rank.color}20`,
      fontSize: sz.fs, fontWeight: 700, color: rank.color,
      textTransform: 'uppercase', letterSpacing: '.5px',
    }}>
      <Shield size={sz.icon} /> {rank.name}
    </div>
  );
};

// ─── MUSCLE CARD ─────────────────────────────────────────────────────────────
const MuscleCard = ({ muscle, xp }) => {
  const rank = getRank(xp);
  return (
    <div className="card stripe" style={{
      padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16,
      border: 'none'
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: rank.bg, border: 'none', boxShadow: `0 4px 12px ${rank.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Shield size={20} color={rank.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div className="headline-md" style={{ color: 'var(--on-surface)' }}>{muscle.label}</div>
          <RankBadge rank={rank} size="sm" />
        </div>
        <div style={{ position: 'relative', height: 8, borderRadius: 4, background: 'var(--surface-container-highest)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})`,
            width: `${rank.progress * 100}%`,
            transition: 'width .6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 12, fontWeight: 600, color: 'var(--on-surface-variant)',
          marginTop: 6
        }}>
          <span style={{ color: rank.color }}>
            {Math.round(xp).toLocaleString()} XP
          </span>
          <span>
            {rank.progress < 1
              ? `Next: ${Math.round(rank.nextXP).toLocaleString()} XP`
              : <span style={{ color: rank.color }}>✓ MAX TIER</span>}
          </span>
        </div>
      </div>
    </div>
  );
};

// ─── MUSCLE MAP PAGE ─────────────────────────────────────────────────────────
export default function MuscleMapPage() {
  const { workoutLogs, splits, user, monthlyRankHistory } = useApp();
  const [activeTab, setActiveTab] = useState('leaderboard'); // 'leaderboard' | 'friends' | 'mystats'
  const [selectedPlayer, setSelectedPlayer] = useState(null); // player object or null
  const [filter, setFilter] = useState('all');
  const [muscleFilter, setMuscleFilter] = useState('all');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef(null);

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

    // First: ensure our own XP is up to date in the cache
    await syncUserXPToCache({ workoutLogs, splits, user }).catch(e => console.warn(e));

    // Then: fetch the full leaderboard
    const data = await fetchLeaderboard();
    // An empty array is valid during first boot (cache not yet populated)
    setLeaderboardData(data);
    if (data.length === 0) {
      console.log('[Olympus] No cached XP entries yet — only the current user will show.');
    }
    setLeaderboardLoading(false);
  };

  useEffect(() => {
    if (activeTab !== 'leaderboard') return;
    loadLeaderboard();
  }, [activeTab]); // only re-run when tab switches to leaderboard

  // Realtime subscription
  useEffect(() => {
    if (activeTab !== 'leaderboard') return;

    const channel = supabase
      .channel('leaderboard-updates')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'monthly_xp_cache',
      }, () => {
        const timer = setTimeout(() => loadLeaderboard(), 2000);
        return () => clearTimeout(timer);
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
    () => calcAllMuscleXP(workoutLogs, splits, user?.id),
    [workoutLogs, splits, user?.id]
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

  // ─── TAB PILLS ─────────────────────────────────────────────────────────
  const tabs = [
    { key: 'leaderboard', label: 'Global' },
    { key: 'friends', label: 'Friends' },
    { key: 'mystats', label: 'My Stats' },
  ];

  return (
    <div className="pg-in">
      <PageHeader title="Olympus League" sub="Your monthly strength league — ascend Olympus" />

      {/* ACHIEVEMENT BANNER (Global Only) */}
      {activeTab === 'leaderboard' && (
        <div className="glass-card" style={{
          padding: '20px', marginBottom: 20, borderRadius: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -40, right: -40, width: 120, height: 120,
            background: 'rgba(248,95,27,0.1)', borderRadius: '50%', filter: 'blur(30px)',
          }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            <div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, color: 'var(--primary)',
                fontSize: 10, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6,
              }}>
                OLYMPUS STANDING
              </div>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 28,
                color: 'var(--on-surface)', lineHeight: 1.2, marginBottom: 6,
              }}>
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
              <div style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>
                {overall.progress < 1
                  ? `${Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to reach the next tier`
                  : '✦ Max tier reached'}
              </div>
            </div>
            <div style={{
              width: 52, height: 52, borderRadius: '50%', flexShrink: 0,
              background: 'linear-gradient(135deg, #FFB59B, #F85F1B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(232,84,13,0.3)',
            }}>
              <Sparkles size={28} color="#fff" />
            </div>
          </div>
        </div>
      )}

      {/* Tab Switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: 'var(--surface-container-highest)', borderRadius: 20, padding: 4, border: 'none' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setActiveTab(t.key)} style={{
            flex: 1, padding: '10px 16px', borderRadius: 16, border: 'none', cursor: 'pointer',
            fontSize: 13, fontWeight: 700, transition: 'all .2s var(--ease-smooth)',
            background: activeTab === t.key ? 'linear-gradient(135deg, #FFB59B, #F85F1B)' : 'transparent',
            color: activeTab === t.key ? '#fff' : 'var(--on-surface-variant)',
            boxShadow: activeTab === t.key ? '0 4px 12px rgba(248,95,27,0.3)' : 'none',
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* TAB 1: LEADERBOARD                                 */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'leaderboard' && (<>

        {/* PODIUM — Top 3 Players */}
        <section style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, marginBottom: 36, paddingTop: 40, padding: '40px 8px 0' }}>
          {/* Visual order: [2nd, 1st, 3rd] left-to-right. Slot index 1 is center (elevated). */}
          {[podium[1], podium[0], podium[2]].filter(Boolean).map((player, slotIndex) => {
            const isCenter = slotIndex === 1;  // center slot is rank 1
            // Medal color by actual rank, not by slot index
            const medalColor = player.rank === 1 ? 'var(--primary)'
              : player.rank === 2 ? '#7A8FA6'
              : '#CD7F32';
            const rankLabel = player.rank === 1 ? '1st' : player.rank === 2 ? '2nd' : '3rd';
            const podiumXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);

            return (
              <div key={player.id} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                flex: 1, paddingBottom: isCenter ? 16 : 0, cursor: 'pointer',
              }} onClick={() => setSelectedPlayer(player)}>
                <div style={{ position: 'relative', marginBottom: isCenter ? 16 : 12 }}>
                  {isCenter && (
                    <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)' }}>
                      <Trophy size={24} color="#CD7F32" />
                    </div>
                  )}
                  <div style={{
                    width: isCenter ? 72 : 56, height: isCenter ? 72 : 56, borderRadius: '50%',
                    border: `${isCenter ? 4 : 3}px solid ${medalColor}`, background: `${medalColor}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
                    fontSize: isCenter ? 22 : 17, color: medalColor,
                  }}>
                    {player.rank}
                  </div>
                  <div style={{
                    position: 'absolute', bottom: -10, left: '50%', transform: 'translateX(-50%)',
                    padding: '2px 10px', borderRadius: 20, fontSize: 10, fontWeight: 800,
                    fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    background: isCenter ? 'linear-gradient(135deg, #FFB59B, #F85F1B)' : `${medalColor}22`,
                    color: isCenter ? '#fff' : medalColor,
                    boxShadow: isCenter ? '0 4px 12px rgba(248,95,27,0.3)' : 'none',
                  }}>
                    {rankLabel}
                  </div>
                </div>
                <div style={{
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 700, fontSize: 12, color: 'var(--on-surface)', marginTop: 6,
                  maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>
                  {player.name}
                </div>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                  fontSize: isCenter ? 13 : 11, color: medalColor, marginTop: 2,
                }}>
                  {podiumXP >= 1000 ? `${(podiumXP / 1000).toFixed(1)}K` : podiumXP} XP
                </div>
              </div>
            );
          })}
        </section>

        {/* LIST HEADER & FILTER (Fix 3 & Fix 5) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 16px 8px', position: 'relative', zIndex: 10 }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-dim)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
            Rank & Athlete
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--on-surface-dim)', textTransform: 'uppercase', letterSpacing: '.08em' }}>
              {muscleFilter === 'all' ? 'Total XP' : 'Muscle XP'}
            </span>
            <div ref={filterRef} style={{ position: 'relative' }}>
              <button 
                onClick={() => setFilterOpen(!filterOpen)}
                style={{
                  background: muscleFilter === 'all' ? 'var(--surface-container-highest)' : 'var(--primary)',
                  color: muscleFilter === 'all' ? 'var(--on-surface)' : 'var(--on-primary)',
                  border: 'none', padding: '4px 8px', borderRadius: 12, cursor: 'pointer',
                  fontSize: 10, fontWeight: 700, fontFamily: "'Be Vietnam Pro', sans-serif",
                  boxShadow: muscleFilter !== 'all' ? '0 0 12px rgba(248,95,27,0.4)' : 'none',
                }}
              >
                {muscleFilter === 'all' ? 'All Muscles' : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label} ▾
              </button>
              {filterOpen && (
                <div style={{
                  position: 'absolute', top: '100%', right: 0, marginTop: 8,
                  background: 'rgba(53,52,55,0.9)', backdropFilter: 'blur(16px)',
                  borderRadius: 16, padding: 8, minWidth: 160,
                  boxShadow: 'var(--shadow-ambient)', border: '1px solid var(--outline-variant)'
                }}>
                  <div 
                    onClick={() => { setMuscleFilter('all'); setFilterOpen(false); }}
                    style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: muscleFilter === 'all' ? 'var(--primary)' : 'var(--on-surface)', borderRadius: 8, background: muscleFilter === 'all' ? 'rgba(255,181,155,0.1)' : 'transparent' }}
                  >
                    All Muscles
                  </div>
                  {MUSCLE_GROUPS.map(m => (
                    <div 
                      key={m.key}
                      onClick={() => { setMuscleFilter(m.key); setFilterOpen(false); }}
                      style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, cursor: 'pointer', color: muscleFilter === m.key ? 'var(--primary)' : 'var(--on-surface)', borderRadius: 8, background: muscleFilter === m.key ? 'rgba(255,181,155,0.1)' : 'transparent' }}
                    >
                      {m.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* LOADING STATE */}
        {leaderboardLoading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px' }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{
                height: 72, borderRadius: 16,
                background: 'var(--surface-container-low)',
                animation: 'shimmer 1.5s ease-in-out infinite',
              }} />
            ))}
          </div>
        )}

        {/* ERROR STATE */}
        {leaderboardError && !leaderboardLoading && (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)', fontSize: 13 }}>
            <p style={{ marginBottom: 16 }}>{leaderboardError}</p>
            <button className="btn-g" onClick={() => { setLeaderboardError(null); loadLeaderboard(); }}>
              Retry
            </button>
          </div>
        )}

        {/* SCROLLABLE RANKED LIST */}
        {!leaderboardLoading && !leaderboardError && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredLeaderboard.map(player => {
                const rowXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);
                // Exclude 0 XP users entirely from the ranked list
                if (rowXP === 0) return null;
                return (
                <div key={player.id}
                  onClick={() => setSelectedPlayer(player)}
                  className="glass-card"
                  style={{
                    padding: '12px 16px', borderRadius: 16,
                    display: 'flex', alignItems: 'center', gap: 16,
                    cursor: 'pointer', position: 'relative', overflow: 'hidden',
                  }}
                >
                  {/* "You" Indicator Border */}
                  {player.isMe && (
                    <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--primary)' }} />
                  )}
                  {player.isMe && (
                    <div style={{ position: 'absolute', right: -20, top: -20, width: 100, height: 100, background: 'var(--primary)', filter: 'blur(40px)', opacity: 0.1, pointerEvents: 'none' }} />
                  )}

                  <div style={{
                    width: 24, textAlign: 'center',
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: 16, color: player.isMe ? 'var(--primary)' : 'var(--on-surface-dim)'
                  }}>
                    {player.rank}
                  </div>

                  <AvatarInitials
                    initials={player.initials}
                    color={player.color}
                    size={40} borderWidth={1}
                  />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{
                        fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600,
                        fontSize: 14, color: 'var(--on-surface)',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                      }}>
                        {player.name}
                      </div>
                      {player.isMe && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, color: 'var(--on-primary)',
                          backgroundColor: 'var(--primary)', padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase'
                        }}>MVP</span>
                      )}
                    </div>
                    <div style={{
                      fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: 11,
                      color: 'var(--on-surface-variant)', marginTop: 2
                    }}>
                      {muscleFilter === 'all' ? player.tier : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                      fontSize: 16, color: player.isMe ? 'var(--primary)' : 'var(--on-surface)'
                    }}>
                      {rowXP >= 1000 ? `${(rowXP / 1000).toFixed(1)}K` : rowXP}
                    </div>
                    <div style={{ fontSize: 9, textTransform: 'uppercase', fontWeight: 700, color: player.isMe ? 'var(--primary)' : 'var(--on-surface-dim)', letterSpacing: '.08em' }}>
                      XP
                    </div>
                  </div>
                </div>
                );
              })}
            </div>
            
            {leaderboardData.length > 0 && (
              <div style={{ textAlign: 'center', fontSize: 10, color: 'var(--on-surface-dim)', marginTop: 16, paddingBottom: 20 }}>
                Leaderboard updated · Tap a player to view their muscle breakdown
              </div>
            )}
          </>
        )}
      </>)}

      {/* ═══════════════════════════════════════════════════ */}
      {/* TAB 2: FRIENDS                                     */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'friends' && (
        <EmptyState
          Icon={Users}
          title="Friends Coming Soon"
          message="Connect with training partners and compete on a shared leaderboard"
        />
      )}

      {/* ═══════════════════════════════════════════════════ */}
      {/* TAB 3: MY STATS                                    */}
      {/* ═══════════════════════════════════════════════════ */}
      {activeTab === 'mystats' && (<>
        {/* Overall Rank Card */}
        <div className="card" style={{
          padding: '24px 20px', marginBottom: 16, textAlign: 'center',
          background: 'var(--surface-container-low)',
          border: 'none',
          position: 'relative', overflow: 'hidden'
        }}>
          {/* subtle glow overlay matching overall rank color */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 50% -20%, ${overall.color}20, transparent 70%)`, pointerEvents: 'none' }} />
          
          <ErrorBoundary>
            <BodyMapSVG muscleXP={muscleXP} gender={user?.gender} />
          </ErrorBoundary>

          {/* Rank Display */}
          <div className="tonal-break" style={{ marginTop: 24, padding: '16px', background: 'var(--surface-container-highest)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: overall.bg,
              border: 'none', boxShadow: `0 8px 16px ${overall.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Trophy size={28} color={overall.color} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Overall Rank</div>
              <div className="headline-lg" style={{ color: overall.color, letterSpacing: '1px', marginTop: 2 }}>{overall.name}</div>
              <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', fontWeight: 600, marginTop: 4 }}>{Math.round(overall.totalXP).toLocaleString()} Total XP</div>
            </div>
          </div>
        </div>

        {/* Rank Legend */}
        <div className="card" style={{ padding: '12px 14px', marginBottom: 14, overflow: 'hidden' }}>
          <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '.5px' }}>Rank Tiers</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {RANK_TIERS.filter((_, i) => i === 0 || i === 1 || i === 4 || i === 7 || i === 10 || i === 11 || i === 12 || i === 13).map(tier => (
              <div key={tier.name} style={{
                display: 'flex', alignItems: 'center', gap: 4,
                fontSize: 9, color: tier.color, fontWeight: 600,
                padding: '3px 8px', borderRadius: 6,
                background: typeof tier.bg === 'string' && tier.bg.startsWith('linear') ? tier.bg : tier.bg,
              }}>
                <Shield size={10} /> {tier.name}
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 14, overflowX: 'auto', paddingBottom: 2 }}>
          {filters.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: '8px 16px', borderRadius: 20, border: 'none', cursor: 'pointer',
              fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              background: filter === f.key ? 'rgba(232,84,13,.15)' : 'var(--surface-container-lowest)',
              color: filter === f.key ? 'var(--primary)' : 'var(--on-surface-variant)',
              transition: 'all .15s',
            }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Muscle Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {filtered
            .sort((a, b) => (muscleXP[b.key] || 0) - (muscleXP[a.key] || 0))
            .map(muscle => (
              <MuscleCard key={muscle.key} muscle={muscle} xp={muscleXP[muscle.key] || 0} />
            ))
          }
        </div>

      <br />
      <hr style={{ border: 'none', borderBottom: '1px solid var(--outline-variant)' }} />
      <br />
        <div className="card" style={{
          padding: '32px 20px', marginBottom: 16, textAlign: 'center',
          background: 'var(--surface-container-lowest)',
          border: 'none', position: 'relative', overflow: 'hidden'
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: `radial-gradient(circle at 50% 0%, ${overall.color}15, transparent 60%)`, pointerEvents: 'none' }} />
          
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: overall.bg,
            border: 'none', boxShadow: `0 8px 16px ${overall.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', position: 'relative', zIndex: 1
          }}>
            <Trophy size={36} color={overall.color} />
          </div>
          <div className="headline-lg" style={{ fontSize: 40, color: overall.color, letterSpacing: '1px', position: 'relative', zIndex: 1 }}>{overall.name}</div>
          <div style={{ fontSize: 16, color: 'var(--on-surface-variant)', fontWeight: 600, marginTop: 8, position: 'relative', zIndex: 1 }}>
            {Math.round(overall.totalXP).toLocaleString()} Monthly XP
          </div>

          {/* Progress to next tier */}
          {overall.progress < 1 && (
            <div style={{ marginTop: 24, maxWidth: 300, margin: '24px auto 0', position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, marginBottom: 8, textTransform: 'uppercase' }}>
                <span>{overall.name}</span>
                <span>{Math.round(overall.nextXP).toLocaleString()} XP</span>
              </div>
              <div style={{ height: 10, borderRadius: 5, background: 'var(--surface-container-highest)', overflow: 'hidden' }}>
                <div style={{
                  height: '100%', borderRadius: 5,
                  background: `linear-gradient(90deg, ${overall.color}80, ${overall.color})`,
                  width: `${overall.progress * 100}%`,
                  transition: 'width .6s cubic-bezier(.4,0,.2,1)',
                }} />
              </div>
              <div style={{ fontSize: 12, color: overall.color, fontWeight: 700, marginTop: 8 }}>
                {Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to next rank
              </div>
            </div>
          )}

          {/* Meta stats */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <div className="tonal-break" style={{ padding: '12px 18px', background: 'var(--surface-container-highest)', borderRadius: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Days Left</div>
              <div className="headline-lg" style={{ color: 'var(--primary)', marginTop: 4 }}>{daysInMonth}</div>
            </div>
            <div className="tonal-break" style={{ padding: '12px 18px', background: 'var(--surface-container-highest)', borderRadius: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>This Week</div>
              <div className="headline-lg" style={{ color: thisWeekDays >= 4 ? 'var(--success)' : 'var(--primary)', marginTop: 4 }}>{thisWeekDays}/7 <span style={{ fontSize: 12, fontFamily: 'Space Grotesk', color: 'var(--on-surface-variant)' }}>days</span></div>
            </div>
            <div className="tonal-break" style={{ padding: '12px 18px', background: 'var(--surface-container-highest)', borderRadius: 14 }}>
              <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Muscles</div>
              <div className="headline-lg" style={{ color: 'var(--on-surface)', marginTop: 4 }}>{Object.values(muscleXP).filter(v => v > 0).length}/{MUSCLE_GROUPS.length}</div>
            </div>
          </div>
        </div>

        {/* SECTION 2 — Per-Muscle League Table */}
        <div className="card" style={{ marginBottom: 16, overflow: 'hidden', border: 'none' }}>
          <div style={{ padding: '16px 20px', background: 'var(--surface-container-lowest)' }}>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={14} color="var(--primary)" /> Per-Muscle League Table
            </div>
          </div>
          {/* Header */}
          <div className="tonal-break" style={{ display: 'grid', gridTemplateColumns: '1fr 90px 80px 60px', gap: 8, padding: '10px 20px', background: 'var(--surface-container-highest)' }}>
            <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Muscle</div>
            <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Rank</div>
            <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>XP</div>
            <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', textAlign: 'right' }}>Status</div>
          </div>
          {sortedMuscles.map((muscle, i) => {
            const xp = muscleXP[muscle.key] || 0;
            const rank = getRank(xp);
            const isWeakest = muscle.key === weakestMuscle?.key && xp < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3;
            return (
              <div key={muscle.key} className="stripe" style={{
                display: 'grid', gridTemplateColumns: '1fr 90px 80px 60px', gap: 8,
                padding: '12px 20px', alignItems: 'center',
                background: isWeakest ? 'rgba(255,107,107,.08)' : 'transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ fontSize: 12, color: 'var(--on-surface-dim)', fontWeight: 700, width: 20 }}>#{i + 1}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--on-surface)' }}>{muscle.label}</div>
                </div>
                <RankBadge rank={rank} size="sm" />
                <div style={{ textAlign: 'right', fontSize: 13, fontWeight: 700, color: rank.color }}>
                  {Math.round(xp).toLocaleString()}
                </div>
                <div style={{ textAlign: 'right' }}>
                  {isWeakest ? (
                    <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', background: 'rgba(255,107,107,.15)', padding: '3px 6px', borderRadius: 4 }}>Focus</span>
                  ) : xp > 0 ? (
                    <TrendingUp size={14} color="var(--success)" />
                  ) : (
                    <Minus size={14} color="var(--on-surface-dim)" />
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 3 — Percentile Benchmarks */}
        <div className="card" style={{ padding: '20px', marginBottom: 16, border: 'none' }}>
          <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <TrendingUp size={14} color="var(--primary)" /> Where You Stand
          </div>

          {/* Benchmark bar */}
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <div style={{ height: 12, borderRadius: 6, background: 'var(--surface-container-highest)', overflow: 'hidden', position: 'relative' }}>
              <div style={{
                height: '100%', borderRadius: 6,
                background: 'linear-gradient(90deg, #CD7F32, #7A8FA6, #FFD700, #40E0D0, #FF69B4)',
                width: `${benchmarkPct}%`,
                transition: 'width .8s cubic-bezier(.4,0,.2,1)',
              }} />
            </div>
            {/* Benchmark markers */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
              {MONTHLY_BENCHMARKS.map(b => {
                const pct = (b.totalXP / MONTHLY_BENCHMARKS[MONTHLY_BENCHMARKS.length - 1].totalXP) * 100;
                return (
                  <div key={b.label} style={{
                    fontSize: 9, color: 'var(--on-surface-dim)', fontWeight: 700, textAlign: 'center',
                    position: 'absolute', left: `${pct}%`, transform: 'translateX(-50%)', top: 24,
                  }}>
                    <div style={{ width: 2, height: 8, background: 'var(--surface-container-highest)', margin: '0 auto 4px', borderRadius: 1 }} />
                    {b.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Text summary */}
          <div style={{ marginTop: 44, padding: '14px 16px', background: 'var(--surface-container-highest)', borderRadius: 12, border: 'none' }}>
            <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
              Your overall XP (<strong style={{ color: 'var(--primary)' }}>{Math.round(overall.totalXP).toLocaleString()}</strong>)
              {benchmark.lower && benchmark.upper
                ? <> places you in the <strong style={{ color: 'var(--primary)' }}>{benchmark.lower.label}–{benchmark.upper.label}</strong> range.</>
                : benchmark.lower
                  ? <> puts you beyond <strong style={{ color: 'var(--primary)' }}>{benchmark.lower.label}</strong> level. Incredible!</>
                  : <> is at the <strong style={{ color: 'var(--primary)' }}>{benchmark.upper?.label || 'Beginner'}</strong> level. Keep training!</>
              }
            </div>
          </div>
        </div>

        {/* SECTION 4 — Monthly Rank History Timeline */}
        {monthlyRankHistory && monthlyRankHistory.length > 0 && (
          <div className="card" style={{ padding: '20px', marginBottom: 16, border: 'none' }}>
            <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={14} color="var(--primary)" /> Rank History
            </div>
            <div style={{ display: 'flex', gap: 12, overflowX: 'auto', paddingBottom: 8 }}>
              {/* Current month (live) */}
              <div className="card" style={{
                padding: '16px', minWidth: 160, flexShrink: 0,
                border: 'none',
                background: `linear-gradient(135deg, var(--surface-container-lowest), ${overall.color}15)`,
                boxShadow: `0 4px 12px ${overall.color}20`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontSize: 11, color: 'var(--primary)', fontWeight: 700 }}>
                    {new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </div>
                  <span style={{ fontSize: 8, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', background: 'rgba(81,207,102,.15)', padding: '3px 6px', borderRadius: 4 }}>Live</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: overall.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 2px 8px ${overall.color}30` }}>
                    <Trophy size={18} color={overall.color} />
                  </div>
                  <div>
                    <div className="headline-md" style={{ color: overall.color }}>{overall.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontWeight: 600 }}>{Math.round(overall.totalXP).toLocaleString()} XP</div>
                  </div>
                </div>
              </div>

              {/* Past months */}
              {monthlyRankHistory.map(hist => {
                const r = getOverallRank({ fake: hist.xp });
                const isBest = bestMonth && hist.id === bestMonth.id;
                return (
                  <div key={hist.id} className="card" style={{
                    padding: '16px', minWidth: 160, flexShrink: 0,
                    border: 'none',
                    background: isBest ? 'var(--surface-container-low)' : 'var(--surface-container-lowest)',
                    position: 'relative',
                  }}>
                    {isBest && (
                      <div style={{
                        position: 'absolute', top: 0, right: 12,
                        fontSize: 8, fontWeight: 700, color: 'var(--on-primary)', textTransform: 'uppercase',
                        background: 'var(--primary)', padding: '4px 8px', borderRadius: '0 0 6px 6px',
                        boxShadow: 'var(--shadow-sm)'
                      }}>
                        <Award size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} /> Best
                      </div>
                    )}
                    <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, marginBottom: 12 }}>{hist.label}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Trophy size={18} color={r.color} />
                      </div>
                      <div>
                        <div className="headline-md" style={{ color: r.color }}>{r.name}</div>
                        <div style={{ fontSize: 11, color: 'var(--on-surface-variant)' }}>{Math.round(hist.xp).toLocaleString()} XP</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </>)}

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
