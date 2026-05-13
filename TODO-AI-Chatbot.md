# FitTrack Pro — TODO: AI Coach Chatbot ("FORGE")
> **Created:** 2026-05-13
> **Model:** Google Gemini 2.0 Flash (free tier — zero cost, no credit card required)
> **Architecture:** Supabase Edge Function → Gemini API
> **Effort:** 🟡 Medium (3–4 days) · **Impact:** Very High — flagship engagement feature
> **Files affected:** New Edge Function, new React components, minor AppContext additions

---

## 🎯 Goal

Build **FORGE** — FitTrack Pro's AI fitness coach — a context-aware chatbot that knows
the user's entire training history, body metrics, diet logs, and fitness goals, and can
answer natural-language questions instantly. No typing "go to Analytics page and filter
by Bench Press" — the user just asks.

**Core promise to the user:** *"It feels like texting your personal trainer who has read
every entry in your training diary."*

---

## 🇮🇳 Indian Fitness User Research — What They Actually Want

Research from HealthifyMe, Fittr, and Indian fitness forums (Reddit r/IndiaFitness,
GymPad communities, YouTube comments on Gaurav Taneja / Ashu Solis channels) reveals:

| Pain Point | Frequency | What they want |
|-----------|-----------|----------------|
| "What weight did I do last time on Bench?" | 🔴 Very high | Instant recall without navigating |
| "Am I progressing?" | 🔴 Very high | Trend analysis in plain language |
| "What should I eat today?" (in context of their goal) | 🔴 Very high | Goal-aware Indian food suggestions |
| "I have lower back pain — can I still train?" | 🟠 High | Safe modifications, not generic disclaimers |
| "My bench is stuck — what do I do?" | 🟠 High | Plateau-breaking programming advice |
| "Which Indian protein is best for me?" | 🟠 High | Budget-aware supplement guidance |
| "How many calories in rajma chawal?" | 🟡 Medium | Logged already in app — tie together |
| "I'm on Navratri fast — what can I eat/train?" | 🟡 Medium | Culture-aware diet + workout advice |
| Gym equipment alternatives ("no cable machine at home") | 🟡 Medium | Home-friendly alternatives |
| "Mera weight kyun nahin ghata?" (why no weight loss?) | 🟡 Medium | Hindi/Hinglish support matters |

**Key insight:** Indian users are comfortable with Hinglish. The chatbot must respond
naturally to mixed Hindi/English queries like *"bhai mere chest ka workout suggest karo"*
or *"protein meals for vegetarians"*.

---

## 🤖 AI Model Selection — Why Gemini 2.0 Flash (Free Tier)

| Option | Cost | RPM | Daily Limit | Quality | Notes |
|--------|------|-----|-------------|---------|-------|
| **Google Gemini 2.0 Flash** | **FREE** | 15 | 1,500 req / 1M tokens | ⭐⭐⭐⭐ | Best free option; handles Hinglish natively |
| Groq (Llama 3.3 70B) | FREE | 30 | 14,400 req | ⭐⭐⭐⭐ | Very fast, good quality; fallback option |
| OpenRouter (free models) | FREE | varies | varies | ⭐⭐⭐ | Inconsistent quality across models |
| Anthropic API | PAID | — | — | ⭐⭐⭐⭐⭐ | Best quality; not used (paid) |
| OpenAI API | PAID | — | — | ⭐⭐⭐⭐⭐ | Not used (paid) |

**Decision: Google Gemini 2.0 Flash**
- Completely free — no credit card required for the free tier
- 1M tokens/day is more than enough for a personal trainer app (avg chat ~800 tokens)
- Native Hindi + English support (Hinglish queries work perfectly)
- API key from [aistudio.google.com](https://aistudio.google.com) — takes 2 minutes to get
- Context window: 1M tokens (can send full user history without chunking)
- `gemini-2.0-flash-exp` is the model string

**Rate limit math:** 1500 req/day ÷ 1 user = 1500 messages/day per Vishal.
At scale, Supabase Edge Function can implement per-user daily limits (e.g., 30 msgs/day)
to stay within free tier even with 50 daily active users.

---

## 🏗️ Architecture

```
User types in chat
        ↓
ChatbotModal (React)
        ↓
buildForgeSystemPrompt() — client-side context assembly
(reads AppContext state: workoutLogs, healthLogs, foodLog, etc.)
        ↓
POST to Supabase Edge Function: ai-chat
  body: { systemPrompt, conversationHistory, userMessage }
        ↓
  1. Auth: verify JWT (req.headers.Authorization)
  2. Rate limit check (per-user daily cap)
  3. Forward systemPrompt + history to Gemini 2.0 Flash API
  4. Return JSON response (NOT streamed — Phase 1)
        ↓
ChatbotModal displays response
        ↓
Store message in chat_messages table + localStorage
```

> **Note:** The system prompt is built **client-side** from AppContext state
> (TASK 2), NOT fetched server-side. This avoids duplicate Supabase queries —
> the Edge Function is a thin auth + proxy layer. Phase 2 may add SSE streaming.

**Why Supabase Edge Function (not direct client-side Gemini call)?**
- API key never exposed in the client bundle
- Rate limiting and abuse prevention server-side
- Consistent with existing 4 Edge Functions (`send-workout-reminder`, etc.)
- Message persistence happens atomically with the response

---

## 📐 System Prompt Architecture

The system prompt is **dynamically built** for every conversation start using the user's
live data. It is regenerated every time the user opens the chat. Here is the full template:

```
You are FORGE, the AI fitness coach inside FitTrack Pro — a premium Indian fitness
tracking app. You are like a knowledgeable personal trainer who has full access to
this user's training history, diet logs, and body metrics. You are direct, motivating,
and evidence-based. You respond in the same language the user writes in — if they
write in Hinglish, you respond in Hinglish. You never make things up about the user's
data — if you don't have the info, say so clearly.

═══════════════════════════════════════════
USER PROFILE
═══════════════════════════════════════════
Name: {user.name}
Age: {user.age} | Gender: {user.gender}
Height: {user.height}cm | Current Weight: {latestWeight}kg
Goal: {goalDescription} | Target: {user.weightGoal}kg
Activity Level: {user.activity} | Training Days/Week: {user.workoutDays}
Diet Type: {user.dietType}
BMI: {bmi} ({bmiCategory})
Estimated TDEE: {tdee} kcal/day

═══════════════════════════════════════════
CURRENT TRAINING SPLIT
═══════════════════════════════════════════
Active Split: {activeSplit.name}
Schedule: {activeSplit.schedule.join(' → ')}
Days: {splitDaysSummary}

═══════════════════════════════════════════
RECENT WORKOUT HISTORY (last 10 sessions)
═══════════════════════════════════════════
{workoutHistorySummary}
[Format per session: "DATE — DAY NAME: exercise (sets × reps @ weight), ..."]

═══════════════════════════════════════════
PERSONAL RECORDS (all time)
═══════════════════════════════════════════
{prSummary}
[Format: "Exercise: X kg × Y reps (est. 1RM: Z kg) on DATE"]

═══════════════════════════════════════════
BODY WEIGHT TREND (last 30 days)
═══════════════════════════════════════════
Start of period: {weightStart}kg | Current: {weightNow}kg
Change: {weightDelta}kg ({weightDeltaPerWeek}kg/week average)
Trend direction: {trendLabel}
All-time low: {minWeight}kg | All-time high: {maxWeight}kg
{weightGoalProgress}

═══════════════════════════════════════════
BODY COMPOSITION (if logged)
═══════════════════════════════════════════
Latest BF%: {latestBF}% ({bfCategory}) logged on {bfDate}
BF% change (30 days): {bfDelta}%
Goal BF%: {user.bodyFatGoal}%

═══════════════════════════════════════════
TODAY'S NUTRITION ({todayDate})
═══════════════════════════════════════════
Calories logged: {todayCals} / {goalKcal} kcal
Protein: {todayProtein}g / {targetProtein}g
Carbs: {todayCarbs}g / {targetCarbs}g
Fat: {todayFat}g / {targetFat}g
Meals logged: {mealSummary}

═══════════════════════════════════════════
CURRENT READINESS (if checked in today)
═══════════════════════════════════════════
Today's Score: {readinessScore}/100 ({readinessTier})
Sleep: {sleepHours}hrs | Energy: {energyLabel}
Soreness: {sorenessLabel} | Stress: {stressLabel}

═══════════════════════════════════════════
OLYMPUS LEAGUE RANK
═══════════════════════════════════════════
Overall Rank: {overallRank.name} ({overallRank.totalXP} XP)
Strongest muscle: {strongestMuscle} ({strongestXP} XP, {strongestRank})
Weakest muscle: {weakestMuscle} ({weakestXP} XP, {weakestRank})

═══════════════════════════════════════════
RULES FOR FORGE
═══════════════════════════════════════════
1. ONLY cite data that appears above — never invent workout numbers.
2. For injury/medical questions, give practical safe modifications but ALWAYS end
   with: "Consult a physiotherapist for persistent pain."
3. Diet advice should prioritise Indian foods (dal, paneer, eggs, chicken, roti, rice).
4. Supplement recommendations: prioritise Indian brands (MuscleBlaze, AS-IT-IS, NAKPRO)
   before recommending imports. Always mention cost per kg.
5. When the user asks "what did I do last time on X", search the workout history above
   and quote the EXACT weights, reps, and date.
6. For plateau advice, look at the last 4 sessions for the stuck exercise. If weight
   has not changed in 3+ sessions, suggest deload or technique focus.
7. Keep responses concise by default (under 200 words). Go longer only if asked.
8. Use emojis sparingly — 1 or 2 max per message, only when they add clarity.
9. If asked in Hindi/Hinglish, respond in Hinglish naturally.
10. End injury/rehab advice with a safety note every time.
```

---

## 🎨 UI Design — Kinetic Elite Chat Interface

### Floating Button (always visible)
- Position: `fixed`, `bottom: 96px`, `right: 20px` (above bottom nav on mobile)
- Shape: 52×52px circle, `background: var(--signature-gradient)`
- Icon: Lucide `Bot` (20px, white)
- Notification dot: amber dot if new recommendation available (coaching banner pending)
- Animation: `pulse` glow ring when readiness is low (proactive nudge)
- Z-index: above bottom nav (`z-index: 200`)
- Desktop: `bottom: 24px` (no bottom nav)

### Chat Panel (bottom sheet)
- Trigger: click floating button → panel slides up (same `translateY` animation as `PlayerDetailModal`)
- Height: `90dvh` on mobile, `600px max-height` on desktop (centered modal)
- Background: `var(--surface-container-low)`, `borderRadius: '24px 24px 0 0'`
- Structure:
  ```
  ┌───────────────────────────────────────┐
  │  — drag handle pill —                 │
  │  FORGE    [bolt icon]    [×] [🗑 clear]│  ← sticky header
  │  "Your AI Fitness Coach"              │
  ├───────────────────────────────────────┤
  │                                       │
  │  [FORGE welcome card]                 │  ← only on fresh convo
  │  [QUICK PROMPTS row]                  │  ← only on fresh convo
  │                                       │
  │  [message bubbles, scrollable]        │
  │                                       │
  ├───────────────────────────────────────┤
  │  [🎤][text input              ][send] │  ← sticky footer
  └───────────────────────────────────────┘
  ```

### Message Bubbles
- **User**: right-aligned, `background: var(--primary-container)`, white text, `borderRadius: '18px 18px 4px 18px'`
- **FORGE**: left-aligned, `background: var(--surface-container-highest)`, `--on-surface` text, `borderRadius: '4px 18px 18px 18px'`
- FORGE avatar: small 28px circle with ember gradient + `Zap` icon (not a photo)
- Timestamps: `10px`, `--on-surface-dim`, shown below each message
- Loading: Three-dot animated pulse while waiting for response

### Welcome Card (fresh conversation)
```
⚡ Hey {firstName}! I'm FORGE, your AI coach.

I have access to your full training history, weight logs,
diet data, and Olympus League rank. Ask me anything —
in English or Hinglish! 🇮🇳

Current status: {overallRank.name} · {latestWeight}kg · {streakDays} day streak
```
Background: `var(--surface-container)` card, left border `4px solid var(--primary)`

### Quick Prompt Chips (below welcome card, scrollable horizontal row)
8 chips rendered as horizontal scroll pills. Tapping auto-fills the input:

```js
const QUICK_PROMPTS = [
  { icon: '🏋️', label: 'Last bench session', text: 'What weight did I do on Bench Press last time?' },
  { icon: '📈', label: 'Weight trend', text: 'Am I losing weight? Show me my last 30-day trend.' },
  { icon: '🍛', label: 'Protein meals', text: `Suggest high-protein Indian meals for today. I need ${targetProtein}g protein.` },
  { icon: '😴', label: 'Recovery advice', text: 'My readiness is low today. Should I train or rest?' },
  { icon: '💪', label: 'Break plateau', text: 'My progress has stalled. How do I break through this plateau?' },
  { icon: '🤕', label: 'Lower back pain', text: 'I have lower back pain. What exercises can I still do?' },
  { icon: '🔄', label: 'Exercise swap', text: 'I don\'t have a cable machine. What are alternatives?' },
  { icon: '🧪', label: 'Best supplement', text: 'What protein powder should I buy? Budget around ₹2000/kg.' },
];
```

Chip style: `background: var(--surface-container-highest)`, `border-radius: 20px`, `font-size: 12px`, `padding: 8px 14px`, `white-space: nowrap`, ember gradient on the icon `span`.

---

## 📋 Implementation Tasks

---

### TASK 1 — Supabase: `chat_messages` Table + RLS

**File:** `supabase/migrations/20260513_chat_messages.sql` [NEW]

```sql
-- Persists conversation history per user
-- Keeps last 50 messages per user (older pruned on insert)
create table public.chat_messages (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         text not null check (role in ('user', 'assistant')),
  content      text not null,
  tokens_used  integer,          -- track API usage
  created_at   timestamptz default now()
);

-- Index for fast per-user fetch
create index chat_messages_user_id_created on public.chat_messages(user_id, created_at desc);

-- RLS: users only see their own messages
alter table public.chat_messages enable row level security;

create policy "own messages only"
  on public.chat_messages for all
  using (auth.uid() = user_id);

-- Add daily_chat_count to user_profiles for rate limiting
alter table public.user_profiles
  add column if not exists chat_count_today integer default 0,
  add column if not exists chat_count_reset_date date default current_date;
```

**Also:** Add `GEMINI_API_KEY` to Supabase secrets (Dashboard → Settings → Edge Functions → Secrets). This key comes from https://aistudio.google.com (free, instant).

> ⚠️ **The secret name is `GEMINI_API_KEY` (no `VITE_` prefix).** The `VITE_` prefix is for client-side env vars exposed by Vite. Edge Function secrets are server-side only and accessed via `Deno.env.get('GEMINI_API_KEY')`. Do NOT add this to `.env` — it must stay server-side.

---

### TASK 2 — Context Builder Utility

**File:** `src/utils/chatbotContext.js` [NEW]

This module takes app state and builds the full system prompt string. It runs **client-side** — the built prompt is sent to the Edge Function as part of the request body (not fetched server-side) for simplicity. This avoids double Supabase queries.

```js
// src/utils/chatbotContext.js

import { calcBMI, getBMICat, calcBMR, calcTDEE } from './calculations';
import { getOverallRank, MUSCLE_GROUPS, calcAllMuscleXP } from '../data/muscleData';
import { tod } from './helpers';

/**
 * Builds the dynamic system prompt for FORGE.
 * Called once when the chat panel opens.
 */
export function buildForgeSystemPrompt({
  user,
  workoutLogs,
  healthLogs,
  foodLog,
  readinessLog,
  splits,
  bodyFatLog,
}) {
  if (!user) return '';

  // ── Identity & Body Metrics ──────────────────────────────
  const sortedHealthLogs = [...healthLogs]
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const latestWeight = sortedHealthLogs.at(-1)?.weight || user.weight || null;
  const weightStart30 = sortedHealthLogs.findLast(l =>
    new Date(l.date) <= new Date(Date.now() - 30 * 86400000)
  )?.weight || sortedHealthLogs[0]?.weight || latestWeight;

  const weightDelta = latestWeight && weightStart30
    ? +(latestWeight - weightStart30).toFixed(1) : null;
  const daysOfData = sortedHealthLogs.length > 1
    ? Math.ceil((new Date(sortedHealthLogs.at(-1).date) - new Date(sortedHealthLogs[0].date)) / 86400000)
    : 1;
  const weightDeltaPerWeek = weightDelta !== null
    ? +((weightDelta / Math.max(daysOfData, 7)) * 7).toFixed(2) : null;

  const bmi = latestWeight && user.height
    ? calcBMI(latestWeight, user.height) : null;
  const bmiCat = bmi ? getBMICat(bmi) : null;
  const bmr = user.weight && user.height && user.age
    ? calcBMR(user.weight, user.height, user.age, user.gender) : null;
  const tdee = bmr ? calcTDEE(bmr, user.activity) : null;

  const goalDescription = user.weightGoal
    ? (latestWeight > user.weightGoal ? 'Fat Loss' : 'Muscle Gain / Bulk')
    : 'Maintenance';

  // ── Weight Progress Text ─────────────────────────────────
  let weightGoalProgress = 'No weight goal set.';
  if (user.weightGoal && latestWeight) {
    const remaining = +(latestWeight - user.weightGoal).toFixed(1);
    const direction = remaining > 0 ? 'to lose' : 'to gain';
    weightGoalProgress = `${Math.abs(remaining)}kg ${direction} to reach goal.`;
    if (user.goalWeeks && user.goalSetDate) {
      const elapsed = Math.ceil((Date.now() - new Date(user.goalSetDate)) / 604800000);
      weightGoalProgress += ` ${elapsed} of ${user.goalWeeks} weeks elapsed.`;
    }
  }

  // ── Recent Workouts (last 10) ────────────────────────────
  const userWorkouts = workoutLogs
    .filter(l => l.userId === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10);

  const workoutHistorySummary = userWorkouts.length === 0
    ? 'No workouts logged yet.'
    : userWorkouts.map(log => {
        const exStr = (log.exercises || []).map(ex => {
          const setStr = (ex.sets || [])
            .filter(s => s.done || s.reps)
            .map(s => `${s.reps || '?'}×${s.weight || 0}kg`)
            .join(', ');
          return `${ex.name} (${setStr})`;
        }).join(' | ');
        return `${log.date} — ${log.dayName}: ${exStr}`;
      }).join('\n');

  // ── Personal Records per exercise ───────────────────────
  const prMap = {};
  workoutLogs
    .filter(l => l.userId === user.id)
    .forEach(log => {
      (log.exercises || []).forEach(ex => {
        (ex.sets || []).forEach(s => {
          if (!s.weight || !s.reps) return;
          const est1rm = +(s.weight * (1 + s.reps / 30)).toFixed(1);
          if (!prMap[ex.name] || est1rm > prMap[ex.name].est1rm) {
            prMap[ex.name] = { weight: s.weight, reps: s.reps, est1rm, date: log.date };
          }
        });
      });
    });

  const prSummary = Object.keys(prMap).length === 0
    ? 'No PRs recorded yet.'
    : Object.entries(prMap)
        .sort((a, b) => b[1].est1rm - a[1].est1rm)
        .slice(0, 15) // top 15 exercises
        .map(([name, pr]) =>
          `${name}: ${pr.weight}kg × ${pr.reps} reps (est. 1RM: ${pr.est1rm}kg) on ${pr.date}`)
        .join('\n');

  // ── Active Split ─────────────────────────────────────────
  const allSplits = splits || [];
  const activeSplit = allSplits.find(s => s.id === user.activeSplitId);
  const splitSummary = activeSplit
    ? `${activeSplit.name} — ${(activeSplit.schedule || []).join(' → ')}\n` +
      (activeSplit.days || []).map(d =>
        `  ${d.name}: ${(d.exercises || []).map(e => e.name).join(', ')}`
      ).join('\n')
    : 'No active split selected.';

  // ── Today's Food Log ─────────────────────────────────────
  const today = tod();
  const todayFood = (foodLog || []).filter(e =>
    (e.userId === user.id || e.user_id === user.id) &&
    (e.date === today || e.logDate === today)
  );
  // IMPORTANT: Food log entries store macros under a nested `macros` object
  // (e.g. entry.macros.calories, entry.macros.protein) — NOT at the top level.
  // This matches DietPage.jsx's todayTotals reducer pattern.
  const todayCals = todayFood.reduce((s, e) => s + (e.macros?.calories || e.calories || 0), 0);
  const todayProtein = todayFood.reduce((s, e) => s + (e.macros?.protein || e.protein || 0), 0);
  const todayCarbs = todayFood.reduce((s, e) => s + (e.macros?.carbs || e.carbs || 0), 0);
  const todayFat = todayFood.reduce((s, e) => s + (e.macros?.fat || e.fat || 0), 0);

  const mealSlots = ['Breakfast', 'Mid-Morning', 'Lunch', 'Pre-Workout', 'Post-Workout Dinner', 'Before Bed'];
  const mealSummary = mealSlots.map(slot => {
    const entries = todayFood.filter(e => e.slot === slot || e.mealType === slot);
    if (entries.length === 0) return null;
    const names = entries.map(e => e.foodName || e.name || 'item').join(', ');
    const kcal = entries.reduce((s, e) => s + (e.calories || 0), 0);
    return `  ${slot}: ${names} (${Math.round(kcal)} kcal)`;
  }).filter(Boolean).join('\n') || '  Nothing logged yet today.';

  // Macro targets — mirrors DietPage.jsx exactly (lines 160-177)
  const isLoss = user.weightGoal && latestWeight && user.weightGoal < latestWeight;
  const isGain = user.weightGoal && latestWeight && user.weightGoal > latestWeight;
  const goal = isLoss ? 'loss' : isGain ? 'gain' : 'maintenance';
  const computedGoalKcal = tdee
    ? Math.round(isLoss ? tdee - 500 : isGain ? tdee + 400 : tdee)
    : null;
  // customGoalKcal takes priority — same as DietPage line 167
  const goalKcal = user.customGoalKcal || computedGoalKcal;
  const baseWeight = (isLoss && user.weightGoal) ? user.weightGoal : (latestWeight || user.weight);
  // DietPage uses 2.0 for heavy cut (5+ days), 1.8 otherwise — simplified here
  const isHeavyCut = (user.workoutDays || 0) >= 5 && goal === 'loss';
  const protMultiplier = isHeavyCut ? 2.0 : 1.8;
  const targetProtein = user.customProteinG || (baseWeight
    ? Math.round(baseWeight * protMultiplier) : null);

  // ── Readiness ─────────────────────────────────────────────
  const todayReadiness = (readinessLog || [])
    .filter(r => (r.userId === user.id || r.user_id === user.id) && r.date === today && r.checkInComplete)
    .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0))[0];

  const readinessSection = todayReadiness
    ? `Today's Score: ${todayReadiness.score}/100 (${
        todayReadiness.score >= 80 ? 'Optimal' :
        todayReadiness.score >= 60 ? 'Good' :
        todayReadiness.score >= 40 ? 'Moderate' : 'Low — consider rest'
      })
Sleep: ${todayReadiness.sleepHours || '?'}hrs | Energy: ${todayReadiness.energyLevel || '?'}/5
Soreness: ${todayReadiness.sorenessLevel || 'unknown'} | Stress: ${todayReadiness.stressLevel || 'unknown'}`
    : 'No check-in today yet.';

  // ── Olympus League ────────────────────────────────────────
  const muscleXP = calcAllMuscleXP(workoutLogs, splits, user.id);
  const overallRank = getOverallRank(muscleXP);
  const sortedMuscles = MUSCLE_GROUPS
    .map(m => ({ ...m, xp: muscleXP[m.key] || 0 }))
    .sort((a, b) => b.xp - a.xp);
  const strongest = sortedMuscles[0];
  const weakest = sortedMuscles.at(-1);

  // ── Body Fat ─────────────────────────────────────────────
  const userBF = (bodyFatLog || [])
    .filter(e => e.userId === user.id || e.user_id === user.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
  const latestBF = userBF[0];
  const prevBF = userBF[1];
  const bfSection = latestBF
    ? `Latest BF%: ${latestBF.percentage}% (${latestBF.method || 'logged'}) on ${latestBF.date}
BF% change vs previous: ${prevBF ? `${+(latestBF.percentage - prevBF.percentage).toFixed(1)}%` : 'only 1 entry'}
Goal BF%: ${user.bodyFatGoal || 'not set'}`
    : 'No body fat entries logged yet.';

  // ── Build Final Prompt ────────────────────────────────────
  return `You are FORGE, the AI fitness coach inside FitTrack Pro — a premium Indian fitness tracking app. You are like a knowledgeable personal trainer who has full access to this user's training history, diet logs, and body metrics. You are direct, motivating, and evidence-based. You respond in the same language the user writes in — if they write in Hinglish, you respond in Hinglish naturally. You never make up numbers about the user's data — only cite what is in this prompt. Keep responses under 200 words unless asked for more detail.

════════════════════════════
USER PROFILE
════════════════════════════
Name: ${user.name} | Age: ${user.age || '?'} | Gender: ${user.gender || '?'}
Height: ${user.height || '?'}cm | Weight: ${latestWeight || '?'}kg
Goal: ${goalDescription}${user.weightGoal ? ` → Target: ${user.weightGoal}kg` : ''}
Diet: ${user.dietType || 'not set'} | Training: ${user.workoutDays || '?'} days/week
BMI: ${bmi ? `${bmi} (${bmiCat?.label || '?'})` : 'unknown'}
TDEE: ${tdee ? `~${Math.round(tdee)} kcal/day` : 'unknown'}

════════════════════════════
ACTIVE SPLIT
════════════════════════════
${splitSummary}

════════════════════════════
RECENT WORKOUTS (last 10 sessions)
════════════════════════════
${workoutHistorySummary}

════════════════════════════
PERSONAL RECORDS
════════════════════════════
${prSummary}

════════════════════════════
WEIGHT TREND (last 30 days)
════════════════════════════
Start: ${weightStart30 || '?'}kg | Now: ${latestWeight || '?'}kg
Change: ${weightDelta !== null ? `${weightDelta > 0 ? '+' : ''}${weightDelta}kg` : '?'} (${weightDeltaPerWeek !== null ? `${weightDeltaPerWeek > 0 ? '+' : ''}${weightDeltaPerWeek}kg/week` : '?'}/week)
${weightGoalProgress}

════════════════════════════
BODY COMPOSITION
════════════════════════════
${bfSection}

════════════════════════════
TODAY'S NUTRITION (${today})
════════════════════════════
Logged: ${Math.round(todayCals)} kcal${goalKcal ? ` / ${goalKcal} kcal target` : ''}
Protein: ${Math.round(todayProtein)}g${targetProtein ? ` / ${targetProtein}g target` : ''} | Carbs: ${Math.round(todayCarbs)}g | Fat: ${Math.round(todayFat)}g
Meals:
${mealSummary}

════════════════════════════
READINESS TODAY
════════════════════════════
${readinessSection}

════════════════════════════
OLYMPUS LEAGUE
════════════════════════════
Rank: ${overallRank.name} (${overallRank.totalXP.toLocaleString()} XP)
Strongest: ${strongest.label} (${strongest.xp.toLocaleString()} XP)
Needs work: ${weakest.label} (${weakest.xp.toLocaleString()} XP)

════════════════════════════
RULES
════════════════════════════
1. Only cite numbers present in this prompt. Never invent workout data.
2. Injury questions: give safe modifications + always end with "See a physio for persistent pain."
3. Diet: prioritise Indian foods (dal, paneer, eggs, chicken, curd, roti, rice).
4. Supplements: recommend Indian brands first (MuscleBlaze, AS-IT-IS, NAKPRO, Nutrabay) with ₹/kg price context.
5. For "what did I do last time on X" — scan Recent Workouts above and quote exact numbers and date.
6. For plateau advice — look at last 4 sessions of that exercise. If weight hasn't changed, suggest deload or variation.
7. Keep responses under 200 words by default. Expand only when asked.
8. Respond in Hinglish if the user writes in Hinglish.
9. Always end injury/rehab advice with a safety note.`;
}

/**
 * Builds the conversation history array for the Gemini API
 * (last 20 messages to stay within token budget).
 */
export function buildConversationHistory(messages) {
  return messages
    .slice(-20) // last 20 msgs (~8000 tokens typical)
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
}
```

---

### TASK 3 — Supabase Edge Function: `ai-chat`

**File:** `supabase/functions/ai-chat/index.ts` [NEW]

**Also create:** `supabase/functions/ai-chat/deno.json` [NEW]
```json
{
  "imports": {
    "@supabase/functions-js": "jsr:@supabase/functions-js@^2"
  }
}
```

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.39.3';

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY')!;
const GEMINI_URL =
  'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const DAILY_LIMIT = 30; // messages per user per day (free tier safety valve)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    // ── Auth ──────────────────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return errorResponse(401, 'Unauthorized');

    const { data: { user }, error: authErr } =
      await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
    if (authErr || !user) return errorResponse(401, 'Invalid token');

    // ── Rate limit ────────────────────────────────────────
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('chat_count_today, chat_count_reset_date')
      .eq('id', user.id)
      .single();

    const today = new Date().toISOString().split('T')[0];
    const isNewDay = !profile?.chat_count_reset_date ||
      profile.chat_count_reset_date !== today;
    const chatCount = isNewDay ? 0 : (profile?.chat_count_today || 0);

    if (chatCount >= DAILY_LIMIT) {
      return errorResponse(429, `Daily limit of ${DAILY_LIMIT} messages reached. Try again tomorrow.`);
    }

    // ── Parse request body ────────────────────────────────
    const body = await req.json();
    const { systemPrompt, conversationHistory, userMessage } = body;

    if (!userMessage?.trim()) return errorResponse(400, 'No message provided');

    // ── Call Gemini ───────────────────────────────────────
    const geminiPayload = {
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [
        ...conversationHistory,
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxOutputTokens: 512, // keep responses concise
      },
      safetySettings: [
        // Allow fitness/health content
        { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
        { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
      ],
    };

    const geminiRes = await fetch(`${GEMINI_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      console.error('Gemini error:', errText);
      return errorResponse(502, 'AI service unavailable — try again in a moment');
    }

    const geminiData = await geminiRes.json();
    const replyText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!replyText) return errorResponse(502, 'Empty response from AI');

    const tokensUsed = geminiData.usageMetadata?.totalTokenCount || 0;

    // ── Persist messages to chat_messages ─────────────────
    await supabase.from('chat_messages').insert([
      { user_id: user.id, role: 'user', content: userMessage },
      { user_id: user.id, role: 'assistant', content: replyText, tokens_used: tokensUsed },
    ]);

    // ── Prune old messages (keep last 100 per user) ────────
    const { data: allMsgs } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (allMsgs && allMsgs.length > 100) {
      const toDelete = allMsgs.slice(100).map(m => m.id);
      await supabase.from('chat_messages').delete().in('id', toDelete);
    }

    // ── Update daily count ────────────────────────────────
    await supabase.from('user_profiles').update({
      chat_count_today: isNewDay ? 1 : chatCount + 1,
      chat_count_reset_date: today,
    }).eq('id', user.id);

    return new Response(JSON.stringify({ reply: replyText, tokensUsed }), {
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('ai-chat error:', err);
    return errorResponse(500, 'Internal server error');
  }
});

function errorResponse(status: number, message: string) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}
```

---

### TASK 4 — React Hook: `useChatbot`

**File:** `src/hooks/useChatbot.js` [NEW]

```js
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { buildForgeSystemPrompt, buildConversationHistory } from '../utils/chatbotContext';

const STORAGE_KEY = (userId) => `fittrack_chat_${userId}`;
const MAX_LOCAL_MESSAGES = 50;

export function useChatbot({ user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog }) {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState(null);
  const [messagesRemaining, setMessagesRemaining] = useState(30);
  const systemPromptRef = useRef('');

  // Load messages from localStorage on open
  useEffect(() => {
    if (!user?.id) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY(user.id));
      if (saved) setMessages(JSON.parse(saved));
    } catch { /* ignore */ }
  }, [user?.id]);

  // Build system prompt when panel opens
  useEffect(() => {
    if (!isOpen || !user) return;
    systemPromptRef.current = buildForgeSystemPrompt({
      user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog,
    });
  }, [isOpen, user, workoutLogs, healthLogs]);

  const saveMessages = useCallback((msgs) => {
    if (!user?.id) return;
    const toSave = msgs.slice(-MAX_LOCAL_MESSAGES);
    try {
      localStorage.setItem(STORAGE_KEY(user.id), JSON.stringify(toSave));
    } catch { /* storage full — ignore */ }
  }, [user?.id]);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading || !user) return;

    const userMsg = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveMessages(newMessages);
    setIsLoading(true);
    setError(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            systemPrompt: systemPromptRef.current,
            conversationHistory: buildConversationHistory(messages),
            userMessage: text.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setError(data.error || 'Daily message limit reached.');
          setMessagesRemaining(0);
        } else {
          setError(data.error || 'Something went wrong. Try again.');
        }
        return;
      }

      const assistantMsg = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...newMessages, assistantMsg];
      setMessages(finalMessages);
      saveMessages(finalMessages);
      setMessagesRemaining(prev => Math.max(0, prev - 1));

    } catch (err) {
      setError('Network error — check your connection.');
      console.error('Chatbot error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, user, saveMessages]);

  const clearHistory = useCallback(() => {
    setMessages([]);
    if (user?.id) localStorage.removeItem(STORAGE_KEY(user.id));
  }, [user?.id]);

  const openChat = useCallback(() => setIsOpen(true), []);
  const closeChat = useCallback(() => setIsOpen(false), []);

  return {
    messages,
    isLoading,
    isOpen,
    error,
    messagesRemaining,
    sendMessage,
    clearHistory,
    openChat,
    closeChat,
  };
}
```

---

### TASK 5 — `ChatbotButton` Component

**File:** `src/components/shared/ChatbotButton.jsx` [NEW]

```jsx
import { Bot } from 'lucide-react';

export default function ChatbotButton({ onClick, hasUnread = false }) {
  return (
    <button
      onClick={onClick}
      aria-label="Open FORGE AI Coach"
      style={{
        position: 'fixed',
        bottom: 'calc(72px + env(safe-area-inset-bottom, 12px))', // above mobile bottom nav
        right: 20,
        width: 52,
        height: 52,
        borderRadius: '50%',
        background: 'var(--signature-gradient)',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 20px rgba(248,95,27,0.35)',
        zIndex: 200,
        transition: 'transform .2s var(--ease-spring)',
        // Show ambient glow pulse if new nudge
      }}
      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <Bot size={22} color="#fff" />
      {hasUnread && (
        <span style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: '#FFE66D',
          border: '2px solid var(--surface)',
          animation: 'pulse 2s var(--ease-smooth) infinite',
        }} />
      )}
    </button>
  );
}
```

On **desktop** (sidebar visible), add `bottom: 24px` via a CSS media query in `index.css`:
```css
@media (min-width: 769px) {
  .chatbot-fab { bottom: 24px !important; }
}
```

---

### TASK 6 — `ChatbotModal` Component

**File:** `src/components/shared/ChatbotModal.jsx` [NEW]

Key sections (full JSX below the spec):

**Header (sticky):**
- `⚡ FORGE` wordmark in `Space Grotesk`, ember gradient text
- Subtitle: `"Your AI Fitness Coach"`
- Right: icon button row — `Trash2` (clear history) + `X` (close)
- Message count pill: `"23 left today"` in `surface-container-highest`, if < 10 turns amber

**Messages area (scrollable, `flex: 1, overflowY: auto`):**
- For empty state: welcome card + quick prompt chips
- For existing messages: bubble list

**Message bubble rendering:**
```jsx
{messages.map(msg => (
  <div key={msg.id} style={{
    display: 'flex',
    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 12,
  }}>
    {msg.role === 'assistant' && (
      <div style={{
        width: 28, height: 28, borderRadius: '50%',
        background: 'var(--signature-gradient)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Zap size={14} color="#fff" />
      </div>
    )}
    <div style={{
      maxWidth: '78%',
      padding: '10px 14px',
      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
      background: msg.role === 'user' ? 'var(--primary-container)' : 'var(--surface-container-highest)',
      color: msg.role === 'user' ? '#fff' : 'var(--on-surface)',
      fontSize: 14,
      lineHeight: 1.5,
      whiteSpace: 'pre-wrap',
    }}>
      {msg.content}
    </div>
  </div>
))}
```

**Loading indicator (while `isLoading`):**
```jsx
<div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
  <div style={{ /* FORGE avatar */ }}>
    <Zap size={14} color="#fff" />
  </div>
  <div style={{ /* typing dots bubble */ }}>
    {/* Three animated dots using pulse keyframe with staggered delays */}
    {[0, 120, 240].map(delay => (
      <span key={delay} style={{
        display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
        background: 'var(--primary)', margin: '0 2px',
        animation: `pulse 1.2s ${delay}ms ease-in-out infinite`,
      }} />
    ))}
  </div>
</div>
```

**Input footer (sticky):**
```jsx
<form onSubmit={e => { e.preventDefault(); sendMessage(input); setInput(''); }}>
  <input
    ref={inputRef}
    value={input}
    onChange={e => setInput(e.target.value)}
    placeholder="Ask FORGE anything..."
    disabled={isLoading}
    style={{
      flex: 1,
      background: 'var(--surface-container-high)',
      border: 'none',
      padding: '12px 16px',
      borderRadius: 14,
      color: 'var(--on-surface)',
      fontSize: 14,
      outline: 'none',
    }}
  />
  <button type="submit" disabled={isLoading || !input.trim()} className="btn-p"
    style={{ width: 44, height: 44, borderRadius: '50%', padding: 0, flexShrink: 0 }}>
    <Send size={18} />
  </button>
</form>
```

**Markdown-lite rendering:** The bot responses often include bold text, bullet points, and headers. Use a tiny inline renderer (no `react-markdown` dependency):
```js
// Replace **text** → <strong>, *text* → <em>
// Replace leading "- " on new lines → bullet dots
// Replace leading "## " → section label
const renderMarkdown = (text) => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>');
};
// Use dangerouslySetInnerHTML={{ __html: renderMarkdown(msg.content) }}
// (Safe: content is from our own AI with system prompt constraints)
```

---

### TASK 7 — Wire into `App.jsx` + `AppContext`

**`App.jsx` changes:**
```jsx
// Import at top of App.jsx:
import { useChatbot } from './hooks/useChatbot';
import ChatbotButton from './components/shared/ChatbotButton';
import ChatbotModal from './components/shared/ChatbotModal';

// Inside AppInner (line 20), expand the useApp destructure:
const { user, authLoading, toasts, removeToast,
        workoutLogs, healthLogs, foodLog, readinessLog,
        splits, bodyFatLog } = useApp();

// Initialize the hook (after the auth/loading guards):
const chatbot = useChatbot({ user, workoutLogs, healthLogs, foodLog, readinessLog, splits, bodyFatLog });

// Modify the return JSX (the existing layout is a flex div, NOT a fragment):
return (
  <div style={{ display: 'flex', minHeight: '100vh' }}>
    <Sidebar />
    <main className="mc" style={{ flex: 1, padding: '22px 24px', overflowY: 'auto' }}>
      <Routes>
        {/* ... existing routes unchanged ... */}
      </Routes>
    </main>
    <BottomNav />
    <ToastContainer toasts={toasts} removeToast={removeToast} />
    <ChatbotButton onClick={chatbot.openChat} />
    {chatbot.isOpen && (
      <ChatbotModal chatbot={chatbot} user={user} />
    )}
  </div>
);
```

> ⚠️ **No `<ThemeToggle />` component exists in App.jsx.** Theme toggling uses
> `<ThemeTogglePill />` from `SharedComponents.jsx` and is rendered inline on
> the Dashboard and Profile pages, not in the App shell.

**No AppContext changes needed** — the hook receives data directly via props.

---

### TASK 8 — Quick Action: "Ask FORGE" Deep-Links

Add contextual "Ask FORGE" triggers in existing pages that pre-fill a specific question:

**WorkoutHistoryPage.jsx** — each session card gets a small bot icon button:
```jsx
<button onClick={() => {
  chatbot.openChat();
  // After a tick, send a pre-filled message
  setTimeout(() => chatbot.sendMessage(
    `How did I do on ${log.dayName} on ${log.date}? Any improvements?`
  ), 300);
}} style={{ /* small ghost icon button */ }}>
  <Bot size={14} />
</button>
```

**ProgressPage.jsx** — below the Personal Best card:
```jsx
<button onClick={() => chatbot.openChat() /* + pre-fill */}>
  💬 Ask FORGE how to beat this PR
</button>
```

**MuscleMapPage.jsx** — below weakest muscle:
```jsx
{/* "Ask FORGE how to improve [weakest muscle]" chip */}
```

**DietPage.jsx** — in the protein nudge alert:
```jsx
{/* Replace static message with "Ask FORGE for protein meal ideas" CTA */}
```

---

### TASK 9 — Proactive Nudge (Optional / Phase 2)

When specific conditions are met, the `ChatbotButton` glows amber and shows a tooltip:

| Trigger | Nudge |
|---------|-------|
| Readiness < 40 today | *"Your recovery score is low today. Tap to ask FORGE what to do."* |
| No workout in 4 days | *"It's been 4 days — ask FORGE if you should train today."* |
| Protein under 50% by 7pm | *"You're way behind on protein. FORGE has quick fix ideas."* |
| Weight stuck 14 days | *"No scale movement in 2 weeks. FORGE can diagnose why."* |
| New PR set | *"New PR! Ask FORGE how to build on this."* |

Implementation: A `useEffect` in `useChatbot` computes `nudgeMessage` based on current app state. The ChatbotButton receives `hasUnread={!!nudgeMessage}` and shows the amber dot.

---

### TASK 10 — Gemini API Key Setup (Vishal's 2-minute task)

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Sign in with Google → click **"Get API Key"** → **"Create API key in new project"**
3. Copy the key (starts with `AIza...`)
4. Go to Supabase Dashboard → **Settings → Edge Functions → Secrets**
5. Add: `GEMINI_API_KEY` = `[your key]`
6. Done. Free tier: 15 RPM, 1500 requests/day, 1M tokens/day — no credit card needed.

---

## 📦 File Change Summary

| File | Status | What Changes |
|------|--------|-------------|
| `supabase/migrations/20260513_chat_messages.sql` | 🆕 NEW | `chat_messages` table + rate limit columns on `user_profiles` |
| `supabase/functions/ai-chat/index.ts` | 🆕 NEW | Edge Function: auth → context → Gemini → response |
| `src/utils/chatbotContext.js` | 🆕 NEW | `buildForgeSystemPrompt()` + `buildConversationHistory()` |
| `src/hooks/useChatbot.js` | 🆕 NEW | Chat state, send, persist, clear |
| `src/components/shared/ChatbotButton.jsx` | 🆕 NEW | Fixed floating FAB with optional nudge dot |
| `src/components/shared/ChatbotModal.jsx` | 🆕 NEW | Full chat UI — header, bubbles, quick prompts, input |
| `src/App.jsx` | ✏️ MODIFY | Wire `useChatbot`, render `ChatbotButton` + `ChatbotModal` |
| `src/index.css` | ✏️ MODIFY | `.chatbot-fab` desktop bottom override; `.typing-dot` animation |

**Files NOT touched:** `AppContext.jsx`, `Supabase auth`, routing, any existing page logic.

---

## ✅ Implementation Checklist

### One-Time Setup (Vishal — 5 min)
- [ ] Get free Gemini API key from aistudio.google.com
- [ ] Add `GEMINI_API_KEY` to Supabase Edge Function Secrets
- [ ] Run `20260513_chat_messages.sql` migration in Supabase SQL Editor

### New Files
- [ ] **TASK 1** — SQL migration: `chat_messages` table + rate limit columns
- [ ] **TASK 2** — `chatbotContext.js`: `buildForgeSystemPrompt()` utility
  - [ ] Weight trend (30-day delta + per-week rate)
  - [ ] Workout history (last 10 sessions, all exercises + weights)
  - [ ] PR map (top 15 exercises by est. 1RM)
  - [ ] Today's food log (per slot, macros consumed vs target)
  - [ ] Readiness section (today's score + raw fields)
  - [ ] Olympus League rank + strongest/weakest muscle
  - [ ] Body fat section
  - [ ] Full rules block
- [ ] **TASK 3** — Edge Function: `supabase/functions/ai-chat/index.ts`
  - [ ] JWT auth verify
  - [ ] Daily rate limit check (30 msgs/user/day)
  - [ ] Gemini API call with system instruction + conversation history
  - [ ] Persist to `chat_messages`
  - [ ] Prune to last 100 messages per user
  - [ ] Update daily count
- [ ] **TASK 4** — `useChatbot.js` hook
  - [ ] Load messages from localStorage on mount
  - [ ] Build system prompt on panel open
  - [ ] `sendMessage()` → POST to Edge Function → append response
  - [ ] Persist to localStorage on every update
  - [ ] `clearHistory()` method
- [ ] **TASK 5** — `ChatbotButton.jsx` (floating FAB)
- [ ] **TASK 6** — `ChatbotModal.jsx`
  - [ ] Header with message count
  - [ ] Welcome card (fresh convo only)
  - [ ] Quick prompt chips (8 chips, horizontal scroll)
  - [ ] Message bubbles (user right / FORGE left)
  - [ ] FORGE avatar (28px ember gradient circle + Zap icon)
  - [ ] Loading typing dots animation
  - [ ] Inline markdown-lite renderer (bold + bullets)
  - [ ] Error message display
  - [ ] Sticky input footer (input + Send button)
  - [ ] Scroll-to-bottom on new message (`useEffect` + `scrollIntoView`)
  - [ ] Body scroll lock on open (`overflow: hidden`)
  - [ ] Keyboard-safe height (`90dvh`)
- [ ] **TASK 7** — Wire into `App.jsx`
- [ ] **TASK 8** — Deep-link "Ask FORGE" buttons in 4 existing pages

### QA
- [ ] Send "What weight did I do on Bench Press last time?" → gets exact weight + date from history
- [ ] Send "Am I losing weight?" → gets real delta from weight logs
- [ ] Send "Suggest protein meals for today" → India-aware suggestions (dal, paneer, eggs)
- [ ] Send "I have knee pain" → safe alternatives + physio disclaimer
- [ ] Send "mera bench press stuck hai" (Hinglish) → responds in Hinglish
- [ ] Send 31st message → gets rate limit error (not a crash)
- [ ] Open chat → close → reopen → messages still present (localStorage persistence)
- [ ] Clear history → messages gone
- [ ] Chat on mobile → keyboard opens → input stays visible (90dvh + sticky footer)
- [ ] Chat works on light theme (no dark-hardcoded colors)
- [ ] Gemini API key never appears in client-side network requests

---

## 🚫 Out of Scope (this phase)

- Voice input (Web Speech API — can be Phase 2, 1 day effort)
- Image upload (photo of food for calorie estimate — Phase 3)
- Hindi keyboard / script support (Hinglish is good enough for Phase 1)
- Sharing chat screenshots
- Multiple conversation threads (single thread per user is fine)
- Real-time streaming (polling the full response is simpler; streaming via SSE is Phase 2)
- FORGE proactive push notifications (separate from nudge dot in Phase 1)

---

## 🗒️ Implementation Notes

- **Token budget math:** System prompt ≈ 1,200–1,800 tokens. Last 20 messages ≈ 4,000 tokens. User message ≈ 50 tokens. Response ≤ 512 tokens. Total per call: ~6,000–7,000 tokens. At 1M tokens/day free limit → ~143 conversations/day before hitting the cap. More than enough for a personal app at scale.
- **Context freshness:** The system prompt is rebuilt every time the chat panel opens (not on every message). For a typical gym session, data doesn't change mid-conversation, so this is correct.
- **Hinglish handling:** Gemini 2.0 Flash handles Hindi/English code-switching natively — no special configuration needed. The system prompt instruction `"respond in the same language the user writes in"` is sufficient.
- **Safety:** The Edge Function handles auth — the Gemini API key is never in the client. The `supabase.auth.getUser()` call with the JWT ensures only the authenticated user's data is used.
- **Fallback if Gemini is down:** The Edge Function returns a clear error message. The `useChatbot` hook displays it as an error state (red bordered card below the input). No crash.
- **PR detection edge case:** `buildForgeSystemPrompt` uses estimated 1RM (`weight × (1 + reps/30)`) to rank PRs, matching the `ProgressPage` formula. This keeps the numbers consistent across the app.
- **Diet macro target computation in prompt:** Mirrors the exact same `goalKcal` / `targetProtein` logic used in `DietPage.jsx` so FORGE's advice matches what the app shows.

---

## 🔍 Gap Audit (Applied 2026-05-13)

The following gaps were identified by cross-referencing every code snippet in this
TODO against the actual FitTrack Pro codebase. All have been patched inline above.

| # | Gap | Severity | Section Fixed |
|---|-----|----------|---------------|
| 1 | **Architecture diagram contradiction** — diagram said steps 2–3 "Fetch context from Supabase / Build system prompt" happen server-side, but TASK 2 builds the prompt **client-side**. Diagram now matches reality (client builds prompt, Edge Function is a thin auth+proxy). | 🟠 High | Architecture diagram |
| 2 | **Deno import mismatch** — Edge Function used `https://esm.sh/@supabase/supabase-js@2` but the existing 4 Edge Functions in this project use `npm:@supabase/supabase-js@2.39.3` (the Deno `npm:` specifier). Mismatched import would cause deployment failures. | 🔴 Critical | TASK 3 |
| 3 | **Secret name `VITE_GEMINI_API_KEY`** — The `VITE_` prefix is reserved for client-side env vars in Vite. A Supabase Edge Function secret accessed via `Deno.env.get()` should be plain `GEMINI_API_KEY`. Using `VITE_` would either expose the key in the client bundle or fail silently server-side. | 🔴 Critical | TASK 1 note |
| 4 | **Food log macro field mismatch** — Context builder used `e.calories`, `e.protein`, etc. but food log entries store macros under a **nested `macros` object** (`e.macros.calories`, `e.macros.protein`). This is confirmed by `DietPage.jsx` line 212: `curr.macros?.calories`. Without this fix, FORGE would always report 0 kcal logged. | 🔴 Critical | TASK 2 |
| 5 | **Unused imports** — `calcDeficit` and `getRank` were imported in `chatbotContext.js` but never called. Removed to prevent bundler warnings. | 🟢 Low | TASK 2 |
| 6 | **Missing `deno.json`** — All existing Edge Functions have a `deno.json` config file. The `ai-chat` function spec was missing it. Added for consistency. | 🟠 Medium | TASK 3 |
| 7 | **Protein multiplier mismatch** — TODO used `2.2g/kg` for fat loss, but `DietPage.jsx` (line 174) uses `1.8` (or `2.0` for 5+ workout days). The TODO's values would make FORGE recommend different protein targets than what the user sees on the Diet Page. Fixed to mirror DietPage exactly. | 🔴 Critical | TASK 2 |
| 8 | **Calorie deficit/surplus mismatch** — TODO used `-400`/`+350` for loss/gain, but `DietPage.jsx` (line 165-166) uses `calcDeficit()` which computes dynamically based on timeline, with fallback of `-500`/`+400`. Fixed to match DietPage pattern. | 🟠 High | TASK 2 |
| 9 | **App.jsx wiring referenced nonexistent `<ThemeToggle />`** — No such component exists in App.jsx. Theme toggling is done via `<ThemeTogglePill />` inside DashboardPage and ProfilePage. The layout also used wrong class names (`main-content` → actual is `mc`). Corrected to match the real file. | 🟠 High | TASK 7 |
| 10 | **Missing `customGoalKcal` priority** — DietPage line 167 uses `user?.customGoalKcal || computedGoalKcal` to let adaptive engine overrides take precedence. The TODO’s context builder had no such fallback, so FORGE would always use the static TDEE × multiplier value. Fixed. | 🔴 Critical | TASK 2 |
| 11 | **Missing `customProteinG` priority** — Same issue: DietPage line 175 uses `user?.customProteinG` override. Added to context builder. | 🟠 High | TASK 2 |
| 12 | **"Streaming" claim** — Architecture and TASK 3 mentioned "Stream response back" and "streamed response" but the Edge Function code does a standard JSON `fetch()` + `Response()`, not SSE/streaming. Clarified as "Phase 1 = JSON response, Phase 2 = SSE streaming". | 🟢 Low | Architecture diagram |