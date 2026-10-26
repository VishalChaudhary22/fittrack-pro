import { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, X, Zap, Trash2, Send, Dumbbell, TrendingUp, UtensilsCrossed, Moon, Mountain, HeartPulse, Repeat, Pill } from 'lucide-react';

// Volt twins of V1's ChatbotButton + ChatbotModal (FORGE) — greeting flow,
// quick prompts, markdown rendering, send/clear/close behavior all identical
// to V1. Presentation: volt FAB with edge border + offset shadow, and a Volt
// dialog card for the conversation.

const GREETING_KEY = 'forge_greeted';

const QUICK_PROMPTS = [
  { icon: Dumbbell, label: 'Last bench session', text: 'What weight did I do on Bench Press last time?' },
  { icon: TrendingUp, label: 'Weight trend', text: 'Am I losing weight? Show me my last 30-day trend.' },
  { icon: UtensilsCrossed, label: 'Protein meals', text: `Suggest high-protein Indian meals for today.` },
  { icon: Moon, label: 'Recovery advice', text: 'My readiness is low today. Should I train or rest?' },
  { icon: Mountain, label: 'Break plateau', text: 'My progress has stalled. How do I break through this plateau?' },
  { icon: HeartPulse, label: 'Lower back pain', text: 'I have lower back pain. What exercises can I still do?' },
  { icon: Repeat, label: 'Exercise swap', text: 'I don\'t have a cable machine. What are alternatives?' },
  { icon: Pill, label: 'Best supplement', text: 'What protein powder should I buy? Budget around ₹2000/kg.' },
];

const renderMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*$)/gim, '<h4 style="margin:8px 0; font-size:15px">$1</h4>')
    .replace(/^- (.*$)/gim, '• $1');
};

// ─── FAB + greeting bubble ────────────────────────────────────────────────────
export function VoltChatbotButton({ onClick, hasUnread = false, userName }) {
  const [showGreeting, setShowGreeting] = useState(false);
  const [greetingVisible, setGreetingVisible] = useState(false);

  const dismissGreeting = useCallback(() => {
    setGreetingVisible(false);
    setTimeout(() => setShowGreeting(false), 300);
  }, []);

  useEffect(() => {
    if (sessionStorage.getItem(GREETING_KEY)) return;

    const showTimer = setTimeout(() => {
      setShowGreeting(true);
      sessionStorage.setItem(GREETING_KEY, '1');
      setTimeout(() => setGreetingVisible(true), 30);
    }, 1800);

    return () => clearTimeout(showTimer);
  }, []);

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (!showGreeting) return;
    const timer = setTimeout(dismissGreeting, 5000);
    return () => clearTimeout(timer);
  }, [showGreeting, dismissGreeting]);

  const handleClick = useCallback(() => {
    if (showGreeting) dismissGreeting();
    onClick();
  }, [showGreeting, dismissGreeting, onClick]);

  const firstName = userName?.toLowerCase().startsWith('kaaya fit') ? 'Kaaya Fit' : (userName?.split(' ')[0] || 'there');

  return (
    <>
      {/* Greeting Tooltip */}
      {showGreeting && (
        <div
          onClick={handleClick}
          style={{
            position: 'fixed',
            bottom: 'calc(136px + env(safe-area-inset-bottom, 12px))',
            right: 16,
            maxWidth: 224,
            padding: '12px 14px',
            background: 'var(--v-panel)',
            border: '2.5px solid var(--v-edge)',
            borderRadius: 14,
            boxShadow: '4px 4px 0 var(--v-shadow)',
            zIndex: 201,
            opacity: greetingVisible ? 1 : 0,
            transform: greetingVisible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
            transition: 'opacity .3s ease, transform .3s ease',
            cursor: 'pointer',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); dismissGreeting(); }}
            style={{
              position: 'absolute', top: 6, right: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 2, lineHeight: 0, color: 'var(--v-dim)',
            }}
            aria-label="Dismiss greeting"
          >
            <X size={12} />
          </button>

          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--v-ink)', lineHeight: 1.45, paddingRight: 12 }}>
            Hey {firstName}
          </div>
          <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 4, lineHeight: 1.4 }}>
            Need help with your workout or diet? I'm here.
          </div>

          {/* Triangle pointer pointing down toward FAB */}
          <div style={{
            position: 'absolute', bottom: -7, right: 22,
            width: 12, height: 12,
            background: 'var(--v-panel)',
            borderRight: '2.5px solid var(--v-edge)', borderBottom: '2.5px solid var(--v-edge)',
            transform: 'rotate(45deg)',
          }} />
        </div>
      )}

      {/* FAB */}
      <button
        onClick={handleClick}
        aria-label="Open FORGE AI Coach"
        className="v-press"
        style={{
          position: 'fixed',
          bottom: 'calc(72px + env(safe-area-inset-bottom, 12px))',
          right: 20,
          width: 54,
          height: 54,
          borderRadius: '50%',
          background: 'var(--v-volt)',
          border: '2.5px solid var(--v-edge)',
          boxShadow: '4px 4px 0 var(--v-shadow)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
        }}
      >
        <Bot size={23} color="#141416" />
        {hasUnread && (
          <span style={{
            position: 'absolute',
            top: 4,
            right: 4,
            width: 11,
            height: 11,
            borderRadius: '50%',
            background: 'var(--v-cobalt)',
            border: '2px solid var(--v-panel)',
          }} />
        )}
      </button>
    </>
  );
}

// ─── Chat dialog ──────────────────────────────────────────────────────────────
export function VoltChatbotModal({ chatbot, user }) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const {
    messages,
    isLoading,
    isOpen,
    error,
    messagesRemaining,
    sendMessage,
    clearHistory,
    closeChat,
  } = chatbot;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const latestWeight = user?.weight || '?';
  const streakDays = user?.streak || 0;
  const lowQuota = messagesRemaining < 10;

  return (
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 1300,
        background: 'rgba(0,0,0,0.62)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 18,
      }}
    >
      <div
        className="v-pop"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{
          width: '100%', maxWidth: 460,
          background: 'var(--v-panel)', color: 'var(--v-ink)',
          border: '2.5px solid var(--v-edge)', borderRadius: 22,
          boxShadow: '6px 6px 0 var(--v-shadow-hero)',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: 'min(80dvh, 680px)' }}>
          {/* Header */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '2px solid var(--v-edge-quiet)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Zap size={16} color="var(--v-volt-text)" />
                <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: '-0.01em', color: 'var(--v-volt-text)' }}>
                  FORGE
                </span>
                <span style={{
                  fontSize: 10.5,
                  padding: '3px 9px',
                  borderRadius: 999,
                  border: '2px solid var(--v-edge)',
                  background: lowQuota ? '#F59E0B' : 'var(--v-canvas)',
                  color: lowQuota ? '#141416' : 'var(--v-dim)',
                  fontWeight: 800,
                }}>
                  {messagesRemaining} left today
                </span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--v-dim)', marginTop: 2 }}>
                Your AI Fitness Coach
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={clearHistory} aria-label="Clear history" className="v-press" style={{ background: 'transparent', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', padding: 8, minWidth: 40, minHeight: 40 }}>
                <Trash2 size={18} />
              </button>
              <button onClick={closeChat} aria-label="Close" className="v-press" style={{ background: 'transparent', border: 'none', color: 'var(--v-dim)', cursor: 'pointer', padding: 8, minWidth: 40, minHeight: 40 }}>
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px', display: 'flex', flexDirection: 'column' }}>
            {messages.length === 0 ? (
              <>
                {/* Welcome Card */}
                <div style={{
                  border: '2px solid var(--v-edge-quiet)',
                  borderLeft: '5px solid var(--v-volt)',
                  padding: 16,
                  borderRadius: 14,
                  marginBottom: 20,
                  fontSize: 14,
                  lineHeight: 1.55,
                }}>
                  <div style={{ fontWeight: 700, marginBottom: 8, fontSize: 15 }}>
                    Hey {user?.name || 'there'}! I'm FORGE, your AI coach.
                  </div>
                  <div style={{ marginBottom: 12, color: 'var(--v-dim)' }}>
                    I have access to your full training history, weight logs, diet data, and Olympus League rank. Ask me anything — in English or Hinglish!
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>
                    Current status: {latestWeight}kg · {streakDays} day streak
                  </div>
                </div>

                {/* Quick Prompts */}
                <div style={{ display: 'flex', overflowX: 'auto', gap: 8, paddingBottom: 10, scrollbarWidth: 'none' }} className="hide-scrollbar">
                  {QUICK_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => { chatbot.sendMessage(p.text); }}
                      className="v-press"
                      style={{
                        background: 'var(--v-canvas)',
                        border: '2px solid var(--v-edge-quiet)',
                        borderRadius: 999,
                        fontSize: 12.5,
                        padding: '8px 14px',
                        whiteSpace: 'nowrap',
                        color: 'var(--v-ink)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        flexShrink: 0,
                        minHeight: 38,
                      }}
                    >
                      <p.icon size={14} />
                      <span style={{ fontWeight: 600 }}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex',
                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-end',
                    gap: 8,
                    marginBottom: 16,
                  }}>
                    {msg.role === 'assistant' && (
                      <div style={{
                        width: 28, height: 28, borderRadius: '50%',
                        background: 'var(--v-volt)',
                        border: '2px solid var(--v-edge)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <Zap size={13} color="#141416" />
                      </div>
                    )}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                      <div style={{
                        padding: '10px 14px',
                        borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                        background: msg.role === 'user' ? 'var(--v-volt)' : 'var(--v-canvas)',
                        border: msg.role === 'user' ? '2px solid var(--v-edge)' : '2px solid var(--v-edge-quiet)',
                        color: msg.role === 'user' ? '#141416' : 'var(--v-ink)',
                        fontSize: 14,
                        lineHeight: 1.5,
                        whiteSpace: 'pre-wrap',
                      }} dangerouslySetInnerHTML={{ __html: msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content }} />
                      <span style={{ fontSize: 10, color: 'var(--v-dim)', marginTop: 4, padding: '0 4px' }}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            )}

            {isLoading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--v-volt)',
                  border: '2px solid var(--v-edge)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Zap size={13} color="#141416" />
                </div>
                <div style={{ background: 'var(--v-canvas)', border: '2px solid var(--v-edge-quiet)', borderRadius: '4px 18px 18px 18px', padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
                  {[0, 120, 240].map(delay => (
                    <span key={delay} style={{
                      display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                      background: 'var(--v-volt-text)', margin: '0 3px',
                      animation: `v-chatpulse 1.2s ${delay}ms ease-in-out infinite`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div style={{ padding: '14px 20px', borderTop: '2px solid var(--v-edge-quiet)', flexShrink: 0 }}>
            {error && (
              <div style={{ color: 'var(--v-coral-text)', fontSize: 12, marginBottom: 8, textAlign: 'center' }}>
                {error}
              </div>
            )}
            <form onSubmit={e => {
              e.preventDefault();
              sendMessage(input);
              setInput('');
            }} style={{ display: 'flex', gap: 10 }}>
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask FORGE anything..."
                disabled={isLoading || messagesRemaining <= 0}
                style={{
                  flex: 1, minWidth: 0,
                  background: 'var(--v-canvas)',
                  border: error ? '2.5px solid var(--v-coral)' : '2.5px solid var(--v-edge)',
                  padding: '12px 16px',
                  borderRadius: 999,
                  color: 'var(--v-ink)',
                  fontSize: 14,
                  outline: 'none',
                }}
              />
              <button type="submit" disabled={isLoading || !input.trim() || messagesRemaining <= 0}
                aria-label="Send message"
                className="v-press"
                style={{
                  width: 48, height: 48, borderRadius: '50%', padding: 0, flexShrink: 0,
                  background: 'var(--v-volt)', border: '2.5px solid var(--v-edge)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  cursor: 'pointer', opacity: (!input.trim() || isLoading) ? 0.55 : 1,
                }}>
                <Send size={18} color="#141416" />
              </button>
            </form>
            <style dangerouslySetInnerHTML={{ __html: `
              .hide-scrollbar::-webkit-scrollbar { display: none; }
              @keyframes v-chatpulse {
                0%, 100% { opacity: 0.4; transform: scale(0.8); }
                50% { opacity: 1; transform: scale(1.1); }
              }
            ` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
