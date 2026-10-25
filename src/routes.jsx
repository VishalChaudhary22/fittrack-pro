import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDesignVersion } from './core/context/DesignVersionContext';
import ErrorBoundary from './ui/v1/shared/ErrorBoundary';

// ─── Skin routing ────────────────────────────────────────────────────────────
// One route table, two skins. Each route names its V1 page (lazy) and,
// when one exists, its Volt twin. SkinGate renders the Volt page when the
// user's design version is 'volt' AND a Volt page has landed for that
// route; otherwise it renders V1. Volt pages arrive per-route from V-3
// onward — registering one is a single line in VOLT_PAGES below.

const V1_PAGES = {
  '/': lazy(() => import('./ui/v1/pages/DashboardPage')),
  '/splits': lazy(() => import('./ui/v1/pages/SplitsPage')),
  '/split-builder': lazy(() => import('./ui/v1/pages/SplitBuilderPage')),
  '/workout': lazy(() => import('./ui/v1/pages/WorkoutPage')),
  '/diet': lazy(() => import('./ui/v1/pages/DietPage')),
  '/progress': lazy(() => import('./ui/v1/pages/ProgressPage')),
  '/contact': lazy(() => import('./ui/v1/pages/ContactPage')),
  '/profile': lazy(() => import('./ui/v1/pages/ProfilePage')),
  '/history': lazy(() => import('./ui/v1/pages/WorkoutHistoryPage')),
  '/weight-log': lazy(() => import('./ui/v1/pages/WeightLogPage')),
  '/measurements': lazy(() => import('./ui/v1/pages/MeasurementsPage')),
  '/muscle-map': lazy(() => import('./ui/v1/pages/MuscleMapPage')),
  '/cycle': lazy(() => import('./ui/v1/pages/CycleTrackerPage')),
};

// Volt twins register here as they land (V-3+). Empty = every route is V1.
const VOLT_PAGES = {
  // '/': lazy(() => import('./ui/volt/pages/TodayPage')),
};

function SkinFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '40vh' }}>
      <div style={{
        fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
        fontSize: 20, letterSpacing: '-0.03em', color: 'var(--primary)',
        textTransform: 'uppercase', animation: 'skin-pulse 1.5s ease-in-out infinite',
      }}>
        Kaaya Fit
      </div>
      <style>{`@keyframes skin-pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }`}</style>
    </div>
  );
}

export function SkinGate({ path, pageProps }) {
  const { isVolt } = useDesignVersion();
  const VoltPage = isVolt ? VOLT_PAGES[path] : null;
  const Page = VoltPage ?? V1_PAGES[path];
  return (
    <ErrorBoundary>
      <Suspense fallback={<SkinFallback />}>
        <Page {...pageProps} />
      </Suspense>
    </ErrorBoundary>
  );
}

export function AppRoutes({ chatbot }) {
  return (
    <Routes>
      <Route path="/" element={<SkinGate path="/" />} />
      <Route path="/splits" element={<SkinGate path="/splits" />} />
      <Route path="/split-builder" element={<SkinGate path="/split-builder" />} />
      <Route path="/workout" element={<SkinGate path="/workout" />} />
      <Route path="/diet" element={<SkinGate path="/diet" pageProps={{ chatbot }} />} />
      <Route path="/progress" element={<SkinGate path="/progress" pageProps={{ chatbot }} />} />
      <Route path="/contact" element={<SkinGate path="/contact" />} />
      <Route path="/profile" element={<SkinGate path="/profile" />} />
      <Route path="/history" element={<SkinGate path="/history" pageProps={{ chatbot }} />} />
      <Route path="/weight-log" element={<SkinGate path="/weight-log" />} />
      <Route path="/measurements" element={<SkinGate path="/measurements" />} />
      <Route path="/muscle-map" element={<SkinGate path="/muscle-map" pageProps={{ chatbot }} />} />
      <Route path="/cycle" element={<SkinGate path="/cycle" />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
