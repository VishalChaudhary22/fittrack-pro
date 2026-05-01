import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useApp } from '../context/AppContext';

const urlBase64ToUint8Array = (base64String) => {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
};

export const useNotifications = () => {
  const { user } = useApp();
  const [permission, setPermission] = useState('default');
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchPrefs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (data) {
        setPreferences(data);
      } else {
        // Defaults if no row exists yet
        setPreferences({
          workout_reminders: true,
          diet_reminders: true,
          streak_alerts: true,
          olympus_weekly: true,
          olympus_overtaken: true,
          podium_proximity: true
        });
      }
      setLoading(false);
    };
    fetchPrefs();
  }, [user]);

  const updatePreferences = async (newPrefs) => {
    if (!user) return;
    const updated = { ...preferences, ...newPrefs, user_id: user.id };
    setPreferences(updated);
    await supabase.from('notification_preferences').upsert(updated);
  };

  const subscribeToPush = useCallback(async () => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window) || !user) {
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY;
        
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });
        }

        const subObj = JSON.parse(JSON.stringify(subscription));

        // Save to Supabase
        await supabase.from('push_subscriptions').upsert({
          user_id: user.id,
          endpoint: subObj.endpoint,
          p256dh: subObj.keys.p256dh,
          auth: subObj.keys.auth,
          device_type: navigator.userAgent
        }, { onConflict: 'user_id, endpoint' });

        return true;
      }
      return false;
    } catch (error) {
      console.error('Error subscribing to push:', error);
      return false;
    }
  }, [user]);

  return {
    permission,
    preferences,
    loading,
    subscribeToPush,
    updatePreferences
  };
};
