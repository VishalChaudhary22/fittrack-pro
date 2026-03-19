import { useState, useMemo } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Dumbbell, Salad, TrendingUp, Mail, User, ChevronDown, LogOut, Eye, EyeOff, Edit2, Trash2, X, Plus, Home } from "lucide-react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#111111;--card:#1A1A1A;--card2:#222222;--border:#252525;
      --orange:#E8540D;--orange2:rgba(232,84,13,0.12);--orange3:rgba(232,84,13,0.06);
      --text:#FFFFFF;--t2:#AAAAAA;--t3:#666666;
      --green:#4CAF50;--red:#E84040;--blue:#5B8DEF;--purple:#A855F7;
    }
    body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    .btn-primary{background:var(--orange);color:#fff;border:none;border-radius:10px;padding:12px 22px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s;width:auto}
    .btn-primary:hover{background:#FF6B2B;transform:translateY(-1px)}
    .btn-ghost{background:transparent;border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
    .btn-ghost:hover{border-color:var(--orange);color:var(--orange)}
    .btn-danger{background:transparent;border:1px solid rgba(232,64,64,.25);color:var(--red);border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;transition:all .2s}
    .btn-danger:hover{background:rgba(232,64,64,.08)}
    input,select,textarea{background:#0D0D0D;border:1px solid var(--border);color:var(--text);font-family:'DM Sans',sans-serif;border-radius:8px;padding:11px 14px;font-size:14px;outline:none;width:100%;transition:border-color .2s}
    input:focus,select:focus,textarea:focus{border-color:var(--orange)}
    select option{background:#1A1A1A}
    label{font-size:11px;color:var(--t3);font-weight:600;letter-spacing:.6px;text-transform:uppercase;display:block;margin-bottom:6px}
    .card{background:var(--card);border:1px solid var(--border);border-radius:14px}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.92);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
    .modal{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;width:100%;max-width:500px;max-height:88vh;overflow-y:auto}
    .tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase}
    .tag-o{background:var(--orange2);color:var(--orange);border:1px solid rgba(232,84,13,.25)}
    .tag-g{background:rgba(76,175,80,.1);color:#4CAF50;border:1px solid rgba(76,175,80,.2)}
    .tag-b{background:rgba(91,141,239,.1);color:#5B8DEF;border:1px solid rgba(91,141,239,.2)}
    .tag-p{background:rgba(168,85,247,.1);color:#A855F7;border:1px solid rgba(168,85,247,.2)}
    .tag-gr{background:rgba(100,100,100,.1);color:#888;border:1px solid rgba(100,100,100,.2)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
    .fade-up{animation:fadeUp .3s ease forwards}
    .nav-item{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;cursor:pointer;transition:all .15s;color:var(--t2);font-size:14px;font-weight:500;white-space:nowrap}
    .nav-item:hover{background:rgba(255,255,255,.04);color:var(--text)}
    .nav-item.active{background:var(--orange2);color:var(--orange)}
    .section-title{font-family:'Bebas Neue',sans-serif;letter-spacing:1.5px}
    .accent-bar{width:28px;height:3px;background:var(--orange);border-radius:2px;margin-bottom:12px}
    /* Mobile */
    .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#161616;border-top:1px solid var(--border);padding:10px 0 calc(10px + env(safe-area-inset-bottom));z-index:100}
    @media(max-width:768px){
      .desktop-sidebar{display:none!important}
      .bottom-nav{display:flex!important}
      .main-content{padding:16px 14px 90px!important}
      .grid-2{grid-template-columns:1fr!important}
      .grid-3{grid-template-columns:1fr!important}
      .hide-mob{display:none!important}
      .modal{padding:18px!important;border-radius:12px!important}
      .page-title{font-size:30px!important}
      .metric-val{font-size:32px!important}
      .half-mob{grid-template-columns:1fr 1fr!important}
    }
    @media(min-width:769px){.bottom-nav{display:none!important}}
    .exercise-row{display:grid;grid-template-columns:40px 1fr 1fr 90px;gap:8px;align-items:center}
    @media(max-width:500px){.exercise-row{grid-template-columns:32px 1fr 1fr 72px;gap:5px}}
  `}</style>
);

// ─── HELPERS ────────────────────────────────────────────────────────────────
const genId = () => Math.random().toString(36).slice(2, 9);
const todayStr = () => new Date().toISOString().split('T')[0];
const fmtDate = d => new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
const wkLabel = d => { const dt = new Date(d); return `W${Math.ceil(dt.getDate()/7)} ${dt.toLocaleDateString('en-IN',{month:'short'})}`; };

const calcBMI = (w, h) => { if (!w || !h) return null; return (w / ((h/100)**2)).toFixed(1); };
const getBMICat = bmi => {
  if (!bmi) return { label:'N/A', color:'#888', tag:'tag-gr' };
  const b = parseFloat(bmi);
  if (b < 18.5) return { label:'Underweight', color:'#5B8DEF', tag:'tag-b' };
  if (b < 25)   return { label:'Normal', color:'#4CAF50', tag:'tag-g' };
  if (b < 30)   return { label:'Overweight', color:'#E8540D', tag:'tag-o' };
  return { label:'Obese', color:'#E84040', tag:'tag-gr' };
};

const ACTIVITY = {
  sedentary:{ label:'Sedentary (desk job, little/no exercise)', mult:1.2 },
  light:    { label:'Lightly Active (1–3 days/week)', mult:1.375 },
  moderate: { label:'Moderately Active (3–5 days/week)', mult:1.55 },
  active:   { label:'Very Active (6–7 days/week)', mult:1.725 },
  extra:    { label:'Extremely Active (athlete / 2×/day)', mult:1.9 },
};

const calcBMR = (w, h, age, gender) => {
  const base = 10 * w + 6.25 * h - 5 * age;
  if (gender === 'male')   return Math.round(base + 5);
  if (gender === 'female') return Math.round(base - 161);
  return Math.round(base - 78);
};
const calcTDEE  = (bmr, lvl) => Math.round(bmr * (ACTIVITY[lvl]?.mult || 1.55));
const goalCals  = (tdee, goal) => goal === 'loss' ? tdee - 500 : goal === 'gain' ? tdee + 500 : tdee;
const goalProt  = (w, goal)   => goal === 'loss' ? Math.round(w * 2.2) : goal === 'gain' ? Math.round(w * 2.0) : Math.round(w * 1.8);

const getDayTag = t => ({ push:'tag-o', pull:'tag-b', legs:'tag-g', upper:'tag-b', lower:'tag-g', full:'tag-p', arms:'tag-p', yoga:'tag-g', home:'tag-g', rest:'tag-gr' }[t] || 'tag-gr');

// ─── SPLITS DATA ─────────────────────────────────────────────────────────────
// Shared exercise factories
const mkLowerA = () => [
  {id:genId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:'Focus on depth'},
  {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
  {id:genId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:'',variants:['Seated Leg Curls','Lying Leg Curls']},
  {id:genId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},
  {id:genId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:'Full ROM'},
];
const mkLowerB = () => [
  {id:genId(),name:'Leg Press',sets:4,repsRange:'8-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},
  {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
  {id:genId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:'Hip hinge, keep back straight'},
  {id:genId(),name:'Leg Adductor Machine',sets:3,repsRange:'15-20',muscle:'Adductors',notes:''},
  {id:genId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
];
const mkUpperA = () => [
  {id:genId(),name:'Smith Machine Incline Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Flat Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Wide Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
  {id:genId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:'Any cable/machine'},
  {id:genId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
  {id:genId(),name:'Biceps Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
  {id:genId(),name:'Single Hand Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:'Full extension'},
];
const mkUpperB = () => [
  {id:genId(),name:'Incline Dumbbell Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Close Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
  {id:genId(),name:'T-Bar Rows',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
  {id:genId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
  {id:genId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
  {id:genId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:'Full stretch at bottom'},
  {id:genId(),name:'Single Hand Overhead Cable Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
];

const INITIAL_SPLITS = [
  // ── PPL 6 Day ──────────────────────────────────────────────────────────────
  { id:'ppl', name:'Push Pull Legs', emoji:'🔥', description:'6 days/week — Push Pull Legs × 2', color:'#E8540D',
    schedule:['Push','Pull','Legs','Push','Pull','Legs','Rest'],
    days:[
      { id:'ppl-pa', name:'Push Day A', type:'push', exercises:[
        {id:genId(),name:'Flat Dumbbell Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Incline Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Overhead Press',sets:4,repsRange:'8-10',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ppl-pla', name:'Pull Day A', type:'pull', exercises:[
        {id:genId(),name:'Deadlift',sets:4,repsRange:'4-6',muscle:'Back/Hamstrings',notes:'King of all lifts'},
        {id:genId(),name:'Wide Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Horizontal Machine Row',sets:4,repsRange:'10-12',muscle:'Back',notes:'Any horizontal pull machine'},
        {id:genId(),name:'Wide Grip T-Bar Rows',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Hammer Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'ppl-la', name:'Legs Day A', type:'legs', exercises: mkLowerA() },
      { id:'ppl-pb', name:'Push Day B', type:'push', exercises:[
        {id:genId(),name:'Chest Machine Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:'',variants:['Chest Machine Press','Bench Press']},
        {id:genId(),name:'Incline Smith Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Dumbbell Shoulder Press',sets:4,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Single Hand Rope Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'ppl-plb', name:'Pull Day B', type:'pull', exercises:[
        {id:genId(),name:'Close Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:genId(),name:'Seated Cable Row (Bar Attachment)',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Preacher Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:'Full stretch at bottom'},
      ]},
      { id:'ppl-lb', name:'Legs Day B', type:'legs', exercises: mkLowerB() },
      { id:'ppl-r', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Upper Lower 4 Day ──────────────────────────────────────────────────────
  { id:'ul4', name:'Upper Lower (4 Day)', emoji:'⚡', description:'4 days — U L Rest U L Rest Rest', color:'#5B8DEF',
    schedule:['Upper','Lower','Rest','Upper','Lower','Rest','Rest'],
    days:[
      { id:'ul4-ua', name:'Upper A', type:'upper', exercises: mkUpperA() },
      { id:'ul4-la', name:'Lower A', type:'lower', exercises: mkLowerA() },
      { id:'ul4-r1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'ul4-ub', name:'Upper B', type:'upper', exercises: mkUpperB() },
      { id:'ul4-lb', name:'Lower B', type:'lower', exercises: mkLowerB() },
      { id:'ul4-r2', name:'Rest Day', type:'rest', exercises:[] },
      { id:'ul4-r3', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Full Body 3 Day ────────────────────────────────────────────────────────
  { id:'fb3', name:'Full Body (3 Day)', emoji:'💥', description:'Full Body – Rest – Repeat', color:'#A855F7',
    schedule:['Full Body','Rest','Full Body','Rest','Full Body','Rest','Rest'],
    days:[
      { id:'fb3-a', name:'Full Body A', type:'full', exercises:[
        {id:genId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},
        {id:genId(),name:'Flat Dumbbell Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Wide Grip Lat Pulldowns',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:'Isolation'},
        {id:genId(),name:'Overhead Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Biceps Cable Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Single Hand Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'fb3-r1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'fb3-b', name:'Full Body B', type:'full', exercises:[
        {id:genId(),name:'Leg Press',sets:4,repsRange:'8-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},
        {id:genId(),name:'Incline Dumbbell Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:'Isolation',variants:['Seated Leg Curls','Lying Leg Curls']},
        {id:genId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extension',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'fb3-r2', name:'Rest Day', type:'rest', exercises:[] },
      { id:'fb3-c', name:'Full Body C', type:'full', exercises:[
        {id:genId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'T-Bar Rows',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:'Isolation'},
        {id:genId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Close Grip Lat Pulldowns',sets:2,repsRange:'12-15',muscle:'Back',notes:''},
      ]},
      { id:'fb3-r3', name:'Rest Day', type:'rest', exercises:[] },
      { id:'fb3-r4', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Upper Lower + Arms ─────────────────────────────────────────────────────
  { id:'ula', name:'Upper Lower + Arms', emoji:'💪', description:'U L Rest U L Arms Rest', color:'#A855F7',
    schedule:['Upper','Lower','Rest','Upper','Lower','Arms','Rest'],
    days:[
      { id:'ula-ua', name:'Upper A', type:'upper', exercises: mkUpperA() },
      { id:'ula-la', name:'Lower A', type:'lower', exercises: mkLowerA() },
      { id:'ula-r1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'ula-ub', name:'Upper B', type:'upper', exercises: mkUpperB() },
      { id:'ula-lb', name:'Lower B', type:'lower', exercises: mkLowerB() },
      { id:'ula-arms', name:'Arms Day', type:'arms', exercises:[
        {id:genId(),name:'Shoulder Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Single Hand Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extensions',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Biceps Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:'Full stretch'},
      ]},
      { id:'ula-r2', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Upper Lower 6 Day ──────────────────────────────────────────────────────
  { id:'ul6', name:'Upper Lower (6 Day)', emoji:'🏆', description:'U L U L U L Rest — High Frequency', color:'#E8540D',
    schedule:['Upper','Lower','Upper','Lower','Upper','Lower','Rest'],
    days:[
      { id:'ul6-ua1', name:'Upper A', type:'upper', exercises: mkUpperA() },
      { id:'ul6-la1', name:'Lower A', type:'lower', exercises: mkLowerA() },
      { id:'ul6-ub',  name:'Upper B', type:'upper', exercises: mkUpperB() },
      { id:'ul6-lb',  name:'Lower B', type:'lower', exercises: mkLowerB() },
      { id:'ul6-ua2', name:'Upper A (repeat)', type:'upper', exercises: mkUpperA() },
      { id:'ul6-la2', name:'Lower A (repeat)', type:'lower', exercises: mkLowerA() },
      { id:'ul6-r',   name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Full Body 6 Day (NEW) ─────────────────────────────────────────────────
  { id:'fb6', name:'Full Body (6 Day)', emoji:'⚔️', description:'6 days FB — lower volume per session', color:'#4CAF50',
    schedule:['Push-FB','Pull-FB','Legs-FB','Push-FB','Pull-FB','Legs-FB','Rest'],
    days:[
      { id:'fb6-d1', name:'Day 1 — Push Focus (Full)', type:'full', exercises:[
        {id:genId(),name:'Flat Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Wide Grip Lat Pulldowns',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Squats',sets:3,repsRange:'8-10',muscle:'Quads',notes:''},
        {id:genId(),name:'Lateral Raises',sets:2,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Biceps Cable Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'fb6-d2', name:'Day 2 — Pull Focus (Full)', type:'full', exercises:[
        {id:genId(),name:'Incline Dumbbell Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Press',sets:3,repsRange:'10-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},
        {id:genId(),name:'Single Hand Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'fb6-d3', name:'Day 3 — Legs Focus (Full)', type:'full', exercises:[
        {id:genId(),name:'Smith Machine Incline Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'T-Bar Rows',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Romanian Deadlift',sets:3,repsRange:'10-12',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Overhead Press',sets:2,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extension',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      { id:'fb6-d4', name:'Day 4 — Push Focus (Full)', type:'full', exercises:[
        {id:genId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Close Grip Lat Pulldowns',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
        {id:genId(),name:'Leg Curls',sets:2,repsRange:'12-15',muscle:'Hamstrings',notes:'',variants:['Seated Leg Curls','Lying Leg Curls']},
        {id:genId(),name:'Rear Delt Flyes',sets:2,repsRange:'15-20',muscle:'Rear Delts',notes:''},
      ]},
      { id:'fb6-d5', name:'Day 5 — Pull Focus (Full)', type:'full', exercises:[
        {id:genId(),name:'Incline Smith Machine Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Wide Grip T-Bar Rows',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},
        {id:genId(),name:'Lateral Raises',sets:2,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'fb6-d6', name:'Day 6 — Legs Focus (Full)', type:'full', exercises:[
        {id:genId(),name:'Flat Dumbbell Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Seated Cable Row (Bar Attachment)',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Adductor Machine',sets:3,repsRange:'15-20',muscle:'Adductors',notes:''},
        {id:genId(),name:'Leg Abductor Machine',sets:2,repsRange:'15-20',muscle:'Abductors',notes:''},
        {id:genId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      { id:'fb6-r', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Home Workouts ──────────────────────────────────────────────────────────
  { id:'home', name:'Home Workouts', emoji:'🏠', description:'Bodyweight training + Yoga — no gym needed', color:'#4CAF50',
    schedule:['Beginner','Yoga','Intermediate','Yoga','Beginner','Rest','Rest'],
    days:[
      { id:'home-beg', name:'Beginner Bodyweight', type:'home', exercises:[
        {id:genId(),name:'Push-ups',sets:3,repsRange:'max',muscle:'Chest/Triceps',notes:'Keep core tight'},
        {id:genId(),name:'Pike Push-ups',sets:3,repsRange:'10-15',muscle:'Shoulders',notes:'Hips high, head to floor'},
        {id:genId(),name:'Tricep Dips (Chair)',sets:3,repsRange:'10-12',muscle:'Triceps',notes:'Elbows close to body'},
        {id:genId(),name:'Australian Pull-ups',sets:3,repsRange:'8-12',muscle:'Back/Biceps',notes:'Use table or low bar'},
        {id:genId(),name:'Bodyweight Squats',sets:3,repsRange:'20-25',muscle:'Quads/Glutes',notes:'Full depth'},
        {id:genId(),name:'Walking Lunges',sets:3,repsRange:'12 each',muscle:'Quads/Glutes',notes:''},
        {id:genId(),name:'Glute Bridges',sets:3,repsRange:'15-20',muscle:'Glutes/Hamstrings',notes:'Squeeze at top'},
        {id:genId(),name:'Plank',sets:3,repsRange:'30-45s',muscle:'Core',notes:'Neutral spine'},
        {id:genId(),name:'Mountain Climbers',sets:3,repsRange:'20 each',muscle:'Core/Cardio',notes:''},
      ]},
      { id:'home-yoga', name:'Yoga Flow', type:'yoga', exercises:[
        {id:genId(),name:'Surya Namaskar (Sun Salutation)',sets:5,repsRange:'1 round each side',muscle:'Full Body',notes:'Breathe in each pose — 12 poses per round'},
        {id:genId(),name:'Tadasana (Mountain Pose)',sets:1,repsRange:'5 breaths',muscle:'Posture/Balance',notes:'Ground through feet, reach through crown'},
        {id:genId(),name:'Adho Mukha Svanasana (Downward Dog)',sets:3,repsRange:'5 breaths',muscle:'Hamstrings/Back',notes:'Push floor away, heels toward ground'},
        {id:genId(),name:'Virabhadrasana I (Warrior I)',sets:3,repsRange:'5 breaths each side',muscle:'Hip Flexors/Quads',notes:'Front knee over ankle'},
        {id:genId(),name:'Virabhadrasana II (Warrior II)',sets:3,repsRange:'5 breaths each side',muscle:'Hips/Legs/Shoulders',notes:'Gaze over front fingertips'},
        {id:genId(),name:'Trikonasana (Triangle Pose)',sets:2,repsRange:'5 breaths each side',muscle:'Hamstrings/Side Body',notes:'Reach long before going down'},
        {id:genId(),name:'Bhujangasana (Cobra Pose)',sets:3,repsRange:'5 breaths',muscle:'Back/Chest',notes:'Elbows soft, shoulders away from ears'},
        {id:genId(),name:'Setu Bandhasana (Bridge Pose)',sets:3,repsRange:'8-10 breaths',muscle:'Glutes/Back/Chest',notes:'Press feet firmly into mat'},
        {id:genId(),name:'Paschimottanasana (Seated Forward Bend)',sets:2,repsRange:'10 breaths',muscle:'Hamstrings/Spine',notes:'Hinge at hips, not waist'},
        {id:genId(),name:'Ardha Matsyendrasana (Seated Spinal Twist)',sets:2,repsRange:'5 breaths each side',muscle:'Spine/Obliques',notes:'Lengthen spine before twisting'},
        {id:genId(),name:'Balasana (Child\'s Pose)',sets:1,repsRange:'10 breaths',muscle:'Recovery/Lower Back',notes:'Rest pose — breathe into back body'},
        {id:genId(),name:'Savasana (Corpse Pose)',sets:1,repsRange:'5 minutes',muscle:'Full Body Recovery',notes:'Complete stillness, let body integrate'},
      ]},
      { id:'home-int', name:'Intermediate Bodyweight', type:'home', exercises:[
        {id:genId(),name:'Diamond Push-ups',sets:4,repsRange:'10-15',muscle:'Chest/Triceps',notes:'Hands form diamond shape'},
        {id:genId(),name:'Decline Push-ups',sets:3,repsRange:'10-15',muscle:'Upper Chest',notes:'Feet elevated on chair'},
        {id:genId(),name:'Pull-ups',sets:4,repsRange:'max',muscle:'Back/Biceps',notes:'Full dead hang at bottom'},
        {id:genId(),name:'Chin-ups',sets:3,repsRange:'max',muscle:'Biceps/Back',notes:'Underhand grip'},
        {id:genId(),name:'Bulgarian Split Squats',sets:3,repsRange:'10-12 each',muscle:'Quads/Glutes',notes:'Back foot elevated'},
        {id:genId(),name:'Jump Squats',sets:3,repsRange:'15-20',muscle:'Quads/Cardio',notes:'Land softly'},
        {id:genId(),name:'Single-Leg Glute Bridges',sets:3,repsRange:'12-15 each',muscle:'Glutes/Hamstrings',notes:''},
        {id:genId(),name:'Hollow Body Hold',sets:3,repsRange:'20-30s',muscle:'Core',notes:'Lower back pressed to floor'},
        {id:genId(),name:'Burpees',sets:3,repsRange:'10-12',muscle:'Full Body/Cardio',notes:'Explosive movement'},
      ]},
      { id:'home-r1', name:'Rest Day', type:'rest', exercises:[] },
      { id:'home-r2', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  // ── Powerlifting ───────────────────────────────────────────────────────────
  { id:'pl', name:'Powerlifting', emoji:'🏋️', description:'Squat · Bench · Deadlift focused programming', color:'#E84040',
    comingSoon: true,
    schedule:['Squat','Bench','Deadlift','Rest','Squat','Bench','Rest'],
    days:[
      { id:'pl-cs', name:'Coming Soon', type:'rest', exercises:[] },
    ],
  },
];

// ─── DIET TEMPLATES ──────────────────────────────────────────────────────────
const DIET_TYPES = {
  vegan: {
    id:'vegan', label:'Vegan', icon:'🌱', color:'#4CAF50',
    description:'100% plant-based — no animal products',
    proteinSources:['Tofu','Tempeh','Lentils (Dal)','Chickpeas (Chana)','Soy milk','Moong dal','Rajma (Kidney Beans)','Pea protein','Hemp seeds'],
    meals:[
      {time:'7:00 AM',label:'Breakfast',icon:'🌅',items:['Overnight oats with soy milk, banana & chia seeds','OR Besan chilla (2) with mint chutney','1 glass of warm water with soaked almonds (6)']},
      {time:'10:00 AM',label:'Mid-Morning',icon:'🍎',items:['1 apple or pear','Handful roasted chana or makhana','Jeera water or green tea (no milk)']},
      {time:'1:00 PM',label:'Lunch',icon:'🍱',items:['2 whole wheat rotis','Rajma or chana masala (1 bowl — ~200g)','Stir-fried seasonal vegetables with olive oil','Salad: cucumber, tomato, onion, lemon']},
      {time:'4:30 PM',label:'Pre-Workout Snack',icon:'⚡',items:['1 banana + 1 tbsp peanut butter','Sattu drink (2 tbsp sattu + lemon + black salt)']},
      {time:'7:30 PM',label:'Post-Workout Dinner',icon:'🍽️',items:['Brown rice (¾ cup cooked) or 2 rotis','Tofu bhurji or moong dal','Sabzi (palak, methi, or mixed veg)','Coconut water or nimbu pani']},
      {time:'9:30 PM',label:'Before Bed',icon:'🌙',items:['Haldi doodh (with oat/almond milk)','Mixed seeds: pumpkin + flax + sunflower (1 tbsp each)']},
    ],
  },
  vegetarian: {
    id:'vegetarian', label:'Vegetarian', icon:'🥛', color:'#5B8DEF',
    description:'Dairy included — no meat, fish or eggs',
    proteinSources:['Paneer','Curd/Greek Yogurt','Milk','Ghee','Lentils','Rajma','Chana','Soy chunks'],
    meals:[
      {time:'7:00 AM',label:'Breakfast',icon:'🌅',items:['Moong dal cheela (2-3) with curd dip','OR Poha with peanuts & vegetables','1 glass full-fat milk with ashwagandha powder']},
      {time:'10:00 AM',label:'Mid-Morning',icon:'🍎',items:['Seasonal fruit (papaya/mango/banana)','100g curd with a pinch of jeera powder']},
      {time:'1:00 PM',label:'Lunch',icon:'🍱',items:['2 rotis with ghee','Paneer bhurji or palak paneer (100g paneer)','Dal (any variety — 1 bowl)','Curd + kachumber salad']},
      {time:'4:30 PM',label:'Pre-Workout',icon:'⚡',items:['Greek yogurt (100g) with banana & honey','Chai or black coffee (no sugar)']},
      {time:'7:30 PM',label:'Post-Workout Dinner',icon:'🍽️',items:['Brown rice or 2 rotis','Soya chunks curry or mixed dal','Stir-fried greens','Raita']},
      {time:'9:30 PM',label:'Before Bed',icon:'🌙',items:['Warm haldi doodh (full-fat milk)','Handful of almonds + walnuts']},
    ],
  },
  egg: {
    id:'egg', label:'Egg Diet', icon:'🥚', color:'#E8540D',
    description:'Eggs + dairy — no meat or fish',
    proteinSources:['Eggs (whole + whites)','Paneer','Curd','Milk','Lentils','Chickpeas'],
    meals:[
      {time:'7:00 AM',label:'Breakfast',icon:'🌅',items:['3 egg whites + 1 whole egg scramble with vegetables','2 whole wheat toasts or 1 roti','1 glass milk']},
      {time:'10:00 AM',label:'Mid-Morning',icon:'🍎',items:['1 banana or apple','2 boiled eggs (whites only if cutting)','Black coffee or green tea']},
      {time:'1:00 PM',label:'Lunch',icon:'🍱',items:['2 rotis or brown rice (¾ cup)','Egg curry (2 eggs) or dal','Mixed vegetable sabzi','Curd + salad']},
      {time:'4:30 PM',label:'Pre-Workout',icon:'⚡',items:['2 boiled eggs + banana','Sattu drink or nimbu pani']},
      {time:'7:30 PM',label:'Post-Workout Dinner',icon:'🍽️',items:['Egg bhurji (3 eggs) with 2 rotis','OR Masala omelette (3 eggs)','Dal or sabzi as side','Buttermilk']},
      {time:'9:30 PM',label:'Before Bed',icon:'🌙',items:['Haldi doodh','1-2 hard boiled egg whites if in weight gain phase']},
    ],
  },
  nonveg: {
    id:'nonveg', label:'Non-Veg', icon:'🍗', color:'#E8540D',
    description:'Chicken, fish, eggs + dairy — all sources',
    proteinSources:['Chicken breast','Fish (Rohu, Katla, Pomfret, Tuna)','Eggs','Paneer','Curd','Mutton (limited)'],
    meals:[
      {time:'7:00 AM',label:'Breakfast',icon:'🌅',items:['4 egg whites + 1 whole egg (scramble/omelette)','2 whole wheat toasts or 1 roti','1 glass milk + soaked almonds']},
      {time:'10:00 AM',label:'Mid-Morning',icon:'🍎',items:['1 fruit (banana/apple)','100g curd or Greek yogurt','Handful of mixed nuts']},
      {time:'1:00 PM',label:'Lunch',icon:'🍱',items:['Brown rice (¾–1 cup cooked) or 2-3 rotis','Chicken curry (150g) or fish curry (150g)','Dal + mixed vegetable sabzi','Salad + curd']},
      {time:'4:30 PM',label:'Pre-Workout',icon:'⚡',items:['1 banana + 1 tbsp peanut butter','Sattu drink or black coffee','2 boiled eggs (if heavy session)']},
      {time:'7:30 PM',label:'Post-Workout Dinner',icon:'🍽️',items:['Grilled chicken (200g) or fish (200g)','2 rotis or brown rice (¾ cup)','Stir-fried vegetables with olive oil','Buttermilk or nimbu pani']},
      {time:'9:30 PM',label:'Before Bed',icon:'🌙',items:['Haldi doodh','Cottage cheese (paneer 50g) or 2 egg whites']},
    ],
  },
};

// ─── SAMPLE DATA ────────────────────────────────────────────────────────────
const genSampleData = () => {
  const logs = [], wLogs = [];
  const today = new Date();
  for (let i = 55; i >= 0; i--) {
    const d = new Date(today); d.setDate(d.getDate() - i);
    const w = +(88 - (55 - i) * 0.09 + (Math.random() - .5) * .8).toFixed(1);
    if (i % 2 === 0 || i < 7) logs.push({ id:genId(), userId:'vishal', date:d.toISOString().split('T')[0], weight:w, notes:'' });
  }
  const bwArr = [60,62.5,62.5,65,67.5,70,70,72.5,75,77.5,80];
  for (let w = 0; w < 10; w++) {
    const d = new Date(today); d.setDate(d.getDate() - (70 - w * 7));
    wLogs.push({ id:genId(), userId:'vishal', splitId:'ppl', dayId:'ppl-pa', dayName:'Push Day A', date:d.toISOString().split('T')[0],
      exercises:[{ name:'Flat Dumbbell Press', sets:[{reps:12,weight:bwArr[w]},{reps:11,weight:bwArr[w]},{reps:10,weight:bwArr[w]},{reps:9,weight:bwArr[w]}]},
                 { name:'Overhead Press', sets:[{reps:10,weight:40+w*2.5},{reps:9,weight:40+w*2.5},{reps:8,weight:40+w*2.5}]}] });
  }
  return { healthLogs:logs, workoutLogs:wLogs };
};
const SAMPLE = genSampleData();
const INIT_USERS = [
  { id:'vishal', name:'Vishal Chaudhary', email:'vishal@fittrack.com', password:'admin123',
    age:32, gender:'male', weight:83.5, height:175, activityLevel:'active', workoutDays:6,
    isAdmin:true, activeSplitId:'ppl', joinDate:'2024-01-15', bio:'Fitness creator 💪',
    avatar:'VC' }
];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const MetricCard = ({ label, value, unit, icon, color='#E8540D', sub, trend, small }) => (
  <div className="card fade-up" style={{ padding: small ? '14px 18px' : '20px 22px', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:0, right:0, width:60, height:60, borderRadius:'0 14px 0 60px', background:`${color}08` }} />
    <div style={{ fontSize: small ? 18 : 22, marginBottom:6 }}>{icon}</div>
    <div style={{ fontSize:11, color:'var(--t3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:4 }}>{label}</div>
    <div style={{ fontFamily:'Bebas Neue, sans-serif', fontSize: small ? 28 : 38, color, lineHeight:1, letterSpacing:'1px' }}>
      {value}<span style={{ fontSize: small ? 13 : 16, fontWeight:400, color:'var(--t2)', marginLeft:3 }}>{unit}</span>
    </div>
    {sub && <div style={{ fontSize:11, color:'var(--t2)', marginTop:4 }}>{sub}</div>}
    {trend !== undefined && <div style={{ fontSize:11, marginTop:4, color: trend > 0 ? 'var(--red)' : 'var(--green)' }}>
      {trend > 0 ? '▲' : '▼'} {Math.abs(trend)} kg this week
    </div>}
  </div>
);

const PageHeader = ({ title, subtitle, action }) => (
  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
    <div>
      <div className="section-title page-title" style={{ fontSize:36, color:'var(--text)' }}>{title}</div>
      <div className="accent-bar" />
      {subtitle && <div style={{ fontSize:13, color:'var(--t2)', marginTop:0 }}>{subtitle}</div>}
    </div>
    {action}
  </div>
);

// ─── AUTH MODAL ──────────────────────────────────────────────────────────────
const AuthModal = ({ users, setUsers, onLogin }) => {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name:'', email:'', password:'', age:'', gender:'male', weight:'', height:'', activityLevel:'moderate', workoutDays:'4' });
  const [err, setErr] = useState('');
  const [showPw, setShowPw] = useState(false);
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const handleLogin = () => {
    const u = users.find(u => u.email === form.email && u.password === form.password);
    u ? onLogin(u) : setErr('Invalid email or password');
  };
  const handleRegister = () => {
    if (!form.name || !form.email || !form.password) return setErr('Fill all required fields');
    if (users.find(u => u.email === form.email)) return setErr('Email already registered');
    const u = { id:genId(), name:form.name, email:form.email, password:form.password,
      age:parseInt(form.age)||25, gender:form.gender, weight:parseFloat(form.weight)||70,
      height:parseFloat(form.height)||170, activityLevel:form.activityLevel||'moderate',
      workoutDays:parseInt(form.workoutDays)||4, isAdmin:false, activeSplitId:'ppl',
      joinDate:todayStr(), bio:'', avatar:form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) };
    setUsers(p => [...p, u]); onLogin(u);
  };

  return (
    <div className="modal-overlay" style={{ background:'radial-gradient(ellipse at 60% 80%, rgba(232,84,13,.15) 0%, rgba(0,0,0,.98) 70%)' }}>
      <div style={{ width:'100%', maxWidth:420 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:56, height:56, borderRadius:14, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', fontSize:26 }}>💪</div>
          <div className="section-title" style={{ fontSize:32, color:'var(--text)' }}>FITTRACK PRO</div>
          <div style={{ fontSize:12, color:'var(--t3)', marginTop:2 }}>by Vishal Chaudhary</div>
        </div>

        <div className="modal" style={{ maxHeight:'80vh' }}>
          {/* Tabs */}
          <div style={{ display:'flex', background:'#0D0D0D', borderRadius:10, padding:3, marginBottom:22 }}>
            {['login','register'].map(m => (
              <button key={m} onClick={() => { setMode(m); setErr(''); }} style={{
                flex:1, padding:'9px 0', borderRadius:8, border:'none', cursor:'pointer',
                background:mode===m ? 'var(--orange)' : 'transparent',
                color:mode===m ? '#fff' : 'var(--t2)',
                fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:14,
                transition:'all .2s'
              }}>{m === 'login' ? 'Log In' : 'Register'}</button>
            ))}
          </div>

          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            {mode === 'register' && <div><label>Full Name *</label><input placeholder="Vishal Chaudhary" value={form.name} onChange={set('name')} /></div>}
            <div><label>Email *</label><input type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} /></div>
            <div><label>Password *</label>
              <div style={{ position:'relative' }}>
                <input type={showPw?'text':'password'} placeholder="••••••••" value={form.password} onChange={set('password')} />
                <button onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:10, top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'var(--t3)', cursor:'pointer' }}>
                  {showPw ? <EyeOff size={14}/> : <Eye size={14}/>}
                </button>
              </div>
            </div>
            {mode === 'register' && (<>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label>Age</label><input type="number" placeholder="25" value={form.age} onChange={set('age')} /></div>
                <div><label>Gender</label>
                  <select value={form.gender} onChange={set('gender')}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label>Weight (kg)</label><input type="number" placeholder="70" value={form.weight} onChange={set('weight')} /></div>
                <div><label>Height (cm)</label><input type="number" placeholder="170" value={form.height} onChange={set('height')} /></div>
              </div>
              <div><label>Activity Level</label>
                <select value={form.activityLevel} onChange={set('activityLevel')}>
                  {Object.entries(ACTIVITY).map(([k,v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div><label>Workout Days per Week</label>
                <select value={form.workoutDays} onChange={set('workoutDays')}>
                  {[1,2,3,4,5,6,7].map(d => <option key={d} value={d}>{d} day{d>1?'s':''}/week</option>)}
                </select>
              </div>
            </>)}
            {err && <div style={{ color:'var(--red)', fontSize:12, background:'rgba(232,64,64,.08)', padding:'9px 12px', borderRadius:8, border:'1px solid rgba(232,64,64,.15)' }}>{err}</div>}
            <button className="btn-primary" style={{ width:'100%', padding:'14px', fontSize:15, borderRadius:10, marginTop:2 }}
              onClick={mode === 'login' ? handleLogin : handleRegister}>
              {mode === 'login' ? 'Log In →' : 'Create Account →'}
            </button>
            {mode === 'login' && (
              <div style={{ fontSize:11, color:'var(--t3)', textAlign:'center', padding:'8px', background:'#0D0D0D', borderRadius:8 }}>
                Demo: <strong style={{ color:'var(--orange)' }}>vishal@fittrack.com</strong> / <strong style={{ color:'var(--orange)' }}>admin123</strong>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD PAGE ──────────────────────────────────────────────────────────
const DashboardPage = ({ user, healthLogs, workoutLogs, splits, setHealthLogs }) => {
  const [showLog, setShowLog] = useState(false);
  const [nw, setNw] = useState({ weight: user.weight, notes:'' });

  const bmi = calcBMI(user.weight, user.height);
  const bmiCat = getBMICat(bmi);
  const activeSplit = splits.find(s => s.id === user.activeSplitId);

  const wkData = useMemo(() => {
    const sorted = [...healthLogs].filter(l => l.userId === user.id).sort((a,b) => new Date(a.date)-new Date(b.date));
    const byWk = {};
    sorted.forEach(l => { const wk = wkLabel(l.date); if (!byWk[wk]) byWk[wk] = []; byWk[wk].push(l.weight); });
    return Object.entries(byWk).map(([week, ws]) => ({ week, weight: +(ws.reduce((a,b)=>a+b,0)/ws.length).toFixed(1) }));
  }, [healthLogs, user.id]);

  const userWo = workoutLogs.filter(l => l.userId === user.id || l.userId === 'vishal');
  const recent = [...userWo].sort((a,b) => new Date(b.date)-new Date(a.date)).slice(0,3);
  const thisWk = userWo.filter(l => (new Date()-new Date(l.date))/86400000 <= 7).length;
  const trend  = wkData.length >= 2 ? +(wkData[wkData.length-1].weight - wkData[wkData.length-2].weight).toFixed(1) : undefined;

  const logWeight = () => {
    setHealthLogs(p => [...p, { id:genId(), userId:user.id, date:todayStr(), weight:parseFloat(nw.weight), notes:nw.notes }]);
    setShowLog(false);
  };

  return (
    <div className="fade-up">
      <PageHeader
        title={`Hey, ${user.name.split(' ')[0]} 👋`}
        subtitle={new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        action={<button className="btn-primary" onClick={()=>setShowLog(true)}>+ Log Weight</button>}
      />

      {/* Metrics */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(160px,1fr))', gap:12, marginBottom:20 }}>
        <MetricCard label="Weight" value={user.weight} unit="kg" icon="⚖️" trend={trend} />
        <MetricCard label="BMI" value={bmi||'—'} unit="" icon="📊" color={bmiCat.color} sub={bmiCat.label} />
        <MetricCard label="Height" value={user.height} unit="cm" icon="📏" color="#5B8DEF" />
        <MetricCard label="This Week" value={thisWk} unit="" icon="🔥" color="#E8540D" sub="sessions" />
        <MetricCard label="All Time" value={userWo.length} unit="" icon="🏆" color="#A855F7" sub="sessions" />
      </div>

      {/* Charts row */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16, marginBottom:16 }} className="grid-2">
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontSize:13, color:'var(--t3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:14 }}>Weight Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={wkData}>
              <defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8540D" stopOpacity={.2}/><stop offset="95%" stopColor="#E8540D" stopOpacity={0}/>
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E" />
              <XAxis dataKey="week" tick={{fill:'#666',fontSize:10}} />
              <YAxis domain={['auto','auto']} tick={{fill:'#666',fontSize:10}} />
              <Tooltip contentStyle={{background:'#1A1A1A',border:'1px solid #252525',borderRadius:8,fontSize:12}} />
              <Area type="monotone" dataKey="weight" stroke="#E8540D" strokeWidth={2} fill="url(#og)" dot={{fill:'#E8540D',r:3}} name="Weight (kg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding:20, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
          <div style={{ fontSize:13, color:'var(--t3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:16 }}>BMI Status</div>
          <div className="section-title" style={{ fontSize:64, color:bmiCat.color, lineHeight:1 }}>{bmi||'—'}</div>
          <span className={`tag ${bmiCat.tag}`} style={{ marginTop:8, fontSize:12 }}>{bmiCat.label}</span>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginTop:16, width:'100%' }}>
            {[{l:'Under',r:'<18.5',c:'#5B8DEF'},{l:'Normal',r:'18.5-25',c:'#4CAF50'},{l:'Over',r:'25-30',c:'#E8540D'},{l:'Obese',r:'>30',c:'#E84040'}].map(s=>(
              <div key={s.l} style={{ textAlign:'center', padding:'6px', borderRadius:8, background:bmiCat.label.startsWith(s.l)?`${s.c}18`:'#111', border:`1px solid ${bmiCat.label.startsWith(s.l)?s.c+'40':'var(--border)'}` }}>
                <div style={{ fontSize:10, color:s.c, fontWeight:700 }}>{s.l}</div>
                <div style={{ fontSize:9, color:'var(--t3)' }}>{s.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Split + Recent */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:16 }} className="grid-2">
        <div className="card" style={{ padding:20 }}>
          <div style={{ fontSize:13, color:'var(--t3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:12 }}>Active Split</div>
          {activeSplit ? <>
            <div style={{ fontSize:28, marginBottom:6 }}>{activeSplit.emoji}</div>
            <div className="section-title" style={{ fontSize:22, color:activeSplit.color }}>{activeSplit.name}</div>
            <div style={{ fontSize:12, color:'var(--t2)', margin:'4px 0 14px' }}>{activeSplit.description}</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {activeSplit.schedule.map((d,i) => (
                <div key={i} style={{ padding:'3px 9px', borderRadius:6, fontSize:10, fontWeight:600,
                  background:d==='Rest'?'#111':activeSplit.color+'15', color:d==='Rest'?'var(--t3)':activeSplit.color,
                  border:`1px solid ${d==='Rest'?'var(--border)':activeSplit.color+'35'}` }}>D{i+1}:{d}</div>
              ))}
            </div>
          </> : <div style={{ color:'var(--t2)', fontSize:13 }}>No split active</div>}
        </div>

        <div className="card" style={{ padding:20 }}>
          <div style={{ fontSize:13, color:'var(--t3)', fontWeight:600, textTransform:'uppercase', letterSpacing:'.5px', marginBottom:14 }}>Recent Sessions</div>
          {recent.length === 0
            ? <div style={{ color:'var(--t3)', fontSize:13 }}>No sessions logged yet. Go crush it! 💪</div>
            : recent.map(w => (
              <div key={w.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 0', borderBottom:'1px solid var(--border)' }}>
                <div>
                  <div style={{ fontWeight:600, fontSize:14 }}>{w.dayName}</div>
                  <div style={{ fontSize:11, color:'var(--t2)', marginTop:2 }}>{fmtDate(w.date)} · {w.exercises?.length||0} exercises</div>
                </div>
                <span className="tag tag-g">Done ✓</span>
              </div>
            ))
          }
        </div>
      </div>

      {showLog && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:380 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div className="section-title" style={{ fontSize:22 }}>Log Weight</div>
              <button className="btn-ghost" onClick={()=>setShowLog(false)} style={{ padding:'5px 9px' }}><X size={14}/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div><label>Weight (kg)</label><input type="number" step=".1" value={nw.weight} onChange={e=>setNw(p=>({...p,weight:e.target.value}))} /></div>
              <div><label>Notes (optional)</label><input placeholder="Post-morning, post-workout..." value={nw.notes} onChange={e=>setNw(p=>({...p,notes:e.target.value}))} /></div>
              <button className="btn-primary" style={{ width:'100%', padding:'13px' }} onClick={logWeight}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SPLITS PAGE (Page 2 — redirects to workout on selection) ────────────────
const SplitsPage = ({ user, splits, setSplits, setActiveSplitId, setPage, isAdmin }) => {
  const [expanded, setExpanded] = useState(null);
  const [expandDay, setExpandDay] = useState(null);
  const [editEx, setEditEx] = useState(null);
  const [showAddEx, setShowAddEx] = useState(null);
  const [newEx, setNewEx] = useState({ name:'', sets:3, repsRange:'8-12', muscle:'', notes:'' });
  const [showAddSplit, setShowAddSplit] = useState(false);
  const [ns, setNs] = useState({ name:'', emoji:'💪', description:'', color:'#E8540D' });

  const handleSelectSplit = (splitId) => {
    if (splits.find(s=>s.id===splitId)?.comingSoon) return;
    setActiveSplitId(splitId);
    setTimeout(() => setPage('workout'), 300);
  };

  const updEx = (sId, dId, eId, data) => setSplits(p => p.map(s => s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:d.exercises.map(e=>e.id!==eId?e:{...e,...data})})}));
  const delEx = (sId, dId, eId) => setSplits(p => p.map(s => s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:d.exercises.filter(e=>e.id!==eId)})}));
  const addEx = (sId, dId) => {
    const e = { id:genId(), ...newEx, sets:parseInt(newEx.sets) };
    setSplits(p => p.map(s => s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:[...d.exercises,e]})}));
    setNewEx({ name:'', sets:3, repsRange:'8-12', muscle:'', notes:'' }); setShowAddEx(null);
  };
  const addSplit = () => {
    const split = { id:genId(), ...ns, schedule:['Day 1','Rest'], days:[{id:genId(),name:'Day 1',type:'custom',exercises:[]},{id:genId(),name:'Rest',type:'rest',exercises:[]}] };
    setSplits(p => [...p, split]); setNs({ name:'', emoji:'💪', description:'', color:'#E8540D' }); setShowAddSplit(false);
  };

  return (
    <div className="fade-up">
      <PageHeader title="Choose Your Split" subtitle="Select a program — you'll go straight to the tracker"
        action={isAdmin && <button className="btn-primary" onClick={()=>setShowAddSplit(true)}>+ New Split</button>}
      />

      {splits.map(split => (
        <div key={split.id} className="card" style={{ marginBottom:14, overflow:'hidden' }}>
          {/* Header */}
          <div style={{ padding:'18px 20px', cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ display:'flex', gap:14, alignItems:'center', flex:1 }} onClick={()=>setExpanded(expanded===split.id?null:split.id)}>
              <div style={{ fontSize:26 }}>{split.emoji}</div>
              <div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:20, color:split.color, letterSpacing:'1px' }}>{split.name}</div>
                <div style={{ fontSize:12, color:'var(--t2)', marginTop:1 }}>{split.description}</div>
              </div>
            </div>
            <div style={{ display:'flex', gap:8, alignItems:'center' }}>
              {split.comingSoon
                ? <span className="tag tag-gr">Coming Soon</span>
                : user.activeSplitId === split.id
                  ? <span className="tag tag-g">✓ Active</span>
                  : <button className="btn-primary" style={{ padding:'8px 16px', fontSize:13 }} onClick={()=>handleSelectSplit(split.id)}>Select →</button>
              }
              <ChevronDown size={15} color="var(--t3)" style={{ transform:expanded===split.id?'rotate(180deg)':'', transition:'.2s', flexShrink:0 }} onClick={()=>setExpanded(expanded===split.id?null:split.id)} />
            </div>
          </div>

          {expanded === split.id && !split.comingSoon && (
            <div style={{ borderTop:'1px solid var(--border)', padding:'16px 20px 20px' }}>
              {/* Schedule */}
              <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:14 }}>
                {split.schedule.map((d,i)=>(
                  <div key={i} style={{ padding:'3px 9px', borderRadius:6, fontSize:10, fontWeight:700,
                    background:d==='Rest'?'#111':split.color+'12', color:d==='Rest'?'var(--t3)':split.color,
                    border:`1px solid ${d==='Rest'?'var(--border)':split.color+'30'}` }}>D{i+1}: {d}</div>
                ))}
              </div>
              {/* Days */}
              {split.days.filter(d=>d.type!=='rest').map(day=>(
                <div key={day.id} style={{ background:'#111', borderRadius:10, marginBottom:8, overflow:'hidden' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 16px', cursor:'pointer' }}
                    onClick={()=>setExpandDay(expandDay===day.id?null:day.id)}>
                    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                      <span className={`tag ${getDayTag(day.type)}`}>{day.type}</span>
                      <span style={{ fontWeight:600, fontSize:14 }}>{day.name}</span>
                      <span style={{ fontSize:11, color:'var(--t3)' }}>{day.exercises.length} exercises</span>
                    </div>
                    <ChevronDown size={13} color="var(--t3)" style={{ transform:expandDay===day.id?'rotate(180deg)':'', transition:'.2s' }} />
                  </div>
                  {expandDay === day.id && (
                    <div style={{ padding:'0 16px 16px' }}>
                      {day.exercises.map(ex=>(
                        <div key={ex.id} style={{ padding:'9px 0', borderBottom:'1px solid #1A1A1A' }}>
                          {editEx === ex.id && isAdmin ? (
                            <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:6 }}>
                              <input value={ex.name} onChange={e=>updEx(split.id,day.id,ex.id,{name:e.target.value})} style={{ fontSize:12, padding:'6px 10px' }} />
                              <input type="number" value={ex.sets} onChange={e=>updEx(split.id,day.id,ex.id,{sets:parseInt(e.target.value)})} style={{ fontSize:12, padding:'6px 10px' }} />
                              <input value={ex.repsRange} onChange={e=>updEx(split.id,day.id,ex.id,{repsRange:e.target.value})} style={{ fontSize:12, padding:'6px 10px' }} />
                              <input value={ex.muscle} onChange={e=>updEx(split.id,day.id,ex.id,{muscle:e.target.value})} style={{ fontSize:12, padding:'6px 10px' }} />
                            </div>
                          ) : (
                            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                              <div>
                                <span style={{ fontWeight:500, fontSize:13 }}>{ex.name}</span>
                                {ex.variants && <span style={{ fontSize:11, color:'var(--t3)', marginLeft:6 }}>(options available)</span>}
                                <span style={{ fontSize:12, color:'var(--t2)', marginLeft:8 }}>{ex.sets}×{ex.repsRange}</span>
                                {ex.muscle && <span style={{ fontSize:11, color:'var(--orange)', marginLeft:8 }}>{ex.muscle}</span>}
                              </div>
                              {isAdmin && (
                                <div style={{ display:'flex', gap:5 }}>
                                  <button className="btn-ghost" style={{ padding:'3px 8px', fontSize:11 }} onClick={()=>setEditEx(editEx===ex.id?null:ex.id)}>
                                    {editEx===ex.id?'✓':<Edit2 size={11}/>}
                                  </button>
                                  <button className="btn-danger" style={{ padding:'3px 7px' }} onClick={()=>delEx(split.id,day.id,ex.id)}><Trash2 size={11}/></button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                      {isAdmin && (showAddEx===day.id ? (
                        <div style={{ marginTop:10, display:'grid', gap:8 }}>
                          <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr', gap:8 }}>
                            <input placeholder="Exercise name" value={newEx.name} onChange={e=>setNewEx(p=>({...p,name:e.target.value}))} style={{ fontSize:13, padding:'8px 12px' }} />
                            <input type="number" placeholder="Sets" value={newEx.sets} onChange={e=>setNewEx(p=>({...p,sets:e.target.value}))} style={{ fontSize:13, padding:'8px 12px' }} />
                            <input placeholder="8-12" value={newEx.repsRange} onChange={e=>setNewEx(p=>({...p,repsRange:e.target.value}))} style={{ fontSize:13, padding:'8px 12px' }} />
                          </div>
                          <input placeholder="Muscle group" value={newEx.muscle} onChange={e=>setNewEx(p=>({...p,muscle:e.target.value}))} style={{ fontSize:13, padding:'8px 12px' }} />
                          <div style={{ display:'flex', gap:8 }}>
                            <button className="btn-primary" style={{ padding:'8px 16px', fontSize:13 }} onClick={()=>addEx(split.id,day.id)}>Add</button>
                            <button className="btn-ghost" style={{ fontSize:13 }} onClick={()=>setShowAddEx(null)}>Cancel</button>
                          </div>
                        </div>
                      ) : <button className="btn-ghost" style={{ marginTop:10, width:'100%', fontSize:12 }} onClick={()=>setShowAddEx(day.id)}>+ Add Exercise</button>)}
                    </div>
                  )}
                </div>
              ))}
              {user.activeSplitId !== split.id && (
                <button className="btn-primary" style={{ width:'100%', marginTop:12, padding:'13px' }} onClick={()=>handleSelectSplit(split.id)}>
                  Select This Split & Start Tracking →
                </button>
              )}
            </div>
          )}
          {expanded === split.id && split.comingSoon && (
            <div style={{ borderTop:'1px solid var(--border)', padding:40, textAlign:'center' }}>
              <div style={{ fontSize:40, marginBottom:10 }}>🏋️</div>
              <div className="section-title" style={{ fontSize:24, color:'var(--orange)' }}>Coming Soon</div>
              <div style={{ color:'var(--t2)', fontSize:13, marginTop:6 }}>Powerlifting programming with Squat, Bench & Deadlift cycles is in development. Stay tuned! 💪</div>
            </div>
          )}
        </div>
      ))}

      {showAddSplit && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth:440 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20 }}>
              <div className="section-title" style={{ fontSize:22 }}>New Custom Split</div>
              <button className="btn-ghost" style={{ padding:'5px 9px' }} onClick={()=>setShowAddSplit(false)}><X size={14}/></button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
              <div><label>Name</label><input placeholder="e.g. Bro Split" value={ns.name} onChange={e=>setNs(p=>({...p,name:e.target.value}))} /></div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
                <div><label>Emoji</label><input value={ns.emoji} onChange={e=>setNs(p=>({...p,emoji:e.target.value}))} /></div>
                <div><label>Color</label><input type="color" value={ns.color} onChange={e=>setNs(p=>({...p,color:e.target.value}))} /></div>
              </div>
              <div><label>Description</label><input placeholder="5 days/week..." value={ns.description} onChange={e=>setNs(p=>({...p,description:e.target.value}))} /></div>
              <button className="btn-primary" style={{ width:'100%', padding:'13px' }} onClick={addSplit}>Create Split</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── WORKOUT TRACKER PAGE ────────────────────────────────────────────────────
const WorkoutPage = ({ user, splits, workoutLogs, setWorkoutLogs }) => {
  const activeSplit = splits.find(s => s.id === user.activeSplitId) || splits[0];
  const [session, setSession] = useState(null);
  const [done, setDone] = useState(false);

  const workoutDays = activeSplit?.days.filter(d => d.type !== 'rest') || [];

  const startSession = (day) => {
    const exercises = day.exercises.map(ex => {
      const prev = workoutLogs.filter(l=>(l.userId===user.id||l.userId==='vishal')&&l.dayId===day.id)
        .sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
      const prevEx = prev?.exercises?.find(e=>e.name===ex.name);
      return {
        ...ex,
        selectedVariant: ex.variants ? ex.variants[0] : null,
        sets: Array.from({ length: ex.sets }, (_, i) => {
          const ps = prevEx?.sets?.[i];
          return { reps: ps?.reps || ex.repsRange?.split('-')[0] || 8, weight: ps?.weight || 0, done: false };
        })
      };
    });
    setSession({ day, exercises, notes:'' }); setDone(false);
  };

  const updSet = (ei, si, field, val) => setSession(p => {
    const exs = [...p.exercises]; const sets = [...exs[ei].sets];
    sets[si] = { ...sets[si], [field]: field==='done' ? val : (field==='reps'||field==='weight') ? (parseFloat(val)||0) : val };
    exs[ei] = { ...exs[ei], sets }; return { ...p, exercises:exs };
  });
  const addSet = ei => setSession(p => {
    const exs = [...p.exercises]; const ls = exs[ei].sets[exs[ei].sets.length-1];
    exs[ei] = { ...exs[ei], sets:[...exs[ei].sets, {...ls,done:false}] }; return { ...p, exercises:exs };
  });
  const rmSet = (ei, si) => setSession(p => {
    const exs = [...p.exercises]; exs[ei] = { ...exs[ei], sets:exs[ei].sets.filter((_,i)=>i!==si) }; return { ...p, exercises:exs };
  });
  const setVariant = (ei, v) => setSession(p => {
    const exs = [...p.exercises]; exs[ei] = { ...exs[ei], selectedVariant:v }; return { ...p, exercises:exs };
  });

  const finish = () => {
    const log = { id:genId(), userId:user.id, splitId:activeSplit.id, dayId:session.day.id, dayName:session.day.name,
      date:todayStr(), notes:session.notes,
      exercises: session.exercises.map(ex => ({
        name: ex.selectedVariant || ex.name,
        sets: ex.sets.filter(s=>s.done).map(s=>({reps:s.reps,weight:s.weight}))
      })).filter(ex=>ex.sets.length>0)
    };
    setWorkoutLogs(p=>[...p,log]); setDone(true);
  };

  if (done) return (
    <div className="fade-up" style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ fontSize:64, marginBottom:14 }}>🎉</div>
      <div className="section-title" style={{ fontSize:40, color:'var(--orange)' }}>WORKOUT COMPLETE!</div>
      <div style={{ color:'var(--t2)', marginTop:8, marginBottom:32 }}>Session saved. Recovery starts now 💪</div>
      <button className="btn-primary" style={{ padding:'14px 32px', fontSize:16 }} onClick={()=>{setSession(null);setDone(false);}}>Log Another</button>
    </div>
  );

  if (session) return (
    <div className="fade-up">
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <button className="btn-ghost" onClick={()=>setSession(null)} style={{ fontSize:13 }}>← Back</button>
        <div>
          <div className="section-title" style={{ fontSize:26 }}>{session.day.name}</div>
          <div style={{ fontSize:12, color:'var(--t2)' }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
      </div>

      {session.exercises.map((ex, ei) => (
        <div key={ex.id} className="card" style={{ marginBottom:14, padding:18 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:'1px' }}>
                {ex.selectedVariant || ex.name}
              </div>
              {ex.variants && (
                <select value={ex.selectedVariant||ex.variants[0]} onChange={e=>setVariant(ei,e.target.value)}
                  style={{ marginTop:5, fontSize:12, padding:'5px 10px', width:'auto' }}>
                  {ex.variants.map(v=><option key={v} value={v}>{v}</option>)}
                </select>
              )}
              <div style={{ marginTop:4, display:'flex', gap:6, flexWrap:'wrap' }}>
                {ex.muscle && <span className="tag tag-o">{ex.muscle}</span>}
                {ex.repsRange && <span style={{ fontSize:11, color:'var(--t3)' }}>Target: {ex.repsRange} reps</span>}
              </div>
            </div>
            <button className="btn-ghost" style={{ fontSize:12, padding:'5px 10px' }} onClick={()=>addSet(ei)}>+ Set</button>
          </div>

          <div className="exercise-row" style={{ marginBottom:6 }}>
            <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700 }}>SET</div>
            <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700 }}>REPS</div>
            <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700 }}>KG</div>
            <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700 }}>DONE</div>
          </div>
          {ex.sets.map((s, si) => (
            <div key={si} className="exercise-row" style={{ marginBottom:6, opacity:s.done?.7:1 }}>
              <div style={{ fontSize:13, color:'var(--t2)', fontWeight:700 }}>{si+1}</div>
              <input type="number" value={s.reps} onChange={e=>updSet(ei,si,'reps',e.target.value)} style={{ padding:'8px 10px', fontSize:14 }} />
              <input type="number" step=".5" value={s.weight} onChange={e=>updSet(ei,si,'weight',e.target.value)} style={{ padding:'8px 10px', fontSize:14 }} />
              <div style={{ display:'flex', gap:4 }}>
                <button onClick={()=>updSet(ei,si,'done',!s.done)} style={{
                  flex:1, background:s.done?'var(--orange2)':'#111', border:`1px solid ${s.done?'var(--orange)':'var(--border)'}`,
                  borderRadius:8, color:s.done?'var(--orange)':'var(--t3)', cursor:'pointer', padding:'8px 0', fontSize:15, transition:'all .15s'
                }}>{s.done?'✓':'○'}</button>
                {ex.sets.length>1&&<button onClick={()=>rmSet(ei,si)} style={{ background:'transparent', border:'1px solid var(--border)', borderRadius:8, color:'var(--t3)', cursor:'pointer', padding:'8px 6px', fontSize:11 }}>✕</button>}
              </div>
            </div>
          ))}
          {ex.notes&&<div style={{ fontSize:11, color:'var(--t3)', marginTop:6, fontStyle:'italic' }}>💡 {ex.notes}</div>}
        </div>
      ))}

      <div className="card" style={{ marginBottom:14, padding:16 }}>
        <label>Session Notes</label>
        <textarea rows={2} placeholder="PRs, form notes, how it felt..." value={session.notes} onChange={e=>setSession(p=>({...p,notes:e.target.value}))} style={{ resize:'vertical' }} />
      </div>

      <button className="btn-primary" style={{ width:'100%', padding:'16px', fontSize:16, borderRadius:10 }} onClick={finish}>
        🏁 Finish Workout
      </button>
    </div>
  );

  return (
    <div className="fade-up">
      <PageHeader title="Workout Tracker" subtitle={activeSplit ? `${activeSplit.emoji} ${activeSplit.name}` : 'Select a split first'} />
      {!activeSplit
        ? <div style={{ textAlign:'center', padding:40 }}><div style={{ color:'var(--t2)' }}>Go to Splits to select a program first</div></div>
        : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {workoutDays.map(day => {
              const last = workoutLogs.filter(l=>(l.userId===user.id||l.userId==='vishal')&&l.dayId===day.id)
                .sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
              return (
                <div key={day.id} className="card" style={{ padding:18, cursor:'pointer', transition:'transform .2s, border-color .2s' }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='var(--orange)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--border)';}}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                    <span className={`tag ${getDayTag(day.type)}`}>{day.type}</span>
                    {last && <span style={{ fontSize:10, color:'var(--t3)' }}>Last: {fmtDate(last.date)}</span>}
                  </div>
                  <div className="section-title" style={{ fontSize:18, marginBottom:10 }}>{day.name}</div>
                  {day.exercises.slice(0,4).map(ex=>(
                    <div key={ex.id} style={{ display:'flex', justifyContent:'space-between', fontSize:12, color:'var(--t2)', padding:'4px 0', borderBottom:'1px solid #1A1A1A' }}>
                      <span>{ex.name}</span>
                      <span style={{ color:'var(--orange)' }}>{ex.sets}×{ex.repsRange}</span>
                    </div>
                  ))}
                  {day.exercises.length>4&&<div style={{ fontSize:11, color:'var(--t3)', marginTop:6 }}>+{day.exercises.length-4} more</div>}
                  <button className="btn-primary" style={{ width:'100%', marginTop:14, padding:'11px' }} onClick={()=>startSession(day)}>
                    Start Session →
                  </button>
                </div>
              );
            })}
          </div>
      }
    </div>
  );
};

// ─── DIET PAGE ───────────────────────────────────────────────────────────────
const DietPage = ({ user }) => {
  const [goal, setGoal] = useState('maintenance');
  const [dietType, setDietType] = useState('nonveg');

  const bmr  = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calcTDEE(bmr, user.activityLevel || 'moderate');
  const cals = goalCals(tdee, goal);
  const prot = goalProt(user.weight, goal);
  const carbs = Math.round((cals * (goal === 'loss' ? .40 : .45)) / 4);
  const fat  = Math.round((cals * .25) / 9);
  // Whey: 1 scoop ≈ 25g protein. 2 scoops max for everyone; 3–4 scoops when protein goal ≥180g
  const wheyScoops        = prot >= 180 ? Math.min(Math.ceil((prot - 100) / 25), 4) : 2;
  const wheyProteinFromSupp = wheyScoops * 25;
  const foodProteinNeeded   = prot - wheyProteinFromSupp;

  const dt = DIET_TYPES[dietType];
  const bmi = calcBMI(user.weight, user.height);
  const bmiCat = getBMICat(bmi);

  const GOALS = [
    { id:'loss',        label:'Weight Loss',   icon:'🔥', kcal: tdee - 500, color:'#E84040' },
    { id:'maintenance', label:'Maintenance',   icon:'⚖️', kcal: tdee,       color:'#E8540D' },
    { id:'gain',        label:'Weight Gain',   icon:'💪', kcal: tdee + 500, color:'#4CAF50' },
  ];

  return (
    <div className="fade-up">
      <PageHeader title="Diet Guide" subtitle={`Personalised for ${user.name.split(' ')[0]} — based on your body stats`} />

      {/* Body Stats Summary */}
      <div className="card" style={{ padding:18, marginBottom:18, display:'flex', gap:12, flexWrap:'wrap', alignItems:'center' }}>
        <div style={{ fontSize:12, color:'var(--t3)', fontWeight:600 }}>YOUR STATS</div>
        {[
          { l:'Age',    v:`${user.age} yr` },
          { l:'Weight', v:`${user.weight} kg` },
          { l:'Height', v:`${user.height} cm` },
          { l:'BMI',    v:`${bmi} (${bmiCat.label})` },
          { l:'Activity', v: ACTIVITY[user.activityLevel||'moderate']?.label.split('(')[0] },
          { l:'BMR',    v:`${bmr} kcal` },
          { l:'TDEE',   v:`${tdee} kcal` },
        ].map(s=>(
          <div key={s.l} style={{ padding:'6px 12px', background:'#111', borderRadius:8, border:'1px solid var(--border)' }}>
            <div style={{ fontSize:9, color:'var(--t3)', fontWeight:700, textTransform:'uppercase' }}>{s.l}</div>
            <div style={{ fontSize:13, fontWeight:600, color:'var(--text)', marginTop:1 }}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Goal Selection */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:10, marginBottom:18 }} className="half-mob">
        {GOALS.map(g=>(
          <div key={g.id} className="card" style={{ padding:16, cursor:'pointer', border:`1px solid ${goal===g.id?g.color:'var(--border)'}`, background:goal===g.id?`${g.color}08`:'var(--card)', transition:'all .2s' }}
            onClick={()=>setGoal(g.id)}>
            <div style={{ fontSize:22, marginBottom:6 }}>{g.icon}</div>
            <div style={{ fontWeight:700, fontSize:13 }}>{g.label}</div>
            <div style={{ fontSize:11, color:g.color, marginTop:4, fontWeight:600 }}>{g.kcal} kcal/day</div>
            {goal===g.id&&<span className="tag tag-g" style={{ marginTop:8 }}>Selected ✓</span>}
          </div>
        ))}
      </div>

      {/* Macros */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:18 }}>
        {[{l:'Calories',v:cals,u:'kcal',c:'var(--orange)'},{l:'Protein',v:prot,u:'g',c:'#5B8DEF'},{l:'Carbs',v:carbs,u:'g',c:'#4CAF50'},{l:'Fat',v:fat,u:'g',c:'#A855F7'}].map(m=>(
          <div key={m.l} className="card" style={{ padding:14, textAlign:'center' }}>
            <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:4 }}>{m.l}</div>
            <div className="section-title" style={{ fontSize:26, color:m.c }}>{m.v}<span style={{ fontSize:12, color:'var(--t2)' }}>{m.u}</span></div>
          </div>
        ))}
      </div>

      {/* Diet Type Selection */}
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:18 }}>
        {Object.values(DIET_TYPES).map(d=>(
          <button key={d.id} onClick={()=>setDietType(d.id)} style={{
            padding:'9px 16px', borderRadius:10, cursor:'pointer', fontSize:13, fontWeight:600, transition:'all .2s',
            background:dietType===d.id?d.color:'transparent', color:dietType===d.id?'#fff':'var(--t2)',
            border:`1px solid ${dietType===d.id?d.color:'var(--border)'}`,
          }}>{d.icon} {d.label}</button>
        ))}
      </div>

      {/* Protein sources */}
      <div className="card" style={{ padding:16, marginBottom:16, borderLeft:`3px solid ${dt.color}` }}>
        <div style={{ fontSize:12, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:8 }}>Best Protein Sources — {dt.label}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {dt.proteinSources.map(s=>(
            <span key={s} style={{ padding:'4px 10px', background:`${dt.color}10`, color:dt.color, border:`1px solid ${dt.color}25`, borderRadius:20, fontSize:12, fontWeight:500 }}>{s}</span>
          ))}
        </div>
      </div>

      {/* ── Whey Protein Card ─────────────────────────────────────────────── */}
      <div className="card" style={{ padding:20, marginBottom:16, border:'1px solid rgba(232,84,13,.3)', background:'rgba(232,84,13,.04)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
          <div style={{ width:38, height:38, borderRadius:10, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, flexShrink:0 }}>🥤</div>
          <div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:'1px', color:'var(--orange)' }}>Whey Protein Supplement</div>
            <div style={{ fontSize:11, color:'var(--t2)' }}>Recommended to hit your {prot}g daily protein target</div>
          </div>
          <span className="tag tag-o" style={{ marginLeft:'auto', fontSize:11, padding:'5px 12px' }}>{wheyScoops} Scoops/day</span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:10, marginBottom:14 }}>
          {[
            { l:'Scoops/Day',    v:wheyScoops,           u:'scoops', c:'var(--orange)' },
            { l:'Protein/Scoop', v:'~25',                u:'g',      c:'#5B8DEF'       },
            { l:'From Whey',     v:wheyProteinFromSupp,  u:'g',      c:'#A855F7'       },
            { l:'From Food',     v:foodProteinNeeded,    u:'g',      c:'#4CAF50'       },
          ].map(m=>(
            <div key={m.l} style={{ background:'#111', borderRadius:10, padding:'10px 14px', border:'1px solid var(--border)' }}>
              <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700, textTransform:'uppercase' }}>{m.l}</div>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:24, color:m.c, marginTop:2 }}>{m.v}<span style={{ fontSize:12, color:'var(--t2)', marginLeft:2 }}>{m.u}</span></div>
            </div>
          ))}
        </div>

        <div style={{ background:'#111', borderRadius:10, padding:14, border:'1px solid var(--border)' }}>
          <div style={{ fontSize:11, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:10 }}>When to Take</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            {[
              { time:'Post-Workout',    tip:`1 scoop in 250ml water within 30 min of training`, icon:'⚡' },
              { time:'Morning',         tip:'1 scoop with breakfast or oats to start protein early', icon:'🌅' },
              ...(wheyScoops >= 3 ? [{ time:'Mid-Morning',  tip:'1 scoop between breakfast & lunch on training days', icon:'🍎' }] : []),
              ...(wheyScoops >= 4 ? [{ time:'Pre-Bed',      tip:'1 scoop (prefer casein if available) for overnight recovery', icon:'🌙' }] : []),
            ].map((t,i)=>(
              <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start' }}>
                <span style={{ fontSize:14, flexShrink:0 }}>{t.icon}</span>
                <div>
                  <div style={{ fontSize:11, color:'var(--orange)', fontWeight:700 }}>{t.time}</div>
                  <div style={{ fontSize:11, color:'var(--t2)', marginTop:2 }}>{t.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop:12, padding:'10px 14px', background:'rgba(91,141,239,.06)', borderRadius:8, border:'1px solid rgba(91,141,239,.15)', fontSize:11, color:'var(--t2)' }}>
          💡 <strong style={{ color:'#5B8DEF' }}>Brands available in India:</strong> MuscleBlaze, Optimum Nutrition (ON) Gold Standard, MyProtein, Dymatize, Scitron — all widely available on Amazon/Flipkart. 
          {dietType === 'vegan' ? ' Choose a plant-based protein (pea + rice blend) like MuscleBlaze Biozyme Plant Protein for a vegan option.' : ' Choose whey isolate if lactose-sensitive, whey concentrate otherwise.'}
        </div>
      </div>

      {/* ── Complete Proteins — All 9 Essential Amino Acids ───────────────── */}
      <div className="card" style={{ padding:20, marginBottom:16 }}>
        <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:'1px', marginBottom:4 }}>Complete Proteins — All 9 Essential Amino Acids</div>
        <div className="accent-bar" />
        <div style={{ fontSize:12, color:'var(--t2)', marginBottom:14 }}>
          Your body cannot make these 9 amino acids — they must come from food daily. 
          <strong style={{ color:'var(--text)' }}> Histidine · Isoleucine · Leucine · Lysine · Methionine · Phenylalanine · Threonine · Tryptophan · Valine</strong>
        </div>

        {/* Complete protein foods grid */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:10, marginBottom:14 }}>
          {[
            { food:'Eggs 🥚',         note:'Best bioavailable complete protein — reference food for protein quality (PDCAAS 1.0). 1 whole egg = all 9 EAAs + healthy fats.',  available: true  },
            { food:'Chicken / Fish 🍗', note:'Lean meats are complete proteins. Rohu, Katla, Pomfret, Tuna are all excellent and widely available across India.',              available: true  },
            { food:'Milk & Paneer 🥛', note:'Casein + whey naturally present. 100g paneer provides ~18g complete protein. Curd and Greek yogurt also qualify.',               available: true  },
            { food:'Soy / Tofu 🫘',    note:'Only plant food with a PDCAAS of 1.0 — fully complete. Includes tofu, tempeh, soy milk, soya chunks (nutrela). Widely available in India.', available: true },
            { food:'Quinoa 🌾',        note:'Complete plant grain — all 9 EAAs including lysine which most grains lack. Available on Amazon/bigbasket. Cook like rice.',       available: true  },
            { food:'Amaranth (Rajgira) 🌿', note:'Traditional Indian superfood — complete protein at 14g/100g. Used during Navratri fasting. Available as flour, puffed grain or ladoos.', available: true },
            { food:'Buckwheat (Kuttu) 🥣', note:'Gluten-free, complete protein grain common in North India. Kuttu atta widely available — makes great chillas and rotis.',    available: true  },
            { food:'Hemp Seeds 🌱',    note:'30% complete protein by weight — all 9 EAAs plus ideal omega 3:6 ratio. Increasingly available in health stores and Amazon India.', available: true },
            { food:'Dal + Rice combo 🍱', note:'While individually incomplete, dal (lysine-rich) + rice (methionine-rich) together form a complete amino acid profile. Classic Indian khichdi is a perfect complete meal.', available: true },
          ].filter(f => dietType === 'vegan'
            ? !['Eggs 🥚','Chicken / Fish 🍗','Milk & Paneer 🥛'].includes(f.food)
            : dietType === 'vegetarian'
            ? !['Chicken / Fish 🍗'].includes(f.food)
            : dietType === 'egg'
            ? !['Chicken / Fish 🍗'].includes(f.food)
            : true
          ).map((f,i)=>(
            <div key={i} style={{ background:'#111', borderRadius:10, padding:'12px 14px', border:'1px solid var(--border)' }}>
              <div style={{ fontWeight:700, fontSize:13, marginBottom:5 }}>{f.food}</div>
              <div style={{ fontSize:11, color:'var(--t2)', lineHeight:1.5 }}>{f.note}</div>
            </div>
          ))}
        </div>

        {/* EAA tip */}
        <div style={{ padding:'12px 14px', background:'rgba(76,175,80,.06)', borderRadius:10, border:'1px solid rgba(76,175,80,.15)', fontSize:12, color:'var(--t2)' }}>
          ✅ <strong style={{ color:'#4CAF50' }}>Practical tip:</strong> Aim for at least <strong style={{ color:'var(--text)' }}>2 complete protein sources</strong> per meal. 
          If eating plant-only meals, combine legumes (dal, chana, rajma) with a grain (rice, roti, quinoa) in the same meal to cover all 9 EAAs. 
          Whey protein itself is a complete protein and contributes to all 9 EAAs every time you take it.
        </div>
      </div>

      {/* Meal Plan */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
        {dt.meals.map((meal,i)=>(
          <div key={i} className="card" style={{ padding:18 }}>
            <div style={{ display:'flex', gap:10, alignItems:'center', marginBottom:12 }}>
              <span style={{ fontSize:20 }}>{meal.icon}</span>
              <div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:16, letterSpacing:'1px' }}>{meal.label}</div>
                <div style={{ fontSize:11, color:dt.color, fontWeight:600 }}>{meal.time}</div>
              </div>
              {goal==='gain'&&<span className="tag tag-g" style={{ marginLeft:'auto', fontSize:9 }}>+Portions</span>}
              {goal==='loss'&&<span className="tag tag-o" style={{ marginLeft:'auto', fontSize:9 }}>-Portions</span>}
            </div>
            {meal.items.map((item,j)=>(
              <div key={j} style={{ display:'flex', gap:7, alignItems:'flex-start', padding:'5px 0', fontSize:12, color:'#CCC', borderBottom:j<meal.items.length-1?'1px solid #1E1E1E':'' }}>
                <span style={{ color:dt.color, flexShrink:0, marginTop:1 }}>•</span>{item}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="card" style={{ marginTop:14, padding:14, borderLeft:'3px solid var(--orange)' }}>
        <div style={{ fontSize:11, color:'var(--t2)' }}>
          📌 <strong>Note:</strong> Scale portions up or down to hit your daily calorie target of <strong style={{ color:'var(--orange)' }}>{cals} kcal</strong>. 
          Calorie calculation uses the Mifflin-St Jeor equation with your body stats. 
          {goal==='loss'&&' For weight loss, a 500 kcal deficit is applied for ~0.5kg/week fat loss.'}
          {goal==='gain'&&' For muscle gain, 500 kcal above TDEE is added. Combine with progressive overload training.'}
          {` Your ${wheyScoops} whey scoops contribute ${wheyProteinFromSupp}g protein — get the remaining ${foodProteinNeeded}g from whole foods listed above.`}
        </div>
      </div>
    </div>
  );
};

// ─── PROGRESS PAGE ───────────────────────────────────────────────────────────
const ProgressPage = ({ user, workoutLogs, splits }) => {
  const activeSplit = splits.find(s=>s.id===user.activeSplitId)||splits[0];
  const [selSplit, setSelSplit] = useState(activeSplit?.id||splits[0]?.id);
  const [selDay, setSelDay] = useState('');
  const [selEx, setSelEx] = useState('');

  const split = splits.find(s=>s.id===selSplit);
  const days  = split?.days.filter(d=>d.type!=='rest') || [];
  const userLogs = workoutLogs.filter(l=>l.userId===user.id||l.userId==='vishal');

  const allExNames = useMemo(() => {
    const ns = new Set();
    userLogs.filter(l=>!selDay||l.dayId===selDay).forEach(l=>l.exercises?.forEach(e=>ns.add(e.name)));
    if (selDay) days.find(d=>d.id===selDay)?.exercises.forEach(e=>ns.add(e.name));
    return [...ns];
  }, [selDay, userLogs, days]);

  const chartData = useMemo(() => {
    if (!selEx) return [];
    return userLogs.filter(l=>!selDay||l.dayId===selDay).sort((a,b)=>new Date(a.date)-new Date(b.date))
      .map(log => {
        const ex = log.exercises?.find(e=>e.name===selEx);
        if (!ex?.sets?.length) return null;
        const maxW = Math.max(...ex.sets.map(s=>s.weight||0));
        const vol  = ex.sets.reduce((a,s)=>a+(s.reps||0)*(s.weight||0),0);
        const avgR = +(ex.sets.reduce((a,s)=>a+(s.reps||0),0)/ex.sets.length).toFixed(1);
        return { date:fmtDate(log.date), maxWeight:maxW, volume:Math.round(vol), avgReps:avgR, sets:ex.sets.length };
      }).filter(Boolean);
  }, [selEx, selDay, userLogs]);

  const pr = chartData.length ? Math.max(...chartData.map(d=>d.maxWeight)) : 0;

  return (
    <div className="fade-up">
      <PageHeader title="Progress Charts" subtitle="Track your strength gains over time" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginBottom:20 }} className="grid-3">
        <div>
          <label>Split</label>
          <select value={selSplit} onChange={e=>{setSelSplit(e.target.value);setSelDay('');setSelEx('');}}>
            {splits.filter(s=>!s.comingSoon).map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
        </div>
        <div>
          <label>Day</label>
          <select value={selDay} onChange={e=>{setSelDay(e.target.value);setSelEx('');}}>
            <option value="">All Days</option>
            {days.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div>
          <label>Exercise</label>
          <select value={selEx} onChange={e=>setSelEx(e.target.value)}>
            <option value="">— Select —</option>
            {allExNames.map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>

      {selEx && chartData.length > 0 ? (<>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:18 }}>
          <MetricCard label="Personal Record" value={pr} unit="kg" icon="🏆" color="#E8540D" small />
          <MetricCard label="Sessions Logged" value={chartData.length} unit="" icon="📋" color="#5B8DEF" small />
          {chartData.length>=2&&<MetricCard label="Total Progress" value={`+${(chartData[chartData.length-1].maxWeight-chartData[0].maxWeight).toFixed(1)}`} unit="kg" icon="📈" color="#4CAF50" small />}
        </div>

        <div className="section-title" style={{ fontSize:18, marginBottom:14, color:'var(--orange)' }}>{selEx}</div>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }} className="grid-2">
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontSize:11, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>Max Weight (kg)</div>
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={chartData}>
                <defs><linearGradient id="cg1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#E8540D" stopOpacity={.2}/><stop offset="95%" stopColor="#E8540D" stopOpacity={0}/>
                </linearGradient></defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/>
                <XAxis dataKey="date" tick={{fill:'#666',fontSize:10}}/>
                <YAxis tick={{fill:'#666',fontSize:10}}/>
                <Tooltip contentStyle={{background:'#1A1A1A',border:'1px solid #252525',borderRadius:8,fontSize:12}}/>
                <Area type="monotone" dataKey="maxWeight" stroke="#E8540D" strokeWidth={2} fill="url(#cg1)" dot={{fill:'#E8540D',r:4}} name="Max kg"/>
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontSize:11, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>Volume (reps × kg)</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/>
                <XAxis dataKey="date" tick={{fill:'#666',fontSize:10}}/>
                <YAxis tick={{fill:'#666',fontSize:10}}/>
                <Tooltip contentStyle={{background:'#1A1A1A',border:'1px solid #252525',borderRadius:8,fontSize:12}}/>
                <Bar dataKey="volume" fill="#5B8DEF" radius={[4,4,0,0]} name="Volume"/>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontSize:11, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>Avg Reps Per Set</div>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/>
                <XAxis dataKey="date" tick={{fill:'#666',fontSize:10}}/>
                <YAxis tick={{fill:'#666',fontSize:10}}/>
                <Tooltip contentStyle={{background:'#1A1A1A',border:'1px solid #252525',borderRadius:8,fontSize:12}}/>
                <Line type="monotone" dataKey="avgReps" stroke="#4CAF50" strokeWidth={2} dot={{fill:'#4CAF50',r:4}} name="Avg Reps"/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card" style={{ padding:20 }}>
            <div style={{ fontSize:11, color:'var(--t3)', fontWeight:700, textTransform:'uppercase', marginBottom:12 }}>Session Log</div>
            <div style={{ maxHeight:180, overflowY:'auto' }}>
              {[...chartData].reverse().map((d,i)=>(
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'7px 0', borderBottom:'1px solid #1E1E1E', fontSize:12 }}>
                  <span style={{ color:'var(--t2)' }}>{d.date}</span>
                  <span style={{ color:'var(--orange)', fontWeight:700 }}>{d.maxWeight}kg</span>
                  <span style={{ color:'#5B8DEF' }}>{d.sets}×</span>
                  <span style={{ color:'#4CAF50' }}>{d.avgReps} reps</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>) : (
        <div style={{ textAlign:'center', padding:'60px 20px', border:'1px dashed var(--border)', borderRadius:14 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>📊</div>
          <div className="section-title" style={{ fontSize:22, marginBottom:6 }}>
            {selEx ? 'No data yet for this exercise' : 'Select a split, day & exercise'}
          </div>
          <div style={{ fontSize:13, color:'var(--t2)' }}>Log workouts to see your strength progression charts here</div>
        </div>
      )}
    </div>
  );
};

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
const ContactPage = () => {
  const [form, setForm] = useState({ name:'', email:'', phone:'', goal:'', service:'workout', message:'' });
  const [submitted, setSubmitted] = useState(false);
  const set = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const SERVICES = [
    { id:'workout',  label:'Custom Workout Plan', icon:'🏋️', price:'₹2,000' },
    { id:'diet',     label:'Custom Diet Plan',    icon:'🥗',  price:'₹3,000' },
    { id:'combo',    label:'Workout + Diet Combo', icon:'💪', price:'₹4,500' },
    { id:'coaching', label:'Online Coaching',      icon:'🏆', price:'Contact for pricing' },
  ];

  const handleSubmit = () => {
    if (!form.name || !form.email) return;
    const svc = SERVICES.find(s=>s.id===form.service);
    const subject = `FitTrack Pro — ${svc?.label} Inquiry from ${form.name}`;
    const body = `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone||'Not provided'}\nService: ${svc?.label} (${svc?.price})\nGoal: ${form.goal||'Not specified'}\n\nMessage:\n${form.message}`;
    window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    setSubmitted(true);
  };

  if (submitted) return (
    <div className="fade-up" style={{ textAlign:'center', padding:'80px 20px' }}>
      <div style={{ fontSize:56, marginBottom:14 }}>📩</div>
      <div className="section-title" style={{ fontSize:36, color:'var(--orange)' }}>MESSAGE SENT!</div>
      <div style={{ color:'var(--t2)', marginTop:8, marginBottom:8 }}>Your email client should have opened. Please send the email to complete your inquiry.</div>
      <div style={{ fontSize:12, color:'var(--t3)', marginBottom:28 }}>Vishal will respond within 24 hours.</div>
      <button className="btn-primary" style={{ padding:'13px 28px' }} onClick={()=>setSubmitted(false)}>Send Another</button>
    </div>
  );

  return (
    <div className="fade-up">
      <PageHeader title="Work With Me" subtitle="Custom plans crafted specifically for your body & goals" />

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:22 }} className="grid-2">
        {SERVICES.map(s=>(
          <div key={s.id} className="card" style={{ padding:20, cursor:'pointer', transition:'all .2s',
            border:`1px solid ${form.service===s.id?'var(--orange)':'var(--border)'}`,
            background:form.service===s.id?'var(--orange2)':'var(--card)' }}
            onClick={()=>setForm(p=>({...p,service:s.id}))}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--orange)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor=form.service===s.id?'var(--orange)':'var(--border)'}>
            <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:'1px', marginBottom:4 }}>{s.label}</div>
            <div className="section-title" style={{ fontSize:22, color:'var(--orange)' }}>{s.price}</div>
            {s.id==='coaching'&&<div style={{ fontSize:11, color:'var(--t3)', marginTop:4 }}>Fill the form below with your details</div>}
            {form.service===s.id&&<div style={{ marginTop:8 }}><span className="tag tag-g">Selected ✓</span></div>}
          </div>
        ))}
      </div>

      <div className="card" style={{ padding:24 }}>
        <div className="section-title" style={{ fontSize:22, marginBottom:4 }}>Get In Touch</div>
        <div className="accent-bar" />
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }} className="grid-2">
          <div><label>Full Name *</label><input placeholder="Your name" value={form.name} onChange={set('name')} /></div>
          <div><label>Email *</label><input type="email" placeholder="you@email.com" value={form.email} onChange={set('email')} /></div>
          <div><label>Phone / WhatsApp</label><input placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} /></div>
          <div><label>Your Primary Goal</label>
            <select value={form.goal} onChange={set('goal')}>
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
        <div style={{ marginTop:14 }}><label>Tell me about yourself & your goals</label>
          <textarea rows={4} placeholder={`Current weight, training experience, dietary preferences, schedule, specific focus areas...\n\n${SERVICES.find(s=>s.id===form.service)?.id==='coaching'?'For online coaching, also mention your availability for check-in calls.':''}`}
            value={form.message} onChange={set('message')} style={{ resize:'vertical' }} />
        </div>
        <button className="btn-primary" style={{ marginTop:18, padding:'14px 28px', fontSize:15 }}
          onClick={handleSubmit} disabled={!form.name||!form.email}>
          Send Inquiry →
        </button>
        <div style={{ marginTop:10, fontSize:11, color:'var(--t3)' }}>
          Clicking Send will open your email app with details pre-filled to vishalchaudhary28@gmail.com
        </div>
      </div>
    </div>
  );
};

// ─── PROFILE PAGE ────────────────────────────────────────────────────────────
const ProfilePage = ({ user, setUsers, onLogout }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({...user});
  const sf = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const save = () => {
    setUsers(p => p.map(u => u.id===user.id ? {...u,...form, weight:parseFloat(form.weight), height:parseFloat(form.height), age:parseInt(form.age), workoutDays:parseInt(form.workoutDays)} : u));
    setEditing(false);
  };

  const bmi = calcBMI(user.weight, user.height);
  const bmiCat = getBMICat(bmi);
  const bmr  = calcBMR(user.weight, user.height, user.age, user.gender);
  const tdee = calcTDEE(bmr, user.activityLevel||'moderate');

  return (
    <div className="fade-up">
      <PageHeader title="My Profile" />
      <div style={{ display:'grid', gridTemplateColumns:'260px 1fr', gap:16 }} className="grid-2">
        {/* Avatar card */}
        <div className="card" style={{ padding:24, textAlign:'center', height:'fit-content' }}>
          <div style={{ width:72, height:72, borderRadius:'50%', background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center',
            margin:'0 auto 14px', fontFamily:"'Bebas Neue',sans-serif", fontSize:28, color:'#fff', letterSpacing:'2px' }}>
            {user.avatar}
          </div>
          <div className="section-title" style={{ fontSize:20 }}>{user.name}</div>
          {user.isAdmin&&<div style={{ marginTop:6 }}><span className="tag tag-o">⚡ Admin</span></div>}
          <div style={{ fontSize:11, color:'var(--t3)', marginTop:6 }}>Member since {fmtDate(user.joinDate)}</div>
          <hr style={{ border:'none', borderTop:'1px solid var(--border)', margin:'16px 0' }} />
          <div className="section-title" style={{ fontSize:44, color:bmiCat.color }}>{bmi}</div>
          <span className={`tag ${bmiCat.tag}`}>{bmiCat.label} BMI</span>
          <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
            <div style={{ padding:'8px', background:'#111', borderRadius:8, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700 }}>BMR</div>
              <div style={{ fontSize:16, fontWeight:700, color:'var(--orange)' }}>{bmr}</div>
              <div style={{ fontSize:9, color:'var(--t3)' }}>kcal/day</div>
            </div>
            <div style={{ padding:'8px', background:'#111', borderRadius:8, border:'1px solid var(--border)' }}>
              <div style={{ fontSize:10, color:'var(--t3)', fontWeight:700 }}>TDEE</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#4CAF50' }}>{tdee}</div>
              <div style={{ fontSize:9, color:'var(--t3)' }}>kcal/day</div>
            </div>
          </div>
          <button className="btn-danger" style={{ marginTop:16, width:'100%', display:'flex', alignItems:'center', justifyContent:'center', gap:6 }} onClick={onLogout}>
            <LogOut size={13}/> Logout
          </button>
        </div>

        <div className="card" style={{ padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:18 }}>
            <div className="section-title" style={{ fontSize:20 }}>Personal Details</div>
            <button className="btn-ghost" style={{ fontSize:13 }} onClick={()=>editing?save():setEditing(true)}>
              {editing?'✓ Save':'✏️ Edit'}
            </button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {[{l:'Full Name',k:'name',t:'text'},{l:'Age',k:'age',t:'number'},{l:'Email',k:'email',t:'email'},{l:'Weight (kg)',k:'weight',t:'number'},{l:'Height (cm)',k:'height',t:'number'},{l:'Workout Days/Week',k:'workoutDays',t:'number'}].map(f=>(
              <div key={f.k}>
                <label>{f.l}</label>
                {editing
                  ? <input type={f.t} value={form[f.k]} onChange={sf(f.k)} />
                  : <div style={{ padding:'10px 14px', background:'#111', borderRadius:8, fontSize:14, border:'1px solid var(--border)' }}>{String(user[f.k])}</div>
                }
              </div>
            ))}
            <div>
              <label>Gender</label>
              {editing
                ? <select value={form.gender} onChange={sf('gender')}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                : <div style={{ padding:'10px 14px', background:'#111', borderRadius:8, fontSize:14, border:'1px solid var(--border)' }}>{user.gender}</div>
              }
            </div>
            <div>
              <label>Activity Level</label>
              {editing
                ? <select value={form.activityLevel} onChange={sf('activityLevel')}>
                    {Object.entries(ACTIVITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                : <div style={{ padding:'10px 14px', background:'#111', borderRadius:8, fontSize:13, border:'1px solid var(--border)', color:'var(--t2)' }}>{ACTIVITY[user.activityLevel||'moderate']?.label}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── NAVIGATION CONFIG ────────────────────────────────────────────────────────
const NAV = [
  { id:'dashboard', label:'Dashboard',    Icon: Activity   },
  { id:'splits',    label:'Splits',       Icon: Dumbbell   },
  { id:'workout',   label:'Tracker',      Icon: ({size})=><span style={{ fontSize:size===20?18:14 }}>🏋️</span> },
  { id:'diet',      label:'Diet',         Icon: Salad      },
  { id:'progress',  label:'Progress',     Icon: TrendingUp },
  { id:'contact',   label:'Work With Me', Icon: Mail       },
  { id:'profile',   label:'Profile',      Icon: User       },
];

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [users, setUsers]           = useState(INIT_USERS);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [page, setPage]             = useState('dashboard');
  const [splits, setSplits]         = useState(INITIAL_SPLITS);
  const [healthLogs, setHealthLogs] = useState(SAMPLE.healthLogs);
  const [workoutLogs, setWorkoutLogs]= useState(SAMPLE.workoutLogs);
  const [sidebarOpen, setSidebarOpen]= useState(true);

  const user = currentUserId ? users.find(u=>u.id===currentUserId) : null;

  const handleLogin   = u => { setCurrentUserId(u.id); setPage('dashboard'); };
  const handleLogout  = () => { setCurrentUserId(null); setPage('dashboard'); };
  const setActiveSplit= id => setUsers(p=>p.map(u=>u.id===currentUserId?{...u,activeSplitId:id}:u));

  if (!user) return (<><GlobalStyles /><AuthModal users={users} setUsers={setUsers} onLogin={handleLogin} /></>);

  const renderPage = () => {
    const props = { user, splits, setSplits, workoutLogs, setWorkoutLogs, healthLogs, setHealthLogs };
    switch(page) {
      case 'dashboard': return <DashboardPage {...props} />;
      case 'splits':    return <SplitsPage {...props} setActiveSplitId={setActiveSplit} setPage={setPage} isAdmin={user.isAdmin} />;
      case 'workout':   return <WorkoutPage {...props} />;
      case 'diet':      return <DietPage user={user} />;
      case 'progress':  return <ProgressPage {...props} />;
      case 'contact':   return <ContactPage />;
      case 'profile':   return <ProfilePage user={user} setUsers={setUsers} onLogout={handleLogout} />;
      default: return null;
    }
  };

  const MOBILE_NAV = NAV.slice(0,5); // Dashboard, Splits, Tracker, Diet, More (replaced by profile swipe)

  return (
    <>
      <GlobalStyles />
      <div style={{ display:'flex', minHeight:'100vh' }}>
        {/* Desktop Sidebar */}
        <div className="desktop-sidebar" style={{ width:sidebarOpen?230:60, background:'#0D0D0D', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', transition:'width .25s', flexShrink:0, position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>
          {/* Logo */}
          <div style={{ padding:'18px 14px', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', gap:10, cursor:'pointer' }} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <div style={{ width:32, height:32, borderRadius:8, background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, flexShrink:0 }}>💪</div>
            {sidebarOpen&&<div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:18, letterSpacing:'2px', color:'var(--orange)', whiteSpace:'nowrap' }}>FITTRACK PRO</div>}
          </div>
          {/* User mini */}
          {sidebarOpen&&(
            <div style={{ padding:'14px', borderBottom:'1px solid var(--border)', display:'flex', gap:10, alignItems:'center' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:'var(--orange)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Bebas Neue',sans-serif", fontWeight:900, color:'#fff', fontSize:13, flexShrink:0 }}>{user.avatar}</div>
              <div style={{ overflow:'hidden' }}>
                <div style={{ fontSize:13, fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user.name}</div>
                <div style={{ fontSize:10, color:'var(--t3)' }}>{user.isAdmin?'⚡ Admin':'Member'}</div>
              </div>
            </div>
          )}
          {/* Nav */}
          <nav style={{ padding:'10px 8px', flex:1, overflowY:'auto' }}>
            {NAV.map(({id,label,Icon})=>(
              <div key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>setPage(id)} title={!sidebarOpen?label:''}>
                <span style={{ flexShrink:0 }}><Icon size={17}/></span>
                {sidebarOpen&&<span>{label}</span>}
              </div>
            ))}
          </nav>
          {sidebarOpen&&<div style={{ padding:'12px 16px', borderTop:'1px solid var(--border)', fontSize:10, color:'var(--t3)' }}>
            FitTrack Pro v2.0 · Share on Instagram 📸
          </div>}
        </div>

        {/* Main */}
        <main className="main-content" style={{ flex:1, padding:'28px 28px', overflowY:'auto' }}>
          {renderPage()}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="bottom-nav">
          {[...NAV.slice(0,4), NAV[6]].map(({id,label,Icon})=>(
            <button key={id} onClick={()=>setPage(id)} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:3, background:'none', border:'none', cursor:'pointer', padding:'6px 0', color:page===id?'var(--orange)':'var(--t3)', transition:'color .15s' }}>
              <Icon size={20}/>
              <span style={{ fontSize:9, fontWeight:600, letterSpacing:'.3px', textTransform:'uppercase' }}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}