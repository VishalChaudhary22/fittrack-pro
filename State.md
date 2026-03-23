# Fittrack Pro - Project State

This document provides a comprehensive overview of the current state of **Fittrack Pro**, including its tech stack, file structure, styling themes, and implemented features.

---

## 🛠️ Tech Stack

The application is built using a modern, lightweight, and robust frontend stack:

- **Core Framework**: React (v19.2.4)
- **Routing**: React Router DOM (v7.13.1)
- **Data Visualization**: Recharts (v3.8.0)
- **Icons**: Lucide React
- **Build Tool**: Vite (v8)
- **Linter**: ESLint (v9)

---

## 📂 File Structure

The project follows a component-based directory structure, organized by feature domains:

```text
fittrack-pro/
├── README.md
├── State.md (This file)
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
└── src/
    ├── App.jsx                # Main application component with routing
    ├── main.jsx               # Entry point
    ├── index.css              # Global styles, variables, themes, key animations
    ├── App.css                # App-specific styling rules
    ├── assets/                # Static assets (images, external fonts)
    ├── components/
    │   ├── layout/            # Layout components (Sidebar, BottomNav)
    │   ├── pages/             # Distinct routable pages (Dashboards, Logs, Maps)
    │   └── shared/            # Reusable UI components (ToastContainer, Cards, Buttons)
    ├── context/
    │   └── AppContext.jsx     # Global state provider (User sessions, Toast notifications)
    ├── data/                  # Static data models / mock data
    ├── hooks/                 # Custom React hooks
    └── utils/                 # Utility functions and helpers
```

---

## 🎨 Theme Details (Orange / Dark Mode)

Fittrack Pro features a highly polished **Dark Mode (Default)** and an alternative **Light Mode**, driven by CSS variables in `index.css`. The design uses modern aesthetics with vibrant orange accents, glassmorphism hints, and custom typography (`Bebas Neue` for strong accents and `DM Sans` for smooth readability).

### Dynamic Theme Switch
Themes are managed using the `data-theme` attribute (e.g., `<html data-theme="dark">` or `<html data-theme="light">`).

### Palette Highlights

| Theme | Background | Surfaces / Cards | Text | Special Effects |
|-------|------------|------------------|------|-----------------|
| **Dark** | Deep Black (`#050506`) | Off-blacks (`#111113`, `#161619`) | Off-white (`#EAEAF0`) | Soft ambient glow shadows (`rgba(232,84,13,.04)`) |
| **Light** | Light Gray (`#F2F2F5`) | Pure Whites (`#FFFFFF`, `#F7F7F9`) | Dark Gray (`#1A1A1E`) | Crisp, lightweight drop shadows (`rgba(0,0,0,.06)`) |
| **Semantic** | Adaptive Semantic | `var(--success)`, `var(--danger)`, `var(--error)` | Adaptive | Positive trends (`#51CF66`), warnings (`#FF6B6B`), and destructive actions (`#FF3B30`) |

### Orange Accent (Signature)
- **Base Color**: `#E8540D` (`--o`)
- **Gradient**: `linear-gradient(135deg, #E8540D, #FF6B35)` (`--og`)
- **Usage**: Used prominently across Primary Buttons (`.btn-p`), Navigation Action States (`.ni.act`), Tags (`.tag`), dynamic Progress Bars (`.pbar-fill`), and interactive elements to provide a striking, energetic contrast. Recent UI polish reduced overly aggressive orange usage in informational tags and lists to improve visual hierarchy and readability.

### UI Characteristics
- Smooth `0.25s` cubic-bezier transition states on buttons, cards, and interactives.
- Deep, highly defined box-shadows on cards and Modals (`--shadow`, `--shadow-lg`) providing physical layering.
- Polished Modal (`.mo`, `.md`) components utilizing background blurs (`backdrop-filter`).
- Built-in visual skeleton loading states and toast notifications integrated into CSS animations (`@keyframes`).

---

## ✨ Implemented Features

The application incorporates a rich set of pages aimed at a comprehensive fitness tracking experience:

1. **Authentication Layer**  
   - Users must authenticate through the `AuthModal.jsx` before accessing the app.
2. **Dashboard Overview**  
   - `DashboardPage.jsx`: The primary landing interface displaying summarized health data, metrics, or recent activities.
   - **Recent Updates:** BMI status labels feature improved readability, and the Weight Change trend indicator strictly compares the latest logged weight against the immediately previous entry. Muscle mini-tags updated to subtle grey to reduce visual clutter.
3. **Workout & Split Management**  
   - `SplitsPage.jsx`: Organize routines by muscle groups or scheduling protocols. Now accessible directly from the primary mobile bottom navigation.
   - `WorkoutPage.jsx`: The active session tracker.
   - **Recent Updates:** The tracker UI features a prominent "Rest Timer" control and a new rich **Post-Workout Summary** screen that dynamically highlights worked muscles on the `BodyMapSVG` and calculates Session XP, Sets, and Volume.
   - `WorkoutHistoryPage.jsx`: Comprehensive log of past workout sessions.
4. **Nutrition & Diet**  
   - `DietPage.jsx`: Interface for meal tracking and macro logging.
5. **Body Tracking & Analytics**  
   - `WeightLogPage.jsx`: Specific interface for body weight tracking.
   - `MeasurementsPage.jsx`: To track body dimensions.
   - `ProgressPage.jsx`: A data visualization page (using `recharts`) showcasing performance and body changes over time.
6. **Detailed Anatomical Visualization**  
   - `MuscleMapPage.jsx` & `BodyMapSVG.jsx`: A dedicated visual map highlighting muscle groups and areas of focus based on accumulated XP.
   - **Recent Updates:** Implemented a **Monthly XP Reset** system (with Consistency and Volume bonuses) to encourage sustained routines. Added a "Past Performance" widget to track historical monthly ranks. The `BodyMapSVG` has been upgraded to dynamically render **Female Anatomy Maps** if `user.gender` is 'female'.
7. **User Personalization**  
   - `ProfilePage.jsx`: Manage personal information, settings, and potentially theme toggling.
   - `ContactPage.jsx`: Provide feedback or reach support.
8. **App Structure & Responsiveness**  
   - Uses `Sidebar` for desktop and `BottomNav` for a dynamic app-like experience on mobile.
   - Context-managed global Toast System (`ToastContainer`) for immediate user feedback.
