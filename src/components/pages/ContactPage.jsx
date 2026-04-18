import { useState } from 'react';
import { Mail, Dumbbell, Salad, TrendingUp, Trophy, Check } from 'lucide-react';
import { PageHeader } from '../shared/SharedComponents';
import { useScrollRestoration, clearScrollPosition } from '../../hooks/useScrollRestoration';

export default function ContactPage() {
  useScrollRestoration('/contact');
  const [f, setF] = useState({ name: '', email: '', phone: '', goal: '', service: 'workout', message: '' });
  const [sub, setSub] = useState(false);
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SVCS = [{ id: 'workout', label: 'Custom Workout Plan', Icon: Dumbbell, price: '₹2,000' }, { id: 'diet', label: 'Custom Diet Plan', Icon: Salad, price: '₹3,000' }, { id: 'combo', label: 'Workout + Diet', Icon: TrendingUp, price: '₹4,500' }, { id: 'coaching', label: 'Online Coaching', Icon: Trophy, price: 'Enquire' }];
  const send = () => { if (!f.name || !f.email) return; const svc = SVCS.find(s => s.id === f.service); window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(`FitTrack — ${svc.label} from ${f.name}`)}&body=${encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone || '—'}\nService: ${svc.label} (${svc.price})\nGoal: ${f.goal || '—'}\n\n${f.message}`)}`); clearScrollPosition('/contact'); setSub(true); };

  if (sub) return (<div className="pg-in" style={{ textAlign: 'center', padding: '80px 20px' }}><Mail size={48} color="var(--primary)" style={{ marginBottom: 16 }} /><div className="headline-lg" style={{ fontSize: 32, color: 'var(--primary)' }}>MESSAGE SENT!</div><div style={{ color: 'var(--on-surface-variant)', marginTop: 12, marginBottom: 32 }}>Vishal will respond within 24 hours.</div><button className="btn-p" style={{ padding: '14px 32px', borderRadius: 12 }} onClick={() => setSub(false)}>Send Another</button></div>);

  return (
    <div className="pg-in">
      <PageHeader title="Work With Me" sub="Custom plans crafted for your body & goals" />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 24 }}>
        {SVCS.map(({ id, label, Icon, price }) => (
          <div key={id} className="card stripe" style={{ padding: 24, cursor: 'pointer', transition: 'all .2s var(--ease-smooth)', border: 'none', background: f.service === id ? 'var(--primary)' : 'var(--surface-container-lowest)', boxShadow: f.service === id ? 'var(--shadow-md)' : 'none', position: 'relative', overflow: 'hidden' }}
            onClick={() => setF(p => ({ ...p, service: id }))} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            {f.service === id && <div style={{ position: 'absolute', top: -20, right: -20, width: 80, height: 80, background: 'rgba(255,255,255,.1)', borderRadius: '50%', pointerEvents: 'none' }} />}
            <div style={{ width: 44, height: 44, borderRadius: 12, background: f.service === id ? 'rgba(255,255,255,.2)' : 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}><Icon size={20} color={f.service === id ? '#fff' : 'var(--primary)'} /></div>
            <div className="headline-md" style={{ color: f.service === id ? '#fff' : 'var(--on-surface)', marginBottom: 6 }}>{label}</div>
            <div className="headline-lg" style={{ color: f.service === id ? '#fff' : 'var(--primary)' }}>{price}</div>
            {id === 'coaching' && <div style={{ fontSize: 11, color: f.service === id ? 'rgba(255,255,255,.7)' : 'var(--on-surface-dim)', marginTop: 6, fontWeight: 600 }}>Fill form below</div>}
            {f.service === id && <div style={{ marginTop: 12 }}><span style={{ fontSize: 9, fontWeight: 700, color: 'var(--primary)', background: '#fff', padding: '4px 8px', borderRadius: 6, textTransform: 'uppercase', letterSpacing: '.5px', display: 'inline-flex', alignItems: 'center', gap: 4 }}><Check size={10} /> Selected</span></div>}
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 24, border: 'none', background: 'var(--surface-container-low)' }}>
        <div className="headline-md" style={{ marginBottom: 6, color: 'var(--on-surface)' }}>Get In Touch</div>
        <div style={{ width: 40, height: 3, background: 'var(--primary)', borderRadius: 3, marginBottom: 24 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16, marginBottom: 16 }}>
          <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Full Name *</label><input placeholder="Your name" value={f.name} onChange={sf('name')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
          <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Email *</label><input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
          <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Phone / WhatsApp</label><input placeholder="+91 98765 43210" value={f.phone} onChange={sf('phone')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
          <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Primary Goal</label><select value={f.goal} onChange={sf('goal')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}><option value="">Select goal</option><option>Weight Loss</option><option>Muscle Building</option><option>Athletic Performance</option><option>General Fitness</option><option>Body Recomposition</option><option>Injury Recovery</option></select></div>
        </div>
        <div style={{ marginBottom: 24 }} className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>About you & your goals</label><textarea rows={4} placeholder="Current weight, training experience, dietary preferences, schedule..." value={f.message} onChange={sf('message')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14, resize: 'vertical' }} /></div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-p" style={{ flex: 1, padding: '14px 28px', fontSize: 15, borderRadius: 12, minWidth: 200 }} onClick={send} disabled={!f.name || !f.email}>Send Inquiry via Email →</button>
          <button className="btn-g" style={{ flex: 1, padding: '14px 28px', fontSize: 15, borderRadius: 12, minWidth: 200, background: '#25D366', color: '#fff', boxShadow: '0 8px 16px rgba(37, 211, 102, 0.1)' }} onClick={() => window.open(`https://wa.me/919871673282?text=${encodeURIComponent("Hi Vishal, I am interested in your FitTrack Pro coaching plans.")}`)}>Chat on WhatsApp</button>
        </div>
        <div style={{ marginTop: 12, fontSize: 11, color: 'var(--on-surface-dim)', textAlign: 'center', fontWeight: 600 }}>Opens your email app pre-filled to vishalchaudhary28@gmail.com</div>
      </div>
    </div>
  );
}
