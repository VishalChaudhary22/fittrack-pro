import { AppProvider, useApp } from './core/context/AppContext';
import { DesignVersionProvider, useDesignVersion } from './core/context/DesignVersionContext';
import { AppRoutes } from './routes';
import { Sidebar, BottomNav } from './ui/v1/layout/Layout';
import VoltShellNav from './ui/volt/VoltShell';
import { ToastContainer } from './ui/v1/shared/SharedComponents';
import { VoltToastContainer } from './ui/volt/shared/VoltShared';
import AuthModal from './ui/v1/pages/AuthModal';
import NotificationPrompt from './ui/v1/shared/NotificationPrompt';
import { useChatbot } from './core/hooks/useChatbot';
import ChatbotButton from './ui/v1/shared/ChatbotButton';
import ChatbotModal from './ui/v1/shared/ChatbotModal';
import { VoltChatbotButton, VoltChatbotModal } from './ui/volt/shared/VoltChatbot';

function AppInner() {
  const { user, authLoading, toasts, removeToast, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog } = useApp();
  const { isVolt } = useDesignVersion();

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