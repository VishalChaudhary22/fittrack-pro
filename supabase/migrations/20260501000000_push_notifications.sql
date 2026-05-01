-- Push Notifications Infrastructure

CREATE TABLE public.push_subscriptions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL, -- references auth.users(id) if enforcing foreign key
    endpoint TEXT NOT NULL,
    p256dh TEXT NOT NULL,
    auth TEXT NOT NULL,
    device_type TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    last_active_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, endpoint)
);

CREATE TABLE public.notification_preferences (
    user_id UUID PRIMARY KEY, -- references auth.users(id)
    workout_reminders BOOLEAN DEFAULT true,
    diet_reminders BOOLEAN DEFAULT true,
    streak_alerts BOOLEAN DEFAULT true,
    olympus_weekly BOOLEAN DEFAULT true,
    olympus_overtaken BOOLEAN DEFAULT true,
    podium_proximity BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.notification_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    type TEXT NOT NULL, -- 'workout_reminder', 'diet_reminder', etc.
    status TEXT NOT NULL, -- 'sent', 'failed', 'delivered', 'clicked'
    error_details TEXT,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_logs ENABLE ROW LEVEL SECURITY;

-- Allow users to read/write their own subscriptions
CREATE POLICY "Users can manage their own subscriptions"
ON public.push_subscriptions FOR ALL
USING (auth.uid() = user_id);

-- Allow users to read/write their own preferences
CREATE POLICY "Users can manage their own preferences"
ON public.notification_preferences FOR ALL
USING (auth.uid() = user_id);

-- Allow users to read their own logs
CREATE POLICY "Users can read their own logs"
ON public.notification_logs FOR SELECT
USING (auth.uid() = user_id);
