import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Scale, BarChart2, Ruler, Target, Flame, Trophy, Dumbbell, Salad, TrendingUp, Mail, User, ChevronDown, ChevronRight, LogOut, Eye, EyeOff, Edit2, Trash2, X, Activity, LayoutDashboard, Home, Check } from "lucide-react";

// ─── THEME ────────────────────────────────────────────────────────────────────
const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --bg:#161618;--c1:#1E1E21;--c2:#252528;--c3:#2C2C30;
      --bd:#2E2E33;--bd2:#3A3A40;
      --o:#E8540D;--o2:rgba(232,84,13,.14);--o3:rgba(232,84,13,.07);--og:linear-gradient(135deg,#E8540D,#FF7A3D);
      --tx:#F2F2F7;--t2:#8E8E93;--t3:#48484A;--t4:#3A3A3C;
    }
    html{scroll-behavior:smooth}
    body{background:var(--bg);color:var(--tx);font-family:'DM Sans',sans-serif;overflow-x:hidden;-webkit-font-smoothing:antialiased}
    ::-webkit-scrollbar{width:0;height:0}
    .btn-p{background:var(--og);color:#fff;border:none;border-radius:12px;padding:13px 24px;font-family:'DM Sans',sans-serif;font-weight:700;font-size:14px;cursor:pointer;transition:all .2s;letter-spacing:.2px}
    .btn-p:hover{opacity:.9;transform:translateY(-1px)}
    .btn-p:active{transform:translateY(0);opacity:.95}
    .btn-p:disabled{opacity:.4;cursor:not-allowed;transform:none}
    .btn-g{background:transparent;border:1px solid var(--bd);color:var(--t2);border-radius:10px;padding:9px 18px;font-family:'DM Sans',sans-serif;font-size:13px;cursor:pointer;transition:all .2s}
    .btn-g:hover{border-color:var(--o);color:var(--o)}
    .btn-d{background:transparent;border:1px solid rgba(232,84,13,.2);color:var(--o);border-radius:8px;padding:5px 10px;font-size:12px;cursor:pointer;transition:all .2s}
    .btn-d:hover{background:var(--o3)}
    input,select,textarea{background:var(--c3);border:1px solid var(--bd);color:var(--tx);font-family:'DM Sans',sans-serif;border-radius:10px;padding:12px 14px;font-size:14px;outline:none;width:100%;transition:border-color .2s;-webkit-appearance:none}
    input:focus,select:focus,textarea:focus{border-color:var(--o);background:var(--c2)}
    select option{background:var(--c2)}
    label{font-size:11px;color:var(--t3);font-weight:700;letter-spacing:.7px;text-transform:uppercase;display:block;margin-bottom:7px}
    .card{background:var(--c1);border:1px solid var(--bd);border-radius:16px;overflow:hidden}
    .card-p{background:var(--c2);border:1px solid var(--bd);border-radius:14px;overflow:hidden}
    .mo{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:2000;padding:16px;backdrop-filter:blur(4px)}
    .md{background:var(--c1);border:1px solid var(--bd);border-radius:20px;padding:24px;width:100%;max-width:480px;max-height:90vh;overflow-y:auto}
    .tag{display:inline-flex;align-items:center;gap:4px;padding:4px 10px;border-radius:20px;font-size:10px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;background:var(--o2);color:var(--o);border:1px solid rgba(232,84,13,.22)}
    .tag-d{background:rgba(255,255,255,.05);color:var(--t3);border:1px solid var(--bd)}
    .ni{display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:12px;cursor:pointer;transition:all .15s;color:var(--t2);font-size:14px;font-weight:500;white-space:nowrap;user-select:none}
    .ni:hover{background:rgba(255,255,255,.05);color:var(--tx)}
    .ni.act{background:var(--o2);color:var(--o)}
    .bb{font-family:'Bebas Neue',sans-serif;letter-spacing:1.5px}
    .abar{width:24px;height:3px;background:var(--og);border-radius:2px;margin-bottom:10px;border-radius:3px}
    .sep{height:1px;background:var(--bd);margin:12px 0}
    .gb{display:flex;align-items:center;justify-content:center;gap:10px;width:100%;padding:12px;background:#fff;color:#1a1a1a;border:none;border-radius:12px;font-family:'DM Sans',sans-serif;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s}
    .gb:hover{background:#f0f0f0;transform:translateY(-1px)}
    .dv{display:flex;align-items:center;gap:10px;margin:14px 0;color:var(--t3);font-size:12px}
    .dv::before,.dv::after{content:'';flex:1;height:1px;background:var(--bd)}
    .bn{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(22,22,24,.96);border-top:1px solid var(--bd);z-index:100;padding:8px 0 calc(8px + env(safe-area-inset-bottom));backdrop-filter:blur(20px)}
    @keyframes pgIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pgOut{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-6px)}}
    .pg-in{animation:pgIn .22s cubic-bezier(.4,0,.2,1) forwards}
    .pg-out{animation:pgOut .15s ease forwards}
    .ex-r{display:grid;grid-template-columns:34px 1fr 1fr 80px;gap:7px;align-items:center}
    @media(max-width:768px){
      .ds{display:none!important}
      .bn{display:flex!important;align-items:stretch}
      .mc{padding:16px 14px 90px!important}
      .g2{grid-template-columns:1fr!important}
      .g3{grid-template-columns:1fr!important}
      .g4{grid-template-columns:1fr 1fr!important}
      .md{padding:18px!important;border-radius:18px!important;max-height:92vh!important}
      .pt{font-size:26px!important}
    }
    @media(min-width:769px){.bn{display:none!important}}
    @media(max-width:500px){.ex-r{grid-template-columns:28px 1fr 1fr 70px;gap:5px}}
    .pbar{height:6px;background:var(--c3);border-radius:3px;overflow:hidden}
    .pbar-fill{height:100%;background:var(--og);border-radius:3px;transition:width .5s ease}
    .stripe{border-left:3px solid var(--o);border-radius:0 14px 14px 0}
    .row-sep:not(:last-child){border-bottom:1px solid var(--bd)}
    input[type=number]::-webkit-inner-spin-button,input[type=number]::-webkit-outer-spin-button{-webkit-appearance:none}
    .picker-wrap{position:relative;height:240px;overflow:hidden;border-radius:14px;background:var(--c3);border:1px solid var(--bd)}
    .picker-fade-top{position:absolute;top:0;left:0;right:0;height:88px;background:linear-gradient(to bottom,var(--c3) 20%,transparent);z-index:2;pointer-events:none}
    .picker-fade-bot{position:absolute;bottom:0;left:0;right:0;height:88px;background:linear-gradient(to top,var(--c3) 20%,transparent);z-index:2;pointer-events:none}
    .picker-sel{position:absolute;top:96px;left:16px;right:16px;height:48px;border-radius:10px;background:var(--o2);border:1px solid rgba(232,84,13,.3);z-index:1;pointer-events:none}
    .picker-scroll{height:100%;overflow-y:scroll;scroll-snap-type:y mandatory;scrollbar-width:none}
    .picker-scroll::-webkit-scrollbar{display:none}
    .picker-item{height:48px;scroll-snap-align:start;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all .1s;user-select:none}
  `}</style>
);

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const O = 'var(--o)';
const gId = () => Math.random().toString(36).slice(2,9);
const tod = () => new Date().toISOString().split('T')[0];
const fmt = d => new Date(d).toLocaleDateString('en-IN',{day:'numeric',month:'short'});
const wkLbl = d => {const dt=new Date(d);return `${dt.toLocaleDateString('en-IN',{day:'numeric',month:'short'})}`;};
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const calcBMI = (w,h) => (!w||!h)?null:(w/((h/100)**2)).toFixed(1);
const getBMICat = b => {if(!b)return{label:'N/A'};const v=parseFloat(b);if(v<18.5)return{label:'Underweight'};if(v<25)return{label:'Normal'};if(v<30)return{label:'Overweight'};return{label:'Obese'};};
const ACTIVITY={sedentary:{label:'Sedentary (no exercise)',mult:1.2},light:{label:'Lightly Active (1–3 days/week)',mult:1.375},moderate:{label:'Moderately Active (3–5 days/week)',mult:1.55},active:{label:'Very Active (6–7 days/week)',mult:1.725},extra:{label:'Extremely Active (athlete)',mult:1.9}};
const calcBMR=(w,h,age,g)=>Math.round(10*w+6.25*h-5*age+(g==='male'?5:g==='female'?-161:-78));
const calcTDEE=(bmr,lvl)=>Math.round(bmr*(ACTIVITY[lvl]?.mult||1.55));
const goalFromWeight=(curr,tgt)=>{if(!tgt)return'maintenance';const d=curr-tgt;if(d>2)return'loss';if(d<-2)return'gain';return'maintenance';};

// ─── SCROLL PICKER (Apple-style drum roller) ──────────────────────────────────
const ScrollPicker = ({ value, onChange, items, unit = '', fmtVal = v => v }) => {
  const ref = useRef(null);
  const H = 48;
  const PAD = H * 2; // 2 items top + 2 bottom padding so center item is selected

  const idx = useMemo(() => {
    const i = items.findIndex(it => String(it) === String(value));
    return i >= 0 ? i : 0;
  }, [value, items]);

  const inited = useRef(false);
  useEffect(() => {
    if (ref.current && !inited.current) {
      ref.current.scrollTop = idx * H;
      inited.current = true;
    }
  }, [idx]);

  const onScroll = useCallback(() => {
    if (!ref.current) return;
    const i = Math.round(ref.current.scrollTop / H);
    const c = clamp(i, 0, items.length - 1);
    if (items[c] !== value) onChange(items[c]);
  }, [items, onChange, value]);

  return (
    <div className="picker-wrap">
      <div className="picker-fade-top" />
      <div className="picker-fade-bot" />
      <div className="picker-sel" />
      <div ref={ref} className="picker-scroll" onScroll={onScroll}>
        <div style={{ height: PAD }} />
        {items.map((item, i) => (
          <div key={i} className="picker-item" style={{
            fontFamily: "'Bebas Neue',sans-serif",
            fontSize: String(item) === String(value) ? 32 : 22,
            color: String(item) === String(value) ? O : 'var(--t2)',
            letterSpacing: '1px',
          }} onClick={() => onChange(item)}>
            {fmtVal(item)}{unit ? ` ${unit}` : ''}
          </div>
        ))}
        <div style={{ height: PAD }} />
      </div>
    </div>
  );
};

// ─── WEIGHT RANGE ITEMS ───────────────────────────────────────────────────────
const mkWtItems = (lo=30,hi=200,step=0.5)=>{const a=[];for(let v=lo;v<=hi;v=parseFloat((v+step).toFixed(1)))a.push(v);return a;};
const mkIntItems = (lo,hi)=>{const a=[];for(let v=lo;v<=hi;v++)a.push(v);return a;};

// ─── EXERCISE FACTORIES ───────────────────────────────────────────────────────
const mkLowerA=()=>[{id:gId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},{id:gId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},{id:gId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:'',variants:['Seated Leg Curls','Lying Leg Curls']},{id:gId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},{id:gId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''}];
const mkLowerB=()=>[{id:gId(),name:'Leg Press',sets:4,repsRange:'8-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},{id:gId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},{id:gId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:''},{id:gId(),name:'Leg Adductor Machine',sets:3,repsRange:'15-20',muscle:'Adductors',notes:''},{id:gId(),name:'Standing Calf Raises',sets:4,repsRange:'15-20',muscle:'Calves',notes:''}];
const mkUpperA=()=>[{id:gId(),name:'Smith Machine Incline Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},{id:gId(),name:'Flat Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'Wide Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},{id:gId(),name:'Biceps Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Single Hand Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''}];
const mkUpperB=()=>[{id:gId(),name:'Incline Dumbbell Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'Close Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'T-Bar Rows',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},{id:gId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},{id:gId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Single Hand Overhead Cable Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''}];

// ─── SPLITS ───────────────────────────────────────────────────────────────────
const INIT_SPLITS=[
  {id:'ppl',name:'Push Pull Legs',emoji:'🔥',description:'6 days/week — Push Pull Legs × 2',color:'#E8540D',schedule:['Push','Pull','Legs','Push','Pull','Legs','Rest'],days:[
    {id:'ppl-pa',name:'Push Day A',type:'push',exercises:[{id:gId(),name:'Flat Dumbbell Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},{id:gId(),name:'Incline Dumbbell Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'Overhead Press',sets:4,repsRange:'8-10',muscle:'Shoulders',notes:''},{id:gId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},{id:gId(),name:'Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},{id:gId(),name:'Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''}]},
    {id:'ppl-pla',name:'Pull Day A',type:'pull',exercises:[{id:gId(),name:'Deadlift',sets:4,repsRange:'4-6',muscle:'Back/Hamstrings',notes:''},{id:gId(),name:'Wide Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Horizontal Machine Row',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Wide Grip T-Bar Rows',sets:3,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Hammer Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''}]},
    {id:'ppl-la',name:'Legs Day A',type:'legs',exercises:mkLowerA()},
    {id:'ppl-pb',name:'Push Day B',type:'push',exercises:[{id:gId(),name:'Chest Machine Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:'',variants:['Chest Machine Press','Bench Press']},{id:gId(),name:'Incline Smith Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'Dumbbell Shoulder Press',sets:4,repsRange:'10-12',muscle:'Shoulders',notes:''},{id:gId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},{id:gId(),name:'Single Hand Rope Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},{id:gId(),name:'Single Hand Overhead Tricep Extension',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''}]},
    {id:'ppl-plb',name:'Pull Day B',type:'pull',exercises:[{id:gId(),name:'Close Grip Lat Pulldowns',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},{id:gId(),name:'Seated Cable Row (Bar)',sets:4,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Preacher Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''}]},
    {id:'ppl-lb',name:'Legs Day B',type:'legs',exercises:mkLowerB()},
    {id:'ppl-r',name:'Rest Day',type:'rest',exercises:[]},
  ]},
  {id:'ul4',name:'Upper Lower (4 Day)',emoji:'⚡',description:'4 days — U L Rest U L Rest Rest',color:'#E8540D',schedule:['Upper','Lower','Rest','Upper','Lower','Rest','Rest'],days:[
    {id:'ul4-ua',name:'Upper A',type:'upper',exercises:mkUpperA()},{id:'ul4-la',name:'Lower A',type:'lower',exercises:mkLowerA()},
    {id:'ul4-r1',name:'Rest Day',type:'rest',exercises:[]},{id:'ul4-ub',name:'Upper B',type:'upper',exercises:mkUpperB()},
    {id:'ul4-lb',name:'Lower B',type:'lower',exercises:mkLowerB()},{id:'ul4-r2',name:'Rest Day',type:'rest',exercises:[]},{id:'ul4-r3',name:'Rest Day',type:'rest',exercises:[]},
  ]},
  {id:'fb3',name:'Full Body (3 Day)',emoji:'💥',description:'Full Body – Rest – Repeat',color:'#E8540D',schedule:['Full Body','Rest','Full Body','Rest','Full Body','Rest','Rest'],days:[
    {id:'fb3-a',name:'Full Body A',type:'full',exercises:[{id:gId(),name:'Squats',sets:4,repsRange:'6-8',muscle:'Quads',notes:''},{id:gId(),name:'Flat Dumbbell Press',sets:4,repsRange:'8-12',muscle:'Chest',notes:''},{id:gId(),name:'Wide Grip Lat Pulldowns',sets:3,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Leg Extension',sets:3,repsRange:'12-15',muscle:'Quads',notes:''},{id:gId(),name:'Overhead Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},{id:gId(),name:'Biceps Cable Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Single Hand Tricep Pushdowns',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''}]},
    {id:'fb3-r1',name:'Rest Day',type:'rest',exercises:[]},
    {id:'fb3-b',name:'Full Body B',type:'full',exercises:[{id:gId(),name:'Leg Press',sets:4,repsRange:'8-12',muscle:'Quads',notes:'',variants:['Leg Press','Pendulum Squats']},{id:gId(),name:'Incline Dumbbell Press',sets:4,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'Seated Horizontal Row',sets:3,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Leg Curls',sets:3,repsRange:'12-15',muscle:'Hamstrings',notes:'',variants:['Seated Leg Curls','Lying Leg Curls']},{id:gId(),name:'Lateral Raises',sets:3,repsRange:'15-20',muscle:'Shoulders',notes:''},{id:gId(),name:'Hammer Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Single Hand Overhead Tricep Extension',sets:2,repsRange:'12-15',muscle:'Triceps',notes:''}]},
    {id:'fb3-r2',name:'Rest Day',type:'rest',exercises:[]},
    {id:'fb3-c',name:'Full Body C',type:'full',exercises:[{id:gId(),name:'Romanian Deadlift',sets:4,repsRange:'10-12',muscle:'Hamstrings',notes:''},{id:gId(),name:'Chest Machine Press',sets:3,repsRange:'10-12',muscle:'Chest',notes:''},{id:gId(),name:'T-Bar Rows',sets:3,repsRange:'10-12',muscle:'Back',notes:''},{id:gId(),name:'Leg Abductor Machine',sets:3,repsRange:'15-20',muscle:'Abductors',notes:''},{id:gId(),name:'Rear Delt Flyes',sets:3,repsRange:'15-20',muscle:'Rear Delts',notes:''},{id:gId(),name:'Incline Bench Bicep Curls',sets:2,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Close Grip Lat Pulldowns',sets:2,repsRange:'12-15',muscle:'Back',notes:''}]},
    {id:'fb3-r3',name:'Rest Day',type:'rest',exercises:[]},{id:'fb3-r4',name:'Rest Day',type:'rest',exercises:[]},
  ]},
  {id:'ula',name:'Upper Lower + Arms',emoji:'💪',description:'U L Rest U L Arms Rest',color:'#E8540D',schedule:['Upper','Lower','Rest','Upper','Lower','Arms','Rest'],days:[
    {id:'ula-ua',name:'Upper A',type:'upper',exercises:mkUpperA()},{id:'ula-la',name:'Lower A',type:'lower',exercises:mkLowerA()},
    {id:'ula-r1',name:'Rest Day',type:'rest',exercises:[]},{id:'ula-ub',name:'Upper B',type:'upper',exercises:mkUpperB()},{id:'ula-lb',name:'Lower B',type:'lower',exercises:mkLowerB()},
    {id:'ula-arms',name:'Arms Day',type:'arms',exercises:[{id:gId(),name:'Shoulder Press',sets:3,repsRange:'10-12',muscle:'Shoulders',notes:''},{id:gId(),name:'Lateral Raises',sets:4,repsRange:'15-20',muscle:'Shoulders',notes:''},{id:gId(),name:'Single Hand Tricep Pushdowns',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},{id:gId(),name:'Single Hand Overhead Tricep Extensions',sets:3,repsRange:'12-15',muscle:'Triceps',notes:''},{id:gId(),name:'Biceps Cable Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''},{id:gId(),name:'Incline Bench Bicep Curls',sets:3,repsRange:'12-15',muscle:'Biceps',notes:''}]},
    {id:'ula-r2',name:'Rest Day',type:'rest',exercises:[]},
  ]},
  {id:'ul6',name:'Upper Lower (6 Day)',emoji:'🏆',description:'U L U L U L Rest — High Frequency',color:'#E8540D',schedule:['Upper','Lower','Upper','Lower','Upper','Lower','Rest'],days:[
    {id:'ul6-ua1',name:'Upper A',type:'upper',exercises:mkUpperA()},{id:'ul6-la1',name:'Lower A',type:'lower',exercises:mkLowerA()},
    {id:'ul6-ub',name:'Upper B',type:'upper',exercises:mkUpperB()},{id:'ul6-lb',name:'Lower B',type:'lower',exercises:mkLowerB()},
    {id:'ul6-ua2',name:'Upper A (Repeat)',type:'upper',exercises:mkUpperA()},{id:'ul6-la2',name:'Lower A (Repeat)',type:'lower',exercises:mkLowerA()},
    {id:'ul6-r',name:'Rest Day',type:'rest',exercises:[]},
  ]},
  {id:'home',name:'Home Workouts',emoji:'🏠',description:'Bodyweight + Yoga — no gym needed',color:'#E8540D',schedule:['Beginner','Yoga','Intermediate','Yoga','Beginner','Rest','Rest'],days:[
    {id:'home-beg',name:'Beginner Bodyweight',type:'home',exercises:[{id:gId(),name:'Push-ups',sets:3,repsRange:'max',muscle:'Chest/Triceps',notes:''},{id:gId(),name:'Pike Push-ups',sets:3,repsRange:'10-15',muscle:'Shoulders',notes:''},{id:gId(),name:'Tricep Dips (Chair)',sets:3,repsRange:'10-12',muscle:'Triceps',notes:''},{id:gId(),name:'Australian Pull-ups',sets:3,repsRange:'8-12',muscle:'Back/Biceps',notes:''},{id:gId(),name:'Bodyweight Squats',sets:3,repsRange:'20-25',muscle:'Quads',notes:''},{id:gId(),name:'Walking Lunges',sets:3,repsRange:'12 each',muscle:'Quads/Glutes',notes:''},{id:gId(),name:'Glute Bridges',sets:3,repsRange:'15-20',muscle:'Glutes',notes:''},{id:gId(),name:'Plank',sets:3,repsRange:'30-45s',muscle:'Core',notes:''},{id:gId(),name:'Mountain Climbers',sets:3,repsRange:'20 each',muscle:'Core/Cardio',notes:''}]},
    {id:'home-yoga',name:'Yoga Flow',type:'yoga',exercises:[{id:gId(),name:'Surya Namaskar (Sun Salutation)',sets:5,repsRange:'1 round each side',muscle:'Full Body',notes:'12 poses per round'},{id:gId(),name:'Adho Mukha Svanasana (Downward Dog)',sets:3,repsRange:'5 breaths',muscle:'Hamstrings/Back',notes:''},{id:gId(),name:'Virabhadrasana I & II (Warriors)',sets:3,repsRange:'5 breaths each',muscle:'Hip Flexors/Legs',notes:''},{id:gId(),name:'Bhujangasana (Cobra)',sets:3,repsRange:'5 breaths',muscle:'Back/Chest',notes:''},{id:gId(),name:'Setu Bandhasana (Bridge)',sets:3,repsRange:'8 breaths',muscle:'Glutes/Back',notes:''},{id:gId(),name:'Paschimottanasana (Forward Bend)',sets:2,repsRange:'10 breaths',muscle:'Hamstrings',notes:''},{id:gId(),name:'Ardha Matsyendrasana (Spinal Twist)',sets:2,repsRange:'5 breaths each',muscle:'Spine',notes:''},{id:gId(),name:'Balasana (Child Pose)',sets:1,repsRange:'10 breaths',muscle:'Recovery',notes:''},{id:gId(),name:'Savasana',sets:1,repsRange:'5 minutes',muscle:'Full Recovery',notes:''}]},
    {id:'home-int',name:'Intermediate Bodyweight',type:'home',exercises:[{id:gId(),name:'Diamond Push-ups',sets:4,repsRange:'10-15',muscle:'Chest/Triceps',notes:''},{id:gId(),name:'Decline Push-ups',sets:3,repsRange:'10-15',muscle:'Upper Chest',notes:''},{id:gId(),name:'Pull-ups',sets:4,repsRange:'max',muscle:'Back/Biceps',notes:''},{id:gId(),name:'Chin-ups',sets:3,repsRange:'max',muscle:'Biceps/Back',notes:''},{id:gId(),name:'Bulgarian Split Squats',sets:3,repsRange:'10-12 each',muscle:'Quads/Glutes',notes:''},{id:gId(),name:'Jump Squats',sets:3,repsRange:'15-20',muscle:'Quads/Cardio',notes:''},{id:gId(),name:'Single-Leg Glute Bridges',sets:3,repsRange:'12-15 each',muscle:'Glutes',notes:''},{id:gId(),name:'Hollow Body Hold',sets:3,repsRange:'20-30s',muscle:'Core',notes:''},{id:gId(),name:'Burpees',sets:3,repsRange:'10-12',muscle:'Full Body',notes:''}]},
    {id:'home-r1',name:'Rest Day',type:'rest',exercises:[]},{id:'home-r2',name:'Rest Day',type:'rest',exercises:[]},
  ]},
  {id:'pl',name:'Powerlifting',emoji:'🏋️',description:'Squat · Bench · Deadlift programming',color:'#E8540D',comingSoon:true,schedule:[],days:[{id:'pl-cs',name:'Coming Soon',type:'rest',exercises:[]}]},
];

// ─── DIET DATA (no times, egg fix) ───────────────────────────────────────────
const mk=(label,icon,items,macros,micros)=>({label,icon,items,macros,micros});
const DIET_TYPES={
  vegan:{id:'vegan',label:'Vegan',icon:'🌱',color:'#E8540D',description:'100% plant-based',
    proteinSources:['Tofu','Tempeh','Soya Chunks','Rajma','Chana','Moong Dal','Hemp Seeds','Quinoa','Amaranth','Pea Protein','Peanut Butter'],
    meals:[
      mk('Breakfast','Sunrise',{loss:['Overnight oats (40g) with soy milk, chia seeds & hemp seeds (all 9 EAAs)','OR Besan chilla (2) with tofu scramble — complete protein combo','6 soaked almonds + 1 walnut','1 scoop plant protein (pea+rice blend) in water'],maintain:['Overnight oats (60g) with soy milk, banana, chia & hemp seeds','OR Quinoa porridge — quinoa contains all 9 EAAs','Soaked almonds (8) + 2 walnuts','1 scoop plant protein in water or plant milk'],gain:['Overnight oats (80g) with soy milk, banana, 2 tbsp peanut butter & hemp seeds','OR Quinoa upma (100g) with veggies + tofu — double complete protein','Almonds (10) + 2 walnuts + 2 dates','1 scoop plant protein in 300ml soy milk']},{p:38,c:52,f:14},['Vitamin B12 (fortified soy milk)','Iron (hemp seeds)','Calcium (chia)','Omega-3 (walnuts)']),
      mk('Mid-Morning','Apple',{loss:['1 apple or pear','Roasted chana (30g)','Green tea or jeera water'],maintain:['1 banana or papaya bowl','Roasted chana (40g) or makhana','Coconut water'],gain:['1 banana + 1 apple','Roasted chana (50g) + 1 tbsp peanut butter','Fresh fruit juice']},{p:8,c:30,f:3},['Potassium','Vitamin C','Fibre']),
      mk('Lunch','Bowl',{loss:['Brown rice (1/2 cup) or 1 roti','Rajma or chana masala (150g) — dal+rice = complete amino acid profile','Stir-fried vegetables with minimal oil','Kachumber salad + flaxseeds'],maintain:['Brown rice (3/4 cup) or 2 rotis','Rajma or chana masala (200g)','Mixed vegetable sabzi','Kachumber salad + coconut yogurt'],gain:['Brown rice (1 cup) + 1 roti','Rajma masala (250g) + quinoa side','Mixed sabzi','Large salad + 1 tbsp hemp seeds']},{p:24,c:62,f:8},['Iron (rajma)','Folate (leafy veg)','Zinc','B vitamins']),
      mk('Pre-Workout','Bolt',{loss:['1 small banana','5-6 almonds','Black coffee'],maintain:['1 banana + 1 tbsp peanut butter','Coconut water or nimbu pani'],gain:['1 banana + 2 dates + 1 tbsp peanut butter','2 tbsp trail mix']},{p:5,c:28,f:6},['Potassium','Natural energy','Magnesium']),
      mk('Post-Workout Dinner','Dinner',{loss:['Brown rice (1/2 cup) or 1 roti','Tofu bhurji (120g — complete protein PDCAAS 1.0) with lots of vegetables','Palak or methi sabzi','1 scoop plant protein post-workout'],maintain:['Brown rice (3/4 cup) or 2 rotis','Tofu bhurji (150g) or soya chunks curry','Mixed vegetable sabzi','1 scoop plant protein post-workout'],gain:['Brown rice (1 cup) or 2-3 rotis','Soya chunks curry (200g) + tofu side','Palak sabzi','1 scoop plant protein in soy milk']},{p:32,c:56,f:10},['Leucine (soy/tofu)','Iron','Zinc','B12 (fortified)']),
      mk('Before Bed','Moon',{loss:['Chamomile or ashwagandha tea','10 cashews or 1 tbsp pumpkin seeds'],maintain:['Warm oat/almond milk with cinnamon','Mixed seeds: pumpkin + sunflower + flax (1 tbsp each)','Handful of walnuts'],gain:['Warm soy milk (250ml)','2 tbsp mixed seeds (pumpkin + sunflower + hemp)','Small bowl of tempeh if short on protein']},{p:12,c:14,f:9},['Tryptophan (seeds)','Magnesium','Zinc','Omega-3']),
    ]},
  vegetarian:{id:'vegetarian',label:'Vegetarian',icon:'🥛',color:'#E8540D',description:'Dairy included — no meat or eggs',
    proteinSources:['Paneer','Greek Yogurt','Full-Fat Milk','Soya Chunks','Rajma','Chana','Moong Dal','Quinoa','Hemp Seeds','Whey Protein'],
    meals:[
      mk('Breakfast','Sunrise',{loss:['Moong dal cheela (2) with low-fat curd — complete amino acid combo','OR Paneer bhurji (60g) with 1 toast','1 glass toned milk','1 scoop whey in water'],maintain:['Moong dal cheela (3) with full-fat curd','OR Paneer bhurji (80g) with 2 toasts','1 glass full-fat milk','1 scoop whey in milk'],gain:['Quinoa upma (80g) with veggies + 80g paneer — double complete protein','OR Dal cheela (3-4) with full-fat curd','1 glass full-fat milk + 1 banana','1 scoop whey in full-fat milk']},{p:42,c:48,f:16},['B12 (dairy)','Calcium (paneer)','Vitamin D','Riboflavin']),
      mk('Mid-Morning','Apple',{loss:['Seasonal fruit (apple/pear/guava)','100g low-fat curd with jeera','5-6 almonds'],maintain:['Papaya or banana bowl','Greek yogurt (100g) + 1 tbsp hemp seeds','Handful of mixed nuts'],gain:['Banana + papaya','Greek yogurt (150g) with honey + hemp seeds','Almonds + cashews + 3 dates']},{p:14,c:26,f:6},['Probiotics','Potassium','Vitamin C','Calcium']),
      mk('Lunch','Bowl',{loss:['1 roti with minimal ghee','Palak paneer (70g paneer)','Moong dal (1 bowl)','Kachumber salad + 100g curd'],maintain:['2 rotis with ghee','Paneer bhurji or palak paneer (100g paneer)','Dal + brown rice — all 9 EAAs','Curd + kachumber salad'],gain:['3 rotis with ghee or 1.5 cups rice','Paneer curry (150g) + soya chunks','Dal + sabzi','Large curd + kachumber']},{p:36,c:58,f:14},['Calcium (paneer)','Vitamin K (palak)','Iron','Folate','Probiotics']),
      mk('Pre-Workout','Bolt',{loss:['100g Greek yogurt','1 fruit','Black coffee'],maintain:['Greek yogurt (100g) with banana & honey','Black coffee'],gain:['Greek yogurt (150g) + banana + honey','1 small peanut butter sandwich on whole wheat']},{p:16,c:32,f:5},['Probiotics','Potassium','Calcium','Caffeine']),
      mk('Post-Workout Dinner','Dinner',{loss:['1-2 rotis','Soya chunks curry (100g dry — PDCAAS 1.0)','Stir-fried greens','Raita','1 scoop whey post-workout'],maintain:['2 rotis or brown rice (3/4 cup)','Soya chunks curry (120g) or mixed dal','Stir-fried greens','Raita','1 scoop whey post-workout'],gain:['3 rotis or rice (1 cup) with ghee','Paneer curry (120g) + soya chunks','Dal + sabzi','Large raita','1 scoop whey in milk']},{p:44,c:54,f:12},['Leucine (whey, paneer)','Calcium','Iron (greens)','Magnesium']),
      mk('Before Bed','Moon',{loss:['Warm toned milk with cinnamon','10 almonds'],maintain:['Warm full-fat milk with cinnamon','Almonds + walnuts','1 tbsp mixed seeds'],gain:['Warm full-fat milk (300ml)','Paneer cubes (50g) — casein protein overnight','2 tbsp mixed seeds + 5 cashews']},{p:18,c:16,f:10},['Casein (milk — slow digest)','Tryptophan (sleep)','Calcium','Zinc']),
    ]},
  egg:{id:'egg',label:'Egg Diet',icon:'🥚',color:'#E8540D',description:'Eggs at breakfast & dinner — dairy throughout',
    proteinSources:['Whole Eggs','Egg Whites','Paneer','Greek Yogurt','Milk','Lentils','Chickpeas','Quinoa','Whey Protein'],
    meals:[
      mk('Breakfast','Sunrise',{loss:['5 egg whites + 1 whole egg scramble with spinach, onion & tomato (PDCAAS 1.0 — all 9 EAAs)','2 whole wheat toasts or 1 roti','1 glass toned milk','1 scoop whey in water'],maintain:['5 egg whites + 1 whole egg masala bhurji with vegetables','2 whole wheat toasts or 2 rotis','1 glass full-fat milk','1 scoop whey in milk'],gain:['3 whole eggs + 5 egg whites scramble/bhurji with veggies + 30g paneer cubes','3 whole wheat toasts or 2 rotis with ghee','1 glass full-fat milk + 1 banana','1 scoop whey in full-fat milk']},{p:52,c:42,f:16},['Vitamin B12 (eggs — highest bioavailability)','Choline (egg yolk)','Vitamin D','Selenium','Leucine']),
      mk('Mid-Morning','Apple',{loss:['1 apple or pear','100g low-fat Greek yogurt','5 almonds','Green tea'],maintain:['1 banana or seasonal fruit','100g Greek yogurt with mixed nuts','Handful of walnuts'],gain:['1 banana + papaya','Greek yogurt (100g) with honey + mixed nuts','3 dates + cashews']},{p:14,c:22,f:6},['Vitamin C','Calcium (yogurt)','Potassium','Magnesium']),
      mk('Lunch','Bowl',{loss:['1 roti or quinoa (1/2 cup — all 9 EAAs)','Egg curry (2 eggs) with minimal oil','Dal (moong/masoor)','Salad + 100g curd'],maintain:['2 rotis or quinoa (3/4 cup)','Egg curry (3 eggs) — complete protein','Dal + mixed vegetable sabzi','Curd + kachumber salad'],gain:['Brown rice (3/4 cup) + 2 rotis','Egg curry (3-4 eggs)','Dal + sabzi','Large bowl curd','1 tbsp flaxseeds on salad']},{p:40,c:56,f:14},['Vitamin D (egg yolk)','Iron (dal)','Folate','Zinc','Selenium','Calcium (curd)']),
      mk('Pre-Workout','Bolt',{loss:['1 small banana','Black coffee','Small handful of almonds'],maintain:['1 banana + 1 tbsp peanut butter','Nimbu pani or black coffee'],gain:['1 banana + dates (3)','1 tbsp peanut butter on rice cake','Pre-workout coffee']},{p:6,c:26,f:6},['Potassium','Natural energy','Caffeine']),
      mk('Post-Workout Dinner','Dinner',{loss:['1-2 rotis','Egg bhurji (3 eggs) with lots of vegetables — all 9 EAAs for muscle repair','Dal or sabzi side','Buttermilk','1 scoop whey post-workout'],maintain:['2 rotis or brown rice','Egg bhurji (4 eggs) or masala omelette — complete protein','Dal + sabzi','Raita','1 scoop whey post-workout'],gain:['3 rotis or brown rice (1 cup) with ghee','Egg bhurji (5 eggs) + paneer cubes added — high protein finish to the day','Dal + mixed sabzi','Large raita','1 scoop whey in milk']},{p:54,c:52,f:18},['Leucine (eggs + whey)','Glutamine','B12','Iron','Potassium']),
      mk('Before Bed','Moon',{loss:['Warm toned milk with cinnamon','2 egg whites (boiled) — lean protein'],maintain:['Warm full-fat milk with cinnamon','2 egg whites or 50g paneer — slow-digesting overnight protein','10 almonds'],gain:['Warm full-fat milk (300ml)','3 egg whites + 50g paneer — casein + egg whites for 8-hr recovery','1 tbsp mixed seeds']},{p:24,c:12,f:8},['Casein (milk)','Tryptophan (sleep)','Calcium','Choline','Zinc']),
    ]},
  nonveg:{id:'nonveg',label:'Non-Veg',icon:'🍗',color:'#E8540D',description:'Chicken, fish, eggs + dairy — all sources',
    proteinSources:['Chicken Breast','Fish (Rohu, Katla, Pomfret, Tuna)','Eggs','Paneer','Greek Yogurt','Mutton (limited)','Quinoa','Whey Protein'],
    meals:[
      mk('Breakfast','Sunrise',{loss:['4 egg whites + 1 whole egg scramble with spinach & tomato','1 whole wheat toast or 1 roti','1 glass toned milk','1 scoop whey in water'],maintain:['4 egg whites + 1 whole egg masala bhurji with vegetables — all 9 EAAs','2 toasts or 1 roti','1 glass full-fat milk + soaked almonds (6)','1 scoop whey in milk'],gain:['2 whole eggs + 5 egg whites scramble + 30g paneer','2-3 toasts or 2 rotis with ghee','1 glass full-fat milk + banana','1 scoop whey in full-fat milk']},{p:52,c:40,f:16},['Vitamin B12 (eggs)','Choline (egg yolk)','Vitamin D','Calcium (milk)','Leucine']),
      mk('Mid-Morning','Apple',{loss:['1 apple or pear','100g low-fat curd','5-6 almonds'],maintain:['1 fruit (banana/apple/papaya)','100g Greek yogurt + 1 tbsp hemp seeds — all 9 EAAs','Mixed nuts'],gain:['1 banana + papaya bowl','Greek yogurt (150g) with honey + hemp seeds','Almonds + cashews + dates (3)']},{p:14,c:28,f:7},['Potassium','Vitamin C','Probiotics','Calcium','Magnesium']),
      mk('Lunch','Bowl',{loss:['Brown rice (1/2 cup) or 1-2 rotis','Chicken curry (120g) or fish curry (120g) — complete protein','Dal (1 bowl)','Salad + 100g curd'],maintain:['Brown rice (3/4 cup) or 2 rotis','Chicken curry (150g) or fish curry (150g)','Dal + mixed vegetable sabzi','Salad + curd'],gain:['Brown rice (1 cup) or 3 rotis','Chicken curry (200g) or fish curry (200g)','Dal + aloo/mixed sabzi','Large curd + salad + flaxseeds']},{p:48,c:58,f:14},['Niacin (chicken)','Omega-3 (fish)','Iron','Zinc','Vitamin B6','Folate','Selenium']),
      mk('Pre-Workout','Bolt',{loss:['1 banana + black coffee'],maintain:['1 banana + 1 tbsp peanut butter','Black coffee or nimbu pani'],gain:['1 banana + 2-3 dates + peanut butter','1 tbsp peanut butter on toast','Coffee']},{p:8,c:30,f:8},['Potassium','Caffeine','Natural energy','Phosphorus']),
      mk('Post-Workout Dinner','Dinner',{loss:['1-2 rotis','Grilled chicken (150g) or fish (150g) — complete protein for repair','Stir-fried vegetables','Buttermilk','1 scoop whey post-workout'],maintain:['2 rotis or brown rice (3/4 cup)','Grilled chicken (200g) or fish (200g)','Stir-fried vegetables with olive oil','Buttermilk or nimbu pani','1 scoop whey post-workout'],gain:['3 rotis or rice (1 cup) with ghee','Grilled chicken (250g) or fish (250g) + 2 boiled eggs','Mixed vegetable sabzi','Buttermilk (large glass)','1 scoop whey in milk']},{p:58,c:54,f:14},['Leucine (chicken + whey)','Creatine (meat)','Omega-3 (fish)','Glutamine','Iron','B12','Zinc']),
      mk('Before Bed','Moon',{loss:['Warm toned milk with cinnamon','2 egg whites or 50g paneer'],maintain:['Warm full-fat milk with cinnamon','Paneer (50g) or 2 egg whites — overnight MPS','10 almonds'],gain:['Warm full-fat milk (300ml)','Paneer (80g) or 3 egg whites — 8-hr recovery','1 tbsp mixed seeds + 5 cashews']},{p:26,c:14,f:10},['Casein (slow-release)','Tryptophan (sleep)','Calcium','Zinc','B12','Magnesium']),
    ]},
};

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const genSample=()=>{
  const hl=[],wl=[];
  const now=new Date();
  for(let i=55;i>=0;i--){
    const d=new Date(now);d.setDate(d.getDate()-i);
    const w=+(88-(55-i)*0.09+(Math.random()-.5)*.7).toFixed(1);
    if(i%3===0||i<10) hl.push({id:gId(),userId:'vishal',date:d.toISOString().split('T')[0],weight:w,notes:''});
  }
  const bw=[60,62.5,65,67.5,70,72.5,75,77.5,80,82.5];
  for(let w=0;w<10;w++){
    const d=new Date(now);d.setDate(d.getDate()-(70-w*7));
    wl.push({id:gId(),userId:'vishal',splitId:'ppl',dayId:'ppl-pa',dayName:'Push Day A',date:d.toISOString().split('T')[0],
      exercises:[{name:'Flat Dumbbell Press',sets:[{reps:12,weight:bw[w]},{reps:11,weight:bw[w]},{reps:10,weight:bw[w]},{reps:9,weight:bw[w]}]},{name:'Overhead Press',sets:[{reps:10,weight:40+w*2.5},{reps:9,weight:40+w*2.5},{reps:8,weight:40+w*2.5}]}]});
  }
  return{hl,wl};
};
const SAMPLE=genSample();
const INIT_USERS=[{id:'vishal',name:'Vishal Chaudhary',email:'vishal@fittrack.com',password:'admin123',age:32,gender:'male',weight:83.5,height:175,weightGoal:78,weightGoalStart:85,goalWeeks:20,goalSetDate:'2024-11-01',activityLevel:'active',workoutDays:6,isAdmin:true,activeSplitId:'ppl',joinDate:'2024-01-15',avatar:'VC'}];

// ─── SHARED COMPONENTS ────────────────────────────────────────────────────────
const StatCard=({label,value,unit,Icon,sub,trend,onClick,badge})=>(
  <div className="card" style={{padding:'18px 16px',position:'relative',overflow:'hidden',cursor:onClick?'pointer':'default',transition:'transform .15s',userSelect:'none'}}
    onClick={onClick}
    onMouseEnter={e=>{if(onClick)e.currentTarget.style.transform='scale(1.01)';}}
    onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';}}>
    <div style={{position:'absolute',top:0,left:0,width:'100%',height:2,background:'var(--og)'}}/>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
      <div style={{width:34,height:34,borderRadius:9,background:'var(--o2)',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <Icon size={16} color="var(--o)"/>
      </div>
      {badge&&<span className="tag" style={{fontSize:9}}>{badge}</span>}
      {onClick&&!badge&&<ChevronRight size={14} color="var(--t3)"/>}
    </div>
    <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',marginBottom:4}}>{label}</div>
    <div className="bb" style={{fontSize:32,color:'var(--tx)',lineHeight:1}}>
      {value}<span style={{fontSize:14,fontWeight:400,color:'var(--t2)',marginLeft:3,fontFamily:"'DM Sans'"}}>{unit}</span>
    </div>
    {sub&&<div style={{fontSize:11,color:'var(--t2)',marginTop:4}}>{sub}</div>}
    {trend!==undefined&&<div style={{fontSize:11,marginTop:4,color:trend>0?'#FF6B6B':'#6BCB77',fontWeight:600}}>{trend>0?'▲':'▼'} {Math.abs(trend).toFixed(1)} kg this week</div>}
  </div>
);

const PH=({title,sub,action})=>(
  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20}}>
    <div>
      <div className="bb pt" style={{fontSize:32,color:'var(--tx)',lineHeight:1}}>{title}</div>
      <div className="abar" style={{marginTop:6}}/>
      {sub&&<div style={{fontSize:13,color:'var(--t2)',marginTop:-4}}>{sub}</div>}
    </div>
    {action}
  </div>
);

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const AuthModal=({users,setUsers,onLogin})=>{
  const [mode,setMode]=useState('login');
  const [f,setF]=useState({name:'',email:'',password:'',age:'',gender:'male',weight:'',height:'',activityLevel:'moderate',workoutDays:'4'});
  const [err,setErr]=useState('');
  const [sp,setSp]=useState(false);
  const [gMsg,setGMsg]=useState('');
  const sf=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const login=()=>{const u=users.find(u=>u.email===f.email&&u.password===f.password);u?onLogin(u):setErr('Invalid email or password');};
  const reg=()=>{
    if(!f.name||!f.email||!f.password)return setErr('Fill all required fields');
    if(users.find(u=>u.email===f.email))return setErr('Email already registered');
    const u={id:gId(),name:f.name,email:f.email,password:f.password,age:parseInt(f.age)||25,gender:f.gender,weight:parseFloat(f.weight)||70,height:parseFloat(f.height)||170,weightGoal:null,weightGoalStart:null,goalWeeks:null,goalSetDate:null,activityLevel:f.activityLevel||'moderate',workoutDays:parseInt(f.workoutDays)||4,isAdmin:false,activeSplitId:'ppl',joinDate:tod(),avatar:f.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)};
    setUsers(p=>[...p,u]);onLogin(u);
  };
  return (
    <div className="mo" style={{background:'radial-gradient(ellipse at 50% 100%,rgba(232,84,13,.18) 0%,rgba(0,0,0,.96) 65%)'}}>
      <div style={{width:'100%',maxWidth:400}}>
        <div style={{textAlign:'center',marginBottom:20}}>
          <div style={{width:54,height:54,borderRadius:14,background:'var(--og)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 10px'}}>
            <Dumbbell size={26} color="#fff"/>
          </div>
          <div className="bb" style={{fontSize:28}}>FITTRACK PRO</div>
          <div style={{fontSize:12,color:'var(--t3)'}}>by Vishal Chaudhary</div>
        </div>
        <div className="md" style={{maxHeight:'84vh'}}>
          <div style={{display:'flex',background:'var(--bg)',borderRadius:12,padding:3,marginBottom:18}}>
            {['login','register'].map(m=>(
              <button key={m} onClick={()=>{setMode(m);setErr('');}} style={{flex:1,padding:'9px 0',borderRadius:10,border:'none',cursor:'pointer',background:mode===m?'var(--o)':'transparent',color:mode===m?'#fff':'var(--t2)',fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:14,transition:'all .2s'}}>
                {m==='login'?'Log In':'Register'}
              </button>
            ))}
          </div>
          <button className="gb" onClick={()=>{setGMsg('Google Sign-In requires VITE_GOOGLE_CLIENT_ID setup. Use email login for now.');setTimeout(()=>setGMsg(''),4000);}}>
            <svg width="17" height="17" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </button>
          {gMsg&&<div style={{fontSize:11,color:'var(--o)',background:'var(--o3)',padding:'8px 12px',borderRadius:8,marginTop:8,border:'1px solid rgba(232,84,13,.2)'}}>{gMsg}</div>}
          <div className="dv">or</div>
          <div style={{display:'flex',flexDirection:'column',gap:11}}>
            {mode==='register'&&<div><label>Full Name *</label><input placeholder="Vishal Chaudhary" value={f.name} onChange={sf('name')}/></div>}
            <div><label>Email *</label><input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')}/></div>
            <div><label>Password *</label>
              <div style={{position:'relative'}}><input type={sp?'text':'password'} placeholder="••••••••" value={f.password} onChange={sf('password')}/>
                <button onClick={()=>setSp(!sp)} style={{position:'absolute',right:12,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',color:'var(--t3)',cursor:'pointer'}}>{sp?<EyeOff size={14}/>:<Eye size={14}/>}</button>
              </div>
            </div>
            {mode==='register'&&(<>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label>Age</label><input type="number" placeholder="25" value={f.age} onChange={sf('age')}/></div>
                <div><label>Gender</label><select value={f.gender} onChange={sf('gender')}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select></div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                <div><label>Weight (kg)</label><input type="number" placeholder="70" value={f.weight} onChange={sf('weight')}/></div>
                <div><label>Height (cm)</label><input type="number" placeholder="170" value={f.height} onChange={sf('height')}/></div>
              </div>
              <div><label>Activity Level</label><select value={f.activityLevel} onChange={sf('activityLevel')}>{Object.entries(ACTIVITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select></div>
              <div><label>Workout Days/Week</label><select value={f.workoutDays} onChange={sf('workoutDays')}>{[1,2,3,4,5,6,7].map(d=><option key={d} value={d}>{d} day{d>1?'s':''}/week</option>)}</select></div>
            </>)}
            {err&&<div style={{color:'var(--o)',fontSize:12,background:'var(--o3)',padding:'9px 12px',borderRadius:8,border:'1px solid rgba(232,84,13,.2)'}}>{err}</div>}
            <button className="btn-p" style={{width:'100%',padding:'13px',marginTop:2}} onClick={mode==='login'?login:reg}>{mode==='login'?'Log In →':'Create Account →'}</button>
            {mode==='login'&&<div style={{fontSize:11,color:'var(--t3)',textAlign:'center',padding:'7px',background:'var(--bg)',borderRadius:8}}>Demo: <strong style={{color:'var(--o)'}}>vishal@fittrack.com</strong> / <strong style={{color:'var(--o)'}}>admin123</strong></div>}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
const DashboardPage=({user,healthLogs,workoutLogs,splits,setHealthLogs,setUsers})=>{
  const [showLog,setShowLog]=useState(false);
  const [showGoal,setShowGoal]=useState(false);
  const [logWeight,setLogWeight]=useState(user.weight);
  const [logNote,setLogNote]=useState('');
  const [goalTarget,setGoalTarget]=useState(user.weightGoal||user.weight-5);
  const [goalWeeks,setGoalWeeks]=useState(user.goalWeeks||12);

  // Latest weight from logs (most recent entry)
  const allUserLogs=useMemo(()=>[...healthLogs].filter(l=>l.userId===user.id||l.userId==='vishal').sort((a,b)=>new Date(a.date)-new Date(b.date)),[healthLogs,user.id]);
  const latestWeight=allUserLogs.length>0?allUserLogs[allUserLogs.length-1].weight:user.weight;
  const bmi=calcBMI(latestWeight,user.height);
  const bmiCat=getBMICat(bmi);

  // Chart data — individual data points sorted by date
  const chartData=useMemo(()=>allUserLogs.map(l=>({date:fmt(l.date),weight:l.weight,raw:new Date(l.date).getTime()})),[allUserLogs]);

  // Weekly trend for trend indicator
  const trend=useMemo(()=>{
    if(allUserLogs.length<2)return undefined;
    const now=new Date();const weekAgo=new Date(now.getTime()-7*86400000);
    const recent=allUserLogs.filter(l=>new Date(l.date)>=weekAgo);
    const older=allUserLogs.filter(l=>new Date(l.date)<weekAgo);
    if(!recent.length||!older.length)return undefined;
    const avg=arr=>arr.reduce((s,l)=>s+l.weight,0)/arr.length;
    return +(avg(recent)-avg(older)).toFixed(1);
  },[allUserLogs]);

  const activeSplit=splits.find(s=>s.id===user.activeSplitId);
  const userWo=workoutLogs.filter(l=>l.userId===user.id||l.userId==='vishal');
  const recent=[...userWo].sort((a,b)=>new Date(b.date)-new Date(a.date)).slice(0,3);
  const thisWk=userWo.filter(l=>(new Date()-new Date(l.date))/86400000<=7).length;

  // Goal progress
  const goalPct=useMemo(()=>{
    if(!user.weightGoal||!user.weightGoalStart)return null;
    const total=Math.abs(user.weightGoalStart-user.weightGoal);
    const done=Math.abs(user.weightGoalStart-latestWeight);
    return clamp(Math.round(done/total*100),0,100);
  },[user,latestWeight]);

  const weeksLeft=useMemo(()=>{
    if(!user.goalSetDate||!user.goalWeeks)return null;
    const deadline=new Date(user.goalSetDate);deadline.setDate(deadline.getDate()+user.goalWeeks*7);
    const diff=(deadline-new Date())/86400000/7;
    return Math.max(0,Math.round(diff));
  },[user]);

  const kgLeft=user.weightGoal?Math.abs(latestWeight-user.weightGoal).toFixed(1):null;
  const isLoss=user.weightGoal&&latestWeight>user.weightGoal;

  const saveLog=()=>{
    const w=parseFloat(logWeight);
    if(!w||isNaN(w))return;
    setHealthLogs(p=>[...p,{id:gId(),userId:user.id,date:tod(),weight:w,notes:logNote}]);
    setLogNote('');setShowLog(false);
  };
  const saveGoal=()=>{
    setUsers(p=>p.map(u=>u.id===user.id?{...u,weightGoal:goalTarget,weightGoalStart:latestWeight,goalWeeks:goalWeeks,goalSetDate:tod()}:u));
    setShowGoal(false);
  };

  const wtItems=mkWtItems(30,200,0.5);
  const wkItems=mkIntItems(1,52);

  return (
    <div className="pg-in">
      <PH title={`Hey, ${user.name.split(' ')[0]}`} sub={new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}
        action={<button className="btn-p" style={{padding:'10px 18px',fontSize:13}} onClick={()=>setShowLog(true)}>+ Log Weight</button>}/>

      {/* Stats grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(148px,1fr))',gap:10,marginBottom:14}}>
        <StatCard label="Current Weight" value={latestWeight} unit="kg" Icon={Scale} trend={trend}/>
        <StatCard label="BMI" value={bmi||'—'} unit="" Icon={BarChart2} sub={bmiCat.label}/>
        <StatCard label="Height" value={user.height} unit="cm" Icon={Ruler}/>
        <StatCard label="Sessions / Week" value={thisWk} unit="" Icon={Flame} sub="this week"/>
        <StatCard label="All Time" value={userWo.length} unit="" Icon={Trophy} sub="sessions"/>
      </div>

      {/* Goal Progress Card */}
      <div className="card stripe" style={{padding:'18px 20px',marginBottom:14,cursor:'pointer',transition:'opacity .2s'}} onClick={()=>setShowGoal(true)}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{display:'flex',gap:10,alignItems:'center'}}>
            <div style={{width:34,height:34,borderRadius:9,background:'var(--o2)',display:'flex',alignItems:'center',justifyContent:'center'}}><Target size={16} color="var(--o)"/></div>
            <div>
              <div style={{fontWeight:700,fontSize:14}}>Weight Goal</div>
              <div style={{fontSize:11,color:'var(--t2)'}}>Tap to update your target</div>
            </div>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:6}}>
            <ChevronDown size={14} color="var(--t3)"/>
          </div>
        </div>
        {user.weightGoal?(
          <>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:14}}>
              {[{l:'Target',v:`${user.weightGoal} kg`},{l:'Remaining',v:`${kgLeft} kg ${isLoss?'to lose':'to gain'}`},{l:'Weeks Left',v:weeksLeft!==null?`${weeksLeft} wks`:'—'}].map(s=>(
                <div key={s.l} style={{background:'var(--c2)',borderRadius:10,padding:'10px 12px',border:'1px solid var(--bd)'}}>
                  <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:3}}>{s.l}</div>
                  <div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:'var(--o)',letterSpacing:'1px'}}>{s.v}</div>
                </div>
              ))}
            </div>
            <div style={{marginBottom:6,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{fontSize:12,color:'var(--t2)'}}>Goal Completion</div>
              <div style={{fontSize:12,color:'var(--o)',fontWeight:700}}>{goalPct}%</div>
            </div>
            <div className="pbar"><div className="pbar-fill" style={{width:`${goalPct}%`}}/></div>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:10,color:'var(--t3)',marginTop:5}}>
              <span>{user.weightGoalStart} kg (start)</span><span>{user.weightGoal} kg (goal)</span>
            </div>
          </>
        ):(
          <div style={{display:'flex',alignItems:'center',gap:8,padding:'12px',background:'var(--c2)',borderRadius:10,border:'1px dashed var(--bd2)'}}>
            <Target size={14} color="var(--t3)"/>
            <span style={{fontSize:13,color:'var(--t2)'}}>Set your target weight & timeline</span>
            <ChevronRight size={13} color="var(--t3)" style={{marginLeft:'auto'}}/>
          </div>
        )}
      </div>

      {/* Chart + BMI */}
      <div style={{display:'grid',gridTemplateColumns:'3fr 2fr',gap:12,marginBottom:12}} className="g2">
        <div className="card" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',marginBottom:12}}>Weight Trend</div>
          <ResponsiveContainer width="100%" height={170}>
            <AreaChart data={chartData}>
              <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E8540D" stopOpacity={.18}/><stop offset="95%" stopColor="#E8540D" stopOpacity={0}/></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/>
              <XAxis dataKey="date" tick={{fill:'var(--t3)',fontSize:9}} interval="preserveStartEnd"/>
              <YAxis domain={['auto','auto']} tick={{fill:'var(--t3)',fontSize:9}} width={38}/>
              <Tooltip contentStyle={{background:'var(--c2)',border:'1px solid var(--bd)',borderRadius:10,fontSize:12}}/>
              <Area type="monotone" dataKey="weight" stroke="#E8540D" strokeWidth={2} fill="url(#wg)" dot={{fill:'#E8540D',r:3,strokeWidth:0}} activeDot={{r:5}} name="Weight (kg)"/>
              {user.weightGoal&&<ReferenceLine y={user.weightGoal} stroke="rgba(232,84,13,.4)" strokeDasharray="5 5" label={{value:'Goal',fill:'var(--o)',fontSize:10,position:'insideTopRight'}}/>}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{padding:18,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:8}}>
          <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px'}}>BMI Status</div>
          <div className="bb" style={{fontSize:58,color:'var(--o)',lineHeight:1}}>{bmi||'—'}</div>
          <span className="tag" style={{fontSize:11}}>{bmiCat.label}</span>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:5,width:'100%',marginTop:4}}>
            {[{l:'Under',r:'<18.5'},{l:'Normal',r:'18.5–25'},{l:'Over',r:'25–30'},{l:'Obese',r:'>30'}].map(s=>(
              <div key={s.l} style={{textAlign:'center',padding:'5px',borderRadius:8,background:bmiCat.label.startsWith(s.l)?'var(--o2)':'var(--c2)',border:`1px solid ${bmiCat.label.startsWith(s.l)?'rgba(232,84,13,.35)':'var(--bd)'}`}}>
                <div style={{fontSize:9,color:bmiCat.label.startsWith(s.l)?'var(--o)':'var(--t3)',fontWeight:700}}>{s.l}</div>
                <div style={{fontSize:8,color:'var(--t3)'}}>{s.r}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Split + Recent */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1.4fr',gap:12}} className="g2">
        <div className="card" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:12}}>Active Split</div>
          {activeSplit?<>
            <div style={{fontFamily:"'Bebas Neue'",fontSize:20,color:'var(--o)',letterSpacing:'1px',marginBottom:4}}>{activeSplit.emoji} {activeSplit.name}</div>
            <div style={{fontSize:12,color:'var(--t2)',marginBottom:12}}>{activeSplit.description}</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:4}}>
              {activeSplit.schedule.map((d,i)=>(
                <div key={i} style={{padding:'3px 8px',borderRadius:6,fontSize:10,fontWeight:600,background:d==='Rest'?'var(--c2)':'var(--o2)',color:d==='Rest'?'var(--t3)':'var(--o)',border:`1px solid ${d==='Rest'?'var(--bd)':'rgba(232,84,13,.3)'}`}}>D{i+1}: {d}</div>
              ))}
            </div>
          </>:<div style={{color:'var(--t2)',fontSize:13}}>No split active</div>}
        </div>
        <div className="card" style={{padding:18}}>
          <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:12}}>Recent Sessions</div>
          {recent.length===0?<div style={{color:'var(--t3)',fontSize:13}}>No sessions yet — go crush it!</div>:
            recent.map(w=>(
              <div key={w.id} className="row-sep" style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 0'}}>
                <div>
                  <div style={{fontWeight:600,fontSize:14}}>{w.dayName}</div>
                  <div style={{fontSize:11,color:'var(--t2)',marginTop:2}}>{fmt(w.date)} · {w.exercises?.length||0} exercises</div>
                </div>
                <div style={{width:24,height:24,borderRadius:'50%',background:'var(--o2)',display:'flex',alignItems:'center',justifyContent:'center'}}><Check size={12} color="var(--o)"/></div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Log Weight Modal */}
      {showLog&&(
        <div className="mo">
          <div className="md" style={{maxWidth:360}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <div className="bb" style={{fontSize:22}}>Log Weight</div>
              <button className="btn-g" style={{padding:'5px 9px'}} onClick={()=>setShowLog(false)}><X size={14}/></button>
            </div>
            <div style={{marginBottom:16}}>
              <label>Select Weight (kg)</label>
              <ScrollPicker value={logWeight} onChange={setLogWeight} items={wtItems} unit="kg" fmtVal={v=>v.toFixed(1)}/>
            </div>
            <div style={{marginBottom:16}}><label>Notes (optional)</label><input placeholder="Post-morning, post-workout..." value={logNote} onChange={e=>setLogNote(e.target.value)}/></div>
            <button className="btn-p" style={{width:'100%',padding:'13px'}} onClick={saveLog}>Save Log</button>
          </div>
        </div>
      )}

      {/* Set Goal Modal */}
      {showGoal&&(
        <div className="mo">
          <div className="md" style={{maxWidth:400}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:8}}>
              <div className="bb" style={{fontSize:22}}>Set Weight Goal</div>
              <button className="btn-g" style={{padding:'5px 9px'}} onClick={()=>setShowGoal(false)}><X size={14}/></button>
            </div>
            <div style={{fontSize:12,color:'var(--t2)',marginBottom:18}}>Current: <strong style={{color:'var(--o)'}}>{latestWeight} kg</strong> · Your goal drives the calorie recommendations on the Diet page.</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:16}}>
              <div>
                <label>Target Weight (kg)</label>
                <ScrollPicker value={goalTarget} onChange={setGoalTarget} items={wtItems} unit="kg" fmtVal={v=>v.toFixed(1)}/>
              </div>
              <div>
                <label>Timeline (weeks)</label>
                <ScrollPicker value={goalWeeks} onChange={setGoalWeeks} items={wkItems} unit="wks"/>
              </div>
            </div>
            {goalTarget&&goalWeeks&&(
              <div style={{padding:'12px 14px',background:'var(--o3)',borderRadius:10,border:'1px solid rgba(232,84,13,.2)',fontSize:12,color:'var(--o)',marginBottom:16}}>
                {goalTarget<latestWeight
                  ?`Lose ${(latestWeight-goalTarget).toFixed(1)} kg in ${goalWeeks} weeks → ~${Math.round((latestWeight-goalTarget)*7700/goalWeeks/7)} kcal/day deficit`
                  :goalTarget>latestWeight
                  ?`Gain ${(goalTarget-latestWeight).toFixed(1)} kg in ${goalWeeks} weeks — diet page will show surplus plan`
                  :'Maintain current weight — diet page will show maintenance plan'}
              </div>
            )}
            <div style={{display:'flex',gap:10}}>
              <button className="btn-p" style={{flex:1,padding:'13px'}} onClick={saveGoal}>Set Goal</button>
              {user.weightGoal&&<button className="btn-g" style={{padding:'13px 16px'}} onClick={()=>{setUsers(p=>p.map(u=>u.id===user.id?{...u,weightGoal:null,weightGoalStart:null,goalWeeks:null}:u));setShowGoal(false);}}>Clear</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── SPLITS PAGE ──────────────────────────────────────────────────────────────
const SplitsPage=({user,splits,setSplits,setActiveSplitId,setPage,isAdmin})=>{
  const [exp,setExp]=useState(null);
  const [expDay,setExpDay]=useState(null);
  const [editEx,setEditEx]=useState(null);
  const [addEx,setAddEx]=useState(null);
  const [newEx,setNewEx]=useState({name:'',sets:3,repsRange:'8-12',muscle:'',notes:''});
  const [addSp,setAddSp]=useState(false);
  const [ns,setNs]=useState({name:'',emoji:'💪',description:''});
  const pick=sid=>{if(splits.find(s=>s.id===sid)?.comingSoon)return;setActiveSplitId(sid);setTimeout(()=>setPage('workout'),250);};
  const updEx=(sId,dId,eId,data)=>setSplits(p=>p.map(s=>s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:d.exercises.map(e=>e.id!==eId?e:{...e,...data})})}));
  const delEx=(sId,dId,eId)=>setSplits(p=>p.map(s=>s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:d.exercises.filter(e=>e.id!==eId)})}));
  const addExFn=(sId,dId)=>{const e={id:gId(),...newEx,sets:parseInt(newEx.sets)};setSplits(p=>p.map(s=>s.id!==sId?s:{...s,days:s.days.map(d=>d.id!==dId?d:{...d,exercises:[...d.exercises,e]})}));setNewEx({name:'',sets:3,repsRange:'8-12',muscle:'',notes:''});setAddEx(null);};
  const addSpFn=()=>{const s={id:gId(),...ns,color:'#E8540D',schedule:['Day 1','Rest'],days:[{id:gId(),name:'Day 1',type:'custom',exercises:[]},{id:gId(),name:'Rest',type:'rest',exercises:[]}]};setSplits(p=>[...p,s]);setNs({name:'',emoji:'💪',description:''});setAddSp(false);};
  return (
    <div className="pg-in">
      <PH title="Choose Split" sub="Select a program — auto-redirects to tracker" action={isAdmin&&<button className="btn-p" style={{padding:'9px 16px',fontSize:13}} onClick={()=>setAddSp(true)}>+ New Split</button>}/>
      {splits.map(split=>(
        <div key={split.id} className="card" style={{marginBottom:10}}>
          <div style={{padding:'16px 18px',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <div style={{display:'flex',gap:12,alignItems:'center',flex:1,cursor:'pointer'}} onClick={()=>setExp(exp===split.id?null:split.id)}>
              <div style={{fontSize:22}}>{split.emoji}</div>
              <div><div className="bb" style={{fontSize:17,color:'var(--o)',letterSpacing:'1px'}}>{split.name}</div><div style={{fontSize:12,color:'var(--t2)'}}>{split.description}</div></div>
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center'}}>
              {split.comingSoon?<span className="tag tag-d">Soon</span>:user.activeSplitId===split.id?<span className="tag"><Check size={10}/> Active</span>:<button className="btn-p" style={{padding:'7px 14px',fontSize:13}} onClick={()=>pick(split.id)}>Select →</button>}
              <ChevronDown size={14} color="var(--t3)" style={{transform:exp===split.id?'rotate(180deg)':'',transition:'.2s',cursor:'pointer',flexShrink:0}} onClick={()=>setExp(exp===split.id?null:split.id)}/>
            </div>
          </div>
          {exp===split.id&&!split.comingSoon&&(
            <div style={{borderTop:'1px solid var(--bd)',padding:'14px 18px 18px'}}>
              <div style={{display:'flex',gap:4,flexWrap:'wrap',marginBottom:12}}>
                {split.schedule.map((d,i)=><div key={i} style={{padding:'3px 8px',borderRadius:6,fontSize:9,fontWeight:700,background:d==='Rest'?'var(--c2)':'var(--o2)',color:d==='Rest'?'var(--t3)':'var(--o)',border:`1px solid ${d==='Rest'?'var(--bd)':'rgba(232,84,13,.25)'}`}}>D{i+1}: {d}</div>)}
              </div>
              {split.days.filter(d=>d.type!=='rest').map(day=>(
                <div key={day.id} style={{background:'var(--bg)',borderRadius:10,marginBottom:7}}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'10px 14px',cursor:'pointer'}} onClick={()=>setExpDay(expDay===day.id?null:day.id)}>
                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <span className="tag" style={{fontSize:9}}>{day.type}</span>
                      <span style={{fontWeight:600,fontSize:13}}>{day.name}</span>
                      <span style={{fontSize:11,color:'var(--t3)'}}>{day.exercises.length} ex</span>
                    </div>
                    <ChevronDown size={12} color="var(--t3)" style={{transform:expDay===day.id?'rotate(180deg)':'',transition:'.2s'}}/>
                  </div>
                  {expDay===day.id&&(
                    <div style={{padding:'0 14px 14px'}}>
                      {day.exercises.map(ex=>(
                        <div key={ex.id} className="row-sep" style={{padding:'8px 0'}}>
                          {editEx===ex.id&&isAdmin?(
                            <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:5}}>
                              <input value={ex.name} onChange={e=>updEx(split.id,day.id,ex.id,{name:e.target.value})} style={{fontSize:12,padding:'5px 8px'}}/>
                              <input type="number" value={ex.sets} onChange={e=>updEx(split.id,day.id,ex.id,{sets:parseInt(e.target.value)})} style={{fontSize:12,padding:'5px 8px'}}/>
                              <input value={ex.repsRange} onChange={e=>updEx(split.id,day.id,ex.id,{repsRange:e.target.value})} style={{fontSize:12,padding:'5px 8px'}}/>
                              <input value={ex.muscle} onChange={e=>updEx(split.id,day.id,ex.id,{muscle:e.target.value})} style={{fontSize:12,padding:'5px 8px'}}/>
                            </div>
                          ):(
                            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                              <div><span style={{fontWeight:500,fontSize:13}}>{ex.name}</span>{ex.variants&&<span style={{fontSize:10,color:'var(--t3)',marginLeft:5}}>(options)</span>}<span style={{fontSize:12,color:'var(--t2)',marginLeft:8}}>{ex.sets}×{ex.repsRange}</span>{ex.muscle&&<span style={{fontSize:10,color:'var(--o)',marginLeft:8}}>{ex.muscle}</span>}</div>
                              {isAdmin&&<div style={{display:'flex',gap:5}}><button className="btn-g" style={{padding:'2px 7px',fontSize:10}} onClick={()=>setEditEx(editEx===ex.id?null:ex.id)}>{editEx===ex.id?'✓':<Edit2 size={10}/>}</button><button className="btn-d" style={{padding:'2px 7px'}} onClick={()=>delEx(split.id,day.id,ex.id)}><Trash2 size={10}/></button></div>}
                            </div>
                          )}
                        </div>
                      ))}
                      {isAdmin&&(addEx===day.id?(
                        <div style={{marginTop:8,display:'grid',gap:7}}>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:7}}>
                            <input placeholder="Exercise" value={newEx.name} onChange={e=>setNewEx(p=>({...p,name:e.target.value}))} style={{fontSize:12,padding:'7px 10px'}}/>
                            <input type="number" placeholder="Sets" value={newEx.sets} onChange={e=>setNewEx(p=>({...p,sets:e.target.value}))} style={{fontSize:12,padding:'7px 10px'}}/>
                            <input placeholder="8-12" value={newEx.repsRange} onChange={e=>setNewEx(p=>({...p,repsRange:e.target.value}))} style={{fontSize:12,padding:'7px 10px'}}/>
                          </div>
                          <input placeholder="Muscle group" value={newEx.muscle} onChange={e=>setNewEx(p=>({...p,muscle:e.target.value}))} style={{fontSize:12,padding:'7px 10px'}}/>
                          <div style={{display:'flex',gap:7}}><button className="btn-p" style={{padding:'7px 14px',fontSize:12}} onClick={()=>addExFn(split.id,day.id)}>Add</button><button className="btn-g" style={{fontSize:12}} onClick={()=>setAddEx(null)}>Cancel</button></div>
                        </div>
                      ):<button className="btn-g" style={{marginTop:7,width:'100%',fontSize:11}} onClick={()=>setAddEx(day.id)}>+ Add Exercise</button>)}
                    </div>
                  )}
                </div>
              ))}
              {user.activeSplitId!==split.id&&<button className="btn-p" style={{width:'100%',marginTop:10,padding:'12px'}} onClick={()=>pick(split.id)}>Select & Start Tracking →</button>}
            </div>
          )}
          {exp===split.id&&split.comingSoon&&(
            <div style={{borderTop:'1px solid var(--bd)',padding:'36px 20px',textAlign:'center'}}>
              <Dumbbell size={36} color="var(--t3)" style={{marginBottom:10}}/>
              <div className="bb" style={{fontSize:20,color:'var(--o)'}}>Coming Soon</div>
              <div style={{color:'var(--t2)',fontSize:12,marginTop:6}}>Powerlifting programming with Squat, Bench & Deadlift cycles is in development.</div>
            </div>
          )}
        </div>
      ))}
      {addSp&&(
        <div className="mo"><div className="md" style={{maxWidth:400}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:18}}><div className="bb" style={{fontSize:22}}>New Split</div><button className="btn-g" style={{padding:'5px 9px'}} onClick={()=>setAddSp(false)}><X size={14}/></button></div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div><label>Name</label><input placeholder="e.g. Bro Split" value={ns.name} onChange={e=>setNs(p=>({...p,name:e.target.value}))}/></div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 3fr',gap:10}}><div><label>Emoji</label><input value={ns.emoji} onChange={e=>setNs(p=>({...p,emoji:e.target.value}))}/></div><div><label>Description</label><input placeholder="5 days/week..." value={ns.description} onChange={e=>setNs(p=>({...p,description:e.target.value}))}/></div></div>
            <button className="btn-p" style={{width:'100%',padding:'12px'}} onClick={addSpFn}>Create Split</button>
          </div>
        </div></div>
      )}
    </div>
  );
};

// ─── WORKOUT PAGE ─────────────────────────────────────────────────────────────
const WorkoutPage=({user,splits,workoutLogs,setWorkoutLogs})=>{
  const activeSplit=splits.find(s=>s.id===user.activeSplitId)||splits[0];
  const [session,setSession]=useState(null);
  const [done,setDone]=useState(false);
  const wDays=activeSplit?.days.filter(d=>d.type!=='rest')||[];
  const start=day=>{
    const exs=day.exercises.map(ex=>{const prev=workoutLogs.filter(l=>(l.userId===user.id||l.userId==='vishal')&&l.dayId===day.id).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];const pe=prev?.exercises?.find(e=>e.name===ex.name);return{...ex,sv:ex.variants?ex.variants[0]:null,sets:Array.from({length:ex.sets},(_,i)=>{const ps=pe?.sets?.[i];return{reps:ps?.reps||ex.repsRange?.split('-')[0]||8,weight:ps?.weight||0,done:false};})};});
    setSession({day,exs,notes:''});setDone(false);
  };
  const upd=(ei,si,f,v)=>setSession(p=>{const e=[...p.exs];const s=[...e[ei].sets];s[si]={...s[si],[f]:f==='done'?v:parseFloat(v)||0};e[ei]={...e[ei],sets:s};return{...p,exs:e};});
  const addS=ei=>setSession(p=>{const e=[...p.exs];const ls=e[ei].sets[e[ei].sets.length-1];e[ei]={...e[ei],sets:[...e[ei].sets,{...ls,done:false}]};return{...p,exs:e};});
  const rmS=(ei,si)=>setSession(p=>{const e=[...p.exs];e[ei]={...e[ei],sets:e[ei].sets.filter((_,i)=>i!==si)};return{...p,exs:e};});
  const setV=(ei,v)=>setSession(p=>{const e=[...p.exs];e[ei]={...e[ei],sv:v};return{...p,exs:e};});
  const finish=()=>{
    const log={id:gId(),userId:user.id,splitId:activeSplit.id,dayId:session.day.id,dayName:session.day.name,date:tod(),notes:session.notes,exercises:session.exs.map(ex=>({name:ex.sv||ex.name,sets:ex.sets.filter(s=>s.done).map(s=>({reps:s.reps,weight:s.weight}))})).filter(ex=>ex.sets.length>0)};
    setWorkoutLogs(p=>[...p,log]);setDone(true);
  };
  if(done)return(<div className="pg-in" style={{textAlign:'center',padding:'80px 20px'}}><Trophy size={52} color="var(--o)" style={{marginBottom:14}}/><div className="bb" style={{fontSize:36,color:'var(--o)'}}>WORKOUT COMPLETE!</div><div style={{color:'var(--t2)',marginTop:8,marginBottom:28}}>Session saved. Recovery starts now.</div><button className="btn-p" style={{padding:'13px 28px',fontSize:16}} onClick={()=>{setSession(null);setDone(false);}}>Log Another</button></div>);
  if(session)return(
    <div className="pg-in">
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:20}}><button className="btn-g" onClick={()=>setSession(null)} style={{fontSize:13}}>← Back</button><div><div className="bb" style={{fontSize:22}}>{session.day.name}</div><div style={{fontSize:12,color:'var(--t2)'}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}</div></div></div>
      {session.exs.map((ex,ei)=>(
        <div key={ex.id} className="card" style={{marginBottom:10,padding:16}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
            <div><div className="bb" style={{fontSize:16}}>{ex.sv||ex.name}</div>{ex.variants&&<select value={ex.sv||ex.variants[0]} onChange={e=>setV(ei,e.target.value)} style={{marginTop:5,fontSize:12,padding:'4px 10px',width:'auto'}}>{ex.variants.map(v=><option key={v} value={v}>{v}</option>)}</select>}<div style={{marginTop:5,display:'flex',gap:5}}>{ex.muscle&&<span className="tag" style={{fontSize:9}}>{ex.muscle}</span>}{ex.repsRange&&<span style={{fontSize:10,color:'var(--t3)'}}>Target: {ex.repsRange}</span>}</div></div>
            <button className="btn-g" style={{fontSize:11,padding:'5px 9px'}} onClick={()=>addS(ei)}>+ Set</button>
          </div>
          <div className="ex-r" style={{marginBottom:5}}>{['SET','REPS','KG','DONE'].map(h=><div key={h} style={{fontSize:9,color:'var(--t3)',fontWeight:700}}>{h}</div>)}</div>
          {ex.sets.map((s,si)=>(
            <div key={si} className="ex-r" style={{marginBottom:5,opacity:s.done?.6:1}}>
              <div style={{fontSize:12,color:'var(--t2)',fontWeight:700}}>{si+1}</div>
              <input type="number" value={s.reps} onChange={e=>upd(ei,si,'reps',e.target.value)} style={{padding:'7px 8px',fontSize:13}}/>
              <input type="number" step=".5" value={s.weight} onChange={e=>upd(ei,si,'weight',e.target.value)} style={{padding:'7px 8px',fontSize:13}}/>
              <div style={{display:'flex',gap:3}}>
                <button onClick={()=>upd(ei,si,'done',!s.done)} style={{flex:1,background:s.done?'var(--o2)':'var(--c3)',border:`1px solid ${s.done?'var(--o)':'var(--bd)'}`,borderRadius:8,color:s.done?'var(--o)':'var(--t3)',cursor:'pointer',padding:'7px 0',fontSize:14,transition:'all .15s'}}>{s.done?'✓':'○'}</button>
                {ex.sets.length>1&&<button onClick={()=>rmS(ei,si)} style={{background:'transparent',border:'1px solid var(--bd)',borderRadius:8,color:'var(--t3)',cursor:'pointer',padding:'7px 5px',fontSize:10}}>✕</button>}
              </div>
            </div>
          ))}
          {ex.notes&&<div style={{fontSize:10,color:'var(--t3)',marginTop:5,fontStyle:'italic'}}>💡 {ex.notes}</div>}
        </div>
      ))}
      <div className="card" style={{marginBottom:10,padding:14}}><label>Session Notes</label><textarea rows={2} placeholder="PRs, form notes, how it felt..." value={session.notes} onChange={e=>setSession(p=>({...p,notes:e.target.value}))} style={{resize:'vertical'}}/></div>
      <button className="btn-p" style={{width:'100%',padding:'14px',fontSize:16,borderRadius:12}} onClick={finish}>Finish Workout</button>
    </div>
  );
  return(
    <div className="pg-in">
      <PH title="Workout Tracker" sub={activeSplit?`${activeSplit.emoji} ${activeSplit.name}`:'Select a split first'}/>
      {!activeSplit?<div style={{textAlign:'center',padding:40,color:'var(--t2)'}}>Go to Splits to select a program first</div>:
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(265px,1fr))',gap:10}}>
          {wDays.map(day=>{
            const last=workoutLogs.filter(l=>(l.userId===user.id||l.userId==='vishal')&&l.dayId===day.id).sort((a,b)=>new Date(b.date)-new Date(a.date))[0];
            return(
              <div key={day.id} className="card" style={{padding:16,cursor:'pointer',transition:'transform .2s,border-color .2s'}} onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.borderColor='var(--o)';}} onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.borderColor='var(--bd)';}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}><span className="tag" style={{fontSize:9}}>{day.type}</span>{last&&<span style={{fontSize:9,color:'var(--t3)'}}>Last: {fmt(last.date)}</span>}</div>
                <div className="bb" style={{fontSize:16,marginBottom:8}}>{day.name}</div>
                {day.exercises.slice(0,4).map(ex=><div key={ex.id} style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--t2)',padding:'3px 0',borderBottom:'1px solid var(--bd)'}}><span>{ex.name}</span><span style={{color:'var(--o)'}}>{ex.sets}×{ex.repsRange}</span></div>)}
                {day.exercises.length>4&&<div style={{fontSize:10,color:'var(--t3)',marginTop:4}}>+{day.exercises.length-4} more</div>}
                <button className="btn-p" style={{width:'100%',marginTop:12,padding:'10px'}} onClick={()=>start(day)}>Start Session →</button>
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
  const autoGoal=goalFromWeight(user.weight,user.weightGoal);
  const [diet,setDiet]=useState('nonveg');
  const dt=DIET_TYPES[diet];
  const bmr=calcBMR(user.weight,user.height,user.age,user.gender);
  const tdee=calcTDEE(bmr,user.activityLevel||'moderate');
  const goal=autoGoal;
  const goalKcal=goal==='loss'?tdee-500:goal==='gain'?tdee+400:tdee;
  const prot=goal==='loss'?Math.round(user.weight*2.2):goal==='gain'?Math.round(user.weight*2.0):Math.round(user.weight*1.8);
  const carbs=Math.round((goalKcal*(goal==='loss'?.38:.44))/4);
  const fat=Math.round((goalKcal*.26)/9);
  const wheyScoops=prot>=180?Math.min(Math.ceil((prot-100)/25),4):2;
  const wheyProt=wheyScoops*25;
  const foodProt=prot-wheyProt;
  const gKey=goal==='loss'?'loss':goal==='gain'?'gain':'maintain';
  const bmi=calcBMI(user.weight,user.height);

  return(
    <div className="pg-in">
      <PH title="Diet Guide" sub={`Personalised for ${user.name.split(' ')[0]} · ${user.weightGoal?`Goal: ${user.weightGoal}kg`:'No goal set'}`}/>

      {/* Stats bar */}
      <div className="card stripe" style={{padding:'14px 16px',marginBottom:14,display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
        <div style={{fontSize:10,color:'var(--t3)',fontWeight:700}}>BODY STATS</div>
        {[{l:'Weight',v:`${user.weight}kg`},{l:'Height',v:`${user.height}cm`},{l:'BMI',v:bmi},{l:'TDEE',v:`${tdee}kcal`},{l:'Activity',v:ACTIVITY[user.activityLevel||'moderate']?.label.split('(')[0].trim()}].map(s=>(
          <div key={s.l} style={{padding:'5px 11px',background:'var(--c3)',borderRadius:8,border:'1px solid var(--bd)'}}>
            <div style={{fontSize:9,color:'var(--t3)',fontWeight:700,textTransform:'uppercase'}}>{s.l}</div>
            <div style={{fontSize:13,fontWeight:600,marginTop:1}}>{s.v}</div>
          </div>
        ))}
      </div>

      {/* Auto-detected goal — locked if weight goal is set */}
      <div className="card" style={{padding:'16px 18px',marginBottom:14,borderLeft:'3px solid var(--o)',borderRadius:'0 14px 14px 0'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontWeight:700,fontSize:15}}>{goal==='loss'?'🔥 Weight Loss Plan':goal==='gain'?'💪 Weight Gain Plan':'⚖️ Maintenance Plan'}</div>
            <div style={{fontSize:12,color:'var(--t2)',marginTop:2}}>
              {goal==='loss'?`${goalKcal} kcal/day — 500 kcal deficit for ~0.5kg/week fat loss`:goal==='gain'?`${goalKcal} kcal/day — 400 kcal surplus for lean muscle gain`:`${goalKcal} kcal/day — maintaining current body weight`}
            </div>
          </div>
          {user.weightGoal?<span className="tag" style={{fontSize:9}}>Auto</span>:<span style={{fontSize:11,color:'var(--t3)'}}>Set goal on Dashboard for auto</span>}
        </div>
      </div>

      {/* Macros */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8,marginBottom:14}} className="g4">
        {[{l:'Calories',v:goalKcal,u:'kcal'},{l:'Protein',v:prot,u:'g'},{l:'Carbs',v:carbs,u:'g'},{l:'Fat',v:fat,u:'g'}].map(m=>(
          <div key={m.l} className="card" style={{padding:'12px 14px',textAlign:'center'}}>
            <div style={{fontSize:9,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:3}}>{m.l}</div>
            <div className="bb" style={{fontSize:22,color:'var(--o)',letterSpacing:'1px'}}>{m.v}<span style={{fontSize:11,color:'var(--t2)',fontFamily:"'DM Sans'"}}>{m.u}</span></div>
          </div>
        ))}
      </div>

      {/* Whey inline */}
      <div className="card" style={{padding:'12px 16px',marginBottom:14,display:'flex',gap:10,alignItems:'center',flexWrap:'wrap'}}>
        <div style={{width:32,height:32,borderRadius:8,background:'var(--o2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Activity size={14} color="var(--o)"/></div>
        <div style={{flex:1}}>
          <div style={{fontWeight:600,fontSize:13}}>Whey Protein — {wheyScoops} scoop{wheyScoops>1?'s':''}/day ({wheyProt}g)</div>
          <div style={{fontSize:11,color:'var(--t2)',marginTop:2}}>{foodProt}g from food + {wheyProt}g from whey = {prot}g target. {diet==='vegan'?'Use pea+rice blend.':'Brands: MuscleBlaze, ON Gold Standard, MyProtein.'}</div>
        </div>
        <span className="tag" style={{fontSize:9}}>{wheyScoops} × 25g</span>
      </div>

      {/* Diet type selector */}
      <div style={{display:'flex',gap:8,flexWrap:'wrap',marginBottom:14}}>
        {Object.values(DIET_TYPES).map(d=><button key={d.id} onClick={()=>setDiet(d.id)} style={{padding:'9px 16px',borderRadius:10,cursor:'pointer',fontSize:13,fontWeight:600,transition:'all .2s',background:diet===d.id?'var(--o)':'transparent',color:diet===d.id?'#fff':'var(--t2)',border:`1px solid ${diet===d.id?'var(--o)':'var(--bd)'}`}}>{d.icon} {d.label}</button>)}
      </div>

      {/* Meals */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(305px,1fr))',gap:12}}>
        {dt.meals.map((meal,i)=>{
          const items=meal.items[gKey]||meal.items.maintain||[];
          const wheyLines=[];
          if(meal.label==='Breakfast')wheyLines.push(`🥤 1 scoop ${diet==='vegan'?'plant protein (pea+rice)':'whey protein'} — complete protein, all 9 EAAs`);
          if(meal.label==='Post-Workout Dinner')wheyLines.push('🥤 1 scoop whey within 30 min post-workout — peak muscle protein synthesis');
          if(wheyScoops>=3&&meal.label==='Mid-Morning')wheyLines.push(`🥤 Extra scoop protein — needed to hit ${prot}g target`);
          if(wheyScoops>=4&&meal.label==='Before Bed')wheyLines.push('🥤 1 scoop casein/whey before bed — 8-hr overnight recovery');
          const all=[...items,...wheyLines];
          const MIcon={Sunrise:TrendingUp,Apple:Salad,Bowl:Salad,Bolt:Flame,Dinner:Salad,Moon:Activity}[meal.icon]||Activity;
          return(
            <div key={i} className="card" style={{padding:16}}>
              <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:12}}>
                <div style={{width:32,height:32,borderRadius:8,background:'var(--o2)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><MIcon size={14} color="var(--o)"/></div>
                <div style={{flex:1}}>
                  <div className="bb" style={{fontSize:15,letterSpacing:'1px'}}>{meal.label}</div>
                </div>
                {goal==='gain'&&<span className="tag" style={{fontSize:8}}>+Portions</span>}
                {goal==='loss'&&<span className="tag" style={{fontSize:8}}>-Portions</span>}
              </div>
              {all.map((item,j)=>{const isW=item.startsWith('🥤');return(
                <div key={j} style={{display:'flex',gap:6,alignItems:'flex-start',padding:'5px 0',fontSize:12,color:isW?'var(--o)':'var(--t2)',borderBottom:j<all.length-1?'1px solid var(--bd)':'',background:isW?'var(--o3)':'transparent',borderRadius:isW?6:0,paddingLeft:isW?6:0,marginBottom:isW?2:0}}>
                  {!isW&&<span style={{color:'var(--o)',flexShrink:0,marginTop:1}}>·</span>}
                  <span>{item}</span>
                </div>
              );})}
              <div style={{marginTop:10,paddingTop:10,borderTop:'1px solid var(--bd)'}}>
                <div style={{display:'flex',gap:5,flexWrap:'wrap',marginBottom:5}}>
                  {[{l:'P',v:meal.macros.p},{l:'C',v:meal.macros.c},{l:'F',v:meal.macros.f}].map(m=>(
                    <div key={m.l} style={{padding:'2px 8px',background:'var(--o2)',borderRadius:6,fontSize:11,border:'1px solid rgba(232,84,13,.18)'}}>
                      <span style={{color:'var(--o)',fontWeight:700}}>{m.l}</span><span style={{color:'var(--t2)',marginLeft:2}}>{m.v}g</span>
                    </div>
                  ))}
                  <div style={{padding:'2px 8px',background:'var(--c3)',borderRadius:6,fontSize:11,border:'1px solid var(--bd)',color:'var(--t3)'}}>~{meal.macros.p*4+meal.macros.c*4+meal.macros.f*9}kcal</div>
                </div>
                <div style={{fontSize:10,color:'var(--t3)',lineHeight:1.6}}><span style={{color:'var(--o)',fontWeight:700}}>Micros: </span>{meal.micros.join(' · ')}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="card stripe" style={{marginTop:12,padding:'12px 16px'}}>
        <div style={{fontSize:11,color:'var(--t2)'}}>📌 Scale portions to hit <strong style={{color:'var(--o)'}}>{goalKcal} kcal/day</strong>.{goal==='loss'&&' 500 kcal deficit = ~0.5kg/week fat loss.'}{goal==='gain'&&' 400 kcal surplus for lean muscle gain.'}{` Whey: ${wheyScoops} scoops (${wheyProt}g) + ${foodProt}g from food.`}{diet==='vegan'&&' Plant protein (pea+rice) covers all 9 EAAs.'}</div>
      </div>
      <div className="card" style={{padding:'12px 16px',marginTop:8,borderLeft:'3px solid var(--o)',borderRadius:'0 14px 14px 0'}}>
        <div style={{fontSize:11,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:7}}>Best Protein Sources — {dt.label}</div>
        <div style={{display:'flex',flexWrap:'wrap',gap:5}}>{dt.proteinSources.map(s=><span key={s} style={{padding:'3px 9px',background:'var(--o2)',color:'var(--o)',border:'1px solid rgba(232,84,13,.2)',borderRadius:20,fontSize:11,fontWeight:500}}>{s}</span>)}</div>
      </div>
      <div style={{marginTop:10,padding:'10px 14px',background:'var(--o3)',borderRadius:10,border:'1px solid rgba(232,84,13,.18)',fontSize:11,color:'var(--t2)'}}>
        ✅ <strong style={{color:'var(--o)'}}>Complete Protein Tip:</strong> Combine legumes + grains per meal (dal+rice, chana+roti) to cover all 9 essential amino acids. Whey protein already contains all 9 EAAs in every scoop.
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
  const exN=useMemo(()=>{const n=new Set();ul.filter(l=>!sd||l.dayId===sd).forEach(l=>l.exercises?.forEach(e=>n.add(e.name)));if(sd)days.find(d=>d.id===sd)?.exercises.forEach(e=>n.add(e.name));return[...n];},[sd,ul,days]);
  const cd=useMemo(()=>{if(!se)return[];return ul.filter(l=>!sd||l.dayId===sd).sort((a,b)=>new Date(a.date)-new Date(b.date)).map(log=>{const ex=log.exercises?.find(e=>e.name===se);if(!ex?.sets?.length)return null;const mx=Math.max(...ex.sets.map(s=>s.weight||0));const vol=ex.sets.reduce((a,s)=>a+(s.reps||0)*(s.weight||0),0);const ar=+(ex.sets.reduce((a,s)=>a+(s.reps||0),0)/ex.sets.length).toFixed(1);return{date:fmt(log.date),maxWeight:mx,volume:Math.round(vol),avgReps:ar,sets:ex.sets.length};}).filter(Boolean);},[se,sd,ul]);
  const pr=cd.length?Math.max(...cd.map(d=>d.maxWeight)):0;
  return(
    <div className="pg-in">
      <PH title="Progress Charts" sub="Track your strength gains"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:16}} className="g3">
        <div><label>Split</label><select value={ss} onChange={e=>{setSs(e.target.value);setSd('');setSe('');}}>
          {splits.filter(s=>!s.comingSoon).map(s=><option key={s.id} value={s.id}>{s.emoji} {s.name}</option>)}
        </select></div>
        <div><label>Day</label><select value={sd} onChange={e=>{setSd(e.target.value);setSe('');}}>
          <option value="">All Days</option>{days.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
        </select></div>
        <div><label>Exercise</label><select value={se} onChange={e=>setSe(e.target.value)}>
          <option value="">— Select —</option>{exN.map(n=><option key={n} value={n}>{n}</option>)}
        </select></div>
      </div>
      {se&&cd.length>0?(<>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:14}} className="g3">
          <StatCard label="Personal Record" value={pr} unit="kg" Icon={Trophy}/>
          <StatCard label="Sessions" value={cd.length} unit="" Icon={Activity}/>
          {cd.length>=2&&<StatCard label="Progress" value={`+${(cd[cd.length-1].maxWeight-cd[0].maxWeight).toFixed(1)}`} unit="kg" Icon={TrendingUp}/>}
        </div>
        <div className="bb" style={{fontSize:18,marginBottom:12,color:'var(--o)'}}>{se}</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}} className="g2">
          {[{title:'Max Weight (kg)',key:'maxWeight',type:'area'},{title:'Volume (reps × kg)',key:'volume',type:'bar'},{title:'Avg Reps/Set',key:'avgReps',type:'line'}].map(ch=>(
            <div key={ch.key} className="card" style={{padding:16}}>
              <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:10}}>{ch.title}</div>
              <ResponsiveContainer width="100%" height={160}>
                {ch.type==='area'?(<AreaChart data={cd}><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#E8540D" stopOpacity={.18}/><stop offset="95%" stopColor="#E8540D" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="date" tick={{fill:'var(--t3)',fontSize:9}}/><YAxis tick={{fill:'var(--t3)',fontSize:9}}/><Tooltip contentStyle={{background:'var(--c2)',border:'1px solid var(--bd)',borderRadius:8,fontSize:11}}/><Area type="monotone" dataKey={ch.key} stroke="#E8540D" strokeWidth={2} fill="url(#cg)" dot={{fill:'#E8540D',r:3,strokeWidth:0}}/></AreaChart>)
                :ch.type==='bar'?(<BarChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="date" tick={{fill:'var(--t3)',fontSize:9}}/><YAxis tick={{fill:'var(--t3)',fontSize:9}}/><Tooltip contentStyle={{background:'var(--c2)',border:'1px solid var(--bd)',borderRadius:8,fontSize:11}}/><Bar dataKey={ch.key} fill="#E8540D" radius={[4,4,0,0]} fillOpacity={.8}/></BarChart>)
                :(<LineChart data={cd}><CartesianGrid strokeDasharray="3 3" stroke="var(--bd)"/><XAxis dataKey="date" tick={{fill:'var(--t3)',fontSize:9}}/><YAxis tick={{fill:'var(--t3)',fontSize:9}}/><Tooltip contentStyle={{background:'var(--c2)',border:'1px solid var(--bd)',borderRadius:8,fontSize:11}}/><Line type="monotone" dataKey={ch.key} stroke="#E8540D" strokeWidth={2} dot={{fill:'#E8540D',r:3,strokeWidth:0}}/></LineChart>)}
              </ResponsiveContainer>
            </div>
          ))}
          <div className="card" style={{padding:16}}>
            <div style={{fontSize:10,color:'var(--t3)',fontWeight:700,textTransform:'uppercase',marginBottom:10}}>Session Log</div>
            <div style={{maxHeight:160,overflowY:'auto'}}>
              {[...cd].reverse().map((d,i)=><div key={i} style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--bd)',fontSize:11}}><span style={{color:'var(--t2)'}}>{d.date}</span><span style={{color:'var(--o)',fontWeight:700}}>{d.maxWeight}kg</span><span style={{color:'var(--t2)'}}>{d.sets}×</span><span style={{color:'var(--t2)'}}>{d.avgReps}r</span></div>)}
            </div>
          </div>
        </div>
      </>):(
        <div style={{textAlign:'center',padding:'56px 20px',border:'1px dashed var(--bd)',borderRadius:14}}>
          <TrendingUp size={36} color="var(--t3)" style={{marginBottom:10}}/>
          <div className="bb" style={{fontSize:20,marginBottom:6}}>{se?'No data yet':'Select an exercise'}</div>
          <div style={{fontSize:13,color:'var(--t2)'}}>Log workouts to see strength progression charts</div>
        </div>
      )}
    </div>
  );
};

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
const ContactPage=()=>{
  const [f,setF]=useState({name:'',email:'',phone:'',goal:'',service:'workout',message:''});
  const [sub,setSub]=useState(false);
  const sf=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const SVCS=[{id:'workout',label:'Custom Workout Plan',Icon:Dumbbell,price:'₹2,000'},{id:'diet',label:'Custom Diet Plan',Icon:Salad,price:'₹3,000'},{id:'combo',label:'Workout + Diet',Icon:TrendingUp,price:'₹4,500'},{id:'coaching',label:'Online Coaching',Icon:Trophy,price:'Enquire'}];
  const send=()=>{if(!f.name||!f.email)return;const svc=SVCS.find(s=>s.id===f.service);window.open(`mailto:vishalchaudhary28@gmail.com?subject=${encodeURIComponent(`FitTrack — ${svc.label} from ${f.name}`)}&body=${encodeURIComponent(`Name: ${f.name}\nEmail: ${f.email}\nPhone: ${f.phone||'—'}\nService: ${svc.label} (${svc.price})\nGoal: ${f.goal||'—'}\n\n${f.message}`)}`);setSub(true);};
  if(sub)return(<div className="pg-in" style={{textAlign:'center',padding:'80px 20px'}}><Mail size={48} color="var(--o)" style={{marginBottom:14}}/><div className="bb" style={{fontSize:34,color:'var(--o)'}}>MESSAGE SENT!</div><div style={{color:'var(--t2)',marginTop:8,marginBottom:28}}>Vishal will respond within 24 hours.</div><button className="btn-p" style={{padding:'12px 26px'}} onClick={()=>setSub(false)}>Send Another</button></div>);
  return(
    <div className="pg-in">
      <PH title="Work With Me" sub="Custom plans crafted for your body & goals"/>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10,marginBottom:18}} className="g2">
        {SVCS.map(({id,label,Icon,price})=>(
          <div key={id} className="card" style={{padding:18,cursor:'pointer',transition:'all .2s',border:`1px solid ${f.service===id?'var(--o)':'var(--bd)'}`,background:f.service===id?'var(--o2)':'var(--c1)'}}
            onClick={()=>setF(p=>({...p,service:id}))} onMouseEnter={e=>e.currentTarget.style.borderColor='var(--o)'} onMouseLeave={e=>e.currentTarget.style.borderColor=f.service===id?'var(--o)':'var(--bd)'}>
            <div style={{width:34,height:34,borderRadius:9,background:'var(--o2)',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:10}}><Icon size={15} color="var(--o)"/></div>
            <div className="bb" style={{fontSize:16,letterSpacing:'1px',marginBottom:4}}>{label}</div>
            <div className="bb" style={{fontSize:22,color:'var(--o)'}}>{price}</div>
            {id==='coaching'&&<div style={{fontSize:10,color:'var(--t3)',marginTop:4}}>Fill form below</div>}
            {f.service===id&&<div style={{marginTop:8}}><span className="tag" style={{fontSize:8}}><Check size={8}/> Selected</span></div>}
          </div>
        ))}
      </div>
      <div className="card" style={{padding:22}}>
        <div className="bb" style={{fontSize:22,marginBottom:4}}>Get In Touch</div>
        <div className="abar"/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12,marginBottom:12}} className="g2">
          <div><label>Full Name *</label><input placeholder="Your name" value={f.name} onChange={sf('name')}/></div>
          <div><label>Email *</label><input type="email" placeholder="you@email.com" value={f.email} onChange={sf('email')}/></div>
          <div><label>Phone / WhatsApp</label><input placeholder="+91 98765 43210" value={f.phone} onChange={sf('phone')}/></div>
          <div><label>Primary Goal</label><select value={f.goal} onChange={sf('goal')}><option value="">Select goal</option><option>Weight Loss</option><option>Muscle Building</option><option>Athletic Performance</option><option>General Fitness</option><option>Body Recomposition</option><option>Injury Recovery</option></select></div>
        </div>
        <div style={{marginBottom:14}}><label>About you & your goals</label><textarea rows={4} placeholder="Current weight, training experience, dietary preferences, schedule..." value={f.message} onChange={sf('message')} style={{resize:'vertical'}}/></div>
        <button className="btn-p" style={{padding:'13px 26px',fontSize:15}} onClick={send} disabled={!f.name||!f.email}>Send Inquiry →</button>
        <div style={{marginTop:8,fontSize:10,color:'var(--t3)'}}>Opens your email app pre-filled to vishalchaudhary28@gmail.com</div>
      </div>
    </div>
  );
};

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
const ProfilePage=({user,setUsers,onLogout})=>{
  const [ed,setEd]=useState(false);
  const [f,setF]=useState({...user});
  const sf=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const save=()=>{setUsers(p=>p.map(u=>u.id===user.id?{...u,...f,weight:parseFloat(f.weight),height:parseFloat(f.height),age:parseInt(f.age),workoutDays:parseInt(f.workoutDays),weightGoal:f.weightGoal?parseFloat(f.weightGoal):null}:u));setEd(false);};
  const bmi=calcBMI(user.weight,user.height);
  const bmr=calcBMR(user.weight,user.height,user.age,user.gender);
  const tdee=calcTDEE(bmr,user.activityLevel||'moderate');
  return(
    <div className="pg-in">
      <PH title="My Profile"/>
      <div style={{display:'grid',gridTemplateColumns:'230px 1fr',gap:14}} className="g2">
        <div className="card" style={{padding:22,textAlign:'center',height:'fit-content'}}>
          <div style={{width:66,height:66,borderRadius:'50%',background:'var(--og)',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 12px',fontFamily:"'Bebas Neue'",fontSize:24,color:'#fff',letterSpacing:'2px'}}>{user.avatar}</div>
          <div className="bb" style={{fontSize:18}}>{user.name}</div>
          {user.isAdmin&&<div style={{marginTop:5}}><span className="tag" style={{fontSize:8}}>⚡ Admin</span></div>}
          <div style={{fontSize:10,color:'var(--t3)',marginTop:5}}>Since {fmt(user.joinDate)}</div>
          <div style={{height:1,background:'var(--bd)',margin:'14px 0'}}/>
          <div className="bb" style={{fontSize:50,color:'var(--o)',lineHeight:1}}>{bmi}</div>
          <span className="tag" style={{marginTop:6,display:'inline-flex',fontSize:9}}>{getBMICat(bmi).label} BMI</span>
          <div style={{marginTop:12,display:'grid',gridTemplateColumns:'1fr 1fr',gap:7}}>
            {[{l:'BMR',v:bmr,u:'kcal'},{l:'TDEE',v:tdee,u:'kcal'}].map(m=>(
              <div key={m.l} style={{padding:'8px',background:'var(--c2)',borderRadius:8,border:'1px solid var(--bd)'}}>
                <div style={{fontSize:9,color:'var(--t3)',fontWeight:700}}>{m.l}</div>
                <div className="bb" style={{fontSize:18,color:'var(--o)'}}>{m.v}</div>
                <div style={{fontSize:9,color:'var(--t3)'}}>{m.u}</div>
              </div>
            ))}
          </div>
          <button className="btn-d" style={{marginTop:14,width:'100%',display:'flex',alignItems:'center',justifyContent:'center',gap:6,borderRadius:10,padding:'10px'}} onClick={onLogout}><LogOut size={13}/> Logout</button>
        </div>
        <div className="card" style={{padding:22}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:14}}>
            <div className="bb" style={{fontSize:20}}>Personal Details</div>
            <button className="btn-g" style={{fontSize:12}} onClick={()=>ed?save():setEd(true)}>{ed?'✓ Save':'✏️ Edit'}</button>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            {[{l:'Full Name',k:'name',t:'text'},{l:'Age',k:'age',t:'number'},{l:'Email',k:'email',t:'email'},{l:'Weight (kg)',k:'weight',t:'number'},{l:'Height (cm)',k:'height',t:'number'},{l:'Weight Goal (kg)',k:'weightGoal',t:'number'},{l:'Workout Days/Week',k:'workoutDays',t:'number'}].map(fld=>(
              <div key={fld.k}><label>{fld.l}</label>{ed?<input type={fld.t} value={f[fld.k]||''} onChange={sf(fld.k)}/>:<div style={{padding:'10px 13px',background:'var(--c3)',borderRadius:10,fontSize:14,border:'1px solid var(--bd)',color:fld.k==='weightGoal'&&!user[fld.k]?'var(--t3)':'var(--tx)'}}>{user[fld.k]?String(user[fld.k]):'Not set'}</div>}</div>
            ))}
            <div><label>Gender</label>{ed?<select value={f.gender} onChange={sf('gender')}><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option></select>:<div style={{padding:'10px 13px',background:'var(--c3)',borderRadius:10,fontSize:14,border:'1px solid var(--bd)'}}>{user.gender}</div>}</div>
            <div><label>Activity Level</label>{ed?<select value={f.activityLevel} onChange={sf('activityLevel')}>{Object.entries(ACTIVITY).map(([k,v])=><option key={k} value={k}>{v.label}</option>)}</select>:<div style={{padding:'10px 13px',background:'var(--c3)',borderRadius:10,fontSize:13,border:'1px solid var(--bd)',color:'var(--t2)'}}>{ACTIVITY[user.activityLevel||'moderate']?.label}</div>}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── NAV CONFIG ───────────────────────────────────────────────────────────────
const NAV=[
  {id:'dashboard',label:'Home',      Icon:LayoutDashboard},
  {id:'splits',   label:'Splits',    Icon:Dumbbell},
  {id:'workout',  label:'Tracker',   Icon:Target},
  {id:'diet',     label:'Diet',      Icon:Salad},
  {id:'progress', label:'Progress',  Icon:TrendingUp},
  {id:'contact',  label:'Coaching',  Icon:Mail},
  {id:'profile',  label:'Profile',   Icon:User},
];

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App(){
  const [users,setUsers]    = useState(INIT_USERS);
  const [uid,setUid]        = useState(null);
  const [page,setPage]      = useState('dashboard');
  const [exiting,setExiting]= useState(false);
  const [splits,setSplits]  = useState(INIT_SPLITS);
  const [hl,setHl]          = useState(SAMPLE.hl);
  const [wl,setWl]          = useState(SAMPLE.wl);
  const [sb,setSb]          = useState(true);

  const user=uid?users.find(u=>u.id===uid):null;
  const login=u=>{setUid(u.id);setPage('dashboard');};
  const logout=()=>{setUid(null);setPage('dashboard');};
  const setAS=id=>setUsers(p=>p.map(u=>u.id===uid?{...u,activeSplitId:id}:u));

  const navigate=useCallback(to=>{
    if(to===page||exiting)return;
    setExiting(true);
    setTimeout(()=>{setPage(to);setExiting(false);},160);
  },[page,exiting]);

  if(!user) return <><GS/><AuthModal users={users} setUsers={setUsers} onLogin={login}/></>;

  const props={user,splits,setSplits,workoutLogs:wl,setWorkoutLogs:setWl,healthLogs:hl,setHealthLogs:setHl,setUsers};
  const renderPage=()=>{
    switch(page){
      case 'dashboard': return <DashboardPage {...props}/>;
      case 'splits':    return <SplitsPage {...props} setActiveSplitId={setAS} setPage={navigate} isAdmin={user.isAdmin}/>;
      case 'workout':   return <WorkoutPage {...props}/>;
      case 'diet':      return <DietPage user={user}/>;
      case 'progress':  return <ProgressPage {...props}/>;
      case 'contact':   return <ContactPage/>;
      case 'profile':   return <ProfilePage user={user} setUsers={setUsers} onLogout={logout}/>;
      default: return null;
    }
  };

  return(
    <>
      <GS/>
      <div style={{display:'flex',minHeight:'100vh'}}>
        {/* Desktop Sidebar */}
        <div className="ds" style={{width:sb?220:54,background:'#0F0F11',borderRight:'1px solid var(--bd)',display:'flex',flexDirection:'column',transition:'width .22s cubic-bezier(.4,0,.2,1)',flexShrink:0,position:'sticky',top:0,height:'100vh',overflow:'hidden'}}>
          <div style={{padding:'16px 12px',borderBottom:'1px solid var(--bd)',display:'flex',alignItems:'center',gap:9,cursor:'pointer'}} onClick={()=>setSb(!sb)}>
            <div style={{width:30,height:30,borderRadius:8,background:'var(--og)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}><Dumbbell size={15} color="#fff"/></div>
            {sb&&<div className="bb" style={{fontSize:16,letterSpacing:'2px',color:'var(--o)',whiteSpace:'nowrap'}}>FITTRACK PRO</div>}
          </div>
          {sb&&<div style={{padding:'11px 12px',borderBottom:'1px solid var(--bd)',display:'flex',gap:9,alignItems:'center'}}>
            <div style={{width:30,height:30,borderRadius:'50%',background:'var(--og)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Bebas Neue'",color:'#fff',fontSize:12,flexShrink:0}}>{user.avatar}</div>
            <div style={{overflow:'hidden'}}><div style={{fontSize:12,fontWeight:600,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{user.name}</div><div style={{fontSize:9,color:'var(--t3)'}}>{user.isAdmin?'⚡ Admin':'Member'}</div></div>
          </div>}
          <nav style={{padding:'7px 5px',flex:1,overflowY:'auto'}}>
            {NAV.map(({id,label,Icon})=>(
              <div key={id} className={`ni ${page===id?'act':''}`} onClick={()=>navigate(id)} title={!sb?label:''} style={{justifyContent:sb?'flex-start':'center'}}>
                <Icon size={16}/>{sb&&<span>{label}</span>}
              </div>
            ))}
          </nav>
          {sb&&<div style={{padding:'10px 14px',borderTop:'1px solid var(--bd)',fontSize:9,color:'var(--t3)'}}>FitTrack Pro v4.0</div>}
        </div>

        {/* Main Content */}
        <main className="mc" style={{flex:1,padding:'22px 24px',overflowY:'auto'}}>
          <div className={exiting?'pg-out':'pg-in'} key={page}>
            {renderPage()}
          </div>
        </main>

        {/* Mobile Bottom Nav — all 7 pages */}
        <nav className="bn">
          {NAV.map(({id,label,Icon})=>(
            <button key={id} onClick={()=>navigate(id)} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:2,background:'none',border:'none',cursor:'pointer',padding:'5px 2px',color:page===id?'var(--o)':'var(--t3)',transition:'color .15s',minWidth:0}}>
              <Icon size={18}/>
              <span style={{fontSize:8,fontWeight:700,letterSpacing:'.3px',textTransform:'uppercase',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',maxWidth:'100%'}}>{label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}