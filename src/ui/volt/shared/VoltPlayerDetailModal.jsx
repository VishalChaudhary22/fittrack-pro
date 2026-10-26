import { useState, useEffect, useMemo } from 'react';
import { Trophy, Shield, X } from 'lucide-react';
import BodyMapSVG from '../../v1/shared/BodyMapSVG';
import AvatarInitials from '../../v1/shared/AvatarInitials';
import { MUSCLE_GROUPS, getRank, getOverallRank } from '../../../data/muscleData';
import { VoltPill, VoltLabel } from '../primitives';

// Volt twin of V1's PlayerDetailModal — identical data derivation (overall
// rank, per-muscle ranks, sorted breakdown). Presentation: Volt sheet on the
// drawer curve. BodyMapSVG renders in its native colors (PR #26 decision).
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

export default function VoltPlayerDetailModal({ player, realMuscleXP, realUserName, gender, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Scroll lock on mount
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Slide up animation trigger
    requestAnimationFrame(() => setVisible(true));

    return () => { document.body.style.overflow = prev; };
  }, []);

  const handleClose = () => {
    // Animate out before unmounting
    setVisible(false);
    setTimeout(onClose, 300);
  };

  const displayXP = player ? player.muscleXP : realMuscleXP;
  const displayName = player ? player.name : realUserName;
  const displayInitials = player ? player.initials : (realUserName.slice(0, 2).toUpperCase() || 'U');
  const displayColor = player ? player.color : '#FFB59B';

  const overall = useMemo(() => getOverallRank(displayXP), [displayXP]);

  // Sort muscles from highest XP to lowest
  const sortedMuscles = useMemo(() => {
    return MUSCLE_GROUPS.map(m => {
      const xp = displayXP[m.key] || 0;
      const rankInfo = getRank(xp);
      return { ...m, xp, rankInfo };
    }).sort((a, b) => b.xp - a.xp);
  }, [displayXP]);

  return (
    <>
      <div
        onClick={handleClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.65)',
          zIndex: 1200,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      />

      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxWidth: 480, margin: '0 auto',
        maxHeight: '86dvh', overflowY: 'auto',
        background: 'var(--v-panel)', color: 'var(--v-ink)',
        borderTop: '2.5px solid var(--v-edge)', borderLeft: '2.5px solid var(--v-edge)', borderRight: '2.5px solid var(--v-edge)',
        borderRadius: '24px 24px 0 0',
        boxShadow: '0 -6px 0 var(--v-shadow)',
        zIndex: 1201,
        padding: '12px 20px calc(34px + env(safe-area-inset-bottom, 0px))',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.34s cubic-bezier(0.32, 0.72, 0, 1)',
      }}
        role="dialog"
        aria-modal="true"
      >
        {/* Drag Handle */}
        <div aria-hidden="true" style={{ width: 44, height: 5, borderRadius: 3, background: 'var(--v-edge)', opacity: .45, margin: '0 auto 18px' }} />

        {/* Athlete Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 22 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AvatarInitials initials={displayInitials} color={displayColor} size={48} borderWidth={2} />
            <div>
              <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                {displayName}
              </div>
              <div style={{ marginTop: 5 }}>
                <VoltRankBadge rank={overall} size="sm" />
              </div>
            </div>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close"
            className="v-press"
            style={{
              width: 36, height: 36, borderRadius: '50%',
              background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--v-ink)', cursor: 'pointer',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Anatomy Visualization */}
        <div style={{ maxWidth: 200, margin: '0 auto 28px', position: 'relative' }}>
          {/* Subtle glow behind the body map */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 120, height: 180,
            background: overall.color,
            filter: 'blur(60px)', opacity: 0.15,
            pointerEvents: 'none'
          }} />
          <BodyMapSVG muscleXP={displayXP} gender={gender || 'male'} />
        </div>

        {/* Overall Rank Block */}
        <div style={{
          border: '2px solid var(--v-edge-quiet)',
          borderRadius: 16, padding: 16, marginBottom: 22,
          display: 'flex', alignItems: 'center', gap: 14,
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, flexShrink: 0,
            background: `linear-gradient(135deg, ${overall.color}33, ${overall.color}11)`,
            border: `2px solid ${overall.color}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: overall.color,
          }}>
            <Trophy size={24} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
              <div>
                <VoltLabel>Current Rank</VoltLabel>
                <div style={{ color: overall.color, fontWeight: 800, fontSize: 16, marginTop: 2 }}>{overall.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="v-num" style={{ fontSize: 18, lineHeight: 1 }}>{overall.totalXP.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'var(--v-volt-text)', fontWeight: 800, textTransform: 'uppercase', marginTop: 2 }}>XP</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 7, width: '100%', border: '1.5px solid var(--v-edge)', borderRadius: 4, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overall.progress * 100}%`, background: overall.color, transition: 'width .6s cubic-bezier(0.23,1,0.32,1)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 600 }}>
              <span>{Math.round(overall.progress * 100)}%</span>
              <span>{overall.nextXP ? `${overall.nextXP.toLocaleString()} XP to Next` : 'Max Rank'}</span>
            </div>
          </div>
        </div>

        {/* Per-Muscle Breakdown Table */}
        <div style={{ marginBottom: 26 }}>
          <div style={{ fontSize: 16, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 14 }}>
            Muscle Breakdown
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {sortedMuscles.map(m => (
              <div key={m.key} style={{
                border: '2px solid var(--v-edge-quiet)',
                borderRadius: 12, padding: '11px 14px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, minWidth: 74 }}>
                    {m.label}
                  </div>
                  <VoltRankBadge rank={m.rankInfo} size="sm" />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 76 }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 14, color: m.rankInfo.color }}>
                    {m.xp.toLocaleString()} <span style={{ fontSize: 9 }}>XP</span>
                  </div>
                  {/* Subtle bar */}
                  <div style={{
                    height: 3, width: 44, background: 'var(--v-edge-quiet)',
                    borderRadius: 2, marginTop: 4, overflow: 'hidden',
                  }}>
                    <div style={{ height: '100%', width: `${m.rankInfo.progress * 100}%`, background: m.rankInfo.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <VoltPill ghost onClick={handleClose} style={{ width: '100%' }}>
          Close Profile
        </VoltPill>
      </div>
    </>
  );
}
