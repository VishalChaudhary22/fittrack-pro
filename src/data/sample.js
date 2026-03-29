import { gId, tod } from '../utils/helpers';

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
export const genSample = () => {
  const hl = [];
  const now = new Date();
  for (let i = 55; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const w = +(88 - (55 - i) * 0.09 + (Math.random() - .5) * .7).toFixed(1);
    if (i % 3 === 0 || i < 10) hl.push({ id: gId(), userId: 'vishal', date: d.toISOString().split('T')[0], weight: w, notes: '' });
  }
  const wl = [];
  const bw = [60, 62.5, 65, 67.5, 70, 72.5, 75, 77.5, 80, 82.5];
  for (let w = 0; w < 10; w++) {
    const d = new Date(now.getFullYear(), now.getMonth(), Math.max(1, Math.floor(now.getDate() * (w + 1) / 10)));
    wl.push({
      id: gId(), userId: 'vishal', splitId: 'ppl', dayId: 'ppl-pa', dayName: 'Push Day A', date: d.toISOString().split('T')[0],
      exercises: [
        { name: 'Flat Dumbbell Press', sets: [{ reps: 12, weight: bw[w] }, { reps: 11, weight: bw[w] }, { reps: 10, weight: bw[w] }, { reps: 9, weight: bw[w] }] },
        { name: 'Overhead Press', sets: [{ reps: 10, weight: 40 + w * 2.5 }, { reps: 9, weight: 40 + w * 2.5 }, { reps: 8, weight: 40 + w * 2.5 }] },
      ],
    });
  }
  return { hl, wl };
};

export const INIT_USERS = [{
  id: 'vishal', name: 'Vishal Chaudhary', email: 'vishal@fittrack.com', password: 'admin123',
  age: 32, gender: 'male', weight: 83.5, height: 175, weightGoal: 78, weightGoalStart: 85,
  goalWeeks: 20, goalSetDate: '2024-11-01', activityLevel: 'active', workoutDays: 6,
  isAdmin: true, activeSplitId: 'ppl', joinDate: '2024-01-15',
  avatar: 'VC', units: 'metric',
}];
