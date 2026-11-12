import { Bell } from 'lucide-react';
import { QuestBtn } from '../primitives';
import { useNotificationPromptGate } from '../../../core/hooks/useNotificationPromptGate';

// Quest twin of the V1 NotificationPrompt — same gate and behaviour,
// Quest presentation (q-sheet pack).
export default function QuestNotificationPrompt() {
  const { isVisible, handleEnable, handleDismiss } = useNotificationPromptGate();

  if (!isVisible) return null;

  return (
    <div className="q-sheet-wrap" style={{ zIndex: 999 }} onClick={handleDismiss}>
      <div className="q-sheet" role="dialog" aria-modal="true" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', gap: 14, marginBottom: 18 }}>
          <div
            style={{
              width: 48, height: 48, flexShrink: 0,
              background: 'var(--q-gold)', border: '3px solid var(--q-border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Bell size={24} color="#201803" />
          </div>
          <div>
            <h3 className="q-ps" style={{ fontSize: 14, lineHeight: 1.6, margin: '2px 0 7px' }}>Stay on track</h3>
            <p style={{ fontSize: 19, color: 'var(--q-dim)', lineHeight: 1.35, margin: 0 }}>
              Get nudges when it matters most — workout reminders, streak alerts, and your weekly Olympus rank update.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <QuestBtn onClick={handleEnable} style={{ width: '100%', minHeight: 50 }}>
            Enable Notifications
          </QuestBtn>
          <QuestBtn tone="ghost" onClick={handleDismiss} style={{ width: '100%', minHeight: 50 }}>
            Not now
          </QuestBtn>
        </div>
      </div>
    </div>
  );
}
