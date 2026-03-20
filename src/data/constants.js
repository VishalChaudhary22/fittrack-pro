import { LayoutDashboard, Dumbbell, Target, Salad, TrendingUp, Mail, User, Clock, Scale, Ruler } from 'lucide-react';

// ─── ACTIVITY LEVELS ──────────────────────────────────────────────────────────
export const ACTIVITY = {
  sedentary: { label: 'Sedentary (no exercise)', mult: 1.2 },
  light: { label: 'Lightly Active (1–3 days/week)', mult: 1.375 },
  moderate: { label: 'Moderately Active (3–5 days/week)', mult: 1.55 },
  active: { label: 'Very Active (6–7 days/week)', mult: 1.725 },
  extra: { label: 'Extremely Active (athlete)', mult: 1.9 },
};

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
export const NAV = [
  { id: 'dashboard', label: 'Home', Icon: LayoutDashboard, path: '/' },
  { id: 'splits', label: 'Splits', Icon: Dumbbell, path: '/splits' },
  { id: 'workout', label: 'Tracker', Icon: Target, path: '/workout' },
  { id: 'diet', label: 'Diet', Icon: Salad, path: '/diet' },
  { id: 'progress', label: 'Progress', Icon: TrendingUp, path: '/progress' },
  { id: 'contact', label: 'Coaching', Icon: Mail, path: '/contact' },
  { id: 'profile', label: 'Profile', Icon: User, path: '/profile' },
];

// ─── EXTRA NAV (hidden in "More" on mobile) ──────────────────────────────────
export const NAV_MOBILE_MAIN = [
  { id: 'dashboard', label: 'Home', Icon: LayoutDashboard, path: '/' },
  { id: 'workout', label: 'Tracker', Icon: Target, path: '/workout' },
  { id: 'diet', label: 'Diet', Icon: Salad, path: '/diet' },
  { id: 'progress', label: 'Progress', Icon: TrendingUp, path: '/progress' },
];

export const NAV_MOBILE_MORE = [
  { id: 'splits', label: 'Splits', Icon: Dumbbell, path: '/splits' },
  { id: 'history', label: 'History', Icon: Clock, path: '/history' },
  { id: 'weightlog', label: 'Weight Log', Icon: Scale, path: '/weight-log' },
  { id: 'measurements', label: 'Measurements', Icon: Ruler, path: '/measurements' },
  { id: 'contact', label: 'Coaching', Icon: Mail, path: '/contact' },
  { id: 'profile', label: 'Profile', Icon: User, path: '/profile' },
];

// ─── BODY MEASUREMENT FIELDS ─────────────────────────────────────────────────
export const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest', unit: 'cm' },
  { key: 'waist', label: 'Waist', unit: 'cm' },
  { key: 'hips', label: 'Hips', unit: 'cm' },
  { key: 'bicepL', label: 'Bicep (L)', unit: 'cm' },
  { key: 'bicepR', label: 'Bicep (R)', unit: 'cm' },
  { key: 'thighL', label: 'Thigh (L)', unit: 'cm' },
  { key: 'thighR', label: 'Thigh (R)', unit: 'cm' },
  { key: 'neck', label: 'Neck', unit: 'cm' },
];
