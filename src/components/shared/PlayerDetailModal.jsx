import { useState, useEffect, useMemo } from 'react';
import { Trophy, Shield, X } from 'lucide-react';
import BodyMapSVG from './BodyMapSVG';
import AvatarInitials from './AvatarInitials';
import { MUSCLE_GROUPS, getRank, getOverallRank } from '../../data/muscleData';

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

export default function PlayerDetailModal({ player, realMuscleXP, realUserName, gender, onClose }) {
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
    setTimeout(onClose, 300); // Wait for transition (.35s)
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
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }} 
      />
      
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        maxHeight: '85vh', overflowY: 'auto',
        background: 'var(--surface-container-low)',
        borderRadius: '24px 24px 0 0',
        zIndex: 1001,
        padding: '16px 20px 40px',
        transform: visible ? 'translateY(0)' : 'translateY(100%)',
        transition: 'transform 0.35s cubic-bezier(.4, 0, .2, 1)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.5)',
      }}>
        
        {/* Drag Handle */}
        <div style={{
          width: 40, height: 4, 
          background: 'var(--surface-container-highest)', 
          borderRadius: 2, 
          margin: '0 auto 20px'
        }} />

        {/* Athlete Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <AvatarInitials initials={displayInitials} color={displayColor} size={48} borderWidth={2} />
            <div>
              <div style={{ 
                fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, 
                fontSize: 18, color: 'var(--on-surface)', lineHeight: 1.2
              }}>
                {displayName}
              </div>
              <div style={{ marginTop: 4 }}>
                <RankBadge rank={overall} size="sm" />
              </div>
            </div>
          </div>
          <button 
            onClick={handleClose}
            style={{
              width: 32, height: 32, borderRadius: 16, border: 'none',
              background: 'var(--surface-container-high)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--on-surface-variant)', cursor: 'pointer',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Anatomy Visualization */}
        <div style={{ 
          maxWidth: 200, margin: '0 auto 32px', 
          position: 'relative' 
        }}>
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
          background: 'var(--surface-container-high)',
          borderRadius: 16, padding: '16px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 16
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `linear-gradient(135deg, ${overall.color}33, ${overall.color}11)`,
            border: `1px solid ${overall.color}33`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: overall.color,
            boxShadow: `0 8px 24px ${overall.color}22`
          }}>
            <Trophy size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 500, fontFamily: "'Be Vietnam Pro', sans-serif", textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 2 }}>Current Rank</div>
                <div style={{ color: overall.color, fontWeight: 700, fontSize: 16, fontFamily: "'Space Grotesk', sans-serif" }}>{overall.name}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: 'var(--on-surface)', fontWeight: 700, fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", lineHeight: 1 }}>{overall.totalXP.toLocaleString()}</div>
                <div style={{ fontSize: 10, color: 'var(--primary)', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif", textTransform: 'uppercase' }}>XP</div>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 6, width: '100%', background: 'var(--surface-container-highest)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${overall.progress}%`, background: `linear-gradient(90deg, ${overall.color}, #FFF)`, borderRadius: 3, opacity: 0.8 }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 10, color: 'var(--on-surface-variant)', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600 }}>
              <span>{overall.progress}%</span>
              <span>{overall.nextXP ? `${overall.nextXP.toLocaleString()} XP to Next` : 'Max Rank'}</span>
            </div>
          </div>
        </div>

        {/* Per-Muscle Breakdown Table */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ 
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 700, 
            color: 'var(--on-surface)', marginBottom: 16, paddingLeft: 4 
          }}>
            Muscle Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {sortedMuscles.map(m => (
              <div key={m.key} style={{
                background: 'rgba(53,52,55,0.2)', // Very subtle glass
                borderRadius: 12, padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ 
                    fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, 
                    fontSize: 14, color: 'var(--on-surface)', minWidth: 80
                  }}>
                    {m.label}
                  </div>
                  <RankBadge rank={m.rankInfo} size="sm" />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: 80 }}>
                  <div style={{ 
                    fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700,
                    fontSize: 14, color: m.rankInfo.color 
                  }}>
                    {m.xp.toLocaleString()} <span style={{ fontSize: 9 }}>XP</span>
                  </div>
                  {/* Subtle bar */}
                  <div style={{ 
                    height: 2, width: 40, background: 'var(--surface-container-highest)', 
                    borderRadius: 1, marginTop: 4, overflow: 'hidden' 
                  }}>
                    <div style={{ height: '100%', width: `${m.rankInfo.progress}%`, background: m.rankInfo.color }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Close Button */}
        <button 
          onClick={handleClose}
          style={{
            width: '100%', padding: '16px', borderRadius: 16,
            background: 'var(--surface-container-highest)',
            border: '1px solid var(--outline-variant)',
            color: 'var(--on-surface)',
            fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, fontSize: 14,
            cursor: 'pointer'
          }}
        >
          Close Profile
        </button>
      </div>
    </>
  );
}
