import { useState } from 'react';
import { LogOut, Download, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PageHeader, ConfirmDialog, ThemeTogglePill } from '../shared/SharedComponents';
import { ACTIVITY } from '../../data/constants';
import { calcBMI, getBMICat, calcBMR, calcTDEE } from '../../utils/calculations';
import { fmt, kgToLbs, cmToFtIn } from '../../utils/helpers';
import { exportData, importData } from '../../utils/storage';

export default function ProfilePage() {
  const { user, setUsers, logout, theme, toggleTheme, addToast } = useApp();
  const units = user.units || 'metric';
  const toggleUnits = () => {
    const next = units === 'metric' ? 'imperial' : 'metric';
    setUsers(p => p.map(u => u.id === user.id ? { ...u, units: next } : u));
  };
  const [ed, setEd] = useState(false);
  const [f, setF] = useState({ ...user });
  const [confirm, setConfirm] = useState(false);
  const sf = k => e => setF(p => ({ ...p, [k]: e.target.value }));

  const save = () => {
    setUsers(p => p.map(u => u.id === user.id ? { ...u, ...f, weight: parseFloat(f.weight), height: parseFloat(f.height), age: parseInt(f.age), workoutDays: parseInt(f.workoutDays), weightGoal: f.weightGoal ? parseFloat(f.weightGoal) : null } : u));
    setEd(false);
    addToast('Profile updated!', 'success');
  };

  const handleExport = () => { exportData(); addToast('Data exported!', 'success'); };
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file'; input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const count = await importData(file);
        addToast(`Imported ${count} data sets! Reloading...`, 'success');
        setTimeout(() => window.location.reload(), 1500);
      } catch (err) {
        addToast(err.message, 'error');
      }
    };
    input.click();
  };

  const bmi = calcBMI(user.weight, user.height);
  const bmr = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');

  return (
    <div className="pg-in">
      <PageHeader title="My Profile" />
      <div style={{ display: 'grid', gridTemplateColumns: '230px 1fr', gap: 14 }} className="g2">
        <div className="card" style={{ padding: 22, textAlign: 'center', height: 'fit-content' }}>
          <div style={{ width: 66, height: 66, borderRadius: '50%', background: 'var(--og)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontFamily: "'Bebas Neue'", fontSize: 24, color: '#fff', letterSpacing: '2px' }}>{user.avatar}</div>
          <div className="bb" style={{ fontSize: 18 }}>{user.name}</div>
          {user.isAdmin && <div style={{ marginTop: 5 }}><span className="tag" style={{ fontSize: 8 }}>⚡ Admin</span></div>}
          <div style={{ fontSize: 10, color: 'var(--t3)', marginTop: 5 }}>Since {fmt(user.joinDate)}</div>
          <div style={{ height: 1, background: 'var(--bd)', margin: '14px 0' }} />
          <div className="bb" style={{ fontSize: 50, color: 'var(--o)', lineHeight: 1 }}>{bmi}</div>
          <span className="tag" style={{ marginTop: 6, display: 'inline-flex', fontSize: 9 }}>{getBMICat(bmi).label} BMI</span>
          <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 7 }}>
            {[{ l: 'BMR', v: bmr, u: 'kcal' }, { l: 'TDEE', v: tdee, u: 'kcal' }].map(m => (
              <div key={m.l} style={{ padding: '8px', background: 'var(--c2)', borderRadius: 8, border: '1px solid var(--bd)' }}>
                <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700 }}>{m.l}</div>
                <div className="bb" style={{ fontSize: 18, color: 'var(--o)' }}>{m.v}</div>
                <div style={{ fontSize: 9, color: 'var(--t3)' }}>{m.u}</div>
              </div>
            ))}
          </div>
          <div className="sep" />

          {/* Units toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 10px', background: 'var(--c2)', borderRadius: 12, border: '1px solid var(--bd)', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>Units</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Weight & height display</div>
            </div>
            <div style={{ display: 'flex', borderRadius: 10, overflow: 'hidden', border: '1px solid var(--bd)' }}>
              <button onClick={toggleUnits} style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', border: 'none', background: units === 'metric' ? 'var(--o)' : 'var(--c3)', color: units === 'metric' ? '#fff' : 'var(--t3)', transition: 'all .2s' }}>KG / CM</button>
              <button onClick={toggleUnits} style={{ padding: '6px 10px', fontSize: 10, fontWeight: 700, cursor: 'pointer', border: 'none', background: units === 'imperial' ? 'var(--o)' : 'var(--c3)', color: units === 'imperial' ? '#fff' : 'var(--t3)', transition: 'all .2s' }}>LBS / FT</button>
            </div>
          </div>

          {/* Theme toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 10px', background: 'var(--c2)', borderRadius: 12, border: '1px solid var(--bd)', marginBottom: 8 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tx)' }}>Theme</div>
              <div style={{ fontSize: 11, color: 'var(--t3)', marginTop: 2 }}>Switch display mode</div>
            </div>
            <ThemeTogglePill />
          </div>

          {/* Export/Import */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 8 }}>
            <button className="btn-g" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11 }} onClick={handleExport}><Download size={12} /> Export</button>
            <button className="btn-g" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, fontSize: 11 }} onClick={handleImport}><Upload size={12} /> Import</button>
          </div>

          <button className="btn-d" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 10, padding: '10px' }} onClick={() => setConfirm(true)}><LogOut size={13} /> Logout</button>
        </div>
        <div className="card" style={{ padding: 22 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div className="bb" style={{ fontSize: 20 }}>Personal Details</div>
            <button className="btn-g" style={{ fontSize: 12 }} onClick={() => ed ? save() : setEd(true)}>{ed ? '✓ Save' : '✏️ Edit'}</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ l: 'Full Name', k: 'name', t: 'text' }, { l: 'Age', k: 'age', t: 'number' }, { l: 'Email', k: 'email', t: 'email' }, { l: units === 'imperial' ? 'Weight (lbs)' : 'Weight (kg)', k: 'weight', t: 'number' }, { l: units === 'imperial' ? 'Height (ft/in)' : 'Height (cm)', k: 'height', t: 'number' }, { l: units === 'imperial' ? 'Weight Goal (lbs)' : 'Weight Goal (kg)', k: 'weightGoal', t: 'number' }, { l: 'Workout Days/Week', k: 'workoutDays', t: 'number' }].map(fld => {
              const dispVal = (k, v) => {
                if (!v && v !== 0) return 'Not set';
                if (units === 'imperial' && (k === 'weight' || k === 'weightGoal')) return kgToLbs(v);
                if (units === 'imperial' && k === 'height') return cmToFtIn(v);
                return String(v);
              };
              return (
              <div key={fld.k}><label>{fld.l}</label>{ed ? <input type={fld.t} value={f[fld.k] || ''} onChange={sf(fld.k)} /> : <div style={{ padding: '10px 13px', background: 'var(--c3)', borderRadius: 10, fontSize: 14, border: '1px solid var(--bd)', color: fld.k === 'weightGoal' && !user[fld.k] ? 'var(--t3)' : 'var(--tx)' }}>{dispVal(fld.k, user[fld.k])}</div>}</div>
              );
            })}
            <div><label>Gender</label>{ed ? <select value={f.gender} onChange={sf('gender')}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select> : <div style={{ padding: '10px 13px', background: 'var(--c3)', borderRadius: 10, fontSize: 14, border: '1px solid var(--bd)' }}>{user.gender}</div>}</div>
            <div><label>Activity Level</label>{ed ? <select value={f.activityLevel} onChange={sf('activityLevel')}>{Object.entries(ACTIVITY).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select> : <div style={{ padding: '10px 13px', background: 'var(--c3)', borderRadius: 10, fontSize: 13, border: '1px solid var(--bd)', color: 'var(--t2)' }}>{ACTIVITY[user.activityLevel || 'moderate']?.label}</div>}</div>
          </div>
        </div>
      </div>
      <ConfirmDialog open={confirm} title="Logout?" message="Are you sure you want to log out? Your data will persist." onConfirm={() => { setConfirm(false); logout(); }} onCancel={() => setConfirm(false)} confirmLabel="Logout" danger />
    </div>
  );
}
