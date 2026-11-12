import { Bell, X } from 'lucide-react';
import { useNotificationPromptGate } from '../../../core/hooks/useNotificationPromptGate';

export default function NotificationPrompt() {
  const { isVisible, handleEnable, handleDismiss } = useNotificationPromptGate();

  if (!isVisible) return null;

  return (
    <>
      <style>{`
        @keyframes slideUpPrompt {
          from { transform: translateY(100%); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      
      {/* Overlay */}
      <div 
        style={{
          position: 'fixed', inset: 0, zIndex: 999,
          background: 'var(--glass-bg-heavy, rgba(0,0,0,0.6))',
          backdropFilter: 'var(--glass-blur, blur(12px))',
          display: 'flex', flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
        onClick={handleDismiss}
      >
        {/* Bottom Sheet */}
        <div 
          style={{
            background: 'var(--surface)',
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '24px 24px 32px',
            animation: 'slideUpPrompt 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: '0 -8px 24px rgba(0,0,0,0.1)'
          }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
            <div style={{ width: 40, height: 4, background: 'var(--surface-container-highest)', borderRadius: 2 }} />
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div style={{ 
              width: 48, height: 48, borderRadius: 24, 
              background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              boxShadow: 'var(--glow-primary)'
            }}>
              <Bell size={24} color="#fff" />
            </div>
            <div>
              <h3 className="headline-md" style={{ fontSize: 20, marginBottom: 6 }}>Stay on track</h3>
              <p style={{ fontSize: 14, color: 'var(--on-surface-variant)', lineHeight: 1.5 }}>
                Get nudges when it matters most — workout reminders, streak alerts, and your weekly Olympus rank update.
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button 
              onClick={handleEnable}
              style={{
                width: '100%', padding: '16px', borderRadius: 16,
                background: 'var(--primary)', color: '#fff',
                border: 'none', fontSize: 16, fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Enable Notifications
            </button>
            <button 
              onClick={handleDismiss}
              style={{
                width: '100%', padding: '16px', borderRadius: 16,
                background: 'transparent', color: 'var(--on-surface-variant)',
                border: 'none', fontSize: 15, fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Not now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
