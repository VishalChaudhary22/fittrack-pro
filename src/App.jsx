import { useState, useMemo, useCallback } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, Dumbbell, Salad, TrendingUp, Mail, User, Plus, Edit2, Trash2, X, ChevronDown, LogOut, Scale, Target, Menu, Settings, CheckCircle, ChevronRight, Flame, Zap, Award, Eye, EyeOff } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;500;600;700;800&family=Barlow:wght@300;400;500;600&display=swap');
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #080b10; color: #e8eaf0; font-family: 'Barlow', sans-serif; }
    ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #0f1520; }
    ::-webkit-scrollbar-thumb { background: #1e3a5f; border-radius: 2px; }
    .glow { text-shadow: 0 0 20px rgba(0,255,136,0.4); }
    .card-glow { box-shadow: 0 0 30px rgba(0,255,136,0.05), 0 4px 24px rgba(0,0,0,0.5); }
    .btn-primary { background: linear-gradient(135deg, #00ff88, #00cc6a); color: #080b10; font-family: 'Barlow Condensed', sans-serif; font-weight: 700; font-size: 15px; letter-spacing: 1px; text-transform: uppercase; border: none; cursor: pointer; border-radius: 8px; padding: 10px 24px; transition: all 0.2s; }
    .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(0,255,136,0.3); }
    .btn-ghost { background: transparent; border: 1px solid #1e3a5f; color: #8899aa; font-family: 'Barlow', sans-serif; cursor: pointer; border-radius: 8px; padding: 8px 16px; transition: all 0.2s; font-size: 13px; }
    .btn-ghost:hover { border-color: #00ff88; color: #00ff88; }
    .btn-danger { background: transparent; border: 1px solid #ff4444; color: #ff4444; font-family: 'Barlow', sans-serif; cursor: pointer; border-radius: 6px; padding: 6px 12px; font-size: 12px; transition: all 0.2s; }
    .btn-danger:hover { background: rgba(255,68,68,0.1); }
    input, select, textarea { background: #0f1823; border: 1px solid #1e3a5f; color: #e8eaf0; font-family: 'Barlow', sans-serif; border-radius: 8px; padding: 10px 14px; font-size: 14px; outline: none; width: 100%; transition: border-color 0.2s; }
    input:focus, select:focus, textarea:focus { border-color: #00ff88; }
    label { font-size: 12px; color: #8899aa; font-weight: 600; letter-spacing: 0.8px; text-transform: uppercase; display: block; margin-bottom: 6px; }
    .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
    .modal { background: #0d1520; border: 1px solid #1e3a5f; border-radius: 16px; padding: 32px; width: 100%; max-width: 520px; max-height: 85vh; overflow-y: auto; }
    .tag { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; letter-spacing: 0.5px; text-transform: uppercase; }
    .tag-green { background: rgba(0,255,136,0.1); color: #00ff88; border: 1px solid rgba(0,255,136,0.2); }
    .tag-blue { background: rgba(59,130,246,0.1); color: #60a5fa; border: 1px solid rgba(59,130,246,0.2); }
    .tag-orange { background: rgba(251,146,60,0.1); color: #fb923c; border: 1px solid rgba(251,146,60,0.2); }
    .tag-red { background: rgba(248,113,113,0.1); color: #f87171; border: 1px solid rgba(248,113,113,0.2); }
    .tag-purple { background: rgba(167,139,250,0.1); color: #a78bfa; border: 1px solid rgba(167,139,250,0.2); }
    @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
    .fade-in { animation: fadeIn 0.3s ease forwards; }
    .nav-item { display: flex; align-items: center; gap: 12px; padding: 11px 16px; border-radius: 10px; cursor: pointer; transition: all 0.2s; color: #8899aa; font-size: 14px; font-weight: 500; }
    .nav-item:hover { background: rgba(0,255,136,0.05); color: #e8eaf0; }
    .nav-item.active { background: rgba(0,255,136,0.1); color: #00ff88; border-left: 3px solid #00ff88; }
    .metric-card { background: linear-gradient(135deg, #0d1a2d, #0f1e35); border: 1px solid #1e3a5f; border-radius: 14px; padding: 20px 24px; }
    .section-title { font-family: 'Barlow Condensed', sans-serif; font-size: 22px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #e8eaf0; }
    .recharts-tooltip-wrapper .recharts-default-tooltip { background: #0d1520 !important; border: 1px solid #1e3a5f !important; border-radius: 8px !important; }
  `}</style>
);

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT SPLITS DATA
// ─────────────────────────────────────────────────────────────────────────────
const buildId = () => Math.random().toString(36).slice(2, 9);

const INITIAL_SPLITS = [
  {
    id: 'ppl', name: 'Push Pull Legs', emoji: '🔥',
    description: '6 days/week — PPL PPL Rest', color: '#00ff88',
    schedule: ['Push','Pull','Legs','Push','Pull','Legs','Rest'],
    days: [
      { id:'ppl-d1', name:'Push Day A', type:'push', exercises:[
        {id:buildId(),name:'Bench Press',sets:4,repsRange:'6-8',muscle:'Chest',notes:'Progressive overload focus'},
        {id:buildId(),name:'Incline Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:buildId(),name:'Overhead Press',sets:4,repsRange:'8-10',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:'Go lighter, feel the burn'},
        {id:buildId(),name:'Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:buildId(),name:'Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ppl-d2', name:'Pull Day A', type:'pull', exercises:[
        {id:buildId(),name:'Deadlift',sets:4,repsRange:'4-6',muscle:'Back/Hamstrings',notes:'King of exercises'},
        {id:buildId(),name:'Pull-ups',sets:4,repsRange:'8-10',muscle:'Back',notes:'Use assistance if needed'},
        {id:buildId(),name:'Barbell Row',sets:4,repsRange:'8-10',muscle:'Back',notes:''},
        {id:buildId(),name:'Face Pulls',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:'Shoulder health'},
        {id:buildId(),name:'Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Hammer Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'ppl-d3', name:'Legs Day A', type:'legs', exercises:[
        {id:buildId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:'Depth matters'},
        {id:buildId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Leg Press',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Calf Raises',sets:5,repsRange:'15-25',muscle:'Calves',notes:'Often undertrained'},
        {id:buildId(),name:'Hip Thrusts',sets:3,repsRange:'12-15',muscle:'Glutes',notes:''},
      ]},
      { id:'ppl-d4', name:'Push Day B', type:'push', exercises:[
        {id:buildId(),name:'Incline Bench Press',sets:4,repsRange:'8-10',muscle:'Chest',notes:''},
        {id:buildId(),name:'Cable Flyes',sets:3,repsRange:'12-15',muscle:'Chest',notes:'Mind-muscle connection'},
        {id:buildId(),name:'Dumbbell Shoulder Press',sets:4,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Skull Crushers',sets:3,repsRange:'10-12',muscle:'Triceps',notes:''},
        {id:buildId(),name:'Tricep Dips',sets:3,repsRange:'10-15',muscle:'Triceps',notes:'Bodyweight or weighted'},
      ]},
      { id:'ppl-d5', name:'Pull Day B', type:'pull', exercises:[
        {id:buildId(),name:'Weighted Pull-ups',sets:4,repsRange:'6-8',muscle:'Back',notes:'Add weight progressively'},
        {id:buildId(),name:'Seated Cable Row',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Lat Pulldown',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:buildId(),name:'Preacher Curls',sets:3,repsRange:'10-12',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'ppl-d6', name:'Legs Day B', type:'legs', exercises:[
        {id:buildId(),name:'Front Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},
        {id:buildId(),name:'Sumo Deadlift',sets:4,repsRange:'6-8',muscle:'Hamstrings/Glutes',notes:''},
        {id:buildId(),name:'Bulgarian Split Squat',sets:3,repsRange:'10-12',muscle:'Quads',notes:'Brutal but effective'},
        {id:buildId(),name:'Leg Extensions',sets:3,repsRange:'15-20',muscle:'Quads',notes:''},
        {id:buildId(),name:'Nordic Curls',sets:3,repsRange:'8-10',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Standing Calf Raises',sets:5,repsRange:'20-25',muscle:'Calves',notes:''},
      ]},
      { id:'ppl-rest', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  {
    id: 'ul4', name: 'Upper Lower (4 Day)', emoji: '⚡',
    description: '4 days/week — U L Rest U L Rest Rest', color: '#60a5fa',
    schedule: ['Upper','Lower','Rest','Upper','Lower','Rest','Rest'],
    days: [
      { id:'ul4-d1', name:'Upper A', type:'upper', exercises:[
        {id:buildId(),name:'Bench Press',sets:4,repsRange:'5-6',muscle:'Chest',notes:'Heavy compound'},
        {id:buildId(),name:'Barbell Row',sets:4,repsRange:'5-6',muscle:'Back',notes:''},
        {id:buildId(),name:'Overhead Press',sets:3,repsRange:'8-10',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Pull-ups',sets:3,repsRange:'8-10',muscle:'Back',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ul4-d2', name:'Lower A', type:'lower', exercises:[
        {id:buildId(),name:'Squats',sets:4,repsRange:'5-6',muscle:'Quads',notes:''},
        {id:buildId(),name:'Romanian Deadlift',sets:4,repsRange:'8-10',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Leg Press',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'ul4-rest1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'ul4-d3', name:'Upper B', type:'upper', exercises:[
        {id:buildId(),name:'Incline Bench Press',sets:4,repsRange:'8-10',muscle:'Chest',notes:''},
        {id:buildId(),name:'Cable Row',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Arnold Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Lat Pulldown',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Face Pulls',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:buildId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Skull Crushers',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ul4-d4', name:'Lower B', type:'lower', exercises:[
        {id:buildId(),name:'Deadlift',sets:4,repsRange:'4-5',muscle:'Back/Hamstrings',notes:''},
        {id:buildId(),name:'Front Squats',sets:3,repsRange:'8-10',muscle:'Quads',notes:''},
        {id:buildId(),name:'Lunges',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Extensions',sets:3,repsRange:'15-20',muscle:'Quads',notes:''},
        {id:buildId(),name:'Seated Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'ul4-rest2', name:'Rest Day', type:'rest', exercises:[] },
      { id:'ul4-rest3', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  {
    id: 'fb', name: 'Full Body', emoji: '💥',
    description: 'Full Body – Rest – Repeat', color: '#fb923c',
    schedule: ['Full Body','Rest','Full Body','Rest','Full Body','Rest','Rest'],
    days: [
      { id:'fb-d1', name:'Full Body A', type:'full', exercises:[
        {id:buildId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},
        {id:buildId(),name:'Bench Press',sets:4,repsRange:'6-8',muscle:'Chest',notes:''},
        {id:buildId(),name:'Barbell Row',sets:4,repsRange:'6-8',muscle:'Back',notes:''},
        {id:buildId(),name:'Overhead Press',sets:3,repsRange:'8-10',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Romanian Deadlift',sets:3,repsRange:'10-12',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'fb-rest1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'fb-d2', name:'Full Body B', type:'full', exercises:[
        {id:buildId(),name:'Deadlift',sets:4,repsRange:'4-6',muscle:'Back',notes:''},
        {id:buildId(),name:'Incline Bench Press',sets:4,repsRange:'8-10',muscle:'Chest',notes:''},
        {id:buildId(),name:'Pull-ups',sets:4,repsRange:'8-10',muscle:'Back',notes:''},
        {id:buildId(),name:'Dumbbell Shoulder Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Leg Press',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Skull Crushers',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'fb-rest2', name:'Rest Day', type:'rest', exercises:[] },
      { id:'fb-d3', name:'Full Body C', type:'full', exercises:[
        {id:buildId(),name:'Front Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},
        {id:buildId(),name:'Cable Flyes',sets:3,repsRange:'12-15',muscle:'Chest',notes:''},
        {id:buildId(),name:'Lat Pulldown',sets:4,repsRange:'8-10',muscle:'Back',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Hip Thrusts',sets:3,repsRange:'12-15',muscle:'Glutes',notes:''},
        {id:buildId(),name:'Preacher Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Overhead Tricep Extension',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'fb-rest3', name:'Rest Day', type:'rest', exercises:[] },
      { id:'fb-rest4', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  {
    id: 'ula', name: 'Upper Lower + Arms', emoji: '💪',
    description: 'U L Rest U L Arms Rest', color: '#a78bfa',
    schedule: ['Upper','Lower','Rest','Upper','Lower','Arms','Rest'],
    days: [
      { id:'ula-d1', name:'Upper A', type:'upper', exercises:[
        {id:buildId(),name:'Bench Press',sets:4,repsRange:'6-8',muscle:'Chest',notes:''},
        {id:buildId(),name:'Barbell Row',sets:4,repsRange:'6-8',muscle:'Back',notes:''},
        {id:buildId(),name:'Overhead Press',sets:3,repsRange:'8-10',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Lat Pulldown',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
      ]},
      { id:'ula-d2', name:'Lower A', type:'lower', exercises:[
        {id:buildId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},
        {id:buildId(),name:'Romanian Deadlift',sets:4,repsRange:'8-10',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Leg Press',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'ula-rest1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'ula-d3', name:'Upper B', type:'upper', exercises:[
        {id:buildId(),name:'Incline Bench Press',sets:4,repsRange:'8-10',muscle:'Chest',notes:''},
        {id:buildId(),name:'Cable Row',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Arnold Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Pull-ups',sets:3,repsRange:'8-10',muscle:'Back',notes:''},
        {id:buildId(),name:'Face Pulls',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
      ]},
      { id:'ula-d4', name:'Lower B', type:'lower', exercises:[
        {id:buildId(),name:'Deadlift',sets:4,repsRange:'4-5',muscle:'Back/Hamstrings',notes:''},
        {id:buildId(),name:'Front Squats',sets:3,repsRange:'8-10',muscle:'Quads',notes:''},
        {id:buildId(),name:'Bulgarian Split Squat',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Extensions',sets:3,repsRange:'15-20',muscle:'Quads',notes:''},
        {id:buildId(),name:'Seated Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'ula-d5', name:'Arms Day', type:'arms', exercises:[
        {id:buildId(),name:'Barbell Curls',sets:4,repsRange:'10-12',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Hammer Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Preacher Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Skull Crushers',sets:4,repsRange:'10-12',muscle:'Triceps',notes:''},
        {id:buildId(),name:'Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:buildId(),name:'Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:buildId(),name:'Wrist Curls',sets:3,repsRange:'15-20',muscle:'Forearms',notes:''},
      ]},
      { id:'ula-rest2', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  {
    id: 'ul6', name: 'Upper Lower (6 Day)', emoji: '🏆',
    description: 'U L U L U L Rest — High frequency', color: '#f472b6',
    schedule: ['Upper','Lower','Upper','Lower','Upper','Lower','Rest'],
    days: [
      { id:'ul6-d1', name:'Upper A', type:'upper', exercises:[
        {id:buildId(),name:'Bench Press',sets:4,repsRange:'5-6',muscle:'Chest',notes:'Heavy focus'},
        {id:buildId(),name:'Barbell Row',sets:4,repsRange:'5-6',muscle:'Back',notes:''},
        {id:buildId(),name:'Overhead Press',sets:3,repsRange:'8-10',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Pull-ups',sets:3,repsRange:'8-10',muscle:'Back',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:3,repsRange:'12-15',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ul6-d2', name:'Lower A', type:'lower', exercises:[
        {id:buildId(),name:'Squats',sets:4,repsRange:'5-6',muscle:'Quads',notes:''},
        {id:buildId(),name:'Romanian Deadlift',sets:3,repsRange:'8-10',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Leg Press',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Calf Raises',sets:3,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'ul6-d3', name:'Upper B', type:'upper', exercises:[
        {id:buildId(),name:'Incline Bench Press',sets:4,repsRange:'8-10',muscle:'Chest',notes:''},
        {id:buildId(),name:'Cable Row',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Arnold Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Lat Pulldown',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Face Pulls',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:buildId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Skull Crushers',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ul6-d4', name:'Lower B', type:'lower', exercises:[
        {id:buildId(),name:'Deadlift',sets:4,repsRange:'4-5',muscle:'Back/Hamstrings',notes:''},
        {id:buildId(),name:'Front Squats',sets:3,repsRange:'8-10',muscle:'Quads',notes:''},
        {id:buildId(),name:'Lunges',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Leg Extensions',sets:3,repsRange:'15-20',muscle:'Quads',notes:''},
        {id:buildId(),name:'Seated Calf Raises',sets:3,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'ul6-d5', name:'Upper C', type:'upper', exercises:[
        {id:buildId(),name:'Cable Flyes',sets:3,repsRange:'12-15',muscle:'Chest',notes:''},
        {id:buildId(),name:'Weighted Pull-ups',sets:4,repsRange:'6-8',muscle:'Back',notes:''},
        {id:buildId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:buildId(),name:'Seated Cable Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:buildId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:buildId(),name:'Preacher Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:buildId(),name:'Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ul6-d6', name:'Lower C', type:'lower', exercises:[
        {id:buildId(),name:'Bulgarian Split Squat',sets:4,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:buildId(),name:'Hip Thrusts',sets:4,repsRange:'12-15',muscle:'Glutes',notes:''},
        {id:buildId(),name:'Nordic Curls',sets:3,repsRange:'8-10',muscle:'Hamstrings',notes:''},
        {id:buildId(),name:'Leg Press',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
        {id:buildId(),name:'Standing Calf Raises',sets:4,repsRange:'20-25',muscle:'Calves',notes:''},
      ]},
      { id:'ul6-rest', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// DIET DATA
// ─────────────────────────────────────────────────────────────────────────────
const DIET_DATA = [
  {
    id:'man', label:'Active Man', icon:'💪', calories:'2500–3000 kcal/day', protein:'150–180g',
    color:'#60a5fa', tag:'tag-blue',
    meals:[
      { time:'7:00 AM', label:'Breakfast', icon:'🌅', items:['Besan chilla (2 pieces) with mint chutney','1 glass full-fat milk with ashwagandha','Soaked almonds (10) + 2 walnuts'] },
      { time:'10:00 AM', label:'Mid-Morning', icon:'🍎', items:['1 banana + 1 apple','2 boiled eggs or 100g paneer cubes','1 tsp flaxseeds in water'] },
      { time:'1:00 PM', label:'Lunch', icon:'🍱', items:['2 whole wheat rotis','1 bowl moong/masoor dal','Mixed vegetable sabzi','Curd (100g) + salad (onion, cucumber, tomato)'] },
      { time:'4:00 PM', label:'Pre-Workout', icon:'⚡', items:['1 banana with 1 tbsp peanut butter','Sattu drink (2 tbsp sattu + lemon + salt)'] },
      { time:'7:30 PM', label:'Post-Workout Dinner', icon:'🍽️', items:['Brown rice (1 cup cooked) or 2 rotis','Chicken curry (150g) or paneer bhurji','Stir-fried vegetables','Buttermilk'] },
      { time:'10:00 PM', label:'Before Bed', icon:'🌙', items:['Haldi doodh (1 cup turmeric milk)','Mixed seeds: pumpkin + chia + sunflower'] },
    ],
    tips:['Target 1.8–2g protein per kg body weight','Hydrate with 3.5–4 liters water daily','Include rajma, chana, eggs for iron & protein','Eat within 45 min post-workout'],
  },
  {
    id:'woman', label:'Active Woman', icon:'🌸', calories:'1800–2200 kcal/day', protein:'110–140g',
    color:'#f9a8d4', tag:'tag-red',
    meals:[
      { time:'7:00 AM', label:'Breakfast', icon:'🌅', items:['Ragi dosa (2) with sambar + coconut chutney','1 glass milk or fortified plant milk','Handful of soaked almonds + dates (2-3)'] },
      { time:'10:30 AM', label:'Mid-Morning', icon:'🍎', items:['Papaya or pomegranate bowl','Boiled egg (1) or small handful of roasted chana'] },
      { time:'1:00 PM', label:'Lunch', icon:'🍱', items:['1-2 rotis with ghee','Rajma or chole (1 bowl)','Palak paneer or methi sabzi','Curd + salad'] },
      { time:'4:30 PM', label:'Snack', icon:'⚡', items:['Makhana roasted with ghee & black pepper','Green tea or jeera water'] },
      { time:'7:30 PM', label:'Dinner', icon:'🍽️', items:['Khichdi with ghee or 1 roti','Moong dal','Sauteed greens (spinach/broccoli)','Cucumber raita'] },
      { time:'9:30 PM', label:'Before Bed', icon:'🌙', items:['Haldi doodh or chamomile tea','1 tsp triphala in warm water (digestion)'] },
    ],
    tips:['Iron-rich foods daily: spinach, rajma, sesame','Calcium focus: dairy, ragi, til (sesame)','Vitamin D: spend 15-20 min in morning sunlight','Include fenugreek (methi) for hormonal balance'],
  },
  {
    id:'oldman', label:'Senior Man (60+)', icon:'🧓', calories:'2000–2300 kcal/day', protein:'100–120g',
    color:'#86efac', tag:'tag-green',
    meals:[
      { time:'7:00 AM', label:'Breakfast', icon:'🌅', items:['Oats porridge with banana & nuts','1 glass warm water with lemon','2 soaked almonds + 1 walnut'] },
      { time:'10:00 AM', label:'Mid-Morning', icon:'🍎', items:['Seasonal fruit (apple/pear/papaya)','1 cup buttermilk (takra)'] },
      { time:'12:30 PM', label:'Lunch', icon:'🍱', items:['2 rotis (soft) with ghee','Yellow moong dal (easy to digest)','Bottle gourd (lauki) or ridge gourd sabzi','Curd + jeera tadka'] },
      { time:'4:00 PM', label:'Evening Snack', icon:'☕', items:['Roasted makhana or puffed rice','Ginger-tulsi tea'] },
      { time:'7:00 PM', label:'Dinner', icon:'🍽️', items:['Khichdi with ghee (easy to digest)','Steamed vegetables','Warm turmeric milk before bed'] },
    ],
    tips:['Prioritize soft, easily digestible foods','Stay hydrated — thirst signal weakens with age','Include calcium & Vitamin D for bone health','Walk 30 min daily for joint mobility','Avoid heavy meals at dinner'],
  },
  {
    id:'oldwoman', label:'Senior Woman (60+)', icon:'👵', calories:'1700–2000 kcal/day', protein:'90–110g',
    color:'#fcd34d', tag:'tag-orange',
    meals:[
      { time:'7:00 AM', label:'Breakfast', icon:'🌅', items:['Ragi porridge or soft idli (2) with sambar','1 cup warm milk with turmeric','Soaked almonds (5-6)'] },
      { time:'10:00 AM', label:'Mid-Morning', icon:'🍎', items:['Papaya or banana','Handful of roasted chana or til ladoo (1 small)'] },
      { time:'12:30 PM', label:'Lunch', icon:'🍱', items:['1-2 soft rotis with ghee','Palak dal (iron + protein)','Pumpkin or lauki sabzi','Curd'] },
      { time:'4:00 PM', label:'Snack', icon:'☕', items:['Sesame (til) chikki (small piece)','Herbal tea: tulsi + ginger'] },
      { time:'7:00 PM', label:'Dinner', icon:'🍽️', items:['Daliya (broken wheat) khichdi','Steamed broccoli or peas','1 cup warm turmeric milk'] },
    ],
    tips:['Calcium priority: til, ragi, dairy for bones','Soy products help with hormonal balance','Include figs & dates for iron','Warm cooked foods are easier to digest','Reduce salt to manage blood pressure'],
  },
  {
    id:'office', label:'Office Goer', icon:'💼', calories:'1800–2200 kcal/day', protein:'100–130g',
    color:'#a78bfa', tag:'tag-purple',
    meals:[
      { time:'7:30 AM', label:'Breakfast', icon:'🌅', items:['Poha with peanuts & vegetables','OR Moong dal cheela with green chutney','1 glass water + multivitamin if needed'] },
      { time:'11:00 AM', label:'Desk Snack', icon:'💻', items:['Handful of mixed nuts (almonds, cashews)','Green tea or coconut water','1 fruit (banana/apple/pear)'] },
      { time:'1:30 PM', label:'Lunch (Pack from Home)', icon:'🍱', items:['2 rotis + dal + sabzi','OR Rajma rice / chole rice','Salad: carrot sticks, cucumber','Curd or chaas'] },
      { time:'4:30 PM', label:'Afternoon Snack', icon:'☕', items:['Roasted makhana or chana','Masala buttermilk or lemon water','Avoid chai biscuits!'] },
      { time:'8:00 PM', label:'Dinner', icon:'🍽️', items:['Light: dal khichdi or vegetable soup + roti','Salad with olive oil dressing','Avoid heavy carbs after 8 PM'] },
    ],
    tips:['Pack lunch to avoid oily office food','Take 5-min walks every hour at work','Stay away from biscuits & vending machine snacks','Drink water before every meal','Screen fatigue: include blueberries, carrots'],
  },
  {
    id:'regular', label:'Regular Gym Goer', icon:'🏋️', calories:'2200–2700 kcal/day', protein:'130–160g',
    color:'#00ff88', tag:'tag-green',
    meals:[
      { time:'6:30 AM', label:'Pre-Workout', icon:'⚡', items:['1 banana + black coffee (no sugar)','OR Oats with honey & banana'] },
      { time:'9:00 AM', label:'Post-Workout Breakfast', icon:'🌅', items:['4 egg whites + 1 whole egg scramble with veggies','OR Paneer bhurji (150g) with 2 rotis','1 glass milk or protein shake'] },
      { time:'12:30 PM', label:'Lunch', icon:'🍱', items:['Brown rice (1 cup) or 2 rotis','Chicken (150g) or paneer (100g) curry','Dal + sabzi','Salad + curd'] },
      { time:'4:00 PM', label:'Snack', icon:'💪', items:['Greek yogurt with berries & honey','Handful of almonds','Coconut water or lemon water'] },
      { time:'7:30 PM', label:'Dinner', icon:'🍽️', items:['2 rotis or 1 cup rice','Fish curry or soya chunks curry','Mixed vegetable stir fry','Raita'] },
      { time:'10:00 PM', label:'Before Bed', icon:'🌙', items:['1 cup cottage cheese (paneer) or dahi','Haldi doodh for recovery'] },
    ],
    tips:['Time protein intake around workouts','Progressive overload needs caloric surplus','Creatine monohydrate (5g/day) is evidence-backed','Sleep 7-9 hrs — most recovery happens then','Track macros, not just calories'],
  },
  {
    id:'athlete', label:'Active Athlete', icon:'🏆', calories:'3000–4000+ kcal/day', protein:'180–220g',
    color:'#fb923c', tag:'tag-orange',
    meals:[
      { time:'6:00 AM', label:'Early Morning', icon:'🌅', items:['Soaked overnight oats (100g) + banana + peanut butter','Ashwagandha + creatine in water','Handful of soaked nuts & seeds'] },
      { time:'8:00 AM', label:'Post Morning Session', icon:'⚡', items:['Protein-rich: 5 boiled eggs or 200g paneer','4 rotis with ghee or brown rice (2 cups)','Coconut water for electrolytes'] },
      { time:'11:30 AM', label:'Mid-Morning Fuel', icon:'🍱', items:['Chicken/tuna sandwich on whole wheat','OR Rajma + brown rice bowl','Buttermilk (1 large glass)'] },
      { time:'2:00 PM', label:'Lunch', icon:'🍽️', items:['Rice (2 cups) + chicken curry (200g)','Dal + sabzi','Curd + salad (4+ veggies)','1 sweet potato'] },
      { time:'5:00 PM', label:'Pre Evening Session', icon:'💪', items:['Banana + dates (5-6)','Sattu drink (3 tbsp sattu)','1 cup strong black coffee'] },
      { time:'8:30 PM', label:'Post Training Dinner', icon:'🌙', items:['2 cups rice or 4 rotis','200g meat/fish or 200g paneer','Stir-fried greens','Dahi + flaxseeds'] },
    ],
    tips:['Caloric surplus required for performance gains','Hydration: 500ml before training, sip during','Electrolytes: coconut water, nimbu pani with salt','Periodize nutrition: bulk & cut phases','Consider working with a sports nutritionist'],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const calcBMI = (weight, height) => {
  if (!weight || !height) return null;
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
};

const getBMICategory = (bmi) => {
  if (!bmi) return { label: 'N/A', color: '#8899aa', tag: '' };
  const b = parseFloat(bmi);
  if (b < 18.5) return { label: 'Underweight', color: '#fb923c', tag: 'tag-orange' };
  if (b < 25) return { label: 'Normal', color: '#00ff88', tag: 'tag-green' };
  if (b < 30) return { label: 'Overweight', color: '#fbbf24', tag: 'tag-orange' };
  return { label: 'Obese', color: '#f87171', tag: 'tag-red' };
};

const getDayType = (type) => {
  const map = { push:'tag-red', pull:'tag-blue', legs:'tag-orange', upper:'tag-blue', lower:'tag-orange', full:'tag-green', arms:'tag-purple', rest:'', custom:'tag-green' };
  return map[type] || 'tag-green';
};

const genId = () => Math.random().toString(36).slice(2, 9);
const todayStr = () => new Date().toISOString().split('T')[0];
const fmtDate = (d) => new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short' });
const weekLabel = (d) => `W${Math.ceil(new Date(d).getDate()/7)} ${new Date(d).toLocaleDateString('en-IN',{month:'short'})}`;

// Generate realistic sample data for Vishal (8 weeks back)
const generateSampleData = () => {
  const logs = [];
  const workoutLogs = [];
  const today = new Date();
  // Weight logs: started at 88kg, progressing down to ~83kg
  const baseWeight = 88;
  for (let i = 55; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const noise = (Math.random() - 0.5) * 0.8;
    const trend = (55 - i) * 0.09;
    const weight = +(baseWeight - trend + noise).toFixed(1);
    if (i % 2 === 0 || i < 7) {
      logs.push({ id: genId(), date: d.toISOString().split('T')[0], weight, notes: '' });
    }
  }
  // Workout logs for bench press progression
  const benchWeights = [60, 62.5, 62.5, 65, 67.5, 70, 70, 72.5, 75, 77.5, 80];
  for (let w = 0; w < 10; w++) {
    const d = new Date(today);
    d.setDate(d.getDate() - (70 - w * 7));
    workoutLogs.push({
      id: genId(), userId: 'vishal', splitId: 'ppl', dayId: 'ppl-d1', dayName: 'Push Day A',
      date: d.toISOString().split('T')[0],
      exercises: [{
        exerciseId: genId(), name: 'Bench Press',
        sets: [
          { reps: 8, weight: benchWeights[w] },
          { reps: 8, weight: benchWeights[w] },
          { reps: 7, weight: benchWeights[w] },
          { reps: 6, weight: benchWeights[w] },
        ]
      }, {
        exerciseId: genId(), name: 'Overhead Press',
        sets: [
          { reps: 8, weight: 45 + w * 2.5 },
          { reps: 8, weight: 45 + w * 2.5 },
          { reps: 7, weight: 45 + w * 2.5 },
        ]
      }]
    });
  }
  return { healthLogs: logs, workoutLogs };
};

// ─────────────────────────────────────────────────────────────────────────────
// SAMPLE USERS
// ─────────────────────────────────────────────────────────────────────────────
const INITIAL_USERS = [
  { id: 'vishal', name: 'Vishal Chaudhary', email: 'vishal@fittrack.com', password: 'admin123',
    age: 32, gender: 'male', weight: 83.5, height: 175, isAdmin: true,
    activeSplitId: 'ppl', joinDate: '2024-01-15', bio: 'Fitness creator & coach 💪', avatar: 'VC' }
];

// ─────────────────────────────────────────────────────────────────────────────
// MINI COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, unit, sub, icon, color = '#00ff88', trend }) => (
  <div className="metric-card card-glow fade-in" style={{ position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, right: 0, width: 80, height: 80, borderRadius: '0 14px 0 80px', background: `${color}10` }} />
    <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
    <div style={{ fontSize: 13, color: '#8899aa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 4 }}>{label}</div>
    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color, lineHeight: 1 }}>
      {value}<span style={{ fontSize: 16, fontWeight: 500, color: '#8899aa', marginLeft: 4 }}>{unit}</span>
    </div>
    {sub && <div style={{ fontSize: 12, color: '#8899aa', marginTop: 6 }}>{sub}</div>}
    {trend && <div style={{ fontSize: 12, marginTop: 6, color: trend > 0 ? '#f87171' : '#00ff88' }}>
      {trend > 0 ? '▲' : '▼'} {Math.abs(trend)} {unit} this week
    </div>}
  </div>
);

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
    <div>
      <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', color: '#e8eaf0', lineHeight: 1 }}>{title}</h1>
      {subtitle && <p style={{ color: '#8899aa', fontSize: 14, marginTop: 6 }}>{subtitle}</p>}
    </div>
    {action && action}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD PAGE
// ─────────────────────────────────────────────────────────────────────────────
const DashboardPage = ({ user, healthLogs, workoutLogs, splits, setHealthLogs }) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [newLog, setNewLog] = useState({ weight: user.weight, notes: '' });

  const bmi = calcBMI(user.weight, user.height);
  const bmiCat = getBMICategory(bmi);
  const activeSplit = splits.find(s => s.id === user.activeSplitId);

  const weeklyData = useMemo(() => {
    const sorted = [...healthLogs].filter(l => l.userId === user.id || !l.userId).sort((a, b) => new Date(a.date) - new Date(b.date));
    const byWeek = {};
    sorted.forEach(l => {
      const wk = weekLabel(l.date);
      if (!byWeek[wk]) byWeek[wk] = { week: wk, weights: [] };
      byWeek[wk].weights.push(l.weight);
    });
    return Object.values(byWeek).map(w => ({ week: w.week, weight: +(w.weights.reduce((a,b)=>a+b,0)/w.weights.length).toFixed(1) }));
  }, [healthLogs, user.id]);

  const userWorkouts = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');
  const recentWorkouts = [...userWorkouts].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
  const last7days = workoutLogs.filter(l => {
    const d = new Date(l.date);
    const now = new Date();
    return (now - d) / 86400000 <= 7 && (l.userId === user.id || l.userId === 'vishal');
  }).length;

  const weightTrend = weeklyData.length >= 2 ? +(weeklyData[weeklyData.length-1].weight - weeklyData[weeklyData.length-2].weight).toFixed(1) : 0;

  const handleLogWeight = () => {
    const log = { id: genId(), userId: user.id, date: todayStr(), weight: parseFloat(newLog.weight), notes: newLog.notes };
    setHealthLogs(prev => [...prev, log]);
    setShowLogModal(false);
  };

  return (
    <div className="fade-in">
      <PageHeader
        title={`Hey, ${user.name.split(' ')[0]} 👋`}
        subtitle={`${new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long', year:'numeric' })}`}
        action={<button className="btn-primary" onClick={() => setShowLogModal(true)}>+ Log Weight</button>}
      />

      {/* Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 28 }}>
        <MetricCard label="Current Weight" value={user.weight} unit="kg" icon="⚖️" color="#00ff88" trend={weightTrend} />
        <MetricCard label="BMI" value={bmi} unit="" icon="📊" color={bmiCat.color} sub={bmiCat.label} />
        <MetricCard label="Height" value={user.height} unit="cm" icon="📏" color="#60a5fa" />
        <MetricCard label="Sessions This Week" value={last7days} unit="" icon="🔥" color="#fb923c" sub="workouts logged" />
        <MetricCard label="Total Sessions" value={userWorkouts.length} unit="" icon="🏆" color="#a78bfa" sub="all time" />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
        <div className="metric-card card-glow" style={{ padding: 24 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Weight Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="wGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
              <XAxis dataKey="week" tick={{ fill: '#8899aa', fontSize: 11 }} />
              <YAxis domain={['auto', 'auto']} tick={{ fill: '#8899aa', fontSize: 11 }} />
              <Tooltip contentStyle={{ background: '#0d1520', border: '1px solid #1e3a5f', borderRadius: 8 }} />
              <Area type="monotone" dataKey="weight" stroke="#00ff88" strokeWidth={2} fill="url(#wGrad)" dot={{ fill: '#00ff88', r: 3 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="metric-card card-glow" style={{ padding: 24 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>BMI Gauge</div>
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 72, fontWeight: 900, color: bmiCat.color, lineHeight: 1 }}>{bmi}</div>
            <span className={`tag ${bmiCat.tag}`} style={{ marginTop: 8, display: 'inline-block', fontSize: 14 }}>{bmiCat.label}</span>
            <div style={{ marginTop: 20, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 4 }}>
              {[{r:'<18.5',l:'Under',c:'#fb923c'},{r:'18.5–25',l:'Normal',c:'#00ff88'},{r:'25–30',l:'Over',c:'#fbbf24'},{r:'>30',l:'Obese',c:'#f87171'}].map(s=>(
                <div key={s.l} style={{ background: parseFloat(bmi) >= parseFloat(s.r) || s.l === 'Normal' ? `${s.c}15` : '#0f1520', border: `1px solid ${s.c}40`, borderRadius: 6, padding: 6, opacity: bmiCat.label.startsWith(s.l.slice(0,3)) ? 1 : 0.4 }}>
                  <div style={{ fontSize: 10, color: s.c, fontWeight: 600 }}>{s.l}</div>
                  <div style={{ fontSize: 9, color: '#8899aa' }}>{s.r}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Split + Recent Workouts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 20 }}>
        <div className="metric-card card-glow" style={{ padding: 24 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Active Split</div>
          {activeSplit ? (
            <>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{activeSplit.emoji}</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 22, fontWeight: 700, color: activeSplit.color }}>{activeSplit.name}</div>
              <div style={{ fontSize: 13, color: '#8899aa', marginTop: 4, marginBottom: 16 }}>{activeSplit.description}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {activeSplit.schedule.map((d,i) => (
                  <div key={i} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: d === 'Rest' ? '#0f1520' : `${activeSplit.color}15`,
                    color: d === 'Rest' ? '#8899aa' : activeSplit.color,
                    border: `1px solid ${d === 'Rest' ? '#1e3a5f' : activeSplit.color + '40'}` }}>
                    Day {i+1}: {d}
                  </div>
                ))}
              </div>
            </>
          ) : <div style={{ color: '#8899aa' }}>No split selected</div>}
        </div>

        <div className="metric-card card-glow" style={{ padding: 24 }}>
          <div className="section-title" style={{ fontSize: 16, marginBottom: 16 }}>Recent Sessions</div>
          {recentWorkouts.length === 0 ? (
            <div style={{ color: '#8899aa', fontSize: 14 }}>No sessions logged yet</div>
          ) : recentWorkouts.map(w => (
            <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid #1e3a5f' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{w.dayName}</div>
                <div style={{ fontSize: 12, color: '#8899aa', marginTop: 2 }}>{fmtDate(w.date)} · {w.exercises?.length || 0} exercises</div>
              </div>
              <div style={{ fontSize: 11, color: '#00ff88', background: 'rgba(0,255,136,0.1)', padding: '4px 10px', borderRadius: 20, border: '1px solid rgba(0,255,136,0.2)' }}>Done ✓</div>
            </div>
          ))}
        </div>
      </div>

      {showLogModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div className="section-title" style={{ fontSize: 20 }}>Log Today's Weight</div>
              <button className="btn-ghost" onClick={() => setShowLogModal(false)} style={{ padding: '6px 10px' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div><label>Weight (kg)</label><input type="number" step="0.1" value={newLog.weight} onChange={e => setNewLog({...newLog, weight: e.target.value})} /></div>
              <div><label>Notes (optional)</label><input placeholder="e.g. post morning, post workout..." value={newLog.notes} onChange={e => setNewLog({...newLog, notes: e.target.value})} /></div>
              <button className="btn-primary" onClick={handleLogWeight}>Save Log</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// WORKOUT TRACKER PAGE
// ─────────────────────────────────────────────────────────────────────────────
const WorkoutPage = ({ user, splits, workoutLogs, setWorkoutLogs }) => {
  const activeSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [selectedDay, setSelectedDay] = useState(null);
  const [session, setSession] = useState(null); // current logging session
  const [done, setDone] = useState(false);

  const workoutDays = activeSplit?.days.filter(d => d.type !== 'rest') || [];

  const startSession = (day) => {
    setSelectedDay(day);
    const exercises = day.exercises.map(ex => ({
      ...ex,
      sets: Array.from({ length: ex.sets }, (_, i) => {
        const prev = workoutLogs.filter(l => (l.userId === user.id || l.userId === 'vishal') && l.dayId === day.id)
          .sort((a,b) => new Date(b.date) - new Date(a.date))[0];
        const prevEx = prev?.exercises?.find(e => e.name === ex.name);
        const prevSet = prevEx?.sets?.[i];
        return { reps: prevSet?.reps || ex.repsRange?.split('-')[0] || 8, weight: prevSet?.weight || 0, done: false };
      })
    }));
    setSession({ day, exercises, notes: '' });
    setDone(false);
  };

  const updateSet = (exIdx, setIdx, field, val) => {
    setSession(prev => {
      const exs = [...prev.exercises];
      const sets = [...exs[exIdx].sets];
      sets[setIdx] = { ...sets[setIdx], [field]: field === 'done' ? val : parseFloat(val) || val };
      exs[exIdx] = { ...exs[exIdx], sets };
      return { ...prev, exercises: exs };
    });
  };

  const addSet = (exIdx) => {
    setSession(prev => {
      const exs = [...prev.exercises];
      const lastSet = exs[exIdx].sets[exs[exIdx].sets.length - 1];
      exs[exIdx] = { ...exs[exIdx], sets: [...exs[exIdx].sets, { ...lastSet, done: false }] };
      return { ...prev, exercises: exs };
    });
  };

  const removeSet = (exIdx, setIdx) => {
    setSession(prev => {
      const exs = [...prev.exercises];
      exs[exIdx] = { ...exs[exIdx], sets: exs[exIdx].sets.filter((_, i) => i !== setIdx) };
      return { ...prev, exercises: exs };
    });
  };

  const finishWorkout = () => {
    const log = {
      id: genId(), userId: user.id, splitId: activeSplit.id,
      dayId: session.day.id, dayName: session.day.name,
      date: todayStr(), notes: session.notes,
      exercises: session.exercises.map(ex => ({
        exerciseId: ex.id, name: ex.name,
        sets: ex.sets.filter(s => s.done).map(s => ({ reps: s.reps, weight: s.weight }))
      })).filter(ex => ex.sets.length > 0)
    };
    setWorkoutLogs(prev => [...prev, log]);
    setDone(true);
  };

  if (done) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 40, fontWeight: 800, color: '#00ff88', marginBottom: 8 }}>WORKOUT COMPLETE!</div>
      <div style={{ color: '#8899aa', fontSize: 16, marginBottom: 32 }}>Session saved. Recovery starts now 💪</div>
      <button className="btn-primary" onClick={() => { setSession(null); setSelectedDay(null); setDone(false); }}>Log Another Session</button>
    </div>
  );

  if (session) return (
    <div className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button className="btn-ghost" onClick={() => setSession(null)}>← Back</button>
        <div>
          <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, textTransform: 'uppercase' }}>{session.day.name}</h1>
          <div style={{ fontSize: 13, color: '#8899aa' }}>{new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</div>
        </div>
      </div>

      {session.exercises.map((ex, exIdx) => (
        <div key={ex.id} className="metric-card card-glow" style={{ marginBottom: 16, padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700 }}>{ex.name}</div>
              <span className={`tag ${getDayType(ex.muscle?.toLowerCase())}`}>{ex.muscle}</span>
              {ex.repsRange && <span style={{ fontSize: 12, color: '#8899aa', marginLeft: 8 }}>Target: {ex.repsRange} reps</span>}
            </div>
            <button className="btn-ghost" style={{ fontSize: 12, padding: '4px 10px' }} onClick={() => addSet(exIdx)}>+ Set</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 11, color: '#8899aa', fontWeight: 600, padding: '6px 0' }}>Set</div>
            <div style={{ fontSize: 11, color: '#8899aa', fontWeight: 600, padding: '6px 0' }}>Reps</div>
            <div style={{ fontSize: 11, color: '#8899aa', fontWeight: 600, padding: '6px 0' }}>Weight (kg)</div>
            <div style={{ fontSize: 11, color: '#8899aa', fontWeight: 600, padding: '6px 0' }}>Done</div>
          </div>
          {ex.sets.map((s, sIdx) => (
            <div key={sIdx} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 1fr 80px', gap: 8, marginBottom: 6, alignItems: 'center', opacity: s.done ? 0.6 : 1 }}>
              <div style={{ fontSize: 13, color: '#8899aa', fontWeight: 600 }}>{sIdx + 1}</div>
              <input type="number" value={s.reps} onChange={e => updateSet(exIdx, sIdx, 'reps', e.target.value)} style={{ padding: '8px 10px', fontSize: 14 }} />
              <input type="number" step="2.5" value={s.weight} onChange={e => updateSet(exIdx, sIdx, 'weight', e.target.value)} style={{ padding: '8px 10px', fontSize: 14 }} />
              <div style={{ display: 'flex', gap: 4 }}>
                <button onClick={() => updateSet(exIdx, sIdx, 'done', !s.done)} style={{ flex: 1, background: s.done ? 'rgba(0,255,136,0.2)' : '#0f1823', border: `1px solid ${s.done ? '#00ff88' : '#1e3a5f'}`, borderRadius: 8, color: s.done ? '#00ff88' : '#8899aa', cursor: 'pointer', padding: '8px 0', fontSize: 16 }}>
                  {s.done ? '✓' : '○'}
                </button>
                {ex.sets.length > 1 && <button onClick={() => removeSet(exIdx, sIdx)} style={{ background: 'transparent', border: '1px solid #1e3a5f', borderRadius: 8, color: '#f87171', cursor: 'pointer', padding: '8px 6px', fontSize: 12 }}>✕</button>}
              </div>
            </div>
          ))}
        </div>
      ))}

      <div className="metric-card" style={{ marginBottom: 16 }}>
        <label>Workout Notes</label>
        <textarea rows={2} placeholder="How did it go? Personal records, form notes..." value={session.notes} onChange={e => setSession(p => ({...p, notes: e.target.value}))} />
      </div>

      <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: 18 }} onClick={finishWorkout}>
        🏁 Finish Workout
      </button>
    </div>
  );

  return (
    <div className="fade-in">
      <PageHeader title="Workout Tracker" subtitle={`Active: ${activeSplit?.name || 'No split selected'}`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {workoutDays.map(day => {
          const lastLog = workoutLogs.filter(l => (l.userId === user.id || l.userId === 'vishal') && l.dayId === day.id)
            .sort((a,b) => new Date(b.date) - new Date(a.date))[0];
          return (
            <div key={day.id} className="metric-card card-glow" style={{ cursor: 'pointer', transition: 'transform 0.2s', padding: 20 }}
              onClick={() => startSession(day)}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className={`tag ${getDayType(day.type)}`}>{day.type.toUpperCase()}</span>
                {lastLog && <span style={{ fontSize: 11, color: '#8899aa' }}>Last: {fmtDate(lastLog.date)}</span>}
              </div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 12 }}>{day.name}</div>
              {day.exercises.slice(0, 4).map(ex => (
                <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#8899aa', padding: '4px 0', borderBottom: '1px solid #1e3a5f10' }}>
                  <span>{ex.name}</span>
                  <span style={{ color: '#60a5fa' }}>{ex.sets}×{ex.repsRange}</span>
                </div>
              ))}
              {day.exercises.length > 4 && <div style={{ fontSize: 12, color: '#8899aa', marginTop: 8 }}>+{day.exercises.length - 4} more exercises</div>}
              <button className="btn-primary" style={{ width: '100%', marginTop: 16, padding: '10px' }}>Start Session →</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SPLITS MANAGER PAGE
// ─────────────────────────────────────────────────────────────────────────────
const SplitsPage = ({ user, splits, setSplits, onSelectSplit }) => {
  const [expandedSplit, setExpandedSplit] = useState(null);
  const [expandedDay, setExpandedDay] = useState(null);
  const [editExercise, setEditExercise] = useState(null);
  const [showAddSplit, setShowAddSplit] = useState(false);
  const [showAddExercise, setShowAddExercise] = useState(null);
  const [newEx, setNewEx] = useState({ name:'', sets:3, repsRange:'8-12', muscle:'', notes:'' });
  const [newSplit, setNewSplit] = useState({ name:'', emoji:'💪', description:'', color:'#00ff88' });

  const isAdmin = user.isAdmin;

  const updateExercise = (splitId, dayId, exId, data) => {
    setSplits(prev => prev.map(s => s.id !== splitId ? s : {
      ...s, days: s.days.map(d => d.id !== dayId ? d : {
        ...d, exercises: d.exercises.map(e => e.id !== exId ? e : { ...e, ...data })
      })
    }));
  };

  const deleteExercise = (splitId, dayId, exId) => {
    setSplits(prev => prev.map(s => s.id !== splitId ? s : {
      ...s, days: s.days.map(d => d.id !== dayId ? d : {
        ...d, exercises: d.exercises.filter(e => e.id !== exId)
      })
    }));
  };

  const addExercise = (splitId, dayId) => {
    const ex = { id: genId(), ...newEx, sets: parseInt(newEx.sets) };
    setSplits(prev => prev.map(s => s.id !== splitId ? s : {
      ...s, days: s.days.map(d => d.id !== dayId ? d : { ...d, exercises: [...d.exercises, ex] })
    }));
    setNewEx({ name:'', sets:3, repsRange:'8-12', muscle:'', notes:'' });
    setShowAddExercise(null);
  };

  const addCustomSplit = () => {
    const split = { id: genId(), ...newSplit, schedule: ['Day 1', 'Day 2', 'Rest'], days: [{ id: genId(), name: 'Day 1', type: 'custom', exercises: [] }, { id: genId(), name: 'Rest', type: 'rest', exercises: [] }] };
    setSplits(prev => [...prev, split]);
    setNewSplit({ name:'', emoji:'💪', description:'', color:'#00ff88' });
    setShowAddSplit(false);
  };

  return (
    <div className="fade-in">
      <PageHeader
        title="Workout Splits"
        subtitle="Manage your training programs"
        action={isAdmin && <button className="btn-primary" onClick={() => setShowAddSplit(true)}>+ Custom Split</button>}
      />

      {splits.map(split => (
        <div key={split.id} className="metric-card card-glow" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', padding: 20 }}
            onClick={() => setExpandedSplit(expandedSplit === split.id ? null : split.id)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div style={{ fontSize: 28 }}>{split.emoji}</div>
              <div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, color: split.color }}>{split.name}</div>
                <div style={{ fontSize: 13, color: '#8899aa', marginTop: 2 }}>{split.description}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              {user.activeSplitId === split.id ? (
                <span className="tag tag-green">Active</span>
              ) : (
                <button className="btn-ghost" onClick={e => { e.stopPropagation(); onSelectSplit(split.id); }}>Set Active</button>
              )}
              <ChevronDown size={16} color="#8899aa" style={{ transform: expandedSplit === split.id ? 'rotate(180deg)' : '', transition: '0.2s' }} />
            </div>
          </div>

          {expandedSplit === split.id && (
            <div style={{ padding: '0 20px 20px', borderTop: '1px solid #1e3a5f' }}>
              {/* Schedule bar */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', margin: '16px 0' }}>
                {split.schedule.map((d,i) => (
                  <div key={i} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: d === 'Rest' ? '#0f1520' : `${split.color}15`,
                    color: d === 'Rest' ? '#8899aa' : split.color,
                    border: `1px solid ${d === 'Rest' ? '#1e3a5f' : split.color + '40'}` }}>
                    D{i+1}: {d}
                  </div>
                ))}
              </div>

              {split.days.filter(d => d.type !== 'rest').map(day => (
                <div key={day.id} style={{ background: '#0a1020', borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', cursor: 'pointer' }}
                    onClick={() => setExpandedDay(expandedDay === day.id ? null : day.id)}>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <span className={`tag ${getDayType(day.type)}`}>{day.type}</span>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{day.name}</span>
                      <span style={{ fontSize: 12, color: '#8899aa' }}>{day.exercises.length} exercises</span>
                    </div>
                    <ChevronDown size={14} color="#8899aa" style={{ transform: expandedDay === day.id ? 'rotate(180deg)' : '', transition: '0.2s' }} />
                  </div>

                  {expandedDay === day.id && (
                    <div style={{ padding: '0 16px 16px' }}>
                      {day.exercises.map(ex => (
                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #1e3a5f30' }}>
                          {editExercise === ex.id ? (
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 8, flex: 1 }}>
                              <input value={ex.name} onChange={e => updateExercise(split.id, day.id, ex.id, { name: e.target.value })} />
                              <input type="number" value={ex.sets} onChange={e => updateExercise(split.id, day.id, ex.id, { sets: parseInt(e.target.value) })} />
                              <input value={ex.repsRange} onChange={e => updateExercise(split.id, day.id, ex.id, { repsRange: e.target.value })} />
                              <input value={ex.muscle} onChange={e => updateExercise(split.id, day.id, ex.id, { muscle: e.target.value })} />
                            </div>
                          ) : (
                            <div style={{ flex: 1 }}>
                              <span style={{ fontWeight: 500, fontSize: 14 }}>{ex.name}</span>
                              <span style={{ fontSize: 12, color: '#8899aa', marginLeft: 8 }}>{ex.sets} sets × {ex.repsRange}</span>
                              {ex.muscle && <span style={{ fontSize: 11, color: '#60a5fa', marginLeft: 8 }}>{ex.muscle}</span>}
                            </div>
                          )}
                          {isAdmin && (
                            <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                              <button className="btn-ghost" style={{ padding: '4px 8px', fontSize: 11 }} onClick={() => setEditExercise(editExercise === ex.id ? null : ex.id)}>
                                {editExercise === ex.id ? 'Done' : <Edit2 size={12} />}
                              </button>
                              <button className="btn-danger" style={{ padding: '4px 8px' }} onClick={() => deleteExercise(split.id, day.id, ex.id)}>
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                      {isAdmin && (
                        showAddExercise === day.id ? (
                          <div style={{ marginTop: 12, display: 'grid', gap: 8 }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 8 }}>
                              <input placeholder="Exercise name" value={newEx.name} onChange={e => setNewEx({...newEx, name: e.target.value})} />
                              <input type="number" placeholder="Sets" value={newEx.sets} onChange={e => setNewEx({...newEx, sets: e.target.value})} />
                              <input placeholder="Reps (e.g. 8-12)" value={newEx.repsRange} onChange={e => setNewEx({...newEx, repsRange: e.target.value})} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                              <input placeholder="Muscle group" value={newEx.muscle} onChange={e => setNewEx({...newEx, muscle: e.target.value})} />
                              <input placeholder="Notes (optional)" value={newEx.notes} onChange={e => setNewEx({...newEx, notes: e.target.value})} />
                            </div>
                            <div style={{ display: 'flex', gap: 8 }}>
                              <button className="btn-primary" onClick={() => addExercise(split.id, day.id)}>Add Exercise</button>
                              <button className="btn-ghost" onClick={() => setShowAddExercise(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <button className="btn-ghost" style={{ marginTop: 10, width: '100%', fontSize: 13 }} onClick={() => setShowAddExercise(day.id)}>
                            + Add Exercise
                          </button>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {showAddSplit && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <div className="section-title" style={{ fontSize: 20 }}>Add Custom Split</div>
              <button className="btn-ghost" onClick={() => setShowAddSplit(false)} style={{ padding: '6px 10px' }}><X size={16} /></button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div><label>Split Name</label><input placeholder="e.g. Bro Split" value={newSplit.name} onChange={e => setNewSplit({...newSplit, name: e.target.value})} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><label>Emoji</label><input placeholder="💪" value={newSplit.emoji} onChange={e => setNewSplit({...newSplit, emoji: e.target.value})} /></div>
                <div><label>Color</label><input type="color" value={newSplit.color} onChange={e => setNewSplit({...newSplit, color: e.target.value})} /></div>
              </div>
              <div><label>Description</label><input placeholder="e.g. 5 days/week chest, back, shoulders..." value={newSplit.description} onChange={e => setNewSplit({...newSplit, description: e.target.value})} /></div>
              <button className="btn-primary" onClick={addCustomSplit}>Create Split</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DIET PAGE
// ─────────────────────────────────────────────────────────────────────────────
const DietPage = () => {
  const [selected, setSelected] = useState('man');
  const data = DIET_DATA.find(d => d.id === selected);

  return (
    <div className="fade-in">
      <PageHeader title="Indian Diet Guide" subtitle="Research-backed meal plans for every lifestyle" />

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {DIET_DATA.map(d => (
          <button key={d.id} onClick={() => setSelected(d.id)} style={{
            padding: '10px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
            background: selected === d.id ? d.color : 'transparent',
            color: selected === d.id ? '#080b10' : '#8899aa',
            border: `1px solid ${selected === d.id ? d.color : '#1e3a5f'}`,
          }}>
            {d.icon} {d.label}
          </button>
        ))}
      </div>

      {data && (
        <div className="fade-in">
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            <div className="metric-card" style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, color: '#8899aa', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Daily Calories</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: data.color, marginTop: 4 }}>{data.calories}</div>
            </div>
            <div className="metric-card" style={{ flex: 1, minWidth: 160 }}>
              <div style={{ fontSize: 11, color: '#8899aa', fontWeight: 600, letterSpacing: '0.8px', textTransform: 'uppercase' }}>Daily Protein</div>
              <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800, color: data.color, marginTop: 4 }}>{data.protein}</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16, marginBottom: 24 }}>
            {data.meals.map((meal, i) => (
              <div key={i} className="metric-card card-glow" style={{ padding: 20 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{meal.icon}</span>
                  <div>
                    <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700 }}>{meal.label}</div>
                    <div style={{ fontSize: 11, color: data.color, fontWeight: 600 }}>{meal.time}</div>
                  </div>
                </div>
                {meal.items.map((item, j) => (
                  <div key={j} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: '5px 0', fontSize: 13, color: '#c8d0dc', borderBottom: j < meal.items.length - 1 ? '1px solid #1e3a5f30' : '' }}>
                    <span style={{ color: data.color, marginTop: 1, flexShrink: 0 }}>•</span> {item}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="metric-card card-glow" style={{ padding: 24, borderLeft: `3px solid ${data.color}` }}>
            <div className="section-title" style={{ fontSize: 16, marginBottom: 14 }}>💡 Key Tips for {data.label}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 10 }}>
              {data.tips.map((tip, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 14px', background: '#0a1020', borderRadius: 8, fontSize: 13, color: '#c8d0dc' }}>
                  <span style={{ color: data.color, fontSize: 16, flexShrink: 0 }}>✓</span> {tip}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROGRESS PAGE
// ─────────────────────────────────────────────────────────────────────────────
const ProgressPage = ({ user, workoutLogs, splits }) => {
  const activeSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [selectedSplit, setSelectedSplit] = useState(activeSplit?.id || splits[0]?.id);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  const split = splits.find(s => s.id === selectedSplit);
  const days = split?.days.filter(d => d.type !== 'rest') || [];

  const userLogs = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');

  const dayExercises = useMemo(() => {
    if (!selectedDay) return [];
    const day = days.find(d => d.id === selectedDay);
    if (!day) return [];
    const exerciseNames = new Set();
    userLogs.filter(l => l.dayId === selectedDay).forEach(l => l.exercises?.forEach(e => exerciseNames.add(e.name)));
    day.exercises.forEach(e => exerciseNames.add(e.name));
    return [...exerciseNames];
  }, [selectedDay, days, userLogs]);

  const chartData = useMemo(() => {
    if (!selectedExercise) return [];
    const logs = userLogs.filter(l => selectedDay ? l.dayId === selectedDay : true)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return logs.map(log => {
      const ex = log.exercises?.find(e => e.name === selectedExercise);
      if (!ex || !ex.sets?.length) return null;
      const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
      const totalVol = ex.sets.reduce((acc, s) => acc + (s.reps || 0) * (s.weight || 0), 0);
      const avgReps = +(ex.sets.reduce((acc, s) => acc + (s.reps || 0), 0) / ex.sets.length).toFixed(1);
      return { date: fmtDate(log.date), maxWeight, volume: totalVol, avgReps, sets: ex.sets.length };
    }).filter(Boolean);
  }, [selectedExercise, selectedDay, userLogs]);

  // Auto-select first exercise of the selected day
  const autoExercises = useMemo(() => {
    if (selectedDay && !selectedExercise && dayExercises.length) {
      return dayExercises[0];
    }
    return selectedExercise;
  }, [selectedDay, dayExercises, selectedExercise]);

  const displayExercise = autoExercises || selectedExercise;

  const displayData = useMemo(() => {
    if (!displayExercise) return [];
    const logs = userLogs.filter(l => selectedDay ? l.dayId === selectedDay : true)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return logs.map(log => {
      const ex = log.exercises?.find(e => e.name === displayExercise);
      if (!ex || !ex.sets?.length) return null;
      const maxWeight = Math.max(...ex.sets.map(s => s.weight || 0));
      const totalVol = ex.sets.reduce((acc, s) => acc + (s.reps || 0) * (s.weight || 0), 0);
      const avgReps = +(ex.sets.reduce((acc, s) => acc + (s.reps || 0), 0) / ex.sets.length).toFixed(1);
      return { date: fmtDate(log.date), maxWeight, volume: totalVol, avgReps, sets: ex.sets.length };
    }).filter(Boolean);
  }, [displayExercise, selectedDay, userLogs]);

  const pr = displayData.length ? Math.max(...displayData.map(d => d.maxWeight)) : 0;

  return (
    <div className="fade-in">
      <PageHeader title="Progress Charts" subtitle="Track your strength gains over time" />

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label>Split</label>
          <select value={selectedSplit} onChange={e => { setSelectedSplit(e.target.value); setSelectedDay(null); setSelectedExercise(null); }}>
            {splits.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <label>Day</label>
          <select value={selectedDay || ''} onChange={e => { setSelectedDay(e.target.value || null); setSelectedExercise(null); }}>
            <option value="">All Days</option>
            {days.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label>Exercise</label>
          <select value={displayExercise || ''} onChange={e => setSelectedExercise(e.target.value || null)}>
            <option value="">-- Select Exercise --</option>
            {(selectedDay ? dayExercises : [...new Set(userLogs.flatMap(l => l.exercises?.map(e => e.name) || []))]).map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
        </div>
      </div>

      {displayExercise && displayData.length > 0 ? (
        <>
          {/* PR Badge */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 20 }}>
            <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px' }}>
              <div style={{ fontSize: 24 }}>🏆</div>
              <div>
                <div style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', fontWeight: 600 }}>Personal Record</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#fbbf24' }}>{pr} kg</div>
              </div>
            </div>
            <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px' }}>
              <div style={{ fontSize: 24 }}>📈</div>
              <div>
                <div style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', fontWeight: 600 }}>Total Sessions</div>
                <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#60a5fa' }}>{displayData.length}</div>
              </div>
            </div>
            {displayData.length >= 2 && (
              <div className="metric-card" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px' }}>
                <div style={{ fontSize: 24 }}>📊</div>
                <div>
                  <div style={{ fontSize: 11, color: '#8899aa', textTransform: 'uppercase', fontWeight: 600 }}>Progress</div>
                  <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 28, fontWeight: 800, color: '#00ff88' }}>
                    +{(displayData[displayData.length-1].maxWeight - displayData[0].maxWeight).toFixed(1)} kg
                  </div>
                </div>
              </div>
            )}
          </div>

          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, fontWeight: 700, marginBottom: 16, textTransform: 'uppercase', letterSpacing: '1px' }}>
            {displayExercise} — Strength Progress
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="metric-card card-glow" style={{ padding: 24 }}>
              <div style={{ fontSize: 13, color: '#8899aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>Max Weight (kg)</div>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={displayData}>
                  <defs>
                    <linearGradient id="wt" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff88" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" tick={{ fill:'#8899aa', fontSize:10 }} />
                  <YAxis tick={{ fill:'#8899aa', fontSize:10 }} />
                  <Tooltip contentStyle={{ background:'#0d1520', border:'1px solid #1e3a5f', borderRadius:8 }} />
                  <Area type="monotone" dataKey="maxWeight" stroke="#00ff88" strokeWidth={2} fill="url(#wt)" dot={{ fill:'#00ff88', r:4 }} name="Max Weight" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="metric-card card-glow" style={{ padding: 24 }}>
              <div style={{ fontSize: 13, color: '#8899aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>Volume (sets × reps × kg)</div>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" tick={{ fill:'#8899aa', fontSize:10 }} />
                  <YAxis tick={{ fill:'#8899aa', fontSize:10 }} />
                  <Tooltip contentStyle={{ background:'#0d1520', border:'1px solid #1e3a5f', borderRadius:8 }} />
                  <Bar dataKey="volume" fill="#60a5fa" radius={[4,4,0,0]} name="Volume" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="metric-card card-glow" style={{ padding: 24 }}>
              <div style={{ fontSize: 13, color: '#8899aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: 12 }}>Average Reps Per Set</div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={displayData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f" />
                  <XAxis dataKey="date" tick={{ fill:'#8899aa', fontSize:10 }} />
                  <YAxis tick={{ fill:'#8899aa', fontSize:10 }} />
                  <Tooltip contentStyle={{ background:'#0d1520', border:'1px solid #1e3a5f', borderRadius:8 }} />
                  <Line type="monotone" dataKey="avgReps" stroke="#fb923c" strokeWidth={2} dot={{ fill:'#fb923c', r:4 }} name="Avg Reps" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="metric-card card-glow" style={{ padding: 24 }}>
              <div style={{ fontSize: 13, color: '#8899aa', fontWeight: 600, textTransform: 'uppercase', marginBottom: 14 }}>Session Log</div>
              <div style={{ maxHeight: 200, overflowY: 'auto' }}>
                {[...displayData].reverse().map((d, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #1e3a5f30', fontSize: 13 }}>
                    <span style={{ color: '#8899aa' }}>{d.date}</span>
                    <span style={{ color: '#00ff88', fontWeight: 600 }}>{d.maxWeight} kg</span>
                    <span style={{ color: '#60a5fa' }}>{d.sets} sets</span>
                    <span style={{ color: '#fb923c' }}>~{d.avgReps} reps</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      ) : (
        <div style={{ textAlign: 'center', padding: '60px 40px', background: '#0d1a2d', borderRadius: 16, border: '1px dashed #1e3a5f' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>📊</div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
            {displayExercise ? 'No data for this exercise yet' : 'Select an exercise to view progress'}
          </div>
          <div style={{ color: '#8899aa', fontSize: 14 }}>Log workouts to see your strength progression charts</div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// CONTACT PAGE
// ─────────────────────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', goal:'', service:'custom_plan', message:'' });
  const [submitted, setSubmitted] = useState(false);

  const services = [
    { id:'custom_plan', label:'Custom Workout Plan', icon:'🏋️', price:'₹999' },
    { id:'custom_diet', label:'Custom Diet Plan', icon:'🥗', price:'₹799' },
    { id:'combo', label:'Workout + Diet Combo', icon:'💪', price:'₹1499' },
    { id:'coaching', label:'Online Coaching (1 Month)', icon:'🏆', price:'₹2999' },
  ];

  if (submitted) return (
    <div className="fade-in" style={{ textAlign: 'center', padding: '80px 40px' }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 800, color: '#00ff88', marginBottom: 8 }}>Message Sent!</div>
      <div style={{ color: '#8899aa', fontSize: 16, marginBottom: 32 }}>Vishal will get back to you within 24 hours 🙏</div>
      <button className="btn-primary" onClick={() => setSubmitted(false)}>Send Another</button>
    </div>
  );

  return (
    <div className="fade-in">
      <PageHeader title="Work With Vishal" subtitle="Custom plans crafted for your body & lifestyle goals" />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
        {services.map(s => (
          <div key={s.id} className="metric-card card-glow" style={{ cursor:'pointer', padding:20, transition:'transform 0.2s', border: form.service === s.id ? '1px solid #00ff88' : '1px solid #1e3a5f' }}
            onClick={() => setForm({...form, service: s.id})}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: 20, color: '#00ff88', fontWeight: 800, marginTop: 8, fontFamily: "'Barlow Condensed'" }}>{s.price}</div>
            {form.service === s.id && <div style={{ marginTop: 8 }}><span className="tag tag-green">Selected ✓</span></div>}
          </div>
        ))}
      </div>

      <div className="metric-card card-glow" style={{ padding: 28 }}>
        <div className="section-title" style={{ fontSize: 18, marginBottom: 20 }}>Get In Touch</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div><label>Full Name *</label><input placeholder="Your name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>
          <div><label>Email *</label><input type="email" placeholder="your@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><label>Phone / WhatsApp</label><input placeholder="+91 98765 43210" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
          <div><label>Primary Goal</label>
            <select value={form.goal} onChange={e => setForm({...form, goal: e.target.value})}>
              <option value="">Select your goal</option>
              <option>Weight Loss / Fat Loss</option>
              <option>Muscle Building / Bulking</option>
              <option>Athletic Performance</option>
              <option>General Fitness & Health</option>
              <option>Body Recomposition</option>
              <option>Injury Recovery / Rehab</option>
            </select>
          </div>
        </div>
        <div style={{ marginTop: 16 }}><label>Tell me about your current situation & goals</label>
          <textarea rows={4} placeholder="Current weight, training experience, dietary restrictions, schedule, any specific areas you want to focus on..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ resize:'vertical' }} />
        </div>
        <button className="btn-primary" style={{ marginTop: 20, padding: '14px 32px' }} onClick={() => form.name && form.email && setSubmitted(true)}>
          📩 Submit Request
        </button>
        <div style={{ marginTop: 12, fontSize: 12, color: '#8899aa' }}>
          💡 You can also reach Vishal directly on Instagram or WhatsApp for faster response
        </div>
      </div>

      {/* Social links */}
      <div className="metric-card" style={{ marginTop: 16, padding: 20, display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 16, fontWeight: 700, marginRight: 8 }}>📱 Find Vishal On:</div>
        {[{label:'Instagram', icon:'📸', handle:'@vishalchaudhary_fit'}, {label:'YouTube', icon:'▶️', handle:'Vishal Chaudhary'}, {label:'WhatsApp', icon:'💬', handle:'+91 XXXXX XXXXX'}].map(s => (
          <div key={s.label} style={{ padding: '8px 16px', background: '#0a1020', borderRadius: 8, border: '1px solid #1e3a5f', fontSize: 13 }}>
            <span>{s.icon}</span> <strong style={{ color: '#00ff88' }}>{s.handle}</strong>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// AUTH MODAL
// ─────────────────────────────────────────────────────────────────────────────
const AuthModal = ({ users, setUsers, onLogin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', age:'', gender:'male', weight:'', height:'' });
  const [error, setError] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleLogin = () => {
    const u = users.find(u => u.email === form.email && u.password === form.password);
    if (u) { onLogin(u); } else { setError('Invalid email or password'); }
  };

  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) return setError('Fill all required fields');
    if (users.find(u => u.email === form.email)) return setError('Email already registered');
    const u = { id: genId(), name: form.name, email: form.email, password: form.password,
      age: parseInt(form.age) || 25, gender: form.gender, weight: parseFloat(form.weight) || 70,
      height: parseFloat(form.height) || 170, isAdmin: false, activeSplitId: 'ppl',
      joinDate: todayStr(), bio: '', avatar: form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) };
    setUsers(prev => [...prev, u]);
    onLogin(u);
  };

  return (
    <div className="modal-overlay" style={{ background: 'rgba(0,0,0,0.95)' }}>
      <div className="modal" style={{ maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 36, fontWeight: 900, color: '#00ff88', letterSpacing: '3px' }}>FITTRACK PRO</div>
          <div style={{ fontSize: 13, color: '#8899aa', marginTop: 4 }}>By Vishal Chaudhary</div>
        </div>

        <div style={{ display: 'flex', background: '#0a1020', borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {['login','register'].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(''); }} style={{
              flex: 1, padding: '8px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: mode === m ? '#1e3a5f' : 'transparent',
              color: mode === m ? '#00ff88' : '#8899aa',
              fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, fontSize: 15, textTransform: 'uppercase', letterSpacing: '1px'
            }}>{m === 'login' ? 'Login' : 'Register'}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {mode === 'register' && <div><label>Full Name *</label><input placeholder="Vishal Chaudhary" value={form.name} onChange={e => setForm({...form, name: e.target.value})} /></div>}
          <div><label>Email *</label><input type="email" placeholder="you@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
          <div><label>Password *</label>
            <div style={{ position: 'relative' }}>
              <input type={showPw?'text':'password'} placeholder="••••••••" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
              <button onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'#8899aa', cursor:'pointer' }}>
                {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
              </button>
            </div>
          </div>
          {mode === 'register' && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Age</label><input type="number" placeholder="25" value={form.age} onChange={e => setForm({...form, age: e.target.value})} /></div>
                <div><label>Gender</label>
                  <select value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <div><label>Weight (kg)</label><input type="number" placeholder="70" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} /></div>
                <div><label>Height (cm)</label><input type="number" placeholder="170" value={form.height} onChange={e => setForm({...form, height: e.target.value})} /></div>
              </div>
            </>
          )}
          {error && <div style={{ color: '#f87171', fontSize: 13, background: 'rgba(248,113,113,0.1)', padding: '10px 14px', borderRadius: 8 }}>{error}</div>}
          <button className="btn-primary" style={{ padding: '14px', fontSize: 16 }} onClick={mode === 'login' ? handleLogin : handleRegister}>
            {mode === 'login' ? 'Login →' : 'Create Account →'}
          </button>
          {mode === 'login' && (
            <div style={{ fontSize: 12, color: '#8899aa', textAlign: 'center', padding: '8px', background: '#0a1020', borderRadius: 8 }}>
              Demo: <strong style={{ color: '#60a5fa' }}>vishal@fittrack.com</strong> / <strong style={{ color: '#60a5fa' }}>admin123</strong>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────────────────────
const ProfilePage = ({ user, setUsers, onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...user });

  const save = () => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, ...form, weight: parseFloat(form.weight), height: parseFloat(form.height), age: parseInt(form.age) } : u));
    setEditing(false);
  };

  const bmi = calcBMI(form.weight, form.height);
  const bmiCat = getBMICategory(bmi);

  return (
    <div className="fade-in">
      <PageHeader title="My Profile" />
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20 }}>
        <div className="metric-card card-glow" style={{ padding: 28, textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #00ff88, #00cc6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: '#080b10' }}>
            {user.avatar}
          </div>
          <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 24, fontWeight: 800 }}>{user.name}</div>
          {user.isAdmin && <div style={{ marginTop: 6 }}><span className="tag tag-green">⚡ Admin</span></div>}
          <div style={{ fontSize: 13, color: '#8899aa', marginTop: 8 }}>Member since {fmtDate(user.joinDate)}</div>
          <div style={{ marginTop: 20, padding: '12px 0', borderTop: '1px solid #1e3a5f' }}>
            <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 32, fontWeight: 900, color: bmiCat.color }}>{bmi}</div>
            <span className={`tag ${bmiCat.tag}`}>{bmiCat.label} BMI</span>
          </div>
          <button className="btn-danger" style={{ marginTop: 20, width: '100%' }} onClick={onLogout}>
            <LogOut size={14} style={{ marginRight: 6 }} /> Logout
          </button>
        </div>

        <div className="metric-card card-glow" style={{ padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div className="section-title" style={{ fontSize: 18 }}>Personal Details</div>
            <button className="btn-ghost" onClick={() => editing ? save() : setEditing(true)}>
              {editing ? '✓ Save Changes' : '✏️ Edit Profile'}
            </button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text' },
              { label: 'Age', key: 'age', type: 'number' },
              { label: 'Gender', key: 'gender', type: 'select', options: ['male','female','other'] },
              { label: 'Email', key: 'email', type: 'email' },
              { label: 'Weight (kg)', key: 'weight', type: 'number' },
              { label: 'Height (cm)', key: 'height', type: 'number' },
            ].map(field => (
              <div key={field.key}>
                <label>{field.label}</label>
                {editing ? (
                  field.type === 'select' ? (
                    <select value={form[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})}>
                      {field.options.map(o => <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>)}
                    </select>
                  ) : (
                    <input type={field.type} value={form[field.key]} onChange={e => setForm({...form, [field.key]: e.target.value})} />
                  )
                ) : (
                  <div style={{ padding: '10px 14px', background: '#0a1020', borderRadius: 8, fontSize: 14, color: '#e8eaf0', border: '1px solid #1e3a5f30' }}>
                    {String(user[field.key])}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
const { healthLogs: SAMPLE_HEALTH, workoutLogs: SAMPLE_WORKOUTS } = generateSampleData();

export default function App() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [currentUser, setCurrentUser] = useState(null);
  const [page, setPage] = useState('dashboard');
  const [splits, setSplits] = useState(INITIAL_SPLITS);
  const [healthLogs, setHealthLogs] = useState(SAMPLE_HEALTH);
  const [workoutLogs, setWorkoutLogs] = useState(SAMPLE_WORKOUTS);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const user = currentUser ? users.find(u => u.id === currentUser.id) : null;

  const handleLogin = (u) => setCurrentUser(u);
  const handleLogout = () => { setCurrentUser(null); setPage('dashboard'); };

  const handleSelectSplit = (splitId) => {
    setUsers(prev => prev.map(u => u.id === user.id ? { ...u, activeSplitId: splitId } : u));
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Activity size={18} /> },
    { id: 'workout', label: 'Workout Tracker', icon: <Dumbbell size={18} /> },
    { id: 'splits', label: 'Splits & Exercises', icon: <Target size={18} /> },
    { id: 'diet', label: 'Diet Guide', icon: <Salad size={18} /> },
    { id: 'progress', label: 'Progress Charts', icon: <TrendingUp size={18} /> },
    { id: 'contact', label: 'Work With Me', icon: <Mail size={18} /> },
    { id: 'profile', label: 'My Profile', icon: <User size={18} /> },
  ];

  if (!user) return (
    <>
      <GlobalStyles />
      <AuthModal users={users} setUsers={setUsers} onLogin={handleLogin} />
    </>
  );

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <DashboardPage user={user} healthLogs={healthLogs} workoutLogs={workoutLogs} splits={splits} setHealthLogs={setHealthLogs} />;
      case 'workout': return <WorkoutPage user={user} splits={splits} workoutLogs={workoutLogs} setWorkoutLogs={setWorkoutLogs} />;
      case 'splits': return <SplitsPage user={user} splits={splits} setSplits={setSplits} onSelectSplit={handleSelectSplit} />;
      case 'diet': return <DietPage />;
      case 'progress': return <ProgressPage user={user} workoutLogs={workoutLogs} splits={splits} />;
      case 'contact': return <ContactPage />;
      case 'profile': return <ProfilePage user={user} setUsers={setUsers} onLogout={handleLogout} />;
      default: return null;
    }
  };

  return (
    <>
      <GlobalStyles />
      <div style={{ display: 'flex', minHeight: '100vh', background: '#080b10' }}>
        {/* Sidebar */}
        <div style={{ width: sidebarOpen ? 240 : 64, background: '#0a0f1a', borderRight: '1px solid #1e3a5f', display: 'flex', flexDirection: 'column', transition: 'width 0.25s', flexShrink: 0, position: 'sticky', top: 0, height: '100vh', overflowX: 'hidden' }}>
          {/* Logo */}
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #1e3a5f', display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }} onClick={() => setSidebarOpen(!sidebarOpen)}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #00ff88, #00cc6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>💪</div>
            {sidebarOpen && <div style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 900, letterSpacing: '2px', color: '#00ff88', whiteSpace: 'nowrap' }}>FITTRACK PRO</div>}
          </div>

          {/* User Mini */}
          {sidebarOpen && (
            <div style={{ padding: '16px', borderBottom: '1px solid #1e3a5f', display: 'flex', gap: 10, alignItems: 'center' }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg, #00ff88, #00cc6a)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900, color: '#080b10', fontSize: 14, flexShrink: 0 }}>{user.avatar}</div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize: 11, color: '#8899aa' }}>{user.isAdmin ? '⚡ Admin' : 'Member'}</div>
              </div>
            </div>
          )}

          {/* Nav */}
          <nav style={{ padding: '10px 8px', flex: 1, overflowY: 'auto' }}>
            {navItems.map(item => (
              <div key={item.id} className={`nav-item ${page === item.id ? 'active' : ''}`} onClick={() => setPage(item.id)}>
                <span style={{ flexShrink: 0 }}>{item.icon}</span>
                {sidebarOpen && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
              </div>
            ))}
          </nav>

          {/* Footer */}
          {sidebarOpen && (
            <div style={{ padding: '12px 16px', borderTop: '1px solid #1e3a5f', fontSize: 11, color: '#8899aa' }}>
              FitTrack Pro v1.0<br />
              <span style={{ color: '#00ff8880' }}>Share on Instagram 📸</span>
            </div>
          )}
        </div>

        {/* Main Content */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: 1200 }}>
          {renderPage()}
        </main>
      </div>
    </>
  );
}