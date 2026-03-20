import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar, BottomNav } from './components/layout/Layout';
import { ToastContainer } from './components/shared/SharedComponents';
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

function AppInner() {
  const { user, toasts, removeToast } = useApp();

  if (!user) return <AuthModal />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <main className="mc" style={{ flex: 1, padding: '22px 24px', overflowY: 'auto' }}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/splits" element={<SplitsPage />} />
          <Route path="/workout" element={<WorkoutPage />} />
          <Route path="/diet" element={<DietPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/history" element={<WorkoutHistoryPage />} />
          <Route path="/weight-log" element={<WeightLogPage />} />
          <Route path="/measurements" element={<MeasurementsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <BottomNav />
      <ToastContainer toasts={toasts} removeToast={removeToast} />
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