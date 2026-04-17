import { LayoutDashboard, Dumbbell, Target, Salad, TrendingUp, Mail, User, Clock, Scale, Ruler, Activity } from 'lucide-react';

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
  { id: 'progress', label: 'Analytics', Icon: TrendingUp, path: '/progress' },
  { id: 'musclemap', label: 'Olympus League', Icon: Activity, path: '/muscle-map' },
  { id: 'contact', label: 'Coaching', Icon: Mail, path: '/contact' },
  { id: 'profile', label: 'Profile', Icon: User, path: '/profile' },
];

// ─── EXTRA NAV (hidden in "More" on mobile) ──────────────────────────────────
export const NAV_MOBILE_MAIN = [
  { id: 'dashboard', label: 'Home', Icon: LayoutDashboard, path: '/' },
  { id: 'splits', label: 'Splits', Icon: Dumbbell, path: '/splits' },
  { id: 'workout', label: 'Tracker', Icon: Target, path: '/workout' },
  { id: 'diet', label: 'Diet', Icon: Salad, path: '/diet' },
  { id: 'progress', label: 'Analytics', Icon: TrendingUp, path: '/progress' },
];

export const NAV_MOBILE_MORE = [
  { id: 'history', label: 'History', Icon: Clock, path: '/history' },
  { id: 'weightlog', label: 'Weight Log', Icon: Scale, path: '/weight-log' },
  { id: 'measurements', label: 'Measurements', Icon: Ruler, path: '/measurements' },
  { id: 'musclemap', label: 'Olympus League', Icon: Activity, path: '/muscle-map' },
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

// ─── BODY FAT % CATEGORIES (ACE Standard) ────────────────────────────────────
export const BF_CATEGORIES = {
  male: [
    { label: 'Essential Fat', min: 2,  max: 5,  color: '#4ECDC4' },
    { label: 'Athlete',       min: 6,  max: 13, color: '#51CF66' },
    { label: 'Fitness',       min: 14, max: 17, color: '#82C91E' },
    { label: 'Average',       min: 18, max: 24, color: '#FFD166' },
    { label: 'High',          min: 25, max: 100,color: '#FF6B6B' },
  ],
  female: [
    { label: 'Essential Fat', min: 10, max: 13, color: '#4ECDC4' },
    { label: 'Athlete',       min: 14, max: 20, color: '#51CF66' },
    { label: 'Fitness',       min: 21, max: 24, color: '#82C91E' },
    { label: 'Average',       min: 25, max: 31, color: '#FFD166' },
    { label: 'High',          min: 32, max: 100,color: '#FF6B6B' },
  ],
};

// ─── BODY FAT MEASUREMENT METHODS ────────────────────────────────────────────
export const BF_METHODS = [
  { id: 'inbody',      label: 'InBody Scan',      note: '±1–2%' },
  { id: 'dexa',        label: 'DEXA Scan',         note: '±1% (most accurate)' },
  { id: 'smart_scale', label: 'Smart Scale (BIA)', note: '±3–8%' },
  { id: 'calipers',    label: 'Skinfold Calipers', note: '±3–5%' },
  { id: 'navy',        label: 'Navy Method',       note: '±3–4% (calculated)' },
  { id: 'visual',      label: 'Visual / Other',    note: '' },
];
