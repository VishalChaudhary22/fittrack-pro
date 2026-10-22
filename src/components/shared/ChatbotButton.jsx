import { useState, useEffect, useCallback } from 'react';
import { X } from 'lucide-react';

const GREETING_KEY = 'forge_greeted';

/**
 * FORGE entry point.
 *
 * MARGIN keeps ember scarce, so the coach is a quiet text affordance rather
 * than a floating gradient orb — it must not compete with the screen's single
 * ember element. The greeting is a margin note, not a card.
 */
export default function ChatbotButton({ onClick, hasUnread = false, userName }) {
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);

  const dismissGreeting = useCallback(() => {
    setGreetingVisible(false);
    setTimeout(() => setShowGreeting(false), 300);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(GREETING_KEY)) return;

    const showTimer = setTimeout(() => {
      setShowGreeting(true);
      sessionStorage.setItem(GREETING_KEY, '1');
      setTimeout(() => setGreetingVisible(true), 30);
    }, 1800);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(dismissGreeting, 5000);
    return () => clearTimeout(timer);
  }, [showGreeting, dismissGreeting]);

  const handleClick = useCallback(() => {
    if (showGreeting) dismissGreeting();
    onClick();
  }, [showGreeting, dismissGreeting, onClick]);

  const firstName = userName?.toLowerCase().startsWith('kaaya fit')
    ? 'Kaaya Fit'
    : (userName?.split(' ')[0] || 'there');

  return (
    <>
      {showGreeting && (
        <div
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: 'calc(136px + env(safe-area-inset-bottom, 12px))',
            right: 22,
            left: 22,
            marginLeft: 'auto',
            maxWidth: 260,
            padding: '12px 0 12px 14px',
            borderLeft: '2px solid var(--ember)',
            zIndex: 201,
            opacity: greetingVisible ? 1 : 0,
            transform: greetingVisible ? 'translateY(0)' : 'translateY(6px)',
            transition: 'opacity 240ms var(--ease-forge), transform 240ms var(--ease-forge)',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); dismissGreeting(); }}
            style={{
              position: 'absolute', top: 0, right: 0,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 2, lineHeight: 0, color: 'var(--ash-dim)',
            }}
            aria-label="Dismiss greeting"
          >
            <X size={12} />
          </button>

          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.4, paddingRight: 16 }}>
            Hey {firstName} 👋
          </div>
          <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 3, lineHeight: 1.45 }}>
            Need help with a workout or a meal? Ask.
          </div>
        </div>
      )}

      {/* quiet text affordance, bottom-right above the tab bar */}
      <button
        onClick={handleClick}
        aria-label="Open FORGE AI Coach"
        style={{
          position: 'fixed',
          bottom: 'calc(64px + env(safe-area-inset-bottom, 12px))',
          right: 22,
          background: 'var(--canvas)',
          border: 'none',
          borderBottom: '1px solid var(--hair)',
          padding: '6px 0 5px',
          cursor: 'pointer',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'var(--bone)',
          zIndex: 200,
          transition: 'color 140ms var(--ease-forge)',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--ember)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--bone)'; }}
      >
        Ask forge
        {hasUnread && (
          <span style={{
            display: 'inline-block',
            width: 4, height: 4,
            borderRadius: '50%',
            background: 'var(--ember)',
            marginLeft: 6,
            verticalAlign: 'middle',
          }} />
        )}
      </button>
    </>
  );
}
