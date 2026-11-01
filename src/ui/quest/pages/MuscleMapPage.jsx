import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AvatarInitials from '../../v1/shared/AvatarInitials';
import { Portal } from '../../v1/shared/SharedComponents';
import { MUSCLE_GROUPS, RANK_TIERS, getRank, getOverallRank } from '../../../data/muscleData';
import { MUSCLE_LABELS } from '../../../utils/readinessUtils';
import { MONTHLY_BENCHMARKS } from '../../../data/rankBenchmarks';
import { getCurrentMonth } from '../../../utils/xpCacheSync';
import { fmt } from '../../../utils/helpers';
import { useOlympus } from '../../../core/hooks/useOlympus';
import { useMuscleMapData } from '../../../core/hooks/useMuscleMapData';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel, SegBar } from '../primitives';
import PixelSprite from '../PixelSprite';
import PixelBodyMap from '../PixelBodyMap';

// ─── Kaaya Quest · Olympus + body map (Q-4, plan §7.3 + §7.4) ────────────────
// HIGH SCORES, not a podium port: a gold champion panel over the ranked
// arcade table (your row framed in volt, badged YOU), month navigation as
// cartridge controls, Global / Friends / My Stats as cartridge tabs.
// Realtime updates flash the changed row's border (§6.2). My Stats carries
// the pixel body map: zones keyed to MUSCLE_GROUPS, coloured by what
// actually happened — trained today (volt, pulsing), recovering (ember
// dither), trained this week (volt-dk), fresh — over the today panel fed
// by core's todayMuscleXP extension. Same useOlympus brain as V1/Volt.

const fmtK = (xp) => (xp >= 1000 ? `${(xp / 1000).toFixed(1)}K` : `${Math.round(xp)}`);

function TierTag({ name, color }) {
  return (
    <span className="q-chip" style={{ background: color, color: 'var(--q-btn-fg)', padding: '4px 8px', fontSize: 8 }}>
      {name}
    </span>
  );
}

function QuestPlayerSheet({ player, onClose }) {
  if (!player) return null;
  const top = MUSCLE_GROUPS
    .map(m => ({ ...m, xp: player.muscleXP?.[m.key] || 0 }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 6);
  const max = Math.max(1, ...top.map(m => m.xp));
  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onClose}>
        <div className="q-sheet" role="dialog" aria-label={`${player.name} breakdown`} onClick={e => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <QuestLabel tone="volt">Player Card</QuestLabel>
              <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.5, marginTop: 8 }}>{player.name}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 9 }}>
                <TierTag name={player.tier} color={player.rankColor || 'var(--q-gold)'} />
                <span className="q-meta">{Math.round(player.totalXP).toLocaleString()} TOTAL XP</span>
              </div>
            </div>
            <button type="button" className="q-chip" onClick={onClose} style={{ cursor: 'pointer' }} aria-label="Close"><PixelSprite name="x" size={11} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, marginTop: 16 }}>
            {top.map(m => (
              <div key={m.key}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 18 }}>{m.label}</span>
                  <span className="q-meta">{Math.round(m.xp).toLocaleString()} XP</span>
                </div>
                <SegBar value={m.xp / max} segments={10} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Portal>
  );
}

export default function MuscleMapPage({ chatbot }) {
  const navigate = useNavigate();
  const {
    user, monthlyRankHistory, activeTab, setActiveTab, selectedPlayer, setSelectedPlayer,
    filter, setFilter, muscleFilter, setMuscleFilter,
    selectedMonth, setSelectedMonth, leaderboardData, leaderboardLoading, leaderboardError,
    setLeaderboardError, loadLeaderboard, muscleXP, overall, filteredLeaderboard,
    myRank, topPercent, filtered, filters, daysInMonth, thisWeekDays, sortedMuscles,
    weakestMuscle, benchmark, benchmarkPct, bestMonth, tabs,
  } = useOlympus();
  const { todayXP, todaySets, lastTrained, recovery } = useMuscleMapData();

  const [side, setSide] = useState('front');
  const [zoneKey, setZoneKey] = useState(null);

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

  // ── Realtime row flash (§6.2): border flashes volt when an XP changes ──
  const prevXPRef = useRef({});
  const [flashIds, setFlashIds] = useState(() => new Set());
  useEffect(() => {
    const changed = [];
    filteredLeaderboard.forEach(p => {
      if (prevXPRef.current[p.id] !== undefined && prevXPRef.current[p.id] !== p.totalXP) changed.push(p.id);
      prevXPRef.current[p.id] = p.totalXP;
    });
    if (!changed.length) return undefined;
    setFlashIds(new Set(changed));
    const t = setTimeout(() => setFlashIds(new Set()), 1400);
    return () => clearTimeout(t);
  }, [filteredLeaderboard]);

  // ── Body-map zone states (§7.4 precedence: today → recovering → week) ──
  const zoneStates = useMemo(() => {
    const states = {};
    const now = Date.now();
    for (const m of MUSCLE_GROUPS) {
      if ((todayXP[m.key] || 0) > 0) states[m.key] = 'today';
      else if (recovery[m.key] && recovery[m.key].status !== 'optimal') states[m.key] = 'recovering';
      else if (lastTrained[m.key] && now - new Date(lastTrained[m.key] + 'T00:00:00').getTime() < 7 * 86400000) states[m.key] = 'week';
      else states[m.key] = 'fresh';
    }
    return states;
  }, [todayXP, recovery, lastTrained]);

  const todayRows = useMemo(
    () => MUSCLE_GROUPS
      .filter(m => (todayXP[m.key] || 0) > 0)
      .map(m => ({ ...m, xp: todayXP[m.key], sets: todaySets[m.key] || 0, rec: recovery[m.key] }))
      .sort((a, b) => b.xp - a.xp),
    [todayXP, todaySets, recovery]
  );

  const champion = filteredLeaderboard[0];
  const sheetPlayer = selectedPlayer
    ? (selectedPlayer.isMe
      ? { name: `${user?.name || 'You'} (You)`, tier: overall.name, totalXP: overall.totalXP, muscleXP, rankColor: overall.color }
      : { ...selectedPlayer, rankColor: undefined })
    : null;
  const zoneRank = zoneKey ? getRank(muscleXP[zoneKey] || 0) : null;

  return (
    <div className="q-screen">
      <header>
        <QuestLabel tone="volt">Your monthly strength league — ascend Olympus</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 21, margin: '10px 0 0', textTransform: 'uppercase' }}>High Scores</h1>
      </header>

      {/* Standing strip */}
      {activeTab === 'leaderboard' && (
        <QuestBlock variant="panel2">
          <QuestLabel tone="volt">Your Standing</QuestLabel>
          <div className="q-ps" style={{ fontSize: 16, lineHeight: 1.5, marginTop: 9 }}>
            {leaderboardLoading
              ? 'FETCHING YOUR RANK…'
              : myRank === undefined
                ? 'SYNCING TO LEADERBOARD…'
                : myRank === 1
                  ? 'YOU ARE #1!'
                  : topPercent <= 50
                    ? `TOP ${topPercent}%`
                    : `RANK #${myRank}`}
          </div>
          <div className="q-meta" style={{ marginTop: 6, fontSize: 18 }}>
            {overall.progress < 1
              ? `${Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP to reach the next tier`
              : 'Max tier reached'}
          </div>
        </QuestBlock>
      )}

      {/* Cartridge tabs */}
      <div style={{ display: 'flex', gap: 8 }}>
        {tabs.map(t => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActiveTab(t.key)}
            className="q-btn q-btn--sm"
            style={activeTab === t.key
              ? { flex: 1 }
              : { flex: 1, background: 'var(--q-panel)', color: 'var(--q-dim)', boxShadow: '4px 4px 0 rgba(0,0,0,0.45)' }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Month cartridge controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
        <button type="button" aria-label="Previous month" onClick={() => monthShift(-1)} className="q-chip" style={{ cursor: 'pointer', padding: '8px 10px' }}>
          <PixelSprite name="chevL" size={12} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 178, justifyContent: 'center' }}>
          <span className="q-ps" style={{ fontSize: 11, color: isCurrentMonth ? 'var(--q-volt-text)' : 'var(--q-ink)' }}>
            {monthLabel.toUpperCase()}
          </span>
          {isCurrentMonth && <QuestChip tone="ember">Live</QuestChip>}
        </div>
        <button type="button" aria-label="Next month" onClick={() => monthShift(1)} disabled={isCurrentMonth} className="q-chip" style={{ cursor: isCurrentMonth ? 'default' : 'pointer', padding: '8px 10px', opacity: isCurrentMonth ? 0.35 : 1 }}>
          <PixelSprite name="chevR" size={12} />
        </button>
      </div>

      {activeTab === 'leaderboard' && (
        <>
          {/* Champion panel */}
          {!leaderboardLoading && !leaderboardError && champion && (
            <QuestBlock
              variant="panel2"
              onClick={() => setSelectedPlayer(champion)}
              style={{ cursor: 'pointer', borderColor: 'var(--q-gold)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <PixelSprite name="crown" size={40} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <QuestLabel tone="gold">Champion</QuestLabel>
                  <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.5, marginTop: 6, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {champion.name}
                  </div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8, flexWrap: 'wrap' }}>
                    <span className="q-meta">{champion.tier.toUpperCase()}</span>
                    {champion.isMe && <QuestChip tone="volt">You</QuestChip>}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div className="q-ps" style={{ fontSize: 17, color: 'var(--q-gold-text)' }}>
                    {fmtK(muscleFilter === 'all' ? champion.totalXP : (champion.muscleXP?.[muscleFilter] || 0))}
                  </div>
                  <div className="q-meta" style={{ marginTop: 4 }}>XP</div>
                </div>
              </div>
              {overall.progress < 1 && champion.isMe && (
                <>
                  <SegBar value={overall.progress} tone="gold" segments={12} style={{ marginTop: 14 }} />
                  <div className="q-meta" style={{ marginTop: 7 }}>
                    {Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP TO {overall.nextName || 'NEXT TIER'}
                  </div>
                </>
              )}
            </QuestBlock>
          )}

          {/* Muscle filter cartridges */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {[{ key: 'all', label: 'All Muscles' }, ...MUSCLE_GROUPS].map(m => (
              <button
                key={m.key}
                type="button"
                className={`q-chip${muscleFilter === m.key ? ' q-chip--volt' : ''}`}
                onClick={() => setMuscleFilter(m.key)}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {m.label}
              </button>
            ))}
          </div>

          {leaderboardLoading && (
            <QuestBlock flat style={{ textAlign: 'center', padding: 26 }}>
              <span className="q-ps" style={{ fontSize: 13 }}>LOADING<span className="q-blink" aria-hidden="true" style={{ display: 'inline-block', width: 9, height: 12, background: 'var(--q-ink)', marginLeft: 3, verticalAlign: '-1px' }} /></span>
            </QuestBlock>
          )}

          {leaderboardError && !leaderboardLoading && (
            <QuestBlock style={{ textAlign: 'center', padding: 26 }}>
              <p className="q-meta" style={{ margin: '0 0 15px', fontSize: 19 }}>{leaderboardError}</p>
              <QuestBtn sm tone="ghost" onClick={() => { setLeaderboardError(null); loadLeaderboard(); }}>Retry</QuestBtn>
            </QuestBlock>
          )}

          {!leaderboardLoading && !leaderboardError && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {filteredLeaderboard.map(player => {
                  const rowXP = muscleFilter === 'all' ? player.totalXP : (player.muscleXP?.[muscleFilter] || 0);
                  const isZero = rowXP === 0;
                  const rankColor = player.rank === 1 ? 'var(--q-gold-text)' : player.rank === 3 ? 'var(--q-ember-text)' : undefined;
                  return (
                    <div
                      key={player.id}
                      onClick={() => setSelectedPlayer(player)}
                      className={flashIds.has(player.id) ? 'q-row-flash' : undefined}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                        background: 'var(--q-panel)', border: `3px solid ${player.isMe ? 'var(--q-volt)' : 'var(--q-border)'}`,
                        boxShadow: '4px 4px 0 rgba(0,0,0,0.45)', padding: '10px 12px',
                        opacity: isZero && !player.isMe ? 0.55 : 1,
                      }}
                    >
                      <span className="q-ps" style={{ fontSize: 14, width: 26, textAlign: 'center', color: rankColor || (player.isMe ? 'var(--q-volt-text)' : 'var(--q-dim)'), flexShrink: 0 }}>
                        {player.rank}
                      </span>
                      <AvatarInitials initials={player.initials} color={player.color} size={38} borderWidth={1} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                          <span style={{ fontSize: 20, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{player.name}</span>
                          {player.isMe && <QuestChip tone="volt">You</QuestChip>}
                        </div>
                        <div className="q-meta" style={{ fontSize: 15 }}>
                          {muscleFilter === 'all' ? player.tier : MUSCLE_GROUPS.find(m => m.key === muscleFilter)?.label}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div className="q-ps" style={{ fontSize: 14, color: player.isMe ? 'var(--q-volt-text)' : isZero ? 'var(--q-dim)' : 'var(--q-ink)' }}>{fmtK(rowXP)}</div>
                        <div className="q-meta" style={{ fontSize: 13 }}>XP</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {leaderboardData.length > 0 && (
                <div className="q-meta" style={{ textAlign: 'center', fontSize: 15 }}>
                  Leaderboard updated · Tap a player to view their muscle breakdown
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'friends' && (
        <QuestBlock style={{ textAlign: 'center', padding: 30 }}>
          <PixelSprite name="person" size={34} style={{ margin: '0 auto' }} />
          <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 12 }}>FRIENDS<br />COMING SOON</div>
          <p className="q-meta" style={{ margin: '9px auto 0', maxWidth: 300, fontSize: 18 }}>
            Connect with training partners and compete on a shared leaderboard
          </p>
        </QuestBlock>
      )}

      {activeTab === 'mystats' && (
        <>
          {/* ── Pixel body map + today panel (§7.4) ── */}
          <QuestBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
              <QuestLabel tone="volt">Pixel Body Map</QuestLabel>
              <div style={{ display: 'flex', gap: 7 }}>
                {['front', 'back'].map(v => (
                  <button
                    key={v}
                    type="button"
                    className={`q-chip${side === v ? ' q-chip--volt' : ''}`}
                    onClick={() => setSide(v)}
                    style={{ cursor: 'pointer' }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 14 }}>
              <PixelBodyMap
                side={side}
                gender={user?.gender}
                states={zoneStates}
                selectedKey={zoneKey}
                onSelect={setZoneKey}
                width={248}
              />
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px 14px', justifyContent: 'center', marginTop: 14 }}>
              {[
                { label: 'Trained today', bg: 'var(--q-volt)' },
                { label: 'Recovering', bg: null },
                { label: 'This week', bg: 'var(--q-volt-dk)' },
                { label: 'Fresh', bg: 'var(--q-panel2)' },
              ].map(item => (
                <span key={item.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 16 }}>
                  <span style={item.bg
                    ? { width: 12, height: 12, background: item.bg, border: '2px solid var(--q-border)', flexShrink: 0 }
                    : {
                      width: 12, height: 12, border: '2px solid var(--q-border)', flexShrink: 0,
                      backgroundImage: 'conic-gradient(var(--q-ember) 25%, var(--q-panel2) 0 50%, var(--q-ember) 0 75%, var(--q-panel2) 0)',
                      backgroundSize: '8px 8px',
                    }} />
                  {item.label}
                </span>
              ))}
            </div>
            <div className="q-meta" style={{ textAlign: 'center', marginTop: 9, fontSize: 15 }}>Tap a muscle for its full stat sheet</div>
          </QuestBlock>

          {/* Today panel */}
          {todayRows.length > 0 ? (
            <QuestBlock variant="panel2">
              <QuestLabel tone="gold">Trained Today</QuestLabel>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 12 }}>
                {todayRows.map(m => (
                  <div key={m.key} style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'var(--q-panel)', border: '3px solid var(--q-border)', padding: '9px 11px' }}>
                    <span style={{ flex: 1, fontSize: 20 }}>{m.label}</span>
                    <span className="q-ps" style={{ fontSize: 11, color: 'var(--q-gold-text)' }}>+{Math.round(m.xp)} XP</span>
                    <span className="q-meta">{m.sets} SETS</span>
                    {m.rec && <span className="q-meta" style={{ fontSize: 15 }}>{m.rec.label.toUpperCase()}</span>}
                  </div>
                ))}
              </div>
            </QuestBlock>
          ) : (
            <QuestBlock variant="panel2" style={{ textAlign: 'center', padding: 24 }}>
              <span style={{ display: 'inline-flex' }}>
                <PixelSprite name="heartMono" size={26} style={{ color: 'var(--q-dim)' }} className="q-heart q-heart--slow" />
              </span>
              <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.6, marginTop: 10 }}>REST DAY — RECOVERY +</div>
              <p className="q-meta" style={{ margin: '8px 0 0', fontSize: 18 }}>
                No training logged today. Your muscles are rebuilding.
              </p>
            </QuestBlock>
          )}

          {/* Overall rank strip */}
          <QuestBlock flat>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{ background: overall.bg, border: '3px solid var(--q-border)', padding: 10, display: 'inline-flex', flexShrink: 0 }}>
                <PixelSprite name="trophy" size={26} />
              </span>
              <div>
                <div className="q-meta">OVERALL RANK</div>
                <div className="q-ps" style={{ fontSize: 16, color: overall.color, marginTop: 4 }}>{overall.name}</div>
                <div className="q-meta" style={{ marginTop: 4 }}>{Math.round(overall.totalXP).toLocaleString()} TOTAL XP</div>
              </div>
            </div>
          </QuestBlock>

          {/* Rank tier legend */}
          <QuestBlock flat style={{ padding: '13px 15px' }}>
            <QuestLabel>Rank Tiers</QuestLabel>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 10 }}>
              {RANK_TIERS.filter((_, i) => i === 0 || i === 1 || i === 4 || i === 7 || i === 10 || i === 11 || i === 12 || i === 13).map(tier => (
                <TierTag key={tier.name} name={tier.name} color={tier.color} />
              ))}
            </div>
          </QuestBlock>

          {/* Region filters */}
          <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 2, scrollbarWidth: 'none' }}>
            {filters.map(f => (
              <button
                key={f.key}
                type="button"
                className={`q-chip${filter === f.key ? ' q-chip--volt' : ''}`}
                onClick={() => setFilter(f.key)}
                style={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Muscle mastery rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[...filtered]
              .sort((a, b) => (muscleXP[b.key] || 0) - (muscleXP[a.key] || 0))
              .map(muscle => {
                const xp = muscleXP[muscle.key] || 0;
                const rank = getRank(xp);
                return (
                  <QuestBlock key={muscle.key} flat style={{ padding: '13px 15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 20 }}>{muscle.label}</span>
                      <TierTag name={rank.name} color={rank.color} />
                    </div>
                    <SegBar value={rank.progress} segments={12} style={{ marginTop: 10 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 7 }}>
                      <span className="q-ps" style={{ fontSize: 11, color: 'var(--q-volt-text)' }}>{Math.round(xp).toLocaleString()} XP</span>
                      <span className="q-meta" style={{ fontSize: 15 }}>
                        {rank.progress < 1 ? `NEXT: ${Math.round(rank.nextXP).toLocaleString()} XP` : 'MAX TIER'}
                      </span>
                    </div>
                  </QuestBlock>
                );
              })}
          </div>

          {/* Big rank card */}
          <QuestBlock variant="panel2" style={{ textAlign: 'center' }}>
            <PixelSprite name="trophy" size={40} style={{ margin: '0 auto' }} />
            <div className="q-ps" style={{ fontSize: 24, color: overall.color, marginTop: 10 }}>{overall.name}</div>
            <div className="q-meta" style={{ marginTop: 7, fontSize: 19 }}>
              {Math.round(overall.totalXP).toLocaleString()} MONTHLY XP
            </div>
            {overall.progress < 1 && (
              <div style={{ maxWidth: 320, margin: '18px auto 0' }}>
                <SegBar value={overall.progress} tone="gold" segments={12} />
                <div className="q-meta" style={{ marginTop: 8 }}>
                  {Math.round(overall.nextXP - overall.totalXP).toLocaleString()} XP TO NEXT RANK
                </div>
              </div>
            )}
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 18, flexWrap: 'wrap' }}>
              {[
                { l: 'Days Left', v: daysInMonth },
                { l: 'This Week', v: `${thisWeekDays}/7` },
                { l: 'Muscles', v: `${Object.values(muscleXP).filter(v => v > 0).length}/${MUSCLE_GROUPS.length}` },
              ].map(s => (
                <div key={s.l} style={{ background: 'var(--q-panel)', border: '3px solid var(--q-border)', padding: '9px 14px', minWidth: 86 }}>
                  <div className="q-meta" style={{ fontSize: 13 }}>{s.l.toUpperCase()}</div>
                  <div className="q-ps" style={{ fontSize: 14, marginTop: 5 }}>{s.v}</div>
                </div>
              ))}
            </div>
          </QuestBlock>

          {/* Per-muscle league table */}
          <QuestBlock style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '14px 16px 10px' }}>
              <QuestLabel>Per-Muscle League Table</QuestLabel>
            </div>
            {sortedMuscles.map((muscle, i) => {
              const xp = muscleXP[muscle.key] || 0;
              const rank = getRank(xp);
              const isWeakest = muscle.key === weakestMuscle?.key && xp < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3;
              return (
                <div key={muscle.key} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px', borderTop: '3px solid var(--q-border)', background: isWeakest ? 'var(--q-panel2)' : 'transparent' }}>
                  <span className="q-meta" style={{ width: 24 }}>#{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 19, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{muscle.label}</span>
                  <span style={{ fontSize: 16, color: rank.color }}>{rank.name}</span>
                  <span className="q-ps" style={{ fontSize: 11, width: 64, textAlign: 'right' }}>{Math.round(xp).toLocaleString()}</span>
                  <span style={{ width: 52, textAlign: 'right' }}>
                    {isWeakest
                      ? <span className="q-meta" style={{ color: 'var(--q-ember-text)', fontSize: 14 }}>FOCUS</span>
                      : xp > 0
                        ? <span className="q-meta" style={{ color: 'var(--q-volt-text)', fontSize: 14 }}>UP</span>
                        : <span className="q-meta" style={{ fontSize: 14 }}>—</span>}
                  </span>
                </div>
              );
            })}
            {weakestMuscle && (muscleXP[weakestMuscle.key] || 0) < (muscleXP[sortedMuscles[0]?.key] || 0) * 0.3 && (
              <div style={{ padding: '14px 16px', borderTop: '3px solid var(--q-border)' }}>
                <QuestBtn
                  tone="ember"
                  onClick={() => {
                    if (chatbot) {
                      chatbot.openChat();
                      setTimeout(() => chatbot.sendMessage(`How can I improve my ${weakestMuscle.label} strength?`), 300);
                    }
                  }}
                  style={{ width: '100%' }}
                >
                  Ask FORGE: Improve {weakestMuscle.label}
                </QuestBtn>
              </div>
            )}
          </QuestBlock>

          {/* Benchmarks */}
          <QuestBlock>
            <QuestLabel>Where You Stand</QuestLabel>
            <SegBar value={benchmarkPct / 100} tone="gold" segments={20} style={{ margin: '14px 0 10px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {MONTHLY_BENCHMARKS.map(b => (
                <span key={b.label} className="q-meta" style={{ fontSize: 12 }}>{b.label.toUpperCase()}</span>
              ))}
            </div>
            <p style={{ fontSize: 19, lineHeight: 1.45, margin: '14px 0 0' }}>
              Your overall XP (<strong style={{ color: 'var(--q-volt-text)' }}>{Math.round(overall.totalXP).toLocaleString()}</strong>)
              {benchmark.lower && benchmark.upper
                ? <> places you in the <strong style={{ color: 'var(--q-volt-text)' }}>{benchmark.lower.label}–{benchmark.upper.label}</strong> range.</>
                : benchmark.lower
                  ? <> puts you beyond <strong style={{ color: 'var(--q-volt-text)' }}>{benchmark.lower.label}</strong> level. Incredible!</>
                  : <> is at the <strong style={{ color: 'var(--q-volt-text)' }}>{benchmark.upper?.label || 'Beginner'}</strong> level. Keep training!</>}
            </p>
          </QuestBlock>

          {/* Rank history */}
          {monthlyRankHistory && monthlyRankHistory.length > 0 && (
            <QuestBlock>
              <QuestLabel>Rank History</QuestLabel>
              <div style={{ display: 'flex', gap: 11, overflowX: 'auto', padding: '12px 0 4px', scrollbarWidth: 'none' }}>
                <div style={{ padding: 13, minWidth: 150, flexShrink: 0, background: 'var(--q-panel2)', border: '3px solid var(--q-volt)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 16, color: 'var(--q-volt-text)' }}>
                      {(() => { const [yr, mo] = getCurrentMonth().split('-').map(Number); return new Date(yr, mo - 1).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }); })()}
                    </span>
                    <QuestChip tone="ember">Live</QuestChip>
                  </div>
                  <div className="q-ps" style={{ fontSize: 12, color: overall.color, marginTop: 10 }}>{overall.name}</div>
                  <div className="q-meta" style={{ marginTop: 5 }}>{Math.round(overall.totalXP).toLocaleString()} XP</div>
                </div>
                {monthlyRankHistory.filter(hist => hist.id !== getCurrentMonth()).map(hist => (
                  <HistoryCard key={hist.id} hist={hist} isBest={bestMonth && hist.id === bestMonth.id} />
                ))}
              </div>
            </QuestBlock>
          )}
        </>
      )}

      {/* Zone detail sheet (§7.4) */}
      {zoneKey && (
        <Portal>
          <div className="q-sheet-wrap" onClick={() => setZoneKey(null)}>
            <div className="q-sheet" role="dialog" aria-label={`${MUSCLE_LABELS[zoneKey]} details`} onClick={e => e.stopPropagation()}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <QuestLabel tone="volt">Muscle Stat Sheet</QuestLabel>
                  <div className="q-ps" style={{ fontSize: 16, marginTop: 8 }}>{MUSCLE_LABELS[zoneKey]}</div>
                </div>
                <button type="button" className="q-chip" onClick={() => setZoneKey(null)} style={{ cursor: 'pointer' }} aria-label="Close"><PixelSprite name="x" size={11} /></button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginTop: 15 }}>
                {[
                  { k: 'Total XP', v: `${Math.round(muscleXP[zoneKey] || 0).toLocaleString()} · ${zoneRank?.name || ''}` },
                  { k: 'XP Today', v: `+${Math.round(todayXP[zoneKey] || 0)}` },
                  { k: 'Sets Today', v: `${todaySets[zoneKey] || 0}` },
                  { k: 'Last Trained', v: lastTrained[zoneKey] ? fmt(lastTrained[zoneKey]).toUpperCase() : 'NEVER' },
                  { k: 'Status', v: (recovery[zoneKey]?.label || 'Fresh').toUpperCase() },
                ].map(row => (
                  <div key={row.k} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, background: 'var(--q-panel2)', border: '3px solid var(--q-border)', padding: '9px 11px' }}>
                    <span className="q-meta">{row.k.toUpperCase()}</span>
                    <span style={{ fontSize: 19 }}>{row.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 14 }}>
                <div className="q-meta" style={{ marginBottom: 6 }}>RECOVERY</div>
                <SegBar
                  value={recovery[zoneKey]?.hoursSince == null ? 1 : Math.min(1, recovery[zoneKey].hoursSince / 48)}
                  tone={recovery[zoneKey]?.status === 'critical' ? 'red' : recovery[zoneKey]?.status === 'fatigued' ? 'gold' : undefined}
                  segments={12}
                />
              </div>
              <QuestBtn onClick={() => { setZoneKey(null); navigate('/progress'); }} style={{ width: '100%', marginTop: 16 }}>
                View in Progress
              </QuestBtn>
            </div>
          </div>
        </Portal>
      )}

      <QuestPlayerSheet player={sheetPlayer} onClose={() => setSelectedPlayer(null)} />
    </div>
  );
}

function HistoryCard({ hist, isBest }) {
  const r = getOverallRank({ fake: hist.xp });
  return (
    <div style={{ padding: 13, minWidth: 150, flexShrink: 0, background: 'var(--q-panel2)', border: `3px solid ${isBest ? 'var(--q-volt)' : 'var(--q-border)'}`, position: 'relative' }}>
      {isBest && <div style={{ position: 'absolute', top: -11, right: 10 }}><QuestChip tone="gold">Best</QuestChip></div>}
      <div style={{ fontSize: 16, color: 'var(--q-dim)' }}>{hist.label}</div>
      <div className="q-ps" style={{ fontSize: 12, color: r.color, marginTop: 10 }}>{r.name}</div>
      <div className="q-meta" style={{ marginTop: 5 }}>{Math.round(hist.xp).toLocaleString()} XP</div>
    </div>
  );
}
