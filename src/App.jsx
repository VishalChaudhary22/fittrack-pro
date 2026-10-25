import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Tabs } from './components/shared/Margin';
import { ToastContainer } from './components/shared/SharedComponents';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AuthModal from './components/pages/AuthModal';
import NotificationPrompt from './components/shared/NotificationPrompt';
import { useChatbot } from './hooks/useChatbot';
import ChatbotButton from './components/shared/ChatbotButton';
import ChatbotModal from './components/shared/ChatbotModal';

// ─── LAZY-LOADED ROUTE CHUNKS ──────────────────────────────────────────────
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));
const SplitsPage = lazy(() => import('./components/pages/SplitsPage'));
const SplitBuilderPage = lazy(() => import('./components/pages/SplitBuilderPage'));
const WorkoutPage = lazy(() => import('./components/pages/WorkoutPage'));
const DietPage = lazy(() => import('./components/pages/DietPage'));
const ProgressPage = lazy(() => import('./components/pages/ProgressPage'));
const ContactPage = lazy(() => import('./components/pages/ContactPage'));
const ProfilePage = lazy(() => import('./components/pages/ProfilePage'));
const WorkoutHistoryPage = lazy(() => import('./components/pages/WorkoutHistoryPage'));
const WeightLogPage = lazy(() => import('./components/pages/WeightLogPage'));
const MeasurementsPage = lazy(() => import('./components/pages/MeasurementsPage'));
const MuscleMapPage = lazy(() => import('./components/pages/MuscleMapPage'));
const CycleTrackerPage = lazy(() => import('./components/pages/CycleTrackerPage'));
const MorePage = lazy(() => import('./components/pages/MorePage'));

function PageLoadingFallback() {
  return (
    <div style={{ padding: '40px 20px', minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton-pulse" style={{ width: 140, height: 16, borderRadius: 8 }} />
    </div>
  );
}

function AppInner() {
  const { user, authLoading, toasts, removeToast, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog } = useApp();

  const chatbot = useChatbot({ user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog });

  if (authLoading) {
    return (
      <div className="mo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--surface-container-lowest)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: 28, letterSpacing: '-0.04em', color: 'var(--primary)',
            textTransform: 'uppercase', marginBottom: 16,
          }}>
            Kaaya Fit
          </div>
          <div style={{
            width: 48, height: 4, background: 'linear-gradient(135deg, var(--primary), #FF9A5C)',
            borderRadius: 2, margin: '0 auto',
            animation: 'pulse 1.5s ease-in-out infinite',
          }} />
        </div>
        <style>{`
          @keyframes pulse {
            0% { opacity: 0.4; width: 48px; }
            50% { opacity: 1; width: 72px; }
            100% { opacity: 0.4; width: 48px; }
          }
        `}</style>
      </div>
    );
  }

  if (!user) return <AuthModal />;

  return (
    <div className="app">
      <main className="screen" style={{ paddingRight: 22 }}>
        <Suspense fallback={<PageLoadingFallback />}>
          <Routes>
            <Route path="/" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
            <Route path="/splits" element={<ErrorBoundary><SplitsPage /></ErrorBoundary>} />
            <Route path="/split-builder" element={<ErrorBoundary><SplitBuilderPage /></ErrorBoundary>} />
            <Route path="/workout" element={<ErrorBoundary><WorkoutPage /></ErrorBoundary>} />
            <Route path="/diet" element={<ErrorBoundary><DietPage chatbot={chatbot} /></ErrorBoundary>} />
            <Route path="/progress" element={<ErrorBoundary><ProgressPage chatbot={chatbot} /></ErrorBoundary>} />
            <Route path="/contact" element={<ErrorBoundary><ContactPage /></ErrorBoundary>} />
            <Route path="/profile" element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
            <Route path="/history" element={<ErrorBoundary><WorkoutHistoryPage chatbot={chatbot} /></ErrorBoundary>} />
            <Route path="/weight-log" element={<ErrorBoundary><WeightLogPage /></ErrorBoundary>} />
            <Route path="/measurements" element={<ErrorBoundary><MeasurementsPage /></ErrorBoundary>} />
            <Route path="/muscle-map" element={<ErrorBoundary><MuscleMapPage chatbot={chatbot} /></ErrorBoundary>} />
            <Route path="/cycle" element={<ErrorBoundary><CycleTrackerPage /></ErrorBoundary>} />
            <Route path="/more" element={<ErrorBoundary><MorePage /></ErrorBoundary>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Tabs />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <NotificationPrompt />
      <ChatbotButton onClick={chatbot.openChat} userName={user?.name} />
      {chatbot.isOpen && (
        <ChatbotModal chatbot={chatbot} user={user} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}