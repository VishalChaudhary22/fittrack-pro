import { useContact } from '../../../core/hooks/useContact';
import { QuestBlock, QuestBtn, QuestChip, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Contact — the message terminal (plan §7.5, Q-7) ──────────
// Same brain as V1/Volt (useContact — form state + mailto compose), Quest
// presentation: services are cartridge cards, the form is a dialogue
// terminal, send = TRANSMIT. Service icons are lucide in the shared hook
// data, so Quest maps service ids to pixel sprites.

const SVC_SPRITES = { workout: 'dumbbell', diet: 'apple', combo: 'chart', coaching: 'trophy' };

const qSelect = {
  width: '100%', minHeight: 50, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

export default function ContactPage() {
  const { SVCS, f, send, setF, setSub, sf, sub } = useContact();

  if (sub) {
    return (
      <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '70px 20px' }}>
        <PixelSprite name="mail" size={48} style={{ marginBottom: 16 }} />
        <div className="q-ps" style={{ fontSize: 19, lineHeight: 1.5, color: 'var(--q-volt-text)' }}>MESSAGE<br />TRANSMITTED!</div>
        <p style={{ color: 'var(--q-dim)', marginTop: 13, marginBottom: 28, fontSize: 19 }}>Vishal will respond within 24 hours.</p>
        <QuestBtn onClick={() => setSub(false)}>SEND ANOTHER</QuestBtn>
      </div>
    );
  }

  return (
    <div className="q-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header>
        <QuestLabel tone="volt">Work With Me — Custom Plans For Your Body &amp; Goals</QuestLabel>
        <h1 className="q-ps" style={{ fontSize: 'clamp(19px, 6vw, 30px)', lineHeight: 1.35, margin: '10px 0 0' }}>MESSAGE TERMINAL</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {SVCS.map(({ id, label, price }) => {
          const selected = f.service === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => setF(p => ({ ...p, service: id }))}
              className="q-block"
              aria-pressed={selected}
              style={{
                textAlign: 'left', cursor: 'pointer', padding: 16,
                background: selected ? 'var(--q-volt)' : 'var(--q-panel)',
                color: selected ? 'var(--q-btn-fg)' : 'var(--q-ink)',
              }}
            >
              <span style={{
                width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 13,
                background: selected ? 'rgba(20,20,31,0.14)' : 'var(--q-slot)', border: '3px solid var(--q-border)',
              }}>
                <PixelSprite name={SVC_SPRITES[id] || 'dumbbell'} size={21} />
              </span>
              <span style={{ display: 'block', fontWeight: 700, fontSize: 19, lineHeight: 1.3 }}>{label}</span>
              <span className="q-ps" style={{ display: 'block', fontSize: 15, marginTop: 6, color: selected ? 'var(--q-btn-fg)' : 'var(--q-volt-text)' }}>{price}</span>
              {id === 'coaching' && <span style={{ display: 'block', fontSize: 15, color: selected ? 'var(--q-btn-fg)' : 'var(--q-dim)', marginTop: 5 }}>Fill form below</span>}
              {selected && (
                <span style={{ marginTop: 11, display: 'inline-block' }}>
                  <QuestChip style={selected ? { background: 'var(--q-panel)', color: 'var(--q-volt-text)' } : undefined}>▶ SELECTED</QuestChip>
                </span>
              )}
            </button>
          );
        })}
      </div>

      <QuestBlock>
        <QuestLabel tone="volt">Get In Touch</QuestLabel>
        <div style={{ fontSize: 18, color: 'var(--q-dim)', marginTop: 10 }}>
          &gt; ENTER YOUR DETAILS<span className="q-blink" aria-hidden="true" style={{ display: 'inline-block', width: 9, height: 14, background: 'var(--q-volt)', marginLeft: 5, verticalAlign: '-2px' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 13, margin: '15px 0 13px' }}>
          <div>
            <QuestLabel>Full Name *</QuestLabel>
            <input className="q-slot-input" placeholder="Your name" value={f.name} onChange={sf('name')} style={{ marginTop: 6 }} />
          </div>
          <div>
            <QuestLabel>Email *</QuestLabel>
            <input className="q-slot-input" type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} style={{ marginTop: 6 }} />
          </div>
          <div>
            <QuestLabel>Phone / WhatsApp</QuestLabel>
            <input className="q-slot-input" placeholder="+91 98765 43210" value={f.phone} onChange={sf('phone')} style={{ marginTop: 6 }} />
          </div>
          <div>
            <QuestLabel>Primary Goal</QuestLabel>
            <select value={f.goal} onChange={sf('goal')} style={{ ...qSelect, marginTop: 6 }} aria-label="Primary goal">
              <option value="">Select goal</option>
              <option>Weight Loss</option>
              <option>Muscle Building</option>
              <option>Athletic Performance</option>
              <option>General Fitness</option>
              <option>Body Recomposition</option>
              <option>Injury Recovery</option>
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <QuestLabel>About You &amp; Your Goals</QuestLabel>
          <textarea className="q-slot-input" rows={4} placeholder="Current weight, training experience, dietary preferences, schedule..." value={f.message} onChange={sf('message')} style={{ marginTop: 6, resize: 'vertical', width: '100%' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <QuestBtn tone="ember" onClick={send} disabled={!f.name || !f.email} style={{ flex: 1, minWidth: 200, opacity: !f.name || !f.email ? 0.55 : 1 }}>TRANSMIT VIA EMAIL ▶</QuestBtn>
          <QuestBtn
            onClick={() => window.open(`https://wa.me/919871673282?text=${encodeURIComponent('Hi Vishal, I am interested in your Kaaya Fit coaching plans.')}`)}
            style={{ flex: 1, minWidth: 200, background: '#25D366', color: '#10340f' }}
          >
            CHAT ON WHATSAPP
          </QuestBtn>
        </div>
        <p style={{ marginTop: 12, fontSize: 16, color: 'var(--q-dim)', textAlign: 'center' }}>Opens your email app pre-filled to vishalchaudhary28@gmail.com</p>
      </QuestBlock>
    </div>
  );
}
