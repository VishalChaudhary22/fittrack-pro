import { useState } from 'react';
import { TrendingUp, Salad, Flame, Activity } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../shared/SharedComponents';
import { DIET_TYPES } from '../../data/diets';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, calcBMR, calcTDEE, goalFromWeight, calcDeficit } from '../../utils/calculations';
import { gId, tod, kgToLbs, cmToFtIn } from '../../utils/helpers';

export default function DietPage() {
  const { user, caloriesLog, setCaloriesLog, addToast } = useApp();
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const unitHeight = user.unitHeight || 'cm';
  const isImpHeight = unitHeight === 'ft';
  const [diet, setDiet] = useState('nonveg');
  const [calInput, setCalInput] = useState({ meal: '', calories: '' });
  const [showCalLog, setShowCalLog] = useState(false);
  const dt = DIET_TYPES[diet];
  const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');

  // Dynamic deficit based on goalWeeks
  const deficitInfo = calcDeficit(user.weight, user.weightGoal, user.goalWeeks);
  const goal = deficitInfo.goal;
  const dailyDelta = deficitInfo.dailyDelta || (goal === 'loss' ? 500 : goal === 'gain' ? 400 : 0);
  const goalKcal = goal === 'loss' ? tdee - dailyDelta : goal === 'gain' ? tdee + dailyDelta : tdee;
  const baseWeightForProtein = (goal === 'loss' && user.weightGoal && user.weightGoal < user.weight)
    ? user.weightGoal
    : user.weight;
  const protMultiplier = goal === 'loss' ? 2.2 : goal === 'gain' ? 2.0 : 1.8;
  const prot = goal === 'loss' ? Math.round(baseWeightForProtein * 2.2) : goal === 'gain' ? Math.round(user.weight * 2.0) : Math.round(user.weight * 1.8);
  const carbs = Math.round((goalKcal * (goal === 'loss' ? .38 : .44)) / 4);
  const fat = Math.round((goalKcal * .26) / 9);
  const wheyScoops = prot >= 180 ? Math.min(Math.ceil((prot - 100) / 25), 4) : 2;
  const wheyProt = wheyScoops * 25;
  const foodProt = prot - wheyProt;
  const gKey = goal === 'loss' ? 'loss' : goal === 'gain' ? 'gain' : 'maintain';
  const bmi = calcBMI(user.weight, user.height);

  // Today's calorie log
  const todayStr = tod();
  const todayCals = caloriesLog.filter(l => l.date === todayStr && l.userId === user.id);
  const todayTotal = todayCals.reduce((s, l) => s + l.calories, 0);
  const calPct = Math.min(Math.round((todayTotal / goalKcal) * 100), 100);

  const consumedRatio = todayTotal / goalKcal;
  const estimatedProtein = Math.round(prot * consumedRatio);
  const estimatedCarbs   = Math.round(carbs * consumedRatio);
  const estimatedFat     = Math.round(fat * consumedRatio);

  const logCalories = () => {
    if (!calInput.meal || !calInput.calories) return;
    setCaloriesLog(p => [...p, { id: gId(), userId: user.id, date: todayStr, meal: calInput.meal, calories: parseInt(calInput.calories) }]);
    setCalInput({ meal: '', calories: '' });
    addToast('Calories logged!', 'success');
  };

  return (
    <div className="pg-in">
      <PageHeader title="Diet Guide" sub={`Personalised for ${user.name.split(' ')[0]} · ${user.weightGoal ? `Goal: ${isImpWeight ? kgToLbs(user.weightGoal) + 'lbs' : user.weightGoal + 'kg'}` : 'No goal set'}`} />

      {/* Stats bar */}
      <div className="card stripe" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700 }}>BODY STATS</div>
        {[{ l: 'Weight', v: isImpWeight ? `${kgToLbs(user.weight)}lbs` : `${user.weight}kg` }, { l: 'Height', v: isImpHeight ? cmToFtIn(user.height) : `${user.height}cm` }, { l: 'BMI', v: bmi }, { l: 'TDEE', v: `${tdee}kcal` }, { l: 'Activity', v: ACTIVITY[user.activityLevel || 'moderate']?.label.split('(')[0].trim() }].map(s => (
          <div key={s.l} style={{ padding: '6px 12px', background: 'var(--surface-container-lowest)', borderRadius: 10, border: 'none' }}>
            <div style={{ fontSize: 9, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase' }}>{s.l}</div>
            <div className="headline-md" style={{ fontSize: 14, color: 'var(--on-surface)', marginTop: 2 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Calorie Tracker Card */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <div className="headline-md" style={{ color: 'var(--on-surface)' }}>Today's Intake</div>
          <button className="btn-g" style={{ fontSize: 11, padding: '6px 12px' }} onClick={() => setShowCalLog(!showCalLog)}>{showCalLog ? 'Hide' : 'Log Meal'}</button>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--on-surface-variant)', marginBottom: 6 }}>
              <span><span style={{ color: 'var(--primary)', fontWeight: 600 }}>{todayTotal}</span> kcal consumed</span><span>{goalKcal} kcal target</span>
            </div>
            <div className="pbar" style={{ height: 10, background: 'var(--surface-container-highest)', borderRadius: 5 }}>
              <div className="pbar-fill" style={{ width: `${calPct}%`, background: todayTotal > goalKcal ? 'var(--danger)' : 'var(--primary)', borderRadius: 5 }} />
            </div>
          </div>
          <div className="headline-lg" style={{ color: todayTotal > goalKcal ? 'var(--danger)' : 'var(--primary)' }}>{calPct}%</div>
        </div>
        
        <div className="tonal-break" style={{ padding: '12px 16px', background: 'var(--surface-container-lowest)', borderRadius: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 8 }}>
            Estimated Macros (based on intake ratio)
          </div>
          {[
            { label: 'Protein', consumed: estimatedProtein, target: prot,   unit: 'g', color: '#4ECDC4' },
            { label: 'Carbs',   consumed: estimatedCarbs,   target: carbs,  unit: 'g', color: '#FFE66D' },
            { label: 'Fat',     consumed: estimatedFat,     target: fat,    unit: 'g', color: '#FF6B6B' },
          ].map(macro => (
            <div key={macro.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--on-surface-variant)', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, color: 'var(--on-surface)' }}>{macro.label}</span>
                <span>
                  <span style={{ color: macro.color, fontWeight: 600 }}>{macro.consumed}g</span> <span style={{ color: 'var(--on-surface-dim)' }}>/ {macro.target}g</span>
                </span>
              </div>
              <div className="pbar" style={{ height: 6, background: 'var(--surface-container-highest)', borderRadius: 3 }}>
                <div className="pbar-fill" style={{
                  width: `${Math.min(100, Math.round((macro.consumed / macro.target) * 100)) || 0}%`,
                  background: macro.color, borderRadius: 3
                }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginTop: 8, fontStyle: 'italic' }}>
            * Estimated from calorie intake ratio. Log macros per meal for accurate tracking (coming soon).
          </div>
        </div>

        {todayCals.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: showCalLog ? 14 : 0 }}>
            {todayCals.map(l => (
              <span key={l.id} style={{ padding: '4px 10px', background: 'var(--surface-container-highest)', borderRadius: 20, fontSize: 11, border: 'none', color: 'var(--primary)' }}>{l.meal}: {l.calories}kcal</span>
            ))}
          </div>
        )}
        {showCalLog && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'end', padding: '12px 16px', background: 'var(--surface-container-lowest)', borderRadius: 12 }}>
            <div style={{ flex: 1 }}><label style={{ color: 'var(--on-surface-variant)', fontSize: 11, marginBottom: 4 }}>Meal</label><select value={calInput.meal} onChange={e => setCalInput(p => ({ ...p, meal: e.target.value }))} style={{ fontSize: 13, padding: '10px 12px', width: '100%' }}>
              <option value="">Select meal</option>
              <option>Breakfast</option><option>Mid-Morning</option><option>Lunch</option><option>Pre-Workout</option><option>Dinner</option><option>Snack</option>
            </select></div>
            <div style={{ width: 110 }}><label style={{ color: 'var(--on-surface-variant)', fontSize: 11, marginBottom: 4 }}>Calories</label><input type="number" placeholder="450" value={calInput.calories} onChange={e => setCalInput(p => ({ ...p, calories: e.target.value }))} style={{ fontSize: 13, padding: '10px 12px', width: '100%' }} /></div>
            <button className="btn-p" style={{ padding: '10px 16px', fontSize: 14, marginBottom: 0 }} onClick={logCalories}>+</button>
          </div>
        )}
      </div>

      {/* Auto-detected goal */}
      <div className="card" style={{ padding: '18px 20px', marginBottom: 16, background: 'linear-gradient(90deg, var(--surface-container-high) 0%, var(--surface-container-lowest) 100%)', border: 'none', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--primary)' }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="headline-md" style={{ color: 'var(--on-surface)' }}>{goal === 'loss' ? 'Weight Loss Plan' : goal === 'gain' ? 'Weight Gain Plan' : 'Maintenance Plan'}</div>
            <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 4 }}>
              {goal === 'loss' ? `${goalKcal} kcal/day — ${dailyDelta} kcal deficit for ~${deficitInfo.weeklyKg || 0.5}kg/week fat loss` : goal === 'gain' ? `${goalKcal} kcal/day — ${dailyDelta} kcal surplus for lean muscle gain` : `${goalKcal} kcal/day — maintaining current body weight`}
            </div>
          </div>
          {user.weightGoal ? <span className="tag" style={{ background: 'var(--primary)', color: 'var(--on-primary)' }}>Auto</span> : <span style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}>Set goal on Dashboard for auto</span>}
        </div>
      </div>

      {/* Macros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }} className="g4">
        {[{ l: 'Calories', v: goalKcal, u: 'kcal' }, { l: 'Protein', v: prot, u: 'g' }, { l: 'Carbs', v: carbs, u: 'g' }, { l: 'Fat', v: fat, u: 'g' }].map(m => (
          <div key={m.l} className="card" style={{ padding: '16px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>{m.l}</div>
            <div className="headline-lg" style={{ color: 'var(--primary)', letterSpacing: '1px' }}>{m.v}<span style={{ fontSize: 11, color: 'var(--on-surface-variant)', fontFamily: 'Space Grotesk' }}>{m.u}</span></div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginTop: -6, marginBottom: 16, padding: '0 4px' }}>
        ℹ️ Protein calculated from {goal === 'loss' && user.weightGoal && user.weightGoal < user.weight ? 'goal' : 'current'} weight ({isImpWeight ? kgToLbs(baseWeightForProtein) + ' lbs' : baseWeightForProtein + 'kg'}) × {protMultiplier}g/kg
      </div>

      {/* Whey inline */}
      <div className="card" style={{ padding: '14px 18px', marginBottom: 16, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', background: 'var(--surface-container-low)', border: 'none' }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'var(--glow-primary)' }}><Activity size={16} color="var(--primary)" /></div>
        <div style={{ flex: 1 }}>
          <div className="headline-md" style={{ fontSize: 14, color: 'var(--on-surface)' }}>Whey Protein — {wheyScoops} scoop{wheyScoops > 1 ? 's' : ''}/day ({wheyProt}g)</div>
          <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4 }}>{foodProt}g from food + {wheyProt}g from whey = {prot}g target. {diet === 'vegan' ? 'Use pea+rice blend.' : 'Brands: MuscleBlaze, ON Gold Standard, MyProtein.'}</div>
        </div>
        <span className="tag" style={{ background: 'var(--surface-container-high)', color: 'var(--on-surface-dim)' }}>{wheyScoops} × 25g</span>
      </div>

      {/* Diet type selector */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
        {Object.values(DIET_TYPES).map(d => <button key={d.id} onClick={() => setDiet(d.id)} style={{ padding: '10px 18px', borderRadius: 12, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all .2s var(--ease-smooth)', background: diet === d.id ? 'var(--primary)' : 'var(--surface-container-lowest)', color: diet === d.id ? 'var(--on-primary)' : 'var(--on-surface-variant)', border: `none`, boxShadow: diet === d.id ? 'var(--shadow-lg)' : 'none' }}>{d.icon} {d.label}</button>)}
      </div>

      {/* Meals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(305px,1fr))', gap: 16 }}>
        {dt.meals.map((meal, i) => {
          const items = meal.items[gKey] || meal.items.maintain || [];
          const wheyLines = [];
          if (meal.label === 'Breakfast') wheyLines.push(`+ 1 scoop ${diet === 'vegan' ? 'plant protein (pea+rice)' : 'whey protein'} — complete protein, all 9 EAAs`);
          if (meal.label === 'Post-Workout Dinner') wheyLines.push('+ 1 scoop whey within 30 min post-workout — peak muscle protein synthesis');
          if (wheyScoops >= 3 && meal.label === 'Mid-Morning') wheyLines.push(`+ Extra scoop protein — needed to hit ${prot}g target`);
          if (wheyScoops >= 4 && meal.label === 'Before Bed') wheyLines.push('+ 1 scoop casein/whey before bed — 8-hr overnight recovery');
          const all = [...items, ...wheyLines];
          const MIcon = { Sunrise: TrendingUp, Apple: Salad, Bowl: Salad, Bolt: Flame, Dinner: Salad, Moon: Activity }[meal.icon] || Activity;
          return (
            <div key={i} className="card stripe" style={{ padding: 20 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MIcon size={16} color="var(--primary)" /></div>
                <div style={{ flex: 1 }}><div className="headline-md" style={{ color: 'var(--on-surface)' }}>{meal.label}</div></div>
                {goal === 'gain' && <span className="tag" style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface-dim)' }}>+Portions</span>}
                {goal === 'loss' && <span className="tag" style={{ background: 'var(--surface-container-highest)', color: 'var(--on-surface-dim)' }}>-Portions</span>}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {all.map((item, j) => { const isW = item.startsWith('+'); return (
                  <div key={j} className="tonal-break" style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: isW ? '8px 10px' : '6px 0', fontSize: 13, color: isW ? 'var(--primary)' : 'var(--on-surface-variant)', background: isW ? 'var(--surface-container-highest)' : 'transparent', borderRadius: isW ? 8 : 0 }}>
                    {!isW && <span style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 1 }}>·</span>}
                    <span>{item}</span>
                  </div>
                ); })}
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: 'none', position: 'relative' }}>
                <div style={{ position: 'absolute', top: 0, left: -20, right: -20, height: 1, background: 'var(--surface-container-highest)' }} />
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                  {[{ l: 'P', v: meal.macros.p }, { l: 'C', v: meal.macros.c }, { l: 'F', v: meal.macros.f }].map(m => (
                    <div key={m.l} style={{ padding: '4px 10px', background: 'var(--surface-container-highest)', borderRadius: 8, fontSize: 11, border: 'none' }}>
                      <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{m.l}</span><span style={{ color: 'var(--on-surface-dim)', marginLeft: 4 }}>{m.v}g</span>
                    </div>
                  ))}
                  <div style={{ padding: '4px 10px', background: 'var(--surface-container-low)', borderRadius: 8, fontSize: 11, border: 'none', color: 'var(--on-surface-dim)' }}>~{meal.macros.p * 4 + meal.macros.c * 4 + meal.macros.f * 9}kcal</div>
                </div>
                <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', lineHeight: 1.6 }}><span style={{ color: 'var(--primary)', fontWeight: 700 }}>Micros: </span>{meal.micros.join(' · ')}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="card" style={{ marginTop: 16, padding: '16px 20px', background: 'var(--surface-container-lowest)', border: 'none' }}>
        <div style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>Scale portions to hit <strong style={{ color: 'var(--primary)' }}>{goalKcal} kcal/day</strong>.{goal === 'loss' && ` ${dailyDelta} kcal deficit for safe fat loss.`}{goal === 'gain' && ` ${dailyDelta} kcal surplus for lean muscle gain.`}{` Whey: ${wheyScoops} scoops (${wheyProt}g) + ${foodProt}g from food.`}{diet === 'vegan' && ' Plant protein (pea+rice) covers all 9 EAAs.'}</div>
      </div>
      <div className="card" style={{ padding: '16px 20px', marginTop: 12, background: 'linear-gradient(90deg, var(--surface-container-high) 0%, var(--surface-container-lowest) 100%)', border: 'none', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--primary)' }} />
        <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Best Protein Sources — {dt.label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{dt.proteinSources.map(s => <span key={s} style={{ padding: '4px 10px', background: 'var(--surface-container-highest)', color: 'var(--primary)', border: 'none', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>)}</div>
      </div>
      <div style={{ marginTop: 14, padding: '14px 18px', background: 'var(--surface-container-highest)', borderRadius: 12, border: 'none', fontSize: 12, color: 'var(--on-surface-variant)' }}>
        <strong style={{ color: 'var(--primary)' }}>Complete Protein Tip:</strong> Combine legumes + grains per meal (dal+rice, chana+roti) to cover all 9 essential amino acids. Whey protein already contains all 9 EAAs in every scoop.
      </div>
    </div>
  );
}
