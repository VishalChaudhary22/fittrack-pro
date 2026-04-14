# TODO — UX-10: Profile, Auth Modal & Contact Page

> **Scope:** `ProfilePage.jsx`, `AuthModal.jsx`, `ContactPage.jsx`  
> **Files primarily affected:** `ProfilePage.jsx`, `AuthModal.jsx`, `ContactPage.jsx`

---

## UX-11.1 — Password Stored in Plain Text in localStorage 🔴

**Problem:** `AuthModal.jsx` stores `password: f.password` directly in the `users` array in localStorage. `INIT_USERS` in `sample.js` has `password: 'admin123'` in plain text. Anyone with browser DevTools access can read all passwords.

> Note: This is client-side only with no backend, limiting the risk surface. But it's poor practice and a trust issue if users believe their data is secure.

**Fix — hash passwords client-side using the Web Crypto API:**
```js
// src/utils/crypto.js (new file)
export const hashPassword = async (password) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};
```
- In `AuthModal.jsx`: call `await hashPassword(f.password)` before `setUsers` — store `passwordHash` field, not `password`
- In login: hash the entered password and compare to `u.passwordHash`
- In `sample.js` `INIT_USERS`: pre-compute and hard-code the SHA-256 of `'admin123'`

**Files:** New `src/utils/crypto.js`, `AuthModal.jsx`, `sample.js`.

---

## UX-11.2 — Profile Edit Has No "Cancel" to Discard Changes 🟡

**Problem:** `ProfilePage.jsx` has an Edit/Save toggle. In edit mode, all form fields are live. If a user accidentally taps "Edit" and starts making changes, there's no Cancel — they must manually re-enter original values.

**Fix — show "Cancel" button in edit mode:**
```jsx
{ed && (
  <button
    className="btn-g"
    style={{ fontSize: 12 }}
    onClick={() => {
      setF({ ...user }); // restore original values
      setEd(false);
    }}
  >
    ✕ Cancel
  </button>
)}
```
Place alongside "✓ Save" in the top-right of the Personal Details card.

**Files:** `ProfilePage.jsx`.

---

## UX-11.3 — No "Member For X Days" Relative Context 🟢

**Problem:** Profile shows `"Since 15 Jan"` for join date. `"Member for 72 days"` creates a stronger sense of commitment and investment.

**Fix:**
```js
const daysSince = Math.floor((new Date() - new Date(user.joinDate)) / 86400000);
// Display: "Since 15 Jan · Member for 72 days"
```

**Files:** `ProfilePage.jsx`.

---

## UX-11.4 — Export/Import Buttons Have No Loading State 🟡

**Problem:** Export triggers a download immediately (with a toast). Import opens a file picker. Neither has a loading/processing state. On large data files, the export JSON can hang with no indicator.

**Fix — add brief loading state to Export:**
```jsx
const [exporting, setExporting] = useState(false);

const handleExport = async () => {
  setExporting(true);
  await new Promise(r => setTimeout(r, 100)); // allow render flush
  exportData();
  setExporting(false);
  addToast('Data exported!', 'success');
};

// Button label:
{exporting ? 'Exporting...' : <><Download size={12} /> Export</>}
```

**Files:** `ProfilePage.jsx`.

---

## UX-12.1 — No "Try Demo" One-Click Button on Auth Modal 🟡

**Problem:** Demo credentials (`vishal@fittrack.com / admin123`) are shown as plain text that users must read and type manually. A single "Try Demo →" button would immediately improve first-impression conversion.

**Fix in `AuthModal.jsx`:**
```jsx
{mode === 'login' && (
  <button
    className="btn-g"
    style={{ width: '100%', padding: '11px', marginBottom: 4 }}
    onClick={() => {
      setF(prev => ({ ...prev, email: 'vishal@fittrack.com', password: 'admin123' }));
      // Small delay so user can see the form auto-fill before submitting:
      setTimeout(handleLogin, 400);
    }}
  >
    ⚡ Try Demo Account
  </button>
)}
```
Place above the divider, making it the most prominent secondary action after "Log In."

**Files:** `AuthModal.jsx`.

---

## UX-12.2 — No Password Strength Indicator on Registration 🟡

**Problem:** The registration form has an eye toggle but no password strength feedback. Users have no guidance on what makes a strong password.

**Fix — add a 3-step strength bar below the password field (registration mode only):**
```jsx
const strength = !f.password ? 0 : f.password.length < 6 ? 1 : f.password.length < 10 ? 2 : 3;
const strengthColors = ['transparent', '#FF6B6B', '#FFE66D', '#6BCB77'];
const strengthLabels = ['', 'Weak', 'OK', 'Strong'];

// Render below password input in register mode:
{mode === 'register' && f.password && (
  <div style={{ display: 'flex', gap: 4, marginTop: 4 }}>
    {[1, 2, 3].map(i => (
      <div key={i} style={{
        flex: 1, height: 3, borderRadius: 2,
        background: i <= strength ? strengthColors[strength] : 'var(--c3)',
        transition: 'background .2s',
      }} />
    ))}
    <span style={{ fontSize: 10, color: strengthColors[strength], fontWeight: 700, marginLeft: 6 }}>
      {strengthLabels[strength]}
    </span>
  </div>
)}
```

**Files:** `AuthModal.jsx`.

---

## UX-12.3 — Email Validation Only Runs on Submit 🟡

**Problem:** In `AuthModal.jsx`, invalid email formats (e.g., `"vishalgmail.com"`) only surface an error after the submit button is clicked, with no inline field-level feedback.

**Fix — validate on `onBlur`:**
```jsx
const [emailErr, setEmailErr] = useState('');

// On email input:
onBlur={() => {
  if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) {
    setEmailErr('Please enter a valid email address');
  } else {
    setEmailErr('');
  }
}}

// Render below email field:
{emailErr && (
  <div style={{ fontSize: 11, color: '#FF6B6B', marginTop: 4 }}>{emailErr}</div>
)}
```

**Files:** `AuthModal.jsx`.

---

## UX-13.1 — No WhatsApp Integration on Contact Page 🟠

**Problem:** `ContactPage.jsx` uses `mailto:` to send a pre-filled email. In India, **WhatsApp is the dominant channel for business inquiries and coaching sign-ups**. Requiring email significantly reduces conversion for Indian users.

**Fix — add WhatsApp as the primary CTA:**
```jsx
const whatsappMsg = encodeURIComponent(
  `Hi Vishal! I'm interested in the ${SVCS.find(s => s.id === f.service)?.label}.\n\n` +
  `Name: ${f.name}\n` +
  `Email: ${f.email}\n` +
  `Goal: ${f.goal || 'Not specified'}\n\n` +
  `${f.message || ''}`
);

// Replace or supplement "Send Inquiry" button:
<a
  href={`https://wa.me/919XXXXXXXXX?text=${whatsappMsg}`}
  target="_blank"
  rel="noopener noreferrer"
  className="btn-p"
  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '13px 26px', textDecoration: 'none' }}
>
  <svg viewBox="0 0 24 24" width="18" height="18" fill="#fff">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.14.565 4.147 1.548 5.879L0 24l6.335-1.54A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.886 0-3.653-.516-5.168-1.415l-.371-.22-3.761.915.951-3.668-.243-.384A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>
  Message on WhatsApp
</a>

// Keep email as secondary option
```
Make WhatsApp the **primary** CTA; email becomes secondary.

**Files:** `ContactPage.jsx`.

---

## UX-13.2 — Pricing Cards Show No Billing Frequency 🟡

**Problem:** Service cards show `₹2,000` / `₹3,000` / `₹4,500` with no indication if this is per month, one-time, or per session. This ambiguity prevents purchasing decisions.

**Fix — add billing context to `SVCS` array and display it:**
```js
const SVCS = [
  { id: 'workout',  label: 'Custom Workout Plan', Icon: Dumbbell,  price: '₹2,000', billing: 'one-time' },
  { id: 'diet',     label: 'Custom Diet Plan',    Icon: Salad,     price: '₹3,000', billing: 'one-time' },
  { id: 'combo',    label: 'Workout + Diet',      Icon: TrendingUp,price: '₹4,500', billing: 'one-time' },
  { id: 'coaching', label: 'Online Coaching',     Icon: Trophy,    price: 'Enquire', billing: 'per month' },
];

// In the service card:
<div className="bb" style={{ fontSize: 22, color: 'var(--o)' }}>{svc.price}</div>
<div style={{ fontSize: 10, color: 'var(--t3)' }}>/ {svc.billing}</div>
```

**Files:** `ContactPage.jsx`.
