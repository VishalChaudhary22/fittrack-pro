import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 30; // messages per user per day (free tier safety valve)

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
    const isNewDay = !profile?.chat_count_reset_date ||
      profile.chat_count_reset_date !== today;
    const chatCount = isNewDay ? 0 : (profile?.chat_count_today || 0);

    if (chatCount >= DAILY_LIMIT) {
      return errorResponse(429, `Daily limit of ${DAILY_LIMIT} messages reached. Try again tomorrow.`);
    }

    // ── Parse request body ────────────────────────────────
    const body = await req.json();
    const { systemPrompt, conversationHistory, userMessage } = body;

    if (!userMessage?.trim()) return errorResponse(400, 'No message provided');

    // ── Call Gemini ───────────────────────────────────────
    const geminiPayload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 2048, // allow complete responses
      },
      safetySettings: [
        // Allow fitness/health content
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', errText);
      return errorResponse(502, `Gemini API error (${geminiRes.status}): ${errText.slice(0, 300)}`);
    }

    const geminiData = await geminiRes.json();
    const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) return errorResponse(502, 'Empty response from AI');

    const tokensUsed = geminiData.usageMetadata?.totalTokenCount || 0;

    // ── Persist messages to chat_messages ─────────────────
    await supabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: userMessage },
      { user_id: user.id, role: 'assistant', content: replyText, tokens_used: tokensUsed },
    ]);

    // ── Prune old messages (keep last 100 per user) ────────
    const { data: allMsgs } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (allMsgs && allMsgs.length > 100) {
      const toDelete = allMsgs.slice(100).map(m => m.id);
      await supabase.from('chat_messages').delete().in('id', toDelete);
    }

    // ── Update daily count ────────────────────────────────
    await supabase.from('user_profiles').update({
      chat_count_today: isNewDay ? 1 : chatCount + 1,
      chat_count_reset_date: today,
    }).eq('id', user.id);

    return new Response(JSON.stringify({ reply: replyText, tokensUsed }), {
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
