import { useState, useMemo } from 'react';
import { Shield, Trophy, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../shared/SharedComponents';
import BodyMapSVG from '../shared/BodyMapSVG';
import {
  MUSCLE_GROUPS, RANK_TIERS, getRank, calcAllMuscleXP, getOverallRank
} from '../../data/muscleData';

// ─── RANK BADGE ──────────────────────────────────────────────────────────────
const RankBadge = ({ rank, size = 'md' }) => {
  const sz = size === 'sm' ? { fs: 8, px: 6, py: 2, icon: 10 } : { fs: 10, px: 10, py: 4, icon: 12 };
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
    <div className="card" style={{
      padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14,
      border: `1px solid ${rank.color}18`,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: rank.bg, border: `1px solid ${rank.color}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Shield size={18} color={rank.color} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>{muscle.label}</div>
          <RankBadge rank={rank} size="sm" />
        </div>
        <div style={{ position: 'relative', height: 6, borderRadius: 3, background: 'var(--c3)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 3,
            background: `linear-gradient(90deg, ${rank.color}80, ${rank.color})`,
            width: `${rank.progress * 100}%`,
            transition: 'width .6s cubic-bezier(.4,0,.2,1)',
          }} />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontSize: 11, fontWeight: 600, color: 'var(--t2)',
          marginTop: 4
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
  const [filter, setFilter] = useState('all');

  const muscleXP = useMemo(
    () => calcAllMuscleXP(workoutLogs, splits, user?.id),
    [workoutLogs, splits, user?.id]
  );

  const overall = useMemo(() => getOverallRank(muscleXP), [muscleXP]);

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

  return (
    <div className="pg-in">
      <PageHeader title="Muscle Rankings" sub="Track your muscle development progress" />

      {/* Overall Rank Card */}
      <div className="card" style={{
        padding: '24px 20px', marginBottom: 14, textAlign: 'center',
        background: 'linear-gradient(135deg, var(--c1) 0%, rgba(232,84,13,.06) 100%)',
        border: `1px solid ${overall.color}20`,
      }}>
        <BodyMapSVG muscleXP={muscleXP} gender={user?.gender} />

        {/* Rank Display */}
        <div style={{ marginTop: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14,
            background: overall.bg,
            border: `2px solid ${overall.color}40`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={24} color={overall.color} />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px' }}>Overall Rank</div>
            <div className="bb" style={{ fontSize: 28, color: overall.color, letterSpacing: '1px' }}>{overall.name}</div>
            <div style={{ fontSize: 13, color: 'var(--t2)', fontWeight: 600 }}>{Math.round(overall.totalXP).toLocaleString()} Total XP</div>
          </div>
        </div>
      </div>

      {/* Previous Months History */}
      {monthlyRankHistory && monthlyRankHistory.length > 0 && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '.5px', padding: '0 2px' }}>Past Performance</div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 6 }}>
            {monthlyRankHistory.map(hist => {
              const r = getOverallRank({ fake: hist.xp }); // Hack: pass muscleXP object that totals hist.xp to getOverallRank
              return (
                <div key={hist.id} className="card" style={{ padding: '12px 14px', minWidth: 156, flexShrink: 0, border: `1px solid ${r.color}20`, background: 'var(--bg)' }}>
                  <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 600, marginBottom: 8 }}>{hist.label}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 10, background: r.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Trophy size={16} color={r.color} />
                    </div>
                    <div>
                      <div className="bb" style={{ fontSize: 14, color: r.color }}>{r.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--t2)' }}>{Math.round(hist.xp).toLocaleString()} XP</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Rank Legend */}
      <div className="card" style={{ padding: '12px 14px', marginBottom: 14, overflow: 'hidden' }}>
        <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8, letterSpacing: '.5px' }}>Rank Tiers</div>
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
            background: filter === f.key ? 'var(--o2)' : 'var(--c1)',
            color: filter === f.key ? 'var(--o)' : 'var(--t2)',
            border: `1px solid ${filter === f.key ? 'rgba(232,84,13,.2)' : 'var(--bd)'}`,
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
    </div>
  );
}
