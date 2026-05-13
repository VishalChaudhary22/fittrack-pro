import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { buildForgeSystemPrompt, buildConversationHistory } from '../utils/chatbotContext';

const STORAGE_KEY = (userId) => `fittrack_chat_${userId}`;
const MAX_LOCAL_MESSAGES = 50;

export function useChatbot({ user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [messagesRemaining, setMessagesRemaining] = useState(30);
  const systemPromptRef = useRef('');

  // Load messages from localStorage on open
  useEffect(() => {
    if (!user?.id) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY(user.id));
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [user?.id]);

  // Build system prompt when panel opens
  useEffect(() => {
    if (!isOpen || !user) return;
    systemPromptRef.current = buildForgeSystemPrompt({
      user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog,
    });
  }, [isOpen, user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog]);

  const saveMessages = useCallback((msgs) => {
    if (!user?.id) return;
    const toSave = msgs.slice(-MAX_LOCAL_MESSAGES);
    try {
      localStorage.setItem(STORAGE_KEY(user.id), JSON.stringify(toSave));
    } catch { /* storage full — ignore */ }
  }, [user?.id]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading || !user) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/smart-task`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            systemPrompt: systemPromptRef.current,
            conversationHistory: buildConversationHistory(messages),
            userMessage: text.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error || 'Daily message limit reached.');
          setMessagesRemaining(0);
        } else {
          setError(data.error || 'Something went wrong. Try again.');
        }
        return;
      }

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      setMessagesRemaining(prev => Math.max(0, prev - 1));

    } catch (err) {
      const msg = err?.message || 'Unknown error';
      setError(`Connection failed: ${msg}`);
      console.error('Chatbot error:', err);
      console.error('Edge Function URL:', `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, user, saveMessages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    if (user?.id) localStorage.removeItem(STORAGE_KEY(user.id));
  }, [user?.id]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  return {
    messages,
    isLoading,
    isOpen,
    error,
    messagesRemaining,
    sendMessage,
    clearHistory,
    openChat,
    closeChat,
  };
}
