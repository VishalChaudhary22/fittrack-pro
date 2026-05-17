import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const GROQ_API_KEY = Deno.env.get('GROQ_API_KEY')!;
const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 30;

// Convert Gemini-format history → OpenAI/Groq format
function toOpenAIMessages(systemPrompt: string, history: any[], userMessage: string) {
  const messages: any[] = [{ role: 'system', content: systemPrompt }];
  for (const turn of history) {
    const role = turn.role === 'model' ? 'assistant' : 'user';
    const content = Array.isArray(turn.parts) ? turn.parts.map((p: any) => p.text).join('') : turn.content ?? '';
    if (content) messages.push({ role, content });
  }
  messages.push({ role: 'user', content: userMessage });
  return messages;
}

// ── Groq call ─────────────────────────────────────────────
async function callGroq(systemPrompt: string, history: any[], userMessage: string): Promise<string> {
  const messages = toOpenAIMessages(systemPrompt, history, userMessage);

  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content;
  if (!reply) throw new Error('Empty response from Groq');
  return reply;
}

// ── Gemini fallback call ───────────────────────────────────
async function callGemini(systemPrompt: string, history: any[], userMessage: string): Promise<string> {
  const payload = {
    system_instruction: { parts: [{ text: systemPrompt }] },
    contents: [
      ...history,
      { role: 'user', parts: [{ text: userMessage }] },
    ],
    generationConfig: { temperature: 0.7, topP: 0.9, maxOutputTokens: 2048 },
    safetySettings: [
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
    ],
  };

  const res = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.slice(0, 200)}`);
  }

  const data = await res.json();
  const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!reply) throw new Error('Empty response from Gemini');
  return reply;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    // ── Auth ──────────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse(401, 'Unauthorized');

    const { data: { user }, error: authErr } =
      await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authErr || !user) return errorResponse(401, 'Invalid token');

    // ── Rate limit ────────────────────────────────────────
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('chat_count_today, chat_count_reset_date')
      .eq('id', user.id)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = !profile?.chat_count_reset_date || profile.chat_count_reset_date !== today;
    const chatCount = isNewDay ? 0 : (profile?.chat_count_today || 0);

    if (chatCount >= DAILY_LIMIT) {
      return errorResponse(429, `Daily limit of ${DAILY_LIMIT} messages reached. Try again tomorrow.`);
    }

    // ── Parse request body ────────────────────────────────
    const body = await req.json();
    const { systemPrompt, conversationHistory, userMessage } = body;

    if (!userMessage?.trim()) return errorResponse(400, 'No message provided');

    // ── Call AI: Groq first, Gemini as fallback ───────────
    let replyText: string;
    let provider: string;

    try {
      replyText = await callGroq(systemPrompt, conversationHistory, userMessage);
      provider = 'groq';
      console.log('Response from Groq ✓');
    } catch (groqErr) {
      console.warn('Groq failed, falling back to Gemini:', groqErr.message);
      try {
        replyText = await callGemini(systemPrompt, conversationHistory, userMessage);
        provider = 'gemini';
        console.log('Response from Gemini fallback ✓');
      } catch (geminiErr) {
        console.error('Both providers failed. Groq:', groqErr.message, '| Gemini:', geminiErr.message);
        return errorResponse(502, 'AI service unavailable — try again in a moment');
      }
    }

    // ── Persist messages ──────────────────────────────────
    await supabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: userMessage },
      { user_id: user.id, role: 'assistant', content: replyText },
    ]);

    // ── Prune old messages (keep last 100) ────────────────
    const { data: allMsgs } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (allMsgs && allMsgs.length > 100) {
      const toDelete = allMsgs.slice(100).map((m: any) => m.id);
      await supabase.from('chat_messages').delete().in('id', toDelete);
    }

    // ── Update daily count ────────────────────────────────
    await supabase.from('user_profiles').update({
      chat_count_today: isNewDay ? 1 : chatCount + 1,
      chat_count_reset_date: today,
    }).eq('id', user.id);

    return new Response(JSON.stringify({ reply: replyText, provider }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('ai-chat error:', err);
    return errorResponse(500, 'Internal server error');
  }
});

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
