// ─── useDiet ─────────────────────────────────────────────────────────────────
// All data logic for the Diet screen, extracted from the V1 DietPage
// (Kaaya Volt V-4) so both skins render the same brain. The V1 page is a
// pure consumer; Volt's Diet page consumes this identically.
import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { useFoodCache } from './useFoodCache';
import { useScrollRestoration } from './useScrollRestoration';
import { DIET_TYPES } from '../../data/diets';
import { calcBMI, calcBMR, calcTDEE, calcDeficit } from '../../utils/calculations';
import { gId, tod } from '../../utils/helpers';
import { calcMacros, calcBeverageMacros, searchLocalFoods, getRecentFoods } from '../../utils/foodUtils';
import { calcWorkoutCalories, calcCardioCalories } from '../../data/metValues';
import { getDisplayStepLog } from '../../utils/activityUtils';

const dietTabCache = { activeTab: 'tracker' };

export function useDiet() {
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
     addToast('Targets successfully updated to adaptive TDEE!', 'success');
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
    setTimeout(() => window.scrollTo({ top: dietTabCache.trackerScroll || 0, behavior: 'instant' }), 0);
  };

  const handleOpenSearch = (slot) => {
    dietTabCache.trackerScroll = window.scrollY;
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

  return {
    acceptSuggestion,
    adaptiveSuggestion,
    addCookingOil,
    addFoodToLog,
    addToast,
    addWater,
    allFoods,
    baseWeightForProtein,
    bmi,
    bmr,
    bodyFatLog,
    canCalculate,
    carbsTarget,
    cardioLog,
    changeDate,
    closeSearch,
    computedGoalKcal,
    dailyDelta,
    dailyLog,
    deficitInfo,
    dismissSuggestion,
    dt,
    editEntry,
    energyBalance,
    fatTarget,
    favoriteIds,
    foodLog,
    foodProt,
    foodsLoading,
    gKey,
    getFoodStreak,
    goal,
    goalKcal,
    handleCopyYesterday,
    handleOpenSearch,
    handleQtyInputBlur,
    handleQtyInputChange,
    handleQtyMinus,
    handleQtyPlus,
    handleSelectFood,
    handleSetDiet,
    handleUpdateTDEETargets,
    isCustomTarget,
    isHeavyCut,
    isImpHeight,
    isImpWeight,
    isUnset,
    last7Days,
    latestBF,
    previewMacros,
    protMultiplier,
    protTarget,
    recentFoods,
    removeEntry,
    saveCustomFood,
    searchInputRef,
    searchResults,
    selectedDateSuppLog,
    selectedDateWater,
    selectedDateWaterTotal,
    setActiveTab,
    setFoodLog,
    setSupplementLog,
    setTdeePreferences,
    setWaterLog,
    stepLogs,
    supplementConfig,
    supplementLog,
    tdee,
    tdeeEstimate,
    todayCaloriesBurned,
    todayTotals,
    toggleFavoriteFood,
    toggleSupplement,
    totalGrams,
    unitHeight,
    unitWeight,
    updateProfile,
    user,
    userSupps,
    waterGoal,
    waterLog,
    waterPct,
    weeklyData,
    weeklyMicros,
    wheyProt,
    wheyScoops,
    workoutLogs,
    activeTab,
    consistency,
    customGrams,
    customInput,
    dateStr,
    diet,
    editingEntry,
    milkMod,
    qty,
    qtyInput,
    searchCat,
    searchDiet,
    searchFasting,
    searchMealSlot,
    searchQuery,
    selectedFood,
    servingId,
    setActiveTabRaw,
    setConsistency,
    setCustomGrams,
    setCustomInput,
    setDateStr,
    setDiet,
    setEditingEntry,
    setMilkMod,
    setQty,
    setQtyInput,
    setSearchCat,
    setSearchDiet,
    setSearchFasting,
    setSearchMealSlot,
    setSearchQuery,
    setSelectedFood,
    setServingId,
    setShowCustom,
    setShowSearch,
    setShowTDEEDetails,
    setSweetMods,
    showCustom,
    showSearch,
    showTDEEDetails,
    sweetMods,
  };
}
