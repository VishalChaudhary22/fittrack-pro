import { useState } from 'react';
import { Mail, Dumbbell, Salad, TrendingUp, Trophy, Check } from 'lucide-react';
import { PageHeader } from '../shared/SharedComponents';

export default function ContactPage() {
  const [f, setF] = useState({ name: '', email: '', phone: '', goal: '', service: 'workout', message: '' });
  const [sub, setSub] = useState(false);
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SVCS = [{ id: 'workout', label: 'Custom Workout Plan', Icon: Dumbbell, price: '₹2,000' }, { id: 'diet', label: 'Custom Diet Plan', Icon: Salad, price: '₹3,000' }, { id: 'combo', label: 'Workout + Diet', Icon: TrendingUp, price: '₹4,500' }, { id: 'coaching', label: 'Online Coaching', Icon: Trophy, price: 'Enquire' }];
  const send = () => { if (!f.name || !f.email) return; const svc = SVCS.find(s => s.id === f.service); window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(`FitTrack — ${svc.label} from ${f.name}`)}&body=${encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone || '—'}\nService: ${svc.label} (${svc.price})\nGoal: ${f.goal || '—'}\n\n${f.message}`)}`); setSub(true); };

  if (sub) return (<div className="pg-in" style={{ textAlign: 'center', padding: '80px 20px' }}><Mail size={48} color="var(--o)" style={{ marginBottom: 14 }} /><div className="bb" style={{ fontSize: 34, color: 'var(--o)' }}>MESSAGE SENT!</div><div style={{ color: 'var(--t2)', marginTop: 8, marginBottom: 28 }}>Vishal will respond within 24 hours.</div><button className="btn-p" style={{ padding: '12px 26px' }} onClick={() => setSub(false)}>Send Another</button></div>);

  return (
    <div className="pg-in">
      <PageHeader title="Work With Me" sub="Custom plans crafted for your body & goals" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 18 }} className="g2">
        {SVCS.map(({ id, label, Icon, price }) => (
          <div key={id} className="card" style={{ padding: 18, cursor: 'pointer', transition: 'all .2s', border: `1px solid ${f.service === id ? 'var(--o)' : 'var(--bd)'}`, background: f.service === id ? 'var(--o2)' : 'var(--c1)' }}
            onClick={() => setF(p => ({ ...p, service: id }))} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--o)'} onMouseLeave={e => e.currentTarget.style.borderColor = f.service === id ? 'var(--o)' : 'var(--bd)'}>
            <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--o2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}><Icon size={15} color="var(--o)" /></div>
            <div className="bb" style={{ fontSize: 16, letterSpacing: '1px', marginBottom: 4 }}>{label}</div>
            <div className="bb" style={{ fontSize: 22, color: 'var(--o)' }}>{price}</div>
            {id === 'coaching' && <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 4 }}>Fill form below</div>}
            {f.service === id && <div style={{ marginTop: 8 }}><span className="tag" style={{ fontSize: 8 }}><Check size={8} /> Selected</span></div>}
          </div>
        ))}
      </div>
      <div className="card" style={{ padding: 22 }}>
        <div className="bb" style={{ fontSize: 22, marginBottom: 4 }}>Get In Touch</div>
        <div className="abar" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }} className="g2">
          <div><label>Full Name *</label><input placeholder="Your name" value={f.name} onChange={sf('name')} /></div>
          <div><label>Email *</label><input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} /></div>
          <div><label>Phone / WhatsApp</label><input placeholder="+91 98765 43210" value={f.phone} onChange={sf('phone')} /></div>
          <div><label>Primary Goal</label><select value={f.goal} onChange={sf('goal')}><option value="">Select goal</option><option>Weight Loss</option><option>Muscle Building</option><option>Athletic Performance</option><option>General Fitness</option><option>Body Recomposition</option><option>Injury Recovery</option></select></div>
        </div>
        <div style={{ marginBottom: 14 }}><label>About you & your goals</label><textarea rows={4} placeholder="Current weight, training experience, dietary preferences, schedule..." value={f.message} onChange={sf('message')} style={{ resize: 'vertical' }} /></div>
        <button className="btn-p" style={{ padding: '13px 26px', fontSize: 15 }} onClick={send} disabled={!f.name || !f.email}>Send Inquiry →</button>
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--t3)' }}>Opens your email app pre-filled to vishalchaudhary28@gmail.com</div>
      </div>
    </div>
  );
}
