import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AppProvider, useApp } from './core/context/AppContext';
import { DesignVersionProvider, useDesignVersion } from './core/context/DesignVersionContext';
import { AppRoutes } from './routes';
import { Sidebar, BottomNav } from './ui/v1/layout/Layout';
import VoltShellNav from './ui/volt/VoltShell';
import { ToastContainer } from './ui/v1/shared/SharedComponents';
import { VoltToastContainer } from './ui/volt/shared/VoltShared';
import AuthModal from './ui/v1/pages/AuthModal';
import VoltAuthModal from './ui/volt/pages/VoltAuthModal';
import NotificationPrompt from './ui/v1/shared/NotificationPrompt';
import { useChatbot } from './core/hooks/useChatbot';
import ChatbotButton from './ui/v1/shared/ChatbotButton';
import ChatbotModal from './ui/v1/shared/ChatbotModal';
import { VoltChatbotButton, VoltChatbotModal } from './ui/volt/shared/VoltChatbot';
import { SkinWelcomeSheet, SkinQuickSwitch, SkinComparePill } from './ui/volt/shared/SkinSwitch';
import { recordSession, isWelcomeSeen } from './core/hooks/useDiscovery';

function AppInner() {
  const { user, theme, authLoading, toasts, removeToast, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog } = useApp();
  const { isVolt } = useDesignVersion();
  const { pathname } = useLocation();
  const [quickSwitchOpen, setQuickSwitchOpen] = useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const chatbot = useChatbot({ user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog });

  // Discovery bookkeeping (V-8): count one session per browser session.
  useEffect(() => { recordSession(); }, []);

  // Long-press on app chrome opens the quick-switch sheet (V-8).
  useEffect(() => {
    const open = () => setQuickSwitchOpen(true);
    window.addEventListener('kaaya:quick-switch', open);
    return () => window.removeEventListener('kaaya:quick-switch', open);
  }, []);

  // One-time welcome sheet — after sign-in, unless onboarding is pending.
  let onboardingPending = false;
  try { onboardingPending = !!user && localStorage.getItem(`fittrack_onboarding_pending:${user.id}`) === 'true'; } catch { /* ignore */ }
  const welcomeOpen = !!user && !welcomeDismissed && !onboardingPending && !isWelcomeSeen();

  // PWA chrome color follows the active skin + mode (V-8).
  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) return;
    meta.setAttribute('content', isVolt
      ? (theme === 'light' ? '#F7F4ED' : '#0A0A09')
      : (theme === 'light' ? '#EDE7E0' : '#131315'));
  }, [isVolt, theme]);

  if (authLoading) {
    if (isVolt) {
      return (
        <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--v-canvas)' }}>
          <div style={{ textAlign: 'center' }}>
            <div className="v-num" style={{ fontSize: 30, color: 'var(--v-ink)', textTransform: 'uppercase', marginBottom: 16 }}>
              Kaaya Fit
            </div>
            <div style={{
              width: 48, height: 5, background: 'var(--v-volt)', borderRadius: 3, margin: '0 auto',
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

  if (!user) return isVolt ? <VoltAuthModal /> : <AuthModal />;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {!isVolt && <Sidebar />}
      <main
        className="mc"
        style={isVolt
          ? { flex: 1, padding: '24px 24px 96px', overflowY: 'auto', background: 'var(--v-canvas)' }
          : { flex: 1, padding: '22px 24px', overflowY: 'auto' }}
      >
        <AppRoutes chatbot={chatbot} />
      </main>
      {isVolt ? <VoltShellNav /> : <BottomNav />}
      {isVolt ? <VoltToastContainer toasts={toasts} removeToast={removeToast} /> : <ToastContainer toasts={toasts} removeToast={removeToast} />}
      <NotificationPrompt />
      {isVolt ? <VoltChatbotButton onClick={chatbot.openChat} userName={user?.name} /> : <ChatbotButton onClick={chatbot.openChat} userName={user?.name} />}
      {chatbot.isOpen && (isVolt
        ? <VoltChatbotModal chatbot={chatbot} user={user} />
        : <ChatbotModal chatbot={chatbot} user={user} />)}
      {pathname === '/' && <SkinComparePill />}
      {welcomeOpen && <SkinWelcomeSheet onClose={() => setWelcomeDismissed(true)} />}
      {quickSwitchOpen && <SkinQuickSwitch onClose={() => setQuickSwitchOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <DesignVersionProvider>
        <AppInner />
      </DesignVersionProvider>
    </AppProvider>
  );
}