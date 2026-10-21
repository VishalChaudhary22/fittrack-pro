import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-anon-key';

const realSupabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

// Mock Supabase Client for headless screenshot capture
const createMockSupabase = () => {
  const mockUser = {
    id: 'mock-user-id-123',
    email: 'demo@fittrackpro.in',
    user_metadata: {
      full_name: 'Kaaya Fit Demo',
      gender: 'male'
    },
    created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString()
  };

  const mockSession = {
    user: mockUser,
    access_token: 'mock-token-123456',
    expires_in: 3600
  };

  const authCallbacks = new Set();

  const auth = {
    getSession: async () => ({ data: { session: mockSession }, error: null }),
    getUser: async () => ({ data: { user: mockUser }, error: null }),
    signInWithPassword: async () => {
      setTimeout(() => {
        for (const cb of authCallbacks) cb('SIGNED_IN', mockSession);
      }, 0);
      return { data: { session: mockSession, user: mockUser }, error: null };
    },
    signInWithOAuth: async () => ({ error: null }),
    signUp: async () => ({ data: { session: mockSession, user: mockUser }, error: null }),
    signOut: async () => {
      setTimeout(() => {
        for (const cb of authCallbacks) cb('SIGNED_OUT', null);
      }, 0);
      return { error: null };
    },
    onAuthStateChange: (cb) => {
      authCallbacks.add(cb);
      setTimeout(() => cb('INITIAL_SESSION', mockSession), 0);
      return { data: { subscription: { unsubscribe: () => authCallbacks.delete(cb) } } };
    }
  };

  const chain = (data = []) => {
    const builder = {
      select: () => builder,
      insert: () => builder,
      upsert: () => builder,
      delete: () => builder,
      in: () => builder,
      eq: () => builder,
      gte: () => builder,
      lte: () => builder,
      gt: () => builder,
      lt: () => builder,
      neq: () => builder,
      or: () => builder,
      order: () => builder,
      limit: () => builder,
      single: async () => {
        const item = Array.isArray(data) ? data[0] : data;
        return { data: item || null, error: null };
      },
      then: (resolve) => Promise.resolve({ data, error: null }).then(resolve),
      catch: (reject) => Promise.resolve({ data, error: null }).catch(reject),
    };
    builder.then = (onfulfilled) => {
      return Promise.resolve({ data, error: null }).then(onfulfilled);
    };
    return builder;
  };

  const from = (table) => {
    const userId = 'mock-user-id-123';
    
    if (table === 'user_profiles') {
      const cached = localStorage.getItem(`fittrack_profile_${userId}`) || localStorage.getItem(`fittrack_cached_profile_${userId}`);
      const profile = cached ? JSON.parse(cached) : {
        id: userId,
        name: 'Kaaya Fit Demo',
        gender: 'male',
        avatar: 'KD',
        age: 28,
        height: 178,
        weight: 75,
        activity: 'moderate',
        workout_days: 4
      };
      return chain([profile]);
    }

    // Try reading table data from local storage
    const storageKey = `fittrack_${table}_${userId}`;
    const raw = localStorage.getItem(storageKey);
    let data = [];
    try {
      data = raw ? JSON.parse(raw) : [];
    } catch {
      data = [];
    }
    return chain(data);
  };

  return {
    auth,
    from,
    channel: () => {
      const builder = {
        on: () => builder,
        subscribe: () => ({})
      };
      return builder;
    },
    removeChannel: () => {}
  };
};

const isMockAuthEnabled = () => {
  try {
    return localStorage.getItem('fittrack_mock_auth') === 'true' || window.__mock_supabase === true;
  } catch {
    return false;
  }
};

export const supabase = new Proxy({}, {
  get: (target, prop) => {
    const activeClient = isMockAuthEnabled() ? createMockSupabase() : realSupabase;
    return activeClient[prop];
  }
});

export const getCurrentUser = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user ?? null;
};
