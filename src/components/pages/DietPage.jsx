import React, { useState, useMemo } from 'react';
import { TrendingUp, Salad, Flame, Activity as ActivityIcon, ChevronLeft, ChevronRight, Plus, Search, Info, X, Edit2, Copy, Filter, Check, Clock, Scale, Ruler, Calculator, Zap, PersonStanding, ArrowDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader } from '../shared/SharedComponents';
import { DIET_TYPES } from '../../data/diets';
import { calcBMI, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { gId, tod, kgToLbs, cmToFtIn } from '../../utils/helpers';
import { indianFoods } from '../../data/foods/indianFoods';
import { foodCategories } from '../../data/foods/foodCategories';
import { calcMacros, calcBeverageMacros, searchLocalFoods, getRecentFoods } from '../../utils/foodUtils';

function MacroRing({ label, value, max, unit, color, size = 112, strokeWidth = 6 }) {
  const radius = (size - strokeWidth) / 2;
  const circum = 2 * Math.PI * radius;
  const pct = Math.min(Math.max(value / (max || 1), 0), 1);
  const offset = circum - pct * circum;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }} className="group">
      <div style={{ width: size, height: size, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg fill="transparent" width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size/2} cy={size/2} r={radius} stroke="var(--surface-container-highest)" strokeWidth={strokeWidth} />
          <circle cx={size/2} cy={size/2} r={radius} stroke={color} strokeWidth={strokeWidth} strokeDasharray={circum} strokeDashoffset={offset} strokeLinecap="butt" style={{ transition: 'stroke-dashoffset 0.6s ease-in-out' }} />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <span className="headline-md" style={{ fontSize: 20, color: 'var(--on-surface)', letterSpacing: '-1px' }}>{Math.round(value)}</span>
          <span style={{ fontSize: 8, color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '2px', marginTop: 2 }}>{unit}</span>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--on-surface-variant)' }}>{label}</div>
    </div>
  );
}

const CONSTANTS = {
  FASTING_TYPES: [
    { id: '', label: 'None' },
    { id: 'navratri', label: 'Navratri' },
    { id: 'ekadashi', label: 'Ekadashi' },
    { id: 'ramzan', label: 'Ramzan' },
    { id: 'jain-paryushana', label: 'Jain Paryushana' },
    { id: 'maha-shivratri', label: 'Maha Shivratri' },
  ],
  MEAL_SLOTS: [
    { id: 'Breakfast', icon: TrendingUp, targetPct: 0.25 },
    { id: 'Mid-Morning', icon: ActivityIcon, targetPct: 0.05 },
    { id: 'Lunch', icon: Salad, targetPct: 0.35 },
    { id: 'Pre-Workout', icon: Flame, targetPct: 0.05 },
    { id: 'Post-Workout Dinner', icon: Salad, targetPct: 0.25 },
    { id: 'Before Bed', icon: ActivityIcon, targetPct: 0.05 },
  ]
};

export default function DietPage() {
  const { user, foodLog, setFoodLog, addToast } = useApp();
  
  const [diet, setDiet] = useState('nonveg');
  const [dateStr, setDateStr] = useState(tod());
  const [activeTab, setActiveTab] = useState('tracker');

  // Search State
  const [showSearch, setShowSearch] = useState(false);
  const [searchMealSlot, setSearchMealSlot] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCat, setSearchCat] = useState('All');
  const [searchDiet, setSearchDiet] = useState('All');
  const [searchFasting, setSearchFasting] = useState('');
  
  // Detail Pane
  const [selectedFood, setSelectedFood] = useState(null);
  const [servingId, setServingId] = useState('');
  const [qty, setQty] = useState(1);
  const [customGrams, setCustomGrams] = useState('');
  const [consistency, setConsistency] = useState('standard');
  const [milkMod, setMilkMod] = useState('none');
  const [sweetMods, setSweetMods] = useState([]);
  
  // Custom Form
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState({ name: '', cals: '', p: '', c: '', f: '' });
  const [editingEntry, setEditingEntry] = useState(null);

  // Body stats
  const unitWeight = user.unitWeight || 'kg';
  const isImpWeight = unitWeight === 'lbs';
  const unitHeight = user.unitHeight || 'cm';
  const isImpHeight = unitHeight === 'ft';
  const bmi = calcBMI(user.weight, user.height);
  const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');
  const deficitInfo = calcDeficit(user.weight, user.weightGoal, user.goalWeeks);
  const goal = deficitInfo.goal;
  const dailyDelta = deficitInfo.dailyDelta || (goal === 'loss' ? 500 : goal === 'gain' ? 400 : 0);
  const goalKcal = goal === 'loss' ? tdee - dailyDelta : goal === 'gain' ? tdee + dailyDelta : tdee;
  
  const baseWeightForProtein = (goal === 'loss' && user.weightGoal && user.weightGoal < user.weight) ? user.weightGoal : user.weight;
  const protMultiplier = goal === 'loss' ? 2.2 : goal === 'gain' ? 2.0 : 1.8;
  const protTarget = goal === 'loss' ? Math.round(baseWeightForProtein * 2.2) : goal === 'gain' ? Math.round(user.weight * 2.0) : Math.round(user.weight * 1.8);
  const carbsTarget = Math.round((goalKcal * (goal === 'loss' ? .38 : .44)) / 4);
  const fatTarget = Math.round((goalKcal * .26) / 9);
  
  const wheyScoops = protTarget >= 180 ? Math.min(Math.ceil((protTarget - 100) / 25), 4) : 2;
  const wheyProt = wheyScoops * 25;
  const foodProt = protTarget - wheyProt;
  
  const dt = DIET_TYPES[diet];
  const gKey = goal === 'loss' ? 'loss' : goal === 'gain' ? 'gain' : 'maintain';

  // Log calculation logic
  const dailyLog = useMemo(() => foodLog.filter(l => l.date === dateStr && l.userId === user.id), [foodLog, dateStr, user.id]);
  
  const todayTotals = useMemo(() => {
    return dailyLog.reduce((acc, curr) => ({
      calories: acc.calories + (curr.macros?.calories || 0),
      protein: acc.protein + (curr.macros?.protein || 0),
      carbs: acc.carbs + (curr.macros?.carbs || 0),
      fat: acc.fat + (curr.macros?.fat || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [dailyLog]);

  const searchResults = useMemo(() => {
    let res = searchLocalFoods(indianFoods, searchQuery, { dietType: searchDiet !== 'All' ? searchDiet.toLowerCase() : '', fastingType: searchFasting });
    if (searchCat !== 'All') res = res.filter(f => f.categoryId === searchCat);
    return res;
  }, [searchQuery, searchDiet, searchFasting, searchCat]);

  const recentFoods = useMemo(() => getRecentFoods(foodLog), [foodLog]);

  const previewMacros = useMemo(() => {
    if (!selectedFood) return null;
    let m;
    if (selectedFood.hasBeverageModifiers) {
      m = calcBeverageMacros(selectedFood, milkMod === 'none' ? null : milkMod, sweetMods);
    } else {
      m = calcMacros(selectedFood, servingId, qty, consistency, customGrams ? parseFloat(customGrams) : null);
    }
    return m;
  }, [selectedFood, servingId, qty, consistency, customGrams, milkMod, sweetMods]);

  const changeDate = (delta) => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + delta);
    setDateStr(d.toISOString().split('T')[0]);
  };

  const handleCopyYesterday = () => {
    const d = new Date(dateStr);
    d.setDate(d.getDate() - 1);
    const yStr = d.toISOString().split('T')[0];
    const yLog = foodLog.filter(l => l.date === yStr && l.userId === user.id);
    if (!yLog.length) return addToast('No foods logged yesterday.', 'error');
    const copied = yLog.map(l => ({ ...l, id: gId(), date: dateStr }));
    setFoodLog(p => [...p, ...copied]);
    addToast('Copied yesterday\'s log!', 'success');
  };

  // Lock body scroll and scroll to top when search modal opens (Bug F3)
  React.useEffect(() => {
    if (showSearch) {
      document.body.style.overflow = 'hidden';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showSearch]);

  const handleOpenSearch = (slot) => {
    setSearchMealSlot(slot);
    setShowSearch(true);
    setSelectedFood(null);
    setShowCustom(false);
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    const defServing = food.servings ? food.servings.find(s => s.isDefault)?.id || food.servings[0].id : '';
    setServingId(defServing);
    setQty(1);
    setCustomGrams('');
    setConsistency('standard');
    setMilkMod('none');
    setSweetMods([]);
  };

  const addFoodToLog = (macrosToLog, customName = null, isOil = false) => {
    const isCustom = showCustom || customName;
    const item = {
      id: gId(), userId: user.id, date: dateStr, slot: searchMealSlot,
      foodId: isCustom ? null : selectedFood?.id,
      food: isCustom ? null : selectedFood,
      name: customName || (isCustom ? customInput.name : selectedFood.name),
      sourceType: isCustom ? 'custom' : 'indianDb',
      servingId, qty, customGrams, consistency, milkMod, sweetMods,
      macros: macrosToLog,
      addedOil: isOil
    };
    setFoodLog(p => {
      const updated = editingEntry ? p.filter(l => l.id !== editingEntry) : p;
      return [...updated, item];
    });
    if (!isOil) {
      addToast(`${item.name} logged.`, 'success');
      setShowSearch(false);
      setSelectedFood(null);
      setShowCustom(false);
      setCustomInput({ name: '', cals: '', p: '', c: '', f: '' });
      setEditingEntry(null);
    }
  };

  const saveCustomFood = () => {
    if (!customInput.name || !customInput.cals) return addToast('Name and Calories required', 'error');
    const macros = {
      calories: parseFloat(customInput.cals) || 0,
      protein: parseFloat(customInput.p) || 0,
      carbs: parseFloat(customInput.c) || 0,
      fat: parseFloat(customInput.f) || 0
    };
    addFoodToLog(macros);
  };

  const removeEntry = (id) => {
    setFoodLog(p => p.filter(l => l.id !== id));
  };

  const editEntry = (entry) => {
    if (!entry.food) return;
    setSearchMealSlot(entry.slot);
    handleSelectFood(entry.food);
    setQty(entry.qty || 1);
    setCustomGrams(entry.customGrams || '');
    setServingId(entry.servingId || '');
    setConsistency(entry.consistency || 'standard');
    setMilkMod(entry.milkMod || 'none');
    setSweetMods(entry.sweetMods || []);
    setEditingEntry(entry.id);
    setShowSearch(true);
  };
  
  const addCookingOil = () => {
    const macrosToLog = { calories: 130, protein: 0, carbs: 0, fat: 15 };
    addFoodToLog(macrosToLog, 'Cooking Oil/Ghee (15g)', true);
    addToast('Cooking Oil (15g) added smoothly.', 'success');
  };

  const scrollToLog = () => {
    document.getElementById('foodLogSection')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="pg-in">
      <PageHeader title="Diet Guide & Log" sub={`Personalised for ${user.name.split(' ')[0]} | Target: ${goalKcal} kcal`} />
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTION 1: DIET GUIDE (Kinetic Elite Restyle) */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section style={{ marginBottom: 40 }}>
        {/* STATS ROW */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 24 }}>
          {[{ l: 'Weight', v: isImpWeight ? `${kgToLbs(user.weight)}lbs` : `${user.weight}kg`, i: Scale },
            { l: 'Height', v: isImpHeight ? cmToFtIn(user.height) : `${user.height}cm`, i: Ruler },
            { l: 'BMI Score', v: bmi, i: Calculator },
            { l: 'TDEE', v: `${tdee} kcal`, i: Zap },
            { l: 'Activity', v: (user.activityLevel || 'moderate').charAt(0).toUpperCase() + (user.activityLevel || 'moderate').slice(1), i: PersonStanding }].map(s => {
            const Icon = s.i;
            return (
              <div key={s.l} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'var(--surface-container-low)', padding: '8px 16px', borderRadius: 20, border: '1px solid var(--surface-container-highest)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 10, color: 'var(--on-surface-variant)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 500 }}>
                  <Icon size={12} color="var(--on-surface-variant)" /> {s.l}
                </span>
                <span style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 800 }}>{s.v}</span>
              </div>
            );
          })}
        </div>

        {/* GOAL SECTION WRAPPER */}
        <div style={{ background: 'var(--surface-container-lowest)', padding: 24, borderRadius: 16, border: '1px solid var(--outline-variant)', boxShadow: 'var(--glow-primary)', marginBottom: 24, position: 'relative' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'flex-end', gap: 16, marginBottom: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ color: 'var(--primary-container)', fontSize: 9, letterSpacing: '3px', fontWeight: 900, textTransform: 'uppercase' }}>Phase Status</span>
              <h2 className="headline-lg" style={{ fontSize: 36, fontWeight: 900, fontStyle: 'italic', marginTop: 4, textTransform: 'uppercase', color: 'var(--on-surface)' }}>
                GOAL: {goal === 'loss' ? 'CUT' : goal === 'gain' ? 'BULK' : 'MAINTAIN'}
              </h2>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap', background: 'var(--surface-container-highest)', padding: '8px 16px', borderRadius: 20 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}><span style={{ color: 'var(--on-surface-dim)' }}>🔥 </span>{goalKcal} kcal</div>
            <span style={{ color: 'var(--outline)' }}>·</span>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}><span style={{ color: 'var(--on-surface-dim)' }}>💪 </span>{protTarget}g P</div>
            <span style={{ color: 'var(--outline)' }}>·</span>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}><span style={{ color: 'var(--on-surface-dim)' }}>🌾 </span>{carbsTarget}g C</div>
            <span style={{ color: 'var(--outline)' }}>·</span>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--primary)' }}><span style={{ color: 'var(--on-surface-dim)' }}>🧈 </span>{fatTarget}g F</div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 24, justifyContent: 'center' }}>
            <MacroRing label="Daily Energy" value={todayTotals.calories} max={goalKcal} unit="Kcal" color="var(--primary-container)" />
            <MacroRing label="Protein" value={todayTotals.protein} max={protTarget} unit="Grams" color="var(--primary)" />
            <MacroRing label="Carbs" value={todayTotals.carbs} max={carbsTarget} unit="Grams" color="var(--tertiary-container)" />
            <MacroRing label="Fats" value={todayTotals.fat} max={fatTarget} unit="Grams" color="var(--outline)" />
          </div>
          <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginTop: 16, textAlign: 'center' }}>
            ℹ️ Protein calculated from {goal === 'loss' && user.weightGoal && user.weightGoal < user.weight ? 'goal weight' : 'current weight'} ({isImpWeight ? kgToLbs(baseWeightForProtein) + ' lbs' : baseWeightForProtein + 'kg'}) × {protMultiplier}g/kg
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <button onClick={() => setActiveTab('tracker')} style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-container-highest)', border: 'none', borderRadius: 20, padding: '6px 16px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--on-surface)', cursor: 'pointer' }}>
              TRACK TODAY <ArrowDown size={14} color="var(--primary)" />
            </button>
          </div>
        </div>

        {/* TAB SWITCHER */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', background: 'var(--surface-container-highest)', borderRadius: 24, padding: 4 }}>
            <button onClick={() => setActiveTab('tracker')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 20, border: 'none', fontSize: 14, fontWeight: 700, background: activeTab === 'tracker' ? 'var(--primary)' : 'transparent', color: activeTab === 'tracker' ? 'var(--on-primary)' : 'var(--on-surface-variant)', cursor: 'pointer', transition: 'all 0.2s' }}>
              🍽 Daily Tracker
            </button>
            <button onClick={() => setActiveTab('guide')} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 24px', borderRadius: 20, border: 'none', fontSize: 14, fontWeight: 700, background: activeTab === 'guide' ? 'var(--primary)' : 'transparent', color: activeTab === 'guide' ? 'var(--on-primary)' : 'var(--on-surface-variant)', cursor: 'pointer', transition: 'all 0.2s' }}>
              📋 Meal Guide
            </button>
          </div>
        </div>

        {activeTab === 'guide' && (
          <div>
            {/* BLUEPRINT HEADER CARD */}
            <div style={{ background: 'var(--surface-container-lowest)', padding: 24, borderRadius: 16, borderLeft: '4px solid var(--primary)', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span className="headline-md" style={{ fontSize: 20, color: 'var(--on-surface)' }}>📋 Your Personalised Meal Blueprint</span>
              </div>
              <p style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>These are AI-curated meal suggestions based on your {goal === 'loss' ? 'cut' : goal === 'gain' ? 'bulk' : 'maintenance'} goal and {DIET_TYPES[diet].label} diet. Use these as a daily reference — log your actual intake in the Daily Tracker.</p>
            </div>

            {/* DIET TYPE & WHEY CARD */}
            <div style={{ background: 'var(--surface-container-low)', padding: 16, borderRadius: 16, display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 24 }}>
              <div style={{ flex: 1, minWidth: 280 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--glow-primary)' }}>
                    <ActivityIcon size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <div className="headline-md" style={{ fontSize: 16, color: 'var(--on-surface)' }}>Whey Protein — {wheyScoops} scoop{wheyScoops > 1 ? 's' : ''}/day ({wheyProt}g)</div>
                    <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 2 }}>{foodProt}g from food + {wheyProt}g from whey = {protTarget}g target.</div>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6, background: 'var(--surface-container-highest)', padding: 4, borderRadius: 12 }}>
                {Object.values(DIET_TYPES).map(d => (
                  <button key={d.id} onClick={() => setDiet(d.id)} style={{ padding: '8px 12px', fontSize: 12, fontWeight: 700, background: diet === d.id ? 'var(--primary)' : 'transparent', color: diet === d.id ? 'var(--on-primary)' : 'var(--on-surface-variant)', border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s' }}>
                    {d.icon} {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MEAL PLANS (DIET GUIDE) */}
            <div style={{ fontSize: 9, letterSpacing: '3px', color: 'var(--outline)', textTransform: 'uppercase', fontWeight: 800, marginBottom: 12 }}>
              Blueprint
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 16 }}>
              {dt.meals.map((meal, i) => {
            const items = meal.items[gKey] || meal.items.maintain || [];
            const wheyLines = [];
            if (meal.label === 'Breakfast') wheyLines.push(`+ 1 scoop ${diet === 'vegan' ? 'plant protein (pea+rice)' : 'whey'} — complete protein`);
            if (meal.label === 'Post-Workout Dinner') wheyLines.push('+ 1 scoop whey within 30 min post-workout');
            if (wheyScoops >= 3 && meal.label === 'Mid-Morning') wheyLines.push(`+ Extra scoop protein (${protTarget}g target)`);
            if (wheyScoops >= 4 && meal.label === 'Before Bed') wheyLines.push('+ 1 scoop casein/whey before bed');
            const all = [...items, ...wheyLines];
            const MIcon = CONSTANTS.MEAL_SLOTS.find(m => m.id === meal.label)?.icon || Activity;
            return (
              <div key={i} style={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', padding: 20, borderRadius: 16 }}>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MIcon size={16} color="var(--primary)" /></div>
                  <div style={{ flex: 1 }}><div className="headline-md" style={{ color: 'var(--on-surface)', fontSize: 16 }}>{meal.label}</div></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {all.map((item, j) => {
                    const isW = item.startsWith('+');
                    return (
                      <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: isW ? '8px 10px' : '4px 0', fontSize: 13, color: isW ? 'var(--primary)' : 'var(--on-surface-variant)', background: isW ? 'var(--surface-container-highest)' : 'transparent', borderRadius: isW ? 8 : 0 }}>
                        {!isW && <span style={{ color: 'var(--primary)', flexShrink: 0 }}>·</span>}
                        <span>{item}</span>
                      </div>
                    );
                  })}
                </div>
                <div style={{ marginTop: 16, paddingTop: 16 }}>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 8 }}>
                    {[{ l: 'P', v: meal.macros.p }, { l: 'C', v: meal.macros.c }, { l: 'F', v: meal.macros.f }].map(m => (
                      <div key={m.l} style={{ padding: '4px 10px', background: 'var(--surface-container-highest)', borderRadius: 8, fontSize: 11, border: 'none', color: 'var(--on-surface)' }}>
                        <span style={{ color: 'var(--primary)', fontWeight: 700 }}>{m.l}</span><span style={{ color: 'var(--on-surface-dim)', marginLeft: 4 }}>{m.v}g</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--on-surface-dim)' }}><span style={{ color: 'var(--primary)', fontWeight: 700 }}>Micros: </span>{meal.micros.join(' · ')}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Protein Sources Footer */}
        {dt.proteinSources && (
          <div style={{ padding: '16px 20px', marginTop: 16, background: 'var(--surface-container-lowest)', borderRadius: 16, borderLeft: '4px solid var(--primary-container)' }}>
            <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', marginBottom: 10 }}>Best Protein Sources — {dt.label}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{dt.proteinSources.map(s => <span key={s} style={{ padding: '4px 10px', background: 'var(--surface-container-highest)', color: 'var(--primary)', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>{s}</span>)}</div>
          </div>
        )}
        <div style={{ marginTop: 12, padding: '14px 18px', background: 'var(--surface-container-highest)', borderRadius: 12, fontSize: 12, color: 'var(--on-surface-variant)' }}>
          <strong style={{ color: 'var(--primary)' }}>Complete Protein Tip:</strong> Combine legumes + grains per meal (dal+rice, chana+roti) to cover all 9 essential amino acids. Whey protein already contains all 9 EAAs in every scoop.
        </div>
      </div>
      )}
      </section>


      {/* ──────────────────────────────────────────────────────────── */}
      {/* SECTION 2: FOOD LOG */}
      {/* ──────────────────────────────────────────────────────────── */}
      <section id="foodLogSection">
        {activeTab === 'tracker' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h4 className="headline-md" style={{ fontSize: 24, textTransform: 'uppercase', letterSpacing: '-1px' }}>Daily Tracker</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <button className="btn-g" onClick={handleCopyYesterday} style={{ padding: '8px 16px', fontSize: 12 }}><Copy size={14} style={{ display: 'inline', marginRight: 6 }}/>Copy Y'day</button>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--surface-container-highest)', borderRadius: 20, padding: 4 }}>
                  <button onClick={() => changeDate(-1)} style={{ padding: 6, background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer' }}><ChevronLeft size={16}/></button>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--on-surface)', minWidth: 80, textAlign: 'center' }}>{dateStr === tod() ? 'Today' : dateStr}</span>
                  <button onClick={() => changeDate(1)} style={{ padding: 6, background: 'transparent', border: 'none', color: 'var(--on-surface-variant)', cursor: 'pointer' }}><ChevronRight size={16}/></button>
                </div>
              </div>
            </div>

            {/* Removed Redundant Today's Tracker Progress Card */}

            {protTarget - todayTotals.protein > 30 && new Date().getHours() >= 18 && (
               <div style={{ background: 'rgba(232,84,13,0.1)', padding: 16, borderRadius: 12, marginBottom: 24 }}>
                 <span style={{ fontSize: 12, color: 'var(--primary-container)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>💡 Protein Nudge</span> 
                 <p style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginTop: 4 }}>You need {Math.round(protTarget - todayTotals.protein)}g more protein today to hit your target. Consider 1 scoop whey or 100g paneer to finish strong.</p>
               </div>
            )}

            {/* MEAL SLOTS */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {CONSTANTS.MEAL_SLOTS.map(slot => {
                const SIcon = slot.icon;
                const slotCals = Math.round(goalKcal * slot.targetPct);
                const items = dailyLog.filter(l => l.slot === slot.id);
                const slotTotal = Math.round(items.reduce((s,i) => s + (i.macros?.calories||0), 0));
                return (
                  <div key={slot.id} style={{ background: 'var(--glass-bg)', backdropFilter: 'var(--glass-blur-sm)', borderRadius: 16, padding: 16, border: '1px solid transparent', cursor: 'pointer', transition: 'border-color 0.2s' }} className="group hover:border-primary">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} onClick={() => handleOpenSearch(slot.id)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                          <SIcon size={24} />
                        </div>
                        <div>
                          <h4 className="headline-md" style={{ fontSize: 18, margin: 0 }}>{slot.id}</h4>
                          <p style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--on-surface-variant)', fontWeight: 600, marginTop: 4 }}>🔥 ~ {slotCals} Kcal • {Math.round(slot.targetPct * 100)}%</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                          <span className="headline-md" style={{ fontSize: 20, color: slotTotal > 0 ? 'var(--primary)' : 'var(--outline)' }}>{slotTotal}</span>
                          <span style={{ fontSize: 8, textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--outline-variant)', fontWeight: 700 }}>Kcal</span>
                        </div>
                        <button style={{ width: 40, height: 40, borderRadius: '50%', border: '1px solid var(--outline-variant)', background: 'transparent', color: 'var(--primary-container)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Plus size={20} />
                        </button>
                      </div>
                    </div>
                    {/* Expand logged items */}
                    {items.length > 0 && (
                      <div style={{ marginTop: 16, paddingTop: 16, display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {items.map(i => (
                          <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: 8, borderRadius: 8, background: 'var(--surface-container-low)' }}>
                            <div>
                              <p style={{ fontSize: 14, color: 'var(--on-surface)', fontWeight: 600 }}>{i.name}</p>
                              <div style={{ fontSize: 11, color: 'var(--on-surface-dim)', marginTop: 4, display: 'flex', gap: 10 }}>
                                <span style={{ color: 'var(--primary)', fontWeight: 600 }}>P: {Math.round(i.macros?.protein||0)}g</span>
                                <span style={{ color: 'var(--tertiary-container)', fontWeight: 600 }}>C: {Math.round(i.macros?.carbs||0)}g</span>
                                <span style={{ color: 'var(--outline)', fontWeight: 600 }}>F: {Math.round(i.macros?.fat||0)}g</span>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                              <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--on-surface)' }}>{Math.round(i.macros?.calories||0)}</span>
                              {i.food && <button onClick={(e) => { e.stopPropagation(); editEntry(i); }} style={{ background: 'var(--surface-container-highest)', borderRadius: '50%', padding: 4, border: 'none', color: 'var(--primary)', cursor: 'pointer' }}><Edit2 size={14}/></button>}
                              <button onClick={(e) => { e.stopPropagation(); removeEntry(i.id); }} style={{ background: 'var(--surface-container-highest)', borderRadius: '50%', padding: 4, border: 'none', color: 'var(--danger)', cursor: 'pointer' }}><X size={14}/></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {/* FAB: + Log Food */}
            <div style={{ position: 'sticky', bottom: 24, display: 'flex', justifyContent: 'flex-end', marginTop: 24, zIndex: 5, pointerEvents: 'none' }}>
              <button 
                onClick={() => handleOpenSearch('Snack/General')}
                style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--primary)', color: 'var(--on-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', boxShadow: '0 8px 24px rgba(255,181,155,0.4)', cursor: 'pointer', pointerEvents: 'auto' }}
              >
                <Plus size={28} />
              </button>
            </div>
          </div>
        )}
      </section>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* SEARCH / LOG MODAL (BottomSheet) */}
      {/* ──────────────────────────────────────────────────────────── */}
      {showSearch && (
        <div className="mo" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', padding: 0, overflowY: 'hidden' }}>
          <div className="md cascade-item" style={{ maxWidth: '100%', margin: 0, borderRadius: '0 0 24px 24px', height: '90vh', display: 'flex', flexDirection: 'column', padding: 0, background: 'var(--surface)' }}>
            
            {/* DETAIL / CUSTOM PANE */}
            {selectedFood || showCustom ? (
              <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                  <button className="btn-g" style={{ padding: 8 }} onClick={() => { setSelectedFood(null); setShowCustom(false); }}><ChevronLeft size={20}/></button>
                  <button className="btn-g" style={{ padding: 8 }} onClick={() => setShowSearch(false)}><X size={20}/></button>
                </div>
                
                {showCustom ? (
                  <div style={{ flex: 1 }}>
                    <h3 className="headline-md" style={{ marginBottom: 24 }}>Add Custom Info</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div><label>Name</label><input placeholder="E.g. Homemade Cookie" value={customInput.name} onChange={e=>setCustomInput({...customInput, name: e.target.value})} /></div>
                      <div><label>Calories (Kcal)</label><input type="number" placeholder="0" value={customInput.cals} onChange={e=>setCustomInput({...customInput, cals: e.target.value})} /></div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                        <div><label>Pro (g)</label><input type="number" placeholder="0" value={customInput.p} onChange={e=>setCustomInput({...customInput, p: e.target.value})} /></div>
                        <div><label>Carbs (g)</label><input type="number" placeholder="0" value={customInput.c} onChange={e=>setCustomInput({...customInput, c: e.target.value})} /></div>
                        <div><label>Fat (g)</label><input type="number" placeholder="0" value={customInput.f} onChange={e=>setCustomInput({...customInput, f: e.target.value})} /></div>
                      </div>
                      <button className="btn-p" style={{ marginTop: 24 }} onClick={saveCustomFood}>Add Custom Food</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, paddingBottom: 100 }}>
                    <span className="tag" style={{ marginBottom: 12 }}>{foodCategories.find(c => c.id === selectedFood.categoryId)?.label || 'Food'}</span>
                    <h3 className="headline-md" style={{ fontSize: 28, marginBottom: 24, color: 'var(--on-surface)' }}>{selectedFood.name}</h3>
                    
                    <div style={{ background: 'var(--surface-container-lowest)', padding: 20, borderRadius: 16 }}>
                      <label>Serving Selection</label>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
                        {selectedFood.servings?.map(s => (
                          <button key={s.id} onClick={() => {setServingId(s.id); setCustomGrams('');}} style={{ padding: '10px 16px', fontSize: 13, fontWeight: 600, background: servingId === s.id && !customGrams ? 'var(--primary)' : 'var(--surface-container-highest)', color: servingId === s.id && !customGrams ? 'var(--on-primary)' : 'var(--on-surface-variant)', border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.2s' }}>
                            {s.isDeliveryPortion && '📦 '} {s.desc} ({s.grams}g)
                          </button>
                        ))}
                      </div>
                      
                      <label>Or enter exact grams</label>
                      <input type="number" placeholder="e.g. 150" value={customGrams} onChange={e => {setCustomGrams(e.target.value); setServingId('');}} style={{ marginBottom: 20, background: 'var(--surface-container-high)', borderRadius: 12 }} />

                      {!customGrams && (
                        <>
                          <label>Multiplier (Qty)</label>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 20, background: 'var(--surface-container-high)', width: 'max-content', padding: 8, borderRadius: 12 }}>
                            <button className="btn-g" onClick={() => setQty(Math.max(0.25, qty - 0.25))} style={{ padding: '12px 16px', background: 'var(--surface-container-highest)' }}>-</button>
                            <span style={{ fontSize: 20, fontWeight: 800, width: 40, textAlign: 'center' }}>{qty}</span>
                            <button className="btn-g" onClick={() => setQty(qty + 0.25)} style={{ padding: '12px 16px', background: 'var(--surface-container-highest)' }}>+</button>
                          </div>
                        </>
                      )}

                      {/* Beverage Builder */}
                      {selectedFood.hasBeverageModifiers && (
                        <div style={{ marginTop: 24, paddingTop: 24 }}>
                          <label>Milk Choice (Beverage Builder)</label>
                          <select value={milkMod} onChange={e => setMilkMod(e.target.value)} style={{ marginBottom: 16, background: 'var(--surface-container-high)', borderRadius: 12 }}>
                            <option value="none">No Milk / Black (water base)</option>
                            <option value="milk-full-fat">Full-Fat Milk (150ml)</option>
                            <option value="milk-toned">Toned Milk (150ml)</option>
                            <option value="milk-soy">Soy Milk (150ml)</option>
                            <option value="milk-almond">Almond Milk (150ml)</option>
                          </select>
                          <label>Sweeteners & Add-ins</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {['sugar-white', 'jaggery', 'honey'].map(sw => {
                              const sel = sweetMods.includes(sw);
                              return (
                                <button key={sw} onClick={() => {
                                  if (sel) setSweetMods(p => p.filter(x => x !== sw));
                                  else setSweetMods(p => [...p, sw]);
                                }} style={{ padding: '8px 16px', fontSize: 13, fontWeight: 600, background: sel ? 'var(--tertiary-container)' : 'var(--surface-container-highest)', color: sel ? 'var(--on-primary)' : 'var(--on-surface)', border: 'none', borderRadius: 12 }}>{sw.replace('-', ' ').toUpperCase()}</button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* Consistency Toggle */}
                      {selectedFood.supportedConsistencyTypes?.length > 0 && (
                        <div style={{ marginTop: 24 }}>
                          <label>Gravy Consistency</label>
                          <div style={{ display: 'flex', gap: 8 }}>
                            {selectedFood.supportedConsistencyTypes.map(cType => (
                              <button key={cType} onClick={() => setConsistency(cType)} className="btn-g" style={{ flex: 1, background: consistency === cType ? 'var(--primary-container)' : 'var(--surface-container-highest)', color: consistency === cType ? 'var(--on-primary)' : 'var(--on-surface)' }}>{cType}</button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Cooked Oil Chip */}
                      {(selectedFood.itemType === 'dish' || selectedFood.itemType === 'sabzi-veg' || selectedFood.itemType === 'dal-legume') && (
                        <div style={{ marginTop: 24, padding: 16, background: 'var(--surface-container-high)', borderRadius: 12 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--on-surface)' }}>🫙 Cooked in Oil/Ghee?</span>
                          <p style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4, lineHeight: 1.5 }}>Indian dishes absorb variable amounts of fat. If this is a homemade dish cooked in oil, add a secondary 15g entry.</p>
                          <button className="btn-g" style={{ marginTop: 12, width: '100%', background: 'var(--surface-container-highest)' }} onClick={addCookingOil}>
                            + Add Cooking Oil/Ghee (130 Kcal)
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Fixed Bottom Save Action */}
                    <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--surface-container-lowest)', padding: '16px 24px', boxShadow: '0 -4px 20px rgba(0,0,0,0.4)', zIndex: 10 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Kcal</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary-container)' }}>{Math.round(previewMacros?.calories || 0)}</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Pro</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--primary)' }}>{Math.round(previewMacros?.protein || 0)}g</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Carb</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--tertiary-container)' }}>{Math.round(previewMacros?.carbs || 0)}g</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 10, color: 'var(--on-surface-dim)', textTransform: 'uppercase', fontWeight: 700 }}>Fat</div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--outline)' }}>{Math.round(previewMacros?.fat || 0)}g</div>
                        </div>
                      </div>
                      <button className="btn-p" style={{ width: '100%', height: 56, fontSize: 16 }} onClick={() => addFoodToLog(previewMacros)}>
                        Log in {searchMealSlot}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            ) : (
              // SEARCH PANE (List)
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: 24, paddingBottom: 16, background: 'var(--surface-container-lowest)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <h3 className="headline-md" style={{ margin: 0, fontSize: 24 }}>Add to <span style={{ color: 'var(--primary)' }}>{searchMealSlot}</span></h3>
                    <button className="btn-g" style={{ padding: 8 }} onClick={() => setShowSearch(false)}><X size={20}/></button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', top: 18, left: 16, color: 'var(--on-surface-dim)' }} size={20} />
                    <input autoFocus placeholder="Search dal, paneer, roti..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ paddingLeft: 46, borderRadius: 16, fontSize: 16, background: 'var(--surface-container-high)', border: 'none', height: 56 }} />
                  </div>
                </div>
                
                {/* Horizontal Filter Scroll */}
                <div style={{ display: 'flex', gap: 8, padding: '12px 24px', overflowX: 'auto', minHeight: 60, alignItems: 'center', background: 'var(--surface-container-lowest)' }} className="hide-scrollbar">
                  {['All', 'Veg', 'Vegan', 'Egg', 'Non-Veg', 'Jain'].map(d => (
                    <button key={d} onClick={() => setSearchDiet(d)} style={{ whiteSpace: 'nowrap', padding: '8px 16px', borderRadius: 20, fontSize: 12, fontWeight: 600, border: 'none', background: searchDiet === d ? 'var(--primary)' : 'var(--surface-container-low)', color: searchDiet === d ? 'var(--on-primary)' : 'var(--on-surface-variant)', cursor: 'pointer' }}>{d}</button>
                  ))}
                  <div style={{ width: 1, height: 24, background: 'var(--surface-container-highest)', margin: '0 4px' }} />
                  <select value={searchFasting} onChange={e=>setSearchFasting(e.target.value)} style={{ padding: '8px 16px', fontSize: 12, borderRadius: 20, background: searchFasting ? 'var(--primary-container)' : 'var(--surface-container-low)', color: searchFasting ? 'var(--on-primary)' : 'var(--on-surface-variant)', border: 'none', outline: 'none', margin: 0 }}>
                    <option value="">Fasting/Vrat?</option>
                    {CONSTANTS.FASTING_TYPES.filter(t=>t.id).map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                  </select>
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 6, padding: '8px 24px', overflowX: 'auto', background: 'var(--surface)' }} className="hide-scrollbar">
                  {[{ id: 'All', label: 'All' }, ...foodCategories].map(c => (
                    <button key={c.id} onClick={() => setSearchCat(c.id)} style={{ whiteSpace: 'nowrap', padding: '6px 12px', borderRadius: 16, fontSize: 11, fontWeight: 600, border: 'none', background: searchCat === c.id ? 'var(--surface-container-highest)' : 'transparent', color: searchCat === c.id ? 'var(--primary)' : 'var(--on-surface-dim)', cursor: 'pointer' }}>{c.label}</button>
                  ))}
                </div>

                {/* Results List */}
                <div style={{ overflowY: 'auto', flex: 1, padding: 24, paddingBottom: 40 }}>
                  {!searchQuery && recentFoods.length > 0 && (
                    <div style={{ marginBottom: 32 }}>
                      <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--outline)', marginBottom: 16 }}>Recent (Quick Add)</p>
                      {recentFoods.map(rf => (
                        <div key={rf.id} onClick={(e) => { e.stopPropagation(); handleSelectFood(rf); }} className="tag-d" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, margin: '0 8px 8px 0', padding: '10px 16px', borderRadius: 24, cursor: 'pointer', background: 'var(--surface-container-low)' }}>
                          <Clock size={14} color="var(--primary)" />
                          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)' }}>{rf.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--outline)', marginBottom: 16 }}>Results</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {searchResults.map(f => (
                      <div key={f.id} onClick={(e) => { e.stopPropagation(); handleSelectFood(f); }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: 'var(--surface-container-low)', borderRadius: 16, cursor: 'pointer' }} className="group hover:bg-surface-container-high transition-colors">
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--on-surface)', marginBottom: 6 }}>{f.name} {f.isFastingFood && ' 🕉️'}</p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
                            <span style={{ fontSize: 12, color: 'var(--on-surface-variant)', fontWeight: 500 }}>{f.servings[0].desc}</span>
                            {f.hasBeverageModifiers && <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--tertiary-container)', background: 'rgba(231, 108, 55, 0.1)', padding: '2px 8px', borderRadius: 6 }}>Build Drink</span>}
                            {f.categoryId === 'dish' && <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary)', background: 'rgba(255, 181, 155, 0.1)', padding: '2px 8px', borderRadius: 6 }}>Dish</span>}
                          </div>
                        </div>
                        <ChevronRight size={20} color="var(--outline-variant)" className="group-hover:text-primary transition-colors" />
                      </div>
                    ))}
                  </div>
                  
                  {searchResults.length === 0 && (
                    <div style={{ textAlign: 'center', padding: 60, color: 'var(--on-surface-variant)' }}>
                      <Search size={48} color="var(--surface-container-highest)" style={{ margin: '0 auto 16px' }} />
                      <p style={{ fontSize: 16, fontWeight: 500 }}>No results found.</p>
                      <button className="btn-d" style={{ marginTop: 24, fontSize: 14, padding: '10px 20px' }} onClick={() => setShowCustom(true)}>+ Add Custom Food</button>
                    </div>
                  )}
                  {searchResults.length > 0 && (
                    <div style={{ textAlign: 'center', marginTop: 32 }}>
                      <button className="btn-g" onClick={() => setShowCustom(true)}>Can't find it? Add Custom Info</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
