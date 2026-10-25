import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';
import { Hero, Amp, TLink, Action } from '../shared/Margin';
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

  if (mode === 'verify') {
    return (
      <div className="mo" style={{ background: 'var(--canvas)' }}>
        <div style={{ maxWidth: 420, width: '100%', padding: '40px 28px', textAlign: 'center' }}>
          <p className="kicker" style={{ marginBottom: 14 }}>Kaaya Fit</p>
          <Hero size="sm" value="Check your inbox" />
          <p className="meta" style={{ margin: '18px 0 26px', lineHeight: 1.6 }}>
            We sent a verification link to <strong style={{ color: 'var(--ink)' }}>{f.email}</strong>.
            Click it to activate your account.
          </p>
          <Action onClick={() => setMode('login')}>Back to Sign In</Action>
          <p className="meta" style={{ marginTop: 16 }}>
            Didn't receive it? Check your spam folder, or{' '}
            <TLink onClick={() => { if (!loading) handleRegister(); }}>resend email</TLink>
          </p>
        </div>
      </div>
    );
  }

  if (mode === 'forgot-sent') {
    return (
      <div className="mo" style={{ background: 'var(--canvas)' }}>
        <div style={{ maxWidth: 420, width: '100%', padding: '40px 28px', textAlign: 'center' }}>
          <p className="kicker" style={{ marginBottom: 14 }}>Kaaya Fit</p>
          <Hero size="sm" value="Reset link sent" />
          <p className="meta" style={{ margin: '18px 0 26px', lineHeight: 1.6 }}>
            We sent password reset instructions to <strong style={{ color: 'var(--ink)' }}>{f.email}</strong>.
          </p>
          <Action onClick={() => setMode('login')}>Back to Sign In</Action>
        </div>
      </div>
    );
  }

  return (
    <div className="mo" style={{ background: 'var(--canvas)' }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="/kaaya-icon-192.png"
            alt="Kaaya Fit Logo"
            style={{ width: 56, height: 56, margin: '0 auto 14px', display: 'block' }}
          />
          <Hero size="sm" value="KAAYA FIT" />
          <p className="meta" style={{ marginTop: 8 }}>
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </p>
        </div>

        <div style={{ maxHeight: '84vh', padding: '6px 28px 28px', overflowY: 'auto' }}>

          {!isSupabaseConfigured && (
            <p className="meta" style={{ color: 'var(--bad)', lineHeight: 1.5, marginBottom: 16 }}>
              This build has no Supabase credentials, so sign-in is disabled.
              Set <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> in
              the build environment and redeploy.
            </p>
          )}

          {/* Main Google CTA */}
          <Action onClick={handleGoogleSignIn} disabled={loading || !isSupabaseConfigured} arrow="">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.2l6.8-6.8C35.8 2.5 30.2 0 24 0 14.8 0 7 5.4 3.2 13.3l7.9 6.1C13 13.2 18.1 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 6.9-10 6.9-17z"/><path fill="#FBBC05" d="M11.1 28.6A14.9 14.9 0 0 1 9.5 24c0-1.6.3-3.1.7-4.6l-7.9-6.1A24 24 0 0 0 0 24c0 3.9.9 7.5 2.5 10.7l8.6-6.1z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.5l-7.5-5.8c-2 1.4-4.6 2.2-7.7 2.2-5.9 0-11-3.7-12.9-9.2l-8.6 6.1C7 42.6 14.8 48 24 48z"/></svg>
              Continue with Google
            </span>
          </Action>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '22px 0 6px' }}>
            <div className="hairline" style={{ flex: 1 }} />
            <span className="meta">Or email</span>
            <div className="hairline" style={{ flex: 1 }} />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {mode === 'register' && (
              <div className="field">
                <span>Full name *</span>
                <input className="input" value={f.name} onChange={sf('name')} />
              </div>
            )}

            <div className="field">
              <span>Email address *</span>
              <input className="input" type="email" value={f.email} onChange={sf('email')} onBlur={validateEmail} />
            </div>
            {emailErr && <p className="meta" style={{ color: 'var(--bad)', marginTop: -4 }}>{emailErr}</p>}

            <div className="field">
              <span>Password (min 8 chars) *</span>
              <div style={{ position: 'relative' }}>
                <input className="input" type={sp ? 'text' : 'password'} value={f.password} onChange={sf('password')} style={{ width: '100%' }} />
                <button onClick={() => setSp(!sp)} style={{ position: 'absolute', right: 2, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--ash)', cursor: 'pointer' }} aria-label={sp ? 'Hide password' : 'Show password'}>
                  {sp ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {/* Strength meter for register */}
            {mode === 'register' && f.password && (
              <div style={{ marginTop: 2 }}>
                <Amp pct={(strength / 3) * 100} />
                <p className="meta" style={{ textAlign: 'right', marginTop: 4, color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </p>
              </div>
            )}

            {mode === 'register' && (<>
              <div className="field">
                <span>Gender</span>
                <div className="rowf g12">
                  {['male', 'female', 'other'].map(g => (
                    <TLink key={g} ember={f.gender === g} onClick={() => setF(p => ({ ...p, gender: g }))}>
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </TLink>
                  ))}
                </div>
              </div>

              <div className="field">
                <span>Age</span>
                <input className="input" type="number" value={f.age} onChange={sf('age')} />
              </div>
              <div className="field">
                <span>Weight (kg)</span>
                <input className="input" type="number" value={f.weight} onChange={sf('weight')} />
              </div>
              <div className="field">
                <span>Height (cm)</span>
                <input className="input" type="number" value={f.height} onChange={sf('height')} />
              </div>
              <div className="field">
                <span>Activity level</span>
                <select className="input" value={f.activityLevel} onChange={sf('activityLevel')}>
                  {Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div className="field">
                <span>Workout days</span>
                <select className="input" value={f.workoutDays} onChange={sf('workoutDays')}>
                  {[1, 2, 3, 4, 5, 6, 7].map(d => <option key={d} value={d}>{d} days/week</option>)}
                </select>
              </div>
            </>)}

            {authError && (
              <p className="meta" style={{ color: 'var(--bad)', marginTop: 10 }}>{authError}</p>
            )}

            {/* Try demo button */}
            {mode === 'login' && (
              <div style={{ marginTop: 18 }}>
                <Action onClick={handleDemo} disabled={loading || !isSupabaseConfigured} arrow="">
                  Try Demo Account
                </Action>
              </div>
            )}

            <div style={{ marginTop: 12 }}>
              <Action ember onClick={mode === 'login' ? handleLogin : handleRegister} disabled={loading || !isSupabaseConfigured}>
                {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
              </Action>
            </div>

            {mode === 'login' && (
              <div className="rowf" style={{ justifyContent: 'center', marginTop: 14 }}>
                <TLink onClick={() => { if (!loading) handleForgotPassword(); }}>Forgot Password?</TLink>
              </div>
            )}

            <p className="meta" style={{ textAlign: 'center', marginTop: 18 }}>
              {mode === 'login' ? (
                <>Don't have an account? <TLink onClick={() => { setMode('register'); setAuthError(''); }}>Sign Up</TLink></>
              ) : (
                <>Already have an account? <TLink onClick={() => { setMode('login'); setAuthError(''); }}>Sign In</TLink></>
              )}
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
