import { useRef, useState } from 'react';

// ─── Skin discovery state (V-8) ───────────────────────────────────────────────
// Device-local bookkeeping for the Volt discovery system (plan §3):
//  - a "session" is one browser session (sessionStorage-guarded) with the app
//    open; the count drives the sessions 2 + 4 compare pill.
//  - the welcome sheet is one-time per device.
// Nothing here touches account data; the skin choice itself lives in
// DesignVersionContext.

const SESSION_COUNT_KEY = 'kaaya_session_count';
const SESSION_MARK_KEY = 'kaaya_session_counted';
const WELCOME_KEY = 'kaaya_welcome_seen_v1';
const PILL_DONE_KEY = 'kaaya_compare_pill_done';

export function recordSession() {
  try {
    if (sessionStorage.getItem(SESSION_MARK_KEY)) return;
    sessionStorage.setItem(SESSION_MARK_KEY, '1');
    const n = (parseInt(localStorage.getItem(SESSION_COUNT_KEY) || '0', 10) || 0) + 1;
    localStorage.setItem(SESSION_COUNT_KEY, String(n));
  } catch { /* private mode — discovery simply won't trigger */ }
}

export function getSessionCount() {
  try {
    return parseInt(localStorage.getItem(SESSION_COUNT_KEY) || '0', 10) || 0;
  } catch {
    return 0;
  }
}

export function isWelcomeSeen() {
  try {
    return localStorage.getItem(WELCOME_KEY) === '1';
  } catch {
    return true; // can't persist → don't nag
  }
}

export function markWelcomeSeen() {
  try {
    localStorage.setItem(WELCOME_KEY, '1');
  } catch { /* ignore */ }
}

// Compare pill: visible only during sessions 2 and 4, and only until the
// user flips or dismisses it once — after that it never returns.
export function useComparePill() {
  const [visible, setVisible] = useState(() => {
    try {
      const count = getSessionCount();
      const done = localStorage.getItem(PILL_DONE_KEY) === '1';
      return !done && (count === 2 || count === 4);
    } catch {
      return false;
    }
  });

  const finish = () => {
    try {
      localStorage.setItem(PILL_DONE_KEY, '1');
    } catch { /* ignore */ }
    setVisible(false);
  };

  return { visible, finish };
}

// Long-press on app chrome (sidebar logo / bottom nav bars) opens the
// quick-switch sheet via a window event the App shell listens for.
// consume() lets the host swallow the click that follows a long-press.
export function useLongPressSwitch(delay = 600) {
  const timer = useRef(null);
  const firedAt = useRef(0);

  const clear = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const start = () => {
    clear();
    timer.current = setTimeout(() => {
      firedAt.current = Date.now();
      window.dispatchEvent(new CustomEvent('kaaya:quick-switch'));
    }, delay);
  };

  const consume = () => {
    if (Date.now() - firedAt.current < 900) {
      firedAt.current = 0;
      return true;
    }
    return false;
  };

  return { start, clear, consume };
}
