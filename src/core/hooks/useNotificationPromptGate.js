import { useState, useEffect } from 'react';
import { useNotifications } from './useNotifications';
import { useApp } from '../context/AppContext';

// Shared visibility gate for the push-permission prompt, identical for all
// three skins (each skin renders its own sheet): show only when permission
// was never asked, the user has logged at least 2 workouts, and the prompt
// was not dismissed within the last 14 days.
export function useNotificationPromptGate() {
  const { permission, enablePush } = useNotifications();
  const { workoutLogs } = useApp();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show if we have default permission (never asked)
    if (permission !== 'default') return;

    // Only show if user has done at least 2 workouts (meaningful engagement)
    if (!workoutLogs || workoutLogs.length < 2) return;

    // Check if dismissed recently (14 days cooldown)
    const dismissedAt = localStorage.getItem('fittrack_notif_prompt_dismissed');
    if (dismissedAt) {
      const daysSinceDismissal = (Date.now() - parseInt(dismissedAt)) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissal < 14) return;
    }

    // Slight delay to not interrupt immediate page load
    const timer = setTimeout(() => setIsVisible(true), 2000);
    return () => clearTimeout(timer);
  }, [permission, workoutLogs]);

  const handleEnable = async () => {
    setIsVisible(false);
    await enablePush();
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('fittrack_notif_prompt_dismissed', Date.now().toString());
  };

  return { isVisible, handleEnable, handleDismiss };
}
