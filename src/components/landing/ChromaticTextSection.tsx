import { useRef, useEffect, useState } from 'react';
import WebGLFluid from 'webgl-fluid';

export default function ChromaticTextSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInteracted, setIsInteracted] = useState(false);
  const isInitialized = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const canvas = canvasRef.current;
    if (!canvas || isInitialized.current) return;

    try {
      WebGLFluid(canvas, {
        IMMEDIATE: false,
        TRIGGER: 'hover',
        AUTO: false,
        INTERVAL: 3000,
        SIM_RESOLUTION: 128,
        DYE_RESOLUTION: 1024,
        CAPTURE_RESOLUTION: 512,
        DENSITY_DISSIPATION: 2.4,
        VELOCITY_DISSIPATION: 1.8,
        PRESSURE: 0.8,
        PRESSURE_ITERATIONS: 20,
        CURL: 38,
        SPLAT_RADIUS: 0.2,
        SPLAT_FORCE: 6000,
        SHADING: true,
        COLORFUL: true,
        COLOR_UPDATE_SPEED: 8,
        PAUSED: false,
        BACK_COLOR: { r: 0, g: 0, b: 0 },
        TRANSPARENT: false,
        BLOOM: true,
        BLOOM_ITERATIONS: 6,
        BLOOM_RESOLUTION: 256,
        BLOOM_INTENSITY: 0.7,
        BLOOM_THRESHOLD: 0.65,
        BLOOM_SOFT_KNEE: 0.8,
        SUNRAYS: false,
      });
      isInitialized.current = true;
    } catch (err) {
      console.warn('Failed to initialize webgl-fluid:', err);
    }
  }, []);

  const handlePointerEnter = () => {
    if (!isInteracted) {
      setIsInteracted(true);
    }
  };

  return (
    <section
      id="screen-2-chromatic"
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      className="relative w-full h-[100vh] min-h-[700px] flex flex-col items-center justify-center select-none overflow-hidden cursor-crosshair z-20 bg-black"
      style={{
        backgroundColor: '#000000',
      }}
    >
      {/* Geek Corner Markers */}
      <div className="absolute top-8 left-8 text-[11px] font-mono tracking-widest text-white/30 pointer-events-none flex items-center gap-2">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-accent-cobaltLight animate-pulse" />
        <span>[ 02 / FLUID DYNAMICS SHEEN ]</span>
      </div>

      <div className="absolute top-8 right-8 text-[11px] font-mono tracking-widest text-white/30 pointer-events-none hidden sm:block">
        <span>NAVIER-STOKES · 60FPS</span>
      </div>

      <div className="absolute bottom-8 left-8 text-[11px] font-mono tracking-widest text-white/20 pointer-events-none hidden md:block">
        <span>SPEC: 38 CURL · 0.08 SPLAT · OUTLINE CAVITY CONFINEMENT</span>
      </div>

      {/* ========================================================================= */}
      {/* Hollow Outline Typography Container with Confined Fluid Smoke              */}
      {/* 1. Canvas runs underneath, strictly sized to the monumental lettering box */}
      {/* 2. SVG punchout plate hides all smoke outside the letters                  */}
      {/* 3. Metallic bevel stroke outlines each letter (NO solid body fill)         */}
      {/* ========================================================================= */}
      <div className="relative w-full max-w-[1360px] px-4 sm:px-6 aspect-[1200/360] flex items-center justify-center select-none">
        {/* Realtime WebGL Fluid Dynamic Canvas (underneath, responsive to cursor) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full z-10 pointer-events-auto cursor-crosshair"
          style={{ touchAction: 'none' }}
        />

        {/* SVG Punchout Mask & Metallic Outline Border Overlay */}
        <svg
          className="absolute inset-0 w-full h-full z-20 pointer-events-none select-none"
          viewBox="0 0 1200 360"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>HANQIN Wireframe Typography</title>
          <defs>
            {/* Punchout Mask: white background (covers canvas), black text (transparent hole revealing fluid smoke) */}
            <mask
              id="letter-knockout-mask"
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1200"
              height="360"
            >
              <rect x="0" y="0" width="1200" height="360" fill="#ffffff" />
              <text
                x="600"
                y="235"
                textAnchor="middle"
                fontSize="260"
                fontWeight="900"
                letterSpacing="-8"
                fontFamily="'Inter', 'Helvetica Neue', system-ui, -apple-system, sans-serif"
                fill="#000000"
              >
                HANQIN
              </text>
            </mask>

            {/* Subdued Dark Stealth Rim Gradient: seamlessly blends into obsidian background */}
            <linearGradient id="titanium-rim-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3c495e" stopOpacity="0.45" />
              <stop offset="45%" stopColor="#252f3f" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#141822" stopOpacity="0.15" />
            </linearGradient>

            {/* Clean Hairline Perimeter Filter: 1.4px fine trace */}
            <filter id="clean-unified-outline" x="-10%" y="-10%" width="120%" height="120%">
              <feMorphology in="SourceAlpha" operator="erode" radius="1.4" result="eroded" />
              <feComposite in="SourceGraphic" in2="eroded" operator="out" />
            </filter>
          </defs>

          {/* Black Plate with Letter Punchouts (Conceals any fluid smoke outside the letters) */}
          <rect
            x="0"
            y="0"
            width="1200"
            height="360"
            fill="#000000"
            mask="url(#letter-knockout-mask)"
          />

          {/* Faint Stealth Hairline Outline (subtle, ghostly watermark integrated into background) */}
          <text
            x="600"
            y="235"
            textAnchor="middle"
            fontSize="260"
            fontWeight="900"
            letterSpacing="-8"
            fontFamily="'Inter', 'Helvetica Neue', system-ui, -apple-system, sans-serif"
            fill="url(#titanium-rim-grad)"
            filter="url(#clean-unified-outline)"
            opacity="0.65"
          >
            HANQIN
          </text>
        </svg>
      </div>

      {/* ========================================================================= */}
      {/* 3. Minimalist Interactive Hover Prompt                                     */}
      {/* ========================================================================= */}
      {!isInteracted && (
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 pointer-events-none animate-pulse z-30">
          <span className="px-6 py-2 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 text-[11px] font-mono tracking-widest text-white/60 shadow-2xl">
            [ SWEEP CURSOR ACROSS HANQIN ]
          </span>
        </div>
      )}
    </section>
  );
}
