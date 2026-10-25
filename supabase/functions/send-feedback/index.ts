import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

// Sends the in-app feedback form (Profile → Send feedback) via Resend.
// Replaces the old EmailJS integration: same content the EmailJS template
// carried (from_name / from_email / subject / message / user_id / meta),
// but the sender identity is derived from the caller's verified session
// instead of client-supplied fields, and no email keys ship in the client.

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || '';
const FEEDBACK_TO_EMAIL = Deno.env.get('FEEDBACK_TO_EMAIL') || 'vishalchaudhary28@gmail.com';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    if (req.method !== 'POST') return jsonResponse(405, { error: 'Method not allowed' });
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not configured');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // ── Auth: the caller must be a signed-in user ──────────────────
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return jsonResponse(401, { error: 'Unauthorized' });

    const { data: { user }, error: authErr } =
      await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authErr || !user) return jsonResponse(401, { error: 'Invalid token' });

    // ── Payload (identity comes from the session, never the body) ──
    const { subject, message, meta } = await req.json().catch(() => ({}));
    const cleanSubject = String(subject ?? '').trim().slice(0, 200);
    const cleanMessage = String(message ?? '').trim().slice(0, 5000);
    const cleanMeta = String(meta ?? '').trim().slice(0, 1000);
    if (!cleanMessage) return jsonResponse(400, { error: 'Message is required' });

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('name')
      .eq('id', user.id)
      .single();

    const fromName = profile?.name || user.user_metadata?.name || 'Kaaya Fit User';
    const fromEmail = user.email || 'unknown';

    const text = [
      `From: ${fromName} (${fromEmail})`,
      `User ID: ${user.id}`,
      `Details: ${cleanMeta || 'Not shared'}`,
      '',
      cleanMessage,
    ].join('\n');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${RESEND_API_KEY}` },
      body: JSON.stringify({
        from: 'Kaaya Fit <updates@kaaya.fit>',
        to: FEEDBACK_TO_EMAIL,
        reply_to: fromEmail,
        subject: `Kaaya Fit feedback: ${cleanSubject || 'General Feedback'}`,
        text,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`[Feedback] Resend error: ${errorText}`);
      return jsonResponse(502, { error: 'Failed to send feedback' });
    }

    return jsonResponse(200, { success: true });
  } catch (err) {
    console.error('[Feedback] Error:', err);
    return jsonResponse(500, { error: 'Internal error' });
  }
});
