import { useState, useRef, useEffect, useCallback } from 'react';
import PixelSprite from '../PixelSprite';
import { QuestBtn } from '../primitives';
import { QuestLoaderMini } from './QuestLoader';

// ─── Kaaya Quest · FORGE — the RPG dialogue box (plan §7.6) ─────────────────
// Quest twin of V1/Volt's chatbot surfaces, same useChatbot brain (the
// PR #44 synchronous-prompt fix is shared core, inherited). Presentation:
// pixel bot-head FAB with a greeting card, and the conversation as an RPG
// dialogue — FORGE replies type in (VT323, tap a reply to complete it
// instantly), your lines are command lines, input is a command prompt.

const GREETING_KEY = 'forge_greeted';

const QUICK_PROMPTS = [
  { sprite: 'dumbbell', label: 'Last bench session', text: 'What weight did I do on Bench Press last time?' },
  { sprite: 'chart', label: 'Weight trend', text: 'Am I losing weight? Show me my last 30-day trend.' },
  { sprite: 'apple', label: 'Protein meals', text: 'Suggest high-protein Indian meals for today.' },
  { sprite: 'moon', label: 'Recovery advice', text: 'My readiness is low today. Should I train or rest?' },
  { sprite: 'bolt', label: 'Break plateau', text: 'My progress has stalled. How do I break through this plateau?' },
  { sprite: 'heart', label: 'Lower back pain', text: 'I have lower back pain. What exercises can I still do?' },
  { sprite: 'dots', label: 'Exercise swap', text: "I don't have a cable machine. What are alternatives?" },
  { sprite: 'plus', label: 'Best supplement', text: 'What protein powder should I buy? Budget around ₹2000/kg.' },
];

const renderMarkdown = (text) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^## (.*$)/gim, '<h4 style="margin:8px 0; font-size:15px">$1</h4>')
    .replace(/^- (.*$)/gim, '• $1');
};

// Type-in text for FORGE's newest reply. Tap completes it instantly.
function Typewriter({ text, animate, onDone }) {
  const [n, setN] = useState(animate ? 0 : text.length);
  useEffect(() => {
    if (!animate) { setN(text.length); return; }
    setN(0);
    const t = setInterval(() => {
      setN(prev => {
        if (prev >= text.length) { clearInterval(t); onDone?.(); return prev; }
        return prev + 2;
      });
    }, 16);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, animate]);
  const shown = animate ? text.slice(0, n) : text;
  return (
    <span onClick={() => { if (animate && n < text.length) { setN(text.length); onDone?.(); } }}>
      <span dangerouslySetInnerHTML={{ __html: renderMarkdown(shown) }} />
      {animate && n < text.length && <span className="q-blink" aria-hidden="true" style={{ display: 'inline-block', width: 8, height: 13, background: 'var(--q-volt)', marginLeft: 3, verticalAlign: '-2px' }} />}
    </span>
  );
}

function ForgeBox({ children, plate = true }) {
  return (
    <div style={{ position: 'relative', marginTop: plate ? 10 : 0 }}>
      {plate && (
        <span className="q-chip q-chip--gold" style={{ position: 'absolute', top: -11, left: 10, zIndex: 1, padding: '2px 8px', fontSize: 13 }}>FORGE</span>
      )}
      <div className="q-block q-block--slot" style={{ padding: '13px 14px', fontSize: 19, lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}

// ─── FAB + greeting card ─────────────────────────────────────────────────────
export function QuestChatbotButton({ onClick, userName }) {
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
      {showGreeting && (
        <div
          onClick={handleClick}
          className="q-block"
          style={{
            position: 'fixed', bottom: 'calc(140px + env(safe-area-inset-bottom, 12px))', right: 16,
            maxWidth: 230, padding: '12px 14px', zIndex: 201, cursor: 'pointer',
            opacity: greetingVisible ? 1 : 0,
            transform: greetingVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity .3s ease, transform .3s ease',
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); dismissGreeting(); }}
            style={{ position: 'absolute', top: 6, right: 6, background: 'none', border: 'none', cursor: 'pointer', padding: 2, lineHeight: 0, color: 'var(--q-dim)' }}
            aria-label="Dismiss greeting"
          >
            <PixelSprite name="x" size={11} />
          </button>
          <div style={{ fontSize: 19, fontWeight: 700, lineHeight: 1.4, paddingRight: 12 }}>Hey {firstName}</div>
          <div style={{ fontSize: 17, color: 'var(--q-dim)', marginTop: 3, lineHeight: 1.4 }}>
            Need help with your workout or diet? I'm here.
          </div>
        </div>
      )}

      <button
        onClick={handleClick}
        aria-label="Open FORGE AI Coach"
        className="q-block"
        style={{
          position: 'fixed', bottom: 'calc(72px + env(safe-area-inset-bottom, 12px))', right: 20,
          width: 56, height: 56, padding: 0, background: 'var(--q-volt)', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
        }}
      >
        <PixelSprite name="bot" size={27} />
      </button>
    </>
  );
}

// ─── Dialogue modal ──────────────────────────────────────────────────────────
export function QuestChatbotModal({ chatbot, user }) {
  const [input, setInput] = useState('');
  const [animId, setAnimId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const prevLoadingRef = useRef(false);

  const {
    messages, isLoading, isOpen, error, messagesRemaining,
    sendMessage, clearHistory, closeChat,
  } = chatbot;

  // Type-in ONLY the reply that just arrived (loading true → false), never
  // the history loaded from localStorage on open.
  useEffect(() => {
    const last = messages[messages.length - 1];
    if (last?.role === 'assistant' && prevLoadingRef.current && !isLoading) {
      setAnimId(last.id);
    }
    prevLoadingRef.current = isLoading;
  }, [messages, isLoading]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading, animId]);

  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  if (!isOpen) return null;

  const latestWeight = user?.weight || '?';
  const streakDays = user?.streak || 0;
  const lowQuota = messagesRemaining < 10;

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1300, background: 'rgba(0,0,0,0.62)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
      <div
        className="q-block"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ width: '100%', maxWidth: 460, padding: 0, overflow: 'hidden' }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', height: 'min(82dvh, 700px)' }}>
          {/* Header */}
          <div style={{ padding: '13px 16px', borderBottom: '3px solid var(--q-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, background: 'var(--q-panel2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
              <span className="q-block q-block--slot" style={{ width: 38, height: 38, padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <PixelSprite name="bot" size={21} />
              </span>
              <div style={{ minWidth: 0 }}>
                <span className="q-ps" style={{ fontSize: 13, color: 'var(--q-volt-text)' }}>FORGE</span>
                <div style={{ fontSize: 15, color: lowQuota ? 'var(--q-gold-text)' : 'var(--q-dim)', marginTop: 3, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {messagesRemaining} left today
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              <button onClick={clearHistory} aria-label="Clear history" className="q-chip" style={{ cursor: 'pointer', padding: '8px 10px', fontSize: 14 }}>
                CLEAR
              </button>
              <button onClick={closeChat} aria-label="Close" className="q-chip" style={{ cursor: 'pointer', padding: '8px 9px' }}>
                <PixelSprite name="x" size={13} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px 16px 18px', display: 'flex', flexDirection: 'column', background: 'var(--q-canvas)' }}>
            {messages.length === 0 ? (
              <>
                <ForgeBox>
                  <div style={{ fontWeight: 700, marginBottom: 7 }}>
                    Hey {user?.name || 'there'}! I'm FORGE, your AI coach.
                  </div>
                  <div style={{ color: 'var(--q-dim)', marginBottom: 10 }}>
                    I have access to your full training history, weight logs, diet data, and Olympus League rank. Ask me anything — in English or Hinglish!
                  </div>
                  <div style={{ fontSize: 17, fontWeight: 700 }}>
                    Current status: {latestWeight}kg · {streakDays} day streak
                  </div>
                </ForgeBox>
                <div style={{ display: 'flex', overflowX: 'auto', gap: 8, padding: '14px 0 6px', scrollbarWidth: 'none' }}>
                  {QUICK_PROMPTS.map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => chatbot.sendMessage(p.text)}
                      className="q-chip"
                      style={{ cursor: 'pointer', whiteSpace: 'nowrap', padding: '9px 12px', fontSize: 16, flexShrink: 0 }}
                    >
                      <PixelSprite name={p.sprite} size={14} style={{ marginRight: 6, verticalAlign: '-2px' }} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              messages.map(msg => (
                msg.role === 'assistant' ? (
                  <div key={msg.id} style={{ marginBottom: 16, maxWidth: '94%' }}>
                    <ForgeBox>
                      <Typewriter
                        text={msg.content}
                        animate={msg.id === animId}
                        onDone={() => { if (msg.id === animId) setAnimId(null); }}
                      />
                    </ForgeBox>
                    <span className="q-meta" style={{ display: 'block', marginTop: 5, padding: '0 4px' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ) : (
                  <div key={msg.id} style={{ marginBottom: 16, alignSelf: 'flex-end', maxWidth: '88%' }}>
                    <div className="q-block q-block--panel2" style={{ padding: '11px 13px', fontSize: 19, lineHeight: 1.5, whiteSpace: 'pre-wrap' }}>
                      <span style={{ color: 'var(--q-volt-text)', fontWeight: 700 }}>&gt; </span>{msg.content}
                    </div>
                    <span className="q-meta" style={{ display: 'block', marginTop: 5, padding: '0 4px', textAlign: 'right' }}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                )
              ))
            )}

            {isLoading && (
              <div style={{ marginBottom: 8, maxWidth: '94%' }}>
                <ForgeBox>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7 }}>
                    FORGE IS THINKING
                    {[0, 1, 2].map(i => (
                      <span key={i} className="q-blink" style={{ display: 'inline-block', width: 8, height: 8, background: 'var(--q-volt)', animationDelay: `${i * 0.22}s` }} />
                    ))}
                  </span>
                  <div style={{ marginTop: 9 }}>
                    <QuestLoaderMini />
                  </div>
                </ForgeBox>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Command line */}
          <div style={{ padding: '13px 16px', borderTop: '3px solid var(--q-border)', flexShrink: 0, background: 'var(--q-panel)' }}>
            {error && (
              <div style={{ color: 'var(--q-ember-text)', fontSize: 16, marginBottom: 9, textAlign: 'center' }}>{error}</div>
            )}
            <form onSubmit={e => { e.preventDefault(); sendMessage(input); setInput(''); }} style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
              <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: 8, background: 'var(--q-slot)', border: '3px solid var(--q-border)', padding: '0 12px' }}>
                <span style={{ color: 'var(--q-volt-text)', fontWeight: 700, fontSize: 20 }}>&gt;</span>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask FORGE anything..."
                  disabled={isLoading || messagesRemaining <= 0}
                  aria-label="Message FORGE"
                  style={{ flex: 1, minWidth: 0, background: 'transparent', border: 'none', outline: 'none', color: 'var(--q-ink)', fontFamily: "'VT323', monospace", fontSize: 19, minHeight: 48 }}
                />
              </div>
              <QuestBtn type="submit" tone="ember" disabled={isLoading || !input.trim() || messagesRemaining <= 0} style={{ opacity: (!input.trim() || isLoading) ? 0.55 : 1 }}>
                SEND
              </QuestBtn>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
