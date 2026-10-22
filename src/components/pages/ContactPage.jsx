import { useState } from 'react';
import { Mail, Dumbbell, Salad, TrendingUp, Trophy, Check } from 'lucide-react';
import { useScrollRestoration, clearScrollPosition } from '../../hooks/useScrollRestoration';
import { Screen, Sec, LedgerRow, Action, Note, TLink } from '../shared/Margin';

export default function ContactPage() {
  useScrollRestoration('/contact');
  const [f, setF] = useState({ name: '', email: '', phone: '', goal: '', service: 'workout', message: '' });
  const [sub, setSub] = useState(false);
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SVCS = [
    { id: 'workout', label: 'Custom Workout Plan', Icon: Dumbbell, price: '₹2,000' },
    { id: 'diet', label: 'Custom Diet Plan', Icon: Salad, price: '₹3,000' },
    { id: 'combo', label: 'Workout + Diet', Icon: TrendingUp, price: '₹4,500' },
    { id: 'coaching', label: 'Online Coaching', Icon: Trophy, price: 'Enquire' }
  ];
  const send = () => {
    if (!f.name || !f.email) return;
    const svc = SVCS.find(s => s.id === f.service);
    window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(`Kaaya Fit — ${svc.label} from ${f.name}`)}&body=${encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone || '—'}\nService: ${svc.label} (${svc.price})\nGoal: ${f.goal || '—'}\n\n${f.message}`)}`);
    clearScrollPosition('/contact');
    setSub(true);
  };

  if (sub) {
    return (
      <Screen kicker="Coaching" right={<span className="kicker" style={{ color: 'var(--bone)' }}>Sent</span>}>
        <Sec n="01" label="Message sent">
          <Note>
            <b>Inquiry sent.</b> Vishal will respond within 24 hours.
          </Note>
          <Action onClick={() => setSub(false)}>Send another</Action>
        </Sec>
        <div className="foot">
          <span>Kaaya Fit</span>
          <span>Coaching</span>
        </div>
      </Screen>
    );
  }

  return (
    <Screen kicker="Coaching" right={<span className="kicker" style={{ color: 'var(--bone)' }}>Work with Vishal</span>}>
      <Sec n="01" label="Plans">
        {SVCS.map(({ id, label, price }) => (
          <LedgerRow
            key={id}
            k={label}
            dim={f.service !== id}
            onClick={() => setF(p => ({ ...p, service: id }))}
            v={f.service === id ? <span className="word ok">Selected</span> : price}
          />
        ))}
      </Sec>

      <Sec n="02" label="Details">
        <div style={{ marginTop: 4 }}>
          <label className="kicker">Full name</label>
          <input className="field" placeholder="Your name" value={f.name} onChange={sf('name')} />
        </div>
        <div style={{ marginTop: 18 }}>
          <label className="kicker">Email</label>
          <input className="field" type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} />
        </div>
        <div style={{ marginTop: 18 }}>
          <label className="kicker">Phone / WhatsApp</label>
          <input className="field" placeholder="+91 98765 43210" value={f.phone} onChange={sf('phone')} />
        </div>
        <div style={{ marginTop: 18 }}>
          <label className="kicker">Primary goal</label>
          <select className="field" value={f.goal} onChange={sf('goal')}>
            <option value="">Select goal</option>
            <option>Weight Loss</option>
            <option>Muscle Building</option>
            <option>Athletic Performance</option>
            <option>General Fitness</option>
            <option>Body Recomposition</option>
            <option>Injury Recovery</option>
          </select>
        </div>
        <div style={{ marginTop: 18 }}>
          <label className="kicker">About you & goals</label>
          <textarea
            className="field"
            rows={4}
            placeholder="Current weight, training experience, dietary preferences, schedule..."
            value={f.message}
            onChange={sf('message')}
            style={{ resize: 'vertical', minHeight: 80 }}
          />
        </div>
        <Action onClick={send} disabled={!f.name || !f.email}>
          Send inquiry via email →
        </Action>
        <TLink
          onClick={() => window.open(`https://wa.me/919871673282?text=${encodeURIComponent("Hi Vishal, I am interested in your Kaaya Fit coaching plans.")}`)}
          style={{ marginTop: 14 }}
        >
          Chat on WhatsApp
        </TLink>
        <p className="body-dim" style={{ marginTop: 12 }}>
          Opens your email app pre-filled to vishalchaudhary28@gmail.com
        </p>
      </Sec>

      <div className="foot">
        <span>Kaaya Fit</span>
        <span>Coaching</span>
      </div>
    </Screen>
  );
}
