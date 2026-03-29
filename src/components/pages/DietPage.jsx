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
  const units = user.units || 'metric';
  const isImp = units === 'imperial';
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
      <PageHeader title="Diet Guide" sub={`Personalised for ${user.name.split(' ')[0]} · ${user.weightGoal ? `Goal: ${isImp ? kgToLbs(user.weightGoal) + 'lbs' : user.weightGoal + 'kg'}` : 'No goal set'}`} />

      {/* Stats bar */}
      <div className="card" style={{ padding: '14px 16px', marginBottom: 14, display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700 }}>BODY STATS</div>
        {[{ l: 'Weight', v: isImp ? `${kgToLbs(user.weight)}lbs` : `${user.weight}kg` }, { l: 'Height', v: isImp ? cmToFtIn(user.height) : `${user.height}cm` }, { l: 'BMI', v: bmi }, { l: 'TDEE', v: `${tdee}kcal` }, { l: 'Activity', v: ACTIVITY[user.activityLevel || 'moderate']?.label.split('(')[0].trim() }].map(s => (
          <div key={s.l} style={{ padding: '5px 11px', background: 'var(--c3)', borderRadius: 8, border: '1px solid var(--bd)' }}>
            <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase' }}>{s.l}</div>
            <div style={{ fontSize: 13, fontWeight: 600, marginTop: 1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Calorie Tracker Card */}
      <div className="card" style={{ padding: '16px 18px', marginBottom: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>Today's Intake</div>
          <button className="btn-g" style={{ fontSize: 11, padding: '5px 10px' }} onClick={() => setShowCalLog(!showCalLog)}>{showCalLog ? 'Hide' : 'Log Meal'}</button>
        </div>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', marginBottom: 4 }}>
              <span>{todayTotal} kcal consumed</span><span>{goalKcal} kcal target</span>
            </div>
            <div className="pbar" style={{ height: 8 }}>
              <div className="pbar-fill" style={{ width: `${calPct}%`, background: todayTotal > goalKcal ? 'var(--danger)' : 'var(--og)' }} />
            </div>
          </div>
          <div className="bb" style={{ fontSize: 24, color: todayTotal > goalKcal ? 'var(--danger)' : 'var(--o)' }}>{calPct}%</div>
        </div>
        
        <div style={{ marginTop: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 10, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 6 }}>
            Estimated Macros (based on intake ratio)
          </div>
          {[
            { label: 'Protein', consumed: estimatedProtein, target: prot,   unit: 'g', color: '#4ECDC4' },
            { label: 'Carbs',   consumed: estimatedCarbs,   target: carbs,  unit: 'g', color: '#FFE66D' },
            { label: 'Fat',     consumed: estimatedFat,     target: fat,    unit: 'g', color: '#FF6B6B' },
          ].map(macro => (
            <div key={macro.label} style={{ marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--t2)', marginBottom: 3 }}>
                <span style={{ fontWeight: 600 }}>{macro.label}</span>
                <span style={{ color: 'var(--t3)' }}>
                  {macro.consumed}g / {macro.target}g
                </span>
              </div>
              <div className="pbar" style={{ height: 5 }}>
                <div className="pbar-fill" style={{
                  width: `${Math.min(100, Math.round((macro.consumed / macro.target) * 100)) || 0}%`,
                  background: macro.color,
                }} />
              </div>
            </div>
          ))}
          <div style={{ fontSize: 9, color: 'var(--t3)', marginTop: 4, fontStyle: 'italic' }}>
            * Estimated from calorie intake ratio. Log macros per meal for accurate tracking (coming soon).
          </div>
        </div>

        {todayCals.length > 0 && (
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: showCalLog ? 10 : 0 }}>
            {todayCals.map(l => (
              <span key={l.id} style={{ padding: '3px 9px', background: 'var(--o2)', borderRadius: 20, fontSize: 10, border: '1px solid rgba(232,84,13,.2)', color: 'var(--o)' }}>{l.meal}: {l.calories}kcal</span>
            ))}
          </div>
        )}
        {showCalLog && (
          <div style={{ display: 'flex', gap: 8, alignItems: 'end' }}>
            <div style={{ flex: 1 }}><label>Meal</label><select value={calInput.meal} onChange={e => setCalInput(p => ({ ...p, meal: e.target.value }))} style={{ fontSize: 12, padding: '8px 10px' }}>
              <option value="">Select meal</option>
              <option>Breakfast</option><option>Mid-Morning</option><option>Lunch</option><option>Pre-Workout</option><option>Dinner</option><option>Snack</option>
            </select></div>
            <div style={{ width: 100 }}><label>Calories</label><input type="number" placeholder="450" value={calInput.calories} onChange={e => setCalInput(p => ({ ...p, calories: e.target.value }))} style={{ fontSize: 12, padding: '8px 10px' }} /></div>
            <button className="btn-p" style={{ padding: '8px 14px', fontSize: 12, marginBottom: 0 }} onClick={logCalories}>+</button>
          </div>
        )}
      </div>

      {/* Auto-detected goal */}
      <div className="card" style={{ padding: '16px 18px', marginBottom: 14, borderLeft: '3px solid var(--o)', borderRadius: '0 14px 14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{goal === 'loss' ? 'Weight Loss Plan' : goal === 'gain' ? 'Weight Gain Plan' : 'Maintenance Plan'}</div>
            <div style={{ fontSize: 12, color: 'var(--t2)', marginTop: 2 }}>
              {goal === 'loss' ? `${goalKcal} kcal/day — ${dailyDelta} kcal deficit for ~${deficitInfo.weeklyKg || 0.5}kg/week fat loss` : goal === 'gain' ? `${goalKcal} kcal/day — ${dailyDelta} kcal surplus for lean muscle gain` : `${goalKcal} kcal/day — maintaining current body weight`}
            </div>
          </div>
          {user.weightGoal ? <span className="tag" style={{ fontSize: 9 }}>Auto</span> : <span style={{ fontSize: 11, color: 'var(--t3)' }}>Set goal on Dashboard for auto</span>}
        </div>
      </div>

      {/* Macros */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 8, marginBottom: 14 }} className="g4">
        {[{ l: 'Calories', v: goalKcal, u: 'kcal' }, { l: 'Protein', v: prot, u: 'g' }, { l: 'Carbs', v: carbs, u: 'g' }, { l: 'Fat', v: fat, u: 'g' }].map(m => (
          <div key={m.l} className="card" style={{ padding: '12px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 3 }}>{m.l}</div>
            <div className="bb" style={{ fontSize: 22, color: 'var(--o)', letterSpacing: '1px' }}>{m.v}<span style={{ fontSize: 11, color: 'var(--t2)', fontFamily: "'DM Sans'" }}>{m.u}</span></div>
          </div>
        ))}
      </div>
      <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: -6, marginBottom: 14, padding: '0 2px' }}>
        ℹ️ Protein calculated from {goal === 'loss' && user.weightGoal && user.weightGoal < user.weight ? 'goal' : 'current'} weight ({isImp ? kgToLbs(baseWeightForProtein) + ' lbs' : baseWeightForProtein + 'kg'}) × {protMultiplier}g/kg
      </div>

      {/* Whey inline */}
      <div className="card" style={{ padding: '12px 16px', marginBottom: 14, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Activity size={14} color="var(--o)" /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 13 }}>Whey Protein — {wheyScoops} scoop{wheyScoops > 1 ? 's' : ''}/day ({wheyProt}g)</div>
          <div style={{ fontSize: 11, color: 'var(--t2)', marginTop: 2 }}>{foodProt}g from food + {wheyProt}g from whey = {prot}g target. {diet === 'vegan' ? 'Use pea+rice blend.' : 'Brands: MuscleBlaze, ON Gold Standard, MyProtein.'}</div>
        </div>
        <span className="tag" style={{ fontSize: 9 }}>{wheyScoops} × 25g</span>
      </div>

      {/* Diet type selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
        {Object.values(DIET_TYPES).map(d => <button key={d.id} onClick={() => setDiet(d.id)} style={{ padding: '9px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all .2s', background: diet === d.id ? 'var(--o)' : 'transparent', color: diet === d.id ? '#fff' : 'var(--t2)', border: `1px solid ${diet === d.id ? 'var(--o)' : 'var(--bd)'}` }}>{d.icon} {d.label}</button>)}
      </div>

      {/* Meals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(305px,1fr))', gap: 12 }}>
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
            <div key={i} className="card" style={{ padding: 16 }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><MIcon size={14} color="var(--o)" /></div>
                <div style={{ flex: 1 }}><div className="bb" style={{ fontSize: 15, letterSpacing: '1px' }}>{meal.label}</div></div>
                {goal === 'gain' && <span className="tag" style={{ fontSize: 8 }}>+Portions</span>}
                {goal === 'loss' && <span className="tag" style={{ fontSize: 8 }}>-Portions</span>}
              </div>
              {all.map((item, j) => { const isW = item.startsWith('+'); return (
                <div key={j} style={{ display: 'flex', gap: 6, alignItems: 'flex-start', padding: '5px 0', fontSize: 12, color: isW ? 'var(--o)' : 'var(--t2)', borderBottom: j < all.length - 1 ? '1px solid var(--bd)' : '', background: isW ? 'var(--o3)' : 'transparent', borderRadius: isW ? 6 : 0, paddingLeft: isW ? 6 : 0, marginBottom: isW ? 2 : 0 }}>
                  {!isW && <span style={{ color: 'var(--o)', flexShrink: 0, marginTop: 1 }}>·</span>}
                  <span>{item}</span>
                </div>
              ); })}
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--bd)' }}>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 5 }}>
                  {[{ l: 'P', v: meal.macros.p }, { l: 'C', v: meal.macros.c }, { l: 'F', v: meal.macros.f }].map(m => (
                    <div key={m.l} style={{ padding: '2px 8px', background: 'var(--o2)', borderRadius: 6, fontSize: 11, border: '1px solid rgba(232,84,13,.18)' }}>
                      <span style={{ color: 'var(--o)', fontWeight: 700 }}>{m.l}</span><span style={{ color: 'var(--t2)', marginLeft: 2 }}>{m.v}g</span>
                    </div>
                  ))}
                  <div style={{ padding: '2px 8px', background: 'var(--c3)', borderRadius: 6, fontSize: 11, border: '1px solid var(--bd)', color: 'var(--t3)' }}>~{meal.macros.p * 4 + meal.macros.c * 4 + meal.macros.f * 9}kcal</div>
                </div>
                <div style={{ fontSize: 10, color: 'var(--t3)', lineHeight: 1.6 }}><span style={{ color: 'var(--o)', fontWeight: 700 }}>Micros: </span>{meal.micros.join(' · ')}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="card" style={{ marginTop: 12, padding: '12px 16px' }}>
        <div style={{ fontSize: 11, color: 'var(--t2)' }}>Scale portions to hit <strong style={{ color: 'var(--o)' }}>{goalKcal} kcal/day</strong>.{goal === 'loss' && ` ${dailyDelta} kcal deficit for safe fat loss.`}{goal === 'gain' && ` ${dailyDelta} kcal surplus for lean muscle gain.`}{` Whey: ${wheyScoops} scoops (${wheyProt}g) + ${foodProt}g from food.`}{diet === 'vegan' && ' Plant protein (pea+rice) covers all 9 EAAs.'}</div>
      </div>
      <div className="card" style={{ padding: '12px 16px', marginTop: 8, borderLeft: '3px solid var(--o)', borderRadius: '0 14px 14px 0' }}>
        <div style={{ fontSize: 11, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 7 }}>Best Protein Sources — {dt.label}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>{dt.proteinSources.map(s => <span key={s} style={{ padding: '3px 9px', background: 'var(--o2)', color: 'var(--o)', border: '1px solid rgba(232,84,13,.2)', borderRadius: 20, fontSize: 11, fontWeight: 500 }}>{s}</span>)}</div>
      </div>
      <div style={{ marginTop: 10, padding: '10px 14px', background: 'var(--o3)', borderRadius: 10, border: '1px solid rgba(232,84,13,.18)', fontSize: 11, color: 'var(--t2)' }}>
        <strong style={{ color: 'var(--o)' }}>Complete Protein Tip:</strong> Combine legumes + grains per meal (dal+rice, chana+roti) to cover all 9 essential amino acids. Whey protein already contains all 9 EAAs in every scoop.
      </div>
    </div>
  );
}
