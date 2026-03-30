import { useState } from 'react';
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
      avatarType: 'preset', avatarUrl: null,
    };
    setUsers(p => [...p, u]);
    login(u);
  };

  return (
    <div className="mo" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(232,84,13,.15) 0%,var(--surface-container-lowest) 70%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), #FF9A5C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(232,84,13,.3)' }}>
            <Dumbbell size={32} color="#fff" />
          </div>
          <div className="headline-lg" style={{ fontSize: 32, color: 'var(--on-surface)' }}>FITTRACK PRO</div>
          <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, letterSpacing: '.5px' }}>by Vishal Chaudhary</div>
        </div>
        <div className="md" style={{ maxHeight: '84vh', background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container-highest)', boxShadow: 'var(--shadow-lg)', padding: 32, borderRadius: 24 }}>
          <div style={{ display: 'flex', background: 'var(--surface-container-highest)', borderRadius: 14, padding: 4, marginBottom: 24 }}>
            {['login', 'register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(''); }} style={{
                flex: 1, padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: mode === m ? 'var(--primary)' : 'transparent', color: mode === m ? 'var(--on-primary)' : 'var(--on-surface-variant)',
                fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.5px', transition: 'all .2s var(--ease-smooth)',
              }}>
                {m === 'login' ? 'Log In' : 'Register'}
              </button>
            ))}
          </div>
          <button className="gb" onClick={() => { setGMsg('Google Sign-In requires VITE_GOOGLE_CLIENT_ID setup. Use email login for now.'); setTimeout(() => setGMsg(''), 4000); }} style={{ width: '100%', padding: '12px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container)'} onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container-highest)'}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
            Continue with Google
          </button>
          {gMsg && <div style={{ fontSize: 12, color: 'var(--on-primary-container)', background: 'var(--primary-container)', padding: '10px 14px', borderRadius: 10, marginTop: 12, fontWeight: 600 }}>{gMsg}</div>}
          <div className="dv" style={{ margin: '24px 0', opacity: 0.5 }}>or email login</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {mode === 'register' && <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Full Name *</label><input placeholder="Vishal Chaudhary" value={f.name} onChange={sf('name')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>}
            <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Email *</label><input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
            <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Password *</label>
              <div style={{ position: 'relative' }}><input type={sp ? 'text' : 'password'} placeholder="••••••••" value={f.password} onChange={sf('password')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
                <button onClick={() => setSp(!sp)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--on-surface-dim)', cursor: 'pointer' }}>{sp ? <EyeOff size={16} /> : <Eye size={16} />}</button>
              </div>
            </div>
            {mode === 'register' && (<>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
                <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Age</label><input type="number" placeholder="25" value={f.age} onChange={sf('age')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
                <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Gender</label><select value={f.gender} onChange={sf('gender')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 12 }}>
                <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Weight (kg)</label><input type="number" placeholder="70" value={f.weight} onChange={sf('weight')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
                <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Height (cm)</label><input type="number" placeholder="170" value={f.height} onChange={sf('height')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} /></div>
              </div>
              <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Activity Level</label><select value={f.activityLevel} onChange={sf('activityLevel')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>{Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></div>
              <div className="input-group"><label style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 6, display: 'block' }}>Workout Days/Week</label><select value={f.workoutDays} onChange={sf('workoutDays')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>{[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} day{d > 1 ? 's' : ''}/week</option>)}</select></div>
            </>)}
            {err && <div style={{ color: 'var(--on-error-container)', fontSize: 13, background: 'var(--error-container)', padding: '10px 14px', borderRadius: 10, fontWeight: 600 }}>{err}</div>}
            <button className="btn-p" style={{ width: '100%', padding: '14px', marginTop: 8, borderRadius: 12, fontSize: 15 }} onClick={mode === 'login' ? handleLogin : handleRegister}>{mode === 'login' ? 'Log In →' : 'Create Account →'}</button>
            {mode === 'login' && <div style={{ fontSize: 12, color: 'var(--on-surface-dim)', textAlign: 'center', padding: '10px', background: 'var(--surface-container-highest)', borderRadius: 10, fontWeight: 600 }}>Demo: <strong style={{ color: 'var(--primary)' }}>vishal@fittrack.com</strong> / <strong style={{ color: 'var(--primary)' }}>admin123</strong></div>}
          </div>
        </div>
      </div>
    </div>
  );
}
