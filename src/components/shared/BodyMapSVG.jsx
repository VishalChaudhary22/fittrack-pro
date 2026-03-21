import { useMemo, useEffect, useRef } from 'react';

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
  shoulders:  { view: 'front', file: '/muscles/front-shoulders.png' },
  chest:      { view: 'front', file: '/muscles/front-chest.png' },
  abs:        { view: 'front', file: '/muscles/front-abs.png' },
  biceps:     { view: 'front', file: '/muscles/front-biceps.png' },
  forearms:   { view: 'front', file: '/muscles/front-forearms.png' },
  quads:      { view: 'front', file: '/muscles/front-quads.png' },
  calves:     { view: 'front', file: '/muscles/front-calves.png' },
  // Back view muscles
  traps:      { view: 'back',  file: '/muscles/back-traps.png' },
  back:       { view: 'back',  file: '/muscles/back-back.png' },
  triceps:    { view: 'back',  file: '/muscles/back-triceps.png' },
  glutes:     { view: 'back',  file: '/muscles/back-glutes.png' },
  hamstrings: { view: 'back',  file: '/muscles/back-hamstrings.png' },
};

const BACK_SHOULDER_IMG = '/muscles/back-shoulders.png';

// ─── CANVAS COMPONENT ────────────────────────────────────────────────────────
const CanvasBodyMap = ({ baseSrc, layerSrcs, label, borderRadius = 8 }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let active = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    const loadImg = (src) => new Promise((resolve, reject) => {
      const img = new Image();
      // Ensure cross-origin is set for local dev / prod
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`Failed to load image: ${src}`);
        // Return a dummy small transparent image instead of crashing
        const dummy = new Image();
        dummy.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        dummy.onload = () => resolve(dummy);
      };
      img.src = src;
    });

    // Load base and all active layers
    Promise.all([
      loadImg(baseSrc),
      ...layerSrcs.map(loadImg)
    ]).then(([baseImg, ...layerImgs]) => {
      if (!active) return;
      
      // Set canvas size to match the original image resolution
      canvas.width = baseImg.width || 800;
      canvas.height = baseImg.height || 800;
      
      // Draw base image
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(baseImg, 0, 0);
      
      if (layerImgs.length === 0) return; // No active muscles to draw

      const baseData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      
      // Offscreen canvas for processing layers
      const offCanvas = document.createElement('canvas');
      offCanvas.width = canvas.width;
      offCanvas.height = canvas.height;
      const offCtx = offCanvas.getContext('2d', { willReadFrequently: true });

      layerImgs.forEach(img => {
        offCtx.clearRect(0, 0, offCanvas.width, offCanvas.height);
        offCtx.drawImage(img, 0, 0);
        const layerData = offCtx.getImageData(0, 0, offCanvas.width, offCanvas.height);
        
        // Composite only the coral/red pixels
        // Base Teal: R~107, G~155, B~173
        // Coral Highlight: R~232, G~84, B~13
        for (let i = 0; i < layerData.data.length; i += 4) {
          const r = layerData.data[i];
          const g = layerData.data[i+1];
          const b = layerData.data[i+2];
          const a = layerData.data[i+3];
          
          // Check if pixel is prominently red (red channel is high and greater than green and blue)
          // Also added a slight anti-aliasing edge detection by catching lighter reds
          if (r > 130 && r > g + 20 && r > b + 20 && a > 0) {
            baseData.data[i] = r;
            baseData.data[i+1] = g;
            baseData.data[i+2] = b;
            baseData.data[i+3] = a;
          }
        }
      });
      
      // Put updated data back to the visible canvas
      ctx.putImageData(baseData, 0, 0);
    }).catch(err => console.error("Canvas compositing error:", err));

    return () => { active = false; };
  }, [baseSrc, layerSrcs]);

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
export default function BodyMapSVG({ muscleXP = {}, mini = false }) {
  // Determine which muscles have XP (are active/trained)
  const activeMuscles = useMemo(
    () => Object.entries(muscleXP).filter(([, xp]) => xp > 0).map(([k]) => k),
    [muscleXP]
  );

  // Group active layers by view
  const { frontLayers, backLayers } = useMemo(() => {
    const front = [];
    const back = [];
    
    activeMuscles.forEach(muscle => {
      const info = MUSCLE_IMAGES[muscle];
      if (info) {
        if (info.view === 'front') front.push(info.file);
        if (info.view === 'back') back.push(info.file);
      }
      
      // Special case: shoulders wrap to both front and back views
      if (muscle === 'shoulders') {
        if (!back.includes(BACK_SHOULDER_IMG)) back.push(BACK_SHOULDER_IMG);
      }
    });
    
    return { frontLayers: front, backLayers: back };
  }, [activeMuscles]);

  if (mini) {
    return (
      <div style={{ width: 55, height: 'auto', flexShrink: 0 }}>
        <CanvasBodyMap 
          baseSrc="/muscles/front-base.png" 
          layerSrcs={frontLayers} 
          borderRadius={6}
        />
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'flex-start' }}>
      <div style={{ flex: '0 0 auto', width: '42%', maxWidth: 180 }}>
        <CanvasBodyMap 
          baseSrc="/muscles/front-base.png" 
          layerSrcs={frontLayers} 
          label="Front" 
        />
      </div>
      <div style={{ flex: '0 0 auto', width: '42%', maxWidth: 180 }}>
        <CanvasBodyMap 
          baseSrc="/muscles/back-base.png" 
          layerSrcs={backLayers} 
          label="Back" 
        />
      </div>
    </div>
  );
}

// ─── MINI VERSION FOR DASHBOARD ──────────────────────────────────────────────
export const MiniBodyMap = ({ weeklyMuscles = [] }) => {
  const frontLayers = useMemo(() => {
    return weeklyMuscles
      .map(m => MUSCLE_IMAGES[m])
      .filter(info => info && info.view === 'front')
      .map(info => info.file);
  }, [weeklyMuscles]);

  return (
    <div style={{ width: 50, height: 'auto', flexShrink: 0 }}>
      <CanvasBodyMap 
        baseSrc="/muscles/front-base.png" 
        layerSrcs={frontLayers} 
        borderRadius={6}
      />
    </div>
  );
};
