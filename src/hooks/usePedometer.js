import { useState, useEffect, useCallback } from 'react';

export function usePedometer(initialSteps = 0) {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(initialSteps);
  const [supported, setSupported] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.DeviceMotionEvent) {
      setSupported(false);
      setError('Device motion not supported');
    }
  }, []);

  const requestPermission = async () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceMotionEvent.requestPermission();
        if (permissionState !== 'granted') {
          setError('Permission to access device motion was denied');
          return false;
        }
      } catch (e) {
        console.error(e);
        setError('Error requesting device motion permission');
        return false;
      }
    }
    return true;
  };

  const startTracking = async () => {
    if (!supported) return;
    setError(null);
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    setIsTracking(true);
  };

  const stopTracking = useCallback(() => {
    setIsTracking(false);
  }, []);

  useEffect(() => {
    if (!isTracking) return;

    let lastAccel = 0;
    let lastTime = Date.now();
    let stepDelay = 250; // min time between steps in ms
    let threshold = 1.2; // acceleration threshold
    
    // Simple peak detection
    const handleMotion = (e) => {
      if (!e.accelerationIncludingGravity) return;
      
      const { x, y, z } = e.accelerationIncludingGravity;
      if (x === null || y === null || z === null) return;
      
      // Calculate magnitude of acceleration vector
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      const now = Date.now();
      
      // Detect a "peak" (a step)
      if (magnitude - lastAccel > threshold && (now - lastTime) > stepDelay) {
        setSteps((prev) => prev + 1);
        lastTime = now;
      }
      lastAccel = magnitude;
    };

    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isTracking]);

  // Sync internal steps with external prop if it updates
  useEffect(() => {
    if (!isTracking) {
      setSteps(initialSteps);
    }
  }, [initialSteps, isTracking]);

  return { isTracking, steps, supported, error, startTracking, stopTracking };
}
