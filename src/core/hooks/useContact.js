// Extracted from the V1 ContactPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed. (The sent-state early return is
// presentation and stays in each skin's page.)
import { useState } from 'react';
import { Dumbbell, Salad, TrendingUp, Trophy } from 'lucide-react';
import { useScrollRestoration, clearScrollPosition } from './useScrollRestoration';

export function useContact() {
  useScrollRestoration('/contact');
  const [f, setF] = useState({ name: '', email: '', phone: '', goal: '', service: 'workout', message: '' });
  const [sub, setSub] = useState(false);
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));
  const SVCS = [{ id: 'workout', label: 'Custom Workout Plan', Icon: Dumbbell, price: '₹2,000' }, { id: 'diet', label: 'Custom Diet Plan', Icon: Salad, price: '₹3,000' }, { id: 'combo', label: 'Workout + Diet', Icon: TrendingUp, price: '₹4,500' }, { id: 'coaching', label: 'Online Coaching', Icon: Trophy, price: 'Enquire' }];
  const send = () => { if (!f.name || !f.email) return; const svc = SVCS.find(s => s.id === f.service); window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(`Kaaya Fit — ${svc.label} from ${f.name}`)}&body=${encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone || '—'}\nService: ${svc.label} (${svc.price})\nGoal: ${f.goal || '—'}\n\n${f.message}`)}`); clearScrollPosition('/contact'); setSub(true); };

  return { SVCS, f, send, setF, setSub, sf, sub };
}
