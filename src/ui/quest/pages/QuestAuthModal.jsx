import { useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { ACTIVITY } from '../../../data/constants';
import { QuestBlock, QuestBtn, QuestLabel } from '../primitives';
import PixelSprite from '../PixelSprite';

// ─── Kaaya Quest · Auth — the title screen (plan §7.6) ───────────────────────
// Same brain as V1/Volt's AuthModal — every handler, validation and
// Supabase call is identical (sign-up profile insert, Google OAuth, demo
// account, password reset, verify + forgot-sent modes). Presentation is
// the arcade title screen: pixel K, KAAYA QUEST, a blinking PRESS START
// that opens the form, and the demo entry labelled FREE PLAY. Rendered by
// App when the resolved skin is Quest (a stored Quest preference).

const qSelect = {
  width: '100%', minHeight: 50, padding: '8px 12px', background: 'var(--q-slot)',
  border: '3px solid var(--q-border)', color: 'var(--q-ink)',
  fontFamily: "'VT323', monospace", fontSize: 19, boxSizing: 'border-box',
};

export default function QuestAuthModal() {
  const [started, setStarted] = useState(false);
  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'verify' | 'forgot-sent'
  const [f, setF] = useState({ name: '', email: '', password: '', age: '', gender: 'male', weight: '', height: '', activityLevel: 'moderate', workoutDays: '4' });
  const [authError, setAuthError] = useState('');
  const [emailErr, setEmailErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [sp, setSp] = useState(false); // show password

  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  // Password strength meter (same thresholds as V1/Volt)
  const strength = !f.password ? 0 : f.password.length < 6 ? 1 : f.password.length < 10 ? 2 : 3;
  const strengthColors = ['transparent', 'var(--q-red)', 'var(--q-gold)', 'var(--q-volt)'];
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
    <div className="q-screen" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '28px 18px', overflowY: 'auto' }}>
      <div style={{ width: '100%', maxWidth: 430 }}>{children}</div>
    </div>
  );

  if (mode === 'verify') {
    return shell(
      <QuestBlock style={{ padding: '34px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><PixelSprite name="mail" size={42} /></div>
        <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}>CHECK YOUR INBOX</div>
        <div style={{ fontSize: 19, color: 'var(--q-dim)', marginBottom: 22, lineHeight: 1.6 }}>
          We sent a verification link to <strong style={{ color: 'var(--q-volt-text)' }}>{f.email}</strong>.
          Click it to activate your account.
        </div>
        <QuestBtn tone="ghost" style={{ width: '100%' }} onClick={() => setMode('login')}>
          BACK TO SIGN IN
        </QuestBtn>
        <div style={{ marginTop: 13, fontSize: 16, color: 'var(--q-dim)' }}>
          Didn't receive it? Check your spam folder, or{' '}
          <button onClick={handleRegister} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--q-volt-text)', cursor: 'pointer', fontSize: 16, fontFamily: "'VT323', monospace", fontWeight: 700, padding: 0 }}>
            resend email
          </button>
        </div>
      </QuestBlock>
    );
  }

  if (mode === 'forgot-sent') {
    return shell(
      <QuestBlock style={{ padding: '34px 24px', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><PixelSprite name="bolt" size={42} /></div>
        <div className="q-ps" style={{ fontSize: 15, lineHeight: 1.6, marginBottom: 10 }}>RESET LINK SENT</div>
        <div style={{ fontSize: 19, color: 'var(--q-dim)', marginBottom: 22, lineHeight: 1.6 }}>
          We sent password reset instructions to <strong style={{ color: 'var(--q-volt-text)' }}>{f.email}</strong>.
        </div>
        <QuestBtn tone="ghost" style={{ width: '100%' }} onClick={() => setMode('login')}>
          BACK TO SIGN IN
        </QuestBtn>
      </QuestBlock>
    );
  }

  // ─── Title screen ──────────────────────────────────────────────────────────
  if (!started) {
    return shell(
      <div style={{ textAlign: 'center' }}>
        <img
          src="/kaaya-icon-quest.svg"
          alt="Kaaya Quest Logo"
          style={{ width: 92, height: 92, margin: '0 auto 20px', display: 'block', border: '4px solid var(--q-border)', boxShadow: '6px 6px 0 rgba(0,0,0,0.5)', background: 'var(--q-panel)' }}
        />
        <div className="q-ps" style={{ fontSize: 'clamp(24px, 8vw, 34px)', lineHeight: 1.45 }}>
          KAAYA<br />QUEST
        </div>
        <div style={{ fontSize: 20, color: 'var(--q-volt-text)', fontWeight: 700, letterSpacing: '0.14em', marginTop: 12, textTransform: 'uppercase' }}>
          Train · Battle · Ascend
        </div>
        <button
          type="button"
          onClick={() => setStarted(true)}
          className="q-ps q-blink"
          style={{ display: 'block', margin: '44px auto 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: 15, color: 'var(--q-ink)', padding: 12 }}
        >
          ▶ PRESS START
        </button>
        <div style={{ marginTop: 26 }}>
          <QuestBtn tone="ghost" disabled={loading} onClick={handleDemo} style={{ minWidth: 210 }}>
            FREE PLAY — DEMO
          </QuestBtn>
        </div>
        {authError && (
          <div style={{ fontSize: 17, color: 'var(--q-ember-text)', marginTop: 16 }}>{authError}</div>
        )}
        <div style={{ marginTop: 46, display: 'flex', justifyContent: 'center', gap: 18 }}>
          <span className="q-meta">1 PLAYER</span>
          <span className="q-meta">© KAAYA FIT</span>
          <span className="q-meta">INSERT COIN</span>
        </div>
      </div>
    );
  }

  // ─── Form ──────────────────────────────────────────────────────────────────
  return shell(
    <>
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <img
          src="/kaaya-icon-quest.svg"
          alt="Kaaya Fit Logo"
          style={{ width: 62, height: 62, margin: '0 auto 12px', display: 'block', border: '3px solid var(--q-border)', background: 'var(--q-panel)' }}
        />
        <div className="q-ps" style={{ fontSize: 19, lineHeight: 1.4 }}>KAAYA QUEST</div>
        <div style={{ fontSize: 18, color: 'var(--q-volt-text)', fontWeight: 700, letterSpacing: '0.1em', marginTop: 7, textTransform: 'uppercase' }}>
          {mode === 'login' ? 'Welcome back, player' : 'Create your character'}
        </div>
      </div>

      <QuestBlock style={{ padding: '22px 22px 24px', maxHeight: '76dvh', overflowY: 'auto' }}>
        <QuestBtn tone="ghost" onClick={handleGoogleSignIn} disabled={loading} style={{ width: '100%', gap: 10 }}>
          <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.2 18.1 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/><path fill="#FBBC05" d="M11.1 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.6-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-11-3.7-12.9-9.2l-8.6 6.1C7 42.6 14.8 48 24 48z"/></svg>
          CONTINUE WITH GOOGLE
        </QuestBtn>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
          <div style={{ flex: 1, height: 3, background: 'var(--q-panel2)' }} />
          <span className="q-label">OR EMAIL</span>
          <div style={{ flex: 1, height: 3, background: 'var(--q-panel2)' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mode === 'register' && (
            <input className="q-slot-input" placeholder="Full Name *" value={f.name} onChange={sf('name')} aria-label="Full name" />
          )}

          <div>
            <input className="q-slot-input" type="email" placeholder="Email address *" value={f.email} onChange={sf('email')} onBlur={validateEmail} aria-label="Email address" />
            {emailErr && <div style={{ fontSize: 16, color: 'var(--q-ember-text)', marginTop: 5 }}>{emailErr}</div>}
          </div>

          <div>
            <div style={{ position: 'relative' }}>
              <input className="q-slot-input" type={sp ? 'text' : 'password'} placeholder="Password (min 8 chars) *" value={f.password} onChange={sf('password')} style={{ paddingRight: 52 }} aria-label="Password" />
              <button onClick={() => setSp(!sp)} aria-label={sp ? 'Hide password' : 'Show password'} style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--q-dim)', cursor: 'pointer', padding: 8, fontFamily: "'VT323', monospace", fontSize: 15, fontWeight: 700 }}>
                {sp ? 'HIDE' : 'SHOW'}
              </button>
            </div>
            {mode === 'register' && f.password && (
              <div style={{ display: 'flex', gap: 4, marginTop: 7, alignItems: 'center' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ flex: 1, height: 6, background: i <= strength ? strengthColors[strength] : 'var(--q-panel2)', border: '2px solid var(--q-border)', transition: 'background .2s' }} />
                ))}
                <span style={{ fontSize: 15, color: strengthColors[strength], fontWeight: 700, marginLeft: 6, minWidth: 42, textAlign: 'right' }}>
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
                  <button key={g} onClick={() => setF(p => ({ ...p, gender: g }))} className={active ? 'q-btn q-btn--sm' : 'q-btn q-btn--sm q-btn--ghost'} style={{ flex: 1, textTransform: 'capitalize' }}>
                    {g}
                  </button>
                );
              })}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input className="q-slot-input" type="number" placeholder="Age" value={f.age} onChange={sf('age')} aria-label="Age" />
              <input className="q-slot-input" type="number" placeholder="Weight (kg)" value={f.weight} onChange={sf('weight')} aria-label="Weight in kg" />
              <input className="q-slot-input" type="number" placeholder="Height (cm)" value={f.height} onChange={sf('height')} aria-label="Height in cm" />
              <select value={f.activityLevel} onChange={sf('activityLevel')} style={qSelect} aria-label="Activity level">
                {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <select value={f.workoutDays} onChange={sf('workoutDays')} style={qSelect} aria-label="Workout days per week">
              {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} days/week</option>)}
            </select>
          </>)}

          {authError && (
            <div style={{ fontSize: 17, color: 'var(--q-ember-text)', padding: '10px 13px', border: '3px solid var(--q-ember)', background: 'var(--q-slot)' }}>
              {authError}
            </div>
          )}

          {mode === 'login' && (
            <QuestBtn tone="ghost" disabled={loading} style={{ width: '100%' }} onClick={handleDemo}>
              FREE PLAY — TRY DEMO
            </QuestBtn>
          )}

          <QuestBtn tone="ember" disabled={loading} style={{ width: '100%', minHeight: 54 }} onClick={mode === 'login' ? handleLogin : handleRegister}>
            {loading ? 'PLEASE WAIT…' : mode === 'login' ? 'SIGN IN ▶' : 'CREATE ACCOUNT ▶'}
          </QuestBtn>

          {mode === 'login' && (
            <div style={{ textAlign: 'center', marginTop: -2 }}>
              <button onClick={handleForgotPassword} disabled={loading} style={{ background: 'none', border: 'none', color: 'var(--q-dim)', fontSize: 17, fontFamily: "'VT323', monospace", cursor: 'pointer', textDecoration: 'underline', padding: 6 }}>
                Forgot Password?
              </button>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: 6, fontSize: 17, color: 'var(--q-dim)' }}>
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => { setMode('register'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--q-volt-text)', fontWeight: 700, cursor: 'pointer', fontSize: 17, fontFamily: "'VT323', monospace", padding: 0 }}>Sign Up</button></>
            ) : (
              <>Already have an account? <button onClick={() => { setMode('login'); setAuthError(''); }} style={{ background: 'none', border: 'none', color: 'var(--q-volt-text)', fontWeight: 700, cursor: 'pointer', fontSize: 17, fontFamily: "'VT323', monospace", padding: 0 }}>Sign In</button></>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <QuestLabel>Kaaya Quest · the 8-bit look</QuestLabel>
          </div>
        </div>
      </QuestBlock>
    </>
  );
}
