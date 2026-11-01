import { useNavigate } from 'react-router-dom';
import { Portal } from '../../v1/shared/SharedComponents';
import { QuestAdaptiveBanner, QuestTDEECard, QuestTDEESheet } from '../shared/QuestDietInsights';
import { computeNewTarget, recomputeMacros } from '../../../utils/adaptiveCalories';
import { DIET_TYPES } from '../../../data/diets';
import { tod, kgToLbs, cmToFtIn, clamp } from '../../../utils/helpers';
import { foodCategories } from '../../../data/foods/foodCategories';
import { useDiet } from '../../../core/hooks/useDiet';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel, SegBar } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Diet — the ITEM SHOP (plan §7.5, Q-5) ────────────────────
// Same brain as V1/Volt (useDiet), Quest presentation: the calorie budget is
// a gold purse, macros are mini segbars (P sky / C gold / F ember), meals are
// shelves of items, the add-food sheet is the shop shelf, and Targets Locked
// reads SHOP CLOSED. MEAL_SLOTS / FASTING_TYPES are the same data constants
// the Volt page carries (they live unexported in the frozen V1 file).

const FASTING_TYPES = [
  { id: '', label: 'None' },
  { id: 'navratri', label: 'Navratri' },
  { id: 'ekadashi', label: 'Ekadashi' },
  { id: 'ramzan', label: 'Ramzan' },
  { id: 'jain-paryushana', label: 'Jain Paryushana' },
  { id: 'maha-shivratri', label: 'Maha Shivratri' },
];

const MEAL_SLOTS = [
  { id: 'Breakfast', sprite: 'sun', targetPct: 0.25 },
  { id: 'Mid-Morning', sprite: 'bolt', targetPct: 0.05 },
  { id: 'Lunch', sprite: 'apple', targetPct: 0.35 },
  { id: 'Pre-Workout', sprite: 'flame', targetPct: 0.05 },
  { id: 'Post-Workout Dinner', sprite: 'dumbbell', targetPct: 0.25 },
  { id: 'Before Bed', sprite: 'moon', targetPct: 0.05 },
];

const qSelect = {
  width: '100%', minHeight: 48, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

function QFilterChip({ active, onClick, children }) {
  return (
    <button
      type="button"
      className="q-chip"
      onClick={onClick}
      style={{
        cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
        ...(active ? { background: 'var(--q-volt)', color: 'var(--q-btn-fg)' } : {}),
      }}
    >
      {children}
    </button>
  );
}

function CartTab({ active, onClick, children }) {
  return (
    <button
      type="button"
      className="q-btn q-btn--sm"
      onClick={onClick}
      style={active ? { flex: 1 } : { flex: 1, background: 'var(--q-panel)', color: 'var(--q-dim)', boxShadow: 'none' }}
    >
      {children}
    </button>
  );
}

function MacroMini({ label, val, target, unit, tone }) {
  const over = val > target;
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 5 }}>
        <span className="q-ps" style={{ fontSize: 9.5 }}>{label}</span>
        <span style={{ fontSize: 17.5, color: 'var(--q-dim)' }}>
          <strong style={{ color: over ? 'var(--q-ember-text)' : 'var(--q-ink)', fontWeight: 400 }}>{Math.round(val)}</strong> / {target} {unit}
        </span>
      </div>
      <SegBar value={clamp((val / (target || 1)) || 0, 0, 1)} segments={12} tone={over ? 'ember' : tone} label={label} />
    </div>
  );
}

// Weekly stacked macro chart as block columns (P sky / C gold / F ember).
function QuestWeeklyChart({ data }) {
  const maxTotal = Math.max(...data.map(d => d.protein + d.carbs + d.fat), 1);
  const segments = [
    { key: 'protein', color: 'var(--q-sky)', label: 'Protein' },
    { key: 'carbs', color: 'var(--q-gold)', label: 'Carbs' },
    { key: 'fat', color: 'var(--q-ember)', label: 'Fat' },
  ];
  return (
    <div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 178 }}>
        {data.map(d => {
          const total = d.protein + d.carbs + d.fat;
          return (
            <div key={d.date} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, minWidth: 0 }}>
              <span className="q-meta">{total || ''}</span>
              <div style={{ width: '100%', maxWidth: 38, height: 132, display: 'flex', flexDirection: 'column-reverse', border: '3px solid var(--q-border)', background: 'var(--q-slot)' }}>
                {segments.map(s => (
                  <div key={s.key} style={{ height: `${(d[s.key] / maxTotal) * 100}%`, background: s.color, minHeight: d[s.key] > 0 ? 3 : 0 }} />
                ))}
              </div>
              <span className="q-ps" style={{ fontSize: 8 }}>{d.dayName.toUpperCase()}</span>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginTop: 14, flexWrap: 'wrap' }}>
        {segments.map(s => (
          <span key={s.key} className="q-meta" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 10, height: 10, background: s.color, border: '2px solid var(--q-border)', display: 'inline-block' }} />
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

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* ── Header ── */}
      <header>
        <QuestLabel tone="volt">Item Shop · Personalised for {firstName} · Target {goalKcal} kcal</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(21px, 6vw, 32px)', lineHeight: 1.35, margin: '10px 0 0' }}>ITEM SHOP</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 14 }}>
          {[
            { l: 'WEIGHT', v: user?.weight ? (isImpWeight ? `${kgToLbs(user.weight)} LBS` : `${user.weight} KG`) : '—' },
            { l: 'HEIGHT', v: user?.height ? (isImpHeight ? cmToFtIn(user.height) : `${user.height} CM`) : '—' },
            { l: 'BMI', v: (!bmi || isNaN(bmi) || bmi === 0) ? '—' : bmi },
            { l: 'BODY FAT', v: latestBF ? `${latestBF.percentage}%` : '—' },
            { l: 'TDEE', v: (!tdee || isNaN(tdee) || tdee === 0) ? '—' : `${tdee} KCAL` },
            { l: 'ACTIVITY', v: (user?.activityLevel || 'moderate').toUpperCase() },
          ].map(({ l, v }) => (
            <span key={l} className="q-chip">{l}&nbsp;<strong>{v}</strong></span>
          ))}
        </div>
      </header>

      {/* ── Adaptive banner + TDEE insight ── */}
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
          <QuestAdaptiveBanner
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
        <QuestAdaptiveBanner
          suggestion={adaptiveSuggestion}
          currentKcal={goalKcal}
          newKcal={goalKcal}
          onAccept={acceptSuggestion}
          onDismiss={dismissSuggestion}
        />
      )}

      <QuestTDEECard
        tdeeEstimate={tdeeEstimate}
        onUpdateTargets={handleUpdateTDEETargets}
        onLearnMore={() => setShowTDEEDetails(true)}
      />
      {!isUnset && tdeeEstimate?.confidence === 'insufficient' && (
        <QuestBlock variant="panel2" flat style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <PixelSprite name="bolt" size={20} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 19 }}>Learning your metabolism…</div>
            <div style={{ fontSize: 17, color: 'var(--q-dim)', lineHeight: 1.45, marginTop: 2 }}>Log your weight and food consistently for at least 10 days to unlock Adaptive TDEE targets.</div>
          </div>
        </QuestBlock>
      )}

      {/* ── The gold purse (goal block) ── */}
      <QuestBlock>
        {isUnset ? (
          <div style={{ textAlign: 'center', padding: '16px 8px' }}>
            <QuestLabel tone="ember">Shop Closed</QuestLabel>
            <div className="q-ps" style={{ fontSize: 16, lineHeight: 1.6, marginTop: 12 }}>COMPLETE YOUR<br />CHARACTER STATS</div>
            <p style={{ fontSize: 17.5, color: 'var(--q-dim)', margin: '12px auto 18px', maxWidth: 400, lineHeight: 1.5 }}>
              Complete your profile with your age, height, current weight, and target weight to generate your personalized macros.
            </p>
            <QuestBtn tone="ember" onClick={() => navigate('/profile')}>UPDATE STATS</QuestBtn>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <QuestLabel tone="gold">Gold Purse</QuestLabel>
              <QuestChip tone="gold">GOAL: {goal === 'loss' ? 'CUT' : goal === 'gain' ? 'BULK' : 'MAINTAIN'}{isCustomTarget ? ' · CUSTOM' : ''}</QuestChip>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 14 }}>
              <PixelSprite name="coin" size={34} />
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                <span className="q-ps" style={{ fontSize: 'clamp(24px, 7vw, 36px)', color: 'var(--q-gold-text)' }}>{Math.round(todayTotals.calories)}</span>
                <span className="q-meta">/ {goalKcal} KCAL TODAY</span>
              </div>
            </div>
            <SegBar value={clamp((todayTotals.calories / (goalKcal || 1)) || 0, 0, 1)} segments={16} tone={todayTotals.calories > goalKcal ? 'ember' : 'gold'} label="Calories" style={{ marginTop: 12 }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
              <MacroMini label="PROTEIN" val={todayTotals.protein} target={protTarget} unit="g" tone="sky" />
              <MacroMini label="CARBS" val={todayTotals.carbs} target={carbsTarget} unit="g" tone="gold" />
              <MacroMini label="FAT" val={todayTotals.fat} target={fatTarget} unit="g" tone="ember" />
            </div>

            <div style={{ borderTop: '3px solid var(--q-panel2)', marginTop: 20, paddingTop: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
              <div>
                <QuestLabel>Energy Balance</QuestLabel>
                <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 5 }}>
                  In: <strong style={{ color: 'var(--q-ink)', fontWeight: 400 }}>{Math.round(todayTotals.calories)}</strong> − Out: <strong style={{ color: 'var(--q-ink)', fontWeight: 400 }}>{Math.round(todayCaloriesBurned)}</strong>
                </div>
              </div>
              <div style={{ fontSize: 27, color: energyBalance > goalKcal ? 'var(--q-ember-text)' : 'var(--q-volt-text)' }}>
                {Math.round(energyBalance)} <span className="q-meta">KCAL NET</span>
              </div>
            </div>

            <div className="q-meta" style={{ marginTop: 14, textAlign: 'center', lineHeight: 1.5 }}>
              PROTEIN FROM {goal === 'loss' && user.weightGoal && user.weightGoal < user.weight ? 'GOAL WEIGHT' : 'CURRENT WEIGHT'} ({isImpWeight ? kgToLbs(baseWeightForProtein) + ' LBS' : baseWeightForProtein + 'KG'}) × {protMultiplier}G/KG
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
              <button type="button" className="q-chip" onClick={() => setActiveTab('tracker')} style={{ cursor: 'pointer' }}>TRACK TODAY ↓</button>
            </div>
            {isCustomTarget && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
                <button
                  type="button"
                  onClick={() => updateProfile({ customGoalKcal: null, customProteinG: null })}
                  style={{ fontSize: 16.5, color: 'var(--q-dim)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'VT323', monospace" }}
                >
                  Custom target active · <span style={{ color: 'var(--q-volt-text)' }}>Reset to calculated</span>
                </button>
              </div>
            )}
          </>
        )}
      </QuestBlock>

      {/* ── Tabs (cartridges) ── */}
      <div style={{ display: 'flex', gap: 8 }}>
        <CartTab active={activeTab === 'tracker'} onClick={() => setActiveTab('tracker')}>TRACKER</CartTab>
        <CartTab active={activeTab === 'guide'} onClick={() => setActiveTab('guide')}>GUIDE</CartTab>
        <CartTab active={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')}>STATS</CartTab>
      </div>

      {/* ── Guide tab ── */}
      {activeTab === 'guide' && (
        <>
          <QuestBlock>
            <div className="q-ps" style={{ fontSize: 13, lineHeight: 1.6 }}>YOUR MEAL BLUEPRINT</div>
            <p style={{ fontSize: 17.5, color: 'var(--q-dim)', margin: '10px 0 0', lineHeight: 1.5 }}>
              These are AI-curated meal suggestions based on your {goal === 'loss' ? 'cut' : goal === 'gain' ? 'bulk' : 'maintenance'} goal and {DIET_TYPES[diet].label} diet. Use these as a daily reference — log your actual intake in the Daily Tracker.
            </p>
          </QuestBlock>

          <QuestBlock variant="panel2" flat style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: 250, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, border: '3px solid var(--q-border)', background: 'var(--q-slot)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PixelSprite name="bolt" size={22} />
              </div>
              <div>
                <div style={{ fontSize: 19.5 }}>Whey Protein — {wheyScoops} scoop{wheyScoops > 1 ? 's' : ''}/day ({wheyProt}g)</div>
                <div style={{ fontSize: 16.5, color: 'var(--q-dim)', marginTop: 2 }}>{foodProt}g from food + {wheyProt}g from whey = {protTarget}g target.</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {Object.values(DIET_TYPES).map(d => (
                <QFilterChip key={d.id} active={diet === d.id} onClick={() => handleSetDiet(d.id)}>{d.label.toUpperCase()}</QFilterChip>
              ))}
            </div>
          </QuestBlock>

          <QuestLabel tone="volt">The Menu</QuestLabel>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {dt.meals.map((meal, i) => {
              const items = meal.items[gKey] || meal.items.maintain || [];
              const wheyLines = [];
              if (meal.label === 'Breakfast') wheyLines.push(`+ 1 scoop ${diet === 'vegan' ? 'plant protein (pea+rice)' : 'whey'} — complete protein`);
              if (meal.label === 'Post-Workout Dinner') wheyLines.push('+ 1 scoop whey within 30 min post-workout');
              if (wheyScoops >= 3 && meal.label === 'Mid-Morning') wheyLines.push(`+ Extra scoop protein (${protTarget}g target)`);
              if (wheyScoops >= 4 && meal.label === 'Before Bed') wheyLines.push('+ 1 scoop casein/whey before bed');
              const all = [...items, ...wheyLines];
              const slotSprite = MEAL_SLOTS.find(m => m.id === meal.label)?.sprite || 'apple';
              return (
                <QuestBlock key={i} variant="panel2" flat>
                  <div style={{ display: 'flex', gap: 11, alignItems: 'center', marginBottom: 13 }}>
                    <div style={{ width: 38, height: 38, border: '3px solid var(--q-border)', background: 'var(--q-slot)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <PixelSprite name={slotSprite} size={19} />
                    </div>
                    <div className="q-ps" style={{ fontSize: 11.5, lineHeight: 1.5 }}>{meal.label.toUpperCase()}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {all.map((item, j) => {
                      const isW = item.startsWith('+');
                      return (
                        <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: isW ? '7px 9px' : '1px 0', fontSize: 17.5, lineHeight: 1.4, color: isW ? 'var(--q-volt-text)' : 'var(--q-dim)', background: isW ? 'var(--q-slot)' : 'transparent', border: isW ? '3px solid var(--q-border)' : 'none' }}>
                          {!isW && <span style={{ width: 7, height: 7, background: 'var(--q-volt)', flexShrink: 0, marginTop: 8 }} />}
                          <span>{item}</span>
                        </div>
                      );
                    })}
                  </div>
                  <div style={{ marginTop: 14, paddingTop: 12, borderTop: '3px solid var(--q-panel)' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                      <span className="q-chip"><strong style={{ color: 'var(--q-sky)' }}>P</strong>&nbsp;{meal.macros.p}g</span>
                      <span className="q-chip"><strong style={{ color: 'var(--q-gold-text)' }}>C</strong>&nbsp;{meal.macros.c}g</span>
                      <span className="q-chip"><strong style={{ color: 'var(--q-ember-text)' }}>F</strong>&nbsp;{meal.macros.f}g</span>
                    </div>
                    <div className="q-meta" style={{ lineHeight: 1.5 }}><span style={{ color: 'var(--q-volt-text)' }}>MICROS: </span>{meal.micros.join(' · ').toUpperCase()}</div>
                  </div>
                </QuestBlock>
              );
            })}
          </div>

          {dt.proteinSources && (
            <QuestBlock variant="panel2" flat style={{ borderLeft: '5px solid var(--q-volt)' }}>
              <QuestLabel tone="volt">Best Protein Sources — {dt.label}</QuestLabel>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 11 }}>
                {dt.proteinSources.map(s => <span key={s} className="q-chip">{s.toUpperCase()}</span>)}
              </div>
            </QuestBlock>
          )}
          <QuestBlock variant="slot" flat style={{ fontSize: 17, color: 'var(--q-dim)', lineHeight: 1.5 }}>
            <strong style={{ color: 'var(--q-volt-text)', fontWeight: 400 }}>Complete Protein Tip:</strong> Combine legumes + grains per meal (dal+rice, chana+roti) to cover all 9 essential amino acids. Whey protein already contains all 9 EAAs in every scoop.
          </QuestBlock>
        </>
      )}

      {/* ── Analysis tab ── */}
      {activeTab === 'analysis' && (
        <>
          {(diet === 'vegetarian' || diet === 'vegan') && weeklyMicros.vitaminB12 < 1.5 && (
            <QuestBlock variant="panel2" flat style={{ borderLeft: '5px solid var(--q-ember)' }}>
              <div className="q-ps" style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--q-ember-text)' }}>LOW B12 LOGGED THIS WEEK</div>
              <p style={{ fontSize: 17, color: 'var(--q-dim)', margin: '8px 0 0', lineHeight: 1.5 }}>Vegetarians can&apos;t get sufficient B12 from plants alone. Consider fortified milk, or discuss a B12 supplement with a professional.</p>
            </QuestBlock>
          )}
          {weeklyMicros.vitaminD < 200 * 7 && (
            <QuestBlock variant="panel2" flat style={{ borderLeft: '5px solid var(--q-gold)' }}>
              <div className="q-ps" style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--q-gold-text)' }}>LOW VITAMIN D3 DETECTED</div>
              <p style={{ fontSize: 17, color: 'var(--q-dim)', margin: '8px 0 0', lineHeight: 1.5 }}>Top food sources are egg yolk, fatty fish, and fortified milk. A D3 supplement is recommended for most Indians.</p>
            </QuestBlock>
          )}
          {user.gender === 'female' && weeklyMicros.iron < 18 * 7 && (
            <QuestBlock variant="panel2" flat style={{ borderLeft: '5px solid var(--q-red)' }}>
              <div className="q-ps" style={{ fontSize: 11, lineHeight: 1.6, color: 'var(--q-ember-text)' }}>LOW IRON INTAKE</div>
              <p style={{ fontSize: 17, color: 'var(--q-dim)', margin: '8px 0 0', lineHeight: 1.5 }}>Your iron intake looks low this week. Top sources: palak, rajma, chana, ragi, dates, and non-veg options.</p>
            </QuestBlock>
          )}

          <QuestBlock>
            <div className="q-ps" style={{ fontSize: 12.5, lineHeight: 1.6, marginBottom: 18 }}>WEEKLY MACRO ADHERENCE</div>
            <QuestWeeklyChart data={weeklyData} />
          </QuestBlock>
        </>
      )}

      {/* ── Tracker tab ── */}
      {activeTab === 'tracker' && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <h2 className="q-ps" style={{ fontSize: 15, margin: 0 }}>DAILY LEDGER</h2>
            {foodStreak.current >= 3 && (
              <QuestChip tone="ember"><PixelSprite name="flame" size={11} /> {foodStreak.current} DAY STREAK</QuestChip>
            )}
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ flex: '1.5 1 220px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--q-panel)', border: '3px solid var(--q-border)', boxShadow: '5px 5px 0 rgba(0,0,0,0.35)', padding: 4 }}>
              <button type="button" onClick={() => changeDate(-1)} aria-label="Previous day" className="q-chip" style={{ cursor: 'pointer', minWidth: 40, minHeight: 40, justifyContent: 'center' }}><PixelSprite name="chevL" size={13} /></button>
              <span style={{ fontSize: 19, whiteSpace: 'nowrap' }}>{dateStr === tod() ? 'Today' : dateStr}</span>
              <button type="button" onClick={() => changeDate(1)} aria-label="Next day" className="q-chip" style={{ cursor: 'pointer', minWidth: 40, minHeight: 40, justifyContent: 'center' }}><PixelSprite name="chevR" size={13} /></button>
            </div>
            <QuestBtn tone="ghost" onClick={handleCopyYesterday} style={{ flex: '1 1 130px' }}>COPY Y&apos;DAY</QuestBtn>
          </div>

          {protTarget - todayTotals.protein > 30 && new Date().getHours() >= 18 && (
            <QuestBlock variant="panel2" flat style={{ borderLeft: '5px solid var(--q-ember)' }}>
              <QuestLabel tone="ember">High-Impact Nudge</QuestLabel>
              <p style={{ fontSize: 17.5, color: 'var(--q-dim)', margin: '9px 0 13px', lineHeight: 1.5 }}>You&apos;re <strong style={{ color: 'var(--q-ink)', fontWeight: 400 }}>{Math.round(protTarget - todayTotals.protein)}g</strong> short on protein today.</p>
              <QuestBtn
                sm
                onClick={() => {
                  if (chatbot) {
                    chatbot.openChat();
                    setTimeout(() => chatbot.sendMessage(`I need ${Math.round(protTarget - todayTotals.protein)}g more protein today. What are some quick meal ideas?`), 300);
                  }
                }}
              >
                <PixelSprite name="bot" size={14} /> ASK FORGE FOR IDEAS
              </QuestBtn>
            </QuestBlock>
          )}

          {/* Hydration */}
          <QuestBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10, flexWrap: 'wrap' }}>
              <div>
                <div className="q-ps" style={{ fontSize: 12 }}>HYDRATION</div>
                <div className="q-meta" style={{ marginTop: 5 }}>{selectedDateWaterTotal} / {waterGoal} ML</div>
              </div>
              <QuestChip tone="volt">{waterPct}%</QuestChip>
            </div>
            <SegBar value={waterPct / 100} segments={12} tone="sky" label="Hydration" />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginTop: 14 }}>
              {[{ ml: 250, label: 'GLASS' }, { ml: 500, label: 'BOTTLE' }, { ml: 750, label: 'SHAKER' }].map(preset => (
                <QuestBtn key={preset.ml} sm tone="ghost" onClick={() => addWater(preset.ml)}>
                  +{preset.ml} {preset.label}
                </QuestBtn>
              ))}
            </div>
          </QuestBlock>

          {/* Supplements */}
          <QuestBlock>
            <div style={{ marginBottom: 14 }}>
              <div className="q-ps" style={{ fontSize: 12 }}>SUPPLEMENTS</div>
              <div className="q-meta" style={{ marginTop: 5 }}>DAILY STACK</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 8 }}>
              {userSupps.map(supp => {
                const isTaken = selectedDateSuppLog.some(l => l.suppId === supp.id);
                return (
                  <button
                    key={supp.id}
                    type="button"
                    onClick={() => toggleSupplement(supp.id)}
                    style={{ padding: 12, background: isTaken ? 'var(--q-slot)' : 'var(--q-panel)', border: isTaken ? '3px solid var(--q-volt)' : '3px solid var(--q-panel2)', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, textAlign: 'left', color: 'var(--q-ink)', fontFamily: "'VT323', monospace" }}
                  >
                    <span>
                      <span style={{ display: 'block', fontSize: 18, color: isTaken ? 'var(--q-volt-text)' : 'var(--q-ink)' }}>{supp.name}</span>
                      <span style={{ display: 'block', fontSize: 15.5, color: 'var(--q-dim)', marginTop: 1 }}>{supp.dose}</span>
                    </span>
                    <span style={{ width: 22, height: 22, background: isTaken ? 'var(--q-volt)' : 'transparent', border: '3px solid var(--q-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {isTaken && <PixelSprite name="check" size={11} />}
                    </span>
                  </button>
                );
              })}
            </div>
          </QuestBlock>

          {/* Meal shelves */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {MEAL_SLOTS.map(slot => {
              const slotCals = Math.round(goalKcal * slot.targetPct);
              const items = dailyLog.filter(l => l.slot === slot.id);
              const slotTotal = Math.round(items.reduce((s, i) => s + (i.macros?.calories || 0), 0));
              return (
                <QuestBlock key={slot.id} style={{ padding: 16 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, cursor: 'pointer' }} onClick={() => handleOpenSearch(slot.id)}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 13, minWidth: 0 }}>
                      <div style={{ width: 46, height: 46, border: '3px solid var(--q-border)', background: 'var(--q-slot)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <PixelSprite name={slot.sprite} size={23} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div className="q-ps" style={{ fontSize: 11.5, lineHeight: 1.5 }}>{slot.id.toUpperCase()}</div>
                        <div className="q-meta" style={{ marginTop: 4 }}>~{slotCals} KCAL · {Math.round(slot.targetPct * 100)}%</div>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 24, lineHeight: 1, color: slotTotal > 0 ? 'var(--q-volt-text)' : 'var(--q-dim)' }}>{slotTotal}</div>
                        <div className="q-meta" style={{ marginTop: 3 }}>KCAL</div>
                      </div>
                      <span className="q-btn q-btn--sm" aria-hidden="true"><PixelSprite name="plus" size={12} /></span>
                    </div>
                  </div>
                  {items.length > 0 && (
                    <div style={{ marginTop: 14, paddingTop: 12, borderTop: '3px solid var(--q-panel2)', display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {items.map(i => (
                        <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, padding: '9px 11px', border: '3px solid var(--q-border)', background: 'var(--q-slot)' }}>
                          <div style={{ minWidth: 0 }}>
                            <div style={{ fontSize: 18.5 }}>{i.name}</div>
                            <div style={{ fontSize: 15.5, marginTop: 3, display: 'flex', gap: 9 }}>
                              <span style={{ color: 'var(--q-sky)' }}>P {Math.round(i.macros?.protein || 0)}g</span>
                              <span style={{ color: 'var(--q-gold-text)' }}>C {Math.round(i.macros?.carbs || 0)}g</span>
                              <span style={{ color: 'var(--q-ember-text)' }}>F {Math.round(i.macros?.fat || 0)}g</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
                            <span style={{ fontSize: 20 }}>{Math.round(i.macros?.calories || 0)}</span>
                            {i.food && (
                              <button type="button" className="q-chip" aria-label={`Edit ${i.name}`} onClick={(e) => { e.stopPropagation(); editEntry(i); }} style={{ cursor: 'pointer' }}>EDIT</button>
                            )}
                            <button type="button" className="q-chip" aria-label="Remove food entry" onClick={(e) => { e.stopPropagation(); removeEntry(i.id); }} style={{ cursor: 'pointer' }}><PixelSprite name="x" size={10} /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </QuestBlock>
              );
            })}
          </div>

          {/* Log-item FAB */}
          <button
            type="button"
            className="q-btn q-btn--ember"
            onClick={() => handleOpenSearch('Snack/General')}
            aria-label="Log food"
            style={{ position: 'fixed', bottom: 100, right: 16, zIndex: 60, padding: '0 18px' }}
          >
            <PixelSprite name="plus" size={13} /> LOG ITEM
          </button>
        </>
      )}

      {/* ── The Shelf (search / log sheet) ── */}
      {showSearch && (
        <Portal>
          <div className="q-sheet-wrap" onClick={closeSearch}>
            <div
              className="q-sheet"
              role="dialog"
              aria-label={`Add food to ${searchMealSlot}`}
              onClick={e => e.stopPropagation()}
              style={{ height: '88vh', maxHeight: '88vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', maxWidth: 560 }}
            >
              {selectedFood || showCustom ? (
                <>
                  <div style={{ flex: 1, overflowY: 'auto', padding: 18, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
                      <button type="button" className="q-chip" aria-label="Back to results" onClick={() => { setSelectedFood(null); setShowCustom(false); }} style={{ cursor: 'pointer', minWidth: 42, minHeight: 42, justifyContent: 'center' }}><PixelSprite name="chevL" size={13} /></button>
                      <button type="button" className="q-chip" aria-label="Close search" onClick={closeSearch} style={{ cursor: 'pointer', minWidth: 42, minHeight: 42, justifyContent: 'center' }}><PixelSprite name="x" size={12} /></button>
                    </div>

                    {showCustom ? (
                      <div style={{ flex: 1 }}>
                        <div className="q-ps" style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>ADD CUSTOM ITEM</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                          <div><QuestLabel>Name</QuestLabel><input className="q-slot-input" style={{ marginTop: 7 }} placeholder="E.g. Homemade Cookie" value={customInput.name} onChange={e => setCustomInput({ ...customInput, name: e.target.value })} /></div>
                          <div><QuestLabel>Calories (Kcal)</QuestLabel><input className="q-slot-input" style={{ marginTop: 7 }} type="number" placeholder="0" value={customInput.cals} onChange={e => setCustomInput({ ...customInput, cals: e.target.value })} /></div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 11 }}>
                            <div><QuestLabel>Pro (g)</QuestLabel><input className="q-slot-input" style={{ marginTop: 7 }} type="number" placeholder="0" value={customInput.p} onChange={e => setCustomInput({ ...customInput, p: e.target.value })} /></div>
                            <div><QuestLabel>Carbs (g)</QuestLabel><input className="q-slot-input" style={{ marginTop: 7 }} type="number" placeholder="0" value={customInput.c} onChange={e => setCustomInput({ ...customInput, c: e.target.value })} /></div>
                            <div><QuestLabel>Fat (g)</QuestLabel><input className="q-slot-input" style={{ marginTop: 7 }} type="number" placeholder="0" value={customInput.f} onChange={e => setCustomInput({ ...customInput, f: e.target.value })} /></div>
                          </div>
                          <QuestBtn onClick={saveCustomFood} style={{ marginTop: 10, width: '100%' }}>ADD CUSTOM ITEM</QuestBtn>
                        </div>
                      </div>
                    ) : (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ marginBottom: 8 }}><QuestChip>{(foodCategories.find(c => c.id === selectedFood.category)?.label || 'Food').toUpperCase()}</QuestChip></div>
                        <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.55, marginBottom: 14 }}>{selectedFood.name.toUpperCase()}</div>

                        <QuestBlock variant="slot" flat style={{ padding: 14 }}>
                          <QuestLabel>Serving Selection</QuestLabel>
                          <div style={{ display: 'flex', gap: 6, margin: '9px 0 16px', overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                            {selectedFood.servings?.map(s => {
                              const sel = servingId === s.id && !customGrams;
                              return (
                                <QFilterChip
                                  key={s.id}
                                  active={sel}
                                  onClick={() => { setServingId(s.id); setCustomGrams(''); }}
                                >
                                  {s.isDeliveryPortion ? 'BOX ' : ''}{s.label} ({s.grams}g)
                                  {servingId === s.id && s.grams && qty !== 1 ? ` → ${Math.round(s.grams * qty * 10) / 10}g` : ''}
                                </QFilterChip>
                              );
                            })}
                          </div>

                          <QuestLabel>Or enter exact grams</QuestLabel>
                          <input className="q-slot-input" style={{ margin: '7px 0 16px' }} type="number" placeholder="e.g. 150" value={customGrams} onChange={e => { setCustomGrams(e.target.value); setServingId('custom'); }} />

                          {!customGrams && (
                            <>
                              <QuestLabel>Multiplier (Qty)</QuestLabel>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '7px 0 16px' }}>
                                <QuestBtn sm tone="ghost" onClick={handleQtyMinus} disabled={qty <= 0.25} aria-label="Decrease quantity">−</QuestBtn>
                                <input
                                  className="q-slot-input"
                                  type="number" value={qtyInput} onChange={handleQtyInputChange} onBlur={handleQtyInputBlur}
                                  onFocus={e => e.target.select()} inputMode="decimal" step="0.25" min="0.25" aria-label="Quantity"
                                  style={{ width: 76, textAlign: 'center' }}
                                />
                                <QuestBtn sm tone="ghost" onClick={handleQtyPlus} aria-label="Increase quantity">+</QuestBtn>
                              </div>
                            </>
                          )}

                          {selectedFood.supportedConsistencyTypes && selectedFood.supportedConsistencyTypes.length > 0 && (
                            <div style={{ marginBottom: 16 }}>
                              <QuestLabel>Consistency / Thickness</QuestLabel>
                              <div style={{ display: 'flex', gap: 6, marginTop: 7, overflowX: 'auto', paddingBottom: 4, scrollbarWidth: 'none' }}>
                                <QFilterChip active={consistency === 'standard'} onClick={() => setConsistency('standard')}>NORMAL</QFilterChip>
                                {selectedFood.supportedConsistencyTypes.includes('thin') && (
                                  <QFilterChip active={consistency === 'thin'} onClick={() => setConsistency('thin')}>WATERY (THIN)</QFilterChip>
                                )}
                                {selectedFood.supportedConsistencyTypes.includes('thick') && (
                                  <QFilterChip active={consistency === 'thick'} onClick={() => setConsistency('thick')}>RESTAURANT (THICK)</QFilterChip>
                                )}
                              </div>
                            </div>
                          )}

                          {user.weightGoal && user.weightGoal < user.weight && selectedFood.gi && selectedFood.gi > 70 && (
                            <div style={{ padding: 12, border: '3px solid var(--q-ember)', marginBottom: 16 }}>
                              <QuestLabel tone="ember">High Glycemic Index ({selectedFood.gi})</QuestLabel>
                              <p style={{ fontSize: 16.5, color: 'var(--q-dim)', margin: '7px 0 0', lineHeight: 1.5 }}>This food may rapidly spike blood sugar. For your fat-loss goal, consider smaller portions or alternatives like Jowar, Bajra, or Brown Rice.</p>
                            </div>
                          )}

                          {selectedFood.hasBeverageModifiers && (
                            <div style={{ marginTop: 6 }}>
                              <QuestLabel>Milk Choice (Beverage Builder)</QuestLabel>
                              <select value={milkMod} onChange={e => setMilkMod(e.target.value)} style={{ ...qSelect, margin: '7px 0 16px' }}>
                                <option value="none">No Milk / Black (water base)</option>
                                <option value="milk-full-fat">Full-Fat Milk (150ml)</option>
                                <option value="milk-toned">Toned Milk (150ml)</option>
                                <option value="milk-soy">Soy Milk (150ml)</option>
                                <option value="milk-almond">Almond Milk (150ml)</option>
                              </select>
                              <QuestLabel>Sweeteners &amp; Add-ins</QuestLabel>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 7 }}>
                                {['sugar-white', 'jaggery', 'honey'].map(sw => {
                                  const sel = sweetMods.includes(sw);
                                  return (
                                    <button
                                      key={sw}
                                      type="button"
                                      className="q-chip"
                                      onClick={() => { if (sel) setSweetMods(p => p.filter(x => x !== sw)); else setSweetMods(p => [...p, sw]); }}
                                      style={{ cursor: 'pointer', ...(sel ? { background: 'var(--q-sky)', color: '#14141F' } : {}) }}
                                    >
                                      {sw.replace('-', ' ').toUpperCase()}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {selectedFood.supportedConsistencyTypes?.length > 0 && (
                            <div style={{ marginTop: 20 }}>
                              <QuestLabel>Gravy Consistency</QuestLabel>
                              <div style={{ display: 'flex', gap: 8, marginTop: 7 }}>
                                {selectedFood.supportedConsistencyTypes.map(cType => (
                                  <QFilterChip key={cType} active={consistency === cType} onClick={() => setConsistency(cType)}>{cType.toUpperCase()}</QFilterChip>
                                ))}
                              </div>
                            </div>
                          )}

                          {(selectedFood.itemType === 'dish' || selectedFood.itemType === 'sabzi-veg' || selectedFood.itemType === 'dal-legume') && (
                            <div style={{ marginTop: 20, padding: 13, background: 'var(--q-panel)', border: '3px solid var(--q-border)' }}>
                              <span style={{ fontSize: 18.5 }}>Cooked in Oil/Ghee?</span>
                              <p style={{ fontSize: 16.5, color: 'var(--q-dim)', marginTop: 5, lineHeight: 1.5 }}>Indian dishes absorb variable amounts of fat. If this is a homemade dish cooked in oil, add a secondary 15g entry.</p>
                              <QuestBtn sm tone="ghost" onClick={addCookingOil} style={{ marginTop: 11, width: '100%' }}>+ ADD COOKING OIL/GHEE (130 KCAL)</QuestBtn>
                            </div>
                          )}
                        </QuestBlock>
                      </div>
                    )}
                  </div>

                  {!showCustom && selectedFood && (
                    <div style={{ background: 'var(--q-panel)', borderTop: '4px solid var(--q-border)', padding: '12px 16px', flexShrink: 0 }}>
                      {totalGrams != null && (
                        <div style={{ textAlign: 'center', fontSize: 16, color: 'var(--q-dim)', marginBottom: 7 }}>
                          {qty !== 1 && (
                            <span style={{ marginRight: 4 }}>{qty} × {selectedFood?.servings?.find(s => s.id === servingId)?.grams ?? customGrams}g =</span>
                          )}
                          <span style={{ color: 'var(--q-volt-text)' }}>{Math.round(totalGrams * 10) / 10}g</span> total
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 11 }}>
                        {[
                          { l: 'KCAL', v: Math.round(previewMacros?.calories || 0), c: 'var(--q-gold-text)' },
                          { l: 'PRO', v: `${Math.round(previewMacros?.protein || 0)}g`, c: 'var(--q-sky)' },
                          { l: 'CARB', v: `${Math.round(previewMacros?.carbs || 0)}g`, c: 'var(--q-gold-text)' },
                          { l: 'FAT', v: `${Math.round(previewMacros?.fat || 0)}g`, c: 'var(--q-ember-text)' },
                        ].map(m => (
                          <div key={m.l} style={{ textAlign: 'center' }}>
                            <div className="q-meta">{m.l}</div>
                            <div style={{ fontSize: 22, color: m.c, marginTop: 2 }}>{m.v}</div>
                          </div>
                        ))}
                      </div>
                      <QuestBtn tone="ember" onClick={() => addFoodToLog(previewMacros)} style={{ width: '100%' }}>ADD TO {searchMealSlot.toUpperCase()}</QuestBtn>
                    </div>
                  )}
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
                  <div style={{ padding: '16px 18px 10px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 10 }}>
                      <div className="q-ps" style={{ fontSize: 13, lineHeight: 1.6 }}>ADD TO <span style={{ color: 'var(--q-volt-text)' }}>{searchMealSlot.toUpperCase()}</span></div>
                      <button type="button" className="q-chip" aria-label="Close meal search" onClick={closeSearch} style={{ cursor: 'pointer', minWidth: 40, minHeight: 40, justifyContent: 'center' }}><PixelSprite name="x" size={12} /></button>
                    </div>
                    <input ref={searchInputRef} className="q-slot-input" placeholder="Search dal, paneer, roti…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ minHeight: 52 }} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7, padding: '4px 18px 8px', flexShrink: 0 }}>
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {['All', 'Veg', 'Vegan', 'Egg', 'Non-Veg', 'Jain'].map(d => (
                        <QFilterChip key={d} active={searchDiet === d} onClick={() => setSearchDiet(d)}>{d.toUpperCase()}</QFilterChip>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {[{ id: 'All', label: 'All categories' }, ...foodCategories].map(c => (
                        <QFilterChip key={c.id} active={searchCat === c.id} onClick={() => setSearchCat(c.id)}>{c.label.toUpperCase()}</QFilterChip>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 6, overflowX: 'auto', scrollbarWidth: 'none' }}>
                      {[{ id: '', label: 'Fasting: Off' }, ...FASTING_TYPES].filter(t => t.label).map(t => (
                        <QFilterChip key={t.id || 'none'} active={searchFasting === t.id} onClick={() => setSearchFasting(t.id)}>{t.label.toUpperCase()}</QFilterChip>
                      ))}
                    </div>
                  </div>

                  <div style={{ overflowY: 'auto', flex: 1, padding: '12px 18px 32px' }}>
                    {!searchQuery && recentFoods.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <QuestLabel tone="volt">Recent · Quick Add</QuestLabel>
                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                          {recentFoods.map(rf => (
                            <button key={rf.id} type="button" className="q-chip" onClick={() => handleSelectFood(rf)} style={{ cursor: 'pointer', margin: '0 8px 8px 0' }}>
                              <PixelSprite name="clock" size={12} /> {rf.name.toUpperCase()}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {!searchQuery && favoriteIds.length > 0 && (
                      <div style={{ marginBottom: 24 }}>
                        <QuestLabel tone="gold">Favourites</QuestLabel>
                        <div style={{ marginTop: 10, display: 'flex', flexWrap: 'wrap' }}>
                          {favoriteIds.map(fId => {
                            const food = allFoods.find(f => f.id === fId);
                            if (!food) return null;
                            return (
                              <button key={food.id} type="button" className="q-chip" onClick={() => handleSelectFood(food)} style={{ cursor: 'pointer', margin: '0 8px 8px 0' }}>
                                <PixelSprite name="star" size={12} /> {food.name.toUpperCase()}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    <QuestLabel tone="volt">On The Shelf</QuestLabel>

                    {foodsLoading && (
                      <div style={{ padding: 36, textAlign: 'center', color: 'var(--q-dim)' }}>
                        <div className="q-ps q-blink" style={{ fontSize: 12 }}>LOADING THE SHELF…</div>
                      </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                      {searchResults.map(f => (
                        <div key={f.id} onClick={() => handleSelectFood(f)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, padding: '13px 14px', background: 'var(--q-panel2)', border: '3px solid var(--q-border)', cursor: 'pointer' }}>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 19.5, marginBottom: 5 }}>{f.name}{f.isFastingFood ? ' · FASTING' : ''}</div>
                            <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center' }}>
                              <span style={{ fontSize: 16, color: 'var(--q-dim)' }}>{f.servings?.[0]?.label || 'Serving'}</span>
                              {f.hasBeverageModifiers && <span className="q-chip" style={{ color: 'var(--q-sky)' }}>BUILD DRINK</span>}
                              {f.category === 'dish' && <span className="q-chip" style={{ color: 'var(--q-volt-text)' }}>DISH</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                            <button type="button" aria-label={`Favorite ${f.name}`} onClick={(e) => { e.stopPropagation(); toggleFavoriteFood(f.id); }} style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 6, display: 'flex', opacity: favoriteIds && favoriteIds.includes(f.id) ? 1 : 0.45 }}>
                              <PixelSprite name="star" size={19} />
                            </button>
                            <PixelSprite name="chevR" size={13} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {searchResults.length === 0 && searchQuery.trim().length >= 2 && (
                      <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--q-dim)' }}>
                        <div className="q-ps" style={{ fontSize: 12.5, marginBottom: 18 }}>NO ITEMS FOUND</div>
                        <QuestBtn sm onClick={() => setShowCustom(true)}>+ ADD CUSTOM ITEM</QuestBtn>
                      </div>
                    )}
                    {searchResults.length > 0 && (
                      <div style={{ textAlign: 'center', marginTop: 24 }}>
                        <button type="button" onClick={() => setShowCustom(true)} style={{ background: 'none', border: 'none', color: 'var(--q-volt-text)', fontFamily: "'VT323', monospace", fontSize: 18, cursor: 'pointer', padding: 10 }}>
                          Can&apos;t find it? Add Custom Item
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

      <QuestTDEESheet isOpen={showTDEEDetails} onClose={() => setShowTDEEDetails(false)} tdeeEstimate={tdeeEstimate} />
    </div>
  );
}
