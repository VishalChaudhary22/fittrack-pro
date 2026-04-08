import { useState } from 'react';
import { Dumbbell, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { ACTIVITY } from '../../data/constants';

export default function AuthModal() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify' | 'forgot-sent'
  const [f, setF] = useState({ name: '', email: '', password: '', age: '', gender: 'male', weight: '', height: '', activityLevel: 'moderate', workoutDays: '4' });
  const [authError, setAuthError] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [sp, setSp] = useState(false); // show password
  
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  // UX-12.2: Password strength meter
  const strength = !f.password ? 0 : f.password.length < 6 ? 1 : f.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', '#FF6B6B', '#FFE66D', '#6BCB77'];
  const strengthLabels = ['', 'Weak', 'OK', 'Strong'];

  const validateEmail = () => {
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
      setEmailErr('Please enter a valid email address');
    } else {
      setEmailErr('');
    }
  };

  const handleRegister = async () => {
    if (!f.name || !f.email || !f.password) {
      return setAuthError('All fields required');
    }
    if (f.password.length < 8) {
      return setAuthError('Password must be at least 8 characters');
    }
    if (emailErr) {
      return setAuthError(emailErr);
    }
    setLoading(true);
    setAuthError('');

    const { data, error } = await supabase.auth.signUp({
      email: f.email,
      password: f.password,
      options: {
        data: {
          name: f.name,
          gender: f.gender || 'male',
        },
        emailRedirectTo: window.location.origin,
      },
    });

    if (error) {
      setAuthError(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        name: f.name,
        gender: f.gender || 'male',
        age: parseInt(f.age) || null,
        height: parseFloat(f.height) || null,
        weight: parseFloat(f.weight) || null,
        activity: f.activityLevel || 'moderate',
        workout_days: parseInt(f.workoutDays) || 4,
        avatar: f.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      });
    }

    setLoading(false);
    if (!data.session) {
      setMode('verify');
    }
  };

  const handleLogin = async () => {
    if (!f.email || !f.password) return setAuthError('Email and password required');
    setLoading(true);
    setAuthError('');

    const { error } = await supabase.auth.signInWithPassword({
      email: f.email,
      password: f.password,
    });

    if (error) {
      const msg = error.message.includes('Invalid login')
        ? 'Incorrect email or password'
        : error.message;
      setAuthError(msg);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    if (error) {
      setAuthError(error.message);
      setLoading(false);
    }
  };

  const handleDemo = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: 'demo@fittrackpro.in',
      password: 'FitTrack2026!',
    });
    if (error) setAuthError('Demo account unavailable — try registering');
    setLoading(false);
  };

  const handleForgotPassword = async () => {
    if (!f.email) return setAuthError('Enter your email first');
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(f.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (!error) setMode('forgot-sent');
    else setAuthError(error.message);
    setLoading(false);
  };

  if (mode === 'verify') {
    return (
      <div className="mo" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(232,84,13,.15) 0%,var(--surface-container-lowest) 70%)' }}>
        <div className="md" style={{ maxWidth: 420, width: '100%', padding: '40px 28px', textAlign: 'center', background: 'var(--surface-container-lowest)', borderRadius: 24, border: '1px solid var(--surface-container-highest)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📧</div>
          <div className="headline-md" style={{ marginBottom: 12 }}>Check your inbox</div>
          <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 24, lineHeight: 1.6 }}>
            We sent a verification link to <strong style={{ color: 'var(--primary)' }}>{f.email}</strong>.
            Click it to activate your account.
          </div>
          <button className="btn-g" style={{ width: '100%', padding: '12px', fontSize: 14 }} onClick={() => setMode('login')}>
            Back to Sign In
          </button>
          <div style={{ marginTop: 12, fontSize: 12, color: 'var(--on-surface-dim)' }}>
            Didn't receive it? Check your spam folder, or{' '}
            <button onClick={handleRegister} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: 12 }}>
              resend email
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'forgot-sent') {
    return (
      <div className="mo" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(232,84,13,.15) 0%,var(--surface-container-lowest) 70%)' }}>
        <div className="md" style={{ maxWidth: 420, width: '100%', padding: '40px 28px', textAlign: 'center', background: 'var(--surface-container-lowest)', borderRadius: 24, border: '1px solid var(--surface-container-highest)', boxShadow: 'var(--shadow-lg)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔑</div>
          <div className="headline-md" style={{ marginBottom: 12 }}>Reset link sent</div>
          <div style={{ fontSize: 13, color: 'var(--on-surface-variant)', marginBottom: 24, lineHeight: 1.6 }}>
            We sent password reset instructions to <strong style={{ color: 'var(--primary)' }}>{f.email}</strong>.
          </div>
          <button className="btn-g" style={{ width: '100%', padding: '12px', fontSize: 14 }} onClick={() => setMode('login')}>
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mo" style={{ background: 'radial-gradient(ellipse at 50% 100%,rgba(232,84,13,.15) 0%,var(--surface-container-lowest) 70%)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'linear-gradient(135deg, var(--primary), #FF9A5C)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 8px 24px rgba(232,84,13,.3)' }}>
            <Dumbbell size={32} color="#fff" />
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 26, letterSpacing: '-0.04em', color: 'var(--on-surface)', textTransform: 'uppercase', marginBottom: 4 }}>
            FitTrack Pro
          </div>
          <div style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 700, letterSpacing: '.5px' }}>
             {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </div>
        </div>

        <div className="md" style={{ maxHeight: '84vh', background: 'var(--surface-container-lowest)', border: '1px solid var(--surface-container-highest)', boxShadow: 'var(--shadow-lg)', padding: '24px 28px', borderRadius: 24, overflowY: 'auto' }}>
          
          {/* Main Google CTA */}
          <button onClick={handleGoogleSignIn} disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 14, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background .2s' }} onMouseOver={e => e.currentTarget.style.background = 'var(--surface-container)'} onMouseOut={e => e.currentTarget.style.background = 'var(--surface-container-highest)'}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.2 18.1 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/><path fill="#FBBC05" d="M11.1 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.6-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-11-3.7-12.9-9.2l-8.6 6.1C7 42.6 14.8 48 24 48z"/></svg>
            Continue with Google
          </button>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'var(--surface-container-highest)' }} />
            <span style={{ fontSize: 11, color: 'var(--on-surface-dim)', fontWeight: 600 }}>OR EMAIL</span>
            <div style={{ flex: 1, height: 1, background: 'var(--surface-container-highest)' }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {mode === 'register' && (
              <div className="input-group">
                <input placeholder="Full Name *" value={f.name} onChange={sf('name')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
              </div>
            )}
            
            <div className="input-group">
              <input type="email" placeholder="Email address *" value={f.email} onChange={sf('email')} onBlur={validateEmail} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
              {emailErr && <div style={{ fontSize: 11, color: '#FF6B6B', marginTop: 4 }}>{emailErr}</div>}
            </div>

            <div className="input-group">
              <div style={{ position: 'relative' }}>
                <input type={sp ? 'text' : 'password'} placeholder="Password (min 8 chars) *" value={f.password} onChange={sf('password')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
                <button onClick={() => setSp(!sp)} style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--on-surface-dim)', cursor: 'pointer' }}>
                  {sp ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Strength meter for register */}
              {mode === 'register' && f.password && (
                <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                  {[1, 2, 3].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= strength ? strengthColors[strength] : 'var(--surface-container-highest)', transition: 'background .2s' }} />
                  ))}
                  <span style={{ fontSize: 10, color: strengthColors[strength], fontWeight: 700, marginLeft: 6, minWidth: 40, textAlign: 'right' }}>
                    {strengthLabels[strength]}
                  </span>
                </div>
              )}
            </div>

            {mode === 'register' && (<>
              <div style={{ display: 'flex', gap: 8 }}>
                {['male', 'female', 'other'].map(g => (
                  <button key={g} onClick={() => setF(p => ({ ...p, gender: g }))} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', cursor: 'pointer', background: f.gender === g ? 'var(--primary-container)' : 'var(--surface-container-highest)', color: f.gender === g ? '#fff' : 'var(--on-surface-variant)', fontSize: 12, fontWeight: 700, textTransform: 'capitalize', transition: 'all .2s' }}>
                    {g}
                  </button>
                ))}
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <input type="number" placeholder="Age" value={f.age} onChange={sf('age')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
                <input type="number" placeholder="Weight (kg)" value={f.weight} onChange={sf('weight')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
                <input type="number" placeholder="Height (cm)" value={f.height} onChange={sf('height')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }} />
                <select value={f.activityLevel} onChange={sf('activityLevel')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>
                  {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <select value={f.workoutDays} onChange={sf('workoutDays')} style={{ width: '100%', padding: '12px 16px', borderRadius: 12, background: 'var(--surface-container-highest)', border: 'none', color: 'var(--on-surface)', fontWeight: 600, fontSize: 14 }}>
                {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} days/week</option>)}
              </select>
            </>)}

            {authError && (
              <div style={{ fontSize: 12, color: 'var(--error)', padding: '10px 14px', background: 'rgba(255,59,48,0.08)', borderRadius: 10, fontWeight: 600 }}>
                {authError}
              </div>
            )}

            {/* Try demo button */}
            {mode === 'login' && (
              <button className="btn-g" disabled={loading} style={{ width: '100%', padding: '11px', borderRadius: 12, fontSize: 13, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontWeight: 700 }} onClick={handleDemo}>
                ⚡ Try Demo Account
              </button>
            )}

            <button className="btn-p" disabled={loading} style={{ width: '100%', padding: '14px', borderRadius: 12, fontSize: 15, position: 'relative' }} onClick={mode === 'login' ? handleLogin : handleRegister}>
              {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
            </button>
            
            {mode === 'login' && (
              <div style={{ textAlign: 'center', marginTop: -4 }}>
                <button onClick={handleForgotPassword} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--on-surface-dim)', fontSize: 12, cursor: 'pointer', textDecoration: 'underline' }}>
                  Forgot Password?
                </button>
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: 'var(--on-surface-variant)' }}>
              {mode === 'login' ? (
                <>Don't have an account? <button onClick={() => { setMode('register'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign Up</button></>
              ) : (
                <>Already have an account? <button onClick={() => { setMode('login'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Sign In</button></>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
