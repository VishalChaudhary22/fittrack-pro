import { Mail, Check } from 'lucide-react';
import { useContact } from '../../../core/hooks/useContact';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Contact / Work With Me (V-6b) ─────────────────────────────
// Same logic core as V1 (useContact — form state + mailto compose), Volt
// presentation. The sent state is presentation, so it lives here (and in
// V1's page), exactly as before the extraction.

const inputStyle = {
  width: '100%', padding: '12px 14px', borderRadius: 12, fontSize: 14,
  background: 'var(--v-canvas)', color: 'var(--v-ink)',
  border: '2px solid var(--v-edge-quiet)', outline: 'none', fontFamily: 'inherit', fontWeight: 600,
};
const labelStyle = {
  display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10.5,
  letterSpacing: '0.14em', color: 'var(--v-dim)', marginBottom: 7, textTransform: 'uppercase',
};

export default function VoltContactPage() {
  const { SVCS, f, send, setF, setSub, sf, sub } = useContact();

  if (sub) {
    return (
      <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '70px 20px', gap: 0 }}>
        <Mail size={48} color="var(--v-volt-text)" style={{ marginBottom: 16 }} />
        <div className="v-num" style={{ fontSize: 34, color: 'var(--v-volt-text)', textTransform: 'uppercase' }}>Message Sent!</div>
        <p style={{ color: 'var(--v-dim)', marginTop: 12, marginBottom: 30, fontSize: 14.5 }}>Vishal will respond within 24 hours.</p>
        <VoltPill onClick={() => setSub(false)}>Send Another</VoltPill>
      </div>
    );
  }

  return (
    <div className="v-screen" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <header className="v-rise">
        <VoltLabel volt>Work With Me — custom plans for your body & goals</VoltLabel>
        <h1 className="v-num" style={{ fontSize: 'clamp(1.9rem, 7vw, 2.8rem)', lineHeight: 1, margin: '8px 0 0', textTransform: 'uppercase' }}>Work with me</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14 }}>
        {SVCS.map(({ id, label, Icon, price }) => {
          const selected = f.service === id;
          return (
            <button
              key={id}
              type="button"
              className="v-press"
              onClick={() => setF(p => ({ ...p, service: id }))}
              style={{
                textAlign: 'left', cursor: 'pointer', padding: 20, borderRadius: 20,
                background: selected ? 'var(--v-volt)' : 'var(--v-panel)',
                border: '2.5px solid var(--v-edge)',
                boxShadow: selected ? '5px 5px 0 var(--v-shadow-hero)' : '5px 5px 0 var(--v-shadow)',
                color: selected ? '#141416' : 'var(--v-ink)',
              }}
            >
              <span style={{ width: 44, height: 44, borderRadius: 12, background: selected ? 'rgba(20,20,22,0.12)' : 'var(--v-canvas)', border: '2px solid var(--v-edge)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={20} color={selected ? '#141416' : 'var(--v-volt-text)'} />
              </span>
              <span className="v-num" style={{ display: 'block', fontSize: 16.5 }}>{label}</span>
              <span className="v-num" style={{ display: 'block', fontSize: 24, marginTop: 5, color: selected ? '#141416' : 'var(--v-volt-text)' }}>{price}</span>
              {id === 'coaching' && <span style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: selected ? 'rgba(20,20,22,0.65)' : 'var(--v-dim)', marginTop: 6 }}>Fill form below</span>}
              {selected && (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12, fontSize: 9.5, fontWeight: 800, color: 'var(--v-volt-text)', background: 'var(--v-panel)', padding: '4px 9px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '0.06em', border: '2px solid var(--v-edge)' }}>
                  <Check size={10} /> Selected
                </span>
              )}
            </button>
          );
        })}
      </div>

      <VoltBlock>
        <VoltLabel volt>Get In Touch</VoltLabel>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 14, margin: '16px 0 14px' }}>
          <div>
            <label style={labelStyle}>Full Name *</label>
            <input placeholder="Your name" value={f.name} onChange={sf('name')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Phone / WhatsApp</label>
            <input placeholder="+91 98765 43210" value={f.phone} onChange={sf('phone')} style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Primary Goal</label>
            <select value={f.goal} onChange={sf('goal')} style={inputStyle}>
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
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>About you & your goals</label>
          <textarea rows={4} placeholder="Current weight, training experience, dietary preferences, schedule..." value={f.message} onChange={sf('message')} style={{ ...inputStyle, resize: 'vertical' }} />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <VoltPill onClick={send} disabled={!f.name || !f.email} style={{ flex: 1, minWidth: 200 }}>Send Inquiry via Email →</VoltPill>
          <VoltPill
            onClick={() => window.open(`https://wa.me/919871673282?text=${encodeURIComponent("Hi Vishal, I am interested in your Kaaya Fit coaching plans.")}`)}
            style={{ flex: 1, minWidth: 200, background: '#25D366', color: '#fff' }}
          >
            Chat on WhatsApp
          </VoltPill>
        </div>
        <p style={{ marginTop: 12, fontSize: 11.5, color: 'var(--v-dim)', textAlign: 'center', fontWeight: 600 }}>Opens your email app pre-filled to vishalchaudhary28@gmail.com</p>
      </VoltBlock>
    </div>
  );
}
