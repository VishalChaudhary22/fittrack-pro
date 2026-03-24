import { useMemo, useEffect, useRef, useState } from 'react';

/* ─────────────────────────────────────────────────────────────────────────────
   CANVAS-BASED MUSCLE MAP — Getty/pop_jop style

   Uses pre-generated anatomical illustrations per muscle group.
   Base image shows all muscles in teal-blue.
   Trained muscles use their corresponding highlight images (where only that
   muscle is colored coral-red).
   
   To avoid CSS blend mode color mixing (which causes pinkish hues), we use
   HTML5 Canvas to extract only the red/coral pixels from the highlight layers
   and draw them precisely over the base image.
   ───────────────────────────────────────────────────────────────────────────── */

const MUSCLE_IMAGES = {
  // Front view muscles
  shoulders:  { view: 'front', file: 'front-shoulders.png' },
  chest:      { view: 'front', file: 'front-chest.png' },
  abs:        { view: 'front', file: 'front-abs.png' },
  biceps:     { view: 'front', file: 'front-biceps.png' },
  forearms:   { view: 'front', file: 'front-forearms.png' },
  quads:      { view: 'front', file: 'front-quads.png' },
  calves:     { view: 'front', file: 'front-calves.png' },
  // Back view muscles
  traps:      { view: 'back',  file: 'back-traps.png' },
  back:       { view: 'back',  file: 'back-back.png' },
  triceps:    { view: 'back',  file: 'back-triceps.png' },
  glutes:     { view: 'back',  file: 'back-glutes.png' },
  hamstrings: { view: 'back',  file: 'back-hamstrings.png' },
};

const BACK_SHOULDER_IMG = 'back-shoulders.png';

// ─── BACKGROUND STRIP (fixes AI-generated PNGs with baked-in checkerboard) ──
const stripBackground = (ctx, w, h) => {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const r = d[i], g = d[i+1], b = d[i+2];
    // Strip near-white / light-grey checkerboard pixels (desaturated & bright)
    if (r > 180 && g > 180 && b > 180 && Math.abs(r - g) < 30 && Math.abs(g - b) < 30) {
      d[i+3] = 0;
    }
    // Strip near-black text / label pixels (dark & desaturated)
    if (r < 60 && g < 60 && b < 60) {
      d[i+3] = 0;
    }
  }
  ctx.putImageData(imgData, 0, 0);
};

// ─── CANVAS COMPONENT ────────────────────────────────────────────────────────
const CanvasBodyMap = ({ baseSrc, layerSrcs = [], secondaryLayerSrcs = [], label, borderRadius = 8 }) => {
  const canvasRef = useRef(null);
  const [loadError, setLoadError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError(false);

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const loadImg = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        const dummy = new Image();
        dummy.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        dummy.onload = () => resolve(dummy);
      };
      img.src = src;
    });

    Promise.all([
      loadImg(baseSrc),
      ...layerSrcs.map(loadImg),
      ...secondaryLayerSrcs.map(loadImg)
    ]).then(([baseImg, ...allLayerImgs]) => {
      if (!active) return;
      
      // If base image is the 1x1 dummy, treat as an error
      if (baseImg.width <= 1 || baseImg.height <= 1) {
        setLoadError(true);
        setLoading(false);
        return;
      }
      
      canvas.width = baseImg.width || 800;
      canvas.height = baseImg.height || 800;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImg, 0, 0);
      
      // Strip baked-in checkered background & text labels from AI-generated female PNGs
      const isFemale = baseSrc.includes('/female/');
      if (isFemale) stripBackground(ctx, canvas.width, canvas.height);
      
      if (allLayerImgs.length === 0) {
        setLoading(false);
        return;
      }

      const primaryImgs = allLayerImgs.slice(0, layerSrcs.length);
      const secondaryImgs = allLayerImgs.slice(layerSrcs.length);

      const baseData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      const processLayer = (img, isSecondary) => {
        offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
        offCtx.drawImage(img, 0, 0);
        if (isFemale) stripBackground(offCtx, offCanvas.width, offCanvas.height);
        const layerData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        
        for (let i = 0; i < layerData.data.length; i += 4) {
          const r = layerData.data[i];
          const g = layerData.data[i+1];
          const b = layerData.data[i+2];
          const a = layerData.data[i+3];
          
          if (r > 130 && r > g + 20 && r > b + 20 && a > 0) {
            if (isSecondary) {
              const alpha = 0.4;
              baseData.data[i]   = Math.round(r * alpha + baseData.data[i] * (1 - alpha));
              baseData.data[i+1] = Math.round(g * alpha + baseData.data[i+1] * (1 - alpha));
              baseData.data[i+2] = Math.round(b * alpha + baseData.data[i+2] * (1 - alpha));
            } else {
              baseData.data[i] = r;
              baseData.data[i+1] = g;
              baseData.data[i+2] = b;
              baseData.data[i+3] = a;
            }
          }
        }
      };

      // Draw secondary layers first, then primary on top
      secondaryImgs.forEach(img => processLayer(img, true));
      primaryImgs.forEach(img => processLayer(img, false));
      
      ctx.putImageData(baseData, 0, 0);
      setLoading(false);
    }).catch(err => {
      console.error("Canvas compositing error:", err);
      setLoadError(true);
      setLoading(false);
    });

    return () => { active = false; };
  }, [baseSrc, layerSrcs, secondaryLayerSrcs]);

  if (loadError) return (
    <div style={{
      width: '100%', aspectRatio: '1/2', borderRadius,
      background: 'var(--c3)', border: '1px dashed var(--bd2)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 6,
    }}>
      {label && <div style={{ fontSize: 9, color: 'var(--t3)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{label}</div>}
      <div style={{ fontSize: 10, color: 'var(--t3)' }}>Image unavailable</div>
    </div>
  );

  return (
    <div style={{ textAlign: 'center', width: '100%' }}>
      {label && (
        <div style={{
          fontSize: 9, color: 'var(--t3)', fontWeight: 700,
          textTransform: 'uppercase', marginBottom: 6, letterSpacing: '1.5px',
        }}>{label}</div>
      )}
      <canvas
        ref={canvasRef}
        style={{ 
          width: '100%', 
          height: 'auto', 
          display: 'block', 
          borderRadius: borderRadius,
          backgroundColor: 'transparent'
        }}
      />
    </div>
  );
};

// ─── EXPORTED MAIN COMPONENT ─────────────────────────────────────────────────
export default function BodyMapSVG({ muscleXP = {}, primaryMuscles = null, secondaryMuscles = null, mini = false, gender = 'male' }) {
  const getAssetUrl = (file) => gender === 'female' ? `/muscles/female/female-${file}` : `/muscles/${file}`;

  const { pMuscles, sMuscles } = useMemo(() => {
    if (primaryMuscles || secondaryMuscles) {
      return { pMuscles: primaryMuscles || [], sMuscles: secondaryMuscles || [] };
    }
    // Fallback: use all active from muscleXP as primary if specific lists aren't provided
    return { 
      pMuscles: Object.entries(muscleXP).filter(([, xp]) => xp > 0).map(([k]) => k),
      sMuscles: []
    };
  }, [muscleXP, primaryMuscles, secondaryMuscles]);

  const mapToLayers = (muscles) => {
    const front = [];
    const back = [];
    muscles.forEach(muscle => {
      const info = MUSCLE_IMAGES[muscle];
      if (info) {
        if (info.view === 'front') front.push(getAssetUrl(info.file));
        if (info.view === 'back') back.push(getAssetUrl(info.file));
      }
      if (muscle === 'shoulders') {
        const bg = getAssetUrl(BACK_SHOULDER_IMG);
        if (!back.includes(bg)) back.push(bg);
      }
    });
    return { frontLayers: front, backLayers: back };
  };

  const { frontLayers, backLayers } = useMemo(() => mapToLayers(pMuscles), [pMuscles, gender]);
  const { frontLayers: frontSecondary, backLayers: backSecondary } = useMemo(() => mapToLayers(sMuscles), [sMuscles, gender]);

  if (mini) {
    return (
      <div style={{ width: 55, height: 'auto', flexShrink: 0 }}>
        <CanvasBodyMap 
          baseSrc={getAssetUrl('front-base.png')} 
          layerSrcs={frontLayers} 
          secondaryLayerSrcs={frontSecondary}
          borderRadius={6}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 auto', width: '42%', maxWidth: 180 }}>
        <CanvasBodyMap 
          baseSrc={getAssetUrl('front-base.png')} 
          layerSrcs={frontLayers} 
          secondaryLayerSrcs={frontSecondary}
          label="Front" 
        />
      </div>
      <div style={{ flex: '0 0 auto', width: '42%', maxWidth: 180 }}>
        <CanvasBodyMap 
          baseSrc={getAssetUrl('back-base.png')} 
          layerSrcs={backLayers} 
          secondaryLayerSrcs={backSecondary}
          label="Back" 
        />
      </div>
    </div>
  );
}

// ─── MINI VERSION FOR DASHBOARD ──────────────────────────────────────────────
export const MiniBodyMap = ({ weeklyMuscles = [], gender = 'male' }) => {
  const getAssetUrl = (file) => gender === 'female' ? `/muscles/female/female-${file}` : `/muscles/${file}`;

  const frontLayers = useMemo(() => {
    return weeklyMuscles
      .map(m => MUSCLE_IMAGES[m])
      .filter(info => info && info.view === 'front')
      .map(info => getAssetUrl(info.file));
  }, [weeklyMuscles, gender]);

  return (
    <div style={{ width: 50, height: 'auto', flexShrink: 0 }}>
      <CanvasBodyMap 
        baseSrc={getAssetUrl('front-base.png')} 
        layerSrcs={frontLayers} 
        borderRadius={6}
      />
    </div>
  );
};
