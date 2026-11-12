import { Bell } from 'lucide-react';
import { VoltSheet } from './VoltShared';
import { VoltPill } from '../primitives';
import { useNotificationPromptGate } from '../../../core/hooks/useNotificationPromptGate';

// Volt twin of the V1 NotificationPrompt — same gate and behaviour,
// Volt presentation (V-7 popup pack pattern).
export default function VoltNotificationPrompt() {
  const { isVisible, handleEnable, handleDismiss } = useNotificationPromptGate();

  if (!isVisible) return null;

  return (
    <VoltSheet onClose={handleDismiss}>
      <div style={{ fontFamily: "'Archivo', sans-serif" }}>
      <div style={{ display: 'flex', gap: 14, marginBottom: 20 }}>
        <div
          style={{
            width: 48, height: 48, borderRadius: 14, flexShrink: 0,
            background: 'var(--v-volt)', border: '2.5px solid var(--v-edge)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Bell size={24} color="#191914" />
        </div>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', letterSpacing: '-0.01em' }}>Stay on track</h3>
          <p style={{ fontSize: 15, color: 'var(--v-dim)', lineHeight: 1.5, margin: 0 }}>
            Get nudges when it matters most — workout reminders, streak alerts, and your weekly Olympus rank update.
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <VoltPill onClick={handleEnable} style={{ width: '100%', minHeight: 52, fontSize: 16 }}>
          Enable Notifications
        </VoltPill>
        <VoltPill ghost onClick={handleDismiss} style={{ width: '100%', minHeight: 52, fontSize: 15 }}>
          Not now
        </VoltPill>
      </div>
      </div>
    </VoltSheet>
  );
}
