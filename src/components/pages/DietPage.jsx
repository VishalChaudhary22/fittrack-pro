import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { TDEEDetailSheet } from '../shared/TDEEDetailSheet';
import { computeNewTarget, recomputeMacros } from '../../utils/adaptiveCalories';
import { DIET_TYPES } from '../../data/diets';
import { calcBMI, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { gId, tod, kgToLbs, cmToFtIn } from '../../utils/helpers';
import { foodCategories } from '../../data/foods/foodCategories';
import { calcMacros, calcBeverageMacros, searchLocalFoods, getRecentFoods } from '../../utils/foodUtils';
import { useFoodCache } from '../../hooks/useFoodCache';
import { calcWorkoutCalories, calcCardioCalories } from '../../data/metValues';
import { getDisplayStepLog } from '../../utils/activityUtils';
import { useScrollRestoration } from '../../hooks/useScrollRestoration';
import { Screen, Sec, Hero, LedgerRow, Amp, One, Note, Action, Word, TLink, Ticks } from '../shared/Margin';

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
    { id: 'Breakfast', targetPct: 0.25 },
    { id: 'Mid-Morning', targetPct: 0.05 },
    { id: 'Lunch', targetPct: 0.35 },
    { id: 'Pre-Workout', targetPct: 0.05 },
    { id: 'Post-Workout Dinner', targetPct: 0.25 },
    { id: 'Before Bed', targetPct: 0.05 },
  ],
};

// The quick-add button logs here. It used to be a slot with no section on the
// page, so anything added through it counted toward the day and then vanished.
const SNACK_SLOT = { id: 'Snack/General', targetPct: 0.05 };

const dietTabCache = { activeTab: 'tracker' };

const plain = { background: 'none', border: 'none', padding: 0, font: 'inherit', color: 'inherit', textAlign: 'left', cursor: 'pointer' };

// Declared at module scope: a component defined inside the page would remount
// on every keystroke and take the caret with it.
const Field = (props) => <input {...props} className="field" />;

export default function DietPage({ chatbot }) {
  const { user, foodLog, setFoodLog, addToast, favoriteIds, toggleFavoriteFood, getFoodStreak, waterLog, setWaterLog, supplementLog, setSupplementLog, supplementConfig, workoutLogs, cardioLog, stepLogs, bodyFatLog, adaptiveSuggestion, acceptSuggestion, dismissSuggestion, updateProfile, tdeeEstimate, setTdeePreferences } = useApp();
  const { allFoods, isLoading: foodsLoading } = useFoodCache();
  const [showTDEEDetails, setShowTDEEDetails] = useState(false);

  const [diet, setDiet] = useState(() => user?.dietType || 'nonveg');
  const [dateStr, setDateStr] = useState(tod());

  // The selected diet plan is a profile setting — persist it so it survives a
  // reload and reaches the chatbot's system prompt.
  const handleSetDiet = useCallback(async (next) => {
    setDiet(next);
    await updateProfile?.({ dietType: next });
  }, [updateProfile]);

  useScrollRestoration('/diet');
  const [activeTab, setActiveTabRaw] = useState(dietTabCache.activeTab);
  const setActiveTab = useCallback((tab) => {
    dietTabCache.activeTab = tab;
    setActiveTabRaw(tab);
  }, []);

  const handleUpdateTDEETargets = async () => {
     if (!tdeeEstimate?.estimatedTDEE || !user) return;
     const newTdee = tdeeEstimate.estimatedTDEE;
     const deficitInfo = calcDeficit(user.weight, user.weightGoal, user.goalWeeks);
     const goal = deficitInfo.goal;
     const dailyDelta = deficitInfo.dailyDelta || (goal === 'loss' ? 500 : goal === 'gain' ? 400 : 0);
     const computedKcal = goal === 'loss' ? newTdee - dailyDelta : goal === 'gain' ? newTdee + dailyDelta : newTdee;

     await setTdeePreferences?.(prev => ({ ...prev, useEstimatedTDEE: true }));
     await updateProfile({ customGoalKcal: computedKcal });
     addToast('Targets successfully updated to adaptive TDEE! 🚀', 'success');
  };

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
  const [qtyInput, setQtyInput] = useState('1');

  useEffect(() => {
    setQtyInput(String(qty));
  }, [qty]);

  const handleQtyInputChange = (e) => setQtyInput(e.target.value);
  const handleQtyInputBlur = () => {
    const parsed = parseFloat(qtyInput);
    if (!isNaN(parsed) && parsed > 0) {
      const rounded = Math.max(0.25, Math.round(parsed * 4) / 4);
      setQty(rounded);
      setQtyInput(String(rounded));
    } else {
      setQtyInput(String(qty));
    }
  };
  const handleQtyMinus = () => {
    const next = Math.max(0.25, qty - 0.25);
    setQty(next);
    setQtyInput(String(next));
  };
  const handleQtyPlus = () => {
    const next = qty + 0.25;
    setQty(next);
    setQtyInput(String(next));
  };

  const [customGrams, setCustomGrams] = useState('');
  const [consistency, setConsistency] = useState('standard');
  const [milkMod, setMilkMod] = useState('none');
  const [sweetMods, setSweetMods] = useState([]);

  // Custom Form
  const [showCustom, setShowCustom] = useState(false);
  const [customInput, setCustomInput] = useState({ name: '', cals: '', p: '', c: '', f: '' });
  const [editingEntry, setEditingEntry] = useState(null);

  const totalGrams = useMemo(() => {
    if (!selectedFood || !servingId) return null;
    if (servingId === 'custom' && customGrams) {
      return parseFloat(customGrams) * qty;
    }
    const serving = selectedFood.servings?.find(s => s.id === servingId);
    if (!serving?.grams) return null;
    return serving.grams * qty;
  }, [selectedFood, servingId, customGrams, qty]);

  const canCalculate = Boolean(Number.isFinite(user?.weight) && Number.isFinite(user?.height) && Number.isFinite(user?.age));
  const isUnset = !canCalculate || !user?.weightGoal;

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
  const computedGoalKcal = goal === 'loss' ? tdee - dailyDelta : goal === 'gain' ? tdee + dailyDelta : tdee;
  const goalKcal = user?.customGoalKcal || computedGoalKcal;
  const isCustomTarget = !!user?.customGoalKcal;
  const latestBF = bodyFatLog?.filter(e => e.userId === user?.id)?.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  const baseWeightForProtein = (goal === 'loss' && user.weightGoal && user.weightGoal < user.weight) ? user.weightGoal : user.weight;

  const isHeavyCut = user.workoutDays >= 5 && goal === 'loss';
  const protMultiplier = isHeavyCut ? 2.0 : 1.8;
  const protTarget = user?.customProteinG || Math.round(baseWeightForProtein * protMultiplier);
  const carbsTarget = Math.round((goalKcal * (goal === 'loss' ? .38 : .44)) / 4);
  const fatTarget = Math.round((goalKcal * .26) / 9);

  const wheyScoops = protTarget >= 180 ? Math.min(Math.ceil((protTarget - 100) / 25), 4) : 2;
  const wheyProt = wheyScoops * 25;
  const foodProt = protTarget - wheyProt;

  const dt = DIET_TYPES[diet];
  const gKey = goal === 'loss' ? 'loss' : goal === 'gain' ? 'gain' : 'maintain';

  // Log calculation logic
  const dailyLog = useMemo(() => foodLog.filter(l => l.date === dateStr && l.userId === user.id), [foodLog, dateStr, user.id]);

  const selectedDateWater = useMemo(() => (waterLog || []).filter(l => l.userId === user.id && l.date === dateStr), [waterLog, user.id, dateStr]);
  const selectedDateWaterTotal = useMemo(() => selectedDateWater.reduce((acc, curr) => acc + curr.ml, 0), [selectedDateWater]);
  const waterGoal = user.waterGoal || 3000;
  const waterPct = Math.min(Math.round((selectedDateWaterTotal / waterGoal) * 100) || 0, 100);

  const addWater = (ml) => {
    setWaterLog(p => [...p, { id: gId(), userId: user.id, date: dateStr, ml, timestamp: new Date().toISOString() }]);
    addToast(`Logged ${ml}ml of water`, 'success');
  };

  const userSupps = useMemo(() => supplementConfig || [{ id: 's1', name: 'Whey Protein', dose: '1 scoop' }, { id: 's2', name: 'Creatine', dose: '5g' }, { id: 's3', name: 'Multivitamin', dose: '1 tab' }], [supplementConfig]);
  const selectedDateSuppLog = useMemo(() => (supplementLog || []).filter(l => l.userId === user.id && l.date === dateStr), [supplementLog, user.id, dateStr]);
  const toggleSupplement = (suppId) => {
    const existing = selectedDateSuppLog.find(l => l.suppId === suppId);
    if (existing) {
       setSupplementLog(p => p.filter(l => l.id !== existing.id));
    } else {
       setSupplementLog(p => [...p, { id: Math.random().toString(36).substring(7), userId: user.id, date: dateStr, suppId, timestamp: new Date().toISOString() }]);
    }
  };

  const todayTotals = useMemo(() => {
    return dailyLog.reduce((acc, curr) => ({
      calories: acc.calories + (curr.macros?.calories || 0),
      protein: acc.protein + (curr.macros?.protein || 0),
      carbs: acc.carbs + (curr.macros?.carbs || 0),
      fat: acc.fat + (curr.macros?.fat || 0),
      iron: acc.iron + (curr.macros?.iron || 0),
      vitaminB12: acc.vitaminB12 + (curr.macros?.vitaminB12 || 0),
      vitaminD: acc.vitaminD + (curr.macros?.vitaminD || 0)
    }), { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, vitaminB12: 0, vitaminD: 0 });
  }, [dailyLog]);

  const todayCaloriesBurned = useMemo(() => {
    const workoutCals = workoutLogs
      .filter(l => l.date === dateStr && l.userId === user?.id)
      .reduce((sum, log) => sum + (calcWorkoutCalories(log, user?.weight) || 0), 0);
    const cardioRecord = (cardioLog || []).filter(c => c.date === dateStr && c.userId === user?.id);
    const cardioCals = cardioRecord.reduce((sum, c) => sum + calcCardioCalories(c, user?.weight), 0);
    const activeStepLog = getDisplayStepLog(stepLogs, dateStr);
    const stepCals = activeStepLog?.calories_active || 0;
    return workoutCals + cardioCals + stepCals;
  }, [workoutLogs, cardioLog, stepLogs, user?.id, user?.weight, dateStr]);

  const energyBalance = todayTotals.calories - todayCaloriesBurned;

  // Phase 4 - Weekly Analysis Logic
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(tod());
      d.setDate(d.getDate() - 6 + i);
      return d.toISOString().split('T')[0];
    });
  }, []);

  const weeklyData = useMemo(() => {
    return last7Days.map(d => {
      const dayLogs = foodLog.filter(l => l.date === d && l.userId === user.id);
      const t = dayLogs.reduce((acc, curr) => ({
        calories: acc.calories + (curr.macros?.calories || 0),
        protein: acc.protein + (curr.macros?.protein || 0),
        carbs: acc.carbs + (curr.macros?.carbs || 0),
        fat: acc.fat + (curr.macros?.fat || 0),
        iron: acc.iron + (curr.macros?.iron || 0),
        vitaminB12: acc.vitaminB12 + (curr.macros?.vitaminB12 || 0),
        vitaminD: acc.vitaminD + (curr.macros?.vitaminD || 0)
      }), { calories: 0, protein: 0, carbs: 0, fat: 0, iron: 0, vitaminB12: 0, vitaminD: 0 });
      return {
        date: d,
        dayName: new Date(d).toLocaleDateString('en-US', { weekday: 'short' }),
        calories: Math.round(t.calories),
        protein: Math.round(t.protein),
        carbs: Math.round(t.carbs),
        fat: Math.round(t.fat),
        iron: t.iron,
        vitaminB12: t.vitaminB12,
        vitaminD: t.vitaminD
      };
    });
  }, [last7Days, foodLog, user.id]);

  const weeklyMicros = useMemo(() => {
    return weeklyData.reduce((acc, curr) => ({
      iron: acc.iron + curr.iron,
      vitaminB12: acc.vitaminB12 + curr.vitaminB12,
      vitaminD: acc.vitaminD + curr.vitaminD
    }), { iron: 0, vitaminB12: 0, vitaminD: 0 });
  }, [weeklyData]);

  // Synchronous local search against cached allFoods (hybrid approach)
  const searchResults = useMemo(() => {
    if (foodsLoading || !allFoods.length) return [];

    const q = searchQuery.trim();
    const hasFilters = searchDiet !== 'All' || searchFasting || searchCat !== 'All';

    // No query and no filters → show a sample of foods so the list isn't empty
    if (!q && !hasFilters) return allFoods.slice(0, 50);

    // Run local search (with or without query)
    let results = searchLocalFoods(allFoods, q, {
      dietType: searchDiet !== 'All' ? searchDiet.replace('-', '').toLowerCase() : null,
      fastingType: searchFasting || null,
    });

    if (searchCat !== 'All') {
      results = results.filter(f => f.category === searchCat);
    }

    return results;
  }, [searchQuery, searchDiet, searchFasting, searchCat, allFoods, foodsLoading]);


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

  // Ref for delayed search input focus (H2a)
  const searchInputRef = useRef(null);
  // Where the page was scrolled when the sheet opened, restored on close.
  const trackerScrollRef = useRef(0);

  // Lock body+html scroll when modal opens, and handle visualViewport (H1b, H1c, H1d)
  useEffect(() => {
    if (showSearch) {
      // Lock BOTH html and body to prevent any background scrolling on iOS
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = `-${window.scrollY}px`;
      document.documentElement.style.overflow = 'hidden';
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
      document.documentElement.style.overflow = '';
    };
  }, [showSearch]);

  // Delayed focus for search input — decouple from modal mount to let scroll containers register first (H2a, H2b)
  useEffect(() => {
    if (showSearch && !selectedFood && !showCustom) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [showSearch, selectedFood, showCustom]);

  const closeSearch = () => {
    setShowSearch(false);
    setTimeout(() => window.scrollTo({ top: trackerScrollRef.current || 0, behavior: 'instant' }), 0);
  };

  const handleOpenSearch = (slot) => {
    trackerScrollRef.current = window.scrollY;
    setSearchMealSlot(slot);
    setShowSearch(true);
    setSelectedFood(null);
    setShowCustom(false);
    setSearchQuery('');       // Bug 1 fix — always start fresh
    setSearchCat('All');      // Gap 3 fix — correct default
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleSelectFood = (food) => {
    setSelectedFood(food);
    const defServing = food.servings?.[0]?.id || '';
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
      closeSearch();
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
    setSearchQuery('');       // Gap 9 fix — clear stale query behind detail pane
    setSearchCat('All');      // Gap 9 fix
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

  /* ─── derived display values ─────────────────────────────────────────── */
  const remainingKcal = Math.max(0, Math.round(goalKcal - todayTotals.calories));
  const protGap = Math.max(0, Math.round(protTarget - todayTotals.protein));
  const carbGap = Math.max(0, Math.round(carbsTarget - todayTotals.carbs));
  const fatGap = Math.max(0, Math.round(fatTarget - todayTotals.fat));
  const calPct = Math.min(100, Math.round((todayTotals.calories / (goalKcal || 1)) * 100) || 0);
  const foodStreak = getFoodStreak();

  // Every slot in the plan, plus the quick-add slot and anything already
  // logged against a slot name the plan doesn't know about.
  const slots = useMemo(() => {
    const base = [...CONSTANTS.MEAL_SLOTS, SNACK_SLOT];
    const known = new Set(base.map(s => s.id));
    const orphans = [...new Set(dailyLog.map(l => l.slot).filter(s => s && !known.has(s)))];
    return [...base, ...orphans.map(id => ({ id, label: id, targetPct: 0 }))];
  }, [dailyLog]);

  const phaseLabel = goal === 'loss' ? 'cut' : goal === 'gain' ? 'bulk' : 'maintain';
  const dateLabel = dateStr === tod()
    ? 'Today'
    : new Date(dateStr).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });

  const MODES = [
    { id: 'tracker', label: 'Log' },
    { id: 'guide', label: 'Plan' },
    { id: 'analysis', label: 'Week' },
  ];

  /* ─── shared bits ────────────────────────────────────────────────────── */
  const MacroNote = () => {
    if (!isUnset && protGap > 30) {
      return (
        <Note>
          <b>Protein first.</b> {protGap} g to go — that's the only line worth thinking about tonight.
        </Note>
      );
    }
    if (!isUnset && protGap > 0) {
      return <Note><b>{protGap} g of protein left.</b> Close it and the day is done.</Note>;
    }
    if (!isUnset) {
      return <Note><b>Protein is covered.</b> Everything else is within range.</Note>;
    }
    return null;
  };

  return (
    <>
      <Screen
        kicker="Food"
        right={
          <div className="rowf g12">
            {MODES.map(m => (
              <TLink
                key={m.id}
                onClick={() => setActiveTab(m.id)}
                style={{ color: activeTab === m.id ? 'var(--ink)' : 'var(--ash-dim)' }}
              >
                {m.label}
              </TLink>
            ))}
          </div>
        }
      >
        {isUnset ? (
          <Sec n="01" label="Targets" right="locked">
            <One
              title="Targets need your body metrics."
              sub="Add age, height, current weight and a goal weight and the app can size your day."
            />
            <Action onClick={() => { window.location.hash = '#/profile'; }}>Update profile</Action>
          </Sec>
        ) : (
          <>
            {/* ── 01 THE BUDGET ─────────────────────────────────────── */}
            <Sec
              n="01"
              label="Remaining"
              right={
                <span className="rowf g10" style={{ alignItems: 'center' }}>
                  <TLink onClick={() => changeDate(-1)} aria-label="Previous day">←</TLink>
                  <span onClick={() => setDateStr(tod())} style={{ cursor: 'pointer' }}>{dateLabel}</span>
                  <TLink onClick={() => changeDate(1)} aria-label="Next day">→</TLink>
                </span>
              }
            >
              <Hero value={remainingKcal.toLocaleString()} unit="kcal" />

              <div className="rowf between">
                <span className="kicker" style={{ color: 'var(--ash-dim)' }}>
                  {Math.round(todayTotals.calories).toLocaleString()} eaten
                </span>
                <span className="kicker" style={{ color: 'var(--bone)' }}>
                  {Math.round(goalKcal).toLocaleString()} target
                </span>
              </div>

              <Amp pct={calPct} cap style={{ marginTop: 12 }} />

              <div className="rowf g16 mt10" style={{ flexWrap: 'wrap' }}>
                <span className="meta">{Math.round(todayCaloriesBurned)} burned</span>
                <span className="meta" style={{ color: 'var(--ash)' }}>
                  {Math.abs(Math.round(energyBalance))} {energyBalance > 0 ? 'in' : 'deficit'}
                </span>
                <span className="meta" style={{ color: todayTotals.calories > goalKcal ? 'var(--warn)' : 'var(--ok)', marginLeft: 'auto' }}>
                  {todayTotals.calories > goalKcal ? 'Over' : 'On pace'}
                </span>
              </div>

              {foodStreak.current >= 3 && (
                <LedgerRow k="Logging streak" v={`${foodStreak.current} d`} tone="sm" />
              )}

              <div className="rowf g16 mt18" style={{ flexWrap: 'wrap' }}>
                <TLink onClick={handleCopyYesterday}>Copy yesterday</TLink>
                {isCustomTarget && (
                  <TLink onClick={() => updateProfile({ customGoalKcal: null, customProteinG: null })}>
                    Reset to calculated
                  </TLink>
                )}
              </div>
            </Sec>

            {/* ── 02 MACROS ─────────────────────────────────────────── */}
            {activeTab === 'tracker' && (
              <Sec n="02" label="Macros" right={`${phaseLabel} · ${todayTotals.calories > goalKcal ? 'over' : 'in budget'}`}>
                <LedgerRow
                  k="Protein"
                  v={protGap}
                  sub={` / ${protTarget}g`}
                  tone="em"
                  emberLead
                />
                <LedgerRow k="Carbs" v={carbGap} sub={` / ${carbsTarget}g`} />
                <LedgerRow k="Fat" v={fatGap} sub={` / ${fatTarget}g`} dim />
                <MacroNote />
              </Sec>
            )}

            {/* ── MEALS ─────────────────────────────────────────────── */}
            {activeTab === 'tracker' && slots.map((slot, idx) => {
              const items = dailyLog.filter(l => l.slot === slot.id);
              const slotTotal = Math.round(items.reduce((s, i) => s + (i.macros?.calories || 0), 0));
              const slotProt = Math.round(items.reduce((s, i) => s + (i.macros?.protein || 0), 0));
              const planned = Math.round(goalKcal * (slot.targetPct || 0));

              return (
                <Sec
                  key={slot.id}
                  n={String(idx + 3).padStart(2, '0')}
                  label={slot.id}
                  right={items.length ? `${slotTotal} kcal` : planned ? `${planned} planned` : 'empty'}
                >
                  {items.length === 0 ? (
                    <p className="body-dim" style={{ paddingBottom: 4 }}>
                      {planned ? `About ${planned} kcal and ${Math.round(protTarget * (slot.targetPct || 0))} g protein.` : 'Nothing logged.'}
                    </p>
                  ) : (
                    <>
                      {items.map(i => (
                        <div className="row" key={i.id}>
                          <button
                            className="k"
                            style={{ ...plain, cursor: i.food ? 'pointer' : 'default' }}
                            onClick={() => i.food && editEntry(i)}
                          >
                            {i.name}
                            {i.food && <span className="sub" style={{ marginLeft: 4 }}>edit</span>}
                          </button>
                          <span className="lead" />
                          <span className="v sm">{Math.round(i.macros?.calories || 0)}</span>
                          <TLink
                            onClick={() => removeEntry(i.id)}
                            aria-label={`Remove ${i.name}`}
                            style={{ marginLeft: 10, color: 'var(--ash-dim)' }}
                          >
                            ×
                          </TLink>
                        </div>
                      ))}
                      <div className="meta mt10" style={{ gap: 14 }}>
                        <span>P {slotProt}</span>
                        <span style={{ color: 'var(--ash-dim)' }}>
                          C {Math.round(items.reduce((s, i) => s + (i.macros?.carbs || 0), 0))}
                        </span>
                        <span style={{ color: 'var(--ash-dim)' }}>
                          F {Math.round(items.reduce((s, i) => s + (i.macros?.fat || 0), 0))}
                        </span>
                      </div>
                    </>
                  )}

                  <TLink onClick={() => handleOpenSearch(slot.id)} style={{ marginTop: 14 }}>
                    + Add {slot.id.toLowerCase()}
                  </TLink>
                </Sec>
              );
            })}

            {/* ── WATER ─────────────────────────────────────────────── */}
            {activeTab === 'tracker' && (
              <Sec
                n={String(slots.length + 3).padStart(2, '0')}
                label="Water"
                right={`${(selectedDateWaterTotal / 1000).toFixed(1)} / ${(waterGoal / 1000).toFixed(1)} L`}
              >
                <Amp pct={waterPct} soft />
                <div className="rowf g16 mt14">
                  {[250, 500, 750].map(ml => (
                    <TLink key={ml} onClick={() => addWater(ml)}>+{ml}</TLink>
                  ))}
                  <span className="meta" style={{ marginLeft: 'auto', color: 'var(--bone)' }}>
                    {Math.max(0, ((waterGoal - selectedDateWaterTotal) / 1000)).toFixed(1)} L left
                  </span>
                </div>
              </Sec>
            )}

            {/* ── SUPPLEMENTS ───────────────────────────────────────── */}
            {activeTab === 'tracker' && userSupps.length > 0 && (
              <Sec
                n={String(slots.length + 4).padStart(2, '0')}
                label="Supplements"
                right={`${selectedDateSuppLog.length} / ${userSupps.length} taken`}
              >
                {userSupps.map(supp => {
                  const isTaken = selectedDateSuppLog.some(l => l.suppId === supp.id);
                  return (
                    <LedgerRow
                      key={supp.id}
                      k={supp.name}
                      v={<Word tone={isTaken ? 'ok' : 'idle'}>{isTaken ? 'Taken' : supp.dose}</Word>}
                      onClick={() => toggleSupplement(supp.id)}
                    />
                  );
                })}
              </Sec>
            )}

            {/* ── ADAPTIVE + METABOLISM ─────────────────────────────── */}
            {activeTab === 'tracker' && adaptiveSuggestion && adaptiveSuggestion.scenario !== 'S10' && adaptiveSuggestion.adjustKcal !== 0 && (() => {
              const { newKcal } = computeNewTarget(adaptiveSuggestion.goalKcal, adaptiveSuggestion.adjustKcal, user.gender, adaptiveSuggestion.tdee);
              const newMacros = recomputeMacros({
                goal: adaptiveSuggestion.goal,
                currentWeight: user.weight,
                goalWeight: user.weightGoal,
                newKcal,
                workoutDays: user.workoutDays,
              });
              return (
                <Sec n={String(slots.length + 5).padStart(2, '0')} label="Coach" right="adaptive">
                  <One title={adaptiveSuggestion.message} sub={adaptiveSuggestion.reasoning} />
                  <LedgerRow k="Current target" v={adaptiveSuggestion.goalKcal} sub=" kcal" tone="sm" />
                  <LedgerRow k="Suggested" v={newKcal} sub=" kcal" />
                  {newMacros && (
                    <LedgerRow
                      k="New macros"
                      v={`${newMacros.protein}P · ${newMacros.carbs}C · ${newMacros.fat}F`}
                      tone="sm"
                    />
                  )}
                  <Action onClick={() => acceptSuggestion(newKcal, newMacros?.protein)}>Apply new targets</Action>
                  <TLink onClick={() => dismissSuggestion()} style={{ marginTop: 14 }}>Not now</TLink>
                </Sec>
              );
            })()}

            {activeTab === 'tracker' && tdeeEstimate && (
              <Sec n={String(slots.length + 6).padStart(2, '0')} label="Metabolism" right={tdeeEstimate.confidence}>
                <LedgerRow k="Calculated" v={tdeeEstimate.staticTDEE} sub=" kcal" tone="sm" />
                <LedgerRow k="Adaptive" v={tdeeEstimate.estimatedTDEE} sub=" kcal" />
                <div className="rowf g16 mt18" style={{ flexWrap: 'wrap' }}>
                  <TLink onClick={handleUpdateTDEETargets}>Use adaptive</TLink>
                  <TLink onClick={() => setShowTDEEDetails(true)}>Details</TLink>
                </div>
              </Sec>
            )}

            {/* ── PLAN ──────────────────────────────────────────────── */}
            {activeTab === 'guide' && (
              <>
                <Sec n="02" label="Diet" right={dt.label}>
                  {Object.values(DIET_TYPES).map(d => (
                    <LedgerRow
                      key={d.id}
                      k={d.label}
                      dim={diet !== d.id}
                      onClick={() => handleSetDiet(d.id)}
                      v={diet === d.id
                        ? <Word tone="ok">Selected</Word>
                        : <span className="v sm">→</span>}
                    />
                  ))}
                  <Note>
                    <b>Whey — {wheyScoops} scoop{wheyScoops > 1 ? 's' : ''} a day ({wheyProt} g).</b>{' '}
                    {foodProt} g comes from food, the rest from a scoop.
                  </Note>
                </Sec>

                {dt.meals.map((meal, i) => {
                  const items = meal.items[gKey] || meal.items.maintain || [];
                  const wheyLines = [];
                  if (meal.label === 'Breakfast') wheyLines.push(`+ 1 scoop ${diet === 'vegan' ? 'plant protein (pea+rice)' : 'whey'} — complete protein`);
                  if (meal.label === 'Post-Workout Dinner') wheyLines.push('+ 1 scoop whey within 30 min post-workout');
                  if (wheyScoops >= 3 && meal.label === 'Mid-Morning') wheyLines.push(`+ Extra scoop protein (${protTarget} g target)`);
                  if (wheyScoops >= 4 && meal.label === 'Before Bed') wheyLines.push('+ 1 scoop casein/whey before bed');

                  return (
                    <Sec key={i} n={String(i + 3).padStart(2, '0')} label={meal.label} right={`P ${meal.macros.p} · C ${meal.macros.c} · F ${meal.macros.f}`}>
                      {[...items, ...wheyLines].map((item, j) => (
                        <div
                          key={j}
                          className="row"
                          style={{ alignItems: 'flex-start', fontSize: 12.5 }}
                        >
                          <span
                            style={{
                              color: item.startsWith('+') ? 'var(--ember-soft)' : 'var(--bone)',
                              lineHeight: 1.55,
                              flex: 1,
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                      <div className="meta mt10" style={{ flexWrap: 'wrap', gap: 8 }}>
                        {meal.micros.map(m => <span key={m}>{m}</span>)}
                      </div>
                    </Sec>
                  );
                })}

                {dt.proteinSources && (
                  <Sec n={String(dt.meals.length + 3).padStart(2, '0')} label="Protein sources" right={dt.label}>
                    <p className="body-dim">{dt.proteinSources.join(' · ')}</p>
                    <Note>
                      <b>Complete protein.</b> Pair legumes with grains per meal (dal + rice, chana + roti)
                      to cover all nine amino acids. Whey already carries them.
                    </Note>
                  </Sec>
                )}

                <Sec n={String(dt.meals.length + 4).padStart(2, '0')} label="Body">
                  <LedgerRow k="Weight" v={user?.weight ? (isImpWeight ? `${kgToLbs(user.weight)} lbs` : `${user.weight} kg`) : '—'} />
                  <LedgerRow k="Height" v={user?.height ? (isImpHeight ? cmToFtIn(user.height) : `${user.height} cm`) : '—'} tone="sm" />
                  <LedgerRow k="BMI" v={bmi && !isNaN(bmi) ? bmi : '—'} tone="sm" />
                  {latestBF && <LedgerRow k="Body fat" v={`${latestBF.percentage}%`} tone="sm" />}
                  <LedgerRow k="TDEE" v={`${tdee} kcal`} tone="sm" />
                  <LedgerRow k="Activity" v={(user?.activityLevel || 'moderate').charAt(0).toUpperCase() + (user?.activityLevel || 'moderate').slice(1)} tone="sm" />
                </Sec>
              </>
            )}

            {/* ── WEEK ──────────────────────────────────────────────── */}
            {activeTab === 'analysis' && (
              <>
                <Sec n="02" label="Seven days" right={`${Math.round(weeklyData.reduce((a, d) => a + d.calories, 0) / 7)} avg kcal`}>
                  {weeklyData.map(d => (
                    <LedgerRow
                      key={d.date}
                      k={d.dayName}
                      v={d.calories ? `${d.calories}` : '—'}
                      sub={d.calories ? ` / ${Math.round(goalKcal)}` : ''}
                      tone={d.calories === 0 ? 'sm' : ''}
                    />
                  ))}
                  <Amp pct={calPct} cap style={{ marginTop: 18 }} />
                  <div className="rowf between">
                    <span className="kicker" style={{ color: 'var(--ash-dim)' }}>protein</span>
                    <span className="kicker" style={{ color: 'var(--bone)' }}>{protTarget} g target</span>
                  </div>
                  <Ticks
                    height={40}
                    values={weeklyData.map(d => ({
                      kind: d.protein === 0 ? 'rest' : d.protein >= protTarget * 0.9 ? 'full' : 'on',
                    }))}
                  />
                </Sec>

                <Sec n="03" label="Micros" right="7-day total">
                  <LedgerRow
                    k="Vitamin B12"
                    v={<Word tone={weeklyMicros.vitaminB12 < 1.5 ? 'warn' : 'ok'}>
                      {weeklyMicros.vitaminB12 < 1.5 ? 'Low' : 'Fine'}
                    </Word>}
                  />
                  <LedgerRow
                    k="Vitamin D"
                    v={<Word tone={weeklyMicros.vitaminD < 1400 ? 'warn' : 'ok'}>
                      {weeklyMicros.vitaminD < 1400 ? 'Low' : 'Fine'}
                    </Word>}
                  />
                  <LedgerRow
                    k="Iron"
                    v={<Word tone={user.gender === 'female' && weeklyMicros.iron < 126 ? 'warn' : 'ok'}>
                      {user.gender === 'female' && weeklyMicros.iron < 126 ? 'Low' : 'Fine'}
                    </Word>}
                  />
                  {(weeklyMicros.vitaminB12 < 1.5 || weeklyMicros.vitaminD < 1400 || (user.gender === 'female' && weeklyMicros.iron < 126)) && (
                    <Note>
                      <b>What's missing.</b>{' '}
                      {weeklyMicros.vitaminB12 < 1.5 ? 'B12 comes from dairy, eggs or a supplement — not plants. ' : ''}
                      {weeklyMicros.vitaminD < 1400 ? 'D3 is mostly sun and fatty fish; most people here need a supplement. ' : ''}
                      {user.gender === 'female' && weeklyMicros.iron < 126 ? 'Iron: palak, rajma, chana, ragi and dates.' : ''}
                    </Note>
                  )}
                </Sec>

                <Sec n="04" label="Macros, averaged">
                  <LedgerRow k="Protein" v={`${Math.round(weeklyData.reduce((a, d) => a + d.protein, 0) / 7)} g`} sub={` / ${protTarget}`} />
                  <LedgerRow k="Carbs" v={`${Math.round(weeklyData.reduce((a, d) => a + d.carbs, 0) / 7)} g`} sub={` / ${carbsTarget}`} tone="sm" />
                  <LedgerRow k="Fat" v={`${Math.round(weeklyData.reduce((a, d) => a + d.fat, 0) / 7)} g`} sub={` / ${fatTarget}`} tone="sm" />
                  <Action
                    onClick={() => {
                      if (chatbot) {
                        chatbot.openChat();
                        setTimeout(() => chatbot.sendMessage(`Looking at my last 7 days of food, where am I falling short and what should I change?`), 300);
                      }
                    }}
                  >
                    Ask FORGE about the week
                  </Action>
                </Sec>
              </>
            )}

            <div className="foot">
              <span>Kaaya Fit</span>
              <span>{phaseLabel}</span>
            </div>
          </>
        )}
      </Screen>

      {/* ─── SEARCH / LOG SHEET ─────────────────────────────────────── */}
      {showSearch && (
        <div className="mo" style={{ alignItems: 'stretch', padding: 0 }}>
          <div
            style={{
              width: '100%', maxWidth: 430, margin: '0 auto',
              background: 'var(--canvas)', height: '100dvh',
              display: 'flex', flexDirection: 'column',
            }}
          >
            {selectedFood || showCustom ? (
              /* ─── DETAIL / CUSTOM ─── */
              <div style={{ flex: 1, overflowY: 'auto', overscrollBehavior: 'contain', touchAction: 'pan-y', padding: '0 22px 24px' }}>
                <div className="head" style={{ paddingLeft: 0, paddingRight: 0 }}>
                  <div className="head-l">
                    <TLink onClick={() => { setSelectedFood(null); setShowCustom(false); }}>← back</TLink>
                  </div>
                  <div className="head-r">
                    <TLink onClick={closeSearch}>Close</TLink>
                  </div>
                </div>

                {showCustom ? (
                  <div style={{ marginTop: 28 }}>
                    <div className="h1" style={{ marginBottom: 24 }}>Custom food</div>
                    <label className="kicker">Name</label>
                    <Field placeholder="Homemade cookie" value={customInput.name} onChange={e => setCustomInput({ ...customInput, name: e.target.value })} />
                    <label className="kicker" style={{ display: 'block', marginTop: 20 }}>Calories</label>
                    <Field type="number" placeholder="0" value={customInput.cals} onChange={e => setCustomInput({ ...customInput, cals: e.target.value })} />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14, marginTop: 20 }}>
                      {[['p', 'Protein'], ['c', 'Carbs'], ['f', 'Fat']].map(([key, label]) => (
                        <div key={key}>
                          <label className="kicker">{label}</label>
                          <Field type="number" placeholder="0" value={customInput[key]} onChange={e => setCustomInput({ ...customInput, [key]: e.target.value })} />
                        </div>
                      ))}
                    </div>
                    <Action onClick={saveCustomFood}>Add custom food</Action>
                  </div>
                ) : (
                  <div style={{ marginTop: 20, paddingBottom: 120 }}>
                    <div className="kicker" style={{ color: 'var(--ash-dim)' }}>
                      {foodCategories.find(c => c.id === selectedFood.category)?.label || 'Food'}
                    </div>
                    <div className="h1" style={{ marginTop: 8, marginBottom: 24 }}>{selectedFood.name}</div>

                    <Hero
                      value={Math.round(previewMacros?.calories || 0)}
                      unit="kcal"
                      size="sm"
                    />
                    <div className="rowf g16">
                      <span className="meta ember">P {Math.round(previewMacros?.protein || 0)}</span>
                      <span className="meta">C {Math.round(previewMacros?.carbs || 0)}</span>
                      <span className="meta" style={{ color: 'var(--ash-dim)' }}>F {Math.round(previewMacros?.fat || 0)}</span>
                    </div>

                    {selectedFood.servings?.length > 0 && (
                      <div style={{ marginTop: 32 }}>
                        <div className="sec-label" style={{ marginBottom: 10 }}>Serving</div>
                        {selectedFood.servings.map(s => {
                          const on = servingId === s.id && !customGrams;
                          return (
                            <LedgerRow
                              key={s.id}
                              k={`${s.isDeliveryPortion ? 'Delivery · ' : ''}${s.label} · ${s.grams}g`}
                              dim={!on}
                              onClick={() => { setServingId(s.id); setCustomGrams(''); }}
                              v={on ? <Word tone="ok">Selected</Word> : <span className="v sm">→</span>}
                            />
                          );
                        })}
                        <div style={{ marginTop: 18 }}>
                          <label className="kicker">Or exact grams</label>
                          <Field
                            type="number"
                            inputMode="decimal"
                            placeholder="e.g. 150"
                            value={customGrams}
                            onChange={e => { setCustomGrams(e.target.value); setServingId('custom'); }}
                          />
                        </div>
                      </div>
                    )}

                    {!customGrams && (
                      <div style={{ marginTop: 24 }}>
                        <label className="kicker">Quantity</label>
                        <div className="rowf g16" style={{ marginTop: 8 }}>
                          <TLink onClick={handleQtyMinus} disabled={qty <= 0.25} style={{ opacity: qty <= 0.25 ? 0.35 : 1 }}>−</TLink>
                          <input
                            className="field-inline"
                            style={{ width: 72 }}
                            type="number"
                            inputMode="decimal"
                            step="0.25"
                            min="0.25"
                            value={qtyInput}
                            onChange={handleQtyInputChange}
                            onBlur={handleQtyInputBlur}
                            onFocus={e => e.target.select()}
                            aria-label="Quantity"
                          />
                          <TLink onClick={handleQtyPlus}>+</TLink>
                          {totalGrams != null && (
                            <span className="meta" style={{ marginLeft: 'auto', color: 'var(--bone)' }}>
                              {Math.round(totalGrams * 10) / 10} g total
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {selectedFood.supportedConsistencyTypes?.length > 0 && (
                      <div style={{ marginTop: 28 }}>
                        <div className="sec-label" style={{ marginBottom: 10 }}>Consistency</div>
                        {[['standard', 'Normal'], ['thin', 'Watery'], ['thick', 'Restaurant']]
                          .filter(([k]) => k === 'standard' || selectedFood.supportedConsistencyTypes.includes(k))
                          .map(([k, label]) => (
                            <LedgerRow
                              key={k}
                              k={label}
                              dim={consistency !== k}
                              onClick={() => setConsistency(k)}
                              v={consistency === k ? <Word tone="ok">Selected</Word> : <span className="v sm">→</span>}
                            />
                          ))}
                      </div>
                    )}

                    {user.weightGoal && user.weightGoal < user.weight && selectedFood.gi && selectedFood.gi > 70 && (
                      <Note>
                        <b>Glycemic index {selectedFood.gi}.</b> This one spikes blood sugar fast.
                        Smaller portion, or swap for jowar, bajra or brown rice.
                      </Note>
                    )}

                    {selectedFood.hasBeverageModifiers && (
                      <div style={{ marginTop: 28 }}>
                        <div className="sec-label" style={{ marginBottom: 10 }}>Milk</div>
                        <select
                          className="field"
                          value={milkMod}
                          onChange={e => setMilkMod(e.target.value)}
                        >
                          <option value="none">No milk / black (water base)</option>
                          <option value="milk-full-fat">Full-fat milk (150 ml)</option>
                          <option value="milk-toned">Toned milk (150 ml)</option>
                          <option value="milk-soy">Soy milk (150 ml)</option>
                          <option value="milk-almond">Almond milk (150 ml)</option>
                        </select>

                        <div className="sec-label" style={{ marginTop: 22, marginBottom: 10 }}>Sweetener</div>
                        {['sugar-white', 'jaggery', 'honey'].map(sw => {
                          const sel = sweetMods.includes(sw);
                          return (
                            <LedgerRow
                              key={sw}
                              k={sw.replace('-', ' ')}
                              dim={!sel}
                              onClick={() => setSweetMods(p => sel ? p.filter(x => x !== sw) : [...p, sw])}
                              v={sel ? <Word tone="ok">Added</Word> : <span className="v sm">→</span>}
                            />
                          );
                        })}
                      </div>
                    )}

                    {(selectedFood.itemType === 'dish' || selectedFood.itemType === 'sabzi-veg' || selectedFood.itemType === 'dal-legume') && (
                      <div style={{ marginTop: 28 }}>
                        <Note>
                          <b>Cooked in oil?</b> Indian dishes absorb a variable amount of fat. If this is homemade,
                          add a 15 g oil entry.
                        </Note>
                        <TLink onClick={addCookingOil} style={{ marginTop: 12 }}>
                          + Add 15 g oil — 130 kcal
                        </TLink>
                      </div>
                    )}
                  </div>
                )}

                {/* sticky commit bar */}
                {!showCustom && (
                  <div
                    style={{
                      position: 'sticky', bottom: 0,
                      background: 'var(--canvas)',
                      borderTop: '1px solid var(--hair)',
                      paddingTop: 14, marginTop: 24,
                    }}
                  >
                    <Action ember onClick={() => addFoodToLog(previewMacros)}>
                      Log in {searchMealSlot}
                    </Action>
                  </div>
                )}
              </div>
            ) : (
              /* ─── SEARCH ─── */
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ padding: '0 22px 12px', flexShrink: 0 }}>
                  <div className="head" style={{ paddingLeft: 0, paddingRight: 0 }}>
                    <div className="head-l">
                      <span className="kicker">Add to {searchMealSlot}</span>
                    </div>
                    <div className="head-r">
                      <TLink onClick={closeSearch}>Close</TLink>
                    </div>
                  </div>
                  <input
                    ref={searchInputRef}
                    className="field"
                    placeholder="Search dal, paneer, roti…"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ marginTop: 12, fontSize: 17 }}
                  />
                </div>

                {/* filters: words, not pills */}
                <div style={{ display: 'flex', gap: 16, padding: '10px 22px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--hair-soft)' }} className="hide-scrollbar">
                  {['All', 'Veg', 'Vegan', 'Egg', 'Non-Veg', 'Jain'].map(d => (
                    <TLink
                      key={d}
                      onClick={() => setSearchDiet(d)}
                      style={{ color: searchDiet === d ? 'var(--ink)' : 'var(--ash-dim)', whiteSpace: 'nowrap' }}
                    >
                      {d}
                    </TLink>
                  ))}
                  <TLink
                    onClick={() => setSearchFasting(searchFasting ? '' : 'navratri')}
                    style={{ color: searchFasting ? 'var(--ink)' : 'var(--ash-dim)', whiteSpace: 'nowrap' }}
                  >
                    Fasting
                  </TLink>
                </div>

                <div style={{ display: 'flex', gap: 16, padding: '10px 22px', overflowX: 'auto', flexShrink: 0, borderBottom: '1px solid var(--hair-soft)' }} className="hide-scrollbar">
                  {[{ id: 'All', label: 'All' }, ...foodCategories].map(c => (
                    <TLink
                      key={c.id}
                      onClick={() => setSearchCat(c.id)}
                      style={{ color: searchCat === c.id ? 'var(--ink)' : 'var(--ash-dim)', whiteSpace: 'nowrap' }}
                    >
                      {c.label}
                    </TLink>
                  ))}
                </div>

                <div style={{ overflowY: 'auto', flex: 1, overscrollBehavior: 'contain', touchAction: 'pan-y', padding: '20px 22px 40px' }}>
                  {!searchQuery && recentFoods.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <div className="sec-label" style={{ marginBottom: 6 }}>Recent</div>
                      {recentFoods.map(rf => (
                        <LedgerRow
                          key={rf.id}
                          k={rf.name}
                          v="→"
                          tone="sm"
                          onClick={() => handleSelectFood(rf)}
                        />
                      ))}
                    </div>
                  )}

                  {!searchQuery && favoriteIds.length > 0 && (
                    <div style={{ marginBottom: 28 }}>
                      <div className="sec-label" style={{ marginBottom: 6 }}>Favourites</div>
                      {favoriteIds.map(fId => {
                        const food = allFoods.find(f => f.id === fId);
                        if (!food) return null;
                        return (
                          <LedgerRow key={food.id} k={food.name} v="→" tone="sm" onClick={() => handleSelectFood(food)} />
                        );
                      })}
                    </div>
                  )}

                  <div className="sec-label" style={{ marginBottom: 6 }}>
                    <span>Results</span>
                    <span className="r">{searchResults.length}</span>
                  </div>

                  {foodsLoading && <p className="body-dim">Loading foods…</p>}

                  {searchResults.map(f => {
                    const fav = favoriteIds?.includes(f.id);
                    const firstServing = f.servings?.[0];
                    const servingKcal = Math.round(calcMacros(f, firstServing?.id, 1)?.calories || 0);
                    return (
                      <div className="row" key={f.id} style={{ alignItems: 'flex-start' }}>
                        <button className="k" style={{ ...plain }} onClick={() => handleSelectFood(f)}>
                          {f.name} {f.isFastingFood && '· fasting'}
                          <span className="sub" style={{ display: 'block', marginLeft: 0 }}>
                            {firstServing?.label || 'Serving'}
                            {f.hasBeverageModifiers ? ' · build drink' : ''}
                            {f.category === 'dish' ? ' · dish' : ''}
                          </span>
                        </button>
                        <span className="lead" />
                        <span className="v sm" style={{ marginRight: 12 }}>{servingKcal}</span>
                        <TLink
                          onClick={() => toggleFavoriteFood(f.id)}
                          aria-label={fav ? `Unfavourite ${f.name}` : `Favourite ${f.name}`}
                          style={{ color: fav ? 'var(--ember)' : 'var(--ash-dim)' }}
                        >
                          {fav ? '★' : '☆'}
                        </TLink>
                      </div>
                    );
                  })}

                  {searchResults.length === 0 && !foodsLoading && searchQuery.trim().length >= 2 && (
                    <div style={{ marginTop: 40 }}>
                      <p className="body-dim">Nothing matched “{searchQuery}”.</p>
                      <Action onClick={() => setShowCustom(true)}>Add it as a custom food</Action>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <TLink onClick={() => setShowCustom(true)} style={{ marginTop: 28 }}>
                      Can't find it? Add custom
                    </TLink>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <TDEEDetailSheet isOpen={showTDEEDetails} onClose={() => setShowTDEEDetails(false)} tdeeEstimate={tdeeEstimate} />
    </>
  );
}
