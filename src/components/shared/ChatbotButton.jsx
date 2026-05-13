import { Bot } from 'lucide-react';

export default function ChatbotButton({ onClick, hasUnread = false }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open FORGE AI Coach"
      style={{
        position: 'fixed',
        bottom: 'calc(72px + env(safe-area-inset-bottom, 12px))', // above mobile bottom nav
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
        // Show ambient glow pulse if new nudge
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
  );
}
