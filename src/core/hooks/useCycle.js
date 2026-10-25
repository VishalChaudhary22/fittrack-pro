// Extracted from the V1 CycleTrackerPage page in V-6 (Kaaya Volt) so both skins
// share one logic core. The logic below is byte-identical to the original
// page code; only its home changed.

import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getCyclePhase } from '../../utils/cycleCalculations';
import { useScrollRestoration } from './useScrollRestoration';

export function useCycle() {
  useScrollRestoration('/cycle');
  const { cycleConfig, setCycleConfig, addToast } = useApp();
  
  const [startDate, setStartDate] = useState(cycleConfig?.startDate || '');
  const [cycleLength, setCycleLength] = useState(cycleConfig?.cycleLength || 28);
  
  const handleSave = () => {
    setCycleConfig({ startDate, cycleLength });
    addToast('Cycle info updated', 'success');
  };

  const currentPhase = getCyclePhase(cycleConfig?.startDate, cycleConfig?.cycleLength);

  return { currentPhase, cycleLength, handleSave, setCycleLength, setStartDate, startDate };
}
