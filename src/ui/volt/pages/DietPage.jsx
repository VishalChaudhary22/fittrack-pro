import { useNavigate } from 'react-router-dom';
import { TrendingUp, Salad, Flame, Activity as ActivityIcon, ChevronLeft, ChevronRight, Plus, Search, Info, X, Edit2, Copy, Check, Clock, Scale, Ruler, Calculator, Zap, PersonStanding, AlertTriangle, Star, Droplet, Pill, Bot, Target, Drumstick, Wheat, UtensilsCrossed, ClipboardList, BarChart3, Soup, Droplets, CookingPot, Package, Leaf } from 'lucide-react';
import { Portal } from '../../v1/shared/SharedComponents';
import { VoltAdaptiveDietBanner, VoltTDEEInsightCard, VoltTDEEDetailSheet } from '../shared/VoltDietInsights';
import { computeNewTarget, recomputeMacros } from '../../../utils/adaptiveCalories';
import { DIET_TYPES } from '../../../data/diets';
import { tod, kgToLbs, cmToFtIn } from '../../../utils/helpers';
import { foodCategories } from '../../../data/foods/foodCategories';
import { useDiet } from '../../../core/hooks/useDiet';
import { clamp } from '../../../utils/helpers';
import { VoltBlock, VoltPill, VoltChip, Sticker, VoltLabel, VoltBar } from '../primitives';

// ─── Kaaya Volt · Diet (V-4) ─────────────────────────────────────────────────
// Same brain as V1's DietPage (useDiet), Volt presentation. The adaptive
// banner, TDEE insight card and TDEE detail sheet are Volt twins (V-7).
// MEAL_SLOTS / FASTING_TYPES are data constants copied from the V1 page
// (they live unexported in the frozen V1 file).

const FASTING_TYPES = [
  { id: '', label: 'None' },
  { id: 'navratri', label: 'Navratri' },
  { id: 'ekadashi', label: 'Ekadashi' },
  { id: 'ramzan', label: 'Ramzan' },
  { id: 'jain-paryushana', label: 'Jain Paryushana' },
  { id: 'maha-shivratri', label: 'Maha Shivratri' },
];

const MEAL_SLOTS = [
  { id: 'Breakfast', icon: TrendingUp, targetPct: 0.25 },
  { id: 'Mid-Morning', icon: ActivityIcon, targetPct: 0.05 },
  { id: 'Lunch', icon: Salad, targetPct: 0.35 },
  { id: 'Pre-Workout', icon: Flame, targetPct: 0.05 },
  { id: 'Post-Workout Dinner', icon: Salad, targetPct: 0.25 },
  { id: 'Before Bed', icon: ActivityIcon, targetPct: 0.05 },
];

const voltInput = {
  width: '100%', padding: '12px 14px', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)',
  borderRadius: 12, color: 'var(--v-ink)', fontSize: 15, fontFamily: "'Archivo', sans-serif", boxSizing: 'border-box',
};
const voltLabelStyle = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, fontWeight: 700,
  letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--v-dim)', marginBottom: 8,
};

function FilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        whiteSpace: 'nowrap', padding: '8px 15px', borderRadius: 999, cursor: 'pointer', flexShrink: 0,
        fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, fontWeight: 700, letterSpacing: '0.04em',
        border: '2px solid var(--v-edge)',
        background: active ? 'var(--v-volt)' : 'var(--v-panel)', color: active ? '#141416' : 'var(--v-dim)',
      }}
    >
      {children}
    </button>
  );
}

// Weekly stacked macro bars — hand-rolled, no chart library.
function VoltWeeklyChart({ data }) {
  const maxTotal = Math.max(...data.map(d => d.protein + d.carbs + d.fat), 1);
  const segments = [
    { key: 'protein', color: 'var(--v-cobalt)', label: 'Protein' },
    { key: 'carbs', color: 'var(--v-volt)', label: 'Carbs' },
    { key: 'fat', color: 'var(--v-coral)', label: 'Fat' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', height: 190 }}>
        {data.map(d => {
          const total = d.protein + d.carbs + d.fat;
          return (
            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, minWidth: 0 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, color: 'var(--v-dim)' }}>{total || ''}</span>
              <div style={{ width: '100%', maxWidth: 38, height: 140, display: 'flex', flexDirection: 'column-reverse', borderRadius: '7px 7px 0 0', overflow: 'hidden' }}>
                {segments.map(s => (
                  <div key={s.key} style={{ height: `${(d[s.key] / maxTotal) * 100}%`, background: s.color, minHeight: d[s.key] > 0 ? 2 : 0 }} />
                ))}
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '0.06em' }}>{d.dayName.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        {segments.map(s => (
          <span key={s.key} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', letterSpacing: '0.08em' }}>
            <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, border: '1.5px solid var(--v-edge)' }} />
            {s.label.toUpperCase()} (G)
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DietPage({ chatbot }) {
  const navigate = useNavigate();
  const {
    user, favoriteIds, toggleFavoriteFood, getFoodStreak, adaptiveSuggestion,
    acceptSuggestion, dismissSuggestion, updateProfile, tdeeEstimate, allFoods,
    foodsLoading, showTDEEDetails, setShowTDEEDetails, diet, handleSetDiet,
    dateStr, activeTab, setActiveTab, handleUpdateTDEETargets, showSearch,
    searchMealSlot, searchQuery, setSearchQuery, searchCat, setSearchCat,
    searchDiet, setSearchDiet, searchFasting, setSearchFasting, selectedFood,
    setSelectedFood, servingId, setServingId, qty, qtyInput, handleQtyInputChange,
    handleQtyInputBlur, handleQtyMinus, handleQtyPlus, customGrams, setCustomGrams,
    consistency, setConsistency, milkMod, setMilkMod, sweetMods, setSweetMods,
    showCustom, setShowCustom, customInput, setCustomInput, totalGrams, isUnset,
    isImpWeight, isImpHeight, bmi, tdee, goal, goalKcal, isCustomTarget, latestBF,
    baseWeightForProtein, protMultiplier, protTarget, carbsTarget, fatTarget,
    wheyScoops, wheyProt, foodProt, dt, gKey, dailyLog, selectedDateWaterTotal,
    waterGoal, waterPct, addWater, userSupps, selectedDateSuppLog, toggleSupplement,
    todayTotals, todayCaloriesBurned, energyBalance, weeklyData, weeklyMicros,
    searchResults, recentFoods, previewMacros, changeDate, handleCopyYesterday,
    searchInputRef, closeSearch, handleOpenSearch, handleSelectFood, addFoodToLog,
    saveCustomFood, removeEntry, editEntry, addCookingOil,
  } = useDiet();

  const firstName = user.name.toLowerCase().startsWith('kaaya fit') ? 'Kaaya Fit' : user.name.split(' ')[0];
  const foodStreak = getFoodStreak();

  const macroRows = [
    { label: 'Daily Energy', val: todayTotals.calories, target: goalKcal, unit: 'kcal', tone: undefined },
    { label: 'Protein', val: todayTotals.protein, target: protTarget, unit: 'g', tone: 'cobalt' },
    { label: 'Carbs', val: todayTotals.carbs, target: carbsTarget, unit: 'g', tone: undefined },
    { label: 'Fats', val: todayTotals.fat, target: fatTarget, unit: 'g', tone: 'coral' },
  ];

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Header ── */}
      <header className="v-rise">
        <VoltLabel volt>Personalised for {firstName} · Target {goalKcal} kcal</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Diet Guide &amp; Log</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
          {[
            { l: 'Weight', v: user?.weight ? (isImpWeight ? `${kgToLbs(user.weight)} lbs` : `${user.weight} kg`) : '—', Icon: Scale },
            { l: 'Height', v: user?.height ? (isImpHeight ? cmToFtIn(user.height) : `${user.height} cm`) : '—', Icon: Ruler },
            { l: 'BMI', v: (!bmi || isNaN(bmi) || bmi === 0) ? '—' : bmi, Icon: Calculator },
            { l: 'Body Fat', v: latestBF ? `${latestBF.percentage}%` : '—', Icon: ActivityIcon },
            { l: 'TDEE', v: (!tdee || isNaN(tdee) || tdee === 0) ? '—' : `${tdee} kcal`, Icon: Zap },
            { l: 'Activity', v: (user?.activityLevel || 'moderate').charAt(0).toUpperCase() + (user?.activityLevel || 'moderate').slice(1), Icon: PersonStanding },
          ].map(({ l, v, Icon }) => (
            <span key={l} className="v-chip">
              <Icon size={12} style={{ color: 'var(--v-dim)' }} />
              {l}&nbsp;<strong>{v}</strong>
            </span>
          ))}
        </div>
      </header>

      {/* ── Adaptive banner + TDEE insight (V1 components, staged) ── */}
      {adaptiveSuggestion && adaptiveSuggestion.scenario !== 'S10' && adaptiveSuggestion.adjustKcal !== 0 && (() => {
        const { newKcal } = computeNewTarget(adaptiveSuggestion.goalKcal, adaptiveSuggestion.adjustKcal, user.gender, adaptiveSuggestion.tdee);
        const newMacros = recomputeMacros({
          goal: adaptiveSuggestion.goal,
          currentWeight: user.weight,
          goalWeight: user.weightGoal,
          newKcal,
          workoutDays: user.workoutDays,
        });
        return (
          <VoltAdaptiveDietBanner
            suggestion={adaptiveSuggestion}
            currentKcal={adaptiveSuggestion.goalKcal}
            newKcal={newKcal}
            newMacros={newMacros}
            onAccept={acceptSuggestion}
            onDismiss={dismissSuggestion}
          />
        );
      })()}
      {adaptiveSuggestion && adaptiveSuggestion.scenario === 'S6' && (
        <VoltAdaptiveDietBanner
          suggestion={adaptiveSuggestion}
          currentKcal={goalKcal}
          newKcal={goalKcal}
          onAccept={acceptSuggestion}
          onDismiss={dismissSuggestion}
        />
      )}

      <VoltTDEEInsightCard
        tdeeEstimate={tdeeEstimate}
        onUpdateTargets={handleUpdateTDEETargets}
        onLearnMore={() => setShowTDEEDetails(true)}
      />
      {!isUnset && tdeeEstimate?.confidence === 'insufficient' && (
        <VoltBlock quiet style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <Info size={18} color="var(--v-volt-text)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 800, marginBottom: 3 }}>Learning your metabolism...</div>
            <div style={{ fontSize: 12.5, color: 'var(--v-dim)', lineHeight: 1.5 }}>Log your weight and food consistently for at least 10 days to unlock Adaptive TDEE targets.</div>
          </div>
        </VoltBlock>
      )}

      {/* ── Goal block ── */}
      <VoltBlock hero className="v-rise">
        {isUnset ? (
          <div style={{ textAlign: 'center', padding: '18px 8px' }}>
            <div style={{ marginBottom: 10 }}><Target size={40} color="var(--v-volt-text)" /></div>
            <div className="v-num" style={{ fontSize: 24, textTransform: 'uppercase' }}>Targets Locked</div>
            <p style={{ fontSize: 13.5, color: 'var(--v-dim)', margin: '10px auto 18px', maxWidth: 400, lineHeight: 1.55 }}>
              Complete your profile with your age, height, current weight, and target weight to generate your personalized macros.
            </p>
            <VoltPill onClick={() => navigate('/profile')}>Update Profile</VoltPill>
          </div>
        ) : (
          <>
            <div style={{ textAlign: 'center' }}>
              <VoltLabel volt>Phase Status</VoltLabel>
              <div className="v-num" style={{ fontSize: 34, textTransform: 'uppercase', lineHeight: 1.05, marginTop: 6 }}>
                Goal: {goal === 'loss' ? 'Cut' : goal === 'gain' ? 'Bulk' : 'Maintain'}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                <VoltChip><Flame size={11} style={{ verticalAlign: '-1px' }} /> {goalKcal} kcal{isCustomTarget ? ' · CUSTOM' : ''}</VoltChip>
                <VoltChip><Drumstick size={11} style={{ verticalAlign: '-1px' }} /> {protTarget}g P</VoltChip>
                <VoltChip><Wheat size={11} style={{ verticalAlign: '-1px' }} /> {carbsTarget}g C</VoltChip>
                <VoltChip><Droplet size={11} style={{ verticalAlign: '-1px' }} /> {fatTarget}g F</VoltChip>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 22 }}>
              {macroRows.map(m => (
                <div key={m.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
                    <span style={{ fontSize: 13.5, fontWeight: 800 }}>{m.label}</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11.5, color: 'var(--v-dim)' }}>
                      <strong style={{ color: 'var(--v-ink)', fontSize: 13 }}>{Math.round(m.val)}</strong> / {m.target} {m.unit}
                    </span>
                  </div>
                  <VoltBar value={clamp((m.val / (m.target || 1)) || 0, 0, 1)} tone={m.val > m.target ? 'coral' : m.tone} height={11} />
                </div>
              ))}
            </div>

            <div style={{ borderTop: '2px solid var(--v-edge-quiet)', marginTop: 20, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.12em', color: 'var(--v-dim)' }}>ENERGY BALANCE</div>
                <div style={{ fontSize: 12.5, color: 'var(--v-dim)', marginTop: 4 }}>
                  In: <strong style={{ color: 'var(--v-ink)' }}>{Math.round(todayTotals.calories)}</strong> − Out: <strong style={{ color: 'var(--v-ink)' }}>{Math.round(todayCaloriesBurned)}</strong>
                </div>
              </div>
              <div className="v-num" style={{ fontSize: 25, color: energyBalance > goalKcal ? 'var(--v-coral-text)' : 'var(--v-volt-text)' }}>
                {Math.round(energyBalance)} <span style={{ fontSize: 11.5, color: 'var(--v-dim)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 700 }}>KCAL NET</span>
              </div>
            </div>

            <div style={{ fontSize: 11, color: 'var(--v-dim)', marginTop: 14, textAlign: 'center' }}>
              ℹ️ Protein calculated from {goal === 'loss' && user.weightGoal && user.weightGoal < user.weight ? 'goal weight' : 'current weight'} ({isImpWeight ? kgToLbs(baseWeightForProtein) + ' lbs' : baseWeightForProtein + 'kg'}) × {protMultiplier}g/kg
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <button type="button" className="v-chip v-press" onClick={() => setActiveTab('tracker')} style={{ cursor: 'pointer' }}>Track Today ↓</button>
            </div>
            {isCustomTarget && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => updateProfile({ customGoalKcal: null, customProteinG: null })}
                  style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--v-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}
                >
                  Custom target active · <span style={{ color: 'var(--v-volt-text)', fontWeight: 800 }}>Reset to calculated</span>
                </button>
              </div>
            )}
          </>
        )}
      </VoltBlock>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ display: 'flex', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 999, padding: 4, gap: 4 }}>
          {[
            { id: 'tracker', label: 'Daily Tracker', icon: UtensilsCrossed },
            { id: 'guide', label: 'Meal Guide', icon: ClipboardList },
            { id: 'analysis', label: 'Analysis', icon: BarChart3 },
          ].map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '10px 18px', borderRadius: 999, border: 'none', cursor: 'pointer',
                fontFamily: "'Archivo', sans-serif", fontSize: 13.5, fontWeight: 800,
                background: activeTab === t.id ? 'var(--v-volt)' : 'transparent',
                color: activeTab === t.id ? '#141416' : 'var(--v-dim)',
                transition: 'background-color 200ms cubic-bezier(0.23, 1, 0.32, 1), color 200ms cubic-bezier(0.23, 1, 0.32, 1)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><t.icon size={14} /> {t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Guide tab ── */}
      {activeTab === 'guide' && (
        <>
          <VoltBlock hero>
            <div style={{ fontSize: 19, fontWeight: 900, marginBottom: 7 }}><ClipboardList size={18} style={{ verticalAlign: '-3px' }} /> Your Personalised Meal Blueprint</div>
            <p style={{ fontSize: 13, color: 'var(--v-dim)', margin: 0, lineHeight: 1.55 }}>
              These are AI-curated meal suggestions based on your {goal === 'loss' ? 'cut' : goal === 'gain' ? 'bulk' : 'maintenance'} goal and {DIET_TYPES[diet].label} diet. Use these as a daily reference — log your actual intake in the Daily Tracker.
            </p>
          </VoltBlock>

          <VoltBlock quiet style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 260, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 42, height: 42, borderRadius: 11, border: '2px solid var(--v-edge)', background: 'var(--v-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ActivityIcon size={20} color="var(--v-volt-text)" />
              </div>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 900 }}>Whey Protein — {wheyScoops} scoop{wheyScoops > 1 ? 's' : ''}/day ({wheyProt}g)</div>
                <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 2 }}>{foodProt}g from food + {wheyProt}g from whey = {protTarget}g target.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 5, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', padding: 4, borderRadius: 12, flexWrap: 'wrap' }}>
              {Object.values(DIET_TYPES).map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSetDiet(d.id)}
                  style={{
                    padding: '8px 12px', fontSize: 12.5, fontWeight: 800, border: 'none', borderRadius: 9, cursor: 'pointer',
                    fontFamily: "'Archivo', sans-serif",
                    background: diet === d.id ? 'var(--v-volt)' : 'transparent', color: diet === d.id ? '#141416' : 'var(--v-dim)',
                  }}
                >
                  <d.icon size={14} style={{ verticalAlign: '-2px' }} /> {d.label}
                </button>
              ))}
            </div>
          </VoltBlock>

          <VoltLabel>Blueprint</VoltLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {dt.meals.map((meal, i) => {
              const items = meal.items[gKey] || meal.items.maintain || [];
              const wheyLines = [];
              if (meal.label === 'Breakfast') wheyLines.push(`+ 1 scoop ${diet === 'vegan' ? 'plant protein (pea+rice)' : 'whey'} — complete protein`);
              if (meal.label === 'Post-Workout Dinner') wheyLines.push('+ 1 scoop whey within 30 min post-workout');
              if (wheyScoops >= 3 && meal.label === 'Mid-Morning') wheyLines.push(`+ Extra scoop protein (${protTarget}g target)`);
              if (wheyScoops >= 4 && meal.label === 'Before Bed') wheyLines.push('+ 1 scoop casein/whey before bed');
              const all = [...items, ...wheyLines];
              const MIcon = MEAL_SLOTS.find(m => m.id === meal.label)?.icon || ActivityIcon;
              return (
                <VoltBlock key={i} quiet>
                  <div style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 13 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, border: '2px solid var(--v-edge)', background: 'var(--v-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MIcon size={16} color="var(--v-volt-text)" />
                    </div>
                    <div style={{ fontSize: 15.5, fontWeight: 900 }}>{meal.label}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {all.map((item, j) => {
                      const isW = item.startsWith('+');
                      return (
                        <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: isW ? '8px 10px' : '2px 0', fontSize: 13, lineHeight: 1.45, color: isW ? 'var(--v-volt-text)' : 'var(--v-dim)', fontWeight: isW ? 700 : 400, background: isW ? 'var(--v-canvas)' : 'transparent', borderRadius: isW ? 8 : 0, border: isW ? '2px solid var(--v-edge-quiet)' : 'none' }}>
                          {!isW && <span style={{ color: 'var(--v-volt-text)', flexShrink: 0, fontWeight: 900 }}>·</span>}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '2px solid var(--v-edge-quiet)' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      {[{ l: 'P', v: meal.macros.p }, { l: 'C', v: meal.macros.c }, { l: 'F', v: meal.macros.f }].map(m => (
                        <span key={m.l} className="v-chip">
                          <strong style={{ color: 'var(--v-volt-text)' }}>{m.l}</strong>&nbsp;{m.v}g
                        </span>
                      ))}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--v-dim)' }}><span style={{ color: 'var(--v-volt-text)', fontWeight: 700 }}>Micros: </span>{meal.micros.join(' · ')}</div>
                  </div>
                </VoltBlock>
              );
            })}
          </div>

          {dt.proteinSources && (
            <VoltBlock quiet style={{ borderLeft: '4px solid var(--v-volt)' }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>Best Protein Sources — {dt.label}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {dt.proteinSources.map(s => <span key={s} className="v-chip">{s}</span>)}
              </div>
            </VoltBlock>
          )}
          <div style={{ padding: '13px 16px', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: 13, fontSize: 12.5, color: 'var(--v-dim)', lineHeight: 1.55 }}>
            <strong style={{ color: 'var(--v-volt-text)' }}>Complete Protein Tip:</strong> Combine legumes + grains per meal (dal+rice, chana+roti) to cover all 9 essential amino acids. Whey protein already contains all 9 EAAs in every scoop.
          </div>
        </>
      )}

      {/* ── Analysis tab ── */}
      {activeTab === 'analysis' && (
        <>
          {(diet === 'vegetarian' || diet === 'vegan') && weeklyMicros.vitaminB12 < 1.5 && (
            <VoltBlock quiet style={{ borderLeft: '4px solid var(--v-coral)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <AlertTriangle size={18} color="var(--v-coral-text)" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: 'var(--v-coral-text)', marginBottom: 3 }}>Low B12 Logged This Week</div>
                  <p style={{ fontSize: 13, color: 'var(--v-dim)', margin: 0, lineHeight: 1.5 }}>Vegetarians can&apos;t get sufficient B12 from plants alone. Consider fortified milk, or discuss a B12 supplement with a professional.</p>
                </div>
              </div>
            </VoltBlock>
          )}
          {weeklyMicros.vitaminD < 200 * 7 && (
            <VoltBlock quiet>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <Zap size={18} color="#F5A623" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 3 }}>Low Vitamin D3 Detected</div>
                  <p style={{ fontSize: 13, color: 'var(--v-dim)', margin: 0, lineHeight: 1.5 }}>Top food sources are egg yolk, fatty fish, and fortified milk. A D3 supplement is recommended for most Indians.</p>
                </div>
              </div>
            </VoltBlock>
          )}
          {user.gender === 'female' && weeklyMicros.iron < 18 * 7 && (
            <VoltBlock quiet>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <ActivityIcon size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 3 }}>Low Iron Intake</div>
                  <p style={{ fontSize: 13, color: 'var(--v-dim)', margin: 0, lineHeight: 1.5 }}>Your iron intake looks low this week. Top sources: palak, rajma, chana, ragi, dates, and non-veg options.</p>
                </div>
              </div>
            </VoltBlock>
          )}

          <VoltBlock>
            <div style={{ fontSize: 17, fontWeight: 900, textTransform: 'uppercase', marginBottom: 18 }}>Weekly Macro Adherence</div>
            <VoltWeeklyChart data={weeklyData} />
          </VoltBlock>
        </>
      )}

      {/* ── Tracker tab ── */}
      {activeTab === 'tracker' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 className="v-num" style={{ fontSize: 24, textTransform: 'uppercase', margin: 0 }}>Daily Tracker</h2>
            {foodStreak.current >= 3 && <Sticker tone="coral"><Flame size={11} style={{ verticalAlign: '-1px' }} /> {foodStreak.current} Day Streak</Sticker>}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 13, padding: 4 }}>
              <button type="button" onClick={() => changeDate(-1)} aria-label="Previous day" style={{ width: 40, height: 40, background: 'transparent', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={17} /></button>
              <span style={{ fontSize: 13.5, fontWeight: 800, whiteSpace: 'nowrap' }}>{dateStr === tod() ? 'Today' : dateStr}</span>
              <button type="button" onClick={() => changeDate(1)} aria-label="Next day" style={{ width: 40, height: 40, background: 'transparent', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={17} /></button>
            </div>
            <button type="button" className="v-press" onClick={handleCopyYesterday} style={{ flex: 1, fontSize: 12.5, fontWeight: 800, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', color: 'var(--v-ink)', borderRadius: 13, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, cursor: 'pointer', fontFamily: "'Archivo', sans-serif", minHeight: 48 }}>
              <Copy size={14} style={{ color: 'var(--v-dim)' }} /> Copy Y&apos;day
            </button>
          </div>

          {protTarget - todayTotals.protein > 30 && new Date().getHours() >= 18 && (
            <VoltBlock quiet style={{ borderLeft: '4px solid var(--v-coral)' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                <Zap size={16} color="var(--v-coral-text)" />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--v-coral-text)', fontWeight: 700, letterSpacing: '0.1em' }}>HIGH-IMPACT NUDGE</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--v-dim)', margin: '0 0 13px', lineHeight: 1.5 }}>You&apos;re <strong style={{ color: 'var(--v-ink)' }}>{Math.round(protTarget - todayTotals.protein)}g</strong> short on protein today.</p>
              <VoltPill
                small
                onClick={() => {
                  if (chatbot) {
                    chatbot.openChat();
                    setTimeout(() => chatbot.sendMessage(`I need ${Math.round(protTarget - todayTotals.protein)}g more protein today. What are some quick meal ideas?`), 300);
                  }
                }}
              >
                <Bot size={14} /> Ask FORGE for protein meal ideas
              </VoltPill>
            </VoltBlock>
          )}

          {/* Hydration */}
          <VoltBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, border: '2px solid var(--v-edge)', background: 'var(--v-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Droplet size={18} color="var(--v-cobalt)" fill="var(--v-cobalt)" fillOpacity={0.25} />
                </div>
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 900 }}>Hydration</div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', marginTop: 1 }}>{selectedDateWaterTotal} / {waterGoal} ML</div>
                </div>
              </div>
              <VoltChip>{waterPct}%</VoltChip>
            </div>
            <VoltBar value={waterPct / 100} tone="cobalt" height={10} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
              {[{ ml: 250, label: 'Glass' }, { ml: 500, label: 'Bottle' }, { ml: 750, label: 'Shaker' }].map(preset => (
                <button key={preset.ml} type="button" className="v-press" onClick={() => addWater(preset.ml)} style={{ padding: '10px 4px', background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 12, cursor: 'pointer', fontFamily: "'Archivo', sans-serif" }}>
                  <div style={{ fontSize: 13.5, fontWeight: 900, color: 'var(--v-cobalt)' }}>+{preset.ml}</div>
                  <div style={{ fontSize: 10.5, color: 'var(--v-dim)', marginTop: 1 }}>{preset.label}</div>
                </button>
              ))}
            </div>
          </VoltBlock>

          {/* Supplements */}
          <VoltBlock>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, border: '2px solid var(--v-edge)', background: 'var(--v-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Pill size={18} color="var(--v-cobalt)" />
              </div>
              <div>
                <div style={{ fontSize: 15.5, fontWeight: 900 }}>Supplements</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-dim)', marginTop: 1 }}>DAILY STACK</div>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
              {userSupps.map(supp => {
                const isTaken = selectedDateSuppLog.some(l => l.suppId === supp.id);
                return (
                  <div
                    key={supp.id}
                    onClick={() => toggleSupplement(supp.id)}
                    style={{ padding: 12, borderRadius: 12, background: isTaken ? 'var(--v-canvas)' : 'var(--v-panel)', border: isTaken ? '2.5px solid var(--v-volt)' : '2px solid var(--v-edge-quiet)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}
                  >
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: isTaken ? 'var(--v-volt-text)' : 'var(--v-ink)' }}>{supp.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--v-dim)', marginTop: 1 }}>{supp.dose}</div>
                    </div>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: isTaken ? 'var(--v-volt)' : 'transparent', border: isTaken ? '2px solid var(--v-edge)' : '2px solid var(--v-edge-quiet)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isTaken && <Check size={12} color="#141416" strokeWidth={3.2} />}
                    </div>
                  </div>
                );
              })}
            </div>
          </VoltBlock>

          {/* Meal slots */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MEAL_SLOTS.map(slot => {
              const SIcon = slot.icon;
              const slotCals = Math.round(goalKcal * slot.targetPct);
              const items = dailyLog.filter(l => l.slot === slot.id);
              const slotTotal = Math.round(items.reduce((s, i) => s + (i.macros?.calories || 0), 0));
              return (
                <VoltBlock key={slot.id} style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, cursor: 'pointer' }} onClick={() => handleOpenSearch(slot.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                      <div style={{ width: 46, height: 46, borderRadius: 12, border: '2px solid var(--v-edge)', background: 'var(--v-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--v-volt-text)', flexShrink: 0 }}>
                        <SIcon size={22} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 16.5, fontWeight: 900 }}>{slot.id}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--v-dim)', marginTop: 3 }}><Flame size={10} style={{ verticalAlign: '-1px' }} /> ~{slotCals} kcal • {Math.round(slot.targetPct * 100)}%</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div className="v-num" style={{ fontSize: 19, color: slotTotal > 0 ? 'var(--v-volt-text)' : 'var(--v-dim)' }}>{slotTotal}</div>
                        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8.5, letterSpacing: '0.12em', color: 'var(--v-dim)' }}>KCAL</div>
                      </div>
                      <span style={{ width: 42, height: 42, borderRadius: '50%', border: '2.5px solid var(--v-edge)', background: 'var(--v-volt)', color: '#141416', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Plus size={19} strokeWidth={2.6} />
                      </span>
                    </div>
                  </div>
                  {items.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '2px solid var(--v-edge-quiet)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {items.map(i => (
                        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, padding: '9px 11px', borderRadius: 10, border: '2px solid var(--v-edge-quiet)', background: 'var(--v-canvas)' }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 700 }}>{i.name}</div>
                            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, marginTop: 3, display: 'flex', gap: 9 }}>
                              <span style={{ color: 'var(--v-cobalt)' }}>P {Math.round(i.macros?.protein || 0)}g</span>
                              <span style={{ color: 'var(--v-volt-text)' }}>C {Math.round(i.macros?.carbs || 0)}g</span>
                              <span style={{ color: 'var(--v-dim)' }}>F {Math.round(i.macros?.fat || 0)}g</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <span className="v-num" style={{ fontSize: 15 }}>{Math.round(i.macros?.calories || 0)}</span>
                            {i.food && (
                              <button type="button" aria-label={`Edit ${i.name}`} onClick={(e) => { e.stopPropagation(); editEntry(i); }} style={{ width: 32, height: 32, background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: '50%', color: 'var(--v-volt-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Edit2 size={13} /></button>
                            )}
                            <button type="button" aria-label="Remove food entry" onClick={(e) => { e.stopPropagation(); removeEntry(i.id); }} style={{ width: 32, height: 32, background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: '50%', color: 'var(--v-coral-text)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={13} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </VoltBlock>
              );
            })}
          </div>

          {/* Log-food FAB */}
          <button
            type="button"
            className="v-press"
            onClick={() => handleOpenSearch('Snack/General')}
            aria-label="Log food"
            style={{ position: 'fixed', bottom: 84, right: 16, zIndex: 60, width: 58, height: 58, borderRadius: '50%', background: 'var(--v-volt)', color: '#141416', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2.5px solid var(--v-edge)', boxShadow: '4px 4px 0 var(--v-shadow)', cursor: 'pointer' }}
          >
            <Plus size={27} strokeWidth={2.6} />
          </button>
        </>
      )}

      {/* ── Search / log sheet ── */}
      {showSearch && (
        <Portal>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(4, 6, 10, 0.66)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
            <div
              className="v-sheet-down"
              style={{ width: '100%', height: '92dvh', background: 'var(--v-canvas)', color: 'var(--v-ink)', borderBottom: '2.5px solid var(--v-edge)', borderRadius: '0 0 24px 24px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
              role="dialog"
              aria-label={`Add food to ${searchMealSlot}`}
            >
              {selectedFood || showCustom ? (
                <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                    <button type="button" aria-label="Back to results" onClick={() => { setSelectedFood(null); setShowCustom(false); }} style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--v-panel)', border: '2px solid var(--v-edge)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronLeft size={20} /></button>
                    <button type="button" aria-label="Close search" onClick={closeSearch} style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--v-panel)', border: '2px solid var(--v-edge)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={20} /></button>
                  </div>

                  {showCustom ? (
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontSize: 21, fontWeight: 900, margin: '0 0 20px' }}>Add Custom Info</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                        <div><label style={voltLabelStyle}>Name</label><input style={voltInput} placeholder="E.g. Homemade Cookie" value={customInput.name} onChange={e => setCustomInput({ ...customInput, name: e.target.value })} /></div>
                        <div><label style={voltLabelStyle}>Calories (Kcal)</label><input style={voltInput} type="number" placeholder="0" value={customInput.cals} onChange={e => setCustomInput({ ...customInput, cals: e.target.value })} /></div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11 }}>
                          <div><label style={voltLabelStyle}>Pro (g)</label><input style={voltInput} type="number" placeholder="0" value={customInput.p} onChange={e => setCustomInput({ ...customInput, p: e.target.value })} /></div>
                          <div><label style={voltLabelStyle}>Carbs (g)</label><input style={voltInput} type="number" placeholder="0" value={customInput.c} onChange={e => setCustomInput({ ...customInput, c: e.target.value })} /></div>
                          <div><label style={voltLabelStyle}>Fat (g)</label><input style={voltInput} type="number" placeholder="0" value={customInput.f} onChange={e => setCustomInput({ ...customInput, f: e.target.value })} /></div>
                        </div>
                        <VoltPill onClick={saveCustomFood} style={{ marginTop: 10, width: '100%' }}>Add Custom Food</VoltPill>
                      </div>
                    </div>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ marginBottom: 8 }}><VoltChip>{foodCategories.find(c => c.id === selectedFood.category)?.label || 'Food'}</VoltChip></div>
                      <h3 style={{ fontSize: 22, fontWeight: 900, margin: '0 0 14px' }}>{selectedFood.name}</h3>

                      <VoltBlock quiet style={{ padding: 16 }}>
                        <label style={voltLabelStyle}>Serving Selection</label>
                        <div style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                          {selectedFood.servings?.map(s => {
                            const sel = servingId === s.id && !customGrams;
                            return (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => { setServingId(s.id); setCustomGrams(''); }}
                                style={{ padding: '9px 13px', fontSize: 12.5, fontWeight: 700, borderRadius: 10, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0, fontFamily: "'Archivo', sans-serif", border: '2px solid var(--v-edge)', background: sel ? 'var(--v-volt)' : 'var(--v-panel)', color: sel ? '#141416' : 'var(--v-dim)' }}
                              >
                                {s.isDeliveryPortion && <Package size={12} style={{ verticalAlign: '-2px', marginRight: 4 }} />}{s.label} ({s.grams}g)
                                {servingId === s.id && s.grams && qty !== 1 && (
                                  <span style={{ opacity: 0.75, marginLeft: 4 }}>→ {Math.round(s.grams * qty * 10) / 10}g</span>
                                )}
                              </button>
                            );
                          })}
                        </div>

                        <label style={voltLabelStyle}>Or enter exact grams</label>
                        <input type="number" placeholder="e.g. 150" value={customGrams} onChange={e => { setCustomGrams(e.target.value); setServingId('custom'); }} style={{ ...voltInput, marginBottom: 16 }} />

                        {!customGrams && (
                          <>
                            <label style={voltLabelStyle}>Multiplier (Qty)</label>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', width: 'fit-content', padding: 5, borderRadius: 12 }}>
                              <button type="button" onClick={handleQtyMinus} disabled={qty <= 0.25} aria-label="Decrease quantity" style={{ width: 40, height: 40, borderRadius: 9, border: 'none', background: qty <= 0.25 ? 'transparent' : 'var(--v-panel)', color: qty <= 0.25 ? 'var(--v-dim)' : 'var(--v-ink)', cursor: qty <= 0.25 ? 'not-allowed' : 'pointer', fontSize: 19, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                              <input
                                type="number" value={qtyInput} onChange={handleQtyInputChange} onBlur={handleQtyInputBlur}
                                onFocus={e => e.target.select()} inputMode="decimal" step="0.25" min="0.25" aria-label="Quantity"
                                style={{ width: 58, textAlign: 'center', background: 'transparent', border: 'none', outline: 'none', fontWeight: 900, fontSize: 18, color: 'var(--v-ink)', fontFamily: "'Archivo', sans-serif", padding: '4px 0' }}
                              />
                              <button type="button" onClick={handleQtyPlus} aria-label="Increase quantity" style={{ width: 40, height: 40, borderRadius: 9, border: 'none', background: 'var(--v-panel)', color: 'var(--v-ink)', cursor: 'pointer', fontSize: 19, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                          </>
                        )}

                        {selectedFood.supportedConsistencyTypes && selectedFood.supportedConsistencyTypes.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <label style={voltLabelStyle}>Consistency / Thickness</label>
                            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                              <FilterChip active={consistency === 'standard'} onClick={() => setConsistency('standard')}><Soup size={12} style={{ verticalAlign: '-2px' }} /> Normal</FilterChip>
                              {selectedFood.supportedConsistencyTypes.includes('thin') && (
                                <FilterChip active={consistency === 'thin'} onClick={() => setConsistency('thin')}><Droplets size={12} style={{ verticalAlign: '-2px' }} /> Watery (Thin)</FilterChip>
                              )}
                              {selectedFood.supportedConsistencyTypes.includes('thick') && (
                                <FilterChip active={consistency === 'thick'} onClick={() => setConsistency('thick')}><CookingPot size={12} style={{ verticalAlign: '-2px' }} /> Restaurant (Thick)</FilterChip>
                              )}
                            </div>
                          </div>
                        )}

                        {user.weightGoal && user.weightGoal < user.weight && selectedFood.gi && selectedFood.gi > 70 && (
                          <div style={{ padding: 13, borderRadius: 12, border: '2.5px solid var(--v-coral)', marginBottom: 16 }}>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 5 }}>
                              <AlertTriangle size={14} color="var(--v-coral-text)" />
                              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5, color: 'var(--v-coral-text)', fontWeight: 700, letterSpacing: '0.1em' }}>HIGH GLYCEMIC INDEX ({selectedFood.gi})</span>
                            </div>
                            <p style={{ fontSize: 12.5, color: 'var(--v-dim)', margin: 0, lineHeight: 1.5 }}>This food may rapidly spike blood sugar. For your fat-loss goal, consider smaller portions or alternatives like Jowar, Bajra, or Brown Rice.</p>
                          </div>
                        )}

                        {selectedFood.hasBeverageModifiers && (
                          <div style={{ marginTop: 6 }}>
                            <label style={voltLabelStyle}>Milk Choice (Beverage Builder)</label>
                            <select value={milkMod} onChange={e => setMilkMod(e.target.value)} style={{ ...voltInput, marginBottom: 16 }}>
                              <option value="none">No Milk / Black (water base)</option>
                              <option value="milk-full-fat">Full-Fat Milk (150ml)</option>
                              <option value="milk-toned">Toned Milk (150ml)</option>
                              <option value="milk-soy">Soy Milk (150ml)</option>
                              <option value="milk-almond">Almond Milk (150ml)</option>
                            </select>
                            <label style={voltLabelStyle}>Sweeteners &amp; Add-ins</label>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {['sugar-white', 'jaggery', 'honey'].map(sw => {
                                const sel = sweetMods.includes(sw);
                                return (
                                  <button
                                    key={sw}
                                    type="button"
                                    onClick={() => { if (sel) setSweetMods(p => p.filter(x => x !== sw)); else setSweetMods(p => [...p, sw]); }}
                                    style={{ padding: '9px 15px', fontSize: 12.5, fontWeight: 700, borderRadius: 11, cursor: 'pointer', fontFamily: "'Archivo', sans-serif", textTransform: 'uppercase', border: '2px solid var(--v-edge)', background: sel ? 'var(--v-cobalt)' : 'var(--v-panel)', color: sel ? '#FFFFFF' : 'var(--v-ink)' }}
                                  >
                                    {sw.replace('-', ' ')}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {selectedFood.supportedConsistencyTypes?.length > 0 && (
                          <div style={{ marginTop: 20 }}>
                            <label style={voltLabelStyle}>Gravy Consistency</label>
                            <div style={{ display: 'flex', gap: 8 }}>
                              {selectedFood.supportedConsistencyTypes.map(cType => (
                                <button
                                  key={cType}
                                  type="button"
                                  onClick={() => setConsistency(cType)}
                                  style={{ flex: 1, padding: '11px 8px', borderRadius: 11, cursor: 'pointer', fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 700, textTransform: 'capitalize', border: '2px solid var(--v-edge)', background: consistency === cType ? 'var(--v-volt)' : 'var(--v-panel)', color: consistency === cType ? '#141416' : 'var(--v-ink)' }}
                                >
                                  {cType}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {(selectedFood.itemType === 'dish' || selectedFood.itemType === 'sabzi-veg' || selectedFood.itemType === 'dal-legume') && (
                          <div style={{ marginTop: 20, padding: 15, background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: 12 }}>
                            <span style={{ fontSize: 14, fontWeight: 800 }}>Cooked in Oil/Ghee?</span>
                            <p style={{ fontSize: 12.5, color: 'var(--v-dim)', marginTop: 5, lineHeight: 1.5 }}>Indian dishes absorb variable amounts of fat. If this is a homemade dish cooked in oil, add a secondary 15g entry.</p>
                            <button type="button" className="v-press" onClick={addCookingOil} style={{ marginTop: 11, width: '100%', padding: '12px', borderRadius: 11, border: '2px solid var(--v-edge)', background: 'var(--v-panel)', color: 'var(--v-ink)', fontFamily: "'Archivo', sans-serif", fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
                              + Add Cooking Oil/Ghee (130 Kcal)
                            </button>
                          </div>
                        )}
                      </VoltBlock>

                      <div style={{ position: 'sticky', bottom: 0, background: 'var(--v-panel)', border: '2.5px solid var(--v-edge)', borderRadius: 16, padding: '12px 16px', marginTop: 16, boxShadow: '4px 4px 0 var(--v-shadow)', flexShrink: 0 }}>
                        {totalGrams != null && (
                          <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--v-dim)', marginBottom: 7, fontWeight: 600 }}>
                            {qty !== 1 && (
                              <span style={{ marginRight: 4 }}>{qty} × {selectedFood?.servings?.find(s => s.id === servingId)?.grams ?? customGrams}g =</span>
                            )}
                            <span style={{ color: 'var(--v-volt-text)', fontWeight: 800 }}>{Math.round(totalGrams * 10) / 10}g</span> total
                          </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 11 }}>
                          {[
                            { l: 'Kcal', v: Math.round(previewMacros?.calories || 0), c: 'var(--v-volt-text)' },
                            { l: 'Pro', v: `${Math.round(previewMacros?.protein || 0)}g`, c: 'var(--v-cobalt)' },
                            { l: 'Carb', v: `${Math.round(previewMacros?.carbs || 0)}g`, c: 'var(--v-ink)' },
                            { l: 'Fat', v: `${Math.round(previewMacros?.fat || 0)}g`, c: 'var(--v-dim)' },
                          ].map(m => (
                            <div key={m.l} style={{ textAlign: 'center' }}>
                              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--v-dim)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.1em' }}>{m.l}</div>
                              <div className="v-num" style={{ fontSize: 18, color: m.c }}>{m.v}</div>
                            </div>
                          ))}
                        </div>
                        <VoltPill onClick={() => addFoodToLog(previewMacros)} style={{ width: '100%' }}>Log in {searchMealSlot}</VoltPill>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <div style={{ padding: '16px 20px 12px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, fontSize: 20, fontWeight: 900 }}>Add to <span style={{ color: 'var(--v-volt-text)' }}>{searchMealSlot}</span></h3>
                      <button type="button" aria-label="Close meal search" onClick={closeSearch} style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--v-panel)', border: '2px solid var(--v-edge)', color: 'var(--v-ink)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><X size={19} /></button>
                    </div>
                    <div style={{ position: 'relative' }}>
                      <Search style={{ position: 'absolute', top: 15, left: 15, color: 'var(--v-dim)' }} size={18} />
                      <input ref={searchInputRef} placeholder="Search dal, paneer, roti..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ ...voltInput, paddingLeft: 44, height: 50 }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 6, padding: '6px 20px 10px', overflowX: 'auto', alignItems: 'center', flexShrink: 0, scrollbarWidth: 'none' }}>
                    {['All', 'Veg', 'Vegan', 'Egg', 'Non-Veg', 'Jain'].map(d => (
                      <FilterChip key={d} active={searchDiet === d} onClick={() => setSearchDiet(d)}>{d}</FilterChip>
                    ))}
                    <div style={{ width: 2, height: 24, background: 'var(--v-edge-quiet)', margin: '0 3px', flexShrink: 0 }} />
                    {[{ id: 'All', label: 'All categories' }, ...foodCategories].map(c => (
                      <FilterChip key={c.id} active={searchCat === c.id} onClick={() => setSearchCat(c.id)}>{c.label}</FilterChip>
                    ))}
                    <div style={{ width: 2, height: 24, background: 'var(--v-edge-quiet)', margin: '0 3px', flexShrink: 0 }} />
                    {[{ id: '', label: 'Fasting: Off' }, ...FASTING_TYPES].filter(t => t.label).map(t => (
                      <FilterChip key={t.id || 'none'} active={searchFasting === t.id} onClick={() => setSearchFasting(t.id)}>{t.label}</FilterChip>
                    ))}
                  </div>

                  <div style={{ overflowY: 'auto', flex: 1, padding: '14px 20px 40px' }}>
                    {!searchQuery && recentFoods.length > 0 && (
                      <div style={{ marginBottom: 26 }}>
                        <VoltLabel>Recent (Quick Add)</VoltLabel>
                        <div style={{ marginTop: 11 }}>
                          {recentFoods.map(rf => (
                            <button key={rf.id} type="button" onClick={() => handleSelectFood(rf)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 8px 8px 0', padding: '10px 15px', borderRadius: 999, cursor: 'pointer', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', color: 'var(--v-ink)', fontFamily: "'Archivo', sans-serif" }}>
                              <Clock size={14} color="var(--v-volt-text)" />
                              <span style={{ fontSize: 13, fontWeight: 700 }}>{rf.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!searchQuery && favoriteIds.length > 0 && (
                      <div style={{ marginBottom: 26 }}>
                        <VoltLabel>⭐️ Favorites</VoltLabel>
                        <div style={{ marginTop: 11 }}>
                          {favoriteIds.map(fId => {
                            const food = allFoods.find(f => f.id === fId);
                            if (!food) return null;
                            return (
                              <button key={food.id} type="button" onClick={() => handleSelectFood(food)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 8px 8px 0', padding: '10px 15px', borderRadius: 999, cursor: 'pointer', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', color: 'var(--v-ink)', fontFamily: "'Archivo', sans-serif" }}>
                                <Star size={14} color="var(--v-volt-text)" fill="var(--v-volt)" />
                                <span style={{ fontSize: 13, fontWeight: 700 }}>{food.name}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <VoltLabel>Results</VoltLabel>

                    {foodsLoading && (
                      <div style={{ padding: 40, textAlign: 'center', color: 'var(--v-dim)' }}>
                        <ActivityIcon size={30} color="var(--v-volt-text)" style={{ margin: '0 auto 14px', animation: 'spin 1s linear infinite' }} />
                        <p style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Loading foods...</p>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                      {searchResults.map(f => (
                        <div key={f.id} onClick={() => handleSelectFood(f)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '15px 16px', background: 'var(--v-panel)', border: '2px solid var(--v-edge-quiet)', borderRadius: 14, cursor: 'pointer' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 15.5, fontWeight: 800, marginBottom: 5 }}>{f.name} {f.isFastingFood && <Leaf size={13} color="var(--v-volt-text)" style={{ verticalAlign: '-2px', marginLeft: 6 }} />}</div>
                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: 12, color: 'var(--v-dim)', fontWeight: 600 }}>{f.servings?.[0]?.label || 'Serving'}</span>
                              {f.hasBeverageModifiers && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--v-cobalt)', border: '1.5px solid var(--v-cobalt)', padding: '2px 7px', borderRadius: 6 }}>Build Drink</span>}
                              {f.category === 'dish' && <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', color: 'var(--v-volt-text)', border: '1.5px solid var(--v-volt)', padding: '2px 7px', borderRadius: 6 }}>Dish</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                            <button type="button" aria-label={`Favorite ${f.name}`} onClick={(e) => { e.stopPropagation(); toggleFavoriteFood(f.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'flex' }}>
                              <Star size={20} color={favoriteIds && favoriteIds.includes(f.id) ? 'var(--v-volt-text)' : 'var(--v-dim)'} fill={favoriteIds && favoriteIds.includes(f.id) ? 'var(--v-volt)' : 'transparent'} />
                            </button>
                            <ChevronRight size={19} color="var(--v-dim)" />
                          </div>
                        </div>
                      ))}
                    </div>

                    {searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                      <div style={{ textAlign: 'center', padding: '48px 20px', color: 'var(--v-dim)' }}>
                        <Search size={44} color="var(--v-dim)" style={{ margin: '0 auto 14px', opacity: 0.5 }} />
                        <p style={{ fontSize: 15.5, fontWeight: 700, margin: '0 0 20px' }}>No results found.</p>
                        <VoltPill small onClick={() => setShowCustom(true)}>+ Add Custom Food</VoltPill>
                      </div>
                    )}
                    {searchResults.length > 0 && (
                      <div style={{ textAlign: 'center', marginTop: 26 }}>
                        <button type="button" onClick={() => setShowCustom(true)} style={{ background: 'none', border: 'none', color: 'var(--v-volt-text)', fontFamily: "'Archivo', sans-serif", fontSize: 13.5, fontWeight: 800, cursor: 'pointer', padding: 10 }}>
                          Can&apos;t find it? Add Custom Info
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Portal>
      )}

      <VoltTDEEDetailSheet isOpen={showTDEEDetails} onClose={() => setShowTDEEDetails(false)} tdeeEstimate={tdeeEstimate} />
    </div>
  );
}
