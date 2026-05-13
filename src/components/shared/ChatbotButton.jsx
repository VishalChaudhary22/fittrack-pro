import { useState, useEffect, useCallback } from 'react';
import { Bot, X } from 'lucide-react';

const GREETING_KEY = 'forge_greeted';

export default function ChatbotButton({ onClick, hasUnread = false, userName }) {
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);

  // Define dismissGreeting first with useCallback so it's stable
  const dismissGreeting = useCallback(() => {
    setGreetingVisible(false);
    setTimeout(() => setShowGreeting(false), 300);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(GREETING_KEY)) return;

    const showTimer = setTimeout(() => {
      setShowGreeting(true);
      sessionStorage.setItem(GREETING_KEY, '1');
      // Tiny delay so the element mounts before we trigger the transition
      setTimeout(() => setGreetingVisible(true), 30);
    }, 1800);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(dismissGreeting, 5000);
    return () => clearTimeout(timer);
  }, [showGreeting, dismissGreeting]);

  const handleClick = useCallback(() => {
    if (showGreeting) dismissGreeting();
    onClick();
  }, [showGreeting, dismissGreeting, onClick]);

  const firstName = userName?.split(' ')[0] || 'there';

  return (
    <>
      {/* Greeting Tooltip */}
      {showGreeting && (
        <div
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: 'calc(134px + env(safe-area-inset-bottom, 12px))',
            right: 16,
            maxWidth: 220,
            padding: '12px 14px 12px 14px',
            background: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            borderRadius: 14,
            boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
            zIndex: 201,
            opacity: greetingVisible ? 1 : 0,
            transform: greetingVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
            transition: 'opacity .3s ease, transform .3s ease',
            cursor: 'pointer',
          }}
        >
          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); dismissGreeting(); }}
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 2, lineHeight: 0, color: 'var(--on-surface-variant)',
            }}
            aria-label="Dismiss greeting"
          >
            <X size={12} />
          </button>

          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--on-surface)', lineHeight: 1.45, paddingRight: 12 }}>
            Hey {firstName} 👋
          </div>
          <div style={{ fontSize: 12, color: 'var(--on-surface-variant)', marginTop: 4, lineHeight: 1.4 }}>
            Need help with your workout or diet? I'm here.
          </div>

          {/* Triangle pointer pointing down toward FAB */}
          <div style={{
            position: 'absolute', bottom: -6, right: 22,
            width: 12, height: 12,
            background: 'var(--surface-container-low)',
            border: '1px solid var(--outline-variant)',
            borderTop: 'none', borderLeft: 'none',
            transform: 'rotate(45deg)',
          }} />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={handleClick}
        aria-label="Open FORGE AI Coach"
        style={{
          position: 'fixed',
          bottom: 'calc(72px + env(safe-area-inset-bottom, 12px))',
          right: 20,
          width: 52,
          height: 52,
          borderRadius: '50%',
          background: 'var(--signature-gradient)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(248,95,27,0.35)',
          zIndex: 200,
          transition: 'transform .2s var(--ease-spring)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <Bot size={22} color="#fff" />
        {hasUnread && (
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#FFE66D',
            border: '2px solid var(--surface)',
            animation: 'pulse 2s var(--ease-smooth) infinite',
          }} />
        )}
      </button>
    </>
  );
}
