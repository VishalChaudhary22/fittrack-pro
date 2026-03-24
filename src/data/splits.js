import { gId } from '../utils/helpers';

// ─── EXERCISE FACTORIES ───────────────────────────────────────────────────────
const mkLowerA = () => [
  { id: gId(), name: 'Squats', sets: 4, repsRange: '6-8', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' },
  { id: gId(), name: 'Leg Extension', sets: 3, repsRange: '12-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Leg Curls', sets: 3, repsRange: '12-15', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [], notes: '', variants: ['Seated Leg Curls', 'Lying Leg Curls'] },
  { id: gId(), name: 'Leg Abductor Machine', sets: 3, repsRange: '15-20', muscle: 'Abductors', primaryMuscle: 'glutes', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Standing Calf Raises', sets: 4, repsRange: '15-20', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
];

const mkLowerB = () => [
  { id: gId(), name: 'Leg Press', sets: 4, repsRange: '8-12', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Leg Press', 'Pendulum Squats'] },
  { id: gId(), name: 'Leg Extension', sets: 3, repsRange: '12-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Romanian Deadlift', sets: 4, repsRange: '10-12', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], notes: '' },
  { id: gId(), name: 'Leg Adductor Machine', sets: 3, repsRange: '15-20', muscle: 'Adductors', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Standing Calf Raises', sets: 4, repsRange: '15-20', muscle: 'Calves', primaryMuscle: 'calves', secondaryMuscles: [], notes: '' },
];

const mkUpperA = () => [
  { id: gId(), name: 'Smith Machine Incline Press', sets: 4, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' },
  { id: gId(), name: 'Flat Dumbbell Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' },
  { id: gId(), name: 'Wide Grip Lat Pulldowns', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
  { id: gId(), name: 'Seated Horizontal Row', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
  { id: gId(), name: 'Lateral Raises', sets: 4, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Biceps Cable Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' },
  { id: gId(), name: 'Single Hand Tricep Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' },
];

const mkUpperB = () => [
  { id: gId(), name: 'Incline Dumbbell Press', sets: 4, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' },
  { id: gId(), name: 'Chest Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' },
  { id: gId(), name: 'Close Grip Lat Pulldowns', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' },
  { id: gId(), name: 'T-Bar Rows', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['traps', 'biceps'], notes: '' },
  { id: gId(), name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Rear Delt Flyes', sets: 3, repsRange: '15-20', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' },
  { id: gId(), name: 'Incline Bench Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' },
  { id: gId(), name: 'Single Hand Overhead Cable Tricep Extension', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' },
];

// ─── SPLITS ───────────────────────────────────────────────────────────────────
export const INIT_SPLITS = [
  {
    id: 'ppl', name: 'Push Pull Legs', icon: 'Repeat', description: '6 days/week — Push Pull Legs × 2', color: '#E8540D',
    schedule: ['Push', 'Pull', 'Legs', 'Push', 'Pull', 'Legs', 'Rest'],
    days: [
      { id: 'ppl-pa', name: 'Push Day A', type: 'push', exercises: [{ id: gId(), name: 'Flat Dumbbell Press', sets: 4, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), name: 'Incline Dumbbell Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), name: 'Overhead Press', sets: 4, repsRange: '8-10', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), name: 'Lateral Raises', sets: 4, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Tricep Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Overhead Tricep Extension', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ppl-pla', name: 'Pull Day A', type: 'pull', exercises: [{ id: gId(), name: 'Deadlift', sets: 4, repsRange: '4-6', muscle: 'Back/Hamstrings', primaryMuscle: 'back', secondaryMuscles: ['hamstrings', 'glutes', 'traps'], notes: '' }, { id: gId(), name: 'Wide Grip Lat Pulldowns', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), name: 'Horizontal Machine Row', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), name: 'Wide Grip T-Bar Rows', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['traps', 'biceps'], notes: '' }, { id: gId(), name: 'Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), name: 'Hammer Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }] },
      { id: 'ppl-la', name: 'Legs Day A', type: 'legs', exercises: mkLowerA() },
      { id: 'ppl-pb', name: 'Push Day B', type: 'push', exercises: [{ id: gId(), name: 'Chest Machine Press', sets: 4, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '', variants: ['Chest Machine Press', 'Bench Press'] }, { id: gId(), name: 'Incline Smith Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), name: 'Dumbbell Shoulder Press', sets: 4, repsRange: '10-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), name: 'Lateral Raises', sets: 4, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Single Hand Rope Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Single Hand Overhead Tricep Extension', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ppl-plb', name: 'Pull Day B', type: 'pull', exercises: [{ id: gId(), name: 'Close Grip Lat Pulldowns', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), name: 'Rear Delt Flyes', sets: 3, repsRange: '15-20', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' }, { id: gId(), name: 'Seated Cable Row (Bar)', sets: 4, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), name: 'Preacher Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Incline Bench Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ppl-lb', name: 'Legs Day B', type: 'legs', exercises: mkLowerB() },
      { id: 'ppl-r', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'ul4', name: 'Upper Lower (4 Day)', icon: 'Zap', description: '4 days — U L Rest U L Rest Rest', color: '#E8540D',
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
    schedule: ['Full Body', 'Rest', 'Full Body', 'Rest', 'Full Body', 'Rest', 'Rest'],
    days: [
      { id: 'fb3-a', name: 'Full Body A', type: 'full', exercises: [{ id: gId(), name: 'Squats', sets: 4, repsRange: '6-8', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), name: 'Flat Dumbbell Press', sets: 4, repsRange: '8-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), name: 'Wide Grip Lat Pulldowns', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), name: 'Leg Extension', sets: 3, repsRange: '12-15', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Overhead Press', sets: 3, repsRange: '10-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), name: 'Biceps Cable Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), name: 'Single Hand Tricep Pushdowns', sets: 2, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'fb3-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'fb3-b', name: 'Full Body B', type: 'full', exercises: [{ id: gId(), name: 'Leg Press', sets: 4, repsRange: '8-12', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '', variants: ['Leg Press', 'Pendulum Squats'] }, { id: gId(), name: 'Incline Dumbbell Press', sets: 4, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), name: 'Seated Horizontal Row', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }, { id: gId(), name: 'Leg Curls', sets: 3, repsRange: '12-15', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: [], notes: '', variants: ['Seated Leg Curls', 'Lying Leg Curls'] }, { id: gId(), name: 'Lateral Raises', sets: 3, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Hammer Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), name: 'Single Hand Overhead Tricep Extension', sets: 2, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }] },
      { id: 'fb3-r2', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'fb3-c', name: 'Full Body C', type: 'full', exercises: [{ id: gId(), name: 'Romanian Deadlift', sets: 4, repsRange: '10-12', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['glutes', 'back'], notes: '' }, { id: gId(), name: 'Chest Machine Press', sets: 3, repsRange: '10-12', muscle: 'Chest', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), name: 'T-Bar Rows', sets: 3, repsRange: '10-12', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['traps', 'biceps'], notes: '' }, { id: gId(), name: 'Leg Abductor Machine', sets: 3, repsRange: '15-20', muscle: 'Abductors', primaryMuscle: 'glutes', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Rear Delt Flyes', sets: 3, repsRange: '15-20', muscle: 'Rear Delts', primaryMuscle: 'traps', secondaryMuscles: ['shoulders'], notes: '' }, { id: gId(), name: 'Incline Bench Bicep Curls', sets: 2, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Close Grip Lat Pulldowns', sets: 2, repsRange: '12-15', muscle: 'Back', primaryMuscle: 'back', secondaryMuscles: ['biceps', 'traps'], notes: '' }] },
      { id: 'fb3-r3', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'fb3-r4', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'ula', name: 'Upper Lower + Arms', icon: 'Dumbbell', description: 'U L Rest U L Arms Rest', color: '#E8540D',
    schedule: ['Upper', 'Lower', 'Rest', 'Upper', 'Lower', 'Arms', 'Rest'],
    days: [
      { id: 'ula-ua', name: 'Upper A', type: 'upper', exercises: mkUpperA() },
      { id: 'ula-la', name: 'Lower A', type: 'lower', exercises: mkLowerA() },
      { id: 'ula-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'ula-ub', name: 'Upper B', type: 'upper', exercises: mkUpperB() },
      { id: 'ula-lb', name: 'Lower B', type: 'lower', exercises: mkLowerB() },
      { id: 'ula-arms', name: 'Arms Day', type: 'arms', exercises: [{ id: gId(), name: 'Shoulder Press', sets: 3, repsRange: '10-12', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), name: 'Lateral Raises', sets: 4, repsRange: '15-20', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Single Hand Tricep Pushdowns', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Single Hand Overhead Tricep Extensions', sets: 3, repsRange: '12-15', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Biceps Cable Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: ['forearms'], notes: '' }, { id: gId(), name: 'Incline Bench Bicep Curls', sets: 3, repsRange: '12-15', muscle: 'Biceps', primaryMuscle: 'biceps', secondaryMuscles: [], notes: '' }] },
      { id: 'ula-r2', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'ul6', name: 'Upper Lower (6 Day)', icon: 'Trophy', description: 'U L U L U L Rest — High Frequency', color: '#E8540D',
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
    id: 'home', name: 'Home Workouts', icon: 'Home', description: 'Bodyweight + Yoga — no gym needed', color: '#E8540D',
    schedule: ['Beginner', 'Yoga', 'Intermediate', 'Yoga', 'Beginner', 'Rest', 'Rest'],
    days: [
      { id: 'home-beg', name: 'Beginner Bodyweight', type: 'home', exercises: [{ id: gId(), name: 'Push-ups', sets: 3, repsRange: 'max', muscle: 'Chest/Triceps', primaryMuscle: 'chest', secondaryMuscles: ['triceps', 'shoulders'], notes: '' }, { id: gId(), name: 'Pike Push-ups', sets: 3, repsRange: '10-15', muscle: 'Shoulders', primaryMuscle: 'shoulders', secondaryMuscles: ['triceps'], notes: '' }, { id: gId(), name: 'Tricep Dips (Chair)', sets: 3, repsRange: '10-12', muscle: 'Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'], notes: '' }, { id: gId(), name: 'Australian Pull-ups', sets: 3, repsRange: '8-12', muscle: 'Back/Biceps', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '' }, { id: gId(), name: 'Bodyweight Squats', sets: 3, repsRange: '20-25', muscle: 'Quads', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), name: 'Walking Lunges', sets: 3, repsRange: '12 each', muscle: 'Quads/Glutes', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), name: 'Glute Bridges', sets: 3, repsRange: '15-20', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], notes: '' }, { id: gId(), name: 'Plank', sets: 3, repsRange: '30-45s', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: ['shoulders'], notes: '' }, { id: gId(), name: 'Mountain Climbers', sets: 3, repsRange: '20 each', muscle: 'Core/Cardio', primaryMuscle: 'abs', secondaryMuscles: [], notes: '' }] },
      { id: 'home-yoga', name: 'Yoga Flow', type: 'yoga', exercises: [{ id: gId(), name: 'Surya Namaskar (Sun Salutation)', sets: 5, repsRange: '1 round each side', muscle: 'Full Body', primaryMuscle: 'abs', secondaryMuscles: ['quads', 'back'], notes: '12 poses per round' }, { id: gId(), name: 'Adho Mukha Svanasana (Downward Dog)', sets: 3, repsRange: '5 breaths', muscle: 'Hamstrings/Back', primaryMuscle: 'hamstrings', secondaryMuscles: ['back', 'calves'], notes: '' }, { id: gId(), name: 'Virabhadrasana I & II (Warriors)', sets: 3, repsRange: '5 breaths each', muscle: 'Hip Flexors/Legs', primaryMuscle: 'quads', secondaryMuscles: ['glutes'], notes: '' }, { id: gId(), name: 'Bhujangasana (Cobra)', sets: 3, repsRange: '5 breaths', muscle: 'Back/Chest', primaryMuscle: 'back', secondaryMuscles: ['chest'], notes: '' }, { id: gId(), name: 'Setu Bandhasana (Bridge)', sets: 3, repsRange: '8 breaths', muscle: 'Glutes/Back', primaryMuscle: 'glutes', secondaryMuscles: ['back', 'hamstrings'], notes: '' }, { id: gId(), name: 'Paschimottanasana (Forward Bend)', sets: 2, repsRange: '10 breaths', muscle: 'Hamstrings', primaryMuscle: 'hamstrings', secondaryMuscles: ['back'], notes: '' }, { id: gId(), name: 'Ardha Matsyendrasana (Spinal Twist)', sets: 2, repsRange: '5 breaths each', muscle: 'Spine', primaryMuscle: 'abs', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Balasana (Child Pose)', sets: 1, repsRange: '10 breaths', muscle: 'Recovery', primaryMuscle: null, secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Savasana', sets: 1, repsRange: '5 minutes', muscle: 'Full Recovery', primaryMuscle: null, secondaryMuscles: [], notes: '' }] },
      { id: 'home-int', name: 'Intermediate Bodyweight', type: 'home', exercises: [{ id: gId(), name: 'Diamond Push-ups', sets: 4, repsRange: '10-15', muscle: 'Chest/Triceps', primaryMuscle: 'triceps', secondaryMuscles: ['chest', 'shoulders'], notes: '' }, { id: gId(), name: 'Decline Push-ups', sets: 3, repsRange: '10-15', muscle: 'Upper Chest', primaryMuscle: 'chest', secondaryMuscles: ['shoulders', 'triceps'], notes: '' }, { id: gId(), name: 'Pull-ups', sets: 4, repsRange: 'max', muscle: 'Back/Biceps', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '' }, { id: gId(), name: 'Chin-ups', sets: 3, repsRange: 'max', muscle: 'Biceps/Back', primaryMuscle: 'back', secondaryMuscles: ['biceps'], notes: '' }, { id: gId(), name: 'Bulgarian Split Squats', sets: 3, repsRange: '10-12 each', muscle: 'Quads/Glutes', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'hamstrings'], notes: '' }, { id: gId(), name: 'Jump Squats', sets: 3, repsRange: '15-20', muscle: 'Quads/Cardio', primaryMuscle: 'quads', secondaryMuscles: ['glutes', 'calves'], notes: '' }, { id: gId(), name: 'Single-Leg Glute Bridges', sets: 3, repsRange: '12-15 each', muscle: 'Glutes', primaryMuscle: 'glutes', secondaryMuscles: ['hamstrings'], notes: '' }, { id: gId(), name: 'Hollow Body Hold', sets: 3, repsRange: '20-30s', muscle: 'Core', primaryMuscle: 'abs', secondaryMuscles: [], notes: '' }, { id: gId(), name: 'Burpees', sets: 3, repsRange: '10-12', muscle: 'Full Body', primaryMuscle: 'quads', secondaryMuscles: ['chest', 'abs', 'calves'], notes: '' }] },
      { id: 'home-r1', name: 'Rest Day', type: 'rest', exercises: [] },
      { id: 'home-r2', name: 'Rest Day', type: 'rest', exercises: [] },
    ]
  },
  {
    id: 'pl', name: 'Powerlifting', icon: 'Award', description: 'Squat · Bench · Deadlift programming', color: '#E8540D',
    comingSoon: true, schedule: [], days: [{ id: 'pl-cs', name: 'Coming Soon', type: 'rest', exercises: [] }]
  },
];
