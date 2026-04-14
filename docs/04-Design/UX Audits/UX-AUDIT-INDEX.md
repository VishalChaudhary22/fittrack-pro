# FitTrack Pro — UX Audit File Index

> **Audit Date:** 2026-03-26 | **Method:** Line-level code review against 99 UX heuristics, mobile-first fitness app patterns, and Indian market expectations.

This audit has been split into focused files. Each file maps to a single domain so an AI agent can load exactly what it needs without reading irrelevant context.

---

## File Map

| File | Sections Covered | Items | Critical? |
|------|-----------------|-------|-----------|
| [`TODO-UX-01-global-design-system.md`](./TODO-UX-01-global-design-system.md) | UX-1.x | 7 items | 🔴 2 Critical |
| [`TODO-UX-02-navigation.md`](./TODO-UX-02-navigation.md) | UX-2.x | 5 items | — |
| [`TODO-UX-03-dashboard.md`](./TODO-UX-03-dashboard.md) | UX-3.x | 6 items | — |
| [`TODO-UX-04-workout-tracker.md`](./TODO-UX-04-workout-tracker.md) | UX-4.x | 7 items | 🔴 1 Critical |
| [`TODO-UX-05-splits.md`](./TODO-UX-05-splits.md) | UX-5.x | 4 items | — |
| [`TODO-UX-06-diet.md`](./TODO-UX-06-diet.md) | UX-6.x | 5 items | — |
| [`TODO-UX-07-progress.md`](./TODO-UX-07-progress.md) | UX-7.x | 4 items | — |
| [`TODO-UX-08-muscle-map.md`](./TODO-UX-08-muscle-map.md) | UX-8.x | 4 items | — |
| [`TODO-UX-09-measurements-weightlog.md`](./TODO-UX-09-measurements-weightlog.md) | UX-9.x, UX-10.x | 5 items | — |
| [`TODO-UX-10-profile-auth-contact.md`](./TODO-UX-10-profile-auth-contact.md) | UX-11.x, UX-12.x, UX-13.x | 9 items | 🔴 1 Critical |
| [`TODO-UX-11-charts-animations-mobile.md`](./TODO-UX-11-charts-animations-mobile.md) | UX-14.x, UX-15.x, UX-16.x | 12 items | 🔴 1 Critical |
| [`TODO-UX-12-gamification-indian-market.md`](./TODO-UX-12-gamification-indian-market.md) | UX-17.x, UX-18.x | 9 items | 🔴 2 Critical |
| [`TODO-UX-13-accessibility-performance.md`](./TODO-UX-13-accessibility-performance.md) | UX-19.x, UX-20.x | 8 items | — |

---

## Severity Legend

| Symbol | Meaning |
|--------|---------|
| 🔴 Critical | Breaks a core user task or causes drop-off |
| 🟠 High | Significantly degrades experience |
| 🟡 Medium | Noticeable friction, clearly improvable |
| 🟢 Low | Polish, delight, nice-to-have |

---

## Priority Summary (All Items)

| ID | Item | File | Severity | Effort |
|----|------|------|----------|--------|
| UX-1.6 | Error Boundary | global-design-system | 🔴 | 🟢 Small |
| UX-1.7 | Workout unload guard | global-design-system | 🔴 | 🟢 Small |
| UX-11.1 | Plain-text passwords | profile-auth-contact | 🔴 | 🟡 Medium |
| UX-17.1 | Onboarding flow | gamification-indian-market | 🔴 | 🔴 Large |
| UX-16.1 | Touch targets 44px | charts-animations-mobile | 🔴 | 🟢 Small |
| UX-18.1 | ~~WhatsApp CTA~~ *(duplicate of UX-13.1)* | gamification-indian-market | — | — |
| UX-4.1 | Non-blocking rest timer | workout-tracker | 🟠 | 🟡 Medium |
| UX-2.1 | Today's workout shortcut | navigation | 🟠 | 🟡 Medium |
| UX-4.5 | Previous session visible | workout-tracker | 🟠 | 🟢 Small |
| UX-4.6 | Partial save warning | workout-tracker | 🟠 | 🟢 Small |
| UX-6.1 | Diet type segmented control | diet | 🟠 | 🟢 Small |
| UX-6.2 | Scaled meal macros | diet | 🟠 | 🟡 Medium |
| UX-1.5 | Modal scroll lock | global-design-system | 🟠 | 🟢 Small |
| UX-1.3 | Touch card feedback | global-design-system | 🟠 | 🟢 Small |
| UX-19.1 | Orange contrast WCAG | accessibility-performance | 🟠 | 🟡 Medium |
| UX-19.2 | aria-label icon buttons | accessibility-performance | 🟠 | 🟢 Small |
| UX-13.1 | WhatsApp CTA | profile-auth-contact | 🟠 | 🟢 Small |
| UX-18.2 | Indian food database | gamification-indian-market | 🟠 | 🟡 Medium |
| UX-8.1 | Canvas loading skeleton | muscle-map | 🟠 | 🟢 Small |
| UX-4.2 | Progressive overload hint | workout-tracker | 🟠 | 🟡 Medium |
| UX-3.1 | Time-aware greeting | dashboard | 🟢 | 🟢 Small |
| UX-4.3 | Workout duration timer | workout-tracker | 🟡 | 🟢 Small |
| UX-4.4 | PR detection + toast | workout-tracker | 🟡 | 🟢 Small |
| UX-3.3 | 7-day streak calendar | dashboard | 🟡 | 🟢 Small |
| UX-7.1 | Smart progress defaults | progress | 🟡 | 🟢 Small |
| UX-12.1 | Try Demo one-click | profile-auth-contact | 🟡 | 🟢 Small |
| UX-10.2 | Weight delta goal-aware | measurements-weightlog | 🟡 | 🟢 Small |
| UX-11.2 | Profile cancel edit | profile-auth-contact | 🟡 | 🟢 Small |
| UX-20.1 | Route code splitting | accessibility-performance | 🟡 | 🟡 Medium |
| UX-17.2 | Streak shield mechanic | gamification-indian-market | 🟡 | 🟡 Medium |
| UX-9.1 | Body fat estimate | measurements-weightlog | 🟡 | 🟢 Small |
| UX-16.4 | iOS numeric keyboard | charts-animations-mobile | 🟡 | 🟢 Small |
| UX-19.3 | Modal focus trap | accessibility-performance | 🟡 | 🟡 Medium |
| UX-19.4 | prefers-reduced-motion | accessibility-performance | 🟡 | 🟢 Small |
| UX-3.4 | On-track goal indicator | dashboard | 🟡 | 🟢 Small |
| UX-5.2 | Workout duration estimate | splits | 🟡 | 🟢 Small |
| UX-6.4 | Calorie entry delete | diet | 🟡 | 🟢 Small |
| UX-8.2 | Weakest muscle callout | muscle-map | 🟡 | 🟢 Small |
| UX-2.4 | More sheet animation | navigation | 🟡 | 🟢 Small |
| UX-1.2 | Radius scale tokens | global-design-system | 🟢 | 🟡 Medium |
| UX-3.2 | BMI range indicator | dashboard | 🟢 | 🟢 Small |
| UX-14.1 | Chart semantic colors | charts-animations-mobile | 🟢 | 🟢 Small |
| UX-17.3 | Weekly summary digest | gamification-indian-market | 🟢 | 🟡 Medium |
| UX-18.4 | Hindi labels option | gamification-indian-market | 🟢 | 🔴 Large |

---

## Recommended Implementation Waves

### Wave 1a — Critical + High Quick Wins (Small effort, Critical/High impact)
`UX-1.6, UX-1.7, UX-16.1, UX-1.5, UX-1.3, UX-4.6, UX-4.5, UX-13.1, UX-19.2, UX-14.3`

### Wave 1b — Medium/Low Quick Wins (Small effort, visible polish)
`UX-6.1, UX-8.1, UX-19.4, UX-10.2, UX-11.2, UX-12.1, UX-4.3, UX-4.4, UX-3.1, UX-3.3, UX-3.4, UX-16.4, UX-5.2, UX-6.4, UX-4.7`

### Wave 2 — Medium Effort, High Value
`UX-4.1, UX-2.1, UX-6.2, UX-4.2, UX-9.1, UX-7.1, UX-8.2, UX-19.3, UX-20.1, UX-17.2`

### Wave 3 — Strategic Enhancements (Large scope, design + planning needed)
`UX-17.1 (Onboarding), UX-11.1 (Password hashing), UX-18.2 (Food database), UX-19.1 (WCAG orange), UX-8.3 (Muscle trends)`
