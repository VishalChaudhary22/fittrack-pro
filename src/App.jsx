import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, BottomNav } from './components/layout/Layout';
import { ToastContainer } from './components/shared/SharedComponents';
import ErrorBoundary from './components/shared/ErrorBoundary';
import AuthModal from './components/pages/AuthModal';
import DashboardPage from './components/pages/DashboardPage';
import SplitsPage from './components/pages/SplitsPage';
import WorkoutPage from './components/pages/WorkoutPage';
import DietPage from './components/pages/DietPage';
import ProgressPage from './components/pages/ProgressPage';
import ContactPage from './components/pages/ContactPage';
import ProfilePage from './components/pages/ProfilePage';
import WorkoutHistoryPage from './components/pages/WorkoutHistoryPage';
import WeightLogPage from './components/pages/WeightLogPage';
import MeasurementsPage from './components/pages/MeasurementsPage';
import MuscleMapPage from './components/pages/MuscleMapPage';
import CycleTrackerPage from './components/pages/CycleTrackerPage';
import { useChatbot } from './hooks/useChatbot';
import ChatbotButton from './components/shared/ChatbotButton';
import ChatbotModal from './components/shared/ChatbotModal';

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
            FitTrack Pro
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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="mc" style={{ flex: 1, padding: '22px 24px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
          <Route path="/splits" element={<ErrorBoundary><SplitsPage /></ErrorBoundary>} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
      <ChatbotButton onClick={chatbot.openChat} />
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