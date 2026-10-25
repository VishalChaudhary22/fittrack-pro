// ─── useOlympus ──────────────────────────────────────────────────────────────
// All data logic for the Olympus League screen (leaderboard fetch + Supabase
// realtime refresh, rank/XP derivations), extracted from the V1 MuscleMapPage
// (Kaaya Volt V-5) so both skins render the same brain. The V1 page is a pure
// consumer; Volt's Olympus page consumes this identically.
import { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { useScrollRestoration } from './useScrollRestoration';
import { MUSCLE_GROUPS, calcAllMuscleXP, getOverallRank, getTierColor } from '../../data/muscleData';
import { MONTHLY_BENCHMARKS, getBenchmarkBracket } from '../../data/rankBenchmarks';
import { fetchLeaderboard, syncUserXPToCache, getCurrentMonth } from '../../utils/xpCacheSync';
import { supabase } from '../../lib/supabaseClient';

const muscleMapTabCache = { activeTab: 'leaderboard' };

export function useOlympus() {
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

  // ─── TAB PILLS ─────────────────────────────────────────────────────────
  const tabs = [
    { key: 'leaderboard', label: 'Global' },
    { key: 'friends', label: 'Friends' },
    { key: 'mystats', label: 'My Stats' },
  ];

  return {
    activeTab,
    benchmark,
    benchmarkPct,
    bestMonth,
    daysInMonth,
    filter,
    filterOpen,
    filterRef,
    filtered,
    filteredLeaderboard,
    filters,
    fullLeaderboard,
    leaderboardData,
    leaderboardError,
    leaderboardLoading,
    loadLeaderboard,
    monthlyRankHistory,
    muscleFilter,
    muscleXP,
    myRank,
    overall,
    podium,
    selectedMonth,
    selectedPlayer,
    setActiveTab,
    setActiveTabRaw,
    setFilter,
    setFilterOpen,
    setLeaderboardData,
    setLeaderboardError,
    setLeaderboardLoading,
    setMuscleFilter,
    setSelectedMonth,
    setSelectedPlayer,
    sortedMuscles,
    splits,
    tabs,
    thisWeekDays,
    topPercent,
    user,
    weakestMuscle,
    workoutLogs,
  };
}
