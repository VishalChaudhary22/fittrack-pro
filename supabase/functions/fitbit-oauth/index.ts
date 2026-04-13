import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Configuration
const FITBIT_CLIENT_ID = Deno.env.get('FITBIT_CLIENT_ID') || '';
const FITBIT_CLIENT_SECRET = Deno.env.get('FITBIT_CLIENT_SECRET') || '';

serve(async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.split('/').pop();
  const origin = req.headers.get('origin') || 'https://fittrackbyvishal.vercel.app';
  // Allow local development origin as well
  const redirect_uri = `${origin}/fitbit/callback`;

  // Step 1: Generate authorization URL
  if (path === 'authorize') {
    const userId = url.searchParams.get('state');
    if (!userId) return new Response('Missing state (userId)', { status: 400 });
    
    const scope = 'activity profile';
    const authUrl = `https://www.fitbit.com/oauth2/authorize?` +
      `response_type=code&client_id=${FITBIT_CLIENT_ID}&` +
      `redirect_uri=${redirect_uri}&scope=${encodeURIComponent(scope)}&state=${userId}`;
    return Response.redirect(authUrl, 302);
  }

  // Step 2: Handle callback — exchange code for tokens
  if (path === 'callback') {
    const code = url.searchParams.get('code');
    const userId = url.searchParams.get('state');

    if (!code || !userId) {
      return new Response('Missing code or state', { status: 400 });
    }

    const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirect_uri,
      }),
    });

    const tokens = await tokenRes.json();
    if (tokens.errors) {
      console.error('Fitbit token error:', tokens.errors);
      return Response.redirect(`${origin}/profile?fitbit=error`, 302);
    }

    // Store tokens in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      await supabase.from('wearable_connections').upsert({
        user_id: userId,
        provider: 'fitbit',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        provider_user_id: tokens.user_id,
        scope: tokens.scope,
        is_active: true,
      }, { onConflict: 'user_id,provider' });

      // Best effort immediate sync
      await syncFitbitData(userId, tokens.access_token, supabase).catch(err => console.error(err));
    }

    // Redirect back to profile with success
    return Response.redirect(`${origin}/#profile?fitbit=connected`, 302);
  }

  // Step 3: Sync endpoint (manual or cron)
  if (path === 'sync') {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });
    
    const { user_id } = await req.json();
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseKey) return new Response('Server config error', { status: 500 });
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data: conn } = await supabase
      .from('wearable_connections')
      .select('*')
      .eq('user_id', user_id)
      .eq('provider', 'fitbit')
      .maybeSingle();

    if (!conn) return new Response('No connection found', { status: 404 });

    // Refresh token if expired
    let accessToken = conn.access_token;
    if (new Date(conn.token_expires_at) < new Date()) {
      accessToken = await refreshFitbitToken(conn.refresh_token, conn.user_id, supabase);
    }

    if (!accessToken) return new Response('Token refresh failed', { status: 401 });

    await syncFitbitData(user_id, accessToken, supabase);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response('Not found', { status: 404 });
});

async function syncFitbitData(userId: string, accessToken: string, supabase: any) {
  const today = new Date().toISOString().split('T')[0];

  const res = await fetch(
    `https://api.fitbit.com/1/user/-/activities/date/${today}.json`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  
  if (!res.ok) {
    throw new Error(`Fitbit API returned ${res.status}`);
  }
  
  const data = await res.json();
  const summary = data.summary;

  if (!summary) return;

  await supabase.from('step_logs').upsert({
    id: `${userId}_${today}_fitbit`,
    user_id: userId,
    date: today,
    steps: summary.steps || 0,
    distance_km: (summary.distances?.find((d: any) => d.activity === 'total')?.distance || 0),
    calories_active: summary.activityCalories || 0,
    floors: summary.floors || 0,
    active_minutes: (summary.fairlyActiveMinutes || 0) + (summary.veryActiveMinutes || 0),
    source: 'fitbit',
    synced_at: new Date().toISOString(),
  }, { onConflict: 'user_id,date,source' });

  await supabase.from('wearable_connections')
    .update({ last_synced_at: new Date().toISOString() })
    .eq('user_id', userId).eq('provider', 'fitbit');
}

async function refreshFitbitToken(refreshToken: string, userId: string, supabase: any) {
  const tokenRes = await fetch('https://api.fitbit.com/oauth2/token', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${btoa(`${FITBIT_CLIENT_ID}:${FITBIT_CLIENT_SECRET}`)}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
  });
  
  const tokens = await tokenRes.json();
  if (tokens.errors) {
    console.error('Fitbit token refresh error:', tokens.errors);
    return null;
  }
  
  await supabase.from('wearable_connections').update({
    access_token: tokens.access_token,
    refresh_token: tokens.refresh_token,
    token_expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
  }).eq('user_id', userId).eq('provider', 'fitbit');
  
  return tokens.access_token;
}
