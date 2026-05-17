import { gId } from '../utils/helpers';

// ─── EXERCISE FACTORIES ───────────────────────────────────────────────────────
const mkLowerA = () => [
  { id: gId(), exerciseId: 'squats', name: 'Squats', sets: 3, repsRange: '6-8', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' },
  { id: gId(), exerciseId: 'leg-extension', name: 'Leg Extension', sets: 3, repsRange: '12-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'leg-curls', name: 'Leg Curls', sets: 3, repsRange: '12-15', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [], notes: '', variants: ['Seated Leg Curls', 'Lying Leg Curls'] },
  { id: gId(), exerciseId: 'leg-abductor-machine', name: 'Leg Abductor Machine', sets: 3, repsRange: '15-20', muscle: 'Abductors', primaryMuscle: 'glutes', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'standing-calf-raises', name: 'Standing Calf Raises', sets: 3, repsRange: '15-20', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
];

const mkLowerB = () => [
  { id: gId(), exerciseId: 'leg-press', name: 'Leg Press', sets: 3, repsRange: '8-12', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Leg Press', 'Pendulum Squats'] },
  { id: gId(), exerciseId: 'leg-extension', name: 'Leg Extension', sets: 3, repsRange: '12-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'romanian-deadlift', name: 'Romanian Deadlift', sets: 3, repsRange: '10-12', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], notes: '' },
  { id: gId(), exerciseId: 'leg-adductor-machine', name: 'Leg Adductor Machine', sets: 3, repsRange: '15-20', muscle: 'Adductors', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'standing-calf-raises', name: 'Standing Calf Raises', sets: 3, repsRange: '15-20', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
];

const mkUpperA = () => [
  { id: gId(), exerciseId: 'smith-machine-incline-press', name: 'Smith Machine Incline Press', sets: 3, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' },
  { id: gId(), exerciseId: 'flat-dumbbell-press', name: 'Flat Dumbbell Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' },
  { id: gId(), exerciseId: 'wide-grip-lat-pulldowns', name: 'Wide Grip Lat Pulldowns', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
  { id: gId(), exerciseId: 'seated-horizontal-row', name: 'Seated Horizontal Row', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
  { id: gId(), exerciseId: 'lateral-raises', name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'biceps-cable-curls', name: 'Biceps Cable Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' },
  { id: gId(), exerciseId: 'hammer-curls', name: 'Hammer Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], sets: 2, repsRange: '12-15', notes: '' },
  { id: gId(), exerciseId: 'single-hand-tricep-pushdowns', name: 'Single Hand Tricep Pushdowns', sets: 2, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'single-hand-overhead-tricep-extension', name: 'Single Hand Overhead Tricep Extension', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], sets: 2, repsRange: '12-15', notes: '' },
];

const mkUpperB = () => [
  { id: gId(), exerciseId: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' },
  { id: gId(), exerciseId: 'chest-machine-press', name: 'Chest Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' },
  { id: gId(), exerciseId: 'close-grip-lat-pulldowns', name: 'Close Grip Lat Pulldowns', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
  { id: gId(), exerciseId: 't-bar-rows', name: 'T-Bar Rows', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['traps', 'biceps'], notes: '' },
  { id: gId(), exerciseId: 'lateral-raises', name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'rear-delt-flyes', name: 'Rear Delt Flyes', sets: 3, repsRange: '15-20', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' },
  { id: gId(), exerciseId: 'incline-bench-bicep-curls', name: 'Incline Bench Bicep Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'preacher-curls', name: 'Preacher Curls', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], sets: 2, repsRange: '12-15', notes: '' },
  { id: gId(), exerciseId: 'single-hand-overhead-cable-tricep-extension', name: 'Single Hand Overhead Cable Tricep Extension', sets: 2, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' },
  { id: gId(), exerciseId: 'single-hand-tricep-pushdowns', name: 'Single Hand Tricep Pushdowns', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], sets: 2, repsRange: '12-15', notes: '' },
];

// ─── SPLITS ───────────────────────────────────────────────────────────────────
export const INIT_SPLITS = [
  {
    id: 'ppl', name: 'Push Pull Legs', icon: 'Repeat', description: '6 days/week — Push Pull Legs × 2', color: '#E8540D',
    tier: 'intermediate',
    schedule: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'],
    days: [
      { id: 'ppl-pa', name: 'Push Day A', type: 'push', exercises: [{ id: gId(), exerciseId: 'flat-dumbbell-press', name: 'Flat Dumbbell Press', sets: 3, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), exerciseId: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), exerciseId: 'overhead-press', name: 'Overhead Press', sets: 3, repsRange: '8-10', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), exerciseId: 'lateral-raises', name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'tricep-pushdowns', name: 'Tricep Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'overhead-tricep-extension', name: 'Overhead Tricep Extension', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ppl-pla', name: 'Pull Day A', type: 'pull', exercises: [{ id: gId(), exerciseId: 'deadlift', name: 'Deadlift', sets: 3, repsRange: '4-6', muscle: 'Back/Hamstrings', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes', 'traps'], notes: '' }, { id: gId(), exerciseId: 'wide-grip-lat-pulldowns', name: 'Wide Grip Lat Pulldowns', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), exerciseId: 'horizontal-machine-row', name: 'Horizontal Machine Row', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), exerciseId: 'wide-grip-t-bar-rows', name: 'Wide Grip T-Bar Rows', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['traps', 'biceps'], notes: '' }, { id: gId(), exerciseId: 'bicep-curls', name: 'Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), exerciseId: 'hammer-curls', name: 'Hammer Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }] },
      { id: 'ppl-la', name: 'Legs Day A', type: 'legs', exercises: mkLowerA() },
      { id: 'ppl-pb', name: 'Push Day B', type: 'push', exercises: [{ id: gId(), exerciseId: 'chest-machine-press', name: 'Chest Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '', variants: ['Chest Machine Press', 'Bench Press'] }, { id: gId(), exerciseId: 'incline-smith-machine-press', name: 'Incline Smith Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), exerciseId: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', sets: 3, repsRange: '10-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), exerciseId: 'lateral-raises', name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'single-hand-rope-pushdowns', name: 'Single Hand Rope Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'single-hand-overhead-tricep-extension', name: 'Single Hand Overhead Tricep Extension', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ppl-plb', name: 'Pull Day B', type: 'pull', exercises: [{ id: gId(), exerciseId: 'close-grip-lat-pulldowns', name: 'Close Grip Lat Pulldowns', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), exerciseId: 'rear-delt-flyes', name: 'Rear Delt Flyes', sets: 3, repsRange: '15-20', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' }, { id: gId(), exerciseId: 'seated-cable-row-bar-', name: 'Seated Cable Row (Bar)', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), exerciseId: 'preacher-curls', name: 'Preacher Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'incline-bench-bicep-curls', name: 'Incline Bench Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ppl-lb', name: 'Legs Day B', type: 'legs', exercises: mkLowerB() },
      { id: 'ppl-r', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'ul4', name: 'Upper Lower (4 Day)', icon: 'Zap', description: '4 days — U L Rest U L Rest Rest', color: '#E8540D',
    tier: 'beginner',
    schedule: ['Upper', 'Lower', 'Rest', 'Upper', 'Lower', 'Rest', 'Rest'],
    days: [
      { id: 'ul4-ua', name: 'Upper A', type: 'upper', exercises: mkUpperA() },
      { id: 'ul4-la', name: 'Lower A', type: 'lower', exercises: mkLowerA() },
      { id: 'ul4-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'ul4-ub', name: 'Upper B', type: 'upper', exercises: mkUpperB() },
      { id: 'ul4-lb', name: 'Lower B', type: 'lower', exercises: mkLowerB() },
      { id: 'ul4-r2', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'ul4-r3', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'fb3', name: 'Full Body (3 Day)', icon: 'Target', description: 'Full Body – Rest – Repeat', color: '#E8540D',
    tier: 'beginner',
    schedule: ['Full Body', 'Rest', 'Full Body', 'Rest', 'Full Body', 'Rest', 'Rest'],
    days: [
      { id: 'fb3-a', name: 'Full Body A', type: 'full', exercises: [{ id: gId(), exerciseId: 'squats', name: 'Squats', sets: 3, repsRange: '6-8', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), exerciseId: 'flat-dumbbell-press', name: 'Flat Dumbbell Press', sets: 3, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), exerciseId: 'wide-grip-lat-pulldowns', name: 'Wide Grip Lat Pulldowns', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), exerciseId: 'leg-extension', name: 'Leg Extension', sets: 3, repsRange: '12-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'overhead-press', name: 'Overhead Press', sets: 3, repsRange: '10-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), exerciseId: 'biceps-cable-curls', name: 'Biceps Cable Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), exerciseId: 'single-hand-tricep-pushdowns', name: 'Single Hand Tricep Pushdowns', sets: 2, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'fb3-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'fb3-b', name: 'Full Body B', type: 'full', exercises: [{ id: gId(), exerciseId: 'leg-press', name: 'Leg Press', sets: 3, repsRange: '8-12', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Leg Press', 'Pendulum Squats'] }, { id: gId(), exerciseId: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), exerciseId: 'seated-horizontal-row', name: 'Seated Horizontal Row', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), exerciseId: 'leg-curls', name: 'Leg Curls', sets: 3, repsRange: '12-15', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [], notes: '', variants: ['Seated Leg Curls', 'Lying Leg Curls'] }, { id: gId(), exerciseId: 'lateral-raises', name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'hammer-curls', name: 'Hammer Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), exerciseId: 'single-hand-overhead-tricep-extension', name: 'Single Hand Overhead Tricep Extension', sets: 2, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'fb3-r2', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'fb3-c', name: 'Full Body C', type: 'full', exercises: [{ id: gId(), exerciseId: 'romanian-deadlift', name: 'Romanian Deadlift', sets: 3, repsRange: '10-12', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], notes: '' }, { id: gId(), exerciseId: 'chest-machine-press', name: 'Chest Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), exerciseId: 't-bar-rows', name: 'T-Bar Rows', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['traps', 'biceps'], notes: '' }, { id: gId(), exerciseId: 'leg-abductor-machine', name: 'Leg Abductor Machine', sets: 3, repsRange: '15-20', muscle: 'Abductors', primaryMuscle: 'glutes', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'rear-delt-flyes', name: 'Rear Delt Flyes', sets: 3, repsRange: '15-20', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' }, { id: gId(), exerciseId: 'incline-bench-bicep-curls', name: 'Incline Bench Bicep Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'close-grip-lat-pulldowns', name: 'Close Grip Lat Pulldowns', sets: 2, repsRange: '12-15', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }] },
      { id: 'fb3-r3', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'fb3-r4', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'ula', name: 'Upper Lower + Arms', icon: 'Dumbbell', description: 'U L Rest U L Arms Rest', color: '#E8540D',
    tier: 'intermediate',
    schedule: ['Upper', 'Lower', 'Rest', 'Upper', 'Lower', 'Arms', 'Rest'],
    days: [
      { id: 'ula-ua', name: 'Upper A', type: 'upper', exercises: mkUpperA() },
      { id: 'ula-la', name: 'Lower A', type: 'lower', exercises: mkLowerA() },
      { id: 'ula-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'ula-ub', name: 'Upper B', type: 'upper', exercises: mkUpperB() },
      { id: 'ula-lb', name: 'Lower B', type: 'lower', exercises: mkLowerB() },
      { id: 'ula-arms', name: 'Arms Day', type: 'arms', exercises: [{ id: gId(), exerciseId: 'shoulder-press', name: 'Shoulder Press', sets: 3, repsRange: '10-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), exerciseId: 'lateral-raises', name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'single-hand-tricep-pushdowns', name: 'Single Hand Tricep Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'single-hand-overhead-tricep-extensions', name: 'Single Hand Overhead Tricep Extensions', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'biceps-cable-curls', name: 'Biceps Cable Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), exerciseId: 'incline-bench-bicep-curls', name: 'Incline Bench Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ula-r2', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'ul6', name: 'Upper Lower (6 Day)', icon: 'Trophy', description: 'U L U L U L Rest — High Frequency', color: '#E8540D',
    tier: 'advanced',
    schedule: ['Upper', 'Lower', 'Upper', 'Lower', 'Upper', 'Lower', 'Rest'],
    days: [
      { id: 'ul6-ua1', name: 'Upper A', type: 'upper', exercises: mkUpperA() },
      { id: 'ul6-la1', name: 'Lower A', type: 'lower', exercises: mkLowerA() },
      { id: 'ul6-ub', name: 'Upper B', type: 'upper', exercises: mkUpperB() },
      { id: 'ul6-lb', name: 'Lower B', type: 'lower', exercises: mkLowerB() },
      { id: 'ul6-ua2', name: 'Upper A (Repeat)', type: 'upper', exercises: mkUpperA() },
      { id: 'ul6-la2', name: 'Lower A (Repeat)', type: 'lower', exercises: mkLowerA() },
      { id: 'ul6-r', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    // ─── NEW: Full Body 6-Day (Advanced) ──────────────────────────────────────
    id: 'fb6', name: 'Full Body 6-Day', icon: 'Flame', description: '6 days/week — Full body from every angle', color: '#E8540D',
    tier: 'advanced',
    schedule: ['Push Focus', 'Pull Focus', 'Lower Focus', 'Rest', 'Push Hyp', 'Pull Hyp', 'Lower+Arms'],
    days: [
      {
        id: 'fb6-d1', name: 'Day 1 — Heavy Push', type: 'fullbody', subtype: 'Push Emphasis',
        exercises: [
          { id: gId(), exerciseId: 'barbell-back-squat', name: 'Barbell Back Squat', sets: 3, repsRange: '5-8', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' },
          { id: gId(), exerciseId: 'barbell-bench-press', name: 'Barbell Bench Press', sets: 4, repsRange: '6-8', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' },
          { id: gId(), exerciseId: 'bent-over-barbell-row', name: 'Bent-Over Barbell Row', sets: 3, repsRange: '6-8', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
          { id: gId(), exerciseId: 'dumbbell-shoulder-press', name: 'Dumbbell Shoulder Press', sets: 3, repsRange: '8-10', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' },
          { id: gId(), exerciseId: 'romanian-deadlift', name: 'Romanian Deadlift', sets: 2, repsRange: '8-10', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], notes: '' },
          { id: gId(), exerciseId: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', sets: 3, repsRange: '10-12', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' },
          { id: gId(), exerciseId: 'standing-calf-raise', name: 'Standing Calf Raise', sets: 3, repsRange: '10-15', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
        ]
      },
      {
        id: 'fb6-d2', name: 'Day 2 — Heavy Pull', type: 'fullbody', subtype: 'Pull Emphasis',
        exercises: [
          { id: gId(), exerciseId: 'conventional-deadlift', name: 'Conventional Deadlift', sets: 3, repsRange: '3-6', muscle: 'Back/Hamstrings', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes', 'traps'], notes: '' },
          { id: gId(), exerciseId: 'weighted-pull-up', name: 'Weighted Pull-Up', sets: 3, repsRange: '6-8', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '', variants: ['Weighted Pull-Up', 'Lat Pulldown'] },
          { id: gId(), exerciseId: 'incline-barbell-bench-press', name: 'Incline Barbell Bench Press', sets: 3, repsRange: '6-8', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '', variants: ['Incline Barbell Bench Press', 'Incline Dumbbell Press'] },
          { id: gId(), exerciseId: 'seated-cable-row', name: 'Seated Cable Row', sets: 3, repsRange: '8-10', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
          { id: gId(), exerciseId: 'leg-press', name: 'Leg Press', sets: 3, repsRange: '8-10', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' },
          { id: gId(), exerciseId: 'barbell-curl', name: 'Barbell Curl', sets: 3, repsRange: '8-12', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '', variants: ['Barbell Curl', 'Dumbbell Curl'] },
          { id: gId(), exerciseId: 'seated-calf-raise', name: 'Seated Calf Raise', sets: 3, repsRange: '10-15', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
        ]
      },
      {
        id: 'fb6-d3', name: 'Day 3 — Lower Emphasis', type: 'fullbody', subtype: 'Lower Emphasis',
        exercises: [
          { id: gId(), exerciseId: 'front-squat', name: 'Front Squat', sets: 4, repsRange: '6-8', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Front Squat', 'High-Bar Back Squat'] },
          { id: gId(), exerciseId: 'romanian-deadlift', name: 'Romanian Deadlift', sets: 3, repsRange: '8-10', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], notes: '' },
          { id: gId(), exerciseId: 'walking-dumbbell-lunge', name: 'Walking Dumbbell Lunge', sets: 3, repsRange: '8-10', muscle: 'Quads/Glutes', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' },
          { id: gId(), exerciseId: 'leg-curl', name: 'Leg Curl', sets: 3, repsRange: '10-12', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [], notes: '', variants: ['Seated Leg Curls', 'Lying Leg Curls'] },
          { id: gId(), exerciseId: 'standing-barbell-overhead-press', name: 'Standing Barbell Overhead Press', sets: 3, repsRange: '6-8', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' },
          { id: gId(), exerciseId: 'chin-up', name: 'Chin-Up', sets: 3, repsRange: '8-10', muscle: 'Back/Biceps', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '', variants: ['Chin-Up (Assisted)', 'Chin-Up (Weighted)'] },
        ]
      },
      { id: 'fb6-r', name: 'Rest Day', type: 'rest', exercises: [] },
      {
        id: 'fb6-d4', name: 'Day 4 — Push Hypertrophy', type: 'fullbody', subtype: 'Push Hypertrophy',
        exercises: [
          { id: gId(), exerciseId: 'flat-barbell-bench-press', name: 'Flat Barbell Bench Press', sets: 3, repsRange: '8-10', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '', variants: ['Flat Barbell Bench Press', 'Flat Dumbbell Press'] },
          { id: gId(), exerciseId: 'incline-dumbbell-press', name: 'Incline Dumbbell Press', sets: 3, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' },
          { id: gId(), exerciseId: 'machine-shoulder-press', name: 'Machine Shoulder Press', sets: 3, repsRange: '8-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '', variants: ['Machine Shoulder Press', 'Dumbbell Shoulder Press'] },
          { id: gId(), exerciseId: 'lateral-raise', name: 'Lateral Raise', sets: 3, repsRange: '12-15', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '', variants: ['Dumbbell Lateral Raise', 'Cable Lateral Raise'] },
          { id: gId(), exerciseId: 'cable-fly', name: 'Cable Fly', sets: 3, repsRange: '12-15', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: [], notes: '', variants: ['Cable Fly', 'Pec-Deck Fly'] },
          { id: gId(), exerciseId: 'overhead-triceps-extension', name: 'Overhead Triceps Extension', sets: 3, repsRange: '10-12', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '', variants: ['Cable Overhead Triceps Extension', 'Dumbbell Overhead Triceps Extension'] },
          { id: gId(), exerciseId: 'leg-extension', name: 'Leg Extension', sets: 3, repsRange: '10-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
        ]
      },
      {
        id: 'fb6-d5', name: 'Day 5 — Pull Hypertrophy', type: 'fullbody', subtype: 'Pull Hypertrophy',
        exercises: [
          { id: gId(), exerciseId: 'chest-supported-row', name: 'Chest-Supported Row', sets: 3, repsRange: '8-10', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '', variants: ['Chest-Supported Row', 'Barbell Row'] },
          { id: gId(), exerciseId: 'lat-pulldown', name: 'Lat Pulldown', sets: 3, repsRange: '8-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
          { id: gId(), exerciseId: 'one-arm-dumbbell-row', name: 'One-Arm Dumbbell Row', sets: 3, repsRange: '8-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
          { id: gId(), exerciseId: 'face-pull', name: 'Face Pull', sets: 3, repsRange: '12-15', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' },
          { id: gId(), exerciseId: 'hammer-curl', name: 'Hammer Curl', sets: 3, repsRange: '10-12', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' },
          { id: gId(), exerciseId: 'ez-bar-curl', name: 'EZ-Bar Curl', sets: 3, repsRange: '10-12', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '', variants: ['EZ-Bar Curl', 'Cable Curl'] },
          { id: gId(), exerciseId: 'barbell-hip-thrust', name: 'Barbell Hip Thrust', sets: 3, repsRange: '8-12', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], notes: '', variants: ['Barbell Hip Thrust', 'Machine Hip Thrust'] },
        ]
      },
      {
        id: 'fb6-d6', name: 'Day 6 — Lower + Arms', type: 'fullbody', subtype: 'Lower + Arms/Delts',
        exercises: [
          { id: gId(), exerciseId: 'back-squat', name: 'Back Squat', sets: 3, repsRange: '6-10', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Back Squat', 'Hack Squat'] },
          { id: gId(), exerciseId: 'leg-press', name: 'Leg Press', sets: 3, repsRange: '8-12', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Leg Press', 'Bulgarian Split Squat'] },
          { id: gId(), exerciseId: 'leg-curl', name: 'Leg Curl', sets: 3, repsRange: '10-12', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [], notes: '', variants: ['Seated Leg Curls', 'Lying Leg Curls'] },
          { id: gId(), exerciseId: 'standing-calf-raise', name: 'Standing Calf Raise', sets: 3, repsRange: '10-15', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
          { id: gId(), exerciseId: 'seated-dumbbell-lateral-raise', name: 'Seated Dumbbell Lateral Raise', sets: 3, repsRange: '12-15', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' },
          { id: gId(), exerciseId: 'cable-triceps-pushdown', name: 'Cable Triceps Pushdown', sets: 3, repsRange: '10-12', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' },
          { id: gId(), exerciseId: 'alternating-dumbbell-curl', name: 'Alternating Dumbbell Curl', sets: 3, repsRange: '10-12', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' },
        ]
      },
    ]
  },
  {
    id: 'home', name: 'Home Workouts', icon: 'Home', description: 'Bodyweight + Yoga — no gym needed', color: '#E8540D',
    tier: 'specialty',
    schedule: ['Beginner', 'Yoga', 'Intermediate', 'Yoga', 'Beginner', 'Rest', 'Rest'],
    days: [
      { id: 'home-beg', name: 'Beginner Bodyweight', type: 'home', exercises: [{ id: gId(), exerciseId: 'push-ups', name: 'Push-ups', sets: 3, repsRange: 'max', muscle: 'Chest/Triceps', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), exerciseId: 'pike-push-ups', name: 'Pike Push-ups', sets: 3, repsRange: '10-15', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), exerciseId: 'tricep-dips-chair-', name: 'Tricep Dips (Chair)', sets: 3, repsRange: '10-12', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'], notes: '' }, { id: gId(), exerciseId: 'australian-pull-ups', name: 'Australian Pull-ups', sets: 3, repsRange: '8-12', muscle: 'Back/Biceps', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '' }, { id: gId(), exerciseId: 'bodyweight-squats', name: 'Bodyweight Squats', sets: 3, repsRange: '20-25', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), exerciseId: 'walking-lunges', name: 'Walking Lunges', sets: 3, repsRange: '12 each', muscle: 'Quads/Glutes', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), exerciseId: 'glute-bridges', name: 'Glute Bridges', sets: 3, repsRange: '15-20', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], notes: '' }, { id: gId(), exerciseId: 'plank', name: 'Plank', sets: 3, repsRange: '30-45s', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: ['shoulders'], notes: '' }, { id: gId(), exerciseId: 'mountain-climbers', name: 'Mountain Climbers', sets: 3, repsRange: '20 each', muscle: 'Core/Cardio', primaryMuscle: 'abs', secondaryMuscles: [], notes: '' }] },
      { id: 'home-yoga', name: 'Yoga Flow', type: 'yoga', exercises: [{ id: gId(), exerciseId: 'surya-namaskar-sun-salutation-', name: 'Surya Namaskar (Sun Salutation)', sets: 5, repsRange: '1 round each side', muscle: 'Full Body', primaryMuscle: 'abs', secondaryMuscles: ['quads', 'back'], notes: '12 poses per round' }, { id: gId(), exerciseId: 'adho-mukha-svanasana-downward-dog-', name: 'Adho Mukha Svanasana (Downward Dog)', sets: 3, repsRange: '5 breaths', muscle: 'Hamstrings/Back', primaryMuscle: 'hamstrings', secondaryMuscles: ['back', 'calves'], notes: '' }, { id: gId(), exerciseId: 'virabhadrasana-i-ii-warriors-', name: 'Virabhadrasana I & II (Warriors)', sets: 3, repsRange: '5 breaths each', muscle: 'Hip Flexors/Legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes'], notes: '' }, { id: gId(), exerciseId: 'bhujangasana-cobra-', name: 'Bhujangasana (Cobra)', sets: 3, repsRange: '5 breaths', muscle: 'Back/Chest', primaryMuscle: 'back', secondaryMuscles: ['chest'], notes: '' }, { id: gId(), exerciseId: 'setu-bandhasana-bridge-', name: 'Setu Bandhasana (Bridge)', sets: 3, repsRange: '8 breaths', muscle: 'Glutes/Back', primaryMuscle: 'glutes', secondaryMuscles: ['back', 'hamstrings'], notes: '' }, { id: gId(), exerciseId: 'paschimottanasana-forward-bend-', name: 'Paschimottanasana (Forward Bend)', sets: 2, repsRange: '10 breaths', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['back'], notes: '' }, { id: gId(), exerciseId: 'ardha-matsyendrasana-spinal-twist-', name: 'Ardha Matsyendrasana (Spinal Twist)', sets: 2, repsRange: '5 breaths each', muscle: 'Spine', primaryMuscle: 'abs', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'balasana-child-pose-', name: 'Balasana (Child Pose)', sets: 1, repsRange: '10 breaths', muscle: 'Recovery', primaryMuscle: null, secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'savasana', name: 'Savasana', sets: 1, repsRange: '5 minutes', muscle: 'Full Recovery', primaryMuscle: null, secondaryMuscles: [], notes: '' }] },
      { id: 'home-int', name: 'Intermediate Bodyweight', type: 'home', exercises: [{ id: gId(), exerciseId: 'diamond-push-ups', name: 'Diamond Push-ups', sets: 3, repsRange: '10-15', muscle: 'Chest/Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'], notes: '' }, { id: gId(), exerciseId: 'decline-push-ups', name: 'Decline Push-ups', sets: 3, repsRange: '10-15', muscle: 'Upper Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), exerciseId: 'pull-ups', name: 'Pull-ups', sets: 3, repsRange: 'max', muscle: 'Back/Biceps', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '' }, { id: gId(), exerciseId: 'chin-ups', name: 'Chin-ups', sets: 3, repsRange: 'max', muscle: 'Biceps/Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '' }, { id: gId(), exerciseId: 'bulgarian-split-squats', name: 'Bulgarian Split Squats', sets: 3, repsRange: '10-12 each', muscle: 'Quads/Glutes', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), exerciseId: 'jump-squats', name: 'Jump Squats', sets: 3, repsRange: '15-20', muscle: 'Quads/Cardio', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'calves'], notes: '' }, { id: gId(), exerciseId: 'single-leg-glute-bridges', name: 'Single-Leg Glute Bridges', sets: 3, repsRange: '12-15 each', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], notes: '' }, { id: gId(), exerciseId: 'hollow-body-hold', name: 'Hollow Body Hold', sets: 3, repsRange: '20-30s', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [], notes: '' }, { id: gId(), exerciseId: 'burpees', name: 'Burpees', sets: 3, repsRange: '10-12', muscle: 'Full Body', primaryMuscle: 'quads', secondaryMuscles: ['chest', 'abs', 'calves'], notes: '' }] },
      { id: 'home-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'home-r2', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'pl', name: 'Powerlifting', icon: 'Award', description: 'Squat · Bench · Deadlift programming', color: '#E8540D',
    tier: 'specialty',
    comingSoon: true, schedule: [], days: [{ id: 'pl-cs', name: 'Coming Soon', type: 'rest', exercises: [] }]
  },
];
