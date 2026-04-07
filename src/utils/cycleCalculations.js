// Calculate cycle phases
// Phases: Menstruation (Days 1-5), Follicular (6-13), Ovulation (14), Luteal (15-28)
export function getCyclePhase(startDateStr, cycleLength = 28) {
  if (!startDateStr) return null;
  const start = new Date(startDateStr);
  const now = new Date();
  
  start.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);
  
  const diffTime = Math.abs(now - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // What day of the current cycle are we on? (1-indexed)
  const currentDay = (diffDays % cycleLength) + 1;
  const isPast = now < start;
  
  if (isPast) return null; // Future start date not supported practically
  
  // Define default boundaries (scaling assuming standard 28)
  const ratio = cycleLength / 28;
  const menstrualEnd = Math.round(5 * ratio);
  const follicularEnd = Math.round(13 * ratio);
  const ovulationDay = Math.round(14 * ratio);
  
  let phase = '';
  let advice = '';
  let theme = '';
  
  if (currentDay <= menstrualEnd) {
    phase = 'Menstruation';
    advice = 'Energy might be low. Focus on lighter loads, restorative yoga, and active recovery.';
    theme = 'var(--error)';
  } else if (currentDay <= follicularEnd) {
    phase = 'Follicular';
    advice = 'Energy levels are rising! Great time for higher intensity workouts, heavier compounds, and PR attempts.';
    theme = 'var(--primary)';
  } else if (currentDay === ovulationDay || currentDay === ovulationDay + 1) {
    phase = 'Ovulation';
    advice = 'Peak energy! Maximize your strength training intensity. Watch out for injury due to laxity.';
    theme = 'var(--success)';
  } else {
    // Luteal phase
    phase = 'Luteal';
    advice = 'Energy begins to wane. Maintain strength but slightly drop volume. Introduce more low-intensity steady-state cardio (LISS).';
    theme = '#8b5cf6';
  }
  
  const nextPeriodIn = cycleLength - currentDay + 1;
  
  return {
    currentDay,
    phase,
    advice,
    theme,
    nextPeriodIn
  };
}
