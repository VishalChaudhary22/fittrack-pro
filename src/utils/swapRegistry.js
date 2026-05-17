import { supabase } from '../lib/supabaseClient';

export function getSwapRegistryKey(splitId, userId) {
  return `fittrack_swapRegistry_${splitId}_${userId}`;
}

export function getSwapRegistry(splitId, userId) {
  if (!splitId || !userId) return {};
  try {
    const raw = localStorage.getItem(getSwapRegistryKey(splitId, userId));
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    console.error('Failed to read swap registry', e);
    return {};
  }
}

export async function setSwapRegistry(splitId, userId, registry) {
  if (!splitId || !userId) return;
  // Save to local storage for immediate sync
  localStorage.setItem(getSwapRegistryKey(splitId, userId), JSON.stringify(registry));
  
  // Sync to Supabase user_profiles in the background
  try {
    const { data: profile } = await supabase.from('user_profiles').select('swap_registry').eq('id', userId).single();
    const existing = profile?.swap_registry || {};
    existing[splitId] = registry;
    await supabase.from('user_profiles').update({ swap_registry: existing }).eq('id', userId);
  } catch (e) {
    console.error('Failed to sync swap registry to cloud', e);
  }
}

export async function loadSwapRegistryFromCloud(userId) {
  if (!userId) return;
  try {
    const { data: profile } = await supabase.from('user_profiles').select('swap_registry').eq('id', userId).single();
    const cloudReg = profile?.swap_registry || {};
    // Populate local storage for each split
    Object.keys(cloudReg).forEach(splitId => {
      localStorage.setItem(getSwapRegistryKey(splitId, userId), JSON.stringify(cloudReg[splitId]));
    });
  } catch (e) {
    console.error('Failed to load swap registry from cloud', e);
  }
}

export function getSwappedExercise(exercise, splitId, userId) {
  if (!exercise || !exercise.exerciseId) return exercise;
  const registry = getSwapRegistry(splitId, userId);
  const swapInfo = registry[exercise.exerciseId];
  if (swapInfo) {
    return {
      ...exercise,
      name: swapInfo.replacementName,
      exerciseId: swapInfo.replacementId,
      isSwapped: true,
      originalId: exercise.exerciseId,
      originalName: exercise.name
    };
  }
  return exercise;
}

export function registerSwap(originalId, originalName, replacementId, replacementName, splitId, userId) {
  const registry = getSwapRegistry(splitId, userId);
  registry[originalId] = {
    replacementId,
    replacementName,
    swappedAt: new Date().toISOString()
  };
  setSwapRegistry(splitId, userId, registry);
  return registry;
}

export function removeSwap(originalId, splitId, userId) {
  const registry = getSwapRegistry(splitId, userId);
  delete registry[originalId];
  setSwapRegistry(splitId, userId, registry);
  return registry;
}
