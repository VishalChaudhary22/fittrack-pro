import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · toasts as log-strip lines (plan §7.6) ─────────────────────
// Quest twin of the toast containers: each toast is a battle-log line —
// slot panel, hard border, a status sprite, VT323 text. Same AppContext
// toast feed as the other skins; tap dismisses.

const TONES = {
  error: { sprite: 'x', color: 'var(--q-ember-text)' },
  info: { sprite: 'dots', color: 'var(--q-sky)' },
  success: { sprite: 'check', color: 'var(--q-volt-text)' },
};

export const QuestToastContainer = ({ toasts, removeToast }) => (
  <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 10000, display: 'flex', flexDirection: 'column', gap: 9 }}>
    {toasts.map(t => {
      const tone = TONES[t.type] || TONES.success;
      return (
        <div
          key={t.id}
          className="q-block"
          onClick={() => removeToast(t.id)}
          style={{
            padding: '11px 14px', fontSize: 18, display: 'flex', alignItems: 'center', gap: 10,
            minWidth: 240, maxWidth: 380, cursor: 'pointer',
            opacity: t.exiting ? 0 : 1, transition: 'opacity 200ms ease',
          }}
        >
          <span style={{ display: 'flex', flexShrink: 0 }}>
            <PixelSprite name={tone.sprite} size={15} />
          </span>
          <span style={{ color: tone.color, fontWeight: 700 }}>&gt;</span>
          <span>{t.message}</span>
        </div>
      );
    })}
  </div>
);
