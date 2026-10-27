import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { useApp } from './AppContext';
import { supabase } from '../../lib/supabaseClient';

// ─── Kaaya Volt · design version (skin) state ────────────────────────────────
// One app, two presentation skins: 'v1' (Original Kaaya) and 'volt'
// (Kaaya Volt). This context owns ONLY the preference — data, auth and
// features are untouched by it. Resolution order:
//   user_profiles.design_version → localStorage → default 'volt'.
// The profile write is best-effort: until the design_version migration has
// been run, the column may not exist and localStorage alone carries the
// preference on this device.

const DesignVersionContext = createContext(null);
const LS_KEY = 'kaaya-design-version';
const DESIGN_VERSIONS = ['v1', 'volt'];
const DEFAULT_DESIGN_VERSION = 'volt';

function readLocal() {
  try {
    const v = localStorage.getItem(LS_KEY);
    return DESIGN_VERSIONS.includes(v) ? v : null;
  } catch {
    return null;
  }
}

export function DesignVersionProvider({ children }) {
  const { user } = useApp();
  const [version, setVersionState] = useState(() => readLocal() ?? DEFAULT_DESIGN_VERSION);
  const userId = user?.id ?? null;

  // Keep a data-design marker on <html> so skin stylesheets can key off it,
  // and swap the favicon so the browser tab carries the active skin's mark.
  // (The installed/launcher icon comes from the PWA manifest — the OS owns
  // that one; in-app surfaces and the tab follow the chosen skin.)
  useEffect(() => {
    document.documentElement.dataset.design = version;
    try { localStorage.setItem(LS_KEY, version); } catch { /* private mode */ }
    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) favicon.href = version === 'volt' ? '/kaaya-icon-volt.svg' : '/kaaya-icon-original.svg';
  }, [version]);

  // Adopt the account preference when a user signs in (profile wins over
  // this device's local choice, so the skin follows the account).
  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from('user_profiles')
          .select('design_version')
          .eq('id', userId)
          .single();
        if (cancelled || error || !data) return;
        const v = data.design_version;
        if (DESIGN_VERSIONS.includes(v)) setVersionState((prev) => (prev === v ? prev : v));
      } catch { /* column not migrated yet — localStorage governs */ }
    })();
    return () => { cancelled = true; };
  }, [userId]);

  const setVersion = useCallback((v) => {
    if (!DESIGN_VERSIONS.includes(v)) return;
    setVersionState(v);
    try { localStorage.setItem(LS_KEY, v); } catch { /* private mode */ }
    if (userId) {
      supabase
        .from('user_profiles')
        .update({ design_version: v })
        .eq('id', userId)
        .then(({ error }) => {
          if (error) console.debug('[DesignVersion] profile save skipped:', error.message);
        });
    }
  }, [userId]);

  return (
    <DesignVersionContext.Provider value={{ version, setVersion, isVolt: version === 'volt' }}>
      {children}
    </DesignVersionContext.Provider>
  );
}

export function useDesignVersion() {
  const ctx = useContext(DesignVersionContext);
  if (!ctx) throw new Error('useDesignVersion must be used within DesignVersionProvider');
  return ctx;
}
