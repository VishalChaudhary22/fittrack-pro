import { useEffect } from 'react';

// Module-level map — persists across component mounts for the entire session.
// Keys: route path strings (e.g., '/diet', '/muscle-map')
// Values: scrollY pixel offset
const scrollPositions = new Map();

/**
 * Saves and restores the window scroll position for a given route.
 *
 * @param {string} key - unique identifier for this page/view (use the route path)
 * @param {object} options
 * @param {boolean} options.disabled - set true to skip restoration (e.g., during modal open)
 * @param {number}  options.debounceMs - how often to save scroll position (default: 150)
 */
export function useScrollRestoration(key, { disabled = false, debounceMs = 150 } = {}) {
  useEffect(() => {
    if (disabled) return;

    // Restore saved position or scroll to top for first visit
    const saved = scrollPositions.get(key);
    if (saved !== undefined) {
      // Use requestAnimationFrame to wait for DOM paint before restoring
      const rafId = requestAnimationFrame(() => {
        // Override CSS scroll-behavior during restoration
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = 'auto';
        window.scrollTo({ top: saved, behavior: 'instant' });
        html.style.scrollBehavior = prev;
      });
      return () => cancelAnimationFrame(rafId);
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [key, disabled]);

  useEffect(() => {
    if (disabled) return;

    let timer;
    const handleScroll = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        scrollPositions.set(key, window.scrollY);
      }, debounceMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, [key, disabled, debounceMs]);
}

/**
 * Manually clear the scroll position for a key.
 * Call this when you want the next visit to a page to start at top
 * (e.g., after a user submits a form and navigates away programmatically).
 */
export function clearScrollPosition(key) {
  scrollPositions.delete(key);
}

/**
 * Manually set the scroll position for a key.
 * Useful for programmatic "scroll to section" scenarios.
 */
export function setScrollPosition(key, y) {
  scrollPositions.set(key, y);
}
