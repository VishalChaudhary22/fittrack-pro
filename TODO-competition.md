# FitTrack Pro — FitPact: Pool-Based Fitness Challenges with Real Stakes

> **Created:** 2026-05-14 · **Updated:** 2026-05-15 · **Feature:** Pool-based fitness challenges — users join pools, pledge a fixed entry fee against a shared fitness goal. Winners split the pot. Losers' money goes to winners. If everyone loses, the entire pot goes to charity. FitTrack takes zero cut.
>
> **Research basis:** DietBet/WayBetter (pool payout model), StickK (Yale behavioral economics), Beeminder, Arnold's Pump Club pledge model. Compliant with India's **Promotion and Regulation of Online Gaming Act, 2025** and the **PROG Rules, 2026** (in force 1 May 2026).

---

## ⚖️ Legal Framework — PROG Act Compliance

### Classification

FitPact is a **pool-based challenge** where winners receive monetary gains from losers' deposits. Under the PROG Act 2025, this classifies as an **online money game**. However, it is a **permissible skill-based game** because the outcome is determined entirely by the user's physical effort and logging activity — there is zero element of chance.

| Dimension | FitPact (Pool Model) |
|-----------|---------------------|
| What user puts in | Fixed entry fee into a shared pool |
| What winners get back | Their deposit + proportional share of losers' deposits |
| What losers get back | ₹0 — their deposit is redistributed to winners |
| What happens if everyone wins | Everyone gets exact deposit back |
| What happens if everyone loses | Entire pool goes to charity |
| Does the platform profit? | **No** — FitTrack takes zero cut, zero platform fee |
| Element of chance | **None** — outcome is 100% determined by user's own effort |
| Legal classification | Online money game (skill-based) → Permissible under PROG Act |

### Mandatory Compliance Requirements

1. **OGAI Registration** — Register with the Online Gaming Authority of India (under MeitY) as an e-sport/skill-based game operator. Obtain a digital Certificate of Registration.
2. **KYC Verification** — PAN card mandatory for all pool participants before first entry. PAN verification via NSDL/UTIITSL API. Age verified to be 18+ via PAN data.
3. **TDS (Section 194BA)** — 30% TDS on net winnings is legally required. **Deferred to v1.1** — will implement before scale. See Known Gaps section.
4. **RazorpayX ESCROW+** — Player funds must be held in a trustee-managed escrow account, segregated from FitTrack's operating funds. RBI Payment Aggregator Master Directions (Sep 2025) mandate this.
5. **Responsible Gaming** — Session time tracking, voluntary self-exclusion option, maximum active pools cap (3 per user), spending visibility in wallet.
6. **Age Gate** — 18+ only. Verified via PAN-linked date of birth at KYC step.
7. **Grievance Redressal** — In-app support + dispute resolution mechanism (48h SLA).

### Platform Safeguards

1. **Zero platform fee** — FitTrack never takes any cut from pools. 100% redistribution.
2. **Outcome is 100% skill/effort-based** — verified via the user's own activity data (workout logs, cardio logs, food logs, PR logs). No randomness.
3. **Transparent redistribution** — pool math is visible to all participants: total pot, winner count, payout per winner.
4. **Charity fallback** — if all participants fail, entire pool goes to a pre-selected charity. No money disappears.
5. **Legal counsel required** before launch: engage a gaming/fintech lawyer to confirm PROG Act compliance and obtain OGAI registration. Annual compliance audit recommended.

### Payment Architecture

RazorpayX ESCROW+ (with Axis Trustee Services) for holding pool funds + Razorpay Checkout for entry fee collection + RazorpayX Payouts for withdrawals.

#### Complete Pool Payment Lifecycle

```
1. USER TAPS "JOIN POOL — ₹500 ENTRY"
   │
   ▼
2. KYC CHECK
   │  If user has no verified KYC → redirect to KYC flow
   │  PAN verification via NSDL API
   │  Age 18+ confirmed via PAN DOB
   │  One-time process; stored in `user_kyc` table
   │
   ▼
3. FRONTEND → Edge Function: `fitpact-pool-join`
   │  Validates: pool is 'open', user not already in pool, user has < 3 active pools
   │  Creates Razorpay order for entry fee
   │  Returns razorpay_order_id to frontend
   │
   ▼
4. FRONTEND opens Razorpay Checkout (web SDK)
   │  Entry fee charged (UPI / card / net banking)
   │  Funds deposited directly into ESCROW+ account
   │  (NOT FitTrack's operating account)
   │
   ▼
5. ON SUCCESS → Edge Function: `fitpact-verify-payment`
   │  Verifies HMAC-SHA256 signature
   │  Creates `fitpacts` row (user's entry in the pool)
   │  Updates pool participant count
   │
   ▼
6. JOIN WINDOW CLOSES (24h after pool creation)
   │  If participants < 2: auto-refund all from ESCROW+, pool cancelled
   │  If participants ≥ 2: pool status → 'locked' → 'active'
   │  Challenge period begins

═══════ CHALLENGE PERIOD (2–12 weeks) ═══════

7. NIGHTLY VERIFICATION (23:59 IST)
   │  fitpact-verify Edge Function evaluates each participant
   │  Failed participants marked immediately
   │  All participants can see pool progress

═══════ POOL SETTLEMENT ═══════

8. SETTLEMENT (after final checkpoint)
   │  Edge Function: `fitpact-pool-settle`
   │
   │  CASE A: Some win, some lose
   │    payout_per_winner = total_pool / winners_count
   │    ESCROW+ releases payout to each winner's wallet
   │    Losers receive ₹0
   │
   │  CASE B: Everyone wins
   │    Each participant gets exact entry fee back
   │    ESCROW+ releases original amount to each wallet
   │
   │  CASE C: Everyone loses
   │    Entire pool → charity via RazorpayX Payouts
   │    ESCROW+ releases to charity's bank account

═══════ WITHDRAWAL ═══════

9. WINNER WITHDRAWS FROM WALLET
   │  POST fitpact-withdraw Edge Function
   │  RazorpayX Payouts → user's bank account
   │  Processing: 1–3 business days
```

#### Payout Calculation

```
total_pool = entry_fee × total_participants

IF winners > 0 AND losers > 0:
  payout_per_winner = total_pool ÷ winners_count
  profit_per_winner = payout_per_winner - entry_fee
  Example: 10 join at ₹500, 7 win, 3 lose
           Pool = ₹5,000
           Payout = ₹5,000 ÷ 7 = ₹714 each
           Profit = ₹214 per winner

IF winners == total_participants:
  payout_per_winner = entry_fee  (everyone gets deposit back, no profit)

IF winners == 0:
  charity_payout = total_pool  (entire pool donated)
```

#### Wallet System

Users don't receive payouts directly to their bank account. Instead:

1. **Winnings credited to in-app wallet** (`user_wallets` table)
2. **Wallet balance** can be used to join new pools (no payment gateway needed) OR withdrawn to bank
3. **Withdrawal** triggers RazorpayX Payout to user's linked bank account
4. **Minimum withdrawal**: ₹100
5. **Wallet dashboard** shows: balance, transaction history, lifetime winnings, active pool locks

This reduces payment gateway fees (winners re-entering pools don't hit Razorpay twice) and gives users instant access to use winnings.

#### RazorpayX ESCROW+ Setup

> **Why ESCROW+?** RBI Payment Aggregator Master Directions (Sep 2025) require player funds to be held in trustee-managed escrow, segregated from the platform's operating funds. Standard current accounts create legal risk.

- Partner: Axis Trustee Services (via RazorpayX)
- Onboarding: ~14 business days
- Fund flow: Razorpay Checkout → ESCROW+ account → released on settlement
- FitTrack's operating account never touches pool funds

#### Charity Payout (when everyone loses)

- On "all lose" settlement: ESCROW+ releases full pool to charity bank account via RazorpayX Payouts
- Charity must be registered as RazorpayX beneficiary (same as before)
- UTR stored as receipt

#### Payment Failure & Retry Handling

- **Payment timeout/abandonment:** Stale join attempts cleaned up by `fitpact-cleanup` cron (>30 min old)
- **Pool cancellation refund:** If pool doesn't reach minimum 2 participants, ESCROW+ auto-refunds all entries within 24h
- **Settlement failure:** If ESCROW+ release fails, retry up to 5 times via daily cron. After 5 failures: escalate to admin
- **Withdrawal failure:** Track via `wallet_transactions.status`. Retry up to 3 times. After failures: admin queue

#### Environment Variables Required

```
RAZORPAY_KEY_ID              — public key (safe for frontend)
RAZORPAY_KEY_SECRET          — server-only (Edge Functions only)
RAZORPAY_WEBHOOK_SECRET      — for webhook signature verification
RAZORPAYX_ACCOUNT_ID         — for ESCROW+ and payouts
RAZORPAYX_ESCROW_ACCOUNT_ID  — ESCROW+ trustee account
NSDL_PAN_API_KEY             — for KYC PAN verification
```

---

## 🔑 Core Concept

> "Join a pool. Put in ₹500. Work out 4 days a week for the next 4 weeks. Everyone who makes it splits the pot — if 3 people out of 10 fail, their ₹1,500 gets split among the 7 who succeeded. If everyone fails, the entire pot goes to charity."

Behavioral science research (DietBet, StickK, Beeminder, Ariely/Loewenstein studies) shows:

- **Loss aversion** (Kahneman/Tversky): people work ~2× harder to avoid a loss than to achieve an equivalent gain
- **Social accountability** (DietBet data): pool-based challenges have ~40% higher completion rates than solo commitments due to peer pressure and visible progress
- **Financial upside motivation**: the possibility of earning MORE than you put in (unlike solo bonds) creates an additional positive incentive layer on top of loss aversion
- **Commitment contracts increase success rates by ~200%** vs. goal-setting alone (StickK internal data, Yale study 2019)
- **₹500 is the behavioral sweet spot** for Indian users: large enough to sting, small enough not to cause financial distress

---

## 🏗️ Challenge Types & Auto-Verification

All challenge types are auto-verified using data already flowing through FitTrack. No manual photo evidence required (v1). Manual evidence as optional upgrade in v2.

> **Note:** Step goals are explicitly **excluded** from v1. Steps can be entered manually and are trivially gameable — this undermines the integrity of a financial commitment contract.

| Challenge Type | ID | Metric Source | Verification Logic |
|---|---|---|---|
| **Gym Session Streak** | `gym-streak` | `workout_logs` | Logged N+ weight sessions in each rolling 7-day window of the pledge period |
| **Monthly Gym Frequency** | `gym-monthly` | `workout_logs` | Logged N+ weight sessions within each calendar month of the pledge period |
| **Cardio Sessions** | `cardio-sessions` | `cardio_logs` | Logged N cardio sessions (any type: run, cycle, swim, walk) within pledge period |
| **Calorie Burn** | `calorie-burn` | `workout_logs` + `cardio_logs` (via `calcWorkoutCalories` + `calcCardioCalories`) | Total estimated calories burned from all logged sessions ≥ target per week |
| **Active Minutes** | `active-minutes` | `workout_logs.durationMinutes` + `cardio_logs.minutes` | Total workout + cardio minutes ≥ target per week |
| **Workout Consistency** | `consistency-streak` | `workout_logs` (any type) | Logged at least 1 workout session on N out of every 7 days for the full pact duration |
| **PR Challenge** | `pr-challenge` | `workout_logs` — `est1rm` | Est. 1RM on selected exercise ≥ target weight by deadline date |
| **Workout Volume** | `volume-goal` | `workout_logs` | Total weekly volume (sets × reps × weight) ≥ target for each week |
| **Food Log Streak** | `food-streak` | `food_logs` | At least N food entries logged per day for M consecutive days |
| **Protein Target** | `protein-target` | `food_logs` — daily protein total | Daily logged protein ≥ N grams for M out of P days |
| **Weight Goal** | `weight-goal` | `health_logs` — bodyWeight | Logged body weight reaches or passes target by deadline (loss or gain direction specified) |
| **Body Fat Goal** | `bodyfat-goal` | `body_fat_logs` | Logged BF% reaches or passes target by deadline |

### Verification Rules (v1 — Auto Only)

- A challenge period has **weekly checkpoints** for weekly challenges (not just a final deadline). Monthly challenges (`gym-monthly`) use **monthly checkpoints**. If a user misses a checkpoint, the forfeit is triggered immediately — no waiting until the end. This prevents "I'll catch up in the last week" behavior.
- **Grace buffer (weekly)**: exactly **1 missed day** per 7-day window is allowed for all daily-based challenges. This is realistic for life happening; Beeminder calls this "akrasia insurance."
- **Grace buffer (monthly)**: exactly **2 missed days** per 30-day window for monthly challenges.
- **Timezone**: always evaluate against `Asia/Kolkata` (IST), never UTC. A workout logged at 11:58pm IST counts for that day.
- **Calorie estimation disclaimer**: calorie burn challenges use MET-based estimates (via `calcWorkoutCalories` and `calcCardioCalories` in `metValues.js`). These are approximate (±20%) but consistent with the data the user already sees in their workout history. The commitment is against their own tracking — not clinical accuracy.

---

## 📐 Data Schema (Supabase)

### New Tables

#### `fitpact_pools` — One row per pool/challenge round

```sql
CREATE TABLE fitpact_pools (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Challenge definition
  challenge_type    TEXT NOT NULL,          -- 'gym-streak' | 'gym-monthly' | 'cardio-sessions' | 'calorie-burn' | 'active-minutes' | 'consistency-streak' | 'pr-challenge' | 'volume-goal' | 'food-streak' | 'protein-target' | 'weight-goal' | 'bodyfat-goal'
  title             TEXT NOT NULL,          -- "4 Gym Sessions/Week for 4 Weeks"
  description       TEXT,                   -- longer description shown on pool card
  target_metric     JSONB NOT NULL,         -- { sessions_per_week: 4, min_duration_minutes: 30 }
  duration_weeks    INTEGER NOT NULL,       -- 2 | 4 | 8 | 12
  checkpoint_type   TEXT DEFAULT 'weekly',  -- 'weekly' | 'monthly'

  -- Pool rules
  entry_fee         INTEGER NOT NULL,       -- in paise (₹500 = 50000). Fixed for all participants.
  currency          TEXT DEFAULT 'INR',
  min_participants  INTEGER DEFAULT 2,
  max_participants  INTEGER DEFAULT 100,
  charity_id        TEXT REFERENCES fitpact_charities(id) NOT NULL,

  -- Lifecycle
  status            TEXT DEFAULT 'open',    -- 'open' | 'locked' | 'active' | 'settled' | 'cancelled'
  join_deadline     TIMESTAMPTZ NOT NULL,   -- 24h after creation
  start_date        DATE,                   -- set when pool locks
  end_date          DATE,                   -- computed from start_date + duration_weeks
  locked_at         TIMESTAMPTZ,
  settled_at        TIMESTAMPTZ,
  cancelled_at      TIMESTAMPTZ,

  -- Settlement data (populated on settlement)
  total_pool        INTEGER,               -- entry_fee × participant_count (in paise)
  participant_count INTEGER DEFAULT 0,
  winners_count     INTEGER,
  losers_count      INTEGER,
  payout_per_winner INTEGER,               -- total_pool ÷ winners_count (in paise)
  charity_payout_amount INTEGER,           -- total_pool if everyone loses, else 0
  charity_payout_status TEXT DEFAULT 'none', -- 'none' | 'pending' | 'completed' | 'failed'
  charity_receipt_url TEXT,                -- UTR from RazorpayX charity payout

  -- Creator
  created_by        UUID REFERENCES auth.users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fitpact_pools ENABLE ROW LEVEL SECURITY;
-- All authenticated users can read pools; only creator can modify (before lock)
CREATE POLICY "Anyone can read pools" ON fitpact_pools FOR SELECT USING (true);
CREATE POLICY "Creator manages pool" ON fitpact_pools FOR UPDATE USING (auth.uid() = created_by);
```

#### `fitpacts` — One row per user per pool (participation entry)

```sql
CREATE TABLE fitpacts (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pool_id        UUID REFERENCES fitpact_pools(id) NOT NULL,
  user_id        UUID REFERENCES auth.users(id) NOT NULL,

  -- Payment
  entry_fee      INTEGER NOT NULL,         -- in paise (copy from pool at join time)
  razorpay_order_id   TEXT,
  razorpay_payment_id TEXT,

  -- Status
  status         TEXT NOT NULL DEFAULT 'pending_payment',
    -- 'pending_payment' | 'active' | 'succeeded' | 'failed' | 'failed_pending_dispute' | 'refunded'
  failed_at      TIMESTAMPTZ,
  succeeded_at   TIMESTAMPTZ,

  -- Payout (populated on pool settlement)
  payout_amount  INTEGER,                 -- what user receives (in paise). 0 if failed.
  profit_amount  INTEGER,                 -- payout_amount - entry_fee (can be 0 or positive)

  -- Checkpoints (per-user progress within the pool)
  checkpoints    JSONB DEFAULT '[]',      -- [{period: 1, start_date, end_date, target, actual, passed: bool}]
  current_period INTEGER DEFAULT 1,

  -- Metadata
  joined_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at     TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(pool_id, user_id)                -- one entry per user per pool
);

ALTER TABLE fitpacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own pacts" ON fitpacts
  USING (auth.uid() = user_id);
-- Pool members can see each other's status (for leaderboard)
CREATE POLICY "Pool members see co-participants" ON fitpacts FOR SELECT
  USING (pool_id IN (SELECT pool_id FROM fitpacts WHERE user_id = auth.uid()));

-- Enforce max 3 active pools per user (checked via Edge Function before insert)
```

#### `fitpact_progress` — Daily progress log (auto-inserted by cron)

```sql
CREATE TABLE fitpact_progress (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fitpact_id   UUID REFERENCES fitpacts(id) ON DELETE CASCADE,
  user_id      UUID REFERENCES auth.users(id),
  date         DATE NOT NULL,
  metric_value NUMERIC,                -- e.g. sessions done, protein grams, calories burned, active minutes
  verified     BOOLEAN DEFAULT false,  -- passed daily/weekly threshold
  raw_data     JSONB,                  -- snapshot of source data (workout_log ids, calorie totals, etc.)
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(fitpact_id, date)
);

ALTER TABLE fitpact_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own progress" ON fitpact_progress
  USING (auth.uid() = user_id);
```

#### `user_wallets` — In-app wallet for pool winnings

```sql
CREATE TABLE user_wallets (
  user_id            UUID PRIMARY KEY REFERENCES auth.users(id),
  balance            INTEGER DEFAULT 0,      -- available balance in paise
  locked_balance     INTEGER DEFAULT 0,      -- entry fees for active pools (not withdrawable)
  lifetime_deposits  INTEGER DEFAULT 0,      -- total paid into pools
  lifetime_winnings  INTEGER DEFAULT 0,      -- total earned from pools
  lifetime_withdrawn INTEGER DEFAULT 0,      -- total withdrawn to bank
  linked_bank_ifsc       TEXT,               -- user's bank for withdrawals
  linked_bank_account    TEXT,               -- user's bank account number (encrypted)
  razorpayx_contact_id   TEXT,               -- RazorpayX beneficiary ID
  razorpayx_fund_account_id TEXT,            -- RazorpayX fund account ID
  created_at         TIMESTAMPTZ DEFAULT NOW(),
  updated_at         TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_wallets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own wallet" ON user_wallets
  USING (auth.uid() = user_id);
```

#### `wallet_transactions` — Full ledger of wallet activity

```sql
CREATE TABLE wallet_transactions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID REFERENCES auth.users(id) NOT NULL,
  type         TEXT NOT NULL,            -- 'pool_entry' | 'pool_winnings' | 'pool_refund' | 'withdrawal' | 'withdrawal_failed'
  amount       INTEGER NOT NULL,         -- in paise (positive for credits, negative for debits)
  balance_after INTEGER NOT NULL,        -- wallet balance after this transaction
  pool_id      UUID REFERENCES fitpact_pools(id), -- related pool (if applicable)
  razorpay_payout_id TEXT,              -- for withdrawals
  status       TEXT DEFAULT 'completed', -- 'completed' | 'pending' | 'failed'
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own transactions" ON wallet_transactions
  USING (auth.uid() = user_id);
```

#### `user_kyc` — PAN verification for PROG Act compliance

```sql
CREATE TABLE user_kyc (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id),
  pan_hash       TEXT NOT NULL,          -- SHA-256 hash of PAN (never store raw PAN)
  pan_last_four  TEXT NOT NULL,          -- last 4 chars for display: "XXXX1234"
  name_on_pan    TEXT NOT NULL,          -- as returned by NSDL verification
  dob            DATE NOT NULL,          -- date of birth from PAN data (for 18+ check)
  status         TEXT DEFAULT 'verified', -- 'pending' | 'verified' | 'rejected'
  verified_at    TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_kyc ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own KYC" ON user_kyc
  USING (auth.uid() = user_id);
```

#### `fitpact_charities` — Curated list of Indian NGOs

```sql
CREATE TABLE fitpact_charities (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  tagline          TEXT,
  category         TEXT,                -- 'hunger' | 'health' | 'education' | 'environment' | 'animal-welfare'
  logo_url         TEXT,
  bank_account_ifsc       TEXT,
  bank_account_number     TEXT,
  razorpayx_contact_id    TEXT,
  razorpayx_fund_account_id TEXT,
  payout_method   TEXT DEFAULT 'razorpayx',
  giveindia_id     TEXT,
  is_active        BOOLEAN DEFAULT true,
  display_order    INTEGER
);
-- Public read, admin-only write
```

#### `cardio_logs` — Cardio session data (required for cardio/calorie/active-minutes challenges)

```sql
CREATE TABLE cardio_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES auth.users(id) NOT NULL,
  date        DATE NOT NULL,
  type        TEXT NOT NULL,
  minutes     INTEGER NOT NULL,
  calories    INTEGER,
  distance_km NUMERIC,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE cardio_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own cardio" ON cardio_logs
  USING (auth.uid() = user_id);
```

#### `fitpact_disputes` — Dispute tracking for failed participants

```sql
CREATE TABLE fitpact_disputes (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fitpact_id   UUID REFERENCES fitpacts(id),
  pool_id      UUID REFERENCES fitpact_pools(id),
  user_id      UUID REFERENCES auth.users(id),
  reason       TEXT NOT NULL,
  evidence_url TEXT,
  status       TEXT DEFAULT 'open',     -- 'open' | 'under_review' | 'upheld' | 'overturned'
  admin_notes  TEXT,
  resolved_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fitpact_disputes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users access own disputes" ON fitpact_disputes
  USING (auth.uid() = user_id);
```

### AppContext State Additions

```js
// In AppContext.jsx
fitpactPools: [],        // all pools user has joined (active + settled)
availablePools: [],      // open pools user can join (discovery feed)
wallet: null,            // { balance, locked_balance, lifetime_winnings, ... }
walletTransactions: [],  // recent wallet activity
kycStatus: null,         // 'none' | 'pending' | 'verified' | 'rejected'
```

### localStorage Key

`fittrack_fitpact_pools_<userId>` — write-through cache for user's pool participations.
`fittrack_wallet_<userId>` — write-through cache for wallet balance.

---

## 📦 Files to Create / Modify

| File | Status | Purpose |
|------|:------:|---------
| `supabase/migrations/YYYYMMDD_fitpact_schema.sql` | 🆕 NEW | Tables: `fitpact_pools`, `fitpacts`, `fitpact_progress`, `fitpact_charities`, `cardio_logs`, `fitpact_disputes`, `user_wallets`, `wallet_transactions`, `user_kyc` |
| `supabase/migrations/YYYYMMDD_fitpact_seed_charities.sql` | 🆕 NEW | Seed 10 curated Indian NGO charities with bank details |
| `supabase/functions/fitpact-pool-join/index.ts` | 🆕 NEW | Validates pool join, creates Razorpay order, returns `order_id` |
| `supabase/functions/fitpact-verify-payment/index.ts` | 🆕 NEW | Verifies HMAC-SHA256 signature; creates fitpact entry in pool |
| `supabase/functions/fitpact-payment-webhook/index.ts` | 🆕 NEW | Razorpay webhook (backup): confirms payment on `payment.captured` |
| `supabase/functions/fitpact-pool-lock/index.ts` | 🆕 NEW | Cron: locks pools past join deadline; cancels pools with < 2 participants |
| `supabase/functions/fitpact-verify/index.ts` | 🆕 NEW | Nightly cron (23:59 IST): evaluates checkpoints for all active pools |
| `supabase/functions/fitpact-pool-settle/index.ts` | 🆕 NEW | Settles completed pools: calculates payouts, credits wallets, handles charity |
| `supabase/functions/fitpact-withdraw/index.ts` | 🆕 NEW | Processes wallet → bank withdrawal via RazorpayX Payouts |
| `supabase/functions/fitpact-kyc-verify/index.ts` | 🆕 NEW | PAN verification via NSDL API; creates `user_kyc` row |
| `supabase/functions/fitpact-notify/index.ts` | 🆕 NEW | Push + in-app notifications for pool events |
| `supabase/functions/fitpact-cleanup/index.ts` | 🆕 NEW | Cleanup: stale payments, retry failed settlements/withdrawals |
| `src/components/pages/FitPactPoolsPage.jsx` | 🆕 NEW | Pool discovery feed: browse open pools, join, filter by type |
| `src/components/pages/FitPactPoolDetailPage.jsx` | 🆕 NEW | Single pool view: participants, leaderboard, progress, settlement results |
| `src/components/pages/FitPactCreatePoolPage.jsx` | 🆕 NEW | Create new pool wizard: challenge → config → entry fee → charity → publish |
| `src/components/pages/FitPactWalletPage.jsx` | 🆕 NEW | Wallet dashboard: balance, transactions, withdraw, link bank |
| `src/components/pages/FitPactKYCPage.jsx` | 🆕 NEW | KYC flow: PAN input → verification → success |
| `src/components/shared/FitPactPoolCard.jsx` | 🆕 NEW | Pool card component: pot size, participants, time left, join CTA |
| `src/components/shared/FitPactWidget.jsx` | 🆕 NEW | Dashboard widget: active pool progress + pot size |
| `src/utils/fitpactUtils.js` | 🆕 NEW | Verification logic, progress calc, checkpoint evaluation |
| `src/utils/razorpayUtils.js` | 🆕 NEW | `loadRazorpayScript()`, `createCheckoutInstance()` |
| `src/utils/walletUtils.js` | 🆕 NEW | Wallet balance helpers, transaction formatting |
| `src/utils/kycUtils.js` | 🆕 NEW | PAN validation, KYC flow helpers |
| `src/data/constants.js` | ✏️ MODIFY | Add `/fitpact`, `/fitpact/wallet`, `/fitpact/kyc` nav entries |
| `App.jsx` | ✏️ MODIFY | Add pool routes: `/fitpact`, `/fitpact/pool/:id`, `/fitpact/create`, `/fitpact/wallet`, `/fitpact/kyc` |
| `src/context/AppContext.jsx` | ✏️ MODIFY | Add `fitpactPools`, `wallet`, `kycStatus`, `availablePools` state |
| `src/components/pages/DashboardPage.jsx` | ✏️ MODIFY | Render `<FitPactWidget />` when user has active pool participation |
| `src/components/pages/WorkoutHistoryPage.jsx` | ✏️ MODIFY | Sync cardio entries to `cardio_logs` Supabase table |

---

## 🗺️ Implementation Roadmap

### Phase 1 — Legal, OGAI Registration, ESCROW+ Setup, Schema & KYC

- [ ] **Legal counsel**: engage a gaming/fintech lawyer for PROG Act compliance review. Confirm skill-based classification. Obtain opinion letter.
- [ ] **OGAI Registration**: apply for Certificate of Registration with Online Gaming Authority of India (under MeitY) as skill-based game operator
- [ ] **RazorpayX ESCROW+ onboarding**: initiate setup with Axis Trustee Services (~14 business days). Configure ESCROW+ account for pool fund holding.
- [ ] **ToS update**: add "FitPact Terms" section covering:
  - Pool-based challenge structure and payout redistribution model
  - "FitTrack does not receive any portion of pool funds"
  - "Winners receive their entry fee plus a proportional share of losers' entry fees"
  - "If all participants fail, the entire pool is donated to the selected charity"
  - Age restriction: 18+ (verified via PAN KYC)
  - Dispute/withdrawal policy
  - Responsible gaming disclosures
- [ ] Create migration: `fitpact_pools`, `fitpacts`, `fitpact_progress`, `fitpact_charities`, `cardio_logs`, `fitpact_disputes`, `user_wallets`, `wallet_transactions`, `user_kyc` tables with RLS
- [ ] Seed 10 charity partners with bank account details for RazorpayX
- [ ] Set up RazorpayX Payouts for charity payouts + user withdrawals
- [ ] Configure Razorpay webhook endpoint
- [ ] Set up NSDL PAN verification API for KYC
- [ ] Build KYC flow: `FitPactKYCPage.jsx` + `fitpact-kyc-verify` Edge Function
- [ ] Migrate cardio data from WorkoutHistoryPage local storage to `cardio_logs` Supabase table

### Phase 2 — Pool Creation & Join (`FitPactCreatePoolPage.jsx` + `FitPactPoolsPage.jsx`)

**Two user flows:** (A) Create a new pool, (B) Browse and join an existing pool.

#### Flow A: Create a Pool — 5-Step Wizard

Each step is a full-screen card with smooth slide animation (matching `pgIn/pgOut` transitions from `index.css`).

**Step 1 — Choose Your Challenge**

Horizontal category row (icon + label chips) followed by challenge cards:

```
┌─────────────────────────────────────────┐
│  💪  WHAT CHALLENGE ARE YOU CREATING?   │
│                                         │
│  [🏋️ Gym Sessions]  [🏃 Cardio]        │
│  [🔥 Calorie Burn]  [🏆 Personal Record] │
│  [🥗 Nutrition]  [⚖️ Weight Goal]       │
│  [⏱ Active Minutes]  [🔗 Consistency]  │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │ 🏋️ Gym Session Streak           │    │
│  │ Work out X days every week      │    │
│  │ Auto-verified via your logs ✓   │    │
│  │                          [Select] │  │
│  └─────────────────────────────────┘   │
│  ...                                    │
└─────────────────────────────────────────┘
```

**Step 2 — Configure Goal + Duration**

Dynamic form fields based on challenge type selected (same config options as before: sliders, toggles, etc.)

Duration selector:
```
How long is this challenge?
  [2 weeks]  [4 weeks ★]  [8 weeks]  [12 weeks]
  ★ Most popular — enough to build a habit
```

**Step 3 — Entry Fee**

```
┌────────────────────────────────────────┐
│  SET THE ENTRY FEE FOR THIS POOL      │
│  (Everyone pays the same amount)       │
│                                        │
│  [₹250]  [₹500 ★]  [₹1,000]  [₹2,000] │
│           Custom: ₹ [____]             │
│                                        │
│  ⓘ  Winners split the pot.            │
│     If everyone fails, it goes to      │
│     charity. FitTrack keeps ₹0.        │
│                                        │
│  Example: 10 people join at ₹500       │
│  Pool: ₹5,000                          │
│  If 7 win: each gets ₹714             │
│  Profit per winner: ₹214              │
└────────────────────────────────────────┘
```

- Min: ₹100 · Max: ₹5,000 (v1 cap)
- Custom amount allowed in ₹50 increments

**Step 4 — Choose Charity (fallback if everyone loses)**

```
IF EVERYONE FAILS, THE ENTIRE POT GOES TO:

  [🍎 Hunger]  [🏥 Health]  [📚 Education]
  [🌱 Environment]  [🐾 Animals]

  ┌────────────────────────────────────┐
  │ 🍽  Akshaya Patra Foundation       │
  │ Provides meals to school children  │
  │ Rated A+ on GiveIndia              │
  │                         [Choose ●] │
  └────────────────────────────────────┘
```

**Step 5 — Review & Publish**

```
┌────────────────────────────────────────┐
│  YOUR POOL                             │
│                                        │
│  Challenge: 4 gym sessions/week        │
│  Duration:  4 weeks                    │
│  Entry fee: ₹500 per person            │
│  Charity:   Akshaya Patra (if all fail)│
│  Join window: 24h after creation       │
│  Min participants: 2                   │
│                                        │
│  By publishing you agree to FitPact    │
│  Terms and you'll be the first to join.│
│                                        │
│  [ PUBLISH POOL & JOIN — ₹500  ]       │
└────────────────────────────────────────┘
```

- Publishing creates the pool AND auto-joins the creator (with payment)
- Pool appears in the discovery feed immediately
- KYC check happens before payment (redirect to KYC if not verified)

#### Flow B: Browse & Join a Pool (`FitPactPoolsPage.jsx`)

```
┌─────────────────────────────────────────┐
│  🔥 OPEN POOLS                         │
│  [All] [Gym] [Cardio] [Nutrition]      │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🏋️ 4 Sessions/Week × 4 Weeks    │   │
│  │ Entry: ₹500 · Pot: ₹4,500       │   │
│  │ 👥 9/100 joined · ⏰ 6h left    │   │
│  │                       [Join →]   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ 🔥 Burn 2,000 kcal/week × 8 Wks │   │
│  │ Entry: ₹1,000 · Pot: ₹3,000     │   │
│  │ 👥 3/50 joined · ⏰ 18h left    │   │
│  │                       [Join →]   │   │
│  └─────────────────────────────────┘   │
│                                         │
│  Can't find what you want?              │
│  [+ Create Your Own Pool]              │
└─────────────────────────────────────────┘
```

- Filter by challenge type category
- Sort by: newest / most popular / ending soon
- Each `FitPactPoolCard` shows: challenge, entry fee, current pot, participants, time left to join

#### Join Flow (for both creator and joiners)

1. Tap "Join" → KYC check (if not verified → `FitPactKYCPage.jsx`)
2. KYC passes → Razorpay Checkout opens → entry fee charged
3. On success: fitpact row created, pool participant count incremented
4. Confirmation screen: "You're in! 🔥 Pool starts when join window closes."

Implementation:
- [ ] Build pool creation wizard `FitPactCreatePoolPage.jsx` (5 steps)
- [ ] Step 1: challenge type selector with icons (12 types across 7 categories)
- [ ] Step 2: dynamic config form per challenge type + duration selector
- [ ] Step 3: entry fee chips + custom input; payout example calculation
- [ ] Step 4: charity grid with category filters
- [ ] Step 5: review card + publish (creates pool + joins creator)
- [ ] Build pool discovery page `FitPactPoolsPage.jsx`
- [ ] `FitPactPoolCard.jsx` component: pot size, participants, time left, join CTA
- [ ] Pool join flow: KYC check → payment → confirmation
- [ ] `fitpact-pool-join` Edge Function: validates pool open, user not already in, max 3 active pools, creates Razorpay order
- [ ] `fitpact-verify-payment` Edge Function: HMAC verification, creates fitpact row, updates pool count
- [ ] `fitpact-pool-lock` cron: locks pools past 24h join deadline; cancels + refunds pools with < 2 participants
- [ ] `razorpayUtils.js`: `loadRazorpayScript()`, `createCheckoutInstance(orderData)`
- [ ] Max 3 active pool enforcement in UI + Edge Function

### Phase 3 — Auto-Verification Engine (`fitpact-verify` Edge Function)

The most critical backend piece. A Supabase Edge Function scheduled via `pg_cron` to run at **23:59 IST daily** (18:29 UTC).

```ts
// supabase/functions/fitpact-verify/index.ts
// Called by pg_cron every night at 23:59 IST

async function verifyAllActivePacts() {
  const today = getTodayIST(); // YYYY-MM-DD in Asia/Kolkata
  const activePacts = await getAllActivePacts();

  for (const pact of activePacts) {
    const progress = await computeDailyProgress(pact, today);
    await upsertFitpactProgress(pact.id, today, progress);

    const weeklyResult = await evaluateCurrentWeek(pact, today);

    if (weeklyResult.weekComplete && !weeklyResult.passed) {
      // User missed a weekly checkpoint — forfeit immediately
      await triggerForfeit(pact, weeklyResult);
    } else if (pact.end_date === today && weeklyResult.passed) {
      // Final day, all checkpoints passed — trigger success + refund
      await triggerSuccess(pact);
    }
  }
}
```

**`computeDailyProgress(pact, date)`** — routes to the right data source:

| Challenge | Query |
|-----------|-------|
| `gym-streak` | Count `workout_logs` rows where `user_id = X` and `date = today` and `type = 'weights'` and (if min_duration set) `duration_minutes >= min` |
| `gym-monthly` | Count `workout_logs` rows for the current calendar month matching criteria (same as gym-streak but monthly window) |
| `cardio-sessions` | Count `cardio_logs` rows for the week matching type filter |
| `calorie-burn` | Sum `calcWorkoutCalories(log, userWeightKg)` for all `workout_logs` + `calcCardioCalories(entry, userWeightKg)` for all `cardio_logs` in the current week |
| `active-minutes` | Sum `workout_logs.durationMinutes` + `cardio_logs.minutes` for the current week |
| `consistency-streak` | Check if at least 1 `workout_logs` entry exists for today (any type) |
| `pr-challenge` | Query `workout_logs` exercises for target exercise, compute `est1rm` from max set, compare to `target_metric.target_1rm` |
| `volume-goal` | Sum `sets × reps × weight` across all `workout_logs` exercises for the current week |
| `food-streak` | Count distinct `food_logs` dates for user in the pact period |
| `protein-target` | Sum `food_logs.protein` for today, compare to `target_metric.daily_protein_g` |
| `weight-goal` | Latest `health_logs.body_weight` vs `target_metric.target_weigh### Phase 4 — Pool Detail Page (`FitPactPoolDetailPage.jsx`) + Wallet (`FitPactWalletPage.jsx`)

#### Pool Detail Page

Shows full pool info, participant progress, and settlement results. Accessible by tapping a pool from the discovery feed or from "My Pools" list.

```
┌────────────────────────────────────────────┐
│  PageHeader: 🏋️ 4 Sessions/Week × 4 Wks   │
├────────────────────────────────────────────┤
│  STATUS: ACTIVE · Week 2 of 4             │
│  Entry fee: ₹500 · Pot: ₹5,000           │
│  👥 10 participants                        │
│  If you win: est. ₹714 each               │
│  Charity: Akshaya Patra (if all fail)     │
├────────────────────────────────────────────┤
│  YOUR PROGRESS                             │
│  ✅ Week 1: 4/4 sessions  PASSED           │
│  🔄 Week 2: 2/4 sessions  (3 days left)   │
│  ⬜ Week 3: Not started                    │
│  ⬜ Week 4: Not started                    │
├────────────────────────────────────────────┤
│  LEADERBOARD                               │
│  🟢 You        ✅✅ 2/4 checkpoints       │
│  🟢 Amit       ✅✅ 2/4 checkpoints       │
│  🟢 Priya      ✅🔄 1/4 checkpoints       │
│  🔴 Raj        ✅❌ FAILED week 2          │
│  🟢 Neha       ✅✅ 2/4 checkpoints       │
│  ... (10 total)                            │
├────────────────────────────────────────────┤
│  [Dispute] (if you've been marked failed) │
└───────────────────────────────────────�- [ ] Routes: `/fitpact/pool/:id`, `/fitpact/wallet`: "Tell us what happened" (text + optional screenshot)
- Creates `fitpact_disputes` row
- Pool settlement is **not blocked** — dispute resolution happens post-settlement
- Resolution: `'upheld'` (no change) or `'overturned'` (payout credited from reserve)

Implementation:
- [ ] Build `FitPactPoolDetailPage.jsx` with active progress + participant leaderboard
- [ ] Settlement results view with payout display
- [ ] Build `FitPactWalletPage.jsx` with balance, transaction list, withdraw flow
- [ ] Bank account linking flow (IFSC + account validation)
- [ ] `fitpact-withdraw` Edge Function: validates balance, creates RazorpayX payout
- [ ] Dispute modal with text area + file upload
- [ ] "My Pools" tab on `FitPactPoolsPage.jsx` (active + settled pools)
- [ ] Routes: `/fitpact/pool/:id`, `/fitpact/wallet`and live counts
- "Current checkpoint" row highlighted in ember if at risk (< 50% of target with < 3 days left)
- Days remaining countdown: "8 days left"
- Deposit and charity reminder at the bottom

Past pacts:
- Status badge: ✅ Succeeded / ❌ Forfeited / ⏳ Disputed
- On Succeeded: show refund status ("Refund processing" / "₹X refunded on [date]" / "Refund delayed")
- On Forfeited: show charity name + "₹X donated in your name" + receipt link
- On Disputed: show dispute status ("Under review" / "Upheld" / "Overturned — refund processing")

**Cancel flow** (modal, before pact starts its first checkpoint window):
- Allowed: within 24h of activation (payment not yet processed through the system)
- After first checkpoint starts: no cancellation — commitment is locked
- Cancellation modal: "Are you sure? Your commitment to yourself is worth more than ₹500. If you need to pause for medical reasons, use the Pause option."
- Medical/emergency exception: see Pause rules below

**Pause flow** (v1):
- Available via "Pause Pact" button on active pact card (only if `pause_days_used < 7`)
- Requires text explanation (medical/emergency reason)
- Must be activated **before** the current checkpoint deadline, not after
- Max pause duration: 7 days total per pact lifetime (1 pause allowed)
- Pausing extends `end_date` by the number of paused days
- Paused checkpoints are not evaluated (skipped)
- Resume is automatic after pause duration ends, or manual via "Resume" button
- Abuse prevention: if user pauses and then logs workouts during pause, pause is auto-cancelled

**Dispute flow** (on forfeited pacts):
- "Dispute This Forfeit" button appears on forfeited pact cards (only within 48h of forfeit)
- Opens modal: "Tell us what happened" (text area + optional screenshot upload)
- Creates `fitpact_disputes` row with `status: 'open'`
- Pact remains in `forfeited_pending_dispute` status (charity payout blocked)
- Admin reviews via Supabase dashboard
- Resolution: `'upheld'` (forfeit stands, payout proceeds) or `'overturned'` (refund issued)
- Push notification with result

Implementation:
- [ ] Build `FitPactPage.jsx` with active pact card + past pacts list + refund status display
- [ ] Checkpoint component: progress row with icon, fraction, status chip (supports both weekly and monthly)
- [ ] Cancel modal with locked state after first checkpoint starts
- [ ] Pause modal with reason field; pause/resume state management
- [ ] Dispute modal with text area + file upload; creates `fitpact_disputes` row
- [ ] Past pacts: refund status tracking (pending/processed/failed) via `refund_status` field
- [ ] Past pacts: dispute status display for `forfeited_pending_dispute` pacts
- [ ] Fetch `fitpacts` + `fitpact_progress` + `fitpact_disputes` from Supabase on mount
- [ ] Route `/fitpact` in `App.jsx` and nav entry in `constants.js`

### Phase 5 — Dashboard Widget (`FitPactWidget.jsx`)

Compact widget surfaced on the Dashboard when an active pact exists. Positioned below the Readiness widget.

```
┌─────────────────────────────────────────┐
│  🔒 FITPACT ACTIVE                      │
│  4 Gym Sessions/Week — Week 2 of 4     │
│                                         │
│  [●●●○]  Week 2: 3 of 4 done           │
│  3 days left to complete this week      │
│                                         │
│  ₹500 deposit · Akshaya Patra          │
│                         [View →]        │
└─────────────────────────────────────────┘
```

- If current week is "at risk" (≤ 50% goal with ≤ 2 days left): card border pulses in `--primary-container` ember with a warning chip "⚠️ At risk this week — log a session today"
- If current week is "safe" (goal met): border turns green `#4ADE80`, chip reads "✅ This week is locked in"

Implementation:
- [ ] `FitPactWidget.jsx` — reads `activeFitpact` from context, computes current week status
- [ ] At-risk vs safe border animation (CSS class toggle, `--ease-spring` transition)
- [ ] Render in `DashboardPage.jsx` only when `activeFitpact !== null`

### Phase 6 — Notifications & Nudges (Push + In-App)

Extend the existing `send-workout-reminder` Edge Function infrastructure.

| Trigger | Message | Channel |
|---------|---------|---------|
| Daily at 8pm IST if current week target not met | "💰 FitPact check: you need X more sessions before Sunday to keep your ₹500. Don't let Akshaya Patra down!" | Push |
| 48h before weekly deadline, at risk | "⚡ 2 days left. Your ₹500 needs 2 more workouts this week. Let's go." | Push |
| Weekly checkpoint passed | "✅ Week N complete — you're ₹500 closer to a full refund. Keep going." | In-app toast |
| Weekly checkpoint failed → forfeit triggered | "😔 Week N missed. ₹500 donated to [Charity]. Head to FitPact to start fresh." | Push |
| Pact succeeded → refund initiated | "🎉 FitPact COMPLETE! Refund of ₹500 is processing (5–7 days). You earned it." | Push + in-app banner |
| No active pact + user has a streak | "🔒 You've worked out 5 days in a row. Ready to pledge on yourself? Start a FitPact." | In-app (Dashboard) |

Implementation:
- [ ] Add `fitpact-notify` Edge Function (scheduled + event-triggered)
- [ ] In-app nudge on Dashboard: if no active pact and user has a 5+ day workout streak, show a "Start FitPact" suggestion card below the streak card

---

## 💳 Charity Partners (Seed Data — v1)

10 curated Indian NGOs with GiveIndia verification (A+ or A rated). Bank details required for RazorpayX payout integration:

| ID | Name | Category | Rating | Why Included |
|----|------|----------|--------|--------------|
| `akshaya-patra` | Akshaya Patra Foundation | Hunger | A+ | 2M+ school meals/day; high recognition |
| `smile-foundation` | Smile Foundation | Education/Health | A+ | Broad mandate; strong awareness |
| `cry-india` | CRY — Child Rights and You | Education | A+ | High trust; 40+ years of operation |
| `help-age-india` | HelpAge India | Elder care | A+ | Widely trusted |
| `care-india` | CARE India | Health/Women | A+ | Maternal + child health |
| `goonj` | Goonj | Disaster relief | A+ | Urban-rural resource transfer; popular with young donors |
| `teach-for-india` | Teach For India | Education | A | Strong urban youth resonance |
| `icall-mental-health` | iCall (TISS) | Mental health | A | Directly relevant to FitTrack's wellness audience |
| `wildlife-sos` | Wildlife SOS | Environment | A | Animal welfare; differentiates from hunger/education |
| `peta-india` | PETA India | Animal welfare | A | Alternative for animal lovers |

> **Payout integration:** Each charity must be registered as a RazorpayX beneficiary with their bank account details (IFSC + account number). Contact each NGO's finance team to obtain verified bank details. For v2, pursue GiveIndia corporate partnership for automated 80G tax receipt generation.

---

## 🎮 Gamification Layer

FitPact should reward engagement beyond financial mechanics.

### Badges / Achievements

| Badge | Trigger | Visual |
|-------|---------|--------|
| **First Pact** | Creates and activates first FitPact | 🔒 Lock icon, ember gradient |
| **Pact Keeper** | Completes first FitPact successfully | 🏆 Trophy, gold glow |
| **Unbreakable** | Completes 3 FitPacts in a row with no forfeits | 💎 Diamond, blue-white glow |
| **Habit Machine** | Completes a 12-week FitPact | ⚙️ Gear, mechanical aesthetic |
| **Generous Quitter** | Forfeits a pact (gave to charity) — positive framing | 💚 Heart, green — "Even quitting did good" |
| **High Roller** | Completes a ₹2,000+ FitPact | 💰 Gold chip |

Badges appear on `ProfilePage` in the "Achievements" section. First Pact badge can also appear on Dashboard as a one-time celebration card.

### Streak Integration

FitPact completion weeks increment the existing workout streak. A completed FitPact week is treated the same as a manual streak entry for the streak badge count.

### Olympus League XP

Completing a FitPact awards a one-time XP bonus to the target muscle group (for gym/cardio pacts) or to a new "Discipline" category:
- 2-week pact success: +200 Discipline XP
- 4-week pact success: +500 Discipline XP
- 8-week pact success: +1,200 Discipline XP
- 12-week pact success: +2,500 Discipline XP

---

## 🧪 Verification & Test Cases

### Automated Validation

- [ ] All 12 challenge types correctly compute daily progress from Supabase data sources
- [ ] Grace day logic (weekly): 1 missed day per 7-day window does NOT trigger forfeit
- [ ] Grace day logic (monthly): 2 missed days per 30-day window does NOT trigger forfeit
- [ ] Missing 2 days in a week DOES trigger forfeit at end of that window (weekly challenges)
- [ ] PR challenge: Est. 1RM calculation matches existing PR logic in `exerciseHistory.js`
- [ ] Timezone correctness: a workout logged at 23:58 IST is counted for that calendar day, not the next
- [ ] Calorie burn: `calcWorkoutCalories` + `calcCardioCalories` sums match expected totals from `metValues.js`
- [ ] Active minutes: `durationMinutes` + cardio `minutes` sum correctly across multiple sessions per day
- [ ] Consistency streak: any workout type (weights, cardio, yoga) counts toward the daily check
- [ ] Monthly checkpoint evaluation fires at month-end, not at arbitrary 7-day windows
- [ ] Concurrent pact limit: creating a 3rd pact when 2 are active returns error
- [ ] Refund status tracking: `refund_status` transitions correctly through `pending` → `processed` / `failed`
- [ ] Charity payout retry: failed payouts are retried up to 5 times by `fitpact-cleanup` cron
- [ ] Dispute window: charity payout does NOT execute during the 48h `forfeited_pending_dispute` window

### Manual Test Cases

1. **Happy path — Gym streak**: Create 4-sessions/week pact for 4 weeks. Log 4 sessions each week. Verify refund triggered on day 28, `status = 'succeeded'`, and `refund_status = 'pending'`.
2. **Forfeit path**: Create 4-sessions/week pact. Log only 2 sessions in week 1. Verify `forfeited_pending_dispute` at end of week 1 (not at end of day 28). Verify charity payout fires only after 48h dispute window.
3. **Grace day**: Miss 1 gym session in week 2 but log 4 in all other weeks. Verify pact NOT forfeited (grace day consumed), success triggered at day 28.
4. **Cancel within 24h**: Pay ₹500, immediately cancel within 24h of payment. Verify refund processed, `status = 'cancelled'`.
5. **Cancel attempt after week 1 starts**: Verify cancel button is disabled / shows "Pact is locked" error.
6. **PR challenge**: Log a bench press session with 80kg × 5 reps (est. 1RM ~89kg). Set PR target to 90kg. Verify pact not yet succeeded. Log 90kg × 3 reps (est. 1RM ~97kg). Verify success trigger.
7. **Charity payout**: On forfeit (after 48h), verify RazorpayX payout is called with correct `fund_account_id` and `amount`. Verify UTR stored. Verify FitTrack receives no funds.
8. **Dashboard widget at-risk state**: Active pact with 2 days left in week, 1/4 sessions done. Verify widget shows ember pulsing border and "⚠️ At risk" chip.
9. **Two devices**: Activate pact on mobile, check that it appears on desktop without refresh (realtime sync via existing `scheduleCloudRefresh` mechanism).
10. **Push notification**: Reach 8pm IST with an at-risk pact. Verify push notification fires with correct copy.
11. **Calorie burn pact**: Create 2,000 kcal/week pact. Log workouts totaling 1,800 kcal estimated. Verify not yet passed. Log another session pushing total to 2,100 kcal. Verify checkpoint passed.
12. **Monthly gym frequency**: Create 16-sessions/month pact for 2 months. Log 16 sessions in month 1. Verify month 1 checkpoint passes. Log only 14 in month 2. Verify forfeit at month-end.
13. **Active minutes**: Create 200-minutes/week pact. Log 3 workouts at 45 min + 1 cardio at 30 min = 165 min. Verify not yet passed. Log another 40 min cardio. Verify passed.
14. **Pause flow**: Activate pact. Pause with reason. Verify checkpoint evaluation is skipped during pause. Resume. Verify end_date extended.
15. **Dispute flow**: Forfeit a pact. Tap "Dispute" within 48h. Verify `fitpact_disputes` row created. Verify charity payout is blocked. Admin overturns → verify refund issued.
16. **Refund status display**: After successful pact, verify past pacts list shows "Refund processing", then updates to "₹500 refunded on [date]" after Razorpay webhook confirms.
17. **Payment abandonment**: Open Razorpay modal, close without paying. Verify `pending_payment` row is cleaned up by cron after 30 min.
18. **Max pact limit**: Create 2 active pacts. Attempt to create a 3rd. Verify error message and disabled button.

---

## ❗ Risk Factors & Mitigations

| Risk | Mitigation |
|------|-----------|
| **India PROG Act 2025 classification risk** | Charitable forfeit model + no platform enrichment + legal opinion letter. Never call it a "bet" or "game" in UI. |
| **Razorpay refund delays** (5–7 business days) | Set user expectation clearly in success screen and in ToS. Show refund status tracking in past pacts list (`refund_status` field). UPI refunds are typically instant–2 days. |
| **RazorpayX payout failures** | Store payout as `charity_payout_status: 'failed'`. Retry via `fitpact-cleanup` cron daily up to 5 times. After 5 failures: escalate to admin queue for manual processing. Never block the forfeit UX on API response. |
| **Verification gaming** (e.g. logging fake workouts) | v1 relies on self-reported app data — same trust level as the rest of FitTrack. v2: photo evidence option, GPS route verification for cardio. |
| **User disputes** ("App didn't log my workout!") | 48h dispute window after forfeit (`forfeited_pending_dispute` status). User can file dispute via in-app modal. Charity payout blocked until dispute resolved. `fitpact_progress` data available as evidence. |
| **Financial distress / problem behavior** | ₹5,000 max cap. ToS age gate (18+). Links to National Problem Gambling helpline in ToS. Max 2 active pacts simultaneously. |
| **Chargebacks** | Razorpay dispute handling. ToS explicitly states no refund once first checkpoint starts, except for app-side technical errors. |
| **Calorie estimation inaccuracy** | MET-based estimates are ±20% approximate. Disclosed in wizard Step 2 and ToS. User commitment is against their own tracking system, not clinical accuracy. |
| **Stale pending_payment rows** | `fitpact-cleanup` cron deletes `pending_payment` rows older than 30 minutes. Prevents DB clutter from abandoned payments. |
| **Refund failures** | `refund_status` tracking with 3 automatic retries over 3 days. After 3 failures: escalate to admin for manual refund via Razorpay dashboard. |
| **Account deletion with active pact** | Block account deletion while active pact exists. Show message: "Complete your FitPact or wait for it to end before deleting your account." If forced deletion (legal request): refund deposit, delete pact data. |

---

## 🔢 Deposit Amount Reference

Based on behavioral research and Indian purchasing power:

| Deposit | Equivalent "pain" | Best for |
|---------|------------------|----------|
| ₹100–₹250 | Low stakes — coffee money | Beginners, testing the feature |
| **₹500** | **Sweet spot — a meal out** | **Default recommendation** |
| ₹1,000 | Meaningful — gym monthly fee | Experienced users, high-value goals |
| ₹2,000 | High stakes — weekend trip | Serious athletes, 8–12 week pacts |
| ₹5,000 (max) | Very high stakes | Advanced users only |

---

## 📊 Success Metrics (post-launch)

Track these to validate feature health and iterate:

| Metric | Target (3 months post-launch) |
|--------|-------------------------------|
| Pact activation rate | > 8% of MAU creates at least 1 pact |
| Pact success rate | > 65% (healthy = motivating but achievable) |
| Repeat pact rate | > 50% of successful pact users start a second |
| Forfeit-to-restart rate | > 30% of users who forfeit start a new pact within 2 weeks |
| NPS lift | Users with completed pacts have NPS ≥ 15 points higher than non-users |
| Avg deposit amount | ₹450–₹600 |
| Charity donation total | Track as a positive PR metric — "₹X donated by FitTrack users" |
| Dispute rate | < 5% of forfeits result in disputes |
| Refund success rate | > 99% of refunds process without manual intervention |
| Challenge type popularity | Track which of the 12 types are most activated |

---

## 🔑 Key UX Language Rules

The legal safety of the feature depends partly on consistent framing. Every engineer and designer working on this must use this vocabulary:

| ✅ USE | ❌ NEVER USE |
|--------|------------|
| Pledge | Bet |
| Commitment deposit | Stake / Wager |
| Get your deposit back | Win / Earn |
| Commitment contract | Game |
| Miss your goal → charity donation | Lose your money / Lose your bet |
| FitPact | Money game |
| Activation | Entry / Buy-in |

---

## 🔲 Known Gaps / Deferred to v2+

| Item | Version | Notes |
|------|---------|-------|
| **Step goal challenges** | v2 | Excluded from v1 because steps can be entered manually, undermining financial commitment integrity. v2: require wearable API integration (Apple HealthKit / Google Fit) for tamper-resistant step verification. |
| **Anti-charity option** | v2 | Psychologically powerful but complex to source responsibly. |
| **Photo evidence verification** | v2 | Manual photo upload for gym check-ins. Requires moderation pipeline. |
| **GPS route verification** | v2 | For cardio pacts: verify actual outdoor run vs. logged entry via web Geolocation API. |
| **GiveIndia 80G receipts** | v2 | Requires corporate partnership. Provides tax-deductible receipts for donors. |
| **KYC / PAN collection** | v2 | Required for 80G receipts above ₹2,000 aggregate per user per year. Store encrypted PAN hash. |
| **Wearable API integration** | v2 | Apple HealthKit, Google Fit, Fitbit for tamper-resistant activity data. Enables step goals and HR-zone challenges. |
| **Heart rate zone challenges** | v2 | Pledge to spend N minutes in Zone 3+ per week. Requires wearable HR data integration. |
| **Partial refunds** | v2 | "Partial success" model: completed 3 of 4 weeks → refund 75%. More nuanced but reduces binary failure stress. |
| **Social / group pacts** | v3 | Two friends pledge against each other (not the house) — zero-sum between friends only. Legally clean but complex UX. |
| **Corporate wellness** | v3 | Employer-funded pact deposits as a wellness benefit. StickK's biggest revenue source. |
| **Pledge without deposit** | v2 | Social-only commitment contract (no money, just public accountability). |
| **₹5,000+ deposits** | v2+ | Requires additional KYC. Deferred until user demand proven. |
| **Admin dashboard** | v1.1 | Web panel for reviewing disputes, monitoring failed payouts, manual refund processing. Critical for ops but not user-facing. |