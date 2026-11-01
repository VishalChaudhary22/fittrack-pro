import { Portal } from '../../v1/shared/SharedComponents';
import { QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · shared popups ─────────────────────────────────────────────
// QuestConfirmDialog: the YES/NO menu (§7.6) — a bottom sheet whose
// affirmative row carries the ▶ selector cursor. Used first by the
// Workout battle screen (Q-3); the rest of the popups pack lands in Q-8.

export function QuestConfirmDialog({
  open, title, message, confirmLabel = 'Yes', cancelLabel = 'No',
  danger = false, onConfirm, onCancel,
}) {
  if (!open) return null;
  return (
    <Portal>
      <div className="q-sheet-wrap" onClick={onCancel}>
        <div
          className="q-sheet"
          role="alertdialog"
          aria-label={title}
          onClick={(e) => e.stopPropagation()}
        >
          <QuestLabel tone={danger ? 'ember' : 'volt'}>{title}</QuestLabel>
          {message && (
            <p style={{ fontSize: 20, lineHeight: 1.4, margin: '10px 0 16px' }}>{message}</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <button type="button" className="q-sheet-row q-sheet-row--active" onClick={onConfirm}>
              <PixelSprite name="chevR" size={13} />
              <span style={danger ? { color: 'var(--q-ember-text)' } : undefined}>{confirmLabel}</span>
            </button>
            <button type="button" className="q-sheet-row" onClick={onCancel}>
              <span style={{ width: 13 }} />
              <span>{cancelLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
}
