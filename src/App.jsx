import { useState, useMemo } from "react";
import { AreaChart, Area, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Activity, Dumbbell, Salad, TrendingUp, Mail, User, ChevronDown, LogOut, Eye, EyeOff, Edit2, Trash2, X, Target } from "lucide-react";

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#0E0E0E;--card:#181818;--border:#242424;
      --o:#E8540D;--o2:rgba(232,84,13,.13);--o3:rgba(232,84,13,.06);
      --text:#F0F0F0;--t2:#999;--t3:#555;
    }
    body{background:var(--bg);color:var(--text);font-family:'DM Sans',sans-serif;overflow-x:hidden}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-track{background:var(--bg)}
    ::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
    .btn-primary{background:var(--o);color:#fff;border:none;border-radius:10px;padding:12px 22px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s}
    .btn-primary:hover{background:#ff6620;transform:translateY(-1px)}
    .btn-primary:disabled{opacity:.5;cursor:not-allowed;transform:none}
    .btn-ghost{background:transparent;border:1px solid var(--border);color:var(--t2);border-radius:8px;padding:8px 16px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
    .btn-ghost:hover{border-color:var(--o);color:var(--o)}
    .btn-danger{background:transparent;border:1px solid rgba(232,84,13,.25);color:var(--o);border-radius:6px;padding:5px 10px;font-size:12px;cursor:pointer;transition:all .2s;font-family:'DM Sans',sans-serif}
    .btn-danger:hover{background:var(--o3)}
    input,select,textarea{background:#0A0A0A;border:1px solid var(--border);color:var(--text);font-family:'DM Sans',sans-serif;border-radius:8px;padding:11px 14px;font-size:14px;outline:none;width:100%;transition:border-color .2s}
    input:focus,select:focus,textarea:focus{border-color:var(--o)}
    select option{background:#181818}
    label{font-size:11px;color:var(--t3);font-weight:600;letter-spacing:.6px;text-transform:uppercase;display:block;margin-bottom:6px}
    .card{background:var(--card);border:1px solid var(--border);border-radius:14px}
    .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.93);display:flex;align-items:center;justify-content:center;z-index:1000;padding:16px}
    .modal{background:var(--card);border:1px solid var(--border);border-radius:16px;padding:24px;width:100%;max-width:500px;max-height:88vh;overflow-y:auto}
    .tag{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;background:var(--o2);color:var(--o);border:1px solid rgba(232,84,13,.25)}
    .tag-dim{background:rgba(255,255,255,.04);color:var(--t2);border:1px solid var(--border)}
    @keyframes fadeUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
    .fade-up{animation:fadeUp .28s ease forwards}
    .nav-item{display:flex;align-items:center;gap:11px;padding:10px 14px;border-radius:10px;cursor:pointer;transition:all .15s;color:var(--t2);font-size:14px;font-weight:500;white-space:nowrap}
    .nav-item:hover{background:rgba(255,255,255,.04);color:var(--text)}
    .nav-item.active{background:var(--o2);color:var(--o)}
    .bb{font-family:'Bebas Neue',sans-serif;letter-spacing:1.5px}
    .accent-bar{width:28px;height:3px;background:var(--o);border-radius:2px;margin-bottom:12px}
    .bottom-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:#131313;border-top:1px solid var(--border);padding:10px 0 calc(10px + env(safe-area-inset-bottom));z-index:100}
    @media(max-width:768px){
      .ds{display:none!important}
      .bottom-nav{display:flex!important}
      .mc{padding:16px 14px 88px!important}
      .g2{grid-template-columns:1fr!important}
      .g3{grid-template-columns:1fr!important}
      .g4{grid-template-columns:1fr 1fr!important}
      .modal{padding:16px!important}
      .pt{font-size:28px!important}
    }
    @media(min-width:769px){.bottom-nav{display:none!important}}
    .ex-row{display:grid;grid-template-columns:36px 1fr 1fr 82px;gap:7px;align-items:center}
    @media(max-width:500px){.ex-row{grid-template-columns:28px 1fr 1fr 68px;gap:5px}}
    .google-btn{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:12px;background:#fff;color:#333;border:1px solid #ddd;border-radius:10px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s}
    .google-btn:hover{background:#f5f5f5;transform:translateY(-1px)}
    .divider{display:flex;align-items:center;gap:10px;margin:14px 0;color:var(--t3);font-size:12px}
    .divider::before,.divider::after{content:'';flex:1;height:1px;background:var(--border)}
  `}</style>
);

// ─── CONSTANTS ────────────────────────────────────────────────────────────────
const O = 'var(--o)';
const genId = () => Math.random().toString(36).slice(2,9);
const today = () => new Date().toISOString().split('T')[0];
const fmt = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
const wkLbl = d => { const dt=new Date(d); return `W${Math.ceil(dt.getDate()/7)} ${dt.toLocaleDateString('en-IN',{month:'short'})}`; };
const calcBMI = (w,h) => (!w||!h) ? null : (w/((h/100)**2)).toFixed(1);
const getBMICat = b => {
  if (!b) return {label:'N/A'};
  const v=parseFloat(b);
  if(v<18.5) return {label:'Underweight'};
  if(v<25)   return {label:'Normal'};
  if(v<30)   return {label:'Overweight'};
  return {label:'Obese'};
};
const ACTIVITY = {
  sedentary:{ label:'Sedentary (desk job, no exercise)',    mult:1.2   },
  light:    { label:'Lightly Active (1–3 days/week)',       mult:1.375 },
  moderate: { label:'Moderately Active (3–5 days/week)',    mult:1.55  },
  active:   { label:'Very Active (6–7 days/week)',          mult:1.725 },
  extra:    { label:'Extremely Active (athlete / 2×/day)', mult:1.9   },
};
const calcBMR  = (w,h,age,g) => Math.round(10*w+6.25*h-5*age+(g==='male'?5:g==='female'?-161:-78));
const calcTDEE = (bmr,lvl)   => Math.round(bmr*(ACTIVITY[lvl]?.mult||1.55));
const goalCals = (tdee,goal) => goal==='loss'?tdee-500:goal==='gain'?tdee+400:tdee;
const goalProt = (w,goal)    => goal==='loss'?Math.round(w*2.2):goal==='gain'?Math.round(w*2.0):Math.round(w*1.8);
const goalFromWeight = (curr,tgt) => {
  if(!tgt) return 'maintenance';
  const diff = curr - tgt;
  if(diff > 2) return 'loss';
  if(diff < -2) return 'gain';
  return 'maintenance';
};
const getDayTag = t=>({push:'',pull:'',legs:'',upper:'',lower:'',full:'',arms:'',yoga:'',home:'',rest:'tag-dim'}[t]||'');

// ─── EXERCISE FACTORIES ───────────────────────────────────────────────────────
const mkLowerA = () => [
  {id:genId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:'Focus on depth'},
  {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
  {id:genId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:'',variants:['Seated Leg Curls','Lying Leg Curls']},
  {id:genId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},
  {id:genId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
];
const mkLowerB = () => [
  {id:genId(),name:'Leg Press',sets:4,repsRange:'8-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},
  {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
  {id:genId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:'Hip hinge'},
  {id:genId(),name:'Leg Adductor Machine',sets:3,repsRange:'15-20',muscle:'Adductors',notes:''},
  {id:genId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
];
const mkUpperA = () => [
  {id:genId(),name:'Smith Machine Incline Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Flat Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Wide Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
  {id:genId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:'Any machine'},
  {id:genId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
  {id:genId(),name:'Biceps Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
  {id:genId(),name:'Single Hand Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
];
const mkUpperB = () => [
  {id:genId(),name:'Incline Dumbbell Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
  {id:genId(),name:'Close Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
  {id:genId(),name:'T-Bar Rows',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
  {id:genId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
  {id:genId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
  {id:genId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
  {id:genId(),name:'Single Hand Overhead Cable Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
];

// ─── SPLITS ───────────────────────────────────────────────────────────────────
const INIT_SPLITS = [
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
        {id:genId(),name:'Horizontal Machine Row',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Wide Grip T-Bar Rows',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Hammer Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'ppl-la', name:'Legs Day A', type:'legs', exercises:mkLowerA() },
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
        {id:genId(),name:'Seated Cable Row (Bar)',sets:4,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Preacher Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      { id:'ppl-lb', name:'Legs Day B', type:'legs', exercises:mkLowerB() },
      { id:'ppl-r', name:'Rest Day', type:'rest', exercises:[] },
    ],
  },
  { id:'ul4', name:'Upper Lower (4 Day)', emoji:'⚡', description:'4 days — U L Rest U L Rest Rest', color:'#E8540D',
    schedule:['Upper','Lower','Rest','Upper','Lower','Rest','Rest'],
    days:[
      {id:'ul4-ua',name:'Upper A',type:'upper',exercises:mkUpperA()},
      {id:'ul4-la',name:'Lower A',type:'lower',exercises:mkLowerA()},
      {id:'ul4-r1',name:'Rest Day',type:'rest',exercises:[]},
      {id:'ul4-ub',name:'Upper B',type:'upper',exercises:mkUpperB()},
      {id:'ul4-lb',name:'Lower B',type:'lower',exercises:mkLowerB()},
      {id:'ul4-r2',name:'Rest Day',type:'rest',exercises:[]},
      {id:'ul4-r3',name:'Rest Day',type:'rest',exercises:[]},
    ],
  },
  { id:'fb3', name:'Full Body (3 Day)', emoji:'💥', description:'Full Body – Rest – Repeat', color:'#E8540D',
    schedule:['Full Body','Rest','Full Body','Rest','Full Body','Rest','Rest'],
    days:[
      { id:'fb3-a', name:'Full Body A', type:'full', exercises:[
        {id:genId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},
        {id:genId(),name:'Flat Dumbbell Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Wide Grip Lat Pulldowns',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
        {id:genId(),name:'Overhead Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Biceps Cable Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Single Hand Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      {id:'fb3-r1',name:'Rest Day',type:'rest',exercises:[]},
      { id:'fb3-b', name:'Full Body B', type:'full', exercises:[
        {id:genId(),name:'Leg Press',sets:4,repsRange:'8-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},
        {id:genId(),name:'Incline Dumbbell Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:'',variants:['Seated Leg Curls','Lying Leg Curls']},
        {id:genId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extension',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      {id:'fb3-r2',name:'Rest Day',type:'rest',exercises:[]},
      { id:'fb3-c', name:'Full Body C', type:'full', exercises:[
        {id:genId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'T-Bar Rows',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},
        {id:genId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Close Grip Lat Pulldowns',sets:2,repsRange:'12-15',muscle:'Back',notes:''},
      ]},
      {id:'fb3-r3',name:'Rest Day',type:'rest',exercises:[]},
      {id:'fb3-r4',name:'Rest Day',type:'rest',exercises:[]},
    ],
  },
  { id:'ula', name:'Upper Lower + Arms', emoji:'💪', description:'U L Rest U L Arms Rest', color:'#E8540D',
    schedule:['Upper','Lower','Rest','Upper','Lower','Arms','Rest'],
    days:[
      {id:'ula-ua',name:'Upper A',type:'upper',exercises:mkUpperA()},
      {id:'ula-la',name:'Lower A',type:'lower',exercises:mkLowerA()},
      {id:'ula-r1',name:'Rest Day',type:'rest',exercises:[]},
      {id:'ula-ub',name:'Upper B',type:'upper',exercises:mkUpperB()},
      {id:'ula-lb',name:'Lower B',type:'lower',exercises:mkLowerB()},
      { id:'ula-arms', name:'Arms Day', type:'arms', exercises:[
        {id:genId(),name:'Shoulder Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Single Hand Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extensions',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Biceps Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      {id:'ula-r2',name:'Rest Day',type:'rest',exercises:[]},
    ],
  },
  { id:'ul6', name:'Upper Lower (6 Day)', emoji:'🏆', description:'U L U L U L Rest — High Frequency', color:'#E8540D',
    schedule:['Upper','Lower','Upper','Lower','Upper','Lower','Rest'],
    days:[
      {id:'ul6-ua1',name:'Upper A',type:'upper',exercises:mkUpperA()},
      {id:'ul6-la1',name:'Lower A',type:'lower',exercises:mkLowerA()},
      {id:'ul6-ub', name:'Upper B',type:'upper',exercises:mkUpperB()},
      {id:'ul6-lb', name:'Lower B',type:'lower',exercises:mkLowerB()},
      {id:'ul6-ua2',name:'Upper A (Repeat)',type:'upper',exercises:mkUpperA()},
      {id:'ul6-la2',name:'Lower A (Repeat)',type:'lower',exercises:mkLowerA()},
      {id:'ul6-r',  name:'Rest Day',type:'rest',exercises:[]},
    ],
  },
  { id:'fb6', name:'Full Body (6 Day)', emoji:'⚔️', description:'6 days — lower volume per session', color:'#E8540D',
    schedule:['Push-FB','Pull-FB','Legs-FB','Push-FB','Pull-FB','Legs-FB','Rest'],
    days:[
      {id:'fb6-d1',name:'Day 1 — Push Focus',type:'full',exercises:[
        {id:genId(),name:'Flat Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Wide Grip Lat Pulldowns',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Squats',sets:3,repsRange:'8-10',muscle:'Quads',notes:''},
        {id:genId(),name:'Lateral Raises',sets:2,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Biceps Cable Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      {id:'fb6-d2',name:'Day 2 — Pull Focus',type:'full',exercises:[
        {id:genId(),name:'Incline Dumbbell Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Press',sets:3,repsRange:'10-12',muscle:'Quads',notes:''},
        {id:genId(),name:'Single Hand Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
        {id:genId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      {id:'fb6-d3',name:'Day 3 — Legs Focus',type:'full',exercises:[
        {id:genId(),name:'Smith Machine Incline Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'T-Bar Rows',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Romanian Deadlift',sets:3,repsRange:'10-12',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Overhead Press',sets:2,repsRange:'10-12',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Single Hand Overhead Tricep Extension',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''},
      ]},
      {id:'fb6-d4',name:'Day 4 — Push Focus',type:'full',exercises:[
        {id:genId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Close Grip Lat Pulldowns',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},
        {id:genId(),name:'Leg Curls',sets:2,repsRange:'12-15',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Rear Delt Flyes',sets:2,repsRange:'15-20',muscle:'Rear Delts',notes:''},
      ]},
      {id:'fb6-d5',name:'Day 5 — Pull Focus',type:'full',exercises:[
        {id:genId(),name:'Incline Smith Machine Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Wide Grip T-Bar Rows',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},
        {id:genId(),name:'Lateral Raises',sets:2,repsRange:'15-20',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Incline Bench Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},
      ]},
      {id:'fb6-d6',name:'Day 6 — Legs Focus',type:'full',exercises:[
        {id:genId(),name:'Flat Dumbbell Press',sets:2,repsRange:'10-12',muscle:'Chest',notes:''},
        {id:genId(),name:'Seated Cable Row (Bar)',sets:2,repsRange:'10-12',muscle:'Back',notes:''},
        {id:genId(),name:'Leg Adductor Machine',sets:3,repsRange:'15-20',muscle:'Adductors',notes:''},
        {id:genId(),name:'Leg Abductor Machine',sets:2,repsRange:'15-20',muscle:'Abductors',notes:''},
        {id:genId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''},
      ]},
      {id:'fb6-r',name:'Rest Day',type:'rest',exercises:[]},
    ],
  },
  { id:'home', name:'Home Workouts', emoji:'🏠', description:'Bodyweight + Yoga — no gym needed', color:'#E8540D',
    schedule:['Beginner','Yoga','Intermediate','Yoga','Beginner','Rest','Rest'],
    days:[
      { id:'home-beg', name:'Beginner Bodyweight', type:'home', exercises:[
        {id:genId(),name:'Push-ups',sets:3,repsRange:'max',muscle:'Chest/Triceps',notes:''},
        {id:genId(),name:'Pike Push-ups',sets:3,repsRange:'10-15',muscle:'Shoulders',notes:''},
        {id:genId(),name:'Tricep Dips (Chair)',sets:3,repsRange:'10-12',muscle:'Triceps',notes:''},
        {id:genId(),name:'Australian Pull-ups',sets:3,repsRange:'8-12',muscle:'Back/Biceps',notes:''},
        {id:genId(),name:'Bodyweight Squats',sets:3,repsRange:'20-25',muscle:'Quads',notes:''},
        {id:genId(),name:'Walking Lunges',sets:3,repsRange:'12 each',muscle:'Quads/Glutes',notes:''},
        {id:genId(),name:'Glute Bridges',sets:3,repsRange:'15-20',muscle:'Glutes',notes:''},
        {id:genId(),name:'Plank',sets:3,repsRange:'30-45s',muscle:'Core',notes:''},
        {id:genId(),name:'Mountain Climbers',sets:3,repsRange:'20 each',muscle:'Core/Cardio',notes:''},
      ]},
      { id:'home-yoga', name:'Yoga Flow', type:'yoga', exercises:[
        {id:genId(),name:'Surya Namaskar (Sun Salutation)',sets:5,repsRange:'1 round each side',muscle:'Full Body',notes:'12 poses per round'},
        {id:genId(),name:'Tadasana (Mountain Pose)',sets:1,repsRange:'5 breaths',muscle:'Posture',notes:''},
        {id:genId(),name:'Adho Mukha Svanasana (Downward Dog)',sets:3,repsRange:'5 breaths',muscle:'Hamstrings/Back',notes:''},
        {id:genId(),name:'Virabhadrasana I (Warrior I)',sets:3,repsRange:'5 breaths each side',muscle:'Hip Flexors',notes:''},
        {id:genId(),name:'Virabhadrasana II (Warrior II)',sets:3,repsRange:'5 breaths each side',muscle:'Hips/Legs',notes:''},
        {id:genId(),name:'Trikonasana (Triangle Pose)',sets:2,repsRange:'5 breaths each side',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Bhujangasana (Cobra Pose)',sets:3,repsRange:'5 breaths',muscle:'Back/Chest',notes:''},
        {id:genId(),name:'Setu Bandhasana (Bridge Pose)',sets:3,repsRange:'8-10 breaths',muscle:'Glutes/Back',notes:''},
        {id:genId(),name:'Paschimottanasana (Seated Forward Bend)',sets:2,repsRange:'10 breaths',muscle:'Hamstrings',notes:''},
        {id:genId(),name:'Ardha Matsyendrasana (Spinal Twist)',sets:2,repsRange:'5 breaths each side',muscle:'Spine',notes:''},
        {id:genId(),name:'Balasana (Child Pose)',sets:1,repsRange:'10 breaths',muscle:'Recovery',notes:''},
        {id:genId(),name:'Savasana (Corpse Pose)',sets:1,repsRange:'5 minutes',muscle:'Full Recovery',notes:''},
      ]},
      { id:'home-int', name:'Intermediate Bodyweight', type:'home', exercises:[
        {id:genId(),name:'Diamond Push-ups',sets:4,repsRange:'10-15',muscle:'Chest/Triceps',notes:''},
        {id:genId(),name:'Decline Push-ups',sets:3,repsRange:'10-15',muscle:'Upper Chest',notes:''},
        {id:genId(),name:'Pull-ups',sets:4,repsRange:'max',muscle:'Back/Biceps',notes:''},
        {id:genId(),name:'Chin-ups',sets:3,repsRange:'max',muscle:'Biceps/Back',notes:''},
        {id:genId(),name:'Bulgarian Split Squats',sets:3,repsRange:'10-12 each',muscle:'Quads/Glutes',notes:''},
        {id:genId(),name:'Jump Squats',sets:3,repsRange:'15-20',muscle:'Quads/Cardio',notes:''},
        {id:genId(),name:'Single-Leg Glute Bridges',sets:3,repsRange:'12-15 each',muscle:'Glutes',notes:''},
        {id:genId(),name:'Hollow Body Hold',sets:3,repsRange:'20-30s',muscle:'Core',notes:''},
        {id:genId(),name:'Burpees',sets:3,repsRange:'10-12',muscle:'Full Body',notes:''},
      ]},
      {id:'home-r1',name:'Rest Day',type:'rest',exercises:[]},
      {id:'home-r2',name:'Rest Day',type:'rest',exercises:[]},
    ],
  },
  { id:'pl', name:'Powerlifting', emoji:'🏋️', description:'Squat · Bench · Deadlift programming', color:'#E8540D',
    comingSoon:true, schedule:['Squat','Bench','Dead','Rest','Squat','Bench','Rest'],
    days:[{id:'pl-cs',name:'Coming Soon',type:'rest',exercises:[]}],
  },
];

// ─── DIET DATA ────────────────────────────────────────────────────────────────
// Each meal has: items (array per goal), macros (P/C/F grams), micros (key nutrients)
const mkMeal = (time, label, icon, items, macros, micros) => ({time,label,icon,items,macros,micros});

const DIET_TYPES = {
  vegan: {
    id:'vegan', label:'Vegan', icon:'🌱', color:'#E8540D',
    description:'100% plant-based — no animal products',
    proteinSources:['Tofu','Tempeh','Soya Chunks (Nutrela)','Rajma','Chana','Moong Dal','Masoor Dal','Hemp Seeds','Quinoa','Amaranth (Rajgira)','Buckwheat (Kuttu)','Pea Protein','Peanut Butter'],
    meals:[
      mkMeal('7:00 AM','Breakfast','🌅',{
        loss:   ['Overnight oats (40g) with soy milk, chia seeds & 1 tbsp hemp seeds (all 9 EAAs)','OR Besan chilla (2) with tofu scramble filling — complete protein combo','6 soaked almonds + 1 walnut','1 scoop plant protein (pea+rice blend) in water — all 9 EAAs'],
        maintain:['Overnight oats (60g) with soy milk, banana, chia seeds & hemp seeds','OR Quinoa porridge with almond milk & mixed nuts — quinoa contains all 9 EAAs','Soaked almonds (8) + 2 walnuts','1 scoop plant protein in water or plant milk'],
        gain:   ['Overnight oats (80g) with soy milk, banana, 2 tbsp peanut butter & hemp seeds','OR Quinoa upma (100g quinoa) with vegetables & tofu — double complete protein','Soaked almonds (10) + 2 walnuts + 2 dates','1 scoop plant protein in 300ml soy milk — extra calories'],
      },{p:38,c:52,f:14},['Vitamin B12 (fortified soy milk)','Iron (hemp seeds, besan)','Calcium (fortified milk, chia)','Magnesium','Omega-3 (chia, walnuts)']),
      mkMeal('10:30 AM','Mid-Morning','🍎',{
        loss:   ['1 apple or pear','Handful of roasted chana (30g)','Green tea or jeera water'],
        maintain:['1 banana or papaya bowl','Roasted chana (40g) or makhana (30g)','Coconut water'],
        gain:   ['1 banana + 1 apple','Roasted chana (50g) + 1 tbsp peanut butter','Coconut water or fresh fruit juice'],
      },{p:8,c:30,f:3},['Potassium (banana)','Vitamin C (apple/papaya)','Fibre','Phosphorus (chana)']),
      mkMeal('1:00 PM','Lunch','🍱',{
        loss:   ['Brown rice (½ cup cooked) or 1 roti','Rajma or chana masala (150g) — dal+rice = complete amino acid profile','Stir-fried green vegetables with minimal oil','Salad: cucumber, tomato, lemon + flaxseeds'],
        maintain:['Brown rice (¾ cup) or 2 rotis','Rajma or chana masala (200g) — all 9 EAAs from legume+grain combo','Mixed vegetable sabzi with olive oil','Kachumber salad + curd alternative (coconut yogurt)'],
        gain:   ['Brown rice (1 cup) + 1 roti','Rajma masala (250g) with extra rajma — protein-dense','Aloo/gobi/mixed sabzi','Large salad with olive oil dressing + 1 tbsp hemp seeds','Coconut yogurt (if available)'],
      },{p:24,c:62,f:8},['Iron (rajma, besan)','Folate (leafy veg, rajma)','Zinc (rajma, pumpkin seeds)','B vitamins (brown rice)','Fibre (rajma, veg)']),
      mkMeal('4:30 PM','Pre-Workout','⚡',{
        loss:   ['1 small banana + black coffee','5-6 soaked almonds'],
        maintain:['1 banana + 1 tbsp peanut butter','Coconut water or nimbu pani'],
        gain:   ['1 banana + 2 dates + 1 tbsp peanut butter','Energy bar or 2 tbsp trail mix','Black coffee or pre-workout'],
      },{p:5,c:28,f:6},['Potassium (banana)','Magnesium (almonds)','Natural sugars for energy','Caffeine (coffee)']),
      mkMeal('7:30 PM','Post-Workout Dinner','🍽️',{
        loss:   ['Brown rice (½ cup) or 1 roti','Tofu bhurji (120g tofu — complete protein, PDCAAS 1.0) with lots of vegetables','Palak or methi sabzi','Nimbu pani'],
        maintain:['Brown rice (¾ cup) or 2 rotis','Tofu bhurji (150g) or soya chunks curry (complete proteins)','Mixed vegetable sabzi','1 scoop plant protein post-workout within 30 min'],
        gain:   ['Brown rice (1 cup) or 2-3 rotis with ghee','Soya chunks curry (200g — complete protein) + tofu side','Palak sabzi + dal','1 scoop plant protein in 300ml soy milk post-workout'],
      },{p:32,c:56,f:10},['Leucine (soy/tofu for muscle repair)','Glutamine','Iron','Zinc (pumpkin seeds)','B12 (fortified foods)']),
      mkMeal('9:30 PM','Before Bed','🌙',{
        loss:   ['Chamomile or ashwagandha tea','10 cashews or 1 tbsp pumpkin seeds'],
        maintain:['Warm oat/almond milk with cinnamon','Mixed seeds: pumpkin + sunflower + flax (1 tbsp each)','Small handful of walnuts'],
        gain:   ['Warm soy milk (250ml) — slow casein-like digestion for overnight recovery','2 tbsp mixed seeds (pumpkin + sunflower + hemp)','Small bowl of tofu/tempeh if still short on protein'],
      },{p:12,c:14,f:9},['Tryptophan (cashews/seeds for sleep)','Magnesium (pumpkin seeds)','Zinc','Omega-3 (flax, walnuts)','Calcium (fortified milk)']),
    ],
  },
  vegetarian: {
    id:'vegetarian', label:'Vegetarian', icon:'🥛', color:'#E8540D',
    description:'Dairy included — no meat, fish or eggs',
    proteinSources:['Paneer','Greek Yogurt / Curd','Full-Fat Milk','Soya Chunks (Nutrela)','Rajma','Chana','Moong Dal','Quinoa','Hemp Seeds','Peanut Butter','Whey Protein'],
    meals:[
      mkMeal('7:00 AM','Breakfast','🌅',{
        loss:   ['Moong dal cheela (2) with low-fat curd dip — complete amino acid combo','OR Paneer bhurji (60g) with 1 toast','1 glass toned milk','1 scoop whey in water'],
        maintain:['Moong dal cheela (3) with full-fat curd dip','OR Paneer bhurji (80g) with 2 whole wheat toasts','1 glass full-fat milk','1 scoop whey with milk or water'],
        gain:   ['Quinoa upma (80g dry quinoa) with vegetables + 80g paneer cubes — double complete protein','OR Dal cheela (3-4) with full-fat curd','1 glass full-fat milk + 1 banana','1 scoop whey in full-fat milk'],
      },{p:42,c:48,f:16},['Vitamin B12 (dairy)','Calcium (paneer, milk)','Phosphorus','Vitamin D (fortified milk)','Riboflavin (dairy)']),
      mkMeal('10:30 AM','Mid-Morning','🍎',{
        loss:   ['Seasonal fruit (apple/pear/guava)','100g low-fat curd with jeera','5-6 almonds'],
        maintain:['Papaya or banana bowl','Greek yogurt (100g) + 1 tbsp hemp seeds (all 9 EAAs)','Handful of mixed nuts'],
        gain:   ['Banana + papaya','Greek yogurt (150g) with honey + hemp seeds','Handful of almonds + cashews + dates (3)'],
      },{p:14,c:26,f:6},['Probiotics (curd)','Potassium (banana)','Vitamin C (papaya/guava)','Calcium (yogurt)','Magnesium (nuts)']),
      mkMeal('1:00 PM','Lunch','🍱',{
        loss:   ['1 roti with minimal ghee','Palak paneer (70g paneer) — complete protein','Moong dal (1 bowl)','Kachumber salad + 100g curd'],
        maintain:['2 rotis with ghee','Paneer bhurji or palak paneer (100g paneer)','Dal + brown rice — together cover all 9 EAAs','Curd + kachumber salad'],
        gain:   ['3 rotis with ghee or 1.5 cups brown rice','Paneer curry (150g paneer) or soya chunks + paneer combo','Dal + sabzi','Large bowl curd + kachumber'],
      },{p:36,c:58,f:14},['Calcium (paneer, curd)','Vitamin K (palak)','Iron (palak, dal)','Folate','Probiotics (curd)','Zinc (rajma)']),
      mkMeal('4:30 PM','Pre-Workout','⚡',{
        loss:   ['100g Greek yogurt','1 fruit (apple or banana)','Black coffee'],
        maintain:['Greek yogurt (100g) with banana & honey','Black coffee or green tea'],
        gain:   ['Greek yogurt (150g) + banana + honey','1 small peanut butter sandwich on whole wheat','Pre-workout coffee'],
      },{p:16,c:32,f:5},['Probiotics (yogurt)','Potassium (banana)','Calcium','Natural energy (honey/banana)','Caffeine']),
      mkMeal('7:30 PM','Post-Workout Dinner','🍽️',{
        loss:   ['1-2 rotis','Soya chunks curry (100g dry — complete protein PDCAAS 1.0)','Stir-fried greens','Raita (100g curd)','1 scoop whey within 30 min post-workout'],
        maintain:['2 rotis or brown rice (¾ cup)','Soya chunks curry (120g) or mixed dal','Stir-fried greens (broccoli/palak/beans)','Raita','1 scoop whey post-workout'],
        gain:   ['3 rotis or brown rice (1 cup) with ghee','Paneer curry (120g) + soya chunks on side','Sabzi + dal','Large raita (150g curd)','1 scoop whey in milk post-workout'],
      },{p:44,c:54,f:12},['Leucine (whey, paneer for MPS)','Calcium','B12','Iron (greens)','Magnesium','Glutamine']),
      mkMeal('9:30 PM','Before Bed','🌙',{
        loss:   ['Warm toned milk with cinnamon','10 almonds'],
        maintain:['Warm full-fat milk with cinnamon','Handful of almonds + walnuts','1 tbsp mixed seeds'],
        gain:   ['Warm full-fat milk (300ml) with a pinch of cinnamon','Paneer cubes (50g) — casein protein for overnight recovery','2 tbsp mixed seeds + 5 cashews'],
      },{p:18,c:16,f:10},['Casein (milk/paneer — slow digesting)','Tryptophan (milk for sleep)','Calcium','Magnesium (almonds)','Zinc (seeds)']),
    ],
  },
  egg: {
    id:'egg', label:'Egg Diet', icon:'🥚', color:'#E8540D',
    description:'Eggs at every major meal + dairy — no meat or fish',
    proteinSources:['Whole Eggs','Egg Whites','Paneer','Greek Yogurt / Curd','Milk','Lentils','Chickpeas','Quinoa','Whey Protein'],
    meals:[
      mkMeal('7:00 AM','Breakfast','🌅',{
        loss:   ['3 egg whites + 1 whole egg scramble with spinach, onion & tomato (PDCAAS 1.0 — gold standard)','1 whole wheat toast','1 glass toned milk','1 scoop whey in water'],
        maintain:['4 egg whites + 1 whole egg masala omelette with vegetables','2 whole wheat toasts or 1 roti','1 glass full-fat milk','1 scoop whey in milk'],
        gain:   ['2 whole eggs + 4 egg whites scramble/bhurji with veggies & paneer cubes (20g)','2-3 whole wheat toasts or 2 rotis','1 glass full-fat milk','1 scoop whey in full-fat milk — extra protein start'],
      },{p:46,c:42,f:14},['Vitamin B12 (eggs — highest bioavailability)','Choline (egg yolk — brain health)','Vitamin D (egg yolk)','Selenium','Riboflavin','Leucine (muscle protein synthesis)']),
      mkMeal('10:30 AM','Mid-Morning','🍎',{
        loss:   ['1 apple or pear','2 boiled eggs (whites only to reduce cals)','Green tea'],
        maintain:['1 banana','2 hard boiled eggs — complete protein on the go, all 9 EAAs','100g Greek yogurt'],
        gain:   ['1 banana + dates (3)','3 hard boiled eggs','Greek yogurt (100g) with honey'],
      },{p:22,c:24,f:8},['Vitamin B12 (eggs)','Vitamin A (egg yolk)','Potassium (banana)','Calcium (yogurt)','Choline']),
      mkMeal('1:00 PM','Lunch','🍱',{
        loss:   ['1 roti or quinoa (½ cup) — quinoa has all 9 EAAs','Egg curry (2 eggs) with minimal oil','Dal (moong/masoor)','Salad + 100g curd'],
        maintain:['2 rotis or quinoa (¾ cup)','Egg curry (2-3 eggs) — complete protein','Dal + mixed vegetable sabzi','Curd + kachumber salad'],
        gain:   ['Brown rice (¾ cup) + 2 rotis','Egg curry (3-4 eggs) — complete proteins for muscle repair','Dal + sabzi','Large bowl curd','1 tbsp flaxseeds on salad'],
      },{p:40,c:56,f:14},['Vitamin D (egg yolk)','Iron (eggs, dal, leafy veg)','Folate (dal, greens)','Zinc (eggs)','Selenium','Calcium (curd)']),
      mkMeal('4:30 PM','Pre-Workout','⚡',{
        loss:   ['2 hard boiled eggs','Black coffee','1 small fruit'],
        maintain:['2 hard boiled eggs + banana — protein + carb pre-workout combo','Nimbu pani or black coffee'],
        gain:   ['3 hard boiled eggs + banana + dates','1 tbsp peanut butter on rice cake','Pre-workout coffee'],
      },{p:18,c:26,f:8},['Choline (egg yolk for focus)','Potassium (banana)','Leucine (eggs for pre-workout MPS)','Caffeine','Natural sugars']),
      mkMeal('7:30 PM','Post-Workout Dinner','🍽️',{
        loss:   ['1-2 rotis','Egg bhurji (2 eggs) with lots of vegetables — best post-workout complete protein','Dal or sabzi','Buttermilk','1 scoop whey within 30 min post-workout'],
        maintain:['2 rotis or brown rice','Egg bhurji (3 eggs) or masala omelette — all 9 EAAs for muscle repair','Dal + sabzi','Raita','1 scoop whey post-workout'],
        gain:   ['3 rotis or brown rice (1 cup) with ghee','Egg bhurji (4 eggs) with paneer cubes added','Dal + mixed sabzi','Large raita','1 scoop whey in milk — anabolic window'],
      },{p:50,c:52,f:16},['Leucine (eggs + whey — peak MPS trigger)','Glutamine','Vitamin B12','Iron','Potassium','Magnesium (recovery)']),
      mkMeal('9:30 PM','Before Bed','🌙',{
        loss:   ['Warm toned milk with cinnamon','2 egg whites (boiled) — lean protein, no extra fat'],
        maintain:['Warm full-fat milk with cinnamon','2 egg whites or 50g paneer — slow-digesting protein for overnight recovery','10 almonds'],
        gain:   ['Warm full-fat milk (300ml)','3 egg whites or 50g paneer — casein + egg whites for 8-hour recovery window','1 tbsp mixed seeds (pumpkin + sunflower)'],
      },{p:22,c:12,f:8},['Casein (milk — slow overnight protein)','Tryptophan (eggs + milk for sleep quality)','Calcium','Choline','Zinc','Vitamin B12']),
    ],
  },
  nonveg: {
    id:'nonveg', label:'Non-Veg', icon:'🍗', color:'#E8540D',
    description:'Chicken, fish, eggs + dairy — all protein sources',
    proteinSources:['Chicken Breast','Fish (Rohu, Katla, Pomfret, Tuna, Bangda)','Eggs','Paneer','Greek Yogurt','Mutton (limited — 1×/week)','Quinoa','Whey Protein'],
    meals:[
      mkMeal('7:00 AM','Breakfast','🌅',{
        loss:   ['4 egg whites + 1 whole egg scramble/omelette with spinach & tomato','1 whole wheat toast or 1 roti','1 glass toned milk','1 scoop whey in water'],
        maintain:['4 egg whites + 1 whole egg masala bhurji with vegetables — PDCAAS 1.0, all 9 EAAs','2 whole wheat toasts or 1 roti','1 glass full-fat milk + soaked almonds (6)','1 scoop whey in milk'],
        gain:   ['2 whole eggs + 5 egg whites scramble + 30g paneer cubes','2-3 whole wheat toasts or 2 rotis with ghee','1 glass full-fat milk + banana','1 scoop whey in full-fat milk'],
      },{p:52,c:40,f:16},['Vitamin B12 (eggs — highest bioavailability)','Choline (egg yolk)','Vitamin D','Calcium (milk)','Selenium','Leucine (peak MPS trigger)']),
      mkMeal('10:30 AM','Mid-Morning','🍎',{
        loss:   ['1 apple or pear','100g low-fat curd','5-6 almonds'],
        maintain:['1 fruit (banana/apple/papaya)','100g Greek yogurt + 1 tbsp hemp seeds — all 9 EAAs','Handful of mixed nuts'],
        gain:   ['1 banana + papaya bowl','Greek yogurt (150g) with honey + hemp seeds','Handful of almonds + cashews + dates (3)'],
      },{p:14,c:28,f:7},['Potassium (banana)','Vitamin C (papaya)','Probiotics (curd/yogurt)','Calcium','Magnesium (nuts)','Omega-3 (hemp seeds)']),
      mkMeal('1:00 PM','Lunch','🍱',{
        loss:   ['Brown rice (½ cup) or 1-2 rotis','Chicken curry (120g) or fish curry (120g) — complete protein','Dal (1 bowl)','Salad + 100g curd'],
        maintain:['Brown rice (¾ cup) or 2 rotis','Chicken curry (150g) or fish curry (150g) — all animal proteins are complete','Dal + mixed vegetable sabzi','Salad + curd'],
        gain:   ['Brown rice (1 cup) or 3 rotis + quinoa side — quinoa has all 9 EAAs','Chicken curry (200g) or fish curry (200g)','Dal + aloo/mixed sabzi','Large bowl curd + salad with flaxseeds'],
      },{p:48,c:58,f:14},['Niacin (chicken — energy metabolism)','Omega-3 (fish — anti-inflammatory)','Iron','Zinc (chicken, fish)','Vitamin B6','Folate (dal, greens)','Selenium']),
      mkMeal('4:30 PM','Pre-Workout','⚡',{
        loss:   ['1 banana + 2 boiled eggs','Black coffee'],
        maintain:['1 banana + 1 tbsp peanut butter','Black coffee or nimbu pani','2 boiled eggs for extra protein on heavy training days'],
        gain:   ['1 banana + 2-3 dates + 2 boiled eggs','1 tbsp peanut butter on whole wheat toast','Pre-workout coffee'],
      },{p:22,c:30,f:10},['Leucine (eggs — triggers MPS)','Potassium (banana)','Choline','Caffeine (coffee)','Natural sugars for energy','Phosphorus']),
      mkMeal('7:30 PM','Post-Workout Dinner','🍽️',{
        loss:   ['1-2 rotis','Grilled chicken (150g) or fish (150g) — lean complete protein for muscle repair','Stir-fried vegetables with minimal oil','Buttermilk','1 scoop whey within 30 min post-workout'],
        maintain:['2 rotis or brown rice (¾ cup)','Grilled chicken (200g) or fish (200g) — complete protein, all 9 EAAs','Stir-fried vegetables with olive oil','Buttermilk or nimbu pani','1 scoop whey post-workout in water'],
        gain:   ['3 rotis or brown rice (1 cup) with ghee','Grilled chicken (250g) or fish (250g) + 2 boiled eggs','Mixed vegetable sabzi','Buttermilk (large glass)','1 scoop whey in milk — anabolic window'],
      },{p:58,c:54,f:14},['Leucine (chicken + whey — maximum MPS)','Creatine (meat/fish)','Omega-3 (fish — reduces DOMS)','Glutamine','Taurine','Iron','Vitamin B12','Zinc']),
      mkMeal('9:30 PM','Before Bed','🌙',{
        loss:   ['Warm toned milk with cinnamon','2 egg whites or 50g paneer'],
        maintain:['Warm full-fat milk with cinnamon','Cottage cheese/paneer (50g) or 2 egg whites — slow-digesting for overnight MPS','10 almonds'],
        gain:   ['Warm full-fat milk (300ml)','Paneer (80g) or 3 egg whites — casein + egg whites for 8-hour recovery','1 tbsp mixed seeds + 5 cashews'],
      },{p:26,c:14,f:10},['Casein (milk, paneer — slow-release overnight protein)','Tryptophan (milk for sleep quality)','Calcium','IGF-1 support (dairy)','Zinc','Vitamin B12','Magnesium']),
    ],
  },
};

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const genSample = () => {
  const hl=[], wl=[];
  const now = new Date();
  for(let i=55;i>=0;i--){
    const d=new Date(now); d.setDate(d.getDate()-i);
    const w=+(88-(55-i)*0.09+(Math.random()-.5)*.8).toFixed(1);
    if(i%2===0||i<7) hl.push({id:genId(),userId:'vishal',date:d.toISOString().split('T')[0],weight:w,notes:''});
  }
  const bw=[60,62.5,65,67.5,70,72.5,75,77.5,80,82.5];
  for(let w=0;w<10;w++){
    const d=new Date(now); d.setDate(d.getDate()-(70-w*7));
    wl.push({id:genId(),userId:'vishal',splitId:'ppl',dayId:'ppl-pa',dayName:'Push Day A',
      date:d.toISOString().split('T')[0],
      exercises:[
        {name:'Flat Dumbbell Press',sets:[{reps:12,weight:bw[w]},{reps:11,weight:bw[w]},{reps:10,weight:bw[w]},{reps:9,weight:bw[w]}]},
        {name:'Overhead Press',sets:[{reps:10,weight:40+w*2.5},{reps:9,weight:40+w*2.5},{reps:8,weight:40+w*2.5}]}
      ]});
  }
  return {hl,wl};
};
const SAMPLE = genSample();
const INIT_USERS = [{
  id:'vishal',name:'Vishal Chaudhary',email:'vishal@fittrack.com',password:'admin123',
  age:32,gender:'male',weight:83.5,height:175,weightGoal:78,
  activityLevel:'active',workoutDays:6,isAdmin:true,activeSplitId:'ppl',
  joinDate:'2024-01-15',bio:'Fitness creator 💪',avatar:'VC'
}];

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const MetricCard = ({label,value,unit,icon,sub,trend,small,onClick}) => (
  <div className="card" style={{padding:small?'14px 16px':'18px 20px',position:'relative',overflow:'hidden',cursor:onClick?'pointer':'default'}} onClick={onClick}>
    <div style={{position:'absolute',top:0,right:0,width:50,height:50,borderRadius:'0 14px 0 50px',background:'var(--o3)'}}/>
    <div style={{fontSize:small?16:20,marginBottom:4}}>{icon}</div>
    <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',marginBottom:3}}>{label}</div>
    <div className="bb" style={{fontSize:small?26:36,color:O,lineHeight:1}}>
      {value}<span style={{fontSize:small?12:15,fontWeight:400,color:'var(--t2)',marginLeft:2}}>{unit}</span>
    </div>
    {sub&&<div style={{fontSize:11,color:'var(--t2)',marginTop:3}}>{sub}</div>}
    {trend!==undefined&&<div style={{fontSize:11,marginTop:3,color:trend>0?'#ff8866':'#88cc88'}}>{trend>0?'▲':'▼'} {Math.abs(trend)} kg</div>}
  </div>
);
const PH = ({title,subtitle,action}) => (
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22}}>
    <div>
      <div className="bb pt" style={{fontSize:34,color:'var(--text)'}}>{title}</div>
      <div className="accent-bar"/>
      {subtitle&&<div style={{fontSize:13,color:'var(--t2)'}}>{subtitle}</div>}
    </div>
    {action}
  </div>
);

// ─── AUTH MODAL ───────────────────────────────────────────────────────────────
const AuthModal = ({users,setUsers,onLogin}) => {
  const [mode,setMode] = useState('login');
  const [form,setForm] = useState({name:'',email:'',password:'',age:'',gender:'male',weight:'',height:'',activityLevel:'moderate',workoutDays:'4'});
  const [err,setErr] = useState('');
  const [showPw,setShowPw] = useState(false);
  const [googleMsg,setGoogleMsg] = useState('');
  const sf = k => e => setForm(p=>({...p,[k]:e.target.value}));

  const handleLogin = () => {
    const u=users.find(u=>u.email===form.email&&u.password===form.password);
    u?onLogin(u):setErr('Invalid email or password');
  };
  const handleRegister = () => {
    if(!form.name||!form.email||!form.password) return setErr('Fill all required fields');
    if(users.find(u=>u.email===form.email)) return setErr('Email already registered');
    const u={id:genId(),name:form.name,email:form.email,password:form.password,
      age:parseInt(form.age)||25,gender:form.gender,weight:parseFloat(form.weight)||70,
      height:parseFloat(form.height)||170,weightGoal:null,activityLevel:form.activityLevel||'moderate',
      workoutDays:parseInt(form.workoutDays)||4,isAdmin:false,activeSplitId:'ppl',
      joinDate:today(),bio:'',avatar:form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)};
    setUsers(p=>[...p,u]); onLogin(u);
  };
  const handleGoogle = () => {
    setGoogleMsg('Google Sign-In needs a Google Client ID. Ask your developer to add VITE_GOOGLE_CLIENT_ID to enable this. For now, use email login.');
    setTimeout(()=>setGoogleMsg(''),5000);
  };

  return (
    <div className="modal-overlay" style={{background:'radial-gradient(ellipse at 60% 80%,rgba(232,84,13,.15) 0%,rgba(0,0,0,.98) 70%)'}}>
      <div style={{width:'100%',maxWidth:420}}>
        <div style={{textAlign:'center',marginBottom:22}}>
          <div style={{width:52,height:52,borderRadius:13,background:'var(--o)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px',fontSize:24}}>💪</div>
          <div className="bb" style={{fontSize:30,color:'var(--text)'}}>FITTRACK PRO</div>
          <div style={{fontSize:12,color:'var(--t3)',marginTop:2}}>by Vishal Chaudhary</div>
        </div>
        <div className="modal" style={{maxHeight:'82vh'}}>
          <div style={{display:'flex',background:'#0A0A0A',borderRadius:10,padding:3,marginBottom:18}}>
            {['login','register'].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr('');}} style={{
                flex:1,padding:'9px 0',borderRadius:8,border:'none',cursor:'pointer',
                background:mode===m?'var(--o)':'transparent',color:mode===m?'#fff':'var(--t2)',
                fontFamily:"'DM Sans',sans-serif",fontWeight:600,fontSize:14,transition:'all .2s'
              }}>{m==='login'?'Log In':'Register'}</button>
            ))}
          </div>

          {/* Google Sign In */}
          <button className="google-btn" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          {googleMsg&&<div style={{fontSize:11,color:'var(--o)',background:'var(--o3)',padding:'8px 12px',borderRadius:8,marginTop:8,border:'1px solid rgba(232,84,13,.2)'}}>{googleMsg}</div>}
          <div className="divider">or</div>

          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {mode==='register'&&<div><label>Full Name *</label><input placeholder="Vishal Chaudhary" value={form.name} onChange={sf('name')}/></div>}
            <div><label>Email *</label><input type="email" placeholder="you@email.com" value={form.email} onChange={sf('email')}/></div>
            <div><label>Password *</label>
              <div style={{position:'relative'}}>
                <input type={showPw?'text':'password'} placeholder="••••••••" value={form.password} onChange={sf('password')}/>
                <button onClick={()=>setShowPw(!showPw)} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--t3)',cursor:'pointer'}}>
                  {showPw?<EyeOff size={14}/>:<Eye size={14}/>}
                </button>
              </div>
            </div>
            {mode==='register'&&(<>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label>Age</label><input type="number" placeholder="25" value={form.age} onChange={sf('age')}/></div>
                <div><label>Gender</label>
                  <select value={form.gender} onChange={sf('gender')}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label>Weight (kg)</label><input type="number" placeholder="70" value={form.weight} onChange={sf('weight')}/></div>
                <div><label>Height (cm)</label><input type="number" placeholder="170" value={form.height} onChange={sf('height')}/></div>
              </div>
              <div><label>Activity Level</label>
                <select value={form.activityLevel} onChange={sf('activityLevel')}>
                  {Object.entries(ACTIVITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
              <div><label>Workout Days/Week</label>
                <select value={form.workoutDays} onChange={sf('workoutDays')}>
                  {[1,2,3,4,5,6,7].map(d=><option key={d} value={d}>{d} day{d>1?'s':''}/week</option>)}
                </select>
              </div>
            </>)}
            {err&&<div style={{color:'var(--o)',fontSize:12,background:'var(--o3)',padding:'9px 12px',borderRadius:8,border:'1px solid rgba(232,84,13,.2)'}}>{err}</div>}
            <button className="btn-primary" style={{width:'100%',padding:'13px',fontSize:15,marginTop:2}} onClick={mode==='login'?handleLogin:handleRegister}>
              {mode==='login'?'Log In →':'Create Account →'}
            </button>
            {mode==='login'&&<div style={{fontSize:11,color:'var(--t3)',textAlign:'center',padding:'7px',background:'#0A0A0A',borderRadius:8}}>
              Demo: <strong style={{color:'var(--o)'}}>vishal@fittrack.com</strong> / <strong style={{color:'var(--o)'}}>admin123</strong>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const DashboardPage = ({user,healthLogs,workoutLogs,splits,setHealthLogs,setUsers}) => {
  const [showLog,setShowLog]  = useState(false);
  const [showGoal,setShowGoal]= useState(false);
  const [logForm,setLogForm]  = useState({weight:String(user.weight),notes:''});
  const [goalVal,setGoalVal]  = useState(String(user.weightGoal||''));

  const bmi=calcBMI(user.weight,user.height);
  const bmiCat=getBMICat(bmi);
  const activeSplit=splits.find(s=>s.id===user.activeSplitId);

  const wkData=useMemo(()=>{
    const sorted=[...healthLogs].filter(l=>l.userId===user.id).sort((a,b)=>new Date(a.date)-new Date(b.date));
    const bw={};
    sorted.forEach(l=>{const wk=wkLbl(l.date);if(!bw[wk])bw[wk]=[];bw[wk].push(l.weight);});
    return Object.entries(bw).map(([week,ws])=>({week,weight:+(ws.reduce((a,b)=>a+b,0)/ws.length).toFixed(1)}));
  },[healthLogs,user.id]);

  const userWo=workoutLogs.filter(l=>l.userId===user.id||l.userId==='vishal');
  const recent=[...userWo].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
  const thisWk=userWo.filter(l=>(new Date()-new Date(l.date))/86400000<=7).length;
  const trend=wkData.length>=2?+(wkData[wkData.length-1].weight-wkData[wkData.length-2].weight).toFixed(1):undefined;

  const saveWeight = () => {
    const w = parseFloat(logForm.weight);
    if(!w||isNaN(w)) return;
    const entry = {id:genId(),userId:user.id,date:today(),weight:w,notes:logForm.notes};
    setHealthLogs(p=>[...p,entry]);
    setLogForm({weight:String(user.weight),notes:''});
    setShowLog(false);
  };
  const saveGoal = () => {
    const g=parseFloat(goalVal);
    setUsers(p=>p.map(u=>u.id===user.id?{...u,weightGoal:isNaN(g)?null:g}:u));
    setShowGoal(false);
  };

  const toGoal = user.weightGoal ? +(user.weight - user.weightGoal).toFixed(1) : null;

  return (
    <div className="fade-up">
      <PH title={`Hey, ${user.name.split(' ')[0]} 👋`}
        subtitle={new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        action={<button className="btn-primary" onClick={()=>setShowLog(true)}>+ Log Weight</button>}
      />

      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',gap:12,marginBottom:18}}>
        <MetricCard label="Current Weight" value={user.weight} unit="kg" icon="⚖️" trend={trend}/>
        <MetricCard label="BMI" value={bmi||'—'} unit="" icon="📊" sub={bmiCat.label}/>
        <MetricCard label="Height" value={user.height} unit="cm" icon="📏"/>
        <MetricCard label="Weight Goal" value={user.weightGoal||'—'} unit={user.weightGoal?'kg':''} icon="🎯"
          sub={toGoal!==null?(toGoal>0?`${toGoal}kg to lose`:`${Math.abs(toGoal)}kg to gain`):'Set your goal'}
          onClick={()=>setShowGoal(true)}/>
        <MetricCard label="This Week" value={thisWk} unit="" icon="🔥" sub="sessions" small/>
        <MetricCard label="All Time" value={userWo.length} unit="" icon="🏆" sub="sessions" small/>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:16,marginBottom:16}} className="g2">
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',marginBottom:14}}>Weight Trend</div>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={wkData}>
              <defs><linearGradient id="og" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E8540D" stopOpacity={.18}/><stop offset="95%" stopColor="#E8540D" stopOpacity={0}/>
              </linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/>
              <XAxis dataKey="week" tick={{fill:'#555',fontSize:10}}/>
              <YAxis domain={['auto','auto']} tick={{fill:'#555',fontSize:10}}/>
              <Tooltip contentStyle={{background:'#181818',border:'1px solid #242424',borderRadius:8,fontSize:12}}/>
              <Area type="monotone" dataKey="weight" stroke="#E8540D" strokeWidth={2} fill="url(#og)" dot={{fill:'#E8540D',r:3}} name="Weight (kg)"/>
              {user.weightGoal&&<Line type="monotone" dataKey={()=>user.weightGoal} stroke="#E8540D" strokeDasharray="5 5" strokeWidth={1} dot={false} name="Goal"/>}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:20,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:14}}>BMI Status</div>
          <div className="bb" style={{fontSize:62,color:O,lineHeight:1}}>{bmi||'—'}</div>
          <span className="tag" style={{marginTop:8,fontSize:12}}>{bmiCat.label}</span>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:14,width:'100%'}}>
            {[{l:'Under',r:'<18.5'},{l:'Normal',r:'18.5–25'},{l:'Over',r:'25–30'},{l:'Obese',r:'>30'}].map(s=>(
              <div key={s.l} style={{textAlign:'center',padding:'6px',borderRadius:8,
                background:bmiCat.label.startsWith(s.l)?'var(--o2)':'#111',
                border:`1px solid ${bmiCat.label.startsWith(s.l)?'rgba(232,84,13,.4)':'var(--border)'}`}}>
                <div style={{fontSize:10,color:bmiCat.label.startsWith(s.l)?'var(--o)':'var(--t3)',fontWeight:700}}>{s.l}</div>
                <div style={{fontSize:9,color:'var(--t3)'}}>{s.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:16}} className="g2">
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:12}}>Active Split</div>
          {activeSplit?<>
            <div style={{fontSize:26,marginBottom:6}}>{activeSplit.emoji}</div>
            <div className="bb" style={{fontSize:20,color:O}}>{activeSplit.name}</div>
            <div style={{fontSize:12,color:'var(--t2)',margin:'4px 0 12px'}}>{activeSplit.description}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:5}}>
              {activeSplit.schedule.map((d,i)=>(
                <div key={i} style={{padding:'3px 9px',borderRadius:6,fontSize:10,fontWeight:600,
                  background:d==='Rest'?'#111':'var(--o2)',color:d==='Rest'?'var(--t3)':'var(--o)',
                  border:`1px solid ${d==='Rest'?'var(--border)':'rgba(232,84,13,.3)'}`}}>D{i+1}: {d}</div>
              ))}
            </div>
          </>:<div style={{color:'var(--t2)',fontSize:13}}>No split active</div>}
        </div>
        <div className="card" style={{padding:20}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:12}}>Recent Sessions</div>
          {recent.length===0
            ?<div style={{color:'var(--t3)',fontSize:13}}>No sessions yet — go crush it! 💪</div>
            :recent.map(w=>(
              <div key={w.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0',borderBottom:'1px solid var(--border)'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{w.dayName}</div>
                  <div style={{fontSize:11,color:'var(--t2)',marginTop:2}}>{fmt(w.date)} · {w.exercises?.length||0} exercises</div>
                </div>
                <span className="tag" style={{fontSize:9}}>Done ✓</span>
              </div>
            ))
          }
        </div>
      </div>

      {/* Log Weight Modal */}
      {showLog&&(
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:360}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}>
              <div className="bb" style={{fontSize:22}}>Log Today's Weight</div>
              <button className="btn-ghost" onClick={()=>setShowLog(false)} style={{padding:'5px 9px'}}><X size={14}/></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              <div><label>Weight (kg) *</label>
                <input type="number" step=".1" value={logForm.weight} onChange={e=>setLogForm(p=>({...p,weight:e.target.value}))}/>
              </div>
              <div><label>Notes (optional)</label>
                <input placeholder="Post-morning, post-workout..." value={logForm.notes} onChange={e=>setLogForm(p=>({...p,notes:e.target.value}))}/>
              </div>
              <button className="btn-primary" style={{width:'100%',padding:'13px'}} onClick={saveWeight}>Save Log</button>
            </div>
          </div>
        </div>
      )}

      {/* Set Goal Modal */}
      {showGoal&&(
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:360}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}>
              <div className="bb" style={{fontSize:22}}>Set Weight Goal</div>
              <button className="btn-ghost" onClick={()=>setShowGoal(false)} style={{padding:'5px 9px'}}><X size={14}/></button>
            </div>
            <div style={{fontSize:12,color:'var(--t2)',marginBottom:14}}>
              Current weight: <strong style={{color:O}}>{user.weight} kg</strong>. Your goal will auto-suggest a diet plan on the Diet page.
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:13}}>
              <div><label>Target Weight (kg)</label>
                <input type="number" step=".5" placeholder="e.g. 78" value={goalVal} onChange={e=>setGoalVal(e.target.value)}/>
              </div>
              {goalVal&&!isNaN(parseFloat(goalVal))&&(
                <div style={{padding:'10px 14px',background:'var(--o3)',borderRadius:8,border:'1px solid rgba(232,84,13,.2)',fontSize:12,color:O}}>
                  {parseFloat(goalVal)<user.weight
                    ?`To lose ${(user.weight-parseFloat(goalVal)).toFixed(1)} kg — diet page will suggest weight loss plan`
                    :parseFloat(goalVal)>user.weight
                    ?`To gain ${(parseFloat(goalVal)-user.weight).toFixed(1)} kg — diet page will suggest weight gain plan`
                    :'Same as current weight — diet page will suggest maintenance'}
                </div>
              )}
              <button className="btn-primary" style={{width:'100%',padding:'13px'}} onClick={saveGoal}>Set Goal</button>
              {user.weightGoal&&<button className="btn-ghost" style={{width:'100%'}} onClick={()=>{setGoalVal('');setUsers(p=>p.map(u=>u.id===user.id?{...u,weightGoal:null}:u));setShowGoal(false);}}>Clear Goal</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SPLITS PAGE ─────────────────────────────────────────────────────────────
const SplitsPage=({user,splits,setSplits,setActiveSplitId,setPage,isAdmin})=>{
  const [exp,setExp]=useState(null);
  const [expDay,setExpDay]=useState(null);
  const [editEx,setEditEx]=useState(null);
  const [showAddEx,setShowAddEx]=useState(null);
  const [newEx,setNewEx]=useState({name:'',sets:3,repsRange:'8-12',muscle:'',notes:''});
  const [showAddSplit,setShowAddSplit]=useState(false);
  const [ns,setNs]=useState({name:'',emoji:'💪',description:'',color:'#E8540D'});

  const pick=(sid)=>{
    if(splits.find(s=>s.id===sid)?.comingSoon) return;
    setActiveSplitId(sid); setTimeout(()=>setPage('workout'),300);
  };
  const updEx=(sId,dId,eId,data)=>setSplits(p=>p.map(s=>s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:d.exercises.map(e=>e.id!==eId?e:{...e,...data})})}));
  const delEx=(sId,dId,eId)=>setSplits(p=>p.map(s=>s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:d.exercises.filter(e=>e.id!==eId)})}));
  const addEx=(sId,dId)=>{
    const e={id:genId(),...newEx,sets:parseInt(newEx.sets)};
    setSplits(p=>p.map(s=>s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:[...d.exercises,e]})}));
    setNewEx({name:'',sets:3,repsRange:'8-12',muscle:'',notes:''}); setShowAddEx(null);
  };
  const addSplit=()=>{
    const s={id:genId(),...ns,schedule:['Day 1','Rest'],days:[{id:genId(),name:'Day 1',type:'custom',exercises:[]},{id:genId(),name:'Rest',type:'rest',exercises:[]}]};
    setSplits(p=>[...p,s]); setNs({name:'',emoji:'💪',description:'',color:'#E8540D'}); setShowAddSplit(false);
  };

  return (
    <div className="fade-up">
      <PH title="Choose Your Split" subtitle="Select a program — redirects to tracker automatically"
        action={isAdmin&&<button className="btn-primary" onClick={()=>setShowAddSplit(true)}>+ New Split</button>}
      />
      {splits.map(split=>(
        <div key={split.id} className="card" style={{marginBottom:12,overflow:'hidden'}}>
          <div style={{padding:'16px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:12,alignItems:'center',flex:1,cursor:'pointer'}} onClick={()=>setExp(exp===split.id?null:split.id)}>
              <div style={{fontSize:24}}>{split.emoji}</div>
              <div>
                <div className="bb" style={{fontSize:18,color:O}}>{split.name}</div>
                <div style={{fontSize:12,color:'var(--t2)'}}>{split.description}</div>
              </div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {split.comingSoon?<span className="tag tag-dim">Coming Soon</span>
                :user.activeSplitId===split.id
                  ?<span className="tag">✓ Active</span>
                  :<button className="btn-primary" style={{padding:'7px 14px',fontSize:13}} onClick={()=>pick(split.id)}>Select →</button>
              }
              <ChevronDown size={14} color="var(--t3)" style={{transform:exp===split.id?'rotate(180deg)':'',transition:'.2s',cursor:'pointer'}} onClick={()=>setExp(exp===split.id?null:split.id)}/>
            </div>
          </div>

          {exp===split.id&&!split.comingSoon&&(
            <div style={{borderTop:'1px solid var(--border)',padding:'14px 18px 18px'}}>
              <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:12}}>
                {split.schedule.map((d,i)=>(
                  <div key={i} style={{padding:'3px 8px',borderRadius:6,fontSize:10,fontWeight:700,
                    background:d==='Rest'?'#111':'var(--o2)',color:d==='Rest'?'var(--t3)':'var(--o)',
                    border:`1px solid ${d==='Rest'?'var(--border)':'rgba(232,84,13,.25)'}`}}>D{i+1}: {d}</div>
                ))}
              </div>
              {split.days.filter(d=>d.type!=='rest').map(day=>(
                <div key={day.id} style={{background:'#111',borderRadius:10,marginBottom:8,overflow:'hidden'}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',cursor:'pointer'}} onClick={()=>setExpDay(expDay===day.id?null:day.id)}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span className={`tag ${getDayTag(day.type)}`}>{day.type}</span>
                      <span style={{fontWeight:600,fontSize:14}}>{day.name}</span>
                      <span style={{fontSize:11,color:'var(--t3)'}}>{day.exercises.length} exercises</span>
                    </div>
                    <ChevronDown size={13} color="var(--t3)" style={{transform:expDay===day.id?'rotate(180deg)':'',transition:'.2s'}}/>
                  </div>
                  {expDay===day.id&&(
                    <div style={{padding:'0 14px 14px'}}>
                      {day.exercises.map(ex=>(
                        <div key={ex.id} style={{padding:'8px 0',borderBottom:'1px solid #1A1A1A'}}>
                          {editEx===ex.id&&isAdmin?(
                            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:6}}>
                              <input value={ex.name} onChange={e=>updEx(split.id,day.id,ex.id,{name:e.target.value})} style={{fontSize:12,padding:'6px 10px'}}/>
                              <input type="number" value={ex.sets} onChange={e=>updEx(split.id,day.id,ex.id,{sets:parseInt(e.target.value)})} style={{fontSize:12,padding:'6px 10px'}}/>
                              <input value={ex.repsRange} onChange={e=>updEx(split.id,day.id,ex.id,{repsRange:e.target.value})} style={{fontSize:12,padding:'6px 10px'}}/>
                              <input value={ex.muscle} onChange={e=>updEx(split.id,day.id,ex.id,{muscle:e.target.value})} style={{fontSize:12,padding:'6px 10px'}}/>
                            </div>
                          ):(
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div>
                                <span style={{fontWeight:500,fontSize:13}}>{ex.name}</span>
                                {ex.variants&&<span style={{fontSize:11,color:'var(--t3)',marginLeft:6}}>(variants)</span>}
                                <span style={{fontSize:12,color:'var(--t2)',marginLeft:8}}>{ex.sets}×{ex.repsRange}</span>
                                {ex.muscle&&<span style={{fontSize:11,color:O,marginLeft:8}}>{ex.muscle}</span>}
                              </div>
                              {isAdmin&&<div style={{display:'flex',gap:5}}>
                                <button className="btn-ghost" style={{padding:'3px 7px',fontSize:11}} onClick={()=>setEditEx(editEx===ex.id?null:ex.id)}>{editEx===ex.id?'✓':<Edit2 size={11}/>}</button>
                                <button className="btn-danger" style={{padding:'3px 7px'}} onClick={()=>delEx(split.id,day.id,ex.id)}><Trash2 size={11}/></button>
                              </div>}
                            </div>
                          )}
                        </div>
                      ))}
                      {isAdmin&&(showAddEx===day.id?(
                        <div style={{marginTop:10,display:'grid',gap:8}}>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:8}}>
                            <input placeholder="Exercise name" value={newEx.name} onChange={e=>setNewEx(p=>({...p,name:e.target.value}))} style={{fontSize:13,padding:'7px 10px'}}/>
                            <input type="number" placeholder="Sets" value={newEx.sets} onChange={e=>setNewEx(p=>({...p,sets:e.target.value}))} style={{fontSize:13,padding:'7px 10px'}}/>
                            <input placeholder="8-12" value={newEx.repsRange} onChange={e=>setNewEx(p=>({...p,repsRange:e.target.value}))} style={{fontSize:13,padding:'7px 10px'}}/>
                          </div>
                          <input placeholder="Muscle group" value={newEx.muscle} onChange={e=>setNewEx(p=>({...p,muscle:e.target.value}))} style={{fontSize:13,padding:'7px 10px'}}/>
                          <div style={{display:'flex',gap:8}}>
                            <button className="btn-primary" style={{padding:'8px 16px',fontSize:13}} onClick={()=>addEx(split.id,day.id)}>Add</button>
                            <button className="btn-ghost" style={{fontSize:13}} onClick={()=>setShowAddEx(null)}>Cancel</button>
                          </div>
                        </div>
                      ):<button className="btn-ghost" style={{marginTop:8,width:'100%',fontSize:12}} onClick={()=>setShowAddEx(day.id)}>+ Add Exercise</button>)}
                    </div>
                  )}
                </div>
              ))}
              {user.activeSplitId!==split.id&&(
                <button className="btn-primary" style={{width:'100%',marginTop:10,padding:'12px'}} onClick={()=>pick(split.id)}>
                  Select This Split & Start Tracking →
                </button>
              )}
            </div>
          )}
          {exp===split.id&&split.comingSoon&&(
            <div style={{borderTop:'1px solid var(--border)',padding:36,textAlign:'center'}}>
              <div style={{fontSize:36,marginBottom:10}}>🏋️</div>
              <div className="bb" style={{fontSize:22,color:O}}>Coming Soon</div>
              <div style={{color:'var(--t2)',fontSize:13,marginTop:6}}>Powerlifting programming in development. Stay tuned!</div>
            </div>
          )}
        </div>
      ))}
      {showAddSplit&&(
        <div className="modal-overlay">
          <div className="modal" style={{maxWidth:420}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}>
              <div className="bb" style={{fontSize:22}}>New Custom Split</div>
              <button className="btn-ghost" style={{padding:'5px 9px'}} onClick={()=>setShowAddSplit(false)}><X size={14}/></button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              <div><label>Name</label><input placeholder="e.g. Bro Split" value={ns.name} onChange={e=>setNs(p=>({...p,name:e.target.value}))}/></div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label>Emoji</label><input value={ns.emoji} onChange={e=>setNs(p=>({...p,emoji:e.target.value}))}/></div>
                <div><label>Color</label><input type="color" value={ns.color} onChange={e=>setNs(p=>({...p,color:e.target.value}))}/></div>
              </div>
              <div><label>Description</label><input placeholder="5 days/week..." value={ns.description} onChange={e=>setNs(p=>({...p,description:e.target.value}))}/></div>
              <button className="btn-primary" style={{width:'100%',padding:'12px'}} onClick={addSplit}>Create Split</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────
const WorkoutPage=({user,splits,workoutLogs,setWorkoutLogs})=>{
  const activeSplit=splits.find(s=>s.id===user.activeSplitId)||splits[0];
  const [session,setSession]=useState(null);
  const [done,setDone]=useState(false);
  const workoutDays=activeSplit?.days.filter(d=>d.type!=='rest')||[];

  const startSession=day=>{
    const exercises=day.exercises.map(ex=>{
      const prev=workoutLogs.filter(l=>(l.userId===user.id||l.userId==='vishal')&&l.dayId===day.id)
        .sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
      const pe=prev?.exercises?.find(e=>e.name===ex.name);
      return {...ex,selectedVariant:ex.variants?ex.variants[0]:null,
        sets:Array.from({length:ex.sets},(_,i)=>{const ps=pe?.sets?.[i];return{reps:ps?.reps||ex.repsRange?.split('-')[0]||8,weight:ps?.weight||0,done:false};})
      };
    });
    setSession({day,exercises,notes:''}); setDone(false);
  };
  const updSet=(ei,si,f,v)=>setSession(p=>{const exs=[...p.exercises];const sets=[...exs[ei].sets];sets[si]={...sets[si],[f]:f==='done'?v:parseFloat(v)||0};exs[ei]={...exs[ei],sets};return{...p,exercises:exs};});
  const addSet=ei=>setSession(p=>{const exs=[...p.exercises];const ls=exs[ei].sets[exs[ei].sets.length-1];exs[ei]={...exs[ei],sets:[...exs[ei].sets,{...ls,done:false}]};return{...p,exercises:exs};});
  const rmSet=(ei,si)=>setSession(p=>{const exs=[...p.exercises];exs[ei]={...exs[ei],sets:exs[ei].sets.filter((_,i)=>i!==si)};return{...p,exercises:exs};});
  const setVariant=(ei,v)=>setSession(p=>{const exs=[...p.exercises];exs[ei]={...exs[ei],selectedVariant:v};return{...p,exercises:exs};});
  const finish=()=>{
    const log={id:genId(),userId:user.id,splitId:activeSplit.id,dayId:session.day.id,dayName:session.day.name,date:today(),notes:session.notes,
      exercises:session.exercises.map(ex=>({name:ex.selectedVariant||ex.name,sets:ex.sets.filter(s=>s.done).map(s=>({reps:s.reps,weight:s.weight}))})).filter(ex=>ex.sets.length>0)};
    setWorkoutLogs(p=>[...p,log]); setDone(true);
  };

  if(done) return (
    <div className="fade-up" style={{textAlign:'center',padding:'80px 20px'}}>
      <div style={{fontSize:60,marginBottom:12}}>🎉</div>
      <div className="bb" style={{fontSize:38,color:O}}>WORKOUT COMPLETE!</div>
      <div style={{color:'var(--t2)',marginTop:8,marginBottom:30}}>Session saved. Recovery starts now 💪</div>
      <button className="btn-primary" style={{padding:'13px 30px',fontSize:16}} onClick={()=>{setSession(null);setDone(false);}}>Log Another</button>
    </div>
  );

  if(session) return (
    <div className="fade-up">
      <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:20}}>
        <button className="btn-ghost" onClick={()=>setSession(null)} style={{fontSize:13}}>← Back</button>
        <div>
          <div className="bb" style={{fontSize:24}}>{session.day.name}</div>
          <div style={{fontSize:12,color:'var(--t2)'}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div>
        </div>
      </div>
      {session.exercises.map((ex,ei)=>(
        <div key={ex.id} className="card" style={{marginBottom:12,padding:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div>
              <div className="bb" style={{fontSize:17}}>{ex.selectedVariant||ex.name}</div>
              {ex.variants&&<select value={ex.selectedVariant||ex.variants[0]} onChange={e=>setVariant(ei,e.target.value)} style={{marginTop:5,fontSize:12,padding:'5px 10px',width:'auto'}}>
                {ex.variants.map(v=><option key={v} value={v}>{v}</option>)}
              </select>}
              <div style={{marginTop:4,display:'flex',gap:5,flexWrap:'wrap'}}>
                {ex.muscle&&<span className="tag">{ex.muscle}</span>}
                {ex.repsRange&&<span style={{fontSize:11,color:'var(--t3)'}}>Target: {ex.repsRange} reps</span>}
              </div>
            </div>
            <button className="btn-ghost" style={{fontSize:12,padding:'5px 9px'}} onClick={()=>addSet(ei)}>+ Set</button>
          </div>
          <div className="ex-row" style={{marginBottom:5}}>
            {['SET','REPS','KG','DONE'].map(h=><div key={h} style={{fontSize:10,color:'var(--t3)',fontWeight:700}}>{h}</div>)}
          </div>
          {ex.sets.map((s,si)=>(
            <div key={si} className="ex-row" style={{marginBottom:5,opacity:s.done?.65:1}}>
              <div style={{fontSize:13,color:'var(--t2)',fontWeight:700}}>{si+1}</div>
              <input type="number" value={s.reps} onChange={e=>updSet(ei,si,'reps',e.target.value)} style={{padding:'7px 9px',fontSize:14}}/>
              <input type="number" step=".5" value={s.weight} onChange={e=>updSet(ei,si,'weight',e.target.value)} style={{padding:'7px 9px',fontSize:14}}/>
              <div style={{display:'flex',gap:4}}>
                <button onClick={()=>updSet(ei,si,'done',!s.done)} style={{flex:1,background:s.done?'var(--o2)':'#111',border:`1px solid ${s.done?'var(--o)':'var(--border)'}`,borderRadius:8,color:s.done?'var(--o)':'var(--t3)',cursor:'pointer',padding:'7px 0',fontSize:15,transition:'all .15s'}}>{s.done?'✓':'○'}</button>
                {ex.sets.length>1&&<button onClick={()=>rmSet(ei,si)} style={{background:'transparent',border:'1px solid var(--border)',borderRadius:8,color:'var(--t3)',cursor:'pointer',padding:'7px 5px',fontSize:11}}>✕</button>}
              </div>
            </div>
          ))}
          {ex.notes&&<div style={{fontSize:11,color:'var(--t3)',marginTop:5,fontStyle:'italic'}}>💡 {ex.notes}</div>}
        </div>
      ))}
      <div className="card" style={{marginBottom:12,padding:14}}>
        <label>Session Notes</label>
        <textarea rows={2} placeholder="PRs, form notes, how it felt..." value={session.notes} onChange={e=>setSession(p=>({...p,notes:e.target.value}))} style={{resize:'vertical'}}/>
      </div>
      <button className="btn-primary" style={{width:'100%',padding:'15px',fontSize:16,borderRadius:10}} onClick={finish}>🏁 Finish Workout</button>
    </div>
  );

  return (
    <div className="fade-up">
      <PH title="Workout Tracker" subtitle={activeSplit?`${activeSplit.emoji} ${activeSplit.name}`:'Select a split first'}/>
      {!activeSplit
        ?<div style={{textAlign:'center',padding:40,color:'var(--t2)'}}>Go to Splits to select a program first</div>
        :<div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:12}}>
          {workoutDays.map(day=>{
            const last=workoutLogs.filter(l=>(l.userId===user.id||l.userId==='vishal')&&l.dayId===day.id).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
            return (
              <div key={day.id} className="card" style={{padding:16,cursor:'pointer',transition:'transform .2s,border-color .2s'}}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='var(--o)';}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--border)';}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:9}}>
                  <span className={`tag ${getDayTag(day.type)}`}>{day.type}</span>
                  {last&&<span style={{fontSize:10,color:'var(--t3)'}}>Last: {fmt(last.date)}</span>}
                </div>
                <div className="bb" style={{fontSize:17,marginBottom:9}}>{day.name}</div>
                {day.exercises.slice(0,4).map(ex=>(
                  <div key={ex.id} style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--t2)',padding:'3px 0',borderBottom:'1px solid #1A1A1A'}}>
                    <span>{ex.name}</span>
                    <span style={{color:O}}>{ex.sets}×{ex.repsRange}</span>
                  </div>
                ))}
                {day.exercises.length>4&&<div style={{fontSize:11,color:'var(--t3)',marginTop:5}}>+{day.exercises.length-4} more</div>}
                <button className="btn-primary" style={{width:'100%',marginTop:12,padding:'10px'}} onClick={()=>startSession(day)}>Start Session →</button>
              </div>
            );
          })}
        </div>
      }
    </div>
  );
};

// ─── DIET PAGE ────────────────────────────────────────────────────────────────
const DietPage=({user})=>{
  const autoGoal = goalFromWeight(user.weight, user.weightGoal);
  const [goal,setGoal] = useState(autoGoal);
  const [dietType,setDietType] = useState('nonveg');

  const bmr  = calcBMR(user.weight,user.height,user.age,user.gender);
  const tdee = calcTDEE(bmr,user.activityLevel||'moderate');
  const cals = goalCals(tdee,goal);
  const prot = goalProt(user.weight,goal);
  const carbs= Math.round((cals*(goal==='loss'?.38:.44))/4);
  const fat  = Math.round((cals*.26)/9);
  const wheyScoops = prot>=180 ? Math.min(Math.ceil((prot-100)/25),4) : 2;
  const wheyProt   = wheyScoops*25;
  const foodProt   = prot-wheyProt;

  const dt = DIET_TYPES[dietType];
  const bmi= calcBMI(user.weight,user.height);
  const bmiCat=getBMICat(bmi);

  const GOALS=[
    {id:'loss',     label:'Weight Loss',  icon:'🔥', kcal:tdee-500, color:O},
    {id:'maintenance',label:'Maintenance',icon:'⚖️', kcal:tdee,    color:O},
    {id:'gain',     label:'Weight Gain',  icon:'💪', kcal:tdee+400, color:O},
  ];

  const gKey = goal==='loss'?'loss':goal==='gain'?'gain':'maintain';

  return (
    <div className="fade-up">
      <PH title="Diet Guide" subtitle={`Personalised for ${user.name.split(' ')[0]} — based on body stats & weight goal`}/>

      {/* Stats */}
      <div className="card" style={{padding:16,marginBottom:16,display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{fontSize:11,color:'var(--t3)',fontWeight:700}}>YOUR STATS</div>
        {[
          {l:'Age',    v:`${user.age} yr`},
          {l:'Weight', v:`${user.weight} kg`},
          {l:'Goal',   v:user.weightGoal?`${user.weightGoal} kg`:'Not set'},
          {l:'Height', v:`${user.height} cm`},
          {l:'BMI',    v:`${bmi} (${bmiCat.label})`},
          {l:'Activity',v:ACTIVITY[user.activityLevel||'moderate']?.label.split('(')[0].trim()},
          {l:'BMR',    v:`${bmr} kcal`},
          {l:'TDEE',   v:`${tdee} kcal`},
        ].map(s=>(
          <div key={s.l} style={{padding:'5px 11px',background:'#111',borderRadius:8,border:'1px solid var(--border)'}}>
            <div style={{fontSize:9,color:'var(--t3)',fontWeight:700,textTransform:'uppercase'}}>{s.l}</div>
            <div style={{fontSize:13,fontWeight:600,color:'var(--text)',marginTop:1}}>{s.v}</div>
          </div>
        ))}
        {user.weightGoal&&(
          <div style={{padding:'7px 12px',background:'var(--o3)',borderRadius:8,border:'1px solid rgba(232,84,13,.25)',fontSize:12,color:O}}>
            {autoGoal==='loss'?`Lose ${(user.weight-user.weightGoal).toFixed(1)}kg to reach goal`
              :autoGoal==='gain'?`Gain ${(user.weightGoal-user.weight).toFixed(1)}kg to reach goal`
              :'At goal weight — maintain!'}
          </div>
        )}
      </div>

      {/* Goal cards */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}} className="g3">
        {GOALS.map(g=>(
          <div key={g.id} className="card" style={{padding:15,cursor:'pointer',transition:'all .2s',
            border:`1px solid ${goal===g.id?'var(--o)':'var(--border)'}`,
            background:goal===g.id?'var(--o2)':'var(--card)'}}
            onClick={()=>setGoal(g.id)}>
            <div style={{fontSize:22,marginBottom:6}}>{g.icon}</div>
            <div style={{fontWeight:700,fontSize:13}}>{g.label}</div>
            <div className="bb" style={{fontSize:20,color:O,marginTop:3}}>{g.kcal}<span style={{fontSize:11,color:'var(--t2)',marginLeft:2}}>kcal/day</span></div>
            {goal===g.id&&<span className="tag" style={{marginTop:8,display:'inline-flex',fontSize:9}}>Selected ✓</span>}
          </div>
        ))}
      </div>

      {/* Macros */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:16}} className="g4">
        {[{l:'Calories',v:cals,u:'kcal'},{l:'Protein',v:prot,u:'g'},{l:'Carbs',v:carbs,u:'g'},{l:'Fat',v:fat,u:'g'}].map(m=>(
          <div key={m.l} className="card" style={{padding:13,textAlign:'center'}}>
            <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:3}}>{m.l}</div>
            <div className="bb" style={{fontSize:24,color:O}}>{m.v}<span style={{fontSize:11,color:'var(--t2)'}}>{m.u}</span></div>
          </div>
        ))}
      </div>

      {/* Whey summary inline */}
      <div className="card" style={{padding:'12px 16px',marginBottom:16,display:'flex',gap:12,alignItems:'center',flexWrap:'wrap',borderLeft:'3px solid var(--o)'}}>
        <div style={{fontSize:18}}>🥤</div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:13}}>Whey Protein — {wheyScoops} scoops/day ({wheyProt}g protein)</div>
          <div style={{fontSize:12,color:'var(--t2)',marginTop:2}}>
            Get {foodProt}g from food + {wheyProt}g from whey to hit your {prot}g protein target.
            {dietType==='vegan'?' Use pea+rice plant protein blend (MuscleBlaze Biozyme Plant).':' Brands: MuscleBlaze, ON Gold Standard, MyProtein.'}
          </div>
        </div>
        <span className="tag">{wheyScoops} × 25g</span>
      </div>

      {/* Diet type */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:16}}>
        {Object.values(DIET_TYPES).map(d=>(
          <button key={d.id} onClick={()=>setDietType(d.id)} style={{
            padding:'9px 16px',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600,transition:'all .2s',
            background:dietType===d.id?'var(--o)':'transparent',color:dietType===d.id?'#fff':'var(--t2)',
            border:`1px solid ${dietType===d.id?'var(--o)':'var(--border)'}`,
          }}>{d.icon} {d.label}</button>
        ))}
      </div>

      {/* Meals */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))',gap:14}}>
        {dt.meals.map((meal,i)=>{
          const items = meal.items[gKey] || meal.items.maintain || [];
          const wheyItems=[];
          if(meal.label==='Breakfast') wheyItems.push(`🥤 1 scoop ${dietType==='vegan'?'plant':'whey'} protein in 250ml water/milk — complete protein, all 9 EAAs`);
          if(meal.label==='Post-Workout Dinner') wheyItems.push('🥤 1 scoop whey within 30 min post-workout — fastest route to muscle protein synthesis');
          if(wheyScoops>=3&&meal.label==='Mid-Morning') wheyItems.push(`🥤 Extra scoop ${dietType==='vegan'?'plant':'whey'} protein — needed to hit your ${prot}g target`);
          if(wheyScoops>=4&&meal.label==='Before Bed') wheyItems.push('🥤 1 scoop casein/whey before bed — 8-hour overnight recovery window');
          const allItems=[...items,...wheyItems];

          return (
            <div key={i} className="card" style={{padding:16}}>
              <div style={{display:'flex',gap:9,alignItems:'center',marginBottom:12}}>
                <span style={{fontSize:18}}>{meal.icon}</span>
                <div style={{flex:1}}>
                  <div className="bb" style={{fontSize:15}}>{meal.label}</div>
                  <div style={{fontSize:11,color:O,fontWeight:600}}>{meal.time}</div>
                </div>
                {goal==='gain'&&<span className="tag" style={{fontSize:9}}>+Portions</span>}
                {goal==='loss'&&<span className="tag" style={{fontSize:9}}>-Portions</span>}
              </div>

              {/* Food items */}
              {allItems.map((item,j)=>{
                const isWhey=item.startsWith('🥤');
                return (
                  <div key={j} style={{display:'flex',gap:6,alignItems:'flex-start',padding:'5px 0',fontSize:12,
                    color:isWhey?O:'var(--t2)',
                    borderBottom:j<allItems.length-1?'1px solid #1E1E1E':'',
                    background:isWhey?'var(--o3)':'transparent',
                    borderRadius:isWhey?5:0,paddingLeft:isWhey?6:0,marginBottom:isWhey?2:0}}>
                    {!isWhey&&<span style={{color:O,flexShrink:0,marginTop:1}}>•</span>}
                    <span>{item}</span>
                  </div>
                );
              })}

              {/* Macros + Micros */}
              <div style={{marginTop:12,paddingTop:10,borderTop:'1px solid #1E1E1E'}}>
                <div style={{display:'flex',gap:6,flexWrap:'wrap',marginBottom:6}}>
                  {[{l:'P',v:meal.macros.p},{l:'C',v:meal.macros.c},{l:'F',v:meal.macros.f}].map(m=>(
                    <div key={m.l} style={{padding:'3px 8px',background:'var(--o2)',borderRadius:6,fontSize:11,border:'1px solid rgba(232,84,13,.2)'}}>
                      <span style={{color:O,fontWeight:700}}>{m.l}</span>
                      <span style={{color:'var(--t2)',marginLeft:2}}>{m.v}g</span>
                    </div>
                  ))}
                  <div style={{padding:'3px 8px',background:'#111',borderRadius:6,fontSize:11,border:'1px solid var(--border)',color:'var(--t3)'}}>
                    ~{meal.macros.p*4+meal.macros.c*4+meal.macros.f*9} kcal
                  </div>
                </div>
                <div style={{fontSize:10,color:'var(--t3)',lineHeight:1.6}}>
                  <span style={{color:O,fontWeight:700}}>Key micros: </span>
                  {meal.micros.join(' · ')}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer note */}
      <div className="card" style={{marginTop:14,padding:14,borderLeft:'3px solid var(--o)'}}>
        <div style={{fontSize:11,color:'var(--t2)'}}>
          📌 <strong>Note:</strong> Scale portions to hit <strong style={{color:O}}>{cals} kcal/day</strong> (Mifflin-St Jeor + {ACTIVITY[user.activityLevel||'moderate']?.label.split('(')[0].trim()} TDEE).
          {goal==='loss'&&' 500 kcal deficit = ~0.5kg/week fat loss.'}
          {goal==='gain'&&' 400 kcal surplus for lean muscle gain.'}
          {` Whey: ${wheyScoops} scoops (${wheyProt}g) + ${foodProt}g from food.`}
          {dietType==='vegan'&&' Plant protein: pea+rice blend covers all 9 essential amino acids.'}
        </div>
      </div>

      {/* Protein sources */}
      <div className="card" style={{padding:14,marginTop:12,borderLeft:`3px solid var(--o)`}}>
        <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:8}}>Best Protein Sources — {dt.label}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
          {dt.proteinSources.map(s=>(
            <span key={s} style={{padding:'3px 9px',background:'var(--o2)',color:O,border:'1px solid rgba(232,84,13,.2)',borderRadius:20,fontSize:12,fontWeight:500}}>{s}</span>
          ))}
        </div>
      </div>

      {/* EAA practical tip */}
      <div style={{marginTop:12,padding:'12px 14px',background:'var(--o3)',borderRadius:10,border:'1px solid rgba(232,84,13,.2)',fontSize:12,color:'var(--t2)'}}>
        ✅ <strong style={{color:O}}>Complete Protein Tip (all 9 EAAs):</strong> Aim for 2 complete protein sources per meal.
        For plant-based meals: combine legumes (dal, chana, rajma) with a grain (rice, roti, quinoa) to cover all 9 EAAs.
        Whey protein itself is a complete protein — all 9 EAAs in every scoop.
      </div>
    </div>
  );
};

// ─── PROGRESS PAGE ────────────────────────────────────────────────────────────
const ProgressPage=({user,workoutLogs,splits})=>{
  const act=splits.find(s=>s.id===user.activeSplitId)||splits[0];
  const [ss,setSs]=useState(act?.id||splits[0]?.id);
  const [sd,setSd]=useState('');
  const [se,setSe]=useState('');
  const split=splits.find(s=>s.id===ss);
  const days=split?.days.filter(d=>d.type!=='rest')||[];
  const ul=workoutLogs.filter(l=>l.userId===user.id||l.userId==='vishal');
  const exNames=useMemo(()=>{const ns=new Set();ul.filter(l=>!sd||l.dayId===sd).forEach(l=>l.exercises?.forEach(e=>ns.add(e.name)));if(sd)days.find(d=>d.id===sd)?.exercises.forEach(e=>ns.add(e.name));return[...ns];},[sd,ul,days]);
  const chartData=useMemo(()=>{
    if(!se)return[];
    return ul.filter(l=>!sd||l.dayId===sd).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(log=>{
      const ex=log.exercises?.find(e=>e.name===se);
      if(!ex?.sets?.length)return null;
      const mx=Math.max(...ex.sets.map(s=>s.weight||0));
      const vol=ex.sets.reduce((a,s)=>a+(s.reps||0)*(s.weight||0),0);
      const ar=+(ex.sets.reduce((a,s)=>a+(s.reps||0),0)/ex.sets.length).toFixed(1);
      return{date:fmt(log.date),maxWeight:mx,volume:Math.round(vol),avgReps:ar,sets:ex.sets.length};
    }).filter(Boolean);
  },[se,sd,ul]);
  const pr=chartData.length?Math.max(...chartData.map(d=>d.maxWeight)):0;

  return (
    <div className="fade-up">
      <PH title="Progress Charts" subtitle="Track your strength gains over time"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12,marginBottom:18}} className="g3">
        <div><label>Split</label>
          <select value={ss} onChange={e=>{setSs(e.target.value);setSd('');setSe('');}}>
            {splits.filter(s=>!s.comingSoon).map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
          </select>
        </div>
        <div><label>Day</label>
          <select value={sd} onChange={e=>{setSd(e.target.value);setSe('');}}>
            <option value="">All Days</option>
            {days.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
        <div><label>Exercise</label>
          <select value={se} onChange={e=>setSe(e.target.value)}>
            <option value="">— Select —</option>
            {exNames.map(n=><option key={n} value={n}>{n}</option>)}
          </select>
        </div>
      </div>
      {se&&chartData.length>0?(<>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12,marginBottom:16}} className="g3">
          <MetricCard label="Personal Record" value={pr} unit="kg" icon="🏆" small/>
          <MetricCard label="Sessions" value={chartData.length} unit="" icon="📋" small/>
          {chartData.length>=2&&<MetricCard label="Progress" value={`+${(chartData[chartData.length-1].maxWeight-chartData[0].maxWeight).toFixed(1)}`} unit="kg" icon="📈" small/>}
        </div>
        <div className="bb" style={{fontSize:18,marginBottom:12,color:O}}>{se}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="g2">
          {[
            {title:'Max Weight (kg)',data:'maxWeight',type:'area'},
            {title:'Volume (reps × kg)',data:'volume',type:'bar'},
            {title:'Avg Reps/Set',data:'avgReps',type:'line'},
          ].map(chart=>(
            <div key={chart.data} className="card" style={{padding:18}}>
              <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:10}}>{chart.title}</div>
              <ResponsiveContainer width="100%" height={170}>
                {chart.type==='area'?(
                  <AreaChart data={chartData}>
                    <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E8540D" stopOpacity={.18}/><stop offset="95%" stopColor="#E8540D" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/><XAxis dataKey="date" tick={{fill:'#555',fontSize:10}}/><YAxis tick={{fill:'#555',fontSize:10}}/>
                    <Tooltip contentStyle={{background:'#181818',border:'1px solid #242424',borderRadius:8,fontSize:12}}/>
                    <Area type="monotone" dataKey={chart.data} stroke="#E8540D" strokeWidth={2} fill="url(#cg)" dot={{fill:'#E8540D',r:4}}/>
                  </AreaChart>
                ):chart.type==='bar'?(
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/><XAxis dataKey="date" tick={{fill:'#555',fontSize:10}}/><YAxis tick={{fill:'#555',fontSize:10}}/>
                    <Tooltip contentStyle={{background:'#181818',border:'1px solid #242424',borderRadius:8,fontSize:12}}/>
                    <Bar dataKey={chart.data} fill="#E8540D" radius={[4,4,0,0]} fillOpacity={.8}/>
                  </BarChart>
                ):(
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1E1E1E"/><XAxis dataKey="date" tick={{fill:'#555',fontSize:10}}/><YAxis tick={{fill:'#555',fontSize:10}}/>
                    <Tooltip contentStyle={{background:'#181818',border:'1px solid #242424',borderRadius:8,fontSize:12}}/>
                    <Line type="monotone" dataKey={chart.data} stroke="#E8540D" strokeWidth={2} dot={{fill:'#E8540D',r:4}}/>
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          ))}
          <div className="card" style={{padding:18}}>
            <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:10}}>Session Log</div>
            <div style={{maxHeight:170,overflowY:'auto'}}>
              {[...chartData].reverse().map((d,i)=>(
                <div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid #1E1E1E',fontSize:12}}>
                  <span style={{color:'var(--t2)'}}>{d.date}</span>
                  <span style={{color:O,fontWeight:700}}>{d.maxWeight}kg</span>
                  <span style={{color:'var(--t2)'}}>{d.sets}×</span>
                  <span style={{color:'var(--t2)'}}>{d.avgReps}r</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>):(
        <div style={{textAlign:'center',padding:'56px 20px',border:'1px dashed var(--border)',borderRadius:14}}>
          <div style={{fontSize:38,marginBottom:10}}>📊</div>
          <div className="bb" style={{fontSize:22,marginBottom:6}}>{se?'No data yet':'Select an exercise'}</div>
          <div style={{fontSize:13,color:'var(--t2)'}}>Log workouts to see strength progression charts</div>
        </div>
      )}
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
const ContactPage=()=>{
  const [form,setForm]=useState({name:'',email:'',phone:'',goal:'',service:'workout',message:''});
  const [submitted,setSubmitted]=useState(false);
  const sf=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const SVCS=[
    {id:'workout', label:'Custom Workout Plan', icon:'🏋️', price:'₹2,000'},
    {id:'diet',    label:'Custom Diet Plan',    icon:'🥗',  price:'₹3,000'},
    {id:'combo',   label:'Workout + Diet',       icon:'💪',  price:'₹4,500'},
    {id:'coaching',label:'Online Coaching',      icon:'🏆',  price:'Enquire'},
  ];
  const handleSubmit=()=>{
    if(!form.name||!form.email) return;
    const svc=SVCS.find(s=>s.id===form.service);
    const sub=`FitTrack Pro — ${svc?.label} Inquiry from ${form.name}`;
    const body=`Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone||'Not provided'}\nService: ${svc?.label} (${svc?.price})\nGoal: ${form.goal||'Not specified'}\n\nMessage:\n${form.message}`;
    window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`);
    setSubmitted(true);
  };
  if(submitted) return (
    <div className="fade-up" style={{textAlign:'center',padding:'80px 20px'}}>
      <div style={{fontSize:56,marginBottom:12}}>📩</div>
      <div className="bb" style={{fontSize:34,color:O}}>MESSAGE SENT!</div>
      <div style={{color:'var(--t2)',marginTop:8,marginBottom:28}}>Vishal will respond within 24 hours 🙏</div>
      <button className="btn-primary" style={{padding:'12px 26px'}} onClick={()=>setSubmitted(false)}>Send Another</button>
    </div>
  );
  return (
    <div className="fade-up">
      <PH title="Work With Me" subtitle="Custom plans crafted for your body & lifestyle goals"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:20}} className="g2">
        {SVCS.map(s=>(
          <div key={s.id} className="card" style={{padding:18,cursor:'pointer',transition:'all .2s',
            border:`1px solid ${form.service===s.id?'var(--o)':'var(--border)'}`,
            background:form.service===s.id?'var(--o2)':'var(--card)'}}
            onClick={()=>setForm(p=>({...p,service:s.id}))}
            onMouseEnter={e=>e.currentTarget.style.borderColor='var(--o)'}
            onMouseLeave={e=>e.currentTarget.style.borderColor=form.service===s.id?'var(--o)':'var(--border)'}>
            <div style={{fontSize:24,marginBottom:7}}>{s.icon}</div>
            <div className="bb" style={{fontSize:17}}>{s.label}</div>
            <div className="bb" style={{fontSize:22,color:O,marginTop:4}}>{s.price}</div>
            {s.id==='coaching'&&<div style={{fontSize:11,color:'var(--t3)',marginTop:4}}>Fill form below with details</div>}
            {form.service===s.id&&<span className="tag" style={{marginTop:8,display:'inline-flex',fontSize:9}}>Selected ✓</span>}
          </div>
        ))}
      </div>
      <div className="card" style={{padding:22}}>
        <div className="bb" style={{fontSize:22,marginBottom:4}}>Get In Touch</div>
        <div className="accent-bar"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}} className="g2">
          <div><label>Full Name *</label><input placeholder="Your name" value={form.name} onChange={sf('name')}/></div>
          <div><label>Email *</label><input type="email" placeholder="you@email.com" value={form.email} onChange={sf('email')}/></div>
          <div><label>Phone / WhatsApp</label><input placeholder="+91 98765 43210" value={form.phone} onChange={sf('phone')}/></div>
          <div><label>Primary Goal</label>
            <select value={form.goal} onChange={sf('goal')}>
              <option value="">Select goal</option>
              <option>Weight Loss / Fat Loss</option>
              <option>Muscle Building / Bulking</option>
              <option>Athletic Performance</option>
              <option>General Fitness</option>
              <option>Body Recomposition</option>
              <option>Injury Recovery</option>
            </select>
          </div>
        </div>
        <div style={{marginTop:13}}><label>About you & your goals</label>
          <textarea rows={4} placeholder="Current weight, training experience, dietary preferences, schedule, specific focus areas..." value={form.message} onChange={sf('message')} style={{resize:'vertical'}}/>
        </div>
        <button className="btn-primary" style={{marginTop:16,padding:'13px 26px',fontSize:15}} onClick={handleSubmit} disabled={!form.name||!form.email}>
          Send Inquiry →
        </button>
        <div style={{marginTop:10,fontSize:11,color:'var(--t3)'}}>Opens your email app pre-filled to vishalchaudhary28@gmail.com</div>
      </div>
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage=({user,setUsers,onLogout})=>{
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({...user});
  const sf=k=>e=>setForm(p=>({...p,[k]:e.target.value}));
  const save=()=>{setUsers(p=>p.map(u=>u.id===user.id?{...u,...form,weight:parseFloat(form.weight),height:parseFloat(form.height),age:parseInt(form.age),workoutDays:parseInt(form.workoutDays),weightGoal:form.weightGoal?parseFloat(form.weightGoal):null}:u));setEditing(false);};
  const bmi=calcBMI(user.weight,user.height);
  const bmr=calcBMR(user.weight,user.height,user.age,user.gender);
  const tdee=calcTDEE(bmr,user.activityLevel||'moderate');

  return (
    <div className="fade-up">
      <PH title="My Profile"/>
      <div style={{display:'grid',gridTemplateColumns:'240px 1fr',gap:16}} className="g2">
        <div className="card" style={{padding:22,textAlign:'center',height:'fit-content'}}>
          <div style={{width:68,height:68,borderRadius:'50%',background:'var(--o)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontFamily:"'Bebas Neue',sans-serif",fontSize:26,color:'#fff',letterSpacing:'2px'}}>{user.avatar}</div>
          <div className="bb" style={{fontSize:20}}>{user.name}</div>
          {user.isAdmin&&<div style={{marginTop:5}}><span className="tag">⚡ Admin</span></div>}
          <div style={{fontSize:11,color:'var(--t3)',marginTop:5}}>Since {fmt(user.joinDate)}</div>
          <hr style={{border:'none',borderTop:'1px solid var(--border)',margin:'14px 0'}}/>
          <div className="bb" style={{fontSize:52,color:O,lineHeight:1}}>{bmi}</div>
          <span className="tag" style={{marginTop:6,display:'inline-flex'}}>{getBMICat(bmi).label} BMI</span>
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
            {[{l:'BMR',v:bmr,u:'kcal'},{l:'TDEE',v:tdee,u:'kcal'}].map(m=>(
              <div key={m.l} style={{padding:'7px',background:'#111',borderRadius:8,border:'1px solid var(--border)'}}>
                <div style={{fontSize:10,color:'var(--t3)',fontWeight:700}}>{m.l}</div>
                <div className="bb" style={{fontSize:18,color:O}}>{m.v}</div>
                <div style={{fontSize:9,color:'var(--t3)'}}>{m.u}</div>
              </div>
            ))}
          </div>
          <button className="btn-danger" style={{marginTop:14,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6}} onClick={onLogout}>
            <LogOut size={13}/> Logout
          </button>
        </div>
        <div className="card" style={{padding:22}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
            <div className="bb" style={{fontSize:20}}>Personal Details</div>
            <button className="btn-ghost" style={{fontSize:13}} onClick={()=>editing?save():setEditing(true)}>{editing?'✓ Save':'✏️ Edit'}</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:13}}>
            {[
              {l:'Full Name',k:'name',t:'text'},{l:'Age',k:'age',t:'number'},
              {l:'Email',k:'email',t:'email'},{l:'Weight (kg)',k:'weight',t:'number'},
              {l:'Height (cm)',k:'height',t:'number'},{l:'Weight Goal (kg)',k:'weightGoal',t:'number'},
              {l:'Workout Days/Week',k:'workoutDays',t:'number'},
            ].map(f=>(
              <div key={f.k}>
                <label>{f.l}</label>
                {editing
                  ?<input type={f.t} value={form[f.k]||''} onChange={sf(f.k)}/>
                  :<div style={{padding:'10px 13px',background:'#111',borderRadius:8,fontSize:14,border:'1px solid var(--border)',color:f.k==='weightGoal'&&!user[f.k]?'var(--t3)':'var(--text)'}}>
                    {user[f.k]?String(user[f.k]):'Not set'}
                  </div>
                }
              </div>
            ))}
            <div>
              <label>Gender</label>
              {editing
                ?<select value={form.gender} onChange={sf('gender')}>
                    <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                  </select>
                :<div style={{padding:'10px 13px',background:'#111',borderRadius:8,fontSize:14,border:'1px solid var(--border)'}}>{user.gender}</div>
              }
            </div>
            <div>
              <label>Activity Level</label>
              {editing
                ?<select value={form.activityLevel} onChange={sf('activityLevel')}>
                    {Object.entries(ACTIVITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}
                  </select>
                :<div style={{padding:'10px 13px',background:'#111',borderRadius:8,fontSize:13,border:'1px solid var(--border)',color:'var(--t2)'}}>{ACTIVITY[user.activityLevel||'moderate']?.label}</div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── NAV ─────────────────────────────────────────────────────────────────────
const NAV=[
  {id:'dashboard',label:'Dashboard',  Icon:Activity},
  {id:'splits',   label:'Splits',     Icon:Dumbbell},
  {id:'workout',  label:'Tracker',    Icon:Target},
  {id:'diet',     label:'Diet',       Icon:Salad},
  {id:'progress', label:'Progress',   Icon:TrendingUp},
  {id:'contact',  label:'Work With Me',Icon:Mail},
  {id:'profile',  label:'Profile',    Icon:User},
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [users,setUsers]           = useState(INIT_USERS);
  const [uid,setUid]               = useState(null);
  const [page,setPage]             = useState('dashboard');
  const [splits,setSplits]         = useState(INIT_SPLITS);
  const [healthLogs,setHealthLogs] = useState(SAMPLE.hl);
  const [workoutLogs,setWorkoutLogs]= useState(SAMPLE.wl);
  const [sidebarOpen,setSidebarOpen]= useState(true);

  const user = uid ? users.find(u=>u.id===uid) : null;
  const login  = u => { setUid(u.id); setPage('dashboard'); };
  const logout = () => { setUid(null); setPage('dashboard'); };
  const setActiveSplit = id => setUsers(p=>p.map(u=>u.id===uid?{...u,activeSplitId:id}:u));

  if(!user) return <><GlobalStyles/><AuthModal users={users} setUsers={setUsers} onLogin={login}/></>;

  const props={user,splits,setSplits,workoutLogs,setWorkoutLogs,healthLogs,setHealthLogs,setUsers};
  const renderPage=()=>{
    switch(page){
      case 'dashboard': return <DashboardPage {...props}/>;
      case 'splits':    return <SplitsPage {...props} setActiveSplitId={setActiveSplit} setPage={setPage} isAdmin={user.isAdmin}/>;
      case 'workout':   return <WorkoutPage {...props}/>;
      case 'diet':      return <DietPage user={user}/>;
      case 'progress':  return <ProgressPage {...props}/>;
      case 'contact':   return <ContactPage/>;
      case 'profile':   return <ProfilePage user={user} setUsers={setUsers} onLogout={logout}/>;
      default: return null;
    }
  };

  return (
    <>
      <GlobalStyles/>
      <div style={{display:'flex',minHeight:'100vh'}}>
        {/* Desktop Sidebar */}
        <div className="ds" style={{width:sidebarOpen?226:56,background:'#0C0C0C',borderRight:'1px solid var(--border)',display:'flex',flexDirection:'column',transition:'width .22s',flexShrink:0,position:'sticky',top:0,height:'100vh',overflow:'hidden'}}>
          <div style={{padding:'16px 12px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:9,cursor:'pointer'}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
            <div style={{width:30,height:30,borderRadius:7,background:'var(--o)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:15,flexShrink:0}}>💪</div>
            {sidebarOpen&&<div className="bb" style={{fontSize:17,letterSpacing:'2px',color:O,whiteSpace:'nowrap'}}>FITTRACK PRO</div>}
          </div>
          {sidebarOpen&&(
            <div style={{padding:'12px',borderBottom:'1px solid var(--border)',display:'flex',gap:9,alignItems:'center'}}>
              <div style={{width:32,height:32,borderRadius:'50%',background:'var(--o)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue',sans-serif",color:'#fff',fontSize:13,flexShrink:0}}>{user.avatar}</div>
              <div style={{overflow:'hidden'}}>
                <div style={{fontSize:13,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.name}</div>
                <div style={{fontSize:10,color:'var(--t3)'}}>{user.isAdmin?'⚡ Admin':'Member'}</div>
              </div>
            </div>
          )}
          <nav style={{padding:'8px 6px',flex:1,overflowY:'auto'}}>
            {NAV.map(({id,label,Icon})=>(
              <div key={id} className={`nav-item ${page===id?'active':''}`} onClick={()=>setPage(id)} title={!sidebarOpen?label:''}>
                <span style={{flexShrink:0}}><Icon size={16}/></span>
                {sidebarOpen&&<span>{label}</span>}
              </div>
            ))}
          </nav>
          {sidebarOpen&&<div style={{padding:'10px 14px',borderTop:'1px solid var(--border)',fontSize:10,color:'var(--t3)'}}>
            FitTrack Pro v3.0 · Share on Instagram 📸
          </div>}
        </div>

        <main className="mc" style={{flex:1,padding:'24px 26px',overflowY:'auto'}}>
          {renderPage()}
        </main>

        {/* Mobile Bottom Nav */}
        <nav className="bottom-nav">
          {[...NAV.slice(0,4),NAV[6]].map(({id,label,Icon})=>(
            <button key={id} onClick={()=>setPage(id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:3,background:'none',border:'none',cursor:'pointer',padding:'5px 0',color:page===id?'var(--o)':'var(--t3)',transition:'color .15s'}}>
              <Icon size={19}/>
              <span style={{fontSize:9,fontWeight:600,letterSpacing:'.3px',textTransform:'uppercase'}}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}