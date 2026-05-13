import { useState, useRef, useEffect } from 'react';
import { Zap, X, Trash2, Send } from 'lucide-react';
import { getOverallRank, MUSCLE_GROUPS, calcAllMuscleXP } from '../../data/muscleData';

const QUICK_PROMPTS = [
  { icon: '🏋️', label: 'Last bench session', text: 'What weight did I do on Bench Press last time?' },
  { icon: '📈', label: 'Weight trend', text: 'Am I losing weight? Show me my last 30-day trend.' },
  { icon: '🍛', label: 'Protein meals', text: `Suggest high-protein Indian meals for today.` }, // Adjusted dynamic part for simplicity
  { icon: '😴', label: 'Recovery advice', text: 'My readiness is low today. Should I train or rest?' },
  { icon: '💪', label: 'Break plateau', text: 'My progress has stalled. How do I break through this plateau?' },
  { icon: '🤕', label: 'Lower back pain', text: 'I have lower back pain. What exercises can I still do?' },
  { icon: '🔄', label: 'Exercise swap', text: 'I don\'t have a cable machine. What are alternatives?' },
  { icon: '🧪', label: 'Best supplement', text: 'What protein powder should I buy? Budget around ₹2000/kg.' },
];

const renderMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*$)/gim, '<h4 style="margin:8px 0; font-size:15px">$1</h4>')
    .replace(/^- (.*$)/gim, '• $1');
};

export default function ChatbotModal({ chatbot, user }) {
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

  // Render Welcome Card Context
  const latestWeight = user?.weight || '?';
  const overallRank = getOverallRank({}); // Simplified for welcome card without full context, or we can use default if unknown
  // Actually, we could use user data if passed, but since it's just a placeholder string, we'll use fallbacks.
  const streakDays = user?.streak || 0;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
    }}>
      <div style={{
        background: 'var(--surface)',
        width: '100%',
        maxWidth: 420,
        height: '85vh',
        maxHeight: 700,
        borderRadius: 24,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 12px 40px rgba(0,0,0,0.4)',
        overflow: 'hidden',
        border: '1px solid var(--surface-container-high)',
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--surface-container)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--surface-container-lowest)',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ fontFamily: '"Space Grotesk", sans-serif', fontWeight: 700, fontSize: 18, background: 'var(--signature-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ⚡ FORGE
              </span>
              <span style={{
                fontSize: 11,
                padding: '2px 8px',
                borderRadius: 10,
                background: messagesRemaining < 10 ? '#FFD166' : 'var(--surface-container-highest)',
                color: messagesRemaining < 10 ? '#000' : 'var(--on-surface-dim)',
                fontWeight: 600,
              }}>
                {messagesRemaining} left today
              </span>
            </div>
            <div style={{ fontSize: 12, color: 'var(--on-surface-dim)', marginTop: 2 }}>
              Your AI Fitness Coach
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={clearHistory} aria-label="Clear history" style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-dim)', cursor: 'pointer', padding: 4 }}>
              <Trash2 size={18} />
            </button>
            <button onClick={closeChat} aria-label="Close" style={{ background: 'transparent', border: 'none', color: 'var(--on-surface-dim)', cursor: 'pointer', padding: 4 }}>
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 20px', display: 'flex', flexDirection: 'column' }}>
          {messages.length === 0 ? (
            <>
              {/* Welcome Card */}
              <div style={{
                background: 'var(--surface-container)',
                borderLeft: '4px solid var(--primary)',
                padding: '16px',
                borderRadius: '8px 12px 12px 8px',
                marginBottom: 24,
                color: 'var(--on-surface)',
                fontSize: 14,
                lineHeight: 1.5,
              }}>
                <div style={{ fontWeight: 600, marginBottom: 8, fontSize: 15 }}>
                  ⚡ Hey {user?.name || 'there'}! I'm FORGE, your AI coach.
                </div>
                <div style={{ marginBottom: 12, color: 'var(--on-surface-dim)' }}>
                  I have access to your full training history, weight logs, diet data, and Olympus League rank. Ask me anything — in English or Hinglish! 🇮🇳
                </div>
                <div style={{ fontSize: 12, fontWeight: 500 }}>
                  Current status: {latestWeight}kg · {streakDays} day streak
                </div>
              </div>

              {/* Quick Prompts */}
              <div style={{ display: 'flex', overflowX: 'auto', gap: 10, paddingBottom: 10, msOverflowStyle: 'none', scrollbarWidth: 'none' }} className="hide-scrollbar">
                {QUICK_PROMPTS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      chatbot.sendMessage(p.text);
                    }}
                    style={{
                      background: 'var(--surface-container-highest)',
                      borderRadius: 20,
                      fontSize: 13,
                      padding: '8px 16px',
                      whiteSpace: 'nowrap',
                      border: 'none',
                      color: 'var(--on-surface)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      flexShrink: 0,
                    }}
                  >
                    <span>{p.icon}</span>
                    <span style={{ fontWeight: 500 }}>{p.label}</span>
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
                      background: 'var(--signature-gradient)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      flexShrink: 0,
                    }}>
                      <Zap size={14} color="#fff" />
                    </div>
                  )}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
                    <div style={{
                      padding: '10px 14px',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
                      background: msg.role === 'user' ? 'var(--primary-container)' : 'var(--surface-container-highest)',
                      color: msg.role === 'user' ? '#fff' : 'var(--on-surface)',
                      fontSize: 14,
                      lineHeight: 1.5,
                      whiteSpace: 'pre-wrap',
                    }} dangerouslySetInnerHTML={{ __html: msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content }} />
                    <span style={{ fontSize: 10, color: 'var(--on-surface-dim)', marginTop: 4, padding: '0 4px' }}>
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
                background: 'var(--signature-gradient)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Zap size={14} color="#fff" />
              </div>
              <div style={{ background: 'var(--surface-container-highest)', borderRadius: '4px 18px 18px 18px', padding: '12px 14px', display: 'flex', alignItems: 'center' }}>
                {[0, 120, 240].map(delay => (
                  <span key={delay} style={{
                    display: 'inline-block', width: 5, height: 5, borderRadius: '50%',
                    background: 'var(--primary)', margin: '0 3px',
                    animation: `pulse 1.2s ${delay}ms ease-in-out infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Footer */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--surface-container)', background: 'var(--surface)' }}>
          {error && (
            <div style={{ color: 'var(--error)', fontSize: 12, marginBottom: 8, textAlign: 'center' }}>
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
                flex: 1,
                background: 'var(--surface-container-high)',
                border: error ? '1px solid var(--error)' : '1px solid transparent',
                padding: '12px 16px',
                borderRadius: 24,
                color: 'var(--on-surface)',
                fontSize: 14,
                outline: 'none',
              }}
            />
            <button type="submit" disabled={isLoading || !input.trim() || messagesRemaining <= 0} className="btn-p"
              style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: (!input.trim() || isLoading) ? 0.6 : 1 }}>
              <Send size={18} />
            </button>
          </form>
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            @keyframes pulse {
              0%, 100% { opacity: 0.4; transform: scale(0.8); }
              50% { opacity: 1; transform: scale(1.1); }
            }
          `}} />
        </div>
      </div>
    </div>
  );
}
