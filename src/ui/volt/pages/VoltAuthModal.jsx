import { useState } from 'react';
import { Eye, EyeOff, Mail, KeyRound, Zap } from 'lucide-react';
import { supabase } from '../../../lib/supabaseClient';
import { ACTIVITY } from '../../../data/constants';
import { VoltBlock, VoltPill, VoltLabel } from '../primitives';

// ─── Kaaya Volt · Auth (V-8) ──────────────────────────────────────────────────
// Same brain as V1's AuthModal — every handler, validation and Supabase call
// is identical (sign-up profile insert, Google OAuth, demo account, password
// reset, verify + forgot-sent modes). Only the presentation is Volt.
// Rendered by App when the resolved skin is Volt (the default), so a fresh
// install meets Volt first; a stored Original preference gets V1 auth.

const inputStyle = {
  width: '100%', padding: '13px 16px', borderRadius: 12,
  background: 'var(--v-canvas)', border: '2.5px solid var(--v-edge)',
  color: 'var(--v-ink)', fontWeight: 600, fontSize: 14, outline: 'none',
};

export default function VoltAuthModal() {
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify' | 'forgot-sent'
  const [f, setF] = useState({ name: '', email: '', password: '', age: '', gender: 'male', weight: '', height: '', activityLevel: 'moderate', workoutDays: '4' });
  const [authError, setAuthError] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [sp, setSp] = useState(false); // show password

  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  // UX-12.2: Password strength meter
  const strength = !f.password ? 0 : f.password.length < 6 ? 1 : f.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', '#FF5C38', '#F5C542', '#7FE0A8'];
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
      localStorage.setItem(`fittrack_onboarding_pending:${data.user.id}`, 'true');
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
      password: 'Kaaya2026!',
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

  const shell = (children) => (
    <div style={{ minHeight: '100dvh', background: 'var(--v-canvas)', color: 'var(--v-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 18px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 430 }}>{children}</div>
    </div>
  );

  if (mode === 'verify') {
    return shell(
      <VoltBlock hero style={{ padding: '36px 26px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><Mail size={42} color="var(--v-volt-text)" /></div>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 10 }}>Check your inbox</div>
        <div style={{ fontSize: 13.5, color: 'var(--v-dim)', marginBottom: 24, lineHeight: 1.6 }}>
          We sent a verification link to <strong style={{ color: 'var(--v-volt-text)' }}>{f.email}</strong>.
          Click it to activate your account.
        </div>
        <VoltPill ghost style={{ width: '100%' }} onClick={() => setMode('login')}>
          Back to Sign In
        </VoltPill>
        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--v-dim)' }}>
          Didn't receive it? Check your spam folder, or{' '}
          <button onClick={handleRegister} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--v-volt-text)', cursor: 'pointer', fontSize: 12, fontWeight: 700, padding: 0 }}>
            resend email
          </button>
        </div>
      </VoltBlock>
    );
  }

  if (mode === 'forgot-sent') {
    return shell(
      <VoltBlock hero style={{ padding: '36px 26px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><KeyRound size={42} color="var(--v-volt-text)" /></div>
        <div style={{ fontSize: 21, fontWeight: 800, letterSpacing: '-0.01em', marginBottom: 10 }}>Reset link sent</div>
        <div style={{ fontSize: 13.5, color: 'var(--v-dim)', marginBottom: 24, lineHeight: 1.6 }}>
          We sent password reset instructions to <strong style={{ color: 'var(--v-volt-text)' }}>{f.email}</strong>.
        </div>
        <VoltPill ghost style={{ width: '100%' }} onClick={() => setMode('login')}>
          Back to Sign In
        </VoltPill>
      </VoltBlock>
    );
  }

  return shell(
    <>
      {/* Header */}
      <div className="v-rise" style={{ textAlign: 'center', marginBottom: 22 }}>
        <img
          src="/kaaya-icon-volt.svg"
          alt="Kaaya Fit Logo"
          style={{ width: 66, height: 66, borderRadius: 18, margin: '0 auto 14px', display: 'block', border: '2.5px solid var(--v-edge)', boxShadow: '5px 5px 0 var(--v-shadow-hero)' }}
        />
        <div className="v-num" style={{ fontSize: 30, lineHeight: 1, textTransform: 'uppercase' }}>
          Kaaya Fit
        </div>
        <div style={{ fontSize: 13, color: 'var(--v-volt-text)', fontWeight: 800, letterSpacing: '0.06em', marginTop: 6, textTransform: 'uppercase' }}>
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </div>
      </div>

      <VoltBlock hero className="v-rise" style={{ padding: '24px 24px 26px', maxHeight: '76dvh', overflowY: 'auto' }}>
        {/* Main Google CTA */}
        <VoltPill ghost onClick={handleGoogleSignIn} disabled={loading} style={{ width: '100%', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.2 18.1 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/><path fill="#FBBC05" d="M11.1 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.6-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-11-3.7-12.9-9.2l-8.6 6.1C7 42.6 14.8 48 24 48z"/></svg>
          Continue with Google
        </VoltPill>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0' }}>
          <div style={{ flex: 1, height: 2, background: 'var(--v-edge-quiet)' }} />
          <span style={{ fontSize: 10.5, color: 'var(--v-dim)', fontWeight: 800, letterSpacing: '0.1em' }}>OR EMAIL</span>
          <div style={{ flex: 1, height: 2, background: 'var(--v-edge-quiet)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
          {mode === 'register' && (
            <div>
              <input placeholder="Full Name *" value={f.name} onChange={sf('name')} style={inputStyle} />
            </div>
          )}

          <div>
            <input type="email" placeholder="Email address *" value={f.email} onChange={sf('email')} onBlur={validateEmail} style={inputStyle} />
            {emailErr && <div style={{ fontSize: 11.5, color: 'var(--v-coral-text)', fontWeight: 600, marginTop: 5 }}>{emailErr}</div>}
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <input type={sp ? 'text' : 'password'} placeholder="Password (min 8 chars) *" value={f.password} onChange={sf('password')} style={{ ...inputStyle, paddingRight: 48 }} />
              <button onClick={() => setSp(!sp)} aria-label={sp ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', padding: 8, display: 'flex' }}>
                {sp ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
            {/* Strength meter for register */}
            {mode === 'register' && f.password && (
              <div style={{ display: 'flex', gap: 4, marginTop: 7, alignItems: 'center' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColors[strength] : 'var(--v-edge-quiet)', transition: 'background .2s' }} />
                ))}
                <span style={{ fontSize: 10, color: strengthColors[strength], fontWeight: 800, marginLeft: 6, minWidth: 40, textAlign: 'right' }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          {mode === 'register' && (<>
            <div style={{ display: 'flex', gap: 8 }}>
              {['male', 'female', 'other'].map(g => {
                const active = f.gender === g;
                return (
                  <button key={g} onClick={() => setF(p => ({ ...p, gender: g }))} className="v-press" style={{ flex: 1, padding: '11px', borderRadius: 999, border: '2.5px solid var(--v-edge)', cursor: 'pointer', background: active ? 'var(--v-volt)' : 'var(--v-canvas)', color: active ? '#141416' : 'var(--v-ink)', fontSize: 12.5, fontWeight: 700, textTransform: 'capitalize', minHeight: 44 }}>
                    {g}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input type="number" placeholder="Age" value={f.age} onChange={sf('age')} style={inputStyle} />
              <input type="number" placeholder="Weight (kg)" value={f.weight} onChange={sf('weight')} style={inputStyle} />
              <input type="number" placeholder="Height (cm)" value={f.height} onChange={sf('height')} style={inputStyle} />
              <select value={f.activityLevel} onChange={sf('activityLevel')} style={inputStyle}>
                {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <select value={f.workoutDays} onChange={sf('workoutDays')} style={inputStyle}>
              {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} days/week</option>)}
            </select>
          </>)}

          {authError && (
            <div style={{ fontSize: 12.5, color: 'var(--v-coral-text)', padding: '11px 14px', border: '2px solid var(--v-coral)', borderRadius: 12, fontWeight: 600 }}>
              {authError}
            </div>
          )}

          {/* Try demo button */}
          {mode === 'login' && (
            <VoltPill ghost disabled={loading} style={{ width: '100%' }} onClick={handleDemo}>
              <Zap size={14} /> Try Demo Account
            </VoltPill>
          )}

          <VoltPill disabled={loading} style={{ width: '100%', minHeight: 54, fontSize: 15 }} onClick={mode === 'login' ? handleLogin : handleRegister}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In →' : 'Create Account →'}
          </VoltPill>

          {mode === 'login' && (
            <div style={{ textAlign: 'center', marginTop: -2 }}>
              <button onClick={handleForgotPassword} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--v-dim)', fontSize: 12.5, cursor: 'pointer', textDecoration: 'underline', padding: 6 }}>
                Forgot Password?
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 8, fontSize: 13, color: 'var(--v-dim)' }}>
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => { setMode('register'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--v-volt-text)', fontWeight: 800, cursor: 'pointer', fontSize: 13, padding: 0 }}>Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setMode('login'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--v-volt-text)', fontWeight: 800, cursor: 'pointer', fontSize: 13, padding: 0 }}>Sign In</button></>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <VoltLabel>Kaaya Volt · the new look</VoltLabel>
          </div>
        </div>
      </VoltBlock>
    </>
  );
}
