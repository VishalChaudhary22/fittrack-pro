// ─── Exercise swap alternatives ─────────────────────────────────────────────
// The swap-suggestion table. Lived as verbatim copies inside the V1 and
// Volt Workout pages; extracted here in Q-3 so all three skins share one
// source. Exercise names are canonicalised (2026-11): movements that
// had duplicate names live under one canonical entry — see
// data/exerciseAliases.js for the alias map.
export const EXERCISE_ALTERNATIVES = {
  // ═══════════════════════════════════════════════════════════════════════
  // CHEST — Horizontal Push (Compound)
  // ═══════════════════════════════════════════════════════════════════════
  'Incline Smith Machine Press':            ['Incline Barbell Bench Press', 'Incline Dumbbell Press', 'Low-to-High Cable Fly'],
  'Flat Dumbbell Press':                    ['Barbell Bench Press', 'Chest Machine Press', 'Dumbbell Floor Press'],
  'Barbell Bench Press':                    ['Flat Dumbbell Press', 'Chest Machine Press', 'Weighted Dips'],
  'Incline Dumbbell Press':                 ['Incline Smith Machine Press', 'Incline Barbell Bench Press', 'Incline Machine Press'],
  'Incline Barbell Bench Press':            ['Incline Dumbbell Press', 'Incline Smith Machine Press', 'Low-to-High Cable Fly'],
  'Chest Machine Press':                    ['Barbell Bench Press', 'Flat Dumbbell Press', 'Weighted Dips'],
  // CHEST — Isolation
  'Cable Fly':                              ['Pec Deck Fly', 'Dumbbell Fly', 'Low-to-High Cable Fly'],
  'Pec Deck Fly':                           ['Cable Fly', 'Dumbbell Fly', 'Svend Press'],
  'Dumbbell Fly':                           ['Cable Fly', 'Pec Deck Fly', 'Low-to-High Cable Fly'],

  // ═══════════════════════════════════════════════════════════════════════
  // BACK — Vertical Pull
  // ═══════════════════════════════════════════════════════════════════════
  'Wide Grip Lat Pulldowns':                ['Close Grip Lat Pulldowns', 'Pull-ups', 'Straight-Arm Lat Pulldown'],
  'Close Grip Lat Pulldowns':               ['Wide Grip Lat Pulldowns', 'Chin-ups', 'Neutral Grip Lat Pulldown'],
  'Lat Pulldown':                           ['Pull-ups', 'Close Grip Lat Pulldowns', 'Wide Grip Lat Pulldowns'],
  'Pull-ups':                               ['Wide Grip Lat Pulldowns', 'Chin-ups', 'Assisted Pull-ups'],
  'Chin-ups':                               ['Close Grip Lat Pulldowns', 'Pull-ups', 'Neutral Grip Lat Pulldown'],
  // BACK — Horizontal Pull (Compound)
  'Seated Cable Row':                       ['Dumbbell Row', 'Barbell Row', 'T-Bar Rows', 'Chest-Supported Row'],
  'T-Bar Rows':                             ['Seated Cable Row', 'Barbell Row', 'Chest-Supported Row'],
  'Barbell Row':                            ['T-Bar Rows', 'Dumbbell Row', 'Chest-Supported Row'],
  'Chest-Supported Row':                    ['T-Bar Rows', 'Seated Cable Row', 'Barbell Row'],
  'Dumbbell Row':                           ['Barbell Row', 'Seated Cable Row', 'T-Bar Rows', 'Chest-Supported Row'],
  'Horizontal Machine Row':                 ['Seated Cable Row', 'Dumbbell Row', 'T-Bar Rows'],
  'Wide Grip T-Bar Rows':                   ['T-Bar Rows', 'Barbell Row', 'Dumbbell Row'],
  // BACK — Compound (Deadlift patterns)
  'Deadlift':                               ['Trap Bar Deadlift', 'Block Pull', 'Sumo Deadlift'],
  // BACK — Isolation
  'Straight-Arm Lat Pulldown':              ['Dumbbell Pullover', 'Wide Grip Lat Pulldowns'],

  // ═══════════════════════════════════════════════════════════════════════
  // SHOULDERS — Compound (Overhead Press)
  // ═══════════════════════════════════════════════════════════════════════
  'Overhead Press':                         ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Arnold Press'],
  'Dumbbell Shoulder Press':                ['Overhead Press', 'Machine Shoulder Press', 'Arnold Press'],
  'Shoulder Press':                         ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Arnold Press'],
  'Machine Shoulder Press':                 ['Dumbbell Shoulder Press', 'Overhead Press', 'Arnold Press'],
  'Standing Barbell Overhead Press':        ['Dumbbell Shoulder Press', 'Machine Shoulder Press', 'Push Press'],
  // SHOULDERS — Isolation (Lateral)
  'Lateral Raises':                         ['Cable Lateral Raises', 'Machine Lateral Raise', 'Seated Dumbbell Lateral Raises'],
  'Cable Lateral Raises':                   ['Lateral Raises', 'Machine Lateral Raise', 'Seated Dumbbell Lateral Raises'],
  'Seated Dumbbell Lateral Raises':         ['Lateral Raises', 'Cable Lateral Raises', 'Machine Lateral Raise'],
  // SHOULDERS — Isolation (Rear delts)
  'Rear Delt Flyes':                        ['Face Pulls', 'Cable Reverse Fly', 'Band Pull-Apart'],
  'Face Pulls':                             ['Rear Delt Flyes', 'Cable Reverse Fly', 'Band Pull-Apart'],

  // ═══════════════════════════════════════════════════════════════════════
  // BICEPS — Isolation
  // ═══════════════════════════════════════════════════════════════════════
  'Biceps Cable Curls':                     ['Dumbbell Curls', 'EZ Bar Curls', 'Concentration Curls'],
  'Bicep Curls':                            ['Dumbbell Curls', 'EZ Bar Curls', 'Biceps Cable Curls'],
  'Barbell Curl':                           ['EZ Bar Curls', 'Dumbbell Curls', 'Biceps Cable Curls'],
  'Dumbbell Curls':                         ['Biceps Cable Curls', 'EZ Bar Curls', 'Barbell Curl'],
  'EZ Bar Curls':                           ['Barbell Curl', 'Dumbbell Curls', 'Biceps Cable Curls'],
  'Hammer Curls':                           ['Rope Hammer Curls', 'Cross-Body Hammer Curl', 'Reverse Curls'],
  'Incline Bench Bicep Curls':              ['Concentration Curls', 'Spider Curls', 'Preacher Curls'],
  'Preacher Curls':                         ['Spider Curls', 'Concentration Curls', 'Machine Preacher Curl'],
  'Concentration Curls':                    ['Preacher Curls', 'Spider Curls', 'Incline Bench Bicep Curls'],
  'Alternating Dumbbell Curl':              ['Dumbbell Curls', 'Biceps Cable Curls', 'EZ Bar Curls'],
  'Reverse Curls':                          ['Hammer Curls', 'Barbell Curl', 'EZ Bar Curls'],

  // ═══════════════════════════════════════════════════════════════════════
  // TRICEPS — Isolation
  // ═══════════════════════════════════════════════════════════════════════
  'Single Hand Tricep Pushdowns':           ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns', 'V-Bar Pushdowns'],
  'Tricep Pushdowns':                       ['Tricep Rope Pushdowns', 'V-Bar Pushdowns', 'Straight Bar Pushdowns'],
  'Single Hand Rope Pushdowns':             ['Tricep Rope Pushdowns', 'Straight Bar Pushdowns', 'V-Bar Pushdowns'],
  'Single Hand Overhead Triceps Extension': ['Overhead Triceps Extension (Cable)', 'Overhead Triceps Extension (Dumbbell)', 'Skull Crushers'],
  'Single Hand Overhead Cable Triceps Extension': ['Overhead Triceps Extension (Dumbbell)', 'Single Hand Overhead Triceps Extension', 'Skull Crushers'],
  'Overhead Triceps Extension':             ['Skull Crushers', 'Tricep Rope Pushdowns', 'Single Hand Overhead Triceps Extension'],
  'Skull Crushers':                         ['Overhead Triceps Extension', 'Close-Grip Bench Press', 'Tricep Dips'],
  'Tricep Dips (Chair)':                    ['Bench Dips', 'Diamond Push-ups', 'Tricep Rope Pushdowns'],

  // ═══════════════════════════════════════════════════════════════════════
  // QUADS — Compound (Squat pattern)
  // ═══════════════════════════════════════════════════════════════════════
  'Squats':                                 ['Smith Machine Squats', 'Leg Press', 'Hack Squats', 'Pendulum Squats', 'Goblet Squats'],
  'Barbell Back Squat':                     ['Smith Machine Squats', 'Leg Press', 'Hack Squats', 'Pendulum Squats', 'Front Squats'],
  'Front Squats':                           ['Barbell Back Squat', 'Goblet Squats', 'Hack Squats'],
  'Hack Squats':                            ['Leg Press', 'Smith Machine Squats', 'Pendulum Squats', 'Front Squats'],
  'Leg Press':                              ['Squats', 'Hack Squats', 'Pendulum Squats', 'Smith Machine Squats'],
  'Pendulum Squats':                        ['Hack Squats', 'Leg Press', 'Smith Machine Squats'],
  'Goblet Squats':                          ['Front Squats', 'Bodyweight Squats', 'Leg Press'],
  'Bodyweight Squats':                      ['Goblet Squats', 'Jump Squats', 'Leg Press'],
  'Smith Machine Squats':                   ['Squats', 'Hack Squats', 'Pendulum Squats', 'Leg Press'],
  // QUADS — Unilateral
  'Walking Lunges':                         ['Bulgarian Split Squats', 'Step-Ups', 'Reverse Lunges'],
  'Bulgarian Split Squats':                 ['Walking Lunges', 'Step-Ups', 'Reverse Lunges'],
  'Jump Squats':                            ['Bodyweight Squats', 'Box Jumps', 'Leg Press'],
  // QUADS — Isolation
  'Leg Extension':                          ['Sissy Squats', 'Wall Sits', 'Leg Press (narrow foot)'],

  // ═══════════════════════════════════════════════════════════════════════
  // HAMSTRINGS — Compound (Hinge pattern)
  // ═══════════════════════════════════════════════════════════════════════
  'Romanian Deadlift':                      ['Stiff-Leg Deadlift', 'Good Mornings', 'Seated Leg Curls'],
  'Stiff-Leg Deadlift':                     ['Romanian Deadlift', 'Good Mornings', 'Lying Leg Curls'],
  // HAMSTRINGS — Isolation
  'Leg Curls':                              ['Seated Leg Curls', 'Lying Leg Curls', 'Nordic Hamstring Curls'],
  'Seated Leg Curls':                       ['Lying Leg Curls', 'Leg Curls', 'Nordic Hamstring Curls'],
  'Lying Leg Curls':                        ['Seated Leg Curls', 'Leg Curls', 'Nordic Hamstring Curls'],

  // ═══════════════════════════════════════════════════════════════════════
  // GLUTES
  // ═══════════════════════════════════════════════════════════════════════
  'Barbell Hip Thrust':                     ['Glute Bridges', 'Cable Pull-Through', 'Single-Leg Hip Thrust'],
  'Glute Bridges':                          ['Barbell Hip Thrust', 'Cable Pull-Through', 'Single-Leg Glute Bridges'],
  'Single-Leg Glute Bridges':               ['Glute Bridges', 'Barbell Hip Thrust', 'Cable Pull-Through'],
  'Leg Abductor Machine':                   ['Banded Clamshells', 'Cable Hip Abduction', 'Side-Lying Leg Raise'],
  'Leg Adductor Machine':                   ['Copenhagen Plank', 'Sumo Squats', 'Cable Hip Adduction'],

  // ═══════════════════════════════════════════════════════════════════════
  // CALVES
  // ═══════════════════════════════════════════════════════════════════════
  'Standing Calf Raises':                   ['Seated Calf Raises', 'Smith Machine Calf Raise', 'Leg Press Calf Raise'],
  'Seated Calf Raises':                     ['Standing Calf Raises', 'Donkey Calf Raise', 'Leg Press Calf Raise'],

  // ═══════════════════════════════════════════════════════════════════════
  // ABS / CORE
  // ═══════════════════════════════════════════════════════════════════════
  'Plank':                                  ['Dead Bug', 'Hollow Body Hold', 'Ab Wheel Rollout'],
  'Hollow Body Hold':                       ['Plank', 'Dead Bug', 'Hanging Leg Raise'],
  'Mountain Climbers':                      ['Bicycle Crunches', 'V-Ups', 'High Knees'],
  'Burpees':                                ['Mountain Climbers', 'Jump Squats', 'Thrusters'],

  // ═══════════════════════════════════════════════════════════════════════
  // BODYWEIGHT / HOME
  // ═══════════════════════════════════════════════════════════════════════
  'Push-ups':                               ['Diamond Push-ups', 'Decline Push-ups', 'Wide Push-ups'],
  'Diamond Push-ups':                       ['Close-Grip Push-ups', 'Tricep Dips (Chair)', 'Pike Push-ups'],
  'Decline Push-ups':                       ['Push-ups', 'Pike Push-ups', 'Incline Push-ups'],
  'Pike Push-ups':                          ['Handstand Push-ups', 'Decline Push-ups', 'Overhead Press'],
  'Australian Pull-ups':                    ['Inverted Rows', 'Seated Cable Row', 'Resistance Band Rows'],
};
