# Kaaya Fit → iOS & Android App (Capacitor) — Revised Plan

## Overview

**Kaaya Fit** is a React 19 + Vite 8 + Supabase PWA with Google OAuth, web push notifications, a rest timer using Web Audio + Vibration APIs, a device-motion pedometer, and `html2canvas`-based sharing. This plan wraps the app in **Capacitor 6** to produce native Xcode and Android Studio projects for App Store / Play Store submission — with **zero rewrite** of existing React components, only targeted guards and plugin swaps.

---

## Critical Gaps Found in the Original Plan

> [!CAUTION]
> **Google OAuth will fail on launch.** Google blocks `signInWithOAuth` initiated from inside an embedded WebView (`Error 403: disallowed_useragent`). The original plan omitted this entirely. OAuth must open in the **system browser** using `@capacitor/browser`, and the app must receive the callback via a **custom URL scheme deep link** (`kaayafit://auth/callback`). This requires configuring the scheme in Supabase Dashboard, Xcode `Info.plist`, and Android `AndroidManifest.xml`.

> [!WARNING]
> **PWA service worker conflicts.** The original plan didn't address `vite-plugin-pwa`, which auto-injects `registerSW.js` into `dist/`. Inside Capacitor, the SW's precache competes with Capacitor's own local asset serving — causing stale bundles after app updates. The SW must be disabled for native builds.

> [!WARNING]
> **`navigator.vibrate()` is a no-op on iOS.** The original plan added `@capacitor/haptics` only for new workout actions but didn't address the existing `vibrateRestComplete()` function. It must be replaced with `Haptics.vibrate()` for the timer chime to actually vibrate on iPhones.

> [!WARNING]
> **Fitbit/Strava OAuth relies on Vercel proxy rewrites.** `ProfilePage.jsx` navigates to `/fitbit/authorize` and `/strava/authorize` — relative paths that Vercel rewrites to Supabase Edge Functions. In Capacitor there is no Vercel proxy, so these resolve to `capacitor://localhost/fitbit/authorize` → white screen.

> [!IMPORTANT]
> **`navigator.share` with files is broken in WebViews.** The PR-sharing feature in `ProgressPage.jsx` uses `navigator.share({ files: [...] })` which fails silently in iOS WKWebView. Must use `@capacitor/share`.

> [!IMPORTANT]
> **`window.open('mailto:...')` and `window.open('https://wa.me/...')` are blocked in WebViews.** `ContactPage.jsx` uses `window.open` for email and WhatsApp — these get trapped or silently fail in native WebViews. Must use `@capacitor/browser`.

> [!IMPORTANT]
> **`beforeunload` doesn't fire on mobile.** When a user swipes away the app mid-workout, `beforeunload` never triggers. The existing `localStorage`-based session persistence already handles crash recovery, but the unload guard gives false security. Should listen to Capacitor's `App.addListener('appStateChange')` / `pause` events.

> [!IMPORTANT]
> **No `safe-area-inset-top` in CSS.** Bottom insets are handled (`.bn` bottom nav), but there are zero top insets. The main content will render under the iPhone Dynamic Island / status bar.

> [!IMPORTANT]
> **Android hardware back button.** Android users expect the back button to navigate back in the app, not exit it. Must handle `@capacitor/app` `backButton` event.

> [!IMPORTANT]
> **Anchor-based file downloads fail in WKWebView.** `ProgressPage.jsx` falls back to `<a download>` on desktop — this silently fails on iOS native. Must use `@capacitor/filesystem` + `@capacitor/share`.

---

## Open Questions

1. **Bundle ID**: What reverse-domain ID do you want? (e.g., `com.kaayafit.app`). Must match Apple Developer Portal and Google Play Console.

2. **Push Notifications scope**: **Local-only** (rest timer alerts, workout reminders scheduled from inside the app — no server changes) vs. **full remote push** (requires FCM/APNs backend + Supabase Edge Function changes)?

3. **HealthKit / Google Health Connect**: Sync logged workouts, weight, or steps to Apple Health / Google Health? Great for App Store approval and discoverability.

4. **Keep-awake during workouts**: Should the screen stay on while the `WorkoutPage` is active?

5. **Fitbit / Strava OAuth**: The `vercel.json` has placeholder URLs (`YOUR_SUPABASE_URL`). Are these integrations active? If so, we need to point them to the actual Edge Function URLs for native builds.

---

## Proposed Changes

---

### Phase 1 — Install & Configure Capacitor

#### [MODIFY] `package.json`
Add all required Capacitor packages:

```
@capacitor/core           ^6.x
@capacitor/cli            ^6.x
@capacitor/ios            ^6.x
@capacitor/android        ^6.x
@capacitor/app            ^6.x    ← NEW: deep links, back button, app state
@capacitor/browser        ^6.x    ← NEW: OAuth in system browser, mailto, WhatsApp
@capacitor/haptics        ^6.x
@capacitor/local-notifications  ^6.x
@capacitor/status-bar     ^6.x
@capacitor/splash-screen  ^6.x
@capacitor/share          ^6.x    ← NEW: native share for PR screenshots
@capacitor/filesystem     ^6.x    ← NEW: file downloads on iOS
@capacitor/preferences    ^6.x    ← Optional: native key-value store
```

Add convenience scripts:
```json
"cap:build": "vite build && npx cap sync",
"cap:ios": "npx cap open ios",
"cap:android": "npx cap open android"
```

#### [NEW] `capacitor.config.ts` (project root)
```ts
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kaayafit.app',
  appName: 'Kaaya Fit',
  webDir: 'dist',
  server: {
    androidScheme: 'https',   // avoids mixed-content issues on Android
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1800,
      backgroundColor: '#0E0E10',
      showSpinner: false,
    },
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#0E0E10',
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_kaaya',
      iconColor: '#F85F1B',
    },
  },
};
export default config;
```

#### [MODIFY] `.gitignore`
Add Capacitor native build artifacts and protect `.env`:
```
# Environment
.env
.env.*
!.env.example

# Capacitor native platforms
ios/App/Pods/
ios/App/Podfile.lock
android/.gradle/
android/app/build/
android/build/
```

---

### Phase 2 — Google OAuth & Deep Link Fix *(Most Critical)*

**The Problem**: Google rejects OAuth initiated from embedded WebViews. `window.location.origin` evaluates to `capacitor://localhost` (iOS) or `https://localhost` (Android) — both are rejected by Supabase's redirect allowlist.

**The Fix**: Open OAuth in the **system browser** via `@capacitor/browser`, redirect back to the app via a custom URL scheme (`kaayafit://`), and extract tokens using `@capacitor/app`.

#### Supabase Dashboard Configuration (Manual)
1. Go to **Supabase Dashboard → Authentication → URL Configuration**
2. Add to **Redirect URLs**: `kaayafit://auth/callback`
3. Keep existing web URLs (`https://fittrackbyvishal.vercel.app/**`, `http://localhost:5173/**`)

#### [MODIFY] `src/components/pages/AuthModal.jsx`
```jsx
import { isNative } from '../../lib/capacitor';
import { Browser } from '@capacitor/browser';

// In handleGoogleSignIn:
const redirectTo = isNative()
  ? 'kaayafit://auth/callback'
  : window.location.origin;

const { data, error } = await supabase.auth.signInWithOAuth({
  provider: 'google',
  options: {
    redirectTo,
    queryParams: { access_type: 'offline', prompt: 'consent' },
    skipBrowserRedirect: isNative(), // ← prevents in-WebView navigation
  },
});

if (isNative() && data?.url) {
  await Browser.open({ url: data.url }); // opens in Safari/Chrome
}
```

Similarly fix `emailRedirectTo` in signup and `redirectTo` in password reset:
```jsx
emailRedirectTo: isNative() ? 'kaayafit://auth/callback' : window.location.origin,
```

#### [NEW] `src/lib/capacitor.js`
Platform detection utility (used throughout):
```js
import { Capacitor } from '@capacitor/core';

export const isNative = () => Capacitor.isNativePlatform();
export const getPlatform = () => Capacitor.getPlatform(); // 'ios' | 'android' | 'web'
```

#### [NEW] `src/lib/deepLinkHandler.js`
Listen for the OAuth callback deep link and extract the session:
```js
import { App as CapApp } from '@capacitor/app';
import { Browser } from '@capacitor/browser';
import { supabase } from './supabaseClient';
import { isNative } from './capacitor';

export function initDeepLinkHandler() {
  if (!isNative()) return;

  CapApp.addListener('appUrlOpen', async ({ url }) => {
    // url = 'kaayafit://auth/callback#access_token=...&refresh_token=...'
    if (url.includes('auth/callback')) {
      // Close the system browser
      await Browser.close();

      // Extract tokens from the URL fragment
      const hashParams = new URLSearchParams(url.split('#')[1] || '');
      const accessToken = hashParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token');

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken });
      }
    }
  });
}
```

#### [MODIFY] `src/main.jsx`
Initialize the deep link handler on app startup:
```jsx
import { initDeepLinkHandler } from './lib/deepLinkHandler';
initDeepLinkHandler();
```

#### iOS Native Config: `ios/App/App/Info.plist`
Register the `kaayafit://` custom URL scheme:
```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>kaayafit</string>
    </array>
  </dict>
</array>
```

#### Android Native Config: `android/app/src/main/AndroidManifest.xml`
```xml
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="kaayafit" android:host="auth" android:pathPrefix="/callback" />
</intent-filter>
```

---

### Phase 3 — Router Fix

#### [MODIFY] `src/main.jsx`
`BrowserRouter` relies on a server that serves `index.html` for all routes. Capacitor loads from `file://` or `capacitor://` — there is no server. Navigation to `/workout` would 404.

Use platform-aware routing:
```jsx
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { isNative } from './lib/capacitor';

const Router = isNative() ? HashRouter : BrowserRouter;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
);
```

This preserves clean URLs on the web deployment while using hash routing on native.

#### [MODIFY] `src/components/pages/DietPage.jsx`
Line 550 uses `window.location.hash = '#/profile'` which is incompatible with `BrowserRouter`. Replace with `useNavigate()`:
```jsx
onClick={() => navigate('/profile')}
```

---

### Phase 4 — Disable PWA Service Worker in Native Builds

**The Problem**: `vite-plugin-pwa` auto-injects `registerSW.js` which registers a Workbox service worker. Inside Capacitor, this SW precaches the entire `dist/` folder — but Capacitor already serves these files from the app bundle. On subsequent app updates, the stale SW cache can serve the old version indefinitely.

**The Fix**: Conditionally disable PWA plugin for Capacitor builds.

#### [MODIFY] `vite.config.js`
```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

const isCapacitor = process.env.CAPACITOR === 'true';

export default defineConfig({
  plugins: [
    react(),
    !isCapacitor && VitePWA({ /* existing config */ }),
  ].filter(Boolean),
});
```

#### [MODIFY] `package.json` scripts
```json
"cap:build": "CAPACITOR=true vite build && npx cap sync"
```

This ensures `npm run build` (web deploy) keeps the PWA, while `npm run cap:build` strips it.

---

### Phase 5 — Viewport & Safe Area CSS

#### [MODIFY] `index.html`
```html
<meta name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0,
           user-scalable=no, viewport-fit=cover">
```

#### [MODIFY] `src/index.css`
Add top safe area support (Dynamic Island, notch, status bar):

```css
/* ─── CAPACITOR SAFE AREAS ─────────────────────────────────── */
body {
  padding-top: env(safe-area-inset-top);
}
```

Update the bottom nav `.bn` (already uses bottom inset — ✅ no change needed).

Update main content area in responsive breakpoint:
```css
@media(max-width:768px){
  .mc{padding:16px 14px calc(90px + env(safe-area-inset-bottom))!important}
}
```

---

### Phase 6 — Rest Timer: Local Notification + Haptics

The rest timer **already uses a deadline-timestamp approach** (`Date.now() + restDuration * 1000`), which is robust against background throttling. The gap is that when the app is backgrounded/locked:
- The 250ms `setInterval` is throttled → the completion chime and vibration never fire
- `navigator.vibrate()` is a complete no-op on iOS

**Fix**: Schedule a `LocalNotification` when the timer starts, and replace `navigator.vibrate` with `@capacitor/haptics`.

#### [MODIFY] `src/components/pages/WorkoutPage.jsx`

Replace `vibrateRestComplete()`:
```js
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { LocalNotifications } from '@capacitor/local-notifications';
import { isNative } from '../../lib/capacitor';

async function vibrateRestComplete() {
  if (isNative()) {
    await Haptics.notification({ type: NotificationType.Success });
  } else if ('vibrate' in navigator) {
    navigator.vibrate([200, 100, 200]);
  }
}
```

In `doStartRestTimer()`, schedule a local notification:
```js
async function doStartRestTimer(ei, si) {
  getAudioCtx();
  const endsAt = Date.now() + restDuration * 1000;
  localStorage.setItem(REST_TIMER_KEY, String(endsAt));
  localStorage.setItem(REST_TIMER_POS_KEY, JSON.stringify({ ei, si }));
  setRestEndsAt(endsAt);
  setRestSecondsLeft(restDuration);
  setRestActive(true);
  setRestTimerPosition({ ei, si });

  if (isNative()) {
    await LocalNotifications.schedule({
      notifications: [{
        id: 1,
        title: 'Rest Complete!',
        body: 'Time to get back to it 💪',
        schedule: { at: new Date(endsAt) },
        sound: 'default',
      }]
    });
  }
}
```

In `skipRestTimer()` and when timer completes, cancel the notification:
```js
if (isNative()) {
  await LocalNotifications.cancel({ notifications: [{ id: 1 }] });
}
```

Add haptics for workout actions:
```js
// Set logged → light tap
if (isNative()) await Haptics.impact({ style: ImpactStyle.Light });

// PR achieved → heavy impact
if (isNative()) await Haptics.impact({ style: ImpactStyle.Heavy });

// Workout finished → success notification
if (isNative()) await Haptics.notification({ type: NotificationType.Success });
```

---

### Phase 7 — Notifications Hook: Capacitor Guard

#### [MODIFY] `src/hooks/useNotifications.js`
Guard the Web Push path so it only runs on the web:

```js
import { isNative } from '../lib/capacitor';
import { LocalNotifications } from '@capacitor/local-notifications';

// In subscribeToPush:
if (isNative()) {
  const { display } = await LocalNotifications.requestPermissions();
  setPermission(display);
  setPushEnabled(display === 'granted');
  return display === 'granted';
}
// else: existing VAPID / PushManager web code path (unchanged)
```

#### [MODIFY] `src/components/shared/NotificationPrompt.jsx`
Suppress the "Enable Push Notifications" prompt when running natively (handled by OS-level permission dialogs):
```js
if (isNative()) return null; // or show a Capacitor-specific prompt
```

---

### Phase 8 — Status Bar, Splash Screen & Back Button

#### [MODIFY] `src/App.jsx`
```jsx
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App as CapApp } from '@capacitor/app';
import { isNative } from './lib/capacitor';

// In AppInner, after auth loading resolves:
useEffect(() => {
  if (!isNative()) return;
  StatusBar.setStyle({ style: Style.Dark });
  StatusBar.setBackgroundColor({ color: '#0E0E10' });
  SplashScreen.hide({ fadeOutDuration: 300 });
}, []);

// Sync status bar with theme toggle:
useEffect(() => {
  if (!isNative()) return;
  StatusBar.setStyle({ style: theme === 'dark' ? Style.Dark : Style.Light });
  StatusBar.setBackgroundColor({ color: theme === 'dark' ? '#0E0E10' : '#F5F0EB' });
}, [theme]);

// Android hardware back button:
useEffect(() => {
  if (!isNative()) return;
  const handler = CapApp.addListener('backButton', ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
    } else {
      CapApp.exitApp();
    }
  });
  return () => handler.then(h => h.remove());
}, []);
```

#### [MODIFY] `src/components/pages/WorkoutPage.jsx`
Replace `beforeunload` guard with Capacitor app state listener:
```js
import { App as CapApp } from '@capacitor/app';
import { isNative } from '../../lib/capacitor';

useEffect(() => {
  if (!session || done) return;

  if (isNative()) {
    // Persist session state when app goes to background
    const listener = CapApp.addListener('appStateChange', ({ isActive }) => {
      if (!isActive && session) {
        persistActiveSession({ ...session, userId: user.id });
      }
    });
    return () => listener.then(h => h.remove());
  } else {
    // Web: existing beforeunload guard
    const handleBeforeUnload = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }
}, [session, done, user]);
```

---

### Phase 9 — External Links & Share API

#### [MODIFY] `src/components/pages/ContactPage.jsx`
Replace `window.open` with `@capacitor/browser`:
```js
import { Browser } from '@capacitor/browser';
import { isNative } from '../../lib/capacitor';

const openExternal = async (url) => {
  if (isNative()) {
    await Browser.open({ url });
  } else {
    window.open(url);
  }
};

// mailto:
openExternal(`mailto:vishalchaudhary28@gmail.com?subject=...`);

// WhatsApp:
openExternal(`https://wa.me/919871673282?text=...`);
```

#### [MODIFY] `src/components/pages/ProgressPage.jsx`
Replace `navigator.share` with `@capacitor/share`:
```js
import { Share } from '@capacitor/share';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { isNative } from '../../lib/capacitor';

const sharePB = async () => {
  const canvas = await html2canvas(pbCardRef.current, { backgroundColor: '#111827', scale: 2 });
  const imgData = canvas.toDataURL('image/png');

  if (isNative()) {
    // Write to temp file, then share
    const base64 = imgData.split(',')[1];
    const { uri } = await Filesystem.writeFile({
      path: 'fittrack-pb.png',
      data: base64,
      directory: Directory.Cache,
    });
    await Share.share({
      title: 'My New Personal Best!',
      text: `Check out my new PR on ${se}: ${pr}kg!`,
      url: uri,
    });
  } else if (navigator.share) {
    // Existing web share path
    const blob = await (await fetch(imgData)).blob();
    const file = new File([blob], 'fittrack-pb.png', { type: 'image/png' });
    await navigator.share({ title: 'My New Personal Best!', files: [file] });
  } else {
    // Desktop fallback: download
    const a = document.createElement('a');
    a.href = imgData; a.download = 'fittrack-pb.png'; a.click();
  }
};
```

#### [MODIFY] `src/components/pages/ProfilePage.jsx`
Fix Fitbit/Strava OAuth (currently relies on Vercel proxy):
```js
import { Browser } from '@capacitor/browser';
import { isNative } from '../../lib/capacitor';

const SUPABASE_FUNCTIONS_URL = import.meta.env.VITE_SUPABASE_URL + '/functions/v1';

// Instead of: window.location.href = '/fitbit/authorize?state=' + user.id;
const url = isNative()
  ? `${SUPABASE_FUNCTIONS_URL}/fitbit-oauth/authorize?state=${user.id}`
  : `/fitbit/authorize?state=${user.id}`;

if (isNative()) {
  await Browser.open({ url });
} else {
  window.location.href = url;
}
```

---

### Phase 10 — Suppress PWA Install Prompt on Native

#### [MODIFY] `src/components/pages/DashboardPage.jsx`
The "Add to Home Screen" banner and `beforeinstallprompt` listener should be suppressed when running inside Capacitor:
```js
import { isNative } from '../../lib/capacitor';

// Guard the install prompt listener:
useEffect(() => {
  if (isNative()) return; // already installed as native app
  window.addEventListener('beforeinstallprompt', handler);
  return () => window.removeEventListener('beforeinstallprompt', handler);
}, []);
```

---

### Phase 11 — App Icons & Splash Screen Assets

Generate all required icon sizes from the existing `public/kaaya-icon-512.png`:

```bash
npx @capacitor/assets generate \
  --iconBackgroundColor '#0E0E10' \
  --splashBackgroundColor '#0E0E10'
```

This generates:
- **iOS**: 1024×1024 (App Store), 180×180, 120×120, etc. in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
- **Android**: `mipmap-xxxhdpi` through `mipmap-mdpi` + adaptive icon layers in `android/app/src/main/res/`
- **Splash screens**: All required sizes for both platforms

Also fix the broken icon references in `src/sw.js` line 15 (`/fittrack-icon-192.png` and `/badge-72.png` don't exist — should be `/kaaya-icon-192.png`).

---

### Phase 12 — Native Project Configuration

#### iOS (`ios/App/App/Info.plist`)
```xml
<!-- Custom URL Scheme for OAuth deep links -->
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array><string>kaayafit</string></array>
  </dict>
</array>

<!-- Notification permission description -->
<key>NSLocalNotificationsUsageDescription</key>
<string>Kaaya Fit uses notifications to alert you when your rest timer is complete.</string>

<!-- Motion permission description (pedometer) -->
<key>NSMotionUsageDescription</key>
<string>Kaaya Fit uses motion data to count your steps during workouts.</string>
```

In Xcode:
- Set **Bundle Identifier** to `com.kaayafit.app`
- Set **Deployment Target** to iOS 14.0+
- Enable **Push Notifications** capability (if using remote push later)

#### Android (`android/app/src/main/AndroidManifest.xml`)
```xml
<!-- Deep link intent filter -->
<intent-filter>
  <action android:name="android.intent.action.VIEW" />
  <category android:name="android.intent.category.DEFAULT" />
  <category android:name="android.intent.category.BROWSABLE" />
  <data android:scheme="kaayafit" android:host="auth" android:pathPrefix="/callback" />
</intent-filter>

<!-- Permissions -->
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.VIBRATE"/>
```

Set status bar and splash colors in `android/app/src/main/res/values/styles.xml`.

---

## Files Changed Summary

| File | Action | Phase |
|:---|:---|:---|
| `package.json` | MODIFY — add 13 Capacitor packages + scripts | 1 |
| `capacitor.config.ts` | NEW | 1 |
| `.gitignore` | MODIFY — add native build dirs + `.env` | 1 |
| `src/lib/capacitor.js` | NEW — platform detection | 2 |
| `src/lib/deepLinkHandler.js` | NEW — OAuth callback handler | 2 |
| `src/components/pages/AuthModal.jsx` | MODIFY — system browser OAuth | 2 |
| `src/main.jsx` | MODIFY — HashRouter + deep link init | 3 |
| `src/components/pages/DietPage.jsx` | MODIFY — fix `window.location.hash` | 3 |
| `vite.config.js` | MODIFY — conditional PWA disable | 4 |
| `index.html` | MODIFY — viewport-fit + user-scalable | 5 |
| `src/index.css` | MODIFY — safe-area-inset-top | 5 |
| `src/components/pages/WorkoutPage.jsx` | MODIFY — local notifications + haptics + app state | 6, 8 |
| `src/hooks/useNotifications.js` | MODIFY — Capacitor guard | 7 |
| `src/components/shared/NotificationPrompt.jsx` | MODIFY — suppress on native | 7 |
| `src/App.jsx` | MODIFY — status bar + splash + back button | 8 |
| `src/components/pages/ContactPage.jsx` | MODIFY — Browser plugin | 9 |
| `src/components/pages/ProgressPage.jsx` | MODIFY — Capacitor share + filesystem | 9 |
| `src/components/pages/ProfilePage.jsx` | MODIFY — direct Edge Function URLs | 9 |
| `src/components/pages/DashboardPage.jsx` | MODIFY — suppress install prompt | 10 |
| `src/sw.js` | MODIFY — fix broken icon paths | 11 |
| `ios/App/App/Info.plist` | MODIFY — URL scheme + permissions | 12 |
| `android/…/AndroidManifest.xml` | MODIFY — intent filter + permissions | 12 |

---

## Verification Plan

### Build & Sync
```bash
CAPACITOR=true npm run build   # Vite build without SW
npx cap sync                    # Copy dist/ into native projects
npx cap open ios                # Open Xcode
npx cap open android            # Open Android Studio
```

### Critical Path Tests (Manual)

| # | Test | Expected Behavior |
|:---|:---|:---|
| 1 | **Google OAuth login** | System browser opens → Google consent → redirects back to app → user is logged in |
| 2 | **Email/password login** | Works within WebView (no browser needed) |
| 3 | **Demo account login** | Works within WebView |
| 4 | **Navigate all routes** | Bottom nav works, no blank screens on any page |
| 5 | **Android back button** | Goes back through navigation history, exits app on last page |
| 6 | **Rest timer: app backgrounded** | Local notification fires at correct time, app resumes with correct remaining time |
| 7 | **Rest timer: screen locked** | Notification fires on lock screen |
| 8 | **Rest timer: skip** | Notification is cancelled |
| 9 | **Haptic on set log** | Phone vibrates on iOS and Android |
| 10 | **Share PR screenshot** | Native share sheet opens with image |
| 11 | **WhatsApp / Email links** | Opens in system browser / mail app |
| 12 | **Theme toggle** | Status bar icons change color (dark ↔ light) |
| 13 | **Safe areas** | No content under notch/Dynamic Island; bottom nav above home indicator |
| 14 | **Offline launch** | App opens, shows cached data, Supabase calls fail gracefully |
| 15 | **App update** | After rebuilding and re-syncing, the new version loads (no stale SW cache) |

### App Store / Play Store Checklist
- [ ] All icons generated at required sizes
- [ ] Splash screen: dark background, centered logo
- [ ] Privacy policy URL set in App Store Connect / Google Play Console
- [ ] All permission usage descriptions in `Info.plist`
- [ ] App passes `Product → Archive` in Xcode
- [ ] Android AAB signed with upload keystore
- [ ] `targetSdkVersion` set to API 34 (Android 14)
- [ ] Screenshots captured for both platforms (6.7", 6.5", 5.5" iPhone; phone + tablet Android)

---

## Estimated Timeline

| Phase | Task | Time |
|:---|:---|:---|
| 1 | Install Capacitor + plugins, init platforms | 30 min |
| 2 | **OAuth deep link system** (most complex) | 2–3 hrs |
| 3 | Router fix + DietPage hash fix | 20 min |
| 4 | PWA conditional disable | 15 min |
| 5 | Viewport + safe area CSS | 20 min |
| 6 | Rest timer: local notifications + haptics | 1–2 hrs |
| 7 | Notifications hook guard | 20 min |
| 8 | Status bar + splash + back button + app state | 40 min |
| 9 | External links + share + Fitbit/Strava URLs | 1 hr |
| 10 | Suppress PWA install prompt | 10 min |
| 11 | Icon + splash asset generation | 20 min |
| 12 | Native project config (Xcode + Android Studio) | 1 hr |
| — | Testing on simulator + real device | 3–4 hrs |
| **Total** | | **~11–14 hrs** |
