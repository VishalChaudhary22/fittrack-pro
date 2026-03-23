+import { useState } from 'react';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ACTIVITY } from '../../data/constants';
import { gId, tod } from '../../utils/helpers';

export default function AuthModal() {
  const { users, setUsers, login } = useApp();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ name: '', email: '', password: '', age: '', gender: 'male', weight: '', height: '', activityLevel: 'moderate', workoutDays: '4' });
  const [err, setErr] = useState('');
  const [sp, setSp] = useState(false);
  const [gMsg, setGMsg] = useState('');
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const handleLogin = () => {
    const u = users.find(u => u.email === f.email && u.password === f.password);
    u ? login(u) : setErr('Invalid email or password');
  };

  const handleRegister = () => {
    if (!f.name || !f.email || !f.password) return setErr('Fill all required fields');
    if (users.find(u => u.email === f.email)) return setErr('Email already registered');
    const u = {
      id: gId(), name: f.name, email: f.email, password: f.password,
      age: parseInt(f.age) || 25, gender: f.gender,
      weight: parseFloat(f.weight) || 70, height: parseFloat(f.height) || 170,
      weightGoal: null, weightGoalStart: null, goalWeeks: null, goalSetDate: null,
      activityLevel: f.activityLevel || 'moderate', workoutDays: parseInt(f.workoutDays) || 4,
      isAdmin: false, activeSplitId: 'ppl', joinDate: tod(),
      avatar: f.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    };
    setUsers(p => [...p, u]);
    login(u);
  };

  return (
    <div className="mo" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(232,84,13,.18) 0%,rgba(0,0,0,.96) 65%)' }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ width: 54, height: 54, borderRadius: 14, background: 'var(--og)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
            <Dumbbell size={26} color="#fff" />
          </div>
          <div className="bb" style={{ fontSize: 28 }}>FITTRACK PRO</div>
          <div style={{ fontSize: 12, color: 'var(--t3)' }}>by Vishal Chaudhary</div>
        </div>
        <div className="md" style={{ maxHeight: '84vh' }}>
          <div style={{ display: 'flex', background: 'var(--bg)', borderRadius: 12, padding: 3, marginBottom: 18 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(''); }} style={{
                flex: 1, padding: '9px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: mode === m ? 'var(--o)' : 'transparent', color: mode === m ? '#fff' : 'var(--t2)',
                fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: 14, transition: 'all .2s',
              }}>
                {m === 'login' ? 'Log In' : 'Register'}
              </button>
            ))}
          </div>
          <button className="gb" onClick={() => { setGMsg('Google Sign-In requires VITE_GOOGLE_CLIENT_ID setup. Use email login for now.'); setTimeout(() => setGMsg(''), 4000); }}>
            <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>
          {gMsg && <div style={{ fontSize: 11, color: 'var(--o)', background: 'var(--o3)', padding: '8px 12px', borderRadius: 8, marginTop: 8, border: '1px solid rgba(232,84,13,.2)' }}>{gMsg}</div>}
          <div className="dv">or</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {mode === 'register' && <div><label>Full Name *</label><input placeholder="Vishal Chaudhary" value={f.name} onChange={sf('name')} /></div>}
            <div><label>Email *</label><input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} /></div>
            <div><label>Password *</label>
              <div style={{ position: 'relative' }}><input type={sp ? 'text' : 'password'} placeholder="••••••••" value={f.password} onChange={sf('password')} />
                <button onClick={() => setSp(!sp)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--t3)', cursor: 'pointer' }}>{sp ? <EyeOff size={14} /> : <Eye size={14} />}</button>
              </div>
            </div>
            {mode === 'register' && (<>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Age</label><input type="number" placeholder="25" value={f.age} onChange={sf('age')} /></div>
                <div><label>Gender</label><select value={f.gender} onChange={sf('gender')}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Weight (kg)</label><input type="number" placeholder="70" value={f.weight} onChange={sf('weight')} /></div>
                <div><label>Height (cm)</label><input type="number" placeholder="170" value={f.height} onChange={sf('height')} /></div>
              </div>
              <div><label>Activity Level</label><select value={f.activityLevel} onChange={sf('activityLevel')}>{Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
              <div><label>Workout Days/Week</label><select value={f.workoutDays} onChange={sf('workoutDays')}>{[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}/week</option>)}</select></div>
            </>)}
            {err && <div style={{ color: 'var(--o)', fontSize: 12, background: 'var(--o3)', padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(232,84,13,.2)' }}>{err}</div>}
            <button className="btn-p" style={{ width: '100%', padding: '13px', marginTop: 2 }} onClick={mode === 'login' ? handleLogin : handleRegister}>{mode === 'login' ? 'Log In →' : 'Create Account →'}</button>
            {mode === 'login' && <div style={{ fontSize: 11, color: 'var(--t3)', textAlign: 'center', padding: '7px', background: 'var(--bg)', borderRadius: 8 }}>Demo: <strong style={{ color: 'var(--o)' }}>vishal@fittrack.com</strong> / <strong style={{ color: 'var(--o)' }}>admin123</strong></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
