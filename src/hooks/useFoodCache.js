import { useState, useEffect } from 'react';
import { fetchAllFoods } from '../utils/foodUtils';
import { indianFoods } from '../data/foods/indianFoods';

/**
 * Hybrid food cache hook.
 * 
 * Strategy:
 *   1. Try fetching ALL foods from Supabase (one-time, no filters/limits)
 *   2. If Supabase succeeds with data → cache the mapped array
 *   3. If Supabase fails or returns empty → fallback to local indianFoods.js
 * 
 * Handles React 18 StrictMode double-mount correctly.
 * 
 * @returns {{ allFoods: Array, isLoading: boolean }}
 */
export function useFoodCache() {
  const [allFoods, setAllFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const foods = await fetchAllFoods();
        if (!cancelled && foods.length > 0) {
          setAllFoods(foods);
          setIsLoading(false);
          return;
        }
      } catch (err) {
        console.warn('Supabase fetch failed, falling back to local indianFoods:', err.message);
      }

      // Fallback: use the local indianFoods.js bundle
      if (!cancelled) {
        setAllFoods(indianFoods);
        setIsLoading(false);
      }
    };

    load();

    return () => { cancelled = true; };
  }, []);

  return { allFoods, isLoading };
}
